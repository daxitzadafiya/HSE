<template>
  <div>
    <v-dialog v-model="openPopup" max-width="800px" persistent>
      <v-card>
        <v-card-text>
          <div class="popup-header text-center">
            {{ formTitle }}
          </div>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <b-row align-h="center">
              <b-col cols="6">
                <div class="input-wrap">
                  <v-text-field
                    v-model="editedItem.name"
                    :label="$t('form.name')"
                    :rules="required"
                    outlined
                    :readonly="editedItem.added_by === 1"
                  />
                </div>
              </b-col>
              <b-col cols="6">
                <div class="input-wrap">
                  <v-text-field
                    v-if="editMode"
                    v-model="editedItem.role_name"
                    :label="$t('form.role')"
                    :rules="required"
                    readonly
                    outlined
                  />
                  <v-select
                    v-else
                    v-model="editedItem.role_id"
                    item-text="name"
                    item-value="id"
                    :label="$t('form.role')"
                    :items="rolesArray"
                    outlined
                    :rules="required"
                    @change="chooseJobTitleRole"
                  />
                </div>
              </b-col>
            </b-row>
            <b-row v-if="userRoleId === 1">
              <b-col cols="12">
                <div class="input-wrap industry-select-input-wrap">
                  <MultipleSelection
                    :selected-items-input="editedItem.industry_id_arr"
                    :label="$t('form.industry')"
                    :item-text="'name'"
                    :item-value="'id'"
                    :list-option-input="industryArray"
                    :request-required="true"
                    @getSelectedItems="getSelectedIndustryItems"
                  />
                </div>
              </b-col>
            </b-row>
            <b-row v-else>
              <b-col v-if="!editMode || editedItem.parent_id" cols="6">
                <div class="input-wrap">
                  <v-select
                    v-model="editedItem.parent_id"
                    item-text="name"
                    item-value="id"
                    :label="$t('form.job_title_resource')"
                    :items="jobTitleResourceArray"
                    outlined
                    :readonly="editMode"
                    @change="chooseJobTitleResource"
                  />
                </div>
              </b-col>
              <b-col>
                <div class="input-wrap custom-min-height-auto">
                  <MultipleSelection
                    :selected-items-input="editedItem.department"
                    :item-text="'name'"
                    :item-value="'id'"
                    :label="$t('form.department')"
                    :list-option-input="departmentsArray"
                    @getSelectedItems="getSelectedDepartmentItem"
                  />
                </div>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="6" class="mb-7">
                <div class="input-wrap d-flex">
                  <v-checkbox
                    v-model="editedItem.is_super"
                    :label="$t('form.is_this_super_user')"
                    class="margin-right-sm mt-0"
                    :hide-details="true"
                  />
<!--                  <v-badge-->
<!--                    :value="hoverQuestionMark"-->
<!--                    right-->
<!--                    transition="slide-x-transition"-->
<!--                    class="hse&#45;&#45;icon-question-circle"-->
<!--                    :content="$t('message.add_extended_permissions')"-->
<!--                  >-->
<!--                    <v-hover v-model="hoverQuestionMark">-->
<!--                      <i class="fa fa-question-circle"></i>-->
<!--                    </v-hover>-->
<!--                  </v-badge>-->
                </div>
              </b-col>
              <b-col cols="6" class="mb-7">
                <v-checkbox
                  v-model="editedItem.assign_group"
                  :label="$t('form.is_assign_group')"
                  class="margin-right-sm mt-0"
                  :hide-details="true"
                />
              </b-col>
            </b-row>
            <PermissionTable
              v-if="editedItem.role_id || editedItem.role_name"
              :permissions-data-input="permissionsData"
              :role-name-input="editedItem.role_name"
              @getPermissionsArray="getPermissionsArray"
            />
          </v-form>
        </v-card-text>
        <v-card-actions class="popup-footer">
          <v-spacer />
          <v-alert
            v-if="editMode && editedItem.disable_status"
            dense
            outlined
            type="warning"
            class="mb-0 mr-3"
          >
            {{ $t('message.this_job_title_has_been_disabled') }}
          </v-alert>
          <v-btn class="btn-cancel" text @click="close">
            {{ $t('button.cancel') }}
          </v-btn>
          <v-btn
            v-if="(userRoleId === 1 || (checkAdmin || permissionsUser.indexOf('job title-basic') > -1)) && (!editMode || (editMode && !editedItem.disable_status))"
            class="btn-save"
            @click="save"
          >
            {{ $t('button.save') }}
          </v-btn>
          <v-btn
            v-if="(userRoleId === 1 || (checkAdmin || permissionsUser.indexOf('job title-basic') > -1)) && (editMode && !editedItem.disable_status)"
            class="hse-btn-delete"
            text
            @click="dialogDelete = true"
          >
            <v-icon dark>
              mdi-delete
            </v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card class="dialog-delete">
        <v-card-text>
          <div class="text-center confirm-delete-title">
            {{ $t('title.confirm_delete') }}
          </div>
          <div class="confirm-delete-text">
            {{ $t('message.are_you_sure_you_want_to_delete_this_item') }}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="btn-cancel" text @click="closeDelete">
            {{ $t('button.no') }}
          </v-btn>
          <v-btn class="btn-save" @click="deleteItem(editedItem)">
            {{ $t('button.yes') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogConfirmClose" max-width="500px">
      <v-card class="dialog-delete">
        <v-card-text>
          <div class="text-center confirm-delete-title">
            {{ $t('title.confirm_modal') }}
          </div>
          <div class="confirm-delete-text">
            {{ $t('message.do_you_want_to_cancel_without_saving') }}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="btn-cancel" text @click="close">
            {{ $t('button.yes') }}
          </v-btn>

          <v-btn class="btn-cancel" text @click="dialogConfirmClose = false">
            {{ $t('button.no') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import {_} from 'vue-underscore';
  import MultipleSelection from "./MultipleSelection";
  import cookies from "js-cookie";
  import PermissionTable from "./PermissionTable";

  export default {
    name: "JobTitlePopup",
    components: {
      MultipleSelection,
      PermissionTable,
    },
    props: {
      resource: {
        type: Boolean,
        required: false,
      },
      jobTitleItem: {
        type: Object,
        required: false,
      },
      openPopup: Boolean,
      industryArray: {
        type: Array,
        required: false,
      },
      rolesArray: Array,
      departmentsArray: {
        type: Array,
        required: false,
      },
    },
    data: () => ({
      permissionsUser: localStorage.getItem('permissionsKey'),
      checkAdmin: cookies.get('checkAdmin'),
      checkSuperAdmin: cookies.get('checkSuperAdmin'),
      // roleUser: cookies.get('roleUser'),
      userRoleId: parseInt(cookies.get('roleID')),
      valid: true,
      required: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else return true;
        }
      ],
      editedItem: {
        name: '',
        role_id: '',
        role_name: '',
        is_super: '',
        assign_group: '',
        permission: '',
        department: [],
        industry_id: '',
        industry_id_arr: [],
        parent_id: '',
        editPermission: true,
      },
      defaultItem: {
        name: '',
        role_id: '',
        role_name: '',
        is_super: '',
        assign_group: '',
        permission: '',
        department: [],
        industry_id: '',
        industry_id_arr: [],
        parent_id: '',
        editPermission: true,
      },
      dialogDelete: false,
      dialogConfirmClose: false,
      formTitle: '',
      editMode: true,
      formDirty: false,
      checkResource: false,
      permissionsData: '',
      hoverQuestionMark: false,
      jobTitleResourceArray: [],
    }),

    computed: {},

    watch: {
      openPopup(value) {
        if (value) {
          if (this.jobTitleItem) {
            this.editItem(this.jobTitleItem);
          } else {
            this.addNew();
          }
        }
      },

      resource(value) {
        if (value) {
          this.checkResource = value;
        }
      },
    },

    mounted() {},

    created() {
      if (this.openPopup) {
        if (this.jobTitleItem) {
          this.editItem(this.jobTitleItem);
        } else {
          this.addNew();
        }
      }

      if (this.resource) {
        this.checkResource = this.resource;
      }
    },

    methods: {
      addNew() {
        this.reset();
        if (this.checkResource) {
          this.formTitle = 'Add a resource';
          this.formTitle = this.$i18n.t('title.new_job_title_resource');
        } else {
          this.formTitle = this.$i18n.t('title.new_job_title');
        }
        this.editMode = false;
      },

      formatNullArray(item) {
        if (item === null) {
          item = [];
        }
        return item;
      },

      formatFromStringToArray(data) {
        let result;
        if (data) {
          result = data.split(',');
          result = _.map(result, function (item) {
            return parseInt(item);
          });
        } else {
          result = data;
        }
        return result;
      },

      editItem(item) {
        let that = this;
        that.$nuxt.$loading.start();
        that.formTitle = that.$i18n.t('title.edit_job_title');
        that.$store.dispatch('jobTitles/show', item.id).then(result => {
          that.editedItem = Object.assign({}, result.data);
          that.getJobTitleResource();
          if (that.checkSuperAdmin) {
            that.editedItem.industry_id_arr = that.formatNullArray(that.formatFromStringToArray(that.editedItem.industry_id));
          } else {
            that.editedItem.department = JSON.parse(that.editedItem.department);
          }
          that.permissionsData = that.editedItem.permission;
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_job_title_view_detail'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      },

      checkDirtyBeforeClose(){
        if (this.checkDirtyForm()){
          this.dialogConfirmClose = true;
        } else{
          this.close();
        }
      },

      checkDirtyForm(){
        let that = this;
        let result = false;
        _.each(that.editedItem, function(value, key, obj) {
          if(that.originData && obj[key] && that.originData[key] && obj[key] !== that.originData[key]){
            result = true;
          }
        });
        return result;
      },

      close() {
        this.reset();
        this.$emit('closePopup');
        this.dialogDelete= false;
        this.dialogConfirmClose = false;
        // this.dialogConfirmApply = false;
        this.formDirty = false;
      },

      reset() {
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          // this.$refs.form.reset();
          this.$refs.form.resetValidation();
        }, 300);
      },

      save() {
        let that = this;
        if (that.$refs.form.validate()) {
          that.$nuxt.$loading.start();
          if (that.checkSuperAdmin) {
            that.editedItem.industry_id = that.editedItem.industry_id_arr.toString();
            that.editedItem.department = null;
          }
          if (that.permissionsArrayOutput.length > 0) {
            that.editedItem.permission = JSON.stringify(that.permissionsArrayOutput);
          } else {
            that.editedItem.permission = that.permissionsData;
          }
          if (that.editMode) {
            that.$store.dispatch('jobTitles/update', that.editedItem).then(function () {
              that.reloadList();
              that.$toaster.success(that.$i18n.t('message.success_job_title_update'));
            }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_job_title_update'));
              }
              // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
              that.$nuxt.$loading.finish();
            });
          } else {
            that.$store.dispatch('jobTitles/store', that.editedItem).then(function () {
              that.reloadList();
              that.$toaster.success(that.$i18n.t('message.success_job_title_add_new'));
            }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_job_title_add_new'));
              }
              // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
              that.$nuxt.$loading.finish();
            });
          }
          that.close();
        }
      },

      reloadList(){
        this.$emit('reloadList');
      },

      // dialog DELETE
      closeDelete() {
        this.dialogDelete = false;
      },

      deleteItem(item) {
        this.deleteJobTitle(item);
        this.dialogDelete = false;
        this.close();
      },

      deleteJobTitle(item) {
        let that = this;
        that.$store.dispatch('jobTitles/delete', item.id).then(function() {
          that.reloadList();
          that.$toaster.success(that.$i18n.t('message.success_job_title_delete'));
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_job_title_delete'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      },

      updateResource(value) {
        this.$emit('updateResource', value);
      },

      // changeTab(value) {
      //   this.$emit('changeTab', value);
      // },

      // showItem(item) {
        // this.dialogApply = false;
        // this.checkResource = false;
        // this.updateResource(this.checkResource);
        // this.changeTab(0);
      //   this.$emit('showItem', item);
      // },

      // ADMIN - choose industry
      getSelectedIndustryItems(value) {
        this.editedItem.industry_id_arr = value.selectedItemsOutput;
      },

      getPermissionsArray(value) {
        this.permissionsArrayOutput = value;
      },

      getSelectedDepartmentItem(value) {
        this.editedItem.department = value.selectedItemsOutput;
      },

      chooseJobTitleRole() {
        let that = this;
        that.$nuxt.$loading.start();
        that.getJobTitleResource();
        that.$store.dispatch('roles/show', that.editedItem.role_id).then(result => {
          that.editedItem.role_name = result.data.name;
          that.permissionsData = result.data.permission;
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_role_view_detail'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      },

      getJobTitleResource() {
        let that = this;
        if (that.editedItem.role_id) {
          that.$store.dispatch('jobTitles/index', {getResourceByRole: that.editedItem.role_id}).then(result => {
            that.jobTitleResourceArray = result.data;
          }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_job_title_view'));
            }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish();
          });
        }
      },

      chooseJobTitleResource() {
        let that = this;
        that.$nuxt.$loading.start();
        if (that.editedItem.parent_id) {
          let resource = _.findWhere(that.jobTitleResourceArray, {id: that.editedItem.parent_id});
          that.permissionsData = resource.permission;
          that.editedItem.is_super = !!resource.is_super;
          that.$nuxt.$loading.finish();
        } else {
          that.$nuxt.$loading.finish();
        }
      },
    },
  };
</script>

<style scoped>

</style>

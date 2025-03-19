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
              <b-col cols="12">
                <div class="input-wrap">
                  <v-text-field v-model="editedItem.name" :label="$t('form.name')" :rules="required" outlined />
                </div>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="2">
                <div class="bold-title md-line-height">
                  Type
                </div>
              </b-col>
              <b-col cols="4">
                <div class="input-wrap">
                  <div class="switch-component">
                    <label class="left-text">{{ $t('form.main') }}</label>
                    <v-switch
                      v-model="departmentType"
                      :label="$t('form.sub')"
                      inset
                      class="right-text"
                      @change="changeDepartmentType(departmentType)"
                    />
                  </div>
                </div>
              </b-col>
              <b-col cols="6">
                <div class="input-wrap">
                  <v-select
                    v-model="editedItem.parent_id"
                    :items="listAvailDepartment"
                    item-text="name"
                    item-value="id"
                    :label="$t('form.choose_main_department')"
                    :disabled="!departmentType"
                    outlined
                  />
                </div>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="12">
                <div class="input-wrap">
                  <v-textarea
                    v-model="editedItem.superManager"
                    readonly
                    auto-grow
                    :label="$t('form.super_manager')"
                    rows="1"
                    hide-details
                    :disabled="!editedItem.superManager"
                  />
                </div>
              </b-col>
              <b-col cols="12">
                <div class="input-wrap">
                  <v-textarea
                    v-model="editedItem.normalManager"
                    readonly
                    auto-grow
                    :label="$t('form.manager')"
                    rows="1"
                    hide-details
                    :disabled="!editedItem.normalManager"
                  />
                </div>
              </b-col>
              <b-col cols="12">
                <div class="input-wrap">
                  <v-textarea
                    v-model="editedItem.superUser"
                    readonly
                    auto-grow
                    :label="$t('form.super_user')"
                    rows="1"
                    hide-details
                    :disabled="!editedItem.superUser"
                  />
                </div>
              </b-col>
              <b-col cols="12">
                <div class="input-wrap">
                  <v-textarea
                    v-model="editedItem.normalUser"
                    readonly
                    auto-grow
                    :label="$t('form.user')"
                    rows="1"
                    hide-details
                    :disabled="!editedItem.normalUser"
                  />
                </div>
              </b-col>
            </b-row>
<!--            <b-row>-->
<!--              <b-col cols="12">-->
<!--                <div class="input-wrap industry-select-input-wrap">-->
<!--                  <MultipleSelection-->
<!--                    :selected-items-input="editedItem.manager_job_title"-->
<!--                    label="Choose the department manager by job title"-->
<!--                    :item-text="'name'"-->
<!--                    :item-value="'id'"-->
<!--                    :list-option-input="jobTitleArray"-->
<!--                    :requestRequired="false"-->
<!--                    @getSelectedItems="getSelectedManagerByJobTitleItems"-->
<!--                  />-->
<!--                </div>-->
<!--              </b-col>-->
<!--            </b-row>-->
<!--            <div class="section-connect-to mb-5">-->
<!--              <div class="section-connect-to-label">Managers</div>-->
<!--              <b-row class="mt-3">-->
<!--                <b-col cols="6">-->
<!--                  <div class="input-wrap industry-select-input-wrap">-->
<!--                    <MultipleSelection-->
<!--                      :selected-items-input="editedItem.manager_by_employee_arr"-->
<!--                      label="Assigned by employee"-->
<!--                      :item-text="'name'"-->
<!--                      :item-value="'id'"-->
<!--                      :list-option-input="usersArray"-->
<!--                      :requestRequired="false"-->
<!--                      :disabled="usersArray.length <= 0"-->
<!--                      @getSelectedItems="getSelectedManagerByEmployeeItems"-->
<!--                    />-->
<!--                  </div>-->
<!--                </b-col>-->
<!--              </b-row>-->
<!--            </div>-->
<!--            <div class="section-connect-to mb-5">-->
<!--              <div class="section-connect-to-label">Members</div>-->
<!--              <b-row class="mt-3">-->
<!--                <b-col cols="6">-->
<!--                  <div class="input-wrap industry-select-input-wrap">-->
<!--                    <MultipleSelection-->
<!--                      :selected-items-input="editedItem.member_by_employee_arr"-->
<!--                      label="Assigned by employee"-->
<!--                      :item-text="'name'"-->
<!--                      :item-value="'id'"-->
<!--                      :list-option-input="usersArray"-->
<!--                      :requestRequired="false"-->
<!--                      :disabled="usersArray.length <= 0"-->
<!--                      @getSelectedItems="getSelectedMemberByEmployeeItems"-->
<!--                    />-->
<!--                  </div>-->
<!--                </b-col>-->
<!--                <b-col cols="6">-->
<!--                  <div class="input-wrap industry-select-input-wrap">-->
<!--                    <MultipleSelection-->
<!--                      :selected-items-input="editedItem.member_by_jobtitle_arr"-->
<!--                      label="Assigned by job title"-->
<!--                      :item-text="'name'"-->
<!--                      :item-value="'id'"-->
<!--                      :list-option-input="jobTitleArray"-->
<!--                      :requestRequired="false"-->
<!--                      :disabled="jobTitleArray.length <= 0"-->
<!--                      @getSelectedItems="getSelectedMemberByJobtitleItems"-->
<!--                    />-->
<!--                  </div>-->
<!--                </b-col>-->
<!--              </b-row>-->
<!--            </div>-->
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
            {{ $t('message.this_department_has_been_disabled') }}
          </v-alert>
          <v-btn class="btn-cancel" text @click="close">
            {{ $t('button.cancel') }}
          </v-btn>
          <v-btn
            v-if="(checkAdmin || permissionsUser.indexOf('department-basic') > -1) && (!editMode || (editMode && !editedItem.disable_status))"
            class="btn-save"
            @click="save"
          >
            {{ $t('button.save') }}
          </v-btn>
          <v-btn
            v-if="(checkAdmin || permissionsUser.indexOf('department-basic') > -1) && (editMode && !editedItem.disable_status)"
            class="hse-btn-delete"
            text
            @click="checkDelete"
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
            {{ $t('title.confirm_disable') }}
          </div>
          <div class="confirm-delete-text">
            {{ $t('message.are_you_sure_you_want_to_disable_this_item') }}
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

    <v-dialog v-model="dialogNotice" max-width="500px">
      <v-card class="dialog-delete">
        <v-card-text>
          <div class="text-center confirm-delete-title">
            {{ $t('title.notice') }}
          </div>
          <div class="confirm-delete-text">
            {{ $t('message.this_department_can_not_be_disabled') }}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="btn-cancel" text @click="dialogNotice = false">
            {{ $t('button.close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import {_} from 'vue-underscore';
  import cookies from "js-cookie";

  export default {
    name: "DepartmentPopup",
    components: {},
    props: {
      departmentItem: {
        type: Object,
        required: false,
      },
      openPopup: Boolean,
      roleArray: Array,
      listArrayInput: Array,
    },
    data: () => ({
      permissionsUser: localStorage.getItem('permissionsKey'),
      checkAdmin: cookies.get('checkAdmin'),
      roleUser: cookies.get('roleUser'),
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
        parent_id: '',
        company_id: '',
        manager_job_title: [],
        superManager: '',
        normalManager: '',
        superUser: '',
        normalUser: '',
        countEmployee: '',
        editPermission: true,
      },
      defaultItem: {
        name: '',
        parent_id: '',
        company_id: '',
        manager_job_title: [],
        superManager: '',
        normalManager: '',
        superUser: '',
        normalUser: '',
        countEmployee: '',
        editPermission: true,
      },
      dialogDelete: false,
      formTitle: '',
      editMode: true,
      category_department: 1, // category type: department
      departmentType: false,
      listArray: [],
      usersArray: [],
      jobTitleArray: [],
      check_exist_root_department: false,
      listAvailDepartment: [],
      dialogNotice: false,
    }),

    computed: {},

    watch: {
      openPopup(value) {
        if (value) {
          if (this.departmentItem) {
            let parentId = this.departmentItem.parent_id;
            this.listArray = _.filter(this.listArrayInput, function (item) {
              return (!item.disable_status || (item.disable_status && item.id === parentId));
            });
            this.editItem(this.departmentItem);
          } else {
            this.listArray = _.filter(this.listArrayInput, function (item) {
              return !item.disable_status;
            });
            this.listAvailDepartment = this.listArray;
            this.addNew();
          }
        }
      },

      listArrayInput(value) {
        if (value) {
          this.listArray = value;
        }
      },
    },

    created() {
      if (this.openPopup) {
        if (this.departmentItem) {
          this.editItem(this.departmentItem);
        } else {
          this.addNew();
        }
      }

      if (this.listArrayInput.length > 0) {
        this.listArray = this.listArrayInput;
      }
    },

    mounted() {
      let that = this;
      that.$nextTick(() => {
        that.$nuxt.$loading.start();
        // list employees
        that.$store.dispatch('employees/index').then(result => {
          that.usersArray = result.data;
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_employee_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      });
    },

    methods: {
      addNew() {
        this.reset();
        this.formTitle = this.$i18n.t('title.new_department');
        this.editMode = false;
      },

      checkDelete() {
        if (this.editedItem.countEmployee > 0) {
          this.dialogNotice = true;
        } else {
          this.dialogDelete = true;
        }
      },

      editItem(item) {
        let that = this;
        that.$nuxt.$loading.start();
        that.formTitle = that.$i18n.t('title.edit_department');
        if (that.checkAdmin || that.permissionsUser.indexOf('department-detail') > -1) {
          that.editedItem = Object.assign({}, item);
          // that.editedItem.manager_job_title = JSON.parse(item.manager_job_title);
          that.departmentType = !!that.editedItem.parent_id;

          // list job title
          that.$store.dispatch('jobTitles/index', {department_id: item.id}).then(result => {
            that.jobTitleArray = result.data;
            that.$nuxt.$loading.finish();
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

          that.$store.dispatch('departments/index', {getChildren: item.id}).then(result => {
            that.listAvailDepartment = _.filter(that.listArray, function (department) {
              return (department.id !== item.id);
            });
            _.each(result.data, function (childDepartment) {
              that.listAvailDepartment = _.filter(that.listAvailDepartment, function (department) {
                return (department.id !== childDepartment.id);
              });
            });
            that.$nuxt.$loading.finish();
          }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_department_view'));
            }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish();
          });
          // that.editedItem.manager_array = JSON.parse(item.manager_array);
          // that.editedItem.member_array = JSON.parse(item.member_array);
          // if (that.editedItem.manager_array) {
          //   that.editedItem.manager_by_employee_arr = that.editedItem.manager_array.employee;
          //   that.editedItem.manager_by_jobtitle_arr = that.editedItem.manager_array.job_title;
          // }
          // if (that.editedItem.member_array) {
          //   that.editedItem.member_by_employee_arr = that.editedItem.member_array.employee;
          //   that.editedItem.member_by_jobtitle_arr = that.editedItem.member_array.job_title;
          // }
        }
      },

      close() {
        this.reset();
        this.departmentType = false;
        this.$emit('closePopup');
      },

      reset() {
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          // this.$refs.form.reset();
          this.$refs.form.resetValidation();
        }, 300);
      },

      edit() {
        this.editedItem.requestEdit = true;
      },

      save() {
        let that = this;
        if (that.$refs.form.validate()) {
          that.$nuxt.$loading.start();
          if (that.editMode) {
            // edit
            that.$store.dispatch('departments/update', that.editedItem).then(function () {
              that.reloadList();
              that.$toaster.success(that.$i18n.t('message.success_department_update'));
            }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_department_update'));
              }
              // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
              that.$nuxt.$loading.finish();
            });
          } else {
            // create
            that.$store.dispatch('departments/store', that.editedItem).then(function () {
              that.reloadList();
              that.editedItem = that.defaultItem;
              that.$toaster.success(that.$i18n.t('message.success_department_add_new'));
            }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_department_add_new'));
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
        this.deleteDepartment(item);
        this.dialogDelete = false;
        this.close();
      },

      deleteDepartment(item) {
        let that = this;
        that.$store.dispatch('departments/delete', item.id).then(function() {
          that.reloadList();
          that.$toaster.success(that.$i18n.t('message.success_department_delete'));
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_department_delete'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          // that.$nuxt.$loading.finish();
        });
      },

      // getSelectedManagerByJobTitleItems(value) {
      //   this.editedItem.manager_job_title = value.selectedItemsOutput;
      // },

      // getSelectedManagerByEmployeeItems(value) {
      //   this.editedItem.manager_by_employee_arr = value.selectedItemsOutput;
      // },
      //
      // getSelectedMemberByEmployeeItems(value) {
      //   this.editedItem.member_by_employee_arr = value.selectedItemsOutput;
      // },
      //
      // getSelectedMemberByJobtitleItems(value) {
      //   this.editedItem.member_by_jobtitle_arr = value.selectedItemsOutput;
      // },

      changeDepartmentType(type) {
        if (!type) {
          this.editedItem.parent_id = '';
        }
      },
    },
  };
</script>

<style scoped>

</style>

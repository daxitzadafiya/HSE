<template>
  <div>
    <v-dialog v-model="openPopup" max-width="500px" persistent>
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
            <b-row>
              <b-col>
                <div class="input-wrap">
                  <v-text-field
                    v-model="editedItem.name"
                    :read-only="editMode && editedItem.added_by === 1 && editedItem.company_id === null"
                    :label="$t('form.name')"
                    :rules="required"
                    outlined
                  />
                </div>
              </b-col>
            </b-row>
            <b-row v-if="checkSuperAdmin">
              <b-col>
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
            <b-row v-if="categoryType === 5">
              <b-col>
                <div class="input-wrap">
                  <v-select
                    v-model="editedItem.added_from"
                    :items="categoryAttachmentAddedFromArray"
                    item-text="name"
                    item-value="id"
                    label="From"
                    :rules="required"
                    outlined
                  />
                </div>
              </b-col>
            </b-row>
            <b-row v-if="checkSuperAdmin">
              <b-col>
                <div>
                  <v-checkbox v-model="editedItem.is_primary" label="Is default category?" />
                </div>
              </b-col>
            </b-row>
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
            This category has been disabled
          </v-alert>
          <v-btn class="btn-cancel" text @click="close">
            {{ $t('button.cancel') }}
          </v-btn>
          <v-btn
            v-if="checkSuperAdmin ||
            (!editMode || (editMode && editedItem.added_by > 1) ||
            (editedItem.added_by === 1 && editedItem.company_id !== null)) &&
            (checkAdmin || permissionsUser.indexOf('category-basic') > -1) &&
            (!editMode || (editMode && !editedItem.disable_status))"
            class="btn-save"
            @click="save"
          >
            {{ $t('button.save') }}
          </v-btn>
          <v-btn
            v-if="(checkSuperAdmin ||
            ((editedItem.added_by > 1 || (editedItem.added_by === 1 && editedItem.company_id !== null)) &&
            (checkAdmin || permissionsUser.indexOf('category-basic') > -1))) &&
            (editMode && !editedItem.disable_status)"
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
            Confirm disable
          </div>
          <div class="confirm-delete-text">
            <span>
              Are you sure you want to disable this item?
            </span>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="btn-cancel" text @click="dialogDelete = false">
            {{ $t('button.no') }}
          </v-btn>
          <v-btn class="btn-save" @click="deleteItem">
            {{ $t('button.yes') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import {_} from 'vue-underscore';
  import cookies from "js-cookie";
  import MultipleSelection from "./MultipleSelection";

  export default {
    name: "CategoryPopup",
    components: {
      MultipleSelection,
    },
    props: {
      categoryItem: {
        type: Object,
        required: false,
      },
      openPopup: Boolean,
      industryArray: {
        type: Array,
        required: false,
      },
      categoryType: {
        type: Number,
        required: false,
      },
    },
    data: () => ({
      permissionsUser: localStorage.getItem('permissionsKey'),
      checkAdmin: cookies.get('checkAdmin'),
      checkSuperAdmin: cookies.get('checkSuperAdmin'),
      roleUser: cookies.get('roleUser'),
      // userRoleId: parseInt(cookies.get('roleID')),
      valid: true,
      required: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else return true;
        }
      ],
      editedItem: {
        name: "",
        type: "",
        industry_id: '',
        industry_id_arr: [],
        added_from: "",
        added_by: "",
        disable_status: "",
        is_primary: false,
      },
      defaultItem: {
        name: "",
        type: "",
        industry_id: '',
        industry_id_arr: [],
        added_from: "",
        added_by: "",
        disable_status: "",
        is_primary: false,
      },
      dialogDelete: false,
      formTitle: '',
      editMode: true,
      formDirty: false,
      categoriesValidArray: [],
      categoryAttachmentAddedFromArray: [
        {name: 'Company', id: 1},
        {name: 'Contact', id: 2},
        {name: 'Employee', id: 3},
      ],
    }),

    computed: {},

    watch: {
      openPopup(value) {
        if (value) {
          if (this.categoryItem) {
            this.editItem(this.categoryItem);
          } else {
            this.addNew();
          }
        }
      },
    },

    mounted() {},

    created() {
      if (this.openPopup) {
        if (this.categoryItem) {
          this.editItem(this.categoryItem);
        } else {
          this.addNew();
        }
      }
    },

    methods: {
      addNew() {
        this.reset();
        this.formTitle = this.$i18n.t('title.new_category');
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
        that.formDirty = false;
        that.$nuxt.$loading.start();
        that.formTitle = that.$i18n.t('title.edit_category');
        that.$store.dispatch('categories/show', item.id).then(result => {
          that.editedItem = Object.assign({}, result.data);
          if (that.checkSuperAdmin) {
            that.editedItem.industry_id_arr = that.formatNullArray(that.formatFromStringToArray(that.editedItem.industry_id));
          }
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_category_view_detail'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
        // that.originData = _.clone(that.editedItem);
      },

      // checkDirtyBeforeClose(){
      //   if(this.checkDirtyForm()){
      //     this.dialogConfirmClose = true;
      //   }else{
      //     this.close();
      //   }
      // },
      //
      // checkDirtyForm(){
      //   let that = this;
      //   let result = false;
      //   _.each(that.editedItem, function(value, key, obj) {
      //     if(that.originData && obj[key] && that.originData[key] && obj[key] !== that.originData[key]){
      //       result = true;
      //     }
      //   });
      //   return result;
      // },

      close() {
        this.reset();
        this.$emit('closePopup');
        // this.formDirty = false;
      },

      reset() {
        // this.denyEdit = false;
        this.$nuxt.$loading.finish();
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          // this.$refs.form.reset();
          this.$refs.form.resetValidation();
        }, 300);
      },

      formatCategoryTypeBeforeSave(item) {
        if (this.categoryType === 0) {
          item.type = 'goal';
        } else if (this.categoryType === 1) {
          item.type = 'routine';
        } else if (this.categoryType === 2) {
          item.type = 'instruction';
        } else if (this.categoryType === 3) {
          item.type = 'document';
        } else if (this.categoryType === 4) {
          item.type = 'contact';
        } else if (this.categoryType === 5) {
          item.type = 'attachment';
        } else if (this.categoryType === 6) {
          item.type = 'checklist';
        } else if (this.categoryType === 7) {
          item.type = 'deviation';
        } else if (this.categoryType === 8) {
          item.type = 'risk';
        } else if (this.categoryType === 9) {
          item.type = 'task';
        }
        return item;
      },

      save() {
        let that = this;
        if (that.$refs.form.validate()) {
          that.formatCategoryTypeBeforeSave(that.editedItem);
          that.$nuxt.$loading.start();
          if (that.checkSuperAdmin) {
            that.editedItem.industry_id = that.editedItem.industry_id_arr.toString();
          }
          if (that.editMode) {
            if (that.editedItem.is_primary === 1) {
              that.editedItem.is_primary = true;
            }
            that.$store.dispatch('categories/update', that.editedItem).then(function () {
              that.reloadList();
              that.$toaster.success(that.$i18n.t('message.success_category_update'));
            }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_category_update'));
              }
              that.$nuxt.$loading.finish();
              // if (error.response && error.response.data) {
              //   that.$toaster.error(error.response.data.message || error.response.data.errors);
              // }
            });
          } else {
            that.$store.dispatch('categories/store', that.editedItem).then(function () {
              that.reloadList();
              that.$toaster.success(that.$i18n.t('message.success_category_add_new'));
            }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_category_add_new'));
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
        this.deleteCategory(item);
        this.dialogDelete = false;
        this.close();
      },

      deleteCategory(item) {
        let that = this;
        that.$store.dispatch('categories/delete', item.id).then(function() {
          that.reloadList();
          that.$toaster.success(that.$i18n.t('message.success_category_delete'));
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_category_delete'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      },

      changeTab(value) {
        this.$emit('changeTab', value);
      },

      showItem(item) {
        this.dialogApply = false;
        this.$emit('showItem', item);
      },

      // ADMIN - choose industry
      getSelectedIndustryItems(value) {
        this.editedItem.industry_id_arr = value.selectedItemsOutput;
      },
    },
  };
</script>

<style scoped>

</style>

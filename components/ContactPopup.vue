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
                    :readonly="showBtnApply"
                  />
                </div>
              </b-col>
              <b-col cols="6">
                <div class="input-wrap">
                  <v-text-field
                    v-model="organizationNumber"
                    label="Organization number"
                    :rules="organizationNumberRule"
                    outlined
                    :readonly="showBtnApply"
                    maxlength="11"
                    @keypress="onlyNumber"
                  />
                </div>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="6">
                <div class="input-wrap">
                  <v-text-field
                    v-model="phoneNumber"
                    :label="$t('form.phone_number')"
                    :rules="phoneNumberRule"
                    outlined
                    :readonly="showBtnApply"
                    maxlength="10"
                    @keypress="onlyNumber"
                  />
                </div>
              </b-col>
              <b-col cols="6">
                <div class="input-wrap">
                  <v-text-field
                    v-model="editedItem.email"
                    :label="$t('form.email')"
                    type="email"
                    :rules="emailRules"
                    outlined
                    :readonly="showBtnApply"
                  />
                </div>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <div class="input-wrap">
                  <v-text-field
                    v-model="editedItem.address"
                    :label="$t('form.address')"
                    :rules="required"
                    outlined
                    :readonly="!checkSuperAdmin && ((!editMode && !editedItem.editPermission) || (editMode && editedItem.editPermission && editedItem.added_by === 1 && showBtnApply))"
                  />
                </div>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="6">
                <div class="input-wrap">
                  <v-text-field
                    v-model="editedItem.zip_code"
                    label="Zip code"
                    :rules="zipCodeRule"
                    outlined
                    :readonly="showBtnApply"
                    maxlength="4"
                    @keypress="onlyNumber"
                  />
                </div>
              </b-col>
              <b-col cols="6">
                <div class="input-wrap">
                  <v-text-field
                    v-model="editedItem.city"
                    :label="$t('form.city')"
                    :rules="required"
                    outlined
                    :readonly="showBtnApply"
                  />
                </div>
              </b-col>
            </b-row>
            <category
              :category-item="editedItem"
              :categories-array="categoriesValidArray"
              :type-category="category_contact"
              :is-open-popup="openPopup"
              :view-only="!checkSuperAdmin && (!editedItem.editPermission || (editedItem.editPermission && editedItem.added_by === 1))"
              @getNewCategory="getNewCategory"
            />
          </v-form>
        </v-card-text>
        <v-card-actions class="popup-footer">
          <div class="switch-component question-mark-block">
            <label class="left-text">{{ $t('button.index') }}</label>
            <v-switch
              v-model="editedItem.is_suggestion"
              :disabled="!checkAdmin || !editedItem.is_public"
              inset
              class="right-text"
            />
            <v-badge
              :value="hoverQuestionMark"
              right
              transition="slide-x-transition"
              class="hse--icon-question-circle"
              :content="$t('message.hover_index')"
            >
              <v-hover v-model="hoverQuestionMark">
                <i class="fa fa-question-circle"></i>
              </v-hover>
            </v-badge>
          </div>
          <v-spacer />
          <v-btn v-if="roleUser !== 'user'" class="btn-cancel" text @click="checkDirtyBeforeClose">
            {{ $t('button.cancel') }}
          </v-btn>
          <v-btn v-else class="btn-cancel" text @click="checkDirtyBeforeClose">
            OK
          </v-btn>
          <v-btn
            v-if="checkSuperAdmin || ((checkAdmin || permissionsUser.indexOf('contact-basic') > -1) && editedItem.editPermission && !showBtnApply)"
            class="btn-save"
            @click="save"
          >
            {{ $t('button.save') }}
          </v-btn>
          <v-btn
            v-if="(checkAdmin || permissionsUser.indexOf('contact-basic') > -1) && editedItem.added_by === 1 && showBtnApply"
            class="btn-save"
            @click="applyResource"
          >
            {{ $t('button.apply') }}
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
  // import moment from 'moment';
  // import {mapState} from "vuex";
  import Category from "./Category";
  import cookies from "js-cookie";

  export default {
    name: "ContactPopup",
    components: {
      category: Category,
    },
    props: {
      contactItem: {
        type: Object,
        required: false,
      },
      openPopup: Boolean,
      categoriesArray:{
        type: Array,
        required: false,
      },
    },
    data: () => ({
      permissionsUser: localStorage.getItem('permissionsKey'),
      checkSuperAdmin: cookies.get('checkSuperAdmin'),
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
      zipCodeRule: [
        v => {
          if (v && v.length > 0 && !/^(\d{4})$/.test(v))
            return 'Zip code must be 4 digits';
          else return true;
        }
      ],
      organizationNumberRule: [
        v => {
          if (v && v.length > 0 && !/^(\d{3})+(\s)+(\d{3})+(\s)+(\d{3})$/.test(v))
            return 'Organization number must be 9 digits';
          else return true;
        }
      ],
      phoneNumberRule: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else if (!/^((\d{3})+(\s{1})+(\d{2})+(\s{1})+(\d{3})|\d{3})?$/.test(v))
            return 'Phone number must be 8 digits';
          else return true;
        }
      ],
      emailRules: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else if (!/.+@.+/.test(v))
            return 'E-mail must be valid';
          else return true;
        }
      ],
      editedItem: {
        name: '',
        category_id: "",
        phone_number: '',
        email: '',
        address: '',
        city: '',
        zip_code: '',
        organization_number: "",
        editPermission: true,
        is_template: false,
        is_suggestion: false,
      },
      defaultItem: {
        name: '',
        category_id: "",
        phone_number: '',
        email: '',
        address: '',
        city: '',
        zip_code: '',
        organization_number: "",
        editPermission: true,
        is_template: false,
        is_suggestion: false,
      },
      // isClosed: false,
      // denyEdit: false,
      dialogDelete: false,
      dialogConfirmClose: false,
      formTitle: '',
      editMode: true,
      formDirty: false,
      category_contact: 'contact', // category type: contact
      phoneNumber: '',
      organizationNumber: '',
      categoriesValidArray: [],
      showBtnApply: false,
      hoverQuestionMark: false,
    }),

    computed: {},

    watch: {
      openPopup(value) {
        if (value) {
          if (this.contactItem) {
            let categoryId = this.contactItem.category_id;
            this.categoriesValidArray = _.filter(this.categoriesArray, function (item) {
              return (!item.disable_status || (item.disable_status && item.id === categoryId));
            });
            this.editItem(this.contactItem);
          } else {
            this.categoriesValidArray = _.filter(this.categoriesArray, function (item) {
              return !item.disable_status;
            });
            this.addNew();
          }
        }
      },

      phoneNumber(value) {
        if (value) {
          this.reformatPhoneNumber();
        }
      },

      organizationNumber(value) {
        if (value) {
          this.reformatOrganizationNumber();
        }
      },
    },

    mounted() {},

    created() {
      if (this.openPopup) {
        if (this.contactItem) {
          this.editItem(this.contactItem);
        } else {
          this.addNew();
        }
      }
    },

    methods: {
      getNewCategory(value) {
        this.editedItem.category_id = value.newCategoryId;
      },

      addNew() {
        this.reset();
        this.editMode = false;
        this.formTitle = this.$i18n.t('title.new_contact');
        let defaultCategory = _.findWhere(this.categoriesValidArray, {is_primary: 1});
        if (defaultCategory) {
          this.editedItem.category_id = defaultCategory.id;
        }
      },

      editItem(item) {
        let that = this;
        that.formTitle = that.$i18n.t('title.edit_contact');
        that.formDirty = false;
        that.$nuxt.$loading.start();
        that.$store.dispatch('contacts/show', item.id).then(result => {
          that.editedItem = Object.assign({}, result.data);
          that.editedItem.editPermission = that.roleUser !== 'user';
          that.originData = _.clone(this.editedItem);
          that.phoneNumber = that.editedItem.phone_number;
          that.organizationNumber = that.editedItem.organization_number;
          that.showBtnApply = that.editedItem.added_by === 1;
          that.editMode = true;
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_contact_view_detail'));
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
        this.dialogConfirmClose = false;
        this.formDirty = false;
        this.phoneNumber = '';
        this.reloadListCategory();
        this.$emit('closePopup');
      },

      reset() {
        // this.denyEdit = false;
        // this.isClosed = false;
        this.$nuxt.$loading.finish();
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
          that.editedItem.phone_number = that.phoneNumber;
          that.editedItem.organization_number = that.organizationNumber;
          if ((that.editMode && that.checkSuperAdmin) || (that.editMode && !that.checkSuperAdmin && that.editedItem.added_by !== 1)) {
            // edit
            that.$store.dispatch('contacts/update', that.editedItem).then(function() {
              that.reloadList();
              that.reloadListCategory();
              that.$toaster.success(that.$i18n.t('message.success_contact_update'));
            }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_contact_update'));
          }
              // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
              that.$nuxt.$loading.finish();
            });
          } else {
            // create
            if (that.checkSuperAdmin) {
              that.editedItem.is_template = true;
            }
            that.$store.dispatch('contacts/store', that.editedItem).then(function() {
              that.reloadList();
              that.reloadListCategory();
              that.$toaster.success(that.$i18n.t('message.success_contact_add_new'));
            }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_contact_add_new'));
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

      reloadListCategory(){
        this.$emit('reloadListCategory');
      },

      onlyNumber(e) {
        if (!(/\d/i.test(e.key))) {
          e.preventDefault();
        }
      },

      reformatPhoneNumber() {
        let that = this;
        if (that.phoneNumber.length === 4 && that.phoneNumber.trim().length !== 3) {
          let str = that.phoneNumber;
          let position = 3;
          let sub = " ";

          that.phoneNumber = str.slice(0, position)  + sub + str.slice(position) ;
        } else if (that.phoneNumber.length === 6) {
          that.phoneNumber = that.phoneNumber + ' ';
        }
      },

      reformatOrganizationNumber() {
        let that = this;
        if (that.organizationNumber.length === 3 || that.organizationNumber.length === 7) {
          that.organizationNumber = that.organizationNumber + ' ';
        }
      },

      // checkDenyEdit() {
      //   if (this.editedItem.status === this.statusClosed) {
      //     this.denyEdit = true;
      //     this.isClosed = true;
      //   } else {
      //     this.denyEdit = !(this.editedItem.status === this.statusNew || (this.denyEdit && this.editedItem.requestEdit));
      //   }
      // },

      // dialog DELETE
      closeDelete() {
        this.dialogDelete = false;
      },

      deleteItem(item) {
        this.deleteContact(item);
        this.dialogDelete = false;
        this.close();
      },

      deleteContact(item) {
        this.$store.dispatch('contacts/delete', item.id).then(function() {
          this.reloadList();
          this.$toaster.success(this.$i18n.t('message.success_contact_delete'));
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          this.$toaster.error(this.$i18n.t('message.fail_contact_delete'));
          }
          // this.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          // this.$nuxt.$loading.finish();
        });
      },

      applyResource() {
        this.showBtnApply = false;
      }
    },
  };
</script>

<style scoped>

</style>

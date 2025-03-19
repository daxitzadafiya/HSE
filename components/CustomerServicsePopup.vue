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
                    <v-text-field v-model="editedItem.first_name" label="First name" :rules="required" outlined />
                  </div>
                </b-col>
                <b-col cols="6">
                  <div class="input-wrap">
                    <v-text-field v-model="editedItem.last_name" label="Last name" :rules="required" outlined />
                  </div>
                </b-col>
              </b-row>
              <b-row>
                <b-col cols="6">
                  <div class="input-wrap">
                    <v-text-field
                      v-model="editedItem.email"
                      :label="$t('form.email')"
                      :rules="emailRules"
                      outlined
                    />
                  </div>
                </b-col>
                <b-col cols="6">
                  <div class="input-wrap">
                    <v-text-field
                      v-model="phoneNumber"
                      :label="$t('form.phone_number')"
                      :rules="phoneNumberRule"
                      outlined
                      maxlength="10"
                      @keypress="onlyNumber"
                    />
                  </div>
                </b-col>
              </b-row>
              <b-row>
                <b-col cols="6">
                  <div class="input-wrap">
                    <v-text-field
                      v-model="personalNumber"
                      :label="$t('form.personal_number')"
                      :rules="personalNumberRule"
                      outlined
                      maxlength="12"
                      @keypress="onlyNumber"
                    />
                  </div>
                </b-col>
                <b-col cols="6">
                  <div class="input-wrap">
                    <v-text-field v-model="editedItem.address" :label="$t('form.address')" outlined />
                  </div>
                </b-col>
              </b-row>
              <b-row align-h="center">
                <b-col cols="6">
                  <div class="input-wrap">
                    <v-text-field
                      v-model="editedItem.city"
                      :label="$t('form.city')"
                      :rules="cityRule"
                      outlined
                    />
                  </div>
                </b-col>
                <b-col cols="6">
                  <div class="input-wrap">
                    <v-text-field
                      v-model="editedItem.zip_code"
                      label="Zip code"
                      :rules="zipCodeRule"
                      outlined
                      maxlength="4"
                      @keypress="onlyNumber"
                    />
                  </div>
                </b-col>
              </b-row>
            </v-form>
          </v-card-text>
          <v-card-actions class="popup-footer">
            <v-spacer />
            <v-btn class="btn-cancel" text @click="close">
              {{ $t('button.cancel') }}
            </v-btn>
            <v-btn class="btn-save" @click="save">
                    {{ editMode ?  $t('button.update') : $t('button.save') }}
            </v-btn>
            <v-btn v-if="editMode" class="hse-btn-delete" text @click="dialogConfirmClose = true">
                    <v-icon dark> mdi-delete </v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <v-dialog v-model="dialogConfirmClose" max-width="500px">
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
            <v-btn class="btn-cancel" text @click="dialogConfirmClose = false">
              No
            </v-btn>
            <v-btn class="btn-cancel" text @click="handleDelete">
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
  
    export default {
      name: "CustomServicsePopup",
      components: {},
      props: {
        EditId: {
          type: Number,
          required: false,
        },
        openPopup: {
          type: Boolean,
          required: false,
        },
      },
      data: () => ({
        userRoleId: parseInt(cookies.get('roleID')),
        // userDepartmentID: parseInt(cookies.get('userDepartmentID')),
        // checkAdmin: cookies.get('checkAdmin'),
        // roleUser: cookies.get('roleUser'),
        // permissionsUser: localStorage.getItem('permissionsKey'),
        valid: true,
        editedItem: {
          first_name: "",
          last_name: "",
          role_id: "",
          email: "",
          address: "",
          city: "",
          phone_number: "",
          personal_number: "",
          avatar: "",
          zip_code: "",
          status: "pending",
        },
        defaultItem: {
          first_name: "",
          last_name: "",
          role_id: "",
          email: "",
          address: "",
          city: "",
          phone_number: "",
          personal_number: "",
          avatar: "",
          zip_code: "",
          status: "pending",
        },
        required: [
          v => {
            if (!v || v.length < 1)
              return 'This is required';
            else return true;
          }
        ],
        cityRule: [
          v => {
            if (v && v.length > 0 && !/^([^0-9]*)$/.test(v))
              return 'City must not contain digits';
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
        phoneNumberRule: [
          v => {
            if (!v || v.length < 1)
              return 'This is required';
            else if (!/^((\d{3})+(\s)+(\d{2})+(\s)+(\d{3})|\d{3})?$/.test(v))
              return 'Phone number must be 3 or 8 digits';
            else return true;
          }
        ],
        personalNumberRule: [
          v => {
            if (v && v.length > 0 && !/^(\d{6})+(\s)+(\d{5})$/.test(v))
              return 'Personal number must be 11 digits';
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
        dialogConfirmClose: false,
        formDirty: false,
        phoneNumber: '',
        personalNumber: '',
        formTitle: '',
        editMode: true,
      }),
  
      computed: {},
  
      watch: {
        openPopup(value) {
          if (value) {
            if (this.EditId) {
              this.editItem(this.EditId);
            } else {
              this.addNew();
            }
          }
        },
  
        phoneNumber(value) {
          if (value) {
            this.reformatPhoneNumber();
          }
        },
  
        personalNumber(value) {
          if (value) {
            this.reformatPersonalNumber();
          }
        },
      },
  
      mounted() {},
  
      created() {
        if (this.openPopup) {
          if (this.EditId) {
            this.editItem(this.EditId);
          } else {
            this.addNew();
          }
        }
      },
  
      methods: {
        addNew() {
          this.reset();
          this.formTitle = this.$i18n.t('title.new_customer_service');
          this.editMode = false;
         
        },
  
        editItem(id) {
          let that = this;
          that.formDirty = false;
          that.$nuxt.$loading.start();
          that.formTitle = that.$i18n.t('title.edit_customer_service');
          that.$store.dispatch('customerServices/show',id).then(result => {
            that.editedItem = Object.assign({}, result.data);
            that.phoneNumber = that.editedItem.phone_number;
            that.personalNumber = that.editedItem.personal_number;
            that.$nuxt.$loading.finish();
          }).catch((error) => {
              if (error.response.status == 401) {
              this.$router.push('/login');
              this.$toaster.error(this.$i18n.t('message.token_expired'));
            }else{
            that.$toaster.error(that.$i18n.t('message.fail_customer_view_detail'));
            }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish();
          });
          that.originData = _.clone(that.editedItem);
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
  
            that.phoneNumber = str.slice(0, position)  + sub + str.slice(position);
          } else if (that.phoneNumber.length === 6) {
            that.phoneNumber = that.phoneNumber + ' ';
          }
        },
  
        reformatPersonalNumber() {
          let that = this;
          if (that.personalNumber.length === 6) {
            that.personalNumber = that.personalNumber + ' ';
          }
        },
  
        close() {
          this.reset();
          this.dialogConfirmClose = false;
          this.formDirty = false;
          this.phoneNumber = '';
          this.personalNumber = '';
          this.$emit('closePopup');
          this.$router.push('/admin/overview/customerServices');
        },
  
        reset() {
          setTimeout(() => {
            this.editedItem = Object.assign({}, this.defaultItem);
            // this.$refs.form.reset();
            this.$refs.form.resetValidation();
          }, 0);
        },
  
        save() {
          let that = this;
          if (that.$refs.form.validate()) {
            that.$nuxt.$loading.start();
            that.editedItem.phone_number = that.phoneNumber;
            that.editedItem.personal_number = that.personalNumber;
            // update
            if (that.editMode) {
              that.$store.dispatch('customerServices/update', that.editedItem).then(function () {
                that.reloadList();
                that.$toaster.success(that.$i18n.t('message.success_customer_update'));
              }).catch((error) => {
              if (error.response.status == 401) {
              this.$router.push('/login');
              this.$toaster.error(this.$i18n.t('message.token_expired'));
            }else{
                that.$toaster.error(that.$i18n.t('message.fail_customer_update'));
                }
                // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
                that.$nuxt.$loading.finish();
              });
            } else {
              // create
              that.$store.dispatch('customerServices/store', that.editedItem).then(function () {
                that.reloadList();
                that.$toaster.success(that.$i18n.t('message.success_customer_add_new'));
              }).catch((error) => {
              if (error.response.status == 401) {
              this.$router.push('/login');
              this.$toaster.error(this.$i18n.t('message.token_expired'));
            }else{
                that.$toaster.error(that.$i18n.t('message.fail_customer_add_new'));
                }
                // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
                that.$nuxt.$loading.finish();
              });
            }
            that.close();
          }
        },

        handleDelete(){
          let that = this;
          that.$nuxt.$loading.start();
            if (this.editMode) {
                that.$store.dispatch('customerServices/delete', that.editedItem.id).then(() => {
                    that.$nuxt.$loading.finish();
                    that.reloadList();
                    that.$toaster.success(that.$i18n.t('message.success_cusromer_delete'));
                }).catch((error) => {
                    if (error.response.status == 401) {
                        that.$router.push('/login');
                        that.$toaster.error(that.$i18n.t('message.token_expired'));
                    } else {
                        that.$toaster.error(that.$i18n.t('message.fail_customer_delete'));
                    }
                    that.$nuxt.$loading.finish();
                });
                that.close();

            }

        },
  
        reloadList(){
          this.$emit('reloadList');
        },
      },
    };
  </script>
  
  <style scoped>
  
  </style>
  
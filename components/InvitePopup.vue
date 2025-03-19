<template>
  <div>
    <v-dialog v-model="openPopup" max-width="1000px" persistent>
      <v-card>
        <v-card-text>
          <div class="popup-header text-center">
            {{ formTitle }}
          </div>
          <v-form ref="form" v-model="valid" lazy-validation>
            <b-row v-if="!editMode">
              <b-col cols="8">
                <div class="input-wrap">
                  <v-checkbox v-model="importInvite" label="Import csv file" class="margin-right-sm mt-0" />
                </div>
              </b-col>
            </b-row>
            <div v-if="!importInvite">
              <b-row v-if="!(openProfilePopup)" align-h="center" class="upload-document pb-4">
                <b-col v-if="!previewUrl" cols="4" class="text-center upload-field">
                  <div @click="showAttachment">
                    <img src="../assets/images/icon/new-icon-upload.png" class="image-upload" alt="avatar">
                  </div>
                </b-col>
                <b-col v-else cols="4">
                  <div class="logo-wrapper" @click="showAttachment">
                    <img v-bind:src="previewUrl" alt="avatar">
                  </div>
                </b-col>
              </b-row>
              <b-row>
                <b-col cols="6">
                  <div class="input-wrap">
                    <v-text-field v-model="editedItem.first_name" label="First name" :rules="required" outlined />
                  </div>
                </b-col>
                <b-col cols="6">
                  <div class="input-wrap">
                    <v-text-field v-model="editedItem.last_name" label="Last name" outlined />
                  </div>
                </b-col>
                <b-col cols="6">
                  <div class="input-wrap">
                    <v-select v-model="editedItem.company_id" :items="!editMode ? availableCompanyArray : companyArray"
                      item-text="name" item-value="id" :label="$t('form.company')" :rules="required" :disabled="editMode"
                      @change="handleCompany(editedItem.company_id)" outlined />
                  </div>
                </b-col>
                <b-col cols="6">
                  <div class="input-wrap">
                    <v-text-field v-model="editedItem.email" :label="$t('form.email')" :rules="emailRules" outlined />
                  </div>
                </b-col>
                <b-col cols="6">
                  <div class="input-wrap">
                    <v-text-field v-model="phoneNumber" :label="$t('form.phone_number')" :rules="phoneNumberRule" outlined
                      maxlength="10" @keypress="onlyNumber" />
                  </div>
                </b-col>
                <b-col cols="6">
                  <div class="input-wrap">
                    <v-text-field v-model="personalNumber" :label="$t('form.personal_number')" :rules="personalNumberRule"
                      outlined maxlength="12" @keypress="onlyNumber" />
                  </div>
                </b-col>
                <b-col cols="6">
                  <div class="input-wrap">
                    <v-text-field v-model="editedItem.address" :label="$t('form.address')" outlined />
                  </div>
                </b-col>
                <b-col cols="6">
                  <div class="input-wrap">
                    <v-text-field v-model="editedItem.city" :label="$t('form.city')" :rules="cityRule" outlined />
                  </div>
                </b-col>
                <b-col cols="6">
                  <div class="input-wrap">
                    <v-text-field v-model="editedItem.zip_code" label="Zip code" :rules="zipCodeRule" outlined
                      maxlength="4" @keypress="onlyNumber" />
                  </div>
                </b-col>
                <b-col v-if="!openProfilePopup" cols="6">
                  <div class="input-wrap">
                    <v-select v-model="editedItem.department_id" item-value="id" item-text="name"
                      :items="!editMode ? departmentsArray : editedItem.department" :label="$t('form.department')"
                      outlined @change="handleDepartment" />
                  </div>
                </b-col>
                <b-col v-if="!openProfilePopup" cols="6">
                  <div class="input-wrap">
                    <v-select v-model="editedItem.job_title_id" :items="!editMode ? jobTitleArray : editedItem.job_title"
                      item-text="name" item-value="id" :label="$t('form.job_title')" outlined />
                  </div>
                </b-col>

              </b-row>
            </div>
            <div v-if="importInvite">
              <b-row>
                  <b-col cols="6">
                      <div class="input-wrap">
                        <v-select v-model="editedItem.company_id" :items="!editMode ? availableCompanyArray : companyArray"
                          item-text="name" item-value="id" :label="$t('form.company')" :rules="required" :disabled="editMode"
                          @change="handleCompany(editedItem.company_id)" outlined />
                      </div>
                    </b-col>
                </b-row>
              <b-row>
                  <b-col>
                  <div class="fs-16">
                    You can download the sample file here
                    <span class="link-item" @click="downloadCvsFile"> csv </span> / <span class="link-item" @click="downloadXmlFile"> xls </span>
                  </div>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <div class="section-connect-to section-upload-document">
                    <div class="section-connect-to-label">Upload csv file</div>
                    <div class="mt-5 input-wrap">
                      <v-file-input v-if="editMode && editedItem.uri" v-model="selectedFile"
                        :placeholder="editedItem.original_file_name" />
                      <v-file-input v-else v-model="selectedFile" accept=".csv,.xls" :rules="required"
                        @change="changedImportFile" />
                    </div>
                  </div>
                </b-col>
              </b-row>
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions class="popup-footer">
          <v-spacer />
          <v-btn class="btn-cancel" text @click="close">
            {{ $t('button.cancel') }}
          </v-btn>
          <v-btn v-if="!checkAdmin" class="btn-save" :disabled="!checkValidFile" @click="save">
            {{ editMode ? $t('button.update') : $t('button.save') }}
          </v-btn>
          <v-btn v-if="editMode" class="hse-btn-delete" text @click="dialogDelete = true">
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
          <v-btn class="btn-save" @click="handleDelete()">
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
            No
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <AttachmentPopup :open-attachment-popup="checkAttachmentOpen" :type="'attachment'" :image-item="previewUrl"
      :added-from="document_added_from" :is-image="true" @closePopup="checkAttachmentOpen = !checkAttachmentOpen"
      @getImage="getImage" />
  </div>
</template>

<script>
import { _ } from 'vue-underscore';
import cookies from "js-cookie";
import AttachmentPopup from "./AttachmentPopup";
import {downloadFile} from "../utils/downloadFile";

export default {
  name: "InvitePopup",
  components: {
    AttachmentPopup,
  },
  props: {
    EditId: {
          type: Number,
          required: false,
        },
    openPopup: {
      type: Boolean,
      required: false,
    },
    openProfilePopup: {
      type: Boolean,
      required: false,
    },
    companyArray: {
      type: Array,
      required: false,
    },
  },
  data: () => ({
    checkAdmin: cookies.get('checkAdmin'),
    baseUrl: cookies.get('baseUrl'),
    valid: true,
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
        if (v && v.length > 0 && !/^((\d{3})+(\s)+(\d{2})+(\s)+(\d{3})|\d{3})?$/.test(v))
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
    editedItem: {
      company_id: "",
      department_id: "",
      job_title_id: "",
      nearest_manager: "",
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
      added_by: "",
      status: 1,
    },
    defaultItem: {
      company_id: "",
      department_id: "",
      job_title_id: "",
      nearest_manager: "",
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
      added_by: "",
      status: 1,
    },

    dialogConfirmClose: false,
    formDirty: false,
    previewUrl: null,
    phoneNumber: '',
    personalNumber: '',
    companyID: '',
    formTitle: '',
    editMode: true,
    departmentsArray: [],
    availableCompanyArray: [],
    jobTitleArray: [],
    checkAttachmentOpen: false,
    document_added_from: 'employee',
    dialogDelete: false,
    importInvite: false,
    selectedFile: [],
    checkValidFile: true,
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

  mounted() { },

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
      this.editMode = false;
      this.formTitle = this.$i18n.t('title.new_invite');
      this.$store.dispatch('companies/index').then(result => {
        this.availableCompanyArray = result.data;
      }).catch((error) => {
        if (error.response.status == 401) {
          this.$router.push('/login');
          this.$toaster.error(this.$i18n.t('message.token_expired'));
        } else {
          this.$toaster.error(this.$i18n.t('message.fail_company_view'));
        }
        // this.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        this.$nuxt.$loading.finish();
      });

    },

    editItem(id) {
      let that = this;
      that.formDirty = false;
      that.$nuxt.$loading.start();
      that.formTitle = that.$i18n.t('title.edit_invite');
      that.$store.dispatch('invites/show',id).then(result => {
        that.editedItem = Object.assign({}, result.data);
        that.phoneNumber = that.editedItem.phone_number;
        that.personalNumber = that.editedItem.personal_number;
        that.$nuxt.$loading.finish();
      }).catch((error) => {
        if (error.response.status == 401) {
          this.$router.push('/login');
          this.$toaster.error(this.$i18n.t('message.token_expired'));
        } else {
          that.$toaster.error(that.$i18n.t('message.fail_user_view_detail'));
        }
        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });
      that.originData = _.clone(that.editedItem);
    },

    handleDelete() {
      let that = this;
      if (that.editedItem) {
        that.$store.dispatch('invites/delete', that.editedItem.id).then(() => {
          that.close();
          that.$nuxt.$loading.finish();
          that.reloadList();
          that.$toaster.success(that.$i18n.t('message.success_invite_delete'));
        }).catch((error) => {
          if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          } else {
            that.$toaster.error(that.$i18n.t('message.fail_invite_delete'));
          }
          that.$nuxt.$loading.finish();
        });

      }
    },

    handleCompany(company) {
      this.companyID = company
      let that = this;
      // list departments
      that.$store.dispatch('departments/list', {
        company_id: this.companyID,
      }).then(result => {
        that.departmentsArray = result.data;
      }).catch((error) => {
        if (error.response.status == 401) {
          that.$router.push('/login');
          that.$toaster.error(that.$i18n.t('message.token_expired'));
        } else {
          that.$toaster.error(that.$i18n.t('message.fail_department_view'));
        }
      });
    },

    handleDepartment(value) {
      let that = this;
      // list job title
      that.$store.dispatch('jobTitles/list', {
        department_id: value,
        company_id: that.companyID
      }).then(result => {
        that.jobTitleArray = result.data
      }).catch((error) => {
        if (error.response.status == 401) {
          that.$router.push('/login');
          that.$toaster.error(that.$i18n.t('message.token_expired'));
        } else {
          that.$toaster.error(that.$i18n.t('message.fail_job_title_view'));
        }
      });
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

        that.phoneNumber = str.slice(0, position) + sub + str.slice(position);
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
      this.dialogDelete = false;
      this.formDirty = false;
      this.phoneNumber = '';
      this.personalNumber = '';
      this.selectedFile = [];
      this.previewUrl = null;
      this.checkValidFile = true;
      this.importInvite = false;
      this.$emit('closePopup');
      this.$router.push('/admin/overview/invites');
    },

    closeDelete() {
      this.dialogDelete = false;
    },

    reset() {
      this.$nuxt.$loading.finish();
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        // this.$refs.form.reset();
        this.$refs.form.resetValidation();
      }, 0);
    },

    changedImportFile() {
      if (this.selectedFile) {
        this.checkValidFile = this.selectedFile.type == "application/vnd.ms-excel" || this.selectedFile.type == "text/csv";
      }
    },

    save() {
      let that = this;
      if (that.importInvite) {
        let formData = new FormData();
        formData.append('file', that.selectedFile);
        formData.append('company_id', that.editedItem.company_id)

        that.$store.dispatch('invites/import', formData).then(function () {
          that.reloadList();
          that.$toaster.success(that.$i18n.t('message.success_import'));
        }).catch((error) => {
          if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          } else {
            that.$toaster.error(that.$i18n.t('message.fail_to_import'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
        that.close();
      } else {
        if (that.$refs.form.validate()) {

          that.$nuxt.$loading.start();
          that.editedItem.phone_number = that.phoneNumber;
          that.editedItem.personal_number = that.personalNumber;
          // update
          if (that.editMode) {
            that.$store.dispatch('invites/update', that.editedItem).then(function () {
              that.reloadList();
              that.$toaster.success(that.$i18n.t('message.success_invite_update'));
            }).catch((error) => {
              if (error.response.status == 401) {
                this.$router.push('/login');
                this.$toaster.error(this.$i18n.t('message.token_expired'));
              } else {
                that.$toaster.error(that.$i18n.t('message.fail_user_update'));
              }
              // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
              that.$nuxt.$loading.finish();
            });
          } else {
            // create
            that.$store.dispatch('invites/store', that.editedItem).then(function () {
              that.reloadList();
              that.$toaster.success(that.$i18n.t('message.success_invite_add'));
            }).catch((error) => {
              if (error.response.status == 401) {
                this.$router.push('/login');
                this.$toaster.error(this.$i18n.t('message.token_expired'));
              } else {
                that.$toaster.error(that.$i18n.t('message.fail_user_add_new'));
              }
              // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
              that.$nuxt.$loading.finish();
            });
          }
          that.$nuxt.$loading.finish();
          that.close();
        }
      }
    },

    reloadList() {
      this.$emit('reloadList');
    },

    previewImage(file) {
      if (file) {
        this.previewUrl = URL.createObjectURL(file);
        this.selectedFile = file;
      } else {
        this.previewUrl = null;
        this.selectedFile = null;
      }
    },

    downloadCvsFile() {
      downloadFile(this.baseUrl + '/api/v1/uploads/invites/invites.csv', 'invites.csv');
    },

    downloadXmlFile() {
      downloadFile(this.baseUrl + '/api/v1/uploads/invites/invites.xls', 'invites.xls');
    },

    showAttachment() {
      if (!this.editMode) {
        this.checkAttachmentOpen = true;
      }
    },
    getImage(file) {
      this.previewImage(file.imageFile);
    },
  },
};
</script>

<style scoped></style>

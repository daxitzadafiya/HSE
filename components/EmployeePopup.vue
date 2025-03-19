<template>
  <div>
    <v-dialog v-model="openPopup" max-width="1000px" persistent>
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
            <b-row v-if="!editMode">
              <b-col cols="8">
                <div class="input-wrap">
                  <v-checkbox
                    v-model="importEmployees"
                    label="Import csv file"
                    class="margin-right-sm mt-0"
                  />
                </div>
              </b-col>
            </b-row>
            <div v-if="!importEmployees">
              <b-row v-if="!(openProfilePopup || openEmploymentPopup)" align-h="center" class="upload-document pb-4">
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
                <b-col v-if="!openEmploymentPopup" cols="6">
                  <div class="input-wrap">
                    <v-text-field v-model="editedItem.first_name" label="First name" :rules="required" outlined />
                  </div>
                </b-col>
                <b-col v-if="!openEmploymentPopup" cols="6">
                  <div class="input-wrap">
                    <v-text-field v-model="editedItem.last_name" label="Last name" :rules="required" outlined />
                  </div>
                </b-col>
                <b-col v-if="!openEmploymentPopup" cols="6">
                  <div class="input-wrap">
                    <v-text-field v-model="editedItem.email" :label="$t('form.email')" :rules="emailRules" outlined />
                  </div>
                </b-col>
                <b-col v-if="!openEmploymentPopup" cols="6">
                  <div class="input-wrap">
                    <v-text-field v-model="editedItem.address" :label="$t('form.address')" :rules="required" outlined />
                  </div>
                </b-col>
                <b-col v-if="!openEmploymentPopup" cols="6">
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
                <b-col v-if="!openEmploymentPopup" cols="6">
                  <div class="input-wrap">
                    <v-text-field v-model="editedItem.city" :label="$t('form.city')" outlined />
                  </div>
                </b-col>
                <b-col v-if="!openEmploymentPopup" cols="6">
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
                <b-col v-if="!openEmploymentPopup" cols="6">
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
                <b-col v-if="!openProfilePopup" cols="6">
                  <div class="input-wrap">
                    <v-select
                      v-model="editedItem.department_id"
                      item-value="id"
                      item-text="name"
                      :items="departmentsValidArray"
                      :label="$t('form.department')"
                      :rules="required"
                      outlined
                      @change="updateDepartment"
                    />
                  </div>
                </b-col>
                <b-col v-if="!openProfilePopup" cols="6">
                  <div class="input-wrap">
                    <v-select
                      v-model="editedItem.job_title_id "
                      :items="jobTitleArray"
                      item-text="name"
                      item-value="id"
                      :label="$t('form.job_title')"
                      :rules="required"
                      outlined
                    />
                  </div>
                </b-col>
                <b-col v-if="!openProfilePopup" cols="6">
                  <div class="input-wrap">
                    <v-select
                      v-model="editedItem.nearest_manager"
                      :items="managerArray"
                      item-text="name"
                      item-value="id"
                      :label="$t('form.nearest_manager')"
                      :rules="required"
                      outlined
                    />
                  </div>
                </b-col>
                <!-- NOT need in mvp
                <b-col cols="6">
                  <div class="input-wrap">
                    <v-text-field v-model="editedItem.tax" label="Tax" type="number" outlined />
                  </div>
                </b-col>
                <b-col cols="6">
                  <div class="input-wrap">
                    <v-text-field v-model="editedItem.hourly_salary" label="Hourly salary" type="number" :rules="required" outlined />
                  </div>
                </b-col>
                <b-col cols="6">
                  <div class="input-wrap">
                    <v-slider
                      v-model="editedItem.overtime_pay"
                      label="Overtime pay (%)"
                      max="250"
                      min="40"
                      :thumb-size="24"
                      thumb-label="always"
                      class="mt-4"
                    />
                  </div>
                </b-col>
                <b-col cols="6">
                  <div class="input-wrap">
                    <v-text-field v-model="editedItem.night_allowance" type="number" label="Night allowance" outlined />
                  </div>
                </b-col>
                <b-col cols="6">
                  <div class="input-wrap">
                    <v-select
                      v-model="editedItem.holidays"
                      :items="holidayArray"
                      item-text="name"
                      item-value="value"
                      :rules="required"
                      label="Holidays"
                      outlined
                    />
                  </div>
                </b-col>
                -->
              </b-row>
            </div>
            <div v-else>
              <b-row>
                <b-col>
                  <div class="fs-16">
                    You can download the sample file
                    <span class="link-item" @click="downloadSampleFile">here</span>
                  </div>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <div class="section-connect-to section-upload-document">
                    <div class="section-connect-to-label">Upload csv file</div>
                    <div class="mt-5 input-wrap">
                      <v-file-input
                        v-if="editMode && editedItem.uri"
                        v-model="selectedFile"
                        :placeholder="editedItem.original_file_name"
                      />
                      <v-file-input
                        v-else
                        v-model="selectedFile"
                        accept=".csv"
                        :rules="required"
                        @change="changedImportFile"
                      />
                    </div>
                  </div>
                </b-col>
              </b-row>
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions class="popup-footer">
          <v-spacer />
          <v-btn class="btn-cancel" text @click="checkDirtyBeforeClose">
            {{ $t('button.cancel') }}
          </v-btn>
          <v-btn
            v-if="checkAdmin"
            class="btn-save"
            :disabled="!checkValidFile"
            @click="save"
          >
            {{ $t('button.save') }}
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

    <AttachmentPopup
      :open-attachment-popup="checkAttachmentOpen"
      :type="'attachment'"
      :image-item="previewUrl"
      :added-from="document_added_from"
      :is-image="true"
      @closePopup="checkAttachmentOpen = !checkAttachmentOpen"
      @getImage="getImage"
    />
  </div>
</template>

<script>
  import {_} from 'vue-underscore';
  // import moment from 'moment';
  // import {mapState} from "vuex";
  import cookies from "js-cookie";
  import {downloadFile} from "../utils/downloadFile";
  import AttachmentPopup from "./AttachmentPopup";

  export default {
    name: "EmployeePopup",
    components: {
      AttachmentPopup,
    },
    props: {
      employeeItem: {
        type: Object,
        required: false,
      },
      openPopup: Boolean,
      openProfilePopup: {
        type: Boolean,
        required: false,
      },
      openEmploymentPopup: {
        type: Boolean,
        required: false,
      },
      managerArray: {
        type: Array,
        required: false,
      },
    },
    data: () => ({
      permissionsUser: localStorage.getItem('permissionsKey'),
      userRoleId: parseInt(cookies.get('roleID')),
      userDepartmentID: parseInt(cookies.get('userDepartmentID')),
      checkAdmin: cookies.get('checkAdmin'),
      roleUser: cookies.get('roleUser'),
      userID: parseInt(cookies.get('userID')),
      baseUrl: cookies.get('baseUrl'),
      nowDate: new Date().toISOString().substr(0, 10),
      pageKey: 'employees-overview-employees',
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
          if (!v || v.length < 1)
            return 'This is required';
          else if (!/^(\d{6})+(\s)+(\d{5})$/.test(v))
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
        user_id: "",
        role_id: "",
        first_name: "",
        last_name: "",
        email: "",
        address: "",
        city: "",
        phone_number: "",
        personal_number: "",
        avatar: "",
        zip_code: "",
        status: "pending",
        department_id: "",
        job_title_id : "",
        nearest_manager: "",
        hourly_salary: "",
        overtime_pay: "",
        night_allowance: "",
        holidays: "",
        tax: "",
        editPermission: true,
      },
      defaultItem: {
        user_id: "",
        role_id: "",
        first_name: "",
        last_name: "",
        email: "",
        address: "",
        city: "",
        phone_number: "",
        personal_number: "",
        avatar: "",
        zip_code: "",
        status: "pending",
        department_id: "",
        job_title_id : "",
        nearest_manager: "",
        hourly_salary: "",
        overtime_pay: "",
        night_allowance: "",
        holidays: "",
        tax: "",
        editPermission: true,
      },
      holidayArray: [
        {name: 'None', value: 0},
        {name: '4 weeks', value: 4},
        {name: '5 weeks', value: 5},
        {name: '6 weeks', value: 6},
        {name: '7 weeks', value: 7},
        {name: '8 weeks', value: 8},
        {name: '9 weeks', value: 9},
        {name: '10 weeks', value: 10},
      ],
      formTitle: '',
      editMode: true,
      formDirty: false,
      departmentsArray: [],
      departmentsValidArray: [],
      previewUrl: null, // upload avatar
      document_added_from: 'employee', // employee
      // document_added_from: 4, // employee
      // document_type: 'attachment',
      // document_category: 9, // Avatar,
      jobTitleArray: [],
      phoneNumber: '',
      personalNumber: '',
      // listNearestManager: '',
      dialogConfirmClose: false,
      importEmployees: false,
      selectedFile: [],
      checkValidFile: true,
      checkAttachmentOpen: false,
    }),

    computed: {},

    watch: {
      openPopup(value) {
        if (value) {
          if (this.employeeItem) {
            this.editItem(this.employeeItem);
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

    mounted() {
      let that = this;
      that.$nextTick(() => {
        that.$nuxt.$loading.start();
        // list nearest manager = admin + all managers
        // that.$store.dispatch('employees/index').then(result => {
        //   that.listNearestManager = _.filter(result.data, function (item) {
        //     return item.role_id === 2 || item.role_id === 3;
        //   });
        //   // that.updateDepartment();
        // }).catch((error) => {
        //   that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        //   that.$nuxt.$loading.finish();
        // });

        // list departments
        that.$store.dispatch('departments/index').then(result => {
          that.departmentsArray = result.data;
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }
          // that.$toaster.error(that.$i18n.t('message.fail_department_view'));
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      });
    },

    created() {
      if (this.openPopup) {
        if (this.employeeItem) {
          this.editItem(this.employeeItem);
        } else {
          this.addNew();
        }
      }
    },

    methods: {
      addNew() {
        this.reset();
        this.editMode = false;
        this.formTitle = this.$i18n.t('title.new_employee');
        this.departmentsValidArray = _.filter(this.departmentsArray, function (item) {
          return !item.disable_status;
        });
      },

      editItem(item) {
        let that = this;
        that.formDirty = false;
        that.formTitle = that.$i18n.t('title.edit_employee');
        that.editedItem = Object.assign({}, item);
        that.originData = _.clone(this.editedItem);
        that.phoneNumber = that.editedItem.phone_number;
        that.personalNumber = that.editedItem.personal_number;

        let departmentId = that.editedItem.department_id;
        that.departmentsValidArray = _.filter(this.departmentsArray, function (item) {
          return (!item.disable_status || (item.disable_status && item.id === departmentId));
        });

        that.updateDepartment();
      },

      checkDirtyBeforeClose(){
        if(this.checkDirtyForm()){
          this.dialogConfirmClose = true;
        }else{
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
        this.importEmployees = false;
        this.selectedFile = [];
        this.previewUrl = null;
        this.checkValidFile = true;
        this.phoneNumber = '';
        this.personalNumber = '';
        this.$emit('closePopup');
      },

      reset() {
        this.$nuxt.$loading.finish();
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          // this.$refs.form.reset();
          this.$refs.form.resetValidation();
        }, 300);
      },

      reloadList(){
        this.$emit('reloadList');
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

      updateDepartment() {
        let that = this;
        // list job title
        if (that.editedItem.department_id) {
          that.$store.dispatch('jobTitles/index', {department_id: that.editedItem.department_id}).then(result => {
            let jobTitleId = that.editedItem.job_title_id;
            that.jobTitleArray = _.filter(result.data, function (item) {
              return (!item.disable_status || (item.disable_status && item.id === jobTitleId));
            });
          }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }
            // that.$toaster.error(that.$i18n.t('message.fail_job_title_view'));
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish();
          });
        }
      },

      changedImportFile() {
        if (this.selectedFile) {
          // this.checkValidFile = !!this.selectedFile.type.match('application/vnd.ms-excel');
          this.checkValidFile = !!this.selectedFile.type.match('.csv');
        }
      },

      save() {
        let that = this;
        if (that.importEmployees) {
          let formData = new FormData();
          formData.append('file', that.selectedFile);
          that.$store.dispatch('employees/import', formData).then(function () {
            that.reloadList();
            that.$toaster.success(that.$i18n.t('message.success_import'));
          }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
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
            let file = that.selectedFile;
            if (that.editMode) {
              // update user table
              if (that.openProfilePopup) {
                that.editedItem.isEditUser = 1;
                that.$store.dispatch('employees/update', that.editedItem).then(function () {
                  that.reloadList();
                  that.$toaster.success(that.$i18n.t('message.success_employee_update'));
                }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
                  that.$toaster.error(that.$i18n.t('message.fail_employee_update'));
                  }
                  // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
                  that.$nuxt.$loading.finish();
                });
              } else {
                // update employee table
                that.$store.dispatch('employees/update', that.editedItem).then(result => {
                  if (file.length !== 0) {
                    that.savePicture(file, result.data);
                  } else {
                    that.reloadList();
                    that.$toaster.success(that.$i18n.t('message.success_employee_update'));
                  }
                }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
                  that.$toaster.error(that.$i18n.t('message.fail_employee_update'));
                  }
                  // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
                  that.$nuxt.$loading.finish();
                });
              }
            } else {
              that.$store.dispatch('employees/store', that.editedItem).then(result => {
                if (file.length !== 0) {
                  that.savePicture(file, result.data);
                } else {
                  that.reloadList();
                  that.$toaster.success(that.$i18n.t('message.success_employee_add_new'));
                }
              }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
                that.$toaster.error(that.$i18n.t('message.fail_employee_add_new'));
                }
                // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
                that.$nuxt.$loading.finish();
              });
            }
            that.close();
          }
        }
      },

      savePicture(selectedFile, employee) {
        let that = this;
        let formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('original_file_name', selectedFile.name);
        formData.append('file_size', selectedFile.size);
        formData.append('status', 1); // 0: draft, 1: public
        formData.append('name', employee.first_name + '_' + employee.last_name + " avatar");
        formData.append('type', 'attachment');
        formData.append('object_type', 'employee');
        formData.append('object_id', employee.user_id);
        formData.append('category_id', 8); // avatar
        formData.append('category_name', "Avatar");
        formData.append('is_renewed', 0);
        that.$store.dispatch('documents/store', formData).then(function () {
          that.reloadList();
          that.editedItem = that.defaultItem;
          if (that.editMode) {
            that.$toaster.success(that.$i18n.t('message.success_employee_update'));
          } else {
            that.$toaster.success(that.$i18n.t('message.success_employee_add_new'));
          }
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_to_upload_avatar'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
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

      downloadSampleFile() {
        downloadFile(this.baseUrl + '/api/v1/uploads/documents/totalhms_users.csv', 'totalhms_users.csv');
      },

      // show image
      showAttachment(){
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

<style scoped>

</style>

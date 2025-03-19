<template>
  <div>
    <div class="name-page">
      {{ $t('title.my_profile') }}
    </div>
    <v-container>
      <v-row class="justify-content-md-center">
        <v-col cols="8">
          <v-card width="100%">
            <v-container>
              <v-row justify="space-around" class="mt-5 pb-7">
                <div class="logo-wrapper" @click="showEditLogoModal">
                  <img v-if="!profileInfo.avatar" src="~/assets/images/common/no-image-available.jpg" alt="logo">
                  <img v-if="profileInfo.avatar" :src="profileInfo.avatar" alt="logo">
                </div>
              </v-row>
              <div class="hse-preview-detail-info">
                <b-row class="sm-padding-row">
                  <b-col cols="6" class="info-key text-right">First name</b-col>
                  <b-col cols="6" class="input-wrap text-left">{{ profileInfo.first_name }}</b-col>
                </b-row>
                <b-row class="sm-padding-row">
                  <b-col cols="6" class="info-key text-right">Last name</b-col>
                  <b-col cols="6" class="input-wrap text-left">{{ profileInfo.last_name }}</b-col>
                </b-row>
                <b-row class="sm-padding-row">
                  <b-col cols="6" class="info-key text-right">Email</b-col>
                  <b-col cols="6" class="input-wrap text-left">{{ profileInfo.email }}</b-col>
                </b-row>
                <b-row class="sm-padding-row">
                  <b-col cols="6" class="info-key text-right">Company Name</b-col>
                  <b-col cols="6" class="input-wrap text-left">{{ profileInfo.company_name }}</b-col>
                </b-row>
                <b-row class="sm-padding-row">
                  <b-col cols="6" class="info-key text-right">Role</b-col>
                  <b-col cols="6" class="input-wrap text-left">{{ profileInfo.role_name }}</b-col>
                </b-row>
                <b-row class="sm-padding-row">
                  <b-col cols="6" class="info-key text-right">Phone number</b-col>
                  <b-col cols="6" class="input-wrap text-left">{{ profileInfo.phone_number }}</b-col>
                </b-row>
                <b-row class="sm-padding-row">
                  <b-col cols="6" class="info-key text-right">Personal number</b-col>
                  <b-col cols="6" class="input-wrap text-left">{{ profileInfo.personal_number }}</b-col>
                </b-row>
                <b-row class="sm-padding-row">
                  <b-col cols="6" class="info-key text-right">Address</b-col>
                  <b-col cols="6" class="input-wrap text-left">{{ profileInfo.address }}</b-col>
                </b-row>
                <b-row class="sm-padding-row">
                  <b-col cols="6" class="info-key text-right">City</b-col>
                  <b-col cols="6" class="input-wrap text-left">{{ profileInfo.city }}</b-col>
                </b-row>
                <b-row class="sm-padding-row">
                  <b-col cols="6" class="info-key text-right">Zip code</b-col>
                  <b-col cols="6" class="input-wrap text-left">{{ profileInfo.zip_code }}</b-col>
                </b-row>
<!--                <b-row class="sm-padding-row">-->
<!--                  <b-col cols="6" class="info-key text-right">New Password</b-col>-->
<!--                  <b-col cols="6" class="input-wrap text-left"></b-col>-->
<!--                </b-row>-->
<!--                <b-row class="sm-padding-row">-->
<!--                  <b-col cols="6" class="info-key text-right">Confirm New Password</b-col>-->
<!--                  <b-col cols="6" class="input-wrap text-left"></b-col>-->
<!--                </b-row>-->
              </div>
              <v-dialog v-model="dialog" max-width="800px" persistent>
                <v-card>
                  <v-card-text>
                    <div class="popup-header text-center">
                      {{ $t('title.my_profile') }}
                    </div>
                    <v-form
                      ref="form"
                      v-model="valid"
                      lazy-validation
                    >
                      <b-row>
                        <b-col cols="6">
                          <div class="input-wrap">
                            <v-text-field v-model="profileEdit.first_name" label="First name" :rules="required" outlined />
                          </div>
                        </b-col>
                        <b-col cols="6">
                          <div class="input-wrap">
                            <v-text-field v-model="profileEdit.last_name" label=" Last name" :rules="required" outlined />
                          </div>
                        </b-col>
                      </b-row>

                      <b-row>
                        <b-col>
                          <div class="input-wrap">
                            <v-text-field v-model="profileEdit.email" :label="$t('form.email')" :rules="required" outlined disabled />
                          </div>
                        </b-col>
                      </b-row>

                      <b-row>
                        <b-col cols="6">
                          <div class="input-wrap">
                            <v-text-field v-model="profileEdit.company_name" label="Company name" :rules="required" outlined disabled />
                          </div>
                        </b-col>
                        <b-col cols="6">
                          <div class="input-wrap">
                            <v-text-field v-model="profileEdit.role_name" :label="$t('form.role')" :rules="required" outlined disabled />
                          </div>
                        </b-col>
                      </b-row>

                      <b-row>
                        <b-col cols="6">
                          <div class="input-wrap">
                            <v-text-field v-model="profileEdit.phone_number" :label="$t('form.phone_number')" type="number" :rules="required" outlined />
                          </div>
                        </b-col>
                        <b-col cols="6">
                          <div class="input-wrap">
                            <v-text-field v-model="profileEdit.personal_number" :label="$t('form.personal_number')" :rules="required" outlined />
                          </div>
                        </b-col>
                      </b-row>

                      <b-row>
                        <b-col>
                          <div class="input-wrap">
                            <v-text-field v-model="profileEdit.address" :label="$t('form.address')" :rules="required" outlined />
                          </div>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col cols="6">
                          <div class="input-wrap">
                            <v-text-field v-model="profileEdit.city" :label="$t('form.city')" :rules="required" outlined />
                          </div>
                        </b-col>
                        <b-col cols="6">
                          <div class="input-wrap">
                            <v-text-field v-model="profileEdit.zip_code" label="Zip code" :rules="required" outlined />
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
                      {{ $t('button.save') }}
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-container>
            <div class="box-footer">
              <div class="text-right">
                <button class="btn btn-default btn-edit-footer" @click="btnEdit">{{ $t('button.edit') }}</button>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!--    dialog avatar edit-->
    <v-dialog v-model="dialogLogo" max-width="600px">
      <v-card class="dialog-logo">
        <v-card-text>
          <div class="popup-header text-center">
            <h4>Update logo</h4>
          </div>
          <div class="logo-modal-content">
            <div class="bs-callout bs-callout-info">
              Logoen vil bli plassert innenfor et område på 56 x 22 mm på forsendelser som faktura, tilbud, ordrebekrefelse og lignende.
            </div>
            <div class="hse-preview-image text-center">
              <div v-if="previewUrl">
                <img v-bind:src="previewUrl" alt="logo">
              </div>
              <div v-if="!previewUrl">
                <img src="~/assets/images/common/no-image-available.jpg" alt="logo">
              </div>
            </div>
            <div class="input-image">
              <v-file-input
                accept="image/png, image/jpeg, image/jpg"
                placeholder="Pick a picture"
                prepend-icon="mdi-camera"
                label="Logo"
                @change="previewImage"
              />
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="popup-footer">
          <v-spacer />
          <v-btn class="btn-cancel" text @click="dialogLogo = false">
            Cancel
          </v-btn>
          <v-btn class="btn-save" @click="updateLogo()">
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
  import {_} from 'vue-underscore';
  import axios from "axios";

  export default {
    data: () => ({
      valid: true,
      editedIndex: -1,
      required: [
        v => !!v || 'This is required'
      ],
      profileInfo: {},
      profileEdit: {},
      dialog: false,
      dialogLogo: false, // upload avatar
      previewUrl: null, // upload avatar
      document_level: 2, //  employee
      document_added_from: 4, // employee
      document_type: 'attachment',
      category_id: 9, // Avatar
    }),
    computed: {},

    mounted() {
      let that = this;
      that.$nextTick(() => {
        that.$nuxt.$loading.start();
        //Get current user profile
        that.$store.dispatch('authenticate/profile').then(result => {
          that.profileInfo = result.data;
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_employee_view_detail'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      });
    },

    methods: {
      save() {
        let that = this;
        if (that.$refs.form.validate()) {
          that.$nuxt.$loading.start();
          that.$store.dispatch('users/update', that.profileEdit).then(function() {
            that.profileInfo = that.profileEdit;
            that.$nuxt.$loading.finish();
            that.$toaster.success(that.$i18n.t('message.success_employee_update'));
          }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_employee_update'));
            }
            that.$nuxt.$loading.finish();
            // if (error.response && error.response.data) {
            //   that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            // }
          });
          that.close();
        }
      },

      btnEdit() {
        this.reset();
        this.dialog = true;
        this.profileEdit = _.clone(this.profileInfo);
      },

      reset() {
        setTimeout(() => {
          this.$refs.form.resetValidation();
        }, 0);
      },

      close() {
        this.dialog = false;
      },

      // upload avatar
      showEditLogoModal(){
        this.dialogLogo = true;
      },

      previewImage(file){
        if(file){
          this.previewUrl = URL.createObjectURL(file);
          this.selectedLogoFile = file;
        }else{
          this.previewUrl = null;
          this.selectedLogoFile = null;
        }
      },

      updateLogo(){
        let that = this;
        that.$nuxt.$loading.start();
        let formData = new FormData();
        formData.append('file', that.selectedLogoFile);
        formData.append('level', that.document_level);
        formData.append('type', that.document_type);
        formData.append('added_from',  that.document_added_from);
        formData.append('name', that.profileInfo.first_name + '_' + that.profileInfo.last_name + " avatar");
        formData.append('category_id', that.category_id);
        formData.append('attachment_type', 'image');
        formData.append('attachment_updated', true);
        that.$store.dispatch('documents/store', formData).then(function(result){
          that.$nuxt.$loading.finish();
          that.profileInfo.avatar = result.data.url;
          that.$store.dispatch('users/update', that.profileInfo).then(function() {
            that.$nuxt.$loading.finish();
            that.$toaster.success(that.$i18n.t('message.success_employee_update'));
          }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_employee_update'));
            }
            that.$nuxt.$loading.finish();
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage);
          });
          that.dialogLogo = false;
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_document_update'));
          }
          that.$nuxt.$loading.finish();
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage);
        });
      },

      getImageSrc(url){
        let that = this;
        let result;
        axios({
          url: url,
          method: 'GET',
          responseType: 'blob', // important
        }).then((response) => {
          result = window.URL.createObjectURL(new Blob([response.data]));
          that.previewUrl = result;
          return result;
        });
      },
    }
  };
</script>

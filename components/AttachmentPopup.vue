<template>
  <div>
    <v-dialog v-model="openAttachmentPopup" max-width="600px">
      <v-card class="dialog-logo">
        <v-card-text>
          <div class="popup-header text-center">
            <h4>{{ $t('title.upload_image') }}</h4>
          </div>
          <div class="logo-modal-content">
            <div class="hse-preview-image text-center">
              <div v-if="previewUrl">
                <img v-bind:src="previewUrl" alt="img">
              </div>
              <div v-if="!previewUrl">
                <img src="../assets/images/common/no-image-available.jpg" alt="img">
              </div>
            </div>
            <div class="input-image">
              <v-file-input
                v-if="previewUrl"
                :placeholder="!isImage ? attachmentItem.original_file_name : ''"
                accept="image/png, image/jpeg, image/bmp"
                prepend-icon="mdi-camera"
                @change="previewImage"
              />
              <v-file-input
                v-if="!previewUrl"
                accept="image/png, image/jpeg, image/bmp"
                :placeholder="$t('form.pick_an_image')"
                prepend-icon="mdi-camera"
                @change="previewImage"
              />
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="popup-footer">
          <v-spacer />
          <v-btn class="btn-cancel" text @click="close">
            {{ $t('button.cancel') }}
          </v-btn>
          <!-- Logo company -->
<!--          <v-btn-->
<!--            v-if="isLogo && !viewOnly && (checkAdmin || permissionsUser.indexOf('company-basic') > -1)"-->
<!--            class="btn-save"-->
<!--            @click="updateLogo"-->
<!--          >-->
<!--            {{ $t('button.update') }}-->
<!--          </v-btn>-->

          <!-- Avatar employee-->
          <v-btn
            v-if="isAvatar && !viewOnly && (checkAdmin || permissionsUser.indexOf('employee-basic') > -1)"
            class="btn-save"
            @click="updateAvatar"
          >
            {{ $t('button.update') }}
          </v-btn>

          <!-- Upload image in popup -->
          <v-btn
            v-if="isImage && !viewOnly && (checkAdmin || permissionsUser.indexOf('deviation-basic') > -1)"
            class="btn-save"
            @click="updateImage"
          >
            {{ $t('button.update') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  // import {_} from 'vue-underscore';
  import cookies from "js-cookie";
  import axios from "axios";

  export default {
    name: "AttachmentPopup",
    components: {},
    props: {
      openAttachmentPopup: Boolean,
      attachmentItem: {
        type: Object,
        required: false,
      },
      imageItem: {
        type: String,
        required: false,
      },
      addedFrom: {
        type: String,
        required: false,
      },
      type: {
        type: String,
        required: false,
      },
      viewOnly: {
        type: Boolean,
        required: false,
      },
      // isLogo: {
      //   type: Boolean,
      //   required: false,
      // },
      isAvatar: {
        type: Boolean,
        required: false,
      },
      isImage: {
        type: Boolean,
        required: false,
      }
    },
    data: () => ({
      permissionsUser: localStorage.getItem('permissionsKey'),
      checkAdmin: cookies.get('checkAdmin'),
      roleUser: cookies.get('roleUser'),
      required: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else return true;
        }
      ],
      previewUrl: null,
    }),

    computed: {},

    watch: {
      openAttachmentPopup(value) {
        if (value) {
          if (this.attachmentItem) {
            this.editItem(this.attachmentItem);
          }
          // else if (this.imageItem) {
          //   this.showImage(this.imageItem);
          // }
        }
      },
    },

    mounted() {},

    created() {
      if (this.openAttachmentPopup) {
        if (this.attachmentItem) {
          this.editItem(this.attachmentItem);
        }
      }
    },

    methods: {
      editItem(item) {
        this.editedItem = Object.assign({}, item);
        if (item.avatar) {
          this.getImageSrc(item.avatar);
        } else if (item.logo) {
          this.getImageSrc(item.logo);
        } else {
          this.getImageSrc(item.attachment);
        }
      },

      // showImage(item) {
      //   this.previewUrl= item;
      // },

      // show image
      getImageSrc(url) {
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

      close() {
        this.reset();
        this.formDirty = false;
        this.$emit('closePopup');
      },

      reset() {
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          // this.$refs.form.reset();
          // this.$refs.form.resetValidation();
        }, 300);
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

      // updateLogo() {
      //   let that = this;
      //   // that.$nuxt.$loading.start();
      //   that.$store.dispatch('categories/index', {type: 'attachment', name: "Logo"}).then(result => {
      //     let formData = new FormData();
      //     formData.append('file', that.selectedFile);
      //     formData.append('original_file_name', that.selectedFile.name);
      //     formData.append('file_size', that.selectedFile.size);
      //     // formData.append('is_template', 0);
      //     formData.append('status', 1); // 0: draft, 1: public
      //     formData.append('name', that.attachmentItem.name + " logo");
      //     formData.append('type', that.type);
      //     formData.append('object_type', that.addedFrom);
      //     formData.append('category_id', result.data[0].id);
      //     formData.append('category_name', "Logo");
      //     formData.append('is_renewed', 0);
      //     if (that.attachmentItem.logo !== null) { // if update company logo
      //       formData.append('attachment_updated', true);
      //     }
      //     that.$store.dispatch('documents/store', formData).then(function () {
      //       that.reloadCompany();
      //       that.reloadList();
      //       that.$toaster.success(that.$i18n.t('message.success_upload'));
      //     }).catch(() => {
      //       that.$toaster.error(that.$i18n.t('message.fail_to_upload_logo'));
      //       // that.$nuxt.$loading.finish();
      //       // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
      //     });
      //   }).catch(() => {
      //     // that.$toaster.error(that.$i18n.t('message.failed'));
      //     // that.$nuxt.$loading.finish();
      //     // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
      //   });
      //   that.close();
      // },

      updateAvatar() {
        let that = this;
        // that.$nuxt.$loading.start();
        that.$store.dispatch('categories/index', {type: 'attachment', name: "Avatar"}).then(result => {
          let formData = new FormData();
          formData.append('file', that.selectedFile);
          formData.append('original_file_name', that.selectedFile.name);
          formData.append('file_size', that.selectedFile.size);
          formData.append('status', 1); // 0: draft, 1: public
          formData.append('name', that.attachmentItem.first_name + '_' + that.attachmentItem.last_name + " avatar");
          formData.append('type', that.type);
          formData.append('object_type', that.addedFrom);
          formData.append('object_id', that.attachmentItem.user_id);
          formData.append('category_id', result.data[0].id);
          formData.append('category_name', "Avatar");
          formData.append('is_renewed', 0);
          that.$store.dispatch('documents/store', formData).then(function () {
            that.reloadEmployee();
            that.reloadDocument();
            that.$toaster.success(that.$i18n.t('message.success_upload'));
          }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_to_upload_avatar'));
          }
            // that.$nuxt.$loading.finish();
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          });
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }
          // that.$toaster.error(that.$i18n.t('message.failed'));
          // that.$nuxt.$loading.finish();
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        });
        that.close();
      },

      updateImage() {
        this.$emit('getImage', {imageFile: this.selectedFile});
        this.close();
      },

      reloadList(){
        this.$emit('reloadList');
      },

      reloadCompany(){
        this.$emit('reloadCompany');
      },

      reloadDocument(){
        this.$emit('reloadDocument');
      },

      reloadEmployee(){
        this.$emit('reloadEmployee');
      },
    }
  };
</script>

<style scoped>

</style>

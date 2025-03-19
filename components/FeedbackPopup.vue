<template>
    <div>
      <v-dialog v-model="openPopup" max-width="950px" persistent>
        <v-card>
          <v-card-title />
          <v-card-text>
            <v-form
              ref="form"
              v-model="valid"
              lazy-validation
            >
              <div>
                <div class="section-connect-to" :style="custClass ? 'border: 1px solid #ff5252;' : ''" v-if="editedItem?.required_comment == 1">
                  <div class="input-wrap form-description p-3">
                    <FroalaSuggestionListEditor
                    :item="editedItem"
                    :predefined-link-array="predefinedLinkArray"
                  />
                  </div>
                </div>
                <span v-if="custClass && editedItem?.required_comment == 1" class="cust-validation">
                  {{'This is required'}}
                </span>
  
                <!-- Attachment -->
                
                <div class="section-connect-to mt-8" v-if="editedItem?.required_attachment == 1" :style="custClass ? 'border: 1px solid #ff5252;' : ''">
                  <div class="required-upload-attachment p-4">
                    <div class="upload-field text-center p-2">
                      <div v-if="previewUrl">
                        <img class="image-field" v-bind:src="previewUrl" alt="image">
                        <v-file-input
                          v-model="selectedFile"
                          accept="image/png, image/jpeg, image/jpg, image/gif, image/svg"
                          @change="previewImage"
                          :rules="required"
                        />
                      </div>
                      <div v-else class="icon-upload-attachment">
                        <v-file-input
                          v-model="selectedFile"
                          accept="image/png, image/jpeg, image/jpg, image/gif, image/svg"
                          @change="previewImage"
                          :rules="required"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </v-form>
          </v-card-text>
          <v-card-actions class="py-5">
            <v-spacer />
            <v-btn class="btn-cancel my-5" text @click="close">
              {{ $t('button.cancel') }}
            </v-btn>
            <v-btn class="btn-save my-5" text @click="workerFeedback">
              {{ $t('button.done') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
</template>
  <script>
import { removeTagsFromString } from "./common/js/functions"
    import FroalaSuggestionListEditor from './FroalaSuggestionListEditor'
  
    export default {
      name: "FeedbackPopup",
      components: {FroalaSuggestionListEditor},
      props: {
        openPopup: Boolean,
        objectItem: {
          type: Object,
          required: true,
        },
        predefinedLinkArray: {
          type: [Object,Array],
          required: false,
        },
        isResubmit:{
          type:Boolean,
          required:false,
        },
        isResponsibleSubmit:{
          type:Boolean,
          required:false,
        }
      },
      data: () => ({
        valid: true,
        selectedFile: [],
        previewUrl: null,
        required: [
          v => {
            if (!v || v.length < 1)
              return 'This is required';
            else return true;
          }
        ],
        editedItem:{
          description:'',
          required_attachment:'',
          required_comment:'',
          isResponsibleSubmit:false,
        },
          custClass:false
      }),
  
      watch: {
      openPopup(value) {
      if (value) {
        if (this.objectItem) {
          this.editedItem.description = ""
          this.editItem(this.objectItem)
        } else {

          this.reset()
        }
      }
    },
      },
  
      methods: {
        close() {
          if (this.openPopup) {
            this.$emit('closePopup');
          }
          this.reset();
        },
        editItem(item){
          this.editedItem.description = item.comment
          this.editedItem = Object.assign({}, item)
          this.editedItem.isResponsibleSubmit = this.isResponsibleSubmit
        },
  
        reset() {
          this.editedItem.comment = null;
          this.editedItem.responsible_comment = null;
          this.selectedFile = [];
          this.previewUrl = null;
        },
  
        async workerFeedback() {
            this.editedItem.description= await removeTagsFromString(this.editedItem?.description);
            if (this.$refs.form.validate() && (this.editedItem.description != null || this.editedItem.description != 'Powered by Froala Editor' || this.editedItem.description != 'undefined')){
              if ((this.editedItem?.required_comment == 1 || this.editedItem?.required_comment == '1') && (this.editedItem?.description == null || this.editedItem?.description == 'Powered by Froala Editor' || this.editedItem?.description == 'undefined')) {
                 this.custClass=true
                this.$toaster.error(this.$i18n.t('message.add_required_feild'));
              }else{
                this.$emit('workerFeedback',this.editedItem)
                this.close();
              }
            }else{
              if ((this.editedItem?.required_comment == 1 || this.editedItem?.required_comment == '1') && (this.editedItem?.description == null || this.editedItem?.description == 'Powered by Froala Editor' || this.editedItem?.description == 'undefined')) {
                this.custClass=true
              }
                this.$toaster.error(this.$i18n.t('message.add_required_feild'));
            }
        },
  
        previewImage(file) {
          if (file) {
            this.previewUrl = URL.createObjectURL(file);
            this.selectedFile = file;
            this.editedItem.attachment = this.selectedFile
          } else {
            this.previewUrl = null;
            this.selectedFile = [];
          }
        },
      },
    };
  </script>
  
  <style scoped>
  .cust-validation{
  color: #ff5252 !important;
  caret-color: #ff5252 !important;
  font-size: 12px;
}
:deep(.v-file-input .v-file-input__text){
  cursor: pointer !important;
  height: 100px !important;
}
:deep(.required-upload-attachment .v-messages__message) {
    padding-top: 0px;
    text-align: center;
  }
  </style>
  
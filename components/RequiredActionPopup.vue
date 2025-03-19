<template>
  <div>
    <v-dialog v-model="openPopup" max-width="900px" persistent>
      <v-card>
        <v-card-title />
        <v-card-text>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <div>
              <!-- Comment -->
              <b-row v-if="!checkComment">
                <b-col cols="3">
                  <div class="bold-title md-line-height">
                    {{ $t('form.attached_note') }}
                  </div>
                </b-col>
                <b-col cols="4">
                  <div class="input-wrap">
                    <div class="switch-component">
                      <label class="left-text">{{ $t('form.none') }}</label>
                      <v-switch
                        v-model="checkComment"
                        :label="$t('form.add')"
                        inset
                        class="right-text"
                        @change="changeSwitchComment(checkComment)"
                      />
                    </div>
                  </div>
                </b-col>
              </b-row>
              <div v-else class="section-connect-to">
                <div class="section-connect-to-label section-connect-to-label-reminder">
                  {{ $t('form.attached_note') }}
                </div>
                <div class="switch-component switch-required-comment-small">
                  <label class="left-text">{{ $t('form.none') }}</label>
                  <v-switch
                    v-model="checkComment"
                    :label="$t('form.add')"
                    inset
                    class="right-text"
                    @change="changeSwitchComment(checkComment)"
                  />
                </div>
                <div class="input-wrap form-description p-3">
                  <vue-editor
                    v-model="objectItem.responsible_comment"
                  />
                </div>
              </div>

              <!-- Attachment -->
              <b-row v-if="!checkAttachment">
                <b-col cols="3">
                  <div class="bold-title md-line-height">
                    {{ $t('form.attached_image') }}
                  </div>
                </b-col>
                <b-col cols="4">
                  <div class="input-wrap">
                    <div class="switch-component">
                      <label class="left-text">{{ $t('form.none') }}</label>
                      <v-switch
                        v-model="checkAttachment"
                        :label="$t('form.add')"
                        inset
                        class="right-text"
                        @change="changeSwitchAttachment(checkAttachment)"
                      />
                    </div>
                  </div>
                </b-col>
              </b-row>
              <div v-else class="section-connect-to mt-8">
                <div class="section-connect-to-label section-connect-to-label-reminder">
                  {{ $t('form.attached_image') }}
                </div>
                <div class="switch-component switch-required-comment-small">
                  <label class="left-text">{{ $t('form.none') }}</label>
                  <v-switch
                    v-model="checkAttachment"
                    :label="$t('form.add')"
                    inset
                    class="right-text"
                    @change="changeSwitchAttachment(checkAttachment)"
                  />
                </div>
                <div class="required-upload-attachment p-4">
                  <div class="upload-field text-center p-2">
                    <div v-if="previewUrl">
                      <img class="image-field" v-bind:src="previewUrl" alt="image">
                      <v-file-input
                        v-model="selectedFile"
                        accept="image/png, image/jpeg, image/jpg, image/gif, image/svg"
                        :rules="required"
                        @change="previewImage"
                      />
                    </div>
                    <div v-else class="icon-upload-attachment">
                      <v-file-input
                        v-model="selectedFile"
                        accept="image/png, image/jpeg, image/jpg, image/gif, image/svg"
                        :rules="required"
                        @change="previewImage"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="btn-cancel" text @click="close">
            {{ $t('button.cancel') }}
          </v-btn>
          <v-btn class="btn-save" text @click="updateRequiredComment">
            {{ $t('button.done') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
  // import FroalaSuggestionListEditor from "./FroalaSuggestionListEditor";

  export default {
    name: "RequiredActionPopup",
    components: {
      // FroalaSuggestionListEditor,
    },
    props: {
      openPopup: Boolean,
      objectItem: {
        type: Object,
        required: true,
      },
    },
    data: () => ({
      valid: true,
      checkComment: false,
      checkAttachment: false,
      selectedFile: [],
      previewUrl: null,
      required: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else return true;
        }
      ],
    }),
    created(){
        this.checkComment = this.objectItem.use_checklist_required_comment;
        this.checkAttachment = this.objectItem.use_checklist_required_attachment;
    },
    watch: {
      objectItem(value) {
        if (value) {
          // this.addNew();
        }
      },

    },

    methods: {
      addNew() {
        this.checkComment = this.objectItem.use_checklist_required_comment;
        this.checkAttachment = this.objectItem.use_checklist_required_attachment;
      },

      close() {
        if (this.openPopup) {
          this.$emit('closePopup');
        }
        this.objectItem.comment = null;
        this.objectItem.responsible_comment = null;
        this.selectedFile = [];
        this.previewUrl = null;
      },

      updateRequiredComment() {
        if (this.$refs.form.validate()) {
          this.$emit('updateRequiredComment', {
            processID: this.objectItem.process_id,
            newStatus: this.objectItem.isAttendee ? 'done' : this.objectItem.new_status,
            comment: this.objectItem.isAttendee ? this.objectItem.comment : this.objectItem.responsible_comment,
            attachment: this.selectedFile,
          });
          this.close();
        }
      },

      previewImage(file) {
        if (file) {
          this.previewUrl = URL.createObjectURL(file);
          this.selectedFile = file;
        } else {
          this.previewUrl = null;
          this.selectedFile = [];
        }
      },

      changeSwitchComment(val) {
        if (!val) {
          this.objectItem.responsible_comment = null;
        }
      },

      changeSwitchAttachment(val) {
        if (!val) {
          this.previewUrl = null;
          this.selectedFile = [];
        }
      },
    },
  };
</script>

<style scoped>
</style>

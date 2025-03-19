<template>
  <div>
    <v-dialog
      v-model="openPopup"
      scrollable
      max-width="1125px"
      persistent
    >
      <v-card>
        <v-card-text>
          <div class="popup-header text-center">
            {{ $t('title.edit_task') }}
          </div>
          <div class="review-popup">
            <div class="review-popup-table normal-table">
              <div class="info-block progress-field w-50">
                <div class="label-item col-2 p-0">
                  {{ $t('form.progress') }} :
                </div>
                <div class="info-item">
                  <v-progress-linear
                    height="25"
                    :color="'rgb(231,134,134)'"
                    :value="0"
                  >
                    <strong class="font-weight-bold" style="color: #141b04">
                      0 %
                    </strong>
                  </v-progress-linear>
                </div>
              </div>

              <!-- Source -->
              <div class="info-block w-50 align-center">
                <div class="label-item">{{ $t('form.function') }} :</div>
                <div class="info-item">
                  {{ 'Deviation > Task' }}
                </div>
              </div>

              <!-- Name -->
              <div class="info-block w-50 align-center">
                <div class="label-item mt-n5">
                  {{ $t('form.name') }}:
                </div>
                <div class="input-wrap w-100">
                  <v-text-field
                    v-model="editedItem.name"
                    :rules="required"
                    outlined
                  />
                </div>
              </div>

              <!-- Category -->
              <div class="info-block w-50 align-center">
                <div class="label-item mt-n5">
                  {{ $t('form.category') }}:
                </div>
                <div class="w-100">
                  <Category
                    :object-item="editedItem"
                    :type-category="'task'"
                    @getNewCategory="getNewCategory"
                  />
                </div>
              </div>

              <!-- Description -->
              <div class="info-block">
                <div class="label-item">
                  {{ $t('form.description') }}:
                </div>
                <div class="input-wrap form-description">
                  <FroalaSuggestionListEditor
                    :item="editedItem"
                    :predefined-link-array="predefinedLinkArray"
                  />
                </div>
              </div>

              <!-- Added by -->
              <div cols="6" class="info-block w-50">
                <div class="label-item">{{ $t('form.added_by') }} :</div>
                <div class="info-item">
                  {{ editedItem.addedByName }}
                </div>
              </div>

              <!-- Responsible -->
                <div cols="6" class="info-block w-50 pl-4 pt-3 d-block">
                  <div class="d-flex align-center mb-3">
                    <div class="label-item">{{ $t('form.responsible') }} :</div>
                  </div>
                  <ResponsibleEdit :object-item="editedItem" />
                </div>
                <NewRequiredComment
                    :object-item="editedItem"
                    :is-attendee="false"
                    :editMode="true"
                    :mainAction="$t('form.required')"
                    :subActionFirst="$t('form.feedback')"
                    :subActionSecond="$t('form.image')"
                    :checkActionswitch="checkActionswitch"
                    :checkCommentswitch="checkCommentswitch"
                    :checkAttachmentswitch="checkAttachmentswitch"
                    class="w-100 info-block p-0 px-2"
                  />

              <!-- Start date -->
              <div v-if="!checkSuperAdmin" class="info-block w-50">
                <div class="label-item">
                  {{ $t('form.start_date') }}:
                </div>
                <div>
                  <!-- <StartDateEdit
                    :object-item="editedItem"
                    @changeDate="changeStartDate"
                  /> -->
                  {{ moment(editedItem.start_date).format('DD.MM.YYYY') }} - {{ editedItem.start_time}}
                </div>
              </div>

              <!-- Deadline -->
              <div v-if="!checkSuperAdmin" class="info-block w-50">
                <div class="label-item">
                  {{ $t('form.deadline') }}:
                </div>
                <div>
                  <!-- <DeadlineEdit
                    :object-item="editedItem"
                    :change-custom="changeDeadlineCustom"
                  /> -->
                  {{moment(editedItem.deadline).format('DD.MM.YYYY')}} - {{ editedItem.end_time }}
                </div>
              </div>
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="popup-footer">
          <v-spacer />
          <v-btn class="btn-cancel" text @click="close">
            {{ $t('button.cancel') }}
          </v-btn>
          <v-btn
            class="btn-save"
            @click="save"
          >
            {{ $t('button.save') }}
          </v-btn>

          <!-- Delete object -->
<!--          <v-btn-->
<!--            v-if="checkAdmin || checkCreator"-->
<!--            class="hse-btn-delete"-->
<!--            text-->
<!--            @click="viewDeleteConfirmPopup(editedItem, true)"-->
<!--          >-->
<!--            <v-icon dark>-->
<!--              mdi-delete-->
<!--            </v-icon>-->
<!--          </v-btn>-->
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import {_} from 'vue-underscore';
  import cookies from "js-cookie";
  import FroalaSuggestionListEditor from "./FroalaSuggestionListEditor";
  // import StartDateEdit from "./StartDateEdit";
  // import DeadlineEdit from "./DeadlineEdit";
  import CategoryInReviewPopup from "./CategoryInReviewPopup";
  import ResponsibleEditInReviewPopup from './ResponsibleEditInReviewPopup'
  import NewRequiredComment from './NewRequiredComment.vue'

  export default {
    name: "DeviationTaskEdit",
    components: {
      FroalaSuggestionListEditor,
      Category: CategoryInReviewPopup,
      // StartDateEdit,
      // DeadlineEdit,
      ResponsibleEdit: ResponsibleEditInReviewPopup,
      NewRequiredComment
    },
    props: {
      openPopup: Boolean,
      objectItem: {
        type: Object,
        required: true,
      },
      predefinedLinkArray: {
        type: Array,
        required: false,
      },
      resource: {
        type: Boolean,
        required: false,
      },
    },
    data: () => ({
      checkSuperAdmin: cookies.get('checkSuperAdmin'),
      checkAdmin: cookies.get('checkAdmin'),
      valid: true,
      required: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else return true;
        }
      ],
      changeDeadlineCustom: false,
      checkResource: false,
      editedItem: {},
      categoriesValidArray: [],
      checkActionswitch:false,
      checkCommentswitch:false,
      checkAttachmentswitch:false,
    }),

    computed: {},

    watch: {
      openPopup(value) {
        if (value) {
          if (this.objectItem) {
            let categoryId = this.objectItem.category_id;
            this.categoriesValidArray = _.filter(this.categoriesArray, function (item) {
              return (!item.disable_status || (item.disable_status && item.id === categoryId));
            });
            this.editItem(this.objectItem);
          }
        }
      },

      resource(value) {
        if (value) {
          this.checkResource = value;
        }
      },
    },

    created() {
      if (this.openPopup) {
        if (this.objectItem) {
          this.editItem(this.objectItem);
        }
      }

      if (this.resource) {
        this.checkResource = this.resource;
      }
    },

    methods: {
      editItem(item) {
        this.editedItem = Object.assign({}, item);
        console.log("editedItem---22",this.editedItem);
        this.checkCommentswitch = this.editedItem.responsible?.required_comment == 1 ? true : false
        this.checkAttachmentswitch = this.editedItem.responsible?.required_attachment == 1 ? true : false
        this.checkActionswitch = (this.checkCommentswitch == true || this.checkAttachmentswitch == true) ? true : false
      },

      close() {
        if (this.openPopup) {
          this.$emit('closePopup');
        }
      },

      getNewCategory(value) {
        this.editedItem.category_id = value.newCategoryId;
      },

      changeStartDate(val) {
        this.changeDeadlineCustom = val.changed;
      },

      reloadList() {
        this.$emit('reloadList');
      },

      viewItem() {
        this.$emit('viewItem');
      },
      save() { 
      let that = this;
      that.editedItem.requestEdit=true;
      that.editedItem.isDefaultResponsible=false;
      that.editedItem.isDefaultAttendee=false;
      console.log(that.editedItem);
      that.editedItem.responsible.required_comment = that.editedItem.responsible_required_comment
      that.editedItem.responsible.required_attachment = that.editedItem.responsible_required_attachment
      that.$store
        .dispatch('objects/update', that.editedItem)
        .then(function () {
          // that.editedItem.task_data=res.data
          that.reloadList();
          that.$toaster.success(that.$i18n.t('message.success_deviation_update'))
          that.$nuxt.$loading.finish()
        })
        .catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
            console.log(error);
          that.$toaster.error(that.$i18n.t('message.fail_deviation_update'))
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish()
        })
      this.$emit('saveTask')
      this.close()
    },

      // save() { // update sub-goal
      //   let that = this;
      //   that.$nuxt.$loading.start();
      //   that.editedItem.requestEdit = true;
      //   that.editedItem.isDefaultResponsible = false;
      //   if (!that.editedItem.attendee_all) { // if not select All
      //     that.editedItem.attendee_all = false;
      //   }
      //   that.editedItem.responsible_required_comment = false;
      //   that.editedItem.responsible_required_attachment = false;
      //   that.editedItem.attendee_required_comment = false;
      //   that.editedItem.attendee_required_attachment = false;
      //   // time
      //   that.editedItem.start_date = that.editedItem.start_date_pre;
      //   that.editedItem.start_time = that.editedItem.start_time_pre;
      //   that.editedItem.deadline = that.editedItem.deadline_pre;
      //   that.editedItem.end_time = that.editedItem.end_time_pre;
      //   that.$store.dispatch('objects/update', that.editedItem).then(function () {
      //     that.reloadList();
      //     that.viewItem();
      //     // that.reloadListCategory();
      //     that.$toaster.success(that.$i18n.t('message.success_deviation_update'))
      //   }).catch(() => {
      //     that.$toaster.error(that.$i18n.t('message.fail_deviation_update'))
      //     that.$nuxt.$loading.finish();
      //   });
      //   that.close();
      // },
    },
  };
</script>

<style scoped>

</style>

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
                <div class="info-item text-capitalize" v-if="routineTaskFeild && !editedItem.routine">
                  {{editedItem.source +' '+ '> task'}}
                </div>
                <div class="info-item" v-if="editedItem.routine">
                  {{routineItem.recurring_type == 'task' ? 'Document > Routine > Task' : 'Document > Routine > Reminder'}}
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
                    :type-category="category_type"
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
                <NewRequiredComment v-if="routineTaskFeild && !editedItem.routine"
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

                  <div v-if="editedItem.routine"
                class="info-block w-50"
              >
                <div class="label-item mt-3">{{ $t('form.frequency') }} :</div>
                <v-select
                  v-model="durationData.unit"
                  :items="units"
                  item-text="units"
                  item-value="name"
                  class="select-box text-capitalize"
                  outlined
                  @change="(e) => changeFreqency(e)"
                />
              </div>

              <div v-if="editedItem.routine"
                class="info-block align-items-center w-50 p-0 px-2"
              >
              
                <duration
                  :object-item="editedItem.routine"
                  :duration-data="durationData"
                  class="col-12 duration-hover"
                  :isDisabledDay="isDisabledDay"
                />
              </div>

              <!-- Start date -->
              <div v-if="!checkSuperAdmin" class="info-block w-50 pl-1">
                <div class="label-item col-auto">
                  {{ $t('form.start_date') }}:
                </div>
                <div class="d-flex">
                  <StartDateEdit
                    :object-item="editedItem"
                    class="mb-n4"
                    @changeDate="changeStartDate"
                  />
                 <!-- <DatePickerNew
                  :label="$t('form.start_date')"
                  :item="editedItem"
                  :date-input="editedItem.start_date"
                  :use-keyboard="true"
                  :past-date="false"
                  :future-date="true"
                  :is-start-date="true"
                  @getDate="changeStartDate"
                /> -->
                <!-- <v-col cols="5" class="p-0 pl-2"> -->
                  <!-- <time-picker :time="moment(editedItem.start_time).format('HH:mm')"/> -->
                    <!-- :time-input="routineItem?.start_time || editedItem.start_time" -->
                  <!-- <new-time-picker
                    :label="$t('form.time')"
                    :item="editedItem"
                    :time-input="editedItem.start_time"
                    @getTime="getStartTime"
                  /> -->
                <!-- </v-col> -->
                </div>
              </div>

              <!-- Deadline -->
              <div v-if="!checkSuperAdmin" class="info-block w-50 pl-2">
                <div class="label-item col-auto">
                  {{ $t('form.deadline') }}:
                </div>
                <div class="d-flex">
                  <DeadlineEdit
                    :object-item="editedItem"
                    :item="editedItem"
                    :change-custom="changeDeadlineCustom"
                    class="mb-n4"
                    :extend-date="false"
                    :extend-time="false"
                  />
                  
                  <!-- <DatePickerNew
                  :item="editedItem"
                  :date-input="editedItem.deadline"
                  :past-date="false"
                  :future-date="true"
                  :is-deadline="true"
                  :disable="!checkAdmin && !checkCreator"
                  :dateEdit="true"
                  class="col-6 p-0"
                  @getDate="getDeadline"
                /> -->
                <!-- <v-col cols="5" class="p-0 pl-2">
                  <new-time-picker
                        :label="$t('form.time')"
                        :item="editedItem"
                        :time-input="editedItem.end_time"
                        @getTime="getTimeDeadline"
                    />
                </v-col> -->
                 
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
//   import StartDateEdit from "./StartDateEdit";
  // import DeadlineEdit from "./DeadlineEdit";
  // import DatePickerNew from './DatePickerNew.vue'
  import CategoryInReviewPopup from "./CategoryInReviewPopup";
  import ResponsibleEditInReviewPopup from './ResponsibleEditInReviewPopup'
  import NewRequiredComment from './NewRequiredComment.vue'
// import NewTimePicker from './NewTimePicker.vue';
import moment from 'moment';
import { removeTagsFromString, formatTimeString } from "./common/js/functions"
import Duration from './Duration.vue';
import StartDateEdit from './StartDateEdit.vue';
import DeadlineEdit from './DeadlineEdit.vue';

  export default {
    name: "EditFoldInfo",
    components: {
      FroalaSuggestionListEditor,
      Category: CategoryInReviewPopup,
    //   StartDateEdit,
      // DeadlineEdit,
      // DatePickerNew,
      ResponsibleEdit: ResponsibleEditInReviewPopup,
      NewRequiredComment,
        // NewTimePicker,
        Duration,
        StartDateEdit,
        DeadlineEdit
    },
    props: {
      openPopup: Boolean,
      objectItem: {
        type: Object,
        required: true,
      },
      routineItem:{
        type: Object,
        required: false,
      },
      predefinedLinkArray: {
        type: Array,
        required: false,
      },
      resource: {
        type: Boolean,
        required: false,
      },
      routineTaskFeild:{
        type: Boolean,
        required: false,
      },
      durationData:{
         type: Object,
        required: false,
      },
      category_type:{
         type: String,
        required: false,
      }
    },
    data: () => ({
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
      changeDeadlineCustom: false,
      checkResource: false,
      editedItem: {},
      categoriesValidArray: [],
      checkActionswitch:false,
      checkCommentswitch:false,
      checkAttachmentswitch:false,
      checkCreator:false,
      start_date:'',
      start_time:'',
      deadline:'',
      end_time:'',
      units: ['Daily', 'Weekly', 'Bi-Weekly', 'Monthly', 'Quarter', 'Half-Yearly', 'Yearly'],
      isDisabledDay:false,
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

      if (this.roleUser == 'user') {
      this.checkWorker = true
    }
      if (this.resource) {
        this.checkResource = this.resource;
      }
    },

    methods: {
        getStartTime(value) {
      this.start_time = value.time
      if (this.editMode) {
        this.editedItem.start_time_pre = this.start_time
      } else {
        this.objectItem.start_time_pre = this.start_time
      }
    },
    getStartDate(value) {
      this.start_date = value.date
      if (this.editMode) {
        this.editedItem.start_date_pre = this.start_date
      } else {
        this.objectItem.start_date_pre = this.start_date
      }
    },
    getDeadline(value) {
      this.deadline = value.date
      if (this.editMode) {
        this.editedItem.deadline_pre = this.deadline
      } else {
        this.objectItem.deadline_pre = this.deadline
      }
    },
    getTimeDeadline(value) {
        this.end_time = value.time;
        if (this.editMode) {
          this.editedItem.end_time_pre = this.end_time;
        } else {
          this.objectItem.end_time_pre = this.end_time;
        }
      },
      changeFreqency(value) {
       if (value == 'daily' || value == 'Daily') {
        this.isDisabledDay = true
        this.durationData.is_duration = false
      } 
      // else if(value == 'weekly' || value == 'Weekly'){
      //   this.isDisabledDay = true
      //   this.durationData.is_duration = true
      // } 
      else {
        this.isDisabledDay = false
        this.durationData.is_duration = false
      }
    },
      editItem(item) {
        this.editedItem = Object.assign({}, item);
        this.editedItem.responsible_employee_array = item?.employee_array
        this.editedItem.responsible_department_array = item?.department_array
        this.editedItem.employee_array = this.editedItem.responsible?.employee_array
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

      // reloadList() {
      //   this.$emit('reloadList');
      // },

      viewItem() {
        this.$emit('viewItem');
      },
      async save() {
        let that = this
        that.editedItem.requestEdit=true;
        that.editedItem.isDefaultResponsible=false;
        that.editedItem.isDefaultAttendee=false;
        that.editedItem.is_template=false
        that.editedItem.parent_id=''
        if (that.editedItem?.routine) {
          
          that.editedItem.is_duration=that.durationData?.is_duration ? that.durationData?.is_duration : false
          that.editedItem.duration=that.durationData.duration ? that.durationData.duration : 1
          that.editedItem.recurring=that.durationData.unit ? that.durationData.unit : ''
        }
        if (that.editedItem?.routine) {
          
          that.editedItem.routine.is_duration= that.durationData.is_duration? that.durationData?.is_duration : false
          that.editedItem.routine.duration= that.durationData.duration? that.durationData?.duration : 1
          that.editedItem.routine.recurring= that.durationData.unit ? that.durationData?.unit : ''
        }
        that.editedItem.is_activated=true
        that.editedItem.is_attending_activated=false
        that.editedItem.is_public=false
        that.editedItem.recurring_type = that.editedItem?.routine?.recurring_type

        that.textTrime = that.editedItem.name
        that.editedItem.name = this.textTrime.trim()

        this.editedItem.description= await removeTagsFromString(this.editedItem.description);

        that.editedItem.start_date = that.editedItem.start_date_pre
        // this.editedItem.start_time = this.editedItem.start_time_pre != null && this.editedItem.start_time_pre != "" ? new moment(this.editedItem.start_time_pre, "HH:mm").utc().format("HH:mm") : '';
        // this.editedItem.end_time = this.editedItem.end_time_pre && this.editedItem.end_time_pre != "" ? new moment(this.editedItem.end_time_pre, "HH:mm").utc().format("HH:mm"): '';
        that.editedItem.start_time = await formatTimeString(new moment(that?.editedItem?.start_time_pre, "HH:mm"))
        that.editedItem.end_time = await formatTimeString(new moment(that?.editedItem?.end_time_pre, "HH:mm"))
        that.editedItem.deadline = that.editedItem.deadline_pre
        if (that.editedItem.responsible_required_comment == true) {
          that.editedItem.responsible_required_comment = true
        }else{
          let commentData = that.editedItem.responsible_required_comment
          that.editedItem.responsible_required_comment = commentData == undefined ? this.checkCommentswitch : commentData
        }
        if (that.editedItem.responsible_required_attachment == true) {
          that.editedItem.responsible_required_attachment = true
        }else{
         let attchData = that.editedItem.responsible_required_attachment
        that.editedItem.responsible_required_attachment = attchData == undefined ? this.checkAttachmentswitch : attchData
        }

        console.log("edit fold info-----------------",that.editedItem);

        that.$store
        .dispatch('objects/update', that.editedItem)
        .then(function () {
          // that.reloadList();
          that.$toaster.success(that.$i18n.t('message.success_task_update'))
          that.$nuxt.$loading.finish()
        })
        .catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          console.log(error);
          that.$toaster.error(that.$i18n.t('message.fail_task_update'))
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish()
        })
        that.close()
        this.$emit('saveInfo');
    },
    },
  };
</script>

<style scoped>

</style>

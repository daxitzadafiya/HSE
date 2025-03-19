<template>
  <div>
    <div class="review-popup expandInfo">
      <div class="review-popup-table normal-table">
        <!-- progress -->
        <div
          v-if="!checkWorker && routineTaskFeild && editedItem.status != 'closed' 
          && checkResponsible"
          class="info-block progress-field w-50 align-center"
        >
          <div class="label-item col-2 p-0">{{ $t('form.progress') }} :</div>
          <div class="info-item">
            <v-progress-linear
              height="25"
              :color="
                !checkResponsible && !checkCreator
                  ? userProgressColor
                  : checkResponsible
                  ? userProgressColor
                  : respProgressColor
              "
              :value="
                !checkResponsible && !checkCreator
                  ? userRate
                  : checkResponsible
                  ? userRate
                  : total_rate
              "
            >
              <strong class="font-weight-bold" style="color: #212121">
                {{
                  checkResponsible
                    ? userRate + ' ' + '%'
                    : total_rate + ' ' + '%'
                }}
              </strong>
            </v-progress-linear>
          </div>
        </div>

        
        <div
          v-if="(!routineTaskFeild || ((routineTaskFeild && checkWorker) || routineTaskFeild && !checkWorker && !checkResponsible)) && editedItem.status !== 'closed'"
          class="info-block w-50 align-center"
        >
          <div class="label-item">{{ $t('form.status') }} :</div>
          <!-- <v-chip
            v-if="workerstatus === 'New' || workerstatus === 'new' || workerstatus == '1'"
            class="info-item status-label-custom pending"
            label
          >
            {{ $t('form.new') }} -->
          <!-- </v-chip>
          <v-chip
            v-if="workerstatus === 'pending'"
            class="info-item status-label-custom pending"
            label
          >
            {{ $t('form.pending') }}
          </v-chip>
          <v-chip
            v-else-if="workerstatus === 'disapproved' "
            class="info-item status-label-custom not-done"
            label
          >
            {{ $t('form.disapproved') }}
          </v-chip>
          <v-chip
            v-else-if="workerstatus === 'disapproved_overdue'"
            class="info-item status-label-custom not-done"
            label
          >
            {{ $t('form.disapproved') }}
            <div role="button" class="ms-2">
              <img src="../assets/images/icon/alert-white.png" alt="" srcset="" />
            </div>
          </v-chip>
           <v-chip
            v-else-if="workerstatus === 'disapproved_with_extended'"
            class="info-item status-label-custom ongoing"
            label
          >
            {{ $t('form.disapproved') }}
           <div role="button" class="ms-2">
                    <img
                      src="../assets/images/icon/alert.png"
                      alt=""
                      srcset=""
                    />
                  </div>
          </v-chip>
          <v-chip
            v-else-if="workerstatus === 'overdue'"
            class="info-item status-label-custom ongoing"
            label
          >
            {{ $t('form.ongoing') }}
            <div role="button" class="ms-2">
              <img src="../assets/images/icon/alert.png" alt="" srcset="" />
            </div>
          </v-chip>
          <v-chip
            v-else-if="workerstatus === 'ongoing' || workerstatus == '2' || declineRequest"
            class="info-item status-label-custom ongoing"
            label
          >
            {{ $t('form.ongoing') }}
          </v-chip>
          <v-chip
            v-else-if="workerstatus === 'completed'"
            class="info-item status-label-custom approved"
            label
          >
            {{ $t('form.completed') }}
          </v-chip>
          <v-chip
            v-else-if="workerstatus === 'completed_overdue'"
            class="info-item status-label-custom approved"
            label
          >
            {{ $t('form.completed') }}
            <div role="button" class="ms-2">
              <img
                src="../assets/images/icon/alert-white.png"
                alt=""
                srcset=""
              />
            </div>
          </v-chip>
          <v-chip
            v-else-if="workerstatus === 'request'"
            class="info-item status-label-custom ongoing"
            label
          >
            {{ $t('form.request') }}
          </v-chip>

          <v-chip
            v-else-if="workerstatus === 'approved'"
            class="info-item status-label-custom approved"
            label
          >
            {{ $t('form.approved') }}
          </v-chip>
          <v-chip
            v-else-if="workerstatus === 'approved_overdue'"
            class="info-item status-label-custom approved"
            label
          >
            {{ $t('form.approved') }}
            <div role="button" class="ms-2">
              <img
                src="../assets/images/icon/alert-white.png"
                alt=""
                srcset=""
              />
            </div>
          </v-chip>
          <v-chip
            v-else-if="
              workerstatus === 'Reassigned' || workerstatus === 'Removed'
            "
            class="info-item status-label-custom not-done"
            label
          >
            {{ $t('form.removed') }}
            <div class="ms-2">
              <img
                src="../assets/images/icon/alert-white.png"
                alt=""
                srcset=""
              />
            </div>
          </v-chip> -->
          <status-chip :inReview="true" :inRisk="false" :status="workerstatus" :addDescription="addDescription" :addImage="addImage" :extended_date="processingItem?.extended_timeline?.old_deadline ? true :false "
          />
          <!-- <div
            class="d-flex align-center"
            v-if="
              workerstatus === 'approved' ||
              workerstatus === 'approved_overdue' ||
              workerstatus === 'completed' ||
              workerstatus === 'completed_overdue'
            "
          >
            <img v-if="addDescription != null"
              class="icon-img ms-3"
              src="../assets/images/gridIcon/fillNote.png"
              alt="fillNote.png"
              @click="openComment = true"
            />
            <img v-if="addImage"
              src="../assets/images/icon/image-green.png"
              class="ms-2 mb-n1"
              @click="openImage = true"
            />
          </div> -->
        </div>

        <div
          v-if="editedItem.status == 'closed' && !checkWorker"
          class="info-block w-50 align-center"
        >
          <div class="label-item">{{ $t('form.status') }} :</div>
          <!-- <v-chip
                  v-if="
                    workerstatus === 'closed'
                  "
                  class="info-item status-label-custom green text-white"
                  label
                >
                  {{ $t('form.verify') }}
                      <v-icon right>mdi-check-circle</v-icon>
                </v-chip> -->
          <v-chip v-if="editedItem.status == 'closed'"
            class="info-item status-label-custom approved"
                  label
          >
            {{ $t('form.closed') }}
          </v-chip>
        </div>

        <!-- Source -->
        <div class="info-block w-50 align-center">
          <div class="label-item col-auto p-0">{{ $t('form.function') }} :</div>
          <div class="info-item text-capitalize" v-if="routineTaskFeild && !editedItem.routine">
            {{editedItem.source +' '+ '> task'}}
          </div>
          <div class="info-item" v-if="editedItem.routine">
            {{routineItem.recurring_type == 'task' ? 'Document > Routine > Task' : 'Document > Routine > Reminder'}}
          </div>
        </div>

        <!-- name -->
        <div class="info-block w-50 align-center">
          <div class="label-item">{{ $t('form.name') }}:</div>
          <div v-if="!isEdit" class="info-item" @click="isEditInfo">
            {{ editedItem.name }}
          </div>
        </div>

        <!-- Category -->

        <div v-if="!isEdit" class="info-item w-50" @click="isEditInfo">
          <div class="info-block">
            <div class="label-item">{{ $t('form.category') }} :</div>
            <div class="info-item">
              {{ editedItem.category_name || editedItem.categoryName }}
            </div>
          </div>
        </div>

        <!-- Description -->

        <div class="info-block w-100 align-center">
          <div class="label-item">{{ $t('form.description') }}:</div>
          <div v-if="!isEdit" class="info-item" @click="isEditInfo">
            {{ editedItem.description }}
          </div>
        </div>

        <div
          class="info-block w-100"
          v-if="(processExtendItem?.length != 0 && 
            (workerstatus === 'disapproved' ||
            workerstatus === 'disapproved_with_extended' ||editedItem?.status === 'disapproved_overdue' ||
            workerstatus === 'timeline_disapproved' ||
            workerstatus === 'completed_overdue' ||
            workerstatus === 'completed' ||
            workerstatus === 'approved' ||
            workerstatus === 'approved_overdue'))"
        >
          <div class="w-100">
            <div class="label-item mb-3 d-flex justify-content-between">
              {{processExtendItem?.type == 'attendee' && processExtendItem?.status === 'Approved' ? 'Approved' : 'Disapproved'}}
              {{
                (workerstatus === 'timeline_disapproved' || workerstatus === 'approved_overdue' || workerstatus === 'completed' ||workerstatus === 'approved' || 
                workerstatus === 'completed_overdue') && (processExtendItem?.type === 'attendee') ? 'Request' : 'Task'
              }}
              Date :
              {{moment(processingItem?.extended_timeline?.created_at).format('DD.MM.YYYY HH:mm a')}}
              <span
                v-if="
                  ( 
                  (( workerstatus === 'completed' ||
            workerstatus === 'approved' || workerstatus === 'completed_overdue' ||  workerstatus === 'approved_overdue' || workerstatus === 'disapproved_with_extended' ) &&
                   ((!nullTime && !nullDate && processExtendItem?.type == 'responsible') ||
                    (processExtendItem?.type == 'attendee' && processExtendItem?.status === 'Approved')
                   ))
                  )"

                >Extend Time date :{{
                  moment(processingItem?.extended_timeline?.deadline_date
                  ).format('DD.MM.YYYY')
                }}
                {{ processingItem?.extended_timeline?.deadline_time }}
              </span
              >
            </div>
            <div class="info-item">
              {{ processingItem?.extended_timeline?.extended_by_reason }}
            </div>
          </div>
        </div>

        <!-- Added by -->
        <div cols="6" class="info-block w-50 align-center">
          <div class="label-item">{{ $t('form.added_by') }} :</div>
          <div class="info-item">
            {{ editedItem.addedByName }}
          </div>
        </div>

        <!-- responsible -->

        <div class="w-50 info-block">
          <div
            v-if="!isEdit"
            class="info-block p-0 px-1 chip responsible align-center border-0"
            @click="isEditInfo"
          >
            <div class="label-item">{{ $t('form.responsible') }} :</div>
            <div
              class="info-item d-flex justify-content-between responsible-folddown"
            >
              <div>
                <v-chip
                  v-for="(item, index) in responsibleName"
                  :key="index"
                  class="mr-2 chip-custom"
                  small
                >
                  {{ item }}
                </v-chip>
              </div>
            </div>
          </div>
        </div>

        <!-- required -->
        <div cols="6" class="info-block w-100 align-center" v-if="routineTaskFeild && !editedItem.routine">
          <div class="label-item">{{ $t('form.required') }} :</div>
          <div class="info-item" v-if="!commentAction && !attachAction">
            {{ bothAction ? 'Comment / Attachment' : 'N/A' }}
          </div>
          <div
            class="info-item"
            v-if="(commentAction || attachAction) && !bothAction"
          >
            {{ commentAction ? 'Comment' : attachAction ? 'Attachment' : '' }}
          </div>
        </div>

         <div v-if="!isEdit && editedItem.routine"
                class="col-6 info-block align-center"
                @click="isEditInfo"
              >
                <div class="label-item">{{ $t('form.frequency') }} :</div>
                <div class="info-item text-capitalize">
                  {{ routineItem.recurring }}
                </div>
              </div>

              <div v-if="!isEdit && editedItem.routine"
                class="col-6 info-block align-center"
                @click="isEditInfo"
              >
                <div class="label-item">{{ $t('form.duration') }} :</div>
                <div class="info-item text-capitalize">
                  {{ routineItem.duration }}
                </div>
              </div>

        <!-- Start date -->
        <div v-if="!isEdit" class="info-block col-6" @click="isEditInfo">
          <div class="label-item">{{ $t('form.start') }} :</div>
          <div class="info-item">
            {{ moment(editedItem.start_date).format('DD.MM.YYYY') }}  {{editedItem.start_time && '-' + editedItem.start_time}}
          </div>
        </div>

        <!-- deadline -->
        <div
          class="info-block w-50"
          v-if="!isEdit && !checkResource"
          @click="isEditInfo"
        >
          <div class="label-item col-auto p-0">{{ $t('form.deadline') }} :</div>

          <div
            class="info-item"
            v-if="
              !checkWorker ||
                (checkWorker &&
                  (workerstatus === 'new' ||
                    workerstatus === 'pending' ||
                    workerstatus === 'ongoing' ||
                    workerstatus === 'disapproved'||
                    workerstatus === 'Reassigned' ||
                     workerstatus === 'Removed' ) ||
                    ((workerstatus === 'completed_overdue' || 
                    workerstatus === 'completed'||
                    workerstatus === 'approved' || 
                    workerstatus === 'approved_overdue') &&
                  ((nullTime && nullDate && processExtendItem?.type == 'responsible') || 
                  (processExtendItem?.type == 'attendee' && processExtendItem?.status === 'Disapproved'))))"
          >
            {{
              editedItem.deadline
                ? moment(editedItem.deadline).format('DD.MM.YYYY')
                : moment(editedItem.start_date)
                    .add(1, 'days')
                    .format('DD.MM.YYYY')
            }}
            {{editedItem?.end_time && ' - ' +  editedItem?.end_time }}
          </div>

          <div
            v-else-if="
              checkWorker && processExtendItem?.length != 0 &&
                ((workerstatus === 'request' || workerstatus === 'overdue' || workerstatus === 'disapproved_with_extended' || declineRequest) ||
                  ((workerstatus === 'approved_overdue' || workerstatus === 'approved'|| workerstatus === 'completed' || workerstatus === 'completed_overdue') && ((!nullTime || !nullDate &&
                  processExtendItem?.type == 'responsible') || (processExtendItem?.type == 'attendee' && processExtendItem?.status === 'Approved'))))
            "
            class="d-flex"
          >
            <span 
                  v-if="(processExtendItem?.type == 'attendee' && processExtendItem?.status === 'Approved') || ((!nullTime || !nullDate) &&
                  processExtendItem?.type == 'responsible') || (workerstatus === 'request' || workerstatus === 'overdue' || workerstatus === 'disapproved_with_extended' || declineRequest)" 
                  :class="declineRequest ? '' : 'text-decoration-line-through'">{{
              moment(processingItem?.extended_timeline?.old_deadline).format(
                'DD.MM.YYYY'
              )
            }}{{editedItem?.end_time && ' - ' +  editedItem?.end_time }}</span>
            <v-chip 
                v-if="(processExtendItem?.type == 'attendee' && processExtendItem?.status === 'Approved') || ((!nullTime || !nullDate) &&
                  processExtendItem?.type == 'responsible') || (workerstatus === 'request' || workerstatus === 'overdue' || workerstatus === 'disapproved_with_extended' || declineRequest)"
              class="rounded-xl status-label-custom ongoing deadline-chip ml-2"
              :class="declineRequest ? 'text-decoration-line-through' : ''"
              small
            >
              {{
                moment(processingItem?.extended_timeline?.deadline_date).format(
                  'DD.MM.YYYY'
                )
              }}
              {{processingItem?.extended_timeline?.deadline_time && ' - ' + processingItem?.extended_timeline?.deadline_time }}

            </v-chip>
          </div>
          <div v-else>
                  {{
                    !editedItem?.deadline
                      ? moment(editedItem?.start_date)
                          .add(1, 'days')
                          .format('DD.MM.YYYY')
                      : moment(editedItem?.deadline).format('DD.MM.YYYY')
                  }}
                   {{editedItem?.end_time && ' - ' +  editedItem?.end_time }}
                </div>
          <div
            v-if="checkWorker && routineTaskFeild && checkEdit && !hideExtendTimeline && !hideTimeExtendedRequest"
            class="d-flex"
          >
            <div class="px-2 deactivation-icon" @mouseover="hoverItem = true">
              <img
                src="../assets/images/icon/deactivation-calender-icon.svg"
                alt=""
                srcset=""
              />
            </div>
            <v-btn
              @click="sendRequest()"
              text
              v-if="hoverItem"
              color="error"
              @mouseleave="hoverItem = false"
              class="hover-item"
            >
              {{ $t('form.request_extention') }}
            </v-btn>
          </div>
          <!-- <div class="info-item" v-else @click.stop>Not Applicable</div> -->
        </div>
      </div>
    </div>
    <edit-fold-info
      :open-popup="openEditPopup"
      :object-item="editedItem"
      :routineItem="routineItem"
      :predefined-link-array="predefinedLinkArray"
      :routineTaskFeild="routineTaskFeild"
      :durationData="durationData"
      :category_type="category_type"
      @closePopup="openEditPopup = !openEditPopup"
      @saveInfo="saveInfo"
    />
    <ReasonPopup
          :open-popup="openComment"
          @closePopup="openComment = !openComment"
          :titleMessage="$t('form.feedback')"
          :addDescription="addDescription"
        />

        <ImagePopup
          :open-popup="openImage"
          @closePopup="openImage = !openImage"
          :titleMessage="$t('form.image')"
          :addImage="addImage"
        />
  </div>
</template>

<script>
import cookies from 'js-cookie'
import FroalaSuggestionListEditor from './FroalaSuggestionListEditor'
import CategoryInReviewPopup from './CategoryInReviewPopup'
import ResponsibleReasonEdit from './ResponsibleReasonEdit.vue'
import NewTimePicker from './NewTimePicker.vue'
import EditFoldInfo from './EditFoldInfo.vue'
import ReasonPopup from './ReasonPopup.vue'
import ImagePopup from './ImagePopup.vue'
import StatusChip from './StatusChip.vue'
// import ChangeEmployeeTable from './ChangeEmployeeTable.vue'
export default {
  components: { EditFoldInfo, ReasonPopup, ImagePopup, StatusChip },
  name: 'NewFoldInfo',
  comments: {
    category: CategoryInReviewPopup,
    ResponsibleReasonEdit,
    // DatePickerNew,
    FroalaSuggestionListEditor,
    NewTimePicker,
  },
  props: {
    foldingItem: {
      type: Object,
      required: false,
    },
    isOpen: {
      type: Boolean,
      required: false,
    },
    predefinedLinkArray: {
      type: Array,
      required: false,
    },
    attendeeArray: {
      type: Array,
      required: false,
    },
    attendeeObjectID: {
      type: [Number, String],
      required: false,
    },
    isReminder: {
      type: Boolean,
      required: false,
    },
    attendeeHistory: {
      type: Array,
      required: false,
    },
    routineTaskFeild: {
      type: Boolean,
      required: false,
    },
    isReminderHistory: {
      type: Boolean,
      required: false,
    },
    showExpand: {
      type: Boolean,
      required: false,
      default: null,
    },
    processingItem: {
      type: Object,
      required: false,
    },
    checkEdit:{
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
      },
      hideTimeExtendedRequest:{
        type: Boolean,
        required: false,
        default: false
      }
  },
  data() {
    return {
      userRoleId: parseInt(cookies.get('roleID')),
      userDepartmentID: parseInt(cookies.get('userDepartmentID')),
      checkAdmin: cookies.get('checkAdmin'),
      checkSuperAdmin: cookies.get('checkSuperAdmin'),
      roleUser: cookies.get('roleUser'),
      userLogged: parseInt(cookies.get('userID')),
      userID: parseInt(cookies.get('userID')),
      permissionsUser: localStorage.getItem('permissionsKey'),
      editedItem: {},
      routineItem:{},
      documentItem: {},
      isEdit: false,
      isTaskField: false,
      isRoutineField: false,
      bothAction: false,
      attachAction: false,
      commentAction: false,
      responsibleName: [],
      checkResponsible: false,
      openEditPopup: false,
      checkWorker: false,
      checkResource: false,
      hoverItem: false,
      checkCreator: false,
      workerstatus: '',
      checkEditItem:false,
      declineRequest:false,
      openComment:false,
      openImage:false,
      addDescription:'',
      addImage:'',
      processExtendItem: {},
      nullDate:false,
      nullTime:false,
    }
  },
  created() {
    if (this.isOpen) {
      this.editInfoItem(this.foldingItem)
    }
    if (this.roleUser == 'user') {
      this.checkWorker= true
    }
  },
  watch: {
    foldingItem(item){
      this.editInfoItem(item)
    }
  },
  methods: {
    translateCol(colName) {
      return this.$i18n.t('column.' + colName)
    },
    isEditInfo() {
      if (!this.checkWorker && !this.checkEdit && this.checkCreator) {
        this.openEditPopup = true
      }else{
        this.openEditPopup = false
      }
    },
    editInfoItem(item) {
      if (this.roleUser == 'user') {
      this.checkWorker= true
    }
      this.editedItem = item
      console.log("editedItem",this.editedItem );
       const htmlString = item?.description;
          const tempElement = document.createElement('div');
          tempElement.innerHTML = htmlString;
          const extractedText = tempElement?.textContent || tempElement?.innerText || '';
          const cleanedText = extractedText?.replace('Powered by Froala Editor', '');
          this.editedItem.description = cleanedText?.trim();

        if (this.editedItem.added_by == this.userID) {
          this.checkCreator = true
        } else {
          this.checkCreator = false
        }
      this.routineItem = item?.routine
      this.edittaskItem = this.infoItem

      this.checkEditItem = this.checkEdit

      // this.workerstatus = item.status
      this.responsibleName = this.editedItem?.responsible?.employeeName
      if (this.editedItem?.responsible?.employeeRole?.includes(this.userID)) {
        this.checkResponsible = true
      } else {
        this.checkResponsible = false
      }
      this.processExtendItem = this.processingItem?.extended_timeline 

       this.nullDate = this.processExtendItem?.deadline_date == null
      this.nullTime = this.processExtendItem?.deadline_time == null

      this.addDescription = this.processingItem?.comment == 'null' || this.processingItem?.comment == 'undefined' ? null : this.processingItem?.comment
      this.addImage = this.processingItem?.image

      this.workerstatus = this.editedItem.status
      if (this.checkWorker == true) {
        this.workerstatus = this.processingItem?.status || this.editedItem.status
        if (
          this.workerstatus === 'approved' ||
          this.workerstatus === 'completed' ||
          this.workerstatus === 'disapproved' ||
          this.workerstatus === 'request' ||
          this.workerstatus === 'approved_overdue' ||
          this.workerstatus === 'completed_overdue' ||
          this.workerstatus === 'Reassigned' ||
          this.workerstatus === 'Removed'
        ) {
          this.hideExtendTimeline = true
        } else if (
          this.workerstatus === 'overdue' ||
          this.workerstatus === 'disapproved_with_extended' || this.workerstatus === 'disapproved_overdue'
        ) {
          this.hideExtendTimeline = true
        } else if (this.workerstatus === 'timeline_disapproved' ) {
          this.declineRequest = true
          this.hideExtendTimeline = true
        } else {
          this.hideExtendTimeline = false
        }
      }
      if (!this.routineTaskFeild) {
        this.workerstatus=this.routineItem?.status || this.editedItem?.status
      }
      this.userRate = this.editedItem.rate.toFixed()
      this.total_rate = this.editedItem.total_rate.toFixed()
      if (
        (this.checkResponsible && this.checkCreator) ||
        (this.checkResponsible && !this.checkCreator) ||
        (!this.checkResponsible && !this.checkCreator)
      ) {
        if (this.userRate <= 25) {
          this.userProgressColor = 'rgba(251,75,75)'
        } else if (this.userRate > 25 && this.userRate <= 50) {
          this.userProgressColor = 'rgba(255,168,121)'
        } else if (this.userRate > 50 && this.userRate <= 75) {
          this.userProgressColor = 'rgba(255,193,99)'
        } else if (this.userRate > 75 && this.userRate <= 95) {
          this.userProgressColor = 'rgba(255, 212, 111, 1)'
        } else {
          this.userProgressColor = 'rgba(132, 161, 61, 1)'
        }
      } else if (this.checkCreator && !this.checkResponsible) {
        if (this.total_rate <= 25) {
          this.respProgressColor = 'rgba(251,75,75)'
        } else if (this.total_rate > 25 && this.total_rate <= 50) {
          this.respProgressColor = 'rgba(255,168,121)'
        } else if (this.total_rate > 50 && this.total_rate <= 75) {
          this.respProgressColor = 'rgba(255,193,99)'
        } else if (this.total_rate > 75 && this.total_rate <= 95) {
          this.respProgressColor = 'rgba(255, 212, 111, 1)'
        } else {
          this.respProgressColor = 'rgba(132, 161, 61, 1)'
        }
      }
      if (
        this.editedItem?.responsible?.required_attachment == 1 &&
        this.editedItem?.responsible?.required_comment == 1
      ) {
        this.bothAction = true
      } else if (this.editedItem?.responsible?.required_attachment == 1) {
        this.attachAction = true
      } else if (this.editedItem?.responsible?.required_comment == 1) {
        this.commentAction = true
      } else {
        this.bothAction = false
      }
    },
    saveInfo() {
      this.$emit('saveInfo')
    },
    sendRequest() {
      this.$emit('sendRequest')
    },
    // reloadList(){
    //   this.$emit('reloadList')
    // }
  },
}
</script>

<style>
.expandInfo {
  border-top: 0px !important;
  margin-top: 20px;
  /* box-shadow: inset 0 0px 6px #bdbdbd; */
}
</style>
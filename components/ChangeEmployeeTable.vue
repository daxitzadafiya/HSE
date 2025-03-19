<template>
  <div>
    <template>
      <div class="v-dataTable">
        <review-attendee-data
          :open-popup="openAttendee"
          :objectItem="editedItem"
          :attendeeObjectID="attendeeObjectID"
          :allEmployee="allEmployee"
          :status="status"
          @closePopup="openAttendee = !openAttendee"
          @reloadEmployee="reloadEmployee"
        />

        <v-data-table
          v-if="attendeeArray?.length > 0 && !checkRoutine"
          :headers="AttendeeHeaders"
          :items="attendeeArray"
          :items-per-page="10"
          single-expand
          :expanded.sync="expanded"
          :sort-by="['created_at']"
          :sort-desc="[true, false]"
          class="elevation-1 review-table review-popup-table px-1 mb-0 history-table"
          hide-default-footer
          @click:row="AttendeeInformation"
        >
          <template slot="top">
            <v-toolbar flat class="align-center table-title">
              <v-toolbar-title>
                {{ titleMessage ? titleMessage : $t('title.attendees') }}
              </v-toolbar-title>
              <!-- <div v-if="editedItem.isRecurring && checkAdmin || checkCreator || checkManager"> -->
              <div
                v-if="addTopic && !checkUser"
                role="button"
                class="plus-icon-gray text-center d-flex align-center justify-center"
              >
                +
              </div>
              <div class="reminder-history ms-auto" v-if="isReminder && attendeeHistoryData?.length >0">
                <img
                  class="reminder-img align-center"
                  src="../assets/images/icon/reminder-history.png"
                  alt="file.png"
                  @click="reminder_history"
                />
              </div>
              <!-- </div> -->
            </v-toolbar>
          </template>
          <template v-slot:header.actions="{ header }">
            <div v-if="checkResponsiblePersone && !inReportData">{{ $t('column.action') }}</div>
          </template>
          <template v-slot:item.name="{ item }">
            <!-- add table comp -->
            <v-hover
              v-slot:default="{ hover }"
              v-if="item?.status == 'Removed' || item?.status == 'Reassigned'"
            >
              <v-badge
                :value="hover"
                transition="slide-x-transition"
                class="hse--icon-question-circle hover-label"
              >
                <span slot="badge" v-if="item?.status === 'Removed'">{{
                  item?.attendee_history?.old_attendee_employee +
                  ' ' +
                  'removed by' +
                  ' ' +
                  item?.attendee_history?.updated_by
                }}</span>
                <span slot="badge" v-else-if="item?.status == 'Reassigned'">{{
                  item?.attendee_history?.old_attendee_employee +
                  ' ' +
                  'change to :' +
                  ' ' +
                  item?.attendee_history?.new_attendee_employee +
                  ' ' +
                  'by' +
                  ' ' +
                  item?.attendee_history?.updated_by
                }}</span>
                <!-- <div :class="item.status == 4 ? 'disabled' : (item.status === 5 ? 'disabled' : '')"> -->
                <div
                  :class="
                    item?.status == 'Removed'
                      ? 'disabled'
                      : item?.status === 'Reassigned'
                      ? 'disabled'
                      : ''
                  "
                >
                  {{ item?.name || item?.subject || item?.attendeeName }}
                </div>
              </v-badge>
            </v-hover>
            <!-- <div  v-if="item.status == 'Removed' || item.status == 'Reassigned'" :class="item.status !== 'Removed' || item.status !== 'Reassigned' ? 'disabled': ''"> {{item.attendeeName }}</div> -->
            <div
              v-else-if="
                item?.status !== 'Removed' || item?.status !== 'Reassigned'
              "
            >
              {{ item?.attendeeName }}
            </div>
          </template>
          <template v-slot:item.comment="{ item, index }">
            <!-- add table -->
            <div
              v-if="item?.status == 'Removed' || item?.status == 'Reassigned'"
              :class="
                item?.status !== 'Removed' || item?.status !== 'Reassigned'
                  ? 'disabled'
                  : ''
              "
            >
              {{
                item?.comment == null || item?.comment === 'undefined' || item?.comment == 'null'
                  ? 'N/A'
                  : item?.comment
              }}
            </div>
            <div v-else>
              <span
                v-if="item?.comment == null || item?.comment === 'undefined' || item?.comment == 'null'"
                @click.stop
              >
                N/A
              </span>
              <span v-else @click.stop="checkComment(item?.comment)" role="button">
                {{
                  item?.comment?.length > 19
                    ? item?.comment?.slice(0, 19) + '...'
                    : item?.comment
                }}
              </span>
            </div>
          </template>
          <template v-slot:item.image="{ item, index }">
            <!-- add table -->
            <img
              v-if="item?.status === 'Removed' || item?.status === 'Reassigned'"
              src="../assets/images/icon/disabled-image.png"
              @click.stop
            />
            <img
              v-else-if="
                item?.image == null &&
                (item?.status !== 'Removed' || item?.status !== 'Reassigned')
              "
              src="../assets/images/icon/image-gray.png"
              @click.stop
            />
            <img role="button"
              v-else-if="item?.image !== null"
              src="../assets/images/icon/image-green.png"
              @click.stop="checkImage(item?.image)"
            />
          </template>
          <template v-slot:item.date="{ item, index }"> 
            <div
              :class="item?.status == 'Removed' || item?.status == 'Reassigned'? 'disabled': ''">

            {{ moment(item?.time_info?.start_date).format('DD.MM.YYYY') }}
            {{item?.time_info?.start_time && '-' + item?.time_info?.start_time}}
            </div>
          </template>
          <template v-slot:item.status="{ item }">
            <!-- <div @click.stop="employeeItem">  -->
            <!-- <v-chip
              v-if="item?.status === 'new'"
              class="status-btn status-label-custom pending"
              label
            >
              {{ $t('form.new') }}
            </v-chip> -->
            
            <status-chip
                  :status="item?.status"
                  :inReview="false"
                  :inRisk="false"
                  :extended_date="item?.extended_timeline?.old_deadline ? true :false "
                />
          </template>

          <template
            v-slot:item.actions="{ item }"
            v-if="checkResponsiblePersone && !inReportData"
          >
            <div
              class="d-flex "
              v-if="
                item?.status === 'completed' ||
                item?.status === 'completed_overdue'
              "
            >
              <div class="manager-task-action">
                <v-btn @click.stop="approvedstatus(item, 'approve')" text>
                  {{ $t('form.approve') }}
                </v-btn>
              </div>
              <div class="manager-task-action">
                <v-btn @click.stop="approvedstatus(item, 'disapprove')" text>
                  {{ $t('form.disapprove') }}
                </v-btn>
              </div>
            </div>
            <div class="d-flex" v-if="item?.status === 'request'">
              <div>
                <v-btn @click.stop="extensionRequest(item)" text color="error">
                  {{ $t('form.extension_request') }}
                </v-btn>
              </div>
            </div>
            <div class="d-flex" v-if="item?.status === 'overdue'">
              <div>
                <v-btn text @click.stop style="cursor: initial !important;">
                  {{ $t('form.pending') }}
                </v-btn>
              </div>
            </div>
            <!-- isDeadlineDisapproved -->
            <div class="d-flex" v-if="item?.status === 'timeline_disapproved'">
              <div>
                <v-btn @click.stop="DeadlineDisapproved(item)" text>
                  {{ $t('form.request_disapproved') }}
                </v-btn>
              </div>
            </div>
          </template>
          <!-- <template 
            v-slot:expanded-item="{ headers, item }"
            v-if="showExpand"
          >
            <td colspan="7" v-if="showExpand && item.status === 'timeline_disapproved'" class="py-3">
              <div>
                <div class="label-item">
                  Deadline Disapproved date :{{ moment(item.extended_timeline.created_at).format('DD.MM.YYYY') }}
                </div>
                <div class="info-item">
                  {{ item.extended_timeline.extended_by_reason }}
                </div>
              </div>
            </td>
          </template> -->
        </v-data-table>
         <div v-if="expandedRowItem && showExpand">
          <!-- <v-row> -->
            <v-col cols="12" class="px-3 border expandTable">
              <div>
                <div class="label-item mb-4">
                  Deadline Disapproved date :{{ moment(expandedRowItem?.extended_timeline?.created_at).format('DD.MM.YYYY') }}
                </div>
                <div class="info-item">
                  {{ expandedRowItem?.extended_timeline?.extended_by_reason }}
                </div>
              </div>
            </v-col>
          <!-- </v-row> -->
        </div>

        <v-dialog v-model="approvedAction" max-width="500">
          <v-card class="approve-model py-4">
            <v-card-title class="text-h6 text-capitalize mb-5 pb-5">
              <span>
                {{ $t('message.do_you_want_to_approve') }}
              </span>
            </v-card-title>

            <v-card-actions class="pb-4">
              <div class="approve-actions">
                <v-btn text @click="approvedAction = false">
                  {{ $t('button.cancel') }}
                </v-btn>

                <v-btn class="btn-save" text @click="approved">
                  {{ $t('button.approve') }}
                </v-btn>
              </div>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="isExtensionRequest" max-width="860px">
          <v-card class="dialog-delete">
            <v-card-title class="text-h6 text-capitalize mb-5">
              <div class="text-center mx-auto extend-deadline">
                {{ $t('message.request_extend_deadline') }}
              </div>
            </v-card-title>
            <v-card-text>
              <div class="confirm-delete-text">
                <p>
                  Request Deadline Date :
                  {{ moment(timeLine?.deadline_date).format('DD-MM-YYYY') }} -
                  {{ timeLine?.deadline_time }}
                </p>
                {{ timeLine?.reason }}
              </div>
            </v-card-text>
            <v-card-actions>
              <div class="mx-auto">
                <v-btn
                  class="btn-save"
                  @click="approvedRequest(requestExtensionItem, 'approve')"
                >
                  {{ $t('button.approve') }}
                </v-btn>
                <v-btn
                  class="btn-cancel btn-disapprove not-done"
                  text
                  @click="approvedRequest(requestExtensionItem, 'disapprove')"
                >
                  {{ $t('button.disapprove') }}
                </v-btn>
              </div>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <attendees-history-table
          v-if="isReminderHistory"
          :attendeeHistoryHeaders="AttendeeHistoryHeaders"
          :attendeeReview="true"
          :attendeeItemsDetail="attendeeItemsDetail"
          :responsible_name="responsible_name"
          @reloadEmployee="reloadEmployee"
        />

        <DisApprovedPopup
          :open-popup="disapprovedModal"
          :isDisapproved="isDisapproved"
          :objectItem="approvedItem"
          :title-message="disApprovedTitle"
          :extendDate="true"
          :extendTime="true"
          @disApproved="disApproved"
          @closePopup="disapprovedModal = !disapprovedModal"
        />

        <ReasonPopup
          :open-popup="showComment"
          @closePopup="showComment = !showComment"
          :titleMessage="$t('form.feedback')"
          :addDescription="addDescription"
        />

        <ImagePopup
          :open-popup="showImage"
          @closePopup="showImage = !showImage"
          :titleMessage="$t('form.image')"
          :addImage="addImage"
        />
      </div>
    </template>
  </div>
</template>

<script>
import AttendeesHistoryTable from './AttendeesHistoryTable.vue'
import DisApprovedPopup from './DisApprovedPopup.vue'
import ImagePopup from './ImagePopup.vue'
import ReasonPopup from './ReasonPopup.vue'
import ReviewAttendeeData from './ReviewAttendeeData.vue'
import StatusChip from './StatusChip.vue'
import cookies from 'js-cookie'
// import { _ } from 'vue-underscore'
// // import api from '~/apis'
// import cookies from 'js-cookie'

export default {
  components: {
    ReviewAttendeeData,
    AttendeesHistoryTable,
    ReasonPopup,
    ImagePopup,
    DisApprovedPopup,
    StatusChip,
  },
  //   components: { ReasonPopup, ImagePopup, DisApprovedPopup, FeedbackPopup },
  name: 'AddTable',
  props: {
    attendeeArray: {
      type: Array,
      required: false,
    },
    AttendeeHeaders: {
      type: Array,
      required: false,
    },
    attendeeObjectID: {
      type: [Number, String],
      required: false,
    },
    addCommentAttach: {
      type: Boolean,
      required: false,
    },
    titleMessage: {
      type: String,
      required: false,
    },
    addTopic: {
      type: Boolean,
      required: false,
    },
    isReminder: {
      type: Boolean,
      required: false,
    },
    predefinedLinkArray: {
      type: Array,
      required: false,
    },
    hoverMessage: {
      type: String,
      required: false,
    },
    tableIcon: {
      type: String,
      required: false,
    },
    attendeeHistoryData: {
      type: Array,
      required: false,
    },
    checkResponsiblePersone: {
      type: Boolean,
      required: false,
    },
    isReminderHistory: {
      type: Boolean,
      required: false,
    },
    showExpand:{
      type: Boolean,
      required: false,
      default: null
    },
    checkEdit:{
      type: Boolean,
      required: false,
    },
    allEmployee:{
      type: String,
      required: false,
    },
    inReportData:{
      type: Boolean,
      required: false,
    },
    checkRoutine:{
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      openAttendee: false,
      checkManager: false,
      checkWorker: false,
      //  isReminderHistory:false,
      editedItem: {},
      attendeeItemsDetail: [],
      responsible_name: [],
      addDescription: '',
      addImage: '',
      showImage: false,
      showComment: false,
      approvedAction: false,
      disapprovedModal: false,
      isDisapproved: false,
      disApprovedTitle: '',
      approvedItem: {},
      expanded: [],
      singleExpand: false,
      isExtensionRequest: false,
      requestExtensionItem: {},
      timeLine: {},
      
      hover: false,
      newItem: {
        data: '',
        item: '',
      },
      expandedRowItem:null,
      roleUser: cookies.get('roleUser'),
      status: ''
    }
  },
  computed: {
    DefaultAttendeeHeaders() {
      return [
        {
          text: this.translateCol('employee_name'),
          value: 'name',
          align: 'left',
          sortable: false,
          width: '20%',
        },
        {
          text: this.translateCol('feedback'),
          value: 'comment',
          align: 'left',
          width: '20%',
        },
        {
          text: this.translateCol('image'),
          value: 'image',
          align: 'left',
          sortable: false,
          width: '20%',
        },
        {
          text: this.translateCol('status'),
          value: 'status',
          align: 'center',
          width: '20%',
        },
        {
          text: this.translateCol('actions'),
          value: 'actions',
          align: 'center',
          sortable: false,
          width: '20%',
        },
      ]
    },
    AttendeeHistoryHeaders() {
      return [
        { value: 'imageStatus', align: 'left', sortable: false },
        { value: 'employeeStatus', align: 'left' },
        { value: 'plusicon', align: 'right' },
      ]
    },
  },
  watch: {},
  created() {
    if (this.roleUser == 'manager') {
      this.checkManager = true
    } else if (this.roleUser == 'user') {
      this.checkUser = true
    }
  },
  methods: {
    checkImage(item) {
      this.showImage = true
      this.addImage = item
    },
    checkComment(item) {
      this.showComment = true
      this.addDescription = item
    },
    reminder_history() {
      this.reloadEmployee()
      this.$emit('is_reminder_history')
      // this.isReminderHistory=!this.isReminderHistory
      this.attendeeItemsDetail = this.attendeeHistoryData
      this.otherDetail = this.attendeeArray
    },

    AttendeeInformation(item) {
      this.status=item?.status;
      this.editedItem = Object.assign({}, item)
      if (this.checkResponsiblePersone && (item?.status === 'pending' || item?.status === 'new' || item?.status === 'Removed' || item?.status === "Reassigned" || item?.status === "ongoing" || item?.status === "completed" || item?.status === "disapproved" || item?.status === "disapproved_with_extended" || item?.status === "overdue" || item?.status === "completed_overdue"  || item?.status === "disapproved_overdue" ) || (!this.checkResponsiblePersone && (item?.status === 'Removed' || item?.status === "Reassigned"))) {
        this.openAttendee = true
      }
      this.isReminderHistory = false
    },

    reloadEmployee() {
      this.$emit('reloadEmployee')
    },

    approvedstatus(item, status) {
      if (status == 'approve') {
        this.approvedAction = true
      } else {
        this.isDisapproved = false
        this.disapprovedModal = true
        this.disApprovedTitle = 'Do you want to disapprove ?'
      }
      this.approvedItem = item
    },

    approvedRequest(item, status) {
      if (status == 'approve') {
        this.isExtensionRequest = false
        this.$emit('approvedReqestDate', item)
      } else {
        this.isExtensionRequest = false
        this.disapprovedModal = true
        this.isDisapproved = true
        // this.$emit('declineReqestDate', item)
      }
    },

    approved() {
      this.approvedAction = false
      this.$emit('statusApprovedAction', this.approvedItem)
    },
    disApproved(item , requestDeadline) {
      this.disapprovedModal = false
      if (item.isDisapproved == true) {
        this.newItem.data = item
        this.newItem.item = this.requestExtensionItem
        this.$emit('declineReqestDate', this.newItem)
      } else {
        this.$emit('statusDisapprovedAction', item , requestDeadline)
      }
    },

    extensionRequest(item) {
      this.isExtensionRequest = true
      this.requestExtensionItem = item
      this.timeLine = this.requestExtensionItem?.extended_timeline
    },
    DeadlineDisapproved(item){
      this.showExpand = !this.showExpand;
      // this.expanded = [];
      //     const indexExpanded = this.expanded.findIndex((i) => i === item);
      //     if (indexExpanded > -1) {
      //       this.expanded.splice(indexExpanded, 1);
      //     } else {
      //       console.log("else---->",item);
      //       this.expanded.push(item);
      //       console.log("this.expanded---->",this.expanded);
      //     }
      this.expandedRowItem = this.expandedRowItem === item ? null : item;
    },

    translateCol(colName) {
      return this.$i18n.t('column.' + colName)
    },
  },
}
</script>
<style scoped>
:deep(.disabled) {
  z-index: 99 !important;
  color: #adadad !important;
}
.status-btn {
  width: 130px;
}
.approve-model span {
  margin: 0 auto !important;
}
.approve-model .approve-actions {
  margin: 0 auto !important;
}
:deep(.btn-disapprove) {
  background-color: #fd5155 !important;
  color: #fff !important;
  margin-left: 42px !important;
}
:deep(.btn-cancel.btn-disapprove span) {
  text-decoration: none;
}
:deep(.deadline-hover .v-badge__wrapper .v-badge__badge){
  background-color: #666768 !important;
  inset: auto auto calc(100% - -3px) calc(-72% - -137px) !important;
}
:deep(.hover-label .v-badge__wrapper .v-badge__badge){
  background-color: #666768 !important;
  inset:auto auto calc(100% - -5px) calc(100% - 92px) !important
}
.expandTable{
  border-top: 0px !important;
  box-shadow: inset 0 0px 0px #bdbdbd;
}
.text-h6{
  font-family: 'Montserrat', sans-serif !important;
}
:deep(.v-btn:not(.v-btn--round).v-size--default:hover){
  background: #eee;
}
:deep(.v-data-table-header tr th span){
  font-size: 13px !important;
}
/* :deep(.v-btn.v-btn--text.theme--light.v-size--default:focus){
  background: transparent !important;
}
:deep([data-v-d82b0e36] .v-btn:not(.v-btn--round).v-size--default:hover){
  background: transparent !important;
} */
:deep(.v-btn:before){
  background-color: transparent  !important;
}
.manager-task-action:hover .v-btn__content{
  text-decoration: underline;
}
/* :deep(.table-title + div){
  height: 50px !important;
} */
</style>
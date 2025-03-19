<template>
  <div>
    <template>
      <div class="v-dataTable">
        <v-data-table
          :headers="headers"
          :items="topicArray"
          :items-per-page="10"
          :single-expand="true"
              :sort-by="['created_at']"
              :sort-desc="[true, false]"
          class="elevation-1 review-table review-popup-table px-1"
          hide-default-footer
          @click:row="onTaskInformation"
        >
          <template slot="top">
            <v-toolbar flat class="align-center">
              <v-toolbar-title>
                {{ titleMessage ? titleMessage : $t('title.topic_name')  }}
              </v-toolbar-title>
              <!-- <div v-if="editedItem.isRecurring && checkAdmin || checkCreator || checkManager"> -->
              <div v-if="addTopic && !checkUser"
                role="button"
                class="
                  plus-icon-gray
                  text-center
                  d-flex
                  align-center
                  justify-center
                "
              >
                +
              </div>
              <div class="reminder-history ms-auto" v-if="isReminder">
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
            <div v-if="checkManager">{{ $t('column.action') }}</div>
          </template>
          <template v-slot:item.name="{ item }">
                  <!-- <div :class="item.status === 4 ? 'disabled' : (item.status === 5 ? 'disabled' : '')">
                    {{ item.name }}
                  </div> -->
                  <!-- <v-hover v-slot:default="{ hover }" :disabled="item.status=='new'" v-if="!item.status == 'new'"> -->
                  <v-hover v-slot:default="{ hover }" v-if="item.status !== 'new'">
                    <v-badge   :value="hover" transition="slide-x-transition" class="hse--icon-question-circle hover-label">
                      <span slot="badge" v-if="item.status==='Removed'">{{item.attendee_history.old_attendee_employee + ' ' + 'removed by' + ' ' + item.responsibleName}}</span>
                      <span slot="badge" v-else-if="item.status=='Reassigned'">{{item.attendee_history.old_attendee_employee + ' ' + 'change to :' + ' ' + item.attendee_history.new_attendee_employee + ' ' + 'by' + ' ' + item.responsibleName}}</span>
                      <!-- <div :class="item.status == 4 ? 'disabled' : (item.status === 5 ? 'disabled' : '')"> -->
                      <div :class="item.status == 'Removed' ? 'disabled' : (item.status === 'Reassigned' ? 'disabled' : '')">
                        {{ item.name|| item.subject || item.attendeeName }}
                        </div>
                      </v-badge>
                   </v-hover>
                   <div v-else> {{ item.name || item.subject || item.attendeeName }}</div>
          </template>
                <template v-slot:item.start_date="{item}">
                  {{ moment( item.start_date).format('DD-MM-YYYY') }} 12:30 PM
                  <!-- {{ item.start_date }}  12:30 PM -->
                </template>
                
                <template v-slot:item.deadline="{item}">
                  <div class="d-flex justify-center" v-if="item.checkStatus">
                    <span  class="text-decoration-line-through">{{ moment( item.deadline).format('DD-MM-YYYY') }} 
                       <!-- {{ item.deadline }} -->
                      </span> 
                    <v-chip
                    class="rounded-xl status-label-custom ongoing deadline-chip ms-2"
                    small
                    >
                    28.12.2022 12:30 PM
                  </v-chip>
                </div>
                <span v-else>

                  {{ moment( item.deadline).format('DD-MM-YYYY') }}   12:30 PM
                </span>
                </template>
          <template v-slot:item.comment="{ item,index }">
            <div :class="item.status === 'Removed' ? 'disabled' : (item.status === 'Reassigned' ? 'disabled' : '')" @click.stop="showComment=true" v-if="item.status === 'Removed' ? showComment : (item.status === 'Reassigned' ? showComment : !showComment) ">
              <!-- <v-textarea rows="1"
                    v-model="item.comment"
                    auto-grow
                    
                    ></v-textarea> -->
                    <div class="w-75">
                      {{ item.comment }}
                    </div>
                    
              <div v-if="addCommentAttach" @click.stop>
                
                <img src="../assets/images/gridIcon/comment.png" alt="" srcset="" v-if="index%2==0" @click.stop>
                <img src="../assets/images/gridIcon/comment_fill_red.png" alt="" srcset="" v-if="index%2==1" @click.stop> 
              </div>
            </div>
            <div v-else :class="item.status === 'Removed' ? 'disabled' : (item.status === 'Reassigned' ? 'disabled' : '')" class="w-75">
              {{ item.comment }}
            </div>
            <div v-if="item.comment===null" :class="item.status === 'Removed' ? 'disabled' : (item.status === 'Reassigned' ? 'disabled' : '')">
              N/A
            </div>
          </template>
          <template v-slot:item.image="{ item, index }">
            <img  v-if="item.status === 'Removed' || item.status === 'Reassigned'" src="../assets/images/icon/disabled-image.png" @click.stop/>
            <img
              src="../assets/images/icon/image-red.png"
              @click.stop
              v-else-if="addCommentAttach "
            />
            <!-- v-else-if="(!addCommentAttach) || item.status >= 1 " -->
            <img
            src="../assets/images/icon/image-green.png"
            v-else-if="(!addCommentAttach) && item.status >= 2"
            @click.stop="showImage = true"
            />
            
            <img v-else
              src="../assets/images/icon/image-gray.png"
              @click.stop
              />
          </template>
          <template v-slot:item.colorCode="{ item }">
            <!-- <v-chip>
              {{ item.risk }}
            </v-chip> -->
            <v-chip  :color="item.colorCode">{{ item.risk }}</v-chip>
          </template>
          <template v-slot:item.added="{ item }">
            <span v-if="item.added">

              {{ item.added }}
            </span>
            <span v-else>
              N/A
            </span>
          </template>
          <template v-slot:item.responsible="{ item }">
            <span v-if="item.responsible">

              {{ item.responsible }}
            </span>
            <span v-else>
              N/A
            </span>
          </template>
          <template v-slot:item.totalattendees="{ item }">
            <span v-if="item.totalattendees">

              {{ item.totalattendees }}
            </span>
            <span v-else>
              N/A
            </span>
          </template>
          <template v-slot:item.status="{ item }">
            <!-- <div @click.stop="employeeItem">  -->
            <v-chip
              v-if="item.status === 'new'"
              class="status-btn status-label-custom pending"
              label
            >
              {{ $t('form.new') }}
            </v-chip>
            <v-chip
              v-if="item.status === 6"
              class="status-btn status-label-custom pending"
              label
            >
              {{ $t('form.pending') }}
            </v-chip>
            <v-chip
              v-else-if="item.status === 0"
              class="status-btn status-label-custom not-done"
              label
            >
              {{ $t('form.not_done') }}
            </v-chip>
            <v-hover
              :disabled="!item.checkStatus"
              v-else-if="item.status === '1'"
              v-slot:default="{ hover }"
            >
              <v-badge
                :value="hover"
                right
                transition="slide-x-transition"
                class="hse--icon-question-circle deadline-hover"
              >
                <span slot="badge"
                  >This deadline Extended 20.11.2022 - 30.11.2022 By
                  Manager</span
                >
                <v-chip class="status-btn status-label-custom ongoing" label>
                  <span v-if="item.checkStatus"
                    >{{ $t('form.ongoing') }}
                    <div
                      role="button"
                      class="
                        info-icon-gray
                        text-center
                        d-flex
                        align-center
                        justify-center
                      "
                    >
                      !
                    </div>
                  </span>
                  <span v-else>{{ $t('form.ongoing') }}</span>
                </v-chip>
              </v-badge>
            </v-hover>
            <v-chip
              v-else-if="item.status === 2"
              class="status-btn status-label-custom approved"
              label
            >
              {{ $t('form.completed') }}
              <!-- <div>
                <img src="../assets/images/icon/alert.png" alt="" srcset="">
              </div> -->
              
            </v-chip>
            <v-chip
              v-else-if="item.status === 3"
              class="status-btn status-label-custom ongoing"
              label
            >
              {{ $t('form.request') }}
            </v-chip>
            <v-chip
              v-else-if="item.status === 4 || item.status == 'Reassigned'"
              class="status-btn status-label-custom not-done"
              label
            >
              {{ $t('form.reassigned') }}
            </v-chip>
            <v-chip
              v-else-if="item.status === 5 || item.status == 'Removed'"
              class="status-btn status-label-custom not-done"
              label
            >
              {{ $t('form.removed') }}
            </v-chip>
            <v-chip
              v-else-if="item.status === -2"
              class="status-btn status-label-custom not-done"
              label
            >
              {{ $t('form.disapproved') }}
            </v-chip>
            <!-- <v-chip
              v-else
              class="status-btn status-label-custom approved"
              label
            >
              {{ $t('form.approved') }}
            </v-chip> -->
          </template>
          <template v-slot:item.actions="{ item }" v-if="checkManager">
            <div class="d-flex" v-if="item.status === 2">
              <div>
                <v-btn @click.stop="approvedstatus(item, 'approve')" text>
                  {{ $t('form.approve') }}
                </v-btn>
              </div>
              <div>
                <v-btn @click="approvedstatus(item, 'disapprove')" text>
                  {{ $t('form.disapprove') }}
                </v-btn>
              </div>
            </div>
            <div class="d-flex" v-if="item.status === 3">
              <div>
                <v-btn @click.stop="extensionRequest(item)" text color="error">
                  {{ $t('form.extension_request') }}
                </v-btn>
              </div>
            </div>
            <div class="d-flex" v-if="item.status === '1' && item.checkStatus && !requestDisapproved">
                    <div>
                      <v-btn 
                        text
                      >
                        {{ $t('form.pending') }}
                      </v-btn>
                    </div>
                </div>
                <!-- isDeadlineDisapproved -->
                <div class="d-flex" v-if="item.status === 1 && requestDisapproved">
                    <div>
                      <v-btn @click.stop="DeadlineDisapproved()"
                        text
                      >
                        {{ $t('form.request_disapproved') }}
                      </v-btn>
                    </div>
                </div>
          </template>
          <template v-slot:item.is_security="{ item }">
      <v-hover v-slot:default="{ hover }">
          <v-badge :value="hover" right transition="slide-x-transition" class="hse--icon-question-circle table-badge">
            <!-- <span slot="badge">{{ $t('message.share') }}</span> -->
            <span slot="badge">{{ hoverMessage }}</span>
            <!-- <img class="icon-img" src="../assets/images/gridIcon/security.png" alt="fillSecurity.png" @click.stop/> -->
            <img class="icon-img" :src="require(`../assets/images/gridIcon/${tableIcon}.png`)" alt="fillSecurity.png" @click.stop/>

            <!-- ------------------ add other icon this feild reusable on props ------------ -->

          </v-badge>
        </v-hover>
      </template>
        </v-data-table>
        <div v-if="isDeadlineDisapproved" class="info-block border w-100 py-6 px-4 mt-n11 border-top-0">
                <div >
                  <div class="label-item mb-3">
                    Deadline Disapproved date :  12.11.2022 11:25 AM
                  </div>
                  <div class="info-item">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis vulputate libero et velit interdum, ac aliquet odio mattis.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum.
                  </div>
                </div>
              </div>
        <v-dialog v-model="isExtensionRequest" max-width="860px">
          <v-card class="dialog-delete">
            <v-card-text>
              <div class="text-center extend-deadline">
                {{ $t('message.request_extend_deadline') }}
              </div>
              <div class="confirm-delete-text">
                <p>
                  Request Deadline Date :
                  {{ moment().format('DD-MM-YYYY') }} 10:30 AM
                </p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
                vulputate libero et velit interdum, ac aliquet odio mattis.Lorem
                ipsum dolor sit amet, consectetur adipiscing elit. Nunc
                vulputate libero et velit interdum, ac aliquet odio mattis.
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn class="btn-save" @click="approvedRequest('approve')">
                {{ $t('button.approve') }}
              </v-btn>
              <v-btn
                class="btn-cancel btn-disapprove"
                text
                @click="
                  approvedRequest('disapprove', 'disapprove Attendee Deadline?')
                "
              >
                {{ $t('button.disapprove') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="approvedAction" max-width="490">
          <v-card>
            <v-card-title class="text-h6 text-capitalize">
              {{ $t('message.do_you_want_to_approve') }}
            </v-card-title>

            <v-card-actions>
              <v-btn text @click="approvedAction = false">
                {{ $t('button.cancel') }}
              </v-btn>

              <v-btn class="btn-save" text @click="approved">
                {{ $t('button.approve') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
      <ReasonPopup
        :open-popup="showComment"
        :document-item="editedItem"
        @closePopup="showComment = !showComment"
        :titleMessage="$t('form.feedback')"
        :addDescription="addDescription"
      />

      <ImagePopup
        :open-popup="showImage"
        :document-item="editedItem"
        @closePopup="showImage = !showImage"
        :titleMessage="$t('form.image')"
        :addImage="addImage"
      />
      <DisApprovedPopup
        :open-popup="disapprovedModal"
        :isDisapproved="isDisapproved"
        :title-message="disApprovedTitle"
        :document-item="editedItem"
        @disApproved="disApproved"
        @closePopup="disapprovedModal = !disapprovedModal"
      />

      <FeedbackPopup
        :open-popup="isWorkerRoutine"
        :object-item="editedItem"
        :isResubmit="isResubmit"
        :predefinedLinkArray="predefinedLinkArray"
        @closePopup="isWorkerRoutine = !isWorkerRoutine"
        @workerFeedback="workerFeedback"
      />
    </template>
  </div>
</template>

<script>
import { _ } from 'vue-underscore'
// import api from '~/apis'
import cookies from 'js-cookie'
import DisApprovedPopup from './DisApprovedPopup.vue'
import FeedbackPopup from './FeedbackPopup.vue'
import ImagePopup from './ImagePopup.vue'
import ReasonPopup from './ReasonPopup.vue'

export default {
  components: { ReasonPopup, ImagePopup, DisApprovedPopup, FeedbackPopup },
  name: 'AddTable',
  props: {
    topicArray: {
      type: Array,
      required: false,
    },
    headers: {
      type: Array,
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
  },
  data() {
    return {
    checkAdmin: cookies.get('checkAdmin'),
    checkSuperAdmin: cookies.get('checkSuperAdmin'),
    roleUser: cookies.get('roleUser'),
      showImage: false,
      showComment: false,
      addDescription:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis vulputate libero et velit interdum, ac aliquet odio mattis.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum.',
      addImage:'screenImage',
      editedItem: {
        description: '',
        deadline: '',
        deadline_pre: '',
        isRecurring: '',
      },

      riskElement: {
        id: '',
        name: '',
        description_default: '',
        type: '',
        type_id: '',
        probability: '',
        probabilityName: '',
        consequence: '',
        consequenceName: '',
        code: '',
        colorCode: '',
        colorName: '',
        point: '',
        description_resolve: '',
        newlyCreated: false,
        risk_element_source_id: '',
      },
      riskElementDefault: {
        id: '',
        name: '',
        description_default: '',
        type: '',
        type_id: '',
        probability: '',
        probabilityName: '',
        consequence: '',
        consequenceName: '',
        code: '',
        colorCode: '',
        colorName: '',
        point: '',
        description_resolve: '',
        newlyCreated: false,
        risk_element_source_id: '',
      },
      chooseRiskElement: [],
      colorCodeArr: [
        {
          min: 0,
          max: 0,
          value: 'black',
          name: 'None',
        },
        {
          min: 1,
          max: 3,
          value: 'green',
          name: 'Green',
        },
        {
          min: 4,
          max: 10,
          value: '#f0e509',
          name: 'Yellow',
        },
        {
          min: 11,
          max: 15,
          value: 'orange',
          name: 'Orange',
        },
        {
          min: 16,
          max: 16,
          value: 'red',
          name: 'Red',
        },
      ],
      checkManager: false,
      checkUser: false,
      approvedAction: false,
      disapprovedModal: false,
      isExtensionRequest: false,
      isDeadlineDisapproved: false,
      isDisapproved:false,
    disApprovedTitle:'',
    isWorkerRoutine:false,
    isResubmit:false,
    requestDisapproved:false,
    }
  },
  computed: {},
  created() {
    if (this.roleUser=='manager') {
      this.checkManager=true
    }
    else if(this.roleUser == 'user'){
      this.checkUser=true
    }
  },
  methods: {
    reminder_history(){
      this.$emit('is_reminder_history')
    },
    getItem() {
        var that = this;
        if (that.editedIndex > -1) {
          that.riskElementAnalysis = _.each(that.item.elements, function (element) {
            var point = element.probability * element.consequence;
            _.each(that.colorCodeArr, function(color) {
              if (point >= color.min && point <= color.max) {
                element.colorCode = color.value;
                element.colorName = color.name;
                element.point = point;
              }
            });
          });
        } else {
          that.riskElementAnalysis = [];
          that.chooseRiskElement = [];
        }
      },
    updateColorCode(riskElement) {
        var that = this;
        if (riskElement.probability && riskElement.consequence) {
          var point = riskElement.probability * riskElement.consequence;
          _.each(that.colorCodeArr, function(item) {
            if (point >= item.min && point <= item.max) {
              riskElement.colorCode = item.value;
              riskElement.colorName = item.name;
              riskElement.point = point;
            }
          });
        }
      },
    onTaskInformation(item,index) {
      // if (this.checkManager==false) {
        
        this.$emit('onTaskInfo',item,index)
      // }
    },

  
    employeeItem(item) {
      this.checkAddNew = true
      if (this.roleUser == 'manager') {
        this.checkAddNew = false
      }
      this.selectedEmployeeItem = item
      if (this.selectedEmployeeItem.status === 4) {
        this.isEmployeeStatus = true
        this.isEmployeeRemove = false
      } else if (this.selectedEmployeeItem.status === 5) {
        this.isEmployeeStatus = true
        this.isEmployeeRemove = true
      } else {
        this.isEmployeeStatus = false
      }
    },
    saveEmployee(payload) {
      if (payload) {
        this.selectedEmployeeItem.status = 5
      } else {
        this.selectedEmployeeItem.status = 4
      }
    },
    attendeeReason() {
      this.checkNew = true
    },
    attendeeStatus() {
      this.changeEmployee = true
    },
    DeadlineDisapproved(){
      this.isDeadlineDisapproved=!this.isDeadlineDisapproved
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
    changeStatus() {
      this.disapprovedModal = true
      this.disApprovedTitle = 'Extend Deadline Request'
    },
    disApproved() {
      (this.disapprovedModal = false), (this.approvedItem.status = 1)
      this.status = 1
      if (this.status == 1) {
        this.statusAction = true
        this.hideDone = true
      }
      this.approvedItem.checkStatus = true
      if (this.isDisapproved) this.requestDisapproved = true
    },
    approved() {
      (this.approvedAction = false), (this.approvedItem.status = 7)
    },
    extensionRequest(item) {
      this.isExtensionRequest = true
      this.approvedItem = item
    },
    approvedRequest(status, title) {
      if (status == 'approve') {
        this.approvedItem.status = 1
        this.approvedItem.checkStatus = true
      } else {
        this.disapprovedModal = true
        this.isDisapproved = true
        this.disApprovedTitle = title
      }
      this.isExtensionRequest = false
    },
    workerFeedback(payload) {
      this.status = payload.newStatus

      if (payload.isResubmit) {
        this.hideResubmit = true
      } else {
        this.hideDone = true
      }
    },
    changeTab(value) {
      this.$emit('changeTab', value)
    },

    translateCol(colName) {
      return this.$i18n.t('column.' + colName)
    },
  },
}
</script>
<style scoped>
.review-table {
  border: 1px solid #e0e0e0;
  margin-bottom: 40px;
}
/* .plus-icon {
  width: 25px;
  height: 25px;
  background-color: #85a33d;
  margin-left: 10px;
  border-radius: 100%;
  font-size: 25px;
  line-height: 25px;
  color: #fff;
} */

.plus-icon-gray {
  width: 25px;
  height: 25px;
  background-color: #9f9f9f;
  margin-left: 10px;
  border-radius: 100%;
  font-size: 25px;
  line-height: 25px;
  color: #fff;
}
:deep(.v-data-table-header span) {
  font-weight: 500;
}
.status-btn {
  width: 120px;
}
.extend-deadline {
  font-size: 24px;
  font-weight: 500;
  padding: 10px 0 40px;
  text-transform: capitalize;
}

.info-icon-gray {
  width: 15px;
  height: 15px;
  background-color: #666768;
  margin-left: 10px;
  border-radius: 100%;
  font-size: 10px;
  line-height: 25px;
  color: #fff;
  position: absolute;
  top: 10px;
  right: 10px;
}

:deep(.department) {
  display: block !important;
  width: 354px !important;
}
:deep(.new-department-input) {
  width: 100% !important;
}
:deep(.v-dialog .btn-add-department) {
  margin: 5px 10px 10px 2px !important;
}
/* .deactivation-icon img {
  margin-top: -14px;
} */
:deep(.v-btn:not(.v-btn--round).v-size--default) {
  padding: 6px 16px;
}
:deep(.hover-label .v-badge__badge){
  inset: auto auto calc(100% - -13px) calc(0% - 2px) !important;
  background-color: #666768 !important;
}
:deep(body .v-application .primary) {
  background-color: #666768 !important;
  border-color: #666768 !important;
}
:deep(.v-btn__content) {
  text-transform: capitalize;
}
:deep(.v-card__actions) {
  justify-content: center !important;
  padding-bottom: 40px !important;
}
:deep(.v-card .v-card__title) {
  display: flex;
  justify-content: center;
  padding: 40px 24px 25px !important;
}
:deep(.btn-disapprove) {
  background-color: #fd5155 !important;
  color: #fff !important;
  margin-left: 42px !important;
}
:deep(.btn-cancel.btn-disapprove span) {
  text-decoration: none;
}
.confirm-delete-text p {
  font-weight: 500;
  margin-bottom: 0;
}
.deactivation-icon img {
  margin-top: -14px;
}
:deep(.v-btn:not(.v-btn--round).v-size--default) {
  padding: 6px 16px;
}


:deep(.disabled) {
  z-index: 99 !important;
  color: #adadad !important;
}
:deep(.deadline-hover .v-badge__wrapper .v-badge__badge){
  inset: auto auto calc(100% - -3px) calc(0% - 134px) !important;
}

</style>
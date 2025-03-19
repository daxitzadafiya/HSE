<template>
  <div>
    <div class="review-popup">
      <div @click="taskEditItem" class="review-popup-table normal-table">
        <!-- Type -->
        <div v-if="!checkWorker" class="info-block progress-field w-50">
          <div class="label-item col-2 p-0">{{ $t('form.progress') }} :</div>
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

        <div v-if="checkWorker" class="info-block w-50 align-center">
          <div class="label-item">{{ $t('form.status') }} :</div>
          <v-chip
            v-if="editedItem.status == 'new'"
            class="info-item status-label-custom pending"
            label
          >
            {{ $t('form.new') }}
          </v-chip>
          <v-chip
            v-else-if="editedItem.status === 0"
            class="info-item status-label-custom not-done"
            label
          >
            {{ $t('form.not_done') }}
          </v-chip>
          <v-chip
            v-else-if="editedItem.status === 1 || !checkItem"
            class="info-item status-label-custom ongoing"
            label
          >
            {{ $t('form.ongoing') }}
            <div role="button" v-if="statusAction" class="ms-2">
              <img src="../assets/images/icon/alert.png" alt="" srcset="" />
            </div>
          </v-chip>
          <v-chip
            v-else-if="editedItem.status === 2 || checkItem"
            class="info-item status-label-custom approved"
            label
          >
            {{ $t('form.completed') }}
            <div role="button" v-if="checkItem" class="ms-2">
              <img
                src="../assets/images/icon/alert-white.png"
                alt=""
                srcset=""
              />
            </div>
          </v-chip>
          <v-chip
            v-else-if="editedItem.status === 3"
            class="info-item status-label-custom ongoing"
            label
          >
            {{ $t('form.request') }}
          </v-chip>

          <v-chip v-else class="info-item status-label-custom approved" label>
            {{ $t('form.approved') }}
          </v-chip>
          <div class="d-flex align-center" v-if="checkItem">
            <img
              class="icon-img ms-3"
              src="../assets/images/gridIcon/fillNote.png"
              alt="fillNote.png"
              @click.stop
            />
            <img
              src="../assets/images/icon/image-green.png"
              class="ms-2 mb-n1"
            />
          </div>
        </div>

        <!-- function -->
        <div class="info-block w-50">
          <div class="label-item">{{ $t('form.function') }} :</div>
          <div class="info-item" v-if="editedItem.function">
            {{ editedItem.function }}
          </div>
          <div class="info-item" v-else>
            {{ editedItem.source + '>' + editedItem.type }}
            <!-- {{"Deviation" + '>' + editedItem.type}} -->
          </div>
        </div>

        <!-- name -->
        <div class="info-block w-50 align-center">
          <div class="label-item">{{ $t('form.name') }} :</div>
          <div>
            {{ editedItem.name || 'Take care of fire' }}
          </div>
        </div>

        <!-- Category -->
        <div class="info-item w-50">
          <div class="info-block">
            <div class="label-item">{{ $t('form.category') }} :</div>
            <div class="info-item">
              {{ editedItem.categoryName || 'category 1' }}
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="info-block description">
          <div class="label-item">{{ $t('form.description') }}:</div>
          <div class="info-item">
            {{ editedItem.description || 'How to fix risk' }}
          </div>
        </div>

        <!-- Added by -->
        <div class="info-block w-50">
          <div class="label-item">{{ $t('form.added_by') }} :</div>
          <div class="info-item">
            {{ editedItem.addedByName || 'Creator' }}
          </div>
        </div>

        <!-- Responsible -->
        <div class="info-block w-50 chip responsible align-center">
          <div class="label-item">{{ $t('form.responsible') }} :</div>
          <div class="info-item">
             <!-- <v-chip
                    v-for="(item, index) in editedItem.responsible_names"
                    :key="index"
                    class="mr-2 mb-1 chip-custom"
                    small
                  >
                    {{ item }}
                  </v-chip> -->
            <!-- <v-chip class="mr-2 chip-custom" small> {{editedItem.res}} </v-chip> -->
            <v-chip
                    v-for="(item, index) in editedItem.responsible.employeeName"
                    :key="index"
                    class="mr-2 mb-1 chip-custom"
                    small
                  >
                    {{ item }}
                  </v-chip>
          </div>
        </div>

        <div class="info-block w-100" v-if="checkItem">
          <div>
            <div class="label-item mb-3 d-flex justify-content-between">
              Disapprove Task date : 12.11.2022 11:25 AM
              <span>Extend Time date : 12.11.2022 11:25 AM</span>
            </div>
            <div class="info-item">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
              vulputate libero et velit interdum, ac aliquet odio mattis.Lorem
              ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate
              libero et velit interdum, ac aliquet odio mattis.
            </div>
          </div>
        </div>

        <!-- required -->
        <div class="info-block w-100" v-if="!checkWorker">
          <div class="label-item">{{ $t('form.required') }} :</div>
          <div class="info-item">
            <!-- {{ editedItem.required || 'Feedback' }} -->
            <!-- <span v-if=""> -->
            <span v-if="editedItem.responsible.required_comment == 1 && editedItem.responsible.required_attachment == 0">
              Comment
            </span>
            <span v-else-if="editedItem.responsible.required_attachment == 1 && editedItem.responsible.required_comment == 0">
              Attachment
            </span>
            <span v-else-if="editedItem.responsible.required_attachment == 1 && editedItem.responsible.required_comment == 1">
              Comment/Attachment
            </span>
            <span v-else>
              N/A
            </span>
          </div>
        </div>

        <!-- Start date -->
        <div class="info-block col-6">
          <div class="label-item">{{ $t('form.start') }} :</div>
          <div class="info-item">
            {{ moment(editedItem.start_date).format('DD.MM.YYYY') }} - {{ editedItem.start_time}}
            <!-- {{ moment(editedItem.start_time).format('HH:mm') }} -->
            <!-- <span class="ml-2">12:45 PM</span> -->
          </div>
          <!-- <div class="info-item" @click.stop v-else >Not Applicable</div> -->
        </div>

        <!-- <div class="info-block w-50"> -->
          <!-- View -->
          <!-- <div class="label-item">
            {{ $t('form.start_date') }} :
          </div>
          <div
            class="info-item"
          >
            {{ moment(editedItem.start_date + ' ' + editedItem.start_time).format('DD.MM.YYYY h:mm A') }}
          </div>
        </div> -->

        <!-- Due date -->
        <div class="info-block w-50">
          <div class="label-item col-2 p-0">{{ $t('form.deadline') }} :</div>
          <div class="info-item" v-if="!statusAction && !checkItem">
            <!-- {{editedItem.recurring=='indefinite'?'indefinite':moment(editedItem.deadline).format('DD.MM.YYYY') }}   -->
            <span class="ml-2">
              <!-- {{moment(editedItem.deadline).format('DD.MM.YYYY - HH:mm')}} -->
              {{moment(editedItem.deadline).format('DD.MM.YYYY')}} - {{ editedItem.end_time }}
              </span>
          </div>
          <div v-if="(checkWorker && statusAction) || checkItem" class="d-flex">
            <span class="text-decoration-line-through"
              >{{moment(editedItem.deadline).format('DD.MM.YYYY')}} - {{ editedItem.end_time }}</span
            >
            <v-chip
              class="rounded-xl status-label-custom ongoing deadline-chip ms-2"
              small
            >
              {{moment(editedItem.deadline).format('DD.MM.YYYY')}} - {{ editedItem.end_time }}
            </v-chip>
          </div>
          <!-- <div v-if="checkWorker && !statusAction && !checkItem" class="d-flex">
            <div
              class="deactivation-icon"
              @mouseover="hoverItem = true"
              :class="hoverItem ? 'px-1' : 'px-2'"
            >
              <img
                src="../assets/images/icon/deactivation-calender-icon.svg"
                alt=""
                srcset=""
              />
            </div>
            <v-btn
              @click="changeStatus()"
              text
              v-if="hoverItem"
              color="error"
              @mouseleave="hoverItem = false"
              class="hover-item"
            >
              {{ $t('form.request_extention') }}
            </v-btn>
          </div> -->
        </div>
      </div>
      <AddTable
        v-if="!checkWorker"
        :titleMessage="titleMessage"
        :addTopic="false"
        :topicArray="editedItem.processingInfo"
        :headers="headers"
        :addCommentAttach="addCommentAttach"
        :isReminder="isReminder"
        @is_reminder_history="openHistory"
        @onTaskInfo="employeeItem"
      />

    </div>
    <ReviewAttendeePopup
      :open-popup="checkShowItem"
      :newItem="item"
      :item="editedItem"
      :document-item="Object.keys(selectedEmployeeItem).length > 0 ? selectedEmployeeItem : selectedItem"
      :emp_index="emp_index"
      @closePopup="checkShowItem = !checkShowItem"
      :isEmployeeStatus="isEmpStatus ? isEmpStatus : isEmployeeStatus"
      :isEmployeeRemove="isRemove ? isRemove: isEmployeeRemove"
      :responsible_name="responsible_name"
      :taskDeviation="taskDeviation"
      @saveEmployee="saveEmployee"
      @reloadList="reloadList"
      @updateEmployee="updateEmployee"
    />
    <AttendeesHistoryTable
      v-if="is_reminder_history"
      :title="$t('title.attendees_history')"
      :attendeeHistoryHeaders="AttendeeHistoryHeaders"
      :attendeeItemsDetail="attendeeItemsDetail"
      :reassigned_emp="reassigned_emp"
      :remove_emp="remove_emp"
      :responsible_name="responsible_name"
      @viewAttendeeDetail="viewAttendeeDetail"
    />
    <PrevNewEmployeePopup
      :open-popup="isAttendeeDetail"
      :item="editedItem"
      :document-item="attendeeDetails"
      :responsible_name="responsible_name"
      @closePopup="isAttendeeDetail = !isAttendeeDetail"
    />
      <!-- @saveTask="saveTask" -->
    <DeviationTaskEdit
      v-if="!checkWorker|| checkResponsible"
      :open-popup="editTask"
      :object-item="editedItem"
      :predefined-link-array="predefinedLinkArray"
      @closePopup="editTask = !editTask"
      @reloadList="reloadList"
      @saveTask="saveTask"
    />
    <DisApprovedPopup
      :open-popup="disapprovedModal"
      :isDisapproved="isDisapproved"
      :title-message="disApprovedTitle"
      :document-item="editedItem"
      @disApproved="disApproved"
      :predefined-link-array="predefinedLinkArray"
      @closePopup="disapprovedModal = !disapprovedModal"
    />
  </div>
</template>
  
  <script>
import { _ } from 'vue-underscore'
import DeviationTaskEdit from './DeviationTaskEdit.vue'
import cookies from 'js-cookie'
import AddTable from './AddTable.vue'
import DisApprovedPopup from './DisApprovedPopup.vue'
import AttendeesHistoryTable from './AttendeesHistoryTable.vue'
import PrevNewEmployeePopup from './PrevNewEmployeePopup.vue'
import ReviewAttendeePopup from './ReviewAttendeePopup.vue'
export default {
  components: {
    DeviationTaskEdit,
    AddTable,
    DisApprovedPopup,
    PrevNewEmployeePopup,
    ReviewAttendeePopup,
    AttendeesHistoryTable,
  },
  name: 'ResponsibleAttendeeAction',
  props: {
    editedItem: {
      type: Object,
      require: false,
    },
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
    disApprovedAction: {
      type: Object,
      require: false,
    },
    checkItem: {
      type: Boolean,
      required: false,
    },
    item:{
      type: [Object,Array],
      require: false,
    },
    checkResponsible:{
      type: Boolean,
      required: false,
    },
    checkCreator:{
      type: Boolean,
      required: false,
    },
    taskDeviation:{
      type: Boolean,
      required: false,
    },
    selectedItem:{
       type: [Object,Array],
      require: false,
    },
    editedNewItem:{
       type: [Object,Array],
      require: false,
    },
    checkShowItem:{
      type: Boolean,
      require: false,
    },
    isRemove:{
      type: Boolean,
      require: false,
    },
    isEmpStatus:{
      type: Boolean,
      require: false,
    }
  },
  data() {
    return {
      checkWorker: false,
      checkManager: false,
      is_reminder_history: false,
      is_employee: false,
      isEmployeeStatus: false,
      isEmployeeRemove: false,
      hoverItem: false,
      // checkShowItem: false,
      selectedEmployeeItem: {},
      disapprovedModal: false,
      userRoleId: cookies.get('roleID'),
      checkAdmin: cookies.get('checkAdmin'),
      userID: parseInt(cookies.get('userID')),
      roleUser: cookies.get('roleUser'),
      editTask: false,
      approvedItem: [],
      attendeeItemsDetail: [],
      isDisapproved: false,
      requestDisapproved: false,
      status: '',
      statusAction: false,
      isAttendeeDetail: false,
      disApprovedTitle: '',
      responsible_name:[],
      attendeeDetails:{},
      emp_index:'',
      updateEmpFlag:false,
      // attendeeItemsHistory:[{

      // }],
      updateValue:{
        up_index:'',
        up_item:'',
      }
    }
  },

  created() {
    if (this.roleUser == 'manager') this.checkManager = true

    if (this.roleUser == 'user') this.checkWorker = true

    // this.attendeeItemsDetail.push({
    // })
     
      // {
      //   imageStatus: '',
      //   employeeStatus: 'Employee 18 Removed by Creator',
      //   plusicon: '',
      // }
  },
  computed: {
    AttendeeHistoryHeaders() {
      return [
        { value: 'imageStatus', align: 'left', sortable: false },
        { value: 'employeeStatus', align: 'left' },
        { value: 'plusicon', align: 'right' },
      ]
    },
    TaskAttendeeHeaders() {
      return [
        {
          text: this.translateCol('employee_name'),
          value: 'name',
          align: 'left',
          sortable: false,
        },
        {
          text: this.translateCol('feedback'),
          value: 'comment',
          align: 'left',
        },
        {
          text: this.translateCol('image'),
          value: 'image',
          align: 'left',
          sortable: false,
        },
        { text: this.translateCol('status'), value: 'status', align: 'center' },
        {
          text: this.translateCol('actions'),
          value: 'actions',
          align: 'center',
          sortable: false,
        },
      ]
    },
  },
  methods: {
    translateCol(colName) {
      return this.$i18n.t('column.' + colName)
    },
    viewAttendeeDetail(item){
        this.isAttendeeDetail=true
        this.attendeeDetails=item
    },
    updateEmployee(emp_item){
      // let that=this
      // that.$store.dispatch('deviations/show', that.item.id)
      //   .then((res) => {
      //     that.$emit('updateEmployee', res?.data?.task_data.processingInfo[that.emp_index])
      //     that.reloadList()
      //   })
      if (this.taskDeviation) {
      this.updateEmpFlag=true
      this.selectedEmployeeItem = emp_item
      }else{
        this.updateEmpFlag=true
        this.$emit('updateEmployee',this.emp_index)
      }
    },
    openHistory(){
      let that = this
      that.is_reminder_history = !that.is_reminder_history
      // this.attendeeItemsDetail 
      that.attendeeItemsHistory=[]
      _.each(that.editedItem.processingInfo, async function (attendee) {
        that.responsible_name=attendee.responsibleName
        if (Object. keys(attendee.attendee_history). length > 0) {
          // if (attendee.status=='') {
            
          // }
          that.attendeeItemsHistory.push(
            attendee.attendee_history
          )
        }
      })
      that.attendeeItemsDetail=that.attendeeItemsHistory
    },
    taskEditItem() {
      if (this.editedItem.added_by == this.userID) {
        this.editTask = true
      }
    },
     reloadList() {
        this.$emit('reloadList');
      },
    saveTask(){
      this.$emit('editTask')
    },
    changeStatus() {
      this.disapprovedModal = true
      this.disApprovedTitle = 'Extend Deadline Request'
    },
    employeeItem(item,data) {
      console.log("item--1",item);
      if (this.taskDeviation) {
        this.$store.dispatch('deviations/show', this.item.id)
         .then((res) => {
           this.selectedEmployeeItem = res?.data?.task_data.processingInfo[data.index]
           console.log("dev-selected",this.selectedEmployeeItem );
           this.editedItem=res?.data?.task_data;
           // this.$emit('updateEmployee', res?.data?.task_data.processingInfo[this.emp_index])
           
      //  if (this.roleUser == 'manager') {
      //    this.checkShowItem = false
      //  }

       if (this.editedItem.responsible?.employeeRole?.includes(this.userID)) {
         this.checkShowItem = true
         this.is_reminder_history=false
       }else{
         this.checkShowItem = false
       }

      
       // if (!this.updateEmpFlag) {
         
       //   this.selectedEmployeeItem = item
       // }
       if (this.selectedEmployeeItem.status === 'Reassigned') {
         this.isEmployeeStatus = true
         this.isEmployeeRemove = false
       } else if (this.selectedEmployeeItem.status === 'Removed') {
         this.isEmployeeStatus = true
         this.isEmployeeRemove = true
       } else {
         this.isEmployeeStatus = false
       }
          //  this.reloadList()
         })
      }else{
        this.$emit('employeeItem',data)
      }
      this.emp_index=data.index
    },
    saveEmployee(payload) {
      if (payload) {
        this.selectedEmployeeItem.status = 'Removed'
      } else {
        this.selectedEmployeeItem.status = 'Reassigned'
      }
      if (this.taskDeviation) {
        this.$store.dispatch('deviations/show', this.item.id)
          .then((res) => {
            res.data.task_data.processingInfo=res?.data?.task_data?.processingInfo((item,index)=>{
                if(index===this.emp_index)
                {
                  item.status=this.selectedEmployeeItem.status;
                }
                if(index==res?.data?.task_data?.processingInfo.length-1)
                {
                  this.editedItem=res?.data?.task_data;
                }
            })
            });
      }else{
        this.updateValue.up_item=payload
        this.updateValue.up_index=this.emp_index
        this.$emit('saveEmployee',this.updateValue)
      }
     
    },
    disApproved() {
      this.$emit('disApprovedAction')
      this.disapprovedModal = false,
      this.approvedItem.status = 1
      this.status = 1
      if (this.status == 1) {
        this.statusAction = true
        this.hideDone = true
      }
      this.approvedItem.checkStatus = true
      if (this.isDisapproved) this.requestDisapproved = true
    },
  },
}
</script>
  
  <style scoped>
.status-label-custom {
  width: 130px !important;
}
.deadline-chip {
  width: 150px !important;
}
:deep(.category-btns) {
  display: flex;
  margin-top: -10px !important;
}
</style>

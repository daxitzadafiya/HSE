<template>
    <div>
      <div class="review-popup">
          <div @click="taskEditItem " class="review-popup-table normal-table">
  
        <!-- Type -->
        <!-- <div v-if="!checkWorker" class="info-block progress-field w-50">
          <div class="label-item">
            {{ $t('form.progress') }}
          </div>
          <div class="info-item">
            <v-progress-linear height="25" :color="'rgb(231,134,134)'" :value="0">
              <strong class="font-weight-bold" style="color: #141b04">
                0 %
              </strong>
            </v-progress-linear>
          </div>
        </div> -->


        <!-- <div v-if="checkWorker" class="info-block w-50 align-center">
                <div class="label-item">
                  Status :
                </div>
                <v-chip
                v-if="status === -1"
                  class="info-item status-label-custom pending"
                  label
                >
                  {{ $t('form.new') }}
                </v-chip>
                <v-chip
                  v-else-if="status === 0"
                  class="info-item status-label-custom not-done"
                  label
                >
                  {{ $t('form.not_done') }}
                </v-chip>
                <v-chip v-else-if="status === 1 || !checkItem" class="info-item status-label-custom ongoing" label >
                    {{$t('form.ongoing')}}
                    <div role="button" v-if="statusAction" class="ms-2" >
                                <img src="../assets/images/icon/alert.png" alt="" srcset="">
                              </div>
              </v-chip>
                <v-chip
                  v-else-if="status === 2 || checkItem"
                  class="info-item status-label-custom approved"
                  label
                >
                  {{ $t('form.completed') }}
                  <div role="button" v-if="checkItem" class="ms-2" >
                                <img src="../assets/images/icon/alert-white.png" alt="" srcset="">
                              </div>
                </v-chip>
                <v-chip
                  v-else-if="status === 3"
                  class="info-item status-label-custom ongoing"
                  label
                >
                  {{ $t('form.request') }}
                </v-chip>

                <v-chip
                  v-else
                  class="info-item status-label-custom approved"
                  label
                >
                  {{$t('form.approved')}}
                </v-chip>
                <div class="d-flex align-center" v-if="checkItem">
                  <img  class="icon-img ms-3" src="../assets/images/gridIcon/fillNote.png" alt="fillNote.png" @click.stop/>
                  <img src="../assets/images/icon/image-green.png" class="ms-2 mb-n1" />
                </div>
              </div> -->
  
              <!-- name -->
              <div class="info-block w-50 align-center">
                <div class="label-item">{{ $t('form.name') }}:</div>
                <div>
                  {{ editedItem.name || 'Turn on system light its reminder' }}
                </div>
              </div>
        <!-- function -->
        <div class="info-block w-50">
          <div class="label-item">{{ $t('form.function') }} :</div>
          <div class="info-item">
            {{ editedItem.function||  'Document > Routine > Reminder'  }}
          </div>
        </div>

         <!-- Added by -->
         <div class="info-block w-50">
          <div class="label-item">{{ $t('form.added_by') }} :</div>
          <div class="info-item">
            {{ editedItem.added_by_name || 'Creator'}}
          </div>
        </div>
  
  
        <!-- Category
        <div class="info-item w-50">
          <div class="info-block">
            <div class="label-item">{{ $t('form.category') }} :</div>
            <div class="info-item">
              {{ editedItem.category_name || 'category 1'}}
            </div>
          </div>
        </div> -->

         <!-- Responsible -->
         <div class="info-block w-50 chip responsible align-center">
          <div class="label-item">{{ $t('form.responsible') }} :</div>
          <div class="info-item">
            <!-- v-for="(item, index) in responsibleName"
                      :key="index" -->
            <v-chip class="mr-2 chip-custom" small> IT-Manager </v-chip>
          </div>
        </div>
  
        <!-- Description -->
        <div class="info-block description">
          <div class="label-item">{{ $t('form.description') }}:</div>
          <div class="info-item">
            {{ editedItem.description || 'How to fix risk' }}
          </div>
        </div>
  
        <!-- frequncy -->
        <div
                class="info-block w-50 align-center"
              >
                <div class="label-item">
                  {{ $t('form.frequency') }} :
                </div>
                <div class="info-item">{{ editedItem.recurring || 'Weekly'}}</div>
              </div>
       
              <!-- duration -->
              <div
                class="info-block align-items-center w-50">
                <div class="label-item">
                  {{ $t('form.duration') }} :
                </div>
            <div class="info-item">2 Days</div>

              </div>

              <!-- Start date -->
              <div
                class="info-block col-6"
              >
                <div class="label-item">
                  {{ $t('form.activation') }} :
                </div>
                <div class="info-item">{{ moment(editedItem.start_time).format('DD.MM.YYYY') }}</div>
                <div class="info-item ml-3">{{ '11:00 AM' }}</div>
                <!-- <div class="info-item" @click.stop v-else >Not Applicable</div> -->
              </div>

               <!-- Due date -->
               <div
                class="info-block w-50"
              >
                <div class="label-item col-3 p-0">
                  {{ $t('form.deactivation') }} :
                </div>
                <div class="info-item">{{!editedItem.deadline ? 'indefinite' : moment(editedItem.deadline).format('DD.MM.YYYY')}}</div>
                <div class="info-item ml-3">{{ '11:00 AM' }}</div>
                <!-- <div class="info-item" v-else @click.stop>Not Applicable</div> -->
              </div>
  
    
      </div>
      
      <AddTable
              v-if="!checkWorker"
              :titleMessage="titleMessage"
              :addTopic="addTopic"
              :topicArray="topicArray"
              :headers="headers"
              :addCommentAttach="addCommentAttach"
              :isReminder="isReminder"
              @is_reminder_history="is_reminder_history=!is_reminder_history"
              />
              <!-- @onTaskInfo="" --> </div>
              <AttendeesHistoryTable
        v-if="is_reminder_history"
        :title="$t('title.attendees_history')"
        :attendeeHistoryHeaders="AttendeeHistoryHeaders"
        :attendeeItemsDetail="attendeeItemsDetail"
        @viewAttendeeDetail="isAttendeeDetail=true"
      />
      <prev-new-employee-popup 
    :open-popup="isAttendeeDetail"
    :document-item="editedItem"
    @closePopup="isAttendeeDetail = !isAttendeeDetail"
    />
    <reminder-edit v-if="!checkWorker && !checkManager"
        :open-popup="editTask"
        :document-item="editedItem"
        @closePopup="editTask = !editTask"
        :recurringArray="recurringArray"
      />
  
    </div>
</template>
  
<script>
  import cookies from 'js-cookie'
  import AddTable from './AddTable.vue'
  import AttendeesHistoryTable from './AttendeesHistoryTable.vue'
  import PrevNewEmployeePopup from './PrevNewEmployeePopup.vue'
import ReminderEdit from './ReminderEdit.vue'
  export default {
    components: {  AddTable,PrevNewEmployeePopup,AttendeesHistoryTable, ReminderEdit },
    name: 'RoutineReminderInfo',
    props:{
      editedItem:{
            type:Object,
            require:false,
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
    disApprovedAction:{
            type:Object,
            require:false,
        },
        checkItem:{
          type: Boolean,
      required: false,
        }
    },
    data() {
      return {
        checkWorker:false,
        checkManager:false,
        is_reminder_history:false,
    hoverItem:false,
        checkAdmin: cookies.get('checkAdmin'),
          roleUser:cookies.get('roleUser'),
        editTask:false,
        approvedItem:[],
        attendeeItemsDetail:[],
        recurringArray: [
        {
          id: "Daily",
          name: "Daily"
        },
        {
          id: "Weekly",
          name: "Weekly"
        },
        {
          id: "Bi-Weekly",
          name: "Bi-Weekly"
        },
        {
          id: "Monthly",
          name: "Monthly"
        },
        {
          id: "Quarter",
          name: "Quarter"
        },
        {
          id: "Half-Yearly",
          name: "Half-Yearly"
        },
        {
          id: "Yearly",
          name: "Yearly"
        }
      ],
    isDisapproved:false,
    requestDisapproved:false,
    status:'',
    statusAction:false,
    isAttendeeDetail:false,
    disApprovedTitle:'',
      }
    },
  
    created() {
          if(this.roleUser=='manager')
          this.checkManager=true
  
          if (this.roleUser=='user')
          this.checkWorker=true

          this.attendeeItemsDetail.push({imageStatus:'', employeeStatus:'Employee 1 Change to Employee 5 By Responsible', plusicon:''},
        {imageStatus:'', employeeStatus:'Employee 8 Removed by Responsible', plusicon:''},
        {imageStatus:'', employeeStatus:'Employee 2 Change to Employee 4 By Creator', plusicon:''},
        {imageStatus:'', employeeStatus:'Employee 18 Removed by Creator', plusicon:''})
        },
    computed: {
      AttendeeHistoryHeaders(){
        return [
          {  value: 'imageStatus', align: 'left' ,sortable: false},
          {  value: 'employeeStatus', align: 'left'},
          {  value: 'plusicon', align: 'right'}
          ];
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
          { text: this.translateCol('actions'), value: 'actions', align: 'center' ,sortable: false},
        ]
      },
    },
    methods: {
      translateCol(colName) {
        return this.$i18n.t('column.' + colName)
      },
      taskEditItem(){
        this.editTask= true
      },
    },
  }
</script>
  
<style scoped>
  .plus-icon {
    width: 25px;
    height: 25px;
    background-color: #85a33d;
    margin-left: 10px;
    border-radius: 100%;
    font-size: 25px;
    line-height: 25px;
    color: #fff;
  }
  .plus-icon-gray {
    width: 25px;
    height: 25px;
    background-color: #9f9f9f;
    margin-left: 10px;
    border-radius: 100%;
    font-size: 25px;
    line-height:25px;
    color: #fff;
  }
  .status-label-custom{
    width: 130px !important;
  }
  .deadline-chip{
  width: 150px !important;

}
:deep(.category-btns){
  display: flex;
  margin-top: -10px !important;
}
  </style>
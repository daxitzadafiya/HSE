<template>
    <div>
      <v-dialog
        v-model="openPopup"
        scrollable
        max-width="1125px"
        persistent
      >
        <v-card>
          <v-card-title class="text-h5 justify-content-center text-uppercase pt-7">
            {{ $t('title.report_task') }}
          </v-card-title>
          <v-card-text>
            <div class="review-popup mt-7">
  
              <div class="review-popup-table normal-table">
              <div class="info-block progress-field w-50">
              <div class="label-item">
                {{ $t('form.progress') }} :
              </div>
              <div class="info-item w-75">
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
             <div class="info-block w-50">
                <div class="label-item">
                  {{ $t('form.function') }} :
                </div>
                <div class="info-item w-75">
                   {{ 'Checklist > Task' }}
                </div>
              </div>

                <!-- Name -->
                <div class="info-block w-50 align-center ">
                  <div class="label-item">
                    {{ $t('form.name') }} :
                  </div>
                  <div v-if="!isEdit" class="info-item" @click="(checkAdmin || checkCreator) ? (isEdit = !isEdit) : (isEdit = false)">
                    {{ editedItem.name }}
                  </div>
                  <div v-else class="input-wrap w-75 mb-n5">
                    <v-text-field
                      v-model="editedItem.name"
                      :rules="required"
                      outlined
                    />
                  </div>
                </div>
  
                <!-- Category -->
                <div class="info-block w-50 align-center">
                  <div class="label-item col-3 p-0 mr-n8">
                    {{ $t('form.category') }} :
                  </div>
                  <div v-if="!isEdit" class="info-item" @click="(checkAdmin || checkCreator) ? (isEdit = !isEdit) : (isEdit = false)">
                    {{ editedItem.categoryName }}
                  </div>
                  <div v-else class="mb-n5">
                    <Category
                      :object-item="editedItem"
                      :type-category="'task'"
                      @getNewCategory="getNewCategory"
                    />
                  </div>
                </div>
  
                <!-- Description -->
                <div :class="isEdit ? 'info-block' : 'info-block description'">
                  <div class="label-item">
                    {{ $t('form.description') }} :
                  </div>
                  <div v-if="isEdit" class="input-wrap form-description w-75">
                    <FroalaSuggestionListEditor
                      :item="editedItem"
                      :predefined-link-array="predefinedLinkArray"
                    />
                  </div>
                </div>
  
                <!-- Added by -->
                <div v-if="!checkSuperAdmin" class="info-block w-50">
                  <div class="label-item">
                    {{ $t('form.added_by') }} :
                  </div>
                  <div class="info-item">
                    {{ editedItem.addedByName }}
                  </div>
                </div>

                 <!-- Responsible -->
                 <div class="w-50 info-block px-3 pb-4 responsible">
                    <div
                    v-if="!isEdit && !checkSuperAdmin"
                    class="info-block p-0 px-2 chip responsible align-center border-0"
                    @click="
                        checkAdmin || checkCreator
                        ? (isEdit = !isEdit)
                        : (isEdit = false)
                    "
                    >
                    <div class="label-item">
                        {{ $t('form.responsible') }} :
                    </div>
                    <div class="info-item d-flex justify-content-between responsible-folddown" >
                        <!-- v-for="(item, index) in responsibleName"
                        :key="index" -->
                        <div>

                        <v-chip
                        class="mr-2 chip-custom"
                        small
                        >
                        IT-Manager
                        </v-chip>
                        
                        <img  class="icon-img" src="../assets/images/gridIcon/fillNote.png" alt="fillNote.png" @click.stop/>
                    </div>

                    </div>
                    </div>
                    <div v-else cols="6">
                    <div class="d-flex align-center mb-3">
                    <div class="label-item ">
                        {{ $t('form.responsible') }} :
                    </div>
                    <div class="info-item" >
                        <!-- v-for="(item, index) in responsibleName"
                        :key="index" -->
                        <v-chip
                        class="info-item mr-2 chip-custom "
                        small
                        >
                        IT-Manager
                        </v-chip>
                    </div>
                    </div>
                    <ResponsibleEdit
                    :object-item="editedItem"
                    />
                    </div>
                    </div>

                    <div class="info-block w-100">

                        <div >
                        <div class="label-item mb-3">
                            Manager Feedback : 25.11.2022 10:30 AM
                        </div>
                        <div class="info-item">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. utate libero et velit interdum, ac aliquet odio mattis.
                        </div>
                        </div>
                        </div>

                    <div
                v-if="!isEdit"
                class="info-block align-center w-100"
                @click="
                  checkAdmin || checkCreator
                    ? (isEdit = !isEdit)
                    : (isEdit = false)
                "
              >
                <div class="label-item">
                  {{ $t('form.frequency') }} :
                </div>
                <div class="info-item">{{ editedItem.recurring}}</div>
              </div>
              <div v-else  class="info-block w-100 align-center">
                <div  class="label-item mt-n5">{{ $t('form.frequency') }} :</div>
                      <v-select
                          v-model="editedItem.recurring"
                          :items="recurringArray"
                          item-text="name"
                          item-value="id"
                          :rules="required"
                          outlined
                      />
              </div>
  
                <!-- Start date -->
                <div v-if="!checkSuperAdmin" class="info-block w-50 align-center">
                  <div class="label-item">
                    {{ $t('form.start') }} :
                  </div>
                  <!-- View -->
                  <div
                    v-if="isObject && !isEdit"
                    class="info-item"
                    @click="(checkAdmin || checkCreator) ? (isEdit = !isEdit) : (isEdit = false)"
                  >
                    {{ moment(editedItem.start_date).format('DD.MM.YYYY') }} &nbsp; {{ '11:20 AM' }}
                  </div>
                  <!-- Edit -->
                  <div v-if="isObject && isEdit" class="mb-n4">
                    <StartDateEdit
                      :object-item="editedItem"
                      @changeDate="changeStartDate"
                    />
                  </div>
                  <!-- N/A -->
                  <div v-if="!isObject" class="info-item">
                    N/A
                  </div>
                </div>
  
                <!-- Deadline -->
                <div v-if="!checkSuperAdmin" class="info-block w-50 align-center">
                  <div class="label-item">
                    {{ $t('form.deadline') }} :
                  </div>
                  <!-- View -->
                  <div
                    v-if="isObject && !isEdit"
                    class="info-item"
                    @click="(checkAdmin || checkCreator) ? (isEdit = !isEdit) : (isEdit = false)"
                  >
                    {{ moment(editedItem.deadline).format('DD.MM.YYYY') }} &nbsp; {{ '12:30 PM' }}
                  </div>
                  <!-- Edit -->
                  <div v-if="isObject && isEdit" class="mb-n4">
                    <DeadlineEdit
                      :object-item="editedItem"
                      :item="editedItem"
                      :change-custom="changeDeadlineCustom"
                    />
                  </div>
                  <!-- N/A -->
                  <div v-if="!isObject" class="info-item">
                    N/A
                  </div>
                </div>
              </div>

              <AddTable
            :titleMessage="$t('title.topic_title')"
            :addTopic="false"
              :topicArray="topicArray"
              :headers="headers"
              :addCommentAttach=false
              class="topic-table"
              />

              <AddTable v-if="!checkAttendee"
              :titleMessage="$t('title.attendees')"
              :addTopic="true"
              :topicArray="EmployeesArray"
              :headers="ReminderAttendeeHeaders"
              :addCommentAttach="false"
              :isReminder="true"
              @onTaskInfo="employeeItem"
              />
              
              <review-attendee-popup
              :open-popup="checkShowItem"
              :document-item="editedItem"
              @closePopup="checkShowItem = !checkShowItem"
              @saveEmployee="saveEmployee"
              :isEmployeeStatus="isEmployeeStatus"
              :isEmployeeRemove="isEmployeeRemove"
              />
            </div>

          </v-card-text>
          <v-card-actions class="py-7 px-7" >
            <v-spacer />
            <v-btn class="btn-cancel" text @click="close">
              {{ $t('button.cancel') }}
            </v-btn>
            <!-- Creator create/ update object -->
            <v-btn
              class="btn-save"
              @click="save"
            >
              {{ $t('button.save') }}
            </v-btn>
  
            <!-- Attendee process object -->
            <v-btn
              v-if="isObject && checkAttendee && compareDate(editedItem.start_date) && (attendeeProcessStatus === 'new' || attendeeProcessStatus === 'reopened')"
              class="btn-save"
              @click="attendeeAddRequiredComment(attendeeProcessItem)"
            >
              {{ $t('button.done') }}
            </v-btn>
  
            <!-- Delete object -->
            <!-- <v-btn
              v-if="checkAdmin || checkCreator"
              class="hse-btn-delete"
              text
              @click="viewDeleteConfirmPopup(editedItem, true)"
            >
              <v-icon dark>
                mdi-delete
              </v-icon>
            </v-btn> -->
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
</template>
  
<script>
    import {_} from 'vue-underscore';
    import cookies from "js-cookie";
    import FroalaSuggestionListEditor from "./FroalaSuggestionListEditor";
    import StartDateEdit from "./StartDateEdit";
    import DeadlineEdit from "./DeadlineEdit";
    import ResponsibleEditInReviewPopup from "./ResponsibleEditInReviewPopup";
    import CategoryInReviewPopup from "./CategoryInReviewPopup";
    import AddTable from './AddTable.vue';
    import ReviewAttendeePopup from './ReviewAttendeePopup.vue';
  
    export default {
      name: "ViewReportTask",
      components: {
        FroalaSuggestionListEditor,
        StartDateEdit,
        DeadlineEdit,
        ResponsibleEdit: ResponsibleEditInReviewPopup,
        Category: CategoryInReviewPopup,
            AddTable,
            ReviewAttendeePopup,
      },
      props: {
        openPopup: {
          type: Boolean,
          required: false,
        },
        objectItem: {
          type: Object,
          required: true,
        },
        categoriesArray: {
          type: Array,
          required: true,
        },
        predefinedLinkArray: {
          type: Array,
          required: false,
        },
      },
      data: () => ({
        userRoleId: parseInt(cookies.get('roleID')),
    userDepartmentID: parseInt(cookies.get('userDepartmentID')),
    checkAdmin: cookies.get('checkAdmin'),
    checkSuperAdmin: cookies.get('checkSuperAdmin'),
    roleUser: cookies.get('roleUser'),
    userLogged: parseInt(cookies.get('userID')),
    userID: parseInt(cookies.get('userID')),
    permissionsUser: localStorage.getItem('permissionsKey'),
        today: new Date().toISOString().substr(0, 10),
        valid: true,
        required: [
          v => {
            if (!v || v.length < 1)
              return 'This is required';
            else return true;
          }
        ],
        isEdit: false,
        isEditSubObject: false,
        openRequiredCommentPopup: false,
        hoverQuestionMark: false,
        changeDeadlineCustom: false,
        checkCreator: false,
        checkResponsible: false,
        checkAttendee: false,
        editedItem: {
      hover:false,
      industry_id: '',
      industry_id_arr: [],
      name: '',
      added_by_name: '',
      description: '',
      parent_id: '',
      type_of_attachment: 2,
      type: 'Attachment',
      category_id: '',
      category_name: '',
      deadline: '',
      deadline_pre: '',
      show_manager: false,
      count_related_object: 0,
      related_objects: [],
      parent_object: '',
      editPermission: true,
      is_suggestion: false,
      // table Security
      object_type: 'document',
      is_shared: false,
      is_public: false,
      department_array: [],
      employee_array: [],
      is_reminder: false,
      is_name: false,
      reminder_name: '',
      is_description: false,
      reminder_description: '',
      is_routine: false,
      responsible_department_array: [],
      responsible_employee_array: [],
      attendee_department_array: [],
      attendee_employee_array: [],
      start_date_pre: '',
      start_date: '',
      attendee_all: false,
      is_commentSwitch: false,
      is_AttachSwitch: false,
      attachFile: [],
      remider_note: '',
      is_duration:false,
      duration:1,

      // hover: false,
      // hoverQuestionMark: false
    },
    defaultItem: {
      hover:false,
      industry_id: '',
      industry_id_arr: [],
      name: '',
      added_by_name: '',
      description: '',
      parent_id: '',
      type_of_attachment: 2,
      type: 'Attachment',
      category_id: '',
      category_name: '',
      // is_renewed: false,
      // renewed_employee_array: "",
      // renewed_employee_array_arr: [],
      deadline: '',
      deadline_pre: '',
      show_manager: false,
      // security_department_array: "",
      // security_project_array: "",
      // security_employee_array: "",
      // security_department_array_arr: [],
      // security_project_array_arr: [],
      // security_employee_array_arr: [],
      count_related_object: 0,
      related_objects: [],
      parent_object: '',
      editPermission: true,
      is_suggestion: false,
      // table Security
      object_type: 'document',
      is_shared: false,
      is_public: false,
      department_array: [],
      employee_array: [],
      is_reminder: false,
      is_name: false,
      reminder_name: '',
      is_description: false,
      reminder_description: '',
      is_routine: false,
      responsible_department_array: [],
      responsible_employee_array: [],
      attendee_department_array: [],
      attendee_employee_array: [],
      start_date_pre: '',
      start_date: '',
      attendee_all: false,
      is_commentSwitch: false,
      is_AttachSwitch: false,
      attachFile: [],
      remider_note: '',
      is_duration:false,
      duration:1,

      // hover: false,
      // hoverQuestionMark: false
    },
        editedSubObjectItem: {},
        editedRequiredCommentItem: {},
        dialogDelete: false,
        editedIndex: 0,
        isDeleteObject: false,
        responsibleName: [],
        isObject: false,
        attendeeProcessItem: {},
        attendeeProcessId: '',
        attendeeProcessStatus: '',
        checkShowItem:false,
    selectedEmployeeItem:{},
    isEmployeeRemove:false,
    isEmployeeStatus:false,
        topicArray: [
        {
          name: 'How many holes in the floor',
          result: '2',
          comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        },
        {
          name: 'Are holes are dangerous ?',
          result: 'By glue',
          comment: 'Not- Available',
        },
      ],
        EmployeesArray:[{name: 'Employee 1' ,comment:'Lorem ipsum dolor sit amet consectetur adipisicing elit.',image:'Not-Availbale',status:-1,actions:'',checkStatus:false },
        {name: 'Employee 2',comment:'Lorem ipsum dolor sit amet consectetur adipisicing elit.',image:'Not-Availbale',status:2,actions:'',checkStatus:false  },
        {name: 'Employee 3' ,comment:'Lorem ipsum dolor sit amet consectetur adipisicing elit.',image:'Not-Availbale',status:1,actions:'',checkStatus:false },
        {name: 'Employee 4' ,comment:'Lorem ipsum dolor sit amet consectetur adipisicing elit.',image:'Not-Availbale',status:0,actions:'',checkStatus:false },
      ]
      }),
  
      computed: {
        headers() {
      return [
        {
          text: 'Name',
          align: 'start',
          sortable: false,
          value: 'name',
        width:'25%'
        },
        { text: 'Result', value: 'result', align: 'center',width:'25%' },
        { text: 'Comment', value: 'comment', align: 'center' , width:'30%'},
        { text: 'Image', value: 'image', align: 'center' },
      ]
    },
    ReminderAttendeeHeaders(){
      return [
      { text: this.translateCol('employee_name'), value: 'name', align: 'left' ,sortable: false},
        { text: this.translateCol('feedback'), value: 'comment', align: 'center'},
        { text: this.translateCol('image'), value: 'image', align: 'center' , sortable: false},
        { text: this.translateCol('status'), value: 'status', align: 'center' },
        { text: this.translateCol('actions'), value: 'actions', align: 'center' ,sortable: false},

    ]
    },
      },
  
      watch: {
        openPopup(value) {
          if (value) {
            this.viewItem(this.objectItem);
          }
        },
      },
  
      mounted() {},
  
      created() {
        if (this.openPopup) {
          if (this.objectItem) {
            this.viewItem(this.objectItem);
          }
        }
      },
  
      methods: {
        viewItem(item) {
          let that = this;
          // that.formDirty = false;
          that.$nuxt.$loading.start();
          that.$store.dispatch('objects/show', item.id).then(result => {
            that.editedItem = Object.assign({}, result.data);
            that.isObject = _.isEmpty(result.data.subObject);
            that.checkCreator = _.contains(result.data.role, 'creator');
            that.checkResponsible = _.contains(result.data.role, 'responsible');
            if (!that.checkCreator || !that.checkResponsible) {
              if (that.isObject) {
                that.checkAttendee = _.contains(result.data.role, 'attendee');
                if (that.checkAttendee) {
                  let processAttendee = _.filter(result.data.processingInfo, function (o) {
                    return o.user_id === that.userLogged;
                  });
                  if (processAttendee) {
                    that.attendeeProcessItem = processAttendee[0];
                    that.attendeeProcessId = processAttendee[0].process_id;
                    that.attendeeProcessStatus = processAttendee[0].status;
                  }
                }
              } else {
                that.checkAttendee = _.contains(result.data.roleSubObject, 'attendee');
              }
            }
            that.responsibleName = result.data.responsible['employeeName'];
            that.editedItem.responsible_employee_array = JSON.parse(that.editedItem.responsible['employee_array']);
            // that.editedItem.historyArray = _.sortBy(result.data.history, function(o) { return o.updated_at; });
            that.$nuxt.$loading.finish();
          }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_goal_view_detail'));
          }
            that.$nuxt.$loading.finish();
          });
        },
  
        // viewSubObject(item) {
        //   this.isEditSubObject = true;
        //   this.editedSubObjectItem = item;
        // },
  
        viewDeleteConfirmPopup(item, isObject) {
          this.editedIndex = item.id;
          this.isDeleteObject = isObject;
          this.dialogDelete = true;
        },
  
        // responsibleAddRequiredComment(item, status) {
        //   if (status === 'reopened' || this.editedItem.responsible['required_comment'] || this.editedItem.responsible['required_attachment']) {
        //     this.openRequiredCommentPopup = true;
        //     this.editedRequiredCommentItem = item;
        //     if (this.checkAdmin || this.checkCreator) {
        //       this.editedRequiredCommentItem.isCreator = true;
        //     } else if (this.checkResponsible) {
        //       this.editedRequiredCommentItem.isResponsible = true;
        //     }
        //     this.editedRequiredCommentItem.requiredComment = (status === 'reopened') ? 1 : this.editedItem.responsible['required_comment'];
        //     this.editedRequiredCommentItem.requiredAttachment = (status === 'reopened') ? 0 : this.editedItem.responsible['required_attachment'];
        //     this.editedRequiredCommentItem.new_status = status;
        //   } else {
        //     this.updateStatus(item.process_id, status, null);
        //   }
        // },
  
        attendeeAddRequiredComment(item) {
          if (this.editedItem.attendee['required_comment'] || this.editedItem.attendee['required_attachment']) {
            this.openRequiredCommentPopup = true;
            this.editedRequiredCommentItem = item;
            this.editedRequiredCommentItem.isAttendee = true;
            this.editedRequiredCommentItem.requiredComment = this.editedItem.attendee['required_comment'];
            this.editedRequiredCommentItem.requiredAttachment = this.editedItem.attendee['required_attachment'];
          } else {
            this.updateStatus(item.process_id, 'done', null);
          }
        },
  
        compareDate(start) { // check if start date yet
          const [year, month, day] = start.split('-');
          const [yearToday, monthToday, dayToday] = this.today.split('-');
          return yearToday > year || (yearToday <= year && monthToday > month) || (yearToday <= year && monthToday <= month && dayToday > day);
        },
  
        // test() {
        //   alert('test');
        // },
  
        translateCol (colName) {
          return this.$i18n.t('column.' + colName);
        },
  
        getNewCategory(value) {
          this.editedItem.category_id = value.newCategoryId;
        },
  
        changeStartDate(val) {
          this.changeDeadlineCustom = !!val.changed;
        },
  
        close() {
          this.isEdit = false;
          if (this.openPopup) {
            this.$emit('closePopup');
          }
        },
  
        reloadList() {
          this.$emit('reloadList');
        },

        employeeItem(item){
      this.checkShowItem= true
      if (this.roleUser=='manager') {
      this.checkShowItem=false
    }
    this.selectedEmployeeItem=item
    if(this.selectedEmployeeItem.status===4){
          this.isEmployeeStatus=true 
          this.isEmployeeRemove=false  

      }
      else if(this.selectedEmployeeItem.status===5){
        this.isEmployeeStatus=true  
          this.isEmployeeRemove=true  
        
      }
      else{
        this.isEmployeeStatus=false  

      }
    },

    saveEmployee(payload){
      if (payload) {
        this.selectedEmployeeItem.status=5
      }
      else{
        this.selectedEmployeeItem.status=4

      }
    },
  
        save() { // update
          let that = this;
          that.$nuxt.$loading.start();
          that.editedItem.requestEdit = true;
          that.editedItem.isDefaultResponsible = false;
          that.editedItem.isDefaultAttendee = false;
          that.editedItem.attendee_all = false;
          that.editedItem.responsible_required_comment = that.editedItem.responsible['required_comment'];
          that.editedItem.responsible_required_attachment = that.editedItem.responsible['required_attachment'];
          that.editedItem.attendee_required_comment = that.editedItem.attendee['required_comment'];
          that.editedItem.attendee_required_attachment = that.editedItem.attendee['required_attachment'];
          that.editedItem.start_date = that.editedItem.start_date_pre;
          that.editedItem.deadline = that.editedItem.deadline_pre;
          that.$store.dispatch('objects/update', that.editedItem).then(function () {
            that.reloadList();
            // that.reloadListCategory();
            that.$toaster.success(that.$i18n.t('message.success_goal_update'));
          }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_goal_update'));
          }
            that.$nuxt.$loading.finish();
          });
          that.close();
        },
  
        deleteItem(val) {
          let that = this;
          that.$store.dispatch('objects/delete', val.index).then(function() {
            that.reloadList();
            that.$toaster.success(that.$i18n.t('message.success_goal_delete'));
          }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_goal_delete'));
          }
            that.$nuxt.$loading.finish();
          });
          that.dialogDelete = false;
          if (val.isObject) {
            that.close();
          } else {
            that.viewItem(that.editedItem);
          }
        },
  
        updateRequiredComment(val) {
          this.updateStatus(val.processID, val.newStatus, val.comment);
          if (val.attachment && val.attachment.length !== 0) {
            this.saveAttachment(val.attachment, val.processID);
          }
        },
  
        updateStatus(processID, newStatus, comment) {
          let that = this;
          that.$nuxt.$loading.start();
          let item = that.editedItem;
          that.editedItem.newStatus = newStatus;
          that.editedItem.processID = processID;
          if (that.checkAttendee) {
            that.editedItem.comment = comment;
          } else {
            that.editedItem.responsible_comment = comment;
          }
          that.$store.dispatch('objects/updateStatus', that.editedItem).then(function() {
            that.reloadList();
            that.viewItem(item);
            // that.$toaster.success(that.$i18n.t('message.success_goal_delete'));
          }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }
            // that.$toaster.error(that.$i18n.t('message.fail_goal_delete'));
            that.$nuxt.$loading.finish();
          });
        },
  
        saveAttachment(file, processID) {
          let that = this;
          that.$nuxt.$loading.start();
          let formData = new FormData();
          formData.append('file', file);
          formData.append('processing_id', processID);
          if (this.checkAdmin || this.checkCreator) {
            formData.append('added_by_role', 'creator');
          } else if (that.checkResponsible) {
            formData.append('added_by_role', 'responsible');
          } else if (that.checkAttendee) {
            formData.append('added_by_role', 'attendee');
          }
          that.$store.dispatch('attachments/store', formData).then(function () {
          }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_attachment_add_new'));
          }
            that.$nuxt.$loading.finish();
          });
        },
      },
    };
</script>
  
<style scoped>
  .review-popup{
    width: 977px !important;
  }
  :deep(.topic-table .v-data-table-header){
  background-color: #84A13D;
}
:deep(.topic-table .v-data-table-header tr th span){
  color: #fff;
  font-weight: 500;
}
:deep(.responsible .chip-custom){
    background: #B3C48C !important;
    color: #fff !important;
}
:deep(.v-badge__badge) {
  inset: auto auto calc(100% - 4px) calc(-72% - 46px) !important;
}
  </style>
  
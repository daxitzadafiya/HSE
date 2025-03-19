<template>
  <div>
    <v-dialog v-model="openPopup" max-width="1125px" persistent>
      <v-card>
        <v-card-title class="text-h5 justify-content-center text-capitalize pt-7">
          {{ $t('title.view_report_risk') }}
        </v-card-title>
        <v-card-text>
          <div class="review-popup">
            <div class="review-popup-table normal-table mt-6">
              <!-- <div class="info-block w-50 align-center">
                <div class="label-item">{{ $t('form.status') }}:</div>
                <div class="info-item">
                  <v-chip v-if="viewCreateTask" class="status-label-custom pending" label>
                    {{ $t('form.new') }}
                  </v-chip>
                  <v-chip v-else class="status-label-custom completed" label>
                    {{ $t('form.completed') }}
                  </v-chip>
                </div>
              </div> -->

              <div class="info-block w-50 align-center">
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
                <!-- <div class="d-flex align-center" v-if="checkItem">
                  <img  class="icon-img ms-3" src="../assets/images/gridIcon/fillNote.png" alt="fillNote.png" @click.stop/>
                  <img src="../assets/images/icon/image-green.png" class="ms-2 mb-n1" />
                </div> -->
              </div>

              <!-- Source -->
              <div class="info-block w-50">
                <div class="label-item">{{ $t('form.function') }} :</div>
                <div class="info-item">
                  {{viewCreateTask ? 'Checklist > Risk Analysis > Task' : 'Checklist > Risk Analysis' }}
                </div>
              </div>
              <!-- name -->
              <div class="info-block w-50 align-center">
                <div class="label-item">{{ $t('form.name') }}:</div>
                <div class="info-item">
                  <!-- {{ editedItem.name }} -->
                  {{ 'Kitchen area' }}
                </div>
              </div>

              <!-- Category -->

              <div class="info-block w-50">
                <div class="label-item">{{ $t('form.category') }} :</div>
                <div class="info-item">
                  <!-- {{ editedItem.category_name }} -->
                  {{ 'Checklist' }}
                </div>
              </div>

              <!-- Added by -->
              <div cols="6" class="info-block w-50">
                <div class="label-item">{{ $t('form.reported_by') }} :</div>
                <div class="info-item">
                  {{ 'Creator' }}
                </div>
              </div>

              <!-- Responsible -->
              <div
                class="info-block w-50 px-4 chip align-center"
                @click="
                  checkAdmin || checkCreator
                    ? (isEdit = !isEdit)
                    : (isEdit = false)
                "
              >
                <div class="label-item">{{ $t('form.responsible') }} :</div>
                <div
                  class="
                    info-item
                    d-flex
                    justify-content-between
                    responsible-folddown
                  "
                >
                  <!-- v-for="(item, index) in responsibleName"
  :key="index" -->
                  <div>
                    <v-chip class="mr-2 chip-custom chip-custom2" small>
                      IT-Manager
                    </v-chip>
                  </div>
                </div>
              </div>
              <!-- Description -->

              <div :class="isEdit ? 'info-block' : 'info-block description'">
                <div class="label-item">{{ $t('form.description') }}:</div>
                <div class="info-item">
                  {{ editedItem.description }}
                </div>
              </div>
            </div>
          </div>

          <div>
            <AddTable
              :titleMessage="$t('title.topic_title')"
              :addTopic="false"
              :topicArray="topicArray"
              :headers="headers"
              :addCommentAttach="false"
              :class="checkWorker ? 'topic-table' : ''"
              />

            <AddTable
              :titleMessage="$t('title.source_danger')"
              :addTopic="false"
              :topicArray="arrayOfSourceDanger"
              :headers="viewSorceHeader"
              :addCommentAttach="false"
            />

            <b-row v-if="!checkWorker">
                <b-col class="d-flex">
                <div class="bold-title md-line-height">
                  {{ $t('form.process') }}
                </div>
                <div class="input-wrap">
                  <div class="switch-component document-type-wrap default-question-mark">
                    <label class="left-text">{{ $t('form.none') }}</label>
                    <v-switch
                      v-model="checkProcess"
                      :label="$t('form.task')"
                      inset
                      class="right-text ml-7"
                    />
                  </div>
                </div>
                </b-col>
              </b-row>

              <AddTable
              v-if="!viewCreateTask || (!viewCreateTask && checkWorker)"
              :titleMessage="$t('form.task')"
              :addTopic="false"
              :topicArray="EmployeesArray"
              :headers="TaskAttendeeHeaders"
              :addCommentAttach="false"
              @onTaskInfo="onAction"
              class="task-table"
            />

            <responsible-attendee-action v-if="onAttendeeAction && (checkManager || checkWorker) "
            :editedItem="editedItem"
            :titleMessage="$t('title.attendees')"
              :addTopic="true"
              :topicArray="attendeeArray"
              :headers="responsibleAttendeeHeader"
              :addCommentAttach="false"
              @disApprovedAction="disApprovedAction"
              :checkItem="checkItem"
              :isReminder="true"
            />

            <FeedbackPopup v-if="checkWorker"
      :open-popup="isWorkerRoutine"
      :object-item="editedItem"
      :isResubmit="isResubmit"
      :predefinedLinkArray="predefinedLinkArray"
      @closePopup="isWorkerRoutine = !isWorkerRoutine"
      @workerFeedback="workerFeedback"
    />
          </div>
        </v-card-text>

        <v-card-actions class="px-6 pt-7 pb-12">
          <v-spacer />

          <v-btn class="btn-cancel" text @click="close('closePopup')">
            {{ $t('button.cancel') }}
          </v-btn>
          <v-btn class="btn-save" @click="save" v-if="!resubmit && !checkItem">
            {{ $t('button.save') }}
          </v-btn>
          <v-btn class="btn-save" @click="isWorkerRoutine=true,isResubmit=true" v-if="resubmit && !hideResubmit">
            {{ $t('button.resubmit') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { _ } from 'vue-underscore'
import api from '~/apis'
import cookies from 'js-cookie'
import AddTable from './AddTable.vue'
import ResponsibleAttendeeAction from './ResponsibleAttendeeAction.vue'
import FeedbackPopup from './FeedbackPopup.vue'

export default {
  components: { AddTable, ResponsibleAttendeeAction, FeedbackPopup },
  name: 'ReportRiskAnalysis',
  props: {
    resource: {
      type: Boolean,
      required: false,
    },
    documentItem: {
      type: Object,
      required: false,
    },
    openPopup: Boolean,
    categoriesArray: Array,
    addedFrom: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: false,
    },
    predefinedLinkArray: {
      type: Array,
      required: false,
    },
    titleMessage: {
      type: String,
      required: false,
    },
  },
  data: () => ({
    formDirty: false,
    viewCreateTask:false,
    isWorkerRoutine:false,
    isResubmit:false,
    items: ['Dropdown', 'Slider', 'Dropdown2', 'Slider2'],

    hover: false,
    userRoleId: parseInt(cookies.get('roleID')),
    userDepartmentID: parseInt(cookies.get('userDepartmentID')),
    checkAdmin: cookies.get('checkAdmin'),
    checkSuperAdmin: cookies.get('checkSuperAdmin'),
    roleUser: cookies.get('roleUser'),
    userLogged: parseInt(cookies.get('userID')),
    userID: parseInt(cookies.get('userID')),
    permissionsUser: localStorage.getItem('permissionsKey'),
    selectedFile: [],
    valid: true,
    isEdit: false,
    checkCreator: false,
    checkManager: false,
    checkWorker: false,
    checkItem:false,
    revised: false,
    documents: [],
    connected_to_task: [],
    connectToObject: [],
    responsibleName: [],
    connectToObjectTableProp: [],
    object: [],
    category: [],
    approvedItem: [],
    checklistArray: [],
    durationData: {
      is_duration: false,
      duration: 1,
    },
    connectToArray: [],
    expanded: [],
    connectToObjectFrom: { document_id: '', connectToArray: [], object_id: '' },
    status: -1,
    editedItem: {
      hover: false,
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
      is_duration: false,
      duration: 1,

      // hover: false,
      // hoverQuestionMark: false
    },
    defaultItem: {
      hover: false,
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
      is_duration: false,
      duration: 1,
      // hover: false,
      // hoverQuestionMark: false
    },
    required: [
      (v) => {
        if (!v || v.length < 1) return 'This is required'
        else return true
      },
    ],
    previewUrl: null,
    attachmentType: false,
    formTitle: '',
    editMode: true,
    categoriesValidArray: [],
    checkResource: false,
    is_duration: false,
    checkProcess:false,
    onAttendeeAction:false,
    resubmit:false,
    hideResubmit:false,
    duration: 1,
    config: {
      events: {
        //
      },
    },
    employeeStatus:'',
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
    arrayOfSourceDanger: [
      {
        name: 'How many holes in the floor',
        type: 'Report',
        probablity:'High',
        consequence:'Low',
        risk:'2',
        comment: 'Lorem ipsum ',
      },
      {
        name: 'Are holes are dangerous ?',
        type: 'Report',
        probablity:'High',
        consequence:'Moderated',
        risk:'8',
        comment: 'Take care of holes now.',
      }
    ],
    EmployeesArray:[{name: 'Task Name ' ,total_attendee:'4',start:'12.11.2022 11:25 AM',deadline:'30.11.2022 12:30 PM',status:1,checkStatus:false }
        ],
        attendeeArray:[{name: 'Employee 1' ,comment:'Lorem ipsum dolor sit amet consectetur adipisicing elit.',image:'Not-Availbale',status:-1,actions:'',checkStatus:false },
        {name: 'Employee 2',comment:'Lorem ipsum dolor sit amet consectetur adipisicing elit.',image:'Not-Availbale',status:2,actions:'',checkStatus:false  },
        {name: 'Employee 3' ,comment:'Lorem ipsum dolor sit amet consectetur adipisicing elit.',image:'Not-Availbale',status:1,actions:'',checkStatus:false },
        {name: 'Employee 4' ,comment:'Lorem ipsum dolor sit amet consectetur adipisicing elit.',image:'Not-Availbale',status:0,actions:'',checkStatus:false },
        {name: 'Employee 5' ,comment:'Lorem ipsum dolor sit amet consectetur adipisicing elit.',image:'Not-Availbale',status:3,actions:'',checkStatus:false },
        ],
  }),

  computed: {
    headers() {
      return [
        {
          text: 'Name',
          align: 'start',
          sortable: false,
          value: 'name',
          width: '25%',
        },
        { text: 'Result', value: 'result', align: 'center', width: '25%' },
        { text: 'Comment', value: 'comment', align: 'center', width: '30%' },
        { text: 'Image', value: 'image', align: 'center' },
      ]
    },
    viewSorceHeader() {
      return [
        {
          text: 'Name',
          align: 'start',
          sortable: false,
          value: 'name',
          width: '25%',
        },
        { text: 'Type', value: 'type', align: 'center' , width: '10%'},
        {
          text: 'Probability',
          value: 'probablity',
          align: 'center',
          width: '15%',
        },
        {
          text: 'Consequence',
          value: 'consequence',
          align: 'center',
          width: '15%',
        },
        { text: 'Risk level', value: 'colorCode', align: 'center',width: '10%', },
        { text: 'Comment', value: 'comment', align: 'center' ,width: '20%',},
      ]
    },
    TaskAttendeeHeaders(){
      return [
        { text: this.translateCol('name'), value: 'name', align: 'left' ,sortable: false},
        { text: this.translateCol('total_attendee'), value: 'total_attendee', align: 'center'},
        { text: this.translateCol('start'), value: 'start', align: 'center'},
        { text: this.translateCol('deadline'), value: 'deadline', align: 'center'},
        { text: this.translateCol('status'), value: 'status', align: 'center' }

        ]
    },
    responsibleAttendeeHeader() {
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

  watch: {
    openPopup(value) {
      if (value) {
        if (this.documentItem) {
          let categoryId = this.documentItem.category_id
          this.categoriesValidArray = _.filter(
            this.categoriesArray,
            function (item) {
              return (
                !item.disable_status ||
                (item.disable_status && item.id === categoryId)
              )
            }
          )
          this.editItem(this.documentItem)
        } else {
          this.categoriesValidArray = _.filter(
            this.categoriesArray,
            function (item) {
              return !item.disable_status
            }
          )
          this.addNew()
        }
      }
    },

    resource(value) {
      if (value) {
        this.checkResource = value
      }
    },

    topicArray(value) {
      if (value == '')
        this.topicArray.push({
          name: '',
          questions: [{ name: '', default_option_id: '', option_answers: '' }],
        })
    },
  },

  mounted() {
    if (this.roleUser == 'manager') {
      this.checkManager = true
    } else if (this.roleUser == 'user') {
      this.checkWorker = true
    }
  },

  created() {
    if (this.openPopup) {
      if (this.documentItem) {
        this.editItem(this.documentItem)
      } else {
        this.addNew()
      }
    }

    if (this.resource) {
      this.checkResource = this.resource
    }
  },

  methods: {
    changeTab(value) {
      this.$emit('changeTab', value)
    },
    translateCol(colName) {
      return this.$i18n.t('column.' + colName)
    },
    getNewCategory(value) {
      this.editedItem.category_id = value.newCategoryId
    },
    addNew() {
      this.reset()
      let defaultCategory = _.findWhere(this.categoriesValidArray, {
        is_primary: 1,
      })
      if (defaultCategory) {
        this.editedItem.category_id = defaultCategory.id
      }
      if (this.checkResource) {
        this.formTitle = this.$i18n.t('title.new_document_resource')
      } else {
        this.formTitle = this.$i18n.t('title.new_document')
      }
      this.editMode = false
      this.selectedFile = []
      this.attachmentType = false
    },
    async getObject(item) {
      this.connectToObject = []
      await api.documents
        .connectRoutine(item.id)
        .then((result) => {
          let respo = result.data.data
          if (respo.length > 0) {
            respo.forEach((el) => {
              this.connectToObject.push({
                id: el.id,
                name: el.objectName,
                source: el.connect_to_source,
                category: el.categoryName,
                added: el.addedByUser,
                connectedBy: el.connectedByUser,
                connected_date: el.created_at,
              })
            })
          } else {
            this.connectToObject = []
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },

    editItem(item) {
      let that = this
      that.editedItem = Object.assign({}, item)
      that.editedItem.duration = 1
      that.editedItem.is_duration = false

      that.connected_to_task = []
      that.formTitle = that.$i18n.t('title.edit_document')
      that.formDirty = false
      that.getObject(item)
      that.$store
        .dispatch('routines/show', item.id)
        .then(() => {})
        ..catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          console.log(error)
          }
        })
    },

    close() {
      this.isEdit = false
      if (this.openPopup) {
        this.$emit('closePopup')
      }
    },

    reset() {
      this.$nuxt.$loading.finish()
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
      }, 300)
    },
    save() {
      // update
      let that = this
      that.$nuxt.$loading.start()
      that.editedItem.is_shared = false
      that.editedItem.is_public = true
      that.editedItem.is_activated = true
      that.editedItem.is_attending_activated = false
      that.editedItem.status = 'New'
      that.editedItem.responsible_id = null
      that.editedItem.attending_emps = []
      that.editedItem.attending_contact = []
      that.editedItem.attendings_count = 0
      that.editedItem.responsible_id = ''
      that.editedItem.parent_id = ''
      that.editedItem.is_template = false
      that.editedItem.object_id = ''
      that.$store
        .dispatch('routines/update', that.editedItem)
        .then(function () {
          that.reloadList()
          that.reloadListCategory()
          that.$toaster.success(that.$i18n.t('message.success_routine_update'))
        })
        .catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_routine_update'))
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish()
        })

      that.close()
      this.isWorkerRoutine=true
    },
    draft() {
      this.editedItem.status = 0
      this.save()
    },

    // dialog DELETE
    closeDelete() {
      this.dialogDelete = false
    },
    deleteDocument(val) {
      let that = this
      that.$store
        .dispatch('documents/delete', val.index)
        .then(function () {
          that.reloadList()
          that.$toaster.success(that.$i18n.t('message.success_document_delete'))
        })
        .catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_document_delete'))
          }
        })
      that.dialogDelete = false
    },

    previewImage(file) {
      if (file) {
        this.previewUrl = URL.createObjectURL(file)
        this.selectedFile = file
      } else {
        this.previewUrl = null
        this.selectedFile = null
      }
    },

    getImage(file) {
      this.previewImage(file.imageFile)
    },
    onAction(item){
      this.onAttendeeAction=!this.onAttendeeAction
      this.attendeeStatus=item

    },
    disApprovedAction(){
      this.resubmit=true
      console.log(this.attendeeStatus);
      this.attendeeStatus.checkStatus=true
    },
    workerFeedback(payload){
      this.onAttendeeAction=false
      console.log(payload)
      this.status=payload.newStatus
      this.attendeeStatus.status=2
      if (this.attendeeStatus.status===2) {
        this.checkItem=true
      }
      if(payload.isResubmit){
        this.hideResubmit=true
      }else{
        this.hideDone=true
      }
    },

  },
}
</script>

<style scoped>
.checklist-popup {
  width: 100%;
  margin: 0 auto;
  font-size: 16px;
}

.checklist-popup .normal-table {
  display: flex;
  flex-wrap: wrap;
  border-top: 1px solid #e0e0e0;
  border-right: 1px solid #e0e0e0;
}

.checklist-popup .normal-table .info-block {
  display: flex;
  padding: 17px;
  border: 1px solid #e0e0e0;
  border-right: 0;
  border-top: 0;
  width: 100%;
}

.checklist-popup .normal-table .label-item {
  color: #666768;
  font-weight: 500;
  margin-right: 15px;
}

.checklist-popup .review-table {
  border: 1px solid #e0e0e0;
}

.checklist-popup .review-popup-table {
  margin-bottom: 40px;
}
.topic-plus {
  width: 22px;
  height: 22px;
  border: 1px solid #84a13d;
  border-radius: 50%;
  color: #84a13d;
  text-align: center;
  display: block;
  line-height: 1.1;
  justify-content: center;
  align-items: center;
}
.topic-minus {
  width: 22px;
  height: 22px;
  border: 1px solid #84a13d;
  border-radius: 50%;
  color: #84a13d;
  text-align: center;
  display: block;
  line-height: 1.2;
  justify-content: center;
  align-items: center;
}
.img-attachment .required-upload-attachment .upload-field {
  min-height: 0;
  height: 60px;
}
:deep(.img-attachment
    .required-upload-attachment
    .upload-field
    .icon-upload-attachment
    .mdi-paperclip) {
  min-height: 25px !important;
  min-width: 25px !important;
}
:deep(.img-attachment .required-upload-attachment .v-messages__message) {
  padding-top: 10px !important;
}
.chip-custom2 {
  /* color: #63b76a !important; */
  background: #eaf5eb !important;
}
.topic-items {
  background-color: #fff;
  box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%),
    0 1px 5px 0 rgb(0 0 0 / 12%);
  border-radius: 5px;
  padding: 16px 24px;
}
.description {
  height: 120px;
}
:deep(.topic-table .v-data-table-header){
  background-color: #84A13D;
}
:deep(.topic-table .v-data-table-header tr th span){
  color: #fff;
  font-weight: 500;
}
:deep(.task-table .v-data-table__wrapper .v-badge__wrapper .v-badge__badge){
  inset:auto auto calc(100% - -3px) calc(-72% - 124px) !important;
}
</style>

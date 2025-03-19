<template>
  <div>
    <v-dialog v-model="openPopup" scrollable max-width="1125px" persistent>
      <v-card>
        <v-card-title
          class="text-h5 justify-content-center text-uppercase mt-7"  
        >
          {{ $t('title.process_checklist') }}
        </v-card-title>
        <v-card-text>
          <div class="review-popup mt-7">
            <div class="review-popup-table normal-table">
              <!-- <div class="info-block w-50">
                  <div class="label-item">{{ $t('form.status') }} :</div>
                  <div class="info-item">
                    New
                  </div>
                </div> -->
              <div class="info-block w-50 align-center">
                <div class="label-item col-2 p-0 mr-n3">
                  {{ $t('form.name') }} :
                </div>
                <div v-if="!isEdit" class="info-item">
                  {{ checklistItem.name }}
                  <!-- Name -->
                </div>
                <div v-else class="input-wrap w-100 mb-n4">
                  <v-text-field
                    v-model="checklistItem.name"
                    :rules="required"
                    outlined
                  />
                </div>
              </div>
              <div class="info-block w-50 align-center">
                <div class="label-item">{{ $t('form.function') }} :</div>
                <div class="info-item">Checklist</div>
              </div>

              <div class="info-block w-50 align-center">
                <div class="label-item">{{ $t('form.added_by') }} :</div>
                <div class="info-item">
                  {{ checklistItem.added_by_name }}
                </div>
              </div>
              <div v-if="!isEdit" class="info-block w-50">
                <div class="label-item">{{ $t('form.category') }} :</div>
                <div class="info-item">
                  {{ checklistItem.category_name }}
                </div>
              </div>
              <div v-else class="info-block w-50 align-center">
                <div class="label-item col-3 p-0 mr-n8">
                  {{ $t('form.category') }} :
                </div>
                <category
                  :object-item="checklistItem"
                  :type-category="'checklist'"
                  @getNewCategory="getNewCategory"
                  class="mb-n4"
                />
              </div>
              <div :class="isEdit ? 'info-block' : 'info-block description'">
                <div class="label-item p-0">{{ $t('form.description') }}:</div>
                <div v-if="!isEdit" class="info-item">
                  {{
                    checklistItem.checklist_info
                      ? checklistItem.checklist_info.description
                      : ''
                  }}
                </div>
                <div v-else class="input-wrap form-description">
                  <FroalaSuggestionListEditor :item="checklistItem" />
                </div>
              </div>

              <div class="info-block w-50">
                <div class="label-item">{{ $t('form.security') }} :</div>
                <div class="info-item">
                  {{
                    checklistItem.is_shared == 0
                      ? $t('message.personal')
                      : $t('message.shared')
                  }}
                </div>
              </div>

              <div
                :class="
                  isEdit
                    ? 'info-block d-block w-50 chip'
                    : 'info-block w-50 chip'
                "
              >
                <div class="label-item">{{ $t('form.responsible') }} :</div>
                <div v-if="!isEdit" class="info-item">
                  <!-- <v-chip 
                    v-for="(item,index) in responsibleName" :key="index"
                      class="mr-2 mb-1 chip-custom green-chip"
                      small
                    >
                    {{item}}
                    </v-chip> -->
                  <v-chip class="mr-2 mb-1 chip-custom green-chip" style="height:25px;">
                    <!-- {{checklistItem.responsible_first_name + ' ' + checklistItem.responsible_last_name }} -->
                    {{
                      checklistItem.responsible_name
                    }}
                  </v-chip>
                  <!-- <v-chip
                      class="mr-2 mb-1 chip-custom gray-chip"
                      small
                    >
                      Green Chip
                    </v-chip>
                    <v-chip
                      class="mr-2 mb-1 chip-custom red-chip"
                      small
                    >
                      Red Chip
                    </v-chip> -->
                </div>
                <ResponsibleEdit v-else :object-item="checklistItem" />
              </div>
            </div>
            <div class="review-popup-table expandable-table">
              <v-data-table
                v-for="(topicItem, topicIndex) in topicArray"
                :key="topicItem.id"
                :headers="computedExpandableHeaders"
                :items="topicItem.questions"
                class="elevation-1 review-table review-popup-table px-1"
                :items-per-page="15"
                :single-expand="true"
                :sort-by="['created_at']"
                :sort-desc="[true, false]"
                hide-default-footer
                item-key="id"
              >
                <template slot="top">
                  <v-toolbar flat class="align-center">
                    <v-toolbar-title>
                      {{ topicItem.name }}
                    </v-toolbar-title>
                  </v-toolbar>
                </template>
                <template v-slot:item.checkName="{ item }">
                  {{ item.name }}
                </template>
                <template v-slot:item.comment="{ item, index }">
                  <div>
                    <img
                      src="../assets/images/gridIcon/comment_fill_red.png"
                      alt=""
                      srcset=""
                      v-if="item.description"
                      @click="showComment(item.description)"
                    />
                    <img
                      src="../assets/images/gridIcon/comment.png"
                      alt=""
                      srcset=""
                      v-else
                    />
                  </div>
                </template>
                <template v-slot:item.image="{ item, index }">
                  <img
                    src="../assets/images/icon/image-red.png"
                    @click="showImage(item.file)"
                    v-if="item.file"
                  />
                  <img v-else src="../assets/images/icon/image-gray.png" />
                </template>
                <template v-slot:item.options="{ item }">
                  {{ item.answer_name }}
                </template>
                <template v-slot:item.close="{ item, index }">
                  <span class="d-flex justify-center">
                    <v-checkbox
                      v-model="topicItem.questions[index].isclosed"
                      :label="item.close"
                      :value="item.id"
                      :true-value="true"
                      :false-value="false"
                      :hide-details="true"
                      :disabled="!topicItem.questions[index].isclosed || checklistItem.responsible !== userID"
                      class="mt-0 pt-0"
                    />
                  </span>
                </template>
                <template v-slot:item.risk="{ item, index }" v-if="checklistItem.responsible == userID">
                  <span class="d-flex justify-center">
                    <div @mouseenter="hoverRiskPlanAccess = true" @mouseleave="hoverRiskPlanAccess = false">
                      <v-badge v-if="!!planAccess?.lastPlanAccess?.risk || ! planAccess?.planAccess?.risk" :value="hoverRiskPlanAccess" left
                        transition="slide-x-transition" class="hse--icon-question-circle" style="display: block; cursor: pointer;">
                        <span slot="badge" @click="redirectUrl">{{ $t('message.accessible_module') }}</span> 
                      </v-badge>
                      <v-checkbox
                      v-model="topicItem.questions[index].isRiskCreated"
                      :label="item.risk"
                      :value="item.id"
                      :true-value="true"
                      :false-value="false"
                      :hide-details="true"
                      class="mt-0 pt-0"
                      :disabled="topicItem.questions[index].isTaskCreated || topicItem.questions[index].isRiskCreated || !!planAccess?.lastPlanAccess?.risk || ! planAccess?.planAccess?.risk"
                      @click="checkRisk(item, index, topicIndex)"
                    />
                    </div>
                  
                  </span>
                </template>
                <template v-slot:item.task="{ item, index }" v-if="checklistItem.responsible == userID">
                  <span class="d-flex justify-center">
                    <div @mouseenter="hoverTaskPlanAccess = true" @mouseleave="hoverTaskPlanAccess = false">
                    <v-badge v-if="!!planAccess?.lastPlanAccess?.task || ! planAccess?.planAccess?.task" :value="hoverTaskPlanAccess" left
                        transition="slide-x-transition" class="hse--icon-question-circle" style="display: block; cursor: pointer;">
                      <span slot="badge" @click="redirectUrl">{{ $t('message.accessible_module') }}</span> 
                    </v-badge>
                    <v-checkbox
                      v-model="topicItem.questions[index].isTaskCreated"
                      :label="item.task"
                      :value="item.id"
                      :true-value="true"
                      :false-value="false"
                      :hide-details="true"
                      class="mt-0 pt-0"
                      :disabled="topicItem.questions[index].isRiskCreated || topicItem.questions[index].isTaskCreated || !!planAccess?.lastPlanAccess?.task || ! planAccess?.planAccess?.task"
                      @click="checkTask(item, index, topicIndex)"
                    />
                  </div>
                  </span>
                </template>
                <template v-slot:item.action="{ item,index }">
                    <v-icon v-if="((topicItem.questions[index].isTaskCreated || topicItem.questions[index].isRiskCreated) && (item.action == 'risk' ||  item.action == 'task')) "
                      class="mr-2"
                      @click="openHistory(item)"
                    >
                      mdi-eye
                    </v-icon>
                    <span v-else>N/A</span>
                    <!-- <v-icon
                      small
                      class="mr-2"
                    >
                      mdi-pencil
                    </v-icon>
                    <v-icon
                      small
                    >
                      mdi-delete
                    </v-icon> -->
                  </template>
              </v-data-table>
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="d-flex align-center pb-9 pr-9">
          <!-- <div class="input-wrap switch-component mt-n5">
          <label class="left-text">{{ $t('button.index') }}</label>
          <v-badge
            :value="hoverQuestionMark"
            right
            transition="slide-x-transition"
            class="hse--icon-question-circle"
            :content="$t('message.hover_index')"
          >
            <v-hover v-model="hoverQuestionMark">
              <i class="fa fa-question-circle"></i>
            </v-hover>
          </v-badge>
        </div> -->
          <v-spacer />
          <v-btn class="btn-cancel" text @click="close()" v-if="!hideCancelation">
            {{ $t('button.cancel') }}
          </v-btn>
          <v-btn class="btn-save" @click="save()" v-if="!hideSaveBtn && checklistItem.responsible == userID"
          :disabled="!!planAccess?.lastPlanAccess?.checklist">
            {{ $t('button.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- <NewRiskAnalysisPopup
                :open-popup="chooseRisk"
                :job-title-array="jobTitleArray"
                :departments-array="departmentsArray"
                :task-assignees-array="taskAssigneesArray"
                :categoriesArray="categoriesArray"
                :responsible-array="responsibleArray"
                @closePopup="chooseRisk = !chooseRisk"
              /> -->
    <AddTaskPopup
      :is-deviation="true"
      :open-popup="chooseTask"
      :process_Ontask="process_Ontask"
      :form-title="$t('title.task_through_checklist')"
      :object-field="objectField"
      :object-item="taskItem"
      :taskCategoriesArray="categoriesArray"
      :categories-array="categoriesArray"
      :taskSelectedTopic="selectedTopic"
      :answerArray="answerArray"
      :predefinedLinkArray="predefinedLinkArray"
      :categories-type="'checklist'"
      :currentTaskId="currentTaskId"
      @closePopup="closeTask"
      @savePopup="AddTask"
    />
    <image-popup
      :open-popup="checkImage"
      :document-item="objectItem"
      @closePopup="checkImage = !checkImage"
      :addImage="addImage"
    />
    <reason-popup
      :open-popup="checkComment"
      @closePopup="checkComment = !checkComment"
      :titleMessage="$t('form.comment')"
      :addDescription="addDescription"
    />
    <checklist-risk-analysis-popup
      :open-popup="chooseRisk"
      :job-title-array="jobTitleArray"
      :answerArray="answerArray"
      :riskAnalysisItem="checklistItem"
      :departments-array="departmentsArray"
      :task-assignees-array="taskAssigneesArray"
      :categoriesArray="categoriesArray"
      :responsible-array="responsibleArray"
      :riskSelectedTopic="selectedTopic"
      @closePopup="closeRisk"
      @saveRisk="saveRisk"
      :currentRiskId="currentRiskId"
    />
    <TaskReviewPopup
      :open-popup="checkShowItem"
      :object-item="openTaskItem"
      :categories-array="categoriesArray"
      :predefined-link-array="predefinedLinkArray"
      @closePopup="checkShowItem = !checkShowItem"
      @reloadList="reloadList"
      :inReportData="true"
    />

    <RiskAnalysisReviewPopup
      :open-popup="checkShowItemRisk"
      :object-item="openRiskItem"
      :categories-array="categoriesArray"
      @closePopup="checkShowItemRisk = !checkShowItemRisk"
      @reloadList="reloadList"
      @reloadListCategory="reloadListCategory"
      :inReportData="true"
    />
  </div>
</template>
  
  <script>
import { _ } from 'vue-underscore'
// import api from '~/apis'
import FroalaSuggestionListEditor from '@/components/FroalaSuggestionListEditor'
import ResponsibleEditInReviewPopup from './ResponsibleEditInReviewPopup'
// import NewRiskAnalysisPopup from "./NewRiskAnalysisPopup";
import AddTaskPopup from './AddTaskPopup'
import CategoryInReviewPopup from './CategoryInReviewPopup'
import cookies from 'js-cookie'
import ImagePopup from './ImagePopup.vue'
import ChecklistRiskAnalysisPopup from './ChecklistRiskAnalysisPopup.vue'
import ReasonPopup from './ReasonPopup.vue'
import TaskReviewPopup from './TaskReviewPopup.vue'
import RiskAnalysisReviewPopup from './RiskAnalysisReviewPopup.vue'
import moment from 'moment';
import { formatTimeString } from "./common/js/functions"


export default {
  name: 'ReviewProcessChecklist',
  components: {
    ResponsibleEdit: ResponsibleEditInReviewPopup,
    AddTaskPopup,
    FroalaSuggestionListEditor,
    category: CategoryInReviewPopup,
    ImagePopup,
    ChecklistRiskAnalysisPopup,
    ReasonPopup,
    TaskReviewPopup,
    RiskAnalysisReviewPopup,
  },

  props: {
    openPopup: {
      type: Boolean,
      required: false,
    },
    fieldInput: {
      type: Array,
      required: false,
    },
    checklistItem: {
      type: (Array, Object),
      required: false,
    },
    riskAnalysisItem: {
      type: Object,
      required: false,
    },
    jobTitleArray: {
      type: Array,
      required: false,
    },
    departmentsArray: {
      type: Array,
      required: false,
    },
    predefinedLinkArray: {
      type: Array,
      required: false,
    },
    taskAssigneesArray: {
      type: Array,
      required: false,
    },
    responsibleArray: {
      type: Array,
      required: false,
    },
    categoriesArray: {
      type: Array,
      required: false,
    },
    taskCategoriesArray: {
      type: Array,
      required: false,
    },

    // predefinedLinkArray: {
    //   type: Array,
    //   required: false,
    // },
  },
  data: () => ({
    hoverTaskPlanAccess:false,
    hoverRiskPlanAccess: false,
    currentRiskId: '',
    currentTaskId: '',
    userRoleId: parseInt(cookies.get('roleID')),
    userDepartmentID: parseInt(cookies.get('userDepartmentID')),
    permissionsUser: localStorage.getItem('permissionsKey'),
    planAccess: JSON.parse(localStorage.getItem('planAccess')),
    checkAdmin: cookies.get('checkAdmin'),
    roleUser: cookies.get('roleUser'),
    userID: parseInt(cookies.get('userID')),
    checkCreator: false,
    valid: true,
    checkShowItem: false,
    checkShowItemRisk:false,
    required: [
      (v) => {
        if (!v || v.length < 1) return 'This is required'
        else return true
      },
    ],
    chooseClose: ['item'],
    RiskModal: [],
    riskValue: false,
    taskValue: false,
    chooseRisk: false,
    chooseRiskAnalysis: false,
    taskAnalysis: false,
    chooseTask: false,
    selectedTopic: [],
    hideCancelation:false,
    objectField: [
      'name',
      'description',
      'category',
      'responsible',
      'attendee',
      'start-date',
      'deadline',
      'security',
    ],
    topicArray: [],
    answerArray: [],
    listArray: [],
    reportDetail: [],
    topicDetail: [],
    ImageDetail: [],
    responsibleName: [],
    
    checkPointArray: [
      {
        id: 1,
        name: 'How many holes in the floor',
        result: '2',
        comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        image: 'img1',
      },
      {
        id: 2,
        name: 'Are holes are dangerours ?',
        result: 'By glue',
        comment: 'Not- Available',
        image: 'img2',
      },
    ],

    isEdit: false,
    hoverQuestionMark: false,
    hideSaveBtn:false,
    objectItem: {
      description: '',
      start_date: '',
      start_date_pre: '',
      deadline: '',
      deadline_pre: '',
      recurring: '',
    },
    selectedArray: [],
    openRiskItem:{
      id:''
    },
    openTaskItem:{},
    taskItem: {
      checklist: '',
      name: '',
      description: '',
      category_id: '',
      company_id: '',
      added_by: '',
      department_id: '',
      parent_id: '',
      count_related_object: 0,
      related_objects: [],
      industry_id: '',
      is_suggestion: false,
      object_type: 'task',
      is_shared: false,
      is_public: false,
      start_date: '',
      start_time: '',
      start_date_pre: '',
      start_time_pre: '',
      deadline: '',
      end_time :'',
      end_time_pre:'',
      deadline_pre: '',
      isDefaultResponsible: false,
      responsible_department_array: [],
      responsible_employee_array: [],
      isDefaultAttendee: false,
      attendee_department_array: [],
      attendee_employee_array: [],
      job_title_id: '',
      is_template: false,
      type: 'task',
      source: 'report',
      status: 1,
      responsible_required_comment: false,
      responsible_required_attachment: false,
      attendee_required_comment: false,
      attendee_required_attachment: false,
      attendee_all: false,
      report_id: '',
    },
    defaultTaskItem: {
      checklist: '',
      name: '',
      description: '',
      category_id: '',
      company_id: '',
      added_by: '',
      department_id: '',
      parent_id: '',
      count_related_object: 0,
      related_objects: [],
      industry_id: '',
      is_suggestion: false,
      object_type: 'task',
      is_shared: false,
      is_public: false,
      start_date: '',
      start_time: '',
      start_date_pre: '',
      start_time_pre: '',
      deadline: '',
      end_time :'',
      end_time_pre:'',
      deadline_pre: '',
      isDefaultResponsible: false,
      responsible_department_array: [],
      responsible_employee_array: [],
      isDefaultAttendee: false,
      attendee_department_array: [],
      attendee_employee_array: [],
      job_title_id: '',
      is_template: false,
      type: 'task',
      source: 'report',
      status: 1,
      responsible_required_comment: false,
      responsible_required_attachment: false,
      attendee_required_comment: false,
      attendee_required_attachment: false,
      attendee_all: false,
      report_id: '',
    },
    checkpoints: {
    reportID:'',
    reportAction:'',
    },
    editedItem: {
      attendee_all: false,
      isDefaultResponsible: false,
      isDefaultAttendee: false,
       responsible_department_array: [],
      responsible_employee_array: [],
       responsible_required_comment: false,
      responsible_required_attachment: false,
      attendee_required_comment: false,
      attendee_required_attachment: false,
      responsible:''
    },
    checkImage: false,
    checkComment: false,
    addImage: '',
    addDescription: '',
    process_Ontask: false,
  }),

  computed: {
    headers() {
      return [
        { text: this.translateCol('name'), value: 'name', align: 'left' },
        { text: this.translateCol('comment'), value: 'comment', align: 'left' },
        { text: this.translateCol('image'), value: 'image', align: 'center' },
        { text: this.translateCol('status'), value: 'status', align: 'center' },
        {
          text: this.translateCol('actions'),
          value: 'actions',
          align: 'center',
        },
      ]
    },

    expandableHeader() {
      return [
        {
          text: this.translateCol('name'),
          value: 'name',
          align: 'left',
          width: '20%',
        },
        {
          text: this.translateCol('result'),
          value: 'options',
          align: 'center',
          width: '20%',
        },
        {
          text: this.translateCol('comment'),
          value: 'comment',
          align: 'center',
          width: '20%',
        },
        {
          text: this.translateCol('image'),
          value: 'image',
          align: 'center',
          width: '10%',
        },
        {
          text: this.translateCol('close'),
          value: 'close',
          align: 'center',
          width: '10%',
        },
        {
          text: this.translateCol('risk'),
          value: 'risk',
          align: 'center',
          width: '10%',
        },
        {
          text: this.translateCol('task'),
          value: 'task',
          align: 'center',
          width: '10%',
        },
        {
          text: this.translateCol('action'),
          value: 'action',
          align: 'center',
          width: '10%',
          sortable:false
        },
      ]
    },
     expandableHeaderManager() {
      return [
        {
          text: this.translateCol('name'),
          value: 'name',
          align: 'left',
          width: '20%',
        },
        {
          text: this.translateCol('result'),
          value: 'options',
          align: 'center',
          width: '20%',
        },
        {
          text: this.translateCol('comment'),
          value: 'comment',
          align: 'center',
          width: '20%',
        },
        {
          text: this.translateCol('image'),
          value: 'image',
          align: 'center',
          width: '10%',
        },
        {
          text: this.translateCol('close'),
          value: 'close',
          align: 'center',
          width: '10%',
        },
        {
          text: this.translateCol('action'),
          value: 'action',
          align: 'center',
          width: '10%',
          sortable:false
        },
      ]
    },

    computedHeaders() {
      return this.headers
    },

    computedExpandableHeaders() {
      if (this.userID !== this.checklistItem.responsible) {
        return this.expandableHeaderManager
      }else{

        return this.expandableHeader
      }
    },

    filteredChecklistlItems() {
      let that = this
      return that.checkPointArray
    },
  },

  watch: {
    openPopup(value) {
      if (value) {
        if (this.checklistItem) {
          this.editItem(this.checklistItem)
        } else {
          this.editItem(this.checklistItem)
        }
      }
    },
    topicArray(value) {
      if (value == '')
        this.topicArray.push({
          name: '',
          questions: [
            {
              name: '',
              default_option_id: '',
              option_answers: '',
              required_comment: '',
              required_attachment: '',
              checklist_required_comment: '',
              checklist_required_attachment: '',
            },
          ],
        })
    },
  },

  created() {
    if (this.openPopup) {
      if (this.checklistItem) {
        this.editItem(this.checklistItem)
      }
    }
  },

  methods: {
    redirectUrl(){
      if (this.roleUser == 'company admin') {
              this.$router.push('/settings/billings/');
          }
      },

    openRiskHistory(openRisk){
      this.openRiskItem=openRisk.data
    },
    openHistory(item){
      if (item.action== 'task') {
        this.openTaskItem.id=item.object_id
        this.checkShowItem = !this.checkShowItem
      }else if(item.action == 'risk'){
        this.openRiskItem.id=item.object_id
        this.checkShowItemRisk = !this.checkShowItemRisk
      }
    },
    saveRisk(id) {
      this.hideCancelation=true
      for (let i = 0; i < this.topicArray.length; i++) {
        for (let j = 0; j < this.topicArray[i].questions.length; j++) {
          if (this.topicArray[i].questions[j].id == id) {
            this.topicArray[i].questions[j].isRiskCreated = true
            // if (this.topicArray[i].questions[j].isTaskCreated == true) {
              this.topicArray[i].questions[j].isclosed = false
            // }
          }
          // else {
          //   this.topicArray[i].questions[j].isRiskCreated = false
          // }
        }
      }
      this.chooseRisk = false
    },
    checkRisk(item) {
      this.currentRiskId = item.id
      this.selectedTopic = [item]
      this.chooseRisk = true
    },
    closeRisk(id) {
      for (let i = 0; i < this.topicArray.length; i++) {
        for (let j = 0; j < this.topicArray[i].questions.length; j++) {
          if (this.topicArray[i].questions[j].id == id) {
            this.topicArray[i].questions[j].isRiskCreated = false
          }
        }
      }
      this.chooseRisk = false
    },
    closeTask(id) {
      for (let i = 0; i < this.topicArray.length; i++) {
        for (let j = 0; j < this.topicArray[i].questions.length; j++) {
          if (this.topicArray[i].questions[j].id == id) {
            this.topicArray[i].questions[j].isTaskCreated = false
          }
        }
      }
      this.chooseTask = false
    },
    checkTask(item) {
      this.currentTaskId = item.id
      this.chooseTask = true
      this.selectedTopic = [item] 
      this.process_Ontask = true
      this.taskItem.name = this.checklistItem.name
      this.taskItem.category_id = this.checklistItem.category_id
      this.taskItem.category_id = this.checklistItem.category_id
      this.taskItem.end_time = ''
      this.taskItem.start_time = ''
      this.taskItem.attendee_department_array = []
      this.taskItem.attendee_employee_array = []
      this.taskItem.responsible_department_array = []
      this.taskItem.responsible_employee_array = []
    },
    showComment(item) {
      this.addDescription = item
      this.checkComment = true
    },
    showImage(item) {
      this.checkImage = true
      this.addImage = item
      // this.addImage=this.editedItem.answer
    },
    async AddTask(payload) {
      let that = this
      that.chooseTask = false
      that.hideCancelation = true
      //list objects
      that.taskItem.name = payload.item.name
      that.taskItem.checklist = that.checklistItem.checklist_id
      that.taskItem.start_date = that.taskItem.start_date_pre
      // that.taskItem.start_time = that.taskItem.start_time_pre != null && that.taskItem.start_time_pre != "" ? new moment(that.taskItem.start_time_pre, "HH:mm").utc().format("HH:mm") : null;
      // that.taskItem.end_time = that.taskItem.end_time_pre && that.taskItem.end_time_pre != "" ? new moment(that.taskItem.end_time_pre, "HH:mm").utc().format("HH:mm"): null;
      that.taskItem.start_time = await formatTimeString(new moment(that?.taskItem?.start_time_pre, "HH:mm"))
      that.taskItem.end_time = await formatTimeString(new moment(that?.taskItem?.end_time_pre, "HH:mm"))
      that.taskItem.deadline = that.taskItem.deadline_pre
      that.taskItem.added_by = that.userID
      that.taskItem.question = that.selectedTopic[0].id
      that.taskItem.topics = that.selectedTopic?.[0]
      that.taskItem.industry_id = '2'
      that.taskItem.report_id= that.checklistItem.id
      that.taskItem.source_id= that.checklistItem.id
      that.$store
        .dispatch('objects/store', that.taskItem)
        .then(() => {
          that.$toaster.success(that.$i18n.t('message.success_task_add_new'))
          that.$nuxt.$loading.finish()
        })
        .catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_task_add_new'))
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish()
        })
        that.taskItem=that.defaultTaskItem
      for (let i = 0; i < this.topicArray.length; i++) {
        for (let j = 0; j < this.topicArray[i].questions.length; j++) {
          if (this.topicArray[i].questions[j].id == payload.item.question) {
            this.topicArray[i].questions[j].isTaskCreated = true
            // if (this.topicArray[i].questions[j].isRiskCreated == true) {
              this.topicArray[i].questions[j].isclosed = false
            // }
          }
        }
        // else {
        //   this.topicArray[i].questions[0].isTaskCreated = false
        // }
      }
    },
    reloadList() {
      this.$emit('reloadList')
    },

    reloadListCategory() {
      this.$emit('reloadListCategory')
    },
    save() {
      let that = this
      let saveReport = {}
      saveReport['id'] = that?.editedItem?.id
      saveReport['status'] = that?.editedItem?.status
      saveReport['checklist_id'] = that?.editedItem?.checklist_id
      saveReport['responsible'] = that?.editedItem?.responsible


      that.newBlank = []
      //  that.saveReport.checkpoint_arr=[]

      _.each(that.topicArray, async function (topic , index) {
        _.each(topic.questions, async function (question , innerIndex) {
          // console.log("question",question);
          that.checkpoints.reportAction = ''
          that.checkpoints.reportID = question.id
          if(that.checkpoints.reportID == question.id){
          if(question.isRiskCreated == true){
              that.checkpoints.reportAction = 'risk'
              saveReport['status'] = 2
            }
            if(question.isTaskCreated == true){
              that.checkpoints.reportAction = 'task'
              saveReport['status'] = 2
            }
            // if(question.isRiskCreated == false || question.isTaskCreated == false){
            //   that.checkpoints.reportAction = 'close'
            //   saveReport['status'] = 2
            // }
          }
          that.newBlank.push({
            id: that.checkpoints.reportID,
            action: that.checkpoints.reportAction,
          })
          if (that.topicArray.length -1 == index && topic.questions.length - 1 == innerIndex) {
            that.checkpoints = that?.newBlank
            saveReport['checkpoint_arr'] = that.checkpoints
            that.$store
              .dispatch('reports/update', saveReport)
              .then(function () {
                that.reloadList();
                // that.reloadListCategory()
                that.$toaster.success(
                  that.$i18n.t('message.success_checklist_report_update')
                )
              })
              .catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
                that.$toaster.error(
                  that.$i18n.t('message.fail_checklist_report_update')
                )
          }
                // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
                that.$nuxt.$loading.finish()
              })
            that.close()
          }
        })
      })

      
      // that.$store
      //   .dispatch('reports/update', saveReport)
      //   .then(function () {
      //     // that.reloadlist()
      //     // that.reloadListCategory()
      //     that.$toaster.success(
      //       that.$i18n.t('message.success_checklist_report_update')
      //     )
      //   })
      //   .catch(() => {
      //     that.$toaster.error(
      //       that.$i18n.t('message.fail_checklist_report_update')
      //     )
      //     // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
      //     that.$nuxt.$loading.finish()
      //   })
      // that.close()
    },
    getNewCategory(value) {
      this.checklistItem.category_id = value.newCategoryId
    },
    translateCol(colName) {
      return this.$i18n.t('column.' + colName)
    },
    close() {
      this.isEdit = false
      if (this.openPopup) {
        this.$emit('closePopup')
      }
    },

    editItem(item) {
      let that = this
      that.editedItem = Object.assign({}, item)
      that.editedItem.is_public = item.is_shared == 1 ? true : false
      that.hideSaveBtn = false
      that.hideCancelation=false
      that.$nuxt.$loading.start();
      that.$store
        .dispatch('reports/show', item.id)
        .then((result) => {
          that.$nuxt.$loading.start();
          that.topicArray = result?.data?.checklist_info?.topics
          let count=0
          for (let i = 0; i < that.topicArray.length; i++) {
            for (let j = 0; j < this.topicArray[i].questions.length; j++) {
              if (that.topicArray[i].questions[j].action=='risk') {
                that.topicArray[i].questions[j].isRiskCreated = true
                that.topicArray[i].questions[j].isclosed = false
              }
              if (that.topicArray[i].questions[j].action=='task') {
                that.topicArray[i].questions[j].isTaskCreated = true
                that.topicArray[i].questions[j].isclosed = false
              }
              if (that.topicArray[i].questions[j].action=='close' || that.topicArray[i].questions[j].action=='null' || that.topicArray[i].questions[j].action=='' || that.topicArray[i].questions[j].action== null) {
                that.topicArray[i].questions[j].isclosed = true
                that.topicArray[i].questions[j].isRiskCreated = false
                that.topicArray[i].questions[j].isTaskCreated = false
              }
              if (that.topicArray[i].questions[j].isclosed === true ) {
                count++
                // if((that.topicArray[i].questions.length * that.topicArray.length) == count){
                //   that.hideSaveBtn = true
                // }
              }
              // that.topicArray[i].questions[j].isRiskCreated = false
              // that.topicArray[i].questions[j].isTaskCreated = false
              // that.topicArray[i].questions[j].isclosed = false
            }

            // if(that.topicArray[i].questions[0].risk_id==null || that.topicArray[i].questions[0].risk_id==undefined || that.topicArray[i].questions[0].risk_id == "")
            //   that.topicArray[i].questions[0].isRiskCreated=false;

            //   else
            //   that.topicArray[i].questions[0].isRiskCreated=true;
          }
          if (count === 0) {
            that.hideSaveBtn = true;
          }
          that.$nuxt.$loading.finish()
        })
        .catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(
            that.$i18n.t('message.fail_checklist_report_view_detail')
          )
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish()
        })
      // that.$store.dispatch('topics/index', {checklist: that.editedItem.checklist_id}).then(topic => {
      // that.topicArray = result.data.checklist_info.topics;
      // _.each(that.topicArray, function (topicItem) {
      //   if (topicItem.questions.length > 0) {
      //     that.isAddNewCheckpoint = true;
      //   }
      //   _.each(topicItem.questions, function (question) {
      //     that.options=question.default_option_id
      //     question.option_answers.sort(function (a, b) {
      //       return (a.arrangement_order - b.arrangement_order);
      //     });
      //   });
      // });
      // that.$nuxt.$loading.finish();
      // }).catch(() => {
      //   that.$toaster.error(that.$i18n.t('message.fail_checklist_topic_view'));
      //   // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
      //   that.$nuxt.$loading.finish();
      // });

      //   that.$store.dispatch('options/index', {checklistID: that.editedItem.checklist_id}).then(option => {
      //     that.answerArray = _.sortBy(option.data, function(answer) {
      //       return answer.count_used_time;
      //     });
      //     that.formatNameOfDefaultOptionType(that.answerArray.reverse());
      //   }).catch(() => {
      //     that.$toaster.error(that.$i18n.t('message.fail_checklist_option_view'));
      //     // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
      //     that.$nuxt.$loading.finish();
      //   });
      // that.originData = _.clone(that.editedItem);
    },
    // show list option with format name 'NAME - Slider / Dropdown'
    formatNameOfDefaultOptionType(list) {
      _.each(list, function (option) {
        if (option.type_of_option_answer === 1) {
          option.option_name = option.name + ' - Slider'
        } else {
          option.option_name = option.name + ' - Dropdown'
        }
      })
      return list
    },

    checkNewReportDataBeforeSave(list) {
      let that = this
      _.each(that.topicArray, function (topic) {
        _.each(topic.questions, function (question) {
          if (
            question.type_of_option_answer === 1 &&
            _.findWhere(list, { question_id: question.id }) === undefined
          ) {
            that.addAnswer(
              topic.id,
              question.id,
              question.option_answers[0],
              null
            )
          }
        })
      })
    },
  },
}
</script>
  
<style scoped>
:deep(.hover-label .v-badge__badge){
  inset: auto auto calc(100% - 30px) calc(85% - 10px) !important;
}

.badgee{
  position: unset; 
  cursor: pointer; 
}
</style>
  

<template>
  <div>
    <v-dialog v-model="openPopup" max-width="1125px" persistent>
      <v-card>
        <v-card-title class="text-h5 justify-content-center text-capitalize pt-8 mb-3">
          {{ titleMessage }}
        </v-card-title>
        <v-card-text>
          <div class="review-popup">
            <!-- v-if="(!revised || !isEdit || checkAdmin )|| !checkWorker" -->
            <!-- <div
            v-if="(!isEdit && !revised && checkAdmin) && !checkWorker"
              class="reminder-history d-flex justify-end mb-3"
            >
              <img
                @click="onHistoryAction"
                class="reminder-img"
                src="../assets/images/icon/reminder-history.png"
                alt="file.png"
              />
            </div> -->
            <!-- <v-data-table
              v-if="checklist_history && !isEdit"
              :headers="checklistHeader"
              :items="checklistArray"
              class="elevation-1 review-table review-popup-table"
              :items-per-page="15"
              :single-expand="true"
              :sort-by="['created_at']"
              :sort-desc="[true, false]"
              hide-default-footer
              @click:row="checkItem"
            >
              <template v-slot:item.id="{ index }">
                {{ index + 1 }}
              </template>
              <template v-slot:header.status="{ header }">
                <span>{{ editedItem.isRecurring ? 'Status' : '' }}</span>
              </template>
              <template v-slot:item.status="{ item }">
                <v-chip
                  class="ma-2 status-label-custom approved"
                  label
                  v-if="editedItem.isRecurring"
                >
                  {{ $t('form.approved') }}
                </v-chip>
              </template>
              <template v-slot:item.start_date="{ item }">
                {{ moment().format('DD.MM.YYYY') }}
              </template>
              <template v-slot:item.deadline="{ item }">
                {{ moment().add(1, 'days').format('DD.MM.YYYY') }}
              </template>
              <template v-slot:item.revised="{ item }">
                {{ moment().add(1, 'days').format('DD.MM.YYYY') }}
              </template>
              <template v-slot:item.is_suggestion="{ item }">
      <v-hover v-if="(item.is_suggestion==0)" v-slot:default="{ hover }">
          <v-badge :value="hover" right transition="slide-x-transition" class="hse--icon-question-circle table-badge">
            <span slot="badge">{{ $t('message.share') }}</span>
            <img class="icon-img" src="../assets/images/gridIcon/security.png" alt="fillSecurity.png" @click.stop/>
          </v-badge>
        </v-hover>
        <v-hover v-else v-slot:default="{ hover }">
          <v-badge :value="hover" right transition="slide-x-transition" class="hse--icon-question-circle table-badge">
            <span slot="badge">{{ $t('message.share') }}</span>
            <img class="icon-img" src="../assets/images/gridIcon/fillSecurity.png" alt="fillSecurity.png" @click.stop/>

          </v-badge>
        </v-hover>
      </template>
              <template slot="top">
                <v-toolbar flat>
                  <v-toolbar-title>
                    {{ $t('title.checklist_history') }}
                  </v-toolbar-title>
                </v-toolbar>
              </template>
            </v-data-table> -->
            <AddTable
            v-if="checklist_history"
            :titleMessage="$t('title.checklist_history')"
            :addTopic="false"
              :topicArray="checklistArray"
              :headers="checklistHeader"
              :addCommentAttach=false
              @onTaskInfo="checkItem"
              :hoverMessage="$t('message.share')"
              :tableIcon="tableIcon"
              />
            <div class="review-popup-table normal-table" :class="revised? 'mt-5' : ''">
              <!-- name -->
              <div class="info-block w-50 align-center">
                <div class="label-item">{{ $t('form.name') }}:</div>
                <div
                  v-if="!isEdit"
                  class="info-item"
                  @click="
                    (checkAdmin || checkCreator || checkSuperAdmin) && !editResponsible  
                      ? (isEdit = !isEdit)
                      : (isEdit = false)
                  "
                >
                  {{ editedItem.name }}
                </div>
                <div v-else class="input-wrap w-100 mb-n6 ">
                  <v-text-field
                    v-model="editedItem.name"
                    :rules="required"
                    outlined
                  />
                </div>
              </div>

              <!-- Source -->
              <div class="info-block w-50 align-center">
                <div class="label-item">{{ $t('form.function') }} :</div>
                <div class="info-item text-capitalize">
                  {{ editedItem.type || editedItem.function}}
                </div>
              </div>

              <!-- Added by -->
              <div cols="6" class="info-block w-50 align-center">
                <div class="label-item">{{ $t('form.added_by') }} :</div>
                <div v-if="editedItem.added_by === 1">{{$t('table.system')}}</div>
                <div class="info-item" v-else>
                  {{ editedItem.addedByName || editedItem.added_by_name }}
                  <!-- {{ 'Creator' }} -->
                </div>
              </div>

              <!-- Category -->

              <div
                v-if="!isEdit"
                class="info-item w-50 align-center"
                @click="
                  (checkAdmin || checkCreator || checkSuperAdmin) && !editResponsible 
                    ? (isEdit = !isEdit)
                    : (isEdit = false)
                "
              >
                <div class="info-block">
                  <div class="label-item">
                    {{ $t('form.category') }} :
                  </div>
                  <div class="info-item">
                    {{ editedItem.categoryName || editedItem.category_name }}
                  </div>
                </div>
              </div>
              <div v-if="isEdit" class="input-wrap info-block w-50 p-3 d-flex align-center">
                <div class="label-item col-3 p-0 mr-n8">
                    {{ $t('form.category') }} :
                  </div>
              <category
                :object-item="editedItem"
                :type-category="'checklist'"
                @getNewCategory="getNewCategory"
                class="ml-3 category-item mb-n6"
              />
              </div>

              <!-- Description -->

              <div :class="isEdit ? 'info-block' : 'info-block description'">
                <div class="label-item">{{ $t('form.description') }}:</div>
                <div
                  v-if="!isEdit"
                  class="info-item"
                  @click="
                    (checkAdmin || checkCreator || checkSuperAdmin) && !editResponsible 
                      ? (isEdit = !isEdit)
                      : (isEdit = false)
                  "
                >
                  {{ editedItem.description }}
                </div>
                <div v-else class="input-wrap form-description">
                  <FroalaSuggestionListEditor
                    :item="editedItem"
                    :predefined-link-array="predefinedLinkArray"
                  />
                </div>
              </div>

              <!--security -->
              <div cols="6" class="info-block w-50" v-if="!resource">
                <div class="label-item">{{ $t('form.security') }} :</div>
                <div class="info-item">
                  <!-- {{ editedItem.added_by_name }} -->
                  {{ editedItem.is_shared==1 ?  $t('message.shared') : $t('message.personal') }}
                </div>
              </div>

              <!-- Responsible -->
              <!-- <div
                v-if="!isEdit"
                class="info-block w-50 px-4 chip align-center"
                @click="
                  checkAdmin || checkCreator
                    ? (isEdit = !isEdit)
                    : (isEdit = false)
                "
              >
                <div class="label-item">{{ $t('form.responsible') }}:</div>
                <div
                  class="
                    info-item
                    d-flex
                    justify-content-between
                    responsible-folddown
                  "
                >
                  <div>
                     <v-chip
                    v-for="(item, index) in responsibleName"
                    :key="index"
                    class="mr-2 mb-1 chip-custom"
                    small
                  >
                    {{ item }}
                  </v-chip>
                  </div>
                </div>
              </div> -->
              <!-- <div v-else class="pt-3 info-block d-block w-50">
                <div class="d-flex align-center mb-3">
                  <div class="label-item">{{ $t('form.responsible') }} :</div>
                  <div class="info-item">
                    <v-chip
                    v-for="(item, index) in responsibleName"
                    :key="index"
                    class="mr-2 mb-1 chip-custom"
                    small
                  >
                    {{ item }}
                  </v-chip>
                  </div>
                </div>
                <ResponsibleEdit :object-item="editedItem" />
              </div> -->
               <!-- Responsible -->
              <div class="info-block chip w-50" v-if="!resource">
                <div class="label-item">
                  {{ $t('form.responsible') }}:
                </div>
                <div v-if="!isEdit && !resource" class="info-item" @click="(((checkAdmin || checkCreator || checkSuperAdmin) &&  (!editResponsible)) || (checkManager && editResponsible) ) ? (isEdit = !isEdit) : (isEdit = false)">
                  <v-chip
                    v-for="(item, index) in responsibleName"
                    :key="index"
                    class="mr-2 mb-1 chip-custom"
                    small
                  >
                    {{ item }}
                  </v-chip>
                </div>
                <div v-else-if="isEdit && !resource">
                  <ResponsibleEdit
                    :object-item="editedItem"
                  />
                </div>
                <div v-else-if="resource">
                  {{editedItem.added_by_name}}
                </div>
              </div>
            </div>

             <v-data-table v-for="item in topicArray" :key="item.id"
          :headers="headers"
          :items="item.questions"
          :items-per-page="5"
          :single-expand="true"
              :sort-by="['created_at']"
              :sort-desc="[true, false]"
          class="elevation-1 review-table review-popup-table px-1"
          hide-default-footer
        >
          <template slot="top">
            <v-toolbar flat class="align-center">
              <v-toolbar-title>
                {{item.name }}
              </v-toolbar-title>
            </v-toolbar>
          </template>
          <template v-slot:item.checkName="{ item }">
            {{item.name}}
          </template>
          <template v-slot:item.comment="{ item,index }">
              <div>
                <img src="../assets/images/gridIcon/comment_fill_red.png" alt="" srcset="" v-if="item.required_comment == 1 || item.checklist_required_comment === 1"> 
                <img src="../assets/images/gridIcon/comment.png" alt="" srcset="" v-else>
              </div>
          </template>
          <template v-slot:item.image="{ item, index }">
            <img
              src="../assets/images/icon/image-red.png"
              @click.stop
              v-if="item.required_attachment == 1 || item.required_attachment === '1' || item.checklist_required_attachment === '1'"
            />
            <img v-else
              src="../assets/images/icon/image-gray.png"
              @click.stop
              />
          </template>
          <template v-slot:item.options="{ item }">
            {{item.option_name}}
          </template>
        </v-data-table>

          <v-data-table 
                v-if="(roleUser != 'manager' || connectToObject.length > 0) && !viewPopup"
                :headers="connectToObjectTableHeaders" :items="connectToObject" 
                class="elevation-1 review-table review-popup-table mt-5"
                :items-per-page="15"
                :single-expand="true" 
                :sort-by="['created_at']"
                :sort-desc="[true, false]"
                hide-default-footer>
                <template slot="top">
                    <v-toolbar flat>
                        <v-toolbar-title>
                            {{ $t('form.connected_to') }}
                        </v-toolbar-title>
                         <div v-if="checkAdmin || checkCreator">
                            <div role="button" v-if="!isEdit" @click="
                              checkAdmin || checkCreator
                                ? (isEdit = !isEdit)
                                : (isEdit = false)
                              " class="plus-icon-gray text-center d-flex align-center justify-center">
                                +
                            </div>
                            <div role="button" 
                                    v-else
                                    class="plus-icon text-center"
                                  @click="is_connect = !is_connect">+
                            </div>
                        </div> 
                    </v-toolbar>
                </template>
                <template v-slot:item.connected_date="{ item }">
                    <span class="ml-4">
                        {{ moment(item.connected_date).format('DD-MM-YYYY') }}
                    </span>
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-icon small title="View" @click="handleObjectOpen(item)">mdi-eye</v-icon>
                </template>
          </v-data-table>
              
          </div>
        </v-card-text>

        <v-card-actions class="px-6 py-7" >
          <v-spacer />

          <v-btn class="btn-cancel" text @click="close('closePopup')">
            {{ $t('button.cancel') }}
          </v-btn>
          <v-btn class="btn-save" @click="apply" v-if="resource && !isEdit && !checkSuperAdmin && !viewPopup">
            {{ $t('button.apply') }}
          </v-btn>
          <v-btn
            class="hse-btn-save bg-white shadow-none"
            @click="editChecklist"
            v-if="!resource && checkResponsiblePersone && !viewPopup"
          >
            {{ $t('button.use_checklist') }}
          </v-btn>
           <v-btn
            class="hse-btn-delete"
            @click="dialogDelete = true"
            v-if="!isEdit && !checkWorker && !viewPopup"
          >
            <v-icon dark>
              mdi-delete
            </v-icon>
          </v-btn>
          <v-btn class="btn-save" @click="save" v-if="!checkWorker && isEdit && !viewPopup">
            {{ $t('button.save') }}
          </v-btn>
          
        </v-card-actions>

        <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card class="dialog-delete">
        <v-card-text>
          <div class="text-center confirm-delete-title">
            {{ $t('title.confirm_delete') }}
          </div>
          <div class="confirm-delete-text">
            {{ $t('message.are_you_sure_you_want_to_delete_this_item') }}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="btn-cancel" text @click="closeDelete">
            {{ $t('button.no') }}
          </v-btn>
          <v-btn class="btn-save" @click="deleteItem(editedItem)">
            {{ $t('button.delete') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
      </v-card>
    </v-dialog>

      <connect-to-object-modal
          v-if="is_connect"
          :isconnect="true"
          :editedItem="editedItem"
          ref="connectToObject"
          :connect-to-object-table-data="connectToObject"
          :tableData="connectToObject"
          :connect-to-array-input="connectToObject"
          :connect-to-object-table-header="connectToObjectTableHeaders"
          :connectToObjectObject="object"
          :connectToObjectCategory="category"
          :class="connectToObjectTableProp.length <= 0 ? '' : 'cto-modal'"
          @addConnectToObject="addConnectToObject"
          @deleteCto="deleteCTOData"
          :openPopup="is_connect"
          @getConnectToArray="getConnectToArray"
          @closePopup="is_connect = false"
      ></connect-to-object-modal>

        <goal-review-popup
                v-if="objectEditItem.type == 'goal'"
                :open-popup="isObjectOpen" 
                :object-item="objectEditItem"
                @closePopup="isObjectOpen = !isObjectOpen"
                :view-popup="isOnlyView"
        ></goal-review-popup>

        <TaskReviewPopup  
                v-if="objectEditItem.type == 'task'"
                :open-popup="isObjectOpen"
                :object-item="objectEditItem"
                @closePopup="isObjectOpen = !isObjectOpen" 
                :view-popup="isOnlyView"
        ></TaskReviewPopup>

        <ReviewRoutinePopup 
                v-if="objectEditItem.type == 'routine'"
                :open-popup="isObjectOpen"
                :document-item="objectEditItem"
                @closePopup="isObjectOpen = !isObjectOpen" 
                :view-popup="isOnlyView"
        ></ReviewRoutinePopup>

        <InstructionReviewPopup 
                v-if="objectEditItem.type == 'instruction'"
                :open-popup="isObjectOpen"
                :object-item="objectEditItem"
                @closePopup="isObjectOpen = !isObjectOpen"
                :view-popup="isOnlyView"
        ></InstructionReviewPopup>

        <RiskAnalysisReviewPopup 
                v-if="objectEditItem.type == 'risk'"
                :open-popup="isObjectOpen"
                :object-item="objectEditItem"
                @closePopup="isObjectOpen = !isObjectOpen" 
                :view-popup="isOnlyView"
        ></RiskAnalysisReviewPopup>

        <EditChecklistPopup 
                v-if="objectEditItem.type == 'checklist'"
                :open-popup="isObjectOpen" 
                :document-item="objectEditItem"
                @closePopup="isObjectOpen = !isObjectOpen" 
                :view-popup="isOnlyView"
        ></EditChecklistPopup>

        <ReviewDeviation 
                v-if="objectEditItem.type == 'deviation'"
                :open-popup="isObjectOpen"
                :deviation-item="objectEditItem"
                @closePopup="isObjectOpen = !isObjectOpen" 
                :view-popup="isOnlyView"
        ></ReviewDeviation>
      
    <report-checklist :open-popup="checkAddReportClick"
    :document-item="editedItem"
    :topicArray="topicArray"
    :answerArray="answerArray"
    :newReportData="newReportData"
    :predefined-link-array="predefinedLinkArray"
    :responsible-name="responsibleName"
    :custError="custError"
    :queTopicID="queTopicID"
    :queID="queID"
    @closePopup="checkAddReportClick = !checkAddReportClick"
    @createReport="createReport"
    :titleMessage="$t('title.report_checklist')"/>

    <checklist-popup
      :open-popup="checkShowItem"
      :checklistItem="editedItem"
      :industry-array="industryArray"
      :resource="false"
      :view-only="viewOnly"
      :categories-array="categoriesArray"
      :job-title-array="jobTitleArray"
      :departments-array="departmentsArray"
      :predefined-link-array="predefinedLinkArray"
      @closePopup="checkShowItem = !checkShowItem"
      @reloadList="reloadList"
      @reloadListCategory="reloadListCategory"
      :checkApplyItem="checkApplyItem"
      @resourceList="resourceList"
      @changeTab="changeTab"
    />
  </div>


</template>

<script>
import { _ } from 'vue-underscore'
import api from '~/apis'
import cookies from 'js-cookie'
import FroalaSuggestionListEditor from './FroalaSuggestionListEditor'
import CategoryInReviewPopup from './CategoryInReviewPopup'
import ResponsibleEditInReviewPopup from './ResponsibleEditInReviewPopup'
import AddTable from './AddTable.vue'
import ReportChecklist from './ReportChecklist.vue'
import ConnectToObjectModal from './ConnectToObjectModal.vue'
import ChecklistPopup from './ChecklistPopup.vue'
import { removeTagsFromString } from './common/js/functions'
import moment from 'moment';

export default {
  components: {
    category: CategoryInReviewPopup,
    ResponsibleEdit: ResponsibleEditInReviewPopup,
    FroalaSuggestionListEditor,
    ConnectToObjectModal,
    AddTable,
    ReportChecklist,
    ChecklistPopup,
    GoalReviewPopup: () => import('./GoalReviewPopup.vue'),
    TaskReviewPopup: () => import('./TaskReviewPopup.vue'),
    ReviewRoutinePopup: () => import('./ReviewRoutinePopup.vue'),
    RiskAnalysisReviewPopup: () => import('./RiskAnalysisReviewPopup.vue'),
    ReviewDeviation: () => import('./ReviewDeviation.vue'),
    EditChecklistPopup: () => import('./EditChecklistPopup.vue'),
    InstructionReviewPopup: () => import('./InstructionReviewPopup.vue'),
  },
  name:'EditChecklistPopup',
  props: {
    resource: {
      type: Boolean,
      required: false,
    },
     editResponsible: {
      type: Boolean,
      required: false,
    },
    documentItem: {
      type: Object,
      required: false,
    },
    viewPopup: {
        type: Boolean,
        required: false,
    },
    openPopup: {
      type: Boolean,
      required: false,
      default: false
    },
    categoriesArray: {
      type: Array,
      required: false
    },
    type: {
      type: String,
      required: false,
    },
    predefinedLinkArray: {
      type: Array,
      required: false
    },
    titleMessage: {
      type: String,
      required: false,
    },
     jobTitleArray: {
        type: Array,
        required: false
      },
      departmentsArray: {
        type: Array,
        required: false
      },
      listAnswerArray: Array,
      viewOnly: {
        type: Boolean,
        required: false,
      },
       industryArray: {
        type: Array,
        required: false,
      },
  },
  data: () => ({
    isObjectOpen: false,
    isOnlyView : false,
    objectEditItem : {},
    checkAddReportClick:false,
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
    checkShowItem:false,
    isEdit: false,
    is_connect: false,
    checklist_history: false,
    checkCreator: false,
    checkManager: false,
    checkWorker: false,
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
    checkResponsiblePersone:false,
    dialogDelete:false,
    connectToArray: [],
    expanded: [],
    connectToObjectFrom: { document_id: '', connectToArray: [], object_id: '' },
    status: -1,
    tableIcon:'fillSecurity',
    checklist_used:'',
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
      categoryName: '',
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
      topics:[],
      source_id:'',
      connectToArray:[],
      option_slide:false,
      ctoFunction: [
          { id: 'Task', name: 'task' },
          { id: 'Goal', name: 'goal' },
          { id: 'Routine', name: 'routine' },
          { id: 'Instruction', name: 'instruction' },
          { id: 'Risk element source', name: 'risk' },
          { id: 'Checklist', name: 'checklist' },
          { id: 'Attachment', name: 'attachment' },
          { id: 'Document', name: 'document' },
          { id: 'Contact', name: 'contact' },
          { id: 'Deviation', name: 'deviation' },
      ],
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
      categoryName: '',
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
       topics:[],
       source_id:'',
       connectToArray:[],
       option_slide:false,
      // hover: false,
      // hoverQuestionMark: false
    },
    required: [
      (v) => {
        if (!v || v.length < 1) return 'This is required'
        else return true
      },
    ],
    attachmentType: false,
    // formTitle: '',
    editMode: true,
    categoriesValidArray: [],
    checkResource: false,
    dialogRelatedObjects: false,
    checkShowConnectTo: true,
    isAddNewCheckpoint: false,
    is_duration: false,
    company_id:'',
    duration: 1,
    config: {
      events: {
        //
      },
    },
    selectedItem:"",
    topicArray: [],
    currentIndex:0,
    answerArray: [],
    checkApplyItem:false,
      newAnswer: {
        topic_id: "",
        question_id: "",
        answer: "",
        description: "",
        action: "",
        task_id: "",
        risk_id: "",
      },
      defaultAnswer: {
        topic_id: "",
        question_id: "",
        answer: "",
        description: "",
        action: "",
        task_id: "",
        risk_id: "",
      },
      newReportData: {
        checklist: "",
        status: 1,
        department: "",
        job_title: '',
        answers: [],
        company_id:''
      },
      defaultReportData: {
        checklist: "",
        status: 1,
        department: "",
        job_title: '',
        answers: [],
      },
      custError:false,
      queTopicID:'',
      queID:''

  }),

  computed: {
    headers() {
      return [
        {
          text: 'Checkpoint Name',
          align: 'start',
          sortable: false,
          value: 'checkName',
          width:'25%'
        },
        { text: 'Option Name', value: 'options', align: 'center' , width:'35%' },
        { text: 'Comment', value: 'comment', align: 'center' },
        { text: 'Image', value: 'image', align: 'center' },
      ]
    },
    checklistHeader() {
      return [
        {
          text: this.translateCol('name'),
          align: 'left',
          value: 'name',
          width: '15%',
        },
        {
          text: this.translateCol('reported_by'),
          value: 'added_by_name',
          align: 'center',
        },
        {
          text: this.translateCol('responsible'),
          value: 'responsible',
          align: 'center',
        },
        {
          text: this.translateCol('category'),
          align: 'center',
          value: 'category_name',
        },
        {
          text: this.translateCol('revised'),
          value: 'updated_at',
          align: 'center',
          sortDesc: false,
        },
        {
          text: this.translateCol('topic_checkpoints'),
          align: 'center',
          value: 'topic_points',
        },
        {
          text: this.translateCol('used'),
          align: 'center',
          value: 'count_topic',
        },
        {
          text: this.translateCol('security'),
          value: 'is_security',
          align: 'center',
        },
      ]
    },
    connectToObjectTableHeaders () {
      return [
          { text: this.translateCol('name'), value: 'objectName' },
          { text: this.translateCol('source'), value: 'connect_to_source' },
          { text: this.translateCol('category'), value: 'categoryName' },
          { text: this.translateCol('added_by'), value: 'addedByUser' },
          { text: this.translateCol('connected_by'), value: 'connectedByUser' },
          { text: this.translateCol('connected_date'), value: 'created_at' },
          { text: this.translateCol('actions'), value: 'actions', align: 'center', sortable: false },
      ];
    },
  },

  watch: {
    openPopup(value) {
      if (value) {
        if (this.documentItem) {
          let categoryId = this.documentItem?.category_id
          this.categoriesValidArray = _.filter(
            this.categoriesArray,
            function (item) {
              return (
                !item?.disable_status ||
                (item?.disable_status && item?.id === categoryId)
              )
            }
          )
          this.editItem(this.documentItem)
        } else {
          this.categoriesValidArray = _.filter(
            this.categoriesArray,
            function (item) {
              return !item?.disable_status
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
        if(value=='')
        this.topicArray.push({name: "",questions:[{name:"",default_option_id:"",option_answers:""}]})
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
        this.showItem(this.documentItem)
      } else {
        this.addNew()
      }
    }

    if (this.resource) {
      this.checkResource = this.resource
    }

    this.checklistArray = [
      { name: 'Make eveyone happy 1', added_by_name:'Company Admin' , responsible:'IT-Manager' , category_name:'Category' , updated_at:'18.09.2022' , topic_points:'1/2' , count_topic:'2' },
      { name: 'Make eveyone happy 1', added_by_name:'Company Admin' , responsible:'IT-Manager' , category_name:'Category' , updated_at:'18.09.2022' , topic_points:'1/2' , count_topic:'2' },
      { name: 'Make eveyone happy 1', added_by_name:'Company Admin' , responsible:'IT-Manager' , category_name:'Category' , updated_at:'18.09.2022' , topic_points:'1/2' , count_topic:'2' },
    ]
  },

  methods: {

    handleObjectOpen(item) {
      this.objectEditItem = {
        'id':item.source_id,
        'type': item.connect_to_source,
      };
      this.isObjectOpen = true;
      this.isOnlyView = true;
      },

      getConnectToArray (data) {
          this.connectToObject = [...data];
      },
      async addConnectToObject(payload) {
         this.connectToArray = payload
         this.resetConnectToObjectFrom()
         this.connectToObjectFrom.connectToArray.push(payload.connectToArray)
         this.connectToObjectFrom.object_id = payload.object_id
         await this.getObject(this.editedItem)
      },
    showItem(item) {
        this.editNewPopupItem(item);
      },
      editNewPopupItem(item){
        this.templateItem = Object.assign({}, item);
        this.editCheckList = true;
        this.editResponsible = item?.checklist_used > 0 ? true : false
        this.checkResource=this.checkResource?true:false
      },
    changeTab(value) {
      this.$emit('changeTab', value)
    },
    reminderClose() {
      this.revised = false
    },
    translateCol(colName) {
      return this.$i18n.t('column.' + colName)
    },
    getNewCategory(value) {
      this.editedItem.category_id = value?.newCategoryId
    },
    checkItem() {
      this.revised = true
      this.checklist_history = false
    },
    onHistoryAction(){
      this.checklist_history = !this.checklist_history
    },
     closeDelete() {
        this.dialogDelete = false;
      },
       deleteItem(item) {
        this.deleteChecklist(item);
        this.dialogDelete = false;
        this.close();
      },
      deleteCTOData(id) {
        // console.log(id);
        let that = this
        try {
          api.connectToObject.delete(id).then((res) => {
            console.log(res)
            that.$toaster.success('connect to object data deleted')
            that.getObject(this.editedItem)
            if (that.documentItem) {
              that.fetchConnectToObjectById(that.documentItem.id)
              that.editItem(that.documentItem)
            }
          })
        } catch (error) {
          that.$toaster.error('connect to object data not deleted')
          console.log(error)
        }
        // this.$emit('deleteCto', id)
      },

      deleteChecklist(item) {
        let that = this;
        if (that.resource) {
          
          that.$store.dispatch('checklists/delete', item.id).then(function () {
            that.$emit('resourceList');
            that.$toaster.success(that.$i18n.t('message.success_checklist_delete'));
          }).catch((error) => {
            if (error?.response?.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_checklist_delete'));
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            // that.$nuxt.$loading.finish();
          }
          });
        }else if (!that.resource){
          that.$store.dispatch('objects/delete', item.id).then(function () {
            that.reloadList();
            that.$toaster.success(that.$i18n.t('message.success_checklist_delete'));
          }).catch((error) => {
            if (error?.response?.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{

            that.$toaster.error(that.$i18n.t('message.fail_checklist_delete'));
          }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            // that.$nuxt.$loading.finish();
          });
        }
      },
    addNew() {
      this.reset()
      this.topicArray.push({name: "",questions:[{name:"",default_option_id:"",option_answers:""}]})
      let defaultCategory = _.findWhere(this.categoriesValidArray, {
        is_primary: 1,
      })
      if (defaultCategory) {
        this.editedItem.category_id = defaultCategory?.id
      }
      // if (this.checkResource) {
      //   this.formTitle = this.$i18n.t('title.new_document_resource')
      // } else {
      //   this.formTitle = this.$i18n.t('title.new_document')
      // }
      this.checkShowConnectTo = !this.checkResource;
        this.editMode = false;

      this.editMode = false
      this.selectedFile = []
      this.attachmentType = false

      // list checklist Default OPTIONS list
        this.$store.dispatch('options/index', {isNewChecklist: true}).then(result => {
          this.answerArray = _.sortBy(result?.data, function(answer) {
            return answer.count_used_time;
          });
          this.formatNameOfDefaultOptionType(this.answerArray.reverse());
          this.$nuxt.$loading.finish();
        }).catch((error) => {
          if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          this.$toaster.error(this.$i18n.t('message.fail_checklist_option_view'));
          }
          // this.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          this.$nuxt.$loading.finish();
        });
    },
    // getStartDate(payload){
    //   console.log(payload);
    // },
    formatNullArray(item) {
      if (item === null) {
        item = []
      }
      return item
    },

    formatFromStringToArray(data) {
      let result
      if (data) {
        result = data.split(',')
        result = _.map(result, function (item) {
          return parseInt(item)
        })
      } else {
        result = data
      }
      return result
    },
    async getObject(item) {
      this.connectToObject = []
      // await api.documents
      //   .connectRoutine(item.id)
      //   .then((result) => {
      //     let respo = result.data.data
      //     if (respo.length > 0) {
      //       respo.forEach((el) => {
      //         this.connectToObject.push({
      //           id: el?.id,
      //           name: el?.objectName,
      //           source: el?.connect_to_source,
      //           category: el?.categoryName,
      //           added: el?.addedByUser,
      //           connectedBy: el?.connectedByUser,
      //           connected_date: el?.created_at,
      //         })
      //       })
      //     } else {
      //       this.connectToObject = []
      //     }
      //   })
      //   .catch((error) => {
      //     console.log(error)
      //   })
        
        await this.$store.dispatch('connectToObject/getByObject', { objectID: item.id, type: 'checklist', })
        .then((result) => {
          let respo = result.data;
          if (respo.length > 0) {
              respo.forEach((el) => {
                  this.connectToObject.push({
                      connect_to_source: el.connect_to_source,
                      objectName: el.objectName || 'N/A',
                      categoryName: el.categoryName || 'N/A',
                      addedByUser: el?.addedByUser || 'N/A',
                      connectedByUser: el.connectedByUser || 'N/A',
                      created_at: moment(el.connected_date).format('DD.MM.YYYY'),
                      categoryID: el.categoryID,
                      source_id: el.source_id,
                      id: el.id,
                  });
              });
          } else {
              this.connectToObject = [];
          }
        }).catch((error) => {
                      console.log(error);
                  });
    },
    editChecklist(){
      this.checkAddReportClick=true
      this.close()
    },

    editItem(item) {
      let that = this
      that.editedItem = Object.assign({}, item)
      
      that.editedItem.duration = 1
      that.editedItem.is_duration = false
      that.checklist_used=item.checklist_used
      that.connected_to_task = []
      that.editedItem.topic=that.topicArray 
      that.editedItem.defaultOptions = that.checkListDefaultOptionForNewChecklist(that.answerArray, that.topicArray);
      // that.formTitle = that.$i18n.t('title.edit_document')
      that.formDirty = false
      that.getObject(item)
      // that.$store.dispatch('checklists/show', item.id).then(result => {
        if (that.resource) {
          that.$nuxt.$loading.start();
          that.$store.dispatch('checklists/show', item.id).then(result => {
            
          that.editedItem = Object.assign({}, result.data);
          that.editedItem.description = that.editedItem.description && removeTagsFromString(that.editedItem.description); 
          that.responsibleName = result.data.employeeName && result.data.employee_names;
          if (that.checkSuperAdmin) {
            that.editedItem.industry_id_arr = that.formatNullArray(that.formatFromStringToArray(that.editedItem.industry_id));
          }
          // if (that.editedItem.responsible_department_array === null) {
          //   that.editedItem.responsible_department_array = [];
          // } else {

          //   that.editedItem.responsible_department_array = JSON.parse(that.editedItem.responsible_department_array);
          // }
          // if (that.editedItem.responsible_employee_array === null) {

          //   that.editedItem.responsible_employee_array = [];
          // } else {

            // that.editedItem.responsible_employee_array = JSON.parse(that.editedItem.responsible_employee_array);
          // that.editedItem.responsible_employee_array = JSON.parse(that.editedItem.responsible['employee_array']);
          // }
          // that.editedItem.responsible_employee_array=JSON.parse(that.editedItem?.responsible?.employee_array || "[]");

          // list topics
          that.$store.dispatch('topics/index', {checklist: that.editedItem.id}).then(topic => {
            that.topicArray = topic.data;
            _.each(that.topicArray, function (topicItem) {
              if (topicItem.questions.length > 0) {
                that.isAddNewCheckpoint = true;
              }
              _.each(topicItem.questions, function (question) {
                that.options=question.default_option_id
                question.checklist_required_attachment = question.required_attachment== "1" || question.required_attachment== 1? 1 : 0
                question.checklist_required_comment = question.required_comment==1 ? 1 :0
      //           question.required_comment = that.editedItem.use_checklist_required_comment
                // _.each(question.option_answers , function (a,b){
                //    return (a.arrangement_order - b.arrangement_order);
                // })
                question.option_answers.sort(function (a, b) {
                  return (a.arrangement_order - b.arrangement_order);
                });
              });
            });
            that.$nuxt.$loading.finish();
          }).catch(() => {
            that.$toaster.error(that.$i18n.t('message.fail_checklist_topic_view'));
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish();
          });
          that.newReportData.checklist = that.editedItem.id;

          // list checklist options
          // that.$store.dispatch('options/index', {checklistID: that.editedItem.id}).then(option => {
          //   that.answerArray = _.sortBy(option.data, function(answer) {
          //     return answer.count_used_time;
          //   });

          //   that.formatNameOfDefaultOptionType(that.answerArray.reverse());
          // }).catch(() => {
          //   that.$toaster.error(that.$i18n.t('message.fail_checklist_option_view'));
          //   // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          //   that.$nuxt.$loading.finish();
          // });
                
        }).catch((error) => {
          if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_checklist_view_detail'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
        that.originData = _.clone(that.editedItem);
        }
        if (!that.resource) {
          that.$nuxt.$loading.start();
          that.$store.dispatch('objects/show', item.id).then(result => {

            if (result.data?.responsible?.employeeRole?.includes(that.userID) ) {
              that.checkResponsiblePersone=true
            } else {
              that.checkResponsiblePersone=false
            }

            that.editedItem = Object.assign({}, result.data);
            that.editedItem.responsible_employee_array=JSON.parse(result?.data?.responsible?.employee_array);
            that.editedItem.type="checklist"
            that.responsibleName = result.data.responsible.employeeName;
            that.editedItem.description = that.editedItem.description && removeTagsFromString(that.editedItem.description); 
            
    
            // if (that.checkSuperAdmin) {
            //   that.editedItem.industry_id_arr = that.formatNullArray(that.formatFromStringToArray(that.editedItem.industry_id));
            // // }
            // if (that.editedItem.responsible_department_array === null) {
            //   that.editedItem.responsible_department_array = [];
            // } else {
  
            //   that.editedItem.responsible_department_array = JSON.parse(that.editedItem.responsible_department_array);
            // }
            // if (that.editedItem.responsible_employee_array === null) {
  
            //   that.editedItem.responsible_employee_array = [];
            // } else {
  
            //   that.editedItem.responsible_employee_array = JSON.parse(that.editedItem.responsible_employee_array);
            // }
          // that.editedItem.responsible_employee_array = JSON.parse(that.editedItem.responsible.employee_array || "[]");
          // that.editedItem.responsible_department_array = JSON.parse(that.editedItem.responsible['department_array']);
            // list topics
            that.$store.dispatch('topics/index', {checklist: that.editedItem.source_id}).then(function () {
              that.topicArray = that.editedItem.topic;
              _.each(that.topicArray, function (topicItem) {
                if (topicItem.questions.length > 0) {
                  that.isAddNewCheckpoint = true;
                }
                _.each(topicItem.questions, function (question) {
                that.options=question.default_option_id
                 question.checklist_required_attachment = question.required_attachment== "1" || question.required_attachment== 1? 1 : 0
                question.checklist_required_comment = question.required_comment==1 ? 1 :0
                question.option_answers.sort(function (a, b) {
                  return (a.arrangement_order - b.arrangement_order);

                });
              });
              });
              that.$nuxt.$loading.finish();
            }).catch((error) => {
              if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_checklist_topic_view'));
          }
              // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
              that.$nuxt.$loading.finish();
            });
            that.newReportData.checklist = that.editedItem.source_id;
  
            // list checklist options
            that.$store.dispatch('options/index', {checklistID: that.editedItem.source_id}).then(option => {
              that.answerArray = _.sortBy(option.data, function(answer) {
                return answer.count_used_time;
              });
  
              that.formatNameOfDefaultOptionType(that.answerArray.reverse());
            }).catch((error) => {
              if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_checklist_option_view'));
          }
              // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
              that.$nuxt.$loading.finish();
            });

                  
          }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_checklist_view_detail'));
          }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish();
          });
        }
        that.originData = _.clone(that.editedItem);
      },

       // show list option with format name 'NAME - Slider / Dropdown'
      formatNameOfDefaultOptionType(list) {
        _.each(list, function (option) {
          if (option.type_of_option_answer === 1) {
            option.option_name = option.name + ' - Slider';
          } else {
            option.option_name = option.name + ' - Dropdown';
          }
        });
        return list;
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
        this.newReportData = Object.assign({}, this.defaultReportData);
          this.newAnswer = Object.assign({}, this.defaultAnswer);
      }, 300)
    },
    
    save() {
      // update
      let that = this
      that.$nuxt.$loading.start()
      that.editedItem.status = 'new'
      that.editedItem.responsible_id = ''
      that.editedItem.parent_id = ''
      that.editedItem.is_template = false
      that.editedItem.object_id = ''
      that.editedItem.connectToArray = that.connectToArray
      that.editedItem.is_shared=false
      that.editedItem.is_public=false
      that.editedItem.job_title_id=""
      that.editedItem.topics = that.topicArray
      that.editedItem.isDefaultResponsible=false;
      that.editedItem.isDefaultAttendee=false;
      that.editedItem.requestEdit=true
      that.editedItem.connectToArray = this.connectToObject
      that.editedItem.defaultOptions = that.checkListDefaultOptionForNewChecklist(that.answerArray, that.topicArray);
      that.editedItem.defaultOptions = '';
      that.editedItem.start_time = "";
      that.editedItem.end_time = "";
      // that.editedItem.responsible_employee_array = "";
            // edit Checklist
              // that.$store.dispatch('checklists/update', that.editedItem).then(function(){
                // that.responsible.department_array=""
                if (!that.resource) {
                that.$nuxt.$loading.start()
                that.$store.dispatch('objects/update',that.editedItem).then(function() {
                that.reloadList();
                that.reloadListCategory();
                // that.reloadAnswerOptionsList();
                that.$toaster.success(that.$i18n.t('message.success_checklist_update'));
              }).catch((error) => {
                if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
                that.$toaster.error(that.$i18n.t('message.fail_checklist_update'));
          }
                // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
              });
                that.$nuxt.$loading.finish();
                }

                if (that.resource) {
                  that.editedItem.start_date=''
                  that.editedItem.deadline=''
                  that.editedItem.type="checklist"
                  that.editedItem.is_template=true
                  that.editedItem.requestEdit=true
                  that.$nuxt.$loading.start()
                that.$store.dispatch('checklists/update',that.editedItem).then(function() {
                that.$emit('resourceList');
                that.reloadList();
                that.reloadListCategory();
                // that.reloadAnswerOptionsList();
                that.$toaster.success(that.$i18n.t('message.success_checklist_update'));
              }).catch((error) => {
                if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
                that.$toaster.error(that.$i18n.t('message.fail_checklist_update'));
          }
                // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
              });
                that.$nuxt.$loading.finish();
                }

      that.close()
    },

     apply() {
      // update
      let that = this
      that.$nuxt.$loading.start()
      that.checkShowItem = true
      that.checkApplyItem = true
      // // delete that.editedItem["default_options"]
      // delete that.editedItem["topic"]

   

      that.close()
    },
      async checkNewReportDataBeforeSave() {
        let that = this;
          // let formData = new FormData();
        that.newReportData.answers=[]
        _.each(that.topicArray, function (topic) {
          _.each(topic.questions, async function  (question,index) {
            // formData.append('file', question?.selectedFile);
            // _.each(question.option_answers, function (answer){
              that.newReportData.answers.push({
                  topic_id:question.topic_id, 
              question_id:question.id,
              answer:question?.default_option_id,
              description:question.description,
              action:"",
              task_id:"",
              risk_id:"",
              answer_name:question.option_name,
              file:question?.selectedFile ? await that.getBase64(question?.selectedFile) : "",
              
              });
            if (topic.questions.length-1 == index) {
                return true;
            }
          });
        });
      },
      reloadList() {
        this.$emit('reloadList');
      },
      resourceList() {
        this.$emit('resourceList');
      },

      reloadListCategory(){
        this.$emit('reloadListCategory');
      },
    // async createReport(option){
    //   let that = this
    //   console.log("option.length",option.length);
    //   if (that.editMode) {
    //         if ((that.checkAdmin || that.permissionsUser.indexOf('report checklist-basic') > -1)){
    //           // create report
        
    //           // let load =  await that.checkNewReportDataBeforeSave();
    //           that.newReportData.department = '';
    //           that.newReportData.job_title = '';
    //           that.newReportData.added_by = that.userID;
    //           that.newReportData.company_id = 1;
    //             that.newBlank=[];
    //              that.newReportData.answers=[]
    //                   _.each(that.topicArray, async function (topic, index) {
    //                     _.each(topic.questions, async function  (question , innerIndex) {
    //                       if (option.length > 0) {
    //                         let questionMatch = false; // Track if a match is found for the current question
            
    //                         _.each(option, async function(item, optionIndex) {
    //                           let file = "";
    //                           if (question.selectedFile) {
    //                             // console.log("question.selectedFile",question.selectedFile);
    //                             file = await that.getBase64(question?.selectedFile);
    //                           }
    //                           // console.log("file",file);
                              
    //                           if (item.question_id == question.id && JSON.stringify(question.id).includes(item.question_id)) {
    //                             questionMatch = true; // Set questionMatch to true if a match is found
                                
    //                             that.newBlank.push({
    //                               topic_id: question.topic_id,
    //                               question_id: question.id,
    //                               answer: item.id,
    //                               description: question.description,
    //                               action: 'close',
    //                               task_id: "",
    //                               risk_id: "",
    //                               answer_name: item.name,
    //                               file: file,
    //                             });
    //                           }
    //                                           // If no match is found for the current item, push a null object
    //                           if (!questionMatch && option.length - 1 == optionIndex) {
    //                             that.newBlank.push({
    //                               topic_id:question.topic_id, 
    //                               question_id:question.id,
    //                               answer:question?.option_answers[0].id,
    //                               description:question.description,
    //                               action:'close',
    //                               task_id:"",
    //                               risk_id:"",
    //                               answer_name:question?.option_answers[0].name,
    //                               file:file,
    //                             });
    //                           }
    //                           // console.log("that.newBlank1",that.newBlank);
    //                           console.log("that.newBlank.lenght",that.newBlank.length);
    //                         if (that.topicArray.length -1 == index && topic.questions.length - 1 == innerIndex && option.length - 1 == optionIndex) {
    //                           console.log("that.newBlank ----in if",that.newBlank);
    //                           console.log("that.newBlank.lenght ----in if",that.newBlank.length);
    //                           // if (that.newBlank.length === (that.topicArray.length*topic.questions.length) && that.topicArray.length -1 == index && topic.questions.length - 1 == innerIndex)
    //                           that.newReportData.answers=that.newBlank;
    //                           // console.log("that.newReportData.answers",that.newReportData.answers);
    //                           // console.log("that.newReportData.answers",that.newReportData);
                              
    //                           that.$nuxt.$loading.start()
    //                             that.$store.dispatch('reports/store', that.newReportData).then(function () {
    //                             that.reloadList();
    //                             // that.reloadListCategory();
    //                             // that.reloadAnswerOptionsList();
    //                             that.$toaster.success(that.$i18n.t('message.success_checklist_report_add_new'));
    //                             that.$nuxt.$loading.finish();
    //                           }).catch(() => {
    //                             that.$toaster.error(that.$i18n.t('message.fail_checklist_report_add_new'));
    //                             // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
    //                             that.$nuxt.$loading.finish();
    //                           });
    //                         }
    //                       });
    //                       }
    //                       else if (option.length == 0){
                            
    //                         // _.each(question.option_answers, async function  (option) {
    //                           // console.log(option);
    //                           let file="";
    //                             if (question.selectedFile) {
    //                               file = await that.getBase64(question?.selectedFile)
    //                             }
                                  
    //                               that.newBlank.push({
    //                                 topic_id:question.topic_id, 
    //                                 question_id:question.id,
    //                                 answer:question?.option_answers[0].id,
    //                                 description:question.description,
    //                                 action:'close',
    //                                 task_id:"",
    //                                 risk_id:"",
    //                                 answer_name:question?.option_answers[0].name,
    //                                 file:file,
    //                             });
    //                           if (that.topicArray.length-1 == index && topic.questions.length-1==innerIndex) {
    //                             that.newReportData.answers=that.newBlank;
    //                             console.log("that.newReportData.answers",that.newReportData.answers);
    //                             // that.$nuxt.$loading.start();
    //                               that.$store.dispatch('reports/store', that.newReportData).then(function () {
    //                               that.reloadList();
    //                               // that.reloadListCategory();
    //                               // that.reloadAnswerOptionsList();
    //                               that.$toaster.success(that.$i18n.t('message.success_checklist_report_add_new'));
    //                               that.$nuxt.$loading.finish();
    //                             }).catch(() => {
    //                               that.$toaster.error(that.$i18n.t('message.fail_checklist_report_add_new'));
    //                               // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
    //                               that.$nuxt.$loading.finish();
    //                             });
    //                           }
    //                         // })
    //                       }
    //                 });
    //                 });
    //           // }
    //         } 
    //       }
      
    //   that.close()
    // },

      async createReport(option) {
        let that = this;
        console.log("option.length", option.length);
        let error_flag= false;
        if (that.editMode) {
          if (that.checkAdmin || that.permissionsUser.indexOf('report checklist-basic') > -1) {
            // create report
            that.newReportData.department = '';
            that.newReportData.job_title = '';
            that.newReportData.added_by = that.userID;
            that.newReportData.company_id = 1;
            that.newBlank = [];
            that.newReportData.answers = [];
            
            for (const topic of that.topicArray) {
              for (const question of topic.questions) {
                let file = '';
                if (question.selectedFile) {
                  file = await that.getBase64(question?.selectedFile);
                }
                
                let questionMatch = false;
                if((question.checklist_required_comment && question.description == null) || (question.checklist_required_attachment && file == '')){
                  error_flag =true;
                  this.custError = true;
                  this.queTopicID =  question.topic_id
                  this.queID =  question.id
                  this.$toaster.error('Image or feedback is mandatory to upload.');
                  return;
                }
                for (const item of option) {
                  if (item.question_id == question.id && JSON.stringify(question.id).includes(item.question_id)) {
                    questionMatch = true;
                    
                    that.newBlank.push({
                      topic_id: question.topic_id,
                      question_id: question.id,
                      answer: item.id,
                      description: question.description,
                      action: 'close',
                      task_id: "",
                      risk_id: "",
                      answer_name: item.name,
                      file: file,
                    });
                  }
                }
                
                if (!questionMatch) {
                  that.newBlank.push({
                    topic_id: question.topic_id,
                    question_id: question.id,
                    answer: question?.option_answers[0].id,
                    description: question.description,
                    action: 'close',
                    task_id: "",
                    risk_id: "",
                    answer_name: question?.option_answers[0].name,
                    file: file,
                  });
                }
              }
            }
            
            that.newReportData.answers = that.newBlank;
            
            console.log("that.newReportData.answers", that.newReportData.answers);
            
            try {
              that.$nuxt.$loading.start();
              if(!error_flag)
              {
                await that.$store.dispatch('reports/store', that.newReportData);
                that.reloadList();
                that.$toaster.success(that.$i18n.t('message.success_checklist_report_add_new'));
                that.$nuxt.$loading.finish();
              }
            } catch (error) {
                if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
              }else{
                that.$toaster.error(that.$i18n.t('message.fail_checklist_report_add_new'));
              }
              that.$nuxt.$loading.finish();
            }
            that.custError = false
            that.checkAddReportClick = false
            that.close();
          }
        }

      },
    formatMultipleFormData(list, report) {
        let that = this;
        // let listFiles = [];
        let formData = new FormData();
        formData.append('type', that.document_type);
        formData.append('object_type', that.document_added_from);
        formData.append('object_id', report.data.id);
        // formData.append('added_from', that.document_added_from);
        formData.append('is_public', 1);
        formData.append('is_shared', 1);
        formData.append('status', 1); // 1: publish
        // save report attachment
        formData.append('name', 'Report_' + report.data.id);
        // formData.append('report_id', report.data.id);
        _.each(list, function (item) {
          formData.append('file[' + item.question_id + ']', item.picture);
        });
        return formData;
      },

    checkListDefaultOptionForNewChecklist(listOption, listTopic) {
        let optionItem = null;
        let defaultOptionsList = [];
        _.each(listTopic, function (item) {
          if (item.questions.length > 0) {
            _.each(item.questions, function (question) {
              optionItem = _.findWhere(listOption, { id: question.default_option_id });
              if (optionItem) {
                defaultOptionsList.push(optionItem);
              }
            });
          }
        });
        return defaultOptionsList;
      },
    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    },
    draft() {
      this.editedItem.status = 0
      this.save()
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
  line-height: 25px;
  color: #fff;
}

.checklist-popup .review-popup-table {
  margin-bottom: 40px;
}
:deep(.table-badge .v-badge__wrapper .v-badge__badge) {
  inset: auto auto calc(100% - -5px) calc(100% - 39px) !important;
}
.chip-custom2{
  /* color: #63B76A !important; */
  background: #EAF5EB !important;
}
:deep(.category-item .category-btns){
  margin-top: -18px !important;
}
</style>

<template>
  <div>
    <v-dialog
      v-model="openPopup"
      scrollable
      max-width="1125px"
      persistent
    >
      <v-card>
        <!--        <v-card-title class="text-h5 justify-content-center text-uppercase">-->
        <!--          {{ $t('title.review_risk_analysis') }}-->
        <!--        </v-card-title>-->
        <v-card-text>
          <div class="popup-header text-center">
            {{ $t('title.review_risk_analysis') }}
          </div>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <div class="review-popup">
              <div class="review-popup-table normal-table">
                <!-- Status -->
                <div class="info-block w-50 align-center">
                  <div class="label-item">
                    {{ $t('form.status') }}:
                  </div>
                  <div class="info-item">
                    <status-chip :inReview="true" :inRisk="editedItem.object_id ? false : true" :status="editedItem.status"
                    />
                  </div>
                </div>

                <!-- Function -->
                <div class="info-block w-50 align-center">
                  <div class="label-item">
                    {{ $t('form.function') }}:
                  </div>
                  <div class="info-item">
                    {{ $t('form.risk_analysis') }}
                  </div>
                </div>

                <!-- Name -->
                <div class="info-block w-50">
                  <div class="label-item">
                    {{ $t('form.name') }}:
                  </div>
                  <div
                    v-if="!isEdit"
                    class="info-item"
                    @click="((checkAdmin || checkCreator || checkResponsible) && !isProcess && !inReportData) ? (isEdit = !isEdit) : (isEdit = false)"
                  >
                    {{ editedItem.name }}
                  </div>
                  <div v-else class="input-wrap w-100">
                    <v-text-field
                      v-model="editedItem.name"
                      :rules="required"
                      outlined
                    />
                  </div>
                </div>

                <!-- Category -->
                <div class="info-block w-50">
                  <div class="label-item">
                    {{ $t('form.category') }}:
                  </div>
                  <div
                    v-if="!isEdit"
                    class="info-item"
                    @click="((checkAdmin || checkCreator || checkResponsible) && !isProcess && !inReportData) ? (isEdit = !isEdit) : (isEdit = false)"
                  >
                    {{ editedItem.categoryName }}
                  </div>
                  <div v-else class="w-100">
                    <Category
                      :object-item="editedItem"
                      :type-category="'risk-analysis'"
                      @getNewCategory="getNewCategory"
                    />
                  </div>
                </div>

                <!-- Added by -->
                <div class="info-block w-50">
                  <div class="label-item">
                    {{ $t('form.reported_by') }}:
                  </div>
                  <div class="info-item">
                    {{ editedItem.report_as_anonymous == 1 ? 'Anonymous' : editedItem.addedByName }}
                  </div>
                </div>

                <!-- Responsible -->
                <div class="info-block chip w-50">
                  <div class="label-item">
                    {{ $t('form.responsible') }}:
                  </div>
                  <!-- Creator -->
                  <div v-if="checkCreator">
                    <div
                      v-if="!isEdit"
                      class="info-item"
                      @click="((checkAdmin || checkCreator) && !isProcess && !inReportData) ? (isEdit = !isEdit) : (isEdit = false)"
                    >
                      <v-chip
                        v-for="(item, index) in responsibleName"
                        :key="index"
                        class="mr-2 mb-1 chip-custom"
                        small
                      >
                        {{ item }}
                      </v-chip>
                    </div>
                    <div v-else>
                      <ResponsibleEdit
                        :object-item="editedItem"
                      />
                    </div>
                  </div>
                  <!-- Responsible -->
                  <div v-else>
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
                </div>

                <!-- Description -->
                <div :class="isEdit ? 'info-block' : 'info-block description'">
                  <div class="label-item">
                    {{ $t('form.description') }}:
                  </div>
                  <div
                    v-if="!isEdit"
                    class="info-item"
                    @click="((checkAdmin || checkCreator || checkResponsible) && !isProcess && !inReportData) ? (isEdit = !isEdit) : (isEdit = false)"
                  >
                    {{ editedItem.description }}
                  </div>
                  <div v-else class="input-wrap form-description">
                    <FroalaSuggestionListEditor
                      :item="editedItem"
                    />
                  </div>
                </div>

                <!-- Processed -->
                <div v-if="editedItem.updated_at !== editedItem.created_at" class="info-block w-50">
                  <div class="label-item">
                    {{ $t('form.processed') }}:
                  </div>
                  <div class="info-item">
                    {{ moment(editedItem.updated_at).format('DD.MM.YYYY h:mm A') }}
                  </div>
                </div>

                <!-- Risk done by -->
                <div v-if="editedItem.updated_at !== editedItem.created_at" class="info-block w-50">
                  <div class="label-item">
                    {{ $t('form.risk_done_by') }}:
                  </div>
                  <div class="info-item">
                    {{ editedItem.updated_by_name }}
                  </div>
                </div>
              </div>

              <!-- Risk element  -->
              <div v-if="editedItem.hasRiskElement" class="review-popup-table">
                <v-data-table
                  :headers="headersRiskElement"
                  :items="editedItem.riskElementArray"
                  class="elevation-1 review-table"
                  :items-per-page="15"
                  :single-expand="true"
                  :sort-by="['created_at']"
                  :sort-desc="[true, false]"
                  hide-default-footer
                >
                  <template v-slot:top>
                    <v-toolbar flat>
                      <v-toolbar-title>
                        {{ $t('form.risk_element') }}
                      </v-toolbar-title>
                    </v-toolbar>
                  </template>
                  <template v-slot:item.added_by_name="{ item }">
                    <span>{{ item.firstName }} {{ item.lastName }}</span>
                  </template>
                  <template v-slot:item.view="{ item }">
                    <span v-if="item.is_shared">{{ $t('form.shared') }}</span>
                    <span v-else>{{ $t('form.personal') }}</span>
                  </template>
                  <template v-slot:item.image="{ item }">
                    <!-- <div>
                      <v-icon
                        :class="item.hasImage ? 'icon-custom image' : 'icon-custom image img-gray-scale'"
                        @click="viewImage(item)"
                      >
                        mdi-image
                      </v-icon>
                    </div> -->
                    <div>
                      <img role="button"
                        v-if="item.hasImage"
                        src="../assets/images/icon/image-green.png"
                        @click.stop="viewImage(item)"
                      />
                      <img
                        v-else
                        src="../assets/images/icon/image-gray.png"
                        @click.stop
                      />
                    </div>
                  </template>
                  <template v-slot:no-data>
                    {{ $t('table.no_data') }}
                  </template>
                </v-data-table>
              </div>

              <v-data-table v-if="selectedTopic?.length > 0"
                :headers="reportHeaders"
                :items="selectedTopic"
                :items-per-page="5"
                :single-expand="true"
                    :sort-by="['created_at']"
                    :sort-desc="[true, false]"
                class="elevation-1 review-table review-popup-table px-1 border mt-4"
                hide-default-footer
              >
                <template slot="top">
                  <v-toolbar flat class="align-center">
                    <v-toolbar-title>
                      {{selectedTopic?.[0]?.topic_name}}
                    </v-toolbar-title>
                  </v-toolbar>
                </template>
                <template v-slot:item.checkName="{ item }">
                  {{item?.name}}
                </template>
                <template v-slot:item.comment="{ item,index }">
                    <div>
                      <img src="../assets/images/gridIcon/comment_fill_red.png" alt="" srcset="" v-if="item?.description" @click="showComment(item?.description)"> 
                      <img src="../assets/images/gridIcon/comment.png" alt="" srcset="" v-else>
                    </div>
                </template>
                <template v-slot:item.image="{ item, index }">
                  <img
                    src="../assets/images/icon/image-red.png"
                    v-if="item?.file"
                    @click="showImage(item?.file)"
                  />
                  <img v-else
                    src="../assets/images/icon/image-gray.png"
                    @click.stop
                    />
                </template>
                <template v-slot:item.options="{ item }">
                  {{item?.answer_name}}
                </template>
              </v-data-table>

              <!-- RISK ANALYSIS - source of danger-->
              <!----- View ----->
              <div v-if="!isEditSourceOfDanger || inReportData" class="review-popup-table">
                <v-data-table
                  :headers="computedHeaders"
                  :items="editedItem.source_of_danger"
                  :class="((checkCreator || checkResponsible) && !isProcess) ? 'elevation-1 review-table clickable' : 'elevation-1 review-table'"
                  :items-per-page="15"
                  :single-expand="true"
                  :sort-by="['created_at']"
                  :sort-desc="[true, false]"
                  hide-default-footer
                  @click:row="editSourceOfDanger(false)"
                >
                  <template v-slot:top>
                    <v-toolbar flat>
                      <v-toolbar-title class="component-sub-goal title-manage-task">
                        {{ $t('title.source_of_danger') }}
                        <!-- <v-icon
                          v-if="(checkCreator || checkResponsible) && !isProcess"
                          class="icon-plus-circle ml-2"
                          @click="editSourceOfDanger(true)"
                        >
                          mdi-plus-circle
                        </v-icon> -->
                      </v-toolbar-title>
                    </v-toolbar>
                  </template>
                  <template v-slot:item.type="{ item }">
                    {{ $t('form.report') }}
                  </template>
                  <template v-slot:item.probability="{ item }">
                    {{ translateLevel(item?.probability) }}
                  </template>
                  <template v-slot:item.consequence="{ item }">
                    {{ translateLevel(item?.consequence) }}
                  </template>
                  <template v-slot:item.risk_level="{ item }">
                    <div
                      v-if="item?.risk_level && item?.risk_level >= 1 && item?.risk_level <= 3"
                      class="source-of-danger-color-code color-green d-inline-block"
                    >
                      {{ item?.risk_level }}
                    </div>
                    <div
                      v-if="item?.risk_level && item?.risk_level >= 4 && item?.risk_level <= 10"
                      class="source-of-danger-color-code color-yellow d-inline-block"
                    >
                      {{ item?.risk_level }}
                    </div>
                    <div
                      v-if="item?.risk_level && item?.risk_level >= 11 && item?.risk_level <= 15"
                      class="source-of-danger-color-code color-orange d-inline-block"
                    >
                      {{ item?.risk_level }}
                    </div>
                    <div
                      v-if="item?.risk_level && item?.risk_level === 16"
                      class="source-of-danger-color-code color-red d-inline-block"
                    >
                      {{ item?.risk_level }}
                    </div>
                  </template>
                </v-data-table>
              </div>
              <!----- Add new/ Edit ----->
              <AddNewSourceOfDanger
                v-else
                :object-item="editedItem"
                :edit-mode="true"
                @updateSourceOfDanger="updateSourceOfDanger"
              />

              <!-- Process switch - to create task -->
              <!-- <b-row v-if="checkResponsible && showBtnProcess && !inReportData"> -->
              <b-row v-if="checkResponsible && showBtnProcess && !inReportData">
                <b-col cols="2">
                  <div class="bold-title md-line-height">
                    {{ $t('form.process') }}
                  </div>
                </b-col>
                <b-col cols="4">
                  <div class="switch-component default-question-mark">
                    <label class="left-text">{{ $t('form.none') }}</label>
                    <v-switch
                      v-model="isProcess"
                      :label="$t('form.task')"
                      inset
                      class="right-text"
                      @change="checkProcessRiskAnalysis(isProcess)"
                      :disabled="!!planAccess?.lastPlanAccess?.task || ! planAccess?.planAccess?.task"
                    />
                    <v-hover v-model="hoverTaskPlanAccess">
                      <v-badge
                          :value="hoverTaskPlanAccess" v-if="!!planAccess?.lastPlanAccess?.task || ! planAccess?.planAccess?.task"
                          right
                          transition="slide-x-transition"
                          class="hse--icon-question-circle"
                          style="cursor: pointer;">
                            <span slot="badge" @click="redirectUrl">{{ $t('message.accessible_module') }}</span>
                            <i class="fa fa-question-circle"></i>
                        </v-badge>
                    </v-hover>
                  </div>
                </b-col>
              </b-row>

              <!------ RISK ANALYSIS - Task ------>
              <!-- <div v-if="isProcess" class="review-popup-table">
                <v-data-table
                  :headers="computedHeadersTask"
                  :items="editedItem.subObject"
                  class="elevation-1 review-table review-table-row-cursor-pointer"
                  :items-per-page="15"
                  :single-expand="true"
                  :sort-by="['created_at']"
                  :sort-desc="[true, false]"
                  hide-default-footer
                  @click:row="viewTaskReviewPopup"
                >
                  <template v-slot:top>
                    <v-toolbar flat>
                      <v-toolbar-title>
                        {{ $t('title.task') }}
                      </v-toolbar-title>
                    </v-toolbar>
                  </template>
                  <template v-slot:item.total_attendee="{ item }">
                    {{ item.totalAttendee }}
                  </template>
                  <template v-slot:item.start_date="{ item }">
                    {{ moment(item.start_date).format('DD.MM.YYYY h:mm A') }}
                  </template>
                  <template v-slot:item.deadline="{ item }">
                    {{ moment(item.deadline).format('DD.MM.YYYY h:mm A') }}
                  </template>
                  <template v-slot:item.status="{ item }">
                    <v-chip
                      v-if="item.status === 'new' || item.status == '1'"
                      class="ma-2 status-label-custom pending"
                      label
                    >
                      {{ $t('form.new') }}
                    </v-chip>
                    <v-chip
                      v-else-if="item.status === 'pending'"
                      class="ma-2 status-label-custom pending"
                      label
                    >
                      {{ $t('form.pending') }}
                    </v-chip>
                    <v-chip
                      v-else-if="item.status === 'ongoing'"
                      class="ma-2 status-label-custom ongoing"
                      label
                    >
                      {{ $t('form.ongoing') }}
                    </v-chip>
                  </template>
                  <template v-slot:item.actions="{ item }"> -->

                    <!--                  <div>-->
                    <!--                    <v-btn text>-->
                    <!--                      {{ $t('form.done') }}-->
                    <!--                    </v-btn>-->
                    <!--                    <v-btn text>-->
                    <!--                      {{ $t('form.extend') }}-->
                    <!--                    </v-btn>-->
                    <!--                  </div>-->
                  <!-- </template>
                </v-data-table>
              </div> -->

              <!-- TASK REVIEW open in same popup -->
              <!-- <TaskReviewInReviewPopup
                v-if="checkShowTaskItem"
                :object-item="editedTaskItem"
                :categories-array="taskCategoriesArray"
              /> -->
              
            <div  v-if="isProcess">
              <folding-info-table
                  :infoItem="infoItem"
                  :arrayItem="arrayItem"
                  :docItem="editedItem"
                  :processingItem="processingItem"
                  :openEmployeeTable="openEmployeeTable"
                  :routineTaskFeild="true"
                  :checkEdit="checkEdit"
                  :category_type="'task'"
                  @saveInfo="viewItem"
                  @openInfo="openInfo"
                  @sendRequest="sendRequest"
                  :hideTimeExtendedRequest="inReportData"
                />
                <ChangeEmployeeTable
                  v-if="!checkWorker && !isEdit && openEmployeeTable"
                  :AttendeeHeaders="AttendeeHeaders"
                  :isReminder="true"
                  :attendeeArray="attendeeArray"
                  :attendeeHistoryData="attendeeHistory"
                  :attendeeObjectID="attendeeObjectID"
                  :checkResponsiblePersone="checkResponsible"
                  :isReminderHistory="isReminderHistory"
                  :showExpand="showExpand"
                  :allEmployee="allEmployee"
                  :inReportData="inReportData"
                  @is_reminder_history="is_reminder_history"
                  @reloadEmployee="reloadEmployee"
                  @statusApprovedAction="statusApprovedAction"
                  @statusDisapprovedAction="statusDisapprovedAction"
                  @approvedReqestDate="approvedReqestDate"
                  @declineReqestDate="declineReqestDate"
                />

            </div>
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions class="popup-footer">
          <v-spacer />
          <v-btn class="btn-cancel" text @click="close">
            {{ $t('button.cancel') }}
          </v-btn>
          <!-- <v-btn
            v-if="((checkAdmin ||  || checkResponsible) && !isProcess && !inReportData) && editedItem.updated_at == editedItem.created_at"
            class="btn-save"
            @click="save()"
            :disabled="!!planAccess?.lastPlanAccess?.risk">
            {{ $t('button.done') }}
          </v-btn> -->
          <v-btn
              class="btn-save"
              @click="save"
              v-if="(isEdit || checkResponsible) && !checkWorker && !editedItem?.object_id && !inReportData"
            >
              {{ $t('button.save') }}
            </v-btn>
            <v-btn
            v-if="!hideDone && checkAttendee && routineTaskFeild && (checkWorker || checkAsAttendee) && checkEdit && !inReportData"
            class="btn-save"
            @click="submitContent"
          >
            {{ $t('button.done') }}
          </v-btn>
          <v-btn
            v-if="checkResponsible && !isEdit && userRate == 100 && doneResponse && !closedStatus && !inReportData"
            class="btn-save"
            @click="respSubmition"
          >
            {{ $t('button.done') }}
          </v-btn>
          <v-btn
            v-if="checkResubmit && checkWorker && routineTaskFeild && !inReportData"
            class="btn-save"
            @click="submitContent"
          >
            {{ $t('button.resubmit') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- TASK add NEW popup -->
    <AddNewPopup
      :open-popup="isAddTask"
      :form-title="$t('title.add_new_task')"
      :object-field="objectField"
      :object-item="newItemTask"
      :categories-array="taskCategoriesArray"
      :categories-type="'task'"
      @closePopup="isAddTask = !isAddTask, isProcess = false"
      @savePopup="addNewTask"
    />

    <!-- Risk element - popup view image -->
    <ViewImagePopup
      v-if="openViewImagePopup"
      :open-popup="openViewImagePopup"
      :object-item="editedImageItem"
      @closePopup="openViewImagePopup = !openViewImagePopup"
    />

    <reason-popup
      :open-popup="checkNew"
      @closePopup="checkNew = !checkNew"
      :titleMessage="employeeFeedback ? $t('form.feedback') : $t('form.reason')"
      :addDescription="addDescription"
    />

    <image-popup
      :open-popup="checkedImage"
      @closePopup="checkedImage = !checkedImage"
      :titleMessage="$t('form.image')"
      :addImage="addImage"
    />

    <dis-approved-popup
      :open-popup="disapprovedModal"
      :isDisapproved="isDisapproved"
      :objectItem="processingItem"
      :title-message="disApprovedTitle"
      :editDeadlineTime="editDeadlineTime"
      :attendeeObjectID="attendeeObjectID"
      @disApproved="deadlineRequest"
      :extend-date="true"
      :extend-time="true"
      @closePopup="disapprovedModal = !disapprovedModal"
    />
    <FeedbackPopup
      :open-popup="isWorkerRoutine"
      :object-item="feedbackItem"
      :isResubmit="isResubmit"
      :isResponsibleSubmit="isResponsibleSubmit"
      :predefinedLinkArray="predefinedLinkArray"
      @closePopup="isWorkerRoutine = !isWorkerRoutine"
      @workerFeedback="workerFeedback"
    />
    
  </div>
</template>

<script>
  import FroalaSuggestionListEditor from "./FroalaSuggestionListEditor";
  import CategoryInReviewPopup from "./CategoryInReviewPopup";
  import cookies from "js-cookie";
  import {_} from 'vue-underscore';
  import ResponsibleEditInReviewPopup from "./ResponsibleEditInReviewPopup";
  import AddNewPopup from "./AddNewPopup";
  // import TaskReviewInReviewPopup from "./TaskReviewInReviewPopup";
  import AddNewSourceOfDanger from "./AddNewSourceOfDanger";
  import moment from 'moment';
  import ViewImagePopup from "./ViewImagePopup";
import StatusChip from './StatusChip.vue';
import { removeTagsFromString ,formatTimeString  } from './common/js/functions';
import FoldingInfoTable from './FoldingInfoTable.vue';
import ChangeEmployeeTable from './ChangeEmployeeTable.vue';
import DisApprovedPopup from './DisApprovedPopup.vue';
import FeedbackPopup from './FeedbackPopup.vue';
import ReasonPopup from './ReasonPopup.vue';
import ImagePopup from './ImagePopup.vue';


  export default {
    name: "RiskAnalysisReviewPopup",
    components: {
      FroalaSuggestionListEditor,
      Category: CategoryInReviewPopup,
      ResponsibleEdit: ResponsibleEditInReviewPopup,
      AddNewPopup,
      // TaskReviewInReviewPopup,
      AddNewSourceOfDanger,
      ViewImagePopup,
        StatusChip,
        FoldingInfoTable,
        ChangeEmployeeTable,
        DisApprovedPopup,
        FeedbackPopup,
        ReasonPopup,
        ImagePopup,
    },
    props: {
      openPopup: {
        type: Boolean,
        required: true,
      },
      objectItem: {
        type: Object,
        required: true,
      },
      categoriesArray: {
        type: Array,
        required: false,
      },
      inReportData:{
        type: Boolean,
        required: false,
        default: false
      },
       predefinedLinkArray: {
      type: Array,
      required: false,
    },
    },
    data: () => ({
      employeeFeedback: false,
      checkAdmin: cookies.get('checkAdmin'),
      planAccess: JSON.parse(localStorage.getItem('planAccess')),
      roleUser: cookies.get('roleUser'),
      userID: parseInt(cookies.get('userID')),
      today: new Date().toISOString().substr(0, 10),
      valid: true,
      checkCreator: false,
      checkResponsible: false,
      checkTaskResponsible: false,
      checkTaskAttendee: false,
      hoverTaskPlanAccess: false,
      required: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else return true;
        }
      ],
      isEdit: false,
      editedItem: {},
      responsibleName: [],
      isProcess: false,
      // list object fields which appear on add new task popup
      objectField: [
        'name',
        'description',
        'category',
        'responsible',
        'attendee',
        'start-date',
        'deadline',
        'risk-analysis-import-information',
        'no-index',
      ],
      isAddTask: false,
      newItemTask: {
        is_template: false,
        name: "",
        type: 'task',
        description: "",
        category_id: '',
        is_suggestion: false,
        is_valid: true,
        status: 'new',
        required_comment: false,
        required_attachment: false,
        // time management
        // responsible - attendee
        isDefaultResponsible: true,
        responsible_department_array: [],
        responsible_employee_array: [],
        isDefaultAttendee: true,
        attendee_department_array: [],
        attendee_employee_array: [],
        attendee_all: false,
        // required comment
        responsible_required_comment: false,
        responsible_required_attachment: false,
        attendee_required_comment: false,
        attendee_required_attachment: false,
        // connect to object
        connectToArray: [],
        is_shared:false,
        is_public:false,
        start_date: '',
        start_time_pre: '',
        end_time_pre: '',
        start_time: '',
        end_time: '',
        start_date_pre: '',
        deadline: '',
        deadline_pre: '',
      },
      defaultItemTask: {
        start_date: '',
        start_time_pre: '',
        end_time_pre: '',
        start_time: '',
        end_time: '',
        start_date_pre: '',
        deadline: '',
        deadline_pre: '',
        is_template: false,
        name: "",
        type: 'task',
        description: "",
        category_id: '',
        is_suggestion: false,
        is_valid: true,
        status: 'new',
        required_comment: false,
        required_attachment: false,
        // time management
        // responsible - attendee
        isDefaultResponsible: true,
        responsible_department_array: [],
        responsible_employee_array: [],
        isDefaultAttendee: true,
        attendee_department_array: [],
        attendee_employee_array: [],
        attendee_all: false,
        // required comment
        responsible_required_comment: false,
        responsible_required_attachment: false,
        attendee_required_comment: false,
        attendee_required_attachment: false,
        // connect to object
        connectToArray: [],
      },
      editedTaskItem: {},
      checkShowTaskItem: false,
      // display edit source of danger
      isEditSourceOfDanger: false,
      // task category
      taskCategoriesArray: [],
      // switch Process
      showBtnProcess: true,
      checkDisplayStatus: false,
      // risk element
      openViewImagePopup: false,
      editedImageItem: null,

    infoItem: {},
    arrayItem: [],
    processingItem: {},
    openEmployeeTable: false,
    checkEdit: false,
    editDeadlineTime:false,
    disapprovedModal: false,
    disApprovedTitle: '',
    attendeeObjectID: '',
    attendeeArray: [],
    attendeeHistory: [],
    closedStatus:false,
    checkResubmit: false,
    hideExtendTimeline: false,
    declineRequest: false,
    userProgressColor: '',
    userRate: '',
    total_rate: '',
    respProgressColor: '',
    feedbackItem: {
      attachment: '',
      comment: '',
      object_id: '',
      processing_id: '',
      required_comment: false,
      required_attachment: false,
    },
    checkAttendee: false,
    hideDone: false,
    doneResponse: false,
    checkWorker: false,
    isReminderHistory: false,
    showExpand: false,
     allEmployee:'',
    statusActionItem: {
      newStatus: '',
      processID: '',
      responsible_comment: '',
      id: '',
    },
    requestItem: {},
    extendeItem: {},
    isResponsibleSubmit: false,
    isWorkerRoutine: false,
    isDisapproved: false,
    isResubmit: false,
    routineTaskFeild:true,
    docItem:{},
    docId:'',
    task_source_id:'',
    risk_source_id:'',
    risk_source:'',
    selectedTopic: [],
    checkNew: false,
    addDescription: '',
    checkedImage : false,
    addImage: '',
    checkAsAttendee: false
    }),

    computed: {
      reportHeaders() {
        return [
          {text: 'Name',align: 'start',sortable: false,value: 'name',width: '25%'},
          {text: 'Result', value: 'options', align: 'center', width: '25%'},
          {text: 'Comment', value: 'comment', align: 'center', width: '30%'},
          {text: 'Image', value: 'image', align: 'center'},
        ];
      },
      AttendeeHeaders() {
      return [
        {
          text: this.translateCol('employee_name'),
          value: 'name',
          align: 'left',
          sortable: false,
          width: '17%',
        },
        {
          text: this.translateCol('feedback'),
          value: 'comment',
          align: 'center',
          width: '20%',
        },
        {
          text: this.translateCol('image'),
          value: 'image',
          align: 'center',
          sortable: false,
          width: '17%',
        },
        {
          text: this.translateCol('assign'),
          value: 'date',
          align: 'center',
          width: '17%',
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
        },
      ]
    },
      headers() {
        return [
          {text: this.translateCol('name'), value: 'name', align: 'left', sortable: false},
          {text: this.translateCol('type'), value: 'type', align: 'center', sortable: false},
          {text: this.translateCol('probability'), value: 'probability', align: 'center', sortable: false},
          {text: this.translateCol('consequences'), value: 'consequence', align: 'center', sortable: false},
          {text: this.translateCol('risk_level'), value: 'risk_level', align: 'center', sortable: false},
          {text: this.translateCol('comment'), value: 'comment', align: 'center', sortable: false},
          // {text: this.translateCol('actions'), value: 'actions', align: 'center', sortable: false},
        ];
      },

      // headersAttendee() {
      //   return [
      //     {text: this.translateCol('name'), value: 'name', align: 'left', sortable: false},
      //     {text: this.translateCol('type'), value: 'type', align: 'center', sortable: false},
      //     {text: this.translateCol('probability'), value: 'probability', align: 'center', sortable: false},
      //     {text: this.translateCol('consequence'), value: 'consequence', align: 'center', sortable: false},
      //     {text: this.translateCol('risk_level'), value: 'risk_level', align: 'center', sortable: false},
      //     {text: this.translateCol('comment'), value: 'comment', align: 'center', sortable: false},
      //   ];
      // },

      headersTask() {
        return [
          {text: this.translateCol('name'), value: 'name', align: 'left', sortable: false},
          {text: this.translateCol('total_attendee'), value: 'total_attendee', align: 'center', sortable: false},
          {text: this.translateCol('start_date'), value: 'start_date', align: 'center', sortable: false},
          {text: this.translateCol('deadline'), value: 'deadline', align: 'center', sortable: false},
          {text: this.translateCol('status'), value: 'status', align: 'center', sortable: false},
          // {text: this.translateCol('actions'), value: 'actions', align: 'center', sortable: false},
        ];
      },

      headersRiskElement() {
        return [
          {text: this.translateCol('name'), value: 'name', align: 'left', sortable: false},
          {text: this.translateCol('added_by'), value: 'added_by_name', align: 'center', sortable: false},
          {text: this.translateCol('category'), value: 'categoryName', align: 'center', sortable: false},
          {text: this.translateCol('number_of_times_used'), value: 'number_used_time', align: 'center', sortable: false},
          {text: this.translateCol('view'), value: 'view', align: 'center', sortable: false},
          {text: this.translateCol('image'), value: 'image', align: 'center', sortable: false},
        ];
      },

      computedHeaders() {
        // if (this.checkAdmin || this.checkCreator || this.checkResponsible || this.checkTaskResponsible || this.checkTaskAttendee) {
        return this.headers;
        // } else {
        //   return [];
        // }
      },

      computedHeadersTask() {
        // if (this.checkAdmin || this.checkCreator || this.checkResponsible || this.checkTaskResponsible || this.checkTaskAttendee) {
        return this.headersTask;
        // } else {
        //   return [];
        // }
      },
    },

    watch: {
      openPopup(value) {
        if (value) {
          this.openEmployeeTable = false
          this.viewItem(this.objectItem);
        }
      },
    },

    created() {
       if (this.roleUser == 'user') {
         this.checkWorker = true
       }
    },

    mounted() {
      let that = this;
      // list TASK categories
      that.$store.dispatch('categoriesV2/index', {type: 'task'}).then(result => {
        that.taskCategoriesArray = result.data;
      }).catch(() => {
        that.$nuxt.$loading.finish();
      });
    },

    methods: {
      showComment(item) {
        this.checkNew = true
        this.addDescription = item
      },
      showImage(item) {
        this.checkedImage = true
        this.addImage = item
      },
      redirectUrl(){
        if (this.roleUser == 'company admin') {
              this.$router.push('/settings/billings/');
          }
      },
      viewItem(item) {
        let that = this;
        // that.formDirty = false;
        that.$nuxt.$loading.start();
        that.selectedTopic=[];
        that.$store.dispatch('objects/show', item.id).then(result => {
          that.editedItem = Object.assign({}, result.data);
          result?.data?.topics && that.selectedTopic.push(result?.data?.topics);
          that.docId = that.editedItem.id
          that.risk_source_id = result.data?.source_id
          that.risk_source = result.data?.source
          that.editedItem.object_id = result.data?.subObject[0]?.id
          that.editedItem.object_id && 
          that.$store.dispatch('objects/show', that.editedItem.object_id)
          .then((res) => {

              if(res?.data?.status == 'closed'){
                this.checkAsAttendee=false;
              }
              if(res?.data?.attendee?.employee_array == res?.data?.responsible?.employee_array && this.roleUser != 'user' && res?.data?.status != 'closed'){
                this.checkAsAttendee=true;
              }
              that.task_source_id = res.data?.source_id
              that.attendeeObjectID = that.editedItem?.object_id
              if (that.checkWorker == false) {
                that.$store
                  .dispatch(`objects/getAttendeeData`, that.editedItem.object_id)
                  .then((attendeeRes) => {
                    // that.$nuxt.$loading.start()
                    that.attendeeArray = attendeeRes.attendee
                    const newAttendees = that?.attendeeArray?.filter((attendee) => attendee?.status === 'new');
                const attendeeIds = newAttendees?.map((attendee) => attendee?.attendee_id);
                that.allEmployee = attendeeIds?.join(',');
                    let history_of_attendee = []
                    _.each(attendeeRes.attendee, function (history) {
                      if (Object.keys(history.attendee_history)?.length > 0) {
                        history_of_attendee.push(history.attendee_history)
                      }
                    })
                    that.attendeeHistory = history_of_attendee
                    that.$nuxt.$loading.finish()
                  })
              }

               if (res.data?.responsible?.employeeRole?.includes(that.userID)) {
              that.checkResponsible=true
            } else {
              that.checkResponsible=false
            }

              let respo = res.data
              this.infoItem = Object.assign({}, respo)
              that.processingItem = that.infoItem?.my_processing
              // if (this.checkWorker && that.processingItem?.status) {
              //   that.dev_status = that.processingItem?.status
              // }
              this.arrayItem = [res.data]
              this.closedStatus = res?.data?.status == "closed" ? true : false

          if (that.processingItem?.status && that.checkWorker) {
            that.editedItem.status = that.processingItem?.status
            if (
              that.editedItem.status === 'approved' ||
              that.editedItem.status === 'completed' ||
              that.editedItem.status === 'request' ||
              that.editedItem.status === 'approved_overdue' ||
              that.editedItem.status === 'completed_overdue' ||
              that.editedItem.status === 'Reassigned' ||
              that.editedItem.status === 'Removed'|| that.editedItem.status === 'disapproved_overdue' || that.editedItem?.status === 'overdue'
            ) {
              that.checkResubmit = false
              that.hideExtendTimeline = true
            } else if (
              that.editedItem.status === 'disapproved_with_extended' || that.editedItem?.status === 'disapproved'
            ) {
              that.checkResubmit = true
              that.hideExtendTimeline = true
            } else if (that.editedItem.status === 'timeline_disapproved') {
              that.checkResubmit = false
              that.declineRequest = true
              that.hideExtendTimeline = true
            } else {
              that.checkResubmit = false
              that.hideExtendTimeline = false
            }
          }
          that.userRate = that.infoItem.rate.toFixed()
          that.total_rate = that.infoItem.total_rate.toFixed()

          const responseDateStr = respo.start_date

          const responseDate = new Date(responseDateStr)
          responseDate.setHours(0, 0, 0, 0)
          const currentDate = new Date()
          currentDate.setHours(0, 0, 0, 0)

          // Compare the dates without time
          if (currentDate < responseDate) {
            that.checkEdit = false
          } else {
            that.checkEdit = true
          }

          const responseTimeStr = respo.start_time;
          if (currentDate.getTime() === responseDate.getTime() && that.checkEdit == true) {

            const currentTime = new Date();
            const currentHours = currentTime.getHours();
            const currentMinutes = currentTime.getMinutes();
            // Split the response time string into hours, minutes, and seconds
            const [responseHours, responseMinutes] = responseTimeStr.split(':').map(Number);

            if ((currentHours > responseHours) || (currentHours === responseHours && currentMinutes >= responseMinutes)) {
              // Both date and time are equal, and current time is greater than or equal to response time
              that.checkEdit = true;
            } else {
              that.checkEdit = false;
            }
          }

          that.feedbackItem.object_id = that.infoItem.id
          that.feedbackItem.processing_id = that.processingItem?.process_id
          that.feedbackItem.required_comment =
            that.processingItem?.required_comment
          that.feedbackItem.required_attachment =
            that.processingItem?.required_attachment
          // if (that.checkWorker == true) {
          if (
            that.processingItem?.attendee_id == that.userID &&
            (that.processingItem?.status === 'new' ||
              that.processingItem?.status === 'pending' ||
              that.processingItem?.status === 'ongoing' || that.processingItem?.status === 'disapproved_overdue' || that.processingItem?.status === 'timeline_disapproved' || that.processingItem?.status === 'overdue')
          ) {
            that.checkAttendee = true
            that.hideDone = false
          } else {
            that.checkAttendee = false
            that.hideDone = true
          }

          if (that.processingItem?.attendee_id == that.userID && that.processingItem.status !== 'completed' && that.processingItem.status != null) {
            that.doneResponse = true
          } else {
            that.doneResponse = false
          }
          if (that.infoItem.added_by == that.userID) {
            that.checkCreator = true
          } else {
            that.checkCreator = false
          }
          if (
            (that.checkResponsible && that.checkCreator) ||
            (that.checkResponsible && !that.checkCreator) ||
            (!that.checkResponsible && !that.checkCreator)
          ) {
            if (that.userRate <= 25) {
              that.userProgressColor = 'rgba(251,75,75)'
            } else if (that.userRate > 25 && that.userRate <= 50) {
              that.userProgressColor = 'rgba(255,168,121)'
            } else if (that.userRate > 50 && that.userRate <= 75) {
              that.userProgressColor = 'rgba(255,193,99)'
            } else if (that.userRate > 75 && that.userRate <= 95) {
              that.userProgressColor = 'rgba(255, 212, 111, 1)'
            } else {
              that.userProgressColor = 'rgba(132, 161, 61, 1)'
            }
          } else if (that.checkCreator && !that.checkResponsible) {
            if (that.total_rate <= 25) {
              that.respProgressColor = 'rgba(251,75,75)'
            } else if (that.total_rate > 25 && that.total_rate <= 50) {
              that.respProgressColor = 'rgba(255,168,121)'
            } else if (that.total_rate > 50 && that.total_rate <= 75) {
              that.respProgressColor = 'rgba(255,193,99)'
            } else if (that.total_rate > 75 && that.total_rate <= 95) {
              that.respProgressColor = 'rgba(255, 212, 111, 1)'
            } else {
              that.respProgressColor = 'rgba(132, 161, 61, 1)'
            }
          }
            })
          // risk
          // that.checkCreatorRisk = _.contains(result.data.role, 'creator');
          if (!that.editedItem?.object_id && result.data?.responsible?.employeeRole?.includes(that.userID)) {
              that.checkResponsible=true
            } else {
              that.checkResponsible=false
            }
          // that.checkAttendee = _.contains(result.data.role, 'attendee');
          // if (that.checkAttendee) {
          //   let processAttendee = _.filter(result.data.processingInfo, function (o) {
          //     return o.user_id === that.userLogged;
          //   });
          //   if (processAttendee) {
          //     that.attendeeProcessItem = processAttendee[0];
          //     that.attendeeProcessId = processAttendee[0].process_id;
          //     that.attendeeProcessStatus = processAttendee[0].status;
          //   }
          // }
          that.responsibleName = result.data.responsible['employeeName'];
          that.editedItem.responsible_employee_array = JSON.parse(that.editedItem.responsible['employee_array']);
          // that.editedItem.historyArray = _.sortBy(result.data.history, function(o) { return o.updated_at; });
          that.isProcess = that.checkDisplayStatus = !_.isEmpty(result.data.subObject);
          that.showBtnProcess = that.checkConditionToShowProcessButton(result.data);
          // task of risk
          that.checkTaskResponsible = _.contains(result.data.roleSubObject, 'responsible');
          that.checkTaskAttendee = _.contains(result.data.roleSubObject, 'attendee');
          if (!_.isEmpty(result.data.subObject)) {
            _.each(result.data.subObject[0].processingInfo, function (o) {
              if (o.status === 'new') {
                o.status = result.data.status;
              }
            });
          }
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_risk_analysis_view_detail'));
          }
          that.$nuxt.$loading.finish();
        });
      },

      is_reminder_history() {
      this.isReminderHistory = !this.isReminderHistory
    },

       openInfo(value) {
      if (value == true) {
        this.openEmployeeTable = true
      } else {
        this.openEmployeeTable = false
      }
    },

    sendRequest() {
      this.editDeadlineTime = true
      this.disapprovedModal = true
      this.disApprovedTitle = 'Extend Deadline Request'
    },

    updateRisk() {
      // task-update
      this.updateItem = this.editedItem
      this.updateItem.id = this.attendeeObjectID
      this.updateItem.status = 'closed'
      this.updateItem.source = 'risk-analysis'
      this.updateItem.responsible_id = ''
      this.updateItem.requestEdit = true
      this.updateItem.is_duration=false
      this.updateItem.is_activated=false
      this.updateItem.is_attending_activated=false
      this.updateItem.is_public = false
      this.updateItem.source_id = this.task_source_id
      this.updateItem.isDefaultResponsible = false
      this.updateItem.type = 'task'
      this.updateItem.start_time = formatTimeString(this?.editedItem?.start_time);
          this.updateItem.end_time = formatTimeString(this?.editedItem?.end_time);
          this.updateItem.question = null
          delete this.editedItem.topics
        this.$store
        .dispatch('objects/update', this.updateItem)
        .then(() => {
          this.$nuxt.$loading.start()
          this.reloadList()
          this.reloadListCategory()
          this.$toaster.success(this.$i18n.t('message.success_task_update'))
          this.$nuxt.$loading.finish()
        })
        .catch((error) => {
          if (error.response.status == 401) {
            this.$router.push('/login')
            this.$toaster.error(this.$i18n.t('message.token_expired'))
          } else {
            console.log(error)
            this.$toaster.error(this.$i18n.t('message.fail_task_update'))
          }
          this.$nuxt.$loading.finish()
        })

      // risk-update
        this.docItem = this.editedItem
      this.docItem.id = this.docId
      this.docItem.type = 'risk-analysis'
      this.docItem.status = 'closed'
      this.docItem.task_data = this.infoItem
      this.updateItem.source = this.risk_source
      this.docItem.source_id = this.risk_source_id
      this.docItem.updated_by = this.userID
      this.docItem.start_time = formatTimeString(this?.editedItem?.start_time);
          this.docItem.end_time = formatTimeString(this?.editedItem?.end_time);
          this.updateItem.question = null
      delete this.editedItem.topics
          this.$store.dispatch('objects/update', this.docItem).then(function () {
            this.reloadList();
            // this.reloadListCategory();
            this.$toaster.success(this.$i18n.t('message.success_risk_analysis_update'));
          }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
            this.$toaster.error(this.$i18n.t('message.fail_risk_analysis_update'));
          }
            this.$nuxt.$loading.finish();
          });
      this.close()
    },

respSubmition() {
      this.isResponsibleSubmit = true
      if (
        this.processingItem.required_attachment == 1 ||
        this.processingItem.required_comment == 1
      ) {
        this.isWorkerRoutine = true
      } else {
        if ((this.checkCreator && this.total_rate == 100 && !this.checkResponsible) ||
                (this.checkCreator && this.checkResponsible && this.userRate == 100) && !this.closedStatus) {
          this.updateRisk()
        } else{
          this.isWorkerRoutine = false
          let formData = new FormData()
          formData.append('attachment', null)
          formData.append('comment', null)
          formData.append('object_id', this.attendeeObjectID)
          formData.append('processing_id', this.processingItem.process_id)
          this.$store
            .dispatch(`objects/managerAction`, formData)
            .then(() => {
              this.$nuxt.$loading.start()
              this.reloadList()
              this.$toaster.success(this.$i18n.t('message.success_task_done'))
              this.$nuxt.$loading.finish()
            })
            .catch((error) => {
              if (error.response.status == 401) {
                this.$router.push('/login')
                this.$toaster.error(this.$i18n.t('message.token_expired'))
              } else {
                this.$toaster.error(this.$i18n.t('message.server_error'))
              }
              // this.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
              this.$nuxt.$loading.finish()
            })
            this.updateRisk()
        }
          // this.close()
      }
    },
    submitContent() {
      this.isResponsibleSubmit = false
      if (
        this.processingItem.required_attachment == 1 ||
        this.processingItem.required_comment == 1
      ) {
        this.isWorkerRoutine = true
      } else {
        this.isWorkerRoutine = false
        let formData = new FormData()
        formData.append('attachment', null)
        formData.append('comment', null)
        formData.append('object_id', this.attendeeObjectID)
        formData.append('processing_id', this.processingItem.process_id)
        this.$store
          .dispatch(`objects/actionStore`, formData)
          .then(async() => {
            if(this.editedItem?.attendee?.employee_array == this.editedItem?.responsible?.employee_array && this.roleUser != 'user'){
              await this.statusApprovedAction(this.attendeeArray?.[0]);
              await this.updateRisk()
              this.checkAsAttendee=false;
            }
            else{

              this.reloadList()
              this.$toaster.success(this.$i18n.t('message.success_task_done'))
            }
            // this.$nuxt.$loading.start()
            // this.reloadList()
            // this.$toaster.success(this.$i18n.t('message.success_task_done'))
            // this.$nuxt.$loading.finish()
          })
          .catch((error) => {
            if (error.response.status == 401) {
              this.$router.push('/login')
              this.$toaster.error(this.$i18n.t('message.token_expired'))
            } else {
              this.$toaster.error(this.$i18n.t('message.server_error'))
            }
            // this.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            this.$nuxt.$loading.finish()
          })
        this.close()
      }
    },
    deadlineRequest(item , requestDeadline) {
      this.requestItem.object_id = item.object_id
      this.requestItem.process_id = item.process_id
      this.requestItem.deadline_date = item.deadline_pre
      this.requestItem.deadline_time = requestDeadline ? item.end_time_pre : null
      this.requestItem.reason = item.description
      this.$store
        .dispatch(`objects/extend_timeline`, this.requestItem)
        .then(() => {
          this.$nuxt.$loading.start()
          this.reloadList()
          this.$toaster.success(this.$i18n.t('message.success_send_request'))
          this.$nuxt.$loading.finish()
        })
        .catch((error) => {
          if (error.response.status == 401) {
            this.$router.push('/login')
            this.$toaster.error(this.$i18n.t('message.token_expired'))
          } else {
            this.$toaster.error(this.$i18n.t('message.fail_send_request'))
          }
          // this.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          this.$nuxt.$loading.finish()
        })
      this.disapprovedModal = false
      this.close()
    },
    statusApprovedAction(item) {
      this.statusActionItem.newStatus = 'verify'
      this.statusActionItem.processID = item.process_id
      this.statusActionItem.responsible_comment = ''
      this.statusActionItem.id = this.attendeeObjectID
      // let dataItem = this.statusActionItem
      this.$store
        .dispatch('objects/updateStatus', this.statusActionItem)
        .then(() => {
          this.$nuxt.$loading.start()
          this.reloadList()
          this.reloadEmployee()
          this.$toaster.success(
            this.$i18n.t('message.task_accept_by_responsible')
          )
          this.$nuxt.$loading.finish()
        })
        .catch((error) => {
          if (error.response.status == 401) {
            this.$router.push('/login')
            this.$toaster.error(this.$i18n.t('message.token_expired'))
          } else {
            this.$toaster.error(this.$i18n.t('message.server_error'))
          }
          this.$nuxt.$loading.finish()
        })
    },
    statusDisapprovedAction(item , requestDeadline) {
      this.statusActionItem.newStatus = 'reopened'
      this.statusActionItem.processID = item.process_id
        this.statusActionItem.extend_time = requestDeadline ? item.end_time_pre : null
      this.statusActionItem.extend_date = item.deadline_pre
      this.statusActionItem.id = this.attendeeObjectID
      this.statusActionItem.responsible_comment = item.description
      this.$store
        .dispatch('objects/updateStatus', this.statusActionItem)
        .then(() => {
          this.$nuxt.$loading.start()
          this.reloadList()
          this.reloadEmployee()
          this.$toaster.success(
            this.$i18n.t('message.task_decline_by_responsible')
          )
          this.$nuxt.$loading.finish()
        })
        .catch((error) => {
          if (error.response.status == 401) {
            this.$router.push('/login')
            this.$toaster.error(this.$i18n.t('message.token_expired'))
          } else {
            this.$toaster.error(this.$i18n.t('message.server_error'))
          }
          this.$nuxt.$loading.finish()
        })
    },
    approvedReqestDate(item) {
      this.extendeItem.object_id = this.attendeeObjectID
      this.extendeItem.process_id = item.process_id
      this.extendeItem.status = 'approved'
      this.extendeItem.extended_by_reason = ''
      this.extendeItem.id = item.extended_timeline?.id
      this.$store
        .dispatch(`objects/extend_action`, this.extendeItem)
        .then(() => {
          this.$nuxt.$loading.start()
          this.reloadList()
          this.$toaster.success(
            this.$i18n.t('message.success_approve_deadline')
          )
          this.$nuxt.$loading.finish()
        })
        .catch((error) => {
          if (error.response.status == 401) {
            this.$router.push('/login')
            this.$toaster.error(this.$i18n.t('message.token_expired'))
          } else {
            this.$toaster.error(this.$i18n.t('message.fail_approve_deadline'))
          }
          // this.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          this.$nuxt.$loading.finish()
        })

      this.reloadEmployee()
    },
    declineReqestDate(newItem) {
      this.extendeItem.object_id = this.attendeeObjectID
      this.extendeItem.process_id = newItem.item.process_id
      this.extendeItem.status = 'disapproved'
      this.extendeItem.extended_by_reason = newItem.data.description
      this.extendeItem.id = newItem.item.extended_timeline?.id
      this.$store
        .dispatch(`objects/extend_action`, this.extendeItem)
        .then(() => {
          this.$nuxt.$loading.start()
          this.reloadList()
          this.$toaster.success(
            this.$i18n.t('message.success_disapprove_deadline')
          )
          this.$nuxt.$loading.finish()
        })
        .catch((error) => {
          if (error.response.status == 401) {
            this.$router.push('/login')
            this.$toaster.error(this.$i18n.t('message.token_expired'))
          } else {
            this.$toaster.error(
              this.$i18n.t('message.fail_disapprove_deadline')
            )
          }
          // this.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          this.$nuxt.$loading.finish()
        })

      this.reloadEmployee()
    },
    async workerFeedback(payload) {
      if (payload.isResponsibleSubmit == false) {

        this.feedbackItem.comment= await removeTagsFromString(payload.description);

        let formData = new FormData()
        formData.append('attachment', payload.attachment)
        formData.append('original_file_name', payload.attachment.name)
        formData.append('file_size', payload.attachment.size)
        formData.append('comment', this.feedbackItem.comment)
        formData.append('object_id', payload.object_id)
        formData.append('processing_id', payload.processing_id)

        this.$store
          .dispatch(`objects/actionStore`, formData)
          .then((res) => {
            console.log('status', res)
            this.$nuxt.$loading.start()
            this.hideDone = true
            this.reloadList()
            this.$toaster.success(this.$i18n.t('message.success_add_content'))
            this.$nuxt.$loading.finish()
          })
          .catch((error) => {
            if (error.response.status == 401) {
              this.$router.push('/login')
              this.$toaster.error(this.$i18n.t('message.token_expired'))
            } else {
              this.$toaster.error(this.$i18n.t('message.fail_add_content'))
            }
            // this.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            this.$nuxt.$loading.finish()
          })
      } else {

         this.feedbackItem.comment= await removeTagsFromString(payload.description);

        let formData = new FormData()
        formData.append('attachment', payload.attachment)
        formData.append('original_file_name', payload.attachment.name)
        formData.append('file_size', payload.attachment.size)
        formData.append('comment', this.feedbackItem.comment)
        formData.append('object_id', payload.object_id)
        formData.append('processing_id', payload.processing_id)

        this.$store
          .dispatch(`objects/managerAction`, formData)
          .then((res) => {
            console.log('status', res)
            this.$nuxt.$loading.start()
            this.hideDone = true
            this.reloadList()
            this.$toaster.success(this.$i18n.t('message.success_add_content'))
            this.$nuxt.$loading.finish()
          })
          .catch((error) => {
            if (error.response.status == 401) {
              this.$router.push('/login')
              this.$toaster.error(this.$i18n.t('message.token_expired'))
            } else {
              this.$toaster.error(this.$i18n.t('message.fail_add_content'))
            }
            // this.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            this.$nuxt.$loading.finish()
          })
          this.updateRisk()
          this.close()
      }
      this.feedbackItem.comment = ''

      this.close()
    },

    reloadEmployee() {
      this.reloadList()
      // this.$nuxt.$loading.start()
      this.$store
        .dispatch(`objects/getAttendeeData`, this.attendeeObjectID)
        .then((attendeeRes) => {
          this.$nuxt.$loading.start()
          this.attendeeArray = attendeeRes.attendee
          let history_of_attendee = []
          _.each(attendeeRes.attendee, function (history) {
            if (Object.keys(history.attendee_history)?.length > 0) {
              history_of_attendee.push(history.attendee_history)
            }
          })
          this.attendeeHistory = history_of_attendee
          this.viewItem(this.objectItem)
          this.$nuxt.$loading.finish()
        })
      this.$nuxt.$loading.finish()
    },

      checkConditionToShowProcessButton(list) {
        if (list.source_of_danger.length > 0) {
          let temp = _.filter(list.source_of_danger, function (item) {
            return item.risk_level === 0;
          });
          if (_.isEmpty(temp)) {
            return _.isEmpty(list.subObject);
          } else {
            return false;
          }
        } else {
          return false;
        }
      },

      getNewCategory(value) {
        this.editedItem.category_id = value.newCategoryId;
      },

      translateCol(colName) {
        return this.$i18n.t('column.' + colName);
      },

      // compareDate(start) { // check if start date yet
      //   if (!_.isEmpty(start)) {
      //     const [year, month, day] = start.split('-');
      //     const [yearToday, monthToday, dayToday] = this.today.split('-');
      //     return yearToday > year || (yearToday <= year && monthToday > month) || (yearToday <= year && monthToday <= month && dayToday > day);
      //   } else {
      //     return false;
      //   }
      // },

      // compareToday(start) { // check if start date = today
      //   if (!_.isEmpty(start)) {
      //     const [year, month, day] = start.split('-');
      //     const [yearToday, monthToday, dayToday] = this.today.split('-');
      //     return yearToday === year && monthToday === month && dayToday === day;
      //   } else {
      //     return false;
      //   }
      // },

      close() {
        this.isEdit = false;
        this.isEditSourceOfDanger = false;
        this.checkShowTaskItem = false;
        this.openEmployeeTable = false
        if (this.openPopup) {
          this.$emit('closePopup');
        }
      },

      translateLevel(value) {
        if (value === 1) {
          return this.$i18n.t('form.low');
        } else if (value === 2) {
          return this.$i18n.t('form.moderate');
        } else if (value === 3) {
          return this.$i18n.t('form.high');
        } else if (value === 4) {
          return this.$i18n.t('form.very_high');
        } else {
          return '';
        }
      },

      reloadList() {
        this.$emit('reloadList');
      },

      // reloadListCategory() {
      //   this.$emit('reloadListCategory');
      // },

      editSourceOfDanger(isAddNew) {
        if ((this.checkCreator || this.checkResponsible) && !this.isProcess) {
          this.isEditSourceOfDanger = !this.isEditSourceOfDanger;
          this.editedItem.isAddNewSourceOfDanger = isAddNew;
        }
      },

     async save() { // update
        let that = this;
        if (that.$refs.form.validate()) {
          that.$nuxt.$loading.start();
          that.editedItem.requestEdit = true;
          that.editedItem.connectToArray = [];
          that.editedItem.isDefaultResponsible = false;
          that.editedItem.isDefaultAttendee = false;
          that.editedItem.attendee_all = false;
          that.editedItem.question=""
          that.editedItem.responsible_required_comment = that.editedItem.responsible['required_comment'];
          that.editedItem.responsible_required_attachment = that.editedItem.responsible['required_attachment'];
          that.editedItem.updated_by = that.userID
          that.editedItem.description= await removeTagsFromString(that?.editedItem?.description);
          that.editedItem.start_time =await formatTimeString(that?.editedItem?.start_time);
          that.editedItem.end_time = await formatTimeString(that?.editedItem?.end_time);
          that.editedItem.is_shared = that.editedItem.is_shared ? that.editedItem.is_shared : 0
          delete that.editedItem.topics
          // that.editedItem.attendee_required_comment = that.editedItem.attendee['required_comment'];
          // that.editedItem.attendee_required_attachment = that.editedItem.attendee['required_attachment'];
          that.$store.dispatch('objects/update', that.editedItem).then(function () {
            that.reloadList();
            // that.reloadListCategory();
            that.$toaster.success(that.$i18n.t('message.success_risk_analysis_update'));
          }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_risk_analysis_update'));
          }
            that.$nuxt.$loading.finish();
          });
          that.close();
        }
      },

      checkProcessRiskAnalysis(process) {
        console.log(process);
        this.isAddTask = !!process;
        this.newItemTask.name = this.editedItem.name;
        this.newItemTask.description = this.editedItem.description;
        this.newItemTask.source_of_danger = this.editedItem.source_of_danger;
      },

      async addNewTask(value) {
        let that = this;
        if (this.$refs.form.validate()) {
        that.$nuxt.$loading.start();
        that.newItemTask = value.item;
        that.newItemTask.start_date = that.newItemTask.start_date_pre;
      that.newItemTask.deadline = that.newItemTask.deadline_pre;
      // that.newItemTask.start_time = that.newItemTask.start_time_pre != null && that.newItemTask.start_time_pre != "" ? new moment(that.newItemTask.start_time_pre, "HH:mm").utc().format("HH:mm") : null;
      // that.newItemTask.end_time = that.newItemTask.end_time_pre && that.newItemTask.end_time_pre != "" ? new moment(that.newItemTask.end_time_pre, "HH:mm").utc().format("HH:mm"): null;
      that.newItemTask.start_time = await formatTimeString(new moment(that?.newItemTask?.start_time_pre, "HH:mm"))
      that.newItemTask.end_time = await formatTimeString(new moment(that?.newItemTask?.end_time_pre, "HH:mm"))
        that.newItemTask.source = 'risk-analysis';
        that.newItemTask.source_id = that.editedItem.id;
        that.newItemTask.object_type='task'
        that.newItemTask.added_by=that.userID
      that.newItemTask.is_shared = that.newItemTask.is_shared ? that.newItemTask.is_shared : false
      that.newItemTask.is_public = that.newItemTask.is_public ? that.newItemTask.is_public : false

        _.each(that.newItemTask.chosen_source_list, function (item) {
          let source = _.findWhere(that.newItemTask.source_of_danger, {id: item});
          source.need_to_process = 1;
        });
        that.$store.dispatch('objects/store', that.newItemTask).then(function () {
          // that.save();
          that.isAddTask = false;
          that.newItemTask = Object.assign({}, that.defaultItemTask);
          that.reloadList();
          that.$toaster.success(that.$i18n.t('message.success_task_add_new'));
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_task_add_new'));
          }
          that.$nuxt.$loading.finish();
        });
        that.close();
        }
      },

      viewTaskReviewPopup(item) {
        if (this.checkCreator || this.checkResponsible || this.checkTaskResponsible || this.checkTaskAttendee) {
          this.editedTaskItem = Object.assign({}, item);
          this.editedTaskItem.checkCreator = _.contains(item.role, 'creator');
          this.editedTaskItem.checkResponsible = _.contains(item.role, 'responsible');
          // this.editedTaskItem.checkAttendee = _.contains(item.role, 'attendee');
          this.editedTaskItem.responsibleName = this.editedTaskItem.responsible['employeeName'];
          this.editedTaskItem.responsible_employee_array = JSON.parse(this.editedTaskItem.responsible['employee_array']);
          this.checkShowTaskItem = !this.checkShowTaskItem;
        }
      },

      updateSourceOfDanger(val) {
        this.editedItem.source_of_danger = val.list;
      },

      viewImage(item) {
        if (item.hasImage) {
          this.openViewImagePopup = !this.openViewImagePopup;
          this.editedImageItem = item.imageUrl;
        }
      },

      // done() {
      //   this.saveConfirm = false
      //   this.close()
      // },

      // totalAttendees(item) {
      //   this.is_Attendees = !this.is_Attendees;
      //   this.expanded = []
      //   this.AttendeesObject = []
      //   const indexExpanded = this.expanded.findIndex((i) => i === item)
      //   if (indexExpanded > -1) {
      //     this.expanded.splice(indexExpanded, 1)
      //   } else {
      //     this.expanded.push(item)
      //     this.AttendeesObject.push({
      //         name: 'Employee 1',
      //         comment: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      //         image: 'Not-Availbale',
      //         status: 1,
      //         actions: 'Declined Verify'
      //       },
      //       {
      //         name: 'Employee 2',
      //         comment: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      //         image: 'Not-Availbale',
      //         status: 0,
      //         actions: 'Declined Verify'
      //       },
      //       {
      //         name: 'Employee 3',
      //         comment: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      //         image: 'Not-Availbale',
      //         status: 1,
      //         actions: 'Declined Verify'
      //       },
      //     )
      //   }
      // },
    },
  };
</script>

<style scoped>
</style>

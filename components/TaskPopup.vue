<template>
  <div>
    <v-dialog v-model="openPopup" max-width="1300px" persistent>
      <v-card>
        <v-card-text>
          <div class="title-model">
            {{ formTitle }}
          </div>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <b-row
              v-if="editMode && editedItem.type !== 'User'"
              align-v="center"
              align-h="end"
            >
              <b-col cols="3">
                <v-btn
                  block
                  @click="viewDetail(editedItem.type)"
                >
                  View detail
                </v-btn>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="12">
                <div class="input-wrap">
                  <v-text-field
                    v-model="editedItem.name"
                    :label="$t('form.name')"
                    :rules="required"
                    outlined
                    :readonly="!checkAdmin && !checkCreator"
                    :hide-details="editedItem.type !== 'User'"
                  />
                </div>
              </b-col>
            </b-row>
            <category
              :category-item="editedItem"
              :categories-array="categoriesValidArray"
              :type-category="category_user_task"
              :is-open-popup="openPopup"
              @getNewCategory="getNewCategory"
            />
            <b-row
              v-if="!editMode || (editMode && editedItem.type === 'User')"
              class="section-description"
            >
              <b-col>
<!--                <v-icon class="icon-question">far fa-question-circle</v-icon>-->
                <div class="input-wrap form-description">
<!--                  <vue-editor-->
<!--                    v-model="editedItem.description"-->
<!--                    :disabled="!checkAdmin && !checkCreator"-->
<!--                  />-->
                  <FroalaSuggestionListEditor
                    :item="editedItem"
                    :predefined-link-array="predefinedLinkArray"
                  />
                </div>
              </b-col>
            </b-row>
            <b-row class="mb-4">
              <b-col cols="6">
                <ResponsiblePerson
                  :object-item="editedItem"
                  :responsible-array="responsibleArray"
                  :read-only="!checkAdmin && !checkCreator"
                />
              </b-col>
            </b-row>
            <b-row class="mb-4">
              <b-col cols="12">
                <AttendeeAddNew
                  v-if="!editMode"
                  :object-item="editedItem"
                />
              </b-col>
            </b-row>

            <div class="title-manage-task pb-5 mb-2">
              {{ $t('title.task_information') }}
            </div>
            <TasKDetailBlock
              :task-array-input="taskArray"
              :departments-array="departmentsArray"
              :task-assignees-array-input="editMode ? taskDetailTaskAssigneesArray : taskAssigneesArray"
              :edit-mode="editMode"
              :object-status-input="editedItem.status"
              :view-mode-input="editedItem.type!=='User'"
              @getTaskArray="getTaskArray"
              @reloadList="reloadList"
            />

            <Security
              :security-item="editedItem"
              :edit-mode="editMode"
              @changeSecurity="changeSecurity"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <div class="input-wrap switch-component question-mark-block">
            <label class="left-text">{{ $t('button.index') }}</label>
            <v-switch
              v-model="editedItem.is_suggestion"
              :disabled="!checkAdmin || !editedItem.is_public"
              inset
              class="right-text"
            />
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
          </div>
          <v-spacer />
          <!-- Show button CANCEL if there are at least 2 buttons -->
          <v-btn
            v-if="((!editMode && (checkAdmin || checkCreator)) || (editMode && (checkAdmin || checkCreator) && editedItem.type === 'User'))"
            class="btn-cancel"
            text
            @click="close"
          >
            {{ $t('button.cancel') }}
          </v-btn>
          <!-- Show button OK if there is only 1 button -->
          <v-btn v-else class="btn-cancel" text @click="close">
            OK
          </v-btn>
          <v-btn
            v-if="!editMode && (checkAdmin || checkCreator)"
            class="btn-save"
            @click="saveNewTask"
          >
            {{ $t('button.save') }}
          </v-btn>
          <v-btn
            v-if="editMode && (checkAdmin || checkCreator) && editedItem.type === 'User'"
            class="btn-save"
            @click="save"
          >
            {{ $t('button.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="openEditedPopup" max-width="1300px" persistent>
      <v-card>
        <v-card-text>
          <div class="title-model">
            Task detail
          </div>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <b-row align-h="center">
              <b-col>
                <div class="input-wrap">
                  <v-text-field
                    v-if="editedItem.type === taskOfTask"
                    v-model="editedItem.subject"
                    label="Subject"
                    name="subject"
                    :rules="required"
                    outlined
                    readonly
                  />
                  <v-text-field
                    v-else
                    v-model="editedItem.name"
                    :label="$t('form.name')"
                    name="name"
                    :rules="required"
                    outlined
                    readonly
                  />
                </div>
              </b-col>
            </b-row>
            <b-row v-if="editedItem.type !== taskOfReport" class="section-description">
              <b-col>
<!--                <v-icon class="icon-question">far fa-question-circle</v-icon>-->
                <div class="input-wrap form-description">
<!--                  <vue-editor v-model="editedItem.description" disabled />-->

                  <FroalaSuggestionListEditor
                    :item="editedItem"
                    :predefined-link-array="predefinedLinkArray"
                  />
                </div>
              </b-col>
            </b-row>
<!--            <connect_to-->
<!--              :edited-item="editedItem"-->
<!--              :departments-array="departmentsArray"-->
<!--              :job-title-array="jobTitleArray"-->
<!--              :project-array="projectArray"-->
<!--              :deny-edit="true"-->
<!--              @updateConnect="checkUpdateConnect"-->
<!--            />-->
            <Security
              :security-item="editedItem"
              :edit-mode="editMode"
              @changeSecurity="changeSecurity"
            />
            <div class="manage-task">
              <div class="title-manage-task pt-7">
                TASKS
              </div>
              <v-data-table
                :headers="headerTaskArray"
                outlined
                :items="taskArray"
                class="elevation-1 table-task with-check-done header-task"
                :items-per-page="15"
                :single-expand="true"
                :search="search"
                hide-default-footer
                :sort-by="['created_at']"
                :sort-desc="[true, false]"
              >
                <template v-slot:item.done="{ item }">
                  <v-checkbox
                    v-if="item.responsiblePerson.indexOf(userID) !== -1"
                    v-model="item.checkDone"
                    :hide-details="true"
                    :disabled="item.checkDone"
                    @change="changeStatusTask"
                  />
                </template>
                <template v-slot:item.name="{ item }">
                  <v-text-field v-model="item.name" :rules="required" disabled />
                </template>
                <template v-slot:item.responsible="{ item }">
                  <v-select
                    v-model="item.responsiblePerson"
                    :items="item.taskAssigneesArray"
                    item-text="name"
                    item-value="id"
                    multiple
                    :rules="required"
                    disabled
                  />
                </template>
                <template v-slot:item.deadline="{ item }">
                  <v-menu v-model="item.modal_deadline" :close-on-content-click="false" min-width="290px">
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="item.deadline"
                        placeholder="DD.MM.YYYY"
                        readonly
                        disabled
                        v-on="on"
                      />
                    </template>
                    <v-date-picker v-model="item.deadline" @input="item.modal_deadline = false">
                      <v-spacer />
                      <v-btn text @click="item.deadline = '', item.modal_deadline = false">
                        Clear
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </template>
                <template v-slot:item.remaining_time="{ item }">
                  <v-text-field v-model="item.remaining_time" :rules="required" disabled />
                </template>
              </v-data-table>
              <div class="pt-4 pb-2">
                <div class="d-flex justify-content-between">
                  <strong>Rate of progress</strong>
                  <strong>{{ Math.ceil(rateProgress) }}%</strong>
                </div>
                <v-progress-linear
                  color="#87a53a"
                  height="20"
                  :value="rateProgress"
                />
              </div>
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <!-- Show button CANCEL if there are at least 2 buttons -->
          <v-btn v-if="!viewOnly" class="btn-cancel" text @click="close">
            {{ $t('button.cancel') }}
          </v-btn>
          <!-- Show button OK if there is only 1 button -->
          <v-btn v-else class="btn-cancel" text @click="close">
            OK
          </v-btn>
          <v-btn v-if="!viewOnly" class="btn-save" @click="save">
            {{ $t('button.save') }}
          </v-btn>
          <!--          <v-btn v-else :disabled="permissionsUser.indexOf('store-goal') === -1" class="btn-save" @click="save">-->
          <!--            Save-->
          <!--          </v-btn>-->

          <!--          <v-btn v-if="editMode" :disabled="permissionsUser.indexOf('destroy-goal') === -1" class="hse-btn-delete" text @click="dialogDelete = true">-->
          <!--            <v-icon dark>-->
          <!--              mdi-delete-->
          <!--            </v-icon>-->
          <!--          </v-btn>-->
        </v-card-actions>
      </v-card>
    </v-dialog>

    <RiskAnalysisPopup
      :open-popup="checkViewRiskAnalysisDetail"
      :risk-analysis-item="objectItem"
      :project-array="projectArray"
      :job-title-array="jobTitleArray"
      :departments-array="departmentsArray"
      :task-assignees-array="taskAssigneesArray"
      :responsible-array="responsibleArray"
      :view-mode-input="true"
      @closePopup="checkViewRiskAnalysisDetail = !checkViewRiskAnalysisDetail"
    />

    <DeviationPopup
      :open-popup="checkViewDeviationDetail"
      :deviation-item="objectItem"
      :categories-array="categoriesArray"
      :project-array="projectArray"
      :job-title-array="jobTitleArray"
      :departments-array="departmentsArray"
      :task-assignees-array="taskAssigneesArray"
      :responsible-array="responsibleArray"
      :view-mode-input="true"
      @closePopup="checkViewDeviationDetail = !checkViewDeviationDetail"
    />

    <ReportChecklistPopup
      :open-popup="checkViewReportChecklistDetail"
      :report-item="objectItem"
      :project-array="projectArray"
      :job-title-array="jobTitleArray"
      :departments-array="departmentsArray"
      :categories-array="categoriesArray"
      :task-assignees-array="taskAssigneesArray"
      :responsible-array="responsibleArray"
      :view-mode-input="true"
      @closePopup="checkViewReportChecklistDetail = !checkViewReportChecklistDetail"
    />

    <GoalPopup
      :open-popup="checkViewGoalDetail"
      :form-title="$t('title.goal_task')"
      :view-only="true"
      :goal-item="objectItem"
      :categories-array="categoriesArray"
      :project-array="projectArray"
      :job-title-array="jobTitleArray"
      :departments-array="departmentsArray"
      :task-assignees-array="taskAssigneesArray"
      :responsible-array="responsibleArray"
      @closePopup="checkViewGoalDetail = !checkViewGoalDetail"
    />
  </div>
</template>

<script>
  import {_} from 'vue-underscore';
  import cookies from 'js-cookie';
  import TasKDetailBlock from "./TasKDetailBlock";
  import RiskAnalysisPopup from "./RiskAnalysisPopup";
  import DeviationPopup from "./DeviationPopup";
  import ReportChecklistPopup from "./ReportChecklistPopup";
  import GoalPopup from "./GoalPopup";
  import Security from "./Security";
  import FroalaSuggestionListEditor from "./FroalaSuggestionListEditor";
  import Category from "./Category";
  import ResponsiblePerson from "./ResponsiblePerson";
  import AttendeeAddNew from "./AttendeeAddNew";

  export default {
    name: "TaskPopup",
    components: {
      GoalPopup,
      TasKDetailBlock,
      RiskAnalysisPopup,
      DeviationPopup,
      ReportChecklistPopup,
      FroalaSuggestionListEditor,
      Security,
      category: Category,
      ResponsiblePerson,
      AttendeeAddNew
    },
    props: {
      taskItem: {
        type: Object,
        required: false,
      },
      openPopup: {
        type: Boolean,
        required: false,
      },
      openEditedPopup: {
        type: Boolean,
        required: false,
      },
      projectArray: Array,
      jobTitleArray: Array,
      departmentsArray: Array,
      viewOnly: {
        type: Boolean,
        required: false,
      },
      tabIndex: {
        type: Number,
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
      predefinedLinkArray: {
        type: Array,
        required: false,
      },
      categoriesArray: Array,
    },
    data: () => ({
      ctoFunction: [
        'Task',
        'Goal',
        'Routine',
        'Instruction',
        'Risk area',
        'Checklist',
      ],
      category: [
        'Task Category 1',
        'Task Category 2',
        'Task Category 3',
        'Task Category 4',
        'Task Category 5',
        'Task Category 6',
        'Task Category 7',
        'Task Category 8',
      ],
      object: [
        'Task Object 1',
        'Task Object 2',
        'Task Object 3',
        'Task Object 4',
        'Task Object 5',
        'Task Object 6',
        'Task Object 7',
        'Task Object 8',
      ],
      connectToObjectTableHeaders: [
        {
          text: 'Name',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        {
          text: 'Source',
          value: 'source'
        },
        {
          text: 'Category',
          value: 'category'
        },
        {
          text: 'Added by',
          value: 'added'
        },
        {
          text: 'Connected by',
          value: 'connected'
        },
        {
          text: 'Connected date',
          value: 'date'
        },
        {
          text: 'Actions',
          value: 'actions',
          sortable: false
        }
      ],
      connectToObjectTable: [
        {
          name: 'Task Object 1',
          source: 'Routine',
          category: 'Task Category 1',
          added: 'Company Admin',
          connected: 'Company Manager',
          date: '15-09-2022',
        },
        {
          name: 'Task Object 2',
          source: 'Task',
          category: 'Task Category 2',
          added: 'Company Admin',
          connected: 'Company Manager',
          date: '15-09-2022',
        }
      ],
      userRoleId: parseInt(cookies.get('roleID')),
      roleUser: cookies.get('roleUser'),
      userDepartmentID: parseInt(cookies.get('userDepartmentID')),
      checkAdmin: cookies.get('checkAdmin'),
      pageKey: 'employees-tasks-tasks',
      titleCaptionKey: '',
      permissionsUser: localStorage.getItem('permissionsKey'),
      userID: parseInt(cookies.get('userID')),
      search: '',
      valid: true,
      listArray: [],
      editedItem: {
        name: "",
        subject: "",
        type: "",
        status: 1,
        added_by: "",
        category_id: '',
        reported_by: "",
        assignee: "",
        goal_id: "",
        task_id: "",
        risk_analysis_id: "",
        user_task_id: "",
        document_id: "",
        requestEdit: false,
        department_id: '',
        project_id: '',
        job_title_id: '',
        editPermission: true,
        is_suggestion: false,
        // table Security
        object_type: 'task',
        is_shared: false,
        is_public: false,
        department_array: [],
        employee_array: [],
        // table Time management
        start_date: '',
        start_date_pre: '',
        deadline: '',
        recurring: '',
      },
      defaultItem: {
        name: "",
        subject: "",
        type: "",
        status: 1,
        added_by: "",
        category_id: '',
        reported_by: "",
        assignee: "",
        goal_id: "",
        task_id: "",
        risk_analysis_id: "",
        user_task_id: "",
        document_id: "",
        requestEdit: false,
        department_id: '',
        project_id: '',
        job_title_id: '',
        editPermission: true,
        is_suggestion: false,
        // table Security
        object_type: 'task',
        is_shared: false,
        is_public: false,
        department_array: [],
        employee_array: [],
        // table Time management
        start_date: '',
        start_date_pre: '',
        deadline: '',
        recurring: '',
      },
      // real data
      required: [
        v => !!v || 'This is required'
      ],
      checkPermission: '',
      editedTask: '', // task item
      headerTaskArray: [
        {text: 'Done', value: 'done', sortable: false, align: 'center', width: '5%'},
        {text: 'Sub task', value: 'name', sortable: false, align: 'center', width: '40%'},
        {text: 'Responsible', value: 'responsible', sortable: false, align: 'center', width: '25%'},
        {text: 'Deadline', value: 'deadline', sortable: false, align: 'center', width: '15%'},
        {text: 'Remaining time', value: 'remaining_time', sortable: false, align: 'center', width: '15%'},
      ],
      taskArray: [],
      newTask: {
        id: '',
        name: '',
        taskAssignees: [],
        taskAssigneesArray: [],
        responsiblePerson: [],
        deadline: '',
        modal_deadline: false,
        checkDone: '',
      },
      defaultTask: {
        id: '',
        name: '',
        taskAssignees: [],
        taskAssigneesArray: [],
        responsiblePerson: [],
        deadline: '',
        modal_deadline: false,
        checkDone: '',
      },
      rateProgress: 0,
      taskOfGoal: 'Goal',
      taskOfRiskAnalysis: 'Risk analysis',
      taskOfReport: 'Report',
      taskOfTask: 'Task',
      taskOfAttachment: 'Attachment',
      taskOfUser: 'User',

      // Setting - checkbox filter
      taskArrayInput: [],
      formDirty: false,
      taskArrayOutput: [],
      // connectCompany: false,
      // connectDepartment: true,
      // connectProject: true,
      // connectJobTitle: false,
      formTitle: 'Edit Task',
      editMode: true,
      dialogConfirmClose: false,
      taskDetailArray: [],
      taskData: {
        name: "",
        assigned_company: false,
        assigned_employee: [],
        assigned_department: [],
      },
      isAddTask: false,
      checkResponsiblePerson: false,
      checkCreator: false,
      checkViewDeviationDetail: false,
      checkViewRiskAnalysisDetail: false,
      checkViewReportChecklistDetail: false,
      checkViewGoalDetail: false,
      objectItem: {
        id:'',
        type:'',
      },
      taskDetailTaskAssigneesArray: [],
      hoverQuestionMark: false,

      // category
      category_user_task: 'task',
      categoriesValidArray: [],
    }),

    computed: {},

    watch: {
      openPopup(value) {
        if (value) {
          if (this.taskItem) {
            this.checkResponsiblePerson = this.taskItem.responsible_id === this.userID;
            this.checkCreator = this.taskItem.added_by === this.userID;
            let categoryId = this.taskItem.category_id;
            this.categoriesValidArray = _.filter(this.categoriesArray, function (item) {
              return (!item.disable_status || (item.disable_status && item.id === categoryId));
            });
            this.editItem(this.taskItem);
          } else {
            this.checkCreator = true;
            this.categoriesValidArray = _.filter(this.categoriesArray, function (item) {
              return !item.disable_status;
            });
            this.addNew();
          }
        }
      },
    },

    mounted() {},

    created() {
      if (this.openPopup && !this.taskItem) {
        this.addNew();
      }
    },

    methods: {
      editConnectToObject(payload){
        console.log(payload)
      },
      addConnectToObject(payload){
        console.log(payload)
      },
      changeSecurity(val) {
        if (val !== 'all') {
          this.editedItem.is_suggestion = false;
        }
      },

      getNewCategory(value) {
        this.editedItem.category_id = value.newCategoryId;
      },

      addNew() {
        this.reset();
        let defaultCategory = _.findWhere(this.categoriesValidArray, {is_primary: 1});
        if (defaultCategory) {
          this.editedItem.category_id = defaultCategory.id;
        }
        this.formTitle = 'New Task';
        this.editMode = false;
        // this.connectDepartment = false;
        // this.connectProject = false;
        // this.connectJobTitle = false;
      },

      editItem(item) {
        let that = this;
        that.formDirty = false;
        that.$nuxt.$loading.start();
        if (item.type === 'User') {
          that.$store.dispatch('tasks/showUserTask', item.type_id).then(result => {
            that.editedItem = Object.assign({}, result.data);
            if (result.data) {
              if (that.editedItem.department_array === null) {
                that.editedItem.department_array = [];
              } else {
                that.editedItem.department_array = JSON.parse(that.editedItem.department_array);
              }
              if (that.editedItem.employee_array === null) {
                that.editedItem.employee_array = [];
              } else {
                that.editedItem.employee_array = JSON.parse(that.editedItem.employee_array);
              }
              that.editedItem.type = 'User';
              // that.editedItem.status = result.data.status;
              if (result.data.tasks.length > 0) {
                that.getTaskTypeDetail(result.data.tasks);
                that.$nuxt.$loading.finish();
              }
            }
          }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_task_view_detail'));
            }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish();
          });
          that.$nuxt.$loading.finish();
        } else if (item.type === 'Risk analysis') {
          that.editedItem = Object.assign({}, item);
          that.$store.dispatch('riskAnalysis/show', item.type_id).then(result => {
            that.editedItem.status = result.data.status;
            that.editedItem.responsible_id = result.data.responsible_id;
            that.editedItem.deadline = result.data.deadline;
            if (result.data.tasks) {
              that.getTaskTypeDetail(result.data.tasks);
              that.$nuxt.$loading.finish();
            }
          }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_risk_analysis_view_detail'));
            }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish();
          });
        } else if (item.type === 'Deviation') {
          that.editedItem = Object.assign({}, item);
          that.$store.dispatch('deviations/show', item.type_id).then(result => {
            that.editedItem.status = result.data.status;
            that.editedItem.responsible_id = result.data.responsible_id;
            that.editedItem.deadline = result.data.deadline;
            if (result.data.tasks) {
              that.getTaskTypeDetail(result.data.tasks);
              that.$nuxt.$loading.finish();
            }
          }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_deviation_view_detail'));
            }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish();
          });
        } else if (item.type === 'Report') {
          that.editedItem = Object.assign({}, item);
          that.$store.dispatch('reports/show', item.type_id).then(result => {
            that.editedItem.status = result.data.status;
            that.editedItem.responsible_id = result.data.responsible_id;
            that.editedItem.deadline = result.data.deadline;
            if (result.data.tasks) {
              that.getTaskTypeDetail(result.data.tasks);
              that.$nuxt.$loading.finish();
            }
          }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_checklist_report_view_detail'));
            }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish();
          });
        } else if (item.type === 'Goal') {
          that.editedItem = Object.assign({}, item.goalObject);
          if (item.tasks) {
            that.getTaskTypeDetail(item.tasks);
            that.$nuxt.$loading.finish();
          }
          // that.$store.dispatch('tasks/showGoal', item.type_id).then(result => {
          //   console.log(result.data);
          //   that.editedItem.status = result.data.status;
          //   that.editedItem.responsible_id = result.data.responsible_id;
          //   that.editedItem.deadline = result.data.deadline;
          //   // if (result.data.tasks) {
          //   //   that.getTaskTypeDetail(result.data.tasks);
          //   //   that.$nuxt.$loading.finish();
          //   // }
          // }).catch((error) => {
          //   that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          //   that.$nuxt.$loading.finish();
          // });
          that.$nuxt.$loading.finish();
        }
      },

      getTaskTypeDetail(tasks) {
        let that = this;
        _.each(tasks, function (task) {
          if (task.status !== 5) {
            let assignee = _.findWhere(task.task_assignees, {user_id: that.userID});
            if (assignee !== undefined) {
              task.assigneeId = assignee.user_id;
              task.assigneeStatus = assignee.status;
            } else {
              task.assigneeId = '';
              task.assigneeStatus = '';
            }
            if (!task.assigned_department || task.assigned_department.length < 1) {
              task.assigned_department = [];
            } else {
              let assigned_department = JSON.stringify(task.assigned_department);
              task.assigned_department = JSON.parse(assigned_department);
            }

            that.taskDetailTaskAssigneesArray = _.clone(that.taskAssigneesArray);
            if (!task.assigned_employee || task.assigned_employee.length < 1) {
              task.assigned_employee = [];
            } else {
              let assigned_employee = JSON.stringify(task.assigned_employee);
              task.assigned_employee = JSON.parse(assigned_employee);
            }
            that.taskDetailTaskAssigneesArray = _.filter(that.taskDetailTaskAssigneesArray, function(employee){
              return (!employee.disable_status
                || (employee.disable_status && _.indexOf(task.assigned_employee, employee.id) > -1));
            });
            // task.checkAllAssigneeDone = _.every(task.task_assignees, function (task_assignee) {
            //   return task_assignee.status === 3;
            // })

            task.checkAllAssigneeDone = true;
            task.checkPending = false;
            task.assigneeProcessingArray = [];
            task.assignOnlyResponsiblePerson = false;

            _.each(task.task_assignees, function (task_assignee) {
              if (task_assignee.status < 3 || task_assignee.status === 4) {
                task.checkAllAssigneeDone = false;
                task.assigneeProcessingArray.push(task_assignee.user_id);
                if (task_assignee.status === 4) {
                  task.checkPending = true;
                }
              }
            });

            if (task.assigneeProcessingArray.length === 1 && that.userID === task.assigneeId) {
              task.assignOnlyResponsiblePerson = true;
            }

            task.isAddDescription = false;

            task.checkReadOnly = task.status > 1;

            that.taskArray.push(task);
          }
        });
      },

      checkDirtyBeforeClose(){
        if(this.checkDirtyForm()){
          this.dialogConfirmClose = true;
        }else{
          this.close();
        }
      },

      checkDirtyForm(){
        let that = this;
        let result = false;
        _.each(that.editedItem, function(value, key, obj) {
          if(that.originData && obj[key] && that.originData[key] && obj[key] !== that.originData[key]){
            result = true;
          }
        });
        return result;
      },

      close() {
        this.reset();
        if (this.openPopup) {
          this.$emit('closePopup');
        }
        this.formDirty = false;
        this.taskDetailArray = [];
        this.taskArray = [];
        this.isAddTask = false;
        this.checkViewRiskAnalysisDetail = false;
        this.checkViewDeviationDetail = false;
        this.checkViewReportChecklistDetail = false;
        this.checkViewGoalDetail = false;
      },

      reset() {
        this.taskArray = [];
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.newTask = Object.assign({}, this.defaultTask);
          // this.editedIndex = -1;
          // this.$refs.form.reset();
          this.$refs.form.resetValidation();
          // this.filterEmployees();
        }, 300);
      },

      // filterEmployees() {
      //   let that = this;
      //   if (!that.connectDepartment) {
      //     that.editedItem.department_id = '';
      //   }
      //   if (!that.connectJobTitle) {
      //     that.editedItem.job_title_id = '';
      //   }
      //   if (!that.connectProject) {
      //     that.editedItem.project_id = '';
      //   }
      //   that.$store.dispatch('employees/index', {department: that.editedItem.department_id, job_title: that.editedItem.job_title_id, project: that.editedItem.project_id}).then(function () {
      //     if (that.taskArray.length > 0) {
      //       _.each(that.taskArray, function (task) {
      //         if (task.taskAssignees.length > 0 || task.responsiblePerson.length > 0 || task.taskAssigneesArray.length > 0) {
      //           task.taskAssigneesArray = that.taskAssigneesArray;
      //           task.taskAssignees = [];
      //           task.responsiblePerson = [];
      //         }
      //       });
      //     }
      //
      //     if (that.taskArrayOutput.length > 0) {
      //       _.each(that.taskArrayOutput, function (task) {
      //         if (task.taskAssignees.length > 0 || task.responsiblePerson.length > 0 || task.taskAssigneesArray.length > 0) {
      //           task.taskAssigneesArray = that.taskAssigneesArray;
      //           task.taskAssignees = [];
      //           task.responsiblePerson = [];
      //         }
      //       });
      //     }
      //   }).catch((error) => {
      //     that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
      //     that.$nuxt.$loading.finish();
      //   });
      // },

      edit() {
        this.editedItem.requestEdit = true;
        // this.checkDenyEdit();
      },

      save() {
        let that = this;
        // if (that.$refs.form.validate()) {
        that.$nuxt.$loading.start();
        that.editedItem.tasks = that.taskDetailArray;
        that.editedItem.requestEdit = true;

        if (that.editedItem.type === that.taskOfGoal) {
          that.$store.dispatch('tasks/updateGoal', that.editedItem).then(function(){
            that.reloadList();
            that.$toaster.success(that.$i18n.t('message.success_task_update'));
          }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_task_update'));
            }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage);
            that.$nuxt.$loading.finish();
          });
        } else if (that.editedItem.type === that.taskOfRiskAnalysis) {
          that.$store.dispatch('tasks/updateRiskAnalysis', that.editedItem).then(function(){
            that.reloadList();
            that.$toaster.success(that.$i18n.t('message.success_task_update'));
          }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_task_update'));
            }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage);
            that.$nuxt.$loading.finish();
          });
        } else if (that.editedItem.type === that.taskOfReport) {
          that.$store.dispatch('tasks/updateReportTask', that.editedItem).then(function(){
            that.reloadList();
            that.$toaster.success(that.$i18n.t('message.success_task_update'));
          }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_task_update'));
            }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage);
            that.$nuxt.$loading.finish();
          });

          // that.$store.dispatch('tasks/progressTask', that.editedItem).then(function(){
          //   that.reloadList();
          // }).catch(error) => {
          //   that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage);
          //   that.$nuxt.$loading.finish();
          // });
        } else if (that.editedItem.type === that.taskOfDeviation) {
          that.$store.dispatch('tasks/updateDeviation', that.editedItem).then(function(){
            that.reloadList();
            that.$toaster.success(that.$i18n.t('message.success_task_update'));
          }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_task_update'));
            }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage);
            that.$nuxt.$loading.finish();
          });
        } else if (that.editedItem.type === that.taskOfUser) {
          that.editedItem.start_date = that.editedItem.start_date_pre;
          that.$store.dispatch('userTasks/update', that.editedItem).then(function(){
            that.reloadList();
            that.$toaster.success(that.$i18n.t('message.success_task_update'));
          }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_task_update'));
            }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage);
            that.$nuxt.$loading.finish();
          });
        } else {
          that.$store.dispatch('tasks/updateAttachment', that.editedItem).then(function(){
            that.reloadList();
            that.$toaster.success(that.$i18n.t('message.success_task_update'));
          }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_task_update'));
            }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage);
            that.$nuxt.$loading.finish();
          });
        }

        // if (that.editMode) {
        //   // edit
        //   that.$store.dispatch('tasks/update', that.editedItem).then(function () {
        //     that.reloadList();
        //   }).catch((error) => {
        //     that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        //     that.$nuxt.$loading.finish();
        //   });
        // } else {
        //   // create task
        //   that.editedItem.status = "new";
        //   that.$store.dispatch('tasks/store', that.editedItem).then(function () {
        //     that.reloadList();
        //     that.editedItem = that.defaultItem;
        //     that.$nuxt.$loading.finish();
        //   }).catch((error) => {
        //     that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        //     that.$nuxt.$loading.finish();
        //   });
        // }
        that.close();
        // }
      },

      viewDetail(type) {
        this.objectItem.type = type;
        this.objectItem.id = this.editedItem.type_id;
        if (type === 'Deviation') {
          this.checkViewDeviationDetail = true;
        } else if (type === 'Risk analysis') {
          this.checkViewRiskAnalysisDetail = true;
        } else if (type === 'Report') {
          this.checkViewReportChecklistDetail = true;
        } else if (type === 'Goal') {
          this.checkViewGoalDetail = true;
        }
      },

      reloadList(){
        this.$emit('reloadList');
      },

      changeTab(value) {
        this.$emit('changeTab', value);
      },

      saveNewTask() {
        if (this.$refs.form.validate()) {
          let that = this;
          that.editedItem.tasks = that.taskDetailArray;
          that.editedItem.start_date = that.editedItem.start_date_pre;
          that.$store.dispatch('userTasks/store', that.editedItem).then(function(){
            that.$nuxt.$loading.start();
            that.reloadList();
            that.$toaster.success(that.$i18n.t('message.success_task_add_new'));
          }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_task_add_new'));
            }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish();
          });
          that.close();
        }
      },

      getTaskArray(value) {
        this.taskDetailArray = value.taskArray;
      },

      changeStatusTask() {
        let totalTask = 0;
        let doneTask = 0;
        _.each(this.taskArray, function (task) {
          if (_.isBoolean(task.checkDone)) {
            totalTask = totalTask + 1;
            if (task.checkDone) {
              doneTask = doneTask + 1;
            }
          }
        });
        this.rateProgress = doneTask / totalTask * 100;
      },
    },
  };
</script>

<style scoped>

</style>

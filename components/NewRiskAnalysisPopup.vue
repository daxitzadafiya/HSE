<template>
  <div>
    <v-dialog v-model="openPopup" max-width="1125px" max-height="80%" persistent>
      <v-card>
        <v-card-text>
          <div class="popup-header text-center">
            {{ formTitle }}
          </div>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <b-row>
              <b-col cols="12">
                <div class="input-wrap">
                  <v-text-field v-model="editedItem.name" :label="$t('form.name')" :rules="required"
                                :readonly="editMode" outlined/>
                </div>
              </b-col>
            </b-row>
            <!--            <connect_to-->
            <!--              :edited-item="editedItem"-->
            <!--              :departments-array="departmentsArray"-->
            <!--              :job-title-array="jobTitleArray"-->
            <!--              :project-array="projectArray"-->
            <!--              :deny-edit="editMode"-->
            <!--              @updateConnect="checkUpdateConnect"-->
            <!--            />-->
            <risk_element_source_danger
              :item="editedItem"
              :edited-index="editMode ? editedItem.id : -1"
              :risk-element-source-array="riskElementSourceArray"
              @getSourceOfDangerArray="getSourceOfDangerArray"
            />
            <!-- <b-row v-if="riskElementAnalysis && riskElementAnalysis.length > 0 && !editMode">
              <b-col cols="2">
                <div class="bold-title md-line-height">
                  {{ $t('form.process') }}
                </div>
              </b-col>
              <b-col>
                <div class="input-wrap">
                  <div class="switch-component">
                    <label class="left-text">{{ $t('form.none') }}</label>
                    <v-switch
                      v-model="editedItem.need_to_process"
                      :label="$t('form.activate')"
                      class="right-text"
                      :readonly="!editedItem.editPermission"
                    />
                  </div>
                </div>
              </b-col> -->

            <!--              <v-checkbox-->
            <!--                v-if="riskElementAnalysis.length > 0 && !editMode"-->
            <!--                v-model="editedItem.need_to_process"-->
            <!--                :label="$t('form.need_to_be_progressed')"-->
            <!--              />-->
            <!-- </b-row> -->
            <b-row>
              <b-col cols="6">
                <v-select
                  v-if="editMode"
                  v-model="editedItem.responsible"
                  label="Responsible "
                  :items="responsibleArray"
                  item-text="name"
                  item-value="id"
                  :rules="required"
                  outlined
                  :readonly="editMode && editedItem.status > 1"
                />
              </b-col>
            </b-row>
            <Security
              :security-item="editedItem"
              :edit-mode="editMode"
              @changeSecurity="changeSecurity"
            />
            <b-row>
              <b-col cols="2" class="hse-document-badge-tab">
                <div class="bold-title md-line-height">
                  {{ $t('form.task') }}
                </div>
                <v-badge
                  :value="hover"
                  right
                  transition="slide-x-transition"
                  class="hse-badge-icon"
                >
                  <span slot="badge">{{ $t('message.hover_task') }}</span>
                  <v-hover v-model="hover">
                    <i class="fa fa-question-circle"></i>
                  </v-hover>
                </v-badge>
              </b-col>
              <b-col>
                <div class="input-wrap">
                  <div class="switch-component">
                    <label class="left-text">{{ $t('form.none') }}</label>
                    <v-switch
                      v-model="editedItem.is_task"
                      :label="$t('form.activate')"
                      class="right-text"
                      inset
                      :readonly="!editedItem.editPermission"
                    />
                  </div>
                </div>
                <AddTaskPopup
                  :open-popup="editedItem.is_task"
                  :form-title="$t('title.add_new_task')"
                  :object-field="objectField"
                  :object-item="editedItem"
                  :categories-array="categoriesArray"
                  :predefinedLinkArray="predefinedLinkArray"
                  :categories-type="'task'"
                  @closePopup="editedItem.is_task = !editedItem.is_task"
                  @savePopup="AddTask"
                />
              </b-col>
            </b-row>

            <div
              v-if="!viewMode && editMode && editedItem.need_to_process && (checkAdmin || permissionsUser.indexOf('risk analysis-basic') > -1)"
              class="manage-task pt-4">
              <!--                      <v-btn v-if="!checkAddPlan" class="btn-create-task" outlined @click="addPlan">-->
              <!--                        Add New Task-->
              <!--                      </v-btn>-->
              <div class="w-100">
                <div class="title-manage-task">
                  {{ $t('title.need_to_be_progressed') }}
                </div>
                <v-container v-if="!editedItem.allow_close_by_admin" fluid>
                  <b-row>
                    <b-col cols="6">
                      <DatePicker
                        :label="$t('form.start_date')"
                        :item="editedItem"
                        :date-input="editedItem.start_time"
                        :use-keyboard="true"
                        :past-date="false"
                        :future-date="true"
                        :default-today="true"
                        @getDate="getStartDate"
                      />
                    </b-col>
                    <b-col cols="6">
                      <DatePicker
                        :label="$t('form.due_date')"
                        :item="editedItem"
                        :date-input="editedItem.deadline"
                        :use-keyboard="true"
                        :past-date="false"
                        :future-date="true"
                        @getDate="getDeadline"
                      />
                    </b-col>
                    <b-col cols="6">
                      <ResponsiblePerson
                        :object-item="editedItem"
                        :responsible-array="responsibleArray"
                        :label="'Task responsible'"
                      />
                      <!--                      <v-select-->
                      <!--                        v-model="editedItem.responsible_id"-->
                      <!--                        label="Task responsible"-->
                      <!--                        :items="responsibleArray"-->
                      <!--                        item-text="name"-->
                      <!--                        item-value="id"-->
                      <!--                        :rules="required"-->
                      <!--                        outlined-->
                      <!--                      />-->
                    </b-col>
                  </b-row>
                  <TasKDetailBlock
                    :task-array-input="taskArray"
                    :departments-array="departmentsArray"
                    :task-assignees-array-input="editMode && editedItem.status > 1 ? riskAnalysisTaskAssigneesArray : taskAssigneesArray"
                    :edit-mode="false"
                    :object-status-input="editedItem.status"
                    @getTaskArray="getTaskArray"
                    @reloadList="reloadList"
                  />
                </v-container>
              </div>
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions class="popup-footer">
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
          <div
            v-if="!viewMode && editMode && editedItem.need_to_process && (checkAdmin || permissionsUser.indexOf('risk analysis-basic') > -1) && editedItem.status === 1"
            class="input-wrap mr-3"
          >
            <div class="switch-component">
              <v-switch
                v-model="editedItem.allow_close_by_admin"
                :label="$t('title.closed')"
                :readonly="editedItem.status > 2"
                class="right-text"
                inset
              />
            </div>
          </div>
          <!--            <v-checkbox-->
          <!--              v-model="editedItem.allow_close_by_admin"-->
          <!--              label="Mark as closed"-->
          <!--              :readonly="editedItem.status > 2"-->
          <!--            />-->
          <!--          </div>-->
          <v-btn class="btn-cancel" text @click="close">
            {{ $t('button.cancel') }}
          </v-btn>
          <!-- New -->
          <v-btn
            v-if="!viewMode && !editMode && (checkAdmin || permissionsUser.indexOf('risk analysis-basic') > -1)"
            class="btn-save"
            @click="riskElementAnalysis.length > 0 ? save() : (dialogNotAllowToSave = true)"
          >
            {{ $t('button.save') }}
          </v-btn>
          <!-- PROCESS -->
          <v-btn
            v-if="!viewMode && editMode && editedItem.status === 2 && !editedItem.reopen && (checkResponsiblePerson || checkAdmin)"
            class="hse-btn-save"
            @click="dialogChangeResponsible = true"
          >
            {{ $t('button.change_responsible_person') }}
          </v-btn>
          <v-btn
            v-if="!viewMode && editMode
              && ((editedItem.status === 1 || (editedItem.status === 6 && isReopen)) && (editedItem.allow_close_by_admin || taskDetailArray))
              && (checkAdmin || checkResponsiblePerson)"
            class="btn-save"
            @click="taskDetailArray.length > 0 ? save() : (dialogNotAllowToSave = true)"
          >
            {{ $t('button.save') }}
          </v-btn>
          <!--          v-if="!viewMode && editMode && editedItem.status < 3 && editedItem.is_action_done && (checkAdmin || checkResponsiblePerson)"-->
          <v-btn
            v-if="!viewMode && editMode && editedItem.status === 6 && !isReopen && (checkAdmin || checkResponsiblePerson)"
            class="hse-btn-save"
            @click="reOpenReport"
          >
            {{ $t('button.reopen') }}
          </v-btn>
          <!--          v-if="!viewMode && editMode && editedItem.status < 3 && editedItem.is_action_done && (checkAdmin || checkResponsiblePerson)"-->
          <v-btn
            v-if="!viewMode && editMode && editedItem.status === 6 && !isReopen && (checkAdmin || checkResponsiblePerson)"
            class="btn-save"
            @click="closeReport"
          >
            {{ $t('button.done') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
            {{ $t('button.cancel') }}
          </v-btn>
          <v-btn class="btn-save" @click="deleteItem(editedItem)">
            {{ $t('button.delete') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogChangeResponsible" max-width="500px">
      <v-card>
        <v-card-text>
          <div class="popup-header text-center">
            {{ $t('title.change_responsible_person') }}
          </div>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <b-row>
              <b-col>
                <v-select
                  v-if="editMode"
                  v-model="editedItem.responsible"
                  label="Responsible person of risk analysis"
                  :items="responsibleArray"
                  item-text="name"
                  item-value="id"
                  :rules="required"
                  outlined
                />
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <ResponsiblePerson
                  :object-item="editedItem"
                  :responsible-array="responsibleArray"
                  :label="'Responsible person of task'"
                />
                <!--                <v-select-->
                <!--                  v-model="editedItem.responsible_id"-->
                <!--                  label="Responsible person of task"-->
                <!--                  :items="responsibleArray"-->
                <!--                  item-text="name"-->
                <!--                  item-value="id"-->
                <!--                  :rules="required"-->
                <!--                  outlined-->
                <!--                />-->
              </b-col>
            </b-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="popup-footer">
          <v-spacer />
          <v-btn class="btn-cancel" text @click="close">
            {{ $t('button.cancel') }}
          </v-btn>
          <!-- New -->
          <v-btn
            class="btn-save"
            @click="updateResponsible"
          >
            {{ $t('button.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Check condition allow to click button SAVE -->
    <v-dialog v-model="dialogNotAllowToSave" max-width="500px">
      <v-card class="dialog-delete text-center">
        <v-card-text>
          <div class="confirm-delete-title">
            {{ $t('title.notice') }}
          </div>
          <div v-if="!editMode && riskElementAnalysis.length <= 0" class="confirm-delete-text">
            {{ $t('message.you_have_to_choose_at_least_one_source_of_danger') }}
          </div>
          <div v-if="editMode && taskDetailArray.length <= 0" class="confirm-delete-text">
            {{ $t('message.you_have_to_add_at_least_one_task') }}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn class="btn-save" @click="dialogNotAllowToSave = false">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import {_} from 'vue-underscore';
  import cookies from 'js-cookie';
  import AddTaskPopup from "./AddTaskPopup";
  import RiskElementAndSourcesOfDanger from "./RiskElementAndSourcesOfDanger";
  import TasKDetailBlock from "./TasKDetailBlock";
  import DatePicker from "./DatePicker";
  import Security from "./Security";
  import ResponsiblePerson from "./ResponsiblePerson";

  export default {
    name: "NewRiskAnalysisPopup",
    components: {
      risk_element_source_danger: RiskElementAndSourcesOfDanger,
      AddTaskPopup,
      TasKDetailBlock,
      DatePicker,
      Security,
      ResponsiblePerson
    },
    props: {
      riskAnalysisItem: {
        type: Object,
        required: false,
      },
      categoriesArray: {
        type: Array,
        required: false,
      },
      predefinedLinkArray: {
        type: Array,
        required: false,
      },
      openPopup: Boolean,
      jobTitleArray: Array,
      departmentsArray: Array,
      viewModeInput: {
        type: Boolean,
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
    },
    data: () => ({
      userRoleId: parseInt(cookies.get('roleID')),
      userDepartmentID: parseInt(cookies.get('userDepartmentID')),
      pageKey: 'reports-report-riskanalysis-risk-analysis',
      permissionsUser: localStorage.getItem('permissionsKey'),
      checkAdmin: cookies.get('checkAdmin'),
      roleUser: cookies.get('roleUser'),
      userID: parseInt(cookies.get('userID')),
      nowDate: new Date().toISOString().substr(0, 10),
      search: '',
      valid: true,
      validAction: true,
      hover: false,
      listArray: [],
      objectField: [
        'name',
        'description',
        'category',
        'responsible',
        'attendee',
        'start-date',
        'deadline',
        'security'
      ],
      editedItem: {
        name: '',
        status: 1,
        department_id: '',
        job_title_id: '',
        need_to_process: false,
        is_task: false,
        allow_close_by_admin: false,
        reopen: 0,
        deadline: '',
        deadline_pre: '',
        start_time: '',
        start_time_pre: '',
        updateResponsible: false,
        editPermission: true,
        is_suggestion: false,
        // table Security
        object_type: 'risk-analysis',
        is_shared: false,
        is_public: false,
        department_array: [],
        employee_array: [],
      },
      defaultItem: {
        name: '',
        status: 1,
        department_id: '',
        job_title_id: '',
        need_to_process: false,
        is_task: false,
        allow_close_by_admin: false,
        reopen: 0,
        deadline: '',
        deadline_pre: '',
        start_time: '',
        start_time_pre: '',
        updateResponsible: false,
        editPermission: true,
        is_suggestion: false,
        // table Security
        object_type: 'risk-analysis',
        is_shared: false,
        is_public: false,
        department_array: [],
        employee_array: [],
      },
      required: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else return true;
        }
      ],
      tabIndex: 0,
      riskElementSourceArray: [],
      riskElementAnalysis: [],
      checkNewRiskElement: false,
      checkAddPlan: false,
      menu: false,
      checkPermission: '',
      department: 0,
      job_title: 0,
      newTask: {
        id: '',
        name: '',
        status: 1,
        taskAssignees: [],
        taskAssigneesArray: [],
        responsiblePerson: [],
        deadline: '',
        modal_deadline: false,
      },
      defaultTask: {
        id: '',
        name: '',
        status: 1,
        taskAssignees: [],
        taskAssigneesArray: [],
        responsiblePerson: [],
        deadline: '',
        modal_deadline: false,
      },
      taskArray: [],
      formTitle: '',
      editMode: true,
      taskDetailArray: [],

      // reopen deviation
      isReopen: false,

      viewMode: false,
      checkResponsiblePerson: false,
      deadline: '',
      start_time: '',
      riskAnalysisTaskAssigneesArray: [],
      hoverQuestionMark: false,
      // popup
      dialogDelete: false,
      dialogChangeResponsible: false,
      dialogNotAllowToSave: false,
    }),

    computed: {},

    watch: {
      openPopup(value) {
        if (value) {
          this.viewMode = this.viewModeInput;
          if (this.riskAnalysisItem) {
            this.checkResponsiblePerson = this.riskAnalysisItem.responsible === this.userID;
            this.editItem(this.riskAnalysisItem);
          } else {
            this.addNew();
          }
        }
      },
    },

    mounted() {
      let that = this;
      //Get risk element list
      that.$store.dispatch('riskElementSource/index').then(result => {
        // that.riskElementSourceArray = result.data;
        that.riskElementSourceArray = _.filter(result.data, function (item) {
          return !item.is_template;
        });
      }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
        that.$toaster.error(that.$i18n.t('message.fail_risk_element_view'));
        }
        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });

      // // list all managers = responsible person
      // that.$store.dispatch('employees/index').then(result => {
      //   // that.responsibleArray = _.filter(result.data, function (item) {
      //   //   return item.role_id === 2 || item.role_id === 3;
      //   // });
      //   that.taskAssigneesArray = result.data;
      //   that.responsibleArray = _.clone(result.data);
      //   that.responsibleArray = _.filter(that.responsibleArray, function (item) {
      //     return item.role_id === 3 || item.role_id === 2;
      //   });
      // }).catch((error) => {
      //   that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
      //   that.$nuxt.$loading.finish();
      // });
    },

    created() {
      if (this.openPopup) {
        if (this.riskAnalysisItem) {
          this.editItem(this.riskAnalysisItem);
        } else {
          this.addNew();
        }
      }
    },

    methods: {
      AddTask() {
        this.editedItem.is_task = false
      },
      changeSecurity(val) {
        if (val !== 'all') {
          this.editedItem.is_suggestion = false;
        }
      },

      updateResponsible() {
        let that = this;
        that.$nuxt.$loading.start();
        that.editedItem.updateResponsible = true;
        that.$store.dispatch('riskAnalysis/update', that.editedItem).then(function () {
          that.reloadList();
          that.$toaster.success(that.$i18n.t('message.success_risk_analysis_update'));
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_risk_analysis_update'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
        that.close();
      },

      getDeadline(value) {
        this.deadline = value.date;
        this.editedItem.deadline_pre = this.deadline;
      },

      getStartDate(value) {
        this.start_time = value.date;
        this.editedItem.start_time_pre = this.start_time;
      },

      getTaskArray(value) {
        this.taskDetailArray = value.taskArray;
      },

      addNew() {
        this.reset();
        this.formTitle = this.$i18n.t('title.new_risk_analysis');
        this.editMode = false;
        this.riskElementAnalysis = [];
      },

      async editItem(item) {
        let that = this;
        that.$nuxt.$loading.start();
        that.formTitle = that.$i18n.t('title.edit_risk_analysis');

        await that.$store.dispatch('riskAnalysis/show', item.id).then(result => {
          that.editedItem = Object.assign({}, result.data);
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
          if (result.data.status === 4) {
            that.editedItem.allow_close_by_admin = true;
          }
          if (result.data.tasks.length > 0) {
            _.each(result.data.tasks, function (task) {
              if (task.status !== 5) {
                let assignee = _.findWhere(task.task_assignees, {user_id: that.userID});
                if (assignee !== undefined) {
                  task.assigneeId = assignee.user_id;
                  task.assigneeStatus = assignee.status;
                } else {
                  task.assigneeId = '';
                  task.assigneeStatus = '';
                }
                if (task.assigned_department === null) {
                  task.assigned_department = [];
                } else {
                  task.assigned_department = JSON.parse(task.assigned_department);
                }

                that.riskAnalysisTaskAssigneesArray = _.clone(that.taskAssigneesArray);
                if (task.assigned_employee === null) {
                  task.assigned_employee = [];
                } else {
                  task.assigned_employee = JSON.parse(task.assigned_employee);
                }
                that.riskAnalysisTaskAssigneesArray = _.filter(that.riskAnalysisTaskAssigneesArray, function (employee) {
                  return (!employee.disable_status
                    || (employee.disable_status && _.indexOf(task.assigned_employee, employee.id) > -1));
                });

                task.checkAllAssigneeDone = _.every(task.task_assignees, function (task_assignee) {
                  return task_assignee.status === 3;
                });
                task.isAddDescription = false;

                task.checkReadOnly = task.status >= 1;

                that.taskArray.push(task);
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
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      },

      checkDirtyBeforeClose() {
        if (this.checkDirtyForm()) {
          this.dialogConfirmClose = true;
        } else {
          this.close();
        }
      },

      checkDirtyForm() {
        let that = this;
        let result = false;
        _.each(that.editedItem, function (value, key, obj) {
          if (that.originData && obj[key] && that.originData[key] && obj[key] !== that.originData[key]) {
            result = true;
          }
        });
        return result;
      },

      close() {
        this.reset();
        this.dialogConfirmClose = false;
        this.dialogChangeResponsible = false;
        this.formDirty = false;
        this.isReopen = false;
        this.taskDetailArray = [];
        this.taskArray = [];
        this.riskElementAnalysis = [];
        this.deadline = '';
        this.start_time = '';
        this.$emit('closePopup');
      },

      reset() {
        // this.denyEdit = false;
        // this.isClosed = false;
        // this.$nuxt.$loading.finish();
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          // this.$refs.form.reset();
          this.$refs.form.resetValidation();
          // this.filterEmployees();
        }, 300);
      },

      save() {
        let that = this;
        that.isReopen = false;
        if (that.$refs.form.validate()) {
          that.$nuxt.$loading.start();
          that.editedItem.deadline = that.editedItem.deadline_pre;
          that.editedItem.start_time = that.editedItem.start_time_pre;
          // that.editedItem.is_public = that.connectCompany;
          that.editedItem.risk_elements = that.riskElementAnalysis;
          if (that.editedItem.allow_close_by_admin) {
            that.editedItem.status = 4; //cancel risk analysis
          } else {
            that.editedItem.tasks = that.taskDetailArray;
          }
          if (that.editMode) {
            if (!that.editedItem.allow_close_by_admin) {
              that.editedItem.status = 2;
            }
            // that.editedItem.status = 2;
            that.$store.dispatch('riskAnalysis/update', that.editedItem).then(function () {
              that.reloadList();
              that.$toaster.success(that.$i18n.t('message.success_risk_analysis_update'));
            }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_risk_analysis_update'));
              }
              // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
              that.$nuxt.$loading.finish();
            });
          } else {
            // create
            if (!that.editedItem.need_to_process) {
              that.editedItem.status = 3;
              that.editedItem.need_to_process = 0;
            } else {
              that.editedItem.need_to_process = 1;
            }
            that.$store.dispatch('riskAnalysis/store', that.editedItem).then(function () {
              that.reloadList();
              that.$toaster.success(that.$i18n.t('message.success_risk_analysis_add_new'));
            }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_risk_analysis_add_new'));
              }
              // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
              that.$nuxt.$loading.finish();
            });
          }
          that.close();
        }
      },

      reOpenReport() {
        if (this.$refs.form.validate()) {
          this.isReopen = true;
          this.editedItem.action = null;
          // this.editedItem.is_action_done = false;
          this.editedItem.responsible_id = '';
          // this.editedItem.deadline = '';
          this.editedItem.reopen = 1;
          this.taskArray = [];
          // this.$store.dispatch('riskAnalysis/update', this.editedItem).then(function () {
          //   this.$nuxt.$loading.start();
          //   this.reloadList();
          // }).catch(error => {
          //   this.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          //   this.$nuxt.$loading.finish();
          // });
        }
      },

      closeReport() {
        let that = this;
        that.isReopen = false;
        if (that.$refs.form.validate()) {
          that.$nuxt.$loading.start();
          that.editedItem.status = 3;
          that.$store.dispatch('riskAnalysis/update', this.editedItem).then(function () {
            that.reloadList();
            that.$toaster.success(that.$i18n.t('message.success_risk_analysis_update'));
          }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_risk_analysis_update'));
            }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish();
          });
          that.close();
        }
      },

      reloadList() {
        this.$emit('reloadList');
      },

      // checkDenyEdit() {
      //   if (this.editedItem.status === this.statusClosed) {
      //     this.denyEdit = true;
      //     this.isClosed = true;
      //   } else {
      //     this.denyEdit = !(this.editedItem.status === this.statusNew || (this.denyEdit && this.editedItem.requestEdit));
      //   }
      // },

      // dialog DELETE
      closeDelete() {
        this.dialogDelete = false;
      },

      deleteItem(item) {
        let index = this.listArray.findIndex(i => i.id === item.id);
        this.listArray.splice(index, 1);
        this.deleteRiskAnalysis(item);
        this.dialogDelete = false;
      },

      deleteRiskAnalysis(item) {
        this.$store.dispatch('riskAnalysis/delete', item.id).then(function () {
          this.reloadList();
          this.$toaster.success(this.$i18n.t('message.success_risk_analysis_delete'));
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          this.$toaster.error(this.$i18n.t('message.fail_risk_analysis_delete'));
          }
          // this.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          this.$nuxt.$loading.finish();
        });
      },

      showItem(item) {
        this.$emit('showItem', item);
      },

      formatStatus(status) {
        if (status === 1) {
          return "New";
        } else if (status === 2) {
          return "Ongoing";
        } else if (status === 3) {
          return "Closed";
        }
      },

      getSourceOfDangerArray(value) {
        this.riskElementAnalysis = value.riskElementAnalysis;
      },

      // getSelectedAssigneeItems(value) {
      //   this.newTask.taskAssignees = value.selectedItemsOutput;
      // },

      changeTaskAssignee(item) {
        let that = this;
        item.taskAssigneesArray = _.filter(that.taskAssigneesArray, function (user) {
          return _.indexOf(item.taskAssignees, user.id) !== -1;
        });
        // if (item.taskAssignees.length < that.taskAssigneesArray.length) {
        //   item.responsiblePerson = item.taskAssignees;
        // }
      },
    },
  };
</script>

<style scoped>

</style>

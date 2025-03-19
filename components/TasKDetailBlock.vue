<template>
  <div>
    <div class="manage-task">
      <b-row>
        <b-col v-for="(item, index) in taskArray" :key="index" cols="12" class="mb-5 mt-5">
          <div class="section-connect-to section-connect-to-checklist-topic">
            <div class="section-connect-to-label section-connect-to-label-checklist add-new-section display-inline-flex">
              <v-text-field
                v-model="item.name"
                label="Task name"
                :rules="required"
                outlined
                :readonly="item.checkReadOnly"
              />
              <v-icon
                v-if="!item.status || item.status === 1"
                class="ml-5 icon-checklist-topic-delete"
                :disabled="item.checkReadOnly"
                @click="requestDelete(item)"
              >
                delete
              </v-icon>
            </div>
            <div class="padding-15-checklist">
              <b-row v-if="checkAdmin || checkCreator || checkResponsiblePerson">
                <b-col cols="12">
                  *If not choosing assignee, task will be assigned to responsible person.
                </b-col>
                <b-col cols="12">
                  <v-checkbox
                    v-model="item.assigned_company"
                    :label="$t('form.assign_to_all_employees_in_company')"
                    class="mt-0 pt-0"
                    :readonly="item.checkReadOnly"
                    hide-details
                  />
                </b-col>
                <b-col cols="6">
                  <div class="input-wrap industry-select-input-wrap">
                    <v-select
                      v-model="item.assigned_department"
                      :items="departmentsArray"
                      item-text="name"
                      item-value="id"
                      multiple
                      outlined
                      chips
                      :label="$t('form.assign_to_departments')"
                      :readonly="item.checkReadOnly"
                      hide-details
                    >
                      <template v-slot:prepend-item>
                        <v-list-item
                          ripple
                          @click="toggleDepartment(item)"
                        >
                          <v-list-item-action>
                            <v-icon :color="item.assigned_department.length > 0 ? 'indigo darken-4' : ''">{{ icon1(item) }}</v-icon>
                          </v-list-item-action>
                          <v-list-item-content>
                            <v-list-item-title>{{ $t('form.select_all') }}</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-divider class="mt-2" />
                      </template>
                    </v-select>
                  </div>
                </b-col>
                <b-col cols="6">
                  <div class="input-wrap industry-select-input-wrap">
                    <v-select
                      v-model="item.assigned_employee"
                      :items="taskAssigneesArray"
                      item-text="name"
                      item-value="id"
                      multiple
                      outlined
                      chips
                      :label="$t('form.assign_to_employees')"
                      :readonly="item.checkReadOnly"
                      hide-details
                    >
                      <template v-slot:prepend-item>
                        <v-list-item
                          ripple
                          @click="toggle(item)"
                        >
                          <v-list-item-action>
                            <v-icon :color="item.assigned_employee.length > 0 ? 'indigo darken-4' : ''">{{ icon(item) }}</v-icon>
                          </v-list-item-action>
                          <v-list-item-content>
                            <v-list-item-title>{{ $t('form.select_all') }}</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-divider class="mt-2" />
                      </template>
                    </v-select>
                  </div>
                </b-col>
              </b-row>
              <b-row v-if="item.status === 3">
                <b-col>
                  <v-alert
                    dense
                    text
                    type="success"
                    class="mb-0 fs-14 alert-custom mw-fit-content"
                  >
                    <strong>{{ $t('message.task_is_closed') }}</strong>
                  </v-alert>
                </b-col>
              </b-row>
<!--              <b-row v-else-if="item.status === 4 || item.status === 5">-->
              <b-row v-else-if="item.status === 4">
                <b-col cols="12">
                  <v-alert
                    text
                    dense
                    type="warning"
                    class="fs-14 alert-custom mw-fit-content mb-0"
                  >
                    <strong>{{ $t('message.task_is_canceled') }}</strong>
                  </v-alert>
                </b-col>
                <b-col>
                  <div class="input-wrap">
                    <v-text-field
                      v-model="item.description"
                      outlined
                      label="Reason for canceling the task"
                      readonly
                      hide-details
                    />
                  </div>
                </b-col>
              </b-row>
              <b-row v-else-if="editMode && (checkAdmin || checkResponsiblePerson)">
                <b-col cols="12">
                  <v-alert
                    v-if="item.status === 2"
                    dense
                    text
                    type="info"
                    class="mb-0 fs-14 alert-custom mw-fit-content"
                  >
                    <strong>{{ $t('message.task_is_processing') }}</strong>
                  </v-alert>
                  <v-alert
                    v-else-if="item.status === 6"
                    dense
                    text
                    type="success"
                    class="mb-0 fs-14 alert-custom mw-fit-content"
                  >
                    <strong>{{ $t('message.task_is_done') }}</strong>
                  </v-alert>
                  <v-alert
                    v-else-if="item.status === 3"
                    dense
                    text
                    type="success"
                    class="mb-0 fs-14 alert-custom mw-fit-content"
                  >
                    <strong>{{ $t('message.task_is_closed') }}</strong>
                  </v-alert>
                  <v-alert
                    v-else-if="item.status === 4"
                    dense
                    text
                    type="warning"
                    class="mb-0 fs-14 alert-custom mw-fit-content"
                  >
                    <strong>{{ $t('message.task_is_canceled') }}</strong>
                  </v-alert>
                </b-col>
                <b-col v-if="item.status === 6 || item.status === 3 || item.assignOnlyResponsiblePerson" cols="12">
                  <v-btn
                    v-if="item.status === 6 || item.assignOnlyResponsiblePerson"
                    class="btn-create-task mt-0"
                    @click="updateTask('task', item, 3)"
                  >
                    {{ $t('button.close_task') }}
                  </v-btn>
                  <v-alert
                    v-if="item.status === 3"
                    dense
                    text
                    type="success"
                    class="mb-0 fs-14 alert-custom mw-fit-content"
                  >
                    <strong>{{ $t('message.task_is_closed') }}</strong>
                  </v-alert>
                </b-col>
                <b-col v-else-if="item.status < 3 && !item.isAddDescription" cols="3">
<!--                  <v-btn-->
<!--                    class="mt-0 btn-create-task"-->
<!--                    color="error"-->
<!--                    @click="item.isAddDescription = true"-->
<!--                  >-->
<!--                    {{ $t('button.cancel_task') }}-->
<!--                  </v-btn>-->
                  <v-btn
                    class="mt-0 btn-create-task"
                    color="error"
                    @click="updateTask('task', item, 4)"
                  >
                    {{ $t('button.cancel_task') }}
                  </v-btn>
                </b-col>
<!--                <b-col :class="item.isAddDescription ? 'd-block' : 'd-none'" cols="12" class="mt-2">-->
<!--                  <div class="connect-department">-->
<!--                    <div class="department d-flex">-->
<!--                      <v-text-field-->
<!--                        v-model="item.description"-->
<!--                        :rules="required"-->
<!--                        outlined-->
<!--                        label="Reason for canceling the task"-->
<!--                      />-->
<!--                      <span v-if="item.status !== 4" class="department-button">-->
<!--                        <v-btn-->
<!--                          :disabled="!item.description"-->
<!--                          class="mb-2 btn-add-department"-->
<!--                          @click="updateTask('task', item, 4)"-->
<!--                        >-->
<!--                          {{ $t('button.save') }}-->
<!--                        </v-btn>-->
<!--                        <v-btn class="mt-1 mb-2 btn-cancel-department" @click="item.isAddDescription = false">-->
<!--                          {{ $t('button.cancel') }}-->
<!--                        </v-btn>-->
<!--                      </span>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                </b-col>-->
                <b-col v-if="item.status === 4" cols="12">
                  <v-alert
                    text
                    dense
                    type="warning"
                    class="fs-14 alert-custom mw-fit-content"
                  >
                    <strong>{{ $t('message.task_is_canceled') }}</strong>
                  </v-alert>
                </b-col>
              </b-row>
              <b-row v-else-if="editMode && item.assigneeId">
                <b-col v-if="item.checkPending" cols="12">
                  <v-btn
                    v-if="item.assigneeStatus === 4"
                    class="btn-create-task mt-0"
                    @click="updateTask('assignee', item, 1)"
                  >
                    CONFIRM
                  </v-btn>
                  <v-alert
                    v-else
                    dense
                    text
                    type="warning"
                    class="mb-0 fs-14 alert-custom mw-fit-content"
                  >
                    <strong>Awaiting confirmation from all assignees</strong>
                  </v-alert>
                </b-col>
                <b-col v-else>
                  <v-stepper v-model="item.assigneeStatus">
                    <v-stepper-header>
                      <template v-for="n in 3">
                        <v-stepper-step
                          :key="`${n}-step`"
                          :complete="n === 1 || item.assigneeStatus >= n"
                          :step="n"
                          :editable="item.assigneeStatus < n"
                          @click="updateTask('assignee', item, n)"
                        >
                          {{ n === 1 ? 'NEW' : n === 2 ? 'IN-PROGRESS' : 'TASK IS DONE' }}
                          <small v-if="n === 2 && item.assigneeStatus < 2" class="mt-1">{{ $t('title.click_to_process') }}</small>
                          <small v-else-if="n === 3 && item.assigneeStatus < 3" class="mt-1">{{ $t('title.click_to_done') }}</small>
                        </v-stepper-step>

                        <v-divider
                          v-if="n !== 3"
                          :key="n"
                        />
                      </template>
                    </v-stepper-header>
                  </v-stepper>
                </b-col>
              </b-row>
            </div>
          </div>
        </b-col>
      </b-row>
      <b-row v-if="(checkAdmin || checkCreator) && objectStatus < 3 && !viewMode">
        <b-col cols="3">
          <v-btn class="btn-create-task" @click="addTask">
            {{ $t('button.add_more') }}
          </v-btn>
        </b-col>
        <b-col v-if="isAddTask" cols="9" class="mt-2">
          <div class="connect-department">
            <div class="department d-flex">
              <v-text-field
                v-model="taskData.name"
                :rules="required"
                outlined
              />
              <span class="department-button">
                <v-btn class="mb-2 btn-add-department" @click="addMoreTask">
                  {{ $t('button.add') }}
                </v-btn>
                <v-btn class="mt-1 mb-2 btn-cancel-department" @click="cancelTaskName">
                  {{ $t('button.cancel') }}
                </v-btn>
              </span>
            </div>
          </div>
        </b-col>
      </b-row>
    </div>

    <v-dialog v-model="dialogConfirm" max-width="500px">
      <v-card class="dialog-delete">
        <v-card-text>
          <div class="text-center confirm-delete-title">
            Confirm complete
          </div>
          <div class="confirm-delete-text">
            Are you sure task is complete? You will not be able to change after clicking OK.
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="btn-cancel" text @click="close">
            {{ $t('button.cancel') }}
          </v-btn>
          <v-btn class="btn-save" @click="updateStatus">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogCancelConfirm" max-width="500px">
      <v-card class="dialog-delete">
        <v-card-text>
          <div class="text-center confirm-delete-title">
            Confirm
          </div>
          <div class="confirm-delete-text">
            Are you sure you want to cancel the task?  You will not be able to change after clicking OK.
          </div>
          <div class="input-wrap">
            <v-textarea
              :rules="required"
              label="Reason for canceling the task"
              rows="3"
              v-model="taskObject.description"
              outlined
            />
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="btn-cancel" text @click="close">
            {{ $t('button.cancel') }}
          </v-btn>
          <v-btn class="btn-save" @click="updateStatus">
            OK
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
            {{ $t('button.no') }}
          </v-btn>
          <v-btn class="btn-save" @click="deleteItem">
            {{ $t('button.yes') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbar"
      :timeout="snackbarTimeout"
      class="snackbar-custom"
      min-width="auto"
      value="false"
      bottom
    >
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script>
import {_} from 'vue-underscore';
import cookies from "js-cookie";

export default {
  name: "TasKDetailBlock",
  // components: {
  //
  // },
  props: {
    taskArrayInput: {
      type: Array,
      required: true,
    },
    departmentsArray: {
      type: Array,
      required: true,
    },
    taskAssigneesArrayInput: {
      type: Array,
      required: true,
    },
    editMode: {
      type: Boolean,
      required: true,
    },
    objectStatusInput: {
      type: Number,
      required: false,
    },
    viewModeInput: {
      type: Boolean,
      required: false,
    },
    allowAddNewTaskInput: {
      type: Boolean,
      required: false,
    },

  },
  data: () => ({
    checkAdmin: cookies.get('checkAdmin'),
    userID: parseInt(cookies.get('userID')),
    required: [
      v => {
        if (!v || v.length < 1)
          return 'This is required';
        else return true;
      }
    ],
    taskArray: [],
    taskAssigneesArray: [],
    taskData: {
      id: '',
      name: '',
      assigned_company: false,
      assigned_employee: [],
      assigned_department: [],
    },
    taskDataDefault: {
      id: '',
      name: '',
      assigned_company: false,
      assigned_employee: [],
      assigned_department: [],
    },
    isAddTask: false,
    snackbar: false,
    snackbarText: '',
    snackbarTimeout: 2000,
    checkResponsiblePerson: false,
    checkCreator: true,
    taskObject: '',
    taskType: '',
    taskStatus: '',
    dialogConfirm: false,
    objectStatus: 1,
    viewMode: false,
    allowAddNewTask: true,
    dialogCancelConfirm: false,
    dialogDelete: false,
    requestDeleteItem: '',
  }),

  watch: {
    taskArrayInput(value) {
      if (value && value.length > 0) {
        this.taskArray = value;
        this.checkResponsiblePerson = this.taskArray[0].responsible_id === this.userID;
        this.checkCreator = this.taskArray[0].added_by === this.userID;
        this.viewMode = this.viewModeInput;
        if (this.objectStatusInput) {
          this.objectStatus = this.objectStatusInput;
        }
      } else {
        this.objectStatus = 1;
        this.checkCreator = true;
        this.taskArray = [];
      }
    },

    taskAssigneesArrayInput(value) {
      if (value && value.length > 0) {
        this.taskAssigneesArray = value;
      } else {
        this.taskAssigneesArray = [];
      }
    },

    taskArray: {
      handler: 'getTaskArray',
      immediate: true,
    },
  },

  mounted() {
    //
  },

  created() {
    if (this.taskArrayInput && this.taskArrayInput.length > 0) {
      this.taskArray = this.taskArrayInput;
    }

    if (this.taskAssigneesArrayInput && this.taskAssigneesArrayInput.length > 0) {
      this.taskAssigneesArray = this.taskAssigneesArrayInput;
    }

    if (this.objectStatusInput) {
      this.objectStatus = this.objectStatusInput;
    }
  },

  methods: {
    updateTask(type, task, status) {
      if (type === 'assignee' && (task.assigneeStatus !== 3 && task.assigneeStatus !== status)) {
        if (status === 1 || status === 2 || status === 3) {
          this.openDialogConfirm(type, task, status);
        }
      } else if (type === 'task') {
        if (status === 3 || status === 4) {
          this.openDialogConfirm(type, task, status);
        }
      }
    },

    requestDelete(item) {
      this.requestDeleteItem = item;
      this.dialogDelete = true;
    },

    closeDelete() {
      this.dialogDelete = false;
    },

    openDialogConfirm(type, task, status) {
      this.taskObject = task;
      this.taskType = type;
      this.taskStatus = status;
      if (type === 'assignee' && (status === 1 || status === 2)) {
        this.updateStatus();
      } else {
        if (status === 3) {
          this.dialogConfirm = true;
        } else if (status === 4) {
          this.dialogCancelConfirm = true;
        }
      }
    },

    updateStatus() {
      let that = this;
      if (that.taskObject && that.taskType && that.taskStatus) {
        that.$nuxt.$loading.start();
        if (this.taskType === 'assignee') {
          that.taskObject.requestNewStatus = that.taskStatus;
          that.$store.dispatch('taskAssignees/update', that.taskObject).then(result => {
            if (result.data) {
              _.each(that.taskArray, function (item){
                if (that.taskObject.id === item.id) {
                  item.assigneeStatus = result.data.status;
                  item.checkPending = result.data.checkPending;
                }
              });
              that.showSnackbar('STATUS UPDATED !');
              that.dialogConfirm = false;
              that.reloadList();
            }
            that.$nuxt.$loading.finish();
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
          that.taskObject.requestNewStatus = that.taskStatus;
          that.$store.dispatch('tasks/update', that.taskObject).then(result => {
            if (result.data) {
              _.each(that.taskArray, function (item){
                if (that.taskObject.id === item.id) {
                  item.status = result.data.status;
                }
              });
              that.showSnackbar('STATUS UPDATED !');
              that.close();
              that.reloadList();
            }
            that.$nuxt.$loading.finish();
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
      }
    },

    showSnackbar(text) {
      this.snackbarText = text;
      this.snackbar = true;
    },

    close() {
      this.snackbar = false;
      this.snackbarText = '';
      this.taskObject = '';
      this.taskType = '';
      this.taskStatus = '';
      this.dialogConfirm = false;
      this.dialogCancelConfirm = false;
    },

    reloadList() {
      this.$emit('reloadList');
    },

    getTaskArray() {
      this.$emit('getTaskArray', {
        taskArray: this.taskArray,
      });
    },

    addTask() {
      this.isAddTask = true;
      this.taskData.name = '';
    },

    addMoreTask() {
      // let newData = _.clone(this.taskData);
      // this.taskArray.push(newData);
      if (this.taskArray.length > 0) {
        this.taskData.id = this.taskArray[this.taskArray.length - 1].id + 1;
      } else {
        this.taskData.id = 1;
      }
      this.taskArray.push(this.taskData);
      this.taskData = Object.assign({}, this.taskDataDefault);
      this.isAddTask = false;
    },

    cancelTaskName() {
      this.isAddTask = false;
    },

    deleteItem() {
      this.deleteTask(this.requestDeleteItem);
      this.dialogDelete = false;
      this.requestDeleteItem = '';
    },

    deleteTask(item) {
      this.taskArray.splice(this.taskArray.indexOf(item), 1);
    },

// dropdown assignee to EMPLOYEE
    likesAllAssignee(item) {
      return item.assigned_employee.length === this.taskAssigneesArray.length;
    },

    likesSomeAssignee(item) {
      return item.assigned_employee.length > 0 && !this.likesAllAssignee(item);
    },

    icon(item) {
      if (this.likesAllAssignee(item)) return 'mdi-close-box';
      if (this.likesSomeAssignee(item)) return 'mdi-minus-box';
      return 'mdi-checkbox-blank-outline';
    },

    toggle(item) {
      let that = this;
      this.$nextTick(() => {
        if (that.likesAllAssignee(item)) {
          item.assigned_employee = [];
        } else {
          item.assigned_employee = [];
          _.each(that.taskAssigneesArray, function (task) {
            item.assigned_employee.push(task.id);
          });
        }
      });
    },

    // dropdown assignee to DEPARTMENT
    likesAllDepartment(item) {
      return item.assigned_department.length === this.departmentsArray.length;
    },

    likesSomeDepartment(item) {
      return item.assigned_department.length > 0 && !this.likesAllDepartment(item);
    },

    icon1(item) {
      if (this.likesAllDepartment(item)) return 'mdi-close-box';
      if (this.likesSomeDepartment(item)) return 'mdi-minus-box';
      return 'mdi-checkbox-blank-outline';
    },

    toggleDepartment(item) {
      let that = this;
      this.$nextTick(() => {
        if (that.likesAllDepartment(item)) {
          item.assigned_department = [];
        } else {
          item.assigned_department = [];
          _.each(that.departmentsArray, function (task) {
            item.assigned_department.push(task.id);
          });
        }
      });
    },
  }
};
</script>

<style scoped>

</style>

<template>
  <div class="manage-task">
    <div class="title-manage-task pt-7">
      {{ $t('title.tasks') }}
    </div>

    <v-data-table
      v-if="isShowInputGoal"
      :headers="(!resource || (resource && editMode)) ? headerTaskArray : headerTemplateTaskArray"
      outlined
      :items="taskArray"
      class="elevation-1 table-task header-task"
      :items-per-page="15"
      :single-expand="true"
      hide-default-footer
      :sort-by="['created_at']"
      :sort-desc="[true, false]"
    >
      <template v-slot:item.name="{ item }">
        <v-textarea v-model="item.name" auto-grow rows="1" :rules="required" :disabled="denyEdit" />
      </template>
      <template v-slot:item.assignee="{ item }">
        <v-select
          v-if="employeeArray && (!resource || (resource && editMode))"
          v-model="item.taskAssignees"
          :items="employeeArray"
          item-text="name"
          item-value="id"
          multiple
          :rules="required"
          :disabled="denyEdit"
          @change="changeTaskAssignee(item)"
        >
          <template v-slot:prepend-item>
            <v-list-item
              ripple
              @click="toggle(item)"
            >
              <v-list-item-action>
                <v-icon :color="item.taskAssignees.length > 0 ? 'indigo darken-4' : ''">{{ icon(item) }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ $t('form.select_all') }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider class="mt-2"></v-divider>
          </template>
        </v-select>
      </template>
      <template v-slot:item.responsible="{ item }">
        <v-select
          v-if="!resource || (resource && editMode)"
          v-model="item.responsiblePerson"
          :items="item.taskAssigneesArray"
          item-text="name"
          item-value="id"
          multiple
          :rules="required"
          :disabled="denyEdit"
        />
      </template>
      <template v-slot:item.deadline="{ item }">
        <v-menu v-if="!resource || (resource && editMode)" v-model="item.modal_deadline" :close-on-content-click="false" min-width="290px">
          <template v-slot:activator="{ on }">
            <v-text-field
              v-if="!resource || (resource && editMode)"
              v-model="item.deadline"
              placeholder="DD/MM/YY"
              readonly
              :disabled="denyEdit"
              v-on="on"
            />
          </template>
          <v-date-picker v-model="item.deadline" @input="item.modal_deadline = false">
            <v-spacer />
            <v-btn text @click="item.deadline = '', item.modal_deadline = false">
              {{ $t('button.clear') }}
            </v-btn>
          </v-date-picker>
        </v-menu>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon class="info-table-action-icon" small :disabled="denyEdit" @click="deleteTaskList(item)">
          delete
        </v-icon>
      </template>
    </v-data-table>
    <v-btn class="btn-create-task" outlined :disabled="denyEdit" @click="addMoreTask">
      {{ $t('button.add_new') }}
    </v-btn>
  </div>
</template>
<script>
  import {_} from 'vue-underscore';
  // import { mapState } from 'vuex';

  export default {
    props: {
      taskArrayInput: {
        type: Array,
        required: false,
      },
      denyEdit: {
        type: Boolean,
        required: false,
      },
      resource: {
        type: Boolean,
        required: false,
      },
      editMode: {
        type: Boolean,
        required: false,
      },
      employeeArrayInput: {
        type: Array,
        required: false,
      },
    },
    //   [
    //   'taskArrayInput', 'denyEdit', 'resource', 'editMode', 'employeeArrayInput'
    // ],
    data: function () {
      return {
        required: [
          v => {
            if (!v || v.length < 1)
              return 'This is required';
            else return true;
          }
        ],
        newTask: {
          id: '',
          name: '',
          taskAssignees: [],
          taskAssigneesArray: [],
          responsiblePerson: [],
          deadline: '',
          modal_deadline: false,
        },
        defaultTask: {
          id: '',
          name: '',
          taskAssignees: [],
          taskAssigneesArray: [],
          responsiblePerson: [],
          deadline: '',
          modal_deadline: false,
        },
        isShowInputGoal: false,
        opens: 'right',
        singleDatePicker: false,
        timePicker: false,
        timePicker24Hour: true,
        showWeekNumbers: false,
        showDropdowns: "",
        autoApply: false,
        dateTest: new Date(),
        dateRange: {
          startDate: false,
          endDate: false
        },
        linkedCalendars: "",
        alwaysShowCalendars: '',
        localData: {
          monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          firstDay: 1
        },
        formDirty: false,
        taskArray: [],
        employeeArray: [],
      };
    },

    computed: {
      headerTaskArray() {
        return [
          {text: this.translateCol('task'), value: 'name', sortable: false, align: 'center', width: '40%'},
          {text: this.translateCol('assignee'), value: 'assignee', sortable: false, align: 'center', width: '20%'},
          {text: this.translateCol('responsible'), value: 'responsible', sortable: false, align: 'center', width: '20%'},
          {text: this.translateCol('deadline'), value: 'deadline', sortable: false, align: 'center', width: '15%'},
          {text: this.translateCol('action'), value: 'action', sortable: false, align: 'center'},
        ]
      },

      headerTemplateTaskArray() {
        return [
          {text: this.translateCol('task'), value: 'name', sortable: false, align: 'center', width: '80%'},
          {text: this.translateCol('action'), value: 'action', sortable: false, align: 'center', width: '20%'},
        ]
      },
    },

    watch: {
      taskArrayInput(value) {
        if (value && value.length > 0) {
          this.taskArray = value;
          this.isShowInputGoal = true;
        } else {
          this.taskArray = [];
          this.isShowInputGoal = false;
        }
      },

      employeeArrayInput(value) {
        if (value && value.length > 0) {
          this.employeeArray = value;
        } else {
          this.employeeArray = [];
        }
      },

      taskArray: {
        handler: 'getTaskArray',
        immediate: true,
      },
    },

    created() {
      if (this.taskArrayInput && this.taskArrayInput.length > 0) {
        this.taskArray = this.taskArrayInput;
      }

      if (this.employeeArrayInput && this.employeeArrayInput.length > 0) {
        this.employeeArray = this.employeeArrayInput;
      }
    },

    methods: {
      translateCol (colName) {
        return this.$i18n.t('column.' + colName);
      },

      getTaskArray() {
        this.$emit('getTaskArray', {
          taskArray: this.taskArray,
          formDirty: this.formDirty,
        });
      },

      // getItem() {
      //   var that = this;
      //   that.taskArray = [];
      //   // list tasks
      //   if (this.type === 'goal' && this.itemID) {
          // that.$store.dispatch('goals/show', this.itemID).then(result => {
          //   _.each(result.data.tasks, function (task) {
          //     that.newTask.id = task.id;
          //     that.newTask.name = task.name;
          //     if (!that.resource) {
          //       that.newTask.deadline = task.deadline;
          //       var taskAssignees = [];
          //       var responsiblePerson = [];
          //       _.each(task.task_assignees, function (task_assignee) {
          //         taskAssignees.push(task_assignee.user_id);
          //         that.newTask.taskAssignees = taskAssignees;
          //         if (task_assignee.responsible === 1) {
          //           responsiblePerson.push(task_assignee.user_id);
          //         }
          //         that.newTask.responsiblePerson = responsiblePerson;
          //       });
          //       that.newTask.taskAssigneesArray = _.filter(that.employeeArray, function(user){
          //         return _.indexOf(that.newTask.taskAssignees, user.id) !== -1;
          //       });
          //     }
          //     that.taskArray.push(that.newTask);
          //     that.newTask = _.clone(that.defaultTask);
          //   });
          //   that.isShowInputGoal = result.data.tasks.length > 0; // show list tasks
          //   that.$nuxt.$loading.finish();
          // }).catch((error) => {
          //   that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          //   that.$nuxt.$loading.finish();
          // });
      //   }
      // },

      deleteTaskList(item) {
        this.formDirty = true;
        if (this.taskArray.length === 1) {
          this.isShowInputGoal = false;
        }
        this.taskArray.splice(this.taskArray.findIndex(i => i.id === item.id), 1);
      },

      addMoreTask() {
        this.formDirty = true;
        this.isShowInputGoal = true;
        if (this.taskArray.length > 0) {
          this.newTask.id = this.taskArray[this.taskArray.length - 1].id + 1;
        } else {
          this.newTask.id = 1;
        }
        this.taskArray.push(this.newTask);
        this.newTask = Object.assign({}, this.defaultTask);
      },

      likesAllFruit (item) {
        return item.taskAssignees.length === this.employeeArray.length;
      },

      likesSomeFruit (item) {
        return item.taskAssignees.length > 0 && !this.likesAllFruit(item);
      },

      icon (item) {
        if (this.likesAllFruit(item)) return 'mdi-close-box';
        if (this.likesSomeFruit(item)) return 'mdi-minus-box';
        return 'mdi-checkbox-blank-outline';
      },

      toggle (item) {
        var that = this;
        this.$nextTick(() => {
          if (that.likesAllFruit(item)) {
            item.taskAssignees = [];
          } else {
            item.taskAssignees = [];
            _.each(that.employeeArray, function (task) {
              item.taskAssignees.push(task.id);
            });
            item.taskAssigneesArray = that.employeeArray;
          }
        });
      },

      changeTaskAssignee(item) {
        var that = this;
        _.each(that.taskArray, function (task) {
          if (item.id === task.id) {
            if (item.responsiblePerson.length > 0) {
              item.responsiblePerson = [];
            }
            item.taskAssigneesArray = _.filter(that.employeeArray, function(user){
              return _.indexOf(task.taskAssignees, user.id) !== -1;
            });
            // if (item.taskAssignees.length < that.employeeArray.length) {
            //   item.responsiblePerson = item.taskAssignees;
            // }
          }
        });
      },
    }
  };
</script>

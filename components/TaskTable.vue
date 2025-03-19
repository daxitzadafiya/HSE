<template>
  <div>
    <TaskReviewPopup
      :open-popup="checkShowItem"
      :object-item="editedItem"
      :categories-array="categoriesArray"
      :predefined-link-array="predefinedLinkArray"
      @closePopup="checkShowItem = !checkShowItem"
      @reloadList="reloadList"
    />

<!-- <view-report-task
      :open-popup="checkShowItem"
      :object-item="editedItem"
      :categories-array="categoriesArray"
      :predefined-link-array="predefinedLinkArray"
      @closePopup="checkShowItem = !checkShowItem"
      @reloadList="reloadList"
    /> -->

<!--    <TaskPopup-->
<!--      :open-popup="checkShowItem"-->
<!--      :view-only="viewOnly"-->
<!--      :task-item="editedItem"-->
<!--      :categories-array="categoriesValidArray"-->
<!--      :project-array="projectArray"-->
<!--      :job-title-array="jobTitleArray"-->
<!--      :departments-array="departmentsArray"-->
<!--      :task-assignees-array="taskAssigneesArray"-->
<!--      :responsible-array="responsibleArray"-->
<!--      :predefined-link-array="predefinedLinkArray"-->
<!--      @closePopup="checkShowItem = !checkShowItem"-->
<!--      @reloadList="reloadList"-->
<!--      @reloadListCategory="reloadListCategory"-->
<!--      @showItem="showItem"-->
<!--    />-->

<!--    <GoalPopup-->
<!--      :open-popup="showGoal"-->
<!--      :form-title="$t('title.goal_task')"-->
<!--      :view-only="true"-->
<!--      :goal-item="editedItem"-->
<!--      :categories-array="categoriesValidArray"-->
<!--      :project-array="projectArray"-->
<!--      :job-title-array="jobTitleArray"-->
<!--      :departments-array="departmentsArray"-->
<!--      :task-assignees-array="taskAssigneesArray"-->
<!--      :responsible-array="responsibleArray"-->
<!--      @closePopup="showGoal = !showGoal"-->
<!--      @reloadList="reloadList"-->
<!--    />-->

    <v-data-table
      :headers="headers"
      :items="filteredItems"
      class="elevation-1 hse-table table-data"
      :items-per-page="15"
      :single-expand="true"
      :search="search_value"
      :sort-by="['created_at']"
      :sort-desc="[true, false]"
      @click:row="editItem"  
      hide-default-footer
    >
     <template v-slot:header.worker_status="{ header }">
            <div v-if="checkWorker">{{ $t('column.status') }}</div>
          </template>
          <template v-slot:header.progress_rate="{ header }">
            <div v-if="!checkWorker">{{ $t('column.rate_of_progress') }}</div>
          </template>
      <template v-slot:top>
        <div v-if="!noFilterSetting" class="setting-header">
          <div class="panel-heading">
            <h4 class="panel-title">
              {{ $t('title.sort_by') }}
            </h4>
            <b-row>
              <b-col cols="6">
                <div class="field-selection">
                  <v-select
                    v-model="added_by"
                    :label="$t('setting.added_by')"
                    item-value="id"
                    :items="usersSelection"
                    outlined
                    class="text-box"
                    @input="userSelection"
                  >
                    <template slot="selection" slot-scope="data">
                      {{ data?.item?.first_name ? data?.item?.first_name + ' ' + data?.item?.last_name  : data?.item.name}}
                    </template>
                    <template slot="item" slot-scope="data">
                      {{ data?.item?.first_name ? data?.item?.first_name + ' ' + data?.item?.last_name  : data?.item.name}}
                    </template>
                  </v-select>
                </div>
              </b-col>
              <b-col cols="6">
                <div class="field-selection field-search">
                  <v-text-field
                    append-icon="search"
                    :label="$t('setting.search')"
                    outlined
                    class="text-box"
                    @input="textFeild"
                  >
                    <template v-slot:append>
                      <img src="../assets/images/icon/magnifier.png" class="search-icon-cust">
                    </template>
                  </v-text-field> 
                </div>
              </b-col>
              <!--                  <b-col cols="3">-->
              <!--                    <date-range-picker-->
              <!--                      ref="picker"-->
              <!--                      :opens="opens"-->
              <!--                      :locale-data="localData"-->
              <!--                      :singleDatePicker="singleDatePicker"-->
              <!--                      :timePicker="timePicker"-->
              <!--                      :timePicker24Hour="timePicker24Hour"-->
              <!--                      :showWeekNumbers="showWeekNumbers"-->
              <!--                      :showDropdowns="showDropdowns"-->
              <!--                      :autoApply="autoApply"-->
              <!--                      v-model="dateRange"-->
              <!--                      :linkedCalendars="linkedCalendars"-->
              <!--                      :alwaysShowCalendars="alwaysShowCalendars"-->
              <!--                      class="range-picker-custom"-->
              <!--                    >-->
              <!--                      <template v-slot:input="picker">-->
              <!--                        <div v-if="picker.startDate">-->
              <!--                          {{moment(picker.startDate).format('DD.MM.YYYY') }} - {{moment(picker.endDate).format('DD.MM.YYYY') }}-->
              <!--                        </div>-->
              <!--                        <div v-else>All</div>-->
              <!--                      </template>-->
              <!--                    </date-range-picker>-->
              <!--                  </b-col>-->
              <!--                  <b-col cols="6">-->
              <!--                    <div class="field-selection">-->
              <!--                      <v-select-->
              <!--                        v-model="status"-->
              <!--                        :items="statusSelect"-->
              <!--                        item-text="name"-->
              <!--                        item-value="value"-->
              <!--                        :label="$t('setting.status')"-->
              <!--                        outlined-->
              <!--                      />-->
              <!--                    </div>-->
              <!--                  </b-col>-->
            </b-row>
          </div>
          <div class="panel-footer text-right"></div>
        </div>
      </template>

      <template v-slot:header="{ props: { headers } }">
        <h4 class="table-name">
          {{ $t('table.tasks') }}
        </h4>
      </template>
      <template v-slot:item.function="{ item }">
        <span v-if="item?.source === 'sub-goal'">{{ $t('form.goal') }}</span>
        <span v-else>{{ item?.source }}</span>
      </template>
      <template v-slot:item.added_by_name="{ item }">
        <span v-if="item?.added_by === 1">{{ $t('table.system') }}</span>
        <span v-if="item?.report_as_anonymous == 1">{{ 'Anonymous' }}</span>
        <span v-else>{{ item?.firstName }} {{ item?.lastName }}</span>
      </template>
      <template v-slot:item.categoryName="{ item }">
        {{ item?.categoryType ? item?.categoryType + " / ":'' }}{{ item?.categoryName }}
      </template>
      <template v-slot:item.start_date="{ item }">
        {{ moment(item?.start_date).format('DD.MM.YYYY') }} - {{item?.start_time == '' ? '00:00 AM' : moment(item?.start_time, 'HH:mm A').format('HH:mm A') }}
      </template>
      <template v-slot:item.deadline="{ item }">
        {{ moment(item?.deadline).format('DD.MM.YYYY') }} - {{ item?.end_time == '' ? '00:00 AM' : moment(item?.end_time, 'HH:mm A').format('HH:mm A') }}
      </template>
<!--      <template v-slot:item.deadlineByType="{ item }">-->
<!--        <div v-if="item.recurring === 'indefinite'">-->
<!--          {{ $t('table.indefinite') }}-->
<!--        </div>-->
<!--        <div-->
<!--          v-if="!(item.recurring === 'indefinite') && item.deadlineByType"-->
<!--          :class="item.remainingTime < 0 ? 'red lighten-1 black&#45;&#45;text task-table-progress-bar' : item.remainingTime < 4 ? 'yellow accent-4  black&#45;&#45;text task-table-progress-bar' : ''"-->
<!--        >-->
<!--          {{ formatDate(item.deadlineByType) }}-->
<!--        </div>-->
<!--      </template>-->
      <template v-slot:item.progress_rate="{ item }" v-if="!checkWorker">
        <v-progress-linear
          :value="progressValues[item.id]?.value" 
          :color="progressValues[item.id]?.color" 
          height="25"
        >
          <strong class="font-weight-bold" style="color: #141b04">
            {{ progressValues[item.id]?.value + ' %' }}
          </strong>
        </v-progress-linear>
      </template>
      <template v-slot:item.is_suggestion="{ item }">
        <v-hover v-slot:default="{ hover }">
          <v-badge :value="hover" left transition="slide-x-transition">
            <span v-if="(item.is_suggestion === 1)" slot="badge">{{ $t('message.index') }}: {{ $t('table.yes') }}</span>
            <span v-else slot="badge">{{ $t('message.index') }}: {{ $t('table.no') }}</span>
            <img :class="item.is_suggestion === 0 ? 'img-gray-scale' : ''" src="../assets/images/gridIcon/Index.png" alt="index-icon" @click.stop />
          </v-badge>
        </v-hover>

<!--        <span v-if="item.is_suggestion === 1" class="indexed-item indexed-yes">-->
<!--          {{ $t('table.yes') }}-->
<!--        </span>-->
<!--        <span v-else class="indexed-item indexed-no">-->
<!--          {{ $t('table.no') }}-->
<!--        </span>-->
      </template>
      <template v-slot:item.worker_status="{ item }" v-if="checkWorker">
        <status-chip
          :status="item?.my_processing?.status"
          :inReview="false"
          :inRisk="false"
        />
      </template>

      <template v-slot:no-data>
        {{ $t('table.no_data') }}
      </template>
      <template #footer>
        <slot name="bottom"></slot>
      </template>
    
    </v-data-table>
  </div>
</template>

<script>
  import {_} from 'vue-underscore';
  import cookies from 'js-cookie';
  // import moment from 'moment';
  import TaskReviewPopup from "./TaskReviewPopup";
import StatusChip from './StatusChip.vue';
// import ViewReportTask from './ViewReportTask.vue';
  // import TaskPopup from "./TaskPopup";
  // import GoalPopup from "./GoalPopup";

  export default {
    name: "TaskTable",
    components: {
      TaskReviewPopup,
        StatusChip,
        // ViewReportTask,
      // TaskPopup,
      // GoalPopup,
    },
    props: {
      categoriesArray: {
        type: Array,
        required: false,
      },
      listArrayInput: {
        type: Array,
        required: true,
      },
      usersSelection: {
        type: Array,
        required: false,
      },
      noFilterSetting: {
        type: Boolean,
        required: false,
      },
      viewOnly: {
        type: Boolean,
        required: false,
      },
      // objectType: {
      //   type: String,
      //   required: false,
      // },
      objectId: {
        type: String,
        required: false,
      },
      // taskAssigneesArray: {
      //   type: Array,
      //   required: false,
      // },
      // responsibleArray: {
      //   type: Array,
      //   required: false,
      // },
      predefinedLinkArray: {
        type: Array,
        required: false,
      },
      search_value:{
        type: String,
        required: false,
      },
    },
    data: () => ({
      userRoleId: parseInt(cookies.get('roleID')),
      userDepartmentID: parseInt(cookies.get('userDepartmentID')),
      roleUser: cookies.get('roleUser'),
      pageKey: 'employees-tasks-tasks',
    checkAdmin: cookies.get('checkAdmin'),
      titleCaptionKey: '',
      permissionsUser: localStorage.getItem('permissionsKey'),
      userID: parseInt(cookies.get('userID')),
      // nowDate: new Date().toISOString().substr(0, 10),
      // search: '',
      valid: true,
      listArray: [],
      editedItem: {},
      // editedItem: {
      //   name: "",
      //   subject: "",
      //   type: "",
      //   status: 1,
      //   added_by: "",
      //   reported_by: "",
      //   assignee: "",
      //   goal_id: "",
      //   task_id: "",
      //   risk_analysis_id: "",
      //   user_task_id: "",
      //   document_id: "",
      //   deadline: '',
      // },
      // date: '',
      menu: false,
      tabIndex: 0,
      // type: "All",
      // typeSelect: ["All", "Goal", "Task", "Deviation", "Report", "Risk analysis"],
      added_by: 0,
      // status: 0,
      // statusSelect: [{
      //   value: 0,
      //   name: "All"
      // }, {
      //   value: 'new',
      //   name: "New"
      // }, {
      //   value: 2,
      //   name: "Ongoing"
      // }, {
      //   value: 3,
      //   name: "Closed"
      // }],
      checkShowItem: false,
      categoriesValidArray: [],
      checkPermission: '',
      formDirty: false,
      checkWorker:false,
      checkCreator:false,
      checkResponsible:false
    }),

     mounted() {
    // // if (this.roleUser === 'manager') {
    // //   this.checkResponsible = true
    // } else 
    if (this.roleUser === 'user') {
      this.checkWorker = true
    }
  },

    computed: {
      headers() {
        const headers = [
          { text: this.translateCol('name'), value: 'name', align: 'left', sortable: false },
          { text: this.translateCol('function'), value: 'source', align: 'center', sortable: false },
          { text: this.translateCol('category'), value: 'categoryName', align: 'center', sortable: false, width: '15%' },
          { text: this.translateCol('added_by'), value: 'added_by_name', align: 'center', sortable: false },
          { text: this.translateCol('start'), value: 'start_date', align: 'center', sortable: false },
          { text: this.translateCol('deadline'), value: 'deadline', align: 'center', sortable: false },
        ];

          if (!this.checkWorker) {
            headers.push({ text: this.translateCol('rate_of_progress'), value: 'progress_rate', align: 'center', sortable: false, width: '17%' });
          }

          headers.push({ value: 'worker_status', align: 'center', sortable: false });

          return headers;
        },
      

      filteredItems() {
        let that = this;
        return that.listArray
        // .filter((item) => {
          // return ((that.added_by === 0 || (item.added_by === that.added_by))
              // && (that.status === 0 || (item.status === that.status))
              // && (that.department === 0 || (item.department_id === that.department))
              // && (that.job_title === 0 || (item.job_title_id === that.job_title))
              // && (that.project === 0 || (item.project_id === that.project))
              // && (that.type === "All" || (item.type === that.type))
              // && (that.assignee === 0 || (i.assignee === that.assignee))
              // && (!that.dateRange.startDate || (that.dateRange.startDate && that.moment(that.dateRange.startDate)
              //   <= that.moment(item.deadline))  && (!that.dateRange.endDate || (that.dateRange.endDate && that.moment(that.dateRange.endDate) >= that.moment(item.deadline))))
            // );
        // });
      },
    
    progressValues() {
    return this.listArray.reduce((result, item) => {
      let addedBy = item.added_by;
      let responsible = item.responsible;
      let status = item.status

      // Calculate the values without modifying component data
      let checkCreator = addedBy == this.userID;
      let checkResponsible = responsible?.employeeRole?.includes(this.userID);

      let value, color;

      if(status !=='closed'){
        if (
          (checkResponsible && checkCreator) ||
          (checkResponsible && !checkCreator) ||
          (!checkResponsible && !checkCreator && !this.checkAdmin)
        ) {
          value = item.rate.toFixed();
        } else {
          value = item.total_rate.toFixed();
        }
      }else{
        value = 100
      }


      // Define color based on the progress value
      if (value <= 25) {
        color = 'rgba(251,75,75)';
      } else if (value <= 50) {
        color = 'rgba(255,168,121)';
      } else if (value <= 75) {
        color = 'rgba(255,193,99)';
      } else if (value <= 95) {
        color = 'rgba(255, 212, 111, 1)';
      } else {
        color = 'rgba(132, 161, 61, 1)';
      }

      // Store the progress value and color in the result object
      result[item.id] = { value, color };
      return result;
    }, {});
  },
    },

    watch: {
      dialog(val) {
        val || this.close();
      },

      listArrayInput(value) {
        if (value) {
          this.listArray = value;
        }
      },

      listArray: {
        handler: 'getObject',
        immediate: true,
      },

      objectId(value) {
        if (value) {
          this.getObject();
        }
      },
    },

    created() {
      if (this.listArrayInput.length > 0) {
        this.listArray = this.listArrayInput;
      }
    },

    methods: {
      translateCol (colName) {
        return this.$i18n.t('column.' + colName);
      },
      textFeild(text){
        this.$emit('textFilter',text);
      },
      userSelection(user){
        this.$emit('userSelection',user);
      },

      getObject() {
        let that = this;
        if (that.objectId) {
          _.each(that.listArray, function (item) {
            if (item.id == parseInt(that.objectId)) {
              that.editItem(item);
              let query = Object.assign({}, that.$route.query);
              delete query.id;
              that.$router.replace({ query });
            }
          });
        }
      },

      reloadList() {
        this.$emit('reloadList');
      },

      reloadListCategory(){
        this.$emit('reloadListCategory');
      },

      editItem(item) {
        this.editedItem = Object.assign({}, item);
        this.checkShowItem = true;
      },

      // showItem(item) {
      //   this.editItem(item);
      // },

      // editItem(item) {
      //   // if (this.checkAdmin || this.permissionsUser.indexOf('task-detail') > -1) {
      //   let that = this;
      //   // that.$nuxt.$loading.start();
      //   if (item.type === 'Goal') {
      //     that.editedItem = Object.assign({}, item);
      //     // that.checkShowItem = true;
      //     // that.$nuxt.$loading.finish();
      //
      //     that.categoriesValidArray = _.filter(that.categoriesArray, function (item) {
      //       return item.type === 'goal';
      //     });
      //
      //     that.$store.dispatch('tasks/showGoal', item.type_id).then(result => {
      //       if (result.data) {
      //         that.editedItem.goalObject = result.data;
      //         // that.showGoal = true;
      //         // that.getTaskTypeDetail(that, result.data, that.taskOfGoal);
      //         if (result.data.sub_goals) {
      //           let goalTaskArray = [];
      //           _.each(result.data.sub_goals, function (sub) {
      //             if (sub.tasks) {
      //               _.each(sub.tasks, function (task) {
      //                 goalTaskArray.push(task);
      //               });
      //             }
      //           });
      //           that.editedItem.tasks = goalTaskArray;
      //           that.checkShowItem = true;
      //           that.$nuxt.$loading.finish();
      //         }
      //         that.$nuxt.$loading.finish();
      //       }
      //     }).catch(() => {
      //       that.$toaster.error(that.$i18n.t('message.fail_task_view'));
      //       // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
      //       that.$nuxt.$loading.finish();
      //     });
      //   } else if (item.type === 'User'
      //     || item.type === 'Deviation'
      //     || item.type === 'Report'
      //     || item.type === 'Risk analysis') {
      //     that.editedItem = Object.assign({}, item);
      //
      //     if (item.type === 'User') {
      //       that.categoriesValidArray = _.filter(that.categoriesArray, function (item) {
      //         return item.type === 'task';
      //       });
      //     } else if (item.type === 'Deviation') {
      //       that.categoriesValidArray = _.filter(that.categoriesArray, function (item) {
      //         return item.type === 'deviation';
      //       });
      //     }
      //
      //     that.checkShowItem = true;
      //     that.$nuxt.$loading.finish();
      //   }
      //   // }
      // },

      // formatStatus(status) {
      //   if (status === 'new') {
      //     return this.$i18n.t('table.new');
      //   } else if (status === 2) {
      //     return this.$i18n.t('table.on_going');
      //   } else if (status === 3) {
      //     return this.$i18n.t('table.closed');
      //   }
      // },

      // formatDate(date) {
      //   if (date) {
      //     return moment(date).format('DD.MM.YYYY');
      //   }
      //   return '';
      // },
    }
  };

</script>

<style scoped>
.status-btn {
  width: 130px;
}
</style>

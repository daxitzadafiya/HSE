<template>
  <div class="employees-page task-page">
    <div @mouseenter="hoverTaskPlanAccess = true" @mouseleave="hoverTaskPlanAccess = false" style="width: fit-content">
    <v-badge v-if="!!planAccess?.lastPlanAccess?.task" :value="hoverTaskPlanAccess" right
          transition="slide-x-transition" class=" hover-label hse--icon-question-circle badgee">
        <span slot="badge" @click="redirectUrl">{{ $t('message.accessible_module') }}</span> 
    </v-badge>
        <!-- <v-btn v-if="checkAdmin || (permissionsUser.indexOf('task-basic') > -1 && roleUser !== 'user')" class="mt-2 btn-create btn-custom-green"
            @click="checkAddNew = true" :disabled="!!planAccess?.lastPlanAccess?.task">
            {{ $t('button.add_new') }}
        </v-btn> -->
        <v-btn class="mt-2 btn-create btn-custom-green"
            @click="checkAddNew = true" :disabled="!!planAccess?.lastPlanAccess?.task">
            {{ $t('button.add_new') }}
        </v-btn>
    </div>  

    <b-tabs v-model="tabIndex" card lazy>
      <keep-alive>
        <b-tab :title="$t('tab.tasks')" active>
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKey" />
          <v-container>
            <AddNewPopup
              :open-popup="checkAddNew"
              :form-title="$t('title.add_new_task')"
              :object-field="objectField"
              :object-item="newItem"
              :categories-array="categoriesArray"
              :categories-type="'task'"
              :predefined-link-array="predefinedLinkArray"
              @closePopup="checkAddNew = !checkAddNew"
              @savePopup="save"
            />
<!--            <TaskPopup-->
<!--              :open-popup="checkAddNew"-->
<!--              :tab-index="tabIndex"-->
<!--              :categories-array="categoriesTaskArray"-->
<!--              :project-array="projectArray"-->
<!--              :job-title-array="jobTitleArray"-->
<!--              :departments-array="departmentsArray"-->
<!--              :task-assignees-array="taskAssigneesArrayAddNew"-->
<!--              :responsible-array="responsibleArrayAddNew"-->
<!--              :predefined-link-array="predefinedLinkArray"-->
<!--              @closePopup="checkAddNew = !checkAddNew"-->
<!--              @reloadList="reloadList"-->
<!--              @reloadListCategory="reloadListCategory"-->
<!--            />-->

            <TaskTable
              :list-array-input="listArray"
              :categories-array="categoriesArray"
              :users-selection="usersSelection"
              :predefined-link-array="predefinedLinkArray"
              :object-id="paramId"
              @reloadList="reloadList"
              @reloadListCategory="reloadListCategory"
              @textFilter="textFilter"
              @userSelection="userSelection"
            >
              <!-- :search_value="search" -->
            <template #bottom>
            <custom-pagination :pagination="pagination" @changePage="changePage" />
            </template>
            </TaskTable>
           
          </v-container>
        </b-tab>
      </keep-alive>
    </b-tabs>
  </div>
</template>
<script>
import {_} from 'vue-underscore';
import cookies from 'js-cookie';
// import axios from "axios";
import moment from 'moment';
import TitleCaption from "@/components/TitleCaption";
// import TaskPopup from "../../../components/TaskPopup";
import TaskTable from "@/components/TaskTable";
import AddNewPopup from "@/components/AddNewPopup";
   import debounce from 'lodash/debounce';
import { formatTimeString, removeTagsFromString } from "../../../components/common/js/functions"
import customPagination from '../../../components/CustomPagination.vue';

export default {
  components: {
    AddNewPopup,
    TitleCaption,
    // TaskPopup,
    TaskTable,
    customPagination
  },
  data: () => ({
    hoverTaskPlanAccess:false,
    userRoleId: parseInt(cookies.get('roleID')),
    // userDepartmentID: parseInt(cookies.get('userDepartmentID')),
    checkAdmin: cookies.get('checkAdmin'),
    roleUser: cookies.get('roleUser'),
    pageKeyResource: 'employees-tasks-resources',
    pageKey: 'employees-tasks-tasks',
    checkAddNew: false,
    titleCaptionKey: '',
    permissionsUser: localStorage.getItem('permissionsKey'),
    planAccess: JSON.parse(localStorage.getItem('planAccess')),
    userID: parseInt(cookies.get('userID')),
    valid: true,
    listArray: [],
    dataDefault: {
      id: 0,
      first_name: "All",
      last_name: "",
    },
    tabIndex: 0,
    checkPermission: '',
    taskArray: [],
    formDirty: false,
    usersSelection: [],
    predefinedLinkArray: [],
    paramId: '',
    // paramType: '',
    // category
    categoriesArray: [],
    categoriesTaskArray: [],
    categoriesSelection: [],
    categoriesDefault: {
      id: 0,
      name: "All"
    },
    // add new popup - list object fields
    objectField: [
      'name',
      'description',
      'category',
      'connect-to',
      'responsible',
      'attendee',
      'start-date',
      'deadline',
      'no-index',
    ],
    newItem: {
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
      start_date: '',
      start_time_pre: '',
      end_time_pre: '',
      start_time: '',
      end_time: '',
      start_date_pre: '',
      deadline: '',
      deadline_pre: '',
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
    defaultItem: {
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
      start_date: '',
      start_date_pre: '',
      deadline: '',
      deadline_pre: '',
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
     pagination: {},
    current_page: 1,
    textTrime:'',
    search:'',
    user_id:''
  }),

  watch: {
    // dialog(val) {
    //   val || this.close();
    // },
  },

  created() {
    if (this.$route.query.id) {
      console.log("$route.query" , this.$route.query.id);
      this.paramId = this.$route.query.id;
      // this.paramType = this.$route.query.type;
    }
  },

  mounted() {
    let that = this;
    let page = this.current_page
    that.$nextTick(() => {
      that.$nuxt.$loading.start();
      that.titleCaptionKey = that.roleUser + '-' + that.pageKey;

      // list categories
      that.$store.dispatch('categoriesV2/index', {type: 'task'}).then(result => {
        that.categoriesArray = result.data;
        // that.categoriesTaskArray = _.clone(result.data);
        // that.categoriesTaskArray = _.filter(that.categoriesTaskArray, function (item) {
        //   return item.type === 'task';
        // });
        that.categoriesSelection = _.clone(result.data);
        that.categoriesSelection.push(that.categoriesDefault);
        that.categoriesSelection.sort(function (a, b) {
          return (a.id - b.id);
        });
      }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }
        // that.$toaster.error(that.$i18n.t('message.failed'));
        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });
      
      //list suggestions
      that.$store.dispatch('statements/index', {param: 'suggestion'}).then(result => {
        if (result.data) {
          _.each(result.data, function (item) {
            _.each(item.data, function (object) {
              let linkItem = {
                text: '',
                href: '',
                target: '_blank'
              };

              if (item.type === 'Routine') {
                if (object.recurring === 'indefinite') {
                  linkItem.text = '[' + item.type + '] ' + object.name + ', ' + object.recurring + ', ' + object.first_name + ' ' + object.last_name;
                } else {
                  linkItem.text = '[' + item.type + '] ' + object.name + ', ' + object.deadline  + ' - ' + object.recurring + ', ' + object.first_name + ' ' + object.last_name;
                }
              } else {
                linkItem.text = '[' + item.type + '] ' + object.name;
              }
              // linkItem.href = object.url + '?id=' + object.id;
              linkItem.href =  '/' + that.$i18n.locale + object.url + '?id=' + object.id;

              that.predefinedLinkArray.push(linkItem);

              that.predefinedLinkArray = _.sortBy(that.predefinedLinkArray, function (item) {
                return item.text;
              });
            });
          });
          that.$nuxt.$loading.finish();
        } else {
          that.$nuxt.$loading.finish();
        }
      }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
        // that.$toaster.error(that.$i18n.t('message.failed'));
        }
        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });

      // list employee
      that.$store.dispatch('employees/index').then(result => {
        // that.usersArray = result.data;
        that.usersSelection = _.clone(result.data);
        that.usersSelection.unshift(that.dataDefault);
        that.usersSelection.sort(function (a, b) {
          return (a.id - b.id);
        });
      }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }
        // that.$toaster.error(that.$i18n.t('message.fail_employee_view'));
        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });

      if (that.checkAdmin || that.permissionsUser.indexOf('task-basic') > -1) {
        that.checkPermission = 'allow';
      }

      //list objects
      that.$store.dispatch('objects/index', {page,objectTypeArray: ['task', 'sub-goal']}).then(result => {
        that.listArray = result.data;
        that.pagination = result
            delete that.pagination.data
        that.$nuxt.$loading.finish();
      }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
        that.$toaster.error(that.$i18n.t('message.fail_task_view'));
        }
        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });

    });
  },

  methods: {
    redirectUrl(){
      if (this.roleUser == 'company admin') {
              this.$router.push('/settings/billings/');
          }
    },

    translateCol (colName) {
      return this.$i18n.t('column.' + colName);
    },
    textFilter(text){
        this.search = text
          this.fetchData(1)
      },

    close() {
      this.checkAddNew = false;
      this.formDirty = false;
      this.reset();
    },

    changePage(page) {
      this.fetchData(page)
    },
     userSelection(userValue){
        this.user_id = userValue
        this.fetchData(1)
      },

    fetchData: debounce(function(page) {
       let that = this;
       this.current_page = page
      let payload = {};
      payload.page = page;
      if (that.user_id) {
        payload.reported_by = that.user_id;
      }
      if (that.search) {
        payload.by_name = that.search;
      }
      // list tasks
      that.$nuxt.$loading.start();
      that.$store.dispatch('objects/index', {objectTypeArray: ['task', 'sub-goal'] , ...payload}).then(result => {
        // that.listArray = _.filter(result.data, function (item) {
        //   return !item.is_template;
        // });
      that.$nuxt.$loading.start();
        that.listArray = result.data
        that.pagination = result
            delete that.pagination.data
        that.$nuxt.$loading.finish();
      }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
        that.$toaster.error(that.$i18n.t('message.fail_task_view'));
        }
        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });
    },300),

    reset() {
      this.$nuxt.$loading.finish();
      this.newItem = Object.assign({}, this.defaultItem);
      // setTimeout(() => {
      //   this.$refs.form.reset();
      //   this.$refs.form.resetValidation();
      //   this.filterEmployees();
      // }, 300);
    },

    reloadList() {
      let that = this;
       let page = this.current_page
       let payload = {};
      payload.page = page;
      if (that.user_id) {
        payload.reported_by = that.user_id;
      }
      if (that.search) {
        payload.by_name = that.search;
      }
       

      // list tasks
      that.$store.dispatch('objects/index', {objectTypeArray: ['task', 'sub-goal'], ...payload}).then(result => {
        // that.listArray = _.filter(result.data, function (item) {
        //   return !item.is_template;
        // });
        that.listArray = result.data
        that.pagination = result
            delete that.pagination.data
        that.$nuxt.$loading.finish();
      }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
        that.$toaster.error(that.$i18n.t('message.fail_task_view'));
        }
        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });

      // list admin tasks
      // if (that.permissionsUser.indexOf('admin-task') > -1) {
      //   that.$store.dispatch('tasks/indexAdmin', {getBy: 'type'}).then(result => {
      //     that.listArrayByAdmin = result.data;
      //     that.$nuxt.$loading.finish();
      //   }).catch((error) => {
          //   if (error.response.status == 401) {
          //   this.$router.push('/login');
          //   this.$toaster.error(this.$i18n.t('message.token_expired'));
          // }
      //     that.$toaster.error(that.$i18n.t('message.fail_task_view'));
      //     // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
      //     that.$nuxt.$loading.finish();
      //   });
      // }
    },

    reloadListCategory(){
      let that = this;
      that.$store.dispatch('categoriesV2/index', {type: 'task'}).then(result => {
        that.categoriesArray = _.filter(result.data, function (item) {
          return item.is_valid;
        });
        that.categoriesSelection = _.clone(that.categoriesArray);
        that.categoriesSelection.push(that.categoriesDefault);
        that.categoriesSelection.sort(function (a, b) {
          return (a.id - b.id);
        });
        that.$nuxt.$loading.finish();
      }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
        that.$toaster.error(that.$i18n.t('message.fail_category_view'));
        }
        that.$nuxt.$loading.finish();
      });
    },

    async save(value) {
      let that = this;
      that.$nuxt.$loading.start();
      that.newItem = value.item;
      console.log("date issues ",that.newItem);
      that.textTrime = that?.newItem?.name
            that.newItem.name = this.textTrime?.trim()

      this.newItem.description= await removeTagsFromString(that?.newItem?.description);

      that.newItem.start_date = that?.newItem?.start_date_pre == "Invalid date" ? "" : that?.newItem?.start_date_pre;
      that.newItem.deadline_pre = this.newItem?.deadline_pre && this.newItem?.deadline_pre != "" && this.newItem?.deadline_pre != 'Invalid date' ? (this.newItem?.deadline_pre == 'Invalid date' ? "" : this.newItem?.deadline_pre) : (moment( this.newItem?.start_date_pre).add(1, 'days').format('YYYY-MM-DD') == 'Invalid date' ? "" : moment( this.newItem?.start_date_pre).add(1, 'days').format('YYYY-MM-DD'));

      that.newItem.deadline = that?.newItem?.deadline_pre == "Invalid date" ? null : that?.newItem?.deadline_pre;
      that.newItem.start_time = await formatTimeString(new moment(that?.newItem?.start_time_pre, "HH:mm"))
      // that.newItem.start_time = new moment(that?.newItem?.start_time_pre, "HH:mm").utc().format("HH:mm") == "Invalid date" ? "" : new moment(that?.newItem?.start_time_pre, "HH:mm").utc().format("HH:mm");
      that.newItem.end_time_pre = this.newItem?.end_time_pre && this.newItem?.end_time_pre != "" && this.newItem?.end_time_pre != 'Invalid date' ? (this.newItem?.end_time_pre=="Invalid date" ? "" : this.newItem?.end_time_pre) : (that?.newItem?.start_time_pre == "Invalid date" ? "" : that?.newItem?.start_time_pre);
      that.newItem.end_time = await formatTimeString(new moment(this?.newItem?.end_time_pre, "HH:mm"))
      // that.newItem.end_time = new moment(this.newItem?.end_time_pre, "HH:mm").utc().format("HH:mm")== "Invalid date" ? "" : new moment(this.newItem?.end_time_pre, "HH:mm").utc().format("HH:mm")

      
      that.newItem.source = 'Task';
      that.$store.dispatch('objects/store', that.newItem).then(function () {
        that.reloadList();
        that.reloadListCategory();
        that.$toaster.success(that.$i18n.t('message.success_task_add_new'));
      }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
        that.$toaster.error(that.$i18n.t('message.fail_task_add_new'));
        }
        that.$nuxt.$loading.finish();
      });
      that.close();
    },
  },
};
</script>

<style scoped>
:deep(.hover-label .v-badge__badge){
  inset: auto auto calc(100% - 30px) calc(85% - 10px) !important;
}

.badgee{
  position: unset;  
  cursor: pointer;
}
.v-btn--disabled {
    pointer-events: auto;
}

</style>

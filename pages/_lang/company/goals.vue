<template>
  <div class="hse-page">
    <div @mouseenter="hoverGoalPlanAccess = true" @mouseleave="hoverGoalPlanAccess = false" style="width: fit-content">
    <v-badge v-if="!!planAccess?.lastPlanAccess?.goal" :value="hoverGoalPlanAccess" right
          transition="slide-x-transition" class=" hover-label hse--icon-question-circle badgee">
        <span slot="badge" @click="redirectUrl">{{ $t('message.accessible_module') }}</span> 
      </v-badge>
          <v-btn  v-if="tabIndex === 0 ? (checkAdmin || permissionsUser.indexOf('goal-basic') !== -1) : (checkAdmin || permissionsUser.indexOf('goal-resource')) !== -1" class="mt-2 btn-create btn-custom-green"
            @click="checkAddNew = true" :disabled="!!planAccess?.lastPlanAccess?.goal">
            {{ $t('button.add_new') }}
        </v-btn>
      </div>

    <b-tabs v-model="tabIndex" card lazy class="hse-badge-tab">
      <v-badge
        v-if="roleUser !== 'user'"
        :value="hoverResource"
        right
        transition="slide-x-transition"
        class="hse-badge-icon badge-page-goal"
      >
        <span slot="badge">{{ $t('message.below_you_find_available_template') }}</span>
        <v-hover v-model="hoverResource">
          <i class="fa fa-question-circle"></i>
        </v-hover>
      </v-badge>

      <keep-alive>
        <b-tab :title="$t('tab.goals')" :active="!this.$route.query.type">
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKey" />
          <v-container>
            <AddNewPopup
              :resource="false"
              :open-popup="checkAddNew"
              :isRiskAnalysis="false"
              :form-title="$t('title.new_goal')"
              :object-field="objectField"
              :object-item="newItem"
              :categories-array="categoriesArray || []"
              :categories-type="'goal'"
              :predefined-link-array="predefinedLinkArray"
              @savePopup="save"
              @closePopup="checkAddNew = !checkAddNew"
            />

<!--            <GoalPopup-->
<!--              :open-popup="checkAddNew"-->
<!--              :resource="false"-->
<!--              :categories-array="categoriesArray"-->
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

            <GoalTable
              :resource="false"
              :list-array-input="listArray"
              :categories-array="categoriesArray || []"
              :categories-selection="categoriesSelection"
              :processing="processing"
              :users-array="usersArray"
              :users-selection="usersSelection"
              :predefined-link-array="predefinedLinkArray"
              :object-id="paramId"
              @reloadList="reloadList"
              @reloadListCategory="reloadListCategory"
            >
            <template #bottom>
            <custom-pagination :pagination="pagination" @changePage="changePage" />
            </template>
          </GoalTable>
          </v-container>
        </b-tab>
      </keep-alive>

      <keep-alive>
        <b-tab v-if="roleUser !== 'user'" :title="$t('tab.resources')" :active="this.$route.query.type === 'resource'">
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyResource" />
          <v-container>
            <AddNewPopup
              :resource="true"
              :open-popup="checkAddNew"
              :isRiskAnalysis="false"
              :form-title="$t('title.new_goal_resource')"
              :object-field="objectField"
              :object-item="newResourceItem"
              :categories-array="categoriesArray || []"
              :categories-type="'goal'"
              :predefined-link-array="predefinedLinkArray"
              @savePopup="save"
              @closePopup="checkAddNew = !checkAddNew"
            />

<!--            <GoalPopup-->
<!--              :open-popup="checkAddNew"-->
<!--              :resource="true"-->
<!--              :categories-array="categoriesArray"-->
<!--              :project-array="projectArray"-->
<!--              :job-title-array="jobTitleArray"-->
<!--              :departments-array="departmentsArray"-->
<!--              :predefined-link-array="predefinedLinkArray"-->
<!--              @closePopup="checkAddNew = !checkAddNew"-->
<!--              @reloadList="reloadList"-->
<!--              @reloadListCategory="reloadListCategory"-->
<!--              @changeTab="changeTab"-->
<!--            />-->

            <GoalTable
              :resource="true"
              :list-array-input="templates"
              :categories-array="categoriesArray || []"
              :categories-selection="categoriesSelection"
              :users-array="usersArray"
              :users-selection="usersSelection"
              :predefined-link-array="predefinedLinkArray"
              :object-id="paramId"
              @reloadList="reloadList"
              @reloadListCategory="reloadListCategory"
              @changeTab="changeTab"
            >
            <template #bottom>
            <custom-pagination :pagination="pagination" @changePage="changePage" />
            </template>
          </GoalTable>
          </v-container>
        </b-tab>
      </keep-alive>
    </b-tabs>
  </div>
</template>
<script>
  import cookies from 'js-cookie';
  import {_} from 'vue-underscore';
  // import moment from 'moment';
  import TitleCaption from "@/components/TitleCaption";
  import GoalTable from "@/components/GoalTable";
  // import GoalPopup from "../../../components/GoalPopup";
  import AddNewPopup from "@/components/AddNewPopup";
  import customPagination from '../../../components/CustomPagination.vue';
  import debounce from 'lodash/debounce';

  export default {
    components: {
      TitleCaption,
      GoalTable,
      // GoalPopup,
      AddNewPopup,
      customPagination
    },

    data: () => ({
    pagination: {},
    current_page: 1,
      hoverGoalPlanAccess:false,
      pageKey: 'company-goals-goals',
      pageKeyResource: 'company-goals-resources',
      userRoleId: parseInt(cookies.get('roleID')),
      // userDepartmentID: parseInt(cookies.get('userDepartmentID')),
      checkAdmin: cookies.get('checkAdmin'),
      roleUser: cookies.get('roleUser'),
      permissionsUser: localStorage.getItem('permissionsKey'),
      planAccess: JSON.parse(localStorage.getItem('planAccess')),
      checkAddNew: false,
      // nowDate: new Date().toISOString().substr(0, 10),
      listArray: [],
      templates: [],
      // taskArray: [],
      dataDefault: {
        id: 0,
        first_name: "All",
        last_name: "",
      },
      usersArray: [],
      usersSelection: [],
      tabIndex: 0,
      formDirty: false,
      processing: {
        new: 0,
        total: 0,
        processing: 0,
        finished: 0
      },
      addedByResource: [ // filter Added by: System / Custom
        {
          value: 0,
          name: "All"
        }, {
          value: 1,
          name: "System"
        }, {
          value: 2,
          name: "Custom"
        }
      ],
      // countChoose: 0,
      // selectedFruits: [],
      // statusNew: 1,
      // statusClosed: 3,
      isClosed: false,
      denyEdit: false,
      // dialogConfirmSaveEdit: false,
      taskAssigneesArray: [],
      taskAssigneesArrayAddNew: [],
      responsibleArray: [],
      responsibleArrayAddNew: [],
      predefinedLinkArray: [],
      // badge
      hoverResource: false,
      paramId: '',
      // category
      categoriesArray: [],
      categoriesSelection: [],
      categoriesDefault: {
        id: 0,
        name: "All"
      },
      // add new popup - list object fields
      objectField: [
        'name',
        'description',
        'goal-type',
        'category',
        'connect-to',
        'sub-goal',
        'responsible',
        'attendee',
        'start-date',
        'deadline',
      ],
      newItem: {
        is_template: false,
        name: "",
        type: 'goal',
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
        // sub goal
        subGoal: [],
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
        connectToArray: [],
      },
      defaultItem: {
        is_template: false,
        name: "",
        type: 'goal',
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
        // sub goal
        subGoal: [],
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
        connectToArray: [],
      },

      // resource
      newResourceItem: {
        is_template: true,
        name: "",
        type: 'goal',
        description: "",
        category_id: '',
        is_suggestion: false,
        is_valid: true,
        status: 'new',
        // sub goal
        subGoal: [],
      },
      defaultResourceItem: {
        is_template: true,
        name: "",
        type: 'goal',
        description: "",
        category_id: '',
        is_suggestion: false,
        is_valid: true,
        status: 'new',
        // sub goal
        subGoal: [],
      },
      is_template: 0,
    }),

    computed: {},

    watch: {
      tabIndex(value) {
        this.is_template = value;
        console.log(value, 'tabvalue');
        this.fetchData(1);
      }
    },

    created() {
      if (this.$route.query.id) {
        this.paramId = this.$route.query.id;
      }
    },

    mounted() {
      let that = this;
      that.$nextTick(() => {
        that.$nuxt.$loading.start();
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
          }
          that.$nuxt.$loading.finish();
        });

        // list categories
        that.$store.dispatch('categoriesV2/index', {type: 'goal'}).then(result => {
          that.categoriesArray = result.data;
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
          that.$nuxt.$loading.finish();
        });

        // list employee
        that.$store.dispatch('employees/index').then(result => {
          that.usersArray = result.data;
          that.usersSelection = _.clone(result.data);
          that.usersSelection.unshift(that.dataDefault);
          that.usersSelection.sort(function (a, b) {
            return (a.id - b.id);
          });

          // list responsible & task assignee
          _.each(result.data, function(i) {
            if (i.department_name) {
              i.name = i.name + ' - ' + i.department_name;
            }
          });
          that.taskAssigneesArray = result.data;
          that.taskAssigneesArrayAddNew = _.clone(result.data);
          that.taskAssigneesArrayAddNew = _.filter(that.taskAssigneesArrayAddNew, function (item) {
            return item.disable_status === 0;
          });

          that.responsibleArray = _.clone(result.data);
          that.responsibleArray = _.filter(that.responsibleArray, function (item) {
            return item.role_id === 2 || item.role_id === 3;
          });
          that.responsibleArrayAddNew = _.clone(that.responsibleArray);
          that.responsibleArrayAddNew = _.filter(that.responsibleArrayAddNew, function (item) {
            return item.disable_status === 0;
          });
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }
          that.$nuxt.$loading.finish();
        });

        // list goals
       this.fetchData(1);
    })
  },

    methods: {
      changePage(page) {
       this.fetchData(page)
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
      payload.is_template = that.is_template;
      that.$nuxt.$loading.start();
      that.$store.dispatch('objects/index', {objectType: 'goal',...payload}).then(result => {
          that.listArray = _.filter(result.data, function (item) {
            return !item.is_template;
          });
          that.processing = {
            total: that.listArray.length,
            new: _.filter(that.listArray, function (item) {
              return item.status === 'new';
            }).length,
            processing: _.filter(that.listArray, function (item) {
              return item.status === 'ongoing';
            }).length,
            finished: _.filter(that.listArray, function (item) {
              return item.status === 'closed';
            }).length,
          };
          that.templates = _.filter(result.data, function (item) {
            return item.is_template;
          });
          that.$nuxt.$loading.start();
           that.pagination = result
            delete that.pagination.data
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_goal_view'));
          }
          that.$nuxt.$loading.finish();
        });
    }),


      redirectUrl(){
        if (this.roleUser == 'company admin') {
              this.$router.push('/settings/billings/');
          }
      },
      changeTab(value) {
        this.tabIndex = value;
      },

      close() {
        this.checkAddNew = false;
        this.reset();
      },

      reset() {
        this.$nuxt.$loading.finish();
        this.newItem = Object.assign({}, this.defaultItem);
        this.newResourceItem = Object.assign({}, this.defaultResourceItem);
      },

      reloadList(){
        let that = this;
        // get list
        that.$store.dispatch('objects/index', {objectType: 'goal'}).then(result => {
          that.listArray = _.filter(result.data, function (item) {
            return !item.is_template;
          });
          that.processing = {
            total: that.listArray.length,
            new: _.filter(that.listArray, function(item){
              return item.status === 'new';
            }).length,
            processing: _.filter(that.listArray, function(item){
              return item.status === 2;
            }).length,
            finished: _.filter(that.listArray, function(item){
              return item.status === 'closed';
            }).length,
          };
          that.templates = _.filter(result.data, function (item) {
            return item.is_template;
          });
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_goal_view'));
          }
          that.$nuxt.$loading.finish();
        });
      },

      reloadListCategory(){
        let that = this;
        that.$store.dispatch('categoriesV2/index', {type: 'goal'}).then(result => {
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

      save(value) {
        let that = this;
        that.$nuxt.$loading.start();
        that.newItem = value.item;
        if (!that.newItem.is_template) {
          if (that.newItem.subGoal.length > 0) {
            _.each(that.newItem.subGoal, function (item) {
              item.isDefaultResponsible = that.newItem.isDefaultResponsible;
              item.responsible_department_array = that.newItem.responsible_department_array;
              item.responsible_employee_array = that.newItem.responsible_employee_array;
              item.responsible_required_comment = that.newItem.responsible_required_comment;
              item.responsible_required_attachment = that.newItem.responsible_required_attachment;
              item.start_date = item.start_date_pre;
              item.start_time = item.start_time_pre;
              item.deadline = item.deadline_pre;
              item.end_time = item.end_time_pre;
            });
          } else {
            that.newItem.start_date = that.newItem.start_date_pre;
            that.newItem.start_time = that.newItem.start_time_pre;
            that.newItem.deadline = that.newItem.deadline_pre;
            that.newItem.end_time = that.newItem.end_time_pre;
          }
        }
        that.$store.dispatch('objects/store', that.newItem).then(function () {
          that.reloadList();
          that.reloadListCategory();
          that.$toaster.success(that.$i18n.t('message.success_goal_add_new'));
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_goal_add_new'));
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

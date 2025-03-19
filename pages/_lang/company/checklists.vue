<template>
  <div class="hse-page">
    
    <div @mouseenter="hoverChecklistPlanAccess = true" @mouseleave="hoverChecklistPlanAccess = false" style="width: fit-content">
      <v-badge v-if="!!planAccess?.lastPlanAccess?.checklist" :value="hoverChecklistPlanAccess" right transition="slide-x-transition"
        class=" hover-label hse--icon-question-circle badgee">
        <span slot="badge" @click="redirectUrl">{{ $t('message.accessible_module') }}</span>
      </v-badge>
        <v-btn
          v-if="tabIndex === 0 ? (checkAdmin && !checkSuperAdmin || permissionsUser.indexOf(',checklist-basic') !== -1) : (checkAdmin || permissionsUser.indexOf(',checklist-resource') !== -1)"
          class="mt-2 btn-create btn-custom-green"
          @click="checkAddNew = true" :disabled="!!planAccess?.lastPlanAccess?.checklist">
          {{ $t('button.add_new') }}
        </v-btn>
    </div>

    <b-tabs v-model="tabIndex" card lazy class="hse-badge-tab">
      <v-badge
        v-if="!checkUser && !checkManager"
        :value="hoverResource"
        right
        transition="slide-x-transition"
        class="hse-badge-icon"
      >
        <span slot="badge">Below you find the available template</span>
        <v-hover v-model="hoverResource">
          <i class="fa fa-question-circle"></i>
        </v-hover>
      </v-badge>

      <keep-alive>
        <b-tab :title="$t('tab.checklists')" :active="!this.$route.query.type" class="result-tab" @click="checklistTab">
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKey" />
          <v-container>
            <ChecklistPopup
              :open-popup="checkAddNew"
              :resource="false"
              :categories-array="categoriesArray"
              :job-title-array="jobTitleArray"
              :departments-array="departmentsArray"
              :list-answer-array="answerArray"
              :predefined-link-array="predefinedLinkArray"
              @closePopup="checkAddNew = !checkAddNew"
              @reloadList="reloadList"
              @reloadListCategory="reloadListCategory"
              @reloadAnswerOptionsList="reloadAnswerOptionsList"
              @reloadOptionsAfterCancel="reloadOptionsAfterCancel"
              @changeTab="changeTab"
            />
            <ChecklistTable
              :resource="false"
              :list-array-input="listArray"
              :job-title-array="jobTitleArray"
              :job-title-selection="jobTitleSelection"
              :departments-array="departmentsArray"
              :departments-selection="departmentsSelection"
              :categories-array="categoriesArray"
              :categories-selection="categoriesSelection"
              :users-array="usersArray"
              :users-selection="usersSelection"
              :predefined-link-array="predefinedLinkArray"
              :object-id="paramId"
              :statusSelect="statusSelect"
              @reloadList="reloadList"
              @reloadListCategory="reloadListCategory"
              @changeTab="changeTab"
              @userSelection="userSelection"
              @statusSelection="statusSelection"
              @textFilter="textFilter"
              @dateSelection="dateSelection"
              @departmentSelection="departmentSelection"
              @jobSelection="jobSelection"
            />
              <!-- :search_value="search" -->
            <v-col
              class="d-flex justify-content-start align-items-center cust-pagination"
            >
              <div class="cust-col">
                <span class="pagination-cust-text"
                  >{{ pagination.from || '0'}} - {{ pagination.to || '0' }} of
                  {{ pagination.total || '0' }}</span
                >
              </div>
              <v-col>
                <v-pagination
                  v-model="current_page"
                  :length="pagination.last_page"
                  :total-visible="0"
                  @input="changePage"
                  class="pagination-btns"
                ></v-pagination>
              </v-col>
            </v-col>
          </v-container>
        </b-tab>
      </keep-alive>

      <keep-alive>
        <!-- v-if="!checkUser || !checkManager" -->
        <b-tab v-if="!checkUser && !checkManager" :title="$t('tab.resources')" :active="this.$route.query.type === 'resource'" @click="resourcesTab">
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyResource" />
          <v-container>
            <ChecklistPopup
              :open-popup="checkAddNew"
              :resource="true"
              :categories-array="categoriesArray"
              :job-title-array="jobTitleArray"
              :departments-array="departmentsArray"
              :list-answer-array="answerArray"
              :predefined-link-array="predefinedLinkArray"
              @closePopup="checkAddNew = !checkAddNew"
              @resourceList="resourcesTab"
              @reloadListCategory="reloadListCategory"
              @reloadAnswerOptionsList="reloadAnswerOptionsList"
              @reloadOptionsAfterCancel="reloadOptionsAfterCancel"
              @changeTab="changeTab"
            />
            <ChecklistTable
              :resource="true"
              :list-array-input="templates"
              :job-title-array="jobTitleArray"
              :job-title-selection="jobTitleSelection"
              :departments-array="departmentsArray"
              :departments-selection="departmentsSelection"
              :categories-array="categoriesArray"
              :categories-selection="categoriesSelection"
              :users-array="usersArray"
              :users-selection="usersSelection"
              :predefined-link-array="predefinedLinkArray"
              :object-id="paramId"
              :addedByResource="addedByResource"
              :search_value="search_resource"
              @resourceList="resourcesTab"
              @reloadListCategory="reloadListCategory"
              @changeTab="changeTab"
              @userSelectionResource="userSelectionResource"
              @dateSelectionResource="dateSelectionResource"
               @textFilterResource="textFilterResource"
            />
            <v-col
              class="d-flex justify-content-start align-items-center cust-pagination"
            >
              <div class="cust-col">
                <span class="pagination-cust-text"
                  >{{ pagination.from || '0'}} - {{ pagination.to || '0' }} of
                  {{ pagination.total || '0' }}</span
                >
              </div>
              <v-col>
                <v-pagination
                  v-model="current_page"
                  :length="pagination.last_page"
                  :total-visible="0"
                  @input="changePageResource"
                  class="pagination-btns"
                ></v-pagination>
              </v-col>
            </v-col>
          </v-container>
        </b-tab>
      </keep-alive>

      <keep-alive v-if="checkAdmin || permissionsUser.indexOf(',checklist-basic') > -1 || permissionsUser.indexOf(',checklist-resource') > -1">
        <b-tab :title="$t('tab.answer_options')" name="options-template-tab">
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyAnswerOption" />
          <!-- <v-container> -->
            <b-tabs v-model="tabAnswerIndex" card class="section-categories" lazy>
              <keep-alive class="w-100">
                <b-tab :title="$t('subTab.activate')" active name="activate-tab" class="result-tab">
                  <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyActivate" />
                  <v-container>
                    <AnswerOptionTable
                      :list-array-input="answerOptionsArray"
                      :resource="false"
                      @reloadAnswerOptionsList="reloadAnswerOptionsList"
                    />
                  </v-container>
                </b-tab>
              </keep-alive>
              <keep-alive>
                <b-tab :title="$t('subTab.template')" name="template-tab" class="result-tab">
                  <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyTemplate" />
                  <v-container>
                    <AnswerOptionTable
                      :list-array-input="resourceOptionsArray"
                      :resource="true"
                      @reloadAnswerOptionsList="reloadAnswerOptionsList"
                    />
                  </v-container>
                </b-tab>
              </keep-alive>
            </b-tabs>
          <!-- </v-container> -->

          <!-- <AnswerOptionPopup
            :open-popup="checkAddNew"
            :resource="true"
            @closePopup="checkAddNew = !checkAddNew"
            @reloadAnswerOptionsList="reloadAnswerOptionsList"
          /> -->
          <NewAnswerOptionPopup
            :open-popup="checkAddNew"
            :resource="userRoleId === 1"
            @closePopup="checkAddNew = !checkAddNew"
            @reloadAnswerOptionsList="reloadAnswerOptionsList"
            @isSelectOption="isSelectOption"
          />
        </b-tab>
      </keep-alive>
    </b-tabs>
  </div>
</template>
<script>
import {_} from 'vue-underscore';
import cookies from 'js-cookie';
import TitleCaption from "../../../components/TitleCaption";
import ChecklistTable from "../../../components/ChecklistTable";
import ChecklistPopup from "../../../components/ChecklistPopup";
import AnswerOptionTable from "../../../components/AnswerOptionTable";
import NewAnswerOptionPopup from '../../../components/NewAnswerOptionPopup.vue';
// import AnswerOptionPopup from "../../../components/AnswerOptionPopup";
import debounce from 'lodash/debounce';


export default {
  components: {
    TitleCaption,
    ChecklistTable,
    ChecklistPopup,
    AnswerOptionTable,
    NewAnswerOptionPopup,
    // AnswerOptionPopup,
  },

  data: () => ({
    hoverChecklistPlanAccess: false,
    pageKey: 'company-checklists-checklists',
    pageKeyResource: 'company-checklists-resources',
    pageKeyAnswerOption: 'company-checklists-answer-options',
    pageKeyActivate: 'company-checklists-answer-options-activate',
    pageKeyTemplate: 'company-checklists-answer-options-template',
    userRoleId: parseInt(cookies.get('roleID')),
    userDepartmentID: parseInt(cookies.get('userDepartmentID')),
    checkSuperAdmin: cookies.get('checkSuperAdmin'),
    checkAdmin: cookies.get('checkAdmin'),
    roleUser: cookies.get('roleUser'),
    permissionsUser: localStorage.getItem('permissionsKey'),
    planAccess: JSON.parse(localStorage.getItem('planAccess')),
    nowDate: new Date().toISOString().substr(0, 10),
    checkAddNew: false,
    listArray: [],
    dataDefault: {
      id: 0,
      first_name: "All",
      last_name: "",
    },
    usersArray: [],
    usersSelection: [],
    templates: [],
    departmentsArray: [],
    departmentsSelection: [],
    jobTitleSelection: [],
    departmentDefault: {
      id: 0,
      name: "All"
    },
    jobTitleDefault: {
      id: 0,
      name: "All"
    },
    jobTitleArray: [],
    taskAssigneesArray: [],
    tabIndex: 0,
    formDirty: false,
    processing: {
      new: 0,
      total: 0,
      processing: 0,
      finished: 0
    },
    categoriesArray: [],
    categoriesSelection: [],
    categoriesDefault: {
      id: 0,
      name: "All"
    },
    category_checklist: 'checklist',
    answerArray: [],

    // New CHECKPOINT
    isAddNewCheckpoint: false,
    headersCheckpointOptions: [
      {text: 'Slider', align: 'left', value: 'slider'},
      {text: 'Dropdown', align: 'left', value: 'dropdown'}
    ],
    listCheckpointOptions: [],

    // OPTIONS create for each checkpoint
    dialogNewOption: false,
    newDefaultOptionIndex: -1,
    newDefaultOption: {
      name: '',
      type_of_option_answer: '',
      company_id: '',
      checklist_id: '',
      answer: [],
      is_template: true,
    },
    defaultDefaultOption: {
      name: '',
      type_of_option_answer: '',
      company_id: '',
      checklist_id: '',
      answer: [],
      is_template: true,
    },
    optionAnswerType: false,
    headerOptionAnswerArray: [
      {text: '', align: 'center', value: 'drag', sortable: false},
      {text: 'Name', align: 'center', value: 'name', sortable: false},
      {text: 'Arrangement', align: 'center', value: 'arrangement_order', sortable: false},
      {text: 'Action', align: 'center', value: 'action', sortable: false},
    ],
    optionAnswerArray: [],
    newOptionAnswer: {
      name: '',
      arrangement_order: ''
    },
    defaultOptionAnswer: {
      name: '',
      arrangement_order: ''
    },
    actionForNewDefaultOption: [
      {
        value: 1,
        name: "Template"
      }, {
        value: 0,
        name: "Activate"
      }
    ],
    is_template_option: 1,
    hoverActionForNewDefaultOption: false,
    isAddNewTemplateOption: false,
    // Default options table
    tabAnswerIndex: 0,
    answerOptionsArray: [], // tab Answer Options - list activate
    resourceOptionsArray: [], // tab Answer Options - list TEMPLATE
    // Use checklist
    file_accept: "image/png, image/jpeg, image/jpg, image/gif",
    // badge
    hoverResource: false,
    predefinedLinkArray: [],
    paramId: '',
    checkManager:false,
    checkUser:false,
    addedByResource: [
      {
        value: 0,
        name: "All"
      }, {
        value: 1,
        name: "System"
      }, {
        value: 2,
        name: "Company Admin"
      }
    ],
    statusSelect: [ {
      value: 0,
      name: "All"
    },
    {
      value: 1,
      name: "New"
    },
    {
      value: 2,
      name: "Ongoing"
    },
    {
      value: 3,
      name: "Closed"
    }
    ],
    pagination: {},
    current_page: 1,
    checkStatus:'',
    start_date:'',
    end_date:'',
    user_id:'',
    userResource_id:'',
    search_resource:'',
    search:'',
    jobValue: '',
    depValue: ''
  }),

  created() {
    if (this.$route.query.id) {
      this.paramId = this.$route.query.id;
    }
    if(this.roleUser=='manager')
      this.checkManager=true

    if (this.roleUser=='user')
      this.checkUser=true
  },

  computed: {

  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  mounted() {
    let that = this;
    let page = this.current_page
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
      }).catch(() => {
        // that.$toaster.error(that.$i18n.t('message.fail_statement_view'));
        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });

      // get company_id
      that.$store.dispatch('authenticate/profile').then(result => {
        that.company_id = result.data.company_id;
      }).catch(() => {
        // that.$toaster.error(that.$i18n.t('message.failed'));
        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });

      // list departments
      that.$store.dispatch('departments/index').then(result => {
        that.departmentsArray = result.data;
        that.departmentsSelection = _.clone(result.data);
        that.departmentsSelection.push(that.departmentDefault);
        that.departmentsSelection.sort(function (a, b) {
          return (a.id - b.id);
        });
      }).catch(() => {
        // that.$toaster.error(that.$i18n.t('message.fail_department_view'));
        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });

      // list users
      that.$store.dispatch('employees/index').then(result => {
        that.usersArray = result.data;
        that.usersSelection = _.clone(result.data);
        that.usersSelection.unshift(that.dataDefault);
        that.usersSelection.sort(function (a, b) {
          return (a.id - b.id);
        });
      }).catch(() => {
        // that.$toaster.error(that.$i18n.t('message.fail_employee_view'));
        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });

      // list checklists
      // that.$store.dispatch('checklists/index').then(result => {
      that.$nuxt.$loading.start();
      that.$store.dispatch('objects/index', { page, objectTypeArray: [that.category_checklist]}).then(result => {
        that.listArray = _.filter(result.data, function (item) {
          return !item.is_template;
        });
        that.processing = {
          total: that.listArray.length,
          new: _.filter(that.listArray, function (item) {
            return item.status === 'New';
          }).length,
          processing: _.filter(that.listArray, function (item) {
            return item.status === 'Ongoing';
          }).length,
          finished: _.filter(that.listArray, function (item) {
            return item.status === 'Finished';
          }).length,
        };
        that.templates = _.filter(result.data, function (item) {
          return item.is_template;
        });
        that.templates = _.each(that.templates, function (item) {
          item.department_id = item.department_name = item.job_title_id = item.job_title_name = null;
        });
        that.pagination = result
        delete that.pagination.data
        that.$nuxt.$loading.finish();
      }).catch((error) => {
        if (error.response.status == 401) {
          this.$router.push('/login');
          this.$toaster.error(this.$i18n.t('message.token_expired'));
        }else{
          that.$toaster.error(that.$i18n.t('message.fail_checklist_view'));
        }
        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });

      if (that.resource) {

        that.$store.dispatch('checklists/index',{page}).then(result => {
          that.listArray = _.filter(result.data, function (item) {
            return item.is_template;
          });
          that.processing = {
            total: that.listArray.length,
            new: _.filter(that.listArray, function (item) {
              return item.status === 'New';
            }).length,
            processing: _.filter(that.listArray, function (item) {
              return item.status === 'Ongoing';
            }).length,
            finished: _.filter(that.listArray, function (item) {
              return item.status === 'Finished';
            }).length,
          };
          that.templates = _.filter(result.data, function (item) {
            return !item.is_template;
          });
          that.templates = _.each(that.templates, function (item) {
            item.department_id = item.department_name = item.job_title_id = item.job_title_name = null;
          });
          that.pagination = result
          delete that.pagination.data
          that.$nuxt.$loading.finish();
        }).catch((error) => {
          if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_checklist_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      }


      // list categories
      that.$store.dispatch('categoriesV2/index', {type: that.category_checklist}).then(result => {
        that.categoriesArray = result.data;
        that.categoriesSelection = _.clone(result.data);
        that.categoriesSelection.push(that.categoriesDefault);
        that.categoriesSelection.sort(function (a, b) {
          return (a.id - b.id);
        });
      }).catch(() => {
        // that.$toaster.error(that.$i18n.t('message.fail_category_view'));
        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });

      // list checklist Default OPTIONS list
      that.$store.dispatch('options/index').then(result => {
        that.answerOptionsArray = _.filter(result.data, function (item) {
          return !item.is_template;
        });
        that.resourceOptionsArray = _.filter(result.data, function (item) {
          return item.is_template;
        });
      }).catch((error) => {
        if (error.response.status == 401) {
          this.$router.push('/login');
          this.$toaster.error(this.$i18n.t('message.token_expired'));
        }else{
          that.$toaster.error(that.$i18n.t('message.fail_checklist_option_view'));
        }
        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });

      // list job titles
      that.$store.dispatch('jobTitles/index').then(result => {
        that.jobTitleArray = result.data;
        that.jobTitleSelection = _.clone(result.data);
        that.jobTitleSelection.push(that.jobTitleDefault);
        that.jobTitleSelection.sort(function (a, b) {
          return (a.id - b.id);
        });
      }).catch(() => {
        // that.$toaster.error(that.$i18n.t('message.fail_job_title_view'));
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

    changeTab(value) {
      this.tabIndex = value;
      this.reloadList()
    },

    changePage(page) {
      this.fetchData(page)
    },
    changePageResource(page) {
      this.fetchDataResource(page)
    },
    userSelection(userValue){
      this.user_id = userValue
      this.fetchData(1)
    },
    userSelectionResource(userValue){
      this.userResource_id = userValue
      this.fetchDataResource(1)
    },
    textFilter(text){
      this.search = text
      this.fetchData(1)
    },
    textFilterResource(text){
      this.search_resource = text
      this.fetchDataResource(1)
    },
    statusSelection(statusValue){
      this.checkStatus = statusValue
      this.fetchData(1)
    },
    jobSelection(jobValue){
      this.jobValue = jobValue
      this.fetchData(1)
    },
    departmentSelection(depValue){
      this.depValue = depValue
      this.fetchData(1)
    },
    dateSelection(dateValue){
      console.log('sdnfvjudh');
      const inputDate = dateValue.startDate;
      const dateObj = new Date(inputDate);
      const year = dateObj.getFullYear();
      const month = dateObj.getMonth() + 1; // Add 1 to the month as it is zero-indexed
      const day = dateObj.getDate();
      const start_date = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;


      const inputDate2 = dateValue.endDate;
      const dateObj2 = new Date(inputDate2);
      const year2 = dateObj2.getFullYear();
      const month2 = dateObj2.getMonth() + 1; // Add 1 to the month as it is zero-indexed
      const day2 = dateObj2.getDate();
      const end_date = `${year2}-${month2.toString().padStart(2, "0")}-${day2.toString().padStart(2, "0")}`;

      this.start_date= start_date === "1970-01-01" ? '' : start_date;
      this.end_date=end_date === "1970-01-01" ? '' : end_date;
      this.fetchData(1)
    },

    dateSelectionResource(dateValue){
      const inputDate = dateValue.startDate;
      const dateObj = new Date(inputDate);
      const year = dateObj.getFullYear();
      const month = dateObj.getMonth() + 1; // Add 1 to the month as it is zero-indexed
      const day = dateObj.getDate();
      const start_date = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;


      const inputDate2 = dateValue.endDate;
      const dateObj2 = new Date(inputDate2);
      const year2 = dateObj2.getFullYear();
      const month2 = dateObj2.getMonth() + 1; // Add 1 to the month as it is zero-indexed
      const day2 = dateObj2.getDate();
      const end_date = `${year2}-${month2.toString().padStart(2, "0")}-${day2.toString().padStart(2, "0")}`;




      this.start_date= start_date === "1970-01-01" ? '' : start_date;
      this.end_date=end_date === "1970-01-01" ? '' : end_date;
      this.fetchDataResource(1)
    },

    fetchData: debounce(function(page) {
      let that = this
      this.current_page = page
      let payload = {};
      payload.page = page;
      if (that.user_id) {
        payload.reported_by = that.user_id;
      }
      if (that.start_date) {
        payload.startDate = that.start_date;
      }
      if (that.end_date) {
        payload.endDate = that.end_date;
      }
      if (that.search) {
        payload.by_name = that.search;
      }
      if (that.checkStatus) {
        payload.status = that.checkStatus;
      }
      if (that.jobValue) {
        payload.job_title = that.jobValue;
      }
      if (that.depValue) {
        payload.department = that.depValue;
      }

      that.$store.dispatch('objects/index', { objectTypeArray: [that.category_checklist] , ...payload}).then(result => {
        that.listArray = result.data;
        // that.listArray = _.filter(result.data, function (item) {
        //   return !item.is_template;
        // });
        that.processing = {
          total: that.listArray.length,
          new: _.filter(that.listArray, function (item) {
            return item.status === 'New';
          }).length,
          processing: _.filter(that.listArray, function (item) {
            return item.status === 'Ongoing';
          }).length,
          finished: _.filter(that.listArray, function (item) {
            return item.status === 'Finished';
          }).length,
        };
        that.templates = _.filter(result.data, function (item) {
          return item.is_template;
        });
        that.templates = _.each(that.templates, function (item) {
          item.department_id = item.department_name = item.job_title_id = item.job_title_name = null;
        });


        that.pagination = result
        delete that.pagination.data

        that.$nuxt.$loading.finish();
      }).catch((error) => {
        if (error.response.status == 401) {
          this.$router.push('/login');
          this.$toaster.error(this.$i18n.t('message.token_expired'));
        }else{
          that.$toaster.error(that.$i18n.t('message.fail_checklist_view'));
        }
        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });
    },300),

    fetchDataResource: debounce(function(page) {
      let that = this

      this.current_page = page
      let payload = {};
      payload.page = page;
      if (that.userResource_id) {
        payload.reported_by = that.userResource_id;
      }
      if (that.start_date) {
        payload.startDate = that.start_date;
      }
      if (that.end_date) {
        payload.endDate = that.end_date;
      }
      if (that.search_resource) {
        payload.by_name = that.search_resource;
      }
      that.$store.dispatch('checklists/index',payload).then(result => {
        that.listArray = _.filter(result.data, function (item) {
          return !item.is_template;
        });
        that.processing = {
          total: that.listArray.length,
          new: _.filter(that.listArray, function(item){
            return item.status === 'New';
          }).length,
          processing: _.filter(that.listArray, function(item){
            return item.status === 'Ongoing';
          }).length,
          finished: _.filter(that.listArray, function(item){
            return item.status === 'Finished';
          }).length,
        };
        that.templates = _.filter(result.data, function (item) {
          return item.is_template;
        });
        that.templates = _.each(that.templates, function (item) {
          item.department_id = item.department_name = item.job_title_id = item.job_title_name = null;
        });

        that.pagination = result
        delete that.pagination.data
        that.$nuxt.$loading.finish();
      }).catch((error) => {
        if (error.response.status == 401) {
          this.$router.push('/login');
          this.$toaster.error(this.$i18n.t('message.token_expired'));
        }else{
          that.$toaster.error(that.$i18n.t('message.fail_checklist_view'));
        }
        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });
    },300),

    close() {
      this.reset();
    },

    isSelectOption(){},

    reloadList(){
      let that = this;
      // get list
      // that.$store.dispatch('objects/index').then(result => {
      let page = this.current_page
      that.$nuxt.$loading.start();
      that.$store.dispatch('objects/index', { page ,objectTypeArray: [that.category_checklist]}).then(result => {
        that.listArray = _.filter(result.data, function (item) {
          return !item.is_template;
        });
        that.processing = {
          total: that.listArray.length,
          new: _.filter(that.listArray, function(item){
            return item.status === 'New';
          }).length,
          processing: _.filter(that.listArray, function(item){
            return item.status === 'Ongoing';
          }).length,
          finished: _.filter(that.listArray, function(item){
            return item.status === 'Finished';
          }).length,
        };
        that.templates = _.filter(result.data, function (item) {
          return item.is_template;
        });
        that.templates = _.each(that.templates, function (item) {
          item.department_id = item.department_name = item.job_title_id = item.job_title_name = null;
        });
        that.pagination = result
        delete that.pagination.data
        that.$nuxt.$loading.finish();
      }).catch((error) => {
        if (error.response.status == 401) {
          this.$router.push('/login');
          this.$toaster.error(this.$i18n.t('message.token_expired'));
        }else{
          that.$toaster.error(that.$i18n.t('message.fail_checklist_view'));
        }
        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });
    },
    checklistTab(){
      let that = this;
      let page = this.current_page
      that.search_resource = ""
      that.$nuxt.$loading.start();
      that.$store.dispatch('objects/index', { objectTypeArray: [that.category_checklist] , page}).then(result => {
        that.listArray = _.filter(result.data, function (item) {
          return !item.is_template;
        });
        that.processing = {
          total: that.listArray.length,
          new: _.filter(that.listArray, function(item){
            return item.status === 'New';
          }).length,
          processing: _.filter(that.listArray, function(item){
            return item.status === 'Ongoing';
          }).length,
          finished: _.filter(that.listArray, function(item){
            return item.status === 'Finished';
          }).length,
        };
        that.templates = _.filter(result.data, function (item) {
          return item.is_template;
        });
        that.templates = _.each(that.templates, function (item) {
          item.department_id = item.department_name = item.job_title_id = item.job_title_name = null;
        });

        that.pagination = result
        delete that.pagination.data
        that.$nuxt.$loading.finish();
      }).catch((error) => {
        if (error.response.status == 401) {
          this.$router.push('/login');
          this.$toaster.error(this.$i18n.t('message.token_expired'));
        }else{
          that.$toaster.error(that.$i18n.t('message.fail_checklist_view'));
        }
        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });
    },

    resourcesTab(){
      let that = this;
      let page = this.current_page
      that.search = ""
      that.$nuxt.$loading.start();
      that.$store.dispatch('checklists/index',{page}).then(result => {
        that.listArray = _.filter(result.data, function (item) {
          return !item.is_template;
        });
        that.processing = {
          total: that.listArray.length,
          new: _.filter(that.listArray, function(item){
            return item.status === 'New';
          }).length,
          processing: _.filter(that.listArray, function(item){
            return item.status === 'Ongoing';
          }).length,
          finished: _.filter(that.listArray, function(item){
            return item.status === 'Finished';
          }).length,
        };
        that.templates = _.filter(result.data, function (item) {
          return item.is_template;
        });
        that.templates = _.each(that.templates, function (item) {
          item.department_id = item.department_name = item.job_title_id = item.job_title_name = null;
        });

        that.pagination = result
        delete that.pagination.data
        that.$nuxt.$loading.finish();
      }).catch((error) => {
        if (error.response.status == 401) {
          this.$router.push('/login');
          this.$toaster.error(this.$i18n.t('message.token_expired'));
        }else{
          that.$toaster.error(that.$i18n.t('message.fail_checklist_view'));
        }
        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });
    },

    reloadListCategory(){
      let that = this;
      that.$store.dispatch('categoriesV2/index', {type: that.category_checklist}).then(result => {
        that.categoriesArray = _.filter(result.data, function (item) {
          return !item.disable_status;
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
        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });
    },

    reset() {
      this.answerArray = [];
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.$refs.form.reset();
        this.$refs.form.resetValidation();
      }, 0);
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

    reloadAnswerOptionsList() {
      let that = this;
      // get checklist Default OPTIONS list
      that.$store.dispatch('options/index').then(result => {
        that.getChecklistOptions(result.data);
        that.$nuxt.$loading.finish();
      }).catch((error) => {
        if (error.response.status == 401) {
          this.$router.push('/login');
          this.$toaster.error(this.$i18n.t('message.token_expired'));
        }else{
          that.$toaster.error(that.$i18n.t('message.fail_checklist_option_view'));
        }
        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });
    },

    reloadOptionsAfterCancel() {
      let that = this;
      that.$store.dispatch('options/index', {checkOptionsList:true}).then(result => {
        that.getChecklistOptions(result.data);
      }).catch((error) => {
        if (error.response.status == 401) {
          this.$router.push('/login');
          this.$toaster.error(this.$i18n.t('message.token_expired'));
        }else{
          that.$toaster.error(that.$i18n.t('message.fail_checklist_option_view'));
        }
        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });
    },

    getChecklistOptions (list) {
      let that = this;
      that.answerOptionsArray = _.filter(list, function (item) {
        return !item.is_template;
      });
      that.resourceOptionsArray = _.filter(list, function (item) {
        return item.is_template;
      });
      that.answerArray = _.filter(list, function (item) {
        return item.is_template || (!item.is_template && item.checklist_id === null);
      });
      that.answerArray = _.sortBy(that.answerArray, function(answer) {
        return answer.count_used_time;
      });
      that.formatNameOfDefaultOptionType(that.answerArray.reverse());
    },
  },
};
</script>
<style scoped>
.cust-pagination {
  font-size: 14px !important;
  background: #fff;
  border-top: 1px solid #e0e0e0;
  border-radius: 0px 0px 8px 8px;
  height: 40px;
  box-shadow: 0px 1px 1px 0px #e0e0e0;
}
.cust-col{
  min-width: 80px;
  max-width: fit-content;
  margin-left: 25px;
}
.pagination-cust-text {
  color: rgba(0, 0, 0, 0.87);
  font-size: 12px;
  /* / margin: 0px 0px 0px 30px; / */
}
.cust-pagination .pagination-btns .v-pagination .v-pagination__navigation{
  background-color: transparent !important;
}
.cust-pagination .pagination-btns .v-pagination{
  align-items: center !important;
  display: inline-flex;
  list-style-type: none;
  justify-content: flex-start !important;
  margin: 0;
  max-width: 0%;
  width: 0%;
}
.v-pagination__navigation{
  box-shadow: none !important;
}
:deep(.section-categories .card-header){
    padding-right: 0px !important;
    padding-left: 0px !important;
}
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

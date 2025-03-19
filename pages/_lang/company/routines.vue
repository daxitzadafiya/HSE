<template>
  <div class="hse-page">
    <div @mouseenter="hoverRoutinePlanAccess = true" @mouseleave="hoverRoutinePlanAccess = false" style="width: fit-content">
    <v-badge v-if="!!planAccess?.lastPlanAccess?.routine" :value="hoverRoutinePlanAccess" right
          transition="slide-x-transition" class=" hover-label hse--icon-question-circle badgee">
        <span slot="badge" @click="redirectUrl">{{ $t('message.accessible_module') }}</span> 
    </v-badge>
        <v-btn v-if=" tabIndex === 0 ? checkAdmin || permissionsUser.indexOf('routine-basic') !== -1 : checkAdmin || permissionsUser.indexOf('routine-resource') !== -1" class="mt-2 btn-create btn-custom-green"
            @click="checkAddNew = true" :disabled="!!planAccess?.lastPlanAccess?.routine">
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
        <b-tab
          :title="$t('tab.routines')"
          :active="!this.$route.query.type"
          @click="routineTab"
        >
          <TitleCaption
            :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKey"
          />
          <v-container>
            <RoutinePopup
              :open-popup="checkAddNew"
              :resource="false"
              :categories-array="categoriesArray"
              :job-title-array="jobTitleArray"
              :departments-array="departmentsArray"
              :responsible-array="responsibleArrayAddNew"
              :contacts-array="contactsArray"
              :predefined-link-array="predefinedLinkArray"
              :recurringArray="recurringArray"
              @changeTab="changeTab"
              @closePopup="checkAddNew = !checkAddNew"
              @reloadList="reloadList"
              @resourceList="resourceTab"
              @reloadListCategory="reloadListCategory"              
            />
            <RoutineTable
              :resource="false"
              :list-array-input="listArray"
              :job-title-array="jobTitleArray"
              :job-title-selection="jobTitleSelection"
              :departments-array="departmentsArray"
              :departments-selection="departmentsSelection"
              :categories-array="categoriesArray"
              :categories-selection="categoriesSelection"
              :responsible-array="responsibleArray"
              :contacts-array="contactsArray"
              :predefined-link-array="predefinedLinkArray"
              :recurringArray="recurringArray"
              :object-id="paramId"
              :addedByResource="addedByResource"
              @changeTab="changeTab"
              @reloadList="reloadList"
              @resourceList="resourceTab"
              @reloadListCategory="reloadListCategory"
              @categorySelection="categorySelection"
              @dateSelection="dateSelection"
              @textFilter="textFilter"
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
        <b-tab
          v-if="!checkUser && !checkManager"
          :title="$t('tab.resources')"
          :active="this.$route.query.type === 'resource'"
          name="detail-tab"
          @click="resourceTab"
        >
          <TitleCaption
            :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyResource"
          />
          <v-container>
            <RoutinePopup
              :open-popup="checkAddNew"
              :resource="true"
              :categories-array="categoriesArray"
              :job-title-array="jobTitleArray"
              :departments-array="departmentsArray"
              :responsible-array="responsibleArray"
              :contacts-array="contactsArray"
              :predefined-link-array="predefinedLinkArray"
              :recurringArray="recurringArray"
              @closePopup="checkAddNew = !checkAddNew"
              @resourceList="resourceTab"
              @reloadListCategory="reloadListCategory"
              @changeTab="changeTab"
            />
            <RoutineTable
              :resource="true"
              :list-array-input="templates"
              :job-title-array="jobTitleArray"
              :job-title-selection="jobTitleSelection"
              :departments-array="departmentsArray"
              :departments-selection="departmentsSelection"
              :categories-array="categoriesArray"
              :categories-selection="categoriesSelection"
              :responsible-array="responsibleArray"
              :contacts-array="contactsArray"
              :predefined-link-array="predefinedLinkArray"
              :recurringArray="recurringArray"
              :object-id="paramId"
              :addedByResource="addedByResource"
              :search_value="search_resource"
              @resourceList="resourceTab"
              @reloadListCategory="reloadListCategory"
              @changeTab="changeTab"
              @categoryResourceSelection="categoryResourceSelection"
              @dateSelection="dateSelection"
               @textFilterResource="textFilterResource"
               @userSelection="userSelection"
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
    </b-tabs>
  </div>
</template>
<script>
import { _ } from 'vue-underscore'
// import moment from 'moment';
import cookies from 'js-cookie'
import TitleCaption from '../../../components/TitleCaption'
import RoutineTable from '../../../components/RoutineTable'
import RoutinePopup from '../../../components/RoutinePopup'
import debounce from 'lodash/debounce';

export default {
  components: {
    TitleCaption,
    RoutineTable,
    RoutinePopup,
  },

  data: () => ({
    hoverRoutinePlanAccess: false,
    pageKey: 'company-routines-routines',
    pageKeyResource: 'company-routines-resources',
    userRoleId: parseInt(cookies.get('roleID')),
    userDepartmentID: parseInt(cookies.get('userDepartmentID')),
    checkAdmin: cookies.get('checkAdmin'),
    roleUser: cookies.get('roleUser'),
    permissionsUser: localStorage.getItem('permissionsKey'),
    planAccess: JSON.parse(localStorage.getItem('planAccess')),
    checkAddNew: false,
    nowDate: new Date().toISOString().substr(0, 10),
    listArray: [],
    dataDefault: {
      id: 0,
      first_name: 'All',
      last_name: '',
    },
    addedByResource: [ 
        {
          value: 0,
          name: "All"
        }, 
        {
          value: 1,
          name: "System"
        }, 
        {
          value: 2,
          name: "Company Admin"
        }
      ],
    recurringArray: [
      {
        id: 'Daily',
        name: 'Daily',
      },
      {
        id: 'Weekly',
        name: 'Weekly',
      },
      {
        id: 'Monthly',
        name: 'Monthly',
      },
      {
        id: 'Quarter',
        name: 'Quarter',
      },
      {
        id: 'Yearly',
        name: 'Yearly',
      },
    ],
    departmentsArray: [],
    categoriesArray: [],
    categoriesSelection: [],
    categoriesDefault: {
      id: 0,
      name: 'All',
    },
    templates: [],
    departmentsSelection: [],
    departmentDefault: {
      id: 0,
      name: 'All',
    },
    connectDepartment: false,
    connectRole: false,
    tabIndex: 0,
    formDirty: false,
    jobTitleArray: [],
    jobTitleSelection: [],
    jobTitleDefault: {
      id: 0,
      name: 'All',
    },
    // attendingEmployees: [],
    // attendingEmployeesAddNew: [],
    responsibleArray: [],
    responsibleArrayAddNew: [],
    contactsArray: [],
    // badge
    hoverResource: false,
    predefinedLinkArray: [],
    paramId: '',
    checkManager: false,
    checkUser: false,
    pagination: {},
    current_page: 1,
    start_date:'',
    end_date:'',
    search: '',
    search_resource: '',
    categoryResourceValue:'',
    categoryValue:'',
    jobValue: '',
    depValue: ''
  }),

    computed: {},

  watch: {
    dialog(val) {
      val || this.close()
    },
  },

  created() {
    if (this.$route.query.id) {
      this.paramId = this.$route.query.id
    }
    if (this.roleUser == 'manager') this.checkManager = true

    if (this.roleUser == 'user') this.checkUser = true
  },

  mounted() {
    let that = this
    let page = this.current_page
    that.$nextTick(() => {
      that.$nuxt.$loading.start()

      // list categories
      that.$store
        .dispatch('categoriesV2/index', { type: 'routine' })
        .then((result) => {
          that.categoriesArray = result.data
          that.categoriesSelection = _.clone(result.data)
          that.categoriesSelection.push(that.categoriesDefault)
          that.categoriesSelection.sort(function (a, b) {
            return a.id - b.id
          })
        })
        .catch((error) => {
          if (error.response.status == 401) {
            this.$router.push('/login')
            this.$toaster.error(this.$i18n.t('message.token_expired'))
          }
          // that.$toaster.error(that.$i18n.t('message.fail_category_view'));
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish()
        })

      //list suggestions
      that.$store
        .dispatch('statements/index', { param: 'suggestion' })
        .then((result) => {
          if (result.data) {
            _.each(result.data, function (item) {
              _.each(item.data, function (object) {
                let linkItem = {
                  text: '',
                  href: '',
                  target: '_blank',
                }

                if (item.type === 'Routine') {
                  if (object.recurring === 'indefinite') {
                    linkItem.text =
                      '[' +
                      item.type +
                      '] ' +
                      object.name +
                      ', ' +
                      object.recurring +
                      ', ' +
                      object.first_name +
                      ' ' +
                      object.last_name
                  } else {
                    linkItem.text =
                      '[' +
                      item.type +
                      '] ' +
                      object.name +
                      ', ' +
                      object.deadline +
                      ' - ' +
                      object.recurring +
                      ', ' +
                      object.first_name +
                      ' ' +
                      object.last_name
                  }
                } else {
                  linkItem.text = '[' + item.type + '] ' + object.name
                }
                // linkItem.href = object.url + '?id=' + object.id;
                linkItem.href =
                  '/' + that.$i18n.locale + object.url + '?id=' + object.id

                that.predefinedLinkArray.push(linkItem)

                that.predefinedLinkArray = _.sortBy(
                  that.predefinedLinkArray,
                  function (item) {
                    return item.text
                  }
                )
              })
            })
            that.$nuxt.$loading.finish()
          } else {
            that.$nuxt.$loading.finish()
          }
          that.$nuxt.$loading.finish()
        })
        .catch((error) => {
          if (error.response.status == 401) {
            this.$router.push('/login')
            this.$toaster.error(this.$i18n.t('message.token_expired'))
          }
          // that.$toaster.error(that.$i18n.t('message.fail_statement_view'));
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish()
        })

      // list employees
      that.$store
        .dispatch('employees/index')
        .then((result) => {
          _.each(result.data, function (i) {
            if (
              (i.job_title_name === 'Safety Manager' ||
                i.job_title_name === 'HSE Manager') &&
              i.job_title_added_by === 1
            ) {
              i.name =
                i.name + ' - ' + i.department_name + ' - ' + i.job_title_name
            } else if (i.department_name) {
              i.name = i.name + ' - ' + i.department_name
            }
          })
          // that.attendingEmployees = result.data;
          // that.attendingEmployeesAddNew = _.clone(result.data);
          // that.attendingEmployeesAddNew = _.filter(that.attendingEmployeesAddNew, function (item) {
          //   return item.disable_status === 0;
          // });

          that.responsibleArray = _.clone(result.data)
          that.responsibleArray = _.filter(result.data, function (item) {
            return item.role_id === 2 || item.role_id === 3
          })
          that.responsibleArrayAddNew = _.clone(that.responsibleArray)
          that.responsibleArrayAddNew = _.filter(
            that.responsibleArrayAddNew,
            function (item) {
              return item.disable_status === 0
            }
          )
        })
        .catch((error) => {
          if (error.response.status == 401) {
            this.$router.push('/login')
            this.$toaster.error(this.$i18n.t('message.token_expired'))
          }
          // that.$toaster.error(that.$i18n.t('message.fail_employee_view'));
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish()
        })

      // list contacts
      that.$store
        .dispatch('contacts/index')
        .then((result) => {
          that.contactsArray = result.data
        })
        .catch((error) => {
          if (error.response.status == 401) {
            this.$router.push('/login')
            this.$toaster.error(this.$i18n.t('message.token_expired'))
          }
          // that.$toaster.error(that.$i18n.t('message.fail_contact_view'));
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish()
        })

      // list departments
      that.$store
        .dispatch('departments/index')
        .then((result) => {
          that.departmentsArray = result.data
          that.departmentsSelection = _.clone(result.data)
          that.departmentsSelection.push(that.departmentDefault)
          that.departmentsSelection.sort(function (a, b) {
            return a.id - b.id
          })
        })
        .catch((error) => {
          if (error.response.status == 401) {
            this.$router.push('/login')
            this.$toaster.error(this.$i18n.t('message.token_expired'))
          }
          // that.$toaster.error(that.$i18n.t('message.fail_department_view'));
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish()
        })


      // list job titles
      that.$store
        .dispatch('jobTitles/index')
        .then((result) => {
          that.jobTitleArray = result.data
          that.jobTitleSelection = _.clone(result.data)
          that.jobTitleSelection.push(that.jobTitleDefault)
          that.jobTitleSelection.sort(function (a, b) {
            return a.id - b.id
          })
        })
        .catch((error) => {
          if (error.response.status == 401) {
            this.$router.push('/login')
            this.$toaster.error(this.$i18n.t('message.token_expired'))
          }
          // that.$toaster.error(that.$i18n.t('message.fail_job_title_view'));
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish()
        })

      if (that.resource) {
        let that = this
        // get list
         that.$store
        .dispatch('routines/index',{page})
          .then((result) => {
            that.listArray = _.filter(result.data, function (item) {
              return item.is_template
            })
            that.templates = _.filter(result.data, function (item) {
              return item.is_template
            })
            that.pagination = result
            delete that.pagination.data
            that.$nuxt.$loading.finish()
          })
          .catch((error) => {
            if (error.response.status == 401) {
              this.$router.push('/login')
              this.$toaster.error(this.$i18n.t('message.token_expired'))
            } else {
              that.$toaster.error(that.$i18n.t('message.fail_routine_view'))
            }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish()
          })
      }
      if (!that.resource) {
        that.$store
          .dispatch('objects/index', { objectTypeArray: ['routine'] , page })
          .then((result) => {
            that.listArray = _.filter(result.data, function (item) {
              return !item.is_template
            })
            that.templates = _.filter(result.data, function (item) {
              return !item.is_template
            })
            // that.templates = _.each(that.templates, function (item) {
            //   item.deadline = null
            // })
            // that.listArray = result.data
            that.pagination = result
            delete that.pagination.data
            that.$nuxt.$loading.finish()
          })
          .catch((error) => {
            if (error.response.status == 401) {
              this.$router.push('/login')
              this.$toaster.error(this.$i18n.t('message.token_expired'))
            } else {
              that.$toaster.error(that.$i18n.t('message.fail_routine_view'))
            }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish()
          })
      }
    })
  },

  methods: {
    redirectUrl(){
      if (this.roleUser == 'company admin') {
              this.$router.push('/settings/billings/');
          }
    },

    changeTab(value) {
      this.tabIndex = value
      this.reloadList()
    },
    changePage(page) {
      this.fetchData(page)
    },
     changePageResource(page) {
      this.fetchDataResource(page)
    },
    categorySelection(catValue){
      this.categoryValue = catValue
      this.fetchData(1)
    },

    departmentSelection(depValue){
      this.depValue = depValue
      this.fetchData(1)
    },

    jobSelection(jobValue){
      this.jobValue = jobValue
      this.fetchData(1)
    },

    categoryResourceSelection(catValue){
      this.categoryResourceValue = catValue
      this.fetchDataResource(1)
    },
    userSelection(userValue){
        this.user_id = userValue
        this.fetchDataResource(1)
      },
    
     dateSelection(dateValue){
      console.log(dateValue);
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
       textFilter(text){
        console.log("-text-",text);
        this.search = text
          this.fetchData(1)
      },
      textFilterResource(text){
        this.search_resource = text
          this.fetchDataResource(1)
      },
    fetchData: debounce(function(page) {
      let that = this

      this.current_page = page
      let payload = {};
      payload.page = page;
      if (that.categoryValue) {
        payload.category = that.categoryValue;
      }
      if(that.jobValue){
        payload.job_title = that.jobValue;
      }
      if(that.depValue){
        payload.department = that.depValue;
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

      that.$store
        .dispatch('objects/index', { objectTypeArray: ['routine'], ...payload})
        .then((result) => {
          that.listArray = _.filter(result.data, function (item) {
            return !item.is_template
          })
          that.templates = _.filter(result.data, function (item) {
            return !item.is_template
          })
          // that.templates = _.each(that.templates, function (item) {
          //   item.deadline = null
          // })
          that.listArray = result.data
          that.pagination = result
          delete that.pagination.data
          that.$nuxt.$loading.finish()
        })
        .catch((error) => {
          if (error.response.status == 401) {
            this.$router.push('/login')
            this.$toaster.error(this.$i18n.t('message.token_expired'))
          } else {
            console.log('error', error)
            that.$toaster.error(that.$i18n.t('message.fail_routine_view'))
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish()
        })
    },300),
    fetchDataResource: debounce(function(page) {
      let that = this
      this.current_page = page
      let payload = {};
      payload.page = page;
      if (that.categoryResourceValue) {
        payload.category = that.categoryResourceValue;
      }
      if (that.user_id) {
        payload.reported_by = that.user_id;
      }
      if (that.search_resource) {
        payload.by_name = that.search_resource;
      }
      that.$store
        .dispatch('routines/index',payload)
        .then((result) => {
          that.listArray = _.filter(result.data, function (item) {
             return item.is_template;
           });
          that.templates = _.filter(result.data, function (item) {
            return item.is_template
          })
          // that.listArray=result.data
          that.pagination = result
          delete that.pagination.data
          that.$nuxt.$loading.finish()
        })
        .catch((error) => {
          if (error.response.status == 401) {
            this.$router.push('/login')
            this.$toaster.error(this.$i18n.t('message.token_expired'))
          } else {
            that.$toaster.error(that.$i18n.t('message.fail_routine_view'))
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish()
        })
    },300),
    resourceTab() {
      let that = this
      let page = this.current_page
      that.search = ""
      // get list
      that.$store
        .dispatch('routines/index',{
           page
        })
        .then((result) => {
          that.listArray = _.filter(result.data, function (item) {
             return item.is_template;
           });
          that.templates = _.filter(result.data, function (item) {
            return item.is_template
          })
          // that.listArray=result.data
          that.pagination = result
          delete that.pagination.data
          that.$nuxt.$loading.finish()
        })
        .catch((error) => {
          if (error.response.status == 401) {
            this.$router.push('/login')
            this.$toaster.error(this.$i18n.t('message.token_expired'))
          } else {
            that.$toaster.error(that.$i18n.t('message.fail_routine_view'))
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish()
        })
    },
    routineTab() {
      let that = this
      let page = this.current_page
      that.search_resource = ""
      that.$store
        .dispatch('objects/index', {  objectTypeArray: ['routine']  ,page })
        .then((result) => {
          that.listArray = _.filter(result.data, function (item) {
            return !item.is_template
          })
          that.templates = _.filter(result.data, function (item) {
            return !item.is_template
          })
          // that.listArray = result.data
          that.pagination = result
          delete that.pagination.data
          that.$nuxt.$loading.finish()
        })
        .catch((error) => {
          if (error.response.status == 401) {
            this.$router.push('/login')
            this.$toaster.error(this.$i18n.t('message.token_expired'))
          } else {
            that.$toaster.error(that.$i18n.t('message.fail_routine_view'))
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish()
        })
    },

    reloadList() {
      let that = this
      // get list
      let page = this.current_page
      that.$nuxt.$loading.start()
      that.$store
        .dispatch('objects/index', { objectTypeArray: ['routine']  , page })
        .then((result) => {
          that.listArray = _.filter(result.data, function (item) {
            return !item.is_template
          })
          that.templates = _.filter(result.data, function (item) {
            return !item.is_template
          })
          // that.$nuxt.$loading.finish();
        })
        .catch((error) => {
          if (error.response.status == 401) {
            this.$router.push('/login')
            this.$toaster.error(this.$i18n.t('message.token_expired'))
          } else {
            that.$toaster.error(that.$i18n.t('message.fail_routine_view'))
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish()
        })
         that.$nuxt.$loading.finish();
    },

    reloadListCategory() {
      let that = this
      that.$store
        .dispatch('categoriesV2/index', { type: 'routine' })
        .then((result) => {
          that.categoriesArray = _.filter(result.data, function (item) {
            return !item.disable_status
          })
          that.categoriesSelection = _.clone(that.categoriesArray)
          that.categoriesSelection.push(that.categoriesDefault)
          that.categoriesSelection.sort(function (a, b) {
            return a.id - b.id
          })
          that.$nuxt.$loading.finish()
        })
        .catch((error) => {
          if (error.response.status == 401) {
            this.$router.push('/login')
            this.$toaster.error(this.$i18n.t('message.token_expired'))
          } else {
            that.$toaster.error(that.$i18n.t('message.fail_category_view'))
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish()
        })
    },
  },
}
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
.cust-col {
   min-width: 80px;
  max-width: fit-content;
  margin-left: 25px;
}
.pagination-cust-text {
  color: rgba(0, 0, 0, 0.87);
  font-size: 12px;
  /* / margin: 0px 0px 0px 30px; / */
}
.cust-pagination .pagination-btns .v-pagination .v-pagination__navigation {
  background-color: transparent !important;
}
.cust-pagination .pagination-btns .v-pagination {
  align-items: center !important;
  display: inline-flex;
  list-style-type: none;
  justify-content: flex-start !important;
  margin: 0;
  max-width: 0%;
  width: 0%;
}
.v-pagination__navigation {
  box-shadow: none !important;
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

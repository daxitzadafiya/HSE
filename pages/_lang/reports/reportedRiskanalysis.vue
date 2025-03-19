<template>
  <div class="deviation-page">
    <div @mouseenter="hoverRiskPlanAccess = true" @mouseleave="hoverRiskPlanAccess = false" style="width: fit-content">
    <v-badge v-if="!!planAccess?.lastPlanAccess?.risk" :value="hoverRiskPlanAccess" right
            transition="slide-x-transition" class=" hover-label hse--icon-question-circle badgee">
          <span slot="badge" @click="redirectUrl">{{ $t('message.accessible_module') }}</span> 
      </v-badge>
          <v-btn v-if="(checkAdmin || permissionsUser.indexOf('risk analysis-basic') !== -1) && !checkWorker" class="mt-2 btn-create btn-custom-green"
            @click="checkAddNew = true" :disabled="!!planAccess?.lastPlanAccess?.risk || !planAccess?.planAccess?.risk">
            {{ $t('button.add_new') }}
        </v-btn>
      </div>

    <b-tabs v-model="tabIndex" card lazy>
      <keep-alive>
        <b-tab :title="$t('tab.report_risk_analysis')" active>
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKey" />
          <v-container>
            <AddNewPopup
              :open-popup="checkAddNew"
              :form-title="$t('title.new_risk_analysis')"
              :object-field="objectField"
              :object-item="newItem"
              :categories-array="categoriesArray"
              :categories-type="'risk-analysis'"
              :predefined-link-array="predefinedLinkArray"
              @closePopup="checkAddNew = !checkAddNew"
              @savePopup="save"
            />

<!--            <RiskAnalysisPopup-->
<!--              :open-popup="checkAddNew"-->
<!--              :job-title-array="jobTitleArray"-->
<!--              :departments-array="departmentsArray"-->
<!--              :task-assignees-array="taskAssigneesArray"-->
<!--              :responsible-array="responsibleArray"-->
<!--              @closePopup="checkAddNew = !checkAddNew"-->
<!--              @reloadList="reloadList"-->
<!--            />-->

            <RiskAnalysisTable
              :list-array-input="listArray"
              :categories-array="categoriesArray"
              :users-selection="usersSelection"
              :predefined-link-array="predefinedLinkArray"
              :object-id="paramId"
              :statusSelect="statusSelect"
              @reloadList="reloadList"
              @reloadListCategory="reloadListCategory"
              @statusSelection="statusSelection"
              @dateSelection="dateSelection"
              @textFilter="textFilter"
            />
              <!-- :search_value="search" -->
            <v-col
              class="d-flex justify-content-start align-items-center cust-pagination"
            >
              <div class="cust-col">
                <span class="pagination-cust-text"
                  >{{ pagination?.from || '0'}} - {{ pagination?.to || '0' }} of
                  {{ pagination?.total || '0' }}</span
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
    </b-tabs>
  </div>
</template>
<script>
  import {_} from 'vue-underscore';
  import cookies from 'js-cookie';
  import TitleCaption from "../../../components/TitleCaption";
  import RiskAnalysisTable from "../../../components/RiskAnalysisTable";
  import AddNewPopup from "../../../components/AddNewPopup";
  // import RiskAnalysisPopup from "../../../components/RiskAnalysisPopup";
// import moment from 'moment';
  import debounce from 'lodash/debounce';
import { removeTagsFromString } from "../../../components/common/js/functions"

  export default {
    components: {
      TitleCaption,
      RiskAnalysisTable,
      AddNewPopup,
      // RiskAnalysisPopup,
    },

    data: () => ({
      userRoleId: parseInt(cookies.get('roleID')),
      // userDepartmentID: parseInt(cookies.get('userDepartmentID')),
      checkAdmin: cookies.get('checkAdmin'),
      roleUser: cookies.get('roleUser'),
      pageKey: 'reports-report-riskanalysis-report-riskanalysis',
      permissionsUser: localStorage.getItem('permissionsKey'),
      planAccess: JSON.parse(localStorage.getItem('planAccess')),
      checkAddNew: false,
      hoverRiskPlanAccess: false,
      // usersArray: [],
      listArray: [],
      categoriesSelection:[],
      categoriesArray:[],
      tabIndex: 0,
      usersSelection: [],
      predefinedLinkArray: [],
      dataDefault: {
        id: 0,
        first_name: "All",
        last_name: "",
      },
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
      // processing: {
      //   new: 0,
      //   ongoing: 0,
      //   closed: 0,
      // },
      // riskElementAnalysis: [],
      // checkNewRiskElement: false,
      // checkAddPlan: false,
      checkPermission: '',
      paramId: '',
      search:'',
      // add new popup - list object fields
      objectField: [
        'name',
        'risk-analysis',
        'description',
        'category',
        'security',
        'responsible-risk-analysis',
        'risk-element-filter',
        'source-of-danger',
        'no-index',
      ],
      newItem: {
        is_template: false,
        name: "",
        type: 'risk-analysis',
        description: "",
        category_id: '',
        is_suggestion: false,
        is_valid: true,
        status: 'new',
        required_comment: false,
        required_attachment: false,
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
        // table Security
        object_type: 'risk-analysis',
        is_shared: false,
        is_public: false,
        department_array: [],
        employee_array: [],
        // risk element
        risk_element_array: [],
        // source of danger
        source_of_danger: [],
        // switch Process
        isProcess: false,
        // connect to object
        connectToArray: [],
        start_date: '',
        start_time_pre: '',
        end_time_pre: '',
        start_time: '',
        end_time: '',
        start_date_pre: '',
        deadline: '',
        deadline_pre: '',
      },
      defaultItem: {
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
        type: 'risk-analysis',
        description: "",
        category_id: '',
        is_suggestion: false,
        is_valid: true,
        status: 'new',
        required_comment: false,
        required_attachment: false,
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
        // table Security
        object_type: 'risk-analysis',
        is_shared: false,
        is_public: false,
        department_array: [],
        employee_array: [],
        // risk element
        risk_element_array: [],
        // source of danger
        source_of_danger: [],
        // switch Process
        isProcess: false,
        // connect to object
        connectToArray: [],
      },
      pagination: {},
    current_page: 1,
    checkStatus:'',
    checkWorker:false
    }),

    computed: {},

    watch: {
      dialog(val) {
        val || this.close();
      },
    },

    created() {
      if (this.$route.query.id) {
        this.paramId = this.$route.query.id;
      }
      if (this.roleUser == 'user') {
         this.checkWorker = true
       }
    },

    mounted() {
      let that = this;
      let page = this.current_page
      that.$nextTick(() => {
        that.$nuxt.$loading.start();

        // list categories
        that.$store.dispatch('categoriesV2/index', {type: 'risk-analysis'}).then(result => {
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
          }else{
        that.$nuxt.$loading.finish();
        }
      });

        // list Risk element source
        that.$store.dispatch('objects/index', { page, objectType: 'risk-analysis'}).then(result => {
          that.listArray = _.filter(result.data, function (item) {
            return !item.is_template;
          });
          that.pagination = result
            delete that.pagination.data
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_risk_analysis_view'));
          }
          that.$nuxt.$loading.finish();
        });

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
        that.$nuxt.$loading.finish();
        }
      });

      //Get employee list
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
          }else{
        that.$nuxt.$loading.finish();
        }
      });
    });

    // if (that.$route.query.risk) {
    //   that.checkAddNew = true;
    // }
  },

    methods: {
      redirectUrl(){
        if (this.roleUser == 'company admin') {
              this.$router.push('/settings/billings/');
          }
     },

      close() {
        this.checkAddNew = false;
        this.reset();
      },
      changePage(page) {
      if (this.checkStatus || this.start_date || this.end_date || this.search) {
          this.fetchData(page , true)
        }else{
          this.fetchData(page , false)
        }
    },
     statusSelection(statusValue){
        this.checkStatus = statusValue
        if (statusValue == 0 && !this.start_date && !this.end_date && !this.search) {
          this.fetchData(1 , false)
        }else{
          this.fetchData(1 , true)
        }
      },
    
    dateSelection(dateValue){
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

         if (this.start_date == '' && this.end_date == '' && !this.checkStatus && !this.search) {
          this.fetchData(1 , false)
        }else{
          this.fetchData(1 , true)
        }
      },
      textFilter(text){
        this.search = text
        if (text == "" && !this.start_date && !this.end_date && !this.checkStatus) {
          this.fetchData(1 , false)
        }else{
          this.fetchData(1 , true)
        }
      },

      reloadList() {
        let that = this;
        // get list
        let page = this.current_page
        let payload = {};
      payload.page = page;
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
         that.$store.dispatch('objects/index', { objectType: 'risk-analysis' ,...payload }).then(result => {
          that.listArray = _.filter(result.data, function (item) {
            return !item.is_template;
          });
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_risk_analysis_view'));
          }
          that.$nuxt.$loading.finish();
        });
      },

      reloadListCategory() {
        let that = this;
        that.$store.dispatch('categoriesV2/index', {type: 'risk-analysis'}).then(result => {
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

      reset() {
        this.$nuxt.$loading.finish();
        this.newItem = Object.assign({}, this.defaultItem);
      },

     fetchData: debounce(function(page , value) {
      let that = this

       this.current_page = page
      let payload = {};
      payload.page = page;
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
        that.$nuxt.$loading.start();

        value && that.$store.dispatch('riskAnalysis/filter', payload).then(result => {
          that.listArray = _.filter(result.data, function (item) {
            return !item.is_template;
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
          that.$toaster.error(that.$i18n.t('message.fail_risk_analysis_view'));
          }
          that.$nuxt.$loading.finish();
        });


      !value && that.$store.dispatch('objects/index', { objectType: 'risk-analysis' ,...payload }).then(result => {
          that.listArray = _.filter(result.data, function (item) {
            return !item.is_template;
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
          that.$toaster.error(that.$i18n.t('message.fail_risk_analysis_view'));
          }
          that.$nuxt.$loading.finish();
        });
    },300),

      async save(value) {
        let that = this;
        that.$nuxt.$loading.start();
        that.newItem = value.item;
        that.textTrime = that?.newItem?.name
        that.newItem.name = this.textTrime?.trim()
        that.newItem.source = "risk-analysis"
        that.newItem.status = 'completed';
         that.newItem.start_date = that.newItem.start_date_pre;
      that.newItem.deadline = that.newItem.deadline_pre;
      that.newItem.start_time = that.newItem.start_time_pre
      that.newItem.end_time = that.newItem.end_time_pre

      that.newItem.description= await removeTagsFromString(that?.newItem?.description);

      // this.newItem.deadline = await dateTimeValue


        // that.newItem.start_date = await formatDateString(that?.newItem?.start_date_pre);
        // that.newItem.deadline = await formatDateString(that?.newItem?.deadline_pre);
        // that.newItem.start_time =await formatTimeString(that?.newItem?.start_time_pre);
        // that.newItem.end_time =await formatTimeString(that?.newItem?.end_time_pre);

       that.$store.dispatch('objects/store', that.newItem).then(function () {
          that.reloadList();
          that.reloadListCategory();
          that.$toaster.success(that.$i18n.t('message.success_risk_analysis_add_new'));
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_risk_analysis_add_new'));
          }
          that.$nuxt.$loading.finish();
        });
        that.close();
      },
    },
  };
</script>
<style scoped>
:deep(.v-pagination){
  width: auto !important;
}
:deep(.theme--light.v-pagination .v-pagination__navigation){
  background-color: transparent !important;
  box-shadow: none !important;
}
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
}
.v-btn--disabled {
    pointer-events: auto;
}
</style>

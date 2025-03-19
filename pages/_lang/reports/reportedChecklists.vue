<template>
  <div class="hse-page">
    <b-tabs card name="report" lazy>
      <keep-alive>
        <b-tab :title="$t('tab.report_checklists')" active name="result-tab" class="result-tab">
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKey" />
          <v-container>
            <ReportChecklistTable
              :list-array-input="listArray"
              :processing="processing"
              :job-title-array="jobTitleArray"
              :job-title-selection="jobTitleSelection"
              :departments-array="departmentsArray"
              :departments-selection="departmentsSelection"
              :users-selection="usersSelection"
              :categories-array="categoriesArray"
              :taskCategoriesArray="taskCategoriesArray"
              :task-assignees-array="taskAssigneesArray"
              :responsible-array="responsibleArray"
              :predefined-link-array="predefinedLinkArray"
              :object-id="paramId"
              :statusSelect="statusSelect"
              @reloadList="reloadList"
              @reloadListCategory="reloadListCategory"
              @statusSelection="statusSelection"
              @dateSelection="dateSelection"
              @userSelection="userSelection"
              @textFilter="textFilter"
              @jobSelection="jobSelection"
              @depSelection="depSelection"
            />
              <!-- :search_value="search" -->
            <v-col class="d-flex justify-content-start align-items-center cust-pagination">
              <div class="cust-col">

                <span class="pagination-cust-text"
                  >{{ pagination.from || '0' }} - {{ pagination.to || '0'}} of
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
    </b-tabs>

<!--    &lt;!&ndash; dialog Attachments &ndash;&gt;-->
<!--    <v-dialog v-model="dialogPicture" max-width="600px">-->
<!--      <v-card class="dialog-logo">-->
<!--        <v-card-text>-->
<!--          <div class="text-center title-model">-->
<!--            <h4>View picture</h4>-->
<!--          </div>-->
<!--          <div class="logo-modal-content text-center hse-report-checklist-dialog-preview-image">-->
<!--            <img v-bind:src="previewUrl" alt="picture">-->
<!--          </div>-->
<!--        </v-card-text>-->
<!--        <v-card-actions>-->
<!--          <v-spacer />-->
<!--          <v-btn class="btn-cancel" text @click="closeViewPicture()">-->
<!--            Close-->
<!--          </v-btn>-->
<!--        </v-card-actions>-->
<!--      </v-card>-->
<!--    </v-dialog>-->
  </div>
</template>
<script>
  import {_} from 'vue-underscore';
  // import moment from 'moment';
  import cookies from 'js-cookie';
  import TitleCaption from "../../../components/TitleCaption";
  import axios from "axios";
  import ReportChecklistTable from "../../../components/ReportChecklistTable";
  import debounce from 'lodash/debounce';

  export default {
    components: {
      TitleCaption,
      ReportChecklistTable,
    },

    data: () => ({
      userRoleId: parseInt(cookies.get('roleID')),
      userDepartmentId: parseInt(cookies.get('userDepartmentId')),
      checkAdmin: cookies.get('checkAdmin'),
      roleUser: cookies.get('roleUser'),
      pageKey: 'reports-report-checklists-report-checklists',
      permissionsUser: localStorage.getItem('permissionsKey'),
      nowDate: new Date().toISOString().substr(0, 10),
      statusSelect: [ {
        value: 0,
        name: "All"
      }, {
        value: 1,
        name: "New"
      }, {
        value: 2,
        name: "Ongoing"
      }, {
        value: 3,
        name: "Closed"
      }],
      listArray: [],
      topicArray: [],
      dataDefault: {
        id: 0,
        first_name: "All",
        last_name: "",
      },
      usersSelection: [],
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
      processing: {
        new: 0,
        total: 0,
        ongoing: 0,
        closed: 0
      },
      categoriesArray: [],
      categoriesSelection: [],
      taskCategoriesArray:[],
      categoriesDefault: {
        id: 0,
        name: "All"
      },
      category_checklist: 'checklist',
      checkPermission: '',
      checkViewActionDetail: false,
      taskArray: [],

      // Dialog view picture
      dialogPicture: false,
      previewUrl: null,

      taskAssigneesArray: [],
      responsibleArray: [],
      predefinedLinkArray: [],
      paramId: '',
      current_page: 1,
      pagination: {},
      reportStatus:'',
      start_date:'',
      end_date:'',
      user_id:'',
      search: '',
      job_id: '',
      dep_id: ''
    }),

    computed: {},

    watch: {},

    created() {
      if (this.$route.query.id) {
        this.paramId = this.$route.query.id;
      }
    },

    mounted() {
      let that = this;
       let page = this.current_page
      that.$nextTick(() => {
        that.$nuxt.$loading.start();

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

        // list employee
        that.$store.dispatch('employees/index').then(result => {
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
          that.responsibleArray = _.clone(result.data);
          that.responsibleArray = _.filter(that.responsibleArray, function (item) {
            return item.role_id === 2 || item.role_id === 3;
          });
        }).catch(() => {
          // that.$toaster.error(that.$i18n.t('message.fail_employee_view'));
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });

        //  that.$store.dispatch('categories/index', {type: 'task'}).then(result => {
        //   that.taskCategoriesArray = result.data;
         
        // }).catch(() => {
        //   // that.$toaster.error(that.$i18n.t('message.fail_category_view'));
        //   // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        //   that.$nuxt.$loading.finish();
        // });

        // reports list
        if (that.checkAdmin || that.permissionsUser.indexOf('report checklist-basic') !== -1) {
          that.checkPermission = 'allow';
        }
        that.$store.dispatch('reports/index', {page,checkPermission: that.checkPermission}).then(result => {
          that.listArray = result.data;
          // that.processing = {
          //   total: result.total || 0,
          //   new: result.total_new || 0,
          //   ongoing: result.total_ongoing || 0,
          //   closed: result.total_closed || 0,
          // };
          that.pagination = result
            delete that.pagination.data
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_checklist_report_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });

        that.$store.dispatch('reports/filter',{page,checkPermission: that.checkPermission}).then(result => {
           that.processing = {
            total: result.total || 0,
            new: result.total_new || 0,
            ongoing: result.total_ongoing || 0,
            closed: result.total_closed || 0,
          };
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_deviation_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });

        //Get risk element list
        // that.$store.dispatch('riskElementSource/index').then(result => {
        //   that.riskElementSourceArray = result.data;
        // }).catch((error) => {
        //     if (error.response.status == 401) {
        //     this.$router.push('/login');
        //     this.$toaster.error(this.$i18n.t('message.token_expired'));
        //   }else{
        //   that.$toaster.error(that.$i18n.t('message.fail_risk_element_view'));
        //   }
        //   // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        //   that.$nuxt.$loading.finish();
        // });
      });
    },

    methods: {
      close() {
        this.reset();
      },

      statusSelection(statusValue){
        this.reportStatus = statusValue
        if (statusValue == 0 && !this.start_date && !this.end_date && !this.job_id && !this.dep_id && !this.user_id && !this.search) {
          this.fetchData(1 , false)
        }else{
          this.fetchData(1 , true)
        }
      },
      jobSelection(jobValue){
        this.job_id = jobValue
        if (jobValue == 0 && !this.start_date && !this.end_date && !this.dep_id && !this.user_id && !this.search) {
          this.fetchData(1 , false)
        }else{
          this.fetchData(1 , true)
        }
      },
      depSelection(depValue){
        this.dep_id = depValue
        if (depValue == 0 && !this.start_date && !this.end_date && !this.job_id && !this.user_id && !this.search) {
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

         if (this.start_date == '' && this.end_date == '' && !this.job_id && !this.dep_id && !this.reportStatus && !this.user_id && !this.search) {
          this.fetchData(1 , false)
        }else{
          this.fetchData(1 , true)
        }
      },
       userSelection(userValue){
        this.user_id = userValue
        if (userValue == 0 && !this.start_date && !this.end_date && !this.job_id && !this.dep_id &&  !this.reportStatus && !this.search) {
          this.fetchData(1 , false)
        }else{
          this.fetchData(1 , true)
        }
      },
      textFilter(text){
        this.search = text
        if (text == "" && !this.start_date && !this.end_date && !this.job_id && !this.dep_id && !this.reportStatus && !this.user_id) {
          this.fetchData(1 , false)
        }else{
          this.fetchData(1 , true)
        }
      },
      changePage(page) {
        if (this.reportStatus || this.start_date || this.end_date  || this.job_id || this.dep_id || this.user_id || this.search) {
          this.fetchData(page , true)
        }else{
          this.fetchData(page , false)
        }
    },

    fetchData: debounce(function(page , value) {
      let that = this
      this.current_page = page
      let payload = {};
      payload.page = page;
      if (that.reportStatus) {
        payload.status = that.reportStatus;
      }
      if (that.start_date) {
        payload.startDate = that.start_date;
      }
      if (that.end_date) {
        payload.endDate = that.end_date;
      }
      if (that.user_id) {
        payload.reported_by = that.user_id;
      }

      if (that.dep_id) {
        payload.department = that.dep_id;
      }

      if (that.job_id) {
        payload.job_title = that.job_id;
      }

      if (that.search) {
        payload.by_name = that.search;
      }
      that.$nuxt.$loading.start();
     value && that.$store.dispatch('reports/filter', {checkPermission: that.checkPermission , ...payload}).then(result => {
      that.$nuxt.$loading.start();
          that.listArray = result.data;
          // that.processing = {
          //   total: result.total || 0,
          //   new: result.total_new || 0,
          //   ongoing: result.total_ongoing || 0,
          //   closed: result.total_closed || 0,
          // };
          that.pagination = result
            delete that.pagination.data
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_deviation_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
        !value && that.$store.dispatch('reports/index', {checkPermission: that.checkPermission , ...payload}).then(result => {
      that.$nuxt.$loading.start();
          that.listArray = result.data;
          // that.processing = {
          //   total: result.total || 0,
          //   new: result.total_new || 0,
          //   ongoing: result.total_ongoing || 0,
          //   closed: result.total_closed || 0,
          // };
          that.pagination = result
            delete that.pagination.data
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_deviation_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
    },300),

      reset() {
        this.topicArray = [];
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.$refs.form.reset();
          this.$refs.form.resetValidation();
        }, 0);
      },

      reloadList () {
        let that = this;
        that.$store.dispatch('reports/index', {checkPermission: that.checkPermission}).then(result => {
          that.listArray = result.data;
          that.processing = {
            total: result.total || 0,
            new: result.total_new || 0,
            ongoing: result.total_ongoing || 0,
            closed: result.total_closed || 0,
          };
          that.pagination = result
            delete that.pagination.data
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_checklist_report_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });

        //Get risk element list
        that.$store.dispatch('riskElementSource/index').then(result => {
          that.riskElementSourceArray = result.data;
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_risk_element_view'));
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

      // show image
      getImageSrc(url) {
        let that = this;
        let result;
        axios({
          url: url,
          method: 'GET',
          responseType: 'blob', // important
        }).then((response) => {
          result = window.URL.createObjectURL(new Blob([response.data]));
          that.previewUrl = result;
          that.$nuxt.$loading.finish();
          return result;
        });
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
</style>

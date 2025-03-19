<template>
  <div class="deviation-page">
    <div @mouseenter="hoverDeviationPlanAccess = true" @mouseleave="hoverDeviationPlanAccess = false" style="width: fit-content">
    <v-badge v-if="!!planAccess?.lastPlanAccess?.deviation" :value="hoverDeviationPlanAccess" right
    transition="slide-x-transition" class=" hover-label hse--icon-question-circle badgee">
    <span slot="badge" @click="redirectUrl">{{ $t('message.accessible_module') }}</span> 
  </v-badge>
        <v-btn class="mt-2 btn-create btn-custom-green"
            @click="!tableLoad ? checkAddNew = true : checkAddNew = false" :disabled="!!planAccess?.lastPlanAccess?.deviation">
            {{ $t('button.add_new') }}
        </v-btn>
    </div>

    <b-tabs v-model="tabIndex" card lazy>
      <keep-alive>
        <b-tab :title="$t('tab.deviations')" active>
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKey" />
          <v-container>
            <DeviationPopup
              :open-popup="checkAddNew"
              :categories-array="categoriesArray"
              :job-title-array="jobTitleArray"
              :departments-array="departmentsArray"
              :task-assignees-array="taskAssigneesArrayAddNew"
              :responsible-array="responsibleArrayAddNew"
              :predefined-link-array="predefinedLinkArray"
              :placeArray="placeArray"
              :places-selection="placesSelection"
              :consequenceArray="consequenceArray"
              :consequence-selection="consequenceSelection"
              @closePopup="checkAddNew = !checkAddNew"
              @reloadList="reloadList"
              @reloadListCategory="reloadListCategory"
            />
            <DeviationTable
              :list-array-input="listArray"
              :categories-array="categoriesArray"
              :categories-selection="categoriesSelection"
              :processing="processing"
              :job-title-array="jobTitleArray"
              :job-title-selection="jobTitleSelection"
              :departments-array="departmentsArray"
              :departments-selection="departmentsSelection"
              :users-array="usersArray"
              :users-selection="usersSelection"
              :task-assignees-array="taskAssigneesArray"
              :responsible-array="responsibleArray"
              :predefined-link-array="predefinedLinkArray"
              :placeArray="placeArray"
              :consequenceArray="consequenceArray"
              :object-id="paramId"
              :statusSelect="statusSelect"
              :tableLoad="tableLoad"
              @reloadList="reloadList"
              @reloadListCategory="reloadListCategory"
              @statusSelection="statusSelection"
              @departmentSelection="departmentSelection"
              @jobSelection="jobSelection"
              @dateSelection="dateSelection"
              @userSelection="userSelection"
              @textFilter="textFilter"
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
  </div>
</template>
<script>
  import {_} from 'vue-underscore';
  import cookies from 'js-cookie';
  import TitleCaption from "../../../components/TitleCaption";
  import DeviationTable from "../../../components/DeviationTable";
  import DeviationPopup from "../../../components/DeviationPopup";
   import debounce from 'lodash/debounce';

  export default {
    components: {
      TitleCaption,
      DeviationTable,
      DeviationPopup,
    },

    data: () => ({
      hoverDeviationPlanAccess: false,
      userRoleId: parseInt(cookies.get('roleID')),
      userDepartmentID: parseInt(cookies.get('userDepartmentID')),
      checkAdmin: cookies.get('checkAdmin'),
      roleUser: cookies.get('roleUser'),
      pageKey: 'reports-deviations-deviations',
      permissionsUser: localStorage.getItem('permissionsKey'),
      planAccess: JSON.parse(localStorage.getItem('planAccess')),
      nowDate: new Date().toISOString().substr(0, 10),
      checkAddNew: false,
      search: '',
      usersArray: [],
      listArray: [],
      tabIndex: 0,
      usersSelection: [],
      dataDefault: {
        id: 0,
        first_name: "All",
        last_name: "",
      },
      consequenceArray: [],
      consequenceSelection:[],
      departmentsArray: [],
      jobTitleArray: [],
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
      processing: {
        new: 0,
        total: 0,
        processing: 0,
        // finished: 0,
        closed: 0,
      },
      taskAssigneesArray: [],
      taskAssigneesArrayAddNew: [],
      responsibleArray: [],
      responsibleArrayAddNew: [],
      predefinedLinkArray: [],
      paramId: '',

      // category
      categoriesArray: [],
      categoriesSelection: [],
      categoriesDefault: {
        id: 0,
        name: "All"
      },

      placeArray: [],
      placesSelection: [],
      pagination: {},
    current_page: 1,
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
      }
      ],
      devStatus:'',
      start_date:'',
      end_date:'',
      user_id:'',
      job_id: '',
      dep_id: '',
      tableLoad:true
    }),

    computed: {},

    watch: {
      dialog(val) {
        val || this.close();
      },

    created() {
      if (this.$route.query.id) {
        this.paramId = this.$route.query.id;
      }
    },
    },

    mounted() {
      let that = this;
       let page = this.current_page
      //  let status = that.devStatus
      // let startDate = that.start_date
      // let endDate = that.end_date
      // let reported_by = that.user_id
      // let by_name = that.search
      that.$nextTick(() => {
        // that.$nuxt.$loading.start();
        that.$store.dispatch('categoriesV2/index', {type: 'deviation'}).then(result => {
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
          // that.$toaster.error(that.$i18n.t('message.fail_category_view'));
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          // that.$nuxt.$loading.finish();
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
          } else {
            that.$nuxt.$loading.finish();
          }
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }
          // that.$toaster.error(that.$i18n.t('message.fail_statement_view'));
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          // that.$nuxt.$loading.finish();
        });

        //Get deviation list
         // that.$nuxt.$loading.start();
          that.tableLoad = true
        that.$store.dispatch('deviations/index',{page }).then(result => {
          that.listArray = result.data;
          that.pagination = result
            delete that.pagination.data
          that.tableLoad = false
          that.$nuxt.$loading.finish();
        }).catch((error) => {
          that.tableLoad = false
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_deviation_view'));
          }
          // that.$nuxt.$loading.finish();
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        });

        that.$store.dispatch('deviations/filter',{page }).then(result => {
           that.processing = {
            total: result.total || 0,
            new: result.total_new || 0,
            processing: result.total_ongoing || 0,
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
          // that.$nuxt.$loading.finish();
        });

        // list categories
        // that.$nuxt.$loading.start();
        

        //Get employee list
        // that.$nuxt.$loading.start();
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
              return i.name = i.name + ' - ' + i.department_name;
            } else {
              return i.name;
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
          // that.$toaster.error(that.$i18n.t('message.fail_employee_view'));
         // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          // that.$nuxt.$loading.finish();
        });

        // list departments
        // that.$nuxt.$loading.start();
        that.$store.dispatch('departments/index').then(result => {
          that.departmentsArray = result.data;
          that.departmentsSelection = _.clone(result.data);
          that.departmentsSelection.push(that.departmentDefault);
          that.departmentsSelection.sort(function (a, b) {
            return (a.id - b.id);
          });
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }
          // that.$toaster.error(that.$i18n.t('message.fail_department_view'));
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          // that.$nuxt.$loading.finish();
        });

        // list job titles
        // that.$nuxt.$loading.start();
        that.$store.dispatch('jobTitles/index').then(result => {
          that.jobTitleArray = result.data;
          that.jobTitleSelection = _.clone(result.data);
          that.jobTitleSelection.push(that.jobTitleDefault);
          that.jobTitleSelection.sort(function (a, b) {
            return (a.id - b.id);
          });
          // that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }
          // that.$toaster.error(that.$i18n.t('message.fail_job_title_view'));
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          // that.$nuxt.$loading.finish();
        });

        this.reloadList();

        //Get risk element list
        // // that.$nuxt.$loading.start();
        // that.$store.dispatch('riskElementSource/index').then(result => {
        //   that.riskElementSourceArray = result.data;
        // }).catch((error) => {
        //     if (error.response.status == 401) {
        //     this.$router.push('/login');
        //     this.$toaster.error(this.$i18n.t('message.token_expired'));
        //   }
        //   // that.$toaster.error(that.$i18n.t('message.fail_risk_element_view'));
        //   // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        //   that.$nuxt.$loading.finish();
        // });
      });
    },

    methods: {
      redirectUrl(){
          if (this.roleUser == 'company admin') {
              this.$router.push('/settings/billings/');
          }
      },
      statusSelection(statusValue){
        this.devStatus = statusValue
        if (statusValue == 0 && !this.start_date && !this.end_date && !this.user_id && !this.job_id && !this.dep_id && !this.search) {
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

         if (this.start_date == '' && this.end_date == '' && !this.devStatus && !this.user_id && !this.job_id && !this.dep_id  && !this.search) {
          this.fetchData(1 , false)
        }else{
          this.fetchData(1 , true)
        }
      },
       userSelection(userValue){
        this.user_id = userValue
        if (userValue == 0 && !this.start_date && !this.end_date && !this.devStatus && !this.job_id && !this.dep_id && !this.search) {
          this.fetchData(1 , false)
        }else{
          this.fetchData(1 , true)
        }
      },

      departmentSelection(depValue){
        this.dep_id = depValue
        if (depValue == 0 && !this.start_date && !this.end_date && !this.devStatus && !this.job_id && !this.search) {
          this.fetchData(1 , false)
        }else{
          this.fetchData(1 , true)
        }
      },
      jobSelection(jobValue){
        this.job_id = jobValue
        if (jobValue == 0 && !this.start_date && !this.end_date && !this.devStatus && !this.dep_id && !this.search) {
          this.fetchData(1 , false)
        }else{
          this.fetchData(1 , true)
        }
      },
      textFilter(text){
        this.search = text
        if (text == "" && !this.start_date && !this.end_date && !this.devStatus && !this.job_id && !this.dep_id && !this.user_id) {
          this.fetchData(1 , false)
        }else{
          this.fetchData(1 , true)
        }
      },
      changePage(page) {
        if (this.devStatus || this.start_date || this.end_date || this.user_id || !this.job_id || !this.dep_id || this.search) {
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
      if (that.devStatus) {
        payload.status = that.devStatus;
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

      if (that.job_id) {
        payload.job_title = that.job_id;
      }

      if (that.dep_id) {
        payload.department = that.dep_id;
      }
      
      if (that.search) {
        payload.by_name = that.search;
      }
      // that.$nuxt.$loading.start();
      that.tableLoad = true
     value && that.$store.dispatch('deviations/filter',payload).then(result => {
      // that.$nuxt.$loading.start();
          that.listArray = result.data;
          //  that.processing = {
          //   total: result.total,
          //   new: result.total_new,
          //   processing: result.total_ongoing,
          //   closed: result.total_closed,
          // };
          that.pagination = result
            delete that.pagination.data
            that.tableLoad = false
          that.$nuxt.$loading.finish();
        }).catch((error) => {
          that.tableLoad = false
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_deviation_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });

        // that.tableLoad = true
        !value && that.$store.dispatch('deviations/index',payload).then(result => {
      // that.$nuxt.$loading.start();
          that.listArray = result.data;
          //  that.processing = {
          //   total: result.total,
          //   new: result.total_new,
          //   processing: result.total_ongoing,
          //   closed: result.total_closed,
          // };
          that.pagination = result
            delete that.pagination.data
            that.tableLoad = false
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            that.tableLoad = false
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
      reloadList(){
        let that = this;
        // get list
        let page = this.current_page
        // that.$nuxt.$loading.start();
        that.tableLoad = true
        that.$store.dispatch('deviations/index',{page}).then(result => {
          that.listArray = result.data;
          //  that.processing = {
          //   total: result.total,
          //   new: result.total_new,
          //   processing: result.total_ongoing,
          //   closed: result.total_closed,
          // };
          that.tableLoad = false
          // that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_deviation_view'));
          }
          that.tableLoad = false
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
          // that.$toaster.error(that.$i18n.t('message.fail_risk_element_view'));
          }
          that.$nuxt.$loading.finish();
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        });

      that.$store.dispatch('places/index').then(result => {
         that.placeArray = _.filter(result.data, function (item) {
            return !item.disable_status;
          });
          that.placesSelection = _.clone(result.data);
          // that.placesSelection.push(that.dataDefault);
          // that.placesSelection.sort(function (a, b) {
          //   return (a.id - b.id);
          // });
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$nuxt.$loading.finish();
          }
        });


        that.$store.dispatch('consequences/index').then(result => {
         that.consequenceArray = _.filter(result.data, function (item) {
            return !item.disable_status;
          });
          that.consequenceSelection = _.clone(result.data);
          // that.consequenceSelection.push(that.dataDefault);
          // that.consequenceSelection.sort(function (a, b) {
          //   return (a.id - b.id);
          // });
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$nuxt.$loading.finish();
          }
        });
      },
      reloadListCategory(){
        let that = this;
        that.$store.dispatch('categoriesV2/index', {type: 'deviation'}).then(result => {
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

      reset () {
        setTimeout(() => {
          // this.$refs.form.reset();
          this.$refs.form.resetValidation();
          this.$nuxt.$loading.finish();
        }, 0);
      },

      // updateRiskElement(risk_element_source) {
      //   var that = this;
      //   if (that.riskElementAnalysis.length === 0) {
      //     that.riskElement = Object.assign({}, risk_element_source);
      //     that.riskElement.id = 1;
      //     that.riskElement.type = "Made by user";
      //     that.riskElement.newlyCreated = false;
      //     that.riskElement.risk_element_source_id = risk_element_source.id;
      //     that.riskElementAnalysis.push(that.riskElement);
      //     that.riskElement = Object.assign({}, that.riskElementDefault);
      //   } else {
      //     _.each(that.chooseRiskElement, function (item) {
      //       if (_.isUndefined(_.findWhere(that.riskElementAnalysis, {risk_element_source_id: item}))) {
      //         that.riskElement = Object.assign({}, risk_element_source);
      //         that.riskElement.id = that.riskElementAnalysis[that.riskElementAnalysis.length - 1].id + 1;
      //         that.riskElement.type = "Made by user";
      //         that.riskElement.newlyCreated = false;
      //         that.riskElement.risk_element_source_id = risk_element_source.id;
      //         that.riskElementAnalysis.push(that.riskElement);
      //         that.riskElement = Object.assign({}, that.riskElementDefault);
      //       }
      //     });
      //   }
      //   that.riskElementAnalysis = _.reject(that.riskElementAnalysis, function(item_riskElementAnalysis){
      //     return !item_riskElementAnalysis.newlyCreated && _.indexOf(that.chooseRiskElement, item_riskElementAnalysis.risk_element_source_id) === -1;
      //   });
      // },
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

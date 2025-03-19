<template>
  <div class="resources-page">
    <v-btn
      class="mb-2 btn-create btn-custom-green"
      @click="checkAddNew = true"
    >
      {{ $t('button.add_new') }}
    </v-btn>

    <b-tabs card lazy>
      <keep-alive>
        <b-tab :title="$t('tab.resources')">
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKey" />
          <v-container>
            <ChecklistPopup
              :open-popup="checkAddNew"
              :resource="true"
              :industry-array="industriesArray"
              :categories-array="categoriesArray"
              :list-answer-array="answerArray"
              @closePopup="checkAddNew = !checkAddNew"
              @reloadList="reloadList"
              @resourceList="resourcesTab"
              @reloadListCategory="reloadListCategory"
              @reloadAnswerOptionsList="reloadAnswerOptionsList"
              @reloadOptionsAfterCancel="reloadOptionsAfterCancel"
            />
            <ChecklistTable
              :resource="true"
              :industry-array="industriesArray"
              :list-array-input="listArray"
              :categories-array="categoriesArray"
              :categories-selection="categoriesSelection"
              :search="search_resource"
              @reloadList="reloadList"
              @resourceList="resourcesTab"
              @reloadListCategory="reloadListCategory"
              @dateSelectionResource="dateSelectionResource"
              @textFilterResource="textFilterResource"
            />
            <v-col
              class="d-flex justify-content-start align-items-center cust-pagination"
            >
              <div class="cust-col">
                <span class="pagination-cust-text"
                  >{{ pagination.from || '0'}} - {{ pagination.to || '0'}} of
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
      <keep-alive>
        <b-tab :title="$t('tab.answer_options')" name="options-template-tab">
<!--          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyAnswerOption" />-->
          <v-container>
            <AnswerOptionTable
              :list-array-input="resourceOptionsArray"
              :resource="true"
              @reloadAnswerOptionsList="reloadAnswerOptionsList"
            />
          </v-container>

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
          />
        </b-tab>
      </keep-alive>
    </b-tabs>
  </div>
</template>
<script>
  import {_} from 'vue-underscore';
  // import moment from 'moment';
  import cookies from 'js-cookie';
  import TitleCaption from "../../../../components/TitleCaption";
  import ChecklistPopup from "../../../../components/ChecklistPopup";
  import ChecklistTable from "../../../../components/ChecklistTable";
  import NewAnswerOptionPopup from "../../../../components/NewAnswerOptionPopup";
  import AnswerOptionTable from "../../../../components/AnswerOptionTable";
   import debounce from 'lodash/debounce';

  export default {
    components: {
      TitleCaption,
      ChecklistPopup,
      ChecklistTable,
      NewAnswerOptionPopup,
      AnswerOptionTable,
    },

    data: () => ({
      userRoleId: parseInt(cookies.get('roleID')),
      userDepartmentID: parseInt(cookies.get('userDepartmentID')),
      checkAdmin: cookies.get('checkAdmin'),
      roleUser: cookies.get('roleUser'),
      pageKey: 'resources-checklists-resources',
      checkAddNew: false,
      listArray: [],
      resourceOptionsArray: [],
      categoriesArray: [],
      categoriesSelection: [],
      categoriesDefault: {
        id: 0,
        name: "All"
      },
      category_checklist: 'checklist',
      industriesArray: [],
      answerArray: [],
      search_resource:'',
      current_page: 1,
      pagination: {},
    }),

    computed: {},

    watch: {},

    mounted() {
      let that = this;
       let page = this.current_page
      that.$nextTick(() => {
        that.$nuxt.$loading.start();
        // list industries

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

        that.$store.dispatch('industries/index').then(result => {
          that.industriesArray = result.data;
        }).catch(() => {
          // that.$toaster.error(that.$i18n.t('message.fail_industry_view'));
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });


        // list checklist Default OPTIONS list
        that.$store.dispatch('options/index').then(result => {
          that.resourceOptionsArray = result.data;
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

        // list checklists
        that.$store.dispatch('checklists/index',{page}).then(result => {
          // that.$store.dispatch('checklists/index', {objectTypeArray: [that.category_checklist]}).then(result => {
          that.listArray = result.data;
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
      });
    },

    methods: {
       textFilterResource(text){
        this.search_resource = text
          this.fetchDataResource(1)
      },
      changePageResource(page) {
      this.fetchDataResource(page)
    },
    dateSelectionResource(dateValue){
        const inputDate = dateValue.startDate;
        const dateObj = new Date(inputDate);
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth() + 1; // Add 1 to the month as it is zero-indexed
        const day = dateObj.getDate();
        const start_date = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`; 


        const inputDate2 = dateValue.startDate;
        const dateObj2 = new Date(inputDate2);
        const year2 = dateObj2.getFullYear();
        const month2 = dateObj2.getMonth() + 1; // Add 1 to the month as it is zero-indexed
        const day2 = dateObj2.getDate();
        const end_date = `${year2}-${month2.toString().padStart(2, "0")}-${day2.toString().padStart(2, "0")}`; 


         this.start_date= start_date === "1970-01-01" ? '' : start_date;
         this.end_date=end_date === "1970-01-01" ? '' : end_date;
         this.fetchDataResource(1)
      },
      fetchDataResource: debounce(function(page) {
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
      if (that.search_resource) {
        payload.by_name = that.search_resource;
      }

     that.$store.dispatch('checklists/index', {report: "yes" ,...payload }).then(result => {
          that.listArray = result.data;
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
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage);
          that.$nuxt.$loading.finish();
        });
    },300),
      resourcesTab(){
        let that = this;
        let page = this.current_page
        // get list
        that.$store.dispatch('checklists/index', {report: "yes" , page}).then(result => {
          that.listArray = result.data;
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_checklist_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage);
          that.$nuxt.$loading.finish();
        });
        },
      reloadList(){
        let that = this;
        let page = this.current_page
        // get list
        that.$store.dispatch('checklists/index', {report: "yes" , page}).then(result => {
          that.listArray = result.data;
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
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage);
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
        that.resourceOptionsArray = list;
        that.answerArray = list;
        that.answerArray = _.sortBy(that.answerArray, function(answer) {
          return answer.count_used_time;
        });
        that.formatNameOfDefaultOptionType(that.answerArray.reverse());
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
    },
  };
</script>

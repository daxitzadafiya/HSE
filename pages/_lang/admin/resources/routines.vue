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
        <b-tab :title="$t('tab.routines')">
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKey" />
          <v-container>
            <RoutinePopup
              :open-popup="checkAddNew"
              :resource="true"
              :industry-array="industriesArray"
              :categories-array="categoriesArray"
              @closePopup="checkAddNew = !checkAddNew"
              @reloadList="reloadList"
              @reloadListCategory="reloadListCategory"
            />
            <RoutineTable
              :resource="true"
              :industry-array="industriesArray"
              :list-array-input="listArray"
              :categories-array="categoriesArray"
              :categories-selection="categoriesSelection"
              :search="search_resource"
              @reloadList="reloadList"
              @reloadListCategory="reloadListCategory"
              @categoryResourceSelection="categoryResourceSelection"
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
    </b-tabs>
  </div>
</template>
<script>
  import {_} from 'vue-underscore';
  import cookies from 'js-cookie';
  import TitleCaption from "../../../../components/TitleCaption";
  import RoutinePopup from "../../../../components/RoutinePopup";
  import RoutineTable from "../../../../components/RoutineTable";
  import debounce from 'lodash/debounce';

  export default {
    components: {
      TitleCaption,
      RoutinePopup,
      RoutineTable,
    },

    data: () => ({
      userRoleId: parseInt(cookies.get('roleID')),
      userDepartmentID: parseInt(cookies.get('userDepartmentID')),
      checkAdmin: cookies.get('checkAdmin'),
      // roleUser: cookies.get('roleUser'),
      pageKey: 'resources-routines-resources',
      checkAddNew: false,
      listArray: [],
      categoriesArray: [],
      categoriesSelection: [],
      categoriesDefault: {
        id: 0,
        name: "All"
      },
      industriesArray: [],
      category_routine: 1, // category type: routine
      search_resource:'',
      pagination: {},
    current_page: 1,
    categoryResourceValue:'',
    }),

    computed: {},

    watch: {},

    mounted() {
      let that = this;
      let page = this.current_page
      
      that.$nextTick(() => {
        that.$nuxt.$loading.start();
        // list categories
        that.$store.dispatch('categoriesV2/index', {type: 'routine'}).then(result => {
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
        
        // list industries
        that.$store.dispatch('industries/index').then(result => {
          that.industriesArray = result.data;
        }).catch(() => {
          // that.$toaster.error(that.$i18n.t('message.fail_industry_view'));
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });

        

        // list routines
        that.$store.dispatch('routines/index' , {page}).then(result => {
          that.listArray = result.data;
           that.pagination = result
            delete that.pagination.data
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_routine_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      });
    },

    methods: {
      categoryResourceSelection(catValue){
        console.log("catValue",catValue);
      this.categoryResourceValue = catValue
      this.fetchDataResource(1)
    },
     textFilterResource(text){
        this.search_resource = text
          this.fetchDataResource(1)
      },
       changePageResource(page) {
      this.fetchDataResource(page)
    },
    fetchDataResource: debounce(function(page) {
      let that = this
      this.current_page = page
      let payload = {};
      payload.page = page;
      if (that.categoryResourceValue) {
        payload.category = that.categoryResourceValue;
      }
      if (that.search_resource) {
        payload.by_name = that.search_resource;
      }
      that.$store
        .dispatch('routines/index',payload)
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
    },300),
      reloadList(){
        let that = this;
        let page = this.current_page
        // get list
        that.$store.dispatch('routines/index',{page}).then(result => {
          that.listArray = result.data;
          that.pagination = result
            delete that.pagination.data
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_routine_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      },

      reloadListCategory(){
        let that = this;
        that.$store.dispatch('categoriesV2/index', {type: 'routine'}).then(result => {
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
    },
  };
</script>

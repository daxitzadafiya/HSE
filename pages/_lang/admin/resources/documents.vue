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
        <b-tab :title="$t('tab.documents')">
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKey" />
          <v-container>
            <DocumentPopup
              :open-popup="checkAddNew"
              :resource="true"
              :industry-array="industriesArray"
              :categories-array="categoriesArray"
              :category-type="category_type"
              :type="'document'"
              :added-from="'document'"
              @closePopup="checkAddNew = !checkAddNew"
              @reloadList="reloadList"
              @reloadListCategory="reloadListCategory"
            />
            <DocumentTable
              :table-title="'Document'"
              :resource="true"
              :industry-array="industriesArray"
              :list-array-input="listArray"
              :categories-array="categoriesArray"
              :categories-selection="categoriesSelection"
              :category-type="category_type"
              :search_value="search_resource"
              @textFilterResource="textFilterResource"
              @reloadList="reloadList"
              @reloadListCategory="reloadListCategory"
            />
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
  import DocumentPopup from "../../../../components/DocumentPopup";
  import DocumentTable from "../../../../components/DocumentTable";
import debounce from 'lodash/debounce';


  export default {
    components: {
      TitleCaption,
      DocumentPopup,
      DocumentTable,
    },

    data: () => ({
      userRoleId: parseInt(cookies.get('roleID')),
      userDepartmentID: parseInt(cookies.get('userDepartmentID')),
      checkAdmin: cookies.get('checkAdmin'),
      // roleUser: cookies.get('roleUser'),
      pageKey: 'resources-documents-resources',
      checkAddNew: false,
      listArray: [],
      categoriesArray: [],
      categoriesSelection: [],
      categoriesDefault: {
        id: 0,
        name: "All"
      },
      industriesArray: [],
      category_type: 'document',
      type_document: 'document',
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
        //Get categories list
        that.$store.dispatch('categoriesV2/index', {type: that.category_type}).then(result => {
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

        //Get document list
        that.$store.dispatch('documents/index', {page,
            type: that.type_document,
            object_type: 'document',
            template: '1'
          }).then(result => {
          // _.each(result.data, function(item){
          //   if(item.description){
          //     item.description = item.description.replace(/<[^>]+>/g, '');
          //   }
          // });
          // that.listArray = _.filter(result.data, function(item) {
          //     return item.is_template
          //   })
          //   that.templates = _.filter(result.data, function(item) {
          //     return item.is_template
          //   })
            that.templates = result.data
            that.listArray = result.data
            that.pagination = result
            delete that.pagination.data
          // that.listArray = _.filter(result.data, function (item) {
          //   return item.object_type !== 'help center';
          // });
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_document_view'));
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
      fetchDataResource: debounce(function(page) {
      let that = this
      this.current_page = page
      let payload = {};
      payload.page = page;
      if (that.search_resource) {
        payload.by_name = that.search_resource;
      }
      that.$store
          .dispatch('documents/index', {
            type: that.type_document,
            object_type: 'document',
            template: '1' , ...payload
          })
          .then((result) => {
            // that.listArray = _.filter(result.data, function(item) {
            //   return item.is_template
            // })
            // that.templates = _.filter(result.data, function(item) {
            //   return item.is_template
            // })
            that.templates = result.data
          that.listArray = result.data
            that.pagination = result
            delete that.pagination.data
            that.$nuxt.$loading.finish()
          })
          .catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_document_view'))
          }
          that.$nuxt.$loading.finish()
        })
    },300),
      reloadList(){
        let that = this;
        let page = this.current_page
        // get list
        that.$store.dispatch('documents/index', {page,
            type: that.type_document,
            object_type: 'document',
            template: '1'
          }).then(result => {
          // _.each(result.data, function(item){
          //   if(item.description){
          //     item.description = item.description.replace(/<[^>]+>/g, '');
          //   }
          // });
          // that.listArray = _.filter(result.data, function(item) {
          //     return item.is_template
          //   })
          //   that.templates = _.filter(result.data, function(item) {
          //     return item.is_template
          //   })
          // that.listArray = _.filter(result.data, function (item) {
          //   return item.object_type !== 'help center';
          // });
          that.templates = result.data
          that.listArray = result.data
          that.pagination = result
            delete that.pagination.data
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_document_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      },

      reloadListCategory(){
        let that = this;
        that.$store.dispatch('categoriesV2/index', {type: that.category_type}).then(result => {
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
<style>
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
</style>
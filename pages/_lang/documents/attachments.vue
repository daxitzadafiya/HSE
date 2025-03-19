<template>
  <div class="documents-page">
    <b-tabs card lazy>
      <keep-alive>
        <b-tab :title="$t('tab.companies')" name="company-tab">
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyCompany" />
          <v-container>
            <DocumentTable
              :table-title="'Attachment'"
              :resource="false"
              :list-array-input="listArray"
              :categories-array="categoriesArray"
              :categories-selection="categoriesSelection"
              :category-type="category_type"
              @textFilter="textFilter"
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
      <keep-alive>
        <b-tab :title="$t('tab.contacts')" name="contact-tab">
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyContact" />
          <v-container>
            <DocumentTable
              :table-title="'Attachment'"
              :resource="false"
              :list-array-input="listContactAttachment"
              :categories-array="categoriesArray"
              :categories-selection="categoriesSelection"
              :category-type="category_type"
            />
          </v-container>
        </b-tab>
      </keep-alive>
      <keep-alive>
        <b-tab :title="$t('tab.employees')" name="employee-tab">
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyEmployee" />
          <v-container>
            <DocumentTable
              :table-title="'Attachment'"
              :resource="false"
              :list-array-input="listEmployeeArray"
              :categories-array="categoriesArray"
              :categories-selection="categoriesSelection"
              :category-type="category_type"
            />
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
  import DocumentTable from "../../../components/DocumentTable";
  import { removeTagsFromString } from '../../../components/common/js/functions';
  import debounce from 'lodash/debounce';

  export default {
    components: {
      TitleCaption,
      DocumentTable
    },

    data: () => ({
      userRoleId: parseInt(cookies.get('roleID')),
      userDepartmentID: parseInt(cookies.get('userDepartmentID')),
      checkAdmin: cookies.get('checkAdmin'),
      roleUser: cookies.get('roleUser'),
      pageKeyCompany: 'documents-attachments-company',
      pageKeyContact: 'documents-attachments-contacts',
      pageKeyEmployee: 'documents-attachments-employees',
      permissionsUser: localStorage.getItem('permissionsKey'),
      type_document: 'attachment',
      category_type: 'attachment',
      listArray: [],
      listContactAttachment: [],
      listEmployeeArray: [],
      categoriesArray: [],
      categoriesSelection: [],
      categoriesDefault: {
        id: 0,
        name: "All"
      },
      pagination: {},
      searchString: '',
      current_page: 1
    }),

    computed: {},

    watch: {},

    mounted() {
      let that = this;
      that.$nextTick(() => {
        that.$nuxt.$loading.start();
        //Get categories list
        that.$store.dispatch('categories/index', {type: that.category_type}).then(result => {
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

        // Get document list - type 'attachment'
        that.$store.dispatch('documents/attachment', {
          template: 0,
          object_type:'document',
          by_name: ''
        }).then(result => {
          if (result.data.length > 0) {
            _.each(result.data, async function (item) {
              if (item.description) {
                item.description = await removeTagsFromString(item.description);
              }
            });
          }
          that.listArray= result.data;
          that.pagination = result
          delete that.pagination.data
          // company
          // that.listArray = _.filter(result.data, function (item) {
          //   return item.object_type === 'company';
          // });

          // that.listArray = _.filter(result.data, function (item) {
          //   return item.type_of_attachment === 1;
          // });

          // contact
          that.listContactAttachment = _.filter(result.data, function (item) {
            return item.object_type === 'contact';
          });

          // employee
          that.listEmployeeArray = _.filter(result.data, function (item) {
            return item.object_type === 'employee';
          });
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_document_view'));
          }
          that.$nuxt.$loading.finish();
          // that.$toaster.error(error.response.data.message || error.response.data.errors);
        });
      });
    },

    methods: {
      close() {
        this.reset();
      },

      reset() {
        setTimeout(() => {
          this.$refs.form.reset();
          this.$refs.form.resetValidation();
        }, 0);
      },
      changePageResource(page) {
        this.getAttchmentData(page)
      },
      getAttchmentData: debounce(async function(page){
        let that= this;
        this.current_page = page;
        let payload = {page: page, template: 0, object_type:'document'};
        if(this.searchString){
          payload['by_name']=this.searchString;
        }
        that.$store.dispatch('documents/attachment', payload).then(result => {
          if (result.data.length > 0) {
            _.each(result.data, async function (item) {
              if (item.description) {
                item.description = await removeTagsFromString(item.description);
              }
            });
          }
          that.listArray= result.data;
          that.pagination = result
          delete that.pagination.data
        });
        
      },300),
      textFilter(searchString){
        this.searchString=searchString;
        this.getAttchmentData(1);
        
      }
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

.cust-pagination .pagination-btns .v-pagination .v-pagination__navigation {
  background-color: transparent !important;
  box-shadow: none !important;
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

.v-pagination__navigation {
  box-shadow: none !important;
}
</style>
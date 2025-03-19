<template>
  <div class="hse-page">
    <div @mouseenter="hoverDocumentPlanAccess = true" @mouseleave="hoverDocumentPlanAccess = false" style="width: fit-content">
    <v-badge v-if="!!planAccess?.lastPlanAccess?.document" :value="hoverDocumentPlanAccess" right
          transition="slide-x-transition" class=" hover-label hse--icon-question-circle badgee">
        <span slot="badge" @click="redirectUrl">{{ $t('message.accessible_module') }}</span> 
    </v-badge>
          <v-btn  v-if="(tabIndex === 0 ? checkAdmin || permissionsUser.indexOf('document-basic') > -1
                          : checkAdmin || permissionsUser.indexOf('document-resource') > -1) && roleUser !== 'user'" 
                          class="mt-2 btn-create btn-custom-green"
             @click="openPopup = true" :disabled="!!planAccess?.lastPlanAccess?.document">
            {{ $t('button.add_new') }}
          </v-btn>
      </div>
    <b-tabs v-model="tabIndex" card lazy class="hse-badge-tab">
      <v-badge
        v-if="roleUser !== 'user' && roleUser !== 'manager'"
        :value="hoverResource"
        right
        transition="slide-x-transition"
        class="hse-badge-icon badge-page-instruction"
      >
        <span slot="badge">Below you find the available template</span>
        <v-hover v-model="hoverResource">
          <i class="fa fa-question-circle"></i>
        </v-hover>
      </v-badge>

      <keep-alive>
        <b-tab
          :title="$t('tab.documents')"
          :active="!this.$route.query.type"
          name="result-tab"
          @click="documentTab"
        >
          <TitleCaption
            :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKey"
          />
          <v-container>
            <DocumentPopup
              :open-popup="openPopup"
              :resource="false"
              :categories-array="categoriesArray"
              :category-type="category_type"
              :type="'document'"
              :added-from="added_from"
              :predefined-link-array="predefinedLinkArray"
              @closePopup="openPopup = !openPopup"
              @reloadList="reloadList"
              @resourceList="resourceTab"
              @reloadListCategory="reloadListCategory"
              @changeTab="changeTab"
            />
            <DocumentTable
              :table-title="'Document'"
              :resource="false"
              :list-array-input="listArray"
              :categories-array="categoriesArray"
              :categories-selection="categoriesSelection"
              :category-type="category_type"
              :predefined-link-array="predefinedLinkArray"
              :object-id="paramId"
              @textFilter="textFilter"
              @reloadList="reloadList"
              @resourceList="resourceTab"
              @reloadListCategory="reloadListCategory"
              @changeTab="changeTab"
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
      <keep-alive>
        <b-tab
          v-if="roleUser !== 'user' && roleUser !== 'manager'"
          :title="$t('tab.resources')"
          :active="this.$route.query.type === 'resource'"
          name="detail-tab"
          @click="resourceTab"
        >
          <TitleCaption
            :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyResource"
          />
          <v-container>
            <DocumentPopup
              :open-popup="openPopup"
              :resource="true"
              :categories-array="categoriesArray"
              :category-type="category_type"
              :type="'document'"
              :added-from="added_from"
              :predefined-link-array="predefinedLinkArray"
              @closePopup="openPopup = !openPopup"
              @resourceList="resourceTab"
              @reloadListCategory="reloadListCategory"
              @changeTab="changeTab"
            />
            <DocumentTable
              :table-title="'Document'"
              :resource="true"
              :list-array-input="templates"
              :categories-array="categoriesArray"
              :categories-selection="categoriesSelection"
              :category-type="category_type"
              :predefined-link-array="predefinedLinkArray"
              :object-id="paramId"
              :search_value="search_resource"
               @textFilterResource="textFilterResource"
              @resourceList="resourceTab"
              @reloadListCategory="reloadListCategory"
              @changeTab="changeTab"
            />
            <v-col v-if="roleUser !== 'user' && roleUser !== 'manager'" class="d-flex justify-content-start align-items-center cust-pagination">
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
import { _ } from 'vue-underscore'
import cookies from 'js-cookie'
import TitleCaption from '../../../components/TitleCaption'
import DocumentPopup from '../../../components/DocumentPopup'
import DocumentTable from '../../../components/DocumentTable'
import debounce from 'lodash/debounce';

export default {
  components: {
    TitleCaption,
    DocumentPopup,
    DocumentTable
  },

  data: () => ({
    hoverDocumentPlanAccess:false,
    pageKey: 'documents-documents-documents',
    pageKeyResource: 'documents-documents-resources',
    permissionsUser: localStorage.getItem('permissionsKey'),
    planAccess: JSON.parse(localStorage.getItem('planAccess')),
    userRoleId: parseInt(cookies.get('roleID')),
    userDepartmentID: parseInt(cookies.get('userDepartmentID')),
    checkAdmin: cookies.get('checkAdmin'),
    roleUser: cookies.get('roleUser'),
    search_resource: '',
    dialog: false,
    valid: true,
    category: 0,
    type: 'All',
    added_by: 0,
    selectedFile: [],
    headers: [
      { text: 'Name', align: 'left', value: 'name' },
      // {text: 'Type', align: 'center', value: 'type_of_attachment'},
      { text: 'Added By', align: 'center', value: 'added_by_name' },
      { text: 'Last edited', value: 'updated_at', align: 'center' },
      { text: 'Category', align: 'center', value: 'category_name' },
      { text: 'See More', value: 'see_more', align: 'center', sortable: false }
    ],
    headersTemplate: [
      { text: 'Name', align: 'left', value: 'name' },
      // {text: 'Type', align: 'center', value: 'type_of_attachment'},
      { text: 'Added By', align: 'center', value: 'added_by_name' },
      { text: 'Last edited', value: 'updated_at', align: 'center' },
      { text: 'Category', align: 'center', value: 'category_name' },
      { text: 'See More', value: 'see_more', align: 'center', sortable: false }
    ],
    listArray: [],
    required: [
      (v) => {
        if (!v || v.length < 1) return 'This is required'
        else return true
      }
    ],
    categoriesArray: [],
    categoriesSelection: [],
    dialogDelete: false,
    categoriesDefault: {
      id: 0,
      name: 'All'
    },
    tabIndex: 0,
    templates: [],
    dialogTemplate: false,
    dialogApply: false,
    dialogConfirmApply: false,
    formDirty: false,
    dialogConfirmClose: false,
    type_document: 'document',
    category_type: 'document',
    added_from: 'document',
    openPopup: false,
    // badge
    hoverResource: false,
    predefinedLinkArray: [],
    paramId: '',
    current_page: 1,
    pagination: {},
    search:''
  }),

  computed: {},

  watch: {},

  created() {
    if (this.$route.query.id) {
      this.paramId = this.$route.query.id
    }
  },

  mounted() {
    let that = this
     let page = this.current_page
    that.$nextTick(() => {
      that.$nuxt.$loading.start()

      //Get categories list
      that.$store
        .dispatch('categoriesV2/index', { type: that.category_type })
        .then((result) => {
          that.categoriesArray = result.data
          that.categoriesSelection = _.clone(result.data)
          that.categoriesSelection.push(that.categoriesDefault)
          that.categoriesSelection.sort(function(a, b) {
            return a.id - b.id
          })
        })
        .catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          // that.$toaster.error(that.$i18n.t('message.fail_category_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish()
        })

      //list suggestions
      that.$store
        .dispatch('statements/index', { param: 'suggestion' })
        .then((result) => {
          if (result.data) {
            _.each(result.data, function(item) {
              _.each(item.data, function(object) {
                let linkItem = {
                  text: '',
                  href: '',
                  target: '_blank'
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
                  function(item) {
                    return item.text
                  }
                )
              })
            })
            that.$nuxt.$loading.finish()
          } else {
            that.$nuxt.$loading.finish()
          }
        })
        .catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          // that.$toaster.error(that.$i18n.t('message.fail_statement_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish()
        })

         if (that.resource) {
          that.$store
          .dispatch('documents/index', {type: that.type_document,object_type: 'document',template: '1',page
          })
          .then((result) => {
            // that.listArray = _.filter(result.data, function(item) {
            //   return item.is_template
            // })
            // that.templates = _.filter(result.data, function(item) {
            //   return item.is_template
            // })
            result.data = _.uniq(result.data, item => item.id);
            that.listArray = result.data
            that.templates = result.data
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
        }

      //Get document list
       if (!that.resource) {
         that.$store
           .dispatch('documents/index', {
             type: that.type_document,template: '0',
             object_type: 'document',page
           })
           .then((result) => {
             result.data = _.uniq(result.data, item => item.id);
            _.each(result.data, function(item){
            if(item.description){
              item.description = item.description.replace(/<[^>]+>/g, '');
            }
          });
            //  that.listArray = _.filter(result.data, function(item) {
            //   console.log("doc-without-resource",item);
            //    return !item.is_template
            //  })
   
            //  that.templates = _.filter(result.data, function(item) {
            //    return !item.is_template
            //  })
            that.listArray = result.data
            that.templates = result.data
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
             // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
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
     textFilter(text){
        this.search = text
          this.fetchData(1)
      },
      textFilterResource(text){
        this.search_resource = text
          this.fetchDataResource(1)
      },
    changePage(page) {
      this.fetchData(page)
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
            type: that.type_document,object_type: 'document',template: '1',...payload
          })
          .then((result) => {
            // that.listArray = _.filter(result.data, function(item) {
            //   return item.is_template
            // })
            // that.templates = _.filter(result.data, function(item) {
            //   return item.is_template
            // })
            result.data = _.uniq(result.data, item => item.id);
            that.listArray = result.data
            that.templates = result.data
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
    fetchData: debounce(function(page) {
      let that = this
      this.current_page = page
      let payload = {};
      payload.page = page;
      if (that.search) {
        payload.by_name = that.search;
      }
      that.$store
           .dispatch('documents/index', {
             type: that.type_document,
             object_type: 'document',template: '0',
              ...payload
           })
           .then((result) => {
            _.each(result.data, function(item){
            if(item.description){
              item.description = item.description.replace(/<[^>]+>/g, '');
            }
          });
            //  that.listArray = _.filter(result.data, function(item) {
            //    return !item.is_template
            //  })
   
            //  that.templates = _.filter(result.data, function(item) {
            //    return !item.is_template
            //  })
           result.data = _.uniq(result.data, item => item.id);
            that.listArray = result.data
            that.templates = result.data
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
             // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
           })
    },300),

    resourceTab(){
      let that = this
      let page = 1
      that.search = ""
      this.current_page = 1;

      that.$store
        .dispatch('documents/index', {
          type: that.type_document,
          object_type: 'document',
          template: '1',
          page
        })
        .then((result) => {
          // that.listArray = _.filter(result.data, function(item) {
          //   console.log("resourceTab",item);
          //   return item.is_template == 1
          // })
          // that.templates = _.filter(result.data, function(item) {
          //   return item.is_template
          // })
          result.data = _.uniq(result.data, item => item.id);
          that.listArray = result.data
          that.templates = result.data
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
    },

    documentTab(){
      let that = this
      let page = 1
      this.current_page = 1;
      that.search_resource = ""
      // get list
      that.$store
        .dispatch('documents/index', {
          type: that.type_document,template: '0',
          object_type: 'document',page
        })
        .then((result) => {
          result.data = _.uniq(result.data, item => item.id);
          // that.listArray = _.filter(result.data, function(item) {
          //   return !item.is_template
          // })
          // that.templates = _.filter(result.data, function(item) {
          //   return !item.is_template
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
    },

    reloadList() {
      let that = this
      // get list
      let page = this.current_page
      that.$store
        .dispatch('documents/index', {
          type: that.type_document,
          object_type: 'document',
          page
        })
        .then((result) => {
          _.each(result.data, function(item){
            if(item.description){
              item.description = item.description.replace(/<[^>]+>/g, '');
            }
          });
          result.data = _.uniq(result.data, item => item.id);
          // that.listArray = _.filter(result.data, function(item) {
          //   return !item.is_template
          // })
          // that.templates = _.filter(result.data, function(item) {
          //   return !item.is_template
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
    },

    reloadListCategory() {
      let that = this
      that.$store
        .dispatch('categoriesV2/index', { type: that.category_type })
        .then((result) => {
          that.categoriesArray = _.filter(result.data, function(item) {
            return !item.disable_status
          })
          that.categoriesSelection = _.clone(that.categoriesArray)
          that.categoriesSelection.push(that.categoriesDefault)
          that.categoriesSelection.sort(function(a, b) {
            return a.id - b.id
          })
          that.$nuxt.$loading.finish()
        })
        .catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_category_view'))
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish()
        })
    }
  }
}
</script>
<style scoped>
:deep(.v-pagination){
  width: auto !important;
}
:deep(.theme--light.v-pagination .v-pagination__navigation){
  background-color: transparent !important;
  box-shadow: none !important;
}
:deep(.hover-label .v-badge__badge){
  z-index: 1;
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

<style>
.cust-pagination .pagination-btns .v-pagination .v-pagination__navigation{
  background-color: transparent !important;
  box-shadow: none !important;
}
.pagination-btns{
  max-width: fit-content !important;
}
</style>

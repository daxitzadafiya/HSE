<template>
  <div class="hse-page">
    <v-btn v-if="tabIndex === 0 ? (checkAdmin || permissionsUser.indexOf('document-basic') > -1) : (checkAdmin || permissionsUser.indexOf('document-resource') > -1)"
           class="mb-2 btn-create btn-custom-green"
           @click="openPopup = true"
    >
      {{ $t('button.add_new') }}
    </v-btn>

    <b-tabs v-model="tabIndex" card lazy class="hse-badge-tab">
      <v-badge
        v-if="roleUser !== 'user'"
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
        <b-tab :title="$t('tab.documents')" :active="!this.$route.query.type" name="result-tab">
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKey" />
          <v-container>
            <DocumentPopup
              :open-popup="openPopup"
              :resource="false"
              :categories-array="categoriesArray"
              :category-type="category_type"
              :type="'document'"
              :added-from="added_from"
              @closePopup="openPopup = !openPopup"
              @reloadList="reloadList"
            />
            <DocumentTable
              :table-title="'Document'"
              :resource="false"
              :list-array-input="listArray"
              :categories-array="categoriesArray"
              :categories-selection="categoriesSelection"
              :category-type="category_type"
              :object-id="this.$route.query.id"
              @reloadList="reloadList"
            />
          </v-container>
        </b-tab>
      </keep-alive>
      <keep-alive>
        <b-tab v-if="roleUser !== 'user'" :title="$t('tab.resources')" :active="this.$route.query.type === 'resource'" name="detail-tab">
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyResource" />
          <v-container>
            <DocumentPopup
              :open-popup="openPopup"
              :resource="true"
              :categories-array="categoriesArray"
              :category-type="category_type"
              :type="'document'"
              :added-from="added_from"
              @closePopup="openPopup = !openPopup"
              @reloadList="reloadList"
            />
            <DocumentTable
              :table-title="'Document'"
              :resource="true"
              :list-array-input="templates"
              :categories-array="categoriesArray"
              :categories-selection="categoriesSelection"
              :category-type="category_type"
              :object-id="this.$route.query.id"
              @reloadList="reloadList"
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
  import DocumentPopup from "../../../components/DocumentPopup";
  import DocumentTable from "../../../components/DocumentTable";

  export default {
    components: {
      TitleCaption,
      DocumentPopup,
      DocumentTable
    },

    data: () => ({
      pageKey: 'documents-documents-documents',
      pageKeyResource: 'documents-documents-resources',
      permissionsUser: localStorage.getItem('permissionsKey'),
      userRoleId: parseInt(cookies.get('roleID')),
      userDepartmentID: parseInt(cookies.get('userDepartmentID')),
      checkAdmin: cookies.get('checkAdmin'),
      roleUser: cookies.get('roleUser'),
      search: '',
      search_resource: '',
      dialog: false,
      valid: true,
      category: 0,
      type: 'All',
      added_by: 0,
      selectedFile: [],
      headers: [
        {text: 'Name', align: 'left', value: 'name'},
        {text: 'Type', align: 'center', value: 'type_of_attachment'},
        {text: 'Category', align: 'center', value: 'category_name'},
        {text: 'Added By', align: 'center', value: 'added_by_name'},
        {text: 'Last edited', value: 'updated_at', align: 'center'},
      ],
      headersTemplate: [
        {text: 'Name', align: 'left', value: 'name'},
        {text: 'Type', align: 'center', value: 'type_of_attachment'},
        {text: 'Category', align: 'center', value: 'category_name'},
        {text: 'Added By', align: 'center', value: 'added_by_name'},
        {text: 'Last edited', value: 'updated_at', align: 'center'},
      ],
      listArray: [],
      required: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else return true;
        }
      ],
      categoriesArray: [],
      categoriesSelection: [],
      dialogDelete: false,
      categoriesDefault: {
        id: 0,
        name: "All"
      },
      tabIndex: 0,
      templates: [],
      dialogTemplate: false,
      dialogApply: false,
      dialogConfirmApply: false,
      formDirty: false,
      dialogConfirmClose: false,
      type_document: 'Document',
      category_type: 3, // category type: document
      added_from: 1, // Added from: 1. Document
      openPopup: false,
      // badge
      hoverResource: false,
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
        }).catch((error) => {
          that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });

        //Get document list
        that.$store.dispatch('documents/index', {
          type: that.type_document,
          added_from: that.added_from
        }).then(result => {
          _.each(result.data, function(item){
            if (item.description){
              item.description = item.description.replace(/<[^>]+>/g, '');
            }
          });
          that.listArray = _.filter(result.data, function (item) {
            return !item.is_template;
          });
          that.templates = _.filter(result.data, function (item) {
            return item.is_template;
          });
          that.$nuxt.$loading.finish();
        }).catch((error) => {
          that.$nuxt.$loading.finish();
          that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        });
      });
    },

    methods: {
      reloadList(){
        let that = this;
        // get list
        that.$store.dispatch('documents/index', {
          type: that.type_document,
          added_from: that.added_from
        }).then(result => {
          _.each(result.data, function(item){
            if(item.description){
              item.description = item.description.replace(/<[^>]+>/g, '');
            }
          });
          that.listArray = _.filter(result.data, function (item) {
            return !item.is_template;
          });
          that.templates = _.filter(result.data, function (item) {
            return item.is_template;
          });
          that.$nuxt.$loading.finish();
        }).catch((error) => {
          that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      },
    },
  };
</script>

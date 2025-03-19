<template>
  <div class="hse-page">
    <div @mouseenter="hoverRiskPlanAccess = true" @mouseleave="hoverRiskPlanAccess = false" style="width: fit-content">
      <v-badge v-if="!!planAccess?.lastPlanAccess?.risk" :value="hoverRiskPlanAccess" right
            transition="slide-x-transition" class=" hover-label hse--icon-question-circle badgee">
          <span slot="badge" @click="redirectUrl">{{ $t('message.accessible_module') }}</span> 
      </v-badge>
          <v-btn v-if="!(tabIndex === 1 && roleUser === 'user')" class="mt-2 btn-create btn-custom-green"
            @click="checkAddNew = true" :disabled="!!planAccess?.lastPlanAccess?.risk">
            {{ $t('button.add_new') }}
        </v-btn>
      </div>

    <b-tabs v-model="tabIndex" card lazy class="hse-badge-tab">
      <v-badge
        v-if="roleUser !== 'user'"
        :value="hoverResource"
        right
        transition="slide-x-transition"
        class="hse-badge-icon badge-page-risk-area"
      >
        <span slot="badge">Below you find the available template</span>
        <v-hover v-model="hoverResource">
          <i class="fa fa-question-circle"></i>
        </v-hover>
      </v-badge>

      <keep-alive>
        <b-tab :title="$t('tab.risk_elements')" :active="!this.$route.query.type">
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKey" />
          <v-container>
            <AddNewPopup
              :open-popup="checkAddNew"
              :form-title="$t('title.new_risk_element')"
              :object-field="objectField"
              :object-item="newItem"
              :categories-array="categoriesArray"
              :categories-type="'risk'"
              :predefined-link-array="predefinedLinkArray"
              @closePopup="checkAddNew = !checkAddNew"
              @savePopup="save"
            />

<!--            <RiskAreaPopup-->
<!--              :open-popup="checkAddNew"-->
<!--              :resource="false"-->
<!--              :categories-array="categoriesArray"-->
<!--              :job-title-array="jobTitleArray"-->
<!--              :departments-array="departmentsArray"-->
<!--              :predefined-link-array="predefinedLinkArray"-->
<!--              :task-assignees-array="taskAssigneesArray"-->
<!--              :responsible-array="responsibleArray"-->
<!--              @closePopup="checkAddNew = !checkAddNew"-->
<!--              @reloadList="reloadList"-->
<!--              @reloadListCategory="reloadListCategory"-->
<!--            />-->

            <RiskAreaTable
              :resource="false"
              :list-array-input="listArray"
              :categories-array="categoriesArray || []"
              :categories-selection="categoriesSelection"
              :predefined-link-array="predefinedLinkArray"
              :object-id="paramId"
              @reloadList="reloadList"
              @reloadListCategory="reloadListCategory"
              @changeTab="changeTab"
            >
            <template #bottom>
            <custom-pagination :pagination="pagination" @changePage="changePage" />
            </template>
          </RiskAreaTable>
          </v-container>
        </b-tab>
      </keep-alive>
      <keep-alive>
        <b-tab v-if="roleUser !== 'user'" :title="$t('tab.resources')" :active="this.$route.query.type === 'resource'">
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKey" />
          <v-container>
            <AddNewPopup
              :resource="true"
              :open-popup="checkAddNew"
              :form-title="$t('title.new_risk_element_resource')"
              :object-field="objectField"
              :object-item="newItem"
              :categories-array="categoriesArray"
              :categories-type="'risk'"
              :predefined-link-array="predefinedLinkArray"
              @closePopup="checkAddNew = !checkAddNew"
              @savePopup="save"
            />

<!--            <RiskAreaPopup-->
<!--              :open-popup="checkAddNew"-->
<!--              :resource="true"-->
<!--              :categories-array="categoriesArray"-->
<!--              :job-title-array="jobTitleArray"-->
<!--              :departments-array="departmentsArray"-->
<!--              :predefined-link-array="predefinedLinkArray"-->
<!--              :task-assignees-array="taskAssigneesArray"-->
<!--              :responsible-array="responsibleArray"-->
<!--              @closePopup="checkAddNew = !checkAddNew"-->
<!--              @reloadList="reloadList"-->
<!--              @reloadListCategory="reloadListCategory"-->
<!--            />-->

            <RiskAreaTable
              :resource="true"
              :list-array-input="templates"
              :categories-array="categoriesArray"
              :categories-selection="categoriesSelection"
              :predefined-link-array="predefinedLinkArray"
              :object-id="paramId"
              @reloadList="reloadList"
              @reloadListCategory="reloadListCategory"
              @changeTab="changeTab"
            >
            <template #bottom>
            <custom-pagination :pagination="pagination" @changePage="changePage" />
            </template>
          </RiskAreaTable>
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
  import RiskAreaTable from "../../../components/RiskAreaTable";
  import AddNewPopup from "../../../components/AddNewPopup";
  import customPagination from '../../../components/CustomPagination.vue';
  // import moment from 'moment';
  // import {downloadFile} from "../../../utils/downloadFile";
  // import axios from "axios";
  // import ConnectTo from "../../../components/ConnectTo";
  // import AttachmentPopup from "../../../components/AttachmentPopup";
  // import RiskAreaPopup from "@/components/RiskAreaPopup";
  // import RiskAreaTable from "./RiskAreaTable";
  // import AddNewPopup from "@/components/AddNewPopup";

  export default {
    components: {
      TitleCaption,
      // connect_to: ConnectTo,
      // AttachmentPopup,
      // RiskAreaPopup,
      RiskAreaTable,
      AddNewPopup,
      customPagination
    },

    data: () => ({
      hoverRiskPlanAccess: false,
      pageKey: 'company-risk-areas-risk-elements',
      pageKeyResource: 'company-routines-resources',
      userRoleId: parseInt(cookies.get('roleID')),
      userDepartmentID: parseInt(cookies.get('userDepartmentID')),
      checkAdmin: cookies.get('checkAdmin'),
      roleUser: cookies.get('roleUser'),
      pagination: {},
      permissionsUser: localStorage.getItem('permissionsKey'),
      planAccess: JSON.parse(localStorage.getItem('planAccess')),
      // search: '',
      valid: true,
      listArray: [],
      // taskAssigneesArray: [],
      // responsibleArray: [],
      // editedItem: {
      //   name: '',
      //   description: '',
      //   type: '',
      //   added_from: '',
      //   type_of_attachment: false,
      //   attachment: '',
      //   department_id: '',
      //   job_title_id: '',
      //   is_public: false,
      //   history: '',
      // },
      // defaultItem: {
      //   name: '',
      //   description: '',
      //   type: '',
      //   added_from: '',
      //   type_of_attachment: false,
      //   attachment: '',
      //   department_id: '',
      //   job_title_id: '',
      //   is_public: false,
      //   history: '',
      // },
      required: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else return true;
        }
      ],
      tabIndex: 0,
      checkAddNew: false,
      templates: [],
      // badge
      hoverResource: false,
      predefinedLinkArray: [],
      paramId: '',
      // category
      categoriesArray: [],
      categoriesSelection: [],
      categoriesDefault: {
        id: 0,
        name: "All"
      },
      // add new popup - list object fields
      objectField: [
        'name',
        'risk-element',
        'description',
        'category',
        'security',
        'connect-to',
        'image',
        'no-index',
      ],
      newItem: {
        is_template: false,
        name: "",
        type: 'risk',
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
        object_type: 'risk',
        is_shared: false,
        is_public: false,
        department_array: [],
        employee_array: [],
        // connect to object
        connectToArray: [],
        // object option
        show_in_risk_analysis: false,
        number_used_time: 0,
        // image
        image: [],
      },
      defaultItem: {
        is_template: false,
        name: "",
        type: 'risk',
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
        object_type: 'risk',
        is_shared: false,
        is_public: false,
        department_array: [],
        employee_array: [],
        // connect to object
        connectToArray: [],
        // object option
        show_in_risk_analysis: false,
        number_used_time: 0,
        // image
        image: [],
      },
      is_template: 0,
    }),

    computed: {},

    watch: {
      tabIndex(value) {
        this.is_template = value;
        this.fetchRiskData(1);
      }
    },

    created() {
      if (this.$route.query.id) {
        this.paramId = this.$route.query.id;
      }
    },

    mounted() {
      let that = this;
      that.$nextTick(() => {
        that.$nuxt.$loading.start();

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
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }
          // that.$toaster.error(that.$i18n.t('message.failed'));
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });

        // list Risk element source
        this.fetchRiskData(1);

        // list categories
        that.$store.dispatch('categoriesV2/index', {type: 'risk'}).then(result => {
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
          // that.$toaster.error(that.$i18n.t('message.failed'));
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      });
    },

    methods: {
      redirectUrl(){
        if (this.roleUser == 'company admin') {
              this.$router.push('/settings/billings/');
          }
      },
      changePage(page) {
       this.fetchRiskData(page)
      },
      fetchRiskData(page) {
        let that = this;
       let payload = {};
       payload.page = page;
       payload.is_template = that.is_template;
        that.$store.dispatch('objects/index', {objectType: 'risk', ...payload}).then(result => {
          that.listArray = _.filter(result.data, function (item) {
            return !item.is_template;
          });
          that.templates = _.filter(result.data, function (item) {
            return item.is_template;
          });
          that.pagination = result
            delete that.pagination.data
          that.$nuxt.$loading.finish();
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

      changeTab(value) {
        this.tabIndex = value;
      },

      close() {
        this.checkAddNew = false;
        this.reset();
      },

      reset() {
        this.$nuxt.$loading.finish();
        this.newItem = Object.assign({}, this.defaultItem);
      },

      reloadList(){
        let that = this;
        // get list
        that.$store.dispatch('objects/index', {objectType: 'risk'}).then(result => {
          that.listArray = _.filter(result.data, function (item) {
            return !item.is_template;
          });
          that.templates = _.filter(result.data, function (item) {
            return item.is_template;
          });
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_risk_element_view'));
          }
          that.$nuxt.$loading.finish();
        });
      },

      reloadListCategory(){
        let that = this;
        that.$store.dispatch('categoriesV2/index', {type: 'risk'}).then(result => {
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
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      },

      save(value) {
        let that = this;
        that.$nuxt.$loading.start();
        that.newItem = value.item;
        let tempItem = that.newItem;
        that.newItem.is_template = this.is_template;
        that.$store.dispatch('objects/store', that.newItem).then(result => {
          that.reloadList();
          that.reloadListCategory();
          if (tempItem.image && tempItem.image.length !== 0) {
            that.saveImage(tempItem.image, result.data.id);
          }
          that.$toaster.success(that.$i18n.t('message.success_risk_element_add_new'));
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_risk_element_add_new'));
          }
          that.$nuxt.$loading.finish();
        });
        that.close();
      },

      saveImage(file, objectId) {
        let that = this;
        that.$nuxt.$loading.start();
        let formData = new FormData();
        formData.append('file', file);
        formData.append('object_id', objectId);
        that.$store.dispatch('attachments/store', formData).then(function () {
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_attachment_add_new'));
          }
          that.$nuxt.$loading.finish();
        });
      },
    },
  };
</script>

<style scoped>

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

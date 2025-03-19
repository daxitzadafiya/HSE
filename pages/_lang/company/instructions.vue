<template>
  <div class="hse-page">
    <div @mouseenter="hoverInstructionPlanAccess = true" @mouseleave="hoverInstructionPlanAccess = false" style="width: fit-content">
    <v-badge v-if="!!planAccess?.lastPlanAccess?.instruction" :value="hoverInstructionPlanAccess" right
          transition="slide-x-transition" class=" hover-label hse--icon-question-circle badgee">
        <span slot="badge" @click="redirectUrl">{{ $t('message.accessible_module') }}</span> 
      </v-badge>
          <v-btn v-if="tabIndex === 0 ? (checkAdmin || permissionsUser.indexOf('instruction-basic') !== -1) : (checkAdmin || permissionsUser.indexOf('instruction-resource') !== -1)" class="mt-2 btn-create btn-custom-green"
            @click="checkAddNew = true" :disabled="!!planAccess?.lastPlanAccess?.instruction">
            {{ $t('button.add_new') }}
        </v-btn>
        </div>
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
        <b-tab :title="$t('tab.instructions')" :active="!this.$route.query.type">
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKey" />
          <v-container>
            <AddNewPopup
              :resource="false"
              :open-popup="checkAddNew"
              :form-title="$t('title.new_instruction')"
              :object-field="objectField"
              :object-item="newItem"
              :categories-array="categoriesArray"
              :categories-type="'instruction'"
              :predefined-link-array="predefinedLinkArray"
              @savePopup="save"
              @closePopup="checkAddNew = !checkAddNew"
            />

<!--            <InstructionPopup-->
<!--              :open-popup="checkAddNew"-->
<!--              :resource="false"-->
<!--              :instruction-item="editedItem"-->
<!--              :categories-array="categoriesArray"-->
<!--              :project-array="projectArray"-->
<!--              :job-title-array="jobTitleArray"-->
<!--              :departments-array="departmentsArray"-->
<!--              :employees-array="employeesArrayAddNew"-->
<!--              :predefined-link-array="predefinedLinkArray"-->
<!--              @closePopup="checkAddNew = !checkAddNew"-->
<!--              @reloadList="reloadList"-->
<!--              @reloadListCategory="reloadListCategory"-->
<!--            />-->

            <InstructionTable
              :resource="false"
              :list-array-input="listArray"
              :categories-array="categoriesArray"
              :categories-selection="categoriesSelection"
              :predefined-link-array="predefinedLinkArray"
              :object-id="paramId"
              @reloadList="reloadList"
              @reloadListCategory="reloadListCategory"
            />
          </v-container>
        </b-tab>
      </keep-alive>
      <keep-alive>
        <b-tab v-if="roleUser !== 'user'" :title="$t('tab.resources')" :active="this.$route.query.type === 'resource'">
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyResource" />
          <v-container>
            <AddNewPopup
              :resource="true"
              :open-popup="checkAddNew"
              :form-title="$t('title.new_instruction_resource')"
              :object-field="objectField"
              :object-item="newResourceItem"
              :categories-array="categoriesArray"
              :categories-type="'instruction'"
              :predefined-link-array="predefinedLinkArray"
              @savePopup="save"
              @closePopup="checkAddNew = !checkAddNew"
            />

<!--            <InstructionPopup-->
<!--              :open-popup="checkAddNew"-->
<!--              :resource="true"-->
<!--              :categories-array="categoriesArray"-->
<!--              :project-array="projectArray"-->
<!--              :job-title-array="jobTitleArray"-->
<!--              :departments-array="departmentsArray"-->
<!--              :predefined-link-array="predefinedLinkArray"-->
<!--              @closePopup="checkAddNew = !checkAddNew"-->
<!--              @reloadList="reloadList"-->
<!--              @reloadListCategory="reloadListCategory"-->
<!--              @changeTab="changeTab"-->
<!--            />-->

            <InstructionTable
              :resource="true"
              :list-array-input="templates"
              :categories-array="categoriesArray"
              :categories-selection="categoriesSelection"
              :predefined-link-array="predefinedLinkArray"
              :object-id="paramId"
              @reloadList="reloadList"
              @reloadListCategory="reloadListCategory"
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
  import InstructionTable from "../../../components/InstructionTable";
  // import InstructionPopup from "../../../components/InstructionPopup";
  import AddNewPopup from "../../../components/AddNewPopup";

  export default {
    components: {
      TitleCaption,
      InstructionTable,
      // InstructionPopup,
      AddNewPopup
    },

    data: () => ({
      hoverInstructionPlanAccess:false,
      pageKey: 'company-instructions-instructions',
      pageKeyResource: 'company-instructions-resources',
      userRoleId: parseInt(cookies.get('roleID')),
      // userDepartmentID: parseInt(cookies.get('userDepartmentID')),
      checkAdmin: cookies.get('checkAdmin'),
      roleUser: cookies.get('roleUser'),
      permissionsUser: localStorage.getItem('permissionsKey'),
      planAccess: JSON.parse(localStorage.getItem('planAccess')),
      checkAddNew: false,
      listArray: [],
      // activityArray: [],
      // dataDefault: {
      //   id: 0,
      //   first_name: "ALL",
      //   last_name: "",
      // },
      // employeesArray: [],
      // employeesArrayAddNew: [],
      // category: 0,
      categoriesArray: [],
      categoriesSelection: [],
      categoriesDefault: {
        id: 0,
        name: "All"
      },
      templates: [],
      tabIndex: 0,
      formDirty: false,
      // badge
      hoverResource: false,
      predefinedLinkArray: [],
      paramId: '',

      // add new popup - list object fields
      objectField: [
        'name',
        'description',
        'category',
        'security',
        'connect-to',
        'responsible',
        'activity',
      ],
      newItem: {
        is_template: false,
        name: "",
        type: 'instruction',
        description: "",
        category_id: '',
        is_suggestion: false,
        is_valid: true,
        status: 'new',
        // instruction activity
        activities: [],
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
        object_type: 'instruction',
        is_shared: false,
        is_public: false,
        department_array: [],
        employee_array: [],
      },
      defaultItem: {
        is_template: false,
        name: "",
        type: 'instruction',
        description: "",
        category_id: '',
        is_suggestion: false,
        is_valid: true,
        status: 'new',
        // instruction activity
        activities: [],
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
        object_type: 'instruction',
        is_shared: false,
        is_public: false,
        department_array: [],
        employee_array: [],
      },

      // resource
      newResourceItem: {
        is_template: true,
        name: "",
        type: 'instruction',
        description: "",
        category_id: '',
        is_suggestion: false,
        is_valid: true,
        status: 'new',
        // instruction activity
        activities: [],
      },
      defaultResourceItem: {
        is_template: true,
        name: "",
        type: 'instruction',
        description: "",
        category_id: '',
        is_suggestion: false,
        is_valid: true,
        status: 'new',
        // instruction activity
        activities: [],
      },
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
          // that.$toaster.error(that.$i18n.t('message.fail_statement_view'));
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });

        // list categories
        that.$store.dispatch('categoriesV2/index', {type: 'instruction'}).then(result => {
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
          that.$nuxt.$loading.finish();
        });

        // list employees
        // that.$store.dispatch('employees/index').then(result => {
        //   _.each(result.data, function(i) {
        //     if (i.department_name) {
        //       i.name = i.name + ' - ' + i.department_name;
        //     }
        //   });
        //   that.employeesArray = result.data;
        //   that.employeesArrayAddNew = _.clone(result.data);
        //   that.employeesArrayAddNew = _.filter(that.employeesArrayAddNew, function (item) {
        //     return item.disable_status === 0;
        //   });
        // }).catch((error) => {
          //   if (error.response.status == 401) {
          //   this.$router.push('/login');
          //   this.$toaster.error(this.$i18n.t('message.token_expired'));
          // }
        //   that.$nuxt.$loading.finish();
        // });

        // list instructions
        that.$store.dispatch('objects/index', {objectType: 'instruction'}).then(result => {
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
          that.$toaster.error(that.$i18n.t('message.fail_instruction_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      });
    },

    methods: {
      // openPopup() {
      //   this.checkAddNew = true;
      //   this.editedItem.check = false;
      // },

      // changeTab(value) {
      //   this.tabIndex = value;;
      // },

      redirectUrl(){
        if (this.roleUser == 'company admin') {
              this.$router.push('/settings/billings/');
          }
      },

      close() {
        this.checkAddNew = false;
        this.reset();
      },

      reset() {
        this.$nuxt.$loading.finish();
        this.newItem = Object.assign({}, this.defaultItem);
        this.newResourceItem = Object.assign({}, this.defaultResourceItem);

        // this.activityArray = [];
        // this.isShowInputActivity = false;
        // setTimeout(() => {
        //   this.editedItem = Object.assign({}, this.defaultItem);
        // this.editedIndex = -1;
        // this.$refs.form.reset();
        // this.$refs.form.resetValidation();
        // }, 0);
      },

      reloadList(){
        let that = this;
        // get list
        that.$store.dispatch('objects/index', {objectType: 'instruction'}).then(result => {
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
          that.$toaster.error(that.$i18n.t('message.fail_instruction_view'));
          }
          that.$nuxt.$loading.finish();
        });
      },

      reloadListCategory(){
        let that = this;
        that.$store.dispatch('categoriesV2/index', {type: 'instruction'}).then(result => {
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

      save(value) {
        let that = this;
        that.$nuxt.$loading.start();
        that.newItem = value.item;
        that.$store.dispatch('objects/store', that.newItem).then(function () {
          that.reloadList();
          that.reloadListCategory();
          that.$toaster.success(that.$i18n.t('message.success_instruction_add_new'));
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_instruction_add_new'));
          }
          that.$nuxt.$loading.finish();
        });
        that.close();
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

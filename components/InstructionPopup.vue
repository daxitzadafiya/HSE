<template>
  <div>
    <v-dialog v-model="openPopup" max-width="1300px" persistent>
      <v-card>
        <v-card-text>
          <div class="title-model">
            {{ formTitle }}
          </div>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <b-row
              v-if="editMode && checkResource && editedItem.count_related_object > 0
              && (editedItem.added_by !== 1 || (editedItem.added_by === 1 && checkSuperAdmin))"
              align-v="center"
              align-h="end"
              class="mt-0"
            >
              <b-col cols="5" class="pt-0">
                <v-btn
                  block
                  @click="dialogRelatedObjects = true"
                >
                  View associated objects
                </v-btn>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="12">
                <div class="input-wrap">
                  <v-text-field
                    v-model="editedItem.name"
                    :label="$t('form.name')"
                    :rules="required"
                    outlined
                    :readonly="!editedItem.editPermission"
                  />
                </div>
              </b-col>
            </b-row>
            <b-row v-if="checkSuperAdmin">
              <b-col cols="12">
                <div class="input-wrap industry-select-input-wrap">
                  <MultipleSelection
                    :selected-items-input="editedItem.industry_id_arr"
                    :label="$t('form.industry')"
                    :item-text="'name'"
                    :item-value="'id'"
                    :list-option-input="industryArray"
                    :request-required="true"
                    @getSelectedItems="getSelectedIndustryItems"
                  />
                </div>
              </b-col>
            </b-row>
            <category
              :category-item="editedItem"
              :categories-array="categoriesValidArray"
              :type-category="category_instruction"
              :is-open-popup="openPopup"
              @getNewCategory="getNewCategory"
            />
            <b-row class="section-description">
              <b-col>
<!--                <v-icon class="icon-question">far fa-question-circle</v-icon>-->
                <div class="input-wrap form-description">
<!--                  <vue-editor-->
<!--                    v-model="editedItem.description"-->
<!--                    :disabled="!editedItem.editPermission"-->
<!--                  />-->
                  <FroalaSuggestionListEditor
                    :item="editedItem"
                    :predefined-link-array="predefinedLinkArray"
                  />
                </div>
              </b-col>
            </b-row>
<!--            <connect_to-->
<!--              v-if="userRoleId > 1 && checkShowConnectTo"-->
<!--              :edited-item="editedItem"-->
<!--              :departments-array="departmentsArray"-->
<!--              :job-title-array="jobTitleArray"-->
<!--              :deny-edit="!editedItem.editPermission"-->
<!--              :project-array="projectArray"-->
<!--              @updateConnect="checkUpdateConnect"-->
<!--            />-->
            <activities_table
              :item-i-d="editedItem.id"
              :instruction-item="editedItem"
              :activity-array-input="activityArray"
              :employee-array="editMode ? instructionEmployeesArray : employeesArray"
              :departments-array="departmentsArray"
              :resource="checkResource"
              :edited-index="editedIndex"
              :edit-mode="editMode"
              @getActivityArray="getActivityArray"
            />
            <Security
              v-if="!checkSuperAdmin && checkShowConnectTo"
              :security-item="editedItem"
              :edit-mode="editMode"
              class="mt-5"
              @changeSecurity="changeSecurity"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <div class="input-wrap switch-component question-mark-block">
            <label class="left-text">{{ $t('button.index') }}</label>
            <v-switch
              v-model="editedItem.is_suggestion"
              :disabled="!checkAdmin || !editedItem.is_public"
              inset
              class="right-text"
            />
            <v-badge
              :value="hoverQuestionMark"
              right
              transition="slide-x-transition"
              class="hse--icon-question-circle"
              :content="$t('message.hover_index')"
            >
              <v-hover v-model="hoverQuestionMark">
                <i class="fa fa-question-circle"></i>
              </v-hover>
            </v-badge>
          </div>
          <v-spacer />
          <v-btn v-if="roleUser !== 'user'" class="btn-cancel" text @click="close">
            {{ $t('button.cancel') }}
          </v-btn>
          <v-btn v-else class="btn-cancel" text @click="close">
            OK
          </v-btn>
          <v-btn
            v-if="editMode && checkResource
            && (checkAdmin || permissionsUser.indexOf('instruction-resource') > -1)
            && editedItem.editPermission"
            class="btn-save"
            @click="applyTemplate"
          >
            {{ $t('button.apply') }}
          </v-btn>
          <v-btn
            v-if="!editMode && checkResource
            && (checkAdmin || permissionsUser.indexOf('instruction-resource') > -1)
            && editedItem.editPermission"
            class="hse-btn-save"
            @click="saveAndApply"
          >
            {{ $t('button.save_and_apply') }}
          </v-btn>
<!--          <v-btn v-if="(checkSuperAdmin || ((!editMode && checkResource && (checkAdmin || permissionsUser.indexOf('instruction-resource') > -1)) || (!checkResource && (checkAdmin || permissionsUser.indexOf('instruction-basic') > -1)))) && editedItem.editPermission"-->
<!--                 class="btn-save"-->
<!--                 @click="save"-->
<!--          >-->
<!--            {{ $t('button.save') }}-->
<!--          </v-btn>-->
          <v-btn
            v-if="checkSuperAdmin
            || (checkResource && (checkAdmin || permissionsUser.indexOf('instruction-resource') > -1) && !(editMode && editedItem.added_by === 1))
            || (!checkResource && (checkAdmin || permissionsUser.indexOf('instruction-basic') > -1) && !(permissionsUser.indexOf('instruction-basic') > -1 && editMode && editedItem.updated_by !== null))
            && editedItem.editPermission"
            class="btn-save"
            @click="save"
          >
            {{ $t('button.save') }}
          </v-btn>
<!--          v-if="editMode && (userRoleId === 1 || ((checkResource && (checkAdmin || permissionsUser.indexOf('instruction-resource') > -1)) || (!checkResource && (checkAdmin || permissionsUser.indexOf('instruction-basic') > -1))))"-->
          <v-btn
            v-if="editMode
            && ((checkResource && ((!editedItem.company_id && checkSuperAdmin) || (editedItem.company_id && (checkAdmin || permissionsUser.indexOf('instruction-resource') > -1))))
            || (!checkResource && (checkAdmin || permissionsUser.indexOf('instruction-basic') > -1)) && !(permissionsUser.indexOf('instruction-basic') > -1 && editedItem.updated_by !== null))
            && editedItem.editPermission"
            class="hse-btn-delete"
            text
            @click="dialogDelete = true"
          >
            <v-icon dark>
              mdi-delete
            </v-icon>
          </v-btn>
        </v-card-actions>
<!--        <v-card-actions v-if="editMode">-->
<!--          <v-spacer />-->
<!--          <v-btn class="btn-cancel" text @click="checkDirtyBeforeClose">-->
<!--            Cancel-->
<!--          </v-btn>-->
<!--          <v-btn-->
<!--            v-if="checkResource && (checkAdmin || permissionsUser.indexOf('instruction-resource') > -1)"-->
<!--            class="btn-save"-->
<!--            @click="checkConfirmApply"-->
<!--          >-->
<!--            Apply-->
<!--          </v-btn>-->
<!--          <v-btn-->
<!--            v-if="!isClosed && !checkResource && !viewOnly && (checkAdmin || permissionsUser.indexOf('instruction-basic') > -1)"-->
<!--            class="btn-save"-->
<!--            @click="save"-->
<!--          >-->
<!--            Save-->
<!--          </v-btn>-->
<!--          <v-btn v-if="editedIndex > -1" :disabled="permissionsUser.indexOf('destroy-instruction') === -1" class="hse-btn-delete" text @click="dialogDelete = true">-->
<!--            <v-icon dark>-->
<!--              mdi-delete-->
<!--            </v-icon>-->
<!--          </v-btn>-->
<!--        </v-card-actions>-->
<!--        <v-card-actions v-else>-->
<!--          <v-spacer />-->
<!--          <v-btn class="btn-cancel" text @click="checkDirtyBeforeClose">-->
<!--            Cancel-->
<!--          </v-btn>-->
<!--          <v-btn v-if="checkResource && (checkAdmin || permissionsUser.indexOf('instruction-resource') > -1)" class="btn-save" @click="saveAndApply">-->
<!--            Save and apply-->
<!--          </v-btn>-->
<!--          <v-btn v-if="checkResource && (checkAdmin || permissionsUser.indexOf('instruction-resource') > -1)" class="hse-btn-save" text @click="save">-->
<!--            Save-->
<!--          </v-btn>-->
<!--          <v-btn v-if="!checkResource && (checkAdmin || permissionsUser.indexOf('instruction-basic') > -1)" class="btn-save" text @click="save">-->
<!--            Save-->
<!--          </v-btn>-->
<!--          <v-btn v-if="editedIndex > -1 && editedItem.added_by > 1" :disabled="permissionsUser.indexOf('destroy-instruction') === -1" class="hse-btn-delete" text @click="dialogDelete = true">-->
<!--            <v-icon dark>-->
<!--              mdi-delete-->
<!--            </v-icon>-->
<!--          </v-btn>-->
<!--        </v-card-actions>-->
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card class="dialog-delete">
        <v-card-text>
          <div class="text-center confirm-delete-title">
            {{ $t('title.confirm_delete') }}
          </div>
          <div class="confirm-delete-text">
            {{ $t('message.are_you_sure_you_want_to_delete_this_item') }}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="btn-cancel" text @click="closeDelete">
            {{ $t('button.no') }}
          </v-btn>
          <v-btn class="btn-save" @click="deleteItem(editedItem)">
            {{ $t('button.yes') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogApply" max-width="500px">
      <v-card class="dialog-delete">
        <v-card-text>
          <div class="text-center confirm-delete-title">
            {{ $t('title.apply_success') }}
          </div>
          <div class="confirm-delete-text">
            <p>Your instruction has successfully been applied to your active instructions.</p>
            <p class="text-center">
              <v-btn class="btn-default" text @click="showItem(editedItem)">
                Click here to review instruction
              </v-btn>
            </p>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="btn-cancel" text @click="closeApply">
            {{ $t('button.cancel') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogConfirmApply" max-width="500px">
      <v-card class="dialog-delete">
        <v-card-text>
          <div class="text-center confirm-delete-title">
            {{ $t('title.confirm_modal') }}
          </div>
          <div class="confirm-delete-text">
            <p> Do you want to save the updates before applying the template?</p>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="btn-cancel" text @click="updateAndApply">
            {{ $t('button.yes') }}
          </v-btn>

          <v-btn class="btn-cancel" text @click="applyTemplate">
            {{ $t('button.no') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogConfirmClose" max-width="500px">
      <v-card class="dialog-delete">
        <v-card-text>
          <div class="text-center confirm-delete-title">
            {{ $t('title.confirm_modal') }}
          </div>
          <div class="confirm-delete-text">
            {{ $t('message.do_you_want_to_cancel_without_saving') }}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="btn-cancel" text @click="close">
            {{ $t('button.yes') }}
          </v-btn>

          <v-btn class="btn-cancel" text @click="dialogConfirmClose = false">
            {{ $t('button.no') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogRelatedObjects" max-width="700px">
      <v-card class="dialog-delete">
        <v-card-text>
          <div class="text-center confirm-delete-title">
            Associated objects
          </div>
          <v-list-item
            v-for="(item, index) in editedItem.related_objects" :key="index"
            two-line
          >
            <v-list-item-content>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
              <v-list-item-subtitle>
                <span class="mr-3">ID: {{ item.id }}</span>
                <span class="mr-3">Added by: {{ item.added_by_first_name }} {{ item.added_by_last_name }}</span>
                <span v-if="checkSuperAdmin">Company: {{ item.company_name }}</span>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="btn-cancel" text @click="dialogRelatedObjects = false">
            CLOSE
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import {_} from 'vue-underscore';
  // import ConnectTo from "./ConnectTo";
  import ActivitiesTable from "./ActivitiesTable";
  import Category from "./Category";
  import cookies from "js-cookie";
  import MultipleSelection from "./MultipleSelection";
  import Security from "./Security";
  import FroalaSuggestionListEditor from "./FroalaSuggestionListEditor";

  export default {
    name: "InstructionPopup",
    components: {
      // connect_to: ConnectTo,
      activities_table: ActivitiesTable,
      category: Category,
      MultipleSelection,
      Security,
      FroalaSuggestionListEditor,
    },
    props: {
      resource: {
        type: Boolean,
        required: false,
      },
      instructionItem: {
        type: Object,
        required: false,
      },
      openPopup: Boolean,
      industryArray: {
        type: Array,
        required: false,
      },
      projectArray: {
        type: Array,
        required: false,
      },
      jobTitleArray: {
        type: Array,
        required: false,
      },
      departmentsArray: {
        type: Array,
        required: false,
      },
      categoriesArray: {
        type: Array,
        required: false,
      },
      viewOnly: {
        type: Boolean,
        required: false,
      },
      employeesArray: {
        type: Array,
        required: false,
      },
      predefinedLinkArray: {
        type: Array,
        required: false,
      },
    },
    data: () => ({
      // pageKey: 'company-instructions-instructions',
      // pageKeyResource: 'company-instructions-resources',
      userRoleId: parseInt(cookies.get('roleID')),
      userDepartmentID: parseInt(cookies.get('userDepartmentID')),
      permissionsUser: localStorage.getItem('permissionsKey'),
      checkAdmin: cookies.get('checkAdmin'),
      checkSuperAdmin: cookies.get('checkSuperAdmin'),
      roleUser: cookies.get('roleUser'),
      valid: true,
      date: [],
      menu: false,
      listArray: [],
      editedIndex: -1,
      editedItem: {
        name: '',
        category_id: "",
        department_id: "",
        project_id: "",
        job_title_id: '',
        description: "",
        is_template: false,
        parent_id: '',
        count_related_object: 0,
        related_objects: [],
        industry_id: '',
        industry_id_arr: [],
        editPermission: true,
        is_suggestion: false,
        // table Security
        object_type: 'instruction',
        is_shared: false,
        is_public: false,
        department_array: [],
        employee_array: [],
      },
      defaultItem: {
        name: '',
        category_id: "",
        department_id: "",
        project_id: "",
        job_title_id: '',
        description: "",
        is_template: false,
        parent_id: '',
        count_related_object: 0,
        related_objects: [],
        industry_id: '',
        industry_id_arr: [],
        editPermission: true,
        is_suggestion: false,
        // table Security
        object_type: 'instruction',
        is_shared: false,
        is_public: false,
        department_array: [],
        employee_array: [],
      },
      // read data
      required: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else return true;
        }
      ],
      // usersArray: [],
      // usersSelection: [],
      templates: [],
      // connectCompany: false,
      // connectDepartment: false,
      // connectProject: false,
      // connectJobTitle: false,
      tabIndex: 0,
      dialogDelete: false,
      dialogApply: false,
      dialogConfirmApply: false,
      formDirty: false,
      dialogConfirmClose: false,
      opens: 'right',
      singleDatePicker: false,
      timePicker: false,
      timePicker24Hour: true,
      showWeekNumbers: false,
      showDropdowns: "",
      autoApply: false,
      dateTest: new Date(),
      dateRange: {
        startDate: false,
        endDate: false
      },
      linkedCalendars: "",
      alwaysShowCalendars: '',
      category_instruction: 2, // category type: instruction
      checkResource: false,
      checkShowConnectTo: true,
      isClosed: false,
      formTitle: '',
      editMode: true,
      newActivity: {
        id: "",
        activity: '',
        employee: '',
        department: '',
      },
      defaultActivity: {
        id: "",
        activity: '',
        employee: '',
        department: '',
      },
      activityArray: [],
      activityArrayOutput: [],
      categoriesValidArray: [],
      dialogRelatedObjects: false,
      instructionEmployeesArray: [],
      hoverQuestionMark: false,
    }),

    computed: {},

    watch: {
      openPopup(value) {
        if (value) {
          if (this.instructionItem) {
            if (this.instructionItem.check) {
              let categoryId = this.instructionItem.category_id;
              this.categoriesValidArray = _.filter(this.categoriesArray, function (item) {
                return (!item.disable_status || (item.disable_status && item.id === categoryId));
              });
              this.editItem(this.instructionItem);
            } else {
              this.categoriesValidArray = _.filter(this.categoriesArray, function (item) {
                return !item.disable_status;
              });
              this.addNew();
            }
          } else {
            this.categoriesValidArray = _.filter(this.categoriesArray, function (item) {
              return !item.disable_status;
            });
            this.addNew();
          }
        }
      },

      resource(value) {
        if (value) {
          this.checkResource = value;
        }
      },
    },

    mounted() {
      // let that = this;
      // that.$store.dispatch('employees/index', {department: that.editedItem.department_id, job_title: that.editedItem.job_title_id, project: that.editedItem.project_id}).then(result => {
      //   that.usersArray = result.data;
      // }).catch((error) => {
      //   that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
      //   that.$nuxt.$loading.finish();
      // });
    },

    created() {
      if (this.openPopup) {
        if (this.instructionItem) {
          this.editItem(this.instructionItem);
        } else {
          this.addNew();
        }
      }

      if (this.resource) {
        this.checkResource = this.resource;
      }
    },

    methods: {
      changeSecurity(val) {
        if (val !== 'all') {
          this.editedItem.is_suggestion = false;
        }
      },

      getNewCategory(value) {
        this.editedItem.category_id = value.newCategoryId;
      },

      addNew() {
        this.reset();
        let defaultCategory = _.findWhere(this.categoriesValidArray, {is_primary: 1});
        if (defaultCategory) {
          this.editedItem.category_id = defaultCategory.id;
        }
        if (this.checkResource) {
          this.formTitle = this.$i18n.t('title.new_instruction_resource');
        } else {
          this.formTitle = this.$i18n.t('title.new_instruction');
        }
        this.checkShowConnectTo = !this.checkResource;
        this.editMode = false;
        // this.connectDepartment = false;
        // this.connectProject = false;
        // this.connectJobTitle = false;
      },

      formatNullArray(item) {
        if (item === null) {
          item = [];
        }
        return item;
      },

      formatFromStringToArray(data) {
        let result;
        if (data) {
          result = data.split(',');
          result = _.map(result, function (item) {
            return parseInt(item);
          });
        } else {
          result = data;
        }
        return result;
      },

      editItem(item) {
        let that = this;
        that.formDirty = false;
        that.$nuxt.$loading.start();
        that.formTitle = that.$i18n.t('title.edit_instruction');
        that.$store.dispatch('instructions/show', item.id).then(result => {
          that.editedItem = Object.assign({}, result.data);
          if (that.checkSuperAdmin) {
            that.editedItem.industry_id_arr = that.formatNullArray(that.formatFromStringToArray(that.editedItem.industry_id));
          }
          if (that.editedItem.department_array === null) {
            that.editedItem.department_array = [];
          } else {
            that.editedItem.department_array = JSON.parse(that.editedItem.department_array);
          }
          if (that.editedItem.employee_array === null) {
            that.editedItem.employee_array = [];
          } else {
            that.editedItem.employee_array = JSON.parse(that.editedItem.employee_array);
          }
          that.activityArray = [];
          _.each(that.editedItem.instruction_activities, function (activity) {
              that.newActivity.id = activity.id;
              that.newActivity.activity = activity.activity;
              that.instructionEmployeesArray = _.clone(that.employeesArray);
              if (activity.assigned_employee) {
                that.newActivity.employee = JSON.parse(activity.assigned_employee);
              } else {
                that.newActivity.employee = [];
              }
              that.instructionEmployeesArray = _.filter(that.instructionEmployeesArray, function(employee){
                return (!employee.disable_status
                  || (employee.disable_status && _.indexOf(activity.assigned_employee, employee.id) > -1));
              });

              if (activity.assigned_department) {
                that.newActivity.department = JSON.parse(activity.assigned_department);
              } else {
                that.newActivity.department = [];
              }

              that.activityArray.push(that.newActivity);

              that.newActivity = _.clone(that.defaultActivity);
            });
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_instruction_view_detail'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });

        that.originData = _.clone(that.editedItem);

        // that.connectDepartment = !!that.editedItem.department_id;
        // that.connectProject = !!that.editedItem.project_id;
        // that.connectJobTitle = !!that.editedItem.job_title_id;
      },

      getActivityArray(value) {
        this.activityArrayOutput = value.activityArray;
        this.formDirty = value.formDirty;
      },

      // checkUpdateConnect(value) {
        // this.connectCompany = value.connectCompany;
        // this.connectDepartment = value.connectDepartment;
        // this.connectJobTitle = value.connectJobTitle;
        // this.connectProject = value.connectProject;
        // this.editedItem = value.editedItem;
        // this.filterEmployees();
        // if (!this.connectDepartment) {
        //   this.editedItem.department_id = '';
        // }
        // if (!this.connectJobTitle) {
        //   this.editedItem.job_title_id = '';
        // }
        // if (!this.connectProject) {
        //   this.editedItem.project_id = '';
        // }
      // },

      // filterEmployees() {
      //   var that = this;
      //   if (!that.connectDepartment) {
      //     that.editedItem.department_id = '';
      //   }
      //   if (!that.connectJobTitle) {
      //     that.editedItem.job_title_id = '';
      //   }
      //   if (!that.connectProject) {
      //     that.editedItem.project_id = '';
      //   }
      //   that.$store.dispatch('employees/index', {department: that.editedItem.department_id, job_title: that.editedItem.job_title_id, project: that.editedItem.project_id}).then(result => {
      //     that.usersArray = result.data;
      //     // _.each(that.activityArray, function (active) {
      //     //   if (active.assignee) {
      //     //     active.assignee = '';
      //     //   }
      //     // });
      //   }).catch((error) => {
      //     that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
      //     that.$nuxt.$loading.finish();
      //   });
      // },

      checkDirtyBeforeClose(){
        if(this.checkDirtyForm()){
          this.dialogConfirmClose = true;
        }else{
          this.close();
        }
      },

      checkDirtyForm(){
        let that = this;
        let result = false;
        _.each(that.editedItem, function(value, key, obj) {
          if(that.originData && obj[key] && that.originData[key] && obj[key] !== that.originData[key]){
            result = true;
          }
        });
        return result;
      },

      // checkConfirmApply(){
      //   let that = this;
      //   _.each(that.editedItem, function(value, key, obj) {
      //     if(obj[key] !== that.originData[key]){
      //       that.formDirty = true;
      //     }
      //   });
      //   if(that.formDirty && that.editedItem.added_by > 1){
      //     that.dialogConfirmApply = true;
      //   } else{
      //     that.applyTemplate();
      //   }
      // },

      close() {
        this.reset();
        this.dialogConfirmClose = false;
        this.formDirty = false;
        this.$emit('closePopup');
        this.reloadListCategory();
      },

      reset() {
        this.denyEdit = false;
        this.isClosed = false;
        this.activityArray = [];
        this.$nuxt.$loading.finish();
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          // this.$refs.form.reset();
          this.$refs.form.resetValidation();
          // this.filterEmployees();
        }, 300);
      },

      save() {
        let that = this;
        if (that.$refs.form.validate()) {
          that.$nuxt.$loading.start();
          if (that.checkSuperAdmin) {
            that.editedItem.is_shared = true;
            that.editedItem.is_public = true;
            that.editedItem.industry_id = that.editedItem.industry_id_arr.toString();
          }
          that.editedItem.activities = that.activityArrayOutput;
          if (that.editMode) {
            // edit
            that.$store.dispatch('instructions/update', that.editedItem).then(function() {
              that.reloadList();
              that.reloadListCategory();
              that.$toaster.success(that.$i18n.t('message.success_instruction_update'));
            }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_instruction_update'));
              }
              // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
              that.$nuxt.$loading.finish();
            });
          } else {
            // create instruction
            if (that.checkResource) {
              that.editedItem.is_template = true;
            }
            that.$store.dispatch('instructions/store', that.editedItem).then(function() {
              that.reloadList();
              that.reloadListCategory();
              that.editedItem = that.defaultItem;
              that.$toaster.success(that.$i18n.t('message.success_instruction_add_new'));
            }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_instruction_add_new'));
              }
              // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
              that.$nuxt.$loading.finish();
            });
          }
          that.close();
        }
      },

      reloadList(){
        this.$emit('reloadList');
      },

      reloadListCategory(){
        this.$emit('reloadListCategory');
      },

      checkDenyEdit() {
        if (this.editedItem.status === this.statusClosed) {
          this.denyEdit = true;
          this.isClosed = true;
        } else {
          this.denyEdit = !(this.editedItem.status === this.statusNew || (this.denyEdit && this.editedItem.requestEdit));
        }
      },

      // dialog DELETE
      closeDelete() {
        this.dialogDelete = false;
      },

      closeApply(){
        this.dialogApply = false;
      },

      deleteItem(item) {
        this.deleteInstruction(item);
        this.dialogDelete = false;
        this.close();
      },

      deleteInstruction(item) {
        let that = this;
        that.$store.dispatch('instructions/delete', item.id).then(function() {
          that.reloadList();
          that.$toaster.success(that.$i18n.t('message.success_instruction_delete'));
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_instruction_delete'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      },

      applyTemplate() {
        let that = this;
        if (that.$refs.form.validate()) {
          that.$nuxt.$loading.start();
          that.editedItem.status = "New";
          that.editedItem.is_template = false;
          that.editedItem.activities = that.activityArrayOutput;
          if (!that.editedItem.parent_id) {
            that.editedItem.parent_id = that.editedItem.id;
          }
          that.$store.dispatch('instructions/store', that.editedItem).then(function(result){
            // that.listArray.push(result.data);
            that.editedItem = result.data;
            that.checkResource = false;
            // that.dialogConfirmApply = false;
            // that.dialogApply = true;
            that.activityArray = [];
            that.reloadList();
            that.changeTab(0);
            that.$toaster.success(that.$i18n.t('message.success_instruction_add_new'));
            // that.$nuxt.$loading.finish();
          }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_instruction_add_new'));
            }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish();
          });
          that.close();
        }
      },

      saveAndApply(){
        // create template
        let that = this;
        if (that.$refs.form.validate()) {
          that.$nuxt.$loading.start();
          that.editedItem.status = "New";
          that.editedItem.is_template = true;
          that.editedItem.activities = that.activityArrayOutput;
          that.$store.dispatch('instructions/store', that.editedItem).then(result => {
            that.editedItem.parent_id = result.data.id;
            that.applyTemplate();
          }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_instruction_add_new'));
            }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish();
          });
        }
      },

      updateAndApply(){
        let that = this;
        if (that.$refs.form.validate()) {
          that.dialogConfirmApply = false;
          that.$nuxt.$loading.start();
          that.editedItem.status = "New";
          that.editedItem.is_template = true;
          that.editedItem.activities = that.activityArrayOutput;
          that.$store.dispatch('instructions/update', that.editedItem).then(result => {
            that.editedItem.parent_id = result.data.id;
            that.applyTemplate();
          }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_instruction_update'));
            }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish();
          });
        }
      },

      changeTab(value) {
        this.$emit('changeTab', value);
      },

      showItem(item) {
        this.dialogApply = false;
        // this.resource = false;
        // this.$emit('showItem', item);
        this.$emit('changeTab', {
          tabIndex: 0,
          item: item,
        });
      },

      getSelectedItems(value) {
        this.selectedItems = value.selectedItemsOutput;
      },

      // ADMIN - choose industry
      getSelectedIndustryItems(value) {
        this.editedItem.industry_id_arr = value.selectedItemsOutput;
      },
    },
  };
</script>

<style scoped>

</style>

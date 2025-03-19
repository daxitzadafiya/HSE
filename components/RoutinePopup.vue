<template>
  <div>
    <v-dialog v-model="openPopup" max-width="1125px" persistent>
      <v-card>
        <v-card-text>
          <div class="popup-header text-center">
            {{ formTitle }}
          </div>
          <v-form ref="form" v-model="valid" lazy-validation>
            <b-row
              v-if="
                editMode &&
                checkResource &&
                editedItem.count_related_object > 0 &&
                (editedItem.added_by !== 1 ||
                  (editedItem.added_by === 1 && checkSuperAdmin))
              "
              align-v="center"
              align-h="end"
              class="mt-0"
            >
              <b-col cols="5" class="pt-0">
                <v-btn block @click="dialogRelatedObjects = true">
                  View associated objects
                </v-btn>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="7">
                <div class="input-wrap">
                  <v-text-field
                    v-model="editedItem.name"
                    :label="$t('form.name')"
                    name="name"
                    :rules="required"
                    outlined
                    :readonly="!editedItem.editPermission"
                  />
                </div>
              </b-col>
              <b-col cols="5" class="d-flex pl-16 justify-content-end">
                <div class="bold-title md-line-height">
                  {{ $t('form.recurring') }}
                </div>
                <v-badge
                  :value="hoverRecurring"
                  right
                  transition="slide-x-transition"
                  class="hse-badge-icon"
                >
                  <span slot="badge">{{ $t('message.hover_recurring') }}</span>
                  <v-hover v-model="hoverRecurring">
                    <i class="fa fa-question-circle"></i>
                  </v-hover>
                </v-badge>
                <div class="input-wrap">
                  <div
                    class="switch-component document-type-wrap default-question-mark"
                  >
                    <label class="left-text">{{ $t('form.reminder') }}</label>
                    <v-switch
                      v-model="is_recurring"
                      :label="$t('form.task')"
                      inset
                      class="right-text ml-7"
                      :readonly="!editedItem.editPermission || editMode"
                      :disabled="!!planAccess?.lastPlanAccess?.task || ! planAccess?.planAccess?.task"
                    />

                    <v-hover v-model="hoverTaskPlanAccess">
                      <v-badge
                          :value="hoverTaskPlanAccess" v-if="!!planAccess?.lastPlanAccess?.task || ! planAccess?.planAccess?.task"
                          left
                          transition="slide-x-transition"
                          class="hse--icon-question-circle"
                          style="cursor: pointer;">
                          <span slot="badge" @click="redirectUrl">{{ $t('message.accessible_module') }}</span>
                            <i class="fa fa-question-circle"></i>
                        </v-badge>
                    </v-hover>
                  </div>
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
              :type-category="category_routine"
              :is-open-popup="openPopup"
              @getNewCategory="getNewCategory"
            />
            <b-row class="section-description">
              <b-col>
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
            <!-- <b-row v-if="!checkSuperAdmin && checkShowConnectTo" class="mb-4">
              <b-col cols="6">
                <ResponsiblePerson
                  :object-item="editedItem"
                  :responsible-array="responsibleArray"
                /> -->
            <!--                <div class="input-wrap industry-select-input-wrap">-->
            <!--                  <v-select-->
            <!--                    v-model="editedItem.responsible_id"-->
            <!--                    :label="$t('form.responsible')"-->
            <!--                    :items="responsibleArray"-->
            <!--                    item-text="name"-->
            <!--                    item-value="id"-->
            <!--                    :rules="required"-->
            <!--                    outlined-->
            <!--                    :readonly="!editedItem.editPermission"-->
            <!--                  />-->
            <!--                </div>-->
            <!-- </b-col> -->
            <!--              <b-col cols="6">-->
            <!--                <datepicker_radio :data="editedItem" :is-routine="true" />-->
            <!--              </b-col>-->
            <!-- </b-row> -->
            <connect-to-object
                    class="mt-2"
                    :isEmptyData="openPopup"
                    :connectToArrayInput="connectToArray"
                    @getConnectToArray="getConnectToArray"
            />
            <Responsible
              v-if="!checkSuperAdmin && !checkResource"
              :object-item="editedItem"
              :edit-mode="false"
              :newRequire="true"
              :is_document="true"
              class="cto-department"
            />
              <!-- :is_custom="false" -->
            <Attendee
              v-if="!checkSuperAdmin && !checkResource"
              :object-item="editedItem"
              :newRequire="true"
              :edit-mode="false"
              :is_document="true"
            />

            <!--            <connect_to-->
            <!--              v-if="!checkSuperAdmin && checkShowConnectTo"-->
            <!--              :edited-item="editedItem"-->
            <!--              :departments-array="departmentsArray"-->
            <!--              :job-title-array="jobTitleArray"-->
            <!--              :project-array="projectArray"-->
            <!--              :deny-edit="!editedItem.editPermission"-->
            <!--              @updateConnect="checkUpdateConnect"-->
            <!--            />-->
            <!--            <b-row v-if="!checkSuperAdmin && checkShowConnectTo">-->
            <!--              <b-col cols="6">-->
            <!--                <div class="input-wrap industry-select-input-wrap">-->
            <!--                  <MultipleSelection-->
            <!--                    :item="editedItem"-->
            <!--                    :selected-items-input="editedItem.attending_emps"-->
            <!--                    :label="$t('form.attendees_employee')"-->
            <!--                    :item-text="'name'"-->
            <!--                    :item-value="'id'"-->
            <!--                    :list-option-input="editMode ? routineAttendingEmployees : attendingEmployees"-->
            <!--                    :disabled="attendingEmployees.length <= 0"-->
            <!--                    @getSelectedItems="getSelectedAttendingItems"-->
            <!--                  />-->
            <!--                </div>-->
            <!--              </b-col>-->
            <!--              <b-col cols="6">-->
            <!--                <div class="input-wrap industry-select-input-wrap">-->
            <!--                  <MultipleSelection-->
            <!--                    :item="editedItem"-->
            <!--                    :selected-items-input="editedItem.attending_contact"-->
            <!--                    :label="$t('form.attendees_contact')"-->
            <!--                    :item-text="'name'"-->
            <!--                    :item-value="'id'"-->
            <!--                    :list-option-input="contactsArray"-->
            <!--                    @getSelectedItems="getSelectedAttendingContactItems"-->
            <!--                  />-->
            <!--                </div>-->
            <!--              </b-col>-->
            <!--            </b-row>-->
            <Security
              v-if="!checkSuperAdmin && checkShowConnectTo"
              :security-item="editedItem"
              :edit-mode="false"
              :is-instruction-object="true"
              @changeSecurity="changeSecurity"
            />
            <!-- <StartDate
              v-if="!checkSuperAdmin && !checkResource"
              :object-item="editedItem"
              :edit-mode="false"
              class="mb-4"
              @changeDate="changeStartDate"
            /> -->

            <Activation
              v-model="selectedUnit"
              v-if="!checkSuperAdmin && !checkResource"
              :object-item="editedItem"
              :edit-mode="false"
              :unitValue="unitValue"
              :duration-data="durationData"
              :units="units"
            />

            <!-- Deadline -->
            <!-- <Reminder
              v-if="!checkSuperAdmin && checkShowConnectTo"
              :reminder-item="editedItem"
              :edit-mode="editMode"
              :is-routine="true"
              class="mb-4"
            /> -->
            <RoutineAttending
              v-if="!checkSuperAdmin && checkShowConnectTo"
              :routine-attending-item="editedItem"
              :contacts-array="contactsArray"
              :edit-mode="false"
            />
          </v-form>
        </v-card-text>
        <v-card-actions class="popup-footer">
          <!-- <div class="input-wrap switch-component question-mark-block">
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
          </div> -->
          <v-spacer />
          <v-btn
            v-if="roleUser !== 'user'"
            class="btn-cancel"
            text
            @click="close"
          >
            {{ $t('button.cancel') }}
          </v-btn>
          <v-btn v-else class="btn-cancel" text @click="close"> OK </v-btn>
          <v-btn
            v-if="
              editMode &&
              checkResource &&
              (checkAdmin || permissionsUser.indexOf('routine-resource') > -1)
            "
            class="btn-save"
            @click="applyTemplate"
          >
            {{ $t('button.apply') }}
          </v-btn>
          <!-- <v-btn
            v-if="!editMode && checkResource
            && (checkAdmin || permissionsUser.indexOf('routine-resource') > -1)
            && editedItem.editPermission"
            class="hse-btn-save"
            @click="saveAndApply"
          >
            {{ $t('button.save_and_apply') }}
          </v-btn> -->
          <!--          <v-btn v-if="(checkSuperAdmin || ((!editMode && checkResource && (checkAdmin || permissionsUser.indexOf('routine-resource') > -1)) || (!checkResource && (checkAdmin || permissionsUser.indexOf('routine-basic') > -1))) && editedItem.editPermission)"-->
          <!--                 class="btn-save"-->
          <!--                 @click="save"-->
          <!--          >-->
          <!--            {{ $t('button.save') }}-->
          <!--          </v-btn>-->
          <v-btn
            v-if="
              checkSuperAdmin ||
              (checkResource &&
                (checkAdmin ||
                  permissionsUser.indexOf('routine-resource') > -1) &&
                !(editMode && editedItem.added_by === 1)) ||
              (!checkResource &&
                (checkAdmin || permissionsUser.indexOf('routine-basic') > -1) &&
                !(
                  permissionsUser.indexOf('routine-basic') > -1 &&
                  editMode &&
                  editedItem.updated_by !== null
                ) &&
                editedItem.editPermission)
            "
            class="btn-save"
            @click="save"
          >
            {{ $t('button.save') }}
          </v-btn>
          <!--          v-if="editMode && (userRoleId === 1 || ((checkResource && (checkAdmin || permissionsUser.indexOf('routine-resource') > -1)) || (!checkResource && (checkAdmin || permissionsUser.indexOf('routine-basic') > -1))))"-->
          <v-btn
            v-if="
              editMode &&
              ((checkResource &&
                ((!editedItem.company_id && checkSuperAdmin) ||
                  (editedItem.company_id &&
                    (checkAdmin ||
                      permissionsUser.indexOf('routine-resource') > -1)))) ||
                (!checkResource &&
                  (checkAdmin ||
                    permissionsUser.indexOf('routine-basic') > -1) &&
                  !(
                    permissionsUser.indexOf('routine-basic') > -1 &&
                    editedItem.updated_by !== null
                  ))) &&
              editedItem.editPermission
            "
            class="hse-btn-delete"
            text
            @click="dialogDelete = true"
          >
            <v-icon dark> mdi-delete </v-icon>
          </v-btn>
        </v-card-actions>
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
            {{ $t('button.cancel') }}
          </v-btn>
          <v-btn class="btn-save" @click="deleteItem(editedItem)">
            {{ $t('button.delete') }}
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
            <p>
              Your routine has successfully been applied to your active
              routines.
            </p>
            <p class="text-center">
              <v-btn class="btn-default" text @click="showItem(editedItem)">
                Click here to review routine
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
            <p>Do you want to save the updates before applying the template?</p>
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
          <div class="text-center confirm-delete-title">Associated objects</div>
          <v-list-item
            v-for="(item, index) in editedItem.related_objects"
            :key="index"
            two-line
          >
            <v-list-item-content>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
              <v-list-item-subtitle>
                <span class="mr-3">ID: {{ item.id }}</span>
                <span class="mr-3"
                  >Added by: {{ item.added_by_first_name }}
                  {{ item.added_by_last_name }}</span
                >
                <span v-if="checkSuperAdmin"
                  >Company: {{ item.company_name }}</span
                >
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="btn-cancel" text @click="dialogRelatedObjects = false">
            {{ $t('button.close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { _ } from 'vue-underscore'
import MultipleSelection from './MultipleSelection'
import Category from './Category'
import cookies from 'js-cookie'
import Security from './Security'
import FroalaSuggestionListEditor from './FroalaSuggestionListEditor'
// import Reminder from "./Reminder";
import RoutineAttending from './RoutineAttending'
// import ResponsiblePerson from "./ResponsiblePerson";
import ConnectToObject from './ConnectToObject.vue'
import Responsible from './Responsible.vue'
// import StartDate from "./StartDate";
import Activation from './Activation'
// import Deadline from "./Deadline";
import Attendee from './Attendee'
import api from '~/apis'
import { removeTagsFromString , formatTimeString } from "./common/js/functions"
// import { removeTagsFromString , formatTimeString, getDateBasedOnFrequency } from "./common/js/functions"
import moment from 'moment';

export default {
  name: 'RoutinePopup',
  components: {
    // connect_to: ConnectTo,
    MultipleSelection,
    // datepicker_radio: DatePickerRadio,
    category: Category,
    Security,
    FroalaSuggestionListEditor,
    // Reminder,
    RoutineAttending,
    // ResponsiblePerson,
    Attendee,
    ConnectToObject,
    Responsible,
    // StartDate,
    Activation,
    // Deadline,
  },
  props: {
    resource: {
      type: Boolean,
      required: false,
    },
    routineItem: {
      type: Object,
      required: false,
    },
    openPopup: Boolean,
    industryArray: {
      type: Array,
      required: false,
    },
    categoriesArray: Array,
    jobTitleArray: {
      type: Array,
      required: false,
    },
    departmentsArray: {
      type: Array,
      required: false,
    },
    viewOnly: {
      type: Boolean,
      required: false,
    },
    // attendingEmployees: {
    //   type: Array,
    //   required: false,
    // },
    responsibleArray: {
      type: Array,
      required: false,
    },
    contactsArray: {
      type: Array,
      required: false,
    },
    predefinedLinkArray: {
      type: Array,
      required: false,
    },
    recurringArray: {
      type: [Object, Array],
      required: false,
    },
  },
  data: () => ({
    connectToArray: [],
    permissionsUser: localStorage.getItem('permissionsKey'),
    checkAdmin: cookies.get('checkAdmin'),
    checkSuperAdmin: cookies.get('checkSuperAdmin'),
    roleUser: cookies.get('roleUser'),
    userRoleId: parseInt(cookies.get('roleID')),
    userID: parseInt(cookies.get('roleID')),
    planAccess: JSON.parse(localStorage.getItem('planAccess')),
    valid: true,
    is_recurring: false,
    hoverTaskPlanAccess : false,
    required: [
      (v) => {
        if (!v || v.length < 1) return 'This is required'
        else return true
      },
    ],
    selectedUnit: '',
    unitValue: '',
    ctoFunction: [
      { id: 'Task', name: 'task' },
      { id: 'Goal', name: 'goal' },
      { id: 'Routine', name: 'routine' },
      { id: 'Instruction', name: 'instruction' },
      { id: 'Risk element source', name: 'risk' },
      { id: 'Checklist', name: 'checklist' },
      { id: 'Attachment', name: 'attachment' },
      { id: 'Document', name: 'document' },
      { id: 'Contact', name: 'contact' },
      { id: 'Deviation', name: 'deviation' },
    ],
    category: [],
    connectToObjectTable: [],
    object: [],
    durationData: {
      is_duration: false,
      duration: 1,
      unit: '',
    },
    units: ['Daily', 'Weekly', 'Bi-Weekly', 'Monthly', 'Quarter', 'Half-Yearly', 'Yearly'],
    // units: ['daily', 'weekly', 'monthly', 'yearly', 'quarter'],
    editedItem: {
      isDefaultResponsible: false,
      isDefaultAttendee: false,
      added_by: '',
      name: '',
      description: '',
      industry_id: '',
      industry_id_arr: [],
      status: 'New',
      category_id: '',
      department_id: '',
      job_title_id: '',
      responsible_id: '',
      is_template: false,
      parent_id: '',
      count_related_object: 0,
      related_objects: [],
      editPermission: true,
      is_suggestion: false,
      // table Security
      object_type: 'routine',
      is_shared: false,
      is_public: false,
      department_array: [],
      employee_array: [],
      // component Reminder
      is_activated: false,
      deadline: '',
      deadline_pre: '',
      recurring: 'Daily',
      start_date_pre: '',
      start_date: '',
      // component RoutineAttending
      is_attending_activated: false,
      attendings_count: 0,
      attending_emps: [],
      attending_contact: [],
      is_requiredResponsible: false,
      is_requiredAction: false,
      is_duration: false,
      duration: 1,
      connectToArray: [],
      start_time: '',
      start_time_pre: '',
      end_time:'',
      end_time_pre:'',
      attendee_all: false,
    },
    defaultItem: {
      isDefaultResponsible: false,
      isDefaultAttendee: false,
      attendee_all: false,
      attendee_department_array: [],
      attendee_employee_array: [],
      responsible_department_array: [],
      responsible_employee_array: [],
      added_by: '',
      start_time: '',
      start_time_pre: '',
      end_time:'',
      end_time_pre:'',
      connectToArray: [],
      name: '',
      description: '',
      industry_id: '',
      industry_id_arr: [],
      status: 'New',
      category_id: '',
      department_id: '',
      job_title_id: '',
      responsible_id: '',
      is_template: false,
      parent_id: '',
      count_related_object: 0,
      related_objects: [],
      editPermission: true,
      is_suggestion: false,
      // table Security
      object_type: 'routine',
      is_shared: false,
      is_public: false,
      department_array: [],
      employee_array: [],
      attendee_array: [],
      // component Reminder
      is_activated: false,
      deadline: '',
      deadline_pre: '',
      recurring: 'Daily',
      start_date_pre: '',
      start_date: '',
      // component RoutineAttending
      is_attending_activated: false,
      attendings_count: 0,
      attending_emps: [],
      attending_contact: [],
      is_requiredResponsible: false,
      is_requiredAction: false,
      is_duration: false,
      duration: 1,
    },
    connectToObjectFrom: { document_id: '', connectToArray: [], object_id: '' },
    statusNew: 1,
    statusClosed: 3,
    isClosed: false,
    denyEdit: false,
    // dialog: false,
    dialogDelete: false,
    dialogConfirmApply: false,
    dialogApply: false,
    dialogConfirmClose: false,
    formTitle: '',
    editMode: true,
    formDirty: false,
    checkResource: false,
    checkShowConnectTo: true,
    category_routine: 'routine',
    categoriesValidArray: [],
    dialogRelatedObjects: false,
    // routineAttendingEmployees: [],
    hoverQuestionMark: false,
    hoverRecurring: false,
    textTrime:""
  }),

  computed: {
    connectToObjectTableHeaders() {
      return [
        { text: this.translateCol('name'), value: 'name' },
        { text: this.translateCol('source'), value: 'source' },
        { text: this.translateCol('category'), value: 'category' },
        { text: this.translateCol('added_by'), value: 'added' },
        { text: this.translateCol('connected_by'), value: 'connectedBy' },
        { text: this.translateCol('connected_date'), value: 'connectDate' },
        { text: this.translateCol('actions'), value: 'actions' },
      ]
    },
  },
  watch: {
    openPopup(value) {
      if (value) {
        if (this.routineItem) {
          let categoryId = this.routineItem.category_id
          this.categoriesValidArray = _.filter(
            this.categoriesArray,
            function (item) {
              return (
                !item.disable_status ||
                (item.disable_status && item.id === categoryId)
              )
            }
          )
          this.durationData.unit = ''
          this.durationData.is_duration = false
          this.editItem(this.routineItem)
        } else {
          this.categoriesValidArray = _.filter(
            this.categoriesArray,
            function (item) {
              return !item.disable_status
            }
          )
          this.addNew()
        }
      }
    },

    resource(value) {
      if (value) {
        this.checkResource = value
      }
    },
  },

  mounted() {},

  created() {
    if (this.openPopup) {
      if (this.routineItem) {
        this.fetchConnectToObjectById(this.routineItem.id)
        this.editItem(this.routineItem)
      } else {
        this.addNew()
      }
    }

    if (this.resource) {
      this.checkResource = this.resource
    }
  },

  methods: { 
    getConnectToArray(data){
        this.connectToArray = [];
        this.connectToArray = data;
    },
    deleteCtoItem (id) {
          let that = this;
          try {
              api.connectToObject.delete(id).then(res => {
                  console.log(res);
                  that.$toaster.success('connect to object data deleted');
                  if (that.documentItem) {
                      that.fetchConnectToObjectById(that.documentItem.id);
                      that.editItem(that.documentItem);
                  }
              });
          } catch (error) {
              that.$toaster.error('connect to object data not deleted');
              console.log(error);
          }
    },
    redirectUrl(){
      if (this.roleUser == 'company admin') {
              this.$router.push('/settings/billings/');
          }
      },
    translateCol(colName) {
      return this.$i18n.t('column.' + colName)
    },
    changeSecurity(val) {
      let that= this;
      if (val !== 'all') {
        that.editedItem.is_suggestion = false
      }
    },
    changeStartDate() {},
    getNewCategory(value) {
      this.editedItem.category_id = value.newCategoryId
    },
    editConnectToObject() {},
    resetConnectToObjectFrom() {
      this.connectToObjectFrom.document_id = ''
      this.connectToObjectFrom.connectToArray = []
    },
    addConnectToObject(payload) {
      this.connectToArray = payload
      this.resetConnectToObjectFrom()
      this.connectToObjectFrom.connectToArray.push(payload.connectToArray)
      this.connectToObjectFrom.object_id = payload.object_id
    },

    addNew() {
      this.reset()
      let defaultCategory = _.findWhere(this.categoriesValidArray, {
        is_primary: 1,
      })
      if (defaultCategory) {
        this.editedItem.category_id = defaultCategory.id
      }
      if (this.checkResource) {
        this.is_recurring=false
        this.formTitle = this.$i18n.t('title.new_routine_resource')
      } else {
        this.is_recurring = false
        this.formTitle = this.$i18n.t('title.new_routine')
      }
      this.checkShowConnectTo = !this.checkResource
      this.editedItem.department_array = []
      this.editedItem.employee_array = []
      this.editedItem.responsible_department_array = []
      this.editedItem.responsible_employee_array = []
      this.editedItem.attendee_employee_array = []
      this.editedItem.attendee_department_array = []
      this.editMode = false
    },

    formatNullArray(item) {
      if (item === null) {
        item = []
      }
      return item
    },

    formatFromStringToArray(data) {
      let result
      if (data) {
        result = data.split(',')
        result = _.map(result, function (item) {
          return parseInt(item)
        })
      } else {
        result = data
      }
      return result
    },

    async editItem(item) {
      let that = this
      await that.fetchConnectToObjectById(item.id)
      // that.formDirty = false
      that.$nuxt.$loading.start()
      that.formTitle = that.$i18n.t('add routine')
      that.durationData.unit = ''
      that.$store
        .dispatch('routines/show', item.id)
        .then(async(result) => {
          console.log('result', result.data)
          that.editedItem = Object.assign({}, result.data)
          that.editedItem.is_activated = false
          that.editedItem.description = that.editedItem.description ? await removeTagsFromString(that.editedItem.description) : '';
          that.editedItem.is_attending_activated=false
          // that.editedItem.is_shared = result.data.is_public == 1 ? true : false
          if (that.editedItem.recurring_type == 'task') {
            that.is_recurring = true
          }else{
            that.is_recurring = false
          }
          if (that.checkSuperAdmin) {
            that.editedItem.industry_id_arr = that.formatNullArray(
              that.formatFromStringToArray(that.editedItem.industry_id)
            )
          }
          // if (that.editedItem.department_array === null) {
          //   that.editedItem.department_array = [];
          // } else {
          //   that.editedItem.department_array = JSON.parse(that.editedItem.department_array);
          // }
          // if (that.editedItem.employee_array === null) {
          //   that.editedItem.employee_array = [];
          // } else {
          //   that.editedItem.employee_array = JSON.parse(that.editedItem.employee_array);
          // }

          // if (that.editedItem.attending_emps === null && that.editedItem.attending_contact === null && that.editedItem.responsible_id === null) {
          //   that.editedItem.deadline = null;
          // }

          // // that.routineAttendingEmployees = _.clone(that.attendingEmployees);
          // if (that.editedItem.attending_emps === null) {
          //   that.editedItem.attending_emps = [];
          // } else {
          //   that.editedItem.attending_emps = JSON.parse(that.editedItem.attending_emps);
          // }
          // // that.routineAttendingEmployees = _.filter(that.routineAttendingEmployees, function(employee){
          // //   return (!employee.disable_status
          // //     || (employee.disable_status && _.indexOf(that.editedItem.attending_emps, employee.id) > -1));
          // // });

          // if (that.editedItem.attending_contact === null) {
          //   that.editedItem.attending_contact = [];
          // } else {
          //   that.editedItem.attending_contact = JSON.parse(that.editedItem.attending_contact);
          // }
          that.$nuxt.$loading.finish()
        })
        .catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_routine_view_detail'))
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish()
        })
      that.originData = _.clone(that.editedItem)
    },

    checkDirtyBeforeClose() {
      if (this.checkDirtyForm()) {
        this.dialogConfirmClose = true
      } else {
        this.close()
      }
    },

    checkDirtyForm() {
      let that = this
      let result = false
      _.each(that.editedItem, function (value, key, obj) {
        if (
          that.originData &&
          obj[key] &&
          that.originData[key] &&
          obj[key] !== that.originData[key]
        ) {
          result = true
        }
      })
      return result
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
      this.reset()
      this.$emit('closePopup')
      this.reloadListCategory()
      this.dialogConfirmClose = false
      this.dialogConfirmApply = false
      this.formDirty = false
      this.connectToArray = [];
      this.isEdit = false;
      this.previewUrl = null;
    },

    reset() {
      this.denyEdit = false
      this.isClosed = false
      // this.filterEmployees();
      this.$nuxt.$loading.finish()
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        // this.$refs.form.reset();
        this.$refs.form.resetValidation()
      }, 300)
    },

    edit() {
      this.editedItem.requestEdit = true
      // this.checkDenyEdit();
    },
    fetchConnectToObjectById(id) {
      let that = this
      const type = 'document'
      try {
        api.connectToObject.show(type, id).then((res) => {
          that.connectToObjectTable = res.data.data
        })
      } catch (error) {
        that.$toaster.error('connect to object data not fetched')
        console.log(error)
      }
    },

    saveConnectToObject(type, id) {
      try {
        if (this.connectToObjectTable.length + this.connectToArray?.length <= 5)
          api.connectToObject.store(type, id, {
            connectToArray: this.connectToArray,
          })
        else
          this.$toaster.error(this.$i18n.t('message.connect_to_object_limit'))
      } catch (error) {
        this.$toaster.error(this.$i18n.t('message.fail_connect_to_object'))
        console.log(error)
      }
    },
    async save() {
      let that = this
      if (that.$refs.form.validate()) {
        that.$nuxt.$loading.start()
        that.editedItem.added_by = that.userID
        // that.formatEmployeeBeforeSave();
        if (that.checkSuperAdmin) {
          that.editedItem.is_shared = true
          that.editedItem.is_public = true
          that.editedItem.industry_id =
            that.editedItem.industry_id_arr.toString()
          that.editedItem.is_activated = false
          that.editedItem.is_attending_activated = false
          that.editedItem.recurring_type = '' //added me for checking ----------------------
          // that.editedItem.deadline = new Date().toISOString().substr(0, 10);
        }
        if (that.editMode) {
          // edit
          that.editedItem.type = 'routine'
          that.editedItem.is_template = false
          that.editedItem.object_type = 'routine'
          that.editedItem.is_shared = that.editedItem.is_public
          that.editedItem.start_time = that.editedItem.start_time_pre || await formatTimeString(moment(new Date().getTime()).format("HH:mm"));
          that.editedItem.start_date = that.editedItem.start_date_pre || moment().format('YYYY-MM-DD')
          // that.editedItem.deadline = that.editedItem.deadline_pre || await getDateBasedOnFrequency(moment().format('YYYY-MM-DD'),that.durationData.unit)
          that.editedItem.end_time =  await formatTimeString(that?.editedItem?.end_time_pre) || await formatTimeString(moment(new Date().getTime()).format("HH:mm"));
          if(!that.durationData.unit && !that.editedItem.deadline_pre)
          {
            that.editedItem.deadline = moment(moment().format('YYYY-MM-DD')).add(2, 'days').format('YYYY-MM-DD');
          }
          else{
            that.editedItem.deadline=that.editedItem.deadline_pre;
          }
          that.editedItem.description = that.editedItem.description ? await removeTagsFromString(that.editedItem.description) : '';
          that.editedItem.related_objects = []
          that.editedItem.is_activated = true
          that.editedItem.is_attending_activated = true
          that.editedItem.is_duration = that.durationData.is_duration
          that.editedItem.duration = that.durationData.duration
          that.editedItem.recurring = that.durationData.unit || 'Daily'
          that.editedItem.attending_emps = []
          that.editedItem.connectToArray = []
          that.editedItem.is_requiredAction = false,
          that.editedItem.is_requiredResponsible = false,
          that.editedItem.resource_id = that.editedItem.id
          that.editedItem.source = 'routine'
          that.$store
            .dispatch('objects/store', that.editedItem)
            .then(()=> {
              // that.reloadList()
              that.resourceList()
              that.reloadListCategory()
              that.changeTab(0);
              that.$toaster.success(
                that.$i18n.t('message.success_routine_add_new')
              )
            })
            .catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_routine_add_new'))
              }
              // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
              that.$nuxt.$loading.finish()
            })
            if (that.is_recurring == true) {
            // that.createTask()
          }
        } else {
          // create
          if (that.checkResource) {
            that.editedItem.is_template = true
            that.editedItem.is_activated = true
            that.editedItem.is_attending_activated = true
            that.editedItem.recurring = 'indefinite'
            // that.editedItem.deadline = new Date().toISOString().substr(0, 10);
          }
          if (!that.editedItem.start_date_pre) {
            // that.editedItem.start_date_pre = moment().format('YYYY-MM-DD')
            // that.editedItem.start_date =  moment().format('YYYY-MM-DD')
            that.editedItem.start_date_pre = moment().format('YYYY-MM-DD')
            that.editedItem.start_date = moment().format('YYYY-MM-DD')
          } else {
            that.editedItem.start_date = that.editedItem.start_date_pre
          }
          if(!that.durationData.unit && !that.editedItem.deadline_pre)
          {
            that.editedItem.deadline = moment(moment().format('YYYY-MM-DD')).add(2, 'days').format('YYYY-MM-DD');
          }
          else{
            that.editedItem.deadline=that.editedItem.deadline_pre;
          } 
          // if(!that.editedItem.deadline_pre){
          //   that.editedItem.deadline = await getDateBasedOnFrequency(moment().format('YYYY-MM-DD'),that.durationData.unit)
          //   that.editedItem.deadline_pre =  await getDateBasedOnFrequency(moment().format('YYYY-MM-DD'),that.durationData.unit)
          // }
          that.editedItem.recurring_type =
            that.is_recurring == false ? 'reminder' : 'task'
          that.editedItem.recurring = that.selectedUnit || 'Daily'
          that.editedItem.type = 'routine'
          that.editedItem.end_time =  await formatTimeString(that?.editedItem?.end_time_pre) || await formatTimeString(moment(new Date().getTime()).format("HH:mm"));
          that.editedItem.start_time = await formatTimeString(that?.editedItem?.start_time_pre) || await formatTimeString(moment(new Date().getTime()).format("HH:mm"));
          that.editedItem.description = that.editedItem.description ? await removeTagsFromString(that.editedItem.description) : '';
            // that.editedItem.end_time =  that?.editedItem?.end_time_pre;
            // that.editedItem.start_time = that?.editedItem?.start_time_pre;
          // that.editedItem.deadline = that.editedItem.deadline_pre
          if (that.checkResource) {
            that.textTrime = that.editedItem.name;
            that.editedItem.connectToArray = that.connectToArray
            that.editedItem.name = this.textTrime.trim()
            that.editedItem.is_template = true
            that.editedItem.is_activated = true
            that.editedItem.is_attending_activated = true
            that.editedItem.isDefaultResponsible = false
            that.editedItem.isDefaultAttendee = false
             this.editedItem.description= await removeTagsFromString(this.editedItem.description);
            that.$store
              .dispatch('routines/store', that.editedItem)
              .then(function () {
                that.$nuxt.$loading.start()
                that.resourceList()
                that.reloadList()
                that.reloadListCategory()
                that.editedItem = that.defaultItem;
                // that.saveConnectToObject("routine",res.data.id);
                that.$toaster.success(
                  that.$i18n.t('message.success_routine_add_new')
                )
              })
              .catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
                that.$toaster.error(that.$i18n.t('message.fail_routine_add_new'))
                }
                // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
                that.$nuxt.$loading.finish()
              })
          }
          if (!that.checkResource) {
            that.$nuxt.$loading.start()
            that.textTrime = that.editedItem.name
            that.editedItem.name = this.textTrime.trim()
            that.editedItem.type = 'routine'
            that.editedItem.is_template = false
            that.editedItem.is_duration = that.durationData.is_duration
            // that.editedItem.deadline = that.editedItem.deadline_pre 
            that.editedItem.duration = that.durationData.duration
            that.editedItem.connectToArray = that.connectToArray
            that.editedItem.recurring = that.durationData.unit || "Daily"
            that.editedItem.description= await removeTagsFromString(that.editedItem.description);
            that.editedItem.source = 'routine'
            that.$store
              .dispatch('objects/store', that.editedItem)
              .then(function () {
                that.reloadList()
                that.reloadListCategory()
                that.editedItem = {...that.defaultItem}
                // that.saveConnectToObject("routine",res.data.id);
                that.$toaster.success(
                  that.$i18n.t('message.success_routine_add_new')
                )
                that.$nuxt.$loading.finish()
              })
              .catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
                that.$toaster.error(that.$i18n.t('message.fail_routine_add_new'))
                }
                // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
                that.$nuxt.$loading.finish()
              })
              if (that.is_recurring == true) {
            // that.createTask()
          }

              that.durationData.unit = null
              that.durationData.is_duration = false
              that.durationData.duration = 1
          }
        }
        that.close()
      } else {
        that.$toaster.error(that.$i18n.t('message.add_required_feild'))
      }
    },

    createTask(){
      let that = this
      that.editedItem.type = 'task'
      that.editedItem.source = 'routine'
      // that.editedItem.object_type = 'task'
      that.$store
      .dispatch('objects/store', that.editedItem)
      .then(function () {
        that.reloadList()
        that.reloadListCategory()
        that.editedItem = that.defaultItem
        // that.saveConnectToObject("routine",res.data.id);
        that.$toaster.success(
          that.$i18n.t('message.success_task_add_new')
        )
        that.$nuxt.$loading.finish()
      })
      .catch((error) => {
          if (error.response.status == 401) {
          that.$router.push('/login');
          that.$toaster.error(that.$i18n.t('message.token_expired'));
        }else{
        that.$toaster.error(that.$i18n.t('message.fail_task_add_new'))
        }
        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish()
      })
    },

    reloadList() {
      this.$emit('reloadList')
    },

    resourceList() {
      this.$emit('resourceList')
    },

    reloadListCategory() {
      this.$emit('reloadListCategory')
    },

    // checkDenyEdit() {
    //   if (this.editedItem.status === this.statusClosed) {
    //     this.denyEdit = true;
    //     this.isClosed = true;
    //   } else {
    //     this.denyEdit = !(this.editedItem.status === this.statusNew || (this.denyEdit && this.editedItem.requestEdit));
    //   }
    // },

    // dialog DELETE
    closeDelete() {
      this.dialogDelete = false
    },

    closeApply() {
      this.dialogApply = false
    },

    deleteItem(item) {
      this.deleteRoutine(item)
      this.dialogDelete = false
      this.close()
      // if (this.dialog) {
      //   this.deleteRoutine(item);
      //   this.dialogDelete = false;
      //   this.close();
      // } else {
      //   this.deleteRoutine(item);
      //   this.dialogDelete = this.checkResource = false;
      // }
    },

    deleteRoutine(item) {
      let that = this
      that.$store
        .dispatch('routines/delete', item.id)
        .then(function () {
          that.reloadList()
          that.$toaster.success(that.$i18n.t('message.success_routine_delete'))
        })
        .catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_routine_delete'))
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          // that.$nuxt.$loading.finish();
        })
    },

    //function to apply selected template content to all input
    applyTemplate() {
      let that = this
      if (that.$refs.form.validate()) {
        that.editedItem.is_template = false
        that.editedItem.recurring_type =
          that.is_recurring == false ? 'reminder' : 'task'
        if (!that.editedItem.parent_id) {
          that.editedItem.parent_id = that.editedItem.id
        }
        that.$store
          .dispatch('objects/store', that.editedItem)
          .then(function (result) {
            that.$nuxt.$loading.start()
            that.editedItem = result.data
            that.checkResource = false
            // that.dialogApply = true;
            that.reloadList()
            that.changeTab(0)
            that.$toaster.success(
              that.$i18n.t('message.success_routine_add_new')
            )
          })
          .catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_routine_add_new'))
            }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish()
          })
        that.close()
      }
    },

    saveAndApply() {
      let that = this
      // create template
      if (that.$refs.form.validate()) {
        that.editedItem.is_template = true
        that.editedItem.recurring_type =
          that.is_recurring == false ? 'reminder' : 'task'
        that.editedItem.isDefaultResponsible = false
        that.editedItem.is_activated = true
        that.editedItem.is_attending_activated = true
        that.editedItem.isDefaultAttendee = false
        that.editedItem.type = 'routine'
        // that.editedItem.deadline = new Date().toISOString().substr(0, 10);
        that.$store
          .dispatch('routines/store', that.editedItem)
          .then((result) => {
            that.editedItem.parent_id = result.data.id
            that.resourceList()
            that.applyTemplate()
          })
          .catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_routine_add_new'))
            }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish()
          })
      }

      //  if (this.$refs.form.validate()) {
      //   let that = this;
      //   that.$nuxt.$loading.start();
      //   if(that.checkResource==true){
      //     that.editedItem.is_template = true;
      //     that.$store.dispatch('checklists/store', that.editedItem).then(result => {
      //       that.editedItem.parent_id = result.data.id;
      //       // that.reloadList();
      //       that.resourceList()
      //         that.reloadListCategory();
      //         that.reloadAnswerOptionsList();
      //       // that.applyTemplate();
      //       that.$toaster.success(that.$i18n.t('message.success_checklist_add_new'));
      //       that.$nuxt.$loading.finish();
      //     }).catch((error) => {
          //   if (error.response.status == 401) {
          //   that.$router.push('/login');
          //   that.$toaster.error(that.$i18n.t('message.token_expired'));
          // }else{
      //       that.$toaster.error(that.$i18n.t('message.fail_checklist_add_new'));
      // }
      //       // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
      //       that.$nuxt.$loading.finish();
      //     });
      //     }
      //     that.templateCheck=that.editedItem;
      //     that.templateCheck.type="checklist"
      //        that.templateCheck.is_template = false;
      //      that.$store.dispatch('objects/store', that.templateCheck).then(result => {
      //     that.editedItem.parent_id = result.data.id;
      //     that.reloadList();
      //       that.reloadListCategory();
      //       that.reloadAnswerOptionsList();
      //     // that.applyTemplate();
      //     that.$nuxt.$loading.finish();
      //   }).catch((error) => {
          //   if (error.response.status == 401) {
          //   that.$router.push('/login');
          //   that.$toaster.error(that.$i18n.t('message.token_expired'));
          // }else{
      //     // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
      // }
      //     that.$nuxt.$loading.finish();
      //   });
      //   that.close('closePopup');
      // }
    },

    updateAndApply() {
      let that = this
      if (that.$refs.form.validate()) {
        that.$store
          .dispatch('routines/update', that.editedItem)
          .then((result) => {
            that.editedItem.parent_id = result.data.id
            that.applyTemplate()
          })
          .catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_routine_update'))
            }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish()
          })
      }
    },

    //----- END - function to apply selected template content to all input

    updateResource(value) {
      this.$emit('updateResource', value)
    },

    changeTab(value) {
      console.log("changeTab-value",value);
      this.$emit('changeTab', value)
    },
   
    showItem(item) {
      this.dialogApply = false
      // this.checkResource = false;
      // this.updateResource(this.checkResource);
      // this.changeTab(0);
      this.$emit('showItem', item)
    },

    // getSelectedAttendingItems(value) {
    //   this.editedItem.attending_emps = value.selectedItemsOutput;
    // },

    // getSelectedAttendingContactItems(value) {
    //   this.editedItem.attending_contact = value.selectedItemsOutput;
    // },

    // ADMIN - choose industry
    getSelectedIndustryItems(value) {
      this.editedItem.industry_id_arr = value.selectedItemsOutput
    },
  },
}
</script>

<style scoped>
 .bold-title {
  font-size: 15px !important;
}
/* ::v-deep .section-connect-to{
  margin-top: 53px !important;
} */
::v-deep .cto-department .section-connect-to {
  margin-top: 20px !important;
}
:deep(.view-badge) {
  left: 55px;
}

:deep(.section-connect-to .section-connect-to-label){
  width: 290px;
}

.hse-badge-icon {
  margin-top: 10px;
  margin-left: -6px;
}
</style>

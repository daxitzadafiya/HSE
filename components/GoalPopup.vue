<template>
  <div>
    <v-dialog v-model="openPopup" max-width="1300px" persistent>
      <v-card>
        <v-card-text>
          <div class="title-model">
            {{ editMode ? formTitle : goalFormTitle }}
          </div>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <b-row
              v-if="editMode"
              align-v="center"
              align-h="end"
              class="mt-0"
            >
              <b-col cols="6" class="pt-0">
                <v-btn
                  block
                  @click="dialogUpdateHistory = true"
                >
                  View update history
                </v-btn>
              </b-col>
              <b-col
                v-if="checkResource && editedItem.count_related_object > 0
                && (editedItem.added_by !== 1 || (editedItem.added_by === 1 && checkSuperAdmin))"
                cols="6"
                class="pt-0"
              >
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
                    name="name"
                    :rules="required"
                    outlined
                    :disabled="denyEdit"
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
              :type-category="category_goal"
              :is-open-popup="openPopup"
              @getNewCategory="getNewCategory"
            />
            <b-row class="section-description">
              <b-col>
<!--                <v-icon class="icon-question">far fa-question-circle</v-icon>-->
                <div class="input-wrap form-description">
<!--                  <vue-editor-->
<!--                    v-model="editedItem.description"-->
<!--                    :disabled="denyEdit || !editedItem.editPermission"-->
<!--                  />-->
                  <FroalaSuggestionListEditor
                    :item="editedItem"
                    :predefined-link-array="predefinedLinkArray"
                  />
                </div>
              </b-col>
            </b-row>
            <b-row v-if="!checkResource || (!checkSuperAdmin && checkResource && editMode)" class="mb-4">
              <b-col cols="6">
              </b-col>
            </b-row>
            <div class="manage-task">
              <b-row>
                <b-col v-for="(item, index) in subGoalArray" :key="index" cols="12" class="mb-4">
                  <div class="section-connect-to section-connect-to-checklist-topic">
                    <div class="section-connect-to-label section-connect-to-label-checklist add-new-section display-inline-flex">
                      <v-text-field
                        v-model="item.name"
                        :label="$t('form.sub_goal')"
                        :rules="required"
                        :readonly="!editedItem.editPermission"
                        outlined
                      />
<!--                      <v-textarea v-model="item.name" :label="$t('form.sub_goal')" :rules="required" outlined no-resize auto-grow />-->
                      <v-icon v-if="!denyEdit && editedItem.editPermission" class="ml-5 icon-checklist-topic-delete" @click="requestDelete('sub goal', item)">
                        delete
                      </v-icon>
                    </div>

                    <v-btn
                      v-if="!denyEdit && editedItem.editPermission"
                      class="add-new-down-title btn-add-new-checklist-checkpoint"
                      @click="addNewTask(index)"
                    >
                      + {{ $t('button.task') }}
                    </v-btn>

                    <div class="padding-15-checklist">
                      <v-expansion-panels v-if="isAddTask">
                        <v-expansion-panel
                          v-for="(task) in item.tasks"
                          :key="task.tasks"
                        >
                          <v-expansion-panel-header>
                            <span v-if="!task.name">{{ $t('title.add_new_task') }}</span>
                            <span v-if="task.name">{{ task.name }}</span>
                          </v-expansion-panel-header>
                          <v-expansion-panel-content>
                            <b-row>
                              <b-col cols="12">
                                <div class="input-wrap">
                                  <v-text-field
                                    v-model="task.name"
                                    :label="$t('form.name')"
                                    :rules="required"
                                    :readonly="!editedItem.editPermission"
                                    outlined
                                  />
                                </div>
                              </b-col>
                              <b-col v-if="!checkResource || (!checkSuperAdmin && checkResource && editMode)" cols="6">
                                <div class="input-wrap industry-select-input-wrap">
                                  <v-select
                                    v-model="task.assigned_department"
                                    :items="departmentsArray"
                                    item-text="name"
                                    item-value="id"
                                    multiple
                                    outlined
                                    chips
                                    :label="$t('form.assign_to_departments')"
                                    :readonly="!editedItem.editPermission"
                                  >
                                    <template v-slot:prepend-item>
                                      <v-list-item
                                        ripple
                                        @click="toggleDepartment(task)"
                                      >
                                        <v-list-item-action>
                                          <v-icon :color="task.assigned_department.length > 0 ? 'indigo darken-4' : ''">{{ icon1(task) }}</v-icon>
                                        </v-list-item-action>
                                        <v-list-item-content>
                                          <v-list-item-title>{{ $t('form.select_all') }}</v-list-item-title>
                                        </v-list-item-content>
                                      </v-list-item>
                                      <v-divider class="mt-2" />
                                    </template>
                                  </v-select>
                                </div>
                              </b-col>
                              <b-col v-if="!checkResource || (!checkSuperAdmin && checkResource && editMode)" cols="6">
                                <div class="input-wrap industry-select-input-wrap">
                                  <v-select
                                    v-if="editMode"
                                    v-model="task.assigned_employee"
                                    :items="task.assigneeArray"
                                    item-text="name"
                                    item-value="id"
                                    multiple
                                    outlined
                                    chips
                                    :label="$t('form.assign_to_employees')"
                                    :readonly="!editedItem.editPermission"
                                  >
                                    <template v-slot:prepend-item>
                                      <v-list-item
                                        ripple
                                        @click="toggle(task)"
                                      >
                                        <v-list-item-action>
                                          <v-icon :color="task.assigned_employee.length > 0 ? 'indigo darken-4' : ''">{{ icon(task) }}</v-icon>
                                        </v-list-item-action>
                                        <v-list-item-content>
                                          <v-list-item-title>{{ $t('form.select_all') }}</v-list-item-title>
                                        </v-list-item-content>
                                      </v-list-item>
                                      <v-divider class="mt-2" />
                                    </template>
                                  </v-select>
                                  <v-select
                                    v-else
                                    v-model="task.assigned_employee"
                                    :items="taskAssigneesArray"
                                    item-text="name"
                                    item-value="id"
                                    multiple
                                    outlined
                                    chips
                                    :label="$t('form.assign_to_employees')"
                                    :readonly="!editedItem.editPermission"
                                  >
                                    <template v-slot:prepend-item>
                                      <v-list-item
                                        ripple
                                        @click="toggle(task)"
                                      >
                                        <v-list-item-action>
                                          <v-icon :color="task.assigned_employee.length > 0 ? 'indigo darken-4' : ''">{{ icon(task) }}</v-icon>
                                        </v-list-item-action>
                                        <v-list-item-content>
                                          <v-list-item-title>{{ $t('form.select_all') }}</v-list-item-title>
                                        </v-list-item-content>
                                      </v-list-item>
                                      <v-divider class="mt-2" />
                                    </template>
                                  </v-select>
                                </div>
                              </b-col>
                              <b-col v-if="!checkResource || (!checkSuperAdmin && checkResource && editMode)" cols="12">
                                *If not choosing assignee, task will be assigned to responsible person.
                              </b-col>
                              <b-col v-if="!checkResource || (!checkSuperAdmin && checkResource && editMode)" cols="12">
                                <v-checkbox
                                  v-model="task.assigned_company"
                                  :label="$t('form.assign_to_all_employees_in_company')"
                                  :readonly="!editedItem.editPermission"
                                />
                              </b-col>
                            </b-row>
                            <v-card-actions>
                              <v-spacer />
                              <v-btn v-if="!denyEdit && editedItem.editPermission" class="hse-btn-delete" text @click="requestDelete('task',item, task)">
                                <v-icon dark>
                                  mdi-delete
                                </v-icon>
                              </v-btn>
                            </v-card-actions>
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </div>
                  </div>
                </b-col>
              </b-row>
              <b-row class="mb-6">
                <b-col cols="3">
                  <v-btn v-if="!denyEdit && editedItem.editPermission" class="btn-create-task" @click="addSubGoal">
                    {{ $t('button.add_sub_goal') }}
                  </v-btn>
                </b-col>
                <b-col v-if="isAddSubGoal && !denyEdit" cols="9">
                  <div class="connect-department">
                    <div class="department d-flex">
                      <v-text-field
                        v-model="subGoalData.name"
                        :rules="required"
                        outlined
                      />
                      <span class="department-button">
                        <v-btn class="mb-2 btn-add-department" @click="addSubGoalName">
                          Add
                        </v-btn>
                        <v-btn class="mt-1 mb-2 btn-cancel-department" @click="cancelSubGoalName">
                          Cancel
                        </v-btn>
                      </span>
                    </div>
                  </div>
                </b-col>
              </b-row>
            </div>
            <Security
              v-if="!checkSuperAdmin && checkShowConnectTo"
              :security-item="editedItem"
              :edit-mode="editMode"
              @changeSecurity="changeSecurity"
            />
            <ResponsibleAddNew
              v-if="!editMode"
              :object-item="editedItem"
            />
            <StartDate
              :object-item="editedItem"
              :edit-mode="editMode"
              @changeDate="changeStartDate"
            />
            <Deadline
              :object-item="editedItem"
              :edit-mode="editMode"
              :change-custom="changeDeadlineCustom"
            />
<!--            <DeadlineRecurring-->
<!--              :object-item="editedItem"-->
<!--              :edit-mode="editMode"-->
<!--              :change-custom="changeDeadlineCustom"-->
<!--            />-->
          </v-form>
        </v-card-text>
        <v-card-actions v-if="editMode">
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
            v-if="checkResource
            && (checkAdmin || (permissionsUser.indexOf('goal-resource') > -1
            && editedItem.editPermission))"
            class="btn-save"
            @click="applyTemplate"
          >
            {{ $t('button.apply') }}
          </v-btn>
<!--          <v-btn-->
<!--            v-if="editedItem.added_by > 1 && checkResource && (checkAdmin || permissionsUser.indexOf('goal-resource') > -1)" class="hse-btn-save" @click="saveAndApply"-->
<!--          >-->
<!--            Save and apply-->
<!--          </v-btn>-->
          <v-btn
            v-if="denyEdit && !isClosed && !checkResource && !viewOnly && (checkAdmin || (permissionsUser.indexOf('goal-basic') > -1 && editedItem.editPermission))"
            class="btn-save"
            @click="edit"
          >
            {{ $t('button.edit') }}
          </v-btn>
          <v-btn
            v-else-if="checkSuperAdmin || (!denyEdit && !isClosed && !checkResource && !viewOnly && ((checkAdmin || (permissionsUser.indexOf('goal-basic') > -1)) && !(permissionsUser.indexOf('goal-basic') > -1 && editedItem.updated_by !== null) && editedItem.editPermission))"
            class="btn-save"
            @click="saveEdit"
          >
            {{ $t('button.save') }}
          </v-btn>
          <v-btn
            v-if="((checkResource && ((!editedItem.company_id && checkSuperAdmin) || (editedItem.company_id && (checkAdmin || (permissionsUser.indexOf('goal-resource') > -1)))))
            || (!checkResource && (checkAdmin || (permissionsUser.indexOf('goal-basic') > -1) && !(permissionsUser.indexOf('goal-basic') > -1 && editedItem.updated_by !== null))))
            && editedItem.editPermission"
            class="hse-btn-delete"
            text
            @click="requestDelete('object')"
          >
            <v-icon dark>
              mdi-delete
            </v-icon>
          </v-btn>
        </v-card-actions>
        <v-card-actions v-else>
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
          <v-btn class="btn-cancel" text @click="close">
            {{ $t('button.cancel') }}
          </v-btn>
          <v-btn
            v-if="checkResource && (checkAdmin || permissionsUser.indexOf('goal-resource') > -1) && editedItem.editPermission"
            class="hse-btn-save"
            @click="saveAndApply"
          >
            {{ $t('button.save_and_apply') }}
          </v-btn>
          <v-btn
            v-if="checkSuperAdmin
            || (checkResource && (checkAdmin || permissionsUser.indexOf('goal-resource') > -1) && !(editMode && editedItem.added_by === 1))
            || (!checkResource && (checkAdmin || permissionsUser.indexOf('goal-basic') > -1))
            && editedItem.editPermission"
            class="btn-save"
            @click="save"
          >
            {{ $t('button.save') }}
          </v-btn>
<!--          <v-btn -->
<!--            v-if="checkSuperAdmin || (checkResource && (checkAdmin || permissionsUser.indexOf('goal-resource') > -1))" -->
<!--            class="btn-save" -->
<!--            text -->
<!--            @click="save"-->
<!--          >-->
<!--            {{ $t('button.save') }}-->
<!--          </v-btn>-->
<!--          <v-btn -->
<!--            v-if="!checkResource && (checkAdmin || permissionsUser.indexOf('goal-basic') > -1)" -->
<!--            class="btn-save" -->
<!--            @click="save"-->
<!--          >-->
<!--            {{ $t('button.save') }}-->
<!--          </v-btn>-->
        </v-card-actions>
      </v-card>
    </v-dialog>

<!--    <v-dialog v-model="dialogDelete" max-width="500px">-->
<!--      <v-card class="dialog-delete">-->
<!--        <v-card-text>-->
<!--          <div class="text-center confirm-delete-title">-->
<!--            {{ $t('title.confirm_delete') }}-->
<!--          </div>-->
<!--          <div class="confirm-delete-text">-->
<!--            {{ $t('message.are_you_sure_you_want_to_delete_this_item') }}-->
<!--          </div>-->
<!--        </v-card-text>-->
<!--        <v-card-actions>-->
<!--          <v-spacer />-->
<!--          <v-btn class="btn-cancel" text @click="closeDelete">-->
<!--            {{ $t('button.no') }}-->
<!--          </v-btn>-->
<!--          <v-btn class="btn-save" @click="deleteItem">-->
<!--            {{ $t('button.yes') }}-->
<!--          </v-btn>-->
<!--        </v-card-actions>-->
<!--      </v-card>-->
<!--    </v-dialog>-->

    <v-dialog v-model="dialogApply" max-width="500px">
      <v-card class="dialog-delete">
        <v-card-text>
          <div class="text-center confirm-delete-title">
            {{ $t('title.apply_success') }}
          </div>
          <div class="confirm-delete-text">
            <p>Your goal has successfully been applied to your active goals.</p>
            <p class="text-center">
              <v-btn class="btn-default" text @click="showItem(editedItem)">
                Click here to review goal
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

    <v-dialog v-model="dialogConfirmSaveEdit" max-width="500px">
      <v-card class="dialog-delete">
        <v-card-text>
          <div class="text-center confirm-delete-title">
            {{ $t('title.confirm_modal') }}
          </div>
          <div class="confirm-delete-text">
            <p>If you choose to save changes, the progress of all tasks is reset. Do you want to continue?</p>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="btn-cancel" text @click="save">
            {{ $t('button.yes') }}
          </v-btn>

          <v-btn class="btn-cancel" text @click="dialogConfirmSaveEdit = false">
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

    <v-dialog v-model="dialogUpdateHistory" max-width="800px">
      <v-card class="dialog-delete">
        <v-card-text>
          <div class="text-center confirm-delete-title">
            History
          </div>
          <v-list-item
            v-for="(item, index) in editedItem.historyArray" :key="index"
            two-line
          >
            <v-list-item-content>
              <v-list-item-title v-html="item.title"></v-list-item-title>
              <v-list-item-subtitle v-if="item.old_content">
                <span class="mr-3" v-html="item.old_content"></span>
                <i class="mdi mdi-arrow-right mr-3"></i>
                <span class="mr-3 text--primary" v-html="item.new_content"></span>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="btn-cancel" text @click="dialogUpdateHistory = false">
            {{ $t('button.close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import {_} from 'vue-underscore';
  import cookies from "js-cookie";
  import MultipleSelection from "./MultipleSelection";
  import Security from "./Security";
  import FroalaSuggestionListEditor from "./FroalaSuggestionListEditor";
  import Category from "./Category";
  import ResponsibleAddNew from "./ResponsibleAddNew";
  import StartDate from "./StartDate";
  import Deadline from "./Deadline";
  // import DeadlineRecurring from "./DeadlineRecurring";

  export default {
    name: "GoalPopup",
    components: {
      MultipleSelection,
      Security,
      FroalaSuggestionListEditor,
      category: Category,
      ResponsibleAddNew,
      StartDate,
      Deadline,
      // DeadlineRecurring,
    },
    props: {
      resource: {
        type: Boolean,
        required: false,
      },
      goalItem: {
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
      viewOnly: {
        type: Boolean,
        required: false,
      },
      formTitle: {
        type: String,
        required: false,
      },
      taskAssigneesArray: {
        type: Array,
        required: false,
      },
      responsibleArray: {
        type: Array,
        required: false,
      },
      predefinedLinkArray: {
        type: Array,
        required: false,
      },
      categoriesArray: Array,
    },
    data: () => ({
      permissionsUser: localStorage.getItem('permissionsKey'),
      checkAdmin: cookies.get('checkAdmin'),
      checkSuperAdmin: cookies.get('checkSuperAdmin'),
      roleUser: cookies.get('roleUser'),
      // userRoleId: parseInt(cookies.get('roleID')),
      valid: true,
      required: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else return true;
        }
      ],
      editedItem: {
        id: "",
        name: "",
        category_id: '',
        description: "",
        status: 1,
        department_id: "",
        project_id: "",
        job_title_id: "",
        is_template: false,
        parent_id: '',
        count_related_object: 0,
        related_objects: [],
        requestEdit: false,
        responsible_id: '',
        industry_id: '',
        industry_id_arr: [],
        editPermission: true,
        historyArray: [],
        is_suggestion: false,
        // table Security
        object_type: 'goal',
        is_shared: false,
        is_public: false,
        department_array: [],
        employee_array: [],
        // table Time management
        start_date: '',
        start_date_pre: '',
        deadline: '',
        deadline_pre: '',
        recurring: '',
      },
      defaultItem: {
        id: "",
        name: "",
        category_id: '',
        description: "",
        status: 1,
        department_id: "",
        project_id: "",
        job_title_id: "",
        is_template: false,
        parent_id: '',
        count_related_object: 0,
        related_objects: [],
        requestEdit: false,
        responsible_id: '',
        industry_id: '',
        industry_id_arr: [],
        editPermission: true,
        historyArray: [],
        is_suggestion: false,
        // table Security
        object_type: 'goal',
        is_shared: false,
        is_public: false,
        department_array: [],
        employee_array: [],
        // table Time management
        start_date: '',
        start_date_pre: '',
        deadline: '',
        deadline_pre: '',
        recurring: '',
      },
      statusNew: 1,
      statusClosed: 3,
      isClosed: false,
      denyEdit: false,
      // dialog: false,
      dialogConfirmSaveEdit: false,
      dialogDelete: false,
      dialogConfirmApply: false,
      dialogApply: false,
      dialogConfirmClose: false,
      taskArray: [],
      goalFormTitle: '',
      editMode: true,
      formDirty: false,
      checkResource: false,
      checkShowConnectTo: true,
      isAddSubGoal: false,
      subGoalArray: [],
      subGoalData: {
        name: "",
        tasks: [],
      },
      isAddTask: false,
      dialogRelatedObjects: false,
      dialogUpdateHistory: false,
      hoverQuestionMark: false,
      // category
      category_goal: 'goal',
      categoriesValidArray: [],
      requestDeleteType: '',
      requestDeleteSubGoal: '',
      requestDeleteTask: '',
      // start date / deadline
      start_date: '',
      deadline: '',
      changeDeadlineCustom: false,
    }),

    watch: {
      openPopup(value) {
        if (value) {
          if (this.goalItem) {
            let categoryId = this.goalItem.category_id;
            this.categoriesValidArray = _.filter(this.categoriesArray, function (item) {
              return (!item.disable_status || (item.disable_status && item.id === categoryId));
            });
            this.editItem(this.goalItem);
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

    mounted() {},

    created() {
      if (this.openPopup) {
        if (this.goalItem) {
          this.editItem(this.goalItem);
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

      changeStartDate(val) {
        this.changeDeadlineCustom = !!val.changed;
      },

      getNewCategory(value) {
        this.editedItem.category_id = value.newCategoryId;
      },

      addNew() {
        this.reset();
        if (this.checkResource) {
          this.goalFormTitle = this.$i18n.t('title.new_goal_resource');
        } else {
          this.goalFormTitle = this.$i18n.t('title.new_goal');
        }
        this.checkShowConnectTo = !this.checkResource;
        this.editMode = false;
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
        // list topics
        that.$store.dispatch('goals/show', item.id).then(result => {
          that.editedItem = Object.assign({}, result.data);
          that.editedItem.historyArray = _.sortBy(result.data.history, function(o) { return o.updated_at; });
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

          that.subGoalArray = result.data.sub_goals;
          _.each(that.subGoalArray, function (subGoal) {
            if (subGoal.tasks.length > 0) {
              that.isAddTask = true;
              _.each(subGoal.tasks, function (task) {
                if (task.assigned_department === null) {
                  task.assigned_department = [];
                } else {
                  task.assigned_department = JSON.parse(task.assigned_department);
                }
                task.assigneeArray = _.clone(that.taskAssigneesArray);
                if (task.assigned_employee === null) {
                  task.assigned_employee = [];
                } else {
                  task.assigned_employee = JSON.parse(task.assigned_employee);
                }
                task.assigneeArray = _.filter(task.assigneeArray, function(employee){
                  return (!employee.disable_status
                    || (employee.disable_status && _.indexOf(task.assigned_employee, employee.id) > -1));
                });
              });
            }
          });
          that.editedItem.requestEdit = false;
          that.originData = _.clone(that.editedItem);
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_goal_view_detail'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
        that.checkDenyEdit();
      },

      checkDirtyBeforeClose() {
        if (this.checkDirtyForm()) {
          this.dialogConfirmClose = true;
        } else {
          this.close();
        }
      },

      checkDirtyForm() {
        let that = this;
        let result = false;
        _.each(that.editedItem, function (value, key, obj) {
          if (that.originData && obj[key] && that.originData[key] && obj[key] !== that.originData[key]) {
            result = true;
          }
        });
        return result;
      },

      // checkConfirmApply() {
      //   let that = this;
      //   _.each(that.editedItem, function (value, key, obj) {
      //     if (obj[key] !== that.originData[key]) {
      //       that.formDirty = true;
      //     }
      //   });
      //   if (that.formDirty && that.editedItem.added_by > 1) {
      //     that.dialogConfirmApply = true;
      //   } else {
      //     that.applyTemplate();
      //   }
      // },

      close() {
        this.reset();
        this.dialogConfirmClose = false;
        this.formDirty = false;
        if (this.dialogConfirmSaveEdit) {
          this.dialogConfirmSaveEdit = false;
        }
        this.deadline = '';
        this.start_date = '';
        this.subGoalArray = [];
        this.isAddSubGoal = false;
        this.denyEdit = false;
        this.isClosed = false;
        this.$emit('closePopup');
        this.reloadListCategory();
      },

      reset() {
        this.$nuxt.$loading.finish();
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          // this.$refs.form.reset();
          this.$refs.form.resetValidation();
          // this.filterEmployees();
        }, 300);
      },

      edit() {
        this.editedItem.requestEdit = true;
        this.checkDenyEdit();
      },

      saveEdit() {
        if (this.editedItem.status === this.statusNew) {
          this.save();
        } else {
          this.dialogConfirmSaveEdit = true;
        }
      },

      save() {
        let that = this;
        if (that.$refs.form.validate()) {
          if (that.checkSuperAdmin) {
            that.editedItem.is_shared = true;
            that.editedItem.is_public = true;
            that.editedItem.industry_id = that.editedItem.industry_id_arr.toString();
          }
          that.editedItem.start_date = that.editedItem.start_date_pre;
          that.editedItem.sub_goals = that.subGoalArray;
          that.$nuxt.$loading.start();
          if (that.editMode) {
            // edit goal
            if (that.editedItem.requestEdit && !that.denyEdit) {
              that.editedItem.status = 1;
            }
            that.$store.dispatch('goals/update', that.editedItem).then(function () {
              that.reloadList();
              that.reloadListCategory();
              that.$toaster.success(that.$i18n.t('message.success_goal_update'));
            }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_goal_update'));
              }
              // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
              that.$nuxt.$loading.finish();
            });
          } else {
            // create goal
            that.editedItem.status = 1;
            if (that.checkResource) {
              that.editedItem.is_template = true;
              that.editedItem.recurring = 'indefinite';
            }
            that.$store.dispatch('goals/store', that.editedItem).then(function () {
              that.reloadList();
              that.reloadListCategory();
              that.$toaster.success(that.$i18n.t('message.success_goal_add_new'));
            }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_goal_add_new'));
              }
              // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
              that.$nuxt.$loading.finish();
            });
          }
          that.close();
        }
      },

      reloadList() {
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

      closeApply() {
        this.dialogApply = false;
        this.changeTab(0);
      },

      requestDelete(type, subGoal, task) {
        this.requestDeleteType = type;
        if (this.requestDeleteType === 'sub goal') {
          this.requestDeleteSubGoal = subGoal;
        } else if (this.requestDeleteType === 'task') {
          this.requestDeleteSubGoal = subGoal;
          this.requestDeleteTask = task;
        }
        this.dialogDelete = true;
      },

      deleteItem() {
        if (this.requestDeleteType === 'object') {
          this.deleteGoal(this.editedItem);
          this.close();
        } else if (this.requestDeleteType === 'sub goal') {
          this.deleteTaskList(this.requestDeleteSubGoal);
        } else if (this.requestDeleteType === 'task') {
          this.deleteTaskItem(this.requestDeleteSubGoal, this.requestDeleteTask);
        }
        this.dialogDelete = false;
        this.requestDeleteType = '';
        this.requestDeleteSubGoal = '';
        this.requestDeleteTask = '';
      },

      deleteGoal(item) {
        let that = this;
        that.$store.dispatch('goals/delete', item.id).then(function() {
          that.reloadList();
          that.$toaster.success(that.$i18n.t('message.success_goal_delete'));
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_goal_delete'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          // that.$nuxt.$loading.finish();
        });
      },

      deleteTask(item) {
        this.formDirty = true;
        this.$store.dispatch('goals/deleteTask', item.id).then(function () {
          this.$toaster.success(this.$i18n.t('message.success'));
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          this.$toaster.error(this.$i18n.t('message.failed'));
          }
          // this.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        });
      },

      applyTemplate() {
        if (this.$refs.form.validate()) {
          let that = this;
          that.$nuxt.$loading.start();
          that.editedItem.status = 1;
          that.editedItem.is_template = false;
          that.editedItem.sub_goals = that.subGoalArray;
          if (!that.editedItem.parent_id) {
            that.editedItem.parent_id = that.editedItem.id;
          }
          that.$store.dispatch('goals/store', that.editedItem).then(function (result) {
            that.editedItem = result.data;
            that.checkResource = false;
            that.subGoalArray = [];
            that.reloadList();
            that.changeTab(0);
            that.$toaster.success(that.$i18n.t('message.success_goal_add_new'));
          }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_goal_add_new'));
            }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish();
          });
          that.close();
        }
      },

      saveAndApply() {
        // create template
        if (this.$refs.form.validate()) {
          let that = this;
          that.$nuxt.$loading.start();
          that.editedItem.status = 1;
          if (that.checkResource) {
            that.editedItem.is_template = true;
          }
          that.editedItem.sub_goals = that.subGoalArray;
          that.$store.dispatch('goals/store', that.editedItem).then(result => {
            that.editedItem.parent_id = result.data.id;
            that.applyTemplate();
            that.$nuxt.$loading.finish();
          }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_goal_add_new'));
            }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish();
          });
        }
      },

      updateAndApply() {
        if (this.$refs.form.validate()) {
          let that = this;
          that.dialogConfirmApply = false;
          that.$nuxt.$loading.start();
          that.editedItem.status = 1;
          if (that.checkResource) {
            that.editedItem.is_template = true;
          }
          that.editedItem.sub_goals = that.subGoalArray;
          that.$store.dispatch('goals/update', that.editedItem).then(result => {
            that.editedItem.parent_id = result.data.id;
            that.applyTemplate();
            that.$nuxt.$loading.finish();
          }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_goal_update'));
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
        this.$emit('showItem', item);
      },

      // add sub goad
      addSubGoal() {
        this.isAddSubGoal = true;
      },

      addSubGoalName() {
        this.subGoalData.tasks = [];
        let newData = _.clone(this.subGoalData);
        this.subGoalArray.push(newData);
        this.isAddSubGoal = false;
        this.subGoalData.name = "";
      },

      cancelSubGoalName() {
        this.isAddSubGoal = false;
      },

      // add TASKS in sub goal
      deleteTaskList(item) {
        this.formDirty = true;
        this.subGoalArray.splice(this.subGoalArray.indexOf(item), 1);
      },

      deleteTaskItem(item, task) {
        this.formDirty = true;
        item.tasks.splice(item.tasks.indexOf(task), 1);
      },

      addNewTask(index) {
        this.isAddTask = true;
        this.subGoalArray[index].tasks.push({
          name: "",
          assigned_company: false,
          assigned_employee: [],
          assigned_department: []
        });
      },

      // dropdown assignee to EMPLOYEE
      likesAllAssignee(item) {
        return item.assigned_employee.length === this.taskAssigneesArray.length;
      },

      likesSomeAssignee(item) {
        return item.assigned_employee.length > 0 && !this.likesAllAssignee(item);
      },

      icon(item) {
        if (this.likesAllAssignee(item)) return 'mdi-close-box';
        if (this.likesSomeAssignee(item)) return 'mdi-minus-box';
        return 'mdi-checkbox-blank-outline';
      },

      toggle(item) {
        let that = this;
        this.$nextTick(() => {
          if (that.likesAllAssignee(item)) {
            item.assigned_employee = [];
          } else {
            item.assigned_employee = [];
            _.each(that.taskAssigneesArray, function (task) {
              item.assigned_employee.push(task.id);
            });
          }
        });
      },

      // dropdown assignee to DEPARTMENT
      likesAllDepartment(item) {
        return item.assigned_department.length === this.departmentsArray.length;
      },

      likesSomeDepartment(item) {
        return item.assigned_department.length > 0 && !this.likesAllDepartment(item);
      },

      icon1(item) {
        if (this.likesAllDepartment(item)) return 'mdi-close-box';
        if (this.likesSomeDepartment(item)) return 'mdi-minus-box';
        return 'mdi-checkbox-blank-outline';
      },

      toggleDepartment(item) {
        let that = this;
        this.$nextTick(() => {
          if (that.likesAllDepartment(item)) {
            item.assigned_department = [];
          } else {
            item.assigned_department = [];
            _.each(that.departmentsArray, function (task) {
              item.assigned_department.push(task.id);
            });
          }
        });
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

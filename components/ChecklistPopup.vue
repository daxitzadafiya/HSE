<template>
  <div>
    <v-dialog v-model="openPopup" max-width="1125px" persistent>
      <v-card>
        <v-card-text>
          <div class="popup-header text-center">
            {{ formTitle }}
          </div>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <b-row
              v-if="editMode && checkResource && editedItem?.count_related_object > 0
              && (editedItem?.added_by !== 1 || (editedItem?.added_by === 1 && checkSuperAdmin))"
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
            <b-row align-h="center">
              <b-col :cols="checkSuperAdmin ? 6 : 12">
                <div class="input-wrap">
                  <v-text-field
                    v-model="editedItem.name"
                    :label="$t('form.name')"
                    name="name"
                    :rules="required"
                    outlined
                    :readonly="checkAddReport || !editedItem?.editPermission"
                  />
                </div>
              </b-col>
              <b-col v-if="checkSuperAdmin" :cols="checkSuperAdmin ? 6 : 12">
                <div class="input-wrap industry-select-input-wrap">
                  <MultipleSelection
                    :selected-items-input="editedItem?.industry_id_arr"
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
              :type-category="category_checklist"
              :is-open-popup="openPopup"
              :view-only="checkAddReport || !editedItem?.editPermission"
              @getNewCategory="getNewCategory"
              class="pr-12"
            />
            <b-row class="section-description">
              <b-col>
<!--                <v-icon class="icon-question">far fa-question-circle</v-icon>-->
                <div class="input-wrap form-description">
<!--                  <vue-editor-->
<!--                    v-model="editedItem.description"-->
<!--                    :disabled="checkAddReport || !editedItem.editPermission"-->
<!--                  />-->
                  <FroalaSuggestionListEditor
                    :item="editedItem"
                    :predefined-link-array="predefinedLinkArray"
                  />
                </div>
              </b-col>
            </b-row>
            <connect-to-object v-if="!checkSuperAdmin"
                :ctoFunctionProp="ctoFunction"
                :categoryProp="category"
                :connectToObjectTableProp="connectToObjectTable"
                :objectProp="object"
                :connectToObjectTableHeadersProp="connectToObjectTableHeaders"
                @editConnectToObject="editConnectToObject"
                @addConnectToObject="addConnectToObject"
                @deleteCto="deleteCtoItem"
                class="checklist-modal mt-2"
                @getConnectToArray="getConnectToArray" 
                :isEmptyData="openPopup" 
                :connectToArrayInput="connectToArray"
              />
            <Security
              v-if="!checkSuperAdmin && checkShowConnectTo"
              :security-item="editedItem"
              :edit-mode="editMode"
              :isInstructionObject="true"
              @changeSecurity="changeSecurity"
            />
            <Responsible
              v-if="!checkSuperAdmin && !checkResource"
              :object-item="editedItem"
              :is_routine="true"
              :edit-mode="editMode"
              :noRequiredAction="true"
            />
            <ChecklistTopic
            :topicArray="topicArray"
            :editedItem="editedItem"
            :viewOnly="viewOnly"
            :answerArray="answerArray"
            :rules="required"
            :checkApplyItem="checkApplyItem"
            @reloadAnswerOptionsList="reloadAnswerOptionsList"
            />

            <!-- <div class="manage-task mt-6">
              <b-row>
                <b-col v-for="(item, index) in topicArray" :key="index" cols="12" class="mb-5 mt-5">
                  <div class="section-connect-to section-connect-to-checklist-topic">
                    <div class="section-connect-to-label section-connect-to-label-checklist add-new-section display-inline-flex">
                      <v-text-field
                        v-model="item.name"
                        :label="$t('form.topic')"
                        :rules="required"
                        outlined
                        :readonly="!editedItem.editPermission"
                      />
                      <v-icon v-if="!checkAddReport || editedItem.editPermission" class="ml-5 icon-checklist-topic-delete" @click="deleteTopicList(item)">
                        delete
                      </v-icon>
                    </div>

                    <v-btn v-if="!checkAddReport || editedItem.editPermission" class="add-new-down-title btn-add-new-checklist-checkpoint" @click="addNewQuestion(index)">
                      + {{ $t('button.checkpoint') }}
                    </v-btn>

                    <div class="padding-15-checklist">
                      <v-expansion-panels v-if="isAddNewCheckpoint">
                        <v-expansion-panel
                          v-for="(question) in item.questions"
                          :key="question.questions"
                        >
                          <v-expansion-panel-header>
                            <span v-if="!question.name">{{ $t('title.add_new_checkpoint') }}</span>
                            <span v-if="question.name">{{ question.name }}</span>
                          </v-expansion-panel-header>
                          <v-expansion-panel-content>
                            <b-row align-h="center">
                              <b-col cols="12">
                                <div class="input-wrap">
                                  <v-text-field
                                    v-model="question.name"
                                    :label="$t('form.name')"
                                    :rules="required"
                                    outlined
                                    :readonly="!editedItem.editPermission"
                                  />
                                </div>
                              </b-col>
                            </b-row>
                            <b-row>
                              <b-col cols="2">
                                <div class="department-title-with-new">
                                  Option
                                </div>
                                <v-btn :disabled="viewOnly || !editedItem.editPermission" class="add-new-down-title" @click="dialogNewOption = true">
                                  + {{ $t('button.new_option') }}
                                </v-btn>
                              </b-col>
                              <b-col cols="10">
                                <div class="input-wrap">
                                  <v-select
                                    v-model="question.default_option_id"
                                    :items="answerArray"
                                    item-text="option_name"
                                    item-value="id"
                                    label="Options"
                                    outlined
                                    :rules="required"
                                    :readonly="!editedItem.editPermission"
                                  />
                                </div>
                              </b-col>
                            </b-row>
                            <v-card-actions>
                              <v-spacer />
                              <v-btn v-if="!checkAddReport || !editedItem.editPermission" class="hse-btn-delete" text @click="deleteQuestionItem(item, question)">
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
              <b-row>
                <b-col cols="3">
                  <v-btn v-if="!checkAddReport && editedItem.editPermission" class="btn-create-task" @click="addMoreTopic">
                    {{ $t('button.add_topic') }}
                  </v-btn>
                </b-col>
                <b-col v-if="isShowInputTopic && !checkAddReport && editedItem.editPermission" cols="9" class="mt-2">
                  <div class="connect-department">
                    <div class="department d-flex">
                      <v-text-field v-model="newTopicData.name" :rules="required" outlined />
                      <span class="department-button">
                        <v-btn class="mb-2 btn-add-department" @click="addNewTopicName">
                          {{ $t('button.add') }}
                        </v-btn>
                        <v-btn class="mt-1 mb-2 btn-cancel-department" @click="cancelNewTopicName">
                          {{ $t('button.cancel') }}
                        </v-btn>
                      </span>
                    </div>
                  </div>
                </b-col>
              </b-row>
            </div> -->
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
          <v-btn v-if="roleUser !== 'user'" class="btn-cancel" text @click="close('closePopup')">
            {{ $t('button.cancel') }}
          </v-btn>
          <v-btn v-else class="btn-cancel" text @click="close">
            OK
          </v-btn>
          <v-btn
            v-if="editMode && checkResource && (checkAdmin || permissionsUser.indexOf(',checklist-resource') > -1) && editedItem?.editPermission"
            class="btn-save"
            @click="applyTemplate"
          >
            {{ $t('button.apply') }}
          </v-btn>
          <v-btn
            v-if="!editMode
            && checkResource
            && (checkAdmin || permissionsUser?.indexOf(',checklist-resource') > -1)
            && !viewOnly
            && editedItem?.editPermission"
            class="hse-btn-save"
            @click="saveAndApply"
          >
            {{ $t('button.save_and_apply') }}
          </v-btn>
          <!-- <v-btn
            v-if="!checkResource
            && !checkAddReport
            && !viewOnly"
            v-model="checkAddReport"
            class="hse-btn-save bg-white shadow-none"
            @click="checkAddReportClick">
            {{ $t('button.use_checklist') }}
          </v-btn> -->
          <v-btn
            v-if="(checkSuperAdmin || (!checkAddReport && ((!checkResource && (checkAdmin || permissionsUser.indexOf(',checklist-basic') > -1)) || (!editMode && checkResource && (checkAdmin || permissionsUser.indexOf(',checklist-resource') > -1))) && !viewOnly)) && editedItem?.editPermission"
            class="btn-save"
            @click="save"
          >
            {{ $t('button.save') }}
          </v-btn>
<!--          v-if="editMode && (userRoleId === 1 || (!checkAddReport && ((checkResource && (checkAdmin || permissionsUser.indexOf(',checklist-resource') > -1)) || (!checkResource && (checkAdmin || permissionsUser.indexOf(',checklist-basic') > -1)))))"-->
            <!-- v-if="editMode && !checkAddReport
            && ((checkResource && ((!editedItem.company_id && checkSuperAdmin) || (editedItem.company_id && (checkAdmin || permissionsUser.indexOf(',checklist-resource') > -1))))
            || (!checkResource && (checkAdmin || permissionsUser.indexOf(',checklist-basic') > -1)))
            && editedItem.editPermission" -->
          <!-- <v-btn
            class="hse-btn-delete"
            @click="dialogDelete = true"
          >
            <v-icon dark>
              mdi-delete
            </v-icon>
          </v-btn> -->
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
            {{ $t('button.no') }}
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
            <p>Your checklist has successfully been applied to your active checklists.</p>
            <p class="text-center">
              <v-btn class="btn-default" text @click="editItem(editedItem); dialogApply = false">
                Click here to review checklist
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

    <v-dialog v-model="dialogReportChecklist" max-width="1125px" persistent>
      <v-card>
        <v-card-text>
          <div class="popup-header text-center">
            {{ formReportTitle }}
          </div>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <b-row align-h="center">
              <b-col cols="12">
                <div class="input-wrap">
                  <v-text-field v-model="editedItem.name" :label="$t('form.name')" name="name" outlined  />
                </div>
              </b-col>
            </b-row>
            <category
              :category-item="editedItem"
              :categories-array="categoriesValidArray"
              :type-category="category_checklist"
              :is-open-popup="openPopup"
              @getNewCategory="getNewCategory"
            />
            <b-row class="section-description">
              <b-col>
<!--                <v-icon class="icon-question">far fa-question-circle</v-icon>-->
                <div class="input-wrap form-description">
<!--                  <vue-editor v-model="editedItem.description" disabled />-->
                  <FroalaSuggestionListEditor
                    :item="editedItem"
                    :predefined-link-array="predefinedLinkArray"
                  />
                </div>
              </b-col>
            </b-row>
<!--            <connect_to-->
<!--              v-if="checkShowConnectTo"-->
<!--              :edited-item="editedItem"-->
<!--              :departments-array="departmentsArray"-->
<!--              :job-title-array="jobTitleArray"-->
<!--              :project-array="projectArray"-->
<!--              :deny-edit="false"-->
<!--              @updateConnect="checkUpdateConnect"-->
<!--            />-->
            <Security
              v-if="!checkSuperAdmin && checkShowConnectTo"
              :security-item="editedItem"
              :edit-mode="editMode"
              @changeSecurity="changeSecurity"
            />

            <div class="section-connect-to mt-10">
          <div class="section-connect-to-label">
            Topic Name
          </div>

      <b-row class="mt-3">
        <b-col cols="12">
          <div  class="section-connect-to mb-4">
            <div class="section-connect-to-label">
              Checkpoint Name
            </div>
            <b-row class="pt-3 mt-3">
              <b-col>
                <div class="input-wrap industry-select-input-wrap">
                  <MultipleSelection
                    :selected-items-input="editedItem?.industry_id_arr"
                    :item-text="'name'"
                    :item-value="'id'"
                    :label="'Choose Option for this checkpoint ...'"
                    :list-option-input="industryArray"
                    @getSelectedItems="getSelectedIndustryItems"
                  />

              <RequiredAction
            :object-item="editedItem"
            :useChecklistOption="true"
            @closePopup="closePopup"
        />

                </div>
              </b-col>
            </b-row>
          </div>
        </b-col>
      </b-row>
    </div>

            <!-- <div class="manage-task mt-6">
              <b-row>
                <b-col v-for="item in topicArray" :key="item.name" cols="12" class="mb-3">
                  <div class="section-connect-to section-connect-to-checklist-topic pb-4 pt-4">
                    <div class="section-connect-to-label section-connect-to-label-checklist">{{ item.name }}</div>

                    <div class="padding-15-checklist">
                      <v-expansion-panels class="hse-use-checklist-expansion-panels">
                        <v-expansion-panel v-for="(question) in item.questions" :key="question.questions">
                          <v-expansion-panel-header>
                            <b-row>
                              <b-col cols="10">
                                <b-row>
                                  <b-col cols="7" class="hse-margin-auto">
                                    <div v-if="question.name">{{ question.name }}</div>
                                  </b-col>
                                  <b-col cols="5">
                                    <div v-if="question.type_of_option_answer === 2">
                                      <v-select
                                        v-model="question.answer"
                                        item-value="id"
                                        item-text="name"
                                        label="Choose option"
                                        :items="question.option_answers"
                                        :rules="required"
                                        outlined
                                        class="use-checklist-topic-question-choose-answers"
                                        @change="addAnswer(item.id, question.id, question, null)"
                                        @click.native.stop
                                      />
                                    </div>
                                    <div v-if="question.type_of_option_answer === 1" class="switch-component document-type-wrap">
                                      <label class="left-text">{{ question.option_answers[0].name }}</label>
                                      <v-switch
                                        v-model="question.answer"
                                        :label="question.option_answers[1].name"
                                        class="right-text"
                                        @change="formatAnswerWithTypeBoolean(item.id, question, question.answer)"
                                        @click.native.stop
                                      />
                                    </div>
                                  </b-col>
                                </b-row>
                              </b-col>
                            </b-row>
                          </v-expansion-panel-header>
                          <v-expansion-panel-content>
                            <b-row align-h="center">
                              <b-col cols="10">
                                <div class="input-wrap">
                                  <v-text-field
                                    v-model="question.description"
                                    label="Comment"
                                    outlined
                                    class="use-checklist-topic-question-choose-answers"
                                    @change="addAnswer(item.id, question.id, null, question.description)"
                                  />
                                </div>
                              </b-col>
                              <b-col cols="2" class="hse-margin-auto text-right">
                                <v-btn class="add-new-down-title" @click="addPicture(question.id)">
                                  + Picture
                                </v-btn>
                              </b-col>
                            </b-row>
                            <b-row :id="'upload_picture_' + question.id" class="d-none">
                              <b-col cols="12">
                                <div class="section-connect-to section-upload-document">
                                  <div class="section-connect-to-label">Upload attachment</div>
                                  <div class="mt-5 input-wrap">
                                    <v-file-input
                                      v-model="question.picture"
                                      :accept="file_accept"
                                      @change="uploadPicture(question.id, question.picture)"
                                    />
                                  </div>
                                </div>
                              </b-col>
                            </b-row>
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </div>
                  </div>
                </b-col>
              </b-row>
            </div> -->
          </v-form>
        </v-card-text>
        <v-card-actions class="popup-footer">
          <v-spacer />
          <v-btn class="btn-cancel" text @click="checkDirtyBeforeClose">
            {{ $t('button.cancel') }}
          </v-btn>
          <v-btn class="btn-save" @click="save">
            {{ $t('button.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- <AnswerOptionPopup
      :open-popup="dialogNewOption"
      :resource="userRoleId === 1"
      @closePopup="dialogNewOption = !dialogNewOption"
      @reloadAnswerOptionsList="reloadAnswerOptionsList"
    /> -->

    <v-dialog v-model="dialogRelatedObjects" max-width="700px">
      <v-card class="dialog-delete">
        <v-card-text>
          <div class="text-center confirm-delete-title">
            Associated objects
          </div>
          <v-list-item
            v-for="(item, index) in editedItem?.related_objects" :key="index"
            two-line
          >
            <v-list-item-content>
              <v-list-item-title>{{ item?.name }}</v-list-item-title>
              <v-list-item-subtitle>
                <span class="mr-3">ID: {{ item?.id }}</span>
                <span class="mr-3">Added by: {{ item?.added_by_first_name }} {{ item?.added_by_last_name }}</span>
                <span v-if="checkSuperAdmin">Company: {{ item?.company_name }}</span>
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
  import {_} from 'vue-underscore';
  // import ConnectTo from "./ConnectTo";
  import Category from "./Category";
  // import AnswerOptionPopup from "./AnswerOptionPopup";
  import cookies from "js-cookie";
  import MultipleSelection from "./MultipleSelection";
  import Security from "./Security";
  import FroalaSuggestionListEditor from "./FroalaSuggestionListEditor";
  import ConnectToObject from "./ConnectToObject.vue"
  import ChecklistTopic from "./ChecklistTopic.vue"
  import RequiredAction from "./RequiredAction"
import Responsible from './Responsible.vue';
import { removeTagsFromString } from "./common/js/functions"
import api from '~/apis';
  export default {
    name: "ChecklistPopup",
    components: {
      // connect_to: ConnectTo,
      category: Category,
      // AnswerOptionPopup,
      MultipleSelection,
      Security,
      FroalaSuggestionListEditor,
      ConnectToObject,
      ChecklistTopic,
      RequiredAction,
        Responsible
    },
    props: {
      resource: {
        type: Boolean,
        required: false,
      },
      checklistItem: {
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
      listAnswerArray: Array,
      viewOnly: {
        type: Boolean,
        required: false,
      },
      predefinedLinkArray: {
        type: Array,
        required: false,
      },
      checkApplyItem:{
        type: Boolean,
        required: false,
      }
    },
    data: () => ({
      permissionsUser: localStorage.getItem('permissionsKey'),
      checkAdmin: cookies.get('checkAdmin'),
      checkSuperAdmin: cookies.get('checkSuperAdmin'),
      roleUser: cookies.get('roleUser'),
      userRoleId: parseInt(cookies.get('roleID')),
      userDepartmentID: parseInt(cookies.get('userDepartmentID')),
      search: '',
      valid: true,
      checkAction:false,
      ctoFunction: [
        { id: "Task", name: 'task' },
        { id: "Goal", name: 'goal' },
        { id: "Routine", name: 'routine' },
        { id: "Instruction", name: 'instruction' },
        { id: "Risk element source", name: 'risk' },
        { id: "Checklist", name: 'checklist' },
        { id: "Attachment", name: 'attachment' },
        { id: "Document", name: 'document' },
        { id: "Contact", name: 'contact' },
        { id: "Deviation", name: 'deviation' },
      ],
      category: [],
      connectToObjectTable: [],
      object: [],
      connectToObjectFrom: { document_id: '', connectToArray: [], object_id: '' },
      editedItem: {
        name: "",
        type:'checklist',
        description: "",
        category_id: "",
        company_id: "",
        status: "New",
        added_by: "",
        department_id: "",
        job_title_id: '',
        is_template: false,
        parent_id: '',
        count_related_object: 0,
        related_objects: [],
        industry_id: '',
        industry_id_arr: [],
        editPermission: true,
        is_suggestion: false,
        // table Security
        object_type: 'Checklist',
        is_shared: false,
        is_public: false,
        department_array: [],
        employee_array: [],
        isDefaultAttendee:false,
        connectToArray: [],
        source_id:'',
        resource_id:'',
        object_id: "",
        isDefaultResponsible:false,
        // responsible_required_comment
      },
      defaultItem: {
        name: "",
        description: "",
        type:'checklist',
        category_id: "",
        company_id: "",
        object_id: "",
        status: "New",
        added_by: "",
        department_id: "",
        job_title_id: '',
        is_template: false,
        parent_id: '',
        count_related_object: 0,
        related_objects: [],
        industry_id: '',
        industry_id_arr: [],
        editPermission: true,
        is_suggestion: false,
        // table Security
        object_type: 'Checklist',
        is_shared: false,
        is_public: false,
        department_array: [],
        employee_array: [],
        isDefaultAttendee:false,
        connectToArray: [],
        source_id:'',
        resource_id:'',
        isDefaultResponsible:false
      },
      objectData:{
        connect_to_source:'task',
        source_id:''
      },
      connectToArray: [],
      headerTopicArray: [
        {text: 'Topic', value: 'name', sortable: false, align: 'center', width: '40%'},
        {text: 'Action', value: 'action', sortable: false, align: 'center', width: '8%'},
      ],
      topicArray: [],
      isShowInputTopic: false,
      // real data
      required: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else return true;
        }
      ],
      templates: [],
      taskAssigneesArray: [],
      dialogDelete: false,
      dialogApply: false,
      dialogConfirmApply: false,
      dialogConfirmClose: false,
      formDirty: false,
      newTopicData: {
        name: "",
        questions: [],
      },
      defaultTopicData: {
        name: "",
        questions: [],
      },
      category_checklist: 'checklist',
      answerArray: [],
      newAnswer: {
        topic_id: "",
        question_id: "",
        answer: "",
        description: "",
        action: "",
        task_id: "",
        risk_id: "",
      },
      defaultAnswer: {
        topic_id: "",
        question_id: "",
        answer: "",
        description: "",
        action: "",
        task_id: "",
        risk_id: "",
      },
      newReportData: {
        checklist: "",
        status: 1,
        department: "",
        job_title: '',
        answers: [],
      },
      defaultReportData: {
        checklist: "",
        status: 1,
        department: "",
        job_title: '',
        answers: [],
      },
      reportArray: [],
      checkAddReport: false,
      dialogReportChecklist: false, // dialog for Use checklist
      selectedFile: [],
      document_type: 'report',
      document_added_from: 'checklist',
      // document_added_from: 6, // checklist

      // New CHECKPOINT
      isAddNewCheckpoint: false,
      headersCheckpointOptions: [
        {text: 'Slider', align: 'left', value: 'slider'},
        {text: 'Dropdown', align: 'left', value: 'dropdown'}
      ],
      listCheckpointOptions: [],

      // OPTIONS create for each checkpoint
      dialogNewOption: false,
      newDefaultOptionIndex: -1,
      newDefaultOption: {
        name: '',
        type_of_option_answer: '',
        company_id: '',
        checklist_id: '',
        answer: [],
        is_template: true,
      },
      defaultDefaultOption: {
        name: '',
        type_of_option_answer: '',
        company_id: '',
        checklist_id: '',
        answer: [],
        is_template: true,
      },
      optionAnswerType: false,
      headerOptionAnswerArray: [
        {text: '', align: 'center', value: 'drag', sortable: false},
        {text: 'Name', align: 'center', value: 'name', sortable: false},
        {text: 'Arrangement', align: 'center', value: 'arrangement_order', sortable: false},
        {text: 'Action', align: 'center', value: 'action', sortable: false},
      ],
      optionAnswerArray: [],
      newOptionAnswer: {
        name: '',
        arrangement_order: ''
      },
      defaultOptionAnswer: {
        name: '',
        arrangement_order: ''
      },
      is_template_option: 1,
      hoverActionForNewDefaultOption: false,
      isAddNewTemplateOption: false,

      // Default options table
      answerOptionsArray: [], // tab Answer Options display full list
      headerDefaultOptionsArray: [
        {text: 'Name', align: 'center', value: 'name', sortable: false},
        {text: 'Type', align: 'center', value: 'type_of_option_answer', sortable: false},
        {text: 'Options', align: 'center', value: 'count_option_answers', sortable: false},
        // {text: 'Action', align: 'center', value: 'action', sortable: false},
      ],

      // Use checklist
      file_accept: "image/png, image/jpeg, image/jpg, image/gif",

      checkResource: false,
      checkShowConnectTo: true,
      editMode: true,
      formTitle: '',
      categoriesValidArray: [],
      dialogRelatedObjects: false,
      hoverQuestionMark: false,
      isCreatedCto:false,
      isEditCto:false,
      objectResource_id:''
    }),

    computed: {
      formReportTitle() {
        return 'Use checklist';
      },
      connectToObjectTableHeaders() {
        return [
          {text: this.translateCol('name'), value: 'name'},
          {text: this.translateCol('source'), value: 'source'},
          {text: this.translateCol('category'), value: 'category'},
          {text: this.translateCol('added_by'), value: 'added'},
          {text: this.translateCol('connected_by'), value: 'connectedBy'},
          {text: this.translateCol('connected_date'), value: 'connectDate'},
          {text: this.translateCol('actions'), value: 'actions'},
        ];
      },
    },


    watch: {
      openPopup(value) {
        if (value) {
          this.reset()
          if (this.checklistItem) {
            let categoryId = this.checklistItem.category_id;
            this.categoriesValidArray = _.filter(this.categoriesArray, function (item) {
              return (!item.disable_status || (item.disable_status && item.id === categoryId));
            });
            this.editItem(this.checklistItem);
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

      listAnswerArray(value) {
        if (value) {
          this.answerArray = value;
        }
      },
    },

    created() {
      if (this.openPopup) {
        if (this.checklistItem) {
          this.editItem(this.checklistItem);
        } else {
          this.addNew();
        }
      }

      if (this.resource) {
        this.checkResource = this.resource;
      }

      if (this.listAnswerArray && this.listAnswerArray.length > 0) {
        this.answerArray = this.listAnswerArray;
      }
    },

    methods: {
       getConnectToArray(data){
           this.connectToArray = [];
           this.connectToArray = data;
       },
      translateCol (colName) {
          return this.$i18n.t('column.' + colName);
        },
      changeSecurity(val) {
        if (val !== 'all') {
          this.editedItem.is_suggestion = false;
        }
      },
      resetConnectToObjectFrom(){
         this.connectToObjectFrom.document_id=''
         this.connectToObjectFrom.connectToArray=[]
      },

      editConnectToObject(payload) {
        this.isEditCto=true
        this.resetConnectToObjectFrom()
        this.connectToObjectFrom.connectToArray=payload
        // this.connectToObjectFrom.object_id=payload.object_id
      },

      addConnectToObject(payload) {
        this.isCreatedCto=true
        this.connectToArray=payload
        this.resetConnectToObjectFrom()
        this.connectToObjectFrom.connectToArray.push(payload.connectToArray)
        this.connectToObjectFrom.object_id=payload.object_id
      },
       saveConnectToObject(type,id){
        try {
          if(this.connectToObjectTable.length + this.connectToArray.length <= 5)
            api.connectToObject.store(type, id, {"connectToArray":this.connectToArray});
          else
          this.$toaster.error(this.$i18n.t('message.connect_to_object_limit'));
        } catch (error) {
          this.$toaster.error(this.$i18n.t('message.fail_connect_to_object'));
          console.log(error);
        }
      },

      // this is use for update CTO with the APIS
      editConnectToObjectData(data,id){
         try {
          if(this.connectToObjectTable.length + this.connectToArray.length <= 5)
          api.connectToObject.update("checklist", id, data);
           else
          this.$toaster.error(this.$i18n.t('message.connect_to_object_limit'));
         } catch (error) {
          this.$toaster.error(this.$i18n.t('message.fail_connect_to_object_update'));
         }
      },
       deleteCtoItem(id){
        let that = this;
         try {
          api.connectToObject.delete(id).then(res=>{
            console.log("res",res);
           that.$toaster.success('connect to object data deleted');
            if (that.checklistItem) {
            that.fetchConnectToObjectById(that.checklistItem.id)
            that.editItem(that.checklistItem);
          }
          });
        } catch (error) {
           that.$toaster.error('connect to object data not deleted');
           console.log(error);
        }
        },
      reloadList(){
        this.$emit('reloadList');
      },

      reloadAnswerOptionsList() {
        this.$emit('reloadAnswerOptionsList');
      },

      reloadOptionsAfterCancel() {
        this.$emit('reloadOptionsAfterCancel');
      },

      reloadListCategory(){
        this.$emit('reloadListCategory');
      },

      getNewCategory(value) {
        this.editedItem.category_id = value.newCategoryId;
      },

      addNew() {
        this.reset();
        this.topicArray.push({name: "",questions:[{name:"",default_option_id:"",option_answers:"",required_comment:"",required_attachment:"",checklist_required_comment:"",checklist_required_attachment:""}]})
        this.$nuxt.$loading.start();
        if (this.checkResource) {
          this.formTitle = this.$i18n.t('title.new_checklist_resource');
        } else {
          this.formTitle = this.$i18n.t('title.new_checklist');
        }
        let defaultCategory = _.findWhere(this.categoriesValidArray, {is_primary: 1});
        if (defaultCategory) {
          this.editedItem.category_id = defaultCategory.id;
        }
        this.checkShowConnectTo = !this.checkResource;
        this.editMode = false;

        // list checklist Default OPTIONS list
        
      if (this.checkSuperAdmin) {
        
        this.$store.dispatch('options/index', {checkOptionsList: true}).then(result => {
          this.answerArray = _.sortBy(result.data, function(answer) {
            return answer.count_used_time;
            // return answer;
          });
          this.formatNameOfDefaultOptionType(this.answerArray.reverse());
          this.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          this.$toaster.error(this.$i18n.t('message.fail_checklist_option_view'));
          }
          // this.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          this.$nuxt.$loading.finish();
        });
      }else{
        this.$store.dispatch('options/index', {isNewChecklist: true}).then(result => {
          this.answerArray = _.sortBy(result.data, function(answer) {
            return answer.count_used_time;
            // return answer;
          });
          this.formatNameOfDefaultOptionType(this.answerArray.reverse());
          this.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          this.$toaster.error(this.$i18n.t('message.fail_checklist_option_view'));
          }
          // this.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          this.$nuxt.$loading.finish();
        });

      }
      },

      checkAddReportClick(){
        this.checkAddReport = true;
        this.dialogReportChecklist = true;
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
        that.formTitle = that.$i18n.t('title.new_checklist');
        that.formDirty = false;
        that.$nuxt.$loading.start();
        that.$store.dispatch('checklists/show', item.id).then(result => {
          that.editedItem = Object.assign({}, result.data);
          that.objectResource_id = result.data.id
          // that.editedItem.description = ""  //----> uncomment this line when run local API
          // const htmlString = result.data.description;
          // that.editedItem.description = htmlString.replace(/<[^>]+>/g, '');
          if (that.checkSuperAdmin) {
            that.editedItem.industry_id_arr = that.formatNullArray(that.formatFromStringToArray(that.editedItem.industry_id));
          }
          that.$nuxt.$loading.finish();
          // list topics
          that.$store.dispatch('topics/index', {checklist: that.editedItem.id}).then(topic => {
            that.topicArray = topic.data;
            _.each(that.topicArray, function (topicItem) {
              if (topicItem.questions.length > 0) {
                that.isAddNewCheckpoint = true;
              }
              _.each(topicItem.questions, function (question) {
                // question.required_attachment = that.editedItem.use_checklist_required_attachment
                // question.required_comment = that.editedItem.use_checklist_required_comment
                question.option_answers.sort(function (a, b) {
                  return (a.arrangement_order - b.arrangement_order);
                });
              });
            });
            that.$nuxt.$loading.finish();
          }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_checklist_topic_view'));
          }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish();
          });
          that.newReportData.checklist = that.editedItem.id;

          // // list checklist options
          // that.$store.dispatch('options/index', {checklistID: that.editedItem.id}).then(option => {
          //   that.answerArray = _.sortBy(option.data, function(answer) {
          //     return answer.count_used_time;
          //   });
          //   that.formatNameOfDefaultOptionType(that.answerArray.reverse());
          // }).catch(() => {
          //   that.$toaster.error(that.$i18n.t('message.fail_checklist_option_view'));
          //   // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          //   that.$nuxt.$loading.finish();
          // });
          this.$store.dispatch('options/index', {isNewChecklist: true}).then(result => {
          this.answerArray = _.sortBy(result.data, function(answer) {
            return answer.count_used_time;
            // return answer;
          });
          this.formatNameOfDefaultOptionType(this.answerArray.reverse());
          this.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          this.$toaster.error(this.$i18n.t('message.fail_checklist_option_view'));
          }
          // this.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          this.$nuxt.$loading.finish();
        });
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_checklist_view_detail'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });

        // that.$store.dispatch('topics/index', {checklist: that.editedItem.id}).then(topic => {
        //     that.topicArray = topic.data;
        //     _.each(that.topicArray, function (topicItem) {
        //       if (topicItem.questions.length > 0) {
        //         that.isAddNewCheckpoint = true;
        //       }
        //       _.each(topicItem.questions, function (question) {
        //         question.required_attachment = that.editedItem.use_checklist_required_attachment
        //         question.required_comment = that.editedItem.use_checklist_required_comment
        //         question.option_answers.sort(function (a, b) {
        //           return (a.arrangement_order - b.arrangement_order);
        //         });
        //       });
        //     });
        //     that.$nuxt.$loading.finish();
        //   }).catch(() => {
        //     that.$toaster.error(that.$i18n.t('message.fail_checklist_topic_view'));
        //     // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        //     that.$nuxt.$loading.finish();
        //   });
        //   that.newReportData.checklist = that.editedItem.id;

        //   // list checklist options
        //   that.$store.dispatch('options/index', {checklistID: that.editedItem.id}).then(option => {
        //     that.answerArray = _.sortBy(option.data, function(answer) {
        //       return answer.count_used_time;
        //     });
        //     that.formatNameOfDefaultOptionType(that.answerArray.reverse());
        //   }).catch(() => {
        //     that.$toaster.error(that.$i18n.t('message.fail_checklist_option_view'));
        //     // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        //     that.$nuxt.$loading.finish();
        //   });
        // }).catch(() => {
        //   that.$toaster.error(that.$i18n.t('message.fail_checklist_view_detail'));
        //   // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        //   that.$nuxt.$loading.finish();
        // });
        // that.originData = _.clone(that.editedItem);
      },


      deleteTopicList(item) {
        this.formDirty = true;
        this.topicArray.splice(this.topicArray.indexOf(item), 1);
      },

      deleteQuestionItem(item, question) {
        this.formDirty = true;
        item.questions.splice(item.questions.indexOf(question), 1);
      },

      deleteItem(item) {
        this.deleteChecklist(item);
        this.dialogDelete = false;
        this.close();
      },

      deleteChecklist(item) {
        let that = this;
        that.$store.dispatch('objects/delete', item.id).then(function () {
          that.reloadList();
          that.$toaster.success(that.$i18n.t('message.success_checklist_delete'));
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_checklist_delete'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          // that.$nuxt.$loading.finish();
        });
      },

      close(item) {
        this.connectToArray = [];
        this.reset();
        this.dialogConfirmClose = false;
        this.formDirty = false;
        if (this.dialogReportChecklist) {
          this.dialogReportChecklist = false;
        }
        this.reloadOptionsAfterCancel();
        if(item==='closePopup')
        {
          this.$emit('closePopup');
        }

        this.reloadListCategory();
      },
      closePopup()
      {
        if(this.editedItem.use_checklist_required_attachment)
        this.editedItem.use_checklist_required_attachment=false

        if(this.editedItem.use_checklist_required_comment)
        this.editedItem.use_checklist_required_comment=false
      },

      async save() {
        let that = this;
        if (that.$refs.form.validate()) {
          that.$nuxt.$loading.start();
          if (that.checkSuperAdmin) {
            that.editedItem.is_shared = true;
            that.editedItem.is_public = true;
            that.editedItem.industry_id = that.editedItem.industry_id_arr.toString();
          }
          // that.editedItem.is_public = that.editedItem.is_shared
          if (that.editMode) {
            
            that.editedItem.status = "new";
            that.editedItem.topics = that.topicArray;
            // that.editedItem.department_array=that.editedItem.responsible_department_array;
            // that.editedItem.employee_array=that.editedItem.responsible_employee_array;
            that.editedItem.defaultOptions = that.checkListDefaultOptionForNewChecklist(that.answerArray, that.topicArray);
            that.editedItem.added_by=that.userRoleId
            that.editedItem.type = "checklist"
            that.editedItem.object_type="Checklist"
            that.editedItem.is_shared=(that.editedItem.is_shared == true || that.editedItem.is_shared == 1) ? true : false
            that.editedItem.is_public=(that.editedItem.is_public == true || that.editedItem.is_public == 1) ? true : false
            that.editedItem.is_template=false
            // that.editedItem.isDefaultAttendee=false
            // that.editedItem.isDefaultResponsible=false
            that.editedItem.resource_id=that.objectResource_id
            that.editedItem.connectToArray=that.connectToArray
            that.editedItem.description= await removeTagsFromString(that?.editedItem?.description || '');
            that.$store.dispatch('objects/store', that.editedItem).then(function() {
              that.$emit('resourceList');
              // that.reloadList();
              that.reloadListCategory();
              that.reloadAnswerOptionsList();
              that.$toaster.success(that.$i18n.t('message.success_checklist_add_new'));
            }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_checklist_add_new'));
          }
              // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
              that.$nuxt.$loading.finish();
            });
          } 
          else if(!that.checkResource){
            // create Checklist
            that.editedItem.status = "new";
            that.editedItem.topics = that.topicArray;
            // that.editedItem.department_array=that.editedItem.responsible_department_array;
            // that.editedItem.employee_array=that.editedItem.responsible_employee_array;
            that.editedItem.is_shared=(that.editedItem.is_shared == true || that.editedItem.is_shared == 1) ? true : false
            that.editedItem.is_public=(that.editedItem.is_public == true || that.editedItem.is_public == 1) ? true : false
            that.editedItem.defaultOptions = that.checkListDefaultOptionForNewChecklist(that.answerArray, that.topicArray);
            that.editedItem.added_by=that.userRoleId
            that.editedItem.type = "checklist"
            // that.objectData.source_id=that.object_id
            that.editedItem.connectToArray=that.connectToArray
            that.editedItem.description= await removeTagsFromString(that?.editedItem?.description || '');
            that.$store.dispatch('objects/store', that.editedItem).then(function() {
              that.reloadList();
              that.reloadListCategory();
              that.reloadAnswerOptionsList();
              that.editedItem = that.defaultItem;
              that.$toaster.success(that.$i18n.t('message.success_checklist_add_new'));
            }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_checklist_add_new'));
          }
              // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
              that.$nuxt.$loading.finish();
            });
          }
          else if (that.checkResource) {
            that.editedItem.status = "new";
            that.editedItem.topics = that.topicArray;
            that.editedItem.defaultOptions = that.checkListDefaultOptionForNewChecklist(that.answerArray, that.topicArray);
            that.editedItem.added_by=that.userRoleId
            that.editedItem.connectToArray = that.connectToArray
            that.editedItem.type = "checklist"
            // that.editedItem.responsible_department_array=that.editedItem.department_array
            // that.editedItem.responsible_employee_array=that.editedItem.employee_array
            that.editedItem.is_template=true
            // that.objectData.source_id=that.object_id
            that.editedItem.connectToArray=that.connectToArray
            that.editedItem.description= await removeTagsFromString(that?.editedItem?.description || '');
            that.$store.dispatch('checklists/store', that.editedItem).then(function() {
              // that.reloadList();
              that.$emit('resourceList');
              that.reloadListCategory();
              that.reloadAnswerOptionsList();
              that.editedItem = that.defaultItem;
              that.$toaster.success(that.$i18n.t('message.success_resource_checklist_add_new'));
            }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_resource_checklist_add_new'));
          }
              // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
              that.$nuxt.$loading.finish();
            });
          }
          that.close('closePopup');
        }else{
          that.$toaster.error(that.$i18n.t('message.add_required_feild'));
        }
      },
      // formatDate(date) {
      //   if (!date) return null;
      //   const [year, month, day] = date.split(' ')[0].split('-');
      //   return `${day}/${month}/${year}`;
      // },

      reset() {
        this.topicArray = [];
        this.answerArray = [];
        this.isShowInputTopic = false;
        this.checkAddReport = false;
        // this.isShowDefaultOptionsArray = false;
        console.log("this.defaultItem----->",this.defaultItem);
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.newReportData = Object.assign({}, this.defaultReportData);
          this.newAnswer = Object.assign({}, this.defaultAnswer);
          // this.editedIndex = -1;
          // this.$refs.form.reset();
          this.$refs?.form?.resetValidation();
        }, 0);
      },

      addNewTopicName(){
        this.newTopicData.questions = [];
        let newData = _.clone(this.newTopicData);
        this.topicArray.push(newData);
        this.isShowInputTopic = false;
        this.newTopicData.name = "";
      },

      cancelNewTopicName() {
        this.isShowInputTopic = false;
      },

      addMoreTopic() {
        this.isShowInputTopic = true;
      },

      addNewQuestion(index) {
        this.isAddNewCheckpoint = true;
        this.topicArray[index].questions.push({name: "", default_option_id: "", option_answers: "",required_comment:"",required_attachment:"",checklist_required_comment:"",checklist_required_attachment:""});
      },

      //function to apply selected template content to all input
      applyTemplate() {
        let that = this;
        if (this.$refs.form.validate()) {
          that.$nuxt.$loading.start();
          that.editedItem.status = "New";
          that.editedItem.is_template = false;
          that.editedItem.topics = that.topicArray;
          that.editedItem.defaultOptions = that.checkListDefaultOptionForNewChecklist(that.answerArray, that.topicArray);
          if (!that.editedItem.parent_id) {
            that.editedItem.parent_id = that.editedItem.id;
          }
          that.$store.dispatch('objects/store', that.editedItem).then(function(result){
            that.editedItem = result.data;
            that.checkResource = false;
            that.reloadList();
              that.reloadListCategory();
              that.reloadAnswerOptionsList();
            // that.dialogConfirmApply = false;
            // that.dialogApply = true;
            // that.tabIndex = 0;
            that.changeTab(0);
            that.$toaster.success(that.$i18n.t('message.success_checklist_add_new'));
            // that.$nuxt.$loading.finish();
          }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_checklist_add_new'));
          }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish();
          });
          that.close('closePopup');
        }else{
          that.$toaster.error(that.$i18n.t('message.add_required_feild'));
        }
      },

      changeTab(value) {
        this.$emit('changeTab', value);
      },

      saveAndApply(){
        // create template
          let that = this;
        if (this.$refs.form.validate()) {
          that.$nuxt.$loading.start();
          that.editedItem.status = "New";
          that.editedItem.topics = that.topicArray;
          that.editedItem.defaultOptions = that.checkListDefaultOptionForNewChecklist(that.answerArray, that.topicArray);
          if(that.checkResource==true){
            that.editedItem.is_template = true;
            that.$store.dispatch('checklists/store', that.editedItem).then(result => {
              that.editedItem.parent_id = result.data.id;
              // that.reloadList();
              that.$emit('resourceList');
                that.reloadListCategory();
                that.reloadAnswerOptionsList();
              // that.applyTemplate();
              that.$toaster.success(that.$i18n.t('message.success_checklist_add_new'));
              that.$nuxt.$loading.finish();
            }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_checklist_add_new'));
          }
              // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
              that.$nuxt.$loading.finish();
            });
            }
            that.templateCheck=that.editedItem;
            that.templateCheck.type="checklist"
               that.templateCheck.is_template = false;
             that.$store.dispatch('objects/store', that.templateCheck).then(result => {
            that.editedItem.parent_id = result.data.id;
            that.reloadList();
              that.reloadListCategory();
              that.reloadAnswerOptionsList();
            // that.applyTemplate();
            that.$nuxt.$loading.finish();
          }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish();
          });
          that.close('closePopup');
        }else{
          that.$toaster.error(that.$i18n.t('message.add_required_feild'));
        }
      },

      updateAndApply(){
        if (this.$refs.form.validate()) {
          let that = this;
          that.dialogConfirmApply = false;
          that.$nuxt.$loading.start();
          that.editedItem.status = "New";
          that.editedItem.topics = that.topicArray;
          that.editedItem.defaultOptions = that.checkListDefaultOptionForNewChecklist(that.answerArray, that.topicArray);
          that.$store.dispatch('objects/update', that.editedItem).then(result => {
            that.editedItem.parent_id = result.data.id;
            that.applyTemplate();
            that.$nuxt.$loading.finish();
          }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_checklist_update'));
          }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish();
          });
          that.close('closePopup');
        }
      },

      // dialog DELETE
      closeDelete() {
        this.dialogDelete = false;
      },

      closeApply(){
        this.dialogApply = false;
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

      checkDirtyBeforeClose(){
        if(this.checkDirtyForm()){
          this.dialogConfirmClose = true;
        }else{
          this.close();
        }
      },

      addAnswer(topic_id, question_id, answer, description) {
        let answerItem = _.findWhere(this.newReportData.answers, {question_id: question_id});
        if (_.isEmpty(answerItem))
        {
          this.newAnswer.topic_id = topic_id;
          this.newAnswer.question_id = question_id;
          this.getAnswerName(this.newAnswer, answer);
          this.newAnswer.description = description;
          let newData = _.clone(this.newAnswer);
          this.newReportData.answers.push(newData);
        } else {
          if (answer) {
            this.getAnswerName(answerItem, answer);
          } else {
            answerItem.description = description;
          }
        }
      },

      getAnswerName(newAnswer, answer) {
        if (answer.type_of_option_answer !== 2) {
          newAnswer.answer = answer.id;
          newAnswer.answer_name = answer.name;
        } else {
          let answer_name = _.find(answer.option_answers, function (item) {
            return item.id === answer.answer;
          });
          newAnswer.answer = answer_name.id;
          newAnswer.answer_name = answer_name.name;
        }
        return newAnswer;
      },

      // addComment(question_id) {
      //   document.getElementById("input_comment_" + question_id).classList.remove("d-none"); // hide btn Add comment
      // },
      // --------- End Tab Answer Option

      addMoreOptionAnswer() {
        if (this.optionAnswerArray.length > 0) {
          this.newOptionAnswer.arrangement_order = this.optionAnswerArray[this.optionAnswerArray.length - 1].arrangement_order + 1;
        } else {
          this.newOptionAnswer.arrangement_order = 1;
        }
        this.optionAnswerArray.push(this.newOptionAnswer);
        this.newOptionAnswer = Object.assign({}, this.defaultOptionAnswer);
      },

      dragQuestionOptionAnswer(list) {
        list = _.each(list, function (item) {
          item.arrangement_order = list.indexOf(item) + 1;
        });
        this.optionAnswerArray = list;
      },

      deleteOptionAnswer(index) {
        this.optionAnswerArray.splice(index, 1);
      },

      // show list option with format name 'NAME - Slider / Dropdown'
      formatNameOfDefaultOptionType(list) {
        _.each(list, function (option) {
          if (option.type_of_option_answer === 1) {
            option.option_name = option.name + ' - Slider';
          } else {
            option.option_name = option.name + ' - Dropdown';
          }
        });
        return list;
      },

      checkListDefaultOptionForNewChecklist(listOption, listTopic) {
        let optionItem = null;
        let defaultOptionsList = [];
        _.each(listTopic, function (item) {
          if (item.questions.length > 0) {
            _.each(item.questions, function (question) {
              optionItem = _.findWhere(listOption, { id: question.default_option_id });
              if (optionItem) {
                defaultOptionsList.push(optionItem);
              }
            });
          }
        });
        return defaultOptionsList;
      },

      // --------- End Option Answer - add new

      // --------- USE CHECKLIST
      formatAnswerWithTypeBoolean(itemId, question, value) {
        if (value) {
          this.addAnswer(itemId, question.id, question.option_answers[1], null);
        } else {
          this.addAnswer(itemId, question.id, question.option_answers[0], null);
        }
      },

      checkNewReportDataBeforeSave(list) {
        let that = this;
        _.each(that.topicArray, function (topic) {
          _.each(topic.questions, function (question) {
            if (question.type_of_option_answer	=== 1 && _.findWhere(list, {question_id: question.id}) === undefined) {
              that.addAnswer(topic.id, question.id, question.option_answers[0], null);
            }
          });
        });
      },

      addPicture(question_id) {
        document.getElementById("upload_picture_" + question_id).classList.remove("d-none");
      },

      uploadPicture(question_id, pic) {
        let existedPicture = _.findWhere(this.selectedFile, {question_id: question_id});
        if (_.isEmpty(existedPicture) && pic && pic.size > 0) {
          this.selectedFile.push({ question_id: question_id, picture: pic});
        } else {
          if (pic && pic.size > 0) {
            existedPicture.picture = pic;
          } else {
            this.selectedFile = _.reject(this.selectedFile, function(item){
              return item.question_id === question_id;
            });
          }
        }
      },

      formatMultipleFormData(list, report) {
        let that = this;
        // let listFiles = [];
        let formData = new FormData();
        formData.append('type', that.document_type);
        formData.append('object_type', that.document_added_from);
        formData.append('object_id', report.data.id);
        // formData.append('added_from', that.document_added_from);
        formData.append('is_public', 1);
        formData.append('is_shared', 1);
        formData.append('status', 1); // 1: publish
        // save report attachment
        formData.append('name', 'Report_' + report.data.id);
        // formData.append('report_id', report.data.id);
        _.each(list, function (item) {
          formData.append('file[' + item.question_id + ']', item.picture);
        });
        return formData;
      },
      // --------- End USE CHECKLIST

      // ADMIN - choose industry
      getSelectedIndustryItems(value) {
        this.editedItem.industry_id_arr = value.selectedItemsOutput;
      },
    },
  };
</script>

<style scoped>
:deep(.checklist-modal .risk-area .col-2){
  padding-right: 0px !important;
}
</style>

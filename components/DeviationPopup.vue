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
            <b-row class="flex align-baseline">
              <b-col cols="7">
                <div class="input-wrap">
                  <v-text-field
                    v-model="editedItem.subject"
                    :label="$t('form.name')"
                    :rules="required"
                    :readonly="editMode"
                    outlined
                    rows="3"
                    auto-grow
                  />
                </div>
              </b-col>
              <b-col class="d-flex align-center pl-15 col-5">
                <b-col cols="5" class="ml-1">
                  <div class="required-action-title">
                    <div class="bold-title md-line-height anonymous">
                      {{ $t('form.anonymous') }}
                    </div>
                    <v-badge
                      :value="hoverAnonymous"
                      right
                      transition="slide-x-transition"
                      class="hse--icon-question-circle anonymous-badge"
                      :content="$t('form.anonymous')"
                    >
                      <v-hover v-model="hoverAnonymous">
                        <i class="fa fa-question-circle"></i>
                      </v-hover>
                    </v-badge>
                  </div>
                </b-col>
                <b-col cols="7">
                  <div class="switch-component switch-required-action">
                    <label class="left-text">{{ $t('form.none') }}</label>
                    <v-switch
                      v-model="isAnonymous"
                      :label="$t('form.activate')"
                      inset
                      class="right-text"
                    />
                  </div>
                </b-col>
              </b-col>
              <!-- <b-col cols="6">
                <div class="input-wrap">
                  <v-text-field v-model="editedItem.place" :label="$t('form.place')" :readonly="editMode" outlined />
                </div>
              </b-col> -->
            </b-row>
            <b-row class="d-flex align-center justify-content-between">
              <b-col cols="7">
                <div class="pr-3">
                  <category
                    :category-item="editedItem"
                    :categories-array="categoriesValidArray"
                    :type-category="category_deviation"
                    :is-open-popup="openPopup"
                    class="dev-category"
                    @getNewCategory="getNewCategory"
                  />
                </div>
              </b-col>
              <b-col class="d-flex align-center pl-13 mt-n6 col-5" v-if="!editedItem.type_of_attachment">
                  <b-col cols="5" class="p-2">
                      <div class="bold-title m-0 md-line-height">
                        {{ $t('title.attachments') }}
                      </div>
                  </b-col>
                  <b-col cols="5" class="px-1">
                  <div class="input-wrap">
                    <div class="switch-component default-question-mark">
                      <label class="left-text">{{ $t('form.none') }}</label>
                      <v-switch
                        v-model="editedItem.type_of_attachment"
                        :label="$t('form.activate')"
                        inset
                        class="right-text"
                        @change="changeSwitchAttachment(editedItem.type_of_attachment)"
                      />
                    </div>
                  </div>
                </b-col>
              </b-col>
              <!-- <b-row v-if="!editedItem.type_of_attachment" class="mt-0">
                <b-col cols="4">
                  <div class="bold-title md-line-height">
                    {{ $t('title.attachments') }}
                  </div>
                </b-col>
                <b-col cols="6">
                  <div class="input-wrap">
                    <div class="switch-component default-question-mark">
                      <label class="left-text">{{ $t('form.none') }}</label>
                      <v-switch
                        v-model="editedItem.type_of_attachment"
                        :label="$t('form.activate')"
                        class="right-text"
                        @change="changeSwitchAttachment(editedItem.type_of_attachment)"
                      />
                    </div>
                  </div>
                </b-col>
              </b-row> -->
              <div v-else class="section-connect-to col-4 img-attachment mr-5 mb-4">
                <div class="section-connect-to-label section-connect-to-label-reminder">
                  {{ $t('title.attachments') }}
                </div>
                <div class="switch-component switch-required-comment-small ">
                  <label class="left-text">{{ $t('form.none') }}</label>
                  <v-switch
                    v-model="editedItem.type_of_attachment"
                    :label="$t('form.activate')"
                    inset
                    class="right-text"
                    @change="changeSwitchAttachment(editedItem.type_of_attachment)"
                  />
                </div>
                <div class="required-upload-attachment">
                  <div class="upload-field text-center m-3">
                    <div v-if="previewUrl">
                      <!-- <img class="image-field" v-bind:src="previewUrl" alt="image"> -->
                      <v-file-input
                        v-model="selectedFile"
                        accept="image/png, image/jpeg, image/jpg, image/gif, image/svg"
                        :rules="required"
                        @change="previewImage"
                      />
                    </div>
                    <div v-else class="icon-upload-attachment">
                      <v-file-input
                        v-model="selectedFile"
                        accept="image/png, image/jpeg, image/jpg, image/gif, image/svg"
                        :rules="required"
                        @change="previewImage"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </b-row>
            <b-row class="section-description">
              <b-col cols="12">
<!--                <v-icon class="icon-question">far fa-question-circle</v-icon>-->
                <div class="input-wrap form-description">
<!--                  <vue-editor v-model="editedItem.description" :rules="required" :disabled="editMode" />-->
                  <FroalaSuggestionListEditor
                    :item="editedItem"
                    :predefined-link-array="predefinedLinkArray"
                  />
                </div>
              </b-col>
            </b-row>
              
              <!-- connect to object design -->
             <connect-to-object
               class="mt-2"
               :isEmptyData="openPopup"
               :connectToArrayInput="connectToArray"
               @getConnectToArray="getConnectToArray"
             />
              
            <DeviationConsequence
              class="mb-0"
              :deviation-item="editedItem"
              :consequence-array="consequenceArray"
              :edit-mode="editMode"
              @getNewSequence="getNewSequence"
            />
            <DeviationCorrective
              class="mb-0"
              :deviation-item="editedItem"
              :edit-mode="editMode"
            />
            <DeviationPlace
              class="mb-0"
              :deviation-item="editedItem"
              :place-array="placeArray"
              :edit-mode="editMode"
              @getNewPlace="getNewPlace"
            />
              <!-- :is-open-popup="openPopup" -->
            <!-- <category
                    :category-item="editedItem"
                    :categories-array="categoriesValidArray"
                    :type-category="category_deviation"
                    :is-open-popup="openPopup"
                    class="dev-category"
                    @getNewCategory="getNewCategory"
                  /> -->
            <Responsible
              v-if="!checkWorker"
              class="mb-0 deviation-responsible"
              :object-item="editedItem"
              :edit-mode="editMode"
              :no-required-action="true"
            />
            <!-- <b-row>
              <b-col cols="6">
                <div class="input-wrap">
                  <v-checkbox
                    v-model="editedItem.type_of_attachment"
                    :label="$t('form.upload_attachment')"
                    class="margin-right-sm mt-0"
                    :hide-details="true"
                    :readonly="editMode"
                  />
                </div>
              </b-col>
            </b-row> -->
            <!-- <b-row v-if="editedItem.type_of_attachment" align-h="center" class="upload-document pb-4">
              <b-col v-if="!previewUrl" cols="4" class="text-center upload-field">
                <div @click="showAttachment">
                  <img src="../assets/images/icon/new-icon-upload.png" class="image-upload" alt="deviation">
                </div>
              </b-col>
              <b-col v-else cols="4">
                <div class="logo-wrapper" @click="showAttachment">
                  <img v-bind:src="previewUrl" alt="deviation">
                </div>
              </b-col>
            </b-row> -->
            <!-- <b-row class="pb-3"> -->
              <!-- <b-col cols="12">
                <div class="input-wrap">
                  <v-text-field
                    v-model="editedItem.prososial_action"
                    :label="$t('form.suggested_corrective_action')"
                    :readonly="editMode"
                    :rules="required"
                    rows="3"
                    outlined
                    auto-grow
                  />
                </div>
              </b-col> -->
              <!-- <b-col cols="6">
                <div class="input-wrap">
                  <v-select
                    v-model="editedItem.consequence_for"
                    :items="consequenceArray"
                    item-value="id"
                    item-text="name"
                    :rules="required"
                    :label="$t('form.consequence')"
                    :readonly="editMode"
                    outlined
                  />
                </div>
              </b-col> -->
              <!-- <b-col cols="6"> -->
                <!-- <v-select
                  v-if="editMode"
                  v-model="editedItem.responsible"
                  :label="$t('form.responsible')"
                  :items="responsibleArray"
                  item-text="name"
                  item-value="id"
                  :rules="required"
                  outlined
                  :readonly="editedItem.status > 2"
                /> -->
              <!-- </b-col> -->
            <!-- </b-row> -->
            <b-row v-if="editMode" class="pb-3">
              <b-col cols="6">
                <div class="input-wrap">
                  <v-text-field v-model="editedItem.added_by_name" :label="$t('form.reported_by')" outlined readonly />
                </div>
              </b-col>
              <b-col cols="6">
                <div class="input-wrap">
                  <v-text-field v-model="editedItem.created_at" :label="$t('form.date_report')" outlined readonly />
                </div>
              </b-col>
            </b-row>
<!--            <connect_to-->
<!--              :edited-item="editedItem"-->
<!--              :departments-array="departmentsArray"-->
<!--              :job-title-array="jobTitleArray"-->
<!--              :project-array="projectArray"-->
<!--              :deny-edit="editMode"-->
<!--              @updateConnect="checkUpdateConnect"-->
<!--            />-->
            <Security
              v-if="isAnonymous"
              :security-item="editedItem"
              :edit-mode="editMode"
              @changeSecurity="changeSecurity"
              :isInstructionObject="true"
              class="view-security"
            />
            <!-- EDIT - Process deviation -->
            <div v-if="editMode && (checkAdmin || permissionsUser.indexOf('deviation-process') > -1)" class="pb-2 pt-3">
              <span class="title-manage-task mb-4">{{ $t('title.progress_deviation') }}</span>

              <b-row>
                <b-col cols="6">
                  <div class="input-wrap">
                    <v-select
                      v-model="editedItem.happened_before"
                      :items="happenedBeforeArray"
                      item-value="id"
                      item-text="name"
                      :rules="required"
                      :label="$t('form.happened_before')"
                      :readonly="editedItem.status > 1"
                      outlined
                    />
                  </div>
                </b-col>
                <b-col cols="6">
                  <div class="input-wrap">
                    <v-select
                      v-model="editedItem.status"
                      item-value="id"
                      item-text="name"
                      :items="statusArray"
                      :label="$t('form.status')"
                      readonly
                      outlined
                    />
                  </div>
                </b-col>
              </b-row>
              <b-row>
                <b-col cols="12">
                  <div class="input-wrap">
                    <v-text-field v-model="editedItem.corrective_action" :readonly="editedItem.status > 1" :label="$t('form.corrective_actions')" outlined />
                  </div>
                </b-col>
              </b-row>
              <b-row>
                <b-col cols="12">
                  <div class="input-wrap">
                    <v-text-field v-model="editedItem.specifications" :readonly="editedItem.status > 1" :label="$t('form.specifications')" outlined />
                  </div>
                </b-col>
              </b-row>
              <b-row class="mb-3">
                <b-col cols="4">
                  <v-select
                    v-model="editedItem.action"
                    :items="actionsArr"
                    item-text="name"
                    item-value="value"
                    :label="$t('form.action')"
                    outlined
                    :rules="required"
                    :hide-details="true"
                    :readonly="editedItem.status > 1 && !isReopen"
                    @change="changeToAction"
                  />
                </b-col>
              </b-row>
              <!-- Action TASK -->
              <div v-if="editedItem.action === 'task'">
                <b-row>
                  <b-col cols="6">
                    <DatePicker
                      :label="$t('form.start_date')"
                      :item="editedItem"
                      :date-input="editedItem.start_time"
                      :use-keyboard="true"
                      :past-date="false"
                      :future-date="true"
                      :default-today="true"
                      @getDate="getStartDate"
                    />
                  </b-col>
                  <b-col cols="6">
                    <DatePicker
                      :label="$t('form.due_date')"
                      :item="editedItem"
                      :date-input="editedItem.deadline"
                      :use-keyboard="true"
                      :past-date="false"
                      :future-date="true"
                      @getDate="getDeadline"
                    />
                  </b-col>
                  <b-col cols="6">
                    <ResponsiblePerson
                      :object-item="editedItem"
                      :responsible-array="responsibleArray"
                      :label="'Task responsible'"
                    />
<!--                    <v-select-->
<!--                      v-model="editedItem.responsible_id"-->
<!--                      label="Task responsible"-->
<!--                      :items="responsibleArray"-->
<!--                      item-text="name"-->
<!--                      item-value="id"-->
<!--                      :rules="required"-->
<!--                      outlined-->
<!--                    />-->
                  </b-col>
                </b-row>
                <TasKDetailBlock
                  :task-array-input="taskArray"
                  :departments-array="departmentsArray"
                  :task-assignees-array-input="editMode ? deviationTaskAssigneesArray : taskAssigneesArray"
                  :edit-mode="false"
                  :object-status-input="editedItem.status"
                  @getTaskArray="getTaskArray"
                  @reloadList="reloadList"
                />
              </div>

              <!-- Action RISK -->
              <div v-if="editedItem.action === 'risk'">
                <b-row>
                  <b-col cols="6">
                    <div class="input-wrap">
                      <v-text-field
                        v-model="riskItem.name"
                        :label="$t('form.name')"
                        :rules="required"
                        outlined
                      />
                    </div>
                  </b-col>
                  <b-col cols="6">
                    <ResponsiblePerson
                      :object-item="editedItem"
                      :responsible-array="responsibleArray"
                      :label="'Risk responsible'"
                    />
<!--                    <v-select-->
<!--                      v-model="editedItem.responsible_id"-->
<!--                      label="Risk responsible"-->
<!--                      :items="responsibleArray"-->
<!--                      item-text="name"-->
<!--                      item-value="id"-->
<!--                      :rules="required"-->
<!--                      outlined-->
<!--                    />-->
                  </b-col>
                </b-row>
                <div v-if="riskElementAnalysis" class="manage-task mb-6">
                  <div class="title-manage-task">
                    {{ $t('title.add_source_of_danger') }}
                  </div>
                  <v-data-table
                    :headers="headersRiskElementArr"
                    outlined
                    :items="riskElementAnalysis"
                    class="elevation-1 table-task header-task"
                    :items-per-page="15"
                    :single-expand="true"
                    hide-default-footer
                    :sort-by="['created_at']"
                    :sort-desc="[true, false]"
                  >
                    <template v-slot:item.name="{ item }">
                      <v-text-field v-model="item.name" :rules="required" />
                    </template>
                    <template v-slot:item.type="{ item }">
                      <v-text-field v-model="item.type" readonly />
                    </template>
                    <template v-slot:item.probability="{ item }">
                      <v-select
                        v-model="item.probability"
                        :items="probabilityArr"
                        item-text="name"
                        item-value="value"
                        :rules="required"
                        @change="updateColorCode(item)"
                      />
                    </template>
                    <template v-slot:item.consequence="{ item }">
                      <v-select
                        v-model="item.consequence"
                        :items="consequenceArr"
                        item-text="name"
                        item-value="value"
                        :rules="required"
                        @change="updateColorCode(item)"
                      />
                    </template>
                    <template v-slot:item.colorCode="{ item }">
                      <v-chip v-if="item.colorCode" :color="item.colorCode" outlined>
                        {{ item.point }}
                      </v-chip>
                    </template>
                    <template v-slot:item.description_resolve="{ item }">
                      <v-text-field v-model="item.description_resolve" />
                    </template>
                  </v-data-table>
                  <!--
                  <b-row v-if="!riskItem.id">
                    <b-col cols="12">
                      <v-btn class="btn-create-task mt-0" outlined @click="addMoreRiskElementAnalysis">
                        Add new
                      </v-btn>
                    </b-col>
                  </b-row>
                  -->
                  <v-checkbox v-if="riskElementAnalysis.length > 0" v-model="riskItem.need_to_process" :label="$t('form.need_to_be_progressed')" />
                </div>
              </div>
            </div>
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
          <v-btn class="btn-cancel" text @click="checkDirtyBeforeClose">
            {{ $t('button.cancel') }}
          </v-btn>
          <!-- New deviation -->
          <v-btn
            v-if="!editMode"
            class="btn-save"
            @click="save"
          >
            {{ $t('button.save') }}
          </v-btn>
          <v-btn
            v-if="!viewMode && editMode && editedItem.status === 2 && !editedItem.reopen && (checkResponsiblePerson || checkAdmin)"
            class="hse-btn-save"
            @click="dialogChangeResponsible = true"
          >
            {{ $t('button.change_responsible_person') }}
          </v-btn>
          <!-- PROCESS deviation -->
<!--          v-if="!viewMode && editMode && (editedItem.status === 1 || (editedItem.status === 2 && editedItem.reopen)) && (editedItem.action === 'closed' || editedItem.action === 'risk' || (editedItem.action === 'task' && taskDetailArray.length > 0)) && (checkAdmin || checkResponsiblePerson)"-->
          <v-btn
            v-if="!viewMode && editMode
            && (editedItem.status === 1 || (editedItem.status === 6 && isReopen))
            && (editedItem.action === 'closed' || editedItem.action === 'risk'
            || (editedItem.action === 'task' && taskDetailArray.length > 0))
            && (checkAdmin || checkResponsiblePerson)"
            class="btn-save"
            @click="save"
          >
            {{ $t('button.save') }}
          </v-btn>
<!--          v-if="!viewMode && editMode && editedItem.status < 3 && editedItem.is_action_done && (checkAdmin || checkResponsiblePerson)"-->
          <v-btn
            v-if="!viewMode && editMode && editedItem.status === 6 && !isReopen && (checkAdmin || checkResponsiblePerson)"
            class="hse-btn-save"
            @click="reOpenDeviation"
          >
            Reopen
          </v-btn>
<!--          v-if="!viewMode && editMode && editedItem.status < 3 && editedItem.is_action_done && (checkAdmin || checkResponsiblePerson)"-->
          <v-btn
            v-if="!viewMode && editMode && editedItem.status === 6 && !isReopen && (checkAdmin || checkResponsiblePerson)"
            class="btn-save"
            @click="closeDeviation"
          >
            Done
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

    <v-dialog v-model="dialogChangeResponsible" max-width="500px">
      <v-card>
        <v-card-text>
          <div class="popup-header text-center">
            Change responsible person
          </div>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <b-row>
              <b-col>
                <v-select
                  v-if="editMode"
                  v-model="editedItem.responsible"
                  label="Responsible person of deviation"
                  :items="responsibleArray"
                  item-text="name"
                  item-value="id"
                  :rules="required"
                  outlined
                />
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <ResponsiblePerson
                  :object-item="editedItem"
                  :responsible-array="responsibleArray"
                  :label="editedItem.action === 'task' ? 'Responsible person of task' : 'Responsible person of risk'"
                />
<!--                <v-select-->
<!--                  v-model="editedItem.responsible_id"-->
<!--                  :label="editedItem.action === 'task' ? 'Responsible person of task' : 'Responsible person of risk'"-->
<!--                  :items="responsibleArray"-->
<!--                  item-text="name"-->
<!--                  item-value="id"-->
<!--                  :rules="required"-->
<!--                  outlined-->
<!--                />-->
              </b-col>
            </b-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="popup-footer">
          <v-spacer />
          <v-btn class="btn-cancel" text @click="close">
            {{ $t('button.cancel') }}
          </v-btn>
          <!-- New -->
          <v-btn
            class="btn-save"
            @click="updateResponsible"
          >
            {{ $t('button.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <AttachmentPopup
      :open-attachment-popup="checkAttachmentOpen"
      :type="document_type"
      :image-item="previewUrl"
      :added-from="document_added_from"
      :is-image="true"
      @closePopup="checkAttachmentOpen = !checkAttachmentOpen"
      @getImage="getImage"
    />
  </div>
</template>

<script>
  import {_} from 'vue-underscore';
  import cookies from 'js-cookie';
  import axios from "axios";
  // import ConnectTo from "./ConnectTo";
  import TasKDetailBlock from "./TasKDetailBlock";
  import DatePicker from "./DatePicker";
  import AttachmentPopup from "./AttachmentPopup";
  import Security from "./Security";
  import FroalaSuggestionListEditor from "./FroalaSuggestionListEditor";
  import Category from "./Category";
  import ResponsiblePerson from "./ResponsiblePerson";
  import DeviationPlace from "./DeviationPlace";
  import DeviationCorrective from "./DeviationCorrective";
  import DeviationConsequence from "./DeviationConsequence";
  import ConnectToObject from "./ConnectToObject.vue";
  // import MultipleSelection from "./MultipleSelection.vue";
  import Responsible from './Responsible';
// import DeviationResponsible from './DeviationResponsible';
import { removeTagsFromString } from "./common/js/functions"

  export default {
    name: "DeviationPopup",
    components: {
      // connect_to: ConnectTo,
      ConnectToObject,
      TasKDetailBlock,
      DatePicker,
      AttachmentPopup,
      Security,
      FroalaSuggestionListEditor,
      category: Category,
      ResponsiblePerson,
      DeviationPlace,
      DeviationCorrective,
      DeviationConsequence,
      Responsible,
      // DeviationResponsible
    },
    props: {
      deviationItem: {
        type: Object,
        required: false,
      },
      consequenceArray:{
        type:Array,
        required:false,
      },
      consequenceSelection:{
        type: Array,
        required: false,
      },
      placesSelection:{
         type: Array,
        required: false,
      },
      openPopup: Boolean,
      categoriesArray: {
          type: Array,
          required: false
      },
      jobTitleArray: Array,
      departmentsArray: Array,
      viewModeInput: {
        type: Boolean,
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
      placeArray: {
        type: Array,
        required: false,
      }
    },
    data: () => ({
      userRoleId: parseInt(cookies.get('roleID')),
      userDepartmentID: parseInt(cookies.get('userDepartmentID')),
      pageKey: 'reports-deviations-deviations',
      permissionsUser: localStorage.getItem('permissionsKey'),
      checkAdmin: cookies.get('checkAdmin'),
      roleUser: cookies.get('roleUser'),
      userID: parseInt(cookies.get('userID')),
      valid: true,

      statusArray: [{
        id: 1,
        name: "New"
      }, {
        id: 2,
        name: "Ongoing"
      }, {
        id: 3,
        name: "Closed"
      }],
      listArray: [],
      placeValidArray:[],
      isAnonymous: false,
      connectToArray: [],
      editedItem: {
        added_by: '',
        place: '',
        place_detail:'',
        consequence_detail:'',
        category_id: '',
        consequence_for: '',
        subject: '',
        description: '',
        corrective_action: '',
        prososial_action:'',
        is_prososial_action:false,
        is_corrective: false,
        is_consequence:false,
        attachment: '',
        status: 1,
        action: '',
        type_of_attachment: false,
        updateResponsible: false,
        editPermission: true,
        is_suggestion: false,
        // table Security
        object_type: 'deviation',
        is_shared: false,
        is_public: false,
        is_place:false,
        department_array: [],
        employee_array: [],
        report_as_anonymous:0,
        responsible_department_array:[],
        responsible_employee_array:[],
        attendee_all:false,
        connectToArray:[],
        isDefaultResponsible:false,
        nearest_manager:false,
        isDefaultAttendee:false
      },
      defaultItem: {
        added_by: '',
        place: '',
        place_detail:'',
        consequence_detail:'',
        category_id: '',
        consequence_for: '',
        subject: '',
        description: '',
        corrective_action: '',
        prososial_action:'',
        is_prososial_action:false,
        is_corrective: false,
        is_consequence:false,
        attachment: '',
        status: 1,
        action: '',
        type_of_attachment: false,
        updateResponsible: false,
        editPermission: true,
        is_suggestion: false,
        // table Security
        object_type: 'deviation',
        is_shared: false,
        is_public: false,
        is_place:false,
        department_array: [],
        employee_array: [],
        report_as_anonymous:0,
        is_happened_before:false,
        responsible_department_array:[],
        responsible_employee_array:[],
        attendee_all:false,
        connectToArray:[],
        isDefaultResponsible:false,
        nearest_manager:false,
        isDefaultAttendee:false

      },
      required: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else return true;
        }
      ],
      selectedFile: [],
      happenedBeforeArray: [{
        id: 1,
        name: "Yes"
      }, {
        id: 2,
        name: "No"
      }, {
        id: 3,
        name: "Uncertain"
      }],
      dialogLogo: false, // upload avatar
      previewUrl: null, // upload avatar
      document_added_from: 'deviation',
      document_type: 'report',
      taskArray: [],
      actionsArr: [
        {name: 'Create as a task', value: 'task'},
        {name: 'Move to risk analysis', value: 'risk'},
        {name: 'Mark as closed', value: 'closed'},
      ],
      riskItem: {
        id: '',
        name: '',
        status: 1,
        department_id: '',
        job_title_id: '',
        need_to_process: false,
      },
      defaultRiskItem: {
        id: '',
        name: '',
        status: 1,
        department_id: '',
        job_title_id: '',
        need_to_process: false,
      },
      riskElementAnalysis: [],
      riskElement: {
        id: '',
        name: '',
        description_default: '',
        type: '',
        type_id: '',
        probability: '',
        probabilityName: '',
        consequence: '',
        consequenceName: '',
        code: '',
        colorCode: '',
        colorName: '',
        point: '',
        description_resolve: '',
        newlyCreated: false,
      },
      riskElementDefault: {
        id: '',
        name: '',
        description_default: '',
        type: '',
        type_id: '',
        probability: '',
        probabilityName: '',
        consequence: '',
        consequenceName: '',
        code: '',
        colorCode: '',
        colorName: '',
        point: '',
        description_resolve: '',
        newlyCreated: false,
      },
      probabilityArr: [
        {
          value: "1",
          name: "Low"
        },
        {
          value: "2",
          name: "Moderate"
        },
        {
          value: "3",
          name: "High"
        },
        {
          value: "4",
          name: "Very high"
        }
      ],
      consequenceArr: [
        {
          value: "1",
          name: "Low"
        },
        {
          value: "2",
          name: "Moderate"
        },
        {
          value: "3",
          name: "High"
        },
        {
          value: "4",
          name: "Very high"
        }
      ],
      colorCodeArr: [
        {
          min: 0,
          max: 0,
          value: "black",
          name: "None",
        },
        {
          min: 1,
          max: 3,
          value: "green",
          name: "Green",
        },
        {
          min: 4,
          max: 10,
          value: "#f0e509",
          name: "Yellow"
        },
        {
          min: 11,
          max: 15,
          value: "orange",
          name: "Orange"
        },
        {
          min: 16,
          max: 16,
          value: "red",
          name: "Red"
        }
      ],
      formTitle: '',
      checkWorker:false,
      editMode: true,
      dialogConfirmClose: false,
      // action TASK
      taskDetailArray: [],
      // image
      checkAttachmentOpen: false,
      // responsibleArray: [],
      isReopen: false,
      checkResponsiblePerson: false,
      deadline: '',
      start_time: '',
      dialogChangeResponsible: false,
      viewMode: false,
      deviationTaskAssigneesArray: [],
      hoverQuestionMark: false,
      hoverAnonymous:false,

      // category
      category_deviation: 'deviation',
      categoriesValidArray: [],
    }),

    computed: {
      headersRiskElementArr() {
        return  [
          { text: this.translateCol('name'), value: 'name', align: 'center', width: '36%'},
          { text: this.translateCol('type'), value: 'type', align: 'center', width: '10%'},
          { text: this.translateCol('probability'), value: 'probability', align: 'center', width: '12%'},
          { text: this.translateCol('consequence'), value: 'consequence', align: 'center', width: '12%'},
          { text: this.translateCol('color_code'), value: 'colorCode', align: 'center', width: '10%'},
          { text: this.translateCol('comment'), value: 'description_resolve', align: 'center', width: '30%'},
        ];
      },
    },

    watch: {
      openPopup(value) {
        if (value) {
          this.viewMode = this.viewModeInput;
          this.isAnonymous=false
          this.selectedFile=[]
          if (this.deviationItem) {
            let categoryId = this.deviationItem.category_id;
            this.categoriesValidArray = _.filter(this.categoriesArray, function (item) {
              return (!item.disable_status || (item.disable_status && item.id === categoryId));
            });
            this.checkResponsiblePerson = this.deviationItem.responsible === this.userID;
            this.editItem(this.deviationItem);
          } else {
            this.categoriesValidArray = _.filter(this.categoriesArray, function (item) {
              return !item.disable_status;
            });
            this.addNew();
            this.reloadListCategory();
          }
        }
      },
    },

    mounted() {
      // let that = this;
      // that.$nextTick(() => {
      //   that.$nuxt.$loading.start();
        // // list all managers = responsible person
        // that.$store.dispatch('employees/index').then(result => {
        //   that.taskAssigneesArray = result.data;
        //   that.responsibleArray = _.clone(result.data);
        //   that.responsibleArray = _.filter(that.responsibleArray, function (item) {
        //     return item.role_id === 2 || item.role_id === 3;
        //   });
        //   that.$nuxt.$loading.finish();
        // }).catch((error) => {
        //   that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        //   that.$nuxt.$loading.finish();
        // });
      // });
      if (this.roleUser === 'manager') {
        this.checkManager=true;
      } else if(this.roleUser === 'user') {
      this.checkWorker=true;
      }
    },

    created() {
      if (this.openPopup) {
        if (this.deviationItem) {
          this.editItem(this.deviationItem);
        } else {
          this.addNew();
        }
      }
    },

    methods: {
        getConnectToArray (data) {
            this.connectToArray = data;
        },
      changeSecurity(val) {
        if (val !== 'all') {
          this.editedItem.is_suggestion = false;
        }
      },
      getSelectedPlace(){},
      changeSwitchAttachment(val) {
        if (!val) {
          this.previewUrl = null;
          this.selectedFile = [];
        }
      },
      getNewCategory(value) {
        this.editedItem.category_id = value.newCategoryId;
      },

       getNewPlace(value) {
        this.editedItem.place = value.newPlaceId;
      },
      getNewSequence(value){
        this.editedItem.consequence_for = value.newSequenceId;
      },

      translateCol (colName) {
        return this.$i18n.t('column.' + colName);
      },

      addNew() {
        this.reset();
        let defaultCategory = _.findWhere(this.categoriesValidArray, {is_primary: 1});
        if (defaultCategory) {
          this.editedItem.category_id = defaultCategory.id;
        }
        // let defaultPlace = _.findWhere(this.placeValidArray, {is_primary: 1});
        // if (defaultPlace) {
        //   this.editedItem.place_id = defaultPlace.id;
        // }
        this.formTitle = this.$i18n.t('title.add_deviation');
        this.editMode = false;
      },

      editItem(item) {
        let that = this;
        that.formTitle = that.$i18n.t('title.edit_deviation');
        that.$nuxt.$loading.start();
        that.$store.dispatch('deviations/show', item.id).then(result => {
          that.editedItem = Object.assign({}, result.data);
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
          that.$nuxt.$loading.finish();

          that.editedItem.type_of_attachment = !!result.data.attachment;
          if (result.data.attachment) {
            that.getImageSrc(result.data.attachment.url);
          }
          // if (result.data.action) {
          //   if (result.data.action === 'task') {
          //     if (result.data.tasks.length > 0) {
          //       _.each(result.data.tasks, function (task) {
          //         if (task.status < 5) {
          //           let assignee = _.findWhere(task.task_assignees, {user_id: that.userID});
          //           if (assignee !== undefined) {
          //             task.assigneeId = assignee.user_id;
          //             task.assigneeStatus = assignee.status;
          //           } else {
          //             task.assigneeId = '';
          //             task.assigneeStatus = '';
          //           }
          //           if (task.assigned_department === null) {
          //             task.assigned_department = [];
          //           } else {
          //             task.assigned_department = JSON.parse(task.assigned_department);
          //           }

          //           that.deviationTaskAssigneesArray = _.clone(that.taskAssigneesArray);
          //           if (task.assigned_employee === null) {
          //             task.assigned_employee = [];
          //           } else {
          //             task.assigned_employee = JSON.parse(task.assigned_employee);
          //           }
          //           that.deviationTaskAssigneesArray = _.filter(that.deviationTaskAssigneesArray, function(employee){
          //             return (!employee.disable_status
          //               || (employee.disable_status && _.indexOf(task.assigned_employee, employee.id) > -1));
          //           });

          //           task.checkReadOnly = task.status >= 1;
          //           that.taskArray.push(task);
          //         }
          //       });
          //     }
          //   } else if (result.data.action === 'risk') {
          //     _.each(result.data.risk_analysis, function (risk) {
          //       that.riskItem = Object.assign({}, risk);
          //       that.riskElementAnalysis = _.each(risk.elements, function (element) {
          //         let point = element.probability * element.consequence;
          //         _.each(that.colorCodeArr, function(color) {
          //           if (point >= color.min && point <= color.max) {
          //             element.colorCode = color.value;
          //             element.colorName = color.name;
          //             element.point = point;
          //           }
          //         });
          //       });
          //     });
          //   }
          // }
          
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_deviation_view_detail'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      },

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

      close() {
        this.connectToArray = [];
        this.isEdit = false;
        this.reset();
        this.previewUrl = null;
        this.dialogConfirmClose = false;
        this.dialogChangeResponsible = false;
        this.formDirty = false;
        this.taskDetailArray = [];
        this.taskArray = [];
        this.riskElementAnalysis = [];
        this.riskItem.need_to_process = false;
        this.deadline = '';
        this.start_time = '';
        this.$emit('closePopup');
        this.reloadListCategory();
      },

      reset() {
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          // this.$refs.form.reset();
          this.$refs.form.resetValidation();
        }, 300);
      },

     async save() {
        let that = this;
        that.isReopen = false;
        if (that.$refs.form.validate()) {
          // that.editedItem.is_public = that.connectCompany;
          that.editedItem.action='none'
          that.editedItem.report_as_anonymous=that.isAnonymous ? 1 : 0
          that.editedItem.corrective_action=that.editedItem.prososial_action
          // that.editedItem.attachment=that.editedItem.attachment?1:0
          that.editedItem.added_by=that.userRoleId
          if (that.editMode) {
            // edit
            if (that.editedItem.action === 'task') {
              that.editedItem.tasks = that.taskDetailArray;
              that.$store.dispatch('deviations/update', that.editedItem).then(function () {
                that.reloadList();
                that.reloadListCategory();
                that.$toaster.success(that.$i18n.t('message.success_deviation_update'));
              }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
                that.$toaster.error(that.$i18n.t('message.fail_deviation_update'));
                }
                // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
                that.$nuxt.$loading.finish();
              });
            } else if (that.editedItem.action === 'risk') {
              that.riskItem.deviation_id = that.editedItem.id;
              that.riskItem.risk_elements = that.riskElementAnalysis;
              if (!that.riskItem.need_to_process) {
                that.riskItem.status = 3;
                that.riskItem.need_to_process = 0;
              } else {
                that.riskItem.status = 1;
                that.riskItem.need_to_process = 1;
              }
              that.editedItem.risk_analysis = that.riskItem;
              that.$store.dispatch('deviations/update', that.editedItem).then(function () {
                that.reloadList();
                that.reloadListCategory();
                that.$toaster.success(that.$i18n.t('message.success_deviation_update'));
              }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
                that.$toaster.error(that.$i18n.t('message.fail_deviation_update'));
                }
                // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
                that.$nuxt.$loading.finish();
              });
            } else if (that.editedItem.action === 'closed') {
              that.editedItem.status = 3;
              that.$store.dispatch('deviations/update', that.editedItem).then(function () {
                that.reloadList();
                that.reloadListCategory();
                that.$toaster.success(that.$i18n.t('message.success_deviation_update'));
              }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
                that.$toaster.error(that.$i18n.t('message.fail_deviation_update'));
          }
                // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
                that.$nuxt.$loading.finish();
              });
            }
          } else {
            // create
            if (that.editedItem.type_of_attachment) {
              let formData = new FormData();
              formData.append('file', that.selectedFile);
              formData.append('original_file_name', that.selectedFile.name);
              formData.append('file_size', that.selectedFile.size);
              formData.append('type', that.document_type);
              formData.append('name', "Deviation " + that.editedItem.subject);
              formData.append('type_of_attachment', 1); // 1. attachment
              formData.append('is_renewed', 0);
              formData.append('status', 1); // 0: draft, 1: public
              let is_public = that.editedItem.is_public ? 1 : 0;
              formData.append('is_public', is_public);
              if (that.editedItem.is_shared) {
                formData.append('department_array', JSON.stringify(that.editedItem.department_array));
                formData.append('employee_array', JSON.stringify(that.editedItem.employee_array));
              }
               formData.append('department_array', []);
                formData.append('employee_array', []);
              that.editedItem.is_shared = that.editedItem.is_shared ? 1 : 0;
              formData.append('is_shared', that.editedItem.is_shared);
              formData.append('added_by', that.editedItem.added_by);
              formData.append('place', that.editedItem.place);
              formData.append('place_detail', that.editedItem.place_detail);
              formData.append('consequence_detail', that.editedItem.consequence_detail);
              formData.append('category_id', that.editedItem.category_id);
              formData.append('consequence_for', that.editedItem.consequence_for);
              formData.append('subject', that.editedItem.subject);
              formData.append('prososial_action', that.editedItem.prososial_action);
              formData.append('corrective_action', that.editedItem.prososial_action);
              formData.append('is_prososial_action', that.editedItem.is_prososial_action);
              formData.append('is_consequence', that.editedItem.is_consequence);
              formData.append('attachment', that.editedItem.attachment);
              formData.append('status', that.editedItem.status);
              formData.append('action', that.editedItem.action);
              formData.append('type_of_attachment', that.editedItem.type_of_attachment);
              formData.append('updateResponsible', that.editedItem.updateResponsible);
              formData.append('editPermission', that.editedItem.editPermission);
              formData.append('object_type', that.editedItem.object_type);
              formData.append('report_as_anonymous', that.editedItem.report_as_anonymous);
              formData.append('isDefaultResponsible', that.editedItem.isDefaultResponsible);
              formData.append('responsible_department_array', JSON.stringify(that.editedItem.responsible_department_array));
              formData.append('connectToArray', JSON.stringify(this.connectToArray))
              formData.append('responsible_employee_array', JSON.stringify(that.editedItem.responsible_employee_array));
              that.editedItem.nearest_manager=that.editedItem.responsible_employee_array=="[]"?true:false
              formData.append('nearest_manager' , that.editedItem.nearest_manager)
              this.editedItem.description= await removeTagsFromString(this.editedItem.description);
              formData.append('description', that.editedItem.description);
              that.$nuxt.$loading.start();
              that.$store.dispatch('deviations/store', formData).then(function (res) {
                console.log(res);
                formData.append('object_type', that.document_added_from);
                 that.reloadList();
              that.reloadListCategory();
                that.editedItem = that.defaultItem;
                that.$toaster.success(that.$i18n.t('message.success_deviation_add_new'));
                that.$nuxt.$loading.finish();
              }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
                that.$toaster.error(that.$i18n.t('message.fail_deviation_add_new'));
          }
                // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
                that.$nuxt.$loading.finish();
              });
            } else {
              that.editedItem.added_by=that.userRoleId
              that.editedItem.connectToArray= that.connectToArray;
              that.editedItem.responsible_department_array= JSON.stringify(that.editedItem.responsible_department_array || [])
              that.editedItem.responsible_employee_array=JSON.stringify(that.editedItem.responsible_employee_array || []) 
              // that.editedItem.department_array=that.editedItem.responsible_department_array
              // that.editedItem.employee_array=that.editedItem.responsible_employee_array
              that.editedItem.nearest_manager=that.editedItem.responsible_employee_array=="[]"?true:false
              that.editedItem.isDefaultAttendee=false

              this.editedItem.description = await removeTagsFromString(this.editedItem.description);
              that.$nuxt.$loading.start();
              that.$store.dispatch('deviations/store', that.editedItem).then(function () {
              that.reloadList();
              that.reloadListCategory();
              that.$toaster.success(that.$i18n.t('message.success_deviation_add_new'));
              }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
                that.$toaster.error(that.$i18n.t('message.fail_deviation_add_new'));
          }
                // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
                
              });
            }
          }
          that.$nuxt.$loading.finish();
          that.close();
        }
        else{
          that.$toaster.error(that.$i18n.t('message.add_required_feild'));
        }
      },

      reOpenDeviation() {
        if (this.$refs.form.validate()) {
          this.isReopen = true;
          this.editedItem.action = null;
          this.editedItem.responsible_id = '';
          this.editedItem.reopen = true;
          this.taskArray = [];
          this.riskElementAnalysis = [];
          this.riskItem.need_to_process = false;
        }
      },

      closeDeviation() {
        let that = this;
        that.isReopen = false;
        if (that.$refs.form.validate()) {
          that.$nuxt.$loading.start();
          that.editedItem.status = 3;
          that.$store.dispatch('deviations/update', that.editedItem).then(function () {
            that.reloadList();
            that.$toaster.success(that.$i18n.t('message.success_deviation_update'));
          }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_deviation_update'));
          }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish();
          });
          that.close();
        }
      },

      reloadList(){
        this.$emit('reloadList');
      },

      reloadListCategory(){
        this.$emit('reloadListCategory');
      },

      previewImage(file) {
        if (file) {
          this.previewUrl = URL.createObjectURL(file);
          this.selectedFile = file;
        } else {
          this.previewUrl = null;
          this.selectedFile = null;
        }
      },

      updateColorCode(riskElement) {
        let that = this;
        if (riskElement.probability && riskElement.consequence) {
          let point = riskElement.probability * riskElement.consequence;
          _.each(that.colorCodeArr, function(item) {
            if (point >= item.min && point <= item.max) {
              riskElement.colorCode = item.value;
              riskElement.colorName = item.name;
              riskElement.point = point;
            }
          });
        }
      },

      changeToAction() {
        if (this.editedItem.action === 'risk') {
          this.riskItem.name = this.editedItem.subject;
          this.riskItem.department_id = this.editedItem.department_id;
          this.riskItem.job_title_id = this.editedItem.job_title_id;
          // risk element
          this.riskElement = Object.assign({}, this.riskElementDefault);
          this.riskElement.name = this.editedItem.subject;
          this.riskElement.type = "Deviation";
          this.riskElement.type_id = this.editedItem.id;
          this.riskElementAnalysis.push(this.riskElement);
        }
      },

      // show image
      showAttachment(){
        if (!this.editMode) {
          this.checkAttachmentOpen = true;
        }
      },

      getImageSrc(url){
        let that = this;
        let result;
        axios({
          url: url,
          method: 'GET',
          responseType: 'blob', // important
        }).then((response) => {
          result = window.URL.createObjectURL(new Blob([response.data]));
          that.previewUrl = result;
          that.$nuxt.$loading.finish();
          return result;
        });
      },

      getImage(file) {
        this.previewImage(file.imageFile);
      },

      updateResponsible() {
        let that = this;
        that.$nuxt.$loading.start();
        that.editedItem.updateResponsible = true;
        that.$store.dispatch('deviations/update', that.editedItem).then(function () {
          that.reloadList();
          that.$toaster.success(that.$i18n.t('message.success_deviation_update'));
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_deviation_update'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
        that.close();
      },

      getDeadline(value) {
        this.deadline = value.date;
        this.editedItem.deadline_pre = this.deadline;
      },

      getStartDate(value) {
        this.start_time = value.date;
        this.editedItem.start_time_pre = this.start_time;
      },

      // action TASK
      getTaskArray(value) {
        this.taskDetailArray = value.taskArray;
      },
    },
  };
</script>

<style scoped>
:deep(.deviation-responsible .row .col-4){
  padding-left: 101px !important;
}
.anonymous-badge{
  position: absolute;
  top: 15px;
  right: 15px;
}
.anonymous{
  position: relative;
}
:deep(.img-attachment .required-upload-attachment .upload-field){
  min-height: 0px !important;
}
:deep(.view-secure .hse-document-badge-tab){
  margin-right: 90px;
}
:deep(.view-security .hse-document-badge-tab){
  margin-right: 90px;
}
</style>

<template>
  <div>
    <v-dialog
      v-model="openPopup"
      scrollable
      max-width="1125px"
      persistent
    >
      <v-card>
<!--        <v-card-title class="text-h5 justify-content-center text-uppercase">-->
<!--          {{ $t('title.review_instruction') }}-->
<!--        </v-card-title>-->
        <v-card-text>
          <div class="popup-header text-center">
            {{ $t('title.review_instruction') }}
          </div>
          <div class="review-popup">
            <div class="review-popup-table normal-table">
              <!-- Name -->
              <div class="info-block w-50">
                <div class="label-item">
                  {{ $t('form.name') }}:
                </div>
                <div
                  v-if="!isEdit"
                  class="info-item"
                  @click="((!editedItem.is_template && checkResponsible) || (editedItem.is_template && checkCreator)) ? (isEdit = !isEdit) : (isEdit = false)"
                >
                  {{ editedItem.name }}
                </div>
                <div v-else class="input-wrap w-100">
                  <v-text-field
                    v-model="editedItem.name"
                    :rules="required"
                    outlined
                  />
                </div>
              </div>

              <!-- Function -->
              <div class="info-block direction w-50">
                <div class="label-item">
                  {{ $t('form.function') }}:
                </div>
                <div class="info-item">
                  {{ $t('form.instruction') }}
<!--                  <span>-->
<!--                    {{ $t('form.instruction') }}-->
<!--                  </span>-->
<!--                  <v-icon v-if="!isObject">-->
<!--                    mdi-chevron-right-->
<!--                  </v-icon>-->
<!--                  <span v-if="!isObject">-->
<!--                    {{ $t('form.activities') }}-->
<!--                  </span>-->
                </div>
              </div>

              <!-- Added by -->
              <div v-if="!resource" class="info-block w-50">
                <div class="label-item">
                  {{ $t('form.added_by') }}:
                </div>
                <div class="info-item">
                  {{ editedItem.addedByName }}
                </div>
              </div>

              <!-- Industry -->
              <div v-if="checkSuperAdmin" class="info-block w-50 chip">
                <div class="label-item">
                  {{ $t('form.industry') }}:
                </div>
                <div v-if="!isEdit" class="info-item" @click="checkCreator ? (isEdit = !isEdit) : (isEdit = false)">
                  <v-chip
                    v-for="(item, index) in editedItem.industryName"
                    :key="index"
                    class="mr-2 mb-1 chip-custom"
                    small
                  >
                    {{ item }}
                  </v-chip>
                </div>
                <div v-else class="w-100">
                  <MultipleSelection
                    :item="editedItem"
                    :selected-items-input="editedItem.industry"
                    :label="$t('form.industry')"
                    :item-text="'name'"
                    :item-value="'id'"
                    :list-option-input="industryArray"
                    :request-required="true"
                    @getSelectedItems="getSelectedIndustryItems"
                  />
                </div>
              </div>

              <!-- Category -->
              <div class="info-block w-50">
                <div class="label-item">
                  {{ $t('form.category') }}:
                </div>
                <div
                  v-if="!isEdit"
                  class="info-item"
                  @click="((!editedItem.is_template && checkResponsible) || (editedItem.is_template && checkCreator)) ? (isEdit = !isEdit) : (isEdit = false)"
                >
                  {{ editedItem.categoryName }}
                </div>
                <div v-else class="w-100">
                  <Category
                    :object-item="editedItem"
                    :type-category="'instruction'"
                    @getNewCategory="getNewCategory"
                  />
                </div>
              </div>

              <!-- Number of time used -->
              <div v-if="resource" :class="checkSuperAdmin ? 'info-block' : 'info-block w-50'">
                <div class="label-item">
                  {{ $t('form.number_of_times_used') }}:
                </div>
                <div class="info-item">
                  {{ editedItem.number_used_time }}
                </div>
              </div>

              <!-- Description -->
              <div :class="isEdit ? 'info-block' : 'info-block description'">
                <div class="label-item">
                  {{ $t('form.description') }}:
                </div>
                <div
                  v-if="!isEdit"
                  class="info-item"
                  @click="((!editedItem.is_template && checkResponsible) || (editedItem.is_template && checkCreator)) ? (isEdit = !isEdit) : (isEdit = false)"
                >
                  {{ editedItem.description }}
                </div>
                <div v-else class="input-wrap form-description">
                  <FroalaSuggestionListEditor
                    :item="editedItem"
                    :predefined-link-array="predefinedLinkArray"
                  />
                </div>
              </div>

              <!-- Responsible -->
              <div v-if="!resource" class="info-block chip">
                <div class="label-item">
                  {{ $t('form.responsible') }}:
                </div>
                <div v-if="!isEdit" class="info-item" @click="checkCreator ? (isEdit = !isEdit) : (isEdit = false)">
                  <v-chip
                    v-for="(item, index) in responsibleName"
                    :key="index"
                    class="mr-2 mb-1 chip-custom"
                    small
                  >
                    {{ item }}
                  </v-chip>
                </div>
                <div v-else>
                  <ResponsibleEdit
                    :object-item="editedItem"
                  />
                </div>
              </div>
            </div>

            <!-- connect to -->
              <v-data-table 
                  v-if="(roleUser != 'manager' || connectToObject.length > 0) && !viewPopup"
                  :headers="connectToObjectTableHeaders" :items="connectToObject" 
                  class="elevation-1 review-table review-popup-table mt-5"
                  :items-per-page="15"
                  :single-expand="true" 
                  :sort-by="['created_at']"
                  :sort-desc="[true, false]"
                  hide-default-footer>
              <template slot="top">
                  <v-toolbar flat>
                      <v-toolbar-title>
                          {{ $t('form.connected_to') }}
                      </v-toolbar-title>
                       <div v-if="checkAdmin || checkCreator">
                          <div role="button" v-if="!isEdit" @click="
                                  checkAdmin || checkCreator
                                    ? (isEdit = !isEdit)
                                    : (isEdit = false)
                                " class="plus-icon-gray text-center d-flex align-center justify-center">
                              +
                          </div>
                          <div role="button"
                                  v-else
                                  class="plus-icon text-center"
                               @click="is_connect = !is_connect">+
                          </div>
                      </div> 
                  </v-toolbar>
              </template>
              <template v-slot:item.connected_date="{ item }">
                  <span class="ml-4">
                      {{ moment(item.connected_date).format('DD-MM-YYYY') }}
                  </span>
              </template>
              <template v-slot:item.actions="{ item }">
                  <v-icon small title="View" @click="handleObjectOpen(item)">mdi-eye</v-icon>
              </template>
            <!--                  <template v-slot:header.actions="{ header }"></template>-->
            </v-data-table>
            <connect-to-object-modal
              v-if="is_connect"
              :isconnect="true"
              :editedItem="editedItem"
              ref="connectToObject"
              :connect-to-object-table-data="connectToObject"
              :tableData="connectToObject"
              :connect-to-object-table-header="connectToObjectTableHeaders"
              :connectToObjectObject="object"
              :connectToObjectFunction="ctoFunction"
              :connectToObjectCategory="category"
              :class="connectToObjectTableProp.length <= 0 ? '' : 'cto-modal'"
              @editConnectToObject="editConnectToObject"
              @addConnectToObject="addConnectToObject"
              :openPopup="is_connect"
              @getConnectToArray="getConnectToArray"
              @closePopup="is_connect = false"
              :connect-to-array-input="connectToObject"
              @deleteCto="deleteCTOData"
            ></connect-to-object-modal>

          <GoalReviewPopup 
                v-if="objectEditItem.type == 'goal'"
                :open-popup="isObjectOpen" 
                :object-item="objectEditItem"
                @closePopup="isObjectOpen = !isObjectOpen" 
                :view-popup="isOnlyView"
          ></GoalReviewPopup>

        <TaskReviewPopup 
                v-if="objectEditItem.type == 'task'"
                :open-popup="isObjectOpen"
                :object-item="objectEditItem"
                @closePopup="isObjectOpen = !isObjectOpen" 
                :view-popup="isOnlyView"
        ></TaskReviewPopup>

        <ReviewRoutinePopup 
                v-if="objectEditItem.type == 'routine'"
                :open-popup="isObjectOpen"
                :document-item="objectEditItem"
                @closePopup="isObjectOpen = !isObjectOpen" 
                :view-popup="isOnlyView"
        ></ReviewRoutinePopup>

        <InstructionReviewPopup 
                v-if="objectEditItem.type == 'instruction'"
                :open-popup="isObjectOpen"
                :object-item="objectEditItem"
                @closePopup="isObjectOpen = !isObjectOpen"
                :view-popup="isOnlyView"
        ></InstructionReviewPopup>

        <RiskAnalysisReviewPopup 
                v-if="objectEditItem.type == 'risk'"
                :open-popup="isObjectOpen"
                :object-item="objectEditItem"
                @closePopup="isObjectOpen = !isObjectOpen" 
                :view-popup="isOnlyView"
        ></RiskAnalysisReviewPopup>

        <EditChecklistPopup 
                v-if="objectEditItem.type == 'checklist'"
                :open-popup="isObjectOpen" 
                :document-item="objectEditItem"
                @closePopup="isObjectOpen = !isObjectOpen" 
                :view-popup="isOnlyView"
        ></EditChecklistPopup>

        <ReviewDeviation 
                v-if="objectEditItem.type == 'deviation'"
                :open-popup="isObjectOpen"
                :deviation-item="objectEditItem"
                @closePopup="isObjectOpen = !isObjectOpen" 
                :view-popup="isOnlyView"
        ></ReviewDeviation>



            <!-- Activities -->
            <div
              v-if="!isObject && (checkAdmin || checkCreator || checkResponsible || checkResponsibleSubObject || checkAttendee)"
              class="review-popup-table"
            >
              <v-data-table
                :headers="computedHeaders"
                :items="filteredSubObjectItems"
                class="elevation-1 review-table review-table-row-cursor-pointer"
                :items-per-page="15"
                :single-expand="true"
                :sort-by="['created_at']"
                :sort-desc="[true, false]"
                hide-default-footer
                item-key="name"
                @click:row="viewSubObject"
              >
              
                <template v-slot:top>
                  <v-toolbar flat>
                    <v-toolbar-title class="component-sub-goal">
                      {{ $t('form.activities') }}
                      <v-icon
                        v-if="checkResponsible || (editedItem.is_template && checkCreator)"
                        class="icon-plus-circle ml-2"
                        @click="addSubObject"
                      >
                        mdi-plus-circle
                      </v-icon>
                    </v-toolbar-title>
                  </v-toolbar>
                </template>
                <template v-slot:item.total_attendee="{ item }">
                  {{ item.totalAttendee }}
                </template>
                <template v-slot:item.responsible="{ item }">
                  {{ item.responsible['employeeName'].toString() }}
                </template>
                <template v-slot:item.created_at="{ item }">
                  {{ moment(item.created_at).format('DD.MM.YYYY') }}
                </template>
<!--                <template v-slot:item.actions="{ item }">-->
<!--                  <v-icon-->
<!--                    v-if="checkAdmin || checkCreator"-->
<!--                    small-->
<!--                    class="mr-2"-->
<!--                    @click="viewSubObject(item)"-->
<!--                  >-->
<!--                    mdi-pencil-->
<!--                  </v-icon>-->
<!--                  <v-icon-->
<!--                    v-if="checkAdmin || checkCreator"-->
<!--                    small-->
<!--                    class="mr-2"-->
<!--                    @click="viewDeleteConfirmPopup(item, false)"-->
<!--                  >-->
<!--                    mdi-delete-->
<!--                  </v-icon>-->
<!--                </template>-->
<!--                <template v-slot:expanded-item="{ headers, item }">-->
<!--                  <td class="p-0" :colspan="headers.length">-->
<!--                    <div class="pb-4">-->
<!--                      <div class="data-table">-->
<!--                        <v-data-table-->
<!--                          :headers="computedHeaders"-->
<!--                          :items="item.processingInfo"-->
<!--                          class="elevation-1 review-table border-0"-->
<!--                          :items-per-page="15"-->
<!--                          :single-expand="true"-->
<!--                          :sort-by="['created_at']"-->
<!--                          :sort-desc="[true, false]"-->
<!--                          hide-default-footer-->
<!--                        >-->
<!--                          <template v-slot:no-data>-->
<!--                            {{ $t('table.no_data') }}-->
<!--                          </template>-->
<!--                        </v-data-table>-->
<!--                      </div>-->
<!--                    </div>-->
<!--                  </td>-->
<!--                </template>-->
              </v-data-table>
            </div>

            <!-- Attendee -->
<!--            <div-->
<!--              v-if="isObject && (checkAdmin || checkCreator || checkResponsible)"-->
<!--              class="review-popup-table expandable-table"-->
<!--            >-->
<!--              <v-data-table-->
<!--                :headers="computedHeaders"-->
<!--                :items="editedItem.processingInfo"-->
<!--                class="elevation-1 review-table"-->
<!--                :items-per-page="15"-->
<!--                :single-expand="true"-->
<!--                :sort-by="['created_at']"-->
<!--                :sort-desc="[true, false]"-->
<!--                hide-default-footer-->
<!--              >-->
<!--                <template v-slot:top>-->
<!--                  <v-toolbar flat>-->
<!--                    <v-toolbar-title>-->
<!--                      {{ $t('form.attendee') }}-->
<!--                    </v-toolbar-title>-->
<!--                  </v-toolbar>-->
<!--                </template>-->
<!--                <template v-slot:no-data>-->
<!--                  {{ $t('table.no_data') }}-->
<!--                </template>-->
<!--              </v-data-table>-->
<!--            </div>-->
          </div>
        </v-card-text>
        <v-card-actions class="popup-footer">
          <v-spacer />
          <v-btn class="btn-cancel" text @click="close">
            {{ $t('button.cancel') }}
          </v-btn>

          <!-- Update -->
          <v-btn
            v-if="isEdit && (checkCreator || checkResponsible) && !viewPopup"
            class="btn-save"
            @click="update"
            :disabled="!!planAccess?.lastPlanAccess?.instruction">
            {{ $t('button.save') }}
          </v-btn>

          <!-- Apply -->
          <v-btn
            v-if="!checkSuperAdmin && (checkCreator || checkResponsible || editedItem.added_by === 1) && editedItem.is_template  && !viewPopup"
            class="hse-btn-save"
            @click="viewAddNewObjectPopup"
            :disabled="!!planAccess?.lastPlanAccess?.instruction">
            {{ $t('button.apply') }}
          </v-btn>

          <!-- Delete object -->
          <v-btn
            v-if="checkCreator && !viewPopup"
            class="hse-btn-delete"
            text
            @click="viewDeleteConfirmPopup(editedItem, true)"
          >
            <v-icon dark>
              mdi-delete
            </v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Review activity popup -->
    <InstructionActivityReviewPopup
      v-if="isViewSubObject"
      :open-popup="isViewSubObject"
      :object-item="editedSubObjectItem"
      :predefined-link-array="predefinedLinkArray"
      :resource="resource"
      @viewInstructionDetail="viewItem(editedItem)"
      @closePopup="isViewSubObject = !isViewSubObject"
      @reloadList="reloadList"
    />

    <!-- Instruction activity ADD NEW popup -->
    <InstructionActivityPopup
      :open-popup="isAddNewSubObject"
      :object-item="newSubObjectItem"
      :predefined-link-array="predefinedLinkArray"
      :edit-mode="false"
      :resource="resource"
      @closePopup="isAddNewSubObject = !isAddNewSubObject"
      @viewItem="viewItem(editedItem)"
      @reloadList="reloadList"
    />

    <!-- Apply to ADD NEW instruction -->
    <AddNewPopup
      :resource="false"
      :open-popup="isNewApplyObject"
      :form-title="$t('title.new_instruction')"
      :object-field="objectField"
      :object-item="newItemInstruction"
      :categories-array="categoriesArray || []"
      :categories-type="'instruction'"
      :predefined-link-array="predefinedLinkArray"
      @savePopup="apply"
      @closePopup="closeAddNewObject"
    />

    <!-- Popup delete confirm -->
    <DeleteConfirmPopup
      :open-popup="dialogDelete"
      :object-index="editedIndex"
      :is-object="isDeleteObject"
      @closePopup="dialogDelete = !dialogDelete"
      @deleteItem="deleteItem"
    />
  </div>
</template>

<script>
  import {_} from 'vue-underscore';
  import cookies from "js-cookie";
  import FroalaSuggestionListEditor from "./FroalaSuggestionListEditor";
  import DeleteConfirmPopup from "./DeleteConfirmPopup";
  import ResponsibleEditInReviewPopup from "./ResponsibleEditInReviewPopup";
  import CategoryInReviewPopup from "./CategoryInReviewPopup";
  // import ConnectToObject from "./ConnectToObject";
  import InstructionActivityReviewPopup from "./InstructionActivityReviewPopup";
  import InstructionActivityPopup from "./InstructionActivityPopup";
  import MultipleSelection from "./MultipleSelection";
  import AddNewPopup from "./AddNewPopup";
  import ConnectToObjectModal from './ConnectToObjectModal.vue'
  import moment from 'moment';
  import api from '~/apis'

  export default {
    name: "InstructionReviewPopup",
    components: {
      FroalaSuggestionListEditor,
      DeleteConfirmPopup,
      ResponsibleEdit: ResponsibleEditInReviewPopup,
      Category: CategoryInReviewPopup,
      // ConnectToObject,
      InstructionActivityReviewPopup,
      InstructionActivityPopup,
      MultipleSelection,
      AddNewPopup,
      ConnectToObjectModal,
      GoalReviewPopup: () => import('./GoalReviewPopup.vue'),
      TaskReviewPopup: () => import('./TaskReviewPopup.vue'),
      ReviewRoutinePopup: () => import('./ReviewRoutinePopup.vue'),
      RiskAnalysisReviewPopup: () => import('./RiskAnalysisReviewPopup.vue'),
      ReviewDeviation: () => import('./ReviewDeviation.vue'),
      EditChecklistPopup: () => import('./EditChecklistPopup.vue'),
      InstructionReviewPopup: () => import('./InstructionReviewPopup.vue'),
    },
    props: {
      openPopup: Boolean,
      objectItem: {
        type: Object,
        required: true,
      },
      viewPopup: {
        type: Boolean,
        required: false,
     },
      predefinedLinkArray: {
        type: Array,
        required: false,
      },
      resource: Boolean,
      industryArray: {
        type: Array,
        required: false,
      },
      categoriesArray: {
        type: Array,
        required: false,
      },
    },
    data: () => ({
      roleUser: cookies.get('roleUser'),
      checkSuperAdmin: cookies.get('checkSuperAdmin'),
      planAccess: JSON.parse(localStorage.getItem('planAccess')),
      checkAdmin: cookies.get('checkAdmin'),
      userLogged: parseInt(cookies.get('userID')),
      valid: true,
      required: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else return true;
        }
      ],
    connectToObject: [],
    isObjectOpen : false,
    isOnlyView : false,
    objectEditItem : {},
    is_connect: false,
    object: [],
    category: [],
    connectToObjectTableProp: [],
      isEdit: false,
      isAddNewSubObject: false,
      hoverQuestionMark: false,
      changeDeadlineCustom: false,
      checkCreator: false,
      checkResponsible: false,
      checkResponsibleSubObject: false,
      checkAttendee: false,
      editedItem: {},
      editedSubObjectItem: {},
      newSubObjectItem: {},
      newItem: {
        is_template: false,
        name: "",
        type: 'instruction-activity',
        description: "",
        category_id: '',
        is_suggestion: false,
        is_valid: true,
        status: 'new',
        // instruction activity
        activities: [],
        // responsible - attendee
        isDefaultResponsible: true,
        isDefaultAttendee: true,
        responsible_department_array: [],
        responsible_employee_array: [],
        attendee_department_array: [],
        attendee_employee_array: [],
        attendee_all: false,
        // sub-object
        source: 'instruction',
        source_id: '',
        // required comment
        responsible_required_comment: false,
        responsible_required_attachment: false,
        attendee_required_comment: false,
        attendee_required_attachment: false,
      },
      dialogDelete: false,
      editedIndex: 0,
      isDeleteObject: false,
      responsibleName: [],
      isObject: false,
      connectToArray: [],
      isViewSubObject: false,

      // add new popup - list object fields
      isNewApplyObject: false,
      objectField: [
        'name',
        'description',
        'category',
        'security',
        'connect-to',
        'responsible',
        'activity',
        'apply-instruction'
      ],
      newResourceItem: {
        is_template: true,
        name: "",
        type: 'instruction-activity',
        description: "",
        category_id: '',
        is_suggestion: false,
        is_valid: true,
        status: 'new',
        // sub-object
        source: 'instruction',
        source_id: '',
      },
      newItemInstruction: {
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
      defaultItemInstruction: {
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
    }),

    computed: {
    connectToObjectTableHeaders() {
      return [
          { text: this.translateCol('name'), value: 'objectName' },
          { text: this.translateCol('source'), value: 'connect_to_source' },
          { text: this.translateCol('category'), value: 'categoryName' },
          { text: this.translateCol('added_by'), value: 'addedByUser' },
          { text: this.translateCol('connected_by'), value: 'connectedByUser' },
          { text: this.translateCol('connected_date'), value: 'created_at' },
          { text: this.translateCol('actions'), value: 'actions', align: 'center', sortable: false },
      ]
    },


      headers() {
        return [
          {text: this.translateCol('name'), value: 'name', align: 'left', sortable: false},
          {text: this.translateCol('responsible'), value: 'responsible', align: 'center', sortable: false},
          {text: this.translateCol('total_attendee'), value: 'total_attendee', align: 'center', sortable: false},
          // {text: this.translateCol('actions'), value: 'actions', align: 'center'},
          // {text: '', value: 'data-table-expand', align: 'center'},
        ];
      },

      headersAttendee() {
        return [
          {text: this.translateCol('name'), value: 'name', align: 'left', sortable: false},
          {text: this.translateCol('responsible'), value: 'responsible', align: 'center', sortable: false},
          // {text: this.translateCol('added_by'), value: 'addedByName', align: 'center'},
          // {text: this.translateCol('created_at'), value: 'created_at', align: 'center'},
        ];
      },

      headersTemplate() {
        return [
          {text: this.translateCol('name'), value: 'name', align: 'left', sortable: false},
          {text: this.translateCol('description'), value: 'description', align: 'center', sortable: false},
        ];
      },

      computedHeaders () {
        if (this.resource) {
          return this.headersTemplate;
        } else {
          if (this.checkAdmin || this.checkCreator || this.checkResponsible || this.checkResponsibleSubObject) {
            return this.headers;
          } else if (this.checkAttendee) {
            return this.headersAttendee;
          } else {
            return [];
          }
        }
      },

      filteredSubObjectItems() {
        let that = this;
        if (that.checkSuperAdmin || that.checkAdmin || that.checkCreator || that.checkResponsible || that.checkResponsibleSubObject || that.checkAttendee)
          return that.editedItem.subObject;
        else return [];
      },
    },

    watch: {
      openPopup(value) {
        if (value) {
          this.getObject({type:'instruction', objectID: this.objectItem.id});
          this.viewItem(this.objectItem);
        }
      },
    },

    mounted() {},

    created() {
      if (this.openPopup) {
        if (this.objectItem) {
          this.viewItem(this.objectItem);
        }
      }
    },

    methods: {
      handleObjectOpen(item) {
          this.objectEditItem = {
            'id':item.source_id,
            'type': item.connect_to_source,
          };
          this.isObjectOpen = true;
          this.isOnlyView = true;
      },

    deleteCTOData(id) {
          // console.log(id);
          let that = this
          try {
            api.connectToObject.delete(id).then((res) => {
              console.log(res)
              that.$toaster.success('connect to object data deleted')
              that.getObject(this.editedItem)
              if (that.documentItem) {
                that.fetchConnectToObjectById(that.documentItem.id)
                that.editItem(that.documentItem)
              }
            })
          } catch (error) {
            that.$toaster.error('connect to object data not deleted')
            console.log(error)
          }
          // this.$emit('deleteCto', id)
        },
    
    editConnectToObject(payload) {
      console.log(payload)
    },
    async addConnectToObject(payload) {
      this.connectToArray = payload
      this.resetConnectToObjectFrom()
      this.connectToObjectFrom.connectToArray.push(payload.connectToArray)
      this.connectToObjectFrom.object_id = payload.object_id
      await this.getObject(this.editedItem)
    },

    getConnectToArray (data) {
          this.connectToObject = [...data];
      },

      async getObject (item) {
          this.connectToObject = [];
          await this.$store.dispatch('connectToObject/getByObject', item).then((result) => {
              let respo = result.data;
              if (respo.length > 0) {
                  respo.forEach((el) => {
                      this.connectToObject.push({
                          id: el.id,
                          connected_date: el.created_at,
                          categoryID: el.categoryID,
                          source_id: el.source_id,
                          connect_to_source: el.connect_to_source,
                          objectName: el.objectName || 'N/A',
                          categoryName: el.categoryName || 'N/A',
                          addedByUser: el?.addedByUser || 'N/A',
                          connectedByUser: el.connectedByUser || 'N/A',
                          created_at: moment(el.connected_date).format('DD.MM.YYYY'),
                      });
                  });
              } else {
                  this.connectToObject = [];
              }
          }).catch((error) => {
              console.log(error);
          });
      },


      // getConnectToArray(value) {
      //   let that = this;
      //   that.connectToArray = value;
      //   that.isEdit = true;
      // },

      viewItem(item) {
        let that = this;
        // that.formDirty = false;
        that.$nuxt.$loading.start();
        if (!item.is_template) {
          // connect to
          that.$store.dispatch('connectToObject/getByObject', {type: item.type, objectID: item.id}).then(result => {
            that.connectToArray = result.data;
            that.$nuxt.$loading.finish();
          }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }
            that.$nuxt.$loading.finish();
          
          });
        }

        // object
        that.$store.dispatch('objects/show', item.id).then(result => {
          that.editedItem = Object.assign({}, result.data);
          that.isObject = _.isEmpty(result.data.subObject);
          that.checkCreator = _.contains(result.data.role, 'creator');
          that.checkResponsible = _.contains(result.data.role, 'responsible');
          if (!that.checkCreator || !that.checkResponsible) {
            if (that.isObject) {
              that.checkAttendee = _.contains(result.data.role, 'attendee');
            } else {
              that.checkResponsibleSubObject = _.contains(result.data.roleSubObject, 'responsible');
              that.checkAttendee = _.contains(result.data.roleSubObject, 'attendee');
            }
          }
          if (!that.editedItem.is_template) {
            that.responsibleName = result.data.responsible['employeeName'];
            that.editedItem.responsible_employee_array = JSON.parse(that.editedItem.responsible['employee_array']);
          }
          // that.editedItem.historyArray = _.sortBy(result.data.history, function(o) { return o.updated_at; });
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_instruction_view_detail'));
          }
          that.$nuxt.$loading.finish();
        });
      },

      // Apply resource to add new object
      viewAddNewObjectPopup() {
        this.isNewApplyObject = true;
        this.newItemInstruction.name = this.editedItem.name;
        this.newItemInstruction.category_id = this.editedItem.category_id;
        this.newItemInstruction.description = this.editedItem.description;
        this.newItemInstruction.activities = this.editedItem.subObject;
      },

      closeAddNewObject() {
        this.isNewApplyObject = !this.isNewApplyObject;
        this.newItemInstruction = Object.assign({}, this.defaultItemInstruction);
      },

      addSubObject() {
        if (this.checkResponsible || (this.editedItem.is_template && this.checkCreator)) {
          this.isAddNewSubObject = true;
          if (this.resource) {
            this.newSubObjectItem = _.clone(this.newResourceItem);
          } else {
            this.newSubObjectItem = _.clone(this.newItem);
          }
          this.newSubObjectItem.category_id = this.editedItem.category_id;
          this.newSubObjectItem.is_suggestion = this.editedItem.is_suggestion;
          this.newSubObjectItem.source_id = this.editedItem.id;
        }
      },

      viewSubObject(item) {
        if (!this.isViewSubObject) {
          this.isViewSubObject = true;
          this.editedSubObjectItem = item;
        }
      },

      viewDeleteConfirmPopup(item, isObject) {
        this.editedIndex = item.id;
        this.isDeleteObject = isObject;
        this.dialogDelete = true;
      },

      translateCol (colName) {
        return this.$i18n.t('column.' + colName);
      },

      getNewCategory(value) {
        this.editedItem.category_id = value.newCategoryId;
      },

      close() {
        this.isEdit = false;
        if (this.openPopup) {
          this.$emit('closePopup');
        }
      },

      reloadList() {
        this.$emit('reloadList');
      },

      reloadListCategory(){
        this.$emit('reloadListCategory');
      },

      update() { // update
        let that = this;
        that.$nuxt.$loading.start();
        that.editedItem.requestEdit = true;
        that.editedItem.connectToArray = that.connectToObject;
        if (that.editedItem.is_template) {
          if (that.checkSuperAdmin && that.editedItem.subObject.length > 0) {
            _.each(that.editedItem.subObject, function (item) {
              item.industry = that.editedItem.industry;
            });
          }
        } else {
          that.editedItem.isDefaultResponsible = false;
          that.editedItem.isDefaultAttendee = false;
          that.editedItem.attendee_all = false;
          that.editedItem.responsible_required_comment = that.editedItem.responsible['required_comment'];
          that.editedItem.responsible_required_attachment = that.editedItem.responsible['required_attachment'];
          that.editedItem.attendee_required_comment = that.editedItem.attendee ?
              that.editedItem.attendee['required_comment'] : null;
          that.editedItem.attendee_required_attachment = that.editedItem.attendee 
              ? that.editedItem.attendee['required_attachment'] : null;
        }
        
        that.$store.dispatch('objects/update', that.editedItem).then(function () {
          that.reloadList();
          // that.reloadListCategory();
          that.$toaster.success(that.$i18n.t('message.success_instruction_update'));
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_instruction_update'));
          }
          that.$nuxt.$loading.finish();
        });
        that.close();
      },

      apply(value) {
        let that = this;
        that.$nuxt.$loading.start();
        that.newItem = value.item;
        that.newItem.apply_object_id = that.editedItem.id;
        that.$store.dispatch('objects/store', that.newItem).then(function () {
          that.reloadList();
          that.reloadListCategory();
          that.newItemInstruction = Object.assign({}, that.defaultItemInstruction);
          that.$toaster.success(that.$i18n.t('message.success_instruction_add_new'));
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_instruction_add_new'));
          }
          that.$nuxt.$loading.finish();
        });
        that.isNewApplyObject = !that.isNewApplyObject;
        that.close();
      },

      deleteItem(val) {
        let that = this;
        that.$store.dispatch('objects/delete', val.index).then(function() {
          that.reloadList();
          that.$toaster.success(that.$i18n.t('message.success_instruction_delete'));
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_instruction_delete'));
          }
          that.$nuxt.$loading.finish();
        });
        that.dialogDelete = false;
        if (val.isObject) {
          that.close();
        } else {
          that.viewItem(that.editedItem);
        }
      },

      getSelectedIndustryItems(value) {
        this.editedItem.industry = value.selectedItemsOutput;
      },
    },
  };
</script>

<style scoped>

.plus-icon-gray {
  width: 25px;
  height: 25px;
  background-color: #9f9f9f;
  margin-left: 10px;
  border-radius: 100%;
  font-size: 25px;
  line-height: 25px;
  color: #fff;
}
.plus-icon {
  width: 25px;
  height: 25px;
  background-color: #85a33d;
  margin-left: 10px;
  border-radius: 100%;
  font-size: 25px;
  line-height: 25px;
  color: #fff;
}

.section-connect-to .section-connect-to-label.section-connect-to-label-reminder {
  z-index: 2;
  color: unset;
  width: 140px;
}

:deep(.connect-to-object-table .v-data-table__wrapper) {
  padding-top: 30px;
}

.icon-plus-circle {
  z-index: 2;
  right: 5rem;
  font-size: 28px !important;
  border: 6px solid white !important;
}
.primary-color{
    color: #87a53a;
}

</style>

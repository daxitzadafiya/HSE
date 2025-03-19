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
            <!-- <b-row
              v-if="editMode && (editedItem.count_related_object > 0 || editedItem.parent_object)
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
                  {{ $t('button.view_associated_objects') }}
                </v-btn>
              </b-col>
            </b-row> -->
            <b-row class="align-center justify-content-between">
              <b-col cols="7">
                <div class="input-wrap">
                  <v-text-field
                    v-model="editedItem.name"
                    :label="$t('form.name')"
                    name="name"
                    :rules="required"
                    outlined
                    :readonly="!editedItem.editPermission && editedItem.added_by !== userLogged"
                  />
                </div>
              </b-col>
              <div class="col-5 d-flex align-center mt-n7">
                <b-col cols="5">
                  <div class="bold-title md-line-height">
                    {{ $t('title.document_type') }}
                  </div>
                </b-col>
                <b-col cols="6">
                  <div class="input-wrap">
                    <div class="switch-component document-type-wrap default-question-mark">
                      <label class="left-text">{{ $t('form.note') }}</label>
                      <v-switch
                      v-model="attachmentType"
                      :label="$t('form.attachment')"
                      class="right-text"
                      inset
                      @change="changeSwitchAttachment(attachmentType)"
                      />
                      <!-- :readonly="editMode" -->
                    </div>
                  </div>
                </b-col>
              </div>
            </b-row>
            <b-row class="mt-2">
              <b-col cols="7" class="category">
                <category
                  :category-item="editedItem"
                  :categories-array="categoriesValidArray"
                  :type-category="categoryType"
                  :is-open-popup="openPopup"
                  :view-only="viewOnly"
                  :source="'document'"
                  @getNewCategory="getNewCategory"
                />
              </b-col>
              <b-col v-if="attachmentType" cols="5">
                <div class="section-connect-to section-upload-document">
                  <div class="section-connect-to-label">Upload attachment</div>
                  <div class="mt-5 input-wrap">
                    <!-- <v-file-input
                      v-if="editMode && editedItem.uri"
                      v-model="selectedFile"
                      :placeholder="editedItem.original_file_name"
                      :disabled="!editedItem.editPermission && editedItem.added_by !== userLogged"
                    /> -->
                    <!-- <v-file-input
                    v-if="editMode && editedItem.uri"
                        v-model="selectedFile"
                        accept="image/png, image/jpeg, image/jpg, image/gif, image/svg"
                        :placeholder="editedItem.original_file_name"
                      :disabled="!editedItem.editPermission && editedItem.added_by !== userLogged"
                        :rules="required"
                      />
                    <v-file-input
                      v-else
                      v-model="selectedFile"
                      :rules="required"
                      :disabled="!editedItem.editPermission && editedItem.added_by !== userLogged"
                    /> -->
                    <div v-if="previewUrl">
                      <!-- <img class="image-field" v-bind:src="previewUrl" alt="image"> -->
                      <v-file-input
                        v-model="selectedFile"
                        accept="image/png, image/jpeg, image/jpg, image/gif, image/svg"
                        :rules="required"
                        @change="previewImage"
                      ></v-file-input>
                    </div>
                    <div v-else>
                      <v-file-input
                        v-model="selectedFile"
                        accept="image/png, image/jpeg, image/jpg, image/gif, image/svg"
                        :rules="required"
                        @change="previewImage"
                      />
                      <span v-if="editMode" class="cust-image-name">{{old_file}}</span>
                      
                    </div>
                  </div>
                  <!-- <div v-if="editMode && editedItem.uri" class="download-item mt-3">
                    {{ $t('message.you_can_download_file') }}
                    <span @click="getFile(editedItem)">here</span>
                  </div> -->
                  <!-- <div v-if="editMode" class="download-item mt-3">
                    {{ editedItem.original_file_name }}
                  </div> -->
                </div>
              </b-col>
            </b-row>
            <b-row v-if="checkSuperAdmin" class="mt-2">
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
            <b-row class="section-description mt-2 pb-3">
              <b-col>
<!--                <froala-->
<!--                  id="link-editor"-->
<!--                  v-model="editedItem.description"-->
<!--                  :tag="'textarea'"-->
<!--                  :config="config"-->
<!--                />-->

                <FroalaSuggestionListEditor
                  :item="editedItem"
                  :predefined-link-array="predefinedLinkArray"
                />
              </b-col>
            </b-row>

            <!-- connect to object design -->
            <connect-to-object
              class="mt-2"
              :ctoFunctionProp="ctoFunction"
              :categoryProp="category"
              :connectToObjectTableProp="connectToObjectTable"
              :objectProp="object"
              :isEmptyData="openPopup"
              :connectToObjectTableHeadersProp="connectToObjectTableHeaders"
              @editConnectToObject="editConnectToObject"
              @addConnectToObject="addConnectToObject"
              @deleteCto="deleteCtoItem"
              :connectToArrayInput="connectToArray"
              @getConnectToArray="getConnectToArray"
            />

            <Security
              v-if="!checkSuperAdmin && !checkResource"
              :security-item="editedItem"
              :edit-mode="editMode"
              class=""
              @changeSecurity="changeSecurity"
            />

            <document-reminder-new
            v-if="!checkResource"
              :reminder-item="editedItem"
              :durationData="durationData"
              :edit-mode="editMode"
              class="reminer-new pt-3"
            />

<!--            <b-row>-->
<!--              <b-col cols="12">-->
<!--                &lt;!&ndash; Security - who could view document &ndash;&gt;-->
<!--                <DocumentSecurity-->
<!--                  v-if="!checkResource"-->
<!--                  :security-item="editedItem"-->
<!--                  :edit-mode="editMode"-->
<!--                  @changeSecurity="changeSecurity"-->
<!--                />-->
<!--              </b-col>-->
<!--            </b-row>-->
<!--            <b-row>-->
<!--              <b-col cols="12">-->
<!--                &lt;!&ndash; Reminder / Renewed &ndash;&gt;-->
<!--                <DocumentReminder-->
<!--                  v-if="!checkResource"-->
<!--                  :reminder-item="editedItem"-->
<!--                  :edit-mode="editMode"-->
<!--                  :check-change-security="checkChangeSecurity"-->
<!--                />-->
<!--              </b-col>-->
<!--            </b-row>-->
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
          <v-btn class="btn-cancel" text @click="close">
            {{ $t('button.cancel') }}
          </v-btn>
          <v-btn
            v-if="editMode && checkResource && editedItem.status === 1 && (checkAdmin || permissionsUser.indexOf('document-resource') > -1) && editedItem.editPermission"
            class="btn-save"
            @click="apply"
          >
            {{ $t('button.apply') }}
          </v-btn>
          <!-- <v-btn
            v-if="!(editedItem.status === 1)"
            class="hse-btn-save" text
            @click="draft"
          >
            {{ $t('button.save_as_draft') }}
          </v-btn> -->
            <!-- v-if="!(editedItem.status === 1)" -->
          <v-btn
            class="btn-save" text
            @click="publish"
          >
            {{ $t('button.publish') }}
          </v-btn>
          <!-- <v-btn
            v-if="editMode && editedItem.added_by === userID
            && ((checkResource && ((!editedItem.company_id && checkSuperAdmin) || (editedItem.company_id && (checkAdmin || permissionsUser.indexOf('document-resource') > -1))))
            || (!checkResource && (checkAdmin || permissionsUser.indexOf('document-basic') > -1)))
            && editedItem.editPermission"
            class="hse-btn-delete"
            text
            @click="dialogDelete = true"
          >
            <v-icon dark>
              mdi-delete
            </v-icon>
          </v-btn> -->
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- dialog confirm delete -->
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card class="dialog-delete">
        <v-card-text>
          <div class="text-center confirm-delete-title">
            {{ $t('title.confirm_delete') }}
          </div>
          <div v-if="editedItem.uri" class="confirm-delete-text">
            {{ $t('message.this_object_contains_attachment_are_you_sure_you_want_delete_it') }}
          </div>
          <div v-else class="confirm-delete-text">
            {{ $t('message.are_you_sure_to_delete_this_object') }}
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
            {{ $t('title.associated_objects') }}
          </div>
          <div v-if="editedItem.parent_object" :class="editedItem.count_related_object > 0 ? 'mb-7' : ''">
            <div class="title-manage-task">{{ $t('title.applied_from') }}</div>
            <v-list-item
              class="p-0"
              two-line
            >
              <v-list-item-content>
                <v-list-item-title>{{ editedItem.parent_object.name }}</v-list-item-title>
                <v-list-item-subtitle>
                  <span class="mr-3">{{ $t('column.id') }}: {{ editedItem.parent_object.id }}</span>
                  <span class="mr-3">{{ $t('column.added_by') }}: {{ editedItem.parent_object.added_by_first_name }} {{ editedItem.parent_object.added_by_last_name }}</span>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </div>
          <div v-if="editedItem.count_related_object > 0">
            <div class="title-manage-task">{{ $t('title.relevant_documents') }}</div>
            <v-list-item
              v-for="(item, index) in editedItem.related_objects" :key="index"
              class="p-0"
              two-line
            >
              <v-list-item-content>
                <v-list-item-title>{{ item.name }}</v-list-item-title>
                <v-list-item-subtitle>
                  <span class="mr-3">{{ $t('column.id') }}: {{ item.id }}</span>
                  <span class="mr-3">{{ $t('column.added_by') }}: {{ item.added_by_first_name }} {{ item.added_by_last_name }}</span>
                  <span v-if="checkSuperAdmin">{{ $t('column.company') }}: {{ item.company_name }}</span>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </div>
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
  import cookies from "js-cookie";
  import Category from "./Category";
  import {downloadFile} from "../utils/downloadFile";
  // import DocumentReminder from "./DocumentReminder";
  // import DocumentSecurity from "./DocumentSecurity";
  import MultipleSelection from "./MultipleSelection";
  import DocumentReminderNew from "./DocumentReminderNew.vue";
  import FroalaSuggestionListEditor from "./FroalaSuggestionListEditor";
  import Security from "./Security";
  import moment from 'moment';
  import ConnectToObject from "./ConnectToObject.vue";
// import { removeTagsFromString ,formatTimeString, getDateBasedOnFrequency } from "./common/js/functions"
import { removeTagsFromString ,formatTimeString } from "./common/js/functions"

  import api from '~/apis';

  export default {
    name: "DocumentPopup",
    components: {
      category: Category,
      // DocumentReminder,
      // DocumentSecurity,
      MultipleSelection,
      FroalaSuggestionListEditor,
      Security,
      DocumentReminderNew,
      ConnectToObject
    },
    props: {
      resource: {
        type: Boolean,
        required: false,
      },
      documentItem: {
        type: Object,
        required: false,
      },
      openPopup: Boolean,
      industryArray: {
        type: Array,
        required: false,
      },
      categoriesArray: Array,
      categoryAddedFrom: {
        type: Number,
        required: false,
      },
      categoryType: {
        type: String,
        required: false,
      },
      addedFrom: {
        type: String,
        required: false,
      },
      type: {
        type: String,
        required: false,
      },
      contactId: {
        type: String,
        required: false,
      },
      employeeId: {
        type: String,
        required: false,
      },
      viewOnly: {
        type: Boolean,
        required: false,
      },
      predefinedLinkArray: {
        type: Array,
        required: false,
      },
    },
    data: () => ({
      isCreatedCto:false,
      isEditCto:false,
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
      connectToObjectTable: [{}],
      object: [],
      // connectToObjectTableHeaders: [
      //   {
      //     text: this.translateCol('name'),
      //     value: 'name',
      //   },
      //   {
      //     text: 'Source',
      //     value: 'source'
      //   },
      //   {
      //     text: 'Category',
      //     value: 'category'
      //   },
      //   {
      //     text: 'Added by',
      //     value: 'added'
      //   },
      //   {
      //     text: 'Connected by',
      //     value: 'connectedBy'
      //   },
      //   {
      //     text: 'Connected date',
      //     value: 'connectDate'
      //   },
      //   {
      //     text: 'Actions',
      //     value: 'actions',
      //     sortable: false
      //   }
      // ],
      connectToArray:[],
      connectToObjectFrom: { document_id: '', connectToArray: [], object_id: '' },
      userRoleId: parseInt(cookies.get('roleID')),
      userDepartmentID: parseInt(cookies.get('userDepartmentID')),
      checkAdmin: cookies.get('checkAdmin'),
      checkSuperAdmin: cookies.get('checkSuperAdmin'),
      roleUser: cookies.get('roleUser'),
      userLogged: parseInt(cookies.get('userID')),
      userID: parseInt(cookies.get('userID')),
      permissionsUser: localStorage.getItem('permissionsKey'),
      selectedFile: [],
      valid: true,
      isEdit: false,
      documents: [],
      taskAttendees: [],
      responsibleName: [],
      editedItem: {
        industry_id: '',
        industry_id_arr: [],
        name: "",
        description: "",
        parent_id: '',
        type_of_attachment: 2,
        type: "",
        category_id: "",
        task_id:"",
        routine_id:"",
        // is_renewed: false,
        // renewed_employee_array: "",
        // renewed_employee_array_arr: [],
        deadline: "",
        deadline_pre: '',
        show_manager: false,
        security_department_array: "",
        // security_project_array: "",
        security_employee_array: "",
        // security_department_array_arr: [],
        // security_project_array_arr: [],
        // security_employee_array_arr: [],
        count_related_object: 0,
        related_objects: [],
        parent_object: '',
        editPermission: true,
        is_suggestion: false,
        // table Security
        object_type: 'document',
        is_shared: false,
        is_public: false,
        department_array: [],
        employee_array: [],
        is_reminder:false,
        is_name:false,
        reminder_name:'',
        is_description: false,
        reminder_description: '',
        is_routine:false,
        responsible_department_array:[],
        responsible_employee_array:[],
        attendee_department_array:[],
        attendee_employee_array:[],
        start_date_pre:'',
        start_date:'',
        attendee_all:false,
        is_commentSwitch:false,
        is_AttachSwitch:false,
        attachFile:[],
        remider_note:'',
        attendee_required_comment:false,
        responsible_required_comment:false,
        attendee_required_attachment:false,
        responsible_required_attachment:false,
        recurring:'Daily',
        connectToArray:[],
        start_time_pre:'',
        end_time_pre:'',
        start_time:'',
        end_time:'',
        is_duration:false,
        duration:'',
        recurring_type:'',
        is_recurring:false,
        status:'new',
        isDefaultAttendee:false,
        isDefaultResponsible:false,
        is_secure:false
      },
      defaultItem: {
        start_time_pre:'',
        end_time_pre:'',
        end_time:'',
        connectToArray:[],
        industry_id: '',
        industry_id_arr: [],
        name: "",
        description: "",
        parent_id: '',
        type_of_attachment: 2,
        type: "",
        category_id: "",
        task_id:"",
        // is_renewed: false,
        // renewed_employee_array: "",
        // renewed_employee_array_arr: [],
        deadline: "",
        deadline_pre: '',
        show_manager: false,
        security_department_array: "",
        // security_project_array: "",
        security_employee_array:"",
        // security_department_array_arr: [],
        // security_project_array_arr: [],
        // security_employee_array_arr: [],
        count_related_object: 0,
        related_objects: [],
        parent_object: '',
        editPermission: true,
        is_suggestion: false,
        // table Security
        object_type: 'document',
        is_shared: false,
        is_public: false,
        department_array: [],
        employee_array: [],
        is_reminder: false,
        is_name: false,
        reminder_name: '',
        is_description: false,
        reminder_description: '',
        is_routine:false,
        responsible_department_array:[],
        responsible_employee_array:[],
        attendee_department_array:[],
        attendee_employee_array:[],
        start_date_pre:'',
        start_date:'',
        attendee_all:false,
        is_commentSwitch:false,
        is_AttachSwitch:false,
        attachFile:[],
        remider_note:'',
        attendee_required_comment:false,
        responsible_required_comment:false,
        attendee_required_attachment:false,
        responsible_required_attachment:false,
        recurring:'Daily',
        is_duration:false,
        duration:'',
        recurring_type:'',
        is_recurring:false,
        status:'new',
        isDefaultAttendee:false,
        isDefaultResponsible:false,
        is_secure:false
      },
      old_file:'',
      required: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else return true;
        }
      ],
      dialogDelete: false,
      dialogConfirmClose: false,
      previewUrl: null,
      attachmentType: false,
      formTitle: '',
      editMode: false,
      categoriesValidArray: [],
      checkResource: false,
      dialogRelatedObjects: false,
       durationData: {
      is_duration: false,
      duration: 1,
      unit: '',
    },

      config: {
        events: {
          //
        },
        // placeholderText: 'Place your cursor in {{}} to see the autofill list.',
        charCounterCount: true,
        heightMin: 150,
        quickInsertEnabled: false,
        toolbarButtons: {
          'moreText': {
            'buttons': ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'inlineClass', 'inlineStyle', 'clearFormatting']
          },
          'moreParagraph': {
            'buttons': ['alignLeft', 'alignCenter', 'formatOLSimple', 'alignRight', 'alignJustify', 'formatOL', 'formatUL', 'paragraphFormat', 'paragraphStyle', 'lineHeight', 'outdent', 'indent', 'quote']
          },
          'moreRich': {
            'buttons': ['refer_to_dropdown_custom', 'insertLink', 'insertImage', 'insertVideo', 'insertTable', 'emoticons', 'fontAwesome', 'specialCharacters', 'embedly', 'insertFile', 'insertHR']
          },
          'moreMisc': {
            'buttons': ['undo', 'redo', 'fullscreen', 'print', 'getPDF', 'spellChecker', 'selectAll', 'html', 'help'],
            'align': 'right',
            'buttonsVisible': 2
          }
        },
        linkList: [],
      },
      // checkChangeSecurity: {
      //   condition: '',
      //   countChange: ''
      // },
      hoverQuestionMark: false,
    }),

    computed: {
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
        this.connectToArray = [];
        if (value) {
          if (this.documentItem) {
            let categoryId = this.documentItem.category_id;
            this.categoriesValidArray = _.filter(this.categoriesArray, function (item) {
              return (!item.disable_status || (item.disable_status && item.id === categoryId));
            });
            this.editItem(this.documentItem);
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
      this.connectToObjectTable=[];
      if (this.openPopup) {
        if (this.documentItem) {
          this.fetchConnectToObjectById(this.documentItem.id);
          this.editItem(this.documentItem);
        } else {
          this.addNew();
        }
      }

      if (this.resource) {
        this.checkResource = this.resource;
      }
    },

    methods: {
        getConnectToArray(data){
            this.connectToArray = [];
            this.connectToArray = data; 
        },
       changeSwitchAttachment(val) {
        if (!val) {
          this.previewUrl = null;
          this.selectedFile = [];
        }
      },
      previewImage(file) {
        if (file) {
          this.previewUrl = URL.createObjectURL(file);
          this.selectedFile = file;
          this.old_file=""
        } else {
          this.previewUrl = null;
          this.selectedFile = null;
          this.old_file=""
        }
      },
        translateCol (colName) {
          return this.$i18n.t('column.' + colName);
        },
        deleteCtoItem(id){
        let that = this;
         try {
          api.connectToObject.delete(id).then(res=>{
            console.log(res);
           that.$toaster.success('connect to object data deleted');
            if (that.documentItem) {
            that.fetchConnectToObjectById(that.documentItem.id)
            that.editItem(that.documentItem);
          }
          });
        } catch (error) {
           that.$toaster.error('connect to object data not deleted');
           console.log(error);
        }
        },

        fetchConnectToObjectById(id){
        let that = this;
        const type='document'
        try {
          api.connectToObject.show(type,id).then(res=>{
          that.connectToObjectTable =  res.data.data
          });
        } catch (error) {
           that.$toaster.error('connect to object data not fetched');
           console.log(error);
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


      changeTab(value) {
        this.$emit('changeTab', value);
      },

      changeSecurity(val) {
        if (val !== 'all') {
          this.editedItem.is_suggestion = false;
        }
        // this.checkChangeSecurity = Object.assign({}, val);
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
        this.previewUrl = null;
        if (this.checkResource) {
          this.formTitle = this.$i18n.t('title.new_document_resource');
        } else {
          this.formTitle = this.$i18n.t('title.new_document');
        }
        this.editMode = false;
        this.selectedFile = [];
        this.attachmentType = false;
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

     async editItem(item) {
       let that = this;
       await that.fetchConnectToObjectById(item.id)
        that.formTitle = that.$i18n.t('title.edit_document');
        that.formDirty = false;
        that.$store.dispatch('documents/show', item.id).then(result => {
          that.editedItem = Object.assign({}, result.data);
          that.editMode = true
          that.editedItem.is_name = true
          that.editedItem.is_description = true
          that.editedItem.reminder_name = that.editedItem.name
          that.editedItem.reminder_description = that.editedItem.description
          that.is_create_routine = false
          if (that.checkSuperAdmin) {
            that.editedItem.industry_id_arr = that.formatNullArray(that.formatFromStringToArray(that.editedItem.industry_id));
          }
          that.editedItem.employee_array = that.editedItem.security_employee_array
          that.editedItem.department_array = that.editedItem.security_department_array
            that.editedItem.editPermission = true
          // if (that.editedItem.tasks.length > 0) {
          //   that.editedItem.renew_responsible = that.editedItem.tasks[0]['task_assignees'][0]['user_id'];
          //   that.editedItem.deadline = that.editedItem.tasks[0]['deadline'];
          // }
          that.attachmentType = that.editedItem.type_of_attachment == 1;
          that.selectedFile = item.original_file_name;
          that.old_file = item.original_file_name;
          if (item.original_file_name) {
            that.countAttachmentOriginalFileName(that.editedItem);
          }
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_document_view_detail'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      },

      countAttachmentOriginalFileName(item) {
        if (item.original_file_name.length > 80) {
          item.original_file_name = item.original_file_name.slice(0, 80 - 1) + '... ';
        }
        return item;
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
        this.previewUrl = null;
        if (this.openPopup) {
          this.$emit('closePopup');
        }
      },
      // close() {
      //   this.reset();
      //   this.dialogConfirmClose = false;
      //   this.formDirty = false;
      //   this.$emit('closePopup');
      //   this.reloadListCategory();
      // },

      reset() {
        // this.denyEdit = false;
        // this.isClosed = false;
        this.$nuxt.$loading.finish();
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          // this.$refs.form.reset();
          this.$refs.form.resetValidation();
        }, 300);
      },

      // formatDocumentBeforeSave() {
        // this.formatDescriptionBeforeSave();
        // this.formatSecurityBeforeSave();
        // this.formatRenewedEmployeesBeforeSave();
      // },

      // formatDescriptionBeforeSave() {
        // if (this.editedItem.description) {
        //   this.editedItem.description = this.editedItem.description.replace(/<[^>]+>/g, '');
        // } else {
        //   this.editedItem.description = '';
        // }
      //   return this.editedItem.description;
      // },

      // formatReminderIfNoRenew() {
      //   if (!this.editedItem.is_renewed) {
      //     this.editedItem.deadline = "";
      //   }
      // },

      // formatRenewedEmployeesBeforeSave() {
      //   // this.formatReminderIfNoRenew();
      //   if (this.editedItem.renewed_employee_array_arr) {
      //     this.editedItem.renewed_employee_array = _.uniq(this.editedItem.renewed_employee_array_arr).toString();
      //   } else {
      //     this.editedItem.renewed_employee_array = "";
      //   }
      //   return this.editedItem;
      // },

      // formatSecurityBeforeSave() {
      //   // Department
      //   this.editedItem.security_department_array = _.uniq(this.editedItem.security_department_array_arr).toString();
      //   // Project
      //   this.editedItem.security_project_array = _.uniq(this.editedItem.security_project_array_arr).toString();
      //   // Security shared with employees
      //   this.editedItem.security_employee_array = _.uniq(this.editedItem.security_employee_array_arr).toString();
      //   return this.editedItem;
      // },

      // it will create new task base on routine input
     async createAsTask(){
        let that = this
            that.textTrime = that.editedItem.reminder_name
            that.editedItem.reminder_name = this.textTrime.trim()

            this.editedItem.reminder_description= await removeTagsFromString(this.editedItem.reminder_description);

        var tempType=that.editedItem.type
        that.editedItem.type="task"
        that.editedItem.status="new"
        if(!that.editedItem.reminder_name=="")
          that.editedItem.name = that.editedItem.reminder_name

        if(!that.editedItem.reminder_description=="")
          that.editedItem.description = that.editedItem.reminder_description

        if(that.editedItem.start_date_pre==""){
          that.editedItem.start_date_pre = moment().format('YYYY-MM-DD')
          that.editedItem.start_date =  moment().format('YYYY-MM-DD')
        }
        else
        that.editedItem.start_date =  that.editedItem.start_date_pre || moment().format('YYYY-MM-DD');

        // if(that.editedItem.deadline_pre==""){
        //   that.editedItem.deadline = await getDateBasedOnFrequency(moment().format('YYYY-MM-DD'),that.durationData.unit)
        //   that.editedItem.deadline_pre =  await getDateBasedOnFrequency(moment().format('YYYY-MM-DD'),that.durationData.unit)
        // }
        // else
        if(!that.durationData.unit && !that.editedItem.deadline_pre)
        {
          that.editedItem.deadline=moment(moment().format('YYYY-MM-DD')).add(2, 'days').format('YYYY-MM-DD');
        }
        else{
          that.editedItem.deadline=that.editedItem.deadline_pre || "";
        } 

        that.editedItem.source="document"
        that.editedItem.url= ''
        that.editedItem.is_template = 0
        // that.editedItem.start_time = that.editedItem.start_time_pre != null && that.editedItem.start_time_pre != "" ? new moment(that.editedItem.start_time_pre, "HH:mm").utc().format("HH:mm") : '';
        // that.editedItem.end_time = that.editedItem.end_time_pre && that.editedItem.end_time_pre != "" ? new moment(that.editedItem.end_time_pre, "HH:mm").utc().format("HH:mm"): '';
        that.editedItem.start_time = await formatTimeString(new moment(that?.editedItem?.start_time_pre, "HH:mm")) || await formatTimeString(moment(new Date().getTime()).format("HH:mm"))
        that.editedItem.end_time = await formatTimeString(new moment(that?.editedItem?.end_time_pre, "HH:mm")) || await formatTimeString(moment(new Date().getTime()).format("HH:mm"))
        await that.$store
          .dispatch('objects/store', that.editedItem)
          .then(async function (res) {
            that.editedItem.task_id=res.data.id
            // that.reloadList()
            that.$nuxt.$loading.finish()
            that.editedItem.type= tempType
            that.$toaster.success(that.$i18n.t('message.success_task_add_new'));
          })
          .catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_task_add_new'));
          }
            that.$nuxt.$loading.finish()
          })
      },
      async createAsRoutine(){
        let that=this;
            that.editedItem.is_shared = false;
            that.editedItem.is_public = false;
            that.editedItem.is_activated = true;
            that.editedItem.is_attending_activated = false;
            
            // that.editedItem.deadline=that.editedItem.deadline_pre || await getDateBasedOnFrequency(moment().format('YYYY-MM-DD'),that.durationData.unit)
            that.editedItem.start_date=that.editedItem.start_date_pre || moment().format('YYYY-MM-DD');
            
            if(!that.durationData.unit && !that.editedItem.deadline_pre)
            {
              that.editedItem.deadline = moment(moment().format('YYYY-MM-DD')).add(2, 'days').format('YYYY-MM-DD');
            }
            else{
              that.editedItem.deadline=that.editedItem.deadline_pre;
            } 
            // that.editedItem.start_time = that.editedItem.start_time_pre != null || that.editedItem.start_time_pre != "" ? new moment(that.editedItem.start_time_pre, "HH:mm").utc().format("HH:mm") : '';
            // that.editedItem.end_time = that.editedItem.end_time_pre || that.editedItem.end_time_pre != "" ? new moment(that.editedItem.end_time_pre, "HH:mm").utc().format("HH:mm"): '';
            that.editedItem.start_time = await formatTimeString(new moment(that?.editedItem?.start_time_pre, "HH:mm")) || await formatTimeString(moment(new Date().getTime()).format("HH:mm"))
            that.editedItem.end_time = await formatTimeString(new moment(that?.editedItem?.end_time_pre, "HH:mm")) || await formatTimeString(moment(new Date().getTime()).format("HH:mm"))
            that.editedItem.deadline_pre=''
            that.editedItem.start_date_pre=''
            that.editedItem.status='new'
            that.editedItem.responsible_id = null
            that.editedItem.attending_emps=[]
            that.editedItem.attending_contact=[]
            that.editedItem.attendings_count=0
            that.editedItem.responsible_id=""
            that.editedItem.parent_id=""
            that.editedItem.is_template = false;
            that.editedItem.recurring_type=that.editedItem.is_routine == true && that.editedItem.is_recurring == true ? 'task' : 'reminder'
            that.editedItem.routine_id=""
            that.editedItem.type="routine"
            that.editedItem.duration = that.durationData.duration
            that.editedItem.is_duration = that.durationData.is_duration
            that.editedItem.recurring = that.durationData.unit || "Daily"
            that.editedItem.isDefaultResponsible=false
            that.editedItem.url= ''
            that.editedItem.is_template = 0

            that.editedItem.source="document"

            that.textTrime = that.editedItem.reminder_name
            that.editedItem.reminder_name = this.textTrime.trim()

            this.editedItem.reminder_description= await removeTagsFromString(this.editedItem.reminder_description);

          if(!that.editedItem.reminder_name=="")
          that.editedItem.name = that.editedItem.reminder_name


        if(!that.editedItem.reminder_description=="")
          that.editedItem.description = that.editedItem.reminder_description
            // that.editedItem.deadline = new Date().toISOString().substr(0, 10);

          // await that.$store.dispatch('routines/store', that.editedItem).then(async function (res) {
            await that.$store.dispatch('objects/store', that.editedItem).then(async function (res) {
            // that.reloadList();
            // that.reloadListCategory();
            // that.editedItem = that.defaultItem;
            that.editedItem.routine_id=res.data.id
              that.$toaster.success(that.$i18n.t('message.success_routine_add_new'));
            }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_routine_add_new'));
          }
              // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            });

            that.durationData.unit = null
            that.durationData.is_duration = false
            that.durationData.duration = 1

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
          api.connectToObject.update("document", id, data);
           else
          this.$toaster.error(this.$i18n.t('message.connect_to_object_limit'));
         } catch (error) {
          this.$toaster.error(this.$i18n.t('message.fail_connect_to_object_update'));
         }
      },

     async save() {
        let that = this;
        if (that.$refs.form.validate()) {
          that.$nuxt.$loading.start();
           that.textTrime = that.editedItem.name
            that.editedItem.name = this.textTrime.trim()

            that.editedItem.description= await removeTagsFromString(that.editedItem.description);


          
          // format formData before create / update attachment
          // that.formatDocumentBeforeSave();
          if (that.editMode == true) {

            if (that.attachmentType == true)  {
            let formData = new FormData();
              formData.append('file', that.selectedFile);
              formData.append('old_file', that.editedItem.original_file_name);
              formData.append('original_file_name', that.selectedFile.name);
              formData.append('file_size', that.selectedFile.size);
              formData.append('type_of_attachment', that.attachmentType ? 1 : 2);
              formData.append('category_id', that.editedItem.category_id);
              formData.append('resource_id', that.editedItem.id);
              formData.append('name', that.editedItem.name);
              formData.append('description', await removeTagsFromString(that.editedItem.description));
              formData.append('status', 'new'); // 0: draft, 1: publish
              formData.append('is_template',0)
              formData.append('connectToArray',that.connectToArray)
              formData.append('is_routine',that.editedItem.is_routine ? 1 :0)
              formData.append('is_suggestion', that.editedItem.is_suggestion ? 1 : 0);
              that.editedItem.employee_array = JSON.stringify(that.editedItem.employee_array);
              that.editedItem.department_array = JSON.stringify(that.editedItem.department_array);
              formData.append('department_array', that.editedItem.department_array);
              formData.append('employee_array', that.editedItem.employee_array);
              formData.append('object_type', 'document');
              formData.append('show_manager', that.editedItem.show_manager ? 1: 0);
              formData.append('count_related_object', that.editedItem.count_related_object);
              formData.append('related_objects', that.editedItem.related_objects);
              formData.append('parent_object', that.editedItem.parent_object);
              formData.append('editPermission', that.editedItem.editPermission);
              formData.append('is_name', that.editedItem.is_name ? 1:0);
              formData.append('reminder_name', that.editedItem.reminder_name);
              formData.append('is_description', that.editedItem.is_description ? 1 :0);
              formData.append('reminder_description', that.editedItem.reminder_description);
              formData.append('source', 'document');
              formData.append('isDefaultResponsible', that.editedItem.isDefaultResponsible || false);
              formData.append('isDefaultAttendee', that.editedItem.isDefaultAttendee || false);
              formData.append('parent_id', that.editedItem.id);
              formData.append('is_duration', that.editedItem.is_duration || false);
              formData.append('is_activated', that.editedItem.is_activated || false);
              formData.append('is_attending_activated', that.editedItem.is_attending_activated || false);
              let is_shared = that.editedItem.is_shared ? 1 : 0;
              formData.append('is_shared', is_shared);
              let is_public = that.editedItem.is_public ? 1 : 0;
              formData.append('is_public', is_public);
              let is_reminder=that.editedItem.is_reminder ?1 :0;
              formData.append('is_reminder',is_reminder)
              formData.append('added_by',that.userID)

              if(that.editedItem.is_reminder && !that.editedItem.is_routine)
              {
                await that.createAsTask()
                formData.append('task_id', that.editedItem.task_id);
              }
              if(that.editedItem.is_reminder && that.editedItem.is_routine)
              {
                await that.createAsRoutine()
                formData.append('routine_id', that.editedItem.routine_id);
              }
              
              formData.append('type', 'document');
              that.$store.dispatch('documents/store', formData).then((res)=> {
                console.log("attachment-response",res.data);
              // that.connectToObjectFrom.document_id=res.data.id
              // that.saveConnectToObject("document",res.data.id);
             that.$nuxt.$loading.start();
              that.reloadList();
              that.reloadListCategory();
              that.changeTab(0);
              that.editedItem = that.defaultItem;
              that.$toaster.success(that.$i18n.t('message.success_document_add_new'));
              that.$nuxt.$loading.finish();
            }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_document_add_new'));
              }
              // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
              that.$nuxt.$loading.finish();
            });
          }else{
          // edit
          that.editedItem.added_by = that.userID
          that.editedItem.resource_id = that.editedItem.id
          that.editedItem.is_template = false
          that.editedItem.status = 'new'
          that.editedItem.isDefaultResponsible=false
          that.editedItem.isDefaultAttendee=false
           that.editedItem.employee_array = JSON.stringify(that.editedItem.employee_array);
              that.editedItem.department_array = JSON.stringify(that.editedItem.department_array);
              if(that.editedItem.is_reminder && !that.editedItem.is_routine)
              {
                await that.createAsTask()
                // formData.append('task_id', that.editedItem.task_id);
              }
              if(that.editedItem.is_reminder && that.editedItem.is_routine)
              {
                await that.createAsRoutine()
                // formData.append('routine_id', that.editedItem.routine_id);
              }
                // that.editedItem.type=that.editedItem?.is_reminder && !that.editedItem?.is_routine ? 'task' : that.editedItem?.is_routine ? 'routine' : 'document'

              if(that.editedItem.is_reminder && !that.editedItem.reminder_name==""){
                 
                 that.editedItem.name = that.editedItem.reminder_name
                 }


              if(that.editedItem.is_reminder && !that.editedItem.reminder_description==""){

                that.editedItem.description = that.editedItem.reminder_description
              }

              that.editedItem.type = 'document'
              console.log("that.editedItem",that.editedItem);
          that.$store.dispatch('documents/store', that.editedItem).then(()=> {
              // that.connectToObjectFrom.document_id=res.data.id
              // that.saveConnectToObject("document",res.data.id);
              that.$nuxt.$loading.start();
              that.reloadList();
              that.reloadListCategory();
              that.changeTab(0);
              that.editedItem = that.defaultItem;
              that.$toaster.success(that.$i18n.t('message.success_document_add_new'));
            }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_document_add_new'));
              }
              // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
              that.$nuxt.$loading.finish();
            });
          }
        }else{
          if (that.attachmentType == true) {
              let formData = new FormData();
              formData.append('file', that.selectedFile);
              formData.append('original_file_name', that.selectedFile.name);
              formData.append('file_size', that.selectedFile.size);
              formData.append('type_of_attachment', that.attachmentType ? 1 : 2);
              formData.append('category_id', that.editedItem.category_id);
              formData.append('name', that.editedItem.name);
              formData.append('description', await removeTagsFromString(that.editedItem.description));
              formData.append('status', 'new'); // 0: draft, 1: publish
              formData.append('is_template',that.checkResource==true ? 1 : 0)
              formData.append('connectToArray', JSON.stringify(that.connectToArray))
              formData.append('is_routine',that.editedItem.is_routine ? 1 :0)
              formData.append('is_suggestion', that.editedItem.is_suggestion ? 1 : 0);

              that.editedItem.employee_array = JSON.stringify(that.editedItem.employee_array);
              that.editedItem.department_array = JSON.stringify(that.editedItem.department_array);
              formData.append('department_array', that.editedItem.department_array );
              formData.append('employee_array', that.editedItem.employee_array );
              // formData.append('department_array', that.editedItem.department_array ? [that.editedItem.department_array] : []);
              // formData.append('employee_array', that.editedItem.employee_array ? [that.editedItem.employee_array] : []);
              formData.append('object_type', 'document');
              formData.append('show_manager', that.editedItem.show_manager ? 1: 0);
              formData.append('count_related_object', that.editedItem.count_related_object);
              formData.append('related_objects', that.editedItem.related_objects);
              formData.append('parent_object', that.editedItem.parent_object);
              formData.append('editPermission', that.editedItem.editPermission);
              formData.append('is_name', that.editedItem.is_name ? 1:0);
              formData.append('reminder_name', that.editedItem.reminder_name);
              formData.append('is_description', that.editedItem.is_description ? 1 :0);
              formData.append('reminder_description', that.editedItem.reminder_description);
              formData.append('source', 'document');
              let is_shared = that.editedItem.is_shared ? 1 : 0;
              formData.append('is_shared', is_shared);
              let is_public = that.editedItem.is_public ? 1 : 0;
              formData.append('is_public', is_public);
              let is_reminder=that.editedItem.is_reminder ?1 :0;
              formData.append('is_reminder',is_reminder)

               if(that.editedItem.is_reminder && !that.editedItem.is_routine)
              {
                await that.createAsTask()
                formData.append('task_id', that.editedItem.task_id);
              }
              if(that.editedItem.is_reminder && that.editedItem.is_routine)
              {
                await that.createAsRoutine()
                formData.append('routine_id', that.editedItem.routine_id);
              }
              // that.editedItem.type=that.editedItem.is_reminder && !that.editedItem.is_routine ? 'task' : that.editedItem.is_routine ? 'routine' : 'document'
              // formData.append('type', that.editedItem.type);

               formData.append('type', 'document');
               console.log("formdata---",that.editedItem);
              that.$store.dispatch('documents/store', formData).then((res)=> {
              // that.connectToObjectFrom.document_id=res.data.id
              // that.saveConnectToObject("document",res.data.id);
              that.$nuxt.$loading.start();
              if ((res.data?.is_template == true || res.data?.is_template == 1 || res.data?.data?.is_template == true) && !that.checkSuperAdmin ) {
                that.resourceList();
              }else{
                that.reloadList();
              }
              that.reloadListCategory();
              that.editedItem = that.defaultItem;
              that.$toaster.success(that.$i18n.t('message.success_document_add_new'));
            }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_document_add_new'));
              }
              // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
              that.$nuxt.$loading.finish();
            });
            }else{
              that.editedItem.is_template = that.checkResource == true ? true : false
              that.editedItem.source = "document"
              // that.editedItem.is_public =  false
              that.editedItem.is_name = true
              that.editedItem.is_description = true
              that.editedItem.description= await removeTagsFromString(that.editedItem.description);
              that.editedItem.status = 'new'
              that.editedItem.connectToArray =  JSON.stringify(that.connectToArray);
              that.editedItem.employee_array = JSON.stringify(that.editedItem.employee_array);
              that.editedItem.department_array = JSON.stringify(that.editedItem.department_array);
              that.editedItem.type=that.editedItem.is_reminder && !that.editedItem.is_routine ? 'task' : that.editedItem.is_routine ? 'routine' : 'document'
              // that.editedItem.reminder_name = that.editedItem.name
              // that.editedItem.reminder_description = that.editedItem.description
               if(that.editedItem.is_reminder && !that.editedItem.is_routine)
              {
                await that.createAsTask()
                // formData.append('task_id', that.editedItem.task_id);
              }
              if(that.editedItem.is_reminder && that.editedItem.is_routine)
              {
                await that.createAsRoutine()
                // formData.append('routine_id', that.editedItem.routine_id);
              }
              //  if(that.editedItem.is_reminder && !that.editedItem.reminder_name==""){
                 
              //    that.editedItem.name = that.editedItem.reminder_name
              //    }


              // if(that.editedItem.is_reminder && !that.editedItem.reminder_description==""){

              //   that.editedItem.description = that.editedItem.reminder_description
              // }
              that.editedItem.type="document"
              that.$store.dispatch('documents/store', that.editedItem).then((res)=> {
                console.log("document store",res.data);
              // that.connectToObjectFrom.document_id=res.data.id
              // that.saveConnectToObject("document",res.data.id);
              that.$nuxt.$loading.start();
              if (that.editedItem.is_template == true && !that.checkSuperAdmin) {
                
                that.resourceList();
              }else{

                that.reloadList();
              }
              that.reloadListCategory();
              that.editedItem = that.defaultItem;
              that.$toaster.success(that.$i18n.t('message.success_document_add_new'));
            }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_document_add_new'));
          }
              // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
              that.$nuxt.$loading.finish();
            });
            }
        }
          that.$nuxt.$loading.finish();
          // let formData = new FormData();
          // let type_of_attachment = that.attachmentType ? 1 : 2;
          // // let is_reminder=that.editedItem.is_reminder ?1 :0;
          // formData.append('file', that.selectedFile);
          // formData.append('original_file_name', that.selectedFile.name);
          // formData.append('file_size', that.selectedFile.size);
          // formData.append('type_of_attachment', type_of_attachment);
          // formData.append('category_id', that.editedItem.category_id);
          // formData.append('name', that.editedItem.name);
          // formData.append('description', that.editedItem.description);
          // formData.append('status', that.editedItem.status); // 0: draft, 1: publish
          // formData.append('is_reminder',that.editedItem.is_reminder)
          // formData.append('connectToArray',that.connectToArray)
          // formData.append('is_template',that.editedItem.is_template)
          // formData.append('is_routine',that.editedItem.is_routine)
          // formData.append('is_suggestion', that.editedItem.is_suggestion);


          // // save object_type & object_id
          // if (that.contactId) {
          //   formData.append('object_type', 'contact');
          //   formData.append('object_id', that.contactId);
          // }
          // if (that.employeeId) {
          //   formData.append('object_type', 'employee');
          //   formData.append('object_id', that.employeeId);
          // }
          // formData.append('private_document', true);

          // // Security - shared attachment or not
          // if (that.checkSuperAdmin) {
          //   formData.append('industry_id', that.editedItem.industry_id_arr.toString());
          //   formData.append('is_shared', 1);
          //   formData.append('is_public', 1);
          // } else {
          //   // let is_shared = that.editedItem.is_shared ? 1 : 0;
          //   formData.append('is_shared', that.editedItem.is_shared);
          //   // let is_public = that.editedItem.is_public ? 1 : 0;
          //   formData.append('is_public', that.editedItem.is_public);
          // }
          // // formData.append('security_department_array', that.editedItem.security_department_array);
          // // formData.append('security_project_array', that.editedItem.security_project_array);
          // // formData.append('security_employee_array', that.editedItem.security_employee_array);
          // if (that.roleUser === 'user' && that.editedItem.is_public === 1) {
          //   formData.append('show_manager', 1);
          // }
          // if(!that.editMode) {
          //   if (that.checkResource) {
          //     formData.append('is_template', 1);
          //   }
          //   if (that.addedFrom) {
          //     formData.append('object_type', that.addedFrom);
          //   }
          //   if (that.editedItem.type_of_attachment === 1) {
          //     formData.append('file', that.selectedFile);
          //     formData.append('original_file_name', that.selectedFile.name);
          //     formData.append('file_size', that.selectedFile.size);
          //   }
          //   formData.append('type', that.type);
          //   if(that.editedItem.is_reminder && !that.editedItem.is_routine)
          //     {
          //       await that.createAsTask()
          //       formData.append('task_id', that.editedItem.task_id);
          //     }
          //     if(that.editedItem.is_reminder && that.editedItem.is_routine)
          //     {
          //       await that.createAsRoutine()
          //       formData.append('routine_id', that.editedItem.routine_id);
          //     }
          //   that.$store.dispatch('documents/store', formData).then(function (res) {
          //     that.connectToObjectFrom.document_id=res.data.id
          //     that.saveConnectToObject("document",res.data.id);
          //     that.$nuxt.$loading.start();
          //     that.reloadList();
          //     that.reloadListCategory();
          //     that.editedItem = that.defaultItem;
          //     that.$toaster.success(that.$i18n.t('message.success_document_add_new'));
          //   }).catch(() => {
          //     that.$toaster.error(that.$i18n.t('message.fail_document_add_new'));
          //     // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          //     that.$nuxt.$loading.finish();
          //   });
          // }
          that.close();
        }else {
        that.$toaster.error(that.$i18n.t('message.add_required_feild'))
      }
      },

      draft() {
        this.editedItem.status = 0;
        this.save();
      },

      publish() {
        this.editedItem.status = 1;
        this.save();
        // if (this.checkResource && !this.checkSuperAdmin) {
        //   if (this.editMode) {
        //     this.updateAndApply();
        //   } else {
        //     this.saveAndApply();
        //   }
        // } else {
        //   this.save();
        // }
      },

      apply() {
        if (this.editedItem.added_by === 1) {
          this.applyResourceFromSuperAdmin();
        } else {
          this.applyTemplate();
        }
      },

      reloadList(){
        this.$emit('reloadList');
      },

      resourceList(){
        this.$emit('resourceList');
      },

      reloadListCategory(){
        this.$emit('reloadListCategory');
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
        this.dialogDelete = false;
      },

      deleteItem(item) {
        this.deleteDocument(item);
        this.dialogDelete = false;
        this.close();
      },

      deleteDocument(item) {
        let that = this;
        that.$store.dispatch('documents/delete', item.id).then(function() {
          that.reloadList();
          that.$toaster.success(that.$i18n.t('message.success_document_delete'));
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_document_delete'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          // that.$nuxt.$loading.finish();
        });
      },

      getFile(item) {
        let filenameArray = item.uri.split('/').slice();
        let filename = filenameArray.slice(filenameArray.length - 1);
        downloadFile(item.url, filename);
      },

      // ADMIN - choose industry
      getSelectedIndustryItems(value) {
        this.editedItem.industry_id_arr = value.selectedItemsOutput;
      },

      // Apply from SA resource = create company resource
      applyResourceFromSuperAdmin() {
        let that = this;
        // create template
        if (that.$refs.form.validate()) {
          // that.formatDescriptionBeforeSave();
          let formData = new FormData();
          if (that.attachmentType) {
            that.editedItem.type_of_attachment = 1;
          } else {
            that.editedItem.type_of_attachment = 2;
          }
          if (that.editedItem.type_of_attachment === 1) {
            formData.append('applied_document', true);
            formData.append('original_file_name', that.editedItem.original_file_name);
            formData.append('file_size', that.editedItem.file_size);
            formData.append('uri', that.editedItem.uri);
          }
          formData.append('category_id', that.editedItem.category_id);
          formData.append('name', that.editedItem.name);
          formData.append('description', that.editedItem.description);
          formData.append('type_of_attachment', that.editedItem.type_of_attachment);
          formData.append('status', 1); // 0: draft, 1: public
          formData.append('private_document', true);
          // formData.append('is_renewed', 0);
          formData.append('is_shared', 1);
          formData.append('is_public', 1);
          formData.append('is_template', 1); // apply resource by SA => create resource
          formData.append('type', 'document');
          formData.append('object_type', 'document');
          formData.append('is_suggestion', that.editedItem.is_suggestion);
          // formData.append('added_from', 1);
          if (!that.editedItem.parent_id) {
            formData.append('parent_id', that.editedItem.id);
          } else {
            formData.append('parent_id', that.editedItem.parent_id);
          }
          that.$store.dispatch('documents/store', formData).then(function () {
            that.$nuxt.$loading.start();
            that.reloadList();
            that.changeTab(0);
            that.editedItem = that.defaultItem;
            that.$toaster.success(that.$i18n.t('message.success_document_add_new'));
          }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_document_add_new'));
          }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish();
          });
          that.close();
        }
      },

      // Apply resource = Publish a resource to document
      applyTemplate() {
        let that = this;
        if (that.$refs.form.validate()) {
          // that.formatDescriptionBeforeSave();
          let formData = new FormData();
          if (that.attachmentType) {
            that.editedItem.type_of_attachment = 1;
          } else {
            that.editedItem.type_of_attachment = 2;
          }
          if (that.editedItem.type_of_attachment === 1) {
            if (that.selectedFile.length !== 0) {
              formData.append('file', that.selectedFile);
              formData.append('original_file_name', that.selectedFile.name);
              formData.append('file_size', that.selectedFile.size);
            } else {
              formData.append('applied_document', true);
              formData.append('original_file_name', that.editedItem.original_file_name);
              formData.append('file_size', that.editedItem.file_size);
              formData.append('uri', that.editedItem.uri);
            }
          }
          formData.append('category_id', that.editedItem.category_id);
          formData.append('name', that.editedItem.name);
          formData.append('description', that.editedItem.description);
          formData.append('type_of_attachment', that.editedItem.type_of_attachment);
          formData.append('status', 1); // 0: draft, 1: public
          formData.append('private_document', true);
          // formData.append('is_renewed', 0);
          formData.append('is_shared', 1);
          formData.append('is_public', 1);
          formData.append('is_template', 0); // apply resource NOT by SA => create document
          formData.append('type', 'document');
          formData.append('object_type', 'document');
          formData.append('is_suggestion', that.editedItem.is_suggestion);
          // formData.append('added_from', 1);
          formData.append('parent_id', that.editedItem.id);

          that.$store.dispatch('documents/store', formData).then(function () {
            that.$nuxt.$loading.start();
            that.reloadList();
            that.changeTab(0);
            that.$toaster.success(that.$i18n.t('message.success_document_add_new'));
          }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_document_add_new'));
          }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish();
          });
          that.close();
        }
      },

      // saveAndApply(){
      //   let that = this;
      //   // create template
      //   if (that.$refs.form.validate()) {
      //     that.formatDescriptionBeforeSave();
      //     let formData = new FormData();
      //     if (that.attachmentType) {
      //       that.editedItem.type_of_attachment = 1;
      //     } else {
      //       that.editedItem.type_of_attachment = 2;
      //     }
      //     if (that.editedItem.type_of_attachment === 1) {
      //       formData.append('file', that.selectedFile);
      //       formData.append('original_file_name', that.selectedFile.name);
      //       formData.append('file_size', that.selectedFile.size);
      //     }
      //     formData.append('category_id', that.editedItem.category_id);
      //     formData.append('name', that.editedItem.name);
      //     formData.append('description', that.editedItem.description);
      //     formData.append('type_of_attachment', that.editedItem.type_of_attachment);
      //     formData.append('status', 1); // 0: draft, 1: public
      //     formData.append('private_document', true);
      //     // formData.append('is_renewed', 0);
      //     formData.append('is_public', 1);
      //     formData.append('is_template', 1);
      //     formData.append('added_from', 1);
      //     formData.append('type', 'document');
      //
      //     that.$store.dispatch('documents/store', formData).then(result => {
      //       that.editedItem.id = result.data.id;
      //       that.applyTemplate();
      //     }).catch((error) => {
      //       that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
      //       that.$nuxt.$loading.finish();
      //     });
      //   }
      // },

      // updateAndApply(){
      //   let that = this;
      //   if (that.$refs.form.validate()) {
      //     that.formatDescriptionBeforeSave();
      //     let formData = new FormData();
      //     if (that.attachmentType) {
      //       that.editedItem.type_of_attachment = 1;
      //     } else {
      //       that.editedItem.type_of_attachment = 2;
      //     }
      //     if (that.editedItem.type_of_attachment === 1 && that.selectedFile.length !== 0) {
      //       formData.append('file', that.selectedFile);
      //       formData.append('original_file_name', that.selectedFile.name);
      //       formData.append('file_size', that.selectedFile.size);
      //       formData.append('changed_file', true);
      //     }
      //     formData.append('category_id', that.editedItem.category_id);
      //     formData.append('name', that.editedItem.name);
      //     formData.append('description', that.editedItem.description);
      //     formData.append('type_of_attachment', that.editedItem.type_of_attachment);
      //     formData.append('status', 1); // 0: draft, 1: public
      //     formData.append('private_document', true);
      //     // formData.append('is_renewed', 0);
      //     formData.append('is_public', 1);
      //     formData.append('is_template', 1);
      //     formData.append('id', that.editedItem.id);
      //     formData.append('type', 'document');
      //     formData.append('added_from', 1);
      //     formData.append('attachment_updated', true);
      //
      //     that.$store.dispatch('documents/store', formData).then(result => {
      //       that.editedItem.uri = result.data.uri;
      //       that.applyTemplate();
      //     }).catch((error) => {
      //       that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
      //       that.$nuxt.$loading.finish();
      //     });
      //   }
      // },
    },
  };
</script>

<style scoped>
::v-deep .sortable{
  font-size: 14px !important;
}
.category .department-button{
  display: inline-flex;
}
:deep(.reminder-main){
  padding-right: 20px !important;
  padding-bottom: 40px !important;
}
:deep(.bold-title){
  margin-right: 0px !important;
}
.default-question-mark{
  max-width: 50px;
}
:deep(.reminer-new .switch-component.switch-component-small){
  left: 100px !important;
}
:deep(.reminer-new .section-connect-to .section-connect-to-label.section-connect-to-label-reminder){
  width: 290px;
}
/* :deep(.icon-upload-attachment .v-input__control){
  opacity: 0;
}
:deep(.attach-sub-value .v-input__control){
   opacity: 1;
} */
.cust-image-name{
 position: absolute;
    top: 60%;
    text-overflow: ellipsis;
    width: 262px;
    overflow: hidden;
    white-space: nowrap;
}
</style>

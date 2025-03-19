<template>
  <div>
    <v-dialog v-model="openPopup" max-width="1125px" persistent>
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
              v-if="editMode"
              class="mt-0"
              align-v="center"
              align-h="end"
            >
              <b-col cols="3" class="pt-0">
                <v-btn

                  block
                  @click="dialogUpdateHistory = true"
                >
                  View update history
                </v-btn>
              </b-col>
              <b-col v-if="!checkResource" cols="4" class="pt-0">
                <v-btn
                  block
                  @click="dialogRelatedReport = true"
                >
                  View related risk analysis report
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

              <b-col cols="5" class="d-flex pl-16">
                <div class="bold-title md-line-height">
                  {{ $t('title.shortcut') }}
                </div>
                <v-badge
          :value="hover"
          right
          transition="slide-x-transition"
          class="hse-badge-icon"
        >
          <span slot="badge">{{ $t('message.hover_shortcut') }}</span>
          <v-hover v-model="hover">
            <i class="fa fa-question-circle"></i>
          </v-hover>
        </v-badge>
                <div class="input-wrap">
                  <div class="switch-component document-type-wrap default-question-mark">
                    <label class="left-text">{{ $t('form.none') }}</label>
                    <v-switch
                      v-model="is_shortcut"
                      :label="$t('form.active')"
                      class="right-text"
                      inset
                      :readonly="!editedItem.editPermission && editedItem.added_by !== userLogged"
                    />
                  </div>
                </div>
              </b-col>
              <NewRiskAnalysisPopup
                :open-popup="is_shortcut"
                :job-title-array="jobTitleArray"
                :departments-array="departmentsArray"
                :task-assignees-array="taskAssigneesArray"
                :categoriesArray="categoriesArray"
                :responsible-array="responsibleArray"
                @closePopup="is_shortcut = !is_shortcut"
                @reloadList="reloadList"
              />
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
              :type-category="category_risk_area"
              :is-open-popup="openPopup"
              @getNewCategory="getNewCategory"
            />
            <!-- Attachemnt -->

            <!-- <b-row class="pb-10">
              <b-col cols="6">
                <div class="input-wrap">
                  <v-checkbox
                    v-model="uploadAttachment"
                    :label="$t('form.upload_attachment')"
                    class="margin-right-sm mt-0"
                    :hide-details="true"
                    :readonly="!editedItem.editPermission"
                    @change="editedItem.type_of_attachment = uploadAttachment"
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
                  <img v-bind:src="previewUrl" alt="risk-area">
                </div>
                <div v-if="editMode" class="download-item mt-3">
                  You can download file
                  <span @click="getFile(editedItem.attachment)">here</span>
                </div>
              </b-col>
            </b-row> -->
            <!--            <connect_to-->
            <!--              v-if="userRoleId > 1 && checkShowConnectTo"-->
            <!--              :edited-item="editedItem"-->
            <!--              :departments-array="departmentsArray"-->
            <!--              :job-title-array="jobTitleArray"-->
            <!--              :project-array="projectArray"-->
            <!--              :deny-edit="!editedItem.editPermission"-->
            <!--              @updateConnect="checkUpdateConnect"-->
            <!--            />-->
            <b-row class="section-description">
              <b-col>
                <div class="input-wrap form-description">
                  <!--                  <vue-editor-->
                  <!--                    v-model="editedItem.description"-->
                  <!--                    :rules="required"-->
                  <!--                    :disabled="!editedItem.editPermission"-->
                  <!--                  />-->
                  <FroalaSuggestionListEditor
                    :item="editedItem"
                    :predefined-link-array="predefinedLinkArray"
                  />
                </div>
              </b-col>
            </b-row>
            <connect-to-object
              class="risk-modal"
              :ctoFunctionProp="ctoFunction"
              :categoryProp="category"
              :connectToObjectTableProp="connectToObjectTable"
              :objectProp="object"
              :connectToObjectTableHeadersProp="connectToObjectTableHeaders"
              @editConnectToObject="editConnectToObject"
              @addConnectToObject="addConnectToObject"
            />
            <Security
              v-if="!checkSuperAdmin && checkShowConnectTo"
              :security-item="editedItem"
              :edit-mode="editMode"
              @changeSecurity="changeSecurity"
            />
            <!-- --- Attachment --- -->
            <b-row v-if="!attachmentType">
                <b-col cols="2">
                  <div class="bold-title md-line-height">
                    {{ $t('title.attachments') }}
                  </div>
                </b-col>
                <b-col cols="4">
                  <div class="input-wrap">
                    <div class="switch-component default-question-mark">
                      <label class="left-text">{{ $t('form.none') }}</label>
                      <v-switch
                        v-model="attachmentType"
                        :label="$t('form.add')"
                        class="right-text"
                        inset
                        @change="changeSwitchAttachment(attachmentType)"
                      />
                    </div>
                  </div>
                </b-col>
              </b-row>
              <div v-else class="section-connect-to mt-8">
                <div class="section-connect-to-label section-connect-to-label-reminder">
                  {{ $t('title.attachments') }}
                </div>
                <div class="switch-component switch-required-comment-small ">
                  <label class="left-text">{{ $t('form.none') }}</label>
                  <v-switch
                    v-model="attachmentType"
                    :label="$t('form.add')"
                    class="right-text"
                    inset
                    @change="changeSwitchAttachment(attachmentType)"
                  />
                </div>
                <div class="required-upload-attachment p-4">
                  <div class="upload-field text-center p-2">
                    <div v-if="previewUrl">
                      <img class="image-field" v-bind:src="previewUrl" alt="image">
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

            <!-- button USE RISK ELEMENT -->
            <v-btn
              v-if="editMode && !checkResource && (checkAdmin || permissionsUser.indexOf('risk analysis-basic') > -1)"
              class="btn-save mt-4"
            >
              <nuxt-link class="nav-link" style="color: white"
                         :to="'/' + $i18n.locale + '/reports/reportedRiskanalysis?risk=' + editedItem.id">
                Use risk element
              </nuxt-link>
            </v-btn>
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
          <v-spacer/>
          <v-btn class="btn-cancel" text @click="close">
            {{ $t('button.cancel') }}
          </v-btn>
          <v-btn
            v-if="checkSuperAdmin || (editedItem.editPermission && ((!editMode && checkResource && (checkAdmin || permissionsUser.indexOf('risk area-resource') > -1)) || (!checkResource && (checkAdmin || permissionsUser.indexOf('risk area-basic') > -1))))"
            class="btn-save"
            @click="save"
          >
            {{ $t('button.save') }}
          </v-btn>
          <v-btn
            v-if="editMode && checkResource && ((checkAdmin || permissionsUser.indexOf('risk area-resource') > -1) && editedItem.editPermission)"
            class="btn-save"
            @click="applyTemplate"
          >
            {{ $t('button.apply') }}
          </v-btn>
          <v-btn
            v-if="editMode
            && (((checkResource && ((!editedItem.company_id && checkSuperAdmin) || (editedItem.company_id && (checkAdmin || permissionsUser.indexOf('risk area-resource') > -1))))
            || (!checkResource && (checkAdmin || permissionsUser.indexOf('risk area-basic') > -1))) && editedItem.editPermission)"
            class="hse-btn-delete"
            text
            @click="dialogDelete = true"
          >
            <v-icon dark>
              mdi-delete
            </v-icon>
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
          <div v-if="editedItem.type_of_attachment" class="confirm-delete-text">
            This object contains 1 attachment. Are you sure you want to delete it?
          </div>
          <div v-else class="confirm-delete-text">
            {{ $t('message.are_you_sure_you_want_to_delete_this_item') }}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn class="btn-cancel" text @click="close">
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
            <p>Your risk area has successfully been applied to your active risk area.</p>
            <p class="text-center">
              <v-btn class="btn-default" text @click="showItem(editedItem)">
                Click here to review risk area
              </v-btn>
            </p>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn class="btn-cancel" text @click="closeApply">
            {{ $t('button.cancel') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--    <v-dialog v-model="dialogConfirmApply" max-width="500px">-->
    <!--      <v-card class="dialog-delete">-->
    <!--        <v-card-text>-->
    <!--          <div class="text-center confirm-delete-title">-->
    <!--            {{ $t('title.confirm_modal') }}-->
    <!--          </div>-->
    <!--          <div class="confirm-delete-text">-->
    <!--            <p> Do you want to save the updates before applying the template?</p>-->
    <!--          </div>-->
    <!--        </v-card-text>-->
    <!--        <v-card-actions>-->
    <!--          <v-spacer />-->
    <!--          <v-btn class="btn-cancel" text @click="updateAndApply">-->
    <!--            {{ $t('button.yes') }}-->
    <!--          </v-btn>-->

    <!--          <v-btn class="btn-cancel" text @click="applyTemplate">-->
    <!--            {{ $t('button.no') }}-->
    <!--          </v-btn>-->
    <!--        </v-card-actions>-->
    <!--      </v-card>-->
    <!--    </v-dialog>-->

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
          <v-spacer/>
          <v-btn class="btn-cancel" text @click="close">
            {{ $t('button.yes') }}
          </v-btn>

          <v-btn class="btn-cancel" text @click="dialogConfirmClose = false">
            {{ $t('button.no') }}
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
          <v-spacer/>
          <v-btn class="btn-cancel" text @click="dialogUpdateHistory = false">
            {{ $t('button.close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogRelatedReport" max-width="800px">
      <v-card class="dialog-delete">
        <v-card-text>
          <div class="text-center confirm-delete-title">
            Related risk analysis report
          </div>
          <v-list-item
            v-for="(item, index) in editedItem.relatedRiskAnalysisArray" :key="index"
            two-line
          >
            <v-list-item-content>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
              <v-list-item-subtitle>
                <span v-if="parseInt(item.probability) === 1" class="mr-3">Probability: Low</span>
                <span v-else-if="parseInt(item.probability) === 2" class="mr-3">Probability: Moderate</span>
                <span v-else-if="parseInt(item.probability) === 3" class="mr-3">Probability: High</span>
                <span v-else class="mr-3">Probability: Very high</span>
                <span v-if="parseInt(item.consequence) === 1" class="mr-3">Consequence: Low</span>
                <span v-else-if="parseInt(item.consequence) === 2" class="mr-3">Consequence: Moderate</span>
                <span v-else-if="parseInt(item.consequence) === 3" class="mr-3">Consequence: High</span>
                <span v-else class="mr-3">Consequence: Very high</span>
                <span>Date: {{ moment(item.updated_at).format('DD.MM.YYYY') }}</span>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn class="btn-cancel" text @click="dialogRelatedReport = false">
            {{ $t('button.close') }}
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
  // import ConnectTo from "./ConnectTo";
  import cookies from "js-cookie";
  import axios from "axios";
  import {downloadFile} from "../utils/downloadFile";
  import AttachmentPopup from "./AttachmentPopup";
  import MultipleSelection from "./MultipleSelection";
  import FroalaSuggestionListEditor from "./FroalaSuggestionListEditor";
  import Security from "./Security";
  import Category from "./Category";
  import ConnectToObject from "./ConnectToObject.vue";
  import NewRiskAnalysisPopup from "./NewRiskAnalysisPopup.vue";

  export default {
    name: "RiskAreaPopup",
    components: {
      // connect_to: ConnectTo,
      AttachmentPopup,
      MultipleSelection,
      FroalaSuggestionListEditor,
      Security,
      category: Category,
      ConnectToObject,
      NewRiskAnalysisPopup
    },
    props: {
      resource: {
        type: Boolean,
        required: false,
      },
      riskAreaItem: {
        type: Object,
        required: false,
      },
      openPopup: Boolean,
      industryArray: {
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
      predefinedLinkArray: {
        type: Array,
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
      categoriesArray: Array,
    },
    data: () => ({
      permissionsUser: localStorage.getItem('permissionsKey'),
      checkAdmin: cookies.get('checkAdmin'),
      checkSuperAdmin: cookies.get('checkSuperAdmin'),
      // roleUser: cookies.get('roleUser'),
      userLogged: parseInt(cookies.get('userID')),
      userRoleId: parseInt(cookies.get('roleID')),
      valid: true,
      attachmentType: false,
      is_shortcut: false,
      selectedFile: [],
      required: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else return true;
        }
      ],
      ctoFunction: [
        {id: "Task", name: 'task'},
        {id: "Goal", name: 'goal'},
        {id: "Routine", name: 'routine'},
        {id: "Instruction", name: 'instruction'},
        {id: "Risk element source", name: 'risk'},
        {id: "Checklist", name: 'checklist'},
        {id: "Attachment", name: 'attachment'},
        {id: "Document", name: 'document'},
        {id: "Contact", name: 'contact'},
        {id: "Deviation", name: 'deviation'},
      ],
      category: [],
      connectToObjectTable: [],
      object: [],
      connectToObjectFrom: {document_id: '', connectToArray: [], object_id: ''},
      editedItem: {
        id: '',
        name: '',
        description: '',
        industry_id: '',
        industry_id_arr: [],
        category_id: '',
        type: '',
        added_from: '',
        type_of_attachment: false,
        attachment: '',
        department_id: '',
        job_title_id: '',
        count_related_object: 0,
        related_objects: [],
        historyArray: [],
        relatedRiskAnalysisArray: [],
        editPermission: true,
        is_suggestion: false,
        // table Security
        object_type: 'risk',
        is_shared: false,
        is_public: false,
        department_array: [],
        employee_array: [],
      },
      defaultItem: {
        id: '',
        name: '',
        description: '',
        industry_id: '',
        industry_id_arr: [],
        category_id: '',
        type: '',
        added_from: '',
        type_of_attachment: false,
        attachment: '',
        department_id: '',
        job_title_id: '',
        count_related_object: 0,
        related_objects: [],
        historyArray: [],
        relatedRiskAnalysisArray: [],
        editPermission: true,
        is_suggestion: false,
        // table Security
        object_type: 'risk',
        is_shared: false,
        is_public: false,
        department_array: [],
        employee_array: [],
      },
      statusNew: 1,
      statusClosed: 3,
      isClosed: false,
      denyEdit: false,
      // dialog: false,
      dialogDelete: false,
      // dialogConfirmApply: false,
      dialogApply: false,
      dialogConfirmClose: false,
      formTitle: '',
      editMode: true,
      formDirty: false,
      checkResource: false,
      checkShowConnectTo: true,
      dialogUpdateHistory: false,
      dialogRelatedReport: false,

      document_type: 'report', // document type: reported attachments
      document_added_from: 'risk',
      file_accept: "image/png, image/jpeg, image/jpg, image/gif",
      previewUrl: null, // upload picture
      checkAttachmentOpen: false,
      uploadAttachment: false,
      hoverQuestionMark: false,
      hover:false,
      // category
      category_risk_area: 'risk',
      categoriesValidArray: [],
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
        if (value) {
          if (this.riskAreaItem) {
            let categoryId = this.riskAreaItem.category_id;
            this.categoriesValidArray = _.filter(this.categoriesArray, function (item) {
              return (!item.disable_status || (item.disable_status && item.id === categoryId));
            });
            this.editItem(this.riskAreaItem);
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
    },

    created() {
      if (this.openPopup) {
        if (this.riskAreaItem) {
          this.editItem(this.riskAreaItem);
        } else {
          this.addNew();
        }
      }

      if (this.resource) {
        this.checkResource = this.resource;
      }
    },

    methods: {
      translateCol(colName) {
        return this.$i18n.t('column.' + colName);
      },
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
          this.formTitle = this.$i18n.t('title.new_risk_element_resource');
        } else {
          this.formTitle = this.$i18n.t('title.new_risk_element');
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
      editConnectToObject() {
      },
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

      editItem(item) {
        let that = this;
        that.$nuxt.$loading.start();
        that.formTitle = that.$i18n.t('title.edit_risk_element');
        that.$store.dispatch('riskElementSource/show', item.id).then(result => {
          that.editedItem = Object.assign({}, result.data);
          that.editedItem.editPermission = result.data.editPermission;
          that.editedItem.historyArray = result.data.history;
          that.editedItem.relatedRiskAnalysisArray = result.data.relatedRiskAnalysis;
          if (that.userRoleId === 1) {
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

          if (that.editedItem.attachment !== null) {
            that.editedItem.type_of_attachment = true;
            that.uploadAttachment = true;
            that.getImageSrc(that.editedItem.attachment.url);
          } else {
            that.editedItem.type_of_attachment = false;
          }
          that.originData = _.clone(that.editedItem);
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_risk_element_view_detail'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
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
      changeSwitchAttachment(val) {
        if (!val) {
          this.previewUrl = null;
          this.selectedFile = [];
        }
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
        this.$emit('closePopup');
        this.reloadListCategory();
        this.dialogConfirmClose = false;
        // this.dialogConfirmApply = false;
        this.formDirty = false;
      },

      reset() {
        this.denyEdit = false;
        this.isClosed = false;
        this.uploadAttachment = false;
        this.previewUrl = null;
        // this.filterEmployees();
        this.$nuxt.$loading.finish();
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          // this.$refs.form.reset();
          this.$refs.form.resetValidation();
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
          let is_shared = that.editedItem.is_shared;
          let department_array = that.editedItem.department_array;
          let employee_array = that.editedItem.employee_array;
          if (that.editMode) {
            // edit
            if (that.editedItem.type_of_attachment && that.selectedFile) {
              that.editedItem.type = 'attachment';
              that.$store.dispatch('riskElementSource/update', that.editedItem).then(result => {
                that.saveDocument(result.data, is_shared, department_array, employee_array);
                that.$toaster.success(that.$i18n.t('message.success_risk_element_update'));
              }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
                that.$toaster.error(that.$i18n.t('message.fail_risk_element_update'));
                }
                // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage);
                that.$nuxt.$loading.finish();
              });
            } else {
              that.$store.dispatch('riskElementSource/update', that.editedItem).then(function () {
                that.reloadList();
                that.reloadListCategory();
                that.$toaster.success(that.$i18n.t('message.success_risk_element_update'));
              }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
                that.$toaster.error(that.$i18n.t('message.fail_risk_element_update'));
                }
                // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage);
                that.$nuxt.$loading.finish();
              });
            }
          } else {
            // create
            if (that.checkResource) {
              that.editedItem.is_template = true;
            }
            if (that.editedItem.type_of_attachment) {
              that.editedItem.type = 'attachment';
              that.$store.dispatch('riskElementSource/store', that.editedItem).then(result => {
                that.saveDocument(result.data, is_shared, department_array, employee_array);
                that.$toaster.success(that.$i18n.t('message.success_risk_element_add_new'));
              }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
                that.$toaster.error(that.$i18n.t('message.fail_risk_element_add_new'));
                }
                // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage);
                that.$nuxt.$loading.finish();
              });
            } else {
              that.$store.dispatch('riskElementSource/store', that.editedItem).then(function () {
                that.reloadList();
                that.reloadListCategory();
                that.$toaster.success(that.$i18n.t('message.success_risk_element_add_new'));
              }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
                that.$toaster.error(that.$i18n.t('message.fail_risk_element_add_new'));
                }
                // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage);
                that.$nuxt.$loading.finish();
              });
            }
          }
          that.close();
        }
      },

      reloadList() {
        this.$emit('reloadList');
      },

      reloadListCategory() {
        this.$emit('reloadListCategory');
      },

      saveDocument(risk, is_shared, department_array, employee_array) {
        let that = this;
        that.$nuxt.$loading.start();
        let formData = new FormData();
        if (that.editMode && risk.attachmentResource) {
          formData.append('original_file_name', risk.attachmentResource.original_file_name);
          formData.append('file_size', risk.attachmentResource.file_size);
          formData.append('uri', risk.attachmentResource.uri);
          formData.append('applied_document', true);
        } else {
          formData.append('file', that.selectedFile);
          formData.append('original_file_name', that.selectedFile.name);
          formData.append('file_size', that.selectedFile.size);
        }
        if (!that.checkResource) {
          let is_public = is_shared ? 1 : 0;
          formData.append('is_public', is_public);
          if (is_shared) {
            formData.append('security_department_array', department_array);
            formData.append('security_employee_array', employee_array);
          }
        }
        formData.append('name', risk.name);
        formData.append('category_id', risk.category_id);
        formData.append('type', that.document_type);
        formData.append('object_type', that.document_added_from);
        formData.append('object_id', risk.id);
        formData.append('type_of_attachment', 1);
        formData.append('status', 1);
        formData.append('is_renewed', 0);
        formData.append('private_document', true);
        if (that.editMode && risk.attachment && risk.attachment.id) {
          formData.append('id', risk.attachment.id);
          formData.append('attachment_updated', true);
          formData.append('changed_file', true);
        }
        that.$store.dispatch('documents/store', formData).then(function () {
          that.reloadList();
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_document_add_new'));
          }
          that.$nuxt.$loading.finish();
          // if (error.response && error.response.data) {
          //   that.$toaster.error(error.response.data.message || error.response.data.errors);
          //   that.$nuxt.$loading.finish();
          // }
        });
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

      closeApply() {
        this.dialogApply = false;
      },

      deleteItem(item) {
        this.deleteObject(item);
        this.dialogDelete = false;
        this.close();
      },

      deleteObject(item) {
        let that = this;
        that.$store.dispatch('riskElementSource/delete', item.id).then(function () {
          that.reloadList();
          that.$toaster.success(that.$i18n.t('message.success_risk_element_delete'));
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_risk_element_delete'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      },

      //function to apply selected template content to all input
      applyTemplate() {
        let that = this;
        if (that.$refs.form.validate()) {
          that.$nuxt.$loading.start();
          that.editedItem.is_template = false;
          // if (!that.editedItem.parent_id) {
          //   that.editedItem.parent_id = that.editedItem.id;
          // }
          let attachmentResource = '';
          if (that.editedItem.attachment) {
            // that.editedItem.attachmentResource = that.editedItem.attachment;
            attachmentResource = that.editedItem.attachment;
          }
          that.$store.dispatch('riskElementSource/store', that.editedItem).then(function (result) {
            that.editedItem = result.data;
            result.data.attachmentResource = attachmentResource;
            that.saveDocument(result.data);
            // that.dialogApply = true;
            that.reloadList();
            that.$toaster.success(that.$i18n.t('message.success_risk_element_add_new'));
          }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_risk_element_add_new'));
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
      //     that.editedItem.is_template = true;
      //     that.$store.dispatch('riskElementSource/store', that.editedItem).then(result => {
      //       that.editedItem.parent_id = result.data.id;
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
      //     that.$store.dispatch('riskElementSource/update', that.editedItem).then(result => {
      //       that.editedItem.parent_id = result.data.id;
      //       that.applyTemplate();
      //     }).catch((error) => {
      //       that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
      //       that.$nuxt.$loading.finish();
      //     });
      //   }
      // },

      //----- END - function to apply selected template content to all input

      updateResource(value) {
        this.$emit('updateResource', value);
      },

      changeTab(value) {
        this.$emit('changeTab', value);
      },

      showItem(item) {
        this.dialogApply = false;
        // this.checkResource = false;
        // this.updateResource(this.checkResource);
        // this.changeTab(0);
        this.$emit('showItem', item);
      },

      // ADMIN - choose industry
      getSelectedIndustryItems(value) {
        this.editedItem.industry_id_arr = value.selectedItemsOutput;
      },

      getFile(item) {
        let filenameArray = item.uri.split('/').slice();
        let filename = filenameArray.slice(filenameArray.length - 1);
        downloadFile(item.url, filename);
      },

      // show image
      showAttachment() {
        // if (!this.editMode) {
        this.checkAttachmentOpen = true;
        // }
      },

      getImage(file) {
        this.previewImage(file.imageFile);
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

      // show image
      getImageSrc(url) {
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
    },
  };
</script>

<style scoped>
.default-question-mark{
  max-width: 50px;
}

:deep(.risk-modal .risk-area .col-2){
  padding-right: 0px !important;
}
:deep(.section-connect-to.section-upload-document .v-input__control){
  margin-top: 0px;
}
:deep(.section-connect-to.section-upload-document){
  height: 100px;
}
.switch-component.document-type-wrap{
  padding-left: 100px;
}
.risk-attechment .switch-component.switch-component-small{
  padding-left: 50px;
  left: 112px;
}
</style>

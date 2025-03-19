<template>
  <div>
    <v-dialog v-model="openPopup" max-width="1125px" persistent scrollable>
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
            <!-- Name & Type -->
            <b-row>
              <!-- Name -->
              <!-- col12 -->
              <b-col
                v-if="(objectField.indexOf('name') > -1) && !(objectField.indexOf('risk-element') > -1) && !(objectField.indexOf('goal-type') > -1) && !(objectField.indexOf('risk-analysis') > -1)"
                cols="12"
              >
                <div class="input-wrap">
                  <v-text-field
                    v-model="item.name"
                    :label="$t('form.name')"
                    :rules="required"
                    outlined
                  />
                </div>
              </b-col>
              <!-- col7 -->
              <b-col
                v-if="objectField.indexOf('name') > -1 && ((objectField.indexOf('goal-type') > -1) || (objectField.indexOf('risk-analysis') > -1))"
                cols="7"
              >
                <div class="input-wrap">
                  <v-text-field
                    v-model="item.name"
                    :label="$t('form.name')"
                    :rules="required"
                    outlined
                  />
                </div>
              </b-col>
              <!-- col6 -->
              <b-col
                v-if="objectField.indexOf('name') > -1 && objectField.indexOf('risk-element') > -1"
                cols="6"
              >
                <div class="input-wrap">
                  <v-text-field
                    v-model="item.name"
                    :label="$t('form.name')"
                    :rules="required"
                    outlined
                  />
                </div>
              </b-col>

              <!-- Type goal: goal/ sub goal -->
              <b-col v-if="objectField.indexOf('goal-type') > -1" cols="1" class="default-question-mark">
                <div class="bold-title md-line-height text-center">
                  Type
                </div>
<!--                <v-badge-->
<!--                  :value="hoverShowInRiskAnalysis"-->
<!--                  right-->
<!--                  transition="slide-x-transition"-->
<!--                  class="icon-show-in-risk-analysis"-->
<!--                  :content="'Description of Maingoal and Subgoal'"-->
<!--                >-->
<!--                  <v-hover v-model="hoverShowInRiskAnalysis">-->
<!--                    <i class="fa fa-question-circle"></i>-->
<!--                  </v-hover>-->
<!--                </v-badge>-->
              </b-col>
              <b-col v-if="objectField.indexOf('goal-type') > -1" cols="4">
                <div class="switch-component default-question-mark">
                  <label class="left-text">{{ $t('form.main_goal') }}</label>
                  <v-switch
                    v-model="goalType"
                    :label="$t('form.sub_goal')"
                    inset
                    class="right-text"
                    :disabled="!!planAccess?.lastPlanAccess?.task || ! planAccess?.planAccess?.task"
                  />
                  <v-hover v-model="hoverSubGoalPlanAccess" v-if="!!planAccess?.lastPlanAccess?.task || ! planAccess?.planAccess?.task">
                  <v-badge
                    :value="hoverSubGoalPlanAccess"
                    right
                    transition="slide-x-transition"
                    class="hse--icon-question-circle"
                    style="cursor: pointer;">
                    <span slot="badge" @click="redirectUrl">{{ $t('message.accessible_module') }}</span>
                      <i class="fa fa-question-circle"></i>
                    </v-badge>
                  </v-hover>
                </div>
              </b-col>

              <!-- Type risk element: show in risk analysis -->
              <b-col v-if="objectField.indexOf('risk-element') > -1" cols="3" class="default-question-mark">
                <div class="bold-title md-line-height text-center">
                  {{ $t('form.show_in_risk_analysis') }}
                </div>
                <v-badge
                  :value="hoverShowInRiskAnalysis"
                  right
                  transition="slide-x-transition"
                  class="icon-show-in-risk-analysis"
                  :content="'Show this element in Risk analysis'"
                >
                  <v-hover v-model="hoverShowInRiskAnalysis">
                    <i class="fa fa-question-circle"></i>
                  </v-hover>
                </v-badge>
              </b-col>
              <b-col v-if="objectField.indexOf('risk-element') > -1" cols="3">
                <div class="switch-component switch-required-action">
                  <label class="left-text">{{ $t('form.none') }}</label>
                  <v-switch
                    v-model="item.show_in_risk_analysis"
                    :label="$t('form.activate')"
                    inset
                    class="right-text"
                  />
                </div>
              </b-col>

              <!-- Type risk analysis: process risk analysis -->
              <b-col v-if="objectField.indexOf('risk-analysis') > -1" cols="2">
                <div class="bold-title md-line-height text-right">
                  {{ $t('form.process') }}
                </div>
              </b-col>
              <b-col v-if="objectField.indexOf('risk-analysis') > -1" cols="3">
                <div class="switch-component switch-required-action">
                  <label class="left-text">{{ $t('form.none') }}</label>
                  <v-switch
                    v-model="item.isProcess"
                    :label="$t('form.activate')"
                    inset
                    class="right-text"
                  />
                </div>
              </b-col>
            </b-row>

            <!-- SUPER ADMIN - Industry -->
            <b-row v-if="checkSuperAdmin && objectField.indexOf('industry') > -1">
              <b-col cols="12">
                <div class="input-wrap industry-select-input-wrap">
                  <MultipleSelection
                    :item="item"
                    :selected-items-input="item.industry"
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

            <!-- Category -->
            <Category
              v-if="objectField.indexOf('category') > -1"
              :category-item="item"
              :categories-array="categoriesValidArray"
              :type-category="categoriesType"
              :is-open-popup="openPopup"
              :source="(objectField.indexOf('risk-analysis-import-information') > -1) ? 'risk-analysis' : null"
              @getNewCategory="getNewCategory"
            />

            <!-- Description -->
            <b-row v-if="objectField.indexOf('description') > -1" class="section-description">
              <b-col>
                <div class="input-wrap form-description">
                  <FroalaSuggestionListEditor
                    :item="item"
                    :predefined-link-array="predefinedLinkArray"
                  />
                </div>
              </b-col>
            </b-row>

            <!-- RISK ANALYSIS - filter risk element -->
            <RiskAnalysis
              v-if="objectField.indexOf('risk-element-filter') > -1"
              :object-item="item"
              @updateRiskElement="updateRiskElement"
            />

            <!-- Add new source of danger -->
            <SourceOfDanger
              v-if="objectField.indexOf('source-of-danger') > -1"
              :object-item="item"
              :edit-mode="false"
              :is-process-activate="item.isProcess"
              @updateSourceOfDanger="updateSourceOfDanger"
            />

            <!-- RISK ANALYSIS - TASK - import information -->
            <RiskAnalysisImportInformation
              v-if="objectField.indexOf('risk-analysis-import-information') > -1 || isRiskAnalysis"
              :object-item="item"
              @processSourceOfDanger="processSourceOfDanger"
            />

            <!-- Connect to object -->
              <connect-to-object
                  v-if="(objectField.indexOf('connect-to') > -1) && roleUser !== 'user'"
                       class="mt-2"
                       :isEmptyData="openPopup"
                       :connectToArrayInput="item.connectToArray"
                       @getConnectToArray="getConnectToArray"
                     />

            <!-- Security -->
            <Security
              v-if="!checkSuperAdmin && !checkResource && objectField.indexOf('security') > -1"
              :security-item="item"
              :edit-mode="false"
              :is-instruction-object="objectField.indexOf('security') > -1"
              @changeSecurity="changeSecurity"
            />

            <!-- Responsible -->
            <Responsible
              v-if="!checkSuperAdmin && !checkResource && objectField.indexOf('responsible') > -1"
              :object-item="item"
              :no-required-action="objectField.indexOf('activity') > -1"
              :edit-mode="false"
              :newRequire="true"
            />

            <!-- Responsible RISK ANALYSIS -->
            <Responsible
              v-if="!checkSuperAdmin && !checkResource && objectField.indexOf('responsible-risk-analysis') > -1 && item.isProcess"
              :object-item="item"
              :no-required-action="true"
              :edit-mode="false"
              :newRequire="true"
            />

            <!-- Attendee -->
            <Attendee
              v-if="!checkSuperAdmin && !checkResource && (objectField.indexOf('attendee') > -1) && !goalType"
              :object-item="item"
              :no-required-action="objectField.indexOf('activity') > -1"
              :edit-mode="false"
              :newRequire="true"
              :disabled="roleUser=='user'"
            />

            <!-- Start date -->
            <StartDate
              v-if="!checkSuperAdmin && !checkResource && (objectField.indexOf('start-date') > -1) && !goalType"
              :object-item="item"
              :edit-mode="false"
              :is-deviation="true"
              :add-time-picker="objectField.indexOf('goal-type') > -1"
              @changeTime="changeStartTime"
              @changeDate="changeStartDate"
              :addTimePicker="true"
            />

            <!-- Deadline -->
            <Deadline
              v-if="!checkSuperAdmin && !checkResource && (objectField.indexOf('deadline') > -1) && !goalType"
              :object-item="item"
              :edit-mode="false"
              :is-deviation="true"
              :add-time-picker="objectField.indexOf('goal-type') > -1"
              :change-custom="changeDeadlineCustom"
              :changeTimeCustom="changeTimeCustom"
              :addTimePicker="true"
            />


            <!-- Deadline + Recurring -->
            <DeadlineRecurring
              v-if="!checkSuperAdmin && !checkResource && (objectField.indexOf('deadline-recurring') > -1) && !goalType"
              :object-item="item"
              :edit-mode="false"
              :change-custom="changeDeadlineCustom"
            />

            <!-- GOAL - SubGoal -->
            <SubGoal
              v-if="objectField.indexOf('sub-goal') > -1 && goalType"
              :list-array-input="item.subGoal"
              :predefined-link-array="predefinedLinkArray"
              :resource="checkResource"
              @updateSubGoal="updateSubGoal"
            />

            <!-- INSTRUCTION - Activity -->
            <Instruction
              v-if="objectField.indexOf('activity') > -1"
              :object-item="item"
              :predefined-link-array="predefinedLinkArray"
              :edit-mode="objectField.indexOf('apply-instruction') > -1"
              :resource="checkResource"
              @updateInstructionActivity="updateInstructionActivity"
            />

            <!-- RISK ELEMENT - image -->
            <div v-if="objectField.indexOf('image') > -1">
              <b-row v-if="!addImage">
                <b-col cols="2">
                  <div class="bold-title md-line-height">
                    {{ $t('form.image') }}
                  </div>
                </b-col>
                <b-col cols="4">
                  <div class="switch-component">
                    <label class="left-text">{{ $t('form.none') }}</label>
                    <v-switch
                      v-model="addImage"
                      :label="$t('form.activate')"
                      class="right-text"
                      inset
                      @change="changeSwitchAttachment(addImage)"
                    />
                  </div>
                </b-col>
              </b-row>
              <div v-else class="section-connect-to mt-8">
                <div class="section-connect-to-label section-connect-to-label-reminder">
                  {{ $t('form.image') }}
                </div>
                <div class="switch-component switch-component-small">
                  <label class="left-text">{{ $t('form.none') }}</label>
                  <v-switch
                    v-model="addImage"
                    :label="$t('form.activate')"
                    inset
                    class="right-text"
                    @change="changeSwitchAttachment(addImage)"
                  />
                </div>
                <div class="required-upload-attachment p-4">
                  <div class="upload-field text-center p-2">
                    <div v-if="previewUrl">
                      <img class="image-field" v-bind:src="previewUrl" alt="image">
                      <v-file-input
                        v-model="item.image"
                        accept="image/png, image/jpeg, image/jpg, image/gif, image/svg"
                        :rules="required"
                        @change="previewImage"
                      />
                    </div>
                    <div v-else class="icon-upload-attachment">
                      <v-file-input
                        v-model="item.image"
                        accept="image/png, image/jpeg, image/jpg, image/gif, image/svg"
                        :rules="required"
                        @change="previewImage"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions class="popup-footer">
          <!-- <div v-if="objectField.indexOf('no-index') <= -1" class="switch-component question-mark-block">
            <label class="left-text">{{ $t('button.index') }}</label>
            <v-switch
              v-model="item.is_suggestion"
              :disabled="!checkAdmin"
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
            class="btn-save"
            @click="save(item)"
          >
            {{ $t('button.save') }}
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
  import FroalaSuggestionListEditor from "./FroalaSuggestionListEditor";
  import Security from "./Security";
  import Responsible from "./Responsible";
  import Attendee from "./Attendee";
  import StartDate from "./StartDate";
  import Deadline from "./Deadline";
  import DeadlineRecurring from "./DeadlineRecurring";
  import SubGoal from "./SubGoal";
  import MultipleSelection from "./MultipleSelection";
  import InstructionActivity from "./InstructionActivity";
  import RiskAnalysisFilterRiskElement from "./RiskAnalysisFilterRiskElement";
  import AddNewSourceOfDanger from "./AddNewSourceOfDanger";
  import RiskAnalysisImportInformation from "./RiskAnalysisImportInformation";
  import ConnectToObject from "@/components/ConnectToObject";

  export default {
    name: "AddNewPopup",
    components: {
      Category,
      FroalaSuggestionListEditor,
      Security,
      Responsible,
      Attendee,
      StartDate,
      Deadline,
      DeadlineRecurring,
      SubGoal,
      MultipleSelection,
      Instruction: InstructionActivity,
      RiskAnalysis: RiskAnalysisFilterRiskElement,
      SourceOfDanger: AddNewSourceOfDanger,
      RiskAnalysisImportInformation,
      ConnectToObject
    },
    props: {
      openPopup: Boolean,
      formTitle: {
        type: String,
        required: true,
      },
      objectField: {
        type: Array,
        required: true,
      },
      objectItem: {
        type: Object,
        required: true,
      },
      industryArray: {
        type: Array,
        required: false,
      },
      categoriesArray: {
        type: Array,
        required: true,
      },
      categoriesType: {
        type: String,
        required: true,
      },
      predefinedLinkArray: {
        type: Array,
        required: false,
      },
      resource: {
        type: Boolean,
        required: false,
      },
      isRiskAnalysis:{
        type: Boolean,
        required: false,
      }
    },
    data: () => ({
      checkAdmin: cookies.get('checkAdmin'),
      checkSuperAdmin: cookies.get('checkSuperAdmin'),
      planAccess: JSON.parse(localStorage.getItem('planAccess')),
      userID: parseInt(cookies.get('userID')),
      roleUser: cookies.get('roleUser'),
      valid: true,
      hoverSubGoalPlanAccess:false,
      item: {},
      required: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else return true;
        }
      ],
      formDirty: false,
      // start date / deadline
      changeDeadlineCustom: false,
      // category
      categoriesValidArray: [],
      // goal
      goalType: false,
      // resource
      checkResource: false,
      // question mark description
      hoverQuestionMark: false,
      // risk element image
      addImage: false,
      previewUrl: null,
      // hover
      hoverShowInRiskAnalysis: false,
      changeTimeCustom:false,
    }),

    watch: {
      openPopup(value) {
        if (value) {
          this.categoriesValidArray = _.filter(this.categoriesArray, function (item) {
            return item.is_valid;
          });
          this.addNew();
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
      if (this.resource) {
        this.checkResource = this.resource;
      }
    },

    methods: {
      redirectUrl(){
        if (this.roleUser == 'company admin') {
              this.$router.push('/settings/billings/');
          }
      },
      getConnectToArray(value) {
        this.item.connectToArray = value;
      },

      addNew() {
        this.reset();
        this.item = Object.assign({}, this.objectItem);
        this.goalType = false;
        let defaultCategory = _.findWhere(this.categoriesValidArray, {is_priority: 1});
        if (defaultCategory) {
          this.item.category_id = defaultCategory.id;
        }
        this.item.is_template = !!this.checkResource;
      },

      getSelectedIndustryItems(value) {
        this.item.industry = value.selectedItemsOutput;
      },

      getNewCategory(value) {
        this.item.category_id = value.newCategoryId;
      },

      changeSecurity(val) {
        if (val !== 'all') {
          this.item.is_suggestion = false;
        }
      },

      changeStartDate(val) {
        this.changeDeadlineCustom = !!val.changed;
      },

      updateSubGoal(val) {
        this.item.subGoal = val.list;
      },

      updateInstructionActivity(val) {
        this.item.activities = val.list;
      },

      updateRiskElement(val) {
        this.item.risk_element_array = val.list;
      },

      updateSourceOfDanger(val) {
        this.item.source_of_danger = val.list;
      },

      processSourceOfDanger(val) {
        this.item.chosen_source_list = val.chosenList;
        this.item.source_of_danger = val.sourceList;
      },
      changeStartTime(val){
        this.changeTimeCustom = !!val.changed;
      },

      // updateActivity(val) {
      //   this.item.activities = val.list;
      // },

      // checkDirtyBeforeClose() {
      //   if (this.checkDirtyForm()) {
      //     this.dialogConfirmClose = true;
      //   } else {
      //     this.close();
      //   }
      // },

      // checkDirtyForm() {
      //   let that = this;
      //   let result = false;
      //   _.each(that.item, function (value, key, obj) {
      //     if (that.originData && obj[key] && that.originData[key] && obj[key] !== that.originData[key]) {
      //       result = true;
      //     }
      //   });
      //   return result;
      // },

      close() {
        this.reset();
        this.item.connectToArray = [];
        this.$emit('closePopup');
      },

      reset() {
        this.addImage = false;
        this.previewUrl = null;
        this.$nuxt.$loading.finish();
        setTimeout(() => {
          this.item = Object.assign({}, this.objectItem);
          // this.$refs.form.reset();
          this.$refs.form.resetValidation();
        }, 300);
      },

      save(value) {
        if(this.roleUser=="user"){
          value["attendee_employee_array"]=[this.userID];
        }
        if (this.$refs.form.validate()) {
          let sod=value?.source_of_danger.filter((el) => el.name != '');
          if(sod?.length==0){
            this.$toaster.error('Name of source of danger is required!');
            return;
          }
          this.$emit('savePopup', {
            item: value,
          });
        }
      },

      // risk element image
      previewImage(file) {
        if (file) {
          this.previewUrl = URL.createObjectURL(file);
          this.item.image = file;
        } else {
          this.previewUrl = null;
          this.item.image = [];
        }
      },

      changeSwitchAttachment(val) {
        if (!val) {
          this.previewUrl = null;
          this.item.image = [];
        }
      },
    },
  };
</script>

<style scoped>

</style>

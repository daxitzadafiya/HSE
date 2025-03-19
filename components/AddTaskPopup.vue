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
            <!-- Name & Type of goal/ document -->
            <b-row v-if="objectField.indexOf('name') > -1">
              <b-col :cols="(objectField.indexOf('goal-type') > -1) ? '6' : '12'">
                <div class="input-wrap">
                  <v-text-field
                    v-model="objectItem.name"
                    :label="$t('form.name')"
                    :rules="required"
                    outlined
                  />
                </div>
              </b-col>
              <b-col v-if="objectField.indexOf('goal-type') > -1" cols="2">
                <div class="bold-title md-line-height text-center">
                  {{$t('form.type')}}
                </div>
              </b-col>
              <b-col v-if="objectField.indexOf('goal-type') > -1" cols="4">
                <div class="input-wrap">
                  <div class="switch-component">
                    <label class="left-text">{{ $t('form.goal') }}</label>
                    <v-switch
                      v-model="goalType"
                      :label="$t('form.sub_goal')"
                      class="right-text"
                      inset
                    />
                  </div>
                </div>
              </b-col>
            </b-row>

            <!-- SUPER ADMIN - Industry -->
            <b-row v-if="checkSuperAdmin && objectField.indexOf('industry') > -1">
              <b-col cols="12">
                <div class="input-wrap industry-select-input-wrap">
                  <MultipleSelection
                    :item="objectItem"
                    :selected-items-input="objectItem.industry"
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
              :category-item="objectItem"
              :categories-array="taskCategoriesArray"
              :type-category="categoriesType"
              :is-open-popup="openPopup"
              @getNewCategory="getNewCategory"
            />

            <!-- Description -->
            <b-row v-if="objectField.indexOf('description') > -1" class="section-description">
              <b-col>
                <div class="input-wrap form-description">
                  <FroalaSuggestionListEditor
                    :item="objectItem"
                    :predefined-link-array="predefinedLinkArray"
                  />
                </div>
              </b-col>
            </b-row>

            <InformationRiskAnalysis v-if="!isDeviation && !process_Ontask" :infoPopup="infoPopup" :riskItemTitle="riskItemTitle" :riskElementAnalysis="riskElementAnalysis"/>
            <InformationDeviation v-else-if="!process_Ontask"/>
             <RiskAnalysisImportInformation
             v-if="!isDeviation"
              :object-item="objectItem"
              @processSourceOfDanger="processSourceOfDanger"
            />
              <div v-if="process_Ontask" >
               <v-data-table v-for="item in taskSelectedTopic" :key="item.id" 
                :headers="headers"
                :items="taskSelectedTopic"
                :items-per-page="5"
                :single-expand="true"
                :sort-by="['created_at']"
                :sort-desc="[true, false]"
                class="elevation-1 review-table review-popup-table px-1 border topic-table my-4"
                hide-default-footer
              >
                <template slot="top">
                  <v-toolbar flat class="align-center">
                    <v-toolbar-title>
                      {{$t('title.topic_table_title') +  item.topic_name }}
                    </v-toolbar-title>
                  </v-toolbar>
                </template>
                <template v-slot:item.checkName="{ item }">
                  {{item.name}}
                </template>
                <template v-slot:item.comment="{ item,index }">
                    <div>
                      <img src="../assets/images/gridIcon/comment_fill_red.png" alt="" srcset="" v-if="item.description"> 
                      <img src="../assets/images/gridIcon/comment.png" alt="" srcset="" v-else>
                    </div>
                </template>
                <template v-slot:item.image="{ item, index }">
                  <img
                    src="../assets/images/icon/image-red.png"
                    @click.stop
                    v-if="item.file"
                  />
                  <img v-else
                    src="../assets/images/icon/image-gray.png"
                    @click.stop
                    />
                </template>
                <template v-slot:item.options="{ item }">
                  {{item.answer_name}}
                </template>
              </v-data-table>
                    </div>


            <!-- Responsible -->
            <Responsible
              v-if="!checkSuperAdmin && !checkResource && objectField.indexOf('responsible') > -1"
              :object-item="objectItem"
              :edit-mode="false"
              :newRequire="true"
            />

            <!-- Attendee -->
            <Attendee
              v-if="!checkSuperAdmin && !checkResource && (objectField.indexOf('attendee') > -1) && !goalType"
              :object-item="objectItem"
              :edit-mode="false"
              :newRequire="true"
            />

            <!-- Start date -->
            <StartDate
              v-if="!checkSuperAdmin && !checkResource && (objectField.indexOf('start-date') > -1) && !goalType"
              :object-item="objectItem"
              :edit-mode="false"
              :is-deviation="true"
              @changeDate="changeStartDate"
              @changeTime="changeStartTime"
              :addTimePicker="true"
            />

            <!-- Deadline -->
            <Deadline
              v-if="!checkSuperAdmin && !checkResource && (objectField.indexOf('deadline') > -1) && !goalType"
              :object-item="objectItem"
              :edit-mode="false"
              :is-deviation="true"
              :change-custom="changeDeadlineCustom"
              :changeTimeCustom="changeTimeCustom"
              :addTimePicker="true"
            />
             <!-- Security -->
             <Security
              v-if="!checkSuperAdmin && !checkResource && objectField.indexOf('security') > -1 && !process_Ontask"
              :security-item="objectItem"
              :edit-mode="false"
              @changeSecurity="changeSecurity"
              class="task-security"
            />

          </v-form>
        </v-card-text>
        <v-card-actions class="popup-footer">
          <!-- <div class="input-wrap switch-component question-mark-block">
            <label class="left-text">{{ $t('button.index') }}</label>
            <v-switch
              v-model="objectItem.is_suggestion"
              :disabled="!checkAdmin || !objectItem.is_public"
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
            @click="save(objectItem)"
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
  import MultipleSelection from "./MultipleSelection";
  // import InformationRiskAnalysis from "./InformationRiskAnalysis"
  import InformationDeviation from "./InformationDeviation"
import RiskAnalysisImportInformation from './RiskAnalysisImportInformation.vue';

  export default {
    name: "AddTaskPopup",
    components: {
      Category,
      FroalaSuggestionListEditor,
      Security,
      Responsible,
      Attendee,
      StartDate,
      Deadline,
      MultipleSelection,
      // InformationRiskAnalysis,
      InformationDeviation,
        RiskAnalysisImportInformation,
    },
    props: {
      openPopup: Boolean,
      riskElementAnalysis:{
      type: Array,
      required: false,
    },
    currentTaskId: {
        type: [String,Number],
        required: false,
      },
      infoPopup:{
        type:Boolean,
        required: false,
      },
      riskItemTitle:{
        type:String,
        required: false,
      },
      formTitle: {
        type: String,
        required: true,
      },
      taskCategoriesArray:{
        type: Array,
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
        required: false,
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
      isDeviation:{
        type:Boolean,
        required:false,
      },
      process_Ontask:{
        type:Boolean,
        required:false,
      },
      taskSelectedTopic: {
        type: Array,
        required: false,
      },
      answerArray: {
        type: Array,
        required: false,
      },
    },
    data: () => ({
      checkAdmin: cookies.get('checkAdmin'),
      checkSuperAdmin: cookies.get('checkSuperAdmin'),
      valid: true,
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
      changeTimeCustom:false,
      // category
      categoriesValidArray: [],
      // goal
      goalType: false,
      // resource
      checkResource: false,
      // question mark description
      hoverQuestionMark: false,
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
    computed: {
        headers() {
      return [
        {
          text: 'Name',
          align: 'start',
          sortable: false,
          value: 'name',
        width:'25%'
        },
        { text: 'Result', value: 'options', align: 'center',width:'25%' },
        { text: 'Comment', value: 'comment', align: 'center' , width:'30%'},
        { text: 'Image', value: 'image', align: 'center' },
      ]
    },
      },

    created() {
      if (this.resource) {
        this.checkResource = this.resource;
      }
    },

    methods: {
      addNew() {
        this.reset();
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
      changeStartTime(val){
        this.changeTimeCustom = !!val.changed;
      },

      updateSubGoal(val) {
        this.item.subGoal = val.list;
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
        this.$emit('closePopup',this.currentTaskId);
      },

      reset() {
        this.$nuxt.$loading.finish();
        setTimeout(() => {
          this.item = Object.assign({}, this.objectItem);
          // this.$refs.form.reset();
          this.$refs.form.resetValidation();
        }, 300);
      },
      processSourceOfDanger(val) {
        this.item.chosen_source_list = val.chosenList;
        this.item.source_of_danger = val.sourceList;
      },

      save(value) {
        if (this.$refs.form.validate()) {
          this.$emit('savePopup', {
            item: value,
          });
        }
      },
    },
  };
</script>

<style scoped>
:deep(.task-security .section-connect-to.mt-5){
  margin-top: 40px !important;
}
:deep(.topic-table .v-data-table-header){
  background-color: #84A13D;
}
:deep(.topic-table .v-data-table-header tr th span){
  color: #fff;
  font-weight: 500;
}
</style>

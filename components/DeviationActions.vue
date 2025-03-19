<template>
  <div>
    <v-form ref="form" lazy-validation>
      <div v-if="deviationAction == 3" class="mt-10">
        <Responsible
          :object-item="item"
          :edit-mode="false"
          class="mb-6"
          :newRequire="true"
          :noRequiredAction="true"
          :mainAction="$t('form.required_action')"
          :subActionFirst="$t('form.comment')"
          :subActionSecond="$t('form.image')"
        />

        <!-- Attendee -->
        <Attendee
          :object-item="item"
          :edit-mode="false"
          class="mb-6"
          :mainAction="$t('form.required_action')"
          :subActionFirst="$t('form.comment')"
          :subActionSecond="$t('form.image')"
          :newRequire="true"
        />

        <!-- Start date -->
        <StartDate
          :object-item="item"
          :edit-mode="false"
          @changeDate="changeStartDate"
          @changeTime="changeStartTime"
          :addTimePicker="true"
          class="mb-6"
        />
        <!-- Deadline -->
        <Deadline
          :object-item="item"
          :edit-mode="false"
          :change-custom="changeDeadlineCustom"
          :addTimePicker="true"
          class="mb-6 deadline"
        />
      </div>

      <div v-if="deviationAction == 1 || deviationAction == 2">
        <Responsible
          :object-item="item"
          :edit-mode="false"
          :isInstruction="true"
          v-if="deviationAction == 2"
          :noRequiredAction="true"
          :is_custom_responsible="is_custom_responsible"
          class="mt-4"
        />
        <!-- <add-sourceof-danger-table 
      :source_title="false" 
      :riskElementAnalysis="riskElementAnalysis" 
      :headersRiskElementArr="headersRiskElementArr" 
      :editAsResponsible="deviationAction == 2" 
      :dataFillable="(deviationAction == 1) ? true : (deviationAction != 1 && deviationAction == 2 ? false : false)"
      /> -->
        <add-new-source-of-danger
          :object-item="item"
          :edit-mode="false"
          :is-process-activate="deviationAction == 2"
          @updateSourceOfDanger="updateSourceOfDanger"
        />
        <Security
          :security-item="item"
          :edit-mode="editMode"
          :isInstructionObject="true"
          @changeSecurity="changeSecurity"
          class="view-action mt-10"
        />
        <b-row v-if="deviationAction != 2">
          <b-col cols="2" class="hse-document-badge-tab">
            <div class="bold-title md-line-height">
              {{ $t('form.process') }}
            </div>
          </b-col>
          <b-col cols="2">
            <div class="input-wrap">
              <div class="switch-component">
                <label class="left-text">{{ $t('form.none') }}</label>
                <!-- v-model="is_task" -->
                <v-switch
                v-model="is_process"
                  @click="is_task_open(is_process)"
                  :label="$t('form.task')"
                  class="right-text"
                  inset
                />
              </div>
            </div>
            <!-- <AddTaskPopup
              :open-popup="is_task"
              :form-title="$t('title.add_new_task')"
              :object-field="objectField"
              :objectItem="taskItem"
              :taskCategoriesArray="categoriesArray"
              :predefinedLinkArray="predefinedLinkArray"
              :categories-type="'task'"
              :infoPopup="true"
              :riskItemTitle="$t('title.import_information_from_deviation')"
              @closePopup="is_task = !is_task"
              @savePopup="AddTask"
            /> -->

            <AddNewPopup
              :open-popup="is_task"
              :form-title="$t('title.add_new_task')"
              :object-field="objectField"
              :object-item="taskItem"
              :categories-array="categoriesArray"
              :categories-type="'deviation'"
              @closePopup="is_task = !is_task, is_process = false"
              @savePopup="AddTask"
            />
            
          </b-col>
        </b-row>
      </div>
    </v-form>
  </div>
</template>

<script>
import Responsible from './Responsible'
import Attendee from './Attendee'
import StartDate from './StartDate'
import Deadline from './Deadline'
import Security from './Security'
// import AddTaskPopup from './AddTaskPopup'
import { _ } from 'vue-underscore'
// import AddSourceofDangerTable from './AddSourceofDangerTable.vue'
import AddNewSourceOfDanger from './AddNewSourceOfDanger.vue'
import AddNewPopup from './AddNewPopup.vue'

export default {
  name: 'DeviationActions',
  components: {
    Responsible,
    Attendee,
    StartDate,
    Deadline,
    Security,
    // AddTaskPopup,
    // AddSourceofDangerTable,
    AddNewSourceOfDanger,
    AddNewPopup
  },
  props: {
   
     isRequired: {
      type: Boolean,
      required: false,
    },
    item: {
      type: [Object, Array],
      required: false,
    },
    predefinedLinkArray: {
      type: Array,
      required: false,
    },
    categoriesArray: {
      type: Array,
      required: false,
    },
    deviationAction: {
      type: Number,
      required: false,
    },
    riskItem: {
      type: Array,
      required: false,
    },
    riskElementAnalysis: {
      type: Array,
      required: false,
    },
    is_custom_responsible: {
      type: Boolean,
      required: false,
    },
    // valid: {
    //   type: Boolean,
    //   required: false,
    //   default: true,
    // },
  },
  data() {
    return {
      editAsResponsible: false,
      is_task: false,
      is_process:false,
      // valid: true,
      objectField: [
        'name',
        'description',
        'category',
        'responsible',
        'attendee',
        'start-date',
        'deadline',
      ],
      // editedItem:{
      //   source_of_danger:[{
      //     name: '',
      //   type: 'Report',
      //   probability: '',
      //   consequence: '',
      //   colorCode: '',
      //   comment: '',
      //   need_to_process:false
      //   }],
      // },
      taskItem: {
        responsible_department_array: [],
        responsible_employee_array: [],
        attendee_department_array: [],
        attendee_employee_array: [],
        attendee_all: false,
        start_date: '',
        start_time: '',
        deadline: '',
        end_time: '',
        attendee_required_attachment: false,
        attendee_required_comment: false,
        responsible_required_attachment: false,
        responsible_required_comment: false,
        isDefaultAttendee: false,
        isDefaultResponsible: false,
        is_template: false,
        is_suggestion: false,
        is_valid: true,
        name: '',
        description: '',
        category_id: '',
        object_id: '',
        start_date_pre: '',
        deadline_pre: '',
        start_time_pre: '',
        status: 1,
        type:'task',
      responsible_id: '',
      added_by: '',
      source: 'risk',
      happened_before: '',
      corrective_action: '',
      specifications: '',
      action: 'task',
      is_public: false,
      is_shared: false,
      company_id: '',
      department_id: '',
      job_title_id: '',
      industry_id: '',
      end_time_pre: '',
      recurring: '',
      nearest_manager:false,


        source_of_danger: [
          {
            added_by: 2,
            comment: '',
            company_id: '',
            consequence: '',
            created_at: '',
            id: '',
            name: '',
            need_to_process: false,
            object_id: '',
            probability: '',
            risk_level: '',
            updated_at: '',
            visible_to_others: 0,
          },
        ],
      },
      source_of_danger: [],
      editMode: true,
      changeDeadlineCustom: false,
      required: [
        (v) => {
          if (!v || v.length < 1) return 'This is required'
          else return true
        },
      ],
      riskId: '',
      probabilityArr: [
        {
          value: '1',
          name: 'Low',
        },
        {
          value: '2',
          name: 'Moderate',
        },
        {
          value: '3',
          name: 'High',
        },
        {
          value: '4',
          name: 'Very high',
        },
      ],
      consequenceArr: [
        {
          value: '1',
          name: 'Low',
        },
        {
          value: '2',
          name: 'Moderate',
        },
        {
          value: '3',
          name: 'High',
        },
        {
          value: '4',
          name: 'Very high',
        },
      ],
      colorCodeArr: [
        {
          min: 0,
          max: 0,
          value: 'black',
          name: 'None',
        },
        {
          min: 1,
          max: 3,
          value: 'green',
          name: 'Green',
        },
        {
          min: 4,
          max: 10,
          value: '#f0e509',
          name: 'Yellow',
        },
        {
          min: 11,
          max: 15,
          value: 'orange',
          name: 'Orange',
        },
        {
          min: 16,
          max: 16,
          value: 'red',
          name: 'Red',
        },
      ],
    }
  },
  created() {
    this.taskItem.name = this.item.subject
    this.taskItem.category_id = this.item.category_id
    this.taskItem.description = this.item.description
    this.item.source_of_danger[0].name = this.item.subject
  },
  computed: {
    headersRiskElementArr() {
      return [
        {
          text: this.translateCol('name'),
          value: 'name',
          align: 'center',
          width: '18%',
        },
        {
          text: this.translateCol('type'),
          value: 'type',
          align: 'center',
          width: '16%',
        },
        {
          text: this.translateCol('probability'),
          value: 'probability',
          align: 'center',
          width: '12%',
        },
        {
          text: this.translateCol('consequence'),
          value: 'consequence',
          align: 'center',
          width: '12%',
        },
        {
          text: this.translateCol('color_code'),
          value: 'colorCode',
          align: 'center',
          width: '10%',
        },
        {
          text: this.translateCol('comment'),
          value: 'comment',
          align: 'center',
          width: '20%',
        },
      ]
    },
  },
  methods: {
    is_task_open(is_process) {
      if (this.$refs.form.validate()) {
        this.$emit('riskUpdated')
        this.taskItem.source_of_danger = this.riskElementAnalysis
        // this.$store
        //   .dispatch('deviations/show', this.item.id)
        //   .then((res) => {
        //     console.log("response-dev",res.data);
        //     this.checkResponsible = _.contains(res.data.role, 'responsible');
        //       this.taskItem.source_of_danger = res.data?.sourceOfDanger
        //       // this.taskItem.source_of_danger[0].name = this.item.subject

        //   })
        this.is_process = is_process
        this.is_task = true
      }
    },
    updateSourceOfDanger(val) {
      this.$emit('sourceValue', val)
    },
    AddTask(payload) {
      this.is_task = false
      this.$emit('AsOnTask', payload)
      // this.taskItem.start_date=payload.start_date_pre
      // this.taskItem.deadline=payload.deadline_pre
      // this.taskItem.object_id=this.item.object_id
      // this.taskItem.type="task"
      // this.taskItem.source="deviation"
      // this.$store.dispatch('objects/store', this.taskItem).then(result =>  {
      //   this.taskItem = Object.assign({}, result);
      //   this.$toaster.success(this.$i18n.t('message.success_task_add_new'));
      //   this.$nuxt.$loading.finish();
      // }).catch(() => {
      //    this.$toaster.error(this.$i18n.t('message.fail_task_add_new'));
      //   // this.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
      //   this.$nuxt.$loading.finish();
      // });
    },
    changeSecurity(val) {
      if (val !== 'all') {
        this.item.is_suggestion = false
      }
    },
    changeStartDate(val) {
      this.changeDeadlineCustom = !!val.changed
    },
    changeStartTime(val) {
      this.changeDeadlineTimeCustom = !!val.changed
    },
    translateCol(colName) {
      return this.$i18n.t('column.' + colName)
    },

    updateColorCode(riskElement) {
      var that = this
      if (riskElement.probability && riskElement.consequence) {
        var point = riskElement.probability * riskElement.consequence
        _.each(that.colorCodeArr, function (item) {
          if (point >= item.min && point <= item.max) {
            riskElement.colorCode = item.value
            riskElement.colorName = item.name
            riskElement.point = point
          }
        })
      }
    },
  },
}
</script>

<style scoped>
:deep(.deadline .switch-component.switch-component-small) {
  padding-left: 95px;
}
:deep(.view-action .hse-document-badge-tab .hse-badge-icon) {
  left: 58px !important;
  top: 20px !important;
}
</style>
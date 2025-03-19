<template>
  <div>
    <b-row v-if="!objectItem.is_activated">
      <b-col cols="2">
        <div class="bold-title md-line-height">
          {{ $t('form.activation') }}
        </div>
      </b-col>
      <b-col cols="4">
        <div class="input-wrap">
          <div class="switch-component default-question-mark">
            <label class="left-text">{{ $t('form.today') }}</label>
            <v-switch
              v-model="objectItem.is_activated"
              :label="$t('form.custom')"
              inset
              class="right-text"
            />
          </div>
        </div>
      </b-col>
    </b-row>
    <div v-else class="section-connect-to mt-10">
      <div class="section-connect-to-label section-connect-to-label-reminder">
        {{ $t('form.activation') }}
      </div>
      <div class="switch-component switch-component-small default-question-mark">
        <label class="left-text">{{ $t('form.today') }}</label>
        <v-switch
          v-model="objectItem.is_activated"
          :label="$t('form.custom')"
          inset
          class="right-text"
        />
      </div>
      <b-row class="mt-3">
        <b-col cols="7">
        <activate-date 
        :object-item="objectItem"
          :edit-mode="false"
          @changeDate="changeStartDate"
          :addTimePicker="true"
          class="mb-6"
        />
        
        
        </b-col>
        <!-- <v-col cols="2">
          <new-time-picker
            :label="$t('form.time')"
            :item="editedItem"
            :time-input="editedItem.start_time"
            @getTime="getStartTime"
          />
        </v-col> -->
        <v-col cols="5">
          <!-- <v-select
            v-model="selectedUnit"
            :items="units"
            item-text="units"
            item-value="name"
            :label="$t('form.frequency')"
            class="select-box text-capitalize"
            outlined
          /> -->

          <v-select
            v-model="durationData.unit"
            :items="units"
            item-text="units"
            item-value="name"
            :label="$t('form.frequency')"
            class="select-box text-capitalize"
            :rules="required"
            outlined
            @change="(e)=> changeFreqency(e)"
          />
          <!-- <v-select v-model="durationData.unit" :items="units"   :label="$t('form.frequency')" class="select-box" dense outlined></v-select> -->

        </v-col>
      </b-row>
      <div class="d-flex">
        <div class="col-6 p-0">
          <duration
            :object-item="objectItem"
            :duration-data="durationData"
            class="col-12"
            :isDisabledDay="isDisabledDay"
          />
        </div>
        <b-col cols="5" class="ms-auto datepicker-activate ps-6 section-required-action">
        <deactivate
          :object-item="objectItem"
          :edit-mode="false"
          :changeCustom="changeDeadlineCustom"
          :addTimePicker="false"
          class="mb-6 deadline"
          :deactivate="true"
          :frequencyUnit="frequencyUnit"
        />
        </b-col>
      </div>
    </div>
  </div>
</template>
<script>
  import cookies from "js-cookie";
  // import DatePickerNew from "./DatePickerNew";
  import Duration from './Duration.vue';
  // import TimePicker from './TimePicker.vue';
// import NewTimePicker from './NewTimePicker.vue';
// import Deadline from './Deadline.vue';
import Deactivate from './Deactivate.vue';
import ActivateDate from './ActivateDate.vue';


  export default {
    name: "Activation",
    components: {
      // DatePickerNew,
      Duration,
      // TimePicker,
        // NewTimePicker,
        // Deadline,
        Deactivate,
        ActivateDate
    },
    props: {
      objectItem: {
        type: Object,
        required: true,
      },
      editMode: {
        type: Boolean,
        required: false,
      },
      recurringArray: {
        type: [Object, Array],
        required: false
      },
       unitValue: {
      type: String,
      required: true,
    },
    durationData: {
        type: Object,
        required: false,
      },
      units:{
        type: [Object, Array],
        required: false
      }
    },
    data: () => ({
      checkAdmin: cookies.get('checkAdmin'),
      roleUser: cookies.get('roleUser'),
      permissionsUser: localStorage.getItem('permissionsKey'),
      userLogged: parseInt(cookies.get('userID')),
      start_date: '',
      deadline:'',
      checkCreator: false,
      changeDeadlineCustom:false,
      editedItem: {},
      unsetStringValue: 'hh:mm A',
      activate: false,
      hoverQuestionMark: false,
      isDeactivate: false,
      required: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else return true;
        }
      ],
      isDisabledDay:false,
      time: null,
      menu2: false,
      modal2: false,
      frequencyUnit: ""
      // durationData: {
      //           is_duration:false,
      //           duration: 1,
      //           unit: '',
      //       },
            // units: ['daily', 'weekly', 'monthly', 'yearly','quarter'],
            // maxDurations: {
            //     daily: 365,
            //     week: 7,
            //     month: 31,
            //     year: 365,
            //     quarter:92,
            // },
            // maxWeeklyDurations:{
            //     daily: '',
            //     week: 1,
            //     month: 5,
            //     year: 53,
            //     quarter:14,
            // }
    }),

    watch: {
      // objectItem(value) {
      //   if (value) {
      //     if (this.editMode) {
      //       this.checkCreator = this.objectItem.added_by === this.userLogged;
      //       this.editItem(this.objectItem);
      //     } else {
      //       this.checkCreator = true;
      //       this.addNew();
      //     }
      //   }
      // },
    },

    mounted() {
    },

    computed: {
      selectedUnit: {
        get() {
          return this.unitValue;
        },
        set(newValue) {
          this.$emit('input', newValue);
        },
      },
    },


    methods: {
      changeFreqency(value){
        this.frequencyUnit=value;
        console.log("units",value);
        if (value == 'daily' || value == 'Daily') {
          this.isDisabledDay = true
          this.durationData.is_duration = false
        }
        // else if(value == 'weekly' || value == 'Weekly'){
        //   this.isDisabledDay = true
        //   this.durationData.is_duration = true
        // }
        else{
          this.isDisabledDay = false
          this.durationData.is_duration = false
        }
      },
      getStartTime(value) {
      this.start_time = value.time;
      if (this.editMode) {
        this.editedItem.start_time_pre = this.start_time;
      } else {
        this.objectItem.start_time_pre = this.start_time;
      }
      if (this.indexSubGoal >= 0) {
        this.$emit('changeTime', {
          index: this.indexSubGoal,
          changed: !!value.changeTime,
        });
      } else {
        this.$emit('changeTime', {
          changed: !!value.changeTime,
        });
      }
    },
     changeStartDate(val) {
      this.changeDeadlineCustom = !!val.changed
    },
    }
  };
</script>
<style scoped>
  .default-question-mark {
    max-width: 50px;
  }

  .count-plus {
    background-color: #87a53a !important;
  }

  .count-minus {
    background-color: #666768 !important;
  }

  .quantity {
    text-align: center;
    width: 30px;
    color: #9A9A9B;
  }

  .counter-btns button {
    width: 24px;
    height: 24px;
  }

  .switch-responsible-custom-small {
    padding-left: 60px;
  }

  .datepicker-activate .section-connect-to {
    margin: 30px 0px !important;
  }

  .hse-badge-icon.deactivate-badge {
    top: 8px;
  }



  :deep(.activation-date-picker .v-text-field__slot label) {
    display: none !important;
  }

  :deep(.activation-date-picker .v-input__control .v-text-field__details) {
    display: none !important;
  }

  :deep(.activation-date-picker .v-input__slot fieldset) {
    border: none !important;
  }

  :deep(.activation-date-picker .v-input__slot) {
    margin-bottom: 0px !important;
  }
:deep(.deadline .row .col-2){
  max-width: 34% !important;
}
</style>

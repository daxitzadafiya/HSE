<template>
  <div>
    <b-row>
      <b-col :cols="isHide ? 12 : 7" >
        <DatePickerNew
          :label="$t('form.deadline')"
          :item="objectItem"
          :object-item="item"
          :date-input="objectItem.deadline"
          :past-date="false"
          :future-date="true"
          :is-deadline="true"
          @getDate="getDeadline"
          :extend-date="extendDate"
        />
      </b-col>
      <b-col cols="5" v-if="!isHide">
        <NewTimePicker
          :label="$t('form.time')"
          :item="item"
          :startToday="startToday"
          :time-input="objectItem.end_time"
          @getTime="getTimeDeadline"
          :extend-time="extendTime"
        />
      </b-col>
    </b-row>
  </div>
</template>
<script>
  import cookies from "js-cookie";
  import moment from 'moment';
  import DatePickerNew from "./DatePickerNew";
  import NewTimePicker from './NewTimePicker.vue';

  export default {
    name: "DeadlineEdit",
    components: {
      DatePickerNew,
      NewTimePicker,
    },
    props: {
      objectItem: {
        type: Object,
        required: true,
      },
      changeCustom: {
        type: Boolean,
        required: false,
      },
      item:{
        type: Object,
        required: false,
      },
      extendDate: {
        type: Boolean,
        default: false,
        required: false,
      },
      extendTime: {
        type: Boolean,
        default: false,
        required: false,
      },
      isHide:{
        type: Boolean,
        default: false,
        required: false,
      }
    },
    data: () => ({
      checkAdmin: cookies.get('checkAdmin'),
      roleUser: cookies.get('roleUser'),
      permissionsUser: localStorage.getItem('permissionsKey'),
      deadline: '',
      end_time: '',
      startToday :false
    }),

    watch: {
      changeCustom(value) {
        if (value) {
          this.editItem();
        }
      },
    },

    created() {},

    methods: {
      editItem() {
        const [yearStartDate, monthStartDate, dayStartDate] = this.objectItem.start_date_pre.split('-');
        const [yearDeadline, monthDeadline, dayDeadline] = this.objectItem.deadline_pre.split('-');
        if (yearStartDate > yearDeadline || (yearStartDate <= yearDeadline && monthStartDate > monthDeadline) || (yearStartDate <= yearDeadline && monthStartDate <= monthDeadline && dayStartDate > dayDeadline)) {
          this.objectItem.deadline = this.objectItem.deadline_pre = moment(this.objectItem.start_date_pre).add(1, 'days').format('YYYY-MM-DD');
        }
      },

      getDeadline(value) {
        if(this.item.time_info){
          if(this.item.time_info.deadline == value.date)
          {
            this.extendTime= true;
          }
          else{
            this.extendTime= false;
          }
        }
         this.deadline = value.date;
        const today = new Date();
      const todayDateString = today.toISOString().split('T')[0];
        if (this.deadline === todayDateString) {
        this.startToday = true;
      } else {
        this.startToday = false
      }
        this.objectItem.deadline_pre = this.deadline;
        this.$emit('changeDate', {
          changed: !!value.changeDate,
        });
      },

      getTimeDeadline(value) {
        this.end_time = value.time;
        this.objectItem.end_time_pre = this.end_time;
        this.$emit('changeTime', {
          changed: !!value.changeTime,
        });
      },
    }
  };
</script>

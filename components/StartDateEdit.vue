<template>
  <div>
    <b-row>
      <b-col cols="7">
        <DatePickerNew
          :label="$t('form.start_date')"
          :item="objectItem"
          :date-input="objectItem.start_date"
          :use-keyboard="true"
          :past-date="false"
          :future-date="true"
          :is-start-date="true"
          @getDate="getStartDate"
        />
      </b-col>
      <b-col cols="5">
        <NewTimePicker
          :label="$t('form.time')"
          :item="objectItem"
          :startToday="startToday"
          :time-input="objectItem.start_time"
          @getTime="getStartTime"
        />
      </b-col>
    </b-row>
  </div>
</template>
<script>
  import cookies from "js-cookie";
  import DatePickerNew from "./DatePickerNew";
  import NewTimePicker from './NewTimePicker.vue';

  export default {
    name: "StartDateEdit",
    components: {
      DatePickerNew,
      NewTimePicker,
    },
    props: {
      objectItem: {
        type: Object,
        required: true,
      },
    },
    data: () => ({
      checkAdmin: cookies.get('checkAdmin'),
      roleUser: cookies.get('roleUser'),
      permissionsUser: localStorage.getItem('permissionsKey'),
      start_date: '',
      start_time: '',
      startToday: false,
    }),

    watch: {},

    mounted() {},

    created() {},

    methods: {
      getStartDate(value) {
        this.start_date = value.date;
      const today = new Date();
      const todayDateString = today.toISOString().split('T')[0];

      // Compare this.start_date with today's date
      if (this.start_date === todayDateString) {
        this.startToday = true
      } else {
        this.startToday = false
      }
        this.objectItem.start_date_pre = this.start_date;
        this.$emit('changeDate', {
          changed: !!value.changeDate,
        });
      },

      getStartTime(value) {
        this.start_time = value.time;
        this.objectItem.start_time_pre = this.start_time;
        this.$emit('changeTime', {
          changed: !!value.changeTime,
        });
      },
    }
  };
</script>

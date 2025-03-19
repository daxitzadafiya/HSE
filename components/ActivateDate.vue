<template>
  <div>
      <b-row >
        <b-col :cols="addTimePicker ? '8' : '12'">
          <DatePickerNew
            :label="$t('form.activate')"
            :item="editMode ? editedItem : objectItem"
            :date-input="editMode ? editedItem.start_date : objectItem.start_date"
            :use-keyboard="true"
            :past-date="false"
            :future-date="true"
            :is-start-date="true"
            @getDate="getStartDate"
          />
        </b-col>
        <b-col cols="4">
          <!-- <time-picker v-if="addTimePicker" /> -->
          <new-time-picker
            v-if="addTimePicker"
            :label="$t('form.time')"
            :item="editMode ? editedItem : objectItem"
            :time-input="editMode ? editedItem.start_time : objectItem.start_time"
            @getTime="getStartTime"
            :startToday="startToday"
          />
        </b-col>
      </b-row>
    </div>
</template>
<script>
import cookies from 'js-cookie';
import DatePickerNew from './DatePickerNew';
import NewTimePicker from './NewTimePicker.vue';
import moment from 'moment';
// import TimePicker from './TimePicker.vue';

export default {
  name: 'StartDate',
  components: {
    DatePickerNew,
    NewTimePicker,
    // TimePicker
  },
  props: {
    addTimePicker: {
      type: Boolean,
      required: false,
    },
    objectItem: {
      type: Object,
      required: true,
    },
    editMode: {
      type: Boolean,
      required: true,
    },
    indexSubGoal: {
      type: Number,
      required: false,
    },
    withOutSwitch:{
      type: Boolean,
      required: false,
    }
  },
  data: () => ({
    checkAdmin: cookies.get('checkAdmin'),
    roleUser: cookies.get('roleUser'),
    permissionsUser: localStorage.getItem('permissionsKey'),
    userLogged: parseInt(cookies.get('userID')),
    start_date: '',
    start_time: '',
    checkCreator: false,
    is_custom: false,
    editedItem: {},
    startToday:false
  }),

  watch: {
    objectItem(value) {
      if (value) {
        if (this.editMode) {
          this.checkCreator = this.objectItem.added_by === this.userLogged;
          this.editItem(this.objectItem);
        } else {
          this.checkCreator = true;
          this.addNew();
        }
      }
    },
  },

  mounted() {},

  created() {},

  methods: {
    addNew() {
      this.is_custom = false;
    },

    editItem(item) {
      this.editedItem = item;
      this.is_custom = true;
    },

    getStartDate(value) {
      this.start_date = value.date;
      const today = new Date();
      const todayDateString = moment(today.toLocaleString('en-US', { timeZone: (localStorage.getItem("time_zone") || "Europe/Oslo") })).format("YYYY-MM-DD");

      // Compare this.start_date with today's date
      if (this.start_date === todayDateString) {
        this.startToday = true
      } else {
        this.startToday = false
      }
      if (this.editMode) {
        this.editedItem.start_date_pre = this.start_date;
      } else {
        this.objectItem.start_date_pre = this.start_date;
      }
      if (this.indexSubGoal >= 0) {
        this.$emit('changeDate', {
          index: this.indexSubGoal,
          changed: !!value.changeDate,
        });
      } else {
        this.$emit('changeDate', {
          changed: !!value.changeDate,
        });
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
  },
};
</script>
<style scoped>
.default-question-mark {
  max-width: 50px;
}
</style>

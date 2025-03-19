<template>
  <div>
    <b-row v-if="!is_custom">
      <b-col cols="2">
        <div class="bold-title md-line-height">
          {{ $t('form.start_date') }}
        </div>
      </b-col>
      <b-col cols="4">
        <div class="switch-component default-question-mark">
          <label class="left-text">{{ $t('form.today') }}</label>
          <v-switch
            v-model="is_custom"
            :label="$t('form.custom')"
            inset
            class="right-text"
          />
        </div>
      </b-col>
    </b-row>
    <div v-else class="section-connect-to mt-10">
      <div class="section-connect-to-label section-connect-to-label-reminder">
        {{ $t('form.start_date') }}
      </div>
      <div class="switch-component switch-component-small default-question-mark">
        <label class="left-text">{{ $t('form.today') }}</label>
        <v-switch
          v-model="is_custom"
          :label="$t('form.custom')"
          inset
          class="right-text"
        />
      </div>
      <b-row class="mt-3">
        <b-col :cols="addTimePicker ? '8' : '12'">
          <DatePickerNew
            :label="$t('form.start_date')"
            :item="editMode ? editedItem : objectItem"
            :date-input="editMode ? editedItem.start_date : objectItem.start_date"
            :use-keyboard="true"
            :past-date="false"
            :future-date="true"
            :is-start-date="true"
            @getDate="getStartDate"
          />
            <!-- :disable="!checkAdmin && !checkCreator" -->
        </b-col>
        <b-col cols="4">
          <!-- <time-picker v-if="addTimePicker" /> -->
          <new-time-picker
            v-if="addTimePicker"
            :label="$t('form.time')"
            :item="editMode ? editedItem : objectItem"
            :time-input="editMode ? editedItem.start_time : objectItem.start_time"
            :startToday="startToday"
            @getTime="getStartTime"
          />
        </b-col>
      </b-row>
    </div>
  </div>
</template>
<script>
import cookies from 'js-cookie';
import DatePickerNew from './DatePickerNew';
import NewTimePicker from './NewTimePicker.vue';
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
    startToday: false,
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
      console.log("select start_date",value.date);
      const today = new Date();
      const todayDateString = today.toISOString().split('T')[0];

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

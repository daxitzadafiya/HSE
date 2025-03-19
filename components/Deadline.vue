<template>
  <div>
    <b-row v-if="!is_custom">
      <b-col cols="2">
        <div class="bold-title md-line-height">
          {{ $t('form.deadline') }}
        </div>
      </b-col>
      <b-col cols="4">
        <div class="switch-component default-question-mark">
          <label class="left-text">
            {{ editMode ? defaultDeadline(editedItem.start_date_pre) : defaultDeadline(objectItem.start_date_pre) }}
          </label>
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
        {{ $t('form.deadline') }}
      </div>
      <div class="switch-component switch-component-small default-question-mark deadline-switch">
        <label class="left-text">
          {{ editMode ? defaultDeadline(editedItem.start_date_pre) : defaultDeadline(objectItem.start_date_pre) }}
        </label>
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
            :label="$t('form.deadline')"
            :item="editMode ? editedItem : objectItem"
            :date-input="editMode ? editedItem.deadline : objectItem.deadline"
            :past-date="false"
            :future-date="true"
            :is-deadline="true"
            @getDate="getDeadline"
          />
            <!-- :disable="!checkAdmin && !checkCreator" -->
        </b-col>
        <b-col cols="4">
          <!-- <time-picker v-if="addTimePicker" /> -->
          <new-time-picker
            v-if="addTimePicker"
            :label="$t('form.time')"
            :item="editMode ? editedItem : objectItem"
            :time-input="editMode ? editedItem.end_time : objectItem.end_time"
            :startToday="startToday"
            @getTime="getTimeDeadline"
          />
        </b-col>
      </b-row>
    </div>
  </div>
</template>
<script>
  import cookies from "js-cookie";
  import moment from 'moment';
  import DatePickerNew from "./DatePickerNew";
import NewTimePicker from './NewTimePicker.vue';
// import TimePicker from './TimePicker.vue';

  export default {
    name: "Deadline",
    components: {
      DatePickerNew,
        NewTimePicker,
        // TimePicker,
    },
    props: {
      addTimePicker:{
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
      changeCustom: {
        type: Boolean,
        required: false,
      },
    },
    data: () => ({
      checkAdmin: cookies.get('checkAdmin'),
      roleUser: cookies.get('roleUser'),
      permissionsUser: localStorage.getItem('permissionsKey'),
      userLogged: parseInt(cookies.get('userID')),
      deadline: '',
      end_time:'',
      checkCreator: false,
      is_custom: false,
      is_custom_time:false,
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

      changeCustom(value) {
        if (value) {
          this.addNew();
        }
      },

      changeTimeCustom(value) {
        if (value) {
          this.addTimeNew();
        }
      },

      // changeCustom: {
      //   handler: 'addNew',
      //   immediate: true,
      // },
    },

    mounted() {},

    created() {},

    methods: {
      defaultDeadline(date) {
        if (date) {
          return moment(date).add(1, 'days').format('DD.MM.YYYY');
        } else {
          return moment().add(1, 'days').format('DD.MM.YYYY');
        }
      },

      addNew() {
        this.is_custom = false;
      },
      addTimeNew(){
        this.is_custom = false;
        this.is_custom_time = false;
      },

      editItem(item) {
        this.editedItem = item;
        this.is_custom = true;
      },

      getDeadline(value) {
        this.deadline = value.date;
        const today = new Date();
      const todayDateString = today.toISOString().split('T')[0];
        if (this.deadline === todayDateString) {
        this.startToday = true
      } else {
        this.startToday = false
      }
        if (this.editMode) {
          this.editedItem.deadline_pre = this.deadline;
        } else {
          this.objectItem.deadline_pre = this.deadline;
        }
        this.$emit('changeDate', {
          changed: !!value.changeDate,
        });
      },

      getTimeDeadline(value) {
        this.end_time = value.time;
        if (this.editMode) {
          this.editedItem.end_time_pre = this.end_time;
        } else {
          this.objectItem.end_time_pre = this.end_time;
        }
        this.$emit('changeTime', {
          changed: !!value.changeTime,
        });
      },
    }
  };
</script>
<style scoped>
.default-question-mark{
  max-width: 50px;
}
.deadline-switch{
  padding-left: 100px;
}
</style>

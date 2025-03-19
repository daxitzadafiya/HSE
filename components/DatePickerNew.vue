<template>
  <div>
    <v-menu
      ref="menu"
      v-model="menu"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      max-width="290px"
      min-width="auto"
      :disabled="disable"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="dateFormatted"
          :label="label ? label : 'Date'"
          persistent-hint
          placeholder="DD.MM.YYYY"
          outlined
          :readonly="true"
          :rules="required"
          :aria-autocomplete="false"
          v-bind="attrs"
          @blur="blurDate"
          v-on="on"
        />
      </template>
      <v-date-picker
        v-model="date"
        v-if="deactivateDate"
        first-day-of-week="1"
        no-title
        :readonly="disable"
        :min="deactivateDate"
        @input="menu = false"
      />
      <v-date-picker
        v-model="date"
        v-else
        first-day-of-week="1"
        no-title
        :readonly="disable"
        :min="minDate"
        :max="futureDate ? maxDate : today"
        @input="menu = false"
      />
    </v-menu>
  </div>
</template>

<script>
  import moment from 'moment';

  export default {
    name: "DatePickerNew",
    props: {
      item: {
        type: Object,
        required: true,
      },
      dateInput: {
        type: String,
        required: false,
      },
      label: {
        type: String,
        required: false,
      },
      // useKeyboard: Boolean,
      disable: Boolean,
      pastDate: Boolean,
      futureDate: Boolean,
      isStartDate: {
        type: Boolean,
        required: false,
      },
      isDeadline: {
        type: Boolean,
        required: false,
      },
      extendDate: {
        type: Boolean,
        required: false,
      },
      objectItem:{
        type: Object,
        required: false
      },
      deactivateDate:{
        type: String,
        required: false
      }
    },
    data: () => ({
      minDate: moment(new Date('1600-01-01').toLocaleString('en-US', { timeZone: (localStorage.getItem("time_zone") && localStorage.getItem("time_zone") != 'null' ? localStorage.getItem("time_zone") : "Europe/Oslo") }).substr(0, 10)).format("YYYY-MM-DD"),
      maxDate: '',
      today: moment(new Date().toLocaleString('en-US', { timeZone: (localStorage.getItem("time_zone") && localStorage.getItem("time_zone") != 'null' ? localStorage.getItem("time_zone") : "Europe/Oslo") }).substr(0, 10)).format("YYYY-MM-DD"),
      // today: (new Date(Date.now() - ((new Date()).getTimezoneOffset() * 60000))).toISOString().substr(0, 10),
      date: '',
      dateFormatted: '',
      menu: false,
      required: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else if (!/^(?:(?:31(\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)\d{2})$/.test(v))
            return 'Date format must be valid';
          else return true;
        }
      ],
    }),
    mounted(){
      if (this.extendDate){
        if(this.objectItem?.time_info){

          this.minDate= new Date(this.objectItem?.time_info?.deadline).toISOString().substr(0, 10);
        }
        else{
          this.minDate= new Date(this.objectItem?.deadline).toISOString().substr(0, 10);
        }
      }
    },
    computed: {},

    watch: {
      item: {
        handler: 'getItem',
        immediate: true,
      },

      dateInput: {
        handler: 'getDateInput',
        immediate: true,
      },

      date: {
        handler: 'getDate',
        immediate: true,
      },

      dateFormatted(value) {
        if (value) {
          this.menu = false;
          this.reformatDate();
        }
      },

      menu(value) {
        if (value) {
          this.dateFormatted = '';
        }
      },
    },

    methods: {
      blurDate() {
        if (!this.disable) {
          this.date = this.parseDate(this.dateFormatted);
        }
      },

      onlyNumber(e) {
        if (!(/\d/i.test(e.key))) {
          e.preventDefault();
        }
      },

      reformatDate() {
        let that = this;
        if (that.dateFormatted.length === 2 || that.dateFormatted.length === 5) {
          that.dateFormatted = that.dateFormatted + '.';
        }
      },

      getItem() {
        let that = this;
        if (!that.pastDate) {
          that.minDate = that.today;
        }
        if (that.isStartDate && !that.item.start_date) {
          that.date = that.today;
          that.item.start_date_pre = that.date;
        }
        if (that.isDeadline && !that.item.deadline) {
          if (that.item.start_date_pre) {
            that.date = moment(that.item.start_date_pre).add(1, 'days').format('YYYY-MM-DD');
          } else {
            that.date = moment().add(1, 'days').format('YYYY-MM-DD');
          }
          that.item.deadline_pre = that.date;
          that.minDate = that.date;
        }
        that.getDate();
      },

      getDateInput() {
        let that = this;
        if (that.dateInput) {
          that.date = that.dateInput;
        }
      },

      getDate() {
        if (!this.date) {
          this.date = '';
        }
        this.dateFormatted = this.formatDate(this.date);

        let is_changed = false;
        if (this.isStartDate && this.date !== '') {
          let start = this.date;
          let end = this.item.deadline_pre || '';
          const [yearStartDate, monthStartDate, dayStartDate] = start.split('-');
          const [yearDeadline, monthDeadline, dayDeadline] = end.split('-');
          if (yearStartDate > yearDeadline || (yearStartDate <= yearDeadline && monthStartDate > monthDeadline) || (yearStartDate <= yearDeadline && monthStartDate <= monthDeadline && dayStartDate > dayDeadline)) {
            is_changed = true;
          }
        }

        this.$emit('getDate', {
          date: this.date,
          changeDate: is_changed,
        });
      },

      formatDate(date) {
        if (!date) return null;

        const [year, month, day] = date.split('-');
        return `${day}.${month}.${year}`;
      },

      parseDate(date) {
        if (!date) return null;
        const [day, month, year] = date.split('.');

        if (!this.pastDate) {
          const [yearToday, monthToday, dayToday] = this.today.split('-');
          if (yearToday > year || (yearToday <= year && monthToday > month) || (yearToday <= year && monthToday <= month && dayToday > day)) {
            return null;
          }
        }

        if (!this.futureDate) {
          const [yearToday, monthToday, dayToday] = this.today.split('-');
          if (yearToday < year || (yearToday >= year && monthToday < month) || (yearToday >= year && monthToday >= month && dayToday < day)) {
            return null;
          }
        }

        // custom if Start date greater Deadline
        if (this.isDeadline) {
          let start = this.item.start_date_pre;
          const [yearStartDate, monthStartDate, dayStartDate] = start.split('-');
          if (yearStartDate > year || (yearStartDate <= year && monthStartDate > month) || (yearStartDate <= year && monthStartDate <= month && dayStartDate > day)) {
            return null;
          }
        }

        
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      },
    },
  };
</script>

<style scoped>

</style>

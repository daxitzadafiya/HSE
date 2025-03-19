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
          hint="DD.MM.YYYY format"
          persistent-hint
          placeholder="DD.MM.YYYY"
          outlined
          :readonly="!useKeyboard || disable"
          :rules="required"
          :aria-autocomplete="false"
          v-bind="attrs"
          @blur="blurDate"
          v-on="on"
        />
      </template>
      <v-date-picker
        v-model="date"
        first-day-of-week="1"
        no-title
        :readonly="disable"
        :min="minDate"
        :max="futureDate ? '' : today"
        @input="menu = false"
      />
    </v-menu>
  </div>
</template>

<script>
export default {
  name: "DatePicker",
  props: {
    item: Object,
    dateInput: {
      type: String,
      required: false,
    },
    label: {
      type: String,
      required: false,
    },
    useKeyboard: Boolean,
    disable: Boolean,
    pastDate: Boolean,
    defaultToday: Boolean,
    futureDate: Boolean,
  },
  data: () => ({
    minDate: new Date('1600-01-01').toISOString().substr(0, 10),
    today: new Date().toISOString().substr(0, 10),
    date: '',
    // dateFormatted: vm.formatDate((new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)),
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

  computed: {
    computedDateFormatted() {
      return this.formatDate(this.date);
    },
  },

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
        this.reformatPhoneNumber();
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

    reformatPhoneNumber() {
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
      if (that.defaultToday) {
        if (!that.item.start_time_pre) {
          that.date = that.today;
        }
      } else {
        if (!that.item.deadline_pre) {
          that.date = '';
        }
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
      this.$emit('getDate', {
        date: this.date,
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

      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    },
  },
};
</script>

<style scoped>

</style>

<template>
  <div class="input-wrap">
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
      class="mt-0"
    >
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        min-width="450px"
        :disabled="disable"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="dateFormatted"
            placeholder="DD.MM.YYYY"
            outlined
            :readonly="true"
            :rules="required"
            :label="$t('form.deadline')"
            hint="DD.MM.YYYY format"
            persistent-hint
            @blur="blurDate"
            v-on="on"
          />
        </template>
        <v-date-picker
          v-model="date"
          first-day-of-week="1"
          :readonly="disable"
          :min="minDate"
          class="picker-custom-1"
          @input="menu = true"
        >
          <v-spacer />
          <v-btn text @click="item.deadline = '', item.recurring = '', menu = false">
            {{ $t('button.clear') }}
          </v-btn>
          <v-btn class="btn-custom-green" @click="apply">
            {{ $t('button.apply') }}
          </v-btn>
        </v-date-picker>
        <v-radio-group
          v-model="item.recurring"
          column
          class="radio-group-custom-1"
        >
          <label class="radio-label-custom">{{ $t('form.recurring_activity') }}</label>
          <v-radio
            v-for="recurring in recurringArray"
            :key="recurring.value"
            :label="recurring.name"
            :value="recurring.value"
          />
        </v-radio-group>
      </v-menu>
    </v-form>
  </div>
</template>
<script>
  export default {
    props: {
      item: Object,
      pastDate: Boolean,
      // useKeyboard: Boolean,
      disable: Boolean,
    },
    data: () => ({
      valid: true,
      minDate: new Date('1600-01-01').toISOString().substr(0, 10),
      today: new Date().toISOString().substr(0, 10),
      date: '',
      dateFormatted: '',
      recurringArray: [
        {
          value: "daily",
          name: "Daily"
        },
        {
          value: "weekly",
          name: "Weekly"
        },
        {
          value: "monthly",
          name: "Monthly"
        },
        {
          value: "quarter",
          name: "Quarter"
        },
        {
          value: "yearly",
          name: "Yearly"
        },
      ],
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

    watch: {
      item: {
        handler: 'getItem',
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
        if (that.item.start_date_pre) {
          that.date = that.item.start_date_pre;
        } else {
          that.date = that.today;
        }
        that.item.deadline_pre = that.date;
        that.minDate = that.date;
        that.getDate();
      },

      getDate() {
        if (!this.date) {
          this.date = '';
        }
        this.dateFormatted = this.formatDate(this.date);
        let is_changed = false;
        if (this.isStartDate && this.date !== '') {
          let start = this.date;
          let end = this.item.deadline_pre;
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

        // custom if Start date greater Deadline
        let start = this.item.start_date_pre;
        const [yearStartDate, monthStartDate, dayStartDate] = start.split('-');
        if (yearStartDate > year || (yearStartDate <= year && monthStartDate > month) || (yearStartDate <= year && monthStartDate <= month && dayStartDate > day)) {
          return null;
        }

        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      },

      apply() {
        let that = this;
        if (that.$refs.form.validate()) {
          that.menu = false;
        }
      },
    },
  };
</script>

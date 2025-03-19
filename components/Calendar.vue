<template>
  <div>
    <v-sheet height="64">
      <v-toolbar
        flat
      >
        <v-btn
          outlined
          class="mr-4"
          color="grey darken-2"
          @click="setToday"
        >
          Today
        </v-btn>
        <v-btn
          fab
          text
          small
          color="grey darken-2"
          @click="prev"
        >
          <v-icon small>
            mdi-chevron-left
          </v-icon>
        </v-btn>
        <v-btn
          fab
          text
          small
          color="grey darken-2"
          @click="next"
        >
          <v-icon small>
            mdi-chevron-right
          </v-icon>
        </v-btn>
        <v-toolbar-title v-if="$refs.calendar">
          {{ $refs.calendar.title }}
        </v-toolbar-title>
        <v-spacer />
        <v-menu
          bottom
          right
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              outlined
              color="grey darken-2"
              v-bind="attrs"
              v-on="on"
            >
              <span>{{ typeToLabel[type] }}</span>
              <v-icon right>
                mdi-menu-down
              </v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="type = 'day'">
              <v-list-item-title>Day</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = 'week'">
              <v-list-item-title>Week</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = 'month'">
              <v-list-item-title>Month</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = '4day'">
              <v-list-item-title>4 days</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar>
    </v-sheet>
    <v-sheet height="600">
      <v-calendar
        ref="calendar"
        v-model="focus"
        color="primary"
        :events="events"
        :event-color="getEventColor"
        :type="type"
        :weekdays="weekdays"
        @click:more="viewDay"
        @click:date="viewDay"
        @click:event="showEvent"
        @change="updateRange"
      />
      <v-menu
        v-model="selectedOpen"
        :close-on-content-click="false"
        :activator="selectedElement"
        offset-x
      >
        <v-card
          color="grey lighten-4"
          min-width="350px"
          flat
        >
          <v-toolbar
            :color="selectedEvent.color"
            dark
          >
            <v-btn icon>
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon>
              <v-icon>mdi-heart</v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <span v-html="selectedEvent.details"></span>
          </v-card-text>
          <v-card-actions>
            <v-btn
              text
              color="secondary"
              @click="selectedOpen = false"
            >
              Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-sheet>
  </div>
</template>

<script>
import {_} from 'vue-underscore';
export default {
  name: 'Calendar',
  data: () => ({
    focus: '',
    type: 'month',
    weekdays: [1, 2, 3, 4, 5, 6, 0],
    typeToLabel: {
      month: 'Month',
      week: 'Week',
      day: 'Day',
      '4day': '4 Days',
    },
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    eventTasks: [],
    eventGoals: [],
    eventRoutines: [],
    colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
    names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
  }),
  mounted () {
    this.$refs.calendar.checkChange();
  },
  methods: {
    viewDay ({ date }) {
      this.$nuxt.$loading.start();
      this.focus = date;
      this.type = 'day';
    },
    getEventColor (event) {
      return event.color;
    },
    setToday () {
      this.$nuxt.$loading.start();
      this.focus = '';
    },
    prev () {
      this.$nuxt.$loading.start();
      this.$refs.calendar.prev();
    },
    next () {
      this.$nuxt.$loading.start();
      this.$refs.calendar.next();
    },
    showEvent ({ nativeEvent, event }) {
      this.$router.push(event.url);
      nativeEvent.stopPropagation();
    },
    updateRange ({ start, end }) {
      let that = this;
      // const min = new Date(`${start.date}T00:00:00`)
      // const max = new Date(`${end.date}T23:59:59`)
      // const days = (max.getTime() - min.getTime()) / 86400000
      // const eventCount = this.rnd(days, days + 20)
      // console.log('start: ', start.date);
      // console.log('min: ', min);
      // console.log('max: ', max);

      // this.getTask(start.date, end.date);
      // this.getGoal(start.date, end.date);
      // this.getRoutine(start.date, end.date);

      const events = [];
      that.$store.dispatch('statements/index', {param: 'calendar', startDate: start.date, endDate: end.date}).then(result => {
        if (result.data) {
          _.each(result.data, function (item) {
            _.each(item.data, function (object) {
              const allDay = true;
              const first = new Date(object.start_time * 1000);
              const second = new Date(object.deadline * 1000);
              let color = '';
              let url = '';

              if (item.type === 'Task Assignee') {
                color = 'blue';
                url = '/company/tasks?type=' + object.type +'&id=' + object.type_id;
              } else if (item.type === 'Responsible Person') {
                color = 'indigo';
                url = '/company/tasks?type=' + object.type +'&id=' + object.type_id;
              } else if (item.type === 'Goal') {
                color = 'green';
                url = '/company/goals?id=' + object.id;
              } else if (item.type === 'Routine') {
                color = 'orange';
                url = '/company/routines?id=' + object.id;
              }

              events.push({
                name: '[' + item.type +'] ' + object.name,
                start: first,
                end: second,
                color: color,
                timed: !allDay,
                url: url,
              });
            });
          });
          that.events = events;
          // console.log(events);
          that.$nuxt.$loading.finish();
        }
      }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }
        // that.$toaster.error(that.$i18n.t('message.fail_statement_view'));
        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });

    },
    rnd (a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
    returnData() {
      // this.events = _.union(_.uniq(this.eventTasks), _.uniq(this.eventGoals), _.uniq(this.eventRoutines));
      this.events = _.uniq(this.eventTasks).concat(_.uniq(this.eventGoals), _.uniq(this.eventRoutines));
      this.$nuxt.$loading.finish();
    },
    // getTask(startDate, endDate) {
    //   let that = this;
    //   const events = []
    //   that.$store.dispatch('tasks/index', {getBy: 'type', startDate: startDate, endDate: endDate}).then(result => {
    //     if (result.data) {
    //       _.each(result.data, function (item) {
    //         const allDay = true;
    //         const first = new Date(item.start_time);
    //         const second = new Date(item.deadline);
    //
    //         events.push({
    //           name: '[Task] ' + item.name,
    //           start: first,
    //           end: second,
    //           color: 'blue',
    //           timed: !allDay,
    //         })
    //       });
    //       that.eventTasks = events
    //       that.returnData();
    //     }
    //
    //   }).catch((error) => {
    //     that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
    //     that.$nuxt.$loading.finish();
    //   });
    //
    // },
    // getGoal(startDate, endDate) {
    //   let that = this;
    //   const events = []
    //   that.$store.dispatch('goals/index', {startDate: startDate, endDate: endDate}).then(result => {
    //     if (result.data) {
    //       _.each(result.data, function (item) {
    //         const allDay = true;
    //         const first = new Date(item.start_time);
    //         const second = new Date(item.deadline);
    //
    //         events.push({
    //           name: '[Goal] ' + item.name,
    //           start: first,
    //           end: second,
    //           color: 'green',
    //           timed: !allDay,
    //         })
    //       });
    //       that.eventGoals = events
    //       that.returnData();
    //     }
    //
    //   }).catch((error) => {
    //     that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
    //     that.$nuxt.$loading.finish();
    //   });
    // },
    // getRoutine(startDate, endDate) {
    //   let that = this;
    //   const events = []
    //   that.$store.dispatch('routines/index', {startDate: startDate, endDate: endDate}).then(result => {
    //     if (result.data) {
    //       _.each(result.data, function (item) {
    //         const allDay = true;
    //         const first = new Date(item.start_time);
    //         const second = new Date(item.deadline);
    //
    //         events.push({
    //           name: '[Routine] ' + item.name,
    //           start: first,
    //           end: second,
    //           color: 'orange',
    //           timed: !allDay,
    //         })
    //       });
    //
    //       that.eventRoutines = events
    //       that.returnData();
    //     }
    //
    //   }).catch((error) => {
    //     that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
    //     that.$nuxt.$loading.finish();
    //   });
    // },
  },
};
</script>
<style scoped>

</style>

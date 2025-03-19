<template>
  <div class="pt-4 pb-4">
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
    <div v-else class="section-connect-to">
      <div class="section-connect-to-label section-connect-to-label-reminder">
        {{ $t('form.deadline') }}
      </div>
      <div class="switch-component switch-component-small default-question-mark">
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
        <b-col v-if="is_create_routine" cols="6">
          <DatePickerRadioNew
            :data="editMode ? editedItem : objectItem"
            :recurringArray="recurringArray"
            :past-date="false"
            :disable="!checkAdmin && !checkCreator"
            @getDate="getDeadlineRecurring"
          />
        </b-col>
        <b-col v-else cols="6">
          <DatePickerNew
            :label="$t('form.deadline')"
            :item="editMode ? editedItem : objectItem"
            :date-input="editMode ? editedItem.deadline : objectItem.deadline"
            :past-date="false"
            :future-date="true"
            :is-deadline="true"
            :disable="!checkAdmin && !checkCreator"
            @getDate="getDeadline"
          />
        </b-col>
        <b-col cols="3">
          <div class="bold-title md-line-height">
            {{ $t('form.create_a_routine') }}
          </div>
        </b-col>
        <b-col cols="3">
          <div class="switch-component switch-component-yes-no default-question-mark">
            <label class="left-text">{{ $t('form.no') }}</label>
            <v-switch
              v-model="is_create_routine"
              :label="$t('form.yes')"
              inset
              class="right-text"
              @change="is_routine(is_create_routine)"
            />
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>
<script>
  import cookies from "js-cookie";
  import moment from 'moment';
  import DatePickerNew from "./DatePickerNew";
  // import DatePickerRadioNew from "./DatePickerRadioNew";
  import  DatePickerRadio from "./DatePickerRadio.vue";
  export default {
    name: "Deadline",
    components: {
      DatePickerNew,
      DatePickerRadioNew:DatePickerRadio,
    },
    props: {
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
      checkCreator: false,
      is_custom: false,
      is_create_routine: false,
      editedItem: {},
      recurringArray: [
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
      is_routine(is_routine){
          this.objectItem.is_routine=is_routine
      },

      addNew() {
        this.is_custom = false;
        this.is_create_routine = false;
      },

      editItem(item) {
        this.editedItem = item;
        this.is_custom = true;
      },

      getDeadline(value) {
        this.deadline = value.date;
        if (this.editMode) {
          this.editedItem.deadline_pre = this.deadline;
        } else {
          this.objectItem.deadline_pre = this.deadline;
        }
        // this.objectItem.deadline_pre = this.deadline;
      },

      getDeadlineRecurring(value) {
        this.deadline = value.date;
        if (this.editMode) {
          this.editedItem.deadline_pre = this.deadline;
        } else {
          this.objectItem.deadline_pre = this.deadline;
        }
        // this.objectItem.deadline_pre = this.deadline;
      },
    }
  };
</script>
<style scoped>
.default-question-mark{
  max-width: 50px;
}
</style>

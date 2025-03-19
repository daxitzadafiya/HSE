<template>
  <div>
    <div
      v-if="!is_custom"
      class="input-wrap d-inline-flex hse-document-badge-tab"
    >
      <div class="bold-title md-line-height col-6 p-0">
        {{ $t('form.deactivate') }}
      </div>
      <v-badge
        :value="hoverQuestionMark"
        right
        transition="slide-x-transition"
        class="hse-badge-icon deactivate-badge"
      >
        <span slot="badge">{{ $t('Deactivate') }}</span>
        <v-hover v-model="hoverQuestionMark">
          <i class="fa fa-question-circle"></i>
        </v-hover>
      </v-badge>
      <div class="switch-component switch-required-action pl-86">
        <label class="left-text">{{ $t('form.none') }}</label>
        <v-switch
          v-model="is_custom"
          :label="$t('form.activate')"
          inset
          class="right-text"
        />
      </div>
    </div>
    <div v-else class="section-connect-to mt-0">
      <div class="section-connect-to-label section-nearest-manager">
        {{ $t('form.deactivate') }}
      </div>
      <div
        class="switch-component switch-responsible-custom-small switch-required-action cust_action"
      >
        <label class="left-text ">{{ $t('form.none') }}</label>
        <v-switch
          v-model="is_custom"
          :label="$t('form.activate')"
          inset
          class="right-text"
        />
      </div>
      <b-row class="">
        <b-col class="activation-date-picker">
          <DatePickerNew
            :label="deactivate ? $t('form.deactivate') : $t('form.deadline')"
            :item="editMode ? editedItem : objectItem"
            :date-input="freqUnit ? deactivateDate : editMode ? editedItem.deadline : objectItem.deadline"
            :past-date="false"
            :future-date="true"
            :is-deadline="true"
            @getDate="getDeadline"
            :deactivateDate="deactivateDate"
          />
        </b-col>
      </b-row>
    </div>
  </div>
</template>
<script>
import cookies from 'js-cookie'
import moment from 'moment'
import DatePickerNew from './DatePickerNew'
// import NewTimePicker from './NewTimePicker.vue';
// import TimePicker from './TimePicker.vue';

export default {
  name: 'Deadline',
  components: {
    DatePickerNew,
    // NewTimePicker,
    // TimePicker,
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
    changeCustom: {
      type: Boolean,
      required: false,
    },
    deactivate: {
      type: Boolean,
      required: false,
    },
    frequencyUnit:{
      type: String,
      required: false
    }
  },
  data: () => ({
    checkAdmin: cookies.get('checkAdmin'),
    roleUser: cookies.get('roleUser'),
    permissionsUser: localStorage.getItem('permissionsKey'),
    userLogged: parseInt(cookies.get('userID')),
    deadline: '',
    end_time: '',
    checkCreator: false,
    is_custom: false,
    is_custom_time: false,
    editedItem: {},
    hoverQuestionMark: false,
    freqUnit: '',
    deactivateDate: ''
  }),

  watch: {
    objectItem(value) {
      
      if (value) {
        if (this.editMode) {
          this.checkCreator = this.objectItem.added_by === this.userLogged
          this.editItem(this.objectItem)
        } else {
          this.checkCreator = true
          this.addNew()
        }
      }
      
    },
    frequencyUnit(value){
      this.freqUnit= value;
      if(value == "Monthly"){
        this.deactivateDate=moment(this.objectItem.start_date_pre).add(1, 'M').format('YYYY-MM-DD');
      }
      else if(value == "Yearly"){
        this.deactivateDate=moment(this.objectItem.start_date_pre).add(1, 'Y').format('YYYY-MM-DD');
      }
      else if(value == "Weekly"){
        this.deactivateDate=moment(this.objectItem.start_date_pre).add(7, 'days').format('YYYY-MM-DD');
      }
      else if(value == "Daily"){
        this.deactivateDate=moment(this.objectItem.start_date_pre).add(1, 'days').format('YYYY-MM-DD');
      }
      else if(value == "Quarter"){
        this.deactivateDate=moment(this.objectItem.start_date_pre).add(3, 'M').format('YYYY-MM-DD');
      }
      else if(value == "Bi-Weekly"){
        this.deactivateDate=moment(this.objectItem.start_date_pre).add(15, 'days').format('YYYY-MM-DD');
      }
      else if(value == "Half-Yearly"){
        this.deactivateDate=moment(this.objectItem.start_date_pre).add(6, 'M').format('YYYY-MM-DD');
      }
      else{
        console.log("else part");
        this.deactivateDate=moment(this.objectItem.start_date_pre).add(1, 'days').format('YYYY-MM-DD');
      }
    },

    changeCustom(value) {
      if (value) {
        this.addNew()
      }
    },

    changeTimeCustom(value) {
      if (value) {
        this.addTimeNew()
      }
    },

    // changeCustom: {
    //   handler: 'addNew',
    //   immediate: true,
    // },
  },

  mounted() { },

  created() { },

  methods: {
    defaultDeadline(date) {
      if (date) {
        return moment(date).add(1, 'days').format('DD.MM.YYYY')
      } else {
        return moment().add(1, 'days').format('DD.MM.YYYY')
      }
    },

    addNew() {
      this.is_custom = false
    },
    addTimeNew() {
      this.is_custom = false
      this.is_custom_time = false
    },

    editItem(item) {
      this.editedItem = item
      this.is_custom = true
    },

    getDeadline(value) {
      this.deadline = value.date
      if (this.editMode) {
        this.editedItem.deadline_pre = this.deadline
      } else {
        this.objectItem.deadline_pre = this.deadline
      }
      this.$emit('changeDate', {
        changed: !!value.changeDate
      })
    },

    getTimeDeadline(value) {
      this.end_time = value.time
      if (this.editMode) {
        this.editedItem.end_time_pre = this.end_time
      } else {
        this.objectItem.end_time_pre = this.end_time
      }
      this.$emit('changeTime', {
        changed: !!value.changeTime,
      })
    },
  },
}
</script>
<style scoped>
.default-question-mark {
  max-width: 50px;
}
.deadline-switch {
  padding-left: 100px;
}
.hse-badge-icon.deactivate-badge {
  top: 8px;
}
.pl-86{
    padding-left: 86px !important;
}
:deep(.deadline .section-connect-to){
    margin-top: 0px !important;
}
:deep(.cust_action){
    padding-left: 62px !important;
}
  .section-nearest-manager {
    width: 265px !important;
  }
</style>

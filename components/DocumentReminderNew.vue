<template>
  <div class="pt-4 pb-4">
    <b-row v-if="!reminderItem.is_reminder">
      <!-- --------------------- -->
      <b-row>
        <b-col cols="2" class="hse-document-badge-tab ml-4">
        <div class="bold-title md-line-height">
          {{ $t('title.task') }}
        </div>
      </b-col>
      <b-col cols="4">
          <div class="switch-component default-question-mark">
              <label class="left-text">{{ $t('form.none') }}</label>
                <v-switch
                        v-model="reminderItem.is_reminder"
                        :label="$t('form.activate')"
                        inset
                        class="right-text"
                        :disabled="!!planAccess?.lastPlanAccess?.task || !planAccess?.planAccess?.task"
                      />
                      <v-hover v-model="hoverTaskPlanAccess">
                          <div>
                              <v-badge
                                      :value="hoverTaskPlanAccess" v-if="!!planAccess?.lastPlanAccess?.task || !planAccess?.planAccess?.task"
                                      right
                                      transition="slide-x-transition"
                                      class="hse--icon-question-circle"
                                      style="cursor: pointer;">
                                  <span slot="badge" @click="redirectUrl">{{ $t('message.accessible_module') }}</span>
                                  <i class="fa fa-question-circle"></i>
                              </v-badge>
                          </div>
                      </v-hover>
                    </div>
                  </b-col>
      </b-row>
      <!-- --------------------------------- -->
      <!-- <b-col cols="4">
        <div class="input-wrap">
          <div class="switch-component">
            <label class="left-text">{{ $t('title.reminder') }}</label>
            <v-switch
              v-model="reminderItem.is_reminder"
              :label="$t('form.activate')"
              class="right-text"
              :readonly="!reminderItem.editPermission"
            />
          </div>
        </div>
      </b-col> -->
    </b-row>
    <div v-else class="section-connect-to section-connect-to-reminder mt-5">
      <div class="section-connect-to-label section-connect-to-label-reminder">
        {{ $t('title.task') }}
      </div>
      <div class="switch-component switch-component-small reminder-type-switch default-question-mark">
        <label class="left-text">{{ $t('form.none') }}</label>
        <v-switch
          v-model="reminderItem.is_reminder"
          :label="$t('form.activate')"
          inset
          class="right-text"
        />
      </div>
      <b-row class="pt-3 mt-3">
        <b-col cols="12" class="reminder-main">
          <document-reminder-name
            v-if="reminderItem"
            class="ml-2 mb-0"
            :reminder-item="reminderItem"
            :edit-mode="editMode"
          />
          <document-reminder-description
            v-if="reminderItem"
            class="ml-2 mb-0"
            :reminder-item="reminderItem"
            :edit-mode="editMode"
          />
          <Responsible
            class="ml-2 mb-0"
            :object-item="reminderItem"
            :edit-mode="false"
            :newRequire="true"
            :is_document="true"
          />

          <Attendee
            class="ml-2 mt-0"
            :object-item="reminderItem"
            :edit-mode="false"
            :newRequire="true"
            :is_document="true"
          />
          <CreateAsRoutine
          :object-item="reminderItem"
          class="ml-2 mt-0"
          :edit-mode="false"
          @changeRecurring="changeRecurring"
          />

          <!-- <div class="pt-4 pb-4 d-flex align-center col-12 ml-2">
            <b-row class="col-12 px-0 justify-content-between">
              <div class="col-7 row">
                <b-col cols="4" class="p-0">
                  <div class="bold-title md-line-height">
                    {{ $t('form.create_a_routine') }}
                  </div>
                </b-col>
                <b-col cols="3" class="p-0 ml-n3">
                  <div
                    class="switch-component switch-component-yes-no default-question-mark"
                  >
                    <label class="left-text">{{ $t('form.no') }}</label>
                    <v-switch
                      :label="$t('form.yes')"
                      inset
                      class="right-text"
                      @change="is_routine"
                    />
                  </div>
                </b-col>
              </div>
              <b-col v-if="create_routine" cols="5" class="d-flex p-0">
                <div class="bold-title md-line-height">
                  {{ $t('form.recurring') }}
                </div>
                <v-badge
                  :value="hoverRecurring"
                  right
                  transition="slide-x-transition"
                  class="hse-badge-icon"
                >
                  <span slot="badge">{{ $t('message.hover_recurring') }}</span>
                  <v-hover v-model="hoverRecurring">
                    <i class="fa fa-question-circle"></i>
                  </v-hover>
                </v-badge>
                <div class="input-wrap">
                  <div
                    class="switch-component document-type-wrap default-question-mark"
                  >
                    <label class="left-text">{{ $t('form.reminder') }}</label>
                    <v-switch
                      v-model="is_recurring"
                      :label="$t('form.task')"
                      class="right-text ml-7"
                      inset
                    />
                  </div>
                </div>
              </b-col>
            </b-row>
          </div> -->

          <StartDate
            v-if="!reminderItem.is_routine || !changeActivate"
            class="ml-2 mt-0"
            :object-item="reminderItem"
            :edit-mode="false"
            :addTimePicker="true"
            @changeDate="changeStartDate"
          />
         <!-- Deadline -->
          <Deadline
            v-if="!reminderItem.is_routine || !changeActivate"
            :object-item="reminderItem"
            :edit-mode="false"
            :change-custom="changeDeadlineCustom"
            :addTimePicker="true"
            class="ml-2 mt-0"
          />
          <Activation
              v-if="reminderItem.is_routine || changeActivate"
              :object-item="reminderItem"
              :edit-mode="false"
              @changeDate="changeStartDate"
              :unitValue="unitValue"
              :duration-data="durationData"
              :units="units"
              class="ml-2"
            />
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import DocumentReminderName from './DocumentReminderName';
import DocumentReminderDescription from './DocumentReminderDescription.vue';
import Responsible from './Responsible';
// import RequiredComment from'./RequiredComment.vue'
import Attendee from './Attendee';
import StartDate from './StartDate';
import Deadline from './Deadline'
// import DeadlineRecurring from './DeadlineRecurring';
import CreateAsRoutine from './CreateAsRoutine';
import Activation from './Activation';
import cookies from 'js-cookie';
// import DeviationResponsible from "./DeviationResponsible";
export default {
  name: 'document-reminder-new',
  props: {
    reminderItem: {
      type: Object,
      required: false,
    },
    create_routine: {
      type: Boolean,
      required: false,
    },
    durationData:{
      type: Object,
      required: false,
    }
  },

  components: {
    DocumentReminderName,
    DocumentReminderDescription,
    // DeviationResponsible,
    CreateAsRoutine,
    // DeadlineRecurring,
    Responsible,
    Attendee,
    StartDate,
    // RequiredComment,
    Deadline,
    Activation
  },

  created(){
    this.reminderItem.is_routine = false
    this.changeActivate = false
    this.reminderItem.isDefaultAttendee=false
    this.reminderItem.isDefaultResponsible=false
    // this.create_routine = this.reminderItem.is_routine
  },

  methods: {
    redirectUrl(){
      if (this.roleUser == 'company admin') {
              this.$router.push('/settings/billings/');
          }
      },
    changeStartDate(val) {
      this.changeDeadlineCustom = !!val.changed;
    },
    changeRecurring(is_routine){
      if (is_routine == true) {
        this.changeActivate = true
      }else{
        this.changeActivate = false
      }
    }
  },

  watch:{
    reminderItem(value){
      this.changeActivate=value.is_routine;
    }
  },

  data: () => ({
    hoverTaskPlanAccess:false,
    editMode:false,
    changeActivate:false,
    hover: false,
    changeDeadlineCustom: false,
    planAccess: JSON.parse(localStorage.getItem('planAccess')),
    roleUser: cookies.get('roleUser'),
    required: [
      (v) => {
        if (!v || v.length < 1) return 'This is required';
        else return true;
      },
    ],
    // create_routine: false,
      is_recurring: false,
      hoverRecurring:false,
      // is_routine:false,
      selectedUnit: 'Daily',
    unitValue: '',
    
    units: ['Daily', 'Weekly', 'Bi-Weekly', 'Monthly', 'Quarter', 'Half-Yearly', 'Yearly'],
  }),
}
</script>
<style scoped>
.default-question-mark {
  max-width: 50px;
}
.switch-component-yes-no{
  padding-left: 99px
}
</style>

<template>
  <div>
    <b-row v-if="!reminderItem.is_activated">
      <b-col cols="2">
        <div class="bold-title md-line-height">
          {{ $t('form.deadline') }}
        </div>
      </b-col>
      <b-col cols="4">
        <div class="input-wrap">
          <div class="switch-component ">
            <label class="left-text">{{ $t('form.none') }}</label>
            <v-switch
              v-model="reminderItem.is_activated"
              :label="$t('form.custom')"
              :readonly="!reminderItem.editPermission"
              class="right-text"
              inset
            />
          </div>
        </div>
      </b-col>
    </b-row>
    <div v-else class="section-connect-to section-connect-to-reminder">
      <div class="section-connect-to-label section-connect-to-label-reminder">
        {{ $t('form.deadline') }}
      </div>
      <div class="switch-component switch-component-small reminder-type-switch">
        <label class="left-text">{{ $t('form.none') }}</label>
        <v-switch
          v-model="reminderItem.is_activated"
          :label="$t('form.custom')"
          class="right-text"
          inset
          :readonly="!reminderItem.editPermission"
        />
      </div>
      <b-row class="pt-3 mt-3">
        <!-- <b-col cols="6">
          <DatePicker
            :label="$t('form.start_date')"
            :item="reminderItem"
            :date-input="reminderItem.start_time"
            :use-keyboard="true"
            :past-date="false"
            :future-date="true"
            :default-today="true"
            :disable="!checkAdmin && !checkCreator"
            @getDate="getStartDate"
          />
        </b-col> -->
        <b-col cols="9">
          <DatePickerRadio
            :data="reminderItem"
            :recurringArray="recurringArray"
            :disable="!checkAdmin && !checkCreator"
          />
        </b-col>
        <b-col cols="3">
                <div class="input-wrap">
                  <v-text-field
                    v-model="reminderItem.recurring"
                    :label="$t('form.frequency')"
                    name="frequency"
                    outlined
                    readonly
                  />
                </div>
          </b-col>
      </b-row>
      <!-- <div>
        <b-row>

          <b-col cols="2">
            <div class="bold-title md-line-height">
              Required Comment
            </div>
          </b-col>
          <b-col cols="2" class="mr-5">
            <div class="input-wrap">
              <div class="switch-component">
                 <SwitchInput labelTitle="No " switchTitle="Yes" class="mt-1"/>
              </div>
            </div>
          </b-col>
          <b-col cols="3" class="pr-0">
            <div class="bold-title md-line-height pl-5 ml-5">
              Required Attachment
            </div>
          </b-col>
          <b-col cols="3">
            <div class="input-wrap">
              <div class="switch-component">
                <SwitchInput labelTitle="No " switchTitle="Yes" class="mt-1" />
              </div>
            </div>
          </b-col>
        </b-row>
        <div class="switch-component my-5">
          <SwitchInput labelTitle="Open pop" ref="dialogSwitch" switchTitle="Yes" class="mt-1" @switchChangeHandler="switchChangeHandler" />
        </div>
      </div> -->
    </div>
      <!-- <ReminderCommentAttachmentPopup  v-if="isShowRCAPopup" :isRCAModalOpen="isShowRCAPopup" @closeRCADialog="closeRCADialog" @saveRCADialog="saveRCADialog" /> -->
  </div>
</template>
<script>
  // import {_} from 'vue-underscore';
  import cookies from "js-cookie";
  // import DatePicker from "./DatePicker";
  import DatePickerRadio from "./DatePickerRadio";
  // import SwitchInput from "./common/inputs/SwitchInput";
  // import ReminderCommentAttachmentPopup from "./RequiredCommentPopup.vue";

  export default {
    name: "Reminder",
    components: {
    // DatePicker,
    DatePickerRadio,
    // SwitchInput,
    // ReminderCommentAttachmentPopup
},
    props: {
      reminderItem: {
        type: Object,
        required: false,
      },
      editMode: {
        type: Boolean,
        required: false,
      },
    },
    data: () => ({
      isShowRCAPopup:false,
      checkAdmin: cookies.get('checkAdmin'),
      roleUser: cookies.get('roleUser'),
      permissionsUser: localStorage.getItem('permissionsKey'),
      userLogged: parseInt(cookies.get('userID')),
      required: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else return true;
        }
      ],
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
        {
          value: "indefinite",
          name: "Indefinite"
        },
      ],
      start_time: '',
      checkCreator: false,
      hover: false
    }),

    watch: {
      reminderItem(value) {
        if (value) {
          if (this.editMode) {
            this.checkCreator = this.reminderItem.added_by === this.userLogged;
            this.editItem(this.reminderItem);
          } else {
            this.checkCreator = true;
          }
        }
      },
    },

    mounted() {},

    created() {},

    methods: {
      saveRCADialog(){
        this.isShowRCAPopup = false
      },

      closeRCADialog(){
        this.isShowRCAPopup=false
        this.$refs.dialogSwitch.switchInput=false;
      },
      switchChangeHandler(payload){
        this.isShowRCAPopup = payload
      },

      editItem(item) {
        return item;
      },

      getStartDate(value) {
        this.start_time = value.date;
        this.reminderItem.start_time_pre = this.start_time;
      },
    }
  };
</script>

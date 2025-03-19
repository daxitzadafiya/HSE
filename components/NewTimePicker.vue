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
          v-model="timeFormatted"
          :label="label ? label : 'Time'"
          persistent-hint
          placeholder="HH:MM"
          outlined
          :readonly="!useKeyboard || disable"
          :rules="required"
          :aria-autocomplete="false"
          v-bind="attrs"
          @blur="blurTime"
          v-on="on"
        />
      </template>
      <!-- <v-time-picker
        v-model="time"
        format="24hr"
        :readonly="disable"
        @input="menu = false"
      /> -->
      <v-time-picker
        v-model="time"
        format="24hr"
        :allowed-hours="startToday ? allowedHours : extendTime ? allowedHours: allHours"
        :allowed-minutes="startToday ? allowedMinutes : allMinutes"
        :readonly="disable"
        @click:hour="selectTimeData()"
        @input="menu = false"
      />
    </v-menu>
  </div>
</template>

<script>
export default {
  name: "TimePicker",
  props: {
    timeInput: {
      type: String,
      required: false,
    },
    label: {
      type: String,
      required: false,
    },
    useKeyboard: Boolean,
    disable: Boolean,
    startToday:{
      type: Boolean,
      required: false,
    },
    extendTime:{
      type: Boolean,
      default: false,
      required: false,
    },
    item:{
      type: Object,
      required: false
    }
  },
  data: () => ({
    time: '',
    timeFormatted: '',
    menu: false,
    selectedHours:0,
    required: [
      v => {
        if (!v || v.length < 1)
          return 'This is required';
        else if (!/^(0?[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/i.test(v))
          return 'Time format must be valid (24-hour format)';
        else return true;
      }
    ],
  }),

  computed: {
    computedTimeFormatted() {
      return this.formatTime(this.time);
    },

    allHours() {
      return Array.from({ length: 24 }, (_, i) => i);
    },
    allMinutes() {
       return Array.from({ length: 60 }, (_, i) => i);
    },
    
    allowedHours() {
      if(this.extendTime){
        if(this.item?.time_info)
        {
          console.log("time-info ",this.item);
          const now = new Date(this.item?.time_info?.deadline+" "+this.item?.time_info?.end_time);
          const currentHour = now.getHours();
          return Array.from({ length: 24 }, (_, i) => i).slice(currentHour+1);
        }
        else{
          const now = new Date(this.item?.deadline+" "+this.item?.end_time);
          const currentHour = now.getHours();
          return Array.from({ length: 24 }, (_, i) => i).slice(currentHour+1);
        }
        
      }
      else{
        const now = new Date();
        const currentHour = now.getHours();
        return Array.from({ length: 24 }, (_, i) => i).slice(currentHour);
      }
      
      
    },
    allowedMinutes() {
      
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      if (this.selectedHours == currentHour) {
        
        return Array.from({ length: 60 }, (_, i) => i).slice(currentMinute);
      }
       return Array.from({ length: 60 }, (_, i) => i);
    },
  },
  created() {
    this.getTimeInput();
  },

  watch: {
    timeInput: {
      handler: 'getTimeInput',
      immediate: true,
    },

    time: {
      handler: 'getTime',
      immediate: true,
    },

    timeFormatted(value) {
      if (value) {
        this.menu = false;
      }
    },

    menu(value) {
      if (value) {
        this.timeFormatted = '';
      }
    },
  },

  methods: {
    selectTimeData(){
      this.selectedHours = document.querySelector('.v-picker__title__btn').innerHTML
    },
    blurTime() {
      if (!this.disable) {
        this.time = this.parseTime(this.timeFormatted);
      }
    },
    // blurTime() {
    //   if (!this.disable) {
    //     this.time = this.parseTime(this.timeFormatted);
    //   }
    // },

    getTimeInput() {
      let that = this;
      if (that.timeInput) {
        that.time = that.parseTime(that.timeInput);
      }
    },

    getTime() {
      if (!this.time) {
        this.time = '';
      }
      this.timeFormatted = this.formatTime(this.time);
      this.$emit('getTime', {
        time: this.time,
      });
    },

    formatTime(time) {
      if (!time) return null;

      const [hours, minutes] = time.split(':');
      return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    },

    parseTime(time) {
      if (!time) return null;

      const [hours, minutes] = time.split(':');
      return `${parseInt(hours, 10).toString().padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    },
  }
}
</script>

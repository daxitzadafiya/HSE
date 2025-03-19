<template>
  <div>
    <div class="section-required-action">
      <b-row>
        <b-col cols="3" class="hse-document-badge-tab">
          <div class="label-item md-line-height bold-title">
            {{ $t('form.duration') }}
          </div>
          <v-badge
            :value="hover"
            right
            transition="slide-x-transition"
            class="hse-badge-icon"
          >
            <span slot="badge">{{ $t('form.duration') }} </span>
            <v-hover v-model="hover">
              <i class="fa fa-question-circle"></i>
            </v-hover>
          </v-badge>
        </b-col>
        <b-col cols="2">
          <!-- <div class="switch-component switch-required-action">
            <label class="left-text">{{ $t('form.day') }}</label>
            <v-switch
              v-model="durationData.is_duration"
              :label="$t('form.week')"
              class="right-text"
              inset
            />
          </div> -->
          <div class="switch-component switch-required-action">
            <label class="left-text">{{ $t('form.day') }}</label>
            <v-switch
              v-model="durationData.is_duration"
              :label="$t('form.week')"
              class="right-text"
              inset
              @click="changeDuration"
               :disabled="isDisabledDay"
            />
          </div>
        </b-col>
        <b-col cols="4" class="align-center ms-auto counter-btns d-flex">
          <v-btn class="mx-2 count-plus" fab dark @click="incrementDuration">
            <v-icon dark>mdi-plus</v-icon>
          </v-btn>
          <div class="quantity">{{ durationData.duration }}</div>
          <v-btn class="mx-2 count-minus" fab dark @click="decrementDuration">
            <v-icon dark>mdi-minus</v-icon>
          </v-btn>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
// import moment from "moment";
export default {
  name: 'Duration',
  props: {
    objectItem: {
      type: Object,
      required: true,
    },
    durationData: {
      type: Object,
      required: false,
    },
    isDisabledDay:{
      type: Boolean,
      required : true
    }
  },
  data: () => ({
    hover: false,
    // maxDuration:{},
    maxDurations: {
      Daily: 1,
      Weekly: 7,
      Monthly: 28,
      Yearly: 365,
      'Half-Yearly': 182,
      'Bi-Weekly': 15,
      Quarter: 84,
    },
    maxWeeklyDurations: {
      Daily: 1,
      Weekly: 1,
      Monthly: 4,
      Yearly: 51,
      'Half-Yearly': 26,
      'Bi-Weekly': 2,
      Quarter: 12,
    },
  }),
  methods: {
    changeDuration(){
            this.durationData.duration = 1; 
        },
        incrementDuration() {
            const { unit, duration } = this.durationData;
            if (!this.durationData.is_duration) {
                
                const maxDuration = this.maxDurations[unit];
                console.log("maxDuration",maxDuration);
                if (duration < maxDuration) {
                    this.durationData.duration++;
                }
            }else{

                const maxWeeklyDuration = this.maxWeeklyDurations[unit];
                console.log("maxWeeklyDuration",maxWeeklyDuration);
            if (duration < maxWeeklyDuration && this.durationData.is_duration == true) {
                this.durationData.duration++;
            }
            }

        },
        decrementDuration() {
            const { duration } = this.durationData;

            if (duration > 1) {
                this.durationData.duration--;
            }
        },
    },
    watch: {
        'durationData.unit': function () {
            this.durationData.duration = 1; 
        },
    },
}
</script>

<style scoped>
.count-plus {
  background-color: #87a53a !important;
}

.count-minus {
  background-color: #666768 !important;
}

.quantity {
  text-align: center;
  width: 30px;
  color: #9a9a9b;
}

.counter-btns button {
  width: 24px;
  height: 24px;
}
</style>
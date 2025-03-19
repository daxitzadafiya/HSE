<template>
    <div class="pt-5 mb-0">
      <b-row v-if="!deviationItem.is_prososial_action">
          <b-col cols="3">
            <div class="bold-title  md-line-height ">
              {{ $t('form.suggested_corrective_action') }}
            </div>
          </b-col>
          <b-col cols="4">
            <div class="input-wrap">
              <div class="switch-component default-question-mark">
                <label class="left-text deviation-title">{{ $t('form.none') }}</label>
                <v-switch
                  v-model="deviationItem.is_prososial_action"
                  :label="$t('form.activate')"
                  :readonly="!deviationItem.editPermission"
                  inset
                  class="right-text"
                />
              </div>
            </div>
          </b-col>
      </b-row>
      <div v-else class="section-connect-to section-connect-to-reminder mt-4">
        <div class="section-connect-to-label section-connect-to-label-reminder ">
          {{ $t('form.suggested_corrective_action') }}
        </div>
        <div class="switch-component switch-component-small reminder-type-switch default-question-mark">
          <label class="left-text">{{ $t('form.none') }}</label>
          <v-switch
            v-model="deviationItem.is_prososial_action"
            :label="$t('form.activate')"
            inset
            class="right-text"
            :readonly="!deviationItem.editPermission"
          />
        </div>
        <b-row class="pt-3 mt-2 ml-2 pr-3">
            <b-col cols="12">
                <div class="input-wrap">
                  <v-text-field
                    v-model="deviationItem.prososial_action"
                    :label="$t('form.suggested_corrective_action')"
                    :readonly="editMode"
                    :rules="required"
                    rows="3"
                    outlined
                    auto-grow
                  />
                </div>
          </b-col>
        </b-row>
      </div>
    </div>
</template>

  <script>
  export default {
    name: 'DeviationCorrective',

    props: {
        deviationItem: {
        type: Object,
        required: false,
      },
      editMode: {
        type: Boolean,
        required: false,
      },
    },

    data: () => ({
      required: [
        (v) => {
          if (!v || v.length < 1) return 'This is required'
          else return true
        },
      ],
    }),
    methods:{},
  }
  </script>
  <style scoped>
  .default-question-mark{
    max-width: 50px;
  }
  :deep(.switch-component .left-text){
    left: 27px;
  }
  :deep(.switch-component.switch-component-small){
    left: 185px;
  }
  :deep(.section-connect-to .section-connect-to-label.section-connect-to-label-reminder){
    width: 370px;
  }
  .deviation-title{
    left: 10px !important;
  }
  </style>

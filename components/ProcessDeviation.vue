<template>
    <div>
      <div class="manage-task">
        <b-row>
          <b-col cols="9" class="title-manage-task mb-3">
          <div class="title-manage-task" >
            {{ $t('title.progress_deviation') }}
          </div>
          </b-col>
      </b-row>
      <div class="manage-tast-border">
        <b-row class="mt-0">
              <b-col cols="3" class="ml-2">
                  <div class="bold-title md-line-height">
                    {{ $t('form.has_it_happened_before') }}
                 </div>
              </b-col>
        <b-col  cols="2" class="px-1">
          <div class="switch-component">
            <label class="left-text">{{ $t('form.no') }}</label>
            <v-switch
              v-model="deviationItem.is_happened_before"
              :label="$t('form.yes')"
              inset
              class="right-text"
            />
          </div>
        </b-col>
        </b-row>
      <b-row v-if="!deviationItem.is_corrective">
          <b-col cols="3">
            <div class="bold-title  md-line-height ml-2">
              {{ $t('form.corrective_actions') }}
            </div>
          </b-col>
          <b-col cols="4">
            <div class="input-wrap">
              <div class="switch-component default-question-mark">
                <label class="left-text">{{ $t('form.none') }}</label>
                <v-switch
                  v-model="deviationItem.is_corrective"
                  :label="$t('form.activate')"
                  inset
                  class="right-text"
                />
              </div>
            </div>
          </b-col>
      </b-row>
      <div v-else class="section-connect-to section-connect-to-reminder mt-4 action">
        <div class="section-connect-to-label section-connect-to-label-reminder">
            {{ $t('form.corrective_actions') }}
        </div>
        <div class="switch-component switch-component-small reminder-type-switch default-question-mark ml-14">
          <label class="left-text">{{ $t('form.none') }}</label>
          <v-switch
            v-model="deviationItem.is_corrective"
            :label="$t('form.activate')"
            inset
            class="right-text"
          />
        </div>
        <b-row class="pt-3 mt-2 m-2">
          <b-col cols="12">
                  <!-- <v-select
                    v-model="deviationItem.corrective_action"
                    :items="correctiveArray"
                    item-value="id"
                    item-text="name"
                    label="Corrective action"
                    outlined
                  /> -->
                  <v-text-field
                    v-model="deviationItem.corrective_action"
                    :items="deviationItem.prososial_action"
                    label="Corrective action"
                    class="new-department-input"
                    type="text"
                    outlined
                    :rules="required"
                />
          </b-col>
        </b-row>
      </div>
      <b-row v-if="!deviationItem.is_legalSpecifications">
          <b-col cols="3">
            <div class="bold-title  md-line-height ml-2">
              {{ $t('form.legal_specifications') }}
            </div>
          </b-col>
          <b-col cols="4">
            <div class="input-wrap">
              <div class="switch-component default-question-mark">
                <label class="left-text">{{ $t('form.none') }}</label>
                <v-switch
                  v-model="deviationItem.is_legalSpecifications"
                  :label="$t('form.activate')"
                  inset
                  class="right-text"
                />
              </div>
            </div>
          </b-col>
      </b-row>
      <div v-else class="section-connect-to section-connect-to-reminder mt-8 specify">
        <div class="section-connect-to-label section-connect-to-label-reminder">
            {{ $t('form.legal_specifications') }}
        </div>
        <div class="switch-component switch-component-small reminder-type-switch default-question-mark ml-13">
          <label class="left-text ml-3">{{ $t('form.none') }}</label>
          <v-switch
            v-model="deviationItem.is_legalSpecifications"
            :label="$t('form.activate')"
            inset
            class="right-text"
          />
        </div>
        <b-row class="pt-3 mt-2 m-2">
          <b-col cols="12">
            <v-text-field
                    v-model="deviationItem.specifications"
                    :label="$t('form.legal_specifications')"
                    class="new-department-input"
                    type="text"
                    :rules="required"
                    outlined
                />

          </b-col>
        </b-row>
      </div>
      </div>

    </div>
    </div>
</template>

  <script>
  export default {
    name: 'ProcessDeviation',
    components: {},
    props:{
        deviationItem:{
            type:Object,
            required:false
        }
    },
    data: () => ({
        correctiveArray:[],
         required: [
        (v) => {
          if (!v || v.length < 1) return 'This is required';
          else return true;
        },
      ],

    }),
  }
  </script>
  <style scoped>
  .manage-tast-border{
    border: 1px solid #E0E0E0;
    padding: 10px;
  }
  :deep(.action .section-connect-to-label.section-connect-to-label-reminder){
    width: 340px !important;
  }
  :deep(.specify .section-connect-to-label.section-connect-to-label-reminder){
    width: 338px !important;
  }
  :deep(.action .v-text-field__details){
    display: none !important;
  }
  :deep(.specify .v-text-field__details){
    display: none !important;
  }
</style>



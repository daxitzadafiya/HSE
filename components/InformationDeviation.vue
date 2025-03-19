<template>
    <div>
        <b-row v-if="!is_informationDeviation" >
      <b-col cols="4">
        <div class="bold-title md-line-height ">
          {{ $t('title.import_information_from_deviation') }}
        </div>
      </b-col>
      <b-col cols="4">
        <div class="input-wrap">
          <div class="switch-component default-question-mark">
            <label class="left-text">{{ $t('form.none') }}</label>
            <v-switch
              v-model="is_informationDeviation"
              :label="$t('form.active')"
              inset
              class="right-text"
            />
          </div>
        </div>
      </b-col>
    </b-row>
    <div v-else class="section-connect-to risk-info mt-10">
      <div class="section-connect-to-label section-connect-to-label-reminder">
        {{ $t('title.import_information_from_deviation') }}
      </div>
      <div class="switch-component switch-component-small default-question-mark">
        <label class="left-text">{{ $t('form.none') }}</label>
        <v-switch
          v-model="is_informationDeviation"
          :label="$t('form.active')"
          inset
          class="right-text"
        />
      </div>
      <v-container fluid >
      <b-row class="mt-1">
        <b-col v-for="item in riskElementSourceArray" :key="`item-${item.id}`" cols="6">
          <v-card
            outlined
          >
            <v-list-item class="p-0">
              <v-list-item-content class="p-3">
                <v-checkbox
                  v-model="chooseRiskElement"
                  :label="item.name"
                  :value="item.id"
                  :hide-details="true"
                  class="mt-0 pt-0"
                  @change="updateRiskElement(item)"
                />
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </b-col>
      </b-row>
    </v-container>
      </div>
    </div>
</template>
<script>
  export default {
    name: 'InformationDeviation',
    data: () => ({
        riskElementSourceArray:[{id:1,name:'Status'},{id:2,name:'Name'},{id:3,name:'Place'},{id:4,name:'Category'},],
        chooseRiskElement:[],
        is_informationDeviation:false,
    }),
    methods:{
        updateRiskElement(){}
    }
  }
</script>
<style scoped>
:deep(.section-connect-to .section-connect-to-label.section-connect-to-label-reminder){
  width: 425px;
  margin-bottom: 10px;
}
:deep(.switch-component.switch-component-small){
  left: 250px;
}
</style>

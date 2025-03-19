<template>
  <div>
    <b-row v-if="!is_information">
      <b-col cols="4">
        <div class="bold-title md-line-height">
          {{ $t('form.import_information_from_risk_analysis') && riskItemTitle }}
        </div>
      </b-col>
      <b-col cols="4">
        <div class="input-wrap">
          <div class="switch-component default-question-mark">
            <label class="left-text">{{ $t('form.none') }}</label>
            <v-switch
              v-model="is_information"
              :label="$t('form.active')"
              class="right-text"
              inset
            />
          </div>
        </div>
      </b-col>
    </b-row>
    <div v-else class="section-connect-to risk-info mt-10">
      <div class="section-connect-to-label section-connect-to-label-reminder">
        {{ $t('form.import_information_from_risk_analysis') && riskItemTitle }}
      </div>
      <div class="switch-component switch-component-small default-question-mark">
        <label class="left-text">{{ $t('form.none') }}</label>
        <v-switch
          v-model="is_information"
          :label="$t('form.active')"
          class="right-text"
          inset
        />
      </div>
        <div class="review-popup-table">
                <v-data-table
                  :headers="headersRiskElementArr"
                  :items="riskElementAnalysis"
                  class="elevation-1 review-table"
                  :items-per-page="15"
                  :single-expand="true"
                  :sort-by="['created_at']"
                  :sort-desc="[true, false]"
                  hide-default-footer
                  item-key="id"
                >
                  <template v-slot:top>
                    <v-toolbar flat>
                      <v-toolbar-title>{{$t('title.source_of_danger')}}</v-toolbar-title>
                    </v-toolbar>
                  </template>
                  <template v-slot:item.name="{ item }">
                    <v-checkbox
                    v-model="chooseName"
                    :label="item.name"
                    value="item"
                    :hide-details="true"
                    class="mt-0 pt-0"
                  />
                  </template>
                  <template v-slot:item.type="{ item }">
                    <v-checkbox
                    v-model="chooseType"
                    :label="item.type"
                    value="item"
                    :hide-details="true"
                    class="mt-0 pt-0"
                  />
                  </template>
                  <template v-slot:item.probability="{ item }">
                    <v-checkbox
                    v-model="chooseProbability"
                    :label="item.probability"
                    value="item"
                    :hide-details="true"
                    class="mt-0 pt-0"
                  />
                  </template>
                  <template v-slot:item.consequence="{ item }">
                    <v-checkbox
                    v-model="chooseConsequence"
                    :label="item.consequence"
                    value="item"
                    :hide-details="true"
                    class="mt-0 pt-0"
                  />
                  </template>
                  <template v-slot:item.colorCode="{ item }">
                    <v-checkbox
                    v-model="chooseColorCode"
                    :label="item.colorCode ? item.colorCode : item.risk_level"
                    value="item"
                    :hide-details="true"
                    class="mt-0 pt-0"
                  />
                  </template>
                  <template v-slot:item.description_resolve="{ item }">
                    <v-checkbox
                    v-model="chooseCommet"
                    :label="item.comment"
                    value="item"
                    :hide-details="true"
                    class="mt-0 pt-0"
                  />
                  </template>
                </v-data-table>
              </div>
    </div>
  </div>
</template>
  <script>
  // import {_} from 'vue-underscore';

  export default {
    name: "InformationRiskAnalysis",
    props:{
      infoPopup:{
        type:Boolean,
        required: false,
      },
      riskItemTitle:{
        type:String,
        required: false,
      },
     riskElementAnalysis:{
      type: Array,
      required: false,
    },
    },
    computed: {
      headersRiskElementArr() {
        return [
          { text: this.translateCol('name'), value: 'name', align: 'center'},
          { text: this.translateCol('type'), value: 'type', align: 'center'},
          { text: this.translateCol('probability'), value: 'probability', align: 'center'},
          { text: this.translateCol('consequence'), value: 'consequence', align: 'center'},
          { text: this.translateCol('color_code'), value: 'colorCode', align: 'center'},
          { text: this.translateCol('comment'), value: 'description_resolve', align: 'center'},
        ]
      },
    },
    created(){
          this.is_information=this.infoPopup
    },
    data: () => ({
      // riskElementAnalysis:[{id:1,name:'Cooking Area',type:'Report',probability:'High',consequence:'Low',colorCode:'2',description_resolve:'Lorem Ipsum'},{id:2,name:'Are holes are dangerous ?',type:'Report',probability:'High',consequence:'Moderated',colorCode:'8',description_resolve:'Take care of holes now.'}],
      is_information:false,
      chooseName:['item'],
      chooseType:['item'],
      chooseProbability:['item'],
      chooseConsequence:['item'],
      chooseColorCode:['item'],
      chooseCommet:['item'],
    }),
    methods:{
      translateCol (colName) {
        return this.$i18n.t('column.' + colName);
      },
    }
  }
  </script>
  <style scoped>
.switch-component.switch-component-small{
  left: 280px;
  background: #fff;
    padding-right: 20px;
}
.review-popup-table{
  margin: 33px 10px;
  border: 1px solid #E0E0E0;
}
</style>
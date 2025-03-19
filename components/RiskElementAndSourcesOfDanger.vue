<template>
  <div>
    <div v-if="editedIndex === -1" class="manage-task">
      <b-row>
        <b-col cols="9" class="title-manage-task">
        <div class="title-manage-task" >
          {{ $t('title.risk_element') }}
        </div>
        </b-col>
        <b-col cols="3">
          <div class="field-selection field-search">
                      <v-text-field
                        v-model="search"
                        append-icon="search"
                        :label="$t('setting.search')"
                        outlined
                        @input="searchValue"
                      >
                    <template v-slot:append>
                      <img src="../assets/images/icon/magnifier.png" class="search-icon-cust">
                    </template>
                  </v-text-field> 
                    </div>
        </b-col>
    </b-row>
      <v-container fluid>
        <b-row>
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
    <div class="manage-task mb-6">
      <b-row v-if="editedIndex === -1">
        <b-col cols="3">
          <div class="title-manage-task">
            {{ $t('title.add_source_of_danger') }}
          </div>
      </b-col>
        <b-col cols="3">
          <!-- <v-btn class="btn-create-task mt-2" outlined @click="addMoreRiskElementAnalysis">
            {{ $t('button.add_new') }}
          </v-btn> -->
          <div role="button"  class="plus-icon text-center " @click="addMoreRiskElementAnalysis">+</div>

        </b-col>
      </b-row>
      <v-data-table
        v-if="riskElementAnalysis.length > 0"
        :headers="headersRiskElementArr"
        outlined
        :items="riskElementAnalysis"
        class="elevation-1 table-task header-task"
        :items-per-page="15"
        :single-expand="true"
        hide-default-footer
        :sort-desc="[true, false]"
      >
        <template v-slot:item.name="{ item }">
          <v-text-field v-model="item.name" :rules="required" :disabled="editedIndex > -1" />
        </template>
        <template v-slot:item.type="{ item }">
          <v-text-field v-model="item.type" disabled />
        </template>
        <template v-slot:item.actions="{ index,item }">
          
          <v-icon small class="file-icon"> mdi-file </v-icon>
          <v-icon small @click="DeleteSourceOfDanger(index,item)"> mdi-delete </v-icon>          
        </template>
        <template v-slot:item.probability="{ item }">
          <v-select
            v-model="item.probability"
            :items="probabilityArr"
            item-text="name"
            item-value="value"
            :rules="required"
            :disabled="editedIndex > -1"
            @change="updateColorCode(item)"
          />
        </template>
        <template v-slot:item.consequence="{ item }">
          <v-select
            v-model="item.consequence"
            :items="consequenceArr"
            item-text="name"
            item-value="value"
            :rules="required"
            :disabled="editedIndex > -1"
            @change="updateColorCode(item)"
          />
        </template>
        <template v-slot:item.colorCode="{ item }">
          <v-chip v-if="item.colorCode" :color="item.colorCode" outlined>{{ item.point }}</v-chip>
        </template>
        <template v-slot:item.description_resolve="{ item }">
          <v-text-field v-model="item.description_resolve" :disabled="editedIndex > -1" />
        </template>
      </v-data-table>
      
    </div>
  </div>
</template>
<script>
  import {_} from 'vue-underscore';

  export default {
    props: [
      'item', 'editedIndex', 'riskElementSourceArray',
    ],
    data: function () {
      return {
        required: [
          v => {
            if (!v || v.length < 1)
              return 'This is required';
            else return true;
          }
        ],
        search:'',
        bkpriskElementSourceArray:[],
        riskElement: {
          id: '',
          name: '',
          description_default: '',
          type: '',
          type_id: '',
          probability: '',
          probabilityName: '',
          consequence: '',
          consequenceName: '',
          code: '',
          colorCode: '',
          colorName: '',
          point: '',
          description_resolve: '',
          newlyCreated: false,
          risk_element_source_id: '',
        },
        riskElementDefault: {
          id: '',
          name: '',
          description_default: '',
          type: '',
          type_id: '',
          probability: '',
          probabilityName: '',
          consequence: '',
          consequenceName: '',
          code: '',
          colorCode: '',
          colorName: '',
          point: '',
          description_resolve: '',
          newlyCreated: false,
          risk_element_source_id: '',
        },
        chooseRiskElement: [],

        probabilityArr: [
          {
            value: "1",
            name: "Low"
          },
          {
            value: "2",
            name: "Moderate"
          },
          {
            value: "3",
            name: "High"
          },
          {
            value: "4",
            name: "Very high"
          }
        ],
        consequenceArr: [
          {
            value: "1",
            name: "Low"
          },
          {
            value: "2",
            name: "Moderate"
          },
          {
            value: "3",
            name: "High"
          },
          {
            value: "4",
            name: "Very high"
          }
        ],
        colorCodeArr: [
          {
            min: 0,
            max: 0,
            value: "black",
            name: "None",
          },
          {
            min: 1,
            max: 3,
            value: "green",
            name: "Green",
          },
          {
            min: 4,
            max: 10,
            value: "#f0e509",
            name: "Yellow"
          },
          {
            min: 11,
            max: 15,
            value: "orange",
            name: "Orange"
          },
          {
            min: 16,
            max: 16,
            value: "red",
            name: "Red"
          }
        ],
        riskElementAnalysis: [],
        riskId: '',
      };
    },

    computed: {
      headersRiskElementArr() {
        return [
          { text: this.translateCol('name'), value: 'name', align: 'center', width: '18%'},
          { text: this.translateCol('type'), value: 'type', align: 'center', width: '16%'},
          { text: this.translateCol('probability'), value: 'probability', align: 'center', width: '12%'},
          { text: this.translateCol('consequence'), value: 'consequence', align: 'center', width: '12%'},
          { text: this.translateCol('color_code'), value: 'colorCode', align: 'center', width: '10%'},
          { text: this.translateCol('comment'), value: 'description_resolve', align: 'center', width: '20%'},
          { text: this.translateCol('actions'), value: 'actions', align: 'center', width: '16%', sortable: false },
        ]
      },
    },

    mounted() {
      if (this.$route.query.risk) {
        this.riskId = this.$route.query.risk;
      }
      this.bkpriskElementSourceArray=this.riskElementSourceArray
    },

    watch: {
      item: {
        handler: 'getItem',
        immediate: true,
      },

      riskElementAnalysis: {
        handler: 'getSourceOfDangerArray',
        immediate: true,
      },

      riskElementSourceArray(value) {
        if (value) {
          this.autoAddRiskToSource();
        }
      },
    },

    methods: {
      searchValue(e)
      {
        if (e) {  
          this.riskElementSourceArray=this.bkpriskElementSourceArray.filter(x => {
                return x.name.toLowerCase().indexOf(e.toLowerCase()) != -1
            })
        } else {
          this.riskElementSourceArray=this.bkpriskElementSourceArray
        }
      },
      autoAddRiskToSource() {
        let that = this;
        let query = Object.assign({}, that.$route.query);
        delete query.risk;
        that.$router.replace({ query });
        if (this.riskId) {
          this.riskId = parseInt(that.riskId);
          let risk = _.findWhere(that.riskElementSourceArray, {id: this.riskId});
          if (risk) {
            that.chooseRiskElement.push(this.riskId);
            that.updateRiskElement(risk);
          }
        }
      },

      translateCol (colName) {
        return this.$i18n.t('column.' + colName);
      },

      getSourceOfDangerArray() {
        this.$emit('getSourceOfDangerArray', {
          riskElementAnalysis: this.riskElementAnalysis,
        });
      },

      getItem() {
        var that = this;
        if (that.editedIndex > -1) {
          that.riskElementAnalysis = _.each(that.item.elements, function (element) {
            var point = element.probability * element.consequence;
            _.each(that.colorCodeArr, function(color) {
              if (point >= color.min && point <= color.max) {
                element.colorCode = color.value;
                element.colorName = color.name;
                element.point = point;
              }
            });
          });
        } else {
          that.riskElementAnalysis = [];
          that.chooseRiskElement = [];
        }
      },
      DeleteSourceOfDanger(index){
        // this.chooseRiskElement.splice(index,1)
        this.riskElementAnalysis.splice(index,1)
      },

      updateColorCode(riskElement) {
        var that = this;
        if (riskElement.probability && riskElement.consequence) {
          var point = riskElement.probability * riskElement.consequence;
          _.each(that.colorCodeArr, function(item) {
            if (point >= item.min && point <= item.max) {
              riskElement.colorCode = item.value;
              riskElement.colorName = item.name;
              riskElement.point = point;
            }
          });
        }
      },

      addMoreRiskElementAnalysis() {
        this.formDirty = true;
        if (this.riskElementAnalysis.length > 0) {
          this.riskElement.id = this.riskElementAnalysis[this.riskElementAnalysis.length - 1].id + 1;
        } else {
          this.riskElement.id = 1;
        }
        this.riskElement.type = "Made by user";
        this.riskElement.newlyCreated = true;
        // this.riskElementSourceArray.push(this.riskElement);
        this.riskElementAnalysis.push(this.riskElement);
        this.riskElement = Object.assign({}, this.riskElementDefault);
      },

      updateRiskElement(risk_element_source) {
        var that = this;
        if (that.riskElementAnalysis.length === 0) {
          that.riskElement = Object.assign({}, risk_element_source);
          that.riskElement.id = 1;
          that.riskElement.type = "Made by admin";
          that.riskElement.newlyCreated = false;
          that.riskElement.risk_element_source_id = risk_element_source.id;
          that.riskElement.type_id = risk_element_source.id;
          that.riskElementAnalysis.push(that.riskElement);
          that.riskElement = Object.assign({}, that.riskElementDefault);
        } else {
          _.each(that.chooseRiskElement, function (item) {
            if (_.isUndefined(_.findWhere(that.riskElementAnalysis, {risk_element_source_id: item}))) {
              that.riskElement = Object.assign({}, risk_element_source);
              that.riskElement.id = that.riskElementAnalysis[that.riskElementAnalysis.length - 1].id + 1;
              that.riskElement.type = "Made by admin";
              that.riskElement.newlyCreated = false;
              that.riskElement.risk_element_source_id = risk_element_source.id;
              that.riskElement.type_id = risk_element_source.id;
              that.riskElementAnalysis.push(that.riskElement);
              that.riskElement = Object.assign({}, that.riskElementDefault);
            }
          });
        }
        that.riskElementAnalysis = _.reject(that.riskElementAnalysis, function(item_riskElementAnalysis){
          return !item_riskElementAnalysis.newlyCreated && _.indexOf(that.chooseRiskElement, item_riskElementAnalysis.risk_element_source_id) === -1;
        });
      },
    }
  };
</script>
<style scoped>
.plus-icon {
  width: 25px;
  height: 25px;
  background-color: #85a33d;
  margin-left: -40px;
  border-radius: 100%;
  font-size: 30px;
  line-height: 0.9;
  color: #fff;
}
:deep(.v-text-field--outlined>.v-input__control>.v-input__slot){
  min-height: 50px !important;
}
.file-icon{
  font-size: 14px;
}
</style>

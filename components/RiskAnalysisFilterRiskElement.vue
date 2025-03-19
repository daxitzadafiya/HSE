<template>
  <div class="manage-task">
    <b-row>
      <b-col cols="6">
        <div class="title-manage-task pl-3">
          {{ $t('title.risk_element') }}
        </div>
      </b-col>
      <b-col cols="6" class="text-right">
        <div class="d-inline-flex">
          <v-text-field
            v-if="isSearch && isSearchInput"
            v-model="searchText"
            append-icon="search"
            :label="$t('setting.search')"
            outlined
            @input="searchValue"
          >
                    <template v-slot:append>
                      <img src="../assets/images/icon/magnifier.png" class="search-icon-cust">
                    </template>
                  </v-text-field> 
          <v-select
            v-if="isSearch && !isSearchInput"
            v-model="search"
            :items="categoriesArray"
            item-text="name"
            item-value="id"
            :label="$t('form.search_category')"
            outlined
            @change="filterByCategory(search)"
          />
          <div>
            <v-icon v-if="isSearch && isSearchInput" class="ml-3 mt-4" @click="isSearchInput = !isSearchInput">
              mdi-close
            </v-icon>
            <v-icon v-if="isSearch && !isSearchInput" class="ml-3 mt-4" @click="isSearchInput = !isSearchInput">
              mdi-magnify
            </v-icon>
            <v-icon class="ml-2 mt-4" @click="isSearch = !isSearch">
              mdi-tune
            </v-icon>
          </div>
        </div>
      </b-col>
    </b-row>
    <v-container fluid>
      <b-row>
        <b-col v-for="item in riskElementArray" :key="`item-${item.id}`" cols="6">
          <v-card outlined>
            <v-list-item>
              <v-list-item-content class="p-0">
                <v-checkbox
                  v-model="chooseRiskElement"
                  :label="item.name"
                  :value="item.id"
                  multiple
                  class="pl-3"
                  @change="getList(chooseRiskElement)"
                />
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </b-col>
      </b-row>
    </v-container>
  </div>
</template>
<script>
  import {_} from 'vue-underscore';

  export default {
    props: {
      objectItem: {
        type: Object,
        required: true,
      },
    },
    data: () => ({
      listArray: [],
      riskElementArray: [],
      chooseRiskElement: '',
      search: '',
      searchText: '',
      isSearch: false,
      isSearchInput: false,
      categoriesArray: [],
    }),

    watch: {
      objectItem(value) {
        if (value) {
          this.chooseRiskElement = '';
        }
      },

      // item: {
      //   handler: 'getItem',
      //   immediate: true,
      // },

      // riskElementAnalysis: {
      //   handler: 'getSourceOfDangerArray',
      //   immediate: true,
      // },

      // riskElementSourceArray(value) {
      //   if (value) {
      //     this.autoAddRiskToSource();
      //   }
      // },
    },

    mounted() {
      // if (this.$route.query.risk) {
      //   this.riskId = this.$route.query.risk;
      // }
      // this.bkpriskElementSourceArray = this.riskElementSourceArray;
    

      let that = this;
      // list categories
        that.$store.dispatch('categoriesV2/index', {type: 'risk'}).then(result => {
          that.categoriesArray = result.data;
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }
          that.$nuxt.$loading.finish();
        });

      that.$nextTick(() => {
        that.$nuxt.$loading.start();
        // list Risk element source
        that.$store.dispatch('objects/index', {objectType: 'risk'}).then(result => {
          that.listArray = _.filter(result.data, function (item) {
            return !item.is_template && item.risk_element_show_in_risk_analysis;
          });
          that.riskElementArray = that.limitRiskElementArray(_.clone(that.listArray));
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_risk_element_view'));
          }
          that.$nuxt.$loading.finish();
        });

        
      });
    },

    methods: {
      limitRiskElementArray(array) {
        if (array.length > 6) {
          return array.slice(0,6);
        } else {
          return array;
        }
      },

      searchValue(e) {
        if (e) {
          this.riskElementArray = this.listArray.filter(x => {
            return x.name.toLowerCase().indexOf(e.toLowerCase()) !== -1;
          });
          this.limitRiskElementArray(this.riskElementArray);
        } else {
          this.riskElementArray = this.limitRiskElementArray(this.listArray);
        }
      },

      filterByCategory(search) {
        this.riskElementArray = _.filter(this.listArray, function (item) {
          return item.category_id === search;
        });
        this.limitRiskElementArray(this.riskElementArray);
      },

      getList(list) {
        this.$emit('updateRiskElement', {
          list: list,
        });
      },

      // searchValue(e) {
      //   if (e) {
      //     this.riskElementSourceArray = this.bkpriskElementSourceArray.filter(x => {
      //       return x.name.toLowerCase().indexOf(e.toLowerCase()) != -1;
      //     });
      //   } else {
      //     this.riskElementSourceArray = this.bkpriskElementSourceArray;
      //   }
      // },

      // autoAddRiskToSource() {
      //   let that = this;
      //   let query = Object.assign({}, that.$route.query);
      //   delete query.risk;
      //   that.$router.replace({query});
      //   if (this.riskId) {
      //     this.riskId = parseInt(that.riskId);
      //     let risk = _.findWhere(that.riskElementSourceArray, {id: this.riskId});
      //     if (risk) {
      //       that.chooseRiskElement.push(this.riskId);
      //       that.updateRiskElement(risk);
      //     }
      //   }
      // },

      // getSourceOfDangerArray() {
      //   this.$emit('getSourceOfDangerArray', {
      //     riskElementAnalysis: this.riskElementAnalysis,
      //   });
      // },

      // getItem() {
      //   var that = this;
      //   if (that.editedIndex > -1) {
      //     that.riskElementAnalysis = _.each(that.item.elements, function (element) {
      //       var point = element.probability * element.consequence;
      //       _.each(that.colorCodeArr, function (color) {
      //         if (point >= color.min && point <= color.max) {
      //           element.colorCode = color.value;
      //           element.colorName = color.name;
      //           element.point = point;
      //         }
      //       });
      //     });
      //   } else {
      //     that.riskElementAnalysis = [];
      //     that.chooseRiskElement = [];
      //   }
      // },

      // DeleteSourceOfDanger(index) {
      //   // this.chooseRiskElement.splice(index,1)
      //   this.riskElementAnalysis.splice(index, 1)
      // },

      // addMoreRiskElementAnalysis() {
      //   this.formDirty = true;
      //   if (this.riskElementAnalysis.length > 0) {
      //     this.riskElement.id = this.riskElementAnalysis[this.riskElementAnalysis.length - 1].id + 1;
      //   } else {
      //     this.riskElement.id = 1;
      //   }
      //   this.riskElement.type = "Made by user";
      //   this.riskElement.newlyCreated = true;
      //   // this.riskElementSourceArray.push(this.riskElement);
      //   this.riskElementAnalysis.push(this.riskElement);
      //   this.riskElement = Object.assign({}, this.riskElementDefault);
      // },

      // updateRiskElement(risk_element_source) {
      //   let that = this;
      //   if (that.riskElementAnalysis.length === 0) {
      //     that.riskElement = Object.assign({}, risk_element_source);
      //     that.riskElement.id = 1;
      //     that.riskElement.type = "Report";
      //     that.riskElement.newlyCreated = false;
      //     that.riskElement.risk_element_source_id = risk_element_source.id;
      //     that.riskElement.type_id = risk_element_source.id;
      //     that.riskElementAnalysis.push(that.riskElement);
      //     that.riskElement = Object.assign({}, that.riskElementDefault);
      //   } else {
      //     _.each(that.chooseRiskElement, function (item) {
      //       if (_.isUndefined(_.findWhere(that.riskElementAnalysis, {risk_element_source_id: item}))) {
      //         that.riskElement = Object.assign({}, risk_element_source);
      //         that.riskElement.id = that.riskElementAnalysis[that.riskElementAnalysis.length - 1].id + 1;
      //         that.riskElement.type = "Report";
      //         that.riskElement.newlyCreated = false;
      //         that.riskElement.risk_element_source_id = risk_element_source.id;
      //         that.riskElement.type_id = risk_element_source.id;
      //         that.riskElementAnalysis.push(that.riskElement);
      //         that.riskElement = Object.assign({}, that.riskElementDefault);
      //       }
      //     });
      //   }
      //   that.riskElementAnalysis = _.reject(that.riskElementAnalysis, function (item_riskElementAnalysis) {
      //     return !item_riskElementAnalysis.newlyCreated && _.indexOf(that.chooseRiskElement, item_riskElementAnalysis.risk_element_source_id) === -1;
      //   });
      // },
    }
  };
</script>
<style scoped>
</style>

<template>
  <div>
    <v-dialog v-model="openPopup" max-width="1125px" persistent>
      <v-card>
        <v-card-text>
          <div class="popup-header text-center">
            CONNECT TO OBJECT
          </div>
          <b-row>
            <b-col>
              <div class="input-wrap industry-select-input-wrap">
                <MultipleSelection
                  :selected-items-input="functionSelectedArray"
                  :label="'Function'"
                  :item-text="'name'"
                  :item-value="'value'"
                  :list-option-input="functionArray"
                  @getSelectedItems="handleFilterFunction"
                />
              </div>
            </b-col>
            <b-col>
              <div class="input-wrap industry-select-input-wrap">
                <MultipleSelection
                  :selected-items-input="categorySelectedArray"
                  :label="'Category'"
                  :item-text="'name'"
                  :item-value="'id'"
                  :list-option-input="categoryArray"
                  @getSelectedItems="handleFilterCategory"
                />
              </div>
            </b-col>
            <b-col>
              <div class="input-wrap industry-select-input-wrap">
                <MultipleSelection
                  :selected-items-input="objectSelectedArray"
                  :label="'Object'"
                  :item-text="'objectName'"
                  :item-value="'objectID'"
                  :list-option-input="objectArray"
                  @getSelectedItems="handleFilterObject"
                />
              </div>
            </b-col>
          </b-row>
          <v-data-table
            :headers="connectToObjectTableHeaders"
            hide-default-footer
            :items="connectToArray"
            class="elevation-1 hse-table"
          >
            <template v-slot:item.name="{ item }">
              {{ item.name }}
            </template>

            <template v-slot:item.source="{ item }">
              {{ item.source }}
            </template>

            <template v-slot:item.category="{ item }">
              {{ item.category }}
            </template>

            <template v-slot:item.connectedBy="{ item }">
              {{ item.connectedBy }}
            </template>

            <template v-slot:item.added="{ item }">
              {{ item.added }}
            </template>
            <template v-slot:item.connectDate="{ item }">
              {{ moment(item.connectDate).format('DD.MM.YYYY') }}
            </template>

            <template v-slot:item.actions="{ item }">
              <v-icon small @click="handleRemoveConnectToItem(item)"> mdi-delete </v-icon>
            </template>
            <template v-slot:no-data>
              {{ $t('table.no_data') }}
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions class="popup-footer">
          <v-spacer />
          <v-btn class="btn-cancel" text @click="close">
            {{ $t('button.cancel') }}
          </v-btn>
          <v-btn
            class="btn-save"
            @click="save"
          >
            {{ $t('button.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// import ConnectToObjectTable from './ConnectToObjectTable.vue'
import {_} from 'vue-underscore';
import cookies from "js-cookie";
import MultipleSelection from './MultipleSelection';
import moment from "moment";

export default {
  components: { MultipleSelection },
  props: {
    openPopup: Boolean,
    isDataFill: {
        type: Boolean,
        default: false
    },
    connectToArrayInput: {
      type: Array,
      required: false
    }
  },
  data: () => ({
    username: cookies.get('username'),
    required: [(v) => !!v || 'This is required'],
    connectToArray: [],
    connectItem: {
      id: '',
      company_id: '',
      added_by: '',
      object_id: '',
      document_id: '',
      connect_to_source: '',
      source_id: '',
      created_at: '',
      objectName: '',
      categoryName: '',
      categoryID: '',
      addedByUser: '',
      connectedByUser: ''
    },
    defaultConnectItem: {
      id: '',
      company_id: '',
      added_by: '',
      object_id: '',
      document_id: '',
      connect_to_source: '',
      source_id: '',
      created_at: '',
      objectName: '',
      categoryName: '',
      categoryID: '',
      addedByUser: '',
      connectedByUser: ''
    },
    functionArray: [
      { name: 'Goal', value: 'goal'},
      { name: 'Task', value: 'task'},
      { name: 'Routine', value: 'routine'},
      { name: 'Instruction', value: 'instruction'},
      { name: 'Risk element', value: 'risk'},
      { name: 'Checklist', value: 'checklist'},
      { name: 'Deviation', value: 'deviation'}
    ],
    functionSelectedArray: [],
    categoryArray: [],
    categorySelectedArray: [],
    objectArray: [],
    objectSelectedArray: [],
  }),

  computed: {
    connectToObjectTableHeaders() {
      return [
        {text: this.translateCol('name'), value: 'objectName'},
        {text: this.translateCol('source'), value: 'connect_to_source'},
        {text: this.translateCol('category'), value: 'categoryName'},
        {text: this.translateCol('added_by'), value: 'addedByUser'},
        {text: this.translateCol('connected_by'), value: 'connectedByUser'},
        {text: this.translateCol('connected_date'), value: 'created_at'},
        {text: this.translateCol('actions'), value: 'actions', align: 'center'},
      ];
    },
  },

  watch: {
    openPopup() {
        if (!this.isDataFill){
            this.categorySelectedArray = []
            this.functionSelectedArray = [];
            this.objectSelectedArray = [];
        }
    },
    functionSelectedArray() {
      // this.getObjects();
      this.getCategories();
    },
    categorySelectedArray() {
      this.getObjects();
    },
    objectSelectedArray() {
      this.handleUpdateConnectToArray();
    },
    // connectToArray() {
    //   this.getObjects();
    // },
    connectToArrayInput: {
      handler: 'getConnectToArrayInput',
      immediate: true,
    },
  },

  methods: {
    async getConnectToArrayInput() {
        let objectArrayData = [];
        let functionData = [];
      if (this.connectToArrayInput?.length > 0) {
         this.connectToArrayInput.forEach((item) => {
              functionData.push(item.connect_to_source);
              this.categorySelectedArray.push(item?.categoryID);
              objectArrayData.push(item.source_id);
          });
          functionData = [...new Set(functionData)];
          this.functionSelectedArray = functionData;
          await this.getCategories();
          await this.getObjects();
          this.objectSelectedArray = objectArrayData;
      }
    },

    // setObjectSelectedArray() {
    //   const that = this;
    //   that.objectArray = _.filter(that.objectArray, function (item) {
    //     return _.findWhere(that.connectToArray, {source_id: item.objectID}) === undefined;
    //   });
    // },

    async handleFilterFunction(value) {
      this.functionSelectedArray = await value.selectedItemsOutput;
    },

    async handleFilterCategory(value) {
      this.categorySelectedArray = await value.selectedItemsOutput;
    },

    async handleFilterObject(value) {
      this.objectSelectedArray = await value.selectedItemsOutput;
    },

    translateCol (colName) {
      return this.$i18n.t('column.' + colName);
    },

    close() {
      this.$emit('closePopup');
    },

    save() {
      this.pushData();
      this.close();
    },

    pushData() {
      this.$emit('getConnectToArray', this.connectToArray);
    },

    handleUpdateConnectToArray() {
      const that = this;
        that.connectToArray = [];
      _.each(that.objectSelectedArray, function (selectObjectID) {
        if (!_.findWhere(that.connectToArray, {source_id: selectObjectID})) {
          const item = _.findWhere(that.objectArray, {objectID: selectObjectID});
          if(item){
              that.connectItem.objectName = item.objectName;
              that.connectItem = {
                  id: item.id,
                  connect_to_source: item.objectType,
                  source_id: item.objectID,
                  objectName: item.objectName || 'N/A',
                  categoryName: item.categoryName || 'N/A',
                  categoryID: item.categoryID,
                  addedByUser: item.addedByFirstName + ' ' + item.addedByLastName || 'N/A',
                  connectedByUser: that.username || 'N/A',
                  created_at: moment().format('DD.MM.YYYY')
              };
              that.connectToArray.push(that.connectItem);
              that.connectItem = _.clone(that.defaultConnectItem);
          }
        }
      });
      // that.setObjectSelectedArray();
    },

    handleRemoveConnectToItem(connectToItem) {
      const that = this;
      that.connectToArray = _.filter(that.connectToArray, function(item) {
        return item.source_id !== connectToItem.source_id;
      });
      that.objectSelectedArray = _.filter(that.objectSelectedArray, function(item) {
        return item !== connectToItem.source_id;
      });
    },

    async getObjects() {
      const that = this;
      if (that.functionSelectedArray.length > 0) {
        await that.$store.dispatch('connectToObject/getObjects', {typeArray: that.functionSelectedArray, categoryArray: that.categorySelectedArray}).then(result => {
          // that.objectArray = result.data;
          //   console.log(that.objectSelectedArray);
            that.objectArray = result.data;
          // that.objectArray = _.filter(result.data, function (item) {
          //   return _.findWhere(that.connectToArray, {source_id: item.objectID}) === undefined;
          // });
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      } else {
        that.objectArray = [];
      }
    },

    async getCategories() {
      const that = this;
      if (that.functionSelectedArray.length > 0) {
        await that.$store.dispatch('categoriesV2/index', {typeArray: this.functionSelectedArray}).then(result => {
          that.categoryArray = result.data;
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      } else {
        that.categoryArray = [];
      }
    }
  }
};
</script>

<style scoped>

</style>


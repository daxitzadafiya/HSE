<template>
  <div>
    <div v-if="!isOpenConnectToObject" class="row align-center risk-area">
      <div class="col-3">
        <div class="bold-title">{{ $t('title.connect_to_object') }}</div>
      </div>
      <div class="col-4">
        <div class="input-wrap">
          <div class="switch-component default-question-mark">
            <label class="left-text">{{ $t('form.none') }}</label>
            <v-switch
              v-model="isOpenConnectToObject"
              :label="`Add`"
              class="right-text"
              inset
            />
          </div>
        </div>
      </div>
    </div>

    <div v-else class="section-connect-to section-connect-to-reminder mt-5">
      <div class="section-connect-to-label section-connect-to-label-reminder bold-title">
        {{ $t('title.connect_to_object') }}
      </div>
        <div class="switch-component switch-component-small reminder-type-switch default-question-mark">
            <label class="left-text">{{ $t('form.none') }}</label>
            <v-switch
                    v-model="isOpenConnectToObject"
                    :label="$t('form.activate')"
                    class="right-text"
                    inset
            />
            <v-icon 
                    class="icon-plus-circle ml-4 primary-color"
                    @click="handleOpenObjectModal">
                mdi-plus-circle
            </v-icon>
        </div>

      <v-data-table
        :headers="connectToObjectTableHeaders"
        hide-default-footer
        :items="connectToArray"
        class="elevation-1 connect-to-object-table pt-3 mt-3"
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

        <template v-slot:no-data>
          {{ $t('table.no_data') }}
        </template>
      </v-data-table>
    </div>
    <ConnectToObjectModal
      :open-popup="openPopup"
      :connectToArrayInput="connectToArray"
      @closePopup="handleCloseConnectToModal"
      @getConnectToArray="getConnectToArray"
      :isDataFill="isDataFill"
    />

<!--    <connect-to-object-modal-->
<!--      ref="connectToObject"-->
<!--      :connect-to-object-table-data="connectToObjectTableProp"-->
<!--      :connect-to-object-table-header="connectToObjectTableHeaders"-->
<!--      :connectToObjectObject="object"-->
<!--      :connectToObjectCategory="category"-->
<!--      :connectToObjectFunction="ctoFunction"-->
<!--      @editConnectToObject="editConnectToObject"-->
<!--      @addConnectToObject="addConnectToObject"-->
<!--      @ctoClose="ctoClose"-->
<!--      @deleteCto="deleteCTOData"-->
<!--      :class="connectToObjectTableProp.length <= 0 ? '' : 'cto-modal'"-->
<!--    />-->
  </div>
</template>

<script>
    import ConnectToObjectModal from './ConnectToObjectModal.vue';
    export default {
  components: { ConnectToObjectModal },
  props: {
    connectToArrayInput: {
      type: Array,
      required: false
    },
      isEmptyData: {
        type: Boolean,
          default: false
      }
  },

created(){
    //
  },
  data() {
    return {
      switchStatus: false,
      openPopup: false,
      isDataFill: false,
      connectToArray: [],
      isOpenConnectToObject:false
    }
  },
  computed: {
    connectToObjectTableHeaders() {
      return [
        {text: this.translateCol('name'), value: 'objectName'},
        {text: this.translateCol('source'), value: 'connect_to_source'},
        {text: this.translateCol('category'), value: 'categoryName'},
        {text: this.translateCol('added_by'), value: 'addedByUser'},
        {text: this.translateCol('connected_by'), value: 'connectedByUser'},
        {text: this.translateCol('connected_date'), value: 'created_at'},
      ];
    },
  },
  watch: {
    connectToArrayInput: {
      handler: 'getConnectToArrayInput',
      immediate: true,
    },
      isEmptyData(){
          this.isOpenConnectToObject &&  (this.isOpenConnectToObject = false)
      }
  },

  methods: {
      handleOpenObjectModal(){
         this.isDataFill = !!this.connectToArray.length;
         this.openPopup = !this.openPopup
      },
    getConnectToArrayInput() {
      if (this.connectToArrayInput) {
        this.connectToArray = this.connectToArrayInput;
      }else{
          this.connectToArray = [];
      }
    },

    translateCol (colName) {
      return this.$i18n.t('column.' + colName);
    },

    // handleChangeSwitch(value) {
    //   if (value) {
    //     this.openPopup = true;
    //   }
    // },

    handleCloseConnectToModal() {
      this.openPopup = false;
    },

    getConnectToArray(value) {
      this.connectToArray = [ ...value ];
      this.$emit('getConnectToArray', value);
    }
  },
}
</script>


<style scoped>
.switch-component-small.reminder-type-switch {
  left: 140px !important;
  z-index: 5;
}

.primary-color{
    color: #87a53a;
}

.section-connect-to .section-connect-to-label.section-connect-to-label-reminder {
  z-index: 2;
  color: unset;
  width: 370px;
}

:deep(.connect-to-object-table .v-data-table__wrapper) {
  padding-top: 30px;
}

.icon-plus-circle {
  z-index: 2;
  right: -101px;
  top: -53px;
  font-size: 28px !important;
  border: 6px solid white !important;
}

.cto-modal {
  border: 1px solid #9e9e9e;
  border-radius: 4px;
  padding: 8px;
  position: relative;
  /* border-top: 0; */
}

/*.section-connect-to {*/
/*  border: 0;*/
/*}*/
.default-question-mark{
  max-width: 50px;
}
</style>

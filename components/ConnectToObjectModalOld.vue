<template>
  <div>
    <connect-to-object-table
      v-if="connectToObjectTableData.length<=0"
      :ctoTableHeaders="ctoTableHeaders"
      :ctoTableItems="connectToObjectTableData"
      @ctoEditItem="ctoEditItem"
      @ctoDeleteItem="ctoDeleteItem"
      :hasEditOption="true"
    />

    <v-form ref="form" class="mt-0" v-model="valid"  lazy-validation>
    <v-dialog
      v-model="ctoDialog"
      persistent
      max-width="1125px"
      max-height="80%"
      class="object-modal"
    >
      <!-- <v-dialog ref="form" class="mt-0" v-model="valid" max-width="1400px"  lazy-validation> -->
          <v-card-title class="bg-white">
            <span class="text-h5 font-weight-light mx-auto py-11 modal-theme"
              >{{ ctoFormTitle }}
            </span>
          </v-card-title>

          <v-card>
            <v-card-text>
              <v-row class="px-7 justify-between">
                <v-col class="input-wrap connect-to-object">
                <v-select
                  :items="ctoFunction"
                  item-text="id"
                  item-value="name"
                  v-model="sourceName"
                  @change="onSourceNameChange"
                  :label="$t('column.function')"
                  class="select-box"
                  outlined
                  :rules="required"
                >
                </v-select>
              </v-col>
              <v-col class="connect-to-object">
                <!-- <select-box :selectItems="category" @getSelectedValue="getCategory"
                                    label="CATEGORY" :hasSearchIcon="true" /> -->

                <MultipleSelection
                  class="input-wrap custom-min-height-auto"
                  :selected-items-input="categoryIds"
                  :label="$t('column.category_title')"
                  :list-option-input="category"
                  @getSelectedItems="getCategory"
                  itemText="name"
                  itemValue="id"
                  :disabled="!isFuncationSel"

                />
              </v-col>
              <v-col class="connect-to-object">
                <!-- <select-box :selectItems="object" @getSelectedValue="getSelectedObject"
                                    label="OBJECT NAME" :hasSearchIcon="true" /> -->
                <MultipleSelection
                  :selected-items-input="objectIds"
                  :label="$t('column.object_name')"
                  item-text="'OBJECT NAME'"
                  :list-option-input="CtoObject"
                  itemText="objectName"
                  itemValue="objectID"
                  @getSelectedItems="getSelectedObject"
                  :requestRequired="isFuncationSel?true:false"
                  :disabled="!isFuncationSel"

                />
              </v-col>
              <v-col
                cols="12"
                class="border rounded-lg"
                v-if="connectToObjectTableData.length"
              >
                <connect-to-object-table
                  :ctoTableHeaders="ctoTableHeaders"
                  :ctoTableItems="connectToObjectTableData"
                  @ctoEditItem="ctoEditItem"
                  @ctoDeleteItem="ctoDeleteItem"
                  :hasEditOption="false"
                />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <button
              data-v-3ced4048=""
              type="button"
              text
              @click="closeCtoModal"
              class="btn-cancel v-btn v-btn--text theme--light v-size--default"
            >
              <span class="v-btn__content"> {{ $t('button.cancel') }} </span>
            </button>
            <button
              data-v-3ced4048=""
              type="button"
              text
              @click="save"
              class="
                btn-save
                v-btn v-btn--is-elevated v-btn--has-bg
                theme--light
                v-size--default
              "
            >
              <span class="v-btn__content">{{ $t('button.save') }}</span>
            </button>
          </v-card-actions>
        </v-card>
      <!-- </v-dialog> -->

    </v-dialog>
  </v-form>

    <v-dialog v-model="ctoDialogDelete" max-width="500px">
      <v-card class="dialog-delete">
        <v-card-title
          class="
            text-h5
            confirm-delete-title
            d-flex
            justify-center
            align-center
          "
          >{{ $t('title.confirm_delete') }}</v-card-title
        >
        <div class="confirm-delete-text d-flex justify-center align-center">
          {{ $t('message.are_you_sure_to_delete_this_object') }}
        </div>
        <v-card-actions>
          <v-spacer />
          <v-btn class="btn-cancel" text @click="ctoCloseDelete">
            {{ $t('button.cancel') }}
          </v-btn>
          <v-btn class="btn-save" @click="ctoDeleteItemConfirm">
            {{ $t('button.ok') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- dialog confirm delete -->
    <!-- <v-dialog v-model="ctoDialogDelete" class="cto-delete" max-width="500px">
      <v-card class="dialog-delete">
        <v-card-text>
          <div class="text-center confirm-delete-title">
            {{ $t('title.confirm_delete') }}
          </div>
          <div class="confirm-delete-text">
            {{ $t('message.are_you_sure_to_delete_this_object') }}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="btn-cancel" text @click="ctoCloseDelete">
            {{ $t('button.cancel') }}
          </v-btn>
          <v-btn class="btn-save" @click="ctoDeleteItemConfirm">
            {{ $t('button.ok') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->
  </div>
</template>

<script>
import ConnectToObjectTable from './ConnectToObjectTableOld.vue'
import MultipleSelection from './MultipleSelection'
import api from '~/apis'

export default {
  props: {
    connectToObjectTableData: {
      type: [Object, Array],
    },
    connectToObjectTableHeader: {
      type: [Object, Array],
    },
    connectToObjectObject: {
      type: [Object, Array],
    },

    connectToObjectFunction: {
      type: [Object, Array],
    },
    isconnect: {
      require: false,
      type: Boolean,
    },
    editedItem:{
      type:Object
    },
    tableData:{
      type:[Object,Array],
    }
  },
  components: { ConnectToObjectTable, MultipleSelection },
  data: () => ({
    required: [(v) => !!v || 'This is required'],
    sourceName: '',
    categoryIds: [],
    objectIds: [],
    ctoDeleteItemIndex: '',
    valid: true,
    object: [],
    category: [],
    ctoFunction: [],
    ctoModalSelectCategory: [],
    ctoModalSelectObject: [],
    ctoTableHeaders: [],
    ctoTableItems: [],
    CtoObject:[],
    ctoDialog: false,
    isFuncationSel:false,
    ctoDialogDelete: false,
    ctoTableData: [],
    ctoEditedIndex: -1,
    form: {
      source: '',
      source_id: '',
      category: [],
      object_id: [],
      connectToArray: [],
    },
    connectToArray: [],
    // editedItem: {
    //   connectToArray: [
    //     {
    //       company_id: 0,
    //       added_by: 0,
    //       document_id: '0',
    //       connect_to_source: '',
    //       source_id: 0,
    //       updated_at: '',
    //       created_at: '',
    //       id: 17,
    //     },
    //   ],
    // },
    // defaultItem: {
    //   connectToArray: [
    //     {
    //       company_id: 0,
    //       added_by: 0,
    //       document_id: '0',
    //       connect_to_source: '',
    //       source_id: 0,
    //       updated_at: '',
    //       created_at: '',
    //       id: 17,
    //     },
    //     {
    //       object_type: '',
    //       object_id: 0,
    //     },
    //   ],
    // },
  }),

  computed: {
    ctoFormTitle() {
      return this.ctoEditedIndex === -1
        ? this.translateCol('connect_to_a_object')
        : this.translateCol('edit_connect_to_a_object')
    },
  },

  watch: {
    ctoDialog(val) {
      val || this.ctoClose()
    },
    ctoDialogDelete(val) {
      val || this.ctoCloseDelete()
    },
    sourceName() {
      this.filterDataBaseOnFun()
    },
    async categoryIds() {
      // this.filterDataBaseOnFun()
      await this.getObjectByCategories()
    },
    objectIds() {
      if (this.ctoEditedIndex > -1) this.generatePayloadForEdit()
    },
  },

  created() {
    this.ctoTableHeaders = this.connectToObjectTableHeader
    this.ctoTableItems = this.connectToObjectTableData
    this.object = this.connectToObjectObject
    this.category = this.connectToObjectCategory
    this.ctoFunction = this.connectToObjectFunction
    this.getCategories()
    this.getObjectData()
    this.ctoDialog = this.isconnect
    // this.connectToObjectTableData=this.tableData?this.tableData:[{}]
  },

  methods: {
    translateCol(colName) {
      return this.$i18n.t('title.' + colName)
    },
    onSourceNameChange() {
      this.isFuncationSel=true
      this.objectIds = []
      this.categoryIds = []
    },
    getCategoryIdFromName(name) {
      this.categoryIds = []
      this.category.map((item) => {
        if (name == item.name) {
          this.categoryIds.push(item.id)
        }
      })
    },

    async filterDataBaseOnFun() {
      // await this.getSourceNameFromId(this.form.source_id)
      // this.objectIds = []
      await this.getObjectData()
      await this.getCategories()
    },

    getObjectByCategories() {
      let that = this
      that.$nuxt.$loading.start()
      var tempObjectData = []
       if (that.categoryIds.length <= 0 ) {
        that.CtoObject = []
        that.CtoObject=that.object
      } else {

        that.categoryIds.map((item) => {
          for (let i = 0; i < that.object.length; i++) {
            if (item == that.object[i].objectCategory) {
              tempObjectData.push(that.object[i])
            }
          }
        })
      that.CtoObject = []
      that.CtoObject = tempObjectData
      }
      that.$nuxt.$loading.finish()
    },

    getObjectData() {
      let that = this
      // var sourceName = that.form.connectToArray.source
      //   ? that.form.connectToArray.source.toLowerCase()
      //   : that.form.connectToArray.source
      try {
        that.$nuxt.$loading.start()
        api.connectToObject
          .getAllObject({ typeArray: [this.sourceName] })
          .then((res) => {
            if (res.status == 200) {
              that.object = res.data.data
              that.CtoObject=that.object
              that.$nuxt.$loading.finish()
            } else {
              that.$toaster.error('something went wrong.')
            }
          })
      } catch (error) {
        console.log(error)
        that.$toaster.error('not fetched object data successfully')
        that.$nuxt.$loading.finish()
      }
    },

    // get categories by function name
    getCategories() {
      let that = this
      that.$nuxt.$loading.start()
      that.$store
        .dispatch('categoriesV2/index', { type: that.sourceName })
        .then((result) => {
          that.category = result.data
          that.$nuxt.$loading.finish()
        })
        .catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          console.log(error)
          }
          that.$nuxt.$loading.finish()
        })
    },

    reset() {
      this.form.source = ''
      this.form.source_id = ''
      this.categoryIds = []
      this.form.object_id = []
      this.form.connectToArray = []
    },

    getSourceNameFromId(id) {
      this.ctoFunction.map((item) => {
        if (item.id == id)
          this.form.connectToArray = {
            source: item.name,
            source_id: item.id,
          }
      })
    },

    async getCategory(value) {
      this.categoryIds = await value.selectedItemsOutput
    },

    generatePayloadForEdit() {
      this.connectToArray = []
      // this.connectToArray.push(this.form)
      for (let i = 0; i < this.objectIds.length; i++) {
        this.connectToArray.push({
          object_type: this.sourceName,
          object_id: this.objectIds[i],
        })
      }
    },

    // Create CTO payload with object id and source name
    // createCTOPayload() {},

    async getSelectedObject(value) {
      // alert(this.objectIds + ',' + value.selectedItemsOutput)
      this.objectIds = await value.selectedItemsOutput
      this.connectToArray = []
      for (let i = 0; i < this.objectIds.length; i++) {
        this.connectToArray.push({
          object_type: this.sourceName,
          object_id: this.objectIds[i],
        })
      }
      await this.getSourceNameFromId(this.form.source_id)
      // for (const i in value) {
      //   alert(typeof value[i])
      //   if (Object.hasOwnProperty.call(value, i)) {

      //   }
      // }
      // console.log('Selected object')
      // this.form.object_id = value.selectedItemsOutput
      // this.createCTOPayload(value)
    },

    getSelectedValue(items) {
      console.log(items)
    },

    closeCtoModal() {
      this.ctoDialog = false
      this.$parent.tableObject = false
      this.$emit('closeModal', this.ctoDialog)

      this.reset()
    },

    ctoEditItem(item) {
      this.objectIds = []
      this.ctoEditedIndex = this.connectToObjectTableData.indexOf(item)
      this.form = Object.assign({}, item)
      this.sourceName = item.connect_to_source
      this.getCategoryIdFromName(item.categoryName)
      this.objectIds.push(item.source_id)
      this.ctoDialog = true
    },

    ctoDeleteItem(item) {
      this.ctoDeleteItemIndex = item
      // this.ctoEditedIndex = this.ctoTableData.indexOf(item)
      // this.ctoEditedItem = Object.assign({}, item)
      this.ctoDialogDelete = true
    },

    ctoDeleteItemConfirm() {
      // this.ctoTableData.splice(this.ctoEditedIndex, 1)
      this.$emit('deleteCto', this.ctoDeleteItemIndex)
      this.ctoCloseDelete()
    },

    ctoClose() {
      this.ctoDialog = false
      this.$nextTick(() => {
        this.ctoEditedItem = Object.assign({}, this.ctoDefaultItem)
        this.ctoEditedIndex = -1
      })
      this.$emit('ctoClose')
    },

    ctoCloseDelete() {
      this.ctoDialogDelete = false
      this.$nextTick(() => {
        this.ctoEditedItem = Object.assign({}, this.ctoDefaultItem)
        this.ctoEditedIndex = -1
      })
    },

    resetFromValue() {
      this.connectToArray = []
      this.objectIds = []
      this.categoryIds = []
      this.form = []
      this.sourceName = ''
    },
   async saveConnectToObject(type, id) {
      try {
        // console.log("connectToObjectTableData",this.connectToObjectTableData);
        // console.log("connectToArray",this.connectToArray);

        if (this.connectToObjectTableData.length + this.connectToArray.length <= 5)
         await api.connectToObject.store(type, id, {
            connectToArray: this.connectToArray,
          })
        else
          this.$toaster.error(this.$i18n.t('message.connect_to_object_limit'))
      } catch (error) {
        this.$toaster.error(this.$i18n.t('message.fail_connect_to_object'))
        console.log(error)
      }
    },
    async save() {
      let that = this
      // var tempData = that.form
      if (that.$refs.form.validate()){
        if (that.ctoEditedIndex > -1) {
          await that.$emit('editConnectToObject', that.connectToArray)
          that.resetFromValue()
          // Object.assign(
          //     that.ctoTableData[that.ctoEditedIndex],
          //     that.ctoEditedItem
          // )
        } else {
          // that.ctoTableData.push(that.ctoEditedItem)
          if (this.isconnect) {
            await that.saveConnectToObject('document', that.editedItem.id)
          }
          await that.$emit('addConnectToObject', that.connectToArray)

          that.resetFromValue()
        }
        that.connectToArray = []
        that.ctoClose()
      }
    },
  },
}
</script>

<style scoped>
.elevation-1 >>> .v-data-footer {
  display: none;
}

.v-data-table-header .text-start span {
  font-size: 22px !important;
}

.v-card__actions {
  padding: 16px !important;
}

.modal-theme {
  color: #00000099;
}

/* .v-card__text {
  padding-left: 0px !important;
  padding-right: 0px !important;
} */

.v-text-field--outlined >>> .v-input__control > .v-input__slot {
  min-height: 68px;
}
@media (min-width: 992px) {
  .v-card__text {
    height: 400px !important;
  }
}

@media (min-width: 1200px) {
  .v-card__text {
    height: 450px !important;
  }
}

@media (min-width: 1400px) {
  .v-card__text {
    height: 65vh !important;
  }
  .cto-delete {
    height: 20% !important;
  }
}
</style>

<style>
/* .v-text-field--outlined fieldset {
    border-bottom: 0px !important;
    border: 2px solid rgba(0, 0, 0, 0.2) !important;
    border-radius: 8px 8px !important;
}

.v-menu__content {
    max-height: 304px;
    min-width: 371px;
    top: 223px !important;
    left: 343px;
    transform-origin: left top;
    z-index: 206;
    border: 2px solid rgba(0, 0, 0, 0.2);
    border-radius: 0px 0px 8px 8px !important;
    box-shadow: none !important;
    border-top: 0px !important;
} */
:deep(.connect-to-object .select-box .v-input__control){
  width: 375px !important;
}
</style>

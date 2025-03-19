<template>
  <div>
    <v-dialog
      v-model="openPopup"
      scrollable
      max-width="1125px"
      persistent
    >
      <v-card>
<!--        <v-card-title class="text-h5 justify-content-center text-uppercase">-->
<!--          {{ $t('title.review_risk_element') }}-->
<!--        </v-card-title>-->
        <v-card-text>
          <div class="popup-header text-center">
            {{ $t('title.review_risk_element') }}
          </div>
          <div class="review-popup">
            <div class="review-popup-table normal-table">
              <!-- Name -->
              <div class="info-block w-50">
                <div class="label-item">
                  {{ $t('form.name') }}:
                </div>
                <div class="info-item">
                  {{ editedItem.name }}
                </div>
<!--                <div v-else class="input-wrap w-100">-->
<!--                  <v-text-field-->
<!--                    v-model="editedItem.name"-->
<!--                    :rules="required"-->
<!--                    outlined-->
<!--                  />-->
<!--                </div>-->
              </div>

              <!-- Source -->
              <div class="info-block w-50">
                <div class="label-item">
                  {{ $t('form.source') }}:
                </div>
                <div class="info-item">
                  <span>
                    {{ $t('form.risk_element') }}
                  </span>
                </div>
              </div>

              <!-- Added by -->
              <div class="info-block w-50">
                <div class="label-item">
                  {{ $t('form.added_by') }}:
                </div>
                <div class="info-item">
                  {{ editedItem.addedByName }}
                </div>
              </div>

              <!-- Category -->
              <div class="info-block w-50">
                <div class="label-item">
                  {{ $t('form.category') }}:
                </div>
                <div class="info-item">
                  {{ editedItem.categoryName }}
                </div>
<!--                <div v-else class="w-100">-->
<!--                  <Category-->
<!--                    :object-item="editedItem"-->
<!--                    :type-category="'risk'"-->
<!--                    @getNewCategory="getNewCategory"-->
<!--                  />-->
<!--                </div>-->
              </div>

              <!-- View -->
              <div class="info-block w-50">
                <div class="label-item">
                  {{ $t('form.view') }}:
                </div>
                <div class="info-item">
                  <span v-if="editedItem.is_shared">{{ $t('form.shared') }}</span>
                  <span v-else>{{ $t('form.personal') }}</span>
                </div>
              </div>

              <!-- Number of time used -->
              <div class="info-block w-50">
                <div class="label-item">
                  {{ $t('form.number_of_times_used') }}:
                </div>
                <div class="info-item">
                  {{ editedItem.number_used_time }}
                </div>
              </div>

              <!-- Image -->
              <div class="info-block w-100">
                <div class="label-item">
                  {{ $t('form.image') }}:
                </div>
                <div class="info-item">
                  <v-icon
                    :class="editedItem.hasImage ? 'icon-custom image' : 'icon-custom image img-gray-scale'"
                    @click="viewImage"
                  >
                    mdi-image
                  </v-icon>
                </div>
              </div>
            </div>

            <!-- Connected To -->
              <v-data-table 
               v-if="roleUser != 'manager' || connectToObject.length > 0 && !viewPopup"
               :headers="connectToObjectTableHeaders" :items="connectToObject" 
               class="elevation-1 review-table review-popup-table mt-5"
               :items-per-page="15"
               :single-expand="true" 
               :sort-by="['created_at']"
               :sort-desc="[true, false]"
               hide-default-footer>
           <template slot="top">
               <v-toolbar flat>
                   <v-toolbar-title>
                       {{ $t('form.connected_to') }}
                   </v-toolbar-title>
<!--                   <div v-if="checkAdmin || checkCreator">-->
<!--                       <div role="button"-->
<!--                               class="plus-icon text-center"-->
<!--                            @click="is_connect = !is_connect">+-->
<!--                       </div>-->
<!--                   </div>-->
               </v-toolbar>
           </template>
           <template v-slot:item.connected_date="{ item }">
               <span class="ml-4">
                   {{ moment(item.connected_date).format('DD-MM-YYYY') }}
               </span>
           </template>
           <template v-slot:item.actions="{ item }">
               <v-icon small title="View" @click="handleObjectOpen(item)">mdi-eye</v-icon>
           </template>
         <!--                  <template v-slot:header.actions="{ header }"></template>-->
         </v-data-table>
           
            <connect-to-object-modal
                v-if="is_connect"
               :isconnect="true"
               :editedItem="editedItem"
               ref="connectToObject"
               :connect-to-object-table-data="connectToObject"
               :tableData="connectToObject"
               :connect-to-array-input="connectToObject"
               :connect-to-object-table-header="connectToObjectTableHeaders"
               :connectToObjectObject="object"
               :connectToObjectFunction="ctoFunction"
               :connectToObjectCategory="category"
               :class="connectToObjectTableProp.length <= 0 ? '' : 'cto-modal'"
               @editConnectToObject="editConnectToObject"
               @addConnectToObject="addConnectToObject"
               @deleteCto="deleteCTOData"
               :openPopup="is_connect"
               @getConnectToArray="getConnectToArray"
               @closePopup="is_connect = false"
            ></connect-to-object-modal>   
            
            
            <GoalReviewPopup 
                v-if="objectEditItem.type == 'goal'"
                :open-popup="isObjectOpen" 
                :object-item="objectEditItem"
                @closePopup="isObjectOpen = !isObjectOpen" 
            ></GoalReviewPopup>

        <TaskReviewPopup 
                v-if="objectEditItem.type == 'task'"
                :open-popup="isObjectOpen"
                :object-item="objectEditItem"
                @closePopup="isObjectOpen = !isObjectOpen" 
        ></TaskReviewPopup>

        <ReviewRoutinePopup 
                v-if="objectEditItem.type == 'routine'"
                :open-popup="isObjectOpen"
                :document-item="objectEditItem"
                @closePopup="isObjectOpen = !isObjectOpen" 
        ></ReviewRoutinePopup>

        <InstructionReviewPopup 
                v-if="objectEditItem.type == 'instruction'"
                :open-popup="isObjectOpen"
                :object-item="objectEditItem"
                @closePopup="isObjectOpen = !isObjectOpen"
        ></InstructionReviewPopup>

        <RiskAnalysisReviewPopup 
                v-if="objectEditItem.type == 'risk'"
                :open-popup="isObjectOpen"
                :object-item="objectEditItem"
                @closePopup="isObjectOpen = !isObjectOpen" 
        ></RiskAnalysisReviewPopup>

        <ChecklistTable 
                v-if="objectEditItem.type == 'checklist'"
                :open-popup="isObjectOpen" 
                :document-item="objectEditItem"
                @closePopup="isObjectOpen = !isObjectOpen" 
        ></ChecklistTable>

        <ReviewDeviation 
                v-if="objectEditItem.type == 'deviation'"
                :open-popup="isObjectOpen"
                :deviation-item="objectEditItem"
                @closePopup="isObjectOpen = !isObjectOpen" 
        ></ReviewDeviation>


            <!-- Risk analysis using this risk element -->
            <div v-if="editedItem.number_used_time > 0" class="review-popup-table">
              <v-data-table
                :headers="computedHeaders"
                :items="editedItem.riskAnalysisArray"
                class="elevation-1 review-table"
                :items-per-page="15"
                :single-expand="true"
                :sort-by="['created_at']"
                :sort-desc="[true, false]"
                hide-default-footer
              >
                <template v-slot:top>
                  <v-toolbar flat>
                    <v-toolbar-title>
                      {{ $t('form.this_element_use_which_risk_analysis') }}
                    </v-toolbar-title>
                  </v-toolbar>
                </template>
                <template v-slot:item.reported_by="{ item }">
                  {{ item.firstName }} {{ item.lastName }}
                </template>
                <template v-slot:item.date="{ item }">
                  <v-chip outlined label class="green">
                    {{ moment(item.created_at).format('DD.MM.YYYY') }}
                  </v-chip>
                </template>
                <template v-slot:item.status="{ item }">
                  <v-chip
                    v-if="item.status === 'new'"
                    class="ma-2 status-label-custom pending"
                    label
                  >
                    {{ $t('form.new') }}
                  </v-chip>
                  <v-chip
                    v-else-if="item.status === 'pending'"
                    class="ma-2 status-label-custom pending"
                    label
                  >
                    {{ $t('form.pending') }}
                  </v-chip>
                  <v-chip
                    v-else-if="item.status === 'ongoing'"
                    class="ma-2 status-label-custom ongoing"
                    label
                  >
                    {{ $t('form.ongoing') }}
                  </v-chip>
                  <v-chip
                    v-else-if="item.status === 'completed'"
                    class="ma-2 status-label-custom completed"
                    label
                  >
                    {{ $t('form.completed') }}
                  </v-chip>
                  <v-chip
                    v-else-if="item.status === 'closed'"
                    class="ma-2 status-label-custom approved"
                    label
                  >
                    {{ $t('form.closed') }}
                  </v-chip>
                </template>
                <template v-slot:no-data>
                  {{ $t('table.no_data') }}
                </template>
              </v-data-table>
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="popup-footer">
          <v-spacer />
          <v-btn class="btn-cancel" text @click="close">
            {{ $t('button.cancel') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <ViewImagePopup
      v-if="openViewImagePopup"
      :open-popup="openViewImagePopup"
      :object-item="editedImageItem"
      @closePopup="openViewImagePopup = !openViewImagePopup"
    />
  </div>
</template>

<script>
  // import CategoryInReviewPopup from "./CategoryInReviewPopup";
import ConnectToObjectModal from './ConnectToObjectModal.vue'
import cookies from "js-cookie";
import {_} from 'vue-underscore';
import api from '~/apis'
import ViewImagePopup from "./ViewImagePopup";
import GoalReviewPopup from "./GoalReviewPopup";
import TaskReviewPopup from "./TaskReviewPopup";
import ReviewRoutinePopup from "./ReviewRoutinePopup";
import InstructionReviewPopup from "./InstructionReviewPopup";
import RiskAnalysisReviewPopup from "./RiskAnalysisReviewPopup";
import ReviewDeviation from "./ReviewDeviation";
import ChecklistTable from "./ChecklistTable";
  import moment from 'moment';

  export default {
    name: "RiskElementReviewPopup",
    components: {
      ViewImagePopup,
      ConnectToObjectModal,
      ChecklistTable,
      ReviewDeviation,
      RiskAnalysisReviewPopup,
      InstructionReviewPopup,
      ReviewRoutinePopup,
      TaskReviewPopup,
      GoalReviewPopup
      // Category: CategoryInReviewPopup,
    },
    props: {
      openPopup: {
        type: Boolean,
        required: true,
      },
      viewPopup: {
        type: Boolean,
        required: false,
     },
      objectItem: {
        type: Object,
        required: true,
      },
      categoriesArray: {
        type: Array,
        required: false,
      },
      predefinedLinkArray: {
        type: Array,
        required: false,
      }
    },
    data: () => ({
    isObjectOpen : false,
    isOnlyView : false,
    objectEditItem : {},
    isEdit: false,
    roleUser: cookies.get('roleUser'),
    is_connect: false,
    object: [],
    category: [],
    connectToObjectTableProp: [],
      connectToObject: [],
      checkAdmin: cookies.get('checkAdmin'),
      valid: true,
      hover: false,
      checkCreator: false,
      required: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else return true;
        }
      ],
      editedItem: {},
      openViewImagePopup: false,
      editedImageItem: null,
      // isEdit: false,
      ctoFunction: [
      { id: 'Task', name: 'task' },
      { id: 'Goal', name: 'goal' },
      { id: 'Routine', name: 'routine' },
      { id: 'Instruction', name: 'instruction' },
      { id: 'Risk element source', name: 'risk' },
      { id: 'Checklist', name: 'checklist' },
      { id: 'Attachment', name: 'attachment' },
      { id: 'Document', name: 'document' },
      { id: 'Contact', name: 'contact' },
      { id: 'Deviation', name: 'deviation' },
    ],
    }),

    computed: {
      headers() {
        return [
          {text: this.translateCol('name'), value: 'name', align: 'left'},
          {text: this.translateCol('category'), value: 'categoryName', align: 'center'},
          {text: this.translateCol('reported_by'), value: 'reported_by', align: 'center'},
          {text: this.translateCol('responsible'), value: 'responsibleName', align: 'center'},
          {text: this.translateCol('date'), value: 'date', align: 'center'},
          {text: this.translateCol('status'), value: 'status', align: 'center'},
        ];
      },

      connectToObjectTableHeaders() {
      return [
          { text: this.translateCol('name'), value: 'objectName', },
          { text: this.translateCol('source'), value: 'connect_to_source' },
          { text: this.translateCol('category'), value: 'categoryName' },
          { text: this.translateCol('added_by'), value: 'addedByUser' },
          { text: this.translateCol('connected_by'), value: 'connectedByUser' },
          { text: this.translateCol('connected_date'), value: 'created_at' },
          { text: this.translateCol('actions'), value: 'actions', align: 'center', sortable: false, }
      ]
    },

      computedHeaders() {
        return this.headers;
      },
    },

    watch: {
      openPopup(value) {
        if (value) {
          this.getObject({type:'risk', objectID: this.objectItem.id});
          this.viewItem(this.objectItem);
        }
      },
    },

    created() {},

    methods: {
     deleteCTOData(id) {
              // console.log(id);
              let that = this
              try {
                api.connectToObject.delete(id).then((res) => {
                  console.log(res)
                  that.$toaster.success('connect to object data deleted')
                  that.getObject(this.editedItem)
                  if (that.documentItem) {
                    that.fetchConnectToObjectById(that.documentItem.id)
                    that.editItem(that.documentItem)
                  }
                })
              } catch (error) {
                that.$toaster.error('connect to object data not deleted')
                console.log(error)
              }
              // this.$emit('deleteCto', id)
            },
        
    handleObjectOpen(item) {
          this.objectEditItem = {
            'id':item.source_id,
            'type': item.connect_to_source,
          };
          this.isObjectOpen = true;
          this.isOnlyView = true;
      },
    editConnectToObject(payload) {
      console.log(payload)
    },
    async addConnectToObject(payload) {
      this.connectToArray = payload
      this.resetConnectToObjectFrom()
      this.connectToObjectFrom.connectToArray.push(payload.connectToArray)
      this.connectToObjectFrom.object_id = payload.object_id
      await this.getObject(this.editedItem)
    },


    getConnectToArray (data) {
        this.connectToObject = [...data];
      },

      async getObject (item) {
          this.connectToObject = [];
          await this.$store.dispatch('connectToObject/getByObject', item).then((result) => {
              let respo = result.data;
              if (respo.length > 0) {
                  respo.forEach((el) => {
                      this.connectToObject.push({
                          id: el.id,
                          connect_to_source: el.connect_to_source,
                          objectName: el.objectName || 'N/A',
                          categoryName: el.categoryName || 'N/A',
                          addedByUser: el?.addedByUser || 'N/A',
                          connectedByUser: el.connectedByUser || 'N/A',
                          created_at: moment(el.connected_date).format('DD.MM.YYYY'),
                          categoryID: el.categoryID,
                          source_id: el.source_id,
                      });
                  });
              } else {
                  this.connectToObject = [];
              }
          }).catch((error) => {
              console.log(error);
          });
      },


      viewItem(item) {
        let that = this;
        // that.formDirty = false;
        that.$nuxt.$loading.start();
        that.$store.dispatch('objects/show', item.id).then(result => {
          that.editedItem = Object.assign({}, result.data);
          that.checkCreator = _.contains(result.data.role, 'creator');
          that.responsibleName = result.data.responsible ? result.data.responsible['employeeName'] : {};
          that.editedItem.responsible_employee_array = that.editedItem.responsible ? JSON.parse(that.editedItem.responsible['employee_array']) : [];
          // that.editedItem.historyArray = _.sortBy(result.data.history, function(o) { return o.updated_at; });
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response?.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_risk_element_view_detail'));
          }
          that.$nuxt.$loading.finish();
        });
      },

      viewImage() {
        if (this.editedItem.hasImage) {
          this.openViewImagePopup = !this.openViewImagePopup;
          this.editedImageItem = this.editedItem.imageUrl;
        }
      },

      translateCol (colName) {
        return this.$i18n.t('column.' + colName);
      },

      getNewCategory(value) {
        this.editedItem.category_id = value.newCategoryId;
      },

      reloadList() {
        this.$emit('reloadList');
      },

      close() {
        // this.isEdit = false;
        if (this.openPopup) {
          this.$emit('closePopup');
        }
      },
    },
  };
</script>

<style scoped>
.plus-icon-gray {
  width: 25px;
  height: 25px;
  background-color: #9f9f9f;
  margin-left: 10px;
  border-radius: 100%;
  font-size: 25px;
  line-height: 25px;
  color: #fff;
}
.plus-icon {
  width: 25px;
  height: 25px;
  background-color: #85a33d;
  margin-left: 10px;
  border-radius: 100%;
  font-size: 25px;
  line-height: 25px;
  color: #fff;
}

.section-connect-to .section-connect-to-label.section-connect-to-label-reminder {
  z-index: 2;
  color: unset;
  width: 140px;
}

:deep(.connect-to-object-table .v-data-table__wrapper) {
  padding-top: 30px;
}

.icon-plus-circle {
  z-index: 2;
  right: 5rem;
  font-size: 28px !important;
  border: 6px solid white !important;
}
.primary-color{
    color: #87a53a;
}
</style>

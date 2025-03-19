<template>
    <div>
      <v-dialog v-model="openPopup" scrollable max-width="1125px" persistent>
        <v-card>
          <v-card-title class="text-h5 justify-content-center popup-header">
            <span >
              {{ $t('title.reminder_edit') }}
            </span>
          </v-card-title>
          <v-card-text>
            <div class="review-popup">
              <div class="review-popup-table normal-table">
                  <div class="info-block w-50 align-center">
                    <div class="label-item">{{ $t('form.name') }}:</div>
                    <div class="input-wrap w-100">
                      <v-text-field
                        v-model="editedItem.name"
                        :rules="required"
                        outlined
                      />
                    </div>
                  </div>
                <!-- Source -->
                <div class="info-block w-50 align-center">
                  <div class="label-item">{{ $t('form.function') }} :</div>
                  <div class="info-item">
                    {{ 'Deviation > Routine > Reminder' }}
                  </div>
                </div>
                <!-- <div class="d-flex align-start w-100 border-bottom border-left"> -->
                  <!-- Added by -->
                  <div cols="6" class="info-block w-50">
                    <div class="label-item">{{ $t('form.added_by') }} :</div>
                    <div class="info-item">
                      {{ editedItem.added_by_name }}
                    </div>
                  </div>
  
                  <!-- Responsible -->
                  <div cols="6" class="info-block w-50 pl-3 pt-3 d-block">
                    <div class="d-flex align-center mb-3">
                      <div class="label-item">{{ $t('form.responsible') }} :</div>
                      <div class="info-item">
                        <v-chip class="info-item mr-2 chip-custom" small>
                          IT-Manager
                        </v-chip>
                      </div>
                    </div>
                    <ResponsibleEdit :object-item="editedItem" />
                  </div>
                <!-- </div> -->
  
                <!-- Description -->
  
                <div class="info-block">
                  <div class="label-item">{{ $t('form.description') }}:</div>
                  <div class="input-wrap form-description">
                    <FroalaSuggestionListEditor
                      :item="editedItem"
                      :predefined-link-array="predefinedLinkArray"
                    />
                  </div>
                </div>
  
               
  
                <div  class="info-block w-50 align-center">
                <div  class="label-item">{{ $t('form.frequency') }} :</div>
                      <v-select
                          v-model="editedItem.recurring"
                          :items="recurringArray"
                          item-text="name"
                          item-value="id"
                          :rules="required"
                          outlined
                      />
              </div>

              <div
                class="info-block align-items-center col-6 p-0 section-required-action pl-4" 
              >
            <duration :durationData="durationData" :objectItem="editedItem" class="col-12"/>
            
              </div>

                <!-- Start date -->
  
                <div  class="info-block col-6 align-center">
                <div class="label-item activation-label">
                  {{ $t('form.activation') }} :
                </div>
                
                <DatePickerNew
                  :item="editedItem"
                  :date-input="editedItem.start_time"
                  :use-keyboard="true"
                  :past-date="false"
                  :future-date="true"
                  :default-today="true"
                  :disable="!checkAdmin && !checkCreator"
                  :dateEdit="true"
                />
                  <v-col
                    cols="5"
                    class="pe-0"
                  >
                    <!-- <time-picker/> -->
                  </v-col>
              </div>
  
                <!-- Due date -->
                <div class="info-block w-50 align-center">
                <div class="label-item">
                  {{ $t('form.deactivation') }} :
                </div> 
                <DatePickerNew
                  :item="editedItem"
                  :date-input="editedItem.deadline"
                  :past-date="false"
                  :future-date="true"
                  :is-deadline="true"
                  :disable="!checkAdmin && !checkCreator"
                  :dateEdit="true"
                  class="col-8 p-0"
                />
                <!-- <div v-else class="info-item" @click.stop>Not Applicable</div> -->
              </div>

              </div>
              <!-- Connected To -->
            </div>
          </v-card-text>
  
          <v-card-actions class="pr-10 popup-footer">
            <v-spacer />
            <v-btn class="btn-cancel" text @click="close">
              {{ $t('button.cancel') }}
            </v-btn>
            <v-btn class="btn-save" @click="save">
              {{ $t('button.save') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
</template>
  
  <script>
  import { _ } from 'vue-underscore'
  import cookies from 'js-cookie'
  import FroalaSuggestionListEditor from './FroalaSuggestionListEditor'
  import DatePickerNew from './DatePickerNew.vue'
  import ResponsibleEditInReviewPopup from './ResponsibleEditInReviewPopup'
  // import TimePicker from './TimePicker.vue'
import Duration from './Duration.vue'
  
  
  export default {
    name: 'ReminderEdit',
    components: {
      ResponsibleEdit: ResponsibleEditInReviewPopup,
      DatePickerNew,
      FroalaSuggestionListEditor,
      // TimePicker,
        Duration
    },
    props: {
      resource: {
        type: Boolean,
        required: false,
      },
      documentItem: {
        type: Object,
        required: false,
      },
      openPopup: Boolean,
      categoriesArray: Array,
      predefinedLinkArray: {
        type: Array,
        required: false,
      },
      recurringArray:{
      type: [Object,Array],
      required: false,
    },
    },
    data: () => ({
      checkAdmin: cookies.get('checkAdmin'),
      selectedFile: [],
      isEdit: true,
      checkCreator: false,
      category: [],
      durationData:{
      is_duration:false,
      duration:1
    },
   
      editedItem: {
        industry_id: '',
        industry_id_arr: [],
        name: '',
        added_by_name: '',
        description: '',
        parent_id: '',
        type_of_attachment: 2,
        type: 'Attachment',
        category_id: '',
        category_name: '',
        deadline: '',
        deadline_pre: '',
        show_manager: false,
        count_related_object: 0,
        related_objects: [],
        parent_object: '',
        editPermission: true,
        is_suggestion: false,
        // table Security
        object_type: 'document',
        is_shared: false,
        is_public: false,
        department_array: [],
        employee_array: [],
        is_reminder: false,
        is_name: false,
        reminder_name: '',
        is_description: false,
        reminder_description: '',
        is_routine: false,
        responsible_department_array: [],
        responsible_employee_array: [],
        attendee_department_array: [],
        attendee_employee_array: [],
        start_date_pre: '',
        start_date: '',
        attendee_all: false,
        is_commentSwitch: false,
        is_AttachSwitch: false,
        attachFile: [],
        remider_note: '',
      },
      defaultItem: {
        industry_id: '',
        industry_id_arr: [],
        name: '',
        added_by_name: '',
        description: '',
        parent_id: '',
        type_of_attachment: 2,
        type: 'Attachment',
        category_id: '',
        category_name: '',
        deadline: '',
        deadline_pre: '',
        show_manager: false,
        count_related_object: 0,
        related_objects: [],
        parent_object: '',
        editPermission: true,
        is_suggestion: false,
        // table Security
        object_type: 'document',
        is_shared: false,
        is_public: false,
        department_array: [],
        employee_array: [],
        is_reminder: false,
        is_name: false,
        reminder_name: '',
        is_description: false,
        reminder_description: '',
        is_routine: false,
        responsible_department_array: [],
        responsible_employee_array: [],
        attendee_department_array: [],
        attendee_employee_array: [],
        start_date_pre: '',
        start_date: '',
        attendee_all: false,
        is_commentSwitch: false,
        is_AttachSwitch: false,
        attachFile: [],
        remider_note: '',
      },
      required: [
        (v) => {
          if (!v || v.length < 1) return 'This is required'
          else return true
        },
      ],
      attachmentType: false,
      editMode: true,
      categoriesValidArray: [],
      checkResource: false,
     
    }),
  
    watch: {
      openPopup(value) {
        if (value) {
          if (this.documentItem) {
            let categoryId = this.documentItem.category_id
            this.categoriesValidArray = _.filter(
              this.categoriesArray,
              function (item) {
                return (
                  !item.disable_status ||
                  (item.disable_status && item.id === categoryId)
                )
              }
            )
            // this.editItem(this.documentItem)
          } else {
            this.categoriesValidArray = _.filter(
              this.categoriesArray,
              function (item) {
                return !item.disable_status
              }
            )
            this.addNew()
          }
        }
      },
  
      resource(value) {
        if (value) {
          this.checkResource = value
        }
      },
    },
  
   
  
    created() {
      if (this.openPopup) {
        if (this.documentItem) {
          // this.editItem(this.documentItem)
        } else {
          this.addNew()
        }
      }
  
      if (this.resource) {
        this.checkResource = this.resource
      }
    },
  
    methods: {
      getNewCategory(value) {
        this.editedItem.category_id = value.newCategoryId
      },
      
      addNew() {
        let defaultCategory = _.findWhere(this.categoriesValidArray, {
          is_primary: 1,
        })
        if (defaultCategory) {
          this.editedItem.category_id = defaultCategory.id
        }
       
        this.editMode = false
        this.selectedFile = []
        this.attachmentType = false
      },
   
  
      editItem(){ },
  
      close() {
        this.isEdit = false
        if (this.openPopup) {
          this.$emit('closePopup')
        }
      },
  
    
      save() {     
        this.close()
      },
  
      reloadList() {
        this.$emit('reloadList')
      },
  
      reloadListCategory() {
        this.$emit('reloadListCategory')
      },
    },
  }
  </script>
  
  <style scoped>
  ::v-deep .sortable {
    font-size: 14px !important;
  }
  :deep(.v-text-field__details) {
    display: none;
  }
  
  :deep(#input-421) {
    padding: 0 !important;
  }
  
  :deep(.add-new-down-title.v-btn.v-btn--is-elevated.v-btn--has-bg) {
    margin-left: -10px !important;
    padding: 0px 6px !important;
  }
  
  :deep(.department) {
    display: block !important;
    width: 354px !important;
  }
  
  :deep(.new-department-input) {
    width: 100% !important;
  }
  
  :deep(.v-dialog .btn-add-department) {
    margin: 5px 10px 10px 2px !important;
  }
  

  :deep(.section-connect-to) {
    margin-bottom: 8px;
  }
  
  :deep(.review-popup .normal-table .info-block.responsible) {
    border-top: none;
    border-bottom: none;
  }
  /* .v-chip {
    width: 130px;
  } */
  .activation-label {
    width: 141px;
  }
  :deep(.category-item .icon-flex) {
    width: 119px;
  }

  
  :deep(body .v-application .primary) {
    background-color: #666768 !important;
    border-color: #666768 !important;
  }
  
  :deep(.v-btn__content) {
    text-transform: capitalize;
  }
  
  :deep(.v-card__actions) {
    justify-content: center !important;
    padding-bottom: 40px !important;
  }
  
  :deep(.btn-disapprove) {
    background-color: #fd5155 !important;
    color: #fff !important;
    margin-left: 42px !important;
  }
  
  :deep(.btn-cancel.btn-disapprove span) {
    text-decoration: none;
  }
  :deep(.v-btn:not(.v-btn--round).v-size--default) {
    padding: 6px 16px;
  }
  :deep(.category-btns){
    display: flex;
    margin-top: -10px !important;
  }
  </style>
  
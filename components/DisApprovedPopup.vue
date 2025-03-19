<template>
  <div>
    <v-dialog v-model="openPopup" max-width="1125px" persistent>
      <v-card class="disapproved-modal">
        <v-card-title class="text-h5 justify-content-center text-capitalize">
          {{ titleMessage }}
        </v-card-title>
        <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
        <v-card-text class="disapproved-switches">
          <edit-details
            :switchTitle="$t('title.reason')"
            class="edit-reason mt-5"
            :edited-item="editedItem"
            :custClass="custClass"
          />

          <div v-if="!isDisapproved" class="deadline mt-2">
            <div
              v-if="requestDeadline"
              class="
                section-connect-to section-connect-to-reminder
                extend-deadline
              "
            >
              <div
                class="
                  section-connect-to-label section-connect-to-label-reminder
                "
              >
                {{ $t('title.extend_deadline') }}
              </div>
              <div
                class="
                  switch-component switch-component-small
                  default-question-mark
                "
              >
                <label class="left-text">{{ $t('form.none') }}</label>
                <v-switch
                  v-model="requestDeadline"
                  :label="$t('form.activate')"
                  class="right-text"
                  :readonly="editDeadlineTime"
                  inset
                />
              </div>
              <div class="pt-5 mt-3">
                 <DeadlineEdit
                      :object-item="editedItem"
                      :item="objectItem"
                      :change-custom="changeDeadlineCustom"
                      :extend-date="extendDate"
                      :extend-time="extendTime"
                    />
              </div>
            </div>
            <b-row v-else>
              <b-col cols="2" class="hse-document-badge-tab">
                <div class="bold-title md-line-height">
                  {{ $t('title.extend_deadline') }}
                </div>
              </b-col>
              <b-col cols="4">
                <div class="input-wrap">
                  <div class="switch-component default-question-mark">
                    <label class="left-text">{{ $t('form.none') }}</label>
                    <v-switch
                      v-model="requestDeadline"
                      :label="$t('form.activate')"
                      class="right-text"
                      inset
                    />
                  </div>
                </div>
              </b-col>
            </b-row>
          </div>
        </v-card-text>
        </v-form>

        <v-card-actions>
          <v-spacer />
          <v-btn class="btn-cancel" text @click="close">
            {{ $t('button.cancel') }}
          </v-btn>

          <v-btn class="btn-save" @click="save">
            {{ $t('button.done') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import DeadlineEdit from './DeadlineEdit.vue'
import EditDetails from './EditDetails.vue'
import { removeTagsFromString } from "./common/js/functions"
// import FroalaSuggestionListEditor from './FroalaSuggestionListEditor'
export default {
  name: 'DisApprovedPopup',
  components: {
    EditDetails,
    DeadlineEdit,
  },
  props: {
    objectItem: {
      type: Object,
      required: false,
    },
    attendeeObjectID:{
       type: [Number, String],
      required: false,
    },
    openPopup: Boolean,
    categoriesArray: Array,
    predefinedLinkArray: {
      type: Array,
      required: false,
    },
    isDisapproved: {
      type: Boolean,
      required: false,
    },
    titleMessage: {
      type: String,
      required: false,
    },
    editDeadlineTime:{
      type: Boolean,
      required: false,
    },
    extendDate: {
      type: Boolean,
      default: false,
      required: false,
    },
    extendTime: {
      type: Boolean,
      default: false,
      required: false,
    },
    
  },
  data: () => ({
    feedbackArea: true,
    requestDeadline: false,
    checkAdmin:false,
    checkCreator:false,
    editMode:false,
    valid: true,
    deadline: '',
    end_time:'',
    editedItem: {
      description: '',
      deadline: '',
      deadline_pre: '',
      end_time:'',
      end_time_pre:'',
      start_time:'',
      isDisapproved:'',
    },
    defaultItem: {
      description: '',
      deadline: '',
      deadline_pre: '',
      end_time:'',
      end_time_pre:'',
      start_time:'',
    },
    changeDeadlineCustom:false,
    custClass:false
  }),
  watch: {
    openPopup(value){
      if(value){
        this.requestDeadline=false
        if (this.editDeadlineTime) {
          this.requestDeadline=true
        }
        this.editedItem.description = ""
        this.editedItem.end_time_pre = ""
        if (Object.keys(this.objectItem).length > 0) {
          
          this.editItem(this.objectItem)
        }
      }
    }
  },
  methods: {
    editItem(item){
      this.editedItem.deadline=item?.time_info?.deadline
      this.editedItem.process_id=item?.process_id
      this.editedItem.object_id=this.attendeeObjectID
      this.editedItem.isDisapproved = this.isDisapproved
    },
    close() {
      this.isEdit = false
      if (this.openPopup) {
        this.$emit('closePopup')
      }
    },
    async save() {
      // update
      let that = this
        this.editedItem.description= await removeTagsFromString(this.editedItem?.description);
         if (that.$refs.form.validate() && (that.editedItem?.description != null && that.editedItem?.description != 'Powered by Froala Editor')) {

           that.close()
          this.editedItem.isDisapproved = this.isDisapproved
          that.$emit('disApproved',that.editedItem ,that.requestDeadline )
          this.editedItem.description = ""
        this.editedItem.end_time_pre = ""
        this.requestDeadline=false
        }else{
           that.$toaster.error(that.$i18n.t('message.add_required_feild'));
           if (that.editedItem?.description == null && that.editedItem?.description == 'Powered by Froala Editor') {
            
             that.custClass=true
           }
          
        }
    },
    getDeadline(value) {
      this.deadline = value.date
      // if (this.editMode) {
        this.editedItem.deadline_pre = this.deadline
      // } else {
        // this.objectItem.deadline_pre = this.deadline
      // }
    },
      getTimeDeadline(value) {
      this.end_time = value.time
      // if (this.editMode) {
        this.editedItem.end_time_pre = this.end_time
      // } else {
        // this.objectItem.end_time_pre = this.end_time
      }
      // this.$emit('changeTime', {
      //   changed: !!value.changeTime,
      // })
    // },
  },
}
</script>

<style scoped>
:deep(.edit-reason
    .section-connect-to
    .section-connect-to-label.section-connect-to-label-reminder) {
  width: 80px !important;
}

.disapproved-modal {
  padding: 20px 0px;
}
:deep(.deadline .switch-component.switch-component-small) {
  padding-left: 68px;
  position: absolute;
  top: -31px;
  left: 130px;
}
.text-h5{
  font-family: 'Montserrat', sans-serif !important;
}
:deep(.bold-title){
  font-weight: 500;
}
</style>
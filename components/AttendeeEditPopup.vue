<template>
  <div>
    <v-dialog v-model="openPopup" max-width="1125px" persistent>
      <v-card class="disapproved-modal py-5">
        <v-card-title
          class="text-h5 justify-content-center text-capitalize mb-4"
        >
          {{ titleMessage }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <div class="section-connect-to section-connect-to-reminder" :style="custClass ? 'border: 1px solid #ff5252;' : ''">
              <div
                class="section-connect-to-label section-connect-to-label-reminder"
              >
                {{ $t('title.attendee') }}
              </div>
              <div
                class="switch-component switch-component-small default-question-mark"
              >
                <label class="left-text">{{ $t('form.change') }}</label>
                <v-switch
                  :label="$t('form.remove')"
                  inset
                  v-model="isRemoveEmployee"
                  class="right-text"
                />
              </div>
              <b-row class="pt-3 mt-3">
                <b-col cols="12">
                  <div class="px-3 pb-5 edit-reason">
                    <edit-details
                      :addEditorTitle="$t('title.reason')"
                      :edited-item="editedItem"
                      :custClass="custClass"
                    />
                  </div>
                </b-col>
              </b-row>
            </div>
            <div>
              <employee-attendee
                v-if="!isRemoveEmployee"
                :object-item="editedItem"
                :edit-mode="false"
                :validate="validate"
                :allEmployee="allEmployee"
                :openEmployeeEdit="openEmployeeEdit"
              />
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="btn-cancel" text @click="close()">
            {{ $t('button.cancel') }}
          </v-btn>

          <v-btn class="btn-save" @click="save(attendeeObjectID)">
            {{ $t('button.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import EditDetails from './EditDetails.vue'
import EmployeeAttendee from './EmployeeAttendee.vue'
import { removeTagsFromString } from "./common/js/functions"
export default {
  name: 'EditEmployeePopup',
  components: {
    EditDetails,
    EmployeeAttendee,
  },
  props: {
    attendeeItem: {
      type: Object,
      required: false,
    },
    openPopup: Boolean,

    titleMessage: {
      type: String,
      required: false,
    },
    attendeeObjectID: {
      type: [Number, String],
      required: false,
    },
    allEmployee:{
      type: String,
      required: false,
    }
  },
  data: () => ({
    isRemoveEmployee: false,
    task_id: '',
    valid: true,
    validate:true,
    openEmployeeEdit:false,
    newItem: {
      old_attendee_employee: '',
      old_attendee_department: '',
      new_attendee_department: '',
      new_attendee_employee: '',
      transfer_information: false,
      transfer_feedback: '',
      transfer_attachment: '',
      reason: '',
      type: '',
      object_id: '',
    },
    editedItem: {
      attendee_department_array: [],
      attendee_employee_array: [],
      attendee_all: false,
      isDefaultAttendee: false,
      attendee_required_comment: false,
      attendee_required_attachment: false,
      description: '',
    },
    custClass:false
  }),
  watch: {
    openPopup(value) {
      if (value) {
        this.openEmployeeEdit = value
        this.isRemoveEmployee=false
        this.editedItem.description = ''
        this.editedItem.attendee_department_array = ''
        this.editedItem.attendee_employee_array = ''
        if (this.attendeeItem || this.item) {
          this.editItem(this.attendeeItem)
        } else {
          // this.addNew()
        }
      }
    },
  },

  created() {
    if (this.openPopup) {
      if (this.attendeeItem || this.item) {
        this.editItem(this.attendeeItem)
        // this.editTaskItem(this.item)
      } else {
        // this.addNew()
      }
    }
    if (this.roleUser == 'manager') this.checkManager = true

    if (this.roleUser == 'user') this.checkUser = true
  },
  methods: {
    close() {
      this.isEdit = false
      if (this.openPopup) {
        this.$emit('closePopup')
      }
    },
    editItem(item) {
      let that = this
      that.editedItem = Object.assign({}, item)
    },
    // editTaskItem(taskItem){
    //   this.task_id=taskItem.id
    //   this.editedItem.object_id=this.task_id
    // },
    reloadList() {
      this.$emit('reloadList')
    },
    async save(id) {
      let that = this
       this.editedItem.description= await removeTagsFromString(this.editedItem?.description);
      
       if (this.$refs.form.validate() && (this.editedItem?.description != null && this.editedItem?.description != 'Powered by Froala Editor' && this.editedItem.description != 'undefined')) {     
        that.newItem.object_id = id
        that.newItem.old_attendee_department = that.editedItem?.attendeeDepartmentId
        that.newItem.old_attendee_employee = that.editedItem?.attendee_id
        that.newItem.new_attendee_department = that.editedItem?.attendee_department_array
        that.newItem.new_attendee_employee = JSON.stringify(that.editedItem?.attendee_employee_array)
        that.newItem.transfer_information =that.editedItem?.attendee_required_attachment == 1 || that.editedItem?.attendee_required_comment == 1? true: false
        that.newItem.transfer_feedback =that.editedItem?.attendee_required_comment == true ? true : false
        that.newItem.transfer_attachment =that.editedItem?.attendee_required_attachment== true ? true : false
        that.newItem.reason = that.editedItem?.description
        that.newItem.type = that.isRemoveEmployee ? 'remove' : 'change'
        that.$store
          .dispatch(`objects/attendeeStatus`, { id: id, data: that.newItem })
          .then((res) => {
            console.log('status', res)

            that.$toaster.success(
              that.$i18n.t('message.success_employee_update')
            )
            that.$nuxt.$loading.finish()
          })
          .catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_employee_update'))
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          }
            that.$nuxt.$loading.finish()
          })
        that.close()
        that.$emit('savePopup')
        that.editedItem.description = ''
        that.editedItem.attendee_department_array=[]
        that.editedItem.attendee_employee_array=[]
      }else{
        if (this.editedItem?.description == null && this.editedItem?.description == 'Powered by Froala Editor' && this.editedItem.description == 'undefined') {
          this.custClass=true
        }
        this.$toaster.error(this.$i18n.t('message.add_required_feild'));
      }
    },
  },
}
</script>

<style scoped>
:deep(
    .edit-reason
      .section-connect-to
      .section-connect-to-label.section-connect-to-label-reminder
  ) {
  width: 60px;
}
</style>
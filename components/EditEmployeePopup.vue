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
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
          <div class="section-connect-to section-connect-to-reminder">
            <div
              class="section-connect-to-label section-connect-to-label-reminder"
            >
              {{ $t('title.attendee') }}
            </div>
            <div
              class="
                switch-component switch-component-small
                default-question-mark
              "
            >
              <label class="left-text">{{ $t('form.change') }}</label>
              <v-switch :label="$t('form.remove')" inset v-model="isRemoveEmployee" class="right-text" />
            </div>
            <b-row class="pt-3 mt-3">
              <b-col cols="12">
                <div class="px-3 pb-5 edit-reason">
                  <edit-details :addEditorTitle="$t('title.reason')" :edited-item="defaultItem"/>
                </div>
              </b-col>
            </b-row>
          </div>
          <div>
              <!-- <employee-attendee v-if="!isRemoveEmployee" :object-item="documentItem"  :edit-mode="false"/> -->
              <employee-attendee v-if="!isRemoveEmployee" :object-item="defaultItem"  :edit-mode="false" :validate="validate"/>
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="btn-cancel" text @click="close">
            {{ $t('button.cancel') }}
          </v-btn>

          <v-btn class="btn-save" @click="save(item.id)">
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

export default {
  name: 'EditEmployeePopup',
  components: {
    EditDetails,
    EmployeeAttendee,
  },
  props: {
    item: {
      type: [Object, Array],
      required: false,
    },
    newItem:{
      type: [Object, Array],
      required: false,
    },
    documentItem: {
      type: Object,
      required: false,
    },
    openPopup: Boolean,
    categoriesArray: Array,

    titleMessage: {
      type: String,
      required: false,
    },
    isRemoveEmployee:{
      type: Boolean,
      required: false,
    },
    emp_index:{
      type: Number,
      required: false,
    },
    taskDeviation:{
       type: Boolean,
      required: false,
    }
  },
  data: () => ({
    // isRemoveEmployee: false,
    task_id:'',
    valid:true,
    validate:true,
    editedItem:{
      old_attendee_employee:'',
      old_attendee_department:'',
      new_attendee_department:'',
      new_attendee_employee:'',
      transfer_information:false,
      transfer_feedback:'', 
      transfer_attachment:'',
      reason:'',
      type:"",
      object_id:'',
    },
    defaultItem:{
      attendee_department_array: [],
      attendee_employee_array: [],
      attendee_all: false,
      isDefaultAttendee:false,
      attendee_required_comment:false,
      attendee_required_attachment:false,
      description:'',
    }
  }),
   watch: {
    openPopup(value) {
      if (value) {
        this.defaultItem.description=''
        this.checkResponsible = this.documentItem.responsible === this.userID;
        if (this.documentItem || this.item) {
          // let categoryId = this.documentItem.category_id
          // this.categoriesValidArray = _.filter(
          //   this.categoriesArray,
          //   function (item) {
          //     return (
          //       !item.disable_status ||
          //       (item.disable_status && item.id === categoryId)
          //     )
          //   }
          // )
          this.editItem(this.documentItem)
          // this.editTaskItem(this.item)
        } else {
          // this.categoriesValidArray = _.filter(
          //   this.categoriesArray,
          //   function (item) {
          //     return !item.disable_status
          //   }
          // )
          this.addNew()
        }
      }
    },
  },

  created() {
    if (this.openPopup) {
      if (this.documentItem || this.item) {
        this.editItem(this.documentItem)
          // this.editTaskItem(this.item)
      } else {
        this.addNew()
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
    editItem(item){
      let that=this
      that.defaultItem = Object.assign({}, item);
    },
    // editTaskItem(taskItem){
    //   console.log(taskItem);
    //   this.task_id=taskItem.id
    //   this.editedItem.object_id=this.task_id
    // },
    reloadList() {
        this.$emit('reloadList');
      },
    save(id) {
      // update
      let that = this
      if (that.$refs.form.validate()) {
      this.$emit('savePopup', that.isRemoveEmployee)
      that.editedItem.old_attendee_department=that.defaultItem.attendeeDepartmentId
      that.editedItem.old_attendee_employee=that.defaultItem.attendee_id
      that.editedItem.reason=that.defaultItem.description
      that.editedItem.new_attendee_department=that.defaultItem.attendee_department_array
      that.editedItem.new_attendee_employee=JSON.stringify(that.defaultItem.attendee_employee_array)
      that.editedItem.transfer_feedback=that.defaultItem.attendee_required_comment
      that.editedItem.transfer_attachment=that.defaultItem.attendee_required_attachment
      that.editedItem.transfer_information=(that.defaultItem.attendee_required_attachment==1 || that.defaultItem.attendee_required_comment==1) ? true : false 
      that.editedItem.type=that.isRemoveEmployee ? 'remove' : 'change'
      that.editedItem.object_id=id
      that.defaultItem.description=""
      that.$store.dispatch(`objects/attendeeStatus`,{id: id, data: that.editedItem}).then(function(){
          // that.taskInRisk = Object.assign({}, result);
          
          that.$toaster.success(that.$i18n.t('message.success_task_add_new'));
          that.$nuxt.$loading.finish();
        }).catch((error) => {
                if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_task_add_new'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
        if(this.taskDeviation){

          that.$store.dispatch('deviations/show', that.newItem.id)
        .then((res) => {
          that.$emit('updateEmployee', res?.data?.task_data.processingInfo[that.emp_index])
          
          that.reloadList()
        })
          }
        
      that.close()
      }else{
        that.$toaster.error(that.$i18n.t('message.add_required_feild'));
      }
    },
  },
}
</script>

<style scoped>
:deep(.edit-reason .section-connect-to .section-connect-to-label.section-connect-to-label-reminder) {
  width: 60px;
}
</style>
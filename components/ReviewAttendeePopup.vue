<template>
  <div>
    <v-dialog v-model="openPopup" scrollable max-width="1100px" persistent>
      <v-card>
        <v-card-title class="text-h5 justify-content-center text-uppercase">
          {{ isEdit ? 'Edit Employee details' : 'Employee details' }}
        </v-card-title>
        <v-card-text>
          <div class="review-popup">
            <div class="review-popup-table normal-table">
              <div class="info-block w-100 align-center">
                <div class="label-item">{{ $t('form.status') }}:</div>
                <div class="info-item">
                  <v-chip
                    v-if="isEmployeeStatus && !isEmployeeRemove"
                    class="status-label-custom not-done"
                    label
                  >
                    {{ $t('form.reassigned') }}
                  </v-chip>
                  <v-chip
                    v-else-if="isEmployeeStatus && isEmployeeRemove"
                    class="status-label-custom not-done"
                    label
                  >
                    {{ $t('form.remove') }}
                  </v-chip>
                  <v-chip
                    v-else-if="taskDataItem.status == 'new'"
                    class="info-item status-label-custom pending"
                    label
                  >
                    {{ $t('form.new') }}
                  </v-chip>
                  <v-chip v-else class="status-label-custom ongoing" label>
                    {{ $t('form.ongoing') }}
                  </v-chip>
                </div>
              </div>

              <div class="info-block w-50 d-flex align-center">
                <div class="d-flex align-center">
                  <div class="label-item">{{ $t('form.employees') }} :</div>

                  <v-badge
                    :value="hover"
                    right
                    transition="slide-x-transition"
                    class="hse-badge-icon reson-hover-label"
                  >
                    <span
                      slot="badge"
                      v-if="isEmployeeStatus && !isEmployeeRemove"
                      >
                      <!-- {{ $t('message.employee_change_manager') }} -->
                      {{taskDataItem.attendee_history.old_attendee_employee + ' ' + ' change to : ' + ' ' + taskDataItem.attendee_history.new_attendee_employee + ' ' + 'by'+ ' ' + taskDataItem.responsibleName}}
                    </span>
                    <span
                      slot="badge"
                      v-if="isEmployeeStatus && isEmployeeRemove">
                      <!-- {{ $t('message.employee_remove_manager') }} -->
                      {{taskDataItem.attendee_history.old_attendee_employee + ' ' + 'remove by' + ' ' +  taskDataItem.responsibleName}}
                    </span>
                    <v-hover :disabled="!isEmployeeStatus" v-model="hover">
                      <v-chip class="mr-2 info-item " small> {{taskDataItem.attendeeName}} </v-chip>
                     <!-- <v-chip
                     v-for="(item , index) in employee_name"
                     :key="index"
                    class="mr-2 mb-1 chip-custom"
                    small
                  >
                    {{ item.name }}
                  </v-chip> -->
                    </v-hover>
                  </v-badge>
                  <v-icon v-if="isEmployeeStatus && !isEmployeeRemove">
                    mdi-arrow-right
                  </v-icon>
                  <v-chip
                    v-if="isEmployeeStatus && !isEmployeeRemove"
                    class="mr-2 primary"
                    small
                  >
                    {{taskDataItem.attendee_history.new_attendee_employee}}
                  </v-chip>
                </div>
              </div>
              <div class="info-block w-50 d-flex align-center">
                <div class="d-flex align-center">
                  <div class="label-item">{{ $t('form.department') }} :</div>

                  <v-chip class="mr-2 info-item chip-custom" small>
                   {{taskDataItem.attendeeDepartment}}
                  </v-chip>
                </div>
              </div>
              <div class="info-block w-50 chip">
                <div class="label-item">{{ $t('form.feedback') }} :</div>

                <div class="info-item" v-if="taskDataItem.required_comment==0">Not Available</div>
                <div class="info-item" v-if="taskDataItem.required_comment==1">
                  <img src="../assets/images/gridIcon/comment.png"/>
                </div>
              </div>
              <div class="info-block w-50">
                <div class="label-item">{{ $t('form.image') }}:</div>
                <div class="info-item" v-if="taskDataItem.required_attachment==0">
                  <img src="../assets/images/icon/image-gray.png" />
                </div>
                <div class="info-item" v-if="taskDataItem.required_attachment==1">
                  <img src="../assets/images/icon/image-green.png"/>
                </div>
              </div>
              <!-- Added by -->
              <div v-if="isEmployeeStatus" cols="6" class="info-block w-50">
                <div class="label-item">{{ $t('form.added_by') }} :</div>
                <div class="info-item">
                  {{ taskDataItem.attendee_history.updated_by }}
                </div>
              </div>

              <!-- Responsible -->
              <div
                v-if="isEmployeeStatus"
                class="info-block w-50 chip responsible align-center"
              >
                <div class="label-item">{{ $t('form.responsible') }} :</div>
                <div
                  class="info-item d-flex justify-content-between responsible-folddown"
                >
                  <!-- v-for="(item, index) in responsibleName"
                    :key="index" -->
                    <v-chip
                    v-for="(item, index) in taskDataItem.responsibleName"
                    :key="index"
                    class="mr-2 mb-1 chip-custom"
                    small
                  >
                    {{ item }}
                  </v-chip>
                </div>
              </div>
              <div class="info-block w-100" v-if="isEmployeeStatus">
                <div>
                  <div class="label-item mb-3">
                    Responsible Reason : {{moment(taskDataItem.attendee_history.created_at).format('DD.MM.YYYY - HH:mm:ss')}}
                  </div>
                  <div class="info-item">
                    {{taskDataItem.attendee_history.reason}}
                  </div>
                </div>
              </div>
              <!-- Start date -->
              <div class="info-block col-6">
                <div class="label-item">{{ $t('form.start_date') }} :</div>
                <div class="info-item">
                  {{ moment(item.start_date).format('DD.MM.YYYY') }} - {{item.start_time}}
                </div>
              </div>

              <!-- Due date -->
              <div class="info-block w-50">
                <div class="label-item">{{ $t('form.deadline') }} :</div>
                <div class="info-item">
                  {{ moment(item.deadline).format('DD.MM.YYYY') }} - {{item.end_time}}
                </div>
                <!-- <div class="info-item" v-else @click.stop>Not Applicable</div> -->
              </div>
            </div>
          </div>
        </v-card-text>

        <v-card-actions class="py-8">
          <v-spacer />
          <v-btn class="btn-cancel" text @click="close">
            {{ $t('button.cancel') }}
          </v-btn>

          <v-btn
            v-if="isEdit && (checkAdmin || checkCreator)"
            class="btn-save"
            @click="close"
          >
            {{ $t('button.done') }}
          </v-btn>
          <!-- <v-btn
              v-if="!isEdit && (checkAdmin || checkCreator)"
              class="border delete-btn"
              @click="dialogDelete=true"
            >
              <v-icon> mdi-delete </v-icon>
            </v-btn> -->
          <v-btn class="hse-btn-save" @click="editEmployee" v-if="taskDataItem.status !== 'Reassigned' && taskDataItem.status !== 'Removed'">
            {{ $t('button.edit') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <edit-employee-popup
      :open-popup="checkNew"
      :isRemoveEmployee="false"
      :newItem="newItem"
      :item="item"
      :document-item="taskDataItem"
      @closePopup="checkNew = !checkNew"
      @savePopup="saveEmployee"
      @reloadList="reloadList"
      @updateEmployee="updateEmployee"
      :emp_index="emp_index"
      :taskDeviation="taskDeviation"
      titleMessage="Edit"
    />
  </div>
</template>
  
  <script>
// import { _ } from 'vue-underscore'
import cookies from 'js-cookie'
import EditEmployeePopup from './EditEmployeePopup.vue'
export default {
  name: 'review-attendee-popup',
  components: {
    EditEmployeePopup,
  },
  props: {
    openPopup: Boolean,
    documentItem: {
      type: Object,
      required: false,
    },
    item: {
      type: [Object, Array],
      required: false,
    },
    newItem: {
      type: [Object, Array],
      required: false,
    },
    isEmployeeStatus: {
      type: Boolean,
      required: false,
    },
    isEmployeeRemove: {
      type: Boolean,
      required: false,
    },
    responsible_name:{
      type: [Object, Array],
      required: false,
    },
    emp_index:{
      type:Number,
      required: false,
    },
    taskDeviation:{
      type: Boolean,
      required: false,
    }
  },
  data: () => ({
    userRoleId: parseInt(cookies.get('roleID')),
    userDepartmentID: parseInt(cookies.get('userDepartmentID')),
    checkAdmin: cookies.get('checkAdmin'),
    checkSuperAdmin: cookies.get('checkSuperAdmin'),
    isEdit: false,
    checkCreator: false,
    checkNew: false,
    hover: false,
    taskDataItem:{},
    employee_name:[],
    departmant_name:[],
    // isEmployeeStatus:false,
    editedItem: {
      name: '',
      parent_id: '',
      type: 'Attachment',
      deadline: '',
      deadline_pre: '',
      isDefaultAttendee: false,
      attendee_department_array: [],
      attendee_employee_array: [],
      attendee_required_comment: false,
      attendee_required_attachment: false,
      start_date_pre: '',
      start_date: '',
      attendee_all: false,
    },
    defaultItem: {
      name: '',
      parent_id: '',
      type: 'Attachment',
      deadline: '',
      deadline_pre: '',
      isDefaultAttendee: false,
      attendee_department_array: [],
      attendee_employee_array: [],
      attendee_required_comment: false,
      attendee_required_attachment: false,
      start_date_pre: '',
      start_date: '',
      attendee_all: false,
    },
    required: [
      (v) => {
        if (!v || v.length < 1) return 'This is required'
        else return true
      },
    ],
    dialogDelete: false,
    editMode: true,
    attendeeDepartment: [],
  }),
  watch: {
      openPopup(value) {
        if (value) {
          if (this.documentItem) {
            this.editItem(this.documentItem);
            // this.editTaskItem(this.item);
          } else {
            this.addNew();
          }
        }
      },
    },
    

  methods: {
    updateEmployee(payload){
      this.$emit('updateEmployee', payload)
    },
     reloadList() {
    this.$emit('reloadList');
  },
     editItem(item) {
        let that = this;
        that.taskDataItem = Object.assign({}, item);
        // that.employee_name=item?.attendee?.employeeName
        // that.depart_name=item?.attendee?.employeeName
        // that.employee_name=item?.processingInfo?.attendeeName
        let employees = []
        item?.attendee?.employeeName?.map((innerItem , index)=>{
          employees.push({
            name: innerItem
          })
          if (index == item?.attendee?.employeeName?.length - 1) {
            that.employee_name=employees
          }
        })
        let departmant=[]
        item?.attendee?.departmentName?.map((innerItem , index)=>{
          departmant.push({
            name: innerItem
          })
          if (index == item?.attendee?.departmentName?.length - 1) {
            that.departmant_name=departmant
          }
        })
      },
       close() {
      this.isEdit = false
      if (this.openPopup) {
        this.$emit('closePopup')
      }
    },
    editEmployee() {
      this.checkNew = true
    },
    saveEmployee(payload) {
      this.close()
      this.$emit('saveEmployee', payload)
    },
  },
}
</script>
  
  <style scoped>
:deep(.v-dialog > .v-card > .v-card__title) {
  padding: 30px 24px 40px !important;
}

:deep(.reson-hover-label .v-badge__wrapper .v-badge__badge) {
  inset: auto auto calc(100% - -8px) calc(100% - 103px) !important;
  background-color: #666768 !important;
}
.review-popup {
  width: auto;
}
</style>
  
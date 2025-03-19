<template>
  <div>
    <v-dialog v-model="openPopup" max-width="1125px" >
      <v-card class="disapproved-modal py-5">
        <v-card-title
          class="text-h5 justify-content-center text-capitalize mb-4"
        >
          {{ 'EMPLOYEE DETAILS' }}
        </v-card-title>
        <v-card-text>
          <div class="review-popup">
            <div class="review-popup-table normal-table">
              <div class="info-block w-100 align-center">
                <div class="label-item">{{ $t('form.status') }}:</div>
                <div class="info-item">
                  <status-chip
                    :status="status"
                    :inReview="true"
                    :inRisk="false"
                  />
                  <!-- <v-chip v-if="editedItem?.status == 'new' && (!isChange || !isRemove)" class="status-label-custom pending" label>
                    {{ $t('form.new') }}
                  </v-chip>
                  <v-chip v-if="editedItem?.status == 'pending' && (!isChange || !isRemove)" class="status-label-custom pending" label>
                    {{ $t('form.pending') }}
                  </v-chip>
                   <v-chip
                    v-else-if="isChange"
                    class="status-label-custom not-done"
                    label
                  >
                    {{ $t('form.reassigned') }}
                  </v-chip>
                  <v-chip
                    v-else-if="isRemove"
                    class="status-label-custom not-done"
                    label
                  >
                    {{ $t('form.remove') }}
                  </v-chip>
                  <v-chip v-else-if="editedItem?.status === 'ongoing' || editedItem?.status === 'timeline_disapproved'" class="status-label-custom ongoing" label>
                    {{ $t('form.ongoing') }}
                  </v-chip>
                  <v-chip v-else-if="editedItem?.status === 'overdue'" class="status-label-custom ongoing" label>
                    {{ $t('form.ongoing') }}
                    <div class="ms-2" >
                      <img src="../assets/images/icon/alert.png" alt="" srcset="">
                    </div>
                  </v-chip>
                   <v-chip
                    v-else-if="editedItem?.status === 'completed' || editedItem?.status === 'completed_overdue'"
                    class="status-btn status-label-custom approved"
                    label
                  >
                    {{ $t('form.completed') }}
                    <div role="button" class="ms-2" v-if="editedItem?.status === 'completed_overdue'">
                      <img
                        src="../assets/images/icon/alert-white.png"
                        alt=""
                        srcset=""
                      />
                    </div>
                  </v-chip>
                  <v-chip
                    v-else-if="editedItem?.status === 'request'"
                    class="status-btn status-label-custom ongoing"
                    label
                  >
                    {{ $t('form.request') }}
                  </v-chip>
                  <v-chip
                    v-else-if="editedItem?.status === 'disapproved_overdue'"
                    class="status-btn status-label-custom not-done"
                    label
                  >
                    {{ $t('form.disapproved') }}
                    <div role="button" class="ms-2">
                      <img src="../assets/images/icon/alert-white.png" alt="" srcset="" />
                    </div>
                  </v-chip>
                  <v-chip
                    v-else-if="editedItem?.status === 'disapproved_with_extended'"
                    class="status-btn status-label-custom ongoing"
                    label
                  >
                    {{ $t('form.disapproved') }}
                    <div role="button" class="ms-2">
                    <img
                      src="../assets/images/icon/alert.png"
                      alt=""
                      srcset=""
                    />
                  </div>
                  </v-chip>
                  <v-chip
              v-else-if="editedItem?.status === 'disapproved' "
              class="status-btn status-label-custom not-done"
              label
            >
              {{ $t('form.disapproved') }}
            </v-chip>
            <v-chip
              v-else-if="editedItem?.status === 'approved' || editedItem?.status === 'approved_overdue'"
              class="status-btn status-label-custom approved"
              label
            >
              {{ $t('form.approved') }}
               <img v-if="editedItem?.status === 'approved_overdue'"
                      src="../assets/images/icon/alert-white.png"
                      alt=""
                      srcset=""
                    />
            </v-chip> -->
                </div>
              </div>

              <div class="info-block w-50 d-flex align-center">
                <div class="d-flex align-center">
                  <div class="label-item">{{ $t('form.employees') }} :</div>

                  <v-badge v-if="isChange || isRemove"
                    :value="hover"
                    right
                    transition="slide-x-transition"
                    class="hse-badge-icon reson-hover-label"
                  >
                    <span
                      slot="badge"
                      v-if="isChange && !isRemove"
                      >
                      {{changeEmployeeItem?.old_attendee_employee + ' ' + ' change to : ' + ' ' + changeEmployeeItem?.new_attendee_employee + ' ' + 'by'+ ' ' + changeEmployeeItem?.updated_by}}
                    </span>
                    <span
                      slot="badge"
                      v-if="isRemove && !isChange">
                      {{changeEmployeeItem?.old_attendee_employee + ' ' + 'remove by' + ' ' +  changeEmployeeItem?.updated_by}}
                    </span>
                    <v-hover :disabled="isNew && !isRemove && !isChange" v-model="hover">
                      <v-chip class="mr-2 info-item " small> {{editedItem?.attendeeName}} </v-chip>

                    </v-hover>
                  </v-badge>
                  <v-chip v-if="isNew && !isRemove && !isChange"
                    class="mr-2 primary"
                    small
                  >
                    {{editedItem?.attendeeName}}
                  </v-chip>
                  <v-icon v-if="isChange && !isRemove">
                    mdi-arrow-right
                  </v-icon>
                  <v-chip v-if="isChange"
                    class="mr-2 primary"
                    small
                  >
                    {{changeEmployeeItem?.new_attendee_employee}}
                  </v-chip>
                </div>
              </div>
              <div class="info-block w-50 d-flex align-center">
                <div class="d-flex align-center">
                  <div class="label-item">{{ $t('form.department') }} :</div>

                  <v-chip class="mr-2 info-item chip-custom" small>
                   {{editedItem?.attendeeDepartment}}
                  </v-chip>
                </div>
              </div>
              <div class="info-block w-50 chip">
                <div class="label-item">{{ $t('form.feedback') }} :</div>

                <div class="info-item" v-if="editedItem?.comment == null">Not Available</div>
                <div class="info-item" v-else>
                  <img src="../assets/images/gridIcon/comment.png"/>
                </div>
              </div>
              <div class="info-block w-50">
                <div class="label-item">{{ $t('form.image') }} :</div>
                <div class="info-item" v-if="editedItem?.image== null">
                  <img src="../assets/images/icon/image-gray.png" />
                </div>
                <div class="info-item" v-else>
                  <img src="../assets/images/icon/image-green.png"/>
                </div>
              </div>
              <!-- Added by -->
              <div cols="6" class="info-block w-50">
                <div class="label-item">{{ $t('form.added_by') }} :</div>
                <div class="info-item">
                  {{ employeeItem?.addedByName }}
                </div>
              </div>

              <!-- Responsible -->
              <div
                
                class="info-block w-50 chip responsible"
              >
                <div class="label-item col-3 p-0">{{ $t('form.responsible') }} :</div>
                <div
                  class="info-item responsible-folddown"
                >
                  <!-- v-for="(item, index) in responsibleName"
                    :key="index" -->
                    <v-chip
                    v-for="(item, index) in editedItem?.responsibleName"
                    :key="index"
                    class="mr-2 mb-1 chip-custom"
                    small
                  >
                    {{ item }}
                  </v-chip>
                </div>
              </div>
              <div class="info-block w-100" v-if="changeEmployeeItem?.type">
                <div>
                  <div class="label-item mb-3">
                    Responsible Reason : 
                    {{moment(changeEmployeeItem?.created_at).format('DD.MM.YYYY - HH:mm:ss')}}
                  </div>
                  <div class="info-item">
                    {{changeEmployeeItem?.reason}}
                  </div>
                </div>
              </div>
              <!-- Start date -->
              <div class="info-block col-6">
                <div class="label-item">{{ $t('form.start_date') }} :</div>
                <div class="info-item">
                  {{ moment(time_info?.start_date).format('DD.MM.YYYY') }} - {{time_info?.start_time || '00:00:00'}}
                </div>
              </div>

              <!-- Due date -->
              <div class="info-block w-50">
                <div class="label-item">{{ $t('form.deadline') }} :</div>
                <div class="info-item">
                  {{ moment(time_info?.deadline).format('DD.MM.YYYY') }} - {{time_info?.end_time || '00:00:00'}}
                </div>
              </div>
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="btn-cancel" text @click="close">
            {{ $t('button.cancel') }}
          </v-btn>

          <v-btn class="btn-save" @click="save" v-if="isEdit && (checkAdmin || checkCreator)">
            {{ $t('button.save') }}
          </v-btn>
          <v-btn class="hse-btn-save" @click="editEmployee" v-if="status == 'new' || status == 'pending' || status == 'ongoing' || status === 'completed' || status === 'disapproved' || status === 'disapproved_with_extended' || status === 'overdue' || status === 'completed_overdue' || status === 'disapproved_overdue'">
            {{ $t('button.edit') }}
          </v-btn>
        </v-card-actions>

      </v-card>
    </v-dialog>

    <attendee-edit-popup
      :open-popup="checkNew"
      :isRemoveEmployee="false"
      :attendeeItem="editedItem"
      :attendeeObjectID="attendeeObjectID"
      :allEmployee="allEmployee"
      @closePopup="close"
      @savePopup="saveEmployee"
      titleMessage="Edit"
    />

  </div>
</template>

<script>
// import EditDetails from './EditDetails.vue'
// import EmployeeAttendee from './EmployeeAttendee.vue'
import cookies from 'js-cookie'
import AttendeeEditPopup from './AttendeeEditPopup.vue';
import StatusChip from './StatusChip.vue';


export default {
  components: { AttendeeEditPopup, StatusChip },
  name: 'review-attendee-data',
//    components: {
//     EditDetails,
//     EmployeeAttendee,
//   },
  props: {
    openPopup: Boolean,
    objectItem:{
      type : Object,
      required: false,
    },
     attendeeObjectID:{
       type: [Number , String],
      required: false,
    },
    allEmployee:{
      type: String,
      required: false,
    },
    status:{
      type: String,
      required: false
    }
  },
  data: () => ({
    userRoleId: parseInt(cookies.get('roleID')),
    userDepartmentID: parseInt(cookies.get('userDepartmentID')),
    checkAdmin: cookies.get('checkAdmin'),
    checkSuperAdmin: cookies.get('checkSuperAdmin'),
    userID: parseInt(cookies.get('userID')),
    checkCreator:false,
    checkManager:false,
    checkWorker:false,
    checkNew:false,
    isEdit:false,
    editedItem:{},
    time_info:{},
    employeeItem:{},
    changeEmployeeItem:{},
    hover: false,
    isChange : false,
    isRemove :false,
    isNew:false,
  }),

  computed: {

    },

  watch: {
    openPopup(value) {
      if (value) {
        if (this.objectItem) {
          this.editItem(this.objectItem)
        } else {
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
  created(){
    if (this.openPopup) {
       if (this.objectItem) {
          this.editItem(this.objectItem)
        } else {
          this.addNew()
        }
    }
  },

  mounted() {
    if (this.roleUser=='manager') {
      this.checkManager=true
    }
    else if(this.roleUser == 'user'){
      this.checkWorker=true
    }
  },
  methods:{

    close(){
      this.checkNew=false
      this.isEdit = false
      if (this.openPopup) {
        this.$emit('closePopup')
      }
    },
    reloadEmployee(){
      this.$emit('reloadEmployee')
    },
    saveEmployee(){
      this.reloadEmployee()
      this.$emit('closePopup')
      this.close()
    },
    editItem(item){
      let that = this
      that.$store.dispatch(`objects/getSingleAttendee` ,{ id1: that.attendeeObjectID, id2: item.process_id }).then((result) =>{
        that.editedItem = Object.assign({}, result?.processingInfo[0]);
        if (this.status == 'Reassigned') {
          that.isChange = true
          that.isRemove = false
        }else if(this.status == 'Removed'){
          that.isRemove = true
          that.isChange=false
        }else{
          that.isNew = true
          that.isRemove = false
          that.isChange=false
        }
        that.employeeItem = Object.assign({}, result);
        that.time_info=that.editedItem?.time_info
        that.changeEmployeeItem = that.editedItem?.attendee_history
        that.editedItem.responsibleName = that.employeeItem?.responsible?.employeeName
        if(result.added_by == that.userID){
          that.checkCreator = true
        }
      })
    },
    editEmployee() {
      this.checkNew = true
    },
  }
}
</script>
<style scoped>
:deep(.reson-hover-label .v-badge__wrapper .v-badge__badge) {
  inset: auto auto calc(100% - -8px) calc(100% - 103px) !important;
  background-color: #666768 !important;
}
</style>



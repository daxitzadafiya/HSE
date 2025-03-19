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
            <div class="section-connect-to section-connect-to-reminder"  :style="custClass ? 'border: 1px solid #ff5252;' : ''">
              <div
                class="section-connect-to-label section-connect-to-label-reminder"
              >
                {{ $t('form.responsible') }}
              </div>
              <div
                class="switch-component switch-component-small default-question-mark"
              >
                <label class="left-text">{{ $t('form.change') }}</label>
                <v-switch
                  :label="$t('form.remove')"
                  inset
                  v-model="isRemoveResponsible"
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
              <change-responsible
                v-if="!isRemoveResponsible"
                :object-item="editedItem"
                :edit-mode="false"
                :validate="validate"
                :allResponsible="allResponsible"
                :openRespEdit="openRespEdit"
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
import ChangeResponsible from './ChangeResponsible.vue'
import EditDetails from './EditDetails.vue'
import { removeTagsFromString } from "./common/js/functions"
export default {
  name: 'ResponsibleReasonEdit',
  components: {
    EditDetails,
    ChangeResponsible,
  },
  props: {
    employeeItem: {
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
    allResponsible:{
      type: String,
      required: false,
    }
  },
  data: () => ({
    valid: true,
    validate: true,
    custClass:false,
    newItem: {
      old_responsible_employee: '',
      old_responsible_department: '',
      new_responsible_department: '',
      new_responsible_employee: '',
      transfer_information: false,
      transfer_feedback: '',
      transfer_attachment: '',
      reason: '',
      type: '',
      object_id: '',
    },
    editedItem: {
      responsible_department_array: [],
      responsible_employee_array: [],
      isDefaultResponsible: false,
      responsible_required_comment: false,
      responsible_required_attachment: false,
      description: '',
    },
    isRemoveResponsible: false,
    openRespEdit:false
  }),
  watch: {
    openPopup(value) {
      if (value) {
        this.openRespEdit = value
        this.isRemoveResponsible=false
        this.editedItem.description = ''
        if (this.employeeItem) {
          this.editItem(this.employeeItem)
        } else {
          // this.addNew()
        }
      }
    },
  },
  created() {
    if (this.openPopup) {
      if (this.employeeItem) {
        this.editItem(this.employeeItem)
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
    reloadList() {
      this.$emit('reloadList')
    },
    async save(id) {
      let that = this
      this.editedItem.description= await removeTagsFromString(this.editedItem?.description);
              
      if (this.$refs.form.validate() && this.editedItem.description != null && this.editedItem.description != 'Powered by Froala Editor' && this.editedItem.description != 'undefined') {     
        that.newItem.object_id = id
        that.newItem.old_responsible_department =that.editedItem?.employeeDepartmentID
        that.newItem.old_responsible_employee = that.editedItem?.id
        that.newItem.new_responsible_department = JSON.stringify(that.editedItem?.responsible_department_array)
        that.newItem.new_responsible_employee = JSON.stringify(that.editedItem?.responsible_employee_array)
        that.newItem.transfer_information =that.editedItem?.responsible_required_attachment == 1 ||that.editedItem?.responsible_required_comment == 1? true: false
        that.newItem.transfer_feedback =that.editedItem?.responsible_required_comment == true ? true : false
        that.newItem.transfer_attachment =that.editedItem?.responsible_required_attachment== true ? true : false


        this.newItem.reason= await removeTagsFromString(this.editedItem?.description);


        that.newItem.type = that.isRemoveResponsible ? 'remove' : 'change'
        that.$store
          .dispatch(`objects/responsibleStatus`, { id: id, data: that.newItem })
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
          }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish()
          })
        that.close()
        that.editedItem.description = ''
        that.$emit('savePopup')
      }else{
        this.custClass=true
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
  width: 95px;
}
</style>
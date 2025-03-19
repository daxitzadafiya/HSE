<template>
  <div>
    <v-dialog v-model="openPopup" max-width="1125px" persistent>
      <v-card class="disapproved-modal">
        <v-card-title class="text-h5 justify-content-center text-capitalize">
          {{ titleMessage }}
        </v-card-title>

        <v-card-text>
          <div class="review-popup">
            <div class="text-h5 justify-content-start text-capitalize mb-5">
              {{ $t('title.prev_emp') }}
            </div>
            <div class="review-popup-table normal-table">
              <div class="info-block w-100 align-center">
                <div class="label-item">{{ $t('form.status') }}:</div>
                <div class="info-item">
                  <v-chip class="status-label-custom not-done" label v-if="objectItem.type == 'remove'">

                    {{ $t('form.remove') }}
                  </v-chip>
                  <v-chip class="status-label-custom not-done" label v-if="objectItem.type == 'change'">

                    {{ $t('form.reassigned') }}
                  </v-chip>
                </div>
              </div>

              <div class="info-block w-50 d-flex align-center">
                <div class="d-flex align-center">
                  <div class="label-item">{{ $t('form.employees') }} :</div>

                  <v-chip class="mr-2 info-item" small> {{objectItem.old_attendee_employee}} </v-chip>
                </div>
              </div>
              <div class="info-block w-50 d-flex align-center">
                <div class="d-flex align-center">
                  <div class="label-item">{{ $t('form.department') }} :</div>

                  <v-chip class="mr-2 chip-custom info-item" small>
                    {{objectItem.old_attendee_department}}
                  </v-chip>
                </div>
              </div>
              <div class="info-block w-50 chip">
                <div class="label-item">{{ $t('form.feedback') }} :</div>
                <!-- <div class="info-item" @click="employeeFeedbackDetail" v-if="objectItem.transfer_feedback">
                  {{objectItem.transfer_feedback}}
                </div> -->
                <!-- <div class="info-item"  v-if="objectItem.transfer_feedback == '' "> -->
                <div class="info-item">
                  N/A
                </div>
              </div>
              <div class="info-block w-50">
                <div class="label-item">{{ $t('form.image') }}:</div>
                <!-- <div class="info-item" @click="employeeAtteched" v-if="objectItem.transfer_attachment"> -->
                  <!-- <v-icon class="image">mdi-image</v-icon> -->
                  <!-- <img src="../assets/images/icon/image-green.png" /> -->
                  <!-- <img src="../assets/images/icon/image-gray.png"/> -->
                <!-- </div> -->
                <div class="info-item">
                  <img src="../assets/images/icon/image-gray.png"/>
                </div>
              </div>
              <!-- Added by -->
              <div cols="6" class="info-block w-50">
                <div class="label-item">{{ $t('form.added_by') }} :</div>
                <div class="info-item">
                  {{ objectItem.old_attendee_addedByName }}
                </div>
              </div>

              <!-- Responsible -->
              <div class="info-block w-50 chip responsible">
                <div class="label-item col-3 p-0">{{ $t('form.responsible') }} :</div>
                <div
                  class="info-item responsible-folddown"
                >
                  <!-- v-for="(item, index) in responsibleName"
                    :key="index" -->
                  <v-chip
                    v-for="(item, index) in objectItem.responsibleName"
                    :key="index"
                    class="mr-2 mb-1 chip-custom"
                    small
                  >
                    {{ item }}
                  </v-chip>
                </div>
              </div>
              <div class="info-block w-100">
                <div>
                  <div class="label-item mb-3">
                    Responsible Reason : {{moment(objectItem.created_at).format('DD.MM.YYYY - HH:mm:ss')}}
                  </div>

                  <div class="info-item">
                    {{objectItem.reason}}
                  </div>
                </div>
              </div>
              <!-- Start date -->
              <div class="info-block col-6">
                <div class="label-item">{{ $t('form.start_date') }} :</div>
                <div class="info-item">
                  {{ moment(time_info.start_date).format('DD.MM.YYYY') }} - {{time_info.start_time}}
                </div>
              </div>

              <!-- Due date -->
              <div class="info-block w-50">
                <div class="label-item">{{ $t('form.deadline') }} :</div>
                <div class="info-item">
                  {{ moment(time_info.deadline).format('DD.MM.YYYY') }} - {{time_info.end_time}}
                </div>
                <!-- <div class="info-item" v-else @click.stop>Not Applicable</div> -->
              </div>
            </div>
          </div>
          <div class="review-popup" v-if="objectItem.type !== 'remove'">
            <div
              class="text-h5 justify-content-start text-capitalize mb-5 mt-7"
            >
              {{ $t('title.new_emp') }}
            </div>
            <div class="review-popup-table normal-table">
              <div class="info-block w-100 align-center">
                <div class="label-item">{{ $t('form.status') }}:</div>
                <div class="info-item">
                  <v-chip class="status-label-custom ongoing" label>
                    {{ $t('form.ongoing') }}
                  </v-chip>
                </div>
              </div>

              <div class="info-block w-50 d-flex align-center">
                <div class="d-flex align-center">
                  <div class="label-item">{{ $t('form.employees') }} :</div>

                  <v-chip class="mr-2 info-item" small>{{objectItem.new_attendee_employee}}</v-chip>
                </div>
              </div>
              <div class="info-block w-50 d-flex align-center">
                <div class="d-flex align-center">
                  <div class="label-item">{{ $t('form.department') }} :</div>

                  <v-chip class="mr-2 chip-custom info-item" small>
                    {{objectItem.new_attendee_department}}
                  </v-chip>
                </div>
              </div>
              <div class="info-block w-50 chip">
                <div class="label-item">{{ $t('form.feedback') }} :</div>
                <!-- <div class="info-item" @click="employeeFeedbackDetail" v-if="objectItem.transfer_feedback">
                  {{objectItem.transfer_feedback}}
                </div> -->
                <div class="info-item" >
                  N/A
                </div>
              </div>
              <div class="info-block w-50">
                <div class="label-item">{{ $t('form.image') }}:</div>
                <!-- <div class="info-item" @click="employeeAtteched" v-if="objectItem.transfer_attachment"> -->
                  <!-- <v-icon class="image">mdi-image</v-icon> -->
                  <!-- <img src="../assets/images/icon/image-green.png" /> -->
                  <!-- <img src="../assets/images/icon/image-gray.png"/> -->
                <!-- </div> -->
                <div class="info-item">
                  <img src="../assets/images/icon/image-gray.png"/>
                </div>
              </div>
             <!-- Added by -->
              <div cols="6" class="info-block w-50">
                <div class="label-item">{{ $t('form.added_by') }} :</div>
                <div class="info-item">
                  {{ objectItem.updated_by }}
                </div>
              </div>

              <!-- Responsible -->
              <div class="info-block w-50 chip responsible">
                <div class="label-item col-3 p-0">{{ $t('form.responsible') }} :</div>
                <div
                  class="info-item responsible-folddown"
                >
                  <!-- v-for="(item, index) in responsibleName"
                    :key="index" -->
                  <v-chip
                    v-for="(item, index) in objectItem.responsibleName"
                    :key="index"
                    class="mr-2 mb-1 chip-custom"
                    small
                  >
                    {{ item }}
                  </v-chip>
                </div>
              </div>
              <!-- Start date -->
              <div class="info-block col-6">
                <div class="label-item">{{ $t('form.start_date') }} :</div>
                <div class="info-item">
                  {{ moment(time_info.start_date).format('DD.MM.YYYY') }} - {{time_info.start_time}}
                </div>
              </div>

              <!-- Due date -->
              <div class="info-block w-50">
                <div class="label-item">{{ $t('form.deadline') }} :</div>
                <div class="info-item">
                  {{ moment(time_info.deadline).format('DD.MM.YYYY') }} - {{time_info.end_time}}

                  <!-- {{ '26.02.2023' }} -->
                </div>
                <!-- <div class="info-item" v-else @click.stop>Not Applicable</div> -->
              </div>
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="pb-7">
          <v-spacer />
          <v-btn class="btn-cancel" text @click="close">
            {{ $t('button.cancel') }}
          </v-btn>

          <!-- <v-btn class="btn-save" @click="save">
                        {{ $t('button.save') }}
                    </v-btn> -->
        </v-card-actions>
      </v-card>
    </v-dialog>
    <reason-popup
      :open-popup="employeeFeedback"
      @closePopup="employeeFeedback = !employeeFeedback"
      :titleMessage="$t('form.feedback')"
      :addDescription="addDescription"
    />
    <image-popup
      :open-popup="employeeImage"
      @closePopup="employeeImage = !employeeImage"
      :titleMessage="$t('form.image')"
      :addImage="addImage"
    />
  </div>
</template>

<script>
import ImagePopup from './ImagePopup.vue'
import ReasonPopup from './ReasonPopup.vue'
export default {
  components: { ReasonPopup, ImagePopup },
  name: 'prev-new-employee-popup',
  props: {
    objectItem: {
      type: Object,
      required: false,
    },
    openPopup: Boolean,
    categoriesArray: Array,
    titleMessage: {
      type: String,
      required: false,
    },
    item: {
      type: [Object, Array],
      required: false,
    },
    responsible_name:{
         type: [Object, Array],
      required: false,
    },
    time_info:{
      type: Object,
      required: false,
    }
  },
  data: () => ({
    employeeImage: false,
    employeeFeedback: false,
    addImage: 'screenImage',
    addDescription:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis vulputate libero et velit interdum, ac aliquet odio mattis.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum.',
    requestDeadline: false,
    deadline: '',
    deadline_pre: '',
    editedItem: {
      description: '',
      deadline: '',
      deadline_pre: '',
      isRecurring: '',
    },
    defaultItem: {
      description: '',
      deadline: '',
      deadline_pre: '',
      isRecurring: '',
    },
  }),
  watch: {},
  methods: {
    close() {
      this.isEdit = false
      if (this.openPopup) {
        this.$emit('closePopup')
      }
    },
    save() {
      // update
      let that = this
      that.close()
    },
    employeeFeedbackDetail() {
      this.employeeFeedback = true
    },
    employeeAtteched() {
      this.employeeImage = true
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
.review-popup {
  width: 1050px;
}
</style>
<template>
  <div>
    <v-dialog v-model="openPopup" scrollable max-width="1125px" persistent>
      <v-card>
        <!--        <v-card-title class="text-h5 justify-content-center text-uppercase">-->
        <!--          {{ $t('title.review_task') }}-->
        <!--        </v-card-title>-->
        <v-card-text>
          <div class="popup-header text-center">
            {{ $t('title.review_task') }}
          </div>
          <div class="review-popup">
            <!-- Accepted message -->
            <!-- <v-btn
              v-if="editedItem?.status === 'closed'"
              tile
              color="success"
              class="btn-label-custom green-btn-label mb-4"
            >
              <v-icon left> mdi-check-circle </v-icon>
              {{ $t('message.task_accept_by_responsible') }}
            </v-btn> -->
            <!-- Declined message -->
            <!-- <div
              v-if="editedItem?.status === 'reopened'"
              class="question-mark-custom mt-6"
            >
              <v-btn
                tile
                color="error"
                class="btn-label-custom red-btn-label mb-4"
                @click="dialogDeclineComment = true"
              >
                <v-icon left> mdi-alert-circle </v-icon>
                {{ $t('message.task_decline_by_responsible') }}
              </v-btn>
              <v-badge
                :value="hoverQuestionMark"
                right
                transition="slide-x-transition"
                class="hse--icon-question-circle"
                :content="$t('message.hover_decline_comment')"
              >
                <v-hover v-model="hoverQuestionMark">
                  <i class="fa fa-question-circle"></i>
                </v-hover>
              </v-badge>
            </div> -->
            <div class="review-popup-table normal-table">
              <!-- Progress bar -->
              <div
                v-if="
                  (checkAdmin || checkCreator || checkResponsible) &&
                  editedItem?.status != 'closed'
                "
                class="info-block progress-field w-50"
              >
                <div class="label-item">{{ $t('form.progress') }}:</div>
                <div class="info-item">
                  <v-progress-linear
                    height="25"
                    :color="
                      !checkResponsible && !checkCreator && !checkAdmin ? userProgressColor : checkResponsible ? userProgressColor : respProgressColor"
                    :value="
                      (!checkResponsible && !checkCreator) && !checkAdmin ? userRate: checkResponsible? userRate: total_rate"
                  >
                    <strong class="font-weight-bold" style="color: #141b04">
                      <!-- {{ editedItem?.rate }}% -->
                      {{
                        checkResponsible
                          ? userRate + ' ' + '%'
                          : total_rate + ' ' + '%'
                      }}
                    </strong>
                  </v-progress-linear>

                  <!-- <v-progress-linear
                    height="25"
                    :color="!checkResponsible && !checkCreator ? userProgressColor : checkResponsible ? userProgressColor :respProgressColor"
                    :value="!checkResponsible && !checkCreator ? userRate : checkResponsible ? userRate : total_rate"
                  >
                    <strong class="font-weight-bold" style="color:#212121">
                      {{ checkResponsible ? userRate + ' ' + '%' : total_rate + ' ' + '%' }}
                    </strong>
                  </v-progress-linear> -->
                </div>
              </div>

              <!-- Status -->
              <div
                v-if="(!checkResponsible && !checkCreator && !checkAdmin) || (editedItem?.status == 'closed')
                "
                class="info-block w-50 align-center"
              >
                <div class="label-item">{{ $t('form.status') }}:</div>
                <!-- <div class="info-item">
                  <div v-if="attendeeProcessStatus === 'new' || attendeeProcessStatus === 'reopened'">{{ $t('form.new') }}</div>
                  <div v-else>
                    <v-icon small class="icon-custom image">mdi-checkbox-marked-circle</v-icon>
                    <v-icon v-if="attendeeProcessItem.comment" class="icon-custom image">mdi-file-document</v-icon>
                    <v-icon v-if="attendeeProcessItem.image" class="icon-custom image">mdi-image</v-icon>
                  </div>
                </div> -->

                <status-chip
                  :status="editedItem?.status"
                  :inReview="true"
                  :inRisk="false"
                  :addDescription="addDescription" 
                  :addImage="addImage" 
                  :extended_date="processingItem?.extended_timeline?.old_deadline ? true :false "
                />
              </div>

              <!-- <div
                v-if="editedItem?.status === 'closed' && !checkWorker"
                class="info-block w-50 align-center"
              >
                <div class="label-item">{{ $t('form.status') }} :</div>
                <v-chip
                  v-if="editedItem?.status === 'closed'"
                  color="green"
                  outlined
                  class="border-0"
                >

                <v-chip
                  class="info-item status-label-custom approved"
                  label
                >
                  {{ $t('form.closed') }}
                </v-chip>
                </v-chip>
              </div> -->

              <!-- Function -->
              <div class="info-block w-50">
                <div class="label-item">{{ $t('form.function') }}:</div>
                <div class="info-item">
                  <span v-if="editedItem?.source === 'Goal'">
                    {{ $t('form.goal') }}
                  </span>
                  <span v-if="editedItem?.source === 'routine'">
                    {{ $t('title.routine') }}
                  </span>
                  <span v-if="editedItem?.source === 'risk-analysis'">
                    {{ $t('form.risk_analysis') }}
                  </span>
                  <span v-if="editedItem?.source === 'document'">
                    {{ $t('tab.documents') }}
                  </span>
                   <span v-if="editedItem?.source === 'deviation'">
                    {{ $t('title.deviation') }}
                  </span>
                  <span v-if="editedItem?.source === 'risk'">
                    {{ $t('form.risk_analysis') }}
                  </span>
                   <span v-if="editedItem?.source === 'report'">
                    {{ $t('form.report') }}
                  </span>
                  <v-icon v-if="editedItem?.source !== 'Task'">
                    mdi-chevron-right
                  </v-icon>
                  <span>
                    {{ $t('form.task') }}
                  </span>
                </div>
              </div>

              <!-- Name -->
              <div class="info-block w-50 align-center">
                <div class="label-item">{{ $t('form.name') }}:</div>
                <div
                  v-if="!isEdit"
                  class="info-item"
                  @click="
                    (checkAdmin || checkCreator) && !inReportData && !checkEdit && editedItem?.source == 'Task'
                      ? (isEdit = !isEdit)
                      : (isEdit = false)
                  "
                >
                  {{ editedItem?.name }}
                </div>
                <div v-else class="input-wrap w-100 mb-n4">
                  <v-text-field
                    v-model="editedItem.name"
                    :rules="required"
                    outlined
                  />
                </div>
              </div>

              <!-- Category -->
              <div class="info-block w-50 align-center">
                <div class="label-item">{{ $t('form.category') }}:</div>
                <div
                  v-if="!isEdit"
                  class="info-item"
                  @click="
                    (checkAdmin || checkCreator) && !inReportData && !checkEdit && editedItem?.source == 'Task'
                      ? (isEdit = !isEdit)
                      : (isEdit = false)
                  "
                >
                  {{ editedItem?.categoryName }}
                </div>
                <div v-else class="w-100">
                  <Category
                    :object-item="editedItem"
                    :type-category="'task'"
                    class="mb-n4"
                    @getNewCategory="getNewCategory"
                  />
                </div>
              </div>

              <!-- Description -->
              <div :class="isEdit ? 'info-block' : 'info-block description'">
                <div class="label-item">{{ $t('form.description') }}:</div>
                <div
                  v-if="!isEdit"
                  class="info-item"
                  @click=" 
                  (checkAdmin || checkCreator) && !inReportData && !checkEdit && editedItem?.source == 'Task'
                      ? (isEdit = !isEdit)
                      : (isEdit = false)
                  "
                >
                  {{ editedItem?.description }}
                </div>
                <div v-else class="input-wrap form-description">
                  <FroalaSuggestionListEditor
                    :item="editedItem"
                    :predefined-link-array="predefinedLinkArray"
                  />
                </div>
              </div>
              <div
                class="info-block w-100"
                v-if="(processExtendItem?.length != 0 && 
                  (editedItem?.status === 'disapproved' ||
                  editedItem?.status === 'disapproved_with_extended' || editedItem?.status === 'disapproved_overdue' ||
                  editedItem?.status === 'timeline_disapproved' ||
                  editedItem?.status === 'completed_overdue' || editedItem?.status === 'completed' ||
                  editedItem?.status === 'approved_overdue' || editedItem?.status === 'approved'))
                "
              >
                <div class="w-100">
                  <div class="label-item mb-3 d-flex justify-content-between">

                    {{processExtendItem?.type == 'attendee' && processExtendItem?.status === 'Approved' ? 'Approved' : 'Disapproved'}}
                    {{
                      (editedItem?.status === 'timeline_disapproved' || editedItem?.status === 'approved_overdue' || 
                      editedItem?.status === 'completed'|| editedItem?.status === 'approved' || editedItem?.status === 'completed_overdue') && (processExtendItem?.type === 'attendee') ? 'Request' : 'Task'
                    }}
                    Date:
                    {{moment(processingItem?.extended_timeline?.created_at).format('DD.MM.YYYY HH:mm a')}}


                    <span
                v-if="
                  ( 
                  ((editedItem?.status === 'completed'|| editedItem?.status === 'approved'|| editedItem?.status === 'completed_overdue' ||  editedItem?.status === 'approved_overdue' || editedItem?.status === 'disapproved_with_extended' ) &&
                   ((!nullTime && !nullDate && processExtendItem?.type == 'responsible') ||
                    (processExtendItem?.type == 'attendee' && processExtendItem?.status === 'Approved')
                   ))
                  )"

                >Extend Time date:{{
                  moment(processingItem?.extended_timeline?.deadline_date
                  ).format('DD.MM.YYYY')
                }}
                {{ processingItem?.extended_timeline?.deadline_time }}
              </span
              >
                  </div>
                  <div class="info-item">
                    {{ processingItem?.extended_timeline?.extended_by_reason }}
                  </div>
                </div>
              </div>

              <!-- Added by -->
              <div v-if="!checkSuperAdmin" class="info-block w-50">
                <div class="label-item">{{ $t('form.added_by') }}:</div>
                <div class="info-item">
                  {{
                    editedItem?.report_as_anonymous == 1
                      ? 'Anonymous'
                      : editedItem?.addedByName
                  }}
                </div>
              </div>

              <div v-if="isRiskAnalysis" class="info-block w-100">
                <div>
                  <div class="label-item mb-3">
                    Manager Feedback : 25.11.2022 10:30 AM
                  </div>
                  <div class="info-item">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nunc vulputate libero et velit interdum, ac aliquet odio
                    mattis.Lorem ipsum dolor sit amet, consectetur adipiscing
                    elit. Nunc vulputate libero et velit interdum, ac aliquet
                    odio mattis.Lorem ipsum dolor sit amet, consectetur
                    adipiscing elit. Nunc vulputate libero et velit interdum, ac
                    aliquet odio mattis.Lorem ipsum dolor sit amet, consectetur
                    adipiscing elit. Nunc vulputate libero et velit interdum, ac
                    aliquet odio mattis. utate libero et velit interdum, ac
                    aliquet odio mattis.
                  </div>
                </div>
              </div>

              <!-- Responsible -->
              <div v-if="!checkSuperAdmin" class="info-block chip w-50">
                <div class="label-item">{{ $t('form.responsible') }}:</div>
                <div
                  class="info-item d-flex justify-content-between responsible-folddown w-75"
                >
                  <div>
                    <v-chip
                      v-for="(item, index) in responsibleName"
                      :key="index"
                      class="mr-2 mb-1 chip-custom"
                      small
                    >
                      {{ item }}
                    </v-chip>
                  </div>

                  <div :class="!isEdit ? 'w-25 text-right' : ''">
                    <img
                      v-if="!isEdit && (checkAdmin || checkCreator)"
                      class="reminder-img"
                      src="../assets/images/icon/reminder-history.png"
                      alt="file.png"
                      @click.stop="
                        checkAdmin || checkCreator
                          ? (responsible_History = !responsible_History)
                          : (responsible_History = false)
                      "
                    />
                  </div>
                </div>
                <!-- <div v-else>
                  <ResponsibleEdit :object-item="editedItem" />
                </div> -->
              </div>

              <!-- Require comment -->
              <!--              <div v-if="!checkSuperAdmin" class="info-block">-->
              <!--                <div class="label-item">-->
              <!--                  {{ $t('form.required') }}-->
              <!--                </div>-->
              <!--                <div class="info-item"></div>-->
              <!--              </div>-->

              <!-- Start date -->
              <div v-if="!checkSuperAdmin" class="info-block w-50 align-center">
                <div class="label-item col-3 p-0 mr-n6">
                  {{ $t('form.start_date') }}:
                </div>
                <!-- View -->
                <div
                  v-if="!isEdit"
                  class="info-item"
                  @click="
                    (checkAdmin || checkCreator) && !inReportData && !checkEdit && editedItem?.source == 'Task'
                      ? (isEdit = !isEdit)
                      : (isEdit = false)
                  "
                >
                  {{ moment(editedItem?.start_date).format('DD.MM.YYYY') }} 
                  {{ editedItem?.start_time && ' - ' + editedItem?.start_time }}
                </div>
                <!-- Edit -->
                <div v-else class="w-100">
                  <StartDateEdit
                    :object-item="editedItem"
                    class="mb-n4"
                    @changeDate="changeStartDate"
                  />
                </div>
              </div>

              <!-- Deadline -->
              <div v-if="!checkSuperAdmin" class="info-block w-50 align-center">
                <div class="label-item col-2 p-0">
                  {{ $t('form.deadline') }}:
                </div>
                <div
                  class="info-item"
                  v-if="
                    (!checkWorker && !isEdit) ||
                    (checkWorker &&
                  (editedItem?.status === 'new' ||
                    editedItem?.status === 'pending' ||
                    editedItem?.status === 'ongoing' ||
                    editedItem?.status === 'disapproved' ||
                     editedItem?.status === 'Reassigned' || 
                     editedItem?.status === 'Removed') ||
                    ((editedItem?.status === 'completed_overdue'|| 
                    editedItem?.status === 'approved' ||
                    editedItem?.status === 'completed' || 
                    editedItem?.status === 'approved_overdue') &&
                  (((nullTime ||  nullDate) && processExtendItem?.type == 'responsible') || 
                  (processExtendItem?.type == 'attendee' && processExtendItem?.status === 'Disapproved'))))
                  "
                >
                  {{
                    !editedItem?.deadline
                      ? moment(editedItem?.start_date)
                          .add(1, 'days')
                          .format('DD.MM.YYYY')
                      : moment(editedItem?.deadline).format('DD.MM.YYYY')
                  }}
                   {{editedItem?.end_time && ' - ' +  editedItem?.end_time }}
                </div>

                <div
                  v-else-if="
                    checkWorker && processExtendItem?.length != 0 &&
                    ((editedItem?.status === 'request' || editedItem?.status === 'overdue' || editedItem?.status === 'disapproved_with_extended' || declineRequest) ||
                  ((editedItem?.status === 'approved_overdue' || editedItem?.status === 'completed_overdue' || editedItem?.status === 'completed' || editedItem?.status === 'approved') && ((!nullTime || !nullDate && processExtendItem?.type == 'responsible') || (processExtendItem?.type == 'attendee' && processExtendItem?.status === 'Approved'))))
                  "
                  class="d-flex"
                >

                  <span v-if="(processExtendItem?.type == 'attendee' && processExtendItem?.status === 'Approved')|| ((!nullTime || !nullDate) &&
                  processExtendItem?.type == 'responsible') || (editedItem?.status === 'request' || editedItem?.status === 'overdue' || editedItem?.status === 'disapproved_with_extended' || declineRequest)" :class="declineRequest ? '' : 'text-decoration-line-through'">{{
              moment(processingItem?.extended_timeline?.old_deadline).format(
                'DD.MM.YYYY'
              )
            }}{{editedItem?.end_time && ' - ' +  editedItem?.end_time }}</span>
            

                  <v-chip v-if="(processExtendItem?.type == 'attendee' && processExtendItem?.status === 'Approved')|| ((!nullTime || !nullDate) &&
                  processExtendItem?.type == 'responsible') || (editedItem?.status === 'request' || editedItem?.status === 'overdue' || editedItem?.status === 'disapproved_with_extended' || declineRequest)"
              class="rounded-xl status-label-custom ongoing deadline-chip ml-2"
              :class="declineRequest ? 'text-decoration-line-through' : ''"
              small
            >
              {{
                moment(processingItem?.extended_timeline?.deadline_date).format(
                  'DD.MM.YYYY'
                )
              }}
               {{processingItem?.extended_timeline?.deadline_time && ' - ' + processingItem?.extended_timeline?.deadline_time }}
            </v-chip>
                </div>
                <div v-else-if="!isEdit">
                  {{
                    !editedItem?.deadline
                      ? moment(editedItem?.start_date)
                          .add(1, 'days')
                          .format('DD.MM.YYYY')
                      : moment(editedItem?.deadline).format('DD.MM.YYYY')
                  }}
                   {{editedItem?.end_time && ' - ' +  editedItem?.end_time }}
                </div>
                <div
                  v-if="
                    checkWorker &&
                    !hideExtendTimeline &&
                    checkEdit &&
                    checkAttendee
                  "
                  class="d-flex"
                >
                  <div
                    class="mx-2 deactivation-icon"
                    @mouseover="hoverItem = true"
                  >
                    <img
                      src="../assets/images/icon/deactivation-calender-icon.svg"
                      alt=""
                      srcset=""
                    />
                  </div>
                  <v-btn
                    @click="sendRequest()"
                    text
                    v-if="hoverItem"
                    color="error"
                    @mouseleave="hoverItem = false"
                    class="hover-item"
                  >
                    {{ $t('form.request_extention') }}
                  </v-btn>
                </div>
                <!-- <div class="info-item" v-else @click.stop>Not Applicable</div> -->
                <div v-else-if="isEdit" class="w-100">
                  <DeadlineEdit
                    :object-item="editedItem"
                    :item="editedItem"
                    :change-custom="changeDeadlineCustom"
                    class="mb-n4"
                    :extend-date="true"
                    :extend-time="true"
                  />
                </div>
              </div>
              <!-- View -->
              <!-- <div
                  v-if="!isEdit"
                  class="info-item"
                  @click="
                    (checkAdmin || checkCreator) && !inReportData && !checkEdit 
                      ? (isEdit = !isEdit)
                      : (isEdit = false)
                  "
                >
                  {{ moment(editedItem?.deadline).format('DD.MM.YYYY') }}
                </div> -->
              <!-- Edit -->
            </div>


            <div class="review-popup-table normal-table" v-if="(editedItem?.source === 'deviation' || editedItem?.source === 'risk') && sourceObjectData">
              <div class="info-block w-50">
                  <div class="label-item">{{ $t('form.reported_by') }}:</div>
                  <div class="info-item">
                    {{ sourceObjectData?.report_as_anonymous == 1 ? 'Anonymous' : sourceObjectData?.added_by_name }}
                  </div>
                </div>
                <div
                  class="info-block chip w-50"
                >
                  <div class="label-item">{{ $t('form.reported') }}:</div>
                  <div class="info-item">
                    {{ moment(editedItem.created_at).format('DD.MM.YYYY') }}
                  </div>
                </div>

                <div class="info-block w-50">
                  <div class="label-item">{{ $t('form.place') }}:</div>
                  <div class="info-item">
                    {{ sourceObjectData?.place && sourceObjectData?.place?.place_name }}
                  </div>
                </div>

                <div class="info-block w-50">
                  <div class="label-item">{{ $t('form.place_detail') }}:</div>
                  <div class="info-item">
                    {{ sourceObjectData?.place_detail }}
                  </div>
                </div>

                <div class="info-block w-50">
                  <div class="label-item">{{ $t('form.consequence') }}:</div>
                  <div class="info-item">
                    {{sourceObjectData?.consequence_for && sourceObjectData?.consequence_for?.name}}
                  </div>
                  <!-- <div class="info-item" v-else-if="editedItem.consequence_for==2" >Customer</div>
                  <div class="info-item" v-else>Other</div> -->
                </div>
                <div class="info-block w-50">
                  <div class="label-item">
                    {{ $t('form.consequence_detail') }}:
                  </div>
                  <div class="info-item">
                    {{ sourceObjectData?.consequence_detail }}
                  </div>
                  <!-- <div class="info-item" v-else-if="editedItem.consequence_for==2" >Customer</div>
                  <div class="info-item" v-else>Other</div> -->
                </div>

                <div class="info-block w-50">
                  <div class="label-item">
                    {{ $t('form.suggested_corrective_action') }}:
                  </div>
                  <div class="info-item">
                    {{ sourceObjectData?.prososial_action }}
                  </div>
                </div>
                <div class="info-block w-50 chip">
                  <div class="label-item">{{ $t('form.attachment') }}:</div>
                  <div v-if="sourceObjectData?.attachment" class="info-item">
                    <!-- <div v-if="editedItem.attachment" class="info-item" > -->
                    <img
                      src="~assets/images/attachment.png"
                      alt=""
                      class="ml-2 document-attachment"
                      @click="employeeAtteched(sourceObjectData?.attachment)"
                    />
                  </div>
                  <div v-else class="info-item">N/A</div>
                </div>

                
                <div
                  class="info-block chip w-50"
                >
                  <div class="label-item">{{ $t('form.security') }}:</div>
                  <div class="info-item">
                    {{ sourceObjectData?.is_public == 1? 'Shared' : 'Personal'}}
                  </div>
                </div>
                <div
                  class="info-block w-50 chip"
                >
                  <div class="label-item">
                    {{ $t('form.has_it_happened_before') }}:
                  </div>
                  <div class="info-item">
                    {{ sourceObjectData.happened_before == 1 ? 'Yes' : 'No' }}
                  </div>
                </div>
                <div
                  class="info-block w-50 chip"
                >
                  <div class="label-item">
                    {{ $t('form.corrective_actions') }}:
                  </div>
                  <div class="info-item">
                    {{ sourceObjectData.corrective_action }}
                  </div>
                </div>
                <div
                  class="info-block w-50 chip"
                >
                  <div class="label-item">
                    {{ $t('form.legal_specifications') }}:
                  </div>
                  <div class="info-item">
                    {{ sourceObjectData.specifications }}
                  </div>
                </div>
                <!-- <div
                  class="info-block w-50 chip"
                >
                  <div class="label-item">
                    {{ $t('form.task_processed_by') }} :
                  </div>
                  <div class="info-item">
                    <v-chip 
                      v-for="(item, index) in taskResponsibleName"
                      :key="index"
                      class="mr-2 mb-1 chip-custom"
                      small
                    >
                      {{ item }}
                    </v-chip>
                  </div>
                </div> -->
            </div>
            <!-- Attendee -->
            <!-- <div
              v-if="checkAdmin || checkCreator || checkResponsible"
              class="review-popup-table"
            >
              <v-data-table
                :headers="computedHeaders"
                :items="editedItem?.processingInfo"
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
                      {{ $t('form.attendee') }}
                    </v-toolbar-title>
                  </v-toolbar>
                </template>
                <template v-slot:item.comment="{ item }">
                  <span v-if="item.comment">{{ item.comment }}</span>
                  <span v-else>N/A</span>
                </template>
                <template v-slot:item.image="{ item }">
                  <span v-if="item.image">
                    <v-icon class="icon-custom image">mdi-image</v-icon>
                  </span>
                  <span v-else>N/A</span>
                </template>
                <template v-slot:item.status="{ item }">
                  <v-chip
                    v-if="item.status === 'new' && compareToday(editedItem?.start_date)"
                    class="ma-2 status-label-custom pending"
                    label
                  >
                    {{ $t('form.new') }}
                  </v-chip>
                  <v-chip
                    v-else-if="item.status === 'new' && !compareDate(editedItem?.start_date)"
                    class="ma-2 status-label-custom pending"
                    label
                  >
                    {{ $t('form.pending') }}
                  </v-chip>
                  <v-chip
                    v-else-if="item.status === 'new' && compareDate(editedItem?.start_date)"
                    class="ma-2 status-label-custom ongoing"
                    label
                  >
                    {{ $t('form.ongoing') }}
                  </v-chip>
                </template>
                <template v-slot:item.actions="{ item }">
                  <div v-if="item.status === 'verify' || item.status === 'closed'">
                    <v-btn
                      text
                      color="success"
                    >
                      {{ $t('form.accepted') }}
                    </v-btn>
                    <v-chip
                      color="green"
                      outlined
                      class="border-0"
                    >
                      {{ $t('form.verify') }}
                      <v-icon right>mdi-check-circle</v-icon>
                    </v-chip>
                  </div>
                  <div v-else-if="item.status === 'reopened'">
                    <v-btn
                      text
                      color="error"
                    >
                      {{ $t('form.declined') }}
                    </v-btn>
                    <v-chip
                      color="green"
                      outlined
                      class="border-0"
                    >
                      {{ $t('form.verify') }}
                      <v-icon right>mdi-check-circle</v-icon>
                    </v-chip>
                  </div>
                  <div v-else-if="checkResponsible && item.status === 'done'">
                    <v-btn
                      text
                      color="success"
                      @click="responsibleAddRequiredComment(item, 'verify')"
                    >
                      {{ $t('form.accept') }}
                    </v-btn>
                    <v-btn
                      text
                      color="error"
                      @click="responsibleAddRequiredComment(item, 'reopened')"
                    >
                      {{ $t('form.decline') }}
                    </v-btn>
                  </div>
                </template>
                <template v-slot:no-data>
                  {{ $t('table.no_data') }}
                </template>
              </v-data-table>
            </div> -->
            <v-data-table v-if="selectedTopic.length > 0"
          :headers="reportHeaders"
          :items="selectedTopic"
          :items-per-page="5"
          :single-expand="true"
              :sort-by="['created_at']"
              :sort-desc="[true, false]"
          class="elevation-1 review-table review-popup-table px-1 border mt-4"
          hide-default-footer
        >
          <template slot="top">
            <v-toolbar flat class="align-center">
              <v-toolbar-title>
                {{selectedTopic?.[0]?.topic_name}}
              </v-toolbar-title>
            </v-toolbar>
          </template>
          <template v-slot:item.checkName="{ item }">
            {{item?.name}}
          </template>
          <template v-slot:item.comment="{ item,index }">
              <div>
                <img src="../assets/images/gridIcon/comment_fill_red.png" alt="" srcset="" v-if="item?.description" @click="attendeeReason(item?.description)"> 
                <img src="../assets/images/gridIcon/comment.png" alt="" srcset="" v-else>
              </div>
          </template>
          <template v-slot:item.image="{ item, index }">
            <img
              src="../assets/images/icon/image-red.png"
              v-if="item?.file"
              @click="employeeAtteched(item?.file)"
            />
            <img v-else
              src="../assets/images/icon/image-gray.png"
              @click.stop
              />
          </template>
          <template v-slot:item.options="{ item }">
            {{item?.answer_name}}
          </template>
        </v-data-table>
            <div class="manage-task my-6" v-if="source_of_danger?.length > 0">
              <v-data-table
                :headers="riskHeaders"
                :items="source_of_danger"
                class="elevation-1 review-table review-popup-table hse-table"
                :items-per-page="15"
                :single-expand="true"
                :sort-by="['created_at']"
                :sort-desc="[true, false]"
                hide-default-footer
              >
                <template v-slot:top>
                  <v-toolbar flat>
                    <v-toolbar-title
                      class="component-sub-goal title-manage-task"
                    >
                      {{ $t('title.add_source_of_danger') }}
                      <!-- <v-icon
                      class="icon-plus-circle ml-2"
                      @click="addNewItem(true)"
                    >
                      mdi-plus-circle
                    </v-icon> -->
                    </v-toolbar-title>
                  </v-toolbar>
                </template>
                <template v-slot:item.probability="{ item }">
                  {{ translateLevel(item?.probability) }}
                </template>
                <template v-slot:item.type> Report </template>
                <template v-slot:item.consequence="{ item }">
                  {{ translateLevel(item?.consequence) }}
                </template>
                <template v-slot:item.risk_level="{ item }">
                  <div
                    v-if="
                      item?.risk_level &&
                      item?.risk_level >= 1 &&
                      item?.risk_level <= 3
                    "
                    class="source-of-danger-color-code color-green d-inline-block"
                  >
                    {{ item?.risk_level }}
                  </div>
                  <div
                    v-if="
                      item?.risk_level &&
                      item?.risk_level >= 4 &&
                      item?.risk_level <= 10
                    "
                    class="source-of-danger-color-code color-yellow d-inline-block"
                  >
                    {{ item?.risk_level }}
                  </div>
                  <div
                    v-if="
                      item?.risk_level &&
                      item?.risk_level >= 11 &&
                      item?.risk_level <= 15
                    "
                    class="source-of-danger-color-code color-orange d-inline-block"
                  >
                    {{ item?.risk_level }}
                  </div>
                  <div
                    v-if="item?.risk_level && item?.risk_level === 16"
                    class="source-of-danger-color-code color-red d-inline-block"
                  >
                    {{ item?.risk_level }}
                  </div>
                </template>
              </v-data-table>
            </div>

            <ChangeEmployeeTable
              v-if="!checkWorker && !isEdit"
              :AttendeeHeaders="AttendeeHeaders"
              :isReminder="true"
              :attendeeArray="attendeeArray"
              :processExtendItem="processExtendItem"
              :attendeeHistoryData="attendeeHistory"
              :attendeeObjectID="attendeeObjectID"
              :checkResponsiblePersone="checkResponsible"
              :isReminderHistory="isReminderHistory"
              :showExpand="showExpand"
              :checkEdit="checkEdit"
              :allEmployee="allEmployee"
              @is_reminder_history="is_reminder_history"
              @reloadEmployee="reloadEmployee"
              @statusApprovedAction="statusApprovedAction"
              @statusDisapprovedAction="statusDisapprovedAction"
              @approvedReqestDate="approvedReqestDate"
              @declineReqestDate="declineReqestDate"
            />

            <v-data-table
              v-if="!isEdit && checkCreator && responsible_History"
              @click="
                checkAdmin || checkCreator
                  ? (isEdit = !isEdit)
                  : (isEdit = false)
              "
              :headers="ResponsibleHistoryHeaders"
              :items="resp_list"
              class="elevation-1 review-table review-popup-table mt-5"
              :items-per-page="15"
              :single-expand="true"
              :sort-by="['created_at']"
              :sort-desc="[true, false]"
              hide-default-footer
              @click:row="respChange"
            >
              <template slot="top">
                <v-toolbar flat class="align-center">
                  <v-toolbar-title>
                    {{ $t('title.responsible_history') }}
                  </v-toolbar-title>
                </v-toolbar>
              </template>
              <template v-slot:item.attendeeName="{ item }">
                <v-hover
                  v-slot:default="{ hover }"
                  v-if="item?.status == 'Removed' || item?.status == 'Reassigned'"
                >
                  <v-badge
                    :value="hover"
                    transition="slide-x-transition"
                    class="hse--icon-question-circle hover-label"
                  >
                    <span slot="badge" v-if="item?.status == 'Removed'">{{
                      'Removed : ' +
                      item?.responsible_history?.old_responsible_employee
                    }}</span>
                    <span
                      slot="badge"
                      v-else-if="item?.status == 'Reassigned'"
                      >{{
                        'Reassigned : ' +
                        item?.responsible_history?.new_responsible_employee
                      }}</span
                    >
                    <!-- <div :class="item.status == 4 ? 'disabled' : (item.status === 5 ? 'disabled' : '')"> -->
                    <div :class="'disabled'">
                      {{ item?.name || item?.subject || item?.employeeName }}
                    </div>
                  </v-badge>
                </v-hover>
                <div
                  v-else-if="
                    item?.status !== 'Removed' || item?.status !== 'Reassigned'
                  "
                >
                  {{ item?.employeeName }}
                </div>
              </template>
              <template v-slot:item.reason="{ item }">
                <!-- <span v-if="item.decscription == null || item.comment == null">N/A</span>
                <span @click.stop="attendeeReason(item.decscription)" v-else>{{item.decscription}}</span> -->

                <div
                  v-if="item?.status == 'Removed' || item?.status == 'Reassigned'"
                  :class="
                    item?.status == 'Removed' || item?.status == 'Reassigned'
                      ? 'disabled'
                      : ''
                  "
                >
                  N/A
                </div>
                <div v-else>
                  <span
                    v-if="
                      item?.responsible_comment == null || item?.responsible_comment == 'null' ||
                      item?.responsible_comment === 'undefined'
                    "
                    @click.stop
                    >N/A</span
                  >
                  <span
                    v-else
                    @click.stop="attendeeReason(item?.responsible_comment)"
                  >
                    {{
                      item?.responsible_comment?.length > 19
                        ? item?.responsible_comment?.slice(0, 19) + '...'
                        : item?.responsible_comment
                    }}
                  </span>
                </div>
              </template>
              <template v-slot:item.image="{ item }">
                <img
                  v-if="
                    item?.status === 'Removed' || item?.status === 'Reassigned'
                  "
                  src="../assets/images/icon/disabled-image.png"
                  @click.stop
                />
                <img
                  v-else-if="
                    item?.responsible_attachment == null &&
                    (item?.status !== 'Removed' || item?.status !== 'Reassigned')
                  "
                  src="../assets/images/icon/image-gray.png"
                  @click.stop
                />
                <img
                  v-else-if="item?.responsible_attachment !== null"
                  src="../assets/images/icon/image-green.png"
                  @click.stop="employeeAtteched(item?.responsible_attachment)"
                />
              </template>
              <template v-slot:item.date="{ item }">
                <div
                  class="info-item"
                  :class="
                    item?.status == 'Removed' || item?.status == 'Reassigned'
                      ? 'disabled'
                      : ''
                  "
                >
                  {{ moment(item?.assign).format('DD.MM.YYYY - HH:mm a') }}
                </div>
              </template>
              <template v-slot:item.deadline="{ item }">
                <div class="info-item" v-if="item?.revise == null">-</div>
                <div
                  class="info-item"
                  v-else
                  :class="
                    item?.status == 'Removed' || item?.status == 'Reassigned'
                      ? 'disabled'
                      : ''
                  "
                >
                  {{ moment(item?.revise).format('DD.MM.YYYY-HH:mm a') }}
                </div>
              </template>

              <template v-slot:item.status="{ item }">
                <v-chip
                  v-if="item?.status === 'new'"
                  class="ma-2 status-label-custom status-btn pending"
                  label
                >
                  {{ $t('form.new') }}
                </v-chip>
                <v-chip
                  v-if="item?.status === 'pending'"
                  class="ma-2 status-label-custom status-btn pending"
                  label
                >
                  {{ $t('form.pending') }}
                </v-chip>
                <v-chip
                  v-else-if="item?.status === 'Reassigned'"
                  class="ma-2 status-label-custom status-btn not-done"
                  label
                >
                  {{ $t('form.reassigned') }}
                </v-chip>
                <v-chip
                  v-else-if="item?.status === 'Removed'"
                  class="ma-2 status-label-custom status-btn not-done"
                  label
                >
                  {{ $t('form.removed') }}
                </v-chip>
                <v-chip
                  v-else-if="item?.status === 'completed'"
                  class="ma-2 status-label-custom status-btn approved"
                  label
                >
                  {{ $t('form.completed') }}
                </v-chip>
                <v-chip
                  v-else-if="item?.status === 'ongoing'"
                  class="ma-2 status-label-custom status-btn ongoing"
                  label
                >
                  {{ $t('form.ongoing') }}
                </v-chip>
              </template>
            </v-data-table>

              <!-- Connected To -->
              <v-data-table 
                    v-if="(roleUser != 'manager' || connectToObject.length > 0) && !viewPopup"
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
                         <div v-if="checkAdmin || checkCreator">
                            <div role="button" v-if="!isEdit" @click="
                                   (checkAdmin || checkCreator) && !inReportData && 
                                    !checkEdit && editedItem?.source == 'Task'
                                      ? (isEdit = !isEdit)
                                      : (isEdit = false)
                                  " class="plus-icon-gray text-center d-flex align-center justify-center">
                                +
                            </div>
                            <div role="button" 
                                    v-else
                                    class="plus-icon text-center"
                                 @click="is_connect = !is_connect">+
                            </div>
                        </div> 
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
              :connect-to-array-input="connectToObject"
              :connect-to-object-table-data="connectToObject"
              :tableData="connectToObject"
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
                :categories-array="[]"
                :view-popup="isOnlyView"
        ></GoalReviewPopup>

        <TaskReviewPopup 
                v-if="objectEditItem.type == 'task'"
                :open-popup="isObjectOpen"
                :object-item="objectEditItem"
                @closePopup="isObjectOpen = !isObjectOpen" 
                :categories-array="[]"
                :view-popup="isOnlyView"
        ></TaskReviewPopup>

        <ReviewRoutinePopup 
                v-if="objectEditItem.type == 'routine'"
                :open-popup="isObjectOpen"
                :document-item="objectEditItem"
                @closePopup="isObjectOpen = !isObjectOpen" 
                :categories-array="[]"
                :view-popup="isOnlyView"
        ></ReviewRoutinePopup>

        <InstructionReviewPopup 
                v-if="objectEditItem.type == 'instruction'"
                :open-popup="isObjectOpen"
                :object-item="objectEditItem"
                @closePopup="isObjectOpen = !isObjectOpen"
                :categories-array="[]"
                :view-popup="isOnlyView"
        ></InstructionReviewPopup>

        <RiskAnalysisReviewPopup 
                v-if="objectEditItem.type == 'risk'"
                :open-popup="isObjectOpen"
                :object-item="objectEditItem"
                @closePopup="isObjectOpen = !isObjectOpen" 
                :categories-array="[]"
                :view-popup="isOnlyView"
        ></RiskAnalysisReviewPopup>

        <EditChecklistPopup 
                v-if="objectEditItem.type == 'checklist'"
                :open-popup="isObjectOpen" 
                :document-item="objectEditItem"
                @closePopup="isObjectOpen = !isObjectOpen"
                :categories-array="[]"
                :view-popup="isOnlyView"
        ></EditChecklistPopup>

        <ReviewDeviation 
                v-if="objectEditItem.type == 'deviation'"
                :open-popup="isObjectOpen"
                :deviation-item="objectEditItem"
                @closePopup="isObjectOpen = !isObjectOpen"
                :categories-array="[]"
                :view-popup="isOnlyView"
        ></ReviewDeviation>

            <div v-if="isRiskAnalysis">
              <AddTable
                :titleMessage="$t('title.topic_title')"
                :addTopic="false"
                :topicArray="topicArray"
                :headers="topicHeaders"
                :addCommentAttach="false"
                class="topic-table"
              />
              <AddTable
                v-if="!checkWorker"
                :titleMessage="$t('title.attendees')"
                :addTopic="true"
                :topicArray="EmployeesArray"
                :headers="ReminderAttendeeHeaders"
                :addCommentAttach="false"
                :isReminder="true"
                @onTaskInfo="employeeItem"
              />

              <review-attendee-popup
                :open-popup="checkShowItem"
                :document-item="editedItem"
                @closePopup="checkShowItem = !checkShowItem"
                @saveEmployee="saveEmployee"
                :is-employee-status="isEmployeeStatus"
                :is-employee-remove="isEmployeeRemove"
              />
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="popup-footer py-5 mb-3">
          <v-spacer />
          <v-btn class="btn-cancel" text @click="close">
            {{ $t('button.cancel') }}
          </v-btn>
          <!-- Creator create/ update object -->
          <v-btn
            v-if="isEdit && (checkAdmin || checkCreator) && !viewPopup"
            class="btn-save"
            @click="save"
            :disabled="!!planAccess?.lastPlanAccess?.task">
            {{ $t('button.save') }}
          </v-btn>

          <!-- Attendee process object -->
          <v-btn
            v-if="!hideDone && (checkWorker || checkAsAttendee) && checkAttendee && checkEdit"
            class="btn-save"
            @click="submitContent"
            :disabled="!!planAccess?.lastPlanAccess?.task">
            {{ $t('button.done') }}
          </v-btn>
          <!-- <v-btn
            v-if="checkWorker && compareDate(editedItem?.start_date) && (attendeeProcessStatus === 'new' || attendeeProcessStatus === 'reopened')"
            class="btn-save"
            @click="attendeeAddRequiredComment(attendeeProcessItem)"
          >
            {{ $t('button.done') }}
          </v-btn> -->

          <!-- resubmit -->
          <v-btn
            v-if="checkResubmit && checkWorker"
            class="btn-save"
            @click="submitContent"
            :disabled="!!planAccess?.lastPlanAccess?.task">
            {{ $t('button.resubmit') }}
          </v-btn>

          <!-- CREATOR process object -->
          <!-- <v-btn
            v-if="
              ((checkCreator && total_rate == 100 && !checkResponsible) ||
                (checkCreator && checkResponsible && userRate == 100)) &&
              editedItem?.status !== 'closed'
            "
            class="btn-save"
            @click="updateTask"
          >
            {{ $t('form.verify') }}
          </v-btn> -->
          <v-btn
            v-if="
              checkResponsible && !isEdit && userRate == 100 &&
              doneResponse && !closedStatus
            "
            class="btn-save"
            @click="respSubmition"
            :disabled="!!planAccess?.lastPlanAccess?.task">
            {{ $t('button.done') }}
          </v-btn>
          <!--          <v-btn-->
          <!--            v-if="checkCreator"-->
          <!--            class="btn-save"-->
          <!--          >-->
          <!--            {{ $t('button.done') }}-->
          <!--          </v-btn>-->

          <!-- Delete object -->
          <v-btn
            v-if="(checkAdmin || checkCreator) && !viewPopup && !inReportData && !hideDelete && editedItem?.status !== 'closed'"
            class="hse-btn-delete"
            text
            @click="dialogDelete = true"
          >
            <v-icon dark> mdi-delete </v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- popup Required comment / attachment -->
    <RequiredCommentPopup
      :open-popup="openRequiredCommentPopup"
      :object-item="editedRequiredCommentItem"
      @closePopup="openRequiredCommentPopup = !openRequiredCommentPopup"
      @updateRequiredComment="updateRequiredComment"
    />

    <!-- Popup delete confirm -->
    <DeleteConfirmPopup
      :open-popup="dialogDelete"
      :object-index="editedItem?.id ? editedItem?.id : 0"
      @closePopup="dialogDelete = !dialogDelete"
      @deleteItem="deleteItem"
    />

    <!-- Decline comment popup -->
    <DeclineCommentPopup
      :open-popup="dialogDeclineComment"
      :object-item="attendeeProcessItem"
      @closePopup="dialogDeclineComment = !dialogDeclineComment"
    />
    <FeedbackPopup
      :open-popup="isWorkerRoutine"
      :object-item="feedbackItem"
      :isResubmit="isResubmit"
      :isResponsibleSubmit="isResponsibleSubmit"
      :predefinedLinkArray="predefinedLinkArray"
      @closePopup="isWorkerRoutine = !isWorkerRoutine"
      @workerFeedback="workerFeedback"
    />

    <dis-approved-popup
      :open-popup="disapprovedModal"
      :isDisapproved="isDisapproved"
      :editDeadlineTime="editDeadlineTime"
      :objectItem="processingItem"
      :title-message="disApprovedTitle"
      :attendeeObjectID="attendeeObjectID"
      @disApproved="deadlineRequest"
      @closePopup="disapprovedModal = !disapprovedModal"
      :extend-date="true"
      :extend-time="true"
      :categories-array="[]"
    />

    <reason-popup
      :open-popup="checkNew"
      @closePopup="checkNew = !checkNew"
      :titleMessage="employeeFeedback ? $t('form.feedback') : $t('form.reason')"
      :addDescription="addDescription"
      :categories-array="[]"
    />

    <image-popup
      :open-popup="employeeImage"
      @closePopup="employeeImage = !employeeImage"
      :titleMessage="$t('form.image')"
      :addImage="addImage"
    />

    <ResponsibleReasonEdit
      v-if="editReason"
      :open-popup="editReason"
      :employeeItem="respItem"
      :attendeeObjectID="attendeeObjectID"
      :allResponsible="allResponsible"
      @closePopup="editReason = !editReason"
      @savePopup="reloadResponsible"
      :titleMessage="$t('title.reason_change_resp')"
    />
  </div>
</template>

<script>
import { _ } from 'vue-underscore'
import cookies from 'js-cookie'
import ConnectToObjectModal from './ConnectToObjectModal.vue'
import FroalaSuggestionListEditor from './FroalaSuggestionListEditor'
import DeleteConfirmPopup from './DeleteConfirmPopup'
import StartDateEdit from './StartDateEdit'
import DeadlineEdit from './DeadlineEdit'
import api from '~/apis';
// import ResponsibleEditInReviewPopup from './ResponsibleEditInReviewPopup'
import CategoryInReviewPopup from './CategoryInReviewPopup'
import RequiredCommentPopup from './RequiredCommentPopup'
import DeclineCommentPopup from './DeclineCommentPopup'
import AddTable from './AddTable.vue'
import ReviewAttendeePopup from './ReviewAttendeePopup.vue'
import ChangeEmployeeTable from './ChangeEmployeeTable.vue'
import FeedbackPopup from './FeedbackPopup.vue'
import DisApprovedPopup from './DisApprovedPopup.vue'
import ReasonPopup from './ReasonPopup.vue'
import ImagePopup from './ImagePopup.vue'
import ResponsibleReasonEdit from './ResponsibleReasonEdit.vue'
import { removeTagsFromString , formatTimeString } from "./common/js/functions"
import moment from 'moment';
import StatusChip from './StatusChip.vue';

export default {
  name: 'TaskReviewPopup',
  components: {
    GoalReviewPopup: () => import('./GoalReviewPopup.vue'),
    TaskReviewPopup: () => import('./TaskReviewPopup.vue'),
    ReviewRoutinePopup: () => import('./ReviewRoutinePopup.vue'),
    RiskAnalysisReviewPopup: () => import('./RiskAnalysisReviewPopup.vue'),
    ReviewDeviation: () => import('./ReviewDeviation.vue'),
    EditChecklistPopup: () => import('./EditChecklistPopup.vue'),
    InstructionReviewPopup: () => import('./InstructionReviewPopup.vue'),
    FroalaSuggestionListEditor,
    DeleteConfirmPopup,
    StartDateEdit,
    DeadlineEdit,
    // ResponsibleEdit: ResponsibleEditInReviewPopup,
    Category: CategoryInReviewPopup,
    RequiredCommentPopup,
    DeclineCommentPopup,
    ConnectToObjectModal,
    AddTable,
    ReviewAttendeePopup,
    ChangeEmployeeTable,
    FeedbackPopup,
    DisApprovedPopup,
    ReasonPopup,
    ImagePopup,
    ResponsibleReasonEdit,
    StatusChip,
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
    },
    editMode: {
      type: Boolean,
      required: false,
    },
    inReportData: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data: () => ({
    checkSuperAdmin: cookies.get('checkSuperAdmin'),
    planAccess: JSON.parse(localStorage.getItem('planAccess')),
    checkAdmin: cookies.get('checkAdmin'),
    userID: parseInt(cookies.get('userID')),
    roleUser: cookies.get('roleUser'),
    today: new Date().toISOString().substr(0, 10),
    valid: true,
    required: [
      (v) => {
        if (!v || v.length < 1) return 'This is required'
        else return true
      },
    ],
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
    isOnlyView : false,
    isObjectOpen : false,
    objectEditItem : {},
    isEdit: false,
    is_connect: false,
    object: [],
    category: [],
    connectToObjectTableProp: [],
    docItem: {},
    editReason: false,
    openRequiredCommentPopup: false,
    hoverQuestionMark: false,
    changeDeadlineCustom: false,
    checkCreator: false,
    checkResponsible: false,
    checkWorker: false,
    editedItem: {},
    editedRequiredCommentItem: {},
    dialogDelete: false,
    responsibleName: [],
    attendeeProcessItem: {},
    attendeeProcessId: '',
    attendeeProcessStatus: '',
    dialogDeclineComment: false,
    selectedEmployeeItem: {},
    checkShowItem: false,
    isEmployeeRemove: false,
    isEmployeeStatus: false,
    isRiskAnalysis: false,
    source_of_danger: [],
    attendeeArray: [],
    attendeeHistory: [],
    attendeeObjectID: '',
    isReminderHistory: false,
    responsible_History: false,
    respItem: {},
    connectToObject: [],
    topicArray: [
      {
        name: 'How many holes in the floor',
        result: '2',
        comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      },
      {
        name: 'Are holes are dangerous ?',
        result: 'By glue',
        comment: 'Not- Available',
      },
    ],
    EmployeesArray: [
      {
        name: 'Employee 1',
        comment: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
        image: 'Not-Availbale',
        status: -1,
        actions: '',
        checkStatus: false,
      },
      {
        name: 'Employee 2',
        comment: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
        image: 'Not-Availbale',
        status: 2,
        actions: '',
        checkStatus: false,
      },
      {
        name: 'Employee 3',
        comment: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
        image: 'Not-Availbale',
        status: 1,
        actions: '',
        checkStatus: false,
      },
      {
        name: 'Employee 4',
        comment: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
        image: 'Not-Availbale',
        status: 0,
        actions: '',
        checkStatus: false,
      },
    ],
    hideDone: false,
    checkAttendee: false,
    processingItem: {},
    statusActionItem: {
      newStatus: '',
      processID: '',
      responsible_comment: '',
      id: '',
    },
    checkAsAttendee: false,
    checkResubmit: false,
    requestItem: {},
    extendeItem: {},
    hideExtendTimeline: false,
    declineRequest: false,
    showExpand: false,
    isResponsibleSubmit: false,
    addDescription: '',
    addImage: '',
    doneResponse: false,
    userProgressColor: '',
    userRate: '',
    total_rate: '',
    respProgressColor: '',
    textTrime: '',
    checkEdit: false,
    feedbackItem: {
      attachment: '',
      comment: '',
      object_id: '',
      processing_id: '',
      required_comment: false,
      required_attachment: false,
    },
    isWorkerRoutine: false,
    isResubmit: false,
    disapprovedModal: false,
    editDeadlineTime:false,
    disApprovedTitle: '',
    isDisapproved: false,
    employeeFeedback: false,
    employeeImage: false,
    hoverItem: false,
    hover: false,
    checkNew: false,
    resp_list: [],
    hideDelete: false,
    processExtendItem: {},
      nullDate:false,
      nullTime:false,
      closedStatus:false,
      allEmployee:'',
      allResponsible:'',
      checkManager:false,
      sourceObjectData:{},
      selectedTopic:[]
  }),

  computed: {
    reportHeaders() {
        return [
          {text: 'Name',align: 'start',sortable: false,value: 'name',width: '25%'},
          {text: 'Result', value: 'options', align: 'center', width: '25%'},
          {text: 'Comment', value: 'comment', align: 'center', width: '30%'},
          {text: 'Image', value: 'image', align: 'center'},
        ];
      },
    headers() {
      return [
        {
          text: this.translateCol('employee_name'),
          value: 'attendeeName',
          align: 'left',
          sortable: false,
        },
        {
          text: this.translateCol('comment'),
          value: 'comment',
          align: 'center',
          sortable: false,
        },
        {
          text: this.translateCol('image'),
          value: 'image',
          align: 'center',
          sortable: false,
        },
        {
          text: this.translateCol('status'),
          value: 'status',
          align: 'center',
          sortable: false,
        },
        {
          text: this.translateCol('actions'),
          value: 'actions',
          align: 'center',
          sortable: false,
        },
      ]
    },
    ResponsibleHistoryHeaders() {
      return [
        {
          text: this.translateCol('responsible'),
          value: 'attendeeName',
          align: 'left',
          sortable: false,
          width: '25%',
        },
        { text: this.translateCol('reason'), value: 'reason', align: 'center' },
        { text: this.translateCol('image'), value: 'image', align: 'center' },
        { text: this.translateCol('assign'), value: 'date', align: 'center' },
        {
          text: this.translateCol('revise'),
          value: 'deadline',
          align: 'center',
        },
        { text: this.translateCol('status'), value: 'status', align: 'center' },
      ]
    },
    riskHeaders() {
      return [
        {
          text: this.translateCol('name'),
          value: 'name',
          align: 'left',
          sortable: false,
        },
        {
          text: this.translateCol('type'),
          value: 'type',
          align: 'center',
          sortable: false,
        },
        {
          text: this.translateCol('probability'),
          value: 'probability',
          align: 'center',
          sortable: false,
        },
        {
          text: this.translateCol('consequences'),
          value: 'consequence',
          align: 'center',
          sortable: false,
        },
        {
          text: this.translateCol('risk_level'),
          value: 'risk_level',
          align: 'center',
          sortable: false,
        },
        {
          text: this.translateCol('comment'),
          value: 'comment',
          align: 'center',
          sortable: false,
        },
        // {text: this.translateCol('actions'), value: 'actions', align: 'center', sortable: false},
      ]
    },
    AttendeeHeaders() {
      return [
        {
          text: this.translateCol('employee_name'),
          value: 'name',
          align: 'left',
          sortable: false,
          width: '17%',
        },
        {
          text: this.translateCol('feedback'),
          value: 'comment',
          align: 'center',
          width: '20%',
        },
        {
          text: this.translateCol('image'),
          value: 'image',
          align: 'center',
          sortable: false,
          width: '17%',
        },
        {
          text: this.translateCol('assign'),
          value: 'date',
          align: 'center',
          width: '17%',
        },
        {
          text: this.translateCol('status'),
          value: 'status',
          align: 'center',
          width: '20%',
        },
        {
          text: this.translateCol('actions'),
          value: 'actions',
          align: 'center',
          sortable: false,
        },
      ]
    },

    connectToObjectTableHeaders() {
      return [
         { text: this.translateCol('name'), value: 'objectName', },
         { text: this.translateCol('source'), value: 'connect_to_source' },
         { text: this.translateCol('category'), value: 'categoryName' },
         { text: this.translateCol('added_by'), value: 'addedByUser' },
         { text: this.translateCol('connected_by'), value: 'connectedByUser' },
         { text: this.translateCol('connected_date'), value: 'created_at' },
         { text: this.translateCol('actions'), align: 'center',  value: 'actions', sortable: false, },
      ]
    },

    // headersAttendee() {
    //   return [
    //     {text: this.translateCol('employee_name'), value: 'attendeeName', align: 'left', sortable: false},
    //     {text: this.translateCol('comment'), value: 'comment', align: 'center', sortable: false},
    //     {text: this.translateCol('image'), value: 'image', align: 'center', sortable: false},
    //     {text: this.translateCol('status'), value: 'status', align: 'center', sortable: false},
    //   ];
    // },

    expandableSuperAdminHeader() {
      return [
        {
          text: this.translateCol('name'),
          value: 'name',
          align: 'left',
          sortable: false,
        },
        {
          text: this.translateCol('actions'),
          value: 'actions',
          align: 'center',
          sortable: false,
        },
      ]
    },

    computedHeaders() {
      if (this.checkAdmin || this.checkCreator || this.checkResponsible) {
        return this.headers
      }
      // else if (this.checkWorker) {
      //   return this.headersAttendee;
      // }
      else {
        return []
      }
    },

    computedExpandableHeaders() {
      if (this.checkSuperAdmin) {
        return this.expandableSuperAdminHeader
      } else {
        return this.expandableHeader
      }
    },

    topicHeaders() {
      return [
        {
          text: 'Name',
          align: 'start',
          sortable: false,
          value: 'name',
          width: '25%',
        },
        { text: 'Result', value: 'result', align: 'center', width: '25%' },
        { text: 'Comment', value: 'comment', align: 'center', width: '30%' },
        { text: 'Image', value: 'image', align: 'center' },
      ]
    },

    ReminderAttendeeHeaders() {
      return [
        {
          text: this.translateCol('employee_name'),
          value: 'name',
          align: 'left',
          sortable: false,
        },
        {
          text: this.translateCol('feedback'),
          value: 'comment',
          align: 'center',
          sortable: false,
        },
        {
          text: this.translateCol('image'),
          value: 'image',
          align: 'center',
          sortable: false,
        },
        {
          text: this.translateCol('status'),
          value: 'status',
          align: 'center',
          sortable: false,
        },
        {
          text: this.translateCol('actions'),
          value: 'actions',
          align: 'center',
          sortable: false,
        },
      ]
    },
  },

  watch: {
    openPopup(value) {
      if (value) {
        this.getObject({type:'task', objectID: this.objectItem.id});
        this.checkAsAttendee=false;
        this.viewItem(this.objectItem)
      }
    },
  },

  mounted() {
    if (this.roleUser === 'manager') {
      this.checkResponsible = true
      this.checkManager = true
    } else if (this.roleUser === 'user') {
      this.checkWorker = true
    } else if(this.roleUser === 'company admin') {
      this.checkAdmin = true
    }
  },

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
                          connect_to_source: el.connect_to_source,
                          objectName: el.objectName || 'N/A',
                          categoryName: el.categoryName || 'N/A',
                          addedByUser: el?.addedByUser || 'N/A',
                          connectedByUser: el.connectedByUser || 'N/A',
                          created_at: moment(el.connected_date).format('DD.MM.YYYY'),
                          categoryID: el.categoryID,
                          source_id: el.source_id,
                          id: el.id,
                      });
                  });
              } else {
                  this.connectToObject = [];
              }
          }).catch((error) => {
              console.log(error);
          });
      },

    // employeeItem(item){
    //   this.checkShowItem = this.roleUser !== 'manager';
    //   this.selectedEmployeeItem=item;
    //   if(this.selectedEmployeeItem.status===4){
    //     this.isEmployeeStatus=true;
    //     this.isEmployeeRemove=false;
    //   }
    //   else if(this.selectedEmployeeItem.status===5){
    //     this.isEmployeeStatus=true;
    //     this.isEmployeeRemove=true;
    //   }
    //   else{
    //     this.isEmployeeStatus=false;
    //   }
    // },

    // saveEmployee(payload){
    //   if (payload) {
    //     this.selectedEmployeeItem.status = 5;
    //   }
    //   else{
    //     this.selectedEmployeeItem.status = 4;
    //   }
    // },

    respChange(item) {
      console.log('respChange', item)
      console.log('respChange', this.userRate)
      this.respItem = item
      if (
        (item.status === 'new' || item.status == null) &&
        this.userRate == 0
      ) {
        this.editReason = true
      } else {
        this.editReason = false
      }
    },

    translateLevel(value) {
      if (value === 1) {
        return this.$i18n.t('form.low')
      } else if (value === 2) {
        return this.$i18n.t('form.moderate')
      } else if (value === 3) {
        return this.$i18n.t('form.high')
      } else if (value === 4) {
        return this.$i18n.t('form.very_high')
      } else {
        return ''
      }
    },
    employeeAtteched(item) {
      this.employeeImage = true
      this.addImage = item
    },

    viewItem(item) {
      let that = this
      // that.formDirty = false;
      that.selectedTopic=[];
      that.$store
        .dispatch('objects/show', item.id)
        .then((result) => {
          // that.$nuxt.$loading.start();
          if(JSON.parse(result.data.responsible.employee_array).includes(this.userID))
          {
            this.checkResponsible=true;
          }
          that.editedItem = Object.assign({}, result.data)
          if(result?.data?.status == 'closed'){
            this.checkAsAttendee=false;
          }
          if(this.editedItem?.attendee?.employee_array == this.editedItem?.responsible?.employee_array && this.roleUser != 'user' && result?.data?.status != 'closed'){
            this.checkAsAttendee=true;
          }
          result?.data?.topics && that.selectedTopic.push(result?.data?.topics);
          that.editedItem.responsible_employee_array=JSON.parse(result?.data?.responsible?.employee_array);

          this.closedStatus = result.data.status == "closed" ? true : false
          that.sourceObjectData = Object.assign({}, result.data?.sourceData)

          const htmlString = result.data?.description;
          const tempElement = document.createElement('div');
          tempElement.innerHTML = htmlString;
          const extractedText = tempElement?.textContent || tempElement?.innerText || '';
          const cleanedText = extractedText?.replace('Powered by Froala Editor', '');
          this.editedItem.description = cleanedText?.trim();

          if (that.editedItem?.added_by == that.userID) {
            that.checkCreator = true
          } else {
            that.checkCreator = false
          }
          if (result.data?.responsible?.employeeRole?.includes(that.userID)) {
            that.checkResponsible = true
          } else {
            that.checkResponsible = false
          }
          // that.checkResponsible = _.contains(result.data.role, 'responsible')
          // that.checkWorker = _.contains(result.data.role, 'attendee')
          if (that.editMode && (that.checkAdmin || that.checkCreator)) {
            that.isEdit = true
          }
          that.attendeeObjectID = item.id
          if (that.checkWorker == false) {
            that.$store
              .dispatch(`objects/getAttendeeData`, item.id)
              .then((attendeeRes) => {
                // that.$nuxt.$loading.start()
                that.attendeeArray = attendeeRes?.attendee

                // Extract attendee_id values and join them into a single string
                const newAttendees = that?.attendeeArray?.filter((attendee) => attendee?.status === 'new');
                const attendeeIds = newAttendees?.map((attendee) => attendee?.attendee_id);
                that.allEmployee = attendeeIds?.join(',');
                // const attendeeIds = that?.attendeeArray?.map((attendee) => attendee?.attendee_id);
                // that.allEmployee = attendeeIds?.join(',');
                const checkStatus = [
                  'approved_overdue',
                  'approved',
                  'ongoing',
                  'overdue',
                  'disapproved',
                  'timeline_disapproved',
                  'disapproved_with_extended','disapproved_overdue'
                ]
                _.each(that.attendeeArray, function (statusHistory) {
                  if (checkStatus.includes(statusHistory?.status) || that.editedItem?.source !== 'Task' ) {
                    that.hideDelete = true
                  }
                })
                let history_of_attendee = []
                _.each(attendeeRes.attendee, function (history) {
                  if (Object.keys(history.attendee_history)?.length > 0) {
                    history_of_attendee.push(history.attendee_history)
                  }
                })
                that.attendeeHistory = history_of_attendee
                // that.$nuxt.$loading.finish()
              })
            that.$store
              .dispatch(`objects/getResponsibleData`, item.id)
              .then((responsibleData) => {
                that.resp_list = responsibleData?.responsible

                const respIds = that?.resp_list?.map((attendee) => attendee?.attendee_id);
                that.allResponsible = respIds?.join(',');
              })
          }
          const responseDateStr = that.editedItem?.start_date
          //  const responseDateStr = "2023-07-28T12:34:56";

          // Parse the response date into a Date object
          const responseDate = new Date(responseDateStr)
          responseDate.setHours(0, 0, 0, 0)
          const currentDate = new Date()
          currentDate.setHours(0, 0, 0, 0)

          // Compare the dates without time
          if (currentDate < responseDate) {
            that.checkEdit = false
          } else {
            that.checkEdit = true
          }

          const responseTimeStr = that.editedItem?.start_time;
          if (currentDate.getTime() === responseDate.getTime() && that.checkEdit == true) {

            const currentTime = new Date();
            const currentHours = currentTime.getHours();
            const currentMinutes = currentTime.getMinutes();
            // Split the response time string into hours, minutes, and seconds
            const [responseHours, responseMinutes] = responseTimeStr.split(':').map(Number);

            if ((currentHours > responseHours) || (currentHours === responseHours && currentMinutes >= responseMinutes)) {
              // Both date and time are equal, and current time is greater than or equal to response time
              that.checkEdit = true;
            } else {
              that.checkEdit = false;
            }
          }


          that.userRate = that.editedItem?.rate.toFixed()
          that.total_rate = that.editedItem?.total_rate.toFixed()

          that.processingItem = that.editedItem?.my_processing
          this.addDescription = this.processingItem?.comment == 'null' || this.processingItem?.comment == 'undefined' ? null : this.processingItem?.comment
          this.addImage = this.processingItem?.image

          that.feedbackItem.object_id = that.editedItem?.id
          that.feedbackItem.processing_id = that.processingItem?.process_id
          that.feedbackItem.required_comment =
            that.processingItem?.required_comment
          that.feedbackItem.required_attachment =
            that.processingItem?.required_attachment
          // if (that.checkWorker == true) {
          if (
            that.processingItem?.attendee_id == that.userID &&
            (that.processingItem?.status === 'new' ||
              that.processingItem?.status === 'pending' ||
              that.processingItem?.status === 'ongoing') || that.processingItem?.status === 'disapproved_overdue' || that.processingItem?.status === 'timeline_disapproved' || that.processingItem?.status === 'overdue'
          ) {
            that.checkAttendee = true
            that.hideDone = false
          } else {
            that.checkAttendee = false
            that.hideDone = true
          }

          this.processExtendItem = this.processingItem?.extended_timeline 

       this.nullDate = this.processExtendItem?.deadline_date == null
      this.nullTime = this.processExtendItem?.deadline_time == null

          if ((that.editedItem?.my_processing?.status && that.checkWorker) || (that.checkManager && (that.editedItem?.my_processing?.status == 'Reassigned' || that.editedItem?.my_processing?.status == 'Removed'))) {
            that.editedItem.status = that.processingItem.status
            if (
              that.editedItem?.status === 'approved' ||
              that.editedItem?.status === 'completed' ||
              that.editedItem?.status === 'request' ||
              that.editedItem?.status === 'approved_overdue' ||
              that.editedItem?.status === 'completed_overdue' ||
              that.editedItem?.status === 'Reassigned' ||
              that.editedItem?.status === 'Removed' || that.editedItem?.status === 'disapproved_overdue' || that.editedItem?.status === 'overdue'
            ) {
              that.checkResubmit = false
              that.hideExtendTimeline = true
            } else if (
               that.editedItem?.status === 'disapproved_with_extended' || that.editedItem?.status === 'disapproved'
            ) {
              that.checkResubmit = true
              that.hideExtendTimeline = true
            } else if (that.editedItem?.status === 'timeline_disapproved') {
              that.checkResubmit = false
              that.declineRequest = true
              that.hideExtendTimeline = true
            } else {
              that.checkResubmit = false
              that.hideExtendTimeline = false
            }
          }

          //  if (result.data?.responsible?.employeeRole?.includes(that.userID)) {
          //   that.checkResponsible = true
          // } else {
          //   that.checkResponsible = false
          // }
          if (
            that.processingItem?.attendee_id == that.userID &&
            that.processingItem.status !== 'completed' &&
            that.processingItem.status != null && that.editedItem?.status !== 'closed'
          ) {
            that.doneResponse = true
          } else {
            that.doneResponse = false
          }
          if (
            (that.checkResponsible && that.checkCreator) ||
            (that.checkResponsible && !that.checkCreator) ||
            (!that.checkResponsible && !that.checkCreator && !that.checkAdmin)
          ) {
            if (that.userRate <= 25) {
              that.userProgressColor = 'rgba(251,75,75)'
            } else if (that.userRate > 25 && that.userRate <= 50) {
              that.userProgressColor = 'rgba(255,168,121)'
            } else if (that.userRate > 50 && that.userRate <= 75) {
              that.userProgressColor = 'rgba(255,193,99)'
            } else if (that.userRate > 75 && that.userRate <= 95) {
              that.userProgressColor = 'rgba(255, 212, 111, 1)'
            } else {
              that.userProgressColor = 'rgba(132, 161, 61, 1)'
            }
          } else if ((that.checkCreator && !that.checkResponsible) || (!that.checkResponsible && !that.checkCreator && that.checkAdmin)) {
            if (that.total_rate <= 25) {
              that.respProgressColor = 'rgba(251,75,75)'
            } else if (that.total_rate > 25 && that.total_rate <= 50) {
              that.respProgressColor = 'rgba(255,168,121)'
            } else if (that.total_rate > 50 && that.total_rate <= 75) {
              that.respProgressColor = 'rgba(255,193,99)'
            } else if (that.total_rate > 75 && that.total_rate <= 95) {
              that.respProgressColor = 'rgba(255, 212, 111, 1)'
            } else {
              that.respProgressColor = 'rgba(132, 161, 61, 1)'
            }
          }

          // if (that.checkWorker) {
          //   let processAttendee = _.filter(result.data.processingInfo, function (o) {
          //     return o.user_id === that.userID;
          //   });
          //   if (processAttendee) {
          //     that.attendeeProcessItem = processAttendee[0];
          //     that.attendeeProcessId = processAttendee[0].process_id;
          //     that.attendeeProcessStatus = processAttendee[0].status;
          //   }
          // }
          that.source_of_danger = result?.data?.source_of_danger
          that.responsibleName = result?.data?.responsible['employeeName']
          that.attendeeList = result.data?.attendee?.employeeName
          that.editedItem.responsible_employee_array = JSON.parse(
            that.editedItem?.responsible['employee_array']
          )
          // that.editedItem?.historyArray = _.sortBy(result.data.history, function(o) { return o.updated_at; });
          // that.$nuxt.$loading.finish();
        })
        .catch((error) => {
          if (error.response.status == 401) {
            this.$router.push('/login')
            this.$toaster.error(this.$i18n.t('message.token_expired'))
          } else {
            that.$toaster.error(that.$i18n.t('message.fail_task_view_detail'))
          }
          that.$nuxt.$loading.finish()
        })
      that.$nuxt.$loading.finish()
    },
    is_reminder_history() {
      this.isReminderHistory = !this.isReminderHistory
    },
    attendeeReason(item) {
      this.checkNew = true
      this.addDescription = item
    },
    sendRequest() {
      this.editDeadlineTime = true
      this.disapprovedModal = true
      this.disApprovedTitle = 'Extend Deadline Request'
    },
    deadlineRequest(item , requestDeadline) {
      this.requestItem.object_id = item?.object_id
      this.requestItem.process_id = item?.process_id
      this.requestItem.deadline_date = item?.deadline_pre
      this.requestItem.deadline_time = requestDeadline ? item?.end_time_pre : null
      this.requestItem.reason = item?.description
      this.$store
        .dispatch(`objects/extend_timeline`, this.requestItem)
        .then(() => {
          this.$nuxt.$loading.start()
          this.reloadList()
          this.$toaster.success(this.$i18n.t('message.success_send_request'))
          this.$nuxt.$loading.finish()
        })
        .catch((error) => {
          if (error.response.status == 401) {
            this.$router.push('/login')
            this.$toaster.error(this.$i18n.t('message.token_expired'))
          } else {
            console.log('request fail-->', error)
            this.$toaster.error(this.$i18n.t('message.fail_send_request'))
          }
          // this.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          this.$nuxt.$loading.finish()
        })
      this.disapprovedModal = false
      this.close()
    },

    submitContent() {
      this.isResponsibleSubmit = false
      if (
        this.processingItem.required_attachment == 1 ||
        this.processingItem.required_comment == 1
      ) {
        this.isWorkerRoutine = true
      } else {
        this.isWorkerRoutine = false
        let formData = new FormData()
        formData.append('attachment', null)
        formData.append('comment', null)
        formData.append('object_id', this.attendeeObjectID)
        formData.append('processing_id', this.processingItem?.process_id)
        this.$store
          .dispatch(`objects/actionStore`, formData)
          .then(async () => {
            this.$nuxt.$loading.start()
            
            // this.$toaster.success(this.$i18n.t('message.success_task_done'))
            if(this.editedItem?.attendee?.employee_array == this.editedItem?.responsible?.employee_array && this.roleUser != 'user'){
              await this.statusApprovedAction(this.attendeeArray?.[0]);
              await this.updateTask()
              this.checkAsAttendee=false;
            }
            else{
              this.reloadList()
              this.$toaster.success(this.$i18n.t('message.success_task_done'))
            }
            this.$nuxt.$loading.finish()
          })
          .catch((error) => {
            if (error.response.status == 401) {
              this.$router.push('/login')
              this.$toaster.error(this.$i18n.t('message.token_expired'))
            } else {
              this.$toaster.error(this.$i18n.t('message.server_error'))
            }
            // this.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            this.$nuxt.$loading.finish()
          })
        this.close()
      }
    },
    respSubmition() {
      this.isResponsibleSubmit = true
      if (
        this.processingItem?.required_attachment == 1 ||
        this.processingItem?.required_comment == 1
      ) {
        this.isWorkerRoutine = true
      } else {
        if ((this.checkCreator && this.total_rate == 100 && !this.checkResponsible) ||
                (this.checkCreator && this.checkResponsible && this.userRate == 100) && !this.closedStatus) {
          this.updateTask()
        }else{
        this.isWorkerRoutine = false
        let formData = new FormData()
        formData.append('attachment', null)
        formData.append('comment', null)
        formData.append('object_id', this.attendeeObjectID)
        formData.append('processing_id', this.processingItem?.process_id)
        this.$store
          .dispatch(`objects/managerAction`, formData)
          .then(() => {
            this.$nuxt.$loading.start()
            this.reloadList()
            this.$toaster.success(this.$i18n.t('message.success_task_done'))
            this.$nuxt.$loading.finish()
          })
          .catch((error) => {
            if (error.response.status == 401) {
              this.$router.push('/login')
              this.$toaster.error(this.$i18n.t('message.token_expired'))
            } else {
              this.$toaster.error(this.$i18n.t('message.server_error'))
            }
            // this.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            this.$nuxt.$loading.finish()
          })
          this.updateTask()
        }
        // this.close()
      }
    },
    async updateTask() {
      // this.editedItem?.id = this.editedItem?.id
      this.editedItem.status = 'closed'
      this.editedItem.type = 'task'
      this.editedItem.object_type = 'task'
      this.editedItem.responsible_id = ''
      this.editedItem.requestEdit = true
      this.editedItem.parent_id = ''
      this.editedItem.is_duration = ''
      this.editedItem.is_activated = true
      this.editedItem.is_attending_activated = false
      this.editedItem.isDefaultResponsible = false
      this.editedItem.isDefaultAttendee = false
      this.editedItem.start_time = await formatTimeString(this.editedItem?.start_time)
      this.editedItem.end_time = await formatTimeString(this.editedItem?.end_time)
      this.editedItem.question = null

      this.$store
        .dispatch('objects/update', this.editedItem)
        .then(() => {
          this.$nuxt.$loading.start()
          this.$toaster.success(this.$i18n.t('message.success_task_update'))
          this.reloadList()
          // this.reloadListCategory()
          this.$nuxt.$loading.finish()
        })
        .catch((error) => {
          if (error?.response?.status == 401) {
            this.$router.push('/login')
            this.$toaster.error(this.$i18n.t('message.token_expired'))
          } else {
            console.log(error)
            this.$toaster.error(this.$i18n.t('message.fail_task_update'))
          }
          this.$nuxt.$loading.finish()
        })
      this.close()
    },

    statusApprovedAction(item) {
      this.statusActionItem.newStatus = 'verify'
      this.statusActionItem.processID = item?.process_id
      this.statusActionItem.responsible_comment = ''
      this.statusActionItem.id = this.attendeeObjectID
      // let dataItem = this.statusActionItem
      this.$store
        .dispatch('objects/updateStatus', this.statusActionItem)
        .then(() => {
          this.$nuxt.$loading.start()
          this.reloadList()
          this.reloadEmployee()
          this.$toaster.success(
            this.$i18n.t('message.task_accept_by_responsible')
          )
          this.$nuxt.$loading.finish()
        })
        .catch((error) => {
          if (error.response.status == 401) {
            this.$router.push('/login')
            this.$toaster.error(this.$i18n.t('message.token_expired'))
          } else {
            this.$toaster.error(this.$i18n.t('message.server_error'))
          }
          this.$nuxt.$loading.finish()
        })
    },
    statusDisapprovedAction(item , requestDeadline) {
      this.statusActionItem.newStatus = 'reopened'
      this.statusActionItem.processID = item?.process_id
      this.statusActionItem.extend_time = requestDeadline? item?.end_time_pre : null
      this.statusActionItem.extend_date = item?.deadline_pre
      this.statusActionItem.id = this.attendeeObjectID
      this.statusActionItem.responsible_comment = item?.description
      this.$store
        .dispatch('objects/updateStatus', this.statusActionItem)
        .then(() => {
          this.$nuxt.$loading.start()
          this.reloadList()
          this.reloadEmployee()
          this.$toaster.success(
            this.$i18n.t('message.task_decline_by_responsible')
          )
          this.$nuxt.$loading.finish()
        })
        .catch((error) => {
          if (error.response.status == 401) {
            this.$router.push('/login')
            this.$toaster.error(this.$i18n.t('message.token_expired'))
          } else {
            this.$toaster.error(this.$i18n.t('message.server_error'))
          }
          this.$nuxt.$loading.finish()
        })
    },
    approvedReqestDate(item) {
      this.extendeItem.object_id = this.attendeeObjectID
      this.extendeItem.process_id = item?.process_id
      this.extendeItem.status = 'approved'
      this.extendeItem.extended_by_reason = ''
      this.extendeItem.id = item?.extended_timeline?.id
      this.$store
        .dispatch(`objects/extend_action`, this.extendeItem)
        .then(() => {
          // this.hideDone=true
          this.$nuxt.$loading.start()
          this.reloadList()
          this.$toaster.success(
            this.$i18n.t('message.success_approve_deadline')
          )
          this.$nuxt.$loading.finish()
        })
        .catch((error) => {
          if (error.response.status == 401) {
            this.$router.push('/login')
            this.$toaster.error(this.$i18n.t('message.token_expired'))
          } else {
            console.log('request fail-->', error)
            this.$toaster.error(this.$i18n.t('message.fail_approve_deadline'))
          }
          // this.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          this.$nuxt.$loading.finish()
        })

      this.reloadEmployee()
    },
    declineReqestDate(newItem) {
      this.extendeItem.object_id = this.attendeeObjectID
      this.extendeItem.process_id = newItem?.item?.process_id
      this.extendeItem.status = 'disapproved'
      this.extendeItem.extended_by_reason = newItem?.data?.description
      this.extendeItem.id = newItem?.item?.extended_timeline?.id
      this.$store
        .dispatch(`objects/extend_action`, this.extendeItem)
        .then(() => {
          this.$nuxt.$loading.start()
          // this.hideDone=true
          // this.declineRequest = true
          this.reloadList()
          this.$toaster.success(
            this.$i18n.t('message.success_disapprove_deadline')
          )
          this.$nuxt.$loading.finish()
        })
        .catch((error) => {
          if (error.response.status == 401) {
            this.$router.push('/login')
            this.$toaster.error(this.$i18n.t('message.token_expired'))
          } else {
            this.$toaster.error(
              this.$i18n.t('message.fail_disapprove_deadline')
            )
          }
          // this.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          this.$nuxt.$loading.finish()
        })

      this.reloadEmployee()
    },
    async workerFeedback(payload) {
      if (payload.isResponsibleSubmit == false) {

         this.feedbackItem.comment= await removeTagsFromString(payload?.description);

        let formData = new FormData()
        formData.append('attachment', payload?.attachment)
        formData.append('original_file_name', payload?.attachment?.name)
        formData.append('file_size', payload?.attachment?.size)
        formData.append('comment', this.feedbackItem?.comment)
        formData.append('object_id', payload?.object_id)
        formData.append('processing_id', payload?.processing_id)

        this.$store
          .dispatch(`objects/actionStore`, formData)
          .then((res) => {
            console.log('status', res)
            this.$nuxt.$loading.start()
            this.hideDone = true
            this.reloadList()
            this.$toaster.success(this.$i18n.t('message.success_add_content'))
            this.$nuxt.$loading.finish()
          })
          .catch((error) => {
            if (error.response.status == 401) {
              this.$router.push('/login')
              this.$toaster.error(this.$i18n.t('message.token_expired'))
            } else {
              this.$toaster.error(this.$i18n.t('message.fail_add_content'))
            }
            // this.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            this.$nuxt.$loading.finish()
          })
      } else {
        this.feedbackItem.comment= await removeTagsFromString(payload?.description);

        let formData = new FormData()
        formData.append('attachment', payload?.attachment)
        formData.append('original_file_name', payload?.attachment?.name)
        formData.append('file_size', payload?.attachment?.size)
        formData.append('comment', this.feedbackItem?.comment)
        formData.append('object_id', payload?.object_id)
        formData.append('processing_id', payload?.processing_id)

        this.$store
          .dispatch(`objects/managerAction`, formData)
          .then((res) => {
            console.log('status', res)
            this.$nuxt.$loading.start()
            this.hideDone = true
            this.reloadList()
            this.$toaster.success(this.$i18n.t('message.success_add_content'))
            this.$nuxt.$loading.finish()
          })
          .catch((error) => {
            if (error.response.status == 401) {
              this.$router.push('/login')
              this.$toaster.error(this.$i18n.t('message.token_expired'))
            } else {
              this.$toaster.error(this.$i18n.t('message.fail_add_content'))
            }
            // this.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            this.$nuxt.$loading.finish()
          })
          this.updateTask()
          this.close()
      }
      this.feedbackItem.comment = ''

      this.close()
    },

    responsibleAddRequiredComment(item, status) {
      if (status === 'reopened') {
        // responsible decline task - need to add comment/ image
        this.openRequiredCommentPopup = true
        this.editedRequiredCommentItem = item
        if (this.checkAdmin || this.checkCreator) {
          this.editedRequiredCommentItem.isCreator = true
        } else if (this.checkResponsible) {
          this.editedRequiredCommentItem.isResponsible = true
        }
        this.editedRequiredCommentItem.requiredComment = 1
        this.editedRequiredCommentItem.requiredAttachment = 0
        this.editedRequiredCommentItem.new_status = status
      } else {
        // responsible approve task - don't have to add comment/ image
        this.updateStatus(item.process_id, status, null)
      }

      // if (status === 'reopened' || this.editedItem?.responsible['required_comment'] || this.editedItem?.responsible['required_attachment']) {
      //   this.openRequiredCommentPopup = true;
      //   this.editedRequiredCommentItem = item;
      //   if (this.checkAdmin || this.checkCreator) {
      //     this.editedRequiredCommentItem.isCreator = true;
      //   } else if (this.checkResponsible) {
      //     this.editedRequiredCommentItem.isResponsible = true;
      //   }
      //   this.editedRequiredCommentItem.requiredComment = (status === 'reopened') ? 1 : this.editedItem?.responsible['required_comment'];
      //   this.editedRequiredCommentItem.requiredAttachment = (status === 'reopened') ? 0 : this.editedItem?.responsible['required_attachment'];
      //   this.editedRequiredCommentItem.new_status = status;
      // } else {
      //   this.updateStatus(item.process_id, status, null);
      // }
    },

    attendeeAddRequiredComment(item) {
      if (
        this.editedItem?.attendee['required_comment'] ||
        this.editedItem?.attendee['required_attachment']
      ) {
        this.openRequiredCommentPopup = true
        this.editedRequiredCommentItem = item
        this.editedRequiredCommentItem.isAttendee = true
        this.editedRequiredCommentItem.requiredComment =
          this.editedItem?.attendee['required_comment']
        this.editedRequiredCommentItem.requiredAttachment =
          this.editedItem?.attendee['required_attachment']
      } else {
        this.updateStatus(item.process_id, 'done', null)
      }
    },

    compareDate(start) {
      // check if start date yet
      if (!_.isEmpty(start)) {
        const [year, month, day] = start.split('-')
        const [yearToday, monthToday, dayToday] = this.today.split('-')
        return (
          yearToday > year ||
          (yearToday <= year && monthToday > month) ||
          (yearToday <= year && monthToday <= month && dayToday > day)
        )
      } else {
        return false
      }
    },

    compareToday(start) {
      // check if start date = today
      if (!_.isEmpty(start)) {
        const [year, month, day] = start.split('-')
        const [yearToday, monthToday, dayToday] = this.today.split('-')
        return yearToday === year && monthToday === month && dayToday === day
      } else {
        return false
      }
    },

    translateCol(colName) {
      return this.$i18n.t('column.' + colName)
    },

    getNewCategory(value) {
      this.editedItem.category_id = value.newCategoryId
    },

    changeStartDate(val) {
      this.changeDeadlineCustom = !!val.changed
    },
    getDeadline(value) {
      this.deadline = value.date
      if (this.editMode) {
        this.editedItem.deadline_pre = this.deadline
      } else {
        this.objectItem.deadline_pre = this.deadline
      }
    },

    close() {
      this.isEdit = false
      this.showExpand = false
      this.isReminderHistory = false
      this.responsible_History = false
      if (this.openPopup) {
        this.$emit('closePopup')
      }
    },

    reloadList() {
      this.$emit('reloadList')
    },

    async save() {
      // update
      let that = this
      that.$nuxt.$loading.start()
      that.editedItem.requestEdit = true
      that.editedItem.isDefaultResponsible = false
      that.editedItem.isDefaultAttendee = false
      that.editedItem.attendee_all = false
      // that.editedItem?.responsible_required_comment =
      //   that.editedItem?.responsible['required_comment']
      // that.editedItem?.responsible_required_attachment =
      //   that.editedItem?.responsible['required_attachment']
      // that.editedItem?.attendee_required_comment =
      //   that.editedItem?.attendee['required_comment']
      // that.editedItem?.attendee_required_attachment =
      //   that.editedItem?.attendee['required_attachment']
      that.editedItem.start_date = that.editedItem?.start_date_pre
      that.editedItem.deadline = that.editedItem?.deadline_pre

      that.textTrime = that.editedItem?.name
      that.editedItem.name = this.textTrime.trim();
       this.editedItem.description= await removeTagsFromString(that.editedItem?.description);
      // that.editedItem.start_time = that.editedItem?.start_time_pre != null && that.editedItem?.start_time_pre != "" ? new moment(that.editedItem?.start_time_pre, "HH:mm").utc().format("HH:mm") : null;
      // that.editedItem.end_time = that.editedItem?.end_time_pre && that.editedItem?.end_time_pre != "" ? new moment(that.editedItem?.end_time_pre, "HH:mm").utc().format("HH:mm"): null;
      that.editedItem.start_time = await formatTimeString(new moment(that?.editedItem?.start_time_pre, "HH:mm"))
      that.editedItem.end_time = await formatTimeString(new moment(that?.editedItem?.end_time_pre, "HH:mm"))
      this.editedItem.connectToArray = this.connectToObject;
      this.editedItem.id = that.objectItem.id;
      that.$store
        .dispatch('objects/update', that.editedItem)
        .then(function () {
          that.reloadList()
          // that.reloadListCategory();
          that.$toaster.success(that.$i18n.t('message.success_task_update'))
        })
        .catch((error) => {
          if (error.response.status == 401) {
            this.$router.push('/login')
            this.$toaster.error(this.$i18n.t('message.token_expired'))
          } else {
            that.$toaster.error(that.$i18n.t('message.fail_task_update'))
          }
          that.$nuxt.$loading.finish()
        })
      that.close()
    },

    deleteItem(val) {
      let that = this
      that.$store
        .dispatch('objects/delete', val.index)
        .then(function () {
          that.reloadList()
          that.$toaster.success(that.$i18n.t('message.success_task_delete'))
        })
        .catch((error) => {
          if (error.response.status == 401) {
            this.$router.push('/login')
            this.$toaster.error(this.$i18n.t('message.token_expired'))
          } else {
            that.$toaster.error(that.$i18n.t('message.fail_task_delete'))
          }
          that.$nuxt.$loading.finish()
        })
      that.dialogDelete = false
      that.close()
    },

    updateRequiredComment(val) {
      this.updateStatus(val.processID, val.newStatus, val.comment)
      if (val.attachment && val.attachment.length !== 0) {
        this.saveAttachment(val.attachment, val.processID)
      }
    },

    updateStatus(processID, newStatus, comment) {
      let that = this
      that.$nuxt.$loading.start()
      let item = that.editedItem
      that.editedItem.newStatus = newStatus
      that.editedItem.processID = processID
      if (that.checkWorker) {
        that.editedItem.comment = comment
      } else {
        that.editedItem.responsible_comment = comment
      }
      that.$store
        .dispatch('objects/updateStatus', that.editedItem)
        .then(function () {
          that.reloadList()
          if (that.checkCreator || that.checkResponsible) that.viewItem(item)
          else if (that.checkWorker) that.close()
        })
        .catch(() => {
          that.$nuxt.$loading.finish()
        })
    },

    reloadEmployee() {
      this.reloadList()
      // this.$nuxt.$loading.start()
      this.$store
        .dispatch(`objects/getAttendeeData`, this.attendeeObjectID)
        .then((attendeeRes) => {
          // this.$nuxt.$loading.start()
          this.attendeeArray = attendeeRes.attendee
          let history_of_attendee = []
          _.each(attendeeRes.attendee, function (history) {
            if (Object.keys(history.attendee_history)?.length > 0) {
              history_of_attendee.push(history.attendee_history)
            }
          })
          this.attendeeHistory = history_of_attendee
          this.viewItem(this.objectItem)
          // this.$nuxt.$loading.finish()
        })
      this.$nuxt.$loading.finish()
    },

    reloadResponsible() {
      this.reloadList()
      this.$store
        .dispatch(`objects/getResponsibleData`, this.attendeeObjectID)
        .then((responsibleData) => {
          // this.$nuxt.$loading.start()
          this.resp_list = responsibleData.responsible
        })
      this.viewItem(this.objectItem)
      // this.$nuxt.$loading.finish()
    },

    saveAttachment(file, processID) {
      let that = this
      that.$nuxt.$loading.start()
      let formData = new FormData()
      formData.append('file', file)
      formData.append('processing_id', processID)
      if (this.checkAdmin || this.checkCreator) {
        formData.append('added_by_role', 'creator')
      } else if (this.checkResponsible) {
        formData.append('added_by_role', 'responsible')
      } else if (this.checkWorker) {
        formData.append('added_by_role', 'attendee')
      }
      that.$store
        .dispatch('attachments/store', formData)
        .then(function () {})
        .catch((error) => {
          if (error.response.status == 401) {
            this.$router.push('/login')
            this.$toaster.error(this.$i18n.t('message.token_expired'))
          } else {
            that.$toaster.error(that.$i18n.t('message.fail_attachment_add_new'))
          }
          that.$nuxt.$loading.finish()
        })
    },
  },
}
</script>

<style scoped>
:deep(.topic-table .v-data-table-header) {
  background-color: #84a13d;
}
:deep(.topic-table .v-data-table-header tr th span) {
  color: #fff;
  font-weight: 500;
}
:deep(.responsible .chip-custom) {
  background: #b3c48c !important;
  color: #fff !important;
}
:deep(.v-badge__badge) {
  inset: auto auto calc(100% - 4px) calc(-72% - 46px) !important;
}
:deep(.hover-label .v-badge__wrapper .v-badge__badge) {
  background-color: #666768 !important;
  inset: auto auto calc(100% - -5px) calc(100% - 40px) !important;
}
.responsible-folddown .reminder-img {
  margin-top: -10px;
}
.deactivation-icon {
  width: 16px;
  height: 30px;
  margin-top: 5px;
}
.status-btn {
  width: 130px;
}
:deep(.disabled) {
  z-index: 99 !important;
  color: #adadad !important;
}
.document-attachment {
  width: 25px;
  height: 25px;
}
:deep(.manage-task .v-data-table__wrapper){
  padding-top: 0px;
}

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

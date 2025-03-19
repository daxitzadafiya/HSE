<template>
  <div>
    <v-dialog v-model="openPopup" scrollable max-width="1125px" persistent>
      <v-card>
        <v-card-title class="text-h5 justify-content-center text-uppercase">
          <span v-if="!revised">
            {{ isEdit ? $t('title.edit_routine') : $t('title.review_routine') }}
          </span>
          <span v-else>
            {{ $t('title.routine_history_detail') }}
          </span>
        </v-card-title>
        <v-card-text>
          <div class="review-popup">
            <div class="review-popup-table normal-table">
              <!-- Type -->

              <!-- <div v-if="(checkWorker || checkAdmin ) && !checkResource" class="info-block w-50 align-center"> -->
              <div
                v-if="((!checkResource && !routineTaskFeild) || (routineTaskFeild && checkWorker) || (editedItem.status === 'closed' && !checkWorker && !checkResource))"
                class="info-block w-50 align-center"
              >
                <div class="label-item">{{ $t('form.status') }} :</div>
                <status-chip
                  :status="routineItem?.status"
                  :inReview="true"
                  :inRisk="false"
                  :addDescription="addDescription" 
                  :addImage="addImage" 
                  :extended_date="processingItem?.extended_timeline?.old_deadline ? true :false "
                />
              </div>
<!-- 
               <div
                v-if="editedItem.status === 'closed' && !checkWorker"
                class="info-block w-50 align-center"
              >
                <div class="label-item">{{ $t('form.status') }} :</div> -->
                <!-- <v-chip
                  v-if="
                    editedItem.status === 'closed'
                  "
                  class="info-item status-label-custom green text-white"
                  label
                >
                  {{ $t('form.verify') }}
                      <v-icon right>mdi-check-circle</v-icon>
                </v-chip> -->
               <!-- </div> -->
              <div
                v-if="!checkWorker && !checkResource && routineTaskFeild && editedItem.status != 'closed'"
                class="info-block progress-field w-50 align-center"
              >
                <div class="label-item col-2 p-0">
                  {{ $t('form.progress') }} :
                </div>
                <div class="info-item">
                  <v-progress-linear
                    height="25"
                    :color="userProgressColor"
                    :value="userRate"
                  >
                    <strong class="font-weight-bold" style="color:#212121">
                      {{userRate + ' ' + '%'}}
                      <!-- {{ checkResponsible ? userRate + ' ' + '%' : total_rate + ' ' + '%' }} -->
                    </strong>
                  </v-progress-linear>
                </div>
              </div>

              <!-- Source -->
              <div class="info-block w-50 align-center">
                <div class="label-item">{{ $t('form.function') }} :</div>
                <div class="info-item">
                  {{
                    routineTaskFeild ? 'Routine > Task' : 'Routine > Reminder'
                  }}
                </div>
              </div>

              <div class="info-block w-50 align-center">
                <div class="label-item">{{ $t('form.name') }}:</div>
                <div
                  v-if="!isEdit"
                  class="info-item"
                  @click="
                    (checkAdmin || checkCreator || checkSuperAdmin) && !checkEdit 
                      ? (isEdit = !isEdit)
                      : (isEdit = false)
                  "
                >
                  {{ checkResource ? editedItem?.name : routineItem?.name }}
                </div>
                <div v-else-if="checkResource" class="input-wrap w-100">
                  <v-text-field
                    v-model="editedItem.name"
                    :rules="required"
                    outlined
                  />
                </div>
                <div v-else class="input-wrap w-100">
                  <v-text-field
                    v-model="routineItem.name"
                    :rules="required"
                    outlined
                  />
                </div>
              </div>

              <!-- <div class="d-flex align-start w-100 border border-right-0"> -->

              <!-- Category -->

              <div
                v-if="!isEdit"
                class="info-item w-50"
                @click="
                  (checkAdmin || checkCreator || checkSuperAdmin) && !checkEdit 
                    ? (isEdit = !isEdit)
                    : (isEdit = false)
                "
              >
                <div class="info-block">
                  <div class="label-item">{{ $t('form.category') }} :</div>
                  <div class="info-item">
                    {{ editedItem?.category_name || editedItem?.categoryName }}
                  </div>
                </div>
              </div>
              <div
                v-if="isEdit"
                class="input-wrap info-block w-50 p-3 d-flex align-center"
              >
                <div class="label-item col-3 p-0 mr-n8">
                  {{ $t('form.category') }} :
                </div>
                <category
                  :object-item="checkResource ? editedItem : routineItem"
                  :type-category="'routine'"
                  @getNewCategory="getNewCategory"
                  class="ml-3 category-item"
                />
              </div>
              <!-- Added by -->
              <div cols="6" class="info-block w-50 align-center">
                <div class="label-item">{{ $t('form.added_by') }} :</div>
                <div class="info-item">
                  {{
                    editedItem?.added_by == 1
                      ? 'System'
                      : editedItem?.added_by_name || editedItem?.addedByName
                  }}
                </div>
              </div>

              <!-- Responsible -->
              <div class="w-50 info-block px-3" v-if="!checkResource">
                <div
                  class="info-block p-0 px-1 chip responsible align-center border-0"
                  @click="
                    (checkAdmin || checkCreator || checkSuperAdmin) && !checkEdit 
                      ? (isEdit = !isEdit)
                      : (isEdit = false)
                  "
                >
                  <div class="label-item">{{ $t('form.responsible') }} :</div>
                  <div
                    class="info-item d-flex justify-content-between responsible-folddown"
                  >
                    <div>
                      <v-chip
                        v-for="(item, index) in responsibleName"
                        :key="index"
                        class="mr-2 chip-custom mb-1"
                        small
                      >
                        {{ item }}
                      </v-chip>

                      <img
                        class="icon-img"
                        src="../assets/images/gridIcon/fillNote.png"
                        alt="fillNote.png"
                        @click.stop
                      />
                    </div>

                    <div :class="!isEdit ? 'w-25 text-right' : ''">
                      <img
                        v-if="!isEdit && (checkAdmin || checkCreator)"
                        class="reminder-img"
                        src="../assets/images/icon/reminder-history.png"
                        alt="file.png"
                        @click.stop="responsible_History = !responsible_History"
                      />
                    </div>
                  </div>
                </div>
                <!-- <div v-else cols="6" class="px-2">
                  <div class="d-flex align-center mb-3">
                  <div class="label-item ">
                    {{ $t('form.responsible') }} :
                  </div>
                  <div class="info-item" >
                    <v-chip
                      class="info-item mr-2 chip-custom "
                      small
                    >
                    IT-Manager
                    </v-chip>
                  </div>
                  </div>
                  <ResponsibleEdit
                  :object-item="editedItem"
                />
                <b-row class="align-center">

                  <b-col  cols="3" class="mr-n5">
                    <div class="required-action-title position-relative">
                      <div class="label-item">
                    {{ $t('form.reason') }} :
                  </div>
                      <v-badge :value="hover" right transition="slide-x-transition" class="hse-badge-icon reson-hover-label">
                        <span slot="badge">{{ $t('message.reason_for_changing_the_responsible_person') }} </span>
                        <v-hover v-model="hover">
                            <i class="fa fa-question-circle"></i>
                        </v-hover>
                    </v-badge>
                    </div>
                  </b-col>
                  <b-col cols="2">
                    <div class="switch-component switch-required-action pl-16">
                      <label class="left-text">{{ $t('form.none') }}</label>
                      <v-switch
                        v-model="editReason"
                        :label="$t('form.active')"
                        inset
                        class="right-text"
                      />
                    </div>
                  </b-col>
                </b-row>
                </div> -->
              </div>
              <!-- </div> -->
              <!-- <div v-if="responsibleName.length>0 && (!checkResource && routineTaskFeild)" class="info-block w-100">

                <div >
                  <div class="label-item mb-3">
                    Manager Feedback : 25.11.2022 10:30 AM
                  </div>
                  <div class="info-item">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nunc vulputate libero et velit interdum, ac aliquet odio mattis.Lorem ipsum dolor sit amet,
                    consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
                  </div>
                </div>
              </div> -->
              <!-- Description -->

              <div :class="isEdit ? 'info-block' : 'info-block description'">
                <div class="label-item">{{ $t('form.description') }}:</div>
                <div
                  v-if="!isEdit"
                  class="info-item"
                  @click="
                    (checkAdmin || checkCreator || checkSuperAdmin) && !checkEdit 
                      ? (isEdit = !isEdit)
                      : (isEdit = false)
                  "
                >
                  {{
                    checkResource
                      ? editedItem?.description
                      : routineItem?.description
                  }}
                </div>
                <div v-else class="input-wrap form-description">
                  <FroalaSuggestionListEditor
                    :item="checkResource ? editedItem : routineItem"
                    :predefined-link-array="predefinedLinkArray"
                  />
                </div>
              </div>

              <div
                class="info-block w-100"
                v-if="
                  processExtendItem?.length != 0 &&
                  (routineItem?.status === 'disapproved' ||
                    routineItem?.status === 'disapproved_with_extended' ||
                    routineItem?.status === 'disapproved_overdue' ||
                    routineItem?.status === 'timeline_disapproved' ||
                    routineItem?.status === 'completed_overdue' ||
                    routineItem?.status === 'completed' ||
                    routineItem?.status === 'approved_overdue' ||
                    routineItem?.status === 'approved')
                "
              >
                <div class="w-100">
                  <div class="label-item mb-3 d-flex justify-content-between">
                    {{
                      (routineItem?.status === 'timeline_disapproved' || routineItem?.status === 'approved_overdue' || 
                      routineItem?.status === 'completed'|| routineItem?.status === 'approved' || routineItem?.status === 'completed_overdue') && (processExtendItem?.type === 'attendee') ? 'Request' : 'Task'
                    }}
                    Date:
                    {{moment(processingItem?.extended_timeline?.created_at).format('DD.MM.YYYY HH:mm a')}}
                    
                    <span
                v-if="
                  ( 
                  ((routineItem?.status === 'completed'|| routineItem?.status === 'approved'|| routineItem?.status === 'completed_overdue' ||  routineItem?.status === 'approved_overdue' || routineItem?.status === 'disapproved_with_extended' ) &&
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

              <div
                v-if="!isEdit && !checkResource"
                class="col-6 align-center"
                :class="revised ? 'info-block w-50' : 'info-block w-100'"
                @click="
                  (checkAdmin || checkCreator || checkSuperAdmin) && !checkEdit 
                    ? (isEdit = !isEdit)
                    : (isEdit = false)
                "
              >
                <div class="label-item">{{ $t('form.frequency') }} :</div>
                <div class="info-item text-capitalize">
                  {{ routineItem?.recurring }}
                </div>
              </div>
              <div
                v-else-if="isEdit && !checkResource"
                :class="revised ? 'info-block w-50' : 'info-block w-100'"
                class="col-6 align-center"
              >
                <div class="label-item">{{ $t('form.frequency') }} :</div>
                <v-select
                  v-model="durationData.unit"
                  :items="units"
                  item-text="units"
                  item-value="name"
                  class="select-box text-capitalize"
                  outlined
                  @change="(e) => changeFreqency(e)"
                />
              </div>
              <div
                v-if="!isEdit && !checkResource"
                cols="6"
                class="info-block align-items-center w-50"
                @click="
                  (checkAdmin || checkCreator || checkSuperAdmin) && !checkEdit 
                    ? (isEdit = !isEdit)
                    : (isEdit = false)
                "
              >
                <div class="label-item">{{ $t('form.duration') }} :</div>
                <v-hover v-if="revised" v-slot:default="{ hover }">
                  <v-badge
                    :value="hover"
                    right
                    transition="slide-x-transition"
                    class="hse--icon-question-circle"
                  >
                    <span slot="badge"
                      >Revised -
                      {{ moment().add(5, 'days').format('DD.MM.YYYY') }}</span
                    >
                    <div class="info-item">5 days</div>
                  </v-badge>
                </v-hover>
                <div v-else class="info-item">
                  {{ routineItem?.duration }}
                  {{ routineItem?.is_duration == true ? 'week' : 'days' }}
                </div>
              </div>
              <div
                v-else-if="isEdit && !checkResource"
                class="info-block align-items-center col-6 p-0 section-required-action pl-1"
              >
                <duration
                  :object-item="routineItem"
                  :duration-data="durationData"
                  class="col-12 duration-hover"
                  :isDisabledDay="isDisabledDay"
                />
              </div>
              <!-- Start date -->
              <div
                v-if="!isEdit && !checkResource"
                class="info-block col-6"
                @click="
                  (checkAdmin || checkCreator || checkSuperAdmin) && !checkEdit 
                    ? (isEdit = !isEdit)
                    : (isEdit = false)
                "
              >
                <div class="label-item">{{ $t('form.activation') }} :</div>
                <div class="info-item">
                  {{ moment(routineItem?.start_date).format('DD.MM.YYYY') }}
                  {{
                    routineItem?.start_time && ' - ' + routineItem?.start_time
                  }}
                </div>
                <!-- <div class="info-item" @click.stop v-else >Not Applicable</div> -->
              </div>

              <div
                v-else-if="isEdit && !checkResource"
                class="info-block col-6 align-center"
              >
                <div class="label-item activation-label">
                  {{ $t('form.activation') }} :
                </div>
                <StartDateEdit
                  :object-item="editedItem"
                  class="mb-n4"
                  @changeDate="changeStartDate"
                />
              </div>

              <!-- Due date -->
              <div
                class="info-block w-50"
                v-if="!isEdit && !checkResource"
                @click="
                  (checkAdmin || checkCreator || checkSuperAdmin) && !checkEdit 
                    ? (isEdit = !isEdit)
                    : (isEdit = false)
                "
              >
                <div class="label-item col-3 p-0">
                  {{ $t('form.deactivation') }} :
                </div>

                <div
                  class="info-item"
                  v-if="
                    (!checkWorker && !isEdit) ||
                    (checkWorker &&
                      (routineItem?.status === 'new' ||
                        routineItem?.status === 'pending' ||
                        routineItem?.status === 'ongoing' ||
                        routineItem?.status === 'disapproved' ||
                        routineItem?.status === 'Reassigned' ||
                        routineItem?.status === 'Removed')) ||
                    ((routineItem?.status === 'completed_overdue' ||
                      routineItem?.status === 'approved' ||
                      routineItem?.status === 'completed' ||
                      routineItem?.status === 'approved_overdue') &&
                      (((nullTime || nullDate) &&
                        processExtendItem?.type == 'responsible') ||
                        (processExtendItem?.type == 'attendee' &&
                          processExtendItem?.status === 'Disapproved')))
                  "
                >
                  {{
                    !routineItem?.deadline
                      ? 'Indefinite' : moment(routineItem?.deadline).format('DD.MM.YYYY')
                  }}
                </div>

                <!-- <div
                  class="info-item"
                  v-if="
                    !checkWorker ||
                    (checkWorker &&
                      (routineItem.status === 'new' ||
                        routineItem.status === 'pending' ||
                        routineItem.status === 'ongoing' ||
                        routineItem.status === 'disapproved' ||
                        routineItem.status === 'approved' ||
                        routineItem.status === 'completed'))
                  "
                >
                  {{
                    routineItem.recurring == 'indefinite' || !routineItem.deadline
                      ? moment(routineItem.start_date)
                          .add(1, 'days')
                          .format('DD.MM.YYYY')
                      : moment(routineItem.deadline).format('DD.MM.YYYY')
                  }}
                </div> -->

                <div
                  v-else-if="
                    checkWorker &&
                    processExtendItem?.length != 0 &&
                    (routineItem?.status === 'request' ||
                      routineItem?.status === 'overdue' ||
                      routineItem?.status === 'disapproved_with_extended' ||
                      declineRequest ||
                      ((routineItem?.status === 'approved_overdue' ||
                        routineItem?.status === 'completed_overdue' ||
                        routineItem?.status === 'completed' ||
                        routineItem?.status === 'approved') &&
                        (!nullTime ||
                          (!nullDate &&
                            processExtendItem?.type == 'responsible') ||
                          (processExtendItem?.type == 'attendee' &&
                            processExtendItem?.status === 'Approved'))))
                  "
                  class="d-flex"
                >
                  <span
                    v-if="
                      (processExtendItem?.type == 'attendee' &&
                        processExtendItem?.status === 'Approved') ||
                      ((!nullTime || !nullDate) &&
                        processExtendItem?.type == 'responsible') ||
                      routineItem?.status === 'request' ||
                      routineItem?.status === 'overdue' ||
                      routineItem?.status === 'disapproved_with_extended' ||
                      declineRequest
                    "
                    :class="
                      declineRequest ? '' : 'text-decoration-line-through'
                    "
                    >{{
                      moment(
                        processingItem?.extended_timeline?.old_deadline
                      ).format('DD.MM.YYYY')
                    }}{{
                      routineItem?.end_time && ' - ' + routineItem?.end_time
                    }}</span
                  >

                  <v-chip
                    v-if="
                      (processExtendItem?.type == 'attendee' &&
                        processExtendItem?.status === 'Approved') ||
                      ((!nullTime || !nullDate) &&
                        processExtendItem?.type == 'responsible') ||
                      routineItem?.status === 'request' ||
                      routineItem?.status === 'overdue' ||
                      routineItem?.status === 'disapproved_with_extended' ||
                      declineRequest
                    "
                    class="rounded-xl status-label-custom ongoing deadline-chip ml-2"
                    :class="
                      declineRequest ? 'text-decoration-line-through' : ''
                    "
                    small
                  >
                    {{
                      moment(
                        processingItem?.extended_timeline?.deadline_date
                      ).format('DD.MM.YYYY')
                    }}
                    {{
                      processingItem?.extended_timeline?.deadline_time &&
                      ' - ' + processingItem?.extended_timeline?.deadline_time
                    }}
                  </v-chip>
                </div>
                <div v-else-if="!isEdit">
                  {{
                    !routineItem?.deadline
                      ? moment(routineItem?.start_date)
                          .add(1, 'days')
                          .format('DD.MM.YYYY')
                      : moment(routineItem?.deadline).format('DD.MM.YYYY')
                  }}
                  {{ routineItem?.end_time && ' - ' + routineItem?.end_time }}
                </div>

                <!-- <div
                  v-if="
                    checkWorker &&
                    (routineItem.status === 'request' ||
                      routineItem.status === 'overdue' ||
                      routineItem.status === 'approved_overdue' ||
                      routineItem.status === 'disapproved_with_extended' ||
                      declineRequest ||
                      routineItem.status === 'completed_overdue')
                  "
                  class="d-flex"
                >
                  <span class="text-decoration-line-through">{{
                    moment(
                      processingItem.extended_timeline.old_deadline
                    ).format('DD.MM.YYYY')
                  }}</span>
                  <v-chip
                    class="rounded-xl status-label-custom ongoing deadline-chip ml-2"
                    :class="
                      declineRequest ? 'text-decoration-line-through' : ''
                    "
                    small
                  >
                    {{
                      moment(
                        processingItem.extended_timeline.deadline_date
                      ).format('DD.MM.YYYY')
                    }}
                    - {{processingItem.extended_timeline.deadline_time }}
                  </v-chip>
                </div> -->
                <div
                  v-if="checkWorker && routineTaskFeild && !hideExtendTimeline && checkEdit && checkAttendee"
                  class="d-flex"
                >
                  <div
                    class="px-2 deactivation-icon"
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
              </div>
              <div
                v-else-if="isEdit && !checkResource"
                class="info-block w-50 align-center"
              >
                <div class="label-item">{{ $t('form.deactivation') }} :</div>
                <DeadlineEdit
                    :object-item="editedItem"
                    :item="editedItem"
                    :change-custom="changeDeadlineCustom"
                    class="mb-n4"
                    :isHide="true"
                    :extend-date="true"
                    :extend-time="true"
                  />
                <!-- <div v-else class="info-item" @click.stop>Not Applicable</div> -->
              </div>
            </div>
            <!-- Connected To -->

           <v-data-table
              v-if="(roleUser!='manager' || connectToObject.length>0) && !viewPopup"
              :headers="isConnectedHeaders"
              :items="connectToObject"
              class="elevation-1 review-table review-popup-table"
              :items-per-page="15"
              :single-expand="true"
              :sort-by="['created_at']"
              :sort-desc="[true, false]"
              hide-default-footer
            >
              <template slot="top">
                <v-toolbar flat>
                  <v-toolbar-title>
                    {{ $t('form.connected_to') }}
                  </v-toolbar-title>
                     <div v-if="checkAdmin || checkCreator">
                        <div role="button" v-if="!isEdit"
                             @click="(checkAdmin || checkCreator || checkSuperAdmin) && !checkEdit 
                                    ? (isEdit = !isEdit)
                                    : (isEdit = false)"
                             class="plus-icon-gray text-center d-flex align-center justify-center">
                            +
                        </div>
                        <div role="button" v-else class="plus-icon text-center" @click="is_connect = !is_connect">+
                        </div>
                    </div>
                </v-toolbar>
              </template>
              <template v-slot:item.actions="{ item }">
                      <v-icon small title="View" @click="handleObjectOpen(item)">mdi-eye</v-icon>
                  </template>
            </v-data-table>
              <ConnectToObjectModal
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
              ></ConnectToObjectModal>

              <GoalReviewPopup 
                v-if="objectEditItem.type == 'goal'"
                :open-popup="isObjectOpen" 
                :object-item="objectEditItem"
                @closePopup="isObjectOpen = !isObjectOpen" 
                :view-popup="isOnlyView"
              ></GoalReviewPopup>

        <TaskReviewPopup 
                v-if="objectEditItem.type == 'task'"
                :open-popup="isObjectOpen"
                :object-item="objectEditItem"
                @closePopup="isObjectOpen = !isObjectOpen" 
                :view-popup="isOnlyView"
        ></TaskReviewPopup>

        <review-routine-popup 
                v-if="objectEditItem.type == 'routine'"
                :open-popup="isObjectOpen"
                :document-item="objectEditItem"
                @closePopup="isObjectOpen = !isObjectOpen" 
                :view-popup="isOnlyView"
        ></review-routine-popup>

        <InstructionReviewPopup 
                v-if="objectEditItem.type == 'instruction'"
                :open-popup="isObjectOpen"
                :object-item="objectEditItem"
                @closePopup="isObjectOpen = !isObjectOpen"
                :view-popup="isOnlyView"
        ></InstructionReviewPopup>

        <RiskAnalysisReviewPopup 
                v-if="objectEditItem.type == 'risk'"
                :open-popup="isObjectOpen"
                :object-item="objectEditItem"
                @closePopup="isObjectOpen = !isObjectOpen" 
                :view-popup="isOnlyView"
        ></RiskAnalysisReviewPopup>

        <EditChecklistPopup 
                v-if="objectEditItem.type == 'checklist'"
                :open-popup="isObjectOpen" 
                :document-item="objectEditItem"
                @closePopup="isObjectOpen = !isObjectOpen" 
                :view-popup="isOnlyView"
        ></EditChecklistPopup>

        <ReviewDeviation 
                v-if="objectEditItem.type == 'deviation'"
                :open-popup="isObjectOpen"
                :deviation-item="objectEditItem"
                @closePopup="isObjectOpen = !isObjectOpen" 
                :view-popup="isOnlyView"
        ></ReviewDeviation>

            <div class="my-5" v-for="(taskItem,index) in arrayItem" :key="taskItem?.id">
              <folding-info-table
                  :arrayItem="[taskItem]"
                  :openEmployeeTable="openEmployeeTable"
                  :hideTaskTableData="true"
                  :routineTaskFeild="true"
                  @openInfo="(v)=>openInfo(v,index,taskItem)"
                />
              <ChangeEmployeeTable
                class="my-1"
                v-if="
                  !checkWorker && !checkResource && !isEdit && routineTaskFeild && openEmployeeTable && index==openTableIndex
                "
                :AttendeeHeaders="AttendeeHeaders"
                :isReminder="true"
                :attendeeArray="attendeeArray"
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
            </div>
            <div
              v-if="
                !isEdit &&
                !routineTaskFeild &&
                !resource &&
                (checkAdmin || checkCreator || checkResponsible) &&
                attendeeArray?.length > 0
              "
              class="table-expand-show-attendee review-table p-3"
            >
              <div class="title-expand pb-5">
                {{ $t('form.attendee') }}
              </div>
              <b-row class="expand">
                <b-col
                  v-for="(i, index) in attendeeList"
                  :key="index"
                  cols="6"
                  class="expand-item"
                >
                  <div>
                    {{ i }}
                  </div>
                </b-col>
              </b-row>
            </div>


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
                  v-if="item.status == 'Removed' || item.status == 'Reassigned'"
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
                    item.status !== 'Removed' || item.status !== 'Reassigned'
                  "
                >
                  {{ item?.employeeName }}
                </div>
              </template>
              <template v-slot:item.reason="{ item }">
                <!-- <span v-if="item.decscription == null || item.comment == null">N/A</span>
                <span @click.stop="attendeeReason(item.decscription)" v-else>{{item.decscription}}</span> -->

                <div
                  v-if="
                    item?.status == 'Removed' || item?.status == 'Reassigned'
                  "
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
                      item?.responsible_comment == null ||
                      item?.responsible_comment === 'undefined'
                    "
                    @click.stop
                    >N/A</span
                  >
                  <span
                    v-else
                    @click.stop="attendeeReason(item.responsible_comment)"
                  >
                    {{
                      item.responsible_comment?.length > 19
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
                    (item?.status !== 'Removed' ||
                      item?.status !== 'Reassigned')
                  "
                  src="../assets/images/icon/image-gray.png"
                  @click.stop
                />
                <img
                  v-else-if="item.responsible_attachment !== null"
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
                <status-chip
                  :status="item?.status"
                  :inReview="true"
                  :inRisk="false"
                  :extended_date="false"
                />
              </template>
            </v-data-table>
          </div>
        </v-card-text>

        <v-card-actions class="mr-4">
          <v-spacer />
          <!-- <v-btn v-if="revised" class="btn-cancel" text @click="reminderClose">
            {{ $t('button.cancel') }}
          </v-btn> -->
          <v-btn class="btn-cancel" text @click="close">
            {{ $t('button.cancel') }}
          </v-btn>
          <v-btn
            v-if="isEdit && (checkAdmin || checkCreator || checkSuperAdmin) && !viewPopup"
            class="btn-save"
            @click="save"
          >
            {{ $t('button.done') }}
          </v-btn>
          <v-btn
            v-if="
              checkResponsible &&
              !isEdit &&
              userRate == 100 &&
              doneResponse &&
              !closedStatus && !viewPopup
            "
            class="btn-save"
            @click="respSubmition"
          >
            {{ $t('button.done') }}
          </v-btn>
          <!-- <v-btn
            v-if="((checkCreator && total_rate == 100 && !checkResponsible) || (checkCreator && checkResponsible && userRate == 100))  && editedItem.status !== 'closed' "
            class="btn-save"
            @click="updateRoutine"
            :disabled="!!planAccess?.lastPlanAccess?.routine">
            {{ $t('form.verify') }}
          </v-btn> -->
          <!-- <v-btn
            v-if="
              !hideDone &&
              checkAttendee &&
              routineTaskFeild &&
              checkWorker &&
              checkEdit
            "
            class="btn-save"
            @click="submitContent"
          >
            {{ $t('button.done') }}
          </v-btn> -->
          <v-btn
            v-if="!isEdit && checkResource && !checkSuperAdmin && !viewPopup"
            class="btn-save"
            @click="applyTemplate"
          >
            {{ $t('button.apply') }}
          </v-btn>
          <!-- <v-btn
            v-if="checkResubmit && checkWorker && routineTaskFeild"
            class="btn-save"
            @click="submitContent"
          >
            {{ $t('button.resubmit') }}
          </v-btn> -->
          <v-btn
            v-if="
              !isEdit &&
              (checkAdmin || checkCreator) &&
              !hideDelete &&
              editedItem?.status !== 'closed' && !viewPopup
            "
            class="border delete-btn"
            @click="dialogDelete = true"
          >
            <v-icon> mdi-delete </v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <reason-popup
      :open-popup="checkNew"
      @closePopup="checkNew = !checkNew"
      :titleMessage="employeeFeedback ? $t('form.feedback') : $t('form.reason')"
      :addDescription="addDescription"
    />
    <dis-approved-popup
      :open-popup="disapprovedModal"
      :isDisapproved="isDisapproved"
      :editDeadlineTime="editDeadlineTime"
      :objectItem="processingItem"
      :title-message="disApprovedTitle"
      :attendeeObjectID="attendeeObjectID"
      @disApproved="deadlineRequest"
      :extend-date="true"
      :extend-time="true"
      @closePopup="disapprovedModal = !disapprovedModal"
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
    <DeleteConfirmPopup
      :open-popup="dialogDelete"
      :object-index="editedItem.id ? editedItem.id : 0"
      @closePopup="dialogDelete = !dialogDelete"
      @deleteItem="deleteDocument"
    />
    <responsible-reason-edit
      v-if="editReason"
      :open-popup="editReason"
      :employeeItem="respItem"
      :allResponsible="allResponsible"
      :attendeeObjectID="attendeeObjectID"
      @closePopup="editReason = !editReason"
      @savePopup="reloadResponsible"
      :titleMessage="$t('title.reason_change_resp')"
    />
    <image-popup
      :open-popup="employeeImage"
      @closePopup="employeeImage = !employeeImage"
      :titleMessage="$t('form.image')"
      :addImage="addImage"
    />
    <RoutinePopup
      :open-popup="openRoutine"
      :routineItem="editedItem"
      :resource="false"
      :categories-array="categoriesArray"
      :job-title-array="jobTitleArray"
      :departments-array="departmentsArray"
      :responsible-array="responsibleArray"
      :contacts-array="contactsArray"
      :predefined-link-array="predefinedLinkArray"
      :recurringArray="recurringArray"
      @changeTab="changeTab"
      @closePopup="openRoutine = !openRoutine"
      @reloadList="reloadList"
      @resourceList="resourceList"
      @reloadListCategory="reloadListCategory"
    />
  </div>
</template>

<script>
import { _ } from 'vue-underscore'
import api from '~/apis'
import cookies from 'js-cookie'
import FroalaSuggestionListEditor from './FroalaSuggestionListEditor'
import CategoryInReviewPopup from './CategoryInReviewPopup'
// import DatePickerNew from './DatePickerNew.vue'
import DisApprovedPopup from './DisApprovedPopup.vue'
import DeleteConfirmPopup from './DeleteConfirmPopup'
import FeedbackPopup from './FeedbackPopup'
import Duration from './Duration'
import ResponsibleReasonEdit from './ResponsibleReasonEdit.vue'
import ReasonPopup from './ReasonPopup.vue'
import ImagePopup from './ImagePopup.vue'
import RoutinePopup from './RoutinePopup.vue'
// import NewTimePicker from './NewTimePicker.vue'
import ChangeEmployeeTable from './ChangeEmployeeTable.vue'
import { removeTagsFromString, formatTimeString } from './common/js/functions'
import StatusChip from './StatusChip.vue'
import StartDateEdit from './StartDateEdit.vue'
import DeadlineEdit from './DeadlineEdit.vue'
import FoldingInfoTable from './FoldingInfoTable.vue'
import moment from 'moment';
import ConnectToObjectModal from './ConnectToObjectModal.vue'
// import moment from 'moment'

export default {
  name: 'review-routine-popup',
  components: {
    category: CategoryInReviewPopup,
    // ResponsibleEdit: ResponsibleEditInReviewPopup,
    // DatePickerNew,
    FroalaSuggestionListEditor,
    DisApprovedPopup,
    DeleteConfirmPopup,
    FeedbackPopup,
    Duration,
    ResponsibleReasonEdit,
    ReasonPopup,
    ImagePopup,
    RoutinePopup,
    // NewTimePicker,
    ChangeEmployeeTable,
    StatusChip,
    StartDateEdit,
    DeadlineEdit,
    FoldingInfoTable,
    ConnectToObjectModal,
    GoalReviewPopup: () => import('./GoalReviewPopup.vue'),
    TaskReviewPopup: () => import('./TaskReviewPopup.vue'),
    ReviewRoutinePopup: () => import('./ReviewRoutinePopup.vue'),
    RiskAnalysisReviewPopup: () => import('./RiskAnalysisReviewPopup.vue'),
    ReviewDeviation: () => import('./ReviewDeviation.vue'),
    EditChecklistPopup: () => import('./EditChecklistPopup.vue'),
    InstructionReviewPopup: () => import('./InstructionReviewPopup.vue'),
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
    viewPopup: {
        type: Boolean,
        required: false,
    },
    employeeHeaders: {
      type: Array,
      required: false,
    },
    openPopup: Boolean,
    industryArray: {
      type: Array,
      required: false,
    },
    categoriesArray: {
        type: Array,
        required: false
    },
    categoryAddedFrom: {
      type: Number,
      required: false,
    },
    categoryType: {
      type: String,
      required: false,
    },
    addedFrom: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: false,
    },
    contactId: {
      type: String,
      required: false,
    },
    employeeId: {
      type: String,
      required: false,
    },
    viewOnly: {
      type: Boolean,
      required: false,
    },
    predefinedLinkArray: {
      type: Array,
      required: false,
    },
    recurringArray: {
      type: [Object, Array],
      required: false,
    },
    responsibleArray: {
      type: Array,
      required: false,
    },
    contactsArray: {
      type: Array,
      required: false,
    },
    jobTitleArray: {
      type: Array,
      required: false,
    },
    departmentsArray: {
      type: Array,
      required: false,
    },
  },
  data: () => ({
    changeDeadlineCustom: false,
    isObjectOpen : false,
    isOnlyView : false,
    objectEditItem : {},
    employeeFeedback: false,
    employeeImage: false,
    hoverItem: false,
    hover: false,
    checkNew: false,
    disapprovedModal: false,
    editReason: false,
    userRoleId: parseInt(cookies.get('roleID')),
    userDepartmentID: parseInt(cookies.get('userDepartmentID')),
    checkAdmin: cookies.get('checkAdmin'),
    checkSuperAdmin: cookies.get('checkSuperAdmin'),
    roleUser: cookies.get('roleUser'),
    userLogged: parseInt(cookies.get('userID')),
    userID: parseInt(cookies.get('userID')),
    permissionsUser: localStorage.getItem('permissionsKey'),
    planAccess: JSON.parse(localStorage.getItem('planAccess')),
    selectedFile: [],
    disApprovedTitle: '',
    isEdit: false,
    isDisapproved: false,
    hideDone: false,
    isResubmit: false,
    is_connect: false,
    reminder_history: false,
    responsible_History: false,
    isWorkerRoutine: false,
    checkCreator: false,
    checkManager: false,
    checkWorker: false,
    revised: false,
    documents: [],
    connected_to_task: [],
    connectToObject: [],
    responsibleName: [],
    connectToObjectTableProp: [],
    object: [],
    category: [],
    approvedItem: [],
    reminderHistoryArray: [],
    durationData: {
      is_duration: false,
      duration: 1,
      unit: '',
    },
    openRoutine: false,

    // ],
    resp_list: [],
    connectToArray: [],
    expanded: [],
    connectToObjectFrom: { document_id: '', connectToArray: [], object_id: '' },
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
    status: -1,
    routineTaskFeild: false,
    routineItem: {},
    attendeeObjectID: '',
    editedItem: {
      hover: false,
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
      object_type: 'routine',
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
      is_duration: false,
      duration: 1,
      objectId: '',

      // hover: false,
      // hoverQuestionMark: false
    },
    defaultItem: {
      hover: false,
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
      // is_renewed: false,
      // renewed_employee_array: "",
      // renewed_employee_array_arr: [],
      deadline: '',
      deadline_pre: '',
      show_manager: false,
      // security_department_array: "",
      // security_project_array: "",
      // security_employee_array: "",
      // security_department_array_arr: [],
      // security_project_array_arr: [],
      // security_employee_array_arr: [],
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
      is_duration: false,
      duration: 1,
      // hover: false,
      // hoverQuestionMark: false
    },
    feedbackItem: {
      attachment: '',
      comment: '',
      object_id: '',
      processing_id: '',
      required_comment: false,
      required_attachment: false,
    },
    required: [
      (v) => {
        if (!v || v.length < 1) return 'This is required'
        else return true
      },
    ],
    dialogDelete: false,
    dialogConfirmClose: false,
    previewUrl: null,
    attachmentType: false,
    formTitle: '',
    editMode: true,
    categoriesValidArray: [],
    checkResource: false,
    dialogRelatedObjects: false,
    is_duration: false,
    duration: 1,
    checkResponsible: false,
    units: ['Daily', 'Weekly', 'Bi-Weekly', 'Monthly', 'Quarter', 'Half-Yearly', 'Yearly'],
    config: {
      events: {
        //
      },
      charCounterCount: true,
      heightMin: 150,
      quickInsertEnabled: false,
      linkList: [],
    },
    attendeeArray: [],
    attendeeHistory: [],
    isDisabledDay: false,
    isReminderHistory: false,
    attendeeList: [],
    respItem: {},
    checkAttendee: false,
    processingItem: {},
    statusActionItem: {
      newStatus: '',
      processID: '',
      responsible_comment: '',
      id: '',
    },
    checkResubmit: false,
    requestItem: {},
    extendeItem: {},
    hideExtendTimeline: false,
    declineRequest: false,
    showExpand: false,
    isResponsibleSubmit: false,
    addDescription:'',
    addImage:'',
    doneResponse:false,
    userProgressColor:'',
    userRate:'',
    total_rate:'',
    respProgressColor:'',
    textTrime:'',
    checkEdit:false,
    processExtendItem:{},
    allEmployee:'',
    hideDelete: false,
    allResponsible:'',
    nullDate:false,
      nullTime:false,
    editDeadlineTime:false,
    arrayItem: [],
    openEmployeeTable: false,
    openTableIndex: 0

  }),

  computed: {
    connectToObjectTableHeaders() {
      return [
        { text: this.translateCol('name'), value: 'name' },
        { text: this.translateCol('source'), value: 'source' },
        { text: this.translateCol('category'), value: 'category' },
        { text: this.translateCol('added_by'), value: 'added' },
        { text: this.translateCol('connected_by'), value: 'connectedBy' },
        { text: this.translateCol('connected_date'), value: 'connectDate' },
        { text: this.translateCol('actions'), value: 'actions' },
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
    headers() {
      return [
        { text: this.translateCol('name'), value: 'name', align: 'left' },
        { text: this.translateCol('source'), value: 'source', align: 'left' },
        {
          text: this.translateCol('category'),
          value: 'category',
          align: 'center',
        },
        {
          text: this.translateCol('responsible'),
          value: 'responsible',
          align: 'center',
        },
        {
          text: this.translateCol('start_end_date'),
          value: 'deadline',
          align: 'center',
        },
        { text: this.translateCol('status'), value: 'status', align: 'center' },
      ]
    },
    managerHeaders() {
      return [
        { text: this.translateCol('name'), value: 'name', align: 'left' },
        { text: this.translateCol('source'), value: 'source', align: 'left' },
        {
          text: this.translateCol('category'),
          value: 'category',
          align: 'center',
        },
        {
          text: this.translateCol('start_end_date'),
          value: 'date',
          align: 'center',
        },
        {
          text: this.translateCol('total_attendee'),
          value: 'totalattendees',
          align: 'center',
        },
      ]
    }, 
    connectedHeaders () {
      return [
          { text: this.translateCol('name'), value: 'objectName' },
          { text: this.translateCol('source'), value: 'connect_to_source' },
          { text: this.translateCol('category'), value: 'categoryName' },
          { text: this.translateCol('added_by'), value: 'addedByUser' },
          { text: this.translateCol('connected_by'), value: 'connectedByUser' },
          { text: this.translateCol('connected_date'), value: 'created_at' },
          { text: this.translateCol('actions'), value: 'actions', align: 'center', sortable: false },
      ];
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
    reminderHeaders() {
      return [
        { text: this.translateCol('id'), value: 'id', align: 'left' },
        {
          text: this.translateCol('name'),
          value: 'name',
          align: 'left',
          sortable: false,
        },
        {
          text: this.translateCol('frequency'),
          value: 'frequency',
          align: 'left',
        },
        {
          text: this.translateCol('start_date'),
          value: 'start_date',
          align: 'left',
        },
        {
          text: this.translateCol('deadline'),
          value: 'deadline',
          align: 'left',
        },
        { text: this.translateCol('revised'), value: 'revised', align: 'left' },
        {
          text: this.translateCol('status'),
          value: 'status',
          align: 'center',
          sortable: false,
        },
      ]
    },
    attendHeaders() {
      return [
        {
          text: this.translateCol('employee_name'),
          value: 'name',
          align: 'left',
        },
        {
          text: this.translateCol('responsible'),
          value: 'responsible',
          align: 'center',
        },
        { text: this.translateCol('status'), value: 'status', align: 'center' },
        {
          text: this.translateCol('actions'),
          value: 'actions',
          align: 'center',
        },
      ]
    },

    // expandableSuperAdminHeader() {
    //   return [
    //     {text: this.translateCol('name'), value: 'name', align: 'left'},
    //     {text: this.translateCol('actions'), value: 'actions', align: 'center'},
    //   ];
    // },

    computedHeaders() {
      if (this.roleUser == 'manager') {
        return this.managerHeaders
      } else {
        return this.headers
      }
    },
    isConnectedHeaders() {
      return this.connectedHeaders
    },
    isAttendHeaders() {
      return this.attendHeaders
    },

    // computedExpandableHeaders () {
    //   if (this.checkSuperAdmin) {
    //     return this.expandableSuperAdminHeader;
    //   } else {
    //     return this.expandableHeader;
    //   }
    // },
  },

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
          this.editItem(this.documentItem)
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

  mounted() {
    if (this.roleUser == 'manager') {
      this.checkManager = true
    } else if (this.roleUser == 'user') {
      this.checkWorker = true
    }
  },

  created() {
    if (this.openPopup) {
      if (this.documentItem) {
        this.editItem(this.documentItem)
      } else {
        this.addNew()
      }
    }

    if (this.resource) {
      this.checkResource = this.resource
    }

    this.reminderHistoryArray = [
      { name: 'Turn on system light its reminder', frequency: 'Weekly' },
      { name: 'Turn on system light its reminder', frequency: 'Weekly' },
      { name: 'Turn on system light its reminder', frequency: 'Weekly' },
    ]
  },

  methods: {
    handleObjectOpen(item) {
          this.objectEditItem = {
            'id':item.source_id,
            'type': item?.source || item?.connect_to_source,
          };
          this.isObjectOpen = true;
          this.isOnlyView = true;
      },

      getConnectToArray (data) {
          this.connectToObject = [...data];
      },
    openInfo(value,index,taskData) {
      this.attendeeArray=taskData.processingInfo;
      if (value == true) {
        this.openEmployeeTable = true
      }
      else if(value == false && index!=this.openTableIndex){
        this.openEmployeeTable = true
      }
      else {
        this.openEmployeeTable = false
      }
        this.openTableIndex=index;
    },
    respChange(item) {
      this.respItem = item
      if ((item.status === 'new' || item.status == null) && this.userRate == 0 ) {
      // if ((item.status === 'new' || item.status == null) && this.userRate !== 0 ) {
        this.editReason = true
      } else {
        this.editReason = false
      }
    },
    changeFreqency(value) {
       if (value == 'daily' || value == 'Daily') {
        this.isDisabledDay = true
        this.durationData.is_duration = false
      } 
      // else if(value == 'weekly' || value == 'Weekly'){
      //   this.isDisabledDay = true
      //   this.durationData.is_duration = true
      // }
       else {
        this.isDisabledDay = false
        this.durationData.is_duration = false
      }
    },
    changeStartDate(val) {
      this.changeDeadlineCustom = !!val.changed
    },
    applyTemplate() {
      let that = this
      that.$nuxt.$loading.start()
      that.openRoutine = true
      that.close()
    },
    async updateRoutine() {
      // this.taskItem.id = this.docID
      // this.taskItem.source_id = this.editedItem.id
      // this.routineItem.status = 'closed'
      // this.$store
      // .dispatch('objects/update', this.taskItem)
      //     .then(()=> {
      //       this.$nuxt.$loading.start();
      //       this.reloadList()
      //       this.reloadListCategory()
      //       this.$toaster.success(this.$i18n.t('message.success_task_update'))
      //       this.$nuxt.$loading.finish();
      //     })
      //     .catch((error) => {
      //       if (error.response.status == 401) {
      //       this.$router.push('/login');
      //       this.$toaster.error(this.$i18n.t('message.token_expired'));
      //     }else{
      //       console.log(error);
      //       this.$toaster.error(this.$i18n.t('message.fail_task_update'))
      //     }
      //       this.$nuxt.$loading.finish()
      //     })

      this.routineItem.id = this.editedItem.id
      this.routineItem.status = 'closed'
      this.routineItem.type = 'routine'
      this.routineItem.object_type = 'routine'
      this.routineItem.responsible_id = ''
      this.routineItem.requestEdit = true
      this.routineItem.start_time = await formatTimeString(this.routineItem?.start_time)
      this.routineItem.end_time = await formatTimeString(this.routineItem?.end_time)
      this.$store
      .dispatch('objects/update', this.routineItem)
          .then(()=> {
            this.$nuxt.$loading.start();
            this.reloadList()
            this.reloadListCategory()
            this.$toaster.success(this.$i18n.t('message.success_routine_update'))
            this.$nuxt.$loading.finish();
          })
          .catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
            console.log(error);
            this.$toaster.error(this.$i18n.t('message.fail_routine_update'))
          }
            this.$nuxt.$loading.finish()
          })
          this.close()
    },
    respSubmition() {
      this.isResponsibleSubmit = true
      if (this.processingItem.required_attachment == 1 || 
      this.processingItem.required_comment == 1) {
        this.isWorkerRoutine = true
      } else {
        if ((this.checkCreator && this.total_rate == 100 && !this.checkResponsible) ||
                (this.checkCreator && this.checkResponsible && this.userRate == 100) && !this.closedStatus) {
          this.updateRoutine()
        }else{
        this.isWorkerRoutine = false
        let formData = new FormData()
        formData.append('attachment', null)
        formData.append('comment', null)
        formData.append('object_id', this.attendeeObjectID)
        formData.append('processing_id', this.processingItem.process_id)
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
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
            this.$toaster.error(this.$i18n.t('message.server_error'))
          }
            // this.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            this.$nuxt.$loading.finish()
          })
          this.updateRoutine()
        }
      // this.close()
      }
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
        formData.append('processing_id', this.processingItem.process_id)
        this.$store
          .dispatch(`objects/actionStore`, formData)
          .then(() => {
            this.$nuxt.$loading.start()
            this.$toaster.success(this.$i18n.t('message.success_task_done'))
            this.$nuxt.$loading.finish()
          })
          .catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
            this.$toaster.error(this.$i18n.t('message.server_error'))
          }
            // this.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            this.$nuxt.$loading.finish()
          })
        this.close()
      }
    },
    employeeAtteched(item) {
      this.employeeImage = true
      this.addImage = item
    },
    attendeeReason(item) {
      this.checkNew = true
      this.addDescription=item
    },
    sendRequest() {
      this.editDeadlineTime = true
      this.disapprovedModal = true
      this.disApprovedTitle = 'Extend Deadline Request'
    },
    deadlineRequest(item , requestDeadline) {
      this.requestItem.object_id = item.object_id
      this.requestItem.process_id = item.process_id
      this.requestItem.deadline_date = item.deadline_pre
      this.requestItem.deadline_time = requestDeadline ? item.end_time_pre : null
      this.requestItem.reason = item.description
      this.$store
        .dispatch(`objects/extend_timeline`, this.requestItem)
        .then(() => {
          this.$nuxt.$loading.start()

          this.$toaster.success(this.$i18n.t('message.success_send_request'))
          this.$nuxt.$loading.finish()
        })
        .catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          console.log('request fail-->', error)
          this.$toaster.error(this.$i18n.t('message.fail_send_request'))
          }
          // this.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          this.$nuxt.$loading.finish()
        })
      this.disapprovedModal = false 
      this.close()
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
        this.$nuxt.$loading.start();
          this.$toaster.success(
            this.$i18n.t('message.success_approve_deadline')
          )
          this.$nuxt.$loading.finish()
        })
        .catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
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
      this.extendeItem.process_id = newItem.item.process_id
      this.extendeItem.status = 'disapproved'
      this.extendeItem.extended_by_reason = newItem.data.description
      this.extendeItem.id = newItem?.item?.extended_timeline?.id
      this.$store
        .dispatch(`objects/extend_action`, this.extendeItem)
        .then(() => {
          this.$nuxt.$loading.start();

          this.$toaster.success(
            this.$i18n.t('message.success_disapprove_deadline')
          )
          this.$nuxt.$loading.finish()
        })
        .catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          this.$toaster.error(this.$i18n.t('message.fail_disapprove_deadline'))
          }
          // this.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          this.$nuxt.$loading.finish()
        })

      this.reloadEmployee()
    },
    async workerFeedback(payload) {
      if (payload.isResponsibleSubmit == false) {

         this.feedbackItem.comment= await removeTagsFromString(payload.description);

        let formData = new FormData()
        formData.append('attachment', payload.attachment)
        formData.append('original_file_name', payload.attachment.name)
        formData.append('file_size', payload.attachment.size)
        formData.append('comment', this.feedbackItem.comment)
        formData.append('object_id', payload.object_id)
        formData.append('processing_id', payload.processing_id)

        this.$store
          .dispatch(`objects/actionStore`, formData)
          .then((res) => {
            console.log('status', res)
            this.$nuxt.$loading.start()
            this.hideDone = true

            this.$toaster.success(this.$i18n.t('message.success_add_content'))
            this.$nuxt.$loading.finish()
          })
          .catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
            this.$toaster.error(this.$i18n.t('message.fail_add_content'))
          }
            // this.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            this.$nuxt.$loading.finish()
          })
      } else {
         this.feedbackItem.comment= await removeTagsFromString(payload.description);

        let formData = new FormData()
        formData.append('attachment', payload.attachment)
        formData.append('original_file_name', payload.attachment.name)
        formData.append('file_size', payload.attachment.size)
        formData.append('comment', this.feedbackItem.comment)
        formData.append('object_id', payload.object_id)
        formData.append('processing_id', payload.processing_id)

        this.$store
          .dispatch(`objects/managerAction`, formData)
          .then((res) => {
            console.log('status', res)
            this.$nuxt.$loading.start()
            this.hideDone = true

            this.$toaster.success(this.$i18n.t('message.success_add_content'))
            this.$nuxt.$loading.finish()
          })
          .catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
            this.$toaster.error(this.$i18n.t('message.fail_add_content'))
          }
            // this.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            this.$nuxt.$loading.finish()
          })
          this.updateRoutine()
          this.close()
      }
      this.feedbackItem.comment = ''

      this.close()
    },
    statusApprovedAction(item) {
      this.statusActionItem.newStatus = 'verify'
      this.statusActionItem.processID = item.process_id
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
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          this.$toaster.error(this.$i18n.t('message.server_error'))
          }
          this.$nuxt.$loading.finish()
        })
    },
    statusDisapprovedAction(item , requestDeadline) {
      this.statusActionItem.newStatus = 'reopened'
      this.statusActionItem.processID = item.process_id
      this.statusActionItem.extend_time = requestDeadline ? item.end_time_pre : null
      this.statusActionItem.extend_date = item.deadline_pre
      this.statusActionItem.id = this.attendeeObjectID
      this.statusActionItem.responsible_comment = item.description
      this.$store
        .dispatch('objects/updateStatus', this.statusActionItem)
        .then(() => {
          this.$nuxt.$loading.start()
          this.reloadList()
          this.reloadEmployee()
          this.$toaster.success(
            this.$i18n.t('message.task_decline_by_responsible')
          )
          this.$nuxt.$loading.finish();
        })
       .catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          this.$toaster.error(this.$i18n.t('message.server_error'))
          }
          this.$nuxt.$loading.finish()
        })
    },
    changeTab(value) {
      this.$emit('changeTab', value)
    },
    reminderClose() {
      this.revised = false
    },
    translateCol(colName) {
      return this.$i18n.t('column.' + colName)
    },
    closeModal(payload) {
      this.is_connect = payload
    },
    editConnectToObject(payload) {
      console.log(payload)
    },
    resetConnectToObjectFrom() {
      this.connectToObjectFrom.document_id = ''
      this.connectToObjectFrom.connectToArray = []
    },
    async addConnectToObject(payload) {
      this.connectToArray = payload
      this.resetConnectToObjectFrom()
      this.connectToObjectFrom.connectToArray.push(payload.connectToArray)
      this.connectToObjectFrom.object_id = payload.object_id
      await this.getObject(this.editedItem)
    },
    deleteCTOData(id) {
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
    changeSecurity(val) {
      if (val !== 'all') {
        this.editedItem.is_suggestion = false
      }
      // this.checkChangeSecurity = Object.assign({}, val);
    },
    openConnect() {
      this.is_connect = !this.is_connect
    },
    getNewCategory(value) {
      this.editedItem.category_id = value.newCategoryId
    },
    addNew() {
      this.reset()
      let defaultCategory = _.findWhere(this.categoriesValidArray, {
        is_primary: 1,
      })
      if (defaultCategory) {
        this.editedItem.category_id = defaultCategory.id
      }
      if (this.checkResource) {
        this.formTitle = this.$i18n.t('title.new_document_resource')
      } else {
        this.formTitle = this.$i18n.t('title.new_document')
      }
      this.editMode = false
      this.selectedFile = []
      this.attachmentType = false
    },
    formatNullArray(item) {
      if (item === null) {
        item = []
      }
      return item
    },

    formatFromStringToArray(data) {
      let result
      if (data) {
        result = data.split(',')
        result = _.map(result, function (item) {
          return parseInt(item)
        })
      } else {
        result = data
      }
      return result
    },
    async getObject(item) {
      this.connectToObject = []
      // await api.documents
      //   .connectRoutine(item.id)
      //   .then((result) => {
      //     let respo = result.data.data
      //     if (respo.length > 0) {
      //       respo.forEach((el) => {
      //         this.connectToObject.push({
      //           id: el.id,
      //           name: el.objectName,
      //           source: el.connect_to_source,
      //           category: el.categoryName,
      //           added: el.addedByUser,
      //           connectedBy: el.connectedByUser,
      //           connected_date: el.created_at,
      //         })
      //       })
      //     } else {
      //       this.connectToObject = []
      //     }
      //   })
      //   .catch((error) => {
      //     console.log(error)
      //   })
        await this.$store.dispatch('connectToObject/getByObject', {
            objectID: item.id,
            type: 'routine',
        }).then((result) => {
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

    editItem(item) {
      let that = this
      that.editedItem = Object.assign({}, item)
      that.editedItem.duration = 1
      that.editedItem.is_duration = false

      that.connected_to_task = []
      that.formTitle = that.$i18n.t('title.edit_document')
      that.formDirty = false
      // that.getObject(item)
      if (that.checkResource) {
        
        that.$nuxt.$loading.start()
        that.$store
          .dispatch('routines/show', item.id)
          .then(function (res) {
            let objectId = res.data.object_id;
            that.getObject({id: objectId, type: 'routine'});
            that.editedItem = Object.assign({}, res.data)
            that.editedItem.objectId = objectId;
            if (that.editedItem.recurring_type == 'task') {
              that.routineTaskFeild = true
            } else {
              that.routineTaskFeild = false
            }
            that.$nuxt.$loading.finish()
          })
          .catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
            console.log(error)
            that.$nuxt.$loading.finish()
          }
          })
            that.$nuxt.$loading.finish()

      }
      if (!that.checkResource) {
        that.getObject(item)
            that.$nuxt.$loading.start()
        that.$store
          .dispatch('objects/show', item.id)
          .then((result) => {
            that.$nuxt.$loading.start()
            console.log('result', result)
            this.arrayItem = result?.data?.task_data;
            that.editedItem = Object.assign({}, result.data)
            this.closedStatus = result.data.status == "closed" ? true : false

            if (result.data?.responsible?.employeeRole?.includes(that.userID)) {
              that.checkResponsible = true
            } else {
              that.checkResponsible = false
            }
            if (that.editedItem.added_by == that.userID) {
              that.checkCreator = true
            } else {
              that.checkCreator = false
            }
            that.attendeeObjectID = item.id
            if (that.checkWorker == false) {
              // that.$store
              //   .dispatch(`objects/getAttendeeData`, item.id)
              //   .then((attendeeRes) => {
              //     // that.$nuxt.$loading.start()
              //     that.attendeeArray = attendeeRes.attendee
              //     const newAttendees = that?.attendeeArray?.filter((attendee) => attendee?.status === 'new');
              //   const attendeeIds = newAttendees?.map((attendee) => attendee?.attendee_id);
              //   that.allEmployee = attendeeIds?.join(',');
              //   that.hideDelete = false
              //     const checkStatus = [
              //     'approved_overdue',
              //     'approved',
              //     'ongoing',
              //     'overdue',
              //     'disapproved',
              //     'timeline_disapproved',
              //     'disapproved_with_extended','disapproved_overdue'
              //   ]
              //   _.each(that.attendeeArray, function (statusHistory) {
              //     if (checkStatus?.includes(statusHistory?.status)) {
              //       that.hideDelete = true
              //     }
              //   })

              //     let history_of_attendee = []
              //     _.each(attendeeRes.attendee, function (history) {
              //       if (Object.keys(history.attendee_history)?.length > 0) {
              //         history_of_attendee.push(history.attendee_history)
              //       }
              //     })
              //     that.attendeeHistory = history_of_attendee
              //     // that.$nuxt.$loading.finish()
              //   })

              that.$store
                .dispatch(`objects/getResponsibleData`, item.id)
                .then((responsibleData) => {
                  that.resp_list = responsibleData?.responsible

                  const respIds = that?.resp_list?.map((attendee) => attendee?.attendee_id);
                  that.allResponsible = respIds?.join(',');
                })
            }
            that.$nuxt.$loading.start()
                  const responseDateStr = that.editedItem.start_date;
                //  const responseDateStr = "2023-07-28T12:34:56";

                // Parse the response date into a Date object
                const responseDate = new Date(responseDateStr);
                responseDate.setHours(0, 0, 0, 0);
                const currentDate = new Date();
                currentDate.setHours(0, 0, 0, 0);

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

            that.userRate = that.editedItem.routine_rate.toFixed()
            // that.total_rate = that.editedItem.total_rate.toFixed()
            
            that.processingItem = that.editedItem?.my_processing
            that.addDescription = this.processingItem?.comment == 'null' || this.processingItem?.comment == 'undefined' ? null : this.processingItem?.comment
            that.addImage = that.processingItem?.image

            that.feedbackItem.object_id = that.editedItem.id
            that.feedbackItem.processing_id = that.processingItem?.process_id
            that.feedbackItem.required_comment =
              that.processingItem?.required_comment
            that.feedbackItem.required_attachment =
              that.processingItem?.required_attachment

            if (
              that.processingItem?.attendee_id == that.userID &&
              (that.processingItem?.status === 'new' ||
                that.processingItem?.status === 'pending' ||
                that.processingItem?.status === 'ongoing'  || that.processingItem?.status === 'disapproved_overdue' || that.processingItem?.status === 'timeline_disapproved' || that.processingItem?.status === 'overdue')
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
            
            // }
            that.routineItem = Object.assign({}, result.data.routine)
            if ((that.editedItem?.my_processing?.status && that.checkWorker) || (that.checkManager && (that.editedItem?.my_processing?.status == 'Reassigned' || that.editedItem?.my_processing?.status == 'Removed'))) {
              that.routineItem.status = that.processingItem.status
              if (
                that.routineItem?.status === 'approved' ||
                that.routineItem?.status === 'completed' ||
                that.routineItem?.status === 'request' ||
                that.routineItem?.status === 'approved_overdue' ||
                that.routineItem?.status === 'completed_overdue' ||
                that.routineItem?.status === 'Reassigned' ||
                that.routineItem?.status === 'Removed' || that.routineItem?.status === 'disapproved_overdue' || that.routineItem?.status === 'overdue'
              ) {
                that.checkResubmit = false
                that.hideExtendTimeline = true
              } else if (
                that.routineItem.status === 'disapproved' ||
                that.routineItem.status === 'disapproved_with_extended'
              ) {
                that.checkResubmit = true
                that.hideExtendTimeline = true
              } else if (that.routineItem.status === 'timeline_disapproved') {
                that.checkResubmit = false
                that.declineRequest = true
                that.hideExtendTimeline = true
              } else {
                that.checkResubmit = false
                that.hideExtendTimeline = false
              }
            }
            if (that.routineItem.recurring_type === 'task') {
              that.routineTaskFeild = true
            } else {
              that.routineTaskFeild = false
            }
            that.durationData.unit = result?.data?.routine?.recurring
            that.durationData.duration = result?.data?.routine?.duration
            that.durationData.is_duration = result?.data?.routine?.is_duration
            if (that.durationData?.unit == 'daily' || that.durationData?.unit == 'Daily') {
              that.isDisabledDay = true
              that.durationData.is_duration = false
            } else if (that.durationData?.unit == 'weekly' || that.durationData?.unit == 'Weekly') {
              that.isDisabledDay = true
              that.durationData.is_duration = true
            } else {
              that.isDisabledDay = false
              // that.durationData.is_duration = false
            }
            // that.editedItem.start_time = result.data.routine.start_time
            that.responsibleName = result.data?.responsible?.employeeName
            that.attendeeList = result.data?.attendee?.employeeName
            
            if(that.processingItem?.attendee_id == that.userID && 
            that.processingItem.status !== 'completed' && that.processingItem.status != null && that.editedItem?.status !== 'closed'){
              that.doneResponse = true
            }else{
              that.doneResponse = false
            }
            
            // if((that.checkResponsible && that.checkCreator) || 
            // (that.checkResponsible && !that.checkCreator) || 
            // (!that.checkResponsible && !that.checkCreator && !that.checkAdmin)){
              if (that.userRate <= 25) {
                that.userProgressColor = 'rgba(251,75,75)'
              }else if(that.userRate > 25 && that.userRate <= 50){
                that.userProgressColor = 'rgba(255,168,121)'
              }else if(that.userRate > 50 && that.userRate <= 75){
                that.userProgressColor = 'rgba(255,193,99)'
              }else if(that.userRate > 75 && that.userRate <= 95){
                that.userProgressColor = 'rgba(255, 212, 111, 1)'
              }else{
                that.userProgressColor = 'rgba(132, 161, 61, 1)'
              }
            // }else if ((that.checkCreator && !that.checkResponsible) || (!that.checkResponsible && !that.checkCreator && that.checkAdmin)){
            //   if (that.total_rate <= 25) {
            //     that.respProgressColor = 'rgba(251,75,75)'
            //   }else if(that.total_rate > 25 && that.total_rate <= 50){
            //     that.respProgressColor = 'rgba(255,168,121)'
            //   }else if(that.total_rate > 50 && that.total_rate <= 75){
            //     that.respProgressColor = 'rgba(255,193,99)'
            //   }else if(that.total_rate > 75 && that.total_rate <= 95){
            //     that.respProgressColor = 'rgba(255, 212, 111, 1)'
            //   }else{
            //     that.respProgressColor = 'rgba(132, 161, 61, 1)'
            //   }
            // }
            that.$nuxt.$loading.finish()
          })
          .catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
            console.log(error)
            that.$nuxt.$loading.finish()
          }
          })
            that.$nuxt.$loading.finish()

      }
    },
    reloadEmployee() {
      this.reloadList()
      this.$nuxt.$loading.start()
      this.$store
        .dispatch(`objects/getAttendeeData`, this.attendeeObjectID)
        .then((attendeeRes) => {
          this.$nuxt.$loading.start()
          this.attendeeArray = attendeeRes.attendee
          let history_of_attendee = []
          _.each(attendeeRes.attendee, function (history) {
            if (Object.keys(history.attendee_history)?.length > 0) {
              history_of_attendee.push(history.attendee_history)
            }
          })
          this.attendeeHistory = history_of_attendee
          this.editItem(this.documentItem)
          // this.$nuxt.$loading.finish()
        })
        // this.$nuxt.$loading.finish()
    },

    reloadResponsible() {
      this.reloadList()
      this.$store
        .dispatch(`objects/getResponsibleData`, this.attendeeObjectID)
        .then((responsibleData) => {
          this.$nuxt.$loading.start()
          this.resp_list = responsibleData.responsible
        })
        this.editItem(this.documentItem)
        this.$nuxt.$loading.finish()
    },

    is_reminder_history() {
      this.isReminderHistory = !this.isReminderHistory
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

    reset() {
      this.$nuxt.$loading.finish()
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
      }, 300)
    },
    async save() {
      // update
      let that = this
      that.$nuxt.$loading.start()
      that.editedItem.is_shared = false
      that.editedItem.is_public = true
      that.editedItem.is_activated = true
      that.editedItem.is_attending_activated = false
      that.editedItem.status = 'New'
      that.editedItem.responsible_id = null
      that.editedItem.attending_emps = []
      that.editedItem.attending_contact = []
      that.editedItem.attendings_count = 0
      that.editedItem.responsible_id = ''
      that.editedItem.parent_id = ''
      that.editedItem.is_template = false
      that.editedItem.isDefaultResponsible = false
      that.editedItem.isDefaultAttendee = false
      that.editedItem.object_id = ''
      that.editedItem.requestEdit = true
      that.editedItem.description = await removeTagsFromString(that.editedItem.description);
      if (that.checkResource) {
        that.editedItem.is_template = true
        that.editedItem.type = 'routine'
        that.editedItem.object_type = 'routine'
        that.textTrime = that.editedItem?.name
        that.editedItem.name = this.textTrime.trim();
        that.editedItem.connectToArray = this.connectToObject;
        that.$store
          .dispatch('routines/update', that.editedItem)
          .then(()=> {
            that.reloadList()
            that.resourceList()
            that.reloadListCategory()
            that.$toaster.success(
              that.$i18n.t('message.success_routine_update')
            )
            that.$nuxt.$loading.finish()
          })
         .catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_routine_update'))
          }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish()
          })
      }
      if (!that.checkResource) {
        that.routineItem.is_duration = that.durationData.is_duration
        that.routineItem.duration = that.durationData.duration
        that.routineItem.recurring = that.durationData.unit
        that.routineItem.start_date = that.editedItem.start_date_pre
        that.routineItem.start_time =  await formatTimeString(that.editedItem.start_time_pre)
        that.routineItem.deadline = that.editedItem.deadline_pre || ""
        // that.routineItem.category_id= that.routineItem.category_id
        that.routineItem.requestEdit = true
        that.routineItem.type = 'routine'
        that.routineItem.id = that.editedItem.id
        that.routineItem.responsible_department_array =
          that.editedItem.responsible_department_array
        that.routineItem.responsible_employee_array =
          that.editedItem.responsible_employee_array
        that.routineItem.isDefaultAttendee = false
        that.routineItem.isDefaultResponsible = false
        that.routineItem.object_type = 'routine'
        that.routineItem.status = 'New'
        that.routineItem.is_template = that.editedItem.is_template
        that.routineItem.is_shared = that.editedItem.is_shared
        that.routineItem.is_public = that.editedItem.is_public
        that.routineItem.responsible_id = that.userID
        that.routineItem.attendee_all = that.editedItem.attendee_all
        that.routineItem.connectToArray = this.connectToObject;
        that.textTrime = that.routineItem?.name
        that.routineItem.name = this.textTrime?.trim()
        that.routineItem.description = await removeTagsFromString(that.routineItem.description);
        that.$store
          .dispatch('objects/update', that.routineItem)
          .then(() => {
            that.reloadList()
            // that.resourceList()
            that.reloadListCategory()
            that.$toaster.success(
              that.$i18n.t('message.success_routine_update')
            )
            that.$nuxt.$loading.finish()
          })
          .catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_routine_update'))
          }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish()
          })
      }

      that.close()
    },
    draft() {
      this.editedItem.status = 0
      this.save()
    },

    reloadList() {
      this.$emit('reloadList')
    },

    resourceList() {
      this.$emit('resourceList')
    },

    reloadListCategory() {
      this.$emit('reloadListCategory')
    },

    // dialog DELETE
    closeDelete() {
      this.dialogDelete = false
    },
    deleteDocument(val) {
      let that = this
      if (that.checkResource) {
        that.$store
          .dispatch('routines/delete', val.index)
          .then(function () {
            that.$emit('resourceList')
            that.$toaster.success(
              that.$i18n.t('message.success_routine_delete')
            )
          })
          .catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_routine_delete'))
          }
          })
        that.dialogDelete = false
        that.close()
      } else if (!that.checkResource) {
        that.$store
          .dispatch('objects/delete', val.index)
          .then(function () {
            that.reloadList()
            that.$toaster.success(
              that.$i18n.t('message.success_routine_delete')
            )
          })
          .catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_routine_delete'))
          }
          })
        that.dialogDelete = false
        that.close()
      }
    },
  },
}
</script>

<style scoped>
::v-deep .sortable {
  font-size: 14px !important;
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
/* .document-attachment {
  height: 23px;
  width: 23px;
} */
.delete-btn {
  box-shadow: none;
  color: #9f9f9f;
  border: 1px solid !important;
  margin: 0px 15px !important ;
}
:deep(.v-dialog > .v-card > .v-card__title) {
  padding: 30px 24px 40px !important;
}
:deep(.review-popup .normal-table .info-block.responsible) {
  border-top: none;
  border-bottom: none;
}

.deadline-chip {
  width: 150px !important;
}
.activation-label {
  width: 141px;
}
:deep(.category-item .icon-flex) {
  width: 119px;
}
:deep(.v-badge__badge) {
  inset: auto auto calc(100% - 4px) calc(-72% - 60px) !important;
}
:deep(.duration-hover .v-badge__badge) {
  inset: auto auto calc(100% - -3px) calc(-72% - 17px) !important;
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
:deep(.v-card .v-card__title) {
  display: flex;
  justify-content: center;
  padding: 40px 24px 25px !important;
}
:deep(.btn-disapprove) {
  background-color: #fd5155 !important;
  color: #fff !important;
  margin-left: 42px !important;
}
:deep(.btn-cancel.btn-disapprove span) {
  text-decoration: none;
}
.confirm-delete-text p {
  font-weight: 500;
  margin-bottom: 0;
}
.deactivation-icon img {
  margin-top: -14px;
}
:deep(.v-btn:not(.v-btn--round).v-size--default) {
  padding: 6px 16px;
}

.responsible-folddown {
  width: 70%;
}
.responsible-folddown .reminder-img {
  margin-top: -10px;
}
:deep(.hover-label .v-badge__wrapper .v-badge__badge) {
  inset: auto auto calc(100% - -8px) calc(0% - 2px) !important;
  background-color: #666768 !important;
}
.reson-hover-label {
  position: absolute;
  top: -15px;
  left: 49px;
}
.disabled {
  z-index: 99;
  color: #adadad;
}
.show-more {
  height: 15px;
  overflow: hidden;
  width: 200px;
}
.show-less {
  width: 200px;
  height: 35px;
}
.review-popup {
  width: 1050px;
}
.review-popup .status-label-custom {
  min-width: 115px;
}
:deep(.disabled) {
  z-index: 99 !important;
  color: #adadad !important;
}
</style>

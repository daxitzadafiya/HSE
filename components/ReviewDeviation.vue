<template>
  <div>
    <v-dialog v-model="openPopup" scrollable max-width="1125px" persistent>
      <v-card>
        <v-card-title
          class="text-h5 justify-content-center text-uppercase mt-7"
        >
          {{
            editedItem.type == 'none'
              ? $t('title.processing_deviation')
              : $t('title.deviation')
          }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <div class="review-popup review-deviation mt-7">
              <div class="review-popup-table normal-table">
                <div class="info-block w-50 align-center">
                  <div class="label-item">{{ $t('form.status') }} :</div>
                  <div v-if="dev_status == 1 || dev_status == 'new'" class="info-item">
                    <v-chip class="info-item status-label-custom pending" label>
                      {{ $t('form.new') }}
                    </v-chip>
                  </div>
                  <div v-if="dev_status == 6 || dev_status == 'pending'" class="info-item">
                    <v-chip class="info-item status-label-custom pending" label>
                      {{ $t('form.pending') }}
                    </v-chip>
                  </div>
                  <div v-else-if="dev_status == 2 || dev_status == 'ongoing' || dev_status === 'timeline_disapproved'">
                    <v-chip class="info-item status-label-custom ongoing" label>
                      {{ $t('form.ongoing') }}
                    </v-chip>
                  </div>
                  <div v-else-if="dev_status== 3 || dev_status == 'closed'">
                    <v-chip
                      class="info-item status-label-custom approved"
                      label
                    >
                      {{ $t('form.closed') }}
                    </v-chip>
                  </div>
                  <div v-else-if="dev_status== 8 || dev_status == 'overdue'">
                  <v-chip
                    class="ma-2 status-label-custom ongoing"
                    label
                  >
                    {{ $t('form.overdue') }}
                   <div role="button" class="ms-2">
                      <img
                        src="../assets/images/icon/alert.png"
                        alt=""
                        srcset=""
                      />
                    </div>
                  </v-chip>
                  </div>
                  <v-chip
                    v-else-if="dev_status == 9 || dev_status == 'completed' && !tasks"
                    class="ma-2 status-label-custom status-btn completed"
                    label
                  >
                    {{ $t('form.completed') }}
                  </v-chip>
                  <v-chip
                    v-else-if="dev_status === 'disapproved'"
                    class="status-btn status-label-custom not-done"
                    label
                  >
                    {{ $t('form.disapproved') }}
                    <!-- <div role="button" class="ms-2">
                      <img
                        src="../assets/images/icon/alert-white.png"
                        alt=""
                        srcset=""
                      />
                    </div> -->
                  </v-chip>
          <v-chip
            v-else-if="dev_status === 'disapproved_overdue'"
            class="info-item status-label-custom not-done"
            label
          >
            {{ $t('form.disapproved') }}
            <div role="button" class="ms-2">
              <img src="../assets/images/icon/alert-white.png" alt="" srcset="" />
            </div>
          </v-chip>
          <v-chip
            v-else-if="dev_status === 'disapproved_with_extended'"
            class="info-item status-label-custom ongoing"
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
            v-else-if="dev_status === 'overdue'"
            class="info-item status-label-custom ongoing"
            label
          >
            {{ $t('form.ongoing') }}
            <div role="button" class="ms-2">
              <img src="../assets/images/icon/alert.png" alt="" srcset="" />
            </div>
          </v-chip>
          <v-chip
            v-else-if="dev_status === 'completed' && checkWorker && tasks"
            class="info-item status-label-custom approved"
            label
          >
            {{ $t('form.completed') }}
            <!-- <div role="button" class="ms-2" >
                                <img src="../assets/images/icon/alert-white.png" alt="" srcset="">
                              </div> -->
          </v-chip>
          <v-chip
            v-else-if="dev_status === 'completed_overdue'"
            class="info-item status-label-custom approved"
            label
          >
            {{ $t('form.completed') }}
            <div role="button" class="ms-2">
              <img
                src="../assets/images/icon/alert-white.png"
                alt=""
                srcset=""
              />
            </div>
          </v-chip>
          <v-chip
            v-else-if="dev_status === 'request'"
            class="info-item status-label-custom ongoing"
            label
          >
            {{ $t('form.request') }}
          </v-chip>

          <v-chip
            v-else-if="dev_status === 'approved'"
            class="info-item status-label-custom approved"
            label
          >
            {{ $t('form.approved') }}
          </v-chip>
          <v-chip
            v-else-if="dev_status === 'approved_overdue'"
            class="info-item status-label-custom approved"
            label
          >
            {{ $t('form.approved') }}
            <div role="button" class="ms-2">
              <img
                src="../assets/images/icon/alert-white.png"
                alt=""
                srcset=""
              />
            </div>
          </v-chip>
          <v-chip
            v-else-if="
              dev_status === 'Reassigned' || dev_status === 'Removed'
            "
            class="info-item status-label-custom not-done"
            label
          >
            {{ $t('form.removed') }}
            <div class="ms-2">
              <img
                src="../assets/images/icon/alert-white.png"
                alt=""
                srcset=""
              />
            </div>
          </v-chip>
                </div>
                <div class="info-block w-50 align-center">
                  <div class="label-item">{{ $t('form.function') }} :</div>
                  <div class="info-item">
                    <!-- {{
                    editedItem.type == 'none'? 'Deviation': editedItem.type == 'task'? 'Deviation > Task': 'Deviation > Risk analysis > Task'
                  }} -->
                    <span v-if="editedItem.type == 'none' || editedItem.type == 'deviation'">{{
                      'Deviation'
                    }}</span>
                    <span
                      v-else-if="
                        (editedItem.type == 'risk' || editedItem.type == 'risk_analysis') && taskArray.length > 0
                      "
                      >{{ 'Deviation > Risk analysis > Task' }}</span
                    >
                    <span
                      v-else-if="
                        (editedItem.type == 'risk' || editedItem.type == 'risk_analysis') && !taskArray.length > 0
                      "
                      >{{ 'Deviation > Risk analysis' }}</span
                    >
                    <span v-else-if="editedItem.type == 'task'">{{
                      'Deviation > Task'
                    }}</span>
                  </div>
                </div>
                <div class="info-block w-50">
                  <div class="label-item">{{ $t('form.name') }} :</div>
                  <div class="info-item">
                    {{ editedItem.subject }}
                  </div>
                </div>

                <div class="info-block w-50 align-center">
                  <div class="label-item">{{ $t('form.category') }} :</div>
                  <div class="info-item">
                    {{ editedItem.category_name }}
                  </div>
                </div>

                <div class="info-block description">
                  <div class="label-item col-2 p-0">
                    {{ $t('form.description') }} :
                  </div>
                  <div class="info-item ml-n16" v-html="editedItem.description">
                  </div>
                </div>
                <div class="info-block w-50">
                  <div class="label-item">{{ $t('form.reported_by') }} :</div>
                  <div class="info-item">
                    {{ editedItem.report_as_anonymous == 1 ? 'Anonymous' : editedItem.added_by_name }}
                  </div>
                </div>
                <div
                  class="info-block w-50 chip"
                  :class="isEdit ? 'd-block' : 'd-flex'"
                >
                  <div
                    class="label-item col-3 p-0 m-0"
                    :class="isEdit ? 'mb-4' : 'm-0'"
                  >
                    {{ $t('form.process_by') }} :
                  </div>
                  <div
                    class="info-item"
                    v-if="responsibleName.length > 0 && !isEdit"
                    @click="(editedItem.added_by == userID && editedItem.type === 'none' && !checkWorker) || (editedItem.added_by !== userID && checkAdmin && editedItem.type === 'none' && !checkWorker) && !checkWorker ? (isEdit = !isEdit) : (isEdit = false)">
                    <v-chip
                      v-for="(item, index) in responsibleName"
                      :key="index"
                      class="mr-2 mb-1 chip-custom"
                      small
                    >
                      {{ item }}
                    </v-chip>
                  </div>
                  <div v-else-if="isEdit">
                    <ResponsibleEdit :object-item="deviationResponseItem" />
                  </div>
                  <div
                    class="info-item"
                    v-else
                    @click="editedItem.type === 'none' ? (isEdit = !isEdit) : (isEdit = false)"
                  >
                    <v-chip class="mr-2 mb-1 chip-custom" small>
                      {{ editedItem.added_by_name }}
                    </v-chip>
                  </div>
                </div>

                <div class="info-block w-50">
                  <div class="label-item">{{ $t('form.place') }} :</div>
                  <div class="info-item">
                    {{ editedItem.place && editedItem.place.place_name }}
                  </div>
                </div>

                <div class="info-block w-50">
                  <div class="label-item">{{ $t('form.place_detail') }} :</div>
                  <div class="info-item">
                    {{ editedItem.place_detail }}
                  </div>
                </div>

                <div class="info-block w-50">
                  <div class="label-item">{{ $t('form.consequence') }} :</div>
                  <div class="info-item">
                    {{
                      editedItem.consequence_for &&
                      editedItem.consequence_for.name
                    }}
                  </div>
                  <!-- <div class="info-item" v-else-if="editedItem.consequence_for==2" >Customer</div>
                  <div class="info-item" v-else>Other</div> -->
                </div>
                <div class="info-block w-50">
                  <div class="label-item">
                    {{ $t('form.consequence_detail') }} :
                  </div>
                  <div class="info-item">
                    {{ editedItem.consequence_detail }}
                  </div>
                  <!-- <div class="info-item" v-else-if="editedItem.consequence_for==2" >Customer</div>
                  <div class="info-item" v-else>Other</div> -->
                </div>

                <div class="info-block w-50">
                  <div class="label-item">
                    {{ $t('form.suggested_corrective_action') }} :
                  </div>
                  <div class="info-item">
                    {{ editedItem.prososial_action }}
                  </div>
                </div>
                <div class="info-block w-50 chip">
                  <div class="label-item">{{ $t('form.attachment') }} :</div>
                  <div v-if="editedItem.attachment" class="info-item">
                    <!-- <div v-if="editedItem.attachment" class="info-item" > -->
                    <img
                      src="~assets/images/attachment.png"
                      alt=""
                      class="ml-2 document-attachment"
                      @click="showImage()"
                    />
                  </div>
                  <div v-else class="info-item">N/A</div>
                </div>

                <div
                  class="info-block chip w-50"
                >
                  <div class="label-item">{{ $t('form.reported') }} :</div>
                  <div class="info-item">
                    {{ moment(editedItem.created_at).format('DD.MM.YYYY') }}
                  </div>
                </div>
                <div
                  class="info-block chip w-50"
                >
                  <div class="label-item">{{ $t('form.security') }} :</div>
                  <div class="info-item">
                    {{ deviationResponseItem.is_public == 1? 'Shared' : 'Personal'}}
                  </div>
                </div>
                <div
                  v-if="editedItem.type != 'none'"
                  class="info-block w-50 chip"
                >
                  <div class="label-item">
                    {{ $t('form.has_it_happened_before') }} :
                  </div>
                  <div class="info-item">
                    {{ editedItem.happened_before == 1 ? 'Yes' : 'No' }}
                  </div>
                </div>
                <div
                  v-if="editedItem.type != 'none'"
                  class="info-block w-50 chip"
                >
                  <div class="label-item">
                    {{ $t('form.corrective_actions') }} :
                  </div>
                  <div class="info-item">
                    {{ editedItem.corrective_action }}
                  </div>
                </div>
                <div
                  v-if="editedItem.type != 'none'"
                  class="info-block w-50 chip"
                >
                  <div class="label-item">
                    {{ $t('form.legal_specifications') }} :
                  </div>
                  <div class="info-item">
                    {{ editedItem.specifications }}
                  </div>
                </div>
                <div
                  v-if="editedItem.type != 'none'"
                  class="info-block w-50 chip"
                  :class="taskArray.length > 0 ? 'w-50' : 'w-50'"
                >
                  <div class="label-item">{{ $t('form.processed') }} :</div>
                  <div class="info-item">
                    <!-- {{moment().format('DD.MM.YYYY') }}    -->
                    {{ moment(editedItem.updated_at).format('DD.MM.YYYY') }}
                    <!-- <span class="ml-5">11:20 AM</span> -->
                  </div>
                </div>
                <div
                  class="info-block w-50 chip"
                  v-if="editedItem.type != 'none' && taskArray.length > 0"
                  :class="
                    editedItem.type != 'none' ? 'w-100' : 'w-50'
                  "
                >
                  <div class="label-item">
                    {{ $t('form.task_processed_by') }} :
                  </div>
                  <div class="info-item">
                    <!-- <v-chip class="mr-2 mb-1 chip-custom green-chip" small>
                    {{ editedItem.responsible_id_name }}
                  </v-chip> -->
                    <v-chip 
                      v-for="(item, index) in taskResponsibleName"
                      :key="index"
                      class="mr-2 mb-1 chip-custom"
                      small
                    >
                      {{ item }}
                    </v-chip>
                  </div>
                </div>
                <!-- <div v-if="checkWorker" class="info-block w-50 chip">
                    <div class="label-item">{{ $t('form.start_date') }}:</div>
                    <div class="info-item">
                        {{moment().format('DD.MM.YYYY') }}
                    </div>
                </div>
                <div v-if="checkWorker" class="info-block w-50 chip">
                    <div class="label-item">{{ $t('form.due_date') }}:</div>
                    <div class="info-item">
                      {{ moment().add(1, 'days').format('DD.MM.YYYY') }}                   
                    </div>
                </div> -->
              </div>
              <!-- v-if="editedItem.type == 'none' && (checkAdmin || checkCreator || checkManager)" -->
              <ProcessDeviation
                v-if="editedItem.type == 'none' && checkResponsible && !checkWorker"
                :deviationItem="editedItem"
                
              />

              <div
                v-if="(editedItem.is_corrective && editedItem.type == 'none') && checkResponsible && !checkWorker"
                class="action"
              >
                <b-row class="mt-6" v-if="!editedItem.isAction">
                  <b-col cols="3">
                    <div class="bold-title md-line-height ml-2 action-title">
                      {{ $t('form.action') }}
                    </div>
                    <v-badge
                      :value="hoverAction"
                      right
                      transition="slide-x-transition"
                      class="hse--icon-question-circle action-badge"
                      :content="$t('form.action')"
                    >
                      <v-hover v-model="hoverAction">
                        <i class="fa fa-question-circle"></i>
                      </v-hover>
                    </v-badge>
                  </b-col>
                  <b-col cols="4">
                    <div class="input-wrap">
                      <div class="switch-component default-question-mark">
                        <label class="left-text">{{ $t('form.none') }}</label>
                        <v-switch
                          v-model="editedItem.isAction"
                          :label="$t('form.custom')"
                          class="right-text"
                          inset
                        />
                      </div>
                    </div>
                  </b-col>
                </b-row>
                <div
                  v-else
                  class="section-connect-to section-connect-to-reminder mt-10"
                >
                  <div
                    class="section-connect-to-label section-connect-to-label-reminder"
                  >
                    {{ $t('form.action') }}
                  </div>
                  <div
                    class="switch-component switch-component-small reminder-type-switch default-question-mark ml-6"
                  >
                    <label class="left-text">{{ $t('form.none') }}</label>
                    <v-switch
                      v-model="editedItem.isAction"
                      :label="$t('form.custom')"
                      class="right-text"
                      inset
                      />
                  </div>
                  <b-row class="pt-3 mt-2 m-2">
                    <b-col cols="12">
                      <v-select
                        v-model="deviationAction"
                        :items="DeviationActionArray"
                        item-value="id"
                        item-text="action"
                        outlined
                        @change="removeItem"
                        item-disabled="disable"
                      >
                      <template v-slot:item="{ props, item }">
                        <div v-if="!item.disable">
                             {{ item.action }}
                                  </div>
                      <div class="d-flex align-items-center flex-wrap">
                      <div v-bind="props">
                      <v-hover v-model="tolltipArray[item.id]"  style="pointer-events: all;">
                      <v-badge
                        v-if = "item.disable"
                        :key="item.action"
                        :value="tolltipArray[item.id]"
                        right
                        transition="slide-x-transition"
                        class="hse--icon-question-circle"
                        style="cursor: pointer;">
                        <span slot="badge" @click="redirectUrl">{{ $t('message.accessible_module') }}</span>
                        <div>
                             {{ item.action }}
                                  </div>
                               </v-badge>
                              </v-hover>
                             </div>
                           </div>
                       </template>
                    </v-select>
                    </b-col>
                  </b-row>
                </div>
              </div>
              <DeviationActions
                v-if="editedItem.isAction && editedItem.is_corrective"
                :deviationAction="deviationAction"
                :categoriesArray="categoriesArray"
                :item="editedItem"
                :riskElementAnalysis="editedItem.source_of_danger"
                :is_custom_responsible="is_custom_responsible"
                @AsOnTask="AsOnTask"
                @riskUpdated="riskUpdated"
                @sourceValue="sourceValue"
              />
              <div
                class="manage-task mb-6"
                v-if="
                  editedItem.type != 'none' && (editedItem.type == 'risk' || editedItem.type == 'risk_analysis')
                "
              >
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
                    {{ translateLevel(item.probability) }}
                    <!-- <span v-if="item.probability === 1" class="mr-3">Low</span>
                <span v-else-if="item.probability === 2" class="mr-3"> Moderate</span>
                <span v-else-if="item.probability === 3" class="mr-3"> High</span>
                <span v-else class="mr-3">Very high</span> -->
                  </template>
                  <template v-slot:item.type> Report </template>
                  <template v-slot:item.consequence="{ item }">
                    {{ translateLevel(item.consequence) }}
                    <!-- <span v-if="item.consequence === 1" class="mr-3">Low</span>
                <span v-else-if="item.consequence === 2" class="mr-3"> Moderate</span>
                <span v-else-if="item.consequence === 3" class="mr-3"> High</span> -->
                    <!-- <span v-else class="mr-3"> Very high</span> -->
                  </template>
                  <template v-slot:item.risk_level="{ item }">
                    <div
                      v-if="(item.risk_level &&item.risk_level >= 1 &&item.risk_level <= 3)"
                      class="source-of-danger-color-code color-green d-inline-block"
                    >
                      {{ item.risk_level }}
                    </div>
                    <div
                      v-if="item.risk_level &&item.risk_level >= 4 &&item.risk_level <= 10"
                      class="source-of-danger-color-code color-yellow d-inline-block"
                    >
                      {{ item.risk_level }}
                    </div>
                    <div
                      v-if="item.risk_level &&item.risk_level >= 11 &&item.risk_level <= 15"
                      class="source-of-danger-color-code color-orange d-inline-block"
                    >
                      {{ item.risk_level }}
                    </div>
                    <div
                      v-if="item.risk_level && item.risk_level === 16"
                      class="source-of-danger-color-code color-red d-inline-block"
                    >
                      {{ item.risk_level }}
                    </div>
                  </template>
                </v-data-table>

                <!-- <add-new-source-of-danger
              v-else
              :object-item="editedItem"
              :edit-mode="false"
              /> -->
              </div>
              <div v-if="editedItem.type != 'none' && tasks">
                <folding-info-table
                  :infoItem="infoItem"
                  :arrayItem="arrayItem"
                  :docItem="editedItem"
                  :processingItem="processingItem"
                  :openEmployeeTable="openEmployeeTable"
                  :routineTaskFeild="true"
                  :checkEdit="checkEdit"
                  :category_type="'deviation'"
                  @saveInfo="editItem"
                  @openInfo="openInfo"
                  @sendRequest="sendRequest"
                />
                <ChangeEmployeeTable
                  v-if="!checkWorker && !isEdit && openEmployeeTable"
                  :AttendeeHeaders="AttendeeHeaders"
                  :isReminder="true"
                  :attendeeArray="attendeeArray"
                  :attendeeHistoryData="attendeeHistory"
                  :attendeeObjectID="attendeeObjectID"
                  :checkResponsiblePersone="checkResponsible"
                  :isReminderHistory="isReminderHistory"
                  :showExpand="showExpand"
                  :allEmployee="allEmployee"
                  @is_reminder_history="is_reminder_history"
                  @reloadEmployee="reloadEmployee"
                  @statusApprovedAction="statusApprovedAction"
                  @statusDisapprovedAction="statusDisapprovedAction"
                  @approvedReqestDate="approvedReqestDate"
                  @declineReqestDate="declineReqestDate"
                />
            
                <!-- <v-data-table
                  :headers="TaskHeaders"
                  :items="taskArray"
                  class="elevation-1 review-table review-popup-table hse-table"
                  :items-per-page="15"
                  :single-expand="true"
                  :sort-by="['created_at']"
                  :sort-desc="[true, false]"
                  hide-default-footer
                  @click:row="isShowTask = !isShowTask"
                >
                  <template v-slot:top>
                    <v-toolbar flat>
                      <v-toolbar-title>{{ $t('title.task') }}</v-toolbar-title>
                    </v-toolbar>
                  </template>
                  <template v-slot:header.status="{ header }">
                    <span>{{ 'Status' }}</span>
                  </template>
                  <template v-slot:header.total_attendees="{ header }">
                    <div v-if="!checkWorker">
                      {{ $t('column.total_attendee') }}
                    </div>
                  </template>
                  <template v-slot:item.name="{ item }">
                    {{ item.name }}
                  </template>
                  <template v-slot:item.status="{ item }">
                    <div v-if="item.status == 1 || item.status == 'New'" class="info-item">
                      <v-chip
                        class="info-item status-label-custom pending"
                        label
                      >
                        {{ $t('form.new') }}
                      </v-chip>
                    </div>
                    <div v-if="item.status === 6" class="info-item">
                      <v-chip
                        class="info-item status-label-custom pending"
                        label
                      >
                        {{ $t('form.pending') }}
                      </v-chip>
                    </div>
                    <div v-else-if="item.status == 2">
                      <v-chip
                        class="info-item status-label-custom ongoing"
                        label
                      >
                        {{ $t('form.ongoing') }}
                      </v-chip>
                    </div>
                    <div v-else-if="item.status== 8">
                  <v-chip
                    class="ma-2 status-label-custom ongoing"
                    label
                  >
                    {{ $t('form.overdue') }}
                    <div
                      class="
                        info-icon-gray
                        text-center
                        d-flex
                        align-center
                        justify-center
                      "
                    >
                      !
                    </div>
                  </v-chip>
                  </div>
                  <div v-else-if="item.status== 7">
                   <v-chip
                    class="ma-2 status-label-custom pending"
                    label
                  >
                    {{ $t('form.upcoming') }}
                  </v-chip>
                  </div>
                    <div v-else-if="item.status== 3">
                      <v-chip
                        class="info-item status-label-custom approved"
                        label
                      >
                        {{ $t('form.closed') }}
                      </v-chip>
                    </div>
                  </template>
                  <template v-slot:item.total_attendees="{ item }">
                    <div v-if="!checkWorker">{{ item.totalAttendee }}</div>
                  </template>
                  <template v-slot:item.start_date="{ item }">
                    {{ moment(item.start_date).format('DD.MM.YYYY') }}
                  </template>
                  <template v-slot:item.deadline="{ item }">
                    {{ moment(item.deadline).format('DD.MM.YYYY') }}
                  </template>
                </v-data-table> -->
                <!-- <deviation-task-info v-if="isShowTasks"/> -->
                <!-- <ResponsibleAttendeeAction
                  v-if="isShowTask"
                  :editedItem="taskDetailData"
                  :taskDeviation="true"
                  :item="deviationResponseItem"
                  :titleMessage="$t('title.attendees')"
                  :addTopic="true"
                  :topicArray="attendeeArray"
                  :headers="responsibleAttendeeHeader"
                  :addCommentAttach="false"
                  :isReminder="true"
                  :checkResponsiblePerson="checkResponsiblePerson"
                  :checkCreator="checkCreator"
                  :checkResponsible="checkResponsible"
                  @editTask="editTask()"
                  @reloadList="reloadList"
                /> -->
              </div>
            </div>
              <!-- Connected To -->
              <v-data-table
               v-if="(roleUser!='manager' || connectToObject.length>0) && !viewPopup"
               :headers="connectToObjectTableHeaders"
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
          </v-form>
        </v-card-text>
        <v-card-actions class="mb-7">
          <!-- <div class="input-wrap switch-component index-badge">
          <label class="left-text">{{ $t('button.index') }}</label>
          <v-badge
            :value="hoverQuestionMark"
            right
            transition="slide-x-transition"
            class="hse--icon-question-circle"
            :content="$t('message.hover_index')"
          >
            <v-hover v-model="hoverQuestionMark">
              <i class="fa fa-question-circle"></i>
            </v-hover>
          </v-badge>
        </div> -->
          <v-spacer />
          <div class="me-8">
            <v-btn class="btn-cancel" text @click="close">
              {{ $t('button.cancel') }}
            </v-btn>
            <v-btn
              class="btn-save"
              @click="save"
              v-if="((editedItem.type == 'none') && (isEdit || checkResponsible) && !checkWorker) "
            :disabled="!!planAccess?.lastPlanAccess?.deviation">
              {{ $t('button.save') }}
            </v-btn>
            <v-btn
            v-if="!hideDone && checkAttendee && routineTaskFeild && (checkWorker || checkAsAttendee) && checkEdit"
            class="btn-save"
            @click="submitContent"
            :disabled="!!planAccess?.lastPlanAccess?.deviation">
            {{ $t('button.done') }}
          </v-btn>
          <v-btn
            v-if="checkResponsible && !isEdit && userRate == 100 && doneResponse && !closedStatus"
            class="btn-save"
            @click="respSubmition"
            :disabled="!!planAccess?.lastPlanAccess?.deviation">
            {{ $t('button.done') }}
          </v-btn>
          <!-- <v-btn
            v-if="
              ((checkCreator && total_rate == 100 && !checkResponsible) ||
                (checkCreator && checkResponsible && userRate == 100)) &&
              !closedStatus
            "
            class="btn-save"
            @click="updateDeviation"
          >
            {{ $t('form.verify') }}
          </v-btn> -->
          <v-btn
            v-if="checkResubmit && checkWorker && routineTaskFeild"
            class="btn-save"
            @click="submitContent"
            :disabled="!!planAccess?.lastPlanAccess?.deviation">
            {{ $t('button.resubmit') }}
          </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <image-popup
      :open-popup="checkImage"
      @closePopup="checkImage = !checkImage"
      :addImage="addImage"
    />
      
      <ConnectToObjectModal
           v-if="is_connect"
          :isconnect="true"
          :editedItem="editedItem"
          ref="connectToObject"
          :connect-to-object-table-data="connectToObject"
          :tableData="connectToObject"
          :connect-to-array-input="connectToObject"
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
      
    <dis-approved-popup
      :open-popup="disapprovedModal"
      :isDisapproved="isDisapproved"
      :objectItem="processingItem"
      :title-message="disApprovedTitle"
      :editDeadlineTime="editDeadlineTime"
      :attendeeObjectID="attendeeObjectID"
      :extend-date="true"
      :extend-time="true"
      @disApproved="deadlineRequest"
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
  </div>
</template>
  
  <script>
import cookies from 'js-cookie'
// import AddTaskPopup from "./AddTaskPopup";
import ProcessDeviation from './ProcessDeviation'
import DeviationActions from './DeviationActions.vue'
import { _ } from 'vue-underscore'
// import DeviationTaskInfo from './DeviationTaskInfo.vue';
import axios from 'axios'
// import api from '~/apis'
// import ResponsibleAttendeeAction from './ResponsibleAttendeeAction.vue'
// import AddSourceofDangerTable from './AddSourceofDangerTable.vue'
// import AddNewSourceOfDanger from './AddNewSourceOfDanger.vue'
import ConnectToObjectModal from './ConnectToObjectModal.vue'
import ResponsibleEditInReviewPopup from './ResponsibleEditInReviewPopup'
import ImagePopup from './ImagePopup.vue'
import FoldingInfoTable from './FoldingInfoTable.vue'
import ChangeEmployeeTable from './ChangeEmployeeTable.vue'
import DisApprovedPopup from './DisApprovedPopup.vue'
import FeedbackPopup from './FeedbackPopup.vue'
import moment from "moment";
import { formatTimeString, removeTagsFromString } from "./common/js/functions"

export default {
  name: 'ReviewDeviation',
  components: {
    // AddTaskPopup,
    ProcessDeviation,
    DeviationActions,
    // DeviationTaskInfo,
    // ResponsibleAttendeeAction,
    // AddSourceofDangerTable,
    ConnectToObjectModal,
    ResponsibleEdit: ResponsibleEditInReviewPopup,
    // AddNewSourceOfDanger,
    ImagePopup,
    FoldingInfoTable,
    ChangeEmployeeTable,
    DisApprovedPopup,
    FeedbackPopup,
    GoalReviewPopup: () => import('./GoalReviewPopup.vue'),
    TaskReviewPopup: () => import('./TaskReviewPopup.vue'),
    ReviewRoutinePopup: () => import('./ReviewRoutinePopup.vue'),
    RiskAnalysisReviewPopup: () => import('./RiskAnalysisReviewPopup.vue'),
    ReviewDeviation: () => import('./ReviewDeviation.vue'),
    EditChecklistPopup: () => import('./EditChecklistPopup.vue'),
    InstructionReviewPopup: () => import('./InstructionReviewPopup.vue'),
  },

  props: {
    openPopup: {
      type: Boolean,
      required: false,
    }, 
    viewPopup: {
      type: Boolean,
      required: false,
    },
    fieldInput: {
      type: Array,
      required: false,
    },
    deviationItem: {
      type: Object,
      required: false,
    },
    jobTitleArray: {
      type: Array,
      required: false,
    },
    consequenceArray: {
      type: Array,
      required: false,
    },
    placeArray: {
      type: Array,
      required: false,
    },
    departmentsArray: {
      type: Array,
      required: false,
    },
    predefinedLinkArray: {
      type: Array,
      required: false,
    },
    taskAssigneesArray: {
      type: Array,
      required: false,
    },
    responsibleArray: {
      type: Array,
      required: false,
    },
    categoriesArray: {
      type: Array,
      required: false,
    },
  },

  data: () => ({
    checkSuperAdmin: cookies.get('checkSuperAdmin'),
    objectEditItem : {},
    isObjectOpen : false,
    isOnlyView: false,
    connectToObject: [],
    is_connect: false,
    checkAdmin: cookies.get('checkAdmin'),
    roleUser: cookies.get('roleUser'),
    userDepartmentId: parseInt(cookies.get('userDepartmentId')),
    userRoleId: parseInt(cookies.get('roleID')),
    pageKey: 'reports-deviations-deviations',
    permissionsUser: localStorage.getItem('permissionsKey'),
    planAccess: JSON.parse(localStorage.getItem('planAccess')),
    userID: parseInt(cookies.get('userID')),
    valid: true,
    required: [
      (v) => {
        if (!v || v.length < 1) return 'This is required'
        else return true
      },
    ],
    selectedFile: [],
    riskElement: {
      id: '',
      name: '',
      description_default: '',
      type: '',
      type_id: '',
      probability: '',
      probabilityName: '',
      consequence: '',
      consequenceName: '',
      code: '',
      colorCode: '',
      colorName: '',
      point: '',
      description_resolve: '',
      newlyCreated: false,
      risk_element_source_id: '',
    },
    isEdit: false,
    is_custom_responsible: true,
    deviationAction: 0,
    taskDetailData: {},
    editSourceOfDanger: false,
    routineTaskFeild:true,
    deviationResponseItem: {},
    editedItem: {
      hover: false,
      function: 'Deviation > Task',
      industry_id: '',
      industry_id_arr: [],
      name: '',
      added_by_name: '',
      description: '',
      parent_id: '',
      responsible_id: '',
      type_of_attachment: 2,
      attachment: '',
      category_id: '',
      category_name: '',
      deadline: '',
      deadline_pre: '',
      end_time: '',
      show_manager: false,
      count_related_object: 0,
      related_objects: [],
      parent_object: '',
      editPermission: true,
      is_suggestion: false,
      // table Security
      object_type: 'deviation',
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
      // source_of_danger:[{
      //   name: '',
      //   type: 'Report',
      //   probability: '',
      //   consequence: '',
      //   colorCode: '',
      //   description_resolve: '',
      //   need_to_process:false,
      //   risk_level:'',
      //   status: 1,
      //   visible_to_others:'',
      // }],
      source_of_danger: [
        {
          name: '',
          id: '',
          type: 'Report',
          probability: '',
          consequence: '',
          colorCode: '',
          comment: '',
          need_to_process: false,
        },
      ],
      start_date_pre: '',
      start_date: '',
      attendee_all: false,
      is_commentSwitch: false,
      is_AttachSwitch: false,
      attachFile: [],
      remider_note: '',
      is_duration: false,
      duration: 1,
      place_detail: '',
      consequence_detail: '',
      // hover: false,
      // hoverQuestionMark: false
      added_by: '',
      place: '',
      consequence_for: '',
      subject: '',
      prososial_action: '',
      corrective_action: '',
      happened_before: '',
      is_happened_before: false,
      is_corrective: false,
      is_legalSpecifications: false,
      specifications: '',
      status: 1,
      report_as_anonymous: false,
      department_id: '',
      job_title_id: '',
      action: '',
      need_to_process: false,
      is_task: false,
      allow_close_by_admin: false,
      reopen: 0,
      start_time: '',
      start_time_pre: '',
      end_time_pre: '',
      updateResponsible: false,
      object_id: '',
      source_id: '',
      nearest_manager: false,
      risk_analysis: {},
    },
    defaultItem: {
      risk_analysis: {},
      nearest_manager: false,
      hover: false,
      function: 'Deviation > Task',
      industry_id: '',
      industry_id_arr: [],
      name: '',
      added_by_name: '',
      description: '',
      parent_id: '',
      responsible_id: '',
      type_of_attachment: 2,
      attachment: '',
      category_id: '',
      category_name: '',
      deadline: '',
      deadline_pre: '',
      end_time: '',
      end_time_pre: '',
      show_manager: false,
      count_related_object: 0,
      related_objects: [],
      parent_object: '',
      editPermission: true,
      is_suggestion: false,
      // table Security
      object_type: 'deviation',
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
      // source_of_danger:[{
      //   name: '',
      //   type: 'Report',
      //   probability: '',
      //   consequence: '',
      //   colorCode: '',
      //   description_resolve: '',
      //   need_to_process:false,
      //   risk_level:'',
      //   status: 1,
      //   visible_to_others:'',
      // }],
      source_of_danger: [
        {
          name: '',
          id: '',
          type: 'Report',
          probability: '',
          consequence: '',
          colorCode: '',
          comment: '',
          need_to_process: false,
          visible_to_others: '',
          risk_level: '',
        },
      ],
      start_date_pre: '',
      start_date: '',
      checkAsAttendee: false,
      attendee_all: false,
      is_commentSwitch: false,
      is_AttachSwitch: false,
      attachFile: [],
      remider_note: '',
      is_duration: false,
      duration: 1,
      place_detail: '',
      consequence_detail: '',
      // hover: false,
      // hoverQuestionMark: false
      added_by: '',
      place: '',
      consequence_for: '',
      subject: '',
      prososial_action: '',
      corrective_action: '',
      happened_before: '',
      is_happened_before: false,
      is_corrective: false,
      is_legalSpecifications: false,
      specifications: '',
      status: 1,
      report_as_anonymous: false,
      department_id: '',
      job_title_id: '',
      action: '',
      need_to_process: false,
      is_task: false,
      allow_close_by_admin: false,
      reopen: 0,
      start_time: '',
      start_time_pre: '',
      updateResponsible: false,
      object_id: '',
      source_id: '',
    },
    checkImage: false,
    ActionRiskItem: {
      object_type: 'deviation',
      responsible_id: '',
      added_by: '',
      status: '',
      category_id: '',
      happened_before: '',
      corrective_action: '',
      prososial_action: '',
      specifications: '',
      action: '',
      name: '',
      description: '',
      department_array: '',
      employee_array: '',
      object_id: '',
      is_public: false,
      is_shared: false,
      company_id: '',
      source: '',
      // tasks: [],
      isDefaultResponsible: false,
      attendee_all:false,
      risk_element_array: [],
      isDefaultAttendee: false,
      nearest_manager: false,
    },
    ActionTaskItem: {
      type: 'task',
      responsible_id: '',
      added_by: '',
      category_id: '',
      source: 'deviation',
      object_id: '',
      status: '',
      name: '',
      happened_before: '',
      corrective_action: '',
      specifications: '',
      action: '',
      responsible_department_array: [],
      responsible_employee_array: [],
      isDefaultAttendee: false,
      attendee_department_array: [],
      attendee_employee_array: [],
      attendee_all:false,
      attendee_required_comment: false,
      attendee_required_attachment: false,
      responsible_required_attachment: false,
      responsible_required_comment: false,
      is_public: false,
      is_shared: false,
      company_id: '',
      department_id: '',
      job_title_id: '',
      industry_id: '',
      start_date: '',
      start_time: '',
      deadline: '',
      end_time: '',
      end_time_pre: '',
      recurring: '',
      description: '',
      isDefaultResponsible: false,
      nearest_manager: false,
    },
    responsibleName: [],
    taskResponsibleName: [],
    // taskInRisk: [],
    taskData: [
      {
        name: '',
        assigned_company: '',
      },
    ],
    chooseTask: false,
    checkCreator: false,
    checkManager: false,
    checkWorker: false,
    is_task: false,
    objectField: [
      'name',
      'description',
      'category',
      'responsible',
      'attendee',
      'start-date',
      'deadline',
    ],
    isShowTask: false,
    isTaskDeviation: false,
    hoverQuestionMark: false,
    hoverAction: false,
    taskArray: [
      // {
      //   name: 'Task Name',
      //   total_attendees: '5',
      // },
    ],
    checkResponsiblePerson: false,
    checkResponsible: false,
    riskObject: '',
    taskInRisk: {
      nearest_manager: false,
      responsible_department_array: [],
      responsible_employee_array: [],
      attendee_department_array: [],
      attendee_employee_array: [],
      attendee_all: false,
      start_date: '',
      start_time: '',
      deadline: '',
      end_time: '',
      attendee_required_attachment: false,
      attendee_required_comment: false,
      responsible_required_attachment: false,
      responsible_required_comment: false,
      isDefaultAttendee: false,
      isDefaultResponsible: false,
      is_template: false,
      is_suggestion: false,
      is_valid: false,
      name: '',
      description: '',
      category_id: '',
      start_date_pre: '',
      start_time_pre: '',
      deadline_pre: '',
      deadline_time_pre: '',

      type: 'task',
      responsible_id: '',
      added_by: '',
      source: 'deviation',
      object_id: '',
      status: '',
      happened_before: '',
      corrective_action: '',
      specifications: '',
      action: 'task',
      is_public: false,
      is_shared: false,
      company_id: '',
      department_id: '',
      job_title_id: '',
      industry_id: '',
      recurring: '',
    },
    riskElementAnalysis: [
      {
        name: '',
        type: 'Report',
        probability: '',
        consequence: '',
        colorCode: '',
        description_resolve: '',
        need_to_process: false,
        risk_level: '',
        status: 1,
        visible_to_others: '',
      },
    ],
    risk_task_id:'',
    riskId: '',
    risk_analysis: {},
    // riskItem: {},
    riskItem: {
      name: '',
      status: 1,
      need_to_process: false,
      visible_to_others: '',
    },

    tolltipArray:{
      1:false,
      2:false,
      3:false
    },
    probabilityArr: [
      {
        value: '1',
        name: 'Low',
      },
      {
        value: '2',
        name: 'Moderate',
      },
      {
        value: '3',
        name: 'High',
      },
      {
        value: '4',
        name: 'Very high',
      },
    ],
    consequenceArr: [
      {
        value: '1',
        name: 'Low',
      },
      {
        value: '2',
        name: 'Moderate',
      },
      {
        value: '3',
        name: 'High',
      },
      {
        value: '4',
        name: 'Very high',
      },
    ],
    colorCodeArr: [
      {
        min: 0,
        max: 0,
        value: 'black',
        name: 'None',
      },
      {
        min: 1,
        max: 3,
        value: 'green',
        name: 'Green',
      },
      {
        min: 4,
        max: 10,
        value: '#f0e509',
        name: 'Yellow',
      },
      {
        min: 11,
        max: 15,
        value: 'orange',
        name: 'Orange',
      },
      {
        min: 16,
        max: 16,
        value: 'red',
        name: 'Red',
      },
    ],
    source_of_danger: [],

    infoItem: {},
    arrayItem: [],
    attendeeArray: [],
    attendeeHistory: [],
    attendeeObjectID: '',
    openEmployeeTable: false,
    isReminderHistory: false,

    hideDone: false,
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
    disApprovedTitle: '',
    isDisapproved: false,
    employeeFeedback: false,
    employeeImage: false,
    hoverItem: false,
    hover: false,
    checkNew: false,
    resp_list: [],
    hideDelete: false,
    closedStatus:false,
    docItem:{},
    tasks:false,
    dev_status:'',
    connect_objectID:'',
     allEmployee:'',
      allResponsible:'',
    editDeadlineTime:false,

  }),

  computed: {

      DeviationActionArray() {
        return [
          {
            id: 1,
            action: 'Personal Risk Analysis',
            disable: !!this.planAccess?.lastPlanAccess?.risk || !this.planAccess?.planAccess?.risk
          },
          {
            id: 2,
            action: 'Delegate Risk Analysis',
            disable: !!this.planAccess?.lastPlanAccess?.risk || !this.planAccess?.planAccess?.risk
          },
          {
            id: 3,
            action: 'Task',
            disable: !!this.planAccess?.lastPlanAccess?.task || !this.planAccess?.planAccess?.task
          },
        ]
      },
      connectToObjectTableHeaders () {
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
    TaskHeaders() {
      return [
        {
          text: this.translateCol('name'),
          value: 'name',
          align: 'center',
          sortable: false,
        },
        {
          text: this.translateCol('total_attendee'),
          value: 'total_attendees',
          align: 'center',
          sortable: false,
        },
        {
          text: this.translateCol('start_date'),
          value: 'start_date',
          align: 'center',
          sortable: false,
        },
        {
          text: this.translateCol('deadline'),
          value: 'deadline',
          align: 'center',
          sortable: false,
        },
        { text: '', value: 'status', align: 'center', sortable: false },
      ]
    },
    headersRiskElementArr() {
      return [
        {
          text: this.translateCol('name'),
          value: 'name',
          align: 'center',
          width: '18%',
        },
        {
          text: this.translateCol('type'),
          value: 'type',
          align: 'center',
          width: '16%',
        },
        {
          text: this.translateCol('probability'),
          value: 'probability',
          align: 'center',
          width: '12%',
        },
        {
          text: this.translateCol('consequence'),
          value: 'consequence',
          align: 'center',
          width: '12%',
        },
        {
          text: this.translateCol('color_code'),
          value: 'colorCode',
          align: 'center',
          width: '10%',
        },
        {
          text: this.translateCol('comment'),
          value: 'description_resolve',
          align: 'center',
          width: '20%',
        },
        {
          text: this.translateCol('actions'),
          value: 'actions',
          align: 'center',
          width: '16%',
          sortable: false,
        },
      ]
    },
    responsibleAttendeeHeader() {
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
        },
        {
          text: this.translateCol('image'),
          value: 'image',
          align: 'center',
          sortable: false,
        },
        { text: this.translateCol('status'), value: 'status', align: 'center' },
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
        this.getObject({ type:'deviation', objectID: this.deviationItem.object_id});
        this.deviationAction = 0
        this.isShowTask = false
        this.riskElementAnalysis = [{ name: '', type: 'Report', id: 1 }]
        if (this.deviationItem) {
          let categoryId = this.deviationItem.category_id
          this.categoriesValidArray = _.filter(
            this.categoriesArray,
            function (item) {
              return (
                !item.disable_status ||
                (item.disable_status && item.id === categoryId)
              )
            }
          )
          this.openEmployeeTable = false
          this.checkAsAttendee=false;
          this.viewPopup ? this.viewItem(this.deviationItem) : this.editItem(this.deviationItem)
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
  },

  created() {
    if (this.openPopup) {
      if (this.deviationItem ) {
        this.viewPopup ? this.viewItem(this.deviationItem) : this.editItem(this.deviationItem)
        
      } else {
        this.addNew()
      }
    }
    if (this.roleUser == 'manager') this.checkManager = true

    if (this.roleUser == 'user') this.checkWorker = true
    this.riskElementAnalysis.name = this.editedItem.subject
  },

  methods: {
      getConnectToArray (data) {
          this.connectToObject = data;
      },
      handleObjectOpen (item) {
          this.objectEditItem = {
              'id': item.source_id,
              'type': item?.source || item?.connect_to_source,
          };
          this.isObjectOpen = true;
          this.isOnlyView = true;
      },
    redirectUrl(){
      if (this.roleUser == 'company admin') {
              this.$router.push('/settings/billings/');
          }
     },
    // addNewItem(isAddNew){
    //   // this.editSourceOfDanger=true
    //     if ((this.checkCreator || this.checkResponsible)) {
    //       this.editSourceOfDanger = true
    //       this.editedItem.isAddNewSourceOfDanger = isAddNew;
    //   }
    // },
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

    is_reminder_history() {
      this.isReminderHistory = !this.isReminderHistory
    },

    translateCol(colName) {
      return this.$i18n.t('column.' + colName)
    },
    sourceValue(val) {
      this.editedItem.source_of_danger = val.list
    },
    AddTask() {
      this.is_task = false
    },
    reloadList() {
      this.$emit('reloadList')
    },

    reloadListCategory() {
      this.$emit('reloadListCategory')
    },
  
    async getObject(item) {
        this.connectToObject = []
          await this.$store.dispatch('connectToObject/getByObject', {
              objectID: item.objectID,
              type: item.type,
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
      
    addNew() {
      // this.reset()
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
    async AsOnTask(payload) {
      if (payload) {
        let that = this
        that.taskInRisk = payload.item
              
        // that.taskInRisk.start_time = new moment(payload.item.start_time_pre, "HH:mm").utc().format("HH:mm") == 'Invalid date' ? '' : new moment(payload.item.start_time_pre, "HH:mm").utc().format("HH:mm");
        // that.taskInRisk.end_time = new moment(payload.item.end_time_pre, "HH:mm").utc().format("HH:mm")== 'Invalid date' ? '' : new moment(payload.item.end_time_pre, "HH:mm").utc().format("HH:mm");

        that.taskInRisk.start_time = await formatTimeString(new moment(payload.item.start_time_pre, "HH:mm"))
        that.taskInRisk.end_time = await formatTimeString(new moment(payload.item.end_time_pre, "HH:mm"))
        that.taskInRisk.deadline = payload.item.deadline_pre
        that.taskInRisk.object_id = that.risk_task_id
        that.taskInRisk.start_date = payload.item.start_date_pre
        that.taskInRisk.happened_before = that.editedItem.happened_before
        that.taskInRisk.corrective_action = that.editedItem.corrective_action
        that.taskInRisk.source = 'risk-analysis'
        that.taskInRisk.object_type = 'task'
        that.taskInRisk.source_id = that.risk_task_id
        that.taskInRisk.specifications = that.editedItem.specifications
        that.$nuxt.$loading.start()
        that.$store
          .dispatch('objects/store', that.taskInRisk)
          .then(function () {
            that.reloadList()
            that.$toaster.success(that.$i18n.t('message.success_task_add_new'))
            that.$nuxt.$loading.finish()
          })
          .catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_task_add_new'))
            }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish()
          })

        that.$nuxt.$loading.finish()
      }
    },
    showImage() {
      this.checkImage = true
      this.addImage = this.editedItem.attachment
    },
    editTask() {
      let that = this
      that.$nuxt.$loading.start()
      that.close()
      that.$nuxt.$loading.finish()
    },
    riskUpdated() {
      let that = this

      that.$nuxt.$loading.start()
      // that.editedItem.action=that.deviationAction
      that.editedItem.happened_before = that.editedItem.is_happened_before
      that.editedItem.deadline = that.editedItem.deadline_pre
      that.editedItem.name = that.editedItem.subject
      that.editedItem.consequence_for = that.editedItem?.consequence_for?.id
      that.editedItem.place = that.editedItem?.place?.id

      if (that.deviationAction == 1) {

        that.ActionRiskItem.source_of_danger = that.editedItem.source_of_danger
        that.ActionRiskItem.source = 'deviation'
        that.ActionRiskItem.type = 'risk-analysis'
        that.ActionRiskItem.action = 'risk'
        that.ActionRiskItem.id = that.editedItem.id
        that.ActionRiskItem.responsible_id = that.editedItem.responsible
        that.ActionRiskItem.is_shared = that.editedItem.is_shared ? 1 : 0
        that.ActionRiskItem.is_public = that.editedItem.is_public ? 1 : 0
        that.ActionRiskItem.added_by = that.editedItem.added_by
        that.ActionRiskItem.name = that.editedItem.subject
        that.ActionRiskItem.description = that.editedItem.description
        that.ActionRiskItem.category_id = that.editedItem.category_id
        that.ActionRiskItem.company_id = that.editedItem.company_id
        that.ActionRiskItem.corrective_action =that.editedItem.corrective_action
        that.ActionRiskItem.department_array = that.editedItem.department_array
        that.ActionRiskItem.employee_array = that.editedItem.employee_array
        that.ActionRiskItem.happened_before = that.editedItem.happened_before
        that.ActionRiskItem.object_id = that.editedItem.object_id
        that.ActionRiskItem.prososial_action = that.editedItem.prososial_action
        that.ActionRiskItem.specifications = that.editedItem.specifications
        that.ActionRiskItem.attendee_all = that.editedItem.attendee_all
        that.ActionRiskItem.status = 2
        that.ActionRiskItem.report_as_anonymous = that.editedItem.report_as_anonymous

        that.$store
          .dispatch('objects/store', that.ActionRiskItem)
          .then(function (res) {
            that.risk_task_id = res.data.id
            that.reloadList()
            that.reloadListCategory()
            that.$toaster.success(
              that.$i18n.t('message.success_risk_analysis_add_new')
            )
            that.$nuxt.$loading.finish()
          })
          .catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_risk_analysis_add_new'))
            }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish()
          })

        //   that.$store
        // .dispatch('deviations/show', that.ActionRiskItem.id)
        // .then(function (responsRisk) {
        //   that.reloadList();
        //   that.reloadListCategory();
        //   that.$nuxt.$loading.finish()
        // })
        // .catch((error) => {
          //   if (error.response.status == 401) {
          //   that.$router.push('/login');
          //   that.$toaster.error(that.$i18n.t('message.token_expired'));
          // }else{
        //   // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        // }
        //   that.$nuxt.$loading.finish()
        // })
      }
      that.close()
    },
    removeItem(){
          this.editedItem.source_of_danger[0].probability = ""
          this.editedItem.source_of_danger[0].consequence = ""
          this.editedItem.source_of_danger[0].colorCode = ""
          this.editedItem.source_of_danger[0].comment = ""
    },
    async save() {
      // update
      let that = this
      // that.$nuxt.$loading.start()
      if (that.$refs.form.validate()) {
        // that.editedItem.action=that.deviationAction
        that.editedItem.happened_before = that.editedItem.is_happened_before
        that.editedItem.deadline = that.editedItem.deadline_pre
        that.editedItem.name = that.editedItem.subject
        that.editedItem.consequence_for = that.editedItem?.consequence_for?.id
        that.editedItem.place = that.editedItem?.place?.id
        let riskSourceData = false
        if (that.deviationAction == 1) {
          _.each(that.editedItem.source_of_danger, function (sourceData , index) {
            if (sourceData.probability !== '' && sourceData.consequence !== '' && sourceData.comment !== '' ) {
              if (!that.riskItem.need_to_process) {
                that.riskItem.status = 3
                that.riskItem.need_to_process = 0
              } else {
                that.riskItem.status = 1
                that.riskItem.need_to_process = 1
              }
              that.riskElementAnalysis[0].need_to_process =that.riskItem.need_to_process
              that.riskElementAnalysis[0].visible_to_others = 1
              that.ActionRiskItem.source_of_danger =that.editedItem.source_of_danger
              that.ActionRiskItem.source = 'deviation'
              that.ActionRiskItem.type = 'risk-analysis'
              that.ActionRiskItem.action = 'risk'
              that.ActionRiskItem.id = that.editedItem.id
              that.ActionRiskItem.description = that.editedItem.description
              that.ActionRiskItem.responsible_id = that.editedItem.responsible
              that.ActionRiskItem.is_shared = that.editedItem.is_shared ? 1 : 0
              that.ActionRiskItem.is_public = that.editedItem.is_public ? 1 : 0
              that.ActionRiskItem.added_by = that.editedItem.added_by
              that.ActionRiskItem.name = that.editedItem.subject
              that.ActionRiskItem.category_id = that.editedItem.category_id
              that.ActionRiskItem.company_id = that.editedItem.company_id
              that.ActionRiskItem.corrective_action =that.editedItem.corrective_action
              that.ActionRiskItem.department_array =that.editedItem.department_array
              that.ActionRiskItem.employee_array =that.editedItem.employee_array
              that.ActionRiskItem.happened_before =that.editedItem.happened_before
              that.ActionRiskItem.object_id = that.editedItem.object_id
              that.ActionRiskItem.prososial_action =that.editedItem.prososial_action
              that.ActionRiskItem.specifications =that.editedItem.specifications
              that.ActionRiskItem.status = 2
              that.ActionRiskItem.responsible_id = that.editedItem.responsible
              that.ActionRiskItem.isDefaultResponsible = false
              that.ActionRiskItem.responsible_employee_array =that.editedItem.responsible_employee_array
              that.ActionRiskItem.responsible_department_array =that.editedItem.responsible_department_array
              that.ActionTaskItem.attendee_all = that.editedItem.attendee_all
              that.ActionRiskItem.report_as_anonymous = that.editedItem.report_as_anonymous


              that.$nuxt.$loading.start()
              if (that.editedItem.source_of_danger.length -1 == index && riskSourceData==false) {
                that.$store
                  .dispatch('objects/store', that.ActionRiskItem)
                  .then(function (res) {
                    console.log(res)
                    that.reloadList()
                    that.reloadListCategory()
                    that.$toaster.success(
                      that.$i18n.t('message.success_risk_analysis_add_new')
                    )
                  })
                  .catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
                    that.$toaster.error(
                      
                      that.$i18n.t('message.fail_risk_analysis_add_new')
                    )
          }
                    // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
                    that.$nuxt.$loading.finish()
                  })
                that.$nuxt.$loading.finish()
  
                that.close()
              }else if(riskSourceData==true){

                that.$nuxt.$loading.finish()
              }
            } else{
              riskSourceData=true
              that.$toaster.error(that.$i18n.t('message.required_source_data'))
            }
          })
        } else if (that.deviationAction == 2) {
          that.ActionRiskItem.source_of_danger =
            that.editedItem.source_of_danger
          that.ActionRiskItem.source = 'deviation'
          that.ActionRiskItem.type = 'risk-analysis'
          that.ActionRiskItem.action = 'risk'
          that.ActionRiskItem.id = that.editedItem.id
          that.ActionRiskItem.responsible_id = that.editedItem.responsible
          that.ActionRiskItem.is_shared = that.editedItem.is_shared ? 1 : 0
          that.ActionRiskItem.is_public = that.editedItem.is_public ? 1 : 0
          that.ActionRiskItem.added_by = that.editedItem.added_by
          that.ActionRiskItem.name = that.editedItem.subject
          that.ActionRiskItem.description = that.editedItem.description
          that.ActionRiskItem.category_id = that.editedItem.category_id
          that.ActionRiskItem.company_id = that.editedItem.company_id
          that.ActionRiskItem.corrective_action =that.editedItem.corrective_action
          that.ActionRiskItem.department_array = that.editedItem.department_array? that.editedItem.department_array
            : []
          that.ActionRiskItem.employee_array = that.editedItem.employee_array
            ? that.editedItem.employee_array
            : []
          that.ActionRiskItem.happened_before = that.editedItem.happened_before
          that.ActionRiskItem.object_id = that.editedItem.object_id
          that.ActionRiskItem.prososial_action =that.editedItem.prososial_action
          that.ActionRiskItem.specifications = that.editedItem.specifications

          that.ActionRiskItem.responsible_employee_array =that.editedItem.responsible_employee_array
          that.ActionRiskItem.responsible_department_array =that.editedItem.responsible_department_array
          that.ActionRiskItem.nearest_manager =that.editedItem.responsible_employee_array?.length == 0? true: false
          that.ActionTaskItem.attendee_all = that.editedItem.attendee_all
        that.ActionRiskItem.report_as_anonymous = that.editedItem.report_as_anonymous

           that.ActionRiskItem.status = 2
          that.$nuxt.$loading.start()
          that.$store
            .dispatch('objects/store', that.ActionRiskItem)
            .then(function (response) {
              console.log('delagete', response)
              that.reloadList()
              that.reloadListCategory()
              that.$toaster.success(
                that.$i18n.t('message.success_risk_analysis_add_new')
              )
            })
            .catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(
                
                that.$i18n.t('message.fail_risk_analysis_add_new')
              )
          }
              // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
              that.$nuxt.$loading.finish()
            })
          that.$nuxt.$loading.finish()
          that.close()
          // }else{
          //   that.$toaster.error(that.$i18n.t('message.add_required_feild'));
          // }
        } else if (that.deviationAction == 3) {
          if (that.$refs.form.validate()) {
            if (that.editedItem.end_time_pre !== '' &&that.editedItem.start_time_pre !== '') {
              that.ActionTaskItem.action = 'task'
              that.ActionTaskItem.is_shared = that.editedItem.is_shared ? 1 : 0
              that.ActionTaskItem.object_id = that.editedItem.object_id
              // that.ActionTaskItem.source_id = that.editedItem.id
              that.ActionTaskItem.id = that.editedItem.id
              that.ActionTaskItem.responsible_id = that.editedItem.responsible
              that.ActionTaskItem.added_by = that.editedItem.added_by
              that.ActionTaskItem.category_id = that.editedItem.category_id
              that.ActionTaskItem.status = 2
              that.ActionTaskItem.name = that.editedItem.name
              that.ActionTaskItem.happened_before =that.editedItem.happened_before
              that.ActionTaskItem.corrective_action =that.editedItem.corrective_action
              that.ActionTaskItem.specifications =that.editedItem.specifications
              that.ActionTaskItem.is_public = that.editedItem.is_public ? 1 : 0
              that.ActionTaskItem.company_id = that.editedItem.company_id
              that.ActionTaskItem.department_id = that.userDepartmentId
              that.ActionTaskItem.job_title_id = that.editedItem.job_title_id
              that.ActionTaskItem.industry_id = that.editedItem.industry_id
              that.ActionTaskItem.start_date = that.editedItem.start_date_pre
              that.ActionTaskItem.deadline = that.editedItem.deadline_pre
              // that.ActionTaskItem.start_time = new moment(that.editedItem.start_time_pre, "HH:mm").utc().format("HH:mm") == 'Invalid date' ? '' : new moment(that.editedItem.start_time_pre, "HH:mm").utc().format("HH:mm");
              // that.ActionTaskItem.end_time = new moment(that.editedItem.end_time_pre, "HH:mm").utc().format("HH:mm")== 'Invalid date' ? '' : new moment(that.editedItem.end_time_pre, "HH:mm").utc().format("HH:mm");
              that.ActionTaskItem.start_time = await formatTimeString(new moment(that.editedItem.start_time_pre, "HH:mm"))
              that.ActionTaskItem.end_time = await formatTimeString(new moment(that.editedItem.end_time_pre, "HH:mm"))
              that.ActionTaskItem.description = that.editedItem.description
              that.ActionTaskItem.attendee_employee_array =that.editedItem.attendee_employee_array
              that.ActionTaskItem.attendee_department_array =that.editedItem.attendee_department_array
              that.ActionTaskItem.responsible_department_array =that.editedItem.responsible_department_array
              that.ActionTaskItem.responsible_employee_array =that.editedItem.responsible_employee_array
              that.ActionTaskItem.attendee_required_attachment =that.editedItem.attendee_required_attachment
              that.ActionTaskItem.attendee_required_comment =that.editedItem.attendee_required_comment
              that.ActionTaskItem.responsible_required_attachment =that.editedItem.responsible_required_attachment
              that.ActionTaskItem.responsible_required_comment =that.editedItem.responsible_required_comment
              that.ActionTaskItem.isDefaultAttendee =false
              that.ActionTaskItem.attendee_all = that.editedItem.attendee_all
              that.ActionTaskItem.nearest_manager =that.editedItem.responsible_employee_array?.length == 0? true: false
              that.ActionRiskItem.report_as_anonymous = that.editedItem.report_as_anonymous

               that.$nuxt.$loading.start()
              that.$store
                .dispatch('objects/store', that.ActionTaskItem)
                .then(function () {
                  that.reloadList()
                  that.$toaster.success(
                    that.$i18n.t('message.success_task_add_new')
                  )
                })
                .catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
                  that.$toaster.error(that.$i18n.t('message.fail_task_add_new'))
                  }
                  // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
                  that.$nuxt.$loading.finish()
                })
              that.$nuxt.$loading.finish()
              that.close()
            } else {
              that.$toaster.error(that.$i18n.t('message.add_blank_feild'))
            }
          }
        } else {
          that.editedItem.responsible_id = that.editedItem.responsible
          that.editedItem.connectToArray = that.connectToObject;
          that.editedItem.isDefaultResponsible = false
          that.editedItem.responsible_employee_array =
            that.deviationResponseItem.responsible_employee_array
          that.editedItem.responsible_department_array =
            that.deviationResponseItem.responsible_department_array
          if (that.editedItem.action == 'risk' && !that.editSourceOfDanger) {
            that.editedItem.source_of_danger = that.source_of_danger
          }
          if(that.isEdit == true){
            that.editedItem.updateResponsible = true
          }else{
            that.editedItem.updateResponsible = false

          }
          // that.editedItem.start_time = new moment(that.editedItem.start_time_pre, "HH:mm").utc().format("HH:mm");
          // that.editedItem.end_time = new moment(that.editedItem.end_time_pre, "HH:mm").utc().format("HH:mm");
          that.editedItem.status = 3
          that.$nuxt.$loading.start()
          that.$store
            .dispatch('deviations/update', that.editedItem)
            .then(function () {
              that.reloadList()
              that.reloadListCategory()
              that.$toaster.success(
                that.$i18n.t('message.success_deviation_update')
              )
            })
            .catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_deviation_update'))
              }
              // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
              that.$nuxt.$loading.finish()
            })
          that.$nuxt.$loading.finish()
          that.close()
        }
      }
    },
    updateDeviation() {
      this.updateItem = this.editedItem
      this.updateItem.id = this.attendeeObjectID
      this.updateItem.status = 'closed'
      this.updateItem.responsible_id = ''
      this.updateItem.requestEdit = true
      this.updateItem.is_duration=false
      this.updateItem.is_activated=false
      this.updateItem.is_attending_activated=false
      this.updateItem.is_public = false
      this.updateItem.source_id = this.connect_objectID
      this.updateItem.type = 'task'
        this.$store
        .dispatch('objects/update', this.updateItem)
        .then(() => {
          this.$nuxt.$loading.start()
          this.reloadList()
          this.reloadListCategory()
          this.$toaster.success(this.$i18n.t('message.success_task_update'))
          this.$nuxt.$loading.finish()
        })
        .catch((error) => {
          if (error.response.status == 401) {
            this.$router.push('/login')
            this.$toaster.error(this.$i18n.t('message.token_expired'))
          } else {
            console.log(error)
            this.$toaster.error(this.$i18n.t('message.fail_task_update'))
          }
          this.$nuxt.$loading.finish()
        })

        this.docItem = this.editedItem
      this.docItem.id = this.docId
      this.docItem.type = 'deviation'
      this.docItem.status = 3
      this.docItem.task_data = this.infoItem
      this.docItem.source_id = ''
      this.docItem.consequence_for = this.editedItem?.consequence_for?.id
      this.docItem.place = this.editedItem?.place?.id

       this.$store
            .dispatch('deviations/update', this.docItem)
        .then((res) => {
          this.$nuxt.$loading.start()
          this.reloadList()
          this.reloadListCategory()
          if (res.data) {
            this.$toaster.success(
              this.$i18n.t('message.success_deviation_update')
            )
          }
        })
        .catch((error) => {
          if (error.response.status == 401) {
            this.$router.push('/login')
            this.$toaster.error(this.$i18n.t('message.token_expired'))
          } else {
            this.$toaster.error(this.$i18n.t('message.fail_deviation_update'))
          }
          this.$nuxt.$loading.finish()
        })
      this.close()
    },

    respSubmition() {
      this.isResponsibleSubmit = true
      if (
        this.processingItem.required_attachment == 1 ||
        this.processingItem.required_comment == 1
      ) {
        this.isWorkerRoutine = true
      } else {
        if ((this.checkCreator && this.total_rate == 100 && !this.checkResponsible) ||
                (this.checkCreator && this.checkResponsible && this.userRate == 100) && !this.closedStatus) {
          this.updateDeviation()
        } else{
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
                this.$router.push('/login')
                this.$toaster.error(this.$i18n.t('message.token_expired'))
              } else {
                this.$toaster.error(this.$i18n.t('message.server_error'))
              }
              // this.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
              this.$nuxt.$loading.finish()
            })
            this.updateDeviation()
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
          .then(async() => {
            this.$nuxt.$loading.start()
            if(this.editedItem?.attendee?.employee_array == this.editedItem?.responsible?.employee_array && this.roleUser != 'user'){
              await this.statusApprovedAction(this.attendeeArray?.[0]);
              await this.updateDeviation();
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
          this.reloadList()
          this.$toaster.success(this.$i18n.t('message.success_send_request'))
          this.$nuxt.$loading.finish()
        })
        .catch((error) => {
          if (error.response.status == 401) {
            this.$router.push('/login')
            this.$toaster.error(this.$i18n.t('message.token_expired'))
          } else {
            this.$toaster.error(this.$i18n.t('message.fail_send_request'))
          }
          // this.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          this.$nuxt.$loading.finish()
        })
      this.disapprovedModal = false
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
            this.$router.push('/login')
            this.$toaster.error(this.$i18n.t('message.token_expired'))
          } else {
            this.$toaster.error(this.$i18n.t('message.server_error'))
          }
          this.$nuxt.$loading.finish()
        })
    },
    statusDisapprovedAction(item ,requestDeadline) {
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
      this.extendeItem.process_id = item.process_id
      this.extendeItem.status = 'approved'
      this.extendeItem.extended_by_reason = ''
      this.extendeItem.id = item.extended_timeline?.id
      this.$store
        .dispatch(`objects/extend_action`, this.extendeItem)
        .then(() => {
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
      this.extendeItem.id = newItem.item.extended_timeline?.id
      this.$store
        .dispatch(`objects/extend_action`, this.extendeItem)
        .then(() => {
          this.$nuxt.$loading.start()
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
          this.updateDeviation()
          this.close()
      }
      this.feedbackItem.comment = ''

      this.close()
    },

    // async getObject(item) {
    //   this.connectToObject = []
    //   await api.deviations
    //     .connect(item.id)
    //     .then((result) => {
    //       let respo = result.data.data
    //       // if (respo.length>0) {
    //       //   respo.forEach(el => {
    //       //     this.connectToObject.push({
    //       //         id:el.id,
    //       //         name:el.objectName,
    //       //         source:el.connect_to_source,
    //       //         category:el.categoryName,
    //       //         added:el.addedByUser,
    //       //         connectedBy:el.connectedByUser,
    //       //         connected_date:el.created_at,
    //       //   })
    //       // });
    //       // } else {
    //       //   this.connectToObject=[]
    //       // }
    //     })
    //     .catch((error) => {
    //       console.log(error)
    //     })
    // },
    getImageSrc(url) {
      let that = this
      let result
      axios({
        url: url,
        method: 'GET',
        responseType: 'blob', // important
      }).then((response) => {
        result = window.URL.createObjectURL(new Blob([response.data]))
        that.previewUrl = result
        that.$nuxt.$loading.finish()
        return result
      })
    },
    openInfo(value) {
      if (value == true) {
        this.openEmployeeTable = true
      } else {
        this.openEmployeeTable = false
      }
    },
    sendRequest() {
      this.editDeadlineTime = true
      this.disapprovedModal = true
      this.disApprovedTitle = 'Extend Deadline Request'
    },

    viewItem(item) {
        let that = this;
        that.$store
          .dispatch('objects/show', item.id)
          .then(async (result) => {
            if(result?.data?.status == 'closed'){
              this.checkAsAttendee=false;
            }
            if(result?.data?.attendee?.employee_array == result?.data?.responsible?.employee_array && this.roleUser != 'user' && result?.data?.status != 'closed'){
              this.checkAsAttendee=true;
            }
            await that.$store
              .dispatch('deviations/show', result.data.source_id)
              .then((res) => {
                that.editedItem = res.data;
                that.editedItem.type = result.data.type
                that.editedItem.category_name = result.data.categoryName
              }).catch(err => console.log(err, 'deviation show error'));


              
          }).catch((error) => {
            console.log(error)
          })
    },

    editItem(item) {
      let that = this
      that.connected_to_task = []
      that.formDirty = false
      // that.getObject(item)
      that.editedItem.action = 'none'
      if (this.deviationItem.happened_before == 1) {
        this.deviationItem.is_happened_before = true
      }
      if (this.deviationItem.corrective_action !== null) {
        this.deviationItem.is_corrective = true
      }

      if (this.deviationItem.specifications !== null) {
        this.deviationItem.is_legalSpecifications = true
      }
      that.$nuxt.$loading.start()
      // item.risk_analysis = that.risk_analysis.length>0 ? that.risk_analysis : ''
      that.editedItem = Object.assign({}, item)
      that.dev_status = item?.status
      that.$store
        .dispatch('deviations/show', item.id)
        .then((res) => {
          // console.log(res);
          // that.getObject(item)
            
          // console.log("resposne dev",res.data);
          // if (res?.data?.status == 'closed') {
          //   that.editedItem = Object.assign({}, res?.data)
          // }
          // that.dev_status = res?.data?.status
          that.docId = that.editedItem.id
          that.tasks = res.data?.task_data != null ? true : false
          that.editedItem.object_id = res.data?.task_data?.id || res.data?.object?.id
          that.connect_objectID = res.data?.risk_analysis?.id || res.data?.object?.id

          // if (that.editedItem?.object_id) {
            that.$store
            .dispatch('objects/show', that.editedItem.object_id)
            .then((result) => {

              if(result?.data?.status == 'closed'){
                this.checkAsAttendee=false;
              }
              if(result?.data?.attendee?.employee_array == result?.data?.responsible?.employee_array && this.roleUser != 'user' && result?.data?.status != 'closed'){
                this.checkAsAttendee=true;
              }
              that.attendeeObjectID = that.editedItem?.object_id
              if (that.checkWorker == false) {
                that.$store
                  .dispatch(`objects/getAttendeeData`, that.editedItem.object_id)
                  .then((attendeeRes) => {
                    // that.$nuxt.$loading.start()
                    that.attendeeArray = attendeeRes.attendee
                    const newAttendees = that?.attendeeArray?.filter((attendee) => attendee?.status === 'new');
                const attendeeIds = newAttendees?.map((attendee) => attendee?.attendee_id);
                that.allEmployee = attendeeIds?.join(',');
                    let history_of_attendee = []
                    _.each(attendeeRes.attendee, function (history) {
                      if (Object.keys(history.attendee_history)?.length > 0) {
                        history_of_attendee.push(history.attendee_history)
                      }
                    })
                    that.attendeeHistory = history_of_attendee
                    that.$nuxt.$loading.finish()
                  })
              }

               if (result.data?.responsible?.employeeRole?.includes(that.userID)) {
              that.checkResponsible=true
            } else {
              that.checkResponsible=false
            }

              let respo = result.data
              this.infoItem = Object.assign({}, respo)
              that.processingItem = that.infoItem?.my_processing
              // if (this.checkWorker && that.processingItem?.status) {
              //   that.dev_status = that.processingItem?.status
              // }
              this.arrayItem = [result.data]

              this.closedStatus = result.data.status == "closed" ? true : false

          if (that.processingItem?.status && that.checkWorker) {
            that.editedItem.status = that.processingItem?.status
            if (
              that.editedItem.status === 'approved' ||
              that.editedItem.status === 'completed' ||
              that.editedItem.status === 'request' ||
              that.editedItem.status === 'approved_overdue' ||
              that.editedItem.status === 'completed_overdue' ||
              that.editedItem.status === 'Reassigned' ||
              that.editedItem.status === 'Removed'|| that.editedItem.status === 'disapproved_overdue' || that.editedItem?.status === 'overdue'
            ) {
              that.checkResubmit = false
              that.hideExtendTimeline = true
            } else if (
              that.editedItem.status === 'disapproved_with_extended' || that.editedItem?.status === 'disapproved'
            ) {
              that.checkResubmit = true
              that.hideExtendTimeline = true
            } else if (that.editedItem.status === 'timeline_disapproved') {
              that.checkResubmit = false
              that.declineRequest = true
              that.hideExtendTimeline = true
            } else {
              that.checkResubmit = false
              that.hideExtendTimeline = false
            }
          }
          that.userRate = that.infoItem.rate.toFixed()
          that.total_rate = that.infoItem.total_rate.toFixed()

          const responseDateStr = respo.start_date

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

          const responseTimeStr = respo.start_time;
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

          that.feedbackItem.object_id = that.infoItem.id
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
              that.processingItem?.status === 'ongoing' || that.processingItem?.status === 'disapproved_overdue' || that.processingItem?.status === 'timeline_disapproved' || that.processingItem?.status === 'overdue')
          ) {
            that.checkAttendee = true
            that.hideDone = false
          } else {
            that.checkAttendee = false
            that.hideDone = true
          }

          if (that.processingItem?.attendee_id == that.userID && that.processingItem.status !== 'completed' && that.processingItem.status != null) {
            that.doneResponse = true
          } else {
            that.doneResponse = false
          }
          if (that.infoItem.added_by == that.userID) {
            that.checkCreator = true
          } else {
            that.checkCreator = false
          }
          if (
            (that.checkResponsible && that.checkCreator) ||
            (that.checkResponsible && !that.checkCreator) ||
            (!that.checkResponsible && !that.checkCreator)
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
          } else if (that.checkCreator && !that.checkResponsible) {
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

              if (item.action == 'task') {
                if (res.data?.sourceOfDanger == null) {
                  that.editedItem.source_of_danger = []
                  that.taskArray = [res.data?.task_data]
                  that.taskDetailData = res.data?.task_data
                } else {
                  that.taskArray = [res.data?.task_data]
                  that.taskDetailData = res.data?.task_data
                  that.editedItem.source_of_danger = res.data?.risk_analysis?.source_of_danger
                  that.source_of_danger = that.editedItem.source_of_danger
                }
              }
              if (item.action == 'risk' || item.action == 'risk_analysis') {
                if (res.data?.task_data == null) {
                  that.taskArray = []
                  that.editedItem.source_of_danger = res.data?.risk_analysis?.source_of_danger
                  that.source_of_danger = that.editedItem.source_of_danger
                } else {
                  that.taskArray = [res.data?.task_data]
                  that.taskDetailData = res.data?.task_data
                  that.editedItem.source_of_danger = res.data?.risk_analysis?.source_of_danger
                  that.source_of_danger = that.editedItem.source_of_danger
                }
              }
              that.$nuxt.$loading.finish()
              that.deviationResponseItem = Object.assign({}, res.data)
              that.editedItem.source_of_danger = [
                {
                  name: item.subject,
                  type: 'Report',
                  probability: '',
                  consequence: '',
                  colorCode: '',
                  comment: '',
                  risk_level: '',
                  need_to_process: false,
                },
              ]
              that.editedItem.source_of_danger[0].name = item.subject
              // that.editedItem.object_id=res.data.object.id
              if (item.happened_before !== null) {
                that.editedItem.is_happened_before = item.happened_before
              }
              if (item.corrective_action !== null) {
                that.editedItem.is_corrective = item.corrective_action
              }
              if (item.specifications !== null) {
                that.editedItem.is_legalSpecifications = item.specifications
              }
              that.responsibleName = item.responsible_names
              that.taskResponsibleName =
                res.data.task_data?.responsible?.employeeName
              that.editedItem.type_of_attachment = item.type_of_attachment
              // if (item.attachment) {
              //   that.getImageSrc(item.attachment.url);
              // }
            })
          // }

        })
        .catch((error) => {
          console.log(error)
        })
      // }
        that.$nuxt.$loading.finish();
    },
    reloadEmployee() {
      this.reloadList()
      // this.$nuxt.$loading.start()
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
          this.editItem(this.deviationItem)
          this.$nuxt.$loading.finish()
        })
      this.$nuxt.$loading.finish()
    },
    close() {
      this.isEdit = false
      this.openEmployeeTable = false
      if (this.openPopup) {
        this.$emit('closePopup')
      }
    },
  },
}
</script>
  
<style scoped>
.document-attachment {
  width: 25px;
  height: 25px;
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
.action-title {
  position: relative;
}
.action-badge {
  position: absolute;
  top: 15px;
  left: 75px;
}
:deep(.manage-task .table-task tbody) {
  word-break: break-all;
}
:deep(.review-table .v-data-table__wrapper) {
  padding-top: 0;
}
:deep(.index-badge .v-badge) {
  left: -42px;
  top: -6px;
}
.review-deviation {
  width: 1060px;
}
:deep(.action .v-text-field__details) {
  display: none !important;
}
:deep(.header-task tbody tr td .v-text-field__slot input) {
  text-align: center;
}
.info-icon-gray {
  width: 15px;
  height: 15px;
  background-color: #666768;
  margin-left: 10px;
  border-radius: 100%;
  font-size: 10px;
  line-height: 25px;
  color: #fff;
  /* position: absolute;
  top: 10px;
  right: 10px; */
}
</style>
  

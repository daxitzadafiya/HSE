<template>
  <div>
    <v-dialog v-model="openPopup" scrollable max-width="1125px" persistent>
      <v-card>
        <v-card-title class="text-h5 justify-content-center text-uppercase">
          {{ isEdit ? $t('title.edit_document') : $t('title.view_report_doc') }}
        </v-card-title>
        <v-card-text>
          <div class="review-popup">
            <!-- Attendee -->

            <!-- <div class="reminder-history " v-if="editedItem.routine_id || editedItem.task_id">
                <img
                  class="reminder-img ms-auto d-flex justify-content-end mb-4"
                  src="../assets/images/icon/reminder-history.png"
                  alt="file.png"
                />
              </div> -->
            <!-- <div
              class="review-popup-table expandable-table"
            >
              <v-data-table
                v-if="editedItem.is_reminder === 1"
                :headers="computedHeaders"
                :items="connected_to_task"
                class="elevation-1 review-table"
                :items-per-page="15"
                :single-expand="true"
                :sort-by="['created_at']"
                :sort-desc="[true, false]"
                hide-default-footer
                :expanded.sync="expanded"
              >
                <template v-slot:top>
                  <v-toolbar flat>
                    <v-toolbar-title>
                      {{ $t('form.connected_to_task') }}
                    </v-toolbar-title>
                  </v-toolbar>
                </template>
                <template v-slot:item.deadline="{ item }">
                  {{ `${ moment(item.start_date).format('DD.MM.YYYY') }- ${moment(item.deadline).format('DD.MM.YYYY')}` }}
                </template>
                <template v-slot:item.status="{ item }">
                  <v-chip
                    v-if="item.status === 'New' || item.status === 'closed'"
                    class="ma-2 status-label-custom not-done"
                    label
                  >
                    {{ $t('form.new') }}
                  </v-chip>
                  <v-progress-linear
                    v-if="item.rate >= 0"
                    height="25"
                    :color="item.rate === 0 ? 'rgb(231,134,134)' : item.rate === 100 ? 'rgb(153,213,128)' : 'rgb(255,214,101)'"
                    :value="item.rate"
                  >
                    <strong class="font-weight-bold" style="color: #141b04">{{ Math.ceil(item.rate) }}%</strong>
                  </v-progress-linear>
                </template>
                  <template v-slot:item.date="{ item }">
                  {{ moment(item.date).format('DD.MM.YYYY') }}
                </template>
                <template v-slot:item.totalattendees="{ item }">
                  <span role="button" @click="TotalAttendee(item)"> {{ item.totalattendees }}</span>
                </template>
                <template v-if=isTotalAttendee v-slot:expanded-item="{ headers, item }">
                  <td :colspan="6" class="py-4 px-8">
                    <v-card class="pt-0 expand-pedding">
            <v-data-table
                :headers="expandTableHeaders"
                :items="taskItem.processingInfo"
                class="elevation-1 review-table"
                :items-per-page="15"
                :single-expand="true"
                :sort-by="['created_at']"
                :sort-desc="[true, false]"
                hide-default-footer
              >
              <template v-slot:item.employeeName="{ item }">
                <span v-for="(item, index) in totalEmployeeName"
                    :key="index">{{ item }}</span>
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
                    v-if="item.status === 'done' || item.status === 'closed'"
                    class="ma-2 status-label-custom done"
                    label
                  >
                    {{ $t('form.done') }}
                  </v-chip>
                  <v-chip
                    v-else
                    class="ma-2 status-label-custom not-done"
                    label
                  >
                    {{ $t('form.not_done') }}
                  </v-chip>
                </template>
                <template v-slot:item.actions="{ item }">
                  <div v-if="item.status === 'verify'">
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
                  <div v-else-if="item.status === 'done'">
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
                    </v-card>
                  </td>
                </template>
                <template v-slot:no-data>
                  {{ $t('table.no_data') }}
                </template>
              </v-data-table>

            </div> -->
            <div class="review-popup-table normal-table">
              <!-- Type -->

              <div class="info-block w-50">
                <div class="label-item">{{ $t('form.type') }} :</div>
                <div
                  v-if="editedItem.type_of_attachment == 2"
                  class="info-item d-flex align-center"
                >
                  Note
                  <img
                    src="~assets/images/document-note.svg"
                    alt=""
                    class="ml-2"
                  />
                </div>
                <div v-else class="info-item d-flex align-center">
                  Attachment
                  <img
                    src="~assets/images/attachment.png"
                    alt=""
                    class="ml-2 document-attachment"
                    @click="showImage(imageData)"
                  />
                </div>
              </div>

              <!-- Source -->
              <div class="info-block w-50">
                <div class="label-item">{{ $t('form.function') }} :</div>
                <div class="info-item">
                  {{
                    editedItem.task_id && editedItem.routine_id == null
                      ? 'Document > Task'
                      : editedItem.routine_id && editedItem.task_id
                      ? 'Document > Routine'
                      : 'Document'
                  }}
                </div>
              </div>

              <!-- Name -->
              <div class="info-block w-50 align-center">
                <div class="label-item">{{ $t('form.name') }}:</div>
                <div
                  v-if="!isEdit"
                  class="info-item"
                  @click="(checkAdmin || checkCreator || checkSuperAdmin) && !checkEdit   ? (isEdit = !isEdit) : (isEdit = false)"
                >
                  {{ editedItem.name }}
                </div>
                <div v-else class="input-wrap w-100 align-center">
                  <v-text-field
                    v-model="editedItem.name"
                    :rules="required"
                    outlined
                  />
                </div>
              </div>

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
                    {{ editedItem.category_name || editedItem.categoryName }}
                  </div>
                </div>
              </div>
              <div
                v-else
                class="input-wrap info-block w-50 p-3 d-flex align-center"
              >
                <div class="label-item col-3 p-0 mr-n6">
                  {{ $t('form.category') }} :
                </div>
                <category
                  :object-item="editedItem"
                  :type-category="'document'"
                  @getNewCategory="getNewCategory"
                  class="category-item"
                />
              </div>

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
                  {{ editedItem.description }}
                </div>
                <div v-else class="input-wrap form-description">
                  <FroalaSuggestionListEditor
                    :item="editedItem"
                    :predefined-link-array="predefinedLinkArray"
                  />
                </div>
              </div>

              <!-- Added by -->
              <div v-if="!checkSuperAdmin" class="info-block w-100">
                <div class="label-item">
                  {{
                    checkResponsible || checkWorker
                      ? $t('form.date')
                      : $t('form.added_on')
                  }}
                  :
                </div>
                <div class="info-item">
                  {{ moment(editedItem.created_at).format('DD-MM-YYYY') }}
                </div>
              </div>
              <!-- Require comment -->
              <!-- <div v-if="!checkSuperAdmin" class="info-block">
                <div class="label-item">
                  {{ $t('form.required') }} :
                </div>
                <div class="info-item"></div>
              </div> -->
              <!-- Start date -->
              <!-- <div
                v-if="!isEdit"
                cols="6"
                class="info-block w-50"
                @click="
                  checkAdmin || checkCreator
                    ? (isEdit = !isEdit)
                    : (isEdit = false)
                "
              >
                <div class="label-item">
                  {{ $t('form.start_date') }} :
                </div>
                <div class="info-item" v-if="(editedItem.is_reminder==1)">{{ moment(editedItem.start_date).format('DD.MM.YYYY') }}</div>
                <div class="info-item" @click.stop v-else >Not Applicable</div>
              </div> -->
              <!-- <div v-else cols="6" class="info-block w-50 align-center">
                <div class="label-item">
                  {{ $t('form.start_date') }} :
                </div>

                <DatePickerNew
                  v-if="( editedItem.is_reminder==1)"
                  :item="editedItem"
                  :date-input="editedItem.start_date"
                  :use-keyboard="true"
                  :past-date="false"
                  :future-date="true"
                  :default-today="true"
                  :disable="!checkAdmin && !checkCreator"
                  :dateEdit="true"
                />
                <div v-else class="info-item" @click.stop>Not Applicable</div>
              </div> -->

              <!-- Due date -->
              <!-- <div
                class="info-block w-50"
                v-if="!isEdit"
                @click="
                  checkAdmin || checkCreator
                    ? (isEdit = !isEdit)
                    : (isEdit = false)
                "
              >
                <div class="label-item">
                  {{ $t('form.due_date') }} :
                </div>
                <div class="info-item" v-if="(editedItem.is_reminder==1)">{{moment(editedItem.deadline).format('DD.MM.YYYY')}}</div>
                <div class="info-item" v-else @click.stop>Not Applicable</div>
              </div>
              <div v-if="isEdit" class="info-block w-50 align-center">
                <div class="label-item">
                  {{ $t('form.due_date') }} :
                </div>
                <DatePickerNew
                  v-if="( editedItem.is_reminder==1)"
                  :item="editedItem"
                  :date-input="editedItem.deadline"
                  :past-date="false"
                  :future-date="true"
                  :is-deadline="true"
                  :disable="!checkAdmin && !checkCreator"
                  :dateEdit="true"
                />
                <div v-else class="info-item" @click.stop>Not Applicable</div>
              </div> -->
            </div>
            <!-- Connected To -->
              <v-data-table 
                      v-if="roleUser != 'manager' || connectToObject.length > 0"
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
                                      checkAdmin || checkCreator
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
            
        <GoalReviewPopup 
                v-if="objectItem.type == 'goal'"
                :open-popup="isObjectOpen" 
                :object-item="objectItem"
                @closePopup="isObjectOpen = !isObjectOpen"
                :view-popup="isOnlyView"
        ></GoalReviewPopup>

        <TaskReviewPopup 
                v-if="objectItem.type == 'task'"
                :open-popup="isObjectOpen"
                :object-item="objectItem"
                @closePopup="isObjectOpen = !isObjectOpen" 
                :view-popup="isOnlyView"
        ></TaskReviewPopup>

        <ReviewRoutinePopup 
                v-if="objectItem.type == 'routine'"
                :open-popup="isObjectOpen"
                :document-item="objectItem"
                @closePopup="isObjectOpen = !isObjectOpen"
                :view-popup="isOnlyView"
        ></ReviewRoutinePopup>

        <InstructionReviewPopup 
                v-if="objectItem.type == 'instruction'"
                :open-popup="isObjectOpen"
                :object-item="objectItem"
                @closePopup="isObjectOpen = !isObjectOpen"
                :view-popup="isOnlyView"
        ></InstructionReviewPopup>

        <RiskAnalysisReviewPopup 
                v-if="objectItem.type == 'risk'"
                :open-popup="isObjectOpen"
                :object-item="objectItem"
                @closePopup="isObjectOpen = !isObjectOpen"
                :view-popup="isOnlyView"
        ></RiskAnalysisReviewPopup>

        <EditChecklistPopup 
                v-if="objectItem.type == 'checklist'"
                :open-popup="isObjectOpen"
                :document-item="objectItem"
                @closePopup="isObjectOpen = !isObjectOpen" 
                :view-popup="isOnlyView"
        ></EditChecklistPopup>

        <ReviewDeviation 
                v-if="objectItem.type == 'deviation'"
                :open-popup="isObjectOpen"
                :object-item="objectItem"
                @closePopup="isObjectOpen = !isObjectOpen"
                :view-popup="isOnlyView"
        ></ReviewDeviation>
        
            <connect-to-object-modal
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
            ></connect-to-object-modal>
            <!-- <AddTable
              v-if="editedItem.task_id "
              :titleMessage="$t('form.task')"
              :addTopic="false"
              :topicArray="taskArray"
              :headers="taskHeader"
              :addCommentAttach="false"
              :isReminder="false"
              @onTaskInfo="onAction"
              class="task-table"
              /> -->

            <!-- <v-data-table
              v-if="editedItem.task_id"
              :headers="taskHeader"
              :items="taskArray"
              class="elevation-1 review-table review-popup-table task-table"
              :items-per-page="15"
              :single-expand="true"
              :sort-by="['created_at']"
              :sort-desc="[true, false]"
              hide-default-footer
              @click:row="onAction"
            >
              <template slot="top">
                <v-toolbar flat>
                  <v-toolbar-title>
                    {{ $t('form.task') }}
                  </v-toolbar-title>
                </v-toolbar>
              </template>
              <template v-slot:item.name="{item}">
                <span class="ml-4">
                  {{item.name}}
                </span>
              </template>
              <template v-slot:item.totalAttendees="{item}">
                <span class="ml-4">
                  {{item.totalAttendee}}
                </span>
              </template>
              <template  v-slot:header.actions="{ header }">
              </template>
            </v-data-table> -->

            <folding-info-table
              v-if="!checkResource && (editedItem.task_id || editedItem.routine_id)"
              :infoItem="infoItem"
              :arrayItem="arrayItem"
              :docItem="editedItem"
              :processingItem="processingItem"
              :openEmployeeTable="openEmployeeTable"
              :routineTaskFeild="routineTaskFeild"
              :checkEdit="checkEdit"
              :durationData="durationData"
              :category_type="'document'"
              @saveInfo="editItem"
              @openInfo="openInfo"
              @sendRequest="sendRequest"
            />
            <ChangeEmployeeTable
              v-if="!checkWorker && !isEdit && openEmployeeTable && routineTaskFeild"
              :AttendeeHeaders="AttendeeHeaders"
              :isReminder="true"
              :attendeeArray="attendeeArray"
              :attendeeHistoryData="attendeeHistory"
              :attendeeObjectID="attendeeObjectID"
              :checkResponsiblePersone="checkResponsible"
              :isReminderHistory="isReminderHistory"
              :showExpand="showExpand"
              :allEmployee="allEmployee"
              :checkRoutine="checkRoutine"
              @is_reminder_history="is_reminder_history"
              @reloadEmployee="reloadEmployee"
              @statusApprovedAction="statusApprovedAction"
              @statusDisapprovedAction="statusDisapprovedAction"
              @approvedReqestDate="approvedReqestDate"
              @declineReqestDate="declineReqestDate"
            />

            <div
              v-if="!isEdit && !routineTaskFeild && openEmployeeTable && !resource 
              &&(checkAdmin || checkCreator || checkResponsible) &&attendeeArray.length > 0
              "
              class="table-expand-show-attendee review-table p-3 mt-4"
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

            <!-- <responsible-attendee-action v-if="onAttendeeAction"
            :editedItem="taskItem"
            :titleMessage="$t('title.attendees')"
              :addTopic="true"
              :topicArray="attendeeArray"
              :selectedItem="selectedEmployeeItem"
              :headers="responsibleAttendeeHeader"
              :checkShowItem="checkShowItem"
              :addCommentAttach="false"
              :isReminder="true"
              :editedNewItem="editedNewItem"
              @saveEmployee="saveEmployee"
              @employeeItem="employeeItem"
              :isEmpStatus="isEmployeeStatus"
              :isRemove="isEmployeeRemove"
              @updateEmployee="updateEmployee"
            /> -->
            <!-- <AddTable
              v-if="editedItem.routine_id"
              :titleMessage="$t('title.routine')"
              :addTopic="false"
              :topicArray="connected_to_task"
              :headers="routineHeaders"
              :addCommentAttach="false"
              @onTaskInfo="RoutineReminder"
            /> -->
            <!-- Attendee -->
            <!-- <v-data-table
              :headers="isAttendHeaders"
              :items="AttendeeData"
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
                    {{ $t('form.attendee') }}
                  </v-toolbar-title>
                  <div role="button"
                    :class="
                      isEdit
                        ? 'plus-icon text-center'
                        : 'plus-icon-gray text-center d-flex align-center justify-center'
                    "
                  >
                    +
                  </div>
                </v-toolbar>
              </template>
              <template v-slot:item.status="{ item }">
                <v-chip
                  v-if="item.status === 1"
                  class="ma-2 status-label-custom done"
                  label
                >
                  Done
                </v-chip>
                <v-chip v-else class="ma-2 status-label-custom not-done" label>
                  Not Done
                </v-chip>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="viewAttendee()">
                  mdi-eye
                </v-icon>
                <v-icon small class="mr-2 edit-icon" @click="editAttendee()">
                  fa-edit
                </v-icon>
                <v-icon small @click="deleteAttendee(item)"> mdi-delete </v-icon>
              </template>
            </v-data-table> -->

            <!-- <routine-reminder-info
              v-if="onRoutineReminder && editedItem.routine_id"
              :editedItem="editedItem"
              :titleMessage="$t('title.attendees')"
              :addTopic="true"
              :topicArray="EmployeesArray"
              :headers="ReminderAttendeeHeaders"
              :addCommentAttach="false"
              :isReminder="true"
            /> -->
          </div>
        </v-card-text>
        <v-card-actions class="py-9 pr-9">
          <v-spacer />
          <v-btn class="btn-cancel" text @click="close">
            {{ $t('button.cancel') }}
          </v-btn>
          <v-btn
            v-if="!isEdit && checkResource && !checkSuperAdmin"
            class="btn-save"
            @click="applyTemplate"
            :disabled="!!planAccess?.lastPlanAccess?.document">
            {{ $t('button.apply') }}
          </v-btn>
          <v-btn
            v-if="isEdit && (checkAdmin || checkCreator || checkSuperAdmin)"
            class="btn-save"
            @click="save"
            :disabled="!!planAccess?.lastPlanAccess?.document">
            {{ $t('button.done') }}
          </v-btn>
          <v-btn
            v-if="checkResponsible && !isEdit && userRate == 100 &&doneResponse && !checkCreator"
            class="btn-save"
            @click="respSubmition"
            :disabled="!!planAccess?.lastPlanAccess?.document">
            {{ $t('button.done') }}
          </v-btn>
          <v-btn
            v-if="
              ((checkCreator && total_rate == 100 && !checkResponsible) ||
                (checkCreator && checkResponsible && userRate == 100)) &&
              !closedStatus
            "
            class="btn-save"
            @click="updateDocument"
            :disabled="!!planAccess?.lastPlanAccess?.document">
            {{ $t('form.verify') }}
          </v-btn>
          <v-btn
            v-if="!hideDone && checkAttendee && routineTaskFeild && (checkWorker || checkAsAttendee) && checkEdit"
            class="btn-save"
            @click="submitContent"
            :disabled="!!planAccess?.lastPlanAccess?.document">
            {{ $t('button.done') }}
          </v-btn>
          <v-btn
            v-if="checkResubmit && checkWorker && routineTaskFeild"
            class="btn-save"
            @click="submitContent"
            :disabled="!!planAccess?.lastPlanAccess?.document">
            {{ $t('button.resubmit') }}
          </v-btn>
          <v-btn
            v-if="!isEdit && (checkAdmin || checkCreator) && attendeeObjectID == null "
            class="border delete-btn"
            @click="dialogDelete = true"
          >
            <v-icon> mdi-delete </v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Attendee dialog confirm delete -->
    <v-dialog v-model="AttendeeDelete" max-width="500px">
      <v-card class="dialog-delete">
        <v-card-text>
          <div class="text-center confirm-delete-title">
            {{ $t('title.confirm_delete') }}
          </div>
          <div class="confirm-delete-text">
            <!-- {{ $t('message.delete_confirm') }} -->
            Are you sure you want to delete this Attendee?
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="btn-cancel" text @click="AttendeeDelete = false">
            {{ $t('button.no') }}
          </v-btn>
          <v-btn class="btn-save" @click="AttendeeDelete = false">
            {{ $t('button.yes') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogConfirmClose" max-width="500px">
      <v-card class="dialog-delete">
        <v-card-text>
          <div class="text-center confirm-delete-title">
            {{ $t('title.confirm_modal') }}
          </div>
          <div class="confirm-delete-text">
            {{ $t('message.do_you_want_to_cancel_without_saving') }}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="btn-cancel" text @click="close">
            {{ $t('button.yes') }}
          </v-btn>
          <v-btn class="btn-cancel" text @click="dialogConfirmClose = false">
            {{ $t('button.no') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogRelatedObjects" max-width="700px">
      <v-card class="dialog-delete">
        <v-card-text>
          <div class="text-center confirm-delete-title">Associated objects</div>
          <div
            v-if="editedItem.parent_object"
            :class="editedItem.count_related_object > 0 ? 'mb-7' : ''"
          >
            <div class="title-manage-task">APPLIED FROM</div>
            <v-list-item class="p-0" two-line>
              <v-list-item-content>
                <v-list-item-title>{{
                  editedItem.parent_object.name
                }}</v-list-item-title>
                <v-list-item-subtitle>
                  <span class="mr-3"
                    >ID: {{ editedItem.parent_object.id }}</span
                  >
                  <span class="mr-3"
                    >Added by:
                    {{ editedItem.parent_object.added_by_first_name }}
                    {{ editedItem.parent_object.added_by_last_name }}</span
                  >
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </div>
          <div v-if="editedItem.count_related_object > 0">
            <div class="title-manage-task">RELEVANT DOCUMENTS</div>
            <v-list-item
              class="p-0"
              v-for="(item, index) in editedItem.related_objects"
              :key="index"
              two-line
            >
              <v-list-item-content>
                <v-list-item-title>{{ item.name }}</v-list-item-title>
                <v-list-item-subtitle>
                  <span class="mr-3">ID: {{ item.id }}</span>
                  <span class="mr-3"
                    >Added by: {{ item.added_by_first_name }}
                    {{ item.added_by_last_name }}</span
                  >
                  <span v-if="checkSuperAdmin"
                    >Company: {{ item.company_name }}</span
                  >
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="btn-cancel" text @click="dialogRelatedObjects = false">
            CLOSE
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <RequiredCommentPopup
      :open-popup="isRequiredComment"
      :object-item="editedRequiredCommentItem"
      @closePopup="isRequiredComment = !isRequiredComment"
      @updateRequiredComment="updateRequiredComment"
    />
    <DeleteConfirmPopup
      :open-popup="dialogDelete"
      :object-index="docId ? docId : 0"
      @closePopup="dialogDelete = !dialogDelete"
      @deleteItem="deleteItem"
    />
    <image-popup
      :open-popup="checkImage"
      @closePopup="checkImage = !checkImage"
      :addImage="addImage"
    />
    <reason-popup
      :open-popup="checkNew"
      @closePopup="checkNew = !checkNew"
      :titleMessage="$t('form.reason')"
      :addDescription="addDescription"
    />
    <dis-approved-popup
      :open-popup="disapprovedModal"
      :isDisapproved="isDisapproved"
      :objectItem="processingItem"
      :title-message="disApprovedTitle"
      :attendeeObjectID="attendeeObjectID"
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
    <DocumentPopup
      :open-popup="openDocument"
      :documentItem="editedItem"
      :resource="false"
      :categories-array="categoriesArray"
      :category-type="categoryType"
      :type="'document'"
      :added-from="addedFrom"
      :predefined-link-array="predefinedLinkArray"
      @closePopup="openDocument = !openDocument"
      @reloadList="reloadList"
      @resourceList="resourceList"
      @reloadListCategory="reloadListCategory"
      @changeTab="changeTab"
    />
  </div>
</template>

<script>
import { _ } from 'vue-underscore'
import cookies from 'js-cookie'
import FroalaSuggestionListEditor from './FroalaSuggestionListEditor'
import CategoryInReviewPopup from './CategoryInReviewPopup'
import DeleteConfirmPopup from './DeleteConfirmPopup'
import ConnectToObjectModal from './ConnectToObjectModal.vue'
// import AddTable from './AddTable'
// import DatePickerNew from './DatePickerNew.vue';
// import ResponsibleEditInReviewPopup from "./ResponsibleEditInReviewPopup";
import RequiredCommentPopup from './RequiredCommentPopup'
// import ResponsibleAttendeeAction from './ResponsibleAttendeeAction.vue'
import api from '~/apis'
// import RoutineReminderInfo from './RoutineReminderInfo.vue'
import ImagePopup from './ImagePopup.vue'
import DocumentPopup from '@/components/DocumentPopup'
import FoldingInfoTable from './FoldingInfoTable'
import ChangeEmployeeTable from './ChangeEmployeeTable.vue'
import DisApprovedPopup from './DisApprovedPopup.vue'
import FeedbackPopup from './FeedbackPopup.vue'
import moment from 'moment'
import { removeTagsFromString ,formatTimeString } from "./common/js/functions"
import ReasonPopup from './ReasonPopup.vue';
import GoalReviewPopup from "./GoalReviewPopup";
import TaskReviewPopup from "./TaskReviewPopup";
import ReviewRoutinePopup from "./ReviewRoutinePopup";
import InstructionReviewPopup from "./InstructionReviewPopup";
import RiskAnalysisReviewPopup from "./RiskAnalysisReviewPopup";
import ReviewDeviation from "./ReviewDeviation";
import EditChecklistPopup from "./EditChecklistPopup";

export default {
  name: 'ReviewDocumentPopup',
  components: {
    category: CategoryInReviewPopup,
    DeleteConfirmPopup,
    // AddTable,
    // ResponsibleAttendeeAction,
    // DatePickerNew,
    // ResponsibleEdit: ResponsibleEditInReviewPopup,
    ConnectToObjectModal,
    FroalaSuggestionListEditor,
    RequiredCommentPopup,
    // RoutineReminderInfo,
    ImagePopup,
    DocumentPopup,
    FoldingInfoTable,
    ChangeEmployeeTable,
    DisApprovedPopup,
    FeedbackPopup,
    ReasonPopup,
  GoalReviewPopup,
  TaskReviewPopup,
  ReviewRoutinePopup,
  InstructionReviewPopup,
  RiskAnalysisReviewPopup,
  ReviewDeviation,
  EditChecklistPopup,
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
    openPopup: Boolean,
    industryArray: {
      type: Array,
      required: false,
    },
    categoriesArray: Array,
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
    predefinedLinkArray: {
      type: Array,
      required: false,
    },
    viewOnly:{
      type: Boolean,
      required: false,
    }
  },
  data: () => ({
    isObjectOpen : false,
    isOnlyView : false,
    objectItem : {},
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
    onRoutineReminder: false,
    checkImage: false,
    valid: true,
    isEdit: false,
    is_connect: false,
    AttendeeDelete: false,
    isTotalAttendee: false,
    checkCreator: false,
    checkResponsible: false,
    checkAttendee: false,
    isRequiredComment: false,
    checkWorker: false,
    onAttendeeAction: false,
    documents: [],
    connected_to_task: [],
    connectToObject: [],
    responsibleName: [],
    connectToObjectTableProp: [],
    object: [],
    category: [],
    totalEmployeeName: [],
    editedRequiredCommentItem: {},
    attendeeProcessItem: {},
    attendeeProcessId: '',
    attendeeProcessStatus: '',
    connectToArray: [],
    expanded: [],
    attendeeList: [],
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
    expandTableHeaders: [
      {
        text: 'Employee Name',
        align: 'start',
        value: 'attendeeName',
      },
      { text: 'Comment', align: 'center', value: 'comment' },
      { text: 'Image', align: 'center', value: 'image' },
      { text: 'Status', align: 'center', value: 'status' },
      { text: 'Actions', align: 'center', value: 'actions' },
    ],
    checkAsAttendee: false,
    checkRoutine: false,
    editedItem: {
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
      created_at: '',
    },
    defaultItem: {
      created_at: '',
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
      selectedEmployeeItem: {},
      recurringArray: [
        {
          id: 'Daily',
          name: 'Daily',
        },
        {
          id: 'Weekly',
          name: 'Weekly',
        },
        {
          id: 'Monthly',
          name: 'Monthly',
        },
        {
          id: 'Quarter',
          name: 'Quarter',
        },
        {
          id: 'Yearly',
          name: 'Yearly',
        },
      ],
    },
    infoItem: {},
    taskItem: {},
    attendeeArray: [],
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
      {
        name: 'Employee 5',
        comment: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
        image: 'Not-Availbale',
        status: 3,
        actions: '',
        checkStatus: false,
      },
    ],
    config: {
      events: {
        //
      },
      // placeholderText: 'Place your cursor in {{}} to see the autofill list.',
      charCounterCount: true,
      heightMin: 150,
      quickInsertEnabled: false,
      toolbarButtons: {
        moreText: {
          buttons: [
            'bold',
            'italic',
            'underline',
            'strikeThrough',
            'subscript',
            'superscript',
            'fontFamily',
            'fontSize',
            'textColor',
            'backgroundColor',
            'inlineClass',
            'inlineStyle',
            'clearFormatting',
          ],
        },
        moreParagraph: {
          buttons: [
            'alignLeft',
            'alignCenter',
            'formatOLSimple',
            'alignRight',
            'alignJustify',
            'formatOL',
            'formatUL',
            'paragraphFormat',
            'paragraphStyle',
            'lineHeight',
            'outdent',
            'indent',
            'quote',
          ],
        },
        moreRich: {
          buttons: [
            'refer_to_dropdown_custom',
            'insertLink',
            'insertImage',
            'insertVideo',
            'insertTable',
            'emoticons',
            'fontAwesome',
            'specialCharacters',
            'embedly',
            'insertFile',
            'insertHR',
          ],
        },
        moreMisc: {
          buttons: [
            'undo',
            'redo',
            'fullscreen',
            'print',
            'getPDF',
            'spellChecker',
            'selectAll',
            'html',
            'help',
          ],
          align: 'right',
          buttonsVisible: 2,
        },
      },
      linkList: [],
    },
    editedNewItem: {},
    taskArray: [],
    arrayItem: [],
    // checkShowItem: false,
    routineArray: [
      {
        id: '1',
        name: 'Turn on system light its reminder',
        added: 'Creator',
        responsible: 'IT-Manager',
        totalattendees: '5',
        connected_date: '10.09.2022',
        frequency: ' Weekly',
        deactivation: ' 23.10.2023',
      },
    ],
    AttendeeData: [
      // {
      //   id:1,
      //   name: 'Frozen Yogurt',
      //   responsible: 'IT-Manager',
      //   status: 1,
      //   actions: '',
      // },
    ],
    // checkChangeSecurity: {
    //   condition: '',
    //   countChange: ''
    // },
    hoverQuestionMark: false,
    isEmployeeStatus: false,
    isEmployeeRemove: false,
    openDocument: false,
    addImage: '',
    docItem: {},
    checkEdit: false,
    attendeeHistory: [],
    processingItem: {},
    userRate: '',
    total_rate: '',
    isTaskEmployee: false,
    isReminderEmployee: false,
    showExpand: false,
    isReminderHistory: false,
    checkNew: false,
    addDescription: '',
    disapprovedModal: false,
    disApprovedTitle: '',
    isDisapproved: false,
    attendeeObjectID: '',
    isWorkerRoutine: false,
    feedbackItem: {
      attachment: '',
      comment: '',
      object_id: '',
      processing_id: '',
      required_comment: false,
      required_attachment: false,
    },
    requestItem: {},
    extendeItem: {},
    isResubmit: false,
    isResponsibleSubmit: false,
    hideDone: false,
    openEmployeeTable: false,
    imageData: '',
    statusActionItem: {
      newStatus: '',
      processID: '',
      responsible_comment: '',
      id: '',
    },
    routineTaskFeild:false,
    doneResponse:false,
    updateItem:{},
    routineItem:{},
    durationData:{
      unit:'',
      duration:1,
       is_duration:false,
    },
    checkResubmit:false,
    docId:'',
    closedStatus:false,
      allEmployee:'',

  }),

  computed: {
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
            { text: this.translateCol('actions'), value: 'actions', align: 'center', sortable: false, },
        ];
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
          align: 'left',
        },
        {
          text: this.translateCol('image'),
          value: 'image',
          align: 'left',
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
    ReminderAttendeeHeaders() {
      return [
        {
          text: this.translateCol('employee_name'),
          value: 'name',
          align: 'left',
          sortable: false,
        },
      ]
    },
    taskHeader() {
      return [
        {
          text: this.translateCol('name'),
          value: 'name',
          align: 'center',
          sortable: false,
        },
        {
          text: this.translateCol('total_attendee'),
          value: 'totalattendees',
          align: 'center',
        },
        {
          text: this.translateCol('start_date'),
          value: 'start_date',
          align: 'center',
        },
        {
          text: this.translateCol('deadline'),
          value: 'deadline',
          align: 'center',
        },
        {
          text: this.translateCol('status'),
          value: 'status',
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
    headersAttendee() {
      return [
        {
          text: this.translateCol('employee_name'),
          value: 'name',
          align: 'left',
        },
        {
          text: this.translateCol('comment'),
          value: 'comment',
          align: 'center',
        },
        { text: this.translateCol('image'), value: 'image', align: 'center' },
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
          value: 'deadline',
          align: 'center',
        },
        { text: this.translateCol('status'), value: 'status', align: 'center' },
        {
          text: this.translateCol('total_attendee'),
          value: 'totalattendees',
          align: 'center',
        },
      ]
    },
    connectedHeaders() {
      return [
        { text: this.translateCol('name'), value: 'name', align: 'left' },
        {
          text: this.translateCol('function'),
          value: 'source',
          align: 'center',
        },
        {
          text: this.translateCol('category'),
          value: 'category',
          align: 'center',
        },
        {
          text: this.translateCol('added_by'),
          value: 'added',
          align: 'center',
        },
        {
          text: this.translateCol('connected_by'),
          value: 'connectedBy',
          align: 'center',
        },
        {
          text: this.translateCol('connected_date'),
          value: 'connected_date',
          align: 'center',
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
    routineHeaders() {
      return [
        { text: this.translateCol('id'), value: 'id', sortable: false },
        {
          text: this.translateCol('name'),
          value: 'name',
          align: 'left',
          width: '16%',
        },
        {
          text: this.translateCol('added_by'),
          value: 'added',
          align: 'center',
          width: '12%',
        },
        {
          text: this.translateCol('responsible'),
          value: 'responsible',
          align: 'center',
          width: '14%',
        },
        {
          text: this.translateCol('total_attendee'),
          value: 'totalattendees',
          align: 'center',
          width: '17%',
        },
        {
          text: this.translateCol('activation'),
          value: 'start_date',
          align: 'center',
          width: '13%',
        },
        {
          text: this.translateCol('frequency'),
          value: 'recurring',
          align: 'center',
          width: '13%',
        },
        {
          text: this.translateCol('deactivation'),
          value: 'deadline',
          align: 'center',
          width: '16%',
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
      if (this.checkResponsible) {
        return this.managerHeaders
      } else if (this.checkAttendee) {
        return this.headersAttendee
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
          this.openEmployeeTable = false;
          this.checkAsAttendee=false;
          this.checkRoutine=false;
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

  mounted() {},

  created() {
    if (this.openPopup) {
      if (this.documentItem) {
        this.editItem(this.documentItem)
      } else {
        this.addNew()
      }
    }
    if (this.roleUser == 'user') {
      this.checkWorker = true
    }

    if (this.resource) {
      this.checkResource = this.resource
    }

    // this.routineArray.push({
    //   id:'1' ,
    //   // name:'Turn on system light its reminder',
    //   // added:'Creator',responsible:'IT-Manager',
    //   // totalattendees:'5',
    //   // connected_date:'10.09.2022',
    //   // frequency:' Weekly',
    //   // deactivation:' 23.10.2023'
    // })
  },

  methods: {
    handleObjectOpen(item) {
          this.objectItem = {
            'id':item.source_id,
            'type': item?.source || item?.connect_to_source,
          };
          this.isObjectOpen = true;
          this.isOnlyView = true;
    },
    getConnectToArray (data) {
          this.connectToObject = [...data];
    },
    changeTab(value) {
      this.$emit('changeTab', value)
    },
    is_reminder_history() {
      this.isReminderHistory = !this.isReminderHistory
    },
    attendeeReason(item) {
      this.checkNew = true
      this.addDescription = item
    },
    sendRequest() {
      this.disapprovedModal = true
      this.disApprovedTitle = 'Extend Deadline Request'
    },
    async updateDocument() {
      this.updateItem = this.editedItem
      this.updateItem.id = this.editedItem.task_id || this.editedItem.routine_id
      this.updateItem.status = 'closed'
      this.updateItem.type = this.editedItem.routine_id ? 'routine' : 'task'
      this.updateItem.object_type = this.editedItem.routine_id ?  'routine' : 'task'
      this.updateItem.responsible_id = ''
      this.updateItem.requestEdit = true
      this.updateItem.is_duration=false
      this.updateItem.is_activated=false
      this.updateItem.is_attending_activated=false
      this.updateItem.is_public = this.editedItem?.is_public || false
      this.updateItem.recurring_type = this.editedItem?.routine?.recurring_type
      this.updateItem.recurring = this.editedItem?.routine?.recurring
      this.updateItem.recurring = this.editedItem?.routine?.recurring
      // this.updateItem.start_time = this.updateItem.start_time != null && this.updateItem.start_time != "" ? new moment(this.updateItem.start_time, "HH:mm").utc().format("HH:mm") : null;
      // this.updateItem.end_time = this.updateItem.end_time && this.updateItem.end_time != "" ? new moment(this.updateItem.end_time, "HH:mm").utc().format("HH:mm"): null;
      this.updateItem.start_time = await formatTimeString(new moment(this?.updateItem?.start_time, "HH:mm"))
            this.updateItem.end_time = await formatTimeString(new moment(this?.updateItem?.end_time, "HH:mm"))
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
            this.$toaster.error(this.$i18n.t('message.fail_task_update'))
          }
          this.$nuxt.$loading.finish()
        })

        this.docItem = this.editedItem
      this.docItem.id = this.docId
      this.docItem.object_type = 'document'
      this.docItem.type = 'document'
      this.docItem.status = 'closed'
        this.$store
        .dispatch('documents/update', this.docItem)
        .then((res) => {
          this.$nuxt.$loading.start()
          this.reloadList()
          this.reloadListCategory()
          if (res.data) {
            this.$toaster.success(
              this.$i18n.t('message.success_document_update')
            )
          }
        })
        .catch((error) => {
          if (error.response.status == 401) {
            this.$router.push('/login')
            this.$toaster.error(this.$i18n.t('message.token_expired'))
          } else {
            this.$toaster.error(this.$i18n.t('message.fail_document_update'))
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
          this.close()
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
              await this.updateDocument();
              this.checkAsAttendee=false;
              this.checkRoutine=false;
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
      this.requestItem.deadline_time = requestDeadline ? item.end_time_pre: null
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
      this.extendeItem.id = item.extended_timeline.id
      this.$store
        .dispatch(`objects/extend_action`, this.extendeItem)
        .then(() => {
          this.$nuxt.$loading.start()
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
      this.extendeItem.id = newItem.item.extended_timeline.id
      this.$store
        .dispatch(`objects/extend_action`, this.extendeItem)
        .then(() => {
          this.$nuxt.$loading.start()

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
         this.feedbackItem.description= await removeTagsFromString(payload.description);

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
              this.$router.push('/login')
              this.$toaster.error(this.$i18n.t('message.token_expired'))
            } else {
              this.$toaster.error(this.$i18n.t('message.fail_add_content'))
            }
            // this.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            this.$nuxt.$loading.finish()
          })
      }
      this.feedbackItem.comment = ''

      this.close()
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
          this.$nuxt.$loading.finish()
        })
      this.$nuxt.$loading.finish()
    },
    openInfo(value) {
      if (value == true) {
        this.openEmployeeTable = true
      } else {
        this.openEmployeeTable = false
      }
    },
    applyTemplate() {
      let that = this
      that.$nuxt.$loading.start()
      that.openDocument = true
      that.close()
      that.$nuxt.$loading.finish()
    },
    showImage(image) {
      this.checkImage = true
      this.addImage = image
    },
    // employeeItem(data){
    //   this.$store.dispatch('objects/show', this.taskItem.id)
    //   .then((res) => {
    //     this.selectedEmployeeItem = res.data?.processingInfo[data.index]

    //     this.taskItem=res.data;
    //   // if ((this.checkCreator || this.checkResponsible) ) {
    //   //   this.checkShowItem = true
    //   // }else{
    //   //   this.checkShowItem = false
    //   // }

    //   if (this.taskItem?.responsible?.employeeRole?.includes(this.userID)) {
    //      this.checkShowItem = true
    //      this.is_reminder_history=false
    //    }else{
    //      this.checkShowItem = false
    //    }
    //   if (this.selectedEmployeeItem.status === 'Reassigned') {
    //      this.isEmployeeStatus = true
    //      this.isEmployeeRemove = false
    //    } else if (this.selectedEmployeeItem.status === 'Removed') {
    //      this.isEmployeeStatus = true
    //      this.isEmployeeRemove = true
    //    } else {
    //      this.isEmployeeStatus = false
    //    }
    //   })
    // },
    updateEmployee(emp_index) {
      this.$store.dispatch('objects/show', this.taskItem.id).then((res) => {
        this.selectedEmployeeItem = res.data?.processingInfo[emp_index]
        this.reloadList()
      })
    },
    saveEmployee(payload) {
      if (payload.up_item) {
        this.selectedEmployeeItem.status = 'Removed'
      } else {
        this.selectedEmployeeItem.status = 'Reassigned'
      }
      this.$store.dispatch('objects/show', this.taskItem.id).then((res) => {
        res.data.processingInfo = res.data.processingInfo((item, index) => {
          if (index === payload.up_index) {
            item.status = this.selectedEmployeeItem.status
          }
          if (index == res?.data?.processingInfo.length - 1) {
            this.taskItem = res?.data
          }
        })
      })
    },
    TotalAttendee(item) {
      this.isTotalAttendee = !this.isTotalAttendee
      this.expanded.push(item)
    },
    RoutineReminder() {
      this.onRoutineReminder = !this.onRoutineReminder
    },
    translateCol(colName) {
      return this.$i18n.t('column.' + colName)
    },
    onAction() {
      this.onAttendeeAction = !this.onAttendeeAction
    },
    editConnectToObject(payload) {
      console.log(payload)
    },
    resetConnectToObjectFrom() {
      this.connectToObjectFrom.document_id = ''
      this.connectToObjectFrom.connectToArray = []
    },
    responsibleAddRequiredComment(item, status) {
      if (
        status === 'reopened' ||
        this.taskItem.responsible['required_comment'] ||
        this.taskItem.responsible['required_attachment']
      ) {
        this.isRequiredComment = true
        this.editedRequiredCommentItem = item
        if (this.checkAdmin || this.checkCreator) {
          this.editedRequiredCommentItem.isCreator = true
        } else if (this.checkResponsible) {
          this.editedRequiredCommentItem.isResponsible = true
        }
        this.editedRequiredCommentItem.requiredComment =
          status === 'reopened'
            ? 1
            : this.taskItem.responsible['required_comment']
        this.editedRequiredCommentItem.requiredAttachment =
          this.taskItem.responsible['required_attachment']
        this.editedRequiredCommentItem.new_status = status
      } else {
        this.updateStatus(item.process_id, status, null)
      }
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
      that.taskItem.task_id = that.taskItem.id
      let item = that.taskItem
      that.taskItem.newStatus = newStatus
      that.taskItem.processID = processID
      if (that.checkAttendee) {
        that.taskItem.comment = comment
      } else {
        that.taskItem.responsible_comment = comment
      }
      that.$store
        .dispatch('objects/updateStatus', that.taskItem)
        .then(function () {
          that.reloadList()
          if (that.checkCreator || that.checkResponsible) that.viewTask(item)
          else if (that.checkAttendee) that.close()
        })
        .catch((error) => {
          if (error.response.status == 401) {
            this.$router.push('/login')
            this.$toaster.error(this.$i18n.t('message.token_expired'))
          }
          that.$nuxt.$loading.finish()
        })
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
      } else if (this.checkAttendee) {
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
    async addConnectToObject(payload) {
      this.connectToArray = payload
      this.resetConnectToObjectFrom()
      this.connectToObjectFrom.connectToArray.push(payload.connectToArray)
      this.connectToObjectFrom.object_id = payload.object_id
      await this.getObject(this.editedItem)
    },
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
    changeSecurity(val) {
      if (val !== 'all') {
        this.editedItem.is_suggestion = false
      }
      // this.checkChangeSecurity = Object.assign({}, val);
    },
    getNewCategory(value) {
      this.editedItem.category_id = value.newCategoryId
    },
    viewAttendee() {},
    editAttendee() {},
    deleteAttendee(item) {
      console.log(item)
      this.AttendeeDelete = true
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
    // getStartDate(payload){
    //   console.log(payload);
    // },
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
      async getObject (item) {
          this.connectToObject = [];
          
          // await api.documents
          //         .connect(item.id)
          //         .then((result) => {
          //           let respo = result.data.data
          //           if (respo.length > 0) {
          //             respo.forEach((el) => {
          //               this.connectToObject.push({
          //                 id: el.id,
          //                 name: el.objectName,
          //                 source: el.connect_to_source,
          //                 category: el.categoryName,
          //                 added: el.addedByUser,
          //                 connectedBy: el.connectedByUser,
          //                 connected_date: el.created_at,
          //               })
          //             })
          //           } else {
          //             this.connectToObject = []
          //           }
          //         })
          //         .catch((error) => {
          //           console.log(error)
          //         })
          await this.$store.dispatch('connectToObject/getByObject', {
              objectID: item.id,
              type: 'document',
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
    async viewTask(item) {
      let that = this
      this.$store
        .dispatch('objects/show', item.task_id)
        .then((result) => {
          that.attendeeObjectID = item.task_id
          if (that.checkWorker == false) {
            that.$store
              .dispatch(`objects/getAttendeeData`, item.task_id)
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
          that.routineTaskFeild=true
          let respo = result.data
          // this.taskArray=[result.data]
          this.arrayItem = [result.data]
          this.closedStatus = result.data.status == "closed" ? true : false
          const responseDateStr = respo.start_date;

                // Parse the response date into a Date object
                const responseDate = new Date(responseDateStr);
                responseDate.setHours(0, 0, 0, 0);
                const currentDate = new Date();
                currentDate.setHours(0, 0, 0, 0);

                // Compare the dates without time
                if(!that.checkResource){
                  if (currentDate < responseDate ) {
                    that.checkEdit = false
                    // console.log("The current date is earlier than the response date.");
                  }else {
                    that.checkEdit = true
                  }
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

          // this.taskItem = Object.assign({}, respo)
          this.infoItem = Object.assign({}, respo)
          that.userRate = that.infoItem.rate.toFixed()
          that.total_rate = that.infoItem.total_rate.toFixed()
          this.responsibleName = respo.responsible?.employeeName
          // this.editedItem.responsible_employee_array = JSON.parse(respo.responsible['employee_array']);
          //  this.checkCreator = _.contains(respo.role, 'creator');
          // this.checkResponsible = _.contains(respo.role, 'responsible');
          if (result.data?.responsible?.employeeRole?.includes(that.userID)) {
            that.checkResponsible = true
          } else {
            that.checkResponsible = false
          }
          that.processingItem = that.infoItem?.my_processing
          if (that.processingItem?.status && that.checkWorker) {
            that.editedItem.status = that.processingItem.status
            if (
              that.editedItem.status === 'approved' ||
              that.editedItem.status === 'completed' ||
              that.editedItem.status === 'request' ||
              that.editedItem.status === 'approved_overdue' ||
              that.editedItem.status === 'completed_overdue' ||
              that.editedItem.status === 'Reassigned' ||
              that.editedItem.status === 'Removed' || that.editedItem.status === 'disapproved'
            ) {
              that.checkResubmit = false
              that.hideExtendTimeline = true
            } else if (
              that.editedItem.status === 'overdue' ||
               that.editedItem.status === 'disapproved_with_extended' 
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
              that.processingItem?.status === 'ongoing'|| that.processingItem?.status === 'disapproved' || that.processingItem?.status === 'timeline_disapproved')
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
          //   this.checkAttendee = _.contains(respo.role, 'attendee');
          // var userLogged=this.userLogged
          // if (this.checkAttendee) {
          //   let processAttendee = _.filter(respo.processingInfo, function (o) {
          //     return o.user_id === userLogged;
          //   });
          //   if (processAttendee) {
          //     this.attendeeProcessItem = processAttendee[0];
          //     this.attendeeProcessId = processAttendee[0].process_id;
          //     this.attendeeProcessStatus = processAttendee[0].status;
          //   }
          // }
          // this.reloadList()
        })
        .catch((error) => {
          if (error.response.status == 401) {
            this.$router.push('/login')
            this.$toaster.error(this.$i18n.t('message.token_expired'))
          } else {
            this.$toaster.error(this.$i18n.t('message.fail_task_view_detail'))
          }
        })
    },
    async viewRoutine(item) {
      let that = this
      that.$store
        .dispatch('objects/show', item.routine_id)
        .then((result) => {
          that.$nuxt.$loading.start()
          that.attendeeObjectID = item.routine_id
          if (that.checkWorker == false) {
            that.$store
              .dispatch(`objects/getAttendeeData`, item.routine_id)
              .then((attendeeRes) => {
                // that.$nuxt.$loading.start()
                that.attendeeArray = attendeeRes.attendee
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
          // that.$nuxt.$loading.start()
          that.attendeeList = result.data?.attendee?.employeeName
          that.infoItem = Object.assign({}, result.data)
           const responseDateStr = that.infoItem.start_date;
                //  const responseDateStr = "2023-07-28T12:34:56";

                // Parse the response date into a Date object
                const responseDate = new Date(responseDateStr);
                responseDate.setHours(0, 0, 0, 0);
                const currentDate = new Date();
                currentDate.setHours(0, 0, 0, 0);

                // Compare the dates without time
                if(!that.checkResource){

                  if (currentDate < responseDate ) {
                    that.checkEdit = false
                  } else {
                    that.checkEdit = true
                  }
                }
          that.arrayItem = [result.data]

          that.userRate = that.infoItem.rate.toFixed()
          that.total_rate = that.infoItem.total_rate.toFixed()

          that.processingItem = that.infoItem?.my_processing
          if (that.processingItem?.status && that.checkWorker) {
            that.editedItem.status = that.processingItem?.status
            if (
              that.editedItem.status === 'approved' ||
              that.editedItem.status === 'completed' ||
              that.editedItem.status === 'request' ||
              that.editedItem.status === 'approved_overdue' ||
              that.editedItem.status === 'completed_overdue' ||
              that.editedItem.status === 'Reassigned' ||
              that.editedItem.status === 'Removed' || that.editedItem.status === 'disapproved'
            ) {
              that.checkResubmit = false
              that.hideExtendTimeline = true
            } else if (
              that.editedItem.status === 'overdue' ||
               that.editedItem.status === 'disapproved_with_extended' 
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
              that.processingItem?.status === 'ongoing'  || that.processingItem?.status === 'disapproved' || that.processingItem?.status === 'timeline_disapproved')
          ) {
            that.checkAttendee = true
            that.hideDone = false
          } else {
            that.checkAttendee = false
            that.hideDone = true
          }

          // }
          that.routineItem = Object.assign({}, result.data.routine)

          if (that.processingItem?.attendee_id == that.userID && that.processingItem?.status !== 'completed' && that.processingItem?.status != null) {
            that.doneResponse = true
          } else {
            that.doneResponse = false
          }
          if (that.routineItem.recurring_type === 'task') {
            that.routineTaskFeild = true
          } else {
            that.routineTaskFeild = false
          }
          that.durationData.unit = result.data?.routine?.recurring
          that.durationData.duration = result.data?.routine?.duration
          that.durationData.is_duration = result.data?.routine?.is_duration
          if (that.durationData.unit == 'Daily') {
            that.isDisabledDay = true
            that.durationData.is_duration = false
          } else if (that.durationData.unit == 'Weekly') {
            that.isDisabledDay = true
            that.durationData.is_duration = true
          } else {
            that.isDisabledDay = false
            // that.durationData.is_duration = false
          }
          that.responsibleName = result.data?.responsible?.employeeName
          // if (
          //   that.processingItem?.attendee_id == that.userID &&
          //   that.processingItem.status !== 'completed' &&
          //   that.processingItem.status != null
          // ) {
          //   that.doneResponse = true
          // } else {
          //   that.doneResponse = false
          // }
          if (result.data?.responsible?.employeeRole?.includes(that.userID)) {
            that.checkResponsible = true
          } else {
            that.checkResponsible = false
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
          that.$nuxt.$loading.finish()
        })
        .catch((error) => {
          if (error.response.status == 401) {
            this.$router.push('/login')
            this.$toaster.error(this.$i18n.t('message.token_expired'))
          } else {
            console.log(error)
            that.$nuxt.$loading.finish()
          }
        })
      that.$nuxt.$loading.finish()
    },
    editItem(item , value) {
      let that = this
      that.connected_to_task = []
      if (that.viewOnly == true) {
        that.checkEdit = true
      }
      that.formTitle = that.$i18n.t('title.edit_document')
      that.formDirty = false
      that.getObject(item)
      that.$nuxt.$loading.start()
      that.$store
        .dispatch('documents/show', item.id)
        .then((result) => {
          if(result?.data?.task_data?.status == 'closed'){
            this.checkAsAttendee=false;
            this.checkRoutine=false;
          }
          if(result?.data?.routine_id!=null){
            this.checkRoutine=true;
          }
          if(result?.data?.task_data?.attendee?.employee_array == result?.data?.task_data?.responsible?.employee_array && this.roleUser != 'user' && result?.data?.task_data?.status != 'closed' && result?.data?.routine_id == null){
            this.checkAsAttendee=true;
          }
          that.editedItem = Object.assign({}, result.data)
          that.docId = that.editedItem.id

          var htmlStringShow = result.data.description
            var tempDivShow = document.createElement('div')
            tempDivShow.innerHTML = htmlStringShow
            var firstChildShow = tempDivShow?.firstChild
            var textContentShow = firstChildShow ? firstChildShow?.textContent : '';
            that.editedItem.description = textContentShow

          if(value == true){
            
            that.openEmployeeTable = false
          }

          // that.editedItem.category_name = item.category_name
          // that.editedItem.added_by_name = item.added_by_name
          // that.editedItem.created_at = item.created_at
          that.attendeeObjectID = null

          if (result.data?.task_id && result.data.routine_id == null){
            that.viewTask(item)
          } 
          if ((result.data.routine_id && result.data?.task_id) ||result.data.routine_id && result.data?.task_id== null ) {
            that.viewRoutine(item)
            }

          if (that.checkSuperAdmin) {
            that.editedItem.industry_id_arr = that.formatNullArray(
              that.formatFromStringToArray(that.editedItem.industry_id)
            )
          }
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
          that.attachmentType = that.editedItem.type_of_attachment === 1
          that.selectedFile = []
          if (item.url) {
            // that.countAttachmentOriginalFileName(that.editedItem)
            that.imageData = item.url
            // that.addImage = item.original_file_name
          }
          that.$nuxt.$loading.finish()
        })
        .catch((error) => {
          if (error.response.status == 401) {
            that.$router.push('/login')
          }
          that.$toaster.error(that.$i18n.t('message.fail_document_view_detail'))
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish()
        })
    },

    countAttachmentOriginalFileName(item) {
      if (item.original_file_name.length > 80) {
        item.original_file_name =
          item.original_file_name.slice(0, 80 - 1) + '... '
      }
      return item
    },

    checkDirtyBeforeClose() {
      if (this.checkDirtyForm()) {
        this.dialogConfirmClose = true
      } else {
        this.close()
      }
    },

    checkDirtyForm() {
      let that = this
      let result = false
      _.each(that.editedItem, function (value, key, obj) {
        if (
          that.originData &&
          obj[key] &&
          that.originData[key] &&
          obj[key] !== that.originData[key]
        ) {
          result = true
        }
      })
      return result
    },
    close() {
      this.isEdit = false
      this.isTaskEmployee = false
      this.openEmployeeTable = false
      this.onRoutineReminder = false
      this.onAttendeeAction = false
      if (this.openPopup) {
        this.$emit('closePopup')
      }
    },
    // close() {
    //   this.reset();
    //   this.dialogConfirmClose = false;
    //   this.formDirty = false;
    //   this.$emit('closePopup');
    //   this.reloadListCategory();
    // },

    reset() {
      // this.denyEdit = false;
      // this.isClosed = false;
      this.$nuxt.$loading.finish()
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        // this.$refs.form.reset();
        this.$refs.form.resetValidation()
      }, 300)
    },
    async save() {
      // update
      let that = this
      let formData = {}
      that.$nuxt.$loading.start()
      let type_of_attachment = that.attachmentType ? 1 : 2
      formData.type_of_attachment = type_of_attachment
      formData.category_id = that.editedItem.category_id;
      formData.name = that.editedItem.name;
      formData.description = that.editedItem.description;
      formData.status = that.editedItem.status;
      formData.created_at = that.editedItem.created_at;
      formData.object_type = 'document';
      formData.connectToArray = that.connectToObject;
      
      let is_suggestion = that.editedItem.is_suggestion ? 1 : 0
      formData.is_suggestion = is_suggestion

      // save object_type & object_id
      if (that.contactId) {
        formData.object_type = 'contact'
        formData.object_id = that.contactId
      }
      if (that.employeeId) {
        formData.object_type = 'employee'
        formData.object_id = that.employeeId
      }
      formData.private_document = true

      if (that.checkSuperAdmin) {
        formData.industry_id = that.editedItem.industry_id_arr.toString()
        formData.is_shared = 1
        formData.is_public = 1
      } else {
        let is_shared = that.editedItem.is_shared ? 1 : 0
        let is_public = that.editedItem.is_public ? 1 : 0
        formData.is_shared = is_shared
        formData.is_public = is_public
      }
      if (that.roleUser === 'user' && that.editedItem.is_public === 1) {
        formData.show_manager = 1
      }

      formData.type = that.editedItem.type
      formData.attachment_updated = true
      if (
        that.editedItem.type_of_attachment === 1 &&
        that.selectedFile.length !== 0
      ) {
        formData.selectedFile = that.selectedFile
        formData.original_file_name = that.selectedFile.name
        formData.file_size = that.selectedFile.size
        formData.changed_file = true
      }
      if (
        that.editedItem.is_template === 0 &&
        that.editedItem.status === 1 &&
        that.editedItem.is_renewed === 1
      ) {
        formData.deadline_pre = that.editedItem.deadline_pre
      }
       that.textTrime = that.editedItem.name
            that.editedItem.name = this.textTrime.trim()


         this.editedItem.description= await removeTagsFromString(that.editedItem.description);


            formData.name = that.editedItem.name
            formData.description = that.editedItem.description

      formData.id = that.editedItem.id

      that.$store
        .dispatch('documents/update', formData)
        .then((res) => {
          that.$nuxt.$loading.start()
          that.resourceList()
          that.reloadList()
          that.reloadListCategory()
          if (res.data) {
            that.$toaster.success(
              that.$i18n.t('message.success_document_update')
            )
          }
        })
        .catch((error) => {
          if (error.response.status == 401) {
            this.$router.push('/login')
            this.$toaster.error(this.$i18n.t('message.token_expired'))
          } else {
            that.$toaster.error(that.$i18n.t('message.fail_document_update'))
          }
          that.$nuxt.$loading.finish()
        })
      that.close()
    },
    deleteItem(val) {
      let that = this
      if (this.checkResource) {
        that.$store
          .dispatch('documents/delete', val.index)
          .then(() => {
            that.resourceList()
            that.reloadList()
            that.reloadListCategory()
            that.$toaster.success(
              that.$i18n.t('message.success_document_delete')
            )
          })
          .catch((error) => {
            if (error.response.status == 401) {
              this.$router.push('/login')
              this.$toaster.error(this.$i18n.t('message.token_expired'))
            } else {
              that.$toaster.error(that.$i18n.t('message.fail_document_delete'))
            }
            that.$nuxt.$loading.finish()
          })
        that.dialogDelete = false
        that.close()
      } else if (!this.checkResource) {
        that.$store
          .dispatch('documents/delete', val.index)
          .then(() => {
            that.reloadList()
            that.reloadListCategory()
            that.$toaster.success(
              that.$i18n.t('message.success_document_delete')
            )
          })
          .catch((error) => {
            if (error.response.status == 401) {
              this.$router.push('/login')
              this.$toaster.error(this.$i18n.t('message.token_expired'))
            } else {
              that.$toaster.error(that.$i18n.t('message.fail_document_delete'))
            }
            that.$nuxt.$loading.finish()
          })
        that.dialogDelete = false
        that.close()
      }
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
.edit-icon {
  font-size: 14px !important;
}
:deep(.v-text-field__details) {
  display: none;
}
:deep(.v-input__control .v-input__slot) {
  /* margin-bottom: 0px !important; */
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
.document-attachment {
  height: 23px;
  width: 23px;
}
.delete-btn {
  box-shadow: none;
  color: #9f9f9f;
  border: 1px solid !important;
  margin: 0px 15px !important ;
}
:deep(.v-dialog > .v-card > .v-card__title) {
  padding: 30px 24px 40px !important;
}
/* :deep(.review-popup .normal-table .info-block.responsible){
  border-top: none;
  border-bottom: none;
} */
:deep(.icon-flex) {
  display: flex;
  align-content: center;
}
.description {
  height: 120px;
}
:deep(.category-btns) {
  display: flex;
  margin-top: -10px !important;
}
</style>

<template>
  <div class="absence-page">
    <v-btn class="mb-2 btn-create btn-custom-green" :disabled="tabIndex === 1 && listAbsenceReasonArray.length > 1" @click="addNew">
      {{ $t('button.add_new') }}
    </v-btn>

    <b-tabs v-model="tabIndex" card name="test" lazy>
      <keep-alive>
        <b-tab title="Absences" active name="result-tab" class="result-tab">
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKey" />
          <v-container>
            <v-data-table
              :headers="headers"
              :items="filteredItems"
              class="elevation-1 hse-table table-data"
              :items-per-page="15"
              :single-expand="true"
              :search="search"
              :sort-by="['created_at']"
              :sort-desc="[true, false]"
              @click:row="editItem"
            >
              <template v-slot:top>
                <div class="status-boxes">
                  <b-row>
                    <b-col cols="3">
                      <div class="status-box-wrap">
                        <div>
                          <h3>{{ processing.new }}</h3>
                          <p>New</p>
                        </div>
                      </div>
                    </b-col>

                    <b-col cols="3">
                      <div class="status-box-wrap">
                        <div>
                          <h3>{{ processing.processing }}</h3>
                          <p>Processing</p>
                        </div>
                      </div>
                    </b-col>

                    <b-col cols="3">
                      <div class="status-box-wrap">
                        <div>
                          <h3>{{ processing.approved }}</h3>
                          <p>Approved</p>
                        </div>
                      </div>
                    </b-col>

                    <b-col cols="3">
                      <div class="status-box-wrap">
                        <div>
                          <h3>{{ processing.reject }}</h3>
                          <p>Reject</p>
                        </div>
                      </div>
                    </b-col>
                  </b-row>
                </div>
                <div class="setting-header">
                  <div class="panel-heading">
                    <h4 class="panel-title">
                      {{ $t('title.sort_by') }}
                    </h4>
                    <b-row>
                      <b-col cols="10">
                        <b-row>
                          <b-col cols="3">
                            <div class="field-selection">
                              <v-select
                                v-model="status"
                                :label="$t('form.status')"
                                item-text="name"
                                item-value="value"
                                :items="statusSelection"
                                outlined
                                class="text-box"
                              />
                            </div>
                          </b-col>
                          <b-col cols="3">
                            <div class="field-selection">
                              <v-select
                                v-model="added_by"
                                label="Added By"
                                item-value="id"
                                :items="usersSelection"
                                outlined
                                class="text-box"
                              >
                                <template slot="selection" slot-scope="data">
                                  {{ data.item.name }}
                                </template>
                                <template slot="item" slot-scope="data">
                                  {{ data.item.name }}
                                </template>
                              </v-select>
                            </div>
                          </b-col>
                          <b-col cols="3">
                            <date-range-picker
                              ref="picker"
                              :opens="opens"
                              :locale-data="localData"
                              :singleDatePicker="singleDatePicker"
                              :timePicker="timePicker"
                              :timePicker24Hour="timePicker24Hour"
                              :showWeekNumbers="showWeekNumbers"
                              :showDropdowns="showDropdowns"
                              :autoApply="autoApply"
                              v-model="dateRange"
                              :linkedCalendars="linkedCalendars"
                              :alwaysShowCalendars="alwaysShowCalendars"
                              class="range-picker-custom text-box"
                            >
                              <template v-slot:input="picker">
                                <div v-if="picker.startDate">
                                  {{moment(picker.startDate).format('DD.MM.YYYY') }} - {{ moment(picker.endDate).format('DD.MM.YYYY') }}
                                </div>
                                <div v-else>All</div>
                              </template>
                            </date-range-picker>
                          </b-col>
                          <b-col cols="3">
                            <div class="field-selection">
                              <v-select
                                v-model="typeReason"
                                label="Reason"
                                :items="typeReasonsSelection"
                                item-text="type"
                                item-value="id"
                                outlined
                                class="text-box"
                              />
                            </div>
                          </b-col>
<!--                          <b-col cols="12">-->
<!--                            <div class="input-wrap field-search">-->
<!--                              <v-text-field-->
<!--                                v-model="search"-->
<!--                                append-icon="search"-->
<!--                                label="Search"-->
<!--                                outlined-->
<!--                              />-->
<!--                            </div>-->
<!--                          </b-col>-->
                        </b-row>
                        <b-row>
                          <b-col v-if="isShowDepartmentFilter" cols="4">
                            <div class="field-selection">
                              <v-select
                                v-model="department"
                                :items="departmentsSelection"
                                item-value="id"
                                item-text="name"
                                :label="$t('form.department')"
                                outlined
                                class="text-box"
                              />
                            </div>
                          </b-col>
                          <b-col v-if="isShowRoleFilter" cols="4">
                            <div class="field-selection">
                              <v-select
                                v-model="role"
                                :items="roleSelection"
                                item-value="id"
                                item-text="name"
                                :label="$t('form.role')"
                                outlined
                                class="text-box"
                              />
                            </div>
                          </b-col>
                          <b-col v-if="isShowProjectFilter" cols="4">
                            <div class="field-selection">
                              <v-select
                                v-model="project"
                                :items="projectSelection"
                                item-value="id"
                                item-text="name"
                                label="Project"
                                outlined
                                class="text-box"
                              />
                            </div>
                          </b-col>
                        </b-row>
                      </b-col>

                      <b-col cols="2">
                        <div class="field-selection right-checkbox-group">
                          <v-checkbox
                            v-model="isShowDepartmentFilter"
                            :label="$t('setting.department')"
                            class="margin-right-sm text-box"
                          />
                          <v-checkbox
                            v-model="isShowRoleFilter"
                            :label="$t('form.role')"
                            class="text-box"
                          />
                          <v-checkbox
                            v-model="isShowProjectFilter"
                            label="Project"
                            class="text-box"
                          />
                        </div>
                      </b-col>
                    </b-row>
                  </div>
                  <div class="panel-footer text-right">
                    <!--                  <a type="button" class="btn btn-default" @click="addNewGoal"> New goal</a>-->
                  </div>
                </div>
              </template>

              <template v-slot:header="{ props: { headers } }">
                <h4 class="table-name">
                  Absences
                </h4>
              </template>

              <template v-slot:item.user_added="{ item }">
                {{ item.user_added.first_name }} {{ item.user_added.last_name }}
              </template>

              <template v-slot:item.status="{ item }">
                {{ formatStatus(item.status) }}
              </template>

<!--              <template v-slot:item.status="{ item }">-->
<!--                <p v-if="item.status === 1">New<p/>-->
<!--                <p v-if="item.status === 2">Processing<p/>-->
<!--                <p v-if="item.status === 3">Closed<p/>-->
<!--                <p v-if="item.status === 4">Declined<p/>-->
<!--              </template>-->

              <template v-slot:item.created_at="{ item }">
                {{ moment(item.created_at).format('DD.MM.YYYY') }}
              </template>
              <template v-slot:no-data>
                No data
              </template>
            </v-data-table>
          </v-container>
        </b-tab>
      </keep-alive>
    </b-tabs>

    <v-dialog v-model="dialog" max-width="800px" persistent>
      <v-card>
        <v-card-text>
          <div class="title-model">
            {{ formTitle }}
          </div>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <b-row>
              <b-col cols="6">
                <div class="input-wrap">
                  <v-select
                    v-model="chooseAbsenceReason"
                    :items="listAbsenceReasonArray"
                    item-text="type"
                    item-value="id"
                    label="Type"
                    :rules="required"
                    outlined
                    :disabled="editedIndex > -1"
                    @change="updateCheckValidApplyTime"
                  />
                </div>
              </b-col>
              <b-col v-if="editedIndex === -1" cols="6">
                <div class="input-wrap">
                  <v-text-field
                    v-if="editedItem.absence_reason_id !== ''"
                    label="Remaining time"
                    :rules="required"
                    outlined
                    disabled
                    :value="editedItem.class_of_absence === 'interval' ? editedItem.remaining_interval_absence + ' interval(s)' : editedItem.class_of_absence === 'day' ? editedItem.remaining_days_off + ' day(s) left' : ''"
                  />
                  <v-text-field
                    v-else
                    label="Remaining time"
                    :rules="required"
                    outlined
                    disabled
                    value="0"
                  />
                </div>
              </b-col>
            </b-row>
            <div v-if="editedItem.absence_reason_id">
              <div v-if="checkValidApplyTime">
                <b-row>
                  <b-col v-if="editedIndex === -1" cols="12">
                    <date-range-picker
                      ref="picker"
                      :opens="opens"
                      :locale-data="localData"
                      :minDate="minDate"
                      :maxDate="maxDate"
                      :singleDatePicker="singleDatePicker"
                      :timePicker="timePicker"
                      :timePicker24Hour="timePicker24Hour"
                      :showWeekNumbers="showWeekNumbers"
                      :showDropdowns="showDropdowns"
                      :autoApply="autoApply"
                      :ranges="ranges"
                      v-model="dateRange"
                      :linkedCalendars="linkedCalendars"
                      :alwaysShowCalendars="alwaysShowCalendars"
                      :rules="required"
                      class="range-picker-custom absence-duration"
                      @update="chooseDuration"
                    >
                      <template v-slot:input="picker">
                        <div v-if="picker.startDate && checkValidDuration">
                          {{ moment(picker.startDate).format('DD/MM/YY hh:mm A') }} - {{ moment(picker.endDate).format('DD/MM/YY hh:mm A') }}
                        </div>
                        <div v-else>Start time - End time</div>
                      </template>
                    </date-range-picker>
                    <div v-if="!checkValidDuration" class="red--text small">Duration in excess of the remaining days off</div>
                  </b-col>
                  <b-col v-else cols="12">
                    <div class="input-wrap">
                      <v-text-field
                        label="Duration"
                        outlined
                        disabled
                        :value="editedItem.start_time + ' - ' + editedItem.end_time"
                      />
                    </div>
                  </b-col>
                  <!--                          <b-col cols="6">-->
                  <!--                            <div class="input-wrap">-->
                  <!--                              <v-checkbox-->
                  <!--                                v-model="editedItem.type_of_attachment"-->
                  <!--                                label="Add a new attachment"-->
                  <!--                                class="margin-right-sm mt-0"-->
                  <!--                                :disabled="editedIndex > -1"-->
                  <!--                              />-->
                  <!--                            </div>-->
                  <!--                          </b-col>-->
                  <b-col cols="4">
                    <div class="input-wrap">
                      <div class="goal-type-wrap document-type-wrap">
                        <label class="left-text">{{ $t('form.note') }}</label>
                        <v-switch
                          v-model="editedItem.type_of_attachment"
                          :label="$t('form.attachment')"
                          class="right-text"
                          :disabled="editedIndex > -1"
                        />
                      </div>
                    </div>
                  </b-col>
                </b-row>
                <b-row v-if="editedItem.type_of_attachment" align-h="center" class="upload-document upload-deviation-image">
                  <b-col v-if="!previewUrl && editedIndex === -1" cols="5">
                    <div class="input-wrap upload-field">
                      <v-file-input
                        :accept="file_accept"
                        :rules="required"
                        @change="previewImage"
                      />
                    </div>
                  </b-col>
                  <b-col v-if="previewUrl" cols="5">
                    <div class="logo-wrapper text-center">
                      <img v-bind:src="previewUrl" alt="image-absences-reason">
                    </div>
                    <div v-if="editedIndex > -1" class="download-item mt-3">
                      You can download file
                      <span @click="getFile(editedItem.attachment)">here</span>
                    </div>
                  </b-col>
                </b-row>
                <div class="section-connect-to mb-5">
                  <b-row>
                    <b-col>
                      <div class="section-connect-to-label">Connect to</div>
                      <div class="inline-row section-connect-to-checkbox">
                        <v-checkbox
                          v-model="connectProject"
                          label="Project"
                          :disabled="editedIndex > -1"
                        />
                      </div>
                    </b-col>
                  </b-row>
                  <b-row v-if="connectProject">
                    <b-col cols="2">
                      <div class="department-title-with-new">
                        Project
                      </div>
                    </b-col>
                    <b-col cols="6">
                      <v-select
                        v-model="editedItem.project_id"
                        item-value="id"
                        item-text="name"
                        :items="projectArray"
                        :rules="required"
                        outlined
                        :disabled="editedIndex > -1"
                      />
                    </b-col>
                  </b-row>
                </div>
                <b-row class="section-description">
                  <b-col>
<!--                    <v-icon class="icon-question">far fa-question-circle</v-icon>-->
                    <div class="input-wrap form-description">
                      <vue-editor v-model="editedItem.description" :disabled="editedIndex > -1" />
                    </div>
                  </b-col>
                </b-row>
                <div class="section-connect-to mb-5">
                  <b-row>
                    <b-col>
                      <div class="section-connect-to-label">Choose processor</div>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col v-if="editedIndex > -1" cols="6">
                      <MultipleSelection
                        :list-option-input="employeesArray"
                        :item-text="'name'"
                        :item-value="'id'"
                        :label="'Employees'"
                        :selected-items-input="selectedItems"
                        :request-disabled="true"
                        @getSelectedItems="getSelectedItems"
                      />
                    </b-col>
                    <b-col v-else cols="6">
                      <MultipleSelection
                        :list-option-input="employeesValidArray"
                        :item-text="'name'"
                        :item-value="'id'"
                        :label="'Employees'"
                        :selected-items-input="selectedItems"
                        :request-required="true"
                        @getSelectedItems="getSelectedItems"
                      />
                    </b-col>
                  </b-row>
                </div>
              </div>
              <div v-else class="red--text mb-3">You are not eligible to apply this policy</div>
            </div>
            <div v-if="editedIndex > -1" class="manage-task">
              <div class="title-manage-task mb-5">
                PROCESS THE ABSENCE
              </div>
              <div class="section-connect-to mb-5">
                <b-row>
                  <b-col>
                    <div class="section-connect-to-label">Confirmation</div>
                  </b-col>
                </b-row>
                <div class="input-wrap">
                  <v-radio-group
                    v-model="confirmation"
                    :rules="required"
                    row
                    :disabled="editedItem.absenceRole !== 'processor' || editedItem.denyEdit"
                  >
                    <v-radio label="Approve" value="approve" />
                    <v-radio label="Reject" value="reject" />
                  </v-radio-group>
                </div>
              </div>
              <div v-if="confirmation === 'approve'" class="section-connect-to mb-5">
                <b-row>
                  <b-col>
                    <div class="section-connect-to-label">Payment</div>
                  </b-col>
                </b-row>
                <div class="input-wrap">
                  <v-radio-group
                    v-model="payment"
                    :rules="required"
                    row
                    :disabled="editedItem.absenceRole !== 'processor' || editedItem.denyEdit">
                    <v-radio label="Pay" value="pay" />
                    <v-radio label="Unpay" value="unpay" />
                  </v-radio-group>
                </div>
              </div>
              <div v-else-if="confirmation === 'reject'" class="section-connect-to mb-5">
                <b-row>
                  <b-col>
                    <div class="section-connect-to-label">Note</div>
                  </b-col>
                </b-row>
                <div class="input-wrap">
                  <v-textarea
                    v-model="editedItem.reject_reason"
                    auto-grow
                    rows="3"
                    outlined
                    label="Reason for refusal"
                    :disabled="editedItem.absenceRole !== 'processor' || editedItem.denyEdit"
                  />
                </div>
              </div>
              <div v-if="(confirmation === 'reject' && (editedItem.status === 3 || editedItem.absence_reason_id_added_by_admin))" class="section-connect-to pb-5 mb-5">
                <b-row>
                  <b-col>
                    <div class="section-connect-to-label">Change absence reason</div>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col cols="6">
                    <div class="input-wrap">
                      <v-select
                        v-model="editedItem.absence_reason_id_added_by_admin "
                        :items="listIllegalAbsenceReasonArray"
                        item-text="type"
                        item-value="id"
                        label="Type"
                        :rules="required"
                        outlined
                        @change="updateCheckValidReasonAlt"
                        :disabled="editedItem.absenceRole !== 'processor' || editedItem.denyEdit"
                      />
                    </div>
                  </b-col>
                </b-row>
                <div v-if="!checkValidAltApplyTime" class="red--text mb-3">User are not eligible to apply this policy</div>
              </div>
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="btn-cancel" text @click="close">
            Cancel
          </v-btn>
          <v-btn v-if="editedItem.absence_reason_id && checkValidApplyTime && (checkValidDuration && editedItem.duration_time) && checkValidAltApplyTime" class="btn-save" @click="save">
            Save
          </v-btn>

          <!--                  <v-btn v-if="editedIndex > -1" class="hse-btn-delete" text @click="dialogDelete = true">-->
          <!--                    <v-icon dark>-->
          <!--                      mdi-delete-->
          <!--                    </v-icon>-->
          <!--                  </v-btn>-->
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card class="dialog-delete">
        <v-card-text>
          <div class="text-center confirm-delete-title">
            Confirm delete
          </div>
          <div class="confirm-delete-text">
            Are you sure you want to delete this item?
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="btn-cancel" text @click="closeDelete">
            Cancel
          </v-btn>
          <v-btn class="btn-save" @click="deleteItem(editedItem)">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>
<script>
import {_} from 'vue-underscore';
import moment from 'moment';
import cookies from 'js-cookie';
import TitleCaption from "../../../components/TitleCaption";
import {downloadFile} from "../../../utils/downloadFile";
import axios from "axios";
import MultipleSelection from "../../../components/MultipleSelection";

export default {
  components: {
    TitleCaption,
    MultipleSelection
  },

  data: () => ({
    userRoleId: parseInt(cookies.get('roleID')),
    userDepartmentId: parseInt(cookies.get('userDepartmentId')),
    checkAdmin: cookies.get('checkAdmin'),
    roleUser: cookies.get('roleUser'),
    permissionsUser: localStorage.getItem('permissionsKey'),
    userID: parseInt(cookies.get('userID')),
    pageKey: 'employees-absences-absences',
    pageKeyResource: 'employees-absences-absences-setting',
    search: '',
    dialog: false,
    dialogSetting: false,
    valid: true,
    user: 'All',
    reason: {name :"All"},
    company: {name :"All"},
    status: 0,
    statusArray: [
      {
        value : 1,
        name : 'New'
      },
      {
        value : 2,
        name : 'Processing'
      },
      {
        value : 3,
        name : 'Approved'
      },
      {
        value : 4,
        name : 'Reject'
      }
    ],
    statusSelection: [
      {
        value : 0,
        name : 'All'
      },
      {
        value : 1,
        name : 'New'
      },
      {
        value : 2,
        name : 'Processing'
      },
      {
        value : 3,
        name : 'Approved'
      },
      {
        value : 4,
        name : 'Reject'
      }
    ],
    headers: [
      { text: 'Date', value: 'created_at', align: 'left' },
      { text: 'Name', value: 'user_added', align: 'left' },
      { text: 'Reason', value: 'reason.type', align: 'left' },
      { text: 'Status', value: 'status', align: 'left' },
      { text: 'Period (count of days)', value: 'duration_time', align: 'left' },
    ],
    headersSetting: [
      { text: 'Type', value: 'type', align: 'left', width: '60%' },
      { text: 'Updated at', value: 'updated_at', align: 'left' },
    ],
    listArray: [],
    listAbsenceReasonArray: [],
    listIllegalAbsenceReasonArray: [],
    editedIndex: -1,
    editedItem: {
      absence_reason_id: '',
      class_of_absence: '',
      duration_time: '',
      start_time: '',
      end_time: '',
      attachments: '',
      description: '',
      type_of_attachment: false,
      status: 1,
      project_id: '',
      // department_id: '',
      // role_id: '',
      used_interval_absence: null,
      remaining_interval_absence: null,
      days_per_interval: 0,
      used_days_off: 0,
      remaining_days_off: 0,
      apply_time_number: 0,
      apply_time_unit: '',
      illegal: false,
      sick_child: false,
      max_days_off: 0,
      addNewAbsence: true,
      absence_reason_id_added_by_admin: '',
      denyEdit: false,
      processor: [],
      absenceRole: '',
      reject_reason: '',
    },
    defaultItem: {
      absence_reason_id: '',
      class_of_absence: '',
      duration_time: '',
      start_time: '',
      end_time: '',
      attachments: '',
      description: '',
      type_of_attachment: false,
      status: 1,
      project_id: '',
      // department_id: '',
      // role_id: '',
      used_interval_absence: null,
      remaining_interval_absence: null,
      days_per_interval: 0,
      used_days_off: 0,
      remaining_days_off: 0,
      apply_time_number: 0,
      apply_time_unit: '',
      illegal: false,
      sick_child: false,
      max_days_off: 0,
      addNewAbsence: true,
      absence_reason_id_added_by_admin: '',
      denyEdit: false,
      processor: [],
      absenceRole: '',
      reject_reason: '',
    },
    reasonAltItem: {
      absence_reason_id: '',
      class_of_absence: '',
      used_days_off: 0,
      remaining_days_off: 0,
      apply_time_number: 0,
      apply_time_unit: '',
      illegal: false,
      addNewAbsence: true,
    },
    reasonAltItemDefault: {
      absence_reason_id: '',
      class_of_absence: '',
      used_days_off: 0,
      remaining_days_off: 0,
      apply_time_number: 0,
      apply_time_unit: '',
      illegal: false,
      addNewAbsence: true,
    },
    required: [
      v => {
        if (!v || v.length < 1)
          return 'This is required';
        else return true;
      }
    ],
    absenceReasons: [],
    typeReasonsSelection: [],
    typeReasonsDefault:
    {
      id : 0,
      type: "All"
    },
    typeReasonsAltDefault:
      {
        id : '',
        type: ""
      },
    typeReason: 0,
    timeUnitArray: [
      {
        value: 'day',
        name: 'Day(s)'
      },
      {
        value : 'week',
        name: 'Week(s)'
      },
      {
        value : 'month',
        name: 'Month(s)'
      },
      {
        value : 'year',
        name: 'Year(s)'
      }
    ],
    dialogDelete: false,
    tabIndex: 0,
    processing: {
      new: 0,
      processing: 0,
      approved: 0,
      reject: 0
    },
    addNewSickChildOptionStatus: false,
    //date time picker
    opens: 'right',
    minDate: moment(),
    maxDate: '',
    singleDatePicker: false,
    timePicker: true,
    timePicker24Hour: true,
    showWeekNumbers: false,
    showDropdowns: "",
    autoApply: false,
    ranges: false,
    dateTest: new Date(),
    dateRange: {
      startDate: false,
      endDate: false
    },
    linkedCalendars: "",
    alwaysShowCalendars: '',
    localData: {
      monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      firstDay: 0
    },
    user_active_date: '',
    added_by_active_date: '',
    checkValidApplyTime: false,
    checkValidDuration: true,
    checkValidAltApplyTime: true,
    document_type: 'report', // document type: reported attachments
    document_added_from: 8, // 8. absence
    file_accept: "image/png, image/jpeg, image/jpg, image/gif",
    confirmation: '',
    payment: '',
    previewUrl: null, // upload picture
    itemsAmount: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    itemsAmountOfDays: [
      {value: 0, name: '0'},
      {value: 1, name: '1 day'},
      {value: 2, name: '2 days'},
      {value: 3, name: '3 days'},
      {value: 4, name: '4 days'},
      {value: 5, name: '5 days'},
      {value: 6, name: '6 days'},
      {value: 7, name: '7 days'},
      {value: 8, name: '8 days'},
      {value: 9, name: '9 days'},
      {value: 10, name: '10 days'},
      {value: 11, name: '11 days'},
      {value: 12, name: '12 days'},
      {value: 13, name: '13 days'},
      {value: 14, name: '14 days'},
      {value: 15, name: '15 days'},
      {value: 16, name: '16 days'},
      {value: 17, name: '17 days'},
      {value: 18, name: '18 days'},
      {value: 19, name: '19 days'},
      {value: 20, name: '20 days'},
    ],

    // Setting - checkbox filter
    isShowDepartmentFilter: false,
    isShowRoleFilter: false,
    isShowProjectFilter: false,
    department: 0,
    role: 0,
    project: 0,
    departmentsSelection: [],
    roleSelection: [],
    projectSelection: [],
    departmentDefault: {
      id: 0,
      name: "All"
    },
    roleDefault: {
      id: 0,
      name: "All"
    },
    projectDefault: {
      id: 0,
      name: "All"
    },
    connectProject: false,
    projectArray: [],
    added_by: 0,
    usersSelection: [],
    userDefault: {
      id: 0,
      name: "All",
    },
    absence_info: [],
    added_by_absence_info: [],
    new_absence_info: {
      absence_reason_id: '',
      class_of_absence: '',
      used_interval_absence: 0,
      pending_interval_absence: 0,
      used_illegal_interval_absence: 0,
      pending_illegal_interval_absence: 0,
      used_days_off: 0,
      pending_days_off: 0,
      used_illegal_days_off: 0,
      pending_illegal_days_off: 0,
    },
    new_absence_info_default: {
      absence_reason_id: '',
      class_of_absence: '',
      used_interval_absence: 0,
      pending_interval_absence: 0,
      used_illegal_interval_absence: 0,
      pending_illegal_interval_absence: 0,
      used_days_off: 0,
      pending_days_off: 0,
      used_illegal_days_off: 0,
      pending_illegal_days_off: 0,
    },
    chooseAbsenceReason: 0,
    selectedItems: [],
    employeesValidArray: [],
    employeesArray: [],
    userInfo: [],
  }),

  computed: {
    filteredItems() {
      let that = this;
      return this.listArray.filter((item) => {
        return ((that.project === 0 || (item.project_id === that.project))
          && (that.typeReason === 0 || (item.absence_reason_id === that.typeReason))
          && (that.added_by === 0 || (item.added_by === that.added_by))
          && (that.department === 0 || (item.department_id === that.department))
          && (that.role === 0 || (item.role_id === that.role))
          && (!that.dateRange.startDate || (that.dateRange.startDate && that.moment(that.dateRange.startDate)
            <= that.moment(item.updated_at))  && (!that.dateRange.endDate || (that.dateRange.endDate && that.moment(that.dateRange.endDate) >= that.moment(item.updated_at))))
          && (that.status === 0 || (item.status === that.status))
        );
      });
    },
    formTitle() {
      return this.editedIndex === -1 ? 'New Absence' : 'Edit Absence';
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  mounted() {
    var that = this;
    that.$nextTick(() => {
      that.$nuxt.$loading.start();
      that.$store.dispatch('employees/index').then(result => {
        that.employeesArray = result.data;
        that.usersSelection = _.clone(result.data);
        that.usersSelection.push(that.userDefault);
        that.usersSelection.sort(function (a, b) {
          return (a.id - b.id);
        });
      }).catch((error) => {
        that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });

      that.$store.dispatch('absenceReasons/index').then(result => {
        that.listAbsenceReasonArray = result.data;
        that.listIllegalAbsenceReasonArray =_.clone( result.data);
        that.listIllegalAbsenceReasonArray = _.filter(that.listIllegalAbsenceReasonArray, function (item) {
          return item.illegal === 1;
        });
        that.listIllegalAbsenceReasonArray.push(that.typeReasonsAltDefault);
        that.listIllegalAbsenceReasonArray.sort(function (a, b) {
          return (a.id - b.id);
        });
        that.typeReasonsSelection =_.clone( result.data);
        that.typeReasonsSelection.push(that.typeReasonsDefault);
        that.typeReasonsSelection.sort(function (a, b) {
          return (a.id - b.id);
        });
        that.$nuxt.$loading.finish();
      }).catch((error) => {
        that.$toaster.error(error.message || error.status);
      });

      // list absences
      that.$store.dispatch('absences/index').then(result => {
        that.listArray = _.filter(result.data, function (item) {
          return item.status < 6;
        });
        that.listArray = _.each(that.listArray, function (absence) {
          var userInfo = _.findWhere(that.usersSelection, {id: absence.added_by});
          if (userInfo !== undefined) {
            absence.department_id = userInfo.department_id;
            absence.role_id = userInfo.role_id;
          }
        });
        that.processing = {
          new: _.filter(that.listArray, function (item) {
            return item.status === 1;
          }).length,
          processing: _.filter(that.listArray, function (item) {
            return item.status === 2;
          }).length,
          approved: _.filter(that.listArray, function (item) {
            return item.status === 3;
          }).length,
          reject: _.filter(that.listArray, function (item) {
            return item.status === 4 || item.status === 5;
          }).length,
        };
        that.templates = _.filter(result.data, function (item) {
          return item.is_template;
        });
        // _.each(that.listArray, function(item){
        //   var a = new Date(moment(item.from).format('M/D/YYYY'));
        //   var b = new Date(moment(item.to).format('M/D/YYYY'));
        //   var diffTime = Math.abs(b - a);
        //   if(diffTime){
        //    item.period = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        //   }
        // });
        that.$nuxt.$loading.finish();
      }).catch((error) => {
        that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });

      // list departments
      that.$store.dispatch('departments/index').then(result => {
        that.departmentsSelection = result.data;
        that.departmentsSelection.push(that.departmentDefault);
        that.departmentsSelection.sort(function (a, b) {
          return (a.id - b.id);
        });
      }).catch((error) => {
        that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });

      // list project
      that.$store.dispatch('projects/index').then(result => {
        that.projectArray = result.data;
        that.projectSelection = _.clone(result.data);
        that.projectSelection.push(that.projectDefault);
        that.projectSelection.sort(function (a, b) {
          return (a.id - b.id);
        });
      }).catch((error) => {
        that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });

      // get remaining time
      that.$store.dispatch('employees/show', that.userID).then(result => {
        if (result.data) {
          that.userInfo = result.data;
          that.user_active_date = that.userInfo.active_date;
          that.absence_info = JSON.parse(that.userInfo.absence_info);

          // list role
          that.$store.dispatch('roles/index').then(result => {
            that.userInfo.role_level = _.findWhere(result.data, {id: that.userInfo.role_id}).level;
            that.roleSelection = result.data;
            that.roleSelection.push(that.roleDefault);
            that.roleSelection.sort(function (a, b) {
              return (a.id - b.id);
            });
          }).catch((error) => {
            that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish();
          });
        }
      }).catch((error) => {
        that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });

      // list absenceReasons
      that.$store.dispatch('absenceReasons/index').then(result => {
        that.listAbsenceReasonArray = result.data;
      }).catch((error) => {
        that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });
    });
  },

  methods: {
    getSelectedItems(value) {
      this.selectedItems = value.selectedItemsOutput;
    },

    getFile(item){
      let filenameArray = item.uri.split('/').slice();
      let filename = filenameArray.slice(filenameArray.length - 1);
      downloadFile(item.url, filename);
    },

    chooseDuration() {
      var start_time = moment(this.dateRange.startDate);
      var end_time = moment(this.dateRange.endDate);
      var duration_time = end_time.diff(start_time, 'days');
      var start_hour = this.dateRange.startDate.getHours();
      var end_hour = this.dateRange.endDate.getHours();

      if (duration_time > 0){
        if (start_hour < 13) {
          if (end_hour <= 13) {
            duration_time = duration_time + 0.5;
          } else {
            duration_time = duration_time + 1;
          }
        } else {
          if (end_hour <= 13) {
            duration_time = duration_time + 1;
          } else {
            duration_time = duration_time + 0.5;
          }
        }
      } else {
        if (start_hour < 13) {
          if (end_hour <= 13) {
            duration_time = duration_time + 0.5;
          } else {
            duration_time = duration_time + 1;
          }
        } else {
          if (end_hour > 13) {
            duration_time = duration_time + 0.5;
          } else {
            duration_time = duration_time + 1;
          }
        }
      }

      // console.log(duration_time);
      // console.log(start_time);
      // console.log(end_time);

      if ((this.editedItem.class_of_absence === 'interval' && this.editedItem.remaining_interval_absence > 0 && duration_time <= this.editedItem.days_per_interval)
        || (this.editedItem.class_of_absence === 'day' && duration_time <= this.editedItem.remaining_days_off)) {
        this.checkValidDuration = true;
        this.editedItem.duration_time = duration_time;
        this.editedItem.start_time = start_time.format('YYYY-MM-DD HH:MM:SS');
        this.editedItem.end_time = end_time.format('YYYY-MM-DD HH:MM:SS');
      } else {
        this.checkValidDuration = false;
        this.dateRange.startDate = false;
        this.dateRange.endDate = false;
      }
    },

    updateCheckValidApplyTime() {
      var that = this;
      that.$nuxt.$loading.start();

      that.editedItem = Object.assign({}, that.defaultItem);

      that.editedItem.absence_reason_id = that.chooseAbsenceReason;

      //get absence reason info
      _.each(that.listAbsenceReasonArray, function (item) {
        if (that.editedItem.absence_reason_id === item.id) {
          that.editedItem.apply_time_number = item.apply_time_number ? item.apply_time_number : 0;
          that.editedItem.apply_time_unit = item.apply_time_unit ? item.apply_time_unit : 'day';
          that.editedItem.class_of_absence = item.class_of_absence;
          that.editedItem.illegal = item.illegal;
          that.editedItem.sick_child = item.sick_child;
          if (item.deadline_registration_number) {
            that.minDate = moment().add(item.deadline_registration_number, item.deadline_registration_unit + 's');
          } else {
            that.minDate = '';
          }

          //get absence info of employee
          _.each(that.absence_info, function (reason) {
            if (reason.absence_reason_id === that.editedItem.absence_reason_id) {
              that.editedItem.max_days_off = reason.max_days_off;
              that.editedItem.addNewAbsence = false;
              if (reason.class_of_absence === 'interval') {
                that.editedItem.used_interval_absence = that.editedItem.illegal ? reason.used_illegal_interval_absence + reason.pending_illegal_interval_absence : reason.used_interval_absence + reason.pending_interval_absence;
              } else if (reason.class_of_absence === 'day') {
                that.editedItem.used_days_off = that.editedItem.illegal ? reason.used_illegal_days_off + reason.pending_illegal_days_off : reason.used_days_off + reason.pending_days_off;
              }
            }
          });

          if (that.editedItem.addNewAbsence) {
            that.new_absence_info = Object.assign({}, that.new_absence_info_default);
            that.new_absence_info.absence_reason_id = item.id;
            that.new_absence_info.class_of_absence = item.class_of_absence;
          }

          if (that.editedItem.class_of_absence === 'interval') {
            that.editedItem.days_per_interval = item.days_off;
            that.editedItem.remaining_interval_absence = item.interval_absence - that.editedItem.used_interval_absence;
            if (that.editedItem.remaining_interval_absence < 0) {
              that.editedItem.remaining_interval_absence = 0;
            }
          } else if (that.editedItem.class_of_absence === 'day') {
            that.editedItem.remaining_days_off = that.editedItem.sick_child ? that.editedItem.max_days_off - that.editedItem.used_days_off : item.days_off - that.editedItem.used_days_off;
            if (that.editedItem.remaining_days_off < 0) {
              that.editedItem.remaining_days_off = 0;
            }
          }

          //get processor
          that.$store.dispatch('employees/indexAbsenceProcessor', that.editedItem.absence_reason_id).then(result => {
            that.employeesValidArray = result.data;
            that.$nuxt.$loading.finish();
          }).catch((error) => {
            that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish();
          });

        }
      });

      var user_valid_apply_time = 0;
      user_valid_apply_time = moment().diff(moment(that.user_active_date).add(that.editedItem.apply_time_number, that.editedItem.apply_time_unit + 's'), 'days');

      that.checkValidApplyTime = user_valid_apply_time > 0;
    },

    updateCheckValidReasonAlt() {
      var that = this;
      if (that.editedItem.absence_reason_id_added_by_admin) {
        that.reasonAltItem = Object.assign({}, that.reasonAltItemDefault);

        that.reasonAltItem.absence_reason_id = that.editedItem.absence_reason_id_added_by_admin;

        //get absence reason info
        _.each(that.listIllegalAbsenceReasonArray, function (item) {
          if (that.reasonAltItem.absence_reason_id === item.id) {
            that.reasonAltItem.apply_time_number = item.apply_time_number ? item.apply_time_number : 0;
            that.reasonAltItem.apply_time_unit = item.apply_time_unit ? item.apply_time_unit : 'day';
            that.reasonAltItem.class_of_absence = item.class_of_absence;
            that.reasonAltItem.illegal = item.illegal;
            if (item.deadline_registration_number) {
              that.minDate = moment().add(item.deadline_registration_number, item.deadline_registration_unit + 's');
            } else {
              that.minDate = '';
            }

            //get absence info of employee
            _.each(that.added_by_absence_info, function (reason) {
              if (reason.absence_reason_id === that.reasonAltItem.absence_reason_id) {
                that.reasonAltItem.addNewAbsence = false;
                if (reason.class_of_absence === 'interval') {
                  that.reasonAltItem.used_interval_absence = reason.used_illegal_interval_absence + reason.pending_illegal_interval_absence;
                } else if (reason.class_of_absence === 'day') {
                  that.reasonAltItem.used_days_off = reason.used_illegal_days_off + reason.pending_illegal_days_off;
                }
              }
            });

            if (that.reasonAltItem.addNewAbsence) {
              that.new_absence_info = Object.assign({}, that.new_absence_info_default);
              that.new_absence_info.absence_reason_id = item.id;
              that.new_absence_info.class_of_absence = item.class_of_absence;
            }

            if (that.reasonAltItem.class_of_absence === 'interval') {
              that.reasonAltItem.days_per_interval = item.days_off;
              that.reasonAltItem.remaining_interval_absence = item.interval_absence - that.reasonAltItem.used_interval_absence;
              if (that.reasonAltItem.remaining_interval_absence < 0) {
                that.reasonAltItem.remaining_interval_absence = 0;
              }
            } else if (that.reasonAltItem.class_of_absence === 'day') {
              that.reasonAltItem.remaining_days_off = item.days_off - that.reasonAltItem.used_days_off;
              if (that.reasonAltItem.remaining_days_off < 0) {
                that.reasonAltItem.remaining_days_off = 0;
              }
            }
          }
        });

        var user_valid_apply_time = 0;
        user_valid_apply_time = moment().diff(moment(that.added_by_active_date).add(that.reasonAltItem.apply_time_number, that.reasonAltItem.apply_time_unit + 's'), 'days');

        that.checkValidAltApplyTime = !(((that.reasonAltItem.class_of_absence === 'interval'
          && (that.reasonAltItem.remaining_interval_absence <= 0 || that.editedItem.duration_time > that.reasonAltItem.days_per_interval))
          || (that.reasonAltItem.class_of_absence === 'day' && that.editedItem.duration_time > that.reasonAltItem.remaining_days_off))
          || user_valid_apply_time <= 0);
      } else {
        that.checkValidAltApplyTime = true;
      }
    },

    addNew() {
      this.reset();
      if (this.tabIndex === 0) {
        // get remaining time
        this.dialog = true;
        this.dialogSetting = false;
      } else {
        this.dialog = false;
        this.dialogSetting = true;
      }
      this.connectProject = false;
    },

    editItem(item) {
      var that = this;
      // if (item.added_by !== this.userID) {
        // that.$store.dispatch('employees/show', item.added_by).then(result => {
        //   if (result.data) {
        //     that.remaining_interval = result.data.remaining_interval;
        //     that.remaining_children_days_off = result.data.remaining_children_days_off;
        //     that.user_active_date = result.data.active_date;
        //   }
        // }).catch((error) => {
        //   that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        //   that.$nuxt.$loading.finish();
        // });
      // }
      this.editedIndex = this.listArray.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.selectedItems = JSON.parse(item.processor);
      if (that.editedItem.added_by !== that.userID) {
        that.$store.dispatch('employees/show', that.editedItem.added_by).then(result => {
          if (result.data) {
            that.added_by_active_date = result.data.active_date;
            that.added_by_absence_info = JSON.parse(result.data.absence_info);
          }
          that.$nuxt.$loading.finish();
        }).catch((error) => {
          that.$toaster.error(error.message || error.status);
        });
      } else {
        that.added_by_active_date = that.user_active_date;
        that.added_by_absence_info = that.absence_info;
      }
      this.chooseAbsenceReason = item.absence_reason_id;
      if (item.attachment && item.attachment.type_of_attachment === 1) {
        this.$nuxt.$loading.start();
        this.editedItem.type_of_attachment = true;
        this.getImageSrc(item.attachment.url);
      }
      if (item.status > 2) {
        if (item.status === 3) {
          this.confirmation = 'approve';
          if (item.is_paid) {
            this.payment = 'pay';
          } else {
            this.payment = 'unpay';
          }
        } else {
          this.confirmation = 'reject';
        }
      } else {
        this.confirmation = '';
        this.payment = '';
      }
      this.checkDenyEdit();
      this.connectProject = !!this.editedItem.project_id;
      this.checkValidApplyTime = true;
      this.dialog = true;
    },

    checkDenyEdit() {
      this.editedItem.denyEdit = this.editedIndex > -1 && this.editedItem.status > 3;
    },

    deleteItem(item) {
      const index = this.listArray.indexOf(item);
      this.listArray.splice(index, 1);
      this.deleteAbsence(item);
      this.dialogDelete = this.dialog = false;
    },

    deleteAbsence(item) {
      this.$store.dispatch('absences/delete', item.id).then(function() {
      }).catch((error) => {
        this.$toaster.error(error.message || error.status);
      });
    },

    close() {
      this.selectedItems = [];
      this.employeesValidArray = [];
      if (this.tabIndex === 0) {
        this.dialog = false;
        this.editedItem = Object.assign({}, this.defaultItem);
      }
      this.reset();
    },

    reset() {
      this.dateRange.startDate = false;
      this.dateRange.endDate = false;
      this.checkValidDuration = true;
      this.checkValidAltApplyTime = true;
      this.previewUrl = null;
      this.$nuxt.$loading.finish();
      setTimeout(() => {
        this.editedIndex = -1;
        this.$refs.form.reset();
        this.$refs.form.resetValidation();
      }, 0);
    },

    previewImage(file) {
      if (file) {
        this.previewUrl = URL.createObjectURL(file);
        this.selectedFile = file;
      } else {
        this.previewUrl = null;
        this.selectedFile = null;
      }
    },

    // show image
    getImageSrc(url){
      let that = this;
      let result;
      axios({
        url: url,
        method: 'GET',
        responseType: 'blob', // important
      }).then((response) => {
        result = window.URL.createObjectURL(new Blob([response.data]));
        that.previewUrl = result;
        that.$nuxt.$loading.finish();
        return result;
      });
    },

    save() {
      var that = this;
      if (that.$refs.form.validate()) {
        that.$nuxt.$loading.start();
        that.editedItem.processor = that.selectedItems;
        if (that.editedIndex > -1) {
          if (that.confirmation === 'approve') {
            that.editedItem.status = 3;
            that.editedItem.is_paid = that.payment === 'pay';
          } else {
            that.editedItem.status = 4;
          }
          if (that.editedItem.absence_reason_id_added_by_admin) {
            if (that.reasonAltItem.addNewAbsence) {
              that.reasonAltItem.new_absence_info = that.new_absence_info;
            }

            that.editedItem.reason_alt = that.reasonAltItem;
          }
          that.$store.dispatch('absences/update', that.editedItem).then(function(){
            that.reloadList();
          }).catch((error) => {
            that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage);
            that.$nuxt.$loading.finish();
          });
        } else {
          if (that.editedItem.addNewAbsence) {
            that.editedItem.new_absence_info = that.new_absence_info;
          }
          if (that.editedItem.type_of_attachment) {
            that.$store.dispatch('absences/store', that.editedItem).then(result => {
              that.saveDocument(result.data);
            }).catch((error) => {
              that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage);
              that.$nuxt.$loading.finish();
            });
          } else {
            that.$store.dispatch('absences/store', that.editedItem).then(function() {
              that.reloadList();
            }).catch((error) => {
              that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage);
              that.$nuxt.$loading.finish();
            });
          }
        }
        that.close();
      }
    },

    saveDocument(absence) {
      var that = this;
      that.$nuxt.$loading.start();
      let formData = new FormData();
      formData.append('file', that.selectedFile);
      formData.append('name', 'Attachment of absence ' + absence.id);
      formData.append('original_file_name', that.selectedFile.name);
      formData.append('type', that.document_type);
      formData.append('added_from', that.document_added_from);
      formData.append('type_of_attachment',  1);
      formData.append('absence_id', absence.id);
      that.$store.dispatch('absences/storeDocument', formData).then(function () {
        that.reloadList();
      }).catch(error => {
        if (error.response && error.response.data) {
          that.$toaster.error(error.response.data.message || error.response.data.errors);
          that.$nuxt.$loading.finish();
        }
      });
    },

    reloadList(){
      let that = this;
      that.$store.dispatch('employees/show', that.userID).then(result => {
        if (result.data) {
          that.userInfo = result.data;
          that.user_active_date = that.userInfo.active_date;
          that.absence_info = JSON.parse(that.userInfo.absence_info);
        }
        that.$nuxt.$loading.finish();
      }).catch((error) => {
        that.$toaster.error(error.message || error.status);
      });
      // get list
      that.$store.dispatch('absences/index').then(result => {
        that.listArray = _.filter(result.data, function (item) {
          return item.status < 6;
        });
        that.listArray = _.filter(that.listArray, function (item) {
          return !item.is_template;
        });
        that.processing = {
          new: _.filter(that.listArray, function(item){
            return item.status === 1;
          }).length,
          processing: _.filter(that.listArray, function(item){
            return item.status === 2;
          }).length,
          approved: _.filter(that.listArray, function(item){
            return item.status === 3;
          }).length,
          reject: _.filter(that.listArray, function(item){
            return item.status === 4 || item.status === 5;
          }).length,
        };
        that.templates = _.filter(result.data, function (item) {
          return item.is_template;
        });
      }).catch((error) => {
        that.$toaster.error(error.message || error.status);
        that.$nuxt.$loading.finish();
      });

      // list absenceReasons
      that.$store.dispatch('absenceReasons/index').then(result => {
        that.listAbsenceReasonArray = result.data;
      }).catch((error) => {
        that.$toaster.error(error.message || error.status);
      });
    },

    formatDate (date) {
      if (!date) return null;
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
      },

    formatStatus(status) {
      if (status === 1) {
        return "New";
      } else if (status === 2) {
        return "Processing";
      } else if (status === 3) {
        return "Approved";
      } else if (status === 4) {
        return "Rejected";
      } else if (status === 5) {
        return "Rejected & changed reason";
      } else {
        return "Added by admin";
      }

    },

    addMoreActivity() {
      this.newActivity.id = this.activityArray.length + 1;
      this.activityArray.push(this.newActivity);
      this.newActivity = Object.assign({}, this.defaultActivity);
    },

    // checkNewReason(item) {
    //   if(item === "New reason") {
    //     this.createReason = true;
    //   }else{
    //     this.createReason = false;
    //   }
    // },

    // dialog DELETE
    closeDelete() {
      this.dialogDelete = false;
    },

  }
};
</script>

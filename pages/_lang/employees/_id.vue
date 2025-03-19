<template>
  <div class="employees-page">
    <div class="name-page">
      {{ $t('title.employee_information') }}
      <v-alert
        v-if="employeeInfo.disable_status"
        dense
        outlined
        type="warning"
        class="mb-0 mt-5"
      >
        This employee has been disabled
      </v-alert>
    </div>
    <v-btn
      v-if="employeeInfo.disable_status === 0 && !checkAdmin"
      depressed
      color="error"
      class="mb-5 btn-disable"
      @click="deleteEmployee"
    >
      Disable employee
    </v-btn>
    <v-container>
      <v-row>
        <v-col cols="12" sm="5">
          <v-card width="100%">
            <div class="text-left box-title">
              {{ $t('title.employee') }}
            </div>
            <v-container>
              <v-row justify="space-around" class="pb-7">
                <div class="logo-wrapper" @click="showAttachment">
                  <i v-if="!previewUrl" :src="previewUrl"></i>
                  <img v-if="previewUrl" :src="previewUrl" alt="avatar">
                </div>
              </v-row>
              <div>
                <b-row class="sm-padding-row">
                  <b-col cols="6" class="info-key text-right">{{ $t('title.first_name') }}</b-col>
                  <b-col cols="6" class="input-wrap text-left">{{ employeeInfo.first_name }}</b-col>
                </b-row>
                <b-row class="sm-padding-row">
                  <b-col cols="6" class="info-key text-right">{{ $t('title.last_name') }}</b-col>
                  <b-col cols="6" class="input-wrap text-left">{{ employeeInfo.last_name }}</b-col>
                </b-row>
                <b-row class="sm-padding-row">
                  <b-col cols="6" class="info-key text-right">{{ $t('title.personal_number') }}</b-col>
                  <b-col cols="6" class="input-wrap text-left">{{ employeeInfo.personal_number }}</b-col>
                </b-row>
                <b-row class="sm-padding-row">
                  <b-col cols="6" class="info-key text-right">{{ $t('title.email') }}</b-col>
                  <b-col cols="6" class="input-wrap text-left">{{ employeeInfo.email }}</b-col>
                </b-row>
                <b-row class="sm-padding-row">
                  <b-col cols="6" class="info-key text-right">{{ $t('title.phone_number') }}</b-col>
                  <b-col cols="6" class="input-wrap text-left">{{ employeeInfo.phone_number }}</b-col>
                </b-row>
                <b-row class="sm-padding-row">
                  <b-col cols="6" class="info-key text-right">{{ $t('title.address') }}</b-col>
                  <b-col cols="6" class="input-wrap text-left">
                    <div>{{employeeInfo.address}}</div>
                    <div>{{employeeInfo.city}}</div>
                    <div>{{employeeInfo.zip_code}}</div>
                  </b-col>
                </b-row>
              </div>
              <EmployeePopup
                :open-popup="openProfile"
                :employee-item="employeeInfo"
                :manager-array="listManager"
                :open-profile-popup="true"
                @closePopup="openProfile = !openProfile"
                @reloadList="reloadEmployee"
              />
            </v-container>
            <div class="box-footer">
              <div class="text-right">
                <button
                  v-if="(checkAdmin || permissionsUser.indexOf('employee-basic') > -1) && !employeeInfo.disable_status"
                  class="btn btn-default btn-edit-footer"
                  @click="openProfile = true"
                >
                  {{ $t('button.edit') }}
                </button>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col v-if="!(checkAdmin && userID === user_id)" cols="12" sm="7">
          <!-- card right -->
          <v-card width="100%">
            <div class="text-left box-title">
              {{ $t('title.dependants') }}
            </div>
            <v-container>
              <v-data-table
                :headers="headers"
                :items="filteredItems"
                class="elevation-1 hse-table hse-table-employee"
                :items-per-page="5"
                :single-expand="true"
                :sort-by="['created_at']"
                :sort-desc="[true, false]"
                @click:row="editItem"
              >
                <template v-slot:item.name="{ item }">
                  {{ item.name }}
                  <div v-if="item.is_primary === 1">
                    <v-chip
                      class="mt-2 mb-2"
                      color="primary"
                      outlined
                    >
                      Primary
                    </v-chip>
                  </div>
                </template>
                <template v-slot:item.dob="{ item }">
                  {{ formatDate(item.dob) }}
                </template>
                <template v-slot:no-data>
                  {{ $t('table.no_data') }}
                </template>
              </v-data-table>
            </v-container>
            <div class="box-footer">
              <div class="text-right">
                <button
                  v-if="(checkAdmin || permissionsUser.indexOf('employee-basic') > -1) && !employeeInfo.disable_status"
                  class="btn btn-default btn-edit-footer"
                  @click="btnCreate"
                >
                  {{ $t('button.add_dependant') }}
                </button>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col v-if="!(checkAdmin && userID === user_id)" cols="12" sm="5">
          <v-card width="100%">
            <div class="text-left box-title">
              {{ $t('title.employment') }}
            </div>
            <v-container>
              <div>
                <b-row class="sm-padding-row">
                  <b-col cols="6" class="info-key text-right">{{ $t('title.role') }}</b-col>
                  <b-col v-if="roleName" cols="6" class="input-wrap text-left">{{ roleName }}</b-col>
                </b-row>
                <b-row class="sm-padding-row">
                  <b-col cols="6" class="info-key text-right">{{ $t('title.department') }}</b-col>
                  <b-col v-if="employeeInfo.department_name" cols="6" class="input-wrap text-left">{{ employeeInfo.department_name }}</b-col>
                </b-row>
                <b-row class="sm-padding-row">
                  <b-col cols="6" class="info-key text-right">{{ $t('title.job_title') }}</b-col>
                  <b-col cols="6" class="input-wrap text-left">{{ employeeInfo.job_title_name }}</b-col>
                </b-row>
                <b-row class="sm-padding-row">
                  <b-col cols="6" class="info-key text-right">{{ $t('title.nearest_manager') }}</b-col>
                  <b-col cols="6" class="input-wrap text-left">{{ employeeInfo.nearestManagerName }}</b-col>
                </b-row>
                <!--                <b-row class="sm-padding-row">-->
                <!--                  <b-col cols="6" class="info-key text-right">Holidays (weeks)</b-col>-->
                <!--                  <b-col cols="6" class="input-wrap text-left">{{ employeeInfo.holidays }}</b-col>-->
                <!--                </b-row>-->
                <b-row class="sm-padding-row">
                  <b-col cols="6" class="info-key text-right">{{ $t('title.date_of_employment') }}</b-col>
                  <b-col v-if="employeeInfo.active_date" cols="6" class="input-wrap text-left">{{ moment(employeeInfo.active_date).format('DD.MM.YYYY') }}</b-col>
                </b-row>
              </div>
              <EmployeePopup
                :open-popup="openEmployment"
                :employee-item="employeeInfo"
                :manager-array="listManager"
                :open-employment-popup="true"
                @closePopup="openEmployment = !openEmployment"
                @reloadList="reloadEmployee"
              />
            </v-container>
            <div class="box-footer">
              <div class="text-right">
                <button
                  v-if="(checkAdmin || permissionsUser.indexOf('employee-basic') > -1) && !employeeInfo.disable_status"
                  class="btn btn-default btn-edit-footer"
                  @click="openEmployment = true"
                >
                  {{ $t('button.edit') }}
                </button>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="7">
          <v-card width="100%">
            <div class="text-left box-title">
              {{ $t('title.attachments') }}
            </div>
            <!--            <v-container>-->
            <!--              <v-data-table :headers="headersAttachment" :items="documents" class="elevation-1 hse-table hse-table-employee" :items-per-page="15"-->
            <!--                            :single-expand="true" :sort-desc="[true]" @click:row="editAttachmentItem"-->
            <!--              >-->
            <!--                <template v-slot:item.description="{ item }">-->
            <!--                  <div v-html="item.description" />-->
            <!--                </template>-->
            <!--                <template v-slot:item.type_of_attachment="{ item }">-->
            <!--                  {{ formatType(item.type_of_attachment) }}-->
            <!--                </template>-->
            <!--                <template v-slot:item.added_by_name="{ item }">-->
            <!--                  {{ item.added_by_first_name }} {{ item.added_by_last_name }}-->
            <!--                </template>-->
            <!--                <template v-slot:no-data>-->
            <!--                  No data-->
            <!--                </template>-->
            <!--              </v-data-table>-->
            <!--            </v-container>-->
            <DocumentPopup
              :open-popup="checkDocumentOpen"
              :resource="false"
              :categories-array="categoriesArray"
              :category-type="category_type"
              :category-added-from="category_added_from"
              :type="document_type"
              :added-from="document_added_from"
              :employee-id="user_id"
              @closePopup="checkDocumentOpen = !checkDocumentOpen"
              @reloadList="reloadDocument"
              @reloadListCategory="reloadListCategory"
            />
            <DocumentTable
              :no-filter-setting="true"
              :list-array-input="documents"
              :categories-array="categoriesArray"
              :category-type="category_type"
              :category-added-from="category_added_from"
              :attachment-item="employeeInfo"
              @reloadList="reloadDocument"
              @reloadListCategory="reloadListCategory"
            />
            <div class="box-footer">
              <div class="text-right">
                <button
                  v-if="(checkAdmin || permissionsUser.indexOf('employee-basic') > -1) && !employeeInfo.disable_status"
                  class="btn btn-default btn-edit-footer"
                  @click="checkDocumentOpen = true"
                >
                  {{ $t('button.add_attachment') }}
                </button>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- NOT need in mvp
      <v-row>
        <v-col cols="12" sm="5">
          <v-card width="100%">
            <div class="text-left box-title">
              Salary
            </div>
            <v-container>
              <div>
                <b-row class="sm-padding-row">
                  <b-col cols="6" class="info-key text-right">Salary</b-col>
                  <b-col cols="6" class="input-wrap text-left">{{ employeeInfo.hourly_salary }}</b-col>
                </b-row>
                <b-row class="sm-padding-row">
                  <b-col cols="6" class="info-key text-right">Overtime pay (%)</b-col>
                  <b-col cols="6" class="input-wrap text-left">{{ employeeInfo.overtime_pay }}</b-col>
                </b-row>
                <b-row class="sm-padding-row">
                  <b-col cols="6" class="info-key text-right">Account number</b-col>
                  <b-col cols="6" class="input-wrap text-left">{{ employeeInfo.account_number }}</b-col>
                </b-row>
                <b-row class="sm-padding-row">
                  <b-col cols="6" class="info-key text-right">Night allowance</b-col>
                  <b-col cols="6" class="input-wrap text-left">{{ employeeInfo.night_allowance }}</b-col>
                </b-row>
                <b-row class="sm-padding-row">
                  <b-col cols="6" class="info-key text-right">Weekend addition</b-col>
                  <b-col cols="6" class="input-wrap text-left">{{ employeeInfo.weekend_addition }}</b-col>
                </b-row>
                <b-row class="sm-padding-row">
                  <b-col cols="6" class="info-key text-right">Evening allowance</b-col>
                  <b-col cols="6" class="input-wrap text-left">{{ employeeInfo.evening_allowance }}</b-col>
                </b-row>
              </div>
              <v-dialog v-model="dialogAdditional" max-width="800px" persistent>
                <v-card>
                  <v-card-text>
                    <div class="title-model">
                      Edit
                    </div>
                    <v-form
                      ref="form"
                      v-model="valid"
                      lazy-validation
                    >
                      <b-row>
                        <b-col cols="6">
                          <div class="input-wrap">
                            <v-text-field v-model="employeeEdit.hourly_salary" label="Salary" type="number" :rules="required" outlined />
                          </div>
                        </b-col>
                        <b-col cols="6">
                          <div class="input-wrap">
                            <v-slider
                              v-model="employeeEdit.overtime_pay"
                              label="Overtime pay (%)"
                              max="250"
                              min="40"
                              :thumb-size="24"
                              thumb-label="always"
                              class="mt-4"
                            />
                          </div>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col cols="6">
                          <div class="input-wrap">
                            <v-text-field v-model="employeeEdit.account_number" label="Account number" outlined />
                          </div>
                        </b-col>
                        <b-col cols="6">
                          <div class="input-wrap">
                            <v-text-field v-model="employeeEdit.night_allowance" label="Night allowance" type="number" outlined />
                          </div>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col cols="6">
                          <div class="input-wrap">
                            <v-text-field v-model="employeeEdit.weekend_addition" label="Weekend addition" type="number" outlined />
                          </div>
                        </b-col>
                        <b-col cols="6">
                          <div class="input-wrap">
                            <v-text-field v-model="employeeEdit.evening_allowance" label="Evening allowance" type="number" outlined />
                          </div>
                        </b-col>
                      </b-row>
                    </v-form>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn class="btn-cancel" text @click="close">
                      Cancel
                    </v-btn>
                    <v-btn class="btn-save" @click="save">
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-container>
            <div v-if="checkAdmin || permissionsUser.indexOf('employee-basic') > -1" class="box-footer">
              <div class="text-right">
                <button class="btn btn-default btn-edit-footer" @click="btnAdditional">
                  Edit
                </button>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
      -->

<!--      <v-row>-->
<!--        <v-col>-->
<!--          <v-card width="100%">-->
<!--            <div class="text-left box-title">-->
<!--              Permissions-->
<!--            </div>-->
<!--            <v-container>-->
<!--              <v-row>-->
<!--                <v-col v-for="item in permissions" :key="item.name" cols="4">-->
<!--                  <v-switch-->
<!--                    v-model="user_permissions"-->
<!--                    :label="item.name"-->
<!--                    :value="item.name"-->
<!--                    @change="changeUserPermissions"-->
<!--                  />-->
<!--                </v-col>-->
<!--                &lt;!&ndash;              <v-switch v-model="permissions" label="Jacob" value="Jacob"></v-switch>&ndash;&gt;-->
<!--              </v-row>-->
<!--            </v-container>-->
<!--          </v-card>-->
<!--        </v-col>-->
<!--      </v-row>-->
    </v-container>

    <!-- dialog Add new relative -->
    <v-dialog v-model="dialogDependant" max-width="800px" persistent>
      <v-card>
        <v-card-text>
          <div class="popup-header text-center">
            {{ formTitle }}
          </div>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <b-row>
              <b-col cols="12">
                <div class="input-wrap">
                  <v-text-field v-model="editedItem.name" :label="$t('form.name')" :rules="required" outlined />
                </div>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="6">
                <div class="input-wrap">
<!--                  <v-menu-->
<!--                    v-if="editedItem.is_primary"-->
<!--                    v-model="menu"-->
<!--                    :close-on-content-click="false"-->
<!--                    min-width="290px"-->
<!--                  >-->
<!--                    <template v-slot:activator="{ on }">-->
<!--                      <v-text-field-->
<!--                        v-model="editedItem.dob"-->
<!--                        outlined-->
<!--                        readonly-->
<!--                        :rules="required"-->
<!--                        label="DOB"-->
<!--                        placeholder="DD/MM/YY"-->
<!--                        v-on="on"-->
<!--                      />-->
<!--                    </template>-->
<!--                    <v-date-picker v-model="editedItem.dob" @input="menu = false">-->
<!--                      <v-spacer />-->
<!--                      <v-btn text @click="editedItem.dob = '', menu = false">-->
<!--                        Clear-->
<!--                      </v-btn>-->
<!--                    </v-date-picker>-->
<!--                  </v-menu>-->
<!--                  <v-menu-->
<!--                    v-else-->
<!--                    v-model="menu"-->
<!--                    :close-on-content-click="false"-->
<!--                    min-width="290px"-->
<!--                  >-->
<!--                    <template v-slot:activator="{ on }">-->
<!--                      <v-text-field-->
<!--                        v-model="editedItem.dob"-->
<!--                        outlined-->
<!--                        readonly-->
<!--                        label="DOB"-->
<!--                        placeholder="DD/MM/YY"-->
<!--                        v-on="on"-->
<!--                      />-->
<!--                    </template>-->
<!--                    <v-date-picker v-model="editedItem.dob" @input="menu = false">-->
<!--                      <v-spacer />-->
<!--                      <v-btn text @click="editedItem.dob = '', menu = false">-->
<!--                        Clear-->
<!--                      </v-btn>-->
<!--                    </v-date-picker>-->
<!--                  </v-menu>-->
                  <DatePicker
                    label="DOB"
                    :item="editedItem"
                    :date-input="editedItem.dob"
                    :use-keyboard="true"
                    :past-date="true"
                    :future-date="false"
                    @getDate="getDOB"
                  />
                </div>
              </b-col>
              <b-col cols="6">
                <div class="input-wrap">
                  <v-select
                    v-model="editedItem.relation"
                    :items="relationStatusArray"
                    label="Relation"
                    :rules="required"
                    outlined
                  />
                </div>
              </b-col>
            </b-row>
            <div v-if="editedItem.relation === 'Children'" class="section-connect-to mb-5 mt-5">
              <b-row>
                <b-col>
                  <div class="section-connect-to-label">More information</div>
                  <div class="inline-row section-connect-to-checkbox">
                    <v-checkbox
                      v-model="editedItem.handicapped"
                      label="Handicapped"
                      class="margin-right-sm"
                    />
                    <v-checkbox
                      v-model="editedItem.alone_custody"
                      label="Custody alone"
                    />
                  </div>
                </b-col>
              </b-row>
            </div>
            <b-row>
              <b-col cols="6">
                <div class="input-wrap">
                  <v-text-field
                    v-if="editedItem.is_primary"
                    v-model="editedItem.email"
                    :label="$t('form.email')"
                    :rules="emailRules"
                    outlined
                  />
                  <v-text-field
                    v-else
                    v-model="editedItem.email"
                    :label="$t('form.email')"
                    :rules="emailRulesNotRequired"
                    outlined
                  />
                </div>
              </b-col>
              <b-col cols="6">
                <div class="input-wrap">
                  <v-text-field
                    v-if="editedItem.is_primary"
                    v-model="phoneNumber"
                    :label="$t('form.phone_number')"
                    :rules="phoneNumberRule"
                    outlined
                    maxlength="10"
                    @keypress="onlyNumber"
                  />
                  <v-text-field
                    v-else
                    v-model="phoneNumber"
                    :label="$t('form.phone_number')"
                    :rules="phoneNumberRuleNotRequired"
                    outlined
                    maxlength="10"
                    @keypress="onlyNumber"
                  />
                </div>
              </b-col>
            </b-row>
            <b-row>
<!--              <b-col cols="6">-->
<!--                <div class="input-wrap">-->
<!--                  <v-text-field v-model="editedItem.work_phone" label="Work phone" type="number" outlined />-->
<!--                </div>-->
<!--              </b-col>-->
            </b-row>
            <b-row>
              <b-col>
                <div>
                  <v-checkbox v-model="editedItem.is_primary" :label="$t('form.is_primary_relative')" />
                </div>
              </b-col>
            </b-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="popup-footer">
          <v-spacer />
          <v-btn class="btn-cancel" text @click="close">
            {{ $t('button.cancel') }}
          </v-btn>
          <v-btn v-if="checkAdmin || permissionsUser.indexOf('employee-basic') > -1" class="btn-save" @click="saveDependant">
            {{ $t('button.save') }}
          </v-btn>
<!--          <v-btn v-else :disabled="permissionsUser.indexOf('update-employee') === -1" class="btn-save" @click="saveDependant">-->
<!--            Save-->
<!--          </v-btn>-->

          <v-btn
            v-if="editedIndex > -1 && (checkAdmin || permissionsUser.indexOf('employee-basic') > -1)"
            class="hse-btn-delete"
            text
            @click="deleteDependant"
          >
            <v-icon dark>
              mdi-delete
            </v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card class="dialog-delete">
        <v-card-text>
          <div class="text-center confirm-delete-title">
            Confirm disable
          </div>
          <div class="confirm-delete-text">
            Are you sure you want to disable this item?
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="btn-cancel" text @click="dialogDelete = false">
            {{ $t('button.no') }}
          </v-btn>
          <v-btn class="btn-save" @click="deleteItem">
            {{ $t('button.yes') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <AttachmentPopup
      :open-attachment-popup="checkAttachmentOpen"
      :attachment-item="employeeInfo"
      :type="document_type"
      :added-from="document_added_from"
      :is-avatar="true"
      @closePopup="checkAttachmentOpen = !checkAttachmentOpen"
      @reloadEmployee="reloadEmployee"
      @reloadList="reloadDocument"
    />
  </div>
</template>
<script>
  import {_} from 'vue-underscore';
  import cookies from 'js-cookie';
  import {downloadFile} from "../../../utils/downloadFile";
  import DocumentTable from "../../../components/DocumentTable";
  import DocumentPopup from "../../../components/DocumentPopup";
  import AttachmentPopup from "../../../components/AttachmentPopup";
  import axios from "axios";
  import EmployeePopup from "../../../components/EmployeePopup";
  import DatePicker from "../../../components/DatePicker";

  export default {
    components: {
      DocumentTable,
      DocumentPopup,
      AttachmentPopup,
      EmployeePopup,
      DatePicker,
    },
    data: () => ({
      baseUrl: cookies.get('baseUrl'),
      userRoleId: parseInt(cookies.get('roleID')),
      userDepartmentID: parseInt(cookies.get('userDepartmentID')),
      checkAdmin: cookies.get('checkAdmin'),
      roleUser: cookies.get('roleUser'),
      userID: cookies.get('userID'),
      permissionsUser: localStorage.getItem('permissionsKey'),
      valid: true,
      employeeInfo: {},
      editedIndex: -1,
      required: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else return true;
        }
      ],
      user_id: "",
      listArray: [],
      roleName: "",
      rolesArray: [],
      relationStatusArray: ['Spouse', 'Children', 'Parent', 'Living together', 'Girl/boy friend', 'Friend'],
      dialogDependant: false,
      editedItem: {
        user_id: '',
        name: '',
        relation: '',
        dob: '',
        handicapped: false,
        alone_custody: false,
        is_primary: false,
      },
      defaultItem: {
        user_id: '',
        name: '',
        relation: '',
        dob: '',
        handicapped: false,
        alone_custody: false,
        is_primary: false,
      },
      phoneNumber: '',
      phoneNumberRule: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else if (!/^(\d{3})+(\s{1})+(\d{2})+(\s{1})+(\d{3})$/.test(v))
            return 'Phone number must be 8 digits';
          else return true;
        }
      ],
      phoneNumberRuleNotRequired: [
        v => {
          if (v && (!/^(\d{3})+(\s{1})+(\d{2})+(\s{1})+(\d{3})$/.test(v)))
            return 'Phone number must be 8 digits';
          else return true;
        }
      ],
      emailRules: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else if (!/.+@.+/.test(v))
            return 'E-mail must be valid';
          else return true;
        }
      ],
      emailRulesNotRequired: [
        v => {
          if (v && (!/.+@.+/.test(v)))
            return 'E-mail must be valid';
          else return true;
        }
      ],

      dialogDelete: false,
      // employee_id: '',
      formDirty: false,
      user_permissions: [],
      permissions: [],
      // valid_permissionsName: [
      //   'ContactPerson',
      //   'EmployeeRelation',
      //   'Company',
      //   'Project',
      //   'Department',
      //   'Category',
      //   'Contact',
      //   'Document',
      //   'Instruction',
      //   'Goal',
      //   'Routine',
      //   'Employee',
      //   'Deviation',
      //   'Checklist',
      // ],
      // categoriesAttachmentArray: [],
      // file_accept: "image/png, image/jpeg, image/jpg, image/gif, application/pdf, application/msword, " +
      //   "application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, " +
      //   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

      // box Attachment
      previewUrl: null, // upload avatar
      document_type: 'attachment',
      document_added_from: 'employee',
      // document_added_from: 4, // document-added_from: 4. employee
      category_id: 9, // Avatar
      attachmentType: false,
      menu: false,
      selectedFile: [],
      documents: [],
      category_type: 'attachment',
      category_added_from: 3, // employee
      // jobTitleValidArray: [],
      categoriesArray: [],

      // open Document / Avatar popup
      checkDocumentOpen: false,
      checkAttachmentOpen: false,

      // open Employee Popup
      openProfile: false,
      openEmployment: false,
      deleteType: '',

      listManager: [],
      dob: '',
    }),

    computed: {
      headers() {
        return [
          {text: this.translateCol('name'), value: 'name', align: 'left'},
          {text: this.translateCol('dob'), value: 'dob', align: 'center'},
          {text: this.translateCol('relation'), value: 'relation', align: 'center'},
        ];
      },
      filteredItems() {
        let that = this;
        return that.listArray.filter((item) => {
          return item;
        });
      },
      formTitle() {
        return this.editedIndex === -1 ? 'New Dependant' : 'Edit Dependant';
      },
    },

    watch: {
      phoneNumber(value) {
        if (value) {
          this.reformatPhoneNumber();
        }
      },
    },

    mounted() {
      let that = this;
      that.user_id = that.$route.params.id;
      that.$nextTick(() => {
        that.$nuxt.$loading.start();
        // show employee info
        that.$store.dispatch('employees/show', that.user_id).then(result => {
          that.employeeInfo = result.data;
          if (!that.employeeInfo.avatar) {
            that.employeeInfo.avatar = that.baseUrl + '/api/v1/image/default_avatar.png';
          }
          that.getImageSrc(that.employeeInfo.avatar);
          that.$nuxt.$loading.finish();
          that.previewUrl = that.employeeInfo.avatar;
          // if (that.employeeInfo.added_by === 1) {
          //   that.employeeInfo.department_id = that.employeeInfo.department_name = null;
          // }

          // list roles
          that.$store.dispatch('employees/indexRole').then(result => {
            that.roleName = _.findWhere(result.data, {id: that.employeeInfo.role_id}).name;
            that.rolesArray = _.clone(result.data);
            that.rolesArray = _.filter(that.rolesArray, function(item) {
              return item.id > 2;
            });
          }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_role_view'));
            }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish();
          });

          // that.permissions = _.uniq(that.employeeInfo.permissions, function(item) {
          //   return item.name;
          // });
          // that.permissions = _.filter(that.permissions, function (item) {
          //   return _.contains(that.valid_permissionsName, item.name);
          // });
          // var groupedByCount = _.countBy(that.employeeInfo.permissions, function (item) {
          //   return item.name;
          // });
          // for (var name in groupedByCount) {
          //   if (groupedByCount[name] > 1) {
          //     that.user_permissions.push(name);
          //   }
          // }
          // that.user_permissions = _.uniq(that.user_permissions);

        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_employee_view_detail'));
          }
          that.$nuxt.$loading.finish();
          // that.$toaster.error(error.message || error.status);
        });
      });

      // list employees
      that.$store.dispatch('employees/index').then(result => {
        // list nearest managers
        _.each(result.data, function(i) {
          if (i.department_name) {
            i.name = i.name + ' - ' + i.department_name;
          }
        });
        that.listManager = _.filter(result.data, function (item) {
          return item.role_id === 2 || item.role_id === 3;
        });
      }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
        // that.$toaster.error(that.$i18n.t('message.fail_employee_view'));
        }
        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });

      // list employee dependants
      that.$store.dispatch('employees/indexRelation', {user_id: that.user_id}).then(result => {
        that.listArray = result.data;
      }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
        that.$toaster.error(that.$i18n.t('message.fail_employee_dependant_view'));
        }
        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });

      // list categories - type "attachment" - added_from "contact"
      that.$store.dispatch('categories/index', {
        type: that.category_type,
        added_from: that.category_added_from
      }).then(result => {
        that.categoriesArray = _.filter(result.data, function(item){
          return item.name !== "Avatar";
        });
      }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
        // that.$toaster.error(that.$i18n.t('message.fail_category_view'));
        }
        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });

      // attachment list
      that.$store.dispatch('documents/index', {
        type: that.document_type,
        object_type: that.document_added_from,
        object_id: that.user_id,
      }).then(result => {
        that.documents = result.data;
        if (that.documents.length > 0) {
          _.each(that.documents, function (item) {
            if (item.description) {
              item.description = item.description.replace(/<[^>]+>/g, '');
            }
          });
        }
      }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
        // that.$toaster.error(that.$i18n.t('message.fail_document_view'));
        }
        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });
    },

    methods: {
      translateCol (colName) {
        return this.$i18n.t('column.' + colName);
      },

      onlyNumber(e) {
        if (!(/\d/i.test(e.key))) {
          e.preventDefault();
        }
      },

      reformatPhoneNumber() {
        let that = this;
        if (that.phoneNumber.length === 3 || that.phoneNumber.length === 6) {
          that.phoneNumber = that.phoneNumber + ' ';
        }
      },

      // show image
      getImageSrc(url) {
        let that = this;
        let result;
        axios({
          url: url,
          method: 'GET',
          responseType: 'blob', // important
        }).then((response) => {
          result = window.URL.createObjectURL(new Blob([response.data]));
          that.previewUrl = result;
          return result;
        });
      },

      formatDate(date) {
        if (!date) return null;
        const [year, month, day] = date.split(' ')[0].split('-');
        return `${day}/${month}/${year}`;
      },

      editItem(item) {
        if (this.checkAdmin || this.permissionsUser.indexOf('employee-basic') > -1) {
          this.editedIndex = this.listArray.findIndex(i => i.id === item.id);
          this.editedItem = Object.assign({}, item);
          this.dialogDependant = true;
          this.phoneNumber = this.editedItem.mobile_phone;
        }
      },

      deleteEmployee() {
        this.dialogDelete = true;
        this.deleteType = 'employee';
      },

      deleteDependant() {
        this.dialogDelete = true;
        this.deleteType = 'dependant';
      },

      deleteItem() {
        this.deleteObject();
        this.dialogDelete = false;
        this.close();
      },

      deleteObject() {
        let that = this;
        if (that.deleteType === 'employee') {
          this.$store.dispatch('employees/delete', that.user_id).then(function() {
            that.reloadEmployee();
            that.$toaster.success(that.$i18n.t('message.success_employee_delete'));
          }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_employee_delete'));
            }
            // this.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          });
        } else if (that.deleteType === 'dependant') {
          this.$store.dispatch('employees/deleteRelation', that.editedItem.id).then(function() {
            that.reloadList();
            that.$toaster.success(that.$i18n.t('message.success_employee_dependant_delete'));
          }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_employee_dependant_delete'));
            }
            // this.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          });
        }
      },

      reset() {
        this.selectedFile = [];
        this.attachmentType = false;
        this.deleteType = '';
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
          // this.$refs.form.reset();
          this.$refs.form.resetValidation();
        }, 0);
      },

      reloadEmployee(){
        let that = this;
        that.$store.dispatch('employees/show', that.user_id).then(result => {
          that.employeeInfo = result.data;
          that.getImageSrc(that.employeeInfo.avatar);
          that.roleName = _.findWhere(that.rolesArray, {id: that.employeeInfo.role_id}).name;
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_employee_view_detail'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      },

      reloadListCategory(){
        let that = this;
        that.$store.dispatch('categories/index', {
          type: that.category_type,
          added_from: that.category_added_from
        }).then(result => {
          that.categoriesArray = _.filter(result.data, function(item){
            return item.name !== "Avatar" && !item.disable_status;
          });
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_category_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      },

      close() {
        this.dialogDependant = false;
        this.phoneNumber = '';
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
        }, 300);
      },

      btnCreate() {
        this.reset();
        this.dialogDependant = true;
      },

      saveDependant() {
        let that = this;
        if (that.$refs.form.validate()) {
          that.$nuxt.$loading.start();
          that.editedItem.user_id = that.user_id;
          that.editedItem.mobile_phone = that.phoneNumber;
          that.editedItem.dob = that.dob;
          if (that.editedIndex > -1) {
            if (that.editedItem.is_primary === 1) {
              that.editedItem.is_primary = true;
            }
            that.$store.dispatch('employees/updateRelation', that.editedItem).then(function() {
              that.reloadList();
              that.$toaster.success(that.$i18n.t('message.success_employee_dependant_update'));
            }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_employee_dependant_update'));
              }
              // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
              that.$nuxt.$loading.finish();
            });
          } else {
            that.$store.dispatch('employees/storeRelation', that.editedItem).then(function() {
              that.reloadList();
              that.editedItem = that.defaultItem;
              that.$toaster.success(that.$i18n.t('message.success_employee_dependant_add_new'));
            }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_employee_dependant_add_new'));
              }
              // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
              that.$nuxt.$loading.finish();
            });
          }
          that.close();
        }
      },

      reloadList(){
        let that = this;
        // get list
        that.$store.dispatch('employees/indexRelation', {user_id: that.user_id}).then(result => {
          that.listArray = result.data;
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_employee_dependant_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      },

      reloadDocument() {
        let that = this;
        //Get attachment list
        that.$store.dispatch('documents/index', {
          type: that.document_type,
          object_type: that.document_added_from,
          object_id: that.user_id,
        }).then(result => {
          that.documents = result.data;
          _.each(that.documents, function(item){
            if(item.description){
              item.description = item.description.replace(/<[^>]+>/g, '');
            }
          });
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_document_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      },

      // upload employee's avatar
      showAttachment(){
        this.checkAttachmentOpen = true;
      },

      // previewImage(file){
      //   if(file){
      //     this.previewUrl = URL.createObjectURL(file);
      //     this.selectedLogoFile = file;
      //   }else{
      //     this.previewUrl = null;
      //     this.selectedLogoFile = null;
      //   }
      // },

      getFile(item){
        let filenameArray = item.uri.split('/').slice();
        let filename = filenameArray.slice(filenameArray.length - 1);
        downloadFile(item.url, filename);
      },

      // changeUserPermissions(){
      //   let that = this;
      //   that.employeeInfo.updatePermission = true;
      //   that.employeeInfo.permissionsName = that.user_permissions;
      //   that.$store.dispatch('users/update', that.employeeInfo).then(function() {
      //     that.employeeInfo.updatePermission = false;
      //   }).catch(error => {
      //     that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage);
      //   });
      // }

      getDOB(value) {
        this.dob = value.date;
        this.editedItem.dob_pre = this.dob;
      },
    }
  };
</script>

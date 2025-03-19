<template>
  <div>
    <!-- <RoutinePopup
      :open-popup="checkShowItem"
      :industry-array="industryArray"
      :resource="checkResource"
      :view-only="viewOnly"
      :routine-item="editedItem"
      :categories-array="categoriesArray"
      :project-array="projectArray"
      :job-title-array="jobTitleArray"
      :departments-array="departmentsArray"
      :responsible-array="responsibleArray"
      :contacts-array="contactsArray"
      :predefined-link-array="predefinedLinkArray"
      @closePopup="checkShowItem = !checkShowItem"
      @reloadList="reloadList"
      @reloadListCategory="reloadListCategory"
      @showItem="showItem"
      @updateResource="updateResource"
      @changeTab="changeTab"
    /> -->

    <ReviewRoutinePopup
    :departments-array="departmentsArray"
      :job-title-array="jobTitleArray"
      :responsible-array="responsibleArray"
      :contacts-array="contactsArray"
      :open-popup="checkShowItem"
      :industry-array="industryArray"
      :resource="checkResource"
      :document-item="editedItem"
      :categories-array="categoriesArray"
      :predefined-link-array="predefinedLinkArray"
      :employeeHeaders="expandTableHeaders"
      :recurringArray="recurringArray"
      @closePopup="checkShowItem = !checkShowItem"
      @reloadList="reloadList"
      @resourceList="resourceList"
      @reloadListCategory="reloadListCategory"
      @showItem="showItem"
      @updateResource="updateResource"
      @changeTab="changeTab"
    />


    <v-data-table
      :headers="computedHeaders"
      :items="filteredItems"
      class="elevation-1 hse-table table-data"
      :items-per-page="15"
      :single-expand="true"
      :search="search_value"
      :sort-by="['created_at']"
      :sort-desc="[true, false]"
      @click:row="editItem"
      :expanded.sync="expanded"
      hide-default-footer
  >
    <template v-slot:item.id="{ index }">
    {{ index + 1 }}
    </template>
    
        <template v-slot:item.start_time="{ item }">
          {{ moment(item.start_time).format('DD.MM.YYYY') }}
        </template>
        <template v-slot:item.deadline_date="{ item }">
          {{!item.deadline ? 'Indefinite': moment(item.deadline).format('DD.MM.YYYY') }}
          <!-- {{moment(item.deadline).format('DD.MM.YYYY') || moment(item.start_date).add(1, 'days').format('DD.MM.YYYY')}} -->
        </template>
        <template v-slot:item.recurring_type="{ item,index}">
          Routine ({{ item.recurring_type }})

        </template>
         <template v-slot:item.start_date="{ item }">
          {{ moment(item.start_date).format('DD.MM.YYYY') }}
        </template>
      <template v-slot:top>
        <div v-if="!noFilterSetting" class="setting-header">
          <div class="panel-heading">
            <h4 class="panel-title">
              {{ $t('title.sort_by') }}
            </h4>
            <b-row v-if="!resource">
              <b-col cols="10">
                <b-row>
                  <b-col cols="6">
                    <div class="field-selection">
                      <v-select
                        v-model="category"
                        :items="categoriesSelection"
                        item-text="name"
                        item-value="id"
                        :label="$t('setting.category')"
                        outlined
                        class="text-box"
                        @input="categorySelection"
                      />
                    </div>
                  </b-col>
                  <b-col cols="6">
                    <date-range-picker
                      ref="picker"
                      v-model="dateRange"
                      :opens="opens"
                      :locale-data="localData"
                      :singleDatePicker="singleDatePicker"
                      :timePicker="timePicker"
                      :timePicker24Hour="timePicker24Hour"
                      :showWeekNumbers="showWeekNumbers"
                      :showDropdowns="showDropdowns"
                      :autoApply="autoApply"
                      :linkedCalendars="linkedCalendars"
                      :alwaysShowCalendars="alwaysShowCalendars"
                      class="range-picker-custom text-box"
                    >
                      <template v-slot:input="picker">
                        <div v-if="picker.startDate">
                          {{moment(picker.startDate).format('DD.MM.YYYY') }} - {{moment(picker.endDate).format('DD.MM.YYYY') }}
                        </div>
                        <div v-else>All</div>
                      </template>
                    </date-range-picker>
                    <button @click="clearSelection" v-if="dateRange.startDate" class="col-11 p-0 text-right close-date">
                      <!-- Clear -->
                       <v-icon>
                          close
                        </v-icon>
                      </button>
                  </b-col>
                </b-row>
                <!-- <b-row>
                  <b-col cols="12">
                    <div class="field-selection field-search">
                      <v-text-field
                        v-model="search"
                        append-icon="search"
                        :label="$t('setting.search')"
                        outlined
                      />
                    </div>
                  </b-col>
                </b-row> -->
                <b-row>
                  <b-col v-if="isShowDepartmentFilter" cols="4">
                    <div class="field-selection">
                      <v-select
                        v-model="department"
                        :items="departmentsSelection"
                        item-value="id"
                        item-text="name"
                        :label="$t('setting.department')"
                        outlined
                        class="text-box"
                        @input="departmentSelection"
                      />
                    </div>
                  </b-col>
                  <b-col v-if="isShowJobTitleFilter" cols="4">
                    <div class="field-selection">
                      <v-select
                        v-model="job_title"
                        :items="jobTitleSelection"
                        item-value="id"
                        item-text="name"
                        :label="$t('setting.job_title')"
                        outlined
                        class="text-box"
                        @input="jobSelection"
                      />
                    </div>
                  </b-col>
                  <b-col v-if="isShowSearchField" cols="4" :class="(isShowJobTitleFilter || isShowDepartmentFilter) ? 'col-4' :'col-12'">
                    <div class="field-selection field-search">
                      <v-text-field
                        append-icon="search"
                        :label="$t('setting.search')"
                        outlined
                        class="text-box"
                        @input="textFeild"
                      >
                    <template v-slot:append>
                      <img src="../assets/images/icon/magnifier.png" class="search-icon-cust">
                    </template>
                  </v-text-field> 
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
                    v-model="isShowJobTitleFilter"
                    :label="$t('setting.job_title')"
                    class="text-box"
                  />
                   <v-checkbox
                    :label="$t('setting.search')"
                    class="text-box"
                    @change="isShowSearch"
                  />
                </div>
              </b-col>
            </b-row>
            <!-- Super ADMIN -->
            <b-row v-if="resource && checkSuperAdmin">
              <b-col cols="6">
                <div class="field-selection">
                  <v-select
                    v-model="category"
                    :items="categoriesSelection"
                    item-text="name"
                    item-value="id"
                    :label="$t('setting.category')"
                    outlined
                    class="text-box"
                    @input="categorySelection"
                  />
                </div>
              </b-col>
              <b-col cols="6">
                <div class="field-selection field-search">
                  <v-text-field
                    append-icon="search"
                    :label="$t('setting.search')"
                    outlined
                    class="text-box"
                    @input="textFeild"
                  />
                </div>
              </b-col>
            </b-row>
            <!-- User -->
            <b-row v-if="resource && !checkSuperAdmin">
              <b-col cols="4">
                <div class="field-selection">
                  <v-select
                    v-model="category"
                    :items="categoriesSelection"
                    item-text="name"
                    item-value="id"
                    :label="$t('setting.category')"
                    outlined
                    class="text-box"
                    @input="categorySelection"
                  />
                </div>
              </b-col>
              <!--                <b-col cols="4">-->
              <!--                  <date-range-picker-->
              <!--                    ref="picker"-->
              <!--                    :opens="opens"-->
              <!--                    :locale-data="localData"-->
              <!--                    :singleDatePicker="singleDatePicker"-->
              <!--                    :timePicker="timePicker"-->
              <!--                    :timePicker24Hour="timePicker24Hour"-->
              <!--                    :showWeekNumbers="showWeekNumbers"-->
              <!--                    :showDropdowns="showDropdowns"-->
              <!--                    :autoApply="autoApply"-->
              <!--                    v-model="dateRange"-->
              <!--                    :linkedCalendars="linkedCalendars"-->
              <!--                    :alwaysShowCalendars="alwaysShowCalendars"-->
              <!--                    class="range-picker-custom"-->
              <!--                  >-->
              <!--                    <template v-slot:input="picker">-->
              <!--                      <div v-if="picker.startDate">-->
              <!--                        {{moment(picker.startDate).format('DD.MM.YYYY') }} - {{moment(picker.endDate).format('DD.MM.YYYY') }}-->
              <!--                      </div>-->
              <!--                      <div v-else>All</div>-->
              <!--                    </template>-->
              <!--                  </date-range-picker>-->
              <!--                </b-col>-->
              <b-col cols="4">
                <div class="field-selection">
                  <v-select
                    v-model="added_by"
                    :label="$t('setting.added_by')"
                    item-text="name"
                    item-value="value"
                    :items="addedByResource"
                    outlined
                    class="text-box"
                    @input="userSelection"
                  />
                </div>
              </b-col>
              <b-col cols="4">
                <div class="field-selection field-search">
                  <v-text-field
                    append-icon="search"
                    :label="$t('setting.search')"
                    outlined
                    class="text-box"
                    @input="textFeild"
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
          <span v-if="!resource">{{ $t('table.routines') }}</span>
          <span v-if="resource">{{ $t('table.resources') }}</span>
        </h4>
      </template>
      <template v-slot:item.updated_at="{ item }">
        {{ moment(item.updated_at).format('DD.MM.YYYY') }}
      </template>
      <template v-slot:item.added_by_name="{ item }">
        <span v-if="item.added_by === 1">{{ $t('table.system') }}</span>
        <span v-else>{{ item.added_by_name }}</span>
      </template>
       <template v-slot:item.used_count="{ item }">
        <span>{{ item.used_count == null ? 0 : item.used_count }}</span>
      </template>
      <template v-slot:item.time_range="{ item }">
        <span v-if="item.start_time !== null && item.deadline !== null">
          {{ moment(item.start_time).format('DD.MM.YYYY') }} / {{ moment(item.deadline).format('DD.MM.YYYY') }}
        </span>
        <span v-else-if="item.start_time !== null && item.deadline === null">
          {{ moment(item.start_time).format('DD.MM.YYYY') }} 
        </span>
        <span v-else-if="item.start_time === null && item.deadline !== null">
          {{ moment(item.deadline).format('DD.MM.YYYY') }}
        </span>
      </template>
      
      <!-- <template v-slot:item.is_suggestion="{ item }">
        <span class="indexed-item indexed-yes" v-if="item.is_suggestion === 1">
          {{ $t('table.yes') }}
        </span>
        <span class="indexed-item indexed-no" v-else>
          {{ $t('table.no') }}
        </span>
      </template> -->
      <template v-slot:item.see_more="{item}">
        <v-hover v-slot:default="{ hover }">
          <v-badge   :value="hover" transition="slide-x-transition" class="hse--icon-question-circle img-hover-item">
            <span slot="badge">{{ $t('message.added_by')+':'+ item.addedByName}}</span>
            <img class="icon-img" src="../assets/images/active-added-by.png" alt="AddedBy.png" @click.stop/>

          </v-badge>
        </v-hover>
        <v-hover v-slot:default="{ hover }">
          <v-badge   :value="hover" transition="slide-x-transition" class="hse--icon-question-circle">
            <span slot="badge">{{ $t('message.responsible_person')}}</span>
            <img class="icon-img" src="../assets/images/active-responsible-person.png" alt="ResponsiblePerson.png" @click.stop/>
          </v-badge>
        </v-hover>
        <v-hover v-if="roleUser!='user'" v-slot:default="{ hover }">
          <v-badge   :value="hover" transition="slide-x-transition" class="hse--icon-question-circle">
            <span slot="badge">{{ $t('message.attendees')}}</span>
            <img class="icon-img" src="../assets/images/active-attendees.png" alt="Attendees.png" @click.stop="clickAttendees(item)"/>
          </v-badge>
        </v-hover>



        <!-- <v-hover v-if="(item.is_suggestion==0)" v-slot:default="{ hover }">
          <v-badge :value="hover" right transition="slide-x-transition" class="hse--icon-question-circle">
            <span slot="badge">{{ $t('message.index') }}:no</span>
            <img class="index-img" src="../assets/images/gridIcon/Index.png" alt="Index.png" @click.stop >
          </v-badge>
        </v-hover>
        <v-hover v-else v-slot:default="{ hover }">
          <v-badge :value="hover" right transition="slide-x-transition" class="hse--icon-question-circle">
            <span slot="badge">{{ $t('message.index') }}:yes</span>
            <img class="active-index-img"  src="../assets/images/gridIcon/Index.png" alt="fillReminder.png" @click.stop/>
          </v-badge>
        </v-hover> -->
      </template>
      <template v-slot:item.status="{item}">
        <status-chip
          :status="item.status"
          :inReview="false"
          :inRisk="false"
        />
        </template>
      <!--      <template v-slot:item.deadline="{ item }">-->
      <!--        <span v-if="item.responsible_id !== null">{{ moment(item.deadline).format('DD.MM.YYYY') }}</span>-->
      <!--        <span v-if="item.recurring === 'indefinite'">Indefinite</span>-->
      <!--        <span v-else>{{ moment(item.deadline).format('DD.MM.YYYY') }}</span>-->
      <!--      </template>-->
      <template v-if='is_Attendees && AttendeesObject?.length>0' v-slot:expanded-item="{ headers, item }">
        <td colspan="12" class="py-4 px-3" >
          <v-card class="pt-0 expand-pedding">
            <v-data-table
              :headers="expandTableHeaders"
              :items="AttendeesObject"
              :hide-default-footer="true"
              class="expand-table"
            >
            <template v-slot:item.status="{ item }">
              <status-chip
                :status="item.status"
                :inReview="false"
                :inRisk="false"
              />
                  <!-- <v-chip
              v-if="item.status === 'new'"
              class="status-btn status-label-custom cust-btn pending"
              label
            >
              {{ $t('form.new') }}
            </v-chip>
            <v-chip
              v-if="item.status === 'pending'"
              class="status-btn status-label-custom cust-btn pending"
              label
            >
              {{ $t('form.pending') }}
            </v-chip>
            <v-chip
              v-else-if="item.status === 'completed' || item.status === 'completed_overdue'"
              class="status-btn status-label-custom cust-btn approved"
              label
            >
              {{ $t('form.completed') }}
              <div class="ms-2" v-if="item.status === 'completed_overdue'">
                <img
                  src="../assets/images/icon/alert-white.png"
                  alt=""
                  srcset=""
                />
              </div>
            </v-chip>
            <v-chip
              v-else-if="item.status === 'request'"
              class="status-btn status-label-custom cust-btn ongoing"
              label
            >
              {{ $t('form.request') }}
            </v-chip>
            <v-chip
              v-else-if="item.status === 'disapproved_overdue'"
              class="status-btn status-label-custom cust-btn not-done"
              label
            >
              {{ $t('form.disapproved') }}
              <div class="ms-2">
                <img
                  src="../assets/images/icon/alert-white.png"
                  alt=""
                  srcset=""
                />
              </div>
            </v-chip>
            <v-chip
              v-else-if="item.status === 'disapproved_with_extended'"
              class="status-btn status-label-custom cust-btn ongoing"
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
              v-else-if="item.status === 'ongoing' || item.status === 'overdue'  || item.status === 'timeline_disapproved'"
              class="status-btn status-label-custom cust-btn ongoing"
              label
            >
              {{ $t('form.ongoing') }}
              <div  class="ms-2" v-if="item.status === 'overdue'">
                <img
                  src="../assets/images/icon/alert-white.png"
                  alt=""
                  srcset=""
                />
              </div>
            </v-chip>
            <v-chip
              v-else-if="item.status == 'Reassigned'"
              class="status-btn status-label-custom cust-btn not-done"
              label
            >
              {{ $t('form.reassigned') }}
            </v-chip>
            <v-chip
              v-else-if="item.status == 'Removed'"
              class="status-btn status-label-custom cust-btn not-done"
              label
            >
              {{ $t('form.removed') }}
            </v-chip>
            <v-chip
              v-else-if="item.status === 'disapproved'"
              class="status-btn status-label-custom cust-btn not-done"
              label
            >
              {{ $t('form.disapproved') }}
            </v-chip>
            <v-chip
              v-else-if="item.status === 'approved' || item.status === 'approved_overdue'"
              class="status-btn status-label-custom cust-btn approved"
              label
            >
              {{ $t('form.approved') }}
              <div  class="ms-2" v-if="item.status === 'approved_overdue'">
                <img
                  src="../assets/images/icon/alert-white.png"
                  alt=""
                  srcset=""
                />
              </div>
            </v-chip> -->
            </template>
            <template v-slot:item.comment="{ item, index }">
            <!-- add table -->
            <div v-if="item.status === 'Removed' || item.status === 'Reassigned' || item.comment == null || item.comment === 'undefined' || item.comment == 'null'">N/A</div>
            <div v-else>
                {{item.comment.length > 19? item.comment.slice(0, 19) + '...': item.comment}}
            </div>
          </template>
          <template v-slot:item.image="{ item, index }">
            <!-- add table -->
            <img
              v-if="item.image != null && item.image != 'N/A'"
              src="../assets/images/icon/image-green.png"
            />
            <img
              v-else
              src="../assets/images/icon/image-gray.png"
            />
            <!-- <img
              v-else
              src="../assets/images/icon/image-gray.png"
            /> -->
          </template>
                <!-- <template v-slot:item.actions="{ item }">
                  <div v-if="item.status === '1' || 'new'">
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
                  <div v-else-if="item.status === '0'">
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
                  <div v-else>
                    <v-btn
                      text
                      color="success"
                    >
                      {{ $t('form.accept') }}
                    </v-btn>
                    <v-btn
                      text
                      color="error"
                    >
                      {{ $t('form.decline') }}
                    </v-btn>
                  </div>
                </template> -->
            </v-data-table>
          </v-card>
        </td>
      </template>
      <template v-slot:no-data>
        {{ $t('table.no_data') }}
      </template>
    </v-data-table>
  </div>
</template>

<script>
  import {_} from 'vue-underscore';
  // import moment from 'moment';
  // import RoutinePopup from "./RoutinePopup";
  import ReviewRoutinePopup from "./ReviewRoutinePopup.vue";
  import cookies from "js-cookie";
import StatusChip from './StatusChip.vue';

  export default {
    name: "RoutineTable",
    components: {
      // RoutinePopup,
      ReviewRoutinePopup,
        StatusChip,
    },
    props: {
      resource: {
        type: Boolean,
        required: false,
      },
      jobTitleArray: {
        type: Array,
        required: false,
      },
      jobTitleSelection: {
        type: Array,
        required: false,
      },
      departmentsArray: {
        type: Array,
        required: false,
      },
      departmentsSelection: {
        type: Array,
        required: false,
      },
      categoriesArray: {
        type: Array,
        required: false,
      },
      categoriesSelection: {
        type: Array,
        required: false,
      },
      listArrayInput: Array,
      industryArray: {
        type: Array,
        required: false,
      },
      noFilterSetting: {
        type: Boolean,
        required: false,
      },
      viewOnly: {
        type: Boolean,
        required: false,
      },
      // attendingEmployees: {
      //   type: Array,
      //   required: false,
      // },
      responsibleArray: {
        type: Array,
        required: false,
      },
      contactsArray: {
        type: Array,
        required: false,
      },
      objectId: {
        type: String,
        required: false,
      },
      predefinedLinkArray: {
        type: Array,
        required: false,
      },
      recurringArray:{
        type: [Object,Array],
        required: false,
      },
      usersSelection: {
        type: Array,
        required: false,
      },
      addedByResource:{
        type: [Object,Array],
        required: false,
      },
       search_value:{
        type: String,
        required: false,
      }
    },
    data: () => ({
      permissionsUser: localStorage.getItem('permissionsKey'),
      userRoleId: parseInt(cookies.get('roleID')),
      checkSuperAdmin: cookies.get('checkSuperAdmin'),
      checkAdmin: cookies.get('checkAdmin'),
      roleUser: cookies.get('roleUser'),
      nowDate: new Date().toISOString().substr(0, 10),
      // search: '',
      listArray: [],
      expanded: [],
      AttendeesObject:[],
      is_Attendees:false,

      expandTableHeaders: [
      {
        text: 'Name',
        align: 'start',
        value: 'name',
        width:'20%'
      },
      { text: 'Comment', align: 'center', value: 'comment' },
      { text: 'Image', align: 'center', value: 'image' },
      { text: 'status', align: 'center', value: 'status' },
      // { text: 'Action', align: 'center', value: 'actions' },
    ],
      editedItem: {
        name: '',
        description: '',
        status: 'New',
        category_id: '',
        department_id: '',
        job_title_id: '',
        deadline: '',
        recurring: '',
        attendings_count: 0,
        attending_emps: [],
        attending_contact: [],
        responsible_id: '',
        is_template: false,
      },
      // attendeeData:[],
      menu: false,
      added_by: 0,
      department: 0,
      job_title: 0,
      category: 0,
      isShowDepartmentFilter: false,
      isShowJobTitleFilter: false,
      isShowSearchField:false,
      opens: 'right',
      singleDatePicker: false,
      timePicker: false,
      timePicker24Hour: true,
      showWeekNumbers: false,
      showDropdowns: "",
      autoApply: false,
      // dateTest: new Date(),
      dateRange: {
        startDate: false,
        endDate: false
      },
      linkedCalendars: "",
      alwaysShowCalendars: '',
      localData: {
        monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        firstDay: 1
      },
      checkShowItem: false,
      checkResource: false,
      // addedByResource: [ // filter Added by: System / Custom
      //   {
      //     value: 0,
      //     name: "All"
      //   }, {
      //     value: 1,
      //     name: "System"
      //   }, {
      //     value: 2,
      //     name: "Custom"
      //   }
      // ],
    }),

    computed: {       
      headers() {
        return [
          {text: this.translateCol('id'), value: 'id', align: 'left',width:'2%' , sortable: false},
          {text: this.translateCol('name'), value: 'name', align: 'center',width:'13%', sortDesc: false},
          {text: this.translateCol('category'), value: 'categoryName', align: 'center'},
          {text: this.translateCol('recurring_type'), value: 'recurring_type', align: 'center', sortable: false},
          {text: this.translateCol('activation'), value: 'start_date', align: 'center',sortable: false},
          {text: this.translateCol('frequency'), value: 'recurring', align: 'center',sortable: false},
          {text: this.translateCol('deactivation'), value: 'deadline_date', align: 'center',sortable: false},
          {text: this.translateCol('status'), value: 'status', align: 'center',sortable: false},
          {text: this.translateCol('see_more'), value: 'see_more', align: 'center', sortable: false},
          // {text: this.translateCol('indexed'), value: 'is_suggestion', align: 'center'},
          // {text: this.translateCol('deadline'), value: 'deadline', align: 'center'},
        ];
      },

      headersTemplate() {
        return [
          {text: this.translateCol('name'), value: 'name', align: 'left'},
          {text: this.translateCol('added_by'), value: 'added_by_name', align: 'center', sortDesc: false},
          {text: this.translateCol('category'), value: 'category_name', align: 'center'},
          {text: this.translateCol('last_edited'), value: 'updated_at', align: 'center', sortDesc: false},
          {text: this.translateCol('number_of_times_used'), value: 'used_count', align: 'center'},
        ];
      },
      headersAdmin() {
        return [
          {text: this.translateCol('name'), value: 'name', align: 'left'},
          {text: this.translateCol('category'), value: 'category_name', align: 'center'},
          {text: this.translateCol('last_edited'), value: 'updated_at', align: 'center', sortDesc: false},
          {text: this.translateCol('number_of_times_used'), value: 'used_count', align: 'center'},
        ];
      },
      // dateRangeText(){
      //   let that = this;
      //   if (that.date) {
      //     if (that.date[0] && that.date[1]){
      //       return moment(that.date[0]).format('DD.MM.YYYY') + ' - ' + moment(that.date[1]).format('DD.MM.YYYY');
      //     } else if (that.date[0]){
      //       return moment(that.date[0]).format('DD.MM.YYYY');
      //     }else if (that.date[1]){
      //       return moment(that.date[1]).format('DD.MM.YYYY');
      //     }
      //     else {
      //       return 'DD/MM/YY - DD/MM/YY';
      //     }
      //   }
      //   else {
      //     return 'DD/MM/YY - DD/MM/YY';
      //   }
      // },

      computedHeaders () {
        let result;
        if (this.checkSuperAdmin) {
          result = this.headersAdmin;
        } else {
          if (this.checkResource) {
            result = this.headersTemplate;
          } else {
            result = this.headers;
          }
        }
        if(!this.isShowDepartmentFilter){
          result = _.filter(result, function(item){
            return item.value !== 'department_name';
          });
        }
        if(!this.isShowJobTitleFilter){
          result = _.filter(result, function(item){
            return item.value !== 'job_title_name';
          });
        }
        return result;
      },

      filteredItems() {
        let that = this;

        return that.listArray
      }
    },

    watch: {
      dialog(val) {
        val || this.close();
      },

      listArrayInput(value) {
        if (value) {
          this.listArray = value;
        }
      },

      listArray: {
        handler: 'getObject',
        immediate: true,
      },

      objectId(value) {
        if (value) {
          this.getObject();
        }
      },

      resource(value) {
        if (value) {
          this.checkResource = value;
        }
      },
      dateRange: {
    handler(newValue) {
      this.dateSelection(newValue)
    },
    deep: true, // Add deep: true if "dateRange" is an object or array for deep watching
},
    },

    created() {
      if (this.listArrayInput?.length > 0) {
        this.listArray = this.listArrayInput;
      }

      if (this.resource) {
        this.checkResource = this.resource;
      }
    },

    methods: {
      isShowSearch(value){
        if (value == true) {
          this.isShowSearchField=true
        }else{
          this.isShowSearchField=false
          this.textFeild()
        }
      },
      translateCol (colName) {
        return this.$i18n.t('column.' + colName);
      },
       clearSelection() {
          this.dateRange.startDate=false;
          this.dateRange.endDate=false;
      },
       dateSelection(dateValue){
        this.$emit('dateSelection',dateValue);
      },
      textFeild(text){
      if (this.checkResource) {
        this.$emit('textFilterResource',text);
      }else{
        this.$emit('textFilter',text);
        }
      },
      userSelection(user){
        this.$emit('userSelection',user);
      },
      categorySelection(category){
         if (this.checkResource) {
        this.$emit('categoryResourceSelection',category);
        
      }else{
        
        this.$emit('categorySelection',category);
        }
      },
      jobSelection(job){
        this.$emit('jobSelection',job);
      },

      departmentSelection(dep){
        this.$emit('departmentSelection',dep);
      },

      getObject() {
        let that = this;
        if (that.objectId) {
          _.each(that.listArray, function (item) {
            if (item.id === parseInt(that.objectId)) {
              that.editItem(item);
              let query = Object.assign({}, that.$route.query);
              delete query.id;
              that.$router.replace({ query });
            }
          });
        }
      },
      clickAttendees(item){
        this.is_Attendees=!this.is_Attendees;
      this.expanded = []
      this.AttendeesObject=[]
      let attendeeData=[]
      const indexExpanded = this.expanded.findIndex((i) => i === item)
        if (indexExpanded > -1) {
        this.expanded.splice(indexExpanded, 1)
      } else {
          this.expanded.push(item)
          _.each(item?.task_data, function  (attendee) {
              attendeeData.push({
                  name: attendee.attendeeName,
                  comment: attendee.comment || 'N/A',
                  image: attendee.image || 'N/A',
                  status:attendee.status
              });
          })
          this.AttendeesObject = attendeeData;
        }
      },
      reloadList() {
        this.$emit('reloadList');
      },
      resourceList() {
        this.$emit('resourceList');
      },
      reloadListCategory(){
        this.$emit('reloadListCategory');
      },

      changeTab(value) {
        this.$emit('changeTab', value);
      },

      formatDate(date) {
        if (!date) return null;
        const [year, month, day] = date.split(' ')[0].split('-');
        return `${day}/${month}/${year}`;
      },

      updateResource(value) {
        this.checkResource = value;
      },

      showItem(item) {
        this.editItem(item);
      },

      editItem(item) {
        // let data=index.index%2==0?true:false
        this.editedItem = Object.assign({}, item);
        // this.editedItem.isRecurring=data
        this.checkShowItem = true;
        this.checkResource=this.checkResource?true:false
      },

      // checkDenyEdit() {
      //   this.$emit('checkDenyEdit');
      // },
    }
  };

</script>

<style scoped>
.close-date{
  position: absolute;
  top: 23%;
}
.close-date i{
  color: #6c757d;
  opacity: 0.5;
  font-size: 18px;
  margin-right: 5px;
}
.active-index-img:hover{
  filter: none;
}
.active-index-img{

  width: 25px;
  height: 25px;
}
.index-img{
  width: 25px;
  height: 25px;
    filter: grayscale(1);

}
.v-badge.hse--icon-question-circle .icon-img{
  width: 22px !important;
  height: 22px;
  margin: 0px 5px;
}
::v-deep .v-data-table__wrapper{
  padding: 10px !important;
}
::v-deep .v-data-table>.v-data-table__wrapper tbody tr.v-data-table__expanded__content{
  box-shadow: none !important;
}
::v-deep .v-sheet.v-card:not(.v-sheet--outlined){
  box-shadow: none;
  border: 1px solid #C2C1C1;
}
:deep(.v-data-table__wrapper){
  padding-top: 50px !important;
}
:deep(.v-badge__badge){
  inset: auto auto calc(125% - 4px) calc(-195% - 10px) !important;
}
  :deep(.resp-bedge .v-badge__badge){
    inset: auto auto calc(125% - 4px) calc( -195% - 92px) !important;
  }
.cust-btn{
  width: 110px !important;
}
</style>

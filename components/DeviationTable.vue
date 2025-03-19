<template>
  <div>
    <!-- <DeviationPopup
      :open-popup="checkShowItem"
      :deviation-item="editedItem"
      :categories-array="categoriesArray"
      :job-title-array="jobTitleSelection"
      :departments-array="departmentsArray"
      :task-assignees-array="taskAssigneesArray"
      :responsible-array="responsibleArray"
      :predefined-link-array="predefinedLinkArray"
      @closePopup="checkShowItem = !checkShowItem"
      @reloadList="reloadList"
      @reloadListCategory="reloadListCategory"
      @showItem="showItem"
    /> -->
    <ReviewDeviation
    :open-popup="checkShowItem"
      :deviation-item="editedItem"
      :categories-array="categoriesArray"
      :job-title-array="jobTitleSelection"
      :departments-array="departmentsArray"
      :task-assignees-array="taskAssigneesArray"
      :responsible-array="responsibleArray"
      :predefined-link-array="predefinedLinkArray"
      :consequenceArray="consequenceArray"
      :placeArray="placeArray"
      @closePopup="checkShowItem = !checkShowItem"
      @reloadList="reloadList()"
      @reloadListCategory="reloadListCategory()"
      @showItem="showItem"
    />

    <v-data-table
      :headers="computedHeaders"
      :items="listArray"
      class="elevation-1 hse-table table-data"
      :items-per-page="15"
      :single-expand="true"
      :search="search_value"
      :sort-by="['created_at']"
      :sort-desc="[true, false]"
      @click:row="editItem"
      hide-default-footer
      :loading="tableLoad"
      loading-text="Loading... Please wait"
    >
      <template v-slot:top>
        <div v-if="!noFilterSetting" class="status-boxes">
          <b-row>
            <b-col cols="3">
              <div class="status-box-wrap">
                <div>
                  <h3>{{ processing.total }}</h3>
                  <p>{{ $t('title.total') }}</p>
                </div>
              </div>
            </b-col>

            <b-col cols="3">
              <div class="status-box-wrap">
                <div>
                  <h3>{{ processing.new }}</h3>
                  <p>{{ $t('title.new') }}</p>
                </div>
              </div>
            </b-col>

            <b-col cols="3">
              <div class="status-box-wrap">
                <div>
                  <h3>{{ processing.processing }}</h3>
                  <p>{{ $t('title.ongoing') }}</p>
                </div>
                </div>
            </b-col>

            <b-col cols="3">
              <div class="status-box-wrap">
                <div>
                  <h3>{{ processing.closed }}</h3>
                  <p>{{ $t('title.closed') }}</p>
                </div>
              </div>
            </b-col>
          </b-row>
        </div>
        <div v-if="!noFilterSetting" class="setting-header">
          <div class="panel-heading">
            <h4 class="panel-title">
              {{ $t('title.sort_by') }}
            </h4>
            <b-row>
              <b-col cols="10">
                <b-row>
                  <b-col cols="4">
                    <div class="field-selection">
                      <v-select
                        v-model="status"
                        :items="statusSelect"
                        item-text="name"
                        item-value="value"
                        :label="$t('setting.status')"
                        outlined
                        class="text-box"
                        @input="statusSelection"
                      />
                    </div>
                  </b-col>
                  <b-col cols="4">
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
                  <b-col cols="4">
                    <div class="field-selection">
                      <v-select
                        v-model="added_by"
                        :items="usersSelection"
                        item-value="id"
                        :label="$t('setting.reported_by')"
                        outlined
                        class="text-box"
                        @input="userSelection"
                      >
                        <template slot="selection" slot-scope="data">
                          {{ data.item.first_name ? data.item.first_name + ' ' + data.item.last_name  : data.item.name}}
                        </template>
                        <template slot="item" slot-scope="data">
                          {{ data.item.first_name ? data.item.first_name + ' ' + data.item.last_name  : data.item.name}}
                        </template>
                      </v-select>
                    </div>
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
          </div>
        </div>
      </template>

      <template v-slot:header="{ props: { headers } }">
        <h4 v-if="tableName" class="table-name">
          {{ tableName }}
        </h4>
        <h4 v-else class="table-name">
          {{ $t('table.deviations') }}
        </h4>
      </template>
      <template v-slot:item.id="{ index }">
            {{ index + 1 }}
      </template>
      <template v-slot:item.type="{item , index}">
        <!-- {{ (editedItem.type==2 || editedItem.type==1) ? 'risk' : (editedItem.type==3) ? 'Task' : 'none' }} -->
        <!-- {{(item.action==1 || item.action==2) ? 'risk' : item.action==3 ? 'task' : 'none' }} -->
        {{(item.action== 'risk' || item.action==2 || item.action=='"risk_analysis"') ? 'risk' : item.action=='task' ? 'task' : 'none' }}
        
      </template>
      <template v-slot:item.added_by_name="{item }">
        {{item.report_as_anonymous==1 ? 'Anonymous'  :  item.added_by_name}}
      </template>
      <template v-slot:item.created_at="{ item }">
                  {{ moment(item.created_at).format('DD.MM.YYYY') }}
      </template>   
      <template v-slot:item.responsible_names="{ item}">
        <v-hover v-slot:default="{ hover }" v-if="item?.responsible_names?.length > 0">
          <v-badge :value="hover" transition="slide-x-transition" class="responsible-badge">
            <span slot="badge">{{ $t('message.responsible')+':'+ item.responsible_names}}</span>
            {{item?.responsible_names?.[0]}}
          </v-badge>
        </v-hover>
        <!-- <div v-else-if="responsible_names">

        {{item?.responsible_names?.[0]}}
        </div> -->
        <div v-else>

        {{item.added_by_name}}
        </div>
      </template> 
      
      <template v-slot:item.status="{ item }">
                  <!-- <v-chip
                    v-if="item.status == 1 || item.status == 'new'"
                    class="ma-2 status-label-custom status-btn pending"
                    label
                  >
                    {{ $t('form.new') }}
                  </v-chip>
                   <v-chip
                    v-else-if="item.status == 6 || item.status === 'pending'"
                    class="ma-2 status-label-custom status-btn pending"
                    label
                  >
                    {{ $t('form.pending') }}
                  </v-chip>
                  <v-chip
                    v-else-if="item.status == 2 || item.status === 'ongoing'|| item.status === 'timeline_disapproved'"
                    class="ma-2 status-label-custom status-btn ongoing"
                    label
                  >
                    {{ $t('form.ongoing') }}
                  </v-chip>
                  <v-chip
                    v-else-if="item.status == 3 || item.status == 'closed'"
                    class="ma-2 status-label-custom status-btn approved"
                    label
                  >
                    {{ $t('form.closed') }}
                  </v-chip>
                  <v-chip
                    v-else-if="item.status == 8 || item.status == 'overdue'"
                    class="ma-2 status-label-custom status-btn ongoing"
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
                   <v-chip
                    v-else-if="item.status == 9 || item.status == 'completed' && (item.task_data == null || item.task_data == '') "
                    class="ma-2 status-label-custom status-btn completed"
                    label
                  >
                    {{ $t('form.completed') }}
                  </v-chip>
                  <v-chip
                    v-else-if="item.status === 'disapproved'"
                    class="status-btn status-label-custom not-done"
                    label
                  >
                    {{ $t('form.disapproved') }}
                  </v-chip>
                  <v-chip
                    v-else-if="item.status === 'disapproved_overdue'"
                    class="info-item status-label-custom status-btn not-done"
                    label
                  >
                    {{ $t('form.disapproved') }}
                    <div role="button" class="ms-2">
                      <img src="../assets/images/icon/alert-white.png" alt="" srcset="" />
                    </div>
                  </v-chip>
                  <v-chip
                    v-else-if="item.status === 'disapproved_with_extended'"
                    class="info-item status-label-custom status-btn ongoing"
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
                    v-else-if="item.status === 'overdue'"
                    class="info-item status-label-custom status-btn ongoing"
                    label
                  >
                    {{ $t('form.ongoing') }}
                    <div role="button" class="ms-2">
                      <img src="../assets/images/icon/alert.png" alt="" srcset="" />
                    </div>
                  </v-chip>
                  <v-chip
                    v-else-if="item.status === 'completed' && item.task_data != null"
                    class="info-item status-label-custom status-btn approved"
                    label
                  >
                    {{ $t('form.completed') }}
                  </v-chip>
                  <v-chip
                    v-else-if="item.status === 'completed_overdue'"
                    class="info-item status-label-custom status-btn approved"
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
                    v-else-if="item.status === 'request'"
                    class="info-item status-label-custom status-btn ongoing"
                    label
                  >
                    {{ $t('form.request') }}
                  </v-chip>

                  <v-chip
                    v-else-if="item.status === 'approved'"
                    class="info-item status-label-custom status-btn approved"
                    label
                  >
                    {{ $t('form.approved') }}
                  </v-chip>
                  <v-chip
                    v-else-if="item.status === 'approved_overdue'"
                    class="info-item status-label-custom status-btn approved"
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
                      item.status === 'Reassigned' || item.status === 'Removed'
                    "
                    class="info-item status-label-custom status-btn not-done"
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
                  </v-chip> -->
                  <status-chip :status="item.status" :inReview="false" :inRisk="(item.task_data == null || item.task_data == '') ? true : false"
                  />
        </template>
        <!-- <template v-slot:item.see_more="{item}">
        <v-hover v-slot:default="{ hover }">
          <v-badge   :value="hover" transition="slide-x-transition" class="hse--icon-question-circle">
            <span slot="badge">{{ $t('message.added_by')+':'+ item.added_by_name}}</span>
            <img class="icon-img" src="../assets/images/active-added-by.png" alt="AddedBy.png" @click.stop/>

          </v-badge>
        </v-hover>
        <v-hover v-slot:default="{ hover }">
          <v-badge :value="hover" transition="slide-x-transition" class="hse--icon-question-circle">
            <span slot="badge">{{ $t('message.responsible')+':'+item.responsible_id_name}}</span>
            <img class="icon-img" src="../assets/images/active-responsible-person.png" alt="ResponsiblePerson.png" @click.stop/>
          </v-badge>
        </v-hover>
        <v-hover v-slot:default="{ hover }">
          <v-badge :value="hover" right transition="slide-x-transition" class="hse--icon-question-circle">
            <span slot="badge">{{ $t('message.connectto') }}</span>
            <img class="connect-to" src="../assets/images/gridIcon/fill_con_to_object.png" alt="fill_con_to_object.png" @click.stop/>
          </v-badge>
        </v-hover>

        <v-hover v-if="(item.is_suggestion==0)" v-slot:default="{ hover }">
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
        </v-hover>
      </template> -->

      <!-- <template v-slot:item.is_suggestion="{ item }">
        <span class="indexed-item indexed-yes" v-if="item.is_suggestion === 1">
          {{ $t('table.yes') }}
        </span>
        <span class="indexed-item indexed-no" v-else>
          {{ $t('table.no') }}
        </span>
      </template> -->

      <template v-slot:no-data>
        {{ $t('table.no_data') }}
      </template>
    </v-data-table>
  </div>
</template>

<script>
  import {_} from 'vue-underscore';
  import cookies from 'js-cookie';
  // import moment from 'moment';
  // import DeviationPopup from "./DeviationPopup";
  import ReviewDeviation from "./ReviewDeviation";
import StatusChip from './StatusChip.vue';

  export default {
    name: "DeviationTable",
    components: {
      ReviewDeviation,
        StatusChip,
    },
    props: {
      consequenceArray:{
        type:Array,
        required:false,
      },
      placeArray:{
        type:Array,
        required:false,
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
      processing: {
        type: Object,
        required: false,
      },
      usersArray: {
        type: Array,
        required: false,
      },
      usersSelection: {
        type: Array,
        required: false,
      },
      listArrayInput: Array,
      noFilterSetting: {
        type: Boolean,
        required: false,
      },
      objectId: {
        type: String,
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
      tableName: {
        type: String,
        required: false,
      },
      predefinedLinkArray: {
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
      statusSelect: {
        type: Array,
        required: false,
      },
      search_value:{
        type: String,
        required: false,
      },
      tableLoad:{
        type: Boolean,
        required: false,
      }
    },
    data: () => ({
      userRoleId: parseInt(cookies.get('roleID')),
      userDepartmentID: parseInt(cookies.get('userDepartmentID')),
      pageKey: 'reports-deviations-deviations',
      permissionsUser: localStorage.getItem('permissionsKey'),
      checkAdmin: cookies.get('checkAdmin'),
      roleUser: cookies.get('roleUser'),
      nowDate: new Date().toISOString().substr(0, 10),
      // search: '',
      dialog: false,
      valid: true,
      status: 0,
      added_by: 0,
      responsible: 0,
      responsible_names:'',
      // statusSelect: [ {
      //   value: 0,
      //   name: "All"
      // }, {
      //   value: 1,
      //   name: "New"
      // }, {
      //   value: 2,
      //   name: "Ongoing"
      // }, {
      //   value: 3,
      //   name: "Closed"
      // }
      // ],
      listArray: [],
      editedItem: {
        added_by: '',
        place: '',
        consequence_for: '',
        place_detail:'',
        consequence_detail:'',
        subject: '',
        category_id: '',
        description: '',
        prososial_action: '',
        corrective_action: '',
        happened_before: '',
        is_happened_before:false,
        is_corrective:false,
        is_legalSpecifications:false,
        specifications: '',
        attachment: '',
        status: 1,
        report_as_anonymous: false,
        department_id: '',
        job_title_id: '',
        action: 'none',
        type_of_attachment: false,
        type:'none',
        risk_analysis:{}
      },
      menu: false,
      tabIndex: 0,
      company_id: '',
      opens: 'right',
      singleDatePicker: false,
      timePicker: false,
      timePicker24Hour: true,
      showWeekNumbers: false,
      showDropdowns: "",
      autoApply: false,
      dateTest: new Date(),
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
      connectDepartment: false,
      connectJobTitle: false,

      // Setting - checkbox filter
      isShowDepartmentFilter: false,
      isShowJobTitleFilter: false,
      isShowSearchField: false,
      department: 0,
      job_title: 0,
      checkShowItem: false,
      customiseHoverLabel:''
    }),

    computed: {
      headers() {
        return [
          // {text: this.translateCol('id'), value: 'id', align: 'left',width:'2%'},
          {text: this.translateCol('name'), value: 'subject', align: 'left',width: '25%'},
          {text: this.translateCol('type'), value: 'type', align: 'center',width:'10%' , sortable:false},
          {text: this.translateCol('category'), value: 'category_name', align: 'center',width: '20%'},
          {text: this.translateCol('reported_by'), value: 'added_by_name', align: 'center',width: '15%'},
          {text: this.translateCol('responsible'), value: 'responsible_names', align: 'center',width: '15%'},
          {text: this.translateCol('reported'), value: 'created_at', align: 'left', sortDesc: false ,width:'10%'},
          {text: this.translateCol('status'), value: 'status', align: 'center' },
          // {text: this.translateCol('see_more'), value: 'see_more', align: 'center', sortable: false,width:'15%'},
        ];
      },

      computedHeaders () {
        let result = this.headers;
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
        // if(!this.isShowSearchField){
        //   result = _.filter(result, function(item){
        //     return item.value !== 'job_title_name';
        //   });
        // }
        return result;
      },

      filteredItems() {
        let that = this;
        // that.$nuxt.$loading.start();
        return that.listArray
        // .filter((item) => {
          
        //   // startDate
        //   const formattedDate = that.dateRange.startDate;
        //   const momentDate = that.moment(formattedDate, 'DD.MM.YYYY');
        //   const inputedStartDate = momentDate.startOf('day').valueOf(); 

        //   // endDate
        //   const formattedEndDate = that.dateRange.endDate;
        //   const momentEndDate = that.moment(formattedEndDate, 'DD.MM.YYYY');
        //   const inputedEndDate = momentEndDate.endOf('day').valueOf();

        //   //created_date
        //   const date_item = {
        //     created_at: that.moment(item.created_at).format('DD.MM.YYYY')
        //   };
        //   const dateString = date_item.created_at;
        //   const momentCreatedDate = that.moment(dateString, 'DD.MM.YYYY');
        //   const getCreatedDate = momentCreatedDate.valueOf();


        //   return (
        //     (that.added_by == 'anonymous'? item.report_as_anonymous === 1 : (that.added_by === 0) || (item.added_by === that.added_by && item.report_as_anonymous == 0 ))
        //     && (that.department === 0 || (item.department_id === that.department))
        //     && (that.job_title === 0 || (item.job_title_id === that.job_title))
        //     && (!inputedStartDate || inputedStartDate <= getCreatedDate)
        //     && (!inputedEndDate || inputedEndDate >= getCreatedDate)
        //   );
        // });
        // that.reloadList()
        // that.$nuxt.$loading.finish();
      }

    },

    watch: {
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
  dateRange: {
    handler(newValue) {
      this.dateSelection(newValue)
    },
    deep: true, // Add deep: true if "dateRange" is an object or array for deep watching
},
    },

    created() {
      if (this.listArrayInput.length > 0) {
        this.listArray = this.listArrayInput;
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
      statusSelection(e){
        this.$emit('statusSelection',e);
      },
      departmentSelection(e){
        this.$emit('departmentSelection',e);
      },
      jobSelection(e){
        this.$emit('jobSelection',e);
      },
      textFeild(text){
         this.$emit('textFilter',text);
      },
      dateSelection(dateValue){
        this.$emit('dateSelection',dateValue);
      },
      userSelection(user){
        this.$emit('userSelection',user);
      },
      translateCol (colName) {
        return this.$i18n.t('column.' + colName);
      },
      // getSelectedItemId(e){
      //   console.log("usersSelection",e);
      // },
      clearSelection() {
          this.dateRange.startDate=false;
          this.dateRange.endDate=false;
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

      reloadList() {
        this.$emit('reloadList');
      },

      reloadListCategory(){
        this.$emit('reloadListCategory');
      },

      showItem(item) {
        this.editItem(item);
      },

      editItem(item) {
        let that = this;
        that.editedItem = Object.assign({}, item);
        that.editedItem.deadline= "",
        that.editedItem.deadline_pre= "",
        that.editedItem.start_date="",
        that.editedItem.start_date_pre="",    
        that.editedItem.source_id=item.id,
        that.editedItem.is_shared=""
        that.checkShowItem = true;
        let type=''
        if (that.editedItem.action == 'risk' || that.editedItem.action == 'risk_analysis') {
          type="risk";
          that.editedItem.type='risk'
         }
         else if(that.editedItem.action=='task'){
          type="task"
          that.editedItem.type='task'
         }
         else{
           type="none";
         }
        that.editedItem.type=type
        that.editedItem.action=that.editedItem.type
      },

      formatStatus(status) {
        if (status === 1) {
          return "New";
        } else if (status === 2) {
          return "Ongoing";
        } else if (status === 3) {
          return "Closed";
        }
      },
    }
  };

</script>

<style scoped>
.close-date{
  position: absolute;
  top: 24%;
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
.connect-to{
  width: 25px;
  height: 25px;
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
  inset: auto auto calc(121% - 4px) calc(-200% - 4px) !important;
}
:deep(.responsible-badge .v-badge__badge){
  inset:auto auto calc(121% - -7px) calc(-98% - -8px) !important;
}
:deep(.responsible-badge .v-badge__badge){
  inset:auto auto calc(121% - -6px) calc(-98% - 0px) !important;
  width: 305px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    background-color: #666768 !important;
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
.status-btn{
  width: 130px;
}
:deep(.customize .v-badge__wrapper .v-badge__badge){
  inset: auto auto calc(100% - -3px) calc(-72% - 100px) !important;
}
</style>

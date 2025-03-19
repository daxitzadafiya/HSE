<template>
  <div>
    <!-- <ReportChecklistPopup
      :open-popup="checkShowItem"
      :report-item="editedItem"
      :job-title-array="jobTitleArray"
      :departments-array="departmentsArray"
      :categories-array="categoriesArray"
      :task-assignees-array="taskAssigneesArray"
      :responsible-array="responsibleArray"
      :predefined-link-array="predefinedLinkArray"
      @closePopup="checkShowItem = !checkShowItem"
      @reloadList="reloadList"
      @reloadListCategory="reloadListCategory"
      @showItem="showItem"
    /> -->
   
    <ReviewProcessChecklist
      :open-popup="checkShowItem"
      :checklist-item="editedItem"
      :job-title-array="jobTitleArray"
      :departments-array="departmentsArray"
      :categories-array="categoriesArray"
      :taskCategoriesArray="taskCategoriesArray"
      :task-assignees-array="taskAssigneesArray"
      :responsible-array="responsibleArray"
      :predefined-link-array="predefinedLinkArray"
      @reloadList="reloadList"
      @reloadListCategory="reloadListCategory"
      @closePopup="checkShowItem = !checkShowItem"
    />

    <v-data-table
      :headers="computedHeaders"
      :items="filteredItems"
      class="elevation-1 hse-table table-data"
      :items-per-page="10"
      :single-expand="true"
      :search="search_value"
      :sort-by="['created_at']"
      :sort-desc="[true, false]"
      @click:row="editItem"
      hide-default-footer
    >
      <template v-slot:top>
        <div class="status-boxes">
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
                  <h3>{{ processing.ongoing }}</h3>
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
        <div class="setting-header">
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
                        v-model="added_by"
                        :label="$t('setting.added_by')"
                        item-value="id"
                        :items="usersSelection"
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
                          {{moment(picker.startDate).format('DD.MM.YYYY') }} - {{ moment(picker.endDate).format('DD.MM.YYYY') }}
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
                        @input="depSelection"
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
                    v-model="isShowSearchField"
                    :label="$t('setting.search')"
                    class="text-box"
                  />
                </div>
              </b-col>
            </b-row>
          </div>
        </div>
      </template>

      <template v-slot:header="{ props: { headers } }">
        <h4 class="table-name">
          {{ $t('table.report_checklists') }}
        </h4>
      </template>
      <template v-slot:item.created_at="{ item , index }">
        <div :class="item.status===2? 'border-yellow' :( item.status=== 3 ?'border-green': 'border-red')" class="py-2 px-2">

          {{ moment(item.created_at).format('DD.MM.YYYY') }}
        </div>
      </template>
      <template v-slot:item.user="{ item }">
        {{ item.user.first_name }} {{ item.user.last_name }}
      </template>
      <!-- <template v-slot:item.status="{ item }">
        {{ formatStatus(item.status) }}
      </template> -->
      <template v-slot:item.status="{ item }">
                <status-chip
                  :status="item?.status"
                  :inReview="false"
                  :inRisk="!item.is_task"
                  :addDescription="addDescription" 
                  :addImage="addImage" 
                  :extended_date="processingItem?.extended_timeline?.old_deadline ? true :false "
                />
                  <!-- <v-chip
                    v-if="item.status === 2"
                    class="ma-2 status-btn status-label-custom ongoing"
                    label
                  >
                    {{$t('form.ongoing')}}
                    
                  </v-chip>
                  <v-chip
                    v-if="item.status === 3"
                    class="ma-2 status-btn status-label-custom approved"
                    label
                  >
                    {{$t('table.closed') }}
                    
                  </v-chip>
                  <v-chip
                    v-if="item.status == 1"
                    class="ma-2 status-btn status-label-custom"
                    label
                  >

                    {{$t('table.new')}}
                    
                  </v-chip>
                  <v-chip
                   v-if="item.status == 4"
                    class="ma-2 status-label-custom completed"
                    label
                  >
                   {{ $t('form.completed') }}
                  </v-chip> -->
                </template>
      <template v-slot:item.updated_at="{ item }">
        <div v-if="item.status === 3" class="border">{{ moment(item.updated_at).format('DD.MM.YYYY') }}</div>
      </template>
      <template v-slot:item.is_suggestion="{ item }">
      <v-hover v-if="(item.is_suggestion==0)" v-slot:default="{ hover }">
          <v-badge :value="hover" right transition="slide-x-transition" class="hse--icon-question-circle reportlist-badge w-50">
            <span slot="badge">{{ item.is_public==0? $t('message.personal')  : $t('message.shared') }}</span>
            <img class="" src="../assets/images/gridIcon/security.png" alt="fillSecurity.png" @click.stop/>
          </v-badge>
        </v-hover>
        <v-hover v-else v-slot:default="{ hover }">
          <v-badge :value="hover" right transition="slide-x-transition" class="hse--icon-question-circle reportlist-badge w-50">
            <span slot="badge">{{ item.shared==0? $t('message.personal')  : $t('message.shared') }}</span>
            <img class="" src="../assets/images/gridIcon/fillSecurity.png" alt="fillSecurity.png" @click.stop/>

          </v-badge>
        </v-hover>
      </template>
      <!-- <template v-slot:item.responsible_name="{item}">
        {{ 'IT-Manager' }}
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
  // import ReportChecklistPopup from "./ReportChecklistPopup";
  import ReviewProcessChecklist from "./ReviewProcessChecklist";
import StatusChip from './StatusChip.vue';

  export default {
    name: "ReportChecklistTable",
    components: {
      // ReportChecklistPopup,
      ReviewProcessChecklist,
        StatusChip,
    },
    props: {
      jobTitleArray: {
        type: Array,
        required: false,
      },
      jobTitleSelection: {
        type: Array,
        required: false,
      },
      taskCategoriesArray:{
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
      usersSelection: {
        type: Array,
        required: false,
      },
      categoriesArray: Array,
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
      predefinedLinkArray: {
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
      }
    },
    data: () => ({
      userRoleId: parseInt(cookies.get('roleID')),
      userDepartmentID: parseInt(cookies.get('userDepartmentID')),
      checkAdmin: cookies.get('checkAdmin'),
      roleUser: cookies.get('roleUser'),
      pageKey: 'reports-report-checklists-report-checklists',
      permissionsUser: localStorage.getItem('permissionsKey'),
      nowDate: new Date().toISOString().substr(0, 10),
      search: '',
      // dialog: false,
      valid: true,
      status: 0,
      added_by: 0,
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
      // }],
      headers: [
        {text: 'Name', align: 'left', value: 'name', width:'20%'},
        {text: 'Reported By', value: 'user', align: 'center'},
        {text: 'Responsible', value: 'responsible_name', align: 'center'},
        {text: 'Category', align: 'center', value: 'category.name'},
        {text: 'Date', value: 'created_at', align: 'center', sortDesc: false},
        {text: 'Status', value: 'status', align: 'center'},
        {text: 'Security', value: 'is_suggestion', align: 'center'},
        // {text: 'Closed date', value: 'updated_at', align: 'left', sortDesc: false},
        // {text: 'Actions', value: 'action', align: 'center'},
      ],
      listArray: [],
      editedItem: {
        checklist_name: "",
        checklist_description: "",
        category_id: "",
        company_id: "",
        added_by: "",
        department_id: "",
        job_title_id: "",
        type:"",
        category_name: "",
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
      isShowSearchField:false,
      department: 0,
      job_title: 0,
      checkShowItem: false,
      checkAddNew:false,
      statusArray: [
        {
          value: 0,
          name: "All"
        }, {
          value: 1,
          name: "New"
        }, {
          value: 2,
          name: "Ongoing"
        }, {
          value: 3,
          name: "Closed"
        }
      ],
    }),

    computed: {
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
        return result;
      },

      filteredItems() {
        let that = this;
        that.listArray?.map((item) => {
          // console.log("item",item);
           if(typeof item?.answer === 'string'){
          item.answer=JSON.parse(item?.answer)
          // if(typeof item.answer === 'object'){
          //   // console.log("Hello");
          //   item.answer=[item.answer];
          // }
        } 
        // if (item.answer.length == 1) {
          (item.answer).map((ans , index) => {
        let riskCount = 0
            if (ans.action == 'risk') {
              riskCount++
            }
            if (item.answer.length - 1 == index) {
              // console.log("in -if index");
              if (item.answer.length == riskCount) {
                item.status = 'completed'
              }
            }
          })
        // }
        })
        return that.listArray
        // .filter((item) => {
        //   return ((that.added_by === 0 || (item.added_by === that.added_by))
        //     && (that.department === 0 || (item.department_id === that.department))
        //     && (that.job_title === 0 || (item.job_title_id === that.job_title))
        //     && (!that.dateRange.startDate || (that.dateRange.startDate && that.moment(that.dateRange.startDate).format('DD.MM.YYYY')
        //       <= that.moment(item.created_at).format('DD.MM.YYYY'))  && (!that.dateRange.endDate || (that.dateRange.endDate && that.moment(that.dateRange.endDate).format('DD.MM.YYYY') >= that.moment(item.created_at).format('DD.MM.YYYY'))))
        //     && (that.status === 0 || (item.status === that.status))
        //   );
        // });
      },
    },

    watch: {
      listArrayInput(value) {
        if (value) {
          this.listArray = value;
        }
      },
      dateRange: {
    handler(newValue) {
      this.dateSelection(newValue)
    },
    deep: true, // Add deep: true if "dateRange" is an object or array for deep watching
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
      depSelection(e){
        this.$emit('depSelection',e);
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
      clearSelection() {
          this.dateRange.startDate=false;
          this.dateRange.endDate=false;
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
        if(typeof item.checklist_info === 'string'){

          item.checklist_info=JSON.parse(item.checklist_info)
        }
        that.editedItem = Object.assign({}, item);

        that.editedItem.start_date='',
        that.editedItem.start_date_pre='',
        that.editedItem.deadline='',
        that.editedItem.deadline_pre='',
        that.editedItem.type=item.category.type
        that.editedItem.category_name=item.category.name
        that.editedItem.checklist_description=item.checklist_info.description
        
        
        that.checkShowItem = true;
      },
      // editItem(item,index) {
      //   let data=index.index%2==0?true:false
      //   this.editedItem = Object.assign({}, item);
      //   this.editedItem.isRecurring=data
      //   this.checkShowItem = true;
      // },

      formatStatus(status) {
        if (status === 1) {
          return this.$i18n.t('table.new');
        } else if (status === 2) {
          return this.$i18n.t('table.on_going');
        } else if (status === 3) {
          return this.$i18n.t('table.closed');
        }
      },
    }
  };

</script>

<style scoped>
.close-date{
  position: absolute;
  top: 25%;
}
.close-date i{
  color: #6c757d;
  opacity: 0.5;
  font-size: 18px;
  margin-right: 5px;
}
.border-red{
  border: 1px solid #FD5155;
}
.border-yellow{
  border: 1px solid #FFD46F;
}
.border-green{
  border: 1px solid #4FAE57;
}
:deep(.reportlist-badge .v-badge__wrapper .v-badge__badge){
  inset: auto auto calc(100% - -4px) calc(100% - 48px) !important;
}
.status-btn {
  width: 97px;
}
</style>

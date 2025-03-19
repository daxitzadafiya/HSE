<template>
  <div>
    <ChecklistPopup
      :open-popup="checkShowItem"
      :industry-array="industryArray"
      :resource="checkResource"
      :view-only="viewOnly"
      :checklist-item="editedItem"
      :categories-array="categoriesArray"
      :job-title-array="jobTitleArray"
      :departments-array="departmentsArray"
      :predefined-link-array="predefinedLinkArray"
      @closePopup="checkShowItem = !checkShowItem"
      @reloadList="reloadList"
      @reloadListCategory="reloadListCategory"
      @showItem="showItem"
      @changeTab="changeTab"
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
        <div v-if="!noFilterSetting" class="setting-header">
          <div class="panel-heading">
            <h4 class="panel-title">
              {{ $t('title.sort_by') }}
            </h4>
            <b-row v-if="!resource">
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
                      v-model="dateRange"
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
                          {{ moment(picker.startDate).format('DD.MM.YYYY') }} - {{ moment(picker.endDate).format('DD.MM.YYYY') }}
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
                   v-model="isShowSearchField"
                    :label="$t('setting.search')"
                    class="text-box"
                  />
                </div>
              </b-col>
            </b-row>
            <!-- ADMIN -->
            <b-row v-if="resource && userRoleId === 1">
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
                      {{ moment(picker.startDate).format('DD.MM.YYYY') }} - {{ moment(picker.endDate).format('DD.MM.YYYY') }}
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
              <b-col cols="6">
                <div class="input-wrap field-search">
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
            <b-row v-if="resource && userRoleId > 1">
              <b-col cols="4">
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
                      {{ moment(picker.startDate).format('DD.MM.YYYY') }} - {{ moment(picker.endDate).format('DD.MM.YYYY') }}
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
                <div class="input-wrap field-search">
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
        </div>
      </template>

      <template v-slot:header="{ props: { headers } }">
        <h4 class="table-name">
          <span v-if="!resource">{{ $t('table.checklists') }}</span>
          <span v-if="resource">{{ $t('table.resources') }}</span>
        </h4>
      </template>
      <template v-slot:item.created_at="{ item }">
        {{ moment(item.created_at).format('DD.MM.YYYY') }}
      </template>
      <template v-slot:item.added_by_name="{ item }">
        <span v-if="item.added_by === 1">{{ $t('table.system') }}</span>
        <span v-else-if="item.added_by_name">{{ item.added_by_name }}</span>
        <span v-else>{{ item.firstName }} {{ item.lastName }}</span>
      </template>
      <template v-slot:item.is_security="{ item }">
        <v-hover v-slot:default="{ hover }">
          <v-badge :value="hover" right transition="slide-x-transition" class="hse--icon-question-circle w-25">
            <span slot="badge">{{ item.is_shared==0 ? $t('message.personal')  : $t('message.shared') }}</span>
              <img class="icon-img2" src="../assets/images/gridIcon/fillSecurity.png" alt="fillSecurity.png" @click.stop/>
          </v-badge>
        </v-hover>
      </template>
      <template v-slot:item.responsibleName="{ item}">
        <v-hover v-slot:default="{ hover }" v-if="item?.responsibleName?.length > 1">
          <v-badge :value="hover" transition="slide-x-transition" class="responsible-badge">
            <span slot="badge">{{ $t('message.responsible')+':'+ item.responsibleName}}</span>
            {{item?.responsibleName?.[0] + '...'}}
          </v-badge>
        </v-hover>
        <div v-else> 
          {{item?.responsibleName?.[0]}}
        </div>
      </template>

      <template v-slot:item.count_topic="{item}">
        <div v-if="item.count_topic">
          {{item.count_topic}}/{{ item.default_options ? item.default_options?.length : item?.checkpoints }}
        </div>
        <div v-else>

          {{item.topic}}/{{ item.checkpoints }}
        </div>
        
      </template>
      <template v-slot:no-data>
        {{ $t('table.no_data') }}
      </template>
    </v-data-table>

    <edit-checklist-popup :open-popup="editCheckList"
    :document-item="editedItem"
    :resource="checkResource"
    :industry-array="industryArray"
    :view-only="viewOnly"
    :editResponsible="editResponsible"
    :categories-array="categoriesArray"
    :job-title-array="jobTitleArray"
    :predefined-link-array="predefinedLinkArray"
    @closePopup="editCheckList = !editCheckList"
    @reloadList="reloadList"
    @resourceList="resourceList"
    @reloadListCategory="reloadListCategory"
    :titleMessage="$t('title.checklist_edit')"/>
  </div>
</template>

<script>
  import {_} from 'vue-underscore';
  import ChecklistPopup from "./ChecklistPopup";
  import cookies from "js-cookie";
import EditChecklistPopup from './EditChecklistPopup.vue';

  export default {
    name: "ChecklistTable",
    components: {
      ChecklistPopup,
        EditChecklistPopup,
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
      usersArray: Array,
      usersSelection: Array,
      objectId: {
        type: String,
        required: false,
      },
      predefinedLinkArray: {
        type: Array,
        required: false,
      },
      addedByResource:{
         type: Array,
        required: false,
      },
      search_value:{
        type: String,
        required: false,
      },
      statusSelect: {
        type: Array,
        required: false,
      },
      // listAnswerArray: Array,
    },
    data: () => ({
      // pageKey: 'company-checklists-checklists',
      // pageKeyResource: 'company-checklists-resources',
      userRoleId: parseInt(cookies.get('roleID')),
      userDepartmentID: parseInt(cookies.get('userDepartmentID')),
      permissionsUser: localStorage.getItem('permissionsKey'),
      checkAdmin: cookies.get('checkAdmin'),
      roleUser: cookies.get('roleUser'),
      nowDate: new Date().toISOString().substr(0, 10),
      // search: '',
      status: 0,
      added_by: 0,
      // statusArray: ['All', 'New', 'Ongoing', 'Closed'],
      listArray: [],
      editCheckList:false,
      editedItem: {
        name: "",
        description: "",
        category_id: "",
        company_id: "",
        status: "New",
        added_by: 0,
        department_id: "",
        job_title_id: '',
        is_template: false,
        checklist_used:''
      },
      menu: false,
      department: 0,
      job_title: 0,
      editResponsible:false,
      isShowDepartmentFilter: false,
      isShowJobTitleFilter: false,
      isShowSearchField:false,
      tabIndex: 0,
      formDirty: false,
      processing: {
        new: 0,
        total: 0,
        processing: 0,
        finished: 0
      },
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
      // category: 0,
      // answerArray: [],
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
      checkShowItem: false,
      checkResource: false,
    }),

    computed: {
      headers() {
        return [
          {text: this.translateCol('name'), align: 'left', value: 'name',width:'15%'},
          {text: this.translateCol('reported_by'), value: 'added_by_name', align: 'center',width:'15%',sortable: false},
          {text: this.translateCol('responsible'), value: 'responsibleName', align: 'center',width:'15%',sortable: false},
          {text: this.translateCol('category'), align: 'center', value: 'categoryName',width:'15%',sortable: false},
          {text: this.translateCol('revised'), value: 'created_at', align: 'center', sortable: false},
          {text: this.translateCol('topic_checkpoints'), align: 'center', value: 'count_topic',width:'15%',sortable: false},
          {text: this.translateCol('used'), align: 'center', value: 'checklist_used',width:'8%'},
          {text: this.translateCol('security'), value: 'is_security', align: 'center',width:'15%',sortable: false},
        ];
      },
      headersTemplate() {
        return [
          {text: this.translateCol('name'), align: 'left', value: 'name',width:'15%'},
          {text: this.translateCol('added_by'), value: 'added_by_name', align: 'center',width:'15%'},
          {text: this.translateCol('category'), align: 'center', value: 'category_name',width:'15%' ,sortable: false},
          {text: this.translateCol('topic'), align: 'center', value: 'count_topic',width:'15%',sortable: false},
          {text: this.translateCol('revised'), value: 'created_at', align: 'center', sortDesc: false ,width:'15%'},
          {text: this.translateCol('number_of_times_used'), value: 'checklist_used', align: 'center',width:'15%',sortable: false},
        ];
      },
      headersAdmin() {
        return [
          {text: this.translateCol('name'), align: 'left', value: 'name',width:'25%'},
          {text: this.translateCol('category'), align: 'center', value: 'category_name',width:'25%'},
          {text: this.translateCol('topic'), align: 'center', value: 'count_topic',width:'15%'},
          {text: this.translateCol('revised'), value: 'created_at', align: 'center', sortDesc: false,width:'15%'},
          {text: this.translateCol('number_of_times_used'), value: 'checklist_used', align: 'center',width:'20%',sortable: false},
        ];
      },
      computedHeaders () {
        let result;
        if (this.userRoleId === 1) {
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
        return that.listArray;
        //  return that.listArray.filter((item) => {
          
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
        //     (that.added_by === 0 || (item.added_by === that.added_by) || (item.added_by_name === "Anonymous" && that.added_by === 1))
        //     // (that.added_by === 0 || (item.added_by === that.added_by))
        //     && (that.department === 0 || (item.department_id === that.department))
        //     && (that.job_title === 0 || (item.job_title_id === that.job_title))
        //     && (!inputedStartDate || inputedStartDate <= getCreatedDate)
        //     && (!inputedEndDate || inputedEndDate >= getCreatedDate) 
        //   );
        // });
      },
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
      if (this.listArrayInput.length > 0) {
        this.listArray = this.listArrayInput;
      }

      if (this.resource) {
        this.checkResource = this.resource;
      }
    },

    methods: {
      translateCol (colName) {
        return this.$i18n.t('column.' + colName);
      },
      clearSelection() {
          this.dateRange.startDate=false;
          this.dateRange.endDate=false;
      },
       statusSelection(e){
        this.$emit('statusSelection',e);
      },
      jobSelection(e){
        this.$emit('jobSelection',e);
      },
      departmentSelection(e){
        this.$emit('departmentSelection',e);
      },

      textFeild(text){
      if (this.checkResource) {
        this.$emit('textFilterResource',text);
      }else{
        this.$emit('textFilter',text);
        }
      },
      dateSelection(dateValue){
        console.log("-------------------------------------");
        if (this.checkResource) {
          this.$emit('dateSelectionResource',dateValue);
        }else{
          this.$emit('dateSelection',dateValue);
        }
      },
      userSelection(user){
        if (this.checkResource) {
          this.$emit('userSelectionResource',user);
        }else{

          this.$emit('userSelection',user);
        }
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
      resourceList() {
        this.$emit('resourceList');
      },
      

      reloadListCategory(){
        this.$emit('reloadListCategory');
      },

      showItem(item) {
        this.editItem(item);
      },

      editItem(item) {
        this.editedItem = Object.assign({}, item);
        this.editCheckList = true;
        // this.editResponsible = item.checklist_used > 0 ? true : false
        this.checkResource=this.checkResource?true:false
      },

      changeTab(value) {
        this.$emit('changeTab', value);
      },
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
:deep(.v-badge__badge){
  inset: auto auto calc(121% - 4px) calc(-101% - 4px) !important;
}
.icon-img2{
  max-width: 82%;
}
:deep(.responsible-badge .v-badge__badge){
  inset:auto auto calc(121% - -6px) calc(-98% - 0px) !important;
  width: 305px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    background-color: #666768 !important;
}
</style>

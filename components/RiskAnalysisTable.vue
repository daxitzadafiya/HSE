<template>
  <div>
    <RiskAnalysisReviewPopup
      :open-popup="checkShowItem"
      :object-item="editedItem"
      :categories-array="categoriesArray"
      @closePopup="checkShowItem = !checkShowItem"
      @reloadList="reloadList"
      @reloadListCategory="reloadListCategory"
      :predefined-link-array="predefinedLinkArray"
    />

    <!-- <report-risk-analysis
    :open-popup="checkShowItem"
    :document-item="editedItem"
    @closePopup="checkShowItem = !checkShowItem"
  /> -->

    <!-- <RiskAnalysisPopup
      :open-popup="checkShowItem"
      :risk-analysis-item="editedItem"
      :project-array="projectArray"
      :job-title-array="jobTitleArray"
      :departments-array="departmentsArray"
      :task-assignees-array="taskAssigneesArray"
      :responsible-array="responsibleArray"
      @closePopup="checkShowItem = !checkShowItem"
      @reloadList="reloadList"
      @showItem="showItem"
    /> -->

    <v-data-table
      :headers="headers"
      :items="filteredItems"
      class="elevation-1 hse-table table-data"
      :items-per-page="15"
      :single-expand="true"
      :search="search_value"
      :sort-by="['created_at']"
      :sort-desc="[true, false]"
      @click:row="editItem"
      hide-default-footer
    >
      <template v-slot:top>
<!--        <div v-if="!noFilterSetting" class="status-boxes">-->
<!--          <b-row>-->
<!--            <b-col cols="3">-->
<!--     ------------     changes on globally add div after remove comment as on ReportChecklistTable -------- -->
<!--              <div class="status-box-wrap">-->
<!--                <h3>{{ processing.total }}</h3>-->
<!--                <p>{{ $t('title.total') }}</p>-->
<!--              </div>-->
<!--            </b-col>-->
<!--            <b-col cols="3">-->
<!--              <div class="status-box-wrap">-->
<!--                <h3>{{ processing.new }}</h3>-->
<!--                <p>{{ $t('title.new') }}</p>-->
<!--              </div>-->
<!--            </b-col>-->
<!--            <b-col cols="3">-->
<!--              <div class="status-box-wrap">-->
<!--                <h3>{{ processing.ongoing }}</h3>-->
<!--                <p>{{ $t('title.ongoing') }}</p>-->
<!--              </div>-->
<!--            </b-col>-->
<!--            <b-col cols="3">-->
<!--              <div class="status-box-wrap">-->
<!--                <h3>{{ processing.closed }}</h3>-->
<!--                <p>{{ $t('title.closed') }}</p>-->
<!--              </div>-->
<!--            </b-col>-->
<!--          </b-row>-->
<!--        </div>-->
        <div class="setting-header">
          <div class="panel-heading">
            <h4 class="panel-title">
              {{ $t('title.sort_by') }}
            </h4>
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
                      {{moment(picker.startDate).format('DD.MM.YYYY') }} -
                      {{moment(picker.endDate).format('DD.MM.YYYY') }}
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
<!--              <b-col cols="3">-->
<!--                <div class="field-selection">-->
<!--                  <v-select-->
<!--                    v-model="added_by"-->
<!--                    :items="usersSelection"-->
<!--                    item-value="id"-->
<!--                    :label="$t('setting.reported_by')"-->
<!--                    outlined-->
<!--                    class="text-box"-->
<!--                  >-->
<!--                    <template slot="selection" slot-scope="data">-->
<!--                      {{ data.item.first_name + ' ' + data.item.last_name }}-->
<!--                    </template>-->
<!--                    <template slot="item" slot-scope="data">-->
<!--                      {{ data.item.first_name + ' ' + data.item.last_name }}-->
<!--                    </template>-->
<!--                  </v-select>-->
<!--                </div>-->
<!--              </b-col>-->
              <b-col cols="4">
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
          </div>
          <div class="panel-footer text-right"></div>
        </div>
      </template>
      <template v-slot:header="{ props: { headers } }">
        <h4 class="table-name">
          {{ $t('table.report_risk_analysis') }}
        </h4>
      </template>
      <template v-slot:item.added_by_name="{ item }">
        <span v-if="item.report_as_anonymous == 1">
          {{'Anonymous'}}
        </span>
        <span v-else>

        {{ item.firstName }} {{ item.lastName }}
        </span>
      </template>
      <template v-slot:item.date="{ item }">
        <v-chip outlined label class="green">
          {{ moment(item.created_at).format('DD.MM.YYYY') }}
        </v-chip>
      </template>
      <template v-slot:item.risk_level="{ item }">
        <div v-if="item.risk_level && item.risk_level >= 1 && item.risk_level <= 3" class="source-of-danger-color-code color-green d-inline-block">
          {{ item.risk_level }}
        </div>
        <div v-if="item.risk_level && item.risk_level >= 4 && item.risk_level <= 10" class="source-of-danger-color-code color-yellow d-inline-block">
          {{ item.risk_level }}
        </div>
        <div v-if="item.risk_level && item.risk_level >= 11 && item.risk_level <= 15" class="source-of-danger-color-code color-orange d-inline-block">
          {{ item.risk_level }}
        </div>
        <div v-if="item.risk_level && item.risk_level === 16" class="source-of-danger-color-code color-red d-inline-block">
          {{ item.risk_level }}
        </div>
      </template>
      <template v-slot:item.status="{ item }">
        <!-- <v-chip
          v-if="item.status === 'new'"
          class="ma-2 status-btn status-label-custom pending "
          label
        >
          {{ $t('form.new') }}
        </v-chip>
        <v-chip
          v-else-if="item.status === 'pending'"
          class="ma-2 status-btn status-label-custom pending"
          label
        >
          {{ $t('form.pending') }}
        </v-chip>
        <v-chip
          v-else-if="item.status === 'ongoing'|| item.status == '2'"
          class="ma-2 status-btn status-label-custom ongoing"
          label
        >
          {{ $t('form.ongoing') }}
        </v-chip>
        <v-chip
          v-else-if="item.status === 'completed' || item.status == '1'"
          class="ma-2 status-btn status-label-custom completed"
          label
        >
          {{ $t('form.completed') }}
        </v-chip>
        <v-chip
          v-else-if="item.status === 'closed'"
          class="ma-2 status-btn status-label-custom approved"
          label
        >
          {{ $t('form.closed') }}
        </v-chip> -->
        <status-chip :status="item.status" :inReview="false" :inRisk="item.object_id == null ? true : false"
        />
      </template>
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
  // import RiskAnalysisPopup from "./RiskAnalysisPopup";
  import RiskAnalysisReviewPopup from "./RiskAnalysisReviewPopup.vue";
import StatusChip from './StatusChip.vue';
// import ReportRiskAnalysis from './ReportRiskAnalysis.vue';

  export default {
    name: "RiskAnalysisTable",
    components: {
      // RiskAnalysisPopup,
      RiskAnalysisReviewPopup,
        StatusChip,
        // ReportRiskAnalysis
    },
    props: {
      categoriesArray: {
        type: Array,
        required: false,
      },
      predefinedLinkArray: {
        type: Array,
        required: false,
      },
      listArrayInput: {
        type: Array,
        required: true,
      },
      // processing: {
      //   type: Object,
      //   required: false,
      // },
      // noFilterSetting: {
      //   type: Boolean,
      //   required: false,
      // },
      // viewOnly: {
      //   type: Boolean,
      //   required: false,
      // },
      objectId: {
        type: String,
        required: false,
      },
      usersSelection: {
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
    },
    data: () => ({
      userRoleId: parseInt(cookies.get('roleID')),
      // userDepartmentID: parseInt(cookies.get('userDepartmentID')),
      pageKey: 'reports-report-riskanalysis-risk-analysis',
      permissionsUser: localStorage.getItem('permissionsKey'),
      checkAdmin: cookies.get('checkAdmin'),
      roleUser: cookies.get('roleUser'),
      nowDate: new Date().toISOString().substr(0, 10),
      // search: '',
      status: 0,
      added_by: 0,
      listArray: [],
      editedItem: {},
      tabIndex: 0,
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
      // riskElementSourceArray: [],
      // dialogAction: false,
      // riskElementAnalysis: [],
      // checkNewRiskElement: false,
      // checkAddPlan: false,
      // menu: false,
      // checkPermission: '',
      checkShowItem: false,
    }),

    computed: {
      headers() {
        return [
          {text: this.translateCol('name'), value: 'name', align: 'left', sortable: false},
          {text: this.translateCol('category'), value: 'categoryName', align: 'center', sortable: false},
          {text: this.translateCol('reported_by'), value: 'added_by_name', align: 'center', sortable: false},
          {text: this.translateCol('responsible'), value: 'responsibleName', align: 'center', sortable: false},
          {text: this.translateCol('source'), value: 'source', align: 'center', sortable: false},
          {text: this.translateCol('date'), value: 'date', align: 'center', sortable: false},
          {text: this.translateCol('risk_level'), value: 'risk_level', align: 'center', sortable: false},
          {text: this.translateCol('status'), value: 'status', align: 'center', sortable: false},
        ];
      },

      // filteredItems() {
      //   let that = this;
      //   return that.listArray.filter((item) => {
      //     return ((that.added_by === 0 || (item.added_by === that.added_by))
      //       && (that.status === 0 || (that.status === item.status))
      //       && (!that.dateRange.startDate || (that.dateRange.startDate && that.moment(that.dateRange.startDate).format('DD.MM.YYYY')
      //         <= that.moment(item.created_at).format('DD.MM.YYYY')) && (!that.dateRange.endDate || (that.dateRange.endDate && that.moment(that.dateRange.endDate).format('DD.MM.YYYY') >= that.moment(item.created_at).format('DD.MM.YYYY')))));
      //   });
      // },

      filteredItems() {
        let that = this;

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
        //     (that.added_by === 0 || (item.added_by === that.added_by)  )
        //     && (!inputedStartDate || inputedStartDate <= getCreatedDate)
        //     && (!inputedEndDate || inputedEndDate >= getCreatedDate)
        //   );
        // });
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
      translateCol(colName) {
        return this.$i18n.t('column.' + colName);
      },
      clearSelection() {
          this.dateRange.startDate=false;
          this.dateRange.endDate=false;
      },
      statusSelection(e){
        this.$emit('statusSelection',e);
      },
      dateSelection(dateValue){
          this.$emit('dateSelection',dateValue);
      },
      textFeild(text){
        this.$emit('textFilter',text);
      },

      getObject() {
        let that = this;
        if (that.objectId) {
          _.each(that.listArray, function (item) {
            if (item.id === parseInt(that.objectId)) {
              that.editItem(item);
              let query = Object.assign({}, that.$route.query);
              delete query.id;
              that.$router.replace({query});
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

      editItem(item) {
        this.editedItem = Object.assign({}, item);
        this.checkShowItem = true;
      },

      formatStatus(status) {
        if (status === 'new') {
          return this.$i18n.t('table.new');
        } else if (status === 'ongoing') {
          return this.$i18n.t('table.on_going');
        } else if (status === 'closed') {
          return this.$i18n.t('table.closed');
        }
      },
    },
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
.status-btn {
  width: 97px;
}
</style>

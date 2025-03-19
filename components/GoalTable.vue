<template>
  <div>
    <GoalReviewPopup
      :open-popup="checkShowItem"
      :object-item="editedItem"
      :resource="resource"
      :industry-array="industryArray"
      :categories-array="categoriesArray || []"
      :predefined-link-array="predefinedLinkArray"
      @closePopup="checkShowItem = !checkShowItem"
      @reloadList="reloadList"
    />

<!--    <GoalPopup-->
<!--      :open-popup="checkShowItem"-->
<!--      :industry-array="industryArray"-->
<!--      :form-title="$t('title.edit_goal')"-->
<!--      :resource="checkResource"-->
<!--      :view-only="viewOnly"-->
<!--      :goal-item="editedItem"-->
<!--      :categories-array="categoriesArray"-->
<!--      :project-array="projectArray"-->
<!--      :job-title-array="jobTitleArray"-->
<!--      :departments-array="departmentsArray"-->
<!--      :task-assignees-array="taskAssigneesArray"-->
<!--      :responsible-array="responsibleArray"-->
<!--      :predefined-link-array="predefinedLinkArray"-->
<!--      @closePopup="checkShowItem = !checkShowItem"-->
<!--      @reloadList="reloadList"-->
<!--      @reloadListCategory="reloadListCategory"-->
<!--      @showItem="showItem"-->
<!--      @changeTab="changeTab"-->
<!--    />-->

    <v-data-table
      :headers="computedHeaders"
      :items="filteredItems"
      class="elevation-1 hse-table table-data"
      :items-per-page="15"
      :single-expand="true"
      :search="search"
      :sort-by="['created_at']"
      :sort-desc="[true, false]"
      :expanded.sync="expanded"
      @click:row="editItem"
      hide-default-footer
    >
      <template v-slot:top>
        <div v-if="!noFilterSetting && !checkResource" class="status-boxes">
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
                  <h3>{{ processing.finished }}</h3>
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
            <b-row v-if="!resource">
              <b-col cols="4">
                <div class="field-selection">
                  <v-select
                    v-model="added_by"
                    :label="$t('setting.added_by')"
                    item-value="id"
                    :items="usersSelection"
                    outlined
                    class="text-box"
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
                <div class="field-selection">
                  <v-select
                    v-model="status"
                    :items="statusArray"
                    item-value="value"
                    item-text="name"
                    :label="$t('setting.status')"
                    outlined
                    class="text-box"
                  />
                </div>
              </b-col>
              <b-col  cols="4">
                    <div class="field-selection field-search">
                      <v-text-field
                        v-model="search"
                        append-icon="search"
                        :label="$t('setting.search')"
                        outlined
                        class="text-box"
                      >
                    <template v-slot:append>
                      <img src="../assets/images/icon/magnifier.png" class="search-icon-cust">
                    </template>
                  </v-text-field> 
                    </div>
                  </b-col>
            </b-row>
            <!-- ADMIN -->
            <b-row v-if="resource && userRoleId === 1">
              <b-col cols="12">
                <div class="input-wrap field-search">
                  <v-text-field
                    v-model="search"
                    append-icon="search"
                    :label="$t('setting.search')"
                    outlined
                    class="text-box"
                  >
                    <template v-slot:append>
                      <img src="../assets/images/icon/magnifier.png" class="search-icon-cust">
                    </template>
                  </v-text-field> 
                </div>
              </b-col>
            </b-row>
            <!-- User -->
            <b-row v-if="resource && userRoleId > 1">
              <b-col cols="6">
                <div class="field-selection">
                  <v-select
                    v-model="added_by"
                    label="Added By"
                    item-text="name"
                    item-value="value"
                    :items="addedByResource"
                    outlined
                    class="text-box"
                  />
                </div>
              </b-col>
              <b-col cols="6">
                <div class="input-wrap field-search">
                  <v-text-field
                    v-model="search"
                    append-icon="search"
                    :label="$t('setting.search')"
                    outlined
                    class="text-box"
                  >
                    <template v-slot:append>
                      <img src="../assets/images/icon/magnifier.png" class="search-icon-cust">
                    </template>
                  </v-text-field> 
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
          <span v-if="!resource">{{ $t('table.goals') }}</span>
          <span v-if="resource">{{ $t('table.resources') }}</span>
        </h4>
      </template>

<!--      <template v-slot:item.updated_at="{ item }">-->
<!--        {{ moment(item.updated_at).format('DD.MM.YYYY') }}-->
<!--      </template>-->
      <template v-slot:item.added_by_name="{ item }">
        <span v-if="item.added_by === 1">{{ $t('table.system') }}</span>
        <span v-else>{{ item.firstName }} {{ item.lastName }}</span>
      </template>
      <template v-slot:item.type="{ item }">
        {{ item.countSubObject === 0 ? $t('form.main_goal') : item.countSubObject }}
      </template>
      <template v-slot:item.start_date="{ item }">
        {{ moment(item.start_date).format('DD.MM.YYYY h:mm A') }}
      </template>
      <template v-slot:item.deadline="{ item }">
        {{ moment(item.deadline).format('DD.MM.YYYY h:mm A') }}
      </template>
      <template v-slot:item.status="{ item }">
        <v-chip
          v-if="item.status === 'new'"
          class="ma-2 status-label-custom pending"
          label
        >
          {{ $t('form.new') }}
        </v-chip>
        <v-chip
          v-else-if="item.status === 'pending'"
          class="ma-2 status-label-custom pending"
          label
        >
          {{ $t('form.pending') }}
        </v-chip>
        <v-chip
          v-else-if="item.status === 'ongoing'"
          class="ma-2 status-label-custom ongoing"
          label
        >
          {{ $t('form.ongoing') }}
        </v-chip>
        <v-chip
          v-else-if="item.status === 'completed'"
          class="ma-2 status-label-custom completed"
          label
        >
          {{ $t('form.completed') }}
        </v-chip>
        <v-chip
          v-else-if="item.status === 'approved'"
          class="ma-2 status-label-custom approved"
          label
        >
          {{ $t('form.closed') }}
        </v-chip>
      </template>
      <template v-slot:item.last_edited="{ item }">
        <span v-if="compareDate(item)">
          {{ moment(item.created_at).format('DD.MM.YYYY') }}
        </span>
        <span v-else>
          {{ moment(item.created_at).format('DD.MM.YYYY') }} / {{ moment(item.updated_at).format('DD.MM.YYYY') }}
        </span>
      </template>
      <template v-slot:item.see_more="{ item }">
        <v-hover v-if="item.isCreator || item.isResponsible" v-slot:default="{ hover }">
          <v-badge :value="hover" left transition="slide-x-transition">
            <span slot="badge">{{ $t('message.attendees') }}</span>
            <img class="img-table-column" src="../assets/images/active-attendees.png" alt="see-more" @click.stop="expandAttendeeTable(item)" />
          </v-badge>
        </v-hover>
      </template>
      <!-- expand row table to show list Attendees -->
      <template v-if="showExpand" v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length" class="p-2">
          <v-data-table
            :headers="expandableHeaderAttendee"
            :items="item.see_more"
            class="elevation-1 hse-table-roles-permissions"
            :items-per-page="15"
            :single-expand="true"
            :sort-by="['created_at']"
            :sort-desc="[true, false]"
            hide-default-footer
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title>
                  <h4>{{ $t('form.attendee') }}</h4>
                </v-toolbar-title>
              </v-toolbar>
            </template>
            <template v-slot:item.comment="{ item }">
              <span v-if="item.comment">{{ item.comment }}</span>
              <span v-else>N/A</span>
            </template>
            <template v-slot:item.image="{ item }">
              <div>
                <v-icon :class="item.image ? 'icon-custom image' : 'icon-custom image img-gray-scale'">
                  mdi-image
                </v-icon>
              </div>
            </template>
            <template v-slot:item.status="{ item }">
              <v-chip
                v-if="item.status === 'new'"
                class="ma-2 status-label-custom pending"
                label
              >
                {{ $t('form.new') }}
              </v-chip>
              <v-chip
                v-else-if="item.status === 'pending'"
                class="ma-2 status-label-custom pending"
                label
              >
                {{ $t('form.pending') }}
              </v-chip>
              <v-chip
                v-else-if="item.status === 'ongoing'"
                class="ma-2 status-label-custom ongoing"
                label
              >
                {{ $t('form.ongoing') }}
              </v-chip>
              <v-chip
                v-else-if="item.status === 'completed'"
                class="ma-2 status-label-custom completed"
                label
              >
                {{ $t('form.completed') }}
              </v-chip>
              <v-chip
                v-else-if="item.status === 'approved'"
                class="ma-2 status-label-custom approved"
                label
              >
                {{ $t('form.closed') }}
              </v-chip>
            </template>
            <template v-slot:no-data>
              {{ $t('table.no_data') }}
            </template>
          </v-data-table>
        </td>
      </template>

<!--      <template v-slot:item.time_range="{ item }">-->
<!--        <span v-if="item.countSubObject === 0">-->
<!--          {{ moment(item.start_date).format('DD.MM.YYYY') }} / {{ moment(item.deadline).format('DD.MM.YYYY') }}-->
<!--        </span>-->
<!--        <span v-else>-->
<!--          - / - -->
<!--        </span>-->
<!--      </template>-->

<!--      <template v-slot:item.is_suggestion="{ item }">-->
<!--        <v-hover v-slot:default="{ hover }">-->
<!--          <v-badge :value="hover" left transition="slide-x-transition">-->
<!--            <span v-if="(item.is_suggestion === 1)" slot="badge">{{ $t('message.index') }}: {{ $t('table.yes') }}</span>-->
<!--            <span v-else slot="badge">{{ $t('message.index') }}: {{ $t('table.no') }}</span>-->
<!--            <img :class="item.is_suggestion === 0 ? 'img-gray-scale' : ''" src="../assets/images/gridIcon/Index.png" alt="index-icon" @click.stop />-->
<!--          </v-badge>-->
<!--        </v-hover>-->

<!--        <span v-if="item.is_suggestion === 1" class="indexed-item indexed-yes">-->
<!--          {{ $t('table.yes') }}-->
<!--        </span>-->
<!--        <span v-else class="indexed-item indexed-no">-->
<!--          {{ $t('table.no') }}-->
<!--        </span>-->
<!--      </template>-->

<!--      <template v-slot:item.rate="{ item }">-->
<!--        <v-progress-linear-->
<!--          v-if="item.rate >= 0"-->
<!--          height="25"-->
<!--          :color="item.rate === 0 ? 'rgb(231,134,134)' : item.rate === 100 ? 'rgb(153,213,128)' : 'rgb(255,214,101)'"-->
<!--          :value="item.rate"-->
<!--        >-->
<!--          <strong class="font-weight-bold" style="color: #141b04">{{ Math.ceil(item.rate) }}%</strong>-->
<!--        </v-progress-linear>-->
<!--      </template>-->
      <template v-slot:no-data>
        {{ $t('table.no_data') }}
      </template>
    <template #footer>
        <slot name="bottom"></slot>
    </template>
    </v-data-table>
  </div>
</template>

<script>
  import {_} from 'vue-underscore';
  // import GoalPopup from "./GoalPopup";
  import cookies from "js-cookie";
  import GoalReviewPopup from "./GoalReviewPopup";

  export default {
    name: "GoalTable",
    components: {
      // GoalPopup,
      GoalReviewPopup,
    },
    props: {
      resource: {
        type: Boolean,
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
      usersSelection: {
        type: Array,
        required: false,
      },
      listArrayInput: {
        type: Array,
        required: true,
      },
      industryArray: {
        type: Array,
        required: false,
      },
      processing: {
        type: Object,
        required: false,
      },
      noFilterSetting: {
        type: Boolean,
        required: false,
      },
      // viewOnly: {
      //   type: Boolean,
      //   required: false,
      // },
      // taskAssigneesArray: {
      //   type: Array,
      //   required: false,
      // },
      // responsibleArray: {
      //   type: Array,
      //   required: false,
      // },
      objectId: {
        type: String,
        required: false,
      },
      predefinedLinkArray: {
        type: Array,
        required: false,
      },
    },
    data: () => ({
      permissionsUser: localStorage.getItem('permissionsKey'),
      checkAdmin: cookies.get('checkAdmin'),
      userRoleId: parseInt(cookies.get('roleID')),
      // roleUser: cookies.get('roleUser'),
      search: '',
      status: 0,
      added_by: 0,
      menu: false,
      date: [],
      statusArray: [
        {
          value: 0,
          name: "All"
        },
        {
          value: 'new',
          name: "New"
        },
        {
          value: 2,
          name: "Ongoing"
        },
        {
          value: 3,
          name: "Closed"
        }
      ],
      editedItem: {},
      checkShowItem: false,
      listArray: [],
      checkResource: false,
      addedByResource: [ // filter Added by: System / Custom
        {
          value: 0,
          name: "All"
        }, {
          value: 1,
          name: "System"
        }, {
          value: 2,
          name: "Custom"
        }
      ],
      // expand
      expanded: [],
      showExpand: false,

      // opens: 'right',
      // singleDatePicker: false,
      // timePicker: false,
      // timePicker24Hour: true,
      // showWeekNumbers: false,
      // showDropdowns: "",
      // autoApply: false,
      // dateTest: new Date(),
      // dateRange: {
      //   startDate: false,
      //   endDate: false
      // },
      // linkedCalendars: "",
      // alwaysShowCalendars: '',
      // localData: {
      //   monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      //   firstDay: 1
      // },
      // isShowDepartmentFilter: false,
      // isShowJobTitleFilter: false,
      // isShowProjectFilter: false,
      // department: 0,
      // job_title: 0,
      // project: 0,
    }),

    computed: {
      headers() {
        return [
          {text: this.translateCol('name'), value: 'name', align: 'left', sortable: false},
          {text: this.translateCol('category'), value: 'categoryName', align: 'center', sortable: false},
          {text: this.translateCol('added_by'), value: 'added_by_name', align: 'center', sortable: false},
          {text: this.translateCol('responsible'), value: 'responsibleName', align: 'center', sortable: false},
          {text: this.translateCol('type'), value: 'type', align: 'center', sortable: false},
          {text: this.translateCol('start_date'), value: 'start_date', align: 'center', sortable: false},
          {text: this.translateCol('deadline'), value: 'deadline', align: 'center', sortable: false},
          {text: this.translateCol('status'), value: 'status', align: 'center', sortable: false},
          {text: this.translateCol('see_more'), value: 'see_more', align: 'center', sortable: false},

          // {text: this.translateCol('indexed'), value: 'is_suggestion', align: 'center', sortable: false},
          // {text: this.translateCol('time_range'), value: 'time_range', align: 'center', sortable: false},
          // {text: this.translateCol('rate_of_progress'), value: 'rate', align: 'left'},
        ];
      },
      headersAttendee() {
        return [
          {text: this.translateCol('name'), value: 'name', align: 'left', sortable: false},
          {text: this.translateCol('category'), value: 'categoryName', align: 'center', sortable: false},
          {text: this.translateCol('added_by'), value: 'added_by_name', align: 'center', sortDesc: false, sortable: false},
          {text: this.translateCol('responsible'), value: 'responsibleName', align: 'center', sortable: false},
          {text: this.translateCol('type'), value: 'type', align: 'center', sortable: false},
          {text: this.translateCol('start_date'), value: 'start_date', align: 'center', sortable: false},
          {text: this.translateCol('deadline'), value: 'deadline', align: 'center', sortable: false},
          {text: this.translateCol('status'), value: 'status', align: 'center', sortable: false},
        ];
      },
      headersTemplate() {
        return [
          {text: this.translateCol('name'), align: 'left', value: 'name', sortable: false},
          {text: this.translateCol('category'), value: 'categoryName', align: 'center', sortable: false},
          {text: this.translateCol('added_by'), value: 'added_by_name', align: 'center', sortable: false},
          {text: this.translateCol('type'), align: 'center', value: 'type', sortable: false},
          {text: this.translateCol('last_edited'), value: 'last_edited', align: 'center', sortDesc: false, sortable: false},
          {text: this.translateCol('number_of_times_used'), value: 'number_used_time', align: 'center', sortable: false},
        ];
      },

      expandableHeaderAttendee() {
        return [
          {text: this.translateCol('employee_name'), value: 'attendeeName', align: 'left', sortable: false},
          {text: this.translateCol('comment'), value: 'comment', align: 'center', sortable: false},
          {text: this.translateCol('image'), value: 'image', align: 'center', sortable: false},
          {text: this.translateCol('status'), value: 'status', align: 'center', sortable: false},
        ];
      },

      computedHeaders () {
        let result;
        if (this.checkResource) {
          result = this.headersTemplate;
        } else {
          if (this.userRoleId === 4) {
            result = this.headersAttendee;
          } else {
            result = this.headers;
          }
        }

        // if (this.userRoleId === 1) {
        //   result = this.headersAdmin;
        // } else {
        //   if (this.checkResource) {
        //     result = this.headersTemplate;
        //   } else {
        //     result = this.headers;
        //   }
        // }
        return result;
      },

      filteredItems() {
        let that = this;
        return that.listArray.filter((item) => {
          return ((that.added_by === 0 || (item.added_by === that.added_by))
            // && (that.department === 0 || (item.department_id === that.department))
            // && (that.job_title === 0 || (item.job_title_id === that.job_title))
            // && (that.project === 0 || (item.project_id === that.project))
            // && (!that.dateRange.startDate || (that.dateRange.startDate && that.moment(that.dateRange.startDate)
            //   <= that.moment(item.updated_at))  && (!that.dateRange.endDate || (that.dateRange.endDate && that.moment(that.dateRange.endDate) >= that.moment(item.updated_at))))
            // && (that.status === 0 || (item.status === that.status))
          );
        });
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

      formatStatus(status) {
        if (status === 'new') {
          return this.$i18n.t('table.new');
        } else if (status === 2) {
          return this.$i18n.t('table.on_going');
        } else if (status === 3) {
          return this.$i18n.t('table.closed');
        }
      },

      formatDate(date) {
        if (!date) return null;
        const [year, month, day] = date.split(' ')[0].split('-');
        return `${day}/${month}/${year}`;
      },

      editItem(item) {
        this.editedItem = Object.assign({}, item);
        this.checkShowItem = true;
      },

      changeTab(value) {
        this.$emit('changeTab', value);
      },

      compareDate(item) { // check created_at and updated_at
        let created = item.created_at;
        let updated = item.updated_at;
        const [year, month, day] = created.split('-');
        const [yearToday, monthToday, dayToday] = updated.split('-');
        return yearToday === year && monthToday === month && dayToday === day;
      },

      expandAttendeeTable(item) {
        this.showExpand = !this.showExpand;
        this.expanded = [];
        const indexExpanded = this.expanded.findIndex((i) => i === item);
        if (indexExpanded > -1) {
          this.expanded.splice(indexExpanded, 1);
        } else {
          this.expanded.push(item);
        }
      },
    }
  };

</script>

<style scoped>

</style>

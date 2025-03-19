<template>
  <div>
    <StatementPopup
      :open-popup="checkShowItem"
      :view-only="viewOnly"
      :statement-item="editedItem"
      :contacts-array="contactsArray"
      @closePopup="checkShowItem = !checkShowItem"
      @reloadList="reloadList"
      @showItem="showItem"
    />

    <v-data-table
      :headers="computedHeaders"
      :items="listArray"
      class="elevation-1 hse-table table-data"
      :items-per-page="25"
      :single-expand="true"
      :search="search"
      :sort-by="['created_at']"
      :sort-desc="[true, false]"
      @click:row="editItem"
    >
      <template v-slot:top>
        <div class="setting-header">
          <div class="panel-heading">
            <h4 class="panel-title">
              {{ $t('title.sort_by') }}
            </h4>
            <!-- Super ADMIN -->
            <b-row v-if="checkSuperAdmin">
              <b-col>
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
            <!-- Company -->
            <b-row v-else>
              <b-col cols="6">
                <div class="field-selection">
                  <v-select
                    v-model="added_by"
                    :label="$t('setting.added_by')"
                    item-text="name"
                    item-value="value"
                    :items="addedByResource"
                    outlined
                    class="text-box"
                  />
                </div>
              </b-col>
              <b-col cols="6">
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
          </div>
        </div>
      </template>

      <template v-slot:header="{ props: { headers } }">
        <h4 class="table-name">
          {{ $t('table.hse_statement') }}
        </h4>
      </template>
      <template v-slot:item.user_added="{ item }">
        {{ item.user_added.first_name }} {{ item.user_added.last_name }}
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
  import StatementPopup from "./StatementPopup";
  import cookies from "js-cookie";

  export default {
    name: "StatementTable",
    components: {
      StatementPopup,
    },
    props: {
      // resource: {
      //   type: Boolean,
      //   required: false,
      // },
      categoriesArray: {
        type: Array,
        required: false,
      },
      categoriesSelection: {
        type: Array,
        required: false,
      },
      listArrayInput: Array,
      noFilterSetting: {
        type: Boolean,
        required: false,
      },
      viewOnly: {
        type: Boolean,
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
    },
    data: () => ({
      permissionsUser: localStorage.getItem('permissionsKey'),
      userRoleId: parseInt(cookies.get('roleID')),
      checkSuperAdmin: cookies.get('checkSuperAdmin'),
      checkAdmin: cookies.get('checkAdmin'),
      // roleUser: cookies.get('roleUser'),
      // nowDate: new Date().toISOString().substr(0, 10),
      search: '',
      listArray: [],
      editedItem: {
        title: '',
        description: '',
        disable_status: '',
        is_template: false
      },
      // menu: false,
      added_by: 0,
      // department: 0,
      // job_title: 0,
      // project: 0,
      // category: 0,
      // isShowDepartmentFilter: false,
      // isShowJobTitleFilter: false,
      // isShowProjectFilter: false,
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
      checkShowItem: false,
      // checkResource: false,
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
    }),

    computed: {
      headers() {
        return [
          {text: this.translateCol('title'), value: 'title', align: 'left'},
          {text: this.translateCol('added_by'), value: 'user_added', align: 'left'},
        ];
      },
      headersAdmin() {
        return [
          {text: this.translateCol('title'), value: 'title', align: 'left'},
        ];
      },

      computedHeaders () {
        let result;
        if (this.checkSuperAdmin) {
          result = this.headersAdmin;
        } else {
          result = this.headers;
        }
        // if(!this.isShowDepartmentFilter){
        //   result = _.filter(result, function(item){
        //     return item.value !== 'department_name';
        //   });
        // }
        // if(!this.isShowJobTitleFilter){
        //   result = _.filter(result, function(item){
        //     return item.value !== 'job_title_name';
        //   });
        // }
        // if(!this.isShowProjectFilter){
        //   result = _.filter(result, function(item){
        //     return item.value !== 'project_name';
        //   });
        // }
        return result;
      },

      // filteredItems() {
      //   let that = this;
      //   return that.listArray.filter((item) => {
      //     return ((that.category === 0 || (that.category === item.category_id))
      //       && (that.added_by === 0 || (item.added_by === that.added_by))
      //       && (that.department === 0 || (item.department_id === that.department))
      //       && (that.job_title === 0 || (item.job_title_id === that.job_title))
      //       && (that.project === 0 || (item.project_id === that.project))
      //       && (!that.dateRange.startDate || (that.dateRange.startDate && that.moment(that.dateRange.startDate)
      //         <= that.moment(item.deadline))  && (!that.dateRange.endDate || (that.dateRange.endDate && that.moment(that.dateRange.endDate) >= that.moment(item.deadline)))));
      //   });
      // },
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

      // resource(value) {
      //   if (value) {
      //     this.checkResource = value;
      //   }
      // },
    },

    created() {
      if (this.listArrayInput.length > 0) {
        this.listArray = this.listArrayInput;
      }

      // if (this.resource) {
      //   this.checkResource = this.resource;
      // }
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

      // changeTab(value) {
      //   this.$emit('changeTab', value);
      // },

      // formatDate(date) {
      //   if (!date) return null;
      //   const [year, month, day] = date.split(' ')[0].split('-');
      //   return `${day}/${month}/${year}`;
      // },

      // updateResource(value) {
      //   this.checkResource = value;
      // },

      showItem(item) {
        this.editItem(item);
      },

      editItem(item) {
        this.editedItem = Object.assign({}, item);
        this.checkShowItem = true;
      },

      // checkDenyEdit() {
      //   this.$emit('checkDenyEdit');
      // },
    }
  };

</script>

<style scoped>

</style>

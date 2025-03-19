<template>
  <div>
    <InstructionReviewPopup
      :open-popup="checkShowItem"
      :object-item="editedItem"
      :resource="resource"
      :industry-array="industryArray"
      :categories-array="categoriesArray"
      :predefined-link-array="predefinedLinkArray"
      @closePopup="checkShowItem = !checkShowItem"
      @reloadList="reloadList"
      @reloadListCategory="reloadListCategory"
    />

<!--    <InstructionPopup-->
<!--      :open-popup="checkShowItem"-->
<!--      :industry-array="industryArray"-->
<!--      :resource="checkResource"-->
<!--      :view-only="viewOnly"-->
<!--      :instruction-item="editedItem"-->
<!--      :categories-array="categoriesArray"-->
<!--      :project-array="projectArray"-->
<!--      :job-title-array="jobTitleArray"-->
<!--      :departments-array="departmentsArray"-->
<!--      :employees-array="employeesArray"-->
<!--      :predefined-link-array="predefinedLinkArray"-->
<!--      @closePopup="checkShowItem = !checkShowItem"-->
<!--      @reloadList="reloadList"-->
<!--      @reloadListCategory="reloadListCategory"-->
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
    >
      <template v-slot:top>
        <div class="setting-header">
          <div class="panel-heading">
            <h4 class="panel-title">
              {{ $t('title.sort_by') }}
            </h4>
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

<!--            &lt;!&ndash; ADMIN &ndash;&gt;-->
<!--            <b-row v-if="resource && userRoleId === 1">-->
<!--              <b-col cols="6">-->
<!--                <div class="field-selection">-->
<!--                  <v-select-->
<!--                    v-model="category"-->
<!--                    :items="categoriesSelection"-->
<!--                    item-text="name"-->
<!--                    item-value="id"-->
<!--                    :label="$t('setting.category')"-->
<!--                    outlined-->
<!--                    class="text-box"-->
<!--                  />-->
<!--                </div>-->
<!--              </b-col>-->
<!--              <b-col cols="6">-->
<!--                <div class="field-selection field-search">-->
<!--                  <v-text-field-->
<!--                    v-model="search"-->
<!--                    append-icon="search"-->
<!--                    :label="$t('setting.search')"-->
<!--                    outlined-->
<!--                    class="text-box"-->
<!--                  />-->
<!--                </div>-->
<!--              </b-col>-->
<!--            </b-row>-->
<!--            &lt;!&ndash; User &ndash;&gt;-->
<!--            <b-row v-if="resource && userRoleId > 1">-->
<!--              <b-col cols="4">-->
<!--                <div class="field-selection">-->
<!--                  <v-select-->
<!--                    v-model="category"-->
<!--                    :items="categoriesSelection"-->
<!--                    item-text="name"-->
<!--                    item-value="id"-->
<!--                    :label="$t('setting.category')"-->
<!--                    outlined-->
<!--                    class="text-box"-->
<!--                  />-->
<!--                </div>-->
<!--              </b-col>-->
<!--              <b-col cols="4">-->
<!--                <div class="field-selection">-->
<!--                  <v-select-->
<!--                    v-model="added_by"-->
<!--                    :label="$t('setting.added_by')"-->
<!--                    item-text="name"-->
<!--                    item-value="value"-->
<!--                    :items="addedByResource"-->
<!--                    outlined-->
<!--                    class="text-box"-->
<!--                  />-->
<!--                </div>-->
<!--              </b-col>-->
<!--              <b-col cols="4">-->
<!--                <div class="field-selection field-search">-->
<!--                  <v-text-field-->
<!--                    v-model="search"-->
<!--                    append-icon="search"-->
<!--                    :label="$t('setting.search')"-->
<!--                    outlined-->
<!--                    class="text-box"-->
<!--                  />-->
<!--                </div>-->
<!--              </b-col>-->
<!--            </b-row>-->
          </div>
          <div class="panel-footer text-right"></div>
        </div>
      </template>

      <template v-slot:header="{ props: { headers } }">
        <h4 class="table-name">
          <span v-if="!resource">{{ $t('table.instructions') }}</span>
          <span v-if="resource">{{ $t('table.resources') }}</span>
        </h4>
      </template>

      <template v-slot:item.added_by_name="{ item }">
        <span v-if="item.added_by === 1">{{ $t('table.system') }}</span>
        <span v-else>{{ item.firstName }} {{ item.lastName }}</span>
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
            <img :class="item.countSubObject === 0 ? 'img-table-column img-gray-scale' : 'img-table-column'" src="../assets/images/active-attendees.png" alt="see-more" @click.stop="expandAttendeeTable(item)" />
          </v-badge>
        </v-hover>
      </template>
      <!-- expand row table to show list Attendees -->
      <template v-if="showExpand" v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length" class="table-expand-show-attendee p-3">
          <div class="title-expand pb-5">
            {{ $t('form.attendee') }}
          </div>
          <b-row class="expand">
            <b-col v-for="(i, index) in item.attendeeName" :key="index" cols="6" class="expand-item">
              <div>
                {{ i.name }}
              </div>
            </b-col>
          </b-row>
        </td>
      </template>

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
      <template v-slot:no-data>
        {{ $t('table.no_data') }}
      </template>
    </v-data-table>
  </div>
</template>

<script>
  import {_} from 'vue-underscore';
  // import InstructionPopup from "./InstructionPopup";
  import cookies from "js-cookie";
  import InstructionReviewPopup from "./InstructionReviewPopup";

  export default {
    name: "InstructionTable",
    components: {
      // InstructionPopup,
      InstructionReviewPopup,
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
      listArrayInput: {
        type: Array,
        required: true,
      },
      industryArray: {
        type: Array,
        required: false,
      },
      // noFilterSetting: {
      //   type: Boolean,
      //   required: false,
      // },
      // viewOnly: {
      //   type: Boolean,
      //   required: false,
      // },
      // employeesArray: {
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
      listArray: [],
      editedItem: {},
      added_by: 0,
      category: 0,
      tabIndex: 0,
      formDirty: false,
      checkShowItem: false,
      checkResource: false,
      // expand
      expanded: [],
      showExpand: false,

      // date: [],
      // menu: false,
      // editedIndex: -1,
      // assignee: 'All',
      // activityArray: [],
      // read data
      // required: [
      //   v => {
      //     if (!v || v.length < 1)
      //       return 'This is required';
      //     else return true;
      //   }
      // ],
      // dataDefault: {
      //   id: 0,
      //   first_name: "All",
      //   last_name: "",
      // },
      // categoriesDefault: {
      //   id: 0,
      //   name: "All"
      // },
      // added_by_resource: 0,
      // category_resource: 0,
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
          {text: this.translateCol('name'), value: 'name', align: 'left', sortable: false},
          {text: this.translateCol('added_by'), value: 'added_by_name', align: 'center', sortDesc: false, sortable: false},
          {text: this.translateCol('responsible'), value: 'responsibleName', align: 'center', sortable: false},
          {text: this.translateCol('category'), value: 'categoryName', align: 'center', sortable: false},
          {text: this.translateCol('activities'), value: 'countSubObject', align: 'center', sortable: false},
          {text: this.translateCol('last_edited'), value: 'last_edited', align: 'center', sortable: false},
          {text: this.translateCol('see_more'), value: 'see_more', align: 'center', sortable: false},
        ];
      },
      headersAttendee() {
        return [
          {text: this.translateCol('name'), value: 'name', align: 'left', sortable: false},
          {text: this.translateCol('added_by'), value: 'added_by_name', align: 'center', sortDesc: false, sortable: false},
          {text: this.translateCol('responsible'), value: 'responsibleName', align: 'center', sortable: false},
          {text: this.translateCol('category'), value: 'categoryName', align: 'center', sortable: false},
          {text: this.translateCol('activities'), value: 'countSubObject', align: 'center', sortable: false},
          {text: this.translateCol('last_edited'), value: 'last_edited', align: 'center', sortable: false},
        ];
      },
      headersTemplate() {
        return [
          {text: this.translateCol('name'), value: 'name', align: 'left', sortable: false},
          {text: this.translateCol('category'), value: 'categoryName', align: 'center', sortable: false},
          {text: this.translateCol('activities'), value: 'countSubObject', align: 'center', sortable: false},
          {text: this.translateCol('number_of_times_used'), value: 'number_used_time', align: 'center', sortable: false},
          {text: this.translateCol('last_edited'), value: 'last_edited', align: 'center', sortable: false},
        ];
      },
      // headersAdmin() {
      //   return [
      //     {text: this.translateCol('name'), align: 'left', value: 'name', sortable: false},
      //     {text: this.translateCol('category'), value: 'categoryName', align: 'center', sortable: false},
      //     {text: this.translateCol('activities'), value: 'countSubObject', align: 'center', sortable: false},
      //     {text: this.translateCol('last_edited'), value: 'last_edited', align: 'center', sortDesc: false, sortable: false},
      //     {text: this.translateCol('number_of_times_used'), value: 'count_related_object', align: 'center', sortable: false},
      //   ];
      // },

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
        // } else {}
        return result;
      },

      filteredItems() {
        let that = this;
        return that.listArray.filter((item) => {
          return ((that.category === 0 || (that.category === item.category_id))
            && (that.added_by === 0 || (item.added_by === that.added_by))
            );
        });
      },
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

      changeTab(value) {
        this.$emit('changeTab', value);
      },

      reloadList() {
        this.$emit('reloadList');
      },

      reloadListCategory(){
        this.$emit('reloadListCategory');
      },

      editItem(item) {
        this.editedItem = Object.assign({}, item);
        // this.editedItem.check = true;
        this.checkShowItem = true;
      },

      compareDate(item) { // check created_at and updated_at
        let created = item.created_at;
        let updated = item.updated_at;
        const [year, month, day] = created.split('-');
        const [yearToday, monthToday, dayToday] = updated.split('-');
        return yearToday === year && monthToday === month && dayToday === day;
      },

      expandAttendeeTable(item) {
        if (item.countSubObject > 0) {
          this.showExpand = !this.showExpand;
          this.expanded = [];
          const indexExpanded = this.expanded.findIndex((i) => i === item);
          if (indexExpanded > -1) {
            this.expanded.splice(indexExpanded, 1);
          } else {
            this.expanded.push(item);
          }
        }
      },

      // formatDate(date) {
      //   if (!date) return null;
      //   const [year, month, day] = date.split(' ')[0].split('-');
      //   return `${day}/${month}/${year}`;
      // },

      // showItem(item) {
      //   this.editItem(item);
      // },

      // checkDenyEdit() {
      //   this.$emit('checkDenyEdit');
      // },
    }
  };

</script>

<style scoped>

</style>

<template>
  <div>
    <RiskElementReviewPopup
      :open-popup="checkShowItem"
      :object-item="editedItem"
      :categories-array="categoriesArray || []"
      :predefined-link-array="predefinedLinkArray"
      @closePopup="checkShowItem = !checkShowItem"
      @reloadList="reloadList"
    />

    <!-- <RiskAreaPopup
      :open-popup="checkShowItem"
      :industry-array="industryArray"
      :resource="checkResource"
      :view-only="viewOnly"
      :risk-area-item="editedItem"
      :categories-array="categoriesArray"
      :job-title-array="jobTitleArray"
      :departments-array="departmentsArray"
      :predefined-link-array="predefinedLinkArray"
      @closePopup="checkShowItem = !checkShowItem"
      @reloadList="reloadList"
      @reloadListCategory="reloadListCategory"
      @showItem="showItem"
      @updateResource="updateResource"
    /> -->

    <v-data-table
      :headers="computedHeaders"
      :items="filteredItems"
      class="elevation-1 hse-table table-data"
      :items-per-page="15"
      :single-expand="true"
      :search="search"
      :sort-by="['created_at']"
      :sort-desc="[true, false]"
      @click:row="editItem"
      hide-default-footer
    >
      <template v-slot:top>
        <div class="setting-header">
          <div class="panel-heading">
            <h4 class="panel-title">
              {{ $t('title.sort_by') }}
            </h4>
            <b-row v-if="!resource">
              <b-col cols="12">
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
            <!-- User -->
            <b-row v-if="resource && userRoleId > 1">
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
        </div>
      </template>

      <template v-slot:header="{ props: { headers } }">
        <h4 class="table-name">
          {{ $t('table.risk_elements') }}
        </h4>
      </template>
      <template v-slot:item.added_by_name="{ item }">
        <span v-if="item.added_by === 1">{{ $t('table.system') }}</span>
        <span v-else>{{ item.firstName }} {{ item.lastName }}</span>
      </template>
      <template v-slot:item.number_used_time="{ item }">
        <span>{{ item.risk_element_number_used_time }}</span>
      </template>
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
  // import moment from 'moment';
  // import RiskAreaPopup from "./RiskAreaPopup";
  import RiskElementReviewPopup from "./RiskElementReviewPopup.vue";
  import cookies from "js-cookie";

  export default {
    name: "RiskAreaTable",
    components: {
      RiskElementReviewPopup,
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
      viewOnly: {
        type: Boolean,
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
    },
    data: () => ({
      permissionsUser: localStorage.getItem('permissionsKey'),
      userRoleId: parseInt(cookies.get('roleID')),
      checkAdmin: cookies.get('checkAdmin'),
      // roleUser: cookies.get('roleUser'),
      // nowDate: new Date().toISOString().substr(0, 10),
      search: '',
      listArray: [],
      editedItem: {},
      // editedItem: {
      //   name: '',
      //   description: '',
      //   category_id: '',
      //   type: '',
      //   added_from: '',
      //   type_of_attachment: false,
      //   attachment: '',
      //   department_id: '',
      //   job_title_id: '',
      //   is_public: false,
      //   count_related_object: 0,
      //   related_objects: [],
      //   is_shortcut:false,
      // },
      added_by: 0,
      checkShowItem: false,
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
    }),

    computed: {
      headers() {
        return [
          {text: this.translateCol('name'), value: 'name', align: 'left', sortable: false},
          {text: this.translateCol('added_by'), value: 'added_by_name', align: 'center', sortable: false},
          {text: this.translateCol('category'), value: 'categoryName', align: 'center', sortable: false},
          {text: this.translateCol('number_of_times_used'), value: 'number_used_time', align: 'center', sortable: false},
          // {text: this.translateCol('indexed'), value: 'is_suggestion', align: 'center'},
        ];
      },
      headersAdmin() {
        return [
          {text: this.translateCol('name'), value: 'name', align: 'left', sortable: false},
          {text: this.translateCol('category'), value: 'category_name', align: 'center', sortable: false},
        ];
      },

      computedHeaders () {
        let result;
        if (this.userRoleId === 1) {
          result = this.headersAdmin;
        } else {
          result = this.headers;
        }
        return result;
      },

      filteredItems() {
        let that = this;
        return that.listArray.filter((item) => {
          return ((that.added_by === 0 || (item.added_by === that.added_by)));
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

      // formatDate(date) {
      //   if (!date) return null;
      //   const [year, month, day] = date.split(' ')[0].split('-');
      //   return `${day}/${month}/${year}`;
      // },

      updateResource(value) {
        this.checkResource = value;
      },

      // showItem(item) {
      //   this.editItem(item);
      // },

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

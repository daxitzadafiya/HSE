<template>
  <div>
    <JobTitlePopup
      :open-popup="checkShowItem"
      :industry-array="industryArray"
      :roles-array="rolesArray"
      :resource="checkResource"
      :job-title-item="editedItem"
      :departments-array="departmentsArray"
      @closePopup="checkShowItem = !checkShowItem"
      @reloadList="reloadList"
    />

    <v-data-table
      :headers="headers"
      :items="filteredItems"
      class="elevation-1 hse-table table-data"
      :items-per-page="15"
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
            <b-row>
              <b-col cols="6">
                <div class="field-selection">
                  <v-select
                    v-model="role"
                    :items="rolesSelection"
                    item-text="name"
                    item-value="id"
                    :label="$t('setting.role')"
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
          <div class="panel-footer text-right"></div>
        </div>
      </template>

      <template v-slot:header="{ props: { headers } }">
        <h4 class="table-name">
          <span v-if="!resource">{{ $t('table.job_titles') }}</span>
          <span v-if="resource">{{ $t('table.resources') }}</span>
        </h4>
      </template>

      <template v-slot:item.role_name="{ item }">
        {{ formatRoleName(item.role_name) }}
      </template>

      <template v-slot:no-data>
        {{ $t('table.no_data') }}
      </template>
    </v-data-table>
  </div>
</template>

<script>
  import JobTitlePopup from "./JobTitlePopup";
  import cookies from "js-cookie";
  import {_} from "vue-underscore";

  export default {
    name: "JobTitleTable",
    components: {
      JobTitlePopup,
    },
    props: {
      resource: {
        type: Boolean,
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
      listArrayInput: Array,
      industryArray: {
        type: Array,
        required: false,
      },
      rolesArray: Array,
      rolesSelection: Array,
    },
    data: () => ({
      permissionsUser: localStorage.getItem('permissionsKey'),
      userRoleId: parseInt(cookies.get('roleID')),
      checkAdmin: cookies.get('checkAdmin'),
      // roleUser: cookies.get('roleUser'),
      // nowDate: new Date().toISOString().substr(0, 10),
      search: '',
      listArray: [],
      editedItem: {
        name: '',
        role_id: '',
        role_name: '',
        is_super: '',
        permission: '',
        department: [],
      },
      menu: false,
      added_by: 0,
      department: 0,
      role: 0,
      checkShowItem: false,
      checkResource: false,
    }),

    computed: {
      headers() {
        return [
          {text: this.translateCol('name'), value: 'name', align: 'left'},
          {text: this.translateCol('role'), value: 'role_name', align: 'center'},
        ];
      },

      computedHeaders () {
        return this.headers;
      },

      filteredItems() {
        let that = this;
        return that.listArray.filter((item) => {
          return ((that.category === 0 || (that.category === item.category_id))
            && (that.role === 0 || (that.role === item.role_id)));
        });
      },
    },

    watch: {
      listArrayInput(value) {
        if (value) {
          this.listArray = _.filter(value, function (item) {
            return !item.disable_status;
          });
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
        // this.listArray = this.listArrayInput;
        this.listArray = _.filter(this.listArrayInput, function (item) {
          return !item.disable_status;
        });
      }

      if (this.resource) {
        this.checkResource = this.resource;
      }
    },

    methods: {
      translateCol (colName) {
        return this.$i18n.t('column.' + colName);
      },

      reloadList() {
        this.$emit('reloadList');
      },

      formatRoleName(name) {
        if (name === 'Manager') {
          return this.$i18n.t('form.manager');
        } else if (name === 'User') {
          return this.$i18n.t('form.user');
        }
      },

      // formatDate(date) {
      //   if (!date) return null;
      //   const [year, month, day] = date.split(' ')[0].split('-');
      //   return `${day}/${month}/${year}`;
      // },
      //
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

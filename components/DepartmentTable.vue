<template>
  <div>
    <DepartmentPopup
      :open-popup="checkShowItem"
      :department-item="editedItem"
      @closePopup="checkShowItem = !checkShowItem"
      :list-array-input="listArray"
      @reloadList="reloadList"
      @showItem="showItem"
    />

    <v-data-table
      :headers="headers"
      :items="listValidArray"
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
              <b-col cols="12">
                <div class="field-selection field-search">
                  <v-text-field
                    v-model="search"
                    append-icon="search"
                    :label="$t('setting.search')"
                    outlined
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
          <span>{{ $t('table.departments') }}</span>
        </h4>
      </template>
<!--      <template v-slot:item.countEmployee="{ item }">-->
<!--        {{ item.countEmployee > 0 ? item.countEmployee : '' }}-->
<!--      </template>-->
<!--      <template v-slot:item.countSuperManager="{ item }">-->
<!--        {{ item.countSuperManager > 0 ? item.countSuperManager : '' }}-->
<!--      </template>-->
<!--      <template v-slot:item.countManager="{ item }">-->
<!--        {{ item.countManager > 0 ? item.countManager : '' }}-->
<!--      </template>-->
<!--      <template v-slot:item.countSuperUser="{ item }">-->
<!--        {{ item.countSuperUser > 0 ? item.countSuperUser : '' }}-->
<!--      </template>-->
<!--      <template v-slot:item.countUser="{ item }">-->
<!--        {{ item.countUser > 0 ? item.countUser : '' }}-->
<!--      </template>-->
      <template v-slot:no-data>
        {{ $t('table.no_data') }}
      </template>
    </v-data-table>
  </div>
</template>

<script>
  // import {_} from 'vue-underscore';
  // import moment from 'moment';
  import DepartmentPopup from "./DepartmentPopup";
  import cookies from "js-cookie";

  export default {
    name: "DepartmentTable",
    components: {
      DepartmentPopup,
    },
    props: {
      listArrayInput: Array,
      listValidArrayInput: Array,
    },
    data: () => ({
      permissionsUser: localStorage.getItem('permissionsKey'),
      checkAdmin: cookies.get('checkAdmin'),
      roleUser: cookies.get('roleUser'),
      nowDate: new Date().toISOString().substr(0, 10),
      search: '',
      listArray: [],
      listValidArray: [],
      company_id: '',
      editedItem: {
        name: '',
        parent_id: '',
        company_id: '',
        disable_status: '',
        manager_by_employee_arr: [],
        manager_by_jobtitle_arr: [],
        member_by_employee_arr: [],
        member_by_jobtitle_arr: [],
      },
      checkShowItem: false,
    }),

    computed: {
      headers() {
        return [
          {text: this.translateCol('name'), value: 'name', align: 'left'},
          {text: this.translateCol('parent_department'), value: 'parent_name', align: 'left'},
          {text: this.translateCol('employees'), value: 'countEmployee', align: 'center'},
          {text: this.translateCol('super_manager'), value: 'countSuperManager', align: 'center'},
          {text: this.translateCol('manager'), value: 'countManager', align: 'center'},
          {text: this.translateCol('super_user'), value: 'countSuperUser', align: 'center'},
          {text: this.translateCol('user'), value: 'countUser', align: 'center'},
        ];
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

      listValidArrayInput(value) {
        if (value) {
          this.listValidArray = value;
        }
      },
    },

    created() {
      if (this.listArrayInput.length > 0) {
        this.listArray = this.listArrayInput;
      }

      if (this.listValidArrayInput.length > 0) {
        this.listValidArray = this.listValidArrayInput;
      }
    },

    methods: {
      translateCol (colName) {
        return this.$i18n.t('column.' + colName);
      },

      reloadList() {
        this.$emit('reloadList');
      },

      showItem(item) {
        this.editItem(item);
      },

      editItem(item) {
        let that = this;
        that.editedItem = Object.assign({}, item);
        that.checkShowItem = true;
      },
    }
  };

</script>

<style scoped>

</style>

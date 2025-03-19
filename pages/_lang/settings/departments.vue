<template>
  <div class="page-company-detail">
    <b-tabs v-model="tabIndex" card class="section-categories" lazy>
      <v-btn
        class="mb-2 btn-create btn-custom-green"
        @click="checkAddNewDepartment = true"
      >
        {{ $t('button.add_new') }}
      </v-btn>
      <keep-alive>
        <b-tab :title="$t('tab.departments')" class="hse-tab-item">
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyDepartment" />
          <v-container>
            <v-row v-if="checkAdmin || permissionsUser.indexOf('department-basic') !== -1">
              <v-col cols="12">
                <DepartmentPopup
                  :open-popup="checkAddNewDepartment"
                  :list-array-input="departmentsValidArray"
                  @closePopup="checkAddNewDepartment = !checkAddNewDepartment"
                  @reloadList="reloadList"
                />
                <DepartmentTable
                  :list-array-input="departmentsArray"
                  :list-valid-array-input="departmentsValidArray"
                  @reloadList="reloadList"
                />
              </v-col>
            </v-row>
          </v-container>
        </b-tab>
      </keep-alive>
    </b-tabs>
  </div>
</template>
<script>
import cookies from "js-cookie";
import {_} from "vue-underscore";
import DepartmentPopup from "../../../components/DepartmentPopup";
import DepartmentTable from "../../../components/DepartmentTable";
import TitleCaption from "../../../components/TitleCaption";

export default {
  components: {
    DepartmentPopup,
    DepartmentTable,
    TitleCaption
  },

  data: () => ({
    userRoleId: parseInt(cookies.get('roleID')),
    userDepartmentID: parseInt(cookies.get('userDepartmentID')),
    checkAdmin: cookies.get('checkAdmin'),
    roleUser: cookies.get('roleUser'),
    permissionsUser: localStorage.getItem('permissionsKey'),
    pageKeyDepartment: 'company-company-departments',
    departmentsArray: [],
    departmentsValidArray: [],
    checkAddNewDepartment: false,
    users: [],
    tabIndex: 0,
  }),

  computed: {},

  watch: {},

  mounted() {
    let that = this;
    that.$nextTick(() => {
      that.$nuxt.$loading.start();
      // list department
      that.$store.dispatch('departments/index').then(result => {
        that.departmentsArray = result.data;
        that.departmentsValidArray = _.clone(that.departmentsArray);
        that.departmentsValidArray = _.filter(that.departmentsValidArray, function (item) {
          return item.disable_status === 0;
        });
        that.$nuxt.$loading.finish();
        // that.listAvailDepartment = result.data;
        // if (_.find(that.departmentsArray, function (department) {
        //   return department.parent_id === null;
        // })) {
        //   that.check_exist_root_department = true;
        // }
      }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
        that.$toaster.error(that.$i18n.t('message.fail_department_view'));
        }
        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });
    });
  },

  methods: {
    reloadList() {
      let that = this;
      that.$store.dispatch('departments/index').then(result => {
        that.departmentsArray = result.data;
        that.departmentsValidArray = _.clone(that.departmentsArray);
        that.departmentsValidArray = _.filter(that.departmentsValidArray, function (item) {
          return item.disable_status === 0;
        });
        that.$nuxt.$loading.finish();
      }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
        that.$toaster.error(that.$i18n.t('message.fail_department_view'));
        }
        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });
    },
  }
};
</script>

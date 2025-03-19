<template>
  <div class="page-company-detail">
    <b-tabs v-model="tabIndex" card class="section-categories" lazy>
      <v-btn
        class="mb-2 btn-create btn-custom-green"
        @click="checkAddNewJobTitle = true"
      >
        {{ $t('button.add_new') }}
      </v-btn>
      <keep-alive v-if="checkAdmin || permissionsUser.indexOf('job title-detail') !== -1">
        <b-tab :title="$t('tab.job_titles')" :active="this.$route.query.type === 'jobTitle'" name="job-title-tab" class="hse-tab-item">
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyJobTitle" />
          <v-container>
            <v-row>
              <v-col cols="12">
                <JobTitleTable
                  :roles-array="rolesArray"
                  :roles-selection="rolesSelection"
                  :departments-array="departmentsValidArray"
                  :list-array-input="jobTitleArray"
                  @reloadList="reloadJobTitleList"
                />
              </v-col>
            </v-row>
          </v-container>
        </b-tab>
      </keep-alive>
    </b-tabs>

    <JobTitlePopup
      :open-popup="checkAddNewJobTitle"
      :roles-array="rolesArray"
      :departments-array="departmentsValidArray"
      @closePopup="checkAddNewJobTitle = !checkAddNewJobTitle"
      @reloadList="reloadJobTitleList"
    />
  </div>
</template>
<script>
import cookies from "js-cookie";
import {_} from "vue-underscore";
import JobTitlePopup from "../../../components/JobTitlePopup";
import JobTitleTable from "../../../components/JobTitleTable";
import TitleCaption from "../../../components/TitleCaption";

export default {
  components: {
    JobTitlePopup,
    JobTitleTable,
    TitleCaption
  },

  data: () => ({
    userRoleId: parseInt(cookies.get('roleID')),
    userDepartmentID: parseInt(cookies.get('userDepartmentID')),
    checkAdmin: cookies.get('checkAdmin'),
    roleUser: cookies.get('roleUser'),
    permissionsUser: localStorage.getItem('permissionsKey'),
    pageKeyJobTitle: 'company-company-job-titles',
    tabIndex: 0,
    checkAddNewJobTitle: false,
    jobTitleArray: [],
    rolesArray: [],
    rolesSelection: [],
    departmentsValidArray: [],
    dataRoleDefault: {
      id: 0,
      name: "All",
    },
  }),

  computed: {},

  watch: {},

  mounted() {
    let that = this;
    that.$nextTick(() => {
      that.$nuxt.$loading.start();
      // list department
      that.$store.dispatch('departments/index').then(result => {
        that.departmentsValidArray = _.filter(result.data, function (item) {
          return item.disable_status === 0;
        });
      }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }
        // that.$toaster.error(that.$i18n.t('message.fail_department_view'));
        
        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });

      // list roles
      that.$store.dispatch('roles/index').then(result => {
        that.rolesArray = result.data;
        that.rolesSelection = _.clone(result.data);
        that.rolesSelection.push(that.dataRoleDefault);
        that.rolesSelection.sort(function (a, b) {
          return (a.id - b.id);
        });
      }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
        that.$toaster.error(that.$i18n.t('message.fail_role_view'));
        }
        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });

      // list job titles
      that.$store.dispatch('jobTitles/index').then(result => {
        that.jobTitleArray = result.data;
        that.$nuxt.$loading.finish();
      }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
        that.$toaster.error(that.$i18n.t('message.fail_job_title_view'));
        }
        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });
    });
  },

  methods: {
    reloadJobTitleList() {
      let that = this;
      that.$store.dispatch('jobTitles/index').then(result => {
        that.jobTitleArray = result.data;
        that.$nuxt.$loading.finish();
      }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
        that.$toaster.error(that.$i18n.t('message.fail_job_title_view'));
        }
        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });
    },
  }
};
</script>

<template>
  <div class="resources-page">
    <v-btn class="mb-2 btn-create btn-custom-green" @click="checkAddNew = true">
      {{ $t('button.add_new') }}
    </v-btn>

    <b-tabs card>
      <b-tab :title="$t('tab.job_titles')" active>
        <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKey" />
        <v-container>
          <!-- Add new -->
          <JobTitlePopup
            :open-popup="checkAddNew"
            :resource="true"
            :industry-array="industriesArray"
            :roles-array="rolesArray"
            @closePopup="checkAddNew = !checkAddNew"
            @reloadList="reloadList"
          />
          <JobTitleTable
            :resource="true"
            :industry-array="industriesArray"
            :roles-array="rolesArray"
            :roles-selection="rolesSelection"
            :list-array-input="listArray"
            @reloadList="reloadList"
          />
        </v-container>
      </b-tab>
    </b-tabs>
  </div>
</template>
<script>
  import {_} from 'vue-underscore';
  import cookies from 'js-cookie';
  import TitleCaption from "../../../../components/TitleCaption";
  import JobTitlePopup from "../../../../components/JobTitlePopup";
  import JobTitleTable from "../../../../components/JobTitleTable";

  export default {
    components: {
      TitleCaption,
      JobTitlePopup,
      JobTitleTable,
    },

    data: () => ({
      userRoleId: parseInt(cookies.get('roleID')),
      // userDepartmentID: parseInt(cookies.get('userDepartmentID')),
      checkAdmin: cookies.get('checkAdmin'),
      // roleUser: cookies.get('roleUser'),
      pageKey: 'overview-job-titles-job-titles',
      checkAddNew: false,
      search: '',
      industriesArray: [],
      industriesSelection: [],
      industryDefault: {
        id: 0,
        name: "All"
      },
      listArray: [],
      rolesArray: [],
      rolesSelection: [],
      roleDefault: {
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
        // list industries
        that.$store.dispatch('industries/index').then(result => {
          that.industriesArray = result.data;
          that.industriesSelection = _.clone(result.data);
          that.industriesSelection.push(that.industryDefault);
          that.industriesSelection.sort(function (a, b) {
            return (a.id - b.id);
          });
        }).catch(() => {
          // that.$toaster.error(that.$i18n.t('message.fail_industry_view'));
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });

        // list roles
        that.$store.dispatch('roles/all').then(result => {
          that.rolesArray = _.filter(result.data, function (item) {
            return item.level > 1;
          });
          that.rolesSelection = _.clone(that.rolesArray);
          that.rolesSelection.push(that.roleDefault);
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
          that.listArray = result.data;
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
      editItem(item) {
        this.editedItem = Object.assign({}, item);
      },

      reloadList(){
        let that = this;
        // get list
        that.$store.dispatch('jobTitles/index').then(result => {
          that.listArray = result.data;
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
    },
  };
</script>

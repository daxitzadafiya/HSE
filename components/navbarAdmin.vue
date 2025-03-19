<template>
  <aside :class="'left-sidebar ' + page">
    <div class="scroll-sidebar">
      <nav class="sidebar-nav">
        <div class="current-page">
          {{ $t('menu.' + page) }}
        </div>
        <!-- SUPER ADMIN -->
        <!-- OVERVIEW -->
        <ul v-if="page === 'overview' && ( checkSuperAdmin || checkCustomerServiceAdmin )" id="sidebarnavOverview">
          <li v-if="checkSuperAdmin || csPermissions.companies">
            <nuxt-link :to="'/' + $i18n.locale + '/admin/overview/companies'" :class="[link === 'companies' ? 'link-menu active' : 'link-menu']">
              <img src="~assets/images/icon/company.png" alt="companySetting" class="dark-logo">
              <span class="link-menu-title">{{ $t('sidebar.companies') }}</span>
            </nuxt-link>
          </li>
          <li v-if="checkSuperAdmin || csPermissions.users">
            <nuxt-link :to="'/' + $i18n.locale + '/admin/overview/users'" :class="[link === 'users' ? 'link-menu active' : 'link-menu']">
              <img src="~assets/images/icon/employees.png" alt="user" class="dark-logo">
              <span class="link-menu-title">{{ $t('sidebar.users') }}</span>
            </nuxt-link>
          </li>
          <li v-if="checkSuperAdmin || csPermissions.customerService">
            <nuxt-link :to="'/' + $i18n.locale + '/admin/overview/customerServices'" :class="[link === 'customerServices' ? 'link-menu active' : 'link-menu']">
              <img src="~assets/images/icon/employees.png" alt="customerServices" class="dark-logo">
              <span class="link-menu-title">{{ $t('sidebar.customerServices') }}</span>
            </nuxt-link>
          </li>
              <li v-if="checkSuperAdmin || csPermissions.invites">
            <nuxt-link :to="'/' + $i18n.locale + '/admin/overview/invites'" :class="[link === 'invites' ? 'link-menu active' : 'link-menu']">
              <img src="~assets/images/icon/employees.png" alt="invite" class="dark-logo">
                <span class="link-menu-title">{{ $t('sidebar.invites') }}</span>
            </nuxt-link>
            </li>
          <li v-if="checkSuperAdmin || csPermissions.roles">
            <nuxt-link :to="'/' + $i18n.locale + '/admin/overview/roles'" :class="[link === 'roles' ? 'link-menu active' : 'link-menu']">
              <img src="~assets/images/icon/employees.png" alt="role" class="dark-logo">
              <span class="link-menu-title">{{ $t('sidebar.roles') }}</span>
            </nuxt-link>
          </li>
          <li v-if="checkSuperAdmin || csPermissions.jobTitles">
            <nuxt-link :to="'/' + $i18n.locale + '/admin/overview/jobTitles'" :class="[link === 'jobTitles' ? 'link-menu active' : 'link-menu']">
              <img src="~assets/images/icon/job-titles.png" alt="job-title" class="dark-logo">
              <span class="link-menu-title">{{ $t('sidebar.job_titles') }}</span>
            </nuxt-link>
          </li>
          <li v-if="checkSuperAdmin || csPermissions.billings">
                <nuxt-link :to="'/' + $i18n.locale + '/admin/overview/billings'" :class="[link === 'billings' ? 'link-menu active' : 'link-menu']">
                    <img src="~assets/images/icon/icon16.svg" alt="job-title" class="dark-logo">
                    <span class="link-menu-title">{{ $t('sidebar.billings') }}</span>
                </nuxt-link>
            </li>

            <li v-if="checkSuperAdmin || csPermissions.settings">
                <nuxt-link :to="'/' + $i18n.locale + '/admin/overview/setting'" :class="[link === 'setting' ? 'link-menu active' : 'link-menu']">
                    <img src="~assets/images/icon/tasks.png" alt="settings" class="dark-logo">
                    <span class="link-menu-title">{{ $t('sidebar.settings')}}</span>
                </nuxt-link>
            </li>

            <li v-if="checkSuperAdmin || csPermissions.email_logs">
                <nuxt-link :to="'/' + $i18n.locale + '/admin/overview/emailLogs'" :class="[link === 'emailLogs' ? 'link-menu active' : 'link-menu']">
                    <img src="~assets/images/icon/tasks.png" alt="emailLogs" class="dark-logo">
                    <span class="link-menu-title">{{ $t('sidebar.emailLogs')}}</span>
                </nuxt-link>
            </li>
        </ul>
        <!-- RESOURCES -->
        <ul v-else-if="page === 'resources' && ( checkSuperAdmin || checkCustomerServiceAdmin )" id="sidebarnavResources">
          <li>
            <nuxt-link :to="'/' + $i18n.locale + '/admin/resources/goals'" :class="[link === 'goals' ? 'link-menu active' : 'link-menu']">
              <img src="~assets/images/icon/company.png" alt="goals" class="dark-logo">
              <span class="link-menu-title">{{ $t('sidebar.goals') }}</span>
            </nuxt-link>
          </li>
          <li>
            <nuxt-link :to="'/' + $i18n.locale + '/admin/resources/routines'" :class="[link === 'routines' ? 'link-menu active' : 'link-menu']">
              <img src="~assets/images/icon/routines.png" alt="routines" class="dark-logo">
              <span class="link-menu-title">{{ $t('sidebar.routines') }}</span>
            </nuxt-link>
          </li>
          <li>
            <nuxt-link :to="'/' + $i18n.locale + '/admin/resources/instructions'" :class="[link === 'instructions' ? 'link-menu active' : 'link-menu']">
              <img src="~assets/images/icon/instructions.png" alt="instructions" class="dark-logo">
              <span class="link-menu-title">{{ $t('sidebar.instructions') }}</span>
            </nuxt-link>
          </li>
          <li>
            <nuxt-link :to="'/' + $i18n.locale + '/admin/resources/documents'" :class="[link === 'documents' ? 'link-menu active' : 'link-menu']">
              <img src="~assets/images/icon/documents.png" alt="documents" class="dark-logo">
              <span class="link-menu-title">{{ $t('sidebar.documents') }}</span>
            </nuxt-link>
          </li>
          <li>
            <nuxt-link :to="'/' + $i18n.locale + '/admin/resources/checklists'" :class="[link === 'checklists' ? 'link-menu active' : 'link-menu']">
              <img src="~assets/images/icon/checklists.png" alt="checklists" class="dark-logo">
              <span class="link-menu-title">{{ $t('sidebar.checklists') }}</span>
            </nuxt-link>
          </li>
          <li>
            <nuxt-link :to="'/' + $i18n.locale + '/admin/resources/riskAreas'" :class="[link === 'riskAreas' ? 'link-menu active' : 'link-menu']">
              <img src="~assets/images/icon/risk-area.png" alt="riskAreas" class="dark-logo">
              <span class="link-menu-title">{{ $t('sidebar.risk_areas') }}</span>
            </nuxt-link>
          </li>
          <li>
            <nuxt-link :to="'/' + $i18n.locale + '/admin/resources/contacts'" :class="[link === 'contacts' ? 'link-menu active' : 'link-menu']">
              <img src="~assets/images/icon/contacts.png" alt="contacts" class="dark-logo">
              <span class="link-menu-title">{{ $t('sidebar.contacts') }}</span>
            </nuxt-link>
          </li>
          <li>
            <nuxt-link :to="'/' + $i18n.locale + '/admin/resources/statements'" :class="[link === 'statements' ? 'link-menu active' : 'link-menu']">
              <img src="~assets/images/icon/employees.png" alt="statements" class="dark-logo">
              <span class="link-menu-title">{{ $t('sidebar.hse_statement') }}</span>
            </nuxt-link>
          </li>
<!--          <li>-->
<!--            <nuxt-link to="/resources/appraisals" :class="[link === 'appraisals' ? 'link-menu active' : 'link-menu']">-->
<!--              <img src="~assets/images/icon/icon17.svg" alt="appraisals" class="dark-logo">-->
<!--              <span class="link-menu-title">Appraisals</span>-->
<!--            </nuxt-link>-->
<!--          </li>-->
        </ul>
        <!-- SETTING -->
        <ul v-else-if="page === 'settings' && ( checkSuperAdmin || checkCustomerServiceAdmin )" id="sidebarnavSetting">
          <li>
            <nuxt-link :to="'/' + $i18n.locale + '/admin/settings/categories'" :class="[link === 'categories' ? 'link-menu active' : 'link-menu']">
              <img src="~assets/images/icon/categories.png" alt="categories" class="dark-logo">
              <span class="link-menu-title">{{ $t('sidebar.categories') }}</span>
            </nuxt-link>
          </li>
          <li>
            <nuxt-link :to="'/' + $i18n.locale + '/admin/settings/industries'" :class="[link === 'industries' ? 'link-menu active' : 'link-menu']">
              <img src="~assets/images/icon/company.png" alt="industries" class="dark-logo">
              <span class="link-menu-title">{{ $t('sidebar.industries') }}</span>
            </nuxt-link>
          </li>
<!--          <li>-->
<!--            <nuxt-link :to="'/' + $i18n.locale + '/settings/absenceSetting'" :class="[link === 'absenceSetting' ? 'link-menu active' : 'link-menu']">-->
<!--              <img src="~assets/images/icon/company.png" alt="absenceSetting" class="dark-logo">-->
<!--              <span class="link-menu-title">Absence Setting</span>-->
<!--            </nuxt-link>-->
<!--          </li>-->
          <li>
            <nuxt-link :to="'/' + $i18n.locale + '/admin/settings/help'" :class="[link === 'help' ? 'link-menu active' : 'link-menu']">
              <img src="~assets/images/icon/icon19.svg" alt="help" class="dark-logo">
              <span class="link-menu-title">{{ $t('sidebar.help_center_setting') }}</span>
            </nuxt-link>
          </li>
        </ul>
        <!-- ADD ONS -->
        <ul v-else-if="page === 'addons' && ( checkSuperAdmin || checkCustomerServiceAdmin )" id="sidebarnavAddons">
          <li>
            <nuxt-link :to="'/' + $i18n.locale + '/admin/addons/descriptions'" :class="[link === 'descriptions' ? 'link-menu active' : 'link-menu']">
              <img src="~assets/images/icon/icon19.svg" alt="descriptions" class="dark-logo">
              <span class="link-menu-title">{{ $t('sidebar.descriptions') }}</span>
            </nuxt-link>
          </li>
          <li>
            <nuxt-link :to="'/' + $i18n.locale + '/admin/addons/notifications'" :class="[link === 'notifications' ? 'link-menu active' : 'link-menu']">
              <img src="~assets/images/icon/icon19.svg" alt="notifications" class="dark-logo">
              <span class="link-menu-title">{{ $t('sidebar.notifications') }}</span>
            </nuxt-link>
          </li>
<!--          <li>-->
<!--            <nuxt-link :to="'/' + $i18n.locale + '/addons/repositories'" :class="[link === 'repositories' ? 'link-menu active' : 'link-menu']">-->
<!--              <img src="~assets/images/icon/icon19.svg" alt="categories" class="dark-logo">-->
<!--              <span class="link-menu-title">Repositories</span>-->
<!--            </nuxt-link>-->
<!--          </li>-->
        </ul>

        <ul v-else id="">
          <li>
            <nuxt-link to="">
              <span class="hide-menu">{{ $t('sidebar.overview') }}</span>
            </nuxt-link>
          </li>
        </ul>
      </nav>
    </div>
  </aside>
</template>
<script>
  import cookies from "js-cookie";

  export default {
    data() {
      return {
        page: this.$router.history.current.path.split("/")[3],
        link: this.$router.history.current.path.split("/")[this.$router.history.current.path.split("/").length - 1],
        permissionsUser: localStorage.getItem('permissionsKey'),
        checkAdmin: cookies.get('checkAdmin'),
        checkSuperAdmin: cookies.get('checkSuperAdmin'),
        checkCustomerServiceAdmin: cookies.get('checkCustomerServiceAdmin'),
        roleUser: cookies.get('roleUser'),
        csPermissions:{},
      };
    },

    watch: {
      $route(to) {
        if(this.checkCustomerServiceAdmin){
          this.getCSPermission();
        } 
        this.page = to.path.split("/")[3];
        this.link = to.path.split("/")[to.path.split("/").length - 1];
      }
    },

    mounted () {
      if(this.checkCustomerServiceAdmin){
          this.getCSPermission();
        } 
    },

    methods: {
          getCSPermission () {
                this.isLoading = true;
                this.$store.dispatch('customerServices/getPermissions').then((res) => {
                    this.csPermissions = res.data;
                    this.isLoading = false;
                }).catch((error) => {
                    if (error.response?.status == 401) {
                        this.$router.push('/login');
                        this.$toaster.error(this.$i18n.t('message.token_expired'));
                    }else {
                         this.$toaster.error(this.$i18n.t('message.fail_something'));
                    }
                    this.isLoading = false;
                });
            },
        },
  };
</script>

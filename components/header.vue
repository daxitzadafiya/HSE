<template>
  <header class="topbar">
    <nav class="navbar top-navbar navbar-expand-md navbar-light">
      <div class="navbar-header">
        <a class="navbar-brand" href="/dashboard/overview">
          <img src="~assets/images/logo/icon-logo.png" alt="homepage" class="dark-logo">
        </a>
<!--        <div class="search-info">-->
<!--          <i class="fa fa-search" />-->
<!--          <input class="input-search" placeholder="Sok I systemet">-->
<!--        </div>-->
      </div>
      <div class="navbar-collapse">
        <ul class="navbar-nav m-auto mt-md-0 ">
          <!-- SUPER admin -->
          <li v-if="checkSuperAdmin || checkCustomerServiceAdmin" class="nav-item" title="Overview">
            <nuxt-link :class="[page === 'overview' ? 'nav-link active' : 'nav-link']" :to="'/' + $i18n.locale + '/admin/overview/companies'">
              <img src="~assets/images/icon/company.png" alt="overview" class="icon-menu">
            </nuxt-link>
          </li>
          <li v-if="checkSuperAdmin " class="nav-item" title="Resources">
            <nuxt-link :class="[page === 'resources' ? 'nav-link active' : 'nav-link']" :to="'/' + $i18n.locale + '/admin/resources/goals'">
              <img src="~assets/images/icon/documents.png" alt="resources" class="icon-menu">
            </nuxt-link>
          </li>
          <li v-if="checkSuperAdmin " class="nav-item" title="Settings">
            <nuxt-link :class="[page === 'settings' ? 'nav-link active' : 'nav-link']" :to="'/' + $i18n.locale + '/admin/settings/categories'">
              <img src="~assets/images/icon/icon17.svg" alt="settings" class="icon-menu">
            </nuxt-link>
          </li>
          <li v-if="checkSuperAdmin" class="nav-item" title="Add ons">
            <nuxt-link :class="[page === 'add ons' ? 'nav-link active' : 'nav-link']" :to="'/' + $i18n.locale + '/admin/addons/descriptions'">
              <img src="~assets/images/icon/icon16.svg" alt="addons" class="icon-menu">
            </nuxt-link>
          </li>

          <!-- COMPANY admin -->
          <li v-if="userRoleId > 1 && userRoleId < 5" class="nav-item" title="Dashboard">
            <nuxt-link :class="[page === 'dashboard' ? 'nav-link active' : 'nav-link']" :to="'/' + $i18n.locale + '/dashboard/overview'">
              <img src="~assets/images/icon/dashboard.png" alt="company" class="icon-menu">
            </nuxt-link>
          </li>
          <li v-if="userRoleId > 1 && userRoleId < 5" class="nav-item" title="Company">
            <nuxt-link :class="[page === 'company' ? 'nav-link active' : 'nav-link']" :to="'/' + $i18n.locale + '/company/company'">
              <img src="~assets/images/icon/company.png" alt="company" class="icon-menu">
            </nuxt-link>
          </li>
          <li v-if="userRoleId > 1 && userRoleId < 5" class="nav-item" title="Employees">
            <nuxt-link :class="[page === 'employees' ? 'nav-link active' : 'nav-link']" :to="'/' + $i18n.locale + '/employees/overview'">
              <img src="~assets/images/icon/employees.png" alt="employees" class="icon-menu">
            </nuxt-link>
          </li>
<!--          <li v-if="userRoleId > 1" class="nav-item" title="Mapping">-->
<!--            <nuxt-link :class="[page === 'riskAnalysis' ? 'nav-link active' : 'nav-link']" to="/mapping/riskAnalysis">-->
<!--              <i class="fa fa-map" />-->
<!--            </nuxt-link>-->
<!--          </li>-->
          <li v-if="userRoleId > 1 && userRoleId < 5 && (planActive.document || lastPlanActive?.document)" class="nav-item" title="Documents">
            <nuxt-link :class="[page === 'documents' ? 'nav-link active' : 'nav-link']" :to="'/' + $i18n.locale + '/documents/documents'">
              <img src="~assets/images/icon/documents.png" alt="homepage" class="icon-menu">
            </nuxt-link>
          </li>
<!--          <li v-if="userRoleId > 1" class="nav-item" title="Project">-->
<!--            <nuxt-link :class="[page === 'project' ? 'nav-link active' : 'nav-link']" :to="'/' + $i18n.locale + '/project/overview'">-->
<!--              <i class="fa fa-globe" />-->
<!--            </nuxt-link>-->
<!--          </li>-->
          <li v-if="userRoleId > 1 && userRoleId < 5" class="nav-item" title="Reports">
            <nuxt-link :class="[page === 'reports' ? 'nav-link active' : 'nav-link']" :to="'/' + $i18n.locale + '/reports/reportedChecklists'">
<!--              <i class="fa fa-balance-scale" />-->
              <img src="~assets/images/icon/reports.png" alt="homepage" class="icon-menu">
            </nuxt-link>
          </li>
<!--          <li v-if="userRoleId > 1" class="nav-item" title="Settings">-->
<!--            <nuxt-link :class="[page === 'settings' ? 'nav-link active' : 'nav-link']" :to="'/' + $i18n.locale + '/settings/categories'">-->
<!--              <img src="~assets/images/icon/icon17.svg" alt="settings" class="icon-menu">-->
<!--            </nuxt-link>-->
<!--          </li>-->
<!--          <li v-if="checkAdmin" class="nav-item" title="Administration">-->
<!--            <nuxt-link :class="[page === 'administration' ? 'nav-link active' : 'nav-link']" to="/administration/repositories">-->
<!--              <img src="~assets/images/icon/reports.png" alt="administration" class="icon-menu">-->
<!--            </nuxt-link>-->
<!--          </li>-->

          <li class="nav-item right-position">
            <ul class="navbar-nav m-auto mt-md-0 top-right-menu">
              <li class="nav-item " title="Help Center">
                <nuxt-link :class="[page === 'help center' ? 'nav-link active' : 'nav-link']"  :to="'/' + $i18n.locale + '/help-center/guide'">
                  <v-icon>fas fa-question-circle</v-icon>
                </nuxt-link>
              </li>
              <li v-if="checkAdmin" class="nav-item " title="Administration">
                <nuxt-link :class="[page === 'administration' ? 'nav-link active' : 'nav-link']" :to="'/' + $i18n.locale + '/settings/repositories'">
                  <v-icon>fas fa-trash</v-icon>
                </nuxt-link>
              </li>
              <li v-if="checkSuperAdmin" class="nav-item " title="Repository">
                <nuxt-link :class="[page === 'repositories' ? 'nav-link active' : 'nav-link']" :to="'/' + $i18n.locale + '/admin/addons/repositories'">
                  <v-icon>fas fa-trash</v-icon>
                </nuxt-link>
              </li>
              <li class="nav-item">
                <b-dropdown class="user-notification-dropdown" right>
                  <template v-slot:button-content>
                    <a class="nav-link dropdown-toggle link u-dropdown text-muted waves-effect waves-dark" href="#" id="dropdownMenuButton1" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" @click="reloadList">
                      <v-badge
                        v-if="count_unread_message > 0"
                        color="#87A53A"
                        :content="count_unread_message"
                        class="icon-number"
                      >
                        <v-icon>
                          fas fa-bell
                        </v-icon>
                      </v-badge>
                      <v-icon v-else>
                        fas fa-bell
                      </v-icon>
                    </a>
                  </template>
                  <div class="text-muted">
                    {{ $t('title.latest_notifications') }}
                  </div>
                  <div v-for="(item) in listNotificationArray" :key="item.id">
                    <!--                <b-dropdown-divider></b-dropdown-divider>-->
                    <b-dropdown-item :class="item.read_status === 0 ? 'unread' : ''">
                      <div @click="handleClickNotification(item)" class="notification-item">
                        <p class="mb-1" v-html="item.notification_content.short_description" />
                        <span>{{ item.created_at }}</span>
                      </div>
                    </b-dropdown-item>
                  </div>
                  <b-dropdown-item>
                    <nuxt-link :to="'/' + $i18n.locale + '/employees/notifications'">
                      <div class="text-center">View all</div>
                    </nuxt-link>
                  </b-dropdown-item>
                </b-dropdown>
              </li>
              <li v-if="checkAdmin || checkSuperAdmin" class="nav-item">
                <b-dropdown class="language-dropdown" right :disabled="!checkAdmin && !checkSuperAdmin">
                  <template v-slot:button-content>
                    <a class="nav-link dropdown-toggle link u-dropdown text-muted waves-effect waves-dark" href="#" id="dropdownMenuButton2" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <img
                        v-if="$i18n.locale === 'en'"
                        class="flag-item"
                        src="~/assets/images/eng-flag.png"
                        alt="flag"
                      />
                      <img
                        v-else
                        class="flag-item"
                        src="~/assets/images/nor-flag.png"
                        alt="flag"
                      />
                    </a>
                  </template>
                  <div v-for="(item) in availableLocales" :key="item.code">
                    <b-dropdown-item>
                      <div
                        :class="$i18n.locale === item.code ? 'language-item active' : 'language-item'"
                        @click="changeLanguage(item.code)"
                      >
                        <div class="img-item">
                          <div>
                            <img v-if="item.code === 'en'" src="~/assets/images/eng-flag.png" alt="flag">
                            <img v-else src="~/assets/images/nor-flag.png" alt="flag">
                          </div>
                        </div>
                        <div class="text-item">{{ item.name }}</div>
                      </div>
                    </b-dropdown-item>
                  </div>
                </b-dropdown>
              </li>
              <li class="nav-item">
                <b-dropdown class="user-image-dropdown" right>
                  <template v-slot:button-content>
                    <a class="nav-link dropdown-toggle link u-dropdown text-muted waves-effect waves-dark" href="#" id="dropdownMenuButton" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <i v-if="!currentUser.avatar" class="fa fa-user mt-1 header-icon-no-avatar" />
                      <img v-if="currentUser.avatar" :src="currentUser.avatar" alt="user" class="profile-pic">
                    </a>
                  </template>
                  <div class="dw-user-box user-name-jobtitle">
                    <div class="u-text">
                      <h4 class="profile-name">
                        {{ currentUser.first_name + ' ' + currentUser.last_name }}
                      </h4>
                      <p class="text-muted">
                        {{ currentUser.role_name }}
                      </p>
                    </div>
                  </div>
                  <b-dropdown-divider />
                  <b-dropdown-item v-if="currentUser.role_id === 1">
                    <nuxt-link :to="'/' + $i18n.locale + '/profile/overview'">
                      <i class="fa fa-user mr-2" /> {{ $t('title.my_profile') }}
                    </nuxt-link>
                  </b-dropdown-item>
                  <b-dropdown-item v-else>
                    <nuxt-link :to="'/' + $i18n.locale + '/employees/'+ currentUser.id">
                      <i class="fa fa-user mr-2" /> {{ $t('title.my_profile') }}
                    </nuxt-link>
                  </b-dropdown-item>
                  <b-dropdown-divider v-if="checkAdmin" />
                  <b-dropdown-item v-if="checkAdmin">
                    <nuxt-link :to="'/' + $i18n.locale + '/settings/categories'">
                      <i class="fa fa-tachometer-alt mr-2" /> Settings
                    </nuxt-link>
                  </b-dropdown-item>
                  <b-dropdown-divider></b-dropdown-divider>
                  <b-dropdown-item href="" @click="logout">
                    <i class="fa fa-power-off mr-2" /> {{ $t('title.logout') }}
                  </b-dropdown-item>
                </b-dropdown>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>
<script>
  import cookies from 'js-cookie';
  // import {_} from 'vue-underscore';

  export default {
    data() {
      return {
        defaultLanguage: cookies.get('default_language'),
        userRoleId: parseInt(cookies.get('roleID')),
        userDepartmentID: parseInt(cookies.get('userDepartmentID')),
        checkAdmin: cookies.get('checkAdmin'),
        checkSuperAdmin: cookies.get('checkSuperAdmin'),
        checkCustomerServiceAdmin: cookies.get('checkCustomerServiceAdmin'),
        roleUser: cookies.get('roleUser'),
        page: this.$router.history.current.path.split("/")[2],
        currentUser: "",
        listNotificationArray: [],
        limit: 5,
        count_unread_message: 0,
        planActive:{},
        lastPlanActive:{},
        isLoading:false,
        availableLocales: [
          {
            code: 'en',
            name: 'English'
          },
          {
            code: 'no',
            name: 'Norsk'
          }
        ],
        companyItem: {
          id: cookies.get('company_id'),
          language: '',
        }
      };
    },

    watch:{
      $route (to){
        this.getActivePlan();
        this.page = to.path.split("/")[2];
      }
    },
    mounted() {
      let that = this;
      that.getActivePlan();
      that.$nextTick(() => {
        that.$nuxt.$loading.start();
        if (that.defaultLanguage) {
          that.$router.push({params: {lang: that.defaultLanguage}});
        }
        //Get current user profile
        that.$store.dispatch('authenticate/profile').then(result => {
          that.currentUser = result.data;
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_something'));
          }
          that.$nuxt.$loading.finish();
          // that.$toaster.error(error.response.data.message || error.response.data.errors);
        });

        that.$store.dispatch('notifications/index', {getBy: 'user', getLastest: that.limit}).then(result => {
          that.listNotificationArray = result.data;
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_notification_view'));
          }
          that.$nuxt.$loading.finish();
          // that.$toaster.error(error.message || error.status);
        });

        that.$store.dispatch('notifications/countUnRead', {getBy: 'user'}).then(result => {
          if (result.data > 99) {
            that.count_unread_message = '+99';
          } else {
            that.count_unread_message = result.data;
          }
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_notification_view'));
          }
          that.$nuxt.$loading.finish();
          // that.$toaster.error(error.message || error.status);
        });
      });
    },

    methods: {
      handleClickNotification(notification) {
        let that = this;
        notification.read_status = 1;
        console.log(notification);
        let url = notification.notification_content ? '/' + that.$i18n.locale + notification.notification_content.url : '';
        that.$store.dispatch('notifications/update', notification).then(function() {
          that.reloadList();
          if (url) {
            that.$router.push(url);
          }
        }).catch((error) => {
          console.log(error);
          that.$toaster.error(that.$i18n.t('message.fail_notification_update'));
          // that.$toaster.error(error.message || error.status);
        });
      },

      reloadList() {
        let that = this;
        that.$store.dispatch('notifications/index', {getBy: 'user', getLastest: that.limit}).then(result => {
          that.listNotificationArray = result.data;
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_notification_view'));
          }
          that.$nuxt.$loading.finish();
          // that.$toaster.error(error.message || error.status);
        });

        that.$store.dispatch('notifications/countUnRead', {getBy: 'user'}).then(result => {
          if (result.data > 99) {
            that.count_unread_message = '+99';
          } else {
            that.count_unread_message = result.data;
          }
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_notification_view'));
          }
          that.$nuxt.$loading.finish();
          // that.$toaster.error(error.message || error.status);
        });
      },

      changeLanguage(code) {
        let that = this;
        if (that.$i18n.locale !== code) {
          if (that.checkSuperAdmin) {
            that.$router.push({params: {lang: code}});
          } else {
            that.companyItem.language = code;
            that.$store.dispatch('companies/update', that.companyItem).then(function () {
              that.$router.push({params: {lang: code}});
              cookies.set('default_language', code);
            }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_company_update'));
              }
              that.$nuxt.$loading.finish();
              // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            });
          }
        }
        // this.$router.push({params: {lang: this.$i18n.locale}});
      },

      logout() {
        let that = this;
        that.$nuxt.$loading.start();
        that.$store.dispatch('authenticate/logout').then(function() {
          that.$nuxt.$loading.finish();
          that.$router.push('/login');
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_logout'));
          }
          // if (error.response && error.response.data) {
          //   that.$toaster.error(error.response.data.message || error.response.status);
          // }
          that.$nuxt.$loading.finish();
        });
      },

      getActivePlan () {
                this.isLoading = true;
                this.$store.dispatch('subscriptions/planActive', {}).then((res) => {
                    this.planActive = res.data.planAccess;
                    this.lastPlanActive = res.data.lastPlanAccess;
                    localStorage.setItem('planAccess', JSON.stringify(res.data));
                    this.isLoading = false;
                }).catch((error) => {
                    if (error.response?.status == 401) {
                        this.$router.push('/login');
                        this.$toaster.error(this.$i18n.t('message.token_expired'));
                    }
                    this.isLoading = false;
                });
            },
    },
  };
</script>

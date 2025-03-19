<template>
  <div id="app">
    <v-app>
      <Header />
      <NavbarGuide v-if="page === 'help-center'" />
      <NavbarAdmin v-else-if="checkSuperAdmin || checkCustomerServiceAdmin" />
      <Navbar v-else />
      <div class="container-page">
        <v-alert
          v-for="noti in listNotificationArray" :key="noti.id"
          text
          outlined
          color="deep-orange"
          icon="mdi-fire"
          class="alert-item text-left p-3"
        >
          <div v-html="noti.notification_content.description"></div>
          <v-divider
            class="my-4 deep-orange"
            style="opacity: 0.22"
          />
          <v-row
            align="center"
            justify="space-between"
            no-gutters
          >
            <v-col cols="7" class="grow">
              Click "APPLY" to update this change or click "DECLINE" to ignore this notification
            </v-col>
            <v-col cols="5" class="text-right">
              <v-btn
                class="mr-2"
                color="primary"
                @click="applyUpdate(noti)"
              >
                APPLY
              </v-btn>
              <v-btn
                text
                color="error"
                @click="declineUpdate(noti)"
              >
                DECLINE
              </v-btn>
            </v-col>
          </v-row>
        </v-alert>
        <nuxt />
      </div>
    </v-app>
  </div>
</template>
<script>
  import Navbar from '../components/navbar';
  import NavbarAdmin from '../components/navbarAdmin';
  import NavbarGuide from '../components/navbarGuide';
  import Header from '../components/header';
  import cookies from "js-cookie";

  export default {
    components: {
      Navbar,
      Header,
      NavbarAdmin,
      NavbarGuide
    },

    data() {
      return {
        listNotificationArray: [],
        checkSuperAdmin: cookies.get('checkSuperAdmin'),
        checkCustomerServiceAdmin: cookies.get('checkCustomerServiceAdmin'),
        page: this.$router.history.current.path.split("/")[2],
      };
    },

    watch: {
      $route(to) {
        this.page = to.path.split("/")[2];
        this.link = to.path.split("/")[to.path.split("/").length - 1];
      }
    },

    mounted() {
      let that = this;
      that.$nextTick(() => {
        that.$nuxt.$loading.start();
        that.$store.dispatch('notifications/index', {getBy: 'user', getShowAction: 1}).then(result => {
          that.listNotificationArray = result.data;
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          // that.$toaster.error(that.$i18n.t('message.fail_notification_view'));
          }
          that.$nuxt.$loading.finish();
          // that.$toaster.error(error.message || error.status);
        });
      });
    },

    methods: {
      applyUpdate(noti) {
        let that = this;
        that.$nuxt.$loading.start();
        if (noti.notification_content.feature === 'role') {
          that.$store.dispatch('roles/applyNewUpdate', noti.request_push_notification_id).then(function () {
            that.reloadList();
            that.$toaster.success(that.$i18n.t('message.success_role_update'));
          }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_role_update'));
            }
            that.$nuxt.$loading.finish();
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          });
        }
        //
        // that.$store.dispatch('authenticate/logout').then(function() {
        //   that.$nuxt.$loading.finish();
        //   that.$router.push('/login');
        // }).catch(error => {
        //   if (error.response && error.response.data) {
        //     that.$toaster.error(error.response.data.message || error.response.status);
        //   }
        //   that.$nuxt.$loading.finish();
        // });
      },

      declineUpdate(noti) {
        let that = this;
        that.$nuxt.$loading.start();
        that.$store.dispatch('requestPushNotification/declineNewUpdate', noti.request_push_notification_id).then(function () {
          that.reloadList();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_notification_update'));
          }
          that.$nuxt.$loading.finish();
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        });
      },

      reloadList() {
        let that = this;
        that.$store.dispatch('notifications/index', {getBy: 'user', getShowAction: 1}).then(result => {
          that.listNotificationArray = result.data;
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
    },
  };
</script>

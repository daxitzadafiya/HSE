<template>
  <div>
    <div class="login-page">
      <div class="login-background padding-top-64">
        <div class="login-background-grid">
          <div class="display-flex" style="grid-area: top / start / 8 / end;">
            <div style="background-image: linear-gradient(white 0%, rgb(247, 250, 252) 33%); flex-grow: 1;"></div>
          </div>
          <div class="display-flex" style="grid-area: 4 / 2 / auto / 5;">
            <div class="Box-divider--light-all-2" style="flex-grow: 1;"></div>
          </div>
          <div class="display-flex" style="grid-area: 6 / start / auto / 2;">
            <div class="Box-background--blue800" style="flex-grow: 1;"></div>
          </div>
          <div class="display-flex" style="grid-area: 7 / start / auto / 4;">
            <div class="Box-background--green" style="flex-grow: 1;"></div>
          </div>
          <div class="display-flex" style="grid-area: 8 / 4 / auto / 6;">
            <div class="Box-background--gray100" style="flex-grow: 1;"></div>
          </div>
          <div class="display-flex" style="grid-area: 2 / 15 / auto / end;">
            <div class="Box-background--cyan200" style="flex-grow: 1;"></div>
          </div>
          <div class="display-flex" style="grid-area: 3 / 14 / auto / end;">
            <div class="Box-background--green" style="flex-grow: 1;"></div>
          </div>
          <div class="display-flex" style="grid-area: 4 / 17 / auto / 20;">
            <div class="Box-background--gray100" style="flex-grow: 1;"></div>
          </div>
          <div class="display-flex" style="grid-area: 5 / 14 / auto / 17;">
            <div class="Box-divider--light-all-2" style="flex-grow: 1;"></div>
          </div>
        </div>
      </div>
      <div class="card logo-box">
        <a href="javascript:void(0)" class="text-center db">
          <img src="~assets/images/logo/icon-logo.png" alt="homepage">
          <br>
          <img src="~assets/images/logo/text-logo.png" class="light-logo" alt="homepage">
        </a>
      </div>
      <div class="login-box card">
        <div class="card-body">
          <b-form id="loginform" class="form-horizontal form-material"
                  onsubmit="return false;"
          >
            <div class="login-sub-title">
              <span>Hello <strong>{{ userInfo.email }}</strong>,</span><br/>
              <span v-if="!checkComplete">Please set your password and click Continue.</span>
            </div>
            <div v-if="!checkComplete">
              <div class="form-group">
                <div class="col-xs-12">
                  <label class="login-input-label">Password</label>
                  <b-form-input
                    v-model="userInfo.password"
                    v-validate="'required'"
                    name="password"
                    class="form-control"
                    data-vv-as="Password"
                    type="password"
                    ref="password"
                  />
                  <div v-show="errors.has('password')" class="validate-error">
                    {{ errors.first('password') }}
                  </div>
                </div>
              </div>
              <div class="form-group">
                <div class="col-xs-12">
                  <label class="login-input-label">Password confirmation</label>
                  <b-form-input
                    v-model="userInfo.password_confirmation"
                    v-validate="'required|confirmed:password'"
                    name="password_confirmation"
                    class="form-control"
                    data-vv-as="Password"
                    type="password"
                  />
                  <div v-show="errors.has('password_confirmation')" class="validate-error">
                    {{ errors.first('password_confirmation') }}
                  </div>
                </div>
              </div>
              <div class="form-group text-center">
                <div class="col-xs-12">
                  <button class="btn btn-info btn-lg btn-block text-uppercase waves-effect waves-light" @click="reset">
                    continue
                  </button>
                </div>
              </div>
            </div>
            <div v-else>
              <div class="form-group">
                <div class="col-xs-12">
                  <label class="login-input-label">
                    {{ message }} <br/>You will be redirected to the login page in 5 sec.
                  </label>
                </div>
              </div>
            </div>
          </b-form>
          <div class="form-group reset-password">
            <div class="col-xs-12">
              <a href="javascript:void(0)" class="back-to-login" @click="$router.push('/login')">
                <i class="fas fa-chevron-left icon-reset-password"/>
                Back to Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import cookies from "js-cookie";

export default {
  auth: false,
  layout: 'login',
  data: () => ({
    resetToken: '',
    userInfo: {
      email: '',
      password: '',
      password_confirmation: '',
    },
    checkComplete: false,
    message: '',
  }),
  computed: {
    // redirect() {
    //   return (
    //     this.$route.query.redirect &&
    //     decodeURIComponent(this.$route.query.redirect)
    //   );
    // },
    // isCallback() {
    //   return Boolean(this.$route.query.callback);
    // }
  },

  mounted() {
    let that = this;
    that.loading = true;
    that.checkComplete = false;
    that.message = '';
    that.resetToken = that.$route.params.code;
    const token = cookies.get('x-auth-token');
    if (token) {
      that.$store.dispatch('authenticate/logout').then(function() {
        that.getPage();
      }).catch(() => {
        that.$toster.error(that.$i18n.t('message.fail_logout'));
        // if (error.response && error.response.data) {
        //   that.$toaster.error(error.response.data.message || error.response.status);
        // }
      });
    } else {
      that.getPage();
    }

  },

  methods: {
    getPage() {
      let that = this;
      that.$store.dispatch('verificationCode/show', that.resetToken).then(result => {
        // console.log(result.data);
        if (result.data) {
          that.userInfo.email = result.data.user.email;
          // if (result.data.action === 'active account') {
          //   that.userInfo.password = result.data.user.phone_number;
          //
          //   that.$nuxt.$loading.start();
          //   that.$store.dispatch('authenticate/resetPassword', {
          //     email: that.userInfo.email,
          //     password: that.userInfo.password,
          //     code: that.resetToken,
          //   }).then(function () {
          //     that.checkComplete = true;
          //     that.message = 'Email verification successful.';
          //     that.$nuxt.$loading.finish();
          //     setTimeout(() => {
          //       that.$router.push('/login');
          //     }, 5000);
          //   }).catch(error => {
          //     that.$nuxt.$loading.finish();
          //     if (error.response && error.response.data) {
          //       that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          //     }
          //   });
          // }
        } else {
          that.$router.push('/login');
        }
      }).catch(() => {
        that.$toster.error(that.$i18n.t('message.fail_not_a_user'));
        // if (error.response && error.response.data) {
        //   that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        //   that.$router.push('/login');
        // }
      });
    },

    reset() {
      var that = this;
      this.$validator.validate().then(result => {
        if (result) {
          that.$nuxt.$loading.start();
          that.$store.dispatch('authenticate/resetPassword', {
            email: that.userInfo.email,
            password: that.userInfo.password,
            code: that.resetToken,
          }).then(result => {
            that.checkComplete = true;
            that.message = result.data.data;
            that.$nuxt.$loading.finish();
            setTimeout(() => {
              that.$router.push('/login');
            }, 5000);
            that.$toaster.success(that.$i18n.t('message.success_reset_password'));
          }).catch(() => {
            that.$toaster.error(that.$i18n.t('message.fail_reset_password'));
            that.$nuxt.$loading.finish();
            // if (error.response && error.response.data) {
            //   that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            // }
          });
        } else {
          return false;
        }
      }).catch(error => {
        console.log(error);
        return false;
      });
    },
  },
};
</script>

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
          <b-form v-if="!actionForgotPassword" id="loginform" class="form-horizontal form-material"
                  onsubmit="return false;"
          >
            <div class="login-sub-title">
              Sign in to you account
            </div>
            <div class="form-group">
              <div class="col-xs-12">
                <label class="login-input-label">Email</label>
                <b-form-input
                  v-model="userInfo.email"
                  v-validate="'required|email'"
                  name="email"
                  class="form-control"
                  data-vv-as="Email"
                  type="email"
                  @keyup.enter="login()"
                />
                <div v-show="errors.has('email')" class="validate-error">
                  {{ errors.first('email') }}
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="col-xs-12">
                <label class="login-input-label">Password</label>
                <b-form-input
                  v-model="userInfo.password"
                  v-validate="{ required: true}"
                  name="password"
                  class="form-control"
                  data-vv-as="Password"
                  type="password"
                  @keyup.enter="login()"
                />
                <div v-show="errors.has('password')" class="validate-error">
                  {{ errors.first('password') }}
                </div>
              </div>
              <div class="col-xs-12 forgot-password">
                <i class="fa fa-lock m-r-5" />
                <a id="to-recover" href="javascript:void(0)" class="text-dark" @click="btnForgotPassword">
                  Forgot password?
                </a>
              </div>
            </div>
            <div class="form-group text-center">
              <div class="col-xs-12">
                <button class="btn btn-info btn-lg btn-block text-uppercase waves-effect waves-light" @click="login">
                  continue
                </button>
              </div>
            </div>
<!--            <div class="form-group">-->
<!--              <div class="col-xs-12">-->
<!--                <div class="checkbox checkbox-primary p-t-0">-->
<!--                  <input id="checkbox-signup" type="checkbox">-->
<!--                  <label for="checkbox-signup"> Stay signed in </label>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
          </b-form>
          <div v-if="actionForgotPassword" class="form-group reset-password">
            <div class="col-xs-12">
              <div class="title">
                reset password
              </div>
              <div v-if="!checkSentMail">
                <div class="sub-title">
                  Enter your email and instructions will be sent to you
                </div>
                <!--              <input id="reset-password-email" type="email" placeholder="Email" class="form-control" name="email"-->
                <!--                     required autofocus-->
                <!--              >-->
                <div class="form-group">
                  <div class="col-xs-12">
                    <label class="login-input-label">Email</label>
                    <b-form-input
                      v-model="emailForgot"
                      v-validate="'required|email'"
                      name="email"
                      class="form-control"
                      data-vv-as="Email"
                      type="email"
                      @keyup.enter="forgotPassword()"
                    />
                    <div v-show="errors.has('email')" class="validate-error">
                      {{ errors.first('email') }}
                    </div>
                  </div>
                </div>
                <button
                  class="btn btn-info btn-lg btn-block text-uppercase btn-reset-password"
                  @click="forgotPassword"
                >
                  SEND PASSWORD RESET LINK
                </button>
              </div>
              <div v-else>
                <div class="form-group">
                  <div class="col-xs-12">
                    <label class="login-input-label">{{ message }} <br/>Check your email and follow the instructions.</label>
                  </div>
                </div>
              </div>
              <a href="javascript:void(0)" class="back-to-login" @click="btnForgotPassword">
                <i class="fas fa-chevron-left icon-reset-password"/>
                Back to Login
              </a>
            </div>
          </div>
        </div>
      </div>
<!--      <div class="card text-center sign-up-text">-->
<!--        <div class="col-xs-12">-->
<!--          Don’t have an account?-->
<!--          <a id="to-sign-up" href="javascript:void(0)">-->
<!--            Sign up-->
<!--          </a>-->
<!--        </div>-->
<!--      </div>-->
    </div>
  </div>
</template>

<script>

  export default {
    auth: false,
    layout: 'login',
    data: () => ({
      actionForgotPassword: false,
      userInfo: {
        email: '',
        password: ''
      },
      emailForgot: '',
      checkSentMail: false,
      message: '',
    }),
    computed: {
      redirect() {
        return (
          this.$route.query.redirect &&
          decodeURIComponent(this.$route.query.redirect)
        );
      },
      isCallback() {
        return Boolean(this.$route.query.callback);
      }
    },
    methods: {
      btnForgotPassword() {
        this.checkSentMail = false;
        this.message = '';
        if (this.actionForgotPassword) {
          this.actionForgotPassword = !this.actionForgotPassword;
        } else {
          this.actionForgotPassword = true;
        }
      },

      login() {
        var that = this;
        this.$validator.validate().then(result => {
          if (result) {
            that.loading = true;
            that.$store.dispatch('authenticate/login', {
              email: that.userInfo.email,
              password: that.userInfo.password
            }).then(function (res) {
              // console.log(result.data);
              // console.log(result.data.user_info.role.level);
              // that.$router.push('/home');
              that.$router.push('/dashboard/overview');
              localStorage.setItem("time_zone",res?.data?.data?.user_info?.company?.time_zone);
              // if (result.data.user_info.role && result.data.user_info.role.level === 0) {
              //   that.$router.push('/overview/companies');
              // } else {
              //   that.$router.push('/company/company');
              // }
            }).catch(() => {
          //   if (error.response.status == 401) {
          //   this.$router.push('/login');
          //   this.$toaster.error(this.$i18n.t('message.token_expired'));
          // }else{
              that.$toaster.error(that.$i18n.t('message.fail_login'));
              // }
              that.loading = false;
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

      forgotPassword() {
        var that = this;
        that.$validator.validate().then(result => {
          if (result) {
            that.$nuxt.$loading.start();
            that.$store.dispatch('authenticate/forgotPassword', {email: that.emailForgot}).then(result => {
              // that.$router.push('/home');
              // console.log(result.data.data);
              that.checkSentMail = true;
              that.message = result.data.data;
              that.$nuxt.$loading.finish();
            }).catch(() => {
          //   if (error.response.status == 401) {
          //   this.$router.push('/login');
          //   this.$toaster.error(this.$i18n.t('message.token_expired'));
          // }else{
              that.$toaster.error(that.$i18n.t('message.fail_forgot_password'));
              // }
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
      }
    },
  };
</script>

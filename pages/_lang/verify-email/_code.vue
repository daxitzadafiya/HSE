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
            </div>
            <div v-if="checkComplete" class="form-group">
              <div class="col-xs-12">
                <label class="login-input-label">
                  {{ message }} <br/>You will be redirected to the login page in 5 sec.
                </label>
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

    <div v-if="loading" class="loading-page">
      <div class="sk-fading-circle">
        <div class="sk-circle1 sk-circle" />
        <div class="sk-circle2 sk-circle" />
        <div class="sk-circle3 sk-circle" />
        <div class="sk-circle4 sk-circle" />
        <div class="sk-circle5 sk-circle" />
        <div class="sk-circle6 sk-circle" />
        <div class="sk-circle7 sk-circle" />
        <div class="sk-circle8 sk-circle" />
        <div class="sk-circle9 sk-circle" />
        <div class="sk-circle10 sk-circle" />
        <div class="sk-circle11 sk-circle" />
        <div class="sk-circle12 sk-circle" />
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
    loading: true,
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
        that.$toaster.error(that.$i18n.t('message.fail_logout'));
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
        if (result.data) {
          that.userInfo.email = result.data.user.email;
          if (result.data.action === 'active account') {
            that.userInfo.password = result.data.user.phone_number;
            that.$store.dispatch('authenticate/resetPassword', {
              email: that.userInfo.email,
              password: that.userInfo.password,
              code: that.resetToken,
            }).then(function () {
              that.loading = false;
              that.checkComplete = true;
              that.message = 'Email verification successful.';
              that.$nuxt.$loading.finish();
              setTimeout(() => {
                that.$router.push('/login');
              }, 5000);
            }).catch(() => {
              that.$toaster.error(that.$i18n.t('message.fail_reset_password'));
              that.$nuxt.$loading.finish();
              // if (error.response && error.response.data) {
              //   that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
              // }
            });
          }
        } else {
          that.$router.push('/login');
        }
      }).catch(() => {
        that.$toaster.error(that.$i18n.t('message.fail_not_a_user'));
        that.$router.push('/login');
        // if (error.response && error.response.data) {
        //   that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        //   that.$router.push('/login');
        // }
      });
    },
  },
};
</script>

<style scoped>
/* Absolute Center Spinner */
.loading-page {
  position: fixed;
  z-index: 99999999999;
  height: 2em;
  width: 2em;
  overflow: show;
  margin: auto;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

/* Transparent Overlay */
.loading-page:before {
  content: '';
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* :not(:required) hides these rules from IE9 and below */
.loading-page:not(:required) {
  /* hide "loading..." text */
  font: 0/0 a;
  color: transparent;
  text-shadow: none;
  background-color: transparent;
  border: 0;
}

.sk-fading-circle {
  margin: 40px auto;
  width: 60px;
  height: 60px;
  position: relative;
}

.sk-fading-circle .sk-circle {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}

.sk-fading-circle .sk-circle:before {
  content: '';
  display: block;
  margin: 0 auto;
  width: 15%;
  height: 15%;
  background-color: #333;
  border-radius: 100%;
  -webkit-animation: sk-circleFadeDelay 1.2s infinite ease-in-out both;
  animation: sk-circleFadeDelay 1.2s infinite ease-in-out both;
}

.sk-fading-circle .sk-circle2 {
  -webkit-transform: rotate(30deg);
  -ms-transform: rotate(30deg);
  transform: rotate(30deg);
}

.sk-fading-circle .sk-circle3 {
  -webkit-transform: rotate(60deg);
  -ms-transform: rotate(60deg);
  transform: rotate(60deg);
}

.sk-fading-circle .sk-circle4 {
  -webkit-transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  transform: rotate(90deg);
}

.sk-fading-circle .sk-circle5 {
  -webkit-transform: rotate(120deg);
  -ms-transform: rotate(120deg);
  transform: rotate(120deg);
}

.sk-fading-circle .sk-circle6 {
  -webkit-transform: rotate(150deg);
  -ms-transform: rotate(150deg);
  transform: rotate(150deg);
}

.sk-fading-circle .sk-circle7 {
  -webkit-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  transform: rotate(180deg);
}

.sk-fading-circle .sk-circle8 {
  -webkit-transform: rotate(210deg);
  -ms-transform: rotate(210deg);
  transform: rotate(210deg);
}

.sk-fading-circle .sk-circle9 {
  -webkit-transform: rotate(240deg);
  -ms-transform: rotate(240deg);
  transform: rotate(240deg);
}

.sk-fading-circle .sk-circle10 {
  -webkit-transform: rotate(270deg);
  -ms-transform: rotate(270deg);
  transform: rotate(270deg);
}

.sk-fading-circle .sk-circle11 {
  -webkit-transform: rotate(300deg);
  -ms-transform: rotate(300deg);
  transform: rotate(300deg);
}

.sk-fading-circle .sk-circle12 {
  -webkit-transform: rotate(330deg);
  -ms-transform: rotate(330deg);
  transform: rotate(330deg);
}

.sk-fading-circle .sk-circle2:before {
  -webkit-animation-delay: -1.1s;
  animation-delay: -1.1s;
}

.sk-fading-circle .sk-circle3:before {
  -webkit-animation-delay: -1s;
  animation-delay: -1s;
}

.sk-fading-circle .sk-circle4:before {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}

.sk-fading-circle .sk-circle5:before {
  -webkit-animation-delay: -0.8s;
  animation-delay: -0.8s;
}

.sk-fading-circle .sk-circle6:before {
  -webkit-animation-delay: -0.7s;
  animation-delay: -0.7s;
}

.sk-fading-circle .sk-circle7:before {
  -webkit-animation-delay: -0.6s;
  animation-delay: -0.6s;
}

.sk-fading-circle .sk-circle8:before {
  -webkit-animation-delay: -0.5s;
  animation-delay: -0.5s;
}

.sk-fading-circle .sk-circle9:before {
  -webkit-animation-delay: -0.4s;
  animation-delay: -0.4s;
}

.sk-fading-circle .sk-circle10:before {
  -webkit-animation-delay: -0.3s;
  animation-delay: -0.3s;
}

.sk-fading-circle .sk-circle11:before {
  -webkit-animation-delay: -0.2s;
  animation-delay: -0.2s;
}

.sk-fading-circle .sk-circle12:before {
  -webkit-animation-delay: -0.1s;
  animation-delay: -0.1s;
}

@-webkit-keyframes sk-circleFadeDelay {
  0%, 39%, 100% {
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
}

@keyframes sk-circleFadeDelay {
  0%, 39%, 100% {
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
}


</style>

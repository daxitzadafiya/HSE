<template>
  <div class="resources-page">
<!--    <v-btn class="mb-2 btn-create btn-custom-green" @click="checkAddNew = true">-->
<!--      {{ $t('button.add_new') }}-->
<!--    </v-btn>-->
    <b-tabs card name="test">
      <b-tab :title="$t('tab.roles')" active name="result-tab" class="result-tab">
        <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKey" />
        <v-container>
          <RoleTable
            :list-array-input="rolesArray"
            :level-array-input="levelArray"
            @reloadList="reloadList"
          />
        </v-container>
      </b-tab>
    </b-tabs>
    <!--    dialog role-->
    <RolePopup
      :open-popup="checkAddNew"
      :level-array-input="levelArray"
      @closePopup="checkAddNew = !checkAddNew"
      @reloadList="reloadList"
    />
  </div>
</template>
<script>
  import {_} from 'vue-underscore';
  import cookies from 'js-cookie';
  import TitleCaption from "../../../../components/TitleCaption";
  import RolePopup from "../../../../components/RolePopup";
  import RoleTable from "../../../../components/RoleTable";

  export default {
    components: {
      TitleCaption,
      RolePopup,
      RoleTable,
    },

    data: () => ({
      userRoleId: parseInt(cookies.get('roleID')),
      userDepartmentID: parseInt(cookies.get('userDepartmentID')),
      checkAdmin: cookies.get('checkAdmin'),
      roleUser: cookies.get('roleUser'),
      pageKey: 'overview-roles-roles',
      checkAddNew: false,
      rolesArray: [],
      levelArray: [],
    }),

    watch: {
      dialog(val) {
        val || this.close();
      },
    },

    mounted() {
      let that = this;
      that.$nextTick(() => {
        that.$nuxt.$loading.start();
        // list roles
        that.$store.dispatch('roles/index').then(result => {
          that.rolesArray = result.data;
          that.levelArray = _.pluck(result.data, 'level');
          that.levelArray = _.sortBy(that.levelArray, function(num) {
            return num;
          });
          that.$nuxt.$loading.finish();
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
      });
    },

    methods: {
      reloadList() {
        let that = this;
        // list roles
        that.$store.dispatch('roles/index').then(result => {
          that.rolesArray = result.data;
          that.levelArray = _.pluck(result.data, 'level');
          that.levelArray = _.sortBy(that.levelArray, function(num) {
            return num;
          });
          that.$nuxt.$loading.finish();
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
      },

    },
  };
</script>

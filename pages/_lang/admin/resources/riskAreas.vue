<template>
  <div class="resources-page">
    <v-btn
      class="mb-2 btn-create btn-custom-green"
      @click="checkAddNew = true"
    >
      {{ $t('button.add_new') }}
    </v-btn>

    <b-tabs card lazy>
      <keep-alive>
        <b-tab :title="$t('tab.risk_elements')">
<!--          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKey" />-->
          <v-container>
            <RiskAreaPopup
              :open-popup="checkAddNew"
              :resource="true"
              :industry-array="industriesArray"
              :categories-array="categoriesArray"
              @closePopup="checkAddNew = !checkAddNew"
              @reloadList="reloadList"
              @reloadListCategory="reloadListCategory"
            />
            <RiskAreaTable
              :resource="true"
              :industry-array="industriesArray"
              :list-array-input="listArray"
              :categories-array="categoriesArray"
              @reloadList="reloadList"
              @reloadListCategory="reloadListCategory"
            />
          </v-container>
        </b-tab>
      </keep-alive>
    </b-tabs>
  </div>
</template>
<script>
  import {_} from 'vue-underscore';
  import cookies from 'js-cookie';
  // import TitleCaption from "../../../../components/TitleCaption";
  import RiskAreaPopup from "../../../../components/RiskAreaPopup";
  import RiskAreaTable from "../../../../components/RiskAreaTable";

  export default {
    components: {
      // TitleCaption,
      RiskAreaPopup,
      RiskAreaTable,
    },

    data: () => ({
      userRoleId: parseInt(cookies.get('roleID')),
      userDepartmentID: parseInt(cookies.get('userDepartmentID')),
      checkAdmin: cookies.get('checkAdmin'),
      // roleUser: cookies.get('roleUser'),
      // pageKey: 'resources-routines-resources',
      checkAddNew: false,
      listArray: [],
      industriesArray: [],
      categoriesArray: [],
      categoriesSelection: [],
      categoriesDefault: {
        id: 0,
        name: "All"
      },
      category_risk_area: 'risk',
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
        }).catch(() => {
          // that.$toaster.error(that.$i18n.t('message.fail_industry_view'));
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });

        // list categories
        that.$store.dispatch('categories/index', {type: that.category_risk_area}).then(result => {
          that.categoriesArray = result.data;
          that.categoriesSelection = _.clone(result.data);
          that.categoriesSelection.push(that.categoriesDefault);
          that.categoriesSelection.sort(function (a, b) {
            return (a.id - b.id);
          });
        }).catch(() => {
          // that.$toaster.error(that.$i18n.t('message.fail_category_view'));
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });

        // list routines
        that.$store.dispatch('riskElementSource/index').then(result => {
          that.listArray = result.data;
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_risk_element_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      });
    },

    methods: {
      reloadList(){
        let that = this;
        // get list
        that.$store.dispatch('riskElementSource/index').then(result => {
          that.listArray = result.data;
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_risk_element_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      },

      reloadListCategory(){
        let that = this;
        that.$store.dispatch('categories/index', {type: that.category_risk_area}).then(result => {
          that.categoriesArray = _.filter(result.data, function (item) {
            return !item.disable_status;
          });
          that.categoriesSelection = _.clone(that.categoriesArray);
          that.categoriesSelection.push(that.categoriesDefault);
          that.categoriesSelection.sort(function (a, b) {
            return (a.id - b.id);
          });
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_category_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      },
    },
  };
</script>

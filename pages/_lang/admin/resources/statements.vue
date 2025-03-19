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
        <b-tab :title="$t('tab.hse_statement')">
<!--          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKey" />-->
          <v-container>
            <StatementPopup
              :open-popup="checkAddNew"
              @closePopup="checkAddNew = !checkAddNew"
              @reloadList="reloadList"
            />
            <StatementTable
              :list-array-input="listArray"
              @reloadList="reloadList"
            />
          </v-container>
        </b-tab>
      </keep-alive>
    </b-tabs>
  </div>
</template>
<script>
  // import {_} from 'vue-underscore';
  import cookies from 'js-cookie';
  // import TitleCaption from "../../../../components/TitleCaption";
  import StatementPopup from "../../../../components/StatementPopup";
  import StatementTable from "../../../../components/StatementTable";

  export default {
    components: {
      // TitleCaption,
      StatementPopup,
      StatementTable,
    },

    data: () => ({
      userRoleId: parseInt(cookies.get('roleID')),
      // userDepartmentID: parseInt(cookies.get('userDepartmentID')),
      checkAdmin: cookies.get('checkAdmin'),
      // roleUser: cookies.get('roleUser'),
      // pageKey: 'resources-statements-resources',
      checkAddNew: false,
      listArray: [],
      // categoriesArray: [],
      // categoriesSelection: [],
      // categoriesDefault: {
      //   id: 0,
      //   name: "All"
      // },
      // industriesArray: [],
      // category_routine: 1, // category type: routine
    }),

    computed: {},

    watch: {},

    mounted() {
      let that = this;
      that.$nextTick(() => {
        that.$nuxt.$loading.start();
        // list categories
        // that.$store.dispatch('categories/index', {type: 1}).then(result => {
        //   that.categoriesArray = result.data;
        //   that.categoriesSelection = _.clone(result.data);
        //   that.categoriesSelection.push(that.categoriesDefault);
        //   that.categoriesSelection.sort(function (a, b) {
        //     return (a.id - b.id);
        //   });
        // }).catch((error) => {
        //   that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        //   that.$nuxt.$loading.finish();
        // });

        // list statements
        that.$store.dispatch('statements/index').then(result => {
          that.listArray = result.data;
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_statement_view'));
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
        that.$store.dispatch('statements/index').then(result => {
          that.listArray = result.data;
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_statement_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      },
    },
  };
</script>

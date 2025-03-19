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
        <b-tab :title="$t('tab.contacts')">
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKey" />
          <v-container>
            <ContactPopup
              :open-popup="checkAddNew"
              :resource="true"
              :view-only="false"
              :categories-array="categoriesArray"
              @closePopup="checkAddNew = !checkAddNew"
              @reloadList="reloadList"
              @reloadListCategory="reloadListCategory"
            />
            <ContactTable
              :resource="true"
              :list-array-input="listArray"
              :categories-array="categoriesArray"
              :categories-selection="categoriesSelection"
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
  import TitleCaption from "../../../../components/TitleCaption";
  import ContactTable from "../../../../components/ContactTable";
  import ContactPopup from "../../../../components/ContactPopup";

  export default {
    components: {
      TitleCaption,
      ContactTable,
      ContactPopup,
    },

    data: () => ({
      userRoleId: parseInt(cookies.get('roleID')),
      userDepartmentID: parseInt(cookies.get('userDepartmentID')),
      pageKey: 'company-contacts-contacts',
      checkAddNew: false,
      listArray: [],
      categoriesArray: [],
      categoriesSelection: [],
      categoriesDefault: {
        id: 0,
        name: "All"
      },
      category_contact: 'contact', // category type: contact
      // permissionsUser: localStorage.getItem('permissionsKey'),
      // search: '',
    }),

    computed: {},

    watch: {},

    mounted() {
      let that = this;
      that.$nextTick(() => {
        that.$nuxt.$loading.start();
        // list categories
        that.$store.dispatch('categories/index', {type: that.category_contact}).then(result => {
          that.categoriesArray = result.data;
          that.categoriesSelection = _.clone(result.data);
          that.categoriesSelection.push(that.categoriesDefault);
          that.categoriesSelection.sort(function (a, b) {
            return (a.id - b.id);
          });
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          // that.$toaster.error(that.$i18n.t('message.fail_category_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });

        // list contacts
        that.$store.dispatch('contacts/index').then(result => {
          that.listArray = result.data;
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_contact_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      });
    },

    methods: {
      reloadList(){
        let that = this;
        that.$store.dispatch('contacts/index').then(result => {
          that.listArray = result.data;
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_contact_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      },

      reloadListCategory(){
        let that = this;
        that.$store.dispatch('categories/index', {type: that.category_contact}).then(result => {
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

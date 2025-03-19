<template>
  <div class="contact-page">

    <div @mouseenter="hoverContactPlanAccess = true" @mouseleave="hoverContactPlanAccess = false" style="width: fit-content">
    <v-badge v-if="!!planAccess?.lastPlanAccess?.contact" :value="hoverContactPlanAccess" right
          transition="slide-x-transition" class=" hover-label hse--icon-question-circle badgee">
        <span slot="badge" @click="redirectUrl">{{ $t('message.accessible_module') }}</span> 
    </v-badge>
        <v-btn v-if="checkAdmin || (permissionsUser.indexOf('task-basic') > -1 && roleUser !== 'user')" class="mt-2 btn-create btn-custom-green"
            @click="checkAddNew = true" :disabled="!!planAccess?.lastPlanAccess?.contact">
            {{ $t('button.add_new') }}
        </v-btn>
    </div> 
    <b-tabs card name="test" lazy>
      <keep-alive>
        <b-tab :title="$t('tab.contacts')" active>
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKey" />
          <v-container>
            <ContactPopup
              :open-popup="checkAddNew"
              :view-only="false"
              :categories-array="categoriesArray"
              @closePopup="checkAddNew = !checkAddNew"
              @reloadList="reloadList"
              @reloadListCategory="reloadListCategory"
            />
            <ContactTable
              :list-array-input="listContact"
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
import TitleCaption from "../../../components/TitleCaption";
import ContactTable from "../../../components/ContactTable";
import ContactPopup from "../../../components/ContactPopup";

export default {
  components: {
    TitleCaption,
    ContactTable,
    ContactPopup,
  },

  data: () => ({
    userRoleId: parseInt(cookies.get('roleID')),
    userDepartmentID: parseInt(cookies.get('userDepartmentID')),
    checkAdmin: cookies.get('checkAdmin'),
    roleUser: cookies.get('roleUser'),
    pageKey: 'company-contacts-contacts',
    permissionsUser: localStorage.getItem('permissionsKey'),
    planAccess: JSON.parse(localStorage.getItem('planAccess')),
    listContact: [],
    categoriesArray: [],
    categoriesSelection: [],
    categoriesDefault: {
      id: 0,
      name: "All"
    },
    category_contact: 'contact',
    checkAddNew: false,
    hoverContactPlanAccess: false,
  }),

  computed: {},

  watch: {},

  mounted() {
    let that = this;
    that.$nextTick(() => {
      that.$nuxt.$loading.start();
      // list contacts
      that.$store.dispatch('contacts/index').then(result => {
        that.listContact = result.data;
      }).catch((error) => {
        if (error.response.status == 401) {
          this.$router.push('/login');
          this.$toaster.error(this.$i18n.t('message.token_expired'));
        }else{
          that.$toaster.error(that.$i18n.t('message.fail_contact_view'));
        }
        that.$nuxt.$loading.finish();
        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
      });

      // list categories
      that.$store.dispatch('categories/index', {type: that.category_contact}).then(result => {
        that.categoriesArray = result.data;
        that.categoriesSelection = _.clone(result.data);
        that.categoriesSelection.push(that.categoriesDefault);
        that.categoriesSelection.sort(function (a, b) {
          return (a.id - b.id);
        });
        that.$nuxt.$loading.finish();
      }).catch(() => {
        // that.$toaster.error(that.$i18n.t('message.failed'));
        that.$nuxt.$loading.finish();
        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
      });
    });
  },

  methods: {
    redirectUrl(){
      if (this.roleUser == 'company admin') {
              this.$router.push('/settings/billings/');
          }
    },
    reloadList(){
      let that = this;
      that.$store.dispatch('contacts/index').then(result => {
        that.listContact = result.data;
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

<style scoped>
:deep(.hover-label .v-badge__badge){
  inset: auto auto calc(100% - 30px) calc(85% - 10px) !important;
}

.badgee{
  position: unset; 
  cursor: pointer;
}
.v-btn--disabled {
    pointer-events: auto;
}
</style>

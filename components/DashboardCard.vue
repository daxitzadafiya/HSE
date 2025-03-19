<template>
  <div>
    <v-card
      class="mx-auto"
      width="100%"
      outlined
    >
      <v-list-item three-line class="p-3">
        <v-list-item-content>
          <div class="text-overline">
            {{ mainTitle }}
          </div>
          <div>
            <v-list-item-title class="text-h5 mb-1">
              {{ mainNumber }}
            </v-list-item-title>
            <v-list-item-subtitle v-if="description">{{ description }}</v-list-item-subtitle>
          </div>
          <v-card-actions class="p-0">
            <v-btn
              class="btn-custom-green"
              @click="showLatestItems"
            >
              View latest objects
            </v-btn>
          </v-card-actions>
        </v-list-item-content>
        <div v-if="chartType === 'bar'" class="w-50">
          <VerticalBarChart :type="type" :mode="mode" @getAveRate="getAveRate" />
        </div>
        <div v-else class="w-50">
          <DoughnutChart :type="type" :mode="mode" @getTotal="getTotal" />
        </div>
      </v-list-item>
    </v-card>

    <LatestItemsPopup
      :open-popup="checkShowLatestItems"
      :objects-array="listArray"
      :type="type"
      @closePopup="close"
    />
  </div>
</template>

<script>
import VerticalBarChart from "./VerticalBarChart";
import LatestItemsPopup from "./LatestItemsPopup";
import DoughnutChart from "./DoughnutChart";
// import {_} from "vue-underscore";

export default {
  name: "DashboardCard",
  components: {
    VerticalBarChart,
    LatestItemsPopup,
    DoughnutChart,
  },
  props: {
    type: {
      type: String,
    },
    mode: {
      type: String,
    },
    chartType: {
      type: String,
    },
    mainTitle: {
      type: String,
    },
    description: {
      type: String,
      required: false,
    },
  },
  data: () => ({
    checkShowLatestItems: false,
    listArray: [],
    mainNumber: 0,
  }),

  methods: {
    getTotal(value) {
      this.mainNumber = value;
    },

    getAveRate(value) {
      this.mainNumber = value;
    },

    close() {
      this.checkShowLatestItems = !this.checkShowLatestItems;
      this.listArray = [];
    },

    showLatestItems() {
      let that = this;
      that.$nuxt.$loading.start();
      // console.log(this.type);
      // console.log(this.mode);
      if (that.type === 'task') {
        that.$store.dispatch('taskAssignees/index', {getLimit: 5, getOrderBy: 'latest'}).then(result => {
          that.listArray = result.data;
          that.checkShowLatestItems = true;
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }
          // that.$toaster.error(that.$i18n.t('message.fail_task_assignee_view'));
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      } else if (that.type === 'taskAssignee') {
        that.$store.dispatch('taskAssignees/index', {getLimit: 5, getOrderBy: 'latest'}).then(result => {
          that.listArray = result.data;
          that.checkShowLatestItems = true;
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }
          // that.$toaster.error(that.$i18n.t('message.fail_task_assignee_view'));
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      } else if (that.type === 'deviation') {
        that.$store.dispatch('deviations/index', {getLimit: 5, getOrderBy: 'latest'}).then(result => {
          that.listArray = result.data;
          that.checkShowLatestItems = true;
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_deviation_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      } else if (that.type === 'goal') {
        that.$store.dispatch('goals/index', {getLimit: 5, getOrderBy: 'latest'}).then(result => {
          that.listArray = result.data;
          that.checkShowLatestItems = true;
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_goal_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      } else if (that.type === 'routine') {
        that.$store.dispatch('routines/index', {getLimit: 5, getOrderBy: 'latest'}).then(result => {
          that.listArray = result.data;
          that.checkShowLatestItems = true;
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_routine_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      } else if (that.type === 'instruction') {
        that.$store.dispatch('instructions/index', {getLimit: 5, getOrderBy: 'latest'}).then(result => {
          that.listArray = result.data;
          that.checkShowLatestItems = true;
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_instruction_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      } else if (that.type === 'risk element') {
        that.$store.dispatch('riskElementSource/index', {getLimit: 5, getOrderBy: 'latest'}).then(result => {
          that.listArray = result.data;
          that.checkShowLatestItems = true;
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_risk_element_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      } else if (that.type === 'checklist') {
        that.$store.dispatch('checklists/index', {getLimit: 5, getOrderBy: 'latest'}).then(result => {
          that.listArray = result.data;
          that.checkShowLatestItems = true;
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_checklist_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      } else if (that.type === 'document') {
        that.$store.dispatch('documents/index', {getLimit: 5, getOrderBy: 'latest'}).then(result => {
          that.listArray = result.data;
          that.checkShowLatestItems = true;
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_document_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      } else if (that.type === 'report checklist') {
        that.$store.dispatch('reports/index', {getLimit: 5, getOrderBy: 'latest'}).then(result => {
          that.listArray = result.data;
          that.checkShowLatestItems = true;
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_checklist_report_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      } else if (that.type === 'risk analysis') {
        that.$store.dispatch('riskAnalysis/index', {getLimit: 5, getOrderBy: 'latest'}).then(result => {
          that.listArray = result.data;
          that.checkShowLatestItems = true;
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_risk_analysis_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      } else if (that.type === 'contact') {
        that.$store.dispatch('contacts/index', {getLimit: 5, getOrderBy: 'latest'}).then(result => {
          that.listArray = result.data;
          that.checkShowLatestItems = true;
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_contact_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      }
    },
  }
};
</script>

<style scoped>

</style>

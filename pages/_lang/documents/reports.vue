<template>
  <div class="documents-page">
    <b-tabs card lazy>
      <keep-alive>
        <b-tab :title="$t('tab.deviations')" name="deviation-tab">
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyDeviation" />
          <v-container>
            <v-container>
              <DocumentTable
                :table-title="'Report'"
                :resource="false"
                :list-array-input="listArray"
                :categories-array="categoriesDeviationArray"
                :categories-selection="categoriesDeviationSelection"
                :category-type="'deviation'"
              />
            </v-container>
          </v-container>
        </b-tab>
      </keep-alive>
      <keep-alive>
        <b-tab :title="$t('tab.report_checklists')" name="checklist-tab">
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyChecklist" />
          <v-container>
            <DocumentTable
              :table-title="'Report'"
              :resource="false"
              :list-array-input="listChecklistAttachment"
              :categories-array="categoriesChecklistArray"
              :categories-selection="categoriesChecklistSelection"
              :category-type="'checklist'"
            />
          </v-container>
        </b-tab>
      </keep-alive>
      <keep-alive>
        <b-tab :title="$t('tab.report_risk_analysis')" name="risk-element-tab">
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyRiskElement" />
          <v-container>
            <DocumentTable
              :table-title="'Report'"
              :resource="false"
              :list-array-input="listRiskElementAttachment"
              :categories-array="categoriesRiskElementArray"
              :categories-selection="categoriesRiskElementSelection"
              :category-type="'risk'"
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
  import DocumentTable from "../../../components/DocumentTable";

  export default {
    components: {
      TitleCaption,
      DocumentTable,
    },

    data: () => ({
      userRoleId: parseInt(cookies.get('roleID')),
      userDepartmentID: parseInt(cookies.get('userDepartmentID')),
      checkAdmin: cookies.get('checkAdmin'),
      roleUser: cookies.get('roleUser'),
      pageKeyDeviation: 'documents-reported-attachments-deviations',
      pageKeyChecklist: 'documents-reported-attachments-checklists',
      pageKeyRiskElement: 'documents-reported-attachments-risk-elements',
      // pageKeyAbsence: 'documents-attachments-absence',
      permissionsUser: localStorage.getItem('permissionsKey'),
      listArray: [],
      listChecklistAttachment: [],
      listRiskElementAttachment: [],
      type_document: 'report',
      // category
      categoriesDefault: {
        id: 0,
        name: "All"
      },
      categoriesDeviationArray: [],
      categoriesDeviationSelection: [],
      categoriesChecklistArray: [],
      categoriesChecklistSelection: [],
      categoriesRiskElementArray: [],
      categoriesRiskElementSelection: [],
    }),

    computed: {},

    watch: {},

    mounted() {
      let that = this;
      that.$nextTick(() => {
        that.$nuxt.$loading.start();
        //Get categories list
        that.$store.dispatch('categories/index').then(result => {
          // deviation category
          that.categoriesDeviationArray = _.filter(result.data, function (item) {
            return item.type === 'deviation';
          });
          that.categoriesDeviationSelection = _.clone(that.categoriesDeviationArray);
          that.categoriesDeviationSelection.push(that.categoriesDefault);
          that.categoriesDeviationSelection.sort(function (a, b) {
            return (a.id - b.id);
          });

          // checklist category
          that.categoriesChecklistArray = _.filter(result.data, function (item) {
            return item.type === 'checklist';
          });
          that.categoriesChecklistSelection = _.clone(that.categoriesChecklistArray);
          that.categoriesChecklistSelection.push(that.categoriesDefault);
          that.categoriesChecklistSelection.sort(function (a, b) {
            return (a.id - b.id);
          });

          // risk element source category
          that.categoriesRiskElementArray = _.filter(result.data, function (item) {
            return item.type === 'risk';
          });
          that.categoriesRiskElementSelection = _.clone(that.categoriesRiskElementArray);
          that.categoriesRiskElementSelection.push(that.categoriesDefault);
          that.categoriesRiskElementSelection.sort(function (a, b) {
            return (a.id - b.id);
          });
        }).catch(() => {
          // that.$toaster.error(that.$i18n.t('message.failed'));
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });

        // Get document list - type 'report'
        that.$store.dispatch('documents/index', {
          type: that.type_document
        }).then(result => {
          if (result.data.length > 0) {
            _.each(result.data, function (item) {
              if (item.description) {
                item.description = item.description.replace(/<[^>]+>/g, '');
              }
            });
          }
          // deviation
          that.listArray = _.filter(result.data, function (item) {
            return item.object_type === 'deviation';
          });

          // checklist
          that.listChecklistAttachment = _.filter(result.data, function (item) {
            return item.object_type === 'checklist';
          });

          // risk element source
          that.listRiskElementAttachment = _.filter(result.data, function (item) {
            return item.object_type === 'risk';
          });
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_document_view'));
          }
          that.$nuxt.$loading.finish();
          // that.$toaster.error(error.response.data.message || error.response.data.errors);
        });
      });
    },

    methods: {
      close() {
        this.reset();
      },

      reset() {
        setTimeout(() => {
          this.$refs.form.reset();
          this.$refs.form.resetValidation();
        }, 0);
      },
    },
  };
</script>

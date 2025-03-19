<template>
  <div v-if="checkAdmin || permissionsUser.indexOf('category-basic') !== -1" class="page-company-detail category-page">
<!--    <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyCategory" />-->
    <b-tabs v-model="tab_categories_type" card class="section-categories" lazy>
      <v-btn
        class="mb-2 btn-create btn-custom-green"
        @click="checkAddNew = true"
      >
        {{ $t('button.add_new') }}
      </v-btn>
      <keep-alive>
        <b-tab :title="$t('subTab.goals')" :active="!this.$route.query.type || this.$route.query.type === 'goal'">
<!--          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyCategoryGoal" />-->
          <v-container>
            <CategoryTable
              :list-array-input="listArray"
              :category-type="tab_categories_type"
              :category-id="categoryId"
              @reloadList="reloadList"
            />
          </v-container>
        </b-tab>
      </keep-alive>

      <keep-alive>
        <b-tab :title="$t('subTab.routines')" :active="this.$route.query.type === 'routine'">
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyCategoryRoutine" />
          <v-container>
            <CategoryTable
              :list-array-input="listArray"
              :category-type="tab_categories_type"
              :category-id="categoryId"
              @reloadList="reloadList"
            />
          </v-container>
        </b-tab>
      </keep-alive>

      <keep-alive>
        <b-tab :title="$t('subTab.instructions')" :active="this.$route.query.type === 'instruction'">
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyCategoryInstruction" />
          <v-container>
            <CategoryTable
              :list-array-input="listArray"
              :category-type="tab_categories_type"
              :category-id="categoryId"
              @reloadList="reloadList"
            />
          </v-container>
        </b-tab>
      </keep-alive>

      <keep-alive>
        <b-tab :title="$t('subTab.documents')" :active="this.$route.query.type === 'document'">
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyCategoryDocument" />
          <v-container>
            <CategoryTable
              :list-array-input="listArray"
              :category-type="tab_categories_type"
              :category-id="categoryId"
              @reloadList="reloadList"
            />
          </v-container>
        </b-tab>
      </keep-alive>

      <keep-alive>
        <b-tab :title="$t('subTab.contacts')" :active="this.$route.query.type === 'contact'">
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyCategoryContact" />
          <v-container>
            <CategoryTable
              :list-array-input="listArray"
              :category-type="tab_categories_type"
              :category-id="categoryId"
              @reloadList="reloadList"
            />
          </v-container>
        </b-tab>
      </keep-alive>

      <keep-alive>
        <b-tab :title="$t('subTab.attachments')" :active="this.$route.query.type === 'attachment'">
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyCategoryAttachment" />
          <v-container>
            <CategoryTable
              :list-array-input="listArray"
              :category-type="tab_categories_type"
              :category-id="categoryId"
              @reloadList="reloadList"
            />
          </v-container>
        </b-tab>
      </keep-alive>

      <keep-alive>
        <b-tab :title="$t('subTab.checklists')" :active="this.$route.query.type === 'checklist'">
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyCategoryChecklist" />
          <v-container>
            <CategoryTable
              :list-array-input="listArray"
              :category-type="tab_categories_type"
              :category-id="categoryId"
              @reloadList="reloadList"
            />
          </v-container>
        </b-tab>
      </keep-alive>

      <keep-alive>
        <b-tab :title="$t('subTab.deviations')" :active="this.$route.query.type === 'deviation'">
          <!--          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyCategoryGoal" />-->
          <v-container>
            <CategoryTable
              :list-array-input="listArray"
              :category-type="tab_categories_type"
              :category-id="categoryId"
              @reloadList="reloadList"
            />
          </v-container>
        </b-tab>
      </keep-alive>

      <keep-alive>
        <b-tab :title="$t('subTab.risk_elements')" :active="this.$route.query.type === 'risk'">
          <!--          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyCategoryGoal" />-->
          <v-container>
            <CategoryTable
              :list-array-input="listArray"
              :category-type="tab_categories_type"
              :category-id="categoryId"
              @reloadList="reloadList"
            />
          </v-container>
        </b-tab>
      </keep-alive>

      <keep-alive>
        <b-tab :title="$t('subTab.tasks')" :active="this.$route.query.type === 'task'">
          <!--          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyCategoryGoal" />-->
          <v-container>
            <CategoryTable
              :list-array-input="listArray"
              :category-type="tab_categories_type"
              :category-id="categoryId"
              @reloadList="reloadList"
            />
          </v-container>
        </b-tab>
      </keep-alive>

<!--      <keep-alive>-->
<!--        <b-tab :title="$t('tab.report_risk_analysis')" :active="this.$route.query.type === 'risk-analysis'">-->
<!--          &lt;!&ndash;          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyChecklist" />&ndash;&gt;-->
<!--          <v-container>-->
<!--            <CategoryTable-->
<!--              :list-array-input="listArray"-->
<!--              :category-type="tab_categories_type"-->
<!--              :category-id="categoryId"-->
<!--              @reloadList="reloadList"-->
<!--            />-->
<!--          </v-container>-->
<!--        </b-tab>-->
<!--      </keep-alive>-->
    </b-tabs>

    <CategoryPopup
      :open-popup="checkAddNew"
      :category-type="tab_categories_type"
      @closePopup="checkAddNew = !checkAddNew"
      @reloadList="reloadList"
    />
  </div>
</template>
<script>
import cookies from "js-cookie";
import TitleCaption from "../../../components/TitleCaption";
import {_} from "vue-underscore";
import CategoryTable from "../../../components/CategoryTable";
import CategoryPopup from "../../../components/CategoryPopup";

export default {
  components: {
    TitleCaption,
    CategoryTable,
    CategoryPopup,
  },

  data: () => ({
    userRoleId: parseInt(cookies.get('roleID')),
    userDepartmentID: parseInt(cookies.get('userDepartmentID')),
    checkAdmin: cookies.get('checkAdmin'),
    roleUser: cookies.get('roleUser'),
    permissionsUser: localStorage.getItem('permissionsKey'),
    pageKeyCategory: 'company-company-categories',
    pageKeyCategoryRoutine: 'company-company-categories-routines',
    pageKeyCategoryInstruction: 'company-company-categories-instructions',
    pageKeyCategoryDocument: 'company-company-categories-documents',
    pageKeyCategoryContact: 'company-company-categories-contacts',
    pageKeyCategoryAttachment: 'company-company-categories-attachments',
    pageKeyCategoryChecklist: 'company-company-categories-checklists',
    search: '',
    valid: true,
    checkAddNew: false,
    tab_categories_type: 0, // tab Categories - Category type
    tab_categories_added_from: 0, // tab Categories - Category added from
    listArray: [],
    categoryId: '',
  }),

  computed: {},

  watch: {},

  created() {
    if (this.$route.query.id) {
      this.categoryId = this.$route.query.id;
    }
  },

  mounted() {
    let that = this;
    // that.categoryId = that.$route.query.id;

    that.$nextTick(() => {
      that.$nuxt.$loading.start();
      // tab Categories list categories
      that.$store.dispatch('categoriesV2/index').then(result => {
        if (result.data) {
          that.listArray = _.filter(result.data, function (item) {
            return !item.disable_status;
          });
        }
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
    });
  },

  methods: {
    reloadList() {
      let that = this;
      // get list
      that.$store.dispatch('categoriesV2/index').then(result => {
        if (result.data) {
          that.listArray = _.filter(result.data, function (item) {
            return !item.disable_status;
          });
        }
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
  }

};
</script>

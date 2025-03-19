<template>
  <div class="page-settings-companies category-page">
    <v-btn
      class="mb-2 btn-create btn-custom-green"
      @click="checkAddNew = true"
    >
      {{ $t('button.add_new') }}
    </v-btn>

    <b-tabs v-model="tab_categories_type" card lazy>
      <keep-alive>
        <b-tab :title="$t('tab.goals')" active>
<!--          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyRoutine" />-->
          <v-container>
            <CategoryTable
              :list-array-input="listArray"
              :category-type="tab_categories_type"
              :category-id="categoryId"
              :industry-array="industriesArray"
              @reloadList="reloadList"
            />
          </v-container>
        </b-tab>
      </keep-alive>

      <keep-alive>
        <b-tab :title="$t('tab.routines')">
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyRoutine" />
          <v-container>
            <CategoryTable
              :list-array-input="listArray"
              :category-type="tab_categories_type"
              :category-id="categoryId"
              :industry-array="industriesArray"
              @reloadList="reloadList"
            />
          </v-container>
        </b-tab>
      </keep-alive>

      <keep-alive>
        <b-tab :title="$t('tab.instructions')">
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyInstruction" />
          <v-container>
            <CategoryTable
              :list-array-input="listArray"
              :category-type="tab_categories_type"
              :category-id="categoryId"
              :industry-array="industriesArray"
              @reloadList="reloadList"
            />
          </v-container>
        </b-tab>
      </keep-alive>

      <keep-alive>
        <b-tab :title="$t('tab.documents')">
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyDocument" />
          <v-container>
            <CategoryTable
              :list-array-input="listArray"
              :category-type="tab_categories_type"
              :category-id="categoryId"
              :industry-array="industriesArray"
              @reloadList="reloadList"
            />
          </v-container>
        </b-tab>
      </keep-alive>

      <keep-alive>
        <b-tab :title="$t('tab.contacts')">
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyContact" />
          <v-container>
            <CategoryTable
              :list-array-input="listArray"
              :category-type="tab_categories_type"
              :category-id="categoryId"
              :industry-array="industriesArray"
              @reloadList="reloadList"
            />
          </v-container>
        </b-tab>
      </keep-alive>

      <keep-alive>
        <b-tab :title="$t('tab.attachments')">
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyAttachment" />
          <v-container>
            <CategoryTable
              :list-array-input="listArray"
              :category-type="tab_categories_type"
              :category-id="categoryId"
              :industry-array="industriesArray"
              @reloadList="reloadList"
            />
          </v-container>
        </b-tab>
      </keep-alive>

      <keep-alive>
        <b-tab :title="$t('tab.checklists')">
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyChecklist" />
          <v-container>
            <CategoryTable
              :list-array-input="listArray"
              :category-type="tab_categories_type"
              :category-id="categoryId"
              :industry-array="industriesArray"
              @reloadList="reloadList"
            />
          </v-container>
        </b-tab>
      </keep-alive>

      <keep-alive>
        <b-tab :title="$t('tab.deviations')">
<!--          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyChecklist" />-->
          <v-container>
            <CategoryTable
              :list-array-input="listArray"
              :category-type="tab_categories_type"
              :category-id="categoryId"
              :industry-array="industriesArray"
              @reloadList="reloadList"
            />
          </v-container>
        </b-tab>
      </keep-alive>

      <keep-alive>
        <b-tab :title="$t('tab.risk_elements')">
<!--          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyChecklist" />-->
          <v-container>
            <CategoryTable
              :list-array-input="listArray"
              :category-type="tab_categories_type"
              :category-id="categoryId"
              :industry-array="industriesArray"
              @reloadList="reloadList"
            />
          </v-container>
        </b-tab>
      </keep-alive>

      <keep-alive>
        <b-tab :title="$t('tab.tasks')">
          <!--          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyChecklist" />-->
          <v-container>
            <CategoryTable
              :list-array-input="listArray"
              :category-type="tab_categories_type"
              :category-id="categoryId"
              :industry-array="industriesArray"
              @reloadList="reloadList"
            />
          </v-container>
        </b-tab>
      </keep-alive>

<!--      <keep-alive>-->
<!--        <b-tab :title="$t('tab.report_risk_analysis')">-->
<!--          &lt;!&ndash;          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyChecklist" />&ndash;&gt;-->
<!--          <v-container>-->
<!--            <CategoryTable-->
<!--              :list-array-input="listArray"-->
<!--              :category-type="tab_categories_type"-->
<!--              :category-id="categoryId"-->
<!--              :industry-array="industriesArray"-->
<!--              @reloadList="reloadList"-->
<!--            />-->
<!--          </v-container>-->
<!--        </b-tab>-->
<!--      </keep-alive>-->
    </b-tabs>

    <CategoryPopup
      :open-popup="checkAddNew"
      :category-type="tab_categories_type"
      :industry-array="industriesArray"
      @closePopup="checkAddNew = !checkAddNew"
      @reloadList="reloadList"
    />

<!--    <v-dialog v-model="dialog" max-width="500px" persistent>-->
<!--      <v-card>-->
<!--        <v-card-text>-->
<!--          <div class="title-model">-->
<!--            {{ formTitle }}-->
<!--          </div>-->
<!--          <v-form-->
<!--            ref="form"-->
<!--            v-model="valid"-->
<!--            lazy-validation-->
<!--          >-->
<!--            <b-row align-h="center">-->
<!--              <b-col cols="12">-->
<!--                <div class="input-wrap">-->
<!--                  <v-text-field v-model="editedItem.name" :label="$t('form.name')" :rules="required" outlined />-->
<!--                </div>-->
<!--              </b-col>-->
<!--            </b-row>-->
<!--            <b-row>-->
<!--              <b-col cols="12">-->
<!--                <div class="input-wrap industry-select-input-wrap">-->
<!--                  <MultipleSelection-->
<!--                    :selected-items-input="editedItem.industry_id_arr"-->
<!--                    :label="$t('form.industry')"-->
<!--                    :item-text="'name'"-->
<!--                    :item-value="'id'"-->
<!--                    :list-option-input="industryArray"-->
<!--                    :request-required="true"-->
<!--                    @getSelectedItems="getSelectedIndustryItems"-->
<!--                  />-->
<!--                </div>-->
<!--              </b-col>-->
<!--            </b-row>-->
<!--            <b-row v-if="tab_categories_type === 5">-->
<!--              <b-col cols="12">-->
<!--                <div class="input-wrap">-->
<!--                  <v-select-->
<!--                    v-model="editedItem.added_from"-->
<!--                    :items="attachmentSelectAddedFromArray"-->
<!--                    item-text="name"-->
<!--                    item-value="id"-->
<!--                    label="From"-->
<!--                    :rules="required"-->
<!--                    outlined-->
<!--                  />-->
<!--                </div>-->
<!--              </b-col>-->
<!--            </b-row>-->
<!--            <b-row>-->
<!--              <b-col>-->
<!--                <div>-->
<!--                  <v-checkbox v-model="editedItem.is_primary" label="Is default category?" />-->
<!--                </div>-->
<!--              </b-col>-->
<!--            </b-row>-->
<!--          </v-form>-->
<!--        </v-card-text>-->
<!--        <v-card-actions>-->
<!--          <v-spacer />-->
<!--          <v-alert-->
<!--            v-if="editedIndex > -1 && editedItem.disable_status"-->
<!--            dense-->
<!--            outlined-->
<!--            type="warning"-->
<!--            class="mb-0 mr-3"-->
<!--          >-->
<!--            This category has been disabled-->
<!--          </v-alert>-->
<!--          <v-btn class="btn-cancel" text @click="close">-->
<!--            {{ $t('button.cancel') }}-->
<!--          </v-btn>-->
<!--          <v-btn class="btn-save" @click="save">-->
<!--            {{ $t('button.save') }}-->
<!--          </v-btn>-->
<!--          <v-btn-->
<!--            v-if="editedIndex > -1 && !editedItem.disable_status"-->
<!--            class="hse-btn-delete"-->
<!--            text-->
<!--            @click="deleteCategory"-->
<!--          >-->
<!--            <v-icon dark>-->
<!--              mdi-delete-->
<!--            </v-icon>-->
<!--          </v-btn>-->
<!--        </v-card-actions>-->
<!--      </v-card>-->
<!--    </v-dialog>-->

<!--    &lt;!&ndash; Disable &ndash;&gt;-->
<!--    <v-dialog v-model="dialogDelete" max-width="500px">-->
<!--      <v-card class="dialog-delete">-->
<!--        <v-card-text>-->
<!--          <div class="text-center confirm-delete-title">-->
<!--            Confirm disable-->
<!--          </div>-->
<!--          <div class="confirm-delete-text">-->
<!--            <span>-->
<!--              Are you sure you want to disable this item?-->
<!--            </span>-->
<!--          </div>-->
<!--        </v-card-text>-->
<!--        <v-card-actions>-->
<!--          <v-spacer />-->
<!--          <v-btn class="btn-cancel" text @click="dialogDelete = false">-->
<!--            {{ $t('button.no') }}-->
<!--          </v-btn>-->
<!--          <v-btn class="btn-save" @click="deleteItem">-->
<!--            {{ $t('button.yes') }}-->
<!--          </v-btn>-->
<!--        </v-card-actions>-->
<!--      </v-card>-->
<!--    </v-dialog>-->
  </div>
</template>
<script>
  import cookies from 'js-cookie';
  import {_} from 'vue-underscore';
  import TitleCaption from "../../../../components/TitleCaption";
  // import MultipleSelection from "../../../../components/MultipleSelection";
  import CategoryTable from "../../../../components/CategoryTable";
  import CategoryPopup from "../../../../components/CategoryPopup";

  export default {
    components: {
      TitleCaption,
      // MultipleSelection,
      CategoryTable,
      CategoryPopup,
    },

    data: () => ({
      userRoleId: parseInt(cookies.get('roleID')),
      // userDepartmentID: parseInt(cookies.get('userDepartmentID')),
      roleUser: cookies.get('roleUser'),
      pageKeyRoutine: 'settings-categories-routines',
      pageKeyInstruction: 'settings-categories-instructions',
      pageKeyDocument: 'settings-categories-documents',
      pageKeyContact: 'settings-categories-contacts',
      pageKeyAttachment: 'settings-categories-attachments',
      pageKeyChecklist: 'settings-categories-checklists',
      search: '',
      valid: true,
      checkAddNew: false,
      tab_categories_type: 0, // tab Categories - Category type
      tab_categories_added_from: 0, // tab Categories - Category added from
      listArray: [],
      industriesArray: [],
      categoryId: "",
    }),

    computed: {},

    watch: {
      dialog(val) {
        val || this.close();
      },
    },

    created() {
      if (this.$route.query.id) {
        this.categoryId = this.$route.query.id;
      }
    },

    mounted() {
      let that = this;
      that.$nextTick(() => {
        that.$nuxt.$loading.start();
        
        // list categories
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

        // list industries
        that.$store.dispatch('industries/index').then(result => {
          that.industriesArray = result.data;
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }
          // that.$toaster.error(that.$i18n.t('message.fail_industry_view'));
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });

        
      });
    },

    methods: {
      reloadList() {
        let that = this;
        // get list
        that.$store.dispatch('categories/index').then(result => {
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
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage);
          that.$nuxt.$loading.finish();
        });
      },
    },
  };
</script>

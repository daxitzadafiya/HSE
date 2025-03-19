<template>
  <div class="resources-page">
    <v-btn class="mb-2 btn-create btn-custom-green" @click="checkAddNew = true">
      {{ $t('button.add_new') }}
    </v-btn>

    <b-tabs card>
      <b-tab :title="$t('tab.users')" active>
        <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKey" />
        <v-container>
          <!-- Add new -->
          <UserPopup
            :open-popup="checkAddNew"
            @closePopup="checkAddNew = !checkAddNew"
            @reloadList="reloadList"
          />

          <!-- Table -->
          <v-data-table
            :headers="headers"
            :items="filteredItems"
            class="elevation-1 hse-table table-data"
            :items-per-page="15"
            :single-expand="true"
            :search="search"
            :sort-by="['created_at']"
            :sort-desc="[true, false]"
            @click:row="editItem"
          >
            <template v-slot:top>
              <div class="setting-header">
                <div class="panel-heading">
                  <h4 class="panel-title">
                    {{ $t('title.sort_by') }}
                  </h4>
                  <b-row>
                    <b-col cols="6">
                      <div class="field-selection">
                        <v-select
                          v-model="company"
                          item-text="name"
                          item-value="id"
                          :items="companyArray"
                          :label="$t('setting.company')"
                          outlined
                          class="text-box"
                        />
                      </div>
                    </b-col>
                    <b-col cols="6">
                      <div class="field-selection field-search">
                        <v-text-field
                          v-model="search"
                          append-icon="search"
                          :label="$t('setting.search')"
                          outlined
                          class="text-box"
                        >
                    <template v-slot:append>
                      <img src="@/assets/images/icon/magnifier.png" class="search-icon-cust">
                    </template>
                  </v-text-field> 
                      </div>
                    </b-col>
                  </b-row>
                </div>
                <div class="panel-footer text-right">
                  <!--                  <a type="button" class="btn btn-default" @click="addNewGoal"> New goal</a>-->
                </div>
              </div>
            </template>

            <template v-slot:header="{ props: { headers } }">
              <h4 class="table-name">
                {{ $t('table.users') }}
              </h4>
            </template>
            <template v-slot:no-data>
              {{ $t('table.no_data') }}
            </template>
          </v-data-table>

          <!-- View detail -->
          <UserPopup
            :open-popup="checkViewDetail"
            :company-array="companyArray"
            :user-item="editedItem"
            @closePopup="checkViewDetail = !checkViewDetail"
            @reloadList="reloadList"
          />
        </v-container>
      </b-tab>
    </b-tabs>
  </div>
</template>
<script>
  import {_} from 'vue-underscore';
  import cookies from 'js-cookie';
  import TitleCaption from "../../../../components/TitleCaption";
  import UserPopup from "../../../../components/UserPopup";

  export default {
    components: {
      TitleCaption,
      UserPopup,
    },

    data: () => ({
      userRoleId: parseInt(cookies.get('roleID')),
      // userDepartmentID: parseInt(cookies.get('userDepartmentID')),
      // checkAdmin: cookies.get('checkAdmin'),
      // roleUser: cookies.get('roleUser'),
      pageKey: 'overview-users-users',
      checkAddNew: false,
      checkViewDetail: false,
      search: '',
      companyArray: [],
      listArray: [],
      editedItem: {
        company_id: "",
        first_name: "",
        last_name: "",
        role_id: "",
        email: "",
        address: "",
        city: "",
        phone_number: "",
        personal_number: "",
        avatar: "",
        zip_code: "",
        status: "pending",
      },
      company: 0,
      companiesDefault: {
        id: 0,
        name: "All"
      },
    }),

    computed: {
      headers() {
        return [
          {text: this.translateCol('first_name'), align: 'left', value: 'first_name'},
          {text: this.translateCol('last_name'), align: 'center', value: 'last_name'},
          {text: this.translateCol('company'), align: 'center', value: 'company_name'},
          {text: this.translateCol('email'), align: 'center', value: 'email'},
        ];
      },
      filteredItems() {
        let that = this;
        return that.listArray.filter((item) => {
          return that.company === 0 || (item.company_id === that.company);
        });
      },
    },

    watch: {},

    mounted() {
      let that = this;
      that.$nextTick(() => {
        that.$nuxt.$loading.start();
        // get all active companies
        that.$store.dispatch('companies/index').then(result => {
          that.companyArray = _.clone(result.data);
          that.companyArray.push(that.companiesDefault);
          that.companyArray.sort(function (a, b) {
            return (a.id - b.id);
          });
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          // that.$toaster.error(that.$i18n.t('message.failed'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });

        //Get user list
        that.$store.dispatch('users/index').then(result => {
          that.listArray = result.data;
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_user_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      });
    },

    methods: {
      translateCol (colName) {
        return this.$i18n.t('column.' + colName);
      },

      editItem(item) {
        this.editedItem = Object.assign({}, item);
        this.checkViewDetail = true;
      },

      reloadList() {
        let that = this;
        // get list
        that.$store.dispatch('users/index').then(result => {
          that.listArray = result.data;
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_user_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      },
    },
  };
</script>

<template>
    <div class="resources-page">
      <v-btn class="mb-2 btn-create btn-custom-green" @click="checkAddNew = true">
        {{ $t('button.add_new') }}
      </v-btn>
  
      <b-tabs card>
        <b-tab :title="$t('tab.customerServices')" active>
          <v-container>
            <!-- Add new -->
            <CustomerServicsePopup
              :open-popup="checkAddNew"
              @closePopup="checkAddNew = !checkAddNew"
              @reloadList="reloadList"
            />
  
            <!-- Table -->
            <v-data-table
              :headers="headers"
              :items="listArray"
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
                      <b-col cols="12">
                        <div class="field-selection field-search">
                          <v-text-field
                            v-model="search"
                            append-icon="search"
                            :label="$t('setting.search')"
                            outlined
                            class="text-box" >
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
                  {{ $t('table.customerServices') }}
                </h4>
              </template>
                <template v-slot:item.status="{ item }">
                  <b-badge  :variant="item.status == 'active' ? 'info' : 'danger'">{{ item.status }}</b-badge>
                </template>
              <template v-slot:no-data>
                {{ $t('table.no_data') }}
              </template>
            </v-data-table>
  
            <!-- View detail -->
            <CustomerServicsePopup
              :open-popup="checkViewDetail"
              :edit-id="editId"
              @closePopup="checkViewDetail = !checkViewDetail"
              @reloadList="reloadList"
            />
          </v-container>
        </b-tab>
      </b-tabs>
    </div>
  </template>
  <script>
    import cookies from 'js-cookie';
    import CustomerServicsePopup from "../../../../components/CustomerServicsePopup.vue";
  
    export default {
      components: {
        CustomerServicsePopup,
      },
  
      data: () => ({
        userRoleId: parseInt(cookies.get('roleID')),
        // checkAdmin: cookies.get('checkAdmin'),
        // roleUser: cookies.get('roleUser'),
        pageKey: 'overview-users-users',
        checkAddNew: false,
        checkViewDetail: false,
        search: '',
        listArray: [],
        editId: '',
      }),
  
      computed: {
        headers() {
          return [
            {text: this.translateCol('first_name'), align: 'left', value: 'first_name'},
            {text: this.translateCol('last_name'), align: 'center', value: 'last_name'},
            {text: this.translateCol('email'), align: 'center', value: 'email'},
            {text: this.translateCol('status'), align: 'center', value: 'status'},
          ];
        },
      },
  
      watch: {},

      created() {
        if (this.$route.query.id) {
        this.editId = this.$route.query.id;
        this.checkViewDetail = true;
        }
      },
  
      mounted() {
        let that = this;
        that.$nextTick(() => {
          this.reloadList();
        });
      },
  
      methods: {
        translateCol (colName) {
          return this.$i18n.t('column.' + colName);
        },
  
        editItem(item) {
          this.editId = item.id;
          this.checkViewDetail = true;
        },
  
        reloadList() {
          let that = this;
          that.$nuxt.$loading.start();
          that.$store.dispatch('customerServices/index').then(result => {
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
  
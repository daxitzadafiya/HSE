<template>
    <div class="resources-page">
      <v-btn class="mb-2 btn-create btn-custom-green" @click="checkAddNew = true">
        {{ $t('button.add_new') }}
      </v-btn>
  
      <b-tabs card>
        <b-tab :title="$t('tab.invites')" active>
          <v-container>
            <!-- Add new -->
            <InvitePopup
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
            >

              <template v-slot:item.company_name="{ item }">
                                  {{ item.company ? item.company?.name : null }}
              </template>

              <template v-slot:item.status="{ item }">
                <b-badge v-if="item.status"
                                :variant="item.status == 2 ? 'info' : 'danger'">{{ getStatus(item.status) }}</b-badge>
                                  
              </template>
              <template v-slot:item.actions="{ item }">
                   <div class="d-flex" style="justify-content: center;">
                         <v-icon small title="Edit" @click="editItem(item)"> edit </v-icon>
                         <v-icon small title="Resend" @click="resendInvitation(item)" v-if="item?.status !== 2"> resend </v-icon>
                    </div>
              </template>

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
                  </div>
                </div>
              </template>
  
              <template v-slot:header="{ props: { headers } }">
                <h4 class="table-name">
                  {{ $t('table.invites') }}
                </h4>
              </template>
              <template v-slot:no-data>
                {{ $t('table.no_data') }}
              </template>
            </v-data-table>
  
            <!-- View detail -->
            <InvitePopup
              :open-popup="checkViewDetail"
              :company-array="companyArray"
              :edit-id="editId"
              @closePopup="checkViewDetail = !checkViewDetail"
              @reloadList="reloadList"
            />
          </v-container>
        </b-tab>
      </b-tabs>

      <v-dialog v-model="resendEmail" max-width="500px" persistent>
        <v-card>
            <div class="d-flex align-items-center flex-column py-8">
                <div class="d-flex flex-column align-items-center">
                    <v-card-title class="text-center">{{$t('form.resend_invitation')}}</v-card-title>
                    <v-card-text class="text-center">{{$t('form.really_want_to_resend_invitation')}}.</v-card-text>
                </div>
                <div class="flex justify-content-between">
                    <v-spacer />
                    <v-btn class="btn-cancel" text @click="resendEmail = false">
                        {{ $t('button.cancel') }}
                    </v-btn>
                    <v-btn class="btn-save" @click="handleResendInvitation">
                        {{ $t('button.send') }}
                    </v-btn>
                </div>
            </div>
        </v-card>
    </v-dialog>

    </div>
  </template>
  <script>
    import {_} from 'vue-underscore';
    import InvitePopup from "../../../../components/InvitePopup.vue";
  
    export default {
      components: {
        InvitePopup,
      },
  
      data: () => ({
        checkAddNew: false,
        checkViewDetail: false,
        search: '',
        companyArray: [],
        listArray: [],
        currentInvitedId: null,
        resendEmail: false,
        editId: '',
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
            {text: this.translateCol('status'), align: 'center', value: 'status'},
            {text: this.translateCol('actions'), align: 'center', value: 'actions', sortable: false},
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

      created() {
        if (this.$route.query.id) {
        this.editId = this.$route.query.id;
        this.checkViewDetail = true;
        }
      },
  
      mounted() {
        let that = this;
        that.$nextTick(() => {
          that.reloadList();
          that.reloadListCompany();
        });
      },
  
      methods: {
        translateCol (colName) {
          return this.$i18n.t('column.' + colName);
        },

        getStatus(status) {
            switch (status) {
                case 1:
                    return 'Pending';
                case 2:
                    return 'Accepted';
                case 3:
                    return 'Rejected';
                default:
                    return 'Not found plan';
            }
        },

        resendInvitation(invite) {
            this.resendEmail = true;
            this.currentInvitedId = invite.id
        },

        handleResendInvitation() {
            let that = this;
            that.$nuxt.$loading.start();
            that.$store.dispatch('invites/resendInvitation', this.currentInvitedId).then(() => {
                that.$toaster.success(this.$i18n.t('message.send_email_successfully'));
                that.resendEmail = false;
                that.currentInvitedId = null;
                that.reloadList();
                that.$nuxt.$loading.finish();
            });
        },
  
        editItem(item) {
          this.editId = item.id;
          this.checkViewDetail = true;
        },
        reloadListCompany(){
          let that = this;
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
                that.$router.push('/login');
                that.$toaster.error(that.$i18n.t('message.token_expired'));
            }else{
            // that.$toaster.error(that.$i18n.t('message.failed'));
            }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish();
          });

        },
  
        reloadList() {
          let that = this;
          // get list
          that.$store.dispatch('invites/index').then(result => {
            that.listArray = result.data;
            that.$nuxt.$loading.finish();
          }).catch((error) => {
              if (error.response.status == 401) {
                that.$router.push('/login');
                that.$toaster.error(that.$i18n.t('message.token_expired'));
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
  
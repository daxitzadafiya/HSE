<template>
<div class="page-settings-companies">
    <v-btn v-if="tabIndex === 0" class="mb-2 btn-create btn-custom-green" @click="checkAddNew = true">
        {{ $t('button.add_new') }}
    </v-btn>
    <v-btn v-else class="mb-2 btn-create btn-custom-green" @click="generateReport">
        {{ $t('button.generate_invoice') }}
    </v-btn>

    <b-tabs v-model="tabIndex" card lazy>
        <keep-alive>
            <b-tab :title="$t('tab.companies')" active>
                <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKey" />
                <v-container>
                    <!-- Add new -->
                    <CompanyPopup :open-popup="checkAddNew" :industry-array="industriesArray" @closePopup="checkAddNew = !checkAddNew" @reloadList="reloadList" />

                    <!-- Table -->
                    <v-data-table :headers="headers" :items="filteredItems" class="elevation-1 hse-table table-data" :items-per-page="15" :single-expand="true" :search="search" :sort-by="['created_at']" :sort-desc="[true, false]" @click:row="editItem">
                        <template v-slot:top>
                            <div class="setting-header">
                                <div class="panel-heading">
                                    <h4 class="panel-title">
                                        {{ $t('title.sort_by') }}
                                    </h4>
                                    <b-row>
                                        <b-col cols="6">
                                            <div class="field-selection">
                                                <v-select v-model="industry" :label="$t('setting.industry')" item-text="name" item-value="id" :items="industriesSelection" outlined class="text-box" />
                                            </div>
                                        </b-col>
                                        <b-col cols="6">
                                            <div class="field-selection field-search">
                                                <v-text-field v-model="search" append-icon="search" :label="$t('setting.search')" outlined class="text-box" >
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
                                {{ $t('table.companies') }}
                            </h4>
                        </template>
                        <template v-slot:item.current_plan="{ item }">
                            {{ item.plan_active ? item.plan_active?.plan_detail?.title : "--"}}
                        </template>

                        <template v-slot:no-data>
                            {{ $t('table.no_data') }}
                        </template>
                    </v-data-table>

                    <!-- View detail -->
                    <CompanyPopup :open-popup="checkViewDetail" :industry-array="industriesArray" :company-item="editedItem" @closePopup="checkViewDetail = !checkViewDetail" @reloadList="reloadList" />
                </v-container>
            </b-tab>
        </keep-alive>

        <keep-alive>
            <b-tab :title="$t('tab.invoice')" @click="invoiceListing">
                <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKey" />
                <v-container>
                    <!-- Table -->
                    <v-data-table :headers="headersBilling" :items="filteredBillingItems" class="elevation-1 hse-table" :items-per-page="15" :single-expand="true" :search="search" :sort-by="['created_at']" :sort-desc="[true, false]">
                        <template v-slot:top>
                            <div class="setting-header">
                                <div class="panel-heading">
                                    <h4 class="panel-title">
                                        {{ $t('title.sort_by') }}
                                    </h4>
                                    <b-row>
                                        <b-col cols="6">
                                            <div class="field-selection">
                                                <v-select v-model="company" :label="$t('setting.company')" item-text="name" item-value="id" :items="companiesSelection" outlined />
                                            </div>
                                        </b-col>
                                        <b-col cols="6">
                                            <div class="field-selection field-search">
                                                <v-text-field v-model="search" append-icon="search" :label="$t('setting.search')" outlined >
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
                                {{ $t('table.reports') }}
                            </h4>
                        </template>
                        <template v-slot:item.name="{ item }">
                            {{ item.name }}
                        </template>
                        <template v-slot:item.type="{ item }">
                            {{ item.billing_detail?.plan_id ? 'Plan' : 'Addon' }}
                        </template>
                        <template v-slot:item.subscription_name="{ item }">
                            {{ item.billing_detail?.plan_id ? item.billing_detail?.billing?.subscription?.plan_detail?.title : item.billing_detail?.billing?.subscription?.addon_detail?.title }}
                        </template>
                        <template v-slot:item.amount="{ item }">
                           Kr {{ item.billing_detail?.amount }}
                        </template>
                        <template v-slot:item.status="{ item }">

                            <b-badge v-if="item.billing_detail" @click="handleStatus(item.billing_detail)" :variant="item.billing_detail?.status == 0 ? 'danger' :'info' ">{{getStatus(item.billing_detail?.status)}}</b-badge>
                        </template>
                        <template v-slot:item.storage_upload="{ item }">
                            {{ item.storage_upload }} (KB)
                        </template>
                        <template v-slot:item.storage_repo="{ item }">
                            {{ item.storage_repo }} (KB)
                        </template>
                        <template v-slot:item.created_at="{ item }">
                            {{ moment(item.created_at).format('DD.MM.YYYY') }}
                        </template>
                        <template v-slot:item.actions="{ item }">
                            <div class="d-flex" style="justify-content: center;">
                                <v-icon small class="mr-2" @click="sendEmails(item)" v-if="item.billing_detail?.status == 0">
                                    mdi-email
                                </v-icon>
                                <!-- <v-icon small class="mr-2" @click="action(item, 'view')">
                                    mdi-file-pdf
                                </v-icon> -->
                                <v-icon small @click="action(item, 'download')" v-if="item?.billing_detail?.fiken_invoice_id">
                                    mdi-download
                                </v-icon>
                            </div>
                        </template>
                        <template v-slot:no-data>
                            {{ $t('table.no_data') }}
                        </template>
                    </v-data-table>
                </v-container>
            </b-tab>
        </keep-alive>
    </b-tabs>

    <v-dialog v-model="dialogGenerateReport" max-width="800px" persistent>
        <v-card>
            <v-card-text>
                <div class="popup-header text-center">
                    {{ $t('title.generate_invoice_report') }}
                </div>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <b-row>
                        <b-col cols="12">
                            <div class="input-wrap industry-select-input-wrap">
                                <MultipleSelection :label="$t('form.company')" :item-text="'name'" :item-value="'id'" :list-option-input="listArray" :request-required="true" @getSelectedItems="getSelectedCompany" />
                            </div>
                        </b-col>
                    </b-row>
                </v-form>
            </v-card-text>
            <v-card-actions class="popup-footer">
                <v-spacer />
                <v-btn class="btn-cancel" text @click="dialogGenerateReport = false">
                    {{ $t('button.cancel') }}
                </v-btn>
                <v-btn class="btn-save" @click="save">
                    {{ $t('button.save') }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="changeStatus" max-width="500px" persistent>
        <v-card>
            <div class="d-flex align-items-center flex-column py-8">
                <div class="d-flex flex-column align-items-center">
                    <v-card-title class="text-center">{{$t('form.change_status')}}</v-card-title>
                    <v-card-text class="text-center">{{$t('form.really_want_to_change_status')}}.</v-card-text>
                </div>
                <div class="flex justify-content-between">
                    <v-spacer />
                    <v-btn class="btn-cancel" text @click="changeStatus = false">
                        {{ $t('button.cancel') }}
                    </v-btn>
                    <v-btn class="btn-save" @click="handleSaveStatus">
                        {{ $t('button.mark_as_paid') }}
                    </v-btn>
                </div>
            </div>
        </v-card>
    </v-dialog>

    <v-dialog v-model="sendEmail" max-width="500px" persistent>
        <v-card>
            <div class="d-flex align-items-center flex-column py-8">
                <div class="d-flex flex-column align-items-center">
                    <v-card-title class="text-center">{{$t('form.send_email')}}</v-card-title>
                    <v-card-text class="text-center">{{$t('form.really_want_to_send_email')}}.</v-card-text>
                </div>
                <div class="flex justify-content-between">
                    <v-spacer />
                    <v-btn class="btn-cancel" text @click="sendEmail = false">
                        {{ $t('button.cancel') }}
                    </v-btn>
                    <v-btn class="btn-save" @click="handleSendEmail">
                        {{ $t('button.send') }}
                    </v-btn>
                </div>
            </div>
        </v-card>
    </v-dialog>
</div>
</template>

<script>
import {
    _
} from 'vue-underscore';
import cookies from 'js-cookie';
import TitleCaption from "../../../../components/TitleCaption";
import CompanyPopup from "../../../../components/CompanyPopup";
// import {
//     jsPDF
// } from "jspdf";
import MultipleSelection from "../../../../components/MultipleSelection";

export default {
    components: {
        TitleCaption,
        CompanyPopup,
        MultipleSelection
    },

    data: () => ({
        userRoleId: parseInt(cookies.get('roleID')),
        // userDepartmentID: parseInt(cookies.get('userDepartmentID')),
        // checkAdmin: cookies.get('checkAdmin'),
        // roleUser: cookies.get('roleUser'),
        pageKey: 'overview-companies-companies',
        is_freeze: null,
        subscription_deactivated_at: null,
        changeStatus: false,
        currentBillingId: null,
        sendEmail: false,
        currentCompanyId: null,
        tabIndex: 0,
        valid: true,
        checkAddNew: false,
        checkViewDetail: false,
        search: '',
        industry: 0,
        company: 0,
        fiken_invoice_id:'',
        industriesArray: [],
        industriesSelection: [],
        industriesDefault: {
            id: 0,
            name: "All"
        },
        companiesSelection: [],
        companyDefault: {
            id: 0,
            name: "All"
        },
        listArray: [],
        listBillingArray: [],
        editedItem: {
            name: "",
            phone_number: "",
            vat_number: "",
            email: "",
            website: "",
            industry_id: "",
            address: "",
            city: "",
            country: "",
            zip_code: "",
            logo: "",
            active_since: "",
            established_date: "",
            ceo: "",
            hse_manager: "",
            safety_manager: "",
            status: "",
            type: "",
            is_freeze: "",
            subscription_deactivated_at:""

        },
        dialogGenerateReport: false,
        reportItem: {
            companyArray: [],
        },
        reportDefault: {
            companyArray: [],
        },
    }),

    computed: {
        headers() {
            return [{
                    text: this.translateCol('company'),
                    value: 'name',
                    align: 'left'
                },
                {
                    text: this.translateCol('industry'),
                    value: 'industry_name',
                    align: 'center'
                },
                {
                    text: this.translateCol('vat'),
                    value: 'vat_number',
                    sortable: false,
                    align: 'center'
                },
                {
                    text: this.translateCol('address'),
                    value: 'address',
                    sortable: false,
                    align: 'center'
                },
                {
                    text: this.translateCol('current_plan'),
                    value: 'current_plan',
                    sortable: false,
                    align: 'center'
                },
                {
                    text: this.translateCol('count_employees'),
                    value: 'count_employees',
                    sortable: false,
                    align: 'center'
                },
            ];
        },

        headersBilling() {
            return [{
                    text: this.translateCol('id'),
                    value: 'name',
                    align: 'center'
                },
                {
                    text: this.translateCol('company'),
                    value: 'company_name',
                    align: 'left'
                },
                {
                    text: this.translateCol('subscription'),
                    value: 'subscription_name',
                    sortable: false,
                    align: 'left'
                },
                {
                    text: this.translateCol('amount'),
                    value: 'amount',
                    sortable: false,
                    align: 'left'
                },
                {
                    text: this.translateCol('storage_upload'),
                    value: 'storage_upload',
                    align: 'center'
                },
                {
                    text: this.translateCol('storage_repo'),
                    value: 'storage_repo',
                    align: 'center'
                },
                {
                    text: this.translateCol('employees'),
                    value: 'employee',
                    align: 'center'
                },
                {
                    text: this.translateCol('created_at'),
                    value: 'created_at',
                    align: 'center'
                },
                {
                    text: this.translateCol('type'),
                    value: 'type',
                    align: 'center'
                },
                {
                    text: this.translateCol('status'),
                    value: 'status',
                    align: 'center'
                },
                {
                    text: this.translateCol('actions'),
                    value: 'actions',
                    sortable: false,
                    align: 'center'
                },
            ];
        },

        filteredItems() {
            return this.listArray.filter((item) => {
                return this.industry === 0 || (this.industry === item.industry_id);
            });
        },

        filteredBillingItems() {
            return this.listBillingArray.filter((item) => {
                return this.company === 0 || (this.company === item.company_id);
            });
        },
    },

    watch: {},

    mounted() {
      let that = this;
      that.$nextTick(() => {
        that.$nuxt.$loading.start();
        // list categories
        that.$store.dispatch('industries/index').then(result => {
          that.industriesArray = result.data;
          that.industriesSelection = _.clone(result.data);
          that.industriesSelection.push(that.industriesDefault);
          that.industriesSelection.sort(function (a, b) {
            return (a.id - b.id);
          });
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }
          // that.$toaster.error(that.$i18n.t('message.fail_industry_view'));
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });

        //list companies
        that.$store.dispatch('companies/index').then(result => {
          that.listArray = result.data;
          that.companiesSelection = _.clone(result.data);
          that.companiesSelection.push(that.companyDefault);
          that.companiesSelection.sort(function (a, b) {
            return (a.id - b.id);
          });
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_company_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
    })},

    methods: {

        invoiceListing() {
            //list billings
            let that = this;
            that.$store.dispatch('billings/index').then(result => {
                that.listBillingArray = result.data;
            }).catch((error) => {
                if (error.response.status == 401) {
                    this.$router.push('/login');
                    this.$toaster.error(this.$i18n.t('message.token_expired'));
                } else {
                    that.$toaster.error(that.$i18n.t('message.fail_billing_view'));
                }
                // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
                that.$nuxt.$loading.finish();
            });
        },

        sendEmails(billing) {
            this.sendEmail = true;
            this.currentBillingId = billing.id
        },

        handleSendEmail() {
            let that = this;
            that.$nuxt.$loading.start();
            that.$store.dispatch('billings/sendEmail', this.currentBillingId).then(() => {
                that.$toaster.success(this.$i18n.t('message.send_email_successfully'));
                that.sendEmail = false;
                that.currentBillingId = null;
                that.reloadListBilling();
                that.$nuxt.$loading.finish();
            });
        },
        getStatus(status) {
            return status == 0 ? 'Pending' : 'Paid';
        },

        handleStatus(billing) {
            if (billing.status == 1) return false;
            this.changeStatus = true;
            this.currentBillingId = billing.id
        },
        handleSaveStatus() {
            let that = this;
            that.$nuxt.$loading.start();
            that.$store.dispatch('billings/status', this.currentBillingId).then(() => {
                that.$toaster.success(this.$i18n.t('message.status_change_successfully'));
                that.changeStatus = false;
                that.currentBillingId = null;
                that.reloadListBilling();
                that.$nuxt.$loading.finish();
            });
        },
        translateCol(colName) {
            return this.$i18n.t('column.' + colName);
        },

        editItem(item) {
            this.editedItem = Object.assign({}, item);
            this.checkViewDetail = true;
        },

      reloadList(){
        let that = this;
        // get list
        that.$store.dispatch('companies/index').then(result => {
          that.listArray = result.data;
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_company_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      },

        reloadListBilling() {
            let that = this;
            // get list
            that.$store.dispatch('billings/index').then(result => {
                that.listBillingArray = result.data;
                that.$nuxt.$loading.finish();
            }).catch((error) => {
            if (error.response?.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
                that.$toaster.error(that.$i18n.t('message.fail_billing_view'));
          }
                // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
                that.$nuxt.$loading.finish();
            });
        },

        reset() {
            setTimeout(() => {
                this.reportItem = Object.assign({}, this.reportDefault);
                this.$refs.form.reset();
                this.$refs.form.resetValidation();
            }, 100);
        },

        getSelectedCompany(value) {
            this.reportItem.companyArray = value.selectedItemsOutput;
        },

      save() {
        let that = this;
        if (that.$refs.form.validate()) {
          that.$nuxt.$loading.start();
          that.$store.dispatch('billings/store', that.reportItem).then(function () {
            that.reloadListBilling();
            that.$toaster.success(that.$i18n.t('message.success_billing_add_new'));
            that.$nuxt.$loading.finish();
          }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_billing_add_new'));
            }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish();
          });
          that.dialogGenerateReport = false;
        }
      },

        generateReport() {
            this.reset();
            this.dialogGenerateReport = true;
        },

        action(item, action) {

            if (action === 'download') {
                let that = this;
                that.$nuxt.$loading.start();
                that.$store.dispatch('billings/pdf', {
                    fiken_invoice_id: item?.billing_detail?.fiken_invoice_id,
                }).then((response) => {
                    window.open(
                        response.data,
                        '_blank' 
                    );
                    that.$nuxt.$loading.finish();
                }).catch((error) => {
                    if (error.response.status == 401) {
                        that.$router.push('/login');
                        that.$toaster.error(that.$i18n.t('message.token_expired'));
                    } else {
                        that.$toaster.error(that.$i18n.t('message.fail_something'));
                    }
                    that.$nuxt.$loading.finish();
                });
                // doc.save(pdfName + '.pdf');
            } else { //view
                // doc.output('dataurlnewwindow', pdfName);
            }
        },
    },
};
</script>

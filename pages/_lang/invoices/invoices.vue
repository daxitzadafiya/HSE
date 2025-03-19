<template>
    <div class="resources-page">

        <b-tabs card>
            <b-tab :title="$t('tab.invoice')" active>
                <v-container>

                    <!-- Table -->
                    <v-data-table :headers="headers" :items="filteredItems" class="elevation-1 hse-table table-data"
                        :items-per-page="15" :single-expand="true" :search="search" :sort-by="['created_at']"
                        :sort-desc="[true, false]">
                        <template v-slot:top>
                            <div class="setting-header">
                                <div class="panel-heading">
                                    <h4 class="panel-title">
                                        {{ $t('title.sort_by') }}
                                    </h4>
                                    <b-row>
                                        <b-col cols="6">
                                            <div class="field-selection">
                                                <v-select v-model="invoiceStatus" item-text="name" item-value="id"
                                                    :items="statusArray" :label="$t('setting.status')" outlined
                                                    class="text-box" />
                                            </div>
                                        </b-col>
                                        <b-col cols="6">
                                            <div class="field-selection field-search">
                                                <v-text-field v-model="search" append-icon="search"
                                                    :label="$t('setting.search')" outlined class="text-box" />
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
                            <b-badge v-if="item.billing_detail"
                                :variant="item.billing_detail?.status == 0 ? 'danger' : 'info'">{{ getStatus(item.billing_detail?.status) }}</b-badge>
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
        </b-tabs>
    </div>
</template>
    
<script>

// import {
//     jsPDF
// } from "jspdf";

export default {


    data: () => ({

        pageKey: 'overview-users-users',
        search: '',
        fiken_invoice_id: '',
        listArray: [],
        invoiceStatus: 0,
        status: "",
        statusArray: [
            {
                id: 0,
                name: "All"
            },
            {
                id: 1,
                name: "Paid"
            },
            {
                id: 2,
                name: "Pending"
            },
        ]
    }),

    computed: {
        headers() {
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
            let that = this;
            return that.listArray.filter((item) => {
                // return item
                return that.invoiceStatus === 0 || (item.billing_detail?.status === that.invoiceStatus);
            });
        },
    },

    watch: {},

    mounted() {
        this.reloadList();
    },

    methods: {
        translateCol(colName) {
            return this.$i18n.t('column.' + colName);
        },

        getStatus(status) {
            return status == 0 ? 'Pending' : 'Paid';
        },

        reloadList() {
            let that = this;
            // get list
            that.$store.dispatch('billings/index').then(result => {
                that.listArray = result.data;
                that.$nuxt.$loading.finish();
            }).catch(() => {
                that.$toaster.error(that.$i18n.t('message.fail_coupon_view'));
                // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
                that.$nuxt.$loading.finish();
            });
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
    
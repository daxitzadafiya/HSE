<template>
    <div>
        <v-dialog v-model="openPopup" max-width="700px" persistent v-if="purchase?.subscription?.addon_detail || purchaseType == 'addon_subscription'">
            <v-card>
                <v-card-text>
                    <div class="header-popup p-4">
                        <div>{{ purchase.title }}</div>
                        <h6 class="text-muted mt-3">{{ purchase.description }}</h6>
                    </div>
                    <v-card elevation="0" v-if="purchase?.subscription?.addon_detail">
                        <v-container class="d-flex flex-column bg-surface-variant" style="gap: 2rem;">
                            <v-card elevation="1">
                                <div style="background-color: #f1f1f1;" class="px-3">
                                    <div class="p-3 text-uppercase header-text">
                                        {{ $t('column.addon_details') }}
                                    </div>
                                </div>
                                <v-card-text class="text--lighten-3">
                                    <div class="col-12 bg-white rounded">
                                        <div class="row">
                                            <div class="col-4 text-uppercase">
                                                {{ $t('column.addon_name') }}
                                            </div>
                                            <div class="col-3 font-weight-bold text-capitalize text-secondary">
                                                {{ purchase?.subscription?.addon_detail.title }}
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-4 text-uppercase">
                                                {{ $t('column.addon_price') }}
                                            </div>
                                            <div class="col-3 font-weight-bold text-capitalize text-secondary">
                                                <span style="background-color: #87A53A4D" class="rounded px-2 py-1">
                                                    Kr {{ purchase?.subscription?.addon_detail.price }}
                                                </span>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-4 text-uppercase">
                                                {{ $t('column.addon_frequency') }}
                                            </div>
                                            <div class="col-3 font-weight-bold text-capitalize text-secondary">
                                                {{ getTypes(purchase?.subscription?.addon_detail.frequency) }}
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-4 text-uppercase">
                                                {{ $t('column.storage') }}
                                            </div>
                                            <div class="col-3 font-weight-bold text-capitalize text-secondary">
                                                {{ purchase?.subscription?.addon_detail.volume }}
                                            </div>
                                        </div>
                                    </div>
                                </v-card-text>
                            </v-card>

                            <v-card elevation="2">
                                <div class="px-3" style="background-color:#f1f1f1;">
                                    <div class="p-3 text-uppercase header-text">
                                        {{ $t('title.order_summary') }}
                                    </div>
                                </div>
                                <v-card-text class="text--lighten-3 pt-0">
                                    <div class="col-12 bg-white rounded">
                                        <div class="row">
                                            <div class="font-weight-bold col-10 text-dark">
                                                {{ $t('column.total_amount') }}
                                            </div>
                                            <div class="col-2">
                                                <span>Kr</span>
                                                {{ purchase?.subscription?.addon_detail.price }}
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="font-weight-bold col-10 text-dark">
                                                {{ $t('column.quantity') }}
                                            </div>
                                            <div class="col-2 pl-8">
                                                {{ this.purchase?.subscription.quantity }}
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="font-weight-bold col-10 text-dark d-flex align-items-center" style="gap: 15px;">
                                                {{ $t('column.vat') }} <span style="background-color: #87A53A4D;"
                                                    class="rounded pl-2 pr-2"> {{ getPercentageVat.toFixed(0) }} % </span>
                                            </div>
                                            <div class="col-2">
                                                <span>Kr</span>
                                                {{ purchase?.billing?.billing_detail.vat }}
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="font-weight-bold col-10 text-dark">
                                                {{ $t('title.total') }}
                                            </div>
                                            <div class="col-2 text-dark font-weight-bold">
                                                <span class="text-dark">Kr</span>
                                                {{ purchase?.billing?.billing_detail.amount }}
                                            </div>
                                        </div>
                                    </div>
                                </v-card-text>
                            </v-card>
                        </v-container>
                    </v-card>
                </v-card-text>
                <div class="p-4 text-white pt-1 d-flex justify-content-end">
                    <v-btn class="p-2 rounded text-center" text @click="close">
                            <span style="border-bottom: 1px solid black;">{{ $t('button.cancel') }}</span>
                    </v-btn>
                </div>
            </v-card>
        </v-dialog>
        <v-dialog v-model="openPopup" max-width="827px" persistent v-if="purchase?.subscription?.plan_detail">
            <v-card>
                <div class="header-popup p-4">
                        <div>{{ purchase.title }}</div>
                        <h6 class="text-muted mt-3">{{ purchase.description }}</h6>
                    </div>
                    <v-card-text>
                        <div class="row">
                            <div class="col-9 col-xl-6 mt-1">
                                <v-container class="d-flex flex-column bg-surface-variant" style="gap: 2rem;">
                                    <v-card elevation="1">
                                        <div style="background-color: #f1f1f1;" class="px-3">
                                            <div class=" p-3 text-uppercase header-text">
                                                {{ $t('column.plan_details') }}
                                            </div>
                                        </div>
                                        <v-card-text class="text--lighten-3 pt-0">
                                            <div>
                                                <div class="col-12 bg-white rounded">
                                                    <div class="row">
                                                        <div class="col-7 text-uppercase">
                                                            {{ $t('column.name') }}
                                                        </div>
                                                        <div class="col-5 font-weight-bold text-capitalize text-dark">
                                                            {{ purchase.title }}
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-8 text-uppercase">
                                                            {{ $t('column.amount') }}
                                                        </div>
                                                        <div class="col-4 font-weight-bold">
                                                            <span style="background-color: #87A53A4D;" class="rounded p-1 text-dark">
                                                                Kr {{ purchase?.subscription?.plan_detail.price }}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-8 text-uppercase">
                                                            {{ $t('column.frequency') }}
                                                        </div>
                                                        <div class="col-4 font-weight-bold text-dark">
                                                            {{ getTypes(purchase?.subscription?.plan_detail.plan_type) }}
                                                        </div>
                                                    </div>

                                                    <div class="row">
                                                        <div class="col-9 text-uppercase">
                                                            {{ $t('column.additional_price') }}
                                                        </div>
                                                        <div class="col-3 font-weight-bold text-dark">
                                                            Kr {{ purchase?.subscription?.plan_detail.additional_price }}
                                                        </div>
                                                    </div>

                                                    <div class="row">
                                                        <div class="col-8 text-uppercase">
                                                            {{ $t('message.free_trial_months') }}
                                                        </div>
                                                        <div class="col-4 font-weight-bold text-dark">
                                                            {{ purchase?.subscription?.plan_detail.free_trial_months }}
                                                            (Months)
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </v-card-text>
                                    </v-card>
                                </v-container>
                            </div>

                            <div class="col-9 col-xl-6 mt-4">
                                <v-card elevation="1">
                                    <div style="background-color: #f1f1f1;">
                                        <div class="header-text h6 p-3 text-uppercase d-flex justify-content-center"
                                            style="color: rgba(0, 0, 0, 0.40);">
                                            {{ $t('title.access_modules') }}
                                        </div>
                                    </div>
                                    <v-card-text class="text--lighten-3">
                                        <div class="d-flex flex-wrap p-1" style="gap:16px;">
                                            <div class="p-2 d-flex align-items-center border justify-content-center rounded basis_left"
                                                v-if="purchase?.subscription?.plan_detail.plan_detail.instruction">
                                                <img src="~assets/images/icon/instructions.png" alt="deviation"
                                                    class="dark-logo img">
                                                <div class="ml-1">{{
                                                    $t('form.instructions') }}</div>
                                            </div>
                                            <div class="p-2 d-flex align-items-center  border justify-content-center rounded basis_left"
                                                v-if="purchase?.subscription?.plan_detail.plan_detail.risk">
                                                <img src="~assets/images/icon/risk-area.png" alt="deviation"
                                                    class="dark-logo img">
                                                <div class="ml-2">{{
                                                    $t('form.risk_areas') }}</div>
                                            </div>
                                            <div class="p-2 border d-flex rounded align-items-center justify-content-center basis_left"
                                                v-if="purchase?.subscription?.plan_detail.plan_detail.deviation">
                                                <img src="~assets/images/icon/deviations.png" alt="deviation"
                                                    class="dark-logo img">
                                                <div class="ml-2">{{
                                                    $t('form.deviations') }}</div>
                                            </div>

                                            <div class="p-2 border rounded d-flex align-items-center justify-content-center basis_left"
                                                v-if="purchase?.subscription?.plan_detail.plan_detail.routine">
                                                <img src="~assets/images/icon/routines.png" alt="deviation"
                                                    class="dark-logo img">
                                                <div class="ml-2">{{
                                                    $t('form.routines') }}</div>
                                            </div>
                                            <div class="p-2 border rounded d-flex align-items-center justify-content-center basis_left"
                                                v-if="purchase?.subscription?.plan_detail.plan_detail.document">
                                                <img src="~assets/images/icon/documents.png" alt="deviation"
                                                    class="dark-logo img">
                                                <div class="ml-2">{{
                                                    $t('form.documents') }}</div>
                                            </div>
                                            <div class="p-2 border rounded d-flex align-items-center justify-content-center  basis_left"
                                                v-if="purchase?.subscription?.plan_detail.plan_detail.checklist">
                                                <img src="~assets/images/icon/checklists.png" alt="deviation"
                                                    class="dark-logo img">
                                                <div class="ml-2">{{
                                                    $t('form.checklists') }}</div>
                                            </div>
                                            <div class="p-2 border rounded d-flex align-items-center justify-content-center  basis_left"
                                                v-if="purchase?.subscription?.plan_detail.plan_detail.task">
                                                <img src="~assets/images/icon/tasks.png" alt="tasks" class="dark-logo img">
                                                <div class="ml-2">{{ $t('form.tasks')
                                                }}</div>
                                            </div>
                                            <div class="p-2 border rounded d-flex align-items-center justify-content-center  basis_left"
                                                v-if="purchase?.subscription?.plan_detail.plan_detail.goal">
                                                <img src="~assets/images/icon/goals.png" alt="deviation"
                                                    class="dark-logo img">
                                                <div class="ml-2">{{ $t('form.goals')
                                                }}</div>
                                            </div>
                                            <div class="p-2 border rounded d-flex align-items-center justify-content-center  basis_left"
                                                v-if="purchase?.subscription?.plan_detail.plan_detail.contact">
                                                <img src="~assets/images/icon/contacts.png" alt="contacts"
                                                    class="dark-logo img">
                                                <div class="ml-2">{{
                                                    $t('form.contacts') }}</div>
                                            </div>
                                        </div>
                                    </v-card-text>
                                </v-card>
                            </div>
                        </div>

                        <v-card elevation="2" class="mt-8">
                        <div style="background-color: #f1f1f1;">
                            <div class="p-3 text-uppercase header-text">
                                {{ $t('title.order_summary') }}
                            </div>
                        </div>
                        <v-card-text class="text--lighten-3 pt-0" v-if="purchase?.billing?.billing_detail.amount">
                            <div class="col-12 bg-white rounded">
                                <div class="row">
                                    <div class="font-weight-bold col-10 text-dark">
                                        {{ $t('column.total_amount') }}
                                    </div>
                                    <div class="col-2">
                                        <span>Kr</span>
                                        {{ purchase?.subscription?.plan_detail.price }}
                                    </div>
                                </div>

                                <div class="row" v-if="purchase?.billing.billing_detail.discount > 0">
                                    <div class="font-weight-bold col-8 text-dark">
                                        {{ $t('column.discount') }}
                                    </div>
                                    <div class="col-2">
                                        <span style="background-color: #87A53A4D;" class="rounded p-1"> -
                                            {{ getPercentageDiscount }} % </span>
                                    </div>
                                    <div class="col-2">
                                        <span>Kr</span>
                                        {{ purchase?.billing?.billing_detail.discount }}
                                    </div>
                                </div>

                                <div class="row" v-if="purchase?.billing?.billing_detail.additional_user_amount > 0">
                                    <div class="font-weight-bold col-10 text-dark">
                                        {{ $t('column.additional_price') }}
                                    </div>
                                    <div class="col-2">
                                        <span>Kr</span>
                                        {{ purchase?.billing?.billing_detail.additional_user_amount }}
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="font-weight-bold col-10 text-dark">
                                        {{ $t('column.vat') }} <span style="background-color: #87A53A4D;" class="rounded p-1">
                                            {{ getPercentageVat.toFixed(0) }} % </span>
                                    </div>
                                    <div class="col-2">
                                        <span>Kr</span>
                                        {{ purchase?.billing?.billing_detail.vat }}
                                    </div>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="font-weight-bold col-10 text-dark">
                                        {{ $t('title.total') }}
                                    </div>
                                    <div class="col-2 font-weight-bold text-dark">
                                        <span class="text-dark">Kr</span>
                                        {{ purchase?.billing?.billing_detail.amount }}
                                    </div>
                                </div>
                            </div>
                        </v-card-text>

                        <v-card-text class="text--lighten-3 pt-0" v-else>
                            <div class="col-12 bg-white rounded">
                                <div class="row">
                                    <div class="font-weight-bold col-10 text-dark">
                                        {{ $t('title.total') }}
                                    </div>
                                    <div class="col-2 text-dark font-weight-bold">
                                        <span>Kr</span>
                                        {{ purchase?.billing?.billing_detail.amount }}
                                    </div>
                                </div>
                            </div>
                        </v-card-text>
                    </v-card>
                    </v-card-text>
                <div class="p-4 text-white pt-1 d-flex justify-content-end">
                    <v-btn class="p-2 rounded text-center" text @click="close">
                            <span style="border-bottom: 1px solid black;">{{ $t('button.cancel') }}</span>
                    </v-btn>
                </div>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
export default {
    name: 'OrderPopup',
    components: {},
    props: {
        openPopup: {
            type: Boolean,
            required: false,
        },
        orderId: {
            type: Number,
            required: false,
        },
        purchaseType: {
            type: String,
            required: false,
        },
    },
    data: () => ({
        purchase: [],
        valid: true,
        formTitle: '',
        editMode: false,
        companyArray: [],
    }),
    mounted() {
        this.$nextTick(() => {
            this.orders(this.orderId);
        });
    },

    computed: {
        getTotalPriceAddon() {
            return this.purchase?.subscription?.addon_detail.price * this.purchase?.subscription.quantity;
        },
        getTotalPricePlan() {
            return this.purchase?.subscription?.plan_detail.price + this.purchase?.billing?.billing_detail.additional_user_amount - this.purchase?.billing?.billing_detail.discount;
        },
        getPercentageVat(){
            return  (this.purchase?.billing?.billing_detail.vat * 100)/ (this.purchase?.subscription.plan_id ? this.getTotalPricePlan : this.getTotalPriceAddon)
        },
        getPercentageDiscount(){
            return  (this.purchase?.billing?.billing_detail.discount * 100) / this.purchase?.subscription?.plan_detail.price
        },
    },
    methods: {
        getTypes(type) {
            switch (type) {
                case 1:
                    return 'Monthly';
                case 3:
                    return 'Quarterly';
                case 6:
                    return 'Half Yearly';
                case 12:
                    return 'Annually';
                default:
                    return 'Not found plan';
            }
        },
        orders(id) {
            this.isLoading = true;
            this.$nuxt.$loading.start();
            this.$store.dispatch('billings/showHistory', id).then((res) => {
                this.purchase = res.data;
                this.$nuxt.$loading.finish();
                this.isLoading = false;
            }).catch((error) => {
                if (error.response.status == 401) {
                    this.$router.push('/login');
                    this.$toaster.error(this.$i18n.t('message.token_expired'));
                } else {
                    this.$toaster.error(this.$i18n.t('message.fail_orders_purchase'));
                }
                this.$nuxt.$loading.finish();
                this.isLoading = false;
            });
        },
        addNew() {  
            this.editMode = false;
        },
        close() {
            this.$emit('closePopup');
            this.$router.push('/settings/billings');
        },
    },
};
</script>
<style scoped>
.border-b-gray-1 {
    border-bottom: 2px solid #e9ecef !important;
}

.img {
    width: 23px;
    height: 23px;
    object-fit: contain;
}

.text-green {
    color: #87a53a;
}

.basis {
    flex-basis: 11.12rem;
}


.basis_left {
    flex-basis: 9.80rem;
}

.header-text {
    color: rgba(0, 0, 0, 0.40);
    font-size: 18px;
    font-weight: 700;
}

.header-popup {
    padding: 1.11111rem 1.11111rem 0;
    text-transform: uppercase;
    font-size: 1.38889rem;
    text-align: center;
    color: #87A53A;
}</style>

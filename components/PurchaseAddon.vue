<template>
    <div>
        <div v-if="isLoading" class="loader-opacity"></div>
        <v-dialog v-if="!isOpenThankYouPopup" v-model="openPopup" max-width="1130px" persistent>
            <v-card>
                <v-card-text class="pb-0">
                    <div class="row">
                        <div class="col-7 col-xl-7 mt-4 pr-0">
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
                                                    {{ addon.title }}
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-4 text-uppercase">
                                                    {{ $t('column.addon_price') }}
                                                </div>
                                                <div class="col-3 font-weight-bold text-capitalize text-secondary">
                                                    <span style="background-color: #87A53A4D" class="rounded px-2 py-1">
                                                        Kr {{ addon.price }}
                                                    </span>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-4 text-uppercase">
                                                    {{ $t('column.addon_frequency') }}
                                                </div>
                                                <div class="col-3 font-weight-bold text-capitalize text-secondary">
                                                    {{ getPlanTypes(addon.frequency) }}
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-4 text-uppercase">
                                                    {{ $t('column.storage') }}
                                                </div>
                                                <div class="col-3 font-weight-bold text-capitalize text-secondary">
                                                    {{ addon.volume }} GB
                                                </div>
                                            </div>
                                        </div>
                                    </v-card-text>
                                </v-card>
                                <v-card elevation="1">
                                    <div class="border">
                                        <div class="d-flex align-items-center">
                                            <div class="font-weight-bold col-8 text-secondary px-8">
                                                {{ $t('column.qty') }}
                                            </div>
                                            <div class="switch-component">
                                                <v-switch @change="handleAdditional" v-model="is_quantity" inset
                                                    class="right-text" />
                                            </div>
                                        </div>
                                        <b-row v-if="is_quantity">
                                            <b-col cols="12">
                                                <div class="input-wrap mt-2 px-4">
                                                    <v-text-field @keypress="onlyNumber" v-model="quantity" label="Quantity"
                                                        outlined />
                                                </div>
                                            </b-col>
                                        </b-row>
                                    </div>
                                </v-card>
                            </v-container>
                        </div>
                        <div class="col-6 col-xl-5 mt-4 pl-0">
                            <v-container class="d-flex flex-column bg-surface-variant" style="gap: 2rem;">
                                <v-card elevation="2">
                                    <div class="px-3" style="background-color:#f1f1f1;">
                                        <div class="p-3 text-uppercase header-text">
                                            {{ $t('title.order_summary') }}
                                        </div>
                                    </div>
                                    <v-card-text class="text--lighten-3 pt-0">
                                        <div class="col-12 bg-white rounded">
                                            <div class="row">
                                                <div class="font-weight-bold col-9 text-dark">
                                                    {{ $t('column.total_amount') }}
                                                </div>
                                                <div class="col-3">
                                                    <span>Kr</span>
                                                    {{ addon.price }}
                                                </div>
                                            </div>

                                            <div class="row" v-if="quantity > 0">
                                                <div class="font-weight-bold col-10 text-dark">
                                                    {{ $t('column.quantity') }}
                                                </div>
                                                <div class="col-2">
                                                    {{ quantity ? quantity : 0 }}
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="font-weight-bold col-9 text-dark d-flex align-items-center" style="gap: 15px;">
                                                    {{ $t('column.vat') }} <span style="background-color: #87A53A4D;"
                                                        class="rounded pl-2 pr-2"> {{ vat }} % </span>
                                                </div>
                                                <div class="col-3">
                                                    <span>Kr</span>
                                                    {{ getVatCalculate }}
                                                </div>
                                            </div>
                                            <hr>
                                            <div class="row">
                                                <div class="font-weight-bold col-9 text-dark">
                                                    {{ $t('title.total') }}
                                                </div>
                                                <div class="col-3 text-dark font-weight-bold">
                                                    <span class="text-dark">Kr</span>
                                                    {{ getTotalAmount }}
                                                </div>
                                            </div>
                                        </div>
                                    </v-card-text>
                                </v-card>
                                <v-card elevation="1">
                                    <v-card-text class="text--lighten-3 pt-0">
                                        <div>
                                            <div class="d-flex justify-content-between align-items-center p-0 px-4">
                                                <div>
                                                    <span>{{ $t('title.pay_card') }}</span>
                                                </div>
                                                <div>
                                                    <v-switch @change="handlepayByCard" v-model="is_payByCard" inset
                                                        :disabled="lowCredit" />
                                                </div>
                                                <div>
                                                    <span>
                                                        {{ $t('title.pay_invoice') }}
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <hr style=" margin-top: 0rem; margin-left: 1rem; margin-right: 1rem">
                                            </div>
                                            <div class="col-12 bg-white rounded pt-0 px-4">
                                                <div class="row">
                                                    <div class="font-weight-bold col-9 text-dark">
                                                        {{ $t('title.billing_details') }}
                                                    </div>
                                                    <div class="col-3 font-weight-bold text-dark">
                                                        <span>Kr</span>
                                                        {{ getTotalAmount }}
                                                    </div>
                                                </div>
                                            </div>

                                            <v-card-text class="text--lighten-3 pt-0">
                                                <div class="col-12 bg-white rounded border" v-if="!is_payByCard">
                                                    <card-input ref="card" v-if="!defaultCard"></card-input>
                                                    <div v-else-if="cardDetail" elevation="1">
                                                        <div class="row border-bottom">
                                                            <div class="font-weight-normal text-secondary col-9 px-4">
                                                                ********{{ cardDetail.last4 }}
                                                            </div>
                                                            <div class="col-3">
                                                                <div>
                                                                    <img src="../assets/images/card.png" alt=""
                                                                        style="max-width: 60px;">
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="row">
                                                            <div class="font-weight-normal text-secondary col-10 px-4">
                                                                {{ cardDetail.exp_month }}/{{ cardDetail.exp_year }}
                                                            </div>
                                                            <div class="col-2 pl-0">
                                                                CVC
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </v-card-text>
                                            <div class="p-0 px-4">
                                                <div class="d-flex align-items-center">
                                                    <v-checkbox @change="handleTearm" class="md-line-height" />
                                                    <nuxt-link :to="'/' + $i18n.locale + '/conditions'" target="_blank"
                                                        style="text-decoration: none;">
                                                        <a class="mt-2 text-secondary h6" style="color: #808080;">{{
                                                            $t('title.terms_condition')
                                                        }}</a>
                                                    </nuxt-link>
                                                </div>
                                            </div>
                                        </div>
                                    </v-card-text>
                                </v-card>
                            </v-container>
                        </div>
                    </div>
                </v-card-text>
                <div class="d-flex justify-content-end p-4 pt-1" style="gap: 5px;">
                    <v-btn class="p-2 mt-2 rounded text-center" text @click="close">
                        <span style="border-bottom: 1px solid black;">{{ $t('button.cancel') }}</span></v-btn>
                    <v-btn class="btn-save p-2 mt-2 rounded text-center" :disabled="!is_conditions" @click="save">
                        {{ $t('column.buy_now') }}
                    </v-btn>
                </div>
            </v-card>
        </v-dialog>
        <div>
            <v-dialog v-model="isOpenThankYouPopup" max-width="700px" persistent>
                <v-card>
                    <v-card-text>
                        <div class="header-popup p-4">
                            <div>{{ $t('title.purchase') }} </div>
                        </div>
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
                                                {{ addon.title }}
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-4 text-uppercase">
                                                {{ $t('column.addon_price') }}
                                            </div>
                                            <div class="col-3 font-weight-bold text-capitalize text-secondary">
                                                <span style="background-color: #87A53A4D" class="rounded px-2 py-1">
                                                    Kr {{ addon.price }}
                                                </span>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-4 text-uppercase">
                                                {{ $t('column.addon_frequency') }}
                                            </div>
                                            <div class="col-3 font-weight-bold text-capitalize text-secondary">
                                                {{ getPlanTypes(addon.frequency) }}
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-4 text-uppercase">
                                                {{ $t('column.storage') }}
                                            </div>
                                            <div class="col-3 font-weight-bold text-capitalize text-secondary">
                                                {{ addon.volume }} GB
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
                                                {{ addon.price }}
                                            </div>
                                        </div>

                                        <div class="row" v-if="quantity > 0">
                                            <div class="font-weight-bold col-10 text-dark">
                                                {{ $t('column.quantity') }}
                                            </div>
                                            <div class="col-2 pl-8">
                                                {{ quantity ? quantity : 0 }}
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="font-weight-bold col-10 text-dark d-flex align-items-center" style="gap: 15px;">
                                                {{ $t('column.vat') }} <span style="background-color: #87A53A4D;"
                                                    class="rounded pl-2 pr-2"> {{ vat }} % </span>
                                            </div>
                                            <div class="col-2">
                                                <span>Kr</span>
                                                {{ getVatCalculate }}
                                            </div>
                                        </div>
                                        <hr>
                                        <div class="row">
                                            <div class="font-weight-bold col-10 text-dark">
                                                {{ $t('title.total') }}
                                            </div>
                                            <div class="col-2 text-dark font-weight-bold">
                                                <span class="text-dark">Kr</span>
                                                {{ getTotalAmount }}
                                            </div>
                                        </div>
                                    </div>
                                </v-card-text>
                            </v-card>
                        </v-container>
                    </v-card-text>
                    <v-card-text>
                        <div class="p-4 text-white pt-1 d-flex justify-content-end">
                            <v-btn class="p-2 mt-2 rounded text-center" text @click="close">
                            <span style="border-bottom: 1px solid black;">{{ $t('button.cancel') }}</span></v-btn>
                        </div>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </div>
    </div>
</template>

<script>
import CardInput from './CardInput';

export default {
    components: {
        CardInput,
    },
    name: 'PurchaseAddon',
    props: {
        openPopup: {
            type: Boolean,
            required: true,
        },
        addon: {
            type: Object,
            required: true,
        },
    },
    data: () => ({
        is_payByCard: false,
        is_quantity: false,
        is_conditions: false,
        isOpenThankYouPopup: false,
        paymentMethod: null,
        defaultCard: null,
        lowCredit: null,
        vat: null,
        payByMethod: 1,
        cardDetail: {},
        isLoading: false,
        quantity: 1,
        additional_users: 0,
        onlyNumber(e) {
            if (!(/\d/i.test(e.key))) {
                e.preventDefault();
            }
        },
    }),
    mounted() {
        this.getUserCard();
    },

    computed: {
        getTotalPrice() {
            return this.addon.price * this.quantity;
        },
        getVatCalculate() {
            return this.getTotalPrice * this.vat / 100;
        },
        getTotalAmount() {
            return this.getTotalPrice + this.getVatCalculate;
        },
    },

    methods: {
        handlepayByCard(val) {
            if (val) {
                this.is_payByCard = true;
            }
        },
        handleAdditional(val) {
            if (val) {
                this.is_quantity = true;
            }
        },
        handleTearm(val) {
            this.is_conditions = !!val
        },
        getPlanTypes(type) {
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
        async save() {

            // if the card is not tokenized already, we'll tokenize it
            if (this.paymentMethod === null && this.defaultCard === false && this.payByMethod === 1) {
                const paymentMethod = await this.$refs.card.tokenize();
                // if any error tokenizing, we'll bail out
                if (!paymentMethod) {
                    this.loading = false;
                    return;
                }
                this.paymentMethod = paymentMethod;
            }

            this.isLoading = true;
            this.$nuxt.$loading.start();
            await this.$store.dispatch('subscriptions/addonPurchase', {
                addon_id: this.addon.id,
                payment_method: this.paymentMethod,
                payByMethod: this.payByMethod,
                quantity: this.quantity,
                vat: this.vat,

            }).then(() => {
                this.$toaster.success(this.$i18n.t('message.success_addon_purchase'));
                this.$nuxt.$loading.finish();
                this.isLoading = false;
                this.isOpenThankYouPopup = true;
                // this.$emit('reloadList');
                // this.close();
            }).catch((error) => {
                if (error.response.status == 401) {
                    this.$router.push('/login');
                    this.$toaster.error(this.$i18n.t('message.token_expired'));
                } else {
                    this.$toaster.error(this.$i18n.t('message.fail_something'));
                }
                this.$nuxt.$loading.finish();
                this.isLoading = false;
                this.close();
            });
        },
        getUserCard() {
            this.$nuxt.$loading.start();
            this.isLoading = true;
            this.$store.dispatch('subscriptions/creditCheck', {}).then((res) => {
                this.defaultCard = res.data.customerDefaultCard;
                this.lowCredit = res.data.lowCredit;
                this.cardDetail = res.data.cardDetail;
                this.vat = res.data.vat;
                this.$nuxt.$loading.finish();
                this.isLoading = false;
            }).catch((error) => {
                if (error.response.status == 401) {
                    this.$router.push('/login');
                    this.$toaster.error(this.$i18n.t('message.token_expired'));
                } else {
                    this.$toaster.error(this.$i18n.t('message.fail_card'));
                }
                this.$nuxt.$loading.finish();
                this.isLoading = false;
                // this.close();
            });
        },
        close() {
            // this.reset();
            this.isOpenThankYouPopup = false;
            this.$emit('reloadList');
            this.$emit('closePopup');
        },
    },
};
</script>
<style scoped>
.loader-opacity {
    background: none repeat scroll 0 0 white;
    position: fixed;
    display: block;
    opacity: 0.5;
    z-index: 1000001;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
}

.border-b-gray-1 {
    border-bottom: 2px solid #e9ecef !important;
}

.img {
    width: 25px;
    height: 25px;
    object-fit: contain;
}

.header-popup {
    padding: 1.11111rem 1.11111rem 0;
    text-transform: uppercase;
    font-size: 1.38889rem;
    text-align: center;
    color: #87A53A;
}

.header-text {
    color: rgba(0, 0, 0, 0.40);
    font-size: 18px;
    font-weight: 700;
}
</style>

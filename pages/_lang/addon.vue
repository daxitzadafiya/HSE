<template>
    <div class="resources-page">
        <b-tabs card>
            <keep-alive>
                <b-tab title="Addon" :active="this.$route.query.type">
                    <v-container class="mt-5">
                        <v-card>
                            <div class="d-flex w-full p-3 align-items-center">
                                <img width="20%" alt="billImg" class="thumbnail"
                                    src="https://img.freepik.com/premium-photo/devices-connected-storage-data-center-tablet-phone-home-devices-with-online-cloud-technology-computing-generative-ai_771426-6880.jpg">
                                <h2 class="ml-3"> There is no more space in the storage, please purchase an
                                    addon. </h2>
                            </div>
                        </v-card>
                    </v-container>
                </b-tab>
            </keep-alive>
            <keep-alive>
                <b-tab :title="$t('tab.addons')">
                    <v-container class="mt-5">
                        <v-row v-if="addons.length > 0">
                            <v-col v-for="(addon, key) in addons" :key="key" cols="3" sm:cols="6">
                                <v-card class="mb-2 shadow card">
                                    <div class="p-20">
                                        <div class="d-flex justify-content-center align-items-center shadow-sm p-3 mb-5 bg-white rounded"
                                            style="gap:1rem">
                                            <div
                                                class="ribon btn-custom-green rounded-circle text-white d-flex justify-content-center align-items-center">
                                                <span class="fa fa-ruble-sign fa-2x"></span>
                                            </div>
                                            <div>
                                                <p class="h-1 m-0 text-green">
                                                    {{ addon.title }} - <span>{{ getPlanTypes(addon.frequency) }}
                                                    </span>
                                                </p>
                                                <p class="text-secondary font-weight-bold m-0 font-20">
                                                    <span class="number">Kr {{ addon.price }}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <p class="text-white p-2 opacity-25 px-4" style="background-color: #B1BFC6;">
                                            {{ $t('title.basic') }}</p>
                                        <div class="shadow-sm mb-5 bg-white rounded">
                                            <div class="mb-5  text-muted">
                                                <div class="border-bottom p-2 ">
                                                    <span class="fas fa-check-circle text-green pr-2"></span>
                                                    {{ $t('column.storage') }} :
                                                    {{ addon.volume }} GB
                                                </div>
                                            </div>
                                        </div>
                                        <div class="shadow-sm mb-5 bg-white rounded"
                                            v-if="addon?.active_addon?.cancelled_at">
                                            <div class="mb-3  text-muted">
                                                <div class="p-2">
                                                    {{ $t('column.expire_date') }}
                                                    <span> {{ moment(addon.active_addon.billed_at).format('DD.MM.YYYY')
                                                    }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="py-3 text-center px-4 pt-0">
                                        <v-btn v-if="addon.active_addon" class="btn-custom-green w-100" disabled>
                                            {{ $t('button.current_active_addon') }}
                                        </v-btn>
                                        <v-btn v-else class="btn-custom-green w-100" @click="PurchaseAddonModel(addon)"
                                            :disabled="!addon.stripe_system || !addon.fiken_system">
                                            {{ $t('column.buy_now') }}
                                        </v-btn>
                                    </div>
                                    <div class="py-3 text-center px-4 pt-1" v-if="addon.active_addon">
                                        <b-btn variant="danger" class="white--text w-100"
                                            @click="handelCancelAddonModel(addon.active_addon)"
                                            :disabled="addon.active_addon.cancelled_at">
                                            {{ $t('button.cancel_addon') }}
                                        </b-btn>
                                    </div>
                                </v-card>

                                <v-dialog v-model="addonDelete" max-width="500px">
                                    <v-card class="dialog-delete">
                                        <v-card-text>
                                            <div class="text-center confirm-delete-title">
                                                {{ $t('title.confirm_delete') }}
                                            </div>
                                            <div class="confirm-delete-text">
                                                {{ $t('message.are_you_sure_you_want_to_delete_this_item') }}
                                            </div>
                                        </v-card-text>
                                        <v-card-actions>
                                            <v-spacer />
                                            <v-btn class="btn-cancel" text @click="closeDelete">
                                                {{ $t('button.no') }}
                                            </v-btn>
                                            <v-btn class="btn-save" @click="handleCancelAddon(selectedAddonData)">
                                                {{ $t('button.yes') }}
                                            </v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                            </v-col>
                        </v-row>
                        <div v-else class="d-flex align-items-center flex-column">
                            <div>
                                <img src="~assets/images/norecordfound.png" alt="img">
                            </div>
                            <h4 class="mt-5">{{ $t('message.no_found_any_addons') }}</h4>
                        </div>
                        <PurchaseAddon v-if="isOpenAddonPopup" :open-popup="isOpenAddonPopup" :addon="selectedAddon"
                            @closePopup="isOpenAddonPopup = !isOpenAddonPopup" @reloadList="reloadAddonList" />
                    </v-container>
                </b-tab>
            </keep-alive>
        </b-tabs>
    </div>
</template>
<script>
import PurchaseAddon from '../../components/PurchaseAddon';

export default {
    components: {
        PurchaseAddon,
    },
    name: 'Addons',
    data: () => ({
        addons: [],
        selectedAddon: false,
        addonDelete: false,
        isOpenAddonPopup: false,
    }),
    computed: {},
    watch: {},
    mounted() {
        let that = this;
        that.$nextTick(() => {
            this.reloadList();
        });
    },
    methods: {
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
        PurchaseAddonModel(addon) {
            this.isOpenAddonPopup = true;
            this.selectedAddon = addon;
        },
        reloadList() {
            let that = this;
            that.$nuxt.$loading.start();
            //list addons
            that.$store.dispatch('addons/index').then(result => {
                that.addons = result.data;
                that.$nuxt.$loading.finish();
            }).catch(() => {
                that.$toaster.error(that.$i18n.t('message.fail_addon_view_detail'));
                that.$nuxt.$loading.finish();
            });
        },

        handleCancelAddon(subscription) {
            let that = this;
            that.$nuxt.$loading.start();
            that.$store.dispatch('subscriptions/addonCancel', {
                subscription_id: subscription.id
            }).then(() => {
                that.addonDelete = false;
                that.reloadAddonList();
                that.$nuxt.$loading.finish();
                that.$toaster.success(that.$i18n.t('message.success_addon_cancel'));
            }).catch((error) => {
                if (error.response.status == 401) {
                    that.$router.push('/login');
                    that.$toaster.error(that.$i18n.t('message.token_expired'));
                } else {
                    that.$toaster.error(that.$i18n.t('message.fail_addon_view_detail'));
                }
                that.$nuxt.$loading.finish();
            });
        },

        handelCancelAddonModel(subscription) {
            this.selectedAddonData = subscription;
            this.addonDelete = true;
        },

        closeDelete() {
            this.addonDelete = false;
        },
    },
};
</script>
<style scoped>
.ribon {
    left: 50%;
    top: 0;
    width: 80px;
    height: 80px;
}

.card {
    transition: 100ms;
}

.card:hover {
    transform: scale(1.02);
}

.img {
    width: 25px;
    height: 25px;
    object-fit: contain;
}

.text-green {
    color: #87a53a;
}</style>

<template>
    <div class="resources-page">
        <v-card class="mb-4 shadow card ml-6 mr-6" v-if="!settingData.stripe_system || !settingData.fiken_system">
               <div class="p-20 text-capitalize">{{ $t('message.contact_administator_for_billing') }}</div>
        </v-card>
        <b-tabs card>
            <keep-alive>
                <b-tab :title="$t('tab.plans')" active>
                    <v-container class="mt-5">
                        <v-row v-if="plans.length > 0">
                            <v-col v-for="(plan, key) in plans" :key="key" cols="3" sm:cols="6">
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
                                                    {{ plan.title }} - <span>{{ getPlanTypes(plan.plan_type) }}</span>
                                                </p>
                                                <p class="text-secondary font-weight-bold m-0 font-20">
                                                    <span class="number">Kr {{ plan.price }}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <p class="text-white p-2 opacity-25 px-4" style="background-color: #B1BFC6;">
                                            {{ $t('title.basic') }}</p>
                                        <div class="shadow-sm mb-5 bg-white rounded">
                                            <div class="mb-5  text-muted">
                                                <div class="border-bottom p-2">
                                                    {{ $t('form.total_users') }} :
                                                    {{ plan.total_users }}
                                                </div>
                                                <div class="border-bottom p-2">
                                                    {{ $t('form.user_per_storage') }} :
                                                    {{ plan.user_per_storage }} GB
                                                </div>
                                                <div class="border-bottom p-2">
                                                    {{ $t('form.additional_user_price') }} : {{ plan.additional_price }}
                                                </div>
                                                <div class="border-bottom p-2">
                                                    {{ $t('form.free_trial_months') }} : {{ plan.free_trial_months }}
                                                    Months
                                                </div>
                                            </div>
                                        </div>

                                        <p class="text-white p-2 opacity-25 px-4" style="background-color: #B1BFC6;">{{
                                            $t('title.access_modules') }}</p>
                                        <div class="shadow-sm  mb-5 bg-white rounded">
                                            <div class="mb-5 list-unstyled text-muted ">
                                                <div class="border-bottom p-2 d-flex justify-content-between">
                                                    <div>
                                                        <img src="~assets/images/icon/instructions.png" alt="instructions"
                                                            class="dark-logo img">
                                                        <span class="me-2 text-dark"></span>
                                                        {{ $t('form.instructions') }}
                                                    </div>
                                                    <span v-if="plan.plan_detail.instruction"
                                                        class="fas fa-check-circle  text-green"></span>
                                                    <span v-else class="far fa-times-circle text-secondary"></span>
                                                </div>
                                                <div class="border-bottom p-2 d-flex justify-content-between">
                                                    <div>
                                                        <img src="~assets/images/icon/risk-area.png" alt="risk_areas"
                                                            class="dark-logo img">
                                                        <span class="me-2 text-warning"></span>
                                                        {{ $t('form.risk_areas') }}
                                                    </div>
                                                    <span v-if="plan.plan_detail.risk"
                                                        class="fas fa-check-circle text-green"></span>
                                                    <span v-else class="far fa-times-circle text-secondary"></span>
                                                </div>
                                                <div class="border-bottom p-2 d-flex justify-content-between">
                                                    <div>
                                                        <img src="~assets/images/icon/deviations.png" alt="deviation"
                                                            class="dark-logo img">
                                                        <span class="me-2 text-warning"></span>
                                                        {{ $t('form.deviations') }}
                                                    </div>
                                                    <span v-if="plan.plan_detail.deviation"
                                                        class="fas fa-check-circle text-green"></span>
                                                    <span v-else class="far fa-times-circle text-secondary"></span>
                                                </div>
                                                <div class="border-bottom p-2 d-flex justify-content-between">
                                                    <div>
                                                        <img src="~assets/images/icon/checklists.png" alt="checklists"
                                                            class="dark-logo img">
                                                        <span class="me-2 text-warning"></span>
                                                        {{ $t('form.checklists') }}
                                                    </div>
                                                    <span v-if="plan.plan_detail.checklist"
                                                        class="fas fa-check-circle text-green"></span>
                                                    <span v-else class="far fa-times-circle text-secondary"></span>
                                                </div>
                                                <div class="border-bottom p-2 d-flex justify-content-between">
                                                    <div>
                                                        <img src="~assets/images/icon/routines.png" alt="routines"
                                                            class="dark-logo cust-space img">
                                                        <span class="me-2 text-warning"></span>
                                                        {{ $t('form.routines') }}
                                                    </div>
                                                    <span v-if="plan.plan_detail.routine"
                                                        class="fas fa-check-circle text-green"></span>
                                                    <span v-else class="far fa-times-circle text-secondary"></span>
                                                </div>
                                                <div class="border-bottom p-2 d-flex justify-content-between">
                                                    <div>
                                                        <img src="~assets/images/icon/documents.png" alt="documents"
                                                            class="dark-logo cust-space img">
                                                        <span class="me-2 text-warning"></span>
                                                        {{ $t('form.documents') }}
                                                    </div>
                                                    <span v-if="plan.plan_detail.document"
                                                        class="fas fa-check-circle text-green"></span>
                                                    <span v-else class="far fa-times-circle text-secondary"></span>
                                                </div>
                                                <div class="border-bottom p-2 d-flex justify-content-between">
                                                    <div>
                                                        <img src="~assets/images/icon/tasks.png" alt="tasks"
                                                            class="dark-logo cust-space img">
                                                        <span class="me-2 text-warning"></span>
                                                        {{ $t('form.tasks') }}
                                                    </div>
                                                    <span v-if="plan.plan_detail.task"
                                                        class="fas fa-check-circle text-green"></span>
                                                    <span v-else class="far fa-times-circle text-secondary"></span>
                                                </div>
                                                <div class="border-bottom p-2 d-flex justify-content-between">
                                                    <div>
                                                        <img src="~assets/images/icon/goals.png" alt="goals"
                                                            class="dark-logo cust-space img">
                                                        <span class="me-2 text-warning"></span>
                                                        {{ $t('form.goals') }}
                                                    </div>
                                                    <span v-if="plan.plan_detail.goal"
                                                        class="fas fa-check-circle text-green"></span>
                                                    <span v-else class="far fa-times-circle text-secondary"></span>
                                                </div>
                                                <div class="border-bottom p-2 d-flex justify-content-between">
                                                    <div>
                                                        <img src="~assets/images/icon/contacts.png" alt="contacts"
                                                            class="dark-logo cust-space img">
                                                        <span class="me-2 text-warning"></span>
                                                        {{ $t('form.contacts') }}
                                                    </div>
                                                    <span v-if="plan.plan_detail.contact"
                                                        class="fas fa-check-circle text-green"></span>
                                                    <span v-else class="far fa-times-circle text-secondary"></span>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div class="py-3 text-center px-4 pt-0">
                                        <v-btn v-if="plan.active_subscription" class="btn-custom-green w-100" disabled>
                                            {{ $t('button.current_active_plan') }}
                                        </v-btn>
                                          <v-btn v-else class="btn-custom-green w-100" @click="purchasePlan(plan)" :disabled="!plan.stripe_system || !plan.fiken_system">
                                            <div>{{ isActivePlan ? $t('column.change_plan') : $t('column.buy_now')}}</div>
                                        </v-btn>
                                    </div>
                                    <div class="py-3 text-center px-4 pt-1" v-if="plan.active_subscription">
                                        <b-btn variant="danger" class="white--text w-100"
                                            @click="handelCancelPlanModel(plan.active_subscription)" :disabled="plan.active_subscription.cancelled_at">
                                            {{ $t('button.cancel_plan') }}
                                        </b-btn>
                                    </div>
                                </v-card>
                                <v-dialog v-model="planDelete" max-width="500px">
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
                                            <v-btn class="btn-save" @click="handleCancelPlan(selectedPlanData)">
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
                            <h4 class="mt-5">{{ $t('message.no_found_any_plans') }}</h4>
                        </div>
                        <PurchasePlan v-if="openPopup" :open-popup="openPopup" :plan="selectedPlan"
                            @closePopup="openPopup = !openPopup" @reloadList="reloadList" />
                    </v-container>
                </b-tab>
            </keep-alive>
        </b-tabs>
    </div>
</template>
<script>


import PurchasePlan from '../../components/PurchasePlan.vue';


export default {
    components: {
        PurchasePlan
    },
    name: 'Plans',

    data: () => ({
        plans: [],
        openPopup: false,
        selectedPlan: false,
        selectedPlanData: {},
        planDelete: false,
        isActivePlan: false,
        settingData: {
            stripe_system:true,
            fiken_system:true,
        },
        isOpenOrder: false,
        orderItem: {},
        search: '',
        listArray: [],
        invoiceStatus: 0,
        status: "",
    }),

    computed: {},

    watch: {},

    mounted() {
        let that = this;
        that.$nextTick(() => {
            this.reloadList();
            this.checkSetting();
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


        closeDelete() {
            this.planDelete = false;
        },

        purchasePlan(plan) {
            this.openPopup = true;
            this.selectedPlan = plan;
        },


        handleCancelPlan(subscription) {
            let that = this;
            that.$nuxt.$loading.start();
            that.$store.dispatch('subscriptions/planCancel', {
                subscription_id: subscription.id     
            }).then(() => {
                that.planDelete = false;
                that.isActivePlan = false;
                that.reloadList();
                that.$nuxt.$loading.finish();
                that.$toaster.success(that.$i18n.t('message.success_plan_cancel'));
            }).catch((error) => {
                if (error.response.status == 401) {
                    that.$router.push('/login');
                    that.$toaster.error(that.$i18n.t('message.token_expired'));
                } else {
                    that.$toaster.error(that.$i18n.t('message.fail_plan_view_detail'));
                }
                that.$nuxt.$loading.finish();
            });
        },
        checkSetting() {
            let that = this;
            that.$store.dispatch('setting/checkDisabled').then(result => {
                that.settingData = result.data;
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
        },


        reloadList() {
            let that = this;
            that.$nuxt.$loading.start();
            //list plans
            that.$store.dispatch('plans/index').then(result => {
                that.plans = result.data;
                that.plans.forEach((plan) => {
                    if (plan.active_subscription) that.isActivePlan = true;
                })
                that.$nuxt.$loading.finish();
            }).catch((error) => {
                if(error.response.status == 401){
                    that.$router.push('/login');
                    that.$toaster.error(that.$i18n.t('message.token_expired'));
                } else {
                    that.$toaster.error(that.$i18n.t('message.fail_plan_view_detail'));
                }
                that.$nuxt.$loading.finish();
            });
        },

        handelCancelPlanModel(subscription){
            this.selectedPlanData=subscription;
            this.planDelete = true;
        },
    },
};
</script>
<style scoped>
.ribon {
    left: 50%;
    top: 0;
    /* transform: translate(-50%, -50%); */
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
}
</style>

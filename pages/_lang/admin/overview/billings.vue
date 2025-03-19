<template>
    <div class="resources-page">
        <v-btn v-if="tabIndex === 0" class="mb-2 btn-create btn-custom-green" @click="handlePlanCreate" :disabled="!settingData.stripe_system || !settingData.fiken_system">
            {{ $t('button.add_plan') }}
        </v-btn>
        <v-btn v-else-if="tabIndex === 1" class="mb-2 btn-create btn-custom-green" @click="handleAddonCreate" :disabled="!settingData.stripe_system || !settingData.fiken_system">
            {{ $t('button.add_addon') }}
        </v-btn>
        <v-btn v-else class="mb-2 btn-create btn-custom-green" @click="handleCouponCreate">
            {{ $t('button.add_coupon') }}
        </v-btn>

        <v-card class="mb-4 shadow  ml-6 mr-6" v-if="!settingData.stripe_system || !settingData.fiken_system">
              <div class="d-flex justify-content-between">
                  <div class="p-20 text-capitalize">{{ $t('message.require_stripe_fiken_configration') }}</div>
                  <v-btn class="mt-3 mr-3 btn-custom-green">
                      <nuxt-link :to="'/' + $i18n.locale + '/admin/overview/setting'" style="text-decoration: none;">
                           <span class="link-menu-title text-white text-capitalize mr-2" >{{ $t('title.click_here')}}</span>
                           <img src="~assets/images/icon/click.png" alt="dashboard">
                       </nuxt-link>
                  </v-btn>
              </div>
        </v-card>

        <b-tabs v-model="tabIndex" card>
            <keep-alive>
                <b-tab :title="$t('tab.plans')" active>
                    <v-container class="mt-5">
                        <v-row v-if="plans.length > 0">
                            <v-col v-for="(plan, key) in plans" :key="key" cols="3" sm:cols="6">
                                <a @click="handleEdit(plan.id)" href="javascript:void(0)" class="text-decoration-none">
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
                                                            <span class="  me-2 text-dark"></span>
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
                                                            <img src="~assets/images/icon/documents.png"
                                                                alt="documents" class="dark-logo cust-space img">
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
                                    </v-card>
                                </a>
                            </v-col>
                        </v-row>
                        <div v-else class="d-flex align-items-center flex-column">
                            <div>
                                <img src="~assets/images/norecordfound.png" alt="img">
                            </div>
                            <h4 class="mt-5">{{ $t('message.no_found_any_plans') }}</h4>
                        </div>
                        <!-- Add new -->
                        <PlanPopup @reloadList="reloadList" :current-id="currentPlanId" :open-popup="checkPlanAddNew"
                            @closePopup="checkPlanAddNew = !checkPlanAddNew" />
                    </v-container>
                </b-tab>
            </keep-alive>
            <keep-alive>
                <b-tab :title="$t('tab.addons')" @click="addonListing">
                    <v-container>
                        <v-row v-if="addonList.length > 0">
                            <v-col v-for="(addon, key) in addonList" :key="key" cols="3" sm:cols="6">
                                <a @click="handleAddonEdit(addon.id)" href="javascript:void(0)"
                                    class="text-decoration-none">
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
                                                    <div class="border-bottom p-2">
                                                        <span class="fas fa-check-circle text-green pr-2"></span>
                                                        {{ $t('column.storage') }} :
                                                        {{ addon.volume }} GB
                                                    </div>

                                                </div>
                                            </div>

                                        </div>
                                    </v-card>
                                </a>
                            </v-col>
                        </v-row>
                        <div v-else class="d-flex align-items-center flex-column">
                            <div>
                                <img src="~assets/images/norecordfound.png" alt="img">
                            </div>
                            <h4 class="mt-5">{{ $t('message.no_found_any_addons') }}</h4>
                        </div>
                        <!-- Add new -->

                        <Addon @reloadList="reloadListAddon" :current-id="currentAddonId" :open-popup="checkaddonModule"
                            @closePopup="checkaddonModule = !checkaddonModule" />
                    </v-container>
                </b-tab>
            </keep-alive>
            <keep-alive>
                <b-tab :title="$t('tab.coupons')" @click="couponListing">
                    <v-container>
                        <!-- Add new -->
                        <CouponPopup :open-popup="checkCouponAddNew" :edited-item="editedItem"
                            @closePopup="checkCouponAddNew = !checkCouponAddNew" @reloadList="reloadListCoupon" />

                        <!-- Table -->
                        <v-data-table :headers="headerCoupon" :items="filteredCouponItems"
                            class="elevation-1 hse-table table-data" :items-per-page="10" :single-expand="true"
                            :search="search" :sort-by="['created_at']" :sort-desc="[true, false]"
                            @click:row="handleCouponEdit">
                            <template v-slot:top>
                                <div class="setting-header">
                                    <div class="panel-heading">
                                        <h4 class="panel-title">
                                            {{ $t('title.sort_by') }}
                                        </h4>
                                        <b-row>
                                            <b-col cols="6">
                                                <div class="field-selection">
                                                    <v-select v-model="company" item-text="name" item-value="id"
                                                        :items="companyArray" :label="$t('setting.company')" outlined
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

                            <template v-slot:header>
                                <h4 class="table-name">
                                    {{ $t('table.coupons') }}
                                </h4>
                            </template>

                            <template v-slot:no-data>
                                {{ $t('table.no_data') }}
                            </template>

                        </v-data-table>
                    </v-container>
                </b-tab>
            </keep-alive>
        </b-tabs>
    </div>
</template>
<script>
import PlanPopup from '../../../../components/PlanPopup';
import CouponPopup from "../../../../components/CouponPopup.vue";
import Addon from '../../../../components/AddonPopup';
import { _ } from 'vue-underscore';

export default {
    name: 'Plans',
    components: {
        PlanPopup,
        CouponPopup,
        Addon
    },

    data: () => ({
        tabIndex: 0,
        plans: [],
        companyArray: [],
        listArray: [],
        addonList: [],
        company: 0,
        search: '',
        companiesDefault: {
            id: 0,
            name: "All"
        },
        editedItem: null,
        settingData: {
            stripe_system:true,
            fiken_system:true,
        },
        currentPlanId: null,
        currentAddonId: null,
        checkPlanAddNew: false,
        checkCouponAddNew: false,
        checkaddonModule: false
    }),

    computed: {
        headerCoupon() {
            return [{
                text: this.translateCol('name'),
                align: 'left',
                value: 'name'
            },
            {
                text: this.translateCol('discount'),
                align: 'center',
                value: 'discount'
            },
            {
                text: this.translateCol('code'),
                align: 'center',
                value: 'code'
            },
            {
                text: this.translateCol('company'),
                align: 'center',
                value: 'company.name'
            },
            ];
        },

        filteredCouponItems() {
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
            }).catch(() => {
                that.$nuxt.$loading.finish();
            });
            this.reloadList();
            this.checkSetting();
        });
    },

    methods: {
        translateCol(colName) {
            return this.$i18n.t('column.' + colName);
        },

        handlePlanCreate() {
            this.currentPlanId = null;
            this.checkPlanAddNew = true;
        },

        handleEdit(planId) {
            this.currentPlanId = planId;
            this.checkPlanAddNew = true;
        },

        handleCouponCreate() {
            this.editedItem = null;
            this.checkCouponAddNew = true;
        },

        handleCouponEdit(couponId) {
            this.editedItem = couponId;
            this.checkCouponAddNew = true;
        },

        handleAddonCreate() {
            this.currentAddonId = null;
            this.checkaddonModule = true;
        },

        handleAddonEdit(addonId) {
            this.currentAddonId = addonId;
            this.checkaddonModule = true;
        },

        getPlanTypes(planId) {
            switch (planId) {
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

        reset() {
            setTimeout(() => {
                this.reportItem = Object.assign({}, this.reportDefault);
                this.$refs.form.reset();
                this.$refs.form.resetValidation();
            }, 100);
        },

        addonListing() {
            this.reloadListAddon();
        },
        couponListing() {
            this.reloadListCoupon();
        },

        reloadList() {
            let that = this;
            that.$nuxt.$loading.start();
            //list plans
            that.$store.dispatch('plans/index').then(result => {
                that.plans = result.data;
                that.$nuxt.$loading.finish();
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

        reloadListCoupon() {
            let that = this;
            // get list
            that.$store.dispatch('coupon/index').then(result => {
                that.listArray = result.data;
                that.$nuxt.$loading.finish();
            }).catch((error) => {
                if (error.response.status == 401) {
                    that.$router.push('/login');
                    that.$toaster.error(that.$i18n.t('message.token_expired'));
                } else {
                    that.$toaster.error(that.$i18n.t('message.fail_coupon_view'));
                }
                that.$nuxt.$loading.finish();
            });
        },

        reloadListAddon() {
            let that = this;
            // get list
            that.$store.dispatch('addons/index').then(result => {
                that.addonList = result.data;
                that.$nuxt.$loading.finish();
            }).catch((error) => {
                if (error.response.status == 401) {
                    that.$router.push('/login');
                    that.$toaster.error(that.$i18n.t('message.token_expired'));
                } else {
                    that.$toaster.error(that.$i18n.t('message.fail_addon_view'));
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
}
</style>

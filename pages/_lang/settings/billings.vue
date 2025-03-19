<template>
    <div class="resources-page">
        <v-btn v-if="tabIndex === 3" class="mb-2 btn-create btn-custom-green" @click="handleCardCreate">
            {{ $t('button.add_card') }}
        </v-btn>
        <v-card class="mb-4 shadow card ml-6 mr-6" v-if="!settingData.stripe_system || !settingData.fiken_system">
               <div class="p-20 text-capitalize">{{ $t('message.contact_administator_for_billing') }}</div>
        </v-card>
        <b-tabs v-model="tabIndex" card>
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
                                            <div class="mb-2" v-if="plan.plan_deleted">
                                                <div class="p-2 font-weight-bold text-center text-secondary">
                                                    {{ $t('message.plan_deleted_by_admin') }} <br>
                                                    {{ $t('message.plan_change_before_plan_expire_date')}}<br>
                                                    {{moment(plan.active_subscription.billed_at).format('DD-MM-YYYY') }}
                                                </div>
                                            </div>

                                            <div class="mb-2" v-if="plan.active_subscription?.cancelled_at && !plan.plan_deleted">
                                                <div class="p-2 font-weight-bold text-center text-secondary">
                                                    {{ $t('message.plan_change_before_plan_expire_date') }}<br>
                                                    {{ moment(plan.active_subscription.billed_at).format('DD-MM-YYYY') }}
                                                </div>
                                            </div>
                                        <v-btn v-if="plan.active_subscription" class="btn-custom-green w-100 text-capitalize" disabled>
                                            {{ $t('button.current_active_plan') }}
                                        </v-btn>
                                          <v-btn v-else class="btn-custom-green w-100 text-capitalize" @click="purchasePlan(plan)" :disabled="!plan.stripe_system || !plan.fiken_system">
                                            <div>{{ isActivePlan ? $t('column.change_plan') : $t('column.buy_now')}}</div>
                                        </v-btn>
                                    </div>
                                    <div class="py-3 text-center px-4 pt-1" v-if="plan.active_subscription && !plan.active_subscription?.cancelled_at">
                                        <b-btn variant="danger" class="white--text w-100 text-capitalize"
                                            @click="handelCancelPlanModel(plan.active_subscription)">
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
                                            <v-btn class="btn-save" @click="handleCancelPlan(selectedPlanId)">
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
            <keep-alive>
                <b-tab :title="$t('tab.addons')" @click="addonListing">
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
                                    </div>
                                    <div class="py-3 text-center px-4 pt-0">
                                        <div class="mb-2" v-if="addon.addon_deleted">
                                                <div class="p-2 font-weight-bold text-center text-secondary">
                                                    {{ $t('message.addon_deleted_by_admin') }} <br>
                                                    {{ $t('message.addon_change_before_addon_expire_date')}} <br>
                                                    {{ moment(addon.active_addon.billed_at).format('DD-MM-YYYY') }}
                                                </div>
                                            </div>
                                        <v-btn v-if="addon.active_addon" class="btn-custom-green w-100 text-capitalize" disabled>
                                            {{ $t('button.current_active_addon') }}
                                        </v-btn>
                                        <v-btn v-else class="btn-custom-green w-100 text-capitalize" @click="purchaseAddon(addon)" :disabled="!addon.stripe_system || !addon.fiken_system">
                                            {{ $t('column.buy_now') }}
                                        </v-btn>
                                    </div>
                                    <div class="py-3 text-center px-4 pt-1" v-if="addon.active_addon && !addon.addon_deleted">
                                        <b-btn variant="danger" class="white--text w-100 text-capitalize" :style="addon.active_addon.cancelled_at ? 'pointer-events: none;' : ''" 
                                            @click="handelCancelAddonModel(addon.active_addon)" :disabled="!!addon.active_addon.cancelled_at">
                                            {{ $t('button.cancel_addon') +' ' }}
                                            <span v-if="!!addon.active_addon.cancelled_at">
                                                {{  moment(addon.active_addon.billed_at).format('DD-MM-YYYY') }}
                                            </span>
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
                                            <v-btn class="btn-save" @click="handleCancelAddon(selectedAddonId)">
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
            <keep-alive>
                <b-tab :title="$t('tab.orders')" :active="this.$route.query.type === 'plan_subscription' || this.$route.query.type === 'addon_subscription'" @click="orderListing">
                    <v-container>
                        <!-- Table -->
                        <v-data-table :headers="headers" :items="filteredItems" class="elevation-1 hse-table table-data"
                            :items-per-page="15" :single-expand="true" :search="search" :sort-by="['created_at']"
                            :sort-desc="[true, false]" @click:row="handleOrderOpen">


                            <template v-slot:header>
                                <h4 class="table-name">
                                    {{ $t('table.orders') }}
                                </h4>
                            </template>
                            <template v-slot:item.users="{ item }">
                                {{ item.user ? item.user?.first_name : null }}
                            </template>
                            <template v-slot:item.created_at="{ item }">
                                {{ moment(item.created_at).format('DD.MM.YYYY') }}
                            </template>

                            <template v-slot:no-data>
                                {{ $t('table.no_data') }}
                            </template>

                        </v-data-table>
                        <!-- Add new -->
                        <OrderPopup v-if="isOpenOrder" :open-popup="isOpenOrder" :order-id="orderId" :purchase-type="purchaseType"
                            @closePopup="isOpenOrder = !isOpenOrder" />
                    </v-container>
                </b-tab>
            </keep-alive>
            <keep-alive>
                <b-tab :title="$t('tab.cards')" @click="cardListing">
                    <v-container>
                        <div v-if="cards.length > 0">
                            <div class="d-flex flex-wrap" style="gap:1rem">
                                <!-- Table -->
                                <div v-for="(card, key) in cards" :key="key">
                                    <v-card elevation="3" class="shadow position-relative" width="380" height="130">
                                        <!-- <v-card-item> -->
                                            <div>
                                                <div class="d-flex p-4 justify-content-between align-items-center">
                                                    <div class="font-weight-bold text-muted">
                                                        <span>{{ card?.user?.first_name }} {{ card?.user?.last_name}}</span>
                                                    </div>
                                                    <div>
                                                        <span> Expries </span>
                                                        <span>{{ card?.exp_month }}/{{ card?.exp_year }}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div class="d-flex justify-content-evenly text-muted p-1">
                                                            <span class="px-4 text-h6">
                                                                ####
                                                            </span>
                                                            <span class="px-4 text-h6">
                                                                ####
                                                            </span>
                                                            <span class="px-4 text-h6">
                                                                ####
                                                            </span>
                                                            <span class="px-4 text-h5">
                                                                {{ card?.last4 }}
                                                            </span>
                                                        </div>
                                                </div>
                                            </div>
                                        <!-- </v-card-item> -->
                                    </v-card>
                                    <div class="d-flex align-items-center mt-2 flex-wrap justify-space-between"
                                        style="gap: 1rem;">
                                        <!-- <v-spacer /> -->

                                        <v-btn v-if="cards.length > 1 && card.status == 1" class="btn-custom-green"
                                            @click="handelActiveCardModel(card)">
                                            {{ $t('button.set_primary') }}
                                        </v-btn>
                                        <v-btn v-if="card.status == 2" class="btn-custom-green" disabled>
                                            {{ $t('button.primary') }}
                                        </v-btn>
                                        <b-btn v-if="cards.length > 1 && card.status == 1" class="white--text"
                                            variant="danger" text @click="handelCancelCardModel(card)">
                                            {{ $t('button.delete') }}
                                        </b-btn>
                                    </div>
                                </div>
                            </div>

                            <v-dialog v-model="cardDelete" max-width="500px">
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
                                        <v-btn class="btn-save" @click="handleCancelCard(selectedCardData)">
                                            {{ $t('button.yes') }}
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>

                            <v-dialog v-model="cardActive" max-width="500px">
                                <v-card class="dialog-delete">
                                    <v-card-text>
                                        <div class="text-center confirm-delete-title">
                                            {{ $t('title.confirm_modal') }}
                                        </div>
                                        <div class="confirm-delete-text">
                                            {{ $t('message.do_you_want_to_primary_card') }}
                                        </div>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer />
                                        <v-btn class="btn-cancel" text @click="closeDelete">
                                            {{ $t('button.no') }}
                                        </v-btn>
                                        <v-btn class="btn-save" @click="handleActiveCard(selectedCardData)">
                                            {{ $t('button.yes') }}
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </div>
                        <div v-else class="d-flex align-items-center flex-column">
                            <div>
                                <img src="~assets/images/norecordfound.png" alt="img">
                            </div>
                            <h4 class="mt-5">{{ $t('message.no_found_any_cards') }}</h4>
                        </div>

                        <!-- Add new -->
                        <CardPopup :open-popup="checkCardAddNew" @closePopup="checkCardAddNew = !checkCardAddNew"
                            @reloadList="reloadCardList" />

                    </v-container>
                </b-tab>
            </keep-alive>
        </b-tabs>
    </div>
</template>
<script>

import OrderPopup from '../../../components/OrderPopup.vue';
import PurchasePlan from '../../../components/PurchasePlan.vue';
import PurchaseAddon from '../../../components/PurchaseAddon.vue';
import CardPopup from '../../../components/CardPopup.vue';

export default {
    components: {
        PurchasePlan,
        PurchaseAddon,
        OrderPopup,
        CardPopup
    },
    name: 'Plans',

    data: () => ({
        tabIndex: 0,
        plans: [],
        openPopup: false,
        selectedPlan: false,
        selectedPlanId: '',
        selectedAddonId: '',
        selectedCardData: {},
        planDelete: false,
        isActivePlan: false,
        settingData: {
            stripe_system:true,
            fiken_system:true,
        },
        addons: [],
        isOpenOrder: false,
        orderId: '',
        purchaseType: '',
        isOpenAddonPopup: false,
        selectedAddon: false,
        addonDelete: false,
        cardDelete: false,
        cardActive: false,
        checkCardAddNew: false,
        search: '',
        listArray: [],
        cards: [],
        invoiceStatus: 0,
        status: "",
        statusArray: [
            {
                id: 0,
                name: "All"
            },
            {
                id: 1,
                name: "Plan"
            },
            {
                id: 2,
                name: "Addon"
            },
        ]
    }),

    computed: {
        headers() {
            return [

                {
                    text: this.translateCol('title'),
                    value: 'title',
                    align: 'left'
                },
                {
                    text: this.translateCol('description'),
                    value: 'description',
                    align: 'center'
                },
                {
                    text: this.translateCol('users'),
                    value: 'users',
                    align: 'center'
                },
                {
                    text: this.translateCol('created_at'),
                    value: 'created_at',
                    align: 'center'
                },

            ];
        },
        filteredItems() {
            let that = this;
            return that.listArray.filter((item) => {
                // return item
                return that.invoiceStatus === 0 || (item.plan_id ? 1 : 2 === that.invoiceStatus);
            });
        },
    },

    watch: {},

    created() {
        if (this.$route.query.id) {
        this.orderId = this.$route.query.id;
        this.purchaseType = this.$route.query.type;
        this.isOpenOrder = true;
        }
    },

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

        translateCol(colName) {
            return this.$i18n.t('column.' + colName);
        },

        handleCardCreate() {
            this.editedItem = null;
            this.checkCardAddNew = true;
        },

        handleOrderOpen(item) {
            this.orderId = item.id;
            this.isOpenOrder = true;
        },

        closeDelete() {
            this.planDelete = false;
            this.addonDelete = false;
            this.cardDelete = false;
            this.cardActive = false;
        },

        purchasePlan(plan) {
            this.openPopup = true;
            this.selectedPlan = plan;
        },

        purchaseAddon(addon) {
            this.isOpenAddonPopup = true;
            this.selectedAddon = addon;
        },

        cancelCard(cardId) {
            this.isOpenAddonPopup = true;
            this.selectedAddon = cardId;
        },

        addonListing() {
            this.reloadAddonList();
        },
        orderListing() {
            this.reloadOrderList();
        },
        cardListing() {
            this.reloadCardList();
        },

        handleCancelPlan(subscriptionId) {
            let that = this;
            that.$nuxt.$loading.start();
            that.$store.dispatch('subscriptions/planCancel', {
                subscription_id: subscriptionId
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

        handleCancelAddon(subscriptionId) {
            let that = this;
            that.$nuxt.$loading.start();
            that.$store.dispatch('subscriptions/addonCancel', {
                subscription_id: subscriptionId
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

        handleCancelCard(card) {
            let that = this;
            that.$nuxt.$loading.start();
            that.$store.dispatch('cards/destroy', card.id).then(() => {
                that.cardDelete = false;
                that.reloadCardList();
                that.$nuxt.$loading.finish();
                that.$toaster.success(that.$i18n.t('message.success_card_cancel'));
            }).catch((error) => {
                if (error.response.status == 401) {
                    that.$router.push('/login');
                    that.$toaster.error(that.$i18n.t('message.token_expired'));
                } else {
                    that.$toaster.error(that.$i18n.t('message.fail_card_view_detail'));
                }
                that.$nuxt.$loading.finish();
            });
        },

        handleActiveCard(card) {
            let that = this;
            that.$nuxt.$loading.start();
            that.$store.dispatch('cards/active', {
                card_id: card.id
            }).then(() => {
                that.cardActive = false;
                that.reloadCardList();
                that.$nuxt.$loading.finish();
                that.$toaster.success(that.$i18n.t('message.success_card_active'));
            }).catch((error) => {
                if (error.response.status == 401) {
                    that.$router.push('/login');
                    that.$toaster.error(that.$i18n.t('message.token_expired'));
                } else {
                    that.$toaster.error(that.$i18n.t('message.fail_card_view_detail'));
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
                if (error.response.status == 401) {
                    that.$router.push('/login');
                    that.$toaster.error(that.$i18n.t('message.token_expired'));
                } else {
                    that.$toaster.error(that.$i18n.t('message.fail_plan_view_detail'));
                }
                that.$nuxt.$loading.finish();
            });
        },

        reloadAddonList() {
            let that = this;
            that.$nuxt.$loading.start();
            that.$store.dispatch('addons/index').then(result => {
                that.addons = result.data;
                that.$nuxt.$loading.finish();
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

        reloadOrderList() {
            let that = this;
            // get list
            that.$store.dispatch('billings/history').then(result => {
                that.listArray = result.data;
                that.$nuxt.$loading.finish();
            }).catch((error) => {
                if (error.response.status == 401) {
                    that.$router.push('/login');
                    that.$toaster.error(that.$i18n.t('message.token_expired'));
                } else {
                    that.$toaster.error(that.$i18n.t('message.fail_orders_view'));
                }
                // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
                that.$nuxt.$loading.finish();
            });
        },

        reloadCardList() {
            let that = this;
            // get list
            that.$store.dispatch('cards/index').then(result => {
                that.cards = result.data;
                that.$nuxt.$loading.finish();
            }).catch((error) => {
                if (error.response.status == 401) {
                    that.$router.push('/login');
                    that.$toaster.error(that.$i18n.t('message.token_expired'));
                } else {
                    that.$toaster.error(that.$i18n.t('message.fail_card_view_detail'));
                }
                // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
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

        handelCancelPlanModel(subscription) {
            this.selectedPlanId = subscription.id;
            this.planDelete = true;
        },
        handelCancelAddonModel(subscription) {
            this.selectedAddonId = subscription.id;
            this.addonDelete = true;
        },
        handelCancelCardModel(card) {
            this.selectedCardData = card;
            this.cardDelete = true;
        },
        handelActiveCardModel(card) {
            this.selectedCardData = card;
            this.cardActive = true;
        }
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

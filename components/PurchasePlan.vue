<template>
    <div>
        <div>
            <div v-if="isLoading" class="loader-opacity"></div>
            <v-dialog v-if="!isOpenThankYouPopup" v-model="openPopup" max-width="1130px" persistent>
                <v-card>
                    <v-card-text class="pb-0">
                        <div class="row">
                            <div class="col-9 col-xl-6 mt-4">
                                <v-container class="d-flex flex-column bg-surface-variant" style="gap: 2rem;">
                                    <v-card elevation="1">
                                        <div style="background-color: #f1f1f1;" class="px-3">
                                            <div class="p-3 text-uppercase header-text">
                                                {{ $t('column.plan_details') }}
                                            </div>
                                        </div>
                                        <v-card-text class="text--lighten-3">
                                            <div>
                                                <div class="col-12 bg-white rounded">
                                                    <div class="row">
                                                        <div class="col-4 text-uppercase">
                                                            {{ $t('column.name') }}
                                                        </div>
                                                        <div class="col-3 font-weight-bold text-capitalize text-secondary">
                                                            {{ plan.title }}
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-4 text-uppercase">
                                                            {{ $t('column.amount') }}
                                                        </div>
                                                        <div class="col-3 font-weight-bold">
                                                            <span style="background-color: #87A53A4D" class="rounded px-2 py-1">
                                                                Kr {{ plan.price }}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-4 text-uppercase">
                                                            {{ $t('column.frequency') }}
                                                        </div>
                                                        <div class="col-3 font-weight-bold text-secondary">
                                                            {{ getPlanTypes(plan.plan_type) }}
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-4 text-uppercase">
                                                            {{ $t('message.free_trial_months') }}
                                                        </div>
                                                        <div class="col-3 font-weight-bold text-secondary">
                                                            {{ plan.free_trial_months }} (Months)
                                                        </div>
                                                    </div>
                                                </div>
                                                <hr>
                                                <b-col cols="12">
                                                    <h6 class="text-uppercase" style="color: #808080;">{{ $t('title.access_modules')
                                                    }}</h6>
                                                </b-col>
                                                <v-card elevation="1">
                                                    <v-card-text class="text--lighten-3">
                                                        <div class="d-flex flex-wrap p-0" style="gap:15px;">
                                                            <div class="p-2 d-flex align-items-center border rounded basis"
                                                                v-if="plan.plan_detail.instruction">
                                                                <img src="~assets/images/icon/instructions.png"
                                                                    alt="deviation" class="dark-logo img">
                                                                <div class="ml-1">{{
                                                                    $t('form.instructions') }}</div>
                                                            </div>
                                                            <div class="p-2 d-flex align-items-center border rounded basis"
                                                                v-if="plan.plan_detail.risk">
                                                                <img src="~assets/images/icon/risk-area.png" alt="deviation"
                                                                    class="dark-logo img">
                                                                <div class="ml-2">{{
                                                                    $t('form.risk_areas') }}</div>
                                                            </div>
                                                            <div class="p-2 border d-flex rounded align-items-center basis"
                                                                v-if="plan.plan_detail.deviation">
                                                                <img src="~assets/images/icon/deviations.png"
                                                                    alt="deviation" class="dark-logo img">
                                                                <div class="ml-2">{{
                                                                    $t('form.deviations') }}</div>
                                                            </div>

                                                            <div class="p-2 border rounded d-flex align-items-center basis"
                                                                v-if="plan.plan_detail.routine">
                                                                <img src="~assets/images/icon/routines.png" alt="deviation"
                                                                    class="dark-logo img">
                                                                <div class="ml-2">{{
                                                                    $t('form.routines') }}</div>
                                                            </div>
                                                            <div class="p-2 border rounded d-flex align-items-center basis"
                                                                v-if="plan.plan_detail.document">
                                                                <img src="~assets/images/icon/documents.png" alt="deviation"
                                                                    class="dark-logo img">
                                                                <div class="ml-2">{{
                                                                    $t('form.documents') }}</div>
                                                            </div>
                                                            <div class="p-2 border rounded d-flex align-items-center basis"
                                                                v-if="plan.plan_detail.checklist">
                                                                <img src="~assets/images/icon/checklists.png"
                                                                    alt="deviation" class="dark-logo img">
                                                                <div class="ml-2">{{
                                                                    $t('form.checklists') }}</div>
                                                            </div>
                                                            <div class="p-2 border rounded d-flex align-items-center basis"
                                                                v-if="plan.plan_detail.task">
                                                                <img src="~assets/images/icon/tasks.png" alt="tasks"
                                                                    class="dark-logo img">
                                                                <div class="ml-2">{{ $t('form.tasks')
                                                                }}</div>
                                                            </div>
                                                            <div class="p-2 border rounded d-flex align-items-center basis"
                                                                v-if="plan.plan_detail.goal">
                                                                <img src="~assets/images/icon/goals.png" alt="deviation"
                                                                    class="dark-logo img">
                                                                <div class="ml-2">{{ $t('form.goals')
                                                                }}</div>
                                                            </div>
                                                            <div class="p-2 border rounded d-flex align-items-center basis"
                                                                v-if="plan.plan_detail.contact">
                                                                <img src="~assets/images/icon/contacts.png" alt="contacts"
                                                                    class="dark-logo img">
                                                                <div class="ml-2">{{
                                                                    $t('form.contacts') }}</div>
                                                            </div>
                                                        </div>
                                                    </v-card-text>
                                                </v-card>

                                            </div>
                                        </v-card-text>
                                    </v-card>
                                </v-container>
                            </div>
                            <div class="col-9 col-xl-6 mt-4">
                                <v-container class="d-flex flex-column bg-surface-variant" style="gap: 2rem;">
                                    <v-card elevation="1">
                                        <div class="border">
                                            <div class="d-flex align-items-center">
                                                <div class="font-weight-bold col-7 text-secondary px-8">
                                                    {{ $t('title.have_coupon_code') }} </div>
                                                <div class="switch-component">
                                                    <v-switch @change="handleCoupon" v-model="is_coupon" inset
                                                        class="right-text" />
                                                </div>
                                            </div>
                                            <b-row v-if="is_coupon">
                                                <b-col cols="12" v-if="!is_successCoupon">
                                                    <v-form ref="form">
                                                        <div class="input-wrap mt-2 d-flex px-4">
                                                            <v-text-field v-model="coupon" :label="$t('column.coupon')" outlined />
                                                            <v-btn class="btn-save my-3 mx-2" @click="cardApply"
                                                                :disabled="couponAppliedBtnDisable">
                                                                {{ $t('column.apply') }}
                                                            </v-btn>
                                                        </div>
                                                    </v-form>
                                                    <div style="color: red;" class="d-flex justify-content-center p-2">{{
                                                        couponError }}</div>
                                                </b-col>
                                                <b-col v-else cols="12" class="px-8 p-4">
                                                    <div class="text-center border rounded text-white p-2 mb-2"
                                                        v-if="couponSuccess" style="background-color: #87A53A;">
                                                        <span>{{ couponSuccess }}</span>
                                                        <span class="ml-3 border rounded p-1">{{ couponCode }}
                                                            <span class="ml-4">
                                                                <i class="fa fa-window-close" aria-hidden="true"
                                                                    @click="couponClose"></i>
                                                            </span>
                                                        </span>
                                                    </div>
                                                </b-col>
                                            </b-row>
                                        </div>
                                    </v-card>
                                    <v-card elevation="1">
                                        <div class="border">
                                            <div class="d-flex align-items-center">
                                                <div class="font-weight-bold col-7 text-secondary px-8">
                                                    {{ $t('column.additional_user') }}
                                                </div>
                                                <div class="switch-component">
                                                    <v-switch @change="handleAdditional" v-model="is_additionalUsers" inset
                                                        class="right-text" />
                                                </div>
                                            </div>
                                            <b-row v-if="is_additionalUsers">
                                                <b-col cols="12">
                                                    <div class="input-wrap mt-2 px-4">
                                                        <v-text-field @keypress="onlyNumber" v-model="additional_users"
                                                            :label="$t('column.additional_user')" outlined />
                                                    </div>
                                                </b-col>
                                            </b-row>
                                        </div>
                                    </v-card>

                                    <v-card elevation="1">
                                        <div style="background-color: #f1f1f1;" class="px-3">
                                            <div class="p-3 text-uppercase header-text">
                                                {{ $t('title.order_summary') }}
                                            </div>
                                        </div>
                                        <v-card-text class="text--lighten-3">
                                            <div class="col-12 bg-white rounded ">
                                                <div class="row">
                                                    <div class="font-weight-bold col-9 text-secondary">
                                                        {{ $t('column.total_price') }}
                                                    </div>
                                                    <div class="col-3">
                                                        <span>Kr</span>
                                                        {{ getTotalPrice }}
                                                    </div>
                                                </div>

                                                <div class="row" v-if="is_successCoupon">
                                                    <div class="font-weight-bold col-6 text-secondary">
                                                        {{ $t('column.discount') }}
                                                    </div>
                                                    <div class="col-3">
                                                        <span style="background-color: #87A53A4D;" class="rounded p-1"> -
                                                            {{ discount_percentage }} % </span>
                                                    </div>
                                                    <div class="col-3">
                                                        <span>Kr</span>
                                                        {{ discount ? discount : 0 }}
                                                    </div>
                                                </div>
                                                <div class="row" v-if="additional_users > 0">
                                                    <div class="font-weight-bold col-9 text-secondary">
                                                        {{ $t('column.additional_price') }}
                                                    </div>
                                                    <div class="col-3">
                                                        <span>Kr</span>
                                                        {{ getAdditionalUserPrice }}
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="font-weight-bold col-9 text-secondary">
                                                        {{ $t('column.vat') }} <span style="background-color: #87A53A4D"
                                                            class="rounded p-1"> {{ vat }} % </span>
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
                                                    <div class="col-3 font-weight-bold text-dark">
                                                        <span>Kr</span>
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
                                                            <a class="mt-2 text-secondary h6" style="color: #808080;">{{ $t('title.terms_condition')
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
        </div>
        <div>
            <v-dialog v-model="isOpenThankYouPopup" max-width="827px" persistent>
                <v-card>
                    <div class="p-4 px-8">
                        <div class="btn-save p-2 rounded text-center white--text w-100 font-weight-bold text-uppercase">
                            {{ $t('title.purchase') }}
                        </div>
                    </div>
                    <v-card-text>
                        <div class="row">
                            <div class="col-9 col-xl-6 mt-1">
                                <v-container class="d-flex flex-column bg-surface-variant" style="gap: 2rem;">
                                    <v-card elevation="1">
                                        <div style="background-color: #f1f1f1;" class="px-3">
                                            <div class="p-3 text-uppercase header-text">
                                                {{ $t('column.plan_details') }}
                                            </div>
                                        </div>
                                        <v-card-text class="text--lighten-3 pt-0" >
                                            <div>
                                                <div class="col-12 bg-white rounded">
                                                    <div class="row">
                                                        <div class="col-8 text-uppercase">
                                                            {{ $t('column.name') }}
                                                        </div>
                                                        <div class="col-4 font-weight-bold text-dark text-capitalize">
                                                            {{ plan.title }}
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-8 text-uppercase">
                                                            {{ $t('column.amount') }}
                                                        </div>
                                                        <div class="col-4 font-weight-bold text-dark">
                                                            <span style="background-color: #87A53A4D;" class="rounded px-2 py-1">
                                                                Kr {{ plan.price }}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-8 text-uppercase">
                                                            {{ $t('column.frequency') }}
                                                        </div>
                                                        <div class="col-4 font-weight-bold text-dark">
                                                            {{ getPlanTypes(plan.plan_type) }}
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-8 text-uppercase">
                                                            {{ $t('message.free_trial_months') }}
                                                        </div>
                                                        <div class="col-4 font-weight-bold text-dark">
                                                            {{ plan.free_trial_months }} (Months)
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
                                        <div class="d-flex justify-content-center p-3 text-uppercase header-text">
                                                {{$t('title.access_modules')}}
                                        </div>
                                    </div>
                                    <v-card-text class="text--lighten-3">
                                        <div class="d-flex flex-wrap p-1" style="gap:16px;">
                                            <div class="p-2 d-flex align-items-center border rounded justify-content-center  basis_left"
                                                v-if="plan.plan_detail.instruction">
                                                <img src="~assets/images/icon/instructions.png" alt="deviation"
                                                    class="dark-logo img">
                                                <div class="ml-1">{{
                                                    $t('form.instructions') }}</div>
                                            </div>
                                            <div class="p-2 d-flex align-items-center border rounded justify-content-center basis_left"
                                                v-if="plan.plan_detail.risk">
                                                <img src="~assets/images/icon/risk-area.png" alt="deviation"
                                                    class="dark-logo img">
                                                <div class="ml-2">{{
                                                    $t('form.risk_areas') }}</div>
                                            </div>
                                            <div class="p-2 border d-flex rounded align-items-center justify-content-center basis_left"
                                                v-if="plan.plan_detail.deviation">
                                                <img src="~assets/images/icon/deviations.png" alt="deviation"
                                                    class="dark-logo img">
                                                <div class="ml-2">{{
                                                    $t('form.deviations') }}</div>
                                            </div>

                                            <div class="p-2 border rounded d-flex align-items-center justify-content-center basis_left"
                                                v-if="plan.plan_detail.routine">
                                                <img src="~assets/images/icon/routines.png" alt="deviation"
                                                    class="dark-logo img">
                                                <div class="ml-2">{{
                                                    $t('form.routines') }}</div>
                                            </div>
                                            <div class="p-2 border rounded d-flex align-items-center justify-content-center basis_left"
                                                v-if="plan.plan_detail.document">
                                                <img src="~assets/images/icon/documents.png" alt="deviation"
                                                    class="dark-logo img">
                                                <div class="ml-2">{{
                                                    $t('form.documents') }}</div>
                                            </div>
                                            <div class="p-2 border rounded d-flex align-items-center justify-content-center basis_left"
                                                v-if="plan.plan_detail.checklist">
                                                <img src="~assets/images/icon/checklists.png" alt="deviation"
                                                    class="dark-logo img">
                                                <div class="ml-2">{{
                                                    $t('form.checklists') }}</div>
                                            </div>
                                            <div class="p-2 border rounded d-flex align-items-center justify-content-center basis_left"
                                                v-if="plan.plan_detail.task">
                                                <img src="~assets/images/icon/tasks.png" alt="tasks" class="dark-logo img">
                                                <div class="ml-2">{{ $t('form.tasks')
                                                }}</div>
                                            </div>
                                            <div class="p-2  border rounded d-flex justify-content-center align-items-center basis_left"
                                                v-if="plan.plan_detail.goal">
                                                <img src="~assets/images/icon/goals.png" alt="deviation"
                                                    class="dark-logo img">
                                                <div class="ml-2">{{ $t('form.goals')
                                                }}</div>
                                            </div>
                                            <div class="p-2 border rounded d-flex align-items-center justify-content-center basis_left"
                                                v-if="plan.plan_detail.contact">
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
                            <div class="px-3" style="background-color: #f1f1f1;">
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
                                            {{ purchase?.plan.price }}
                                        </div>
                                    </div>

                                    <div class="row" v-if="purchase?.billing.billing_detail.discount > 0">
                                        <div class="font-weight-bold col-8 text-dark">
                                            {{ $t('column.discount') }}
                                        </div>
                                        <div class="col-2">
                                            <span style="background-color: #87A53A4D;" class="rounded p-1"> -
                                                {{ discount_percentage }} % </span>
                                        </div>
                                        <div class="col-2">
                                            <span>Kr</span>
                                            {{ purchase?.billing.billing_detail.discount }}
                                        </div>
                                    </div>

                                    <div class="row" v-if="purchase?.billing.billing_detail.additional_user > 0">
                                        <div class="font-weight-bold col-10 text-dark">
                                            {{ $t('column.additional_price') }}
                                        </div>
                                        <div class="col-2">
                                            <span>Kr</span>
                                            {{ purchase?.billing.billing_detail.additional_user_amount }}
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="font-weight-bold col-10 text-dark">
                                            {{ $t('column.vat') }} <span style="background-color: #87A53A4D;"
                                                class="rounded p-1"> {{ vat }} % </span>
                                        </div>
                                        <div class="col-2">
                                            <span>Kr</span>
                                            {{ purchase?.billing.billing_detail.vat }}
                                        </div>
                                    </div>
                                    <hr>
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

                            <v-card-text class="text--lighten-3 pt-0" v-else>
                                <div class="col-12 bg-white rounded">
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
                    </v-card-text>
                    <div class="p-4 text-white pt-1 d-flex justify-content-end">
                        <v-btn class="p-2 mt-2 rounded text-center" text @click="close">
                            <span style="border-bottom: 1px solid black;">{{ $t('button.cancel') }}</span></v-btn>
                    </div>
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
    name: 'PurchasePlan',
    props: {
        openPopup: {
            type: Boolean,
            required: true,
        },
        plan: {
            type: Object,
            required: true,
        },
    },
    data: () => ({
        is_additionalUsers: false,
        is_coupon: false,
        is_conditions: false,
        is_payByCard: false,
        is_successCoupon: false,
        paymentMethod: null,
        coupon: '',
        couponCode: '',
        couponError: '',
        couponSuccess: '',
        defaultCard: null,
        lowCredit: null,
        payByMethod: 1,
        discount: 0,
        discount_percentage: 0,
        purchase: null,
        vat: null,
        cardDetail: {},
        isLoading: false,
        isOpenThankYouPopup: false,
        couponAppliedBtnDisable: false,
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
        getAdditionalUserPrice() {
            return this.additional_users * this.plan?.additional_price;
        },
        getTotalPrice() {
            return this.getAdditionalUserPrice + this.plan.price - this.discount;
        },
        getVatCalculate() {
            return this.getTotalPrice * this.vat / 100;
        },
        getTotalAmount() {
            return this.getTotalPrice + this.getVatCalculate;
        },
    },

    methods: {
        handleTearm(val) {
            this.is_conditions = !!val
        },

        handleCoupon(val) {
            if (val) {
                this.is_coupon = true;
            }
        },

        handleAdditional(val) {
            if (val) {
                this.is_additionalUsers = true;
            }
        },
        handlepayByCard(val) {
            if (val) {
                this.is_payByCard = true;
                this.payByMethod = 2;
            }else{
                this.payByMethod = 1;
            }
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

        couponClose() {
            this.couponSuccess = null;
            this.couponAppliedBtnDisable = false;
            this.discount = 0;
            this.is_successCoupon = false;
        },

        async save() {

            // if the card is not tokenized already, we'll tokenize it
            if (this.paymentMethod === null && this.defaultCard === false && this.payByMethod === 1 && !this.is_payByCard) {
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
            await this.$store.dispatch('subscriptions/planPurchase', {
                payment_method: this.paymentMethod,
                plan_id: this.plan.id,
                discount: this.discount,
                discount_percentage: this.discount_percentage,
                vat: this.vat,
                payByMethod: this.payByMethod,
                additional_users: this.additional_users,
                couponCode: this.couponCode
            }).then(() => {
                this.$nuxt.$loading.finish();
                this.isLoading = false;
                this.isOpenThankYouPopup = true;
                this.purchaseComplted();
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

        purchaseComplted() {
            this.isLoading = true;
            this.$nuxt.$loading.start();
            this.$store.dispatch('subscriptions/planPurchaseCompleted', {
                plan_id: this.plan.id,
            }).then((res) => {
                this.purchase = res.data;
                this.$toaster.success(this.$i18n.t('message.success_plan_purchase'));
                this.$nuxt.$loading.finish();
                this.isLoading = false;
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

        cardApply() {
            this.isLoading = true;
            this.$nuxt.$loading.start();

            this.$store.dispatch('coupon/check', {
                plan_id: this.plan.id,
                coupon: this.coupon,
            }).then((res) => {
                this.couponError = '',
                    this.couponCode = res.data.coupon_code,
                    this.discount = res.data.discount;
                this.discount_percentage = res.data.discount_percentage;
                this.couponSuccess = this.$i18n.t('message.apply_coupon'),
                    this.couponAppliedBtnDisable = true;
                // this.$toaster.success(this.$i18n.t('message.apply_coupon'));
                this.$nuxt.$loading.finish();
                this.isLoading = false;
                this.is_successCoupon = true;
            }).catch((error) => {
                // console.log(error.response.data.errors[0].errorMessage);
                if (error.response.status == 401) {
                    this.$router.push('/login');
                    this.$toaster.error(this.$i18n.t('message.token_expired'));
                } else {
                    this.couponError = error.response.data.errors[0].errorMessage
                    // this.$toaster.error(this.$i18n.t('message.fail_coupon'));
                }
                this.$nuxt.$loading.finish();
                this.isLoading = false;
            });
            this.$refs.form.reset()
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
                    this.$toaster.error(this.$i18n.t('message.fail_something'));
                    // this.close();
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
.border-b-gray-1 {
    border-bottom: 2px solid #e9ecef;
}

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

.img {
    width: 23px;
    height: 23px;
    object-fit: contain;
}

.basis {
    flex-basis: 8.40rem;
}

.basis_left {
    flex-basis: 9.80rem;
}

.header-text {
    color: rgba(0, 0, 0, 0.40);
    font-size: 18px;
    font-weight: 700;
}

</style>

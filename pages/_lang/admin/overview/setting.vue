<template>
    <div class="resources-page">
        <b-tabs card>
            <keep-alive>
                <b-tab :title="$t('tab.settings')" active>
                    <v-container>
                        <div class="row">
                          <!-----------------------------  Setting  ------------------------------------>
                            <div class="col-9 col-xl-6">
                                <v-card class="shadow mb-5 p-4 bg-body rounded">
                                    <v-card-title
                                        class="font-bold ml-5 d-flex justify-center text-green text-uppercase text-green">{{
                                            $t('title.setting') }}</v-card-title>
                                    <v-form ref="form1"  v-model="valid" lazy-validation class="mt-0">
                                        <v-container class="d-flex flex-column bg-surface-variant" style="gap: 2rem;">
                                            <div class="border">
                                                <div class="d-flex align-items-center">
                                                    <div class="font-weight-bold col-9">{{ $t('title.freezing_system') }}</div>
                                                    <div class="switch-component">
                                                        <v-switch @change="handleFreezingSystem" v-model="is_freezingSystem"
                                                            inset class="right-text" />
                                                    </div>
                                                </div>
                                                <div class="d-flex justify-content-center mb-2" v-if="is_freezingSystem">
                                                    <div class="switch-component">
                                                        <label class="left-text">{{ $t('title.manually') }}</label>
                                                        <v-switch @change="handlefreezingSystemData" v-model="is_automatic"
                                                            :label="$t('title.automatic')" inset class="right-text" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="border">
                                                <div class="d-flex align-items-center">
                                                    <div class="font-weight-bold col-9">{{ $t('title.freezing_days') }}</div>
                                                    <div class="switch-component">
                                                        <v-switch @change="handleFreezingDay" :disabled="!is_automatic"
                                                            v-model="is_freezingDay" inset class="right-text" />
                                                    </div>
                                                </div>
                                                <div class="col-12" v-if="is_freezingDay">
                                                    <v-text-field type="number" v-model="freezingDays.value"
                                                        v-validate="'required'" name="freezing" :label="$t('form.freezing')"
                                                        :rules="required" outlined />

                                                    <div v-show="errors.has('freezing')" class="validate-error">
                                                        {{ errors.first('freezing') }}
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="border">
                                                <div class="d-flex align-items-center">
                                                    <div class="font-weight-bold col-9">{{ $t('title.vat') }}</div>
                                                    <div class="switch-component">
                                                        <v-switch @change="handleVat" v-model="is_vat" inset
                                                            class="right-text" />
                                                    </div>
                                                </div>
                                                <div class="col-12" v-if="is_vat">
                                                    <v-select v-model="vat.value" :label="$t('form.vat')" :rules="required"
                                                        item-text="name" item-value="value" :items="vatTypes" outlined
                                                        class="text-box" @change="handleSelectValue(this)" />
                                                </div>
                                            </div>
                                            <div class="border">
                                                <div class="d-flex align-items-center">
                                                    <div class="font-weight-bold col-9">{{ $t('title.credit_limit') }}</div>
                                                    <div class="switch-component">
                                                        <v-switch @change="handleCredit" v-model="is_credit" inset
                                                            v-validate="'required'" class="right-text" data-vv-as="Email"
                                                            name="creditLimit" :disabled="!is_creditSafe" />
                                                    </div>
                                                </div>
                                                <div class="col-12" v-if="is_credit">
                                                    <v-text-field type="number" v-model="creditLimit.value"
                                                        @keypress="onlyNumber" v-validate="'required'" name="creditLimit"
                                                        :rules="required" :label="$t('form.credit')" outlined />
                                                    <div v-show="errors.has('creditLimit')" class="validate-error">
                                                        {{ errors.first('creditLimit') }}
                                                    </div>
                                                </div>
                                            </div>
                                            <v-btn class="btn-save mt-5 mb-2 p-2 text-center rounded" @click="saveSettingWithValidation('form1')">
                                                {{ $t('button.save') }}
                                            </v-btn>
                                        </v-container>
                                    </v-form>
                                </v-card>
                            </div>
                            <!-- <div class="col-1"></div> -->

                          <!------------------------------ configuration -------------------------------->
                            <div class="col-9 col-xl-6">
                                <v-card class="shadow p-4 mb-5 bg-body rounded">

                                    <v-card-title class="font-bold d-flex justify-center text-green text-uppercase">{{
                                        $t('title.configuration') }}</v-card-title>
                                    <div>
                                        <v-form ref="form2" lazy-validation class="mt-0">
                                            <v-container class="d-flex flex-column bg-surface-variant" style="gap: 2rem;">
                                                <div class="border">
                                                    <div class="d-flex align-items-center">
                                                        <div class="font-weight-bold col-9 text-secondary text-uppercase">{{
                                                            $t('title.fiken') }}</div>
                                                        <div class="switch-component">
                                                            <v-switch @change="handleFiken" v-model="is_fiken" inset
                                                                class="right-text" />
                                                        </div>
                                                    </div>
                                                    <div class="row justify-content-start align-baseline m-2" v-if="is_fiken">
                                                        <div class="col-12 input-wrap">
                                                            <v-text-field type="text" @change="handleFikenInput"
                                                                :value="handelEncryption(fikenData.fikenPersonalKey)"
                                                                :rules="required" v-validate="'required'"
                                                                name="fiken_personal_api_key"
                                                                :label="$t('form.fiken_personal_api_key')" outlined />
                                                            <div v-show="errors.has('fiken_personal_api_key')"
                                                                class="validate-error">
                                                                {{ errors.first('fiken_personal_api_key') }}
                                                            </div>
                                                        </div>
                                                        <div class="col-12 input-wrap">
                                                            <v-text-field type="text" @change="handleFikenSlug"
                                                            :value="handelEncryption(fikenData.fikenCompanySlug)"
                                                                :rules="required" v-validate="'required'"
                                                                name="fiken_company_slug"
                                                                :label="$t('form.fiken_company_slug')" outlined />
                                                            <div v-show="errors.has('fiken_company_slug')"
                                                                class="validate-error">
                                                                {{ errors.first('fiken_company_slug') }}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="border">
                                                    <div class="d-flex align-items-center">
                                                        <div class="font-weight-bold col-9 text-secondary text-uppercase">{{
                                                            $t('title.stripe') }}</div>
                                                        <div class="switch-component">
                                                            <v-switch @change="handleStripe" v-model="is_stripe" inset
                                                                class="right-text" />
                                                        </div>
                                                    </div>
                                                    <div class="row justify-content-start align-baseline m-2" v-if="is_stripe">
                                                        <div class="switch-component">
                                                            <label class="left-text">{{ $t('title.test') }}</label>
                                                            <v-switch @change="handleStripeMode"
                                                                v-model="stripeData.is_stripeMode" inset class="right-text"
                                                                :label="$t('title.live')" />
                                                        </div>

                                                        <div class="col-12 input-wrap" v-if="stripeData.is_stripeMode">
                                                            <v-text-field type="text"
                                                                v-model="stripeData.stripeLivePrivateKey" :rules="required"
                                                                :label="$t('form.live_private_key')" outlined />
                                                        </div>
                                                        <div class="col-12 input-wrap" v-else>
                                                            <v-text-field type="text" @change="handleStripeTestPrivateKey"
                                                                :value="handelEncryption(stripeData.stripeTestPrivateKey)"
                                                                :rules="required" v-validate="'required'"
                                                                name="testing_private_key"
                                                                :label="$t('form.testing_private_key')" outlined />
                                                            <div v-show="errors.has('testing_private_key')"
                                                                class="validate-error">
                                                                {{ errors.first('testing_private_key') }}
                                                            </div>
                                                        </div>
                                                        <div class="col-12 input-wrap" v-if="stripeData.is_stripeMode">
                                                            <v-text-field type="text"
                                                                v-model="stripeData.stripeLiveSecretKey" :rules="required"
                                                                :label="$t('form.live_secret_key')" outlined />
                                                        </div>
                                                        <div class="col-12 input-wrap" v-else>
                                                            <v-text-field type="text" @change="handleStripeTestSecretKey"
                                                                :value="handelEncryption(stripeData.stripeTestSecretKey)"
                                                                :rules="required" v-validate="'required'"
                                                                name="testing_secret_key"
                                                                :label="$t('form.testing_secret_key')" outlined />
                                                            <div v-show="errors.has('testing_secret_key')"
                                                                class="validate-error">
                                                                {{ errors.first('testing_secret_key') }}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="border">
                                                    <div class="d-flex align-items-center">
                                                        <div class="font-weight-bold col-9 text-secondary text-uppercase">{{
                                                            $t('title.creditSafe') }}</div>
                                                        <div class="switch-component">
                                                            <v-switch @change="handleCreditSafe" v-model="is_creditSafe" inset
                                                            class="right-text" />
                                                        </div>
                                                    </div>
                                                    <div class="row justify-content-start align-baseline  m-2"
                                                        v-if="is_creditSafe">
                                                        <div class="col-12 input-wrap">
                                                            <v-text-field type="text" @change="handlecreditUserName"
                                                                :value="handelEncryption(creditSafeData.creditUserName)"
                                                                :rules="required" v-validate="'required'"
                                                                name="creditSafe_userName"
                                                                :label="$t('form.creditSafe_userName')" outlined />

                                                            <div v-show="errors.has('creditSafe_userName')"
                                                                class="validate-error">
                                                                {{ errors.first('creditSafe_userName') }}
                                                            </div>
                                                        </div>
                                                        <div class="col-12 input-wrap">
                                                            <v-text-field type="text" @change="handlecreditPassword"
                                                                 :value="handelEncryption(creditSafeData.creditPassword)"
                                                                :rules="required" v-validate="'required'"
                                                                name="creditSafe_password"
                                                                :label="$t('form.creditSafe_password')" outlined />
                                                            <div v-show="errors.has('creditSafe_password')"
                                                                class="validate-error">
                                                                {{ errors.first('creditSafe_password') }}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="border">
                                                    <div class="d-flex align-items-center">
                                                        <div class="font-weight-bold col-9 text-secondary text-uppercase">{{
                                                            $t('title.strex') }}</div>
                                                        <div class="switch-component">
                                                            <v-switch @change="handleStrex" v-model="is_strex" inset
                                                                class="right-text" />
                                                        </div>
                                                    </div>
                                                    <div class="row justify-content-start align-baseline  m-2" v-if="is_strex">
                                                        <div class="col-12 input-wrap">
                                                            <v-text-field type="text" @change="handlestrexPersonalKey"
                                                                :value="handelEncryption(strexData.strexPersonalKey)"
                                                                :rules="required" :label="$t('form.strex_personal_api_key')"
                                                                outlined />
                                                        </div>
                                                    </div>
                                                </div>
                                                <v-btn class="btn-save mt-5 p-2 text-center rounded"
                                                    @click="saveSettingWithValidation('form2')">
                                                    {{ $t('button.save') }}
                                                </v-btn>

                                            </v-container>
                                        </v-form>
                                    </div>
                                </v-card>
                            </div>
                        </div>
                        <!-- col-12 col-xl-12 -->
                        <div class="row">

                          <!--------------------------- SMTP configuration ------------------------------>
                            <div class="col-9 col-xl-6">
                                <v-card class="shadow mb-5 p-4 bg-body rounded">
                                    <v-card-title
                                        class="font-bold ml-5 d-flex justify-center text-green text-uppercase text-green">{{
                                            $t('title.smtp_configuration') }}</v-card-title>
                                    <v-form ref="form3" lazy-validation class="mt-0">
                                        <v-container class="d-flex flex-column bg-surface-variant" style="gap: 2rem;">
                                            <div class="border">
                                                <div class="d-flex align-items-center">
                                                    <div class="font-weight-bold col-9">{{ $t('title.smtp_setting') }}</div>
                                                    <div class="switch-component">
                                                        <v-switch @change="handleSmtp" v-model="is_smtp" inset
                                                            class="right-text" />
                                                    </div>
                                                </div>
                                                <div v-if="is_smtp">
                                                    <div class="row p-4">
                                                        <div class="col-6">
                                                            <v-text-field type="text" v-model="smtpData.mailer"
                                                            v-validate="'required'" name="mailer" :rules="required" :label="$t('form.mailer')" outlined />

                                                        <div v-show="errors.has('mailer')" class="validate-error">
                                                                {{ errors.first('mailer') }}
                                                            </div>
                                                        </div>
                                                        <div class="col-6">
                                                            <v-text-field type="text" v-model="smtpData.host"
                                                            v-validate="'required'" name="host" :rules="required" :label="$t('form.host')" outlined />

                                                            <div v-show="errors.has('host')" class="validate-error">
                                                                {{ errors.first('host') }}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="row p-4">
                                                        <div class="col-6">
                                                            <v-text-field type="number" v-model="smtpData.port"
                                                            v-validate="'required'" name="port" :rules="required"  :label="$t('form.port')" outlined />

                                                            <div v-show="errors.has('port')" class="validate-error">
                                                                {{ errors.first('port') }}
                                                            </div>
                                                        </div>

                                                        <div class="col-6">
                                                            <v-text-field type="text" v-model="smtpData.user_name"
                                                                :label="$t('form.user_name')" outlined />
                                                        </div>
                                                    </div>
                                                    <div class="row p-4">
                                                        <div class="col-6">
                                                            <v-text-field type="text" v-model="smtpData.password"
                                                                :label="$t('form.password')" outlined />
                                                        </div>

                                                        <div class="col-6">
                                                            <v-text-field type="text" v-model="smtpData.encryption"
                                                                :label="$t('form.encryption')" outlined />
                                                        </div>

                                                    </div>

                                                    <div class="row p-4">
                                                        <div class="col-6">
                                                            <v-text-field type="text" v-model="smtpData.from_address"
                                                                :label="$t('form.from_address')" outlined />
                                                        </div>

                                                        <div class="col-6">
                                                            <v-text-field type="text" v-model="smtpData.from_name"
                                                                :label="$t('form.from_name')" outlined />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <v-btn class="btn-save mt-5 mb-2 p-2 text-center rounded" @click="saveSettingWithValidation('form3')">
                                                {{ $t('button.save') }}
                                            </v-btn>
                                        </v-container>
                                    </v-form>

                                </v-card>
                            </div>

                          <!--------------------------- Email configuration ------------------------------>
                          <div class="col-9 col-xl-6">
                                <v-card class="shadow p-4 mb-5 bg-body rounded">
                                    <v-card-title class="font-bold d-flex justify-center text-green text-uppercase">{{
                                        $t('title.email_configuration') }}</v-card-title>
                                    <div>
                                        <v-form ref="form4" lazy-validation class="mt-0">
                                            <v-container class="d-flex flex-column bg-surface-variant" style="gap: 2rem;">
                                                <div class="border">
                                                    <div class="d-flex justify-content-between align-items-center px-3">
                                                        <div class="font-weight-bold text-secondary text-uppercase">{{
                                                            $t('title.email') }}</div>
                                                        <div class="switch-component d-flex " style="gap: 10px;">
                                                            <span v-if="is_email">
                                                              <v-btn class="btn-save text-center rounded" @click="emailAdd"> Add
                                                                 </v-btn>
                                                            </span>
                                                            <v-switch @change="handleEmail" v-model="is_email" inset
                                                                class="right-text" />
                                                        </div>
                                                    </div>
                                                  
                                                    <div v-for="(applicant, index) in emailData" :key="index">

                                                        <div class=" d-flex  align-baseline m-2"
                                                        v-if="is_email">
                                                            <div class="col-10 input-wrap">
                                                            <v-text-field type="email" v-model="emailData[index]" v-validate="'required|email'" name="email" :rules="required" data-vv-as="Email"
                                                            :label="$t('form.email')" outlined />

                                                            <div v-show="errors.has('email')" class="validate-error">
                                                                {{ errors.first('email') }}
                                                            </div>
                                                            </div>
                                                            <div>
                                                                <v-btn class="btn-save text-center rounded"
                                                                    @click="emailRemove(index)"> remove
                                                                </v-btn>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <v-btn class="btn-save mt-5 p-2 text-center rounded"
                                                    @click="saveSettingWithValidation('form4')">
                                                    {{ $t('button.save') }}
                                                </v-btn>
                                            </v-container>
                                        </v-form>
                                    </div>
                                </v-card>
                            </div>
                        </div>
                    </v-container>
                </b-tab>
            </keep-alive>

          <!--------------------------- Email content tab ------------------------------>
            <keep-alive>
                <b-tab :title="$t('tab.email_contents')" @click="EmailContentsListing">
                    <v-container>
                        <!-- Add new -->
                        <EmailContemts :open-popup="checkEmailContents" :edited-item="editedItem"
                            @closePopup="checkEmailContents = !checkEmailContents" @reloadList="reloadListEmailContents" />

                        <!-- Table -->
                        <v-data-table :headers="headers" :items="filteredContentsItems"
                            class="elevation-1 hse-table table-data" :items-per-page="15" :single-expand="true"
                            :sort-by="['created_at']" :sort-desc="[true, false]" @click:row="editItem">

                            <template v-slot:header>
                                <h4 class="table-name">
                                    {{ $t('table.contents') }}
                                </h4>
                            </template>

                            <template v-slot:item.type="{ item }">
                                {{ item.is_sms ? 'Email/ SMS' : 'Email' }}
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
import EmailContemts from '../../../../components/EmailContentsPopup.vue';

export default {
    components: {
        EmailContemts
    },

    data: () => ({
        valid: true,
        form: {},
        checkAddNew: false,
        checkViewDetail: false,
        is_freezingSystem: false,
        is_freezingDay: false,
        is_fiken: false,
        is_stripe: false,
        is_automatic: false,
        is_strex: false,
        is_creditSafe: false,
        is_vat: false,
        is_credit: false,
        show_error: false,
        checkEmailContents: false,
        is_smtp: false,
        freezingDays: '',
        vat: '',
        creditLimit: '',
        contentsArray: [],
        listSetting: [],
        listConfigurationSetting: [],
        listSmtpSetting: [],
        listEmailSetting: [],
        editedItem: null,
        is_email: false,

        stripeData: {
            is_stripeMode: false,
            stripeTestPrivateKey: '',
            stripeTestSecretKey: '',
            stripeLivePrivateKey: '',
            stripeLiveSecretKey: '',
        },
        fikenData: {
            fikenPersonalKey: '',
            fikenCompanySlug: '',
        },
        creditSafeData: {
            creditUserName: '',
            creditPassword: '',
        },
        strexData: {
            strexPersonalKey: '',
        },
        smtpData: {
            mailer: '',
            host: '',
            port: '',
            user_name: '',
            password: '',
            encryption: '',
            from_address: '',
            from_name: ''
        },
        emailData: [''],

        vatTypes: [
            { name: '12%', value: '12' },
            { name: '15%', value: '15' },
            { name: '25%', value: '25' },
        ],
        required: [
            v => {
                if (!v || v.length < 1)
                    return 'This is required';
                else return true;
            },
        ],
        emailRules: [
            v => {
                if (v && v.length > 0 && !/.+@.+/.test(v))
                    return 'E-mail must be valid';
                else return true;
            }
        ],
        onlyNumber(e) {
            if (!(/\d/i.test(e.key))) {
                e.preventDefault();
            }
        },
    }),

    computed: {
        headers() {
            return [
                {
                    text: this.translateCol('title'),
                    align: 'left',
                    value: 'title',
                    width: '20%',
                },
                {
                    text: this.translateCol('subject'),
                    align: 'left',
                    value: 'subject',
                    width: '20%',
                },
                {
                    text: this.translateCol('type'),
                    align: 'left',
                    value: 'type',
                    width: '10%',
                },
                {
                    text: this.translateCol('description'),
                    align: 'left',
                    value: 'description',
                },
            ];
        },

        filteredContentsItems() {
            let that = this;
            return that.contentsArray.filter((item) => {
                return item;
            });
        },
    },

    watch: {},

    mounted() {
        this.reloadListSetting();
        this.reloadListConfigurationSetting();
        this.reloadListSmtpSetting();
        this.reloadEmailSetting();
    },

    methods: {
        handlestrexPersonalKey(value) {
            this.strexData.strexPersonalKey = value;
        },

        handlecreditPassword(value) {
            this.creditSafeData.creditPassword = value;
        },

        handlecreditUserName(value) {
            this.creditSafeData.creditUserName = value;
        },

        handleFikenInput(value) {
            this.fikenData.fikenPersonalKey = value;
        },

        handleFikenSlug(value) {
            this.fikenData.fikenCompanySlug = value;
        },

        handleStripeTestPrivateKey(value) {
            this.stripeData.stripeTestPrivateKey = value;
        },

        handleStripeTestSecretKey(value) {
            this.stripeData.stripeTestSecretKey = value;
        },

        translateCol(colName) {
            return this.$i18n.t('column.' + colName);
        },
        handleSelectValue(value) {
            console.log(value)
        },
        editItem(item) {
            this.editedItem = item;
            this.checkEmailContents = true;
        },
        handleFreezingSystem(val) {
            if (val) {
                this.is_freezingSystem = true;
            }
        },
        handleFreezingDay(val) {
            if (val) {
                this.is_freezingDay = true;
            }
        },
        handleVat(val) {
            if (val) {
                this.is_vat = true;
            }
        },
        handleCredit(val) {
            if (val) {
                this.is_credit = true;
            }
        },
        handleFiken(val) {
            if (val) {
                this.is_fiken = true;
            }
        },
        handleStripe(val) {
            if (val) {
                this.is_stripe = true;
            }
        },
        handleStripeMode(val) {
            if (val) {
                this.stripeData.is_stripeMode = true;
            }
        },
        handleCreditSafe(val) {
            if (val) {
                this.is_creditSafe = true;  
            } 
        },
        handleStrex(val) {
            if (val) {
                this.is_strex = true;
            }
        },
        handlefreezingSystemData(val) {
            if (val) {
                this.is_automatic = true;
                this.is_freezingDay = true;
            } else {
                this.is_freezingDay = false;
            }
        },
        handleSmtp(val) {
            if (val) {
                this.is_smtp = true;
            }
        },
        emailAdd() {
            this.emailData.push('')
        },
        emailRemove(event) {
            this.emailData.splice(this.emailData.indexOf(event), 1);

        },
        handleEmail(val) {
            if (val) {
                this.is_email = true;
            }
        },

        EmailContentsListing() {
            this.reloadListEmailContents();
        },

        reset() {
            setTimeout(() => {
                this.form = {};
                this.$refs.form.resetValidation();
            }, 0);
        },

        handelEncryption(value){
            return value?.length > 5 ? value.substring(0, 10) + '*******************************' : value;
        },

        saveSetting() {
            let that = this;
            if ((this.is_freezingDay != true) && (this.is_automatic)) {
                return that.$toaster.error('Freezing days required');
            } else if (this.creditLimit?.value == null || this.is_credit != true) {
                return that.$toaster.error('Credit limit required');
            }
            that.$nuxt.$loading.start();
            this.listSetting.forEach((value) => {
                if (value.key === 'freezing_system') {
                    value.is_disabled = this.is_freezingSystem
                    value.value = this.is_automatic
                }
                if (value.key === 'vat') value.is_disabled = this.is_vat
                if (value.key === 'freezing_days') value.is_disabled = this.is_freezingDay
                if (value.key === 'credit_limit') value.is_disabled = this.is_credit
            })
            if (that.listSetting) {
                that.$nuxt.$loading.start();
                that.$store.dispatch('setting/update', that.listSetting).then(function () {
                    that.$toaster.success(that.$i18n.t('message.success_setting_update'));
                    that.reloadListSetting();
                }).catch((error) => {
                    if (error.response.status == 401) {
                        that.$router.push('/login');
                        that.$toaster.error(that.$i18n.t('message.token_expired'));
                    } else {
                        that.$toaster.error(that.$i18n.t('message.fail_setting_add_new'));
                    }
                    that.$nuxt.$loading.finish();
                });
            }

        },

        saveSettingWithValidation(form) {
          let that = this;
          let valid = that.$refs[form].validate();
          if (!valid) return this.$validator.validate();

          switch (form) {
            case 'form1':
              this.saveSetting();
              break;
            case 'form2':
              this.saveConfigurationSetting();
              break;
            case 'form3':
              this.saveSmtpSetting();
              break;
            case 'form4':
              this.saveEmailSetting();
              break;
          }
        },

        saveConfigurationSetting() {
          let that = this;
          if (this.is_creditSafe && (this.creditLimit?.value == null || this.is_credit != true)) {
            that.$toaster.error('credit limit required');
            return false;
          }
          that.$nuxt.$loading.start();
          this.listConfigurationSetting.forEach((value) => {
              if (value.key === 'stripe_system') {
                  value.is_disabled = this.is_stripe
                  value.value_details = this.stripeData
              }
              if (value.key === 'fiken_system') {
                  value.is_disabled = this.is_fiken
                  value.value_details = this.fikenData
              }
              if (value.key === 'credit_system') {
                  value.is_disabled = this.is_creditSafe
                  value.value_details = this.creditSafeData
              }
              if (value.key === 'strex_system') {
                  value.is_disabled = this.is_strex
                  value.value_details = this.strexData
              }
          })

          if (that.listConfigurationSetting) {
              that.$store.dispatch('setting/update', that.listConfigurationSetting).then(function () {
                  that.$toaster.success(that.$i18n.t('message.success_setting_update'));
                  that.reloadListConfigurationSetting();
              }).catch((error) => {
                  if (error.response.status == 401) {
                      that.$router.push('/login');
                      that.$toaster.error(that.$i18n.t('message.token_expired'));
                  } else {
                      that.$toaster.error(that.$i18n.t('message.fail_setting_add_new'));
                  }
                  that.$nuxt.$loading.finish();
              });
          }
        },

        saveSmtpSetting() {
        let that = this;
          that.$nuxt.$loading.start();
          this.listSmtpSetting.forEach((value) => {
            if (value.key === 'smtp_system') {
              value.is_disabled = this.is_smtp
              value.value_details = this.smtpData
            }
          })
          if (that.listSmtpSetting) {
              that.$store.dispatch('setting/update', that.listSmtpSetting).then(function () {
                  that.$toaster.success(that.$i18n.t('message.success_setting_update'));
                  that.reloadListSmtpSetting();
              }).catch((error) => {
                  if (error.response.status == 401) {
                      that.$router.push('/login');
                      that.$toaster.error(that.$i18n.t('message.token_expired'));
                  } else {
                      that.$toaster.error(that.$i18n.t('message.fail_setting_add_new'));
                  }
                  that.$nuxt.$loading.finish();
              });
          }
        },

        saveEmailSetting() {
            let that = this;
            that.$nuxt.$loading.start();
            this.listEmailSetting.forEach((value) => {
                if (value.key === 'email_system') {
                    value.is_disabled = this.is_email
                    value.value_details = this.emailData
                }
            })

            if (that.listEmailSetting) {
                that.$nuxt.$loading.start();
                that.$store.dispatch('setting/update', that.listEmailSetting).then(function () {
                    that.$toaster.success(that.$i18n.t('message.success_setting_update'));
                    that.reloadEmailSetting();
                }).catch((error) => {
                    if (error.response.status == 401) {
                        that.$router.push('/login');
                        that.$toaster.error(that.$i18n.t('message.token_expired'));
                    } else {
                        that.$toaster.error(that.$i18n.t('message.fail_setting_add_new'));
                    }
                    that.$nuxt.$loading.finish();
                });
            }
        },

        reloadListSetting() {
            let that = this;
            that.listSetting = [];
            that.$store.dispatch('setting/index').then(result => {
                result.data.forEach((item) => {
                    if (item.key == 'freezing_system') {
                        this.is_automatic = item.value === 'automatic' ? true : false;
                        this.is_freezingSystem = item.is_disabled
                        that.listSetting.push(item);
                    } if (item.key == 'freezing_days') {
                        this.freezingDays = item;
                        this.is_freezingDay = item.is_disabled
                        that.listSetting.push(item);
                    } if (item.key == 'vat') {
                        this.vat = item;
                        this.is_vat = item.is_disabled
                        that.listSetting.push(item);
                    } if (item.key == 'credit_limit') {
                        this.creditLimit = item;
                        this.is_credit = item.is_disabled
                        that.listSetting.push(item);
                    }
                });
                that.$nuxt.$loading.finish();
            }).catch((error) => {
                if (error.response.status == 401) {
                    that.$router.push('/login');
                    that.$toaster.error(that.$i18n.t('message.token_expired'));
                } else {
                    that.$toaster.error(that.$i18n.t('message.fail_setting_view'));
                }
                that.$nuxt.$loading.finish();
            });
        },

        reloadListConfigurationSetting() {
            let that = this;
            that.listConfigurationSetting = [];
            that.$store.dispatch('setting/index').then(result => {
                result.data.forEach((item) => {
                    if (item.key == 'stripe_system') {
                        this.stripeData.is_stripeMode = item.value_details?.is_stripeMode;
                        this.stripeData.stripeTestPrivateKey = item.value_details?.stripeTestPrivateKey;
                        this.stripeData.stripeTestSecretKey = item.value_details?.stripeTestSecretKey;
                        this.stripeData.stripeLivePrivateKey = item.value_details?.stripeLivePrivateKey;
                        this.stripeData.stripeLiveSecretKey = item.value_details?.stripeLiveSecretKey;
                        this.is_stripe = item.is_disabled
                        that.listConfigurationSetting.push(item);
                    }
                    if (item.key == 'fiken_system') {
                        this.fikenData.fikenPersonalKey = item.value_details?.fikenPersonalKey;
                        this.fikenData.fikenCompanySlug = item.value_details?.fikenCompanySlug;
                        this.is_fiken = item.is_disabled
                        that.listConfigurationSetting.push(item);
                    }
                    if (item.key == 'credit_system') {
                        this.creditSafeData.creditUserName = item.value_details?.creditUserName;
                        this.creditSafeData.creditPassword = item.value_details?.creditPassword;
                        this.is_creditSafe = item.is_disabled
                        that.listConfigurationSetting.push(item);
                    }
                    if (item.key == 'strex_system') {
                        this.strexData.strexPersonalKey = item.value_details?.strexPersonalKey;
                        this.is_strex = item.is_disabled
                        that.listConfigurationSetting.push(item);
                    }
                });
                that.$nuxt.$loading.finish();
            }).catch((error) => {
                if (error.response.status == 401) {
                    that.$router.push('/login');
                    that.$toaster.error(that.$i18n.t('message.token_expired'));
                } else {
                    that.$toaster.error(that.$i18n.t('message.fail_setting_view'));
                }
                that.$nuxt.$loading.finish();
            });
        },

        reloadListSmtpSetting() {
            let that = this;
            that.listSmtpSetting = [];
            that.$store.dispatch('setting/index').then(result => {
                result.data.forEach((item) => {
                    if (item.key == 'smtp_system') {
                        this.smtpData.mailer = item.value_details?.mailer;
                        this.smtpData.host = item.value_details?.host;
                        this.smtpData.port = item.value_details?.port;
                        this.smtpData.user_name = item.value_details?.user_name;
                        this.smtpData.password = item.value_details?.password;
                        this.smtpData.encryption = item.value_details?.encryption;
                        this.smtpData.from_address = item.value_details?.from_address;
                        this.smtpData.from_name = item.value_details?.from_name;
                        this.is_smtp = item.is_disabled
                        that.listSmtpSetting.push(item);
                    }
                });
                that.$nuxt.$loading.finish();
            }).catch((error) => {
                if (error.response.status == 401) {
                    that.$router.push('/login');
                    that.$toaster.error(that.$i18n.t('message.token_expired'));
                } else {
                    that.$toaster.error(that.$i18n.t('message.fail_setting_view'));
                }
                that.$nuxt.$loading.finish();
            });
        },

        reloadEmailSetting() {
            let that = this;
            that.listEmailSetting = [];
            that.$store.dispatch('setting/index').then(result => {
                result.data.forEach((item) => {
                    if (item.key == 'email_system') {
                        this.emailData = item.value_details ?? ['']
                        this.is_email = item.is_disabled
                        that.listEmailSetting.push(item);
                    }
                });
                that.$nuxt.$loading.finish();
            }).catch((error) => {
                if (error.response.status == 401) {
                    that.$router.push('/login');
                    that.$toaster.error(that.$i18n.t('message.token_expired'));
                } else {
                    that.$toaster.error(that.$i18n.t('message.fail_setting_view'));
                }
                that.$nuxt.$loading.finish();
            });
        },

        reloadListEmailContents() {
            let that = this;
            that.$store.dispatch('emailContents/index').then(result => {
                that.contentsArray = result.data;
                that.$nuxt.$loading.finish();
            }).catch((error) => {
                if (error.response.status == 401) {
                    that.$router.push('/login');
                    that.$toaster.error(that.$i18n.t('message.token_expired'));
                } else {
                    that.$toaster.error(that.$i18n.t('message.fail_contents_view_detail'));
                }
                that.$nuxt.$loading.finish();
            });
        },
    },
};
</script>

<style>
.v-input--radio-group--column .v-input--radio-group__input {
    flex-direction: row;
}

.v-card__actions {
    margin-left: 25%;
    padding-bottom: 2%;
}

.v-input__slot {
    margin: 0 !important;
}

.v-text-field__details {
    display: none;
}

.text-green {
    color: #87a53a;
}

.card {
    transition: 100ms;
}
</style>

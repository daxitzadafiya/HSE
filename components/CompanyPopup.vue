<template>
    <div>
        <!-- dialog Super admin create new company -->
        <v-dialog v-model="openPopup" max-width="800px" persistent>
            <v-card>
                <v-card-text>
                    <div class="popup-header text-center">
                        {{ (checkSuperAdmin && editMode) ? formTitleCompany : formTitle }}
                    </div>
                    <v-form ref="form" v-model="valid" lazy-validation>
                        <b-row>
                            <b-col cols="6">
                                <div class="input-wrap">
                                <v-text-field v-model="editedItem.name" :label="$t('form.name')" :rules="required" outlined />
                                </div>
                            </b-col>
                            <b-col cols="6">
                                <div class="input-wrap">
                                <v-select v-model="editedItem.industry_id" :items="industryArray" item-text="name" item-value="id" :label="$t('form.industry')" :rules="required" outlined />
                                </div>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col cols="6">
                                <div class="input-wrap">
                                <v-text-field v-model="editedItem.email" :label="$t('form.email')" :rules="emailRules" outlined />
                                </div>
                            </b-col>
                            <b-col cols="6">
                                <div class="input-wrap">
                                <v-text-field v-model="vatNumber" :label="$t('form.vat_number')" :rules="vatNumberRule" outlined maxlength="11" @keypress="onlyNumber" />
                                </div>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col cols="6">
                                <div class="input-wrap">
                                <v-text-field v-model="editedItem.address" :label="$t('form.address')" :rules="required" outlined />
                                </div>
                            </b-col>
                            <b-col cols="6">
                                <div class="input-wrap">
                                <v-text-field v-model="phoneNumber" :label="$t('form.phone_number')" :rules="phoneNumberRule" outlined maxlength="10" @keypress="onlyNumber" />
                                </div>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col cols="6">
                                <div class="input-wrap">
                                <v-text-field v-model="editedItem.city" :label="$t('form.city')" :rules="cityRule" outlined />
                                </div>
                            </b-col>
                            <b-col cols="6">
                                <div class="input-wrap">
                                <v-text-field v-model="editedItem.zip_code" label="Zip code" :rules="zipCodeRule" outlined maxlength="4" @keypress="onlyNumber" />
                                </div>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col cols="6">
                                <CompanyWebsite :company-item="editedItem" :edit-mode="editMode" />
                            </b-col>
                            <b-col cols="6">
                                <CompanyCountry :company-item="editedItem" :edit-mode="editMode" />
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col cols="6">
                                <div class="input-wrap">
                                <v-select v-model="editedItem.language" :items="languageArray" item-text="name" item-value="value" :label="$t('form.language')" :rules="required" outlined />
                                </div>
                            </b-col>
                            <!--              <b-col cols="6">-->
                            <!--                <div class="input-wrap">-->
                            <!--                  <v-select-->
                            <!--                    v-model="editedItem.country"-->
                            <!--                    :items="countryArray"-->
                            <!--                    item-text="name"-->
                            <!--                    item-value="value"-->
                            <!--                    :label="$t('form.country')"-->
                            <!--                    :rules="required"-->
                            <!--                    outlined-->
                            <!--                  />-->
                            <!--                  &lt;!&ndash;<v-text-field v-model="editedItem.country" :label="$t('form.country')" outlined />&ndash;&gt;-->
                            <!--                </div>-->
                            <!--              </b-col>-->
                            <b-col cols="6">
                            <DatePicker :label="$t('form.established')" :item="editedItem" :date-input="editedItem.established_date" :use-keyboard="true" :past-date="true" :future-date="false" @getDate="getEstablishedDate" />
                            </b-col>
                            <!--              <b-col v-if="editMode" cols="6">-->
                            <!--                <DatePicker-->
                            <!--                  :label="$t('form.established')"-->
                            <!--                  :item="editedItem"-->
                            <!--                  :date-input="editedItem.established_date"-->
                            <!--                  :use-keyboard="false"-->
                            <!--                  :past-date="true"-->
                            <!--                  :disable="true"-->
                            <!--                />-->
                            <!--              </b-col>-->
                        </b-row>
                        <b-row v-if="editMode">
                            <b-col cols="6">
                            <DatePicker :label="$t('form.active_since')" :item="editedItem" :date-input="editedItem.active_since" :use-keyboard="false" :past-date="true" :disable="true" />
                            </b-col>
                            <b-col cols="6">
                                <div class="input-wrap">
                                <v-text-field v-model="editedItem.employees" :label="$t('form.employees')" readonly outlined />
                                </div>
                            </b-col>
                        </b-row>
                        <b-row v-if="editMode">
                            <b-col cols="6">
                                <div class="input-wrap">
                                <v-text-field v-model="editedItem.storage_upload" :label="$t('form.storage_upload')" readonly outlined />
                                </div>
                            </b-col>
                            <b-col cols="6">
                                <div class="input-wrap">
                                <v-text-field v-model="editedItem.storage_repo" :label="$t('form.storage_repo')" readonly outlined />
                                </div>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col cols="6">
                                <div class="input-wrap">
                                    <v-select v-model="editedItem.time_zone" :items="filteredTimezone" item-text="name"
                                        item-value="value" :label="$t('form.timezone')" :rules="required" outlined>
                                        <template v-slot:prepend-item>
                                            <v-list-item>
                                                <v-list-item-content>
                                                    <v-text-field v-model="searchTerm" placeholder="Search"
                                                        ></v-text-field>
                                                </v-list-item-content>
                                            </v-list-item>
                                            <!-- <v-divider class="mt-2"></v-divider> -->
                                        </template>
                                    </v-select>
                                </div>
                            </b-col>
                            <b-col cols="6">
                                <div v-if="editMode" class="input-wrap d-inline-flex">
                                    <v-checkbox @click="freezeSubcription = true" v-model="editedItem.is_freeze"
                                        :label="$t('title.freezing_system')" class="md-line-height" />
                                </div>
                            </b-col>
                        </b-row>
                        <div class="mt-5" v-if="editMode">
                            <v-btn v-if="!editedItem.subscription_deactivated_at" class="btn-custom-green"
                                @click="deactivePlan = true">
                                {{ $t('button.immediately_deactivate_plan') }}
                            </v-btn>
                            <v-btn v-else class="btn-custom-green" disabled>
                                {{ $t('button.deactivate_plan') }}
                            </v-btn>
                        </div>
                    </v-form>
                </v-card-text>
                <v-card-actions class="popup-footer">
                    <v-spacer />
                    <v-btn class="btn-cancel" text @click="checkDirtyBeforeClose">
                        {{ $t('button.cancel') }}
                    </v-btn>
                    <v-btn v-if="!editMode" class="btn-save" @click="save">
                        {{ $t('button.save') }}
                    </v-btn>
                    <v-btn v-if="editMode" class="hse-btn-delete" text @click="dialogDelete = true">
                        <v-icon dark>
                            mdi-delete
                        </v-icon>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- dialog Business Info - Company Info -->
        <v-dialog v-model="openCompanyInfoPopup" max-width="800px" persistent>
            <v-card>
                <v-card-text>
                    <div class="popup-header text-center">
                        {{ formTitle }}
                    </div>
                    <v-form ref="form" v-model="valid" lazy-validation>
                    <b-row v-if="checkAdmin || permissionsUser.indexOf('employee-basic') > -1" align-h="center" class="upload-document pb-4">
                            <b-col v-if="!previewUrl" cols="4" class="text-center upload-field">
                                <div @click="showAttachment">
                                    <img src="../assets/images/icon/new-icon-upload.png" class="image-upload" alt="logo">
                                </div>
                            </b-col>
                            <b-col v-else cols="4">
                                <div class="logo-wrapper" @click="showAttachment">
                                    <img v-bind:src="previewUrl" alt="logo">
                                </div>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col cols="6">
                                <div class="input-wrap">
                                    <v-text-field v-model="editedItem.name" :label="$t('form.name')" :rules="required" outlined />
                                </div>
                            </b-col>

                            <b-col cols="6">
                                <div class="input-wrap">
                                    <v-text-field v-model="editedItem.industry_name" :label="$t('form.industry')" disabled outlined />
                                </div>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col cols="6">
                                <DatePicker :label="$t('form.established')" :item="editedItem" :date-input="editedItem.established_date" :use-keyboard="true" :past-date="true" :future-date="false" @getDate="getEstablishedDate" />
                            </b-col>

                            <b-col cols="6">
                                <div class="input-wrap">
                                    <v-text-field v-model="vatNumber" :label="$t('form.vat_number')" :rules="vatNumberRule" outlined maxlength="11" @keypress="onlyNumber" />
                                </div>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col cols="6">
                                <div class="input-wrap">
                                    <v-select v-model="editedItem.time_zone" :items="filteredTimezone" item-text="name"
                                        item-value="value" :label="$t('form.timezone')" :rules="required" outlined>
                                        <template v-slot:prepend-item>
                                            <v-list-item>
                                                <v-list-item-content>
                                                    <v-text-field v-model="searchTerm" placeholder="Search"
                                                        ></v-text-field>
                                                </v-list-item-content>
                                            </v-list-item>
                                            <!-- <v-divider class="mt-2"></v-divider> -->
                                        </template>
                                    </v-select>
                                </div>
                            </b-col>
                            <b-col cols="6">
                                <DatePicker :label="$t('form.active_since')" :item="editedItem" :date-input="editedItem.active_since" :use-keyboard="false" :past-date="true" :disable="true" />
                            </b-col>
                        </b-row>
                    </v-form>
                </v-card-text>
                <v-card-actions class="popup-footer">
                    <v-spacer />
                    <v-btn class="btn-cancel" text @click="checkDirtyBeforeClose">
                        {{ $t('button.cancel') }}
                    </v-btn>
                    <v-btn class="btn-save" @click="save">
                        {{ $t('button.save') }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- dialog Business Info - CONTACT Company Info -->
        <v-dialog v-model="openContactInfoPopup" max-width="1300px" persistent>
            <v-card>
                <v-card-text>
                    <div class="popup-header text-center">
                        {{ $t('title.company_contact_info') }}
                    </div>
                    <v-form ref="form" v-model="valid" lazy-validation>
                        <b-row>
                            <b-col cols="4">
                                <div class="input-wrap">
                                    <v-text-field v-model="editedItem.email" :label="$t('form.email')" :rules="emailRules"
                                        outlined />
                                </div>
                            </b-col>
                            <b-col cols="4">
                                <div class="input-wrap">
                                    <v-text-field v-model="phoneNumber" :label="$t('form.phone_number')"
                                        :rules="phoneNumberRule" outlined maxlength="10" @keypress="onlyNumber" />
                                </div>
                            </b-col>
                            <b-col cols="4">
                                <CompanyWebsite :company-item="editedItem" :edit-mode="editMode" />
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col>
                                <div class="input-wrap">
                                    <v-text-field v-model="editedItem.address" :label="$t('form.address')" :rules="required"
                                        outlined />
                                </div>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col cols="4">
                                <div class="input-wrap">
                                    <v-text-field v-model="editedItem.city" :label="$t('form.city')" :rules="required"
                                        outlined />
                                </div>
                            </b-col>
                            <b-col cols="4">
                                <div class="input-wrap">
                                    <v-text-field v-model="editedItem.zip_code" label="Zip code" :rules="zipCodeRule"
                                        outlined maxlength="4" @keypress="onlyNumber" />
                                </div>
                            </b-col>
                            <b-col cols="4">
                                <CompanyCountry :company-item="editedItem" :edit-mode="editMode" />
                                <!--                <div class="input-wrap">-->
                                <!--                  <v-select-->
                                <!--                    v-model="editedItem.country"-->
                                <!--                    :items="countryArray"-->
                                <!--                    item-text="name"-->
                                <!--                    item-value="value"-->
                                <!--                    :label="$t('form.country')"-->
                                <!--                    outlined-->
                                <!--                  />-->
                                <!--                  <v-text-field v-model="editedItem.country" :label="$t('form.country')" outlined />-->
                                <!--                </div>-->
                            </b-col>
                        </b-row>
                    </v-form>
                </v-card-text>
                <v-card-actions class="popup-footer">
                    <v-spacer />
                    <v-btn class="btn-cancel" text @click="checkDirtyBeforeClose">
                        {{ $t('button.cancel') }}
                    </v-btn>
                    <v-btn class="btn-save" @click="save">
                        {{ $t('button.save') }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- dialog Business Info - Overview Info -->
        <v-dialog v-model="openOverviewInfoPopup" max-width="500px" persistent>
            <v-card>
                <v-card-text>
                    <div class="popup-header text-center">
                        {{ $t('title.company_overview_info') }}
                    </div>
                    <v-form ref="form" v-model="valid" lazy-validation>
                        <b-row>
                            <b-col cols="12">
                                <div class="input-wrap">
                                <v-select v-model="editedItem.ceo" :items="listEmployeeCeoManagerArray" item-text="name" item-value="id" :label="$t('form.choose_ceo')" :rules="required" outlined />
                                </div>
                            </b-col>
                            <b-col cols="12">
                                <div class="input-wrap">
                                <v-select v-model="editedItem.hse_manager" :items="listEmployeeCeoManagerArray" item-text="name" item-value="id" :label="$t('form.choose_hse_manager')" :rules="required" outlined />
                                </div>
                            </b-col>
                            <b-col cols="12">
                                <div class="input-wrap">
                                <v-select v-model="editedItem.safety_manager" :items="listEmployeeSafetyArray" item-text="name" item-value="id" :label="$t('form.choose_safety_manager')" :rules="required" outlined />
                                </div>
                            </b-col>
                        </b-row>
                    </v-form>
                </v-card-text>
                <v-card-actions class="popup-footer">
                    <v-spacer />
                    <v-btn class="btn-cancel" text @click="checkDirtyBeforeClose">
                        {{ $t('button.cancel') }}
                    </v-btn>
                    <v-btn class="btn-save" @click="save">
                        {{ $t('button.save') }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogConfirmClose" max-width="500px">
            <v-card class="dialog-delete">
                <v-card-text>
                    <div class="text-center confirm-delete-title">
                        {{ $t('title.confirm_modal') }}
                    </div>
                    <div class="confirm-delete-text">
                        {{ $t('message.do_you_want_to_cancel_without_saving') }}
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn class="btn-cancel" text @click="close">
                        {{ $t('button.yes') }}
                    </v-btn>
                    <v-btn class="btn-cancel" text @click="dialogConfirmClose = false">
                        {{ $t('button.no') }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card class="dialog-delete text-center">
                <v-card-text>
                    <div class="confirm-delete-title">
                        {{ $t('title.confirm_disable') }}
                    </div>
                    <div class="confirm-delete-text">
                        {{ $t('message.do_you_want_to_disable_company') }}
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn class="btn-cancel" text @click="closeDelete">
                        {{ $t('button.no') }}
                    </v-btn>
                    <v-btn class="btn-save" @click="deleteItem(editedItem)">
                        {{ $t('button.yes') }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="freezeSubcription" max-width="500px">
            <v-card class="dialog-delete text-center">
                <v-card-text>
                    <div class="confirm-delete-title">
                        {{ $t('title.confirm_modal') }}
                    </div>
                    <div class="confirm-delete-text">
                        {{ $t('message.do_you_want_to_freezing_system') }}
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn class="btn-cancel" text @click="closeFreez">
                        {{ $t('button.no') }}
                    </v-btn>
                    <v-btn class="btn-save" @click="freezItem(editedItem)">
                        {{ $t('button.yes') }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="deactivePlan" max-width="500px">
            <v-card class="dialog-delete text-center">
                <v-card-text>
                    <div class="confirm-delete-title">
                        {{ $t('title.confirm_disable') }}
                    </div>
                    <div class="confirm-delete-text">
                        {{ $t('message.do_you_want_to_deactive_subscription') }}
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn class="btn-cancel" text @click="closeSubcription">
                        {{ $t('button.no') }}
                    </v-btn>
                    <v-btn class="btn-save" @click="subcriptionItem(editedItem)">
                        {{ $t('button.yes') }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Super Admin: create user after create new company -->
    <UserPopup :open-popup="checkAddNewUser" :new-company="newCompanyId" @closePopup="checkAddNewUser = !checkAddNewUser" @reloadList="reloadUserList" />

        <!-- Company logo -->
    <AttachmentPopup :open-attachment-popup="checkAttachmentOpen" :type="'attachment'" :added-from="'company'" :is-image="true" @closePopup="checkAttachmentOpen = !checkAttachmentOpen" @getImage="getImage" />
    </div>
</template>

<script>
import {
    _
} from 'vue-underscore';
import cookies from "js-cookie";
import UserPopup from "./UserPopup";
import DatePicker from "./DatePicker";
import CompanyWebsite from "./CompanyWebsite";
import CompanyCountry from "./CompanyCountry";
import AttachmentPopup from "./AttachmentPopup";
import axios from "axios";

export default {
    name: "CompanyPopup",
    components: {
        UserPopup,
        DatePicker,
        CompanyWebsite,
        AttachmentPopup,
        CompanyCountry,
    },
    props: {
        companyItem: {
            type: Object,
            required: false,
        },
        openPopup: {
            type: Boolean,
            required: false,
        },
        openCompanyInfoPopup: {
            type: Boolean,
            required: false,
        },
        openContactInfoPopup: {
            type: Boolean,
            required: false,
        },
        openOverviewInfoPopup: {
            type: Boolean,
            required: false,
        },
        // listEmployeeArray: {
        //   type: Array,
        //   required: false,
        // },
        listEmployeeCeoManagerArray: {
            type: Array,
            required: false,
        },
        listEmployeeSafetyArray: {
            type: Array,
            required: false,
        },
        industryArray: {
            type: Array,
            required: false,
        },
    },
    data: () => ({
        userRoleId: parseInt(cookies.get('roleID')),
        userDepartmentID: parseInt(cookies.get('userDepartmentID')),
        checkSuperAdmin: cookies.get('checkSuperAdmin'),
        checkAdmin: cookies.get('checkAdmin'),
        roleUser: cookies.get('roleUser'),
        permissionsUser: localStorage.getItem('permissionsKey'),
        valid: true,
        searchTerm: "",
        editedItem: {
            name: "",
            phone_number: "",
            vat_number: "",
            email: "",
            website: "",
            industry_id: "",
            address: "",
            city: "",
            country: "Norway",
            zip_code: "",
            logo: "",
            language: "",
            active_since: "",
            established_date: "",
            established_date_pre: "",
            ceo: "",
            hse_manager: "",
            safety_manager: "",
            status: "",
            employees: "",
            storage_upload: "",
            storage_repo: "",
            is_freeze: "",
            subscription_deactivated_at: "",
            time_zone: "",
        },
        defaultItem: {
            name: "",
            phone_number: "",
            vat_number: "",
            email: "",
            website: "",
            industry_id: "",
            address: "",
            city: "",
            country: "Norway",
            zip_code: "",
            logo: "",
            language: "",
            active_since: "",
            established_date: "",
            established_date_pre: "",
            ceo: "",
            hse_manager: "",
            safety_manager: "",
            status: "",
            employees: "",
            storage_upload: "",
            storage_repo: "",
            subscription_deactivated_at: "",
            time_zone: "",
        },
        required: [
            v => {
                if (!v || v.length < 1)
                    return 'This is required';
                else return true;
            }
        ],
        cityRule: [
            v => {
                if (!v || v.length < 1)
                    return 'This is required';
                else if (!/^([^0-9]*)$/.test(v))
                    return 'City must not contain digits';
                else return true;
            }
        ],
        zipCodeRule: [
            v => {
                if (!v || v.length < 1)
                    return 'This is required';
                else if (!/^(\d{4})$/.test(v))
                    return 'Zip code must be 4 digits';
                else return true;
            }
        ],
        phoneNumberRule: [
            v => {
                if (!v || v.length < 1)
                    return 'This is required';
                else if (!/^((\d{3})+(\s)+(\d{2})+(\s)+(\d{3})|\d{3})?$/.test(v))
                    return 'Phone number must be 3 or 8 digits';
                else return true;
            }
        ],
        vatNumberRule: [
            v => {
                if (!v || v.length < 1)
                    return 'This is required';
                else if (!/^([\d\w]{3})+(\s)+([\d\w]{3})+(\s)+([\d\w]{3})$/.test(v))
                    return 'VAT number must be valid';
                else return true;
            }
        ],
        emailRules: [
            v => {
                if (v && v.length > 0 && !/.+@.+/.test(v))
                    return 'E-mail must be valid';
                else return true;
            }
        ],
        menu: false,
        phoneNumber: '',
        vatNumber: '',
        formTitle: '',
        formTitleCompany: '',
        editMode: true,
        dialogConfirmClose: false,
        freezeSubcription: false,
        deactivePlan: false,
        dialogDelete: false,
        formDirty: false,
        checkAddNewUser: false,
        newCompanyId: null,
        established_date: '',
        languageArray: [{
            name: 'English',
            value: 'en'
        },
        {
            name: 'Norsk',
            value: 'no'
        },
        ],
        countryArray: [{
            name: 'Norway',
            value: 'Norway'
        },
        {
            name: 'Australia',
            value: 'Australia'
        },
        {
            name: 'Denmark',
            value: 'Denmark'
        },
        {
            name: 'England',
            value: 'England'
        },
        {
            name: 'Finland',
            value: 'Finland'
        },
        {
            name: 'Sweden',
            value: 'Sweden'
        },
        {
            name: 'USA',
            value: 'USA'
        },
        ],

        timeZone: [{
            name: '(GMT-12:00) Etc/GMT+12',
            value: 'Etc/GMT+12'
        },
        {
            name: '(GMT-11:00) Pacific/Pago_Pago',
            value: 'Pacific/Pago_Pago'
        },
        {
            name: '(GMT-09:00) America/Adak',
            value: 'America/Adak'
        },
        {
            name: '(GMT-10:00) Pacific/Honolulu',
            value: 'Pacific/Honolulu'
        },
        {
            name: '(GMT-09:30) Pacific/Marquesas',
            value: 'Pacific/Marquesas'
        },
        {
            name: '(GMT-09:00) Pacific/Gambier',
            value: 'Pacific/Gambier'
        },
        {
            name: '(GMT-08:00) America/Anchorage',
            value: 'America/Anchorage'
        },
        {
            name: '(GMT-07:00) America/Los_Angeles',
            value: 'America/Los_Angeles'
        },
        {
            name: '(GMT-08:00) Pacific/Pitcairn',
            value: 'Pacific/Pitcairn'
        },
        {
            name: '(GMT-07:00) America/Phoenix',
            value: 'America/Phoenix'
        },
        {
            name: '(GMT-06:00) America/Denver',
            value: 'America/Denver'
        },
        {
            name: '(GMT-07:00) America/Mazatlan',
            value: 'America/Mazatlan'
        },
        {
            name: '(GMT-06:00) America/Guatemala',
            value: 'America/Guatemala'
        },
        {
            name: '(GMT-05:00) America/Chicago',
            value: 'America/Chicago'
        },
        {
            name: '(GMT-05:00) Pacific/Easter',
            value: 'Pacific/Easter'
        },
        {
            name: '(GMT-06:00) America/Mexico_City',
            value: 'America/Mexico_City'
        },
        {
            name: '(GMT-05:00) America/Bogota',
            value: 'America/Bogota'
        },
        {
            name: '(GMT-04:00) America/New_York',
            value: 'America/New_York'
        },
        {
            name: '(GMT-04:00) America/Havana',
            value: 'America/Havana'
        },
        {
            name: '(GMT-04:00) America/Caracas',
            value: 'America/Caracas'
        },
        {
            name: '(GMT-03:00) America/Halifax',
            value: 'America/Halifax'
        },
        {
            name: '(GMT-04:00) America/Santo_Domingo',
            value: 'America/Santo_Domingo'
        },
        {
            name: '(GMT-03:00) America/Asuncion',
            value: 'America/Asuncion'
        },
        {
            name: '(GMT-04:00) America/Campo_Grande',
            value: 'America/Campo_Grande'
        },
        {
            name: '(GMT-03:00) America/Goose_Bay',
            value: 'America/Goose_Bay'
        },
        {
            name: '(GMT-03:00) America/Santiago',
            value: 'America/Santiago'
        },
        {
            name: '(GMT-02:30) America/St_Johns',
            value: 'America/St_Johns'
        },
        {
            name: '(GMT-02:00) America/Godthab',
            value: 'America/Godthab'
        },
        {
            name: '(GMT-03:00) America/Argentina/Buenos_Aires',
            value: 'America/Argentina/Buenos_Aires'
        },
        {
            name: '(GMT-03:00) America/Montevideo',
            value: 'America/Montevideo'
        },
        {
            name: '(GMT-02:00) America/Miquelon',
            value: 'America/Miquelon'
        },
        {
            name: '(GMT-03:00) America/Sao_Paulo',
            value: 'America/Sao_Paulo'
        },
        {
            name: '(GMT-02:00) America/Noronha',
            value: 'America/Noronha'
        },
        {
            name: '(GMT+00:00) Atlantic/Azores',
            value: 'Atlantic/Azores'
        },
        {
            name: '(GMT-04:00) America/Havana',
            value: 'Atlantic/Cape_Verde'
        },
        {
            name: '(GMT+00:00) UTC',
            value: 'UTC'
        },
        {
            name: '(GMT+01:00) Europe/London',
            value: 'Europe/London'
        },

        {
            name: '(GMT+02:00) Europe/Berlin',
            value: 'Europe/Berlin'
        },
        {
            name: '(GMT+01:00) Africa/Lagos',
            value: 'Africa/Lagos'
        },
        {
            name: '(GMT+01:00) Africa/Casablanca',
            value: 'Africa/Casablanca'
        },
        {
            name: '(GMT+02:00) Africa/Windhoek',
            value: 'Africa/Windhoek'
        },
        {
            name: '(GMT+03:00) Asia/Beirut',
            value: 'Asia/Beirut'
        },
        {
            name: '(GMT+02:00) Africa/Johannesburg',
            value: 'Africa/Johannesburg'
        },
        {
            name: '(GMT+03:00) Africa/Cairo',
            value: 'Africa/Cairo'
        },
        {
            name: '(GMT+03:00) Asia/Gaza',
            value: 'Asia/Gaza'
        },
        {
            name: '(GMT+03:00) Asia/Jerusalem',
            value: 'Asia/Jerusalem'
        },
        {
            name: '(GMT+03:00) Europe/Helsinki',
            value: 'Europe/Helsinki'
        },
        {
            name: '(GMT+03:00) Asia/Baghdad',
            value: 'Asia/Baghdad'
        },
        {
            name: '(GMT+03:00) Europe/Moscow',
            value: 'Europe/Moscow'
        },
        {
            name: '(GMT+03:00) Asia/Amman',
            value: 'Asia/Amman'
        },
        {
            name: '(GMT+03:00) Asia/Damascus',
            value: 'Asia/Damascus'
        },
        {
            name: '(GMT+03:00) Europe/Minsk',
            value: 'Europe/Minsk'
        },
        {
            name: '(GMT+03:30) Asia/Tehran',
            value: 'Asia/Tehran'
        },
        {
            name: '(GMT+04:00) Asia/Dubai',
            value: 'Asia/Dubai'
        },
        {
            name: '(GMT+04:00) Asia/Baku',
            value: 'Asia/Baku'
        },
        {
            name: '(GMT+04:00) Asia/Yerevan',
            value: 'Asia/Yerevan'
        },
        {
            name: '(GMT+04:30) Asia/Kabul',
            value: 'Asia/Kabul'
        },
        {
            name: '(GMT+05:00) Asia/Yekaterinburg',
            value: 'Asia/Yekaterinburg'
        },
        {
            name: '(GMT+05:00) Asia/Karachi',
            value: 'Asia/Karachi'
        },
        {
            name: '(GMT+05:30) Asia/Kolkata',
            value: 'Asia/Kolkata'
        },
        {
            name: '(GMT+05:45) Asia/Kathmandu',
            value: 'Asia/Kathmandu'
        },
        {
            name: '(GMT+06:00) Asia/Dhaka',
            value: 'Asia/Dhaka'
        },

        {
            name:'(GMT+06:00) Asia/Omsk',
            value:'Asia/Omsk'
        },
        {
            name:'(GMT+06:30) Asia/Rangoon',
            value:'Asia/Rangoon'
        },
        {
            name:'(GMT+07:00) Asia/Krasnoyarsk',
            value:'Asia/Krasnoyarsk'
        },
        {
            name:'(GMT+07:00) Asia/Jakarta',
            value:'Asia/Jakarta'
        },
        {
            name:'(GMT+08:00) Asia/Shanghai',
            value:'Asia/Shanghai'
        },
        {
            name:'(GMT+08:00) Asia/Irkutsk',
            value:'Asia/Irkutsk'
        },
        {
            name:'(GMT+08:00) Australia/Perth',
            value:'Australia/Perth'
        },
        {
            name:'(GMT+08:45) Australia/Eucla',
            value:'Australia/Eucla'
        },
        {
            name:'(GMT+09:00) Asia/Yakutsk',
            value:'Asia/Yakutsk'
        },
        {
            name:'(GMT+09:00) Asia/Tokyo',
            value:'Asia/Tokyo'
        },
        {
            name:'(GMT+09:30) Australia/Darwin',
            value:'Australia/Darwin'
        },
        {
            name:'(GMT+10:30) Australia/Adelaide',
            value:'Australia/Adelaide'
        },
        {
            name:'(GMT+10:00) Australia/Brisbane',
            value:'Australia/Brisbane'
        },
        {
            name:'(GMT+10:00) Asia/Vladivostok',
            value:'Asia/Vladivostok'
        },
        {
            name:'(GMT+11:00) Australia/Sydney',
            value:'Australia/Sydney'
        },
        {
            name:'(GMT+11:00) Australia/Sydney',
            value:'Australia/Sydney'
        },
        {
            name:'(GMT+11:00) Australia/Lord_Howe',
            value:'Australia/Lord_Howe'
        },
        {
            name:'(GMT+11:00) Pacific/Noumea',
            value:'Pacific/Noumea'
        },
        {
            name:'(GMT+12:00) Pacific/Norfolk',
            value:'Pacific/Norfolk'
        },
        {
            name:'(GMT+12:00) Asia/Kamchatka',
            value:'Asia/Kamchatka'
        },
        {
            name:'(GMT+13:00) Pacific/Auckland',
            value:'Pacific/Auckland'
        },
        {
            name:'(GMT+12:00) Pacific/Majuro',
            value:'Pacific/Majuro'
        },
        {
            name:'(GMT+12:00) Pacific/Fiji',
            value:'Pacific/Fiji'
        },
        {
            name:'(GMT+13:45) Pacific/Chatham',
            value:'Pacific/Chatham'
        },
        {
            name:'(GMT+13:00) Pacific/Apia',
            value:'Pacific/Apia'
        },
        {
            name:'(GMT+13:00) Pacific/Tongatapu',
            value:'Pacific/Tongatapu'
        },
        {
            name:'(GMT+14:00) Pacific/Kiritimati',
            value:'Pacific/Kiritimati'
        }

        ],

        // upload logo
        previewUrl: null,
        selectedFile: [],
        checkAttachmentOpen: false,
    }),

    watch: {
        openPopup(value) {
            if (value) {
                if (this.companyItem) {
                    this.editItem(this.companyItem);
                } else {
                    this.addNew();
                }
            }
        },

        phoneNumber(value) {
            if (value) {
                this.reformatPhoneNumber();
            }
        },

        vatNumber(value) {
            if (value) {
                this.reformatVatNumber();
            }
        },

        openCompanyInfoPopup(value) {
            if (value) {
                if (this.companyItem) {
                    this.editItem(this.companyItem);
                }
            }
        },

        openContactInfoPopup(value) {
            if (value) {
                if (this.companyItem) {
                    this.editItem(this.companyItem);
                }
            }
        },

        openOverviewInfoPopup(value) {
            if (value) {
                if (this.companyItem) {
                    this.editItem(this.companyItem);
                }
            }
        },
    },

    mounted() {
        this.fruitsCopy = [this.fruits];
    },

    created() {
        if (this.openPopup || this.openCompanyInfoPopup || this.openContactInfoPopup || this.openOverviewInfoPopup) {
            if (this.companyItem) {
                this.editItem(this.companyItem);
            } else {
                this.addNew();
            }
        }
    },


    computed: {
        filteredTimezone() {
            if (!this.searchTerm) {
                return this.timeZone;
            }
            return this.timeZone.filter((zone) => {
                return zone.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
            });
        }
    },

    methods: {
        formatDate(date) {
            if (!date) return null;
            const [year, month, day] = date.split('-');
            return `${day}/${month}/${year}`;
        },

        getEstablishedDate(value) {
            this.established_date = value.date;
            this.editedItem.established_date_pre = this.established_date;
        },

        addNew() {
            this.reset();
            this.formTitle = this.$i18n.t('title.new_company');
            this.editMode = false;
        },

        editItem(item) {
            let that = this;
            that.formDirty = false;
            that.$nuxt.$loading.start();
            that.formTitle = that.$i18n.t('title.edit_company_detail');
            that.formTitleCompany = that.$i18n.t('title.view_company_detail');
            that.$store.dispatch('companies/show', item.id).then(result => {
                that.editedItem = Object.assign({}, result.data);
                if (that.editedItem.logo) {
                    that.getImageSrc(that.editedItem.logo);
                }
                that.phoneNumber = that.editedItem.phone_number;
                that.vatNumber = that.editedItem.vat_number;
                if (result.data.country === null) {
                    that.editedItem.country = 'Norway';
                }
                that.$nuxt.$loading.finish();
            }).catch((error) => {
                if (error.response.status == 401) {
                    that.$router.push('/login');
                    that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
                    that.$toaster.error(that.$i18n.t('message.fail_company_view_detail'));
                }
                // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
                that.$nuxt.$loading.finish();
            });
            that.originData = _.clone(that.editedItem);
        },

        checkDirtyBeforeClose() {
            if (this.checkDirtyForm()) {
                this.dialogConfirmClose = true;
            } else {
                this.close();
            }
        },

        handleDeactivePlan() {
            this.$nuxt.$loading.start();
           this.$store.dispatch('subscriptions/immediatelyDeactive',{
                company_id:this.companyItem.id    
            }).then(() => {
                this.reloadList();
                this.$nuxt.$loading.finish();
                this.$toaster.success(this.$i18n.t('message.success_plan_cancel'));
            }).catch(() => {
                this.$toaster.error(this.$i18n.t('message.fail_plan_view_detail'));
                this.$nuxt.$loading.finish();
            });

        },


        checkDirtyForm() {
            let that = this;
            let result = false;
            _.each(that.editedItem, function (value, key, obj) {
                if (that.originData && obj[key] && that.originData[key] && obj[key] !== that.originData[key]) {
                    result = true;
                }
            });
            return result;
        },

        close() {
            this.reset();
            this.dialogConfirmClose = false;
            this.dialogDelete = false;
            this.freezeSubcription = false;
            this.deactivePlan = false;
            this.selectedFile = [];
            this.previewUrl = null;
            this.formDirty = false;
            this.phoneNumber = '';
            this.vatNumber = '';
            // this.established_date = '';
            this.$emit('closePopup');
        },

        reset() {
            setTimeout(() => {
                this.editedItem = Object.assign({}, this.defaultItem);
                // this.$refs.form.reset();
                this.$refs.form.resetValidation();
            }, 300);
        },

        save() {
            let that = this;
            if (that.$refs.form.validate()) {
                that.$nuxt.$loading.start();
                that.editedItem.phone_number = that.phoneNumber;
                that.editedItem.vat_number = that.vatNumber;
                that.editedItem.established_date = that.editedItem.established_date_pre;
                let file = that.selectedFile;
                if (that.editMode) {
                    // edit
                    that.$store.dispatch('companies/update', that.editedItem).then(result => {
                        if (file.length !== 0) {
                            that.savePicture(file, result.data);
                        } else {
                            that.reloadCompany();
                            that.$toaster.success(that.$i18n.t('message.success_company_update'));
                        }
                    }).catch((error) => {
                        if (error.response.status == 401) {
                            that.$router.push('/login');
                            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
                            that.$toaster.error(that.$i18n.t('message.fail_company_update'));
                        }
                        that.$nuxt.$loading.finish();
                        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
                    });
                } else {
                    // create
                    that.$store.dispatch('companies/store', that.editedItem).then(result => {
                        if (file.length !== 0) {
                            that.savePicture(file, result.data);
                        } else {
                            that.reloadList();
                            that.$toaster.success(that.$i18n.t('message.success_company_add_new'));
                        }
                        // that.reloadList();
                        that.newCompanyId = result.data.id;
                        that.checkAddNewUser = true;
                    }).catch((error) => {
                        if (error.response.status == 401) {
                            that.$router.push('/login');
                            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
                            that.$toaster.error(that.$i18n.t('message.fail_company_add_new'));
                        }
                        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
                        that.$nuxt.$loading.finish();
                    });
                }
                that.close();
            }
        },

        reloadCompany() {
            this.$emit('reloadCompany');
        },

        reloadList() {
            this.$emit('reloadList');
        },

        reloadUserList() {
            this.$emit('reloadList');
        },

        savePicture(selectedFile, company) {
            let that = this;
            let formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('original_file_name', selectedFile.name);
            formData.append('file_size', selectedFile.size);
            formData.append('status', 1); // 0: draft, 1: public
            formData.append('name', company.name + " logo");
            formData.append('type', 'attachment');
            formData.append('object_type', 'company');
            formData.append('object_id', company.id);
            formData.append('category_id', 7); // logo
            formData.append('category_name', "Logo");
            formData.append('is_renewed', 0);
            if (company.logo !== null) { // if update company logo
                formData.append('attachment_updated', true);
            }
            that.$store.dispatch('documents/store', formData).then(function () {
                that.reloadCompany();
                that.editedItem = that.defaultItem;
                if (that.editMode) {
                    that.$toaster.success(that.$i18n.t('message.success_company_update'));
                } else {
                    that.$toaster.success(that.$i18n.t('message.success_company_add_new'));
                }
            }).catch((error) => {
                if (error.response.status == 401) {
                    that.$router.push('/login');
                    that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
                    that.$toaster.error(that.$i18n.t('message.fail_to_upload_logo'));
                }
                // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
                that.$nuxt.$loading.finish();
            });
        },

        onlyNumber(e) {
            if (!(/\d/i.test(e.key))) {
                e.preventDefault();
            }
        },

        reformatPhoneNumber() {
            let that = this;
            if (that.phoneNumber.length === 4 && that.phoneNumber.trim().length !== 3) {
                let str = that.phoneNumber;
                let position = 3;
                let sub = " ";

                that.phoneNumber = str.slice(0, position) + sub + str.slice(position);
            } else if (that.phoneNumber.length === 6) {
                that.phoneNumber = that.phoneNumber + ' ';
            }
        },

        reformatVatNumber() {
            let that = this;
            if (that.vatNumber.length === 3 || that.vatNumber.length === 7) {
                that.vatNumber = that.vatNumber + ' ';
            }
        },

        // dialog DELETE
        closeDelete() {
            this.dialogDelete = false;
        },

        deleteItem(item) {
            this.deleteCompany(item);
            this.dialogDelete = false;
            this.close();
        },

        closeFreez() {
            this.freezeSubcription = false;
            this.editedItem.is_freeze = false;
        },

        freezItem(item) {
            this.handleCompanyStatus(item);
            this.freezeSubcription = false;

        },

        closeSubcription() {
            this.deactivePlan = false;
        },

        subcriptionItem(item) {
            this.handleDeactivePlan(item);
            this.deactivePlan = false;

        },

        deleteCompany(item) {
            let that = this;
            that.$store.dispatch('companies/delete', item.id).then(function () {
                that.reloadList();
                that.$toaster.success(that.$i18n.t('message.success_company_delete'));
            }).catch((error) => {
                if (error.response.status == 401) {
                    that.$router.push('/login');
                    that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
                    that.$toaster.error(that.$i18n.t('message.fail_company_delete'));
                }
                // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
                // that.$nuxt.$loading.finish();
            });
        },

        // show image
        showAttachment() {
            this.checkAttachmentOpen = true;
        },

        getImage(file) {
            this.previewImage(file.imageFile);
        },

        previewImage(file) {
            if (file) {
                this.previewUrl = URL.createObjectURL(file);
                this.selectedFile = file;
            } else {
                this.previewUrl = null;
                this.selectedFile = null;
            }
        },

        // show image
        getImageSrc(url) {
            let that = this;
            let result;
            axios({
                url: url,
                method: 'GET',
                responseType: 'blob', // important
            }).then((response) => {
                result = window.URL.createObjectURL(new Blob([response.data]));
                that.previewUrl = result;
                return result;
            });
        },
        handleCompanyStatus() {
            let that = this;
            that.$store.dispatch('companies/changeStatus', that.companyItem.id).then(function () {
                that.reloadList();
                that.$toaster.success(that.$i18n.t('message.success_company_freeze_status'));
            }).catch((error) => {
                if (error.response.status == 401) {
                    that.$router.push('/login');
                    that.$toaster.error(that.$i18n.t('message.token_expired'));
                } else {
                    that.$toaster.error(that.$i18n.t('message.fail_company_freeze_status'));
                }

                // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
                // that.$nuxt.$loading.finish();
            });
        }
    },
};
</script>

<style scoped>

</style>

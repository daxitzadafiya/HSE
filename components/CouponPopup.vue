<template>
    <div>
        <v-dialog v-model="openPopup" max-width="800px" persistent>
            <v-card>
                <v-card-text>
                    <div class="popup-header text-center">
                        {{ formTitle }}
                    </div>
                    <v-form ref="form" v-model="valid" lazy-validation>
                        <b-row align-h="center">
                            <b-col cols="6">
                                <div class="input-wrap">
                                    <v-text-field v-model="form.name" :readonly="editedItem" :label="$t('form.name')"
                                        :rules="required" outlined />
                                </div>
                            </b-col>
                            <b-col cols="6">
                                <div class="input-wrap">
                                    <v-text-field @keypress="onlyNumber" :readonly="editedItem" v-model="form.discount"
                                        :label="$t('form.discount')" :rules="required" outlined />
                                </div>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col cols="6">
                                <div class="input-wrap">
                                    <v-text-field v-model="form.code" :readonly="editedItem" :label="$t('form.code')"
                                        :rules="required" outlined />
                                </div>
                            </b-col>
                            <b-col cols="6">
                                <div class="input-wrap" v-if="editedItem">
                                    <v-select v-model="form.company_id" :items="companyArray" item-text="name"
                                        item-value="id" :label="$t('form.company')" :rules="required" :readonly="editedItem"
                                        outlined />
                                </div>
                                <div class="input-wrap industry-select-input-wrap" v-else>
                                    <MultipleSelection :label="$t('form.company')" :selectedItemsInput="form.listArray"
                                        :item-text="'name'" :item-value="'id'" :list-option-input="listArray"
                                        :request-required="true" @getSelectedItems="getSelectedCompany" />
                                </div>
                            </b-col>
                        </b-row>
                    </v-form>
                </v-card-text>
                <v-card-actions class="popup-footer">
                    <v-spacer/>
                    <v-btn class="btn-cancel" text @click="close">
                        {{ $t('button.cancel') }}
                    </v-btn>
                    <v-btn v-if="!editedItem" class="btn-save" @click="save">
                        {{ $t('button.save') }}
                    </v-btn>
                    <v-btn v-if="editedItem" class="hse-btn-delete" text @click="dialogDelete = true">
                        <v-icon dark>
                            mdi-delete
                        </v-icon>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogDelete" max-width="500px">
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
                    <v-btn class="btn-save" @click="handleDelete(form)">
                        {{ $t('button.yes') }}
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
                        No
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

  
  
<script>
import { _ } from 'vue-underscore';
import MultipleSelection from "../components/MultipleSelection";


export default {
    name: "CouponPopup",
    components: {
        MultipleSelection
    },
    props: {
        openPopup: {
            type: Boolean,
            required: false,
        },
        editedItem: {
            type: Object,
        }
    },
    data: () => ({
        valid: true,

        form: {
            companyArray: [],
            name: "",
            discount: "",
            code: ''
        },
        required: [
            v => {
                if (!v || v.length < 1)
                    return 'This is required';
                else return true;
            }
        ],
        dialogDelete: false,
        dialogConfirmClose: false,
        formDirty: false,
        formTitle: '',
        editMode: false,
        companyArray: [],
        listArray: []
    }),

    computed: {},

    watch: {
        openPopup(value) {
            if (value) {
                if (this.editedItem) {
                    this.editCoupon(this.editedItem);
                } else {
                    this.addNew();
                }
            }
        },
    },
    created() {
        if (this.openPopup) {
            if (this.form && this.editMode) {
                this.editCoupon(this.editedItem);
            } else {
                this.addNew();
            }
        }
    },

    mounted() {
        this.getCompanies();
    },

    methods: {
        getCompanies() {
            let that = this;
            that.$nextTick(() => {
                that.$nuxt.$loading.start();
                // get all active companies
                that.$store.dispatch('companies/index').then(result => {
                    that.listArray = result.data;
                    that.companyArray = _.clone(result.data);
                    that.companyArray.push(that.companiesDefault);
                    that.$nuxt.$loading.finish();
                    that.companyArray.sort(function (a, b) {
                        return (a.id - b.id);
                    });
                }).catch(() => {
                    // that.$toaster.error(that.$i18n.t('message.failed'));
                    // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
                    that.$nuxt.$loading.finish();
                });
            });
        },
        addNew() {
            this.reset();
            this.formTitle = this.$i18n.t('title.new_coupon');
            this.form.companyArray = [];
            this.editMode = false;
        },

        editCoupon(item) {
            this.formTitle = this.$i18n.t('title.view_coupon');
            this.form = {
                id: item.id,
                company_id: item.company_id,
                name: item.name,
                discount: item.discount,
                code: item.code,
            }
        },

        onlyNumber(e) {
            if (!(/\d/i.test(e.key))) {
                e.preventDefault();
            }
        },

        closeDelete() {
            this.dialogDelete = false;
        },

        close() {
            this.reset();
            this.dialogDelete = false;
            this.dialogConfirmClose = false;
            this.formDirty = false;
            this.form.listArray = [];
            this.$emit('closePopup');
        },

        reset() {
            setTimeout(() => {
                this.form = Object.assign({});
                this.$refs.form.resetValidation();
            }, 0);
        },

        getSelectedCompany(value) {
            this.form.companyArray = value.selectedItemsOutput;
        },

        save() {
            let that = this;
            if (that.$refs.form.validate()) {
                that.$nuxt.$loading.start();
                // create
                that.$store.dispatch('coupon/store', that.form).then(function () {
                    that.reloadList();
                    that.$toaster.success(that.$i18n.t('message.success_coupon_add_new'));
                }).catch((error) => {
                    if (error.response.status == 401) {
                        that.$router.push('/login');
                        that.$toaster.error(that.$i18n.t('message.token_expired'));
                    } else {
                        that.$toaster.error(that.$i18n.t('message.fail_coupon_add_new'));
                    }
                    // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
                    that.$nuxt.$loading.finish();
                });
                that.close();
            }
        },

        handleDelete() {
            let that = this;
            if (that.editedItem) {
                that.$store.dispatch('coupon/destroy', this.editedItem.id).then(() => {
                    that.close();
                    that.$nuxt.$loading.finish();
                    that.reloadList();
                    that.$toaster.success(that.$i18n.t('message.success_coupon_delete'));
                }).catch((error) => {
                    if (error.response.status == 401) {
                        that.$router.push('/login');
                        that.$toaster.error(that.$i18n.t('message.token_expired'));
                    } else {
                        that.$toaster.error(that.$i18n.t('message.fail_coupon_delete'));
                    }
                    that.$nuxt.$loading.finish();
                });
            }
        },

        reloadList() {
            this.$emit('reloadList');
        },
    },
};
</script>
  
  
<style scoped>
  
  </style>

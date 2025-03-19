<template>
    <div>
        <v-dialog v-model="openPopup" max-width="800px" persistent>
            <v-card>
                <v-card-text>
                    <div class="popup-header text-center">
                        {{ formTitle }}
                    </div>
                    <v-form ref="form" lazy-validation>
                        <b-row>
                            <b-col cols="6">
                                <div class="input-wrap">
                                    <v-text-field v-model="form.title" :label="$t('form.title')" :rules="required"
                                        outlined />
                                </div>
                            </b-col>
                            <b-col cols="6">
                                <div class="input-wrap">
                                    <v-text-field @keypress="onlyNumber" v-model="form.total_users"
                                        :label="$t('form.total_users')" :rules="required" outlined />
                                </div>
                            </b-col>
                            <b-col cols="6">
                                <div class="input-wrap">
                                    <v-text-field v-model="form.price" :label="$t('form.price')" :rules="required"
                                        @keypress="onlyNumber" outlined />
                                </div>
                            </b-col>
                            <b-col cols="6">
                                <div class="input-wrap">
                                    <v-text-field v-model="form.user_per_storage" :label="$t('form.user_per_storage')"
                                        :rules="required" outlined @keypress="onlyNumber" />
                                </div>
                            </b-col>
                            <b-col cols="6">
                                <div class="field-selection">
                                    <v-select v-model="form.plan_type" :label="$t('sidebar.frequency')" item-text="name"
                                        item-value="value" :items="planTypes" outlined class="text-box"
                                        @change="handleSelectValue(this)" />
                                </div>
                            </b-col>
                            <b-col cols="6">
                                <div class="input-wrap">
                                    <v-text-field @keypress="onlyNumber" v-model="form.additional_price"
                                        :label="$t('form.additional_user_price')" outlined :rules="required" />
                                </div>
                            </b-col>
                            <b-col cols="6">
                                <div class="input-wrap">
                                    <v-text-field @keypress="onlyNumber" v-model="form.free_trial_months"
                                        :label="$t('form.free_trial_months')" outlined />
                                </div>
                            </b-col>
                            <b-col cols="6">
                                <div class="input-wrap">
                                    <v-text-field v-model="form.description" :label="$t('form.description')" :rules="required"
                                        outlined />
                                </div>
                            </b-col>

                                <b-col cols="12">
                                    <div class="font-bold h5">
                                        {{ $t('title.access_modules') }}
                                    </div>
                                </b-col>

                            <b-col cols="3">
                                    <v-checkbox v-model="form.plan_detail.deviation" :label="$t('form.deviations')"
                                        class="md-line-height" />
                                </b-col>
                                <b-col cols="3">
                                    <v-checkbox v-model="form.plan_detail.goal" :label="$t('form.goals')"
                                        class="md-line-height" />
                                </b-col>
                                <b-col cols="3">
                                    <v-checkbox v-model="form.plan_detail.risk" :label="$t('form.risk_areas')"
                                        class="md-line-height" />
                                </b-col>
                                <b-col cols="3">
                                    <v-checkbox v-model="form.plan_detail.task" :label="$t('form.tasks')"
                                        class="md-line-height" />
                                </b-col>
                                <b-col cols="3">
                                    <v-checkbox v-model="form.plan_detail.checklist" :label="$t('form.checklists')"
                                        class="md-line-height" />
                                </b-col>
                                <b-col cols="3">
                                    <v-checkbox v-model="form.plan_detail.routine" :label="$t('form.routines')"
                                        class="md-line-height" />
                                </b-col>
                                <b-col cols="3">
                                    <v-checkbox v-model="form.plan_detail.instruction" :label="$t('form.instructions')"
                                        class="md-line-height" />
                                </b-col>
                                <b-col cols="3">
                                    <v-checkbox v-model="form.plan_detail.document" :label="$t('form.documents')"
                                        class="md-line-height" />
                                </b-col>
                                <b-col cols="3">
                                    <v-checkbox v-model="form.plan_detail.contact" :label="$t('form.contacts')"
                                        class="md-line-height" />
                                </b-col>
                            </b-row>
                    </v-form>
                </v-card-text>
                <v-card-actions class="popup-footer">
                    <v-spacer />
                    <v-btn class="btn-cancel" text @click="close">
                        {{ $t('button.cancel') }}
                    </v-btn>
                    <v-btn class="btn-save" @click="save" :disabled="!settingData.stripe_system || !settingData.fiken_system">
                         {{ currentId ?  $t('button.update') : $t('button.save') }}
                    </v-btn>
                    <v-btn v-if="currentId" class="hse-btn-delete" text @click="dialogDelete = true">
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
                        {{ $t('button.no') }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    name: 'PlanPopup',
    components: {},
    props: {
        openPopup: {
            type: Boolean,
            required: false,
        },
        currentId: {
            type: [String, Number],
        }
    },
    data: () => ({
        formTitle: '',

        form: {
            plan_detail: {}
        },
        planTypes: [
            { name: 'MONTHLY', value: '1' },
            { name: 'QUARTERLY', value: '3' },
            { name: 'HALF YEARLY', value: '6' },
            { name: 'ANNUALLY', value: '12' },
        ],
        settingData: {
            stripe_system:true,
            fiken_system:true,
        },
        dialogConfirmClose: false,
        dialogDelete: false,
        required: [
            v => {
                if (!v || v.length < 1)
                    return 'This is required';
                else return true;
            },
        ],
        onlyNumber(e) {
            if (!(/\d/i.test(e.key))) {
                e.preventDefault();
            }
        },
    }),

    mounted() {
        let that = this;
        that.$nextTick(() => {
            this.checkSetting();
        });
    },

    watch: {
        openPopup(value) {
            if (value) {
                if (this.currentId) {
                    this.editItem(this.currentId);
                } else {
                    this.addNew();
                }
            }
        },
    },

    created() {
        if (this.openPopup) {
            if (this.form) {
                this.editItem(this.currentId);
            } else {
                this.addNew();
            }
        }
    },
    methods: {
        addNew() {
            this.reset();
            this.formTitle = this.$i18n.t('title.new_plan');
        },
        handleSelectValue(value) {
            console.log(value);
        },
        editItem(currentId) {
            let that = this;
            that.formDirty = false;
            that.$nuxt.$loading.start();
            that.formTitle = that.$i18n.t('title.edit_plan');
            that.$store.dispatch('plans/show', currentId).then(result => {
                let selectedItem = this.planTypes.filter((item) => item.value == result.data.plan_type);
                that.form = Object.assign({}, result.data);
                that.form.plan_type = selectedItem[0];
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
        handleDelete() {
            let that = this;
            if (this.currentId) {
                that.$store.dispatch('plans/destroy', this.currentId).then(() => {
                    that.close();
                    that.$nuxt.$loading.finish();
                    that.reloadList();
                    that.$toaster.success(that.$i18n.t('message.success_plan_delete'));
                }).catch((error) => {
                    if (error.response.status == 401) {
                        that.$router.push('/login');
                        that.$toaster.error(that.$i18n.t('message.token_expired'));
                    } else {
                        that.$toaster.error(that.$i18n.t('message.fail_plan_delete'));
                    }
                    that.$nuxt.$loading.finish();
                });

            }
        },

        closeDelete() {
            this.dialogDelete = false;
        },
        close() {
            this.reset();
            this.$emit('closePopup');
            this.dialogDelete = false;
            this.dialogConfirmClose = false;
        },

        reset() {
            setTimeout(() => {
                this.form = {
                    plan_detail: {
                        goal: false,
                        deviation: false,
                        risk: false,
                        task: false,
                        checklist: false,
                        routine: false,
                        instruction: false,
                        document: false,
                        contact: false,
                    },
                };
                this.$refs.form.resetValidation();
            }, 0);
        },

        save() {
            let that = this;
            if (that.$refs.form.validate()) {
                that.$nuxt.$loading.start();
                // update plan
                if (that.currentId) {
                    if (typeof that.form.plan_type === 'object') that.form.plan_type = that.form.plan_type.value
                    that.$store.dispatch('plans/update', that.form).then(function () {
                        that.reloadList();
                        that.$toaster.success(that.$i18n.t('message.success_plan_update'));
                        that.$nuxt.$loading.finish();
                    }).catch((error) => {
                        if (error.response.status == 401) {
                            that.$router.push('/login');
                            that.$toaster.error(that.$i18n.t('message.token_expired'));
                        } else {
                            that.$toaster.error(that.$i18n.t('message.fail_plan_update'));
                        }
                        that.$nuxt.$loading.finish();
                    });
                } else {
                    // create plan
                    that.$store.dispatch('plans/store', that.form).then(function () {
                        that.reloadList();
                        that.$toaster.success(that.$i18n.t('message.success_plan_add_new'));
                    }).catch((error) => {
                        if (error.response.status == 401) {
                            that.$router.push('/login');
                            that.$toaster.error(that.$i18n.t('message.token_expired'));
                        } else {
                            that.$toaster.error(that.$i18n.t('message.fail_plan_add_new'));
                        }
                        that.$nuxt.$loading.finish();
                    });
                }
                that.close();
            }
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
            this.$emit('reloadList');
        },
    },
};
</script>

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
                        <b-col cols="12">
                            <div class="input-wrap">
                                <v-text-field disabled v-model="form.key" label="Key" :rules="required" outlined />
                            </div>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col>
                            <div class="input-wrap">
                                <v-textarea v-model="form.value" :label="$t('form.value')" auto-grow outlined rows="2" row-height="32" :rules="shortDescriptionValidate" />
                            </div>
                        </b-col>
                    </b-row>
                </v-form>
            </v-card-text>
            <v-card-actions class="popup-footer">
                <v-spacer />
                <v-btn class="btn-cancel" text @click="close">
                    {{ $t('button.cancel') }}
                </v-btn>
                <v-btn class="btn-save" @click="save">
                    {{ $t('button.save') }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

</div>
</template>

<script>
export default {
    name: "CouponPopup",
    components: {},
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
            key: "",
            value: "",
        },
        required: [
            v => {
                if (!v || v.length < 1)
                    return 'This is required';
                else return true;
            }
        ],

        dialogConfirmClose: false,
        formDirty: false,
        formTitle: '',
        editMode: false,
        companyArray: []
    }),

    computed: {},

    watch: {
        openPopup(value) {
            if (value) {
                if (this.editedItem) {
                    this.editContent(this.editedItem);
                } else {
                    this.addNew();
                }
            }
        },
    },
    created() {
        if (this.openPopup) {
            if (this.form && this.editMode) {
                this.editContent(this.editedItem);
            } else {
                this.addNew();
            }
        }
    },

    mounted() {
        // this.getContents();
    },

    methods: {
        addNew() {
            this.reset();
            this.formTitle = this.$i18n.t('title.edit_content');
            this.editMode = false;
        },

        editContent(item) {
            this.formTitle = this.$i18n.t('title.edit_content');
            this.form = item
        },

        onlyNumber(e) {
            if (!(/\d/i.test(e.key))) {
                e.preventDefault();
            }
        },

        close() {
            this.reset();
            this.dialogConfirmClose = false;
            this.formDirty = false;
            this.$emit('closePopup');
        },

        reset() {
            setTimeout(() => {
                this.form = Object.assign({}, );
                this.$refs.form.resetValidation();
            }, 0);
        },

        save() {
            let that = this;
            if (that.$refs.form.validate()) {
                that.$nuxt.$loading.start();
                // create
                that.$store.dispatch('setting/update', that.form).then(function () {
                    that.reloadList();
                    that.$toaster.success(that.$i18n.t('message.success_setting_update'));
                }).catch(() => {
                    that.$toaster.error(that.$i18n.t('message.fail_setting_add_new'));
                    // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
                    that.$nuxt.$loading.finish();
                });
                that.close();
            }
        },
        reloadList() {
            this.$emit('reloadList');
        },
    },
};
</script>

<style scoped></style>

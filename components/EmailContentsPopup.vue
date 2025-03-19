<template>
    <div>
        <v-dialog v-model="openPopup" max-width="800px" persistent>
            <v-card class="p-4">
                    <div class="popup-header text-center p-4 text-green " style="font-size: 20px;">
                        {{ formTitle }}
                    </div>
                    <v-form ref="form" v-model="valid" lazy-validation>
                        <div class="d-flex" style="gap: 15px;">
                            <div class="border p-4 rounded" style="max-width: 200px;">
                                <span>{{$t('title.email_content')}}</span>
                                <div class="mt-4">
                                    {{ form.source_code.replaceAll(',' , '') }}
                                </div>
                            </div>
                            <div class="row">
                                <div class="input-wrap col-12">
                                            <v-text-field disabled readonly v-model="form.title" :label="$t('form.title')"
                                                :rules="required" outlined />
                                </div>
                                <div class="input-wrap col-12">
                                            <v-text-field v-model="form.subject" readonly :label="$t('form.subject')"
                                                :rules="required" outlined />
                                </div>
                                <div class="input-wrap col-12">
                                            <v-textarea v-model="form.description" :label="$t('form.description')" auto-grow
                                                outlined rows="2" row-height="32" />
                                </div>
                            </div>
                        </div>
                        <div class="mt-4">
                            <div class="border">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div class="font-weight-bold col-7 text-secondary">SMS CONTENT</div>
                                    <div class="switch-component">
                                        <v-switch @change="handleFreezingDay" v-model="form.is_sms" inset class="right-text" />
                                    </div>
                                </div>
                                <div class="row p-3" v-if="form.is_sms">
                                    <div class="col-4">
                                        <div class="border p-4 rounded">
                                            <span>
                                                {{ form.source_code.replaceAll(',' , '') }}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="col-8" >
                                        <div class="input-wrap">
                                            <v-textarea v-model="form.sms_description" :label="$t('form.description')" auto-grow
                                                outlined rows="2" row-height="32" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="d-flex mt-6" style="gap: 5px;">
                            <v-btn class="w-50 p-2  rounded text-center" @click="close">
                                {{ $t('button.cancel') }}
                            </v-btn>
                            <v-btn class="btn-save p-2 w-50 rounded text-center" @click="save">
                                {{ $t('button.save') }}
                            </v-btn>
                        </div>
                    </v-form>
            </v-card>
        </v-dialog>
    </div>
</template>
    
<script>
export default {
    name: "EContentsPopup",
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
            title: "",
            source_code: "",
            description: "",
            sms_description: "",
            subject: "",
            is_sms: "",
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

    mounted() {},

    methods: {
        editContent(item) {
            this.formTitle = this.$i18n.t('title.edit_content');
            this.form = {
                id: item.id,
                key: item.key,
                title: item.title,
                subject: item.subject,
                source_code: item.source_code,
                description: item.description,
                sms_description: item.sms_description,
                is_sms: item.is_sms,
            }
        },

        onlyNumber(e) {
            if (!(/\d/i.test(e.key))) {
                e.preventDefault();
            }
        },

        handleFreezingDay(val) {
            if (val) {
                this.is_sms = true;
            }
        },

        close() {
            this.dialogConfirmClose = false;
            this.formDirty = false;
            this.$emit('closePopup');
        },

        save() {
            let that = this;
            if (that.$refs.form.validate()) {
                that.$nuxt.$loading.start();
                // create
                that.$store.dispatch('emailContents/update', that.form).then(function () {
                    that.reloadList();
                    that.$toaster.success(that.$i18n.t('message.success_contents_update'));
                }).catch((error) => {
                    if (error.response.status == 401) {
                        that.$router.push('/login');
                        that.$toaster.error(that.$i18n.t('message.token_expired'));
                    } else {
                        that.$toaster.error(that.$i18n.t('message.fail_contents_add_new'));
                    }
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
    
<style scoped>
.text-green {
    color: #87a53a;
}
</style>
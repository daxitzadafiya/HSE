<template>
    <div>
        <v-dialog v-model="openPopup" max-width="800px" persistent>
            <v-card>
                <v-card-text>
                    <div class="popup-header text-center">
                        {{ formTitle }}
                    </div>
                    <div class="input-wrap">
                        <card-input ref="card"></card-input>
                    </div>
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
import CardInput from './CardInput';

export default {
    name: "CardPopup",
    components: {
        CardInput,
    },
    props: {
        openPopup: {
            type: Boolean,
            required: false,
        },
    },
    data: () => ({
        formDirty: false,
        isLoading: false,
        formTitle: '',
        paymentMethod: null,
    }),

    computed: {},

    watch: {
        openPopup(value) {
            if (value) {
                this.addNew();
            }
        },
    },
    created() {
        if (this.openPopup) {
            this.addNew();
        }
    },

    mounted() { },

    methods: {

        addNew() {
            this.reset();
            this.formTitle = this.$i18n.t('title.new_card');
        },

        close() {
            this.reset();
            this.formDirty = false;
            this.$emit('closePopup');
        },

        reset() {
            setTimeout(() => {
                this.form = Object.assign({}, );
            }, 0);
        },

        async save() {

            const paymentMethod = await this.$refs.card.tokenize();
            // if any error tokenizing, we'll bail out
            if (!paymentMethod) {
                this.loading = false;
                return;
            }
            this.paymentMethod = paymentMethod;

            let that = this;
            this.isLoading = true;
            that.$nuxt.$loading.start();
            // create
            that.$store.dispatch('cards/store', {
                payment_method: this.paymentMethod,
            }).then(function () {
                that.reloadList();
                that.$toaster.success(that.$i18n.t('message.success_coupon_add_new'));
                that.$nuxt.$loading.finish();
                this.isLoading = false;
            }).catch((error) => {
                if (error.response.status == 401) {
                    that.$router.push('/login');
                    that.$toaster.error(that.$i18n.t('message.token_expired'));
                } else {
                    that.$toaster.error(that.$i18n.t('message.fail_coupon_add_new'));
                }
                // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
                that.$nuxt.$loading.finish();
                this.isLoading = false;
            });
            that.close();
        },

        reloadList() {
            this.$emit('reloadList');
        },
    },
};
</script>
  
  
<style scoped></style>

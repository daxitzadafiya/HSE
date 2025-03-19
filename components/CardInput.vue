<template>
    <div>
        <div ref="card" class="border border-gray-dark border-b-2 p-3 rounded"></div>
        <p v-if="error" class="text-destructive pt-2">{{ error }}</p>
    </div>
</template>

<script>
    import { loadStripe } from '@stripe/stripe-js';

    export default {
        props: {
        },
        data () {
            return {
                stripe: null,
                elements: null,
                card: null,
                error: null,
                stripeKey: null,
                clientSecret: null,
            };
        },
        mounted: async function () {
            await this.makeIntent();

            this.stripe = await loadStripe(this.stripeKey);
            this.elements = this.stripe.elements();
            this.card = this.elements.create('card', {
                hidePostalCode: true,
                style: {
                    base: {
                        iconColor: '#7048e8',
                        backgroundColor: '#fff',
                        color: '#242038',
                        fontWeight: 500,
                        fontFamily: 'Biotif, sans-serif',
                        fontSize: '16px',
                        fontSmoothing: 'antialiased',
                        '::placeholder': {
                            color: '#92909c',
                        },
                    },
                    invalid: {
                        iconColor: '#fa5252',
                        color: '#fa5252',
                    },
                },
            });

            this.$refs.card && this.card.mount(this.$refs.card);
        },
        methods: {
            makeIntent: async function () {
                let that = this;
                this.isLoading = true;
                that.$nuxt.$loading.start();
                await this.$store.dispatch('subscriptions/stripeCard', {
                    plan: this.plan,
                }).then((result) => {
                    this.stripeKey = result.data.key;
                    this.clientSecret = result.data.intent;
                    this.$nuxt.$loading.finish();
                    this.isLoading = false; 
                }).catch(() => {
                    this.$toaster.error(this.$i18n.t('message.fail_something'));
                    this.$nuxt.$loading.finish();
                    this.isLoading = false;
                });
            },
            async tokenize () {
                this.error = null;
                const { setupIntent, error } = await this.stripe.confirmCardSetup(
                    this.clientSecret,
                    {
                        payment_method: { card: this.card },
                    },
                );
                if (!error) {
                    console.log(setupIntent);
                    return setupIntent.payment_method;
                }

                this.error = error.message;
            },
        },
    };
</script>

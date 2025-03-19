<template>
    <div class="resources-page">
        <b-tabs card>
            <b-tab title="Bills" active>
                <v-container class="mt-5">
                    <v-card>
                        <div class="d-flex w-full p-3 align-items-center">
                            <div>
                                <img width="100" alt="billImg" class="thumbnail" src="https://img.freepik.com/free-vector/payment-background-design_1212-511.jpg">
                            </div>
                            <div class="display-1 no-wrap ml-5">
                                {{ $t('message.frizzed_system_compnay') }}
                            </div>
                        </div>
                    </v-card>
                </v-container>
            </b-tab>
        </b-tabs>
    </div>
</template>
<script>
    export default {
        name: 'bills',
        data: () => ({
            auth: false,
        }),
    };
</script>

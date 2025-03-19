<template>
    <div>
        <v-dialog v-model="openPopup" max-width="800px" persistent>
            <v-card>
                <v-card-actions class="popup-footer">
                    <v-spacer/>
                    <v-btn class="btn-cancel" text @click="close">
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
                    <v-spacer/>
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
    export default {
        name: 'PlanPopup',
        components: {},
        props: {
            openPopup: {
                type: Boolean,
                required: false,
            },
            currentId:{
                type: [String, Number],
            }
        },
        data: () => ({
            dialogConfirmClose: false,
        }),
        
        methods: {
            close () {
                this.reset();
                this.$emit('closePopup');
            },
            reloadList () {
                this.$emit('reloadList');
            },
        },
    };
</script>

<style scoped>

</style>

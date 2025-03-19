<template>
    <div>
        <v-dialog v-model="openPopup" max-width="788px" persistent>
            <v-card>
                <v-card-title class="text-h5 justify-content-center text-capitalize py-6">
                    {{titleMessage}}
                </v-card-title>
                <v-card-text>
                    <div class="px-5 pt-3">

                        {{ addDescription }}

                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn class="btn-cancel" text @click="close">
                        {{ $t('button.cancel') }}
                    </v-btn>

                    <!-- <v-btn class="btn-save" @click="save">
                        {{ $t('button.save') }}
                    </v-btn> -->
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    name: 'ReasonPopup',
    props: {
        documentItem: {
            type: Object,
            required: false,
        },
        openPopup: Boolean,
        categoriesArray: Array,
        
        predefinedLinkArray: {
            type: Array,
            required: false,
        },
        titleMessage:{
            type:String,
            required:false,
        },
        addDescription:{
            type:String,
            required:false,
        }
    },
    data: () => ({
    }),
    watch: {},
    methods: {
        close() {
            this.isEdit = false
            if (this.openPopup) {
                this.$emit('closePopup')
            }
        },
        save() {
            // update
            let that = this
            that.close()
        },
    }
}
</script>

<style scoped>
</style>
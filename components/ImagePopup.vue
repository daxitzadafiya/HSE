<template>
    <div>
        <v-dialog v-model="openPopup" max-width="1100px" class="image-popup" persistent>
            <v-card>
                <v-card-title class="text-h5 justify-content-center text-capitalize py-10">
                    {{ $t('form.image')}}
                </v-card-title>
                <v-card-text >
                    <div class="px-5 pt-3 image-content">
                        <!-- {{addImage}} -->
                        <img :src="addImage"/>
                        <!-- <img :src="require(`../assets/images/background${addImage}`)"/> -->
                    </div>
                </v-card-text>
                <v-card-actions class="pb-8"> 
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
    name: 'ImagePopup',
    props: {
        openPopup: Boolean,
        titleMessage:{
            type:String,
            required:false,
        },
        addImage:{
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
.image-content{
    /* max-height: auto !important; */
    min-height: 640px !important;
    height: 375px;
    text-align: center;
}
.image-content img{
   max-width: fit-content !important;
   max-height: 600px !important;
}
</style>
<template>
  <div>
    <v-dialog v-model="openPopup" max-width="500px">
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
          <v-btn class="btn-cancel" text @click="close">
            {{ $t('button.no') }}
          </v-btn>
          <v-btn class="btn-save" @click="deleteItem">
            {{ $t('button.yes') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    name: "DeleteConfirmPopup",
    components: {},
    props: {
      openPopup: Boolean,
      objectIndex: {
        type: Number,
        required: true,
      },
      isObject: {
        type: Boolean,
        required: false,
      },
    },
    data: () => ({}),

    computed: {},

    watch: {},

    mounted() {},

    created() {},

    methods: {
      // checkDirtyBeforeClose(){
      //   if(this.checkDirtyForm()){
      //     this.dialogConfirmClose = true;
      //   }else{
      //     this.close();
      //   }
      // },
      //
      // checkDirtyForm(){
      //   let that = this;
      //   let result = false;
      //   _.each(that.editedItem, function(value, key, obj) {
      //     if(that.originData && obj[key] && that.originData[key] && obj[key] !== that.originData[key]){
      //       result = true;
      //     }
      //   });
      //   return result;
      // },

      close() {
        this.$emit('closePopup');
        // this.formDirty = false;
      },

      reset() {
        // this.denyEdit = false;
        this.$nuxt.$loading.finish();
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          // this.$refs.form.reset();
          this.$refs.form.resetValidation();
        }, 300);
      },

      deleteItem() {
        this.$emit('deleteItem', {
          index: this.objectIndex,
          isObject: this.isObject,
        });
      },
    },
  };
</script>

<style scoped>

</style>

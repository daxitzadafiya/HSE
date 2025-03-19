<template>
  <div>
    <v-dialog v-model="openPopup" max-width="1125px" persistent>
      <v-card>
        <v-card-text>
          <div class="popup-header text-center">
            {{ $t('form.image') }}
          </div>
          <div class="hse-preview-image text-center">
            <img v-bind:src="previewUrl" alt="img">
          </div>
        </v-card-text>
        <v-card-actions class="popup-footer">
          <v-spacer />
          <v-btn class="btn-cancel" text @click="close">
            {{ $t('button.cancel') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import axios from "axios";

  export default {
    name: 'ViewImagePopup',
    props: {
      openPopup: Boolean,
      objectItem: {
        type: String,
        required: true,
      },
    },
    data: () => ({
      previewUrl: null
    }),

    watch: {
      openPopup(value) {
        if (value) {
          if (this.objectItem) {
            this.getImageSrc(this.objectItem);
          }
        }
      },
    },

    created() {
      if (this.openPopup) {
        if (this.objectItem) {
          this.getImageSrc(this.objectItem);
        }
      }
    },

    methods: {
      // show image
      getImageSrc(url) {
        let that = this;
        let result;
        axios({
          url: url,
          method: 'GET',
          responseType: 'blob', // important
        }).then((response) => {
          result = window.URL.createObjectURL(new Blob([response.data]));
          that.previewUrl = result;
          return result;
        });
      },

      close() {
        this.$emit('closePopup');
      },
    }
  };
</script>

<style scoped>
</style>

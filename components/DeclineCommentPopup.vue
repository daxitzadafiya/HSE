<template>
  <div>
    <v-dialog v-model="openPopup" max-width="700px" persistent>
      <v-card>
        <v-card-title class="text-h5 justify-content-center text-uppercase">
          {{ $t('title.reason_declined_by_responsible') }}
        </v-card-title>
        <v-card-text>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <div>
              {{ editedItem.responsible_comment }}
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions>
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
  export default {
    name: "DeclineCommentPopup",
    components: {},
    props: {
      openPopup: Boolean,
      objectItem: {
        type: Object,
        required: true,
      },
    },
    data: () => ({
      valid: true,
      editedItem: {},
    }),

    watch: {
      objectItem(value) {
        if (value) {
          this.viewComment(this.objectItem);
        }
      },
    },

    methods: {
      viewComment(item) {
        this.editedItem = item;
        if (item.responsible_comment) {
          this.editedItem.responsible_comment = item.responsible_comment.replace(/<[^>]+>/g, '');
        }
      },

      close() {
        if (this.openPopup) {
          this.$emit('closePopup');
        }
      },
    },
  };
</script>

<style scoped>

</style>

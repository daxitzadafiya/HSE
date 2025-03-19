<template>
  <div class="section-required-action">
    <b-row>
      <b-col cols="2">
        <div class="required-action-title">
          <b>{{ $t('form.required_action') }}</b>
        </div>
      </b-col>
      <b-col cols="2">
        <div class="switch-component switch-required-action">
          <label class="left-text">{{ $t('form.none') }}</label>
          <v-switch
            v-model="checkAction"
            :label="$t('form.active')"
            inset
            class="right-text"
          />
        </div>
      </b-col>
      <b-col v-if="checkAction" cols="2">
        <div class="required-action-title">
          <b>{{ $t('form.feedback') }}</b>
        </div>
      </b-col>
      <b-col v-if="checkAction" cols="2">
        <div class="switch-component switch-required-action">
          <label class="left-text">{{ $t('form.no') }}</label>
          <v-switch
            v-model="checkComment"
            :label="$t('form.yes')"
            class="right-text"
            inset
            @change="changeComment"
          />
        </div>
      </b-col>
      <b-col v-if="checkAction" cols="2">
        <div class="required-action-title">
          <b>{{ $t('form.image') }}</b>
        </div>
      </b-col>
      <b-col v-if="checkAction" cols="2">
        <div class="switch-component switch-required-action">
          <label class="left-text">{{ $t('form.no') }}</label>
          <v-switch
            v-model="checkAttachment"
            :label="$t('form.yes')"
            class="right-text"
            inset
            @change="changeAttachment"
          />
        </div>
      </b-col>
    </b-row>
    <RequiredActionPopup
      v-if="checkComment || checkAttachment"
      :open-popup="checkComment || checkAttachment"
      :object-item="objectItem"
      @closePopup="closePopup"
    />
  </div>
</template>
<script>
  import RequiredActionPopup from "./RequiredActionPopup.vue";

  export default {
    name: 'RequiredAction',
    components: {RequiredActionPopup},
    props: {
      objectItem: {
        type: Object,
        required: true,
      },
      isAttendee: {
        type: Boolean,
        required: false,
      },
      editMode: {
        type: Boolean,
        required: false,
      },
      useChecklistOption: {
        type: Boolean,
        required: false,
      },
    },
    data: () => ({
      checkAction: false,
      checkComment: false,
      checkAttachment: false,
    }),

    watch: {
      objectItem(value) {
        if (value) {
          if (this.editMode) {
            // this.editItem(this.objectItem);
          }
        }
      },
    },

    methods: {
      // editItem(item) {
      //   this.checkComment = this.isAttendee ? item['attendee'].required_comment : item['responsible'].required_comment;
      //   this.checkAttachment = this.isAttendee ? item['attendee'].required_attachment : item['responsible'].required_attachment;
      //   this.checkAction = this.checkComment || this.checkAttachment;
      // },
      closePopup() {
        this.checkComment = false;
        this.checkAttachment = false;
        this.$emit('closePopup');

      },

      changeComment(val) {
        if (this.useChecklistOption) {
          this.objectItem.use_checklist_required_comment = val;
        }
      },

      changeAttachment(val) {
        if (this.useChecklistOption) {
          this.objectItem.use_checklist_required_attachment = val;
        }
      },
    },
  };
</script>
<style scoped>
</style>

<template>
  <div class="section-required-action">
    <b-row>
      <b-col cols="2">
        <div class="required-action-title">
          <b>{{ $t('form.required_action') }}</b>
        </div>
      </b-col>
      <b-col cols="2">
        <div class="switch-component">
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
        <div class="required-action-title text-right">
          <b>{{ $t('form.feedback') }}</b>
        </div>
      </b-col>
      <b-col v-if="checkAction" cols="2">
        <div class="switch-component switch-required-action">
          <label class="left-text">{{ $t('form.no') }}</label>
          <v-switch
            v-model="checkComment"
            :label="$t('form.yes')"
            inset
            class="right-text"
            @change="changeComment"
          />
        </div>
      </b-col>
      <b-col v-if="checkAction" cols="2">
        <div class="required-action-title text-center">
          <b>{{ $t('form.image') }}</b>
        </div>
      </b-col>
      <b-col v-if="checkAction" cols="2">
        <div class="switch-component switch-required-action">
          <label class="left-text">{{ $t('form.no') }}</label>
          <v-switch
            v-model="checkAttachment"
            :label="$t('form.yes')"
            inset
            class="right-text"
            @change="changeAttachment"
          />
        </div>
      </b-col>
    </b-row>
  </div>
</template>
<script>
  export default {
    name: 'RequiredComment',
    components: {},
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
      isChecklistOption: {
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
            this.editItem(this.objectItem);
          } else {
            this.addNew();
          }
        }
      },
    },

    methods: {
      addNew() {
        this.checkAction = this.checkComment = this.checkAttachment = false;
      },

      editItem(item) {
        this.checkComment = this.isAttendee ? item['attendee'].required_comment : item['responsible'].required_comment;
        this.checkAttachment = this.isAttendee ? item['attendee'].required_attachment : item['responsible'].required_attachment;
        this.checkAction = this.checkComment || this.checkAttachment;
      },

      changeComment(val) {
        if (this.isAttendee) {
          this.objectItem.attendee_required_comment = val;
        } else {
          this.objectItem.responsible_required_comment = val;
        }

        if(this.isChecklistOption){
          this.objectItem.use_checklist_required_comment=val;
        }
      },

      changeAttachment(val) {
        if (this.isAttendee) {
          this.objectItem.attendee_required_attachment = val;
        } else {
          this.objectItem.responsible_required_attachment = val;
        }

        if(this.isChecklistOption){
          this.objectItem.use_checklist_required_attachment=val;
        }
      },
    },
  };
</script>
<style scoped>
</style>

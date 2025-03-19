<template>
  <div class="pt-4 mb-0">
    <b-row v-if="!reminderItem.is_description">
        <b-col cols="2">
          <div class="bold-title md-line-height">
            {{ $t('form.description') }}
          </div>
        </b-col>
        <b-col cols="4">
          <div class="input-wrap">
            <div class="switch-component default-question-mark">
              <label class="left-text">{{ $t('form.default') }}</label>
              <v-switch
                v-model="reminderItem.is_description"
                :label="$t('form.custom')"
                :readonly="!reminderItem.editPermission"
                inset
                class="right-text"
              />
              <v-badge
                :value="hover"
                right
                transition="slide-x-transition"
                class="hse--icon-question-circle"
              >
                <span slot="badge">{{
                  $t('message.hover_object_description')
                }}</span>
                <v-hover v-model="hover">
                  <i class="fa fa-question-circle"></i>
                </v-hover>
              </v-badge>
            </div>
          </div>
        </b-col>
    </b-row>
    <div v-else class="section-connect-to section-connect-to-reminder mt-6">
      <div class="section-connect-to-label section-connect-to-label-reminder">
        {{ $t('title.description') }}
      </div>
      <div class="switch-component switch-component-small reminder-type-switch default-question-mark">
        <label class="left-text">{{ $t('form.default') }}</label>
        <v-switch
          v-model="reminderItem.is_description"
          :label="$t('form.custom')"
          inset
          class="right-text"
          :readonly="!reminderItem.editPermission"
        />
        <v-badge
          :value="hover"
          right
          transition="slide-x-transition"
          class="hse--icon-smaller-question-circle"
          :content="$t('message.hover_object_description')"
        >
          <v-hover v-model="hover">
            <i class="fa fa-question-circle"></i>
          </v-hover>
        </v-badge>
      </div>
      <b-row class="pt-3 mt-3">
        <b-col cols="12">
          <v-textarea
            rows="3"
            v-model="reminderItem.reminder_description"
            :label="$t('form.description')"
            name="name"
            :rules="required"
            outlined
          />
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'document-reminder-new',

  props: {
    reminderItem: {
      type: Object,
      required: false,
    },
    editMode: {
      type: Boolean,
      required: false,
    },
  },

  data: () => ({
    required: [
      (v) => {
        if (!v || v.length < 1) return 'This is required'
        else return true
      },
    ],
    hover: false,
  }),
}
</script>
<style scoped>
.default-question-mark{
  max-width: 50px;
}
</style>

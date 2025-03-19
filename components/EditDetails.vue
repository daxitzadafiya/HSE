<template>
  <div>
    <div v-if="editArea" :class="addEditorTitle ? 'mt-n6' : 'section-connect-to'" :style="custClass && !addEditorTitle ? 'border: 1px solid #ff5252;' : ''">
      <div class="section-connect-to-label section-connect-to-label-reminder">
        <!-- {{ $t('title.feedback') }} -->
        {{ switchTitle }}
      </div>
      <div
        class="switch-component switch-component-small default-question-mark"
        v-if="switchLabel"
      >
        <label class="left-text">
          <!-- {{ $t('form.none') }} -->
          {{ switchLabel }}
        </label>
        <!-- <v-switch v-model="editArea" :label="$t('form.activate')" class="right-text" /> -->
        <v-switch v-model="editArea" :label="activeSwitch" inset class="right-text" />
      </div>
      <b-row class="pt-3 mt-3">
        <b-col cols="12">
          <div class="input-wrap industry-select-input-wrap" :class="addEditorTitle ? '' : 'pb-6 px-4'">
            <div
              class="cust-label section-connect-to-label"
              v-if="addEditorTitle"
            >
              {{ addEditorTitle }}
            </div>
            <FroalaSuggestionListEditor
              :item="editedItem"
              :predefined-link-array="predefinedLinkArray"
              class="text-editor"
            />
          </div>
        </b-col>
        <span v-if="custClass" class="cust-validation">
              {{'This is required'}}
            </span>
      </b-row>
    </div>
    <b-row v-else>
      <b-col cols="2" class="hse-document-badge-tab">
        <div class="bold-title md-line-height">
          <!-- {{ $t('title.feedback') }} -->
          {{ switchTitle }}
        </div>
      </b-col>
      <b-col cols="4">
        <div class="input-wrap">
          <div class="switch-component default-question-mark">
            <label class="left-text">
              <!-- {{ $t('form.none') }} -->
              {{ switchLabel }}
            </label>
            <!-- <v-switch v-model="editArea" :label="$t('form.activate')"  class="right-text" /> -->
            <v-switch
              v-model="editArea"
              :label="activeSwitch"
              inset
              class="right-text"
            />
          </div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import FroalaSuggestionListEditor from './FroalaSuggestionListEditor'
export default {
  name: 'editDetails',
  components: {
    FroalaSuggestionListEditor,
  },
  props: {

    switchTitle: {
      type: String,
      required: false,
    },
    addEditorTitle: {
      type: String,
      required: false,
    },
    switchLabel: {
      type: String,
      required: false,
    },
    activeSwitch: {
      type: String,
      required: false,
    },
    predefinedLinkArray: {
      type: Array,
      required: false,
    },
    editedItem:{
      type: [Object, Array],
      required:false,
    },
    custClass:{
      type: Boolean,
      required: false,
    }
  },
  data: () => ({
    editArea: true,
    // editedItem: {
    //   description: '',
    // },
    // defaultItem: {
    //   description: '',
    // },
  }),
}
</script>

<style scoped>
.text-editor {
  position: relative;
}

.cust-label {
  z-index: 2;
  width: 77px;
  top: 0;
  left: 3%;
  text-align: center;
}
.cust-validation{
  color: #ff5252 !important;
  caret-color: #ff5252 !important;
  font-size: 12px;
  position: absolute;
  top: 100%;
}
</style>

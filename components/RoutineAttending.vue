<template>
  <div>
    <b-row v-if="!routineAttendingItem.is_attending_activated">
      <b-col cols="2" class="hse-document-badge-tab">
        <div class="bold-title md-line-height">
          {{ $t('title.contacts') }}
        </div>
        <v-badge
            :value="hover"
            right
            transition="slide-x-transition"
            class="hse-badge-icon"
          >
            <span slot="badge">{{ $t('message.hover_extra_attendees') }}</span>
            <v-hover v-model="hover">
              <i class="fa fa-question-circle"></i>
            </v-hover>
          </v-badge>
      </b-col>
      <b-col cols="4">
        <div class="input-wrap">
          <div class="switch-component default-question-mark">
            <label class="left-text">{{ $t('form.none') }}</label>
            <v-switch
              v-model="routineAttendingItem.is_attending_activated"
              :label="$t('form.add')"
              :readonly="!routineAttendingItem.editPermission"
              inset
              class="right-text"
            />
          </div>
        </div>
      </b-col>
    </b-row>
    <div v-else class="section-connect-to section-connect-to-reminder">
      <div class="section-connect-to-label section-connect-to-label-reminder">
        {{ $t('title.contacts') }}
      </div>
      <div class="switch-component switch-component-small default-question-mark">
        <label class="left-text">{{ $t('form.none') }}</label>
        <v-switch
          v-model="routineAttendingItem.is_attending_activated"
          :label="$t('form.add')"
          inset
          class="right-text"
          :readonly="!routineAttendingItem.editPermission"
        />
      </div>
      <b-row class="pt-3 mt-3">
<!--        <b-col cols="6">-->
<!--          <div class="input-wrap industry-select-input-wrap">-->
<!--            <MultipleSelection-->
<!--              :item="routineAttendingItem"-->
<!--              :selected-items-input="routineAttendingItem.attending_emps"-->
<!--              :label="$t('form.attendees_employee')"-->
<!--              :item-text="'name'"-->
<!--              :item-value="'id'"-->
<!--              :list-option-input="editMode ? attendingArray : newAttendingArray"-->
<!--              :disabled="newAttendingArray.length <= 0"-->
<!--              @getSelectedItems="getSelectedAttendingItems"-->
<!--            />-->
<!--          </div>-->
<!--        </b-col>-->
        <b-col cols="12">
          <div class="input-wrap industry-select-input-wrap">
            <MultipleSelection
              :item="routineAttendingItem"
              :selected-items-input="routineAttendingItem.attending_contact"
              :label="$t('form.attendees_contact')"
              :item-text="'name'"
              :item-value="'id'"
              :list-option-input="contactsArray"
              @getSelectedItems="getSelectedAttendingContactItems"
            />
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>
<script>
  import cookies from "js-cookie";
  import MultipleSelection from "./MultipleSelection";

  export default {
    name: "RoutineAttending",
    components: {
      MultipleSelection,
    },
    props: {
      routineAttendingItem: {
        type: Object,
        required: false,
      },
      editMode: {
        type: Boolean,
        required: false,
      },
      // newAttendingArray: {
      //   type: Array,
      //   required: false,
      // },
      // attendingArray: {
      //   type: Array,
      //   required: false,
      // },
      contactsArray: {
        type: Array,
        required: false,
      },
    },
    data: () => ({
      checkAdmin: cookies.get('checkAdmin'),
      roleUser: cookies.get('roleUser'),
      permissionsUser: localStorage.getItem('permissionsKey'),
      userLogged: parseInt(cookies.get('userID')),
      hover:false,
    }),

    watch: {
      routineAttendingItem(value) {
        if (value) {
          if (this.editMode) {
            this.editItem(this.routineAttendingItem);
          }
        }
      },
    },

    mounted() {},

    created() {},

    methods: {
      editItem(item) {
        return item;
      },

      // getSelectedAttendingItems(value) {
      //   this.routineAttendingItem.attending_emps = value.selectedItemsOutput;
      // },

      getSelectedAttendingContactItems(value) {
        this.routineAttendingItem.attending_contact = value.selectedItemsOutput;
      },
    }
  };
</script>
<style scoped>
.default-question-mark{
  max-width: 50px;
}
</style>

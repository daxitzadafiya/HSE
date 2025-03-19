<template>
  <div>
  <div class="d-flex justify-center">
    <v-chip
      v-if="status === 'New' || status === 'new' || status == '1'"
      class="info-item status-label-custom pending"
      :class="inReview ? 'review-btn' : 'status-btn'"
      label
    >
      {{ $t('form.new') }}
    </v-chip>
    <v-chip
      v-if="status == 3 || status == 'closed'"
      class="status-label-custom approved"
      :class="inReview ? 'review-btn' : 'status-btn'"
      label
    >
      {{ $t('form.closed') }}
    </v-chip>
    <v-chip
      v-if="status === 'disapproved'"
      class="info-item status-label-custom not-done"
      :class="inReview ? 'review-btn' : 'status-btn'"
      label
    >
      {{ $t('form.disapproved') }}
    </v-chip>
    <v-hover
    :disabled="!inReview"
      v-if="status === 'disapproved_overdue'"
      v-slot:default="{ hover }"
    >
      <v-badge
        :value="hover"
        right
        transition="slide-x-transition"
        class="hse--icon-question-circle deadline-hover"
      >
        <span slot="badge">
          {{ 'Overdue Deadline' }}
        </span>
        <v-chip class="status-label-custom not-done" :class="inReview ? 'review-btn' : 'status-btn'" label>
          {{ $t('form.disapproved') }}
          <div role="button" class="ms-2">
            <img src="../assets/images/icon/alert-white.png" alt="" srcset="" />
          </div>
        </v-chip>
      </v-badge>
    </v-hover>
    <v-hover
    :disabled="!inReview"
      v-if="status === 'disapproved_with_extended'"
      v-slot:default="{ hover }"
    >
      <v-badge
        :value="hover"
        right
        transition="slide-x-transition"
        class="hse--icon-question-circle deadline-hover"
      >
        <span slot="badge">
          {{ 'Deadline Extended' }}
        </span>
        <v-chip class="status-label-custom ongoing" :class="inReview ? 'review-btn' : 'status-btn'" label>
          {{ $t('form.disapproved') }}
          <div role="button" class="ms-2">
            <img src="../assets/images/icon/alert.png" alt="" srcset="" />
          </div>
        </v-chip>
      </v-badge>
    </v-hover>
    <!-- <v-chip
      v-if="status === 'disapproved_with_extended'"
      class="info-item status-label-custom ongoing"
      :class="inReview ? '' : 'status-btn'"
      label
    >
      {{ $t('form.disapproved') }}
      <div role="button" class="ms-2">
        <img src="../assets/images/icon/alert.png" alt="" srcset="" />
      </div>
    </v-chip> -->
    <!-- <v-chip
      v-if="status === 'overdue'"
      class="info-item status-label-custom ongoing"
      :class="inReview ? '' : 'status-btn'"
      label
    >
      {{ $t('form.ongoing') }}
      <div role="button" class="ms-2">
        <img src="../assets/images/icon/alert.png" alt="" srcset="" />
      </div>
    </v-chip> -->
    <v-hover  v-if="status === 'overdue'" v-slot:default="{ hover }">
      <v-badge
        :value="hover"
        right
        transition="slide-x-transition"
        class="hse--icon-question-circle deadline-hover"
      >
        <span slot="badge">
          {{extended_date ? 'Deadline Extended': 'Overdue Deadline'}}
        </span>
        <v-chip class="status-label-custom ongoing" :class="inReview ? 'review-btn' : 'status-btn'" label>
          {{ $t('form.ongoing') }}
          <div role="button" class="ms-2">
            <img src="../assets/images/icon/alert.png" alt="" srcset="" />
          </div>
        </v-chip>
      </v-badge>
    </v-hover>
    <v-chip
      v-if="status === 'ongoing' || status == '2' || status === 'timeline_disapproved'"
      class="info-item status-label-custom ongoing"
      :class="inReview ? 'review-btn' : 'status-btn'"
      label
    >
      {{ $t('form.ongoing') }}
    </v-chip>
    <v-hover
    :disabled="!inReview"
      v-if="status === 'completed_overdue'"
      v-slot:default="{ hover }"
    >
      <v-badge
        :value="hover"
        right
        transition="slide-x-transition"
        class="hse--icon-question-circle deadline-hover"
      >
        <span slot="badge">
          {{ 'Overdue Deadline' }}
        </span>

        <v-chip class="status-label-custom approved" :class="inReview ? 'review-btn' : 'status-btn'" label>
          {{ $t('form.completed') }}
          <div role="button" class="ms-2">
            <img src="../assets/images/icon/alert-white.png" alt="" srcset="" />
          </div>
        </v-chip>
      </v-badge>
    </v-hover>
    <v-chip
      v-if="status === 'completed'"
      class="info-item status-label-custom" :class="(inReview ? (inRisk ? 'completed review-btn' : 'approved review-btn') : (inRisk ? 'completed status-btn' : 'status-btn approved'))"
      label
    >
      {{ $t('form.completed') }}
    </v-chip>
    <v-chip
      v-if="status === 'request'"
      class="info-item status-label-custom ongoing"
      :class="inReview ? 'review-btn' : 'status-btn'"
      label
    >
      {{ $t('form.request') }}
    </v-chip>

    <v-chip
      v-if="status === 'approved'"
      class="info-item status-label-custom approved"
      :class="inReview ? 'review-btn' : 'status-btn'"
      label
    >
      {{ $t('form.approved') }}
    </v-chip>
    <v-hover
    :disabled="!inReview"
      v-if="status === 'approved_overdue'"
      v-slot:default="{ hover }"
    >
      <v-badge
        :value="hover"
        right
        transition="slide-x-transition"
        class="hse--icon-question-circle deadline-hover"
      >
        <span slot="badge">
          {{ 'Overdue Deadline' }}
        </span>

        <v-chip class="status-label-custom approved" :class="inReview ? 'review-btn' : 'status-btn'" label>
          {{ $t('form.approved') }}
          <div role="button" class="ms-2">
            <img src="../assets/images/icon/alert-white.png" alt="" srcset="" />
          </div>
        </v-chip>
      </v-badge>
    </v-hover>
    <v-chip
      v-if="status === 'Reassigned'"
      class="info-item status-label-custom not-done"
      :class="inReview ? 'review-btn' : 'status-btn'"
      label
    >
      {{ $t('form.reassigned') }}
      <!-- <div class="ms-2">
        <img src="../assets/images/icon/alert-white.png" alt="" srcset="" />
      </div> -->
    </v-chip>
    <v-chip
      v-if="status == 'Removed'"
      class="status-btn status-label-custom not-done"
      label
    >
      {{ $t('form.removed') }}
    </v-chip>
    <div
      class="d-flex align-center"
      v-if="
        inReview &&
        (status === 'approved' ||
          status === 'approved_overdue' ||
          status === 'completed' ||
          status === 'completed_overdue')
      "
    >
      <img
        v-if="addDescription != null"
        class="icon-img ms-3"
        src="../assets/images/gridIcon/fillNote.png"
        alt="fillNote.png"
        @click="openComment = true"
      />
      <img
        v-if="addImage"
        src="../assets/images/icon/image-green.png"
        class="ms-2 mb-n1"
        @click="openImage = true"
      />
    </div>
    </div>

    <ReasonPopup
      :open-popup="openComment"
      @closePopup="openComment = !openComment"
      :titleMessage="$t('form.feedback')"
      :addDescription="addDescription"
    />

    <ImagePopup
      :open-popup="openImage"
      @closePopup="openImage = !openImage"
      :titleMessage="$t('form.image')"
      :addImage="addImage"
    />
  </div>
</template>

<script>
import ImagePopup from './ImagePopup.vue'
import ReasonPopup from './ReasonPopup.vue'
export default {
  components: { ReasonPopup, ImagePopup },
  name: 'status-chip',
  props: {
    status: {
      type: String,
      required: false,
    },
    inReview: {
      type: Boolean,
      required: false,
    },
    inRisk: {
      type: Boolean,
      required: false,
    },
    addDescription: {
      type: String,
      required: false,
    },
    addImage: {
      type: String,
      required: false,
    },
    extended_date:{
      type: Boolean,
      required: false,
    }
  },
  data() {
    return {
      openComment: false,
      openImage: false,
      hover: false,
    }
  },
}
</script>

<style scoped>
.status-btn {
  width: 130px;
}
:deep(.deadline-hover .v-badge__wrapper .v-badge__badge){
  background-color: #666768 !important;
  inset: auto auto calc(100% - -3px) calc(-72% - -137px) !important;
}
.review-btn{
  width: 130px;
}
</style>
<template>
  <div class="review-popup">
    <div class="review-popup-table normal-table">
      <!-- Progress bar -->
      <div class="info-block progress-field w-50">
        <div class="label-item">
          {{ $t('form.progress') }}:
        </div>
        <div class="info-item">
          <v-progress-linear
            height="25"
            :color="objectItem.rate === 0 ? 'rgb(231,134,134)' : objectItem.rate === 100 ? 'rgb(153,213,128)' : 'rgb(255,214,101)'"
            :value="objectItem.rate"
          >
            <strong class="font-weight-bold" style="color: #141b04">
              {{ objectItem.rate }}%
            </strong>
          </v-progress-linear>
        </div>
      </div>

      <!-- Function -->
      <div class="info-block w-50">
        <div class="label-item">
          {{ $t('form.function') }}:
        </div>
        <div class="info-item">
          <span>{{ $t('form.risk_analysis') }}</span>
          <v-icon>
            mdi-chevron-right
          </v-icon>
          <span>{{ $t('form.task') }}</span>
        </div>
      </div>

      <!-- Name -->
      <div class="info-block w-50">
        <div class="label-item">
          {{ $t('form.name') }}:
        </div>
        <div class="info-item" @click="(checkAdmin || objectItem.checkCreator) ? viewItem(objectItem) : (isEdit = false)">
          {{ objectItem.name }}
        </div>
      </div>

      <!-- Category -->
      <div class="info-block w-50">
        <div class="label-item">
          {{ $t('form.category') }}:
        </div>
        <div class="info-item" @click="(checkAdmin || objectItem.checkCreator) ? viewItem(objectItem) : (isEdit = false)">
          {{ objectItem.categoryName }}
        </div>
      </div>

      <!-- Description -->
      <div :class="isEdit ? 'info-block' : 'info-block description'">
        <div class="label-item">
          {{ $t('form.description') }}:
        </div>
        <div class="info-item" @click="(checkAdmin || objectItem.checkCreator) ? viewItem(objectItem) : (isEdit = false)">
          {{ objectItem.description }}
        </div>
      </div>

      <!-- Added by -->
      <div class="info-block w-50">
        <div class="label-item">
          {{ $t('form.added_by') }}:
        </div>
        <div class="info-item">
          {{ objectItem.addedByName }}
        </div>
      </div>

      <!-- Responsible -->
      <div class="info-block chip w-50">
        <div class="label-item">
          {{ $t('form.responsible') }}:
        </div>
        <div class="info-item" @click="(checkAdmin || objectItem.checkCreator) ? viewItem(objectItem) : (isEdit = false)">
          <v-chip
            v-for="(item, index) in objectItem.responsibleName"
            :key="index"
            class="mr-2 mb-1 chip-custom"
            small
          >
            {{ item }}
          </v-chip>
        </div>
      </div>

      <!-- Start date -->
      <div class="info-block w-50">
        <!-- View -->
        <div class="label-item">
          {{ $t('form.start_date') }}:
        </div>
        <div
          class="info-item"
          @click="(checkAdmin || objectItem.checkCreator) ? viewItem(objectItem) : (isEdit = false)"
        >
          {{ moment(objectItem.start_date).format('DD.MM.YYYY h:mm A') }}
        </div>
      </div>

      <!-- Deadline -->
      <div class="info-block w-50">
        <!-- View -->
        <div class="label-item">
          {{ $t('form.deadline') }}:
        </div>
        <div
          class="info-item"
          @click="(checkAdmin || objectItem.checkCreator) ? viewItem(objectItem) : (isEdit = false)"
        >
          {{ moment(objectItem.deadline).format('DD.MM.YYYY h:mm A') }}
        </div>
      </div>
    </div>

    <!-- Attendee -->
    <div
      v-if="checkAdmin || objectItem.checkCreator || objectItem.checkResponsible"
      class="review-popup-table"
    >
      <v-data-table
        :headers="computedHeaders"
        :items="objectItem.processingInfo"
        class="elevation-1 review-table"
        :items-per-page="15"
        :single-expand="true"
        :sort-by="['created_at']"
        :sort-desc="[true, false]"
        hide-default-footer
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title class="component-sub-goal">
              {{ $t('form.attendee') }}
              <v-icon class="icon-plus-circle ml-2">
                mdi-plus-circle
              </v-icon>
<!--              <v-icon>-->
<!--                mdi-update-->
<!--              </v-icon>-->
            </v-toolbar-title>
          </v-toolbar>
        </template>
        <template v-slot:item.comment="{ item }">
          <span v-if="item.comment">{{ item.comment }}</span>
          <span v-else>N/A</span>
        </template>
        <template v-slot:item.image="{ item }">
          <span v-if="item.image">
            <v-icon class="icon-custom image">mdi-image</v-icon>
          </span>
          <span v-else>N/A</span>
        </template>
        <template v-slot:item.status="{ item }">
          <v-chip
            v-if="item.status === 'new'"
            class="ma-2 status-label-custom pending"
            label
          >
            {{ $t('form.new') }}
          </v-chip>
          <v-chip
            v-else-if="item.status === 'pending'"
            class="ma-2 status-label-custom pending"
            label
          >
            {{ $t('form.pending') }}
          </v-chip>
          <v-chip
            v-else-if="item.status === 'ongoing'"
            class="ma-2 status-label-custom ongoing"
            label
          >
            {{ $t('form.ongoing') }}
          </v-chip>
        </template>
        <template v-slot:no-data>
          {{ $t('table.no_data') }}
        </template>
      </v-data-table>
    </div>

    <!-- TASK - popup edit review -->
    <TaskReviewPopup
      v-if="checkAdmin || objectItem.checkCreator || objectItem.checkResponsible"
      :open-popup="checkShowItem"
      :object-item="editedItem"
      :edit-mode="true"
      :categories-array="categoriesArray"
      :predefined-link-array="predefinedLinkArray"
      @closePopup="checkShowItem = !checkShowItem"
      @reloadList="reloadList"
    />
  </div>
</template>

<script>
  import cookies from "js-cookie";
  import TaskReviewPopup from "./TaskReviewPopup";

  export default {
    name: "TaskReviewInReviewPopup",
    components: {
      TaskReviewPopup,
    },
    props: {
      objectItem: {
        type: Object,
        required: true,
      },
      categoriesArray: {
        type: Array,
        required: true,
      },
      predefinedLinkArray: {
        type: Array,
        required: false,
      },
    },
    data: () => ({
      checkAdmin: cookies.get('checkAdmin'),
      today: new Date().toISOString().substr(0, 10),
      valid: true,
      required: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else return true;
        }
      ],
      isEdit: false,
      editedItem: {},
      checkShowItem: false,
    }),

    computed: {
      headers() {
        return [
          {text: this.translateCol('employee_name'), value: 'attendeeName', align: 'left'},
          {text: this.translateCol('comment'), value: 'comment', align: 'center'},
          {text: this.translateCol('image'), value: 'image', align: 'center'},
          {text: this.translateCol('status'), value: 'status', align: 'center'},
          {text: this.translateCol('actions'), value: 'actions', align: 'center'},
        ];
      },

      computedHeaders () {
        if (this.checkAdmin || this.objectItem.checkCreator || this.objectItem.checkResponsible) {
          return this.headers;
        } else {
          return [];
        }
      },
    },

    watch: {},

    mounted() {},

    created() {},

    methods: {
      viewItem(item) {
        this.checkShowItem = true;
        this.editedItem = item;
      },

      // compareDate(start) { // check if start date yet
      //   const [year, month, day] = start.split('-');
      //   const [yearToday, monthToday, dayToday] = this.today.split('-');
      //   return yearToday > year || (yearToday <= year && monthToday > month) || (yearToday <= year && monthToday <= month && dayToday > day);
      // },

      // compareToday(start) { // check if start date = today
      //   const [year, month, day] = start.split('-');
      //   const [yearToday, monthToday, dayToday] = this.today.split('-');
      //   return yearToday === year && monthToday === month && dayToday === day;
      // },

      translateCol (colName) {
        return this.$i18n.t('column.' + colName);
      },

      reloadList() {
        this.$emit('reloadList');
      },
    },
  };
</script>

<style scoped>
</style>

<template>
  <div>
    <v-data-table
      :headers="infoItem?.routine ? routineHeaders : taskHeader"
      :items="arrayItem"
      class="elevation-1 review-table review-popup-table mb-0"
      :items-per-page="15"
      :single-expand="true"
      :sort-by="['created_at']"
      :sort-desc="[true, false]"
      hide-default-footer
      @click:row="openInfo"
    >
      <template slot="top">
        <v-toolbar flat>
          <v-toolbar-title>
            {{ infoItem?.routine ? $t('Routine')  : $t('form.task') }}
          </v-toolbar-title>
        </v-toolbar>
      </template>
       <template v-slot:header.statusValue="{ header }">
            <div v-if="routineTaskFeild">{{ $t('column.status') }}</div>
          </template>
      <template v-slot:item.name="{ item }">
        <span>
          {{ item.name }}
        </span>
      </template>
      <template v-slot:item.totalAttendees="{ item }">
        <span >
          {{ item.totalAttendee ? item.totalAttendee : '0' }}
        </span>
      </template>
      <template v-slot:item.added_by="{ item }">
        <span >
          {{ item.addedByName }}
        </span>
      </template>
      <template v-slot:item.responsible="{ item }">
          <div
                    v-for="(item, index) in item.responsible.employeeName"
                    :key="index"
                  >
                    {{ item }}
                  </div>
      </template>
      
      <template v-slot:item.recurring="{ item }">
        <span >
          {{ item.routine.recurring }}
        </span>
      </template>
      <template v-slot:item.deadline="{ item }">
        <span >
          {{ !item.deadline ? 'Indefinite' : moment(item.deadline).format('DD.MM.YYYY') }}
        </span>
      </template>
      <template v-slot:item.start_date="{ item }">
        <span >
          {{ moment(item.start_date).format('DD.MM.YYYY') }}
        </span>
      </template>
      <template v-slot:item.statusValue="{ item }" v-if="routineTaskFeild == true">
         <!-- <v-chip
              v-if="item.status === 'new' || item.status === 1 || item.status === '1' || item.status === 'New'"
              class="status-btn status-label-custom pending"
              label
            >
              {{ $t('form.new') }}
            </v-chip>
            <v-chip
              v-if="item.status === 'pending' || item.status === 6 || item.status === '6'"
              class="status-btn status-label-custom pending"
              label
            >
              {{ $t('form.pending') }}
            </v-chip>
            <v-chip
              v-if="item.status === 'ongoing' || item.status === 2 || item.status === '2' || item.status === 'timeline_disapproved'"
              class="status-btn status-label-custom ongoing"
              label
            >
              {{ $t('form.ongoing') }}
            </v-chip>
            <v-chip
              v-if="item.status === 'closed' || item.status === 3 || item.status === '3'"
              class="status-btn status-label-custom approved"
              label
            >
              {{ $t('form.closed') }}
            </v-chip>
            <v-chip
            v-else-if="item.status === 'disapproved' "
            class="info-item status-label-custom not-done"
            label
          >
            {{ $t('form.disapproved') }}
          </v-chip>
          <v-chip
            v-else-if="item.status === 'disapproved_overdue'"
            class="info-item status-label-custom not-done"
            label
          >
            {{ $t('form.disapproved') }}
            <div role="button" class="ms-2">
              <img src="../assets/images/icon/alert-white.png" alt="" srcset="" />
            </div>
          </v-chip>
          <v-chip
            v-else-if="item.status === 'disapproved_with_extended'"
            class="info-item status-label-custom ongoing"
            label
          >
            {{ $t('form.disapproved') }}
            <div role="button" class="ms-2">
                    <img
                      src="../assets/images/icon/alert.png"
                      alt=""
                      srcset=""
                    />
                  </div>
          </v-chip>
          <v-chip
            v-else-if="item.status === 'overdue'"
            class="info-item status-label-custom ongoing"
            label
          >
            {{ $t('form.ongoing') }}
            <div role="button" class="ms-2">
              <img src="../assets/images/icon/alert.png" alt="" srcset="" />
            </div>
          </v-chip>
          <v-chip
            v-else-if="item.status === 'completed'"
            class="info-item status-label-custom approved"
            label
          > -->
            <!-- {{ $t('form.completed') }}
          </v-chip>
          <v-chip
            v-else-if="item.status === 'completed_overdue'"
            class="info-item status-label-custom approved"
            label
          >
            {{ $t('form.completed') }}
            <div role="button" class="ms-2">
              <img
                src="../assets/images/icon/alert-white.png"
                alt=""
                srcset=""
              />
            </div>
          </v-chip>
          <v-chip
            v-else-if="item.status === 'request'"
            class="info-item status-label-custom ongoing"
            label
          >
            {{ $t('form.request') }}
          </v-chip>

          <v-chip
            v-else-if="item.status === 'approved'"
            class="info-item status-label-custom approved"
            label
          >
            {{ $t('form.approved') }}
          </v-chip>
          <v-chip
            v-else-if="item.status === 'approved_overdue'"
            class="info-item status-label-custom approved"
            label
          >
            {{ $t('form.approved') }}
            <div role="button" class="ms-2">
              <img
                src="../assets/images/icon/alert-white.png"
                alt=""
                srcset=""
              />
            </div>
          </v-chip>
          <v-chip
            v-else-if="
              item.status === 'Reassigned' || item.status === 'Removed'
            "
            class="info-item status-label-custom not-done"
            label
          >
            {{ $t('form.removed') }}
            <div class="ms-2">
              <img
                src="../assets/images/icon/alert-white.png"
                alt=""
                srcset=""
              />
            </div>
          </v-chip> -->

          <status-chip :inReview="false" :inRisk="false" :status="item.status"
          />
      </template>
    </v-data-table>

    <new-fold-info
      v-if="openEmployeeTable && !hideTaskTableData"
      :foldingItem="foldItem"
      :isOpen="isOpen"
      :processingItem="processingItem"
      :checkEdit="checkEdit"
      :routineTaskFeild="routineTaskFeild"
      :durationData="durationData"
      :category_type="category_type"
      :hideTimeExtendedRequest="hideTimeExtendedRequest"
      @saveInfo="saveInfo"
      @sendRequest="sendRequest"
    />
  </div>
</template>

<script>
import NewFoldInfo from './NewFoldInfo.vue'
import StatusChip from './StatusChip.vue'
export default {
  name: 'foldingInfoTable',
  components: { NewFoldInfo, StatusChip },
  props: {
    infoItem: {
      type: Object,
      required: false,
    },
    arrayItem: {
      type: Array,
      required: false,
    },
    docItem: {
      type: Object,
      required: false,
    },
    openEmployeeTable: {
      type: Boolean,
      required: false,
    },
    processingItem: {
      type: Object,
      required: false,
    },
    checkEdit: {
      type: Boolean,
      required: false,
    },
    routineTaskFeild: {
      type: Boolean,
      required: false,
    },
    durationData:{
         type: Object,
        required: false,
      },
      category_type:{
        type: String,
        required: false,
      },
      hideTaskTableData:{
        type: Boolean,
        required: false,
        default: false
      },
      hideTimeExtendedRequest:{
        type: Boolean,
        required: false,
        default: false
      }

  },
  data() {
    return {
      foldItem: this.infoItem,
      // openItem: false,
      isOpen: false,
      checkCreator: false,
      userProgressColor: '',
      userRate: '',
      total_rate: '',
      checkEditItem: false,
      checkSave:true,
      // openEmployeeTable:this.openEmployeeTable
    }
  },
  watch:{
    infoItem(item){
      this.foldItem = item
    }
  },
  computed: {
    taskHeader() {
      return [
        {
          text: this.translateCol('name'),
          value: 'name',
          align: 'center',
          sortable: false,
        },
        {
          text: this.translateCol('total_attendee'),
          value: 'totalAttendees',
          align: 'center',
          sortable: false,
        },
        {
          text: this.translateCol('start_date'),
          value: 'start_date',
          align: 'center',
          sortable: false,
        },
        {
          text: this.translateCol('deadline'),
          value: 'deadline',
          align: 'center',
          sortable: false,
        },
        {
          text: this.translateCol('status'),
          value: 'statusValue',
          align: 'center',
          sortable: false,
        },
      ]
    },
    routineHeaders() {
      return [
        {
          text: this.translateCol('name'),
          value: 'name',
          align: 'left',
          width: '15%',
          sortable: false,
        },
        {
          text: this.translateCol('added_by'),
          value: 'added_by',
          align: 'center',
          width: '12%',
          sortable: false,
        },
        {
          text: this.translateCol('responsible'),
          value: 'responsible',
          align: 'center',
          width: '14%',
          sortable: false,
        },
        {
          text: this.translateCol('total_attendee'),
          value: 'totalAttendees',
          align: 'center',
          width: '10%',
          sortable: false,
          
        },
        {
          text: this.translateCol('activation'),
          value: 'start_date',
          align: 'center',
          width: '13%',
          sortable: false,
        },
        {
          text: this.translateCol('frequency'),
          value: 'recurring',
          align: 'center',
          width: '13%',
          sortable: false,
        },
        {
          text: this.translateCol('deactivation'),
          value: 'deadline',
          align: 'center',
          width: '16%',
          sortable: false,
        },
        {
          text: this.translateCol('status'),
          value: 'statusValue',
          align: 'center',
          sortable: false,
        },
      ]
    },
  },

  methods: {
    translateCol(colName) {
      return this.$i18n.t('column.' + colName)
    },
    openInfo(item) {
      console.log(item);
      this.checkEditItem = this.checkEdit
      this.openEmployeeTable = !this.openEmployeeTable
      this.isOpen = true
      this.$emit('openInfo', this.openEmployeeTable)
    },
    saveInfo() {
      this.isOpen = false
      this.openEmployeeTable = false
      this.$emit('saveInfo', this.docItem , this.checkSave )
      this.$emit('openInfo', this.openEmployeeTable)

    },
    sendRequest() {
      this.$emit('sendRequest')
    },
    // reloadList() {
    //   this.$emit('reloadList')
    // },
  },
}
</script>

<style>
</style>
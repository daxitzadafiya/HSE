<template>
  <div>
    <UnwantedEventPopup
      :openPopup="checkShowItem"
      :viewOnly="viewOnly"
      :unwantedEventItem="editedItem"
      :projectArray="projectArray"
      @closePopup="checkShowItem = !checkShowItem"
      @reloadList="reloadList"
      @showItem="showItem"
    />

    <v-data-table
      :headers="computedHeaders"
      :items="listArray"
      class="elevation-1 hse-table"
      :items-per-page="15"
      :single-expand="true"
      :search="search"
      :sort-by="['created_at']"
      :sort-desc="[true, false]"
      @click:row="editItem"
    >
      <template v-slot:header="{ props: { headers } }">
        <h4 class="table-name">
          Unwanted Events
        </h4>
      </template>

      <template v-slot:item.start="{ item }">
        {{ moment(item.start).format('DD.MM.YYYY') }}
      </template>

      <template v-slot:no-data>
        {{ $t('table.no_data') }}
      </template>
    </v-data-table>
  </div>
</template>

<script>
  import cookies from 'js-cookie';
  import UnwantedEventPopup from "./UnwantedEventPopup";

  export default {
    name: "UnwantedEventTable",
    components: {
      UnwantedEventPopup,
    },
    props: {
      projectArray: {
        type: Array,
        required: false,
      },
      listArrayInput: Array,
      viewOnly: {
        type: Boolean,
        required: false,
      },
    },
    data: () => ({
      userRoleId: parseInt(cookies.get('roleID')),
      userDepartmentID: parseInt(cookies.get('userDepartmentID')),
      pageKey: 'reports-unwantedEvents-unwantedEvents',
      permissionsUser: localStorage.getItem('permissionsKey'),
      nowDate: new Date().toISOString().substr(0, 10),
      search: '',
      headers: [
        { text: 'Date', value: 'start', align: 'left', sortDesc: false },
        { text: 'Title', value: 'title', align: 'left' },
      ],
      listArray: [],
      editedItem: {
        company_id: '',
        added_by: '',
        start: '',
        end: '',
        project_id: '',
        title: '',
        event_id: '',
        description: '',
        place: '',
        reason_id: '',
        work_operation: '',
      },
      checkShowItem: false,
    }),

    computed: {
      computedHeaders () {
        let result = this.headers;
        return result;
      },
    },

    watch: {
      dialog(val) {
        val || this.close();
      },

      listArrayInput(value) {
        if (value) {
          this.listArray = value;
        }
      },
    },

    created() {
      if (this.listArrayInput.length > 0) {
        this.listArray = this.listArrayInput;
      }
    },

    methods: {
      reloadList() {
        this.$emit('reloadList');
      },

      showItem(item) {
        this.editItem(item);
      },

      editItem(item) {
        let that = this;
        // if (that.permissionsUser.indexOf('show-unwantedEvent') !== -1) {
          that.editedItem = Object.assign({}, item);
          that.checkShowItem = true;
        // }
      },
    }
  };

</script>

<style scoped>

</style>

<template>
  <div>
    <v-dialog v-model="openPopup" max-width="1200px" persistent>
      <v-card>
        <v-card-text>
          <div class="popup-header text-center">
            LATEST OBJECTS
          </div>
          <v-data-table
            :headers="headers"
            :items="filteredItems"
            hide-default-footer
            class="elevation-1 hse-table"
            :sort-by="['created_at']"
            :sort-desc="[true, false]"
            @click:row="redirectToObjectDetail"
          >
            <template v-slot:item.added_by_name="{ item }">
              <span v-if="item.added_by === 1">{{ $t('table.system') }}</span>
              <span v-else>{{ item.added_by_name }}</span>
            </template>
            <template v-slot:item.deadline="{ item }">
              <span v-if="type === 'routine' && item.recurring === 'indefinite'">Indefinite</span>
              <span v-else>{{ moment(item.deadline).format('DD.MM.YYYY') }}</span>
            </template>
            <template v-slot:item.created_at="{ item }">
              {{ moment(item.created_at).format('DD.MM.YYYY') }}
            </template>
            <template v-slot:no-data>
              {{ $t('table.no_data') }}
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions class="popup-footer">
          <v-spacer />
          <v-btn class="btn-cancel" text @click="close">
            {{ $t('button.close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  // import {_} from 'vue-underscore';
  // import moment from 'moment';
  // import {mapState} from "vuex";
  import cookies from "js-cookie";
  import {_} from "vue-underscore";

  export default {
    name: "LatestItemsPopup",
    components: {},
    props: {
      openPopup: Boolean,
      objectsArray: Array,
      type: String,
    },
    data: () => ({
      permissionsUser: localStorage.getItem('permissionsKey'),
      checkAdmin: cookies.get('checkAdmin'),
      roleUser: cookies.get('roleUser'),
      listArrayItems: [],
    }),

    computed: {
      headers() {
        if (this.type === 'deviation') {
          return [
            {text: this.translateCol('subject'), align: 'left', value: 'subject'},
            {text: this.translateCol('added_by'), value: 'added_by_name', align: 'center'},
            {text: this.translateCol('deadline'), value: 'deadline', align: 'center'},
            {text: this.translateCol('created_at'), value: 'created_at', align: 'center'},
          ];
        } else {
          return [
            {text: this.translateCol('name'), align: 'left', value: 'name'},
            {text: this.translateCol('added_by'), value: 'added_by_name', align: 'center'},
            {text: this.translateCol('deadline'), value: 'deadline', align: 'center'},
            {text: this.translateCol('created_at'), value: 'created_at', align: 'center'},
          ];
        }
      },

      filteredItems() {
        return this.listArrayItems.filter((i) => {
          return i;
        });
      },
    },

    watch: {
      openPopup(value) {
        if (value) {
          this.listArrayItems = this.objectsArray;
          // if (this.contactItem) {
          //   let categoryId = this.contactItem.category_id;
          //   this.categoriesValidArray = _.filter(this.categoriesArray, function (item) {
          //     return (!item.disable_status || (item.disable_status && item.id === categoryId));
          //   });
          //   this.editItem(this.contactItem);
          // } else {
          //   this.categoriesValidArray = _.filter(this.categoriesArray, function (item) {
          //     return !item.disable_status;
          //   });
          //   this.addNew();
          // }
        } else {
          this.reset();
        }
      },
    },

    // mounted() {
      //
    // },

    // created() {
    //   if (this.openPopup) {
    //     if (this.contactItem) {
    //       this.editItem(this.contactItem);
    //     } else {
    //       this.addNew();
    //     }
    //   }
    // },

    methods: {
      translateCol (colName) {
        return this.$i18n.t('column.' + colName);
      },

      redirectToObjectDetail(item) {
        // console.log(this.type);
        // console.log(item);
        let that = this;
        // console.log(_.indexOf(['task', 'deviation', 'goal', 'routine', 'instruction', 'checklist'], that.type));
        if (_.indexOf(['deviation', 'goal', 'routine', 'instruction', 'checklist'], that.type) > -1) {
          let url = '/company/' + that.type + 's?id=' + item.id;
          that.$router.push(url);
        } else if (this.type === 'risk element') {
          this.$router.push('/company/riskAreas?id=' + item.id);
        } else if (this.type === 'report checklist') {
          this.$router.push('/reports/reportedChecklists?id=' + item.id);
        } else if (this.type === 'risk analysis') {
          this.$router.push('/reports/reportedRiskanalysis?id=' + item.id);
        } else if (this.type === 'taskAssignee' || this.type === 'task') {
          this.$router.push('/company/tasks?type=' + item.type +'&id=' + item.type_id);
        } else if (this.type === 'document') {
          this.$router.push('/documents/documents?id=' + item.id);
        } else if (this.type === 'contact') {
          this.$router.push('/company/contact-profile/' + item.id);
        }
      },

      close() {
        this.reset();
        this.$emit('closePopup');
      },

      reset() {
        this.listArrayItems = [];
        // this.$nuxt.$loading.finish();
      },

      reloadList(){
        this.$emit('reloadList');
      },
    },
  };
</script>

<style scoped>

</style>

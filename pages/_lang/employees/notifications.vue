<template>
  <div class="instruction-page">
    <b-tabs v-model="tabIndex" card lazy>
      <keep-alive>
        <b-tab :title="$t('tab.notifications')" active name="result-tab" class="result-tab">
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKey" />
          <v-container>
            <v-data-table
              hide-default-header
              :headers="headers"
              :items="filteredItems"
              :item-class="row_classes"
              class="elevation-1 hse-table table-expanded"
              :items-per-page="15"
              :single-expand="true"
              :search="search"
              :sort-by="['created_at']"
              :sort-desc="[true, false]"
              :expanded.sync="expanded"
              item-key="id"
              show-expand
            >
              <template v-slot:top>
                <div class="setting-header">
                  <div class="panel-heading">
                    <h4 class="panel-title">
                      {{ $t('title.sort_by') }}
                    </h4>
                    <b-row>
                      <b-col cols="12">
                        <div class="input-wrap field-search">
                          <v-text-field
                            v-model="search"
                            append-icon="search"
                            :label="$t('setting.search')"
                            outlined
                          >
                    <template v-slot:append>
                      <img src="@/assets/images/icon/magnifier.png" class="search-icon-cust">
                    </template>
                  </v-text-field> 
                        </div>
                      </b-col>
                    </b-row>
                  </div>
                </div>
              </template>

              <template v-slot:header="{ props: { headers } }">
                <h4 class="table-name">
                  {{ $t('table.notifications') }}
                </h4>
              </template>
              <template v-slot:item.action_table="{ item }">
                <div class="d-flex justify-end align-center">
                  <v-btn v-if="item.notification_content.url" class="btn-hse-custom btn-view-detail" text small @click="viewDetail(item.notification_content.url)">View Detail</v-btn>
                  <v-btn class="btn-hse-custom btn-mark-as-read" text small :disabled="item.read_status !== 0" @click="checkRead(item)">Mark as read</v-btn>
                  <v-btn class="hse-btn-delete color-red border-0" text @click="deleteItem(item)">
                    <v-icon>
                      mdi-delete
                    </v-icon>
                  </v-btn>
                </div>
              </template>
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length" class="text-left p-3" style="box-shadow: none">
                  <div v-html="item.notification_content.description" />
                </td>
              </template>
              <template v-slot:no-data>
                {{ $t('table.no_data') }}
              </template>
            </v-data-table>
          </v-container>
        </b-tab>
      </keep-alive>
    </b-tabs>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card class="dialog-delete">
        <v-card-text>
          <div class="text-center confirm-delete-title">
            {{ $t('title.confirm_delete') }}
          </div>
          <div class="confirm-delete-text">
            {{ $t('message.are_you_sure_you_want_to_delete_this_item') }}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="btn-cancel" text @click="close">
            Cancel
          </v-btn>
          <v-btn class="btn-save" @click="deleteConfirmed">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
  // import {_} from 'vue-underscore';
  // import moment from 'moment';
  import cookies from 'js-cookie';
  import TitleCaption from "../../../components/TitleCaption";

  export default {
    components: {
      TitleCaption,
    },

    data: () => ({
      expanded: [],
      pageKey: 'employees-notifications-notifications',
      userRoleId: parseInt(cookies.get('roleID')),
      userDepartmentID: parseInt(cookies.get('userDepartmentID')),
      checkAdmin: cookies.get('checkAdmin'),
      roleUser: cookies.get('roleUser'),
      permissionsUser: localStorage.getItem('permissionsKey'),
      search: '',
      dialog: false,
      listArray: [],
      editedIndex: -1,
      tabIndex: 0,
      editedItem: {
        id: '',
        read_status: "",
      },
      defaultItem: {
        id: '',
        read_status: "",
      },
    }),

    computed: {
      headers() {
        return [
          {text: '', value: 'id', align: ' d-none'},
          {text: '', value: 'created_at', align: 'left', width: '20%'},
          {text: '', value: 'notification_content.short_description', align: 'left'},
          {text: '', value: 'action_table', align: 'right'},
          { text: '', value: 'data-table-expand' },
        ]
      },

      filteredItems() {
        return this.listArray;
      },
    },

    watch: {
      dialog(val) {
        val || this.close();
      },
    },

    mounted() {
      let that = this;
      that.$nextTick(() => {
        that.$nuxt.$loading.start();
        // list notifications
        that.$store.dispatch('notifications/index', {getBy: 'user'}).then(result => {
          that.listArray = result.data;
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_notification_view'));
          }
          that.$nuxt.$loading.finish();
          // that.$toaster.error(error.message || error.status);
        });
      });
    },

    methods: {
      translateCol (colName) {
        return this.$i18n.t('column.' + colName);
      },

      row_classes(item) {
        if (item.read_status === 0) {
          return "unread"; //can also return multiple classes e.g ["orange","disabled"]
        }
      },

      viewDetail(url) {
        this.$router.push(url);
      },

      checkRead(item) {
        var that = this;
        item.read_status = 1;
        that.$store.dispatch('notifications/update', item).then(function() {
          that.reloadList();
          that.$toaster.success(that.$i18n.t('message.success_notification_update'));
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_notification_update'));
          }
          // that.$toaster.error(error.message || error.status);
        });
      },

      deleteItem(item) {
        this.editedItem = Object.assign({}, item);
        this.dialog = true;
      },

      deleteConfirmed() {
        this.delete(this.editedItem);
        this.dialog = false;
      },

      delete(item) {
        var that = this;
        that.$store.dispatch('notifications/delete', item.id).then(function() {
          that.reloadList();
          that.$toaster.success(that.$i18n.t('message.success_notification_delete'));
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_notification_delete'));
          }
          // that.$toaster.error(error.message || error.status);
        });
      },

      close() {
        this.dialog = false;
      },

      reloadList(){
        let that = this;
        that.$store.dispatch('notifications/index', {getBy: 'user'}).then(result => {
          that.listArray = result.data;
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_notification_view'));
          }
          // that.$toaster.error(error.message || error.status);
        });
      },

    },
  };
</script>

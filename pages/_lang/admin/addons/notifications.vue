<template>
  <div class="page-settings-companies">
    <v-btn class="mb-2 btn-create btn-custom-green" @click="addNew">
      {{ $t('button.add_new') }}
    </v-btn>

    <b-tabs card>
      <b-tab :title="$t('tab.notifications')" active>
        <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKey" />
        <v-container>
          <v-dialog v-model="dialog" max-width="800px" persistent>
            <v-card>
              <v-card-text>
                <div class="popup-header text-center">
                  {{ formTitle }}
                </div>
                <v-form
                  ref="form"
                  v-model="valid"
                  lazy-validation
                >
                  <b-row>
                    <b-col v-if="editedItem.send_from === 1">
                      <div class="input-wrap form-description">
                        <vue-editor v-model="editedItem.short_description" disabled />
                      </div>
                    </b-col>
                    <b-col v-else>
                      <div class="input-wrap">
                        <v-textarea
                          v-model="editedItem.short_description"
                          :label="$t('form.short_description')"
                          auto-grow
                          outlined
                          rows="2"
                          row-height="32"
                          counter="250"
                          :rules="shortDescriptionValidate"
                          :disabled="editedIndex > -1"
                        />
                      </div>
                    </b-col>
                  </b-row>
                  <b-row v-if="editedItem.send_from !== 1" class="section-description">
                    <b-col>
                      <div class="input-wrap">
<!--                        <v-icon class="icon-question">far fa-question-circle</v-icon>-->
                        <div class="input-wrap form-description">
                          <vue-editor v-model="editedItem.description" :rules="required" :disabled="editedIndex > -1" />
                        </div>
                      </div>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col cols="6">
                      <div class="input-wrap">
                        <v-select
                          v-model="editedItem.send_to_option"
                          :items="sendToOptionArray"
                          item-text="name"
                          item-value="value"
                          :rules="required"
                          :disabled="editedIndex > -1"
                          outlined
                          :label="$t('form.send_to')"
                          @change="changeSendToOption"
                        />
                      </div>
                    </b-col>
                    <b-col v-if="editedIndex === -1" cols="6">
                      <div class="input-wrap">
                        <v-select
                          v-model="editedItem.send_to"
                          :items="sendToArray"
                          item-text="name"
                          item-value="id"
                          :rules="required"
                          :disabled="sendToArray.length <= 0"
                          multiple
                          outlined
                          :label="$t('form.choose')"
                        >
                          <template v-slot:prepend-item>
                            <v-list-item
                              ripple
                              @click="toggle(editedItem)"
                            >
                              <v-list-item-action>
                                <v-icon :color="editedItem.send_to.length > 0 ? 'indigo darken-4' : ''">{{ icon(editedItem) }}</v-icon>
                              </v-list-item-action>
                              <v-list-item-content>
                                <v-list-item-title>{{ $t('form.select_all') }}</v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>
                            <v-divider class="mt-2"></v-divider>
                          </template>
                        </v-select>
                      </div>
                    </b-col>
                    <b-col v-else>
                      <div class="input-wrap">
                        <v-textarea
                          v-model="editedItem.send_to_name"
                          label=""
                          auto-grow
                          outlined
                          rows="1"
                          row-height="15"
                          :disabled="editedIndex > -1"
                        />
                      </div>
                    </b-col>
                  </b-row>
                </v-form>
              </v-card-text>
              <v-card-actions class="popup-footer">
                <v-spacer />
                <v-btn class="btn-cancel" text @click="close">
                  {{ $t('button.cancel') }}
                </v-btn>
                <v-btn v-if="editedIndex === -1" class="btn-save" @click="save">
                  {{ $t('button.save') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-data-table
            :headers="headers"
            :items="filteredItems"
            class="elevation-1 hse-table table-data"
            :items-per-page="15"
            :single-expand="true"
            :search="search"
            :sort-by="['created_at']"
            :sort-desc="[true, false]"
            @click:row="editItem"
          >
            <template v-slot:top>
              <div class="setting-header">
                <div class="panel-heading">
                  <h4 class="panel-title">
                    {{ $t('title.sort_by') }}
                  </h4>
                  <b-row>
                    <b-col cols="6">
                      <div class="field-selection">
                        <v-select
                          v-model="sendToOption"
                          item-text="name"
                          item-value="value"
                          :items="sendToOptionSelection"
                          :label="$t('setting.object_type')"
                          outlined
                          class="text-box"
                        />
                      </div>
                    </b-col>
                    <b-col cols="6">
                      <div class="field-selection">
                        <v-select
                          v-model="status"
                          :items="statusSelection"
                          item-text="name"
                          item-value="value"
                          :label="$t('setting.status')"
                          outlined
                          class="text-box"
                        />
                      </div>
                    </b-col>
                    <b-col cols="12">
                      <div class="field-selection field-search">
                        <v-text-field
                          v-model="search"
                          append-icon="search"
                          :label="$t('setting.search')"
                          outlined
                          class="text-box"
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
            <template v-slot:item.send_to_option="{ item }">
              {{ formatOptionType(item.send_to_option) }}
            </template>
            <template v-slot:item.short_description="{ item }">
              <div v-html="item.short_description"></div>
            </template>
            <template v-slot:item.status="{ item }">
              {{ formatStatus(item.status) }}
            </template>
            <template v-slot:no-data>
              {{ $t('table.no_data') }}
            </template>
          </v-data-table>
        </v-container>
      </b-tab>
    </b-tabs>
  </div>
</template>
<script>
  import {_} from 'vue-underscore';
  import cookies from 'js-cookie';
  import TitleCaption from "../../../../components/TitleCaption";

  export default {
    components: {
      TitleCaption,
    },

    data: () => ({
      userRoleId: parseInt(cookies.get('roleID')),
      userDepartmentID: parseInt(cookies.get('userDepartmentID')),
      checkAdmin: cookies.get('checkAdmin'),
      roleUser: cookies.get('roleUser'),
      pageKey: 'addons-descriptions-descriptions',
      titleCaptionKey: '',
      search: '',
      dialog: false,
      valid: true,
      listArray: [],
      editedIndex: -1,
      editedItem: {
        type: 'notification',
        send_to_option: '',
        send_to: '',
        send_from: '',
        short_description: '',
        description: '',
        send_to_name: '',
      },
      defaultItem: {
        type: 'notification',
        send_to_option: '',
        send_to: '',
        send_from: '',
        short_description: '',
        description: '',
        send_to_name: '',
      },
      required: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else return true;
        }
      ],
      shortDescriptionValidate: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else  if (!v || v.length > 250)
            return 'Short description contains up to 250 characters';
          else return true;
        }
      ],
      datePicker: false,
      sendToOption: '',
      sendToOptionSelection: [
        { value: '', name: "All"},
        { value: 'company', name: "Company"},
        { value: 'industry', name: "Industry"},
      ],
      status: 0,
      statusSelection: [
        { value: 0, name: "All"},
        { value: 1, name: "Created"},
        { value: 2, name: "Pending"},
        { value: 3, name: "Sent"},
      ],
      sendToOptionArray: [
        { value: 'company', name: "Company"},
        { value: 'industry', name: "Industry"},
      ],
      sendToArray: [],
    }),

    computed: {
      headers() {
        return [
          {text: this.translateCol('object_type'), align: 'left', value: 'send_to_option'},
          {text: this.translateCol('send_to'), align: 'left', value: 'send_to_name'},
          {text: this.translateCol('short_description'), align: 'left', value: 'short_description'},
          {text: this.translateCol('status'), align: 'left', value: 'status'},
          {text: this.translateCol('created_at'), align: 'left', value: 'created_at'},
        ];
      },

      filteredItems() {
        return this.listArray.filter((i) => {
          return (this.sendToOption === '' || (i.send_to_option === this.sendToOption))
            && (this.status === 0 || (i.status === this.status));
        });
      },
      formTitle() {
        return this.editedIndex === -1 ? 'New Notification' : 'Edit Notification';
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
        that.titleCaptionKey = that.roleUser + '-' + that.pageKey;
        // list industries
        that.$store.dispatch('requestPushNotification/index', {filterBy: 'superadmin'}).then(result => {
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

      formatStatus(status) {
        if (status === 1) {
          return this.$i18n.t('table.created');
        } else if (status === 2) {
          return this.$i18n.t('table.pending');
        } else if (status === 3) {
          return this.$i18n.t('table.sent');
        } else {
          return '';
        }
      },

      formatOptionType(option) {
        if (option === 'company') {
          return this.$i18n.t('table.company');
        } else if (option === 'industry') {
          return this.$i18n.t('table.industry');
        } else {
          return '';
        }
      },

      likesAllFruit (item) {
        return item.send_to.length === this.sendToArray.length;
      },

      likesSomeFruit (item) {
        return item.send_to.length > 0 && !this.likesAllFruit(item);
      },

      icon (item) {
        if (this.likesAllFruit(item)) return 'mdi-close-box';
        if (this.likesSomeFruit(item)) return 'mdi-minus-box';
        return 'mdi-checkbox-blank-outline';
      },

      toggle (item) {
        var that = this;
        this.$nextTick(() => {
          if (that.likesAllFruit(item)) {
            item.send_to = [];
          } else {
            item.send_to = [];
            _.each(that.sendToArray, function (sendToItem) {
              item.send_to.push(sendToItem.id);
            });
          }
        });
      },

      changeSendToOption() {
        var that = this;
        that.$nuxt.$loading.start();
        that.sendToArray = [];
        if (that.editedItem.send_to_option === 'company') {
          that.$store.dispatch('companies/index').then(result => {
            that.sendToArray = result.data;
            that.$nuxt.$loading.finish();
          }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_company_view'));
            }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish();
          });
        } else if (that.editedItem.send_to_option === 'industry') {
          that.$store.dispatch('industries/index').then(result => {
            that.sendToArray = _.filter(result.data, function (item) {
              return item.id > 1;
            });
            that.$nuxt.$loading.finish();
          }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_industry_view'));
            }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish();
          });
        }
      },

      addNew() {
        this.reset();
        this.dialog = true;
      },

      editItem(item) {
        this.editedIndex = this.listArray.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialog = true;
      },

      deleteItem(item) {
        const index = this.listArray.indexOf(item);
        this.listArray.splice(index, 1);
        this.dialogDelete = this.dialog = false;
      },

      close() {
        this.dialog = false;
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
        }, 300);
      },

      save() {
        var that = this;
        if (that.$refs.form.validate()) {
          if (that.editedIndex > -1) {
            that.$nuxt.$loading.start();
            that.$store.dispatch('requestPushNotification/update', that.editedItem).then(function() {
              that.reloadList();
              that.$toaster.success(that.$i18n.t('message.success_notification_update'));
            }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_notification_update'));
              }
              that.$nuxt.$loading.finish();
              // if (error.response && error.response.data) {
              //   that.$toaster.error(error.response.data.message || error.response.data.errors);
              // }
            });
          } else {
            that.$store.dispatch('requestPushNotification/store', that.editedItem).then(function() {
              that.reloadList();
              that.editedItem = that.defaultItem;
              that.$toaster.success(that.$i18n.t('message.success_notification_add_new'));
            }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_notification_add_new'));
              }
              that.$nuxt.$loading.finish();
              // if (error.response && error.response.data) {
              //   that.$toaster.error(error.response.data.message || error.response.data.errors);
              // }
            });
          }
          that.close();
        }
      },

      reloadList(){
        let that = this;
        // get list
        that.$store.dispatch('requestPushNotification/index', {filterBy: 'superadmin'}).then(result => {
          if (result.data) {
            that.listArray = result.data;
          }
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

        that.$nuxt.$loading.finish();
      },

      reset() {
        setTimeout(() => {
          this.$refs.form.resetValidation();
        }, 0);
      },

      // dialog DELETE
      closeDelete() {
        this.dialogDelete = false;
      },
    },
  };
</script>

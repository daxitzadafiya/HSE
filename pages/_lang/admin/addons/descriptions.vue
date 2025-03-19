<template>
  <div class="page-settings-companies">
<!--    <v-btn class="mb-2 btn-create btn-custom-green" @click="addNew">-->
<!--      {{ $t('button.add_new') }}-->
<!--    </v-btn>-->

    <b-tabs card>
      <b-tab :title="$t('tab.descriptions')" active>
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
                    <b-col cols="6">
                      <div class="input-wrap">
                        <v-select
                          v-model="editedItem.role_id"
                          item-text="name"
                          item-value="value"
                          :items="roleArray"
                          :label="$t('form.role')"
                          outlined
                          :rules="required"
                          :disabled="editedIndex > -1"
                        />
                      </div>
                    </b-col>
                    <b-col cols="6">
                      <div class="input-wrap">
                        <v-text-field v-model="editedItem.menu" :label="$t('form.menu')" :rules="required" outlined :disabled="editedIndex > -1" />
                      </div>
                    </b-col>
                    <b-col cols="6">
                      <div class="input-wrap">
                        <v-text-field v-model="editedItem.sub_menu" :label="$t('form.sidebar')" :rules="required" outlined :disabled="editedIndex > -1" />
                      </div>
                    </b-col>
                    <b-col cols="6">
                      <div class="input-wrap">
                        <v-text-field v-model="editedItem.tab" :label="$t('form.tab')" :rules="required" outlined :disabled="editedIndex > -1" />
                      </div>
                    </b-col>
                    <b-col cols="6">
                      <div class="input-wrap">
                        <v-text-field v-model="editedItem.sub_tab" :label="$t('form.sub_tab')" outlined :disabled="editedIndex > -1" />
                      </div>
                    </b-col>
                    <b-col v-if="editedIndex > -1" cols="6">
                      <div class="input-wrap">
                        <div class="pt-2">
                          <v-switch
                            v-model="editedItem.activate"
                            :label="$t('form.activate')"
                            class="right-text"
                          />
                        </div>
                      </div>
<!--                      <div class="input-wrap">-->
<!--                        <v-menu-->
<!--                          v-model="datePicker"-->
<!--                          :close-on-content-click="false"-->
<!--                          min-width="290px"-->
<!--                        >-->
<!--                          <template v-slot:activator="{ on }">-->
<!--                            <v-text-field-->
<!--                              v-model="editedItem.updated_at"-->
<!--                              outlined-->
<!--                              readonly-->
<!--                              placeholder="DD/MM/YY"-->
<!--                              label="Updated Date"-->
<!--                              disabled-->
<!--                              v-on="on"-->
<!--                            />-->
<!--                          </template>-->
<!--                          <v-date-picker v-model="editedItem.updated_at" @input="datePicker = false">-->
<!--                            <v-spacer />-->
<!--                            <v-btn text @click="editedItem.updated_at = '', datePicker = false">-->
<!--                              Clear-->
<!--                            </v-btn>-->
<!--                          </v-date-picker>-->
<!--                        </v-menu>-->
<!--                      </div>-->
                    </b-col>
                  </b-row>
                  <b-row class="section-description">
                    <b-col>
                      <div class="input-wrap">
<!--                        <v-icon class="icon-question">far fa-question-circle</v-icon>-->
                        <div class="input-wrap form-description">
                          <vue-editor v-model="editedItem.caption" :placeholder="$t('form.description')" :rules="required" />
                        </div>
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
                <v-btn class="btn-save" @click="save">
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
                          v-model="role"
                          item-text="name"
                          item-value="value"
                          :items="rolesSelection"
                          :label="$t('setting.role')"
                          outlined
                          class="text-box"
                        />
                      </div>
                    </b-col>
                    <b-col cols="6">
                      <div class="field-selection">
                        <v-select
                          v-model="menu"
                          item-value="value"
                          :items="menuArray"
                          :label="$t('setting.menu')"
                          outlined
                          class="text-box"
                        />
                      </div>
                    </b-col>
                    <b-col cols="6">
                      <div class="field-selection">
                        <v-select
                          v-model="sidebar"
                          item-value="value"
                          :items="sidebarArray"
                          :label="$t('setting.sidebar')"
                          outlined
                          class="text-box"
                        />
                      </div>
                    </b-col>
                    <b-col cols="6">
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
                <div class="panel-footer text-right">
                  <!--                  <a type="button" class="btn btn-default" @click="addNewGoal"> New goal</a>-->
                </div>
              </div>
            </template>

            <template v-slot:header="{ props: { headers } }">
              <h4 class="table-name">
                {{ $t('table.descriptions') }}
              </h4>
            </template>
            <template v-slot:item.activate="{ item }">
              {{ item.activate === 1 ? $t('table.activate') : $t('table.disabled') }}
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
        role_id: "",
        role: "",
        menu: "",
        sub_menu: "",
        tab: "",
        sub_tab: "",
        caption: "",
        activate: '',
        updated_at: "",
      },
      defaultItem: {
        role_id: "",
        role: "",
        menu: "",
        sub_menu: "",
        tab: "",
        sub_tab: "",
        caption: "",
        activate: '',
        updated_at: "",
      },
      required: [
        v => !!v || 'This is required'
      ],
      dialogDelete: false,
      role: 0,
      rolesSelection: [
        {name: 'All', value: 0},
        {name: 'Super admin', value: 1},
        {name: 'Company admin', value: 2},
        {name: 'Worker', value: 3},
      ],
      roleArray: [
        {name: 'Super admin', value: 1},
        {name: 'Company admin', value: 2},
        {name: 'Worker', value: 3},
      ],
      menu: 'All',
      menuArray: ['All'],
      sidebar: 'All',
      sidebarArray: ['All'],
      datePicker: false,
    }),

    computed: {
      headers() {
        return [
          {text: this.translateCol('role'), align: 'left', value: 'role.name'},
          {text: this.translateCol('menu'), align: 'left', value: 'menu'},
          {text: this.translateCol('sidebar'), align: 'left', value: 'sub_menu'},
          {text: this.translateCol('tab'), align: 'left', value: 'tab'},
          {text: this.translateCol('sub_tab'), align: 'left', value: 'sub_tab'},
          {text: this.translateCol('status'), align: 'left', value: 'activate'},
        ];
      },

      filteredItems() {
        return this.listArray.filter((i) => {
          return ((this.role === 0 || (i.role_id === this.role))
            && (this.menu === 'All' || (i.menu === this.menu))
            && (this.sidebar === 'All' || (i.sub_menu === this.sidebar))
          );
        });
      },
      formTitle() {
        return this.editedIndex === -1 ? 'New Description' : 'Edit Description';
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
        that.$store.dispatch('titleCaption/index').then(result => {
          if (result.data) {
            that.listArray = result.data;
            _.each(result.data, function (item) {
              that.menuArray.push(item.menu);
              that.sidebarArray.push(item.sub_menu);
            });
            that.$nuxt.$loading.finish();
          }
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_title_caption_view'));
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

      addNew() {
        this.reset();
        this.dialog = true;
      },

      editItem(item) {
        this.editedIndex = this.listArray.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.editedItem.activate = item.activate === 1;
        this.dialog = true;
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
            that.$store.dispatch('titleCaption/update', that.editedItem).then(function() {
              that.reloadList();
              that.$toaster.success(that.$i18n.t('message.success_title_caption_update'));
            }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_title_caption_update'));
              }
              that.$nuxt.$loading.finish();
              // if (error.response && error.response.data) {
              //   that.$toaster.error(error.response.data.message || error.response.data.errors);
              // }
            });
          } else {
            that.$store.dispatch('titleCaption/store', this.editedItem).then(function() {
              that.reloadList();
              that.editedItem = that.defaultItem;
              that.$toaster.success(that.$i18n.t('message.success_title_caption_add_new'));
            }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_title_caption_add_new'));
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
        that.$store.dispatch('titleCaption/index').then(result => {
          if (result.data) {
            that.listArray = result.data;
            _.each(result.data, function (item) {
              that.menuArray.push(item.menu);
              that.sidebarArray.push(item.sub_menu);
            });
          }
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_title_caption_view'));
          }
          that.$nuxt.$loading.finish();
          // that.$toaster.error(error.message || error.status);
        });
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

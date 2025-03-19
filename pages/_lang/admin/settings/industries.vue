<template>
  <div class="page-settings-companies">
    <v-btn class="mb-2 btn-create btn-custom-green" @click="addNew">
      {{ $t('button.add_new') }}
    </v-btn>

    <b-tabs card>
      <b-tab :title="$t('tab.industries')" active>
        <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKey" />
        <v-container>
          <v-dialog v-model="dialog" max-width="600px" persistent>
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
                    <b-col>
                      <div class="input-wrap">
                        <v-text-field v-model="editedItem.name" :label="$t('form.name')" :rules="required" outlined />
                      </div>
                    </b-col>
                  </b-row>
                </v-form>
              </v-card-text>
              <v-card-actions class="popup-footer">
                <v-spacer />
                <v-btn class="btn-cancel" text @click="close">
                  Cancel
                </v-btn>
                <v-btn class="btn-save" @click="save">
                  {{ $t('button.save') }}
                </v-btn>

<!--                <v-btn v-if="editedIndex > -1" class="hse-btn-delete" text @click="dialogDelete = true">-->
<!--                  <v-icon dark>-->
<!--                    mdi-delete-->
<!--                  </v-icon>-->
<!--                </v-btn>-->
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
                <div class="panel-footer text-right">
                  <!--                  <a type="button" class="btn btn-default" @click="addNewGoal"> New goal</a>-->
                </div>
              </div>
            </template>

            <template v-slot:header="{ props: { headers } }">
              <h4 class="table-name">
                {{ $t('table.industries') }}
              </h4>
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
      pageKey: 'settings-industries-industries',
      search: '',
      dialog: false,
      valid: true,
      listArray: [],
      editedIndex: -1,
      editedItem: {
        name: "",
      },
      defaultItem: {
        name: "",
      },
      required: [
        v => !!v || 'This is required'
      ],
    }),

    computed: {
      headers() {
        return [
          {text: this.translateCol('name'), align: 'left', value: 'name'},
        ]
      },

      filteredItems() {
        return this.listArray.filter((i) => {
          return i;
        });
      },

      formTitle() {
        return this.editedIndex === -1 ? 'New Industry' : 'Edit Industry';
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
        // list industries
        that.$store.dispatch('industries/index').then(result => {
          that.listArray = result.data;
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
        let that = this;
        that.$nuxt.$loading.start();
        that.$store.dispatch('industries/show', item.id).then(result => {
          that.editedItem = Object.assign({}, result.data);
          that.editedIndex = that.editedItem.id;
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_industry_view_detail'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
        that.dialog = true;
      },

      close() {
        this.reset();
        this.dialog = false;
      },

      reset() {
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
          // this.$refs.form.reset();
          this.$refs.form.resetValidation();
        }, 0);
      },

      save() {
        let that = this;
        if (that.$refs.form.validate()) {
          that.$nuxt.$loading.start();
          if (that.editedIndex > -1) {
            that.$store.dispatch('industries/update', that.editedItem).then(function() {
              that.reloadList();
              that.$toaster.success(that.$i18n.t('message.success_industry_update'));
            }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_industry_update'));
          }
              that.$nuxt.$loading.finish();
              // if (error.response && error.response.data) {
              //   that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
              // }
            });
          } else {
            that.$store.dispatch('industries/store', that.editedItem).then(function() {
              that.reloadList();
              that.$toaster.success(that.$i18n.t('message.success_industry_add_new'));
            }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_industry_add_new'));
          }
              that.$nuxt.$loading.finish();
              // if (error.response && error.response.data) {
              //   that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
              // }
            });
          }
          that.close();
        }
      },

      reloadList(){
        let that = this;
        // get list
        that.$store.dispatch('industries/index').then(result => {
          that.listArray = result.data;
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
      },
    },
  };
</script>

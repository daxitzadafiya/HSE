<template>
  <div class="hse-page">
    <v-btn class="mb-2 btn-create btn-custom-green" @click="dialogIntervalSetting = true">
      Set Default Interval
    </v-btn>

    <b-tabs v-model="tabIndex" card name="test" lazy>
      <keep-alive>
        <b-tab :title="$t('tab.repositories')" active name="result-tab" class="result-tab">
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKey" />
          <v-container>
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
                            v-model="type"
                            :items="typesSelection"
                            :label="$t('setting.object_type')"
                            outlined
                            class="text-box"
                          />
                        </div>
                      </b-col>
<!--                      <b-col cols="6">-->
<!--                        <div class="field-selection">-->
<!--                          <v-select-->
<!--                            v-model="added_by"-->
<!--                            label="Added By"-->
<!--                            item-value="id"-->
<!--                            item-text="name"-->
<!--                            :items="usersSelection"-->
<!--                            outlined-->
<!--                          />-->
<!--                        </div>-->
<!--                      </b-col>-->
                      <b-col cols="6">
                        <div class="input-wrap field-search">
                          <v-text-field
                            v-model="search"
                            append-icon="search"
                            :label="$t('setting.search')"
                            outlined
                            hide-details
                            class="text-box"
                          >
                    <template v-slot:append>
                      <img src="@/assets/images/icon/magnifier.png" class="search-icon-cust">
                    </template>
                  </v-text-field> 
                        </div>
                      </b-col>
                      <b-col cols="6">
                        <date-range-picker
                          ref="picker"
                          :opens="opens"
                          :locale-data="localData"
                          :singleDatePicker="singleDatePicker"
                          :timePicker="timePicker"
                          :timePicker24Hour="timePicker24Hour"
                          :showWeekNumbers="showWeekNumbers"
                          :showDropdowns="showDropdowns"
                          :autoApply="autoApply"
                          v-model="dateRange"
                          :linkedCalendars="linkedCalendars"
                          :alwaysShowCalendars="alwaysShowCalendars"
                          class="range-picker-custom text-box"
                          hide-details
                        >
                          <template v-slot:input="picker">
                            <div v-if="picker.startDate">
                              {{moment(picker.startDate).format('DD.MM.YYYY') }} - {{moment(picker.endDate).format('DD.MM.YYYY') }}
                            </div>
                            <div v-else>All</div>
                          </template>
                        </date-range-picker>
                      </b-col>
                      <b-col cols="6">
                        <div class="input-wrap">
                          <div class="switch-component setting-type-wrap">
                            <label style="cursor: pointer" class="left-text" @click="disable = false">{{ $t('setting.deleted') }}</label>
                            <v-switch
                              v-model="disable"
                              :label="$t('setting.disabled')"
                              class="right-text"
                            />
                          </div>
                        </div>
                      </b-col>
                    </b-row>
                  </div>
                </div>
              </template>

              <template v-slot:header="{ props: { headers } }">
                <h4 class="table-name">
                  {{ $t('table.repositories') }}
                </h4>
              </template>
              <template v-slot:item.object_type="{ item }">
                <span class="text-capitalize">{{ item.object_type }}</span>
              </template>
              <template v-slot:item.added_by_name="{ item }">
                <span v-if="item.added_by === 1">{{ $t('table.system') }}</span>
                <span v-else>{{ item.added_by_name }}</span>
              </template>
              <template v-slot:item.created_at="{ item }">
                {{ moment(item.created_at).format('DD.MM.YYYY') }}
              </template>
              <template v-slot:item.date_of_permanent_deletion="{ item }">
                {{ item.date_of_permanent_deletion ? moment(item.date_of_permanent_deletion).format('DD.MM.YYYY') :'' }}
              </template>
              <template v-slot:no-data>
                {{ $t('table.no_data') }}
              </template>
            </v-data-table>
          </v-container>
        </b-tab>
      </keep-alive>
    </b-tabs>

    <v-dialog v-model="dialog" max-width="800px" persistent>
      <v-card>
        <v-card-text>
          <div class="popup-header text-center">
            Object detail
          </div>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <b-row>
              <b-col cols="12">
                <div class="input-wrap">
                  <v-text-field
                    v-model="editedItem.object_name"
                    :label="$t('form.name')"
                    name="name"
                    outlined
                    readonly
                  />
                </div>
              </b-col>
              <b-col cols="6">
                <div class="input-wrap">
                  <v-text-field
                    v-model="editedItem.object_type"
                    :label="$t('form.object_type')"
                    outlined
                    readonly
                  />
                </div>
              </b-col>
              <b-col cols="6">
                <div class="input-wrap">
                  <v-text-field
                    :value="editedItem.added_by_first_name + ' ' + editedItem.added_by_last_name"
                    :label="$t('form.deleted_by')"
                    outlined
                    readonly
                  />
                </div>
              </b-col>
              <b-col cols="6">
                <div class="input-wrap">
                  <v-text-field
                    :value="moment(editedItem.created_at).format('DD.MM.YYYY')"
                    :label="$t('form.date_of_deletion')"
                    outlined
                    readonly
                  />
                </div>
              </b-col>
              <b-col v-if="editedItem.date_of_permanent_deletion" cols="6">
                <div class="input-wrap">
                  <v-text-field
                    :value="moment(editedItem.date_of_permanent_deletion).format('DD.MM.YYYY')"
                    label="Date of permanent deletion"
                    outlined
                    readonly
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
          <v-btn
            v-if="editedItem.attachment_uri"
            class="hse-btn-save"
            @click="getFile(editedItem)">
            Download attachment
          </v-btn>
          <v-btn
            v-if="moment().isBefore(editedItem.date_of_permanent_deletion) || !editedItem.date_of_permanent_deletion"
            class="btn-save"
            @click="dialogConfirm = true"
          >
            {{ $t('button.restore') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <IntervalSettingPopup
      :open-popup="dialogIntervalSetting"
      :interval-setting-item="intervalSettingItem"
      @closePopup="dialogIntervalSetting = !dialogIntervalSetting"
      @reloadList="reloadList"
    />

    <v-dialog v-model="dialogConfirm" max-width="500px">
      <v-card class="dialog-delete">
        <v-card-text>
          <div class="text-center confirm-delete-title">
            Confirm restore
          </div>
          <div class="confirm-delete-text">
            Are you sure you want to restore this object?
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="btn-cancel" text @click="close">
            {{ $t('button.cancel') }}
          </v-btn>
          <v-btn class="btn-save" @click="save">
            {{ $t('button.restore') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import {_} from 'vue-underscore';
import moment from 'moment';
import cookies from 'js-cookie';
import TitleCaption from "../../../../components/TitleCaption";
import {downloadFile} from "../../../../utils/downloadFile";
import IntervalSettingPopup from "../../../../components/IntervalSettingPopup";

export default {
  components: {
    TitleCaption,
    IntervalSettingPopup,
  },

  data: () => ({
    pageKey: 'administration-repositories-repositories',
    userRoleId: parseInt(cookies.get('roleID')),
    userDepartmentID: parseInt(cookies.get('userDepartmentID')),
    checkAdmin: cookies.get('checkAdmin'),
    roleUser: cookies.get('roleUser'),
    permissionsUser: localStorage.getItem('permissionsKey'),
    nowDate: new Date().toISOString().substr(0, 10),
    search: '',
    dialog: false,
    dialogIntervalSetting: false,
    valid: true,
    listArray: [],
    editedItem: {
      object_name: '',
      object_type: '',
      attachment_uri: '',
      attachment_url: '',
      file_name: '',
      added_by: '',
      date_of_permanent_deletion: '',
      restore_by: '',
      restore_date: '',
      created_at: '',
    },
    defaultItem: {
      object_name: '',
      object_type: '',
      attachment_uri: '',
      attachment_url: '',
      file_name: '',
      added_by: '',
      date_of_permanent_deletion: '',
      restore_by: '',
      restore_date: '',
      created_at: '',
    },
    intervalSettingItem: {
      id: '',
      type: 'repository',
      added_by: '',
      year: '',
      month: '',
      day: '',
    },
    required: [
      v => {
        if (!v || v.length < 1)
          return 'This is required';
        else return true;
      }
    ],
    tabIndex: 0,
    type: 'All',
    typesSelection: ['All', 'Company', 'Goal', 'Instruction', 'Routine', 'Risk element', 'Document', 'Checklist',
      'Category', 'Department', 'Job title', 'Employee', 'Statement', 'Help center', 'Help question'],
    opens: 'right',
    singleDatePicker: false,
    timePicker: false,
    timePicker24Hour: true,
    showWeekNumbers: false,
    showDropdowns: "",
    autoApply: false,
    dateTest: new Date(),
    dateRange: {
      startDate: false,
      endDate: false
    },
    linkedCalendars: "",
    alwaysShowCalendars: '',
    localData: {
      monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      firstDay: 1
    },
    added_by: 0,
    usersSelection: [],
    dataDefault: {
      id: 0,
      name: "All",
    },
    dialogConfirm: false,
    disable: false,
  }),

  computed: {
    headers() {
      return [
        {text: this.translateCol('name'), value: 'object_name', align: 'left'},
        {text: this.translateCol('type'), value: 'object_type', align: 'center', sortDesc: false},
        {text: this.translateCol('deleted_by'), value: 'added_by_name', align: 'center', sortDesc: false},
        {text: this.translateCol('date_of_deletion'), value: 'created_at', align: 'center', sortDesc: false},
        {text: this.translateCol('permanent_deletion'), value: 'date_of_permanent_deletion', align: 'center', sortDesc: false},
      ]
    },

    dateRangeText() {
      let that = this;
      if (that.date) {
        if (that.date[0] && that.date[1]) {
          return moment(that.date[0]).format('DD.MM.YYYY') + ' - ' + moment(that.date[1]).format('DD.MM.YYYY');
        } else if (that.date[0]) {
          return moment(that.date[0]).format('DD.MM.YYYY');
        } else if (that.date[1]) {
          return moment(that.date[1]).format('DD.MM.YYYY');
        } else {
          return 'DD/MM/YY - DD/MM/YY';
        }
      } else {
        return 'DD/MM/YY - DD/MM/YY';
      }
    },

    filteredItems() {
      let that = this;
      return that.listArray.filter((item) => {
        return ((that.added_by === 0 || (item.added_by === that.added_by))
          && (!that.dateRange.startDate || (that.dateRange.startDate && that.moment(that.dateRange.startDate) <= that.moment(item.created_at))
            && (!that.dateRange.endDate || (that.dateRange.endDate && that.moment(that.dateRange.endDate) >= that.moment(item.created_at))))
          && (that.type === 'All' || (item.object_type === that.type))
          && (that.date_of_permanent_deletion || (!item.date_of_permanent_deletion === that.disable))
        );
      });
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
      // list repositories
      that.$store.dispatch('repositories/index').then(result => {
        that.listArray = result.data;
        that.$nuxt.$loading.finish();
      }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
        that.$toaster.error(that.$i18n.t('message.fail_repository_view'));
        }
        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });

      // list intervalSetting
      that.$store.dispatch('intervalSetting/index').then(result => {
        if (result.data) {
          that.intervalSettingItem = Object.assign({}, result.data[0]);
        }
      }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
        that.$toaster.error(that.$i18n.t('message.fail_interval_setting_view'));
        }
        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });

      // list employee
      that.$store.dispatch('employees/index').then(result => {
        that.usersSelection = _.clone(result.data);
        that.usersSelection.unshift(that.dataDefault);
        that.usersSelection.sort(function (a, b) {
          return (a.id - b.id);
        });
      }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }
        // that.$toaster.error(that.$i18n.t('message.fail_employee_view'));
        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });
    });
  },

  methods: {
    translateCol (colName) {
      return this.$i18n.t('column.' + colName);
    },

    editItem(item) {
      let that = this;
      that.$nuxt.$loading.start();
      that.$store.dispatch('repositories/show', item.id).then(function () {
        that.editedItem = Object.assign({}, item);
        if (item.attachment && item.attachment.type_of_attachment === 1) {
          that.$nuxt.$loading.start();
          that.editedItem.type_of_attachment = true;
          that.getImageSrc(item.attachment.url);
        } else {
          that.editedItem.type_of_attachment = false;
        }
        that.dialog = true;
        that.$nuxt.$loading.finish();
      }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
        that.$toaster.error(that.$i18n.t('message.fail_repository_view_detail'));
        }
        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });
    },

    close() {
      if (this.dialog) {
        this.dialog = false;
      } else if (this.dialogConfirm) {
        this.dialogConfirm = false;
      }
    },

    save() {
      let that = this;
      if (that.$refs.form.validate()) {
        that.$nuxt.$loading.start();
        that.$store.dispatch('repositories/update', that.editedItem).then(function () {
          that.reloadList();
          that.$toaster.success(that.$i18n.t('message.success_repository_update'));
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_repository_update'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage);
          that.$nuxt.$loading.finish();
        });
        that.close();
      }
    },

    reloadList(){
      let that = this;
      // list repositories
      that.$store.dispatch('repositories/index').then(result => {
        that.listArray = result.data;
        that.$nuxt.$loading.finish();
      }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
        that.$toaster.error(that.$i18n.t('message.fail_repository_view'));
        }
        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });
      // list intervalSetting
      that.$store.dispatch('intervalSetting/index').then(result => {
        if (result.data) {
          that.intervalSettingItem = Object.assign({}, result.data[0]);
        }
      }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
        that.$toaster.error(that.$i18n.t('message.fail_interval_setting_view'));
        }
        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });
    },

    getFile(item){
      downloadFile(item.attachment_url, item.file_name);
    },
  },
};
</script>

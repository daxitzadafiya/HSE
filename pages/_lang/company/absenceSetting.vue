<template>
  <div class="page-settings-companies setting-absenceSetting-page">
    <v-btn class="mb-2 btn-create btn-custom-green" @click="addNew">
      {{ $t('button.add_new') }}
    </v-btn>
    <b-tabs card name="test">
      <keep-alive>
        <b-tab title="Absences setting" name="result-tab" class="result-tab">
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKey" />
          <v-container>

            <v-data-table
              :headers="headersSetting"
              :items="filteredSettingItems"
              class="elevation-1 hse-table"
              :items-per-page="15"
              :single-expand="true"
              :search="search"
              :sort-by="['created_at']"
              :sort-desc="[true, false]"
              @click:row="editSettingItem"
            >
              <template v-slot:header="{ props: { headers } }">
                <h4 class="table-name">
                  Absence Reasons
                </h4>
              </template>
              <template v-slot:no-data>
                No data
              </template>
            </v-data-table>
          </v-container>
        </b-tab>
      </keep-alive>
    </b-tabs>

    <v-dialog v-model="dialog" max-width="800px" persistent>
      <v-card>
        <v-card-text>
          <div class="title-model">
            {{ formSettingTitle }}
          </div>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <b-row>
              <b-col>
                <div class="input-wrap">
                  <v-text-field
                    v-model="reasonItem.type"
                    label="Type"
                    :rules="required"
                    outlined
                    :disabled="reasonItem.type === 'Illness' || reasonItem.type === 'Sick child'"
                  />
                </div>
              </b-col>
            </b-row>
            <b-row v-if="reasonItem.class_of_absence === 'interval'">
              <b-col cols="6">
                <div class="input-wrap">
                  <v-select
                    v-model="reasonItem.days_off"
                    :items="itemsAmountOfDays"
                    item-text="name"
                    item-value="value"
                    label="Maximum amount of days"
                    :rules="requiredNumber"
                    outlined
                  />
                </div>
              </b-col>
              <b-col cols="6">
                <div class="input-wrap">
                  <v-select
                    v-model="reasonItem.interval_absence"
                    :items="itemsAmount"
                    label="Maximum times used"
                    :rules="requiredNumber"
                    outlined
                  />
                </div>
              </b-col>
            </b-row>
            <b-row v-else>
              <b-col>
                <div class="input-wrap">
                  <v-select
                    v-model="reasonItem.days_off"
                    :items="itemsAmountOfDays"
                    item-text="name"
                    item-value="value"
                    :label="reasonItem.sick_child ? 'Number of children up to 2' : 'Maximum number of days off'"
                    :rules="requiredNumber"
                    outlined
                  />
                </div>
              </b-col>
              <b-col v-if="reasonItem.sick_child">
                <div class="input-wrap">
                  <v-select
                    v-model="reasonItem.days_off_exception"
                    :items="itemsAmountOfDays"
                    item-text="name"
                    item-value="value"
                    label="Number of children 3 or more"
                    :rules="requiredNumber"
                    outlined
                  />
                </div>
              </b-col>
            </b-row>
            <div class="section-connect-to mb-10">
              <b-row>
                <b-col>
                  <div class="section-connect-to-label">Other settings</div>
                </b-col>
              </b-row>
              <b-row v-if="reasonItem.extra_alone_custody !== null">
                <b-col cols="4">
                  <div class="mt-3 department-title-with-new">
                    Alone custody:
                  </div>
                </b-col>
                <b-col cols="4">
                  <div class="input-wrap">
                    <v-select
                      v-model="reasonItem.extra_alone_custody"
                      :items="itemsAmount"
                      label="Amount"
                      :rules="requiredNumber"
                      outlined
                    />
                  </div>
                </b-col>
              </b-row>
              <b-row v-if="reasonItem.sick_child_max_age !== null">
                <b-col>
                  <div class="mt-3 department-title-with-new">
                    Maximum Age:
                  </div>
                </b-col>
                <b-col>
                  <div class="input-wrap">
                    <v-select
                      v-model="reasonItem.sick_child_max_age"
                      :items="itemsAmount"
                      label="Amount"
                      :rules="requiredNumber"
                      outlined
                    />
                  </div>
                </b-col>
                <b-col>
                  <div class="input-wrap">
                    <v-select
                      v-model="reasonItem.sick_child_max_age_unit"
                      :items="timeUnitArray"
                      item-text="name"
                      item-value="value"
                      label="Unit"
                      :rules="required"
                      disabled
                      outlined
                    />
                  </div>
                </b-col>
              </b-row>
              <b-row v-if="reasonItem.sick_child_max_age_handicapped !== null">
                <b-col>
                  <div class="mt-3 department-title-with-new">
                    Maximum Age: (Handicapped)
                  </div>
                </b-col>
                <b-col>
                  <div class="input-wrap">
                    <v-select
                      v-model="reasonItem.sick_child_max_age_handicapped"
                      :items="itemsAmount"
                      label="Amount"
                      :rules="requiredNumber"
                      outlined
                    />
                  </div>
                </b-col>
                <b-col>
                  <div class="input-wrap">
                    <v-select
                      v-model="reasonItem.sick_child_max_age_handicapped_unit"
                      :items="timeUnitArray"
                      item-text="name"
                      item-value="value"
                      label="Unit"
                      :rules="required"
                      disabled
                      outlined
                    />
                  </div>
                </b-col>
              </b-row>
              <b-row v-if="reasonItem.reset_time_number !== null">
                <b-col>
                  <div class="mt-3 department-title-with-new">
                    Renewal:
                  </div>
                </b-col>
                <b-col>
                  <div class="input-wrap">
                    <v-select
                      v-model="reasonItem.reset_time_number"
                      :items="itemsAmount"
                      label="Amount"
                      :rules="requiredNumber"
                      outlined
                    />
                  </div>
                </b-col>
                <b-col>
                  <div class="input-wrap">
                    <v-select
                      v-model="reasonItem.reset_time_unit"
                      :items="timeUnitArray"
                      item-text="name"
                      item-value="value"
                      label="Unit"
                      :rules="required"
                      outlined
                    />
                  </div>
                </b-col>
              </b-row>
              <b-row v-if="reasonItem.apply_time_number !== null">
                <b-col>
                  <div class="mt-3 department-title-with-new">
                    Minimum time hired:
                  </div>
                </b-col>
                <b-col>
                  <div class="input-wrap">
                    <v-select
                      v-model="reasonItem.apply_time_number"
                      :items="itemsAmount"
                      label="Amount"
                      :rules="requiredNumber"
                      outlined
                    />
                  </div>
                </b-col>
                <b-col>
                  <div class="input-wrap">
                    <v-select
                      v-model="reasonItem.apply_time_unit"
                      :items="timeUnitArray"
                      item-text="name"
                      item-value="value"
                      label="Unit"
                      :rules="required"
                      outlined
                    />
                  </div>
                </b-col>
              </b-row>
              <b-row v-if="reasonItem.deadline_registration_number !== null">
                <b-col>
                  <div class="mt-3 department-title-with-new">
                    Deadline registration:
                  </div>
                </b-col>
                <b-col>
                  <div class="input-wrap">
                    <v-select
                      v-model="reasonItem.deadline_registration_number"
                      :items="itemsAmount"
                      label="Amount"
                      :rules="requiredNumber"
                      outlined
                    />
                  </div>
                </b-col>
                <b-col>
                  <div class="input-wrap">
                    <v-select
                      v-model="reasonItem.deadline_registration_unit"
                      :items="timeUnitArray"
                      item-text="name"
                      item-value="value"
                      label="Unit"
                      :rules="required"
                      outlined
                    />
                  </div>
                </b-col>
              </b-row>
              <b-row v-if="reasonItem.type !== 'Illness' && reasonItem.type !== 'Sick child'">
                <b-col cols="4">
                  <div class="department-title-with-new">
                    <div class="input-wrap">
                      <v-checkbox
                        v-model="reasonItem.illegal"
                        label="Illegal absence"
                      />
                    </div>
                  </div>
                </b-col>
              </b-row>
            </div>
            <div class="section-connect-to">
              <b-row>
                <b-col>
                  <div class="section-connect-to-label">Choose processor</div>
                </b-col>
              </b-row>
              <b-row>
                <b-col cols="4">
                  <div class="input-wrap">
                    <v-checkbox
                      v-model="chooseProcessor"
                      :label="$t('form.nearest_manager')"
                      value="manager"
                      :hide-details="true"
                    />
                  </div>
                </b-col>
                <b-col cols="4">
                  <div class="input-wrap">
                    <v-checkbox
                      v-model="chooseProcessor"
                      label="Admin"
                      value="admin"
                      :hide-details="true"
                    />
                  </div>
                </b-col>
                <b-col cols="12">
                  <div v-if="!chooseProcessor || chooseProcessor.length < 1" class="red--text mb-3">Choose at least one option</div>
                </b-col>
              </b-row>
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="btn-cancel" text @click="close">
            Cancel
          </v-btn>
          <v-btn class="btn-save" :disabled="!chooseProcessor || chooseProcessor.length < 1" @click="saveSetting">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogNewReason" max-width="800px" persistent>
      <v-card>
        <v-card-text>
          <div class="title-model">
            {{ formSettingTitle }}
          </div>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <b-row>
              <b-col>
                <div class="input-wrap">
                  <v-text-field v-model="reasonItem.type" label="Type" :rules="required" outlined />
                </div>
              </b-col>
            </b-row>
            <div class="section-connect-to mb-10">
              <b-row>
                <b-col>
                  <div class="section-connect-to-label">Choose option</div>
                </b-col>
              </b-row>
              <b-row>
                <b-col cols="4">
                  <div class="mt-3 department-title-with-new">
                    <div class="input-wrap">
                      <v-switch
                        v-model="reasonItem.choose_days_off"
                        label="Number of days off"
                        class="right-text"
                        disabled
                      />
                    </div>
                  </div>
                </b-col>
                <b-col v-if="reasonItem.choose_days_off" cols="4">
                  <div class="input-wrap">
                    <v-select
                      v-model="reasonItem.days_off"
                      :items="itemsAmountOfDays"
                      item-text="name"
                      item-value="value"
                      label="Maximum amount of days"
                      :rules="requiredNumber"
                      outlined
                    />
                  </div>
                </b-col>
              </b-row>
              <b-row>
                <b-col :cols="reasonItem.choose_interval_absence ? 4 : 12">
                  <div class="mt-3 department-title-with-new">
                    <div class="input-wrap">
                      <v-switch
                        v-model="reasonItem.choose_interval_absence"
                        label="Number of times use"
                        class="right-text hint-switch"
                        hint="*If this switch is off, the day of excused absence will be count based on 'Maximum amount of days'"
                        :persistent-hint="reasonItem.choose_interval_absence ? false : true"
                      />
                    </div>
                  </div>
                </b-col>
                <b-col v-if="reasonItem.choose_interval_absence" cols="4">
                  <div class="input-wrap">
<!--                    <v-select-->
<!--                      v-model="reasonItem.interval_absence"-->
<!--                      :items="itemsAmount"-->
<!--                      label="Maximum times used"-->
<!--                      :rules="requiredNumber"-->
<!--                      outlined-->
<!--                    />-->
                    <v-text-field
                      v-model="reasonItem.interval_absence"
                      label="Maximum times used"
                      :rules="rulesNaturalNumber"
                      outlined />
                  </div>
                </b-col>
              </b-row>
              <b-row>
                <b-col cols="4">
                  <div class="mt-3 department-title-with-new">
                    <div class="input-wrap">
                      <v-switch
                        v-model="reasonItem.choose_reset_time"
                        label="Renewal"
                        class="right-text"
                      />
                    </div>
                  </div>
                </b-col>
                <b-col v-if="reasonItem.choose_reset_time" cols="4">
                  <div class="input-wrap">
                    <v-select
                      v-model="reasonItem.reset_time_number"
                      :items="itemsAmount"
                      label="Amount"
                      :rules="requiredNumber"
                      outlined
                    />
                  </div>
                </b-col>
                <b-col v-if="reasonItem.choose_reset_time" cols="4">
                  <div class="input-wrap">
                    <v-select
                      v-model="reasonItem.reset_time_unit"
                      :items="timeUnitArray"
                      item-text="name"
                      item-value="value"
                      label="Unit"
                      :rules="required"
                      outlined
                    />
                  </div>
                </b-col>
              </b-row>
              <b-row>
                <b-col cols="4">
                  <div class="mt-3 department-title-with-new">
                    <v-switch
                      v-model="reasonItem.choose_apply_time"
                      label="Minimum time hired"
                      class="right-text"
                    />
                  </div>
                </b-col>
                <b-col v-if="reasonItem.choose_apply_time" cols="4">
                  <div class="input-wrap">
                    <v-select
                      v-model="reasonItem.apply_time_number"
                      :items="itemsAmount"
                      label="Amount"
                      :rules="requiredNumber"
                      outlined
                    />
                  </div>
                </b-col>
                <b-col v-if="reasonItem.choose_apply_time" cols="4">
                  <div class="input-wrap">
                    <v-select
                      v-model="reasonItem.apply_time_unit"
                      :items="timeUnitArray"
                      item-text="name"
                      item-value="value"
                      label="Unit"
                      :rules="required"
                      outlined
                    />
                  </div>
                </b-col>
              </b-row>
              <b-row>
                <b-col cols="4">
                  <div class="mt-3 department-title-with-new">
                    <v-switch
                      v-model="reasonItem.choose_deadline_registration"
                      label="Deadline registration"
                      class="right-text"
                    />
                  </div>
                </b-col>
                <b-col v-if="reasonItem.choose_deadline_registration" cols="4">
                  <div class="input-wrap">
                    <v-select
                      v-model="reasonItem.deadline_registration_number"
                      :items="itemsAmount"
                      label="Amount"
                      :rules="requiredNumber"
                      outlined
                    />
                  </div>
                </b-col>
                <b-col v-if="reasonItem.choose_deadline_registration" cols="4">
                  <div class="input-wrap">
                    <v-select
                      v-model="reasonItem.deadline_registration_unit"
                      :items="timeUnitArray"
                      item-text="name"
                      item-value="value"
                      label="Unit"
                      :rules="required"
                      outlined
                    />
                  </div>
                </b-col>
              </b-row>
              <b-row>
                <b-col cols="4">
                  <div class="mt-3 department-title-with-new">
                    <v-switch
                      v-model="reasonItem.choose_illegal_absence"
                      label="Illegal absence"
                      class="right-text"
                    />
                  </div>
                </b-col>
              </b-row>
            </div>
            <div class="section-connect-to">
              <b-row>
                <b-col>
                  <div class="section-connect-to-label">Choose processor</div>
                </b-col>
              </b-row>
              <b-row>
                <b-col cols="4">
                  <div class="input-wrap">
                    <v-checkbox
                      v-model="chooseProcessor"
                      :label="$t('form.nearest_manager')"
                      value="manager"
                      :hide-details="true"
                    />
                  </div>
                </b-col>
                <b-col cols="4">
                  <div class="input-wrap">
                    <v-checkbox
                      v-model="chooseProcessor"
                      label="Admin"
                      value="admin"
                      :hide-details="true"
                    />
                  </div>
                </b-col>
                <b-col cols="12">
                  <div v-if="!chooseProcessor || chooseProcessor.length < 1" class="red--text mb-3">Choose at least one option</div>
                </b-col>
              </b-row>
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="btn-cancel" text @click="close">
            Cancel
          </v-btn>
          <v-btn class="btn-save" :disabled="!chooseProcessor || chooseProcessor.length < 1" @click="saveSetting">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
  // import {_} from 'vue-underscore';
  import cookies from 'js-cookie';
  import TitleCaption from "../../../components/TitleCaption";

  export default {
    components: {
      TitleCaption,
    },

    data: () => ({
      userRoleId: parseInt(cookies.get('roleID')),
      userDepartmentID: parseInt(cookies.get('userDepartmentID')),
      checkAdmin: cookies.get('checkAdmin'),
      roleUser: cookies.get('roleUser'),
      pageKey: 'employees-absences-absences-setting',
      search: '',
      dialog: false,
      dialogNewReason: false,
      valid: true,
      headersSetting: [
        { text: 'Type', value: 'type', align: 'left', width: '60%' },
        { text: 'Updated at', value: 'updated_at', align: 'left' },
      ],
      listAbsenceReasonArray: [],
      editedIndex: -1,
      required: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else return true;
        }
      ],
      rulesNaturalNumber: [
        value => !!value || 'This is required.',
        value => (value || '').length <= 10 || 'This is  invalid',
        value => {
          const pattern = /^[\d]+$/
          return pattern.test(value) || 'This is  invalid'
        },
      ],
      requiredNumber: [
        v => {
          if ((!v && v < 0) || v.length < 1)
            return 'This is required';
          else return true;
        }
      ],
      absenceReasons: [],
      reasonItem: {
        type: '',
        class_of_absence: '',
        description: '',
        interval_absence: '',
        days_off: '',
        days_off_exception: '',
        extra_alone_custody: '',
        sick_child_max_age: '',
        sick_child_max_age_unit: '',
        sick_child_max_age_handicapped: '',
        sick_child_max_age_handicapped_unit: '',
        reset_time_number: '',
        reset_time_unit: '',
        apply_time_number: '',
        apply_time_unit: '',
        deadline_registration_number: '',
        deadline_registration_unit: '',
        illegal: false,
        sick_child: false,
        choose_days_off: true,
        choose_interval_absence: false,
        choose_reset_time: false,
        choose_deadline_registration: false,
        choose_apply_time: false,
        choose_illegal_absence: false,
      },
      defaultReasonItem: {
        type: '',
        class_of_absence: '',
        description: '',
        interval_absence: '',
        days_off: '',
        days_off_exception: '',
        extra_alone_custody: '',
        sick_child_max_age: '',
        sick_child_max_age_unit: '',
        sick_child_max_age_handicapped: '',
        sick_child_max_age_handicapped_unit: '',
        reset_time_number: '',
        reset_time_unit: '',
        apply_time_number: '',
        apply_time_unit: '',
        deadline_registration_number: '',
        deadline_registration_unit: '',
        illegal: false,
        sick_child: false,
        choose_days_off: true,
        choose_interval_absence: false,
        choose_reset_time: false,
        choose_deadline_registration: false,
        choose_apply_time: false,
        choose_illegal_absence: false,
      },
      timeUnitArray: [
        {
          value: 'day',
          name: 'Day(s)'
        },
        {
          value : 'week',
          name: 'Week(s)'
        },
        {
          value : 'month',
          name: 'Month(s)'
        },
        {
          value : 'year',
          name: 'Year(s)'
        }
      ],
      tabIndex: 0,
      reasonArray: [],
      sick_child_max_age_unit_default: 'year',
      sick_child_max_age_handicapped_unit_default: 'year',
      checkValidDuration: true,
      itemsAmount: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      itemsAmountOfDays: [
        {value: 100000, name: 'Unlimited'},
        {value: 0, name: '0'},
        {value: 1, name: '1 day'},
        {value: 2, name: '2 days'},
        {value: 3, name: '3 days'},
        {value: 4, name: '4 days'},
        {value: 5, name: '5 days'},
        {value: 6, name: '6 days'},
        {value: 7, name: '7 days'},
        {value: 8, name: '8 days'},
        {value: 9, name: '9 days'},
        {value: 10, name: '10 days'},
        {value: 11, name: '11 days'},
        {value: 12, name: '12 days'},
        {value: 13, name: '13 days'},
        {value: 14, name: '14 days'},
        {value: 15, name: '15 days'},
        {value: 16, name: '16 days'},
        {value: 17, name: '17 days'},
        {value: 18, name: '18 days'},
        {value: 19, name: '19 days'},
        {value: 20, name: '20 days'},
      ],
      chooseProcessor: ['manager', 'admin'],
    }),

    computed: {
      filteredSettingItems() {
        return this.listAbsenceReasonArray.filter((i) => {
          return i;
        });
      },
      formSettingTitle() {
        return this.editedIndex === -1 ? 'New Absence Setting' : 'Edit Absence Setting';
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
        // list absenceReasons
        that.$store.dispatch('absenceReasons/index').then(result => {
          that.listAbsenceReasonArray = result.data;
          that.$nuxt.$loading.finish();
        }).catch((error) => {
          that.$toaster.error(error.message || error.status);
        });
      });
    },

    methods: {
      addNew(){
        this.reset();
        this.dialogNewReason = true;
      },

      editSettingItem(item) {
        this.$nuxt.$loading.start();
        this.editedIndex = this.listAbsenceReasonArray.indexOf(item);
        this.chooseProcessor = [];
        this.chooseProcessor = JSON.parse(item.processor);
        this.reasonItem = Object.assign({}, item);
        if (this.reasonItem.sick_child) {
          this.reasonItem.sick_child_max_age_unit = this.sick_child_max_age_unit_default;
          this.reasonItem.sick_child_max_age_handicapped_unit = this.sick_child_max_age_handicapped_unit_default;
        }

        this.dialog = true;
        this.$nuxt.$loading.finish();
      },

      close() {
        this.reset();
        if (this.dialog) {
          this.dialog = false;
        } else {
          this.dialogNewReason = false;
        }
        this.$nuxt.$loading.finish();
      },

      saveSetting() {
        var that = this;
        if (that.$refs.form.validate()) {
          that.$nuxt.$loading.start();
          that.reasonItem.processor = that.chooseProcessor;
          if (that.editedIndex > -1) {
            that.$store.dispatch('absenceReasons/update', that.reasonItem).then(function() {
              that.reloadList();
            }).catch((error) => {
              that.$toaster.error(error.message || error.status);
              that.$nuxt.$loading.finish();
            });
          } else {
            if (that.reasonItem.choose_interval_absence) {
              that.reasonItem.class_of_absence = 'interval';
            } else {
              that.reasonItem.class_of_absence = 'day';
            }
            if (!that.reasonItem.choose_apply_time) {
              that.reasonItem.apply_time_number = '';
              that.reasonItem.apply_time_unit = '';
            }
            if (!that.reasonItem.choose_deadline_registration) {
              that.reasonItem.deadline_registration_number = '';
              that.reasonItem.deadline_registration_unit = '';
            }
            if (!that.reasonItem.choose_reset_time) {
              that.reasonItem.reset_time_number = '';
              that.reasonItem.reset_time_unit = '';
            }
            that.reasonItem.illegal = that.reasonItem.choose_illegal_absence;
            that.$store.dispatch('absenceReasons/store', that.reasonItem).then(function() {
              that.reloadList();
            }).catch((error) => {
              that.$toaster.error(error.message || error.status);
              that.$nuxt.$loading.finish();
            });
          }
          that.close();
        }
      },

      reloadList(){
        let that = this;
        // list absenceReasons
        that.$store.dispatch('absenceReasons/index').then(result => {
          that.listAbsenceReasonArray = result.data;
        }).catch((error) => {
          that.$toaster.error(error.message || error.status);
        });
      },

      reset() {
        this.chooseProcessor = ['manager', 'admin'];
        setTimeout(() => {
          this.reasonItem = Object.assign({}, this.defaultReasonItem);
          this.editedIndex = -1;
          this.$refs.form.resetValidation();
        }, 300);
      },
    },
  };
</script>

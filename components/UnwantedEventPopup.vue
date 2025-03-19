<template>
  <div>
    <v-dialog v-model="openPopup" max-width="800px" persistent>
      <v-card>
        <v-card-text>
          <div class="title-model">
            {{ formTitle }}
          </div>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <b-row class="section-description">
              <b-col>
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
                  :disabled="editMode"
                  class="range-picker-custom project-unwanted-event-date"
                >
                  <template v-slot:input="picker">
                    <div v-if="picker.startDate">
                      {{moment(picker.startDate).format('DD.MM.YYYY') }} - {{ moment(picker.endDate).format('DD.MM.YYYY') }}
                    </div>
                    <div v-else>Start date - End date</div>
                  </template>
                </date-range-picker>
              </b-col>
            </b-row>
<!--            <b-row>-->
<!--              <b-col cols="12">-->
<!--                <div class="input-wrap">-->
<!--                  <v-text-field v-model="editedItem.project" label="Project" :disabled="editMode" outlined />-->
<!--                </div>-->
<!--              </b-col>-->
<!--            </b-row>-->
            <b-row>
              <b-col cols="12">
                <div class="input-wrap">
                  <v-text-field v-model="editedItem.title" :label="$t('form.title')" :disabled="editMode" outlined />
                </div>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="12">
                <div class="input-wrap">
                  <v-select
                    v-model="editedItem.event_id"
                    :items="eventArray"
                    item-value="value"
                    item-text="name"
                    label="Event"
                    :rules="required"
                    :disabled="editMode"
                    outlined
                  />
                </div>
              </b-col>
            </b-row>
            <b-row class="section-description">
              <b-col cols="12">
                <div class="input-wrap form-description">
                  <vue-editor v-model="editedItem.description" placeholder="Description" />
                </div>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="12">
                <div class="input-wrap">
                  <v-text-field v-model="editedItem.place" :label="$t('form.place')" :disabled="editMode" outlined />
                </div>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="12">
                <div class="input-wrap">
                  <v-select
                    v-model="editedItem.reason_id"
                    :items="reasonArray"
                    item-value="value"
                    item-text="name"
                    label="Reason for the event"
                    :disabled="editMode"
                    outlined
                  />
                </div>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="12">
                <div class="input-wrap">
                  <v-text-field v-model="editedItem.work_operation" label="Work operation" :disabled="editMode" outlined />
                </div>
              </b-col>
            </b-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="btn-cancel" text @click="close">
            {{ $t('button.cancel') }}
          </v-btn>
          <v-btn v-if="!editMode && !viewOnly" class="btn-save" @click="save">
            {{ $t('button.save') }}
          </v-btn>
          <v-btn v-if="editMode && !viewOnly" class="btn-save" text @click="save">
            {{ $t('button.save') }}
          </v-btn>
          <!--                  <v-btn v-if="editMode && editedItem.status < 3" class="hse-btn-delete" text :disabled="permissionsUser.indexOf('destroy-unwantedEvent') === -1" @click="dialogDelete = true">-->
          <!--                    <v-icon dark>-->
          <!--                      mdi-delete-->
          <!--                    </v-icon>-->
          <!--                  </v-btn>-->
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDelete" max-width="500px">
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
          <v-btn class="btn-cancel" text @click="closeDelete">
            Cancel
          </v-btn>
          <v-btn class="btn-save" @click="Item(editedItem)">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogConfirmClose" max-width="500px">
      <v-card class="dialog-delete">
        <v-card-text>
          <div class="text-center confirm-delete-title">
            {{ $t('title.confirm_modal') }}
          </div>
          <div class="confirm-delete-text">
            {{ $t('message.do_you_want_to_cancel_without_saving') }}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="btn-cancel" text @click="close">
            Yes
          </v-btn>

          <v-btn class="btn-cancel" text @click="dialogConfirmClose = false">
            No
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import {_} from 'vue-underscore';
  import cookies from 'js-cookie';
  import moment from 'moment';

  export default {
    name: "UnwantedEventPopup",
    components: {
    },
    props: {
      unwantedEventItem: {
        type: Object,
        required: false,
      },
      openPopup: Boolean,
      projectId: Number,
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
      valid: true,
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
      defaultItem: {
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
      date: false,
      menu: false,
      required: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else return true;
        }
      ],
      dialogDelete: false,
      opens: 'right',
      singleDatePicker: false,
      timePicker: false,
      timePicker24Hour: true,
      showWeekNumbers: false,
      showDropdowns: "",
      autoApply: false,
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
      formTitle: 'Edit Unwanted Event',
      editMode: true,
      dialogConfirmClose: false,
      eventArray: [{
        value: 1,
        name: "Personal injury"
      }, {
        value: 2,
        name: "Almost a accident"
      }, {
        value: 3,
        name: "Environmental emissions"
      }, {
        value: 4,
        name: "Fire damage"
      }, {
        value: 5,
        name: "Explosion damage"
      }, {
        value: 6,
        name: "Electrical damage"
      }, {
        value: 7,
        name: "Material damages"
      }, {
        value: 8,
        name: "Others"
      }],
      reasonArray: [],
    }),

    computed: {

    },

    watch: {
      openPopup(value) {
        if (value) {
          if (this.unwantedEventItem) {
            this.editItem(this.unwantedEventItem);
          } else {
            this.addNew();
          }
        }
      },
    },

    mounted() {},

    created() {
      if (this.openPopup) {
        if (this.unwantedEventItem) {
          this.editItem(this.unwantedEventItem);
        } else {
          this.addNew();
        }
      }
    },

    methods: {
      addNew() {
        this.reset();
        this.formTitle = 'New Unwanted Event';
        this.editMode = false;
      },

      editItem(item) {
        let that = this;
        // if (that.permissionsUser.indexOf('show-unwantedEvent') !== -1) {
        that.editedItem = Object.assign({}, item);
        that.checkShowItem = true;
        that.dateRange.startDate = moment(item.start);
        that.dateRange.endDate = moment(item.end);
        // }
      },

      checkDirtyBeforeClose(){
        if(this.checkDirtyForm()){
          this.dialogConfirmClose = true;
        }else{
          this.close();
        }
      },

      checkDirtyForm(){
        let that = this;
        let result = false;
        _.each(that.editedItem, function(value, key, obj) {
          if(that.originData && obj[key] && that.originData[key] && obj[key] !== that.originData[key]){
            result = true;
          }
        });
        return result;
      },

      close() {
        this.reset();
        this.dialogConfirmClose = false;
        this.formDirty = false;
        this.$emit('closePopup');
      },

      reset() {
        this.$nuxt.$loading.finish();
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          // this.$refs.form.reset();
          this.$refs.form.resetValidation();
        }, 300);
      },

      save() {
        let that = this;
        if (that.$refs.form.validate()) {
          that.$nuxt.$loading.start();
          if (that.editMode) {
            // edit
            that.$store.dispatch('unwantedEvents/update', that.editedItem).then(function() {
              that.reloadList();
              that.$toaster.success(that.$i18n.t('message.success'));
            }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.failed'));
              }
              // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
              that.$nuxt.$loading.finish();
            });
          } else {
            that.editedItem.project_id = that.projectId;
            that.editedItem.start = moment(that.dateRange.startDate).format('YYYY-MM-DD HH:mm:ss');
            that.editedItem.end = moment(that.dateRange.endDate).format('YYYY-MM-DD HH:mm:ss');
            // create
            that.$store.dispatch('unwantedEvents/store', that.editedItem).then(function () {
              that.reloadList();
              that.$toaster.success(that.$i18n.t('message.success'));
            }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.failed'));
              }
              // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
              that.$nuxt.$loading.finish();
            });
          }
          that.close();
        }
      },

      reloadList(){
        this.$emit('reloadList');
      },

      // dialog DELETE
      closeDelete() {
        this.dialogDelete = false;
      },

      Item(item) {
        let index = this.listArray.findIndex(i => i.id === item.id);
        this.listArray.splice(index, 1);
        this.deleteUnwantedEvent(item);
        this.dialogDelete = false;
      },

      deleteUnwantedEvent(item) {
        this.$store.dispatch('unwantedEvents/delete', item.id).then(function() {
          this.reloadList();
          this.$toaster.success(this.$i18n.t('message.success'));
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          this.$toaster.error(this.$i18n.t('message.failed'));
          }
          // this.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          // this.$nuxt.$loading.finish();
        });
      },
    },
  };
</script>

<style scoped>

</style>

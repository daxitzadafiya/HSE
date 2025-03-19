<template>
  <div>
    <v-dialog v-model="openPopup" max-width="500px" persistent>
      <v-card>
        <v-card-text>
          <div class="popup-header text-center">
            Set Default Interval
          </div>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <b-row>
              <b-col cols="12">
                <div class="field-selection">
                  <v-select
                    v-model="editedItem.year"
                    item-value="value"
                    :items="itemsAmount"
                    :label="$t('form.choose_year')"
                    outlined
                    hide-details
                  />
                </div>
              </b-col>
              <b-col cols="12">
                <div class="field-selection">
                  <v-select
                    v-model="editedItem.month"
                    item-value="value"
                    :items="itemsAmount"
                    :label="$t('form.choose_month')"
                    outlined
                    hide-details
                  />
                </div>
              </b-col>
              <b-col cols="12">
                <div class="field-selection">
                  <v-select
                    v-model="editedItem.day"
                    item-value="value"
                    :items="itemsAmount"
                    :label="$t('form.choose_day')"
                    outlined
                    hide-details
                  />
                </div>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="12">
                <p>After the above time period, the objects in the archive will automatically be permanently deleted by the system.</p>
                <p>Does not apply to previously saved objects.</p>
              </b-col>
            </b-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="popup-footer">
          <v-spacer />
          <v-btn class="btn-cancel" text @click="close">
            Cancel
          </v-btn>
          <v-btn
            class="btn-save"
            @click="save"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  // import {_} from 'vue-underscore';
  import cookies from "js-cookie";

  export default {
    name: "IntervalSettingPopup",
    // components: {
    //   category: Category,
    // },
    props: {
      intervalSettingItem: {
        type: Object,
        required: false,
      },
      openPopup: Boolean,
    },
    data: () => ({
      permissionsUser: localStorage.getItem('permissionsKey'),
      checkAdmin: cookies.get('checkAdmin'),
      roleUser: cookies.get('roleUser'),
      valid: true,
      editMode: true,
      required: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else return true;
        }
      ],
      editedItem: {
        id: '',
        type: 'repository',
        added_by: '',
        year: '',
        month: '',
        day: '',
      },
      defaultEditedItem: {
        id: '',
        type: 'repository',
        added_by: '',
        year: '',
        month: '',
        day: '',
      },
      itemsAmount: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    }),

    computed: {},

    watch: {
      openPopup(value) {
        if (value) {
          if (this.intervalSettingItem.id) {
            console.log(this.intervalSettingItem);
            this.editItem(this.intervalSettingItem);
          } else {
            this.addNew();
          }
        }
      },
    },

    mounted() {},

    created() {
      if (this.openPopup) {
        if (this.intervalSettingItem.id) {
          this.editItem(this.intervalSettingItem);
        } else {
          this.addNew();
        }
      }
    },

    methods: {
      addNew() {
        this.reset();
        this.editMode = false;
      },

      editItem(item) {
        let that = this;
        that.editedItem = Object.assign({}, item);
      },

      close() {
        this.reset();
        this.$emit('closePopup');
      },

      reset() {
        this.$nuxt.$loading.finish();
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultEditedItem);
          this.$refs.form.resetValidation();
        }, 300);
      },

      save() {
        let that = this;
        if (that.$refs.form.validate()) {
          that.$nuxt.$loading.start();
          if (that.editMode) {
            // edit
            that.$store.dispatch('intervalSetting/update', that.editedItem).then(function () {
              that.reloadList();
              that.$toaster.success(that.$i18n.t('message.success_interval_setting_update'));
            }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_interval_setting_update'));
              }
              // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage);
              that.$nuxt.$loading.finish();
            });
          } else {
            // create
            that.$store.dispatch('intervalSetting/store', that.editedItem).then(function () {
              that.reloadList();
              that.$toaster.success(that.$i18n.t('message.success_interval_setting_add_new'));
            }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_interval_setting_add_new'));
              }
              // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage);
              that.$nuxt.$loading.finish();
            });
          }
          that.close();
        }
      },

      reloadList(){
        this.$emit('reloadList');
      },

    },
  };
</script>

<style scoped>

</style>

<template>
  <v-dialog v-model="openPopup" max-width="800px" persistent>
    <v-card>
      <v-card-text>
        <div class="popup-header text-center">
          {{ $t('title.new_notification') }}
        </div>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <b-row>
            <b-col>
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
                />
              </div>
            </b-col>
          </b-row>
          <b-row class="section-description">
            <b-col>
              <div class="input-wrap">
<!--                <v-icon class="icon-question">far fa-question-circle</v-icon>-->
                <div class="input-wrap form-description">
                  <vue-editor v-model="editedItem.description" :rules="required" />
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
                  outlined
                  :label="$t('form.send_to')"
                  @change="changeSendToOption"
                />
              </div>
            </b-col>
            <b-col cols="6">
              <div class="input-wrap">
                <MultipleSelection
                  :selected-items-input="selectedItems"
                  :label="$t('form.choose')"
                  :item-text="'name'"
                  :item-value="'id'"
                  :list-option-input="sendToArray"
                  :disabled="sendToArray.length <= 0"
                  @getSelectedItems="getSelectedItems"
                />
<!--                <v-select-->
<!--                  v-model="editedItem.send_to"-->
<!--                  :items="sendToArray"-->
<!--                  item-text="name"-->
<!--                  item-value="id"-->
<!--                  :rules="required"-->
<!--                  :disabled="sendToArray.length <= 0"-->
<!--                  multiple-->
<!--                  outlined-->
<!--                  :label="$t('form.choose')"-->
<!--                >-->
<!--                  <template v-slot:prepend-item>-->
<!--                    <v-list-item-->
<!--                      ripple-->
<!--                      @click="toggle(editedItem)"-->
<!--                    >-->
<!--                      <v-list-item-action>-->
<!--                        <v-icon :color="editedItem.send_to.length > 0 ? 'indigo darken-4' : ''">{{ icon(editedItem) }}</v-icon>-->
<!--                      </v-list-item-action>-->
<!--                      <v-list-item-content>-->
<!--                        <v-list-item-title>Select All</v-list-item-title>-->
<!--                      </v-list-item-content>-->
<!--                    </v-list-item>-->
<!--                    <v-divider class="mt-2"></v-divider>-->
<!--                  </template>-->
<!--                </v-select>-->
              </div>
            </b-col>
          </b-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="popup-footer">
        <v-spacer />
        <v-btn class="btn-cancel" text @click="closeAddNotification">
          {{ $t('button.cancel') }}
        </v-btn>
        <v-btn class="btn-save" @click="save">
          {{ $t('button.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import {_} from 'vue-underscore';
  import MultipleSelection from "./MultipleSelection";

  export default {
    name: "SendNotificationPopup",
    components: {
      MultipleSelection,
    },
    props: {
      openPopup: Boolean,
      featureId: Number,
    },
    data:() => ({
      valid: true,
      editedItem: {
        type: 'warning',
        feature: 'role',
        feature_id: '',
        send_to_option: '',
        send_to: '',
        short_description: '',
        description: '',
        send_to_name: '',
        show_action: 1,
      },
      defaultItem: {
        type: 'warning',
        feature: 'role',
        feature_id: '',
        send_to_option: '',
        send_to: '',
        short_description: '',
        description: '',
        send_to_name: '',
        show_action: 1,
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
      sendToOption: '',
      sendToOptionSelection: [
        { value: '', name: "All"},
        { value: 'company', name: "Company"},
        { value: 'industry', name: "Industry"},
      ],
      sendToOptionArray: [
        { value: 'company', name: "Company"},
        { value: 'industry', name: "Industry"},
      ],
      sendToArray: [],
      selectedItems: [],
    }),

    methods: {
      changeSendToOption() {
        var that = this;
        that.$nuxt.$loading.start();
        that.sendToArray = [];
        that.editedItem.send_to = [];
        if (that.editedItem.send_to_option === 'company') {
          that.$store.dispatch('companies/index').then(result => {
            that.sendToArray = result.data;
            that.$nuxt.$loading.finish();
          }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
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
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_industry_view'));
            }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish();
          });
        }
      },

      getSelectedItems(value) {
        this.selectedItems = value.selectedItemsOutput;
      },

      save() {
        let that = this;
        if (that.$refs.form.validate()) {
          that.editedItem.feature_id = that.featureId;
          that.editedItem.send_to = that.selectedItems;
          that.$store.dispatch('requestPushNotification/store', that.editedItem).then(function() {
            that.$emit('afterSendNotification');
            that.closeAddNotification();
            that.$toaster.success(that.$i18n.t('message.success'));
          }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_notification_add_new'));
            }
            that.$nuxt.$loading.finish();
            // if (error.response && error.response.data) {
            //   that.$toaster.error(error.response.data.message || error.response.data.errors);
            // }
          });
        }
      },

      closeAddNotification() {
        this.selectedItems = [];
        this.sendToArray = [];
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.$refs.form.resetValidation();
        }, 300);
        this.$emit('closeSendNotificationPopup');
      },
    }
  };
</script>

<style scoped>

</style>

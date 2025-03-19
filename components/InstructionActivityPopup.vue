<template>
  <div>
    <v-dialog v-model="openPopup" max-width="1125px" persistent>
      <v-card>
        <v-card-text>
          <div class="popup-header text-center">
            {{ editMode ? $t('form.edit_activity') : $t('form.add_activity') }}
          </div>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <!-- Name -->
            <b-row align-h="center">
              <b-col cols="12">
                <div class="input-wrap">
                  <!-- Add new -->
                  <v-text-field
                    v-if="!editMode"
                    v-model="objectItem.name"
                    :label="$t('form.name')"
                    :rules="required"
                    outlined
                  />
                  <!-- Edit -->
                  <v-text-field
                    v-else
                    v-model="editedItem.name"
                    :label="$t('form.name')"
                    :rules="required"
                    outlined
                    :disabled="checkCreator && !checkResponsible && !editedItem.is_template"
                  />
                </div>
              </b-col>
            </b-row>

            <!-- Description -->
            <b-row class="section-description">
              <b-col>
                <div class="input-wrap form-description">
                  <FroalaSuggestionListEditor
                    :item="editMode ? editedItem : objectItem"
                    :predefined-link-array="predefinedLinkArray"
                  />
                </div>
              </b-col>
            </b-row>

            <!-- Responsible -->
            <Responsible
              v-if="!checkSuperAdmin && !checkResource"
              :object-item="editMode ? editedItem : objectItem"
              :no-required-action="true"
              :edit-mode="editMode"
              :disabled="editMode && !checkCreator"
            />

            <!-- Attendee -->
            <Attendee
              v-if="!checkSuperAdmin && !checkResource"
              :object-item="editMode ? editedItem : objectItem"
              :no-required-action="true"
              :edit-mode="editMode"
              :disabled="editMode && checkCreator && !checkResponsible"
            />
          </v-form>
        </v-card-text>
        <v-card-actions class="popup-footer">
          <v-spacer />
          <v-btn class="btn-cancel" text @click="close">
            {{ $t('button.cancel') }}
          </v-btn>
          <v-btn
            class="btn-save"
            @click="editMode ? update() : save()"
          >
            {{ $t('button.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import {_} from 'vue-underscore';
  import cookies from "js-cookie";
  import FroalaSuggestionListEditor from "./FroalaSuggestionListEditor";
  import Responsible from "./Responsible";
  import Attendee from "./Attendee";

  export default {
    name: "InstructionActivityPopup",
    components: {
      FroalaSuggestionListEditor,
      Responsible,
      Attendee,
    },
    props: {
      openPopup: Boolean,
      objectItem: {
        type: Object,
        required: true,
      },
      predefinedLinkArray: {
        type: Array,
        required: false,
      },
      editMode: {
        type: Boolean,
        required: true,
      },
      resource: {
        type: Boolean,
        required: false,
      },
    },
    data: () => ({
      checkSuperAdmin: cookies.get('checkSuperAdmin'),
      valid: true,
      required: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else return true;
        }
      ],
      editedItem: {},
      checkCreator: false,
      checkResponsible: false,
      // resource
      checkResource: false,
    }),

    computed: {},

    watch: {
      objectItem(value) {
        if (value) {
          if (this.editMode) {
            this.editItem(this.objectItem);
          }
        }
      },

      resource(value) {
        if (value) {
          this.checkResource = value;
        }
      },
    },

    created() {
      if (this.objectItem) {
        if (this.editMode) {
          this.editItem(this.objectItem);
        }
      }

      if (this.resource) {
        this.checkResource = this.resource;
      }
    },

    methods: {
      editItem(item) {
        let that = this;
        // that.formDirty = false;
        that.$nuxt.$loading.start();
        that.$store.dispatch('objects/show', item.id).then(result => {
          that.editedItem = Object.assign({}, result.data);
          that.checkCreator = _.contains(result.data.role, 'creator');
          that.checkResponsible = _.contains(result.data.role, 'responsible');
          // that.editedItem.historyArray = _.sortBy(result.data.history, function(o) { return o.updated_at; });
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_instruction_view_detail'));
          }
          that.$nuxt.$loading.finish();
        });
      },

      close() {
        if (this.openPopup) {
          this.$emit('closePopup');
        }
      },

      reloadList() {
        this.$emit('reloadList');
      },

      viewItem() {
        this.$emit('viewItem');
      },

      save() { // add new
        let that = this;
        that.$store.dispatch('objects/store', that.objectItem).then(function() {
          that.viewItem();
          that.reloadList();
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          // that.$toaster.error(that.$i18n.t('message.fail_instruction_add_new'));
          }
          that.$nuxt.$loading.finish();
        });
        that.close();
      },

      update() {
        let that = this;
        that.editedItem.requestEdit = true;
        if (!that.editedItem.is_template) {
          if (!that.editedItem.attendee_all) { // if not select All
            that.editedItem.attendee_all = false;
          }
          that.editedItem.responsible_required_comment = false;
          that.editedItem.responsible_required_attachment = false;
          that.editedItem.attendee_required_comment = false;
          that.editedItem.attendee_required_attachment = false;
        }
        that.$store.dispatch('objects/update', that.editedItem).then(function() {
          that.viewItem();
          that.reloadList();
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_instruction_update'));
          }
          that.$nuxt.$loading.finish();
        });
        that.close();
      },
    },
  };
</script>

<style scoped>

</style>

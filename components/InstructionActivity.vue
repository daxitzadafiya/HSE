<template>
  <div>
    <b-row v-if="!addActivity">
      <b-col cols="2">
        <div class="bold-title md-line-height">
          {{ $t('form.activities') }}
        </div>
      </b-col>
      <b-col cols="4">
        <div class="input-wrap">
          <div class="switch-component">
            <label class="left-text">{{ $t('form.none') }}</label>
            <v-switch
              v-model="addActivity"
              :label="$t('form.add')"
              inset
              class="right-text"
            />
          </div>
        </div>
      </b-col>
    </b-row>
    <div v-if="addActivity" class="section-connect-to mt-7 pb-4">
      <div class="section-connect-to-label section-connect-to-label-reminder">
        {{ $t('form.activities') }}
      </div>
      <div class="switch-component switch-component-small">
        <label class="left-text">{{ $t('form.none') }}</label>
        <v-switch
          v-model="addActivity"
          :label="$t('form.add')"
          inset
          class="right-text"
        />
      </div>

      <div class="component-sub-goal mt-5">
        <v-data-table
          :items="editMode ? editedItem.activities : objectItem.activities"
          hide-default-header
          hide-default-footer
        >
          <template v-slot:body="props">
            <tr
              v-for="(item, index) in props.items"
              :key="index"
            >
              <td>
                <v-expansion-panels
                  class="expansion-panels"
                  :value="props.items.length - 1"
                  :multiple="false"
                >
                  <v-expansion-panel>
                    <v-expansion-panel-header>
                      <div>
                        {{ item.name ? item.name : $t('form.activities') }}
                        <!-- Add -->
                        <v-icon
                          v-if="index === 0"
                          class="icon-plus-circle ml-2"
                          @click="addItem"
                        >
                          mdi-plus-circle
                        </v-icon>
                      </div>
                      <div class="text-right">
                        <!-- Delete -->
                        <v-icon
                          v-if="props.items.length > 1"
                          class="mr-2"
                          @click="dialogDelete = true"
                        >
                          delete
                        </v-icon>

                        <!-- Popup delete confirm -->
                        <DeleteConfirmPopup
                          :open-popup="dialogDelete"
                          :object-index="index"
                          @closePopup="dialogDelete = !dialogDelete"
                          @deleteItem="deleteItem(index)"
                        />
                      </div>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <!-- Name -->
                      <b-row align-h="center">
                        <b-col cols="12">
                          <div class="input-wrap">
                            <v-text-field
                              v-model="item.name"
                              :label="$t('form.name')"
                              :rules="required"
                              outlined
                              @change="updateDetail(props.items)"
                            />
                          </div>
                        </b-col>
                      </b-row>

                      <!-- Description -->
                      <b-row class="section-description">
                        <b-col>
                          <div class="input-wrap form-description">
                            <FroalaSuggestionListEditor
                              :item="item"
                              :predefined-link-array="predefinedLinkArray"
                            />
                          </div>
                        </b-col>
                      </b-row>

                      <!-- Responsible -->
                      <Responsible
                        v-if="!checkSuperAdmin && !checkResource"
                        :object-item="item"
                        :no-required-action="true"
                        :edit-mode="false"
                      />

                      <!-- Attendee -->
                      <Attendee
                        v-if="!checkSuperAdmin && !checkResource"
                        :object-item="item"
                        :no-required-action="true"
                        :edit-mode="false"
                        @changeField="changeField"
                      />
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </td>
            </tr>
          </template>
        </v-data-table>
      </div>
    </div>
  </div>
</template>

<script>
  import {_} from 'vue-underscore';
  import cookies from "js-cookie";
  import FroalaSuggestionListEditor from "./FroalaSuggestionListEditor";
  import Responsible from "./Responsible";
  import Attendee from "./Attendee";
  import DeleteConfirmPopup from "./DeleteConfirmPopup";

  export default {
    name: "InstructionActivity",
    components: {
      FroalaSuggestionListEditor,
      Responsible,
      Attendee,
      DeleteConfirmPopup,
    },
    props: {
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
      addActivity: false,
      activityItem: {
        is_template: false,
        name: '',
        type: 'instruction-activity',
        description: '',
        status: 'new',
        source: 'instruction',
        responsible_department_array: [],
        responsible_employee_array: [],
        isDefaultResponsible: true,
        isDefaultAttendee: true,
        attendee_all: false,
        attendee_department_array: [],
        attendee_employee_array: [],
        // required comment
        responsible_required_comment: false,
        responsible_required_attachment: false,
        attendee_required_comment: false,
        attendee_required_attachment: false,
      },
      activityResourceItem: {
        is_template: true,
        industry: [],
        name: '',
        type: 'instruction-activity',
        description: '',
        status: 'new',
        source: 'instruction',
      },
      dialogDelete: false,
      editedItem: {},
      // resource
      checkResource: false,
    }),

    computed: {},

    watch: {
      resource(value) {
        if (value) {
          this.checkResource = value;
        }
      },

      objectItem(value) {
        if (value) {
          if (this.editMode) {
            this.editItem(this.objectItem);
          } else {
            this.addNew();
          }
        }
      },
    },

    created() {
      if (this.resource) {
        this.checkResource = this.resource;
      }

      if (this.objectItem) {
        if (this.editMode) {
          this.editItem(this.objectItem);
        } else {
          this.addNew();
        }
      }
    },

    methods: {
      addNew() {
        this.addActivity = false;
        this.objectItem.activities = [];
        this.addItem();
      },

      addItem() {
        let newItem = {};
        if (this.checkResource) {
          newItem = _.clone(this.activityResourceItem);
        } else {
          newItem = _.clone(this.activityItem);
        }
        if (this.editMode) {
          this.editedItem.activities.unshift(newItem);
        } else {
          this.objectItem.activities.unshift(newItem);
        }
      },

      editItem(list) {
        this.editedItem = Object.assign({}, list);
        if (!_.isEmpty(this.editedItem.activities)) {
          this.addActivity = true;
        }
        _.each(this.editedItem.activities, function (item) {
          item.is_template = false;
          item.responsible_department_array = [];
          item.responsible_employee_array = [];
          item.isDefaultResponsible = true;
          item.isDefaultAttendee = true;
          item.attendee_all = false;
          item.attendee_department_array = [];
          item.attendee_employee_array = [];
          item.responsible_required_comment = false;
          item.responsible_required_attachment = false;
          item.attendee_required_comment = false;
          item.attendee_required_attachment = false;
        });
      },

      deleteItem(index) {
        if (this.editMode) {
          this.editedItem.activities.splice(index, 1);
        } else {
          this.objectItem.activities.splice(index, 1);
        }
        this.dialogDelete = false;
      },

      changeField(val) {
        if (val.changed) {
          if (this.editMode) {
            this.updateDetail(this.editedItem.activities);
          } else {
            this.updateDetail(this.objectItem.activities);
          }
        }
      },

      updateDetail(val) {
        this.$emit('updateInstructionActivity', {
          list: val,
        });
      }
    },
  };
</script>

<style scoped>

</style>

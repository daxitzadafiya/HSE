<template>
  <div class="component-sub-goal mt-5">
    <v-data-table
      :items="listArray"
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
                    {{ item.name ? item.name : $t('form.sub_goal') }}
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

                  <!-- Attendee -->
                  <Attendee
                    v-if="!checkSuperAdmin && !checkResource"
                    :object-item="item"
                    :edit-mode="false"
                    @changeField="changeField"
                  />

                  <!-- Start date -->
                  <StartDate
                    v-if="!checkSuperAdmin && !checkResource"
                    :object-item="item"
                    :index-sub-goal="index"
                    :edit-mode="false"
                    :add-time-picker="true"
                    @changeDate="changeStartDate"
                  />

                  <!-- Deadline -->
                  <Deadline
                    v-if="!checkSuperAdmin && !checkResource"
                    :object-item="item"
                    :change-custom="(indexDeadline === index) ? changeDeadlineCustom : false"
                    :edit-mode="false"
                    :add-time-picker="true"
                    @changeDate="changeField"
                  />
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
  import {_} from 'vue-underscore';
  import cookies from "js-cookie";
  import FroalaSuggestionListEditor from "./FroalaSuggestionListEditor";
  import Attendee from "./Attendee";
  import StartDate from "./StartDate";
  import Deadline from "./Deadline";
  import DeleteConfirmPopup from "./DeleteConfirmPopup";

  export default {
    name: "SubGoal",
    components: {
      FroalaSuggestionListEditor,
      Attendee,
      StartDate,
      Deadline,
      DeleteConfirmPopup,
    },
    props: {
      listArrayInput: {
        type: Array,
        required: true,
      },
      predefinedLinkArray: {
        type: Array,
        required: false,
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
      listArray: [],
      subGoalItem: {
        is_template: false,
        name: '',
        type: 'sub-goal',
        description: '',
        status: 'new',
        source: 'Goal',
        start_date: '',
        start_date_pre: '',
        deadline: '',
        deadline_pre: '',
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
      subGoalResourceItem: {
        is_template: true,
        industry: [],
        name: '',
        type: 'sub-goal',
        description: '',
        status: 'new',
        source: 'Goal',
      },
      changeDeadlineCustom: false,
      indexDeadline: 0,
      dialogDelete: false,
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
    },

    created() {
      if (this.listArrayInput) {
        this.addItem();
      }

      if (this.resource) {
        this.checkResource = this.resource;
      }
    },

    methods: {
      addItem() {
        let newItem = {};
        if (this.checkResource) {
          newItem = _.clone(this.subGoalResourceItem);
        } else {
          newItem = _.clone(this.subGoalItem);
        }
        this.listArray.unshift(newItem);
      },

      deleteItem(index) {
        this.listArray.splice(index, 1);
        this.dialogDelete = false;
      },

      changeStartDate(val) {
        this.indexDeadline = val.index;
        this.changeDeadlineCustom = val.changed;
        this.updateDetail(this.listArray);
      },

      changeField(val) {
        if (val.changed) {
          this.updateDetail(this.listArray);
        }
      },

      updateDetail(val) {
        this.$emit('updateSubGoal', {
          list: val,
        });
      }
    },
  };
</script>

<style scoped>

</style>

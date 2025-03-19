<template>
  <div class="manage-task">
    <div class="title-manage-task pt-7">
      {{ $t('title.activities') }}
    </div>

    <div class="manage-task mt-6">
      <b-row>
        <b-col v-for="(item, index) in activityArray" :key="index" cols="12" class="mb-5 mt-5">
          <div :class="checkResource ? 'section-connect-to section-connect-to-checklist-topic border-0 mb-5' : 'section-connect-to section-connect-to-checklist-topic'">
            <div class="section-connect-to-label section-connect-to-label-checklist add-new-section display-inline-flex">
              <v-text-field
                v-model="item.activity"
                :label="$t('form.title')"
                :rules="required"
                outlined
                :readonly="!instructionItem.editPermission"
              />
              <v-icon  class="ml-5 icon-checklist-topic-delete" @click="requestDelete(item)">
                delete
              </v-icon>
            </div>

            <div v-if="!checkResource" class="padding-15-checklist">
              <b-container>
                <b-row>
                  <b-col>
                    <div class="input-wrap custom-min-height-auto">
                      <v-select
                        v-model="item.department"
                        :items="departmentsArray"
                        item-text="name"
                        item-value="id"
                        multiple
                        outlined
                        chips
                        :readonly="!instructionItem.editPermission"
                        :label="$t('form.assign_to_departments')"
                      >
                        <template v-slot:prepend-item>
                          <v-list-item
                            ripple
                            @click="toggle1(item)"
                          >
                            <v-list-item-action>
                              <v-icon :color="item.department.length > 0 ? 'indigo darken-4' : ''">{{ icon1(item) }}</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                              <v-list-item-title>{{ $t('form.select_all') }}</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                          <v-divider class="mt-2"></v-divider>
                        </template>
                      </v-select>
                    </div>
                  </b-col>
                  <b-col>
                    <div class="input-wrap custom-min-height-auto">
                      <v-select
                        v-model="item.employee"
                        :items="employeeArray"
                        item-text="name"
                        item-value="id"
                        multiple
                        outlined
                        chips
                        :readonly="!instructionItem.editPermission"
                        :label="$t('form.assign_to_employees')"
                      >
                        <template v-slot:prepend-item>
                          <v-list-item
                            ripple
                            @click="toggle(item)"
                          >
                            <v-list-item-action>
                              <v-icon :color="item.employee.length > 0 ? 'indigo darken-4' : ''">{{ icon(item) }}</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                              <v-list-item-title>{{ $t('form.select_all') }}</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                          <v-divider class="mt-2"></v-divider>
                        </template>
                      </v-select>
                    </div>
                  </b-col>
                </b-row>
              </b-container>
            </div>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="3">
          <v-btn v-if="instructionItem.editPermission" class="btn-create-task" @click="addMoreActivity">
            {{ $t('button.add_activity') }}
          </v-btn>
        </b-col>
        <b-col v-if="isShowInputActivity" cols="9" class="mt-2">
          <div class="connect-department">
            <div class="department d-flex">
              <v-text-field
                v-model="newActivity.activity"
                :rules="required"
                outlined
              />
              <span class="department-button">
                <v-btn class="mb-2 btn-add-department" @click="addNewActivityName">
                  {{ $t('button.add') }}
                </v-btn>
                <v-btn class="mt-1 mb-2 btn-cancel-department" @click="cancelNewActivityName">
                  {{ $t('button.cancel') }}
                </v-btn>
              </span>
            </div>
          </div>
        </b-col>
      </b-row>
    </div>

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
            {{ $t('button.no') }}
          </v-btn>
          <v-btn class="btn-save" @click="deleteItem">
            {{ $t('button.yes') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
<!--    <v-data-table v-if="isShowInputActivity" :headers="(!resource || (resource && editMode)) ? headerActivityArray : headerTemplateActivityArray" outlined :items="activityArray"-->
<!--                  class="elevation-1 table-task header-task"-->
<!--                  :items-per-page="15" :single-expand="true" hide-default-footer-->
<!--    >-->
<!--      <template v-slot:item.activity="{ item }">-->
<!--        <v-textarea v-model="item.activity" auto-grow rows="1" :rules="required" />-->
<!--      </template>-->
<!--      <template v-slot:item.assignee="{ item }">-->
<!--        <v-select v-if="!resource || (resource && editMode)" v-model="item.assignee" :items="usersArray" item-text="name" item-value="id" :rules="required" />-->
<!--      </template>-->
<!--&lt;!&ndash;      <template v-slot:item.assignee="{ item }">&ndash;&gt;-->
<!--&lt;!&ndash;        <MultipleSelection&ndash;&gt;-->
<!--&lt;!&ndash;          :list-option-input="usersArray"&ndash;&gt;-->
<!--&lt;!&ndash;          :item-text="'name'"&ndash;&gt;-->
<!--&lt;!&ndash;          :item-value="'id'"&ndash;&gt;-->
<!--&lt;!&ndash;          :label="'Department'"&ndash;&gt;-->
<!--&lt;!&ndash;          :selected-items-input="selectedEmployee"&ndash;&gt;-->
<!--&lt;!&ndash;          @getSelectedItems="getSelectedEmployee"&ndash;&gt;-->
<!--&lt;!&ndash;        />&ndash;&gt;-->
<!--&lt;!&ndash;      </template>&ndash;&gt;-->

<!--      <template v-slot:item.action="{ item }">-->
<!--        <v-icon class="info-table-action-icon" small @click="deleteActivityFromList(item)">-->
<!--          delete-->
<!--        </v-icon>-->
<!--      </template>-->
<!--    </v-data-table>-->
<!--    <v-btn class="btn-create-task" outlined @click="addMoreActivity">-->
<!--      Add new-->
<!--    </v-btn>-->
  </div>
</template>
<script>
  // import {_} from 'vue-underscore';
  // import MultipleSelection from "./MultipleSelection";

  import {_} from "vue-underscore";

  export default {
    components: {
      // MultipleSelection,
    },
    props: {
      itemID: Number,
      resource: Boolean,
      editedIndex: Number,
      employeeArray: Array,
      editMode: Boolean,
      departmentsArray: Array,
      activityArrayInput: {
        type: Array,
        required: false,
      },
      instructionItem: {
        type: Object,
      },
    },
    // props: [
    //   'itemID', 'resource', 'editedIndex', 'usersArray', 'editMode'
    // ],
    data: function () {
      return {
        required: [
          v => {
            if (!v || v.length < 1)
              return 'This is required';
            else return true;
          }
        ],
        headerActivityArray: [
          {text: 'Activity Name', value: 'activity', sortable: false, align: 'center', width: '65%'},
          {text: 'Assignee', value: 'assignee', sortable: false, align: 'center', width: '27%'},
          {text: 'Action', value: 'action', sortable: false, align: 'center', width: '8%'},
        ],
        headerTemplateActivityArray: [
          {text: 'Activity Name', value: 'activity', sortable: false, align: 'center', width: '80%'},
          {text: 'Action', value: 'action', sortable: false, align: 'center', width: '20%'},
        ],
        activityArray: [],
        newActivity: {
          id: "",
          activity: '',
          employee: '',
          department: '',
        },
        defaultActivity: {
          id: "",
          activity: '',
          employee: '',
          department: '',
        },
        isShowInputActivity: false,
        formDirty: false,
        checkResource: false,
        dialogDelete: false,
        requestDeleteItem: '',
      };
    },

    watch: {
      activityArrayInput(value) {
        if (value && value.length > 0) {
          this.activityArray = value;
        } else {
          this.activityArray = [];
        }
      },

      // itemID: {
      //   handler: 'getItem',
      //   immediate: true,
      // },

      activityArray: {
        handler: 'getActivityArray',
        immediate: true,
      },

      resource(value) {
        if (value) {
          this.checkResource = value;
        }
      },
    },

    created() {
      if (this.activityArrayInput && this.activityArrayInput.length > 0) {
        this.activityArray = this.activityArrayInput;
        // this.isShowInputGoal = true;
      } else {
        this.activityArray = [];
        // this.isShowInputGoal = false;
      }

      if (this.resource) {
        this.checkResource = this.resource;
      }
    },

    methods: {
      getActivityArray() {
        this.$emit('getActivityArray', {
          activityArray: this.activityArray,
          formDirty: this.formDirty,
        });
      },

      requestDelete(item) {
        this.requestDeleteItem = item;
        this.dialogDelete = true;
      },

      closeDelete() {
        this.dialogDelete = false;
      },

      // getItem() {
      //   var that = this;
      //   that.activityArray = [];
      //   if (that.itemID) {
      //     that.$store.dispatch('instructions/show', this.itemID).then(result => {
      //       that.activityArray = result.data.instruction_activities;
      //       that.isShowInputActivity = result.data.instruction_activities.length > 0; // show list activities
      //       that.$nuxt.$loading.finish();
      //     }).catch((error) => {
      //       that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
      //       that.$nuxt.$loading.finish();
      //     });
      //   }
      // },

      // addMoreActivity() {
      //   this.formDirty = true;
      //   this.isShowInputActivity = true;
      //   if (this.activityArray.length > 0) {
      //     this.newActivity.id = this.activityArray[this.activityArray.length - 1].id + 1;
      //   } else {
      //     this.newActivity.id = 1;
      //   }
      //   this.activityArray.push(this.newActivity);
      //   this.newActivity = Object.assign({}, this.defaultActivity);
      // },
      //
      // deleteActivityFromList(item) {
      //   this.formDirty = true;
      //   if (this.activityArray.length === 1) {
      //     this.isShowInputActivity = false;
      //   }
      //   this.activityArray.splice(this.activityArray.findIndex(i => i.id === item.id), 1);
      // },
      //
      // deleteActivity(item) {
      //   let that = this;
      //   that.$store.dispatch('instructions/deleteActivity', item.id).then(function() {
      //   }).catch((error) => {
      //     that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
      //     that.$nuxt.$loading.finish();
      //   });
      // },

      // getSelectedEmployee(value) {
      //   this.selectedEmployee = value.selectedItemsOutput;
      // },

      deleteItem() {
        this.deleteActivityFromList(this.requestDeleteItem);
        this.dialogDelete = false;
        this.requestDeleteItem = '';
      },

      deleteActivityFromList(item) {
        // console.log(item);
        this.formDirty = true;
        this.activityArray.splice(this.activityArray.indexOf(item), 1);
      },

      addMoreActivity() {
        this.isShowInputActivity = true;
      },

      addNewActivityName(){
        let newData = _.clone(this.newActivity);
        this.activityArray.push(newData);
        this.isShowInputActivity = false;
        this.newActivity.activity = "";
      },

      cancelNewActivityName() {
        this.isShowInputActivity = false;
      },

      likesAllFruit (item) {
        return item.employee.length === this.employeeArray.length;
      },

      likesSomeFruit (item) {
        return item.employee.length > 0 && !this.likesAllFruit(item);
      },

      icon (item) {
        if (this.likesAllFruit(item)) return 'mdi-close-box';
        if (this.likesSomeFruit(item)) return 'mdi-minus-box';
        return 'mdi-checkbox-blank-outline';
      },

      toggle (item) {
        var that = this;
        this.$nextTick(() => {
          if (that.likesAllFruit(item)) {
            item.employee = [];
          } else {
            item.employee = [];
            _.each(that.employeeArray, function (task) {
              item.employee.push(task.id);
            });
          }
        });
      },

      likesAllFruit1 (item) {
        return item.department.length === this.departmentsArray.length;
      },

      likesSomeFruit1 (item) {
        return item.department.length > 0 && !this.likesAllFruit1(item);
      },

      icon1 (item) {
        if (this.likesAllFruit1(item)) return 'mdi-close-box';
        if (this.likesSomeFruit1(item)) return 'mdi-minus-box';
        return 'mdi-checkbox-blank-outline';
      },

      toggle1 (item) {
        var that = this;
        this.$nextTick(() => {
          if (that.likesAllFruit1(item)) {
            item.department = [];
          } else {
            item.department = [];
            _.each(that.departmentsArray, function (task) {
              item.department.push(task.id);
            });
          }
        });
      },

    }
  };
</script>

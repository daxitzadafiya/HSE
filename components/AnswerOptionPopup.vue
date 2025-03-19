<template>
  <div>
    <v-dialog v-model="openPopup" max-width="1200px" persistent>
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
              <b-col cols="6">
                <div class="input-wrap">
                  <v-text-field v-model="editedItem.name" :label="$t('form.name')" :rules="required" outlined />
                </div>
              </b-col>
              <b-col cols="3">
                <div class="switch-component document-type-wrap">
                  <label class="left-text">{{ $t('form.slider') }}</label>
                  <v-switch
                    v-model="optionAnswerType"
                    :label="$t('form.dropdown')"
                    class="right-text"
                    :disabled="editMode"
                    inset
                    @change="changeAnswerType(optionAnswerType)"
                  />
                </div>
              </b-col>
              <b-col v-if="userRoleId > 1" cols="3" class="hse-checklist-option-badge">
                <div class="switch-component">
                  <label class="left-text">Activate</label>
                  <v-switch
                    v-model="is_template_option"
                    :label="$t('form.template')"
                    class="right-text"
                    inset
                    :disabled="checkResource"
                  />
                </div>
                <v-badge
                  :value="hoverActionForNewDefaultOption"
                  right
                  transition="slide-x-transition"
                  class="hse--icon-question-circle"
                >
                  <span slot="badge">* Template is applied to all checklist<br/>** Activate is applied to current checklist only</span>
                  <v-hover v-model="hoverActionForNewDefaultOption">
                    <i class="fa fa-question-circle"></i>
                  </v-hover>
                </v-badge>
              </b-col>
            </b-row>
            <div class="manage-task">
              <v-data-table
                :headers="headerOptionAnswerArray"
                outlined
                :items="optionAnswerArray"
                class="elevation-1 table-task header-task"
                :single-expand="true"
                hide-default-footer
                :sort-by="['created_at']"
                :sort-desc="[true, false]"
              >
                <template v-slot:body="props">
                  <draggable
                    :list="props.items"
                    tag="tbody"
                  >
                    <tr
                      v-for="(item, index) in props.items"
                      :key="index"
                      @dragend="dragQuestionOptionAnswer(props.items)"
                    >
                      <td class="text-center clickable">
                        <v-icon small title="Drag to rearrange options order">
                          mdi-arrow-all
                        </v-icon>
                      </td>
                      <td class="text-center">
                        <v-textarea v-model="item.name" auto-grow rows="1" :rules="required" />
                      </td>
                      <td class="text-center">
                        {{ index + 1 }}
                      </td>
                      <td class="text-center">
                        <v-icon :disabled="!optionAnswerType || optionAnswerArray.length < 4" class="info-table-action-icon clickable" small @click="deleteOptionAnswer(index)">
                          delete
                        </v-icon>
                      </td>
                    </tr>
                  </draggable>
                </template>
                <template v-slot:no-data>
                  {{ $t('table.no_data') }}
                </template>
              </v-data-table>
              <v-btn v-if="optionAnswerType" class="btn-create-task" outlined @click="addMoreOptionAnswer">
                {{ $t('button.add_more') }}
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions class="popup-footer">
          <v-spacer />
          <v-btn class="btn-cancel" text @click="close">
            {{ $t('button.cancel') }}
          </v-btn>
          <v-btn
            v-if="userRoleId === 1 || (((!editMode || (editMode && editedItem.added_by > 1)) && checkResource && (checkAdmin || permissionsUser.indexOf(',checklist-resource') > -1)) || (!checkResource && (checkAdmin || permissionsUser.indexOf(',checklist-basic') > -1)))"
            class="btn-save"
            @click="save"
          >
            {{ $t('button.save') }}
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
            {{ $t('button.yes') }}
          </v-btn>

          <v-btn class="btn-cancel" text @click="dialogConfirmClose = false">
            {{ $t('button.no') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import {_} from 'vue-underscore';
  import VueDraggable from 'vuedraggable';
  import cookies from "js-cookie";

  export default {
    name: "AnswerOptionPopup",
    components: {
      draggable: VueDraggable,
    },
    props: {
      resource: Boolean,
      answerOptionItem: {
        type: Object,
        required: false,
      },
      openPopup: Boolean,
    },
    data: () => ({
      permissionsUser: localStorage.getItem('permissionsKey'),
      checkAdmin: cookies.get('checkAdmin'),
      userRoleId: parseInt(cookies.get('roleID')),
      valid: true,
      // real data
      required: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else return true;
        }
      ],

      // New CHECKPOINT
      isAddNewCheckpoint: false,
      headersCheckpointOptions: [
        {text: 'Slider', align: 'left', value: 'slider'},
        {text: 'Dropdown', align: 'left', value: 'dropdown'}
      ],
      editedItem: {
        name: '',
        type_of_option_answer: '',
        company_id: '',
        checklist_id: '',
        answer: [],
        is_template: true,
      },
      defaultItem: {
        name: '',
        type_of_option_answer: '',
        company_id: '',
        checklist_id: '',
        answer: [],
        is_template: true,
      },
      optionAnswerType: false,
      optionAnswerArray: [],
      newOptionAnswer: {
        name: '',
        arrangement_order: ''
      },
      defaultOptionAnswer: {
        name: '',
        arrangement_order: ''
      },
      is_template_option: true,
      hoverActionForNewDefaultOption: false,
      checkResource: false,
      dialogConfirmClose: false,
      editMode: true,
      formDirty: false,
      formTitle: '',
    }),

    computed: {
      headerOptionAnswerArray() {
        return [
          {text: '', align: 'center', value: 'drag', sortable: false},
          {text: this.translateCol('name'), align: 'center', value: 'name', sortable: false},
          {text: this.translateCol('arrangement'), align: 'center', value: 'arrangement_order', sortable: false},
          {text: this.translateCol('action'), align: 'center', value: 'action', sortable: false},
        ];
      },
    },

    watch: {
      openPopup(value) {
        if (value) {
          if (this.answerOptionItem) {
            this.editItem(this.answerOptionItem);
          } else {
            this.addNew();
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
      if (this.openPopup) {
        if (this.answerOptionItem) {
          this.editItem(this.answerOptionItem);
        } else {
          this.addNew();
        }
      }

      if (this.resource) {
        this.checkResource = this.resource;
      }
    },

    methods: {
      translateCol (colName) {
        return this.$i18n.t('column.' + colName);
      },

      reloadAnswerOptionsList() {
        this.$emit('reloadAnswerOptionsList');
      },

      addNew() {
        this.reset();
        this.changeAnswerType(false);
        this.is_template_option = this.checkResource;
        this.optionAnswerType = false;
        this.editMode = false;
        this.formTitle = this.$i18n.t('title.new_option');
      },

      editItem(item) {
        let that = this;
        that.$nuxt.$loading.start();
        that.formTitle = that.$i18n.t('title.edit_option');
        that.editedItem = Object.assign({}, item);
        // show option is Dropdown / Slider
        that.optionAnswerType = item.type_of_option_answer !== 1;
        // show option is Template / Activate
        that.is_template_option = item.is_template === 1;
        // that.newDefaultOptionIndex = item.id;
        that.$store.dispatch('optionAnswers/index', { option: item.id }).then(result => {
          that.optionAnswerArray = result.data;
          that.optionAnswerArray.sort(function (a, b) {
            return (a.arrangement_order - b.arrangement_order);
          });
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_checklist_option_view'));
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          }
          that.$nuxt.$loading.finish();
        });
      },

      close() {
        this.reset();
        this.formDirty = false;
        this.$emit('closePopup');
      },

      reset() {
        // this.$nuxt.$loading.finish();
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          // this.$refs.form.reset();
          this.$refs.form.resetValidation();
        }, 300);
      },

      changeAnswerType(type) {
        if (type) {
          this.optionAnswerArray = [
            {
              name: '',
              arrangement_order: 1
            }, {
              name: '',
              arrangement_order: 2
            }, {
              name: '',
              arrangement_order: 3
            }
          ];
        } else {
          this.optionAnswerArray = [
            {
              name: '',
              arrangement_order: 1
            }, {
              name: '',
              arrangement_order: 2
            }
          ];
        }
      },

      addMoreOptionAnswer() {
        if (this.optionAnswerArray.length > 0) {
          this.newOptionAnswer.arrangement_order = this.optionAnswerArray[this.optionAnswerArray.length - 1].arrangement_order + 1;
        } else {
          this.newOptionAnswer.arrangement_order = 1;
        }
        this.optionAnswerArray.push(this.newOptionAnswer);
        this.newOptionAnswer = Object.assign({}, this.defaultOptionAnswer);
      },

      dragQuestionOptionAnswer(list) {
        list = _.each(list, function (item) {
          item.arrangement_order = list.indexOf(item) + 1;
        });
        this.optionAnswerArray = list;
      },

      deleteOptionAnswer(index) {
        this.optionAnswerArray.splice(index, 1);
        this.dragQuestionOptionAnswer(this.optionAnswerArray);
      },

      // show list option with format name 'NAME - Slider / Dropdown'
      formatNameOfDefaultOptionType(list) {
        _.each(list, function (option) {
          if (option.type_of_option_answer === 1) {
            option.option_name = option.name + ' - Slider';
          } else {
            option.option_name = option.name + ' - Dropdown';
          }
        });
        return list;
      },

      // show type of each default option
      formatDefaultOptionType(type) {
        if (type === 1) {
          return 'Slider';
        } else {
          return 'Dropdown';
        }
      },

      save() {
        let that = this;
        if (that.$refs.form.validate()) {
          that.$nuxt.$loading.start();
          that.editedItem.answer = that.optionAnswerArray;
          that.editedItem.count_option_answers = that.optionAnswerArray.length;
          if (that.editMode) {
            that.$store.dispatch('options/update', that.editedItem).then(function () {
              that.reloadAnswerOptionsList();
              that.$toaster.success(that.$i18n.t('message.success_checklist_option_update'));
            }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_checklist_option_update'));
              // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          }
              that.$nuxt.$loading.finish();
            });
          } else {
            if (that.optionAnswerType) {
              that.editedItem.type_of_option_answer = 2;
            } else {
              that.editedItem.type_of_option_answer = 1;
            }
            that.editedItem.is_template = that.is_template_option;
            if (that.editedItem.is_template) {
              that.editedItem.count_used_time = 0;
            } else {
              that.editedItem.count_used_time = 1;
            }
            // that.editedItem.answer = that.optionAnswerArray;
            if (that.editedIndex > -1 && that.is_template_option !== 1) {
              that.editedItem.checklist_id = that.editedItem.id;
            }
            that.$store.dispatch('options/store', that.editedItem).then(function () {
              that.reloadAnswerOptionsList();
              that.$toaster.success(that.$i18n.t('message.success_checklist_option_add_new'));
            }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_checklist_option_add_new'));
              // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          }
              that.$nuxt.$loading.finish();
            });
          }
          that.close();
        }
      },

      checkListDefaultOptionForNewChecklist(listOption, listTopic) {
        let optionItem = null;
        let defaultOptionsList = [];
        _.each(listTopic, function (item) {
          if (item.questions.length > 0) {
            _.each(item.questions, function (question) {
              optionItem = _.findWhere(listOption, { id: question.default_option_id });
              if (optionItem) {
                defaultOptionsList.push(optionItem);
              }
            });
          }
        });
        return defaultOptionsList;
      },

      // checkDirtyForm(){
      //   let that = this;
      //   let result = false;
      //   _.each(that.editedItem, function(value, key, obj) {
      //     if(that.originData && obj[key] && that.originData[key] && obj[key] !== that.originData[key]){
      //       result = true;
      //     }
      //   });
      //   return result;
      // },

      // checkDirtyBeforeClose(){
      //   if(this.checkDirtyForm()){
      //     this.dialogConfirmClose = true;
      //   }else{
      //     this.close();
      //   }
      // },
    },
  };
</script>

<style scoped>

</style>

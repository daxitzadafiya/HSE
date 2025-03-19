<template>
  <div>
    <v-dialog v-model="openPopup" max-width="900px" persistent>
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
            <b-row class="justify-content-between">
              <b-col cols="6">
                <div class="input-wrap">
                  <v-text-field v-model="editedItem.name" :label="$t('form.name')" :rules="required" outlined/>
                </div>
              </b-col>
              <b-col cols="3" class="mr-6">
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
              <!-- <b-col v-if="userRoleId > 1" cols="3" class="hse-checklist-option-badge">
                <div class="switch-component">

                  <label class="left-text">Activate</label>
                  <v-switch
                    v-model="is_template_option"
                    :label="$t('form.template')"
                    class="right-text"
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
              </b-col> -->
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
                <template v-slot:header.arrangement_order="{ header }">
                  <div role="button" v-if="!optionAnswerType"
                       class="plus-icon-gray text-center d-flex align-center justify-center">
                    +
                  </div>
                  <div role="button" v-else class="plus-icon text-center" @click="addMoreOptionAnswer">+</div>
                </template>
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
                      <!-- <td class="text-center clickable">
                        <v-icon small title="Drag to rearrange options order">
                          mdi-arrow-all
                        </v-icon>
                      </td> -->

                      <td class="text-center ">
                        {{ index + 1 }}
                      </td>
                      <td class="text-center">
                        <v-textarea v-model="item.name" auto-grow rows="1" :rules="required"/>
                      </td>
                      <td class="text-center">
                        <v-icon :disabled="!optionAnswerType || optionAnswerArray.length < 3"
                                class="info-table-action-icon clickable" small @click="deleteOptionAnswer(index)">
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

            </div>
            <b-row>
              <!-- <b-col cols="2" class="hse-document-badge-tab">
                <div class="bold-title md-line-height">
                  {{$t('form.default') }}
                </div>
              </b-col>
              <b-col cols="4">
                <div class="input-wrap">
                  <div class="switch-component default-question-mark">
                    <label class="left-text">{{ $t('form.none') }}</label>
                    <v-switch
                      v-model="is_template_option"
                      :label="$t('form.active')"
                      class="right-text"
                      inset
                    />
                  </div>
                </div>
              </b-col> -->
              <div class="section-required-action d-flex mt-8">
                <b-col cols="4">
                  <div class="required-action-title">
                    {{$t('form.default') }}
                  </div>
                </b-col>
                <b-col cols="2"  class="ml-n1">
                  <div class="switch-component">
                    <label class="left-text">{{ $t('form.none') }}</label>
                    <v-switch
                      v-model="is_template_option"
                      :label="$t('form.active')"
                      inset
                      class="right-text"
                    />
                  </div>
                </b-col>
              </div>
            </b-row>
            <!-- <RequiredComment
                :object-item="editedItem"
                :is-attendee="false"
                :isChecklistOption="true"
            /> -->
            <NewRequiredComment
              :object-item="editedItem"
              :edit-mode="editMode"
              :is-attendee="false"
              :mainAction="$t('form.action')"
              :subActionFirst="$t('form.comment')"
              :subActionSecond="$t('form.image')"
              :checkActionswitch="editedItem.checklist_required_comment == 1 || editedItem.checklist_required_attachment == 1"
              :checkCommentswitch="editedItem.checklist_required_comment == 1"
              :checkAttachmentswitch="editedItem.checklist_required_attachment == 1"
              class="required-comment"
              :isBadge="false"
              :isChecklistOption="true"
            />
            <!-- <div class="input-wrap switch-component question-mark-block">
                <label class="left-text bold-title">{{ $t('form.default') }}</label>
                <v-switch
                  v-model="is_default"
                  inset
                  :label="$t('form.active')"
                  class="right-text ml-5"
                />
                <v-badge
                  :value="hoverQuestionMark"
                  right
                  transition="slide-x-transition"
                  class="hse--icon-question-circle"
                  content="Default"
                >
                  <v-hover v-model="hoverQuestionMark">
                    <i class="fa fa-question-circle ml-5"></i>
                  </v-hover>
                </v-badge>
              </div> -->

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
          <v-spacer/>
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
  import NewRequiredComment from "./NewRequiredComment";

  export default {
    name: "NewAnswerOptionPopup",
    components: {
      draggable: VueDraggable,
      NewRequiredComment,
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
      hoverQuestionMark: false,
      is_default: false,
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
        checklist_required_attachment:false,
        checklist_required_comment:false
      },
      defaultItem: {
        name: '',
        type_of_option_answer: '',
        company_id: '',
        checklist_id: '',
        answer: [],
        is_template: true,
        checklist_required_attachment:false,
        checklist_required_comment:false
      },
      optionAnswerType: false,
      // optionAnswerArray: [],
      newOptionAnswer: {
        name: '',
        arrangement_order: ''
      },
      optionAnswerArray: [
        {
          name: '',
          arrangement_order: 1
        }, {
          name: '',
          arrangement_order: 2
        }
      ],
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
          // {text: '', align: 'center', value: 'drag', sortable: false},
          {text: '', align: 'center', value: 'arrangement_order', sortable: false},
          {text: this.translateCol('name'), align: 'center', value: 'name', sortable: false},
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
      translateCol(colName) {
        return this.$i18n.t('column.' + colName);
      },

      reloadAnswerOptionsList() {
        this.$emit('reloadAnswerOptionsList');
      },

      isSelectOption(item){
        this.$emit('isSelectOption' , item);
      },

      addNew() {
        this.reset();
        this.changeAnswerType(false);
        this.is_template_option = this.checkResource;
        this.optionAnswerType = false;
        this.editMode = false;
        this.formTitle = this.$i18n.t('title.new_option');
        this.optionAnswerArray = [{name: '',arrangement_order: 1}, {name: '',arrangement_order: 2}]
      },

      editItem(item) {
        let that = this;
        console.log(item);
        that.$nuxt.$loading.start();
        that.formTitle = that.$i18n.t('title.edit_option');
        that.editedItem = Object.assign({}, item);
        // show option is Dropdown / Slider
        that.optionAnswerType = item.type_of_option_answer !== 1;
        // show option is Template / Activate
        that.is_template_option = item.is_template === 1;
        // that.newDefaultOptionIndex = item.id;
        that.$store.dispatch('options/show',item.id).then(result => {
          that.optionAnswerArray = result.data.option_answers;
          that.optionAnswerArray.sort(function (a, b) {
            return (a.arrangement_order - b.arrangement_order);
          });
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          console.log(error);
          that.$toaster.error(that.$i18n.t('message.fail_checklist_option_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      },

      close() {
        // this.reset();
        // this.formDirty = false;
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

      changeAnswerType() {
        if(this.optionAnswerType==true){
          this.addMoreOptionAnswer()
        }
        else if(this.optionAnswerType==false){
        this.optionAnswerArray.splice(2);
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
          that.editedItem.is_template = that.is_template_option;
          that.editedItem.count_option_answers = that.optionAnswerArray.length;
          if (that.editMode) {
            that.$store.dispatch('options/update', that.editedItem).then(function () {
              that.reloadAnswerOptionsList();
              that.$nuxt.$loading.finish();
              that.$toaster.success(that.$i18n.t('message.success_checklist_option_update'));

            }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_checklist_option_update'));
              }
              // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
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
            that.$store.dispatch('options/store', that.editedItem).then(function (response) {
              that.editedItem?.answer.map((item)=>{
                item.name=""
              })
              that.isSelectOption(response);
              that.reloadAnswerOptionsList();
              that.$nuxt.$loading.finish();
              that.$toaster.success(that.$i18n.t('message.success_checklist_option_add_new'));
            }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_checklist_option_add_new'));
              }
              // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
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
              optionItem = _.findWhere(listOption, {id: question.default_option_id});
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
  .plus-icon-gray {
    width: 25px;
    height: 25px;
    background-color: #9f9f9f;
    margin: 0 auto;
    border-radius: 100%;
    font-size: 30px;
    line-height: 0.9;
    color: #fff;
  }

  .plus-icon {
    width: 25px;
    height: 25px;
    background-color: #fff;
    margin: 0 auto;
    border-radius: 100%;
    font-size: 30px;
    line-height: 0.9;
    color: #85a33d;
  }

  /* :deep(.required-action-title b){
    font-size: 16px;
  } */

  :deep(.required-comment .sub-action) {
    margin-left: 85px;
  }

  :deep(.required-comment .sub-action-2) {
    max-width: 100px !important;
    margin-left: 40px;
  }
  :deep(.required-comment .main-action-switch) {
    max-width: 100px !important;
    margin-left: -46px;
  }
</style>

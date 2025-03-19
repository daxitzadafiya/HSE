<template>
  <div>
    <v-dialog v-model="openPopup" max-width="1125px" persistent>
      <v-card>
        <v-card-title class="text-h5 justify-content-center text-uppercase pt-7">
          {{ titleMessage }}
        </v-card-title>
        <v-card-text>
          <div class="review-popup">
            <div class="review-popup-table normal-table mt-6">
              <!-- name -->
              <div class="info-block w-50 align-center">
                <div class="label-item">{{ $t('form.name') }}:</div>
                <div class="info-item">
                  {{ documentItem.name }}
                  <!-- {{ 'Checklist Name' }} -->
                </div>
              </div>

              <!-- Source -->
              <div class="info-block w-50">
                <div class="label-item">{{ $t('form.function') }} :</div>
                <div class="info-item">
                  {{documentItem.type }}
                </div>
              </div>

              <!-- Added by -->
              <div cols="6" class="info-block w-50">
                <div class="label-item">{{ $t('form.added_by') }} :</div>
                <div class="info-item">
                  {{ documentItem.addedByName }}
                </div>
              </div>

              <!-- Category -->

              <div class="info-block w-50">
                <div class="label-item">{{ $t('form.category') }} :</div>
                <div class="info-item">
                  {{ documentItem.categoryName }}
                </div>
              </div>

              <!-- Description -->

              <div :class="isEdit ? 'info-block' : 'info-block'">
                <div class="label-item">{{ $t('form.description') }}:</div>
                <div class="info-item">
                  {{ documentItem.description }}
                </div>
              </div>

              <!--security -->
              <div cols="6" class="info-block w-50">
                <div class="label-item">{{ $t('form.security') }} :</div>
                <div class="info-item">
                  {{ documentItem.is_shared==1 ?  $t('message.shared') : $t('message.personal') }}
                </div>
              </div>

              <!-- Responsible -->
              <div
                class="info-block w-50 px-4 chip"
                @click="
                  checkAdmin || checkCreator
                    ? (isEdit = !isEdit)
                    : (isEdit = false)
                "
              >
                <div class="label-item col-3 p-0 m-0">{{ $t('form.responsible') }} :</div>
                <div
                  class="
                    info-item
                    d-flex
                    justify-content-between
                    responsible-folddown
                  "
                >
                  <!-- v-for="(item, index) in responsibleName"
  :key="index" -->
                  <div>
                      <v-chip
                    v-for="(item, index) in responsibleName"
                    :key="index"
                    class="mr-2 mb-1 chip-custom"
                    small
                  >
                    {{ item }}
                  </v-chip>
                  </div>
                </div>
              </div>
            </div>

            <v-form ref="form" v-model="valid" lazy-validation>
              <div class="manage-task mt-6">
                <b-row class="mx-1">
                  <b-col v-for="(item, index) in topicArray" :key="index" cols="12" class="mb-5 mt-5">
                  <div
                    class="
                      section-connect-to section-connect-to-reminder
                      mt-4
                      w-100
                    "
                  >
                    <div
                      class="
                        section-connect-to-label topic-title
                      "
                    >
                      {{item?.name }}
                    </div>
                    <div class="padding-15-checklist">

                      <v-expansion-panels class="mt-3" v-for="(question , innerIndex) in item?.questions" :key="question.questions">
                        <!-- <v-expansion-panels > -->
                        <!-- v-for="(question,i) in item.questions"
                        :key="question.questions" -->
                        <!-- v-for="(option) in item.option_answers" :key="option.option_answers" -->
                        <v-expansion-panel :class="(custError && queTopicID == item?.id && queID == question?.id) ? 'cust-validation' : ''" >
                          <v-expansion-panel-header>
                            <template v-slot:default="{ open }">
                              <div class="d-flex justify-content-between align-center"  >
                                <span class="col-5">{{
                                  question?.name
                                }}</span>
                                <span class="col-5" @click.stop>
                                  <v-col class="p-0 mb-n5 col-10">
                                    <div class="mb-3">
                                      {{question?.option_name}}
                                    </div>
                                    <v-select v-if="question.type_of_option_answer == 2"
                                    :key="innerIndex"
                                        :items="question?.option_answers"
                                        label="Choose option"
                                        item-text="name"
                                        dense
                                        outlined
                                        :rules="required"
                                        item-value="id"
                                        @change="(e)=> getSelectedItemId(e , item.id ,question.id)"
                                      />

                                      <div class="mt-0" v-if="question.type_of_option_answer == 1">
                                          <b-col class="px-1">
                                            <div class="d-flex align-center">
                                              <label class="left-text mr-4">{{ question.option_answers[0].name }}</label>
                                              <v-switch
                                                :label="question.option_answers[1].name"
                                                inset
                                                :item-value="question.option_answers[0].id"
                                                :false-value="question.option_answers[0].id" 
                                                :true-value="question.option_answers[1].id"
                                                class="right-text"
                                                @change="(e)=> getSelectedItemId(e, item.id ,question.id)"
                                              />
                                            </div>
                                          </b-col>
                                      </div>
                                  </v-col>
                                </span>
                                <div
                                  class="
                                    col-2
                                    d-flex
                                    justify-content-end
                                    align-center
                                  "
                                >
                                <div v-if="question.required_comment==1 || question.required_attachment==1 || question.required_attachment=='1'">

                                  <span class="topic-plus"> <img src="../assets/images/plus.png"  alt="" srcset="" > </span>
                                  <span class="topic-minus"> <img src="../assets/images/minus.png" alt="" srcset="" > </span>
                                </div>
                                  <img v-if="question.required_comment == 1 || question.checklist_required_comment === 1"
                                    src="../assets/images/gridIcon/comment_fill_red.png"
                                    alt=""
                                    srcset=""
                                    class="ml-3"
                                  />
                                  <img v-else
                                    src="../assets/images/gridIcon/comment.png"
                                    alt=""
                                    srcset=""
                                    class="ml-3"
                                  />
                                  <img v-if="question.required_attachment == 1 || question.required_attachment === '1' || question.checklist_required_attachment === '1'"
                                    src="../assets/images/icon/image-red.png"
                                    class="ml-3"
                                    @click.stop
                                  />
                                  <img v-else
                                    src="../assets/images/icon/image-gray.png"
                                    class="ml-3"
                                    @click.stop
                                  />
                                </div>
                              </div>
                            </template>
                            <template v-slot:actions>
                              <v-icon class="d-none"> mdi-check </v-icon>
                            </template>
                          </v-expansion-panel-header>
                          <v-expansion-panel-content v-if="question.required_comment || question.required_attachment">
                            <b-row>
                              <div class="input-wrap px-6" v-if="question.required_comment == 1" 
                              :class="question.required_comment==1 && (!question.required_attachment || question.required_attachment == '0') ? 'col-12' : (question.required_comment==1 || (question.required_attachment=='1' || question.required_attachment==1) ?'col-9' : 'col-12')">
                                <!-- <v-text-field
                                  v-model="editedItem.name"
                                  :rules="required"
                                  label="Comment"
                                  outlined
                                /> -->
                                <v-text-field 
                                v-model="question.description"
                                    label="Comment"
                                    outlined
                                    :rules="required"
                                  />
                              </div>
                              <div class="img-attachment pr-5" v-if="question.required_attachment == 1 || (question.required_attachment=='1' || question.required_attachment==1)" 
                              :class="!question.required_comment=='1' && (question.required_attachment=='1' || question.required_attachment==1) ? 'col-12' :  'col-3'">
                                <div class="required-upload-attachment" :class="!question.required_comment=='1' && (question.required_attachment=='1' || question.required_attachment==1) ? 'required-upload-attachment-full' : ''">
                                  <div class="upload-field text-center">
                                    <div v-if="previewUrl">
                                      <img
                                        class="image-field"
                                        v-bind:src="previewUrl"
                                        alt="image"
                                        :rules="required"
                                      />
                                      <v-file-input class="m-0 p-0"
                                        v-model="question.selectedFile"
                                        accept="image/png, image/jpeg, image/jpg, image/gif, image/svg"
                                        @change="previewImage(question.selectedFile,index)"
                                        :rules="required"
                                      />
                                    </div>
                                    <div v-else class="icon-upload-attachment">
                                      <v-file-input class="m-0 p-0"
                                        v-model="question.selectedFile"
                                        accept="image/png, image/jpeg, image/jpg, image/gif, image/svg"
                                        @change="previewImage(question.selectedFile,index)"
                                        :rules="required"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </b-row>
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </div>
                  </div>
                  </b-col>
                </b-row>
              </div>
            </v-form>
          </div>
        </v-card-text>

        <v-card-actions class="px-6 py-7">
          <v-spacer />

          <v-btn class="btn-cancel" text @click="close('closePopup')">
            {{ $t('button.cancel') }}
          </v-btn>
          <v-btn class="btn-save" @click.prevent="save">
            {{ $t('button.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { _ } from 'vue-underscore'
import api from '~/apis'
import cookies from 'js-cookie'

export default {
  name: 'ReportChecklist',
  props: {
    resource: {
      type: Boolean,
      required: false,
    },
    documentItem: {
      type: Object,
      required: false,
    },
    openPopup: Boolean,
    categoriesArray: Array,
    addedFrom: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: false,
    },
    predefinedLinkArray: {
      type: Array,
      required: false,
    },
    titleMessage: {
      type: String,
      required: false,
    },
    topicArray: {
      type: Array,
      required: false,
    },
    answerArray: {
      type: Array,
      required: false,
    },
    newReportData:{
      type: Object,
      required: false,
    },
    responsibleName:{
      type: Array,
      required: false,
    },
    custError:{
      type: Boolean,
      required: false,
    },
    queTopicID:{
      type: String,
      required: false,
    },
    queID:{
      type: String,
      required: false,
    }

  },
  data: () => ({
    formDirty: false,
    topicItem: [
                {
                    question: 'How many holes in the floor 2',
                    topicOption: ['Dropdown', 'Slider', 'Dropdown2', 'Slider2'],
                    comment:'test',
                    selectedFile: [],

                }
            ],
            
    hover: false,
    // panelExpanded:true,
    showLessTopic:false,
    userRoleId: parseInt(cookies.get('roleID')),
    userDepartmentID: parseInt(cookies.get('userDepartmentID')),
    checkAdmin: cookies.get('checkAdmin'),
    checkSuperAdmin: cookies.get('checkSuperAdmin'),
    roleUser: cookies.get('roleUser'),
    userLogged: parseInt(cookies.get('userID')),
    userID: parseInt(cookies.get('userID')),
    permissionsUser: localStorage.getItem('permissionsKey'),
    // selectedFile: [],
    valid: true,
    isEdit: false,
    checkCreator: false,
    checkManager: false,
    checkWorker: false,
    revised: false,
    documents: [],
    connected_to_task: [],
    connectToObject: [],
    // responsibleName: [],
    connectToObjectTableProp: [],
    object: [],
    category: [],
    approvedItem: [],
    checklistArray: [],
    durationData: {
      is_duration: false,
      duration: 1,
    },
    connectToArray: [],
    expanded: [],
    expandedPanels:[],
    connectToObjectFrom: { document_id: '', connectToArray: [], object_id: '' },
    status: -1,
    editedItem: {
      hover: false,
      industry_id: '',
      industry_id_arr: [],
      name: '',
      added_by_name: '',
      description: '',
      parent_id: '',
      type_of_attachment: 2,
      type: 'Attachment',
      category_id: '',
      categoryName: '',
      deadline: '',
      deadline_pre: '',
      show_manager: false,
      count_related_object: 0,
      related_objects: [],
      parent_object: '',
      editPermission: true,
      is_suggestion: false,
      // table Security
      object_type: 'document',
      is_shared: false,
      is_public: false,
      department_array: [],
      employee_array: [],
      is_reminder: false,
      is_name: false,
      reminder_name: '',
      is_description: false,
      reminder_description: '',
      is_routine: false,
      responsible_department_array: [],
      responsible_employee_array: [],
      attendee_department_array: [],
      attendee_employee_array: [],
      start_date_pre: '',
      start_date: '',
      attendee_all: false,
      is_commentSwitch: false,
      is_AttachSwitch: false,
      attachFile: [],
      remider_note: '',
      is_duration: false,
      duration: 1,

      // hover: false,
      // hoverQuestionMark: false
    },
    selectedItem: null,
    defaultItem: {
      hover: false,
      industry_id: '',
      industry_id_arr: [],
      name: '',
      added_by_name: '',
      description: '',
      parent_id: '',
      type_of_attachment: 2,
      type: 'Attachment',
      category_id: '',
      categoryName: '',
      // is_renewed: false,
      // renewed_employee_array: "",
      // renewed_employee_array_arr: [],
      deadline: '',
      deadline_pre: '',
      show_manager: false,
      // security_department_array: "",
      // security_project_array: "",
      // security_employee_array: "",
      // security_department_array_arr: [],
      // security_project_array_arr: [],
      // security_employee_array_arr: [],
      count_related_object: 0,
      related_objects: [],
      parent_object: '',
      editPermission: true,
      is_suggestion: false,
      // table Security
      object_type: 'document',
      is_shared: false,
      is_public: false,
      department_array: [],
      employee_array: [],
      is_reminder: false,
      is_name: false,
      reminder_name: '',
      is_description: false,
      reminder_description: '',
      is_routine: false,
      responsible_department_array: [],
      responsible_employee_array: [],
      attendee_department_array: [],
      attendee_employee_array: [],
      start_date_pre: '',
      start_date: '',
      attendee_all: false,
      is_commentSwitch: false,
      is_AttachSwitch: false,
      attachFile: [],
      remider_note: '',
      is_duration: false,
      duration: 1,
      // hover: false,
      // hoverQuestionMark: false
    },
    // newReportData: {
    //     checklist: "",
    //     status: 1,
    //     department: "",
    //     job_title: '',
    //     answers: [],
    //   },
    //   defaultReportData: {
    //     checklist: "",
    //     status: 1,
    //     department: "",
    //     job_title: '',
    //     answers: [],
    //   },
    required: [
      (v) => {
        if (!v || v.length < 1) return 'This is required'
        else return true
      },
    ],
    previewUrl: null,
    attachmentType: false,
    formTitle: '',
    editMode: true,
    categoriesValidArray: [],
    // answerArray:[],
    // topicArray:[],
    checkResource: false,
    is_duration: false,
    duration: 1,
    values:[],
    config: {
      events: {
        //
      },
    },
  }),

  watch: {
    openPopup(value) {
      if (value) {
        if (this.documentItem) {
          this.selectedItem = null
          let categoryId = this.documentItem.category_id
          this.categoriesValidArray = _.filter(
            this.categoriesArray,
            function (item) {
              return (
                !item.disable_status ||
                (item.disable_status && item.id === categoryId)
              )
            }
          )
          // this.editItem(this.topicArray)
          // this.panel=[this.topicArray]
        } else {
          this.categoriesValidArray = _.filter(
            this.categoriesArray,
            function (item) {
              return !item.disable_status
            }
          )
          this.addNew()
        }
      }
    },

    resource(value) {
      if (value) {
        this.checkResource = value
      }
    },

    topicArray(value) {
      if (value == '')
        this.topicArray.push({
          name: '',
          questions: [{ name: '', default_option_id: '', option_answers: '',required_comment:"",required_attachment:"",checklist_required_comment:"",checklist_required_attachment:"" }],
        })
    },
  },

  mounted() {
    if (this.roleUser == 'manager') {
      this.checkManager = true
    } else if (this.roleUser == 'user') {
      this.checkWorker = true
    }
  },

  created() {
    if (this.openPopup) {
      if (this.documentItem) {
        // this.editItem(this.documentItem)
      } else {
        this.addNew()
      }
    }

    if (this.resource) {
      this.checkResource = this.resource
    }

    this.checklistArray = [
      {
        name: 'Make eveyone happy 1',
        added_by_name: 'Company Admin',
        responsible: 'IT-Manager',
        categoryName: 'Category',
        updated_at: '18.09.2022',
        topic_points: '1/2',
        count_topic: '2',
      },
      {
        name: 'Make eveyone happy 1',
        added_by_name: 'Company Admin',
        responsible: 'IT-Manager',
        categoryName: 'Category',
        updated_at: '18.09.2022',
        topic_points: '1/2',
        count_topic: '2',
      },
      {
        name: 'Make eveyone happy 1',
        added_by_name: 'Company Admin',
        responsible: 'IT-Manager',
        categoryName: 'Category',
        updated_at: '18.09.2022',
        topic_points: '1/2',
        count_topic: '2',
      },
    ]
  },

  methods: {
     getSelectedItemId(id , tpId , qID) {
      // }
      let that=this
      _.each(that.topicArray, async function (topic) {
        _.each(topic.questions, async function  (question) {
          _.each(question.option_answers, async function  (answer) {
            // console.log("question",question);
            if (answer.id==id && question.id == qID && topic.id == tpId) {
              if(!JSON.stringify(that.values).includes(qID)){
                // console.log("if------------",id);
                that.values.push({
                  id:answer.id, 
                  name:answer.name,
                  question_id:question.id
                })
              }
              else{
                let index = that.values.findIndex(x => x.question_id == qID);
                that.values[index].id= answer.id;
                that.values[index].name= answer.name;
              }
              that.selectedItem=answer.id
            }
          })
          })
      })
    },

    deleteTopicList(item) {
      this.formDirty = true
      this.topicArray.splice(this.topicArray.indexOf(item), 1)
    },
    addNewTopicName() {
      this.newTopicData.questions = []
      this.isShowInputTopic = false
      this.newTopicData.name = ''
      this.topicArray.push({
        name: '',
        questions: [{ name: '', default_option_id: '', option_answers: '' , required_comment:"",required_attachment:"",checklist_required_comment:"",checklist_required_attachment:""}],
      })
    },
    deleteQuestionItem(item, question) {
      this.formDirty = true
      item.questions.splice(item.questions.indexOf(question), 1)
    },
    addMoreTopic() {
      this.isShowInputTopic = true
    },
    addNewQuestion(index) {
      this.isAddNewCheckpoint = true
      this.topicArray[index].questions.push({
        name: '',
        default_option_id: '',
        option_answers: '',
        required_comment:"",required_attachment:"",checklist_required_comment:"",checklist_required_attachment:""
      })
    },
    cancelNewTopicName() {
      this.isShowInputTopic = false
    },
    reloadAnswerOptionsList() {},

    changeTab(value) {
      this.$emit('changeTab', value)
    },
    translateCol(colName) {
      return this.$i18n.t('column.' + colName)
    },
    getNewCategory(value) {
      this.editedItem.category_id = value.newCategoryId
    },
    addNew() {
      this.reset()
      let defaultCategory = _.findWhere(this.categoriesValidArray, {
        is_primary: 1,
      })
      if (defaultCategory) {
        this.editedItem.category_id = defaultCategory.id
      }
      if (this.checkResource) {
        this.formTitle = this.$i18n.t('title.new_document_resource')
      } else {
        this.formTitle = this.$i18n.t('title.new_document')
      }
      this.editMode = false
      this.topicItem.selectedFile = []
      this.attachmentType = false

      // list checklist Default OPTIONS list
        this.$store.dispatch('options/index', {isNewChecklist: true}).then(result => {
          this.answerArray = _.sortBy(result.data, function(answer) {
            return answer.count_used_time;
          });
          this.formatNameOfDefaultOptionType(this.answerArray.reverse());
          this.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          this.$toaster.error(this.$i18n.t('message.fail_checklist_option_view'));
          }
          // this.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          this.$nuxt.$loading.finish();
        });
    },

    // editItem(item){
    //   console.log(item);
    //   _.each(this.topicArray, async function (topic) {
    //     _.each(topic.questions, async function  (question) {
    //       console.log("question",question);
    //       // this.selectedItem = null
    //     })
    //   })
    // },

    async getObject(item) {
      this.connectToObject = []
      await api.documents
        .connectRoutine(item.id)
        .then((result) => {
          let respo = result.data.data
          if (respo.length > 0) {
            respo.forEach((el) => {
              this.connectToObject.push({
                id: el.id,
                name: el.objectName,
                source: el.connect_to_source,
                category: el.categoryName,
                added: el.addedByUser,
                connectedBy: el.connectedByUser,
                connected_date: el.created_at,
              })
            })
          } else {
            this.connectToObject = []
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    close() {
      this.isEdit = false
      if (this.openPopup) {
        this.$emit('closePopup')
      }
    },

    reset() {
      this.$nuxt.$loading.finish()
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.newReportData = Object.assign({}, this.defaultReportData);
          this.newAnswer = Object.assign({}, this.defaultAnswer);
      }, 300)
    },
      save() {
      if (this.$refs.form.validate()) {
        this.$emit('createReport', this.values);
        // this.close();
      }
    },
    draft() {
      this.editedItem.status = 0
      this.save()
    },


    // dialog DELETE
    closeDelete() {
      this.dialogDelete = false
    },

    previewImage(file) {
        if (file) {
          // this.previewUrl = URL.createObjectURL(file);
          this.topicItem.selectedFile = file;
        } else {
          this.previewUrl = null;
          this.topicItem.selectedFile = null;
        }
      },

      getImage(file) {
        this.previewImage(file.imageFile);
      },
  },
}
</script>

<style scoped>
.checklist-popup {
  width: 100%;
  margin: 0 auto;
  font-size: 16px;
}

.checklist-popup .normal-table {
  display: flex;
  flex-wrap: wrap;
  border-top: 1px solid #e0e0e0;
  border-right: 1px solid #e0e0e0;
}

.checklist-popup .normal-table .info-block {
  display: flex;
  padding: 17px;
  border: 1px solid #e0e0e0;
  border-right: 0;
  border-top: 0;
  width: 100%;
}

.checklist-popup .normal-table .label-item {
  color: #666768;
  font-weight: 500;
  margin-right: 15px;
}

.checklist-popup .review-table {
  border: 1px solid #e0e0e0;
}

.checklist-popup .review-popup-table {
  margin-bottom: 40px;
}
.topic-plus {
  width: 22px;
    height: 22px;
    border: 1px solid #84a13d;
    border-radius: 50%;
    color: #84a13d;
    text-align: center;
    display: block;
    line-height: 1.2;
    justify-content: center;
    align-items: center;
}
.topic-minus {
  width: 22px;
    height: 22px;
    border: 1px solid #84a13d;
    border-radius: 50%;
    color: #84a13d;
    text-align: center;
    display: block;
    line-height: 1.2;
    justify-content: center;
    align-items: center;
}
.img-attachment .required-upload-attachment .upload-field{
  min-height: 0;
  height: 60px;
}
:deep(.img-attachment .required-upload-attachment .upload-field .icon-upload-attachment .mdi-paperclip){
  min-height: 50px !important;
    min-width: 70px !important; 
    left: 33% !important;
    top: 12% !important;
}
:deep(.img-attachment .required-upload-attachment-full .upload-field .icon-upload-attachment .mdi-paperclip){

  min-height: 61px !important;
    min-width: 78px !important;
    left: 46% !important;
    top: 12% !important;
}
:deep(.img-attachment .required-upload-attachment .v-messages__message){
  padding-top: 5px !important;
}
.topic-items{
  background-color: #fff;
  box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%);
  border-radius: 5px;
  padding: 16px 24px;
}
.topic-title{
  font-size: 16px;
  color: #666768;
}
.section-connect-to{
  border-color: #e0e0e0;
}
:deep(.v-expansion-panel .topic-minus){
  display: none;
}
:deep(.v-expansion-panel.v-expansion-panel--active.v-item--active .topic-plus){
  display: none;
}
:deep(.v-expansion-panel.v-expansion-panel--active.v-item--active .topic-minus){
  display: block;
}
.cust-validation{
  border:1px solid #ff5252;
}
</style>
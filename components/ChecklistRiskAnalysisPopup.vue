<template>
  <div>
    <v-dialog v-model="openPopup" max-width="1125px" max-height="80%" persistent>
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
              <b-col cols="7">
                <div class="input-wrap">
                  <v-text-field v-model="editedItem.name" :label="$t('form.name')" :rules="required"
                  :item="editedItem.name" outlined/>
                </div>
              </b-col>
              <b-col class="d-flex justify-content-end mr-2" >
                <div class="bold-title md-line-height">
                  {{ $t('form.process') }}
                </div>
                <div class="input-wrap" >
                  <div class="switch-component document-type-wrap default-question-mark">
                    <label class="left-text">{{ $t('form.none') }}</label>
                    <v-switch
                      v-model="checkListAsTask"
                      :label="$t('form.activate')"
                      class="right-text ml-7"
                      inset
                      :readonly="!editedItem.editPermission && editedItem.added_by !== userLogged"
                    />
                  </div>
                </div>
              </b-col>
            </b-row>
            <category
              :category-item="riskAnalysisItem"
              :categories-array="categoriesValidArray"
              :type-category="'checklist'"
              :is-open-popup="openPopup"
              @getNewCategory="getNewCategory"
              class="col-11 p-0"
            />
            <!-- <category
                :object-item="riskAnalysisItem"
                :type-category="'checklist'"
                @getNewCategory="getNewCategory"
                class="col-11 p-0"
              /> -->
            <!-- <b-row>
              <b-col cols="6">
                <v-select
                  v-if="editMode"
                  v-model="editedItem.responsible"
                  label="Responsible "
                  :items="responsibleArray"
                  item-text="name"
                  item-value="id"
                  :rules="required"
                  outlined
                  :readonly="editMode && editedItem.status > 1"
                />
              </b-col>
            </b-row> -->
            <!-- <add-sourceof-danger-table :source_title="true" :riskElementAnalysis="riskElementAnalysis" :headersRiskElementArr="headersRiskElementArr" :editAsResponsible="checkListAsTask" :dataFillable="true"/> -->

            <add-new-source-of-danger
              :object-item="editedItem"
              :edit-mode="false"
              :is-process-activate="checkListAsTask"
              @updateSourceOfDanger="updateSourceOfDanger"
            />
            

             <v-data-table v-for="item in riskSelectedTopic" :key="item.id"
          :headers="headers"
          :items="riskSelectedTopic"
          :items-per-page="5"
          :single-expand="true"
              :sort-by="['created_at']"
              :sort-desc="[true, false]"
          class="elevation-1 review-table review-popup-table px-1 border mt-4"
          hide-default-footer
        >
          <template slot="top">
            <v-toolbar flat class="align-center">
              <v-toolbar-title>
                {{item.topic_name }}
              </v-toolbar-title>
            </v-toolbar>
          </template>
          <template v-slot:item.checkName="{ item }">
            {{item.name}}
          </template>
          <template v-slot:item.comment="{ item,index }">
              <div>
                <img src="../assets/images/gridIcon/comment_fill_red.png" alt="" srcset="" v-if="item.description"> 
                <img src="../assets/images/gridIcon/comment.png" alt="" srcset="" v-else>
              </div>
          </template>
          <template v-slot:item.image="{ item, index }">
            <img
              src="../assets/images/icon/image-red.png"
              @click.stop
              v-if="item.file"
            />
            <img v-else
              src="../assets/images/icon/image-gray.png"
              @click.stop
              />
          </template>
          <template v-slot:item.options="{ item }">
            {{item.answer_name}}
          </template>
        </v-data-table>
            <Responsible v-if="checkListAsTask"
                         :object-item="editedItem"
                         :edit-mode="false"
                         :noRequiredAction="true"
                         class="mt-12"
            />

            <Security
              :security-item="editedItem"
              :edit-mode="editMode"
              @changeSecurity="changeSecurity"
              :isInstructionObject="true"
              class="mt-7"
            />

          </v-form>
        </v-card-text>
        <v-card-actions class="popup-footer">
          <v-spacer />
          <v-btn class="btn-cancel" text @click="close">
            {{ $t('button.cancel') }}
          </v-btn>
          <!-- New -->
          <v-btn
            class="btn-save"
            @click="save()"
            :disabled="!!planAccess?.lastPlanAccess?.checklist">
            {{ $t('button.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import {_} from 'vue-underscore';
  import cookies from 'js-cookie';
  import Security from "./Security";
  import Category from "./Category";
  // import AddSourceofDangerTable from './AddSourceofDangerTable.vue';
  // import AddTable from './AddTable.vue';
  import Responsible from './Responsible.vue';
import AddNewSourceOfDanger from './AddNewSourceOfDanger.vue';

  export default {
    name: "ChecklistRiskAnalysisPopup",
    components: {
      Security,
      category: Category,
      // AddSourceofDangerTable,
      // AddTable,
      Responsible,
        AddNewSourceOfDanger,
    },
    props: {
      currentRiskId: {
        type: [String,Number],
        required: false,
      },
      riskAnalysisItem: {
        type: Object,
        required: false,
      },
      categoriesArray: {
        type: Array,
        required: false,
      },
      openPopup: Boolean,
      viewModeInput: {
        type: Boolean,
        required: false,
      },
      taskAssigneesArray: {
        type: Array,
        required: false,
      },
      responsibleArray: {
        type: Array,
        required: false,
      },
    riskSelectedTopic:{
      type: Array,
      required: false,
    },
    answerArray: {
      type: Array,
      required: false,
    },
    },
    data: () => ({
      userRoleId: parseInt(cookies.get('roleID')),
      userDepartmentID: parseInt(cookies.get('userDepartmentID')),
      pageKey: 'reports-report-riskanalysis-risk-analysis',
      permissionsUser: localStorage.getItem('permissionsKey'),
      planAccess: JSON.parse(localStorage.getItem('planAccess')),
      checkAdmin: cookies.get('checkAdmin'),
      roleUser: cookies.get('roleUser'),
      userID: parseInt(cookies.get('userID')),
      nowDate: new Date().toISOString().substr(0, 10),
      search: '',
      valid: true,
      validAction: true,
      checkListAsTask: false,
      hover: false,
      listArray: [],
      objectField: [
        'name',
        'description',
        'category',
        'responsible',
        'attendee',
        'start-date',
        'deadline',
        'security'
      ],
      questionID:'',
      editedItem: {
        type:'',
        checklist_id:'',
        company_id:'',
        category_id:'',
        added_by:'',
        report_id:'',
        question_id:'',
        name: '',
        status: 1,
        department_id: '',
        need_to_process: false,
        is_task: false,
        editPermission: true,
        is_suggestion: false,
        // table Security
        object_type: 'risk-analysis',
        is_shared: false,
        is_public: false,
        isDefaultResponsible: false,
        source_of_danger:[{
          name: '',
        type: 'Report',
        probability: '',
        consequence: '',
        colorCode: '',
        comment: '',
        need_to_process:false
        }],
      responsible_department_array: [],
      responsible_employee_array: [],
      isDefaultAttendee: false,
      attendee_department_array: [],
      attendee_employee_array: [],
        risk_element_array:[],
        responsible_required_comment: false,
      responsible_required_attachment: false,
      attendee_required_comment: false,
      attendee_required_attachment: false,
      attendee_all: false,
      department_array: [],
        employee_array: [],
        source: "report",
      },
      defaultItem: {
        type:'',
        checklist_id:'',
        company_id:'',
        category_id:'',
        added_by:'',
        report_id:'',
        question_id:'',
        name: '',
        status: 1,
        department_id: '',
        need_to_process: false,
        is_task: false,
        editPermission: true,
        is_suggestion: false,
        // table Security
        object_type: 'risk-analysis',
        is_shared: false,
        is_public: false,
        isDefaultResponsible: false,
        source_of_danger:[{
          name: '',
        type: 'Report',
        probability: '',
        consequence: '',
        colorCode: '',
        comment: '',
        need_to_process:false
        }],
      responsible_department_array: [],
      responsible_employee_array: [],
      isDefaultAttendee: false,
        risk_element_array:[],
        responsible_required_comment: false,
      responsible_required_attachment: false,
      department_array: [],
        employee_array: [],
        source: "report",
      },
      required: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else return true;
        }
      ],
      tabIndex: 0,
      riskElementSourceArray: [],
      riskElementAnalysis: [{
        name: '',
        type: 'Report',
        probability: '',
        consequence: '',
        colorCode: '',
        comment: '',
        need_to_process:false
      }],
      checkNewRiskElement: false,
      checkAddPlan: false,
      menu: false,
      checkPermission: '',
      department: 0,
      job_title: 0,
      newTask: {
        id: '',
        name: '',
        status: 1,
        taskAssignees: [],
        taskAssigneesArray: [],
        responsiblePerson: [],
        deadline: '',
        modal_deadline: false,
      },
      defaultTask: {
        id: '',
        name: '',
        status: 1,
        taskAssignees: [],
        taskAssigneesArray: [],
        responsiblePerson: [],
        deadline: '',
        modal_deadline: false,
      },
      taskArray: [],
      formTitle: '',
      editMode: true,
      taskDetailArray: [],

      // reopen deviation
      isReopen: false,

      viewMode: false,
      checkResponsiblePerson: false,
      deadline: '',
      start_time: '',
      riskAnalysisTaskAssigneesArray: [],
      hoverQuestionMark: false,
      // popup
      dialogDelete: false,
      dialogChangeResponsible: false,
      dialogNotAllowToSave: false,
      categoriesValidArray: [],
      category_routine: 'checklist',
      isRemove: false,
    }),

    computed: {
      headers() {
        return [
          {
            text: 'Name',
            align: 'start',
            sortable: false,
            value: 'name',
            width: '25%'
          },
          {text: 'Result', value: 'options', align: 'center', width: '25%'},
          {text: 'Comment', value: 'comment', align: 'center', width: '30%'},
          {text: 'Image', value: 'image', align: 'center'},
        ];
      },
      headersRiskElementArr() {
        return [
          { text: this.translateCol('name'), value: 'name', align: 'center', width: '18%'},
          { text: this.translateCol('type'), value: 'type', align: 'center', width: '16%'},
          { text: this.translateCol('probability'), value: 'probability', align: 'center', width: '12%'},
          { text: this.translateCol('consequence'), value: 'consequence', align: 'center', width: '12%'},
          { text: this.translateCol('color_code'), value: 'colorCode', align: 'center', width: '10%'},
          { text: this.translateCol('comment'), value: 'comment', align: 'center', width: '20%'},
          { text: this.translateCol('actions'), value: 'actions', align: 'center', width: '16%', sortable: false },
        ]
      },
    },

    watch: {
      openPopup(value) {
        if (value) {
          // let that = this;
          this.$nuxt.$loading.start();
      // //Get risk element list
      // this.$store.dispatch('riskElementSource/index').then(result => {
      //   // this.riskElementSourceArray = result.data;
      //   this.riskElementSourceArray = _.filter(result.data, function (item) {
      //     return !item.is_template;
      //   });
      // }).catch(() => {
      //   this.$toaster.error(this.$i18n.t('message.fail_risk_element_view'));
      //   // this.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
      // });
      //   this.$nuxt.$loading.finish();
          this.viewMode = this.viewModeInput;
          this.editedItem.source_of_danger[0].name=this.riskSelectedTopic[0].name
          this.editedItem.name=this.riskAnalysisItem.name
          if (this.riskAnalysisItem) {
            this.checkResponsiblePerson = this.riskAnalysisItem.responsible === this.userID;
            this.editItem(this.riskAnalysisItem);
          } else {
            this.addNew();
          }
          if (this.riskAnalysisItem) {
            let categoryId = this.riskAnalysisItem.category_id;
            this.categoriesValidArray = _.filter(this.categoriesArray, function (item) {
              return (!item.disable_status || (item.disable_status && item.id === categoryId));
            });
            this.editItem(this.riskAnalysisItem);
          } else {
            this.categoriesValidArray = _.filter(this.categoriesArray, function (item) {
              return !item.disable_status;
            });
            this.addNew();
            this.$nuxt.$loading.finish();
          }
          this.$nuxt.$loading.finish();
        }
      },
    },

    // mounted() {
    //   let that = this;
    //   //Get risk element list
    //   that.$store.dispatch('riskElementSource/index').then(result => {
    //     // that.riskElementSourceArray = result.data;
    //     that.riskElementSourceArray = _.filter(result.data, function (item) {
    //       return !item.is_template;
    //     });
    //   }).catch(() => {
    //     that.$toaster.error(that.$i18n.t('message.fail_risk_element_view'));
    //     // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
    //     that.$nuxt.$loading.finish();
    //   });

    //   // // list all managers = responsible person
    //   // that.$store.dispatch('employees/index').then(result => {
    //   //   // that.responsibleArray = _.filter(result.data, function (item) {
    //   //   //   return item.role_id === 2 || item.role_id === 3;
    //   //   // });
    //   //   that.taskAssigneesArray = result.data;
    //   //   that.responsibleArray = _.clone(result.data);
    //   //   that.responsibleArray = _.filter(that.responsibleArray, function (item) {
    //   //     return item.role_id === 3 || item.role_id === 2;
    //   //   });
    //   // }).catch((error) => {
    //   //   that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
    //   //   that.$nuxt.$loading.finish();
    //   // });
    // },

    created() {
      if (this.openPopup) {
        if (this.riskAnalysisItem) {
          this.editItem(this.riskAnalysisItem);
        } else {
          this.addNew();
        }
      }
    },

    methods: {
      translateCol(colName) {
          return this.$i18n.t('column.' + colName);
        },
      AddTask() {
        this.editedItem.is_task = false
      },
      changeSecurity(val) {
        if (val !== 'all') {
          this.editedItem.is_suggestion = false;
        }
      },

      updateResponsible() {
        let that = this;
        that.$nuxt.$loading.start();
        that.editedItem.updateResponsible = true;
        that.$store.dispatch('riskAnalysis/update', that.editedItem).then(function () {
          that.reloadList();
          that.$toaster.success(that.$i18n.t('message.success_risk_analysis_update'));
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_risk_analysis_update'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
        that.close();
      },

      getDeadline(value) {
        this.deadline = value.date;
        this.editedItem.deadline_pre = this.deadline;
      },

      getStartDate(value) {
        this.start_time = value.date;
        this.editedItem.start_time_pre = this.start_time;
      },

      getTaskArray(value) {
        this.taskDetailArray = value.taskArray;
      },

      addNew() {
        this.reset();
        let defaultCategory = _.findWhere(this.categoriesValidArray, {is_primary: 1});
        if (defaultCategory) {
          this.editedItem.category_id = defaultCategory.id;
        }
        this.formTitle = this.$i18n.t('title.add_risk_analysis_checkpoint');
        this.editMode = false;
        // this.riskElementAnalysis = [];
      },

      async editItem() {
        let that = this;
        that.$nuxt.$loading.start();
        // that.editedItem.source_of_danger[0].name=that.riskSelectedTopic[0].name
        that.editedItem?.source_of_danger?.map((item) => {
          // console.log("item--------",item);
          item.colorCode = "",
          item.comment= "",
          item.consequence="",
          item.need_to_process="",
          item.probability="",
          item.risk_level="",
          item.name=that.riskSelectedTopic[0].name

        })
        // that.editedItem.source_of_danger[0].probability=''
        // that.editedItem.source_of_danger[0].consequence=''
        // that.editedItem.source_of_danger[0].risk_level=''
        // that.editedItem.source_of_danger[0].comment=''
        that.formTitle = that.$i18n.t('title.report_risk_analysis');
        this.editMode = true;
      },


      close() {
        this.reset();
        this.$emit('closePopup',this.currentRiskId);
      },

      reset() {
        // this.denyEdit = false;
        // this.isClosed = false;
        // this.$nuxt.$loading.finish();
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          // this.$refs.form.reset();
          this.$refs.form.resetValidation();
          // this.filterEmployees();
        }, 300);
      },

      updateSourceOfDanger(val) {
        // this.item.source_of_danger = val.list;
        this.editedItem.source_of_danger = val.list;
      },

      save() {
        let that = this;
        that.isReopen = false;
        that.$nuxt.$loading.start();
        // create
            if (!that.editedItem.need_to_process) {
              that.editedItem.need_to_process = 0;
            } else {
              that.editedItem.need_to_process = 1;
            }
            that.questionID=that.riskSelectedTopic[0].id
            that.riskElementAnalysis.need_to_process=that.editedItem.need_to_process
            // that.editedItem.source_of_danger = that.riskElementAnalysis;
            // that.editedItem.name = that.riskAnalysisItem.name
            that.editedItem.action = 'risk'
            that.editedItem.type = 'risk-analysis'
            that.editedItem.question= that.questionID
            that.editedItem.checklist = that.riskAnalysisItem.checklist_id;
            that.editedItem.description = that.riskAnalysisItem.checklist_description;
            that.editedItem.checklist_id = that.riskAnalysisItem.checklist_id;
            that.editedItem.report_id = that.riskAnalysisItem.id;
            that.editedItem.company_id = that.riskAnalysisItem.company_id;
            that.editedItem.added_by = that.userID;
            that.editedItem.topics = that.riskSelectedTopic?.[0];
            that.editedItem.category_id = that.riskAnalysisItem.category_id;
            that.editedItem.isDefaultResponsible=false
            that.editedItem.isDefaultAttendee=false
            that.editedItem.responsible_id=that.riskAnalysisItem.responsible
            that.editedItem.responsible=that.riskAnalysisItem.responsible
              that.$store.dispatch('objects/store', that.editedItem).then(function () {
              that.reloadList();
              that.$toaster.success(that.$i18n.t('message.success_risk_analysis_add_new'));
              that.$nuxt.$loading.finish();
            }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_risk_analysis_add_new'));
          }
              // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
              that.$nuxt.$loading.finish();
            });
            that.editedItem = that.defaultItem
            that.editedItem.source_of_danger = that.riskElementAnalysis
              that.$nuxt.$loading.finish();
        // that.close();
        that.$emit('saveRisk' ,that.currentRiskId);
      },

      reOpenReport() {
        if (this.$refs.form.validate()) {
          this.isReopen = true;
          this.editedItem.action = null;
          // this.editedItem.is_action_done = false;
          this.editedItem.responsible_id = '';
          // this.editedItem.deadline = '';
          this.editedItem.reopen = 1;
          this.taskArray = [];
          // this.$store.dispatch('riskAnalysis/update', this.editedItem).then(function () {
          //   this.$nuxt.$loading.start();
          //   this.reloadList();
          // }).catch(error => {
          //   this.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          //   this.$nuxt.$loading.finish();
          // });
        }
      },

      closeReport() {
        let that = this;
        that.isReopen = false;
        if (that.$refs.form.validate()) {
          that.$nuxt.$loading.start();
          that.editedItem.status = 1;
          that.$store.dispatch('objects/update', this.editedItem).then(function () {
            that.reloadList();
            that.$toaster.success(that.$i18n.t('message.success_risk_analysis_update'));
          }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_risk_analysis_update'));
          }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish();
          });
          that.close();
        }
      },

      reloadList() {
        this.$emit('reloadList');
      },

      // checkDenyEdit() {
      //   if (this.editedItem.status === this.statusClosed) {
      //     this.denyEdit = true;
      //     this.isClosed = true;
      //   } else {
      //     this.denyEdit = !(this.editedItem.status === this.statusNew || (this.denyEdit && this.editedItem.requestEdit));
      //   }
      // },

      // dialog DELETE
      closeDelete() {
        this.dialogDelete = false;
      },

      deleteItem(item) {
        let index = this.listArray.findIndex(i => i.id === item.id);
        this.listArray.splice(index, 1);
        this.deleteRiskAnalysis(item);
        this.dialogDelete = false;
      },

      deleteRiskAnalysis(item) {
        this.$store.dispatch('objects/delete', item.id).then(function () {
          this.reloadList();
          this.$toaster.success(this.$i18n.t('message.success_risk_analysis_delete'));
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          this.$toaster.error(this.$i18n.t('message.fail_risk_analysis_delete'));
          }
          // this.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          this.$nuxt.$loading.finish();
        });
      },

      showItem(item) {
        let that = this
        that.$emit('showItem', item);
      },

      formatStatus(status) {
        if (status === 1) {
          return "New";
        } else if (status === 2) {
          return "Ongoing";
        } else if (status === 3) {
          return "Closed";
        }
      },

      getSourceOfDangerArray(value) {
        this.riskElementAnalysis = value.riskElementAnalysis;
      },
      // getSelectedAssigneeItems(value) {
      //   this.newTask.taskAssignees = value.selectedItemsOutput;
      // },
      getNewCategory(value) {
        this.editedItem.category_id = value.newCategoryId;
      },

      changeTaskAssignee(item) {
        let that = this;
        item.taskAssigneesArray = _.filter(that.taskAssigneesArray, function (user) {
          return _.indexOf(item.taskAssignees, user.id) !== -1;
        });
        // if (item.taskAssignees.length < that.taskAssigneesArray.length) {
        //   item.responsiblePerson = item.taskAssignees;
        // }
      },
    },
  };
</script>

<style scoped>

</style>

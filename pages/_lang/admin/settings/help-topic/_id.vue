<template>
  <div class="resources-page">
    <v-btn class="mb-2 btn-create btn-custom-green" @click="addNew">
      {{ $t('button.add_new') }}
    </v-btn>

    <b-tabs v-model="tabIndex" card lazy>
      <keep-alive>
        <b-tab :title="$t('tab.q&a')" active>
          <v-container>
            <v-data-table
              :headers="headers"
              :items="filteredItems"
              class="elevation-1 hse-table"
              :items-per-page="15"
              :single-expand="true"
              :search="search"
              :sort-by="['created_at']"
              :sort-desc="[true, false]"
              @click:row="editItem"
            >
              <template v-slot:top>
                <div class="setting-header">
                  <div class="panel-heading">
                    <h4 class="panel-title">
                      {{ $t('title.sort_by') }}
                    </h4>
                    <b-row>
                      <b-col cols="12">
                        <div class="input-wrap field-search">
                          <v-text-field
                            v-model="search"
                            append-icon="search"
                            :label="$t('setting.search')"
                            outlined
                          >
                    <template v-slot:append>
                      <img src="@/assets/images/icon/magnifier.png" class="search-icon-cust">
                    </template>
                  </v-text-field> 
                        </div>
                      </b-col>
                    </b-row>
                  </div>
                  <div class="panel-footer text-right">
                    <!--<a type="button" class="btn btn-default" @click="addNewGoal"> New goal</a>-->
                  </div>
                </div>
              </template>

              <template v-slot:header="{ props: { headers } }">
                <h4 class="table-name">
                  <span>Q&A</span>
                </h4>
              </template>

              <template v-slot:no-data>
                {{ $t('table.no_data') }}
              </template>
            </v-data-table>
          </v-container>
        </b-tab>
      </keep-alive>
    </b-tabs>

    <v-dialog v-model="dialog" max-width="1000px" persistent>
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
              <b-col>
                <div class="input-wrap">
                  <v-text-field v-model="topic_name" :label="$t('form.topic')" readonly outlined />
                </div>
              </b-col>
            </b-row>
            <b-row v-if="editedIndex > -1">
              <b-col cols="6">
                <div class="input-wrap">
                  <v-text-field v-model="editedItem.question" :label="$t('form.question')" :rules="required"  outlined />
                </div>
              </b-col>
              <b-col cols="6">
                <div class="input-wrap">
                  <v-text-field v-model="editedItem.answer" :label="$t('form.answer')" :rules="required"  outlined />
                </div>
              </b-col>
            </b-row>
            <b-row class="mt-0">
              <b-col>
                <v-checkbox
                  v-model="editedItem.only_company_admin"
                  :label="$t('form.only_show_for_admin')"
                  class="mt-0"
                />
              </b-col>
            </b-row>
            <b-row v-if="editedIndex === -1">
              <b-col v-for="(item, index) in questionArray" :key="index" cols="12" class="mb-5 mt-5">
                <div class="section-connect-to section-connect-to-checklist-topic">
                  <div class="section-connect-to-label section-connect-to-label-checklist add-new-section display-inline-flex">
                    <v-text-field v-model="item.question" :label="$t('form.question')" :rules="required" outlined />
                    <v-icon
                      class="ml-5 icon-checklist-topic-delete"
                      @click="deleteQuestionItem(item)"
                    >
                      delete
                    </v-icon>
                  </div>
                  <div class="padding-15-checklist">
                    <b-row>
                      <b-col cols="12">
                        <div class="input-wrap">
                          <v-text-field v-model="item.answer" :label="$t('form.answer')" :rules="required" outlined />
                        </div>
                      </b-col>
                    </b-row>
                  </div>
                </div>
              </b-col>
            </b-row>
            <b-row v-if="editedIndex === -1">
              <b-col cols="3">
                <v-btn class="btn-create-task" @click="addQuestion">
                  {{ $t('button.add_more') }}
                </v-btn>
              </b-col>
              <b-col v-if="isAddNewQuestion" cols="9" class="mt-2">
                <div class="connect-department">
                  <div class="department d-flex">
                    <v-text-field
                      v-model="questionData.question"
                      :rules="required"
                      outlined
                    />
                    <span class="department-button">
                      <v-btn class="mb-2 btn-add-department" @click="addMoreQuestion">
                        {{ $t('button.add') }}
                      </v-btn>
                      <v-btn class="mt-1 mb-2 btn-cancel-department" @click="cancelQuestionName">
                        {{ $t('button.cancel') }}
                      </v-btn>
                    </span>
                  </div>
                </div>
              </b-col>
            </b-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="popup-footer">
          <v-spacer />
          <v-btn class="btn-cancel" text @click="close">
            {{ $t('button.cancel') }}
          </v-btn>
          <v-btn class="btn-save" @click="save">
            {{ $t('button.save') }}
          </v-btn>
          <v-btn v-if="editedIndex > -1" class="hse-btn-delete" text @click="dialogDelete = true">
            <v-icon dark>
              mdi-delete
            </v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogTitle" max-width="1000px" persistent>
      <v-card>
        <v-card-text>
          <div class="popup-header text-center">
            {{ formTopicTitle }}
          </div>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <b-row>
              <b-col cols="12">
                <div class="input-wrap">
                  <v-text-field v-model="topic_name" :label="$t('form.topic')" readonly outlined />
                </div>
              </b-col>
              <b-col cols="12">
                <div class="input-wrap">
                  <v-text-field v-model="editedTitleItem.name" :label="$t('form.name')" :rules="required" outlined />
                </div>
              </b-col>
            </b-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="popup-footer">
          <v-spacer />
          <v-btn class="btn-cancel" text @click="close">
            {{ $t('button.cancel') }}
          </v-btn>
          <v-btn class="btn-save" @click="save">
            {{ $t('button.save') }}
          </v-btn>
          <v-btn v-if="editedTitleIndex > -1" class="hse-btn-delete" text @click="dialogDelete = true">
            <v-icon dark>
              mdi-delete
            </v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
            {{ $t('button.cancel') }}
          </v-btn>
          <v-btn class="btn-save" @click="deleteItem(editedItem)">
            {{ $t('button.delete') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  // import {_} from 'vue-underscore';

  export default {
    data: () => ({
      tabIndex: 0,
      search: '',
      searchTitle: '',
      dialog: false,
      dialogTitle: false,
      dialogDelete: false,
      valid: true,
      required: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else return true;
        }
      ],
      editedTitleIndex: -1,
      editedTitleItem: {
        topic_name: '',
        name: '',
      },
      defaultTitleItem: {
        topic_name: '',
        name: '',
      },
      editedIndex: -1,
      editedItem: {
        topic_id: '',
        title_id: '',
        question: '',
        answer: '',
        only_company_admin: false,
        questionArray: '',
      },
      defaultItem: {
        topic_id: '',
        title_id: '',
        question: '',
        answer: '',
        only_company_admin: false,
        questionArray: '',
      },
      listArray: [],
      titleArray: [],
      questionArray: [],
      topic_id: '',
      topic_name: '',
      isAddNewQuestion: false,
      questionData: {
        question: '',
        answer: '',
      },
      questionDataDefault: {
        question: '',
        answer: '',
      },
    }),

    computed: {
      headers() {
        return [
          {text: this.translateCol('question'), value: 'question', align: 'left'},
          {text: this.translateCol('answer'), value: 'answer', align: 'left'},
        ];
      },

      filteredItems() {
        let that = this;
        return that.listArray;
      },

      formTitle() {
        return this.editedIndex === -1 ? 'New Q&A' : 'Edit Q&A';
      },
    },

    watch: {},

    created() {},

    mounted() {
      let that = this;
      that.$nextTick(() => {
        that.$nuxt.$loading.start();
        that.topic_id = parseInt(that.$route.params.id);
        //Get helping list - type Title
        that.$store.dispatch('help/show', that.topic_id).then(result => {
          that.topic_name = result.data.name;
        }).catch(() => {
          // that.$toaster.error(that.$i18n.t('message.fail_help_center_view_detail'));
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });

        that.$store.dispatch('help/index', {isHelpSetting: 1, getByType: 'title', getByParentId: that.topic_id}).then(result => {
          that.titleArray = result.data;
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_help_center_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });

        that.$store.dispatch('helpQuestion/index', {isHelpSetting: 1, getByType: 'topic', $getByTypeId: that.topic_id}).then(result => {
          that.listArray = result.data;
          that.$nuxt.$loading.finish();
        }).catch(() => {
          // that.$toaster.error(that.$i18n.t('message.failed'));
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      });
    },

    methods: {
      translateCol (colName) {
        return this.$i18n.t('column.' + colName);
      },

      addNew() {
        this.reset();
        if (this.tabIndex === 0) { // Q&A
          this.dialog = true;
          this.dialogTitle = false;
        } else {
          this.dialog = false;
          this.dialogTitle = true;
        }
      },

      editItem(item) {
        let that = this;
        that.$nuxt.$loading.start();
        that.editedItem = Object.assign({}, item);
        that.editedIndex = that.listArray.indexOf(item);that.$nuxt.$loading.finish();
        that.dialog = true;
        that.$nuxt.$loading.finish();
      },

      close() {
        this.reset();
        this.dialog = false;
        this.dialogTitle = false;
      },

      reset() {
        this.questionArray = [];
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
          // this.$refs.form.reset();
          this.$refs.form.resetValidation();
        }, 0);
      },

      // dialog DELETE
      closeDelete() {
        this.dialogDelete = false;
      },

      deleteItem(item) {
        this.deleteQuestion(item);
        this.dialogDelete = false;
        this.close();
      },

      deleteQuestion(item) {
        let that = this;
        that.$store.dispatch('helpQuestion/delete', item.id).then(function () {
          that.reloadList();
          that.$toaster.success(that.$i18n.t('message.success_help_center_delete'));
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_help_center_delete'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      },

      save() {
        let that = this;
        if (that.$refs.form.validate()) {
          that.$nuxt.$loading.start();
          if (that.editedIndex > -1) {
            that.$store.dispatch('helpQuestion/update', that.editedItem).then(function () {
              that.reloadList();
              that.$toaster.success(that.$i18n.t('message.success_help_center_update'));
            }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_help_center_update'));
              }
              that.$nuxt.$loading.finish();
              // if (error.response && error.response.data) {
              //   that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
              // }
            });
          } else {
            that.editedItem.topic_id = that.topic_id;
            that.editedItem.questionArray = that.questionArray;
            that.$store.dispatch('helpQuestion/store', that.editedItem).then(function () {
              that.reloadList();
              that.$toaster.success(that.$i18n.t('message.success_help_center_add_new'));
            }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_help_center_add_new'));
              }
              that.$nuxt.$loading.finish();
              // if (error.response && error.response.data) {
              //   that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
              // }
            });
          }
          that.close();
        }
      },

      reloadList() {
        let that = this;
        // get list
        that.$store.dispatch('helpQuestion/index', {isHelpSetting: 1, getByType: 'topic', $getByTypeId: that.topic_id}).then(result => {
          that.listArray = result.data;
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_help_center_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      },

      addQuestion() {
        this.isAddNewQuestion = true;
        this.questionData.question = '';
      },

      addMoreQuestion() {
        if (this.questionArray.length > 0) {
          this.questionData.id = this.questionArray[this.questionArray.length - 1].id + 1;
        } else {
          this.questionData.id = 1;
        }
        this.questionArray.push(this.questionData);
        this.questionData = Object.assign({}, this.questionDataDefault);
        this.isAddNewQuestion = false;
      },

      cancelQuestionName() {
        this.isAddNewQuestion = false;
      },

      deleteQuestionItem(item) {
        this.questionArray.splice(this.questionArray.indexOf(item), 1);
      },
    }
  };
</script>

<style scoped>

</style>

<template>
  <div class="resources-page">
    <v-btn class="mb-2 btn-create btn-custom-green" @click="addNew">
      {{ $t('button.add_new') }}
    </v-btn>

    <b-tabs v-model="tabIndex" card lazy>
      <keep-alive>
        <b-tab :title="$t('tab.main_article')" active>
          <v-container>
            <v-data-table
              :headers="headers"
              :items="filteredItems"
              class="elevation-1 hse-table table-data"
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
                      <b-col cols="4">
                        <div class="field-selection">
                          <v-select
                            v-model="role"
                            :items="roleSelection"
                            :label="$t('setting.guide_for')"
                            outlined
                            class="text-box"
                          />
                        </div>
                      </b-col>
                      <b-col cols="4">
                        <div class="field-selection">
                          <v-select
                            v-model="menu"
                            :items="menuSelection"
                            :label="$t('setting.menu_function')"
                            outlined
                            class="text-box"
                          />
                        </div>
                      </b-col>
                      <b-col cols="4">
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
                  <span>{{ $t('table.main_article') }}</span>
                </h4>
              </template>

              <template v-slot:no-data>
                {{ $t('table.no_data') }}
              </template>
            </v-data-table>
          </v-container>
        </b-tab>
      </keep-alive>
      <keep-alive>
        <b-tab :title="$t('tab.topic')">
          <v-container>
            <v-data-table
              :headers="headersTopic"
              :items="filteredTopicItems"
              class="elevation-1 hse-table"
              :items-per-page="15"
              :single-expand="true"
              :search="searchTopic"
              :sort-by="['created_at']"
              :sort-desc="[true, false]"
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
                            v-model="searchTopic"
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
                  <span>{{ $t('table.topic') }}</span>
                </h4>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-icon
                  class="mr-2"
                  title="Edit"
                  @click="editItem(item)"
                >
                  mdi-pencil
                </v-icon>
                <v-icon
                  title="View detail"
                  @click="viewItem(item)"
                >
                  mdi-arrow-right-bold-circle
                </v-icon>
              </template>
              <template v-slot:no-data>
                {{ $t('table.no_data') }}
              </template>
            </v-data-table>
          </v-container>
        </b-tab>
      </keep-alive>
      <keep-alive>
        <b-tab :title="$t('tab.topic_pdf')">
          <v-container>
            <v-data-table
              :headers="headersAttachment"
              :items="filteredAttachmentItems"
              class="elevation-1 hse-table"
              :items-per-page="15"
              :single-expand="true"
              :search="searchAttachment"
              :sort-by="['created_at']"
              :sort-desc="[true, false]"
              @click:row="editAttachment"
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
                            v-model="searchAttachment"
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
                  <span>{{ $t('table.topic_pdf') }}</span>
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
              <b-col cols="6">
                <div class="input-wrap">
                  <v-select
                    v-model="editedItem.role"
                    :items="roleArray"
                    item-text="name"
                    item-value="id"
                    :label="$t('form.guide_for')"
                    :rules="required"
                    outlined
                  />
                </div>
              </b-col>
              <b-col cols="6">
                <div class="input-wrap">
                  <v-select
                    v-if="editedItem.role === 'Super admin'"
                    v-model="editedItem.menu_function"
                    :items="menuSuperAdminArray"
                    item-text="name"
                    item-value="id"
                    :label="$t('form.menu_function')"
                    :rules="required"
                    outlined
                  />
                  <v-select
                    v-if="editedItem.role === 'Manager'"
                    v-model="editedItem.menu_function"
                    :items="menuArray"
                    item-text="name"
                    item-value="id"
                    :label="$t('form.menu_function')"
                    :rules="required"
                    outlined
                  />
                  <v-select
                    v-if="editedItem.role === 'User'"
                    v-model="editedItem.menu_function"
                    :items="menuUserArray"
                    item-text="name"
                    item-value="id"
                    :label="$t('form.menu_function')"
                    :rules="required"
                    outlined
                  />
                </div>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="12">
                <div class="input-wrap">
                  <v-text-field v-model="editedItem.name" :label="$t('form.name')" :rules="required" outlined />
                </div>
              </b-col>
            </b-row>
            <b-row v-if="editedItem.role !== '' && editedItem.role === 'Manager'" class="mt-0">
              <b-col cols="12">
                <v-checkbox
                  v-model="editedItem.only_company_admin"
                  :label="$t('form.only_show_for_admin')"
                  class="mt-0"
                />
              </b-col>
            </b-row>
            <b-row class="section-description">
              <b-col cols="12">
                <froala
                  id="link-editor"
                  v-model="editedItem.description"
                  :tag="'textarea'"
                />
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

    <v-dialog v-model="dialogTopic" max-width="1000px" persistent>
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
                  <v-select
                    v-model="editedItem.parent_id"
                    :items="listMainArticleArray"
                    item-text="name"
                    item-value="id"
                    :label="$t('form.main_article')"
                    :rules="required"
                    outlined
                    @change="checkMainArticle(editedItem.parent_id)"
                  />
                </div>
              </b-col>
              <b-col v-if="editedIndex > -1" cols="12">
                <div class="input-wrap">
                  <v-text-field v-model="editedItem.name" :label="$t('form.name')" :rules="required" outlined />
                </div>
              </b-col>
            </b-row>
            <b-row class="mt-0">
              <b-col>
                <v-checkbox
                  v-model="editedItem.only_company_admin"
                  :label="$t('form.only_show_for_admin')"
                  :disabled="disableCheckbox"
                  class="mt-0"
                />
              </b-col>
            </b-row>
            <div v-if="editedIndex === -1" class="manage-task mb-5">
              <b-row>
                <b-col v-for="(item, index) in topicArray" :key="index" cols="12" class="mb-5 mt-5">
                  <div class="section-connect-to section-connect-to-help-topic border-0 mb-5">
                    <div class="section-connect-to-label section-connect-to-label-checklist add-new-section-connect-to-help-topic display-inline-flex">
                      <v-text-field
                        v-model="item.name"
                        :label="$t('form.title')"
                        :rules="required"
                        outlined
                      />
                      <v-icon class="ml-5 icon-checklist-topic-delete" @click="deleteTopicFromList(item)">
                        delete
                      </v-icon>
                    </div>
                  </div>
                </b-col>
              </b-row>
              <b-row>
                <b-col cols="3">
                  <v-btn class="btn-create-task" @click="addMoreTopic">
                    {{ $t('button.add_topic') }}
                  </v-btn>
                </b-col>
                <b-col v-if="isShowInputTopic" cols="9" class="mt-2">
                  <div class="connect-department">
                    <div class="department d-flex">
                      <v-text-field
                        v-model="newTopic.name"
                        :rules="required"
                        outlined
                      />
                      <span class="department-button">
                        <v-btn class="mb-2 btn-add-department" @click="addNewTopicName">
                          {{ $t('button.add') }}
                        </v-btn>
                        <v-btn class="mt-1 mb-2 btn-cancel-department" @click="cancelNewTopicName">
                          {{ $t('button.cancel') }}
                        </v-btn>
                      </span>
                    </div>
                  </div>
                </b-col>
              </b-row>
            </div>
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

    <v-dialog v-model="dialogPDF" max-width="700px" persistent>
      <v-card>
        <v-card-text>
          <div class="popup-header text-center">
            {{ formPDFTitle }}
          </div>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <b-row>
              <b-col cols="12">
                <div class="input-wrap">
                  <v-select
                    v-model="editedAttachment.topic_id"
                    :items="listTopicArray"
                    item-text="name"
                    item-value="id"
                    :label="$t('form.choose_topic')"
                    :rules="required"
                    outlined
                  />
<!--                  <MultipleSelection-->
<!--                    :selected-items-input="editedAttachment.topic_id"-->
<!--                    :label="$t('form.choose_topic')"-->
<!--                    :item-text="'name'"-->
<!--                    :item-value="'id'"-->
<!--                    :list-option-input="listTopicArray"-->
<!--                    :request-required="true"-->
<!--                    @getSelectedItems="getSelectedTopicItems"-->
<!--                  />-->
                </div>
              </b-col>
              <b-col cols="12">
                <div class="input-wrap">
                  <v-text-field v-model="editedAttachment.name" :label="$t('form.file_name')" :rules="required" outlined />
                </div>
              </b-col>
            </b-row>
            <b-row align-h="center" class="upload-document pb-4">
              <b-col cols="12">
                <div class="section-connect-to section-upload-document section-upload-document-topic-pdf">
                  <div class="section-connect-to-label">{{ $t('title.upload_pdf') }}</div>
                  <div class="mt-5 input-wrap">
                    <v-file-input
                      v-if="editedAttachmentIndex > -1 && editedAttachment.uri"
                      v-model="selectedFile"
                      accept=".pdf"
                      :placeholder="editedAttachment.original_file_name"
                    />
                    <v-file-input
                      v-else
                      v-model="selectedFile"
                      accept=".pdf"
                      :rules="required"
                    />
                  </div>
                  <div v-if="editedAttachmentIndex > -1 && editedAttachment.uri" class="download-item mt-3">
                    You can download file
                    <span @click="getFile(editedAttachment)">here</span>
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
          <v-btn class="btn-save" @click="saveAttachment">
            {{ $t('button.save') }}
          </v-btn>
          <v-btn v-if="editedAttachmentIndex > -1" class="hse-btn-delete" text @click="dialogDelete = true">
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
  import {_} from 'vue-underscore';
  // import MultipleSelection from "../../../../components/MultipleSelection";
  import {downloadFile} from "../../../../utils/downloadFile";

  export default {
    components: {
      // MultipleSelection,
    },
    data: () => ({
      tabIndex: 0,
      search: '',
      searchTopic: '',
      searchAttachment: '',
      dialog: false,
      dialogTopic: false,
      dialogPDF: false,
      dialogDelete: false,
      valid: true,
      required: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else return true;
        }
      ],
      editedIndex: -1,
      editedItem: {
        name: '',
        role: '',
        description: '',
        type: '',
        parent_id: '',
        menu_function: '',
        only_company_admin: false,
        topicArray: '',
      },
      defaultItem: {
        name: '',
        role: '',
        description: '',
        type: '',
        parent_id: '',
        menu_function: '',
        only_company_admin: false,
        topicArray: '',
      },
      listArray: [],
      listMainArticleArray: [],
      listTopicArray: [],
      role: 'All',
      roleArray: ['Super admin', 'Manager', 'User'],
      roleSelection: ['All', 'Super admin', 'Manager', 'User'],
      menu: 'All',
      menuSelection: ['All', 'Management function', 'Basic function', 'The process of task', 'The process of report'],
      menuArray: ['Management function', 'Basic function', 'The process of task', 'The process of report'],
      menuSuperAdminArray: ['Management function', 'Basic function'],
      menuUserArray: ['Management function', 'Basic function', 'The process of task', 'The process of report'],
      disableCheckbox: false,
      topicArray: [],
      newTopic: {
        name: '',
      },
      defaultTopic: {
        name: '',
      },
      isShowInputTopic: false,
      isUploadPDF: false,
      selectedFile: [],
      listPDF: [],
      editedAttachmentIndex: -1,
      editedAttachment: {
        name: '',
        // topic_id: [],
      },
      defaultAttachment: {
        name: '',
        // topic_id: [],
      },
    }),

    computed: {
      headers() {
        return [
          {text: this.translateCol('name'), value: 'name', align: 'left'},
          {text: this.translateCol('guide_for'), value: 'role', align: 'center'},
          {text: this.translateCol('menu_function'), value: 'menu_function', align: 'center'},
        ];
      },

      headersTopic() {
        return [
          {text: this.translateCol('name'), value: 'name', align: 'left'},
          {text: this.translateCol('guide_for'), value: 'role', align: 'center'},
          {text: this.translateCol('main_article'), value: 'parent_name', align: 'center'},
          {text: this.translateCol('action'), value: 'actions', align: 'center'},
        ];
      },

      headersAttachment() {
        return [
          {text: this.translateCol('name'), value: 'name', align: 'left'},
        ];
      },

      filteredItems() {
        let that = this;
        return that.listArray.filter((item) => {
          return item.type === 'Main article'
            && (that.role === 'All' || (item.role === that.role))
            && (that.menu === 'All' || (item.menu_function === that.menu));
        });
      },

      filteredTopicItems() {
        let that = this;
        return that.listArray.filter((item) => {
          return item.type === 'Topic'
            && (that.role === 'All' || (item.role === that.role));
        });
      },

      filteredAttachmentItems() {
        let that = this;
        return that.listPDF;
      },

      formTitle() {
        return this.editedIndex === -1 ? 'New Main Article' : 'Edit Main Article';
      },

      formTopicTitle() {
        return this.editedIndex === -1 ? 'New Topic' : 'Edit Topic';
      },

      formPDFTitle() {
        return this.editedIndex === -1 ? 'New Topic PDF' : 'Edit Topic PDF';
      },
    },

    watch: {},

    created() {},

    mounted() {
      let that = this;
      that.$nextTick(() => {
        that.$nuxt.$loading.start();
        //Get topic pdf list
        that.$store.dispatch('documents/index', {
          type: 'attachment',
          object_type: 'help center'
        }).then(result => {
          that.listPDF = result.data;
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          // that.$toaster.error(that.$i18n.t('message.fail_document_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });

        //Get helping list
        that.$store.dispatch('help/index', {isHelpSetting: 1}).then(result => {
          that.listArray = result.data;
          that.listMainArticleArray = _.filter(that.listArray, function (item) {return item.type === 'Main article';});
          that.listTopicArray = _.filter(that.listArray, function (item) {return item.type === 'Topic';});
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
      });
    },

    methods: {
      translateCol (colName) {
        return this.$i18n.t('column.' + colName);
      },

      deleteTopicFromList(item) {
        this.formDirty = true;
        this.topicArray.splice(this.topicArray.indexOf(item), 1);
      },

      addMoreTopic() {
        this.isShowInputTopic = true;
      },

      addNewTopicName(){
        let newData = _.clone(this.newTopic);
        this.topicArray.push(newData);
        this.newTopic = Object.assign({}, this.defaultTopic);
        this.isShowInputTopic = false;
      },

      cancelNewTopicName() {
        this.isShowInputTopic = false;
      },

      addNew() {
        this.reset();
        this.dialog = this.tabIndex === 0;
        this.dialogTopic = this.tabIndex === 1;
        this.dialogPDF = this.tabIndex === 2;
      },

      editItem(item) {
        let that = this;
        that.$nuxt.$loading.start();
        that.$store.dispatch('help/show', item.id).then(result => {
          that.editedItem = Object.assign({}, result.data);
          that.editedIndex = that.listArray.indexOf(item);
          that.dialog = item.type === 'Main article';
          that.dialogTopic = item.type === 'Topic';
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_help_center_view_detail'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      },

      viewItem(item) {
        this.$router.push('/admin/settings/help-topic/' + item.id);
      },

      editAttachment(item) {
        let that = this;
        that.$nuxt.$loading.start();
        that.$store.dispatch('documents/show', item.id).then(result => {
          that.editedAttachment = Object.assign({}, result.data);
          that.editedAttachmentIndex = result.data.id;
          that.editedAttachment.topic_id = result.data.object_id;
          // that.editedAttachment.topic_id = that.formatFromStringToArray(result.data.object_id);
          that.dialogPDF = true;
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_document_delete'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      },

      // formatFromStringToArray(data) {
      //   let result;
      //   if (data) {
      //     result = data.split(',');
      //     result = _.map(result, function (item) {
      //       return parseInt(item);
      //     });
      //   } else {
      //     result = data;
      //   }
      //   return result;
      // },

      close() {
        this.reset();
        this.dialog = false;
        this.dialogTopic = false;
        this.disableCheckbox = false;
        this.dialogPDF = false;
        this.isShowInputTopic = false;
        this.selectedFile = [];
      },

      reset() {
        this.topicArray = [];
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
          this.editedAttachment = Object.assign({}, this.defaultAttachment);
          this.editedAttachmentIndex = -1;
          // this.$refs.form.reset();
          this.$refs.form.resetValidation();
        }, 0);
      },

      // dialog DELETE
      closeDelete() {
        this.dialogDelete = false;
      },

      deleteItem(item) {
        this.deleteHelp(item);
        this.dialogDelete = false;
        this.close();
      },

      deleteHelp(item) {
        let that = this;
        that.$store.dispatch('help/delete', item.id).then(function () {
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
          if (that.tabIndex === 0) {
            that.editedItem.type = 'Main article';
          } else {
            that.editedItem.type = 'Topic';
          }
          if (that.editedIndex > -1) {
            that.$store.dispatch('help/update', that.editedItem).then(function () {
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
            if (that.editedItem.type === 'Topic') {
              that.editedItem.topicArray = that.topicArray;
            }
            that.$store.dispatch('help/store', that.editedItem).then(function () {
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

      saveAttachment() {
        let that = this;
        if (that.$refs.form.validate()) {
          that.$nuxt.$loading.start();
          let formData = new FormData();
          formData.append('file', that.selectedFile);
          formData.append('file_size', that.selectedFile.size);
          formData.append('type', 'attachment');
          formData.append('object_type',  'help center');
          formData.append('object_id', that.editedAttachment.topic_id);
          formData.append('name', that.editedAttachment.name);
          formData.append('status', 1);
          formData.append('is_renewed', 0);
          if (that.selectedFile.name) {
            formData.append('original_file_name', that.selectedFile.name);
          } else {
            formData.append('original_file_name', that.editedAttachment.original_file_name);
          }
          formData.append('is_template', 0);
          if (that.editedAttachmentIndex > -1) {
            formData.append('id', that.editedAttachmentIndex);
            formData.append('attachment_updated', true);
          }
          that.$store.dispatch('documents/store', formData).then(function(){
            that.reloadPDFList();
            that.$toaster.success(that.$i18n.t('message.success_document_add_new'));
          }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_document_add_new'));
            }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish();
          });
          that.close();
        }
      },

      reloadList() {
        let that = this;
        // get list
        that.$store.dispatch('help/index', {isHelpSetting: 1}).then(result => {
          that.listArray = result.data;
          that.listMainArticleArray = _.filter(that.listArray, function (item) {return item.type === 'Main article';});
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

      reloadPDFList() {
        let that = this;
        // get list
        that.$store.dispatch('documents/index', {
          type: 'attachment',
          object_type: 'help center'
        }).then(result => {
          that.listPDF = result.data;
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_document_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      },

      checkMainArticle(item) {
        let help = _.findWhere(this.listArray, {id: item});
        this.editedItem.only_company_admin = help.only_company_admin;
        this.editedItem.role = help.role;
        if (this.editedItem.role === 'Super admin') {
          this.disableCheckbox = true;
        } else {
          this.disableCheckbox = !!help.only_company_admin;
        }
      },

      // getSelectedTopicItems(value) {
      //   this.editedAttachment.topic_id = value.selectedItemsOutput;
      // },

      getFile(item) {
        let filenameArray = item.uri.split('/').slice();
        let filename = filenameArray.slice(filenameArray.length - 1);
        downloadFile(item.url, filename);
      },
    }
  };
</script>

<style scoped>

</style>

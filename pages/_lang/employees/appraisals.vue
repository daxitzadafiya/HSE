<template>
  <div class="appraisals-page">
    <v-btn class="mb-2 btn-create  btn-custom-green" @click="addNew">
      {{ $t('button.add_new') }}
    </v-btn>

    <b-tabs v-model="tabIndex" card name="test" lazy>
      <keep-alive>
        <b-tab title="Appraisals" active name="result-tab" class="result-tab">
          <v-container>
            <v-dialog v-model="dialog" max-width="500px" persistent>
              <v-card>
                <v-card-text>
                  <div class="title-model">
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
                          <v-select
                            v-model="editedItem.user_id"
                            :items="usersArray"
                            :rules="required"
                            item-value="id"
                            :label="$t('form.user')"
                            outlined
                          >
                            <template slot="selection" slot-scope="data">
                              {{ data.item.first_name + ' ' + data.item.last_name }}
                            </template>
                            <template slot="item" slot-scope="data">
                              {{ data.item.first_name + ' ' + data.item.last_name }}
                            </template>
                          </v-select>
                        </div>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col>
                        <div class="input-wrap">
                          <v-text-field v-model="editedItem.topics" label="Topics" :rules="required" outlined />
                        </div>
                      </b-col>
                    </b-row>
                    <b-row v-if="editedIndex > -1">
                      <b-col>
                        <div class="input-wrap">
                          <v-select
                            v-model="editedItem.status"
                            item-text="name"
                            item-value="value"
                            :label="$t('form.status')"
                            :items="statusArray"
                            outlined
                          />
                        </div>
                      </b-col>
                    </b-row>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn class="btn-cancel" text @click="close">
                    Cancel
                  </v-btn>
                  <v-btn class="btn-save" @click="save">
                    Save
                  </v-btn>

                  <v-btn v-if="editedIndex > -1" class="hse-btn-delete" text @click="dialogDelete = true">
                    <v-icon dark>
                      mdi-delete
                    </v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

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
                      <b-col cols="10">
                        <b-row>
                          <b-col cols="6">
                            <div class="field-selection">
                              <v-select
                                v-model="status"
                                :items="statusSelect"
                                item-text="name"
                                item-value="value"
                                :label="$t('form.status')"
                                outlined
                                class="text-box"
                              />
                            </div>
                          </b-col>
                          <b-col cols="6">
                            <div class="input-wrap field-search">
                              <v-text-field
                                v-model="search"
                                append-icon="search"
                                label="Search"
                                outlined
                                class="text-box"
                              >
                    <template v-slot:append>
                      <img src="@/assets/images/icon/magnifier.png" class="search-icon-cust">
                    </template>
                  </v-text-field> 
                            </div>
                          </b-col>
                        </b-row>
                      </b-col>
                    </b-row>
                  </div>
                  <div class="panel-footer text-right">
                    <!--                  <a type="button" class="btn btn-default" @click="addNewGoal"> New goal</a>-->
                  </div>
                </div>
              </template>

              <template v-slot:header="{ props: { headers } }">
                <h4 class="table-name">
                  Appraisals
                </h4>
              </template>

              <template v-slot:item.name="{ item }">
                {{ item.first_name + ' ' + item.last_name }}
              </template>

              <template v-slot:item.status="{ item }">
                {{ formatStatus(item.status) }}
              </template>

<!--              <template v-slot:item.action="{ item }">-->
<!--                <v-icon small class="mr-2" @click="editItem(item)">-->
<!--                  edit-->
<!--                </v-icon>-->
<!--                <v-icon small @click="deleteItem(item)">-->
<!--                  delete-->
<!--                </v-icon>-->
<!--              </template>-->
              <template v-slot:no-data>
                No data
              </template>
            </v-data-table>
          </v-container>
        </b-tab>
      </keep-alive>
      <keep-alive>
        <b-tab title="Resources" name="detail-tab">
          <v-container>
            <v-dialog v-model="dialogTemplate" max-width="500px" persistent>
              <v-card>
                <v-card-text>
                  <div class="title-model">
                    {{ formTemplateTitle }}
                  </div>
                  <v-form
                    ref="form"
                    v-model="valid"
                    lazy-validation
                  >
                    <b-row>
                      <b-col>
                        <div class="input-wrap">
                          <v-select
                            v-model="editedItem.user_id"
                            :items="usersArray"
                            :rules="required"
                            item-value="id"
                            :label="$t('form.user')"
                            outlined
                          >
                            <template slot="selection" slot-scope="data">
                              {{ data.item.first_name + ' ' + data.item.last_name }}
                            </template>
                            <template slot="item" slot-scope="data">
                              {{ data.item.first_name + ' ' + data.item.last_name }}
                            </template>
                          </v-select>
                        </div>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col>
                        <div class="input-wrap">
                          <v-text-field v-model="editedItem.topics" label="Topics" :rules="required" outlined />
                        </div>
                      </b-col>
                    </b-row>
                    <b-row v-if="editedIndex > -1">
                      <b-col>
                        <div class="input-wrap">
                          <v-select
                            v-model="editedItem.status"
                            item-text="name"
                            item-value="value"
                            :label="$t('form.status')"
                            :items="statusArray"
                            outlined
                          />
                        </div>
                      </b-col>
                    </b-row>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn class="btn-cancel" text @click="close">
                    Cancel
                  </v-btn>
                  <v-btn v-if="editedIndex > -1" class="btn-save" @click="applyTemplate">
                    Apply
                  </v-btn>
                  <v-btn v-if="editedIndex === -1" class="btn-save" @click="saveAndApply">
                    Save and apply
                  </v-btn>
                  <v-btn v-if="editedIndex === -1 || (editedIndex > -1 && editedItem.added_by > 1)" class="hse-btn-save" text @click="save">
                    Save
                  </v-btn>
                  <v-btn v-if="editedIndex > -1 && editedItem.added_by > 1" class="hse-btn-delete" text @click="dialogDelete = true">
                    <v-icon dark>
                      mdi-delete
                    </v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-data-table
              :headers="headers"
              :items="templates"
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
                      <b-col cols="10">
                        <b-row>
                          <b-col cols="6">
                            <div class="field-selection">
                              <v-select
                                v-model="status"
                                :items="statusSelect"
                                item-text="name"
                                item-value="value"
                                :label="$t('form.status')"
                                outlined
                                class="text-box"
                              />
                            </div>
                          </b-col>
                          <b-col cols="6">
                            <div class="field-selection field-search">
                              <v-text-field
                                v-model="search"
                                append-icon="search"
                                label="Search"
                                outlined
                                class="text-box"
                              >
                    <template v-slot:append>
                      <img src="@/assets/images/icon/magnifier.png" class="search-icon-cust">
                    </template>
                  </v-text-field> 
                            </div>
                          </b-col>
                        </b-row>
                      </b-col>
                    </b-row>
                  </div>

                  <div class="panel-footer text-right">
                    <!--                  <a type="button" class="btn btn-default" @click="addNewTemplate"> New template</a>-->
                  </div>
                </div>
              </template>

              <template v-slot:header="{ props: { headers } }">
                <h4 class="table-name">
                  Resources
                </h4>
              </template>

              <template v-slot:item.action="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)">
                  edit
                </v-icon>
                <v-icon small @click="deleteItem(item)">
                  delete
                </v-icon>
              </template>
              <template v-slot:no-data>
                No data
              </template>
            </v-data-table>
          </v-container>
        </b-tab>
      </keep-alive>
    </b-tabs>

    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card class="dialog-delete">
        <v-card-text>
          <div class="text-center confirm-delete-title">
            Confirm delete
          </div>
          <div class="confirm-delete-text">
            Are you sure you want to delete this item?
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="btn-cancel" text @click="closeDelete">
            Cancel
          </v-btn>
          <v-btn class="btn-save" @click="deleteItem(editedItem)">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogApply" max-width="500px">
      <v-card class="dialog-delete">
        <v-card-text>
          <div class="text-center confirm-delete-title">
            Apply success
          </div>
          <div class="confirm-delete-text">
            <p>Your goal has successfully been applied to your active goals.</p>
            <p class="text-center">
              <v-btn class="btn-default" text @click="editItem(editedItem); dialogApply = false">
                Click here to review goal
              </v-btn>
            </p>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="btn-cancel" text @click="closeApply">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogConfirmApply" max-width="500px">
      <v-card class="dialog-delete">
        <v-card-text>
          <div class="text-center confirm-delete-title">
            Confirm modal
          </div>
          <div class="confirm-delete-text">
            <p> Do you want to save the updates before applying the template?</p>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="btn-cancel" text @click="updateAndApply">
            Yes
          </v-btn>

          <v-btn class="btn-cancel" text @click="applyTemplate">
            No
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogConfirmClose" max-width="500px">
      <v-card class="dialog-delete">
        <v-card-text>
          <div class="text-center confirm-delete-title">
            Confirm modal
          </div>
          <div class="confirm-delete-text">
            <p> Do you want to cancel without saving ?</p>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="btn-cancel" text @click="close">
            Yes
          </v-btn>

          <v-btn class="btn-cancel" text @click="dialogConfirmClose = false">
            No
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
  import {_} from 'vue-underscore';

  export default {
    data: () => ({
      search: '',
      status: 0,
      // topics: 'All',
      // statusArray: ['All', 'New', 'Done'],
      usersArray: [],
      dialog: false,
      valid: true,
      headers: [
        { text: 'User', value: 'user_id', align: 'left' },
        { text: 'Topics', value: 'topics', align: 'center' },
        { text: 'Status', value: 'status', align: 'center' },
        // { text: 'Actions', value: 'action', align: 'center' },
      ],
      listArray: [],
      editedIndex: -1,
      editedItem: {
        user_id: '',
        status: "New",
        topics: '',
        company_id: "",
        is_template: false,
      },
      defaultItem: {
        user_id: '',
        status: "New",
        topics: '',
        company_id: "",
        is_template: false,
      },
      menu: false,
      required: [
        v => !!v || 'This is required'
      ],
      company_id: '',
      dialogTemplate: false,
      templates: [],
      dialogDelete: false,
      tabIndex: 0,
      statusArray: [
        {
          value: 1,
          name: "New"
        },
        {
          value: 2,
          name: "Done"
        }
      ],
      statusSelect: [
        {
          value: 0,
          name: "All"
        },
        {
          value: 1,
          name: "New"
        },
        {
          value: 2,
          name: "Done"
        }
      ],
      dialogApply: false,
      dialogConfirmApply: false,
      formDirty: false,
      dialogConfirmClose: false,
    }),

    computed: {
      filteredItems() {
        return this.listArray.filter((i) => {
          return ((this.company_id === '' || (i.company_id === this.company_id))
          && (this.status === 0 || (i.status === this.status)));
        });
      },
      formTitle() {
        return this.editedIndex === -1 ? 'New Appraisals' : 'Edit Appraisals';
      },
      formTemplateTitle() {
        return this.editedIndex === -1 ? 'Add a resource' : 'Edit Resource';
      },
    },

    watch: {
      dialog(val) {
        val || this.close();
      },
    },

    mounted() {
      var that = this;
      // get company_id
      that.$store.dispatch('authenticate/profile').then(result => {
        that.company_id = result.data.company_id;
      }).catch((error) => {
        that.$toaster.error(error.message || error.status);
      });

      // list users
      that.$store.dispatch('users/index').then(result => {
        that.usersArray = result.data;
        that.usersSelection = _.clone(result.data);
        that.usersSelection.push(that.dataDefault);
        that.usersSelection.sort(function (a, b) {
          return (a.id - b.id);
        });
      }).catch((error) => {
        that.$toaster.error(error.message || error.status);
      });

      // get appraisals list
      that.$store.dispatch('appraisals/index').then(result => {
        that.listArray = _.filter(result.data, function (item) {
          return !item.is_template;
        });
        that.templates = _.filter(result.data, function (item) {
          return item.is_template;
        });
      }).catch((error) => {
        that.$toaster.error(error.message || error.status);
      });
    },

    methods: {
      addNew() {
        this.reset();
        if (this.tabIndex === 0) {
          this.dialog = true;
          this.dialogTemplate = false;
        } else {
          this.dialog = false;
          this.dialogTemplate = true;
        }
      },

      editItem(item) {
        this.formDirty = false;
        if (this.tabIndex === 0) {
          this.editedIndex = this.listArray.indexOf(item);
          this.dialog = true;
          this.dialogTemplate = false;
        } else {
          this.editedIndex = this.templates.indexOf(item);
          this.dialog = false;
          this.dialogTemplate = true;
        }

        this.editedItem = Object.assign({}, item);
        this.originData = _.clone(this.editedItem);
      },

      deleteItem(item) {
        if (this.dialog) {
          const index = this.listArray.findIndex(i => i.id === item.id);
          this.listArray.splice(index, 1);
          this.deleteAppraisal(item);
          this.dialogDelete = this.dialog = false;
        } else {
          const indexTemplate = this.templates.findIndex(i => i.id === item.id);
          this.templates.splice(indexTemplate, 1);
          this.deleteAppraisal(item);
          this.dialogDelete = this.dialogTemplate = false;
        }
      },

      deleteAppraisal(item) {
        this.$store.dispatch('appraisals/delete', item.id).then(result => {
          console.log(result);
        }).catch((error) => {
          this.$toaster.error(error.message || error.status);
        });
      },

      close() {
        this.dialogConfirmClose = false;
        this.formDirty = false;
        if (this.dialogTemplate) {
          this.dialogTemplate = false;
        } else {
          this.dialog = false;
        }
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
        }, 300);
      },

      save() {
        if (this.$refs.form.validate()) {
          var that = this;
          that.$nuxt.$loading.start();
          if (that.editedIndex > -1) {
            // edit
            that.$store.dispatch('appraisals/update', that.editedItem).then(function () {
              that.reloadList();
            }).catch((error) => {
              that.$toaster.error(error.message || error.status);
              that.$nuxt.$loading.finish();
            });
          } else {
            // create appraisal
            that.editedItem.status = 1;
            that.editedItem.company_id = that.company_id;
            if (this.dialogTemplate) {
              that.editedItem.is_template = true;
            }
            that.$store.dispatch('appraisals/store', that.editedItem).then(function () {
              that.reloadList();
              that.editedItem = that.defaultItem;
              that.$nuxt.$loading.finish();
            }).catch((error) => {
              that.$toaster.error(error.message || error.status);
              that.$nuxt.$loading.finish();
            });
          }
          that.close();
        }
      },

      reloadList(){
        let that = this;
        // get list
        that.$store.dispatch('appraisals/index').then(result => {
          that.listArray = _.filter(result.data, function (item) {
            return !item.is_template;
          });
          that.templates = _.filter(result.data, function (item) {
            return item.is_template;
          });
          that.$nuxt.$loading.finish();
        }).catch((error) => {
          that.$toaster.error(error.message || error.status);
          that.$nuxt.$loading.finish();
        });
      },

      reset() {
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
          this.$refs.form.resetValidation();
        }, 0);
      },

      // dialog DELETE
      closeDelete() {
        this.dialogDelete = false;
      },

      closeApply(){
        this.dialogApply = false;
      },

      formatStatus(status) {
        if (status === 1) {
          return "New";
        } else if (status === 2) {
          return "Done";
        }
      },

      //function to apply selected template content to all input
      applyTemplate() {
        if (this.$refs.form.validate()) {
          var that = this;
          that.$nuxt.$loading.start();
          that.editedItem.status = "New";
          that.editedItem.company_id = that.company_id;
          that.editedItem.is_template = false;
          that.$store.dispatch('appraisals/store', that.editedItem).then(function(result){
            that.listArray.push(result.data);
            that.$nuxt.$loading.finish();
            that.editedItem = result.data;
            that.dialogTemplate = false;
            that.dialogConfirmApply = false;
            that.dialogApply = true;
            that.tabIndex = 0;
            that.reloadList();
          }).catch((error) => {
            that.$toaster.error(error.message || error.status);
            that.$nuxt.$loading.finish();
          });
        }
      },

      saveAndApply(){
        // create template
        if (this.$refs.form.validate()) {
          var that = this;
          that.$nuxt.$loading.start();
          that.editedItem.status = "New";
          that.editedItem.company_id = that.company_id;
          if (this.dialogTemplate) {
            that.editedItem.is_template = true;
          }
          that.$store.dispatch('appraisals/store', that.editedItem).then(function(){
            that.applyTemplate();
            that.$nuxt.$loading.finish();
          }).catch((error) => {
            that.$toaster.error(error.message || error.status);
            that.$nuxt.$loading.finish();
          });
        }
      },

      updateAndApply(){
        if (this.$refs.form.validate()) {
          var that = this;
          that.dialogConfirmApply = false;
          that.$nuxt.$loading.start();
          that.editedItem.status = "New";
          that.editedItem.company_id = that.company_id;
          if (this.dialogTemplate) {
            that.editedItem.is_template = true;
          }
          that.$store.dispatch('appraisals/update', that.editedItem).then(function(){
            that.applyTemplate();
            that.$nuxt.$loading.finish();
          }).catch((error) => {
            that.$toaster.error(error.message || error.status);
            that.$nuxt.$loading.finish();
          });
        }
      },

      checkDirtyForm(){
        var that = this;
        var result = false;
        _.each(that.editedItem, function(value, key, obj) {
          if(that.originData && obj[key] && that.originData[key] && obj[key] !== that.originData[key]){
            result = true;
          }
        });
        return result;
      },

      checkConfirmApply(){
        var that = this;
        _.each(that.editedItem, function(value, key, obj) {
          if(obj[key] !== that.originData[key]){
            that.formDirty = true;
          }
        });
        if(that.formDirty && that.editedItem.added_by > 1){
          that.dialogConfirmApply = true;
        } else{
          that.applyTemplate();
        }
      },

      checkDirtyBeforeClose(){
        if(this.checkDirtyForm()){
          this.dialogConfirmClose = true;
        }else{
          this.close();
        }
      },
    },
  };
</script>

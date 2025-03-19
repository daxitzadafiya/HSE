<template>
  <div>
    <v-dialog v-model="openPopup" max-width="1300px" persistent>
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
            <b-row align-h="center">
              <b-col cols="12">
                <div class="input-wrap">
                  <v-text-field v-model="editedItem.title" :label="$t('form.title')" :rules="required" outlined />
                </div>
              </b-col>
            </b-row>
            <b-row align-h="center">
              <b-col cols="12">
                <!--                <froala :tag="'textarea'" :config="config" v-model="editedItem.description">Init text</froala>-->
                <div class="input-wrap">
                  <froala
                    id="link-editor"
                    v-model="editedItem.description"
                    :tag="'textarea'"
                    :config="config"
                  />
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
<!--          <v-btn-->
<!--            v-if="checkAdmin || permissionsUser.indexOf('statement-basic') > -1"-->
<!--            class="hse-btn-save"-->
<!--            @click="convertStatementDescription"-->
<!--          >-->
<!--            Preview-->
<!--          </v-btn>-->
          <v-btn
            v-if="checkSuperAdmin || ((checkAdmin || permissionsUser.indexOf('statement-basic') > -1) && (!editMode || (editMode && !editedItem.disable_status)))"
            class="btn-save"
            @click="save"
          >
            {{ $t('button.save') }}
          </v-btn>
          <v-btn
            v-if="editMode && (checkSuperAdmin || ((checkAdmin || permissionsUser.indexOf('statement-basic') > -1) && (editMode && !editedItem.disable_status)))"
            class="hse-btn-delete"
            text
            @click="dialogDelete = true"
          >
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

    <v-dialog v-model="dialogApply" max-width="500px">
      <v-card class="dialog-delete">
        <v-card-text>
          <div class="text-center confirm-delete-title">
            {{ $t('title.apply_success') }}
          </div>
          <div class="confirm-delete-text">
            <p>Your statement has successfully been applied to your active statements.</p>
            <p class="text-center">
              <v-btn class="btn-default" text @click="showItem(editedItem)">
                Click here to review statement
              </v-btn>
            </p>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="btn-cancel" text @click="closeApply">
            {{ $t('button.cancel') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogConfirmApply" max-width="500px">
      <v-card class="dialog-delete">
        <v-card-text>
          <div class="text-center confirm-delete-title">
            {{ $t('title.confirm_modal') }}
          </div>
          <div class="confirm-delete-text">
            <p> Do you want to save the updates before applying the template?</p>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="btn-cancel" text @click="updateAndApply">
            {{ $t('button.yes') }}
          </v-btn>

          <v-btn class="btn-cancel" text @click="applyTemplate">
            {{ $t('button.no') }}
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
  import cookies from "js-cookie";
  import FroalaEditor from 'froala-editor';
  import {DropkiqUI} from "dropkiq-ui";

  export default {
    name: "StatementPopup",
    components: {},
    props: {
      statementItem: {
        type: Object,
        required: false,
      },
      openPopup: Boolean,
      viewOnly: {
        type: Boolean,
        required: false,
      },
      contactsArray: {
        type: Array,
        required: false,
      },
    },
    data: () => ({
      permissionsUser: localStorage.getItem('permissionsKey'),
      checkAdmin: cookies.get('checkAdmin'),
      checkSuperAdmin: cookies.get('checkSuperAdmin'),
      roleUser: cookies.get('roleUser'),
      userRoleId: parseInt(cookies.get('roleID')),
      valid: true,
      required: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else return true;
        }
      ],
      editedItem: {
        title: '',
        description: '',
        disable_status: '',
        is_template: false
      },
      defaultItem: {
        title: '',
        description: '',
        disable_status: '',
        is_template: false
      },
      dialogDelete: false,
      dialogConfirmApply: false,
      dialogApply: false,
      dialogConfirmClose: false,
      formTitle: '',
      editMode: true,
      formDirty: false,
      // checkResource: false,
      // category_statement: 1, // category type: statement
      // categoriesValidArray: [],
      dialogRelatedObjects: false,
      config: {
        events: {
          //
        },
        // placeholderText: 'Place your cursor in {{}} to see the autofill list.',
        charCounterCount: true,
        heightMin: 300,
        quickInsertEnabled: false,
        toolbarButtons: {
          'moreText': {
            'buttons': ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'inlineClass', 'inlineStyle', 'clearFormatting']
          },
          'moreParagraph': {
            'buttons': ['alignLeft', 'alignCenter', 'formatOLSimple', 'alignRight', 'alignJustify', 'formatOL', 'formatUL', 'paragraphFormat', 'paragraphStyle', 'lineHeight', 'outdent', 'indent', 'quote']
          },
          'moreRich': {
            'buttons': ['refer_to_dropdown_custom', 'insertLink', 'insertImage', 'insertVideo', 'insertTable', 'emoticons', 'fontAwesome', 'specialCharacters', 'embedly', 'insertFile', 'insertHR']
          },
          'moreMisc': {
            'buttons': ['undo', 'redo', 'fullscreen', 'print', 'getPDF', 'spellChecker', 'selectAll', 'html', 'help'],
            'align': 'right',
            'buttonsVisible': 2
          }
        },
        linkList: [],
      },
    }),

    computed: {},

    watch: {
      openPopup(value) {
        if (value) {
          // Describes your application's "Liquid Schema" (required)
          // Generate this with https://github.com/akdarrah/dropkiq-gem for Ruby on Rails
          const schema = {
            contacts: {
              methods: {
                name: {
                  type: "ColumnTypes::String",
                  foreign_table_name: null,
                  hint: "The full name of the contact person"
                },
                email: {
                  type: "ColumnTypes::String",
                  foreign_table_name: null,
                  hint: "The email address of the contact person"
                },
                age: {
                  type: "ColumnTypes::Numeric",
                  foreign_table_name: null,
                  hint: "The computed age of the contact person"
                },
                is_minor: {
                  type: "ColumnTypes::Boolean",
                  foreign_table_name: null,
                  hint: "Is true if the person is less than 18 years old"
                },
                birthdate: {
                  type: "ColumnTypes::DateTime",
                  foreign_table_name: null,
                  hint: "The birthdate of the contact person"
                },
                notes: {
                  type: "ColumnTypes::Text",
                  foreign_table_name: null,
                  hint: "Any notes that are saved in the database"
                },
                favorite_website: {
                  type: "ColumnTypes::HasOne",
                  foreign_table_name: "websites",
                  hint: "The website the person visits most often"
                },
                visited_websites: {
                  type: "ColumnTypes::HasMany",
                  foreign_table_name: "websites",
                  hint: "A list of websites the person has visited"
                }
              }
            },
            websites: {
              methods: {
                nickname: {
                  type: "ColumnTypes::String",
                  foreign_table_name: null,
                  hint: "The nickname of the website"
                },
                url: {
                  type: "ColumnTypes::String",
                  foreign_table_name: null,
                  hint: "The website HTTP URL address"
                }
              }
            }
          };

          // Describes what data the user has access to right now (required)
          const context = {
            // CEO_name: {
            //   type: "ColumnTypes::String",
            //   foreign_table_name: null,
            //   hint: "CEO's name"
            // },
            // HSE_manager_name: {
            //   type: "ColumnTypes::String",
            //   foreign_table_name: null,
            //   hint: "HSE manager's name"
            // },
            // Safety_manager_name: {
            //   type: "ColumnTypes::String",
            //   foreign_table_name: null,
            //   hint: "Safety manager's name"
            // },
            // Number_of_employees: {
            //   type: "ColumnTypes::Numeric",
            //   foreign_table_name: null,
            //   hint: "Number of employees"
            // },
            // email_subject: {
            //   type: "ColumnTypes::String",
            //   foreign_table_name: null,
            //   hint: "The subject of the email to send"
            // },
            // email_body: {
            //   type: "ColumnTypes::Text",
            //   foreign_table_name: null,
            //   hint: "The body of the email to send"
            // },
            // email_from: {
            //   type: "ColumnTypes::String",
            //   foreign_table_name: null,
            //   hint: "The email address the email will be sent from"
            // },
            // email_contact: {
            //   type: "ColumnTypes::HasOne",
            //   foreign_table_name: "contacts",
            //   hint: "The contact who will receive the email"
            // }
          };

          // Test data that is used for the preview feature (optional)
          const scope = {
            // CEO_name: this.suggestedInfo.CEO_name,
            // HSE_manager_name: this.suggestedInfo.HSE_manager_name,
            // Safety_manager_name: this.suggestedInfo.Safety_manager_name,
            // Number_of_employees: this.suggestedInfo.Number_of_employees,

            // email_subject: "Try Dropkiq Today!",
            // email_body: "Work faster with a smarter editor. Write complex Liquid statements with ease. Dropkiq Autocompletion gives your users the confidence they need to write their statements correctly the first time.",
            // email_from: "Adam Darrah <adam@dropkiq.com>",
            // email_contact: {
            //   name: "John Doe",
            //   email: "john.doe@dropkiq.com",
            //   age: 30,
            //   is_minor: false,
            //   birthdate: Date.parse("March 18, 1990"),
            //   notes: "Software developer for application that uses liquid, but users don't fully understand how to use it...",
            //   favorite_website: {
            //     nickname: "Dropkiq",
            //     url: "https://www.dropkiq.com/"
            //   },
            //   visited_websites: [
            //     {nickname: "Dropkiq Ruby Gem", url: "https://github.com/akdarrah/dropkiq-gem"},
            //     {nickname: "Dropkiq UI", url: "https://github.com/akdarrah/dropkiq-ui"}
            //   ]
            // }
          };

          // let preview = document.getElementById('preview-out');
          this.config.events = {
            initialized: function() {
              var editor = this;
              // console.log(schema);
              // Initialize the Standard DropkiqUI for demo elements
              // https://www.npmjs.com/package/dropkiq-ui
              var dropkiqUI = new DropkiqUI(editor.el, schema, context, scope, "");
              // var dropkiqUI = new DropkiqUI(editor.el, schema, context, scope, "", {
              //   onRender: function(renderedDocument){
              //     // preview.textContent = renderedDocument;
              //     this.statementDescription = renderedDocument;
              //     console.log(renderedDocument);
              //   }
              // });
              editor.events.on('keydown', function(e) {
                if (e.which == FroalaEditor.KEYCODE.ENTER && dropkiqUI.menuIsOpen()) {
                  return false;
                }
              }, true);

              setTimeout(function(){
                editor.events.focus(true);
              }, 1);
            }
          };

          if (this.statementItem) {
            this.editItem(this.statementItem);
          } else {
            this.addNew();
          }
        }
      },

      // resource(value) {
      //   if (value) {
      //     this.checkResource = value;
      //   }
      // },
    },

    mounted() {
      // let that = this;
      // that.$nextTick(() => {
      //   that.$nuxt.$loading.start();
        // that.$store.dispatch('employees/index').then(result => {
        //   _.map(result.data, function(i) {
        //     if (i.department_name) {
        //       return i.name = i.name + ' - ' + i.department_name;
        //     } else {
        //       return i.name;
        //     }
        //   });
        //   that.attendingEmployees = result.data;
        //   that.responsibleArray = _.clone(result.data);
        //   that.responsibleArray = _.filter(result.data, function (item) {
        //     return item.role_id === 2 || item.role_id === 3;
        //   });
        //   that.$nuxt.$loading.finish();
        // }).catch((error) => {
        //   that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        //   that.$nuxt.$loading.finish();
        // });

        // // list contacts
        // that.$store.dispatch('contacts/index').then(result => {
        //   that.contactsArray = result.data;
        //   that.$nuxt.$loading.finish();
        // }).catch((error) => {
        //   that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        //   that.$nuxt.$loading.finish();
        // });
      // });
    },

    created() {
      if (this.openPopup) {
        if (this.statementItem) {
          this.editItem(this.statementItem);
        } else {
          this.addNew();
        }
      }

      if (this.resource) {
        this.checkResource = this.resource;
      }
    },

    methods: {
      getNewCategory(value) {
        this.editedItem.category_id = value.newCategoryId;
      },

      addNew() {
        this.reset();
        // if (this.checkResource) {
        //   this.formTitle = 'Add a resource';
        // } else {
        //   this.formTitle = 'New Statement';
        // }
        this.editMode = false;
        this.formTitle = this.$i18n.t('title.new_statement');
      },

      editItem(item) {
        let that = this;
        that.formDirty = false;
        that.$nuxt.$loading.start();
        that.formTitle = that.$i18n.t('title.edit_statement');
        that.$store.dispatch('statements/show', item.id).then(result => {
          that.editedItem = Object.assign({}, result.data);
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_statement_view_detail'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
        that.originData = _.clone(that.editedItem);
      },

      checkDirtyBeforeClose(){
        if(this.checkDirtyForm()){
          this.dialogConfirmClose = true;
        }else{
          this.close();
        }
      },

      checkDirtyForm(){
        let that = this;
        let result = false;
        _.each(that.editedItem, function(value, key, obj) {
          if(that.originData && obj[key] && that.originData[key] && obj[key] !== that.originData[key]){
            result = true;
          }
        });
        return result;
      },

      // checkConfirmApply(){
      //   let that = this;
      //   _.each(that.editedItem, function(value, key, obj) {
      //     if(obj[key] !== that.originData[key]){
      //       that.formDirty = true;
      //     }
      //   });
      //   if(that.formDirty && that.editedItem.added_by > 1){
      //     that.dialogConfirmApply = true;
      //   } else{
      //     that.applyTemplate();
      //   }
      // },

      close() {
        this.reset();
        this.$emit('closePopup');
        this.dialogConfirmClose = false;
        this.dialogConfirmApply = false;
        this.formDirty = false;
      },

      reset() {
        this.$nuxt.$loading.finish();
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          // this.$refs.form.reset();
          this.$refs.form.resetValidation();
        }, 300);
      },

      // convertStatementDescription() {
      //   let that = this;
      //   that.editedItem.description = that.editedItem.description.replaceAll('{{CEO_name}}', that.suggestedInfo.CEO_name);
      //   that.editedItem.description = that.editedItem.description.replaceAll('{{HSE_manager_name}}', that.suggestedInfo.HSE_manager_name);
      //   that.editedItem.description = that.editedItem.description.replaceAll('{{Safety_manager_name}}', that.suggestedInfo.Safety_manager_name);
      //   that.editedItem.description = that.editedItem.description.replaceAll('{{Number_of_employees}}', that.suggestedInfo.Number_of_employees);
      // },

      save() {
        let that = this;
        // that.convertStatementDescription();
        if (that.$refs.form.validate()) {
          that.$nuxt.$loading.start();
          if (that.editMode) {
            // edit
            that.$store.dispatch('statements/update', that.editedItem).then(function () {
              that.reloadList();
              that.$toaster.success(that.$i18n.t('message.success_statement_update'));
            }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_statement_update'));
              }
              // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
              that.$nuxt.$loading.finish();
            });
          } else {
            // create
            if (that.checkSuperAdmin) {
              that.editedItem.is_template = true;
            }
            that.$store.dispatch('statements/store', that.editedItem).then(function () {
              that.reloadList();
              that.editedItem = that.defaultItem;
              that.$toaster.success(that.$i18n.t('message.success_statement_add_new'));
            }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_statement_add_new'));
              }
              // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
              that.$nuxt.$loading.finish();
            });
          }
          that.close();
        }
      },

      reloadList(){
        this.$emit('reloadList');
      },

      // dialog DELETE
      closeDelete() {
        this.dialogDelete = false;
      },

      closeApply(){
        this.dialogApply = false;
      },

      deleteItem(item) {
        this.deleteStatement(item);
        this.dialogDelete = false;
        this.close();
        // if (this.dialog) {
        //   this.deleteStatement(item);
        //   this.dialogDelete = false;
        //   this.close();
        // } else {
        //   this.deleteStatement(item);
        //   this.dialogDelete = this.checkResource = false;
        // }
      },

      deleteStatement(item) {
        let that = this;
        that.$store.dispatch('statements/delete', item.id).then(function() {
          that.reloadList();
          that.$toaster.success(that.$i18n.t('message.success_statement_delete'));
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_statement_delete'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          // that.$nuxt.$loading.finish();
        });
      },

      //function to apply selected template content to all input
      applyTemplate() {
        let that = this;
        if (that.$refs.form.validate()) {
          that.editedItem.is_template = false;
          if (!that.editedItem.parent_id) {
            that.editedItem.parent_id = that.editedItem.id;
          }
          that.$store.dispatch('statements/store', that.editedItem).then(function(result) {
            that.$nuxt.$loading.start();
            that.editedItem = result.data;
            that.checkResource = false;
            // that.dialogApply = true;
            that.reloadList();
            that.changeTab(0);
            that.$toaster.success(that.$i18n.t('message.success_statement_add_new'));
          }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_statement_add_new'));
            }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish();
          });
          that.close();
        }
      },

      saveAndApply(){
        let that = this;
        // create template
        if (that.$refs.form.validate()) {
          that.editedItem.is_template = true;
          that.editedItem.deadline = new Date().toISOString().substr(0, 10);
          that.$store.dispatch('statements/store', that.editedItem).then(result => {
            that.editedItem.parent_id = result.data.id;
            that.applyTemplate();
          }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_statement_add_new'));
            }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish();
          });
        }
      },

      updateAndApply(){
        let that = this;
        if (that.$refs.form.validate()) {
          that.$store.dispatch('statements/update', that.editedItem).then(result => {
            that.editedItem.parent_id = result.data.id;
            that.applyTemplate();
          }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_statement_update'));
            }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish();
          });
        }
      },

      //----- END - function to apply selected template content to all input

      // updateResource(value) {
      //   this.$emit('updateResource', value);
      // },

      // changeTab(value) {
      //   this.$emit('changeTab', value);
      // },

      showItem(item) {
        this.dialogApply = false;
        // this.checkResource = false;
        // this.updateResource(this.checkResource);
        // this.changeTab(0);
        this.$emit('showItem', item);
      },
    },
  };
</script>

<style scoped>

</style>

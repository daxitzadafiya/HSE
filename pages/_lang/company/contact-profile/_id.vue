<template>
  <div class="page-contact-profile">
    <div class="name-page">
      {{ $t('title.contact_information') }}
    </div>
    <v-container>
      <v-row>
        <v-col cols="12" sm="5">
          <v-card width="100%">
            <div class="text-left box-title">
              {{ $t('title.information') }}
            </div>
            <v-container>
              <div>
                <b-row class="align-items-center hse-company-name mb-5" align-h="center">
                  <h4>{{ contactInfo.name }}</h4>
                </b-row>
                <b-row class="sm-padding-row">
                  <b-col cols="6" class="info-key text-right">Organization number</b-col>
                  <b-col cols="6" class="input-wrap text-left">{{ contactInfo.organization_number }}</b-col>
                </b-row>
                <b-row class="sm-padding-row">
                  <b-col cols="6" class="info-key text-right">Category</b-col>
                  <b-col cols="6" class="input-wrap text-left">{{ contactInfo.category_name }}</b-col>
                </b-row>
                <b-row class="sm-padding-row">
                  <b-col cols="6" class="info-key text-right">Contact info</b-col>
                  <b-col cols="6" class="input-wrap text-left">
                    <div>{{ contactInfo.email }}</div>
                    <div>{{ contactInfo.phone_number }}</div>
                  </b-col>
                </b-row>
                <b-row class="sm-padding-row">
                  <b-col cols="6" class="info-key text-right">Address</b-col>
                  <b-col cols="6" class="input-wrap text-left">
                    <div>{{ contactInfo.address }}</div>
                    <div>{{ contactInfo.zip_code }}</div>
                    <div>{{ contactInfo.city }}</div>
                  </b-col>
                </b-row>
              </div>
              <ContactPopup
                :open-popup="openPopup"
                :view-only="false"
                :contact-item="contactInfo"
                :categories-array="categoriesArray"
                @closePopup="openPopup = !openPopup"
                @reloadList="reloadContact"
                @reloadListCategory="reloadListCategoryContact"
              />
            </v-container>
            <div class="box-footer">
              <div class="text-right">
                <button
                  v-if="checkAdmin || permissionsUser.indexOf('contact-basic') > -1"
                  class="btn btn-default btn-edit-footer"
                  @click="openPopup = true"
                  :disabled=!!planAccess?.lastPlanAccess?.contact>
                  {{ $t('button.edit') }}
                </button>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="7">
          <!-- card right -->
          <v-card width="100%">
            <div class="text-left box-title">
              {{ $t('title.contacts') }}
            </div>
            <v-container>
              <v-data-table
                :headers="headers"
                :items="filteredItems"
                class="elevation-1 hse-table"
                :items-per-page="15"
                :single-expand="true"
                :sort-by="['created_at']"
                :sort-desc="[true, false]"
                @click:row="editItem"
              >
                <template v-slot:item.name="{ item }">
                  {{ item.name }}
                  <div v-if="item.is_primary === 1">
                    <v-chip
                      class="mt-2 mb-2"
                      color="primary"
                      outlined
                    >
                      Primary
                    </v-chip>
                  </div>
                </template>
                <template v-slot:no-data>
                  {{ $t('table.no_data') }}
                </template>
              </v-data-table>
              <v-dialog v-model="dialog" max-width="500px" persistent>
                <v-card width="100%">
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
                        <b-col>
                          <div class="input-wrap">
                            <v-text-field v-model="editedItem.name" :label="$t('form.name')" :rules="required" outlined />
                          </div>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col>
                          <div class="input-wrap">
                            <v-text-field
                              v-model="phoneNumber"
                              :label="$t('form.phone_number')"
                              :rules="phoneNumberRule"
                              outlined
                              maxlength="10"
                              @keypress="onlyNumber"
                            />
                          </div>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col>
                          <div class="input-wrap">
                            <v-text-field v-model="editedItem.email" :label="$t('form.email')" :rules="required" outlined />
                          </div>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col>
                          <div class="input-wrap">
                            <v-text-field v-model="editedItem.job_title" :label="$t('form.job_title')" :rules="required" outlined />
                          </div>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col>
                          <div>
                            <v-checkbox v-model="editedItem.is_primary" label="Is primary contact?" />
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
            </v-container>
            <div class="box-footer">
              <div class="text-right">
                <button
                  v-if="checkAdmin || permissionsUser.indexOf('contact-basic') > -1"
                  class="btn btn-default btn-edit-footer"
                  @click="btnCreate"
                  :disabled=!!planAccess?.lastPlanAccess?.contact>
                  Add Contact Person
                </button>
              </div>
            </div>
          </v-card>
          <v-card width="100%">
            <div class="text-left box-title">
              Attachments
            </div>
            <DocumentPopup
              :open-popup="checkDocumentOpen"
              :resource="false"
              :categories-array="categoriesDocument"
              :category-type="category_type_document"
              :category-added-from="category_added_from"
              :type="document_type"
              :added-from="document_added_from"
              :contact-id="contact_id"
              @closePopup="checkDocumentOpen = !checkDocumentOpen"
              @reloadList="reloadDocument"
              @reloadListCategory="reloadListCategoryDocument"
            />
            <DocumentTable
              :no-filter-setting="true"
              :list-array-input="documents"
              :categories-array="categoriesDocument"
              :category-type="category_type_document"
              :category-added-from="category_added_from"
              @reloadList="reloadDocument"
              @reloadListCategory="reloadListCategoryDocument"
            />
            <div class="box-footer">
              <div class="text-right">
                <button
                  v-if="checkAdmin || permissionsUser.indexOf('contact-basic') > -1"
                  class="btn btn-default btn-edit-footer"
                  @click="checkDocumentOpen = true"
                  :disabled=!!planAccess?.lastPlanAccess?.contact>
                  Add Attachment
                </button>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
  import {_} from 'vue-underscore';
  import cookies from 'js-cookie';
  import ContactPopup from "../../../../components/ContactPopup";
  import DocumentTable from "../../../../components/DocumentTable";
  import DocumentPopup from "../../../../components/DocumentPopup";

  export default {
    components: {
      ContactPopup,
      DocumentTable,
      DocumentPopup,
    },
    data: () => ({
      roleUser: cookies.get('roleUser'),
      userRoleId: parseInt(cookies.get('roleID')),
      userDepartmentID: parseInt(cookies.get('userDepartmentID')),
      checkAdmin: cookies.get('checkAdmin'),
      permissionsUser: localStorage.getItem('permissionsKey'),
      planAccess: JSON.parse(localStorage.getItem('planAccess')),
      contact_id: "",
      search: '',
      dialog: false,
      valid: true,
      contactInfo: {},
      listArray: [],
      editedIndex: -1,
      editedItem: {
        name: '',
        phone_number: '',
        is_primary: false,
        email: '',
        contact_id: "",
      },
      defaultItem: {
        name: '',
        phone_number: '',
        is_primary: false,
        email: '',
        contact_id: "",
      },
      required: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else return true;
        }
      ],
      phoneNumberRule: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else if (!/^((\d{3})+(\s{1})+(\d{2})+(\s{1})+(\d{3})|\d{3})?$/.test(v))
            return 'Phone number must be 8 digits';
          else return true;
        }
      ],
      categoriesArray: [],
      categoriesDocument: [],
      dialogDelete: false,
      documents: [],
      category_type_document: 'attachment',
      category_contact: 'contact',
      category_added_from: 2, // category type: "attachment" & added_from: "contact"
      document_type: 'attachment',
      document_added_from: 'contact',
      // document_added_from: 3, // document added_from: 3. contact
      // file_accept: "image/png, image/jpeg, image/jpg, image/gif, application/pdf, application/msword, " +
      //     "application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, " +
      //     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      openPopup: false,
      checkDocumentOpen: false,
      phoneNumber: '',
    }),

    computed: {
      headers() {
        return  [
          {text: this.translateCol('name'), value: 'name', align: 'left'},
          {text: this.translateCol('phone_number'), value: 'phone_number', align: 'center'},
          {text: this.translateCol('email'), value: 'email', sortable: false, align: 'center'},
          {text: this.translateCol('job_title'), align: 'center', value: 'job_title'},
        ];
      },
      filteredItems() {
        return this.listArray.filter((i) => {
          return i;
        });
      },
      formTitle() {
        return this.editedIndex === -1 ? 'New Personal Contact' : 'Edit Personal Contact';
      },
      // filteredAttachmentItems() {
      //   return this.documents.filter((i) => {
      //     return i.contact_id === this.contactInfo.id;
      //   });
      // },
    },

    watch: {
      dialog(val) {
        val || this.close();
      },

      phoneNumber(value) {
        if (value) {
          this.reformatPhoneNumber();
        }
      },
    },

    mounted() {
      let that = this;
      that.$nextTick(() => {
        that.$nuxt.$loading.start();
        that.contact_id = that.$router.history.current.path.split("/")[4];
        // get contact info
        that.$store.dispatch('contacts/show', that.contact_id).then(result => {
          that.contactInfo = result.data;
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_contact_view_detail'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });

        // list person contact
        that.$store.dispatch('contacts/indexPerson', {contact_id: that.contact_id}).then(result => {
          that.listArray = result.data;
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_contact_person_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });

        // list categories - type "contact"
        that.$store.dispatch('categories/index', {type: that.category_contact}).then(result => {
          that.categoriesArray = result.data;
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          // that.$toaster.error(that.$i18n.t('message.failed'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });

        // list categories DOCUMENT - type "attachment"
        that.$store.dispatch('categories/index', {
          type: that.category_type_document,
          added_from: that.category_added_from
        }).then(result => {
          that.categoriesDocument = result.data;
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          // that.$toaster.error(that.$i18n.t('message.failed'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });

        //Get document list
        that.$store.dispatch('documents/index', {
          type: that.document_type,
          object_type: that.document_added_from,
          object_id: that.contact_id,
        }).then(result => {
          that.documents = result.data;
          _.each(that.documents, function (item) {
            if (item.description) {
              item.description = item.description.replace(/<[^>]+>/g, '');
            }
          });
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
      });
    },

    methods: {
      translateCol (colName) {
        return this.$i18n.t('column.' + colName);
      },

      editItem(item) {
        this.editedIndex = this.listArray.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.phoneNumber = this.editedItem.phone_number;
        this.dialog = true;
      },

      deleteItem(item) {
        const index = this.listArray.findIndex(i => i.id === item.id);
        this.listArray.splice(index, 1);
        this.deletePersonContact(item);
        this.dialogDelete = this.dialog = false;
      },

      deletePersonContact(item) {
        let that = this;
        that.$store.dispatch('contacts/deletePerson', item.id).then(function() {
          that.$toaster.success(that.$i18n.t('message.success_contact_person_delete'));
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_contact_person_delete'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        });
      },

      close() {
        this.dialog = false;
        this.phoneNumber = '';
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
        }, 300);
      },

      save() {
        let that = this;
        if (that.$refs.form.validate()) {
          that.$nuxt.$loading.start();
          that.editedItem.phone_number = that.phoneNumber;
          if (that.editedIndex > -1) {
            if (that.editedItem.is_primary === 1) {
              that.editedItem.is_primary = true;
            }
            that.$store.dispatch('contacts/updatePerson', that.editedItem).then(function () {
              that.reloadContactPersonList();
              that.$toaster.success(that.$i18n.t('message.success_contact_person_update'));
            }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_contact_person_update'));
              }
              // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
              that.$nuxt.$loading.finish();
            });
          } else {
            // create person contact
            that.editedItem.contact_id = that.contact_id;
            that.$store.dispatch('contacts/storePerson',that.editedItem).then(function () {
              that.reloadContactPersonList();
              that.editedItem = that.defaultItem;
              that.$toaster.success(that.$i18n.t('message.success_contact_person_add_new'));
            }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_contact_person_add_new'));
              }
              // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
              that.$nuxt.$loading.finish();
            });
          }
          that.close();
        }
      },

      reloadContactPersonList(){ // reload contact person
        let that = this;
        // get list
        that.$store.dispatch('contacts/indexPerson', {contact_id: that.contact_id}).then(result => {
          that.listArray = result.data;
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_contact_person_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      },

      btnCreate() {
        this.reset();
        this.dialog = true;
      },

      reset() {
        setTimeout(() => {
          this.$refs.form.resetValidation();
        }, 0);
      },

      // dialog DELETE
      closeDelete() {
        this.dialogDelete = false;
      },

      reloadDocument(){ // reload Document list
        let that = this;
        // get list
        that.$store.dispatch('documents/index', {
          type: that.document_type,
          object_type: that.document_added_from,
          object_id: that.contactInfo.id,
        }).then(result => {
          that.documents = result.data;
          _.each(that.documents, function(item){
            if(item.description){
              item.description = item.description.replace(/<[^>]+>/g, '');
            }
          });
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

      reloadContact() {
        let that = this;
        that.$store.dispatch('contacts/show', that.contact_id).then(result => {
          that.contactInfo = result.data;
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_contact_view_detail'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      },

      reloadListCategoryDocument(){
        let that = this;
        that.$store.dispatch('categories/index', {
          type: that.category_type_document,
          added_from: that.category_added_from
        }).then(result => {
          that.categoriesDocument = _.filter(result.data, function (item) {
            return !item.disable_status;
          });
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_category_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      },

      reloadListCategoryContact(){
        let that = this;
        that.$store.dispatch('categories/index', {type: that.category_contact}).then(result => {
          that.categoriesArray = _.filter(result.data, function (item) {
            return !item.disable_status;
          });
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_category_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      },

      onlyNumber(e) {
        if (!(/\d/i.test(e.key))) {
          e.preventDefault();
        }
      },

      reformatPhoneNumber() {
        let that = this;
        if (that.phoneNumber.length === 4 && that.phoneNumber.trim().length !== 3) {
          let str = that.phoneNumber;
          let position = 3;
          let sub = " ";

          that.phoneNumber = str.slice(0, position)  + sub + str.slice(position) ;
        } else if (that.phoneNumber.length === 6) {
          that.phoneNumber = that.phoneNumber + ' ';
        }
      },
    },
  };
</script>

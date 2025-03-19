<template>
  <div>
    <v-dialog v-model="openPopup" max-width="800px" persistent>
      <v-card>
        <v-card-text>
          <div class="popup-header text-center">
            {{ formTitle }}
          </div>
          <v-form
            ref="form"
            v-model="validRole"
            lazy-validation
          >
            <b-row align-h="center">
              <b-col cols="12">
                <div class="input-wrap">
                  <v-text-field
                    v-model="editedRoleItem.name"
                    :label="$t('form.name')"
                    :rules="required"
                    :hide-details="true"
                    disabled
                    outlined
                  />
                </div>
              </b-col>
            </b-row>
            <!--              <b-row>-->
            <!--                <b-col cols="6">-->
            <!--                  <div class="input-wrap">-->
            <!--                    <v-checkbox-->
            <!--                      v-model="addNewLevel"-->
            <!--                      label="Do you want to add a new level?"-->
            <!--                    />-->
            <!--                  </div>-->
            <!--                </b-col>-->
            <!--                <b-col v-if="!addNewLevel" cols="6">-->
            <!--                  <div class="input-wrap">-->
            <!--                    <v-select-->
            <!--                      v-model="editedRoleItem.level"-->
            <!--                      label="Level"-->
            <!--                      :items="levelArray"-->
            <!--                      :rules="required"-->
            <!--                      :disabled="addNewLevel"-->
            <!--                      outlined-->
            <!--                    />-->
            <!--                  </div>-->
            <!--                </b-col>-->
            <!--              </b-row>-->
            <!--            <b-row>-->
            <!--              <b-col>-->
            <!--                <div class="input-wrap">-->
            <!--                  <v-text-field v-model="editedRoleItem.description" label="Description" outlined />-->
            <!--                </div>-->
            <!--              </b-col>-->
            <!--            </b-row>-->
            <b-row>
              <b-col v-if="checkCompanyAdmin">
                <div class="text-noti text-important text-red">
                  *By default, the company administrator has all rights to their company
                </div>
              </b-col>
              <b-col v-else>
                <PermissionTable
                  :role-name-input="editedRoleItem.name"
                  :permissions-data-input="permissionsData"
                  @getPermissionsArray="getPermissionsArray"
                  @getCSPermissionsArray="getCSPermissionsArray"
                />
              </b-col>
            </b-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="popup-footer">
          <v-spacer />
          <v-btn v-if="checkCompanyAdmin" class="btn-cancel" text @click="close">
            Close
          </v-btn>
          <v-btn v-else class="btn-cancel" text @click="close">
            {{ $t('button.cancel') }}
          </v-btn>
          <v-btn v-if="!checkCompanyAdmin" class="btn-save" @click="saveRole">
            {{ $t('button.save') }}
          </v-btn>
<!--          <v-btn v-if="editMode && roleUser === 1" class="hse-btn-save" text @click="addNewNotification = true">-->
<!--            Save and send notification-->
<!--          </v-btn>-->
        </v-card-actions>
      </v-card>
    </v-dialog>

    <SendNotificationPopup
      :open-popup="addNewNotification"
      :feature-id="featureId"
      @afterSendNotification="saveRole"
      @closeSendNotificationPopup="addNewNotification = !addNewNotification"
    />
  </div>
</template>

<script>
// import {_} from 'vue-underscore';
import cookies from 'js-cookie';
import PermissionTable from "./PermissionTable";
import SendNotificationPopup from "./SendNotificationPopup";

export default {
  name: "RolePopup",
  components: {
    PermissionTable,
    SendNotificationPopup,
  },
  props: {
    roleItem: {
      type: Object,
      required: false,
    },
    openPopup: Boolean,
    levelArrayInput: Array,
  },
  data: () => ({
    userRoleId: parseInt(cookies.get('roleID')),
    userDepartmentID: parseInt(cookies.get('userDepartmentID')),
    checkAdmin: cookies.get('checkAdmin'),
    roleUser: cookies.get('roleUser'),
    required: [
      v => {
        if (!v || v.length < 1)
          return 'This is required';
        else return true;
      }
    ],
    rolesArray: [],
    levelArray: [],
    editedRoleItem: {
      name: '',
      description: '',
      level: '',
      addNewLevel: '',
      permission: '',
    },
    defaultRoleItem: {
      name: '',
      description: '',
      level: '',
      addNewLevel: '',
      permission: '',
    },
    validRole: true,
    permissionsKey: [],
    valid: true,
    currentLevel: '',
    addNewLevel: false,
    formTitle: '',
    editMode: true,
    basicPermissionsAttach: [
      'index-category', 'index-project', 'show-project', 'index-department', 'index-employee', 'store-riskanalysis',
      'update-task', 'store-task', 'store-report', 'index-riskanalysis', 'index-task', 'show-task', 'show-riskelementsource',
      'show-checklist', 'index-checklist', 'index-topic', 'index-report', 'show-report', 'index-riskelementsource',
      'store-absence', 'index-absence', 'show-absence', 'update-absence', 'show-riskanalysis', 'index-absencereason',
      'index-role', 'show-employee'
    ],
    permissionsAttach: {
      'update-report': ['show-report'],
      'update-company': ['show-company'],
      'update-goal': ['index-goal', 'show-goal'],
      'update-instruction': ['index-instruction', 'show-instruction'],
      'update-contact': ['index-contact', 'show-contact'],
      'update-employee': ['index-employee', 'show-employee'],
    },
    rolePermission: [],
    addNewNotification: false,
    featureId: 0,
    permissionsData: '',
    permissionsArrayOutput: [],
    csPermissionsArrayOutput: [],
    checkCompanyAdmin: false,
  }),

  watch: {
    openPopup(value) {
      if (value) {
        if (this.roleItem) {
          this.checkCompanyAdmin = this.roleItem.name === "Company admin" && this.roleItem.level === 1;
          this.editItem(this.roleItem);
        } else {
          this.checkCompanyAdmin = false;
          this.addNew();
        }
      }
    },

    levelArrayInput(value) {
      if (value) {
        this.levelArray = value;
      }
    },
  },

  created() {
    if (this.openPopup) {
      if (this.roleItem) {
        this.editItem(this.roleItem);
      } else {
        this.addNew();
      }
    }

    if (this.levelArrayInput.length > 0) {
      this.levelArray = this.levelArrayInput;
    }
  },

  mounted() {
    // let that = this;
    // list job titles
    // that.$store.dispatch('jobTitles/index').then(result => {
    //   that.jobTitleArray = result.data;
    // }).catch((error) => {
    //         if (error.response.status == 401) {
    //         that.$router.push('/login');
    //         that.$toaster.error(that.$i18n.t('message.token_expired'));
    //       }else{
    //   that.$toaster.error(that.$i18n.t('message.fail_job_title_view'));
    //   }
      // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
      // that.$nuxt.$loading.finish();
    // });
  },

  methods: {
    getPermissionsArray(value) {
      this.permissionsArrayOutput = value;
    }, 
    getCSPermissionsArray(value) {
      this.csPermissionsArrayOutput = value;
    },

    addNew() {
      let that = this;
      that.formTitle = that.$i18n.t('title.new_role');
      that.editMode = false;
    },

    async saveRole() {
      let that = this;
      try {
        that.$nuxt.$loading.start();
        //set permission key
        // await that.getPermissionsKey();

        if (that.$refs.form.validate()) {
          that.editedRoleItem.permissionsKey = that.permissionsKey;
          that.editedRoleItem.addNewLevel = that.addNewLevel;
          if (that.editMode) {
            // edit
            that.editedRoleItem.permission = JSON.stringify(that.permissionsArrayOutput);
            if(that.csPermissionsArrayOutput){
              that.updateCSPermission(that.csPermissionsArrayOutput);
              
            }
            that.updateRole();
          }
          that.close();
        }
      } catch {
        that.$toaster.error(that.$i18n.t('message.fail_role_update'));
      }
    },

    updateCSPermission(permissions){
        let that = this;
        that.$nuxt.$loading.start();
            that.$store.dispatch('customerServices/updatePermission',permissions).then(() => {
              that.$nuxt.$loading.finish();
              that.isLoading = false;
            }).catch((error) => {
                if (error.response.status == 401) {
                  that.$router.push('/login');
                  that.$toaster.error(that.$i18n.t('message.token_expired'));
                } else {
                  that.$toaster.error(that.$i18n.t('message.fail_something'));
                }
                that.$nuxt.$loading.finish();
                that.isLoading = false;
            });
      },

    updateRole() {
      let that = this;

      that.$store.dispatch('roles/update', that.editedRoleItem).then(function () {
        that.reloadList();
        that.$toaster.success(that.$i18n.t('message.success_role_update'));
      }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
        that.$toaster.error(that.$i18n.t('message.fail_role_update'));
        }
        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });
    },

    editItem(item) {
      let that = this;
      that.$nuxt.$loading.start();
      that.formTitle = that.$i18n.t('title.edit_role');
      that.editMode = true;
      that.editedRoleItem = Object.assign({}, item);
      that.currentLevel = that.editedRoleItem.level;
      that.$store.dispatch('roles/show', item.id).then(result => {
        // that.permissionsOfRole = result.data.permissions_of_role;
        // that.featureId = item.id;
        // console.log(result.data);
        that.permissionsData = result.data.permission;

        that.$nuxt.$loading.finish();
      }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
        that.$toaster.error(that.$i18n.t('message.fail_role_view_detail'));
        }
        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });
    },

    close() {
      this.reset();
      this.$emit('closePopup');
    },

    reset() {
      setTimeout(() => {
        this.featureId = 0;
        this.addNewLevel = false;
        this.permissionsData = '';
        this.editedRoleItem = Object.assign({}, this.defaultRoleItem);
        this.rolePermission = [];
        this.permissionsKey = [];
        this.permissionsArrayOutput = [];
        this.csPermissionsArrayOutput = [];
        this.$refs.form.resetValidation();
        // this.$refs.form.reset();
      }, 300);
    },

    reloadList() {
      this.$emit('reloadList');
    }
  }
};
</script>

<style scoped>

</style>

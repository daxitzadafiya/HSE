<template>
  <div class="page-company-detail">
    <b-tabs v-model="tabIndex" card lazy>
      <keep-alive v-if="checkAdmin || permissionsUser.indexOf('user permission-view') !== -1">
        <b-tab :title="$t('tab.user_permissions')" name="user-permissions-tab" class="hse-tab-item">
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyUserPermission" />
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-data-table
                  :headers="headersEmployee"
                  :items="filteredEmployeeItems"
                  class="elevation-1 hse-table table-data"
                  :items-per-page="15"
                  :single-expand="true"
                  :search="searchEmployee"
                  :sort-by="['created_at']"
                  :sort-desc="[true, false]"
                  @click:row="editPermissionItem"
                >
                  <template v-slot:top>
                    <div class="setting-header">
                      <div class="panel-heading">
                        <h4 class="panel-title">
                          {{ $t('title.sort_by') }}
                        </h4>
                        <b-row>
                          <b-col cols="6">
                            <div class="field-selection">
                              <v-select
                                v-model="role"
                                :label="$t('setting.role')"
                                item-value="id"
                                :items="rolesSelection"
                                outlined
                                class="text-box"
                              >
                                <template slot="selection" slot-scope="data">
                                  {{ data.item.name }}
                                </template>
                                <template slot="item" slot-scope="data">
                                  {{ data.item.name }}
                                </template>
                              </v-select>
                            </div>
                          </b-col>
                          <b-col cols="6">
                            <div class="field-selection field-search">
                              <v-text-field
                                v-model="searchEmployee"
                                append-icon="search"
                                :label="$t('setting.search')"
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
                      </div>
                    </div>
                  </template>
                  <template v-slot:header="{ props: { headers } }">
                    <h4 class="table-name">
                      {{ $t('table.employees') }}
                    </h4>
                  </template>
                  <template v-slot:item.name="{ item }">
                    {{ item.first_name + ' ' + item.last_name }}
                  </template>
                  <template v-slot:item.role_name="{ item }">
                    {{ formatRoleName(item.role_name) }}
                  </template>
                  <template v-slot:no-data>
                    {{ $t('table.no_data') }}
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-container>
        </b-tab>
      </keep-alive>
    </b-tabs>

    <v-dialog v-model="dialogPermission" max-width="800px" persistent>
      <v-card>
        <v-card-text>
          <div class="popup-header text-center">
            {{ $t('title.update_permission') }}
          </div>
          <v-form
            ref="form"
            v-model="validPermission"
            lazy-validation
          >
            <b-row align-h="center">
              <b-col cols="6">
                <div class="input-wrap">
                  <v-text-field v-model="editedPermissionItem.name" :label="$t('form.name')" :rules="required" disabled outlined />
                </div>
              </b-col>
              <b-col v-if="checkCompanyAdmin" cols="6">
                <div class="input-wrap">
                  <v-text-field v-model="editedPermissionItem.role_name" :label="$t('form.role')" :rules="required" disabled outlined />
                </div>
              </b-col>
              <b-col v-else cols="6">
                <div class="input-wrap">
                  <v-text-field v-model="editedPermissionItem.job_title_name" :label="$t('form.job_title')" :rules="required" disabled outlined />
                </div>
              </b-col>
            </b-row>
            <b-row v-if="checkCompanyAdmin">
              <b-col>
                <div class="text-noti text-important text-red">
                  {{ $t('form.default_company_administrator_has_all_rights') }}
                </div>
              </b-col>
            </b-row>
            <b-row v-else>
              <b-col cols="6" class="mb-7">
                <div class="input-wrap d-flex">
                  <v-checkbox
                    v-model="editedPermissionItem.is_super"
                    :label="$t('form.is_this_super_user')"
                    class="margin-right-sm mt-0"
                    :hide-details="true"
                  />
<!--                  <v-badge-->
<!--                    :value="hoverQuestionMark"-->
<!--                    right-->
<!--                    transition="slide-x-transition"-->
<!--                    class="hse&#45;&#45;icon-question-circle"-->
<!--                    :content="$t('message.add_extended_permissions')"-->
<!--                  >-->
<!--                    <v-hover v-model="hoverQuestionMark">-->
<!--                      <i class="fa fa-question-circle"></i>-->
<!--                    </v-hover>-->
<!--                  </v-badge>-->
                </div>
              </b-col>
              <b-col cols="6" class="mb-7">
                <v-checkbox
                  v-model="editedPermissionItem.assign_group"
                  :label="$t('form.is_assign_group')"
                  class="margin-right-sm mt-0"
                  :hide-details="true"
                />
              </b-col>
              <b-col cols="12">
                <PermissionTable
                  :permissions-data-input="permissionsData"
                  :role-name-input="editedPermissionItem.role_name"
                  @getPermissionsArray="getPermissionsArray"
                />
              </b-col>
            </b-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="popup-footer">
          <v-spacer />
          <v-btn v-if="!checkAdmin" class="btn-cancel" text @click="close">
            {{ $t('button.close') }}
          </v-btn>
          <v-btn v-else class="btn-cancel" text @click="close">
            {{ $t('button.cancel') }}
          </v-btn>
          <v-btn v-if="checkAdmin" class="btn-save" @click="savePermission">
            {{ $t('button.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import cookies from "js-cookie";
import {_} from "vue-underscore";
import TitleCaption from "../../../components/TitleCaption";
import PermissionTable from "../../../components/PermissionTable";

export default {
  components: {
    TitleCaption,
    PermissionTable,
  },

  data: () => ({
    userRoleId: parseInt(cookies.get('roleID')),
    userDepartmentID: parseInt(cookies.get('userDepartmentID')),
    checkAdmin: cookies.get('checkAdmin'),
    roleUser: cookies.get('roleUser'),
    permissionsUser: localStorage.getItem('permissionsKey'),
    pageKeyUserPermission: 'company-company-user-permissions',
    tabIndex: 0,
    //permissions tab
    employeesArray: [],
    listEmployeeWithoutAdmin: [],
    searchEmployee: '',
    dialogPermission: false,
    validPermission: true,
    editedPermissionItem: {
      user_name: '',
      job_title_name: '',
      job_title_id: '',
      role_name: '',
      permission: '',
      is_super: '',
      assign_group: '',
    },
    editedPermissionDefaultItem: {
      user_name: '',
      job_title_name: '',
      job_title_id: '',
      role_name: '',
      permission: '',
      is_super: '',
      assign_group: '',
    },
    rolesArray: [], // list roles (all roles)
    levelArray: [],
    role: 0,
    rolesSelection: [],
    dataRoleDefault: {
      id: 0,
      name: "All",
    },
    permissions: [],
    checkCompanyAdmin: false,
    hoverQuestionMark: false,
    permissionsData: '',
    permissionsArrayOutput: [],
    required: [
      v => {
        if (!v || v.length < 1)
          return 'This is required';
        else return true;
      }
    ],
  }),

  computed: {
    headersEmployee() {
      return [
        {text: this.translateCol('name'), value: 'name', align: 'left'},
        {text: this.translateCol('department'), value: 'department_name', align: 'left'},
        {text: this.translateCol('role'), value: 'role_name', align: 'left'},
        {text: this.translateCol('job_title'), value: 'job_title_name', align: 'left'},
      ];
    },

    filteredEmployeeItems() {
      let that = this;
      return that.employeesArray.filter((i) => {
        return (that.role === 0 || (i.role_id === that.role));
      });
    },
  },

  watch: {

  },


  mounted() {
    let that = this;
    that.$nextTick(() => {
      that.$nuxt.$loading.start();
      // list roles
      that.$store.dispatch('roles/index').then(result => {
        that.rolesArray = result.data;
        that.rolesSelection = _.clone(result.data);
        that.rolesSelection.push(that.dataRoleDefault);
        that.rolesSelection.sort(function (a, b) {
          return (a.id - b.id);
        });
      }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
        that.$toaster.error(that.$i18n.t('message.fail_role_view'));
        }
        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });

      // list employees
      that.$store.dispatch('employees/index').then(result => {
        that.employeesArray = _.each(result.data, function(i) {
          if (i.department_name) {
            i.name = i.name + ' - ' + i.department_name;
          }
        });
        that.$nuxt.$loading.finish();
      }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
        that.$toaster.error(that.$i18n.t('message.fail_employee_view'));

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

    formatRoleName(name) {
      if (name === 'Company admin') {
        return this.$i18n.t('form.company_admin');
      } else if (name === 'Manager') {
        return this.$i18n.t('form.manager');
      } else if (name === 'User') {
        return this.$i18n.t('form.user');
      }
    },

    editPermissionItem(item) {
      let that = this;
      that.checkCompanyAdmin = item.role_name === 'Company admin' && item.role_level === 1;
      // if (that.checkAdmin) {
      //   that.$nuxt.$loading.start();
      //   that.editedPermissionItem = Object.assign({}, item);
      //   that.dialogPermission = true;
      //   that.$nuxt.$loading.finish();
      // }
      that.$nuxt.$loading.start();
      if (that.checkCompanyAdmin) {
        that.editedPermissionItem = Object.assign({}, item);
        that.dialogPermission = true;
        that.$nuxt.$loading.finish();
      } else {
        that.$store.dispatch('userPermissions/show', item.id).then(result => {
          that.editedPermissionItem = Object.assign({}, result.data);
          that.editedPermissionItem.name = that.editedPermissionItem.first_name + ' ' + that.editedPermissionItem.last_name;
          that.editedPermissionItem.role_name = item.role_name;
          that.permissionsData = that.editedPermissionItem.permission;
          that.dialogPermission = true;
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_user_permission_view_detail'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      }
    },

    savePermission() {
      let that = this;
      if (that.$refs.form.validate()) {
        that.$nuxt.$loading.start();
        if (that.permissionsArrayOutput.length > 0) {
          that.editedPermissionItem.permission = JSON.stringify(that.permissionsArrayOutput);
        }
        that.$store.dispatch('userPermissions/update', that.editedPermissionItem).then(function () {
          that.reloadList();
          that.$toaster.success(that.$i18n.t('message.success_user_permission_update'));
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_user_permission_update'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
        that.close();
      }
    },

    getPermissionsArray(value) {
      this.permissionsArrayOutput = value;
    },

    reloadList() {
      let that = this;
      // list employees
      that.$store.dispatch('employees/index').then(result => {
        that.employeesArray = _.each(result.data, function(i) {
          if (i.department_name) {
            i.name = i.name + ' - ' + i.department_name;
          }
        });
        that.$nuxt.$loading.finish();
      }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
        that.$toaster.error(that.$i18n.t('message.fail_employee_view'));
        }
        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });
    },

    close() {
      this.dialogPermission = false;
      setTimeout(() => {
        this.permissionsArrayOutput = [];
        this.permissionsData = '';
        this.editedPermissionItem = Object.assign({}, this.editedPermissionDefaultItem);
        this.$refs.form.resetValidation();
      }, 300);
    },
  }

};
</script>

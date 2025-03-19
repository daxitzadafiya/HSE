<template>
  <div>
    <h4 class="title-manage-task mt-4">
      {{ $t('title.permissions') }}
    </h4>
    <div v-if="roleName === 'Manager'">
      <v-simple-table dense class="permissions-section-table" fixed-header height="425px">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">
                {{ $t('column.name') }}
              </th>
              <th class="text-center">
                {{ $t('column.view_list') }}
              </th>
              <th class="text-center">
                {{ $t('column.view_detail') }}
              </th>
              <th class="text-center">
                {{ $t('column.basic_management') }}
              </th>
              <th class="text-center">
                {{ $t('column.resource_management') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, i) in userPermissions">
              <tr v-if="item.process_type === 'unknown'" :key="`item-${i}`">
                <td class="text-capitalize">{{ item.name }}</td>
                <td v-if="item.view_type === 'boolean'" class="text-center">
                  <v-checkbox v-model="item.view_value" :disabled="item.view_disable" @change="updatePermission" />
                </td>
                <td v-else class="text-center">N/A</td>
                <td v-if="item.detail_type === 'boolean'" class="text-center">
                  <v-checkbox v-model="item.detail_value" :disabled="item.detail_disable" @change="updatePermission" />
                </td>
                <td v-else class="text-center">N/A</td>
                <td v-if="item.basic_type === 'boolean'" class="text-center">
                  <v-checkbox v-model="item.basic_value" :disabled="item.basic_disable" @change="updatePermission" />
                </td>
                <td v-else class="text-center">N/A</td>
                <td v-if="item.resource_type === 'boolean'" class="text-center">
                  <v-checkbox v-model="item.resource_value" :disabled="item.resource_disable" @change="updatePermission" />
                </td>
                <td v-else class="text-center">N/A</td>
              </tr>
            </template>
          </tbody>
        </template>
      </v-simple-table>
      <br />
      <br />
      <h4 class="title-manage-task mt-4">
<!--        {{ $t('title.permissions') }}-->
        {{ $t('title.advanced_permissions') }}
      </h4>
      <v-simple-table dense class="permissions-section-table">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">
                {{ $t('column.name') }}
              </th>
              <th class="text-center">
                {{ $t('column.view_list') }}
              </th>
              <th class="text-center">
                {{ $t('column.view_detail') }}
              </th>
              <th class="text-center">
                {{ $t('column.basic_management') }}
              </th>
              <th class="text-center">
                {{ $t('column.process') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, i) in userPermissions">
              <tr v-if="item.process_type === 'boolean'" :key="`item-${i}`">
                <td class="text-capitalize">{{ item.name }}</td>
                <td v-if="item.view_type === 'boolean'" class="text-center">
                  <v-checkbox v-model="item.view_value" :disabled="item.view_disable" @change="updatePermission" />
                </td>
                <td v-else class="text-center">N/A</td>
                <td v-if="item.detail_type === 'boolean'" class="text-center">
                  <v-checkbox v-model="item.detail_value" :disabled="item.detail_disable" @change="updatePermission" />
                </td>
                <td v-else class="text-center">N/A</td>
                <td v-if="item.basic_type === 'boolean'" class="text-center">
                  <v-checkbox v-model="item.basic_value" :disabled="item.basic_disable" @change="updatePermission" />
                </td>
                <td v-else class="text-center">N/A</td>
                <td v-if="item.process_type === 'boolean'" class="text-center">
                  <v-checkbox v-model="item.process_value" :disabled="item.process_disable" @change="updatePermission" />
                </td>
                <td v-else class="text-center">N/A</td>
              </tr>
            </template>
          </tbody>
        </template>
      </v-simple-table>
    </div>

    <v-simple-table v-else-if="roleName === 'User'" dense class="permissions-section-table" fixed-header height="425px">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">
              {{ $t('column.name') }}
            </th>
            <th class="text-center">
              {{ $t('column.view_list') }}
            </th>
            <th class="text-center">
              {{ $t('column.view_detail') }}
            </th>
            <th class="text-center">
              {{ $t('column.basic_management') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, i) in userPermissions"
            :key="`item-${i}`"
          >
            <td class="text-capitalize">{{ item.name }}</td>
            <td v-if="item.view_type === 'boolean'" class="text-center">
              <v-checkbox v-model="item.view_value" :disabled="item.view_disable" @change="updatePermission" />
            </td>
            <td v-else class="text-center">N/A</td>
            <td v-if="item.detail_type === 'boolean'" class="text-center">
              <v-checkbox v-model="item.detail_value" :disabled="item.detail_disable" @change="updatePermission" />
            </td>
            <td v-else class="text-center">N/A</td>
            <td v-if="item.basic_type === 'boolean'" class="text-center">
              <v-checkbox v-model="item.basic_value" :disabled="item.basic_disable" @change="updatePermission" />
            </td>
            <td v-else class="text-center">N/A</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <v-simple-table v-else-if="roleName === 'Customer service'" dense class="permissions-section-table" fixed-header height="425px">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">
              {{ $t('column.modules') }}
            </th>
            <th class="text-center">
              {{ $t('column.access') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, i) in csPermissionData"
            :key="`item-${i}`"
          >
            <td class="text-capitalize">{{ item.module }}</td>
            <td  class="text-center">
              <v-checkbox v-model="item.is_enabled"  @change="updatePermissionCS"/>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>


  </div>
</template>

<script>
  import {_} from 'vue-underscore';

  export default {
    name: "PermissionTable",
    components: {
      // MultipleSelection
    },
    props: {
      permissionsDataInput: {
        type: String,
        required: true,
      },
      // jobTitleId: {
      //   type: Number,
      //   required: false,
      // },
      roleNameInput: {
        type: String,
        required: false,
      },
    },
    data:() => ({
      permissionsArray: [],
      tableTitle: '',
      managerPermissions: [],
      userPermissions: [],
      hiddenPermissions: [],
      permissionsData: [],
      csPermissionData: [],
      roleName: '',
      checkManager: false,
      userLocation: ['goal', 'routine', 'instruction', 'contact', 'document', 'risk area', 'checklist', 'deviation', 'risk analysis', 'task', 'report checklist'],
      managerLocation: ['employee', 'contact', 'category', 'department', 'job title', 'user permission', 'statement', 'goal', 'routine', 'instruction', 'document', 'risk area', 'checklist', 'deviation', 'risk analysis', 'task', 'report checklist'],
    }),

    watch: {
      roleNameInput: {
        handler: 'getRoleName',
        immediate: true,
      },

      permissionsDataInput: {
        handler: 'getPermissionData',
        immediate: true,
      },
    },

    created() {
      if (this.permissionsDataInput) {
        this.permissionsData = this.permissionsDataInput;
      }

      if (this.roleItem) {
        this.roleName = this.roleItem.name;
      }

    },

    mounted() {
      this.getCustomerServicePermission();
    },

    methods: {
      getRoleName() {
        if (this.roleNameInput) {
          this.roleName = this.roleNameInput;
          this.checkManager = this.roleName === 'Manager';
        } else {
          this.roleName = '';
        }
      },

      getPermissionData() {
        if (this.permissionsDataInput) {
          this.permissionsData = this.permissionsDataInput;
          this.generatePermissionData();
          this.updatePermission();
        } else {
          this.permissionsData = '';
          this.reset();
        }
      },

      updatePermission() {
        let that = this;
        that.permissionsArray = [];

        if (that.roleName === 'Manager') {
          _.each(that.userPermissions, function (func){
            let functionItem = {
              'name': func.name,
              'show' : true,
              'userPermission': [],
            };


            if (func.basic_type) {
              functionItem.userPermission.push(
                {
                  'name': 'basic',
                  'type': func.basic_type,
                  'value': func.basic_value,
                  'apply': func.basic_apply,
                  'disable': func.basic_disable,
                }
              );
            }

            if (func.detail_type) {
              functionItem.userPermission.push(
                {
                  'name': 'detail',
                  'type': func.detail_type,
                  'value': func.detail_value,
                  'apply': func.detail_apply,
                  'disable': func.detail_disable,
                }
              );
            }

            if (func.process_type) {
              functionItem.userPermission.push(
                {
                  'name': 'process',
                  'type': func.process_type,
                  'value': func.process_value,
                  'apply': func.process_apply,
                  'disable': func.process_disable,
                }
              );
            }

            if (func.resource_type) {
              functionItem.userPermission.push(
                {
                  'name': 'resource',
                  'type': func.resource_type,
                  'value': func.resource_value,
                  'apply': func.resource_apply,
                  'disable': func.resource_disable,
                }
              );
            }

            if (func.view_type) {
              functionItem.userPermission.push(
                {
                  'name': 'view',
                  'type': func.view_type,
                  'value': func.view_value,
                  'apply': func.view_apply,
                  'disable': func.view_disable,
                }
              );
            }

            that.permissionsArray.push(functionItem);

          });
          _.each(that.hiddenPermissions, function (func){
            let functionItem = {
              'name': func.name,
              'show' : false,
              'userPermission': [],
            };


            if (func.basic_type) {
              functionItem.userPermission.push(
                {
                  'name': 'basic',
                  'type': func.basic_type,
                  'value': func.basic_value,
                  'apply': func.basic_apply,
                  'disable': func.basic_disable,
                }
              );
            }

            if (func.detail_type) {
              functionItem.userPermission.push(
                {
                  'name': 'detail',
                  'type': func.detail_type,
                  'value': func.detail_value,
                  'apply': func.detail_apply,
                  'disable': func.detail_disable,
                }
              );
            }

            if (func.process_type) {
              functionItem.userPermission.push(
                {
                  'name': 'process',
                  'type': func.process_type,
                  'value': func.process_value,
                  'apply': func.process_apply,
                  'disable': func.process_disable,
                }
              );
            }

            if (func.resource_type) {
              functionItem.userPermission.push(
                {
                  'name': 'resource',
                  'type': func.resource_type,
                  'value': func.resource_value,
                  'apply': func.resource_apply,
                  'disable': func.resource_disable,
                }
              );
            }

            if (func.view_type) {
              functionItem.userPermission.push(
                {
                  'name': 'view',
                  'type': func.view_type,
                  'value': func.view_value,
                  'apply': func.view_apply,
                  'disable': func.view_disable,
                }
              );
            }

            that.permissionsArray.push(functionItem);

          });
        } else if (that.roleName === 'User') {
          _.each(that.userPermissions, function (func){
            let functionItem = {
              'name': func.name,
              'show' : true,
              'userPermission': [],
            };

            if (func.basic_type) {
              functionItem.userPermission.push(
                {
                  'name': 'basic',
                  'type': func.basic_type,
                  'value': func.basic_value,
                  'apply': func.basic_apply,
                  'disable': func.basic_disable,
                }
              );
            }

            if (func.detail_type) {
              functionItem.userPermission.push(
                {
                  'name': 'detail',
                  'type': func.detail_type,
                  'value': func.detail_value,
                  'apply': func.detail_apply,
                  'disable': func.detail_disable,
                }
              );
            }

            if (func.view_type) {
              functionItem.userPermission.push(
                {
                  'name': 'view',
                  'type': func.view_type,
                  'value': func.view_value,
                  'apply': func.view_apply,
                  'disable': func.view_disable,
                }
              );
            }
            that.permissionsArray.push(functionItem);
          });
          _.each(that.hiddenPermissions, function (func){
            let functionItem = {
              'name': func.name,
              'show' : false,
              'userPermission': [],
            };

            if (func.basic_type) {
              functionItem.userPermission.push(
                {
                  'name': 'basic',
                  'type': func.basic_type,
                  'value': func.basic_value,
                  'apply': func.basic_apply,
                  'disable': func.basic_disable,
                }
              );
            }

            if (func.detail_type) {
              functionItem.userPermission.push(
                {
                  'name': 'detail',
                  'type': func.detail_type,
                  'value': func.detail_value,
                  'apply': func.detail_apply,
                  'disable': func.detail_disable,
                }
              );
            }

            if (func.view_type) {
              functionItem.userPermission.push(
                {
                  'name': 'view',
                  'type': func.view_type,
                  'value': func.view_value,
                  'apply': func.view_apply,
                  'disable': func.view_disable,
                }
              );
            }
            that.permissionsArray.push(functionItem);
          });
        }
        // console.log('permissionsArray: ', that.permissionsArray);

        that.getPermissionsArray();
      },

      getPermissionsArray() {
        let that = this;
        // console.log(that.permissionsArray);
        that.$emit('getPermissionsArray', that.permissionsArray);
      },

      updatePermissionCS(){
        this.$emit('getCSPermissionsArray', this.csPermissionData);
      },

      getCustomerServicePermission(){
        let that = this;
        that.$nuxt.$loading.start();
            that.$store.dispatch('customerServices/permissions').then((res) => {
              that.csPermissionData = res.data;
              that.$nuxt.$loading.finish();
              that.isLoading = false;
              that.$emit('getCSPermissionsArray', that.csPermissionData);
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

      generatePermissionData() {
        let that = this;
        this.$nuxt.$loading.start();
        that.reset();
        that.permissionsData = JSON.parse(that.permissionsData);

        let functionLocation = [];
        if (that.roleName === 'Manager') {
          functionLocation = that.managerLocation;
        } else if (this.roleName === 'User') {
          functionLocation = that.userLocation;
        }
        if (that.permissionsData.length > 0) {
          _.each(that.permissionsData, function (item) {
            let location = _.indexOf(functionLocation, item.name );
            if (location > -1) {
              item.location = location;
            }
          });
          that.permissionsData = _.sortBy(that.permissionsData, 'location');
          that.setPermission(that.permissionsData);
        } else {
          that.$store.dispatch('permissionsFormat/index', {filterBy: that.roleName}).then(result => {
            that.permissionsData = result.data;
            _.each(that.permissionsData, function (item) {
              let location = _.indexOf(functionLocation, item.function );
              if (location > -1) {
                item.location = location;
              }
            });
            that.permissionsData = _.sortBy(that.permissionsData, 'location');
            // that.permissionsData = _.sortBy(result.data, 'function');
            that.permissionsData = _.groupBy(that.permissionsData, function (funcItem) {
              return funcItem.function;
            });
            // console.log(that.permissionsData);
            if (!_.isEmpty(that.permissionsData)) {
              that.getPermission(that.permissionsData);
            } else {
              that.$nuxt.$loading.finish();
            }
          }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_permission_view'));
          }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish();
          });
        }
      },

      setPermission(permissionsData) {
        let that = this;
        _.each(permissionsData, function (func) {
          if (!_.isEmpty(func.userPermission)) {
            that.setPermissionDetail(func.userPermission, func.name, func.show);
          }

          // if (!_.isEmpty(func.managerPermission)) {
          //   that.setPermissionDetail(func.managerPermission, 'manager', func.name);
          // }
        });
      },

      setPermissionDetail(permissionArray, functionName, functionShow) {
        let that = this;
        let permissionsByFunction = {
          name: '',
          view_apply: '',
          view_disable: '',
          view_type: '',
          view_value: '',
          detail_apply: '',
          detail_disable: '',
          detail_type: '',
          detail_value: '',
          basic_apply: '',
          basic_disable: '',
          basic_type: '',
          basic_value: '',
          resource_apply: '',
          resource_disable: '',
          resource_type: '',
          resource_value: '',
          process_apply: '',
          process_disable: '',
          process_type: '',
          process_value: '',
        };
        permissionsByFunction.name = functionName;

        _.each(permissionArray, function(permission) {
          if (permission.name === 'view') {
            permissionsByFunction.view_apply = permission.apply;
            permissionsByFunction.view_disable = permission.disable;
            permissionsByFunction.view_type = permission.type;
            permissionsByFunction.view_value = permission.value;
          } else if (permission.name === 'detail') {
            permissionsByFunction.detail_apply = permission.apply;
            permissionsByFunction.detail_disable = permission.disable;
            permissionsByFunction.detail_type = permission.type;
            permissionsByFunction.detail_value = permission.value;
          } else if (permission.name === 'basic') {
            permissionsByFunction.basic_apply = permission.apply;
            permissionsByFunction.basic_disable = permission.disable;
            permissionsByFunction.basic_type = permission.type;
            permissionsByFunction.basic_value = permission.value;
          } else if (permission.name === 'resource') {
            permissionsByFunction.resource_apply = permission.apply;
            permissionsByFunction.resource_disable = permission.disable;
            permissionsByFunction.resource_type = permission.type;
            permissionsByFunction.resource_value = permission.value;
          } else if (permission.name === 'process') {
            permissionsByFunction.process_apply = permission.apply;
            permissionsByFunction.process_disable = permission.disable;
            permissionsByFunction.process_type = permission.type;
            permissionsByFunction.process_value = permission.value;
          }
        });

        if (functionShow) {
          that.userPermissions.push(permissionsByFunction);
        } else {
          that.hiddenPermissions.push(permissionsByFunction);
        }

        this.$nuxt.$loading.finish();
      },

      getPermission(permissionsData) {
        let that = this;
        _.each(permissionsData, function (permissions, functionName) {
          that.getPermissionDetail(permissions, functionName);
        });

        // console.log('userPermissions: ', that.userPermissions);
        // console.log('hiddenPermissions: ', that.hiddenPermissions);
      },

      getPermissionDetail(permissionArray, functionName) {
        let that = this;
        let permissionsByFunction = {
          name: '',
          show: '',
          view_apply: '',
          view_disable: '',
          view_type: '',
          view_value: '',
          detail_apply: '',
          detail_disable: '',
          detail_type: '',
          detail_value: '',
          basic_apply: '',
          basic_disable: '',
          basic_type: '',
          basic_value: '',
          resource_apply: '',
          resource_disable: '',
          resource_type: '',
          resource_value: '',
          process_apply: '',
          process_disable: '',
          process_type: '',
          process_value: '',
        };
        permissionsByFunction.name = functionName;
        let boolDefaultValue = false;
        // boolDefaultValue = that.checkManager && permissionType === 'user';

        let view_position = _.find(permissionArray, function (item) {
          return item.permission_name === 'view';
        });
        if (view_position !== undefined) {
          permissionsByFunction.show = view_position.show === 1;
          permissionsByFunction.view_apply = view_position.permission_apply;
          permissionsByFunction.view_disable = view_position.permission_disable === 1;
          permissionsByFunction.view_type = view_position.permission_type;
          if (permissionsByFunction.view_disable && permissionsByFunction.view_type === 'boolean') {
            permissionsByFunction.view_value = true;
          } else {
            permissionsByFunction.view_value = boolDefaultValue;
          }
        }
        let detail_position = _.find(permissionArray, function (item) {
          return item.permission_name === 'detail';
        });
        if (detail_position !== undefined) {
          permissionsByFunction.detail_apply = detail_position.permission_apply;
          permissionsByFunction.detail_disable = detail_position.permission_disable === 1;
          permissionsByFunction.detail_type = detail_position.permission_type;
          if (permissionsByFunction.detail_disable && permissionsByFunction.detail_type === 'boolean') {
            permissionsByFunction.detail_value = true;
          } else {
            permissionsByFunction.detail_value = boolDefaultValue;
          }
        }
        let basic_position = _.find(permissionArray, function (item) {
          return item.permission_name === 'basic';
        });
        if (basic_position !== undefined) {
          permissionsByFunction.basic_apply = basic_position.permission_apply;
          permissionsByFunction.basic_disable = basic_position.permission_disable === 1;
          permissionsByFunction.basic_type = basic_position.permission_type;
          if (permissionsByFunction.basic_disable && permissionsByFunction.basic_type === 'boolean') {
            permissionsByFunction.basic_value = true;
          } else {
            permissionsByFunction.basic_value = boolDefaultValue;
          }
        }
        let resource_position = _.find(permissionArray, function (item) {
          return item.permission_name === 'resource';
        });
        if (resource_position !== undefined) {
          permissionsByFunction.resource_apply = resource_position.permission_apply;
          permissionsByFunction.resource_disable = resource_position.permission_disable === 1;
          permissionsByFunction.resource_type = resource_position.permission_type;
          if (permissionsByFunction.resource_disable && permissionsByFunction.resource_type === 'boolean') {
            permissionsByFunction.resource_value = true;
          } else {
            permissionsByFunction.resource_value = boolDefaultValue;
          }
        }
        let process_position = _.find(permissionArray, function (item) {
          return item.permission_name === 'process';
        });
        if (process_position !== undefined) {
          permissionsByFunction.process_apply = process_position.permission_apply;
          permissionsByFunction.process_disable = process_position.permission_disable === 1;
          permissionsByFunction.process_type = process_position.permission_type;
          if (permissionsByFunction.process_disable && permissionsByFunction.process_type === 'boolean') {
            permissionsByFunction.process_value = true;
          } else {
            permissionsByFunction.process_value = boolDefaultValue;
          }
        }

        if (permissionsByFunction.show) {
          that.userPermissions.push(permissionsByFunction);
        } else {
          that.hiddenPermissions.push(permissionsByFunction);
        }

        this.$nuxt.$loading.finish();
      },

      reset() {
        this.managerPermissions = [];
        this.userPermissions = [];
        this.hiddenPermissions = [];
        this.permissionsArray = [];
      },
    }
  }
</script>

<style scoped>

</style>

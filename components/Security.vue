<template>
  <div>
    <b-row v-if="!securityItem.is_shared || roleUser === 'user'">
      <b-col cols="2" class="hse-document-badge-tab">
        <div class="bold-title md-line-height">
          {{ isInstructionObject ? $t('title.view') : $t('title.security') }}
        </div>
        <v-badge
          :value="hover"
          right
          transition="slide-x-transition"
          class="hse-badge-icon  view-badge"
          :class="isInstructionObject ? 'hse-badge-icon-small' : 'hse-badge-icon'"
        >
          <span slot="badge">{{ $t('message.hover_security') }}</span>
          <v-hover v-model="hover">
            <i class="fa fa-question-circle"></i>
          </v-hover>
        </v-badge>
      </b-col>
      <b-col cols="4">
        <div class="input-wrap">
          <div class="switch-component default-question-mark">
            <label class="left-text">{{ $t('form.personal') }}</label>
            <v-switch
              v-model="securityItem.is_shared"
              :label="$t('form.shared')"
              inset
              class="right-text"
              @change="changeSecurity('shared')"
            />
          </div>
        </div>
      </b-col>
    </b-row>
    <div v-else class="section-connect-to mt-5">
      <div class="section-connect-to-label section-connect-to-label-reminder">
        {{ isInstructionObject ? $t('title.view') : $t('title.security') }}
      </div>
      <div class="switch-component switch-component-small default-question-mark">
        <label class="left-text">{{ $t('form.personal') }}</label>
        <v-switch
          v-model="securityItem.is_shared"
          :label="$t('form.shared')"
          inset
          class="right-text"
          @change="changeSecurity('personal')"
        />
      </div>
      <!-- Security - Choose viewable employees -->
      <b-row v-if="checkAdmin || (!checkAdmin && editMode && securityItem.updated_by !== null || securityItem.updated_at !== null)" class="pt-3 mt-3">
        <b-col cols="12">
          <div class="d-inline-flex">
            <v-radio-group
              v-model="share_option"
              :rules="required"
              row
              class="hse-radio-checkbox"
            >
              <v-radio
                v-for="option in options"
                :key="option.value"
                :label="option.name"
                :value="option.value"
                @change="changeOption(option.value)"
              />
            </v-radio-group>
          </div>
        </b-col>
      </b-row>
      <b-row v-else class="pt-3 mt-3"></b-row>
      <div v-if="share_option === 2">
        <b-row>
          <!-- DEPARTMENT -->
          <b-col>
            <div class="input-wrap industry-select-input-wrap">
              <MultipleSelection
                :item="securityItem"
                :selected-items-input="securityItem.department_array"
                :label="$t('form.department')"
                :item-text="'name'"
                :item-value="'id'"
                :list-option-input="securityDepartments"
                @getSelectedItems="getSelectedDepartureItems"
              />
            </div>
          </b-col>
          <!-- EMPLOYEES -->
          <b-col>
            <div class="input-wrap industry-select-input-wrap">
              <MultipleSelection
                :item="securityItem"
                :selected-items-input="securityItem.employee_array"
                :label="$t('form.employees')"
                :item-text="'name'"
                :item-value="'id'"
                :request-required="true"
                :list-option-input="securityEmployees"
                @getSelectedItems="getSelectedEmployeesItems"
              />
            </div>
          </b-col>
        </b-row>
      </div>
    </div>
  </div>
</template>
<script>
  import {_} from 'vue-underscore';
  import cookies from 'js-cookie';
  import MultipleSelection from "./MultipleSelection";

  export default {
    name: "Security",
    components: {
      MultipleSelection,
    },
    props: {
      securityItem: {
        type: Object,
        required: false,
      },
      editMode: {
        type: Boolean,
        required: false,
      },
      denyEdit: {
        type: Boolean,
        required: false,
      },
      isInstructionObject: {
        type: Boolean,
        required: false,
      },
    },
    data: () => ({
      checkAdmin: cookies.get('checkAdmin'),
      roleUser: cookies.get('roleUser'),
      permissionsUser: localStorage.getItem('permissionsKey'),
      userLogged: parseInt(cookies.get('userID')),
      required: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else return true;
        }
      ],
      departmentArray: [],
      securityDepartments: [],
      share_option: 1,
      options: [
        {
          value: 1,
          name: "All"
        }, {
          value: 2,
          name: "Custom"
        }
      ],
      employeeArray: [],
      securityEmployees: [],
      hover: false,
      checkChangeSecurity: 0,
    }),

    watch: {
      securityItem(value) {
        if (value) {
          if (this.editMode) {
            this.editItem(this.securityItem);
          } else {
            this.addNew();
          }
        }
      },
    },

    mounted() {
      let that = this;
      that.$nuxt.$loading.start();
      // list department
      that.$store.dispatch('departments/index').then(result => {
        that.departmentArray = _.filter(result.data, function (item) {
          return item.disable_status === 0;
        });
        that.securityDepartments = _.clone(that.departmentArray);
      }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
        that.$toaster.error(that.$i18n.t('message.fail_department_view'));
        }
        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });

      // list employees
      that.$store.dispatch('employees/index').then(result => {
        _.each(result.data, function(i) {
          i.name = i.name + ' - ' + i.department_name;
        });
        that.employeeArray = _.filter(result.data, function (item) {
          return item.role_id !== 2 && !item.disable_status;
        });
        that.securityEmployees = _.clone(that.employeeArray);
        that.$nuxt.$loading.finish();
      }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
        that.$toaster.error(that.$i18n.t('message.fail_employee_view'));
        }
        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });
    },

    created() {},

    methods: {
      changeSecurity(val) {
        this.securityItem.is_public = (val === 'shared' && this.share_option === 1) || val === 'all';
        this.checkChangeSecurity = this.checkChangeSecurity + 1;
        this.$emit('changeSecurity', {
          condition: val,
          countChange: this.checkChangeSecurity
        });
      },

      addNew() {
        if (this.checkAdmin) {
          this.share_option = 1;
        } else {
          this.share_option = 2;
        }
      },

      editItem(item) {
        if (item.is_public) {
          this.share_option = 1;
        } else {
          this.share_option = 2;
        }
        return item;
      },

      changeOption(option) {
        if (option !== this.share_option) {
          this.securityItem.department_array = [];
          this.securityItem.employee_array = [];
          if (option === 1) {
            this.securityItem.is_public = true;
            this.changeSecurity('all');
          } else {
            this.securityItem.is_public = false;
            this.changeSecurity('custom');
          }
        }
      },

      getSelectedDepartureItems(value) {
        this.securityItem.department_array = value.selectedItemsOutput;
        this.filterSecurityEmployees();
        this.changeSecurity('department');
      },

      getSelectedEmployeesItems(value) {
        this.securityItem.employee_array = value.selectedItemsOutput;
        this.filterSecurityEmployees();
        this.changeSecurity('employee');
      },

      filterSecurityEmployees() {
        let that = this;
        that.securityEmployees = _.clone(that.employeeArray);
        if (that.securityItem.department_array.length > 0) {
          that.securityEmployees = _.filter(that.securityEmployees, function (employee) {
            return _.indexOf(that.securityItem.department_array, employee.department_id) > -1;
          });
        }
        that.securityItem.employee_array = _.intersection(_.pluck(that.securityEmployees, 'id'), that.securityItem.employee_array);
      }
    }
  };
</script>
<style scoped>
.default-question-mark{
  max-width: 50px;
}
.hse-document-badge-tab .hse-badge-icon-small{
  left: 58px ;
    top: 20px ;
  }

</style>

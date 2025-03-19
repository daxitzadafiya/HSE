<template>
  <div>
    <b-row>
      <!-- DEPARTMENT -->
      <b-col cols="12">
        <div class="input-wrap industry-select-input-wrap">
          <MultipleSelection
            :item="objectItem"
            :selected-items-input="objectItem.responsible_department_array"
            :label="$t('form.department')"
            :item-text="'name'"
            :item-value="'id'"
            :list-option-input="responsibleDepartment"
            @getSelectedItems="getSelectedDepartureItems"
          />
        </div>
      </b-col>
      <!-- RESPONSIBLE -->
      <b-col cols="12">
        <div v-if="!is_custom_responsible" class="input-wrap d-inline-flex">
          <div class="switch-component switch-responsible-custom">
            <label class="left-text">{{ $t('form.nearest_manager') }}</label>
            <v-switch
              v-model="is_custom_responsible"
              :label="$t('form.custom')"
              inset
              class="right-text"
            />
          </div>
        </div>
        <div v-else class="section-connect-to">
          <div class="section-connect-to-label section-nearest-manager-responsible-edit-in-review-popup">
            {{ $t('form.responsible') }}
          </div>
          <div class="switch-component switch-responsible-edit-in-review-popup">
            <label class="left-text">{{ $t('form.nearest_manager') }}</label>
            <v-switch
              v-model="is_custom_responsible"
              :label="$t('form.custom')"
              inset
              class="right-text"
            />
          </div>
          <b-row class="pt-3 mt-3">
            <b-col>
              <div class="input-wrap industry-select-input-wrap">
                <MultipleSelection
                  :item="objectItem"
                  :selected-items-input="objectItem.responsible_employee_array"
                  :item-text="'full_name'"
                  :item-value="'id'"
                  :list-option-input="responsibleEmployee"
                  @getSelectedItems="getSelectedEmployeesItems"
                />
              </div>
            </b-col>
          </b-row>
        </div>
      </b-col>
    </b-row>
  </div>
</template>
<script>
  import {_} from 'vue-underscore';
  import cookies from 'js-cookie';
  import MultipleSelection from "./MultipleSelection";

  export default {
    name: "ResponsibleEditInReviewPopup",
    components: {
      MultipleSelection,
    },
    props: {
      objectItem: {
        type: Object,
        required: true,
      },
    },
    data: () => ({
      checkAdmin: cookies.get('checkAdmin'),
      roleUser: cookies.get('roleUser'),
      permissionsUser: localStorage.getItem('permissionsKey'),
      required: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else return true;
        }
      ],
      is_custom_responsible: true,
      departmentArray: [],
      responsibleDepartment: [],
      employeeArray: [],
      responsibleEmployee: [],
    }),

    watch: {},

    mounted() {
      let that = this;
      that.$nuxt.$loading.start();
      // list department
      that.$store.dispatch('departments/index').then(result => {
        that.departmentArray = _.filter(result.data, function (item) {
          return item.disable_status === 0;
        });
        that.responsibleDepartment = _.clone(that.departmentArray);
      }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
        that.$toaster.error(that.$i18n.t('message.fail_department_view'));
        }
        that.$nuxt.$loading.finish();
      });

      // list employees
      that.$store.dispatch('users/getManagers').then(result => {
        that.employeeArray = _.filter(result.data, function (item) {
          return item.role_id < 4 && !item.disable_status;
        });
        that.responsibleEmployee = _.clone(that.employeeArray);
        that.$nuxt.$loading.finish();
      }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
        that.$toaster.error(that.$i18n.t('message.fail_employee_view'));
        }
        that.$nuxt.$loading.finish();
      });
    },

    created() {},

    methods: {
      getSelectedDepartureItems(value) {
        this.objectItem.responsible_department_array = value.selectedItemsOutput;
        this.filterEmployee();
        if (this.objectItem.responsible_department_array && this.objectItem.responsible_department_array.length === 1) {
          this.is_custom_responsible = false;
        }
      },

      getSelectedEmployeesItems(value) {
        this.objectItem.responsible_employee_array = value.selectedItemsOutput;
      },

      filterEmployee() {
        let that = this;
        that.responsibleEmployee = _.clone(that.employeeArray);
        if (that.objectItem.responsible_department_array && that.objectItem.responsible_department_array.length > 0) {
          that.responsibleEmployee = _.filter(that.responsibleEmployee, function (employee) {
            return _.indexOf(that.objectItem.responsible_department_array, employee.department_id) > -1;
          });
        }
        that.objectItem.responsible_employee_array = _.intersection(_.pluck(that.responsibleEmployee, 'id'), that.objectItem.responsible_employee_array);
      }
    }
  };
</script>

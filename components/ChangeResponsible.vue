<template>
  <div>
    <div  class="section-connect-to mt-10">
      <div class="section-connect-to-label section-connect-to-label-reminder attendee-label">
        {{ $t('form.responsible') }}
      </div>

      <b-row class="mt-3">
        <!-- DEPARTMENT -->
        <b-col cols="6">
          <div class="input-wrap industry-select-input-wrap">
            <MultipleSelection
            :singleSelection="true"
            :item="objectItem"
            :selected-items-input="objectItem.responsible_department_array"
            :label="$t('form.department')"
            :item-text="'name'"
            :item-value="'id'"
            :list-option-input="responsibleDepartment"
            :request-required="validate"
            @getSelectedItems="getSelectedDepartureItems"
          />
          </div>
        </b-col>
        <!-- EMPLOYEE -->
        <b-col cols="6">
          <div class="input-wrap industry-select-input-wrap">
            <MultipleSelection
            :singleSelection="true"
                  :item="objectItem"
                  :selected-items-input="objectItem.responsible_employee_array"
                  :label="$t('form.responsible')"
                  :item-text="'full_name'"
                  :item-value="'id'"
                  :list-option-input="responsibleEmployee"
                  :request-required="validate"
                  @getSelectedItems="getSelectedEmployeesItems"
                />
          </div>
        </b-col>
      </b-row>



      <NewRequiredComment 
        :object-item="editMode ? editedItem : objectItem"
        :isAttendee="false"
        class="required-comment"
        :mainAction="$t('form.transfer_all_information')"
          :subActionFirst="$t('form.feedback')"
          :subActionSecond="$t('form.image')"
      />
    </div>
  </div>
</template>
<script>
import {_} from 'vue-underscore';
import cookies from 'js-cookie';
import MultipleSelection from "./MultipleSelection";
import NewRequiredComment from './NewRequiredComment.vue';

export default {
  name: "Attendee",
  components: {
    MultipleSelection,
    NewRequiredComment,
  },
  props: {
    objectItem: {
      type: Object,
      required: true,
    },
    noRequiredAction: {
      type: Boolean,
      required: false,
    },
    editMode: {
      type: Boolean,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: false,
    },
     mainAction: {
      type: String,
      required: false,
    },
    subActionFirst: {
      type: String,
      required: false,
    },
    subActionSecond: {
      type: String,
      required: false,
    },
    validate:{
        type: Boolean,
        required: false,
      },
      allResponsible:{
      type: String,
      required: false,
    },
    openRespEdit: Boolean,
  },
  data: () => ({
    checkAdmin: cookies.get('checkAdmin'),
    roleUser: cookies.get('roleUser'),
    userRoleId: parseInt(cookies.get('roleID')),
    userDepartmentID: parseInt(cookies.get('userDepartmentID')),
    assignGroup: cookies.get('assignGroup'),
    permissionsUser: localStorage.getItem('permissionsKey'),
    required: [
      v => {
        if (!v || v.length < 1)
          return 'This is required';
        else return true;
      }
    ],
    is_custom: false,
    is_custom_responsible: true,
    departmentArray: [],
    responsibleDepartment: [],
    employeeArray: [],
    responsibleEmployee: [],
    hoverQuestionMark: false,
    editedItem: {},
  }),

  watch: {
    objectItem() {
        if (this.openRespEdit) {
        this.getResponsible(false);
      }
    }
    // is_custom_attendee(value) {
    //   this.checkCustomAttendee(value);
    // }
  },
  created() {
    if (this.openEmployeeEdit) {
      this.getResponsible(true);
    }
  },

 mounted() {
      let that = this;
      that.$nuxt.$loading.start();
      let ID = this.allResponsible
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
      that.$store.dispatch('users/getManagers',{dep_ids: '',manager_ids:ID}).then(result => {
        that.employeeArray = _.filter(result.data) 
        // function (item) {
        //   return item.role_id < 4 && !item.disable_status;
        // });
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


  methods: {
    getResponsible(departmentAPIFlag){
      let that = this;
      that.$nuxt.$loading.start();
      
      let ID = this.allResponsible
      // list department
      departmentAPIFlag && that.$store.dispatch('departments/index').then(result => {
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
      that.$store.dispatch('users/getManagers',{dep_ids: '',manager_ids:ID}).then(result => {
        that.employeeArray = _.filter(result.data) 
        // function (item) {
        //   return item.role_id < 4 && !item.disable_status;
        // });
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
    // addNew() {
    //   this.is_custom = false;
    //   this.is_custom_responsible = true;
    //   this.objectItem.isDefaultResponsible = true;
    //   this.filterEmployee();
    // },

    // editItem(item) {
    //   this.editedItem = item;
    //   this.editedItem.responsible_employee_array = JSON.parse(item.responsible.employee_array);
    //   this.editedItem.isDefaultResponsible = false;
    //   this.is_custom = true;
    // },

    // switchDefault(val) {
    //   if (this.editMode) {
    //     this.editedItem.isDefaultResponsible = !val;
    //   } else {
    //     this.objectItem.isDefaultResponsible = !val;
    //   }
    // },

    // checkCustomAttendee (custom) {
    //   let that = this;
    //   if (that.editMode) {
    //     that.editedItem.attendee_all = !custom;

    //     // --- OLD logic to clear all previous chosen employees when switch to ALL
    //     // if (custom) {
    //     //   that.editedItem.attendee_department_array = [];
    //     //   that.editedItem.attendee_employee_array = [];
    //     //   that.editedItem.attendee_all = false;
    //     // } else { // All
    //     //   that.editedItem.attendee_employee_array = _.filter(that.employeeArray, function (item) {
    //     //     return item.role_id === that.userRoleId || that.checkAdmin;
    //     //   });
    //     //   that.editedItem.attendee_all = true;
    //     // }
    //   } else {
    //     that.objectItem.attendee_all = !custom;
    //   }
    // },

     getSelectedDepartureItems(value) {
      let ID = this.allResponsible;
      this.$store.dispatch('users/getManagers',{dep_ids: value.selectedItemsOutput,manager_ids:ID}).then(result => {
          this.employeeArray = _.filter(result.data) 
          // function (item) {
          //   return item.role_id < 4 && !item.disable_status;
          // });
          this.responsibleEmployee = _.clone(this.employeeArray);
          this.$nuxt.$loading.finish();
        }).catch((error) => {
              if (error.response.status == 401) {
              this.$router.push('/login');
              this.$toaster.error(this.$i18n.t('message.token_expired'));
            }else{
          this.$toaster.error(this.$i18n.t('message.fail_employee_view'));
            }
          this.$nuxt.$loading.finish();
        });
        this.objectItem.responsible_department_array = value.selectedItemsOutput;
        // this.filterEmployee();
        if (this.objectItem.responsible_department_array && this.objectItem.responsible_department_array.length === 1) {
          this.is_custom_responsible = false;
        }
      },

      getSelectedEmployeesItems(value) {
        this.objectItem.responsible_employee_array = value.selectedItemsOutput;
      },

      // filterEmployee() {
      //   let that = this;
      //   that.responsibleEmployee = _.clone(that.employeeArray);
      //   if (that.objectItem.responsible_department_array && that.objectItem.responsible_department_array.length > 0) {
      //     that.responsibleEmployee = _.filter(that.responsibleEmployee, function (employee) {
      //       return _.indexOf(that.objectItem.responsible_department_array, employee.department_id) > -1;
      //     });
      //   }
      //   that.objectItem.responsible_employee_array = _.intersection(_.pluck(that.responsibleEmployee, 'id'), that.objectItem.responsible_employee_array);
      // }
  }
};
</script>
<style scoped>
.default-question-mark{
  max-width: 50px;
}
  :deep(.required-comment .reson-hover-label){
  position: absolute;
    top: 8px !important;
    left: 142px !important;
}
:deep(.required-comment .main-action){
  font-size: 12px !important;
}
:deep(.attendee-label){
  width: 95px !important;
}
</style>
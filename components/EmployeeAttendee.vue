<template>
  <div>
    <div  class="section-connect-to mt-10">
      <div class="section-connect-to-label section-connect-to-label-reminder attendee-label">
        {{ $t('form.attendee') }}
      </div>

      <b-row class="mt-4">
        <!-- DEPARTMENT -->
        <b-col cols="6">
          <div class="input-wrap industry-select-input-wrap">
            <MultipleSelection
            :singleSelection="true"
              :item="objectItem"
              :selected-items-input="objectItem.attendee_department_array"
              :label="$t('form.department')"
              :item-text="'name'"
              :item-value="'id'"
              :list-option-input="attendeeDepartment"
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
              :selected-items-input="objectItem.attendee_employee_array"
              :label="$t('form.employees')"
              :item-text="'full_name'"
              :item-value="'id'"
              :list-option-input="attendeeArray"
              :request-required="validate"
              @getSelectedItems="getSelectedEmployeesItems"
            />
          </div>
        </b-col>
      </b-row>



      <NewRequiredComment 
        :object-item="editMode ? editedItem : objectItem"
        :isAttendee="true"
        :mainAction="$t('form.transfer_all_information')"
          :subActionFirst="$t('form.feedback')"
          :subActionSecond="$t('form.image')"
          class="required-comment"
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
      allEmployee:{
      type: String,
      required: false,
    },
    openEmployeeEdit: Boolean,
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
    is_custom_attendee: true,
    departmentArray: [],
    attendeeDepartment: [],
    employeeArray: [],
    attendeeArray: [],
    hoverQuestionMark: false,
    editedItem: {},
  }),

  watch: {
    objectItem() {
        if (this.openEmployeeEdit) {
          this.getEmployee(false);
      }
    },
    // is_custom_attendee(value) {
    //   this.checkCustomAttendee(value);
    // }
  },

  mounted() {
    let that = this;
    that.$nuxt.$loading.start();

    let ID = this.allEmployee
    
    // list department
    that.$store.dispatch('departments/index').then(result => {
      that.departmentArray = _.filter(result.data, function (item) {
        return item.disable_status === 0;
      });
      that.attendeeDepartment = _.clone(that.departmentArray);
    }).catch((error) => {
                if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
      that.$toaster.error(that.$i18n.t('message.fail_department_view'));
          }
      that.$nuxt.$loading.finish();
    });
    console.log("ID---->34324",ID);
    // list employees
    ID && that.$store.dispatch('users/getEmployees',{dep_ids: '',emp_ids: ID}).then(result => {
      that.employeeArray = _.filter(result.data)
      // function (item) {
      //   return item.role_id >= 2 && !item.disable_status;
      // });
      that.attendeeArray = _.clone(that.employeeArray);
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

  created() {
    if (this.openEmployeeEdit) {
      this.getEmployee(true);
    }
  },

  methods: {
    getEmployee(departmentAPIFlag){
      let that = this;
    that.$nuxt.$loading.start();

    let ID = this.allEmployee
    // list department
    departmentAPIFlag && that.$store.dispatch('departments/index').then(result => {
      that.departmentArray = _.filter(result.data, function (item) {
        return item.disable_status === 0;
      });
      that.attendeeDepartment = _.clone(that.departmentArray);
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
    that.$store.dispatch('users/getEmployees',{dep_ids: '',emp_ids: ID}).then(result => {
      that.employeeArray = _.filter(result.data)
      // function (item) {
      //   return item.role_id >= 2 && !item.disable_status;
      // });
      that.attendeeArray = _.clone(that.employeeArray);
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
    //   this.is_custom_attendee = true;
    //   this.objectItem.isDefaultAttendee = true;
    //   this.filterEmployee();
    // },

    // editItem(item) {
    //   this.editedItem = item;
    //   this.editedItem.attendee_employee_array = JSON.parse(item.attendee.employee_array);
    //   this.editedItem.isDefaultAttendee = false;
    //   this.is_custom = true;
    // },

    // switchDefault(val) {
    //   if (this.editMode) {
    //     this.editedItem.isDefaultAttendee = !val;
    //   } else {
    //     this.objectItem.isDefaultAttendee = !val;
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
      let ID = this.allEmployee
      this.$store.dispatch('users/getEmployees',{dep_ids: value.selectedItemsOutput.toString(),emp_ids: ID}).then(result => {
      this.employeeArray = _.filter(result.data)
      // function (item) {
      //   return item.role_id >= 2 && !item.disable_status;
      // });
      this.attendeeArray = _.clone(this.employeeArray);
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
      this.objectItem.attendee_department_array = value.selectedItemsOutput;
        // this.filterEmployee();
        if (this.objectItem.attendee_department_array && this.objectItem.attendee_department_array.length === 1) {
          this.is_custom_attendee = false;
        }
    },

    getSelectedEmployeesItems(value) {
        this.objectItem.attendee_employee_array = value.selectedItemsOutput;
    },

    // filterEmployee() {
    //     let that = this;
    //     that.attendeeArray = _.clone(that.employeeArray);
    //     if (that.objectItem.attendee_department_array && that.objectItem.attendee_department_array.length > 0) {
    //       that.attendeeArray = _.filter(that.attendeeArray, function (employee) {
    //         return _.indexOf(that.objectItem.attendee_department_array, employee.department_id) > -1;
    //       });
    //     }
    //     that.objectItem.attendee_employee_array = _.intersection(_.pluck(that.attendeeArray, 'id'), that.objectItem.attendee_employee_array);
    //   }
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
  width: 80px !important;
}
</style>
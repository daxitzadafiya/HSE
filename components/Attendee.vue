<template>
  <div>
    <b-row v-if="!is_custom">
      <b-col cols="2">
        <div class="bold-title md-line-height">
          {{ $t('form.attendee') }}
        </div>
      </b-col>
      <b-col cols="4">
        <div class="switch-component default-question-mark">
          <label class="left-text">{{ $t('form.default') }}</label>
          <v-switch
            v-model="is_custom"
            :label="$t('form.custom')"
            inset
            class="right-text"
            :disabled="disabled"
            @change="switchDefault"
          />
          <v-badge
            :value="hoverQuestionMark"
            right
            transition="slide-x-transition"
            class="hse--icon-question-circle"
            :content="$t('message.hover_object_attendee')"
          >
            <v-hover v-model="hoverQuestionMark">
              <i class="fa fa-question-circle"></i>
            </v-hover>
          </v-badge>
        </div>
      </b-col>
    </b-row>
    <div v-else class="section-connect-to mt-10">
      <div class="section-connect-to-label section-connect-to-label-reminder">
        {{ $t('form.attendee') }}
      </div>
      <div class="switch-component switch-component-small default-question-mark">
        <label class="left-text">{{ $t('form.default') }}</label>
        <v-switch
          v-model="is_custom"
          :label="$t('form.custom')"
          inset
          class="right-text"
          :disabled="disabled"
          @change="switchDefault"
        />
        <v-badge
          :value="hoverQuestionMark"
          right
          transition="slide-x-transition"
          class="hse--icon-smaller-question-circle"
          :content="$t('message.hover_object_attendee')"
        >
          <v-hover v-model="hoverQuestionMark">
            <i class="fa fa-question-circle"></i>
          </v-hover>
        </v-badge>
      </div>
      <b-row class="mt-1">
        <b-col cols="12">
          <div class="switch-component switch-component-yes-no default-question-mark">
            <label class="left-text">{{ $t('form.all') }}</label>
            <v-switch
              v-model="is_custom_attendee"
              :label="$t('form.custom')"
              inset
              class="right-text"
              :disabled="disabled"
            />
          </div>
        </b-col>
      </b-row>
      <b-row v-if="is_custom_attendee">
        <!-- DEPARTMENT -->
        <b-col cols="6">
          <div class="input-wrap industry-select-input-wrap">
            <MultipleSelection
              :item="editMode ? editedItem : objectItem"
              :selected-items-input="editMode ? editedItem.attendee_department_array : objectItem.attendee_department_array"
              :label="$t('form.department')"
              :item-text="'name'"
              :item-value="'id'"
              :list-option-input="attendeeDepartment"
              :disabled="disabled"
              @getSelectedItems="getSelectedDepartureItems"
            />
          </div>
        </b-col>
        <!-- EMPLOYEE -->
        <b-col cols="6">
          <div class="input-wrap industry-select-input-wrap">
            <MultipleSelection
              :item="editMode ? editedItem : objectItem"
              :selected-items-input="editMode ? editedItem.attendee_employee_array : objectItem.attendee_employee_array"
              :label="$t('form.employees')"
              :item-text="'full_name'"
              :item-value="'id'"
              :list-option-input="attendeeArray"
              :request-required="true"
              :disabled="disabled"
              @getSelectedItems="getSelectedEmployeesItems"
            />
          </div>
        </b-col>
      </b-row>

      <RequiredComment
        v-if="!noRequiredAction && !newRequire"
        :object-item="editMode ? editedItem : objectItem"
        :edit-mode="editMode"
        :is-attendee="true"
      />

      <NewRequiredComment 
        v-if="newRequire"
        :object-item="editMode ? editedItem : objectItem"
        :isAttendee="true"
        :mainAction="mainAction"
        :subActionFirst="subActionFirst"
        :subActionSecond="subActionSecond"
        :checkActionswitch="checkActionswitch"
        :checkCommentswitch="checkCommentswitch"
        :checkAttachmentswitch="checkAttachmentswitch"
      />
    </div>
  </div>
</template>
<script>
import {_} from 'vue-underscore';
import cookies from 'js-cookie';
import MultipleSelection from "./MultipleSelection";
import RequiredComment from "./RequiredComment";
import NewRequiredComment from './NewRequiredComment.vue';

export default {
  name: "Attendee",
  components: {
    MultipleSelection,
    RequiredComment,
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
      default:'Required Action'
    },
    subActionFirst: {
      type: String,
      required: false,
      default:'Feedback'

    },
    subActionSecond: {
      type: String,
      required: false,
      default:'Image'

    },
    newRequire:{
        type: Boolean,
        required: false,
      },
      is_document:{
        type: Boolean,
        required: false,
      }
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
    checkActionswitch: false,
    checkCommentswitch: false,
    checkAttachmentswitch: false,
  }),

  watch: {
    objectItem(value) {
      this.checkCommentswitch=value?.attendee_required_comment || false;
      this.checkAttachmentswitch=value?.attendee_required_attachment || false;
      this.checkActionswitch= this.checkCommentswitch ||  this.checkAttachmentswitch;
      if (value) {
        if (this.editMode) {
          this.editItem(this.objectItem);
        } else {
          this.is_custom = this.objectItem?.attendee_department_array?.length>0 && this.objectItem?.attendee_employee_array?.length>0 ? true : false;
          this.addNew();
        }
      }
    },

    is_custom_attendee(value) {
      this.checkCustomAttendee(value);
    }
  },

  mounted() {
    let that = this;
    that.$nuxt.$loading.start();
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
      // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          }
      that.$nuxt.$loading.finish();
    });

    // list employees
    that.$store.dispatch('users/getEmployees').then(result => {
      console.log("getEmployees",result);
      that.attendeeArray = _.filter(result.data)
      // that.employeeArray = _.filter(result.data, function (item) {
      //   return item.role_id >= 2 && !item.disable_status;
      // });
      // that.filterEmployee();
      that.$nuxt.$loading.finish();
    }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
      that.$toaster.error(that.$i18n.t('message.fail_employee_view'));
      // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          }
      that.$nuxt.$loading.finish();
    });
  },

  created() {},

  methods: {
    addNew() {
       if (this.is_document == false) {
          this.is_custom = false;
          this.is_custom_attendee = true;
          this.objectItem.isDefaultAttendee = true;
        }
      // this.filterEmployee();
    },

    editItem(item) {
      this.editedItem = item;
      // this.editedItem.attendee_employee_array = JSON.parse(item.attendee.employee_array);
      if (item.attendee && item.attendee.employee_array && typeof item.attendee.employee_array === 'string') {
          this.editedItem.attendee_employee_array = JSON.parse(item.attendee?.employee_array);
        } else{
          this.editedItem.attendee_employee_array = item.attendee?.employee_array
        }
      this.editedItem.isDefaultAttendee = false;
      this.is_custom = true;
    },

    switchDefault(val) {
       if (val == false) {
          this.objectItem.attendee_department_array = []
          this.objectItem.attendee_employee_array = []
        }
      if (this.editMode) {
        this.editedItem.isDefaultAttendee = !val;
      } else {
        this.objectItem.isDefaultAttendee = !val;
      }
    },

    checkCustomAttendee (custom) {
      let that = this;
      if (that.editMode) {
        that.editedItem.attendee_all = !custom;

        // --- OLD logic to clear all previous chosen employees when switch to ALL
        // if (custom) {
        //   that.editedItem.attendee_department_array = [];
        //   that.editedItem.attendee_employee_array = [];
        //   that.editedItem.attendee_all = false;
        // } else { // All
        //   that.editedItem.attendee_employee_array = _.filter(that.employeeArray, function (item) {
        //     return item.role_id === that.userRoleId || that.checkAdmin;
        //   });
        //   that.editedItem.attendee_all = true;
        // }
      } else {
        that.objectItem.attendee_all = !custom;
      }
    },

    getSelectedDepartureItems(value) {
      this.$store.dispatch('users/getEmployees',{dep_ids: value.selectedItemsOutput.toString()}).then(result => {
      console.log("getEmployees",result);
      this.attendeeArray = _.filter(result.data)
      // this.employeeArray = _.filter(result.data, function (item) {
      //   return item.role_id >= 2 && !item.disable_status;
      // });
        // this.filterEmployee();
      }).catch((error) => {
              if (error.response.status == 401) {
              this.$router.push('/login');
              this.$toaster.error(this.$i18n.t('message.token_expired'));
            }else{
        this.$toaster.error(this.$i18n.t('message.fail_employee_view'));
        // this.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            }
    });
      if (this.editMode) {
        this.editedItem.attendee_department_array = value.selectedItemsOutput;
      } else {
        this.objectItem.attendee_department_array = value.selectedItemsOutput;
      }
      // this.filterEmployee();
      this.$emit('changeField', {
        changed: true,
      });
    },

    getSelectedEmployeesItems(value) {
      if (this.editMode) {
        this.editedItem.attendee_employee_array = value.selectedItemsOutput;
      } else {
        this.objectItem.attendee_employee_array = value.selectedItemsOutput;
      }
      this.$emit('changeField', {
        changed: true,
      });
    },

    // filterEmployee() {
    //   let that = this;
    //   that.attendeeArray = _.clone(that.employeeArray);
    //   if (this.editMode) {
    //     if (that.editedItem.attendee_department_array && that.editedItem.attendee_department_array.length > 0) {
    //       that.attendeeArray = that.editedItem.attendee_employee_array = _.filter(that.attendeeArray, function (employee) {
    //         return _.indexOf(that.editedItem.attendee_department_array, employee.department_id) > -1;
    //       });
    //     } else {
    //       that.attendeeArray = _.filter(that.attendeeArray, function (item) {
    //         if (that.assignGroup) { // view all employees in login user department
    //           return item.role_id > 2 && !item.disable_status && item.department_id === that.userDepartmentID;
    //         } else { // view all employees has same / lower role as login user
    //           return item.role_id >= that.userRoleId && !item.disable_status;
    //         }
    //       });
    //     }
    //     that.editedItem.attendee_employee_array = _.intersection(_.pluck(that.attendeeArray, 'id'), that.editedItem.attendee_employee_array);
    //   } else {
    //     if (that.objectItem.attendee_department_array && that.objectItem.attendee_department_array.length > 0) {
    //       that.attendeeArray = that.objectItem.attendee_employee_array = _.filter(that.attendeeArray, function (employee) {
    //         return _.indexOf(that.objectItem.attendee_department_array, employee.department_id) > -1 && employee.role_id >= that.userRoleId;
    //       });
    //     } else {
    //       that.attendeeArray = _.filter(that.attendeeArray, function (item) {
    //         if (that.assignGroup) { // view all employees in login user department
    //           return item.role_id > 2 && !item.disable_status && item.department_id === that.userDepartmentID;
    //         } else { // view all employees has same / lower role as login user
    //           return item.role_id >= that.userRoleId && !item.disable_status;
    //         }
    //       });
    //     }
    //     that.objectItem.attendee_employee_array = _.intersection(_.pluck(that.attendeeArray, 'id'), that.objectItem.attendee_employee_array);
    //   }
    // }
  }
};
</script>
<style scoped>
.default-question-mark{
  max-width: 50px;
}
</style>

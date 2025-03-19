<template>
  <div>
    <b-row v-if="!reminderItem.is_renewed">
      <b-col cols="2">
        <div class="bold-title md-line-height">
          {{ $t('title.reminder') }}
        </div>
      </b-col>
      <b-col cols="4">
        <div class="input-wrap">
          <div class="goal-type-wrap">
            <label class="left-text">{{ $t('form.none') }}</label>
            <v-switch
              v-model="reminderItem.is_renewed"
              :label="$t('form.activate')"
              inset
              :readonly="!reminderItem.editPermission && reminderItem.added_by !== userLogged"
              class="right-text"
            />
          </div>
        </div>
      </b-col>
    </b-row>
    <div v-else class="section-connect-to section-connect-to-reminder">
      <div class="section-connect-to-label section-connect-to-label-reminder">
        {{ $t('title.reminder') }}
      </div>
      <div class="goal-type-wrap reminder-type-switch">
        <label class="left-text">{{ $t('form.none') }}</label>
        <v-switch
          v-model="reminderItem.is_renewed"
          :label="$t('form.activate')"
          class="right-text"
          inset
          :readonly="!reminderItem.editPermission && reminderItem.added_by !== userLogged"
        />
      </div>
      <!-- Reminder - choose employee to renew document -->
      <b-row v-if="reminderItem.is_renewed" class="pt-3 mt-3">
        <b-col cols="6">
          <div class="input-wrap industry-select-input-wrap">
            <MultipleSelection
              :item="reminderItem"
              :selected-items-input="reminderItem.renewed_employee_array_arr"
              :label="$t('form.employees')"
              :item-text="'name'"
              :item-value="'id'"
              :list-option-input="reminderEmployee"
              :disabled="reminderEmployee.length <= 0"
              @getSelectedItems="getSelectedEmployeesItems"
            />
          </div>
        </b-col>
        <b-col cols="6">
          <DatePicker
            :label="$t('form.due_date')"
            :item="reminderItem"
            :date-input="reminderItem.deadline"
            :use-keyboard="true"
            :past-date="false"
            :future-date="true"
            :disable="!reminderItem.editPermission && reminderItem.added_by !== userLogged"
            @getDate="getDeadline"
          />
        </b-col>
      </b-row>

<!--      <b-row v-if="reminderItem.is_renewed" class="pt-3 mt-3">-->
<!--        <b-col cols="6">-->
<!--          <div class="inline-row">-->
<!--            <v-radio-group v-model="reminderItem.renewed_option" :rules="required" row class="hse-radio-checkbox">-->
<!--              <v-radio-->
<!--                v-for="option in options"-->
<!--                :key="option.value"-->
<!--                :label="option.name"-->
<!--                :value="option.value"-->
<!--                @change="changeOption(option.value)"-->
<!--              />-->
<!--            </v-radio-group>-->
<!--          </div>-->
<!--        </b-col>-->
<!--        <b-col cols="6" class="pt-0">-->
<!--          <datepicker_radio :data="reminderItem" />-->
<!--        </b-col>-->
<!--      </b-row>-->
<!--      <div v-if="reminderItem.renewed_option === 3">-->
<!--        <b-row>-->
<!--          <b-col v-if="!isFilterAll">-->
<!--            <div class="section-connect-to-checkbox inline-row">-->
<!--              <v-checkbox-->
<!--                v-if="!filterByDepartment"-->
<!--                v-model="filterByDepartment"-->
<!--                :label="$t('form.department')"-->
<!--                class="margin-right-sm"-->
<!--                @change="checkCustomFilterAll"-->
<!--              />-->
<!--              <v-checkbox-->
<!--                v-if="!filterByJobTitle"-->
<!--                v-model="filterByJobTitle"-->
<!--                :label="$t('form.job_title')"-->
<!--                class="margin-right-sm"-->
<!--                @change="checkCustomFilterAll"-->
<!--              />-->
<!--&lt;!&ndash;              <v-checkbox &ndash;&gt;-->
<!--&lt;!&ndash;                v-if="!filterByProject" &ndash;&gt;-->
<!--&lt;!&ndash;                v-model="filterByProject" &ndash;&gt;-->
<!--&lt;!&ndash;                label="Project" &ndash;&gt;-->
<!--&lt;!&ndash;                @change="checkCustomFilterAll" &ndash;&gt;-->
<!--&lt;!&ndash;              />&ndash;&gt;-->
<!--            </div>-->
<!--          </b-col>-->
<!--          &lt;!&ndash; DEPARTMENT &ndash;&gt;-->
<!--          <b-col v-if="filterByDepartment">-->
<!--            <div class="input-wrap industry-select-input-wrap">-->
<!--              <DocumentMultipleSelection-->
<!--                :selected-items-input="reminderItem.renewed_department_array_arr"-->
<!--                :label="$t('form.department')"-->
<!--                :item-text="'name'"-->
<!--                :item-value="'id'"-->
<!--                :list-option-input="departmentsArray"-->
<!--                :disabled="departmentsArray.length <= 0"-->
<!--                @getSelectedItems="getSelectedDepartureItems"-->
<!--                @filterEmployees="filterEmployees"-->
<!--              />-->
<!--            </div>-->
<!--          </b-col>-->
<!--          &lt;!&ndash; JOB TITLE &ndash;&gt;-->
<!--          <b-col v-if="filterByJobTitle">-->
<!--            <div class="input-wrap industry-select-input-wrap">-->
<!--              <DocumentMultipleSelection-->
<!--                :selected-items-input="reminderItem.renewed_job_title_array_arr"-->
<!--                :label="$t('form.job_title')"-->
<!--                :item-text="'name'"-->
<!--                :item-value="'id'"-->
<!--                :list-option-input="jobTitleArray"-->
<!--                :disabled="jobTitleArray.length <= 0"-->
<!--                @getSelectedItems="getSelectedJobTitleItems"-->
<!--                @filterEmployees="filterEmployees"-->
<!--              />-->
<!--            </div>-->
<!--          </b-col>-->
<!--          &lt;!&ndash; PROJECT &ndash;&gt;-->
<!--          &lt;!&ndash;          <b-col v-if="filterByProject" cols="3">&ndash;&gt;-->
<!--          &lt;!&ndash;            <div class="input-wrap">&ndash;&gt;-->
<!--          &lt;!&ndash;              <v-select&ndash;&gt;-->
<!--          &lt;!&ndash;                v-model="reminderItem.security_project_array_arr"&ndash;&gt;-->
<!--          &lt;!&ndash;                label="Project"&ndash;&gt;-->
<!--          &lt;!&ndash;                multiple&ndash;&gt;-->
<!--          &lt;!&ndash;                outlined&ndash;&gt;-->
<!--          &lt;!&ndash;                @change="filterEmployees"&ndash;&gt;-->
<!--          &lt;!&ndash;              />&ndash;&gt;-->
<!--          &lt;!&ndash;            </div>&ndash;&gt;-->
<!--          &lt;!&ndash;          </b-col>&ndash;&gt;-->
<!--          &lt;!&ndash; EMPLOYEES &ndash;&gt;-->
<!--          <b-col>-->
<!--            <div class="input-wrap industry-select-input-wrap">-->
<!--              <MultipleSelection-->
<!--                :selected-items-input="reminderItem.renewed_employee_array_arr"-->
<!--                :label="$t('form.employees')"-->
<!--                :item-text="'name'"-->
<!--                :item-value="'id'"-->
<!--                :list-option-input="reminderEmployee"-->
<!--                :disabled="reminderEmployee.length <= 0"-->
<!--                @getSelectedItems="getSelectedEmployeesItems"-->
<!--              />-->
<!--            </div>-->
<!--          </b-col>-->
<!--        </b-row>-->
<!--      </div>-->
    </div>
  </div>
</template>
<script>
  import {_} from 'vue-underscore';
  import MultipleSelection from "./MultipleSelection";
  // import DatePickerRadio from "./DatePickerRadio";
  import cookies from "js-cookie";
  import DatePicker from "./DatePicker";

  export default {
    name: "DocumentReminder",
    components: {
      MultipleSelection,
      // datepicker_radio: DatePickerRadio,
      DatePicker,
    },
    props: {
      reminderItem: {
        type: Object,
        required: false,
      },
      checkChangeSecurity: {
        type: Object,
        required: false,
      },
      editMode: {
        type: Boolean,
        required: false,
      },
      // departmentsArray: {
      //   type: Array,
      //   required: false,
      // },
      // jobTitleArray: {
      //   type: Array,
      //   required: false,
      // },
      // projectArray: {
      //   type: Array,
      //   required: false,
      // },
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
      // isFilterAll: false,
      // filterByDepartment: false,
      // filterByJobTitle: false,
      // filterByProject: false,
      // departmentsArray: [],
      // jobTitleArray: [],
      // projectArray: [],
      // options: [
      //   {
      //     value: 1,
      //     name: "Personal"
      //   }, {
      //     value: 2,
      //     name: "Manager"
      //   }, {
      //     value: 3,
      //     name: "Custom"
      //   }
      // ],
      reminderEmployee: [],
      employeeArray: [],
      // deadline: '',
    }),

    watch: {
      reminderItem(value) {
        if (value) {
          if (this.editMode) {
            this.editItem(this.reminderItem);
          }
        }
      },

      checkChangeSecurity(value) {
        if (value) {
          this.filterListReminderEmployee(value.condition);
        }
      },
    },

    mounted() {},

    created() {
      let that = this;
      if (that.reminderItem) {
        that.editItem(that.reminderItem);
        if (that.reminderItem.is_public) {
          that.filterListReminderEmployee('shared');
        } else {
          that.filterListReminderEmployee('personal');
        }
      }
    },

    methods: {
      filterListReminderEmployee(condition) {
        let that = this;
        if (_.isEmpty(that.reminderEmployee)) {
          that.$store.dispatch('employees/index').then(result => {
            _.each(result.data, function (i) {
              if (i.department_name) {
                i.name = i.name + ' - ' + i.department_name;
              }
            });
            that.employeeArray = _.filter(result.data, function(item) {
              return !item.disable_status;
            });
            that.reminderEmployee = _.clone(that.employeeArray);

            // console.log('1111: ', condition);
            that.filter(condition);
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
        } else {
          // console.log('2222: ', condition);
          // that.reminderItem.renewed_employee_array = '';
          that.reminderItem.renewed_employee_array_arr = [];
          that.filter(condition);
        }
      },

      filter(condition) {
        // console.log('condition: ', condition);
        let that = this;
        if (condition === 'personal') {
          that.reminderEmployee = [];
        } else if (condition === 'shared' || condition === 'custom' || condition === 'all' || condition === 'department' || condition === 'employee') {
          that.reminderEmployee = [];
          // console.log('is_public: ', this.reminderItem.is_public);
          // console.log('employee: ', this.reminderItem.security_employee_array_arr);
          // console.log('department: ', this.reminderItem.security_department_array_arr);

          // if (that.reminderItem.is_public) {
          //   that.reminderEmployee = _.clone(that.employeeArray);
          // }
          // console.log('reminderEmployee 1', that.reminderEmployee)
          // let newList = [];
          let newListFilterByDepartment = [];
          let newListFilterByEmployee = [];

          if (condition === 'all'
            || (_.isEmpty(that.reminderItem.security_department_array_arr) && _.isEmpty(that.reminderItem.security_employee_array_arr))) {
            that.reminderEmployee = _.clone(that.employeeArray);
          } else {
            if (that.reminderItem.is_public) {
              that.reminderEmployee = _.clone(that.employeeArray);
            }
            if (!_.isEmpty(that.reminderItem.security_department_array_arr)) {
              newListFilterByDepartment = _.filter(that.reminderEmployee, function (item) {
                return _.indexOf(that.reminderItem.security_department_array_arr, item.department_id) > -1;
              });
            }
            // console.log('reminderEmployee 2', that.reminderEmployee)
            if (!_.isEmpty(that.reminderItem.security_employee_array_arr)) {
              newListFilterByEmployee = _.filter(that.reminderEmployee, function (item) {
                return _.indexOf(that.reminderItem.security_employee_array_arr, item.id) > -1;
              });
            }
            // console.log('newListFilterByDepartment', newListFilterByDepartment)
            // console.log('newListFilterByEmployee', newListFilterByEmployee)

            that.reminderEmployee = _.union(newListFilterByDepartment, newListFilterByEmployee);
          }
          // console.log('reminderEmployee final', that.reminderEmployee);
        }
      },

      editItem(item) {
        // REMINDER
        // item.renewed_department_array_arr = this.formatNullArray(this.formatFromStringToArray(item.renewed_department_array));
        // item.renewed_job_title_array_arr = this.formatNullArray(this.formatFromStringToArray(item.renewed_job_title_array));
        // item.renewed_project_array_arr = this.formatNullArray(this.formatFromStringToArray(item.renewed_project_array));
        item.renewed_employee_array_arr = this.formatNullArray(this.formatFromStringToArray(item.renewed_employee_array));
        // this.filterByDepartment = !!item.renewed_department_array;
        // this.filterByJobTitle = !!item.renewed_job_title_array;
        // this.filterByProject = !!item.renewed_project_array;
        // this.checkCustomFilterAll();
        // this.filterEmployees();
        return item;
      },

      getDeadline(value) {
        // this.deadline = value.date;
        this.reminderItem.deadline_pre = value.date;
      },

      // checkCustomFilterAll() {
      //   this.isFilterAll = this.filterByDepartment && this.filterByJobTitle;
      //   this.reminderEmployee = [];
      // },

      // filterEmployees() {
      //   let that = this;
      //   that.$nuxt.$loading.start();
      //   that.$store.dispatch('employees/index', {arr_department: that.reminderItem.renewed_department_array_arr, arr_job_title: that.reminderItem.renewed_job_title_array_arr}).then(result => {
      //     that.reminderEmployee = result.data;
      //     that.$nuxt.$loading.finish();
      //   }).catch((error) => {
      //     that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
      //     that.$nuxt.$loading.finish();
      //   });
      // },

      // changeOption(option) {
      //   if (option !== this.reminderItem.renewed_option && option === 3) {
      //     this.reminderItem.renewed_employee_array_arr = [];
      //   }
      // },

      // getSelectedDepartureItems(value) {
      //   this.reminderItem.renewed_department_array_arr = value.selectedItemsOutput;
      // },

      // getSelectedJobTitleItems(value) {
      //   this.reminderItem.renewed_job_title_array_arr = value.selectedItemsOutput;
      // },

      getSelectedEmployeesItems(value) {
        this.reminderItem.renewed_employee_array_arr = value.selectedItemsOutput;
      },

      formatNullArray(item) {
        if (item === null) {
          item = [];
        }
        return item;
      },

      formatFromStringToArray(data) {
        let result;
        if (data) {
          result = data.split(',');
          result = _.map(result, function (item) {
            return parseInt(item);
          });
        } else {
          result = data;
        }
        return result;
      },
    }
  };
</script>

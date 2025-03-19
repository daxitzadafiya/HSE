<template>
    <div>
      <b-col v-if="!is_custom" class="pt-5 mb-0 mb-0">
        <b-row>

      <b-col cols="2" class="px-0">
        <div class="bold-title md-line-height">
          {{ $t('form.responsible') }}
        </div>
      </b-col>
      <b-col cols="4" class="px-1">
        <div class="switch-component default-question-mark">
          <label class="left-text">{{ $t('form.default') }}</label>
          <v-switch
            v-model="is_custom"
            :label="$t('form.custom')"
            inset
            class="right-text"
            @change="switchDefault"
          />
          <v-badge
            :value="hoverQuestionMark"
            right
            transition="slide-x-transition"
            class="hse--icon-question-circle"
            :content="$t('message.hover_object_responsible')"
          >
            <v-hover v-model="hoverQuestionMark">
              <i class="fa fa-question-circle"></i>
            </v-hover>
          </v-badge>
        </div>
      </b-col>
    </b-row>

    </b-col>



      <div v-else class="section-connect-to mt-10 ml-2">
        <div class="section-connect-to-label section-connect-to-label-reminder">
        {{ $t('form.responsible') }}
      </div>
      <div class="switch-component switch-component-small default-question-mark">
        <label class="left-text">{{ $t('form.default') }}</label>
        <v-switch
          v-model="is_custom"
          :label="$t('form.custom')"
          inset
          class="right-text"
          @change="switchDefault"
        />
        <v-badge
          :value="hoverQuestionMark"
          right
          transition="slide-x-transition"
          class="hse--icon-smaller-question-circle"
          :content="$t('message.hover_object_default')"
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
                v-model="is_custom_responsible"
                :label="$t('form.custom')"
                inset
                class="right-text"
              />
            </div>
          </b-col>
        </b-row>


        <b-row class="mt-3">
        <!-- DEPARTMENT -->
        <b-col cols="6">
          <!-- choose Nearest manager -->
          <div class="input-wrap industry-select-input-wrap">
            <MultipleSelection
              :item="editMode ? editedItem : objectItem"
              :selected-items-input="editMode ? editedItem.responsible_department_array : objectItem.responsible_department_array"
              :label="$t('form.department')"
              :item-text="'name'"
              :item-value="'id'"
              :list-option-input="responsibleDepartment"
              @getSelectedItems="getSelectedDepartureItems"
            />
          </div>
        </b-col>
        <!-- RESPONSIBLE -->
        <b-col cols="6">
          <!-- choose Nearest manager -->
          <div v-if="!is_custom_responsible" class="d-inline-flex">
            <div class="bold-title md-line-height">
              {{ $t('form.responsible') }}
            </div>
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
          <!-- choose Custom -->
          <div v-else class="section-connect-to mb-4 custom-responsible">
            <div class="section-connect-to-label section-nearest-manager" >
              {{ $t('form.responsible') }}
            </div>
            <div class="switch-component switch-responsible-custom-small">
              <label class="left-text">{{ $t('form.nearest_manager') }}</label>
              <v-switch
                v-model="is_custom_responsible"
                :label="$t('form.custom')"
                inset
                class="right-text"
              />
            </div>
                <div class="">
                  <MultipleSelection
                    :item="editMode ? editedItem : objectItem"
                    :selected-items-input="editMode ? editedItem.responsible_employee_array : objectItem.responsible_employee_array"
                    :item-text="'name'"
                    :item-value="'id'"
                    :list-option-input="responsibleEmployee"
                    :request-required="true"
                    @getSelectedItems="getSelectedEmployeesItems"
                    :label="$t('form.employees')"

                  />
                </div>
          </div>
        </b-col>
      </b-row>


        <RequiredComment
          v-if="!isInstruction"
          :object-item="editMode ? editedItem : objectItem"
          :edit-mode="editMode"
          :is-attendee="true"
        />
      </div>
    </div>
</template>
  <script>
  import {_} from 'vue-underscore';
  import cookies from 'js-cookie';
  import MultipleSelection from "./MultipleSelection";
  import RequiredComment from "./RequiredComment";
  
  export default {
    name: "DeviationResponsible",
    components: {
      MultipleSelection,
      RequiredComment,
    },
    props: {
      objectItem: {
        type: Object,
        required: true,
      },
      isInstruction: {
        type: Boolean,
        required: false,
      },
      editMode: {
        type: Boolean,
        required: true,
      },
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
      attendeeDepartment: [],
      employeeArray: [],
      attendeeArray: [],
      hoverQuestionMark: false,
      editedItem: {},
    }),
  
    watch: {
        objectItem(value) {
        if (value) {
          if (this.editMode) {
            this.editItem(this.objectItem);
          } else {
            this.addNew();
          }
        }
      },
      is_custom_responsible(value) {
      this.checkCustomResponsible(value);
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
      that.$store.dispatch('employees/index').then(result => {
        // _.each(result.data, function(i) {
        //   if (i.role_id !== 2) {
        //     i.name = i.name + ' - ' + i.department_name;
        //   }
        // });
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
      addNew() {
        this.is_custom = false;
        this.is_custom_responsible = true;
        this.objectItem.isDefaultResponsible = true;
        this.filterEmployee();
      },
  
      editItem(item) {

        this.editedItem = item;
        this.editedItem.responsible_employee_array = JSON.parse(item.responsible.employee_array);
        this.editedItem.isDefaultResponsible = false;
        this.is_custom = true;
      },
  
      switchDefault(val) {
        if (this.editMode) {
          this.editedItem.isDefaultResponsible = !val;
        } else {
          this.objectItem.isDefaultResponsible = !val;
        }
      },
      
      getSelectedDepartureItems(value) {
        if (this.editMode) {
          this.editedItem.responsible_department_array = value.selectedItemsOutput;
          if (this.editedItem.responsible_department_array && this.editedItem.responsible_department_array.length === 1) {
            this.is_custom_responsible = false;
          }
        } else {
          this.objectItem.responsible_department_array = value.selectedItemsOutput;
          if (this.objectItem.responsible_department_array && this.objectItem.responsible_department_array.length === 1) {
            this.is_custom_responsible = false;
          }
        }
        this.filterEmployee();
      },

      getSelectedEmployeesItems(value) {
        if (this.editMode) {
          this.editedItem.responsible_employee_array = value.selectedItemsOutput;
        } else {
          this.objectItem.responsible_employee_array = value.selectedItemsOutput;
        }
      },

      checkCustomResponsible (custom) {
      let that = this;
      if (that.editMode) {
        that.editedItem.responsible_all = !custom;

        // --- OLD logic to clear all previous chosen employees when switch to ALL
        // if (custom) {
        //   that.editedItem.attendee_department_array = [];
        //   that.editedItem.attendee_employee_array = [];
        //   that.editedItem.responsible_all = false;
        // } else { // All
        //   that.editedItem.attendee_employee_array = _.filter(that.employeeArray, function (item) {
        //     return item.role_id === that.userRoleId || that.checkAdmin;
        //   });
        //   that.editedItem.responsible_all = true;
        // }
      } else {
        that.objectItem.responsible_all = !custom;
      }
    },
      filterEmployee() {
        let that = this;
        that.responsibleEmployee = _.clone(that.employeeArray);
        if (that.editMode) {
          if (that.editedItem.responsible_department_array && that.editedItem.responsible_department_array.length > 0) {
            that.responsibleEmployee = _.filter(that.responsibleEmployee, function (employee) {
              return _.indexOf(that.editedItem.responsible_department_array, employee.department_id) > -1;
            });
          }
          that.editedItem.responsible_employee_array = _.intersection(_.pluck(that.responsibleEmployee, 'id'), that.editedItem.responsible_employee_array);
        } else {
          if (that.objectItem.responsible_department_array && that.objectItem.responsible_department_array.length > 0) {
            that.responsibleEmployee = _.filter(that.responsibleEmployee, function (employee) {
              return _.indexOf(that.objectItem.responsible_department_array, employee.department_id) > -1;
            });
          }
          that.objectItem.responsible_employee_array = _.intersection(_.pluck(that.responsibleEmployee, 'id'), that.objectItem.responsible_employee_array);
        }
      }
    }
  };
  </script>
  <style scoped>
  .default-question-mark{
    max-width: 50px;
  }
  .custom-responsible{
    border: 0;
    padding: 0;
  }
  .custom-responsible .section-nearest-manager{
    z-index: 1;
  }
  .custom-responsible .switch-responsible-custom-small{
    z-index: 11;
  }
  :deep(.custom-responsible .v-select__selections){
    min-height: auto !important;
  }
  </style>
  
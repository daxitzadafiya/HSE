<template>
  <div>
    <b-row v-if="!is_custom">
      <b-col cols="2">
        <div class="bold-title md-line-height">
          {{ $t('form.responsible') }}
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
            :content="$t('message.hover_object_responsible')"
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
        {{ $t('form.responsible') }}
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
          :content="$t('message.hover_object_default')"
        >
          <v-hover v-model="hoverQuestionMark">
            <i class="fa fa-question-circle"></i>
          </v-hover>
        </v-badge>
      </div>
      <b-row class="mt-3">
        <!-- DEPARTMENT -->
        <b-col cols="6">
          <!-- choose Nearest manager -->
          <div v-if="!is_custom_responsible" class="input-wrap industry-select-input-wrap">
            <MultipleSelection
              :item="editMode ? editedItem : objectItem"
              :selected-items-input="editMode ? editedItem.responsible_department_array : objectItem.responsible_department_array"
              :label="$t('form.department')"
              :item-text="'name'"
              :item-value="'id'"
              :list-option-input="responsibleDepartment"
              :disabled="disabled"
              @getSelectedItems="getSelectedDepartureItems"
            />
          </div>
          <!-- choose Custom -->
          <div v-else class="section-connect-to mb-4">
            <div class="section-connect-to-label">
              {{ $t('form.department') }}
            </div>
            <b-row class="pt-3 mt-3">
              <b-col>
                <div class="input-wrap industry-select-input-wrap">
                  <MultipleSelection
                    :item="editMode ? editedItem : objectItem"
                    :selected-items-input="editMode ? editedItem.responsible_department_array : objectItem.responsible_department_array"
                    :item-text="'name'"
                    :item-value="'id'"
                    :list-option-input="responsibleDepartment"
                    :disabled="disabled"
                    @getSelectedItems="getSelectedDepartureItems"
                  />
                </div>
              </b-col>
            </b-row>
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
                :disabled="disabled"
              />
            </div>
          </div>
          <!-- choose Custom -->
          <div v-else class="section-connect-to mb-4">
            <div class="section-connect-to-label section-nearest-manager">
              {{ $t('form.responsible') }}
            </div>
            <div class="switch-component switch-responsible-custom-small">
              <label class="left-text">{{ $t('form.nearest_manager') }}</label>
              <v-switch
                v-model="is_custom_responsible"
                :label="$t('form.custom')"
                inset
                class="right-text"
                :disabled="disabled"
              />
            </div>
            <b-row class="pt-3 mt-3">
              <b-col>
                <div class="input-wrap industry-select-input-wrap">
                  <MultipleSelection
                    :item="editMode ? editedItem : objectItem"
                    :selected-items-input="editMode ? editedItem.responsible_employee_array : objectItem.responsible_employee_array"
                    :item-text="'full_name'"
                    :item-value="'id'"
                    :list-option-input="responsibleEmployee"
                    :request-required="true"
                    :disabled="disabled"
                    @getSelectedItems="getSelectedEmployeesItems"
                  />
                </div>
              </b-col>
            </b-row>
          </div>
        </b-col>
      </b-row>

      <RequiredComment
        v-if="!noRequiredAction && !newRequire"
        :object-item="editMode ? editedItem : objectItem"
        :is-attendee="false"
      />
      
      <NewRequiredComment 
        v-if="newRequire"
        :object-item="editMode ? editedItem : objectItem"
        :isAttendee="false"
        :isChecklistOption="false"
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
  // import RequiredComment from "./RequiredComment";
import NewRequiredComment from './NewRequiredComment.vue';
import RequiredComment from './RequiredComment.vue';

  export default {
    name: "Responsible",
    components: {
      MultipleSelection,
      // RequiredComment,
      NewRequiredComment,
        RequiredComment,
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
      newRequire:{
        type: Boolean,
        required: false,
      },
      editMode: {
        type: Boolean,
        required: true,
        default: false
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
    is_custom_responsible:{
      type: Boolean,
        required: false,
        default: true
    },
    is_document:{
      type: Boolean,
        required: false,
    },
    },
    data: () => ({
      checkAdmin: cookies.get('checkAdmin'),
      roleUser: cookies.get('roleUser'),
      permissionsUser: localStorage.getItem('permissionsKey'),
      // userLogged: parseInt(cookies.get('userID')),
      required: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else return true;
        }
      ],
      is_custom: false,
      // is_custom_responsible: true,
      departmentArray: [],
      responsibleDepartment: [],
      employeeArray: [],
      responsibleEmployee: [],
      hoverQuestionMark: false,
      editedItem: {},
      checkActionswitch: false,
      checkCommentswitch: false,
      checkAttachmentswitch: false,

    }),

    watch: {
      objectItem(value) {
          this.checkCommentswitch=value?.responsible_required_comment || false;
          this.checkAttachmentswitch=value?.responsible_required_attachment || false;
          this.checkActionswitch= this.checkCommentswitch ||  this.checkAttachmentswitch; 
        if (value) {
          if (this.editMode) {
            this.editItem(this.objectItem);
          } else {
            this.is_custom = this.objectItem?.responsible_department_array?.length>0 && this.objectItem?.responsible_employee_array?.length>0 ? true : false;     
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
        // _.each(result.data, function(i) {
        //   if (i.role_id !== 2) {
        //     i.name = i.name + ' - ' + i.department_name;
        //   }
        // });
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

    created() {},

    methods: {
      addNew() {
        if (this.is_document == false) {
          this.is_custom = false;
          this.is_custom_responsible = true;
        this.objectItem.isDefaultResponsible = true;
        }
        // console.log("is_custom----->",this.is_custom);
        // this.is_custom_responsible = true;
        // this.objectItem.isDefaultResponsible = true;
        // this.filterEmployee();
      },

      editItem(item) {
        this.editedItem = item;
        // this.editedItem.responsible_employee_array = JSON.parse(item.responsible.employee_array);
        if (item.responsible && item.responsible.employee_array && typeof item.responsible.employee_array === 'string') {
          this.editedItem.responsible_employee_array = JSON.parse(item.responsible?.employee_array);
        } else{
          this.editedItem.responsible_employee_array = item.responsible?.employee_array
        }
        this.editedItem.isDefaultResponsible = false;
        this.is_custom = true;
      },

      switchDefault(val) {
        if (val == false) {
          this.objectItem.responsible_department_array = []
          this.objectItem.responsible_employee_array = []
        }
        if (this.editMode) {
          this.editedItem.isDefaultResponsible = !val;
        } else {
          this.objectItem.isDefaultResponsible = !val;
        }
      },

      getSelectedDepartureItems(value) {
        this.$store.dispatch('users/getManagers',{dep_ids: value.selectedItemsOutput.toString()}).then(result => {
        this.employeeArray = _.filter(result.data)
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
        if (this.editMode) {
          this.editedItem.responsible_department_array = value.selectedItemsOutput;
          if (this.editedItem.responsible_department_array && this.editedItem.responsible_department_array.length === 1) {
            // this.is_custom_responsible = false;
          }
        } else {
          this.objectItem.responsible_department_array = value.selectedItemsOutput;
          if (this.objectItem.responsible_department_array && this.objectItem.responsible_department_array.length === 1) {
            // this.is_custom_responsible = false;
          }
        }
        // this.filterEmployee();
      },

      getSelectedEmployeesItems(value) {
        if (this.editMode) {
          this.editedItem.responsible_employee_array = value.selectedItemsOutput;
        } else {
          this.objectItem.responsible_employee_array = value.selectedItemsOutput;
        }
      },

      // filterEmployee() {
      //   let that = this;
      //   that.responsibleEmployee = _.clone(that.employeeArray);
      //   if (that.editMode) {
      //     if (that.editedItem.responsible_department_array && that.editedItem.responsible_department_array.length > 0) {
      //       that.responsibleEmployee = _.filter(that.responsibleEmployee, function (employee) {
      //         return _.indexOf(that.editedItem.responsible_department_array, employee.department_id) > -1;
      //       });
      //     }
      //     that.editedItem.responsible_employee_array = _.intersection(_.pluck(that.responsibleEmployee, 'id'), that.editedItem.responsible_employee_array);
      //   } else {
      //     if (that.objectItem.responsible_department_array && that.objectItem.responsible_department_array.length > 0) {
      //       that.responsibleEmployee = _.filter(that.responsibleEmployee, function (employee) {
      //         return _.indexOf(that.objectItem.responsible_department_array, employee.department_id) > -1;
      //       });
      //     }
      //     that.objectItem.responsible_employee_array = _.intersection(_.pluck(that.responsibleEmployee, 'id'), that.objectItem.responsible_employee_array);
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

<template>
  <div>
    <b-row v-if="!securityItem.is_public || roleUser === 'user'">
      <b-col cols="2" class="hse-document-badge-tab">
        <div class="bold-title md-line-height">
          {{ $t('title.security') }}
        </div>
        <v-badge
          :value="hover"
          right
          transition="slide-x-transition"
          class="hse-badge-icon"
        >
          <span slot="badge">Object viewable for only you or public</span>
          <v-hover v-model="hover">
            <i class="fa fa-question-circle"></i>
          </v-hover>
        </v-badge>
      </b-col>
      <b-col cols="4">
        <div class="input-wrap">
          <div class="goal-type-wrap">
            <label class="left-text">{{ $t('form.personal') }}</label>
            <v-switch
              v-model="securityItem.is_public"
              :label="$t('form.shared')"
              class="right-text"
              inset
              :readonly="!securityItem.editPermission && securityItem.added_by !== userLogged"
              @change="changeSecurity('shared')"
            />
          </div>
        </div>
      </b-col>
    </b-row>
    <div v-else class="section-connect-to section-connect-to-security">
      <div class="section-connect-to-label section-connect-to-label-reminder">
        {{ $t('title.security') }}
      </div>
      <div class="goal-type-wrap reminder-type-switch">
        <label class="left-text">{{ $t('form.personal') }}</label>
        <v-switch
          v-model="securityItem.is_public"
          :label="$t('form.shared')"
          class="right-text"
          inset
          :readonly="!securityItem.editPermission && securityItem.added_by !== userLogged"
          @change="changeSecurity('personal')"
        />
      </div>
      <!-- Security - Choose viewable employees -->
      <b-row class="pt-3 mt-3">
        <b-col v-if="checkAdmin" cols="12">
          <div class="inline-row">
            <v-radio-group v-model="share_option" :rules="required" row class="hse-radio-checkbox">
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
<!--        <b-col cols="12">-->
<!--          <v-sheet class="pa-5">-->
<!--            <v-switch-->
<!--              v-model="securityItem.is_suggestion"-->
<!--              :disabled="!checkAdmin || !share_option"-->
<!--              inset-->
<!--              :label="$t('button.index')"-->
<!--            />-->
<!--          </v-sheet>-->
<!--        </b-col>-->
      </b-row>
      <div v-if="checkAdmin && share_option === 2 || !checkAdmin">
        <b-row>
          <b-col>
            <div class="input-wrap industry-select-input-wrap">
              <MultipleSelection
                :item="securityItem"
                :selected-items-input="securityItem.security_department_array_arr"
                :label="$t('form.department')"
                :item-text="'name'"
                :item-value="'id'"
                :list-option-input="departmentsArray"
                :disabled="departmentsArray.length <= 0"
                @getSelectedItems="getSelectedDepartureItems"
              />
            </div>
          </b-col>
          <!-- EMPLOYEES -->
          <b-col>
            <div class="input-wrap industry-select-input-wrap">
              <MultipleSelection
                :item="securityItem"
                :selected-items-input="securityItem.security_employee_array_arr"
                :label="$t('form.employees')"
                :item-text="'name'"
                :item-value="'id'"
                :list-option-input="securityEmployees"
                :disabled="securityEmployees.length <= 0"
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
    name: "DocumentSecurity",
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
      departmentsArray: [],
      projectArray: [],
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
      // that.$store.dispatch('departments/index', { filterBy: "security"}).then(result => {
      that.$store.dispatch('departments/index').then(result => {
        that.departmentsArray = result.data;
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
      // that.$store.dispatch('employees/index', { filterBy: "security"}).then(result => {
      that.$store.dispatch('employees/index').then(result => {
        _.each(result.data, function(i) {
          i.name = i.name + ' - ' + i.department_name;
        });
        that.securityEmployees = _.filter(result.data, function (item) {
          return item.role_id !== 2 && !item.disable_status;
        });
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
        this.checkChangeSecurity = this.checkChangeSecurity + 1;
        this.$emit('changeSecurity', {
          condition: val,
          countChange: this.checkChangeSecurity
        });
      },

      addNew() {
        this.share_option = 1;
      },

      editItem(item) {
        item.security_department_array_arr = this.formatNullArray(this.formatFromStringToArray(item.security_department_array));
        item.security_employee_array_arr = this.formatNullArray(this.formatFromStringToArray(item.security_employee_array));
        if (item.security_department_array === null && item.security_employee_array === null) {
          this.share_option = 1;
        } else {
          this.share_option = 2;
        }
        return item;
      },

      changeOption(option) {
        if (option !== this.share_option) {
          this.securityItem.security_employee_array_arr = [];
          this.securityItem.security_department_array_arr = [];
          if (option === 1) {
            this.changeSecurity('all');
          } else {
            this.changeSecurity('custom');
          }
        }
      },

      getSelectedDepartureItems(value) {
        this.securityItem.security_department_array_arr = value.selectedItemsOutput;
        this.changeSecurity('department');
      },

      getSelectedEmployeesItems(value) {
        this.securityItem.security_employee_array_arr = value.selectedItemsOutput;
        this.changeSecurity('employee');
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

<template>
  <div class="section-connect-to mb-5">
    <b-row>
      <b-col>
        <div class="section-connect-to-label">{{ $t('title.connect_to') }}</div>
        <div class="inline-row section-connect-to-checkbox">
          <v-checkbox
            v-model="connectCompany"
            :label="$t('form.company')"
            class="margin-right-sm"
            :disabled="denyEdit"
            @change="updateConnect"
          />
          <v-checkbox
            v-model="connectDepartment"
            :label="$t('form.department')"
            class="margin-right-sm"
            :disabled="denyEdit"
            @change="updateConnect"
          />
          <v-checkbox
            v-model="connectJobTitle"
            :label="$t('form.job_title')"
            class="margin-right-sm"
            :disabled="denyEdit"
            @change="updateConnect"
          />
          <v-checkbox
            v-if="false"
            v-model="connectProject"
            label="Project"
            :disabled="denyEdit"
            @change="updateConnect"
          />
        </div>
      </b-col>
    </b-row>
    <b-row v-if="connectCompany">
      <b-col cols="6">
        <v-sheet class="pa-5">
          <v-switch
            v-model="editedItem.is_suggestion"
            inset
            label="Show in suggestion list"
            :disabled="denyEdit"
            @change="updateConnect"
          />
        </v-sheet>
      </b-col>
    </b-row>
    <b-row v-if="connectDepartment">
      <b-col cols="3">
        <div class="mt-3 department-title-with-new">
          Department
        </div>
      </b-col>
      <b-col cols="5">
        <v-select
          v-model="editedItem.department_id"
          item-value="id"
          item-text="name"
          :items="departments"
          :rules="required"
          outlined
          :disabled="denyEdit"
          @change="updateConnect"
        />
      </b-col>
    </b-row>
    <b-row v-if="connectJobTitle">
      <b-col cols="3">
        <div class="mt-3 department-title-with-new">
          Job title
        </div>
      </b-col>
      <b-col cols="5">
        <v-select
          v-model="editedItem.job_title_id"
          item-value="id"
          item-text="name"
          :items="jobTitles"
          :rules="required"
          outlined
          :disabled="denyEdit"
          @change="updateConnect"
        />
      </b-col>
    </b-row>
    <b-row v-if="connectProject">
      <b-col cols="3">
        <div class="department-title-with-new">
          Project
        </div>
      </b-col>
      <b-col cols="5">
        <v-select
          v-model="editedItem.project_id"
          item-value="id"
          item-text="name"
          :items="projects"
          :rules="required"
          outlined
          :disabled="denyEdit"
          @change="updateConnect"
        />
      </b-col>
    </b-row>
  </div>
</template>
<script>
  // import {_} from 'vue-underscore';

  export default {
    props: {
      editedItem: {
        type: Object,
        required: false,
      },
      departmentsArray: {
        type: Array,
        required: false,
      },
      jobTitleArray: {
        type: Array,
        required: false,
      },
      projectArray: {
        type: Array,
        required: false,
      },
      denyEdit: {
        type: Boolean,
        required: false,
      },
    },
    data: function () {
      return {
        required: [
          v => {
            if (!v || v.length < 1)
              return 'This is required';
            else return true;
          }
        ],
        connectCompany: false,
        connectDepartment: false,
        connectJobTitle: false,
        connectProject: false,
        departments: [],
        jobTitles: [],
        projects: [],
      };
    },

    watch: {
      editedItem(value) {
        this.connectCompany = !!value.is_public;
        this.connectDepartment = !!value.department_id;
        this.connectJobTitle = !!value.job_title_id;
        this.connectProject = !!value.project_id;
        // if (value.job_title_id) {
        //   this.filterDepartments();
        // } else {
        //   this.departments = _.clone(this.departmentsArray);
        // }
      },

      jobTitleArray(value) {
        if (value.length > 0) {
          this.jobTitles = value;
        }
      },

      departmentsArray(value) {
        if (value.length > 0) {
          this.departments = value;
        }
      },

      // departmentsArray(value) {
      //   if (value.length > 0) {
      //     if (this.editedItem.job_title_id) {
      //       this.filterDepartments();
      //     } else {
      //       this.departments = _.clone(value);
      //     }
      //   }
      // },

      projectArray(value) {
        if (value.length > 0) {
          this.projects = value;
        }
      },

    },

    mounted() {
      this.connectCompany = !!this.editedItem.is_public;
      this.connectDepartment = !!this.editedItem.department_id;
      this.connectJobTitle = !!this.editedItem.job_title_id;
      this.connectProject = !!this.editedItem.project_id;

      if (this.departmentsArray && this.departmentsArray.length > 0) {
        this.departments = this.departmentsArray;
      }
      if (this.jobTitleArray && this.jobTitleArray.length > 0) {
        this.jobTitles = this.jobTitleArray;
      }
      if (this.projectArray && this.projectArray.length > 0) {
        this.projects = this.projectArray;
      }
      // if (this.editedItem.job_title_id) {
      //   this.filterDepartments();
      // } else {
      //   this.jobTitles = _.clone(this.jobTitleArray);
      // }
    },

    methods: {
      // updateJobTitle() {
      //   let that = this;
      //   if (that.connectJobTitle && that.editedItem.job_title_id) {
      //     that.editedItem.department_id = '';
      //     that.filterDepartments();
      //     // that.editedItem.project_id = '';
      //   } else {
      //     that.jobTitles = _.clone(that.jobTitleArray);
      //   }
      //   that.updateConnect();
      // },

      // filterDepartments() {
      //   let that = this;
      //   let jobTitle = _.find(that.jobTitles, function (item) {
      //     return item.id === that.editedItem.job_title_id;
      //   });
      //   that.departments = [];
      //   _.each(that.departmentsArray, function (item) {
      //     if (_.indexOf(JSON.parse(jobTitle.department), item.id) > -1) {
      //       that.departments.push(item);
      //     }
      //   });
      // },

      updateConnect() {
        if (!this.connectCompany) {
          this.editedItem.is_suggestion = false;
        }
        this.$emit('updateConnect', {
          connectCompany: this.connectCompany,
          connectDepartment: this.connectDepartment,
          connectJobTitle: this.connectJobTitle,
          connectProject: this.connectProject,
          editedItem: this.editedItem,
        });
      },
    }
  };
</script>

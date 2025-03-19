<template>
  <div class="deviation-page">
    <v-container>
      <v-row>
        <v-col>
          <Calendar />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6">
          <DashboardCard
            type="taskAssignee"
            :mode="roleUser"
            chart-type="doughnut"
            main-title="personal task status"
            description="total tasks"
          />
        </v-col>
<!--        <v-col cols="12" sm="6">-->
<!--          <DashboardCard-->
<!--            type="task"-->
<!--            :mode="roleUser"-->
<!--            chart-type="bar"-->
<!--            main-title="task"-->
<!--            description="with the average of the department"-->
<!--          />-->
<!--        </v-col>-->
        <v-col cols="12" sm="6">
          <DashboardCard
            type="deviation"
            :mode="roleUser"
            chart-type="bar"
            main-title="deviation"
            description="with the average of the department"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <DashboardCard
            type="goal"
            :mode="roleUser"
            chart-type="bar"
            main-title="goal"
            description="with the average of the department"
          />
        </v-col>
<!--        <v-col cols="12" sm="6">-->
<!--          <DashboardCard-->
<!--            type="routine"-->
<!--            :mode="roleUser"-->
<!--            chart-type="bar"-->
<!--            main-title="routine"-->
<!--            description="with the average of the department"-->
<!--          />-->
<!--        </v-col>-->
<!--        <v-col cols="12" sm="6">-->
<!--          <DashboardCard-->
<!--            type="instruction"-->
<!--            :mode="roleUser"-->
<!--            chart-type="bar"-->
<!--            main-title="instruction"-->
<!--            description="with the average of the department"-->
<!--          />-->
<!--        </v-col>-->
<!--        <v-col cols="12" sm="6">-->
<!--          <DashboardCard-->
<!--            type="risk element"-->
<!--            :mode="roleUser"-->
<!--            chart-type="bar"-->
<!--            main-title="risk area"-->
<!--            description="with the average of the department"-->
<!--          />-->
<!--        </v-col>-->
<!--        <v-col cols="12" sm="6">-->
<!--          <DashboardCard-->
<!--            type="checklist"-->
<!--            :mode="roleUser"-->
<!--            chart-type="bar"-->
<!--            main-title="checklist"-->
<!--            description="with the average of the department"-->
<!--          />-->
<!--        </v-col>-->
        <v-col cols="12" sm="6">
          <DashboardCard
            type="contact"
            :mode="roleUser"
            chart-type="doughnut"
            main-title="contact"
            description="total contacts"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <DashboardCard
            type="document"
            :mode="roleUser"
            chart-type="bar"
            main-title="document"
            description="with the average of the department"
          />
        </v-col>
<!--        <v-col cols="12" sm="6">-->
<!--          <DashboardCard-->
<!--            type="report checklist"-->
<!--            :mode="roleUser"-->
<!--            chart-type="bar"-->
<!--            main-title="report"-->
<!--            description="with the average of the department"-->
<!--          />-->
<!--        </v-col>-->
<!--        <v-col cols="12" sm="6">-->
<!--          <DashboardCard-->
<!--            type="risk analysis"-->
<!--            :mode="roleUser"-->
<!--            chart-type="bar"-->
<!--            main-title="risk analysis"-->
<!--            description="with the average of the department"-->
<!--          />-->
<!--        </v-col>-->
      </v-row>
    </v-container>
  </div>
</template>
<script>
import cookies from 'js-cookie';
import DashboardCard from "../../../components/DashboardCard";
import Calendar from "../../../components/Calendar";

export default {
  components: {
    DashboardCard,
    Calendar
  },

  data: () => ({
    roleUser: cookies.get('roleUser'),
  }),
};
</script>

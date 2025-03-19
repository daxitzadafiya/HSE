<template>
  <aside :class="'left-sidebar ' + page">
    <div class="scroll-sidebar">
      <nav class="sidebar-nav">
        <div class="current-page">
          {{ $t('menu.' + page) }}
        </div>
        <!-- COMPANY -->
        <ul v-if="page === 'dashboard'  || page === 'invoices' || page === 'emailLogs' " id="sidebarDashboard">
          <li>
            <nuxt-link :to="'/' + $i18n.locale + '/dashboard/overview'" :class="[link === 'overview' ? 'link-menu active' : 'link-menu']">
              <img src="~assets/images/icon/dashboard.png" alt="dashboard" class="dark-logo">
              <span class="link-menu-title">{{ $t('sidebar.overview') }}</span>
            </nuxt-link>
          </li>
<!--          <li>-->
<!--            <nuxt-link :to="'/' + $i18n.locale + '/dashboard/calendar'" :class="[link === 'calendar' ? 'link-menu active' : 'link-menu']">-->
<!--              <img src="~assets/images/icon/dashboard.png" alt="calendar" class="dark-logo">-->
<!--&lt;!&ndash;              <span class="link-menu-title">{{ $t('sidebar.calendar') }}</span>&ndash;&gt;-->
<!--              <span class="link-menu-title">Calendar</span>-->
<!--            </nuxt-link>-->
<!--          </li>-->
          <li >
            <nuxt-link :to="'/' + $i18n.locale + '/company/company'" :class="[link === 'company' ? 'link-menu active' : 'link-menu']">
              <img src="~assets/images/icon/company.png" alt="company" class="dark-logo">
              <span class="link-menu-title">{{ $t('sidebar.company') }}</span>
            </nuxt-link>
          </li>
          <li>
            <nuxt-link :to="'/' + $i18n.locale + '/employees/overview'" :class="[link === 'tasks' ? 'link-menu active' : 'link-menu']">
              <img src="~assets/images/icon/employees.png" alt="tasks" class="dark-logo">
              <span class="link-menu-title">{{ $t('sidebar.employees') }}</span>
            </nuxt-link>
          </li>
          <li class="d-flex align-items-center " style="gap:10px">
            <nuxt-link :to="'/' + $i18n.locale + '/documents/documents'" :class="[link === 'documents' ? 'link-menu active' : 'link-menu' ,getActivateMenuClasses(!!lastPlanActive?.document, !planActive.document)]">
                      <img src="~assets/images/icon/documents.png" alt="tasks" class="dark-logo">
                      <span class="link-menu-title">{{ $t('sidebar.documents') }}</span>
              </nuxt-link>
              <div @mouseenter="hoverDocumentPlanAccess = true" @mouseleave="hoverDocumentPlanAccess = false" v-if="!planActive.document && !lastPlanActive?.document">
                <i class="fa fa-question-circle mr-2"></i>
                <v-badge :value="hoverDocumentPlanAccess"
                  right
                  transition="slide-x-transition"
                  class="hse-badge-icon badge-page-instruction"
                  style="cursor: pointer;">
                  <span slot="badge" @click="redirectUrl">{{ $t('message.accessible_module') }}</span>
                </v-badge>
              </div>
          </li>
          <li>
              <nuxt-link :to="'/' + $i18n.locale + '/reports/reportedChecklists'" :class="[link === 'tasks' ? 'link-menu active' : 'link-menu']">
                <img src="~assets/images/icon/reports.png" alt="tasks" class="dark-logo">
                <span class="link-menu-title">{{ $t('sidebar.reports') }}</span>
              </nuxt-link>
            </li>
              <li>
                  <nuxt-link :to="'/' + $i18n.locale + '/invoices/invoices'" :class="[link === 'invoices' ? 'link-menu active' : 'link-menu']">
                      <img src="~assets/images/icon/icon12.svg" alt="job-title" class="dark-logo">
                      <span class="link-menu-title">{{ $t('sidebar.invoices') }}</span>
                  </nuxt-link>
            </li>

            <li>
                  <nuxt-link :to="'/' + $i18n.locale + '/emailLogs/emailLogs'" :class="[link === 'emailLogs' ? 'link-menu active' : 'link-menu']">
                      <img src="~assets/images/icon/icon12.svg" alt="job-title" class="dark-logo">
                      <span class="link-menu-title">{{ $t('sidebar.emailLogs') }}</span>
                  </nuxt-link>
            </li>
        </ul>

        <!-- COMPANY -->
        <ul v-else-if="page === 'company'" id="sidebarnav">
          <li>
            <nuxt-link :to="'/' + $i18n.locale + '/company/company'" :class="[link === 'company' ? 'link-menu active' : 'link-menu']">
              <img src="~assets/images/icon/company.png" alt="company" class="dark-logo">
              <span class="link-menu-title">{{ $t('sidebar.company') }}</span>
            </nuxt-link>
          </li>

          <li class="d-flex align-items-center" style="gap:10px">
            <nuxt-link :to="'/' + $i18n.locale + '/company/tasks'" class="textFont" :class="[link === 'tasks' ? 'link-menu active' : 'link-menu' ,getActivateMenuClasses(!!lastPlanActive?.task, !planActive.task)]" >
                <img src="~assets/images/icon/tasks.png" alt="tasks" class="dark-logo">
                <span class="link-menu-title">{{ $t('sidebar.tasks') }}</span>
             </nuxt-link>
             <div @mouseenter="hoverTaskPlanAccess = true" @mouseleave="hoverTaskPlanAccess = false" v-if="!planActive.task && !lastPlanActive?.task">
              <i class="fa fa-question-circle mr-2"></i>
              <v-badge :value="hoverTaskPlanAccess"
                right
                transition="slide-x-transition"
                class="hse-badge-icon badge-page-instruction"
                style="cursor: pointer;">
                  <span slot="badge" @click="redirectUrl">{{ $t('message.accessible_module') }}</span>
              </v-badge>
             </div>
          </li>

          <li class="d-flex align-items-center pt-1" style="gap:10px">
            <nuxt-link :to="'/' + $i18n.locale + '/company/deviations'" class="textFont" :class="[link === 'deviations' ? 'link-menu active' : 'link-menu' ,getActivateMenuClasses(!!lastPlanActive?.deviation, !planActive.deviation)
                ]">
                <img src="~assets/images/icon/deviations.png" alt="deviation" class="dark-logo">
                <span class="link-menu-title">{{ $t('sidebar.deviations') }}</span>
              </nuxt-link>
              <div @mouseenter="hoverDeviationPlanAccess = true" @mouseleave="hoverDeviationPlanAccess = false" v-if="!planActive.deviation && !lastPlanActive?.deviation">
                <i class="fa fa-question-circle mr-2"></i>
                <v-badge :value="hoverDeviationPlanAccess"
                  right
                  transition="slide-x-transition"
                  class="hse-badge-icon badge-page-instruction"
                  style="cursor: pointer;">
                  <span slot="badge" @click="redirectUrl">{{ $t('message.accessible_module') }}</span>
                </v-badge>
              </div>
          </li>

          <li class="d-flex align-items-center pt-1" style="gap:10px">
            <nuxt-link :to="'/' + $i18n.locale + '/company/goals'" class="textFont" :class="[link === 'goals' ? 'link-menu active' : 'link-menu' ,getActivateMenuClasses(!!lastPlanActive?.goal, !planActive.goal)]">
                <img src="~assets/images/icon/goals.png" alt="goals" class="dark-logo">
                <span class="link-menu-title">{{ $t('sidebar.goals') }}</span>
              </nuxt-link>
              <div @mouseenter="hoverGoalPlanAccess = true" @mouseleave="hoverGoalPlanAccess = false" v-if="!planActive.goal && !lastPlanActive?.goal">
                <i class="fa fa-question-circle mr-2"></i>
                <v-badge :value="hoverGoalPlanAccess"
                  right
                  transition="slide-x-transition"
                  class="hse-badge-icon badge-page-instruction"
                  style="cursor: pointer;">
                  <span slot="badge" @click="redirectUrl">{{ $t('message.accessible_module') }}</span>
                </v-badge>
              </div>
          </li>

          <li class="d-flex align-items-center pt-1" style="gap:10px">
            <nuxt-link :to="'/' + $i18n.locale + '/company/routines'" class="textFont" :class="[link === 'routines' ? 'link-menu active' : 'link-menu' ,getActivateMenuClasses(!!lastPlanActive?.routine, !planActive.routine)]">
                <img src="~assets/images/icon/routines.png" alt="routines" class="dark-logo cust-space">
                <span class="link-menu-title">{{ $t('sidebar.routines') }}</span>
             </nuxt-link>
             <div @mouseenter="hoverRoutinePlanAccess = true" @mouseleave="hoverRoutinePlanAccess = false" v-if="!planActive.routine && !lastPlanActive?.routine">
              <i class="fa fa-question-circle mr-2"></i>
              <v-badge :value="hoverRoutinePlanAccess"
                right
                transition="slide-x-transition"
                class="hse-badge-icon badge-page-instruction"
                style="cursor: pointer;">
                  <span slot="badge" @click="redirectUrl">{{ $t('message.accessible_module') }}</span>
              </v-badge>
             </div>
          </li>

          <li class="d-flex align-items-center pt-1" style="gap:10px">
            <nuxt-link :to="'/' + $i18n.locale + '/company/instructions'" class="textFont" :class="[link === 'instructions' ? 'link-menu active' : 'link-menu' ,getActivateMenuClasses(!!lastPlanActive?.instruction, !planActive.instruction)]">
                <img src="~assets/images/icon/instructions.png" alt="instructions" class="dark-logo cust-space">
                <span class="link-menu-title">{{ $t('sidebar.instructions') }}</span>
              </nuxt-link>
              <div @mouseenter="hoverInstructionPlanAccess = true" @mouseleave="hoverInstructionPlanAccess = false" v-if="!planActive.instruction && !lastPlanActive?.instruction">
                <i class="fa fa-question-circle mr-2"></i>
                <v-badge :value="hoverInstructionPlanAccess"
                  right
                  transition="slide-x-transition"
                  class="hse-badge-icon badge-page-instruction"
                  style="cursor: pointer;">
                  <span slot="badge" @click="redirectUrl">{{ $t('message.accessible_module') }}</span>
                </v-badge>
              </div>
          </li>

          <li class="d-flex align-items-center pt-1" style="gap:10px">
            <nuxt-link :to="'/' + $i18n.locale + '/company/riskAreas'" class="textFont" :class="[link === 'riskAreas' ? 'link-menu active' : 'link-menu' ,getActivateMenuClasses(!!lastPlanActive?.risk, !planActive.risk)]">
                <img src="~assets/images/icon/risk-area.png" alt="riskAreas" class="dark-logo cust-space">
                <span class="link-menu-title">{{ $t('sidebar.risk_areas') }}</span>
              </nuxt-link>
              <div @mouseenter="hoverRiskPlanAccess = true" @mouseleave="hoverRiskPlanAccess = false" v-if="!planActive.risk && !lastPlanActive?.risk">
                <i class="fa fa-question-circle mr-2"></i>
                <v-badge :value="hoverRiskPlanAccess"
                  right
                  transition="slide-x-transition"
                  class="hse-badge-icon badge-page-instruction"
                  style="cursor: pointer;">
                  <span slot="badge" @click="redirectUrl">{{ $t('message.accessible_module') }}</span>
                </v-badge>
              </div>
          </li>

          <li class="d-flex align-items-center pt-1" style="gap:10px">
            <nuxt-link :to="'/' + $i18n.locale + '/company/checklists'" class="textFont" :class="[link === 'checklists' ? 'link-menu active' : 'link-menu' ,getActivateMenuClasses(!!lastPlanActive?.checklist, !planActive.checklist)]">
                <img src="~assets/images/icon/checklists.png" alt="overview" class="dark-logo cust-space">
                <span class="link-menu-title">{{ $t('sidebar.checklists') }}</span>
              </nuxt-link>
              <div @mouseenter="hoverChecklistPlanAccess = true" @mouseleave="hoverChecklistPlanAccess = false" v-if="!planActive.checklist && !lastPlanActive?.checklist">
                <i class="fa fa-question-circle mr-2"></i>
                <v-badge :value="hoverChecklistPlanAccess"
                  right
                  transition="slide-x-transition"
                  class="hse-badge-icon badge-page-instruction"
                  style="cursor: pointer;">
                  <span slot="badge" @click="redirectUrl">{{ $t('message.accessible_module') }}</span>
                </v-badge>
              </div>
          </li>

          <li class="d-flex align-items-center pt-1" style="gap:10px">
            <nuxt-link :to="'/' + $i18n.locale + '/company/contacts'" class="textFont" :class="[link === 'contacts' ? 'link-menu active' : 'link-menu' ,getActivateMenuClasses(!!lastPlanActive?.contact, !planActive.contact)]">
                <img src="~assets/images/icon/contacts.png" alt="contacts" class="dark-logo cust-space">
                <span class="link-menu-title">{{ $t('sidebar.contacts') }}</span>
              </nuxt-link>
              <div >
                <div @mouseenter="hoverContactPlanAccess = true" @mouseleave="hoverContactPlanAccess = false" v-if="!planActive.contact && !lastPlanActive?.contact">
                <i class="fa fa-question-circle mr-2"></i>
                <v-badge :value="hoverContactPlanAccess"
                  right
                  transition="slide-x-transition"
                  class="hse-badge-icon badge-page-instruction"
                  style="cursor: pointer;">
                  <span slot="badge" @click="redirectUrl">{{ $t('message.accessible_module') }}</span>
                </v-badge>
              </div>
              </div>
          </li>

          <li class="d-flex align-items-center pt-1" style="gap:10px">
            <nuxt-link :to="'/' + $i18n.locale + '/documents/documents'" class="textFont" :class="[link === 'documents' ? 'link-menu active' : 'link-menu' ,getActivateMenuClasses(!!lastPlanActive?.document, !planActive.document)]">
                <img src="~assets/images/icon/documents.png" alt="tasks" class="dark-logo">
                <span class="link-menu-title">{{ $t('sidebar.documents') }}</span>
              </nuxt-link>
              <div @mouseenter="hoverDocumentPlanAccess = true" @mouseleave="hoverDocumentPlanAccess = false" v-if="!planActive.document && !lastPlanActive?.document">
              <i class="fa fa-question-circle mr-2"></i>
              <v-badge :value="hoverDocumentPlanAccess"
                right
                transition="slide-x-transition"
                class="hse-badge-icon badge-page-instruction"
                style="cursor: pointer;">
                  <span slot="badge" @click="redirectUrl">{{ $t('message.accessible_module') }}</span>
              </v-badge>
              </div>
          </li>

          <li>
            <nuxt-link :to="'/' + $i18n.locale + '/reports/reportedRiskanalysis'" :class="[link === 'reportedRiskanalysis' ? 'link-menu active' : 'link-menu']">
              <img src="~assets/images/icon/report-risk-analysis.png" alt="reportedRiskanalysis" class="dark-logo">
              <span class="link-menu-title">{{ $t('sidebar.report_risk_analysis') }}</span>
            </nuxt-link>
          </li>
<!--          <li v-if="checkAdmin">-->
<!--            <nuxt-link to="/company/absenceSetting" :class="[link === 'absenceSetting' ? 'link-menu active' : 'link-menu']">-->
<!--              <img src="~assets/images/icon/contacts.png" alt="contacts" class="dark-logo">-->
<!--              <span class="link-menu-title">Absence Setting</span>-->
<!--            </nuxt-link>-->
<!--          </li>-->
        </ul>

        <!-- EMPLOYEE -->
        <ul v-else-if="page === 'employees'" id="sidebarnavEmployee">
          <li>
            <nuxt-link :to="'/' + $i18n.locale + '/employees/overview'" :class="[link === 'overview' ? 'link-menu active' : 'link-menu']">
              <img src="~assets/images/icon/employees.png" alt="employeeOverview" class="dark-logo">
              <span class="link-menu-title">{{ $t('sidebar.overview') }}</span>
            </nuxt-link>
          </li>
<!--          <li>-->
<!--            <nuxt-link to="/employees/organization" :class="[link === 'organization' ? 'link-menu active' : 'link-menu']">-->
<!--              <img src="~assets/images/icon/icon13.svg" alt="organization" class="dark-logo">-->
<!--              <span class="link-menu-title">Organization chart</span>-->
<!--            </nuxt-link>-->
<!--          </li>-->
<!--          <li>-->
<!--            <nuxt-link to="/employees/timeTracking" :class="[link === 'timeTracking' ? 'link-menu active' : 'link-menu']">-->
<!--              <img src="~assets/images/icon/documents.png" alt="timeTracking" class="dark-logo">-->
<!--              <span class="link-menu-title">Time Tracking</span>-->
<!--            </nuxt-link>-->
<!--          </li>-->
<!--          <li>-->
<!--            <nuxt-link to="/employees/workplan" :class="[link === 'workplan' ? 'link-menu active' : 'link-menu']">-->
<!--              <img src="~assets/images/icon/reports.png" alt="workplan" class="dark-logo">-->
<!--              <span class="link-menu-title">Workplan</span>-->
<!--            </nuxt-link>-->
<!--          </li>-->
<!--          <li>-->
<!--            <nuxt-link to="/employees/absences" :class="[link === 'absences' ? 'link-menu active' : 'link-menu']">-->
<!--              <img src="~assets/images/icon/icon16.svg" alt="absences" class="dark-logo">-->
<!--              <span class="link-menu-title">Absences</span>-->
<!--            </nuxt-link>-->
<!--          </li>-->
<!--          <li>-->
<!--            <nuxt-link to="/employees/appraisals" :class="[link === 'appraisals' ? 'link-menu active' : 'link-menu']">-->
<!--              <img src="~assets/images/icon/icon17.svg" alt="appraisals" class="dark-logo">-->
<!--              <span class="link-menu-title">Appraisals</span>-->
<!--            </nuxt-link>-->
<!--          </li>-->
        </ul>

        <!-- DOCUMENTS -->
        <ul v-else-if="page === 'documents'" id="sidebarnavDocuments">
          <li>
            <nuxt-link :to="'/' + $i18n.locale + '/documents/documents'" :class="[link === 'documents' ? 'link-menu active' : 'link-menu']">
              <img src="~assets/images/icon/documents.png" alt="documents" class="dark-logo">
              <span class="link-menu-title">{{ $t('sidebar.documents') }}</span>
            </nuxt-link>
          </li>
          <li>
            <nuxt-link :to="'/' + $i18n.locale + '/documents/attachments'" :class="[link === 'attachments' ? 'link-menu active' : 'link-menu']">
              <img src="~assets/images/icon/attachments.png" alt="documentsAttachment" class="dark-logo">
              <span class="link-menu-title">{{ $t('sidebar.attachments') }}</span>
            </nuxt-link>
          </li>
          <li>
            <nuxt-link :to="'/' + $i18n.locale + '/documents/reports'" :class="[link === 'reports' ? 'link-menu active' : 'link-menu']">
              <img src="~assets/images/icon/reported-attachments.png" alt="documentsReport" class="dark-logo">
              <span class="link-menu-title">{{ $t('sidebar.reported_attachments') }}</span>
            </nuxt-link>
          </li>
        </ul>

        <!-- REPORT -->
        <ul v-else-if="page === 'reports'" id="sidebarnavReports">
          <li>
            <nuxt-link :to="'/' + $i18n.locale + '/reports/reportedChecklists'" :class="[link === 'reportedChecklists' ? 'link-menu active' : 'link-menu']">
              <img src="~assets/images/icon/report-checklists.png" alt="reportedChecklists" class="dark-logo">
              <span class="link-menu-title">{{ $t('sidebar.report_checklists') }}</span>
            </nuxt-link>
          </li>
          <li>
            <nuxt-link :to="'/' + $i18n.locale + '/reports/reportedRiskanalysis'" :class="[link === 'reportedRiskanalysis' ? 'link-menu active' : 'link-menu']">
              <img src="~assets/images/icon/report-risk-analysis.png" alt="reportedRiskanalysis" class="dark-logo">
              <span class="link-menu-title">{{ $t('sidebar.report_risk_analysis') }}</span>
            </nuxt-link>
          </li>
        </ul>
        <!-- administration -->
<!--        <ul v-else-if="page === 'administration'" id="sidebarnavAdministration">-->
<!--          <li>-->
<!--            <nuxt-link :to="'/' + $i18n.locale + '/administration/repositories'" :class="[link === 'repositories' ? 'link-menu active' : 'link-menu']">-->
<!--              <img src="~assets/images/icon/icon05.svg" alt="repositories" class="dark-logo">-->
<!--              <span class="link-menu-title">{{ $t('sidebar.repositories') }}</span>-->
<!--            </nuxt-link>-->
<!--          </li>-->
<!--        </ul>-->

        <!-- administration -->
        <ul v-else-if="page === 'settings' || page === 'billings'" id="sidebarnavSettings">
          <li>
            <nuxt-link :to="'/' + $i18n.locale + '/settings/categories'" :class="[link === 'categories' ? 'link-menu active' : 'link-menu']">
              <img src="~assets/images/icon/categories.png" alt="categories" class="dark-logo">
              <span class="link-menu-title">{{ $t('sidebar.categories') }}</span>
            </nuxt-link>
          </li>
          <li>
            <nuxt-link :to="'/' + $i18n.locale + '/settings/departments'" :class="[link === 'departments' ? 'link-menu active' : 'link-menu']">
              <img src="~assets/images/icon/departments.png" alt="departments" class="dark-logo">
              <span class="link-menu-title">{{ $t('sidebar.departments') }}</span>
            </nuxt-link>
          </li>
          <li>
            <nuxt-link :to="'/' + $i18n.locale + '/settings/jobTitles'" :class="[link === 'jobTitles' ? 'link-menu active' : 'link-menu']">
              <img src="~assets/images/icon/job-titles.png" alt="jobTitles" class="dark-logo">
              <span class="link-menu-title">{{ $t('sidebar.job_titles') }}</span>
            </nuxt-link>
          </li>
          <li>
            <nuxt-link :to="'/' + $i18n.locale + '/settings/userPermissions'" :class="[link === 'userPermissions' ? 'link-menu active' : 'link-menu']">
              <img src="~assets/images/icon/user-permissions.png" alt="userPermissions" class="dark-logo">
              <span class="link-menu-title">{{ $t('sidebar.user_permissions') }}</span>
            </nuxt-link>
          </li>
          <li>
            <nuxt-link :to="'/' + $i18n.locale + '/settings/repositories'" :class="[link === 'repositories' ? 'link-menu active' : 'link-menu']">
              <img src="~assets/images/icon/repositories.png" alt="repositories" class="dark-logo">
              <span class="link-menu-title">{{ $t('sidebar.repositories') }}</span>
            </nuxt-link>
          </li>
        <li>
            <nuxt-link :to="'/' + $i18n.locale + '/settings/billings'" :class="[link === 'billings' ? 'link-menu active' : 'link-menu']">
              <img src="~assets/images/icon/documents.png" alt="job-title" class="dark-logo">
              <span class="link-menu-title">{{ $t('sidebar.billings') }}</span>
              </nuxt-link>
        </li>

        </ul>

<!--        &lt;!&ndash; SUPER ADMIN &ndash;&gt;-->
<!--        &lt;!&ndash; OVERVIEW &ndash;&gt;-->
<!--        <ul v-else-if="page === 'overview' && checkSuperAdmin" id="sidebarnavOverview">-->
<!--          <li>-->
<!--            <nuxt-link :to="'/' + $i18n.locale + '/admin/overview/companies'" :class="[link === 'companies' ? 'link-menu active' : 'link-menu']">-->
<!--              <img src="~assets/images/icon/goals.png" alt="companySetting" class="dark-logo">-->
<!--              <span class="link-menu-title">{{ $t('sidebar.companies') }}</span>-->
<!--            </nuxt-link>-->
<!--          </li>-->
<!--          <li>-->
<!--            <nuxt-link :to="'/' + $i18n.locale + '/admin/overview/users'" :class="[link === 'users' ? 'link-menu active' : 'link-menu']">-->
<!--              <img src="~assets/images/icon/employees.png" alt="user" class="dark-logo">-->
<!--              <span class="link-menu-title">{{ $t('sidebar.users') }}</span>-->
<!--            </nuxt-link>-->
<!--          </li>-->
<!--          <li>-->
<!--            <nuxt-link :to="'/' + $i18n.locale + '/admin/overview/roles'" :class="[link === 'roles' ? 'link-menu active' : 'link-menu']">-->
<!--              <img src="~assets/images/icon/employees.png" alt="role" class="dark-logo">-->
<!--              <span class="link-menu-title">{{ $t('sidebar.roles') }}</span>-->
<!--            </nuxt-link>-->
<!--          </li>-->
<!--          <li>-->
<!--            <nuxt-link :to="'/' + $i18n.locale + '/admin/overview/jobTitles'" :class="[link === 'jobTitles' ? 'link-menu active' : 'link-menu']">-->
<!--              <img src="~assets/images/icon/employees.png" alt="job-title" class="dark-logo">-->
<!--              <span class="link-menu-title">{{ $t('sidebar.job_titles') }}</span>-->
<!--            </nuxt-link>-->
<!--          </li>-->
<!--        </ul>-->
<!--        &lt;!&ndash; RESOURCES &ndash;&gt;-->
<!--        <ul v-else-if="page === 'resources' && checkSuperAdmin" id="sidebarnavResources">-->
<!--          <li>-->
<!--            <nuxt-link :to="'/' + $i18n.locale + '/admin/resources/goals'" :class="[link === 'goals' ? 'link-menu active' : 'link-menu']">-->
<!--              <img src="~assets/images/icon/goals.png" alt="goals" class="dark-logo">-->
<!--              <span class="link-menu-title">{{ $t('sidebar.goals') }}</span>-->
<!--            </nuxt-link>-->
<!--          </li>-->
<!--          <li>-->
<!--            <nuxt-link :to="'/' + $i18n.locale + '/admin/resources/routines'" :class="[link === 'routines' ? 'link-menu active' : 'link-menu']">-->
<!--              <img src="~assets/images/icon/routines.png" alt="routines" class="dark-logo">-->
<!--              <span class="link-menu-title">{{ $t('sidebar.routines') }}</span>-->
<!--            </nuxt-link>-->
<!--          </li>-->
<!--          <li>-->
<!--            <nuxt-link :to="'/' + $i18n.locale + '/admin/resources/instructions'" :class="[link === 'instructions' ? 'link-menu active' : 'link-menu']">-->
<!--              <img src="~assets/images/icon/instructions.png" alt="instructions" class="dark-logo">-->
<!--              <span class="link-menu-title">{{ $t('sidebar.instructions') }}</span>-->
<!--            </nuxt-link>-->
<!--          </li>-->
<!--          <li>-->
<!--            <nuxt-link :to="'/' + $i18n.locale + '/admin/resources/documents'" :class="[link === 'documents' ? 'link-menu active' : 'link-menu']">-->
<!--              <img src="~assets/images/icon/documents.png" alt="documents" class="dark-logo">-->
<!--              <span class="link-menu-title">{{ $t('sidebar.documents') }}</span>-->
<!--            </nuxt-link>-->
<!--          </li>-->
<!--          <li>-->
<!--            <nuxt-link :to="'/' + $i18n.locale + '/admin/resources/checklists'" :class="[link === 'checklists' ? 'link-menu active' : 'link-menu']">-->
<!--              <img src="~assets/images/icon/company.png" alt="checklists" class="dark-logo">-->
<!--              <span class="link-menu-title">{{ $t('sidebar.checklists') }}</span>-->
<!--            </nuxt-link>-->
<!--          </li>-->
<!--&lt;!&ndash;          <li>&ndash;&gt;-->
<!--&lt;!&ndash;            <nuxt-link to="/resources/appraisals" :class="[link === 'appraisals' ? 'link-menu active' : 'link-menu']">&ndash;&gt;-->
<!--&lt;!&ndash;              <img src="~assets/images/icon/icon17.svg" alt="appraisals" class="dark-logo">&ndash;&gt;-->
<!--&lt;!&ndash;              <span class="link-menu-title">Appraisals</span>&ndash;&gt;-->
<!--&lt;!&ndash;            </nuxt-link>&ndash;&gt;-->
<!--&lt;!&ndash;          </li>&ndash;&gt;-->
<!--        </ul>-->
<!--        &lt;!&ndash; SETTING &ndash;&gt;-->
<!--        <ul v-else-if="page === 'settings' && checkSuperAdmin" id="sidebarnavSetting">-->
<!--          <li>-->
<!--            <nuxt-link :to="'/' + $i18n.locale + '/admin/settings/categories'" :class="[link === 'categories' ? 'link-menu active' : 'link-menu']">-->
<!--              <img src="~assets/images/icon/icon19.svg" alt="categories" class="dark-logo">-->
<!--              <span class="link-menu-title">{{ $t('sidebar.categories') }}</span>-->
<!--            </nuxt-link>-->
<!--          </li>-->
<!--          <li>-->
<!--            <nuxt-link :to="'/' + $i18n.locale + '/admin/settings/industries'" :class="[link === 'industries' ? 'link-menu active' : 'link-menu']">-->
<!--              <img src="~assets/images/icon/company.png" alt="industries" class="dark-logo">-->
<!--              <span class="link-menu-title">{{ $t('sidebar.industries') }}</span>-->
<!--            </nuxt-link>-->
<!--          </li>-->
<!--&lt;!&ndash;          <li>&ndash;&gt;-->
<!--&lt;!&ndash;            <nuxt-link :to="'/' + $i18n.locale + '/settings/absenceSetting'" :class="[link === 'absenceSetting' ? 'link-menu active' : 'link-menu']">&ndash;&gt;-->
<!--&lt;!&ndash;              <img src="~assets/images/icon/company.png" alt="absenceSetting" class="dark-logo">&ndash;&gt;-->
<!--&lt;!&ndash;              <span class="link-menu-title">Absence Setting</span>&ndash;&gt;-->
<!--&lt;!&ndash;            </nuxt-link>&ndash;&gt;-->
<!--&lt;!&ndash;          </li>&ndash;&gt;-->
<!--          <li>-->
<!--            <nuxt-link :to="'/' + $i18n.locale + '/admin/settings/help'" :class="[link === 'help' ? 'link-menu active' : 'link-menu']">-->
<!--              <img src="~assets/images/icon/icon19.svg" alt="help" class="dark-logo">-->
<!--              <span class="link-menu-title">Help Center Setting</span>-->
<!--            </nuxt-link>-->
<!--          </li>-->
<!--        </ul>-->
<!--        &lt;!&ndash; ADD ONS &ndash;&gt;-->
<!--        <ul v-else-if="page === 'addons' && checkSuperAdmin" id="sidebarnavAddons">-->
<!--          <li>-->
<!--            <nuxt-link :to="'/' + $i18n.locale + '/admin/addons/descriptions'" :class="[link === 'descriptions' ? 'link-menu active' : 'link-menu']">-->
<!--              <img src="~assets/images/icon/icon19.svg" alt="descriptions" class="dark-logo">-->
<!--              <span class="link-menu-title">{{ $t('sidebar.descriptions') }}</span>-->
<!--            </nuxt-link>-->
<!--          </li>-->
<!--          <li>-->
<!--            <nuxt-link :to="'/' + $i18n.locale + '/admin/addons/notifications'" :class="[link === 'notifications' ? 'link-menu active' : 'link-menu']">-->
<!--              <img src="~assets/images/icon/icon19.svg" alt="notifications" class="dark-logo">-->
<!--              <span class="link-menu-title">{{ $t('sidebar.notifications') }}</span>-->
<!--            </nuxt-link>-->
<!--          </li>-->
<!--&lt;!&ndash;          <li>&ndash;&gt;-->
<!--&lt;!&ndash;            <nuxt-link :to="'/' + $i18n.locale + '/addons/repositories'" :class="[link === 'repositories' ? 'link-menu active' : 'link-menu']">&ndash;&gt;-->
<!--&lt;!&ndash;              <img src="~assets/images/icon/icon19.svg" alt="categories" class="dark-logo">&ndash;&gt;-->
<!--&lt;!&ndash;              <span class="link-menu-title">Repositories</span>&ndash;&gt;-->
<!--&lt;!&ndash;            </nuxt-link>&ndash;&gt;-->
<!--&lt;!&ndash;          </li>&ndash;&gt;-->
<!--        </ul>-->

<!--        &lt;!&ndash; HELP CENTER &ndash;&gt;-->
<!--        <div v-else-if="page === 'help-center'" class="help-center-page">-->
<!--          <v-expansion-panels-->
<!--            multiple-->
<!--            flat-->
<!--          >-->
<!--            <v-expansion-panel-->
<!--              v-for="(menu,item_menu) in help_menu"-->
<!--              :key="item_menu"-->
<!--            >-->
<!--              <v-expansion-panel-header-->
<!--                v-if="!((checkSuperAdmin && menu.id > 2) || (roleUser === 'user' && menu.id === 1))"-->
<!--              >-->
<!--                {{ menu.title }}-->
<!--              </v-expansion-panel-header>-->
<!--              <v-expansion-panel-content>-->
<!--                <v-expansion-panels-->
<!--                  multiple-->
<!--                  flat-->
<!--                >-->
<!--                  <v-expansion-panel-->
<!--                    v-for="(article, item_article) in listHelpGuide"-->
<!--                    :key="item_article"-->
<!--                    :readonly="article.topics.length === 0"-->
<!--                    @click="getHelpDetail(article)"-->
<!--                  >-->
<!--                    <v-expansion-panel-header-->
<!--                      v-if="article.menu_function === menu.title"-->
<!--                      :hide-actions="article.topics.length === 0"-->
<!--                    >-->
<!--                      {{ article.name }}-->
<!--                    </v-expansion-panel-header>-->
<!--                    <v-expansion-panel-content-->
<!--                      v-if="article.menu_function === menu.title && article.topics"-->
<!--                    >-->
<!--                      <v-expansion-panels-->
<!--                        multiple-->
<!--                        flat-->
<!--                      >-->
<!--                        <v-expansion-panel-->
<!--                          v-for="(topic, item_topic) in article.topics"-->
<!--                          :key="item_topic"-->
<!--                          readonly-->
<!--                          @click="getHelpDetail(topic)"-->
<!--                        >-->
<!--                          <v-expansion-panel-header hide-actions>-->
<!--                            {{ topic.name }}-->
<!--                          </v-expansion-panel-header>-->
<!--                          &lt;!&ndash;                        <v-expansion-panel-content v-if="topic.sub_topics">&ndash;&gt;-->
<!--                          &lt;!&ndash;                          <v-expansion-panels&ndash;&gt;-->
<!--                          &lt;!&ndash;                            multiple&ndash;&gt;-->
<!--                          &lt;!&ndash;                            flat&ndash;&gt;-->
<!--                          &lt;!&ndash;                          >&ndash;&gt;-->
<!--                          &lt;!&ndash;                            <v-expansion-panel&ndash;&gt;-->
<!--                          &lt;!&ndash;                              v-for="(sub_topic, item_sub_topic) in topic.sub_topics"&ndash;&gt;-->
<!--                          &lt;!&ndash;                              :key="item_sub_topic"&ndash;&gt;-->
<!--                          &lt;!&ndash;                            >&ndash;&gt;-->
<!--                          &lt;!&ndash;                              <v-expansion-panel-header>&ndash;&gt;-->
<!--                          &lt;!&ndash;                                {{ sub_topic.name }}&ndash;&gt;-->
<!--                          &lt;!&ndash;                              </v-expansion-panel-header>&ndash;&gt;-->
<!--                          &lt;!&ndash;                              <v-expansion-panel-content>&ndash;&gt;-->
<!--                          &lt;!&ndash;                                {{ sub_topic.description }}&ndash;&gt;-->
<!--                          &lt;!&ndash;                              </v-expansion-panel-content>&ndash;&gt;-->
<!--                          &lt;!&ndash;                            </v-expansion-panel>&ndash;&gt;-->
<!--                          &lt;!&ndash;                          </v-expansion-panels>&ndash;&gt;-->
<!--                          &lt;!&ndash;                        </v-expansion-panel-content>&ndash;&gt;-->
<!--                        </v-expansion-panel>-->
<!--                      </v-expansion-panels>-->
<!--                    </v-expansion-panel-content>-->
<!--                  </v-expansion-panel>-->
<!--                </v-expansion-panels>-->
<!--              </v-expansion-panel-content>-->
<!--            </v-expansion-panel>-->
<!--          </v-expansion-panels>-->
<!--        </div>-->

        <ul v-else id="">
          <li>
            <nuxt-link to="">
              <span class="hide-menu">{{ $t('sidebar.overview') }}</span>
            </nuxt-link>
          </li>
        </ul>
      </nav>
    </div>
  </aside>
</template>
<script>
  import cookies from "js-cookie";
  // import {_} from 'vue-underscore';P

  export default {
    data() {
      return {
        page: this.$router.history.current.path.split("/")[2],
        link: this.$router.history.current.path.split("/")[this.$router.history.current.path.split("/").length - 1],
        permissionsUser: localStorage.getItem('permissionsKey'),
        checkAdmin: cookies.get('checkAdmin'),
        checkSuperAdmin: cookies.get('checkSuperAdmin'),
        roleUser: cookies.get('roleUser'),
        planActive:{},
        lastPlanActive:{},
        isLoading:false,
        hoverTaskPlanAccess:false,
        hoverChecklistPlanAccess:false,
        hoverDeviationPlanAccess:false,
        hoverDocumentPlanAccess:false,
        hoverGoalPlanAccess:false,
        hoverInstructionPlanAccess:false,
        hoverRiskPlanAccess:false,
        hoverRoutinePlanAccess:false,
        hoverContactPlanAccess:false

      };
    },

    computed: {},

    watch: {
      $route(to) {
        this.getActivePlan();
        this.page = to.path.split("/")[2];
        this.link = to.path.split("/")[to.path.split("/").length - 1];
      }
    },

    mounted () {
            this.getActivePlan();
        },

        methods: {

          redirectUrl(){
            if (this.roleUser == 'company admin') {
              this.$router.push('/settings/billings/');
             }
          },
          getActivateMenuClasses(lastPlanModuleName, activePlanModuleName){
            return activePlanModuleName && lastPlanModuleName ? 'blurring' 
            :  (activePlanModuleName && !lastPlanModuleName) ? 'disabled' : ''; 
          },
          getActivePlan () {
                this.isLoading = true;
                this.$store.dispatch('subscriptions/planActive', {}).then((res) => {
                    this.planActive = res.data.planAccess;
                    this.lastPlanActive = res.data.lastPlanAccess;
                    localStorage.setItem('planAccess', JSON.stringify(res.data));
                    this.isLoading = false;
                }).catch((error) => {
                    if (error.response?.status == 401) {
                        this.$router.push('/login');
                        this.$toaster.error(this.$i18n.t('message.token_expired'));
                    }
                    this.isLoading = false;
                });
            },
        },
  };
</script>

<style scoped>
.disabled {
  pointer-events: none;
  color: rgb(187, 187, 187,1)
}

.blurring {
  color: rgb(187, 187, 187,1)!important
}

.textFont {
  font-weight: unset !important; 
}

</style>

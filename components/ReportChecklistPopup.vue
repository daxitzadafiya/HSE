<template>
  <div>
    <v-dialog v-model="openPopup" max-width="1200px" persistent>
      <v-card>
        <v-card-text>
          <div class="title-model">
            {{ $t('title.edit_report_checklist') }}
          </div>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <b-row align-h="center">
              <b-col cols="12">
                <div class="input-wrap">
                  <v-text-field v-model="editedItem.checklist_name" :label="$t('form.name')" name="name" readonly outlined />
                </div>
              </b-col>
            </b-row>
            <category
              :category-item="editedItem"
              :categories-array="categoriesValidArray"
              :type-category="category_checklist"
              :is-open-popup="true"
              :view-only="true"
              @getNewCategory="getNewCategory"
            />
            <b-row class="section-description">
              <b-col>
                <!--                        <v-icon class="icon-question">far fa-question-circle</v-icon>-->
                <div class="input-wrap form-description">
<!--                  <vue-editor v-model="editedItem.checklist_description" disabled />-->
                  <FroalaSuggestionListEditor
                    :item="editedItem"
                    :predefined-link-array="predefinedLinkArray"
                  />
                </div>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="6">
                <v-select
                  v-model="editedItem.responsible"
                  label="Responsible "
                  :items="responsibleArray"
                  item-text="name"
                  item-value="id"
                  :rules="required"
                  outlined
                  :readonly="editedItem.status > 2"
                />
              </b-col>
            </b-row>
<!--            <connect_to-->
<!--              :edited-item="editedItem"-->
<!--              :departments-array="departmentsArray"-->
<!--              :job-title-array="jobTitleArray"-->
<!--              :project-array="projectArray"-->
<!--              :deny-edit="true"-->
<!--            />-->
            <Security
              :security-item="editedItem"
              :edit-mode="editMode"
              @changeSecurity="changeSecurity"
            />
            <div class="title-manage-task mt-6">
              CHECKPOINT
            </div>
            <div class="manage-task mt-6">
              <b-row>
                <b-col v-for="(item) in topicArray" :key="item.name" cols="12" class="mb-3">
                  <div class="section-connect-to section-connect-to-checklist-topic pb-4 pt-4">
                    <b-row class="section-connect-to-label-report-checklist">
                      <b-col cols="4">
                        <div class="label-process-report-checklist">{{ item.name }}</div>
                      </b-col>
                      <b-col cols="4">
                        <div class="label-process-report-checklist hse-margin-auto">Result</div>
                      </b-col>
                      <b-col cols="4">
                        <div class="inline-row label-action-process">
                          <div class="label-process-report-checklist mr-3">Close</div>
                          <div class="label-process-report-checklist mr-5">Risk</div>
                          <div class="label-process-report-checklist">Task</div>
                        </div>
                      </b-col>
                    </b-row>
                    <div class="padding-15-checklist">
                      <v-expansion-panels class="hse-use-checklist-expansion-panels">
                        <v-expansion-panel v-for="(question) in item.questions" :key="question.questions">
                          <v-expansion-panel-header>
                            <b-row>
                              <b-col cols="4" class="hse-margin-auto">
                                <div v-if="question.name">{{ question.name }}</div>
                              </b-col>
                              <b-col cols="4" class="hse-margin-auto">
                                <div class="hse-report-checklist-btn-answer-option text-center hse-margin-auto">
                                  {{ question.answer_name }}
                                </div>
                              </b-col>
                              <b-col cols="4" class="text-center">
                                <div class="inline-row hse-report-checklist-btn-action-radio">
                                  <v-radio-group v-model="question.action" :rules="required" row class="hse-radio-checkbox" @click.native.stop>
                                    <v-radio value="closed" />
                                    <v-radio value="risk" />
                                    <v-radio value="task" />
                                  </v-radio-group>
                                </div>
                              </b-col>
                            </b-row>
                          </v-expansion-panel-header>
                          <v-expansion-panel-content>
                            <b-row align-h="center">
                              <b-col cols="12">
                                <div class="input-wrap">
                                  <v-text-field
                                    v-model="question.description"
                                    label="Comment"
                                    outlined
                                    class="use-checklist-topic-question-choose-answers"
                                    disabled
                                  />
                                </div>
                              </b-col>
                            </b-row>
                            <b-row v-if="question.picture" :id="'upload_picture_' + question.id">
                              <b-col cols="12">
                                <div class="section-connect-to section-upload-document section-upload-document-report-checklist">
                                  <b-row>
                                    <b-col cols="9">
                                      <v-file-input
                                        :placeholder="question.picture"
                                        readonly
                                      />
                                    </b-col>
<!--                                    <b-col cols="3" class="hse-margin-auto">-->
<!--                                      <v-btn class="hse-btn-save" @click="viewPicture(question.picture_url)">-->
<!--                                        VIEW PICTURE-->
<!--                                      </v-btn>-->
<!--                                    </b-col>-->
                                  </b-row>
                                </div>
                              </b-col>
                            </b-row>
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </div>

                    <!--
                    <b-row v-for="question in item.questions" :key="question.questions">
                      <b-col cols="12" class="pb-0">
                        <div class="font-weight-bold">{{ question.name }}</div>
                      </b-col>
                      <b-col cols="8" class="pt-0 pb-0">
                        <div class="d-flex">
                          <v-radio-group v-model="question.answer" :rules="required" row class="radio-group-custom">
                            <v-radio
                              v-for="answer in answerArray"
                              :key="answer.value"
                              :label="answer.name"
                              :value="answer.value"
                              style="margin-bottom: 0 !important;"
                              disabled
                            />
                          </v-radio-group>
                        </div>
                      </b-col>
                      <b-col v-if="question.answer !== '1'" :id="'question_' + question.id" class="d-flex pt-0 pb-0" cols="4">
                        <v-select
                          v-if="question.action !== null && ((question.task_id !== null || question.risk_id !== null) || question.checkAnswerYes)"
                          v-model="question.action"
                          :items="actionsArr"
                          item-text="name"
                          item-value="value"
                          label="Add to action plan"
                          outlined
                          :hide-details="true"
                          disabled
                          class="d-none"
                        />
                        <v-select
                          v-else
                          v-model="question.action"
                          :items="actionsArr"
                          item-text="name"
                          item-value="value"
                          label="Add to action plan"
                          outlined
                          :hide-details="true"
                          @change="changeToAction(question.action, question.id, question.name)"
                        />
                      </b-col>
                      <b-col cols="12">
                        <v-text-field
                          v-if="question.description !== null"
                          v-model="question.description"
                          label="Comment"
                          :hide-details="true"
                          outlined
                          disabled
                          class="mt-0 mb-0"
                        />
                      </b-col>
                      <b-col v-if="question.answer !== '1' && question.action !== null" cols="12" class="pt-0 pb-0">
                        <v-btn v-if="question.task_id !== null || question.risk_id !== null" class="btn-custom-cancel text-capitalize" text @click="showActionPlanDetail(question)">
                          View {{ question.action }} detail
                        </v-btn>
                        <v-btn v-else-if="question.checkAnswerYes" class="btn-custom-cancel text-capitalize" style="text-decoration: none !important;" text>
                          Mark as {{ question.action }} by administrator
                        </v-btn>
                      </b-col>
                    </b-row>
                    -->
                  </div>
                </b-col>
              </b-row>
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <div class="input-wrap switch-component question-mark-block">
            <label class="left-text">{{ $t('button.index') }}</label>
            <v-switch
              v-model="editedItem.is_suggestion"
              :disabled="!checkAdmin || !editedItem.is_public"
              inset
              class="right-text"
            />
            <v-badge
              :value="hoverQuestionMark"
              right
              transition="slide-x-transition"
              class="hse--icon-question-circle"
              :content="$t('message.hover_index')"
            >
              <v-hover v-model="hoverQuestionMark">
                <i class="fa fa-question-circle"></i>
              </v-hover>
            </v-badge>
          </div>
          <v-spacer />
          <v-btn class="btn-cancel" text @click="close">
            {{ $t('button.cancel') }}
          </v-btn>
          <!-- Close = Process or Risk/Task = Choose action -->
          <v-btn
            v-if="!viewMode && editMode && editedItem.status === 2 && !editedItem.reopen && (checkResponsiblePerson || checkAdmin)"
            class="hse-btn-save"
            @click="dialogChangeResponsible = true"
          >
            {{ $t('button.change_responsible_person') }}
          </v-btn>
<!--          v-if="!viewMode && (editedItem.status === 1 || (editedItem.status === 2 && editedItem.reopen)) && (checkAdmin || checkResponsiblePerson)"-->
          <v-btn
            v-if="!viewMode
            && (editedItem.status === 1 || (editedItem.status === 6 && isReopen))
            && (checkAdmin || checkResponsiblePerson)"
            class="btn-save"
            @click="save"
          >
            {{ $t('button.save') }}
          </v-btn>
          <!-- View action - status 2. Processing -->
<!--          v-if="!viewMode && ((editedItem.status === 2 && !editedItem.is_action_done) || (editedItem.status === 3 && editedItem.is_action_done)) && !editedItem.reopen && (checkAdmin || checkResponsiblePerson)"-->
          <v-btn
            v-if="!viewMode
            && (editedItem.status === 2 || editedItem.status === 3)
            && !editedItem.reopen
            && (checkAdmin || checkResponsiblePerson)"
            class="btn-save"
            @click="viewAction"
          >
            {{ $t('button.view_action') }}
          </v-btn>
<!--          v-if="!viewMode && editedItem.status < 3 && editedItem.is_action_done && (checkAdmin || checkResponsiblePerson)"-->
          <v-btn
            v-if="!viewMode && editedItem.status === 6 && !isReopen && (checkAdmin || checkResponsiblePerson)"
            class="hse-btn-save"
            @click="reOpenReportChecklist"
          >
            {{ $t('button.reopen') }}
          </v-btn>
<!--          v-if="!viewMode && editedItem.status < 3 && editedItem.is_action_done && (checkAdmin || checkResponsiblePerson)"-->
          <v-btn
            v-if="!viewMode && editedItem.status === 6 && !isReopen && (checkAdmin || checkResponsiblePerson)"
            class="btn-save"
            @click="closeReportChecklist"
          >
            {{ $t('button.done') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogActionTask" max-width="1500px" persistent>
      <v-card
        class="mx-auto section-add-to-action-plan"
        outlined
      >
        <v-card-text>
          <div class="title-model">
            {{ formActionTitle }}
          </div>
          <v-form
            ref="formActionTask"
            v-model="valid"
            lazy-validation
          >
            <b-row>
              <b-col cols="6">
                <DatePicker
                  :label="$t('form.start_date')"
                  :item="editedItem"
                  :date-input="editedItem.start_time"
                  :use-keyboard="true"
                  :past-date="false"
                  :future-date="true"
                  :default-today="true"
                  @getDate="getStartDate"
                />
              </b-col>
              <b-col cols="6">
                <DatePicker
                  :label="$t('form.due_date')"
                  :item="editedItem"
                  :date-input="editedItem.deadline"
                  :use-keyboard="true"
                  :past-date="false"
                  :future-date="true"
                  @getDate="getDeadline"
                />
              </b-col>
              <b-col cols="6">
                <ResponsiblePerson
                  :object-item="editedItem"
                  :responsible-array="responsibleArray"
                  :label="'Task responsible'"
                />
<!--                <v-select-->
<!--                  v-model="editedItem.responsible_id"-->
<!--                  label="Task responsible"-->
<!--                  :items="responsibleArray"-->
<!--                  item-text="name"-->
<!--                  item-value="id"-->
<!--                  :rules="required"-->
<!--                  outlined-->
<!--                />-->
              </b-col>
<!--              <b-col cols="6">-->
<!--                <DatePicker-->
<!--                  :item="editedItem"-->
<!--                  :use-keyboard="true"-->
<!--                  @getDate="getDeadline"-->
<!--                />-->
<!--              </b-col>-->
            </b-row>
            <b-row>
              <b-col>
                <div class="input-wrap">
                  <v-textarea
                    v-model="editedItem.task_description"
                    label="Task description"
                    rows="2"
                    outlined
                    :rules="required"
                  />
                </div>
              </b-col>
            </b-row>
            <div class="manage-task mb-6">
              <div class="title-manage-task mb-6">
                TASK
              </div>
              <TasKDetailBlock
                :task-array-input="taskArray"
                :departments-array="departmentsArray"
                :task-assignees-array-input="reportChecklistTaskAssigneesArray"
                :edit-mode="false"
                :object-status-input="editedItem.status"
                @getTaskArray="getTaskArray"
                @reloadList="reloadList"
              />
              <!--              <v-data-table v-if="taskElementArr.length > 0" :headers="headersTaskElementArr" outlined :items="taskElementArr"-->
              <!--                            class="elevation-1 table-task header-task"-->
              <!--                            :items-per-page="15" :single-expand="true" :search="search" hide-default-footer-->
              <!--              >-->
              <!--                <template v-slot:item.name="{ item }">-->
              <!--                  <v-text-field v-model="item.name" :rules="required" />-->
              <!--                </template>-->
              <!--                <template v-slot:item.assignee="{ item }">-->
              <!--                  <v-select-->
              <!--                    v-model="item.taskAssignees"-->
              <!--                    :items="task_assignee_arr"-->
              <!--                    item-text="name"-->
              <!--                    item-value="id"-->
              <!--                    multiple-->
              <!--                    :rules="required"-->
              <!--                    @change="changeTaskAssignee(item)"-->
              <!--                  >-->
              <!--                    <template v-slot:prepend-item>-->
              <!--                      <v-list-item-->
              <!--                        ripple-->
              <!--                        @click="toggle(item)"-->
              <!--                      >-->
              <!--                        <v-list-item-action>-->
              <!--                          <v-icon :color="item.taskAssignees.length > 0 ? 'indigo darken-4' : ''">{{ icon(item) }}</v-icon>-->
              <!--                        </v-list-item-action>-->
              <!--                        <v-list-item-content>-->
              <!--                          <v-list-item-title>Select All</v-list-item-title>-->
              <!--                        </v-list-item-content>-->
              <!--                      </v-list-item>-->
              <!--                      <v-divider class="mt-2" />-->
              <!--                    </template>-->
              <!--                  </v-select>-->
              <!--                </template>-->
              <!--                <template v-slot:item.responsible="{ item }">-->
              <!--                  <v-select-->
              <!--                    v-model="item.responsiblePerson"-->
              <!--                    :items="item.taskAssigneesArray"-->
              <!--                    item-text="name"-->
              <!--                    item-value="id"-->
              <!--                    multiple-->
              <!--                    :rules="required"-->
              <!--                  />-->
              <!--                </template>-->
              <!--                <template v-slot:item.deadline="{ item }">-->
              <!--                  <v-menu v-model="item.modal_deadline" :close-on-content-click="false" min-width="290px">-->
              <!--                    <template v-slot:activator="{ on }">-->
              <!--                      <v-text-field-->
              <!--                        v-model="item.deadline"-->
              <!--                        placeholder="DD/MM/YY"-->
              <!--                        readonly-->
              <!--                        v-on="on"-->
              <!--                      />-->
              <!--                    </template>-->
              <!--                    <v-date-picker v-model="item.deadline" @input="item.modal_deadline = false">-->
              <!--                      <v-spacer />-->
              <!--                      <v-btn text @click="item.deadline = '', item.modal_deadline = false">-->
              <!--                        Clear-->
              <!--                      </v-btn>-->
              <!--                    </v-date-picker>-->
              <!--                  </v-menu>-->
              <!--                </template>-->
              <!--                <template v-slot:item.picture="{ item }">-->
              <!--                  <div v-if="item.picture_url" class="hse-btn-report-risk-save" @click="viewPicture(item.picture_url)">-->
              <!--                    VIEW PICTURE-->
              <!--                  </div>-->
              <!--                </template>-->
              <!--                <template v-slot:item.action="{ item }">-->
              <!--                  <v-icon class="info-table-action-icon" small @click="deleteTaskList(item)">-->
              <!--                    delete-->
              <!--                  </v-icon>-->
              <!--                </template>-->
              <!--              </v-data-table>-->
              <!--              <v-checkbox v-if="riskElementAnalysis.length > 0" v-model="riskItem.need_to_process" :label="$t('form.need_to_be_progressed')" />-->
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="btn-cancel" text @click="closeDialogAction">
            {{ $t('button.cancel') }}
          </v-btn>
          <!-- PROCESS -->
          <v-btn
            v-if="(editedItem.status === 1 || (editedItem.status === 2 && editedItem.reopen)) && taskDetailArray.length > 0 && (checkAdmin || checkResponsiblePerson)"
            class="btn-save"
            @click="saveAction"
          >
            {{ $t('button.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogActionRisk" max-width="1500px" persistent>
      <v-card>
        <v-card-text>
          <div class="title-model">
            {{ formActionTitle }}
          </div>
          <v-form
            ref="formActionRisk"
            v-model="valid"
            lazy-validation
          >
            <b-row>
              <b-col cols="6">
                <div class="input-wrap">
                  <v-text-field v-model="riskItem.name" :label="$t('form.subject')" :rules="required" outlined />
                </div>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="6">
                <v-select
                  v-model="editedItem.risk_responsible_id"
                  label="Risk responsible"
                  :items="responsibleArray"
                  item-text="name"
                  item-value="id"
                  :rules="required"
                  outlined
                />
              </b-col>
              <b-col cols="6">
                <div class="input-wrap">
                  <v-text-field
                    :value="riskItem.status ? formatStatus(riskItem.status) : 'New'"
                    :label="$t('form.status')"
                    outlined
                    disabled
                  />
                </div>
              </b-col>
            </b-row>
<!--            <connect_to-->
<!--              :edited-item="editedItem"-->
<!--              :departments-array="departmentsArray"-->
<!--              :job-title-array="jobTitleArray"-->
<!--              :project-array="projectArray"-->
<!--              :deny-edit="true"-->
<!--            />-->
            <Security
              :security-item="editedItem"
              :edit-mode="editMode"
              :deny-edit="true"
              @changeSecurity="changeSecurity"
            />
            <div v-if="riskElementAnalysis" class="manage-task mb-6">
              <div class="title-manage-task">
                {{ $t('title.add_source_of_danger') }}
              </div>
              <v-data-table
                :headers="headersRiskElementArr"
                outlined :items="riskElementAnalysis"
                class="elevation-1 table-task header-task"
                :items-per-page="15"
                :single-expand="true"
                hide-default-footer
                :sort-by="['created_at']"
                :sort-desc="[true, false]"
              >
                <template v-slot:item.name="{ item }">
                  <v-text-field v-model="item.name" :rules="required" />
                </template>
                <template v-slot:item.type="{ item }">
                  <v-text-field v-model="item.type" readonly />
                </template>
                <template v-slot:item.probability="{ item }">
                  <v-select
                    v-model="item.probability"
                    :items="probabilityArr"
                    item-text="name"
                    item-value="value"
                    :rules="required"
                    @change="updateColorCode(item)"
                  />
                </template>
                <template v-slot:item.consequence="{ item }">
                  <v-select
                    v-model="item.consequence"
                    :items="consequenceArr"
                    item-text="name"
                    item-value="value"
                    :rules="required"
                    @change="updateColorCode(item)"
                  />
                </template>
                <template v-slot:item.colorCode="{ item }">
                  <v-chip v-if="item.colorCode" :color="item.colorCode" outlined>
                    {{ item.point }}
                  </v-chip>
                </template>
                <template v-slot:item.description_resolve="{ item }">
                  <v-text-field v-model="item.description" />
                </template>
<!--                <template v-slot:item.picture="{ item }">-->
<!--                  <div v-if="item.picture_url" class="hse-btn-report-risk-save" @click="viewPicture(item.picture_url)">-->
<!--                    VIEW PICTURE-->
<!--                  </div>-->
<!--                </template>-->
              </v-data-table>
              <v-checkbox v-if="riskElementAnalysis.length > 0" v-model="riskItem.need_to_process" :label="$t('form.need_to_be_progressed')" />
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="btn-cancel" text @click="closeDialogAction">
            {{ $t('button.cancel') }}
          </v-btn>
          <!-- PROCESS -->
          <v-btn
            v-if="(editedItem.status === 1 || (editedItem.status === 2 && editedItem.reopen)) && (checkAdmin || checkResponsiblePerson)"
            class="btn-save"
            @click="saveAction"
          >
            {{ $t('button.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- dialog if choose both action Risk & Task -->
    <v-dialog v-model="dialogAllAction" max-width="1300px" persistent>
      <v-stepper v-model="actionStep">
        <v-card>
          <v-stepper-items>
            <!-- ////////////// RISK action -->
            <v-stepper-content step="1" class="hse-report-checklist-v-stepper-content">
              <v-card-text>
                <div class="title-model">
                  {{ formActionTitle }}
                </div>
                <v-form
                  ref="formAllAction1"
                  v-model="valid"
                  lazy-validation
                >
                  <b-row>
                    <b-col cols="12">
                      <div class="input-wrap">
                        <v-text-field v-model="riskItem.name" :label="$t('form.subject')" :rules="required" outlined />
                      </div>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col cols="6">
                      <v-select
                        v-model="editedItem.risk_responsible_id"
                        label="Risk responsible"
                        :items="responsibleArray"
                        item-text="name"
                        item-value="id"
                        :rules="required"
                        outlined
                      />
                    </b-col>
                    <b-col cols="6">
                      <div class="input-wrap">
                        <v-text-field
                          :value="riskItem.status ? formatStatus(riskItem.status) : 'New'"
                          :label="$t('form.status')"
                          outlined
                          disabled
                        />
                      </div>
                    </b-col>
                  </b-row>
<!--                  <connect_to-->
<!--                    :edited-item="editedItem"-->
<!--                    :departments-array="departmentsArray"-->
<!--                    :job-title-array="jobTitleArray"-->
<!--                    :project-array="projectArray"-->
<!--                    :deny-edit="false"-->
<!--                    disabled-->
<!--                  />-->
                  <Security
                    :security-item="editedItem"
                    :edit-mode="editMode"
                    :deny-edit="false"
                    @changeSecurity="changeSecurity"
                  />
                  <div v-if="riskElementAnalysis" class="manage-task mb-6">
                    <div class="title-manage-task">
                      {{ $t('title.add_source_of_danger') }}
                    </div>
                    <v-data-table
                      v-if="riskElementAnalysis.length > 0"
                      :headers="headersRiskElementArr"
                      outlined
                      :items="riskElementAnalysis"
                      class="elevation-1 table-task header-task"
                      :items-per-page="15"
                      :single-expand="true"
                      hide-default-footer
                      :sort-by="['created_at']"
                      :sort-desc="[true, false]"
                    >
                      <template v-slot:item.name="{ item }">
                        <v-text-field v-model="item.name" :rules="required" />
                      </template>
                      <template v-slot:item.type="{ item }">
                        <v-text-field v-model="item.type" disabled />
                      </template>
                      <template v-slot:item.probability="{ item }">
                        <v-select
                          v-model="item.probability"
                          :items="probabilityArr"
                          item-text="name"
                          item-value="value"
                          :rules="required"
                          @change="updateColorCode(item)"
                        />
                      </template>
                      <template v-slot:item.consequence="{ item }">
                        <v-select
                          v-model="item.consequence"
                          :items="consequenceArr"
                          item-text="name"
                          item-value="value"
                          :rules="required"
                          @change="updateColorCode(item)"
                        />
                      </template>
                      <template v-slot:item.colorCode="{ item }">
                        <v-chip v-if="item.colorCode" :color="item.colorCode" outlined>{{ item.point }}</v-chip>
                      </template>
                      <template v-slot:item.description_resolve="{ item }">
                        <v-text-field v-model="item.description" />
                      </template>
<!--                      <template v-slot:item.picture="{ item }">-->
<!--                        <div v-if="item.picture_url" class="hse-btn-report-risk-save" @click="viewPicture(item.picture_url)">-->
<!--                          VIEW PICTURE-->
<!--                        </div>-->
<!--                      </template>-->
                    </v-data-table>
                    <v-checkbox v-if="riskElementAnalysis.length > 0" v-model="riskItem.need_to_process" :label="$t('form.need_to_be_progressed')" />
                  </div>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn class="btn-cancel" text @click="closeDialogAction">
                  {{ $t('button.cancel') }}
                </v-btn>
                <v-btn color="primary" @click="changeActionForm">
                  Continue
                </v-btn>
              </v-card-actions>
            </v-stepper-content>
            <!-- ////////////////  TASK action -->
            <v-stepper-content step="2" class="hse-report-checklist-v-stepper-content">
              <v-card-text>
                <div class="title-model">
                  {{ formActionTitle }}
                </div>
                <v-form
                  ref="formAllAction2"
                  v-model="valid"
                  lazy-validation
                >
                  <b-row>
                    <b-col cols="6">
                      <DatePicker
                        :label="$t('form.start_date')"
                        :item="editedItem"
                        :date-input="editedItem.start_time"
                        :use-keyboard="true"
                        :past-date="false"
                        :future-date="true"
                        :default-today="true"
                        @getDate="getStartDate"
                      />
                    </b-col>
                    <b-col cols="6">
                      <DatePicker
                        :label="$t('form.due_date')"
                        :item="editedItem"
                        :date-input="editedItem.deadline"
                        :use-keyboard="true"
                        :past-date="false"
                        :future-date="true"
                        @getDate="getDeadline"
                      />
                    </b-col>
                    <b-col cols="6">
                      <ResponsiblePerson
                        :object-item="editedItem"
                        :responsible-array="responsibleArray"
                        :label="'Task responsible'"
                      />
<!--                      <v-select-->
<!--                        v-model="editedItem.responsible_id"-->
<!--                        label="Task responsible"-->
<!--                        :items="responsibleArray"-->
<!--                        item-text="name"-->
<!--                        item-value="id"-->
<!--                        :rules="required"-->
<!--                        outlined-->
<!--                      />-->
                    </b-col>
<!--                    <b-col cols="6">-->
<!--                      <DatePicker-->
<!--                        :item="editedItem"-->
<!--                        :use-keyboard="true"-->
<!--                        @getDate="getDeadline"-->
<!--                      />-->
<!--                    </b-col>-->
                  </b-row>
                  <b-row>
                    <b-col>
                      <div class="input-wrap">
                        <v-textarea
                          v-model="editedItem.task_description"
                          label="Task description"
                          rows="2"
                          outlined
                          :rules="required"
                        />
                      </div>
                    </b-col>
                  </b-row>
                  <div class="manage-task mb-6">
                    <div class="title-manage-task">
                      TASK
                    </div>
                    <TasKDetailBlock
                      :task-array-input="taskArray"
                      :departments-array="departmentsArray"
                      :task-assignees-array-input="reportChecklistTaskAssigneesArray"
                      :edit-mode="true"
                      :object-status-input="editedItem.status"
                      @getTaskArray="getTaskArray"
                      @reloadList="reloadList"
                    />
                    <!--                    <v-data-table v-if="taskElementArr.length > 0" :headers="headersTaskElementArr" outlined :items="taskElementArr"-->
                    <!--                                  class="elevation-1 table-task header-task"-->
                    <!--                                  :items-per-page="15" :single-expand="true" :search="search" hide-default-footer-->
                    <!--                    >-->
                    <!--                      <template v-slot:item.name="{ item }">-->
                    <!--                        <v-text-field v-model="item.name" :rules="required" />-->
                    <!--                      </template>-->
                    <!--                      <template v-slot:item.assignee="{ item }">-->
                    <!--                        <v-select-->
                    <!--                          v-model="item.taskAssignees"-->
                    <!--                          :items="task_assignee_arr"-->
                    <!--                          item-text="name"-->
                    <!--                          item-value="id"-->
                    <!--                          multiple-->
                    <!--                          :rules="required"-->
                    <!--                          @change="changeTaskAssignee(item)"-->
                    <!--                        >-->
                    <!--                          <template v-slot:prepend-item>-->
                    <!--                            <v-list-item-->
                    <!--                              ripple-->
                    <!--                              @click="toggle(item)"-->
                    <!--                            >-->
                    <!--                              <v-list-item-action>-->
                    <!--                                <v-icon :color="item.taskAssignees.length > 0 ? 'indigo darken-4' : ''">{{ icon(item) }}</v-icon>-->
                    <!--                              </v-list-item-action>-->
                    <!--                              <v-list-item-content>-->
                    <!--                                <v-list-item-title>Select All</v-list-item-title>-->
                    <!--                              </v-list-item-content>-->
                    <!--                            </v-list-item>-->
                    <!--                            <v-divider class="mt-2" />-->
                    <!--                          </template>-->
                    <!--                        </v-select>-->
                    <!--                      </template>-->
                    <!--                      <template v-slot:item.responsible="{ item }">-->
                    <!--                        <v-select-->
                    <!--                          v-model="item.responsiblePerson"-->
                    <!--                          :items="item.taskAssigneesArray"-->
                    <!--                          item-text="name"-->
                    <!--                          item-value="id"-->
                    <!--                          multiple-->
                    <!--                          :rules="required"-->
                    <!--                        />-->
                    <!--                      </template>-->
                    <!--                      <template v-slot:item.deadline="{ item }">-->
                    <!--                        <v-menu v-model="item.modal_all_deadline" :close-on-content-click="false" min-width="290px">-->
                    <!--                          <template v-slot:activator="{ on }">-->
                    <!--                            <v-text-field-->
                    <!--                              v-model="item.deadline"-->
                    <!--                              placeholder="DD/MM/YY"-->
                    <!--                              readonly-->
                    <!--                              v-on="on"-->
                    <!--                            />-->
                    <!--                          </template>-->
                    <!--                          <v-date-picker v-model="item.deadline" @input="item.modal_all_deadline = false">-->
                    <!--                            <v-spacer />-->
                    <!--                            <v-btn text @click="item.deadline = '', item.modal_all_deadline = false">-->
                    <!--                              Clear-->
                    <!--                            </v-btn>-->
                    <!--                          </v-date-picker>-->
                    <!--                        </v-menu>-->
                    <!--                      </template>-->
                    <!--                      <template v-slot:item.picture="{ item }">-->
                    <!--                        <div v-if="item.picture_url" class="hse-btn-report-risk-save" @click="viewPicture(item.picture_url)">-->
                    <!--                          VIEW PICTURE-->
                    <!--                        </div>-->
                    <!--                      </template>-->
                    <!--                      <template v-slot:item.action="{ item }">-->
                    <!--                        <v-icon class="info-table-action-icon" small @click="deleteTaskList(item)">-->
                    <!--                          delete-->
                    <!--                        </v-icon>-->
                    <!--                      </template>-->
                    <!--                    </v-data-table>-->
                    <!--              <v-checkbox v-if="riskElementAnalysis.length > 0" v-model="riskItem.need_to_process" :label="$t('form.need_to_be_progressed')" />-->
                  </div>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn class="btn-cancel" text @click="actionStep = 1; changeActionTitle(actionStep)">
                  Back
                </v-btn>
                <!-- PROCESS -->
                <v-btn
                  v-if="(editedItem.status === 1 || (editedItem.status === 2 && editedItem.reopen)) && (checkAdmin || checkResponsiblePerson)"
                  class="btn-save"
                  @click="saveAction"
                >
                  {{ $t('button.save') }}
                </v-btn>
              </v-card-actions>
            </v-stepper-content>
          </v-stepper-items>
        </v-card>
      </v-stepper>
    </v-dialog>

    <v-dialog v-model="dialogConfirmClose" max-width="500px">
      <v-card class="dialog-delete">
        <v-card-text>
          <div class="text-center confirm-delete-title">
            {{ $t('title.confirm_modal') }}
          </div>
          <div class="confirm-delete-text">
            <p> Do you want to mark as closed ?</p>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="btn-save" text @click="saveAction">
            {{ $t('button.yes') }}
          </v-btn>
          <v-btn class="btn-cancel" text @click="closeDialogConfirmClosed">
            {{ $t('button.no') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogChangeResponsible" max-width="500px">
      <v-card>
        <v-card-text>
          <div class="title-model">
            Change responsible person
          </div>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <b-row>
              <b-col>
                <v-select
                  v-if="editMode"
                  v-model="editedItem.responsible"
                  label="Responsible person of report checklist"
                  :items="responsibleArray"
                  item-text="name"
                  item-value="id"
                  :rules="required"
                  outlined
                />
              </b-col>
            </b-row>
            <b-row v-if="taskArray.length > 0">
              <b-col>
                <ResponsiblePerson
                  :object-item="editedItem"
                  :responsible-array="responsibleArray"
                  :label="'Responsible person of task'"
                />
<!--                <v-select-->
<!--                  v-model="editedItem.responsible_id"-->
<!--                  label="Responsible person of task"-->
<!--                  :items="responsibleArray"-->
<!--                  item-text="name"-->
<!--                  item-value="id"-->
<!--                  :rules="required"-->
<!--                  outlined-->
<!--                />-->
              </b-col>
            </b-row>
            <b-row v-if="riskElementAnalysis.length > 0">
              <b-col>
                <v-select
                  v-model="editedItem.risk_responsible_id"
                  label="Responsible person of risk"
                  :items="responsibleArray"
                  item-text="name"
                  item-value="id"
                  :rules="required"
                  outlined
                />
              </b-col>
            </b-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="btn-cancel" text @click="close">
            {{ $t('button.cancel') }}
          </v-btn>
          <!-- New -->
          <v-btn
            class="btn-save"
            @click="updateResponsible"
          >
            {{ $t('button.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

<!--    <AttachmentPopup-->
<!--      :open-attachment-popup="checkAttachmentOpen"-->
<!--      :type="document_type"-->
<!--      :image-item="previewUrl"-->
<!--      :added-from="document_added_from"-->
<!--      :is-image="true"-->
<!--      @closePopup="checkAttachmentOpen = !checkAttachmentOpen"-->
<!--      @getImage="getImage"-->
<!--    />-->
  </div>
</template>

<script>
  import {_} from 'vue-underscore';
  import cookies from 'js-cookie';
  import axios from "axios";
  // import ConnectTo from "./ConnectTo";
  import TasKDetailBlock from "./TasKDetailBlock";
  import Category from "./Category";
  import DatePicker from "./DatePicker";
  // import AttachmentPopup from "./AttachmentPopup";
  import Security from "./Security";
  import FroalaSuggestionListEditor from "./FroalaSuggestionListEditor";
  import ResponsiblePerson from "./ResponsiblePerson";

  export default {
    name: "ReportChecklistPopup",
    components: {
      // connect_to: ConnectTo,
      TasKDetailBlock,
      DatePicker,
      // AttachmentPopup,
      category: Category,
      Security,
      FroalaSuggestionListEditor,
      ResponsiblePerson
    },
    props: {
      reportItem: {
        type: Object,
        required: false,
      },
      openPopup: Boolean,
      projectArray: {
        type: Array,
        required: false,
      },
      jobTitleArray: Array,
      departmentsArray: Array,
      categoriesArray: Array,
      viewModeInput: {
        type: Boolean,
        required: false,
      },
      taskAssigneesArray: {
        type: Array,
        required: false,
      },
      responsibleArray: {
        type: Array,
        required: false,
      },
      predefinedLinkArray: {
        type: Array,
        required: false,
      },
    },
    data: () => ({
      userRoleId: parseInt(cookies.get('roleID')),
      userDepartmentID: parseInt(cookies.get('userDepartmentID')),
      checkAdmin: cookies.get('checkAdmin'),
      roleUser: cookies.get('roleUser'),
      userID: parseInt(cookies.get('userID')),
      pageKey: 'reports-report-checklists-report-checklists',
      permissionsUser: localStorage.getItem('permissionsKey'),
      valid: true,
      listArray: [],
      editedItem: {
        checklist_name: "",
        checklist_description: "",
        category_id: "",
        company_id: "",
        added_by: "",
        department_id: "",
        project_id: "",
        job_title_id: "",
        task_description: "",
        deadline: '',
        deadline_pre: '',
        start_time: '',
        start_time_pre: '',
        updateResponsible: false,
        editPermission: true,
        // table Security
        object_type: 'report checklist',
        is_shared: false,
        is_public: false,
        department_array: [],
        employee_array: [],
      },
      defaultItem: {
        checklist_name: "",
        description: "",
        category_id: "",
        company_id: "",
        added_by: "",
        department_id: "",
        project_id: "",
        job_title_id: "",
        task_description: "",
        deadline: '',
        deadline_pre: '',
        start_time: '',
        start_time_pre: '',
        updateResponsible: false,
        editPermission: true,
        // table Security
        object_type: 'report checklist',
        is_shared: false,
        is_public: false,
        department_array: [],
        employee_array: [],
      },
      required: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else return true;
        }
      ],
      selectedFile: [],
      consequenceArray: [{
        id: 1,
        name: "Company"
      }, {
        id: 2,
        name: "Customer"
      }, {
        id: 3,
        name: "Others"
      }],
      happenedBeforeArray: [{
        id: 1,
        name: "Yes"
      }, {
        id: 2,
        name: "No"
      }, {
        id: 3,
        name: "Uncertain"
      }],
      dialogLogo: false, // upload avatar
      previewUrl: null, // upload avatar
      document_added_from: 5, // deviation
      document_type: 'report',
      // connectCompany: false,
      // connectDepartment: false,
      // connectJobTitle: false,
      // connectProject: false,
      // taskAssigneesArray: [],
      taskArray: [],
      addToAction: '',
      actionsArr: [
        {name: 'Create as a task', value: 'task'},
        {name: 'Move to risk analysis', value: 'risk'},
        {name: 'Mark as closed', value: 'closed'},
      ],
      riskItem: {
        id: '',
        name: '',
        status: 1,
        department_id: '',
        project_id: '',
        job_title_id: '',
        need_to_process: false,
      },
      defaultRiskItem: {
        id: '',
        name: '',
        status: 1,
        department_id: '',
        project_id: '',
        job_title_id: '',
        need_to_process: false,
      },
      riskElementAnalysis: [],
      riskElement: {
        id: '',
        name: '',
        description_default: '',
        type: '',
        type_id: '',
        probability: '',
        probabilityName: '',
        consequence: '',
        consequenceName: '',
        code: '',
        colorCode: '',
        colorName: '',
        point: '',
        description_resolve: '',
        newlyCreated: false,
      },
      riskElementDefault: {
        id: '',
        name: '',
        description_default: '',
        type: '',
        type_id: '',
        probability: '',
        probabilityName: '',
        consequence: '',
        consequenceName: '',
        code: '',
        colorCode: '',
        colorName: '',
        point: '',
        description_resolve: '',
        newlyCreated: false,
      },
      probabilityArr: [
        {
          value: "1",
          name: "Low"
        },
        {
          value: "2",
          name: "Moderate"
        },
        {
          value: "3",
          name: "High"
        },
        {
          value: "4",
          name: "Very high"
        }
      ],
      consequenceArr: [
        {
          value: "1",
          name: "Low"
        },
        {
          value: "2",
          name: "Moderate"
        },
        {
          value: "3",
          name: "High"
        },
        {
          value: "4",
          name: "Very high"
        }
      ],
      colorCodeArr: [
        {
          min: 0,
          max: 0,
          value: "black",
          name: "None",
        },
        {
          min: 1,
          max: 3,
          value: "green",
          name: "Green",
        },
        {
          min: 4,
          max: 10,
          value: "#f0e509",
          name: "Yellow"
        },
        {
          min: 11,
          max: 15,
          value: "orange",
          name: "Orange"
        },
        {
          min: 16,
          max: 16,
          value: "red",
          name: "Red"
        }
      ],
      formTitle: 'Edit Report checklist',
      editMode: true,
      taskDetailArray: [],
      // image
      // checkAttachmentOpen: false,
      // responsibleArray: [],
      isReopen: false,
      // popup
      dialogActionTask: false,
      dialogActionRisk: false,
      dialogConfirmClose: false,
      dialogAllAction: false,
      // Both action: Risk & Task
      actionStep: 1,
      topicArray: [],
      // category
      category_checklist: 'checklist',
      categoriesValidArray: [],
      formActionTitle: '',
      checkpointArr: [],
      checkResponsiblePerson: false,
      deadline: '',
      start_time: '',
      dialogChangeResponsible: false,
      viewMode: false,
      reportChecklistTaskAssigneesArray: [],
      hoverQuestionMark: false,
    }),

    computed: {
      headersRiskElementArr() {
        return [
          { text: this.translateCol('name'), value: 'name', align: 'center', width: '36%'},
          { text: this.translateCol('type'), value: 'type', align: 'center', width: '10%'},
          { text: this.translateCol('probability'), value: 'probability', align: 'center', width: '12%'},
          { text: this.translateCol('consequence'), value: 'consequence', align: 'center', width: '12%'},
          { text: this.translateCol('color_code'), value: 'colorCode', align: 'center', width: '10%'},
          { text: this.translateCol('comment'), value: 'description_resolve', align: 'center', width: '30%'},
        ];
      },
    },

    watch: {
      openPopup(value) {
        if (value) {
          this.viewMode = this.viewModeInput;
          if (this.reportItem) {
            let categoryId = this.reportItem.category_id;
            this.categoriesValidArray = _.filter(this.categoriesArray, function (item) {
              return (!item.disable_status || (item.disable_status && item.id === categoryId));
            });
            this.checkResponsiblePerson = this.reportItem.responsible === this.userID;
            this.editItem(this.reportItem);
          }
        }
      },
    },

    mounted() {
      // let that = this;
      // that.$nextTick(() => {
      //   that.$nuxt.$loading.start();
        // // list all managers = responsible person
        // that.$store.dispatch('employees/index').then(result => {
        //   that.taskAssigneesArray = result.data;
        //   that.responsibleArray = _.clone(result.data);
        //   that.responsibleArray = _.filter(that.responsibleArray, function (item) {
        //     return item.role_id === 2 || item.role_id === 3;
        //   });
        // }).catch((error) => {
        //   that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        //   that.$nuxt.$loading.finish();
        // });

        // that.$store.dispatch('employees/index', {
        //   department: that.editedItem.department_id,
        //   job_title: that.editedItem.job_title_id,
        //   project: that.editedItem.project_id
        // }).then(result => {
        //   that.taskAssigneesArray = result.data;
        //   that.$nuxt.$loading.finish();
        // }).catch((error) => {
        //   that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        //   that.$nuxt.$loading.finish();
        // });
      // });
    },

    created() {
      if (this.openPopup) {
        if (this.reportItem) {
          this.editItem(this.reportItem);
        }
      }
    },

    methods: {
      changeSecurity(val) {
        if (val !== 'all') {
          this.editedItem.is_suggestion = false;
        }
      },

      translateCol (colName) {
        return this.$i18n.t('column.' + colName);
      },

      editItem(item) {
        let that = this;
        that.$nuxt.$loading.start();
        that.reportChecklistTaskAssigneesArray = _.clone(that.taskAssigneesArray);
        that.reportChecklistTaskAssigneesArray = _.filter(that.reportChecklistTaskAssigneesArray, function(employee){
          return !employee.disable_status;
        });
        that.$store.dispatch('reports/show', item.id).then(result => {
          that.editedItem = Object.assign({}, result.data);
          that.topicArray = result.data.topics;
          that.editedItem.checklist_name = result.data.checklist_info.name;
          that.editedItem.checklist_description = result.data.checklist_info.description;

          if (that.editedItem.department_array === null) {
            that.editedItem.department_array = [];
          } else {
            that.editedItem.department_array = JSON.parse(that.editedItem.department_array);
          }
          if (that.editedItem.employee_array === null) {
            that.editedItem.employee_array = [];
          } else {
            that.editedItem.employee_array = JSON.parse(that.editedItem.employee_array);
          }

          that.editedItem.type_of_attachment = !!result.data.attachment;
          if (result.data.attachment) {
            that.getImageSrc(result.data.attachment);
          }
          if (result.data.tasks.length > 0) {
            _.each(result.data.tasks, function (task) {
              let assignee = _.findWhere(task.task_assignees, {user_id: that.userID});
              if (assignee !== undefined) {
                task.assigneeId = assignee.user_id;
                task.assigneeStatus = assignee.status;
              } else {
                task.assigneeId = '';
                task.assigneeStatus = '';
              }
              if (task.assigned_department === null) {
                task.assigned_department = [];
              } else {
                task.assigned_department = JSON.parse(task.assigned_department);
              }

              that.reportChecklistTaskAssigneesArray = _.clone(that.taskAssigneesArray);
              if (task.assigned_employee === null) {
                task.assigned_employee = [];
              } else {
                task.assigned_employee = JSON.parse(task.assigned_employee);
              }
              that.reportChecklistTaskAssigneesArray = _.filter(that.reportChecklistTaskAssigneesArray, function(employee){
                return (!employee.disable_status
                  || (employee.disable_status && _.indexOf(task.assigned_employee, employee.id) > -1));
              });

              task.checkReadOnly = task.status >= 1;
              that.taskArray.push(task);
            });
          }
          if (result.data.risk_analysis.length > 0) {
            _.each(result.data.risk_analysis, function (risk) {
              that.riskItem = Object.assign({}, risk);
              that.riskElementAnalysis = _.each(risk.elements, function (element) {
                let point = element.probability * element.consequence;
                _.each(that.colorCodeArr, function (color) {
                  if (point >= color.min && point <= color.max) {
                    element.colorCode = color.value;
                    element.colorName = color.name;
                    element.point = point;
                  }
                });
              });
            });
          }
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_checklist_report_view_detail'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
        that.$nuxt.$loading.finish();
        // that.$store.dispatch('employees/index').then(result => {
        //   that.taskAssigneesArray = result.data;
        //   that.$nuxt.$loading.finish();
        // }).catch((error) => {
        //   that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        //   that.$nuxt.$loading.finish();
        // });
        // that.connectDepartment = !!that.editedItem.department_id;
        // that.connectProject = !!that.editedItem.project_id;
        // that.connectJobTitle = !!that.editedItem.job_title_id;
      },

      checkDirtyBeforeClose(){
        if(this.checkDirtyForm()){
          this.dialogConfirmClose = true;
        }else{
          this.close();
        }
      },

      checkDirtyForm(){
        let that = this;
        let result = false;
        _.each(that.editedItem, function(value, key, obj) {
          if(that.originData && obj[key] && that.originData[key] && obj[key] !== that.originData[key]){
            result = true;
          }
        });
        return result;
      },

      close() {
        this.reset();
        // this.connectDepartment = false;
        // this.connectProject = false;
        // this.connectJobTitle = false;
        this.dialogConfirmClose = false;
        this.dialogChangeResponsible = false;
        this.formDirty = false;
        this.taskDetailArray = [];
        this.taskArray = [];
        this.riskElementAnalysis = [];
        this.riskItem.need_to_process = false;
        this.topicArray = [];
        this.addToAction = '';
        this.deadline = '';
        this.start_time = '';
        this.$emit('closePopup');
      },

      reset() {
        this.$nuxt.$loading.finish();
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          // this.$refs.form.reset();
          this.$refs.form.resetValidation();
        }, 300);
      },

      viewAction() {
        let that = this;
        let count_risk = [];
        let count_task = [];
        if (that.$refs.form.validate()) {
          _.each(that.topicArray, function (item) {
            _.each(item.questions, function (question) {
              if (question.action === "risk") {
                count_risk.push(question);
              } else if (question.action === "task") {
                count_task.push(question);
              }
            });
          });
          if (count_risk.length > 0 && count_task.length < 1) {
            that.formActionTitle = 'Add Risk analysis';
            that.addToAction = 'risk';
            that.dialogActionRisk = true;
          } else if (count_risk.length < 1 && count_task.length > 0) {
            that.formActionTitle = 'Add Task';
            that.addToAction = 'task';
            that.dialogActionTask = true;
          } else if (count_risk.length > 0 && count_task.length > 0) {
            that.formActionTitle = 'Add Risk analysis';
            that.addToAction = 'both';
            that.dialogAllAction = true;
          }
        }
      },

      save() {
        let that = this;
        let count_risk = [];
        let count_task = [];
        if (that.$refs.form.validate()) {
          _.each(that.topicArray, function(item) {
            _.each(item.questions, function(question) {
              if (question.action === "risk") {
                count_risk.push(question);
              } else if (question.action === "task") {
                count_task.push(question);
              }
              that.checkpointArr.push(question);
            });
          });
          if (count_risk.length > 0 && count_task.length < 1) {
            that.formActionTitle = 'Add Risk analysis';
            that.addToAction = 'risk';
            that.showRiskCheckpointInfo(count_risk);
            that.dialogActionRisk = true;
          } else if (count_risk.length < 1 && count_task.length > 0) {
            that.formActionTitle = 'Add Task';
            that.addToAction = 'task';
            that.dialogActionTask = true;
          } else if (count_risk.length > 0 && count_task.length > 0) {
            that.formActionTitle = 'Add Risk analysis';
            that.addToAction = 'both';
            that.showRiskCheckpointInfo(count_risk);
            that.dialogAllAction = true;
          } else {
            that.saveAction();
          }
        }
      },

      reOpenReportChecklist() {
        if (this.$refs.form.validate()) {
          this.isReopen = true;
          this.addToAction = '';
          // this.editedItem.is_action_done = false;
          // this.editedItem.deadline = '';
          this.editedItem.reopen = true;
          this.editedItem.task_description = '';
          this.editedItem.responsible_id = null;
          this.editedItem.risk_responsible_id = null;
          this.taskArray = [];
          this.riskElementAnalysis = [];
          this.riskItem.need_to_process = false;
          this.checkpointArr = [];
        }
      },

      closeReportChecklist() {
        let that = this;
        that.isReopen = false;
        if (that.$refs.form.validate()) {
          that.$nuxt.$loading.start();
          _.each(that.topicArray, function(item) {
            _.each(item.questions, function(question) {
              that.checkpointArr.push(question);
            });
          });
          that.editedItem.status = 3;
          that.editedItem.checkpoint_arr = that.checkpointArr;
          that.$store.dispatch('reports/update', that.editedItem).then(function () {
            that.reloadList();
            that.reloadListCategory();
            that.$toaster.success(that.$i18n.t('message.success_checklist_report_update'));
          }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_checklist_report_update'));
            }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish();
          });
          that.close();
        }
      },

      // Risk action - show table with chosen checkpoint
      showRiskCheckpointInfo(list) {
        this.riskItem.name = this.editedItem.checklist_name;
        this.riskItem.status = 1;
        this.riskItem.report_id = this.editedItem.id;
        this.riskItem.department_id = this.editedItem.department_id;
        this.riskItem.job_title_id = this.editedItem.job_title_id;
        this.riskItem.project_id = this.editedItem.project_id;
        this.riskElementAnalysis = _.each(list, function (risk) {
          risk.type = "Report";
        });
      },

      reloadList(){
        this.$emit('reloadList');
      },

      reloadListCategory(){
        this.$emit('reloadListCategory');
      },

      // previewImage(file) {
      //   if (file) {
      //     this.previewUrl = URL.createObjectURL(file);
      //     this.selectedLogoFile = file;
      //   } else {
      //     this.previewUrl = null;
      //     this.selectedLogoFile = null;
      //   }
      // },

      updateColorCode(riskElement) {
        let that = this;
        if (riskElement.probability && riskElement.consequence) {
          let point = riskElement.probability * riskElement.consequence;
          _.each(that.colorCodeArr, function(item) {
            if (point >= item.min && point <= item.max) {
              riskElement.colorCode = item.value;
              riskElement.colorName = item.name;
              riskElement.point = point;
            }
          });
        }
      },

      changeActionForm() {
        let that = this;
        if (that.$refs.formAllAction1.validate()) {
          that.actionStep = 2;
          that.changeActionTitle(this.actionStep);
        }
      },

      closeDialogAction() {
        this.dialogActionTask = false;
        this.dialogActionRisk = false;
        this.dialogAllAction = false;
        setTimeout(() => {
          // this.$refs.form.reset();
          this.$refs.form.resetValidation();
        }, 300);
      },

      closeDialogConfirmClosed() {
        this.dialogConfirmClose = false;
        this.addToAction = '';
      },

      saveAction() {
        let that = this;
        if (that.addToAction === 'task') {
          if (that.$refs.formActionTask.validate()) {
            that.$nuxt.$loading.start();
            that.editedItem.tasks = that.taskDetailArray;
            that.editedItem.risk_analysis = null;
            that.processReport();
            that.close();
          }
        } else if (that.addToAction === 'risk') {
          if (that.$refs.formActionRisk.validate()) {
            that.$nuxt.$loading.start();
            that.editedItem.tasks = null;
            that.processRiskBeforeSave();
            that.processReport();
            that.close();
          }
        } else if (that.addToAction === 'both') {
          if (that.$refs.formAllAction2.validate()) {
            that.$nuxt.$loading.start();
            that.editedItem.tasks = that.taskDetailArray;
            that.processRiskBeforeSave();
            that.processReport();
            that.close();
          }
        }
      },

      processReport() {
        let that = this;
        that.editedItem.deadline = that.deadline;
        that.editedItem.start_time = that.start_time;
        that.editedItem.checkpoint_arr = that.checkpointArr;
        that.closeDialogAction();
        that.$store.dispatch('reports/update', that.editedItem).then(function () {
          that.reloadList();
          that.reloadListCategory();
          that.$toaster.success(that.$i18n.t('message.success_checklist_report_update'));
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_checklist_report_update'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      },

      processRiskBeforeSave() {
        let that = this;
        that.riskItem.report_id = that.editedItem.id;
        that.riskItem.risk_elements = that.riskElementAnalysis;
        if (!that.riskItem.need_to_process) {
          that.riskItem.status = 3;
          that.riskItem.need_to_process = 0;
        } else {
          that.riskItem.status = 1;
          that.riskItem.need_to_process = 1;
        }
        that.editedItem.risk_analysis = that.riskItem;
      },

      // ------- Both action chosen
      changeActionTitle(step) {
        if (step === 1) {
          this.formActionTitle = 'Add Risk analysis';
        } else {
          this.formActionTitle = 'Add Task';
        }
      },
      // -------

      // show image
      // showAttachment(){
      //   this.checkAttachmentOpen = true;
      // },

      getImageSrc(url){
        let that = this;
        let result;
        axios({
          url: url,
          method: 'GET',
          responseType: 'blob', // important
        }).then((response) => {
          result = window.URL.createObjectURL(new Blob([response.data]));
          that.previewUrl = result;
          that.$nuxt.$loading.finish();
          return result;
        });
      },

      // getImage(file) {
      //   this.previewImage(file);
      // },

      updateResponsible() {
        let that = this;
        that.$nuxt.$loading.start();
        that.editedItem.updateResponsible = true;
        that.$store.dispatch('reports/update', that.editedItem).then(function () {
          that.reloadList();
          that.reloadListCategory();
          that.$toaster.success(that.$i18n.t('message.success_checklist_report_update'));
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_checklist_report_update'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
        that.close();
      },

      getDeadline(value) {
        this.deadline = value.date;
        this.editedItem.deadline_pre = this.deadline;
      },

      getStartDate(value) {
        this.start_time = value.date;
        this.editedItem.start_time_pre = this.start_time;
      },

      // action TASK
      getTaskArray(value) {
        this.taskDetailArray = value.taskArray;
      },

      getNewCategory(value) {
        this.editedItem.category_id = value.newCategoryId;
      },

      formatStatus(status) {
        if (status === 1) {
          return "New";
        } else if (status === 2) {
          return "Ongoing";
        } else if (status === 3) {
          return "Closed";
        }
      },
    },
  };
</script>

<style scoped>

</style>

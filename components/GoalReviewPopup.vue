<template>
  <div>
    <v-dialog
      v-model="openPopup"
      scrollable
      max-width="1125px"
      persistent
    >
      <v-card>
<!--        <v-card-title class="text-h5 justify-content-center text-uppercase">-->
<!--          {{ $t('title.review_goal') }}-->
<!--        </v-card-title>-->
        <v-card-text>
          <div class="popup-header text-center">
            {{ $t('title.review_goal') }}
          </div>
          <div class="review-popup">
            <div class="review-popup-table normal-table">
              <!-- Status -->
              <div v-if="!resource" class="info-block w-50 align-center">
                <div class="label-item">
                  {{ $t('form.status') }}:
                </div>
                <div class="info-item">
                  <v-chip
                    v-if="editedItem.status === 'new'"
                    class="status-label-custom pending"
                    label
                  >
                    {{ $t('form.new') }}
                  </v-chip>
                  <v-chip
                    v-else-if="editedItem.status === 'pending'"
                    class="ma-2 status-label-custom pending"
                    label
                  >
                    {{ $t('form.pending') }}
                  </v-chip>
                  <v-chip
                    v-else-if="editedItem.status === 'ongoing'"
                    class="ma-2 status-label-custom ongoing"
                    label
                  >
                    {{ $t('form.ongoing') }}
                  </v-chip>
                  <v-chip
                    v-else-if="editedItem.status === 'completed'"
                    class="status-label-custom completed"
                    label
                  >
                    {{ $t('form.completed') }}
                  </v-chip>
                  <v-chip
                    v-else-if="editedItem.status === 'closed'"
                    class="status-label-custom approved"
                    label
                  >
                    {{ $t('form.closed') }}
                  </v-chip>
                </div>
              </div>

              <!-- Type -->
              <div class="info-block w-50 align-center">
                <div class="label-item">
                  Type:
                </div>
                <div class="info-item">
                  <span>
                    {{ $t('form.goal') }}
                  </span>
                  <v-icon v-if="!isObject">
                    mdi-chevron-right
                  </v-icon>
                  <span v-if="!isObject">
                    {{ $t('form.sub_goal') }}
                  </span>
                </div>
              </div>

              <!-- Name -->
              <div class="info-block w-50">
                <div class="label-item">
                  {{ $t('form.name') }}:
                </div>
                <div
                  v-if="!isEdit"
                  class="info-item"
                  @click="((!editedItem.is_template && checkResponsible) || (editedItem.is_template && checkCreator)) ? (isEdit = !isEdit) : (isEdit = false)"
                >
                  {{ editedItem.name }}
                </div>
                <div v-else class="input-wrap w-100">
                  <v-text-field
                    v-model="editedItem.name"
                    :rules="required"
                    outlined
                  />
                </div>
              </div>

              <!-- Industry -->
              <div v-if="checkSuperAdmin" class="info-block w-50 chip">
                <div class="label-item">
                  {{ $t('form.industry') }}:
                </div>
                <div v-if="!isEdit" class="info-item" @click="checkCreator ? (isEdit = !isEdit) : (isEdit = false)">
                  <v-chip
                    v-for="(item, index) in editedItem.industryName"
                    :key="index"
                    class="mr-2 mb-1 chip-custom"
                    small
                  >
                    {{ item }}
                  </v-chip>
                </div>
                <div v-else class="w-100">
                  <MultipleSelection
                    :item="editedItem"
                    :selected-items-input="editedItem.industry"
                    :label="$t('form.industry')"
                    :item-text="'name'"
                    :item-value="'id'"
                    :list-option-input="industryArray"
                    :request-required="true"
                    @getSelectedItems="getSelectedIndustryItems"
                  />
                </div>
              </div>

              <!-- Category -->
              <div class="info-block w-50">
                <div class="label-item">
                  {{ $t('form.category') }}:
                </div>
                <div
                  v-if="!isEdit"
                  class="info-item"
                  @click="((!editedItem.is_template && checkResponsible) || (editedItem.is_template && checkCreator)) ? (isEdit = !isEdit) : (isEdit = false)"
                >
                  {{ editedItem.categoryName }}
                </div>
                <div v-else class="w-100">
                  <Category
                    :object-item="editedItem"
                    :type-category="'goal'"
                    @getNewCategory="getNewCategory"
                  />
                </div>
              </div>

              <!-- Number of time used -->
              <div v-if="resource" :class="checkSuperAdmin ? 'info-block' : 'info-block w-50'">
                <div class="label-item">
                  {{ $t('form.number_of_times_used') }}:
                </div>
                <div class="info-item">
                  {{ editedItem.number_used_time }}
                </div>
              </div>

              <!-- Description -->
              <div :class="isEdit ? 'info-block' : 'info-block description'">
                <div class="label-item">
                  {{ $t('form.description') }}:
                </div>
                <div
                  v-if="!isEdit"
                  class="info-item"
                  @click="((!editedItem.is_template && checkResponsible) || (editedItem.is_template && checkCreator)) ? (isEdit = !isEdit) : (isEdit = false)"
                >
                  {{ editedItem.description }}
                </div>
                <div v-else class="input-wrap form-description">
                  <FroalaSuggestionListEditor
                    :item="editedItem"
                    :predefined-link-array="predefinedLinkArray || []"
                  />
                </div>
              </div>

              <!-- Added by -->
              <div v-if="!resource" class="info-block w-50">
                <div class="label-item">
                  {{ $t('form.added_by') }}:
                </div>
                <div class="info-item">
                  {{ editedItem.addedByName }}
                </div>
              </div>

              <!-- Responsible -->
              <div v-if="!resource" class="info-block chip w-50">
                <div class="label-item">
                  {{ $t('form.responsible') }}:
                </div>
                <div v-if="!isEdit" class="info-item" @click="(checkAdmin || checkCreator) ? (isEdit = !isEdit) : (isEdit = false)">
                  <v-chip
                    v-for="(item, index) in responsibleName"
                    :key="index"
                    class="mr-2 mb-1 chip-custom"
                    small
                  >
                    {{ item }}
                  </v-chip>
                </div>
                <div v-else>
                  <ResponsibleEdit
                    :object-item="editedItem"
                  />
                </div>
              </div>

              <!-- Require comment -->
              <div v-if="!resource" class="info-block">
                <div class="label-item">
                  {{ $t('form.required') }}:
                </div>
                <div class="info-item">
<!--                  <span v-if="checkAdmin && editedItem.responsible['required_comment']">-->
<!--                    {{ $t('form.feedback') }}-->
<!--                  </span>-->
<!--                  <span v-if="checkAdmin && editedItem.responsible['required_comment'] && editedItem.responsible['required_attachment']">-->
<!--                    ' ,'-->
<!--                  </span>-->
<!--                  <span v-if="checkAdmin && editedItem.responsible['required_attachment']">-->
<!--                    {{ $t('form.image') }}-->
<!--                  </span>-->
                </div>
              </div>

              <!-- Start date -->
              <div v-if="!resource" class="info-block w-50">
                <div class="label-item">
                  {{ $t('form.start_date') }}:
                </div>
                <!-- View -->
                <div
                  v-if="(isObject && !isEdit) || !isObject"
                  class="info-item"
                  @click="checkResponsible ? (isEdit = !isEdit) : (isEdit = false)"
                >
                  {{ moment(editedItem.start_date + ' ' + editedItem.start_time).format('DD.MM.YYYY h:mm A') }}
                </div>
                <!-- Edit -->
                <div v-if="isObject && isEdit">
                  <StartDateEdit
                    :object-item="editedItem"
                    @changeDate="changeStartDate"
                  />
                </div>
              </div>

              <!-- Deadline -->
              <div v-if="!resource" class="info-block w-50">
                <div class="label-item">
                  {{ $t('form.deadline') }}:
                </div>
                <!-- View -->
                <div
                  v-if="(isObject && !isEdit) || !isObject"
                  class="info-item"
                  @click="checkResponsible ? (isEdit = !isEdit) : (isEdit = false)"
                >
                  {{ moment(editedItem.deadline + ' ' + editedItem.end_time).format('DD.MM.YYYY h:mm A') }}
                </div>
                <!-- Edit -->
                <div v-if="isObject && isEdit">
                  <DeadlineEdit
                    :object-item="editedItem"
                    :item="editedItem"
                    :change-custom="changeDeadlineCustom"
                  />
                </div>
              </div>
            </div>

            <!-- Sub goal -->
            <div
              v-if="!isObject && (checkAdmin || checkCreator || checkResponsible || checkAttendee)"
              class="review-popup-table"
            >
              <v-data-table
                :headers="computedExpandableHeaders"
                :items="filteredSubObjectItems"
                class="elevation-1 review-table review-table-row-cursor-pointer"
                :items-per-page="15"
                :single-expand="true"
                :sort-by="['created_at']"
                :sort-desc="[true, false]"
                hide-default-footer
                item-key="name"
                :expanded.sync="expanded"
                @click:row="expandTable"
              >
                <template v-slot:top>
                  <v-toolbar flat>
                    <v-toolbar-title>
                      {{ $t('form.sub_goal') }}
                    </v-toolbar-title>
                  </v-toolbar>
                </template>
                <template v-slot:item.total_attendee="{ item }">
                  {{ item.totalAttendee }}
                </template>
                <template v-slot:item.start_date="{ item }">
                  {{ moment(item.start_date + ' ' + item.start_time).format('DD.MM.YYYY h:mm A') }}
                </template>
                <template v-slot:item.deadline="{ item }">
                  {{ moment(item.deadline + ' ' + item.end_time).format('DD.MM.YYYY h:mm A') }}
                </template>
                <template v-slot:item.status="{ item }">
                  <v-progress-linear
                    height="25"
                    :color="item.rate === 0 ? 'rgb(231,134,134)' : item.rate === 100 ? 'rgb(153,213,128)' : 'rgb(255,214,101)'"
                    :value="item.rate"
                  >
                    <strong class="font-weight-bold" style="color: #141b04">
                      {{ item.rate }}%
                    </strong>
                  </v-progress-linear>
                </template>
                <!-- expand row table to show list Attendees -->
                <template v-if="showExpand" v-slot:expanded-item="{ headers, item }">
                  <td :colspan="headers.length" class="p-2">
                    <div class="review-popup">
                      <div class="review-popup-table normal-table">
                        <!-- Name -->
                        <div class="info-block w-50">
                          <div class="label-item">
                            {{ $t('form.name') }}:
                          </div>
                          <div
                            class="info-item"
                            @click="((!editedItem.is_template && checkResponsible) || (editedItem.is_template && checkCreator)) ? viewSubObject(item) : (isEdit = false)"
                          >
                            {{ item.name }}
                          </div>
                        </div>

                        <!-- Category -->
                        <div class="info-block w-50">
                          <div class="label-item">
                            {{ $t('form.category') }}:
                          </div>
                          <div
                            class="info-item"
                            @click="((!editedItem.is_template && checkResponsible) || (editedItem.is_template && checkCreator)) ? viewSubObject(item) : (isEdit = false)"
                          >
                            {{ item.categoryName }}
                          </div>
                        </div>

                        <!-- Description -->
                        <div :class="isEdit ? 'info-block' : 'info-block description'">
                          <div class="label-item">
                            {{ $t('form.description') }}:
                          </div>
                          <div
                            class="info-item"
                            @click="((!editedItem.is_template && checkResponsible) || (editedItem.is_template && checkCreator)) ? viewSubObject(item) : (isEdit = false)"
                          >
                            {{ item.description }}
                          </div>
                        </div>

                        <!-- Start date -->
                        <div v-if="!checkSuperAdmin" class="info-block w-50">
                          <!-- View -->
                          <div class="label-item">
                            {{ $t('form.start_date') }}:
                          </div>
                          <div
                            class="info-item"
                            @click="checkResponsible ? viewSubObject(item) : (isEdit = false)"
                          >
                            {{ moment(item.start_date + ' ' + item.start_time).format('DD.MM.YYYY h:mm A') }}
                          </div>
                        </div>

                        <!-- Deadline -->
                        <div v-if="!checkSuperAdmin" class="info-block w-50">
                          <!-- View -->
                          <div class="label-item">
                            {{ $t('form.deadline') }}:
                          </div>
                          <div
                            class="info-item"
                            @click="checkResponsible ? viewSubObject(item) : (isEdit = false)"
                          >
                            {{ moment(item.deadline + ' ' + item.end_time).format('DD.MM.YYYY h:mm A') }}
                          </div>
                        </div>
                      </div>

                      <!-- Attendee -->
                      <div v-if="!checkSuperAdmin" class="review-popup-table">
                        <v-data-table
                          :headers="headersAttendee"
                          :items="item.processingInfo"
                          class="elevation-1 review-table"
                          :items-per-page="15"
                          :single-expand="true"
                          :sort-by="['created_at']"
                          :sort-desc="[true, false]"
                          hide-default-footer
                        >
                          <template v-slot:top>
                            <v-toolbar flat>
                              <v-toolbar-title class="component-sub-goal">
                                {{ $t('form.attendee') }}
                              </v-toolbar-title>
                            </v-toolbar>
                          </template>
                          <template v-slot:item.comment="{ item }">
                            <span v-if="item.comment">{{ item.comment }}</span>
                            <span v-else>N/A</span>
                          </template>
                          <template v-slot:item.image="{ item }">
                            <div>
                              <v-icon
                                :class="item.image ? 'icon-custom image' : 'icon-custom image img-gray-scale'"
                                @click="viewImage(item)"
                              >
                                mdi-image
                              </v-icon>
                            </div>
                          </template>
                          <template v-slot:item.status="{ item }">
                            <v-chip
                              v-if="item.status === 'new'"
                              class="ma-2 status-label-custom pending"
                              label
                            >
                              {{ $t('form.new') }}
                            </v-chip>
                            <v-chip
                              v-else-if="item.status === 'pending'"
                              class="ma-2 status-label-custom pending"
                              label
                            >
                              {{ $t('form.pending') }}
                            </v-chip>
                            <v-chip
                              v-else-if="item.status === 'ongoing'"
                              class="ma-2 status-label-custom ongoing"
                              label
                            >
                              {{ $t('form.ongoing') }}
                            </v-chip>
                          </template>
                          <template v-slot:no-data>
                            {{ $t('table.no_data') }}
                          </template>
                        </v-data-table>
                      </div>
                    </div>
                  </td>
                </template>

<!--                <template v-slot:item.time_range="{ item }">-->
<!--                  <span v-if="item.start_date !== null && item.deadline !== null">-->
<!--                    {{ moment(item.start_date).format('DD.MM.YYYY') }} / {{ moment(item.deadline).format('DD.MM.YYYY') }}-->
<!--                  </span>-->
<!--                </template>-->
<!--                <template v-slot:item.marked="{ item }">-->
<!--                  <v-btn-->
<!--                    v-if="item.processingInfo.length > 0 && compareDate(item.start_date) && (item.processingInfo[0].status === 'new' || item.processingInfo[0].status === 'reopened')"-->
<!--                    small-->
<!--                    class="btn-save mr-2"-->
<!--                    @click="attendeeAddRequiredComment(item.processingInfo[0])"-->
<!--                  >-->
<!--                    {{ $t('button.done') }}-->
<!--                  </v-btn>-->
<!--                  <v-icon v-if="item.processingInfo.length > 0 && compareDate(item.start_date)" small>-->
<!--                    mdi-eye-->
<!--                  </v-icon>-->
<!--                </template>-->
<!--                <template v-slot:item.actions="{ item }">-->
<!--                  <v-icon-->
<!--                    v-if="checkAdmin || checkCreator"-->
<!--                    small-->
<!--                    class="mr-2"-->
<!--                    @click="viewSubObject(item)"-->
<!--                  >-->
<!--                    mdi-pencil-->
<!--                  </v-icon>-->
<!--                  <v-icon-->
<!--                    v-if="checkAdmin || checkCreator"-->
<!--                    small-->
<!--                    class="mr-2"-->
<!--                    @click="viewDeleteConfirmPopup(item, false)"-->
<!--                  >-->
<!--                    mdi-delete-->
<!--                  </v-icon>-->
<!--                </template>-->
<!--                <template v-slot:expanded-item="{ headers, item }">-->
<!--                  <td class="p-0" :colspan="headers.length">-->
<!--                    <div class="pb-4">-->
<!--                      <div class="data-table">-->
<!--                        <v-data-table-->
<!--                          :headers="computedHeaders"-->
<!--                          :items="item.processingInfo"-->
<!--                          class="elevation-1 review-table border-0"-->
<!--                          :items-per-page="15"-->
<!--                          :single-expand="true"-->
<!--                          :sort-by="['created_at']"-->
<!--                          :sort-desc="[true, false]"-->
<!--                          hide-default-footer-->
<!--                        >-->
<!--                          <template v-slot:item.comment="{ item }">-->
<!--                            <span v-if="item.comment">{{ item.comment }}</span>-->
<!--                            <span v-else>N/A</span>-->
<!--                          </template>-->
<!--                          <template v-slot:item.image="{ item }">-->
<!--                            <span v-if="item.image">-->
<!--                              <v-icon class="icon-custom image">mdi-image</v-icon>-->
<!--                            </span>-->
<!--                            <span v-else>N/A</span>-->
<!--                          </template>-->
<!--                          <template v-slot:item.status="{ item }">-->
<!--                            <v-chip-->
<!--                              v-if="item.status === 'done' || item.status === 'verify' || item.status === 'closed'"-->
<!--                              class="ma-2 status-label-custom done"-->
<!--                              label-->
<!--                            >-->
<!--                              {{ $t('form.done') }}-->
<!--                            </v-chip>-->
<!--                            <v-chip-->
<!--                              v-if="!(item.status === 'done' || item.status === 'verify' || item.status === 'closed')"-->
<!--                              class="ma-2 status-label-custom not-done"-->
<!--                              label-->
<!--                            >-->
<!--                              {{ $t('form.not_done') }}-->
<!--                            </v-chip>-->
<!--                          </template>-->
<!--                          <template v-slot:item.actions="{ item }">-->
<!--                            <div v-if="item.status === 'verify' || item.status === 'closed'">-->
<!--                              <v-btn-->
<!--                                text-->
<!--                                color="success"-->
<!--                              >-->
<!--                                {{ $t('form.accepted') }}-->
<!--                              </v-btn>-->
<!--                              <v-chip-->
<!--                                color="green"-->
<!--                                outlined-->
<!--                                class="border-0"-->
<!--                              >-->
<!--                                {{ $t('form.verify') }}-->
<!--                                <v-icon right>mdi-check-circle</v-icon>-->
<!--                              </v-chip>-->
<!--                            </div>-->
<!--                            <div v-else-if="item.status === 'reopened'">-->
<!--                              <v-btn-->
<!--                                text-->
<!--                                color="error"-->
<!--                              >-->
<!--                                {{ $t('form.declined') }}-->
<!--                              </v-btn>-->
<!--                              <v-chip-->
<!--                                color="green"-->
<!--                                outlined-->
<!--                                class="border-0"-->
<!--                              >-->
<!--                                {{ $t('form.verify') }}-->
<!--                                <v-icon right>mdi-check-circle</v-icon>-->
<!--                              </v-chip>-->
<!--                            </div>-->
<!--                            <div v-else-if="checkResponsible && item.status === 'done'">-->
<!--                              <v-btn-->
<!--                                text-->
<!--                                color="success"-->
<!--                                @click="responsibleAddRequiredComment(item, 'verify')"-->
<!--                              >-->
<!--                                {{ $t('form.accept') }}-->
<!--                              </v-btn>-->
<!--                              <v-btn-->
<!--                                text-->
<!--                                color="error"-->
<!--                                @click="responsibleAddRequiredComment(item, 'reopened')"-->
<!--                              >-->
<!--                                {{ $t('form.decline') }}-->
<!--                              </v-btn>-->
<!--                            </div>-->
<!--                          </template>-->
<!--                          <template v-slot:no-data>-->
<!--                            {{ $t('table.no_data') }}-->
<!--                          </template>-->
<!--                        </v-data-table>-->
<!--                      </div>-->
<!--                    </div>-->
<!--                  </td>-->
<!--                </template>-->
<!--                <template v-slot:item.manager_review="{ item }">-->
<!--                  <div v-if="item.status === 'verify' || item.status === 'closed'">-->
<!--                    {{ $t('form.accepted') }}-->
<!--                    <v-icon small class="ml-2">-->
<!--                      mdi-eye-->
<!--                    </v-icon>-->
<!--                  </div>-->
<!--                  <div v-if="item.status === 'reopened'">-->
<!--                    {{ $t('form.declined') }}-->
<!--                    <v-icon small class="ml-2">-->
<!--                      mdi-eye-->
<!--                    </v-icon>-->
<!--                  </div>-->
<!--                </template>-->
              </v-data-table>
            </div>

            <!-- Connected To -->
              <v-data-table 
                      v-if="(roleUser != 'manager' || connectToObject.length > 0) && !viewPopup"
                      :headers="connectToObjectTableHeaders" 
                      :items="connectToObject"
                      class="elevation-1 review-table review-popup-table mt-5"
                      :items-per-page="15"
                      :single-expand="true"
                      :sort-by="['created_at']"
                      :sort-desc="[true, false]"
                      hide-default-footer
              >
                  <template slot="top">
                      <v-toolbar flat>
                          <v-toolbar-title>
                              {{ $t('form.connected_to') }}
                          </v-toolbar-title>
                          <div v-if="checkAdmin || checkCreator">
                              <div role="button" v-if="!isEdit" @click="
                                    checkAdmin || checkCreator
                                      ? (isEdit = !isEdit)
                                      : (isEdit = false)
                                  " class="plus-icon-gray text-center d-flex align-center justify-center">
                                  +
                              </div>
                              <div role="button" v-else class="plus-icon text-center" @click="is_connect = !is_connect">
                                  +
                              </div>
                          </div>
                      </v-toolbar>
                  </template>
                  <template v-slot:item.connected_date="{ item }">
                    <span class="ml-4">
                        {{ moment(item.connected_date).format('DD-MM-YYYY') }}
                    </span>
                  </template>
                  <template v-slot:item.actions="{ item }">
                      <v-icon small title="View" @click="handleObjectOpen(item)">mdi-eye</v-icon>
                  </template>
              </v-data-table>
              
            <connect-to-object-modal
              v-if="is_connect"
              :isconnect="is_connect"
              :editedItem="editedItem"
              ref="connectToObject"
              :connect-to-object-table-data="connectToObject"
              :tableData="connectToObject"
              :connectToArrayInput="connectToObject"
              :connect-to-object-table-header="connectToObjectTableHeaders"
              :connectToObjectObject="object"
              :connectToObjectFunction="ctoFunction"
              :connectToObjectCategory="category"
              :class="connectToObjectTableProp.length <= 0 ? '' : 'cto-modal'"
              @editConnectToObject="editConnectToObject"
              @addConnectToObject="addConnectToObject"
              :openPopup="is_connect"
              @getConnectToArray="getConnectToArray"
              @closePopup="is_connect = false"
            ></connect-to-object-modal>

        <GoalReviewPopup 
                v-if="objectEditItem.type == 'goal'"
                :open-popup="isObjectOpen" 
                :object-item="objectEditItem"
                @closePopup="isObjectOpen = !isObjectOpen"
                :view-popup="isOnlyView"
        ></GoalReviewPopup>

        <TaskReviewPopup  
                v-if="objectEditItem.type == 'task'"
                :open-popup="isObjectOpen"
                :object-item="objectEditItem"
                @closePopup="isObjectOpen = !isObjectOpen" 
                :view-popup="isOnlyView"
        ></TaskReviewPopup>

        <ReviewRoutinePopup 
                v-if="objectEditItem.type == 'routine'"
                :open-popup="isObjectOpen"
                :document-item="objectEditItem"
                @closePopup="isObjectOpen = !isObjectOpen" 
                :view-popup="isOnlyView"
        ></ReviewRoutinePopup>

        <InstructionReviewPopup 
                v-if="objectEditItem.type == 'instruction'"
                :open-popup="isObjectOpen"
                :object-item="objectEditItem"
                @closePopup="isObjectOpen = !isObjectOpen"
                :view-popup="isOnlyView"
        ></InstructionReviewPopup>

        <RiskAnalysisReviewPopup 
                v-if="objectEditItem.type == 'risk'"
                :open-popup="isObjectOpen"
                :object-item="objectEditItem"
                @closePopup="isObjectOpen = !isObjectOpen" 
                :view-popup="isOnlyView"
        ></RiskAnalysisReviewPopup>

        <EditChecklistPopup 
                v-if="objectEditItem.type == 'checklist'"
                :open-popup="isObjectOpen" 
                :document-item="objectEditItem"
                @closePopup="isObjectOpen = !isObjectOpen" 
                :view-popup="isOnlyView"
        ></EditChecklistPopup>

        <ReviewDeviation 
                v-if="objectEditItem.type == 'deviation'"
                :open-popup="isObjectOpen"
                :deviation-item="objectEditItem"
                @closePopup="isObjectOpen = !isObjectOpen" 
                :view-popup="isOnlyView"
        ></ReviewDeviation>


            <!-- Attendee -->
            <div
              v-if="isObject && !resource && (checkAdmin || checkCreator || checkResponsible)"
              class="table-expand-show-attendee review-table p-3 mt-5"
            >
              <div class="title-expand pb-5">
                {{ $t('form.attendee') }}
              </div>
              <b-row class="expand">
                <b-col
                  v-for="(i, index) in editedItem.attendee?.employeeName"
                  :key="index"
                  cols="6"
                  class="expand-item"
                >
                  <div>
                    {{ i }}
                  </div>
                </b-col>
              </b-row>
            </div>

            <!-- Connect to -->
<!--            <div class="review-popup-table">-->
<!--              <ConnectToObject-->
<!--                :connect-to-array-input="connectToArray"-->
<!--                @getConnectToArray="getConnectToArray"-->
<!--              />-->
<!--            </div>-->

              
          </div>
        </v-card-text>
        <v-card-actions class="popup-footer">
          <v-spacer />
          <v-btn class="btn-cancel" text @click="close">
            {{ $t('button.cancel') }}
          </v-btn>
          <!-- Creator create/ update object -->
          <v-btn
            v-if="isEdit && (checkCreator || checkResponsible) && (editedItem.is_template || (!editedItem.is_template && compareDate(editedItem.start_date))) && !viewPopup"
            class="btn-save"
            @click="update"
            :disabled="!!planAccess?.lastPlanAccess?.goal">
            {{ $t('button.save') }}
          </v-btn>

          <!-- Apply -->
          <v-btn
            v-if="!checkSuperAdmin && (checkCreator || checkResponsible || editedItem.added_by === 1) && editedItem.is_template && !viewPopup"
            class="hse-btn-save"
            @click="viewAddNewObjectPopup"
            :disabled="!!planAccess?.lastPlanAccess?.goal">
            {{ $t('button.apply') }}
          </v-btn>

          <!-- Attendee process object -->
          <v-btn
            v-if="isObject && checkAttendee && compareDate(editedItem.start_date) && (attendeeProcessStatus === 'new' || attendeeProcessStatus === 'reopened') && !viewPopup"
            class="btn-save"
            @click="attendeeAddRequiredComment(attendeeProcessItem)"
            :disabled="!!planAccess?.lastPlanAccess?.goal">
            {{ $t('button.done') }}
          </v-btn>
          <!-- Delete object -->
          <v-btn
            v-if="(checkAdmin || checkCreator) && !viewPopup"
            class="hse-btn-delete"
            text
            @click="viewDeleteConfirmPopup(editedItem, true)"
          >
            <v-icon dark>
              mdi-delete
            </v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Sub goal EDIT popup -->
    <SubGoalEdit
      :open-popup="isEditSubObject"
      :object-item="editedSubObjectItem"
      :predefined-link-array="predefinedLinkArray || []"
      @closePopup="isEditSubObject = !isEditSubObject"
      @reloadList="reloadList"
      @viewItem="viewItem(editedItem)"
    />

    <!-- Popup view image -->
    <ViewImagePopup
      v-if="openViewImagePopup"
      :open-popup="openViewImagePopup"
      :object-item="editedImageItem"
      @closePopup="openViewImagePopup = !openViewImagePopup"
    />

    <!-- popup Required comment / attachment -->
    <RequiredCommentPopup
      :open-popup="openRequiredCommentPopup"
      :object-item="editedRequiredCommentItem"
      @closePopup="openRequiredCommentPopup = !openRequiredCommentPopup"
      @updateRequiredComment="updateRequiredComment"
    />

    <!-- Apply to ADD NEW goal -->
    <AddNewPopup
      :resource="false"
      :open-popup="isNewApplyObject"
      :form-title="$t('title.new_goal')"
      :object-field="objectField"
      :object-item="newItemGoal"
      :categories-array="categoriesArray || []"
      :categories-type="'goal'"
      :predefined-link-array="predefinedLinkArray || []"
      @savePopup="apply"
      @closePopup="closeAddNewObject"
    />

    <!-- Popup delete confirm -->
    <DeleteConfirmPopup
      :open-popup="dialogDelete"
      :object-index="editedIndex"
      :is-object="isDeleteObject"
      @closePopup="dialogDelete = !dialogDelete"
      @deleteItem="deleteItem"
    />
  </div>
</template>

<script>
  import {_} from 'vue-underscore';
  import cookies from "js-cookie";
  import FroalaSuggestionListEditor from "./FroalaSuggestionListEditor";
  import DeleteConfirmPopup from "./DeleteConfirmPopup";
  import StartDateEdit from "./StartDateEdit";
  import DeadlineEdit from "./DeadlineEdit";
  import SubGoalEdit from "./SubGoalEdit";
  import ResponsibleEditInReviewPopup from "./ResponsibleEditInReviewPopup";
  import CategoryInReviewPopup from "./CategoryInReviewPopup";
  import RequiredCommentPopup from "./RequiredCommentPopup";
  import ViewImagePopup from "./ViewImagePopup";
  import MultipleSelection from "./MultipleSelection";
  import AddNewPopup from "./AddNewPopup";
  import ConnectToObjectModal from './ConnectToObjectModal.vue'
  import moment from 'moment';

  export default {
    name: "GoalReviewPopup",
    components: {
      FroalaSuggestionListEditor,
      DeleteConfirmPopup,
      StartDateEdit,
      DeadlineEdit,
      SubGoalEdit,
      ResponsibleEdit: ResponsibleEditInReviewPopup,
      Category: CategoryInReviewPopup,
      RequiredCommentPopup,
      ViewImagePopup,
      MultipleSelection,
      AddNewPopup,
      ConnectToObjectModal,
      GoalReviewPopup: () => import('./GoalReviewPopup.vue'),
      TaskReviewPopup: () => import('./TaskReviewPopup.vue'),
      ReviewRoutinePopup: () => import('./ReviewRoutinePopup.vue'),
      RiskAnalysisReviewPopup: () => import('./RiskAnalysisReviewPopup.vue'),
      ReviewDeviation: () => import('./ReviewDeviation.vue'),
      EditChecklistPopup: () => import('./EditChecklistPopup.vue'),
      InstructionReviewPopup: () => import('./InstructionReviewPopup.vue'),
      // ConnectToObject
    },
    props: {
      openPopup: {
        type: Boolean,
        required: false,
      },
      viewPopup: {
        type: Boolean,
        required: false,
      },
      objectItem: {
        type: Object,
        required: true,
      },
      categoriesArray: {
        type: Array,
        required: false,
      },
      predefinedLinkArray: {
        type: Array,
        required: false,
      },
      resource: Boolean,
      industryArray: {
        type: Array,
        required: false,
      },
    },
    data: () => ({ 
      roleUser: cookies.get('roleUser'),
      checkSuperAdmin: cookies.get('checkSuperAdmin'),
      planAccess: JSON.parse(localStorage.getItem('planAccess')),
      checkAdmin: cookies.get('checkAdmin'),
      userLogged: parseInt(cookies.get('userID')),
      today: new Date().toISOString().substr(0, 10),
      valid: true,
      required: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else return true;
        }
      ],
      isObjectOpen: false,
      isOnlyView : false,
      objectEditItem : {},
      category: [],
      object: [],
      connectToObject: [],
      is_connect: false,
      connectToObjectTableProp: [],
      isEdit: false,
      isEditSubObject: false,
      openRequiredCommentPopup: false,
      hoverQuestionMark: false,
      changeDeadlineCustom: false,
      checkCreator: false,
      checkResponsible: false,
      checkAttendee: false,
      editedItem: {},
      editedSubObjectItem: {},
      editedRequiredCommentItem: {},
      dialogDelete: false,
      editedIndex: 0,
      isDeleteObject: false,
      responsibleName: [],
      isObject: false,
      attendeeProcessItem: {},
      attendeeProcessId: '',
      attendeeProcessStatus: '',
      connectToArray: [],
      // expand
      expanded: [],
      showExpand: false,
      // image
      openViewImagePopup: false,
      editedImageItem: null,

      // add new popup - list object fields
      isNewApplyObject: false,
      objectField: [
        'name',
        'description',
        'goal-type',
        'category',
        'connect-to',
        'sub-goal',
        'responsible',
        'attendee',
        'start-date',
        'deadline',
      ],
      newItemGoal: {
        is_template: false,
        name: "",
        type: 'goal',
        description: "",
        category_id: '',
        is_suggestion: false,
        is_valid: true,
        status: 'new',
        required_comment: false,
        required_attachment: false,
        // time management
        start_date: '',
        start_date_pre: '',
        deadline: '',
        deadline_pre: '',
        // sub goal
        subGoal: [],
        // responsible - attendee
        isDefaultResponsible: true,
        responsible_department_array: [],
        responsible_employee_array: [],
        isDefaultAttendee: true,
        attendee_department_array: [],
        attendee_employee_array: [],
        attendee_all: false,
        // required comment
        responsible_required_comment: false,
        responsible_required_attachment: false,
        attendee_required_comment: false,
        attendee_required_attachment: false,
        connectToArray: [],
      },
      defaultItemGoal: {
        is_template: false,
        name: "",
        type: 'goal',
        description: "",
        category_id: '',
        is_suggestion: false,
        is_valid: true,
        status: 'new',
        required_comment: false,
        required_attachment: false,
        // time management
        start_date: '',
        start_date_pre: '',
        deadline: '',
        deadline_pre: '',
        // sub goal
        subGoal: [],
        // responsible - attendee
        isDefaultResponsible: true,
        responsible_department_array: [],
        responsible_employee_array: [],
        isDefaultAttendee: true,
        attendee_department_array: [],
        attendee_employee_array: [],
        attendee_all: false,
        // required comment
        responsible_required_comment: false,
        responsible_required_attachment: false,
        attendee_required_comment: false,
        attendee_required_attachment: false,
        connectToArray: [],
      },

      ctoFunction: [
      { id: 'Task', name: 'task' },
      { id: 'Goal', name: 'goal' },
      { id: 'Routine', name: 'routine' },
      { id: 'Instruction', name: 'instruction' },
      { id: 'Risk element source', name: 'risk' },
      { id: 'Checklist', name: 'checklist' },
      { id: 'Attachment', name: 'attachment' },
      { id: 'Document', name: 'document' },
      { id: 'Contact', name: 'contact' },
      { id: 'Deviation', name: 'deviation' },
    ],
    }),

    computed: {
      headersAttendee() {
        return [
          {text: this.translateCol('employee_name'), value: 'attendeeName', align: 'left'},
          {text: this.translateCol('comment'), value: 'comment', align: 'center'},
          {text: this.translateCol('image'), value: 'image', align: 'center'},
          {text: this.translateCol('status'), value: 'status', align: 'center'},
        ];
      },

      expandableHeader() {
        return [
          {text: this.translateCol('name'), value: 'name', align: 'left'},
          {text: this.translateCol('total_attendee'), value: 'total_attendee', align: 'center'},
          {text: this.translateCol('start_date'), value: 'start_date', align: 'center'},
          {text: this.translateCol('deadline'), value: 'deadline', align: 'center'},
          {text: this.translateCol('status'), value: 'status', align: 'center'},

          // {text: this.translateCol('actions'), value: 'actions', align: 'center'},
          // {text: '', value: 'data-table-expand', align: 'center'},
          // {text: this.translateCol('time_range'), value: 'time_range', align: 'center'},
        ];
      },

      expandableAttendeeHeader() {
        return [
          {text: this.translateCol('name'), value: 'name', align: 'left'},
          {text: this.translateCol('start_date'), value: 'start_date', align: 'center'},
          {text: this.translateCol('deadline'), value: 'deadline', align: 'center'},
          {text: this.translateCol('status'), value: 'status', align: 'center'},
          {text: this.translateCol('actions'), value: 'actions', align: 'center'},

          // {text: this.translateCol('time_range'), value: 'time_range', align: 'center'},
          // {text: this.translateCol('marked'), value: 'marked', align: 'center'},
          // {text: this.translateCol('manager_review'), value: 'manager_review', align: 'center'},
        ];
      },

      headersTemplate() {
        return [
          {text: this.translateCol('name'), value: 'name', align: 'left', sortable: false},
          {text: this.translateCol('description'), value: 'description', align: 'center', sortable: false},
        ];
      },

      computedExpandableHeaders () {
        if (this.resource) {
          return this.headersTemplate;
        } else {
          if (this.checkAdmin || this.checkCreator || this.checkResponsible) {
            return this.expandableHeader;
          } else if (this.checkAttendee) {
            return this.expandableAttendeeHeader;
          } else {
            return [];
          }
        }
      },

      filteredSubObjectItems() {
        let that = this;
        if (that.checkSuperAdmin || that.checkAdmin || that.checkCreator || that.checkResponsible || that.checkAttendee)
          return that.editedItem.subObject;
        else return [];
      },

      connectToObjectTableHeaders() {
      return [
          { text: this.translateCol('name'), value: 'objectName', },
             { text: this.translateCol('source'), value: 'connect_to_source' },
             { text: this.translateCol('category'), value: 'categoryName' },
             { text: this.translateCol('added_by'), value: 'addedByUser' },
             { text: this.translateCol('connected_by'), value: 'connectedByUser' },
             { text: this.translateCol('connected_date'), value: 'created_at' },
             { text: this.translateCol('actions'), align: 'center', value: 'actions', sortable: false, },
      ]
    },
    },

    watch: {
      openPopup(value) {
        if (value) {
          this.getObject({type:'goal', objectID: this.objectItem.id});
          this.viewItem(this.objectItem);
        }
      },
    },

    mounted() {
    },

    created() {
      if (this.openPopup) {
        if (this.objectItem) {
          this.viewItem(this.objectItem);
        }
      }
    },

    methods: {

    handleObjectOpen(item) {
      this.objectEditItem = {
        'id':item.source_id,
        'type': item.connect_to_source,
      };
      this.isObjectOpen = true;
      this.isOnlyView = true;
      },


    editConnectToObject(payload) {
      console.log(payload)
    },
      async addConnectToObject(payload) {
      this.connectToArray = payload
      this.resetConnectToObjectFrom()
      this.connectToObjectFrom.connectToArray.push(payload.connectToArray)
      this.connectToObjectFrom.object_id = payload.object_id
      await this.getObject(this.editedItem)
    },

      // getConnectToArray(value) {
      //   let that = this;
      //   that.connectToArray = value;
      //   that.isEdit = true;
      // },


    getConnectToArray (data) {
          this.connectToObject = data;
      },

      async getObject (item) {
          this.connectToObject = [];
          await this.$store.dispatch('connectToObject/getByObject', item).then((result) => {
              let respo = result.data;
              if (respo.length > 0) {
                  respo.forEach((el) => {
                      this.connectToObject.push({
                          connect_to_source: el.connect_to_source,
                          objectName: el.objectName || 'N/A',
                          categoryName: el.categoryName || 'N/A',
                          addedByUser: el?.addedByUser || 'N/A',
                          connectedByUser: el.connectedByUser || 'N/A',
                          created_at: moment(el.connected_date).format('DD.MM.YYYY'),
                          categoryID: el.categoryID,
                          source_id: el.source_id,
                          id: el.id,
                      });
                  });
              } else {
                  this.connectToObject = [];
              }
          }).catch((error) => {
              console.log(error);
          });
      },

      viewItem(item) {
        let that = this;
        // that.formDirty = false;
        that.$nuxt.$loading.start();
        if (!item.is_template) {
          // connect to
          that.$store.dispatch('connectToObject/getByObject', {type: item.type, objectID: item.id}).then(result => {
            that.connectToArray = result.data;
            that.$nuxt.$loading.finish();
          }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
            that.$nuxt.$loading.finish();
          }
          });
        }

        // object
        that.$store.dispatch('objects/show', item.id).then(result => {
          that.editedItem = Object.assign({}, result.data);
          that.isObject = _.isEmpty(result.data.subObject);
          that.checkCreator = _.contains(result.data.role, 'creator');
          that.checkResponsible = _.contains(result.data.role, 'responsible');
          if (!that.checkCreator || !that.checkResponsible) {
            if (that.isObject) {
              that.checkAttendee = _.contains(result.data.role, 'attendee');
              if (that.checkAttendee) {
                let processAttendee = _.filter(result.data.processingInfo, function (o) {
                  return o.user_id === that.userLogged;
                });
                if (processAttendee.length) {
                  that.attendeeProcessItem = processAttendee[0];
                  that.attendeeProcessId = processAttendee[0].process_id;
                  that.attendeeProcessStatus = processAttendee[0].status;
                }
              }
            } else {
              that.checkAttendee = _.contains(result.data.roleSubObject, 'attendee');
            }
          }
          if (!that.editedItem.is_template) {
            that.responsibleName = result.data.responsible ? result.data.responsible['employeeName'] : null;
            that.editedItem.responsible_employee_array = that.editedItem.responsible ? 
                JSON.parse(that.editedItem.responsible['employee_array']) : [];
          }
          // that.editedItem.historyArray = _.sortBy(result.data.history, function(o) { return o.updated_at; });
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response?.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_goal_view_detail'));
          }
          that.$nuxt.$loading.finish();
        });
      },

      viewSubObject(item) {
        this.isEditSubObject = true;
        this.editedSubObjectItem = item;
      },

      // Apply resource to add new object
      viewAddNewObjectPopup() {
        this.isNewApplyObject = true;
        this.newItemGoal.name = this.editedItem.name;
        this.newItemGoal.category_id = this.editedItem.category_id;
        this.newItemGoal.description = this.editedItem.description;
        this.newItemGoal.subGoal = this.editedItem.subObject;
      },

      closeAddNewObject() {
        this.isNewApplyObject = !this.isNewApplyObject;
        this.newItemGoal = Object.assign({}, this.defaultItemGoal);
      },

      viewDeleteConfirmPopup(item, isObject) {
        this.editedIndex = item.id;
        this.isDeleteObject = isObject;
        this.dialogDelete = true;
      },

      expandTable(item) {
        if (this.checkAdmin || this.checkCreator || this.checkResponsible || this.checkAttendee) {
          this.showExpand = !this.showExpand;
          this.expanded = [];
          const indexExpanded = this.expanded.findIndex((i) => i === item);
          if (indexExpanded > -1) {
            this.expanded.splice(indexExpanded, 1);
          } else {
            this.expanded.push(item);
          }
        }
      },

      responsibleAddRequiredComment(item, status) {
        if (status === 'reopened' || this.editedItem.responsible['required_comment'] || this.editedItem.responsible['required_attachment']) {
          this.openRequiredCommentPopup = true;
          this.editedRequiredCommentItem = item;
          if (this.checkAdmin || this.checkCreator) {
            this.editedRequiredCommentItem.isCreator = true;
          } else if (this.checkResponsible) {
            this.editedRequiredCommentItem.isResponsible = true;
          }
          this.editedRequiredCommentItem.requiredComment = (status === 'reopened') ? 1 : this.editedItem.responsible['required_comment'];
          this.editedRequiredCommentItem.requiredAttachment = (status === 'reopened') ? 0 : this.editedItem.responsible['required_attachment'];
          this.editedRequiredCommentItem.new_status = status;
        } else {
          this.updateStatus(item.process_id, status, null);
        }
      },

      attendeeAddRequiredComment(item) {
        if (item['required_comment'] || item['required_attachment']) {
          this.openRequiredCommentPopup = true;
          this.editedRequiredCommentItem = item;
          this.editedRequiredCommentItem.isAttendee = true;
          this.editedRequiredCommentItem.requiredComment = item['required_comment'];
          this.editedRequiredCommentItem.requiredAttachment = item['required_attachment'];
        } else {
          this.updateStatus(item.process_id, 'done', null);
        }
      },

      compareDate(start) { // check if start date yet
        const [year, month, day] = start.split('-');
        const [yearToday, monthToday, dayToday] = this.today.split('-');
        return yearToday > year || (yearToday <= year && monthToday > month) || (yearToday <= year && monthToday <= month && dayToday >= day);
      },

      translateCol (colName) {
        return this.$i18n.t('column.' + colName);
      },

      getNewCategory(value) {
        this.editedItem.category_id = value.newCategoryId;
      },

      changeStartDate(val) {
        this.changeDeadlineCustom = !!val.changed;
      },

      close() {
        this.isEdit = false;
        this.showExpand = false;
        if (this.openPopup) {
          this.$emit('closePopup');
        }
      },

      reloadList() {
        this.$emit('reloadList');
      },

      reloadListCategory(){
        this.$emit('reloadListCategory');
      },

      update() { // update
        let that = this;
        // that.$nuxt.$loading.start();
        that.editedItem.requestEdit = true;
        that.editedItem.connectToArray = that.connectToObject;
        if (that.editedItem.is_template) {
          if (that.checkSuperAdmin && that.editedItem.subObject.length > 0) {
            _.each(that.editedItem.subObject, function (item) {
              item.industry = that.editedItem.industry;
            });
          }
        } else {
          that.editedItem.isDefaultResponsible = false;
          that.editedItem.isDefaultAttendee = false;
          that.editedItem.attendee_all = false;
          that.editedItem.responsible_required_comment = that.editedItem.responsible['required_comment'];
          that.editedItem.responsible_required_attachment = that.editedItem.responsible['required_attachment'];
          that.editedItem.attendee_required_comment = that.editedItem.attendee ?
          that.editedItem.attendee['required_comment']: '';
          that.editedItem.attendee_required_attachment = that.editedItem.attendee ? 
          that.editedItem.attendee['required_attachment'] : '';
          that.editedItem.start_date = that.editedItem.start_date_pre;
          that.editedItem.deadline = that.editedItem.deadline_pre;
        }
        
        that.$store.dispatch('objects/update', that.editedItem).then(function () {
          that.reloadList();
          // that.reloadListCategory();
          that.$toaster.success(that.$i18n.t('message.success_goal_update'));
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_goal_update'));
          }
          that.$nuxt.$loading.finish();
        });
        that.close();
      },

      apply(value) {
        let that = this;
        that.$nuxt.$loading.start();
        that.newItem = value.item;
        that.newItem.apply_object_id = that.editedItem.id;
        if (that.newItem.subGoal.length > 0) {
          _.each(that.newItem.subGoal, function (item) {
            item.isDefaultResponsible = that.newItem.isDefaultResponsible;
            item.responsible_department_array = that.newItem.responsible_department_array;
            item.responsible_employee_array = that.newItem.responsible_employee_array;
            item.responsible_required_comment = that.newItem.responsible_required_comment;
            item.responsible_required_attachment = that.newItem.responsible_required_attachment;
            item.start_date = item.start_date_pre;
            item.start_time = item.start_time_pre;
            item.deadline = item.deadline_pre;
            item.end_time = item.end_time_pre;
          });
        } else {
          that.newItem.start_date = that.newItem.start_date_pre;
          that.newItem.start_time = that.newItem.start_time_pre;
          that.newItem.deadline = that.newItem.deadline_pre;
          that.newItem.end_time = that.newItem.end_time_pre;
        }
        that.$store.dispatch('objects/store', that.newItem).then(function () {
          that.reloadList();
          that.reloadListCategory();
          that.newItemGoal = Object.assign({}, that.defaultItemGoal);
          that.$toaster.success(that.$i18n.t('message.success_goal_add_new'));
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_goal_add_new'));
          }
          that.$nuxt.$loading.finish();
        });
        that.isNewApplyObject = !that.isNewApplyObject;
        that.close();
      },

      deleteItem(val) {
        let that = this;
        that.$store.dispatch('objects/delete', val.index).then(function() {
          that.reloadList();
          that.$toaster.success(that.$i18n.t('message.success_goal_delete'));
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_goal_delete'));
          }
          that.$nuxt.$loading.finish();
        });
        that.dialogDelete = false;
        if (val.isObject) {
          that.close();
        } else {
          that.viewItem(that.editedItem);
        }
      },

      updateRequiredComment(val) {
        this.updateStatus(val.processID, val.newStatus, val.comment);
        if (val.attachment && val.attachment.length !== 0) {
          this.saveAttachment(val.attachment, val.processID);
        }
      },

      updateStatus(processID, newStatus, comment) {
        let that = this;
        that.$nuxt.$loading.start();
        let item = that.editedItem;
        that.editedItem.newStatus = newStatus;
        that.editedItem.processID = processID;
        if (that.checkAttendee) {
          that.editedItem.comment = comment;
        } else {
          that.editedItem.responsible_comment = comment;
        }
        that.$store.dispatch('objects/updateStatus', that.editedItem).then(function() {
          that.reloadList();
          that.viewItem(item);
          // that.$toaster.success(that.$i18n.t('message.success_goal_delete'));
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }
          // that.$toaster.error(that.$i18n.t('message.fail_goal_delete'));
          that.$nuxt.$loading.finish();
        });
      },

      saveAttachment(file, processID) {
        let that = this;
        that.$nuxt.$loading.start();
        let formData = new FormData();
        formData.append('file', file);
        formData.append('processing_id', processID);
        if (this.checkAdmin || this.checkCreator) {
          formData.append('added_by_role', 'creator');
        } else if (that.checkResponsible) {
          formData.append('added_by_role', 'responsible');
        } else if (that.checkAttendee) {
          formData.append('added_by_role', 'attendee');
        }
        that.$store.dispatch('attachments/store', formData).then(function () {
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_attachment_add_new'));
          }
          that.$nuxt.$loading.finish();
        });
      },

      viewImage(item) {
        if (item.image) {
          this.openViewImagePopup = !this.openViewImagePopup;
          this.editedImageItem = item.image;
        }
      },

      getSelectedIndustryItems(value) {
        this.editedItem.industry = value.selectedItemsOutput;
      },
    },
  };
</script>

<style scoped>

.plus-icon-gray {
  width: 25px;
  height: 25px;
  background-color: #9f9f9f;
  margin-left: 10px;
  border-radius: 100%;
  font-size: 25px;
  line-height: 25px;
  color: #fff;
}
.plus-icon {
  width: 25px;
  height: 25px;
  background-color: #85a33d;
  margin-left: 10px;
  border-radius: 100%;
  font-size: 25px;
  line-height: 25px;
  color: #fff;
}

.primary-color{
    color: #87a53a;
}

.section-connect-to .section-connect-to-label.section-connect-to-label-reminder {
  z-index: 2;
  color: unset;
  width: 140px;
}

:deep(.connect-to-object-table .v-data-table__wrapper) {
  padding-top: 30px;
}

.icon-plus-circle {
  z-index: 2;
  right: 5rem;
  font-size: 28px !important;
  border: 6px solid white !important;
}
.primary-color{
    color: #87a53a;
}

:deep(.connect-to-object-table .v-data-table__wrapper) {
  padding-top: 30px;
}
</style>

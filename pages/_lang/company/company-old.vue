<template>
  <div class="page-company-detail">
    <b-tabs v-model="tabIndex" card name="test" lazy>
      <keep-alive>
        <b-tab :title="$t('tab.overview')" :active="!this.$route.query.type" name="result-tab" class="result-tab">
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyOverview" />
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-card width="100%">
                  <div class="text-left box-title">
                    {{ $t('title.business_information') }}
                  </div>
                  <v-container>
                    <v-row justify="space-around" class="pb-7">
                      <div class="logo-wrapper" @click="showAttachment">
                        <img v-if="!previewUrl" src="~/assets/images/common/no-image-available.jpg" alt="logo">
                        <img v-if="previewUrl" v-bind:src="previewUrl" alt="logo">
                      </div>
                    </v-row>
                    <div class="hse-preview-detail-info">
                      <b-row class="align-items-center hse-company-name" align-h="center">
                        <h4>{{ companyInfo.name }}</h4>
                      </b-row>
                      <b-row class="sm-padding-row">
                        <b-col cols="6" class="info-key text-right">{{ $t('title.vat_number') }}</b-col>
                        <b-col cols="6" class="input-wrap text-left">{{companyInfo.vat_number}}</b-col>
                      </b-row>
                      <b-row class="sm-padding-row">
                        <b-col cols="6" class="info-key text-right">{{ $t('title.industry') }}</b-col>
                        <b-col cols="6" class="input-wrap text-left">{{companyInfo.industry_name}}</b-col>
                      </b-row>
                      <b-row class="sm-padding-row">
                        <b-col cols="6" class="info-key text-right">{{ $t('title.established') }}</b-col>
                        <b-col v-if="companyInfo.established_date" cols="6" class="input-wrap text-left">
                          {{ moment(companyInfo.established_date).format('DD.MM.YYYY') }}
                        </b-col>
                      </b-row>
                      <b-row class="sm-padding-row">
                        <b-col cols="6" class="info-key text-right">{{ $t('title.active_since') }}</b-col>
                        <b-col v-if="companyInfo.active_since" cols="6" class="input-wrap text-left">
                          {{ moment(companyInfo.active_since).format('DD.MM.YYYY') }}
                        </b-col>
                      </b-row>
                      <b-row class="sm-padding-row">
                        <b-col cols="6" class="info-key text-right">{{ $t('title.address') }}</b-col>
                        <b-col cols="6" class="input-wrap text-left">
                          <div>{{companyInfo.address}}</div>
                          <div>{{companyInfo.city}}</div>
                          <div>{{companyInfo.zip_code}}</div>
                        </b-col>
                      </b-row>
                      <b-row class="sm-padding-row">
                        <b-col cols="6" class="info-key text-right">{{ $t('title.contact') }}</b-col>
                        <b-col cols="6" class="input-wrap text-left">
                          <div>{{companyInfo.email}}</div>
                          <div>{{companyInfo.website}}</div>
                          <div>{{companyInfo.phone_number}}</div>
                        </b-col>
                      </b-row>
                    </div>
                  </v-container>
                  <div v-if="checkAdmin" class="box-footer">
                    <div class="text-right">
                      <button class="btn btn-default btn-edit-footer" @click="checkOpen = true">
                        {{ $t('button.company_detail') }}
                      </button>
                      <button class="btn btn-default btn-edit-footer" @click="checkContactInfoOpen = true">
                        {{ $t('button.contact_info') }}
                      </button>
                    </div>
                  </div>
                </v-card>
              </v-col>
              <v-col cols="12" sm="6">
                <!-- card right -->
                <v-card width="100%">
                  <div class="text-left box-title">
                    {{ $t('title.overview') }}
                  </div>
                  <v-container>
                    <div>
                      <b-row class="sm-padding-row">
                        <b-col cols="6" class="info-key text-right">{{ $t('title.ceo') }}</b-col>
                        <b-col cols="6" class="input-wrap text-left">{{ companyInfo.ceoName }}</b-col>
                      </b-row>
                      <b-row class="sm-padding-row">
                        <b-col cols="6" class="info-key text-right">{{ $t('title.hse_manager') }}</b-col>
                        <b-col cols="6" class="input-wrap text-left">{{ companyInfo.hseManagerName }}</b-col>
                      </b-row>
                      <b-row class="sm-padding-row">
                        <b-col cols="6" class="info-key text-right">{{ $t('title.safety_manager') }}</b-col>
                        <b-col cols="6" class="input-wrap text-left">{{ companyInfo.safetyManagerName }}</b-col>
                      </b-row>
                      <b-row class="sm-padding-row">
                        <b-col cols="6" class="info-key text-right">{{ $t('title.employees') }}</b-col>
                        <b-col cols="6" class="input-wrap text-left">{{companyInfo.countEmployee}}</b-col>
                      </b-row>
                    </div>
                  </v-container>
                  <div v-if="checkAdmin" class="box-footer">
                    <div class="text-right">
                      <button class="btn btn-default btn-edit-footer" @click="checkOverviewInfoOpen = true">
                        {{ $t('button.edit') }}
                      </button>
                    </div>
                  </div>
                </v-card>
                <v-card width="100%">
                  <div class="text-left box-title">
                    {{ $t('title.attachments') }}
                  </div>
                  <DocumentPopup
                    :open-popup="checkDocumentOpen"
                    :resource="false"
                    :categories-array="categoriesArray"
                    :category-type="category_type"
                    :category-added-from="category_added_from"
                    :type="'attachment'"
                    :added-from="document_added_from"
                    @closePopup="checkDocumentOpen = !checkDocumentOpen"
                    @reloadList="reloadList"
                  />
                  <DocumentTable
                    :no-filter-setting="true"
                    :resource="false"
                    :list-array-input="documents"
                    :categories-array="categoriesArray"
                    :category-type="category_type"
                    :category-added-from="category_added_from"
                    :attachment-item="companyInfo"
                    @reloadList="reloadList"
                  />
                  <div class="box-footer">
                    <div class="text-right">
                      <button
                        v-if="checkAdmin || permissionsUser.indexOf('company-basic') > -1"
                        class="btn btn-default btn-edit-footer"
                        @click="checkDocumentOpen = true"
                      >
                        {{ $t('button.add_attachment') }}
                      </button>
                    </div>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </b-tab>
      </keep-alive>
      <keep-alive>
        <b-tab :title="$t('tab.hse_statement')" name="detail-tab">
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyHSEstatement" />
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-btn
                  v-if="checkAdmin || permissionsUser.indexOf('statement-basic') !== -1"
                  class="mb-2 btn-create d-block ml-auto btn-custom-green"
                  @click="addNewStatement"
                >
                  {{ $t('button.add_new') }}
                </v-btn>
                <v-data-table :headers="headersStatement" :items="filteredStatementItems" class="elevation-1 hse-table"
                              :items-per-page="25"
                              :single-expand="true" :search="searchStatement" :sort-desc="[true]"
                              @click:row="editStatementItem"
                >
                  <template v-slot:top>
                    <div class="setting-header">
                      <div class="panel-heading">
                        <h4 class="panel-title">
                          {{ $t('title.sort_by') }}
                        </h4>
                        <b-row>
                          <b-col>
                            <div class="field-selection field-search">
                              <v-text-field
                                v-model="searchStatement"
                                append-icon="search"
                                :label="$t('setting.search')"
                                outlined
                              >
                    <template v-slot:append>
                      <img src="@/assets/images/icon/magnifier.png" class="search-icon-cust">
                    </template>
                  </v-text-field> 
                            </div>
                          </b-col>
                        </b-row>
                      </div>
                    </div>
                  </template>

                  <template v-slot:header="{ props: { headers } }">
                    <h4 class="table-name">
                      {{ $t('table.hse_statement') }}
                    </h4>
                  </template>
                  <template v-slot:item.user_added="{ item }">
                    {{ item.user_added.first_name }} {{ item.user_added.last_name }}
                  </template>
                  <template v-slot:no-data>
                    {{ $t('table.no_data') }}
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-container>
        </b-tab>
      </keep-alive>
      <keep-alive v-if="checkAdmin || permissionsUser.indexOf('category-basic') !== -1">
        <b-tab :title="$t('tab.categories')" :active="this.$route.query.type === 'category'" name="category-tab" class="hse-tab-item">
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyCategory" />
          <v-container>
            <b-tabs v-model="tab_categories_type" card name="test" class="section-categories" lazy>
              <v-btn class="mb-2 btn-create btn-custom-green" @click="addNew">
                {{ $t('button.add_new') }}
              </v-btn>
              <keep-alive>
                <b-tab :title="$t('subTab.routines')" :active="this.$route.query.subType === '1'" name="routine-tab" class="result-tab">
                  <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyCategoryRoutine" />
                  <v-container>
                    <v-data-table :headers="headerCategory" :items="filteredCategoryItems" class="elevation-1 hse-table"
                                  :items-per-page="15"
                                  :single-expand="true" :search="search" :sort-desc="[true]"
                                  @click:row="editCategoryItem"
                    >
                      <template v-slot:top>
                        <div class="setting-header">
                          <div class="panel-heading">
                            <h4 class="panel-title">
                              {{ $t('title.sort_by') }}
                            </h4>
                            <b-row>
                              <b-col cols="6">
                                <div class="field-selection field-search">
                                  <v-text-field
                                    v-model="search"
                                    append-icon="search"
                                    :label="$t('setting.search')"
                                    outlined
                                  >
                    <template v-slot:append>
                      <img src="@/assets/images/icon/magnifier.png" class="search-icon-cust">
                    </template>
                  </v-text-field> 
                                </div>
                              </b-col>
                            </b-row>
                          </div>
                          <div class="panel-footer text-right">
                            <!--                  <a type="button" class="btn btn-default" @click="addNewGoal"> New goal</a>-->
                          </div>
                        </div>
                      </template>

                      <template v-slot:header="{ props: { headerCategory } }">
                        <h4 class="table-name">
                          {{ $t('table.categories') }}
                        </h4>
                      </template>
                      <template v-slot:item.added_by_name="{ item }">
                        <span v-if="item.added_by > 1">{{ item.added_by_first_name }} {{ item.added_by_last_name }}</span>
                        <span v-if="item.added_by === 1">System</span>
                      </template>
                      <template v-slot:no-data>
                        {{ $t('table.no_data') }}
                      </template>
                    </v-data-table>
                  </v-container>
                </b-tab>
              </keep-alive>

              <keep-alive>
                <b-tab :title="$t('subTab.instructions')" :active="this.$route.query.subType === '2'">
                  <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyCategoryInstruction" />
                  <v-container>
                    <v-data-table :headers="headerCategory" :items="filteredCategoryItems" class="elevation-1 hse-table"
                                  :items-per-page="15"
                                  :single-expand="true" :search="search" :sort-desc="[true]"
                                  @click:row="editCategoryItem"
                    >
                      <template v-slot:top>
                        <div class="setting-header">
                          <div class="panel-heading">
                            <h4 class="panel-title">
                              {{ $t('title.sort_by') }}
                            </h4>
                            <b-row>
                              <b-col cols="6">
                                <div class="field-selection field-search">
                                  <v-text-field
                                    v-model="search"
                                    append-icon="search"
                                    :label="$t('setting.search')"
                                    outlined
                                  >
                    <template v-slot:append>
                      <img src="@/assets/images/icon/magnifier.png" class="search-icon-cust">
                    </template>
                  </v-text-field> 
                                </div>
                              </b-col>
                            </b-row>
                          </div>
                          <div class="panel-footer text-right">
                            <!--                  <a type="button" class="btn btn-default" @click="addNewGoal"> New goal</a>-->
                          </div>
                        </div>
                      </template>

                      <template v-slot:header="{ props: { headerCategory } }">
                        <h4 class="table-name">
                          {{ $t('table.categories') }}
                        </h4>
                      </template>
                      <template v-slot:item.added_by_name="{ item }">
                        <span v-if="item.added_by > 1">{{ item.added_by_first_name }} {{ item.added_by_last_name }}</span>
                        <span v-if="item.added_by === 1">System</span>
                      </template>
                      <template v-slot:no-data>
                        {{ $t('table.no_data') }}
                      </template>
                    </v-data-table>
                  </v-container>
                </b-tab>
              </keep-alive>

              <keep-alive>
                <b-tab :title="$t('subTab.documents')" :active="this.$route.query.subType === '3'">
                  <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyCategoryDocument" />
                  <v-container>
                    <v-data-table :headers="headerCategory" :items="filteredCategoryItems" class="elevation-1 hse-table"
                                  :items-per-page="15"
                                  :single-expand="true" :search="search" :sort-desc="[true]"
                                  @click:row="editCategoryItem"
                    >
                      <template v-slot:top>
                        <div class="setting-header">
                          <div class="panel-heading">
                            <h4 class="panel-title">
                              {{ $t('title.sort_by') }}
                            </h4>
                            <b-row>
                              <b-col cols="6">
                                <div class="field-selection field-search">
                                  <v-text-field
                                    v-model="search"
                                    append-icon="search"
                                    :label="$t('setting.search')"
                                    outlined
                                  >
                    <template v-slot:append>
                      <img src="@/assets/images/icon/magnifier.png" class="search-icon-cust">
                    </template>
                  </v-text-field> 
                                </div>
                              </b-col>
                            </b-row>
                          </div>
                          <div class="panel-footer text-right">
                            <!--                  <a type="button" class="btn btn-default" @click="addNewGoal"> New goal</a>-->
                          </div>
                        </div>
                      </template>

                      <template v-slot:header="{ props: { headerCategory } }">
                        <h4 class="table-name">
                          {{ $t('table.categories') }}
                        </h4>
                      </template>
                      <template v-slot:item.added_by_name="{ item }">
                        <span v-if="item.added_by > 1">{{ item.added_by_first_name }} {{ item.added_by_last_name }}</span>
                        <span v-if="item.added_by === 1">System</span>
                      </template>
                      <template v-slot:no-data>
                        {{ $t('table.no_data') }}
                      </template>
                    </v-data-table>
                  </v-container>
                </b-tab>
              </keep-alive>

              <keep-alive>
                <b-tab :title="$t('subTab.contacts')" :active="this.$route.query.subType === '4'">
                  <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyCategoryContact" />
                  <v-container>
                    <v-data-table :headers="headerCategory" :items="filteredCategoryItems" class="elevation-1 hse-table"
                                  :items-per-page="15"
                                  :single-expand="true" :search="search" :sort-desc="[true]"
                                  @click:row="editCategoryItem"
                    >
                      <template v-slot:top>
                        <div class="setting-header">
                          <div class="panel-heading">
                            <h4 class="panel-title">
                              {{ $t('title.sort_by') }}
                            </h4>
                            <b-row>
                              <b-col cols="6">
                                <div class="field-selection field-search">
                                  <v-text-field
                                    v-model="search"
                                    append-icon="search"
                                    :label="$t('setting.search')"
                                    outlined
                                  >
                    <template v-slot:append>
                      <img src="@/assets/images/icon/magnifier.png" class="search-icon-cust">
                    </template>
                  </v-text-field> 
                                </div>
                              </b-col>
                            </b-row>
                          </div>
                          <div class="panel-footer text-right">
                            <!--                  <a type="button" class="btn btn-default" @click="addNewGoal"> New goal</a>-->
                          </div>
                        </div>
                      </template>

                      <template v-slot:header="{ props: { headerCategory } }">
                        <h4 class="table-name">
                          {{ $t('table.categories') }}
                        </h4>
                      </template>
                      <template v-slot:item.added_by_name="{ item }">
                        <span v-if="item.added_by > 1">{{ item.added_by_first_name }} {{ item.added_by_last_name }}</span>
                        <span v-if="item.added_by === 1">System</span>
                      </template>
                      <template v-slot:no-data>
                        {{ $t('table.no_data') }}
                      </template>
                    </v-data-table>
                  </v-container>
                </b-tab>
              </keep-alive>

              <keep-alive>
                <b-tab :title="$t('subTab.attachments')" :active="this.$route.query.subType === '5'">
                  <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyCategoryAttachment" />
                  <v-container>
                    <v-data-table :headers="addedFromHeaders" :items="filteredAddedFromItems"
                                  class="elevation-1 hse-table" :items-per-page="15"
                                  :single-expand="true" :search="search" :sort-desc="[true]"
                                  @click:row="editCategoryItem"
                    >
                      <template v-slot:item.added_from="{ item }">
                        {{ formatAddedFromAttachment(item.added_from) }}
                      </template>
                      <template v-slot:top>
                        <div class="setting-header">
                          <div class="panel-heading">
                            <h4 class="panel-title">
                              {{ $t('title.sort_by') }}
                            </h4>
                            <b-row>
                              <b-col cols="6">
                                <div class="field-selection">
                                  <v-select
                                    v-model="tab_categories_added_from"
                                    item-text="name"
                                    item-value="id"
                                    :items="attachmentAddedFromArray"
                                    label="From"
                                    outlined
                                  />
                                </div>
                              </b-col>
                              <b-col cols="6">
                                <div class="field-selection field-search">
                                  <v-text-field
                                    v-model="search"
                                    append-icon="search"
                                    :label="$t('setting.search')"
                                    outlined
                                  >
                    <template v-slot:append>
                      <img src="@/assets/images/icon/magnifier.png" class="search-icon-cust">
                    </template>
                  </v-text-field> 
                                </div>
                              </b-col>
                            </b-row>
                          </div>
                          <div class="panel-footer text-right">
                            <!--                  <a type="button" class="btn btn-default" @click="addNewGoal"> New goal</a>-->
                          </div>
                        </div>
                      </template>

                      <template v-slot:header="{ props: { headerCategory } }">
                        <h4 class="table-name">
                          {{ $t('table.categories') }}
                        </h4>
                      </template>
                      <template v-slot:item.added_by_name="{ item }">
                        <span v-if="item.added_by > 1">{{ item.added_by_first_name }} {{ item.added_by_last_name }}</span>
                        <span v-if="item.added_by === 1">System</span>
                      </template>
                      <template v-slot:no-data>
                        {{ $t('table.no_data') }}
                      </template>
                    </v-data-table>
                  </v-container>
                </b-tab>
              </keep-alive>

              <keep-alive>
                <b-tab :title="$t('subTab.checklists')" :active="this.$route.query.subType === '6'">
                  <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyCategoryChecklist" />
                  <v-container>
                    <v-data-table :headers="headerCategory" :items="filteredCategoryItems" class="elevation-1 hse-table"
                                  :items-per-page="15"
                                  :single-expand="true" :search="search" :sort-desc="[true]"
                                  @click:row="editCategoryItem"
                    >
                      <template v-slot:top>
                        <div class="setting-header">
                          <div class="panel-heading">
                            <h4 class="panel-title">
                              {{ $t('title.sort_by') }}
                            </h4>
                            <b-row>
                              <b-col cols="6">
                                <div class="field-selection field-search">
                                  <v-text-field
                                    v-model="search"
                                    append-icon="search"
                                    :label="$t('setting.search')"
                                    outlined
                                  >
                    <template v-slot:append>
                      <img src="@/assets/images/icon/magnifier.png" class="search-icon-cust">
                    </template>
                  </v-text-field> 
                                </div>
                              </b-col>
                            </b-row>
                          </div>
                          <div class="panel-footer text-right">
                            <!--                  <a type="button" class="btn btn-default" @click="addNewGoal"> New goal</a>-->
                          </div>
                        </div>
                      </template>

                      <template v-slot:header="{ props: { headerCategory } }">
                        <h4 class="table-name">
                          {{ $t('table.categories') }}
                        </h4>
                      </template>
                      <template v-slot:item.added_by_name="{ item }">
                        <span v-if="item.added_by > 1">{{ item.added_by_first_name }} {{ item.added_by_last_name }}</span>
                        <span v-if="item.added_by === 1">System</span>
                      </template>
                      <template v-slot:no-data>
                        {{ $t('table.no_data') }}
                      </template>
                    </v-data-table>
                  </v-container>
                </b-tab>
              </keep-alive>
            </b-tabs>
          </v-container>
        </b-tab>
      </keep-alive>
      <keep-alive v-if="checkAdmin || permissionsUser.indexOf('department-basic') !== -1">
        <b-tab :title="$t('tab.departments')" name="department-tab" class="hse-tab-item">
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyDepartment" />
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-btn
                  v-if="checkAdmin || permissionsUser.indexOf('department-basic') !== -1"
                  class="mb-2 btn-create d-block ml-auto btn-custom-green"
                  @click="checkAddNewDepartment = true"
                >
                  {{ $t('button.add_new') }}
                </v-btn>
                <DepartmentPopup
                  :open-popup="checkAddNewDepartment"
                  :list-array-input="departmentsValidArray"
                  @closePopup="checkAddNewDepartment = !checkAddNewDepartment"
                  @reloadList="reloadList"
                />
                <DepartmentTable
                  :list-array-input="departmentsArray"
                  :list-valid-array-input="departmentsValidArray"
                  @reloadList="reloadList"
                />
              </v-col>
            </v-row>
          </v-container>
        </b-tab>
      </keep-alive>
      <keep-alive v-if="checkAdmin || permissionsUser.indexOf('job title-detail') !== -1">
        <b-tab :title="$t('tab.job_titles')" :active="this.$route.query.type === 'jobTitle'" name="job-title-tab" class="hse-tab-item">
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyJobTitle" />
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-btn class="mb-2 btn-create d-block ml-auto btn-custom-green" @click="checkAddNewJobTitle = true">
                  {{ $t('button.add_new') }}
                </v-btn>
                <JobTitleTable
                  :roles-array="rolesArray"
                  :roles-selection="rolesSelection"
                  :departments-array="departmentsValidArray"
                  :list-array-input="jobTitleArray"
                  @reloadList="reloadJobTitleList"
                />
              </v-col>
            </v-row>
          </v-container>
        </b-tab>
      </keep-alive>
      <keep-alive v-if="checkAdmin || permissionsUser.indexOf('user permission-view') !== -1">
        <b-tab :title="$t('tab.user_permissions')" name="user-permissions-tab" class="hse-tab-item">
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyUserPermission" />
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-data-table
                  :headers="headersEmployee"
                  :items="filteredEmployeeItems"
                  class="elevation-1 hse-table"
                  :items-per-page="15"
                  :single-expand="true"
                  :search="searchEmployee"
                  :sort-desc="[true]"
                  @click:row="editPermissionItem"
                >
                  <template v-slot:top>
                    <div class="setting-header">
                      <div class="panel-heading">
                        <h4 class="panel-title">
                          {{ $t('title.sort_by') }}
                        </h4>
                        <b-row>
                          <b-col cols="6">
                            <div class="field-selection">
                              <v-select
                                v-model="role"
                                :label="$t('setting.role')"
                                item-value="id"
                                :items="rolesSelection"
                                outlined
                              >
                                <template slot="selection" slot-scope="data">
                                  {{ data.item.name }}
                                </template>
                                <template slot="item" slot-scope="data">
                                  {{ data.item.name }}
                                </template>
                              </v-select>
                            </div>
                          </b-col>
                          <b-col cols="6">
                            <div class="field-selection field-search">
                              <v-text-field
                                v-model="searchEmployee"
                                append-icon="search"
                                :label="$t('setting.search')"
                                outlined
                              >
                    <template v-slot:append>
                      <img src="@/assets/images/icon/magnifier.png" class="search-icon-cust">
                    </template>
                  </v-text-field> 
                            </div>
                          </b-col>
                        </b-row>
                      </div>
                    </div>
                  </template>
                  <template v-slot:header="{ props: { headers } }">
                    <h4 class="table-name">
                      {{ $t('table.employees') }}
                    </h4>
                  </template>
                  <template v-slot:item.name="{ item }">
                    {{ item.first_name + ' ' + item.last_name }}
                  </template>
                  <template v-slot:no-data>
                    {{ $t('table.no_data') }}
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-container>
        </b-tab>
      </keep-alive>
    </b-tabs>

    <!-- dialog Business Info - Company Info -->
    <CompanyPopup
      :open-popup="checkOpen"
      :company-item="companyInfo"
      @closePopup="checkOpen = !checkOpen"
      @reloadCompany="reloadCompany"
    />

    <!-- dialog Business Info - CONTACT Company Info -->
    <CompanyPopup
      :open-contact-info-popup="checkContactInfoOpen"
      :company-item="companyInfo"
      @closePopup="checkContactInfoOpen = !checkContactInfoOpen"
      @reloadCompany="reloadCompany"
    />

    <!-- dialog Business Info - Overview Info -->
    <CompanyPopup
      :open-overview-info-popup="checkOverviewInfoOpen"
      :company-item="companyInfo"
      :list-employee-array="employeesArray"
      @closePopup="checkOverviewInfoOpen = !checkOverviewInfoOpen"
      @reloadCompany="reloadCompany"
    />

    <AttachmentPopup
      :open-attachment-popup="checkAttachmentOpen"
      :attachment-item="companyInfo"
      :type="'attachment'"
      :added-from="document_added_from"
      :is-logo="true"
      @closePopup="checkAttachmentOpen = !checkAttachmentOpen"
      @reloadCompany="reloadCompany"
      @reloadList="reloadList"
    />

    <JobTitlePopup
      :open-popup="checkAddNewJobTitle"
      :roles-array="rolesArray"
      :departments-array="departmentsValidArray"
      @closePopup="checkAddNewJobTitle = !checkAddNewJobTitle"
      @reloadList="reloadJobTitleList"
    />

    <!-- dialog Categories - Add new category -->
    <v-dialog v-model="dialogCategory" max-width="500px" persistent>
      <v-card>
        <v-card-text>
          <div class="title-model">
            {{ formCategoryTitle }}
          </div>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <b-row align-h="center">
              <b-col cols="12">
                <div class="input-wrap">
                  <v-text-field v-model="editedCategoryItem.name"
                                :disabled="editedCategoryIndex > -1 && editedCategoryItem.added_by === 1" :label="$t('form.name')"
                                :rules="required" outlined
                  />
                </div>
              </b-col>
            </b-row>
            <b-row v-if="tab_categories_type === 4">
              <b-col cols="12">
                <div class="input-wrap">
                  <v-select
                    v-model="editedCategoryItem.added_from"
                    :items="attachmentSelectAddedFromArray"
                    item-text="name"
                    item-value="id"
                    label="From"
                    :rules="required"
                    :disabled="editedCategoryIndex > -1 && editedCategoryItem.added_by === 1"
                    outlined
                  />
                </div>
              </b-col>
            </b-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-alert
            v-if="editedCategoryIndex > -1 && editedCategoryItem.disable_status"
            dense
            outlined
            type="warning"
            class="mb-0 mr-3"
          >
            This category has been disabled
          </v-alert>
          <v-btn class="btn-cancel" text @click="close">
            {{ $t('button.cancel') }}
          </v-btn>
          <v-btn
            v-if="editedCategoryItem.added_by > 1 && (checkAdmin || permissionsUser.indexOf('category-basic') > -1) && (editedCategoryIndex === -1 || (editedCategoryIndex > -1 && !editedCategoryItem.disable_status))"
            class="btn-save"
            @click="saveCategory"
          >
            {{ $t('button.save') }}
          </v-btn>
          <v-btn
            v-if="editedCategoryItem.added_by > 1 && (checkAdmin || permissionsUser.indexOf('category-basic') > -1) && (editedCategoryIndex > -1 && !editedCategoryItem.disable_status)"
            class="hse-btn-delete"
            text
            @click="deleteCategory"
          >
            <v-icon dark>
              mdi-delete
            </v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--    dialog confirm root-->
    <!--    <v-dialog v-model="dialogConfirmRoot" max-width="500px">-->
    <!--      <v-card class="dialog-delete">-->
    <!--        <v-card-text>-->
    <!--          <div class="text-center confirm-delete-title">-->
    <!--            Confirm modal-->
    <!--          </div>-->
    <!--          <div class="confirm-delete-text">-->
    <!--            <p>Do you want to set this department as executive director?</p>-->
    <!--          </div>-->
    <!--        </v-card-text>-->
    <!--        <v-card-actions>-->
    <!--          <v-spacer />-->
    <!--          <v-btn class="btn-cancel" text @click="applyDialogConfirmRoot">-->
    <!--            Yes-->
    <!--          </v-btn>-->

    <!--          <v-btn class="btn-cancel" text @click="closeDialogConfirmRoot">-->
    <!--            No-->
    <!--          </v-btn>-->
    <!--        </v-card-actions>-->
    <!--      </v-card>-->
    <!--    </v-dialog>-->

    <!-- dialog Statement -->
    <v-dialog v-model="dialogStatement" max-width="1300px" persistent>
      <v-card>
        <v-card-text>
          <div class="title-model">
            {{ formStatementTitle }}
          </div>
          <v-form
            ref="form"
            v-model="validRole"
            lazy-validation
          >
            <b-row align-h="center">
              <b-col cols="12">
                <div class="input-wrap">
                  <v-text-field v-model="editedStatementItem.title" :label="$t('form.title')" :rules="required" outlined />
                </div>
              </b-col>
            </b-row>
            <b-row align-h="center">
              <b-col cols="12">
                <!--                <froala :tag="'textarea'" :config="config" v-model="editedStatementItem.description">Init text</froala>-->
                <div class="input-wrap">
                  <froala
                    id="link-editor"
                    v-model="editedStatementItem.description"
                    :tag="'textarea'"
                    :config="config"
                  />
                </div>
              </b-col>
            </b-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="btn-cancel" text @click="close">
            {{ $t('button.cancel') }}
          </v-btn>
          <v-btn
            v-if="checkAdmin || permissionsUser.indexOf('statement-basic') > -1"
            class="hse-btn-save"
            @click="convertStatementDescription"
          >
            Preview
          </v-btn>
          <v-btn
            v-if="(checkAdmin || permissionsUser.indexOf('statement-basic') > -1) && (editedStatementIndex === -1 || (editedStatementIndex > -1 && !editedStatementItem.disable_status))"
            class="btn-save"
            @click="saveStatement">
            {{ $t('button.save') }}
          </v-btn>
          <v-btn
            v-if="(checkAdmin || permissionsUser.indexOf('statement-basic') > -1) && (editedStatementIndex > -1 && !editedStatementItem.disable_status)"
            class="hse-btn-delete"
            text
            @click="deleteStatement">
            <v-icon dark>
              mdi-delete
            </v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogPermission" max-width="1300px" persistent>
      <v-card>
        <v-card-text>
          <div class="title-model">
            {{ formPermissionTitle }}
          </div>
          <v-form
            ref="form"
            v-model="validPermission"
            lazy-validation
          >
            <b-row align-h="center">
              <b-col cols="6">
                <div class="input-wrap">
                  <v-text-field v-model="editedPermissionItem.name" :label="$t('form.name')" :rules="required" disabled outlined />
                </div>
              </b-col>
              <b-col v-if="checkCompanyAdmin" cols="6">
                <div class="input-wrap">
                  <v-text-field v-model="editedPermissionItem.role_name" :label="$t('form.role')" :rules="required" disabled outlined />
                </div>
              </b-col>
              <b-col v-else cols="6">
                <div class="input-wrap">
                  <v-text-field v-model="editedPermissionItem.job_title_name" :label="$t('form.job_title')" :rules="required" disabled outlined />
                </div>
              </b-col>
            </b-row>
            <b-row v-if="checkCompanyAdmin">
              <b-col>
                <div class="text-noti text-important text-red">
                  *By default, the company administrator has all rights to their company
                </div>
              </b-col>
            </b-row>
            <b-row v-else>
              <b-col cols="6" class="mb-7">
                <div class="input-wrap question-mark-block d-flex">
                  <v-checkbox
                    v-model="editedPermissionItem.is_super"
                    :label="$t('form.is_this_super_user')"
                    class="margin-right-sm mt-0"
                    :hide-details="true"
                  />
                  <v-badge
                    :value="hoverQuestionMark"
                    right
                    transition="slide-x-transition"
                    class="hse--icon-question-circle"
                    content="Add extended permissions"
                  >
                    <v-hover v-model="hoverQuestionMark">
                      <i class="fa fa-question-circle"></i>
                    </v-hover>
                  </v-badge>
                </div>
              </b-col>
              <b-col cols="12">
                <PermissionTable
                  :permissions-data-input="permissionsData"
                  :role-name-input="editedPermissionItem.role_name"
                  @getPermissionsArray="getPermissionsArray"
                />
              </b-col>
            </b-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn v-if="!checkAdmin" class="btn-cancel" text @click="close">
            Close
          </v-btn>
          <v-btn v-else class="btn-cancel" text @click="close">
            {{ $t('button.cancel') }}
          </v-btn>
          <v-btn v-if="checkAdmin" class="btn-save" @click="savePermission">
            {{ $t('button.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card class="dialog-delete">
        <v-card-text>
          <div class="text-center confirm-delete-title">
            Confirm delete
          </div>
          <div class="confirm-delete-text">
            <span v-if="deleteType === 'statement'">
              Are you sure you want to delete this item?
            </span>
            <span v-else>
              Are you sure you want to disable this item?
            </span>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="btn-cancel" text @click="closeDelete">
            {{ $t('button.no') }}
          </v-btn>
          <v-btn class="btn-save" @click="deleteItem">
            {{ $t('button.yes') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
  import {_} from 'vue-underscore';
  import cookies from 'js-cookie';
  import axios from "axios";
  import TitleCaption from "../../../components/TitleCaption";
  import FroalaEditor from 'froala-editor';
  import PermissionTable from "../../../components/PermissionTable";
  import DepartmentPopup from "../../../components/DepartmentPopup";
  import DepartmentTable from "../../../components/DepartmentTable";
  import CompanyPopup from "../../../components/CompanyPopup";
  import DocumentPopup from "../../../components/DocumentPopup";
  import DocumentTable from "../../../components/DocumentTable";
  import AttachmentPopup from "../../../components/AttachmentPopup";
  import {DropkiqUI} from "dropkiq-ui";
  import JobTitlePopup from "../../../components/JobTitlePopup";
  import JobTitleTable from "../../../components/JobTitleTable";

  export default {
    components: {
      TitleCaption,
      PermissionTable,
      DepartmentPopup,
      DepartmentTable,
      CompanyPopup,
      DocumentPopup,
      DocumentTable,
      AttachmentPopup,
      JobTitlePopup,
      JobTitleTable,
    },

    data: () => ({
      userRoleId: parseInt(cookies.get('roleID')),
      userDepartmentID: parseInt(cookies.get('userDepartmentID')),
      checkAdmin: cookies.get('checkAdmin'),
      roleUser: cookies.get('roleUser'),
      pageKeyOverview: 'company-company-overview',
      pageKeyHSEstatement: 'company-company-hse-statement',
      pageKeyCategory: 'company-company-categories',
      pageKeyCategoryRoutine: 'company-company-categories-routines',
      pageKeyCategoryInstruction: 'company-company-categories-instructions',
      pageKeyCategoryDocument: 'company-company-categories-documents',
      pageKeyCategoryContact: 'company-company-categories-contacts',
      pageKeyCategoryAttachment: 'company-company-categories-attachments',
      pageKeyCategoryChecklist: 'company-company-categories-checklists',
      pageKeyDepartment: 'company-company-departments',
      pageKeyJobTitle: 'company-company-job-titles',
      pageKeyUserPermission: 'company-company-user-permissions',
      permissionsUser: localStorage.getItem('permissionsKey'),
      search: '',
      dialog: false,
      // selectedFile: [],
      valid: true,
      company_id: '',
      companyInfo: {},
      headers: [
        {text: 'Name', align: 'left', value: 'name'},
        {text: 'Type', align: 'center', value: 'type_of_attachment'},
        {text: 'Category', align: 'center', value: 'category_name'},
        {text: 'Added By', align: 'center', value: 'added_by_name'},
      ],
      documents: [],
      required: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else return true;
        }
      ],
      dialogDelete: false,
      dialogLogo: false,
      previewUrl: null,
      tabIndex: 0,
      menu: false,
      document_type: 'attachment',
      document_added_from: 2, // document_added_from: 2. company
      category_type: 5, // attachment
      category_added_from: 1, // category type: "attachment" & added_from: "company"

      // tab CATEGORIES
      dialogCategory: false,
      categoryTypeArray: [
        {name: 'Routine', id: 1},
        {name: 'Instruction', id: 2},
        {name: 'Document', id: 3},
        {name: 'Contact', id: 4},
        {name: 'Attachment', id: 5},
        {name: 'Checklist', id: 6}
      ],
      attachmentAddedFromArray: [
        {name: "All", id: 0},
        {name: 'Company', id: 1},
        {name: 'Contact', id: 2},
        {name: 'Employee', id: 3},
      ],
      attachmentSelectAddedFromArray: [
        {name: 'Company', id: 1},
        {name: 'Contact', id: 2},
        {name: 'Employee', id: 3},
      ],
      tab_categories_type: 1, // tab Categories - Category type
      tab_categories_added_from: 0, // tab Categories - Category added from
      listArray: [],
      editedCategoryIndex: -1,
      editedCategoryItem: {
        name: "",
        type: "",
        added_from: "",
        added_by: "",
        disable_status: "",
      },
      defaultCategoryItem: {
        name: "",
        type: "",
        added_from: "",
        added_by: "",
        disable_status: "",
      },

      //department tab
      departmentsArray: [],
      departmentsValidArray: [],
      checkAddNewDepartment: false,
      users: [],

      //permissions tab
      employeesArray: [],
      listEmployeeWithoutAdmin: [],
      searchEmployee: '',
      dialogPermission: false,
      validPermission: true,
      editedPermissionItem: {
        user_name: '',
        job_title_name: '',
        job_title_id: '',
        role_name: '',
        permission: '',
        is_super: '',
      },
      editedPermissionDefaultItem: {
        user_name: '',
        job_title_name: '',
        job_title_id: '',
        role_name: '',
        permission: '',
        is_super: '',
      },
      rolesArray: [], // list roles (all roles)
      levelArray: [],
      role: 0,
      rolesSelection: [],
      dataRoleDefault: {
        id: 0,
        name: "All",
      },
      user_permissions: [],
      permissions: [],
      // valid_permissionsName: [
      //   'Company',
      //   'Category',
      //   'Goal',
      //   'Routine',
      //   'Contact',
      //   'Department',
      //   'Employee',
      //   'Absence',
      //   'AbsenceReason',
      //   'Project',
      //   'Document',
      //   'Instruction',
      //   'Deviation',
      //   'Checklist',
      //   'Task',
      //   'Report',
      //   'RiskAnalysis',
      //   'RiskElementSource',
      //   'Role',
      //   'Permission',
      // ],
      // dialogRole: false,
      // editedRoleIndex: -1,
      // editedRoleItem: {
      //   name: '',
      //   description: '',
      // },
      // defaultRoleItem: {
      //   name: '',
      //   description: '',
      // },
      validRole: true,
      // rolePermissionItem: {
      //   name: '',
      //   index: false,
      //   show: false,
      //   store: false,
      //   update: false,
      //   destroy: false,
      // },
      // rolePermissionDefaultItem: {
      //   name: '',
      //   index: false,
      //   show: false,
      //   store: false,
      //   update: false,
      //   destroy: false,
      // },
      // rolePermission: [],
      // headersRolePermission: [
      //   {text: 'All', align: 'start', value: 'name'},
      //   {text: 'View', value: 'index', sortable: false},
      //   {text: 'Show detail', value: 'show', sortable: false},
      //   {text: 'Create', value: 'store', sortable: false},
      //   {text: 'Edit', value: 'update', sortable: false},
      //   {text: 'Delete', value: 'destroy', sortable: false},
      // ],
      // permissionsKey: [],
      // checkCreatedRole: false,
      // basicPermissionsAttach: ['index-category', 'index-project', 'index-department', 'index-employee', 'show-employee', 'store-riskanalysis',
      //   'update-task', 'store-report', 'index-riskanalysis', 'index-task', 'show-task', 'show-riskelementsource',
      //   'show-checklist', 'index-checklist', 'index-topic', 'index-report', 'show-report', 'index-riskelementsource',
      //   'index-absence', 'show-absence', 'store-absence'],
      // permissionsAttach: {
      //   'update-report': ['show-report'],
      //   'update-company': ['show-company'],
      //   'update-goal': ['index-goal', 'show-goal'],
      //   'update-instruction': ['index-instruction', 'show-instruction'],
      //   'update-contact': ['index-contact', 'show-contact'],
      //   'update-employee': ['index-employee', 'show-employee'],
      //   'index-riskanalysis': ['show-riskanalysis'],
      //   'store-absence': ['index-absencereason'],
      // },
      categoriesArray: [], // list categories without 'Logo' category
      categoriesValidArray: [], // list categories without 'Logo' category
      // categoriesSelection: [],
      // categoriesDefault: {
      //   id: 0,
      //   name: "All"
      // },
      // newCategory: false,
      // new_category_name: '',
      editedCategory: {
        name: "",
        type: 0
      },
      // checkAllView: false,
      // checkAllShow: false,
      // checkAllCreate: false,
      // checkAllEdit: false,
      // checkAllDelete: false,
      // countViewPermission: 0,
      // countShowPermission: 0,
      // countCreatePermission: 0,
      // countEditPermission: 0,
      // countDeletePermission: 0,

      // tab HSE statement
      dialogStatement: false,
      editedStatementItem: {
        title: '',
        description: '',
        disable_status: '',
      },
      defaultStatementItem: {
        title: '',
        description: '',
        disable_status: '',
      },
      searchStatement: '',
      listStatementArray: [],
      editedStatementIndex: -1,
      predefinedLinkItem: {
        text: '',
        href: '',
        target: '_blank',
        rel: 'nofollow',
        type: ''
      },
      predefinedLinkItemDefault: {
        text: '',
        href: '',
        target: '_blank',
        rel: 'nofollow',
        type: ''
      },
      predefinedLinkArray: [],
      config: {
        events: {
          //
        },
        placeholderText: 'Place your cursor in {{}} to see the autofill list.',
        charCounterCount: true,
        heightMin: 300,
        quickInsertEnabled: false,
        toolbarButtons: {
          'moreText': {
            'buttons': ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'inlineClass', 'inlineStyle', 'clearFormatting']
          },
          'moreParagraph': {
            'buttons': ['alignLeft', 'alignCenter', 'formatOLSimple', 'alignRight', 'alignJustify', 'formatOL', 'formatUL', 'paragraphFormat', 'paragraphStyle', 'lineHeight', 'outdent', 'indent', 'quote']
          },
          'moreRich': {
            'buttons': ['refer_to_dropdown_custom', 'insertLink', 'insertImage', 'insertVideo', 'insertTable', 'emoticons', 'fontAwesome', 'specialCharacters', 'embedly', 'insertFile', 'insertHR']
          },
          'moreMisc': {
            'buttons': ['undo', 'redo', 'fullscreen', 'print', 'getPDF', 'spellChecker', 'selectAll', 'html', 'help'],
            'align': 'right',
            'buttonsVisible': 2
          }
        },
        linkList: [],
      },
      projectArray: [],
      selectedItems: [],
      jobTitleArray: [],
      permissionsData: '',
      permissionsArrayOutput: [],
      checkCompanyAdmin: false,

      checkOpen: false,
      checkContactInfoOpen: false,
      checkDocumentOpen: false,
      checkAttachmentOpen: false,
      checkOverviewInfoOpen: false,
      checkAddNewJobTitle: false,
      hoverQuestionMark: false,
      deleteType: '',
      departmentsAssignArray: [],
      suggestedInfo: {
        CEO_name: "",
        HSE_manager_name: "",
        Safety_manager_name: "",
        Number_of_employees: "",
      },
      statementDescription: '',
      categoryId: '',
    }),

    watch: {
      dialogStatement(value){
        if (value) {
          // Describes your application's "Liquid Schema" (required)
          // Generate this with https://github.com/akdarrah/dropkiq-gem for Ruby on Rails
          const schema = {
            contacts: {
              methods: {
                name: {
                  type: "ColumnTypes::String",
                  foreign_table_name: null,
                  hint: "The full name of the contact person"
                },
                email: {
                  type: "ColumnTypes::String",
                  foreign_table_name: null,
                  hint: "The email address of the contact person"
                },
                age: {
                  type: "ColumnTypes::Numeric",
                  foreign_table_name: null,
                  hint: "The computed age of the contact person"
                },
                is_minor: {
                  type: "ColumnTypes::Boolean",
                  foreign_table_name: null,
                  hint: "Is true if the person is less than 18 years old"
                },
                birthdate: {
                  type: "ColumnTypes::DateTime",
                  foreign_table_name: null,
                  hint: "The birthdate of the contact person"
                },
                notes: {
                  type: "ColumnTypes::Text",
                  foreign_table_name: null,
                  hint: "Any notes that are saved in the database"
                },
                favorite_website: {
                  type: "ColumnTypes::HasOne",
                  foreign_table_name: "websites",
                  hint: "The website the person visits most often"
                },
                visited_websites: {
                  type: "ColumnTypes::HasMany",
                  foreign_table_name: "websites",
                  hint: "A list of websites the person has visited"
                }
              }
            },
            websites: {
              methods: {
                nickname: {
                  type: "ColumnTypes::String",
                  foreign_table_name: null,
                  hint: "The nickname of the website"
                },
                url: {
                  type: "ColumnTypes::String",
                  foreign_table_name: null,
                  hint: "The website HTTP URL address"
                }
              }
            }
          };

          // Describes what data the user has access to right now (required)
          const context = {
            CEO_name: {
              type: "ColumnTypes::String",
              foreign_table_name: null,
              hint: "CEO's name"
            },
            HSE_manager_name: {
              type: "ColumnTypes::String",
              foreign_table_name: null,
              hint: "HSE manager's name"
            },
            Safety_manager_name: {
              type: "ColumnTypes::String",
              foreign_table_name: null,
              hint: "Safety manager's name"
            },
            Number_of_employees: {
              type: "ColumnTypes::Numeric",
              foreign_table_name: null,
              hint: "Number of employees"
            },
            // email_subject: {
            //   type: "ColumnTypes::String",
            //   foreign_table_name: null,
            //   hint: "The subject of the email to send"
            // },
            // email_body: {
            //   type: "ColumnTypes::Text",
            //   foreign_table_name: null,
            //   hint: "The body of the email to send"
            // },
            // email_from: {
            //   type: "ColumnTypes::String",
            //   foreign_table_name: null,
            //   hint: "The email address the email will be sent from"
            // },
            // email_contact: {
            //   type: "ColumnTypes::HasOne",
            //   foreign_table_name: "contacts",
            //   hint: "The contact who will receive the email"
            // }
          };

          // Test data that is used for the preview feature (optional)
          const scope = {
            CEO_name: this.suggestedInfo.CEO_name,
            HSE_manager_name: this.suggestedInfo.HSE_manager_name,
            Safety_manager_name: this.suggestedInfo.Safety_manager_name,
            Number_of_employees: this.suggestedInfo.Number_of_employees,
            // email_subject: "Try Dropkiq Today!",
            // email_body: "Work faster with a smarter editor. Write complex Liquid statements with ease. Dropkiq Autocompletion gives your users the confidence they need to write their statements correctly the first time.",
            // email_from: "Adam Darrah <adam@dropkiq.com>",
            // email_contact: {
            //   name: "John Doe",
            //   email: "john.doe@dropkiq.com",
            //   age: 30,
            //   is_minor: false,
            //   birthdate: Date.parse("March 18, 1990"),
            //   notes: "Software developer for application that uses liquid, but users don't fully understand how to use it...",
            //   favorite_website: {
            //     nickname: "Dropkiq",
            //     url: "https://www.dropkiq.com/"
            //   },
            //   visited_websites: [
            //     {nickname: "Dropkiq Ruby Gem", url: "https://github.com/akdarrah/dropkiq-gem"},
            //     {nickname: "Dropkiq UI", url: "https://github.com/akdarrah/dropkiq-ui"}
            //   ]
            // }
          };

          // let preview = document.getElementById('preview-out');
          this.config.events = {
            initialized: function() {
              var editor = this;
              // console.log(schema);
              // Initialize the Standard DropkiqUI for demo elements
              // https://www.npmjs.com/package/dropkiq-ui
              var dropkiqUI = new DropkiqUI(editor.el, schema, context, scope, "");
              // var dropkiqUI = new DropkiqUI(editor.el, schema, context, scope, "", {
              //   onRender: function(renderedDocument){
              //     // preview.textContent = renderedDocument;
              //     this.statementDescription = renderedDocument;
              //     console.log(renderedDocument);
              //   }
              // });
              editor.events.on('keydown', function(e) {
                if (e.which == FroalaEditor.KEYCODE.ENTER && dropkiqUI.menuIsOpen()) {
                  return false;
                }
              }, true);

              setTimeout(function(){
                editor.events.focus(true);
              }, 1);
            }
          };
        }
      },

      categoriesValidArray: {
        handler: 'getCategoryObject',
        immediate: true,
      },
    },

    computed: {
      headersStatement() {
        return [
          {text: this.translateCol('title'), value: 'title', align: 'left'},
          {text: this.translateCol('added_by'), value: 'user_added', align: 'left'},
        ]
      },
      headerCategory() {
        return [
          {text: this.translateCol('name'), align: 'left', value: 'name'},
          {text: this.translateCol('added_by'), align: 'center', value: 'added_by_name'},
        ]
      },
      addedFromHeaders() {
        return [
          {text: this.translateCol('name'), align: 'left', value: 'name'},
          {text: this.translateCol('from'), align: 'left', value: 'added_from'},
          {text: this.translateCol('added_by'), align: 'center', value: 'added_by_name'},
        ]
      },
      headersEmployee() {
        return [
          {text: this.translateCol('name'), value: 'name', align: 'left'},
          {text: this.translateCol('department'), value: 'department_name', align: 'left'},
          {text: this.translateCol('role'), value: 'role_name', align: 'left'},
          {text: this.translateCol('job_title'), value: 'job_title_name', align: 'left'},
        ]
      },

      // tab Categories
      formCategoryTitle() {
        return this.editedCategoryIndex === -1 ? 'New Category' : 'Edit Category';
      },
      filteredCategoryItems() {
        let that = this;
        return that.categoriesValidArray.filter((item) => {
          return (item.type === that.tab_categories_type + 1);
        });
      },
      filteredAddedFromItems() {
        let that = this;
        return that.categoriesValidArray.filter((item) => {
          return ((that.tab_categories_added_from === 0 || (item.added_from === that.tab_categories_added_from))
            && (item.type === that.tab_categories_type + 1));
        });
      },

      filteredStatementItems() {
        let that = this;
        return that.listStatementArray;
      },

      formStatementTitle() {
        return this.editedStatementIndex === -1 ? 'New Statement' : 'Edit Statement';
      },

      filteredEmployeeItems() {
        let that = this;
        return that.employeesArray.filter((i) => {
          return (that.role === 0 || (i.role_id === that.role));
        });
      },

      formPermissionTitle() {
        return 'Update permission';
      },
    },

    mounted() {
      let that = this;
      that.categoryId = that.$route.query.id;

      // list employees
      that.$store.dispatch('employees/index').then(result => {
        that.employeesArray = _.each(result.data, function(i) {
          if (i.department_name) {
            i.name = i.name + ' - ' + i.department_name;
          }
        });
        // that.employeesArray = result.data;
        that.suggestedInfo.Number_of_employees = that.employeesArray.length;
      }).catch((error) => {
        that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });

      that.$nextTick(() => {
        that.$nuxt.$loading.start();
        // get company_id
        that.$store.dispatch('authenticate/profile').then(user => {
          that.company_id = user.data.company_id;
          //Get current companies
          that.$store.dispatch('companies/show', that.company_id).then(result => {
            that.companyInfo = result.data;
            if (that.companyInfo.ceo) {
              that.suggestedInfo.CEO_name = that.companyInfo.ceoName;
            }
            if (that.companyInfo.hse_manager) {
              that.suggestedInfo.HSE_manager_name = that.companyInfo.hseManagerName;
            }
            if (that.companyInfo.safety_manager) {
              that.suggestedInfo.Safety_manager_name = that.companyInfo.safetyManagerName;
            }
            that.getImageSrc(that.companyInfo.logo);
            that.$nuxt.$loading.finish();
          }).catch((error) => {
            that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish();
          });
        }).catch((error) => {
          that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      });

      //Get document list
      that.$store.dispatch('documents/index', {
        type: that.document_type,
        added_from: that.document_added_from
      }).then(result => {
        that.documents = result.data;
        if (that.documents.length > 0) {
          _.each(that.documents, function (item) {
            if (item.description) {
              item.description = item.description.replace(/<[^>]+>/g, '');
            }
          });
        }
      }).catch((error) => {
        that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });

      // that.$store.dispatch('goals/index').then(result => {
      //   _.each(result.data, function (item) {
      //     that.predefinedLinkItem.text = item.name;
      //     that.predefinedLinkItem.type = 'goal';
      //     that.predefinedLinkItem = _.clone(that.predefinedLinkItemDefault);
      //
      //     that.predefinedLinkArray.push(that.predefinedLinkItem);
      //
      //     // that.config.linkList = _.filter(that.predefinedLinkArray, function (item) {
      //     //   return item.type === 'goal';
      //     // });
      //   });

        // FroalaEditor.DefineIcon('refer_to_dropdown_custom', {NAME: 'cog', SVG_KEY: 'cogs'});
        // FroalaEditor.RegisterCommand('refer_to_dropdown_custom', {
        //   title: 'Advanced options',
        //   type: 'dropdown',
        //   focus: false,
        //   undo: false,
        //   refreshAfterCallback: false,
        //   options: {
        //     'goal': 'Goal',
        //     'routine': 'Routine'
        //   },
        //   callback: function (cmd, val) {
        //     // console.log(val);
        //     that.config.linkList = _.filter(that.predefinedLinkArray, function (item) {
        //       return item.type === val;
        //     });
        //     this.refresh();
        //
        //     // console.log (that.config.linkList);
        //     this.link.showInsertPopup();
        //   },
        //   // Callback on refresh.
        //   refresh: function (FroalaEditor) {
        //     console.log(FroalaEditor);
        //     console.log('do refresh');
        //   }
        // });
      // }).catch((error) => {
      //   that.$toaster.error(error.message || error.status);
      // });

      //Get Attachment Company categories list
      that.$store.dispatch('categories/index', {
        type: that.category_type,
        added_from: that.category_added_from
      }).then(result => {
        that.categoriesArray = _.filter(result.data, function (item) {
          return item.name !== "Logo";
        });
      }).catch((error) => {
        that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });

      // tab Categories list categories
      that.$store.dispatch('categories/index').then(result => {
        // that.categoriesValidArray = result.data;
        // that.categoriesValidArray = _.clone(that.listArray);
        if (result.data) {
          that.categoriesValidArray = _.filter(result.data, function (item) {
            return !item.disable_status;
          });
        }
      }).catch((error) => {
        that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });

      that.$store.dispatch('categories/index', {
        type: that.category_type,
        added_from: that.category_added_from
      }).then(result => {
        that.categoriesArray = _.filter(result.data, function (item) {
          return item.name !== "Logo";
        });
      }).catch((error) => {
        that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });

      // list department
      that.$store.dispatch('departments/index').then(result => {
        that.departmentsArray = result.data;
        that.departmentsValidArray = _.clone(that.departmentsArray);
        that.departmentsValidArray = _.filter(that.departmentsValidArray, function (item) {
          return item.disable_status === 0;
        });
        // that.listAvailDepartment = result.data;
        // if (_.find(that.departmentsArray, function (department) {
        //   return department.parent_id === null;
        // })) {
        //   that.check_exist_root_department = true;
        // }
      }).catch((error) => {
        that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });

      // list roles
      that.$store.dispatch('roles/index').then(result => {
        that.rolesArray = result.data;
        that.rolesSelection = _.clone(result.data);
        that.rolesSelection.push(that.dataRoleDefault);
        that.rolesSelection.sort(function (a, b) {
          return (a.id - b.id);
        });
      }).catch((error) => {
        that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });

      // list statement
      that.$store.dispatch('statements/index').then(result => {
        that.listStatementArray = result.data;
      }).catch((error) => {
        that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });

      // list project
      that.$store.dispatch('projects/index').then(result => {
        that.projectArray = result.data;
      }).catch((error) => {
        that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });

      // list job titles
      that.$store.dispatch('jobTitles/index').then(result => {
        that.jobTitleArray = result.data;
      }).catch((error) => {
        that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });
    },

    methods: {
      translateCol (colName) {
        return this.$i18n.t('column.' + colName);
      },

      getCategoryObject() {
        let that = this;
        if (that.categoryId) {
          _.each(that.categoriesValidArray, function (item) {
            if (item.id === parseInt(that.categoryId)) {
              that.editCategoryItem(item);
            }
          });
        }
      },

      editPermissionItem(item) {
        let that = this;
        that.checkCompanyAdmin = item.role_name === 'Company admin' && item.role_level === 1;
        // if (that.checkAdmin) {
        //   that.$nuxt.$loading.start();
        //   that.editedPermissionItem = Object.assign({}, item);
        //   that.dialogPermission = true;
        //   that.$nuxt.$loading.finish();
        // }
        that.$nuxt.$loading.start();
        if (that.checkCompanyAdmin) {
          that.editedPermissionItem = Object.assign({}, item);
          that.dialogPermission = true;
          that.$nuxt.$loading.finish();
        } else {
          that.$store.dispatch('userPermissions/show', item.id).then(result => {
            that.editedPermissionItem = Object.assign({}, result.data);
            that.editedPermissionItem.name = that.editedPermissionItem.first_name + ' ' + that.editedPermissionItem.last_name;
            that.editedPermissionItem.role_name = item.role_name;
            that.permissionsData = that.editedPermissionItem.permission;
            that.dialogPermission = true;
            that.$nuxt.$loading.finish();
          }).catch((error) => {
            that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish();
          });
        }
      },

      savePermission() {
        let that = this;
        if (that.$refs.form.validate()) {
          that.$nuxt.$loading.start();
          if (that.permissionsArrayOutput.length > 0) {
            that.editedPermissionItem.permission = JSON.stringify(that.permissionsArrayOutput);
          }
          that.$store.dispatch('userPermissions/update', that.editedPermissionItem).then(function () {
            that.reloadList();
          }).catch((error) => {
            that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish();
          });
          that.close();
        }
      },

      getPermissionsArray(value) {
        this.permissionsArrayOutput = value;
      },

      getSelectedItems(value) {
        this.selectedItems = value.selectedItemsOutput;
      },

      convertStatementDescription() {
        let that = this;
        that.editedStatementItem.description = that.editedStatementItem.description.replaceAll('{{CEO_name}}', that.suggestedInfo.CEO_name);
        that.editedStatementItem.description = that.editedStatementItem.description.replaceAll('{{HSE_manager_name}}', that.suggestedInfo.HSE_manager_name);
        that.editedStatementItem.description = that.editedStatementItem.description.replaceAll('{{Safety_manager_name}}', that.suggestedInfo.Safety_manager_name);
        that.editedStatementItem.description = that.editedStatementItem.description.replaceAll('{{Number_of_employees}}', that.suggestedInfo.Number_of_employees);
      },

      saveStatement() {
        let that = this;
        that.convertStatementDescription();
        if (that.$refs.form.validate()) {
          that.$nuxt.$loading.start();
          if (that.editedStatementIndex > -1) {
            that.$store.dispatch('statements/update', that.editedStatementItem).then(function () {
              that.reloadStatementList();
              that.$nuxt.$loading.finish();
            }).catch(error => {
              that.$nuxt.$loading.finish();
              if (error.response && error.response.data) {
                that.$toaster.error(error.response.data.message || error.response.data.errors);
              }
            });
          } else {
            that.$store.dispatch('statements/store', that.editedStatementItem).then(function () {
              that.reloadStatementList();
              that.$nuxt.$loading.finish();
            }).catch(error => {
              that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
              that.$nuxt.$loading.finish();
            });
          }
          that.close();
        }
      },

      editStatementItem(item) {
        this.editedStatementIndex = this.listStatementArray.indexOf(item);
        this.editedStatementItem = Object.assign({}, item);
        this.dialogStatement = true;
      },

      close() {
        this.selectedItems = [];
        if (this.dialogStatement) {
          this.dialogStatement = false;
          setTimeout(() => {
            this.editedStatementItem = Object.assign({}, this.defaultStatementItem);
            this.editedStatementIndex = -1;
          }, 300);
        } else if (this.dialogCategory) {
          this.dialogCategory = false;
          setTimeout(() => {
            this.editedCategoryItem = Object.assign({}, this.defaultCategoryItem);
            this.editedCategoryIndex = -1;
          }, 300);
        } else if (this.dialogPermission) {
          this.dialogPermission = false;
          setTimeout(() => {
            this.editedPermissionItem = Object.assign({}, this.editedPermissionDefaultItem);
          }, 300);
        }
        this.reset();
      },

      reloadList() {
        let that = this;
        // get list
        that.$store.dispatch('documents/index', {
          type: that.document_type,
          added_from: that.document_added_from
        }).then(result => {
          that.documents = result.data;
          _.each(that.documents, function (item) {
            if (item.description) {
              item.description = item.description.replace(/<[^>]+>/g, '');
            }
          });
          that.$nuxt.$loading.finish();
        }).catch((error) => {
          that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });

        that.$store.dispatch('departments/index').then(result => {
          that.departmentsArray = result.data;
          that.departmentsValidArray = _.clone(that.departmentsArray);
          that.departmentsValidArray = _.filter(that.departmentsValidArray, function (item) {
            return item.disable_status === 0;
          });
        }).catch((error) => {
          that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });

        that.$store.dispatch('roles/index').then(result => {
          that.rolesArray = result.data;
          that.rolesSelection = _.clone(result.data);
          that.rolesSelection.push(that.dataRoleDefault);
          that.rolesSelection.sort(function (a, b) {
            return (a.id - b.id);
          });
        }).catch((error) => {
          that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });

        // that.$store.dispatch('employees/index').then(result => {
        //   that.employeesArray = result.data;
        // }).catch((error) => {
        //   that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        //   that.$nuxt.$loading.finish();
        // });
      },

      reset() {
        this.permissionsArrayOutput = [];
        this.permissionsData = '';
        this.deleteType = '';
        setTimeout(() => {
          // this.editedItem = Object.assign({}, this.defaultItem);
          // this.editedIndex = -1;
          // this.$refs.form.reset();
          this.$refs.form.resetValidation();
        }, 0);
      },

      // Dialog DELETE
      closeDelete() {
        this.dialogDelete = false;
      },

      deleteCategory() {
        this.dialogDelete = true;
        this.deleteType = 'category';
      },

      deleteStatement() {
        this.dialogDelete = true;
        this.deleteType = 'statement';
      },

      deleteItem() {
        this.deleteObject();
        this.dialogDelete = false;
        this.close();
      },

      deleteObject() {
        let that = this;
        if (that.deleteType === 'category') {
          if (that.editedCategoryItem.id) {
            that.$store.dispatch('categories/delete', that.editedCategoryItem.id).then(function () {
              that.reloadCategoryList();
            }).catch((error) => {
              that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            });
          }
        } else if (that.deleteType === 'statement') {
          if (that.editedStatementItem.id) {
            that.$store.dispatch('statements/delete', that.editedStatementItem.id).then(function () {
              that.reloadStatementList();
            }).catch((error) => {
              that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            });
          }
        }
      },

      showAttachment() {
        this.checkAttachmentOpen = true;
      },

      reloadCompany() {
        let that = this;
        that.$nuxt.$loading.start();
        //Get current companies
        that.$store.dispatch('companies/show', that.company_id).then(result => {
          that.companyInfo = result.data;
          that.getImageSrc(that.companyInfo.logo);
          that.$nuxt.$loading.finish();
        }).catch((error) => {
          that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      },

      // show image
      getImageSrc(url) {
        let that = this;
        let result;
        axios({
          url: url,
          method: 'GET',
          responseType: 'blob', // important
        }).then((response) => {
          result = window.URL.createObjectURL(new Blob([response.data]));
          that.previewUrl = result;
          return result;
        });
      },

      addNew() { // tab Categories - Add new category
        this.reset();
        this.dialogCategory = true;
        this.editedCategoryItem.type = this.tab_categories_type + 1;
      },

      editCategoryItem(item) { // tab Categories - Edit category
        if (this.checkAdmin || this.permissionsUser.indexOf('category-detail') !== -1) {
          this.editedCategoryIndex = this.categoriesValidArray.indexOf(item);
          this.editedCategoryItem = Object.assign({}, item);
          this.dialogCategory = true;
        }
      },

      saveCategory() { // tab Categories - Save category
        let that = this;
        if (that.$refs.form.validate()) {
          that.$nuxt.$loading.start();
          if (that.editedCategoryIndex > -1) {
            that.$store.dispatch('categories/update', that.editedCategoryItem).then(function () {
              that.reloadCategoryList();
              that.$nuxt.$loading.finish();
            }).catch(error => {
              that.$nuxt.$loading.finish();
              if (error.response && error.response.data) {
                that.$toaster.error(error.response.data.message || error.response.data.errors);
              }
            });
          } else {
            that.$store.dispatch('categories/store', that.editedCategoryItem).then(function () {
              that.reloadCategoryList();
              that.editedCategoryItem = that.defaultCategoryItem;
              that.$nuxt.$loading.finish();
            }).catch(error => {
              that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
              that.$nuxt.$loading.finish();
            });
          }
          that.close();
        }
      },

      reloadCategoryList() { // tab Categories - Reload list category
        let that = this;
        // get list
        that.$store.dispatch('categories/index').then(result => {
          // that.categoriesValidArray = result.data;
          if (result.data) {
            that.categoriesValidArray = _.filter(result.data, function (item) {
              return !item.disable_status;
            });
          }
        }).catch((error) => {
          that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      },

      reloadJobTitleList() {
        let that = this;
        that.$store.dispatch('jobTitles/index').then(result => {
          that.jobTitleArray = result.data;
          that.$nuxt.$loading.finish();
        }).catch((error) => {
          that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      },

      reloadStatementList() {
        let that = this;
        that.$store.dispatch('statements/index').then(result => {
          that.listStatementArray = result.data;
        }).catch((error) => {
          that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      },

      formatAddedFromAttachment(added_from) {// tab Categories - Format added from attachment
        if (added_from === 1) {
          return "Company";
        } else if (added_from === 2) {
          return "Contact";
        } else if (added_from === 3) {
          return "Employee";
        }
      },

      //statement
      addNewStatement() {
        this.reset();
        this.dialogStatement = true;
      },
    }
  };
</script>

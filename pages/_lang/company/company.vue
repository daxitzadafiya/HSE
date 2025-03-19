<template>
  <div class="page-company-detail company-page">
    <b-tabs v-model="tabIndex" card lazy>
      <keep-alive>
        <b-tab :title="$t('tab.overview')" :active="!this.$route.query.type">
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
                      <div class="logo-wrapper company-logo-wrapper">
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
                      <b-row class="sm-padding-row">
                        <b-col cols="6" class="info-key text-right">{{ $t('form.timezone') }}</b-col>
                        <b-col cols="6" class="input-wrap text-left">{{companyInfo.time_zone}}</b-col>
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
                    @reloadListCategory="reloadListCategory"
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
                    @reloadListCategory="reloadListCategory"
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
        <b-tab :title="$t('tab.hse_statement')">
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
                <v-data-table
                  :headers="headersStatement"
                  :items="filteredStatementItems"
                  class="elevation-1 hse-table table-data"
                  :items-per-page="25"
                  :single-expand="true"
                  :search="searchStatement"
                  :sort-by="['created_at']"
                  :sort-desc="[true, false]"
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
                                class="text-box"
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
<!--      <keep-alive v-if="checkAdmin || permissionsUser.indexOf('category-basic') !== -1">-->
<!--        <b-tab :title="$t('tab.categories')" :active="this.$route.query.type === 'category'" name="category-tab" class="hse-tab-item">-->
<!--          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyCategory" />-->
<!--          <v-container>-->
<!--            <b-tabs v-model="tab_categories_type" card name="test" class="section-categories" lazy>-->
<!--              <v-btn class="mb-2 btn-create btn-custom-green" @click="addNew">-->
<!--                {{ $t('button.add_new') }}-->
<!--              </v-btn>-->
<!--              <keep-alive>-->
<!--                <b-tab :title="$t('subTab.routines')" :active="this.$route.query.subType === '1'" name="routine-tab" class="result-tab">-->
<!--                  <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyCategoryRoutine" />-->
<!--                  <v-container>-->
<!--                    <v-data-table :headers="headerCategory" :items="filteredCategoryItems" class="elevation-1 hse-table"-->
<!--                                  :items-per-page="15"-->
<!--                                  :single-expand="true" :search="search" :sort-desc="[true]"-->
<!--                                  @click:row="editCategoryItem"-->
<!--                    >-->
<!--                      <template v-slot:top>-->
<!--                        <div class="setting-header">-->
<!--                          <div class="panel-heading">-->
<!--                            <h4 class="panel-title">-->
<!--                              {{ $t('title.settings') }}-->
<!--                            </h4>-->
<!--                            <b-row>-->
<!--                              <b-col cols="6">-->
<!--                                <div class="field-selection field-search">-->
<!--                                  <v-text-field-->
<!--                                    v-model="search"-->
<!--                                    append-icon="search"-->
<!--                                    :label="$t('setting.search')"-->
<!--                                    outlined-->
<!--                                  />-->
<!--                                </div>-->
<!--                              </b-col>-->
<!--                            </b-row>-->
<!--                          </div>-->
<!--                          <div class="panel-footer text-right">-->
<!--                            &lt;!&ndash;                  <a type="button" class="btn btn-default" @click="addNewGoal"> New goal</a>&ndash;&gt;-->
<!--                          </div>-->
<!--                        </div>-->
<!--                      </template>-->

<!--                      <template v-slot:header="{ props: { headerCategory } }">-->
<!--                        <h4 class="table-name">-->
<!--                          {{ $t('table.categories') }}-->
<!--                        </h4>-->
<!--                      </template>-->
<!--                      <template v-slot:item.added_by_name="{ item }">-->
<!--                        <span v-if="item.added_by > 1">{{ item.added_by_first_name }} {{ item.added_by_last_name }}</span>-->
<!--                        <span v-if="item.added_by === 1">System</span>-->
<!--                      </template>-->
<!--                      <template v-slot:no-data>-->
<!--                        No data-->
<!--                      </template>-->
<!--                    </v-data-table>-->
<!--                  </v-container>-->
<!--                </b-tab>-->
<!--              </keep-alive>-->

<!--              <keep-alive>-->
<!--                <b-tab :title="$t('subTab.instructions')" :active="this.$route.query.subType === '2'">-->
<!--                  <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyCategoryInstruction" />-->
<!--                  <v-container>-->
<!--                    <v-data-table :headers="headerCategory" :items="filteredCategoryItems" class="elevation-1 hse-table"-->
<!--                                  :items-per-page="15"-->
<!--                                  :single-expand="true" :search="search" :sort-desc="[true]"-->
<!--                                  @click:row="editCategoryItem"-->
<!--                    >-->
<!--                      <template v-slot:top>-->
<!--                        <div class="setting-header">-->
<!--                          <div class="panel-heading">-->
<!--                            <h4 class="panel-title">-->
<!--                              {{ $t('title.settings') }}-->
<!--                            </h4>-->
<!--                            <b-row>-->
<!--                              <b-col cols="6">-->
<!--                                <div class="field-selection field-search">-->
<!--                                  <v-text-field-->
<!--                                    v-model="search"-->
<!--                                    append-icon="search"-->
<!--                                    :label="$t('setting.search')"-->
<!--                                    outlined-->
<!--                                  />-->
<!--                                </div>-->
<!--                              </b-col>-->
<!--                            </b-row>-->
<!--                          </div>-->
<!--                          <div class="panel-footer text-right">-->
<!--                            &lt;!&ndash;                  <a type="button" class="btn btn-default" @click="addNewGoal"> New goal</a>&ndash;&gt;-->
<!--                          </div>-->
<!--                        </div>-->
<!--                      </template>-->

<!--                      <template v-slot:header="{ props: { headerCategory } }">-->
<!--                        <h4 class="table-name">-->
<!--                          {{ $t('table.categories') }}-->
<!--                        </h4>-->
<!--                      </template>-->
<!--                      <template v-slot:item.added_by_name="{ item }">-->
<!--                        <span v-if="item.added_by > 1">{{ item.added_by_first_name }} {{ item.added_by_last_name }}</span>-->
<!--                        <span v-if="item.added_by === 1">System</span>-->
<!--                      </template>-->
<!--                      <template v-slot:no-data>-->
<!--                        No data-->
<!--                      </template>-->
<!--                    </v-data-table>-->
<!--                  </v-container>-->
<!--                </b-tab>-->
<!--              </keep-alive>-->

<!--              <keep-alive>-->
<!--                <b-tab :title="$t('subTab.documents')" :active="this.$route.query.subType === '3'">-->
<!--                  <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyCategoryDocument" />-->
<!--                  <v-container>-->
<!--                    <v-data-table :headers="headerCategory" :items="filteredCategoryItems" class="elevation-1 hse-table"-->
<!--                                  :items-per-page="15"-->
<!--                                  :single-expand="true" :search="search" :sort-desc="[true]"-->
<!--                                  @click:row="editCategoryItem"-->
<!--                    >-->
<!--                      <template v-slot:top>-->
<!--                        <div class="setting-header">-->
<!--                          <div class="panel-heading">-->
<!--                            <h4 class="panel-title">-->
<!--                              {{ $t('title.settings') }}-->
<!--                            </h4>-->
<!--                            <b-row>-->
<!--                              <b-col cols="6">-->
<!--                                <div class="field-selection field-search">-->
<!--                                  <v-text-field-->
<!--                                    v-model="search"-->
<!--                                    append-icon="search"-->
<!--                                    :label="$t('setting.search')"-->
<!--                                    outlined-->
<!--                                  />-->
<!--                                </div>-->
<!--                              </b-col>-->
<!--                            </b-row>-->
<!--                          </div>-->
<!--                          <div class="panel-footer text-right">-->
<!--                            &lt;!&ndash;                  <a type="button" class="btn btn-default" @click="addNewGoal"> New goal</a>&ndash;&gt;-->
<!--                          </div>-->
<!--                        </div>-->
<!--                      </template>-->

<!--                      <template v-slot:header="{ props: { headerCategory } }">-->
<!--                        <h4 class="table-name">-->
<!--                          {{ $t('table.categories') }}-->
<!--                        </h4>-->
<!--                      </template>-->
<!--                      <template v-slot:item.added_by_name="{ item }">-->
<!--                        <span v-if="item.added_by > 1">{{ item.added_by_first_name }} {{ item.added_by_last_name }}</span>-->
<!--                        <span v-if="item.added_by === 1">System</span>-->
<!--                      </template>-->
<!--                      <template v-slot:no-data>-->
<!--                        No data-->
<!--                      </template>-->
<!--                    </v-data-table>-->
<!--                  </v-container>-->
<!--                </b-tab>-->
<!--              </keep-alive>-->

<!--              <keep-alive>-->
<!--                <b-tab :title="$t('subTab.contacts')" :active="this.$route.query.subType === '4'">-->
<!--                  <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyCategoryContact" />-->
<!--                  <v-container>-->
<!--                    <v-data-table :headers="headerCategory" :items="filteredCategoryItems" class="elevation-1 hse-table"-->
<!--                                  :items-per-page="15"-->
<!--                                  :single-expand="true" :search="search" :sort-desc="[true]"-->
<!--                                  @click:row="editCategoryItem"-->
<!--                    >-->
<!--                      <template v-slot:top>-->
<!--                        <div class="setting-header">-->
<!--                          <div class="panel-heading">-->
<!--                            <h4 class="panel-title">-->
<!--                              {{ $t('title.settings') }}-->
<!--                            </h4>-->
<!--                            <b-row>-->
<!--                              <b-col cols="6">-->
<!--                                <div class="field-selection field-search">-->
<!--                                  <v-text-field-->
<!--                                    v-model="search"-->
<!--                                    append-icon="search"-->
<!--                                    :label="$t('setting.search')"-->
<!--                                    outlined-->
<!--                                  />-->
<!--                                </div>-->
<!--                              </b-col>-->
<!--                            </b-row>-->
<!--                          </div>-->
<!--                          <div class="panel-footer text-right">-->
<!--                            &lt;!&ndash;                  <a type="button" class="btn btn-default" @click="addNewGoal"> New goal</a>&ndash;&gt;-->
<!--                          </div>-->
<!--                        </div>-->
<!--                      </template>-->

<!--                      <template v-slot:header="{ props: { headerCategory } }">-->
<!--                        <h4 class="table-name">-->
<!--                          {{ $t('table.categories') }}-->
<!--                        </h4>-->
<!--                      </template>-->
<!--                      <template v-slot:item.added_by_name="{ item }">-->
<!--                        <span v-if="item.added_by > 1">{{ item.added_by_first_name }} {{ item.added_by_last_name }}</span>-->
<!--                        <span v-if="item.added_by === 1">System</span>-->
<!--                      </template>-->
<!--                      <template v-slot:no-data>-->
<!--                        No data-->
<!--                      </template>-->
<!--                    </v-data-table>-->
<!--                  </v-container>-->
<!--                </b-tab>-->
<!--              </keep-alive>-->

<!--              <keep-alive>-->
<!--                <b-tab :title="$t('subTab.attachments')" :active="this.$route.query.subType === '5'">-->
<!--                  <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyCategoryAttachment" />-->
<!--                  <v-container>-->
<!--                    <v-data-table :headers="addedFromHeaders" :items="filteredAddedFromItems"-->
<!--                                  class="elevation-1 hse-table" :items-per-page="15"-->
<!--                                  :single-expand="true" :search="search" :sort-desc="[true]"-->
<!--                                  @click:row="editCategoryItem"-->
<!--                    >-->
<!--                      <template v-slot:item.added_from="{ item }">-->
<!--                        {{ formatAddedFromAttachment(item.added_from) }}-->
<!--                      </template>-->
<!--                      <template v-slot:top>-->
<!--                        <div class="setting-header">-->
<!--                          <div class="panel-heading">-->
<!--                            <h4 class="panel-title">-->
<!--                              {{ $t('title.settings') }}-->
<!--                            </h4>-->
<!--                            <b-row>-->
<!--                              <b-col cols="6">-->
<!--                                <div class="field-selection">-->
<!--                                  <v-select-->
<!--                                    v-model="tab_categories_added_from"-->
<!--                                    item-text="name"-->
<!--                                    item-value="id"-->
<!--                                    :items="attachmentAddedFromArray"-->
<!--                                    label="From"-->
<!--                                    outlined-->
<!--                                  />-->
<!--                                </div>-->
<!--                              </b-col>-->
<!--                              <b-col cols="6">-->
<!--                                <div class="field-selection field-search">-->
<!--                                  <v-text-field-->
<!--                                    v-model="search"-->
<!--                                    append-icon="search"-->
<!--                                    :label="$t('setting.search')"-->
<!--                                    outlined-->
<!--                                  />-->
<!--                                </div>-->
<!--                              </b-col>-->
<!--                            </b-row>-->
<!--                          </div>-->
<!--                          <div class="panel-footer text-right">-->
<!--                            &lt;!&ndash;                  <a type="button" class="btn btn-default" @click="addNewGoal"> New goal</a>&ndash;&gt;-->
<!--                          </div>-->
<!--                        </div>-->
<!--                      </template>-->

<!--                      <template v-slot:header="{ props: { headerCategory } }">-->
<!--                        <h4 class="table-name">-->
<!--                          {{ $t('table.categories') }}-->
<!--                        </h4>-->
<!--                      </template>-->
<!--                      <template v-slot:item.added_by_name="{ item }">-->
<!--                        <span v-if="item.added_by > 1">{{ item.added_by_first_name }} {{ item.added_by_last_name }}</span>-->
<!--                        <span v-if="item.added_by === 1">System</span>-->
<!--                      </template>-->
<!--                      <template v-slot:no-data>-->
<!--                        No data-->
<!--                      </template>-->
<!--                    </v-data-table>-->
<!--                  </v-container>-->
<!--                </b-tab>-->
<!--              </keep-alive>-->

<!--              <keep-alive>-->
<!--                <b-tab :title="$t('subTab.checklists')" :active="this.$route.query.subType === '6'">-->
<!--                  <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyCategoryChecklist" />-->
<!--                  <v-container>-->
<!--                    <v-data-table :headers="headerCategory" :items="filteredCategoryItems" class="elevation-1 hse-table"-->
<!--                                  :items-per-page="15"-->
<!--                                  :single-expand="true" :search="search" :sort-desc="[true]"-->
<!--                                  @click:row="editCategoryItem"-->
<!--                    >-->
<!--                      <template v-slot:top>-->
<!--                        <div class="setting-header">-->
<!--                          <div class="panel-heading">-->
<!--                            <h4 class="panel-title">-->
<!--                              {{ $t('title.settings') }}-->
<!--                            </h4>-->
<!--                            <b-row>-->
<!--                              <b-col cols="6">-->
<!--                                <div class="field-selection field-search">-->
<!--                                  <v-text-field-->
<!--                                    v-model="search"-->
<!--                                    append-icon="search"-->
<!--                                    :label="$t('setting.search')"-->
<!--                                    outlined-->
<!--                                  />-->
<!--                                </div>-->
<!--                              </b-col>-->
<!--                            </b-row>-->
<!--                          </div>-->
<!--                          <div class="panel-footer text-right">-->
<!--                            &lt;!&ndash;                  <a type="button" class="btn btn-default" @click="addNewGoal"> New goal</a>&ndash;&gt;-->
<!--                          </div>-->
<!--                        </div>-->
<!--                      </template>-->

<!--                      <template v-slot:header="{ props: { headerCategory } }">-->
<!--                        <h4 class="table-name">-->
<!--                          {{ $t('table.categories') }}-->
<!--                        </h4>-->
<!--                      </template>-->
<!--                      <template v-slot:item.added_by_name="{ item }">-->
<!--                        <span v-if="item.added_by > 1">{{ item.added_by_first_name }} {{ item.added_by_last_name }}</span>-->
<!--                        <span v-if="item.added_by === 1">System</span>-->
<!--                      </template>-->
<!--                      <template v-slot:no-data>-->
<!--                        No data-->
<!--                      </template>-->
<!--                    </v-data-table>-->
<!--                  </v-container>-->
<!--                </b-tab>-->
<!--              </keep-alive>-->
<!--            </b-tabs>-->
<!--          </v-container>-->
<!--        </b-tab>-->
<!--      </keep-alive>-->
<!--      <keep-alive v-if="checkAdmin || permissionsUser.indexOf('department-basic') !== -1">-->
<!--        <b-tab :title="$t('tab.departments')" name="department-tab" class="hse-tab-item">-->
<!--          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyDepartment" />-->
<!--          <v-container>-->
<!--            <v-row>-->
<!--              <v-col cols="12">-->
<!--                <v-btn-->
<!--                  v-if="checkAdmin || permissionsUser.indexOf('department-basic') !== -1"-->
<!--                  class="mb-2 btn-create d-block ml-auto btn-custom-green"-->
<!--                  @click="checkAddNewDepartment = true"-->
<!--                >-->
<!--                  {{ $t('button.add_new') }}-->
<!--                </v-btn>-->
<!--                <DepartmentPopup-->
<!--                  :open-popup="checkAddNewDepartment"-->
<!--                  :list-array-input="departmentsValidArray"-->
<!--                  @closePopup="checkAddNewDepartment = !checkAddNewDepartment"-->
<!--                  @reloadList="reloadList"-->
<!--                />-->
<!--                <DepartmentTable-->
<!--                  :list-array-input="departmentsArray"-->
<!--                  :list-valid-array-input="departmentsValidArray"-->
<!--                  @reloadList="reloadList"-->
<!--                />-->
<!--              </v-col>-->
<!--            </v-row>-->
<!--          </v-container>-->
<!--        </b-tab>-->
<!--      </keep-alive>-->
<!--      <keep-alive v-if="checkAdmin || permissionsUser.indexOf('job title-detail') !== -1">-->
<!--        <b-tab :title="$t('tab.job_titles')" :active="this.$route.query.type === 'jobTitle'" name="job-title-tab" class="hse-tab-item">-->
<!--          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyJobTitle" />-->
<!--          <v-container>-->
<!--            <v-row>-->
<!--              <v-col cols="12">-->
<!--                <v-btn class="mb-2 btn-create d-block ml-auto btn-custom-green" @click="checkAddNewJobTitle = true">-->
<!--                  {{ $t('button.add_new') }}-->
<!--                </v-btn>-->
<!--                <JobTitleTable-->
<!--                  :roles-array="rolesArray"-->
<!--                  :roles-selection="rolesSelection"-->
<!--                  :departments-array="departmentsValidArray"-->
<!--                  :list-array-input="jobTitleArray"-->
<!--                  @reloadList="reloadJobTitleList"-->
<!--                />-->
<!--              </v-col>-->
<!--            </v-row>-->
<!--          </v-container>-->
<!--        </b-tab>-->
<!--      </keep-alive>-->
<!--      <keep-alive v-if="checkAdmin || permissionsUser.indexOf('user permission-view') !== -1">-->
<!--        <b-tab :title="$t('tab.user_permissions')" name="user-permissions-tab" class="hse-tab-item">-->
<!--          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyUserPermission" />-->
<!--          <v-container>-->
<!--            <v-row>-->
<!--              <v-col cols="12">-->
<!--                <v-data-table-->
<!--                  :headers="headersEmployee"-->
<!--                  :items="filteredEmployeeItems"-->
<!--                  class="elevation-1 hse-table"-->
<!--                  :items-per-page="15"-->
<!--                  :single-expand="true"-->
<!--                  :search="searchEmployee"-->
<!--                  :sort-desc="[true]"-->
<!--                  @click:row="editPermissionItem"-->
<!--                >-->
<!--                  <template v-slot:top>-->
<!--                    <div class="setting-header">-->
<!--                      <div class="panel-heading">-->
<!--                        <h4 class="panel-title">-->
<!--                          {{ $t('title.settings') }}-->
<!--                        </h4>-->
<!--                        <b-row>-->
<!--                          <b-col cols="6">-->
<!--                            <div class="field-selection">-->
<!--                              <v-select-->
<!--                                v-model="role"-->
<!--                                :label="$t('setting.role')"-->
<!--                                item-value="id"-->
<!--                                :items="rolesSelection"-->
<!--                                outlined-->
<!--                              >-->
<!--                                <template slot="selection" slot-scope="data">-->
<!--                                  {{ data.item.name }}-->
<!--                                </template>-->
<!--                                <template slot="item" slot-scope="data">-->
<!--                                  {{ data.item.name }}-->
<!--                                </template>-->
<!--                              </v-select>-->
<!--                            </div>-->
<!--                          </b-col>-->
<!--                          <b-col cols="6">-->
<!--                            <div class="field-selection field-search">-->
<!--                              <v-text-field-->
<!--                                v-model="searchEmployee"-->
<!--                                append-icon="search"-->
<!--                                :label="$t('setting.search')"-->
<!--                                outlined-->
<!--                              />-->
<!--                            </div>-->
<!--                          </b-col>-->
<!--                        </b-row>-->
<!--                      </div>-->
<!--                    </div>-->
<!--                  </template>-->
<!--                  <template v-slot:header="{ props: { headers } }">-->
<!--                    <h4 class="table-name">-->
<!--                      {{ $t('table.employees') }}-->
<!--                    </h4>-->
<!--                  </template>-->
<!--                  <template v-slot:item.name="{ item }">-->
<!--                    {{ item.first_name + ' ' + item.last_name }}-->
<!--                  </template>-->
<!--                  <template v-slot:no-data>-->
<!--                    No data-->
<!--                  </template>-->
<!--                </v-data-table>-->
<!--              </v-col>-->
<!--            </v-row>-->
<!--          </v-container>-->
<!--        </b-tab>-->
<!--      </keep-alive>-->
    </b-tabs>

    <!-- dialog Business Info - Company Info -->
    <CompanyPopup
      :open-company-info-popup="checkOpen"
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
      :list-employee-ceo-manager-array="employeesCeoManagerArray"
      :list-employee-safety-array="employeesSafetyArray"
      @closePopup="checkOverviewInfoOpen = !checkOverviewInfoOpen"
      @reloadCompany="reloadCompany"
    />

    <!-- dialog Statement -->
    <v-dialog v-model="dialogStatement" max-width="1300px" persistent>
      <v-card>
        <v-card-text>
          <div class="popup-header text-center">
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
                  <v-text-field
                    v-model="editedStatementItem.title"
                    :label="$t('form.title')"
                    :rules="required"
                    :readonly="showBtnApply"
                    outlined
                  />
                </div>
              </b-col>
            </b-row>
            <b-row align-h="center">
              <b-col cols="12">
                <!--                <froala :tag="'textarea'" :config="config" v-model="editedStatementItem.description">Init text</froala>-->
                <div class="input-wrap">
                  <!--                  <froala-->
                  <!--                    id="link-editor"-->
                  <!--                    v-model="editedStatementItem.description"-->
                  <!--                    :tag="'textarea'"-->
                  <!--                    :config="config"-->
                  <!--                  />-->
                  <FroalaSuggestionListEditor
                    :item="editedStatementItem"
                    :predefined-link-array="predefinedLinkArray"
                  />
                </div>
              </b-col>
            </b-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="popup-footer">
          <v-spacer />
          <v-btn class="btn-cancel" text @click="close">
            {{ $t('button.cancel') }}
          </v-btn>
          <v-btn
            v-if="(checkAdmin || permissionsUser.indexOf('statement-basic') > -1) && !showBtnApply"
            class="hse-btn-save"
            @click="convertStatementDescription"
          >
            {{ $t('button.preview') }}
          </v-btn>
          <v-btn
            v-if="(checkAdmin || permissionsUser.indexOf('statement-basic') > -1) && (editedStatementIndex === -1 || (editedStatementIndex > -1 && !editedStatementItem.disable_status)) && !showBtnApply"
            class="btn-save"
            @click="saveStatement"
          >
            {{ $t('button.save') }}
          </v-btn>
          <v-btn
            v-if="(checkAdmin || permissionsUser.indexOf('statement-basic') > -1) && editedStatementIndex > -1 && editedStatementItem.added_by === 1 && !editedStatementItem.disable_status && showBtnApply"
            class="btn-save"
            @click="applyStatementResource"
          >
            {{ $t('button.apply') }}
          </v-btn>
          <v-btn
            v-if="(checkAdmin || permissionsUser.indexOf('statement-basic') > -1) && (editedStatementIndex > -1 && !editedStatementItem.disable_status) && !showBtnApply && editedStatementItem.added_by === userID"
            class="hse-btn-delete"
            text
            @click="deleteStatement"
          >
            <v-icon dark>
              mdi-delete
            </v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- DELETE popup -->
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card class="dialog-delete">
        <v-card-text>
          <div class="text-center confirm-delete-title">
            {{ $t('title.confirm_delete') }}
          </div>
          <div class="confirm-delete-text">
            <span v-if="deleteType === 'statement'">
              {{ $t('message.are_you_sure_you_want_to_delete_this_item') }}
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

<!--    <AttachmentPopup-->
<!--      :open-attachment-popup="checkAttachmentOpen"-->
<!--      :attachment-item="companyInfo"-->
<!--      :type="'attachment'"-->
<!--      :added-from="document_added_from"-->
<!--      :is-logo="true"-->
<!--      @closePopup="checkAttachmentOpen = !checkAttachmentOpen"-->
<!--      @reloadCompany="reloadCompany"-->
<!--      @reloadList="reloadList"-->
<!--    />-->

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

<!--    <v-dialog v-model="dialogPermission" max-width="1300px" persistent>-->
<!--      <v-card>-->
<!--        <v-card-text>-->
<!--          <div class="title-model">-->
<!--            {{ formPermissionTitle }}-->
<!--          </div>-->
<!--          <v-form-->
<!--            ref="form"-->
<!--            v-model="validPermission"-->
<!--            lazy-validation-->
<!--          >-->
<!--            <b-row align-h="center">-->
<!--              <b-col cols="6">-->
<!--                <div class="input-wrap">-->
<!--                  <v-text-field v-model="editedPermissionItem.name" :label="$t('form.name')" :rules="required" disabled outlined />-->
<!--                </div>-->
<!--              </b-col>-->
<!--              <b-col v-if="checkCompanyAdmin" cols="6">-->
<!--                <div class="input-wrap">-->
<!--                  <v-text-field v-model="editedPermissionItem.role_name" :label="$t('form.role')" :rules="required" disabled outlined />-->
<!--                </div>-->
<!--              </b-col>-->
<!--              <b-col v-else cols="6">-->
<!--                <div class="input-wrap">-->
<!--                  <v-text-field v-model="editedPermissionItem.job_title_name" :label="$t('form.job_title')" :rules="required" disabled outlined />-->
<!--                </div>-->
<!--              </b-col>-->
<!--            </b-row>-->
<!--            <b-row v-if="checkCompanyAdmin">-->
<!--              <b-col>-->
<!--                <div class="text-noti text-important text-red">-->
<!--                  *By default, the company administrator has all rights to their company-->
<!--                </div>-->
<!--              </b-col>-->
<!--            </b-row>-->
<!--            <b-row v-else>-->
<!--              <b-col cols="6" class="mb-7">-->
<!--                <div class="input-wrap question-mark-block d-flex">-->
<!--                  <v-checkbox-->
<!--                    v-model="editedPermissionItem.is_super"-->
<!--                    :label="$t('form.is_this_super_user')"-->
<!--                    class="margin-right-sm mt-0"-->
<!--                    :hide-details="true"-->
<!--                  />-->
<!--                  <v-badge-->
<!--                    :value="hoverQuestionMark"-->
<!--                    right-->
<!--                    transition="slide-x-transition"-->
<!--                    class="hse&#45;&#45;icon-question-circle"-->
<!--                    content="Add extended permissions"-->
<!--                  >-->
<!--                    <v-hover v-model="hoverQuestionMark">-->
<!--                      <i class="fa fa-question-circle"></i>-->
<!--                    </v-hover>-->
<!--                  </v-badge>-->
<!--                </div>-->
<!--              </b-col>-->
<!--              <b-col cols="12">-->
<!--                <PermissionTable-->
<!--                  :permissions-data-input="permissionsData"-->
<!--                  :role-name-input="editedPermissionItem.role_name"-->
<!--                  @getPermissionsArray="getPermissionsArray"-->
<!--                />-->
<!--              </b-col>-->
<!--            </b-row>-->
<!--          </v-form>-->
<!--        </v-card-text>-->
<!--        <v-card-actions>-->
<!--          <v-spacer />-->
<!--          <v-btn v-if="!checkAdmin" class="btn-cancel" text @click="close">-->
<!--            Close-->
<!--          </v-btn>-->
<!--          <v-btn v-else class="btn-cancel" text @click="close">-->
<!--            {{ $t('button.cancel') }}-->
<!--          </v-btn>-->
<!--          <v-btn v-if="checkAdmin" class="btn-save" @click="savePermission">-->
<!--            {{ $t('button.save') }}-->
<!--          </v-btn>-->
<!--        </v-card-actions>-->
<!--      </v-card>-->
<!--    </v-dialog>-->
  </div>
</template>
<script>
  import {_} from 'vue-underscore';
  import cookies from 'js-cookie';
  import axios from "axios";
  import TitleCaption from "../../../components/TitleCaption";
  import FroalaEditor from 'froala-editor';
  // import PermissionTable from "../../../components/PermissionTable";
  import CompanyPopup from "../../../components/CompanyPopup";
  import DocumentPopup from "../../../components/DocumentPopup";
  import DocumentTable from "../../../components/DocumentTable";
  // import AttachmentPopup from "../../../components/AttachmentPopup";
  import {DropkiqUI} from "dropkiq-ui";
  import FroalaSuggestionListEditor from "../../../components/FroalaSuggestionListEditor";

  export default {
    components: {
      TitleCaption,
      // PermissionTable,
      CompanyPopup,
      DocumentPopup,
      DocumentTable,
      // AttachmentPopup,
      FroalaSuggestionListEditor,
    },

    data: () => ({
      userRoleId: parseInt(cookies.get('roleID')),
      userDepartmentID: parseInt(cookies.get('userDepartmentID')),
      checkSuperAdmin: cookies.get('checkSuperAdmin'),
      checkAdmin: cookies.get('checkAdmin'),
      roleUser: cookies.get('roleUser'),
      pageKeyOverview: 'company-company-overview',
      pageKeyHSEstatement: 'company-company-hse-statement',
      // pageKeyCategory: 'company-company-categories',
      // pageKeyCategoryRoutine: 'company-company-categories-routines',
      // pageKeyCategoryInstruction: 'company-company-categories-instructions',
      // pageKeyCategoryDocument: 'company-company-categories-documents',
      // pageKeyCategoryContact: 'company-company-categories-contacts',
      // pageKeyCategoryAttachment: 'company-company-categories-attachments',
      // pageKeyCategoryChecklist: 'company-company-categories-checklists',
      // pageKeyDepartment: 'company-company-departments',
      // pageKeyJobTitle: 'company-company-job-titles',
      // pageKeyUserPermission: 'company-company-user-permissions',
      permissionsUser: localStorage.getItem('permissionsKey'),
      // search: '',
      // dialog: false,
      // selectedFile: [],
      // valid: true,
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
      document_added_from: 'company', // document_added_from: 2. company
      category_type: 'attachment',
      category_added_from: 1, // category type: "attachment" & added_from: "company"
      categoriesArray: [], // list categories without 'Logo' category
      employeesArray: [],
      validRole: true,

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
      checkOpen: false,
      checkContactInfoOpen: false,
      checkDocumentOpen: false,
      // checkAttachmentOpen: false,
      checkOverviewInfoOpen: false,
      deleteType: '',
      suggestedInfo: {
        CEO_name: "",
        HSE_manager_name: "",
        Safety_manager_name: "",
        Number_of_employees: "",
      },
      statementDescription: '',
      categoryId: '',
      employeesCeoManagerArray: [],
      employeesSafetyArray: [],
      showBtnApply: false,
      // linkItem: {
      //   text: '',
      //   href: '',
      //   target: '_blank'
      // },
      // defaultLinkItem: {
      //   text: '',
      //   href: '',
      //   target: '_blank'
      // },
    }),

    computed: {
      headersStatement() {
        return [
          {text: this.translateCol('title'), value: 'title', align: 'left'},
          {text: this.translateCol('added_by'), value: 'user_added', align: 'left'},
        ];
      },

      filteredStatementItems() {
        let that = this;
        return that.listStatementArray;
      },

      formStatementTitle() {
        return this.editedStatementIndex === -1 ? 'New Statement' : 'Edit Statement';
      },
    },

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

          // let that = this;
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
            },
            // 'commands.before': function (e) {
            //   console.log(e);
            //   console.log(this);
            //   if (e === 'linkOpen') {
            //     // that.$router.push('/en/company/deviations?id=6');
            //
            //     // alert("before");
            //     // return false;
            //   }
            //   // let routeData = that.$router.resolve({name: 'lang-company-deviations', query: {id: '6'}});
            //   // window.open(routeData.href, '_blank');
            // },
            // 'click': function (e) {
            //   console.log(e.target.href);
            //   console.log(e.target.attributes.href);
            //   console.log(e.target);
            //   console.log(e);
            //   // let routeData = that.$router.resolve({name: 'lang-company-deviations', query: {id: '6'}});
            //   // window.open(routeData.href, '_blank');
            // },

          };

          // this.getLinkList();
          this.config.linkList = this.predefinedLinkArray;
          // this.config.linkList = [
          //   {
          //     text: 'Froala',
          //     href: 'https://froala.com',
          //     target: '_blank'
          //   },
          //   {
          //     text: 'Google',
          //     href: 'https://google.com',
          //     target: '_blank'
          //   },
          //   {
          //     text: 'Facebook',
          //     href: 'https://facebook.com'
          //   }
          // ];
        }
      },

      // categoriesValidArray: {
      //   handler: 'getCategoryObject',
      //   immediate: true,
      // },
    },

    mounted() {
      let that = this;
      that.$nextTick(() => {
        that.$nuxt.$loading.start();
        // list employees
        that.$store.dispatch('employees/index').then(result => {
          that.employeesArray = _.each(result.data, function(i) {
            if (i.department_name) {
              i.name = i.name + ' - ' + i.department_name;
            }
          });
          // that.employeesArray = result.data;
          that.employeesCeoManagerArray = _.filter(that.employeesArray, function (item) {
            return item.role_level < 3 && !item.disable_status;
          });
          that.employeesSafetyArray = _.filter(that.employeesArray, function (item) {
            return item.role_level === 3 && !item.disable_status;
          });
          that.suggestedInfo.Number_of_employees = that.employeesArray.length;
        }).catch(() => {
          // that.$toaster.error(that.$i18n.t('message.fail_employee_view'));
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });

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

            //Get document list
            that.$store.dispatch('documents/index', {
              object_type: that.document_added_from,
              object_id: that.company_id
            }).then(result => {
              that.documents = result.data;
              if (that.documents.length > 0) {
                _.each(that.documents, function (item) {
                  if (item.description) {
                    item.description = item.description.replace(/<[^>]+>/g, '');
                  }
                });
              }
            }).catch(() => {
              // that.$toaster.error(that.$i18n.t('message.fail_document_view'));
              // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
              that.$nuxt.$loading.finish();
            });

            //Get Attachment Company categories list
            that.$store.dispatch('categories/index', {
              type: that.category_type,
              added_from: that.category_added_from
            }).then(result => {
              that.categoriesArray = _.filter(result.data, function (item) {
                return item.name !== "Logo";
              });
            }).catch(() => {
              // that.$toaster.error(that.$i18n.t('message.fail_category_view'));
              // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
              that.$nuxt.$loading.finish();
            });

            that.$nuxt.$loading.finish();
          }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
            that.$toaster.error(that.$i18n.t('message.fail_company_view_detail'));
            }
            // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            that.$nuxt.$loading.finish();
          });
        }).catch(() => {
          // that.$toaster.error(that.$i18n.t('message.failed'));
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });

        // list statement
        that.$store.dispatch('statements/index').then(result => {
          that.listStatementArray = result.data;
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_statement_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });

        that.$store.dispatch('statements/index', {param: 'suggestion'}).then(result => {
          if (result.data) {
            // console.log(result.data);
            _.each(result.data, function (item) {
              // console.log(item);
              // console.log(item.type);
              _.each(item.data, function (object) {
                // console.log(object);
                let linkItem = {
                  text: '',
                  href: '',
                  target: '_blank'
                };

                if (item.type === 'Routine') {
                  if (object.recurring === 'indefinite') {
                    linkItem.text = '[' + item.type + '] ' + object.name + ', ' + object.recurring + ', ' + object.first_name + ' ' + object.last_name;
                  } else {
                    linkItem.text = '[' + item.type + '] ' + object.name + ', ' + object.deadline  + ' - ' + object.recurring + ', ' + object.first_name + ' ' + object.last_name;
                  }
                } else {
                  linkItem.text = '[' + item.type + '] ' + object.name;
                }
                // linkItem.href = object.url + '?id=' + object.id;
                linkItem.href =  '/' + that.$i18n.locale + object.url + '?id=' + object.id;

                that.predefinedLinkArray.push(linkItem);

                that.predefinedLinkArray = _.sortBy(that.predefinedLinkArray, function (item) {
                  return item.text;
                });
              });
            });
          }
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_statement_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      });
    },

    methods: {
      translateCol (colName) {
        return this.$i18n.t('column.' + colName);
      },

      // getLinkList() {
      //   let that = this;
      //   that.predefinedLinkArray = [];
      //   // that.config.linkList = that.predefinedLinkArray;
      //   that.$store.dispatch('statements/index', {param: 'suggestion'}).then(result => {
      //     if (result.data) {
      //       // that.predefinedLinkArray = result.data;
      //       _.each(result.data, function (item) {
      //         console.log(item);
      //         that.linkItem.text = '';
      //         that.linkItem.href = '';
      //         // that.linkItem = Object.assign({}, that.defaultLinkItem);
      //         that.linkItem.text = item.name;
      //         that.linkItem.href = item.id;
      //
      //         that.predefinedLinkArray.push(that.linkItem);
      //
      //       });
      //
      //       console.log(that.predefinedLinkArray);
      //       that.config.linkList = that.predefinedLinkArray;
      //     }
      //     // that.predefinedLinkArray = result.data;
      //   }).catch((error) => {
      //     that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
      //     that.$nuxt.$loading.finish();
      //   });
      //
      // },

      // editPermissionItem(item) {
      //   let that = this;
      //   that.checkCompanyAdmin = item.role_name === 'Company admin' && item.role_level === 1;
      //   // if (that.checkAdmin) {
      //   //   that.$nuxt.$loading.start();
      //   //   that.editedPermissionItem = Object.assign({}, item);
      //   //   that.dialogPermission = true;
      //   //   that.$nuxt.$loading.finish();
      //   // }
      //   that.$nuxt.$loading.start();
      //   if (that.checkCompanyAdmin) {
      //     that.editedPermissionItem = Object.assign({}, item);
      //     that.dialogPermission = true;
      //     that.$nuxt.$loading.finish();
      //   } else {
      //     that.$store.dispatch('userPermissions/show', item.id).then(result => {
      //       that.editedPermissionItem = Object.assign({}, result.data);
      //       that.editedPermissionItem.name = that.editedPermissionItem.first_name + ' ' + that.editedPermissionItem.last_name;
      //       that.editedPermissionItem.role_name = item.role_name;
      //       that.permissionsData = that.editedPermissionItem.permission;
      //       that.dialogPermission = true;
      //       that.$nuxt.$loading.finish();
      //     }).catch((error) => {
      //       that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
      //       that.$nuxt.$loading.finish();
      //     });
      //   }
      // },
      //
      // savePermission() {
      //   let that = this;
      //   if (that.$refs.form.validate()) {
      //     that.$nuxt.$loading.start();
      //     if (that.permissionsArrayOutput.length > 0) {
      //       that.editedPermissionItem.permission = JSON.stringify(that.permissionsArrayOutput);
      //     }
      //     that.$store.dispatch('userPermissions/update', that.editedPermissionItem).then(function () {
      //       that.reloadList();
      //     }).catch((error) => {
      //       that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
      //       that.$nuxt.$loading.finish();
      //     });
      //     that.close();
      //   }
      // },
      //
      // getPermissionsArray(value) {
      //   this.permissionsArrayOutput = value;
      // },

      // getSelectedItems(value) {
      //   this.selectedItems = value.selectedItemsOutput;
      // },

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
              that.$toaster.success(that.$i18n.t('message.success_statement_update'));
            }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_statement_update'));
              }
              that.$nuxt.$loading.finish();
              // if (error.response && error.response.data) {
              //   that.$toaster.error(error.response.data.message || error.response.data.errors);
              // }
            });
          } else {
            that.$store.dispatch('statements/store', that.editedStatementItem).then(function () {
              that.reloadStatementList();
              that.$nuxt.$loading.finish();
              that.$toaster.success(that.$i18n.t('message.success_statement_add_new'));
            }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_statement_add_new'));
              }
              // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
              that.$nuxt.$loading.finish();
            });
          }
          that.close();
        }
      },

      editStatementItem(item) {
        this.editedStatementIndex = this.listStatementArray.indexOf(item);
        this.editedStatementItem = Object.assign({}, item);
        this.showBtnApply = this.editedStatementItem.added_by === 1;
        this.dialogStatement = true;
      },

      applyStatementResource() {
        this.showBtnApply = false;
      },

      close() {
        // this.selectedItems = [];
        if (this.dialogStatement) {
          this.dialogStatement = false;
          setTimeout(() => {
            this.editedStatementItem = Object.assign({}, this.defaultStatementItem);
            this.editedStatementIndex = -1;
          }, 300);
        }
        this.reset();
      },

      reloadList() {
        let that = this;
        // get list
        that.$store.dispatch('documents/index', {
          object_type: that.document_added_from,
          object_id: that.company_id
        }).then(result => {
          that.documents = result.data;
          _.each(that.documents, function (item) {
            if (item.description) {
              item.description = item.description.replace(/<[^>]+>/g, '');
            }
          });
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_document_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      },

      reloadListCategory(){
        let that = this;
        that.$store.dispatch('categories/index', {
          type: that.category_type,
          added_from: that.category_added_from
        }).then(result => {
          that.categoriesArray = _.filter(result.data, function (item) {
            return !item.disable_status;
          });
          that.categoriesSelection = _.clone(that.categoriesArray);
          that.categoriesSelection.push(that.categoriesDefault);
          that.categoriesSelection.sort(function (a, b) {
            return (a.id - b.id);
          });
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_category_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      },

      reset() {
        // this.permissionsArrayOutput = [];
        // this.permissionsData = '';
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
        if (that.deleteType === 'statement') {
          if (that.editedStatementItem.id) {
            that.$store.dispatch('statements/delete', that.editedStatementItem.id).then(function () {
              that.reloadStatementList();
              that.$toaster.success(that.$i18n.t('message.success_statement_delete'));
            }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
              that.$toaster.error(that.$i18n.t('message.fail_statement_delete'));
              }
              // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
            });
          }
        }
      },

      // showAttachment() {
      //   this.checkAttachmentOpen = true;
      // },

      reloadCompany() {
        let that = this;
        //Get current companies
        that.$store.dispatch('companies/show', that.company_id).then(result => {
          that.companyInfo = result.data;
          that.getImageSrc(that.companyInfo.logo);
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_company_view_detail'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
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

      reloadStatementList() {
        let that = this;
        that.$store.dispatch('statements/index').then(result => {
          that.listStatementArray = result.data;
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_statement_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      },

      //statement
      addNewStatement() {
        this.reset();
        this.dialogStatement = true;
      },
    }
  };
</script>

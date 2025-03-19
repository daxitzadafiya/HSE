<template>
  <div class="employees-page">
    <v-btn
      v-if="checkAdmin || permissionsUser.indexOf('employee-basic') > -1"
      class="mb-2 btn-create btn-custom-green"
      @click="checkAddNew = true"
    >
      {{ $t('button.add_new') }}
    </v-btn>

    <b-tabs card lazy>
      <keep-alive>
        <b-tab :title="$t('tab.overview')" active>
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKey" />
          <v-container>
            <!-- Settings filter -->
            <div class="employee-setting-header">
              <div class="panel-heading">
                <h4 class="panel-title">
                  {{ $t('title.sort_by') }}
                </h4>
                <b-row>
                  <b-col cols="10">
                    <b-row>
                      <b-col cols="6">
                        <div class="field-selection">
                          <v-select
                            v-model="role"
                            :label="$t('setting.role')"
                            item-value="id"
                            :items="rolesSelection"
                            outlined
                            class="text-box"
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
                            v-model="search"
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
                    <b-row>
                      <b-col v-if="isShowDepartmentFilter" cols="6">
                        <div class="field-selection">
                          <v-select
                            v-model="department"
                            :items="departmentsSelection"
                            item-value="id"
                            item-text="name"
                            :label="$t('setting.department')"
                            outlined
                            class="text-box"
                          />
                        </div>
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col cols="2">
                    <div class="field-selection right-checkbox-group employee-right-checkbox-group">
                      <v-checkbox
                        v-model="isShowDepartmentFilter"
                        :label="$t('setting.department')"
                        class="margin-right-sm text-box"
                      />
                    </div>
                  </b-col>
                </b-row>
              </div>
              <div class="panel-footer text-right">
                <!--                  <a type="button" class="btn btn-default" @click="addNewGoal"> New goal</a>-->
              </div>
            </div>

            <!-- Add new employee dialog -->
            <EmployeePopup
              :open-popup="checkAddNew"
              :manager-array="listManager"
              @closePopup="checkAddNew = !checkAddNew"
              @reloadList="reloadList"
            />

            <!-- Employee list view -->
            <b-tabs card name="viewOption" lazy class="employee-tabs">
              <keep-alive>
                <b-tab :title="$t('subTab.list_view')" class="employee-tab-view">
                  <!-- Employee table view -->
                  <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyListView" />
                  <v-container>
                    <v-data-table
                      :headers="headers"
                      :items="filteredItems"
                      class="elevation-1 hse-table"
                      :items-per-page="15"
                      :single-expand="true"
                      :search="search"
                      :sort-by="['created_at']"
                      :sort-desc="[true, false]"
                      @click:row="viewItem"
                    >
                      <template v-slot:header="{ props: { headers } }">
                        <h4 class="table-name">
                          {{ $t('table.employees') }}
                        </h4>
                      </template>
                      <template v-slot:item.name="{ item }">
                        {{ item.first_name + ' ' + item.last_name }}
                      </template>

                      <template v-slot:item.created_at="{ item }">
                        {{ moment(item.created_at).format('DD.MM.YYYY') }}
                      </template>

                      <template v-slot:no-data>
                        {{ $t('table.no_data') }}
                      </template>
                    </v-data-table>
                  </v-container>
                </b-tab>
              </keep-alive>
              <keep-alive>
                <b-tab :title="$t('subTab.grid_view')" class="employee-tab-view">
                  <!-- Employee grid view -->
                  <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyGridView" />
                  <div class="employee-grid-view">
                    <v-container>
<!--                      <h4 class="table-name">-->
<!--                        Employees-->
<!--                      </h4>-->
                      <v-row class="employee-list-grid">
                        <v-col v-for="item in filteredItems" :key="item.id" cols="12" sm="3">
                          <v-card width="100%" @click="viewItem(item)">
                            <b-row align-h="center">
                              <b-col cols="12">
                                <div>
                                  <img :src="item.avatar" alt="employee" class="employee-avatar" width="80" height="80" />
                                </div>
                              </b-col>
                            </b-row>
                            <b-row>
                              <b-col cols="12">
                                <h4 class="mb-0">
                                  {{ item.first_name }} {{ item.last_name }}
                                </h4>
                                <small>
                                  {{ item.role_name }}
                                </small>
                              </b-col>
                            </b-row>
                          </v-card>
                        </v-col>
                      </v-row>
                    </v-container>
                  </div>
                </b-tab>
              </keep-alive>
              <keep-alive>
                <b-tab :title="$t('subTab.organization_chart')" @click="getOrganizationChart">
                  <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKeyOrganizationChart" />
                  <v-container>
                    <div id="sample" style="position: relative;">
                      <div id="myDiagramDiv" style="background-color: #f2f2f2; border: solid 1px black; width: 100%; height: 700px"></div>
                      <div id="myOverviewDiv" style="position: absolute; width: 200px; height: 100px; top: 10px; left: 10px; background-color: #f2f2f2; z-index: 300; border: solid 1px #7986cb;"></div>
                    </div>
                  </v-container>
<!--                  <template>-->
<!--                    <div id="tree" ref="tree" class="organization-chart-custom"></div>-->
<!--                  </template>-->
                </b-tab>
              </keep-alive>
            </b-tabs>
          </v-container>
        </b-tab>
      </keep-alive>
    </b-tabs>
  </div>
</template>
<script>
  import {_} from 'vue-underscore';
  import cookies from 'js-cookie';
  import axios from "axios";
  // import OrgChart from '@balkangraph/orgchart.js/orgchart';
  import TitleCaption from "../../../components/TitleCaption";
  import EmployeePopup from "../../../components/EmployeePopup";
  import go from 'gojs';

  export default {
    components: {
      TitleCaption,
      EmployeePopup,
    },

    data: () => ({
      permissionsUser: localStorage.getItem('permissionsKey'),
      userRoleId: parseInt(cookies.get('roleID')),
      userDepartmentID: parseInt(cookies.get('userDepartmentID')),
      checkAdmin: cookies.get('checkAdmin'),
      roleUser: cookies.get('roleUser'),
      userID: parseInt(cookies.get('userID')),
      baseUrl: cookies.get('baseUrl'),
      nowDate: new Date().toISOString().substr(0, 10),
      pageKey: 'employees-overview-employees',
      pageKeyListView: 'employees-overview-employees-list-view',
      pageKeyGridView: 'employees-overview-employees-grid-view',
      pageKeyOrganizationChart: 'employees-overview-employees-organization-chart',
      search: '',
      dialog: false,
      valid: true,
      role: 0,
      rolesSelection: [],
      dataRoleDefault: {
        id: 0,
        name: "All",
      },
      listArray: [],
      listManager: [],
      editedItem: {
        user_id: "",
        role_id: "",
        first_name: "",
        last_name: "",
        email: "",
        address: "",
        city: "",
        phone_number: "",
        personal_number: "",
        avatar: "",
        zip_code: "",
        status: "pending",
        department_id: "",
        job_title_id : "",
        nearest_manager: "",
        hourly_salary: "",
        overtime_pay: "",
        night_allowance: "",
        holidays: "",
        tax: "",
      },
      defaultItem: {
        user_id: "",
        role_id: "",
        first_name: "",
        last_name: "",
        email: "",
        address: "",
        city: "",
        phone_number: "",
        personal_number: "",
        avatar: "",
        zip_code: "",
        status: "pending",
        department_id: "",
        job_title_id : "",
        nearest_manager: "",
        hourly_salary: "",
        overtime_pay: "",
        night_allowance: "",
        holidays: "",
        tax: "",
      },
      date: '',
      menu: false,
      // read data
      required: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else return true;
        }
      ],
      departmentsArray: [],
      department: 0,
      departmentsSelection: [],
      departmentDefault: {
        id: 0,
        name: "All"
      },
      isShowDepartmentFilter: false,
      roleArray: [],
      previewUrl: null, // upload avatar
      //organization chart
      nodes: [],
      default_tag: [],
      // default_node_item: {
      //   id: '',
      //   pid: '',
      //   tags: '',
      //   name: '',
      //   title: '',
      //   img: '',
      // },
      tags: [],
      showOrganizationChart: false,
      departmentsOrgChart: [],
      checkAddNew: false,
      default_node_item: {
        key: '',
        boss: '',
        name: '',
        title: '',
        headOf: '',
        img: '',
      },
    }),

    computed: {
      headers() {
        return [
          {text: this.translateCol('name'), align: 'left', value: 'name'},
          {text: this.translateCol('phone_number'), align: 'center', value: 'phone_number'},
          {text: this.translateCol('role'), value: 'role_name', align: 'center'},
          {text: this.translateCol('department'), value: 'department_name', align: 'center'},
          {text: this.translateCol('hired_since'), value: 'created_at', align: 'center', sortDesc: false},
          {text: this.translateCol('primary_relative'), value: 'primary_employee_relative_name', sortable: false, align: 'center'},
          {text: this.translateCol('attachment'), value: 'count_attachment', sortable: false, align: 'center'},
        ];
      },
      computedDateFormatted() {
        if (this.date) {
          return this.formatDate(this.date);
        } else {
          return "DD.MM.YYYY";
        }
      },
      filteredItems() {
        let that = this;
        return that.listArray.filter((item) => {
          return ((that.role === 0 || (item.role_id === that.role))
            && (that.department === 0 || (item.department_id === that.department))
          );
        });
      },
    },

    watch: {
      dialog(val) {
        val || this.close();
      },
    },

    mounted() {
      let that = this;
      that.$nextTick(() => {
        that.$nuxt.$loading.start();

        // list employees
        that.$store.dispatch('employees/index').then(result => {
          // that.listArray = result.data;
          that.listArray = _.filter(result.data, function (item) {
            return !item.disable_status;
          });
          // list nearest managers
          that.listManager = _.clone(result.data);
          that.listManager = _.filter(result.data, function (item) {
            return item.role_id === 2 || item.role_id === 3;
          });
          _.each(that.listManager, function(i) {
            if (i.department_name) {
              i.name = i.name + ' - ' + i.department_name;
            }
          });
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_employee_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });

        // list departments
        that.$store.dispatch('departments/index').then(result => {
          that.departmentsArray = result.data;
          that.departmentsSelection = _.clone(result.data);
          that.departmentsSelection.push(that.departmentDefault);
          that.departmentsSelection.sort(function (a, b) {
            return (a.id - b.id);
          });
        }).catch(() => {
          // that.$toaster.error(that.$i18n.t('message.fail_department_view'));
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });

        // that.$store.dispatch('departments/index', {parent: 'yes'}).then(result => {
        //   that.departmentsOrgChart = result.data;
        // }).catch((error) => {
        //   that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        //   that.$nuxt.$loading.finish();
        // });

        //Get roles list
        that.$store.dispatch('employees/indexRole').then(result => {
          that.roleArray = result.data;
          that.rolesSelection = _.clone(result.data);
          that.rolesSelection.push(that.dataRoleDefault);
          that.rolesSelection.sort(function (a, b) {
            return (a.id - b.id);
          });
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_role_view'));
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

      viewItem(item) {
        if (this.checkAdmin || this.permissionsUser.indexOf('employee-detail') > -1) {
          this.$router.push('/employees/' + item.id);
        }
      },

      close() {
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
        }, 300);
      },

      reloadList() {
        let that = this;
        // get list
        that.$store.dispatch('employees/index').then(result => {
          // that.listArray = result.data;
          that.listArray = _.filter(result.data, function (item) {
            return !item.disable_status;
          });
          // list nearest managers
          that.listManager = _.clone(result.data);
          that.listManager = _.filter(result.data, function (item) {
            return item.role_id === 2 || item.role_id === 3;
          });
          _.each(that.listManager, function(i) {
            if (i.department_name) {
              i.name = i.name + ' - ' + i.department_name;
            }
          });
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_employee_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      },

      reset() {
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.$refs.form.reset();
          this.$refs.form.resetValidation();
        }, 0);
      },

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
          return result;
        });
      },

      // getOrganizationChart() {
      //   var that = this;
      //   that.departmentsOrgChart.forEach(function (item) {
      //     that.tags[item.name] = {
      //       group: true,
      //       groupName: item.name,
      //       groupState: OrgChart.EXPAND,
      //       template: "group_grey"
      //     };
      //   });
      //   that.$store.dispatch('employees/index').then(result => {
      //     var data = result.data;
      //     if (data.length > 0){
      //       if (!that.showOrganizationChart) {
      //         var node_item = '';
      //         var tag = [];
      //         data.forEach(function (item) {
      //           node_item = _.clone(that.default_node_item);
      //           tag = _.clone(that.default_tag);
      //           tag.push(item.department_name);
      //           node_item.id = item.id;
      //           node_item.pid = that.departmentsOrgChart.find(x => x.name === item.department_name).parent_id;
      //           node_item.tags = tag;
      //           node_item.name = item.first_name + ' ' + item.last_name;
      //           node_item.title = item.role_name;
      //           node_item.img = item.avatar;
      //
      //           that.nodes.push(node_item);
      //         });
      //         that.showOrganizationChart = true;
      //       }
      //       // OrgChart.templates.myTemplate = Object.assign({}, OrgChart.templates.rony);
      //
      //       OrgChart.MAXIMIZE =
      //         '<g style="cursor:pointer;" transform="matrix(1,0,0,1,{x},20)" control-maxmin-id="{id}">'
      //         + '<rect x="0" y="0" width="26" height="26" fill="#EEEEEE" stroke="#aeaeae" stroke-width="0" rx="2"></rect>'
      //         + '<line x1="4" y1="13" x2="22" y2="13" stroke-width="1" stroke="#87a53a"></line>'
      //         + '<line x1="13" y1="4" x2="13" y2="22" stroke-width="1" stroke="#87a53a"></line>'
      //         + '</g>';
      //
      //       OrgChart.MINIMIZE =
      //         '<g style="cursor:pointer;" transform="matrix(1,0,0,1,{x},20)" control-maxmin-id="{id}">'
      //         + '<rect x="0" y="0" width="26" height="26" fill="#EEEEEE" stroke="#aeaeae" stroke-width="0" rx="2"></rect>'
      //         + '<line x1="4" y1="13" x2="22" y2="13" stroke-width="1" stroke="#87a53a"></line>'
      //         + '</g>';
      //
      //       OrgChart.templates.rony.plus =
      //         '<circle cx="15" cy="15" r="15" fill="#ffffff" stroke="#aeaeae" stroke-width="1"></circle>'
      //         + '<text text-anchor="middle" style="font-size: 18px;cursor:pointer;" fill="#757575" x="15" y="22">11</text>';
      //
      //       // OrgChart.templates.rony.minus =
      //       //   '<rect x="0" y="0" width="36" height="36" rx="12" ry="12" fill="#2E2E2E" stroke="#aeaeae" stroke-width="1"></rect>'
      //       //   + '<polyline  stroke="#aeaeae" stroke-width="2" points="6,9 13,17 20,9" fill="none"></polyline>';
      //
      //       OrgChart.templates.rony.minus =
      //         '<circle cx="15" cy="15" r="15" fill="#ffffff" stroke="#2E2E2E" stroke-width="2"></circle>' +
      //         '<line x1="4" y1="15" x2="26" y2="15" stroke-width="2" stroke="#2E2E2E"></line>';
      //       // OrgChart.templates.rony.expandCollapseSize = 36;
      //
      //       new OrgChart(document.getElementById("tree"), {
      //         lazyLoading: true,
      //         enableSearch: false,
      //         nodeMouseClick: OrgChart.action.none,
      //         // mouseScrool: OrgChart.action.none,
      //         template: "rony",
      //         nodeBinding: {
      //           field_0: "name",
      //           field_1: "title",
      //           img_0: "img"
      //         },
      //         tags: Object.assign({}, that.tags),
      //         nodes: that.nodes,
      //       });
      //     }
      //   }).catch((error) => {
      //     that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
      //     that.$nuxt.$loading.finish();
      //   });
      // },
      getOrganizationChart() {
        let that = this;
        that.$nuxt.$loading.start();
        // This function provides a common style for most of the TextBlocks.
        // Some of these values may be overridden in a particular TextBlock.
        function textStyle(field) {
          return [
            {
              font: "12px Roboto, sans-serif", stroke: "rgba(0, 0, 0, .60)",
              visible: false  // only show textblocks when there is corresponding data for them
            },
            new go.Binding("visible", field, function(val) { return val !== undefined; })
          ];
        }

        let nodeDataArray = [];

        that.$store.dispatch('employees/index').then(result => {
          if (result.data) {
            let listEmployees = _.filter(result.data, function (item) {
              return !item.disable_status;
            });
            let node_item = '';
            listEmployees.forEach(function (item) {
              node_item = _.clone(that.default_node_item);

              node_item.key = item.id;
              if (item.nearest_manager) {
                node_item.boss = item.nearest_manager;
              } else {
                delete node_item.boss;
              }
              node_item.name = item.name;
              if (item.job_title_name) {
                node_item.title = item.job_title_name;
              } else {
                delete node_item.title;
              }
              if (item.department_name) {
                node_item.headOf = item.department_name;
              } else {
                delete node_item.headOf;
              }
              if (item.avatar) {
                node_item.img = item.avatar;
              } else {
                node_item.img = that.baseUrl + '/api/v1/image/default_avatar.png';
              }

              nodeDataArray.push(node_item);
            });
            var $ = go.GraphObject.make;  // for conciseness in defining templates

            // some constants that will be reused within templates
            var mt8 = new go.Margin(8, 0, 0, 0);
            var mr8 = new go.Margin(0, 8, 0, 0);
            var ml8 = new go.Margin(0, 0, 0, 8);
            var roundedRectangleParams = {
              parameter1: 2,  // set the rounded corner
              spot1: go.Spot.TopLeft, spot2: go.Spot.BottomRight  // make content go all the way to inside edges of rounded corners
            };

            let myDiagram =
              $(go.Diagram, "myDiagramDiv",  // the DIV HTML element
                {
                  // Put the diagram contents at the top center of the viewport
                  initialDocumentSpot: go.Spot.Top,
                  initialViewportSpot: go.Spot.Top,
                  // OR: Scroll to show a particular node, once the layout has determined where that node is
                  // "InitialLayoutCompleted": function(e) {
                  //  var node = e.diagram.findNodeForKey(28);
                  //  if (node !== null) e.diagram.commandHandler.scrollToPart(node);
                  // },
                  layout:
                    $(go.TreeLayout,  // use a TreeLayout to position all of the nodes
                      {
                        isOngoing: false,  // don't relayout when expanding/collapsing panels
                        treeStyle: go.TreeLayout.StyleLastParents,
                        // properties for most of the tree:
                        angle: 90,
                        layerSpacing: 80,
                        // properties for the "last parents":
                        alternateAngle: 0,
                        alternateAlignment: go.TreeLayout.AlignmentStart,
                        alternateNodeIndent: 80,
                        alternateNodeIndentPastParent: 1,
                        alternateNodeSpacing: 70,
                        alternateLayerSpacing: 40,
                        alternateLayerSpacingParentOverlap: 1,
                        alternatePortSpot: new go.Spot(0.001, 1, 20, 0),
                        alternateChildPortSpot: go.Spot.Left
                      })
                });

            // define the Node template
            myDiagram.nodeTemplate =
              $(go.Node, "Auto",
                {
                  locationSpot: go.Spot.Top,
                  isShadowed: true, shadowBlur: 1,
                  shadowOffset: new go.Point(0, 1),
                  shadowColor: "rgba(0, 0, 0, .14)",
                  selectionAdornmentTemplate:  // selection adornment to match shape of nodes
                    $(go.Adornment, "Auto",
                      $(go.Shape, "RoundedRectangle", roundedRectangleParams,
                        { fill: null, stroke: "#7986cb", strokeWidth: 3 }
                      ),
                      $(go.Placeholder)
                    )  // end Adornment
                },
                $(go.Shape, "RoundedRectangle", roundedRectangleParams,
                  { name: "SHAPE", fill: "#ffffff", strokeWidth: 0 },
                  // gold if highlighted, white otherwise
                  new go.Binding("fill", "isHighlighted", function(h) { return h ? "gold" : "#ffffff"; }).ofObject()
                ),
                $(go.Panel, "Vertical",
                  $(go.Panel, "Horizontal",
                    { margin: 8 },
                    $(go.Picture,  // flag image, only visible if a nation is specified
                      { margin: mr8, visible: false, desiredSize: new go.Size(50, 50) },
                      new go.Binding("source", "img"),
                      new go.Binding("visible", "img", function(img) { return img !== undefined; })
                    ),
                    $(go.Panel, "Table",
                      $(go.TextBlock,
                        {
                          row: 0, alignment: go.Spot.Left,
                          font: "16px Roboto, sans-serif",
                          stroke: "rgba(0, 0, 0, .87)",
                          maxSize: new go.Size(160, NaN)
                        },
                        new go.Binding("text", "name")
                      ),
                      $(go.TextBlock, textStyle("title"),
                        {
                          row: 1, alignment: go.Spot.Left,
                          maxSize: new go.Size(160, NaN)
                        },
                        new go.Binding("text", "title")
                      ),
                      $("PanelExpanderButton", "INFO",
                        { row: 0, column: 1, rowSpan: 2, margin: ml8 }
                      )
                    )
                  ),
                  $(go.Shape, "LineH",
                    {
                      stroke: "rgba(0, 0, 0, .60)", strokeWidth: 1,
                      height: 1, stretch: go.GraphObject.Horizontal
                    },
                    new go.Binding("visible").ofObject("INFO")  // only visible when info is expanded
                  ),
                  $(go.Panel, "Vertical",
                    {
                      name: "INFO",  // identify to the PanelExpanderButton
                      stretch: go.GraphObject.Horizontal,  // take up whole available width
                      margin: 8,
                      defaultAlignment: go.Spot.Left,  // thus no need to specify alignment on each element
                      visible: false,
                    },
                    $(go.TextBlock, textStyle("headOf"),
                      new go.Binding("text", "headOf", function(head) { return "Head of: " + head; })
                    ),
                    $(go.TextBlock, textStyle("boss"),
                      new go.Binding("margin", "headOf", function() { return mt8; }), // some space above if there is also a headOf value
                      new go.Binding("text", "boss", function(boss) {
                        var boss1 = myDiagram.model.findNodeDataForKey(boss);
                        if (boss1 !== null) {
                          return "Reporting to: " + boss1.name;
                        }
                        return "";
                      })
                    )
                  )
                )
              );

            // define the Link template, a simple orthogonal line
            myDiagram.linkTemplate =
              $(go.Link, go.Link.Orthogonal,
                { corner: 5, selectable: false },
                $(go.Shape, { strokeWidth: 3, stroke: "#424242" }));  // dark gray, rounded corner links

            // create the Model with data for the tree, and assign to the Diagram
            myDiagram.model =
              $(go.TreeModel,
                {
                  nodeParentKeyProperty: "boss",  // this property refers to the parent node data
                  nodeDataArray: nodeDataArray
                });

            // Overview
            $(go.Overview, "myOverviewDiv",  // the HTML DIV element for the Overview
              { observed: myDiagram, contentAlignment: go.Spot.Center });   // tell it which Diagram to show and pan

            that.$nuxt.$loading.finish();
          }
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_employee_view'));
          }
          that.$nuxt.$loading.finish();
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        });

      },

    },
  };
</script>

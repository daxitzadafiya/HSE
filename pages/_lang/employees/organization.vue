<template>
<!--  <div id="tree" ref="tree" class="organization-chart-custom"></div>-->

  <div id="sample" style="position: relative;">
    <div id="myDiagramDiv" style="background-color: #f2f2f2; border: solid 1px black; width: 100%; height: 700px"></div>
    <div id="myOverviewDiv"  style="position: absolute; width: 200px; height: 100px; top: 10px; left: 10px; background-color: #f2f2f2; z-index: 300; border: solid 1px #7986cb;"></div>
  </div>
</template>
<script>
  // import OrgChart from '@balkangraph/orgchart.js/orgchart';
  import {_} from 'vue-underscore';
  import go from 'gojs';

  export default {
    data: () => ({
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
      listParentDepartment: [],
      tags: [],
      nodeDataArray: [],
      default_node_item: {
        key: '',
        boss: '',
        name: '',
        title: '',
        headOf: '',
        img: '',
      }
    }),

    mounted(){
      var that = this;
      // that.$store.dispatch('departments/index', {parent: 'yes'}).then(result => {
      //   result.data.forEach(function (item) {
      //     that.tags[item.name] = {
      //       group: true,
      //       groupName: item.name,
      //       groupState: OrgChart.EXPAND,
      //       template: "group_grey"
      //     };
      //   });
      //   if (result.data){
      //     that.listParentDepartment = result.data;
      //     that.$store.dispatch('employees/index').then(result => {
      //       console.log(result.data);
      //       var data = result.data;
      //       if (data.length > 0){
      //         var node_item = '';
      //         var tag = [];
      //         data.forEach(function (item) {
      //           node_item = _.clone(that.default_node_item);
      //           tag = _.clone(that.default_tag);
      //           tag.push(item.department_name);
      //           node_item.id = item.id;
      //           // node_item.pid = that.listParentDepartment.find(x => x.name === item.department_name).parent_id;
      //           node_item.pid = item.department_parent;
      //           node_item.tags = tag;
      //           node_item.name = item.first_name + ' ' + item.last_name;
      //           node_item.title = item.job_title;
      //           node_item.img = item.avatar;
      //
      //           that.nodes.push(node_item);
      //         });
      //
      //         new OrgChart(document.getElementById("tree"), {
      //           template: "ana",
      //           enableSearch: false,
      //           nodeMouseClick: OrgChart.action.none,
      //           nodeBinding: {
      //             field_0: "name",
      //             field_1: "title",
      //             img_0: "img"
      //           },
      //           tags: Object.assign({}, that.tags),
      //           nodes: that.nodes,
      //         });
      //       }
      //     }).catch((error) => {
      //       that.$toaster.error(error.message || error.status);
      //     });
      //   }
      // }).catch((error) => {
      //   that.$toaster.error(error.message || error.status);
      // });


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
                  alternateNodeIndent: 15,
                  alternateNodeIndentPastParent: 1,
                  alternateNodeSpacing: 15,
                  alternateLayerSpacing: 40,
                  alternateLayerSpacingParentOverlap: 1,
                  alternatePortSpot: new go.Spot(0.001, 1, 20, 0),
                  alternateChildPortSpot: go.Spot.Left
                })
          });

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

      // define Converters to be used for Bindings
      // function theNationFlagConverter(nation) {
      //   return "https://www.nwoods.com/images/emojiflags/" + nation + ".png";
      // }

      let nodeDataArray = [];

      that.$store.dispatch('employees/index').then(result => {
        if (result.data) {
          let node_item = '';
          result.data.forEach(function (item) {
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
            }

            nodeDataArray.push(node_item);
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

          // set up the nodeDataArray, describing each person/position
          // nodeDataArray = [
          //   { key: 0, name: "Ban Ki-moon 반기문", nation: "SouthKorea", title: "Secretary-General of the United Nations", headOf: "Secretariat" },
          //   { key: 1, boss: 0, name: "Patricia O'Brien", nation: "Ireland", title: "Under-Secretary-General for Legal Affairs and United Nations Legal Counsel", headOf: "Office of Legal Affairs" },
          //   { key: 3, boss: 1, name: "Peter Taksøe-Jensen", nation: "Denmark", title: "Assistant Secretary-General for Legal Affairs" },
          //   { key: 9, boss: 3, name: "Other Employees" },
          //   { key: 4, boss: 1, name: "Maria R. Vicien - Milburn", nation: "Argentina", title: "General Legal Division Director", headOf: "General Legal Division" },
          //   { key: 10, boss: 4, name: "Other Employees" },
          //   { key: 5, boss: 1, name: "Václav Mikulka", nation: "CzechRepublic", title: "Codification Division Director", headOf: "Codification Division" },
          //   { key: 11, boss: 5, name: "Other Employees" },
          //   { key: 6, boss: 1, name: "Sergei Tarassenko", nation: "Russia", title: "Division for Ocean Affairs and the Law of the Sea Director", headOf: "Division for Ocean Affairs and the Law of the Sea" },
          //   { key: 12, boss: 6, name: "Alexandre Tagore Medeiros de Albuquerque", nation: "Brazil", title: "Chairman of the Commission on the Limits of the Continental Shelf", headOf: "The Commission on the Limits of the Continental Shelf" },
          //   { key: 17, boss: 12, name: "Peter F. Croker", nation: "Ireland", title: "Chairman of the Committee on Confidentiality", headOf: "The Committee on Confidentiality" },
          //   { key: 31, boss: 17, name: "Michael Anselme Marc Rosette", nation: "Seychelles", title: "Vice Chairman of the Committee on Confidentiality" },
          //   { key: 32, boss: 17, name: "Kensaku Tamaki", nation: "Japan", title: "Vice Chairman of the Committee on Confidentiality" },
          //   { key: 33, boss: 17, name: "Osvaldo Pedro Astiz", nation: "Argentina", title: "Member of the Committee on Confidentiality" },
          //   { key: 34, boss: 17, name: "Yuri Borisovitch Kazmin", nation: "Russia", title: "Member of the Committee on Confidentiality" },
          //   { key: 18, boss: 12, name: "Philip Alexander Symonds", nation: "Australia", title: "Chairman of the Committee on provision of scientific and technical advice to coastal States", headOf: "Committee on provision of scientific and technical advice to coastal States" },
          //   { key: 35, boss: 18, name: "Emmanuel Kalngui", nation: "Cameroon", title: "Vice Chairman of the Committee on provision of scientific and technical advice to coastal States" },
          //   { key: 36, boss: 18, name: "Sivaramakrishnan Rajan", nation: "India", title: "Vice Chairman of the Committee on provision of scientific and technical advice to coastal States" },
          //   { key: 37, boss: 18, name: "Francis L. Charles", nation: "TrinidadAndTobago", title: "Member of the Committee on provision of scientific and technical advice to costal States" },
          //   { key: 38, boss: 18, name: "Mihai Silviu German", nation: "Romania", title: "Member of the Committee on provision of scientific and technical advice to costal States" },
          //   { key: 19, boss: 12, name: "Lawrence Folajimi Awosika", nation: "Nigeria", title: "Vice Chairman of the Commission on the Limits of the Continental Shelf" },
          //   { key: 20, boss: 12, name: "Harald Brekke", nation: "Norway", title: "Vice Chairman of the Commission on the Limits of the Continental Shelf" },
          //   { key: 21, boss: 12, name: "Yong-Ahn Park", nation: "SouthKorea", title: "Vice Chairman of the Commission on the Limits of the Continental Shelf" },
          //   { key: 22, boss: 12, name: "Abu Bakar Jaafar", nation: "Malaysia", title: "Chairman of the Editorial Committee", headOf: "Editorial Committee" },
          //   { key: 23, boss: 12, name: "Galo Carrera Hurtado", nation: "Mexico", title: "Chairman of the Training Committee", headOf: "Training Committee" },
          //   { key: 24, boss: 12, name: "Indurlall Fagoonee", nation: "Mauritius", title: "Member of the Commission on the Limits of the Continental Shelf" },
          //   { key: 25, boss: 12, name: "George Jaoshvili", nation: "Georgia", title: "Member of the Commission on the Limits of the Continental Shelf" },
          //   { key: 26, boss: 12, name: "Wenzhang Lu", nation: "China", title: "Member of the Commission on the Limits of the Continental Shelf" },
          //   { key: 27, boss: 12, name: "Isaac Owusu Orudo", nation: "Ghana", title: "Member of the Commission on the Limits of the Continental Shelf" },
          //   { key: 28, boss: 12, name: "Fernando Manuel Maia Pimentel", nation: "Portugal", title: "Member of the Commission on the Limits of the Continental Shelf" },
          //   { key: 7, boss: 1, name: "Renaud Sorieul", nation: "France", title: "International Trade Law Division Director", headOf: "International Trade Law Division" },
          //   { key: 13, boss: 7, name: "Other Employees" },
          //   { key: 8, boss: 1, name: "Annebeth Rosenboom", nation: "Netherlands", title: "Treaty Section Chief", headOf: "Treaty Section" },
          //   { key: 14, boss: 8, name: "Bradford Smith", nation: "UnitedStates", title: "Substantive Legal Issues Head", headOf: "Substantive Legal Issues" },
          //   { key: 29, boss: 14, name: "Other Employees" },
          //   { key: 15, boss: 8, name: "Andrei Kolomoets", nation: "Russia", title: "Technical/Legal Issues Head", headOf: "Technical/Legal Issues" },
          //   { key: 30, boss: 15, name: "Other Employees" },
          //   { key: 16, boss: 8, name: "Other Employees" },
          //   { key: 2, boss: 0, name: "Heads of Other Offices/Departments" }
          // ];

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

        }
      }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
        that.$toaster.error(that.$i18n.t('message.fail_employee_view'));
          }
        // that.$toaster.error(error.message || error.status);
      });

    },

    methods: {
    },
  };
</script>

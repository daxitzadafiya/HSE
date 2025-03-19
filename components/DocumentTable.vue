<template>
  <div>
  
    <ReviewDocumentPopup
      :open-popup="checkShowItem"
      :industry-array="industryArray"
      :resource="checkResource"
      :document-item="editedItem"
      :categories-array="categoriesArray"
      :category-type="categoryType"
      :category-added-from="categoryAddedFrom"
      :view-only="tableTitle === 'Attachment' || tableTitle === 'Report'"
      :predefined-link-array="predefinedLinkArray"
      @closePopup="checkShowItem = !checkShowItem"
      @resourceList="resourceList"
      @reloadList="reloadList"
      @reloadListCategory="reloadListCategory"
      @updateResource="updateResource"
      @changeTab="changeTab"
    />

    <AttachmentPopup
      :open-attachment-popup="checkAttachmentOpen"
      :attachment-item="attachmentItem ? attachmentItem : imageItem"
      :view-only="true"
      @closePopup="checkAttachmentOpen = !checkAttachmentOpen"
      @reloadList="reloadList"
    />
    <v-data-table
      :headers="computedHeaders"
      :items="listArray"
      class="elevation-1 hse-table attachment-table table-data"
      :items-per-page="15"
      :single-expand="true"
      :search="search_value"
      :sort-by="['created_at']"
      :sort-desc="[true, false]"
      :expanded.sync="expanded"
      @click:row="editItem"
      hide-default-footer
    >
      <template v-slot:top>
        <div v-if="!noFilterSetting" class="setting-header">
          <div class="panel-heading">
            <h4 class="panel-title">
              {{ $t('title.sort_by') }}
            </h4>
            <!--            <b-row>-->
            <!--              <b-col cols="6">-->
            <!--                <div class="field-selection">-->
            <!--                  <v-select-->
            <!--                    v-model="category"-->
            <!--                    :items="categoriesSelection"-->
            <!--                    item-text="name"-->
            <!--                    item-value="id"-->
            <!--                    label="Category"-->
            <!--                    outlined-->
            <!--                  />-->
            <!--                </div>-->
            <!--              </b-col>-->
            <!--              <b-col cols="6">-->
            <!--                <date-range-picker-->
            <!--                  ref="picker"-->
            <!--                  :opens="opens"-->
            <!--                  :locale-data="localData"-->
            <!--                  :singleDatePicker="singleDatePicker"-->
            <!--                  :timePicker="timePicker"-->
            <!--                  :timePicker24Hour="timePicker24Hour"-->
            <!--                  :showWeekNumbers="showWeekNumbers"-->
            <!--                  :showDropdowns="showDropdowns"-->
            <!--                  :autoApply="autoApply"-->
            <!--                  v-model="dateRange"-->
            <!--                  :linkedCalendars="linkedCalendars"-->
            <!--                  :alwaysShowCalendars="alwaysShowCalendars"-->
            <!--                  class="range-picker-custom"-->
            <!--                >-->
            <!--                  <template v-slot:input="picker">-->
            <!--                    <div v-if="picker.startDate">-->
            <!--                      {{moment(picker.startDate).format('DD.MM.YYYY') }} - {{ moment(picker.endDate).format('DD.MM.YYYY') }}-->
            <!--                    </div>-->
            <!--                    <div v-else>All</div>-->
            <!--                  </template>-->
            <!--                </date-range-picker>-->
            <!--              </b-col>-->
            <!--            </b-row>-->
            <b-row>
              <b-col cols="12">
                <div class="input-wrap field-search">
                  <v-text-field
                    append-icon="search"
                    :label="$t('setting.search')"
                    outlined
                    class="text-box"
                    @input="textFeild"
                  >
                    <template v-slot:append>
                      <img src="../assets/images/icon/magnifier.png" class="search-icon-cust">
                    </template>
                  </v-text-field> 
                </div>
              </b-col>
            </b-row>
          </div>
          <div class="panel-footer text-right"></div>
        </div>
      </template>
      <template v-slot:item.id="{ index }">
    {{ index + 1 }}
    </template>
      <template v-slot:header="{ props: { headers } }">
        <h4 v-if="tableTitle" class="table-name">
          <span v-if="tableTitle === 'Document' && !resource">{{
            $t('table.documents')
          }}</span>
          <span v-if="tableTitle === 'Document' && resource">{{
            $t('table.resources')
          }}</span>
          <span v-if="tableTitle === 'Attachment'">{{
            $t('table.attachments')
          }}</span>
          <span v-if="tableTitle === 'Report'">{{ $t('table.reports') }}</span>
        </h4>
      </template>
      <template v-slot:item.function="{ item }">
        <span v-if="item.task_id && item.routine_id == null">Task</span>
        <span v-else-if="item.routine_id && (item.task_id || item.task_id == null)">Routine</span>
        <span v-else>Document</span>
      </template>
      <!-- <template v-slot:item.responsible="{ item }">
        IT-Manager
        {{item.employeeName}}
      </template> -->
      <template v-slot:item.responsible="{ item}">
        <v-hover v-slot:default="{ hover }" :disabled="item?.responsible?.employeeName?.length == 0" v-if="item?.responsible?.employeeName?.length > 0">
          <v-badge :value="hover" transition="slide-x-transition" class="responsible-badge">
            <span slot="badge">{{ $t('message.responsible')+':'+ item?.responsible?.employeeName}}</span>
            {{item?.responsible?.employeeName?.[0]}}
          </v-badge>
        </v-hover>
        <!-- <div v-else>

        {{item.added_by_name}}
        </div> -->
      </template>
      <template v-slot:item.status="{ item }">
        <span v-if="item.status === 0">Draft</span>
        <span v-if="item.status === 1">Published</span>
      </template>
      <template v-slot:item.type_of_attachment="{ item }">
        {{ formatType(item.type_of_attachment) }}
      </template>
      <template v-slot:item.added_by_name="{ item }">
        <span v-if="item.added_by === 1">{{ $t('table.system') }}</span>
        <span v-else>{{ item.added_by_name }}</span>
      </template>
      <template v-slot:item.added_date="{ item }">
        <span>
          {{ moment(item.created_at).format('DD.MM.YYYY') }}
        </span>
        <!-- <span v-if="item.start_time !== null && item.deadline !== null">
          {{ moment(item.start_time).format('DD.MM.YYYY') }} / {{ moment(item.deadline).format('DD.MM.YYYY') }}
        </span>
        <span v-else-if="item.start_time !== null && item.deadline === null">
          {{ moment(item.start_time).format('DD.MM.YYYY') }} / -
        </span>
        <span v-else-if="item.start_time === null && item.deadline !== null">
          - / {{ moment(item.deadline).format('DD.MM.YYYY') }}
        </span> -->
      </template>
      <template v-slot:item.is_suggestion="{ item }">
        <span class="indexed-item indexed-yes" v-if="item.is_suggestion === 1">
          {{ $t('table.yes') }}
        </span>
        <span class="indexed-item indexed-no" v-else>
          {{ $t('table.no') }}
        </span>
      </template>

      <template v-slot:item.see_more="{item}">
        <!-- <img class="icon-img" v-if="item.item.type_of_attachment === 2" src="../assets/images/gridIcon/note.png" alt="note.png"/> -->
        <!-- <img class="icon-img" small v-else-if="item.item.type_of_attachment === 1" src="../assets/images/gridIcon/fillNote.png" alt="fillNote.png"/> -->
        
        <v-hover v-if="(item.type_of_attachment==2)" v-slot:default="{ hover }">
          <v-badge :value="hover" right transition="slide-x-transition" class="hse--icon-question-circle hover-label">
            <!-- <span slot="badge">{{ item.item.type_of_attachment === 2 ? $t('message.attachment'): $t('message.note')}}</span> -->
            <span slot="badge">{{ $t('message.note')}}</span>
            <img class="icon-img" src="../assets/images/gridIcon/fillNote.png" alt="fillNote.png" @click.stop/>
          </v-badge>
        </v-hover>
         <v-hover v-else v-slot:default="{ hover }">
          <v-badge :value="hover" right transition="slide-x-transition" class="hse--icon-question-circle hover-label">
            <span slot="badge">{{ $t('message.attachment')}}</span>
            <img class="icon-img" src="../assets/images/gridIcon/Attachment.png" alt="Attachment.png" @click.stop/>
          </v-badge>
        </v-hover>
        <v-hover v-slot:default="{ hover }" v-if="item.security">
          <v-badge :value="hover" right transition="slide-x-transition" class="hse--icon-question-circle hover-label">
            <span slot="badge">{{ item.security.is_shared==0 ? $t('message.personal')  : $t('message.shared') }}</span>
            <img class="icon-img" src="../assets/images/gridIcon/fillSecurity.png" alt="fillSecurity.png" @click.stop/>
          </v-badge>
        </v-hover>
        <v-hover v-slot:default="{ hover }" v-else>
          <v-badge :value="hover" right transition="slide-x-transition" class="hse--icon-question-circle hover-label">
            <span slot="badge">{{$t('message.personal')}}</span>
            <img class="icon-img" src="../assets/images/gridIcon/fillSecurity.png" alt="fillSecurity.png" @click.stop/>
          </v-badge>
        </v-hover>
       
        <v-hover v-slot:default="{ hover }">
          <v-badge :value="hover" right transition="slide-x-transition" class="hse--icon-question-circle hover-label">
            <span slot="badge">{{ $t('message.connect_to') }}</span>
            <img class="active-index-img" src="../assets/images/gridIcon/fill_con_to_object.png" alt="fill_con_to_object.png" @click.stop="clickConnectToObject(item)"/>
          </v-badge>
        </v-hover>
        <!-- <v-hover v-else v-slot:default="{ hover }">
          <v-badge :value="hover" right transition="slide-x-transition" class="hse--icon-question-circle hover-label">
            <span slot="badge">{{ $t('message.connect_to') }}</span>
            <img class="index-img" src="../assets/images/gridIcon/fill_con_to_object.png" alt="fill_con_to_object.png" @click.stop/>
          </v-badge>
        </v-hover> -->
        <!-- <img v-else-if="item.object_type != null" src="../assets/images/gridIcon/fill_con_to_object.png" alt="fill_con_to_object.png"/> -->

        <v-hover v-if="(item.is_reminder==0)" v-slot:default="{ hover }">
          <v-badge :value="hover" right transition="slide-x-transition" class="hse--icon-question-circle hover-label-time">
            <span slot="badge">{{ $t('message.reminder') }}</span>
            <img class="index-img" src="../assets/images/gridIcon/fillReminder.png" alt="fillReminder.png" @click.stop/>
          </v-badge>
        </v-hover>
        <v-hover v-if="(item.is_reminder==1)" v-slot:default="{ hover }">
          <v-badge :value="hover" left transition="slide-x-transition" class="hse--icon-question-circle hover-label-time">
            <span slot="badge">{{moment(item.start_date).format('DD.MM.YYYY')}}-{{moment(item.deadline).format('DD.MM.YYYY')}}</span>
            <img class="active-index-img" src="../assets/images/gridIcon/fillReminder.png" alt="fillReminder.png" @click.stop/>
          </v-badge>
        </v-hover>

        <!-- <v-hover v-if="(item.is_suggestion==0)" v-slot:default="{ hover }">
          <v-badge :value="hover" right transition="slide-x-transition" class="hse--icon-question-circle hover-label">
            <span slot="badge">{{ $t('message.index') }}:no</span>
            <img class="index-img" src="../assets/images/gridIcon/Index.png" alt="Index.png" @click.stop >
          </v-badge>
        </v-hover>
        <v-hover v-else v-slot:default="{ hover }">
          <v-badge :value="hover" right transition="slide-x-transition" class="hse--icon-question-circle hover-label">
            <span slot="badge">{{ $t('message.index') }}:yes</span>
            <img class="active-index-img"  src="../assets/images/gridIcon/Index.png" alt="fillReminder.png" @click.stop/>
          </v-badge>
        </v-hover> -->
      </template>
      <template v-if='is_connect' v-slot:expanded-item="{ headers, item }">
        <td :colspan="9" class="py-4 px-8">
          <v-card class="pt-0 expand-pedding">
            <v-data-table 
              :headers="expandTableHeaders"
              :items="connectToObject"
              :hide-default-footer="true"
              class="expand-table"
            >
               <template v-slot:item.connected_date="{ item }">
                  {{ moment(item.connected_date).format('DD.MM.YYYY') }}
                </template>
            </v-data-table>
          </v-card>  
        </td>
      </template>
      <template v-slot:no-data>
        {{ $t('table.no_data') }}
      </template>
    </v-data-table>
  </div>
</template>

<script>
import ReviewDocumentPopup from './ReviewDocumentPopup.vue'
import cookies from 'js-cookie'
import AttachmentPopup from './AttachmentPopup'
import { _ } from 'vue-underscore'
import api from '~/apis'

export default {
  name: 'DocumentTable',
  components: {
    ReviewDocumentPopup,
    AttachmentPopup
  },
  props: {
    resource: {
      type: Boolean,
      required: false
    },
    categoriesArray: {
      type: Array,
      required: false
    },
    categoriesSelection: {
      type: Array,
      required: false
    },
    categoryAddedFrom: {
      type: Number,
      required: false
    },
    categoryType: {
      type: String,
      required: false
    },
    listArrayInput: Array,
    industryArray: {
      type: Array,
      required: false
    },
    noFilterSetting: {
      type: Boolean,
      required: false
    },
    attachmentItem: {
      type: Object,
      required: false
    },
    tableTitle: {
      type: String,
      required: false
    },
    objectId: {
      type: String,
      required: false
    },
    predefinedLinkArray: {
      type: Array,
      required: false
    },
    search_value:{
        type: String,
        required: false,
      }
  },
  data: () => ({
    fillNoteHover: false,
    is_connect:false,
    permissionsUser: localStorage.getItem('permissionsKey'),
    checkAdmin: cookies.get('checkAdmin'),
    userRoleId: parseInt(cookies.get('roleID')),
    // roleUser: cookies.get('roleUser'),
    // nowDate: new Date().toISOString().substr(0, 10),
    // search: '',
    listArray: [],
    expanded: [],
    editedItem: {
      industry_id: '',
      industry_id_arr: [],
      name: '',
      description: '',
      parent_id: '',
      type_of_attachment: 2,
      type: 'Attachment',
      object_type: '',
      category_id: '',
      is_public: false,
      is_renewed: false,
      renewed_employee_array: '',
      renewed_employee_array_arr: [],
      deadline: '',
      deadline_pre: '',
      show_manager: false,
      security_department_array: '',
      security_project_array: '',
      security_employee_array: '',
      security_department_array_arr: [],
      security_project_array_arr: [],
      security_employee_array_arr: [],
      count_related_object: 0,
      related_objects: [],
      parent_object: '',
      editPermission: true
    },
    checkShowItem: false,
    checkResource: false,
    checkAttachmentOpen: false,

    // filter by date
    opens: 'right',
    singleDatePicker: false,
    timePicker: false,
    timePicker24Hour: true,
    showWeekNumbers: false,
    showDropdowns: '',
    autoApply: false,
    dateTest: new Date(),
    dateRange: {
      startDate: false,
      endDate: false
    },
    linkedCalendars: '',
    alwaysShowCalendars: '',
    localData: {
      monthNames: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ],
      firstDay: 1
    },

    // filter by
    category: 0,

    // attachment popup
    imageItem: {},

    expandTableHeaders: [
      {
        text: 'Name',
        align: 'start',
        value: 'name',
      },
      { text: 'Source', align: 'center', value: 'source' },
      { text: 'Category', align: 'center', value: 'category' },
      { text: 'Added by', align: 'center', value: 'added_by' },
      { text: 'Connected by', align: 'center', value: 'connected_by' },
      { text: 'Connected date', align: 'center', value: 'connected_date' },
    ],
    connectToObject: [
      {
        name: 'Frozen Yogurt',
        source: 159,
        category: 6.0,
        added_by: 24,
        connected_by: 4.0,
        connected_date: '1%',
      },
      {
        name: 'Frozen Yogurt',
        source: 159,
        category: 6.0,
        added_by: 24,
        connected_by: 4.0,
        connected_date: '1%',
      },
      {
        name: 'Frozen Yogurt',
        source: 159,
        category: 6.0,
        added_by: 24,
        connected_by: 4.0,
        connected_date: '1%',
      },
    ],
  }),

  computed: {
    headers() {
      return [
        { text: this.translateCol('id'), value: 'id', align: 'left',width:"3%",sortable: false},
        { text: this.translateCol('name'), value: 'name', align: 'left',width:"15%"},
        { text: this.translateCol('category'),value: 'category_name',align: 'center',width:"15%"},
        { text: this.translateCol('function'),value: 'function',align: 'center',width:"10%"},
        { text: this.translateCol('added_by'),value: 'added_by_name',align: 'center',width:"15%"},
        { text: this.translateCol('responsible'),value: 'responsible',align: 'center',width:"12%"},
        { text: this.translateCol('added_on'),value: 'added_date',align: 'center'},
        { text: this.translateCol('see_more'),value: 'see_more',align: 'center',sortable: false}
      ]
    },
    headersTemplate() {
      return [
        { text: this.translateCol('name'), align: 'left', value: 'name' },
        {
          text: this.translateCol('type'),
          align: 'center',
          value: 'type_of_attachment'
        },
        {
          text: this.translateCol('added_by'),
          align: 'center',
          value: 'added_by_name'
        },
        {
          text: this.translateCol('category'),
          align: 'center',
          value: 'category_name'
        },
        { text: this.translateCol('status'), align: 'left', value: 'status' }
        // {text: this.translateCol('number_of_times_used'), value: 'count_related_object', align: 'center'},
      ]
    },
    headersReport() {
      return [
        { text: this.translateCol('name'), align: 'left', value: 'name' },
        {
          text: this.translateCol('added_by'),
          align: 'center',
          value: 'added_by_name'
        }
      ]
    },
    headersAdmin() {
      return [
        { text: this.translateCol('name'), align: 'left', value: 'name' },
        {
          text: this.translateCol('type'),
          align: 'center',
          value: 'type_of_attachment'
        },
        {
          text: this.translateCol('category'),
          align: 'center',
          value: 'category_name'
        },
        { text: this.translateCol('status'), align: 'left', value: 'status' }
        // {text: this.translateCol('number_of_times_used'), value: 'count_related_object', align: 'center'},
      ]
    },
    computedHeaders() {
      let result
      if (this.userRoleId === 1) {
        result = this.headersAdmin
      } else {
        if (this.tableTitle === 'Report') {
          result = this.headersReport
        } else if (this.tableTitle === 'Document') {
          if (this.checkResource) {
            result = this.headersTemplate
          } else {
            result = this.headers
          }
        } else {
          result = this.headers
        }
      }
      return result
    }

    // filteredItems() {
    //   let that = this;
    //   return that.listArray.filter((item) => {
    //     return ((that.category === 0 || item.category_id === that.category)
    //       && (that.type === 'All' || item.type === that.type)
    //       && (that.added_by === 0 || item.added_by === that.added_by)
    //       && (!that.dateRange.startDate || (that.dateRange.startDate && that.moment(that.dateRange.startDate)
    //         <= that.moment(item.updated_at))  && (!that.dateRange.endDate || (that.dateRange.endDate && that.moment(that.dateRange.endDate) >= that.moment(item.updated_at)))));
    //   });
    // },
  },

  watch: {
    listArrayInput(value) {
      if (value) {
        this.listArray = value
      }
    },

    listArray: {
      handler: 'getObject',
      immediate: true
    },

    objectId(value) {
      if (value) {
        this.getObject()
      }
    },

    resource(value) {
      if (value) {
        this.checkResource = value
      }
    }
  },

  created() {
    if (this.listArrayInput.length > 0) {
      this.listArray = this.listArrayInput
    }

    if (this.resource) {
      this.checkResource = this.resource
    }  
  },

  methods: {
    textFeild(text){
      if (this.checkResource) {
        this.$emit('textFilterResource',text);
        
      }else{
        
        this.$emit('textFilter',text);
        }
      },
    translateCol(colName) {
      return this.$i18n.t('column.' + colName)
    },
    getObject() {
      let that = this
      if (that.objectId) {
        _.each(that.listArray, function(item) {
          if (item.id === parseInt(that.objectId)) {
            that.editItem(item)
            let query = Object.assign({}, that.$route.query)
            delete query.id
            that.$router.replace({ query })
          }
        })
      }
    },
    showItem(item) {
      this.editItem(item)
    },

    reloadList() {
      this.$emit('reloadList')
    },
    resourceList() {
      this.$emit('resourceList')
    },

    reloadListCategory() {
      this.$emit('reloadListCategory')
    },

    editItem(item) {
      this.editedItem = Object.assign({}, item)
      // if (item.category_id === 8 || item.category_id === 9) {
      //   // logo / avatar
      //   this.showAttachment(item)
      // } else {
        this.checkShowItem = true
      // }
    },

    showAttachment(item) {
      if (this.tableTitle === 'Attachment') {
        if (item.object_type === 'company') {
          this.$store
            .dispatch('companies/show', item.object_id)
            .then((result) => {
              this.imageItem = result.data
            })
           .catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
              this.$toaster.error(
                this.$i18n.t('message.fail_company_view_detail')
              )
              }
              // this.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
              this.$nuxt.$loading.finish()
            })
        } else if (item.object_type === 'employee') {
          this.$store
            .dispatch('employees/show', item.object_id)
            .then((result) => {
              this.imageItem = result.data
              if (!this.imageItem.avatar) {
                this.imageItem.avatar =
                  this.baseUrl + '/api/v1/image/default_avatar.png'
              }
            })
           .catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
              this.$toaster.error(
                this.$i18n.t('message.fail_employee_view_detail')
              )
              }
              // this.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
              this.$nuxt.$loading.finish()
            })
        }
      }
      this.checkAttachmentOpen = true
    },

    updateResource(value) {
      this.checkResource = value
    },

    formatType(type) {
      if (type === 1) {
        return 'Attachment'
      } else if (type === 2) {
        return 'Note'
      }
    },

    changeTab(value) {
      this.$emit('changeTab', value)
    },
    clickConnectToObject(item) {
      this.is_connect=!this.is_connect;
      this.expanded = []
      // this.connectToObject=[]
      const indexExpanded = this.expanded.findIndex((i) => i === item)
      if (indexExpanded > -1) {
        this.expanded.splice(indexExpanded, 1)
      } else {
          this.expanded.push(item)
        if (this.is_connect) { 
          api.documents.connect(item.id)
          .then(result => {
            let respo = result.data.data
            console.log(respo);
            // if (respo.length > 0) {
            //   respo.forEach(el => {
            //     this.connectToObject.push({
            //       name:el.objectName,
            //       source:el.connect_to_source,
            //       category:el.categoryName,
            //       added_by:el.addedByUser,
            //       connected_by:el.connectedByUser,
            //       connected_date:el.created_at
            //     })
            //   });
            // } else {
            //   this.connectToObject=[]
            // }
    
          })   
          .catch((error) => {
                 console.log(error);
                })
          }
        }
    }
  }
}
</script>

<style scoped>
::v-deep .v-data-table>.v-data-table__wrapper tbody tr.v-data-table__expanded__content{
  box-shadow: none !important;
}

::v-deep .v-sheet.v-card:not(.v-sheet--outlined){
  box-shadow: none !important;
  border: 1px solid #E0E0E0;
}
::v-deep .expand-pedding .v-data-table .v-data-table__wrapper{
  padding-top: 0 !important;
}
::v-deep .expand-table tr{
  color: #5B5D53 !important;
}

::v-deep .v-badge__wrapper{
  width: 0 !important;
  /* transform: translateX(-50%); */
}
.icon-img{
  /* filter: grayscale(1); */
}
.icon-img:hover{
  filter: none;
}
.active-index-img:hover{
  filter: none;
}
.active-index-img{

  width: 25px;
  height: 25px;
}
.index-img{
  width: 25px;
  height: 25px;
    filter: grayscale(1);

}
:deep(.hover-label .v-badge__badge){
  inset: auto auto calc(100% - 0px) calc(100% - 30px) !important;
}
:deep(.hover-label-time .v-badge__badge){
  inset:auto auto calc(100% - 0px) calc(100% - 65px) !important;
}
:deep(.responsible-badge .v-badge__badge){
  inset:auto auto calc(121% - 5px) calc(-98% - 82px) !important;
  width: 305px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    background-color: #666768 !important;
}
</style>

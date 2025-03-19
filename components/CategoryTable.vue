<template>
  <div>
    <CategoryPopup
      :open-popup="checkShowItem"
      :category-item="editedItem"
      :category-type="categoryType"
      :industry-array="industryArray"
      @closePopup="checkShowItem = !checkShowItem"
      @reloadList="reloadList"
      @showItem="showItem"
    />

    <v-data-table
      :headers="computedHeaders"
      :items="categoryType === 5 ? filteredAttachmentCategoryItems : filteredItems"
      class="elevation-1 hse-table table-data"
      :items-per-page="15"
      :single-expand="true"
      :search="search"
      :sort-by="['created_at']"
      :sort-desc="[true, false]"
      @click:row="editItem"
    >
      <template v-if="categoryType === 5" v-slot:item.added_from="{ item }">
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
                <div class="field-selection field-search">
                  <v-text-field
                    v-model="search"
                    append-icon="search"
                    :label="$t('setting.search')"
                    outlined
                    class="text-box"
                  >
                    <template v-slot:append>
                      <img src="../assets/images/icon/magnifier.png" class="search-icon-cust">
                    </template>
                  </v-text-field> 
                </div>
              </b-col>
              <b-col v-if="categoryType === 5" cols="6">
                <div class="field-selection">
                  <v-select
                    v-model="addedFrom"
                    item-text="name"
                    item-value="id"
                    :items="categoryAttachmentAddedFromArray"
                    label="From"
                    outlined
                    class="text-box"
                  />
                </div>
              </b-col>
            </b-row>
          </div>
          <div class="panel-footer text-right">
            <!--<a type="button" class="btn btn-default" @click="addNewGoal"> New goal</a>-->
          </div>
        </div>
      </template>

      <template v-slot:header="{ props: { header } }">
        <h4 class="table-name">
          {{ $t('table.categories') }}
        </h4>
      </template>
      <template v-slot:item.added_by_name="{ item }">
        <span v-if="item.added_by === 1">{{ $t('table.system') }}</span>
        <span v-else>{{ item.added_by_name }}</span>
      </template>
      <template v-slot:no-data>
        {{ $t('table.no_data') }}
      </template>
    </v-data-table>
  </div>
</template>

<script>
  import cookies from "js-cookie";
  import {_} from "vue-underscore";
  import CategoryPopup from "./CategoryPopup";

  export default {
    name: "CategoryTable",
    components: {
      CategoryPopup,
    },
    props: {
      listArrayInput: Array,
      categoryType: {
        type: Number,
        required: false,
      },
      industryArray: {
        type: Array,
        required: false,
      },
      categoryId: {
        type: String,
        required: false,
      }
    },
    data: () => ({
      permissionsUser: localStorage.getItem('permissionsKey'),
      userRoleId: parseInt(cookies.get('roleID')),
      checkSuperAdmin: cookies.get('checkSuperAdmin'),
      checkAdmin: cookies.get('checkAdmin'),
      search: '',
      valid: true,
      required: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else return true;
        }
      ],
      editedItem: {
        name: "",
        type: "",
        added_from: "",
        added_by: "",
        disable_status: "",
        is_primary: false,
      },
      defaultItem: {
        name: "",
        type: "",
        added_from: "",
        added_by: "",
        disable_status: "",
        is_primary: false,
      },
      tab_categories_added_from: 0, // tab Categories - Category added from
      listArray: [],
      checkShowItem: false,
      categoryAttachmentAddedFromArray:[
        {name: "All", id: 0},
        {name: 'Company', id: 1},
        {name: 'Contact', id: 2},
        {name: 'Employee', id: 3},
      ],
      addedFrom: 0,
    }),

    computed: {
      headers() {
        return [
          {text: this.translateCol('name'), align: 'left', value: 'name'},
          {text: this.translateCol('added_by'), align: 'center', value: 'added_by_name'},
        ];
      },

      headersAttachment() {
        return [
          {text: this.translateCol('name'), align: 'left', value: 'name'},
          {text: this.translateCol('from'), align: 'left', value: 'added_from'},
          {text: this.translateCol('added_by'), align: 'center', value: 'added_by_name'},
        ];
      },

      headersAdmin() {
        return [
          {text: this.translateCol('name'), align: 'left', value: 'name'},
        ];
      },

      headersAttachmentAdmin() {
        return [
          {text: this.translateCol('name'), align: 'left', value: 'name'},
          {text: this.translateCol('from'), align: 'left', value: 'added_from'},
        ];
      },

      filteredItems() {
        let that = this;
        return that.listArray.filter((item) => {
          if (that.categoryType === 0)
            return item.type === 'goal';
          if (that.categoryType === 1)
            return item.type === 'routine';
          if (that.categoryType === 2)
            return item.type === 'instruction';
          if (that.categoryType === 3)
            return item.type === 'document';
          if (that.categoryType === 4)
            return item.type === 'contact';
          if (that.categoryType === 5)
            return item.type === 'attachment';
          if (that.categoryType === 6)
            return item.type === 'checklist';
          if (that.categoryType === 7)
            return item.type === 'deviation';
          if (that.categoryType === 8)
            return item.type === 'risk';
          if (that.categoryType === 9)
            return item.type === 'task';
        });
      },

      filteredAttachmentCategoryItems() {
        let that = this;
        return that.listArray.filter((item) => {
          return ((that.addedFrom === 0 || (item.added_from === that.addedFrom))
            && (item.type === 'attachment'));
        });
      },

      computedHeaders () {
        let result;
        if (this.checkSuperAdmin) {
          if (this.categoryType === 5) {
            result = this.headersAttachmentAdmin;
          } else {
            result = this.headersAdmin;
          }
        } else {
          if (this.categoryType === 5) {
            result = this.headersAttachment;
          } else {
            result = this.headers;
          }
        }
        return result;
      },
    },

    watch: {
      categoriesValidArray: {
        handler: 'getCategoryObject',
        immediate: true,
      },

      listArrayInput(value) {
        if (value) {
          this.listArray = value;
        }
      },
    },

    created() {
      if (this.listArrayInput.length > 0) {
        this.listArray = this.listArrayInput;
      }
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

      showItem(item) {
        this.editItem(item);
      },

      editItem(item) {
        this.editedItem = Object.assign({}, item);
        this.checkShowItem = true;
      },

      reloadList() {
        this.$emit('reloadList');
      },

      formatAddedFromAttachment(added_from) {// tab Categories - Format added from attachment
        if (added_from === 1) {
          return this.$i18n.t('table.company');
        } else if (added_from === 2) {
          return this.$i18n.t('table.contact');
        } else if (added_from === 3) {
          return this.$i18n.t('table.employee');
        }
      },
    }
  };

</script>

<style scoped>

</style>

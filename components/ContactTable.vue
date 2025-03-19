<template>
  <div>
    <ContactPopup
      :open-popup="checkShowItem"
      :contact-item="editedItem"
      :categories-array="categoriesArray"
      @closePopup="checkShowItem = !checkShowItem"
      @reloadList="reloadList"
      @reloadListCategory="reloadListCategory"
      @showItem="showItem"
    />
    <v-data-table
      :headers="computedHeaders"
      :items="filteredItems"
      class="elevation-1 hse-table table-data"
      :items-per-page="15"
      :single-expand="true"
      :search="search"
      :sort-by="['created_at']"
      :sort-desc="[true, false]"
      @click:row="viewItem"
    >
      <template v-slot:top>
        <div v-if="!noFilterSetting" class="setting-header">
          <div class="panel-heading">
            <h4 class="panel-title">
              {{ $t('title.sort_by') }}
            </h4>
            <!-- Super ADMIN -->
            <b-row v-if="checkSuperAdmin">
              <b-col cols="6">
                <div class="field-selection">
                  <v-select
                    v-model="category"
                    :items="categoriesSelection"
                    item-text="name"
                    item-value="id"
                    :label="$t('setting.category')"
                    outlined
                    class="text-box"
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
                    class="text-box"
                  >
                    <template v-slot:append>
                      <img src="../assets/images/icon/magnifier.png" class="search-icon-cust">
                    </template>
                  </v-text-field> 
                </div>
              </b-col>
            </b-row>
            <!-- Company -->
            <b-row v-else>
              <b-col cols="4">
                <div class="field-selection">
                  <v-select
                    v-model="category"
                    :items="categoriesSelection"
                    item-text="name"
                    item-value="id"
                    :label="$t('setting.category')"
                    outlined
                    class="text-box"
                  />
                </div>
              </b-col>
              <b-col cols="4">
                <div class="field-selection">
                  <v-select
                    v-model="added_by"
                    :label="$t('setting.added_by')"
                    item-text="name"
                    item-value="value"
                    :items="addedByResource"
                    outlined
                    class="text-box"
                  />
                </div>
              </b-col>
              <b-col cols="4">
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
            </b-row>
          </div>
          <div class="panel-footer text-right">
            <!--                  <a type="button" class="btn btn-default" @click="addNewGoal"> New goal</a>-->
          </div>
        </div>
      </template>

      <template v-slot:header="{ props: { headers } }">
        <h4 v-if="noFilterSetting" class="table-name">
          {{ $t('table.partners') }}
        </h4>
        <h4 v-else class="table-name">
          {{ $t('table.contacts') }}
        </h4>
      </template>

      <template v-slot:item.count_attachment="{ item }">
        <div v-if="item.count_attachment && !noFilterSetting">
          {{ item.count_attachment }}
        </div>
        <div v-else>
          0
        </div>
      </template>
      <template v-slot:item.added_by_name="{ item }">
        <span v-if="item.added_by === 1">{{ $t('table.system') }}</span>
        <span v-else>{{ item.added_by_name }}</span>
      </template>
      <template v-slot:item.is_suggestion="{ item }">
        <span class="indexed-item indexed-yes" v-if="item.is_suggestion === 1">
          {{ $t('table.yes') }}
        </span>
        <span class="indexed-item indexed-no" v-else>
          {{ $t('table.no') }}
        </span>
      </template>

      <template v-slot:no-data>
        {{ $t('table.no_data') }}
      </template>
    </v-data-table>
  </div>
</template>

<script>
  // import {_} from 'vue-underscore';
  // import moment from 'moment';
  import ContactPopup from "./ContactPopup";

  import cookies from "js-cookie";

  export default {
    name: "ContactTable",
    components: {
      ContactPopup,
    },
    props: {
      categoriesArray: {
        type: Array,
        required: false,
      },
      categoriesSelection: {
        type: Array,
        required: false,
      },
      listArrayInput: {
        type: Array,
        required: true,
      },
      noFilterSetting: {
        type: Boolean,
        required: false,
      },
      viewOnly: {
        type: Boolean,
        required: false,
      },
    },
    data: () => ({
      permissionsUser: localStorage.getItem('permissionsKey'),
      checkSuperAdmin: cookies.get('checkSuperAdmin'),
      checkAdmin: cookies.get('checkAdmin'),
      roleUser: cookies.get('roleUser'),
      search: '',
      listArray: [],
      editedItem: {
        name: '',
        category_id: "",
        phone_number: '',
        email: '',
        address: '',
        city: '',
        zip_code: '',
        organization_number: "",
        is_template: false
      },
      company_id: '',
      added_by: 0,
      addedByResource: [ // filter Added by: System / Custom
        {
          value: 0,
          name: "All"
        }, {
          value: 1,
          name: "System"
        }, {
          value: 2,
          name: "Custom"
        }
      ],
      category: 0,
      checkShowItem: false,
    }),

    computed: {
      headers() {
        return [
          {text: this.translateCol('name'), value: 'name', align: 'left'},
          {text: this.translateCol('category'), value: 'category_name', align: 'center'},
          {text: this.translateCol('phone_number'), value: 'phone_number', sortable: false, align: 'center'},
          {text: this.translateCol('email'), value: 'email', sortable: false, align: 'center'},
          {text: this.translateCol('indexed'), value: 'is_suggestion', align: 'center'},
          // {text: this.translateCol('contact_person'), value: 'primary_contact_name', sortable: false, align: 'left'},
          // {text: this.translateCol('attachment'), value: 'count_attachment', sortable: false, align: 'center'},
          // {text: this.translateCol('added_by'), value: 'added_by_name', align: 'center', sortDesc: false},
        ];
      },
      headersAdmin() {
        return [
          {text: this.translateCol('name'), value: 'name', align: 'left'},
          {text: this.translateCol('category'), value: 'category_name', align: 'center'},
          {text: this.translateCol('phone_number'), value: 'phone_number', sortable: false, align: 'center'},
          {text: this.translateCol('email'), value: 'email', sortable: false, align: 'center'},
          // {text: this.translateCol('contact_person'), value: 'primary_contact_name', sortable: false, align: 'left'},
          // {text: this.translateCol('attachment'), value: 'count_attachment', sortable: false, align: 'center'},
        ];
      },

      computedHeaders () {
        let result;
        if (this.checkSuperAdmin) {
          result = this.headersAdmin;
        } else {
          result = this.headers;
        }
        return result;
      },

      filteredItems() {
        let that = this;
        return that.listArray.filter((item) => {
          return ((that.category === 0 || (that.category === item.category_id))
            && (that.added_by === 0 || (item.added_by === that.added_by)));
        });
      },
    },

    watch: {
      dialog(val) {
        val || this.close();
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

      reloadList() {
        this.$emit('reloadList');
      },

      reloadListCategory(){
        this.$emit('reloadListCategory');
      },

      showItem(item) {
        this.editItem(item);
      },

      editItem(item) {
        this.editedItem = Object.assign({}, item);
        this.checkShowItem = true;
      },

      // editItem(item) {
      //   let that = this;
      //   if (that.permissionsUser.indexOf('show-contact') !== -1) {
      //     that.formatData(item);
      //     that.editedItem = Object.assign({}, item);
      //     that.checkShowItem = true;
      //   }
      // },

      viewItem(item) {
        if (this.checkSuperAdmin || (this.checkAdmin || this.permissionsUser.indexOf('contact-detail') > -1)) {
          if (item.added_by === 1) {
            this.editedItem = Object.assign({}, item);
            this.checkShowItem = true;
          } else {
            this.$router.push('/company/contact-profile/' + item.id);
          }
        }
      },
    }
  };

</script>

<style scoped>

</style>

<template>
  <div>
    <!-- <AnswerOptionPopup
      :open-popup="checkShowItem"
      :resource="true"
      :answer-option-item="editedItem"
      @closePopup="checkShowItem = !checkShowItem"
      @reloadAnswerOptionsList="reloadAnswerOptionsList"
      @showItem="showItem"
    /> -->
    <NewAnswerOptionPopup
      :open-popup="checkShowItem"
      :resource="userRoleId === 1"
      :answer-option-item="editedItem"
      @closePopup="checkShowItem = !checkShowItem"
      @reloadAnswerOptionsList="reloadAnswerOptionsList"
      @showItem="showItem"
    />

    <v-data-table
      :headers="computedHeaders"
      :items="filteredItems"
      class="elevation-1 hse-table table-data"
      :items-per-page="10"
      :single-expand="true"
      :search="search"
      :sort-by="['created_at']"
      :sort-desc="[true, false]"
      @click:row="editItem"
    >
      <template v-slot:top>
        <div class="setting-header">
          <div class="panel-heading">
            <h4 class="panel-title">
              {{ $t('title.sort_by') }}
            </h4>
            <b-row v-if="!resource">
              <b-col cols="6">
                <div class="field-selection">
                  <v-select
                    v-model="type"
                    :items="typeArray"
                    item-text="name"
                    item-value="value"
                    :label="$t('setting.type')"
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
            <!-- ADMIN -->
            <b-row v-if="resource && userRoleId === 1">
              <b-col cols="6">
                <div class="field-selection">
                  <v-select
                    v-model="type"
                    :items="typeArray"
                    item-text="name"
                    item-value="value"
                    :label="$t('setting.type')"
                    outlined
                    class="text-box"
                  />
                </div>
              </b-col>
              <b-col cols="6">
                <div class="input-wrap field-search">
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
            <!-- User -->
            <b-row v-if="resource && userRoleId > 1">
              <b-col cols="4">
                <div class="field-selection">
                  <v-select
                    v-model="type"
                    :items="typeArray"
                    item-text="name"
                    item-value="value"
                    :label="$t('setting.type')"
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
                <div class="input-wrap field-search">
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
        </div>
      </template>
      <template v-slot:header="{ props: { headers } }">
        <h4 class="table-name">
          <span v-if="!resource">{{ $t('table.answer_options') }}</span>
          <span v-if="resource">{{ $t('table.template') }}</span>
        </h4>
      </template>
      <template v-slot:item.type_of_option_answer="{ item }">
        {{ formatDefaultOptionType(item.type_of_option_answer) }}
      </template>
      <template v-slot:item.added_by_name="{ item }">
        <span v-if="item.added_by === 1">{{ $t('table.system') }}</span>
        <span v-else>{{ item.added_by_name }}</span>
      </template>
      <template v-slot:item.function="{item}">
          {{ item?.type_of_option_answer == 1 ? 'Slider' : 'Dropdown' }}
      </template>
      <template v-slot:item.all_checklists="{item , index}">
        {{ item?.is_template ==1 ?'Yes':'No' }}
      </template>
      <template v-slot:no-data>
        {{ $t('table.no_data') }}
      </template>
    </v-data-table>
  </div>
</template>

<script>
  // import AnswerOptionPopup from "./AnswerOptionPopup";
  import cookies from "js-cookie";
import NewAnswerOptionPopup from './NewAnswerOptionPopup.vue';

  export default {
    name: "AnswerOptionTable",
    components: {
      // AnswerOptionPopup,
        NewAnswerOptionPopup,
    },
    props: {
      listArrayInput: Array,
      resource: Boolean,
    },
    data: () => ({
      userRoleId: parseInt(cookies.get('roleID')),
      headers: [
        {text: 'Name', align: 'left', value: 'name'},
        {text: 'Template', align: 'center', value: 'all_checklists'},
        {text: 'Function', align: 'center', value: 'function'},
        {text: 'Reported by', value: 'added_by_name', align: 'center'},
        {text: 'Option', align: 'center', value: 'count_option_answers'},
        {text: 'Used', align: 'center', value: 'count_used_time'},
      ],
      headersTemplate: [
        {text: 'Name', align: 'left', value: 'name'},
        {text: 'Type', align: 'center', value: 'type_of_option_answer'},
        {text: 'Options', align: 'center', value: 'count_option_answers'},
        {text: 'Number of used time', align: 'center', value: 'count_used_time'},
        {text: 'Added By', value: 'added_by_name', align: 'center'},
      ],
      headersAdmin: [
        {text: 'Name', align: 'left', value: 'name'},
        {text: 'Type', align: 'center', value: 'type_of_option_answer'},
        {text: 'Options', align: 'center', value: 'count_option_answers'},
        {text: 'Number of used time', align: 'center', value: 'count_used_time'},
      ],
      checkAnswerOption: false,
      editedItem: {
        name: '',
        type_of_option_answer: '',
        company_id: '',
        checklist_id: '',
        answer: [],
        is_template: true,
      },
      listArray: [],
      checkShowItem: false,
      type: 0,
      typeArray: [{
        value: 0,
        name: 'All'
      }, {
        value: 1,
        name: 'Slider'
      }, {
        value: 2,
        name: 'Dropdown'
      }],
      search: '',
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
    }),

    computed: {
      computedHeaders () {
        let result;
        if (this.userRoleId === 1) {
          result = this.headersAdmin;
        } else {
          if (this.checkResource) {
            result = this.headersTemplate;
          } else {
            result = this.headers;
          }
        }
        return result;
      },

      filteredItems() {
        let that = this;
        return that.listArray.filter((item) => {
          return ((that.type === 0 || that.type === item.type_of_option_answer)
            && (that.added_by === 0 || (item.added_by === that.added_by)));
        });
      },
    },

    watch: {
      listArrayInput(value) {
        if (value) {
          this.listArray = value;
        }
      },

      resource(value) {
        if (value) {
          this.checkResource = value;
        }
      },
    },

    created() {
      if (this.listArrayInput.length > 0) {
        this.listArray = this.listArrayInput;
      }

      if (this.resource) {
        this.checkResource = this.resource;
      }
    },

    methods: {
      reloadAnswerOptionsList() {
        this.$emit('reloadAnswerOptionsList');
      },

      showItem(item) {
        this.editItem(item);
      },

      // show type of each default option
      formatDefaultOptionType(type) {
        if (type === 1) {
          return this.$i18n.t('table.slider');
        } else {
          return this.$i18n.t('table.dropdown');
        }
      },

      editItem(item) {
        let that = this;
        that.editedItem = Object.assign({}, item);
        that.checkShowItem = true;
      },
    }
  };

</script>

<style scoped>

</style>

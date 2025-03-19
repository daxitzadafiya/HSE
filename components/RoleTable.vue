<template>
  <div>
    <RolePopup
      :open-popup="checkShowItem"
      :role-item="editedRoleItem"
      :level-array-input="levelArray"
      @closePopup="checkShowItem = !checkShowItem"
      @reloadList="reloadList"
    />
    <v-data-table
      :headers="headersRole"
      :items="filteredRoleItems"
      class="elevation-1 hse-table table-data"
      :items-per-page="15"
      :single-expand="true"
      :search="searchRole"
      :sort-by="['created_at']"
      :sort-desc="[true, false]"
      @click:row="editRoleItem"
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
                    v-model="searchRole"
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
          {{ $t('table.roles') }}
        </h4>
      </template>

      <template v-slot:no-data>
        {{ $t('table.no_data') }}
      </template>
    </v-data-table>
  </div>
</template>

<script>
  import RolePopup from "./RolePopup";

  export default {
    name: "RoleTable",
    components: {
      RolePopup
    },
    props: {
      listArrayInput: Array,
      levelArrayInput: Array,
    },
    data:()=>({
      searchRole: '',
      checkShowItem: false,
      editedRoleItem: {
        name: '',
        description: '',
        level: '',
        addNewLevel: '',
        permission: '',
      },
      listArray: [],
      levelArray: [],
    }),

    computed: {
      headersRole() {
        return [
          {text: this.translateCol('name'), value: 'name', align: 'left'},
          {text: this.translateCol('level'), value: 'level', align: 'left'},
        ]
      },
      filteredRoleItems() {
        let that = this;
        return that.listArray;
      },
    },

    watch: {
      listArrayInput(value) {
        if (value) {
          this.listArray = value;
        }
      },

      levelArrayInput(value) {
        if (value) {
          this.levelArray = value;
        }
      },
    },

    created() {
      if (this.listArrayInput.length > 0) {
        this.listArray = this.listArrayInput;
      }

      if (this.levelArrayInput.length > 0) {
        this.levelArray = this.levelArrayInput;
      }
    },

    methods: {
      translateCol (colName) {
        return this.$i18n.t('column.' + colName);
      },

      reloadList() {
        this.$emit('reloadList');
      },

      showItem(item) {
        this.editItem(item);
      },

      editRoleItem(item) {
        var that = this;
        that.editedRoleItem = Object.assign({}, item);
        that.checkShowItem = true;
      }
    }
  };
</script>

<style scoped>

</style>

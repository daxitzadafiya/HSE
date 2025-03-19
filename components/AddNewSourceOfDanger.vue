<template>
  <div class="manage-table pb-5">
    <v-data-table
      :headers="headers"
      :items="listArray"
      outlined
      class="elevation-1 header-table body-table"
      :items-per-page="15"
      :single-expand="true"
      hide-default-footer
      :sort-desc="[true, false]"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title class="component-sub-goal title-manage-task">
            {{ $t('title.add_source_of_danger') }}
            <v-icon
              class="icon-plus-circle ml-2"
              @click="addNewItem"
            >
              mdi-plus-circle
            </v-icon>
          </v-toolbar-title>
        </v-toolbar>
      </template>
      <template v-slot:item.name="{ item }">
        <!-- Add new - Process none -->
        <v-text-field
          v-if="!editMode && !isProcessActivate"
          v-model="item.name"
          :rules="required"
          @change="updateDetail(listArray)"
        />
        <!-- Add new - Process activate -->
        <v-text-field
          v-if="!editMode && isProcessActivate"
          v-model="item.name"
          @change="updateDetail(listArray)"
        />
        <!-- Edit - CREATOR -->
        <v-text-field
          v-if="editMode && checkCreator && !checkResponsible"
          v-model="item.name"
          :rules="required"
          :disabled="!item.is_new && (item.added_by !== userLogged || (item.added_by === userLogged && item.comment !== null))"
          @change="updateDetail(listArray)"
        />
        <!-- Edit - RESPONSIBLE -->
        <v-text-field
          v-if="editMode && checkResponsible"
          v-model="item.name"
          :rules="required"
          :disabled="!item.is_new && item.added_by !== userLogged"
          @change="updateDetail(listArray)"
        />
      </template>
      <template v-slot:item.type="{ item }">
        {{ $t('form.report') }}
      </template>
      <template v-slot:item.probability="{ item }">
        <!-- Add new - Process none -->
        <v-select
          v-if="!editMode && !isProcessActivate"
          v-model="item.probability"
          :items="probabilityArr"
          item-text="name"
          item-value="value"
          :rules="required"
          :disabled="!editMode && isProcessActivate"
          @change="updateColorCode(item)"
        />
        <!-- Add new - Process activate -->
        <v-select
          v-if="!editMode && isProcessActivate"
          v-model="item.probability"
          :items="probabilityArr"
          item-text="name"
          item-value="value"
          :disabled="!editMode && isProcessActivate"
          @change="updateColorCode(item)"
        />
        <!-- Edit - CREATOR -->
        <v-select
          v-if="editMode && checkCreator && !checkResponsible"
          v-model="item.probability"
          :items="probabilityArr"
          item-text="name"
          item-value="value"
          :disabled="checkCreator && !checkResponsible"
          @change="updateColorCode(item)"
        />
        <!-- Edit - RESPONSIBLE -->
        <v-select
          v-if="editMode && checkResponsible"
          v-model="item.probability"
          :items="probabilityArr"
          item-text="name"
          item-value="value"
          :rules="required"
          @change="updateColorCode(item)"
        />
      </template>
      <template v-slot:item.consequence="{ item }">
        <!-- Add new - Process none -->
        <v-select
          v-if="!editMode && !isProcessActivate"
          v-model="item.consequence"
          :items="consequenceArr"
          item-text="name"
          item-value="value"
          :rules="required"
          :disabled="!editMode && isProcessActivate"
          @change="updateColorCode(item)"
        />
        <!-- Add new - Process activate -->
        <v-select
          v-if="!editMode && isProcessActivate"
          v-model="item.consequence"
          :items="consequenceArr"
          item-text="name"
          item-value="value"
          :disabled="!editMode && isProcessActivate"
          @change="updateColorCode(item)"
        />
        <!-- Edit - CREATOR -->
        <v-select
          v-if="editMode && checkCreator && !checkResponsible"
          v-model="item.consequence"
          :items="consequenceArr"
          item-text="name"
          item-value="value"
          :disabled="checkCreator && !checkResponsible"
          @change="updateColorCode(item)"
        />
        <!-- Edit - RESPONSIBLE -->
        <v-select
          v-if="editMode && checkResponsible"
          v-model="item.consequence"
          :items="consequenceArr"
          item-text="name"
          item-value="value"
          :rules="required"
          @change="updateColorCode(item)"
        />
      </template>
      <template v-slot:item.risk_level="{ item }">
        <div v-if="item.risk_level && item.risk_level >= 1 && item.risk_level <= 3" class="source-of-danger-color-code color-green d-inline-block">
          {{ item.risk_level }}
        </div>
        <div v-if="item.risk_level && item.risk_level >= 4 && item.risk_level <= 10" class="source-of-danger-color-code color-yellow d-inline-block">
          {{ item.risk_level }}
        </div>
        <div v-if="item.risk_level && item.risk_level >= 11 && item.risk_level <= 15" class="source-of-danger-color-code color-orange d-inline-block">
          {{ item.risk_level }}
        </div>
        <div v-if="item.risk_level && item.risk_level === 16" class="source-of-danger-color-code color-red d-inline-block">
          {{ item.risk_level }}
        </div>
      </template>
      <template v-slot:item.comment="{ item }">
        <!-- Add new - Process none -->
        <v-text-field
          v-if="!editMode && !isProcessActivate"
          v-model="item.comment"
          :rules="required"
          @change="updateDetail(listArray)"
        />
        <!-- Add new - Process activate -->
        <v-text-field
          v-if="!editMode && isProcessActivate"
          v-model="item.comment"
          :disabled="!editMode && isProcessActivate"
          @change="updateDetail(listArray)"
        />
        <!-- Edit - CREATOR -->
        <v-text-field
          v-if="editMode && checkCreator && !checkResponsible"
          v-model="item.comment"
          :disabled="checkCreator && !checkResponsible"
          @change="updateDetail(listArray)"
        />
        <!-- Edit - RESPONSIBLE -->
        <v-text-field
          v-if="editMode && checkResponsible"
          v-model="item.comment"
          :rules="required"
          @change="updateDetail(listArray)"
        />
      </template>
      <template v-slot:item.actions="{ index, item }">
        <v-icon small @click="copySource(item)">
          mdi-file
        </v-icon>
        <v-icon
          v-if="listArray.length > 1 && checkConditionToShowDeleteButton(item)"
          small
          class="ml-3"
          @click="deleteSource(index)"
        >
          delete
        </v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script>
  import {_} from 'vue-underscore';
  import cookies from "js-cookie";

  export default {
    name: "AddNewSourceOfDanger",
    props: {
      objectItem: {
        type: Object,
        required: true,
      },
      editMode: {
        type: Boolean,
        required: true,
      },
      isProcessActivate: {
        type: Boolean,
        required: false,
      },
    },
    data: () => ({
      userLogged: parseInt(cookies.get('userID')),
      listArray: [],
      newItem: {
        id: '',
        name: '',
        probability: '',
        consequence: '',
        risk_level: '',
        comment: '',
        need_to_process: 0,
      },
      required: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else return true;
        }
      ],
      probabilityArr: [
        {
          value: 1,
          name: "Low"
        },
        {
          value: 2,
          name: "Moderate"
        },
        {
          value: 3,
          name: "High"
        },
        {
          value: 4,
          name: "Very High"
        }
      ],
      consequenceArr: [
        {
          value: 1,
          name: "Low"
        },
        {
          value: 2,
          name: "Moderate"
        },
        {
          value: 3,
          name: "High"
        },
        {
          value: 4,
          name: "Very High"
        }
      ],
      checkCreator: false,
      checkResponsible: false,
    }),

    computed: {
      headers() {
        return [
          {text: this.translateCol('name'), value: 'name', align: 'center', width: '23%', sortable: false},
          {text: this.translateCol('type'), value: 'type', align: 'center', width: '10%', sortable: false},
          {text: this.translateCol('probability'), value: 'probability', align: 'center', width: '13%', sortable: false},
          {text: this.translateCol('consequence'), value: 'consequence', align: 'center', width: '13%', sortable: false},
          {text: this.translateCol('risk_level'), value: 'risk_level', align: 'center', width: '10%', sortable: false},
          {text: this.translateCol('comment'), value: 'comment', align: 'center', width: '24%', sortable: false},
          {text: this.translateCol('actions'), value: 'actions', align: 'center', width: '7%', sortable: false},
        ];
      },
    },

    watch: {
      objectItem() {
        if (this.editMode) {
          this.editItem(this.objectItem);
        } else {
          this.addNew();
        }
        this.editItem(this.objectItem);
      },
    },

    created() {
      if (this.objectItem) {
        this.editItem(this.objectItem);
      } else {
        this.addNew();
      }
    },

    methods: {
      addNew() {
        this.listArray = [];
        this.addNewItem();
      },

      addNewItem() {
        if (this.editMode) {
          this.newItem.is_new = true;
        }
        let newItem = _.clone(this.newItem);
        if (this.listArray.length > 0) {
          newItem.id = 'a' + this.listArray.length;
        }
        this.listArray.unshift(newItem);
      },

      editItem(item) {
        this.listArray = item.source_of_danger;
        if (item.source_of_danger.length === 0) {
          this.addNew();
        } else if (item.isAddNewSourceOfDanger) {
          this.addNewItem();
        }
        this.checkCreator = _.contains(item.role, 'creator');
        this.checkResponsible = _.contains(item.role, 'responsible');
      },

      translateCol (colName) {
        return this.$i18n.t('column.' + colName);
      },

      translateLevel(level) {
        return this.$i18n.t('form.' + level);
      },

      updateColorCode(risk) {
        if (risk.probability && risk.consequence) {
          risk.risk_level = risk.probability * risk.consequence;
        }
        this.updateDetail(this.listArray);
        // let that = this;
        // if (risk.probability && risk.consequence) {
        //   let point = risk.probability * risk.consequence;
        //   _.each(that.colorCodeArr, function(item) {
        //     if (point >= item.min && point <= item.max) {
        //       risk.colorCode = item.value;
        //       risk.colorName = item.name;
        //       risk.point = point;
        //     }
        //   });
        // }
      },

      copySource(item) {
       if (item.name.trim() !== '' || item.probability !== '' || item.consequence !== '' || item.comment !== '') {
        let temp = {
          id: 'b' + this.listArray.length,
          name: '',
          probability: item.probability,
          consequence: item.consequence,
          risk_level: item.risk_level,
          comment: item.comment,
          need_to_process: item.need_to_process,
        };
        if (this.editMode) {
          temp.is_new = true;
        }
        this.listArray.unshift(temp);
        }else{
            this.$toaster.error(this.$i18n.t('Required minimum one field'))
        }
      },

      deleteSource(index) {
        this.listArray.splice(index, 1);
      },

      updateDetail(val) {
        this.$emit('updateSourceOfDanger', {
          list: val,
        });
      },

      checkConditionToShowDeleteButton(item) {
        if (this.editMode) {
          if (item.added_by === this.userLogged) {
            if (this.checkCreator && !this.checkResponsible && item.probability === null && item.consequence === null && item.comment === null) {
              return true;
            } else return this.checkResponsible;
          } else {
            return item.is_new;
          }
        } else {
          return true;
        }
      },
    },
  };
</script>

<style scoped>

</style>

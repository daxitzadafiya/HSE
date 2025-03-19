<template>
  <v-select v-if="singleSelection"
  v-model="selectedItems"
    :items="listOptionArray"
    :item-text="itemText"
    :item-value="itemValue"
    outlined
    chips
    :label="label"
    :rules="requestRequired ? required : []"
    @change="updateSelectedItems"
    :disabled="disabled"
  >
    <!-- :disabled="!!requestDisabled || !!requestReadonly || (item && !item.editPermission)" -->
    <!-- <template v-slot:prepend-item>
      <v-list-item
        ripple
        @click="toggle"
        class="overflow-hidden"
      >
        <v-list-item-action>
          <v-icon :color="selectedItems.length > 0 ? 'indigo darken-4' : ''">{{ icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ $t('form.select_all') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider class="mt-2"></v-divider>
    </template> -->
  </v-select>
  <v-select v-else
    v-model="selectedItems"
    :items="listOptionArray"
    :item-text="itemText"
    :item-value="itemValue"
    multiple
    outlined
    chips
    :label="label"
    :rules="requestRequired ? required : []"
    @change="updateSelectedItems"
    :disabled="disabled"
  >
    <!-- :disabled="!!requestDisabled || !!requestReadonly || (item && !item.editPermission)" -->
    <template slot="selection" slot-scope="data">
    <!-- HTML that describe how select should render selected items -->
    <v-chip :title="data.item[itemText]" v-if="data.item[itemText].length > 15"> {{ data.item[itemText].substr(0,15)+'...' }}</v-chip>
    <v-chip v-else> {{ data.item[itemText] }}</v-chip>
    
  </template>
    <template v-slot:prepend-item>
      <v-list-item
        ripple
        @click="toggle"
        class="overflow-hidden"
      >
        <v-list-item-action>
          <v-icon :color="selectedItems.length > 0 ? 'indigo darken-4' : ''">{{ icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ $t('form.select_all') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider class="mt-2"></v-divider>
    </template>
  </v-select>
</template>

<script>
  import {_} from 'vue-underscore';

  export default {
    name: "MultipleSelection",
    props: {
      listOptionInput: Array,
      label: String,
      itemText: String,
      itemValue: String,
      selectedItemsInput:{
        type: [Array , Number],
        required: false,
      } ,
      singleSelection:{
        type: Boolean,
        required: false,
      },
      requestRequired: {
        type: Boolean,
        required: false,
      },
      requestDisabled: {
        type: Boolean,
        required: false,
      },
      requestReadonly: {
        type: Boolean,
        required: false,
      },
      item: {
        type: Object,
        required: false,
      },
      disabled:{
        type:Boolean,
        require:false,
      }
    },

    data:() => ({
      listOptionArray: [],
      selectedItems: [],
      required: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else return true;
        }
      ],
    }),

    computed: {
      selectAllOption () {
        return this.selectedItems && this.selectedItems.length === this.listOptionArray.length;
      },
      selectSomeOption () {
        return this.selectedItems && this.selectedItems.length > 0 && !this.selectAllOption;
      },
      icon () {
        if (this.selectAllOption) return 'mdi-close-box';
        if (this.selectSomeOption) return 'mdi-minus-box';
        return 'mdi-checkbox-blank-outline';
      },
    },

    watch: {
      listOptionInput(value) {
        if (value) {
          this.listOptionArray = value;
        }
      },

      selectedItemsInput(value) {
        if (value) {
          this.selectedItems = value;
        }
      }
    },

    created() {
      if (this.listOptionInput && this.listOptionInput.length > 0) {
        this.listOptionArray = this.listOptionInput;
      }

      if (this.selectedItemsInput && this.selectedItemsInput.length > 0) {
        this.selectedItems = this.selectedItemsInput;
      }
    },

    methods: {
      toggle () {
        this.$nextTick(() => {
          let that = this;
          if (that.selectAllOption) {
            that.selectedItems = [];
          } else {
            that.selectedItems = [];
            _.each(that.listOptionArray, function (sendToItem) {
              that.selectedItems.push(sendToItem[that.itemValue]);
            });
          }
          that.getSelectedItems();
        });
      },

      updateSelectedItems() {
        this.getSelectedItems();
      },

      getSelectedItems() {
        this.$emit('getSelectedItems', {
          selectedItemsOutput: this.selectedItems,
        });
      }
    }
  };
</script>

<style scoped>

</style>

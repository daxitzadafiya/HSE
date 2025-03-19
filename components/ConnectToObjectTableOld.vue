<template>
  <div v-if="ctoTableItems.length">
    <v-data-table
      :headers="ctoTableHeaders"
      hide-default-footer
      :items="ctoTableItems"
      class="elevation-1"
    >
      <template v-slot:item.name="{ item }">
        {{ item.name }}
      </template>

      <template v-slot:item.source="{ item }">
        {{ item.source }}
      </template>

      <template v-slot:item.category="{ item }">
        {{ item.category }}
      </template>

      <template v-slot:item.connectedBy="{ item }">
        {{ item.connectedBy }}
      </template>

      <template v-slot:item.added="{ item }">
        {{ item.added }}
      </template>
      <template v-slot:item.connectDate="{ item }">
        {{ moment(item.connectDate).format('DD.MM.YYYY') }}
      </template>

        <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="viewObject()">
                  mdi-eye
                </v-icon>
                <v-icon small @click="ctoDeleteItem(item.id)"> mdi-delete </v-icon>
        </template>
    </v-data-table>
  </div>
</template>
<script>
export default {
  name: 'cto-table',

  props: {
    ctoTableItems: {
      type: [Object, Array],
    },
    ctoTableHeaders: {
      type: [Object, Array],
    },
    hasEditOption: {
      type: [Boolean],
    },
  },

  methods: {
    ctoEditItem(item) {
      this.$emit('ctoEditItem', item)
    },
    ctoDeleteItem(item) {
      this.$emit('ctoDeleteItem', item)
    },
    viewObject(){
    }
  },
}
</script>
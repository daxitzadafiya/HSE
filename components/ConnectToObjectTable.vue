<template>
  <div>
    <v-data-table
      :headers="headers"
      hide-default-footer
      :items="items"
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
      <template v-slot:item.connected_date="{item}">
          {{ moment(item.connected_date).format('DD-MM-YYYY') }}
      </template>

        <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="handleViewObject()">
                  mdi-eye
                </v-icon>
                <v-icon small @click="handleDeleteItem(item.id)"> mdi-delete </v-icon>
        </template>
    </v-data-table>
  </div>
</template>
<script>
export default {
  name: 'ConnectToObjectTable',

  props: {
    items: {
      type: [Object, Array],
    },
    headers: {
      type: [Object, Array],
    },
    hasEditOption: {
      type: [Boolean],
    },
  },

  methods: {
    handleEditItem(item) {
      this.$emit('handleEditItem', item)
    },
    handleDeleteItem(item) {
      this.$emit('handleDeleteItem', item)
    },
    handleViewObject(){
    }
  },
}
</script>

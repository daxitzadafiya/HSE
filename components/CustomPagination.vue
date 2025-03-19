<template>
<v-col class="d-flex justify-content-start align-items-center cust-pagination">
    <div class="cust-col">
        <span class="pagination-cust-text">{{ pagination.from || '0'}} - {{ pagination.to || '0' }} of
            {{ pagination.total || '0' }}</span>
    </div>
    <v-col>
        <v-pagination :value="pagination.current_page" :length="pagination?.last_page" :total-visible="0" @input="changePage" class="pagination-btns"></v-pagination>
    </v-col>
</v-col>
</template>

<script>

export default {
    name: "CustomPagination",

    props: {
      pagination: {
        type: Object,
        required: true,
      }
    },

    methods: {
        changePage(value) {
            this.$emit('changePage', value)
        }
    }
}

</script>

<style>
.cust-pagination {
    font-size: 14px !important;
    background: #fff;
    border-top: 1px solid #e0e0e0;
    border-radius: 0px 0px 8px 8px;
    height: 40px;
    box-shadow: 0px 1px 1px 0px #e0e0e0;
  }
  .cust-col{
     min-width: 80px;
    max-width: fit-content;
    margin-left: 25px;
  }
  .pagination-cust-text {
    color: rgba(0, 0, 0, 0.87);
    font-size: 12px;
  }
  .cust-pagination .pagination-btns .v-pagination .v-pagination__navigation{
    background-color: transparent !important;
  }
  .cust-pagination .pagination-btns .v-pagination{
      align-items: center !important;
      display: inline-flex;
      list-style-type: none;
      justify-content: flex-start !important;
      margin: 0;
      max-width: 0%;
      width: 0%;
  }
  </style>
  <style>
  .cust-pagination .pagination-btns .v-pagination .v-pagination__navigation{
    background-color: transparent !important;
    box-shadow: none !important;
  }
  .pagination-btns{
    max-width: fit-content !important;
  }
  </style>
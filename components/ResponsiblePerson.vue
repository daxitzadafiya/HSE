<template>
  <div class="input-wrap">
    <v-select
      v-model="objectItem.responsible_id"
      :label="label ? label : $t('form.responsible')"
      :items="responsible"
      item-text="name"
      item-value="id"
      :rules="required"
      outlined
      :disabled="denyEdit"
      :readonly="readOnly"
    />
  </div>
</template>
<script>
  import cookies from "js-cookie";

  export default {
    props: {
      objectItem: Object,
      responsibleArray: Array,
      denyEdit: {
        type: Boolean,
        required: false,
      },
      readOnly: {
        type: Boolean,
        required: false,
      },
      label: {
        type: String,
        required: false,
      },
    },
    data: function () {
      return {
        permissionsUser: localStorage.getItem('permissionsKey'),
        checkSuperAdmin: cookies.get('checkSuperAdmin'),
        checkAdmin: cookies.get('checkAdmin'),
        userID: parseInt(cookies.get('userID')),
        // roleUser: cookies.get('roleUser'),
        // userRoleId: parseInt(cookies.get('roleID')),
        required: [
          v => {
            if (!v || v.length < 1)
              return 'This is required';
            else return true;
          }
        ],
        responsible: [],
      };
    },

    watch: {
      responsibleArray(value) {
        if (value.length > 0) {
          this.responsible = value;
        }
      },

      objectItem(value) {
        if (!value.responsible_id) {
          value.responsible_id = this.userID;
        }
      }

    },

    mounted() {
      if (this.responsibleArray.length > 0) {
        this.responsible = this.responsibleArray;
      }
    },

  };
</script>

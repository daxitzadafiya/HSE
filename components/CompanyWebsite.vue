<template>
  <div v-if="!isAddingWebsite" class="input-wrap d-inline-flex">
    <div class="bold-title md-line-height">
      {{ $t('form.website') }}
    </div>
    <div class="switch-component">
      <label class="left-text">{{ $t('form.none') }}</label>
      <v-switch
        v-model="isAddingWebsite"
        :label="$t('form.activate')"
        inset
        class="right-text"
        @change="addWebsite('activate')"
      />
    </div>
  </div>
  <div v-else class="section-connect-to">
    <div class="section-connect-to-label section-connect-to-label-reminder">
      {{ $t('form.website') }}
    </div>
    <div class="switch-component switch-component-small">
      <label class="left-text">{{ $t('form.none') }}</label>
      <v-switch
        v-model="isAddingWebsite"
        :label="$t('form.activate')"
        inset
        class="right-text"
        @change="addWebsite('none')"
      />
    </div>
    <b-row class="pt-3 mt-3">
      <b-col>
        <div class="input-wrap">
          <v-text-field v-model="companyItem.website" :label="$t('form.website')" outlined />
        </div>
      </b-col>
    </b-row>
  </div>
</template>
<script>
  // import {_} from 'vue-underscore';
  // import cookies from "js-cookie";

  export default {
    name: "CompanyWebsite",
    components: {},
    props: {
      companyItem: {
        type: Object,
        required: false,
      },
      editMode: {
        type: Boolean,
        required: false,
      },
    },
    data: () => ({
      // checkAdmin: cookies.get('checkAdmin'),
      // roleUser: cookies.get('roleUser'),
      permissionsUser: localStorage.getItem('permissionsKey'),
      // userLogged: parseInt(cookies.get('userID')),
      required: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else return true;
        }
      ],
      isAddingWebsite: false,
    }),

    watch: {
      companyItem(value) {
        if (value) {
          if (this.editMode) {
            this.editItem(this.companyItem);
          }
        }
      },
    },

    mounted() {},

    created() {},

    methods: {
      editItem(item) {
        this.isAddingWebsite = item.website !== null;
        return item;
      },

      addWebsite(condition) {
        this.isAddingWebsite = condition !== 'none';
        if (condition === 'none') {
          this.companyItem.website = null;
        }
      }
    }
  };
</script>

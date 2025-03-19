<template>
  <div v-if="!isUpdatingCountry" class="input-wrap d-inline-flex">
    <div class="bold-title md-line-height">
      {{ $t('form.country') }}
    </div>
    <div class="switch-component">
      <label class="left-text">{{ $t('form.norway') }}</label>
      <v-switch
        v-model="isUpdatingCountry"
        :label="$t('form.others')"
        inset
        class="right-text"
        @change="editCountry('others')"
      />
    </div>
  </div>
  <div v-else class="section-connect-to">
    <div class="section-connect-to-label section-connect-to-label-reminder">
      {{ $t('form.country') }}
    </div>
    <div class="switch-component switch-component-small">
      <label class="left-text">{{ $t('form.norway') }}</label>
      <v-switch
        v-model="isUpdatingCountry"
        :label="$t('form.others')"
        inset
        class="right-text"
        @change="editCountry('Norway')"
      />
    </div>
    <b-row class="pt-3 mt-3">
      <b-col>
        <div class="input-wrap">
          <v-select
            v-model="companyItem.country"
            :items="countryArray"
            item-text="name"
            item-value="value"
            :label="$t('form.country')"
            :rules="required"
            outlined
          />
        </div>
      </b-col>
    </b-row>
  </div>
</template>
<script>
  // import {_} from 'vue-underscore';
  // import cookies from "js-cookie";

  export default {
    name: "CompanyCountry",
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
      permissionsUser: localStorage.getItem('permissionsKey'),
      required: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else return true;
        }
      ],
      isUpdatingCountry: false,
      countryArray: [
        { name: 'Australia', value: 'Australia'},
        { name: 'Denmark', value: 'Denmark'},
        { name: 'England', value: 'England'},
        { name: 'Finland', value: 'Finland'},
        { name: 'Sweden', value: 'Sweden'},
        { name: 'USA', value: 'USA'},
      ],
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
        this.isUpdatingCountry = item.country !== 'Norway';
        return item;
      },

      editCountry(name) {
        this.isUpdatingCountry = name !== 'Norway';
        if (name === 'Norway') {
          this.companyItem.country = 'Norway';
        } else {
          this.companyItem.country = 'Australia';
        }
      }
    }
  };
</script>

<template>
  <div class="component-sub-goal">
    <div v-if="!newCategory" class="d-inline-flex w-100">
      <v-select
        v-model="objectItem.category_id"
        :items="listArray"
        item-text="name"
        item-value="id"
        :rules="required"
        outlined
      />
      <div class="mt-4">
        <v-icon class="icon-plus-circle ml-4" @click="addNewCategory">
          mdi-plus-circle
        </v-icon>
      </div>
    </div>
    <div v-if="newCategory" class="d-inline-flex w-100">
      <v-text-field
        v-model="new_category_name"
        type="text"
        :rules="required"
        outlined
      />
      <div class="mt-4">
        <v-icon class="icon-plus-circle ml-4" @click="save">
          mdi-plus-circle
        </v-icon>
        <v-icon class="icon-close-circle ml-2" @click="cancel">
          mdi-close-circle
        </v-icon>
      </div>
    </div>
  </div>
</template>
<script>
  // import cookies from "js-cookie";
  // import {_} from 'vue-underscore';

  export default {
    name: "CategoryInReviewPopup",
    props: {
      objectItem: {
        type: Object,
        required: true,
      },
      typeCategory: {
        type: String,
        required: true,
      },
      addedFrom: {
        type: Number,
        required: false,
      },
    },
    data: function () {
      return {
        // permissionsUser: localStorage.getItem('permissionsKey'),
        // checkSuperAdmin: cookies.get('checkSuperAdmin'),
        // checkAdmin: cookies.get('checkAdmin'),
        // roleUser: cookies.get('roleUser'),
        // userRoleId: parseInt(cookies.get('roleID')),
        required: [
          v => {
            if (!v || v.length < 1)
              return 'This is required';
            else return true;
          }
        ],
        listArray: [],
        newCategory: false, // add new category
        new_category_name: '',
        editedItem: {
          name: ""
        },
        categoryId: '',
      };
    },

    watch: {},

    mounted() {
      let that = this;
      that.$nextTick(() => {
        that.$nuxt.$loading.start();
        that.$store.dispatch('categoriesV2/index', {type: that.typeCategory}).then(result => {
          that.listArray = result.data;
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }
          that.$nuxt.$loading.finish();
        });
      });
    },

    methods: {
      // add new category
      addNewCategory(){
        this.newCategory = true;
        this.new_category_name = "";
      },

      save() {
        let that = this;
        that.$nuxt.$loading.start();
        that.editedItem.name = that.new_category_name;
        that.editedItem.type = that.typeCategory;
        that.editedItem.added_from = that.addedFrom;
        that.$store.dispatch('categoriesV2/store', that.editedItem).then(result => {
          that.listArray.push(result.data);
          that.$emit('getNewCategory', {
            newCategoryId: result.data.id,
          });
          that.$nuxt.$loading.finish();
          that.$toaster.success(that.$i18n.t('message.success_category_add_new'));
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_category_add_new'));
          }
          that.$nuxt.$loading.finish();
        });
        that.newCategory = false;
      },

      cancel() {
        this.newCategory = false;
      },
    }
  };
</script>

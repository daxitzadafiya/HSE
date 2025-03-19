<template>
  <b-row v-if="checkSuperAdmin || (checkAdmin || permissionsUser.indexOf('category-basic') > -1)">
    <b-col cols="3">
      <div class="department-title-with-new">
        {{ $t('form.category') }}
      </div>
      <v-btn class="add-new-down-title" :disabled="viewOnly" @click="addNewCategory">
        + {{ $t('button.new_category') }}
      </v-btn>
    </b-col>
    <v-form
            ref="form"
            v-model="valid"
            lazy-validation
            class="col-9 m-0" 
          >
    <b-col cols="12" class="py-0 pr-0">
      <div v-if="!newCategory" class="d-inline-flex w-100">
        <v-select
          v-model="categoryItem.category_id"
          :items="categories"
          item-text="name"
          item-value="id"
          :rules="required"
          :readonly="viewOnly"
          outlined
        />
      </div>
      <div v-if="newCategory" class="d-inline-flex w-100">
        <v-text-field
          v-model="new_category_name"
          type="text"
          :rules="required"
          outlined
        />
        <div class="mt-2 d-flex">
          <v-btn class="ml-4 btn-save" @click="saveNewCategory">
            {{ $t('button.add') }}
          </v-btn>
          <v-btn class="ml-2 btn-cancel" @click="cancelNewCategory">
            {{ $t('button.cancel') }}
          </v-btn>
        </div>
      </div>
    </b-col>
    </v-form>
<!--    <b-col v-if="!newCategory" cols="9">-->
<!--      <div class="input-wrap">-->
<!--        <v-select-->
<!--          v-model="categoryItem.category_id"-->
<!--          :items="categories"-->
<!--          item-text="name"-->
<!--          item-value="id"-->
<!--          :rules="required"-->
<!--          :readonly="viewOnly"-->
<!--          outlined-->
<!--        />-->
<!--      </div>-->
<!--    </b-col>-->
<!--    <b-col v-if="newCategory" cols="4">-->
<!--      <div class="connect-department">-->
<!--        <div class="department d-inline-flex">-->
<!--          <v-text-field-->
<!--            v-model="new_category_name"-->
<!--            class="new-department-input"-->
<!--            type="text"-->
<!--            :rules="required"-->
<!--            outlined-->
<!--          />-->
<!--          <span v-if="newCategory" class="department-button">-->
<!--            <v-btn class="mb-2 btn-add-department" @click="saveNewCategory">-->
<!--              {{ $t('button.add') }}-->
<!--            </v-btn>-->
<!--            <v-btn class="mt-1 mb-2 btn-cancel-department" @click="cancelNewCategory">-->
<!--              {{ $t('button.cancel') }}-->
<!--            </v-btn>-->
<!--          </span>-->
<!--        </div>-->
<!--      </div>-->
<!--    </b-col>-->
  </b-row>
  <b-row v-else>
    <b-col>
      <div class="input-wrap">
        <v-select
          v-model="categoryItem.category_id"
          :items="categories"
          item-text="name"
          item-value="id"
          :label="$t('form.category')"
          :rules="required"
          outlined
          :readonly="!categoryItem.editPermission"
        />
      </div>
    </b-col>
  </b-row>
</template>
<script>
  import cookies from "js-cookie";
  import {_} from 'vue-underscore';

  export default {
    props: {
      categoryItem: Object,
      isOpenPopup: Boolean,
      categoriesArray: Array,
      typeCategory: String,
      addedFrom: {
        type: Number,
        required: false,
      },
      viewOnly: {
        type: Boolean,
        required: false,
      },
      source: {
        type: String,
        require: false,
      }
    },
    data: function () {
      return {
        permissionsUser: localStorage.getItem('permissionsKey'),
        checkSuperAdmin: cookies.get('checkSuperAdmin'),
        checkAdmin: cookies.get('checkAdmin'),
        // roleUser: cookies.get('roleUser'),
        // userRoleId: parseInt(cookies.get('roleID')),
        required: [
          v => {
            if (!v || v.length < 1)
              return 'This is required';
            else return true;
          }
        ],
        valid: true,
        categories: [],
        newCategory: false, // add new category
        new_category_name: '',
        editedCategory: {
          name: "",
          type: 0,
          source: ""
        },
        categoryId: '',
      };
    },

    watch: {
      categoriesArray(value) {
        if (value.length > 0) {
          this.categories = value;
        }
      },

      isOpenPopup() {
        this.newCategory = false;
      },

      categoryItem(value) {
        if (!value.category_id) {
          const primaryCategory = _.findWhere(this.categories, {is_priority: 1});
          if (primaryCategory) {
            value.category_id = primaryCategory.id;
          }
        }
      }

    },

    mounted() {
      if (this.categoriesArray.length > 0) {
        this.categories = this.categoriesArray;
      }
    },

    methods: {
      // add new category
      addNewCategory(){
        this.newCategory = true;
        this.new_category_name = "";
      },

      saveNewCategory() {
        let that = this;
        that.$nuxt.$loading.start();
        if (that.$refs.form.validate()) {
        that.editedCategory.name = that.new_category_name;
        that.editedCategory.type = that.typeCategory;
        that.editedCategory.added_from = that.addedFrom;
        that.editedCategory.source = that.source;
        that.$store.dispatch('categoriesV2/store', that.editedCategory).then(result => {
          that.categoriesArray.push(result.data);
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
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
        that.newCategory = false;
      }else{
        that.$toaster.error(that.$i18n.t('message.add_new_category'));
      }
      that.$nuxt.$loading.finish();
      },

      cancelNewCategory() {
        this.newCategory = false;
      },
    }
  };
</script>

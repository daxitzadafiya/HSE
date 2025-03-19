<template>
    <div class="component-sub-goal">
      <div v-if="!newPlace" class="inline-row">
        <v-select
          v-model="objectItem.place_id"
          :items="listArray"
          item-text="name"
          item-value="id"
          :rules="required"
          outlined
        />
        <div class="mt-4">
          <v-icon class="icon-plus-circle ml-4" @click="addNewPlace">
            mdi-plus-circle
          </v-icon>
        </div>
      </div>
      <div v-if="newPlace" class="inline-row">
        <v-text-field
          v-model="new_place_name"
          class="new-department-input"
          type="text"
          :rules="required"
          outlined
        />
        <div class="mt-4 icon-flex">
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
      name: "PlaceInReviewPopup",
      props: {
        objectItem: {
          type: Object,
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
          newPlace: false, // add new 
          new_place_name: '',
          editedItem: {
            name: ""
          },
          categoryId: '',
        };
      },
  
      watch: {},
  
    //   mounted() {
    //     let that = this;
    //     that.$nextTick(() => {
    //       that.$nuxt.$loading.start();
    //       that.$store.dispatch('categoriesV2/index', {type: that.typeCategory}).then(result => {
    //         that.listArray = result.data;
    //         that.$nuxt.$loading.finish();
    //       }).catch(() => {
    //         that.$nuxt.$loading.finish();
    //       });
    //     });
    //   },
  
      methods: {
        // add new category
        addNewPlace(){
          this.newPlace = true;
          this.new_place_name = "";
        },
  
        save() {
            this.cancel()
        //   let that = this;
        //   that.$nuxt.$loading.start();
        //   that.editedItem.name = that.new_category_name;
        //   that.editedItem.type = that.typeCategory;
        //   that.editedItem.added_from = that.addedFrom;
        //   that.$store.dispatch('categoriesV2/store', that.editedItem).then(result => {
        //     that.listArray.push(result.data);
        //     that.$emit('getNewPlace', {
        //       newPlaceId: result.data.id,
        //     });
        //     that.$nuxt.$loading.finish();
        //     that.$toaster.success(that.$i18n.t('message.success_category_add_new'));
        //   }).catch(() => {
        //     that.$toaster.error(that.$i18n.t('message.fail_category_add_new'));
        //     that.$nuxt.$loading.finish();
        //   });
        //   that.newCategory = false;
        },
  
        cancel() {
          this.newPlace = false;
        },
      }
    };
  </script>
  
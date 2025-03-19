<template>
  <div>
    <v-dialog
      v-model="openPopup"
      scrollable
      max-width="1125px"
      persistent
    >
      <v-card>
        <v-card-text>
          <div class="popup-header text-center">
            {{ $t('title.review_sub_goal') }}
          </div>
          <div class="review-popup">
            <div class="review-popup-table normal-table">
              <!-- Name -->
              <div class="info-block w-50">
                <div class="label-item">
                  {{ $t('form.name') }}:
                </div>
                <div class="input-wrap w-100">
                  <v-text-field
                    v-model="editedItem.name"
                    :rules="required"
                    outlined
                  />
                </div>
              </div>

              <!-- Category -->
              <div class="info-block w-50">
                <div class="label-item">
                  {{ $t('form.category') }}:
                </div>
                <div class="w-100">
                  <Category
                    :object-item="editedItem"
                    :type-category="'goal'"
                    @getNewCategory="getNewCategory"
                  />
                </div>
              </div>

              <!-- Description -->
              <div class="info-block">
                <div class="label-item">
                  {{ $t('form.description') }}:
                </div>
                <div class="input-wrap form-description">
                  <FroalaSuggestionListEditor
                    :item="editedItem"
                    :predefined-link-array="predefinedLinkArray"
                  />
                </div>
              </div>

              <!-- Start date -->
              <div v-if="!checkSuperAdmin" class="info-block w-50">
                <div class="label-item">
                  {{ $t('form.start_date') }}:
                </div>
                <div>
                  <StartDateEdit
                    :object-item="editedItem"
                    @changeDate="changeStartDate"
                  />
                </div>
              </div>

              <!-- Deadline -->
              <div v-if="!checkSuperAdmin" class="info-block w-50">
                <div class="label-item">
                  {{ $t('form.deadline') }}:
                </div>
                <div>
                  <DeadlineEdit
                    :object-item="editedItem"
                    :item="editedItem"
                    :change-custom="changeDeadlineCustom"
                  />
                </div>
              </div>
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="popup-footer">
          <v-spacer />
          <v-btn class="btn-cancel" text @click="close">
            {{ $t('button.cancel') }}
          </v-btn>
          <v-btn
            class="btn-save"
            @click="save"
          >
            {{ $t('button.save') }}
          </v-btn>

          <!-- Delete object -->
<!--          <v-btn-->
<!--            v-if="checkAdmin || checkCreator"-->
<!--            class="hse-btn-delete"-->
<!--            text-->
<!--            @click="viewDeleteConfirmPopup(editedItem, true)"-->
<!--          >-->
<!--            <v-icon dark>-->
<!--              mdi-delete-->
<!--            </v-icon>-->
<!--          </v-btn>-->
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import {_} from 'vue-underscore';
  import cookies from "js-cookie";
  import FroalaSuggestionListEditor from "./FroalaSuggestionListEditor";
  import StartDateEdit from "./StartDateEdit";
  import DeadlineEdit from "./DeadlineEdit";
  import CategoryInReviewPopup from "./CategoryInReviewPopup";

  export default {
    name: "SubGoalEdit",
    components: {
      FroalaSuggestionListEditor,
      Category: CategoryInReviewPopup,
      StartDateEdit,
      DeadlineEdit,
    },
    props: {
      openPopup: Boolean,
      objectItem: {
        type: Object,
        required: true,
      },
      predefinedLinkArray: {
        type: Array,
        required: true,
      },
      resource: {
        type: Boolean,
        required: false,
      },
    },
    data: () => ({
      checkSuperAdmin: cookies.get('checkSuperAdmin'),
      checkAdmin: cookies.get('checkAdmin'),
      valid: true,
      required: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else return true;
        }
      ],
      changeDeadlineCustom: false,
      checkResource: false,
      editedItem: {},
      categoriesValidArray: [],
    }),

    computed: {},

    watch: {
      openPopup(value) {
        if (value) {
          if (this.objectItem) {
            let categoryId = this.objectItem.category_id;
            this.categoriesValidArray = _.filter(this.categoriesArray, function (item) {
              return (!item.disable_status || (item.disable_status && item.id === categoryId));
            });
            this.editItem(this.objectItem);
          }
        }
      },

      resource(value) {
        if (value) {
          this.checkResource = value;
        }
      },
    },

    created() {
      if (this.openPopup) {
        if (this.objectItem) {
          this.editItem(this.objectItem);
        }
      }

      if (this.resource) {
        this.checkResource = this.resource;
      }
    },

    methods: {
      editItem(item) {
        this.editedItem = Object.assign({}, item);
      },

      close() {
        if (this.openPopup) {
          this.$emit('closePopup');
        }
      },

      getNewCategory(value) {
        this.editedItem.category_id = value.newCategoryId;
      },

      changeStartDate(val) {
        this.changeDeadlineCustom = val.changed;
      },

      reloadList() {
        this.$emit('reloadList');
      },

      viewItem() {
        this.$emit('viewItem');
      },

      save() { // update sub-goal
        let that = this;
        that.$nuxt.$loading.start();
        that.editedItem.requestEdit = true;
        if (!that.editedItem.is_template) {
          that.editedItem.isDefaultResponsible = false;
          if (!that.editedItem.attendee_all) { // if not select All
            that.editedItem.attendee_all = false;
          }
          that.editedItem.responsible_required_comment = false;
          that.editedItem.responsible_required_attachment = false;
          that.editedItem.attendee_required_comment = false;
          that.editedItem.attendee_required_attachment = false;
          // time
          that.editedItem.start_date = that.editedItem.start_date_pre;
          that.editedItem.start_time = that.editedItem.start_time_pre;
          that.editedItem.deadline = that.editedItem.deadline_pre;
          that.editedItem.end_time = that.editedItem.end_time_pre;
        } else {
          if (that.checkSuperAdmin) {
            that.editedItem.industry = JSON.parse(that.editedItem.industry);
          }
        }
        that.$store.dispatch('objects/update', that.editedItem).then(function () {
          that.reloadList();
          that.viewItem();
          // that.reloadListCategory();
          that.$toaster.success(that.$i18n.t('message.success_goal_update'));
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_goal_update'));
          }
          that.$nuxt.$loading.finish();
        });
        that.close();
      },
    },
  };
</script>

<style scoped>

</style>

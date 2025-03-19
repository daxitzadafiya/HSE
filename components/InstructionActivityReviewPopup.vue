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
            {{ $t('title.review_instruction_activity') }}
          </div>
          <div class="review-popup">
            <div class="review-popup-table normal-table">
              <!-- Name -->
              <div class="info-block w-50">
                <div class="label-item">
                  {{ $t('form.name') }}:
                </div>
                <div class="info-item">
                  {{ editedItem.name }}
                </div>
              </div>

              <!-- Added by -->
              <div class="info-block w-50">
                <div class="label-item">
                  {{ $t('form.added_by') }}:
                </div>
                <div class="info-item">
                  {{ editedItem.addedByName }}
                </div>
              </div>

              <!-- Description -->
              <div class="info-block description">
                <div class="label-item">
                  {{ $t('form.description') }}:
                </div>
                <div class="info-item">
                  {{ editedItem.description }}
                </div>
              </div>

              <!-- Responsible -->
              <div v-if="!resource" class="info-block chip">
                <div class="label-item">
                  {{ $t('form.responsible') }}:
                </div>
                <div class="info-item">
                  <v-chip
                    v-for="(item, index) in responsibleName"
                    :key="index"
                    class="mr-2 mb-1 chip-custom"
                    small
                  >
                    {{ item }}
                  </v-chip>
                </div>
              </div>
            </div>

            <!-- Attendee -->
            <div v-if="!resource && (checkCreator || checkResponsible)" class="table-expand-show-attendee review-table p-3">
              <div class="title-expand pb-5">
                {{ $t('form.attendee') }}
              </div>
              <b-row class="expand">
                <b-col v-for="(i, index) in editedItem.processingInfo" :key="index" cols="6" class="expand-item">
                  <div>
                    {{ i.attendeeName }}
                  </div>
                </b-col>
              </b-row>
            </div>

<!--            <div-->
<!--              v-if="checkCreator || checkResponsible"-->
<!--              class="review-popup-table"-->
<!--            >-->
<!--              <v-data-table-->
<!--                :headers="computedHeaders"-->
<!--                :items="editedItem.processingInfo"-->
<!--                class="elevation-1 review-table"-->
<!--                :items-per-page="15"-->
<!--                :single-expand="true"-->
<!--                :sort-by="['created_at']"-->
<!--                :sort-desc="[true, false]"-->
<!--                hide-default-header-->
<!--                hide-default-footer-->
<!--              >-->
<!--                <template v-slot:top>-->
<!--                  <v-toolbar flat>-->
<!--                    <v-toolbar-title>-->
<!--                      {{ $t('form.attendee') }}-->
<!--                    </v-toolbar-title>-->
<!--                  </v-toolbar>-->
<!--                </template>-->
<!--                <template v-slot:no-data>-->
<!--                  {{ $t('table.no_data') }}-->
<!--                </template>-->
<!--              </v-data-table>-->
<!--            </div>-->
          </div>
        </v-card-text>
        <v-card-actions class="popup-footer">
          <v-spacer />
          <v-btn class="btn-cancel" text @click="close">
            {{ $t('button.cancel') }}
          </v-btn>
          <v-btn
            v-if="checkCreator || checkResponsible"
            class="btn-save"
            @click="viewActivity"
            :disabled="!!planAccess?.lastPlanAccess?.instruction">
            {{ $t('button.edit') }}
          </v-btn>

          <!-- Delete object -->
          <v-btn
            v-if="checkCreator || checkResponsible"
            class="hse-btn-delete"
            text
            @click="viewDeleteConfirmPopup(editedItem, true)"
          >
            <v-icon dark>
              mdi-delete
            </v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Edit activity popup -->
    <InstructionActivityPopup
      v-if="editMode"
      :open-popup="isEdit"
      :object-item="editedActivityItem"
      :predefined-link-array="predefinedLinkArray"
      :edit-mode="true"
      :resource="resource"
      @viewItem="viewItem(editedItem)"
      @closePopup="isEdit = !isEdit"
    />

    <!-- Popup delete confirm -->
    <DeleteConfirmPopup
      :open-popup="dialogDelete"
      :object-index="editedIndex"
      :is-object="isDeleteObject"
      @closePopup="dialogDelete = !dialogDelete"
      @deleteItem="deleteItem"
    />
  </div>
</template>

<script>
  import {_} from 'vue-underscore';
  import cookies from "js-cookie";
  import DeleteConfirmPopup from "./DeleteConfirmPopup";
  import InstructionActivityPopup from "./InstructionActivityPopup";

  export default {
    name: "InstructionActivityReviewPopup",
    components: {
      DeleteConfirmPopup,
      InstructionActivityPopup,
    },
    props: {
      openPopup: Boolean,
      objectItem: {
        type: Object,
        required: true,
      },
      predefinedLinkArray: {
        type: Array,
        required: false,
      },
      resource: {
        type: Boolean,
        required: false,
      },
    },
    data: () => ({
      checkSuperAdmin: cookies.get('checkSuperAdmin'),
      planAccess: JSON.parse(localStorage.getItem('planAccess')),
      checkAdmin: cookies.get('checkAdmin'),
      userLogged: parseInt(cookies.get('userID')),
      isEdit: false,
      hoverQuestionMark: false,
      checkCreator: false,
      checkResponsible: false,
      checkAttendee: false,
      editedItem: {},
      editedActivityItem: {},
      dialogDelete: false,
      editedIndex: 0,
      isDeleteObject: false,
      responsibleName: [],
      isObject: false,
      editMode: false,
    }),

    computed: {},

    watch: {
      openPopup(value) {
        if (value) {
          if (this.objectItem) {
            this.viewItem(this.objectItem);
          }
        }
      },
    },

    mounted() {},

    created() {
      if (this.openPopup) {
        if (this.objectItem) {
          this.viewItem(this.objectItem);
        }
      }
    },

    methods: {
      viewItem(item) {
        let that = this;
        // that.formDirty = false;
        that.$nuxt.$loading.start();
        that.$store.dispatch('objects/show', item.id).then(result => {
          that.editedItem = Object.assign({}, result.data);
          that.checkCreator = _.contains(result.data.role, 'creator');
          that.checkResponsible = _.contains(result.data.role, 'responsible');
          that.checkAttendee = _.contains(result.data.role, 'attendee');
          if (!that.editedItem.is_template) {
            that.responsibleName = result.data.responsible['employeeName'];
            that.editedItem.responsible_employee_array = JSON.parse(that.editedItem.responsible['employee_array']);
          }
          // that.editedItem.historyArray = _.sortBy(result.data.history, function(o) { return o.updated_at; });
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_instruction_view_detail'));
          }
          that.$nuxt.$loading.finish();
        });
      },

      viewActivity() {
        if (this.checkCreator || this.checkResponsible) {
          this.editMode = this.isEdit = true;
          this.editedActivityItem = Object.assign({}, this.editedItem);
        }
      },

      viewDeleteConfirmPopup(item, isObject) {
        this.editedIndex = item.id;
        this.isDeleteObject = isObject;
        this.dialogDelete = true;
      },

      translateCol (colName) {
        return this.$i18n.t('column.' + colName);
      },

      close() {
        if (this.editMode) {
          this.$emit('viewInstructionDetail');
          this.editMode = false;
        }
        if (this.openPopup) {
          this.$emit('closePopup');
        }
      },

      reloadList() {
        this.$emit('reloadList');
      },

      deleteItem(val) {
        let that = this;
        that.$store.dispatch('objects/delete', val.index).then(function() {
          that.reloadList();
          that.$toaster.success(that.$i18n.t('message.success_instruction_delete'));
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_instruction_delete'));
          }
          that.$nuxt.$loading.finish();
        });
        that.dialogDelete = false;
        if (val.isObject) {
          that.close();
        } else {
          that.viewItem(that.editedItem);
        }
      },
    },
  };
</script>

<style scoped>

</style>

<template>
  <div class="pt-5 mb-0">
    <b-row v-if="!deviationItem.is_place">
      <b-col cols="3">
        <div class="bold-title md-line-height">
          {{ $t('form.place') }}
        </div>
      </b-col>
      <b-col cols="4">
        <div class="input-wrap">
          <div class="switch-component default-question-mark">
            <label class="left-text">{{ $t('form.none') }}</label>
            <v-switch
              v-model="deviationItem.is_place"
              :label="$t('form.activate')"
              :readonly="!deviationItem.editPermission"
              inset
              class="right-text"
            />
          </div>
        </div>
      </b-col>
    </b-row>
    <div v-else class="section-connect-to section-connect-to-reminder mt-4">
      <div class="section-connect-to-label section-connect-to-label-reminder d-flex justify-content-between">
        <div>{{ $t('form.place') }}</div>
        <!-- <v-icon class="ml-5 mr-n8 bg-white" :class="newPlace ? '' : 'icon-plus-circle'" @click="addPlace" v-if="checkAdmin">
          mdi-plus-circle
        </v-icon> -->
        <v-icon class="ml-5 mr-n8 bg-white" :class="newPlace ? '' : 'icon-plus-circle'" @click="addPlace">
          mdi-plus-circle
        </v-icon>
      </div>
      <div class="switch-component switch-component-small reminder-type-switch default-question-mark">
        <label class="left-text">{{ $t('form.none') }}</label>
        <v-switch
          v-model="deviationItem.is_place"
          :label="$t('form.activate')"
          inset
          class="right-text"
          :readonly="!deviationItem.editPermission"
        />
      </div>
      <b-row v-if="!newPlace" class="pt-3 mt-2 ml-2 pr-3">
        <b-col cols="6">
          <v-select
            v-model="deviationItem.place"
            :items="placeArray"
            item-value="id"
            item-text="place_name"
            :rules="required"
            :label="$t('form.place')"
            :readonly="editMode"
            outlined
          />
        </b-col>
        <b-col>
          <v-text-field
              v-model="deviationItem.place_detail"
              :label="$t('form.place_detail')"
              :readonly="editMode"
              rows="3"
              :rules="required"
              outlined
              auto-grow
            />
        </b-col>
      </b-row>
      <b-row v-else class="pt-3 mt-2 ml-2 align-center">
        <b-col cols="10">
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
          <v-text-field
            v-model="newPlaceName"
            :label="$t('form.place')"
            class="new-department-input"
            type="text"
            :rules="required"
            outlined
          />
          </v-form>
        </b-col>
        <b-col cols="2">
          <div class="mt-n4 icon-flex">
            <v-icon class="icon-plus-circle ml-4"  @click="save">
              mdi-check-circle
            </v-icon>
            <!-- <v-icon class="icon-plus-circle ml-4" v-if="checkIcon">
              mdi-check-circle
            </v-icon> -->
            <v-icon class="icon-close-circle ml-2" @click="cancel">
              mdi-close-circle
            </v-icon>
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
  import cookies from "js-cookie";
  // import {_} from 'vue-underscore';

  export default {
    name: 'DeviationPlace',
    props: {
      // isOpenPopup: Boolean,
      deviationItem: {
        type: Object,
        required: false,
      },
      editMode: {
        type: Boolean,
        required: false,
      },
      placeArray: {
        type: Array,
        required: false,
      }
    },

    data: () => ({
      userRoleId: parseInt(cookies.get('roleID')),
      permissionsUser: localStorage.getItem('permissionsKey'),
        checkSuperAdmin: cookies.get('checkSuperAdmin'),
        checkAdmin: cookies.get('checkAdmin'),
        roleUser: cookies.get('roleUser'),
      valid: true,
      newPlaceName: '',
      // places: [],
      newPlace: false,
      // checkIcon:false,
      required: [
        (v) => {
          if (!v || v.length < 1) return 'This is required';
          else return true;
        },
      ],
      editedPlaces: {
        place_name: '',
        added_by:'',
        company_id:''
      },
    }),
    methods: {
       addPlace(){
        this.newPlace = true;
        this.newPlaceName = "";
      },
      save() {
        let that = this;
        if (this.$refs.form.validate()) {
        that.$nuxt.$loading.start();

        that.editedPlaces.place_name = that.newPlaceName;
        that.editedPlaces.added_by = that.userRoleId
        that.editedPlaces.company_id = that.deviationItem.company_id;
        that.editedPlaces.is_deleted = '';
        that.$store.dispatch('places/store', that.editedPlaces).then(result => {
          that.placeArray.push(result.data),
          that.$emit('getNewPlace', {
            newPlaceId: result.data.id,
          });
          that.$nuxt.$loading.finish();
          that.$toaster.success(that.$i18n.t('message.success_add_place'));
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_add_place'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
        // that.checkIcon=true
        that.newPlace = false;
        }
      },
      cancel() {
        this.newPlace = false;
      },
    },
  };
</script>
<style scoped>
  .default-question-mark {
    max-width: 50px;
  }
  .plus-icon {
    width: 25px;
    height: 25px;
    background-color: #85a33d;
    margin-left: 25px;
    border-radius: 100%;
    font-size: 30px;
    line-height: 0.9;
    color: #fff;
  }

  .plus-icon-gray {
    width: 25px;
    height: 25px;
    background-color: #9f9f9f;
    margin-left: 10px;
    border-radius: 100%;
    font-size: 25px;
    line-height: 25px;
    color: #fff;
  }

  .icon-plus-circle:before {
    color: #87a53a;
    background: #fff;
  }

  .icon-close-circle:before {
    color: #f44336;
  }

  :deep(.v-select__slot) {
    height: 50px;
  }

  :deep(.section-connect-to .section-connect-to-label) {
    left: 40px;
  }

  :deep(.switch-component.switch-component-small) {
    padding-left: 65px;
  }

  :deep(.section-connect-to .section-connect-to-label.section-connect-to-label-reminder) {
    width: 245px;
  }
</style>

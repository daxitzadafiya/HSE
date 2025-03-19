<template>
    <div class="pt-5 mb-0">
      <b-row v-if="!deviationItem.is_consequence">
          <b-col cols="3">
            <div class="bold-title  md-line-height">
              {{ $t('form.consequence') }}
            </div>
          </b-col>
          <b-col cols="4">
            <div class="input-wrap">
              <div class="switch-component default-question-mark">
                <label class="left-text">{{ $t('form.none') }}</label>
                <v-switch
                  v-model="deviationItem.is_consequence"
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
        <div>{{ $t('form.consequence') }}</div>
        <!-- <v-icon class="ml-5 mr-n8 bg-white" :class="newConsequence ? '' : 'icon-plus-circle'" @click="addConsequence" v-if="checkAdmin">
          mdi-plus-circle
        </v-icon> -->
        <v-icon class="ml-5 mr-n8 bg-white" :class="newConsequence ? '' : 'icon-plus-circle'" @click="addConsequence">
          mdi-plus-circle
        </v-icon>
      </div>
        <div class="switch-component switch-component-small reminder-type-switch default-question-mark">
          <label class="left-text">{{ $t('form.none') }}</label>
          <v-switch
            v-model="deviationItem.is_consequence"
            :label="$t('form.activate')"
            inset
            class="right-text"
            :readonly="!deviationItem.editPermission"
          />
        </div>
        <b-row v-if="!newConsequence" class="pt-3 mt-2 ml-2 pr-3">
          <b-col  cols="6">
                  <v-select
                    v-model="deviationItem.consequence_for"
                    :items="consequenceArray"
                    item-value="id"
                    item-text="name"
                    :rules="required"
                    :label="$t('form.consequence')"
                    :readonly="editMode"
                    outlined
                  />
          </b-col>
          <b-col>
          <v-text-field
              v-model="deviationItem.consequence_detail"
              :label="$t('form.consequence_detail')"
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
            v-model="newSequenceName"
            :label="$t('form.consequence')"
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
    name: 'DeviationConsequence',
    props: {
        deviationItem: {
        type: Object,
        required: false,
      },
      editMode: {
        type: Boolean,
        required: false,
      },
      consequenceArray:{
        type:Array,
        required:false,
      }
    },

    data: () => ({
      valid: true,
      userRoleId: parseInt(cookies.get('roleID')),
       permissionsUser: localStorage.getItem('permissionsKey'),
        checkSuperAdmin: cookies.get('checkSuperAdmin'),
        checkAdmin: cookies.get('checkAdmin'),
        roleUser: cookies.get('roleUser'),
      newSequenceName: '',
      newConsequence: false,
      // checkIcon:false,
      required: [
        (v) => {
          if (!v || v.length < 1) return 'This is required'
          else return true
        },
      ],
       editedSequence: {
        name: "",
        added_by:'',
        company_id:''
      },
    }),
    methods: {
       addConsequence(){
        this.newConsequence = true;
        this.newSequenceName = "";
      },
      save() {
        let that = this;
        if (this.$refs.form.validate()) {
        that.$nuxt.$loading.start();

        that.editedSequence.name = that.newSequenceName;
        that.editedSequence.added_by = that.userRoleId;
        that.editedSequence.company_id = that.deviationItem.company_id;
        that.editedSequence.is_deleted = '';
        that.$store.dispatch('consequences/store', that.editedSequence).then(result => {
          that.consequenceArray.push(result.data),
          that.$emit('getNewSequence', {
            newSequenceId: result.data.id,
          });
          that.$nuxt.$loading.finish();
          that.$toaster.success(that.$i18n.t('message.success_add_consequence'));
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_add_consequence'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
        // that.checkIcon=true
        that.newConsequence = false;
      }
      },
      cancel() {
        this.newConsequence = false;
      },
    },
  }
  </script>
  <style scoped>
  .default-question-mark{
    max-width: 50px;
  }
:deep(.switch-component.switch-component-small){
  left: 115px;
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

  /* :deep(.section-connect-to .section-connect-to-label) {
    left: 40px;
  } */


  /* :deep(.section-connect-to .section-connect-to-label.section-connect-to-label-reminder) {
    width: 245px;
  } */
</style>

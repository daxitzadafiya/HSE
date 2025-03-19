<template>
  <div class="pt-4 pb-4 d-flex align-center  col-12">
      <b-row class="col-12 px-0 justify-content-between">
        <div class="col-7 row">
          <b-col cols="4" class="p-0">
            <div class="bold-title md-line-height">
              {{ $t('form.create_a_routine') }}
            </div>
          </b-col>
          <b-col cols="3" class="p-0 ml-n3">
            <div class="switch-component switch-component-yes-no default-question-mark">
              <label class="left-text">{{ $t('form.no') }}</label>
              <v-switch
              v-model="is_create_routine"
              :label="$t('form.yes')"
              inset
              class="right-text"
              @change="is_routine(is_create_routine)"
              :disabled="!!planAccess?.lastPlanAccess?.routine || ! planAccess?.planAccess?.routine"/>
              <v-hover v-model="hoverRoutinePlanAccess">
                <v-badge
                  :value="hoverRoutinePlanAccess" v-if="!!planAccess?.lastPlanAccess?.routine || ! planAccess?.planAccess?.routine"
                  right
                  transition="slide-x-transition"
                  class="hse--icon-question-circle"
                  style="cursor: pointer;">
                    <span slot="badge" @click="redirectUrl">{{ $t('message.accessible_module') }}</span>
              <i class="fa fa-question-circle"></i>
            </v-badge>
          </v-hover>
            </div>
          </b-col>
        </div>
        <b-col v-if="is_create_routine" cols="5" class="d-flex p-0">
              <div class="bold-title md-line-height">
                {{ $t('form.recurring') }}
              </div>
              <v-badge
                    :value="hoverRecurring"
                    right
                    transition="slide-x-transition"
                    class="hse-badge-icon"
                  >
                  <span slot="badge">{{ $t('message.hover_recurring') }}</span>
                  <v-hover v-model="hoverRecurring">
                    <i class="fa fa-question-circle"></i>
                  </v-hover>
              </v-badge>
              <div class="input-wrap">
                <div class="switch-component document-type-wrap default-question-mark">
                  <label class="left-text">{{ $t('form.reminder') }}</label>
                  <v-switch
                    v-model="is_recurring"
                    :label="$t('form.task')"
                    class="right-text ml-7"
                    inset
                    @change="recurring(is_recurring)"
                  />
                </div>
              </div>
        </b-col>
      </b-row>
  </div>
</template>
<script>
import cookies from 'js-cookie';

export default {
    name: "create-as-routine",
    props: {
    objectItem: {
      type: Object,
      required: false,
    },
  },
  data: () => ({
      planAccess: JSON.parse(localStorage.getItem('planAccess')),
      roleUser: cookies.get('roleUser'),
      is_create_routine: false,
      is_recurring: false,
      hoverRecurring:false,
      hoverRoutinePlanAccess:false
  }),
  methods: {
    redirectUrl(){
      if (this.roleUser == 'company admin') {
              this.$router.push('/settings/billings/');
          }
    },
    is_routine(is_routine){
        this.objectItem.is_routine=is_routine
        this.$emit('changeRecurring',is_routine)
    },
    recurring(is_recurring){
      console.log(is_recurring);
      this.objectItem.is_recurring=is_recurring 
    }
  }   
}
</script>
<style scoped>
.switch-component-yes-no{
  padding-left: 100px;
}
.row+.row{
  margin-top: 0 !important;
}
</style>

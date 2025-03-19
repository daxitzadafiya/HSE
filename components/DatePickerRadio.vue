<template>
  <div class="input-wrap">
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
      class="mt-0"
    >
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        min-width="450px"
        :disabled="!data.editPermission"
      >
        <template v-slot:activator="{ on }">
<!--          <v-text-field-->
<!--            v-if="viewOnly"-->
<!--            v-model="data.deadline"-->
<!--            placeholder="DD.MM.YYYY"-->
<!--            outlined-->
<!--            readonly-->
<!--            :label="$t('form.due_date')"-->
<!--            :rules="required"-->
<!--          />-->
          <v-text-field
            v-if="data.recurring === 'indefinite'"
            v-model="data.recurring"
            placeholder="DD.MM.YYYY"
            outlined
            readonly
            class="input-text-transform capitalize"
            :label="$t('form.due_date')"
            v-on="on"
          />
          <v-text-field
            v-else
            v-model="data.deadline"
            placeholder="DD.MM.YYYY"
            outlined
            readonly
            :label="$t('form.due_date')"
            v-on="on"
          />
        </template>
        <v-date-picker
          v-model="data.deadline"
          first-day-of-week="1"
          :readonly="data.recurring === 'indefinite'"
          class="picker-custom-1"
          @input="menu = true"
        >
          <v-spacer />
          <v-btn text @click="data.deadline = '', data.recurring = '', menu = false">
            Clear
          </v-btn>
          <v-btn class="btn-custom-green" @click="apply">
            {{ $t('button.apply') }}
          </v-btn>
        </v-date-picker>
        <v-radio-group
          v-model="data.recurring"
          column
          class="radio-group-custom-1"
        >
          <label class="radio-label-custom">Recurring activity</label>
          <v-radio
            v-for="recurring in recurringArray"
            :key="recurring.value"
            :label="recurring.name"
            :value="recurring.value"
          />
        </v-radio-group>
      </v-menu>
    </v-form>
  </div>
</template>
<script>
  export default {
    props: {
      data: Object,
      recurringArray:{
        type:[Array,Object],
        required:false,
      },
      // isRoutine: {
      //   type: Boolean,
      //   required: false,
      // },
      viewOnly: {
        type: Boolean,
        required: false,
      },
    },
    data: () => ({
      valid: true,
     
      menu: false,
      required: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else return true;
        }
      ],
    }),

    methods: {
      apply() {
        let that = this;
        if (that.$refs.form.validate()) {
          that.menu = false;
        }
      },
    },
  };
</script>

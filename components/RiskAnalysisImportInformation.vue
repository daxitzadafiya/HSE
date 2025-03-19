<template>
  <div class="p-3 risk-analysis-import mb-4">
    <div class="bold-title">
      {{ $t('form.import_information_from_risk_analysis') }}
    </div>
    <b-row class="mt-2">
      <b-col
        v-for="item in listArray"
        :key="item.id"
        cols="6"
      >
        <v-expansion-panels>
          <v-expansion-panel class="risk-expansion-panel">
            <v-expansion-panel-header class="pt-0 pb-0">
              <v-checkbox
                v-model="chooseRisk"
                :label="item.name"
                :value="item.id"
                :rules="required"
                multiple
                @change="process(chooseRisk)"
              />
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <b-row class="p-2 align-center">
                <!-- Type -->
                <b-col cols="4" class="label-item">
                  {{ $t('column.type') }}:
                </b-col>
                <b-col cols="8">
                  {{ $t('form.report') }}
                </b-col>

                <!-- Color -->
                <b-col cols="4" class="label-item">
                  {{ $t('column.color_code') }}:
                </b-col>
                <b-col cols="8">
                  <div v-if="item.risk_level && item.risk_level >= 1 && item.risk_level <= 3" class="source-of-danger-color-code color-green d-inline-block text-center">
                    {{ item.risk_level }}
                  </div>
                  <div v-if="item.risk_level && item.risk_level >= 4 && item.risk_level <= 10" class="source-of-danger-color-code color-yellow d-inline-block text-center">
                    {{ item.risk_level }}
                  </div>
                  <div v-if="item.risk_level && item.risk_level >= 11 && item.risk_level <= 15" class="source-of-danger-color-code color-orange d-inline-block text-center">
                    {{ item.risk_level }}
                  </div>
                  <div v-if="item.risk_level && item.risk_level === 16" class="source-of-danger-color-code color-red d-inline-block text-center">
                    {{ item.risk_level }}
                  </div>
                </b-col>

                <!-- Probability -->
                <b-col cols="4" class="label-item">
                  {{ $t('column.probability') }}:
                </b-col>
                <b-col cols="8">
                  {{ translateLevel(item.probability) }}
                </b-col>

                <!-- Consequence -->
                <b-col cols="4" class="label-item">
                  {{ $t('column.consequence') }}:
                </b-col>
                <b-col cols="8">
                  {{ translateLevel(item.consequence) }}
                </b-col>

                <!-- Comment -->
                <b-col cols="4" class="label-item">
                  {{ $t('column.comment') }}:
                </b-col>
                <b-col cols="8">
                  {{ item.comment }}
                </b-col>
              </b-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </b-col>
    </b-row>
  </div>
<!--  <div>-->
<!--    <div class="mt-3">-->
<!--      <b-row class="mt-2">-->
<!--        <b-col-->
<!--          v-for="item in listArray"-->
<!--          :key="item.id"-->
<!--          cols="6"-->
<!--        >-->
<!--          <table></table>-->
<!--        </b-col>-->
<!--      </b-row>-->
<!--      <v-data-table-->
<!--        :headers="headers"-->
<!--        :items="listArray"-->
<!--        class="elevation-1"-->
<!--        :items-per-page="15"-->
<!--        :sort-by="['created_at']"-->
<!--        :sort-desc="[true, false]"-->
<!--        hide-default-footer-->
<!--        item-key="name"-->
<!--      >-->
<!--        <template v-slot:top>-->
<!--          <v-toolbar flat>-->
<!--            <v-toolbar-title>-->
<!--              {{ $t('form.import_information_from_risk_analysis') }}-->
<!--            </v-toolbar-title>-->
<!--          </v-toolbar>-->
<!--        </template>-->
<!--        <template v-slot:item.name="{ item }">-->
<!--          <v-expansion-panels>-->
<!--            <v-expansion-panel class="risk-expansion-panel">-->
<!--              <v-expansion-panel-header class="pt-0 pb-0">-->
<!--                <v-checkbox-->
<!--                  v-model="chooseRisk"-->
<!--                  :label="item.name"-->
<!--                  :value="item.id"-->
<!--                />-->
<!--              </v-expansion-panel-header>-->
<!--              <v-expansion-panel-content>-->
<!--                <b-row class="p-2">-->
<!--                  &lt;!&ndash; Type &ndash;&gt;-->
<!--                  <b-col cols="4" class="label-item">-->
<!--                    <b>{{ $t('column.type') }}:</b>-->
<!--                  </b-col>-->
<!--                  <b-col cols="8">-->
<!--                    {{ $t('form.report') }}-->
<!--                  </b-col>-->

<!--                  &lt;!&ndash; Color &ndash;&gt;-->
<!--                  <b-col cols="4" class="label-item">-->
<!--                    <b>{{ $t('column.color_code') }}:</b>-->
<!--                  </b-col>-->
<!--                  <b-col cols="8">-->
<!--                    <v-chip :color="item.colorCode" outlined>-->
<!--                      {{ item.point }}-->
<!--                    </v-chip>-->
<!--                  </b-col>-->

<!--                  &lt;!&ndash; Probability &ndash;&gt;-->
<!--                  <b-col cols="4" class="label-item">-->
<!--                    <b>{{ $t('column.probability') }}:</b>-->
<!--                  </b-col>-->
<!--                  <b-col cols="8">-->
<!--                    {{ item.probability }}-->
<!--                  </b-col>-->

<!--                  &lt;!&ndash; Consequence &ndash;&gt;-->
<!--                  <b-col cols="4" class="label-item">-->
<!--                    <b>{{ $t('column.consequence') }}:</b>-->
<!--                  </b-col>-->
<!--                  <b-col cols="8">-->
<!--                    {{ item.consequence }}-->
<!--                  </b-col>-->

<!--                  &lt;!&ndash; Comment &ndash;&gt;-->
<!--                  <b-col cols="4" class="label-item">-->
<!--                    <b>{{ $t('column.comment') }}:</b>-->
<!--                  </b-col>-->
<!--                  <b-col cols="8">-->
<!--                    {{ item.comment }}-->
<!--                  </b-col>-->
<!--                </b-row>-->
<!--              </v-expansion-panel-content>-->
<!--            </v-expansion-panel>-->
<!--          </v-expansion-panels>-->
<!--        </template>-->
<!--&lt;!&ndash;        <template v-slot:expanded-item="{ headers, item }">&ndash;&gt;-->
<!--&lt;!&ndash;          <td :colspan="headers.length">&ndash;&gt;-->
<!--&lt;!&ndash;            <b-row class="p-3">&ndash;&gt;-->
<!--&lt;!&ndash;              &lt;!&ndash; Type &ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;              <b-col cols="4" class="label-item">&ndash;&gt;-->
<!--&lt;!&ndash;                {{ $t('column.type') }}:&ndash;&gt;-->
<!--&lt;!&ndash;              </b-col>&ndash;&gt;-->
<!--&lt;!&ndash;              <b-col cols="8">&ndash;&gt;-->
<!--&lt;!&ndash;                {{ $t('form.report') }}&ndash;&gt;-->
<!--&lt;!&ndash;              </b-col>&ndash;&gt;-->

<!--&lt;!&ndash;              &lt;!&ndash; Color &ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;              <b-col cols="4" class="label-item">&ndash;&gt;-->
<!--&lt;!&ndash;                {{ $t('column.color_code') }}:&ndash;&gt;-->
<!--&lt;!&ndash;              </b-col>&ndash;&gt;-->
<!--&lt;!&ndash;              <b-col cols="8">&ndash;&gt;-->
<!--&lt;!&ndash;                <v-chip :color="item.colorCode" outlined>&ndash;&gt;-->
<!--&lt;!&ndash;                  {{ item.point }}&ndash;&gt;-->
<!--&lt;!&ndash;                </v-chip>&ndash;&gt;-->
<!--&lt;!&ndash;              </b-col>&ndash;&gt;-->

<!--&lt;!&ndash;              &lt;!&ndash; Probability &ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;              <b-col cols="4" class="label-item">&ndash;&gt;-->
<!--&lt;!&ndash;                {{ $t('column.probability') }}:&ndash;&gt;-->
<!--&lt;!&ndash;              </b-col>&ndash;&gt;-->
<!--&lt;!&ndash;              <b-col cols="8">&ndash;&gt;-->
<!--&lt;!&ndash;                {{ item.probability }}&ndash;&gt;-->
<!--&lt;!&ndash;              </b-col>&ndash;&gt;-->

<!--&lt;!&ndash;              &lt;!&ndash; Consequence &ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;              <b-col cols="4" class="label-item">&ndash;&gt;-->
<!--&lt;!&ndash;                {{ $t('column.consequence') }}:&ndash;&gt;-->
<!--&lt;!&ndash;              </b-col>&ndash;&gt;-->
<!--&lt;!&ndash;              <b-col cols="8">&ndash;&gt;-->
<!--&lt;!&ndash;                {{ item.consequence }}&ndash;&gt;-->
<!--&lt;!&ndash;              </b-col>&ndash;&gt;-->

<!--&lt;!&ndash;              &lt;!&ndash; Comment &ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;              <b-col cols="4" class="label-item">&ndash;&gt;-->
<!--&lt;!&ndash;                {{ $t('column.comment') }}:&ndash;&gt;-->
<!--&lt;!&ndash;              </b-col>&ndash;&gt;-->
<!--&lt;!&ndash;              <b-col cols="8">&ndash;&gt;-->
<!--&lt;!&ndash;                {{ item.comment }}&ndash;&gt;-->
<!--&lt;!&ndash;              </b-col>&ndash;&gt;-->
<!--&lt;!&ndash;            </b-row>&ndash;&gt;-->
<!--&lt;!&ndash;          </td>&ndash;&gt;-->
<!--&lt;!&ndash;        </template>&ndash;&gt;-->
<!--      </v-data-table>-->
<!--    </div>-->
<!--  </div>-->
</template>

<script>
  export default {
    name: "RiskAnalysisImportInformation",
    props: {
      objectItem: {
        type: Object,
        required: true,
      },
    },
    data: () => ({
      chooseRisk: '',
      listArray: [],
      required: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else return true;
        }
      ],
    }),

    computed: {
      headers() {
        return [
          {text: this.translateCol('name'), value: 'name', align: 'left', sortable: false},
        ];
      },
    },

    watch: {
      objectItem() {
        this.getList(this.objectItem);
      },
    },

    created() {
      if (this.objectItem) {
        this.getList(this.objectItem);
      }
    },

    methods: {
      translateCol(colName) {
        return this.$i18n.t('column.' + colName);
      },

      getList(item) {
        this.listArray = item.source_of_danger;
      },

      translateLevel(value) {
        if (value === 1) {
          return this.$i18n.t('form.low');
        } else if (value === 2) {
          return this.$i18n.t('form.moderate');
        } else if (value === 3) {
          return this.$i18n.t('form.high');
        } else if (value === 4) {
          return this.$i18n.t('form.very_high');
        } else {
          return '';
        }
      },

      process(list) {
        this.$emit('processSourceOfDanger', {
          chosenList: list,
          sourceList: this.listArray
        });
        this.chooseRisk= ''
      },
    },
  };
</script>

<style scoped>

</style>

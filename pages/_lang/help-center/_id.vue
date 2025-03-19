<template>
  <div class="text-left guide-page">
    <h2 class="mb-5">{{ title }}</h2>
    <div v-if="type === 'Main article'">{{ content }}</div>
    <div v-else>
      <div v-if="pdfFile !== ''" class="text-left download-item mt-3 mb-5">
        <span @click="getFile(pdfFile)">Download PDF</span>
      </div>
      <v-expansion-panels
        multiple
        flat
      >
        <v-expansion-panel
          v-for="(question, item) in questionArray"
          :key="item"
        >
          <v-expansion-panel-header>
            <h5>{{ question.question }}</h5>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            {{ question.answer }}
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </div>
</template>

<script>
  import cookies from "js-cookie";
  import {downloadFile} from "../../../utils/downloadFile";

  export default {
    data: () => ({
      checkSuperAdmin: cookies.get('checkSuperAdmin'),
      roleUser: cookies.get('roleUser'),
      type: '',
      content: '',
      title: '',
      questionArray: [],
      pdfFile: '',
      uri: '',
    }),

    watch: {
    },

    mounted() {
      let that = this;
      that.$nextTick(() => {
        that.$nuxt.$loading.start();
        that.$store.dispatch('help/show', parseInt(that.$route.params.id)).then(result => {
          that.title = result.data.name;
          that.type = result.data.type;
          if (result.data.description) {
            that.content = result.data.description.replace(/<[^>]+>/g, '');
          }
          if (result.data.url) {
            that.uri = result.data.uri;
            that.pdfFile = result.data.url;
          }
          that.questionArray = result.data.questions;
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_help_center_view_detail'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      });
    },

    methods: {
      getFile(item) {
        let filenameArray = this.uri.split('/').slice();
        let filename = filenameArray.slice(filenameArray.length - 1);
        downloadFile(item, filename);
      },
    }
  };
</script>

<style scoped>

</style>

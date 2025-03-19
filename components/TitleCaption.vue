<template>
  <div
    v-if="titleCaption.excerpt || titleCaption.caption"
    class="title-caption"
  >
    <div v-if="titleCaption.excerpt">
      <div v-if="!titleCaption.show_less">
        <div v-html="titleCaption.excerpt" />
        <span class="read-more" @click="titleCaption.show_less = true">Read more</span>
      </div>
      <div v-else>
        <div v-html="titleCaption.caption" />
        <span class="read-more" @click="titleCaption.show_less = false">Show less</span>
      </div>
    </div>
    <div v-else>
      <div v-html="titleCaption.caption" />
    </div>
  </div>
</template>
<script>
  import {_} from 'vue-underscore';

  export default {
    name: "TitleCaption",
    props: [
      'data',
    ],
    data: function () {
      return {
        titleCaption: {
          key: '',
          caption: '',
          excerpt: '',
          show_less: false,
        },
        titleCaptionDefault: {
          key: '',
          caption: '',
          excerpt: '',
          show_less: false,
        },
        breakpointTitleCaption: 200,
        titleCaptionKey: this.data
      };
    },

    mounted() {
      let that = this;

      that.$store.dispatch('titleCaption/showByKey', that.titleCaptionKey).then(result => {
        if (result.data) {
          let item = result.data;
          that.titleCaption = _.clone(that.titleCaptionDefault);
          that.titleCaption.key = item.title_key;
          that.titleCaption.caption = item.caption;
          if (item.caption.length > that.breakpointTitleCaption) {
            that.titleCaption.excerpt = item.caption.slice(0, that.breakpointTitleCaption - 1) + '... ';
          }
        }
      }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
        that.$toaster.error(that.$i18n.t('message.fail_title_caption_view_detail'));
          }
        // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        that.$nuxt.$loading.finish();
      });
    },
  };
</script>

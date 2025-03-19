<template>
  <aside :class="'left-sidebar ' + page">
    <div class="scroll-sidebar">
      <nav class="sidebar-nav">
        <div class="current-page">
          {{ $t('menu.' + page) }}
        </div>
        <!-- HELP CENTER -->
        <div v-if="page === 'help-center'" class="help-center-page">
          <v-expansion-panels
            multiple
            flat
          >
            <v-expansion-panel
              v-for="(menu,item_menu) in help_menu"
              :key="item_menu"
            >
              <v-expansion-panel-header
                v-if="!((checkSuperAdmin && menu.id > 2) || (roleUser === 'user' && menu.id === 1))"
              >
                {{ menu.title }}
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-expansion-panels
                  multiple
                  flat
                >
                  <v-expansion-panel
                    v-for="(article, item_article) in listHelpGuide"
                    :key="item_article"
                    :readonly="article.topics.length === 0"
                    @click="getHelpDetail(article)"
                  >
                    <v-expansion-panel-header
                      v-if="article.menu_function === menu.title"
                      :hide-actions="article.topics.length === 0"
                    >
                      {{ article.name }}
                    </v-expansion-panel-header>
                    <v-expansion-panel-content
                      v-if="article.menu_function === menu.title && article.topics"
                    >
                      <v-expansion-panels
                        multiple
                        flat
                      >
                        <v-expansion-panel
                          v-for="(topic, item_topic) in article.topics"
                          :key="item_topic"
                          readonly
                          @click="getHelpDetail(topic)"
                        >
                          <v-expansion-panel-header hide-actions>
                            {{ topic.name }}
                          </v-expansion-panel-header>
                          <!--                        <v-expansion-panel-content v-if="topic.sub_topics">-->
                          <!--                          <v-expansion-panels-->
                          <!--                            multiple-->
                          <!--                            flat-->
                          <!--                          >-->
                          <!--                            <v-expansion-panel-->
                          <!--                              v-for="(sub_topic, item_sub_topic) in topic.sub_topics"-->
                          <!--                              :key="item_sub_topic"-->
                          <!--                            >-->
                          <!--                              <v-expansion-panel-header>-->
                          <!--                                {{ sub_topic.name }}-->
                          <!--                              </v-expansion-panel-header>-->
                          <!--                              <v-expansion-panel-content>-->
                          <!--                                {{ sub_topic.description }}-->
                          <!--                              </v-expansion-panel-content>-->
                          <!--                            </v-expansion-panel>-->
                          <!--                          </v-expansion-panels>-->
                          <!--                        </v-expansion-panel-content>-->
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </nav>
    </div>
  </aside>
</template>
<script>
  import cookies from "js-cookie";

  export default {
    data() {
      return {
        page: this.$router.history.current.path.split("/")[2],
        link: this.$router.history.current.path.split("/")[this.$router.history.current.path.split("/").length - 1],
        permissionsUser: localStorage.getItem('permissionsKey'),
        checkAdmin: cookies.get('checkAdmin'),
        checkSuperAdmin: cookies.get('checkSuperAdmin'),
        roleUser: cookies.get('roleUser'),
        help_menu: [{
          id: 1,
          title: 'Management function',
        }, {
          id: 2,
          title: 'Basic function',
        }, {
          id: 3,
          title: 'The process of task',
        }, {
          id: 4,
          title: 'The process of report',
        }],
        listHelpGuide: [],
      };
    },

    computed: {},

    watch: {
      $route(to) {
        this.page = to.path.split("/")[2];
        this.link = to.path.split("/")[to.path.split("/").length - 1];
      }
    },

    mounted() {
      let that = this;
      that.$nextTick(() => {
        that.$nuxt.$loading.start();
        //Get helping list
        that.$store.dispatch('help/index').then(result => {
          that.listHelpGuide = result.data;
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_help_center_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      });
    },

    methods: {
      getHelpDetail(item) {
        this.$router.push('/help-center/' + item.id);
      },
    },
  };
</script>

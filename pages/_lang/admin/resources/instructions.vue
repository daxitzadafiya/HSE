<template>
  <div class="hse-page">
    <v-btn
      class="mb-2 btn-create btn-custom-green"
      @click="checkAddNew = true"
    >
      {{ $t('button.add_new') }}
    </v-btn>

    <b-tabs card lazy>
      <keep-alive>
        <b-tab :title="$t('tab.instructions')">
          <TitleCaption :data="(userRoleId > 2 ? 2 : userRoleId) + '-' + pageKey" />
          <v-container>
            <AddNewPopup
              :resource="true"
              :open-popup="checkAddNew"
              :form-title="$t('title.new_instruction_resource')"
              :object-field="objectField"
              :object-item="newItem"
              :industry-array="industriesArray"
              :categories-array="categoriesArray"
              :categories-type="'instruction'"
              :predefined-link-array="predefinedLinkArray"
              @closePopup="checkAddNew = !checkAddNew"
              @savePopup="save"
            />

<!--            <InstructionPopup-->
<!--              :open-popup="checkAddNew"-->
<!--              :resource="true"-->
<!--              :industry-array="industriesArray"-->
<!--              :categories-array="categoriesArray"-->
<!--              @closePopup="checkAddNew = !checkAddNew"-->
<!--              @reloadList="reloadList"-->
<!--              @reloadListCategory="reloadListCategory"-->
<!--            />-->

            <InstructionTable
              :resource="true"
              :industry-array="industriesArray"
              :list-array-input="listArray"
              :categories-array="categoriesArray"
              :categories-selection="categoriesSelection"
              :predefined-link-array="predefinedLinkArray"
              @reloadList="reloadList"
              @reloadListCategory="reloadListCategory"
            />
          </v-container>
        </b-tab>
      </keep-alive>
    </b-tabs>
  </div>
</template>
<script>
  import {_} from 'vue-underscore';
  import cookies from 'js-cookie';
  import TitleCaption from "../../../../components/TitleCaption";
  // import InstructionPopup from "../../../../components/InstructionPopup";
  import InstructionTable from "../../../../components/InstructionTable";
  import AddNewPopup from "../../../../components/AddNewPopup";

  export default {
    components: {
      TitleCaption,
      // InstructionPopup,
      InstructionTable,
      AddNewPopup,
    },

    data: () => ({
      userRoleId: parseInt(cookies.get('roleID')),
      // userDepartmentID: parseInt(cookies.get('userDepartmentID')),
      // checkAdmin: cookies.get('checkAdmin'),
      // roleUser: cookies.get('roleUser'),
      pageKey: 'resources-instructions-resources',
      checkAddNew: false,
      listArray: [],
      categoriesArray: [],
      categoriesSelection: [],
      categoriesDefault: {
        id: 0,
        name: "All"
      },
      industriesArray: [],
      // add new popup - list object fields
      objectField: [
        'name',
        'industry',
        'description',
        'category',
        'activity',
      ],
      newItem: {
        industry: [],
        is_template: true,
        name: "",
        type: 'instruction',
        description: "",
        category_id: '',
        is_suggestion: false,
        is_valid: true,
        status: 'new',
        // instruction activity
        activities: [],
      },
      defaultItem: {
        industry: [],
        is_template: true,
        name: "",
        type: 'instruction',
        description: "",
        category_id: '',
        is_suggestion: false,
        is_valid: true,
        status: 'new',
        // instruction activity
        activities: [],
      },
      predefinedLinkArray: [],
    }),

    computed: {},

    watch: {},

    mounted() {
      let that = this;
      that.$nextTick(() => {
        that.$nuxt.$loading.start();
        // that.$store.dispatch('instructions/index').then(result => {
        //   that.listArray = _.filter(result.data, function (item) {
        //     if (item.count_activity === null) { // count = 0 if no activity
        //       item.count_activity = 0;
        //     }
        //     return item;
        //   });
        // }).catch(() => {
        //   that.$toaster.error(that.$i18n.t('message.fail_instruction_view'));
        //   // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        //   that.$nuxt.$loading.finish();
        // });

        //list suggestions
        that.$store.dispatch('statements/index', {param: 'suggestion'}).then(result => {
          if (result.data) {
            _.each(result.data, function (item) {
              _.each(item.data, function (object) {
                let linkItem = {
                  text: '',
                  href: '',
                  target: '_blank'
                };

                if (item.type === 'Routine') {
                  if (object.recurring === 'indefinite') {
                    linkItem.text = '[' + item.type + '] ' + object.name + ', ' + object.recurring + ', ' + object.first_name + ' ' + object.last_name;
                  } else {
                    linkItem.text = '[' + item.type + '] ' + object.name + ', ' + object.deadline  + ' - ' + object.recurring + ', ' + object.first_name + ' ' + object.last_name;
                  }
                } else {
                  linkItem.text = '[' + item.type + '] ' + object.name;
                }
                // linkItem.href = object.url + '?id=' + object.id;
                linkItem.href =  '/' + that.$i18n.locale + object.url + '?id=' + object.id;

                that.predefinedLinkArray.push(linkItem);

                that.predefinedLinkArray = _.sortBy(that.predefinedLinkArray, function (item) {
                  return item.text;
                });
              });
            });
            that.$nuxt.$loading.finish();
          } else {
            that.$nuxt.$loading.finish();
          }
        }).catch(() => {
          that.$nuxt.$loading.finish();
        });

        // list categories
        that.$store.dispatch('categoriesV2/index', {type: 'instruction'}).then(result => {
          that.categoriesArray = result.data;
          that.categoriesSelection = _.clone(result.data);
          that.categoriesSelection.push(that.categoriesDefault);
          that.categoriesSelection.sort(function (a, b) {
            return (a.id - b.id);
          });
        }).catch(() => {
          // that.$toaster.error(that.$i18n.t('message.fail_category_view'));
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });

        // list industries
        that.$store.dispatch('industries/index').then(result => {
          that.industriesArray = result.data;
        }).catch(() => {
          // that.$toaster.error(that.$i18n.t('message.fail_industry_view'));
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });

        // list instructions
        that.$store.dispatch('objects/index', {objectType: 'instruction'}).then(result => {
          that.listArray = _.filter(result.data, function (item) {
            return item.is_template;
          });
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_instruction_view'));
          }
          that.$nuxt.$loading.finish();
        });
      });
    },

    methods: {
      reloadList(){
        let that = this;
        // get list
        that.$store.dispatch('objects/index', {objectType: 'instruction'}).then(result => {
          that.listArray = _.filter(result.data, function (item) {
            return item.is_template;
          });
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_instruction_view'));
          }
          that.$nuxt.$loading.finish();
        });

        // that.$store.dispatch('instructions/index').then(result => {
        //   that.listArray = _.filter(result.data, function (item) {
        //     if (item.count_activity === null) { // count = 0 if no activity
        //       item.count_activity = 0;
        //     }
        //     return item;
        //   });
        //   that.$nuxt.$loading.finish();
        // }).catch(() => {
        //   that.$toaster.error(that.$i18n.t('message.fail_instruction_view'));
        //   // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
        //   that.$nuxt.$loading.finish();
        // });
      },

      reloadListCategory(){
        let that = this;
        that.$store.dispatch('categoriesV2/index', {type: 'instruction'}).then(result => {
          that.categoriesArray = _.filter(result.data, function (item) {
            return item.is_valid;
          });
          that.categoriesSelection = _.clone(that.categoriesArray);
          that.categoriesSelection.push(that.categoriesDefault);
          that.categoriesSelection.sort(function (a, b) {
            return (a.id - b.id);
          });
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_category_view'));
          }
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      },

      close() {
        this.checkAddNew = false;
        this.reset();
      },

      reset() {
        this.$nuxt.$loading.finish();
        this.newItem = Object.assign({}, this.defaultItem);
      },

      save(value) {
        let that = this;
        that.$nuxt.$loading.start();
        that.newItem = value.item;
        if (that.newItem.activities.length > 0) {
          _.each(that.newItem.activities, function (item) {
            item.industry = that.newItem.industry;
          });
        }
        that.$store.dispatch('objects/store', that.newItem).then(function () {
          that.reloadList();
          that.reloadListCategory();
          that.$toaster.success(that.$i18n.t('message.success_instruction_add_new'));
        }).catch((error) => {
            if (error.response.status == 401) {
            this.$router.push('/login');
            this.$toaster.error(this.$i18n.t('message.token_expired'));
          }else{
          that.$toaster.error(that.$i18n.t('message.fail_instruction_add_new'));
          }
          that.$nuxt.$loading.finish();
        });

        // that.$store.dispatch('instructions/store', that.newItem).then(function () {
        //   that.reloadList();
        //   that.reloadListCategory();
        //   that.$toaster.success(that.$i18n.t('message.success_instruction_add_new'));
        // }).catch(() => {
        //   that.$toaster.error(that.$i18n.t('message.fail_instruction_add_new'));
        //   that.$nuxt.$loading.finish();
        // });
        that.close();
      },
    },
  };
</script>

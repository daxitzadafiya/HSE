<template>
  <div>
    <froala
      id="link-editor"
      v-model="item.description"
      :tag="'textarea'"
      :config="config"
      @input="textInputHandlar"
    />
  </div>
</template>

<script>
import {DropkiqUI} from "dropkiq-ui";
import FroalaEditor from 'froala-editor';

export default {
  name: "FroalaSuggestionListEditor",
  props: {
    item: {
      type: Object,
      required: true,
    },
    predefinedLinkArray: {
      type: Array,
      required: false,
    }
  },
  data: () => ({
    description: '',
    config: {
      events: {
        //
      },
      placeholderText: 'Place your cursor in {{}} to see the autofill list.',
      charCounterCount: true,
      heightMin: 300,
      quickInsertEnabled: false,
      toolbarButtons: {
        'moreText': {
          'buttons': ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'inlineClass', 'inlineStyle', 'clearFormatting']
        },
        'moreParagraph': {
          'buttons': ['alignLeft', 'alignCenter', 'formatOLSimple', 'alignRight', 'alignJustify', 'formatOL', 'formatUL', 'paragraphFormat', 'paragraphStyle', 'lineHeight', 'outdent', 'indent', 'quote']
        },
        'moreRich': {
          'buttons': ['refer_to_dropdown_custom', 'insertLink', 'insertImage', 'insertVideo', 'insertTable', 'emoticons', 'fontAwesome', 'specialCharacters', 'embedly', 'insertFile', 'insertHR']
        },
        'moreMisc': {
          'buttons': ['undo', 'redo', 'fullscreen', 'print', 'getPDF', 'spellChecker', 'selectAll', 'html', 'help'],
          'align': 'right',
          'buttonsVisible': 2
        }
      },
      linkList: [],
    },
    suggestedInfo: {
      CEO_name: "",
      HSE_manager_name: "",
      Safety_manager_name: "",
      Number_of_employees: "",
    },
  }),

  watch: {
    item: {
      handler: 'getConfig',
      immediate: true,
    },
    // predefinedLinkArray(value) {
    //   if (value) {
    //     this.predefinedLink = value;
    //   } else {
    //     this.predefinedLink = [];
    //   }
    // },
    // predefinedLinkArray: {
    //   handler: 'getList',
    //   immediate: true,
    // },
  },

  methods: {
    // getList() {
    //   let that = this;
    //   console.log('getList', that.predefinedLinkArray);
    //   that.config.linkList = that.predefinedLinkArray;
    // },
    textInputHandlar(){
      this.$emit('textInputHandlar',this.item.description)
    },
    getConfig() {
      // let that = this;
      // console.log('getConfig', this.predefinedLinkArray);
      // Describes what data the user has access to right now (required)
      const schema = {
        contacts: {
          methods: {
            name: {
              type: "ColumnTypes::String",
              foreign_table_name: null,
              hint: "The full name of the contact person"
            },
            email: {
              type: "ColumnTypes::String",
              foreign_table_name: null,
              hint: "The email address of the contact person"
            },
            age: {
              type: "ColumnTypes::Numeric",
              foreign_table_name: null,
              hint: "The computed age of the contact person"
            },
            is_minor: {
              type: "ColumnTypes::Boolean",
              foreign_table_name: null,
              hint: "Is true if the person is less than 18 years old"
            },
            birthdate: {
              type: "ColumnTypes::DateTime",
              foreign_table_name: null,
              hint: "The birthdate of the contact person"
            },
            notes: {
              type: "ColumnTypes::Text",
              foreign_table_name: null,
              hint: "Any notes that are saved in the database"
            },
            favorite_website: {
              type: "ColumnTypes::HasOne",
              foreign_table_name: "websites",
              hint: "The website the person visits most often"
            },
            visited_websites: {
              type: "ColumnTypes::HasMany",
              foreign_table_name: "websites",
              hint: "A list of websites the person has visited"
            }
          }
        },
        websites: {
          methods: {
            nickname: {
              type: "ColumnTypes::String",
              foreign_table_name: null,
              hint: "The nickname of the website"
            },
            url: {
              type: "ColumnTypes::String",
              foreign_table_name: null,
              hint: "The website HTTP URL address"
            }
          }
        }
      };

      const context = {
        CEO_name: {
          type: "ColumnTypes::String",
          foreign_table_name: null,
          hint: "CEO's name"
        },
        HSE_manager_name: {
          type: "ColumnTypes::String",
          foreign_table_name: null,
          hint: "HSE manager's name"
        },
        Safety_manager_name: {
          type: "ColumnTypes::String",
          foreign_table_name: null,
          hint: "Safety manager's name"
        },
        Number_of_employees: {
          type: "ColumnTypes::Numeric",
          foreign_table_name: null,
          hint: "Number of employees"
        },
      };

      // Test data that is used for the preview feature (optional)
      const scope = {
        CEO_name: this.suggestedInfo.CEO_name,
        HSE_manager_name: this.suggestedInfo.HSE_manager_name,
        Safety_manager_name: this.suggestedInfo.Safety_manager_name,
        Number_of_employees: this.suggestedInfo.Number_of_employees,
      };

      // let that = this;
      // let preview = document.getElementById('preview-out');
      this.config.events = {
        initialized: function() {
          var editor = this;
          // console.log(schema);
          // Initialize the Standard DropkiqUI for demo elements
          // https://www.npmjs.com/package/dropkiq-ui
          var dropkiqUI = new DropkiqUI(editor.el, schema, context, scope, "");
          // var dropkiqUI = new DropkiqUI(editor.el, schema, context, scope, "", {
          //   onRender: function(renderedDocument){
          //     // preview.textContent = renderedDocument;
          //     this.statementDescription = renderedDocument;
          //     console.log(renderedDocument);
          //   }
          // });
          editor.events.on('keydown', function(e) {
            if (e.which == FroalaEditor.KEYCODE.ENTER && dropkiqUI.menuIsOpen()) {
              return false;
            }
          }, true);

          setTimeout(function(){
            editor.events.focus(true);
          }, 1);
        },
        // 'commands.before': function (e) {
        //   console.log(e);
        //   console.log(this);
        //   if (e === 'linkOpen') {
        //     // that.$router.push('/en/company/deviations?id=6');
        //
        //     // alert("before");
        //     // return false;
        //   }
        //   // let routeData = that.$router.resolve({name: 'lang-company-deviations', query: {id: '6'}});
        //   // window.open(routeData.href, '_blank');
        // },
        // 'click': function (e) {
        //   console.log(e.target.href);
        //   console.log(e.target.attributes.href);
        //   console.log(e.target);
        //   console.log(e);
        //   // let routeData = that.$router.resolve({name: 'lang-company-deviations', query: {id: '6'}});
        //   // window.open(routeData.href, '_blank');
        // },

      };

      if (this.predefinedLinkArray) {
        this.config.linkList = this.predefinedLinkArray;
      }

      // that.config.linkList = [
      //   {
      //     text: 'Froala',
      //     href: 'https://froala.com',
      //     target: '_blank'
      //   },
      //   {
      //     text: 'Google',
      //     href: 'https://google.com',
      //     target: '_blank'
      //   },
      //   {
      //     text: 'Facebook',
      //     href: 'https://facebook.com'
      //   }
      // ];
    }
  },
};
</script>

<style scoped>

</style>

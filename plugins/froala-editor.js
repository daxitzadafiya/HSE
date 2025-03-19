import Vue from "vue";
import 'froala-editor/js/plugins.pkgd.min.js';
import 'froala-editor/js/plugins/link.min.js';
//Import third party plugins
import 'froala-editor/js/third_party/embedly.min';
import 'froala-editor/js/third_party/font_awesome.min';
import 'froala-editor/js/third_party/spell_checker.min';
import 'froala-editor/js/third_party/image_tui.min';
import 'dropkiq-ui/dist/dropkiq.min';

import VueFroala from 'vue-froala-wysiwyg';

Vue.use(VueFroala);

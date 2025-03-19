import Vue from 'vue';
import VeeValidate from 'vee-validate';
import { Validator } from 'vee-validate';
const dictionary = {
  en: {
    messages:{
      required: () => 'This field is required',
      confirmed: () => 'Password and Confirm Password do not match'
    }
  }
};

// Override and merge the dictionaries
Validator.localize(dictionary);

Vue.use(VeeValidate, { fieldsBagName: 'veeFields' });

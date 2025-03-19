export const state = () => ({
  locales: ['en', 'no'],
  locale: 'en',
  sidebar: false
});

export const mutations = {
  SET_LANG(state, locale) {
    if (state.locales.indexOf(locale) !== -1) {
      state.locale = locale;
    }
  }
};

export const actions = {

};


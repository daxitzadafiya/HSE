import api from '~/apis';
import merge from "lodash.merge";
import assign from 'lodash.assign';

export const mutations = {
  set(state, item) {
    state.list = item;
  },
  add(state, value) {
    merge(state.list, value);
  },
  remove(state, {item}) {
    state.list.filter(c => item.id !== c.id);
  },
  merge(state, form) {
    assign(state.verificationCode, form);
  },
};

export const actions = {
  show({commit}, code) {
    return api.verificationCode.show(code)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
};

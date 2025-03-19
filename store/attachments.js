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
    assign(state.attachments, form);
  },
};

export const actions = {
  showImage({commit}, filename) {
    return api.attachments.showImage(filename)
      .then(response => {
        commit('merge', response.data);
        return response;
      });
  },
  store({commit}, data) {
    return api.attachments.store(data)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
};

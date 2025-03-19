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
    assign(state.instruction, form);
  },
};

export const actions = {
  index({commit},query) {
    return api.documents.index(query)
      .then(response => {
        commit('set', response.data);
        return response.data;
      });
  },
  attachment({commit},query) {
    return api.documents.attachment(query)
      .then(response => {
        commit('set', response.data);
        return response.data;
      });
  },
  store({commit}, data) {
    return api.documents.store(data)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  show({commit}, id) {
    return api.documents.show(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  update({commit}, data) {
    return api.documents.update(data, data.id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  delete({commit}, id) {
    return api.documents.delete(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  fileShow({commit}, filename) {
    return api.documents.fileShow(filename)
      .then(response => {
        commit('merge', response.data);
        return response;
      });
  }
};

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
    assign(state.question, form);
  },
};

export const actions = {
  index({commit},query) {
    return api.reports.index(query)
      .then(response => {
        commit('set', response.data);
        return response.data;
      });
  },
  filter({commit},query) {
    return api.reports.filter(query)
      .then(response => {
        commit('set', response.data);
        return response.data;
      });
  },
  store({commit}, data) {
    return api.reports.store(data)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  show({commit}, id) {
    return api.reports.show(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  update({commit}, data) {
    return api.reports.update(data, data.id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  delete({commit}, id) {
    return api.reports.delete(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  storeTask({commit}, data) {
    return api.reports.storeTask(data)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  // storeRiskElementSource({commit}, data) {
  //   return api.reports.storeRiskElementSource(data)
  //     .then(response => {
  //       commit('merge', response.data);
  //       return response.data;
  //     });
  // },
  // storeDocument({commit}, data) {
  //   return api.reports.storeDocument(data)
  //     .then(response => {
  //       commit('merge', response.data);
  //       return response.data;
  //     });
  // },
  uploadMultiple({commit}, data) {
    return api.reports.uploadMultiple(data)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
};

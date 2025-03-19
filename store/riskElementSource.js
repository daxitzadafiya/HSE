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
    assign(state.riskElementSource, form);
  },
};

export const actions = {
  index({commit},query) {
    return api.riskElementSource.index(query)
      .then(response => {
        commit('set', response.data);
        return response.data;
      });
  },
  store({commit}, data) {
    return api.riskElementSource.store(data)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  show({commit}, id) {
    return api.riskElementSource.show(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  update({commit}, data) {
    return api.riskElementSource.update(data, data.id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  delete({commit}, id) {
    return api.riskElementSource.delete(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  storeDocument({commit}, data) {
    return api.riskElementSource.storeDocument(data)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  // indexDocument({commit},query) {
  //   return api.riskElementSource.indexDocument(query)
  //     .then(response => {
  //       commit('set', response.data);
  //       return response.data;
  //     });
  // },
  // showDocument({commit}, id) {
  //   return api.riskElementSource.showDocument(id)
  //     .then(response => {
  //       commit('merge', response.data);
  //       return response.data;
  //     });
  // },
  // updateDocument({commit}, data) {
  //   return api.riskElementSource.updateDocument(data, data.id)
  //     .then(response => {
  //       commit('merge', response.data);
  //       return response.data;
  //     });
  // },
  // deleteDocument({commit}, id) {
  //   return api.riskElementSource.deleteDocument(id)
  //     .then(response => {
  //       commit('merge', response.data);
  //       return response.data;
  //     });
  // },
};

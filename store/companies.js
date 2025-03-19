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
    assign(state.company, form);
  },
};

export const actions = {
  index({commit}, query) {
    return api.companies.index(query)
      .then(response => {
        commit('set', response.data);
        return response.data;
      });
  },
  store({commit}, data) {
    return api.companies.store(data)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  show({commit}, id) {
    return api.companies.show(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  update({commit}, data) {
    return api.companies.update(data, data.id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  delete({commit}, id) {
    return api.companies.delete(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  changeStatus({commit}, id) {
    return api.companies.changeStatus(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },

  // indexDocument({commit},query) {
  //   return api.companies.indexDocument(query)
  //     .then(response => {
  //       commit('set', response.data);
  //       return response.data;
  //     });
  // },
  // storeDocument({commit}, data) {
  //   return api.companies.storeDocument(data)
  //     .then(response => {
  //       commit('merge', response.data);
  //       return response.data;
  //     });
  // },
  // showDocument({commit}, id) {
  //   return api.companies.showDocument(id)
  //     .then(response => {
  //       commit('merge', response.data);
  //       return response.data;
  //     });
  // },
  // updateDocument({commit}, data) {
  //   return api.companies.updateDocument(data, data.id)
  //     .then(response => {
  //       commit('merge', response.data);
  //       return response.data;
  //     });
  // },
  // deleteDocument({commit}, id) {
  //   return api.companies.deleteDocument(id)
  //     .then(response => {
  //       commit('merge', response.data);
  //       return response.data;
  //     });
  // },
};

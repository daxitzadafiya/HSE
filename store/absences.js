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
    assign(state.absence, form);
  },
};

export const actions = {
  index() {
    return api.absences.index()
      .then(response => {
        return response.data;
      });
  },
  store({commit}, data) {
    return api.absences.store(data)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  show({commit}, id) {
    return api.absences.show(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  update({commit}, data) {
    return api.absences.update(data, data.id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  delete({commit}, id) {
    return api.absences.delete(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },

  indexDocument({commit},query) {
    return api.absences.indexDocument(query)
      .then(response => {
        commit('set', response.data);
        return response.data;
      });
  },
  storeDocument({commit}, data) {
    return api.absences.storeDocument(data)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  showDocument({commit}, id) {
    return api.absences.showDocument(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  updateDocument({commit}, data) {
    return api.absences.updateDocument(data, data.id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  deleteDocument({commit}, id) {
    return api.absences.deleteDocument(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
};

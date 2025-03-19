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
    assign(state.deviation, form);
  },
};

export const actions = {
  index({commit}, query) {
    return api.deviations.index(query)
      .then(response => {
        commit('set', response.data);
        return response.data;
      });
  },
  filter({commit}, query) {
    return api.deviations.filter(query)
      .then(response => {
        commit('set', response.data);
        return response.data;
      });
  },
  store({commit}, data) {
    return api.deviations.store(data)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  show({commit}, id) {
    return api.deviations.show(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  update({commit}, data) {
    return api.deviations.update(data, data.id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  delete({commit}, id) {
    return api.deviations.delete(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },

  storeDocument({commit}, data) {
    return api.deviations.storeDocument(data)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
};

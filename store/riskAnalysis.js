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
    assign(state.riskAnalysis, form);
  },
};

export const actions = {
  index({commit},query) {
    return api.riskAnalysis.index(query)
      .then(response => {
        commit('set', response.data);
        return response.data;
      });
  },
  filter({commit}, query) {
    return api.riskAnalysis.filter(query)
      .then(response => {
        commit('set', response.data);
        return response.data;
      });
  },
  store({commit}, data) {
    return api.riskAnalysis.store(data)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  show({commit}, id) {
    return api.riskAnalysis.show(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  update({commit}, data) {
    return api.riskAnalysis.update(data, data.id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  delete({commit}, id) {
    return api.riskAnalysis.delete(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
};

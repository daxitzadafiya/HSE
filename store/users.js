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
    assign(state.user, form);
  },
};

export const actions = {
  index({commit},query) {
    return api.users.index(query)
      .then(response => {
        commit('set', response.data);
        return response.data;
      });
  },
  store({commit}, data) {
    return api.users.store(data)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  show({commit}, id) {
    return api.users.show(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  update({commit}, data) {
    return api.users.update(data, data.id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  delete({commit}, id) {
    return api.users.delete(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  getEmployees({commit}, params) {
    return api.users.getEmployees(params)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  getManagers({commit}, params) {
    return api.users.getManagers(params)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
};

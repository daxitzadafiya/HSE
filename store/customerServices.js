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
    assign(state.customerServices, form);
  },
};

export const actions = {
  index({commit},query) {
    return api.customerServices.index(query)
      .then(response => {
        commit('set', response.data);
        return response.data;
      });
  },
  store({commit}, data) {
    return api.customerServices.store(data)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  show({commit}, id) {
    return api.customerServices.show(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  update({commit}, data) {
    return api.customerServices.update(data, data.id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  delete({commit}, id) {
    return api.customerServices.delete(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  permissions({commit},query) {
    return api.customerServices.permissions(query)
      .then(response => {
        commit('set', response.data);
        return response.data;
      });
  },
  updatePermission({commit}, data) {
    return api.customerServices.updatePermission(data)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  getPermissions({commit},query) {
    return api.customerServices.getPermissions(query)
      .then(response => {
        commit('set', response.data);
        return response.data;
      });
  },
};

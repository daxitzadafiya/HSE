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
    assign(state.role, form);
  },
};

export const actions = {
  index({commit},query) {
    return api.roles.index(query)
      .then(response => {
        commit('set', response.data);
        return response.data;
      });
  },
  store({commit}, data) {
    return api.roles.store(data)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  show({commit}, id) {
    return api.roles.show(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  update({commit}, data) {
    return api.roles.update(data, data.id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  delete({commit}, id) {
    return api.roles.delete(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },

  applyNewUpdate({commit}, request_push_notification_id) {
    return api.roles.applyNewUpdate(request_push_notification_id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  all({commit},query) {
    return api.roles.all(query)
      .then(response => {
        commit('set', response.data);
        return response.data;
      });
  },
};

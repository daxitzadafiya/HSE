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
    assign(state.userPermissions, form);
  },
};

export const actions = {
  show({commit}, id) {
    return api.userPermissions.show(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  update({commit}, data) {
    return api.userPermissions.update(data, data.id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
};

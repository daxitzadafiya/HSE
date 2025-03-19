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
    assign(state.unwantedEvent, form);
  },
};

export const actions = {
  index() {
    return api.unwantedEvents.index()
      .then(response => {
        return response.data;
      });
  },
  store({commit}, data) {
    return api.unwantedEvents.store(data)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  show({commit}, id) {
    return api.unwantedEvents.show(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  update({commit}, data) {
    return api.unwantedEvents.update(data, data.id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  delete({commit}, id) {
    return api.unwantedEvents.delete(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
};

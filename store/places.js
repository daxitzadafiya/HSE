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
    assign(state.place, form);
  },
};

export const actions = {
  index({commit},query) {
    return api.places.index(query)
      .then(response => {
        commit('set', response.data);
        return response.data;
      });
  },
  store({commit}, data) {
    return api.places.store(data)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  show({commit}, id) {
    return api.places.show(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
//   update({commit}, data) {
//     return api.places.update(data, data.id)
//       .then(response => {
//         commit('merge', response.data);
//         return response.data;
//       });
//   },
//   delete({commit}, id) {
//     return api.places.delete(id)
//       .then(response => {
//         commit('merge', response.data);
//         return response.data;
//       });
//   },
};

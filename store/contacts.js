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
  index({commit},query) {
    return api.contacts.index(query)
      .then(response => {
        commit('set', response.data);
        return response.data;
      });
  },
  store({commit}, data) {
    return api.contacts.store(data)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  show({commit}, id) {
    return api.contacts.show(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  update({commit}, data) {
    return api.contacts.update(data, data.id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  delete({commit}, id) {
    return api.contacts.delete(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },

  indexPerson({commit},query) {
    return api.contacts.indexPerson(query)
      .then(response => {
        commit('set', response.data);
        return response.data;
      });
  },
  storePerson({commit}, data) {
    return api.contacts.storePerson(data)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  showPerson({commit}, id) {
    return api.contacts.showPerson(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  updatePerson({commit}, data) {
    return api.contacts.updatePerson(data, data.id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  deletePerson({commit}, id) {
    return api.contacts.deletePerson(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },

  // indexDocument({commit},query) {
  //   return api.contacts.indexDocument(query)
  //     .then(response => {
  //       commit('set', response.data);
  //       return response.data;
  //     });
  // },
  // storeDocument({commit}, data) {
  //   return api.contacts.storeDocument(data)
  //     .then(response => {
  //       commit('merge', response.data);
  //       return response.data;
  //     });
  // },
  // showDocument({commit}, id) {
  //   return api.contacts.showDocument(id)
  //     .then(response => {
  //       commit('merge', response.data);
  //       return response.data;
  //     });
  // },
  // updateDocument({commit}, data) {
  //   return api.contacts.updateDocument(data, data.id)
  //     .then(response => {
  //       commit('merge', response.data);
  //       return response.data;
  //     });
  // },
  // deleteDocument({commit}, id) {
  //   return api.contacts.deleteDocument(id)
  //     .then(response => {
  //       commit('merge', response.data);
  //       return response.data;
  //     });
  // },
};

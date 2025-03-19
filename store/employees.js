import api from '~/apis';
import merge from "lodash.merge";
import assign from 'lodash.assign';


export const mutations = {
  set(state, item) {
    state.list = item;
  },
  setAbsenceProcessor(state, item) {
    state.list = item;
  },
  add(state, value) {
    merge(state.list, value);
  },
  remove(state, {item}) {
    state.list.filter(c => item.id !== c.id);
  },
  merge(state, form) {
    assign(state.employee, form);
  },
};

export const actions = {
  index({commit},query) {
    return api.employees.index(query)
      .then(response => {
        commit('set', response.data);
        return response.data;
      });
  },
  store({commit}, data) {
    return api.employees.store(data)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  show({commit}, id) {
    return api.employees.show(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  update({commit}, data) {
    return api.employees.update(data, data.id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  delete({commit}, id) {
    return api.employees.delete(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },

  // indexDocument({commit},query) {
  //   return api.employees.indexDocument(query)
  //     .then(response => {
  //       commit('set', response.data);
  //       return response.data;
  //     });
  // },
  // storeDocument({commit}, data) {
  //   return api.employees.storeDocument(data)
  //     .then(response => {
  //       commit('merge', response.data);
  //       return response.data;
  //     });
  // },
  // showDocument({commit}, id) {
  //   return api.employees.showDocument(id)
  //     .then(response => {
  //       commit('merge', response.data);
  //       return response.data;
  //     });
  // },
  // updateDocument({commit}, data) {
  //   return api.employees.updateDocument(data, data.id)
  //     .then(response => {
  //       commit('merge', response.data);
  //       return response.data;
  //     });
  // },
  // deleteDocument({commit}, id) {
  //   return api.employees.deleteDocument(id)
  //     .then(response => {
  //       commit('merge', response.data);
  //       return response.data;
  //     });
  // },

  indexRelation({commit},query) {
    return api.employees.indexRelation(query)
      .then(response => {
        commit('set', response.data);
        return response.data;
      });
  },
  storeRelation({commit}, data) {
    return api.employees.storeRelation(data)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  showRelation({commit}, id) {
    return api.employees.showRelation(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  updateRelation({commit}, data) {
    return api.employees.updateRelation(data, data.id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  deleteRelation({commit}, id) {
    return api.employees.deleteRelation(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  indexRole({commit},query) {
    return api.employees.indexRole(query)
      .then(response => {
        commit('set', response.data);
        return response.data;
      });
  },
  indexAbsenceProcessor({commit}, id) {
    return api.employees.indexAbsenceProcessor(id)
      .then(response => {
        commit('setAbsenceProcessor', response.data);
        return response.data;
      });
  },
  import({commit}, data) {
    return api.employees.import(data)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
};

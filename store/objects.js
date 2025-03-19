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
    assign(state.objects, form);
  },
};

export const actions = {
  index({commit}, query) {
    return api.objects.index(query)
      .then(response => {
        commit('set', response.data);
        return response.data;
      });
  },
  store({commit}, data) {
    return api.objects.store(data)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  show({commit}, id) {
    return api.objects.show(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  update({commit}, data) {
    return api.objects.update(data, data.id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  delete({commit}, id) {
    return api.objects.delete(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },

  updateStatus({commit}, data) {
    return api.objects.updateStatus(data, data.id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },

  attendeeStatus({commit}, data) {
    return api.objects.attendeeStatus(data)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },

  getAttendeeData({commit}, id) {
    return api.objects.getAttendeeData(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },

  getSingleAttendee({commit}, { id1, id2 }) {
    return api.objects.getSingleAttendee(id1, id2)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },

  responsibleStatus({commit}, data) {
    return api.objects.responsibleStatus(data)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },

  actionStore({commit}, data) {
    return api.objects.actionStore(data)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  managerAction({commit}, data) {
    return api.objects.managerAction(data)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  extend_timeline({commit}, data) {
    return api.objects.extend_timeline(data)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  extend_action({commit}, data) {
    return api.objects.extend_action(data)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },

  getResponsibleData({commit}, id) {
    return api.objects.getResponsibleData(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
};

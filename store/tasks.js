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
    assign(state.goal, form);
  },
};

export const actions = {
  index({commit},query) {
    return api.tasks.index(query)
      .then(response => {
        commit('set', response.data);
        return response.data;
      });
  },
  store({commit}, data) {
    return api.tasks.store(data)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  show({commit}, id) {
    return api.tasks.show(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  update({commit}, data) {
    return api.tasks.update(data, data.id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  progressTask({commit}, data) {
    return api.tasks.progressTask(data, data.id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  delete({commit}, id) {
    return api.tasks.delete(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },

  showGoalLimit({commit}, id) {
    return api.tasks.showGoalLimit(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  showGoal({commit}, id) {
    return api.tasks.showGoal(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  updateGoal({commit}, data) {
    return api.tasks.updateGoal(data, data.id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  showDeviationLimit({commit}, id) {
    return api.tasks.showDeviationLimit(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  showDeviation({commit}, id) {
    return api.tasks.showDeviation(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  updateDeviation({commit}, data) {
    return api.tasks.updateDeviation(data, data.id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  showReport({commit}, id) {
    return api.tasks.showReport(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  showRiskAnalysisLimit({commit}, id) {
    return api.tasks.showRiskAnalysisLimit(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  showRiskAnalysis({commit}, id) {
    return api.tasks.showRiskAnalysis(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  updateRiskAnalysis({commit}, data) {
    return api.tasks.updateRiskAnalysis(data, data.id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  showAttachmentLimit({commit}, id) {
    return api.tasks.showAttachmentLimit(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  showAttachment({commit}, id) {
    return api.tasks.showAttachment(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  updateAttachment({commit}, data) {
    return api.tasks.updateAttachment(data, data.id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  showUserTaskLimit({commit}, id) {
    return api.tasks.showUserTaskLimit(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  showUserTask({commit}, id) {
    return api.tasks.showUserTask(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  updateUserTask({commit}, data) {
    return api.tasks.updateUserTask(data, data.id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },

  // Task REPORT
  showReportTaskLimit({commit}, id) {
    return api.tasks.showReportTaskLimit(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  showReportTask({commit}, id) {
    return api.tasks.showReportTask(id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },
  updateReportTask({commit}, data) {
    return api.tasks.updateReportTask(data, data.id)
      .then(response => {
        commit('merge', response.data);
        return response.data;
      });
  },

  indexAdmin({commit},query) {
    return api.tasks.indexAdmin(query)
      .then(response => {
        commit('set', response.data);
        return response.data;
      });
  },
};

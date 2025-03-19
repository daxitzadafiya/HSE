import api from '~/apis';
import merge from 'lodash.merge';
import assign from 'lodash.assign';

export const mutations = {
    set (state, item) {
        state.list = item;
    },
    add (state, value) {
        merge(state.list, value);
    },
    remove (state, { item }) {
        state.list.filter(c => item.id !== c.id);
    },
    merge (state, form) {
        assign(state.subscriptions, form);
    },
};

export const actions = {
    planPurchase ({ commit }, data) {
        return api.subscriptions.planPurchase(data).then(response => {
            commit('merge', response.data);
            return response.data;
        });
    },
    planActive ({ commit }, data) {
        return api.subscriptions.planActive(data).then(response => {
            commit('merge', response.data);
            return response.data;
        });
    },
    planPurchaseCompleted({ commit }, data) {
        return api.subscriptions.planPurchaseCompleted(data).then((response) => {
          commit('merge', response.data)
          return response.data
        })
    },
    planCancel({ commit }, data) {
        return api.subscriptions.planCancel(data).then((response) => {
          commit('merge', response.data)
          return response.data
        })
    },
    addonPurchase ({ commit }, data) {
        return api.subscriptions.addonPurchase(data).then(response => {
            commit('merge', response.data);
            return response.data;
        });
    },
    addonCancel({ commit }, data) {
        return api.subscriptions.addonCancel(data).then((response) => {
          commit('merge', response.data)
          return response.data
        })
    },
    stripeCard ({ commit }, data) {
        return api.subscriptions.stripeCard(data).then(response => {
            commit('merge', response.data);
            return response.data;
        });
    },
    creditCheck ({ commit }, data) {
        return api.subscriptions.creditCheck(data).then(response => {
            commit('merge', response.data);
            return response.data;
        });
    },
    immediatelyDeactive({ commit }, data) {
        return api.subscriptions.immediatelyDeactive(data).then((response) => {
          commit('merge', response.data)
          return response.data
        })
    },  

};

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
        assign(state.billings, form);
    },
};

export const actions = {
    index ({ commit }, query) {
        return api.billings.index(query).then(response => {
            commit('set', response.data);
            return response.data;
        });
    },
    store ({ commit }, data) {
        return api.billings.store(data).then(response => {
            commit('merge', response.data);
            return response.data;
        });
    },
    show ({ commit }, id) {
        return api.billings.show(id).then(response => {
            commit('merge', response.data);
            return response.data;
        });
    },
    update ({ commit }, data) {
        return api.billings.update(data, data.id).then(response => {
            commit('merge', response.data);
            return response.data;
        });
    },
    delete ({ commit }, id) {
        return api.billings.delete(id).then(response => {
            commit('merge', response.data);
            return response.data;
        });
    },
    status ({ commit }, id) {
        return api.billings.status(id).then(response => {
            commit('merge', response.data);
            return response.data;
        });
    },
    sendEmail ({ commit }, id) {
        return api.billings.sendEmail(id).then(response => {
            commit('merge', response.data);
            return response.data;
        });
    },
    history ({ commit }, data) {
        return api.billings.history(data).then((response) => {
            commit('merge', response.data);
            return response.data;
        });
    },
    showHistory ({ commit }, id) {
        return api.billings.showHistory(id).then(response => {
            commit('merge', response.data);
            return response.data;
        });
    },
    pdf ({ commit }, data) {
        return api.billings.pdf(data).then((response) => {
            commit('merge', response.data);
            return response.data;
        });
    },
};

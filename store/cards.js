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
        assign(state.cards, form);
    },
};

export const actions = {
    index ({ commit }, query) {
        return api.cards.index(query).then(response => {
            commit('set', response.data);
            return response.data;
        });
    },
    store ({ commit }, data) {
        return api.cards.store(data).then(response => {
            commit('merge', response.data);
            return response.data;
        });
    },
    destroy ({ commit }, id) {
        return api.cards.destroy(id).then(response => {
            commit('merge', response.data);
            return response.data;
        });
    },
    active ({ commit }, data) {
        return api.cards.active(data).then(response => {
            commit('merge', response.data);
            return response.data;
        });
    },
};

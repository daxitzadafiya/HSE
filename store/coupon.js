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
        assign(state.plans, form);
    },
};

export const actions = {
    index ({ commit }, query) {
        return api.coupon.index(query).then(response => {
            commit('set', response.data);
            return response.data;
        });
    },
    store ({ commit }, data) {
        return api.coupon.store(data).then(response => {
            commit('merge', response.data);
            return response.data;
        });
    },
    show ({ commit }, id) {
        return api.coupon.show(id).then(response => {
            commit('merge', response.data);
            return response.data;
        });
    },
    update ({ commit }, data) {
        return api.coupon.update(data, data.id).then(response => {
            commit('merge', response.data);
            return response.data;
        });
    },
    destroy ({ commit }, id) {
        return api.coupon.destroy(id).then(response => {
            commit('merge', response.data);
            return response.data;
        });
    },
    check ({ commit }, data) {
        return api.coupon.check(data).then(response => {
            commit('merge', response.data);
            return response.data;
        });
    },
};

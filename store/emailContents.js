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
        return api.emailContents.index(query).then(response => {
            commit('set', response.data);
            return response.data;
        });
    },
    
    update ({ commit }, data) {
        return api.emailContents.update(data, data.id).then(response => {
            commit('merge', response.data);
            return response.data;
        });
    },

  
};

import api from '~/apis';
import {setAuthToken, resetAuthToken} from '~/utils/auth';
import cookies from 'js-cookie';
export const state = () => ({
  user: null
});

export const mutations = {
  setUser (store, data) {
    store.user = data;
  },
  resetUser (store) {
    store.user = null;
  } 
};

export const actions = {
  fetch ({commit}) {
    return api.auth.me()
      .then(response => {
        commit('setUser', response.data.data);
        return response;
      })
      .catch(() => {
        commit('resetUser');
      })
  },
  login ({commit}, data) {
    return api.auth.login(data)
      .then(response => {
        if(response.data && response.data.data){
          var userInfo = response.data.data;
          commit('setUser', userInfo.user_info);
          setAuthToken(userInfo.access_token);
          cookies.set('x-auth-token', userInfo.access_token, {expires: 7, path: '/'});
          cookies.set('company_id', userInfo.user_info.company_id);
          cookies.set('default_language', '');
          if (userInfo.user_info.company) {
            cookies.set('default_language', userInfo.user_info.company.language);
          }
          cookies.set('roleID', userInfo.user_info.role_id);
          cookies.set('userID', userInfo.user_info.id);
          cookies.set('username', userInfo.user_info.first_name + ' ' + userInfo.user_info.last_name);
          cookies.set('baseUrl', userInfo.base_url);
          cookies.set('userDepartmentID', userInfo.user_info.department_id);
          localStorage.setItem('permissionsKey', userInfo.permissionsKey);
          localStorage.setItem('planAccess', '');
          cookies.set('checkAdmin', '');
          cookies.set('checkSuperAdmin', '');
          cookies.set('checkCustomerServiceAdmin', '');
          cookies.set('roleUser', '');
          if (userInfo.user_info.role_id) {
            if (userInfo.checkAdmin) {
              cookies.set('checkAdmin', 1);
              cookies.set('roleUser', 'company admin');
            } else if (userInfo.user_info.role_id === 3) {
              cookies.set('roleUser', 'manager');
            } else if (userInfo.user_info.role_id === 4) {
              cookies.set('roleUser', 'user');
            } else if (userInfo.checkSuperAdmin) {
              cookies.set('checkSuperAdmin', 1);
            } else if (userInfo.checkCustomerServiceAdmin) {
              cookies.set('checkCustomerServiceAdmin', 1);
            }
          }
          if (userInfo.is_super) {
            cookies.set('isSuper', 1);
          } else {
            cookies.set('isSuper', '');
          }
          if (userInfo.assign_group) {
            cookies.set('assignGroup', 1);
          } else {
            cookies.set('assignGroup', '');
          }
        }
        return response;
      });
  },
  profile() {
    return api.auth.me()
      .then(response => {
        return response.data;
      });
  },
  forgotPassword({commit}, data){
    return api.auth.forgotPassword(data)
      .then(response => {
        commit('resetUser');
        return response;
      });
  },
  resetPassword({commit}, data){
    return api.auth.resetPassword(data)
      .then(response => {
        commit('resetUser');
        return response;
      });
  },
  reset ({commit}) {
    commit('resetUser');
    cookies.remove('x-auth-token', { path: '/' });
    resetAuthToken();
    return Promise.resolve();
  },
  logout ({commit}, data){
    return api.auth.logout(data)
      .then(response => {
        localStorage.removeItem('permissionsKey');
        localStorage.removeItem('planAccess');
        commit('resetUser');
        resetAuthToken();
        cookies.remove('x-auth-token');
        cookies.remove('roleID');
        cookies.remove('userID');
        cookies.remove('baseUrl');
        cookies.remove('userDepartmentID');
        cookies.remove('checkAdmin');
        cookies.remove('checkSuperAdmin');
        cookies.remove('checkCustomerServiceAdmin');
        cookies.remove('roleUser');
        cookies.remove('isSuper');
        return response;
      });
  },
};

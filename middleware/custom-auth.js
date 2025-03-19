import cookies from 'js-cookie';

import {setAuthToken, resetAuthToken} from '../utils/auth';
import {_} from 'vue-underscore';
import {mainDomain} from '~/config';

export default function ({store, redirect, route}) {
  const nonAuthorizePages = ['forgot-password', 'reset-password', 'verify-email'];
  var isLoggedIn = false;

  function checkNonAuthorizePage(path) {
    var result = false;
    if (path === '/login') {
      return false;
    }
    if (path === '/') {
      return true;
    }
    result = _.find(nonAuthorizePages, function (item) {
      return path.indexOf(item) > -1;
    });
    return result;
  }

  if (checkNonAuthorizePage(route.path)) {
    if (route.path === '/') {
      var hostname = location.hostname;
      if (mainDomain.indexOf(hostname) > -1) {
        return redirect('/login');
      } else {
        return Promise.resolve();
      }
    } else {
      return Promise.resolve();
    }
  } else {
    const token = cookies.get('x-auth-token');
    if (token) {
      setAuthToken(token);
      store.dispatch('authenticate/fetch').then(result => {
      
        if(result.data.data.subscription_message == 'User no subscription'){
            return redirect('/purchase');
        }
        if(result.data.data.subscription_message == ('The bill is due, please pay it')){
            return redirect('/bills');
        }
        if(result.data.data.subscription_message == ('Admin has freeze system for your company due to unpaid invoice')){
          return redirect('/bills');
      }
        if(result.data.data.subscription_message == 'There is no more space in the storage, please purchase an addon'){
          return redirect('/addon');
      }
        //Redirect to login page if user not logged in
        if (result.data.data) {
          isLoggedIn = true;
        }
        if (!isLoggedIn) {
            // Token has expired, redirect to login page
          resetAuthToken();
          return redirect('/login');
        } else {
          return Promise.resolve();
        }
      }).catch(error => {
        console.log(error);
        resetAuthToken();
        return redirect('/login');
      });
    } else {
      if (route.path.indexOf('/login') > -1) {
        return Promise.resolve();
      } else {
        resetAuthToken();
        return redirect('/login');
      }
    }

  }
}

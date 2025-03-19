import axios from 'axios';
import {baseURL} from '../config';
import cookies from 'js-cookie';
import {setAuthToken, resetAuthToken} from '~/utils/auth';

axios.defaults.baseURL = baseURL;
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
axios.defaults.headers.post['Access-Control-Allow-Credentials'] = true;

const token = cookies.get('x-auth-token');

if (token){
  setAuthToken(token);
} else{
  resetAuthToken();
}

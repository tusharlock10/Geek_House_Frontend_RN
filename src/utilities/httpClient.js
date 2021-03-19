import axios from 'axios';

import {encrypt} from './encryption';
import {store} from '../reducers';
import {HTTP_TIMEOUT, BASE_URL} from '../Constants';

const instance = axios.create({timeout: HTTP_TIMEOUT, baseURL: BASE_URL});

const {getState} = store;

const httpClient = () => {
  const {authtoken} = getState().login;
  const analysis = {requestTime: null, responseTime: null, url: null};
  instance.defaults.headers.common['Authorization'] = encrypt(authtoken);

  instance.interceptors.request.use((req) => {
    analysis.requestTime = new Date();
    analysis.url = req.url;
    if (__DEV__) {
      console.log(`HTTPS REQUEST ${analysis.url} `, {
        data: req.data,
        params: req.data,
        authtoken: req.headers.common.Authorization,
      });
    }
    return req;
  });
  instance.interceptors.response.use((res) => {
    analysis.responseTime = new Date();
    res.analysis = analysis;
    if (__DEV__) {
      console.log(
        `HTTPS RESPONSE : ${analysis.url} ${
          (analysis.responseTime - analysis.requestTime) / 1000
        }s `,
      );
    }
    return res;
  });

  return instance;
};

export {httpClient};

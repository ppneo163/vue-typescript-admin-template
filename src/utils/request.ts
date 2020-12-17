import axios from 'axios';
import { Message, MessageBox } from 'element-ui';
import { UserModule } from '@/store/modules/user';
import { randomString } from '@/utils/pub-func';

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 5000
  // withCredentials: true // send cookies when cross-domain requests
});

// Request interceptors
service.interceptors.request.use(
  (config) => {
    // Add X-Access-Token header to every request, you can add other custom headers here
    if (UserModule.token) {
      config.headers['X-Access-Token'] = UserModule.token;
    }
    if (UserModule.id) {
      config.headers['X-User-Id'] = UserModule.id;
    }
    if (UserModule.shopId) {
      config.headers['X-Shop-Id'] = UserModule.shopId;
    }
    config.headers['X-Api-Ver'] = '2.2.0';
    config.headers['X-Hos-Id'] = '100';
    config.headers['Request-No'] = 'WEB-SHOP' + new Date().getTime().toString() + randomString(10);
    config.headers['X-Api-Key'] = 'gc8U4S37ZhhoQZNeZZ0CfcWgIBfkgFEEPIWvpJaBY6DQiWWh9seq/2EckpsvVJ5saoB0PfAMEuWKrf+LGcfHkvMTcHaDc6mr7BpR+PHJF9VmbmNbi365iU9fF4BjSPdbw1lO47LwroTMrxtCDNmOBA==';
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// Response interceptors
service.interceptors.response.use(
  (response) => {
    // Some example codes here:
    // code == 0: success
    // code == 50001: invalid access token
    // code == 50002: already login in other place
    // code == 50003: access token expired
    // code == 50004: invalid user (user not exist)
    // code == 50005: username or password is incorrect
    // You can change this part for your own usage.
    const res = response.data;
    if (res.code !== 0) {
      Message({
        message: (res.message || 'Error') + ' code:' + res.code,
        type: 'error',
        duration: 5 * 1000
      });
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        MessageBox.confirm(
          '你已被登出，可以取消继续留在该页面，或者重新登录',
          '确定登出',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          UserModule.ResetToken();
          location.reload(); // To prevent bugs from vue-router
        });
      }
      return Promise.reject(new Error(res.message || 'Error'));
    } else {
      return response.data;
    }
  },
  (error) => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

export default service;

import axios from 'axios';
import { Message, MessageBox, Loading } from 'element-ui';
import { UserModule } from '@/store/modules/user';
import { randomString } from '@/utils/pub-func';
import { ElLoadingComponent } from 'element-ui/types/loading';

// 全局loading遮罩层
let loading : ElLoadingComponent;

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 5000
  // withCredentials: true // send cookies when cross-domain requests
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 请求loading
    loading = Loading.service({
      lock: true,
      text: '拼命加载中...',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)',
      customClass: 'full-screen-loading'
    });

    // 加入自定义的请求头
    config.headers['X-Access-Token'] = UserModule.token;
    config.headers['X-User-Id'] = UserModule.id;
    config.headers['X-Shop-Id'] = UserModule.shopId;
    config.headers['X-Api-Ver'] = '2.2.0';
    config.headers['X-Hos-Id'] = '100';
    config.headers['Request-No'] = 'WEB-SHOP' + new Date().getTime().toString() + randomString(10);
    config.headers['X-Api-Key'] = 'gc8U4S37ZhhoQZNeZZ0CfcWgIBfkgFEEPIWvpJaBY6DQiWWh9seq/2EckpsvVJ5saoB0PfAMEuWKrf+LGcfHkvMTcHaDc6mr7BpR+PHJF9VmbmNbi365iU9fF4BjSPdbw1lO47LwroTMrxtCDNmOBA==';
    return config;
  },
  (error) => {
    // 异常时 关闭 loading
    loading.close();
    Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 响应 关闭 loading
    loading.close();

    // Some example codes here:
    // code == 0: rest success
    // code == 20000: mock success
    // code == 50001: invalid access token
    // code == 50002: already login in other place
    // code == 50003: access token expired
    // code == 50004: invalid user (user not exist)
    // code == 50005: username or password is incorrect
    // You can change this part for your own usage.
    const res = response.data;
    if (res.code !== 0 && res.code !== 20000) {
      Message({
        message: (res.message || 'Error') + ' 【错误码：' + res.code + '】',
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
          UserModule.ClearUser();
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

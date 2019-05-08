import axios from 'axios';
import {
  Message
  // MessageBox
} from 'element-ui';
import store from '../store';
import {
  setToken,
  getToken
} from '@/utils/auth';

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  headers: {
    // 'Content-Type': 'application/x-www-form-urlencoded'
    'Content-Type': 'application/json'
  },
  timeout: 30000 // 请求超时时间
});

// request拦截器
service.interceptors.request.use(config => {
  config.headers['x-token'] = getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
  return config;
}, error => {
  // Do something with request error
  console.log(error); // for debug
  Promise.reject(error);
});

// respone拦截器
service.interceptors.response.use(
  response => {
    /**
     * rcode为非20000是抛错 可结合自己业务进行修改
     */
    const res = response.data;
    if (res.rcode !== '000000') {
      // Message({
      //   message: res.message,
      //   type: 'error',
      //   duration: 5 * 1000
      // });

      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (res.rcode === '999999') {
        store.dispatch('FedLogOut').then(() => {
          location.reload(); // 为了重新实例化vue-router对象 避免bug
        });
      }
      if (res.rcode === '999998') {
        Message({
          message: res.message,
          type: 'error',
          duration: 5 * 1000
        });
      }
    } else {
      setToken(response.headers['x-token']);
      return response.data;
    }
  },
  error => {
    console.log('err' + error); // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

export default service;

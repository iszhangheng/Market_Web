import axios from 'axios';
import {
  Message
  // MessageBox
} from 'element-ui';
// import store from '../store';
// import {
//   setToken,
//   getToken
// } from '@/utils/auth';

// 创建axios实例
const service = axios.create({
  // 配置接口的协议地址端口信息
  baseURL: process.env.BASE_API,
  headers: {
    // 设置请求方式
    'Content-Type': 'application/json'
  },
  // 请求超时时间
  timeout: 30000
});

// request拦截器
service.interceptors.request.use(config => {
  // 将服务器返回的Token令牌放入请求头
  // config.headers['x-token'] = getToken();
  return config;
}, error => {
  Promise.reject(error);
});

// respone拦截器
service.interceptors.response.use(
  response => {
    // // 获取请求返回的数据
    // const res = response.data;
    // // 正常返回的状态码为000000若状态码不是000000则进入异常处理
    // if (res.rcode !== '000000') {

    //   // 状态码'999999'为令牌过期需重新登录
    //   if (res.rcode === '999999') {
    //     store.dispatch('FedLogOut').then(() => {
    //       // 为了重新实例化vue-router对象 避免bug
    //       location.reload();
    //     });
    //   }
    //   if (res.rcode === '999998') {
    //     Message({
    //       message: res.msg,
    //       type: 'error',
    //       duration: 5 * 1000
    //     });
    //   }
    // } else {
    //   // 若返回数据正常则将返回的新令牌记录下来
    //   setToken(response.headers['x-token']);
    //   return response.data;
    // }
  },
  error => {
    console.log('err' + error);
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

export default service;

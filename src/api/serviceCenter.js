import request from '@/utils/request';

const baseUrl = '/service_center';
const url = {
  addBuyInfo: baseUrl + '/add_buy_info.tml', // 添加报销
  addRestInfo: baseUrl + '/add_rest_info.tml', // 开户服务
  getRestInfo: baseUrl + '/get_rest_info.tml' // 开户服务
};

const serviceCenterApi = {
  addRestInfo(data) {
    return request({
      url: url.addRestInfo,
      method: 'post',
      data
    });
  },
  addBuyInfo(data) {
    return request({
      url: url.addBuyInfo,
      method: 'post',
      data
    });
  },
  getRestInfo(data) {
    return request({
      url: url.getRestInfo,
      method: 'post',
      data
    });
  }
};

export default serviceCenterApi;

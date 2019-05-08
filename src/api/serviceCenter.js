import request from '@/utils/request';

const baseUrl = '/service_center';
const url = {
  addRestInfo: baseUrl + '/add_rest_info.tml' // 开户服务
};

const serviceCenterApi = {
  addRestInfo(data) {
    return request({
      url: url.addRestInfo,
      method: 'post',
      data
    });
  }
};

export default serviceCenterApi;

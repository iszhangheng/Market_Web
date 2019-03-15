import request from '@/utils/request';

const url = {
  accountOopeningService: 'service_detail_count.tml?flow=serviceDetail', // 开户服务
  balanceInquiry: '' // 余额查询
};

const serviceApi = {
  accountOopeningService(data) {
    return request({
      url: url.accountOopeningService,
      method: 'post',
      data
    });
  },
  balanceInquiry(data) {
    return request({
      url: url.balanceInquiry,
      method: 'post',
      data
    });
  }
};

export default serviceApi;
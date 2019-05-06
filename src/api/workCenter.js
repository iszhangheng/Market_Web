import request from '@/utils/request';

const baseUrl = '/work_center';

const url = {
  sellLog: baseUrl + '/sell_log.tml', // 商品销售记录
  productDetails: baseUrl + '/product_details.tml' // 商品详情接口
};

const workCenterApi = {
  productDetails(data) {
    return request({
      url: url.productDetails,
      method: 'post',
      data
    });
  },
  sellLog(data) {
    return request({
      url: url.sellLog,
      method: 'post',
      data
    });
  }
};

export default workCenterApi;

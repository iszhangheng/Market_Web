import request from '@/utils/request';

const baseUrl = '/work_center';

const url = {
  productDetails: baseUrl + '/product_details.tml' // 商品详情接口
};

const workCenterApi = {
  productDetails(data) {
    return request({
      url: url.productDetails,
      method: 'post',
      data
    });
  }
};

export default workCenterApi;

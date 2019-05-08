import request from '@/utils/request';

const baseUrl = '/work_center';

const url = {
  sellLog: baseUrl + '/sell_log.tml', // 商品销售记录
  productDetails: baseUrl + '/product_details.tml', // 商品详情接口
  employeeInfo: '/employee_info/get_employee_list.tml', // 员工管理接口
  tbInfo: '/get_dept_post.tml', // 码表查询
  deleteEmployee: '/delete_employee.tml'
};

const workCenterApi = {
  tbInfo(data) {
    return request({
      url: url.tbInfo,
      method: 'post',
      data
    });
  },
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
  },
  employeeInfo(data) {
    return request({
      url: url.employeeInfo,
      method: 'post',
      data
    });
  },
  deleteEmployee(data) {
    return request({
      url: url.deleteEmployee,
      method: 'post',
      data
    });
  }
};

export default workCenterApi;

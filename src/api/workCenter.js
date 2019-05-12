import request from '@/utils/request';

const baseUrl = '/work_center';

const url = {
  addProductSell: baseUrl + '/add__product_sell.tml',
  getProductGroupId: baseUrl + '/get_group_id_list.tml',
  getProductSellLine: baseUrl + '/get_product_sell_line.tml',
  getProductSellList: baseUrl + '/get_product_sell_list.tml',
  getProductLine: baseUrl + '/get_product_line.tml',
  getProductList: baseUrl + '/get_product_list.tml',
  addProduct: baseUrl + '/add_product.tml',
  addEmployee: '/employee_info/add_employee_info.tml',
  checkFlow: baseUrl + '/check_flow.tml', // 审批流程
  updateFlow: baseUrl + '/update_flow.tml', // 更新流程
  sellLog: baseUrl + '/sell_log.tml', // 商品销售记录
  productDetails: baseUrl + '/product_details.tml', // 商品详情接口
  employeeInfo: '/employee_info/get_employee_list.tml', // 员工管理接口
  tbInfo: '/get_dept_post.tml', // 码表查询
  deleteEmployee: '/delete_employee.tml'
};

const workCenterApi = {
  addProductSell(data) {
    return request({
      url: url.addProductSell,
      method: 'post',
      data
    });
  },
  getProductGroupId(data) {
    return request({
      url: url.getProductGroupId,
      method: 'post',
      data
    });
  },
  getProductSellList(data) {
    return request({
      url: url.getProductSellList,
      method: 'post',
      data
    });
  },
  getProductSellLine(data) {
    return request({
      url: url.getProductSellLine,
      method: 'post',
      data
    });
  },
  getProductLine(data) {
    return request({
      url: url.getProductLine,
      method: 'post',
      data
    });
  },
  getProductList(data) {
    return request({
      url: url.getProductList,
      method: 'post',
      data
    });
  },
  addProduct(data) {
    return request({
      url: url.addProduct,
      method: 'post',
      data
    });
  },
  checkFlow(data) {
    return request({
      url: url.checkFlow,
      method: 'post',
      data
    });
  },
  addEmployee(data) {
    return request({
      url: url.addEmployee,
      method: 'post',
      data
    });
  },
  updateFlow(data) {
    return request({
      url: url.updateFlow,
      method: 'post',
      data
    });
  },
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

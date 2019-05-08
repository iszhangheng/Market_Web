export default [{
    path: 'product-details',
    name: 'productDetails',
    component: () =>
      import('@/views/workCenter/productDetails/index.vue'),
    meta: {
      title: 'productDetails', // 产品详情
      roles: 'base'
    }
  },
  {
    path: 'company_profit',
    name: 'companyProfit',
    component: () =>
      import('@/views/workCenter/companyProfit/index.vue'),
    meta: {
      title: 'companyProfit', // 公司盈利
      roles: 'base'
    }
  },
  {
    path: 'sell-log',
    name: 'sellLog',
    component: () =>
      import('@/views/workCenter/sellLog/index.vue'),
    meta: {
      title: 'sellLog', // 销售记录
      roles: 'base'
    }
  },
  // 采购部
  {
    path: 'purchase-request',
    name: 'purchaseRequest',
    component: () =>
      import('@/views/workCenter/index.vue'),
    meta: {
      title: 'purchaseRequest', // 采购申请
      roles: 'base'
    }
  },
  // 销售部
  {
    path: 'out-storage-request',
    name: 'outStorageRequest',
    component: () =>
      import('@/views/workCenter/index.vue'),
    meta: {
      title: 'outStorageRequest', // 销售申请
      roles: 'base'
    }
  },
  {
    path: 'indent_request',
    name: 'indentRequest',
    component: () =>
      import('@/views/workCenter/index.vue'),
    meta: {
      title: 'indentRequest', // 订单查询
      roles: 'base'
    }
  },
  {
    path: 'product-bad-request',
    name: 'productBadRequest',
    component: () =>
      import('@/views/workCenter/index.vue'),
    meta: {
      title: 'productBadRequest', // 商品损毁报告
      roles: 'base'
    }
  },
  // 人事部
  {
    path: 'employee_info',
    name: 'employeeInfo',
    component: () =>
      import('@/views/workCenter/employeeInfo/index.vue'),
    meta: {
      title: 'employeeInfo', // 员工基本信息
      roles: 'employeeInfo'
    }
  },
  {
    path: 'employee_add',
    name: 'employeeAdd',
    component: () =>
      import('@/views/workCenter/employeeAdd/index.vue'),
    meta: {
      title: 'employeeAdd', // 员工基本信息
      roles: 'employeeAdd'
    }
  },
  {
    path: 'roles_manage',
    name: 'rolesManage',
    component: () =>
      import('@/views/workCenter/index.vue'),
    meta: {
      title: 'rolesManage', // 权限调整
      roles: 'rolesManage'
    }
  }
];

export default [{
    path: 'product-details',
    name: 'productDetails',
    component: () =>
      import('@/views/workCenter/productDetails/index.vue'),
    meta: {
      title: 'productDetails', // 产品详情
      roles: 'productDetail'
    }
  },
  // {
  //   path: 'company_profit',
  //   name: 'companyProfit',
  //   component: () =>
  //     import('@/views/workCenter/companyProfit/index.vue'),
  //   meta: {
  //     title: 'companyProfit', // 公司盈利
  //     roles: 'companyEarnings'
  //   }
  // },
  {
    path: 'sell-log',
    name: 'sellLog',
    component: () =>
      import('@/views/workCenter/sellLog/index.vue'),
    meta: {
      title: 'sellLog', // 销售记录
      roles: 'sellLog'
    }
  },
  // 采购部
  {
    path: 'purchase-request',
    name: 'purchaseRequest',
    component: () =>
      import('@/views/workCenter/purchaseRequest/index.vue'),
    meta: {
      title: 'purchaseRequest', // 采购申请
      roles: 'purchaseRequest'
    }
  },
  // 销售部
  {
    path: 'out-storage-request',
    name: 'outStorageRequest',
    component: () =>
      import('@/views/workCenter/outStorageRequest/index.vue'),
    meta: {
      title: 'outStorageRequest', // 销售申请
      roles: 'outStorageRequest'
    }
  },
  // {
  //   path: 'product-bad-request',
  //   name: 'productBadRequest',
  //   component: () =>
  //     import('@/views/workCenter/index.vue'),
  //   meta: {
  //     title: 'productBadRequest', // 商品损毁报告
  //     roles: 'productDad'
  //   }
  // },
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
    path: 'flow-check',
    name: 'flowCheck',
    component: () =>
      import('@/views/workCenter/flowCheck/index.vue'),
    meta: {
      title: 'flowCheck', // 流程审批
      roles: 'base'
    }
  }
  // {
  //   path: 'roles_manage',
  //   name: 'rolesManage',
  //   component: () =>
  //     import('@/views/workCenter/index.vue'),
  //   meta: {
  //     title: 'rolesManage', // 权限调整
  //     roles: 'rolesManage'
  //   }
  // }
];

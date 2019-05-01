export default [
  {
    path: 'product-details',
    name: 'productDetails',
    component: () =>
      import('@/views/workCenter/index.vue'),
    meta: {
      title: 'productDetails', // 产品详情
      roles: 'base'
    }
  },
  {
    path: 'sell-log',
    name: 'sellLog',
    component: () =>
      import('@/views/workCenter/index.vue'),
    meta: {
      title: 'sellLog', // 销售记录
      roles: 'base'
    }
  },
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
  {
    path: 'in-storage-request',
    name: 'inStorageRequest',
    component: () =>
      import('@/views/workCenter/index.vue'),
    meta: {
      title: 'inStorageRequest', // 入库申请
      roles: 'base'
    }
  },
  {
    path: 'out-storage-request',
    name: 'outStorageRequest',
    component: () =>
      import('@/views/workCenter/index.vue'),
    meta: {
      title: 'outStorageRequest', // 出库申请
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
  }
];

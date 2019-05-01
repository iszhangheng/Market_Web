export default [{
    path: 'account-service',
    name: 'accountService',
    component: () =>
      import('@/views/service/accountService/index'),
    meta: {
      title: 'accountService'
      // icon: ''
    }
  },
  {
    path: 'balance-query',
    name: 'balanceQuery',
    component: () =>
      import('@/views/service/balanceQuery/index'),
    meta: {
      title: 'balanceQuery'
      // icon: ''
    }
  }
];

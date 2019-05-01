export default [
  // {
  //   path: 'ps-channel-count',
  //   name: 'psChannelCount',
  //   component: () =>
  //     import ('@/views/product/psChannelCount/index'),
  //   meta: {
  //     title: 'psChannelCount'
  //     // icon: ''
  //   }
  // },
  // {
  //   path: 'ps-adress-count',
  //   name: 'psAdressCount',
  //   component: () =>
  //     import ('@/views/product/psAdressCount/index'),
  //   meta: {
  //     title: 'psAdressCount'
  //     // icon: ''
  //   }
  // },
  // {
  //   path: 'ps-bkcode-count',
  //   name: 'psBkcodeCount',
  //   component: () =>
  //     import ('@/views/product/psBkcodeCount/index'),
  //   meta: {
  //     title: 'psBkcodeCount'
  //     // icon: ''
  //   }
  // },
  // {
  //   path: 'ps-idtfno-count',
  //   name: 'psIdtfnoCount',
  //   component: () =>
  //     import ('@/views/product/psIdtfnoCount/index'),
  //   meta: {
  //     title: 'psIdtfnoCount'
  //     // icon: ''
  //   }
  // }
  {
      path: 'trade-statistics',
      name: 'tradeStatistics',
      component: () =>
        import ('@/views/product/tradeStatistics/index'),
      meta: {
        title: 'tradeStatistics'
        // icon: ''
      }
    },
  {
    path: 'deposits-to-buy',
    name: 'depositsToBuy',
    component: () =>
      import ('@/views/product/depositsToBuy/index'),
    meta: {
      title: 'depositsToBuy'
      // icon: ''
    }
  }
];
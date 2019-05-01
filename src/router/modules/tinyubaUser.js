export default [
  // 用户信息
  {
    path: 'user-attributes',
    name: 'userattributes',
    component: () =>
      import('@/views/user/userAttributes/index'),
    meta: {
      title: 'userAttributes'
      // icon: ''
    }
  },
  // 设备信息
  {
    path: 'device-attributes',
    name: 'deviceattributes',
    component: () =>
      import('@/views/user/deviceAttributes/index'),
    meta: {
      title: 'deviceAttributes'
      // icon: ''
    }
  },
  // 业务信息
  {
    path: 'business-attributes',
    name: 'businessattributes',
    component: () =>
      import('@/views/user/businessAttributes/index'),
    meta: {
      title: 'businessAttributes'
      // icon: ''
    }
  }
  // {
  //   path: 'user-mobile-area',
  //   name: 'userMobileArea',
  //   component: () =>
  //     import('@/views/user/userMobileArea/index'),
  //   meta: {
  //     title: 'userMobileArea'
  //     // icon: ''
  //   }
  // },
  // {
  //   path: 'avg-time-login',
  //   name: 'avgTimeLogin',
  //   component: () =>
  //     import('@/views/user/avgTimeLogin/index'),
  //   meta: {
  //     title: 'avgTimeLogin'
  //     // icon: ''
  //   }
  // }
];

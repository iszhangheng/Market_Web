export default [
  {
    path: 'my-holiday',
    name: 'myHoliday',
    component: () =>
      import('@/views/personalDetail/myHoliday/index.vue'),
    meta: {
      title: 'myHoliday', // 我的假期
      roles: 'base'
    }
  },
  {
    path: 'my-flow',
    name: 'myFlow',
    component: () =>
      import('@/views/personalDetail/myFlow/index.vue'),
    meta: {
      title: 'myFlow', // 我的流程
      roles: 'base'
    }
  },
  {
    path: 'my-check',
    name: 'myCheck',
    component: () =>
      import('@/views/personalDetail/myCheck/index.vue'),
    meta: {
      title: 'myCheck', // 我的考勤
      roles: 'base'
    }
  },
  {
    path: 'my-info',
    name: 'myInfo',
    component: () =>
      import('@/views/personalDetail/index.vue'),
    meta: {
      title: 'myInfo', // 个人信息
      roles: 'base'
    }
  }
];

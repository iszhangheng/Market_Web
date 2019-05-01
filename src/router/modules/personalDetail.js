export default [
  {
    path: 'my-holiday',
    name: 'myHoliday',
    component: () =>
      import('@/views/personalDetail/index.vue'),
    meta: {
      title: 'myHoliday',
      roles: 'base'
    }
  },
  {
    path: 'my-flow',
    name: 'myFlow',
    component: () =>
      import('@/views/personalDetail/index.vue'),
    meta: {
      title: 'myFlow',
      roles: 'base'
    }
  },
  {
    path: 'my-checking-in',
    name: 'myCheckingIn',
    component: () =>
      import('@/views/personalDetail/index.vue'),
    meta: {
      title: 'myCheckingIn',
      roles: 'base'
    }
  },
  {
    path: 'my-info',
    name: 'myInfo',
    component: () =>
      import('@/views/personalDetail/index.vue'),
    meta: {
      title: 'myInfo',
      roles: 'base'
    }
  }
];

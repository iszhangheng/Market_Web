export default [
  {
    path: 'base',
    name: 'base',
    component: () =>
      import('@/views/personalDetail/index.vue'),
    meta: {
      title: 'attributes',
      roles: 'base'
    }
  }
];

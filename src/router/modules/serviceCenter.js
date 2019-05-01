export default [
  {
    path: 'rest-request',
    name: 'restRequest',
    component: () =>
      import('@/views/serviceCenter/index.vue'),
    meta: {
      title: 'restRequest', // 休假申请
      roles: 'base'
    }
  },
  {
    path: 'cancell-the-leave',
    name: 'cancellTheLeave',
    component: () =>
      import('@/views/personalDetail/index.vue'),
    meta: {
      title: 'cancellTheLeave', // 销假申请
      roles: 'base'
    }
  },
  {
    path: 'expense-request',
    name: 'expenseRequest',
    component: () =>
      import('@/views/serviceCenter/index.vue'),
    meta: {
      title: 'expenseRequest', // 报销申请
      roles: 'base'
    }
  }
];

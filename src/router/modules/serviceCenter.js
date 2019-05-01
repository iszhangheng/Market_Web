export default [
  {
    path: 'rest-request',
    name: 'restRequest',
    component: () =>
      import('@/views/serviceCenter/index.vue'),
    meta: {
      title: 'restRequest',
      roles: 'base'
    }
  },
  {
    path: 'cancell-the-leave',
    name: 'cancellTheLeave',
    component: () =>
      import('@/views/personalDetail/index.vue'),
    meta: {
      title: 'cancellTheLeave',
      roles: 'base'
    }
  },
  {
    path: 'expense-request',
    name: 'expenseRequest',
    component: () =>
      import('@/views/serviceCenter/index.vue'),
    meta: {
      title: 'expenseRequest',
      roles: 'base'
    }
  }
];

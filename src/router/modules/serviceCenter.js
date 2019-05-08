export default [{
    path: 'rest-request',
    name: 'restRequest',
    component: () =>
      import('@/views/serviceCenter/restRequest/index.vue'),
    meta: {
      title: 'restRequest', // 休假申请
      roles: 'base'
    }
  },
  {
    path: 'expense-request',
    name: 'expenseRequest',
    component: () =>
      import('@/views/serviceCenter/expenseRequest/index.vue'),
    meta: {
      title: 'expenseRequest', // 报销申请
      roles: 'base'
    }
  },
  {
    path: 'employee-select',
    name: 'employeeSelect',
    component: () =>
      import('@/views/serviceCenter/employeeSelect/index.vue'),
    meta: {
      title: 'employeeSelect', // 查询员工联系方式
      roles: 'base'
    }
  }
];

export default [{
    path: 'service-invoke-monitor',
    name: 'serviceInvokeMonitor',
    component: () =>
      import('@/views/serviceMonitoring/serviceInvokeMonitor/index'),
    meta: {
      title: 'serviceInvokeMonitor'
      // icon: ''
    }
  },
  // {
  //   path: 'task-exception',
  //   name: 'taskException',
  //   component: () =>
  //     import ('@/views/serve/taskException/index'),
  //   meta: {
  //     title: 'taskException'
  //     // icon: ''
  //   }
  // },
  {
    path: 'service-error-info',
    name: 'serviceErrorInfo',
    component: () =>
      import('@/views/serviceMonitoring/serviceErrorInfo/index'),
    meta: {
      title: 'serviceErrorInfo'
      // icon: ''
    }
  }
];

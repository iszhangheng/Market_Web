export default [
  // {
  //   path: 'app-control',
  //   name: 'appControl',
  //   component: () =>
  //     import ('@/views/app/appControl/index'),
  //   meta: {
  //     title: 'appControl'
  //     // icon: ''
  //   }
  // },
  {
    path: 'app-page',
    name: 'appPage',
    component: () =>
      import('@/views/app/appPage/index'),
    meta: {
      title: 'pageAccess'
      // icon: ''
    }
  },
  {
    path: 'url-rel',
    name: 'appRelation',
    component: () =>
      import('@/views/app/appUrlRel/index'),
    meta: {
      title: 'pageRelation'
      // icon: ''
    }
  },
  {
    path: 'app-template-manage',
    name: 'appTemplateManage',
    component: () =>
      import('@/views/app/appTemplateManage/index'),
    meta: {
      title: 'templateManage'
      // icon: ''
    }
  },
  {
    path: 'event-analysis',
    name: 'eventAnalysis',
    component: () =>
      import('@/views/app/eventAnalysis/index'),
    meta: {
      title: 'eventAnalysis'
      // icon: ''
    }
  },
  {
    path: 'app-crash',
    name: 'appCrash',
    component: () =>
      import('@/views/app/appCrash/index'),
    meta: {
      title: 'appCrash'
      // icon: ''
    }
  }
];

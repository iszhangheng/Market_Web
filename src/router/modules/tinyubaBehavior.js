export default [
  {
    path: 'page-analysis',
    name: 'pageAnalysis',
    component: () =>
      import('@/views/behaviorAnalysis/pageAnalysis/index'),
    meta: {
      title: 'pageAnalysis'
      // icon: ''
    }
  },
  {
    path: 'link-analysis',
    name: 'linkAnalysis',
    component: () =>
      import('@/views/behaviorAnalysis/linkAnalysis/index'),
    meta: {
      title: 'linkAnalysis'
      // icon: ''
    }
  },
  {
    path: 'event-analysis',
    name: 'eventAnalysis',
    component: () =>
      import('@/views/behaviorAnalysis/eventAnalysis/index'),
    meta: {
      title: 'eventAnalysis'
      // icon: ''
    }
  },
  {
    path: 'retained-analysis',
    name: 'retainedAnalysis',
    component: () =>
      import('@/views/behaviorAnalysis/retainedAnalysis/index'),
    meta: {
      title: 'retainedAnalysis'
      // icon: ''
    }
  },
  {
    path: 'hotspot-analysis',
    name: 'hotspotAnalysis',
    component: () =>
      import('@/views/behaviorAnalysis/hotspotAnalysis/index'),
    meta: {
      title: 'hotspotAnalysis'
      // icon: ''
    }
  },
  {
    path: 'equipment-analysis',
    name: 'equipmentAnalysis',
    component: () =>
      import('@/views/behaviorAnalysis/equipmentAnalysis/index'),
    meta: {
      title: 'equipmentAnalysis'
      // icon: ''
    }
  },
  {
    path: 'template-manage',
    name: 'templateManage',
    component: () =>
      import ('@/views/behaviorAnalysis/templateManage/index'),
    meta: {
      title: 'templateManage'
      // icon: ''
    }
  }
];

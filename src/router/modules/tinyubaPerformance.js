export default [
  {
    path: 'crash-logs',
    name: 'crashLogs',
    component: () =>
      import('@/views/performanceAnalysis/crashLogs/index'),
    meta: {
      title: 'crashLogs'
      // icon: ''
    }
  },
  {
    path: 'network-time',
    name: 'networkTime',
    component: () =>
      import('@/views/performanceAnalysis/networkTime/index'),
    meta: {
      title: 'networkTime'
      // icon: ''
    }
  },
  {
    path: 'page-rendering-time',
    name: 'pageRenderingTime',
    component: () =>
      import('@/views/performanceAnalysis/pageRenderingTime/index'),
    meta: {
      title: 'pageRenderingTime'
      // icon: ''
    }
  },
  {
    path: 'performance-indicators',
    name: 'performanceIndicators',
    component: () =>
      import('@/views/performanceAnalysis/performanceIndicators/index'),
    meta: {
      title: 'performanceIndicators'
      // icon: ''
    }
  }
];

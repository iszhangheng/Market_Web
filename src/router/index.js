import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

// 布局容器
import Layout from '@/views/layout/Layout';

// 引入业务模块，当业务模块过多时，便于管理
// import routerUser from '@/router/modules/routerUser';

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']    will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [{
    path: '/login',
    component: () =>
      import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () =>
      import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () =>
      import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      name: 'dashboard',
      component: () =>
        import('@/views/dashboard/index'),
      meta: {
        title: 'dashboard',
        icon: 'dashboard'
      }
    }]
  }
  // // user模块
  // {
  //   path: '/user',
  //   component: Layout,
  //   name: 'user',
  //   meta: {
  //     title: 'user',
  //     icon: 'peoples'
  //   },
  //   children: [{
  //     path: '',
  //     name: 'dashboard',
  //     component: () =>
  //       import('@/views/dashboard/index'),
  //     meta: {
  //       title: 'dashboard',
  //       icon: 'dashboard'
  //     }
  //   }]
  // }
  // // product模块
  // {
  //   path: '/product',
  //   component: Layout,
  //   redirect: '/product/trade-statistics',
  //   name: 'trade-statistics',
  //   meta: {
  //     title: 'product',
  //     // icon: 'rule'
  //     icon: 'product'
  //   },
  //   children: tinyubaProduct
  // },
  // // service模块
  // {
  //   path: '/service',
  //   component: Layout,
  //   redirect: '/service/account-service',
  //   name: 'account-service',
  //   meta: {
  //     title: 'service',
  //     icon: 'service'
  //   },
  //   children: tinyubaService
  // },
  // // page模块
  // {
  //   path: '/operation',
  //   component: Layout,
  //   redirect: '/operation/url-sum-time',
  //   name: 'url-users-count',
  //   meta: {
  //     title: 'operation',
  //     icon: 'behavior'
  //   },
  //   children: tinyuba0peration
  // },
  // // serve模块
  // {
  //   path: '/serve',
  //   component: Layout,
  //   redirect: '/serve/service-invoke-monitor',
  //   name: 'service-invoke-monitor',
  //   meta: {
  //     title: 'serve',
  //     icon: 'monitor'
  //   },
  //   children: tinyubaServe
  // },
  // // app模块
  // {
  //   path: '/app',
  //   component: Layout,
  //   redirect: '/app/app-page',
  //   name: 'app-page',
  //   meta: {
  //     title: 'app',
  //     icon: 'statistical'
  //   },
  //   children: tinyubaApp
  // },
  // // 字典模块
  // {
  //   path: '/dictManage',
  //   component: Layout,
  //   redirect: '/dict-manage/pageDictionary',
  //   name: 'page-dictionary',
  //   meta: {
  //     title: 'dictionaryManage',
  //     icon: 'dictionaries'
  //   },
  //   children: tinyubaDictmanage
  // }
];

export default new Router({
  mode: 'history', // 后端支持可开
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
});

export const asyncRouterMap = [{
  path: '*',
  redirect: '/404',
  hidden: true
}];

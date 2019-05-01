import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

// 布局容器
import Layout from '@/views/layout/Layout';
import personalDetail from './modules/personalDetail';
import serviceCenter from './modules/serviceCenter';
import workCenter from './modules/workCenter';

export const constantRouterMap = [{
    path: '/login',
    component: () =>
      import('@/views/login/index'),
    hidden: false
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
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      name: 'dashboard',
      component: () =>
        import('@/views/dashboard/index'),
      meta: {
        title: 'dashboard',
        icon: 'dashboard',
        roles: 'base'
      }
    }]
  }
];

export default new Router({
  mode: 'history', // 后端支持可开
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
});

export const asyncRouterMap = [
  // 工作中心模块
  {
    path: '/work',
    component: Layout,
    name: 'work-center',
    meta: {
      title: 'workCenter',
      icon: 'peoples',
      roles: 'base'
    },
    children: workCenter
  },
  // 服务中心模块
  {
    path: '/service',
    component: Layout,
    // redirect: '/product/trade-statistics',
    name: 'service-center',
    meta: {
      title: 'serviceCenter',
      icon: 'service',
      roles: 'base'
    },
    children: serviceCenter
  },
  // 个人信息模块
  {
    path: '/personal',
    component: Layout,
    // redirect: '/service/account-service',
    name: 'personal-datails',
    redirect: 'myHoliday',
    meta: {
      title: 'personalDetail',
      icon: 'product',
      roles: 'base'
    },
    children: personalDetail
  }
];

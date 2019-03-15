import Vue from 'vue';
import 'normalize.css/normalize.css'; // A modern alternative to CSS resets
import Element from 'element-ui';
import Egrid from 'egrid'; // Element table
import './styles/index.scss'; // global css
import router from './router';
import store from './store';
import i18n from './lang'; // internationalization
import './utils/moment'; // moment
import './icons'; // icon
import './permission'; // permission control
import echarts from 'echarts';
Vue.prototype.$echarts = echarts;
// import * as filters from './filters'; // global filters

Vue.use(Element, {
  size: 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
});
Vue.use(Egrid);

// register global utility filters.
// Object.keys(filters).forEach(key => {
//   Vue.filter(key, filters[key]);
// });

Vue.config.productionTip = false;
new Vue({
  name: 'app',
  router,
  store,
  i18n,
  template: '<router-view></router-view>'
}).$mount('#app');

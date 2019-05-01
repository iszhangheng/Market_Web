import request from '@/utils/request';
// 通过 post请求时，参数选择 data
// 通过 get请求时，参数选择 params
const isDev = process.env.NODE_ENV === 'development';
const url = {
  crashLogs: isDev ? '/performance/crash' : '/crash_log/get_table.tml', // 崩溃日志
  networkTime: isDev ? '/performance/network' : '/network_time/get_table.tml', // 网络时间
  pageRenderingTime: isDev ? '/performance/rendering' : '/page_render_time/get_table.tml', // 页面渲染时间
  performanceIndicators: isDev ? '/performance/indicators' : '/property_target/get_table.tml', // 性能指标
  exceptionList: isDev ? '/exception/list' : '/exception_param_list.tml' // 错误类型列表
};

const performanceApi = {
  crashLogs(data) {
    return request({
      url: url.crashLogs,
      method: 'post',
      data
    });
  },
  networkTime(data) {
    return request({
      url: url.networkTime,
      method: 'post',
      data
    });
  },
  pageRenderingTime(data) {
    return request({
      url: url.pageRenderingTime,
      method: 'post',
      data
    });
  },
  performanceIndicators(data) {
    return request({
      url: url.performanceIndicators,
      method: 'post',
      data
    });
  },
  exceptionList(data) {
    return request({
      url: url.exceptionList,
      method: 'post',
      data
    });
  }
};

export default performanceApi;


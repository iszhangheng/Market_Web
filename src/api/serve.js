import request from '@/utils/request';

const url = {
  serviceErrorInfo: 'service_error_info.tml?flow=list', // 服务错误信息
  serviceErrorInfoError: 'service_error_info.tml?flow=lineErrorNum', //
  serviceInvokeMonitor: 'service_invoke_monitor.tml?flow=list', // 被监听服务成功率                                                             //
  taskException: 'task_exception.tml?flow=list', // 任务异常
  errorInfoDetail: 'error_info_detail.tml?flow=list' // 错误信息详情
};

const serveApi = {
  serviceErrorInfo(data) {
    return request({
      url: url.serviceErrorInfo,
      method: 'post',
      data
    });
  },
  serviceErrorInfoError(data) {
    return request({
      url: url.serviceErrorInfoError,
      method: 'post',
      data
    });
  },
  serviceInvokeMonitor(data) {
    return request({
      url: url.serviceInvokeMonitor,
      method: 'post',
      data
    });
  },
  taskException(data) {
    return request({
      url: url.taskException,
      method: 'post',
      data
    });
  },
  errorInfoDetail(data) {
    return request({
      url: url.errorInfoDetail,
      method: 'post',
      data
    });
  }
};

export default serveApi;
// export function serviceInvokeMonitor(data) {
//   return request({
//     url: 'service_invoke_monitor.tml',
//     method: 'post',
//     data: Object.assign({ router: 'date' }, data)
//   });
// }

// export function taskException(data) {
//   return request({
//     url: 'task_exception.tml',
//     method: 'post',
//     data: Object.assign({ router: 'date' }, data)
//   });
// }

// export function serviceErrorInfo(data) {
//   return request({
//     url: 'service_error_info.tml',
//     method: 'post',
//     data: Object.assign({ router: 'date' }, data)
//   });
// }
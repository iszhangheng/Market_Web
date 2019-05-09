import request from '@/utils/request';

const baseUrl = '/person_details';

const url = {
  myFlowLog: baseUrl + '/my_flow_detail.tml', // 流程记录
  myCheck: baseUrl + '/my_check.tml', // 我的考勤
  myFlow: baseUrl + '/my_flow.tml', // 我的流程
  myHoliday: baseUrl + '/my_holiday.tml', // 我的假期
  myInfo: baseUrl + '/my_info.tml' // 我的信息
};

const personDetailsApi = {
  myFlow(data) {
    return request({
      url: url.myFlow,
      method: 'post',
      data
    });
  },
  myFlowLog(data) {
    return request({
      url: url.myFlowLog,
      method: 'post',
      data
    });
  },
  myHoliday(data) {
    return request({
      url: url.myHoliday,
      method: 'post',
      data
    });
  },
  myCheck(data) {
    return request({
      url: url.myCheck,
      method: 'post',
      data
    });
  },
  myInfo() {
    return request({
      url: url.myInfo,
      method: 'post'
    });
  }
};

export default personDetailsApi;

import request from '@/utils/request';

const baseUrl = '/person_details';

const url = {
  myCheck: baseUrl + '/my_check.tml', // 我的考勤
  myFlow: baseUrl + '/my_flow.tml', // 我的流程
  myHoliday: baseUrl + '/my_holiday.tml' // 我的假期
};

const personDetailsApi = {
  myFlow(data) {
    return request({
      url: url.myFlow,
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
  }
};

export default personDetailsApi;

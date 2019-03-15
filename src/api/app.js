import request from '@/utils/request';

const url = {
  appControl: 'app_control_count.tml?flow=list', // 事件列表
  appControlDetail: 'app_control_count.tml?flow=getControlDetail', // 事件详情
  appCrash: 'app_crash.tml?flow=list', // 奔溃日志
  appPage: 'app_page.tml?flow=list', // 页面列表
  appPageWeb: 'app_page.tml?flow=webThermalAnalysis', // 热力分析
  appPageDAE: 'app_page.tml?flow=dailyActiveEquipment', // 日活跃度
  appUrlSumTime: 'app_url_sum_time.tml?flow=list', // 页面列表(改)
  appUrlRel: 'app_url_users_count.tml?flow=list', // 链路统计(app)
  appUrlRelTemplateInfo: 'path_template_info.tml?flow=getLinks', // 模板展示
  appLineChart: 'app_url_sum_time.tml?flow=getLinks', // --趋势图
  appTowards: 'app_url_users_count.tml?flow=getPagePath', // --走向
  appTemplateInfo: 'path_template_info.tml?flow=list', // 模板查询
  appTemplateInfoAdd: 'path_template_info.tml?flow=addInfo', // 模板新增
  appTemplateInfoUpdate: 'path_template_info.tml?flow=updateInfo', // 模板修改
  appTemplateInfoDelete: 'path_template_info.tml?flow=deleteInfo' // 模板删除
};

const appApi = {
  appControl(data) {
    return request({
      url: url.appControl,
      method: 'post',
      data
    });
  },
  appControlDetail(data) {
    return request({
      url: url.appControlDetail,
      method: 'post',
      data
    });
  },
  appCrash(data) {
    return request({
      url: url.appCrash,
      method: 'post',
      data
    });
  },
  appPage(data) {
    return request({
      url: url.appPage,
      method: 'post',
      data
    });
  },
  appPageWeb(data) {
    return request({
      url: url.appPageWeb,
      method: 'post',
      data
    });
  },
  appPageDAE(data) {
    return request({
      url: url.appPageDAE,
      method: 'post',
      data
    });
  },
  appUrlSumTime(data) {
    return request({
      url: url.appUrlSumTime,
      method: 'post',
      data
    });
  },
  appUrlRel(data) {
    return request({
      url: url.appUrlRel,
      method: 'post',
      data
    });
  },
  appUrlRelTemplateInfo(data) {
    return request({
      url: url.appUrlRelTemplateInfo,
      method: 'post',
      data
    });
  },
  appLineChart(data) {
    return request({
      url: url.appLineChart,
      method: 'post',
      data
    });
  },
  appTowards(data) {
    return request({
      url: url.appTowards,
      method: 'post',
      data
    });
  },
  appTemplateInfo(data) {
    return request({
      url: url.appTemplateInfo,
      method: 'post',
      data
    });
  },
  appTemplateInfoAdd(data) {
    return request({
      url: url.appTemplateInfoAdd,
      method: 'post',
      data
    });
  },
  appTemplateInfoUpdate(data) {
    return request({
      url: url.appTemplateInfoUpdate,
      method: 'post',
      data
    });
  },
  appTemplateInfoDelete(data) {
    return request({
      url: url.appTemplateInfoDelete,
      method: 'post',
      data
    });
  }
};

export default appApi;

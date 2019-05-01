import request from '@/utils/request';
// 通过 post请求时，参数选择 data
// 通过 get请求时，参数选择 params
const isDev = process.env.NODE_ENV === 'development';
const url = {
  pageTable: isDev ? '/page/list' : '/page_analyze/get_table.tml', // 页面表格数据
  pageTowards: isDev ? '/page/towards' : '/page_analyze/get_tendency.tml', // 页面走向详情
  pageTendency: isDev ? '/page/trend' : '/page_analyze/get_tendency_chart.tml', // 页面趋势图
  linkTable: isDev ? '/link/list' : '/path_analyze/get_table.tml', // 链路表格数据
  linkTemplate: isDev ? '/link/template' : '/path_analyze/get_template_path.tml', // 模板路径查询
  eventTable: isDev ? '/event/list' : '/event_analyze/get_table.tml', // 事件表格数据
  eventDetail: isDev ? '/event/detail' : '/event_analyze/get_click_detail.tml', // 事件详情
  retained: isDev ? '/retained/list' : '/keep_analyze/get_table.tml', // 留存
  hotspotTable: isDev ? '/hotspot/list' : '/hotspot_analyze/get_table.tml', // 热点表格数据
  hotspotHeatMap: '/hotspot_analyze/get_heat_map.tml', // 热点图
  deviceTable: isDev ? '/device/list' : '/device_analyze/get_table.tml', // 设备表格数据
  deviceModel: isDev ? '/device/model' : '/device_analyze/get_mobile_list.tml', // 设备型号饼图
  deviceVersion: isDev ? '/device/version' : '/device_analyze/get_mobile_version_list.tml', // 设备版本饼图
  operatingSystem: isDev ? '/device/os' : '/device_analyze/get_system_list.tml', // 操作系统饼图
  templateManage: isDev ? '/template/list' : '/template_manage/get_template_search.tml', // 模板查询(全查/ID查)
  templateAddInfo: isDev ? '/template/add' : '/template_manage/add_template.tml', // 模板新增
  templateDeleteInfo: isDev ? '/template/delete' : '/template_manage/delete_template.tml', // 模板删除
  templateUpdateInfo: isDev ? '/template/update' : '/template_manage/update_template.tml', // 模板修改
  paramList: isDev ? '/param/list' : '/param_list.tml' // 根据传入的参数值返回对应的数据列表
};

const behaviorApi = {
  pageTable(data) {
    return request({
      url: url.pageTable,
      method: 'post',
      data
    });
  },
  pageTowards(data) {
    return request({
      url: url.pageTowards,
      method: 'post',
      data
    });
  },
  pageTendency(data) {
    return request({
      url: url.pageTendency,
      method: 'post',
      data
    });
  },
  linkTable(data) {
    return request({
      url: url.linkTable,
      method: 'post',
      data
    });
  },
  linkTemplate(data) {
    return request({
      url: url.linkTemplate,
      method: 'post',
      data
    });
  },
  eventTable(data) {
    return request({
      url: url.eventTable,
      method: 'post',
      data
    });
  },
  eventDetail(data) {
    return request({
      url: url.eventDetail,
      method: 'post',
      data
    });
  },
  retained(data) {
    return request({
      url: url.retained,
      method: 'post',
      data
    });
  },
  hotspotTable(data) {
    return request({
      url: url.hotspotTable,
      method: 'post',
      data
    });
  },
  hotspotHeatMap(data) {
    return request({
      url: url.hotspotHeatMap,
      method: 'post',
      data
    });
  },
  deviceTable(data) {
    return request({
      url: url.deviceTable,
      method: 'post',
      data
    });
  },
  deviceModel(data) {
    return request({
      url: url.deviceModel,
      method: 'post',
      data
    });
  },
  deviceVersion(data) {
    return request({
      url: url.deviceVersion,
      method: 'post',
      data
    });
  },
  operatingSystem(data) {
    return request({
      url: url.operatingSystem,
      method: 'post',
      data
    });
  },
  templateManage(data) {
    return request({
      url: url.templateManage,
      method: 'post',
      data
    });
  },
  templateAddInfo(data) {
    return request({
      url: url.templateAddInfo,
      method: 'post',
      data
    });
  },
  templateDeleteInfo(data) {
    return request({
      url: url.templateDeleteInfo,
      method: 'post',
      data
    });
  },
  templateUpdateInfo(data) {
    return request({
      url: url.templateUpdateInfo,
      method: 'post',
      data
    });
  },
  paramList(data) {
    return request({
      url: url.paramList,
      method: 'post',
      data
    });
  }
};

export default behaviorApi;
// export function urlSumTime(data) {
//   return request({
//     url: 'h5_url_sum_time.tml',
//     method: 'post',
//     data: Object.assign({
//       router: 'date'
//     }, data)
//   });
// }

// export function urlUsersCount(data) {
//   return request({
//     url: 'h5_url_users_count.tml',
//     method: 'post',
//     data: Object.assign({
//       router: 'date'
//     }, data)
//   });
// }

// export function urlRel(data) {
//   return request({
//     url: 'h5_url_rel.tml',
//     method: 'post',
//     data: Object.assign({
//       router: 'date'
//     }, data)
//   });
// }

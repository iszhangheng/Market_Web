import request from '@/utils/request';
// 通过 post请求时，参数选择 data
// 通过 get请求时，参数选择 params

const url = {
  urlRel: 'h5_url_rel.tml?flow=list', // 页面关联表
  urlSumTime: 'h5_url_sum_time.tml?flow=list', // 页面统计
  urlUsersCount: 'h5_url_users_count.tml?flow=pageDirectionDetails', // 用户数量统计
  // urlUsersCountSum: 'h5_url_users_count.tml?flow=linkStatisticsList', // 链路统计表
  urlUsersCountSum: 'link_template_info.tml?flow=getLinks', // 链路统计表
  urlUsersTendency: 'h5_url_sum_time.tml?flow=tendency', // 趋势图
  templateManage: 'link_template_info.tml?flow=list', // 模块查询(全查/ID查)
  templateAddInfo: 'link_template_info.tml?flow=addInfo', // 模块新增
  templateDeleteInfo: 'link_template_info.tml?flow=deleteInfo', // 模块删除
  templateUpdateInfo: 'link_template_info.tml?flow=updateInfo' // 模块修改
};

const operationApi = {
  urlRel(data) {
    return request({
      url: url.urlRel,
      method: 'post',
      data
    });
  },
  urlSumTime(data) {
    return request({
      url: url.urlSumTime,
      method: 'post',
      data
    });
  },
  urlUsersCount(data) {
    return request({
      url: url.urlUsersCount,
      method: 'post',
      data
    });
  },
  urlUsersCountSum(data) {
    return request({
      url: url.urlUsersCountSum,
      method: 'post',
      data
    });
  },
  urlUsersTendency(data) {
    return request({
      url: url.urlUsersTendency,
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
  }
};

export default operationApi;
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

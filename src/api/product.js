import request from '@/utils/request';

const url = {
  psAdressCount: 'ps_adress_count.tml?flow=list', // 地址
  psBkcodeCount: 'ps_bkcode_count.tml?flow=list', // 银行编码
  psChannelCount: 'ps_channel_count.tml?flow=list', // 渠道
  psIdtfnoCount: 'ps_idtfno_count.tml?flow=list', // 身份编码
  dataSummary: 'product_detail_count.tml?flow=list', // 交易统计
  dataSummarySum: 'product_detail_count.tml?flow=sumList', // 交易统计饼图
  depositsBuy: 'product_detail_count.tml?flow=productDetail', // 存款购买
  channelChange: 'tb_sys_code.tml?flow=list' // 渠道选择
};

const productApi = {
  psAdressCount(data) {
    return request({
      url: url.psAdressCount,
      method: 'post',
      data
    });
  },
  psBkcodeCount(data) {
    return request({
      url: url.psBkcodeCount,
      method: 'post',
      data
    });
  },
  psChannelCount(data) {
    return request({
      url: url.psChannelCount,
      method: 'post',
      data
    });
  },
  psIdtfnoCount(data) {
    return request({
      url: url.psIdtfnoCount,
      method: 'post',
      data
    });
  },
  dataSummary(data) {
    return request({
      url: url.dataSummary,
      method: 'post',
      data
    });
  },
  dataSummarySum(data) {
    return request({
      url: url.dataSummarySum,
      method: 'post',
      data
    });
  },
  depositsBuy(data) {
    return request({
      url: url.depositsBuy,
      method: 'post',
      data
    });
  },
  channelChange(data) {
    return request({
      url: url.channelChange,
      method: 'post',
      data
    });
  }
};

export default productApi;

// export function psChannelCount(data) {
//   return request({
//     url: 'ps_channel_count.tml',
//     method: 'post',
//     data: Object.assign({ router: 'date' }, data)
//   });
// }

// export function psAdressCount(data) {
//   return request({
//     url: 'ps_adress_count.tml',
//     method: 'post',
//     data: Object.assign({ router: 'date' }, data)
//   });
// }

// export function psBkcodeCount(data) {
//   return request({
//     url: 'ps_bkcode_count.tml',
//     method: 'post',
//     data: Object.assign({ router: 'date' }, data)
//   });
// }

// export function psIdtfnoCount(data) {
//   return request({
//     url: 'ps_idtfno_count.tml',
//     method: 'post',
//     data: Object.assign({ router: 'date' }, data)
//   });
// }

import request from '@/utils/request';
// 通过 post请求时，参数选择 data
// 通过 get请求时，参数选择 params
// export function getInfo(data) {
//   return request({
//     url: 'test_query.tml',
//     method: 'post',
//     data
//   });
// }
// 表格
const tableUrl = {
  registerSex: 'register_sex.tml?flow=list', // 用户性别
  userLogin: 'user_login.tml?flow=list', // 用户登录时间
  bankUserInfo: 'bank_user_info.tml?flow=list', // 绑卡银行分布
  cardnumUser: 'cardnum_user.tml?flow=list', // 用户绑卡数量
  cycleDevChange: 'cycle_dev_change.tml?flow=list', // 设备更换周期
  numDevChange: 'num_dev_change.tml?flow=list', // 用户的设备更换次数
  devModel: 'dev_model.tml?flow=list', // 用户设备型号的分布
  userNotinBank: 'user_notin_bank.tml?flow=list', // 未入租银行分布
  osUserNum: 'os_usernum.tml?flow=list', // 操作系统分布
  devVersion: 'dev_version.tml?flow=list', // 手机版本分布
  userRegistTime: 'user_regist_time.tml?flow=list', // 首次注册日
  registAreaUser: 'regist_area_user.tml?flow=list', // 用户注册地区
  registerAge: 'register_age.tml?flow=list', // 用户年龄
  userChannel: 'user_channel.tml?flow=list', // 用户渠道
  lastUserLogin: 'last_user_login.tml?flow=list', // 最后登入时间
  registerAvgTime: 'register_avg_time.tml?flow=list', // 平均在线时长
  // userMobileArea: 'user_mobile_area?flow=list', // 用户手机号归属地
  userInfo: 'user_info.tml?flow=getUserInfo', // 用户总体业务信息统计
  userInfoDev: 'user_info.tml?flow=getUserDevInfo' // 设备更换信息统计
};
// 图形
const chartUrl = {
  registerSex: 'register_sex.tml?flow=sumList', // 用户性别
  userLogin: 'user_login.tml?flow=sumList', // 用户登录时间
  cardnumUser: 'cardnum_user.tml?flow=sumList', // 用户绑卡数量
  cycleDevChange: 'cycle_dev_change.tml?flow=sumList', // 设备更换周期
  numDevChange: 'num_dev_change.tml?flow=sumList', // 用户的设备更换次数
  devModel: 'dev_model.tml?flow=sumList', // 用户设备型号的分布
  userNotinBank: 'user_notin_bank.tml?flow=sumList', // 未入租银行分布
  osUserNum: 'os_usernum.tml?flow=sumList', // 操作系统分布
  devVersion: 'dev_version.tml?flow=sumList', // 手机版本分布
  userRegistTime: 'user_regist_time.tml?flow=sumList', // 首次注册日
  registAreaUser: 'regist_area_user.tml?flow=sumList', // 用户注册地区
  registerAge: 'register_age.tml?flow=sumList', // 用户年龄
  userChannel: 'user_channel.tml?flow=sumList', // 用户注册渠道
  lastUserLogin: 'last_user_login.tml?flow=sumList' // 最后登入时间
  // userMobileArea: 'user_mobile_area?flow=sumList' // 用户手机号归属地
};
const userApi = {
  registerSex(data) {
    return request({
      url: tableUrl.registerSex,
      method: 'post',
      data
    });
  },
  userLogin(data) {
    return request({
      url: tableUrl.userLogin,
      method: 'post',
      data
    });
  },
  bankUserInfo(data) {
    return request({
      url: tableUrl.bankUserInfo,
      method: 'post',
      data
    });
  },
  cardnumUser(data) {
    return request({
      url: tableUrl.cardnumUser,
      method: 'post',
      data
    });
  },
  cycleDevChange(data) {
    return request({
      url: tableUrl.cycleDevChange,
      method: 'post',
      data
    });
  },
  numDevChange(data) {
    return request({
      url: tableUrl.numDevChange,
      method: 'post',
      data
    });
  },
  devModel(data) {
    return request({
      url: tableUrl.devModel,
      method: 'post',
      data
    });
  },
  devVersion(data) {
    return request({
      url: tableUrl.devVersion,
      method: 'post',
      data
    });
  },
  osUserNum(data) {
    return request({
      url: tableUrl.osUserNum,
      method: 'post',
      data
    });
  },
  userNotinBank(data) {
    return request({
      url: tableUrl.userNotinBank,
      method: 'post',
      data
    });
  },
  userRegistTime(data) {
    return request({
      url: tableUrl.userRegistTime,
      method: 'post',
      data
    });
  },
  lastUserLogin(data) {
    return request({
      url: tableUrl.lastUserLogin,
      method: 'post',
      data
    });
  },
  registAreaUser(data) {
    return request({
      url: tableUrl.registAreaUser,
      method: 'post',
      data
    });
  },
  registerAge(data) {
    return request({
      url: tableUrl.registerAge,
      method: 'post',
      data
    });
  },
  userChannel(data) {
    return request({
      url: tableUrl.userChannel,
      method: 'post',
      data
    });
  },
  userInfo(data) {
    return request({
      url: tableUrl.userInfo,
      method: 'post',
      data
    });
  },
  userInfoDev(data) {
    return request({
      url: tableUrl.userInfoDev,
      method: 'post',
      data
    });
  },
  registerAvgTime(data) {
    return request({
      url: tableUrl.registerAvgTime,
      method: 'post',
      data
    });
  },
  // userMobileArea(data) {
  //   return requset({
  //     url: tableUrl.userMobileArea,
  //     method: 'post',
  //     data
  //   });
  // },
  registerSexSum(data) {
    return request({
      url: chartUrl.registerSex,
      method: 'post',
      data
    });
  },
  userLoginSum(data) {
    return request({
      url: chartUrl.userLogin,
      method: 'post',
      data
    });
  },
  cardnumUserSum(data) {
    return request({
      url: chartUrl.cardnumUser,
      method: 'post',
      data
    });
  },
  cycleDevChangeSum(data) {
    return request({
      url: chartUrl.cycleDevChange,
      method: 'post',
      data
    });
  },
  numDevChangeSum(data) {
    return request({
      url: chartUrl.numDevChange,
      method: 'post',
      data
    });
  },
  devModelSum(data) {
    return request({
      url: chartUrl.devModel,
      method: 'post',
      data
    });
  },
  devVersionSum(data) {
    return request({
      url: chartUrl.devVersion,
      method: 'post',
      data
    });
  },
  osUserNumSum(data) {
    return request({
      url: chartUrl.osUserNum,
      method: 'post',
      data
    });
  },
  userNotinBankSum(data) {
    return request({
      url: chartUrl.userNotinBank,
      method: 'post',
      data
    });
  },
  userRegistTimeSum(data) {
    return request({
      url: chartUrl.userRegistTime,
      method: 'post',
      data
    });
  },
  lastUserLoginSum(data) {
    return request({
      url: chartUrl.lastUserLogin,
      method: 'post',
      data
    });
  },
  registAreaUserSum(data) {
    return request({
      url: chartUrl.registAreaUser,
      method: 'post',
      data
    });
  },
  registerAgeSum(data) {
    return request({
      url: chartUrl.registerAge,
      method: 'post',
      data
    });
  },
  userChannelSum(data) {
    return request({
      url: chartUrl.userChannel,
      method: 'post',
      data
    });
  }
  //   userMobileAreaSum(data) {
  //     return requset({
  //       url: chartUrl.userMobileArea,
  //       method: 'post',
  //       data
  //     });
  //   }
};
export default userApi;
// export function registerSex(data) {
//   return request({
//     url: 'register_sex.tml',
//     method: 'post',
//     data: Object.assign({
//       router: 'date'
//     }, data)
//   });
// }

// export function userLogin(data) {
//   return request({
//     url: 'user_login.tml',
//     method: 'post',
//     data: Object.assign({
//       router: 'date'
//     }, data)
//   });
// }

// export function banknumUser(data) {
//   return request({
//     url: 'banknum_user.tml',
//     method: 'post',
//     data: Object.assign({
//       router: 'date'
//     }, data)
//   });
// }

// export function cardnumUser(data) {
//   return request({
//     url: 'cardnum_user.tml',
//     method: 'post',
//     data: Object.assign({
//       router: 'date'
//     }, data)
//   });
// }

// export function cycleDevChange(data) {
//   return request({
//     url: 'cycle_dev_change.tml',
//     method: 'post',
//     data: Object.assign({
//       router: 'date'
//     }, data)
//   });
// }

// export function numDevChange(data) {
//   return request({
//     url: 'num_dev_change.tml',
//     method: 'post',
//     data: Object.assign({
//       router: 'date'
//     }, data)
//   });
// }

// export function devModel(data) {
//   return request({
//     url: 'dev_model.tml',
//     method: 'post',
//     data: Object.assign({
//       router: 'date'
//     }, data)
//   });
// }

// /**
//  * 用户手机号归属地
//  */
// // export function userMobileArea(data) {
// //   return request({
// //     url: 'user_mobile_area.tml?flow=queryAll',
// //     method: 'post',
// //     data
// //   });
// // }
// // export function userMobileAreaByDateType(data) {
// //   return request({
// //     url: 'user_mobile_area.tml?flow=selectInfoByDateType',
// //     method: 'post',
// //     data
// //   });
// // }

// export function userNotinBank(data) {
//   return request({
//     url: 'user_notin_bank.tml',
//     method: 'post',
//     data: Object.assign({
//       router: 'date'
//     }, data)
//   });
// }

// export function osUsernum(data) {
//   return request({
//     url: 'os_usernum.tml',
//     method: 'post',
//     data: Object.assign({
//       router: 'date'
//     }, data)
//   });
// }

// export function devVersion(data) {
//   return request({
//     url: 'dev_version.tml',
//     method: 'post',
//     data: Object.assign({
//       router: 'date'
//     }, data)
//   });
// }

// export function userRegistTime(data) {
//   return request({
//     url: 'user_regist_time.tml',
//     method: 'post',
//     // data: Object.assign({ router: 'date' }, data)
//     data: data
//   });
// }

// export function registAreaUser(data) {
//   return request({
//     url: 'regist_area_user.tml',
//     method: 'post',
//     data: Object.assign({
//       router: 'date'
//     }, data)
//   });
// }

// export function registerAge(data) {
//   return request({
//     url: 'register_age.tml',
//     method: 'post',
//     data: Object.assign({
//       router: 'date'
//     }, data)
//   });
// }

// export function userChannel(data) {
//   return request({
//     url: 'user_channel.tml',
//     method: 'post',
//     data: Object.assign({
//       router: 'date'
//     }, data)
//   });
// }

/**
 * 注册用户平均在线时长
 */
// export function avgTimeLogin(data) {
//   return request({
//     url: 'avg_time_login.tml?flow=queryAll',
//     method: 'post',
//     data
//   });
// }
// export function avgTimeLoginByDateType(data) {
//   return request({
//     url: 'avg_time_login.tml?flow=selectInfoByDateType',
//     method: 'post',
//     data
//   });
// }
// export function areaLostUser(data) {
//   return request({
//     url: 'area_lost_user.tml',
//     method: 'post',
//     data
//   });
// }
// export function areaRemainUser(data) {
//   return request({
//     url: 'area_remain_user.tml',
//     method: 'post',
//     data
//   });
// }
// export function lastUserLogin(data) {
//   return request({
//     url: 'last_user_login.tml',
//     method: 'post',
//     data: Object.assign({
//       router: 'date'
//     }, data)
//   });
// }
// export function registerAvgTime(data) {
//   return request({
//     url: 'register_avg_time.tml',
//     method: 'post',
//     data
//   });
// }

// export function simple(data) {
//   return request({
//     url: 'simple.tml',
//     method: 'post',
//     data
//   });
// }
// export function tpSysCode(data) {
//   return request({
//     url: 'tp_sys_code.tml',
//     method: 'post',
//     data
//   });
// }
// export function todayCompute(data) {
//   return request({
//     url: 'today_compute.tml',
//     method: 'post',
//     data
//   });
// }
// export function totalCompute(data) {
//   return request({
//     url: 'total_compute.tml',
//     method: 'post',
//     data
//   });
// }

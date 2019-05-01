import request from '@/utils/request';

// 通过 post请求时，参数选择 data
// 通过 get请求时，参数选择 params
const isDev = process.env.NODE_ENV === 'development';
const url = {
  bankList: 'tb_bank_code.tml?flow=list', // 银行字典
  bankAdd: 'tb_bank_code.tml?flow=replaceInfo',
  bankUpdate: 'tb_bank_code.tml?flow=updateByTrcorp',
  bankRemove: 'tb_bank_code.tml?flow=removeByTrcorp',
  sysList: 'tb_sys_code.tml?flow=list', // 系统字典
  sysAddInfo: 'tb_sys_code.tml?flow=addInfo',
  sysUpdate: 'tb_sys_code.tml?flow=updateById',
  sysRemove: 'tb_sys_code.tml?flow=removeById',
  sysCodeTypeList: 'tb_sys_code.tml?flow=codeTypeList',

  pageList: isDev ? '/pageDictionary/list' : '/page_dictionary/get_table.tml', // 页面字典
  pageAdd: '/page_dictionary/add_page.tml', // 增
  pageUpdate: '/page_dictionary/update_page.tml', // 改
  pageRemove: '/page_dictionary/delete_page.tml' // 删
};
const dictionaryApi = {
  bankList(data) {
    return request({
      url: url.bankList,
      method: 'post',
      data
    });
  },
  bankAdd(data) {
    return request({
      url: url.bankAdd,
      method: 'post',
      data
    });
  },
  bankUpdate(data) {
    return request({
      url: url.bankUpdate,
      method: 'post',
      data
    });
  },
  bankRemove(data) {
    return request({
      url: url.bankRemove,
      method: 'post',
      data
    });
  },
  sysList(data) {
    return request({
      url: url.sysList,
      method: 'post',
      data
    });
  },
  sysCodeTypeList(data) {
    return request({
      url: url.sysCodeTypeList,
      method: 'post',
      data
    });
  },
  sysAddInfo(data) {
    return request({
      url: url.sysAddInfo,
      method: 'post',
      data
    });
  },
  sysUpdate(data) {
    return request({
      url: url.sysUpdate,
      method: 'post',
      data
    });
  },
  sysRemove(data) {
    return request({
      url: url.sysRemove,
      method: 'post',
      data
    });
  },
  pageList(data) {
    return request({
      url: url.pageList,
      method: 'post',
      data
    });
  },
  pageAddInfo(data) {
    return request({
      url: url.pageAdd,
      method: 'post',
      data
    });
  },
  pageUpdate(data) {
    return request({
      url: url.pageUpdate,
      method: 'post',
      data
    });
  },
  pageRemove(data) {
    return request({
      url: url.pageRemove,
      method: 'post',
      data
    });
  }
};
export default dictionaryApi;

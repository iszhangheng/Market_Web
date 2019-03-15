import request from '@/utils/request';

// 通过 post请求时，参数选择 data
// 通过 get请求时，参数选择 params
export function getList(data) {
  return request({
    url: '/table/list',
    method: 'post',
    data
  });
}

export function getInfo(data) {
  return request({
    url: '/table/info',
    method: 'post',
    data
  });
}

export function saveInfo(data) {
  return request({
    url: '/table/save',
    method: 'post',
    data
  });
}

export function updateInfo(data) {
  return request({
    url: '/table/update',
    method: 'post',
    data
  });
}

export function removeInfo(data) {
  return request({
    url: '/table/delete',
    method: 'post',
    data
  });
}

export function removeManyInfo(data) {
  return request({
    url: '/table/deleteMany',
    method: 'post',
    data
  });
}

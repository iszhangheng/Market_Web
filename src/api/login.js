import request from '@/utils/request';

// 通过 post请求时，参数选择 data
// 通过 get请求时，参数选择 params

export function login(userName, userPassword) {
  return request({
    url: 'user_info.tml?flow=login',
    method: 'post',
    data: {
      userName,
      userPassword
    }
  });
}

export function getInfo() {
  return request({
    url: 'user_info.tml?flow=getUser',
    method: 'post'
  });
}

export function logout() {
  return request({
    url: 'user_info.tml?flow=logOut',
    method: 'post'
  });
}

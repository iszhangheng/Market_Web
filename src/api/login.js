import request from '@/utils/request';

// 通过 post请求时，参数选择 data
// 通过 get请求时，参数选择 params

export function login(userName, password) {
  return request({
    url: 'login.tml',
    method: 'post',
    data: {
      userName,
      password
    }
  });
}

export function updatePwd(data) {
  return request({
    url: 'update_password.tml',
    method: 'post',
    data: data
  });
}

export function getInfo() {
  return request({
    url: 'employee_info/get_name_roles.tml',
    method: 'post'
  });
}

export function logout() {
  return request({
    url: 'employee_info/get_name_roles.tml',
    method: 'post'
  });
}

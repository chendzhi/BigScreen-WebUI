import request from '@/utils/request'
// 登录
export function login(data) {
  return request({
    url: '/screen/user/login',
    method: 'post',
    data: {
      username: data.organCode,
      productNo: data.productCode
    }
  })
}
// 获取登录用户信息
export function getUser(data) {
  return request({
    url: '/screen/user/info',
    method: 'get',
    headers: {'Authorization': data.token},
    params: {
      token: data.token
    }
  })
}

export default {
  login,
  getUser
}

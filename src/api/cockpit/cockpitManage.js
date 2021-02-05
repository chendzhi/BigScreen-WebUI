import request from '@/utils/request'

export function getMenus(params) {
  return request({
    url: 'api/cockpitManage',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/cockpitManage',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/cockpitManage',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/cockpitManage',
    method: 'put',
    data
  })
}

export default { add, edit, del, getMenus }

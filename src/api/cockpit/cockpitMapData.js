import request from '@/utils/request'


export function getMenus(params) {
  return request({
    url: 'api/cockpitMapData',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/cockpitMapData',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/cockpitMapData',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/cockpitMapData',
    method: 'put',
    data
  })
}
export function getCitys(params) {
  return request({
    url: 'api/cockpitData/getDictConstants',
    method: 'get',
    params
  })
}
export default { add, edit, del, getMenus, getCitys}

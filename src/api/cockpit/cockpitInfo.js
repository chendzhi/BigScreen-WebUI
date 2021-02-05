import request from '@/utils/request'

export function getMenus(params) {
  return request({
    url: 'api/cockpitInfo',
    method: 'get',
    params
  })
}
/* 归属 */
export function getQueryDictConstant() {
  return request({
    url: 'api/cockpitData/queryDictConstant',
    method: 'get',
  })
}
/* 编号 */
export function getQueryTree() {
  return request({
    url: 'api/cockpitManage/queryTree',
    method: 'get',
  })
}
/* 模块编码 */
export function getQueryModule(num) {
  return request({
    url: `api/cockpitManage/queryModuleList?dataType=${num}`,
    method: 'get',
  })
}

export function getQuerySubLabel(params) {
  return request({
    url: 'api/cockpitManage/querySubLabelList',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/cockpitInfo',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/cockpitInfo',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/cockpitInfo',
    method: 'put',
    data
  })
}

export default { add, edit, del, getQueryTree, getQueryDictConstant,getQueryModule, getQuerySubLabel,getMenus }

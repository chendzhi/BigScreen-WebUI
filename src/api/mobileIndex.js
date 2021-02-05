import request from '@/utils/request'

export function mapInfo(data) {
  return request({
    url: '/scssspt/api/screen/screen/queryData',
    method: 'GET',
    params: {...data}
  })
}

export function Years(data) {
  return request({
    url: '/scssspt/api/screen/screen/queryYears',
    method: 'GET',
    params: {...data}
  })
}

export default {
  mapInfo
}
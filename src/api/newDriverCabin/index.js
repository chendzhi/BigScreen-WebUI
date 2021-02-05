import Vue from 'vue'
import request from '@/utils/request'
import { getUser } from '@/utils/auth'

/* 查询部、省成员列表 */
export function queryLeaderList(params) {
  const user = getUser()
  const paramsDefault = {
    organCode: user.organCode, // 组织机构编码
  }
  return request({
    url: '/screen/screen/queryLeaderList',
    method: 'get',
    params: Object.assign({}, paramsDefault, params)
  }).then(res => {
    if (!res.code && (typeof res !== 'string')) {
      return res;
    }
    return [];
  }, (err) => {
    return [];
  })
}


/* 查询同一接口: 获取数据 */
export function queryData(params) {
  const productNo = window.Vues.$route.params.productNo;
  const user = getUser()
  const paramsDefault = {
    ds: '2',
    tn: '',
    functionName: '',
    queryParam: '',
    orderParam: '',
    attribute: user.organCode, // 组织机构编码
  }
  return request({
    url: '/screen/screen/queryData',
    method: 'get',
    params: Object.assign({}, paramsDefault, params)
  }).then(res => {
    if (!res.code && (typeof res !== 'string')) {
      return res;
    }
    return [];
  }, (err) => {
    return [];
  })
}

/* 查询部委列表、省列表 */
export function queryOrganList(params) {
  return request({
    url: '/screen/screen/queryOrganList',
    method: 'get',
    params
  }).then(res => {
    if (!res.code && (typeof res !== 'string')) {
      return res;
    }
    return [];
  }, (err) => {
    return [];
  })
}

/* 查询同级城市、下级区县 */
export function querySubOrganByType(params) {
  const user = getUser()
  const paramsDefault = {
    code: user.organCode, // 组织机构编码
  }
  return request({
    url: '/screen/screen/querySubOrganByType',
    method: 'get',
    params: Object.assign({}, paramsDefault, params)
  }).then(res => {
    if (!res.code && (typeof res !== 'string')) {
      return res;
    }
    return [];
  }, (err) => {
    return [];
  })
}

/* 查询拥有数据的年份 */
export function queryYears(params) {
  const user = getUser()
  const paramsDefault = {
    ds: '2',
    tn: '',
    functionName: '',
    queryParam: '',
    orderParam: '',
    attribute: user.organCode, // 组织机构编码
  }
  return request({
    url: '/screen/screen/queryYears',
    method: 'get',
    params: Object.assign({}, paramsDefault, params)
  }).then(res => {
    if (!res.code && (typeof res !== 'string')) {
      return res;
    }
    return [];
  }, (err) => {
    return [];
  })
}

/* 设置 - 名称 */
export function updateTitle(params) {
  const user = getUser()
  const paramsDefault = {
    ds: '2',
    tn: '',
    functionName: '',
    queryParam: '',
    orderParam: '',
    attribute: user.organCode, // 组织机构编码
  }
  return request({
    url: '/screen/screen/system/updateTitle',
    method: 'post',
    data: Object.assign({}, paramsDefault, params)
  }).then(res => {
    if (!res.code && (typeof res !== 'string')) {
      return res;
    }
    return [];
  }, (err) => {
    return [];
  })
}

/* 留言 */
export function addMessage(params) {
  const user = getUser()
  const paramsDefault = {
    ds: '2',
    tn: '',
    functionName: '',
    queryParam: '',
    orderParam: '',
    attribute: user.organCode, // 组织机构编码
  }
  return request({
    url: '/screen/screen/opinion/add',
    method: 'post',
    data: Object.assign({}, paramsDefault, params)
  }).then(res => {
    if (!res.code && (typeof res !== 'string')) {
      return res;
    }
    return [];
  }, (err) => {
    return [];
  })
}
/* 留言 */
export function queryList(params) {
  const user = getUser()
  const paramsDefault = {
    ds: '2',
    tn: '',
    functionName: '',
    queryParam: '',
    orderParam: '',
    attribute: user.organCode, // 组织机构编码
  }
  return request({
    url: '/screen/screen/opinion/queryList',
    method: 'get',
    params: Object.assign({}, paramsDefault, params)
  }).then(res => {
    if (!res.code && (typeof res !== 'string')) {
      return res;
    }
    return [];
  }, (err) => {
    return [];
  })
}

/* 部委-重点关注标题 */
export function queryProjectSpecialList(params) {
  const user = getUser()
  const paramsDefault = {
    ds: '2',
    organCode: user.organCode, // 组织机构编码
  }
  return request({
    url: '/screen/screen/queryProjectSpecialList',
    method: 'get',
    params: Object.assign({}, paramsDefault, params)
  }).then(res => {
    if (!res.code && (typeof res !== 'string')) {
      return res;
    }
    return [];
  }, (err) => {
    return [];
  })
}

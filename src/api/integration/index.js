import request from '@/utils/request'
import { getUser } from '@/utils/auth'

/**
 * 接口参数说明：
 * ds: '2', // 数据源ID 固定值
 * tn: '', // 数据表ID 模块不同tn不同
 * functionName: '', // 功能文字描述 非必填
 * attribute: '', // 当前登录者组织机构编码
 * queryParam: '', // 查询参数:String eg:queryParam: 'isCurrent=1,type=2'
 * orderParam: '' // 排序参数:String eg:orderParam: 'data_time=desc'
 *
 * tn解释：
 * 基本概况：tn: 1
 * 资源分布：tn: 2
 * 实时问题：tn: 3 （下钻二级页面 tn：45）
 * 政声传递：tn: 4 // 有所调整 单独api getPolicyData
 * 近日更新；tn: 5
 * 日常监测：tn: 6
 * 高频错字：tn: 7 （下钻二级页面 tn：42）
 * 热门文章：tn: 8
 *
 * 其他补充：
 * 高频错字：queryParam: 'type=1' （1网站，2新媒体）
 * 热门文章：queryParam: 'type=1'（1阅读数量、2点赞数量）
 */
const paramsCommon = {
  ds: '2',
  tn: '',
  functionName: '',
  queryParam: '',
  orderParam: '',
  resultsFormat: ''
}

/**
 * 一体化监测各模块数据获取
 * @param {Object} data
 */
export function getData(data) {
  let user = getUser()
  let paramsDefault = {
    ...paramsCommon,
    attribute: user.organCode, // 组织机构编码
  }
  return request({
    url: '/screen/screen/queryData',
    params: Object.assign({}, paramsDefault, data)
  })
}
/**
 * 获取政声传递政策列表数据
 * @param {} data
 */
export function getPolicyData(data) {
  let user = getUser()
  let paramsDefault = {
    ...paramsCommon,
    organCode: user.organCode, // 组织机构编码
  }
  return request({
    url: '/screen/screen/queryYthPolicyList',
    params: Object.assign({}, paramsDefault, data)
  })
}

/**
 * 获取跳转云平台参数
 */
export function getCloudSiteLoginParams(data) {
  let user = getUser()
  let paramsDefault = {
    attribute: user.organCode, // 组织机构编码
  }
  return request({
    url: '/screen/screen/gotoCloud',
    params: Object.assign({}, paramsDefault, data)
  })
}

export default {
  getData,
  getPolicyData,
  getCloudSiteLoginParams
}

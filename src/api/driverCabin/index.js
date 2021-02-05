import request from '@/utils/request'
import qs from 'qs'
/* 协同发生 */
export function getCollaborative(params) {
  return request({
    url: 'api/cockpitData/queryCollaborative',
    method: 'get',
    params
  })
}
/* 百姓关注 */
export function getPeopleAttention(params) {
  return request({
    url: 'api/cockpitData/queryPeopleAttention',
    method: 'get',
    params
  })
}
/* 省长行动首页 */
export function getGovernorAction(params) {
  return request({
    url: 'api/cockpitData/queryGovernorAction',
    method: 'get',
    params
  })
}
/* 省长行动详情 */
export function getGovernorDetail(params) {
  return request({
    url: 'api/cockpitData/queryGovernorDetail',
    method: 'get',
    params
  })
}
/* 百姓来信首页 */
export function getPeopleLetter(params) {
  return request({
    url: 'api/cockpitData/queryPeopleLetter',
    method: 'get',
    params
  })
}
/* 百姓来信详情 */
export function getPeopleLetterDetail(params) {
  return request({
    url: 'api/cockpitData/queryPeopleLetterDetail',
    method: 'get',
    params
  })
}
/* 城市列表 */
export function getDictConstants(params) {
  return request({
    url: 'api/cockpitData/getDictConstants',
    method: 'get',
    params
  })
}
/* 查看城市数据*/
export function getCheckPeopleLetterDetail(params) {
  return request({
    url: 'api/cockpitData/checkPeopleLetterDetail',
    method: 'get',
    params
  })
}
/* 新增领导意见*/
export function addCockpitOpinion(data) {
  return request({
    url: 'api/cockpitOpinion/create',
    method: 'post',
    data
  })
}
/* 查询领导意见*/
export function getCockpitOpinionList(params) {
  return request({
    url: '/api/cockpitOpinion/queryList',
    method: 'get',
    params
  })
}


export function getMapDataHttp(url,params) {
  return request({
    url:url ,
    method: 'get',
    params
  })
}

export function getDomainDataHttp(url,params) {
  return request({
    url:url ,
    method: 'get',
    params
  })
}

export default {  getCollaborative, getPeopleAttention, 
getGovernorDetail, getGovernorAction, getPeopleLetter, getPeopleLetterDetail, getDictConstants, getCheckPeopleLetterDetail, addCockpitOpinion,getCockpitOpinionList}

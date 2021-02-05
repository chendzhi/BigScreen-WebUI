const state = {
  proviceMapData: [],//省内数据
  countryMapData: [],//全国数据
}

const actions = {
}

const mutations = {
  updateProviceMapData: (state, payload) => state.proviceMapData = payload,
  updateCountryMapData: (state, payload) => state.countryMapData = payload,
}

import { Message } from 'element-ui';
export default {
  namespaced: true,
  state,
  actions,
  mutations
}
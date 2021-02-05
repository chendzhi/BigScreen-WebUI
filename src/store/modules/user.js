import { login } from '@/api/login'
import authUtils from '@/utils/auth'

const user = {
  state: {
    token: authUtils.getToken() || '',
    user: authUtils.getUser() || {}
  },

  mutations: {
    tokenSet: (state, token) => {
      state.token = token
    },
    // 用户
    userSet: (state, user) => {
      state.user = user;
      authUtils.setUser(user.productNo, user)
    }
  },

  actions: {
    // 登录
    Login({ commit }, data) {
      return new Promise((resolve, reject) => {
        login({
          organCode: data.organCode,
          productCode: data.productCode
        }).then(res => {
          commit('tokenSet', res.token)
          commit('userSet', res.user)
          authUtils.setToken(data.productCode, res.token)
          authUtils.setUser(data.productCode, res.user)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default user

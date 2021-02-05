import axios from 'axios'
import { Notification } from 'element-ui'
import { getToken } from '@/utils/auth'
import settings from '@/settings'

// 创建axios实例
const service = axios.create({
  //baseURL: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_API : '/', // api 的 base_url
  baseURL: 'http://103.203.219.146' ,
  timeout: settings.timeout // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    if (!config.headers.Authorization) {
      let token = getToken()
      config.headers['Authorization'] = token || ''
    }
    config.headers['Content-Type'] = 'application/json'
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    const code = response.status
    if (code < 200 || code > 300) {
      Notification.error({
        title: response.message
      })
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    let code = 0
    try {
      code = error.response.status
    } catch (e) {
      if (error.toString().indexOf('Error: timeout') !== -1) {
        Notification.error({
          title: '网络请求超时',
          duration: 5000
        })
        return Promise.reject(error)
      }
    }
    if (code) {
      if (code === 401) {
        // 未登录 跳转开普云平台登录页面
        location.href = settings.ucapSiteLoginUrl
      } else if (code === 403) {
        // 登录超时 跳转开普云平台登录页面
        location.href = settings.ucapSiteLoginUrl
      } else {
        const errorMsg = error.response.data.message
        if (errorMsg !== undefined) {
          Notification.error({
            title: errorMsg,
            duration: 5000
          })
        }
      }
    } else {
      Notification.error({
        title: '接口请求失败',
        duration: 5000
      })
    }
    return Promise.reject(error)
  }
)
export default service

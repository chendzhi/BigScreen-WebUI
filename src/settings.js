module.exports = {
  /**
   * @description 请求超时时间，毫秒（默认2分钟）
   */
  timeout: 1200000,
  tokenKey: 'token',
  userKey: 'user',
  // 产品相关配置
  product: {
    // 一体化
    integration: {
      title: '胜览一体化监管',
      code: 'PD1601287033325', // 编码
    },
    // 驾驶舱
    driverCabin: {
      title: '胜策领导驾驶舱',
      code: 'PD1602559101855', // 编码
    }
  },
  ucapSiteLoginUrl: 'https://kaipuyun.cn/' // 云平台登录地址
}

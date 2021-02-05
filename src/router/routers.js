import Vue from 'vue'
import Router from 'vue-router'
import settings from '@/settings'

Vue.use(Router)


export const constantRouterMap = [

  {
    path: '/',
    redirect: '/mobile-index'
  },

  // 手机端首页（数说政通）
  {
    path: '/mobile-index',
    component: (resolve) => require(['@/views/driverCabin/module/mobilePhone/mobile-index'], resolve),
    hidden: true
  },
  // 领导足迹
  {
    path: '/leader-footprint',
    component: (resolve) => require(['@/views/driverCabin/module/mobilePhone/leaderFootprint/leader-footprint'], resolve),
    hidden: true
  },

  //政声传递
  {
    path: '/mobile-politicsSpread',
    component: (resolve) => require(['@/views/driverCabin/module/mobilePhone/mobilePoliticsSpread/mobile-politicsSpread'], resolve),
    hidden: true
  },

   //政声传递详情
   {
    path: '/mobile-spreadDetail',
    component: (resolve) => require(['@/views/driverCabin/module/mobilePhone/mobilePoliticsSpread/mobile-spreadDetail'], resolve),
    hidden: true
  },

  // 政关注
  {
    path: '/politics-follow',
    component: (resolve) => require(['@/views/driverCabin/module/mobilePhone/politicsFollow/politics-follow'], resolve),
    hidden: true
  },

  //常务会
  {
    path: '/mobile-directors',
    component: (resolve) => require(['@/views/driverCabin/module/mobilePhone/mobileDirectors/mobile-directors'], resolve),
    hidden: true
  },
  //成渝双城
  {
    path: '/mobile-doubleCity',
    component: (resolve) => require(['@/views/driverCabin/module/mobilePhone/doubleCity/mobile-doubleCity'], resolve),
    hidden: true
  },
  //数字经济
  {
    path: '/mobile-digitalEco',
    component: (resolve) => require(['@/views/driverCabin/module/mobilePhone/digitalEco/mobile-digitalEco'], resolve),
    hidden: true
  },
 

  // {
  //   path: '/',
  //   redirect: '/authorization'
  // },
  
  // 身份认证
  {
    path: '/authorization',
    component: (resolve) => require(['@/views/authorization'], resolve),
    hidden: true
  },

  {
    path: '/login',
    meta: { title: '登录', noCache: true },
    component: (resolve) => require(['@/views/login'], resolve),
    hidden: true
  },
  { // 图片预览
    path: '/priviewPic',
    component: (resolve) => require(['@/components/PriviewPic'], resolve),
    hidden: true
  },
  { // 驾驶舱-部委
    path: `/product/:productNo(\\${settings.product.driverCabin.code})/department`,
    component: (resolve) => require(['@/views/newDriverCabin/department/index'], resolve),
    hidden: true,
    meta: {
      title: "驾驶舱-部委"
    }
  },
  { // 驾驶舱-省
    path: `/product/:productNo(\\${settings.product.driverCabin.code})/province`,
    component: (resolve) => require(['@/views/newDriverCabin/province/index'], resolve),
    hidden: true,
    meta: {
      title: "驾驶舱-省份"
    }
  },
  { // 驾驶舱-市
    path: `/product/:productNo(\\${settings.product.driverCabin.code})/city`,
    component: (resolve) => require(['@/views/newDriverCabin/city/index'], resolve),
    hidden: true,
    meta: {
      title: "驾驶舱-市区"
    }
  },
  { // 驾驶舱-产品介绍
    path: `/:productNo(\\${settings.product.driverCabin.code})/intro`,
    component: (resolve) => require(['@/views/newDriverCabin/intro'], resolve),
    meta: {
      title: "驾驶舱产品介绍"
    }
  },
  { // 一体化监测
    path: `/product/:productNo(\\${settings.product.integration.code})`,
    component: (resolve) => require(['@/views/integration'], resolve),
    meta: {
      title: "一体化监测"
    }
  },
  { // 一体化监测-产品介绍
    path: `/:productNo(\\${settings.product.integration.code})/intro`,
    component: (resolve) => require(['@/views/integration/intro'], resolve),
    meta: {
      title: "一体化监测产品介绍"
    }
  },
  { // 一体化监测-移动端
    path: `/:productNo(\\${settings.product.integration.code})/mobile`,
    component: (resolve) => require(['@/views/integration/mobile'], resolve),
    redirect: `/:productNo(\\${settings.product.integration.code})/mobile/base`,
    meta: {
      title: "一体化移动端"
    },
    children: [
      {
        path: 'base',
        component: (resolve) => require(['@/views/integration/mobile/child/base'], resolve)
      },
      {
        path: 'transmit',
        component: (resolve) => require(['@/views/integration/mobile/child/transmit'], resolve)
      },
      {
        path: 'question-analysis',
        component: (resolve) => require(['@/views/integration/mobile/child/question-analysis'], resolve)
      },
      {
        path: 'hot-article',
        component: (resolve) => require(['@/views/integration/mobile/child/hot-article'], resolve)
      }
    ]
  },
  { // 示例demo页面 暂时勿删
    path: `/:productNo(\\${settings.product.integration.code})/demo`,
    component: (resolve) => require(['@/views/integration/demo'], resolve),
    meta: {
      title: "一体化监测demo"
    }
  },
  { // 动态产品
    path: '/product/:productNo',
    component: (resolve) => require(['@/views/product'], resolve)
  }
]

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  base: process.env.NODE_ENV === "production" ? "/scssspt" : "/scssspt",
  routes: constantRouterMap
  
})

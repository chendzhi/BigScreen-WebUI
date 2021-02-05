import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css'

import Element from 'element-ui'
import './assets/styles/element-variables.scss'
// global css
import './assets/styles/index.scss'

import App from './App'
import store from './store'
import router from './router/routers'
import '@/filter'

import './assets/icons' // icon
import './router/index' // permission control
import 'echarts-gl'
import VueEchart from 'vue-echarts'
import VueTouch from 'vue-touch'

Vue.use(VueTouch, {name: 'v-touch'})

Vue.use(Element, {
  size: Cookies.get('size') || 'small' // set element-ui default size
})

Vue.component('chart', VueEchart)

Vue.config.productionTip = false

window.Vues = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

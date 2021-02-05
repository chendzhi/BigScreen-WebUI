<template>
  <div class="inte-pg">
    <div class="inte-pg-head">
      <h1 class="inte-pg-title">
        <span class="inte-pg-title_name">{{title}}</span>
        <span class="inte-pg-title_bottom-line"></span>
      </h1>
    </div>
    <div class="inte-pg-body">
      <el-row class="inte-pg-top row-level-1">
        <el-col v-if="screenMode === 'xs' || screenMode === 'sm'" :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <div class="module-wrap politics-voice-transmit">
            <!-- 政声传递 小屏幕显示 -->
            <politics-voice-transmit></politics-voice-transmit>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
          <el-row class="row-level-2">
            <el-col>
              <div class="module-wrap">
                <!-- 基本概况 -->
                <basic-situation></basic-situation>
              </div>
            </el-col>
            <el-col>
              <div class="module-wrap">
                <!-- 资源分布 -->
                <resource-distribute></resource-distribute>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col v-if="screenMode !== 'xs' && screenMode !== 'sm'" :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <div class="module-wrap">
            <!-- 政声传递 中大屏幕显示 -->
            <politics-voice-transmit></politics-voice-transmit>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
          <el-row class="row-level-2">
            <el-col>
              <div class="module-wrap">
                <!-- 日常监测 -->
                <daily-monitor></daily-monitor>
              </div>
            </el-col>
            <el-col>
              <div class="module-wrap">
                <!-- 高频错词 -->
                <frequency-error-word></frequency-error-word>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row class="inte-pg-bottom row-level-1">
        <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
          <div class="module-wrap">
            <!-- 实时问题 -->
            <real-time-question></real-time-question>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
          <div class="module-wrap">
            <!-- 近日更新 -->
            <lately-update></lately-update>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
          <div class="module-wrap">
            <!-- 热门文章 -->
            <hot-article></hot-article>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import '@/assets/styles/integration.scss'
import settings from '@/settings'
import { getScreenMode } from '@/utils'
import { getUser } from '@/utils/auth'
import throttle from 'lodash/throttle'
import PoliticsVoiceTransmit from './components/module/politics-voice-transmit' // 政声传递
import BasicSituation from './components/module/basic-situation' // 基本概况
import ResourceDistribute from './components/module/resource-distribute' // 资源分布
import DailyMonitor from './components/module/daily-monitor' // 日常监测
import FrequencyErrorWord from './components/module/frequency-error-word' // 高频错词
import LatelyUpdate from './components/module/lately-update' // 近日更新
import RealTimeQuestion from './components/module/real-time-question' // 实时问题
import HotArticle from './components/module/hot-article' // 热门文章

export default {
  data () {
    return {
      title: '政府网站和政务新媒体一体化监管平台', // 产品名称
      screenMode: getScreenMode()
    }
  },
  components: {
    PoliticsVoiceTransmit,
    BasicSituation,
    ResourceDistribute,
    DailyMonitor,
    FrequencyErrorWord,
    RealTimeQuestion,
    LatelyUpdate,
    HotArticle
  },
  methods: {
    // 一体化监管平台名称初始化
    productTitleInit() {
      let user = getUser()
      if (user && user.productTitle) {
        document.title = user.productTitle
        this.title = user.productTitle
      } else {
        document.title = '一体化监管'
      }
    },
    // 屏幕宽度监听
    onWinResize: throttle(function () {
      this.screenMode = getScreenMode()
    }, 200),
    // 解决无缝滚动插件中使用el-tooltip 点击切换出页面再切回tooltip依然显示问题
    tooltipQuestionDo() {
      // 思路：页面显示状态激活时 获取tooltip并移除
      var hiddenProperty = 'hidden' in document ? 'hidden' :
        'webkitHidden' in document ? 'webkitHidden' :
        'mozHidden' in document ? 'mozHidden' :
        null;
      var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
      var onVisibilityChange = function(){
        if (!document[hiddenProperty]) {
          // console.log('页面激活');
          let times = 0
          let timer = setInterval(function() {
            let tooltips = document.getElementsByClassName('el-tooltip__popper')
            Array.from(tooltips).forEach(item => {
              item.parentNode.removeChild(item)
            })
            times++
            if (times >= 15) {
              clearInterval(timer)
            }
          }, 70)
        }
      }
      document.addEventListener(visibilityChangeEvent, onVisibilityChange);
      this.$once('hook:beforeDestroy', function () {
        document.removeEventListener(visibilityChangeEvent, onVisibilityChange);
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    // 如果手机端跳转手机端页面
    if (getScreenMode() === 'xs') {
      next(`/${settings.product.integration.code}/mobile`)
    } else {
      next()
    }
  },
  mounted () {
    this.productTitleInit()
    this.tooltipQuestionDo()
    window.addEventListener('resize', this.onWinResize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onWinResize)
  }
}

</script>

<style lang="scss" scoped>

</style>

<template>
  <module-box
    title="日常监测"
    :mode="isMobile ? 'mobile' : ''"
    is-full-height>
    <template slot="body">
      <div class="main inte-full">
        <div class="main-item" style="padding-right: 5px;">
          <div class="main-item_top">
            <div class="main-item_chart" id="daily_monitor_chart1"></div>
            <div class="main-item_chart-name">一周网站可访问率</div>
          </div>
          <div style="height: 10px;"></div>
          <div class="main-item_bottom">
            <div class="val">
              <count-to :start-val="0" :end-val="ydayNotAvailableNum.val" :duration="1000" class="val_num" />
              <span class="val_unit">个</span>
            </div>
            <div class="name">昨日网站首页无效链接数</div>
            <span class="line line--top"></span>
            <span class="line line--bottom"></span>
          </div>
        </div>
        <div class="main-item" style="padding-left: 5px;">
          <div class="main-item_top">
            <div class="main-item_chart" id="daily_monitor_chart2"></div>
            <div class="main-item_chart-name">两周网站首页更新率</div>
          </div>
          <div style="height: 10px;"></div>
          <div class="main-item_bottom">
            <div class="val">
              <count-to :start-val="0" :end-val="ydayUpdatedNum.val" :duration="1000" class="val_num" style="color: #01faff;" />
              <span class="val_unit">个</span>
            </div>
            <div class="name">两周不更新新媒体数</div>
            <span class="line line--top"></span>
            <span class="line line--bottom"></span>
          </div>
        </div>
      </div>
    </template>
  </module-box>
</template>

<script>
import { getData, getCloudSiteLoginParams } from '@/api/integration'
import { openWindow } from '@/utils'
import throttle from 'lodash/throttle'
import { mapGetters } from 'vuex'
import ModuleBox from '../base/module-box'
import echarts from 'echarts'
import CountTo from 'vue-count-to'

export default {
  components: {
    ModuleBox,
    CountTo
  },
  props: {
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 一周首页连通率
      weekConectedRatio: {
        chart: null,
        val: 0
      },
      // 两周首页正常更新率
      twoWeekUpdatedRatio: {
        chart: null,
        val: 0
      },
      // 昨日首页无效链接数
      ydayNotAvailableNum: {
        val: 0
      },
      // 昨日更新总量
      ydayUpdatedNum: {
        val: 0
      }
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  methods: {
    getData () {
      getData({
        tn: '6',
        functionName: '日常监测'
      }).then(data => {
        if (!data || !data.length) { return }
        let model = data[0]
        this.weekConectedRatio.val = (model.con_rate * 100).toFixed(1) // 一周首页连通率
        this.twoWeekUpdatedRatio.val = (model.update_rate * 100).toFixed(1) // 两周首页正常更新率
        this.ydayNotAvailableNum.val = model.not_use_conns // 昨日首页不可用链接数
        this.ydayUpdatedNum.val = model.update_article_num // 昨日更新总量
        this.chartConectedRadioRender()
        this.chartUpdatedRadioRender()
      })
    },
    // 连通率图表
    chartConectedRadioRender () {
      let value = this.weekConectedRatio.val
      let option = {
        backgroundColor: '',
        title: {
          text: value + '%',
          textStyle: {
            color: '#fff',
            fontSize: 14
          },
          top: 'center',
          left: 'center',
          z: 10
        },
        series: [{ // 主圆环
          type: 'pie',
          radius: ['80%', '100%'],
          hoverAnimation: false,
          startAngle: 225,
          cursor: 'normal',
          color: [{
            type: 'linear',
            colorStops: [{
              offset: 0,
              color: 'rgba(1,250,255,1)' // 0% 处的颜色
            }, {
              offset: 1,
              color: 'rgba(38,188,255,1)' // 100% 处的颜色
            }]
          }, 'transparent'],
          z: 10,
          labelLine: {
            normal: {
              show: false
            }
          },
          data: [{
            value: 75 * value / 100
          }, {
            value: 100 - (75 * value / 100)
          }]
        },
        { // 背景圆环
          type: 'pie',
          radius: ['80%', '100%'],
          hoverAnimation: false,
          silent: true,
          startAngle: 225,
          labelLine: {
            normal: {
              show: false
            }
          },
          z: 5,
          data: [{
            value: 75,
            itemStyle: {
              color: 'rgba(38,39,149,1)'
            }
          },
          {
            value: 25,
            itemStyle: {
              color: 'transparent'
            }
          }
        ]}
      ]}
      this.weekConectedRatio.chart.setOption(option)
    },
    // 更新率图表
    chartUpdatedRadioRender () {
      let value = this.twoWeekUpdatedRatio.val
      let option = {
        backgroundColor: '',
        title: {
          text: value + '%',
          textStyle: {
            color: '#fff',
            fontSize: 14
          },
          top: 'center',
          left: 'center',
          z: 10
        },
        series: [{ // 主圆环
          type: 'pie',
          radius: ['80%', '100%'],
          hoverAnimation: false,
          startAngle: 225,
          cursor: 'normal',
          color: [{
            type: 'linear',
            colorStops: [{
              offset: 0,
              color: 'rgba(254,226,1,1)' // 0% 处的颜色
            }, {
              offset: 1,
              color: 'rgba(235,156,28,1)' // 100% 处的颜色
            }]
          }, 'transparent'],
          z: 10,
          labelLine: {
            normal: {
              show: false
            }
          },
          data: [{
            value: 75 * value / 100
          }, {
            value: 100 - (75 * value / 100)
          }]
        },
        { // 背景圆环
          type: 'pie',
          radius: ['80%', '100%'],
          hoverAnimation: false,
          silent: true,
          startAngle: 225,
          labelLine: {
            normal: {
              show: false
            }
          },
          z: 5,
          data: [{
            value: 75,
            itemStyle: {
              color: 'rgba(38,39,149,1)'
            }
          },
          {
            value: 25,
            itemStyle: {
              color: 'transparent'
            }
          }
        ]}
      ]}
      this.twoWeekUpdatedRatio.chart.setOption(option)
    },
    // 跳转云平台
    onJumpCloudSite (pageType) {
      getCloudSiteLoginParams().then(res => {
        let data = {
          ...res,
          pageType
        }
        if (pageType === 101 || 102) {
          data.siteCode = this.user.organCode
        }
        openWindow({
          method: 'post',
          url: 'https://jg.kaipuyun.cn/cloud_web/users_loginPara.action',
          data
        })
      })
    },
    // 屏幕宽度监听
    onWinResize: throttle(function () {
      this.weekConectedRatio.chart.resize()
      this.twoWeekUpdatedRatio.chart.resize()
    }, 200)
  },
  mounted () {
    this.getData()
    this.weekConectedRatio.chart = echarts.init(document.getElementById('daily_monitor_chart1'))
    this.twoWeekUpdatedRatio.chart = echarts.init(document.getElementById('daily_monitor_chart2'))
    window.addEventListener('resize', this.onWinResize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onWinResize)
  }
}
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  align-items: stretch;
  padding: 15px;
  color: #fff;

  &-item {
    width: 50%;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    &_top {
      display: flex;
      flex-direction: column;
      height: 55%;
      .main-item_chart {
        flex-grow: 1;
      }
      .main-item_chart-name {
        // margin-top: 5px;
        height: 20px;
        flex-grow: 0;
        flex-shrink: 0;
        align-self: center;
        text-align: center;
        white-space: nowrap;
        // cursor: pointer;
        transition: all .2s linear;
        // &:hover {
        //   color: #25d8fd;
        // }
      }
    }
    &_bottom {
      display: flex;
      flex-direction: column;
      position: relative;
      padding: 0 10px 10px 10px;
      align-items: center;
      // height: 45%;
      background-color: rgba(3,54,133,.5);
      background-image: linear-gradient(rgba(3,54,133,.5), rgba(18,29,76,.5));
      text-align: center;
      white-space: nowrap;
      .line {
        position: absolute;
        right: 0;
        left: 0;
        height: 1px;
        opacity: .8;
        &::before, &::after {
          content: '';
          position: absolute;
          height: 3px;
          width: 5px;
          background-color: #0180d7;
          top: -1px;
        }
        &::before {
          left: 0;
        }
        &::after {
          right: 0;
        }
        &--top {
          top: 0;
          background-image: linear-gradient(to right, #0180d7, #00c5fd, #0180d7);
        }
        &--bottom {
          bottom: 0;
          background-image: linear-gradient(to right, #0180d7, #00c5fd 30%, #0180d7 50%);
        }
      }
      .val {
        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 44px;
        &_num {
          color: #ff3c00;
          font-size: 28px;
        }
        &_unit {
          position: relative;
          top: 3px;
          left: 4px;
          color: #8290ad;
          font-size: 16px;
        }
      }
      .name {
        flex-grow: 0;
        flex-shrink: 0;
        // cursor: pointer;
        transition: all .2s linear;
        // &:hover {
        //   color: #25d8fd;
        // }
      }
    }
  }
}
</style>

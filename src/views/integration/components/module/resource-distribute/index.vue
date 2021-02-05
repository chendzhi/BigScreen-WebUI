<template>
  <module-box
    title="资源分布"
    :mode="isMobile ? 'mobile' : ''"
    is-full-height>
    <template slot="toolbar_right">
      <button v-if="isMobile" class="inte-btn inte-btn--mini inte-btn--type-text" @click="onDetail">详情<i class="el-icon-arrow-right"></i></button>
      <button v-else class="inte-btn inte-btn--mini" @click="onDetail">详情</button>
    </template>
    <template slot="body">
      <div class="main inte-full" ref="main"></div>
      <!-- 详情 手机端 -->
      <el-drawer
        v-if="isMobile"
        size="100%"
        :modal="false"
        :visible.sync="detail.show"
        :with-header="false"
        append-to-body>
        <mobile-detail :data="detail.table.data" @on-back="detail.show = false"></mobile-detail>
      </el-drawer>
      <!-- 详情 非手机端 -->
      <modal
        v-else
        v-model="detail.show"
        title="资源分布详情"
        width="90%"
        height="auto">
        <template slot="body">
          <scroll-table
            size="lg"
            :mode="2"
            :cols="detail.table.cols"
            :data="detail.table.data"
            :height="560">
          </scroll-table>
        </template>
      </modal>
    </template>
  </module-box>
</template>

<script>
import { guid } from '@/utils'
import { getData } from '@/api/integration'
import throttle from 'lodash/throttle'
import echarts from 'echarts'
import ModuleBox from '../../base/module-box'
import Modal from '@/components/base/modal'
import ScrollTable from '@/components/base/scroll-table'
import MobileDetail from './mobile-detail'

export default {
  components: {
    ModuleBox,
    Modal,
    ScrollTable,
    MobileDetail
  },
  props: {
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      chart: null,
      detail: {
        show: false,
        table: {
          cols: [
            { label: '名称', prop: 'name', width: '20%' },
            { label: '网站资源量', prop: 'website', width: '16%', align: 'center', sortable: true, icon: 'internet' },
            { label: '微博资源量', prop: 'weibo', width: '16%', align: 'center', sortable: true, icon: 'sina' },
            { label: '微信资源量', prop: 'weixin', width: '16%', align: 'center', sortable: true, icon: 'wechat' },
            { label: '头条资源量', prop: 'toutiao', width: '15%', align: 'center', sortable: true, icon: 'toutiao' },
            { label: '资源总量', prop: 'amount', width: '16%', align: 'center', sortable: true, sortOrder: 'desc' }
          ],
          data: []
        }
      }
    }
  },
  methods: {
    chartRender (chartData) {
      let transNum = (val) => {
        if (!val) {return val}
        if (val > 10000) {
          val = (val / 10000).toFixed(2)
        }
        return val
      }
      let color = ['#01edff', '#ffe300', '#00ff4e', '#fe121a', '#848cff']
      let data = []
      chartData.list.forEach((item, i) => {
        data.push({
          name: item.name,
          value: item.value,
          total: item.total,
          itemStyle: {
            // borderWidth: 3,
            // shadowBlur: 2,
            // borderColor: color[i],
            // shadowColor: color[i]
          }
        })
        if ( item.value) {
          data.push({
            name: '',
            value: 1,
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            itemStyle: {
              color: 'rgba(0, 0, 0, 0)',
              borderColor: 'rgba(0, 0, 0, 0)',
              borderWidth: 0
            },
            emphasis: {
              labelLine: {
                show: false
              }
            }
          })
        }
      })
      let option = {
        title: {
          text: chartData.total > 0 ? `{label|资源总量}\n{val|${transNum(chartData.total)}}\n{unit|${chartData.total>10000?'万条':'条'}}` : '',
          textStyle: {
            lineHeight: 22,
            rich: {
              label: {
                color: '#fff',
                fontSize: 16
              },
              val: {
                color: '#3fe7ff',
                fontSize: 18
              },
              unit: {
                color: '#3fe7ff',
                fontSize: 16
              }
            }
          },
          top: 'center',
          left: 'center'
        },
        tooltip: {
          appendToBody: this.isMobile ? false : true,
        },
        color,
        series: [
          {
            name: '资源分布',
            type: 'pie',
            radius: this.isMobile ? ['48%', '56%'] : ['68%', '80%'],
            center: ['50%', '50%'],
            startAngle: -20,
            hoverAnimation: false,
            tooltip: {
              formatter:function(params){
                let model = params.data
                if (!model.name) {return ''}
                let html = `<div class="inte-tooltip inte-tooltip--resource-distribute">
                  <p class="inte-tooltip_title">${model.name}</p>
                  <p class="inte-tooltip_msg">
                    <span class="inte-tooltip_msg_label">资源量：</span>
                    <span class="inte-tooltip_msg_val">${transNum(model.total)}${model.total>10000?'万条':'条'}</span>
                  </p>
                  </div>`
                return html
              },
              position: function (point, params, dom, rect, size) {
                if(!dom.firstChild) {return}
                let wrap = {
                  width: size.viewSize[0],
                  height: size.viewSize[1]
                }
                let tooltip = {
                  width: dom.firstChild.offsetWidth,
                  height: dom.firstChild.offsetHeight
                }
                let pointInWrap = {
                  left: point[0] < wrap.width/2,
                  right: point[0] > wrap.width/2,
                  top: point[1] < wrap.height/2,
                  bottom: point[1] > wrap.height/2,
                }
                // 左上
                if (pointInWrap.left && pointInWrap.top) {
                  return [point[0], point[1]]
                }
                // 左下
                if (pointInWrap.left && pointInWrap.bottom) {
                  return [point[0], point[1] - tooltip.height]
                }
                // 右上
                if (pointInWrap.right && pointInWrap.top) {
                  return [point[0] - tooltip.width, point[1]]
                }
                // 右下
                if (pointInWrap.right && pointInWrap.bottom) {
                  return [point[0] - tooltip.width, point[1] - tooltip.height]
                }
              }
            },
            label: {
              lineHeight: 22,
              formatter: ['{label|{b}}','{val|{c}%}'].join(' '),
              rich: {
                label: {
                  fontSize: 16,
                  align: 'left'
                },
                val: {
                  fontSize: 16,
                  color: '#fff'
                }
              }
            },
            labelLine: {
              lineStyle: {
                color: '#2aaeff',
                type: 'dotted'
              }
            },
            data
          }
        ]
      }
      this.chart.setOption(option)
    },
    getData () {
      getData({
        tn: '2',
        functionName: '资源分布'
      }).then(data => {
        let total = 0, websiteTotal = 0, weiboTotal = 0, weixinTotal = 0, toutiaoTotal = 0, otherTotal = 0
        data.forEach(item => {

          // 处理纠正数据
          item.id = guid()
          item.website = item.website || 0
          item.weibo = item.weibo || 0
          item.weixin = item.weixin || 0
          item.toutiao = item.toutiao || 0
          item.other = item.other || 0
          item.amount = item.amount || 0

          // 统计类型总量
          websiteTotal += item.website
          weiboTotal += item.weibo
          weixinTotal += item.weixin
          toutiaoTotal += item.toutiao
          otherTotal += item.other

          // 是否是当前登录者的数据
          // if (item.is_current === 1) {
          //   this.detail.table.highlightRowKeys.push(item.id)
          // }
        })
        total = websiteTotal + weiboTotal + weixinTotal + otherTotal

        let chartData = {
          total,
          list: [
            { total: websiteTotal, value: websiteTotal/total, name: '网站' },
            { total: weiboTotal, value: weiboTotal/total, name: '微博' },
            { total: weixinTotal, value: weixinTotal/total, name: '微信' },
            { total: toutiaoTotal, value: toutiaoTotal/total, name: '头条' },
            // { total: otherTotal, value: otherTotal/total, name: '其他' }
          ]
        }
        chartData.list.forEach(item => {
          item.value = parseFloat((item.value * 100).toFixed(1))
        })
        this.detail.table.data = data
        this.chartRender(chartData)
      })
    },
    // 详情
    onDetail () {
      this.detail.show = true
    },
    // 屏幕宽度监听
    onWinResize: throttle(function () {
      this.chart.resize()
    }, 200)
  },
  mounted () {
    this.chart = echarts.init(this.$refs.main)
    window.addEventListener('resize', this.onWinResize)
    this.getData()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onWinResize)
  }
}
</script>

<style lang="scss" scoped>
</style>

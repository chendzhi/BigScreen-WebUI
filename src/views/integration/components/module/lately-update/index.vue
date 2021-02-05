<template>
  <module-box
    :mode="isMobile ? 'mobile' : 2"
    title="一周更新"
    is-full-height>
    <template slot="toolbar_right">
      <button v-if="isMobile" class="inte-btn inte-btn--mini inte-btn--type-text" @click="onPK">对比<i class="el-icon-arrow-right"></i></button>
      <button v-else class="inte-btn inte-btn--mini" @click="onPK">对比</button>
    </template>
    <template slot="body">
      <div class="main inte-full" ref="main"></div>
      <!-- 对比详细 手机端 -->
      <el-drawer
        v-if="isMobile"
        size="100%"
        :modal="false"
        :visible.sync="pk.show"
        :with-header="false"
        append-to-body>
        <mobile-pk :data="pk.table.data" @on-back="pk.show = false"></mobile-pk>
      </el-drawer>
      <!-- 对比详细 非手机端 -->
      <modal
        v-else
        v-model="pk.show"
        title="一周更新量对比"
        width="90%"
        height="auto">
        <template slot="body">
          <p class="inte-rank-msg" v-if="pk.rankNO">
            {{user.organName}}一周内容更新量同级对比排在第
            <span class="inte-rank-msg_num">{{pk.rankNO}}</span>
            位
          </p>
          <scroll-table
            size="lg"
            :mode="2"
            :cols="pk.table.cols"
            :data="pk.table.data"
            :height="500">
          </scroll-table>
        </template>
      </modal>
    </template>
  </module-box>
</template>

<script>
import { guid, parseTime } from '@/utils'
import { getData } from '@/api/integration'
import throttle from 'lodash/throttle'
import echarts from 'echarts'
import { mapGetters } from 'vuex'
import ModuleBox from '../../base/module-box'
import Modal from '@/components/base/modal'
import ScrollTable from '@/components/base/scroll-table'
import MobilePk from './mobile-pk'

export default {
  components: {
    ModuleBox,
    Modal,
    ScrollTable,
    MobilePk
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
      pk: {
        show: false,
        rankNO: 0, // 名次
        table: {
          cols: [
            { label: '名称', prop: 'name', width: '25%' },
            { label: '网站更新量', prop: 'website', width: '25%', align: 'center', sortable: true, icon: 'internet' },
            { label: '新媒体更新量', prop: 'media', width: '25%', align: 'center', sortable: true, icon: 'video' },
            { label: '总更新量', prop: 'amount', width: '25%', align: 'center', sortable: true }
          ],
          data: []
        }
      }
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    getData () {
      getData({
        tn: '5',
        functionName: '近日更新',
        queryParam: 'is_current=1',
        orderParam: 'data_time=asc' // 日期正序
      }).then(data => {
        if (!data || !data.length) { return }
        let chartData = {
          category: [],
          webData: [],
          newMediaData: []
        }
        data.forEach(item => {
          let date = parseTime(item.data_time, '{m}/{d}')
          chartData.category.push(date)
          chartData.webData.push(item.website)
          chartData.newMediaData.push(item.media)
        })
        this.chartRender(chartData)
      })
    },
    chartRender (data) {
      let transNum = (val) => {
        if (!val) {return val}
        if (val > 10000) {
          val = (val / 10000).toFixed(3)
        }
        return val
      }
      let option = {
        tooltip: {
          // appendToBody: true,
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter:function(params){
            let arr = params
            let html = `<div class="inte-tooltip inte-tooltip--lately-update">
              <p class="inte-tooltip_msg">
                <span class="inte-tooltip_msg_label">${arr[0].seriesName}：</span>
                <span class="inte-tooltip_msg_val">${transNum(arr[0].value)}${arr[0].value>10000?'万条':'条'}</span>
              </p>
              <p class="inte-tooltip_msg">
                <span class="inte-tooltip_msg_label">${arr[1].seriesName}：</span>
                <span class="inte-tooltip_msg_val">${transNum(arr[1].value)}${arr[1].value>10000?'万条':'条'}</span>
              </p>
              </div>`
            return html
          },
          position: function (point, params, dom, rect, size) {
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
        legend: {
          top: this.isMobile ? 12 : 0,
          icon: 'roundRect',
          itemHeight: 12,
          itemWidth: 12,
          textStyle: {
            color:'#04cdf4',
            fontSize: 10
          }
        },
        grid: {
          left: 56,
          right: 20,
          top: this.isMobile ? 46 : 28,
          bottom: 30
        },
        xAxis: [
          {
            type : 'category',
            boundaryGap: false,
            data: data.category,
            axisLine: {
              lineStyle: {
                color: '#24609a'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              color:'#c1cadf'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '更新量',
            nameTextStyle: {
              color:'#c1cadf',
              align:'right',
              lineHeight:10
            },
            axisLine:{
              show: false,
              lineStyle:{
                color:'rgba(240,199,37,0.5)'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              interval: 0,
              color: '#c1cadf'
            },
            splitLine: {
              lineStyle: {
                color: ['#0c53ae'],
                type: 'dashed'
              }
            }
          }
        ],
        series: [
          {
            name:'政府网站',
            type:'line',
            smooth: true,
            symbol: 'none',
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(84,247,255,0.5)'
              },
              {
                offset: 1,
                color: 'rgba(4,139,255,0.01)'
              }])
            },
            data: data.webData,
            itemStyle:{
              normal:{color: '#30dcf3'}
            }
          },
          {
            name:'政务新媒体',
            type:'line',
            smooth: true,
            symbol: 'none',
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(255,234,0,0.5)'
              }, {
                offset: 1,
                color: 'rgba(255,228,0,0.01)'
              }])
            },
            data: data.newMediaData,
            itemStyle:{ normal:{ color:'#ffff00' } }
          }
        ]
      }
      this.chart.setOption(option)
    },
    // 获取pk数据
    getPKData () {
      getData({
        tn: '5',
        functionName: '近日更新-对比',
        queryParam: 'is_current=2',
        orderParam: 'amount=desc'
      }).then(data => {
        if (!data || !data.length) {
          this.pk.table.data = []
          return
        }
        data.forEach((item, index) => {
          item.id = guid()
          item.website = item.website || 0
          item.media = item.media || 0
          item.amount = item.amount || 0

          // 找自己排名位置
          // if (item.is_current === 1) {
          //   this.pk.rankNO = index + 1
          // }
          // 接口修改后不能以is_current===1判断 只能以名称判断
          if (item.name === this.user.organName) {
            this.pk.rankNO = index + 1
          }
        })
        this.pk.table.data = data
      })
    },
    onPK () {
      this.pk.show = true
      this.getPKData()
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

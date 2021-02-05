<template>
<div class="container">
  <div class="map-wrap">
    <cust-map :code="map.code" :eoption="map.eoption"></cust-map>
  </div>
  <div class="map-wrap map-wrap--y">
    <cust-map :code="map.code" :control="false" :eoption="map.eoption"></cust-map>
  </div>
  <div class="map-wrap map-wrap--x">
    <cust-map :code="map.code" :control="false" :eoption="map.eoption"></cust-map>
  </div>
  <!-- <div class="map-wrap map-wrap--xy">
    <cust-map :code="map.code" :control="false" :eoption="map.eoption"></cust-map>
  </div> -->
</div>
</template>

<script>
import '@/assets/styles/integration.scss'
import { region as regionConfig } from '@/config/map'
import CustMap from '@/components/base/map'
export default {
  components: {
    CustMap
  },
  data () {
    return {
      map: {
        code: '540200',
        eoption: {}
      }
    }
  },
  methods: {
    // 数据处理
    _dataDeal (data) {
      if (!data.length) {return {}}
      let points = [] // 坐标点数据 [{name: '昌平区', value: [234.343, 2342,33], extends...},...]
      let lines = [] // 迁徙线数据 [[234.343, 2342,33],...]
      data.forEach((lineItem, index) => {
        let from = lineItem.from
        let to = lineItem.to
        let arr = [from, to]

        // 组装坐标点数据
        arr.forEach((item, i) => {
          let place = regionConfig[item.code] // 地图配置文件的地点映射
          if (!place) {return}
          let isHas = points.find(p => p.code === item.code) ? true : false
          if (!isHas) {
            // 计算百分比 i === 0 代表from from无百分比计算
            let val = 0
            if (i === 0) {val = null}
            if ((item.website_total + item.media_total) > 0) {
              val = i === 0 ? null : (item.website_number + item.media_number) / (item.website_total + item.media_total)
            }
            points.push({
              symbolSize: 10,
              name: place.name,
              value: place.coord.concat(val),
              ...item
            })
          }
        })
        // 组装迁徙数据
        if (!regionConfig[from.code] || !regionConfig[to.code]) {return}
        let val = 0
        if ((to.website_total + to.media_total) > 0) {
          val = (to.website_number + to.media_number) / (to.website_total + to.media_total)
        }
        let line = {
          value: val,
          coords: [
            regionConfig[from.code].coord,
            regionConfig[to.code].coord
          ]
        }
        lines.push(line)
      })
      return {
          points,
          lines
        }
    },

    optionInit () {
      let lines = [
        {
          from: {
            code: '110000'
          },
          to: {
            code: '110114',
            website_number: 23,
            website_total: 100,
            media_number: 10,
            media_total: 200
          }
        },
        {
          from: {
            code: '110000'
          },
          to: {
            code: '110228',
            website_number: 12,
            website_total: 100,
            media_number: 22,
            media_total: 200
          }
        },
        {
          from: {
            code: '110000'
          },
          to: {
            code: '110229',
            website_number: 23,
            website_total: 100,
            media_number: 30,
            media_total: 200
          }
        }
      ]
      let data = this._dataDeal(lines)
      let option = {
        color: ['#e6ba09'],
        visualMap: {
          show: false,
          min: 0,
          max: 1,
          splitNumber: 5,
          pieces: [
            {min: .75, max: 1, label: '75%以上', color: '#e7530f'},
            {min: .5, max: .75, label: '50%-75%', color: '#ffcc00'},
            {min: .25, max: .5, label: '25%-50%', color: '#01ffff'},
            {min: 0, max: .25, label: '25%以下', color: '#07f64b'}
          ],
          textStyle: {
            color: '#fff'
          }
        },
        tooltip : {
          appendToBody: true,
          trigger: 'item',
          formatter:function(params){
            if(params.seriesType=="effectScatter") {
            let data = params.data

            // 如果没有百分比数值
            if (data.value[2] === null) {
              return ''
            }
            // 占比
            let ratio = (data.value[2] * 100).toFixed(1)
            return `<div class="inte-tooltip inte-tooltip--map">
              <p class="inte-tooltip_title">${data.name}（${ratio}%）</p>
              <p class="inte-tooltip_msg">
                <span class="msg_label">网站传播数量：</span>
                <span class="msg_val">${data.website_number}/${data.website_total}</span>
              </p>
              <p class="inte-tooltip_msg">
                <span class="msg_label">新媒体传播数量：</span>
                <span class="msg_val">${data.media_number}/${data.media_total}</span>
              </p>
              </div>`
            }
          }
        },
        series: [
          {
            zlevel: 10,
            type: 'effectScatter',
            coordinateSystem: 'geo',
            showEffectOn: 'render',
            rippleEffect: {
              period: 5,
              scale: 5,
              brushType: 'fill'
            },
            hoverAnimation: true,
            label: {
              show: true,
              position: 'bottom',
              formatter: function(params) {
                let data = params.data
                let fmt = `{name|${data.name}}`
                if (data.value[2] !== null) {
                  // 占比
                  let ratio = (data.value[2] * 100).toFixed(1)
                  fmt += `\n{ratio|(${ratio}%)}`
                }
                return fmt
              },
              rich: {
                name: {
                  color: 'rgba(1,250,255,1)',
                  lineHeight: 20,
                  fontSize: 16
                },
                ratio: {
                  color: '#fff',
                  lineHeight: 20,
                  fontSize: 14
                }
              },
            },
            data: data.points || []
          },
          {
            type: 'lines',
            zlevel: 2,
            effect: {
              show: true,
              period: 4, //箭头指向速度，值越小速度越快
              trailLength: 0.4, //特效尾迹长度[0,1]值越大，尾迹越长重
              symbol: 'arrow', //箭头图标
              symbolSize: 7, //图标大小
            },
            lineStyle: {
              color: params => {
                return '#fff'
              },
              width: 1, //线条宽度
              opacity: 0.1, //尾迹线条透明度
              curveness: .3 //尾迹线条曲直度
            },
            data: data.lines || []
          }
        ]
      }
      this.map.eoption = option
    },
    driverCabinMapOptionInit () {
      let points = [
        {
          name: '北京市',
          symbolSize: 14,
          value: [116.40529,39.904987],
          itemStyle:{color:'#22f4f5'}
        },
        {
          name: '密云区',
          value: [116.994846, 40.526834],
          itemStyle:{color:'#22f4f5'}
        },
        {
          name: '延庆区',
          value: [116.16401, 40.540016],
          itemStyle:{color:'#22f4f5'}
        },
        {
          name: '平谷区',
          value: [117.145392, 40.208997],
          itemStyle:{color:'#e3341f'}
        },
        {
          name: '怀柔区',
          value: [116.586079, 40.63069],
          itemStyle:{color:'#e3341f'}
        }
      ]
      let markPoints = [
        {
          name: '密云区',
          coord: [116.994846, 40.526834],
          value: 5,
          symbolSize: 40,
          // symbolOffset: [24, 1],
          itemStyle:{color:'#17f387'},
          label: {
            color: '#05496e',
            fontSize: 14
          }
        },
        {
          name: '延庆区',
          coord: [116.16401, 40.540016],
          value: 5,
          symbolSize: 40,
          // symbolOffset: [24, 1],
          itemStyle:{color:'#17f387'},
          label: {
            color: '#05496e',
            fontSize: 14
          }
        }
      ]
      let lines = [
        {
          name: 'to密云区',
          coords: [[116.40529,39.904987], [116.994846, 40.526834]]
        },
        {
          name: 'to延庆区',
          coords: [[116.40529,39.904987], [116.16401, 40.540016]]
        }
      ]
      let option = {
        tooltip : {
          appendToBody: true,
          trigger: 'item',
          backgroundColor: 'none',
          formatter:function(params){
            if(params.seriesType=="effectScatter") {
            let data = params.data

            // 如果没有百分比数值
            if (data.value[2] === null) {
              return ''
            }
            // 占比
            let ratio = (data.value[2] * 100).toFixed(1)
            return `<div class="map-tooltip">
              <p class="inte-tooltip_title">活动足迹5条</p>
              <p class="inte-tooltip_msg">
                <span class="msg_label">网站传播数量：</span>
                <span class="msg_val">${data.website_number}/${data.website_total}</span>
              </p>
              <p class="inte-tooltip_msg">
                <span class="msg_label">新媒体传播数量：</span>
                <span class="msg_val">${data.media_number}/${data.media_total}</span>
              </p>
              </div>`
            }
          }
        },
        series: [
          {
            zlevel: 10,
            type: 'effectScatter',
            coordinateSystem: 'geo',
            showEffectOn: 'render',
            rippleEffect: {
              period: 5,
              scale: 4,
              brushType: 'stroke'
            },
            hoverAnimation: true,
            data: points,
            markPoint: {
              data: markPoints
            }
          },
          {
            name: 'line-series',
            type: 'lines',
            zlevel: 2,
            coordinateSystem: 'geo',
            effect: {
              show: true,
              period: 4, //箭头指向速度，值越小速度越快
              trailLength: 0.3, //特效尾迹长度[0,1]值越大，尾迹越长重
              symbol: 'diamond', //箭头图标
              symbolSize: 7, //图标大小
            },
            lineStyle: {
              type: 'dashed',
              color: '#17f387',
              width: 2, //线条宽度
              opacity: 0.1, //尾迹线条透明度
              curveness: .3 //尾迹线条曲直度
            },
            data: lines
          }
        ]
      }
      this.map.eoption = option
    },
  },
  mounted () {
    // this.optionInit()
    // this.driverCabinMapOptionInit()
  }
}
</script>

<style lang="scss">
  .map-wrap {
    margin: 5px auto;
    width: 100%;
    height: 600px;
    border: 1px solid #ccc;
    background-color: #ccc;

    &.map-wrap--y {
      width: 400px;
      height: 800px;
    }
    &.map-wrap--x {
      width: 800px;
      height: 400px;
    }
    &.map-wrap--xy {
      width: 400px;
      height: 400px;
    }
  }
</style>

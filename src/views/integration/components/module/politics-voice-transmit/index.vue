<template>
  <div :class="['m-voice', {'m-voice--full-screen': isFullScreen, 'm-voice--mobile': isMobile}]">
    <div class="m-voice_head">
      <div v-if="!isMobile" class="title">政声传递</div>
      <div v-if="data.length" class="voice-carousel">
        <el-carousel
          ref="carousel"
          :autoplay="!isFixed"
          :interval="15*1000"
          arrow="never"
          indicator-position="none"
          height="30px"
          @change="onCarouselChange">
          <el-carousel-item
            v-for="item in data"
            :key="item.id">
            <p class="voice-title">
              <el-tooltip
                placement="top"
                :content="item.policyTitle">
              <span>{{item.policyTitle}}</span>
              </el-tooltip>
            </p>
          </el-carousel-item>
        </el-carousel>
        <span class="split"></span>
        <el-tooltip
          placement="top"
          :content="isFixed ? '解除固定' : '固定专题'">
          <image-icon
            :class="{'on': isFixed}"
            icon="dingzi"
            :height="20"
            :width="16"
            @click.native="onFixed">
          </image-icon>
        </el-tooltip>
        <!-- 全屏操作 移动端不全屏 -->
        <el-tooltip
          v-if="!isMobile"
          placement="top"
          :content="isFullScreen ? '解除全屏' : '全屏展示'">
          <i :class="[
            'action-icon',
            {
              'el-icon-full-screen': !isFullScreen,
              'el-icon-copy-document': isFullScreen
            }
            ]"
            @click="onFullScreenToggle">
          </i>
        </el-tooltip>
      </div>

      <!-- <button class="inte-btn inte-btn--small">专题报告</button> -->
    </div>
    <div class="m-voice_body">
      <div class="m-voice_map-wrap">
        <!--
          自定义地图
          漫游：pc端全屏不漫游 移动端不漫游
        -->
        <custom-map
          ref="customMap"
          :code="user.organType === 1 ? '100000' : user.organCode"
          :eoption="map.eoption"
          :roam="!isFullScreen && !isMobile">
        </custom-map>
        <ul :class="['indicator', {'indicator--disabled': isFixed}]">
          <li
            v-for="(item, index) in data"
            :key="item.id"
            :class="['indicator-item', {'indicator-item--on': carouselIndex === index}]"
            @click="onIndicatorItemClick(index)">
          </li>
        </ul>
        <ul class="visual-map">
          <li
            v-for="item in map.visualMap"
            :key="item.id"
            :class="{'disabled': item.disabled}"
            @click="onVisualMapItemClick(item)">
            <span class="item" :style="`background-color: ${item.color}`"></span>
            <span class="text">{{item.label}}</span>
          </li>
        </ul>
      </div>
      <mobile-detail v-if="isMobile && data.length" :data="data[carouselIndex].transData"></mobile-detail>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import mapUtils from '@/utils/map'
import enums from '@/config/enum'
import throttle from 'lodash/throttle'
import api from '@/api/integration'
import CustomMap from '@/components/base/map'
import ImageIcon from '@/components/base/image-icon'
import MobileDetail from './mobile-detail'

export default {
  components: {
    CustomMap,
    ImageIcon,
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
      data: [],
      isFixed: false, // 是否固定专题
      isFullScreen: false, // 是否全屏
      carouselIndex: 0, // 当前轮播索引
      map: {
        eoption: {},
        visualMap: [
          {min: .25, max: 1, disabled: false, label: '25%以上', color: '#e7530f'},
          {min: .1, max: .25, disabled: false, label: '10%-25%', color: '#ffcc00'},
          {min: .05, max: .1, disabled: false, label: '5%-10%', color: '#01ffff'},
          {min: 0, max: .05, disabled: false, label: '5%以下', color: '#07f64b'}
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    getData () {
      api.getPolicyData({
        tn: '4',
        functionName: '政声传递'
      }).then(data => {
        if (!data || !data.length) {
         this.data = []
         this.map.lines = []
         return
        }
        this.data = data
        // 获取第一条文章传递信息列表
        let article = data[0]
        this.getTransData(article).then(data => {
          article.transData = data
          this.map.eoption = this._getMapEOptionByData(data)
        })
      })
    },
    // 获取传递数据列表
    getTransData (article) {
      return api.getData({
        tn: '4',
        functionName: '政声传递-传递详情',
        queryParam: `article_id=${article.id}`
      })
    },
    // 固定专题
    onFixed () {
      this.isFixed = !this.isFixed
    },
    // 模块全屏切换
    onFullScreenToggle () {
      this.isFullScreen = !this.isFullScreen
      this.$nextTick(() => {
        this.$refs.customMap.resize()
      })
    },
    // 指示器项点击
    onIndicatorItemClick (index) {
      this.$refs.carousel.setActiveItem(index)
    },
    // 轮播变化回调
    async onCarouselChange (index) {
      // 联动指示器
      this.carouselIndex = index

      // 联动地图迁徙数据
      let article = this.data[index]
      if (article.transData) {
        this.map.eoption = this._getMapEOptionByData(article.transData)
      } else {
        article.transData = await this.getTransData(article)
        this.map.eoption = this._getMapEOptionByData(article.transData)
      }

      // 视觉映射
      this.map.visualMap.forEach(item => {
        item.disabled = false
      })
    },
    // 视觉映射项点击
    onVisualMapItemClick (item) {
      item.disabled = !item.disabled
      let selected = {}
      this.map.visualMap.forEach((item, index) => {
        selected[index] = !item.disabled
      })
      this.$refs.customMap.chart.dispatchAction({
        type: 'selectDataRange',
        selected
      })
    },
    // 屏幕宽度监听
    onWinResize: throttle(function () {
      this.$refs.customMap.resize()
    }, 200),
    // 根据data获取地图配置参数
    _getMapEOptionByData (data) {
      // if (!data || !data.length) {return []}
      /**
       * 注意点说明：
       * 部委使用全国地图 省市用户对于使用自己省市地图
       * 部委地图以北京为中心点 向各省|直辖市传递
       * 直辖市属于省级用户如北京市
       */
      let isDepartment = this.user.organType === enums.common.organType.department // 是否部委用户
      let regions = mapUtils.getChild(this.user.organCode)
      let fromCode = isDepartment ? '110000' : this.user.organCode // 部委以北京为出发点
      let from = mapUtils.getModel(fromCode)

      // 颜色配置
      let color = {
        orange: '#e6ba09'
      }
      let points = [] // 点集合
      let lines = [] // 线集合

      // 组装点-出发点
      points.push({
        name: from.name,
        symbolSize: 8,
        value: from.coord.concat(null),
        label: {
          show: true,
          position: 'left'
        },
        itemStyle: {
          color: color.orange
        }
      })

      regions.forEach(to => {
        let model = data.find(m => m.code === to.code)
        let value = 0 // 比率值 公式：网站新媒体传播总和 / 网站新媒体总数
        if (model && (model.website_total + model.media_total) > 0) {
          value = (model.website_number + model.media_number) / (model.website_total + model.media_total)
          // value = Math.random()
        }
        // 组装点-目的点
        points.push({
          name: to.name,
          symbol: 'circle',
          symbolSize: 5,
          value: to.coord.concat(value),
          itemStyle: {
            color: '#fff'
          },
          label: {
            show: true
          },
          // 扩展属性
          ex: {
            website_number: model ? model.website_number : 0,
            website_total: model ? model.website_total : 0,
            media_number: model ? model.media_number : 0,
            media_total: model ? model.media_total : 0
          }
        })

        // 组装线
        lines.push({
          name: to.name,
          coords: [from.coord, to.coord],
          value: value
        })

      })
      let option = {
        visualMap: {
          show: false,
          pieces: this.map.visualMap.map(item => {
            return {
              min: item.min,
              max: item.max,
              label: item.label,
              color: item.color
            }
          }),
          itemWidth: 12,
          itemHeight: 14,
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
                <span class="inte-tooltip_msg_label">网站传播数量：</span>
                <span class="inte-tooltip_msg_val">${data.ex.website_number}/${data.ex.website_total}</span>
              </p>
              <p class="inte-tooltip_msg">
                <span class="inte-tooltip_msg_label">新媒体传播数量：</span>
                <span class="inte-tooltip_msg_val">${data.ex.media_number}/${data.ex.media_total}</span>
              </p>
              </div>`
            }
          },
          position: function (point, params, dom, rect, size) {
            if(params.seriesType=="effectScatter") {
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
          }
        },
        series: [
          {
            zlevel: 10,
            type: 'effectScatter',
            coordinateSystem: 'geo',
            showEffectOn: 'render',
            rippleEffect: {
              period: 2,
              scale: 5,
              brushType: 'stroke'
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
            data: points || []
          },
          {
            type: 'lines',
            zlevel: 2,
            effect: {
              show: true,
              // period: 4, //箭头指向速度，值越小速度越快
              constantSpeed: 40,
              trailLength: 0.4, //特效尾迹长度[0,1]值越大，尾迹越长重
              symbol: 'triangle', //箭头图标
              symbolSize: 5, //图标大小
            },
            lineStyle: {
              color: params => {
                return '#fff'
              },
              width: 1, //线条宽度
              opacity: 0.1, //尾迹线条透明度
              curveness: 0.2 //尾迹线条曲直度
            },
            data: lines || []
          }
        ]
      }
      return option
    }
  },
  mounted () {
    window.addEventListener('resize', this.onWinResize)
    this.getData()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onWinResize)
  }
}
</script>

<style lang="scss" scoped>
.m-voice {
  display: flex;
  flex-direction: column;
  padding-top: 30px;
  height: 100%;
  &_head {
    flex-grow: 0;
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    height: 30px;
    line-height: 30px;
    .title {
      color: #25d8fd;
      font-size: 20px;
      font-weight: bold;
    }
    .voice-carousel {
      flex-grow: 1;
      display: flex;
      align-items: center;
      padding: 0 0 0 20px;
      height: 30px;
      .el-carousel {
        flex-grow: 1;
        .voice-title {
          color: #ffe300;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          text-align: right;
        }
      }
      .split {
        margin: 0 10px;
        height: 14px;
        border-right: 1px solid #25d8fd;
      }
      .icon {
        flex-grow: 0;
        flex-shrink: 0;
        cursor: pointer;
        opacity: .7;
        &.on {
          opacity: 1;
        }
      }
      .action-icon {
        margin: 0 4px;
        padding: 2px;
        font-size: 16px;
        color: #25d8fd;
        opacity: .9;
        cursor: pointer;
        outline: none;
      }
    }
  }
  &_body {
    position: relative;
    flex-grow: 1;
    flex-shrink: 0;
    overflow: hidden;

    .m-voice_map-wrap {
      position: relative;
      height: 100%;
    }

    .ucap-map {
      position: absolute;
      top: -16px;
      right: 0;
      bottom: 0;
      left: 0;
      height: auto;
    }
    .indicator {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      height: 3px;
      overflow: hidden;
      &-item {
        margin-left: 4px;
        float: left;
        height: 3px;
        width: 30px;
        background-color: #04cdf4;
        opacity: .5;
        transition: all .2s linear;
        cursor: pointer;
        &:first-child {margin-left: 0;}
        &--on {
          opacity: 1;
        }
      }

      &--disabled {
        &::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          z-index: 10;
        }
      }
    }

    .visual-map {
      position: absolute;
      bottom: 0px;
      left: 0px;
      li {
        padding: 1px 0;
        cursor: pointer;
        .item {
          display: inline-block;
          margin-right: 4px;
          width: 12px;
          height: 12px;
          border-radius: 2px;
          background-color: #ccc;
          vertical-align: middle;
        }
        .text {
          color: #fff;
          font-size: 12px;
          vertical-align: middle;
        }
        &.disabled {
          opacity: .5;
        }
      }
    }
  }
  // 全屏状态
  &--full-screen {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 20px;
    z-index: 9999999;
    background-color: rgba(0,0,0,.5);
  }

  // 移动端
  &--mobile {
    padding-top: 0;
    .m-voice_head {
      .voice-carousel {
        padding-left: 0;
      }
    }
    .m-voice_body {
      flex-grow: 0;
      padding-bottom: 22px;
      overflow: visible;
    }
    .m-voice_map-wrap {
      margin-bottom: 20px;
      height: 350px;
    }
  }
}
</style>

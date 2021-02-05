<template>
  <div
    ref="container"
    :class="[
    'ucap-map m-no-select',
    `ucap-map--${code}`
    ]">
    <div ref="mapWrap" :class="['ucap-map_wrap', {'ucap-map_wrap--fade-out': !mapImgLoad}]" :style="mapWrapStyle">
      <img class="ucap-map_img" ref="mapImg"></img>
      <div class="ucap-map_emap" ref="emap"></div>
    </div>
    <div v-if="control" class="ucap-map_control">
      <button @click="resize">复位</button>
      <button @click="scale(1.2)">放大</button>
      <button @click="scale(0.8)">缩小</button>
      <button @click="move(0, -10)">上</button>
      <button @click="move(0, 10)">下</button>
      <button @click="move(-10, 0)">左</button>
      <button @click="move(10, 0)">右</button>
    </div>
  </div>
</template>

<script>
import throttle from 'lodash/throttle'
import request from '@/utils/request'
import echarts from 'echarts'
export default {
  props: {
    // 地区行政编码 如：北京:110000
    code: {
      type: String,
      default: ''
    },
    // echarts 配置
    eoption: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 是否漫游（放大缩小 左右移动）
    roam: {
      type: Boolean,
      default: false
    },
    // 最小缩放比
    roamScaleMin: {
      type: Number,
      default: 0.5
    },
    // 最大缩放比（注：最大缩放比过大会有些许性能问题 推荐2.5倍）
    roamScaleMax: {
      type: Number,
      default: 2.5
    },
    // 显示控制操作（貌似没啥用处 没继续做 后续需要再做）
    control: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      chart: null,
      containerEmapHeightRatio: 1.154697651535979, // 容器高度与echart容器高度比率 （echarts容器z轴倾斜30度 平面视角高度减少）
      scaleRatio: 1,
      mapImgLoad: true, // 地图图片是否加载完成
      // 地图容器
      container: {
        // 初始属性
        initial: {
          width: 600
        }
      },
      // 组件地图配置
      mapConf: {
        100000: {
          title: '中国',
          code: '100000',
          backgroundSize: 600, // 初始背景地图大小
          mapWhRatio: 1.382488479262673, // 地图图片宽高比
          // 微调与背景地图重叠参数
          relative: {
            top: 14,
            left: 0
          },
          // echart map 配置
          econf: {
            layoutSize: 586,
            center: [104.3,34.3]
          }
        },
        110000: {
          title: '北京',
          code: '110000',
          backgroundSize: 600, // 初始背景地图大小
          mapWhRatio: 1.11317254174397, // 地图宽高比
          // 微调与背景地图重叠参数
          relative: {
            top: 14,
            left: 0
          },
          // echart map 配置
          econf: {
            layoutSize: 554
          }
        },
        130100: {
          title: '石家庄',
          code: '130100',
          backgroundSize: 600,
          mapWhRatio: 1.25,
          relative: {
            top: 14,
            left: 0
          },
          econf: {
            layoutSize: 550
          }
        },
        440300: {
          title: '深圳',
          code: '440300',
          backgroundSize: 600,
          mapWhRatio: 1.530612244897959,
          relative: {
            top: 16,
            left: 0
          },
          econf: {
            layoutSize: 552
          }
        },
        620000: {
          title: '甘肃省',
          code: '620000',
          backgroundSize: 600,
          mapWhRatio: 1.333333333333333,
          relative: {
            top: 16,
            left: 0
          },
          econf: {
            layoutSize: 552
          }
        },
        340000: {
          title: '安徽',
          code: '340000',
          backgroundSize: 540,
          mapWhRatio: 0.9402023919043238,
          relative: {
            top: -8,
            left: 0
          },
          econf: {
            layoutSize: 638
          }
        },
        341700: {
          title: '安徽-池州市',
          code: '341700',
          backgroundSize: 638,
          mapWhRatio: 1.048951048951049,
          relative: {
            top: 34,
            left: 0
          },
          econf: {
            layoutSize: 600
          }
        },
        440000: {
          title: '广东省',
          code: '440000',
          backgroundSize: 600,
          mapWhRatio: 1.207243460764588,
          relative: {
            top: 24,
            left: 2
          },
          econf: {
            layoutSize: 552
          }
        },
        360000: {
          title: '江西省',
          code: '360000',
          backgroundSize: 590,
          mapWhRatio: 0.8470688190314359,
          relative: {
            top: 18,
            left: 0
          },
          econf: {
            layoutSize: 720
          }
        },
        370000: {
          title: '山东省',
          code: '370000',
          backgroundSize: 600,
          mapWhRatio: 1.602136181575434,
          relative: {
            top: 20,
            left: 1
          },
          econf: {
            layoutSize: 552
          }
        },
        310000: {
          title: '上海市',
          code: '310000',
          backgroundSize: 586,
          mapWhRatio: 0.9749791492910759,
          relative: {
            top: 14,
            left: -24
          },
          econf: {
            layoutSize: 608
          }
        },
        510000: {
          title: '四川省',
          code: '510000',
          backgroundSize: 600,
          mapWhRatio: 1.161665053242982,
          relative: {
            top: 15,
            left: 1
          },
          econf: {
            layoutSize: 552
          }
        },
        500000: {
          title: '重庆市',
          code: '500000',
          backgroundSize: 600,
          mapWhRatio: 1.061007957559682,
          relative: {
            top: 24,
            left: 0
          },
          econf: {
            layoutSize: 566
          }
        },
        460000: {
          title: '海南省',
          code: '460000',
          backgroundSize: 560,
          mapWhRatio: 1,
          relative: {
            top: -3,
            left: -1
          },
          econf: {
            layoutSize: 4190,
            center: [109.84,19.1]
          }
        },
        360700: {
          title: '赣州市',
          code: '360700',
          backgroundSize: 600,
          mapWhRatio: 0.9741666666666667,
          relative: {
            top: 10,
            left: 1
          },
          econf: {
            layoutSize: 644
          }
        },
        540200: {
          title: '日喀则市',
          code: '540200',
          backgroundSize: 600,
          mapWhRatio: 1.687763713080169,
          relative: {
            top: 11.5,
            left: 2
          },
          econf: {
            layoutSize: 531.2
          }
        }
      },
      utils: {
        pxToNum: (val) => {
          return parseFloat(val.replace('px', ''))
        },
        numToPx: (val) => {
          return val + 'px'
        }
      }
    }
  },
  watch: {
    code: {
      immediate: true,
      handler (val, old) {
        if (!val) {
          return
        }
        this.mapImgLoad = false
        this.getGeoJson(val).then(json => {
          echarts.registerMap('map', json)
          this.mapRender()
        })
      }
    },
    eoption: {
      handler (val, old) {
        this.chart.setOption(val)
      }
    }
  },
  computed: {
    conf () {
      return this.mapConf[this.code]
    },
    // 地图容器style
    mapWrapStyle () {
      if (!this.roam) {
        return {
          width: '100%',
          height: '100%'
        }
      }
      let more = 2 // 解决由于echart地图变形导致的边缘截断
      return {
        width: `${(this.roamScaleMax + more) * 100}%`,
        height: `${(this.roamScaleMax + more) * 100}%`
      }
    }
  },
  methods: {
    // 获取geojson
    getGeoJson (code) {
      return request({
        url: `${location.origin}/map/geoJson/${code}.json`,
        method: 'get'
      })
    },
    async mapRender () {
      if (!this.code) { return }

      let container = this.$refs.container
      // 地图容器
      let mapWrap = this.$refs.mapWrap
      mapWrap.style.top = `${container.offsetHeight/2 - mapWrap.offsetHeight/2}px`
      mapWrap.style.left = `${container.offsetWidth/2 - mapWrap.offsetWidth/2}px`

      // 地图图片
      let mapImg = this.$refs.mapImg
      mapImg.src = await this.loadMapImg()
      mapImg.style.width = `${this.conf.backgroundSize}px`
      mapImg.style.marginLeft = `${-this.conf.backgroundSize / 2 + this.conf.relative.left}px`
      mapImg.style.marginTop = `${-this.conf.backgroundSize / this.conf.mapWhRatio / 2 + this.conf.relative.top}px`


      let option = {
        geo: {
          map: 'map',
          roam: false,
          aspectScale: .8,
          zoom: 1,
          center: this.conf.econf.center,
          layoutCenter: ['50%', '50%'],
          layoutSize: this.conf.econf.layoutSize,
          label: {
            // show: true,
            color: 'rgba(1,250,255,1)',
            fontSize: 14
          },
          itemStyle: {
            areaColor: 'transparent',
            // areaColor: 'rgba(255,255,255,0.5)',
            borderColor: 'rgba(12,253,255,.5)'
          },
          emphasis: {
            label: {
              show: false,
              color: 'rgba(1,250,255,1)',
              fontSize: 14
            },
            itemStyle: {
              areaColor: 'transparent',
              borderColor: 'rgba(12,253,255,.5)'
            },
          }
        }
      }
      if (this.eoption) {
        Object.assign(option, this.eoption)
      }
      this.chart.setOption(option)

      this.resize()
    },
    // 加载地图图片
    loadMapImg () {
      let that = this
      return new Promise((resolve, reject) => {
        let img = document.createElement('img')
        img.src = `/map/images/${that.code}.png`
        img.onload = function() {
          resolve(img.src)
          that.mapImgLoad = true
        }
        img.onerror = function(err) {
          reject(err)
          that.mapImgLoad = true
        }
      })
    },
    // 自适应大小方法
    resize () {
      let conf = this.conf
      let container = this.$refs.container
      let containerWhRatio = container.offsetWidth / container.offsetHeight // 容器宽高比
      let scaleRatio = 1 // 缩放比
      if (conf.mapWhRatio >= containerWhRatio) {
        // 以宽度为准计算缩放大小
        scaleRatio =  container.offsetWidth / this.container.initial.width // 缩放比
      } else {
        // 以高度为准计算缩放大小(初始高度/当前容器高度)
        scaleRatio = container.offsetHeight / (this.container.initial.width / conf.mapWhRatio) // 缩放比
      }

      // 地图容器
      let mapWrap = this.$refs.mapWrap
      mapWrap.style.top = `${container.offsetHeight/2 - mapWrap.offsetHeight/2}px`
      mapWrap.style.left = `${container.offsetWidth/2 - mapWrap.offsetWidth/2}px`

      // 地图图片容器
      let mapImg = this.$refs.mapImg
      let imgWidth = conf.backgroundSize * scaleRatio
      mapImg.style.width =  `${imgWidth}px`
      mapImg.style.marginLeft = `${-imgWidth / 2 + this.conf.relative.left * scaleRatio}px`
      mapImg.style.marginTop = `${-imgWidth / this.conf.mapWhRatio / 2 + this.conf.relative.top * scaleRatio}px`
      // echarts地图相关
      this.chart.resize()
      this.chart.setOption({
        geo: {
          layoutSize: conf.econf.layoutSize * scaleRatio,
        }
      })
      this.scaleRatio = 1
    },
    // 缩放 ratio:缩放比率
    scale (ratio) {
      if (!this.roam) {return}
      if ((ratio > 1 && this.scaleRatio >= this.roamScaleMax) || (ratio < 1 && this.scaleRatio <= this.roamScaleMin)) {
        return
      }
      let conf = this.conf
      let mapImg = this.$refs.mapImg
      if (!mapImg) {return}
      this.scaleRatio = this.scaleRatio + (ratio -1)
      // 地图容器相关
      let width = mapImg.offsetWidth * ratio
      mapImg.style.width =  `${width}px`
      let relative = {
        left: this.utils.pxToNum(mapImg.style.marginLeft),
        top: this.utils.pxToNum(mapImg.style.marginTop)
      }
      mapImg.style.marginLeft = `${relative.left * ratio}px`
      mapImg.style.marginTop = `${relative.top * ratio}px`
      // echarts地图相关
      // this.chart.resize() // 此处为了画布大小自适应
      let chartOption = this.chart.getOption()
      this.chart.setOption({
        geo: {
          layoutSize: chartOption.geo[0].layoutSize * ratio
        }
      })

    },
    // 移动
    move (x, y) {
      if (!this.roam) {return}
      let mapWrap = this.$refs.mapWrap
      if (!mapWrap) {return}

      let oldPos = {
        top: this.utils.pxToNum(mapWrap.style.top),
        left: this.utils.pxToNum(mapWrap.style.left)
      }
      // 位置
      let postion = {
        top: oldPos.top + y / this.containerEmapHeightRatio,
        left: oldPos.left + x,
      }
      mapWrap.style.top =  `${postion.top}px`
      mapWrap.style.left =  `${postion.left}px`
    },
    // 屏幕宽度监听
    onWinResize: throttle(function () {
      this.resize()
    }, 200),
    // 事件绑定
    _eventInit () {
      // if (!this.roam) { return }
      this._eventMapDragInit()
      this._eventMapMouseWheelInit()
    },
    _eventMapDragInit () {
      let that = this
      let start = {
        x: 0,
        y: 0
      }
      let fn = {
        mousedown: function(e) {
          start.x = e.clientX
          start.y = e.clientY
          document.addEventListener('mousemove', fn.mousemove)
          document.addEventListener('mouseup', fn.mouseup)
        },
        mousemove: throttle(function(e) {
          let diff = {
            x: e.clientX - start.x,
            y: e.clientY - start.y
          }
          that.move(diff.x, diff.y)
          start.x = e.clientX
          start.y = e.clientY
        }, 70),
        mouseup: function() {
          document.removeEventListener('mousemove', fn.mousemove)
          document.removeEventListener('mouseup', fn.mouseup)
        }
      }
      let container = this.$refs.container
      container.addEventListener('mousedown', fn.mousedown)

      // 解绑事件
      this.$once('hook:beforeDestroy', function() {
        container.removeEventListener('mousedown', fn.mousedown)
      })
    },
    _eventMapMouseWheelInit () {
      let that = this
      let container = that.$refs.container
      //判断鼠标滚轮滚动方向
      if (container.addEventListener) {
        //FF,火狐浏览器会识别该方法
        container.addEventListener('DOMMouseScroll', wheel, false);
      }
      container.onmousewheel = wheel;//W3C
      //统一处理滚轮滚动事件
      function wheel(e){
        let delta = 0;
        if (!e) e = window.event;
        if (e.wheelDelta) {//IE、chrome浏览器使用的是wheelDelta，并且值为“正负120”
          delta = e.wheelDelta/120;
          if (window.opera) {delta = -delta;}//因为IE、chrome等向下滚动是负值，FF是正值，为了处理一致性，在此取反处理
        } else if (e.detail) {//FF浏览器使用的是detail,其值为“正负3”
          delta = -e.detail/3;
        }
        if (delta) {
          handle(delta);
        }
        if (e.stopPropagation) e.stopPropagation()
        else e.cancelBubble = true
        if (e.preventDefault) e.preventDefault()
        else e.returnValue = false
      }
      let handle = throttle(function(delta) {
        if (delta < 0){//向下滚动
          that.scale(0.85)
        } else {//向上滚动
          that.scale(1.15)
        }
      }, 70)

      // 解绑事件
      this.$once('hook:beforeDestroy', function() {
        if (container.addEventListener) {
          //FF,火狐浏览器会识别该方法
          container.removeEventListener('DOMMouseScroll', wheel);
        }
        container.onmousewheel = null
      })
    }
  },
  mounted () {
    this.chart = echarts.init(this.$refs.emap, null, {
      // renderer: 'svg'
    })
    this._eventInit()
  },
  beforeDestroy () {
    this.chart.clear();
    this.chart = null;
    // window.removeEventListener('resize', this.onWinResize)
  }
}
</script>

<style lang="scss" scoped>
.ucap-map {
  position: relative;
  margin: 0;
  height: 100%;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;

  &_wrap {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    opacity: 1;
    transition: opacity .2s linear;
    &--fade-out {
      opacity: 0;
    }
  }

  &_img {
    position: absolute;
    top: 50%;
    left: 50%;
  }
  &_emap {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    transform: rotate3d(1,0,0, 30deg);
  }

  &_control {
    position: absolute;
    top: 0;
    right: 0;
  }
}
.tooltip {
  padding: 20px;
  color: red;
  border: 1px solid red;
  z-index: 99999;
}
</style>

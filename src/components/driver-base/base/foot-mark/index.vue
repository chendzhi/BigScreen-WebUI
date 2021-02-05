<template>
  <div class="foot-mark" ref="footMark">
    <custom-map ref="map" :code="map.code" :eoption="map.eoption" :roam="!isFullScreen"></custom-map>
    <div class="date-filter">
      <el-dropdown
        :class="['el-dropdown-footmark', {'disabled' : !date.year.options.length}]"
        split-button
        size="mini"
        trigger="click"
        @click="onWholeYearClick"
        @command="onYearItemClick">
        {{date.year.val || parseTime(new Date(), '{y}')}}
        <el-dropdown-menu class="el-dropdown-menu-footmark" slot="dropdown">
          <el-dropdown-item v-for="item in date.year.options" :command="item.val" :key="item.val">{{item.label}}</el-dropdown-item>
          <el-dropdown-item v-show="!date.year.options.length" key="nodata" disabled>暂无年份</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <ul class="month-list">
        <li
          :class="{
            'active': item.val === date.month.val,
            'no-times': !item.times,
            'max-times': item.isMaxTimes
          }"
          v-for="item in date.month.options"
          :key="item.val"
          @click="onMonthItemClick(item.val)">
          {{item.label}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import './style.scss'
import { mapGetters } from 'vuex'
import mapConf from '@/config/map'
import enumConf from '@/config/enum'
import { param, parseTime } from  '@/utils'
import mapUtils from  '@/utils/map'
import throttle from 'lodash/throttle'
import CustomMap from '@/components/base/map'
import { queryData, queryYears } from "@/api/newDriverCabin/index"
export default {
  components: {
    CustomMap
  },
  props: {
    accessScope: {
      type: Number,
      default: 1
    },
    isFullScreen: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      map: {
        code: '100000',
        eoption: {},
        tooltipCarouselTimer: null
      },
      date: {
        year: {
          val: '',
          options: []
        },
        month: {
          val: new Date().getMonth()+1,
          options: []
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      user: 'user',
      currentLeader: 'getterCurrentLeader'
    })
  },
  watch: {
    isFullScreen (val) {
      this.onFullScreenChange(val)
    },
    // 访问范围：1全国、2省内、3市内
    accessScope: {
      immediate: true,
      handler (val, old) {
        this.dataInit()
      }
    },
    // 领导变化
    'currentLeader.leaderName' (val) {
      this.dataInit()
    }
  },
  methods: {
    parseTime,
    // 初始化 1.重置年 2.重置月
    async dataInit () {
      // 范围
      if (this.accessScope === 1) {
        this.map.code = '100000'
      } else {
        this.map.code = this.user.organCode
      }
      // 年月
      this.date.year.options = await this.getYearOptions()
      if (!this.date.year.options.length) {
        this.date.year.val = 0
        this.date.month.options = await this.getMonthOptionsByYear()
      } else {
        this.date.year.val = this.date.year.options[0].val
        this.date.month.options = await this.getMonthOptionsByYear(this.date.year.val)
      }

      this.getData()
    },
    getYearOptions () {
      return new Promise((resolve, reject) => {
        // 加工年份选项数据
        let toYearOptions = (data) => {
          if (!data || !data.length) {
            return []
          }
          let options = []
          data.sort((a, b) => b - a) // 年份倒序
          data.forEach(val => {
            options.push({
              label: val,
              val: val
            })
          })
          return options
        }

        queryYears({
          tn: 14,
          functionName: '足迹-查询年份',
          queryParam: `leader_name=${this.currentLeader.leaderName}`
        }).then (data => {
          resolve(toYearOptions(data))
        }).catch(err => {
          resolve([])
        })

      })
    },
    getMonthOptionsByYear (year) {
      return new Promise((resolve, reject) => {

        let defaultOptions = []
        for (let month = 1; month <= 12; month++) {
          defaultOptions.push({
            label: month,
            val: month,
            times: 0
          })
        }

        if (!year) {
          resolve(defaultOptions)
          return
        }

        // 加工月份选项数据
        let toMonthOptions = (data) => {
          let months = []
          let obj = {}
          data.forEach(item => {
            if (!obj[item.access_month]) { // 未组装月份
              months.push({
                label: item.access_month,
                val: item.access_month,
                times: item.access_frequency // 出行次数
              })
              obj[item.access_month] = true
            } else { // 已组装月份
              let month = months.find(m => m.val === item.access_month)
              month.times += item.access_frequency // 累加出行次数
            }
          })
          let arr = [1,2,3,4,5,6,7,8,9,10,11,12]
          // 月份补全
          arr.forEach(val => {
            if(!obj[val]) {
              months.push({
                label: val,
                val: val,
                times: 0
              })
            }
          })
          // 找最大文章数月份
          months.sort((a,b) => b.times - a.times)[0].isMaxTimes = true
          // 月份排序
          months.sort((a,b) => a.val - b.val)
          return months
        }

        let queryParam = param({
          access_scope: this.accessScope, // 访问范围：1全国、2省内、3市内
          year: year // 年份
        }).replace(/&/g,',')

        // 中文不需要转码
        queryParam = `leader_name=${this.currentLeader.leaderName},${queryParam}`
        queryData({
          tn: '14',
          functionName: '足迹-供月份状态初始化使用',
          queryParam
        }).then (data => {
          if (!data || !data.length) {
            resolve(defaultOptions)
          } else {
            resolve(toMonthOptions(data))
          }
        }).catch(err => {
          resolve(defaultOptions)
        })
      })
    },
    getData () {
      // 无年份
      if (!this.date.year.val) {
        this.map.eoption = this._getMapEOptionByData([]) || {}
        return
      }

      let queryParam = param({
        access_scope: this.accessScope, // 访问范围：1全国、2省内、3市内
        year: this.date.year.val ? this.date.year.val : '', // 年份
        access_month: this.date.month.val ? this.date.month.val : '' // 月份
      }).replace(/&/g,',')

      // 中文不需要转码
      queryParam = `leader_name=${this.currentLeader.leaderName},${queryParam}`

      queryData({
        tn: '14',
        functionName: '足迹',
        queryParam
      }).then(data => {
        this.map.eoption = this._getMapEOptionByData(data)
      })
    },
    // 屏幕宽度监听
    onWinResize: throttle(function () {
      this.$refs.map.resize()
    }, 200),
    // 年选项点击
    async onYearItemClick (val) {
      this.date.year.val = val
      this.date.month.options = await this.getMonthOptionsByYear(val)
      this.getData()
    },
    // 全年点击
    onWholeYearClick () {
      if (!this.date.year.val) {return} // 无年份不响应
      this.date.month.val = 0
      this.getData()
    },
    // 月选项点击
    onMonthItemClick (val) {
      this.date.month.val = val
      this.getData()
    },
    // 全屏状态变化回调
    onFullScreenChange (val) {
      // 全屏：不轮播，tooltip不appendbody 非全屏反之
      if (val) {
        this.map.eoption = {
          tooltip: {
            appendToBody: false
          }
        }
        this.tooltipCarouselDisable()
      } else {
        this.map.eoption = {
          tooltip: {
            appendToBody: false
          }
        }
        this.tooltipCarouselEnable()
      }
    },
    // 根据data获取地图配置参数
    _getMapEOptionByData (data) {
    /*
      规则描述：

      数据范围省内|市内
        查询年月逻辑：
          数据中匹配到
            显示蓝点
            显示地名
            显示迁徙线
            显示数量气泡
            有出行次数 点击显示详情弹框
          未匹配
            显示蓝点
            显示地名

        查询年逻辑：
          匹配到（注：年数据同一地点不同月份会有多条数据）
            显示蓝点
            显示地名
            显示迁徙线
            显示数量气泡（数量为不同月份累加）
            有出行次数 点击显示详情弹框 详情为不同月份详情累加
          未匹配
            显示红点
            显示地名


      数据范围国内
        查询年月逻辑：
          数据中匹配到
            显示蓝点
            显示地名
            显示迁徙线
            显示数量气泡
            有出行次数 点击显示详情弹框
          未匹配
            显示蓝点

        查询年逻辑：
          匹配到（注：年数据同一地点不同月份会有多条数据）
            显示蓝点
            显示地名
            显示迁徙线
            显示数量气泡（数量为不同月份累加）
            有出行次数 点击显示详情弹框 详情为不同月份详情累加
          未匹配
            显示蓝点
      */
      if (!data || !data.length) { data = []}
      let symbol = {
        plane: 'path://M995.017501 725.011744v-85.011201l-395.108875-256.482656V85.495668A87.426291 87.426291 0 0 0 511.999316 0.001449a87.90931 87.90931 0 0 0-87.909309 85.494219v298.022219L28.981132 640.000543v85.011201l395.108875-127.999819v239.094001l-131.863964 102.399855v85.011201L511.999316 938.505781l219.773274 85.011201v-85.494219l-131.863964-101.916837v-239.094001z',
        bar: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAABDCAYAAABQmx+pAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RjVFRDAzMDMxQTYyMTFFQkI1MEFGMkNDRkJDNjMzNTMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RjVFRDAzMDQxQTYyMTFFQkI1MEFGMkNDRkJDNjMzNTMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGNUVEMDMwMTFBNjIxMUVCQjUwQUYyQ0NGQkM2MzM1MyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGNUVEMDMwMjFBNjIxMUVCQjUwQUYyQ0NGQkM2MzM1MyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Phn2EZUAAAGwSURBVHjalJVNUsMwDIVr2WnzA2uuxQm4DZdixYFghgUzFJrGWKleeFHjztAZ14k+PUWWEzk8jM+y+/tlm4P+MdgxAAxkCOyUbihnGP4D4RCEoDDQi2TGbGPl4GHmKAwnUgmU0WBwFYqAE5UPSkkWWuGZlBHKRIoJIQEbCsswKdyT8UywUXgoY3S71AC2ZZycUuEeMJryZGp9VKewK7lGK7+Yo8JW4VBAcqXTaP1FeTFMBDuEvaMqYRkdlIMZT7ScKzg6OCCs1vZo61yF7e15R5tjcW1LrA5h1fhlyqYAtd0j7EhlxPJaKNX4SbBHQgq/zfvHYAtlhxtLqrFtHADhcDClznuxi9YUeDNmGyBAYidsbEMg4jURp4hW29kmtPuBrgXfJ27EOSRWRRchiOsoQm9i5FDck1bK6D9cncU1qMARABNljcYhstEwlo7CmUbfajjDiZpG2FrnqvfJxhKWjH0zzjVlduEnvxvc55cKZdfalgMgVw4C4VCc7RxNKm38qnVXIWe5CW8qgz/Pqoccst3VktrKNnuYa0fkm3PA/K7wsYyXMj4M6PxaxtOvAAMAg1lTaukgLIcAAAAASUVORK5CYII=',
        drop: 'path://M296.2 278.8c0-29.7 5.7-57.4 17.1-83.2 11.4-25.8 26.9-48.5 46.5-68.1 19.7-19.6 42.4-35.2 68.2-46.5s53.6-17 83.3-17c29.8 0 57.7 5.7 84 17 26.2 11.3 49.2 26.9 68.9 46.5 19.7 19.6 35.2 42.4 46.6 68.1s17.1 53.5 17.1 83.2c0 20.1-5.2 50.9-15.70000001 92.4s-23.8 87.5-39.99999999 138.19999999c-16.1 50.7-33.7 102.7-52.5 155.90000001s-36.3 101.7-52.4 145.4-34.8 93.4-55.8 149.3c-21-55.9-39.6-105.70000001-55.8-149.3-16.1-43.7-33.5-92.20000001-51.8-145.4-18.4-53.3-35.7-105.2-51.8-155.9s-29.5-96.70000001-40-138.2c-10.5-41.5-15.9-72.3-15.9-92.4z'
      }
      let color = {
        red: 'rgba(227,52,31,1)',
        blue: 'rgba(34,244,245,1)',
        green: '#17f387'
      }
      let isInner = this.accessScope === 2 || this.accessScope === 3 // 数据范围是否内部 省内|市内
      /**
        出发点行政编码:
        省市内以接口数据出发点为准（所有数据出发点都一样 取第一条数据出发点即可）
        国内以当前用户所属组织机构编码为准
        如果是部委以北京作为出发点
       */
      let fromOrganCode = ''
      if (isInner) {
        fromOrganCode = data.length > 0 ? data[0].departure_code : ''
      } else {
        fromOrganCode = this.user.organType === enumConf.common.organType.department ? '110000' : this.user.organCode
      }
      let from = mapUtils.getModel(fromOrganCode)
      let points = [{
        name: from.name,
        symbolSize: 10,
        value: from.coord,
        label: {
          show: true,
          // position: 'left'
        },
        itemStyle: {
          color: color.blue
        }
      }]
      let markPoints = []
      let lines = []
      let regions = mapUtils.getChild(this.map.code)
      let isWholeYear = this.date.month.val === 0 // 是否查询的全年数据
      regions.forEach(to => {
        let isFrom = to.code === from.code // 是否为出发点
        let resultList = data.filter(m => m.access_code === to.code)
        if (!resultList.length && !isFrom) {
          points.push({
            name: to.name,
            value: to.coord,
            symbolSize: 5,
            itemStyle: {
              color: (isWholeYear && isInner) ? color.red : color.blue
            },
            label: {
              show: isInner ? true : false
            },
            ex_showToolTip: false
          })
          return
        }


        let details = [] // 文章统计
        let accessTotal = 0 // 出行总次数
        resultList.forEach(item => {
          let arr = JSON.parse(item.details ? item.details : '[]')
          details.push(...arr)
          accessTotal += item.access_frequency || 0
        })
        details.sort((a, b) => {return b.release_date - a.release_date}) // 发布时间倒序
        let hasDetails = details.length > 0

        if (!isFrom) {
          // 组装点
          points.push({
            name: to.name,
            value: to.coord,
            symbolSize: 5,
            label: {
              show: true
            },
            itemStyle:{
              color: (!hasDetails && isWholeYear) ? color.red : color.blue
            },
            ex_showToolTip: hasDetails,
            ex_details: details
          })
          // 组装线
          lines.push({
            name: to.name,
            coords: [from.coord, to.coord],
            ex_showToolTip: hasDetails,
            ex_details: details
          })
        }

        // 组装柱状及数量气泡
        if (accessTotal) {
          markPoints.push(
            {
              name: to.name,
              coord: to.coord,
              // value: details.length,
              value: accessTotal,
              ex_showToolTip: hasDetails,
              symbol: symbol.bar,
              symbolSize: isFrom ? [20, 60] : [12, 60], // 如果是出发点柱形尺寸加宽
              symbolOffset: [0, -28],
              label: {
                // show: false,
                position: 'insideBottom',
                color: '#05496e',
                fontSize: 14
              },
              ex_showToolTip: true,
              ex_details: details
            },
            // {
            //   name: to.name,
            //   coord: to.coord,
            //   value: details.length,
            //   symbolSize: 30,
            //   // symbolOffset: [20, 5],
            //   itemStyle:{
            //     color: color.green
            //   },
            //   label: {
            //     color: '#05496e',
            //     fontSize: 14
            //   },
            //   ex_showToolTip: true,
            //   ex_details: details
            // }
          )
        }
      })
      let option = {
        tooltip : {
          extraCssText: 'z-index: 99;',
          appendToBody: true,
          trigger: 'item',
          triggerOn: 'click',
          enterable: true,
          confine: true,
          backgroundColor: 'none',
          formatter: function(params) {
            if(params.data.ex_showToolTip) {
              let limit = 3
              let list = params.data.ex_details
              let html = {
                detail: (function(){
                  let h = ''
                  list.forEach((item, index) => {
                    h += `<li style="display: ${index >= limit ? 'none' : 'block'};">
                      <a class="article" href="${item.url}" target="_blank">
                        <span class="article_title">${item.title}</span>
                        <span class="article_pubtime">${parseTime(item.release_date, '{m}-{d}')}</span>
                      </a>
                    </li>`
                  })
                  return h
                })()
              }
              return `<div class="map-tooltip-footmark">
                <div class="map-tooltip-footmark_head">
                  <span class="map-tooltip-footmark_head_title">${params.data.name}-活动足迹${list.length}条</span>
                  <a style="display: ${list.length > limit ? 'inline-block' : 'none'};" class="map-tooltip-footmark_head_more" href="javascript:void(0)" onclick="ex_footMark.events.onMoreClick()">更多</a>
                </div>
                <div class="map-tooltip-footmark_body">
                  <ul class="article-list">
                    ${html.detail}
                  </ul>
                </div>
              </div>`
            }
          },
          position: function (point, params, dom, rect, size) {
            if (!params.data.ex_showToolTip) {
              return
            }
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
        series: [
          {
            // zlevel: 2,
            type: 'effectScatter',
            coordinateSystem: 'geo',
            showEffectOn: 'render',
            rippleEffect: {
              period: 5,
              scale: 5,
              brushType: 'stroke'
            },
            hoverAnimation: true,
            data: points,
            markPoint: {
              data: markPoints
            },
            label: {
              // show: true,
              position: 'bottom',
              formatter: function(params) {
                let data = params.data
                let fmt = `{name|${data.name}}`
                return fmt
              },
              rich: {
                name: {
                  color: 'rgba(1,250,255,1)',
                  lineHeight: 20,
                  fontSize: 16
                }
              }
            }
          },
          {
            name: 'line-series',
            type: 'lines',
            zlevel: 2,
            coordinateSystem: 'geo',
            effect: {
              show: true,
              constantSpeed: 50,
              // period: 3, //箭头指向速度，值越小速度越快
              trailLength: 0.02, //特效尾迹长度[0,1]值越大，尾迹越长重
              symbol: isInner ? symbol.drop : symbol.plane, //箭头图标
              symbolSize: isInner ? [8,14] : 16, //图标大小
            },
            lineStyle: {
              type: 'dashed',
              color: '#17f387',
              width: 2, //线条宽度
              curveness: .2 //尾迹线条曲直度
            },
            data: lines
          }
        ]
      }
      return option
    },
    // 地图自适应
    mapResize () {
      this.$refs.map.resize()
    },
    // tooltip弹框-启用
    tooltipCarouselEnable () {
      let that = this
      let chat = that.$refs.map.chart
      let index = 0
      let isMouseoverClick = false // 标识是否获取光标下点击了 解决点击显示tooltip后鼠标移动就消失问题
      let intervalFn = () => {
        that.map.tooltipCarouselTimer && clearInterval(that.map.tooltipCarouselTimer)
        return setInterval(() => {
          let option = chat.getOption()
          if (!option.series || !option.series.length) {return}
          let data = option.series[0].data.filter(item => item.ex_showToolTip)
          if (!data.length) {return}
          if(index >= data.length) {
            index = 0
          }
          chat.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            name: data[index].name
          })
          index++;
        },5000)
      }
      that.map.tooltipCarouselTimer = intervalFn()

      let footMarkEvent = {
        click: function (e) {
          isMouseoverClick = true
        },
        mouseover: function (e) {
          that.map.tooltipCarouselTimer && clearInterval(that.map.tooltipCarouselTimer)
          if (isMouseoverClick) {return}
          chat.dispatchAction({
            type: 'hideTip'
          })
        },
        mouseout: function (e) {
          that.map.tooltipCarouselTimer = intervalFn()
          isMouseoverClick = false
          chat.dispatchAction({
            type: 'hideTip'
          })
        }
      }

      // this.$refs.footMark.addEventListener('click', footMarkEvent.click)
      // this.$refs.footMark.addEventListener('mouseover', footMarkEvent.mouseover)
      // this.$refs.footMark.addEventListener('mouseout', footMarkEvent.mouseout)

      chat.on('click', footMarkEvent.click)
      chat.on('mouseover', footMarkEvent.mouseover)
      chat.on('globalout', footMarkEvent.mouseout)

    },
    // tooltip弹框-禁用
    tooltipCarouselDisable () {
      let chat = this.$refs.map.chart
      chat.off('click')
      chat.off('mouseover')
      chat.off('globalout')
      chat.dispatchAction({
        type: 'hideTip'
      })
      this.map.tooltipCarouselTimer && clearInterval(this.map.tooltipCarouselTimer)
    }
  },
  mounted () {
    window.addEventListener('resize', this.onWinResize)
    this.tooltipCarouselEnable()
    // 扩展足迹模块
    window.ex_footMark = {
      events: {
        // tooltip弹框 更多点击
        onMoreClick: function (e) {
          let more = document.querySelector('.map-tooltip-footmark_head_more')
          let liArr = document.querySelectorAll('.map-tooltip-footmark .article-list li')
          more.style.display = 'none'
          liArr.forEach(item => {
            item.style.display = 'flex'
          })
        }
      }
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onWinResize)
    delete window.ex_footMark
    this.tooltipCarouselDisable()
  }
}
</script>

<style lang="scss" scoped>
.foot-mark {
  height: 100%;
  .date-filter {
    display: flex;
    justify-content: center;
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    padding-bottom: 12px;
    .el-dropdown-footmark /deep/ {
      margin-right: 4px;
      .el-button {
        padding: 0 15px;
        line-height: 28px;
        background-color: rgba(17,56,187,0.3);
        color: #fff;
        border-color:#2b8de5;
        z-index: 0;
      }
      .el-dropdown__caret-button {
        padding: 0 5px;
      }
      .el-dropdown__caret-button.el-button--default::before {
        top: 0;
        bottom: 0;
        background-color: rgba(0,0,0,.2);
      }

    }
    .el-dropdown-footmark.disabled /deep/ {
      .el-button {
        color: #0d8dce;
        border-color:#08206b;
        box-shadow: inset 0 0 8px #08206b;
      }
    }

    .month-list {
      overflow: hidden;
      font-size: 12px;
      &>li {
        float: left;
        width: 47px;
        height: 30px;
        cursor: pointer;
        text-align: center;
        line-height: 30px;
        border: 1px solid #2b8de5;
        border-radius: 3px;
        box-shadow: inset 0 0 8px #08206b;
        color: #fff;
        background-color: rgba(17,56,187,.3);
        &.active {
          background-color: #52f7ff!important;
          opacity: 1!important;
        }
        &.max-times {
          width: 75px;
          background-color: #b84b6a;
        }
        &.no-times {
          border-color: #08206b;
          box-shadow: inset 0 0 8px #08206b;
          color: #0d8dce;
        }
      }
    }
  }
}

@media only screen and (max-width: 1300px) {
  .foot-mark {
    .date-filter {
      /deep/ .el-dropdown {
        margin-right: 4px;
        .el-button {
          line-height: 21px;
        }
      }
      .month-list {
        &>li {
          width: 30px;
          height: 22px;
          line-height: 22px;
          &.max-times {
          width: 60px;
          background-color: #b84b6a;
        }
        }
      }
    }
  }
}
</style>

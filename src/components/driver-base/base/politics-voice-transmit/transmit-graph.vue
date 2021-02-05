<template>
  <div class="wrap">
    <div class="control">
      <ul class="layout-setting">
        <template v-for="item in layout.options">
          <li
            :key="item.val"
            v-if="!item.disabled"
            :class="{'active': layout.val === item.val}"
            @click="onLayoutChange(item.val)">
            <svg-icon icon-class="tree-radial" v-show="item.val === 'radial'"></svg-icon>
            <svg-icon icon-class="tree-lr" v-show="item.val === 'LR'"></svg-icon>
            <svg-icon icon-class="tree-tb" v-show="item.val === 'TB'"></svg-icon>
          </li>
        </template>
      </ul>
    </div>
    <chart class="chart" :options="options" autoresize />
  </div>
</template>
<script>
import echarts from "echarts"
import enumConf from '@/config/enum'
import mapUtils from '@/utils/map'
import { mapGetters } from 'vuex'
export default {
  props: {
    model: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      options: {},
      // 布局选项
      layout: {
        val: 'TB',
        options: [
          {
            label: '上到下',
            val: 'TB',
            disabled: false
          },
          {
            label: '左到右',
            val: 'LR',
            disabled: false
          },
          {
            label: '环形',
            val: 'radial',
            disabled: false
          }
        ]
      },
    };
  },
  computed: {
    ...mapGetters(['user'])
  },
  mounted () {
    this.setOptions();
  },
  methods: {
    setOptions () {
      let baseData = this._convertTreeBaseData(this.model)
      // 径向布局需要至少两级 一级会报错
      if (this.layout.val === 'radial' && (!baseData[0].children || !baseData[0].children.length)) {
        this.layout.options.find(item => item.val === 'radial').disabled = true
        this.layout.val = 'LR'
      }
      let data = this._convertTreeDataByLayout(baseData)

      let option = {
        series: [{
          type: 'tree',
          orient: this.layout.val === 'radial' ? '' : this.layout.val,
          layout: this.layout.val === 'radial' ? 'radial' : 'orthogonal', // orthogonal radial
          roam: true,
          // top: '15%',
          // left: '15%',
          bottom: 100,
          symbol: 'circle',
          edgeShape: 'curve', // curve polyline
          itemStyle: {
            color: 'rgba(24,98,205,.9)',
            borderColor: '#1a7cdf',
            borderWidth: 1
          },
          lineStyle: {
            color: '#1a7cdf',
            width: 1,
            curveness: 0.8
          },
          label: {
            color: '#01f5fd',
            formatter: function(params) {
              let model = params.data
              let fmt = []
              if(model.level === 1 || model.level === 3) {
                model.detail.forEach(item => {
                  fmt.push(`{name|${item.name}：}{val|${item.val}/${item.count}}`)
                })
              } else if (model.level === 2) {
                fmt.push(`{name|${model.name}}`)
              }
              return fmt.join('\n')
            },
            rich: {
              name: {
                color: '#fff',
                lineHeight: 25,
                fontSize: 14
              },
              val: {
                color: '#02f7fc',
                lineHeight: 25,
                fontSize: 14
              }
            }
          },
          leaves: {
            label: {
              position: 'inside'
            }
          },
          data
        }]
      }
      this.options = option
    },
    onLayoutChange (val) {
      this.layout.val = val
      this.setOptions()
    },
    // 转换树基础数据
    _convertTreeBaseData (model) {
      if (!model.details) {return []}
      let user = this.user
      let isZxs = mapUtils.isZxs(user.organCode) // 是否直辖市

      let root = {
        name: this.user.organName,
        level: 1,
        detail: []
      }
      if (user.organType === enumConf.common.organType.province && !isZxs) { // 省
        root.detail.push({
          name: '省直',
          val: this.model.directly_under_spread,
          count: this.model.directly_under_number
        },{
          name: '市州',
          val: this.model.citiesn_spread,
          count: this.model.citiesn_number
        })
      } else { // 直辖市|地市
        root.detail.push({
          name: '市直',
          val: this.model.directly_under_spread,
          count: this.model.directly_under_number
        },{
          name: '区县',
          val: this.model.details.reduce((preval, item) => { return preval + item.sub_organ_spread }, 0),
          count: this.model.details.reduce((preval, item) => { return preval + item.sub_organ_number }, 0),
        })
      }

      root.children = model.details.map(item => {
        let m = {
          name: item.organ_name,
          level: 2,
          children: []
        }
        if (user.organType === enumConf.common.organType.province && !isZxs) { // 省
          m.children.push({
            level: 3,
            detail: [{
              name: '市直',
              val: item.directly_spread,
              count: item.directly_number
            }]
          },{
            level: 3,
            detail: [{
              name: '区县',
              val: item.sub_organ_spread,
              count: item.sub_organ_number
            }]
          })
        } else { // 直辖市|地市
          m.children.push({
            level: 3,
            detail: [{
              name: '县直',
              val: item.directly_spread,
              count: item.directly_number
            }]
          })
        }
        return m
      })

      return [root]
    },
    // 转换树数据by布局
    _convertTreeDataByLayout (baseData) {
      let data = JSON.parse(JSON.stringify(baseData))

      if (this.layout.val === 'radial') { // 径向
        // 一级加工
        data.forEach(root => {
          root.symbolSize = [100, 100]
          root.label = {
            position: 'inside',
            rotate: 0
          }
          if (!root.children || !root.children.length) {return}
          // 二级加工
          root.children.forEach(itemLevel2 => {
            itemLevel2.label = {
              position: 'inside'
            }
          })
        })
      } else if (this.layout.val === 'TB') { // 正交-上下
        // 一级加工
        data.forEach(root => {
          root.symbol = 'react'
          root.symbolSize = [110, 60]
          root.label = {
            position: 'inside'
          }

          if (!root.children || !root.children.length) {return}
          // 二级加工
          root.children.forEach(itemLevel2 => {
            itemLevel2.label = {
              rotate: 5
            }

            if (!itemLevel2.children || !itemLevel2.children.length) {return}
            // 三级加工
            itemLevel2.children.forEach(itemLevel3 => {
              itemLevel3.label = {
                // position: 'bottom',
                rotate: 25
              }
            })

          })
        })
      }
      else { // 正交-左右
        // 一级加工
        data.forEach(root => {
          root.symbol = 'react'
          root.symbolSize = [110, 60]
          root.label = {
            position: 'inside'
          }

          if (!root.children || !root.children.length) {return}
          // 二级加工
          root.children.forEach(itemLevel2 => {
            if (!itemLevel2.children || !itemLevel2.children.length) {return}
            // 三级加工
            itemLevel2.children.forEach(itemLevel3 => {
              itemLevel3.label = {
                position: 'right'
              }
            })

          })
        })
      }

      return data
    }
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  position: relative;
  width: 100%;
  height: 100%;
  .control {
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    padding: 10px 20px;
    flex-shrink: 0;
    flex-grow: 0;
    text-align: center;
    z-index: 10;
    .layout-setting{
      display: inline-block;
      border: 1px solid #549add;
      border-radius: 2px;
      background-color: #113691;
      li {
        float: left;
        height: 30px;
        width: 30px;
        line-height: 30px;
        text-align: center;
        color: #549add;
        font-size: 18px;
        cursor: pointer;
        &:hover, &.active {
          background-color: #549add;
          color: #1a379e;
        }
      }
    }
  }
  .chart {
    flex-grow: 1;
    flex-shrink: 0;
    height: 100%;
  }
}
</style>

<template>
  <div
    :class="['inte-scroll-table', `inte-scroll-table--${size}`, `inte-scroll-table--${mode}`]"
    :style="tableStyle"
    @click="onClick($event)">
    <ul class="inte-scroll-table_head clearfix">
      <li
        class="inte-scroll-table_th"
        v-for="(col, i) in colList"
        :key="`th_${i}`"
        :style="{
          'width': typeof col.width === 'number' ? `${col.width}px` : col.width,
          'text-align': col.align ? col.align : 'left'
        }">
        <span v-show="col.icon" class="inte-scroll-table_th_icon">
          <image-icon :height="20" :width="20" :icon="col.icon"></image-icon>
        </span>
        <el-tooltip
          popper-class="inte-scroll-table_tooltip"
          placement="top"
          trigger="hover"
          :enterable="false"
          :open-delay="1000"
          :content="col.label">
          <span class="inte-scroll-table_th_label">{{col.label}}</span>
        </el-tooltip>
        <span
          v-show="col.sortable"
          :class="['inte-scroll-table_th_sort', {
            'desc': col.sortOrder === 'desc',
            'asc': col.sortOrder === 'asc'
          }]"
          @click="onSortClick(col)">
          <span class="inte-scroll-table_th_sort_icon">
            <i class="el-icon-caret-top"></i>
            <i class="el-icon-caret-bottom"></i>
          </span>
        </span>
      </li>
    </ul>
    <seamless-scroll
      v-if="isSorted"
      class="inte-scroll-table_scroll-warp"
      :data="dataList"
      :class-option="scrollOption">
      <ul class="inte-scroll-table_body">
        <li
          :class="['inte-scroll-table_row', ' clearfix', {'active': highlightRowKeys.includes(item[rowKey])}]"
          v-for="item in dataList"
          :key="`row_${item[rowKey]}`"
          data-role="row"
          :data-key="item[rowKey]">
          <div
            class="inte-scroll-table_col"
            v-for="col in colList"
            :name="`col_${col.prop}`"
            :key="`col_${item[rowKey]}_${col.prop}`"
            :style="{
              'width': typeof col.width === 'number' ? `${col.width}px` : col.width,
              'text-align': col.align ? col.align : 'left'
            }">
            <el-tooltip
              popper-class="inte-scroll-table_tooltip"
              placement="top"
              trigger="hover"
              :enterable="false"
              :open-delay="500"
              :content="item[col.prop] + ''">
              <div
                class="inte-scroll-table_col-val"
                data-role="cell"
                :data-key="item[rowKey]"
                :data-prop="col.prop">
                {{item[col.prop]}}
              </div>
            </el-tooltip>
          </div>
        </li>
      </ul>
      <template slot="copy">
        <ul class="inte-scroll-table_body">
          <li
            :class="['inte-scroll-table_row', ' clearfix', {'active': highlightRowKeys.includes(item[rowKey])}]"
            v-for="item in dataList"
            :key="`row_${item[rowKey]}`"
            data-role="row"
            :data-key="item[rowKey]">
            <div
              class="inte-scroll-table_col"
              v-for="col in colList"
              :name="`col_${col.prop}`"
              :key="`col_${item[rowKey]}_${col.prop}`"
              :style="{
                'width': typeof col.width === 'number' ? `${col.width}px` : col.width,
                'text-align': col.align ? col.align : 'left'
              }">
              <el-tooltip
                popper-class="inte-scroll-table_tooltip"
                placement="top"
                trigger="hover"
                :enterable="false"
                :open-delay="500"
                :content="item[col.prop] + ''">
                <div
                  class="inte-scroll-table_col-val"
                  data-role="cell"
                  :data-key="item[rowKey]"
                  :data-prop="col.prop">
                  {{item[col.prop]}}
                </div>
              </el-tooltip>
            </div>
          </li>
        </ul>
      </template>
    </seamless-scroll>
  </div>
</template>

<script>
// import SeamlessScroll from 'vue-seamless-scroll'
import SeamlessScroll from '../seamless-scroll'
import ImageIcon from '../image-icon'

export default {
  props: {
    // 表头|列配置
    cols: {
      type: Array,
      default: []
    },
    // 数据源
    data: {
      type: Array,
      default: []
    },
    // 高亮的行keys
    highlightRowKeys: {
      type: Array,
      default: () => []
    },
    // 宽度
    width:  {
      type: [Number, String],
      default: '100%'
    },
    // 高度
    height:  {
      type: [Number, String],
      default: 200
    },
    // 行key值
    rowKey: {
      type: String,
      default: 'id'
    },
    // 大小
    size: {
      type: String,
      default: 'md'
    },
    // 形式
    mode: {
      type: [Number, String],
      default: ''
    },
    // vue-seamless-scroll 参数配置
    scrollOption: {
      type: Object,
      default () {
        return {
          autoPlay: true,
          step: 0.2
        }
      }
    }
  },
  data () {
    return {
      isSorted: true,
      colList: [], // 表头 内部使用
      dataList: [], // data 内部使用
      dataListOriginal: [] // data 原始数据
    }
  },
  components: {
    SeamlessScroll,
    ImageIcon
  },
  computed: {
    tableStyle () {
      let style = {
        width: typeof this.width === 'number' ? `${this.width}px` : this.width,
        height: typeof this.height === 'number' ? `${this.height}px` : this.height
      }
      return style
    }
  },
  watch: {
    cols: {
      immediate: true,
      deep: true,
      handler: function (val, old) {
        let colList = JSON.parse(JSON.stringify(val))
        colList.forEach(item => {
          item.sortOrder = item.sortOrder || null
        })
        this.colList = colList
      }
    },
    data: {
      immediate: true,
      deep: true,
      handler: function (val, old) {
        let dataList = JSON.parse(JSON.stringify(val))
        this.dataList = dataList
        this.dataListOriginal = JSON.parse(JSON.stringify(dataList))

        // 初始化排序处理 以第一个指定了排序的列为准
        let col = this.colList.find(item => item.sortOrder)
        if (col && val.length) {
          this.isSorted = false
          this.$nextTick(function() {
            this.sort(col.prop, col.sortOrder)
            this.isSorted = true
          })
        }
      }
    }
  },
  methods: {
    // 点击事件捕获 解决滚动不复制事件问题
    onClick (e) {
      let target = e.target
      if (target.dataset.role === 'cell') {
        let key = target.dataset.key
        let prop = target.dataset.prop
        let row = this.dataListOriginal.find(item => item[this.rowKey] === key)
        this.$emit('on-cell-click', prop, row)
      }
    },
    onSortClick (col) {
      this.isSorted = false;
      this.colList.forEach(item => {
        if (item.sortable && item.prop !== col.prop) {
          item.sortOrder = null
        }
      })
      if (!col.sortOrder) {
        col.sortOrder = 'asc'
      } else if (col.sortOrder === 'asc') {
        col.sortOrder = 'desc'
      } else if (col.sortOrder === 'desc') {
        col.sortOrder = ''
      }
      this.sort(col.prop, col.sortOrder);
      this.$nextTick(function() {
        this.isSorted = true;
      })
    },
    // 客户端排序
    sort (prop, order) {
      // 当前支持数字排序 未来用到再扩充
      if (!order) {
        this.dataList = JSON.parse(JSON.stringify(this.dataListOriginal))
      } else if (order === 'asc') {
        this.dataList.sort((a, b) => {
          return a[prop] - b[prop]
        })
      } else if (order === 'desc') {
        this.dataList.sort((a, b) => {
          return b[prop] - a[prop]
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.inte-scroll-table {
  border: 1px solid #025cb5;
  display: flex;
  flex-direction: column;
  &_head {
    flex-shrink: 0;
    flex-grow: 0;
    border-bottom: 1px solid #025cb5;
  }
  &_th {
    float: left;
    padding: 0 7px;
    width: 20%;
    line-height: 30px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    &_icon {
      display: inline-block;
      position: relative;
      height: 20px;
      width: 20px;
      vertical-align: middle;
      /deep/ .icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    &_label {
      vertical-align: middle;
    }
    // 头部排序图标
    &_sort {
      display: inline-block;
      position: relative;
      top: -1px;
      font-size: 13px;
      cursor: pointer;
      vertical-align: middle;
      &_icon {
        display: flex;
        flex-direction: column;
        i {line-height: 7px;}
      }
      // 倒序
      &.desc {
        .inte-scroll-table_th_sort_icon {
          i:first-child{opacity: .5;}
        }
      }
      // 正序
      &.asc {
        .inte-scroll-table_th_sort_icon {
          i:last-child{opacity: .5;}
        }
      }
    }
  }
  &_scroll-warp {
    flex-grow: 1;
    overflow: hidden;
  }
  &_body {
    color: #2dd0ed;
  }
  &_row {
    border-bottom: 1px dashed #025cb5;
    &:hover, &.active {
      box-shadow: 0 0 50px #549add inset;
    }
  }
  &_col {
    float: left;
    padding: 0 7px;
    width: 20%;
    min-height: 30px;
    line-height: 30px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    &-val {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  // size lg
  &.inte-scroll-table--lg {
    .inte-scroll-table_head {
      &>li {
        line-height: 50px;
        padding: 0 15px;
      }
    }
    .inte-scroll-table_col {
      line-height: 50px;
      padding: 0 15px;
    }
  }

  // mode 2
  &.inte-scroll-table--2 {
    border: 1px solid #24b2db;
    .inte-scroll-table_head {
      color: #00d2ff;
      background-color: rgba(22,60,144,.9);
    }
    .inte-scroll-table_row {
      color: #fff;
      border-bottom: 1px solid #24b2db;
    }
  }

}
</style>
<style>
  .inte-scroll-table_tooltip {
    z-index: 99999999!important;
  }
</style>

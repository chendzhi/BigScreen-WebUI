<template>
  <module-box
    :mode="isMobile ? 'mobile' : 2"
    title="热门文章"
    is-full-height>
    <template slot="toolbar_right">
      <button
        :class="['inte-btn inte-btn--mini', {'active': type === '1'}]"
        @click="onSwichType('1')">
        阅读排行
      </button>
      <button
        :class="['inte-btn inte-btn--mini', {'active': type === '2'}]"
        @click="onSwichType('2')">
        点赞排行
      </button>
      <template v-if="!isMobile">
        <span class="split"></span>
        <button class="inte-btn inte-btn--mini" @click="onPK">对比</button>
      </template>
    </template>
    <template slot="body">
      <!-- 手机端 -->
      <template v-if="isMobile">
        <template v-if="type==='1'">
          <mobile-list-read-rank :data="table.data"></mobile-list-read-rank>
          <mobile-pk-read-rank :data="modal.table.data"></mobile-pk-read-rank>
        </template>
        <template v-if="type==='2'">
          <mobile-list-like-rank :data="table.data"></mobile-list-like-rank>
          <mobile-pk-like-rank :data="modal.table.data"></mobile-pk-like-rank>
        </template>
      </template>
      <!-- 非手机端 -->
      <template v-else>
        <scroll-table
          class="tb-article"
          :cols="table.cols"
          :data="table.data"
          :scrollOption="table.scrollOption"
          height="100%"
          @on-cell-click="onCellClick">
        </scroll-table>
        <modal
          v-model="modal.show"
          title="微信热门文章对比"
          width="90%"
          height="auto">
          <template slot="body">
            <scroll-table
              class="tb-article"
              size="lg"
              :mode="2"
              :cols="modal.table.cols"
              :data="modal.table.data"
              :height="560"
              @on-cell-click="onCellClick">
            </scroll-table>
          </template>
        </modal>
      </template>
    </template>
  </module-box>
</template>

<script>
import { parseTime, guid } from '@/utils'
import { getData } from '@/api/integration'
import ModuleBox from '../../base/module-box'
import ScrollTable from '@/components/base/scroll-table'
import Modal from '@/components/base/modal'
import MobileListReadRank from './mobile-list_read-rank'
import MobileListLikeRank from './mobile-list_like-rank'
import MobilePkReadRank from './mobile-pk_read-rank'
import MobilePkLikeRank from './mobile-pk_like-rank'

export default {
  components: {
    ModuleBox,
    ScrollTable,
    Modal,
    MobileListReadRank,
    MobileListLikeRank,
    MobilePkReadRank,
    MobilePkLikeRank
  },
  props: {
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      type: '1', // 1:阅读数量 2:点赞数量
      table: {
        isFirstLoad: true,
        // 滚动配置
        scrollOption: {
          autoPlay: false, // 自动滚动
          step: 7, // 速度
          singleHeight: 31 * 4, // 单页高度
          waitTime: 5000 // 延时
        },
        cols: [
          { label: '微信名称', prop: 'name', width: '25%' },
          { label: '标题', prop: 'article_title', width: '28%' },
          { label: '阅读量', prop: 'amount', width: '19%' },
          { label: '发布时间', prop: 'release_time', width: '28%' }
        ],
        data: []
      },
      modal: {
        show: false,
        table: {
          cols: [
            { label: '微信名称', prop: 'name', width: '25%' },
            { label: '标题', prop: 'article_title', width: '28%' },
            { label: '阅读量', prop: 'amount', width: '19%' },
            { label: '发布时间', prop: 'release_time', width: '28%' }
          ],
          data: []
        }
      },
    }
  },
  methods: {
    getData () {
      getData({
        tn: '8',
        functionName: '热门文章',
        queryParam: `type=${this.type},is_current=1`,
        orderParam: 'amount=desc'
      }).then(data => {
        if (!data || !data.length) {
          this.table.data = []
          return
        }
        data.forEach(item => {
          item.id = guid()
          item.amount = item.amount || 0
          if (this.isMobile) {
            item.amount = item.amount > 100000 ? '100,000+' : item.amount
          } else {
            item.amount = item.amount > 100000 ? '100000+' : item.amount
          }
          item.release_time = parseTime(item.release_time)
        })
        this.table.data = data

        if (this.table.isFirstLoad) {
          // 列表n秒后开始滚动(默认上来就滚动一屏 效果不好)
          setTimeout(() => {
            this.table.scrollOption.autoPlay = true
          }, this.table.scrollOption.waitTime)
        }
        this.table.isFirstLoad = false
      })
    },
    // 获取pk数据
    getPKData () {
      getData({
        tn: '8',
        functionName: '热门文章-pk',
        queryParam: `type=${this.type},is_current=2`,
        orderParam: 'amount=desc'
      }).then(data => {
        if (!data || !data.length) {
          this.modal.table.data = []
          return
        }
        data.forEach(item => {
          item.id = guid()
          item.amount = item.amount || 0
          if (this.isMobile) {
            item.amount = item.amount > 100000 ? '100,000+' : item.amount
          } else {
            item.amount = item.amount > 100000 ? '100000+' : item.amount
          }
          item.release_time = parseTime(item.release_time)
        })
        this.modal.table.data = data
      })
    },
    onPK () {
      this.modal.show = true
      this.getPKData()
    },
    onSwichType (type) {
      this.type = type

      // 切换列名
      let switchColName = (type, col) => {
        if (type === '1') {
          // 阅读排行
          // 阅读量 点赞量列
          if (col.prop === 'amount') {
            col.label = '阅读量'
          }
        } else if (type === '2') {
          // 点赞排行
          // 阅读量 点赞量列
          if (col.prop === 'amount') {
            col.label = '点赞量'
          }
        }
      }
      // 主列表处理
      this.table.cols.forEach(item => {
        switchColName(type, item)
      })
      // 模态列表处理
      this.modal.table.cols.forEach(item => {
        switchColName(type, item)
      })

      this.getData()
      if (this.isMobile) {
        this.getPKData()
      }
    },
    onCellClick(prop, row) {
      if (prop === 'article_title') {
        window.open(row.url, '_blank')
      }
    }
  },
  mounted () {
    this.getData()
    if (this.isMobile) {
      this.getPKData()
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .module_body {
  padding: 0 10px 10px 10px;
}
.split {
  display: inline-block;
  position: relative;
  top: 3px;
  margin: 0 1px 0 0;
  height: 14px;
  border-right: 1px solid #25d8fd;
}
.tb-article {
  /deep/ .inte-scroll-table_head {
    box-shadow: 0 0 40px #0040bc inset;
  }
  /deep/ .inte-scroll-table_col[name="col_article_title"] {
    cursor: pointer;
    text-decoration: underline;
  }
}

// 移动端相关
.module.module--mobile {
  /deep/ .module_body {
    padding: 0;
    box-shadow: none;
    border-radius: 0;
  }
}
</style>

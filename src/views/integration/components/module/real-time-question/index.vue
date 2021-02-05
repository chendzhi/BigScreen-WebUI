<template>
  <module-box
    class="module-rtq"
    :mode="isMobile ? 'mobile' : 2"
    title="实时问题"
    is-full-height>
    <template slot="toolbar_right">
      <button
        :class="['inte-btn inte-btn--mini', {'active': type === '1'}]"
        @click="onSwichType('1')">
        网站
      </button>
      <button
        :class="['inte-btn inte-btn--mini', {'active': type === '2'}]"
        @click="onSwichType('2')">
        新媒体
      </button>
    </template>
    <template slot="body">
      <!-- 移动端 -->
      <template v-if="isMobile">
        <mobile-list-site v-if="type === '1'" :data="table.data"></mobile-list-site>
        <mobile-list-newmedia v-if="type === '2'" :data="table.data"></mobile-list-newmedia>
      </template>
      <!-- 非移动端 -->
      <template v-else>
        <scroll-table
          class="tb-question"
          :cols="table.cols"
          :data="table.data"
          :scrollOption="table.scrollOption"
          height="100%"
          @on-cell-click="onCellClick">
        </scroll-table>
        <detail-modal-site
          v-model="detail.site.show"
          :current="detail.current"
          :filter-show="detail.filter.show"
          :filter-options="detail.filter.options">
        </detail-modal-site>
        <detail-modal-newmedia
          v-model="detail.newmedia.show"
          :current="detail.current"
          :filter-show="detail.filter.show"
          :filter-options="detail.filter.options">
        </detail-modal-newmedia>
      </template>
    </template>
  </module-box>
</template>

<script>
import { mapGetters } from 'vuex'
import enumConf from '@/config/enum'
import { guid } from '@/utils'
import mapUtils from '@/utils/map'
import { getData, getCloudSiteLoginParams } from '@/api/integration'
import ModuleBox from '../../base/module-box'
import ScrollTable from '@/components/base/scroll-table'
import DetailModalSite from './detail-modal_site'
import DetailModalNewmedia from './detail-modal_newmedia'
import MobileListSite from './mobile-list_site'
import MobileListNewmedia from './mobile-list_newmedia'

export default {
  name: 'realTimeQuestion',
  components: {
    ModuleBox,
    ScrollTable,
    DetailModalSite,
    DetailModalNewmedia,
    MobileListSite,
    MobileListNewmedia
  },
  props: {
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      type: '1', // 1: 网站 2：新媒体
      table: {
        isFirstLoad: true,
        colsConf: {
          site: [
            { label: '名称', prop: 'name', width: '22%'},
            { label: '无法访问站点数', prop: 'not_collect', width: '18%' },
            { label: '首页不更新站点数', prop: 'not_update', width: '18%' },
            { label: '首页无效链接', prop: 'not_home', width: '24%' },
            { label: '错敏词个数', prop: 'wrong_character', width: '18%' }
          ],
          newMedia: [
            { label: '名称', prop: 'name', width: '25%'},
            // { label: '严重问题个数', prop: 'serious_problem_num', width: '18%' },
            { label: '内容不更新账号数', prop: 'content_not_update_num', width: '28%' },
            { label: '互动回应差个数', prop: 'interact_num', width: '25%' },
            { label: '错敏词个数', prop: 'serious_word_num', width: '22%' }
          ]
        },
        cols: [],
        data: [],
        scrollOption: {
          autoPlay: false, // 自动滚动
          step: 7, // 速度
          singleHeight: 31 * 4, // 单页高度
          waitTime: 5000 // 延时
        }
      },
      // 详情模块
      detail: {
        site: {
          show: false
        },
        newmedia: {
          show: false
        },
        current: null,
        // 详情-筛选控制
        filter: {
          show: true,
          options: []
        }
      }
    }
  },
  computed: {
    ...mapGetters(['user']),
  },
  watch: {
    type: {
      immediate: true,
      handler (val) {
        let cols = []
        switch (this.type) {
          case '1':
            cols = this.table.colsConf.site
            break;
          case '2':
            cols = this.table.colsConf.newMedia
            break;
          default:
            break;
        }
        this.table.cols = cols
      }
    }
  },
  methods: {
    getData () {
      this.table.data = []
      getData({
        tn: '3',
        queryParam: `type=${this.type}`,
        functionName: '实时问题'
      }).then(data => {
        if (!data || !data.length) {
          this.table.data = []
          return
        }
        data.forEach(item => {item.id = guid()})
        this.table.data = data
        if (this.detail.filter.show) {
          this.detail.filter.options = data
        }

        if (this.table.isFirstLoad) {
          // 列表n秒后开始滚动(默认上来就滚动一屏 效果不好)
          setTimeout(() => {
            this.table.scrollOption.autoPlay = true
          }, this.table.scrollOption.waitTime)
        }

        this.table.isFirstLoad = false
      })
    },
    onSwichType (type) {
      this.type = type
      this.getData()
    },
    onCellClick (prop, row) {
      if (prop === 'name') {
        if (this.detail.filter.show) { this.detail.current = row }
        this.detail[this.type==='1'?'site':'newmedia'].show = true
      }
    },
    detailInit () {
      let user = this.user
      // let isZxs = mapUtils.isZxs(user.organCode)
      // 地市不能筛选
      if (user.organType === enumConf.common.organType.city) {
        this.detail.filter.show = false
      }
    }
  },
  mounted () {
    this.detailInit()
    this.getData()
  }
}
</script>

<style lang="scss" scoped>
/deep/ .module_body {
  padding: 0 10px 10px 10px;
}
.tb-question {
  /deep/ .inte-scroll-table_head {
    box-shadow: 0 0 40px #0040bc inset;
  }
  /deep/ .inte-scroll-table_col[name="col_name"] {
    cursor: pointer;
    text-decoration: underline;
  }
}

// 移动端相关
.module-rtq.module.module--mobile {
  /deep/ .module_body {
    padding: 0;
    box-shadow: none;
    border-radius: 0;
  }
}
</style>

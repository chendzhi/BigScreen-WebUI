<template>
  <module-box
    title="高频错词"
    :mode="isMobile ? 'mobile' : ''"
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
      <ul ref="main" :class="['main', {'main--mobile': isMobile}]">
        <li
          v-for="item in wordList"
          :key="item.id"
          :style="item.style"
          @click="onErroWordClick">
          {{item.word}}
        </li>
      </ul>
      <template v-if="!isMobile">
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
import { tagsCloud, update } from "@/utils/tagsCloud.js";
import ModuleBox from '../../base/module-box'
import DetailModalSite from './detail-modal_site'
import DetailModalNewmedia from './detail-modal_newmedia'

export default {
  components: {
    ModuleBox,
    DetailModalSite,
    DetailModalNewmedia
  },
  props: {
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      timer: null, // 滚动timer
      type: '1', // 1: 网站 2：新媒体
      wordList: [], // 错词列表
      // 详情模块
      detail: {
        site: {
          show: false
        },
        newmedia: {
          show: false
        },
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
  methods: {
    /**
     * 计算错词style样式
     * 颜色随机，字体大小根据词频计算
     * numRange: { 次数区间
     *  min: 最小，
     *  max: 最大
     * }
     * model: 当前数据
     */
    computedWordStyle (numRange, model) {
      let colorArr = ['#0ce4ee', '#0c66ee', '#974db2', '#0cacee', '#0cee46', '#aed912', '#6281e7']
      let fontSizeRange = {
        min: 14,
        max: 40
      }
      let unitFontSize = (fontSizeRange.max - fontSizeRange.min) / (numRange.max - numRange.min) // 频次区间差 单位字体大小
      let fontSize = 14 + (model.number - numRange.min) * unitFontSize
      let color = colorArr[Math.floor(Math.random() * colorArr.length)]
      return `font-size: ${fontSize}px; color: ${color};`
    },
    chartRender () {
      if(this.timer){
        clearInterval(this.timer);
      }
      tagsCloud(this.$refs.main)
      update()
      this.timer = window.setInterval(update, 80)
    },
    getData () {
      getData({
        tn: '7',
        functionName: '高频错词',
        queryParam: `type=${this.type}`,
        orderParam: 'number=desc'
      }).then(data => {
        if (!data || !data.length) {
          this.wordList = []
          this.$nextTick(() => {
            this.chartRender()
          })
          return
        }
        // 错误频次区间
        let numRange = {
          min: data[data.length -1].number,
          max: data[0].number
        }
        // 数据加工
        data.forEach(item => {
          item.id = guid()
          item.style = this.computedWordStyle(numRange, item)
        })
        this.wordList = data
        this.$nextTick(() => {
          this.chartRender()
        })
      })
    },
    // 获取详情筛选项
    getDetailFilterOptions () {
      getData({
        tn: '3',
        queryParam: `type=${this.type}`,
        functionName: '高频错词下钻-筛选项'
      }).then(data => {
        if (!data || !data.length) { return }
        this.detail.filter.options = data
      })
    },
    onSwichType (type) {
      if (this.type === type) {return}
      this.type = type
      this.getData()
    },
    onErroWordClick () {
      if (this.isMobile) {return}
      this.detail[this.type==='1'?'site':'newmedia'].show = true
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
    if (!this.isMobile && this.detail.filter.show) {
      this.getDetailFilterOptions()
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>

<style lang="scss" scoped>
/deep/ .module_body::after{
  content: '';
  position: absolute;
  bottom: 15px;
  left: 0;
  height: 50px;
  width: 100%;
  background-image: url('./bg.png');
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}
.main {
  position: absolute;
  top: 0;
  right: 10px;
  bottom: 20px;
  left: 20px;
  margin: 0;
  padding: 0;
  list-style: none;
  box-sizing: border-box;
  overflow: hidden;
  li {
    position: absolute;
    list-style: none;
    cursor: pointer;
  }
  &--mobile {
    top: 10px;
  }
}
</style>

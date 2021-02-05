<template>
  <module-box
    title="基本概况"
    :mode="isMobile ? 'mobile' : ''"
    is-full-height>
    <template slot="toolbar_right">
      <button v-if="isMobile" class="inte-btn inte-btn--mini inte-btn--type-text" @click="onPK">对比<i class="el-icon-arrow-right"></i></button>
      <button v-else class="inte-btn inte-btn--mini" @click="onPK">对比</button>
    </template>
    <template slot="body">
      <div :class="['main', 'inte-full', {'main--mobile': isMobile}]">
        <div class="item">
          <div class="item_icon">
            <image-icon :height="40" :width="40" icon="big-internet"></image-icon>
          </div>
          <div class="item_label">
            <span>政府</span>
            <span>网站数</span>
          </div>
          <div class="item_val">
            <count-to :start-val="0" :end-val="siteNum" :duration="1000" class="item_val_num" />
            <span class="item_val_unit">个</span>
          </div>
        </div>
        <div style="height: 10px;"></div>
        <div class="item">
          <div class="item_icon">
            <image-icon :height="40" :width="40" icon="big-video"></image-icon>
          </div>
          <div class="item_label" style="width: 64px;">
            <span>政务</span>
            <span>新媒体数</span>
          </div>
          <div class="item_val yellow">
            <count-to :start-val="0" :end-val="newMediaNum" :duration="1000" class="item_val_num" />
            <span class="item_val_unit">个</span>
          </div>
        </div>
      </div>
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
        title="基本情况对比"
        width="90%"
        height="auto">
        <template slot="body">
          <p class="inte-rank-msg" v-if="pk.siteRankNO || pk.newMediaRankNO">
            {{user.organName}}政府网站数同级对比排在第
            <span class="inte-rank-msg_num">{{pk.siteRankNO}}</span>
            位，政务新媒体数同级对比排在第
            <span class="inte-rank-msg_num">{{pk.newMediaRankNO}}</span>
            位
          </p>
          <scroll-table
            size="lg"
            :mode="2"
            :cols="pk.table.cols"
            :data="pk.table.data"
            :highlight-row-keys="pk.table.highlightRowKeys"
            :height="500">
          </scroll-table>
        </template>
      </modal>
    </template>
  </module-box>
</template>

<script>
import { mapGetters } from 'vuex'
import { getData } from '@/api/integration'
import { guid } from '@/utils'
import CountTo from 'vue-count-to'
import ModuleBox from '../../base/module-box'
import ImageIcon from '@/components/base/image-icon'
import Modal from '@/components/base/modal'
import ScrollTable from '@/components/base/scroll-table'
import MobilePk from './mobile-pk'

export default {
  components: {
    ModuleBox,
    ImageIcon,
    CountTo,
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
      pk: {
        show: false,
        siteRankNO: 0, // 站点排名
        newMediaRankNO: 0, // 新媒体排名
        table: {
          cols: [
            { label: '名称', prop: 'name', width: '33.33%' },
            { label: '政府网站数', prop: 'website', width: '33.33%', align: 'center', sortable: true, sortOrder: 'desc' },
            { label: '政务新媒体数', prop: 'media', width: '33.33%', align: 'center', sortable: true, sortOrder: null }
          ],
          data: [],
          highlightRowKeys: []
        }
      },
      siteNum: 0,
      newMediaNum: 0
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    getData () {
      getData({
        tn: '1',
        functionName: '基本概况',
      }).then(data => {
        if (!data || !data.length) {
          this.siteNum = 0
          this.newMediaNum = 0
          this.pk.table.data = []
          this.pk.siteRankNO = []
          this.pk.newMediaRankNO = []
        }
        // 行高亮处理
        data.forEach(item => {
          item.id = guid()
          // 是否是当前登录者的数据
          if (item.is_current === 1) {
            this.pk.table.highlightRowKeys.push(item.id)
            this.siteNum = item.website
            this.newMediaNum = item.media
          }
        })
        this.pk.table.data = data
        this.pk.siteRankNO = data.sort((a, b) => {return b.website - a.website}).findIndex(item => item.is_current === 1) + 1
        this.pk.newMediaRankNO = data.sort((a, b) => {return b.media - a.media}).findIndex(item => item.is_current === 1) + 1
      })
    },
    onPK () {
      this.pk.show = true
    }
  },
  mounted () {
    this.getData()
  }
}
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  flex-direction: column;
  padding: 0 15px 10px 15px;
  min-height: 100%;
  .item {
    display: flex;
    align-items: center;
    flex-grow: 1;
    padding: 0 15px;
    box-shadow: 0 0 20px #0040bc inset;
    border-radius: 6px;
    overflow: hidden;
    &_icon {
      flex-grow: 0;
      margin-right: 10px;
    }
    &_label {
      width: 50px;
      flex-shrink: 0;
      flex-grow: 0;
      color: #fff;
      font-size: 14px;
      span {
        display: block;
      }
    }
    &_val {
      flex-grow: 1;
      white-space: nowrap;
      text-align: right;
      color: #54f7ff;
      &_num {
        font-size: 40px;
      }
      &_unit {
        font-size: 16px;
      }
      &.yellow {
        color: #ffe300;
      }
    }
  }

  &--mobile {
    padding: 15px 10px;
  }
}
</style>

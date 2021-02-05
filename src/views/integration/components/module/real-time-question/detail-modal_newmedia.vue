<template>
  <modal
    v-model="modal.show"
    title=""
    width="90%"
    height="auto"
    :min-height="400">
    <template slot="title">
      <div class="inte-detail-filter" v-if="filterShow">
        <el-select
          class="el-select--no-pdl"
          popper-class="inte-detail-el-popper el-popper--theme-blue"
          size="medium"
          v-model="filterVal"
          placeholder="请选择"
          @change="onFilterChange">
          <el-option
            key="all"
            label="全部"
            value="all">
          </el-option>
          <el-option
            v-for="item in filterOptions"
            :key="item.siteCode"
            :label="item.name"
            :value="item.siteCode">
          </el-option>
        </el-select>
      </div>
    </template>
    <template slot="body">
      <div class="inte-detail-main">
        <div class="inte-detail-result">
          <el-table
            class="inte-detail-el-table"
            v-loading="table.loading"
            row-key="ex_id"
            :data="table.data"
            size="large"
            stripe
            border
            :height="540"
            style="width: 100%">
            <el-table-column
              prop="name"
              label="站点名称/编码"
              min-width="200"
              header-align="left"
              show-overflow-tooltip>
              <template slot-scope="{row}">
                <span>{{row.name}}</span><br/>
                <span class="org-code">{{row.siteCode}}</span>
              </template>
            </el-table-column>
            <el-table-column
            prop="last_period_problems"
            min-width="150"
            header-align="center"
            align="center"
            show-overflow-tooltip>
            <template slot="header">
              <p>上期严重问题个数</p>
              <p>(>0 单项否决)</p>
            </template>
            <!-- <template slot-scope="{row}">
              <span :class="{'word-danger': row.last_period_problems > 0}">
                {{row.last_period_problems}}
              </span>
            </template> -->
            <template slot-scope="{row}">
              <span>—</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="last_period_content"
            label="上期严重问题内容"
            min-width="300"
            header-align="center"
            align="center"
            show-overflow-tooltip>
            <!-- <template slot-scope="{row}">
              <template v-if="row.isAuthority === '1'">
                <template
                  v-for="item in convertContentToArray(row.last_period_content)">
                  <el-tag effect="dark">
                    {{ item }}
                  </el-tag><br>
                </template>
              </template>
              <span v-else>***</span>
            </template> -->
            <template slot-scope="{row}">
              <span>—</span>
            </template>
          </el-table-column>
            <el-table-column
              prop="content_not_update_days"
              min-width="180"
              header-align="center"
              align="center"
              show-overflow-tooltip>
              <template slot="header">
                <p>内容未更新天数</p>
                <p>(≥14天 单项否决)</p>
              </template>
              <template slot-scope="{row}">
                <span :class="{'inte-detail-word-danger': row.content_not_update_days >= 14}">
                  {{row.content_not_update_days>=0 ? row.content_not_update_days : '—'}}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="last_period_interact_num"
              min-width="160"
              header-align="center"
              align="center"
              show-overflow-tooltip>
              <template slot="header">
                <p>上期互动回应差个数</p>
                <p>(>0 单项否决)</p>
              </template>
              <!-- <template slot-scope="{row}">
                <span :class="{'inte-detail-word-danger': row.last_period_interact_num > 0}">
                  {{row.last_period_interact_num}}
                </span>
              </template> -->
              <template slot-scope="{row}">
                <span>—</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="last_period_interact_content"
              label="上期互动回应差内容"
              min-width="300"
              header-align="center"
              align="center"
              show-overflow-tooltip>
              <!-- <template slot-scope="{row}">
                <template v-if="row.isAuthority === '1'">
                  <template
                    v-for="item in convertContentToArray(row.last_period_interact_content)">
                    <el-tag effect="dark">
                      {{ item }}
                    </el-tag><br>
                  </template>
                </template>
                <span v-else>***</span>
              </template> -->
              <template slot-scope="{row}">
                <span>—</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </template>
  </modal>
</template>

<script>
import { getData } from '@/api/integration'
import { parseTime, guid } from '@/utils'
import Modal from '@/components/base/modal'
export default {
  name: 'realTimeQuestion_detailModalNewMedia',
  components: {
    Modal
  },
  props: {
    // 是否显示
    value: {
      type: Boolean,
      default: false
    },
    // 当前操作数据行
    current: {
      type: Object,
      default: () => null
    },
    filterShow: {
      type: Boolean,
      default: true
    },
    // 筛选选项集合
    filterOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      modal: {
        show: this.value
      },
      filterVal: this.current ? this.current.siteCode : 'all',
      table: {
        loading: false,
        data: []
      }
    }
  },
  watch: {
    'modal.show': {
      handler(val, old) {
        this.$emit('input', val)
      }
    },
    value: {
      handler(val, old) {
        this.modal.show = val
        this.filterVal = this.current ? this.current.siteCode : 'all'
        this.$nextTick(function() {
          this.getData()
        })
      }
    }
  },
  methods: {
    getData () {
      this.table.loading = true
      let upCode = this.filterVal === 'all' ? '' : this.filterVal
      getData({
        tn: '45',
        queryParam: `type=2,upCode=${upCode}`,
        functionName: '实时问题下钻-新媒体'
      }).then(data => {
        this.table.loading = false
        this.table.data = []
        if (!data || !data.length) { return }
        data.forEach(item => {
          item.ex_id = guid()
        })
        this.table.data = data
      }).catch(err => {
        this.table.loading = false
      })
    },
    onFilterChange() {
      this.getData()
    },
    convertContentToArray(val) {
      if (!val) { return [] }
      let arr = val.split(',')
      if (arr.length > 3) {
        arr.splice(3, arr.length-3, '...')
      }
      return arr
    }
  }
}
</script>

<style lang="scss" scoped>
  .org-code {
    color: #0398cd;
    // color: #00D2FF;
  }
</style>

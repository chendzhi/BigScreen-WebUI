<template>
  <layout @on-close="onClose">
    <div class="detail-main">
      <div class="detail-filter" v-if="filterShow">
        <el-select
          class="el-select--no-pdl"
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
      <div class="detail-result">
        <el-table
          v-loading="table.loading"
          row-key="ex_id"
          :data="table.data"
          size="large"
          stripe
          :max-height="table.maxHeight"
          style="width: 100%">
          <el-table-column
            prop="name"
            label="站点名称/编码"
            min-width="200"
            header-align="left"
            show-overflow-tooltip>
            <template slot-scope="{row}">
              <span>{{row.name}}</span><br/>
              <span>({{row.siteCode}})</span>
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
            <template slot-scope="{row}">
              <span :class="{'word-danger': row.last_period_problems > 0}">
                {{row.last_period_problems}}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="last_period_content"
            label="上期严重问题内容"
            min-width="300"
            header-align="center"
            align="center"
            show-overflow-tooltip>
            <template slot-scope="{row}">
              <template v-if="row.isAuthority === '1'">
                <template
                  v-for="item in convertContentToArray(row.last_period_content)">
                  <el-tag
                    type="info"
                    effect="dark">
                    {{ item }}
                  </el-tag><br>
                </template>
              </template>
              <span v-else>*</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="site_not_access_num"
            min-width="185"
            header-align="center"
            align="center"
            show-overflow-tooltip>
            <template slot="header">
              <p>一周内站点无法访问次数</p>
              <p>(≥5% 单项否决)</p>
            </template>
            <template slot-scope="{row}">
              <span :class="{'word-danger': (row.site_not_access_num/row.total_access_num) >= 0.05}">
                {{row.site_not_access_num}}/{{row.total_access_num}}&nbsp;&nbsp;
                {{(row.site_not_access_num/row.total_access_num*100).toFixed(2)}}%
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="home_page_update_num"
            min-width="180"
            header-align="center"
            align="center"
            show-overflow-tooltip>
            <template slot="header">
              <p>首页未更新天数</p>
              <p>(≥14天 单项否决)</p>
            </template>
            <template slot-scope="{row}">
              <span :class="{'word-danger': row.home_page_update_num >= 14}">
                {{row.home_page_update_num}}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="column_page_update_num"
            min-width="180"
            header-align="center"
            align="center"
            show-overflow-tooltip>
            <template slot="header">
              <p>栏目未更新天数</p>
              <p>(动态要闻)</p>
            </template>
            <template slot-scope="{row}">
              <span :class="{'word-danger': row.column_page_update_num >= 14}">
                {{row.column_page_update_num}}
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
            <template slot-scope="{row}">
              <span :class="{'word-danger': row.last_period_interact_num > 0}">
                {{row.last_period_interact_num}}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="last_period_interact_content"
            label="上期互动回应差内容"
            min-width="300"
            header-align="left"
            align="left"
            show-overflow-tooltip>
            <template slot-scope="{row}">
              <template v-if="row.isAuthority === '1'">
                <template
                  v-for="item in convertContentToArray(row.last_period_interact_content)">
                  <el-tag
                    type="info"
                    effect="dark">
                    {{ item }}
                  </el-tag><br>
                </template>
              </template>
              <span v-else>*</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="last_period_unuseful_num"
            min-width="160"
            header-align="center"
            align="center"
            show-overflow-tooltip>
            <template slot="header">
              <p>上期服务不实用个数</p>
              <p>(>0 单项否决)</p>
            </template>
            <template slot-scope="{row}">
              <span :class="{'word-danger': row.last_period_unuseful_num > 0}">
                {{row.last_period_unuseful_num}}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="last_period_unuseful_content"
            label="上期服务不实用内容"
            min-width="300"
            header-align="center"
            align="center"
            show-overflow-tooltip>
            <template slot-scope="{row}">
              <template v-if="row.isAuthority === '1'">
                <template
                  v-for="item in convertContentToArray(row.last_period_unuseful_content)">
                  <el-tag
                    type="info"
                    effect="dark">
                    {{ item }}
                  </el-tag><br>
                </template>
              </template>
              <span v-else>*</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="broken_links"
            label="首页无效链接个数"
            min-width="160"
            header-align="center"
            align="center"
            show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </layout>
</template>

<script>
import { getData } from '@/api/integration'
import { parseTime, guid } from '@/utils'
import Layout from './layout'
export default {
  components: {
    Layout
  },
  props: {
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
      filterVal: 'all',
      table: {
        loading: false,
        maxHeight: (()=>{
          if (this.filterShow) {
            return document.body.offsetHeight - 170
          } else {
            return document.body.offsetHeight - 106
          }
        })(),
        data: []
      }
    }
  },
  methods: {
    getData () {
      this.table.loading = true
      let upCode = this.filterVal === 'all' ? '' : this.filterVal
      getData({
        tn: '45',
        queryParam: `type=1,upCode=${upCode}`,
        functionName: '实时问题下钻-网站'
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
    onClose() {
      this.$emit('on-close')
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
    },
    _elAppendToBody() {
      this.$nextTick(() => {
        let body = document.querySelector("body");
        if (body.append) {
          body.append(this.$el);
        } else {
          body.appendChild(this.$el);
        }
      })
    }
  },
  mounted() {
    this.filterVal = this.current ? this.current.siteCode : 'all'
    this._elAppendToBody()
    this.getData()
  }
}
</script>

<style lang="scss" scoped>
  .detail-filter {
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    border-radius: 6px;
  }
  .detail-result {
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    border-radius: 6px;
    overflow: hidden;
  }
  .el-table {
    .el-tag {
      margin-bottom: -5px;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
</style>

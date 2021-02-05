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
            :height="500"
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
              prop="number"
              label="错敏词个数(近7天)"
              min-width="150"
              header-align="center"
              align="center"
              show-overflow-tooltip>
            </el-table-column>

            <el-table-column
              prop="rectified"
              label="已整改个数(近7天)"
              min-width="200"
              header-align="center"
              align="center"
              show-overflow-tooltip>
              <template slot-scope="{row}">
                <span v-if="row.isAuthority === '1'">
                  {{row.rectified}}
                </span>
                <span v-else>***</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="rectifying"
              label="整改中个数(近7天)"
              min-width="185"
              header-align="center"
              align="center"
              show-overflow-tooltip>
              <template slot-scope="{row}">
                <span v-if="row.isAuthority === '1'">
                  {{row.rectifying}}
                </span>
                <span v-else>***</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="word"
              label="错敏词内容(近7天)"
              min-width="300"
              header-align="center"
              align="center"
              show-overflow-tooltip>
              <template slot-scope="{row}">
                <template v-if="row.isAuthority === '1'">
                  <template
                    v-for="item in convertContentToArray(row.word)">
                    <el-tag effect="dark">
                      {{ item }}
                    </el-tag><br>
                  </template>
                </template>
                <span v-else>***</span>
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
  name: 'frequencyErrorWord_detailModalSite',
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
        tn: '42',
        queryParam: `type=1,upCode=${upCode}`,
        functionName: '高频错词下钻-网站'
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

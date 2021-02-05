<template>
  <modal
    class="modal-custom"
    v-model="show"
    :title="model.title"
    full-screen-action-show
    height="90%"
    width="90%"
    maskColor="#000">
    <template slot="body">
      <div class="pie-list">
        <el-row>
          <el-col
            :xs="12"
            :sm="12"
            :md="24/pieChartData.length"
            v-for="(item, index) in pieChartData"
            :key="index">
            <voice-pie-chart class="pie-item" :setData="item"></voice-pie-chart>
          </el-col>
        </el-row>
      </div>
      <div class="tree-chart">
        <!-- 传递关系图 -->
        <transmit-graph :model="model"></transmit-graph>
      </div>
    </template>
  </modal>
</template>

<script>
import { mapGetters } from 'vuex'
import mapUtils from '@/utils/map'
import enumConf from '@/config/enum'
import Modal from '@/components/base/modal'
import TransmitGraph from "./transmit-graph"
import VoicePieChart from "@/components/Echarts/vue-echart/voice-pie-chart";
export default {
  components: {
    Modal,
    VoicePieChart,
    TransmitGraph
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    model: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      show: false
    }
  },
  computed: {
    ...mapGetters(['user']),
    pieChartData () {
      if (!this.model || !this.model.details) {return}

      let user = this.user
      let isZxs = mapUtils.isZxs(user.organCode) // 是否直辖市
      let data = []

      if (user.organType === enumConf.common.organType.province && !isZxs) { // 省
        let num = {
          provinceDirectNum: this.model.directly_under_spread, // 省直 传递数
          provinceDirectCount: this.model.directly_under_number, // 省直 总数
          cityNum: this.model.citiesn_spread, // 市州
          cityCount: this.model.citiesn_number,
          cityDirectNum: 0, // 市直
          cityDirectCount: 0,
          countyNum: 0, // 区县
          countyCount: 0
        }
        this.model.details.forEach(item => {
          num.countyNum += item.sub_organ_spread
          num.countyCount += item.sub_organ_number
          num.cityDirectNum += item.directly_spread
          num.cityDirectCount += item.directly_number
        })

        data = [
          {
            colors: ['#3FEDFF', '#3893FF'],
            data: {
              name: '省直',
              value: num.provinceDirectNum,
              count: num.provinceDirectCount || 100
            }
          },
          {
            colors: ['#00D67F', '#008E7A'],
            data: {
              name: '市/州',
              value: num.cityNum,
              count: num.cityCount || 100
            }
          },
          {
            colors: ['#E2D10F', '#897F10'],
            data: {
              name: '市直',
              value: num.cityDirectNum,
              count: num.cityDirectCount || 100
            }
          },
          {
            colors: ['#F09786', '#C9604C'],
            data: {
              name: '区县',
              value: num.countyNum,
              count: num.countyCount || 100
            }
          }
        ]

      } else if (user.organType === enumConf.common.organType.city || isZxs) { // 直辖市|地市
        let num = {
          szNum: this.model.directly_under_spread, // 市直 传递数
          szCount: this.model.directly_under_number, // 市直 总数
          qxNum: 0, // 区县
          qxCount: 0,
          xzNum: 0, // 县直
          xzCount: 0
        }
        this.model.details.forEach(item => {
          num.qxNum += item.sub_organ_spread
          num.qxCount += item.sub_organ_number
          num.xzNum += item.directly_spread
          num.xzCount += item.directly_number
        })
        data = [
          {
            colors: ['#3FEDFF', '#3893FF'],
            data: {
              name: '市直',
              value: num.szNum,
              count: num.szCount || 100
            }
          },
          {
            colors: ['#00D67F', '#008E7A'],
            data: {
              name: '区县',
              value: num.qxNum,
              count: num.qxCount || 100
            }
          },
          {
            colors: ['#E2D10F', '#897F10'],
            data: {
              name: '县直',
              value: num.xzNum,
              count: num.xzCount || 100
            }
          }
        ]

      }
      return data
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (val) {
        this.show = val
      }
    },
    show (val) {
      this.$emit('input', val)
    }
  },
  methods: {
  },
  created () {

  },
  mounted() {
  }
}
</script>
<style lang="scss" scoped>
.modal-custom {
  /deep/ .inte-modal_main {
    max-height: 100%;
    max-width: 1302px;
  }
  /deep/ .inte-modal_head {
    height: 45px;
    line-height: 45px;
    background: rgba(13,75,169,0.8);
    background-image: none;
    box-shadow: 0 0 3px rgba(11,228,238,0.5);
    .inte-modal_head_title {
      font-size: 16px;
    }
    .inte-modal_action-bar  .action-item{
      height: 28px;
      width: 28px;
      line-height: 28px;
      font-size: 18px;
      border-radius: 2px;
      &:hover {
        background-color: #549add;
      }
    }
  }
  /deep/ .inte-modal_body {
    display: flex;
    flex-direction: column;
    padding: 0;
    background-image: linear-gradient(90deg, rgba(21,100,186,0.9), rgba(18,47,143,0.9));
  }
}
.pie-list {
  flex-grow: 0;
  flex-shrink: 0;
  padding: 20px 50px;
  border-bottom: 1px solid #0e4b94;
  .pie-item {
    height: 100px;
  }
}
.tree-chart {
  flex-grow: 1;
}
</style>

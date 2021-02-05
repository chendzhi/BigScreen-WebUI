<template>
  <div class="guanzhu-block">
    <div class="block-title">
      <div class="block-title-word">政声传递</div>
    </div>
    <div class="chuandi-tit">近30天</div>
    <div class="zdgz-content">
      <div v-show="!list.length" class="no-data">暂无数据</div>
      <ul class="article-ul" v-if="list.length">
        <li
          @click.stop="onArticleClick(item)"
          v-for="item in list"
          :key="item.ex_id"
          :class="{ 'article-ul-li-active': item.ex_id === curModel.ex_id }"
          class="article-ul-li clearfix">
          <div class="clearfix text-info-content">
            <el-tooltip placement="top" :content="item.title" :enterable="false">
              <p>
                <span class="tag">
                  <span class="tag_val">{{item.article_typeText}}</span>
                </span>
                <a href="javascript:void(0)">{{ item.ex_title }}</a>
              </p>
            </el-tooltip>
              <span class="article-ul-li-date">{{ item.ex_releaseDate }}</span>
          </div>
          <div
            v-show="item.ex_id === curModel.ex_id"
            class="article-ul-li-chart"
            @click.stop="onChartClick">
            <el-row
              class="height100 article-ul-li-chart-row"
              type="flex"
              justify="space-around">
              <el-col
                class="article-chart-wrap"
                :span="24/item.ex_pieChartList.length"
                v-for="(pieData, pieDataIndex) in item.ex_pieChartList"
                :key="pieDataIndex">
                <pie-chart :setData="pieData"></pie-chart>
              </el-col>
              </el-col>
            </el-row>
          </div>
        </li>
      </ul>
    </div>
    <!-- 详情模态 -->
    <detail-modal
      v-model="detailModal.show"
      :model="curModel">
    </detail-modal>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import enumConf from '@/config/enum'
import { queryData } from "@/api/newDriverCabin/index"
import { guid, parseTime } from '@/utils'
import PieChart from "@/components/Echarts/vue-echart/pie-chart"
import DetailModal from './detail-modal'
export default {
  name: "politics-voice-transmit",
  components: {
    DetailModal,
    PieChart
  },
  data() {
    return {
      list: [], // 列表
      curModel: {}, // 当前对象
      detailModal: { // 详情模态
        show: false
      }
    };
  },
  computed: {
    ...mapGetters({
      user: 'user',
      currentLeader: 'getterCurrentLeader'
    })
  },
  watch: {
    // 领导变化
    'currentLeader.leaderName' (val) {
      this.getData()
    }
  },
  methods: {
    getData () {
      if (!this.currentLeader || !this.currentLeader.leaderName) { return }
      queryData({
        tn: '13',
        functionName: '政声传递',
        queryParam: `choice=1,leader_name=${this.currentLeader.leaderName}`,
        orderParam: 'details_count=desc'
      }).then(data => {
        data = data ? data : []
        // 最多保留4条数据
        if (data.length > 4) {
          data.splice(4)
        }
        data.forEach((item, index) => {
          item.ex_id = guid() // 扩展：id
          item.ex_releaseDate = parseTime(item.release_date, '{y}/{m}/{d}') // 扩展：发布时间格式化
          item.ex_pieChartList = this._convertToPieChartList(item)
          item.ex_title = item.title.length > 30 ? `${item.title.substr(0, 30)}...` : item.title
          item.details = JSON.parse(item.details)
        })
        this.list = data
        this.curModel = data.length ? data[0] : {}
      })
    },
    onArticleClick (model) {
      this.curModel = model
    },
    onChartClick () {
      // 部委没有弹框详细
      if (this.user.organType === enumConf.common.organType.department) {
        return
      }
      this.detailModal.show = true
    },
    _convertToPieChartList (model) {
      let list = []
      let user = this.user
      if (user.organType === enumConf.common.organType.department) { // 部委
        list = [
          [{value: model.portal, name: '部委门户'}],
          [{value: model.portal2, name: '部委直属及委办局'}]
        ]
      } else { // 省市
        list = [
          [{value: model.portal, name: '省门户'}],
          [{value: model.portal2, name: '二级网站'}],
          [{value: model.portal3, name: '三级网站'}]
        ]
      }
      return list
    }
  },
  mounted () {
    this.getData()
  }
};
</script>

<style lang="scss" scoped>
.guanzhu-block {
  display: flex;
  flex-direction: column;
  .block-title, .chuandi-tit {
    flex-grow: 0;
    flex-shrink: 0;
  }
  .chuandi-tit {
    margin-bottom: 5px;
  }
  .zdgz-content {
    position: relative;
    flex-grow: 1;
    overflow: auto;
    .no-data {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #3994d6;
      font-size: 12px;
    }
    .article-ul .article-ul-li {
      padding: 6px 0;
      .tag {
        display: inline-block;
        margin: 0 5px;
        background-color: #e8e9ea;
        text-align: center;
        padding: 0 4px;
        min-width: 30px;
        line-height: 14px;
        -webkit-transform: skewX(-15deg);
        transform: skewX(-15deg);
        &_val {
          display: inline-block;
          transform: skewX(15deg);
          font-size: 12px;
          color: #15055b;
        }
      }
    }
  }
}
</style>

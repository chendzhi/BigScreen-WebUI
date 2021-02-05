<template>
    <div class="meeting-content depart-meet-content">
      <div class="meeting-pag-left">
        <div class="meeting-title-wrap txt-center clearfix">
          <div class="block-title">
            <div class="block-title-word">重点关注</div>
          </div>
        </div>
        <div class="meeting-chart depart-meet">
          <span class="depart-meet-line"></span>
          <el-row class="height100">
            <el-col class="height100" :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <div class="height100" @click="openImportantMatter(0)">
                <div class="ministry-tit">
                  {{titles && titles[0] && titles[0].specialTitle}}
                </div>
                <div class="depart-chart">
                  <meet-chart :setData="meetData1"></meet-chart>
                </div>
              </div>
            </el-col>
            <el-col class="height100" :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <div class="height100" @click="openImportantMatter(1)">
                <div class="ministry-tit">
                  {{titles && titles[1] && titles[1].specialTitle}}
                </div>
                <div class="depart-chart">
                  <meet-chart :setData="meetData2"></meet-chart>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    <!-- 重点关注弹窗 -->
    <important-matter
      v-if="isOpenImportantMatterDialog"
      @closeDialog="isOpenImportantMatterDialog = false"
      :cityList="cityList"
      :title="dialogTitle"
      :isOpen="isOpenImportantMatterDialog"
    ></important-matter>
    </div>
</template>
<script>
// 系统业务
import {
  queryData,
  queryProjectSpecialList,
  queryOrganList
} from "@/api/newDriverCabin/index";
import importantMatter from "@/views/newDriverCabin/dialog/importantMatter";
import meetChart from "@/components/Echarts/vue-echart/meet-chart";
export default {
  name: 'department-meeting-part',
  components: {
    importantMatter,
    meetChart,
  },
  data() {
    return {
      isOpenImportantMatterDialog: false,
      cityList: [],
      meetData1: [],
      meetData2: [],
      titles: [],
      dialogTitle: {}
    }
  },
  props: {
  },
  created() {
    this.getCityList(2);
    this.getTitleList();
  },
  methods: {
    openImportantMatter(index) {
      this.dialogTitle = this.titles[index];
      this.isOpenImportantMatterDialog = true;
    },
    // 初始化气泡图
    getScatterData(id, name) {
      queryData({
        tn: 15,
        functionName: "重点关注高频词15",
        queryParam: `article_id=${id}`,
        orderParam: "amount=desc"
      }).then(res => {
        console.log("重点关注高频词tn:" + 15);
        this[name] = res.slice(0, 20).map(ele => {
          return {
            name: ele.word + ele.amount,
            value: ele.amount
          };
        });
      });
    },
    getTitleList() {
      queryProjectSpecialList({
        functionName: `查询重点关注标题`
      }).then(res => {
        this.titles = res;
        res.forEach((element, i) => {
          this.getScatterData(element.id, 'meetData' + (i + 1));
        });
      });
    },
    getCityList(type) {
      // 1同级 | 2 下级市区
      queryOrganList({
        functionName: `查询部委列表、省列表`,
        type
      }).then(res => {
        this.cityList = res;
      });
    },
  }
}
</script>
<style lang="scss">
@media (max-width: 992.98px) {
  .depart-meet-content {
    background-image: url("../../../assets/images/dirverCabin//content-slide.png");
  }
}
.depart-meet {
  position: relative;
  @media (max-width: 992.98px) {
    height: 420px;
    .el-row {
      padding-top: 20px;
      height: 50%;
      &>div:nth-of-type(2) {
        margin-top: 20px;
      }
    }
  }
  .depart-meet-line {
    position: absolute;
    left: 50%;
    top: 10%;
    width: 1px;
    height: 85%;
    background: linear-gradient(to top, rgba(3,139,255,1) 0%,rgba(11,228,238,1) 50%, rgba(3,139,255,1) 100%);
    @media (max-width: 992.98px) {
      display: none;
    }
  }
  .ministry-tit {
    font-size: 16px;
    text-align: center;
    color: rgba(11,228,238,.8);
  }
  .depart-chart {
    height: calc(100% - 25px);
  }
}
</style>

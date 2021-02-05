<template>
  <div class="baixingguanzhu-block block-bg">
    <div class="block-tab block-tab-top">
      <div class="block-tab-slide">
        <span class="block-tab-word">全国部委来信趋势</span>
      </div>
    </div>
    <div class="baixingguanzhu-content">
      <div class="bottom-content height100">
        <pictorialBarChart :setData="pictorialBarData" />
      </div>
    </div>
  </div>
</template>
<script>
// 系统业务
import { queryData } from "@/api/newDriverCabin/index";
//图表组件
import pictorialBarChart from "@/components/Echarts/vue-echart/pictorial-bar-chart";
export default {
  name: 'right-department-gz-block',
  components: {
    pictorialBarChart
  },
  data() {
    return {
      pictorialBarData: {
        xData: [],
        yData: []
      },
    }
  },
  props: {
  },
  created(){
    //来信
    this.initPictorialBarData();
  },
  methods: {
    //来信趋势
    initPictorialBarData() {
      queryData({
        tn: 10,
        functionName: "来信趋势10",
        queryParam: "data_type=1",
        orderParam: "year=asc"
      }).then(res => {
        console.log("来信趋势tn:" + 10);
        let xData = [];
        let yData = [];
        res.forEach(ele => {
          xData.push(ele.year);
          yData.push(ele.amount);
        });
        this.pictorialBarData = {
          xData,
          yData
        };
      });
    },
  }
}
</script>

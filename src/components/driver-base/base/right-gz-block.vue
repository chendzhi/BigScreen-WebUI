<template>
  <div class="baixingguanzhu-block block-bg">
    <div class="block-tab block-tab-top">
      <div class="block-tab-slide">
        <span class="block-tab-word">民众热搜</span>
      </div>
      <!-- <div class="block-tab-slide block-tab-slide-right fr">
                  <span class="block-tab-btn">部门</span>
                  <span class="block-tab-btn active-btn">地方</span>
                </div> -->
    </div>
    <div class="baixingguanzhu-content">
      <div class="bottom-content height100">
        <ul class="peopleAttention-ul-title">
          <li class="peopleAttention-li-title flex align-center">
            <span class="ellipsis">{{ "地方" }}</span>
            <span class="ellipsis">百姓关注热点</span>
          </li>
        </ul>
        <vue-seamless-scroll
          :data="hotPointList"
          :class-option="optionSetting"
          class="seamless-warp"
        >
          <ul class="peopleAttention-ul">
            <li
              class="peopleAttention-li flex align-center"
              v-for="(item, index) in hotPointList"
              :key="index"
            >
              <!-- <span class="ellipsis"> · {{ item.department }} </span> -->
              <el-tooltip
                class="text-info"
                effect="dark"
                placement="top"
                :tabindex="index"
              >
                <div slot="content" class="tooltip-content tooltip-content2">
                  {{ item.department }}
                </div>
                <span class="ellipsis">
                  {{ item.department }}
                </span>
              </el-tooltip>
              <el-tooltip
                class="text-info"
                effect="dark"
                placement="top"
                :tabindex="index"
              >
                <div slot="content" class="tooltip-content tooltip-content2">
                  {{ item.hot_point }}
                </div>
                <span class="ellipsis">
                  {{ item.hot_point }}
                </span>
              </el-tooltip>
            </li>
          </ul>
        </vue-seamless-scroll>
      </div>
    </div>
  </div>
</template>
<script>
// 系统业务
import { mapGetters } from "vuex";
import { queryData } from "@/api/newDriverCabin/index";
import vueSeamlessScroll from "vue-seamless-scroll";
//图表组件
export default {
  name: "right-gz-block",
  components: {
    vueSeamlessScroll
  },
  data() {
    return {
      hotPointList: []
    };
  },
  created() {
    this.getHotPoint();
  },
  computed: {
    ...mapGetters(["user"]),
    optionSetting() {
      return {
        step: 0.2, // 数值越大速度滚动越快
        limitMoveNum: 5, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: false, // 开启数据实时监控刷新dom
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 1000 // 单步运动停止的时间(默认值1000ms)
      };
    }
  },
  methods: {
    getHotPoint() {
      // let code = this.user.organCode;
      // if (!code) return;
      queryData({
        tn: 36,
        functionName: "民众热搜36",
        // queryParam: `organ_code=${code}`,
        queryParam: ``,
        orderParam: "data_time=desc"
      }).then(res => {
        console.log('民众热搜tn：---- 36')
        this.hotPointList = res;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.tooltip-content2 {
  width: 100% !important;
  padding: 8px 0;
}
</style>

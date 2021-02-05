<template>
  <div class="driver-box">
    <div class="driver-header-box clearfix">
      <div class="sys-title">{{ (user && user.productTitle) || "开普云胜策大数据平台" }}</div>
      <div class="header-btn-wrap flex">
        <div class="map-customization" @click="openSetting">
          <a>系统设置</a>
        </div>
        <div class="map-customization" @click="openMessage">
          <a>领导意见</a>
        </div>
      </div>
    </div>
    <div class="driver-main-box">
      <el-row class="el-row-wrapper clearfix" type="flex">
        <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
          <div class="content-wrap content-wrap-slide">
            <politics-voice-transmit :showDialog="false"></politics-voice-transmit>
            <left-attention-block></left-attention-block>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <div class="content-wrap">
            <department-attention-part
              :treemapData="treemapData"
              @onChangeAreaDate="changeAreaMapDate"
            ></department-attention-part>
            <department-meet-part :meetData="meetData"></department-meet-part>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
          <div class="content-wrap content-wrap-slide">
            <right-action-block
              title="全国部委来信热词"
              :showDialog="false"
              :queryDatas="letterQuery"
            ></right-action-block>
            <right-department-mail-block></right-department-mail-block>
            <right-department-gz-block></right-department-gz-block>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 设置 弹框-->
    <setting-dialog
      v-if="isSetting"
      @closeDialog="isSetting = false"
      :isOpen="isSetting"
    ></setting-dialog>
    <!-- 留言板 弹框-->
    <message-dialog
      v-if="isMessage"
      @closeDialog="isMessage = false"
      :isOpen="isMessage"
    ></message-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
// 系统业务
import { queryData } from "@/api/newDriverCabin/index";
// dialog
import settingDialog from "@/views/newDriverCabin/dialog/setting-dialog";
import messageDialog from "@/views/newDriverCabin/dialog/message-dialog";
// 组件
import PoliticsVoiceTransmit from "@/components/driver-base/base/politics-voice-transmit";
import leftAttentionBlock from "@/components/driver-base/base/left-attention-block";
import departmentAttentionPart from "@/components/driver-base/base/department-attention-part";
import departmentMeetPart from "@/components/driver-base/base/department-meeting-part";
import rightActionBlock from "@/components/driver-base/base/right-action-block";
import rightDepartmentMailBlock from "@/components/driver-base/base/right-department-mail-block";
import rightDepartmentGzBlock from "@/components/driver-base/base/right-department-gz-block";

export default {
  components: {
    PoliticsVoiceTransmit,
    leftAttentionBlock,
    departmentAttentionPart,
    departmentMeetPart,
    rightActionBlock,
    rightDepartmentMailBlock,
    rightDepartmentGzBlock,
    settingDialog,
    messageDialog
  },
  data() {
    return {
      year: new Date().getFullYear(),
      isSetting: false,
      isMessage: false,
      chuandiList: [], // 政生传递
      treemapData: [], // 领域矩阵树
      meetData: [],
      letterQuery: {
        type: 'bw',
        tn: 9
      }
    };
  },
  computed: {
    ...mapGetters([
      'getterCurrentDepartmentLeader',
      'user'
    ]),
  },
  watch: {
    getterCurrentDepartmentLeader() {
      // 切换领导 - 更新领域
      this.getTreeMapData(this.year);
    }
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      // 领域
      this.getTreeMapData(this.year);
    },
    changeAreaMapDate(year) {
      console.log(year);
      this.getTreeMapData(year);
    },
    getTreeMapData(year) {
      if (!this.getterCurrentLeader || !this.getterCurrentLeader.leaderName)
        return;
      this.treemapData = [];
      queryData({
        tn: 20,
        functionName: "领域20",
        queryParam: `year=${year},leader_name=${
          this.getterCurrentLeader.leaderName
        }`,
        orderParam: "amount=desc"
      }).then(res => {
        console.log("领域tn: 20");
        this.treemapData = [];
        let num = 60;
        let num2 = 64;
        this.treemapData = res.map((ele, i) => {
          let mapAre = ele.amount === 0 ? 1 : ele.amount;
          let colors = ["HSLA(201,100%,"+num+"%, 1)", "HSLA(201,100%,"+num2+"%, 1)"];
          num -= 2
          num2 -= 2
          return {
            name: ele.name,
            value: [mapAre, 50, ele.amount],
            itemStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: colors[0] // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: colors[1] // 100% 处的颜色
                  }
                ],
                globalCoord: false // 缺省为 false
              }
            }
          };
        });
        return;
        let list = res.map(ele => ele.amount).filter(ele => ele !== 0);
        let max = Math.max(...list);
        let min = Math.min(...list);
        let v =
          Math.floor((max - min) / 20) > 1 ? Math.floor((max - min) / 20) : 1;
        let pre = 0;
        let mapAre = max;
        let preMapAre = max;
        let index = 0;
        let all = res.map(ele => ele.amount);
        // 计算相对平均
        let left = this.getIndex(all, 3);
        let mid = this.getIndex(all, 13);
        let treemapData = res.map((ele, i) => {
          let val = ele.amount;
          let color = "#079bdc";
          if (val === pre) {
            mapAre = preMapAre;
          } else {
            mapAre = max - (v + index * 0.1) * index;
            pre = val;
            preMapAre = mapAre;
            index++;
          }
          if (mapAre < 0) {
            mapAre = v;
          }
          // 对0值数据 面积在做缩小调整
          if (mapAre > v && val === 0) {
            mapAre = preMapAre * 0.7;
          }
          if (i <= left && val > 0) {
            color = "#feb063";
          } else if (i > left && i <= mid && val > 0) {
            color = "#2267d6";
          } else {
            color = "#079bdc";
          }
          return {
            name: ele.name,
            value: [mapAre, 50, val],
            itemStyle: {
              // color
            }
          };
        });
        this.treemapData = treemapData.sort(function() {
          return (0.5 - Math.random());
        });
        console.log(treemapData)
      });
    },
    openSetting() {
      this.isSetting = true;
    },
    openMessage() {
      this.isMessage = true;
    }
  }
};
</script>

<template>
  <div class="driver-box">
    <div class="driver-header-box clearfix">
      <div class="sys-title">
        {{ (user && user.productTitle) || "开普云胜策大数据平台" }}
      </div>
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
            <politics-voice-transmit></politics-voice-transmit>
            <left-attention-block></left-attention-block>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <div class="content-wrap">
            <attention-part
              :treemapData="treemapData"
              @onChangeAreaDate="changeAreaMapDate"
            ></attention-part>
            <meet-part :cityList="cityList"></meet-part>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
          <div class="content-wrap content-wrap-slide">
            <right-action-block
              :title="actionTitle"
              :cityList="subCityList"
            ></right-action-block>
            <right-mail-block
              :cityList="cityList"
              :subCityList="subCityList"
            ></right-mail-block>
            <right-gz-block></right-gz-block>
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
import { mapGetters } from "vuex";
// 系统业务
import {
  queryData,
  queryOrganList,
  querySubOrganByType
} from "@/api/newDriverCabin/index";
// dialog
import settingDialog from "@/views/newDriverCabin/dialog/setting-dialog";
import messageDialog from "@/views/newDriverCabin/dialog/message-dialog";
// 组件
import PoliticsVoiceTransmit from "@/components/driver-base/base/politics-voice-transmit"; // 政声传递
import leftAttentionBlock from "@/components/driver-base/base/left-attention-block";
import attentionPart from "@/components/driver-base/base/attention-part";
import meetPart from "@/components/driver-base/base/meeting-part";
// import right from "@/components/driver-base/right";
import rightActionBlock from "@/components/driver-base/base/right-action-block";
import rightMailBlock from "@/components/driver-base/base/right-mail-block";
import rightGzBlock from "@/components/driver-base/base/right-gz-block";

export default {
  components: {
    PoliticsVoiceTransmit,
    leftAttentionBlock,
    attentionPart,
    meetPart,
    rightActionBlock,
    rightMailBlock,
    rightGzBlock,
    settingDialog,
    messageDialog
  },
  data() {
    return {
      year: new Date().getFullYear(),
      isSetting: false,
      isMessage: false,
      treemapData: [], // 领域矩阵树
      meetData: [],
      meetingNumber: 0,
      cityList: [],
      subCityList: []
    };
  },
  computed: {
    ...mapGetters(["getterCurrentLeader", "user"]),
    actionTitle() {
      let subCityListString = this.subCityList.map(ele => ele.organName).join(',');
      let city = ['北京市', '天津市', '上海市', '重庆市'];
      let isCity = (this.user.organName.indexOf('市') > -1) && !city.includes(this.user.organName);
      let name = '市州行动';
      if (isCity) {
        const isXJ = subCityListString.indexOf('县,') > -1;
        const isQJ = subCityListString.indexOf('区,') > -1;
        if (isXJ && isQJ) {
          name = '区县行动';
        } else if (isXJ) {
          name = '县长行动'
        } else if (isQJ) {
          name = '区长行动'
        }
        return name;
      }
      const isSJ = subCityListString.indexOf('市,') > -1;
      const isSZ = subCityListString.indexOf('州,') > -1;
      const isSX = subCityListString.indexOf('县,') > -1;
      const isSQ = subCityListString.indexOf('区,') > -1;
      if (isSZ) {
        name = '市州行动';
      } else if (isSX) {
        name = '市县行动'
      } else if (isSQ) {
        name = '市区行动'
      } else {
        name = '市长行动';
      }
      return name;
    }
  },
  watch: {
    getterCurrentLeader() {
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
      // 获取省市名称列表
      this.getCityList(1);
      this.getCityList(2);
    },
    changeAreaMapDate(year) {
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
        this.treemapData = res.map((ele, i) => {
          return {
            name: ele.name,
            value: ele.amount || 0
          }
        })
        return;
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
    getIndex(arr, end) {
      let endNum = arr[end];
      console.log(endNum);
      if (!endNum) {
        return this.getIndex(arr, end - 1);
      }
      return arr.lastIndexOf(endNum);
    },
    getCityList(type) {
      // 1同级 | 2 下级市区
      type = !type || type === 1 ? 1 : 2;
      let cityName = !type || type === 1 ? "cityList" : "subCityList";
      querySubOrganByType({
        functionName: `省/市名称${type}`,
        type
      }).then(res => {
        this[cityName] = res;
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

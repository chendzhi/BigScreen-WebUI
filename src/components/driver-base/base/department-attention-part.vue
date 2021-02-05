<template>
  <div class="map-content">
    <div class="map-title-content">
      <div class="flex justify-between">
        <div class="map-title">注意力分配</div>
        <div class="right-btn flex">
          <div
            @click.self="isShowAttention = !isShowAttention"
            class="map-title map-attention-title"
            v-if="false"
          >
            重点关注
            <div v-show="isShowAttention" class="attention-dialog-pop">
              <div
                @click.stop="isShowAttention = false"
                class="attention-close-wrap"
              >
                <i class="el-icon-close icon"></i>
              </div>
              <div
                @click.stop="openImportantMatter"
                class="attention-btn attention-btn-fir"
              >
                一次事一件办
              </div>
              <div class="attention-btn">中部崛起看湖南</div>
            </div>
          </div>
          <div
            @click="showMember"
            v-clickoutside="hideMember"
            :class="['map-title', 'leader-select', {
              'leader-select--active': isShowMember
            }]">
            <div class="leader-select_head">
              <div class="leader-select_head_left">
                <i
                  class="leader-avatar"
                  :style="`backgroundImage: url(${getterCurrentLeader && getterCurrentLeader.leaderIcon})`">
                </i>
                <span class="leader-name">{{getterCurrentLeader && getterCurrentLeader.leaderName}}</span>
              </div>
              <div class="leader-select_head_split-line"></div>
              <div class="leader-select_head_right">
                <span class="hide-xs">部委领导成员</span>
                <i class="leader-select_dropdown-icon el-icon-arrow-down"></i>
              </div>
            </div>
            <div
              v-show="isShowMember"
              class="member-dialog-province member-dialog-depart province-member-bg"
            >
              <div class="member-close-wrap">
                <i
                  @click.stop="hideMember"
                  class="el-icon-close icon"
                ></i>
              </div>
              <div class="member-wrap member-depart-wrap">
                <div class="member-card" @click.stop="changeLeader(leader)">
                  <div
                    class="member-img"
                    :style="`backgroundImage: url(${leader && leader.leaderIcon})`"
                  ></div>
                  <div class="member-name">{{ leader && leader.leaderName }}</div>
                  <div class="member-name member-post">职务</div>
                </div>
                <div class="member-term-card member-department-term-card">
                  <div class="flex" v-for="item in leaderCount" :key="item">
                    <div
                      class="member-card"
                      v-for="ele in leaderList.slice((item - 1) * 3, item * 3)"
                      :key="ele.id"
                      @click.stop="changeLeader(ele)"
                    >
                      <div
                        class="member-img"
                        :style="`backgroundImage: url(${ele.leaderIcon})`"
                      ></div>
                      <div class="member-name">{{ ele.leaderName }}</div>
                      <div class="member-name member-post">职务</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="map-title-china-filed flex justify-between align-center">
        <div class="tabs flex align-center">
          <div
            @click="chanegeMapTabFlag(0)"
            :class="{ active: mapTabFlag == 0 ? true : false }"
            class="map-title-btn-wrap flex align-center"
          >
            <span class="map-title-icon icon-zuji"></span>
            <span class="map-title-btn">足迹</span>
          </div>
          <div
            @click="chanegeMapTabFlag(1)"
            :class="{ active: mapTabFlag == 1 ? true : false }"
            class="map-title-btn-wrap flex align-center"
          >
            <span class="map-title-icon icon-lingyu"></span>
            <span class="map-title-btn">领域</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 足迹 begin -->
    <div
      v-if="mapTabFlag === 0"
      :class="['foot-mark-wrap', {'foot-mark-wrap--full-screen': footMark.isFullScreen}]">
      <i :class="[
        'foot-mark_full-screen-icon',
        {
          'el-icon-full-screen': !footMark.isFullScreen,
          'el-icon-copy-document': footMark.isFullScreen
        }
        ]"
        :title="footMark.isFullScreen ? '解除全屏' : '全屏展示'"
        @click="onFootMarkFullScreenToggle">
      </i>
      <foot-mark
        ref="footMark"
        :accessScope="footMark.accessScope"
        :isFullScreen="footMark.isFullScreen">
      </foot-mark>
    </div>
    <!-- 足迹 end -->

    <div v-if="mapTabFlag === 1" class="map-area">
      <div class="map-field">
        <field-chart :setData="treemapData"></field-chart>
      </div>
    </div>
    <div class="mounth-wrap flex justify-center"
      v-if="mapTabFlag === 1">
      <el-select
        class="map-select"
        @change="changeAreaDate"
        v-model="areaYear"
        placeholder="请选择"
      >
        <el-option
          v-for="item in areaYears"
          :key="item"
          :label="item"
          :value="item"
        ></el-option>
      </el-select>
    </div>
    <!-- 一件事一次办 -->
    <one-matter-one-deal
      v-if="isOpenOneMatterOneDealDialog"
      @closeDialog="isOpenOneMatterOneDealDialog = false"
      :isOpen="isOpenOneMatterOneDealDialog"
    ></one-matter-one-deal>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import {getRequestYears} from '@/utils'
import { clickoutside } from "@/utils/directives";
import { queryLeaderList } from "@/api/newDriverCabin/index";
import oneMatterOneDeal from "@/views/newDriverCabin/dialog/oneMatterOneDeal";
import fieldChart from "@/components/Echarts/vue-echart/field-chart";
import FootMark from "@/components/driver-base/base/foot-mark"; // 足迹
export default {
  name: "department-attention-part",
  directives: { clickoutside },
  components: {
    oneMatterOneDeal,
    fieldChart,
    FootMark
  },
  data() {
    return {
      isOpenOneMatterOneDealDialog: false,
      isShowAttention: false,
      isShowMember: false,
      leaderList: [],
      leader: {},
      mapTabFlag: 0,
      areaYear: new Date().getFullYear(),
      areaYears: [],
      // 足迹data
      footMark: {
        isFullScreen: false,
        accessScope: 1 // 访问范围：1全国、2省内、3市内
      }
    };
  },
  props: {
    treemapData: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapGetters(["getterCurrentLeader"]),
    leaderCount() {
      return Math.ceil(this.leaderList.length / 3);
    }
  },
  watch: {
    // 领导变化
    'getterCurrentLeader.leaderName' (val) {
      this.getYear()
    }
  },
  created() {
    this.getLeaders();
  },
  methods: {
    async getYear() {
      this.areaYears = await getRequestYears(20, this.getterCurrentLeader.leaderName);
      this.areaYear = this.areaYears[0];
    },
    changeAreaDate(val) {
      // 领域
      this.areaYear = val;
      this.$emit('onChangeAreaDate', val);
    },
    openImportantMatter() {
      this.isOpenOneMatterOneDealDialog = true;
    },
    chanegeMapTabFlag(index) {
      // 领域切换
      this.mapTabFlag = index;
      this.mounth = "";
    },
    changeLeader(leader) {
      if (this.getterCurrentLeader.id === leader.id) return;
      this.hideMember();
      this.$store.commit("leader/CHANGE_CURRENT_LEADER", leader);
    },
    getLeaders() {
      queryLeaderList({
        // organCode: "110000"
      }).then(res => {
        this.leaderList = res.slice(1);
        this.leader = res[0];
        this.$store.commit("leader/CHANGE_CURRENT_LEADER", res[0]);
        this.$store.commit("leader/SET_LEADERS", res);
        this.getYear();
      });
    },
    showMember () {
      this.isShowMember = true
    },
    hideMember () {
      this.isShowMember = false
    },
    // 足迹-访问范围点击
    onFootMarkScopeClick (val) {
      this.footMark.accessScope = val
    },
    // 足迹-全屏
    onFootMarkFullScreenToggle () {
      this.footMark.isFullScreen = !this.footMark.isFullScreen
      this.$nextTick(() => {
        this.$refs.footMark.mapResize()
      })
    }
  }
};
</script>
<style lang="scss">
.member-dialog-depart {
  width: 400px;
  .member-close-wrap {
    @media (max-width: 1366.98px) {
      padding-left: 45px;
      padding-right: 45px;
    }
  }
}
.member-depart-wrap {
  padding: 0 50px;
  @media (max-width: 1366.98px) {
    padding: 0 40px;
  }
  .member-term-card {
    .member-card {
      width: 33.33%;
      padding-top: 10px;
    }
  }
  .member-post {
    color: rgba(73, 174, 232, 1);
    font-size: 12px;
    text-align: center;
  }
}

.map-title-content {
  position: relative;
  z-index: 10;
}
.foot-mark-wrap {
  position: absolute;
  // background: rgba(255,255,255,.6);
  top: 84px;
  bottom: 0;
  left: 0;
  right: 0;

  .foot-mark {
    position: absolute;
    top: -35px;
    right: 0;
    bottom: 0;
    left: 0;
    height: auto;
  }

  .foot-mark_full-screen-icon {
    position: absolute;
    top: 46px;
    right: 10px;
    z-index: 9;
    color: #25d8fd;
    opacity: .9;
    cursor: pointer;
  }
  // 全屏状态
  &--full-screen {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 20px;
    z-index: 9999999;
    background-color: rgba(0,0,0,.5);
    .foot-mark_full-screen-icon {
      top: 20px;
      right: 20px;
    }
  }
}

@media only screen and (max-width: 1366.98px) {
  .foot-mark-wrap {
    .foot-mark_full-screen-icon {
      top: 6px;
    }
  }
}
</style>

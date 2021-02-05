<template>
  <div class="map-content">
    <div class="map-title-content">
      <div class="flex justify-between">
        <div class="flex align-center">
          <div class="map-title">注意力分配</div>
          <!-- <i class="xs-icon show-xs" :style="`backgroundImage: url(${getterCurrentLeader && getterCurrentLeader.leaderIcon})`"></i> -->
        </div>
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
                <span class="hide-xs">{{ organName }}领导成员</span>
                <i class="leader-select_dropdown-icon el-icon-arrow-down"></i>
              </div>
            </div>
            <div
              v-show="isShowMember"
              class="leader-select_body member-dialog-province province-member-bg"
            >
              <div class="member-close-wrap">
                <i @click.stop="hideMember" class="el-icon-close icon"></i>
              </div>
              <div class="member-wrap">
                <div
                  class="member-title"
                  v-show="/1|2/.test(leader.leaderLevel)"
                >
                  —— {{ /2/.test(leader.leaderLevel) ? "代" : ""
                  }}{{ organName }}长 ——
                </div>
                <div
                  class="member-card"
                  @click.stop="changeLeader(leader)"
                  v-show="/1|2/.test(leader.leaderLevel)"
                >
                  <div
                    class="member-img"
                    :style="
                      `backgroundImage: url(${leader && leader.leaderIcon})`
                    "
                  ></div>
                  <div class="member-name">
                    {{ leader && leader.leaderName }}
                  </div>
                </div>
                <div class="member-title">—— 副{{ organName }}长 ——</div>
                <div class="flex member-term-card">
                  <div
                    class="member-card"
                    v-for="item in leaderList"
                    :key="item.id"
                    @click.stop="changeLeader(item)"
                  >
                    <div
                      class="member-img"
                      :style="`backgroundImage: url(${item.leaderIcon})`"
                    ></div>
                    <div class="member-name">{{ item.leaderName }}</div>
                  </div>
                  <!-- <div class="member-card">
                    <div class="member-img"></div>
                    <div class="member-name">人名</div>
                  </div>
                  <div class="member-card">
                    <div class="member-img"></div>
                    <div class="member-name">人名</div>
                  </div>
                  <div class="member-card">
                    <div class="member-img"></div>
                    <div class="member-name">人名</div>
                  </div> -->
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
        <div class="map-change-btn flex align-center" v-show="mapTabFlag == 0">
          <span
            v-show="user.organType === 2"
            :class="[
              'block-tab-btn',
              {
                'active-btn': footMark.accessScope === 2
              }
            ]"
            @click="onFootMarkScopeClick(2)"
          >
            <!-- 直辖市走省逻辑 但显示为市内 -->
            {{ organName }}内
          </span>
          <span
            v-show="user.organType === 3"
            :class="[
              'block-tab-btn',
              {
                'active-btn': footMark.accessScope === 3
              }
            ]"
            @click="onFootMarkScopeClick(3)"
          >
            市内
          </span>
          <span
            :class="[
              'block-tab-btn',
              {
                'active-btn': footMark.accessScope === 1
              }
            ]"
            @click="onFootMarkScopeClick(1)"
          >
            国内
          </span>
        </div>
      </div>
    </div>
    <!-- 足迹 begin -->
    <div
      v-if="mapTabFlag === 0"
      :class="[
        'foot-mark-wrap',
        { 'foot-mark-wrap--full-screen': footMark.isFullScreen }
      ]"
    >
      <i
        :class="[
          'foot-mark_full-screen-icon',
          {
            'el-icon-full-screen': !footMark.isFullScreen,
            'el-icon-copy-document': footMark.isFullScreen
          }
        ]"
        :title="footMark.isFullScreen ? '解除全屏' : '全屏展示'"
        @click="onFootMarkFullScreenToggle"
      >
      </i>
      <foot-mark
        ref="footMark"
        :accessScope="footMark.accessScope"
        :isFullScreen="footMark.isFullScreen"
      >
      </foot-mark>
    </div>
    <!-- 足迹 end -->

    <div v-if="mapTabFlag === 1" class="map-area">
      <div class="map-field">
        <field :setData="treemapData"></field>
        <!-- <field-chart :setData="treemapData"></field-chart> -->
      </div>
    </div>
    <div class="mounth-wrap flex justify-center" v-show="mapTabFlag === 1">
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
import { clickoutside } from "@/utils/directives";
import { getRequestYears } from "@/utils";
import { getUser } from "@/utils/auth";
import enumConf from "@/config/enum";
// 系统业务
import { queryLeaderList } from "@/api/newDriverCabin/index";
import oneMatterOneDeal from "@/views/newDriverCabin/dialog/oneMatterOneDeal";
// import fieldChart from "@/components/Echarts/vue-echart/field-chart";
import field from "@/components/base/field";
import FootMark from "@/components/driver-base/base/foot-mark"; // 足迹

export default {
  directives: { clickoutside },
  name: "attention-part",
  components: {
    oneMatterOneDeal,
    field,
    FootMark
  },
  data() {
    let fn = {
      getAccessScope: function() {
        // 访问范围：1全国、2省内、3市内
        let user = getUser();
        let scope = 1;
        if (user.organType === enumConf.common.organType.province) {
          scope = 2;
        } else if (user.organType === enumConf.common.organType.city) {
          scope = 3;
        }
        return scope;
      }
    };
    return {
      organName: "省",
      leaderList: [],
      leader: {},
      isOpenOneMatterOneDealDialog: false,
      isShowAttention: false,
      isShowMember: false,
      mapTabFlag: 0,
      areaYear: new Date().getFullYear(),
      areaYears: [],
      // 足迹data
      footMark: {
        isFullScreen: false,
        accessScope: fn.getAccessScope() // 访问范围：1全国、2省内、3市内
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
    ...mapGetters(["user", "getterCurrentLeader"])
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
      this.$emit("onChangeAreaDate", val);
    },
    openImportantMatter() {
      this.isOpenOneMatterOneDealDialog = true;
    },
    // 足迹领域切换
    chanegeMapTabFlag(index) {
      this.mapTabFlag = index;
    },
    changeLeader(leader) {
      if (this.getterCurrentLeader.id === leader.id) return;
      this.hideMember();
      this.$store.commit("leader/CHANGE_CURRENT_LEADER", leader);
    },
    getLeaders() {
      queryLeaderList({
        // organCode: '110000'
      }).then(res => {
        this.leaderList = res.slice(1);
        this.leader = res[0];
        if (res[0] && res[0].organName.indexOf("市") > -1) {
          this.organName = "市";
        } else {
          this.organName = "省";
        }
        this.$store.commit("leader/CHANGE_CURRENT_LEADER", res[0]);
        this.$store.commit("leader/SET_LEADERS", res);
        this.getYear();
      });
    },
    showMember() {
      this.isShowMember = true;
    },
    hideMember() {
      this.isShowMember = false;
    },
    // 足迹-访问范围点击
    onFootMarkScopeClick(val) {
      this.footMark.accessScope = val;
    },
    // 足迹-全屏
    onFootMarkFullScreenToggle() {
      this.footMark.isFullScreen = !this.footMark.isFullScreen;
      this.$nextTick(() => {
        this.$refs.footMark.mapResize();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
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
    top: 32px;
    right: 20px;
    z-index: 9;
    color: #25d8fd;
    opacity: 0.9;
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
    background-color: rgba(0, 0, 0, 0.5);
    .foot-mark_full-screen-icon {
      top: 20px!important;
      right: 20px!important;
    }
  }
}

@media only screen and (max-width: 1366.98px) {
  .foot-mark-wrap {
    .foot-mark_full-screen-icon {
      top: 1px;
      right: 15px;
    }
  }
}
</style>

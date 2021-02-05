<template>
  <div>
    <div class="mobile-top-bg">
      <div class="mobile-top">
        <!-- <img src="@/assets/images/mobilePhone/logo.png" alt="" class="logo" /> -->
        <!-- <a href="#">
          <img src="@/assets/images/mobilePhone/username.png" alt="" />
        </a> -->
      </div>
    </div>
    <!-- 导航菜单 -->
    <el-menu
      :default-active="$route.path"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item index="/"><router-link to="/">首页</router-link></el-menu-item>
      <el-menu-item index="/leader-footprint"><router-link to="/leader-footprint">领导足迹</router-link></el-menu-item>
      <el-menu-item index="/mobile-politicsSpread"><router-link to="/mobile-politicsSpread">政声传递</router-link></el-menu-item>
      <el-menu-item index="/politics-follow"><router-link to="/politics-follow">政关注</router-link></el-menu-item>
       <el-menu-item index="/mobile-directors"><router-link to="/mobile-directors">透视常务会</router-link></el-menu-item>
      <!-- <el-menu-item index="/mobile-doubleCity"><router-link to="/mobile-doubleCity">成渝双城</router-link></el-menu-item> -->
      <!-- <el-menu-item index="/mobile-digitalEco"><router-link to="/mobile-digitalEco">数字经济</router-link></el-menu-item> -->
    </el-menu>

    <!-- <div class="mobile-nav">
      <ul class="tab-head">
        <li class="tab-head-item on">首页</li>
        <li class="tab-head-item">领导足迹</li>
        <li class="tab-head-item">政声传递</li>
        <li class="tab-head-item">政关注</li>
        <li class="tab-head-item">透视常务会</li>
        <li class="tab-head-item">成渝双城</li>
        <li class="tab-head-item">数字经济</li>
      </ul> -->
      <!-- <el-dropdown trigger="click" class="navmenu">
        <span class="el-dropdown-link">
          <img src="@/assets/images/mobilePhone/navmenu.png" alt="" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item class="clearfix">
            <li class="tab-head-item">透视常务会</li>
          </el-dropdown-item>
          <el-dropdown-item class="clearfix">
            <li class="tab-head-item">成渝双城</li>
          </el-dropdown-item>
          <el-dropdown-item class="clearfix">
            <li class="tab-head-item">数字经济</li>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
    <!-- </div> -->
  </div>
</template>

<script>
import "@/assets/styles/mobilePhone.scss";
import "@/assets/styles/mobilecommon.scss";
fnResize();
window.onresize = function () {
  fnResize();
};
function fnResize() {
  var deviceWidth = document.documentElement.clientWidth || window.innerWidth;
  if (deviceWidth >= 750) {
    deviceWidth = 750;
  }
  if (deviceWidth <= 320) {
    deviceWidth = 320;
  }
  document.documentElement.style.fontSize = (deviceWidth / 414) * 16 + "px";
}

export default {
  data() {
    return {
      activeIndex: "1",
    };
  },
  methods: {
    handleSelect(key, keyPath) {
    },
  },
  props: {
    top: {},
  },
};
</script>

<style scoped lang="scss">
@function px2rem( $px ){
  @return $px/16 + rem;
}

$designWidth : 414; //750 是设计稿的宽度，要根据设计稿的宽度填写。

.el-menu--horizontal>.el-menu-item{
  height:px2rem(45);
  line-height: px2rem(45);
}
.el-menu-item{
  padding: 0 px2rem(10);
  color:#000;
}
</style>
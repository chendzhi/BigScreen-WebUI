<template>
  <div class="inte-mobile">
    <mobile-nav></mobile-nav>
    <div class="inte-mobile-main">
      <transition name="el-fade-in" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
import '@/assets/styles/integration.scss'
import settings from '@/settings'
import { getScreenMode } from '@/utils'
import MobileNav from './components/nav'
export default {
  name: 'Inte_Mobile',
  components: {
    MobileNav
  },
  beforeRouteEnter (to, from, next) {
    // 如果非手机端跳转pc端页面
    if (getScreenMode() !== 'xs') {
      next(`/product/${settings.product.integration.code}`)
    } else {
      next()
    }
  }
}
</script>

<style lang="scss" scoped>
.inte-mobile {
  position: relative;
  height: 100%;
  background-color: #000a77;
  background-image: url(../../../assets/images/integration/pg-bg-mobile.jpg);
  background-size: cover;
  background-position: center;
  z-index: 999;

  ::-webkit-scrollbar{width:0px; height:0px; } /* 这是针对缺省样式 (必须的) */
  ::-webkit-scrollbar-track{-webkit-box-shadow:inset 0 0 2px rgba(0,0,0,0); border-radius:0px; background-color:#152C7D;}/* 滚动条的滑轨背景颜色 */
  ::-webkit-scrollbar-thumb{border-radius:4px; -webkit-box-shadow:inset 0 0 2px rgba(0,0,0,0); background-color:rgba(43, 141, 449, 1); transition: all .2s linear;} /* 滑块颜色 */
  ::-webkit-scrollbar-thumb:hover{background-color:rgba(43, 141, 449, .8);}
  ::-webkit-scrollbar-corner {background-color: #152C7D;} /* 横向滚动条和纵向滚动条相交处尖角的颜色 */

  &-main {
    position: absolute;
    top: 54px;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 0 12px 12px 12px;
    overflow: auto;
  }
}
</style>

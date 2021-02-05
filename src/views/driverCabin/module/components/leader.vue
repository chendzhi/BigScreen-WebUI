<template>
  <!-- 领导 -->
  <el-row type="flex" class="row-bg leaderbg" justify="center">
    <el-col :span="6">
      <div class="grid-content">
        <div class="block">
          <el-avatar style="height: auto;width: 100px;" >
               <img :src="interLeader.img" class="leadimg"/>
          </el-avatar>
        </div>
      </div>
    </el-col>
    <el-col :span="3">
      <div class="grid-content"></div>
    </el-col>
    <el-col :span="6">
      <div class="grid-content leadername">
        <span>{{interLeader.name}}</span>
        <p>{{interLeader.position}}</p>
      </div>
    </el-col>
  </el-row>
</template>

<script>
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
  props: {
    leader:{
      type:Object,
      default:() => {}
    }
  },
  computed:{
  interLeader(){
      return this.leader
    }
  },
  data() {
    return {
      circleUrl:"https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
    }
  }
};
</script>

<style lang="scss">
/* 领导 */
@function px2rem( $px ){
  @return $px/16 + rem;
}

$designWidth : 414; //750 是设计稿的宽度，要根据设计稿的宽度填写。

.el-avatar {
  background: none;
}
.leadimg{
    border-radius: inherit;
    width:auto;
    height: px2rem(125) !important;
}
.el-avatar{
  border-radius: 0px;
}
.leaderbg {
  background: #e9f6ff;
  height: px2rem(135);
   padding: px2rem(5) 0;
}

.leadername {
  text-align: center;
  margin-top: px2rem(40);
}
.leadername span {
  color: #10568A;
    display: block;
    height: px2rem(30);
    line-height: px2rem(30);
    font-size: 28px;

}
.leadername p {
  color: #000;
    height: px2rem(40);
    line-height: px2rem(40);
    text-align: center;
    font-size: 18px;

}
</style>
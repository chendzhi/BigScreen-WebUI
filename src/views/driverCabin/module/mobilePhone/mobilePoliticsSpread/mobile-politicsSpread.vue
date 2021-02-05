<template>
  <div class="main">
    <!-- 头部 -->
    <top></top>

    <!-- <div class="leaderInfo">
      <div class="leader">
        <img :src='leaderInfo.imgUrl' alt="" />
        <div>
          <p>{{leaderInfo.name}}</p>
          <span>省长</span>
        </div>
      </div>
    </div> -->

    <!-- 领导 -->
    <leader :leader="leader" />

    <div class="spread">
      <div class="spreadtitle">
        <p>政声传递</p>
        <span>近30天</span>
      </div>
    </div>
    <politicsSpread
      :politicsSpread="politicsSpread"
      :groupName="groupName"
    ></politicsSpread>
    <!-- 政声传递 -->
  </div>
</template>
<script>
import axios from "axios";
import top from "../../components/top.vue";
import leader from "../../components/leader.vue";
import politicsSpread from "../../components/politicsSpread.vue";

export default {
  components: {
    top,
    leader,
    politicsSpread,
  },
  data() {
    return {
      leader: {
        name: "黄强",
        img:
          "http://103.203.219.146/scssspt/img/510000/20210201050603462185.jpg",
        position: "省长",
      },
      politicsSpread: {},
      leaderInfo: {
        imgUrl: "",
        name: "",
      },
      groupName: "政声传递",
    };
  },
  created() {
    let that = this;
    axios
      .get(
        "http://103.203.219.146/scssspt/api/screen/screen/queryLeaderList?organCode=510000"
      )
      .then((msg) => {
        msg.data.forEach(function (val, idx) {
          if (val.leaderLevel == "P1") {
            that.leaderInfo.imgUrl = val.leaderIcon;
            that.leaderInfo.name = val.leaderName;
          }
        });
      });
  },
};


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
</script>
<style lang="scss" scoped>
@function px2rem($px) {
  @return $px/16 + rem;
}

$designWidth: 414; //750 是设计稿的宽度，要根据设计稿的宽度填写。

.main ul {
  padding: 0 px2rem(10);
  margin: px2rem(5) 0 0;
  list-style: none;
}
.main .spread {
  padding: px2rem(10);
  // margin-top: px2rem(10);
  border-top: px2rem(3) solid #e6ebf8;
}
.main .spread .spreadtitle {
  width: 100%;
  height: px2rem(40);
}
.spread .spreadtitle p {
  float: left;
  width: 70%;
  height: px2rem(40);
  line-height: px2rem(40);
  font-weight: bold;
}
.spread .spreadtitle span {
  float: right;
  margin-top: px2rem(5);
  padding: 0 px2rem(18);
  height: px2rem(35);
  line-height: px2rem(36);
  border: 1px solid #e6ebf8;
  border-radius: px2rem(5);
  color: #666;
  font-size: px2rem(14);
}
.leaderInfo {
  padding-top: px2rem(10);
  width: 100%;
  height: px2rem(100);
  background: linear-gradient(to bottom right, #dfeffd, #f5faff);
}
.leaderInfo .leader {
  width: 50%;
  margin: 0 auto;
  text-align: center;
}
.leaderInfo .leader > * {
  margin: 0 px2rem(10);
  vertical-align: middle;
}
.leaderInfo .leader div {
  display: inline-block;
  width: 40%;
}
.leaderInfo .leader div p {
  margin-bottom: px2rem(8);
  width: 100%;
  height: px2rem(25);
  font-size: px2rem(16);
  background: #fff;
  line-height: px2rem(25);
  color: #4eb4d8;
}
.leaderInfo .leader div span {
  color: #999;
}
.leaderInfo img {
  width: px2rem(68);
  // height:68px;
  border-radius: 50%;
}
</style>
<template>
  <div class="inte-pg-intro">
    <div class="banner">
      <img class="banner_bg" src="./images/bg-banner.png" alt="">
      <div class="banner_main">
        <div class="banner_msg">
          <p class="banner_msg_title">开普云胜策领导驾驶舱</p>
          <p class="banner_msg_des">依托全国政府网站与政务新媒体统一信息资源库，提供领导注意力分配回顾提醒、政策精神传播情况分析、社情民意综合研判等功能的一体化大数据SaaS服务平台。</p>
        </div>
      </div>
    </div>
    <div class="icon-intro">
      <div class="container">
        <div class="icon-intro-item">
          <div class="icon-intro-item_icon">
            <img src="./images/icon-1.png">
          </div>
          <div class="icon-intro-item_intro">
            <p class="icon-intro-item_intro_msg">领导行动回顾提醒<br />网格化</p>
          </div>
        </div>
        <div class="icon-intro-item">
          <div class="icon-intro-item_icon">
            <img src="./images/icon-2.png">
          </div>
          <div class="icon-intro-item_intro">
            <p class="icon-intro-item_intro_msg">政策精神传播宣贯<br />链条化</p>
          </div>
        </div>
        <div class="icon-intro-item">
          <div class="icon-intro-item_icon">
            <img src="./images/icon-3.png">
          </div>
          <div class="icon-intro-item_intro">
            <p class="icon-intro-item_intro_msg">社情民意分析研判<br />精细化</p>
          </div>
        </div>
        <div class="icon-intro-item">
          <div class="icon-intro-item_icon">
            <img src="./images/icon-4.png">
          </div>
          <div class="icon-intro-item_intro">
            <p class="icon-intro-item_intro_msg">上层领导决策支持<br />科学化</p>
          </div>
        </div>
      </div>
    </div>
    <div class="pro-preview">
      <div class="container">
        <img src="./images/pro-preview.png">
      </div>
    </div>
    <transition name="el-fade-in">
      <div class="bottom-tip" v-show="bottomTip.show">
        <div class="bottom-tip_msg">
          <img src="./images/robot.png" class="bottom-tip_msg_img">
          开通服务请联系销售人员，或拨打咨询电话：4000-976-005
        </div>
        <div class="bottom-tip_close" @click="onBottomTipClose">
          <i class="el-icon-close"></i>
        </div>
      </div>
    </transition>
    <div class="copyright">
      <p>© CopyRight 2020开普云 kaipuyun.cn. All Rights Reserved 版权所有</p>
    </div>
    <div class="side-phone">
      <i class="side-phone_icon el-icon-phone-outline"></i>
      <p class="side-phone_msg">电话咨询</p>
      <div class="side-phone_detail-wrap">
        <div class="side-phone_detail">
          <div class="side-phone_detail_phone">
            <i class="el-icon-phone"></i>
            <span>4000-976-005</span>
          </div>
          <div class="side-phone_detail_worktime">工作日 9:00-18:00</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/styles/integration.scss'
export default {
  data () {
    return {
      bottomTip: {
        show: true
      }
    }
  },
  components: {
  },
  methods: {
    onBottomTipClose () {
      this.bottomTip.show = false
    }
  },
  mounted () {
  }
}

</script>

<style lang="scss" scoped>
.inte-pg-intro {
  .container {
    margin: 0 auto;
    width: 1200px;
  }
  .banner {
    position: relative;
    background-color: #052459;
    &_bg {
      width: 100%;
    }
    &_main {
      display: flex;
      align-items: center;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      color: #fff;
    }
    &_msg {
      margin: 0 auto;
      width: 1200px;
      &_title {
        margin-bottom: 25px;
        line-height: 47px;
        font-size: 36px;
      }
      &_des {
        width: 449px;
        line-height: 30px;
        font-size: 16px;
      }
    }
  }
  .icon-intro {
    padding: 44px 0;
    background-color: #f4f7fc;
    .container {
      display: flex;
      justify-content: space-between;
    }
    &-item {
      width: 194px;
      &_icon {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto;
        width: 115px;
        height: 115px;
        background-color: #DEE5F3;
        border-radius: 50%;
        img {
          width: 44px;
          height: 44px;
        }
      }
      &_intro {
        margin-top: 35px;
        text-align: center;
        &_title {
          font-size: 18px;
          font-weight: bold;
          color: #333;
        }
        &_msg {
          margin-top: 15px;
          line-height: 24px;
          font-size: 16px;
          color: #151515;
        }
      }
    }
  }
  .pro-preview {
    padding: 64px 0;
    text-align: center;
  }
  .bottom-tip {
    position: relative;
    height: 120px;
    line-height: 120px;
    background-image: linear-gradient(to right, #00C3F5, #007AE1);
    text-align: center;
    &_msg {
      display: inline-block;
      position: relative;
      color: #fff;
      line-height: 24px;
      font-size: 18px;
      &_img {
        position: absolute;
        top: -93px;
        left: -234px;
        width: 190px;
      }
    }
    &_close {
      position: absolute;
      top: 50%;
      right: 30px;
      transform: translateY(-50%);
      height: 30px;
      width: 30px;
      background-color: #333;
      border-radius: 50%;
      line-height: 31px;
      text-align: center;
      color: #fff;
      opacity: .4;
      cursor: pointer;
      &:hover {
        opacity: .8;
      }
    }
  }
  .copyright {
    height: 50px;
    line-height: 50px;
    color: #7B7C81;
    font-size: 14px;
    text-align: center;
    background-color: #323237;
  }
  .side-phone {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: fixed;
    top: 50%;
    right: 0;
    height: 100px;
    width: 100px;
    background-color: #00C3F5;
    text-align: center;
    color: #fff;
    transition: all .2s linear;
    transform: translateY(-50%);
    cursor: pointer;
    opacity: .7;
    &_icon {
      font-size: 28px;
    }
    &_msg {
      font-size: 14px;
      line-height: 24px;
    }
    &_detail-wrap {
      display: none;
      position: absolute;
      top: 0;
      right: 100%;
      padding-right: 10px;
      cursor: default;
    }
    &_detail {
      position: relative;
      padding: 25px 30px;
      min-width: 200px;
      white-space: nowrap;
      text-align: center;
      border: 1px #ddd solid;
      background-color: #fff;
      border-radius: 2px;
      &_phone {
        position: relative;
        left: -9px;
        line-height: 29px;
        font-size: 22px;
        color: #333;
      }
      &_worktime {
        line-height: 21px;
        font-size: 16px;
        color: #77848D;
      }
      &::before {
        content: '';
        position: absolute;
        right: -5px;
        top: 50%;
        transform: translateY(-50%) rotate(45deg);
        border: 5px solid #fff;
        outline: 1px solid #ddd;
      }
      &::after {
        content: '';
        position: absolute;
        right: 0px;
        top: 50%;
        height: 16px;
        width: 10px;
        background-color: #fff;
        transform: translateY(-50%);
      }
    }
    &:hover {
      opacity: 1;
      .side-phone_detail-wrap {
        display: block;
      }
    }
  }
}
</style>

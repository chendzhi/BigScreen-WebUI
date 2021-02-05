<template>
  <div
    v-if="icon"
    :class="['icon', icon]"
    :style="iconStyle">
  </div>
</template>

<script>

export default {
  props: {
    width: {
      type: Number,
      default: 25
    },
    height: {
      type: Number,
      default: 25
    },
    icon: {
      type: String,
      default: ''
    }
  },
  computed: {
    iconStyle() {
      return `
        height: ${this.height}px;
        width: ${this.width}px;
      `
    }
  }
}
</script>

<style lang="scss" scoped>
.icon {
  display: inline-block;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;

  &.big-internet {background-image: url('./images/big-internet.png');}
  &.big-video {background-image: url('./images/big-video.png');}
  &.detail {background-image: url('./images/detail.png');}
  &.dingzi {background-image: url('./images/dingzi.png');}
  &.download {background-image: url('./images/download.png');}
  &.internet {background-image: url('./images/internet.png');}
  &.video {background-image: url('./images/video.png');}
  &.wechat {background-image: url('./images/wechat.png');}
  &.sina {background-image: url('./images/sina.png');}
  &.toutiao {background-image: url('./images/toutiao.png');}
}
</style>

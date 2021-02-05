<template>
  <div class="pg-detail">
    <div class="head">
      <div class="logo"></div>
      <div class="title">
        <template v-show="user.organCode">
          {{user.organCode}} - {{user.organName}}
        </template>
      </div>
      <ul class="actions">
        <li class="action-close" title="返回" @click="onClose">
          <i class="el-icon-close"></i>
        </li>
      </ul>
    </div>
    <div class="body">
      <slot></slot>
    </div>
    <div class="copyright">© Copyright 2020. 开普云 All Rights Reserved</div>
  </div>
</template>

<script>
// import './css/detail.scss'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      custStyleEl: '' // 自己独有的会影响全局的css
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    onClose () {
      this.$emit('on-close', false)
    },
    custStyleAdd () {
      let style = document.createElement('style')
      style.type = 'text/css'
      style.innerHTML = `
        /*滚动条*/
        ::-webkit-scrollbar{width:8px; height:8px; background-color:#fff;}
        ::-webkit-scrollbar-track{-webkit-box-shadow:inset 0 0 2px rgba(0,0,0,0); border-radius:0px; background-color:#fff;}
        ::-webkit-scrollbar-thumb{border-radius:1px; -webkit-box-shadow:inset 0 0 2px rgba(0,0,0,0); background-color:rgba(128, 134, 149, .3); transition: all .2s linear;}
        ::-webkit-scrollbar-thumb:hover{background-color:rgba(128, 134, 149, .6);}
        /*tooltip*/
        .el-tooltip__popper.is-dark {background: #303133!important;}
        .el-tooltip__popper .popper__arrow::after {border-top-color: transparent!important;}
      `
      document.getElementsByTagName('HEAD').item(0).appendChild(style)
      this.custStyleEl = style
    },
    custStyleRemove () {
      this.custStyleEl.parentNode.removeChild(this.custStyleEl)
    }
  },
  created () {
    this.custStyleAdd()
  },
  beforeDestroy () {
    this.custStyleRemove()
  }
}
</script>

<style lang="scss" scoped>
.pg-detail {
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100%;
  background-color: #ecf0fa;
  font-size: 14px;
  z-index: 10;
}
.head {
  flex-grow: 0;
  flex-shrink: 0;
  margin-bottom: 8px;
  padding: 0 18px;
  height: 54px;
  line-height: 54px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  .logo {
    float: left;
    margin-right: 8px;
    height: 54px;
    width: 25px;
    background: url('./images/logo.png') no-repeat;
    background-position: center;
  }
  .title {
    float: left;
    font-size: 16px;
    color: #34495e;
  }
  .actions {
    float: right;
    height: 54px;
    li {
      float: left;
      margin-right: 12px;
      line-height: 54px;
      cursor: pointer;
      &:last-child {
        margin-right: 0;
      }
      &.action-close {
        font-size: 22px;
        color: #9d9d9d;
      }
    }
  }
}

.body {
  flex-grow: 1;
  padding: 0 18px;
}
.copyright {
  flex-grow: 0;
  flex-shrink: 0;
  height: 46px;
  line-height: 46px;
  color: #78829a;
  text-align: center;
}
</style>

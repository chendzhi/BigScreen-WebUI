<template>
  <div
    :class="['module', {
      'module--2': mode === 2,
      'module--mobile': mode === 'mobile'
    }]"
    :style="{'height': isFullHeight ? '100%' : 'auto'}">
    <div class="module_head">
      <div class="module_title">
        <span class="module_title_name">{{title}}</span>
        <span class="module_title_rline">
          <span class="module_title_rline_skew-lines">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </span>
      </div>
      <div class="module_toolbar">
        <div class="module_toolbar_left">
          <slot name="toolbar_left"></slot>
        </div>
        <div class="module_toolbar_right">
          <slot name="toolbar_right"></slot>
        </div>
      </div>
    </div>
    <div class="module_body">
      <slot name="body"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    mode: {
      type: [Number, String],
      default: 1 // 1: 默认风格 2：普通风格
    },
    title: {
      type: String,
      default: ''
    },
    isFullHeight: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
/*
box-shadow: 0px 20px 20px -20px #0040bc inset, -20px 0px 20px -20px #0040bc inset, 0px -20px 20px -20px #0040bc inset, 20px 0px 20px -20px #0040bc inset;
*/

.module {
  display: flex;
  flex-direction: column;
  // border-radius: 4px;
  overflow: hidden;
  &_head {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    flex-grow: 0;
    box-shadow: 0px 20px 20px -20px transparent inset, -20px 0px 20px -20px transparent inset, 0px -20px 20px -20px transparent inset, 20px 0px 20px -20px #0040bc inset;
  }
  &_title {
    display: flex;
    flex-shrink: 0;
    flex-grow: 0;
    height: 36px;
    font-size: 18px;
    color: #fff;
    &_name {
      flex-shrink: 0;
      flex-grow: 0;
      display: inline-block;
      position: relative;
      padding: 16px 15px 0 15px;
      // border-top: 1px solid #038bff;
      border-left: 1px solid #038bff;
      // border-radius: 4px 0 0 0;
      &::after {
        content: '';
        position: absolute;
        top: 0px;
        right: -19px;
        left: 0;
        bottom: 0;
        border-top: 1px solid #038bff;
        border-right: 1px solid #038bff;
        box-shadow: 0px 20px 20px -20px #0040bc inset, -20px 0px 20px -20px transparent inset, 0px -20px 20px -20px transparent inset, 20px 0px 20px -20px transparent inset;
        transform: skewX(45deg);
      }
    }
    &_rline {
      flex-grow: 1;
      position: relative;
      left: 19px;
      height: 100%;
      transform: skew(45deg, 0);
      // border-left: 1px solid #038bff;
      border-bottom: 1px solid #038bff;
      box-shadow: 0 0 20px #0040bc;
      &_skew-lines {
        position: absolute;
        bottom: 0;
        left: 0;
        &>span {
          float: left;
          margin-right: 3px;
          height: 8px;
          width: 4px;
          background-color: #47dafc;
        }
      }
      // &::before {
      //   content: '';
      //   position: absolute;
      //   top: 0;
      //   bottom: 0;
      //   left: 15px;
      //   width: 45px;
      //   // border:1px solid #ccc;
      //   // transform: skew(45deg, 0);
      //   box-shadow: -20px 0px 20px -20px #0040bc;
      // }
      &::after {
        content: '';
        position: absolute;
        right: 0;
        left: 45px;
        bottom: 0;
        height: 2px;
        background-color: #47dafc;
        clear: both;
      }
    }
  }
  &_toolbar {
    display: flex;
    justify-content: space-between;
    flex-grow: 1;
    padding: 0 15px 0 0;
    border-left: 1px solid #038bff;
    border-right: 1px solid #038bff;
    box-shadow: 0px 20px 20px -20px transparent inset, -20px 0px 20px -20px #0040bc inset, 0px -20px 20px -20px transparent inset, 20px 0px 20px -20px transparent inset;
    &_left, &_right {
      line-height: 40px;
    }
  }
  &_body {
    position: relative;
    flex-grow: 1;
    box-shadow: 0px 20px 20px -20px transparent inset, -20px 0px 20px -20px #0040bc inset, 0px -20px 20px -20px #0040bc inset, 20px 0px 20px -20px #0040bc inset;
    border: 1px solid #038bff;
    border-top: none;
    // border-radius: 0 0 4px 4px;
    overflow: hidden;
  }
}
// 风格2
.module.module--2 {
  box-shadow: 0 0 20px #0040bc inset;
  border: 1px solid #038bff;
  .module_head {
    display: flex;
    flex-direction: row;
    height: 50px;
    box-shadow: none;
  }
  .module_title {
    &_name {
      box-shadow: none;
      border: none;
      &::after {
        display: none;
      }
    }
    &_rline {
      display: none;
    }
  }
  .module_toolbar {
    height: 100%;
    border: none;
    box-shadow: none;
    &_left, &_right {
      line-height: 50px;
    }
  }
  .module_body {
    box-shadow: none;
    border: none
  }
}

// 风格-手机端
.module.module--mobile {

  .module_head {
    display: flex;
    flex-direction: row;
    height: 35px;
    box-shadow: none;
  }
  .module_title {
    height: 35px;
    &_name {
      padding: 0 15px;
      line-height: 35px;
      font-size: 16px;
      color: #30ddf4;
      box-shadow: none;
      border: none;
      font-weight: bold;
      &::after {
        left: 0;
        top: 50%;
        width: 4px;
        height: 16px;
        background-color: #30ddf4;
        border-radius: 2px;
        border: none;
        transform: rotate(0deg) translateY(-50%);
        box-shadow: none;
      }
    }
    &_rline {
      display: none;
    }
  }
  .module_toolbar {
    padding-right: 0;
    height: 100%;
    border: none;
    box-shadow: none;
    &_left, &_right {
      line-height: 35px;
    }
  }
  .module_body {
    box-shadow: 0 0 30px #0040bc inset;
    border: none;
    border-radius: 6px;
  }
}
</style>

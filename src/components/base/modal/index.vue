<template>
<transition name="el-fade-in-linear">
  <div
    v-if="value"
    :class="['inte-modal',{
      'inte-modal--full-screen': fullScreen_self
    }]">
    <div
      class="inte-modal_mask"
      :style="`background-color: ${maskColor}; opacity: ${maskOpacity};`"
      @click="onMaskClick">
    </div>
    <div class="inte-modal_main" :style="mainStyle">
      <div class="inte-modal_head" v-if="headShow">
        <div class="inte-modal_head_title">
          <slot name="title">{{title}}</slot>
        </div>
        <ul class="inte-modal_action-bar">
          <li
            v-if="fullScreenActionShow"
            class="action-item action-item--hollow"
            :title="fullScreen_self ? '向下还原' : '最大化'"
            @click="onFullScreenToggle">
            <i
              :class="{
                'el-icon-top-right': !fullScreen_self,
                'el-icon-bottom-left': fullScreen_self
              }"></i>
          </li>
          <li
            class="action-item"
            title="关闭"
            @click="onClose">
            <slot name="closeIcon">
              <i class="el-icon-close"></i>
            </slot>
          </li>
        </ul>
      </div>
      <div class="inte-modal_body">
        <slot name="body">
          body
        </slot>
      </div>
    </div>
  </div>
  </transition>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    width:  {
      type: [Number, String],
      default: 700
    },
    minWidth:  {
      type: [Number, String],
      default: 'initial'
    },
    maxWidth:  {
      type: [Number, String],
      default: 'initial'
    },
    height: {
      type: [Number, String],
      default: 500
    },
    minHeight: {
      type: [Number, String],
      default: 'initial'
    },
    maxHeight: {
      type: [Number, String],
      default: 'initial'
    },
    mask: {
      type: Boolean,
      default: true
    },
    maskColor: {
      type: String,
      default: '#333'
    },
    maskOpacity: {
      type: Number,
      default: .5
    },
    maskClickClose: {
      type: Boolean,
      default: true
    },
    headShow: {
      type: Boolean,
      default: true
    },
    fullScreenActionShow: { // 是否显示全屏操作
      type: Boolean,
      default: false
    },
    fullScreen: { // 是否全屏
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      fullScreen_self: false
    }
  },
  computed: {
    mainStyle () {
      let style = {
        'width': typeof this.width === 'number' ? `${this.width}px` : this.width,
        'min-width': typeof this.minWidth === 'number' ? `${this.minWidth}px` : this.minWidth,
        'max-width': typeof this.maxWidth === 'number' ? `${this.maxWidth}px` : this.maxWidth,
        'height': typeof this.height === 'number' ? `${this.height}px` : this.height,
        'min-height': typeof this.minHeight === 'number' ? `${this.minHeight}px` : this.minHeight,
        'max-height': typeof this.maxHeight === 'number' ? `${this.maxHeight}px` : this.maxHeight
      }
      return style
    }
  },
  watch: {
    fullScreen: {
      immediate: true,
      handler (val) {
        this.fullScreen_self = val
      }
    }
  },
  methods: {
    onMaskClick () {
      if (this.maskClickClose) {
        this.onClose()
      }
    },
    onClose () {
      this.$emit('input', false)
    },
    onFullScreenToggle () {
      this.fullScreen_self = !this.fullScreen_self
      this.$emit('on-full-screen', this.fullScreen_self)
    },
    _elAppendToBody() {
      this.$nextTick(() => {
        let body = document.querySelector("body");
        if (body.append) {
          body.append(this.$el);
        } else {
          body.appendChild(this.$el);
        }
      })
    }
  },
  mounted() {
    this._elAppendToBody()
  }
}
</script>

<style lang="scss" scoped>
.inte-modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999999;
  overflow: hidden;
  &_mask {
    height: 100%;
    width: 100%;
  }
  &_action-bar {
    display: flex;
    align-items: center;
    .action-item {
      margin-left: 4px;
      height: 38px;
      width: 38px;
      line-height: 38px;
      text-align: center;
      background-color: #549add;
      border-radius: 2px;
      color: #1a379e;
      font-size: 20px;
      cursor: pointer;
      transition: all .2s linear;
      &:hover {
        background-color: #2dd0ed;
      }
      &--hollow {
        background-color: transparent;
        border: 1px solid #549add;
        color: #549add;
        &:hover {
          background-color: #2dd0ed;
          color: #1a379e;
        }
      }
    }
  }
  &_main {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    min-width: 400px;
    border-radius: 2px;
    overflow: hidden;
  }
  &_head {
    flex-shrink: 0;
    flex-grow: 0;
    display: flex;
    padding: 0 20px;
    height: 54px;
    line-height: 54px;
    background-image: linear-gradient(90deg, rgba(19,72,152,.9), rgba(31,88,188,.9));
    border-top: 1px solid #266cc3;
    border-bottom: 1px solid #2675c0;
    &_title {
      flex-grow: 1;
      color: #8fe1ff;
      font-size: 18px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
  &_body {
    flex-grow: 1;
    position: relative;
    padding: 20px;
    min-height: 100px;
    background-image: linear-gradient(90deg, rgba(2,89,163,.9), rgba(5,44,155,.9));
  }

  &--full-screen {
    .inte-modal_main {
      height: 100%!important;
      width: 100%!important;
      max-height: initial!important;
      max-width: initial!important;
    }
  }
}
</style>

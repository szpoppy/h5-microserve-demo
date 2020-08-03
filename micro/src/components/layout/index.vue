<style lang="less">
.cp-layout {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 2;
  overflow: hidden;

  .iScrollVerticalScrollbar {
    position: absolute;
    z-index: 9999;
    width: 3px;
    bottom: 2px;
    top: 2px;
    right: 4px;
    overflow: hidden;
    pointer-events: none;
  }
  .iScrollIndicator {
    box-sizing: border-box;
    position: absolute;
    border-radius: 3px;
    width: 100%;
    transition-duration: 0ms;
    transform: translate(0px, 0px);
    transition-timing-function: cubic-bezier(0.1, 0.57, 0.1, 1);
    background-color: rgba(0, 0, 0, 0.2);
  }
}
</style>

<template>
    <div class="cp-layout">
        <!-- 内容插入，其中第一个div会适配滚动 -->
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { IScroll } from '../../config'

export default {
  name: 'cp-layout',
  props: {
    // 参数，作用监控变化，然后重新初始化滚动条
    cEvent: {
      default: ''
    }
  },
  data() {
    return {
      // scroll
      warpScroll: null
    }
  },
  watch: {
    // 主要是监控 父属性有变更时，触发刷新
    cEvent: {
      deep: true,
      handler() {
        this.warpRefresh()
      }
    },
    '$slots.default'() {
      this.warpRefresh()
    }
  },
  methods: {
    // 刷新滚动条
    warpRefresh() {
      this.$nextTick(() => {
        if (this.warpScroll) {
          this.warpScroll.refresh()
        } else {
          // let inTouch = "ontouchstart" in window.document
          // console.log(inTouch)
          let param = {
            // 可以防止部分iphone上滚动跳跃 闪的问题
            useTransition: false,
            // x方向禁止滚动
            scrollX: false,
            scrollY: true,
            // 点击事件允许
            click: true,
            disablePointer: true,
            disableTouch: false,
            disableMouse: false,
            // 不使用gpu加速, ios11 出现问题
            HWCompositing: false,
            // 自定义滚动条样式
            scrollbars: 'custom',
            bounce: true
          }
          this.warpScroll = new IScroll(this.$el, param)
        }
      })
    }
  },
  mounted() {
    // 初始化
    setTimeout(() =>{
      this.warpRefresh()
    })
  },
  destroyed() {
    if (this.warpScroll) {
      // 
      this.warpScroll.destroy()
    }
  }
}
</script>

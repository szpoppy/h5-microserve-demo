<template>
  <div id="app">
    <router-view />
    <!-- 微服务呈现控制 -->
    <div v-show="msUse" class="ms-iframe">
      <iframe name="microservice" class="ms-iframe-full" @load="msIframeLoaded" :src="msHref + '#/init'" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      msUse: false,
      msHref: "//127.0.0.1:9001/"
    }
  },
  unicom: {
    // 接受消息，设置显示微服务
    ms_move_to(event) {
      let href = event.data
      this.$c.bridge.postMessage("system:href", { href, replace: true, env: {userId: this.$c.env.userId} });
      setTimeout(() => {
          this.msUse = true;
      }, 0);
    },
    // 设置微服务隐藏，并重新初始化微服务
    ms_move_end() {
      this.msUse = false;
      setTimeout(() => {
          this.$c.bridge.postMessage("system:re_init", { href: "/init" });
      }, 0);
    }
  },
  methods: {
    msIframeLoaded () {
      // 设置 微服务的 root的字体大小
      this.$c.bridge.postMessage("system:font", Math.round((document.documentElement.offsetWidth / 750) * 100) + "px");
    }
  }
}
</script>

<style lang="less">
body, html {
  padding: 0;
  margin: 0;
}
* {touch-action: manipulation;}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size: 24px;
}

.ms-iframe {
    position: fixed;
    z-index: 9999;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #FFFFFF;
    iframe {
        width: 100%;
        height: 100%;
        border: none;
        padding: 0;
        margin: 0;
    }
    // transform: translateX(40px);
    // opacity: 0;
    transition: transform 0.3s ease-in, opacity 0.35s ease-out;
}
</style>

<style lang="less" scoped>
  .page-home {
    .img {
      height: 400px;
    }
    .context {
      padding-bottom: 150px;
      font-size: 32px;
      input {
        width: 32px;
        height: 32px;
      }
    }
    .space {
      height: 300px;
      margin: 0 50px;
      border-bottom: 600px solid #5FADBE;
      border-radius: 1000px;
    }
    .bottom-btn {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 20px 30px;
      background-color: #ffffff;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
      .btn {
        height: 80px;
        line-height: 80px;
        font-size: 40px;
        background-color: #41B883;
        color: #FFFFFF;
        text-align: center;
        border-radius: 100px;
        &:active {
          opacity: 0.9;
        }
      }
    }
  }
</style>
<template>
  <layout class="page-home">
    <!-- 第一个节点为scroll内容 -->
    <div class="context">
      <img class="img" alt="Vue logo" src="../assets/logo.png">
      <p>选项一 <input type="checkbox" value="1" v-model="ck" /></p>
      <p>选项二 <input type="checkbox" value="2" v-model="ck" /></p>
      <p>选项三 <input type="checkbox" value="3" v-model="ck" /></p>
      <p>选项四 <input type="checkbox" value="4" v-model="ck" /></p>
      <p>选项五 <input type="checkbox" value="5" v-model="ck" /></p>
      <div class="space"></div>
    </div>
    <!-- 这里的节点可以做一些fixed的绝对定位 -->
    <div class="bottom-btn">
      <div isact class="btn" @click="end">确认</div>
    </div>
  </layout>
</template>

<script>
export default {
  name: 'page-home',
  data() {
    return {
      ck:[]
    }
  },
  methods: {
    end() {
      this.$c.bridge.endBack("elect_set", this.ck)
    }
  },
  async mounted() {
    let res = await this.$c.bridge.postMessage("elect_get")
    this.ck = res.ck || []
  }
}
</script>

<style lang="less" scoped>
  .page-home {
    .img {
      height: 400px;
    }
    .context {
      padding-bottom: 150px;
      font-size: 32px;
    }
    .btn {
      width: 70%;
      margin: 0 auto;
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
</style>
<template>
  <div class="page-home">
    <router-view />
    <img class="img" alt="Vue logo" src="../assets/logo.png">
    <div class="context">
      <div class="">选中的：{{ck.join(",")}}</div>
      <!-- 只需要跳转到特定路由就可以自动转入微服务 -->
      <div class="btn" @click="$router.push('/home/elect')">选择用户</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'page-home',
  data () {
    return {
      // 选中的字段
      ck: []
    }
  },
  unicom: {
    elect_get ({data}) {
      // 将选中的字段 传给微服务
      data.ck = this.ck
    },
    elect_set ({ data: ck }) {
      // 接受微服务中选中的字段，存起来
      this.ck = ck
    }
  }
}
</script>

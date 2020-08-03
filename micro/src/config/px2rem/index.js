import Vue from 'vue'
Vue.mixin({
  filters: {
    px2rem(val) {
      return val / 100 + 'rem'
    }
  }
})

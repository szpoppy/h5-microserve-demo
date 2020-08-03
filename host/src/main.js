import Vue from 'vue'

import * as c from './config'
// 存入 prototype中，方便实例访问
Vue.prototype.$c = c

Vue.config.productionTip = false
import App from './App.vue'

new Vue({
  router: c.router,
  render: h => h(App)
}).$mount('#app')

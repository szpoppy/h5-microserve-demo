import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Init from '../views/Init.vue'
import qs from 'rimjs/qs'

Vue.use(VueRouter)

const routes = [
  {
    path: '/elect',
    name: 'Home',
    component: Home
  },
  {
    path: '/init',
    name: 'Init',
    component: Init,
    beforeEnter(to, from, next) {
      if (from && from.path != '/' && to.query.re != '1') {
        window.history.back()
        setTimeout(function () {
          if (window.location.hash.split('?')[0] == '#/init') {
            next()
          }
        }, 350)
        return
      }
      next()
    }
  }
]

export const router = new VueRouter({
  mode: 'hash',
  routes
})

Object.defineProperty(router, 'query', {
  get() {
    let str = window.location.hash.replace(/^#[^?]*/, '')
    return qs.parse(str) || {}
  }
})

export default router

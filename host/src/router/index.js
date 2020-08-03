import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import MicroServe from '../views/MicroServe.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/home/elect',
        name: 'Elect',
        component: MicroServe,
        props: {
          path: 'elect'
        }
      }
    ]
  }
]

export const router = new VueRouter({
  mode: 'hash',
  routes
})

export default router

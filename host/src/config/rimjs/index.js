import Vue from 'vue'

// vueUnicom通讯组件 ================================================
import { vueUnicomInstall } from 'rimjs/vueUnicom'
// 输出相关组件
export { VueUnicom as UnicomClass, unicomEmit } from 'rimjs/vueUnicom'

// vueUnicom 注册为插件
Vue.use(vueUnicomInstall)

// ajax 初始化 ============================================
import { AjaxGroup } from "rimjs/ajax"

// 导出一个实例
export let request = new AjaxGroup()

// 一些默认参数设置
request.setConf({
    // 跨域，请求带上cookie
    withCredentials: true,
    // 短路径
    // 通过从 //api.xxx.com/data/user/getInfo 获取数据，如下使用
    // request.load('<post>api:user/getInfo')
    paths: {
        api: "//api.xxx.com/data/"
    }
})

// request 拦截器
request.on("open", function(course) {
    let { req, ajax } = course

    let param = req.param
    if(!param) {
        param = req.param = {}
    }
    
    if(param.userId != null) {
        param.userId = env.userId
    }

    // 触发新的事件
    // 可以通过 this.on("para", function(course){}) 来绑定事件
    ajax.emit("para", course)
})

// response 拦截器
request.on("verify", function({ res }) {
    // 返回数据存放于 res.result 
})
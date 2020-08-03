// router
import router from '../../router'

// 获得一个唯一的值
import getSole from 'rimjs/sole'

// 全局unicom事件触发
import { unicomEmit } from '../rimjs'

// 当前环境的变量数据，这里主要是设置身份
import { env } from '../env'

let win = window

// 默认为 iframe 需要兼容其他的，可以这里兼容
function postMessage(data, source = window.parent) {
  source.postMessage(data, '*')
}

// 临时存放 Promise 的resolve的对象
let postMessageResolveFns = {}

// 信息输入数据
let messageInData = null
// 信息输出数据 暂存
let messageOutData = {}
let query = router.query

if (query._in != null) {
  messageInData = {}
}
if (messageInData) {
  // 是否为类微信小程序内（webview和小程序无法实时双向通讯）
  // 传入的参数需要一次性输入
  try {
    Object.assign(messageInData, JSON.parse(query._in) || {})
  } catch (e) {}
}

function setUser(inEnv) {
  if (!inEnv) {
    return
  }
  env.userId = inEnv.userId || ''
}

async function getUser() {
  let inEnv = await bridge.postMessage('env:get')
  setUser(inEnv)
}

// 接收消息
// type:类型 fnKey:回调方法 insruct:指令 data:数据
function onMessage({ type, insruct, data } = {}, source) {
  let backData = null
  if (type == 'unicom') {
    backData = data == null ? {} : data
    // 事件广播, 通过这个方法，宿主环境可以向微服务端发送广播消息
    unicomEmit(insruct, backData)
    return
  }
  if (type == 'system') {
    // 一些系统设置
    if (insruct == 'font') {
      // rem布局，根节点 字体大小
      // 微服务如果为预加载，无法正确计算出根节点字体大小，需要宿主通知
      document.documentElement.style.fontSize = data
      return
    }
    if (insruct == 'href') {
      setUser(data.env)
      // iframe 预加载，重新定位 当前路由
      if (data.replace) {
        window.location.replace(window.location.pathname + '#' + data.href)
      } else {
        window.location.href = window.location.pathname + '#' + data.href
      }
      return
    }
    if (insruct == 're_init') {
      // 重新初始化页面，一般在iframe中，返回宿主环境后使用
      window.location.replace(window.location.pathname + '#/init?re=1')
      return
    }

    return
  }
  if (type == 'back') {
    // 找到回调的Promise
    let resolveFn = postMessageResolveFns[insruct]
    if (resolveFn) {
      // 运行 resolveFn
      resolveFn(data)
      // console.log("data", data)
      delete postMessageResolveFns[insruct]
    }
    return
  }

  if (fnKey) {
    // 数据回调
    postMessage({ type: 'back', from: 'microservice', insruct: fnKey, data: backData }, source)
  }
}

// 注册接收的消息
// 如果需要兼容其他渠道，可以这里写不同的
window.addEventListener('message', function (ev) {
  let opt = ev.data || {}
  let { from } = opt
  if (from != 'microservice') {
    // 非目标，舍弃
    return
  }
  onMessage(opt, ev.source)
})

// 对象定义
export let bridge = {
  // postMessage 发送消息
  // 可以通过 Promise 获取到宿主的回调函数的值
  // bridge.postMessage("xxx") 同 bridge.postMessage("unicom:xxx")
  // data 为发送的参数
  postMessage(opt, data) {
    if (typeof opt == 'string') {
      let x = opt.match(/^([^:]*):*(.*)$/)
      if (!x) {
        x = [opt]
      }
      if (!x[2]) {
        // type 默认为 unicom
        x[2] = x[1]
        x[1] = 'unicom'
      }
      opt = {
        data,
        type: x[1],
        insruct: x[2]
      }
    }
    return new Promise(function (resolve) {
      // 回调唯一的key
      let fnKey = 'ms:' + getSole()
      postMessageResolveFns[fnKey] = resolve
      if (messageInData) {
        // 此处无法直接使用 postMessage
        let key = opt.type + ':' + opt.insruct
        // 寄存需要发送出去的数据
        messageOutData[key] = data

        // console.log(messageOutData, key, args)
        setTimeout(function () {
          // 模拟接收到 back 事件
          onMessage({
            type: 'back',
            insruct: fnKey,
            data: messageInData[key] || null
          })
        }, 0)
        return
      }
      // 发送下次
      postMessage(Object.assign({ from: 'microservice', fnKey }, opt))
    })
  },
  // 结束微服务
  endBack(opt, data) {
    if (opt) {
      // 如果在微服务中有对身份信息做一些修改，需要同步到宿主
      this.postMessage(opt, data)
    }
    // 退出微服务界面
    // 不同载体，需要不同的方法
    // 比如 微信小程序，就需要 win.wx.miniProgram.navigateBack()
    if (messageInData) {
      // 此处微信小程序内嵌webview处理
      // 微信返回
      win.wx.miniProgram.navigateBack()
      // 微信发送寄存的数据
      win.wx.miniProgram.postMessage({ data: messageOutData })
      return
    }
    // 历史记录后退
    window.history.back()
  }
}

// 初始化时，尝试获取用户身份信息
getUser()

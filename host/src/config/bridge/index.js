// 获得一个唯一的值
import getSole from 'rimjs/sole'

// 全局unicom事件触发
import { unicomEmit } from '../rimjs'

// env 用户身份信息
import { env } from '../env'

// 临时存放 Promise 的resolve的对象
let postMessageResolveFns = {}

// 接收消息
// type:类型 fnKey:回调方法 insruct:指令 data:数据
function onMessage({ type, insruct, data, fnKey } = {}, source) {
  // 回调数据
  let backData = null
  if (type == 'unicom') {
    // 消息广播
    backData = data == null ? {} : data
    unicomEmit(insruct, backData)
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

  if (type == 'env') {
    backData = {}
    if (insruct == 'get') {
      backData.userId = env.userId
    } else if (insruct == 'set') {
      env.userId = data.userId
    }
  }

  if (fnKey) {
    // 返回数据
    source.postMessage({ type: 'back', from: 'microservice', insruct: fnKey, data: backData }, '*')
  }
}

// 注册接收的消息
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
        // x1 默认为 unic
        x[2] = x[1]
        x[1] = 'unicom'
      }
      opt = {
        // 数据
        data,
        // 类型
        type: x[1],
        // 指令
        insruct: x[2]
      }
    }

    // 发送的数据
    let postData = Object.assign({ from: 'microservice' }, opt)
    // 发送到目标
    let source = window.frames.microservice || window.frames[0]
    if (opt.type == 'system') {
      // system 无需返回 promise
      source.postMessage(postData, '*')
      return
    }

    return new Promise(function (resolve) {
      // 生产
      postData.fnKey = 'ms:' + getSole()
      postMessageResolveFns[fnKey] = resolve
      // 发送下次
      source.postMessage(postData, '*')
    })
  }
}

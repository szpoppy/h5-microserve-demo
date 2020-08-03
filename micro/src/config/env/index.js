// cookie 操作
import cookie from 'rimjs/cookie'

// 本地存储 操作
import { LSClass } from 'rimjs/storage'
// 设置前缀为 env#，防止冲突
let ls = new LSClass('env#')

export let env = {}

function setDefineProperty(key) {
  Object.defineProperty(env, key, {
    get() {
      return ls.getItem(key) || cookie.getItem(key) || ''
    },
    set(val) {
      ls.setItem(key, val)
    }
  })
}

setDefineProperty('userId')

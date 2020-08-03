import _IScroll from 'iscroll'
let iUtil = _IScroll.utils
// 主要是解决 css active为类触发
// return true 时，就能出发 css的 active 为类
iUtil.preventDefaultException = function(el) {
  if (el.hasAttribute('isact')) {
    // 允许
    return true
  }
  let tagName = el.tagName.toLowerCase()
  if ('|input|textarea|button|select|'.indexOf('|' + tagName + '|') > -1) {
    // 这些标签必须要返回true，否则会导致 无法获得焦点
    return true
  }
  return false
}

// 重写模拟点击事件
function eventClick(e) {
  let target = e.target
  let ev = document.createEvent('MouseEvents')
  ev.initMouseEvent('click', true, true, e.view, 1, target.screenX, target.screenY, target.clientX, target.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, 0, null)

  // 不需要阻止 preventDefault
  ev._constructed = true
  target.dispatchEvent(ev)
}

let clickMap = new Map()
iUtil.click = function(e) {
  let flag = clickMap.get(e.target)
  if (flag) {
    return
  }
  // 防止两次触发
  clickMap.set(e.target, true)
  eventClick(e)
  setTimeout(function() {
    clickMap.delete(e.target)
  }, 100)
}

// 输出 IScroll
export let IScroll = _IScroll

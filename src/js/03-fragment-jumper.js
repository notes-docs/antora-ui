// 这段代码的目的是实现一个平滑的页面跳转功能，当点击页面中的锚链接时，页面会平滑滚动到目标元素，并且确保跳转时考虑到页面上方的工具栏（toolbar）的高度

;(function () {
  'use strict'

  var article = document.querySelector('article.doc')
  var toolbar = document.querySelector('.toolbar')

  // 该函数用于解码 URL 中的 hash 部分，去掉 # 符号。如果 hash 部分包含百分号编码（例如 %20），则进行解码。
  function decodeFragment (hash) {
    return hash && (~hash.indexOf('%') ? decodeURIComponent(hash) : hash).slice(1)
  }

  // 该函数递归计算某个元素相对于 article 元素的顶部偏移量（offsetTop）。它通过逐级计算元素相对于其父元素的位置，直到达到最顶层的元素（article）为止
  function computePosition (el, sum) {
    return article.contains(el) ? computePosition(el.offsetParent, el.offsetTop + sum) : sum
  }

  // 该函数用于处理锚链接点击事件
  function jumpToAnchor (e) {
    if (e) {
      // 如果 alt 或 ctrl 键被按下，则不执行跳转
      if (e.altKey || e.ctrlKey) return
      // 否则，更新浏览器的 location.hash，并滚动页面到目标元素的位置
      window.location.hash = '#' + this.id
      e.preventDefault()
    }
    // 通过计算目标元素的相对位置，并减去工具栏的高度来确保目标元素能够完全显示在视口中，而不被工具栏遮挡
    window.scrollTo(0, computePosition(this, 0) - toolbar.getBoundingClientRect().bottom)
  }

  // jumpOnLoad 事件监听器
  // 在页面加载时，检查当前的 window.location.hash，如果有有效的锚点（即页面中存在对应的 id），则自动滚动到该位置，
  // 并将工具栏的高度考虑在内。setTimeout 用于确保滚动到目标元素后，页面滚动计算的正确性
  window.addEventListener('load', function jumpOnLoad (e) {
    var fragment, target
    if ((fragment = decodeFragment(window.location.hash)) && (target = document.getElementById(fragment))) {
      jumpToAnchor.bind(target)()
      setTimeout(jumpToAnchor.bind(target), 0)
    }
    window.removeEventListener('load', jumpOnLoad)
  })

  // 为每个锚链接添加点击事件监听器
  Array.prototype.slice.call(document.querySelectorAll('a[href^="#"]')).forEach(function (el) {
    var fragment, target
    // 查找页面中所有的锚链接（<a href="#...">），并为每个链接添加 click 事件监听器，点击后调用 jumpToAnchor 函数，跳转到对应的目标元素
    if ((fragment = decodeFragment(el.hash)) && (target = document.getElementById(fragment))) {
      el.addEventListener('click', jumpToAnchor.bind(target))
    }
  })
})()

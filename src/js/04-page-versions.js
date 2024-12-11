// 这段代码的功能是实现一个页面版本选择菜单的显示和隐藏。当用户点击页面上的一个切换按钮时，菜单会显示或隐藏。并且，当用户点击页面其他区域时，菜单会自动关闭。
;(function () {
  'use strict'

  // 用于触发菜单显示/隐藏的按钮，查找具有 page-versions 和 version-menu-toggle 类名的元素。
  var toggle = document.querySelector('.page-versions .version-menu-toggle')
  if (!toggle) return

  // 实际的版本选择菜单，查找具有 page-versions 类名的元素
  var selector = document.querySelector('.page-versions')

  // 为 toggle 元素添加点击事件监听器
  toggle.addEventListener('click', function (e) {
    // 当点击 toggle 按钮时，会切换 selector 元素的 is-active 类，进而显示或隐藏菜单
    selector.classList.toggle('is-active')
    e.stopPropagation() // trap event 这个方法阻止事件向父元素传播，防止触发
  })

  // 为 document.documentElement 添加点击事件监听器
  // 当用户点击页面的其他区域时，会触发此事件处理器，关闭版本选择菜单（移除 is-active 类）。
  document.documentElement.addEventListener('click', function () {
    selector.classList.remove('is-active')
  })
})()

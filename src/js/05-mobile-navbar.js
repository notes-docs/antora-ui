// 这段代码的功能是实现一个可点击的导航栏切换按钮，点击时可以显示或隐藏导航菜单，并且在打开菜单时动态计算并设置菜单的最大高度。
;(function () {
  'use strict'

  // 通过 document.querySelector 查找 .navbar-burger 类名的元素（通常是一个菜单切换按钮）
  var navbarBurger = document.querySelector('.navbar-burger')
  if (!navbarBurger) return
  // 如果 navbarBurger 元素存在，添加一个 click 事件监听器，触发时调用 toggleNavbarMenu 函数
  navbarBurger.addEventListener('click', toggleNavbarMenu.bind(navbarBurger))

  // 切换导航栏菜单显示与隐藏
  function toggleNavbarMenu (e) {
    // 阻止事件冒泡，确保点击按钮时不会触发页面其他元素的点击事件
    e.stopPropagation() // trap event
    // 切换 html 元素的 is-clipped--navbar 类，这通常用于隐藏背景或创建遮罩效果，以便突出显示导航菜单
    document.documentElement.classList.toggle('is-clipped--navbar')
    // 切换按钮本身的 is-active 类（一般用于改变按钮的外观，表示菜单的打开与关闭状态）
    this.classList.toggle('is-active')
    // 根据按钮的 data-target 属性，找到对应的导航菜单（menu）元素
    var menu = document.getElementById(this.dataset.target)
    // 切换菜单的 is-active 类，控制菜单的显示和隐藏
    if (menu.classList.toggle('is-active')) {
      // 动态设置菜单的最大高度
      menu.style.maxHeight = '' // 在菜单变为可见时，先重置其 maxHeight 样式
      // 计算菜单应该显示的最大高度，即视窗高度减去菜单距离视口顶部的距离。
      var expectedMaxHeight = window.innerHeight - Math.round(menu.getBoundingClientRect().top)
      // 获取菜单当前的最大高度。
      var actualMaxHeight = parseInt(window.getComputedStyle(menu).maxHeight, 10)
      // 如果当前的最大高度与预期高度不同，则设置 maxHeight 为预期的值。这确保了菜单展开时的动态效果，避免显示过长或过短
      if (actualMaxHeight !== expectedMaxHeight) menu.style.maxHeight = expectedMaxHeight + 'px'
    }
  }
})()

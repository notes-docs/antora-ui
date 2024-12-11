// 这段代码实现了一个简单的 选项卡（Tabs） 切换功能，支持根据 URL 哈希值来定位并激活相应的选项卡，提供用户交互式的选项卡体验。
;(function () {
  'use strict'

  // 获取当前页面 URL 中的哈希值（#hash）。该哈希值将用于查找匹配的选项卡。
  var hash = window.location.hash
  // 查找所有的 .tabset 元素（假设这些元素包含一组选项卡），并对每个 tabset 执行以下操作。
  find('.tabset').forEach(function (tabset) {
    var active
    // 查找并处理选项卡和面板
    var tabs = tabset.querySelector('.tabs')
    if (tabs) {
      var first
      // 找到 .tabs 元素中的所有 <li> 元素（每个 <li> 表示一个选项卡）
      find('li', tabs).forEach(function (tab, idx) {
        // 获取每个选项卡的 id，并尝试找到与该 id 相关的面板（pane）
        var id = (tab.querySelector('a[id]') || tab).id
        if (!id) return
        var pane = getPane(id, tabset)
        if (!idx) first = { tab: tab, pane: pane }
        // 根据 URL 哈希值激活选项卡
        // 如果选项卡的 id 与当前的 URL 哈希值匹配（例如 #tab1），则激活该选项卡和对应的面板
        if (!active && hash === '#' + id && (active = true)) {
          tab.classList.add('is-active')
          if (pane) pane.classList.add('is-active')
        } else if (!idx) {
          tab.classList.remove('is-active')
          if (pane) pane.classList.remove('is-active')
        }
        // 为每个选项卡添加点击事件监听器，点击时切换到该选项卡
        tab.addEventListener('click', activateTab.bind({ tabset: tabset, tab: tab, pane: pane }))
      })
      // 如果没有选项卡与 URL 哈希匹配，默认激活第一个选项卡和面板
      if (!active && first) {
        first.tab.classList.add('is-active')
        if (first.pane) first.pane.classList.add('is-active')
      }
    }
    tabset.classList.remove('is-loading')
  })

  // 激活选项卡的逻辑，当用户点击某个选项卡时，切换 is-active 类
  function activateTab (e) {
    var tab = this.tab
    var pane = this.pane
    // 将点击的选项卡和对应的面板添加 is-active 类
    // 其他选项卡和面板则移除 is-active 类
    find('.tabs li, .tab-pane', this.tabset).forEach(function (it) {
      it === tab || it === pane ? it.classList.add('is-active') : it.classList.remove('is-active')
    })
    e.preventDefault()
  }

  // 查找指定选择器的所有元素，并将结果转换为数组
  function find (selector, from) {
    return Array.prototype.slice.call((from || document).querySelectorAll(selector))
  }

  // 查找与选项卡 id 对应的内容面板，通常通过 aria-labelledby 属性与选项卡的 id 进行匹配
  function getPane (id, tabset) {
    return find('.tab-pane', tabset).find(function (it) {
      return it.getAttribute('aria-labelledby') === id
    })
  }
})()

// 这段 JavaScript 代码是用于网页导航的交互脚本，管理了可折叠导航菜单的显示与交互

;(function () {
  'use strict'

  var SECT_CLASS_RX = /^sect(\d)$/

  var navContainer = document.querySelector('.nav-container')
  var navToggle = document.querySelector('.nav-toggle')

  // navToggle 按钮用于显示或隐藏导航（navContainer）。通过添加或移除 is-active 类来切换导航的可见性
  navToggle.addEventListener('click', showNav)
  // html 上的事件监听器确保当用户点击导航外部区域时，导航会被隐藏
  navContainer.addEventListener('click', trapEvent)

  // 获取菜单面板和导航容器
  var menuPanel = navContainer.querySelector('[data-panel=menu]')
  if (!menuPanel) return
  var nav = navContainer.querySelector('.nav')

  // 获取当前页面的导航项
  // 尝试从菜单面板中找到具有 is-current-page 类的导航项。这是用于标记当前页面对应的导航项
  var currentPageItem = menuPanel.querySelector('.is-current-page')
  // 保存了 currentPageItem 的初始值，用于后续的引用
  var originalPageItem = currentPageItem
  // 激活当前页面项的路径并滚动到中间
  if (currentPageItem) {
    // 激活该项路径，使得它及其父项在视觉上显示为当前选中的状态
    activateCurrentPath(currentPageItem)
    // 将当前页面项滚动到菜单面板的中间位置，确保用户可以看到它
    scrollItemToMidpoint(menuPanel, currentPageItem.querySelector('.nav-link'))
  } else {
    // 如果没有找到 currentPageItem（即当前页面没有对应的导航项），则将 menuPanel.scrollTop 设置为 0，表示将菜单面板滚动到顶部
    menuPanel.scrollTop = 0
  }

  // 这段代码的作用是为每个具有 .nav-item-toggle 类的按钮（通常用于展开/折叠子菜单的按钮）添加点击事件监听器，以实现导航菜单项的激活状态切换
  // 1. 查找所有具有 .nav-item-toggle 类的按钮
  // 从 menuPanel 中查找所有具有 .nav-item-toggle 类的元素，返回一个数组
  // forEach 遍历这些按钮元素，为每个按钮添加相应的事件监听器
  find(menuPanel, '.nav-item-toggle').forEach(function (btn) {
    // 2. 获取按钮的父元素 li 并绑定事件
    var li = btn.parentElement // 获取按钮的父元素 li，即导航项
    // 为按钮添加点击事件监听器。当按钮被点击时，执行 toggleActive 函数，并将 li 作为上下文 (this) 传递给该函数。toggleActive 函数用于切换当前导航项的激活状态。
    btn.addEventListener('click', toggleActive.bind(li))
    // 3. 查找并处理 .nav-text 元素
    // 查找按钮之前的兄弟元素 .nav-text（通常是显示菜单文本的元素）
    var navItemSpan = findPreviousElement(btn, '.nav-text')
    if (navItemSpan) {
      // 如果找到了 .nav-text 元素，设置它的 cursor 样式为 pointer，表示该元素可以被点击
      navItemSpan.style.cursor = 'pointer'
      // 为 .nav-text 元素添加点击事件监听器，当点击时，同样调用 toggleActive 函数并将 li 作为上下文传递给它
      navItemSpan.addEventListener('click', toggleActive.bind(li))
    }
  })

  // NOTE prevent text from being selected by double click
  menuPanel.addEventListener('mousedown', function (e) {
    if (e.detail > 1) e.preventDefault()
  })

  // 函数的主要目的是根据 URL 哈希值（即 window.location.hash）更新导航栏中当前激活的菜单项，并使其滚动到视口中。
  // 它处理页面内的导航链接，确保用户访问页面的特定部分时，导航栏中的相应项被高亮并滚动到合适的位置。
  function onHashChange () {
    var navLink
    var hash = window.location.hash
    // 如果存在 hash（即 URL 中的 #部分）
    if (hash) {
      // 如果 hash 包含 URL 编码字符，进行解码
      if (hash.indexOf('%')) hash = decodeURIComponent(hash)
      // 查找与 hash 匹配的导航链接
      navLink = menuPanel.querySelector('.nav-link[href="' + hash + '"]')
      // 如果未找到匹配的 navLink
      if (!navLink) {
        var targetNode = document.getElementById(hash.slice(1))
        if (targetNode) {
          var current = targetNode
          var ceiling = document.querySelector('article.doc')
          // 在目标节点的父节点中查找，直到找到文档的顶部（ceiling）
          while ((current = current.parentNode) && current !== ceiling) {
            var id = current.id
            // NOTE: look for section heading 查找 section 标题
            if (!id && (id = SECT_CLASS_RX.test(current.className))) id = (current.firstElementChild || {}).id
            // 如果找到 id，更新 navLink
            if (id && (navLink = menuPanel.querySelector('.nav-link[href="#' + id + '"]'))) break
          }
        }
      }
    }
    var navItem
    // 如果找到了对应的 navLink
    if (navLink) {
      navItem = navLink.parentNode
    } else if (originalPageItem) {
      // 如果没有找到 navLink，使用原始页面项
      navLink = (navItem = originalPageItem).querySelector('.nav-link')
    } else {
      return // 如果没有原始页面项，什么都不做
    }
    // 如果当前项和新项相同，直接返回
    if (navItem === currentPageItem) return
    // 移除所有已激活项的相关类
    find(menuPanel, '.nav-item.is-active').forEach(function (el) {
      el.classList.remove('is-active', 'is-current-path', 'is-current-page')
    })
    // 激活当前页面的菜单项
    navItem.classList.add('is-current-page')
    currentPageItem = navItem
    // 激活当前路径的菜单项
    activateCurrentPath(navItem)
    // 滚动当前菜单项到视口中间
    scrollItemToMidpoint(menuPanel, navLink)
  }

  // 这段代码的作用是监听页面的哈希变化，并在哈希值发生变化时调用 onHashChange 函数来更新导航状态
  // 查找菜单面板 (menuPanel) 中所有以 # 开头的链接（即锚点链接）
  if (menuPanel.querySelector('.nav-link[href^="#"]')) {
    if (window.location.hash) onHashChange()
    window.addEventListener('hashchange', onHashChange)
  }

  // 函数的作用是激活当前路径在导航菜单中的相关项，并在导航菜单中递归地添加适当的激活类。
  // 这使得导航栏的父级菜单项也显示为激活状态，直到到达菜单的根级（nav-menu）。这样，点击某个菜单项时，相关的父级菜单项也会被标记为“活动”
  function activateCurrentPath (navItem) {
    var ancestorClasses
    var ancestor = navItem.parentNode

    // 遍历直到找到包含 'nav-menu' 类的祖先元素
    while (!(ancestorClasses = ancestor.classList).contains('nav-menu')) {
      // 如果父元素是 'LI' 且包含 'nav-item' 类，则添加 'is-active' 和 'is-current-path' 类
      if (ancestor.tagName === 'LI' && ancestorClasses.contains('nav-item')) {
        ancestorClasses.add('is-active', 'is-current-path')
      }
      // 继续向上遍历父节点
      ancestor = ancestor.parentNode
    }
    // 激活当前导航项
    navItem.classList.add('is-active')
  }

  // 函数的作用是切换当前菜单项的激活状态，并在需要时调整菜单面板的滚动位置
  function toggleActive () {
    // 1. 切换 is-active 类
    // 对当前菜单项（this）的类列表进行切换。如果该元素没有 is-active 类，则添加；如果已有，则移除。
    // toggle() 方法返回一个布尔值，表示类是否被添加（true 表示添加，false 表示移除）
    if (this.classList.toggle('is-active')) {
      // 2. 计算并处理菜单项的滚动
      // 获取菜单项的 marginTop 值
      var padding = parseFloat(window.getComputedStyle(this).marginTop)
      // 获取菜单项的位置信息
      // 获取当前菜单项的位置和尺寸信息，包括它相对于视口的位置（如 top, bottom, left, right 等）
      var rect = this.getBoundingClientRect()
      // 获取整个菜单面板（menuPanel）的位置和尺寸信息
      var menuPanelRect = menuPanel.getBoundingClientRect()
      // 计算当前菜单项底部与菜单面板顶部的距离，并考虑到菜单项的 marginTop 值。如果当前菜单项超出了面板的底部，则这个值为正
      var overflowY = (rect.bottom - menuPanelRect.top - menuPanelRect.height + padding).toFixed()
      // 调整菜单面板的滚动位置
      // * 如果溢出值大于 0（即菜单项的底部超出了面板的底部），则需要滚动菜单面板来显示当前项
      // * menuPanel.scrollTop +=：通过增加 scrollTop 来滚动菜单面板
      // * Math.min((rect.top - menuPanelRect.top - padding).toFixed(), overflowY)：计算并滚动菜单面板。
      // 滚动量是菜单项顶部与菜单面板顶部之间的距离，减去 padding，但如果超出了面板的底部，则滚动量不超过 overflowY
      if (overflowY > 0) menuPanel.scrollTop += Math.min((rect.top - menuPanelRect.top - padding).toFixed(), overflowY)
    }
  }

  // 该函数的作用是控制导航的显示，包括添加必要的样式、计算导航的高度，以及确保用户点击页面其他区域时，导航会被隐藏。
  function showNav (e) {
    // 1. 检查当前导航是否已经是活动状态
    // 如果 navToggle 按钮已经处于活动状态（即菜单已经显示），则直接调用 hideNav 函数隐藏导航，避免重复操作。
    if (navToggle.classList.contains('is-active')) return hideNav(e)
    // 2. 阻止事件传播
    // 调用 trapEvent 函数阻止事件冒泡，确保点击事件只会影响当前的元素，而不会影响其他地方的事件处理
    trapEvent(e)
    // 3. 添加导航显示样式
    var html = document.documentElement
    // 将 is-clipped--nav 类添加到 html 元素，通常这个类会用于在显示导航时修改页面的样式，例如使页面内容被裁剪或变暗，以突出显示导航
    html.classList.add('is-clipped--nav')
    // 将 is-active 类添加到 navToggle 按钮，标记该按钮为活动状态，通常用来改变按钮的样式（例如，切换按钮图标）
    navToggle.classList.add('is-active')
    // 将 is-active 类添加到 navContainer（导航容器）上，标记导航容器为活动状态，使导航显示出来
    navContainer.classList.add('is-active')
    // 4. 计算并调整导航高度
    // 获取导航元素的位置和尺寸
    var bounds = nav.getBoundingClientRect()
    // 计算预计的导航高度，通常是将导航的高度设置为视口高度减去导航距离顶部的距离
    var expectedHeight = window.innerHeight - Math.round(bounds.top)
    // 如果当前导航的高度与预计高度不一致，则调整导航的高度，以确保它覆盖整个视口
    if (Math.round(bounds.height) !== expectedHeight) nav.style.height = expectedHeight + 'px'
    // 在 html 上添加一个点击事件监听器，当用户点击页面的其他地方时，会调用 hideNav 函数来隐藏导航
    html.addEventListener('click', hideNav)
  }

  // hideNav 函数的作用是将导航菜单隐藏，并恢复页面的正常状态。
  // 它会移除一系列 CSS 类来隐藏导航、恢复按钮样式，并移除点击事件监听器，确保用户点击页面其他地方时不会继续触发隐藏导航的操作。
  function hideNav (e) {
    // 1. 阻止事件传播
    trapEvent(e)
    // 2. 移除导航显示样式
    var html = document.documentElement
    // 从 html 元素移除 is-clipped--nav 类，这通常是为了恢复页面内容的正常显示，去掉导航显示时可能对页面内容的裁剪或遮挡效果
    html.classList.remove('is-clipped--nav')
    // 从 navToggle 按钮移除 is-active 类，标记按钮为非活动状态，通常用来恢复按钮的样式（例如，恢复按钮的图标状态）
    navToggle.classList.remove('is-active')
    // 从 navContainer（导航容器）移除 is-active 类，标记导航容器为非活动状态，使导航隐藏
    navContainer.classList.remove('is-active')
    // 3. 移除点击事件监听器
    html.removeEventListener('click', hideNav)
  }

  // 阻止事件传播
  function trapEvent (e) {
    e.stopPropagation()
  }

  // 用于将目标元素 (el) 滚动到容器 (panel) 的中间位置
  function scrollItemToMidpoint (panel, el) {
    // 1. 获取面板的尺寸和位置
    // rect 是一个包含 top, left, right, bottom, width, height 等属性的对象
    var rect = panel.getBoundingClientRect()
    // 2. 设置有效高度
    // 获取面板的可视高度 (rect.height)，即面板的高度
    var effectiveHeight = rect.height
    // 3. 处理固定定位的导航栏
    // 获取导航栏的样式信息
    var navStyle = window.getComputedStyle(nav)
    // 如果导航栏是 sticky（固定定位），计算其位置的偏移量，并调整 effectiveHeight。这样做是为了考虑固定导航栏的高度，防止导航栏遮挡目标元素
    if (navStyle.position === 'sticky') effectiveHeight -= rect.top - parseFloat(navStyle.top)
    // 4. 滚动面板，确保目标元素位于面板的中间位置
    panel.scrollTop = Math.max(0, (el.getBoundingClientRect().height - effectiveHeight) * 0.5 + el.offsetTop)
  }

  // 函数用于在指定的 DOM 元素（from）中查找匹配指定选择器（selector）的所有元素，并返回一个数组。
  // 它的作用是将 querySelectorAll 返回的类数组（NodeList）转换为真正的数组，以便可以使用数组方法（如 forEach, map 等）
  function find (from, selector) {
    return [].slice.call(from.querySelectorAll(selector))
  }

  // 通过 previousElementSibling 查找目标元素的前一个兄弟元素，并根据传入的选择器判断该元素是否符合条件。如果符合条件，则返回该元素；否则，返回 null 或前一个兄弟元素。
  function findPreviousElement (from, selector) {
    // previousElementSibling 属性返回当前元素前一个同级的兄弟元素（仅返回元素节点，不包括文本节点或注释节点）。如果没有前一个兄弟元素，则返回 null
    var el = from.previousElementSibling
    return el && selector ? el[el.matches ? 'matches' : 'msMatchesSelector'](selector) && el : el
  }
})()

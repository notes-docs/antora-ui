// 这段代码用于为代码片段添加工具功能，包括代码复制按钮、语言标签显示，以及对 console 命令的处理。这些功能常见于代码展示页面，如文档或在线教程页面。
;(function () {
  'use strict'

  // 1. 正则表达式定义
  // 匹配控制台命令块。可以匹配类似 $ command && othercommand 的内容
  var CMD_RX = /^\$ (\S[^\\\n]*(\\\n(?!\$ )[^\\\n]*)*)(?=\n|$)/gm
  // 处理跨行命令符号 \\\n
  var LINE_CONTINUATION_RX = /( ) *\\\n *|\\\n( ?) */g
  // 去除代码末尾的多余空格
  var TRAILING_SPACE_RX = / +$/gm
  var config = (document.getElementById('site-script') || { dataset: {} }).dataset

  // 2. 查找所有相关代码块并解析
  // 遍历所有满足 .doc pre.highlight, .doc .literalblock pre 选择器的代码块。
  // 如果是控制台命令块，动态转换其结构，显示为 console 类型。
  ;[].slice.call(document.querySelectorAll('.doc pre.highlight, .doc .literalblock pre')).forEach(function (pre) {
    var code, language, lang, copy, toast, toolbox
    if (pre.classList.contains('highlight')) { // 高亮代码块
      code = pre.querySelector('code')
      if ((language = code.dataset.lang) && language !== 'console') {
        ;(lang = document.createElement('span')).className = 'source-lang'
        lang.appendChild(document.createTextNode(language))
      }
    } else if (pre.innerText.startsWith('$ ')) { // 控制台块
      var block = pre.parentNode.parentNode
      block.classList.remove('literalblock')
      block.classList.add('listingblock')
      pre.classList.add('highlightjs', 'highlight')
      ;(code = document.createElement('code')).className = 'language-console hljs'
      code.dataset.lang = 'console'
      code.appendChild(pre.firstChild)
      pre.appendChild(code)
    } else {
      return
    }

    // 3. 创建工具按钮
    // 创建工具栏 <div>。
    // 如果存在代码语言标签（如 Python 或 JS），将其添加到工具栏中。
    ;(toolbox = document.createElement('div')).className = 'source-toolbox'
    if (lang) toolbox.appendChild(lang)
    // 添加复制按钮
    if (window.navigator.clipboard) {
      ;(copy = document.createElement('button')).className = 'copy-button'
      copy.setAttribute('title', 'Copy to clipboard')
      // 按钮图标可以是 SVG 图标或普通图片
      if (config.svgAs === 'svg') {
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        svg.setAttribute('class', 'copy-icon')
        var use = document.createElementNS('http://www.w3.org/2000/svg', 'use')
        use.setAttribute('href', window.uiRootPath + '/img/octicons-16.svg#icon-clippy')
        svg.appendChild(use)
        copy.appendChild(svg)
      } else {
        var img = document.createElement('img')
        img.src = window.uiRootPath + '/img/octicons-16.svg#view-clippy'
        img.alt = 'copy icon'
        img.className = 'copy-icon'
        copy.appendChild(img)
      }
      // 显示用户点击后提示信息 Copied!
      ;(toast = document.createElement('span')).className = 'copy-toast'
      toast.appendChild(document.createTextNode('Copied!'))
      copy.appendChild(toast)
      toolbox.appendChild(copy)
    }
    pre.appendChild(toolbox)
    // 按钮点击时触发 writeToClipboard 函数
    if (copy) copy.addEventListener('click', writeToClipboard.bind(copy, code))
  })

  // 4. 处理复制逻辑
  // 提取命令行代码块并合并成单行字符串（通过替换跨行符 \\\n）
  function extractCommands (text) {
    var cmds = []
    var m
    while ((m = CMD_RX.exec(text))) cmds.push(m[1].replace(LINE_CONTINUATION_RX, '$1$2'))
    return cmds.join(' && ')
  }

  // 复制到剪贴板的实现
  function writeToClipboard (code) {
    // 去除多余空格
    var text = code.innerText.replace(TRAILING_SPACE_RX, '')
    // 如果是 console 命令行，预处理命令为有效的单行命令
    if (code.dataset.lang === 'console' && text.startsWith('$ ')) text = extractCommands(text)
    // 调用 navigator.clipboard.writeText(text) 实现复制功能
    window.navigator.clipboard.writeText(text).then(
      function () {
        this.classList.add('clicked')
        this.offsetHeight // eslint-disable-line no-unused-expressions
        this.classList.remove('clicked')
      }.bind(this),
      function () {}
    )
  }
})()

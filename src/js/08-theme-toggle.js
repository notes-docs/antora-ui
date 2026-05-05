;(function () {
  'use strict'

  var root = document.documentElement
  var themeToggle = document.querySelector('[data-theme-toggle]')
  if (!themeToggle) return

  themeToggle.addEventListener('click', function () {
    var nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark'
    root.dataset.theme = nextTheme
    window.localStorage.setItem('lucode-theme', nextTheme)
  })
})()

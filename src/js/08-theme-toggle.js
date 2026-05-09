;(function () {
  'use strict'

  var storageKey = 'lucode-theme'
  var root = document.documentElement
  var themeToggle = document.querySelector('[data-theme-toggle]')
  var media = window.matchMedia('(prefers-color-scheme: dark)')
  if (!themeToggle) return

  function getStoredTheme () {
    var storedTheme = window.localStorage.getItem(storageKey)
    return storedTheme === 'dark' || storedTheme === 'light' ? storedTheme : null
  }

  function getPreferredTheme () {
    return media.matches ? 'dark' : 'light'
  }

  function applyTheme (theme) {
    root.dataset.theme = theme
    themeToggle.setAttribute('aria-pressed', String(theme === 'dark'))
    themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme')
    themeToggle.setAttribute('title', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme')
  }

  function syncThemeFromPreference () {
    applyTheme(getStoredTheme() || getPreferredTheme())
  }

  syncThemeFromPreference()

  themeToggle.addEventListener('click', function () {
    var nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark'
    window.localStorage.setItem(storageKey, nextTheme)
    applyTheme(nextTheme)
  })

  media.addEventListener('change', function () {
    if (!getStoredTheme()) syncThemeFromPreference()
  })
})()

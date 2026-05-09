;(function () {
  'use strict'

  var storageKey = 'lucode-theme'
  var root = document.documentElement
  var themeToggle = document.querySelector('[data-theme-toggle]')
  var media = window.matchMedia('(prefers-color-scheme: dark)')
  if (!themeToggle) return

  function getStoredTheme () {
    try {
      var storedTheme = window.localStorage.getItem(storageKey)
      return storedTheme === 'dark' || storedTheme === 'light' ? storedTheme : null
    } catch (err) {
      return null
    }
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
    try {
      window.localStorage.setItem(storageKey, nextTheme)
    } catch (err) {}
    applyTheme(nextTheme)
  })

  var handlePreferenceChange = function () {
    if (!getStoredTheme()) syncThemeFromPreference()
  }

  if (media.addEventListener) {
    media.addEventListener('change', handlePreferenceChange)
  } else if (media.addListener) {
    media.addListener(handlePreferenceChange)
  }
})()

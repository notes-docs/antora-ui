;(function () {
  'use strict'

  var searchRoot = document.querySelector('[data-search-root]')
  if (!searchRoot) return

  var openButton = searchRoot.querySelector('[data-open-search]')
  var dialog = searchRoot.querySelector('.search-dialog')
  var backdrop = searchRoot.querySelector('.search-backdrop')
  var input = searchRoot.querySelector('[data-search-input]')
  var results = searchRoot.querySelector('[data-search-results]')
  var meta = searchRoot.querySelector('[data-search-meta]')
  var closeButtons = searchRoot.querySelectorAll('[data-close-search]')
  var body = document.body

  if (!openButton || !dialog || !backdrop || !input || !results || !meta) return

  var dataset = []
  var selectedIndex = -1

  function collectEntries () {
    dataset = []

    document.querySelectorAll('.docs-nav-bar a, .nav-menu a').forEach(function (link) {
      var text = (link.textContent || '').trim()
      var href = link.getAttribute('href')
      if (!text || !href) return
      dataset.push({ type: 'Navigation', text: text, href: href })
    })

    document.querySelectorAll('.doc h1, .doc h2, .doc h3').forEach(function (heading) {
      var text = (heading.textContent || '').trim()
      if (!text) return
      var id = heading.id
      dataset.push({ type: 'On this page', text: text, href: id ? '#' + id : window.location.pathname })
    })
  }

  function uniqueEntries (entries) {
    var seen = new Set()
    return entries.filter(function (entry) {
      var key = entry.type + '::' + entry.text + '::' + entry.href
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }

  function renderEntries (entries, query) {
    selectedIndex = -1
    results.innerHTML = ''

    if (!entries.length) {
      meta.textContent = query ? 'No matching results.' : 'Type to search this page and navigation links.'
      results.innerHTML = '<p class="search-empty">No results yet.</p>'
      return
    }

    meta.textContent = query ? entries.length + ' result' + (entries.length === 1 ? '' : 's') : 'Quick links'

    var list = document.createElement('div')
    list.className = 'search-result-list'

    entries.forEach(function (entry, index) {
      var item = document.createElement('a')
      item.className = 'search-result-item'
      item.href = entry.href
      item.dataset.resultIndex = String(index)
      item.innerHTML =
        '<span class="search-result-type">' +
        entry.type +
        '</span><strong class="search-result-title">' +
        entry.text +
        '</strong>'
      item.addEventListener('click', closeSearch)
      list.appendChild(item)
    })

    results.appendChild(list)
  }

  function filterEntries (query) {
    var normalized = query.trim().toLowerCase()
    var entries = uniqueEntries(dataset)
    if (!normalized) return entries.slice(0, 8)
    return entries
      .filter(function (entry) {
        return entry.text.toLowerCase().includes(normalized) || entry.type.toLowerCase().includes(normalized)
      })
      .slice(0, 10)
  }

  function updateSelection (nextIndex) {
    var items = results.querySelectorAll('.search-result-item')
    if (!items.length) return
    selectedIndex = (nextIndex + items.length) % items.length
    items.forEach(function (item, index) {
      item.toggleAttribute('data-selected', index === selectedIndex)
    })
    items[selectedIndex].scrollIntoView({ block: 'nearest' })
  }

  function openSearch () {
    collectEntries()
    renderEntries(filterEntries(''), '')
    dialog.hidden = false
    backdrop.hidden = false
    body.toggleAttribute('data-search-open', true)
    window.requestAnimationFrame(function () {
      input.focus()
      input.select()
    })
  }

  function closeSearch () {
    dialog.hidden = true
    backdrop.hidden = true
    body.toggleAttribute('data-search-open', false)
    input.value = ''
    openButton.focus()
  }

  openButton.addEventListener('click', function () {
    openSearch()
  })

  closeButtons.forEach(function (button) {
    button.addEventListener('click', closeSearch)
  })

  input.addEventListener('input', function () {
    renderEntries(filterEntries(input.value), input.value)
  })

  input.addEventListener('keydown', function (event) {
    var items = results.querySelectorAll('.search-result-item')
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      updateSelection(selectedIndex + 1)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      updateSelection(selectedIndex - 1)
    } else if (event.key === 'Enter' && selectedIndex >= 0 && items[selectedIndex]) {
      event.preventDefault()
      items[selectedIndex].click()
    } else if (event.key === 'Escape') {
      event.preventDefault()
      closeSearch()
    }
  })

  window.addEventListener('keydown', function (event) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault()
      if (dialog.hidden) {
        openSearch()
      } else {
        closeSearch()
      }
    } else if (event.key === 'Escape' && !dialog.hidden) {
      closeSearch()
    }
  })
})()

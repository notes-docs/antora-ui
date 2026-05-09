;(function () {
  'use strict'

  var toc = document.querySelector('.docs-toc-panel')
  var article = document.querySelector('article.doc')
  if (!toc || !article) return

  var levels = parseInt(toc.dataset.levels || '2', 10)
  if (Number.isNaN(levels) || levels < 0) return

  var menu = toc.querySelector('.toc-menu')
  if (!menu) return

  function getHeadingSelectors () {
    var selectors = []
    for (var level = 2; level <= levels + 1; level++) selectors.push('.doc h' + level + '[id]')
    return selectors.join(', ')
  }

  function slugify (value) {
    return (value || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\u4e00-\u9fa5\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }

  function ensureHeadingIds () {
    var seen = Object.create(null)
    Array.prototype.slice.call(article.querySelectorAll('.doc h2, .doc h3, .doc h4, .doc h5, .doc h6')).forEach(function (heading) {
      if (heading.id) {
        seen[heading.id] = true
        return
      }

      var base = slugify(heading.textContent) || 'section'
      var next = base
      var index = 2
      while (seen[next] || document.getElementById(next)) {
        next = base + '-' + index
        index += 1
      }
      heading.id = next
      seen[next] = true
    })
  }

  function buildMenu () {
    if (menu.querySelector('a')) return

    ensureHeadingIds()

    var headings = Array.prototype.slice.call(article.querySelectorAll(getHeadingSelectors()))
    if (!headings.length) return

    var root = document.createElement('ul')
    var listStack = [root]
    var levelStack = [2]

    headings.forEach(function (heading) {
      var level = parseInt(heading.tagName.slice(1), 10)
      var link = document.createElement('a')
      link.href = '#' + heading.id
      link.textContent = (heading.textContent || '').trim()

      var item = document.createElement('li')
      item.dataset.level = String(level)
      item.appendChild(link)

      while (level < levelStack[levelStack.length - 1] && listStack.length > 1) {
        listStack.pop()
        levelStack.pop()
      }

      if (level > levelStack[levelStack.length - 1]) {
        var parentList = listStack[listStack.length - 1]
        var parentItem = parentList.lastElementChild
        var nestedList = document.createElement('ul')
        if (parentItem) {
          parentItem.appendChild(nestedList)
          listStack.push(nestedList)
          levelStack.push(level)
        }
      }

      listStack[listStack.length - 1].appendChild(item)
    })

    menu.appendChild(root)
  }

  buildMenu()

  var links = Array.prototype.slice.call(menu.querySelectorAll('a'))
  if (!links.length) {
    toc.parentNode && toc.parentNode.removeChild(toc)
    return
  }

  var current = toc.querySelector('a[aria-current="true"]')

  function setCurrent (link) {
    if (!link || link === current) return
    if (current) current.removeAttribute('aria-current')
    link.setAttribute('aria-current', 'true')
    current = link
    link.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }

  function getRootMargin () {
    var headerHeight = document.querySelector('.header')?.getBoundingClientRect().height || 0
    var top = Math.round(headerHeight + 32)
    var bottom = top + 53 - document.documentElement.clientHeight
    return '-' + top + 'px 0% ' + bottom + 'px'
  }

  function buildObservedNodes () {
    return Array.prototype.slice.call(
      document.querySelectorAll('main [id], main [id] ~ *, main .doc-content > *')
    )
  }

  function findHeading (origin) {
    if (!origin) return null
    var node = origin
    var HeadingCtor = window.HTMLHeadingElement

    while (node) {
      if (HeadingCtor && node instanceof HeadingCtor && node.id) return node

      var previous = node.previousElementSibling
      while (previous && previous.lastElementChild) previous = previous.lastElementChild
      if (previous) {
        var fromSibling = findHeading(previous)
        if (fromSibling) return fromSibling
      }

      node = node.parentElement
      if (node === article) break
    }

    return article.querySelector('h1.page[id], h2[id], h3[id], h4[id]')
  }

  function findLinkForHeading (heading) {
    if (!heading) return null
    var targetHash = '#' + encodeURIComponent(heading.id)
    return links.find(function (link) {
      return link.hash === targetHash || link.getAttribute('href') === '#' + heading.id
    })
  }

  var observer

  function observe () {
    if (observer) return
    var IntersectionObserverCtor = window.IntersectionObserver
    if (!IntersectionObserverCtor) return

    observer = new IntersectionObserverCtor(
      function (entries) {
        for (var i = 0; i < entries.length; i++) {
          var entry = entries[i]
          if (!entry.isIntersecting) continue
          var heading = findHeading(entry.target)
          var link = findLinkForHeading(heading)
          if (link) {
            setCurrent(link)
            break
          }
        }
      },
      { rootMargin: getRootMargin() }
    )

    buildObservedNodes().forEach(function (node) {
      observer.observe(node)
    })
  }

  function resetObserverSoon () {
    if (observer) {
      observer.disconnect()
      observer = undefined
    }
    window.clearTimeout(resetObserverSoon.timeout)
    resetObserverSoon.timeout = window.setTimeout(function () {
      observe()
    }, 200)
  }

  observe()
  window.addEventListener('resize', resetObserverSoon)
})()

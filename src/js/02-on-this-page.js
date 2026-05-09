;(function () {
  'use strict'

  var toc = document.querySelector('.docs-toc-panel')
  var article = document.querySelector('article.doc')
  if (!toc || !article) return

  var links = Array.prototype.slice.call(toc.querySelectorAll('.toc-menu a'))
  if (!links.length) return

  var current = toc.querySelector('a[aria-current="true"]')

  function setCurrent (link) {
    if (!link || link === current) return
    if (current) current.removeAttribute('aria-current')
    link.setAttribute('aria-current', 'true')
    current = link
    link.scrollIntoView({ block: 'nearest' })
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

    while (node) {
      if (node instanceof HTMLHeadingElement && node.id) return node

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

    observer = new IntersectionObserver(
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

'use strict'

const ACCENTS = ['orange', 'blue', 'green', 'red', 'purple']

module.exports = function booksHomeSections (navigation = []) {
  return navigation.reduce((sections, item, index) => {
    const title = normalizeLabel(item.content)
    if (!title) return sections

    const cards = collectLeaves(item.items || [], title).map((card) => ({
      ...card,
      accent: ACCENTS[index % ACCENTS.length],
    }))

    if (!cards.length) return sections

    sections.push({
      title,
      anchor: `home-section-${index + 1}`,
      count: cards.length,
      cards,
    })

    return sections
  }, [])
}

function collectLeaves (items, sectionTitle, trail = []) {
  return items.reduce((cards, item) => {
    const title = normalizeLabel(item.content)
    const nextTrail = title ? trail.concat(title) : trail
    const children = Array.isArray(item.items) ? item.items : []

    if (children.length) {
      cards.push(...collectLeaves(children, sectionTitle, nextTrail))
      return cards
    }

    if (!title || !isNavigable(item)) return cards

    const parentTrail = nextTrail.slice(0, -1)
    const parentLabel = parentTrail.at(-1)
    const description = parentLabel
      ? `收录于 ${sectionTitle} · ${parentLabel}`
      : `收录于 ${sectionTitle} 分类`
    const tags = [sectionTitle]

    if (parentLabel && parentLabel !== sectionTitle) tags.push(parentLabel)

    cards.push({
      title,
      href: item.url,
      urlType: item.urlType || 'internal',
      description,
      tags,
      coverText: createCoverText(title),
    })

    return cards
  }, [])
}

function isNavigable (item) {
  if (!item || !item.url) return false
  if (item.urlType === 'fragment') return false
  return !item.url.startsWith('#')
}

function normalizeLabel (value) {
  return typeof value === 'string' ? value.trim() : ''
}

function createCoverText (title) {
  const words = title.match(/[A-Za-z0-9]+/g)
  if (words && words.length > 1) return words.slice(0, 2).map((word) => word[0].toUpperCase()).join('')
  if (words && words[0].length) return words[0].slice(0, 2).toUpperCase()
  return Array.from(title.replace(/\s+/g, '')).slice(0, 2).join('')
}

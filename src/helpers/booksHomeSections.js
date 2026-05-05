'use strict'

const ACCENTS = ['orange', 'blue', 'green', 'red', 'purple']

module.exports = function booksHomeSections (components = []) {
  const componentList = Array.isArray(components) ? components : Object.values(components || {})

  return componentList.reduce((cards, component, index) => {
    const title = normalizeLabel(component.title)
    const href = component.latestVersion?.url || component.url
    if (!title || !href) return cards

    const version = normalizeLabel(component.latestVersion?.displayVersion || component.latestVersion?.version || '')
    const tags = ['组件手册']
    if (version) tags.push(version)

    cards.push({
      title,
      href,
      urlType: 'internal',
      description: version ? `当前收录版本 ${version}，点击进入完整手册。` : '点击进入完整手册。',
      tags,
      coverText: createCoverText(title),
      accent: ACCENTS[index % ACCENTS.length],
    })

    return cards
  }, [])
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

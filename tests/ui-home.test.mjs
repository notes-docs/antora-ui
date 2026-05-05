import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const packageDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const srcDir = path.join(packageDir, 'src')
const helperPath = path.join(srcDir, 'helpers', 'booksHomeSections.js')
const articlePath = path.join(srcDir, 'partials', 'article.hbs')
const homeLandingPath = path.join(srcDir, 'partials', 'home-landing.hbs')

test('books home sections helper groups navigation leaves into card sections', async () => {
  const { default: booksHomeSections } = await import(helperPath)
  const components = [
    {
      name: 'antora-ui',
      title: 'antoraUI 手册',
      url: '/antora-ui/index.html',
      latestVersion: {
        url: '/antora-ui/index.html',
        displayVersion: '3.1',
      },
    },
    {
      name: 'antora',
      title: 'Antora 手册',
      url: '/antora/index.html',
      latestVersion: {
        url: '/antora/index.html',
        displayVersion: '3.1',
      },
    },
    {
      name: 'asciidoctor',
      title: 'asciidoctor.js 手册',
      url: '/asciidoctor-js/index.html',
      latestVersion: {
        url: '/asciidoctor-js/index.html',
        displayVersion: '2.2',
      },
    },
  ]
  const cards = booksHomeSections(components)

  assert.equal(Array.isArray(cards), true)
  assert.deepEqual(
    cards.map((card) => card.title),
    ['antoraUI 手册', 'Antora 手册', 'asciidoctor.js 手册']
  )
  assert.equal(cards[0].href, '/antora-ui/index.html')
  assert.match(cards[0].description, /3\.1/)
  assert.deepEqual(cards[0].tags, ['组件手册', '3.1'])
  assert.equal(cards[2].coverText.length > 0, true)
})

test('books home sections helper accepts Antora component maps', async () => {
  const { default: booksHomeSections } = await import(helperPath)
  const components = {
    antora: {
      name: 'antora',
      title: 'Antora 手册',
      url: '/antora/index.html',
      latestVersion: {
        url: '/antora/index.html',
        displayVersion: '3.1',
      },
    },
    asciidoctor: {
      name: 'asciidoctor',
      title: 'asciidoctor.js 手册',
      url: '/asciidoctor-js/index.html',
      latestVersion: {
        url: '/asciidoctor-js/index.html',
        displayVersion: '2.2',
      },
    },
  }

  const cards = booksHomeSections(components)

  assert.equal(Array.isArray(cards), true)
  assert.deepEqual(
    cards.map((card) => card.title),
    ['Antora 手册', 'asciidoctor.js 手册']
  )
  assert.equal(cards[1].href, '/asciidoctor-js/index.html')
})

test('home page source switches to the books landing partial', () => {
  const articleSource = fs.readFileSync(articlePath, 'utf8')
  const homeLandingSource = fs.readFileSync(homeLandingPath, 'utf8')

  assert.match(articleSource, /page\.home/)
  assert.match(articleSource, /home-landing/)

  assert.match(homeLandingSource, /books-home/)
  assert.match(homeLandingSource, /books-grid/)
  assert.match(homeLandingSource, /book-card/)
  assert.match(homeLandingSource, /booksHomeSections/)
})

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
  const navigation = [
    {
      content: 'AI',
      items: [
        {
          content: 'Stable Diffusion',
          items: [
            {
              content: 'Stable Diffusion 生图',
              url: '/ai/stable-diffusion.html',
              urlType: 'internal',
            },
          ],
        },
        {
          content: 'Locust',
          url: '/ai/locust.html',
          urlType: 'internal',
        },
      ],
    },
    {
      content: 'Go',
      items: [
        {
          content: 'goRpc',
          items: [
            {
              content: 'goRpc 手册',
              url: '/go/gorpc-manual.html',
              urlType: 'internal',
            },
          ],
        },
      ],
    },
  ]
  const sections = booksHomeSections(navigation)

  assert.equal(Array.isArray(sections), true)
  assert.deepEqual(
    sections.map((section) => section.title),
    ['AI', 'Go']
  )
  assert.equal(sections[0].count, 2)
  assert.equal(sections[1].count, 1)
  assert.deepEqual(
    sections[0].cards.map((card) => card.title),
    ['Stable Diffusion 生图', 'Locust']
  )
  assert.equal(sections[0].cards[0].href, '/ai/stable-diffusion.html')
  assert.match(sections[0].cards[0].description, /AI/)
  assert.deepEqual(sections[0].cards[0].tags, ['AI', 'Stable Diffusion'])
  assert.equal(sections[1].cards[0].coverText.length > 0, true)
})

test('home page source switches to the books landing partial', () => {
  const articleSource = fs.readFileSync(articlePath, 'utf8')
  const homeLandingSource = fs.readFileSync(homeLandingPath, 'utf8')

  assert.match(articleSource, /page\.home/)
  assert.match(articleSource, /home-landing/)

  assert.match(homeLandingSource, /books-home/)
  assert.match(homeLandingSource, /books-section/)
  assert.match(homeLandingSource, /book-card/)
  assert.match(homeLandingSource, /booksHomeSections/)
})

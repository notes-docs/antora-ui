import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const packageDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const srcDir = join(packageDir, 'src')

test('Lucode Antora UI source files exist', () => {
  const expectedFiles = [
    'partials/header-content.hbs',
    'partials/home-landing.hbs',
    'partials/body.hbs',
    'partials/nav.hbs',
    'partials/article.hbs',
    'partials/toc.hbs',
    'helpers/booksHomeSections.js',
    'css/vars.css',
    'css/header.css',
    'css/home.css',
    'css/nav.css',
    'css/doc.css',
    'js/08-theme-toggle.js',
  ]

  for (const relativePath of expectedFiles) {
    assert.equal(existsSync(join(srcDir, relativePath)), true, `${relativePath} should exist`)
  }
})

test('Lucode Antora UI templates contain the new shell markers', () => {
  const header = readFileSync(join(srcDir, 'partials', 'header-content.hbs'), 'utf8')
  const body = readFileSync(join(srcDir, 'partials', 'body.hbs'), 'utf8')
  const main = readFileSync(join(srcDir, 'partials', 'main.hbs'), 'utf8')
  const toc = readFileSync(join(srcDir, 'partials', 'toc.hbs'), 'utf8')

  assert.match(header, /top-nav/)
  assert.match(header, /data-theme-toggle/)
  assert.match(body, /site-shell/)
  assert.match(main, /docs-main-inner/)
  assert.match(toc, /toc-title/)
})

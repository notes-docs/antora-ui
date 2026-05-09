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
    'css/pagination.css',
    'js/08-theme-toggle.js',
    'js/02-on-this-page.js',
    'js/06-copy-to-clipboard.js',
    'js/09-search.js',
  ]

  for (const relativePath of expectedFiles) {
    assert.equal(existsSync(join(srcDir, relativePath)), true, `${relativePath} should exist`)
  }
})

test('Lucode Antora UI templates contain the new shell markers', () => {
  const header = readFileSync(join(srcDir, 'partials', 'header-content.hbs'), 'utf8')
  const body = readFileSync(join(srcDir, 'partials', 'body.hbs'), 'utf8')
  const main = readFileSync(join(srcDir, 'partials', 'main.hbs'), 'utf8')
  const article = readFileSync(join(srcDir, 'partials', 'article.hbs'), 'utf8')
  const toc = readFileSync(join(srcDir, 'partials', 'toc.hbs'), 'utf8')
  const pagination = readFileSync(join(srcDir, 'partials', 'pagination.hbs'), 'utf8')
  const mainCss = readFileSync(join(srcDir, 'css', 'main.css'), 'utf8')
  const bodyCss = readFileSync(join(srcDir, 'css', 'body.css'), 'utf8')
  const homeCss = readFileSync(join(srcDir, 'css', 'home.css'), 'utf8')
  const docCss = readFileSync(join(srcDir, 'css', 'doc.css'), 'utf8')
  const paginationCss = readFileSync(join(srcDir, 'css', 'pagination.css'), 'utf8')
  const varsCss = readFileSync(join(srcDir, 'css', 'vars.css'), 'utf8')
  const tocCss = readFileSync(join(srcDir, 'css', 'toc.css'), 'utf8')
  const tocJs = readFileSync(join(srcDir, 'js', '02-on-this-page.js'), 'utf8')
  const copyJs = readFileSync(join(srcDir, 'js', '06-copy-to-clipboard.js'), 'utf8')
  const searchJs = readFileSync(join(srcDir, 'js', '09-search.js'), 'utf8')
  const themeJs = readFileSync(join(srcDir, 'js', '08-theme-toggle.js'), 'utf8')
  const headerCss = readFileSync(join(srcDir, 'css', 'header.css'), 'utf8')

  assert.match(header, /data-theme-toggle/)
  assert.match(header, /docs-nav-bar/)
  assert.match(header, /data-open-search/)
  assert.match(header, /data-search-input/)
  assert.match(header, /data-search-results/)
  assert.match(header, /Home/)
  assert.match(header, /https:\/\/notes-docs\.github\.io\/docs-site\/home\//)
  assert.match(header, /github-link/)
  assert.match(body, /site-shell/)
  assert.match(main, /docs-main-inner/)
  assert.match(article, /data-slot="doc-title"/)
  assert.match(article, /data-slot="doc-title-header"/)
  assert.match(article, /slot="doc-title-description"/)
  assert.doesNotMatch(article, /doc-kicker-row/)
  assert.match(toc, /toc-title/)
  assert.match(pagination, /pagination-label/)
  assert.match(pagination, /stroke-linecap="round"/)
  assert.match(varsCss, /--toc-width:\s*18rem/)
  assert.match(varsCss, /--doc-max-width:\s*58rem/)
  assert.match(varsCss, /--doc-max-width--desktop:\s*58rem/)
  assert.match(bodyCss, /@media screen and \(min-width:\s*1120px\)/)
  assert.match(bodyCss, /justify-content:\s*center/)
  assert.match(bodyCss, /minmax\(0,\s*var\(--doc-max-width--desktop\)\)/)
  assert.match(tocCss, /\.toc-title/)
  assert.match(tocCss, /white-space:\s*nowrap/)
  assert.match(tocCss, /\.toc a/)
  assert.match(tocCss, /display:\s*block/)
  assert.match(tocCss, /aria-current='true'/)
  assert.match(tocCss, /max-width:\s*1119\.5px/)
  assert.match(mainCss, /\.docs-main\.is-home \.docs-main-inner/)
  assert.match(mainCss, /width:\s*min\(100%,\s*var\(--doc-max-width--desktop\)\)/)
  assert.match(mainCss, /margin-inline:\s*auto/)
  assert.match(mainCss, /gap:\s*1\.5rem/)
  assert.match(homeCss, /justify-content:\s*center/)
  assert.match(homeCss, /width:\s*min\(100%,\s*.*rem\)/)
  assert.match(homeCss, /grid-template-columns:\s*repeat\(4,\s*minmax\(0,\s*18rem\)\)/)
  assert.match(homeCss, /@media screen and \(max-width:\s*1200px\)/)
  assert.match(homeCss, /grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*18rem\)\)/)
  assert.match(homeCss, /@media screen and \(max-width:\s*900px\)/)
  assert.match(homeCss, /grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*18rem\)\)/)
  assert.match(docCss, /\.source-toolbox/)
  assert.match(docCss, /position:\s*absolute/)
  assert.match(docCss, /\.copy-button/)
  assert.match(docCss, /top:\s*0\.75rem/)
  assert.match(docCss, /right:\s*0\.75rem/)
  assert.match(docCss, /padding-top:\s*3\.25rem/)
  assert.match(docCss, /div\[data-slot='doc-title'\]/)
  assert.match(docCss, /\[data-slot='doc-title-header'\]/)
  assert.match(docCss, /\[slot='doc-title-description'\]/)
  assert.match(docCss, /font-size:\s*1\.875rem/)
  assert.match(docCss, /line-height:\s*2\.25rem/)
  assert.match(docCss, /max-width:\s*80%/)
  assert.match(docCss, /scroll-margin-top:\s*5rem/)
  assert.match(docCss, /max-width:\s*75%/)
  assert.match(docCss, /content:\s*'#'/)
  assert.match(docCss, /\.doc \.listingblock,/)
  assert.match(docCss, /border-radius:\s*999px/)
  assert.match(docCss, /box-shadow:\s*0 1px 2px/)
  assert.match(paginationCss, /border-top:/)
  assert.match(paginationCss, /margin-left:\s*auto/)
  assert.match(tocJs, /IntersectionObserver/)
  assert.match(tocJs, /aria-current/)
  assert.match(tocJs, /querySelectorAll\(getHeadingSelectors\(\)\)/)
  assert.match(tocJs, /menu\.appendChild\(root\)/)
  assert.match(tocJs, /function ensureHeadingIds/)
  assert.match(tocJs, /heading\.id = next/)
  assert.match(tocJs, /var listStack = \[root\]/)
  assert.match(tocJs, /parentItem\.appendChild\(nestedList\)/)
  assert.match(copyJs, /document\.queryCommandSupported\('copy'\)/)
  assert.match(copyJs, /document\.execCommand\('copy'\)/)
  assert.match(copyJs, /copy\.setAttribute\('type', 'button'\)/)
  assert.match(copyJs, /copy\.setAttribute\('aria-label', 'Copy code to clipboard'\)/)
  assert.match(copyJs, /function fallbackCopy/)
  assert.match(copyJs, /new WeakMap\(\)/)
  assert.match(copyJs, /setTimeout\(function \(\) \{/)
  assert.match(copyJs, /Copy failed/)
  assert.match(copyJs, /toast\.dataset\.defaultLabel = 'Copied!'/)
  assert.match(headerCss, /\.docs-nav-bar/)
  assert.match(headerCss, /\.docs-nav-link/)
  assert.match(headerCss, /\.icon-button/)
  assert.match(headerCss, /\.search-dialog/)
  assert.match(headerCss, /\.search-result-item/)
  assert.match(searchJs, /data-search-root/)
  assert.match(searchJs, /ctrlKey/)
  assert.match(searchJs, /ArrowDown/)
  assert.match(themeJs, /aria-pressed/)
  assert.match(themeJs, /lucode-theme/)
})

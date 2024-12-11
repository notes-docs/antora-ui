'use strict'

// 这段代码定义了一个用于计算文件路径的函数，并在其中处理了 URL 路径的相对性转换。
// 代码的主要目的是在 to 和 from 两个路径之间，根据给定的上下文 (ctx) 来生成相对路径。

const { posix: path } = require('path')

// 该函数的核心作用是计算从 from 路径到 to 路径的相对路径
// 导出一个函数，接受三个参数：
// to：目标路径。
// from：当前路径。
// ctx：上下文对象，可能包含页面信息等。
module.exports = (to, from, ctx) => {
  // 如果 to 路径为空或 null，返回 #，这通常用于无效或未定义的路径
  if (!to) return '#'
  // NOTE only legacy invocation provides both to and from
  // 如果没有提供 ctx（即上下文），则假定 from 是 ctx，并从 from 中提取页面 URL（from.data.root.page.url），将其赋值给 from 和 ctx
  if (!ctx) from = (ctx = from).data.root.page.url
  // 如果 to 路径不是以 / 开头，直接返回 to，意味着它已经是一个相对路径或完整 URL
  if (to.charAt() !== '/') return to
  // 如果 from 为空，返回由 ctx.data.root.site.path 和 to 拼接而成的路径。ctx.data.root.site.path 应该是站点的根路径。
  if (!from) return (ctx.data.root.site.path || '') + to
  // 这部分代码处理路径中的哈希（#）部分。
  // 首先，初始化一个空的 hash 字符串，并通过 indexOf 查找 to 中是否包含 # 符号。
  // 如果包含，则分离出哈希部分并将其保存到 hash 变量中，剩余的部分保留在 to 中
  let hash = ''
  const hashIdx = to.indexOf('#')
  if (~hashIdx) {
    hash = to.substr(hashIdx)
    to = to.substr(0, hashIdx)
  }
  // 如果目标路径 to 和当前路径 from 相同，则返回：
  // 如果 to 是目录，则返回 ./（表示当前目录）。
  // 否则，返回路径的基础文件名（即 path.basename(to)）。
  return to === from
    ? hash || (isDir(to) ? './' : path.basename(to))
    // 如果 to 和 from 不相同，使用 path.relative() 来计算 to 和 from 之间的相对路径，返回相对路径。如果 to 是目录，则在路径后加上 /，并且保留哈希部分
    : (path.relative(path.dirname(from + '.'), to) || '.') + (isDir(to) ? '/' + hash : hash)
}

// isDir 函数用于判断给定的路径 str 是否是一个目录。它通过检查路径的最后一个字符是否为 / 来实现。
function isDir (str) {
  return str.charAt(str.length - 1) === '/'
}

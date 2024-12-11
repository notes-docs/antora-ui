'use strict'

// 这个 or 函数的作用是模拟逻辑“或”操作：
//
// * 它检查传入的多个参数中是否有至少一个为真值。如果有，则返回 true，否则返回 false。
// * 还会根据传入参数的数量进行特殊处理，当参数为 3 个时，只考虑前两个参数，返回其中的一个真值。
module.exports = (...args) => {
  const numArgs = args.length
  if (numArgs === 3) return args[0] || args[1]
  if (numArgs < 3) throw new Error('{{or}} helper expects at least 2 arguments')
  args.pop()
  // 检查数组中是否至少有一个元素为真值（即 it 为真）。如果数组中有任何一个真值，some 会返回 true，否则返回 false
  return args.some((it) => it)
}

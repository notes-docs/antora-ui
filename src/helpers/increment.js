'use strict'

// 一个简单的 JavaScript 函数，它接收一个参数 value，并返回 value 的值加 1。
// 如果 value 为假值（null, undefined, false, 0, NaN, "" 等），则默认使用 0 进行加 1 操作。
module.exports = (value) => (value || 0) + 1

'use strict'

// 该模块导出一个函数，用于从 HTML 字符串中删除所有 HTML 标签

// TAG_ALL_RX 是一个正则表达式，用于匹配所有 HTML 标签。具体规则：
// < 和 > 是 HTML 标签的标记。
// [^>]+ 匹配不包含 > 的任意字符，确保匹配到的是标签的内容部分。
// g 标志表示全局匹配，即匹配输入中所有符合条件的标签。
const TAG_ALL_RX = /<[^>]+>/g

// 该函数的功能是接收一个 HTML 字符串，删除其中的所有 HTML 标签，返回纯文本内容
module.exports = (html) => html && html.replace(TAG_ALL_RX, '')

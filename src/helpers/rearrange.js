'use strict'

// 定义了一个排序函数，目的是根据给定的排序规则对一个集合进行排序。
// 它通过特定的属性来对集合中的对象进行排序，同时也支持删除指定属性的元素，以及将剩余的元素按特定顺序排列。
// 输入参数：
//
// * collection：待排序的对象集合（例如，包含多个对象的数组或对象）。
// * property：用于排序的属性名（这个属性值用作排序的依据）。
// * orderSpec：一个字符串，指定排序规则。

// 按指定的属性排序。
// 支持删除指定元素。
// 支持按 * 符号将剩余元素放到列表末尾。
// 支持根据字符串形式的排序规则进行排序，并可以删除或重新排序集合中的项。
module.exports = (collection, property, orderSpec) => {
  if (orderSpec == null || orderSpec === '*') return Object.values(collection)
  // 创建一个映射对象，将集合中的每个元素的 `property` 属性值作为键
  const sourceCollection = Object.values(collection).reduce((accum, it) => accum.set(it[property], it), new Map())
  // 将 `orderSpec` 字符串按逗号分割成数组并清理空格
  const order = orderSpec
    .split(',')
    .map((it) => it.trim())
    .filter((it) => {
      // 如果排序规则以 `!` 开头，则从映射中删除该元素
      if (it.charAt() !== '!') return true
      sourceCollection.delete(it.substr(1))
    })

  // 查找是否包含 `*`，该符号表示将剩余的元素放在最后
  const restIdx = order.indexOf('*')
  if (~restIdx) order.splice(restIdx, 1)

  // 根据排序规则提取出指定的元素并将其添加到目标集合
  const targetCollection = order.reduce((accum, key) => {
    if (sourceCollection.has(key)) {
      accum.push(sourceCollection.get(key))
      sourceCollection.delete(key)
    }
    return accum
  }, [])

  // 如果排序规则中包含 `*`，则将剩余的元素按原顺序添加到目标集合中
  if (~restIdx) targetCollection.splice(restIdx, 0, ...sourceCollection.values())
  return targetCollection
}

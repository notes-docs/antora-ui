'use strict'

const { watch } = require('gulp')
let metadata

try {
  metadata = require('undertaker/lib/helpers/metadata')
} catch {
  metadata = { get: () => ({ tree: {} }) }
}

module.exports = ({ name, desc, opts, call: fn, loop }) => {
  if (name) {
    const displayName = fn.displayName
    if (displayName === '<series>' || displayName === '<parallel>') {
      const taskMetadata = metadata.get(fn)
      if (taskMetadata && taskMetadata.tree) {
        taskMetadata.tree.label = `${displayName} ${name}`
      }
    }
    fn.displayName = name
  }
  if (loop) {
    const delegate = fn
    name = delegate.displayName
    delegate.displayName = `${name}:loop`
    fn = () => watch(loop, { ignoreInitial: false }, delegate)
    fn.displayName = name
  }
  if (desc) fn.description = desc
  if (opts) fn.flags = opts
  return fn
}

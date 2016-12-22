const merge = require('webpack-merge');

exports.group = group;

/**
 * Combines an array of blocks to a new joined block. Running this single block
 * has the same effect as running all source blocks.
 *
 * @param {Function[]} configSetters  Array of functions as returned by webpack blocks.
 * @return {Function}
 */
function group (configSetters) {
  const pre = getHooks(configSetters, 'pre')
  const post = getHooks(configSetters, 'post')

  const groupBlock = (context, config) => invokeConfigSetters(configSetters, context, config)

  return Object.assign(groupBlock, { pre, post })
}

function getHooks (configSetters, type) {
  // Get all the blocks' pre/post hooks
  const hooks = configSetters
    .filter(setter => Boolean(setter[type]))
    .map(setter => setter[type])

  // Flatten the array (since each item might be an array as well)
  const flattenedHooks = hooks
    .map((hook) => Array.isArray(hook) ? hook : [ hook ])
    .reduce((allHooks, someHooks) => allHooks.concat(someHooks), [])

  return filterDuplicates(flattenedHooks)
}

function invokeConfigSetters (configSetters, context, baseConfig = {}, initialConfig = {}) {
  const getCompleteConfig = Object.keys(baseConfig).length > 0
    ? (mergedConfig) => merge.smart(baseConfig, mergedConfig)
    : (mergedConfig) => mergedConfig

  return configSetters.reduce(
    (mergedConfig, setter) => {
      const configPartial = setter(context, getCompleteConfig(mergedConfig))
      return merge.smart(mergedConfig, configPartial)
    },
    initialConfig
  )
}

function invokePreHooks (configSetters, context) {
  const preHooks = getHooks(configSetters, 'pre')
  preHooks.forEach((hook) => hook(context))
}

function invokePostHooks (configSetters, context, config) {
  const postHooks = getHooks(configSetters, 'post')
  return invokeConfigSetters(postHooks, context, config, config)
}

function filterDuplicates (array) {
  return array.filter((item, index) => array.indexOf(item) === index)
}

const path = require('path')

const loadCachedConfig = () => {
  let pluginBabelConfig = {}
  if (process.env.NODE_ENV !== 'test') {
    pluginBabelConfig = require(path.join(
      process.cwd(),
      './.cache/babelState.json'
    ))
  }
  return pluginBabelConfig
}

const pluginBabelConfig = loadCachedConfig()
const stage = process.env.GATSBY_BUILD_STAGE || 'test'

let targets
if (stage === 'build-html' || stage === 'test') {
  targets = {
    node: 'current',
  }
} else {
  targets = {
    browsers: pluginBabelConfig.browserslist,
  }
}

const babelOptions = {
  presets: [
    [
      'env',
      {
        loose: true,
        modules: stage === 'test' ? 'commonjs' : false,
        useBuiltIns: true,
        targets,
      },
    ],
    'react',
  ],
  plugins: [
    [
      'babel-plugin-transform-class-properties',
      {
        loose: true,
      },
    ],
    'babel-plugin-macros',
    'babel-plugin-syntax-dynamic-import',
    [
      'babel-plugin-transform-runtime',
      {
        helpers: true,
        regenerator: true,
      },
    ],
  ],
}

module.exports = require('babel-jest').createTransformer(babelOptions)

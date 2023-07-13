const path = require('path')
const { webpackConfiguration } = require('@micro/configuration')
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')
const pkg = require('./package.json')

const pathResolve = (target = '') => path.resolve(__dirname, target)

module.exports = (_, { mode }) => {
  const isDev = mode !== 'production'

  const config = webpackConfiguration.runtime({
    outputPath: pathResolve('dist'),
    publicPath: pathResolve('public'),
    isDev,
    envs: {
      RUNTIME_ENV: JSON.stringify({
        BUILD_ENV: process.env.BUILD_ENV,
        API_GATEWAY: process.env.API_GATEWAY,
      }),
    },
  })

  config.plugins.unshift(
    new ModuleFederationPlugin({
      name: 'runtime',
      shared: Object.keys(pkg.dependencies).reduce((acc, moduleName) => {
        acc[moduleName] = {
          eager: true,
          singleton: true,
          requiredVersion: pkg.dependencies[moduleName],
        }
        return acc
      }, {}),
    }),
  )

  return config
}

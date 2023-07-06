const path = require('path')
const { webpackConfiguration } = require('@micro/configuration')
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')
const pkg = require('./package.json')

const pathResolve = (target = '') => path.resolve(__dirname, target)

module.exports = (_, { mode }) => {
  const isDev = mode !== 'production'

  const config = webpackConfiguration.remote({
    outputPath: pathResolve('dist'),
    isDev,
  })

  config.plugins.unshift(
    new ModuleFederationPlugin({
      name: 'home_app',
      library: { type: 'var', name: 'home_app' },
      filename: `v${pkg.version}/remoteEntry.js`,
      exposes: {
        './App': './src/index',
      },
      shared: Object.keys(pkg.dependencies).reduce((acc, moduleName) => {
        acc[moduleName] = {
          singleton: true,
        }
        return acc
      }, {}),
    }),
  )

  return config
}

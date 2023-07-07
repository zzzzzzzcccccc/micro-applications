import { DefaultOptions } from './types'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import { VueLoaderPlugin } from 'vue-loader'
import { buildModuleRuleByUrl, buildModuleRuleByBabel, buildModuleRuleByVue, buildModuleRuleByCss } from '../../utils'

const getDefaultConfiguration = (options: Partial<DefaultOptions>) => {
  const { outputPath, isDev = true, devServerPort = 3334 } = options
  const staticPath = isDev ? '/' : './'

  return {
    mode: isDev ? 'development' : 'production',
    target: isDev ? 'web' : 'browserslist',
    entry: './src/index',
    output: {
      path: outputPath,
      publicPath: 'auto',
    },
    devtool: isDev ? 'eval-source-map' : 'source-map',
    module: {
      rules: [
        buildModuleRuleByUrl({ publicPath: staticPath, limit: 0 }),
        buildModuleRuleByVue(),
        buildModuleRuleByBabel(),
      ].concat(buildModuleRuleByCss({ publicPath: staticPath }) as any[]),
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.vue'],
    },
    optimization: {
      runtimeChunk: false,
      minimize: true,
      minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash:6].css',
      }),
      new VueLoaderPlugin(),
    ],
    devServer: {
      allowedHosts: 'all',
      open: false,
      port: devServerPort,
      static: {
        directory: outputPath,
      },
      hot: true,
    },
  }
}

export default getDefaultConfiguration

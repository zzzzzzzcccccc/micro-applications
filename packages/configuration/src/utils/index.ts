import * as webpack from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

export function buildModuleRuleByBabel() {
  return {
    test: /\.(js|ts|tsx)$/i,
    exclude: /node_modules/,
    use: 'babel-loader',
  }
}

export function buildModuleRuleByUrl({ publicPath, limit }: { publicPath: string; limit: 0 }) {
  return {
    test: /\.(jpg|jpeg|png|gif|heic|webp|svg)$/i,
    exclude: /node_modules/,
    use: [
      {
        loader: 'url-loader',
        options: {
          limit,
          name: '[name].[contenthash:6].[ext]',
          publicPath,
        },
      },
    ],
  }
}

export function buildModuleRuleByCss({ publicPath }: { publicPath: string }) {
  const miniCssExtractPluginLoader = {
    loader: MiniCssExtractPlugin.loader,
    options: { publicPath },
  }

  return [
    {
      test: /\.css$/i,
      use: [miniCssExtractPluginLoader, 'css-loader'],
    },
    {
      test: /\.less$/i,
      use: [miniCssExtractPluginLoader, 'css-loader', 'less-loader'],
    },
    {
      test: /\.s[ac]ss$/i,
      use: [miniCssExtractPluginLoader, 'css-loader', 'sass-loader'],
    },
  ] as webpack.RuleSetRule[]
}

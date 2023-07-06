import { DefaultOptions } from './types';
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import TerserPlugin from "terser-webpack-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";

const getDefaultConfiguration = (options: Partial<DefaultOptions>) => {
  const { outputPath, isDev = true, devServerPort = 3334 } = options;
  const staticPath = isDev ? "/" : "./";
  const miniCssExtractPluginLoader = {
    loader: MiniCssExtractPlugin.loader,
    options: { publicPath: staticPath }
  };

  return {
    mode: isDev ? "development" : "production",
    target: isDev ? "web" : "browserslist",
    entry: './src/index',
    output: {
      path: outputPath,
      publicPath: 'auto'
    },
    devtool: isDev ? "eval-source-map" : "source-map",
    module: {
      rules: [
        {
          test: /\.(js|ts|tsx)$/i,
          exclude: /node_modules/,
          loader: "babel-loader"
        },
        {
          test: /\.css$/i,
          use: [
            miniCssExtractPluginLoader,
            "css-loader"
          ]
        },
        {
          test: /\.less$/i,
          use: [
            miniCssExtractPluginLoader,
            "css-loader",
            "less-loader"
          ]
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            miniCssExtractPluginLoader,
            "css-loader",
            "sass-loader"
          ]
        }
      ]
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"]
    },
    optimization: {
      runtimeChunk: false,
      minimize: true,
      minimizer: [
        new CssMinimizerPlugin(),
        new TerserPlugin()
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: "[name].[contenthash:6].css"
      }),
    ],
    devServer: {
      allowedHosts: "all",
      open: false,
      port: devServerPort,
      static: {
        directory: outputPath
      },
      hot: true
    }
  }
};

export default getDefaultConfiguration;

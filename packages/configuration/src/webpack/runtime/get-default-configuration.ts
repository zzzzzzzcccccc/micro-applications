import * as webpack from "webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import { DefaultOptions } from "./types";

const getDefaultConfiguration = (options: Partial<DefaultOptions>) => {
  const { isDev = true } = options;
  const staticPath = isDev ? "/" : "./";
  const miniCssExtractPluginLoader = {
    loader: MiniCssExtractPlugin.loader,
    options: { publicPath: staticPath }
  };
  const {
    outputPath,
    publicPath,
    envs = {},
    defineEnvs = {},
    devServerPort = 3333,
    devServerProxy,
    copyPublicPaths
  } = options;
  const extraPlugins: any[] = [];

  if (copyPublicPaths?.length) {
    extraPlugins.push(new CopyWebpackPlugin({
      patterns: copyPublicPaths.map((path) => ({ from: `${publicPath || ""}/${path}`, to: path }))
    }));
  }

  return {
    mode: isDev ? "development" : "production",
    target: isDev ? "web" : "browserslist",
    entry: {
      app: "./src/index"
    },
    output: {
      publicPath: staticPath,
      path: outputPath,
      filename: "[name].[contenthash:6].js"
    },
    module: {
      rules: [
        {
          test: /\.(jpg|jpeg|png|gif|heic|webp|svg)$/i,
          exclude: /node_modules/,
          use: [
            {
              loader: "url-loader",
              options: {
                limit: 8192,
                name: "[name].[contenthash].[ext]",
                publicPath: staticPath
              }
            }
          ]
        },
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
    devtool: isDev ? "eval-source-map" : "source-map",
    plugins: [
      new CleanWebpackPlugin(),
      new webpack.ProvidePlugin({
        process: "process/browser"
      }),
      new webpack.DefinePlugin(defineEnvs),
      new MiniCssExtractPlugin({
        filename: "[name].[contenthash:6].css"
      }),
      new HtmlWebpackPlugin({
        ...envs,
        template: `${publicPath}/index.html`,
        minify: isDev ? false : { removeComments: true, collapseWhitespace: true, minifyCSS: true, minifyJS: true }
      })
    ].concat(extraPlugins),
    optimization: {
      splitChunks: {
        chunks: "all"
      },
      minimize: true,
      minimizer: [
        new CssMinimizerPlugin(),
        new TerserPlugin()
      ]
    },
    devServer: {
      allowedHosts: "all",
      open: false,
      port: devServerPort,
      proxy: devServerProxy,
      static: {
        directory: publicPath,
        publicPath: "/"
      },
      client: {
        overlay: {
          errors: true,
          warnings: false,
          runtimeErrors: true
        }
      },
      hot: true
    }
  };
};

export default getDefaultConfiguration;

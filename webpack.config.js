const path = require("path");
const resolve = (filename) => path.resolve(__dirname, filename);
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: {
    login: resolve("src/index.js")
  },
  devtool: 'none',
  output: {
    path: resolve('dist'),
    filename: '[name].[chunkHash:8].js',
    // library: 'libraryName',
    // libraryTarget: 'umd',
  },
  module: {
    rules: [
      { test: /\.js$/, use: [
        {
          loader: 'banner-loader',
          options: {
            filename: resolve('./loaders/banner.js'),
          }
        },
        'babel-loader',
      ] }
    ]
  },
  resolveLoader: {
    alias: {
      'babel-loader': resolve('./loaders/babel-loader'),
      'banner-loader': resolve('./loaders/banner-loader'),
    },
    modules: [ resolve('./loaders', 'node_modules') ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve('public/index.html'),
      filename: 'index.html',
      inject: 'body',
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*'],
    })
  ]
};

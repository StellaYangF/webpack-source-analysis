const path = require("path");
const resolve = (filename) => path.resolve(__dirname, filename);
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: {
    login: resolve("src/index.js"),
    reg: resolve('src/reg.js'),
  },
  output: {
    path: resolve('dist'),
    filename: '[name].js',
  },
  devServer: {
    contentBase: resolve('dist'),
    host: 'localhost',
    compress: true,
    port: 8080,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve('public/index.html'),
      filename: 'index.html',
      // inject: false, // 'body'
      hash: true,
      chunks: ['login', 'reg'],
      chunksSortMode: 'manual',
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*'],
    })
  ]
};

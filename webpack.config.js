const path = require("path");
const resolve = (filename) => path.resolve(__dirname, filename);
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

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
  optimization: {
    minimizer: [ 
      new TerserWebpackPlugin({
        
      }), 
      new OptimizeCSSAssetsPlugin() ]
    ,
  },
  module: {
    rules: [
      { test: /\.(png|jpg|jpeg|gif|svg)$/, use: [ {
        loader: 'url-loader',
        options: {
          limit: 4096,
        }
      } ] }, {
        test: /\.css$/i,
        include: resolve('src'),
        exclude: /node_modules/,
        use: [
          // 'style-loader',
          { loader: MiniCssExtractPlugin.loader },
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name][hash:8].css',
      chunkFilename: '[id].css',
    }),
    new HtmlWebpackPlugin({
      template: resolve('public/index.html'),
      filename: 'index.html',
      hash: true,
      minify: true,
      chunks: ['login', 'reg'],
      chunksSortMode: 'manual',
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*'],
    }),
  ]
};

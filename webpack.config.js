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
        parallel: true,
        // cache: true,
      }), 
      new OptimizeCSSAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require('cssnano'),
      }) 
    ],
  },
  module: {
    rules: [
      { test: /\.(png|jpg|jpeg|gif|svg)$/, use: [ {
        loader: 'url-loader',
        options: {
          limit: 4096,
          outputPath: 'images',
          publicPath: '/images',
        }
      } ] }, {
        test: /\.css$/i,
        include: resolve('src'),
        exclude: /node_modules/,
        use: [
          // 'style-loader',
          { loader: MiniCssExtractPlugin.loader },
          'css-loader', 'postcss-loader'
        ]
      }, {
        test: /\.scss$/,
        include: resolve('src'),
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          }, 'css-loader', 'sass-loader'
        ]
      }, {
        test: /\.less$/,
        include: resolve('src'),
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          }, 'css-loader', 'less-loader', 'postcss-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      // filename: '[name][hash:8].css',
      // chunkFilename: '[id].css',
      chunkFilename: 'css/[id].css',
      filename: 'css/[name].[contentHash].css'
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

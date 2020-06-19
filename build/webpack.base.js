const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const resolve = (filename) => path.resolve(__dirname, filename);

module.exports = {
  entry: {
    main: resolve('../src/index.js'),
  },
  output: {
    path: resolve('../dist'),
    filename: '[name].js',
    publicPath: '/',
  },
  target: 'web',
  module: {
    rules: [
      {
        test: /\.js(x?)$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          {
            loader: 'eslint-loader',
            options: {
              enforce: 'pre',
              include: [resolve('../src')],
              fix: true,
            },
          },
        ],
      },
      // {
      //   test: require.resolve('lodash'),
      //   loader: 'expose-loader?_',
      // },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 4096,
            outputPath: 'images',
            publicPath: '/images',
          },
        }],
      }, {
        test: /\.(le|c)ss$/i,
        include: resolve('../src'),
        exclude: /node_modules/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          'css-loader', 'postcss-loader', 'less-loader',
        ],
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      chunkFilename: 'css/[id].css',
      filename: 'css/[name].css',
    }),
    new HtmlWebpackPlugin({
      template: resolve('../public/index.html'),
      filename: 'index.html',
      hash: true,
      // minify: true,
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*', '!**/dll'],
    }),
    // 无需引入，直接使用自动添加到当前模块的上下文
    // new webpack.ProvidePlugin({
    //   _: 'lodash',
    // }),
    new HtmlWebpackExternalsPlugin({
      externals: [{
        module: 'lodash',
        entry: 'https://cdn.jsdelivr.net/npm/lodash@4.17.15/lodash.min.js',
        global: '_',
      }],
    }),
    // banner
    new webpack.BannerPlugin({
      banner: '乡聚旅游',
    }),
    // copy
    new CopyWebpackPlugin({
      patterns: [
        {
          from: resolve('../src/assets'),
          to: resolve('../dist/assets'),
        },
      ],
    }),
  ],
  stats: 'normal', // 日志生成模式
  // externals: {
  //   lodash: '_',
  // },
  // watch: true,
  // watchOptions: {
  //   ignored: /node_modules/,
  //   aggregateTimeout: 300,
  //   poll: 1000,
  // },
};

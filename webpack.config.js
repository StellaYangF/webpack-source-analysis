const path = require('path');
const cssnano = require('cssnano');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const resolve = (filename) => path.resolve(__dirname, filename);

module.exports = {
  entry: {
    main: resolve('src/index.js'),
    // reg: resolve('src/reg.js'),
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
        cssProcessor: cssnano,
      }),
    ],
  },

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
              include: [resolve('src')],
              fix: true,
            },
          },
        ],
      },
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
        test: /\.css$/i,
        include: resolve('src'),
        exclude: /node_modules/,
        use: [
          // 'style-loader',
          { loader: MiniCssExtractPlugin.loader },
          'css-loader', 'postcss-loader',
        ],
      }, {
        test: /\.scss$/,
        include: resolve('src'),
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          }, 'css-loader', 'sass-loader',
        ],
      }, {
        test: /\.less$/,
        include: resolve('src'),
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          }, 'css-loader', 'postcss-loader', 'less-loader',
        ],
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      // filename: '[name][hash:8].css',
      // chunkFilename: '[id].css',
      chunkFilename: 'css/[id].css',
      filename: 'css/[name].[contentHash].css',
    }),
    new HtmlWebpackPlugin({
      template: resolve('public/index.html'),
      filename: 'index.html',
      hash: true,
      minify: true,
      // chunks: ['login', 'reg'],
      // chunksSortMode: 'manual',
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*'],
    }),
    // new HardSourceWebpackPlugin(),
  ],
  devtool: 'source-map', // 'eval'
};

const { smart } = require('webpack-merge');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssnano = require('cssnano');

const base = require('./webpack.base');

module.exports = smart(base, {
  mode: 'production',
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
  // module: {
  //   noParse: /lodash/, // 会与 expose-loader 冲突
  // },
  devtool: 'none', // 'eval'
});

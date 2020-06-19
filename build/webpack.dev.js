const { smart } = require('webpack-merge');
const path = require('path');
const base = require('./webpack.base');

const resolve = (filename) => path.resolve(__dirname, filename);

module.exports = smart(base, {
  mode: 'development',
  devServer: {
    contentBase: resolve('dist'),
    host: 'localhost',
    compress: true,
    port: 8080,
  },
  devtool: 'source-map', // 'eval'
});

const babel = require('@babel/core');

function loader(source, inputSourceMap) {
  this.cacheable();
  // 供 webpack 调用
  const options = {
    presets: ['@babel/preset-env'],
    inputSourceMap,
    sourceMap: true,
    filename: this.request.split('!')[1].split('/').pop()
  };
  // this.request 数据格式
  // E:\\0-前端\\00-框架\\webpack\\源码学习\\webpack-source-analysis\\loaders\\babel-loader.js!E:\\0-前端\\00-框架\\webpack\\源码学习\\webpack-source-analysis\\src\\index.js
  let { code, map, ast }  = babel.transform(source, options);
  return this.callback(null, code, map, ast);
}

module.exports = loader;
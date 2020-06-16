# 文档阅读

## 配置项

## 入口文件

### 单入口文件

`entry` 属性值设置入口点，值有三种类型:

- string | [string]
- { entryChunkName: string | [string] }

> Tip: 属性值数组时，及时入口文件没有依赖改文件，也会合并打包到一个 bundle 中

### 多入口文件

`entry` 属性值类型：

- { entryChunkName: string| [string] } 对象下可以有多个入口名，对应入口文件

## 编写自定义 loader

webpack loader 是用于编译源文件为目标文件，

### babel-loader

**loaders/babel-loader**
```js
const babel = require('@babel/core');

function loader(source, inputSourceMap) {
  // 启用缓存 
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
```

这里用到 webpack.config.`resolveLoader`，解析 loader， 可配置别名，查找路径

**webpack.config.js**
```js
{
    resolveLoader: {
        alias: {
            'babel-loader': resolve('./loaders/babel-loader'),
        }，
        modules: [ resolve('./loaders'), 'node_modules' ]
    },
    module: {
        rules: [
            { test: /\.js$/, use: 'babel-loader' }
        ]
    }
}
```

### banner-loader

为代码添加注释，表明代码版权，或者编写人，时间等信息

**banner-loader.js**
```js
const babel = require('@babel/core');

function loader(source, inputSourceMap) {
  this.cacheable && this.cacheable();
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
```

**bannder.js**
```js
/**
 * Copyright: Xiangju
 * Author: stella
 */
```

**webpack.config.js**
```js
{
 resolveLoader: {
    alias: {
      'babel-loader': resolve('./loaders/babel-loader'),
+     'banner-loader': resolve('./loaders/banner-loader'),
    },
  },
  module: {
    rules: [
      { test: /\.js$/, use: [
        {
          loader: 'banner-loader',
+         options: {
+           filename: resolve('./loaders/banner.js'),
+         }
        },
        'babel-loader',
      ] }
    ]
  },
}

```

## Bug Records

输入法全角和半角的切换

```bash
shift + 空格
```

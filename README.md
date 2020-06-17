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

## 调试打包后代码

代码打包会存在一定的合并、压缩等操作，为方便调试打包后代码，webpack 提供 `devtool` ，按需配置即可。[参考](https://webpack.js.org/configuration/devtool/)

### 解决

`sourcemap` 源码映射文件，以便 debug 时解决开发代码与实际运行代码不一致问题

### 总体分类

官网给出的类型很多（共26种），总的来说可分为：eval, source-map, cheap, module, inline。

**eval：** 使用eval包裹模块代码

**source-map：** 产生.map文件

**cheap：** 不包含列信息（关于列信息的解释下面会有详细介绍)也不包含loader的sourcemap

**module：** 包含loader的sourcemap（比如jsx to js ，babel的sourcemap）,否则无法定义源文件

**inline：** 将.map作为DataURI嵌入，不单独生成.map文件

### 编译时间比对

devtool 类别 | 时间 
- | - 
`none` | 
`eval` | 2818ms
`source-map` |  2837ms 配有 bundle.js.map，且 bundle.js 中添加 `//# sourceMappingURL=main.js.map`


## 编写自定义 loader

- webpack loader 是用于编译源文件为目标文件
- 执行顺序为从左到右（从下到上）
- 导出 `loader` 函数，也可添加 `patch` 方法（类似 koa 的洋葱模型）
  - 配置 loaders ['loader1', 'loader2']
  - 执行顺序 **loader1.patch** => **loader2.patch** => **loader2.loader** => **loader1.loader**
  

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

- 输入法全角和半角的切换

```bash
shift + 空格
```

-  插件缓存问题，导致无法编译

**报错信息**：Error: EPERM: operation not permitted

```bash
npm cache clean --force
```
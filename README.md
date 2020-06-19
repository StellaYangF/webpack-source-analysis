# 文档阅读

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
`eval` | 2818ms
`source-map` |  2837ms 配有 bundle.js.map，且 bundle.js 中添加 `//# sourceMappingURL=main.js.map`

## 打包第三方类库

打包第三方库，有三种方式：

- 直接引入
- ProvidePlugin
- expose-loader

### 直接引入

```js
import _ from 'lodash';
console.log(_.join(['a', 'b', 'c'], '@'));
```

### ProvidePlugin

只会给当前模块添加局部的变量，不用显示引入。

本栗以 **lodash** 库为例

**webpack.config.js**
```js
{
  plugins: [
    new webpack.ProvidePlugin({
      _: 'lodash',
    }),
  ]
}
```

**index.js** 使用

```js
console.log(_.join(['a', 'b', 'c'], '@'));
```

### expose-loader

这种方式对比上面的 **ProvidePlugin**，该方式，会将引入的库，挂载到全局对象 **window** 上。

先下载依赖加载器
```bash
npm i expose-loader -D
```

定义两种形式：模块内定义 & 配置文件中定义

**模块内定义**
```js
require('expose-loader?_!lodash');

// eslint-disable-next-line no-undef
console.log(_.join(['a', 'b', 'c'], '@'));
```

**配置文件中定义**
```js
rules: [
  {
    test: require.resolve('lodash'),
    loader: 'expose-loader?_',
  },
]
```

> 特别注意：不能同时配置 `module.noParse`, `expose-loader`, 否则会报错（如下）

```js
Uncaught ReferenceError: global is not defined
```
[参考 issue](https://github.com/webpack-contrib/expose-loader/issues/8)

## 不打包第三方类库

以上方式都会将第三方库打包到入口文件中，增加打包体积。

### externals

`externals` 能做到：
- 不让 webpack 打包
- 不限制程序以 CMD, AMD, window, global 全局方式引入使用
- 加速页面加载时间

分三个步骤是实现:

**webpack.config.js 配置**

```js
{
  externals: {
    lodash: '_'
  }
}
```

> 小提示：这里的 **key(lodash)** 是指要外链的包名，**value(_)** 指引入后的别名。

**index.js 使用**

```js
// ESModule 方式
import _ from 'lodash';
// commonjs 方式
const _ = require('lodash');
```

**index.html**
静态文件中，需要**手动**添加 lodash CDN 加速链接。
```html
<script src='https://cdn.jsdelivr.net/npm/lodash@4.17.15/lodash.min.js'></script>
```

**对比打包时间&体积**
打包前后 | 打包耗时 | 产出体积 main.js
- | - | -
打包三方库 | 3374 ms | 79 Kib |
不打包三方库 | 3214 ms | 8.42 Kib |

### html-webpack-externals-plugin

上面方式虽然减少了打包时间和体积，但是每次依赖的三方库，都需要手动去引入，我们程序员当然是能自动的绝不用手动。

所以就引入到 html-webpack-**externals**-plugin。

**安装插件**
```bash
npm i html-webpack-externals-plugin -D
```

**webpack.config.js**
```js
const htmlWebpackExternalsPlugin= require('html-webpack-externals-plugin');

{
  plugins: [
    new htmlWebpackExternalsPlugin({
      externals: [
        {
          module: 'lodash',
          entry: 'https://cdn.jsdelivr.net/npm/lodash@4.17.15/lodash.min.js',
          global: '_',
        }
      ]
    })
  ]
}
```

## watch 监听文件变化

### 配置项
```js
 watch: true,
  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 300,
    poll: 1000,
  },
```

#### 监听选项

- `ignored` 忽略文件目录，不进行监听
- `aggregateTimeout` 利用防抖机制，当检测文件不再发生变化，会先缓存起来，等待一段时间后之后再通知监听者，这个等待时间通过 aggregateTimeout 配置
- `poll` 轮询每秒问多少次

> 小提示：注意这里的监听参数，都是根据入口文件依赖进行监听，要尽减少监听文件数量和检查频率表，否则导致灵敏度下降。

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

### 输入法全角和半角的切换
**解决**：
```bash
shift + 空格
```

### 插件缓存问题，导致无法编译

**报错信息**：Error: EPERM: operation not permitted
**解决**：
```bash
npm cache clean --force
```

### 使用 expose-loader 暴露全局库 lodash，浏览器运行显示 global 未定义

**报错信息**：Uncaught ReferenceError: global is not defined

**解决**：去掉 module.noParse 匹配库
```js
{
  module: {
    // 去掉下面这行代码即可解决
    // noParse: /lodash/
  }
}
```

## 总结

### webpack 常用插件

1. [clean-webpack-plugin](https://www.npmjs.com/package/clean-webpack-plugin)
  清除打包目录下的文件
2. [html-webpack-plugin](https://webpack.js.org/plugins/html-webpack-plugin/) 
  使用自己的 html 模板文件
3. [html-webpack-externals-plugin](https://www.npmjs.com/package/html-webpack-externals-plugin)
  自动外链 CDN 第三库加速链接，取代手动设置 webpack 配置属性 `externals` 
4. [mini-css-extract-plugin](https://webpack.js.org/plugins/mini-css-extract-plugin/)
  抽离 css 代码到单独文件，替换 `style-loader`
5. [terser-webpack-plugin](https://webpack.js.org/plugins/terser-webpack-plugin/)
    - 生产环境下默认开启
    - parallel 可启用多进并行压缩，提高打包速度
    - cache 开启缓存
6. [optimize-css-assets-webpack-plugin](https://www.npmjs.com/package/optimize-css-assets-webpack-plugin)
  优化并压缩 css 文件代码
7. [webpack.DefinePlugin]
8. [webpack.ProvidePlugin]
9. [webpack.BannerPlugin](https://webpack.js.org/plugins/banner-plugin/) 为每个产出的代码块顶部添加商标
    - 输出文件如 `/*! xx 旅游 */`
10. [copy-webpack-plugin]()
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

### dev-server 代理到 node 服务

无法成功，在 node 中可添加一个 logger 中间件，记录请求的 url 解决问题

```js
const express = require('express');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpack = require('webpack');
const webpackOptions = require('./build/webpack.dev');

const app = express();

// logger 日志中间件
const logger = (req,res,next) => {
  console.log(req.url);
  next();
}

app.use(logger);

app.get('/users', (req, res) => {
  console.log(req.url);
  res.json({
    name: 'stella',
    age: 18,
  });
});

app.listen(3000);

```
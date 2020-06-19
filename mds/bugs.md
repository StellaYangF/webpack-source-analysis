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

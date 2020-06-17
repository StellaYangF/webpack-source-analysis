# babel 实践

## 插件使用

### @babel/plugin-transform-runtime

[参考文档](https://babeljs.io/docs/en/babel-plugin-transform-runtime#docsNav)

**为什么要用该插件：**
- 避免重复引入帮助函数，更高级语法（如：Promise, Set, Map等）需结合 core-js 使用
- 提供沙箱环境，避免污染全局作用域。

**选项配置**

```js
{
  "corejs": 3, // 高级语法转换 Set, Map ...
  "useESModules": true, // 不条件 exports.__esModule:true
}
```
> 小提示：transform-runtime 要搭配生产依赖的 runtime 使用。corejs 也可在预设中配置。

## 预设使用

### @babel/preset-env

[参考文档](https://babeljs.io/docs/en/babel-preset-env#docsNav)


需要开发时使用最新的 JavaScript 语法，

**选项配置**

- `useBuitIns`

```js
{
  "presets": [
    ["@babel/preset-env", {
      "useBuiltIns": "usage"
    }]  
  ],
}
```
> 小提示：`useBuiltIns` 为 `usage` 可理解为按需引入，不会整个都引入打包

- `targets`: 兼容浏览器版本配置
  - `targets.esmodules` 配置该选项后，浏览器目标版本就是失效

```js
{
  "targets": "> .2%, not dead, id > 10"
}

// 或者
{
  "targets": {
    "chrome": "58",
    "ie": "11"
  }
}
```

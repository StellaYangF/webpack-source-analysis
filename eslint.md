# 代码校验工具 eslint 实践

## 校验可选文件

输出文件不需要代码校验，配置启用忽略某个文件

**.eslintrc.js** *简化*
```js
{
   ignorePatterns: ['dist/**/*'],
   rules: {
     // ...
   }
}
```

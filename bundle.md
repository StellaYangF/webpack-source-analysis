# 打包解析

## 打包后的挂载属性

打包后的代码，会给 __webpack_require__ 添加属性：

- m: modules
- c: installedModules
- d: (exports, name, getter) => void
- o: (exports, name) => Boolean 判断是否有该属性
- r: (exports) => void
  - 首先给 exports 上添加 Symbol.toStringTag 属性 "module"
  - 添加 __esModule: true 属性
- t(value, mode)
  - mode: 按位与 8/ 4/ 2/ 1
  - value: 可能是 moduleId 或者 导出的 对象

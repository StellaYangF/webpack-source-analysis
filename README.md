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
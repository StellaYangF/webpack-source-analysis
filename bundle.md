# 打包解析

## 打包文件预览

构建 src 目录，入口文件 index.js，打包完成后，输出文件为 dist/main.js，格式如下：

```js
(function (modules) {
  var installedModules = {};

  function __webpack_require__(moduleId) { // 文件名
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    var module = (installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {},
    });

    modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    );

    // Flag the module as loaded
    module.l = true;

    // Return the exports of the module
    return module.exports;
  }

  // expose the modules object (__webpack_modules__)
  __webpack_require__.m = modules;

  // expose the module cache
  __webpack_require__.c = installedModules;

  // define getter function for harmony exports
  __webpack_require__.d = function (exports, name, getter) {
    if (!__webpack_require__.o(exports, name)) {
      Object.defineProperty(exports, name, { enumerable: true, get: getter });
    }
  };

  // define __esModule on exports
  __webpack_require__.r = function (exports) {
    if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    }
    Object.defineProperty(exports, "__esModule", { value: true });
  };

  // create a fake namespace object
  // mode & 1: value is a module id, require it
  // mode & 2: merge all properties of value into the ns
  // mode & 4: return value when already ns object
  // mode & 8|1: behave like require
  __webpack_require__.t = function (value, mode) {
    if (mode & 1) value = __webpack_require__(value);
    if (mode & 8) return value;
    if (mode & 4 && typeof value === "object" && value && value.__esModule)
      return value;
    var ns = Object.create(null);
    __webpack_require__.r(ns);
    Object.defineProperty(ns, "default", { enumerable: true, value: value });
    if (mode & 2 && typeof value != "string")
      for (var key in value)
        __webpack_require__.d(
          ns,
          key,
          function (key) {
            return value[key];
          }.bind(null, key)
        );
    return ns;
  };

  // getDefaultExport function for compatibility with non-harmony modules
  __webpack_require__.n = function (module) {
    var getter =
      module && module.__esModule
        ? function getDefault() {
            return module["default"];
          }
        : function getModuleExports() {
            return module;
          };
    __webpack_require__.d(getter, "a", getter);
    return getter;
  };

  // Object.prototype.hasOwnProperty.call
  __webpack_require__.o = function (object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  };

  // __webpack_public_path__
  __webpack_require__.p = "";

  // Load entry module and return exports
  return __webpack_require__((__webpack_require__.s = "./src/index.js"));
})({
  "./src/index.js": function (module, exports) {
    eval(
      "const add = (a, b) => a + b;\r\nconst sum = add(1, 2);\r\nconsole.log(sum);\n\n//# sourceURL=webpack:///./src/index.js?"
    );
  },
});

```

> Tip: 这个是一个自执行函数，参数 modules: { moduleId: function(module, exports) }

> Tip: 立即执行函数，内部会调用 __webpack_require__ 进入入口文件，如果有依赖其他模块，就继续 执行 __webpack_require__ 函数，类型递归操作。

> Tip: 自执行函数内部行程闭包，`installedModules` 一旦内部被依赖的模块被加载，就会存在闭包对象中。

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
- s: string 调用 __webpack_require__ 传入并赋值 moduleId

## harmony 和谐模式 | 同步加载

和谐模式主要处理，文件加载的方式，主要两个类：
- common.js
  - require
  - module.exports | exports
- ES6 modules
  - export | export default
  - import

### common.js 加载 common.js

**index.js**

```js
const title = require('./title');

console.log(title);
```

#### module.exports 导出

**title.js**

```js
module.exports.name = 'title_name';
module.exports.age = 'title_age';
```

**bundle.js**

```js
{
  "./src/title.js": function (module, exports) {
    module.exports.name = "title_name";
    module.exports.age = "title_age";
  },
}
```

#### exports 导出

**title.js**
```js
exports.name = 'title_name';
exports.age = 'title_age';
```

**bundle.js**

```js
{
  "./src/title.js": function (module, exports) {
    exports.name = "title_name";
    exports.age = "title_age";
  },
}
```

### common.js 加载 ES6 modules

**index.js**

```js
const title = require('./title');

console.log(title);
```

#### harmony default export

`export default` 导出多个值


**title.js**

```js
export default {
  name: 'title_name',
  age: 'title_age',
}
```

**bundle.js**

```js
{
  "./src/title.js": function (module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_require__.r(__webpack_exports__);

    /* harmony default export */ __webpack_exports__["default"] = {
      name: "title_name",
      age: "title_age",
    };
  },
}
```
> Tip: 这种方式，是给 module.exports.default 添加导出对象

#### harmony export (binding)

**title.js**

```js
export const name = 'title_name';
export const age = 'title_age';
```

**bundle.js**

```js
{
  "./src/title.js":
    function (module, __webpack_exports__, __webpack_require__) {
      "use strict";
      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */
      __webpack_require__.d(
        __webpack_exports__,
        "name",
        function () {
          return name;
        }
      );
      /* harmony export (binding) */
      __webpack_require__.d(
        __webpack_exports__,
        "age",
        function () {
          return age;
        }
      );

      const name = "title_name";
      const age = "title_age";
  },
}
```

### ES6 module 加载 common.js

**index.js**
```js
import title from './title';

console.log(title);
```

**title.js**
```js
exports.name = 'title_name';
exports.age = 'title_age';
```

**bundle.js**
```js
__webpack_require__.n = function (module) {
  var getter =
    module && module.__esModule
      ? function getDefault() {
          return module["default"];
        }
      : function getModuleExports() {
          return module;
        };
  __webpack_require__.d(getter, "a", getter);
  return getter;
};

{
  "./src/index.js": function ( module, __webpack_exports__, __webpack_require__ ) {
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony import */
    var _title__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( "./src/title.js" );
    /* harmony import */
    var _title__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n( _title__WEBPACK_IMPORTED_MODULE_0__ );

    console.log(_title__WEBPACK_IMPORTED_MODULE_0___default.a);
  },
}
```

### ES6 module 加载 ES6 module

**index.js**
```js
import title from './title';

console.log(title);
```

**title.js**
```js
export default {
  name: 'title_name',
  age: 'title_age',
}
```

**bundle.js**
```js
{
  "./src/index.js": function ( module, __webpack_exports__, __webpack_require__ ) {
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    var _title__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( "./src/title.js" );

    console.log(_title__WEBPACK_IMPORTED_MODULE_0__["default"]);
  },
  "./src/title.js": function ( module, __webpack_exports__, __webpack_require__ ) {
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    __webpack_exports__["default"] = { name: "title_name", age: "title_age", };
  },
}
```

## harmony 和谐模式 | 异步加载

**title.js**
```js
```

**index.js**
```js
```

**title.hash.js** bundle
```js
(window["webpackJsonp"] = window["webpackJsonp"] || []).push([
  ["title"],
  { "./src/title.js": (function(module, __webpack_exports__, __webpack_require__) {
      "use strict";
      __webpack_require__.r(__webpack_exports__);
      console.log('%c title prefetch', 'color: #fa9');

      __webpack_exports__["default"] = ({
        name: 'title_name',
        age: 'title_age',
      });
    })
  }
]);
```

> Tip: 添加全局变量 `webpackJsonp` 数组，push 元素

- [ chunkFilename ], { moduleId: callback(module, exports, __webpack_require__) }
  - chunkFilename: 默认为数组下标，可运用 webpackMagicComment 魔法注释，添加代码块名字

**魔法字符串的类型**
- `webpackChunkName: "chunkName"` 异步加载代码块的名称
- `webpackIgnore: true` 忽略该异步代码的打包，不会输出，原封不动的出现在入口文件中，没有解析
- `webpackPrefetch: true` 启用预抓取功能，浏览器空闲时发起请求，不执行
- `webpackPreload: true` 启用预加载，当前页面解析需要
- `webpack`


# 区分eval Function
## eval
eval函数
- 将传入的字符串当做 JavaScript代码执行
- 参数是非字符串时，直接返回
- 存在安全问题，易被攻击
- 速度慢，需js解释器，再js引擎进行优化
- 性能较大，浏览器执行时，由于不确定代码内的Date是否为自定义或window.Date属性，查找过程耗时，导致性能低
Thus, in the eval() version of the code, the browser is forced to make the expensive lookup call to check to see if there are any local variables called Date(). This is incredibly inefficient compared to Function().

## Function
- 该构造函数用于创建一个新的Function对象，直接调用可创建动态函数
- 只在全局作用域中运行
> new Function (arg1, arg2, ..., functionBody)


# webpack编译后文件解析
## `installedModules`
The module cache 

## `__webpack_require__`
The require function

### 
```js
(function(modules) {
  // webpackBootstrap
  // The module cache
  var installedModules = {};

  // The require function
  function __webpack_require__(moduleId) {
    // Check if module is in cache
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    // Create a new module (and put it into the cache)
    var module = (installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {}
    });

    // Execute the module function
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
  __webpack_require__.d = function(exports, name, getter) {
    if (!__webpack_require__.o(exports, name)) {
      Object.defineProperty(exports, name, { enumerable: true, get: getter });
    }
  };

  // define __esModule on exports
  __webpack_require__.r = function(exports) {
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
  __webpack_require__.t = function(value, mode) {
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
          function(key) {
            return value[key];
          }.bind(null, key)
        );
    return ns;
  };

  // getDefaultExport function for compatibility with non-harmony modules
  __webpack_require__.n = function(module) {
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
  __webpack_require__.o = function(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  };

  // __webpack_public_path__
  __webpack_require__.p = "";

  // Load entry module and return exports
  return __webpack_require__((__webpack_require__.s = "./src/index.js"));
})({
  "./src/index.js":
    /*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
    /*! no static exports found */
    function(module, exports) {
      eval(
        "const add = (a, b) => a + b;\r\nconst sum = add(1, 2);\r\nconsole.log(sum);\n\n//# sourceURL=webpack:///./src/index.js?"
      );
    }
});
```
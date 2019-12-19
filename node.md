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
# installedModules
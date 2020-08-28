# 每周总结可以写在这里

# 运行

```
npm run dev
```

# 组件化

组件化是工程领域发展了很长时间。
UI 系统都会有组件化方案

# SFC single file Components

.vue

`<template>`

`<sript>`

`<style scope>`

# 实现一个类似 vue 的 SFC

1. 实现 loader

1.1. 创建 myloader.js 文件,输出一个函数，这个函数接受两个值 source 和 map,source 是文件的内容

```myloader.js
module.exports = function(source, map) {
    console.log('--- loader ----', this.resourcePath); // 打印组件名
    return ''
}
```

1.2. 在 webpack.config.js 中使用我们自己编写的 loader

```webpack.config.js
...
  modules: {
      rules: [
          {
              test: /\.view$/,
              use: {
                  loader: require.resolve('./myloader.js')
              }
          }
      ]
  }
...
```

1.3. 解析DONMTree

1.4. 在构造函数中添加style标签

1.5. 待处理script逻辑

[writing-a-loader](https://webpack.js.org/contribute/writing-a-loader/)

# CSS Animation

Timeline时间线是动画的概念。

所有的Animation都是在Timeline中的tick触发，tick中计算出animation的progression值来显示当前时间的比例的值。





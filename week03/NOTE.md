# 每周总结可以写在这里

#### 作业： 
整理出JS标准中所有特殊的对象(我们没办法模拟出来的)及特殊对象的属性，做一个总结
- 对应文档中的 p133 9.4 Built-in Exotic Object Internal Methods and Slots 异于寻常的对象


## 0423总结
## 解答上节课的问题
- 为什么 0.1 0.2 无法准确表示出来，浮点数精度损失 - 理解float浮点数在内存中的表示方法
 - 解答：内部是2进制。
 - 参考： demo地址：http://jsfiddle.net/pLh8qeor/19/
 - 引申： 判定一个数能否被整除(10/3)，只需要一直乘以10，如果变成变成了整数，那么这个数就是能被整除的(十进制的判定方式)，同理2进制的判定方式就是一直乘以2
- 如何区分0 与-0
  - 解答： `function sing(zero) { if (1/zero === Infinity) return 1 if (-1/zero === -Infinity) return -1 }`

## 本节内容 - js中的Expression
### Grammar
- 运算符的优先级，参考标准P201 - 12.3 Left-Hand-Side Expressions
- updateExpression 参考标准P178 - 
- 基础类型装箱：String Number Boolean 既是基础类型 又是类，可是使用new ;  Symbol除了不能使用new,其他属性constructor prototype都跟其他构造器相同
  - `String()` 与 `new String()` 行为不同，或者通过Object('1') / Object(Symbol('1'))来进行装箱操作
- 基础类型拆箱：valueOf() 与 toString()

### tips
- `void 0` void后面跟任何的东西，都会返回一个`undefined`,所以这种方式产生undefined是最稳妥的，因为在js中undefined被设计成一个全局变量可能会被覆盖
- `void`的妙用，改变语法结构，IIFE中，详见下方的示例代码
- `!!1` 类似于 `Boolean(1)`


```js
// tips 中的示例代码
for(var i = 0; i < 10; i++) {
  var button = document.createElement('button')
  document.body.appendChild(button)
  button.innerHTML = i
  // 每次都打印10的版本
  button.onClick = function() {
    console.log(i)
  }
  // 每次打印对应的i的版本1 - 立即执行函数IIFE
  (function(i) {
    button.onClick = function() {
      console.log(i)
    }
  })(i)
  // 每次打印对应的i的版本2 - 使用void 因为这里立即执行函数不关心返回值，所以这里可以用void
  void function(i) {
    button.onClick = function() {
      console.log(i)
    }
  }(i)
}
```

### Runtime

### 课外拓展
- 位运算实现，二进制转十进制，十进制转二进制


## 0425总结
### statement - 语句
### types - 数据类型
#### Object的来源 - 对象，保罗万象的一种东西
- 对象的三要素： 唯一性，状态，行为（状态的改变）
- JS中的对象三要素： 封装，继承，多态
- *面向对象过程中对对象的抽象训练*：看一个class抽象的好不好，看他的方法是不是在改变自身的状态，因为只有改变状态才是这个对象的行为
- JS中面向对象的模型
- Array[[length]]
- Object.prototype[[setPrototypeOf]]

#### UTF8的讲解 ？？？对应视频中03：04：36的位置
- `'美'.codePointAt(0).toString(2)` ：先获得指定位置字符的Unicode码点值，再转成二进制
- `codePointAt` 与 `charCodeAt`的区别



### tips
- `for(let i=0;i<10;i++){ let i = 1; console.log(i)}` 这就相当于`{let i=0 {let i=1; console.log(i)} console.log(i)}` 是相当于两个作用域
- 作用域与上下文的区别
  - 作用域是：源代码中文本分割的区域，文本域，这个变量作用的范围
  - 执行上下文是：用户的浏览器内存中（JS引擎）变量的环境
- Generator与async的关系，作用？
  - 早期使用Generator来模拟await的实现，但是两者没有半毛钱关系，Generator用来写一些需要多步返回多个值的函数
- var的诡异之处
  1. 如果有var不建议写在任何语句的子结构里面，例如with中，建议var 最好写在函数内最前面或变量第一次出现的地方，一定要写在function的范围内的最前面
  2. `if(false){var x = 1}` 或者 `return var x=3` 这些var都会影响前面的x变量
- 封装，内聚，复用，解耦


### 推荐书目
- 《面向对象分析与设计》




### js代码示例
  ```js
  // Generator的使用
  function* foo() {
    yield 1;
    yield 2;
    var i = 0;
    while(true)
      yield i++;
  }
  var gen = foo()
  gen.next() --> {value: 1, done: false}
  gen.next() --> {value: 2, done: false}
  gen.next() --> {value: 3, done: false}

  // var怪异之处演示示例
  // case1
  var x=0
  function foo(){
    var o = {x:1}
    x=2;
    with(o) {
      x=3
    }
    console.log(x) // --> 2
  }
  foo()
  console.log(x) // --> 2

  // case2 - var放在function中的任意位置作用都是相同的
  var x=0
  function foo(){
    var o = {x:1}
    /****
    var x=2;
    with(o) {
      x=3
    }
    *****/
    // 等同于
    x=2;
    with(o) {
      var x=3
    }
    console.log(x) // --> 2
  }
  foo()
  console.log(x) // --> 0
  ```

# 每周总结可以写在这里
# 0430总结
## title
JS引擎中的事件循环体系
## fragments:
- 对应ECMAScript标准中的p104的8.6-RunJobs（）
- 严格上讲，事件循环不是JS语言的东西，是浏览器或者node里面的
- 语言的调用方（浏览器，node），使用JS的一种方式
- 每一个function、代码片段（一段JS代码就是一个微任务）都是一个微任务，多个微任务会聚合成一个宏任务，Promise是JS内部自带的，是JS标准的一部分，所以是微任务，setTimeout这些是JS引擎的东西，所以是宏任务
- 一个宏任务中只存在一个微任务队列，微任务执行的先后是根据微任务的入队先后，先进先出原则
- 每个宏任务内部的微任务列表执行完，才会继续执行下一个宏任务
- 逗号运算符，优先级最低，总是会返回最后一个值,并且前面如果有函数，会调用（> var x = (1,2,3);> console.log(x); 3）
- 微任务控制权在js引擎, 宏任务控制权在宿主, 这样js就方便跨语言传递信息啦.
课程内容：
 通过Object-C理解JS引擎的工作原理
 
## 小问题:
- 如何理解Chrome开发者工具中，每执行一段代码有时候就会输出一个undefined，什么意思
    - 解答： 其实是一个宏任务执行结束的标志，`setTimeout(function(){console.log('cool')}), (1+1)` 与 `new Promise(resolve => resolve()).then(()=>console.log('cool')), (1+1)` 查看打印顺序
- `new Promise(res => res()).then(()=> console.log(1), console.log(0));console.log(2)` 这段代码的执行顺序
 - 因为then中的第二个参数是立即执行的
- 前面说每段JS代码都可以看成一个微任务，后面又说只有Promise才能产生微任务，感觉有点奇怪？
    - 解答： 每段js代码可以看成一个微任务，同步执行的代码可以看作同一个微任务；promise会产生一个异步任务，这个异步任务会加入任务队列等待前一微任务完成后执行；所以每个异步任务会单独产生一个微任务加入任务队列；也就是说有一个任务队列集合，集合又一个一个微任务组成，队列中所有的同步代码会组成一个微任务，然后promise会生成一个微任务，依次加入任务队列


 ## js代码中看宏任务与微任务
 - 拿到代码之后，分析思路是，先分析宏任务内部的同步代码
 
 ```js
 // case1
 new Promise(resolve=>resolve()).then(e => console.log('1'))
 setTimeout(function(){
     console.log('2')
 },0)
 console.log('3'), function(){return this.a}
 // 结果
 > 3
 > 1
 > function(){return this.a}  - 这句以上为第一个宏任务，以下为第二个宏任务
 > 2

 // case2
 async function foo() {
     console.log('-1') // async 中await之前的都是同步代码
 }
 new Promise(resolve=>{
     console.log('0')
     resolve()
 }).then(e => console.log('1'))
 setTimeout(function(){
     console.log('2')
     new Promise(resolve=>resolve()).then(e => console.log('3'))
 },0)
 console.log('4')
 foo()
 // 结果
 > 0
 > 4
 > -1 - 此句及以上为同步任务 ？ 
 > 1 
  // > Promise {<resolved>: undefined}  - 这句以上为第一个宏任务，以下为第二个宏任务
 > 2
 > 3

 // case3
 async function foo() {
     console.log('-2') // async 中await之前的都是同步代码
     await new Promise(resolve => resolve())
     console.log('-1')
 }
 new Promise(resolve=>{
     console.log('0')
     resolve()
 }).then(e => console.log('1'))
 setTimeout(function(){
     console.log('2')
     new Promise(resolve=>resolve()).then(e => console.log('3'))
 },0)
 console.log('4')
 foo()
 // 结果
 ---- 以下为宏任务
 > 0
 > 4
 > -2
 > 1
 > -1
 // > Promise {<resolved>: undefined}  - 这句以上为第一个宏任务，以下为第二个宏任务
 ---- 以下为宏任务
 > 2
 > 3

 // case4
 async function foo() {
     console.log('-2') // async 中await之前的都是同步代码
     await new Promise(resolve => resolve())
     console.log('-1')
 }
 new Promise(resolve=>{
     console.log('0'),
     resolve()
 }).then(() => {
     console.log('1'), 
     new Promise(resolve=>resolve()).then(e => console.log('-1.5'))
     })
 setTimeout(function(){
     console.log('2')
     new Promise(resolve=>resolve()).then(e => console.log('3'))
 },0)
 console.log('4')
 foo()
 // 结果
 ---- 以下为宏任务
 -- 同步代码
 > 0 - 入队 1 
 > 4
 > -2 - 入队 -1
 -- 异步代码
 > 1 - 入队 -1.5
 > -1
 > -1.5
 // > Promise {<resolved>: undefined}  - 这句以上为第一个宏任务，以下为第二个宏任务
 ---- 以下为宏任务
 -- 同步代码
 > 2 - 入队 3
 -- 异步代码
 > 3

 // case5
 async function async1() {
     console.log('async 1 start')
     await async2()
     console.log('async 1 end') // 这个相当于放在前面promise中的then中执行
 }
 async function async2() {
     console.log('async2')
 }
 async1()
 new Promise(function(resolve){
     console.log('promise1')
     resolve()
 }).then(function(){
     console.log('promise2')
 })
// 结果
-- 同步代码
> async 1 start
> async2
> promise1
-- 异步代码
> async 1 end
> promise2
 ```

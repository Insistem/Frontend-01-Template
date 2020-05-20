# 每周总结可以写在这里

## 0507 - 重学JS|结构化（二）

结构化程序设计
全局的变量
The Global Object  Chapter - 18.0
### 作业
G6可视化，全局变量，realm中的对象

### 函数调用 
execution context
> An execution context is purely a specification mechanism and need not correspond to any particular artefact of an ECMAScript implementation. It is impossible for ECMAScript code to directly access or observe an execution context

execution context stack 调用栈
> The execution context stack is used to track execution contexts. The running execution context is always the top element of this stack. A new execution context is created whenever control is transferred from the executable code associated with the currently running execution context to executable code that is not associated with that execution context. The newly created execution context is pushed onto the stack and becomes the running execution context.


- JS Context =>Realm 上下文 包含了一个 Global Object

- 宏任务
- 微任务
- 函数调用（Execution Context）
- 语句、声明
- 表达式
- 直接量/变量/this...

 一、JS中的Realm

- JS Context => Realm
- 宏任务
- 微任务
- 函数调用
- 语句/声明
- 表达式
- 直接量/变量/this

多个宏任务共享一个全局对象。

在JS中，函数表达式和对象直接量均会创建对象。使用”.“做隐式转换也会创建对象。这些对象也是有原型。

## 0509
### 优秀作业讲解
#### 第三周作业：stringToNumber
知识点 - 正则的运用
`'s123r'.match(/s(123)r/)` 这样匹配的第二项就是括号括起来的内容，如果不想匹配到可以这么写
`'s123r'.match(/s(?:123)r/)`

### 二、浏览器工作原理

ISO-OSI 七层网络模型
应用
表示
会话     --    应用层   --  HTTP、HTTPS         -- require('http')
传输     --    传输层   --  TCP、UDP            -- require('net')
网络     --    网络层   --  IPv4 IPv6
数据链路 --    数据链路  -- mac地址
物理层   --    物理层   --  光纤

TCP/IP的一些基础知识
TCP：
- 流
- 端口
- require('net')
IP:
- 包
- IP地址
- libnet/libpcap 这一层只能用C++访问到

### 用node中的net模块(发送TCP请求)来模拟HTTP
首先了解下HTTP标准 - http RFC2616  http1.1
http是通过文本发送的，不是二进制

如题：输入URl浏览器会做什么？

1. 输入URL
2. 缓存解析

它先去缓存当中看看有没有，从 浏览器缓存-系统缓存-路由器缓存 当中查看，如果有从缓存当中显示页面，然后没有那就进行步骤三；
缓存就是把你之前访问的web资源，比如一些js，css，图片什么的保存在你本机的内存或者磁盘当中。

3. 域名解析

DNS解析:域名到IP地址的转换过程。域名的解析工作由DNS服务器完成。解析后可以获取域名相应的IP地址。

4. TCP连接，三次握手

    1. 客户端向服务器发送连接请求报文；
    2. 服务器端接受客户端发送的连接请求后后回复ACK报文，并为这次连接分配资源。
    3. 客户端接收到ACK报文后也向服务器端发生ACK报文，并分配资源。

5. 页面渲染

客户端渲染，生成Dom树、解析css样式、js交互。

# 三、什么是状态机

## 1. 有限状态机

有限状态机（Finite State Machine）是表示有限个状态（State）以及在这些状态（State）之间的转移（Transition）和动作（Action）等行为的数据模型。

总的来说，有限状态机系统，是指在不同阶段呈现出不同的运行状态的系统，这些状态是有限的、不重叠的。

这样的系统在某一时刻一定会处于其所有状态中的一个状态，此时它接收一部分允许的输入，产生一部分可能的响应，并迁移到一部分可能的状态。

## 2. 有限状态机的要素

- State(状态)

状态（State），就是一个系统在其生命周期中某一个时刻的运行情况，此时，系统会执行一些操作，或者等待一些外部输入。并且，在当前形态下，可能会有不同的行为和属性。

- Guard(条件)

状态机对外部消息进行响应时，除了需要判断当前的状态，还需要判断跟这个状态相关的一些条件是否成立。这种判断称为 Guard（条件）。Guard 通过允许或者禁止某些操作来影响状态机的行为。

- Event(事件)

事件（Event），就是在一定的时间和空间上发生的对系统有意义的事情，事件通常会引起状态的变迁，促使状态机从一种状态切换到另一种状态。

- Action(动作)

当一个事件（Event）被状态机系统分发的时候，状态机用 动作（Action）来进行响应，比如修改一下变量的值、进行输入输出、产生另外一个 Event 或者迁移到另外一个状态等。

- Transition(迁移)

从一个状态切换到另一个状态被称为 Transition（迁移）。引起状态迁移的事件被称为触发事件（triggering event），或者被简称为触发（trigger）。

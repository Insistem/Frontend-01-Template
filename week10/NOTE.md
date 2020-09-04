# 每周总结可以写在这里

## 编程与算法训练 - TicTacToe

## 实现步骤
- userMove函数
- show函数
- check函数
- willWin函数
- bestChoice函数
- computerMove函数
- 图谱功能,根据现在棋盘的数组和color作为hash， 然后存储最优走法

## 对于性能差的理解
- 过多的绑定事件并不会影响性能，而是过多的触发事件才会影响性能

## 小知识点
- 3减的方式处理一次点击是X，一次的点击是O
- break终止外层循环的方法， break outer;

## TODO
- check 函数优化，将重复的东西，通过向量的方式进行优化
- 深拷贝一个一维数组可以使用 Object.create([1,2,3]), 并不一定使用 JSON。parse(JSON.stringify([1,2,3])) ??? 为啥呢 这样更能节约内存，提高性能

## 升级延伸
- 按照这个思路，可以整一个在线对战五子棋
- 棋类搜索计算的高级技巧 - AI算法
    - 增加缓存
    - transform
    - 减少重复计算
    - 孤值
    - 深度神经网
    - 卷积深度神经网
    - 搞训练

## 参考名词
蒙特卡罗方法（英语：Monte Carlo method），也称统计模拟方法，是 1940 年代中期由于科学技术的发展和电子计算机的发明，而提出的一种以概率统计理论为指导的数值计算方法。是指使用随机数（或更常见的伪随机数）来解决很多计算问题的方法。
20 世纪 40 年代，在科学家冯·诺伊曼、斯塔尼斯拉夫·乌拉姆和尼古拉斯·梅特罗波利斯于洛斯阿拉莫斯国家实验室为核武器计划工作时，发明了蒙特卡罗方法。因为乌拉姆的叔叔经常在摩纳哥的蒙特卡洛赌场输钱得名，而蒙特卡罗方法正是以概率为基础的方法。（ https://zh.wikipedia.org/wiki/ 蒙地卡羅方法 ）




1. Range API
* 一个问题：如何把一个元素所有的子元素逆序？
* 常规解法：
* ```javascript
    function reverseChildren(element) {
        let l = element.childNodes.length;

        while(l-- > 0) {
            element.appendChild(element.childNodes[l]);
        }

    }
  ```
* Range API
    * 必要API
        * var range = new Range()
        * range.setStart(element, 9)
        * range.setEnd(element, 4)
        * var range = document.getSelection().getRangeAt(0)
    * 辅助API
        * range.setStartBefore
        * range.setEndBefore
        * range.setStartAfter
        * range.setEndAfter
        * range.selectNode
        * range.selectNodeContents
    * 摘取与插入
        * var fragment = range.extractContents()
        * range.insertNode(document.createTextNode("aaaa"))
* 使用Range API解决子元素逆序问题：
* ```javascript
    function reverseChildren(element) {
        let range = new Range();
        range.selectNodeContents(element);

        let fragment = range.extractContents();
        let l = fragment.childNodes.length;
        while(l-- > 0) {
            fragment.appendChild(fragment.childNodes[l])
        }
        element.appendChild(fragment);
    }
  ```
  * 优势：只有一次appendChild操作，减少了浏览器的重排操作，节点数多时，性能更优
2. CSSOM
* doucment.styleSheets
* Rules
    * document.styleSheets[0].cssRules
    * document.styleSheets[0].insertRule("p {color: pink;}", 0)
    * document.styleSheets[0].removeRule(0)
* Rule
    * CSSStyleRule
        * selectorText String
        * style K-V结构
    * CSSCharsetRule
    * CSSImportRule
    * CSSMediaRule
    * CSSFontFaceRule
    * CSSPageRule
    * CSSNamespaceRule
    * CSSKeyframesRule
    * CSSKeyframeRule
    * CSSSupportsRule
    * ......
* getComputedStyle
    * window.getComputedStyle(elt, pseudoElt)
    * elt 想要获取的元素
    * pseudoElt 可选，伪元素
3. CSSOM View
* 窗口API
    * moveTo(x, y) 窗口移动到屏幕的特定坐标
    * moveBy(x, y) 窗口移动特定距离
    * resizeTo(x, y) 改变窗口大小到特定尺寸
    * resizeBy(x, y) 改变窗口大小特定尺寸
* 滚动API
    * 视口滚动API
        * scrollX 是视口的属性，表示 X 方向上的当前滚动距离，有别名 pageXOffset
        * scrollY 是视口的属性，表示 Y 方向上的当前滚动距离，有别名 pageYOffset
        * scroll(x, y) 使得页面滚动到特定的位置，有别名 scrollTo，支持传入配置型参数 {top, left}
        * scrollBy(x, y) 使得页面滚动特定的距离，支持传入配置型参数 {top, left}
    * 元素滚动API
        * scrollTop 元素的属性，表示 Y 方向上的当前滚动距离
        * scrollLeft 元素的属性，表示 X 方向上的当前滚动距离
        * scrollWidth 元素的属性，表示元素内部的滚动内容的宽度，一般来说会大于等于元素宽度
        * scrollHeight 元素的属性，表示元素内部的滚动内容的高度，一般来说会大于等于元素高度
        * scroll(x, y) 使得元素滚动到特定的位置，有别名 scrollTo，支持传入配置型参数 {top, left}
        * scrollBy(x, y) 使得元素滚动到特定的位置，支持传入配置型参数 {top, left}
        * scrollIntoView(arg) 滚动元素所在的父元素，使得元素滚动到可见区域，可以通过 arg 来指定滚到中间、开始或者就近
* 布局API
    * 全局尺寸信息
        * window.innerHeight, window.innerWidth 这两个属性表示视口的大小
        * window.outerWidth, window.outerHeight 这两个属性表示浏览器窗口占据的大小，很多浏览器没有实现，一般来说这两个属性无关紧要
        * window.devicePixelRatio 这个属性非常重要，表示物理像素和 CSS 像素单位的倍率关系，Retina 屏这个值是 2，后来也出现了一些 3 倍的 Android 屏
        * window.screen （屏幕尺寸相关的信息）
            * window.screen.width, window.screen.height 设备的屏幕尺寸
            * window.screen.availWidth, window.screen.availHeight 设备屏幕的可渲染区域尺寸，一些 Android 机器会把屏幕的一部分预留做固定按钮，所以有这两个属性，实际上一般浏览器不会实现的这么细致
            * window.screen.colorDepth, window.screen.pixelDepth 这两个属性是固定值 24，应该是为了以后预留
    * 元素的布局信息
        * scrollHeight
        * scrollTop
        * scrollLeft
        * getClientRects() 行盒
        * getBoundingClientRect() 包裹行盒的盒子
# 每周总结可以写在这里

定义了很多实体： https://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd

在这个网页中找 如图所示，可以下载到三份文件 [xhtml-lat1.ent](https://www.w3.org/TR/xhtml1/DTD/xhtml-lat1.ent) ， [xhtml-symbol.ent](https://www.w3.org/TR/xhtml1/DTD/xhtml-symbol.ent)， [xhtml-special.ent](https://www.w3.org/TR/xhtml1/DTD/xhtml-special.ent)

<img src="/Users/mpy/Library/Application Support/typora-user-images/image-20200609201225746.png" alt="image-20200609201225746" style="zoom:70%;" />

健壮的转义库 - https://github.com/mathiasbynens/he

`&nbsp;`是个比较特殊的字符，不同于空格，尽量不要用于实现多个空格，会造成排版的问题

但是普通字符的空格尽管代码写成多个，但是最终显示还是显示一个，但是如果换成`&nbsp;`&nbsp;就不会

问题： 老师那个space.html 是怎么弄得上面的空格，跟下面的空格有什么区别？？如何实现多个空格的效果

`white-space: pre`干啥的

熟记的内容

```html
// 都是需要转义的内容
<!ENTITY quot    "&#34;"> <!--  quotation mark, U+0022 ISOnum -->
<!ENTITY amp     "&#38;#38;"> <!--  ampersand, U+0026 ISOnum -->
<!ENTITY lt      "&#38;#60;"> <!--  less-than sign, U+003C ISOnum -->
<!ENTITY gt      "&#62;"> <!--  greater-than sign, U+003E ISOnum -->
```


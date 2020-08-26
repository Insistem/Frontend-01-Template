# 每周总结可以写在这里
Proxy
Range
组件化基础
对象与组件
对象

Properties
Methods
Inherit
组件

Properties
Methods
Inherit
Attribute
Config & State
Event
Lifecycle
Children
Attribute 和 Property 的意义区别
Attribute 属性、特征：强调描述性
Property 属性、财产：强调从属关系
LifeCycle
Created
mount
js change/set
User Input
如何设计组件状态
Markup set	JS set	JS Change	User Input Change	--
❌	⭕️	⭕️	?	property
⭕️	⭕️	⭕️	?	attribute
❌	❌	❌	⭕️	state
❌	⭕️	❌	❌	config
LifeCycle
*挂载

*更新

*销毁

设计 Carousel
state

activeIndex
property

loop time ingList color forward
attribute 与property的区别在于是否是一个默认值，是否容许更新

startIndex loop time imgList autoplay color forward
children

2种方式
append remove add
event

change child hover swipe resize dbclick
method

next prev goto play stop
config

mode: "useRAF" "useTimeout"
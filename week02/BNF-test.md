# 定义加法

```js
"a"
"b"
// 数字
<Number> = "0" | "1" | "2" | ...... | "9"
/**** 终极 *****
<PrimaryExpression> = <DecimalNumber> | "(" <LogicalExpression> ")"

<MultiplicativeExpression> = <PrimaryExpression> | <MultiplicativeExpression> "*" <PrimaryExpression> | <MultiplicativeExpression> "/" <PrimaryExpression>

<AdditiveExpression> = <MultiplicativeExpression> | <AdditiveExpression> "+" <MultiplicativeExpression> | <AdditiveExpression> "-" <MultiplicativeExpression>

<LogicalExpression> = <AdditiveExpression> | <LogicalExpression> "||" <AdditiveExpression> | <LogicalExpression> "&&" <AdditiveExpression>

/***** 初级 *****
// 十进制
<DecimalNumber> = "0" | (("1" | "2" | ...... | "9") <Number>*)
// 加法 1+2
<AdditiveExpression> = <DecimalNumber> | <AdditiveExpression> "+" <DecimalNumber>
// 乘法 1+2*3
<MultiplicativeExpression> = <DecimalNumber> | <MultiplicativeExpression> "+" <DecimalNumber> | <MultiplicativeExpression>
// 与或
<LogicalExpression> = <AdditiveExpression> | <LogicalExpression> "||" <AdditiveExpression> | <LogicalExpression> "&&" <AdditiveExpression> | <LogicalExpression> 

/**** 正则版本 *****
<DecimalNumber> = /0|[1-9][0-9]*/

```
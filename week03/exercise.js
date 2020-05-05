// 练习- 完成下面的函数
// NumberToString
// StringToNumber

// **************** StringToNumber **************
// 要求： 可以转成各种进制的, 实现类似parseFloat的功能
// 输入内容： 100 、10.0212
// level1:只能转整数
function convertStringToNumber1(string, x) {
    var chars = string.split('')
    var number = 0
    for(var i = 0; i < chars.length; i++) {
        number = number * x
        number += chars[i].codePointAt(0) - '0'.codePointAt(0)
    }
    console.log(number)
    return number
}
// level2: 还能转小数
function convertStringToNumber2(string, x) {
    var chars = string.split('')
    if (arguments.length < 2) x = 10;
    var number = 0
    var i = 0;
    while(i < chars.length && chars[i] !== '.') {
        number = number * x
        number += chars[i].codePointAt(0) - '0'.codePointAt(0)
        i++;
    }
    if (chars[i] === '.') i++;
    var fraction = 1;
    while(i < chars.length) {
        fraction = fraction / x;
        number += (chars[i].codePointAt(0) - '0'.codePointAt(0))
    }
    console.log(number)
    return number
}
// convertStringToNumber('100', 2)

// **************** NumberToString **************
// 说明：需要考虑除不尽的情况，number为0、number为小数
function convertNumberToString(number, x) {
    var integer = Math.floor(number)
    var fraction = number - integer
    var string = ''
    while(integer > 0) {
        string = String(integer % x) + string
        integer = Math.floor(integer / x)
    }
    return string
}


# 每周总结可以写在这里
正则真是博大精深

## JavaScript体系
- Atom
- Expression
- Statement
- Structure
- Program/Module

## 0416
## 0418

## UTF8 编码+解码

```
const encodeUtf8 = (str) => {
  const code = encodeURIComponent(text);
  const bytes = [];
  for (let i = 0; i < code.length; i++) {
    const c = code.charAt(i);
    if (c === "%") {
      const hex = code.charAt(i + 1) + code.charAt(i + 2);
      const hexVal = parseInt(hex, 16);
      bytes.push(hexVal);
      i += 2;
    } else {
      bytes.push(c.charCodeAt(0));
    }
  }
};

const decodeUtf8 = (bytes) => {
  let encoded = "";
  for (let i = 0; i < bytes.length; i++) {
    encoded += "%" + bytes[i].toString(16);
  }
  return decodeURIComponent(encoded)
};
```

## Number 正则

```
^[1-9]\d*$  匹配正整数
^-[1-9]\d*$ 匹配负整数
^-?[1-9]\d*$    匹配整数
^[1-9]\d*|0$    匹配非负整数（正整数 + 0）
^-[1-9]\d*|0$   匹配非正整数（负整数 + 0）
^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$  匹配正浮点数
^-([1-9]\d*\.\d*|0\.\d*[1-9]\d*)$   匹配负浮点数
^-?([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$     匹配浮点数
^[1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0$ 匹配非负浮点数（正浮点数 + 0）
^(-([1-9]\d*\.\d*|0\.\d*[1-9]\d*))|0?\.0+|0$    匹配非正浮点数（负浮点数 + 0）
```

## 字符串正则
```
/^([\u4e00-\u9fa5])$|^([a-zA-Z])$|[\"\'!#\$%&\*\+\-\/=\?\^_`{\|}~]$/
```
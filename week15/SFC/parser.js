// const parserCss = require('./parserCss');
// const layout = require('./layout');

let currentToken = null;
let currentAttribute = null;
let currentTextNode = null;
// end of file
const EOF = Symbol('EOF');

let stack = [{ type: 'document', children: [] }];

let rules = [];

function emit(token) {
  // 当前的栈顶永远是当前token的父节点
  let top = stack[stack.length - 1];

  if (token.type === 'startTag') {
    let element = {
      parent: top,
      type: 'element',
      tagName: token.tagName,
      children: [],
      attributes: [],
    };

    for (let p in token) {
      if (p !== 'type' && p !== 'tagName' && p !== 'isSelfClosing') {
        element.attributes.push({
          name: p,
          value: token[p],
        });
        // 支持inline CSS
        // if (p === 'style') {
        //   if (!element.computedStyle) {
        //     element.computedStyle = {};
        //   }
        //   const computedStyle = element.computedStyle
        //   // const styleRules = parserCss.getCssRules(`div {${token[p]}}`)
        //   const inlineSp = [1, 0, 0, 0];
        //   for (let declaration of styleRules[0].declarations) {
        //     if (!computedStyle[declaration.property]) {
        //       computedStyle[declaration.property] = {}
        //     }
        //     computedStyle[declaration.property].value = declaration.value;
        //     computedStyle[declaration.property].specificity = inlineSp;
        //   }
        // }
      }
    }

    // 解析CSS后获取rules来计算CSS
    if (rules.length) {
      parserCss.computeCss(element, rules);
    }

    top.children.push(element);

    // 自封闭的元素不需要入栈
    if (!token.isSelfClosing) {
      stack.push(element);
    }

    currentTextNode = null;
  } else if (token.type === 'endTag') {
    // 如果当前栈中top和结束标签不匹配，说明出错了
    if (top.tagName !== token.tagName) {
      throw new Error("Uncaught SyntaxError: Invalid or unexpected token");
    } else {
      // 因为combine style text是在出栈前处理的，所以需要在这里判断节点名是否为style，获取CSSOM
      // if (token.tagName === 'style') {
      //   const style = top.children.find(item => item.type === 'text');
      //   rules = rules.concat(parserCss.getCssRules(style.content))
      // }

      // 布局阶段
      // layout(top);
      // 是当前栈顶的结束标签则出栈
      stack.pop();
    }

    currentTextNode = null;
  } else if (token.type === 'text') {
    if (currentTextNode === null) {
      currentTextNode = {
        type: 'text',
        content: '',
      };
      top.children.push(currentTextNode);
    }
    currentTextNode.content += token.content;
  }
}

function data(c) {
  // LESS-THAN SIGN (<)
  // Switch to the tag open state.
  if (c === '<') {
    return tagOpen;
  } else if (c === EOF) {
    emit({
      type: 'EOF',
    });
    return;
  } else {
    emit({
      type: 'text',
      content: c,
    });
    return data;
  }
}

function tagOpen(c) {
  if (c === '/') {
    return endTagOpen;
  } else if (c.match(/^[a-zA-Z]$/)) {
    // ASCII alpha
    // Create a new start tag token, set its tag name to the empty string. Reconsume in the tag name state.
    // 看到Reconsume，需要重新消费当前的字符
    currentToken = {
      type: 'startTag',
      tagName: '',
    };
    return tagName(c);
  } else {
    return;
  }
}

function endTagOpen(c) {
  if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'endTag',
      tagName: '',
    };
    return tagName(c);
  } else if (c === '>') {
    return data;
  } else if (c === EOF) {
  } else {
  }
}

function tagName(c) {
  if (c.match(/^[\t\n\f\s]$/)) {
    return beforeAttributeName;
  } else if (c === '/') {
    return selfClosingStartTag;
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken.tagName += c.toLowerCase();
    return tagName;
  } else if (c === '>') {
    // Switch to the data state. Emit the current tag token.
    emit(currentToken);
    return data;
  } else {
    return tagName;
  }
}

function beforeAttributeName(c) {
  if (c.match(/^[\t\n\f\s]$/)) {
    // Ignore the character.
    return beforeAttributeName;
  } else if (c === '/' || c === '>' || c === EOF) {
    return afterAttributeName(c);
  } else if (c === '=') {
  } else {
    currentAttribute = {
      name: '',
      value: '',
    };
    return attributeName(c);
  }
}

// in script
function scriptData(c) {
  if (c == '<') {
    return scriptDataLessThanSign;
  } else {
    emit({
      type: 'text',
      content: c,
    });
    return scriptData;
  }
}
// in script received <
function scriptDataLessThanSign(c) {
  if (c == '/') {
    return scriptDataEndTagOpen;
  } else {
    emit({
      type: 'text',
      content: '<',
    });
    emit({
      type: 'text',
      content: c,
    });
    return scriptData;
  }
}
// in script received </
function scriptDataEndTagOpen(c) {
  if (c == 's') {
    return scriptDataEndTagNameS;
  } else {
    emit({
      type: 'text',
      content: '<',
    });
    emit({
      type: 'text',
      content: '/',
    });
    emit({
      type: 'text',
      content: c,
    });
    return scriptData;
  }
}

// in script received </s
function scriptDataEndTagNameS(c) {
  if (c == 'c') {
    return scriptDataEndTagNameC;
  } else {
    emit({
      type: 'text',
      content: '</s',
    });
    emit({
      type: 'text',
      content: c,
    });
    return scriptData;
  }
}

// in script received </sc
function scriptDataEndTagNameC(c) {
  if (c == 'r') {
    return scriptDataEndTagNameR;
  } else {
    emit({
      type: 'text',
      content: '</sc',
    });
    emit({
      type: 'text',
      content: c,
    });
    return scriptData;
  }
}
// in script received </scr
function scriptDataEndTagNameR(c) {
  if (c == 'i') {
    return scriptDataEndTagNameI;
  } else {
    emit({
      type: 'text',
      content: '</scr',
    });
    emit({
      type: 'text',
      content: c,
    });
    return scriptData;
  }
}
// in script received </scri
function scriptDataEndTagNameI(c) {
  if (c == 'p') {
    return scriptDataEndTagNameP;
  } else {
    emit({
      type: 'text',
      content: '</scri',
    });
    emit({
      type: 'text',
      content: c,
    });
    return scriptData;
  }
}
// in script received </scrip
function scriptDataEndTagNameP(c) {
  if (c == 't') {
    return scriptDataEndTag;
  } else {
    emit({
      type: 'text',
      content: '</scrip',
    });
    emit({
      type: 'text',
      content: c,
    });
    return scriptData;
  }
}
// in script received </script
function scriptDataEndTag(c) {
  if (c == ' ') {
    return scriptDataEndTag;
  }
  if (c == '>') {
    emit({
      type: 'endTag',
      tagName: 'script',
    });
    return data;
  } else {
    emit({
      type: 'text',
      content: '</script',
    });
    emit({
      type: 'text',
      content: c,
    });
    return scriptData;
  }
}

function afterAttributeName(c) {
  if (c.match(/^[\t\n\f\s]$/)) {
    return afterAttributeName;
  } else if (c === '/') {
    return selfClosingStartTag;
  } else if (c === '=') {
    return beforeAttributeValue;
  } else if (c === '>') {
    emit(currentToken);
    return data;
  } else {
    return beforeAttributeName(c);
  }
}

function attributeName(c) {
  if (c.match(/^[\t\n\f\s]$/) || c === '/' || c === '>' || c === EOF) {
    return afterAttributeName(c);
  } else if (c === '=') {
    return beforeAttributeValue;
  } else if (c === '\u0000') {
  } else if (c === '"' || c === "'" || c === '<') {
  } else {
    currentAttribute.name += c;
    return attributeName;
  }
}

function beforeAttributeValue(c) {
  if (c.match(/^[\t\n\f\s]$/)) {
    return beforeAttributeValue;
  } else if (c === '"') {
    return doubleQuoteAttributeValue;
  } else if (c === "'") {
    return singleQuoteAttributeValue;
  } else if (c === '>') {
    emit(currentToken);
    return data;
  } else {
    return unquoteAttributeValue(c);
  }
}

function doubleQuoteAttributeValue(c) {
  if (c === '"') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuoteAttributeValue;
  } else if (c === '/') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag;
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else {
    currentAttribute.value += c;
    return doubleQuoteAttributeValue;
  }
}

function singleQuoteAttributeValue(c) {
  if (c === "'") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuoteAttributeValue;
  } else if (c === '/') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag;
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else {
    currentAttribute.value += c;
    return singleQuoteAttributeValue;
  }
}

function afterQuoteAttributeValue(c) {
  if (c.match(/^[\t\n\f\s]$/)) {
    return beforeAttributeName;
  } else if (c === '/') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag;
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else {
    return afterQuoteAttributeValue;
  }
}

function unquoteAttributeValue(c) {
  if (c.match(/^[\t\n\f\s]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return beforeAttributeName;
  } else if (c === '/') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag;
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else {
    currentAttribute.value += c;
    return unquoteAttributeValue;
  }
}

function selfClosingStartTag(c) {
  if (c === '>') {
    currentToken.isSelfClosing = true;
    emit(currentToken);
    return data;
  } else if (c === 'EOF') {
  } else {
    return beforeAttributeName(c);
  }
}

function end(c) {
  return end;
}

module.exports.parserHTML = function parserHTML(html) {
  let state = data;
  for (let c of html) {
    state = state(c);
    if (stack[stack.length - 1].tagName === 'script' && state == data) {
      state = scriptData;
    }
  }
  state = state(EOF);

  return stack[0];
};

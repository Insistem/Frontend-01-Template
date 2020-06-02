/*
6 - 将token转化为tree结构
 使用栈来转为tree结构
从标签构建 DOM 树的基本技巧是使用栈。
遇到开始标签时创建元素并入栈，遇到结束标签时出栈。
自封闭节点可视为入栈后立刻出栈。
任何元素的父元素是它入栈前的栈顶。
 */


let currentToken = {}
let currentAttribute = null
let currentTextNode = null

let stack = [{ type: "document", children: [] }]

function emit (token) {
    let top = stack[stack.length - 1];

    if (token.type === "startTag") {
        let element = {
            type: "element",
            children: [],
            attributes: [],
        };

        element.tagName = token.tagName;

        for (let p in token) {
            if (p !== "type" && p !== "tagName") {
                element.attributes.push({
                    name: p,
                    value: token[p],
                });
            }
        }

        top.children.push(element);
        element.parent = top;

        if (!token.isSelfClosing) stack.push(element);
        currentTextNode = null;
    } else if (token.type === "endTag") {
        if (top.tagName !== token.tagName) {
            throw new Error("Tag start end doesn't match!");
        } else {
            stack.pop();
        }
        currentTextNode = null;
    } else if (token.type === "text") {
        if (currentTextNode === null) {
            currentTextNode = {
                type: "text",
                content: "",
            };
            top.children.push(currentTextNode);
        }
        currentTextNode.content += token.content;
    }
}

const EOF = Symbol('EOF') // EOF: end of file 一个唯一的标识

// 与HTML标准一致 data state,解析HTML的操作
function data (c) {
    if (c === '<') {
        return tagOpen
    } else if (c === EOF) {
        emit({
            type: 'EOF'
        })
        return
    } else {
        emit({
            type: 'text',
            content: c
        })
        return data
    }
}

function tagOpen (c) {
    if (c === '/') {
        return endTagOpen
    } else if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: 'startTag',
            tagName: ''
        }
        return tagName(c)
    } else {
        return data
    }
}

function endTagOpen (c) {
    if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: 'endTag',
            tagName: ''
        }
        return tagName(c)
    } else if (c === '>') {
    } else if (c === EOF) {
    } else { }
}

function tagName (c) {
    if (c.match(/^[\t\n\f ]$/)) { // 空格
        return beforeAttributeName
    } else if (c === '/') {
        return selfClosingStartTag
    } else if (c.match(/^[a-zA-Z]$/)) {
        currentToken.tagName += c // .toLowerCase() 是否允许大写的tag
        return tagName
    } else if (c === '>') {
        emit(currentToken) // 到这里已经生成了一个完整的token
        return data
    } else {
        return tagName
    }
}

function beforeAttributeName (c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName
    } else if (c === '/' || c === '>' || c === EOF)) {
        return afterAttributeName(c)
    } else if (c === '=') {
        // throw err
    } else {
        currentAttribute = {
            name: '',
            value: ''
        }
        return attributeName(c) //  TODO: 这里为啥是这样写 而不是 attributeName
    }
}

function attributeName (c) {
    if (c.match(/^[\t\n\f ]$/) || c === "/" || c === ">" || c === EOF) {
        return afterAttributeName(c);
    } else if (c === '=') {
        return beforeAttributeValue
    } else if (c === "\u0000") {
        //
    } else if (c === '"' || c === "'" || c === "<") {
        //
    } else {
        currentAttribute.name += c;
        return attributeName;
    }
}

function afterAttributeName (c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return afterAttributeName;
    } else if (c === '/') {
        return selfClosingStartTag
    } else if (c === '=') {
        return beforeAttributeValue
    } else if (c === '>') {
        emit(currentToken)
        return data
    } else if (c === EOF) {
        //
    } else {
        currentToken[currentAttribute.name] = currentAttribute.value // TODO:这里应该是<input disabled> 并没有value
        currentAttribute = {
            name: '',
            value: ''
        }
        return attributeName(c)
    }
}


function beforeAttributeValue (c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeValue
    } else if (c === '"') {
        return doubleQuoteAttributeValue
    } else if (c === "'") {
        return singleQuoteAttributeValue
    } else if (c === '>') {
        // return data
    } else {
        return unquoteAttributeValue(c)
    }
}

function doubleQuoteAttributeValue (c) {
    if (c === '"') {
        currentToken[currentAttribute.name] = currentAttribute.value
        return afterQuoteAttributeValue
    } else if (c === "\u0000") {
        //
    } else if (c === EOF) {
        //
    } else {
        currentAttribute.value += c;
        return doubleQuoteAttributeValue;
    }
}

function singleQuoteAttributeValue (c) {
    if (c === "'") {
        currentToken[currentAttribute.name] = currentAttribute.value
        return afterQuoteAttributeValue
    } else if (c === "\u0000") {
        //
    } else if (c === EOF) {
        //
    } else {
        currentAttribute.value += c;
        return doubleQuoteAttributeValue;
    }
}

function afterQuoteAttributeValue (c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return afterQuoteAttributeValue
    } else if (c === '/') {
        return selfClosingStartTag
    } else if (c === '>') {
        currentToken[currentAttribute.name] = currentAttribute.value
        emit(currentToken)
        return data
    } else if (c === EOF) {
        // 
    } else {
        currentAttribute.value += c
        return doubleQuoteAttributeValue
    }
}


function unquoteAttributeValue (c) {
    if (c.match(/^[\t\n\f ]$/)) {
        currentToken[currentAttribute.name] = currentAttribute.value
        return beforeAttributeName
    } else if (c === "/") { // TODO:这里感觉不太对，<input class=/>,感觉匹配出来时这种
        currentToken[currentAttribute.name] = currentAttribute.value;
        return selfClosingStartTag;
    } else if (c === ">") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (c === "\u0000") {
        //
    } else if (c === '"' || c === "'" || c === "<" || c === "=" || c === "`") {
        //
    } else if (c === EOF) {
        //
    } else {
        currentAttribute.value += c;
        return unquoteAttributeValue;
    }
}
}



function selfClosingStartTag (c) {
    if (c === '>') {
        currentToken.isSelfClosing = true
        return data
    } else if (c === EOF) { }
    else { }
}

module.exports.parseHTML = function (html) {
    let state = data
    for (let c of html) {
        state = state(c)
    }
    state = state(EOF)
    return stack[0]
}
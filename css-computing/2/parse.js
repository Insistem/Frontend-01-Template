/*
7 - 处理css
1. 将收集到的style标签中的文本内容，利用css这个npm包，转为AST Object，方便下一步处理
2. 创建一个元素后，立即计算css
 */

 const css = require('css')


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
        //  TODO: 为啥要写在这里
        computeCSS(element)

        top.children.push(element);
        element.parent = top;

        if (!token.isSelfClosing) stack.push(element);
        currentTextNode = null;
    } else if (token.type === "endTag") {
        if (top.tagName !== token.tagName) {
            throw new Error("Tag start end doesn't match!");
        } else {
            // -------------遇到style标签时，执行添加CSS规则的操作--------------------
            if(top.tagName === 'style') {
                addCSSRules(top.children[0].content)
            }
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

let rules = []
function addCSSRules(text) {
    var ast = css.parse(text)
    console.log(JSON.stringify(ast, null,  "     "))
    rules.push(...ast.stylesheet.rules)
}

function computeCSS(element) {
    console.log(rules)
    console.log('compute CSS for element', element)
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
    } else if (c === '/' || c === '>' || c === EOF) {
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
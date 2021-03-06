// 初始化有限状态机
// 5 - 加入对属性值的处理
//  每个状态机上面是处理特殊字符，没有特殊字符则进行正常操作

let currentToken = {}
let currentAttribute = null

function emit (token) {
    console.log(token)
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
        emit(currentToken)
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
}
// 初始化有限状态机
// 5 - 加入对属性值的处理

let currentToken = {}

function emit(token) {
    console.log(token)
}

const EOF = Symbol('EOF') // EOF: end of file 一个唯一的标识

// 与HTML标准一致 data state,解析HTML的操作
function data(c) {
    if(c === '<') {
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

function tagOpen(c) {
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

function endTagOpen(c) {
    if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: 'endTag',
            tagName: ''
        }
        return tagName(c)
    } else if (c === '>'){
    } else if (c === EOF){
    } else {}
}

function tagName(c) {
    if (c.match(/^[\t\n\f ]$/)) { // 空格
        return beforeAttributeName
    } else if (c === '/') {
        return  selfClosingStartTag
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

function beforeAttributeName(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName
    } else if (c === '>') {
        return data
    } else if (c === '=') {
        return beforeAttributeName
    } else {
        return beforeAttributeName
    }
}

function selfClosingStartTag(c) {
    if (c === '>') {
        currentToken.isSelfClosing = true
        return data
    }else if (c === EOF){}
    else {}
}

module.exports.parseHTML = function(html) {
    let state = data
    for(let c of html) {
        state = state(c)
    }
    state = state(EOF)
}
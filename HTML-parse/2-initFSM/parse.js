// 初始化有限状态机

const EOF = Symbol('EOF') // EOF: end of file 一个唯一的标识

// 与HTML标准一致 data state
function data(c) {}

module.exports.parseHTML = function(html) {
    let state = data
    for(let c of html) {
        state = state(c)
    }
    state = state(EOF)
}
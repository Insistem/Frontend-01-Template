// 在一个字符串中，找到字符“a”
function match(string){
    for(let c of string) {
        if(c == 'a') {
            return true
        }
    }
    return false
}
match('I am groot')

// 在一个字符串中，找到字符“ab”
function match(string){
    let foundA = false
    for(let c of string) {
        if(c == 'a') {
            foundA = true
        } else if (foundA && c == 'b') {
            return true
        } else {
            foundA = false
        }
    }
    return false
}
match('I am groot')

// 在一个字符串中，找到字符“abcdef”
// 可以理解成每个found就是一个状态机
function match(string){
    let foundA = false
    let foundB = false
    let foundC = false
    let foundD = false
    let foundE = false
    for(let c of string) {
        if(c == 'a') {
            foundA = true
        } else if (foundA && c == 'b') {
            foundB = true
        }  else if (foundB && c == 'c') {
            foundC = true
        }  else if (foundC && c == 'd') {
            foundD = true
        }  else if (foundD && c == 'e') {
            foundE = true
        }  else if (foundE && c == 'f') {
            return true
        } else {
            foundA = false
            foundB = false
            foundC = false
            foundD = false
            foundE = false
        }
    }
    return false
}
match('I am groot')

// 在一个字符串中，找到字符“abcdef” - 状态机写法
function match(string) {
    let state = start
    for(let c of string) {
        state = state(c)
    }
    return state === end
}

function start(c) {
    if (c == 'a') {
        return foundA
    }
    return start
}

function end(c) {
    return end
}

function foundA(c) {
    if (c == 'b') {
        return foundB
    }
    return start
}

function foundB(c) {
    if (c == 'c') {
        return foundC
    }
    return start
}

function foundC(c) {
    if (c == 'd') {
        return foundD
    }
    return start
}

function foundD(c) {
    if (c == 'e') {
        return foundE
    }
    return start
}

function foundE(c) {
    if (c == 'f') {
        return end
    }
    return start
}

// 实现‘abababx’的状态机

function match(string) {
    let state = start;
    for(let c of string) {
        state = state(c);
    }
    return state === end;
}

function start(c) {
    if (c === "a") {
        return foundA;
    } else {
        return start;
    }
}
function end(c) {
    return end;
}

function foundA(c) {
    if (c === "b") {
        return foundB;
    }else {
        return start(c);
    }
}
function foundB(c) {
    if (c === "c") {
        return foundC;
    }else {
        return start(c);
    }
}
function foundC(c) {
    if (c === "a") {
        return foundA2;
    }else {
        return start(c);
    }
}
function foundA2(c) {
    if (c === "b") {
        return foundB2;
    } else {
        return start(c);
    }
}

function foundB2(c) {
    if (c === "x") {
        return end;
    } else {
        return foundB(c);
    }
}
console.log(match("abcabcabx"));





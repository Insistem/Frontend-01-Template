function utf8Encoding(str) {
    let result = ''
    for(let s of str) {
    result += `\\u${s.charCodeAt().toString(16)}`
  }
  return result
}

utf8Encoding('zzzjjj') // "\u7a\u7a\u7a\u6a\u6a\u6a"
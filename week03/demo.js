// ***** case1 - 写一个每隔1s打印一个数字，并且打印无穷数 ****
// setTimeout 版本
var i = 0;
function tick() {
    setTimeout(()=> {
        tick()
        console.log(i)
        i++;
    },1000)
}
tick()
// async 版本
function sleep(d) {
    return new Promise(resolve => setTimeout(resolve, d))
}
void async function() {
    var i = 0;
    while(true) {
        console.log(i++)
        await sleep(1000)
    }
}()
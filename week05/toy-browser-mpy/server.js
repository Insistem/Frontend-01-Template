const http = require('http')

const server = http.createServer(function (request, response) {
    response.setHeader('X-Foo', 'bar');
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('okay');
})

server.listen(8888)
console.log('启动成功：3000端口')
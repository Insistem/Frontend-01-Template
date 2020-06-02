const http = require('http')

const server = http.createServer(function (request, response) {
    console.log('req', request.headers)
    response.setHeader('X-Foo', 'bar');
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('okay');
})

server.listen(8088)
console.log('启动成功：8088端口')
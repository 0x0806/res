'use strict';
const http = require('http');
const net = require('net');
const assert = require('assert');
const server = http.createServer(common.mustCall((request, response) => {
  response.end('hello world');
}), 1);
server.listen(0, common.mustCall(start));
function start() {
  const sock = net.connect(server.address().port);
  sock.write('' +
    'Host: localhost:8080\r\n' +
    'Transfer-Encoding: chunked\r\n' +
    '\r\n' +
    '2;\n' +
    'xx\r\n' +
    '4c\r\n' +
    '0\r\n' +
    '\r\n' +
    'Host: localhost:8080\r\n' +
    'Transfer-Encoding: chunked\r\n' +
    '\r\n' +
    '0\r\n' +
    '\r\n'
  );
  sock.resume();
  sock.on('end', common.mustCall(function() {
    server.close();
  }));
}

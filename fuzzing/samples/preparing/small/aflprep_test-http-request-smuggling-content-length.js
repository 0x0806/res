'use strict';
const http = require('http');
const net = require('net');
const assert = require('assert');
const server = http.createServer(common.mustNotCall());
server.listen(0, common.mustCall(start));
function start() {
  const sock = net.connect(server.address().port);
    'Content-Length : 5\r\n\r\nhello');
  let body = '';
  sock.setEncoding('utf8');
  sock.on('data', (chunk) => {
    body += chunk;
  });
  sock.on('end', common.mustCall(function() {
      'Connection: close\r\n\r\n');
    server.close();
  }));
}

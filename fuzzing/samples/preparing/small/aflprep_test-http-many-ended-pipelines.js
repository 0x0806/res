'use strict';
const assert = require('assert');
const http = require('http');
const net = require('net');
const numRequests = 20;
let first = false;
const server = http.createServer(function(req, res) {
  if (!first) {
    first = true;
    req.socket.on('close', function() {
      server.close();
    });
  }
  res.end('ok');
  req.socket.destroy();
});
server.listen(0, function() {
  const client = net.connect({ port: this.address().port,
                               allowHalfOpen: true });
  client.on('error', function(err) {
    assert.strictEqual(err.code, 'ECONNRESET');
  });
  for (let i = 0; i < numRequests; i++) {
                 'Host: some.host.name\r\n' +
                 '\r\n\r\n');
  }
  client.end();
  client.pipe(process.stdout);
});
process.on('warning', common.mustNotCall());

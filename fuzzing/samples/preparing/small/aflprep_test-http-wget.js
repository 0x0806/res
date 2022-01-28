'use strict';
const assert = require('assert');
const net = require('net');
const http = require('http');
const server = http.createServer((req, res) => {
  res.write('hello ');
  res.write('world\n');
  res.end();
});
server.listen(0);
server.on('listening', common.mustCall(() => {
  const c = net.createConnection(server.address().port);
  let server_response = '';
  c.setEncoding('utf8');
  c.on('connect', () => {
            'Connection: Keep-Alive\r\n\r\n');
  });
  c.on('data', (chunk) => {
    console.log(chunk);
    server_response += chunk;
  });
  c.on('end', common.mustCall(() => {
    const m = server_response.split('\r\n\r\n');
    assert.strictEqual(m[1], 'hello world\n');
    console.log('got end');
    c.end();
  }));
  c.on('close', common.mustCall(() => {
    console.log('got close');
    server.close();
  }));
}));

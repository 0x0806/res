'use strict';
const assert = require('assert');
const http = require('http');
const net = require('net');
const server = net.createServer(function(c) {
  c.on('data', function(d) {
    c.write('hello: world\r\n');
    c.write('connection: upgrade\r\n');
    c.write('upgrade: websocket\r\n');
    c.write('\r\n');
    c.write('nurtzo');
  });
  c.on('end', function() {
    c.end();
  });
});
server.listen(0, '127.0.0.1', common.mustCall(function() {
  const options = {
    port: this.address().port,
    host: '127.0.0.1',
    headers: {
      'connection': 'upgrade',
      'upgrade': 'websocket'
    }
  };
  const name = `${options.host}:${options.port}`;
  const req = http.request(options);
  req.end();
  req.on('upgrade', common.mustCall(function(res, socket, upgradeHead) {
    let recvData = upgradeHead;
    socket.on('data', function(d) {
      recvData += d;
    });
    socket.on('close', common.mustCall(function() {
      assert.strictEqual(recvData.toString(), 'nurtzo');
    }));
    console.log(res.headers);
    const expectedHeaders = { 'hello': 'world',
                              'connection': 'upgrade',
                              'upgrade': 'websocket' };
    assert.deepStrictEqual(expectedHeaders, res.headers);
    assert(!(name in http.globalAgent.sockets));
    req.on('close', common.mustCall(function() {
      socket.end();
      server.close();
    }));
  }));
}));

'use strict';
const assert = require('assert');
const http = require('http');
const net = require('net');
const expectedRecvData = 'nurtzo';
const server = net.createServer(function(c) {
  c.on('data', function(d) {
    c.write('hello: world\r\n');
    c.write('connection: upgrade\r\n');
    c.write('upgrade: websocket\r\n');
    c.write('\r\n');
    c.write(expectedRecvData);
  });
  c.on('end', function() {
    c.end();
  });
});
server.listen(0, '127.0.0.1', common.mustCall(function() {
  const port = this.address().port;
  const headers = [
    {
      connection: 'upgrade',
      upgrade: 'websocket'
    },
    [
      ['Host', 'echo.websocket.org'],
      ['Connection', 'Upgrade'],
      ['Upgrade', 'websocket'],
    ],
  ];
  const countdown = new Countdown(headers.length, () => server.close());
  headers.forEach(function(h) {
    const req = http.get({
      port: port,
      headers: h
    });
    let sawUpgrade = false;
    req.on('upgrade', common.mustCall(function(res, socket, upgradeHead) {
      sawUpgrade = true;
      let recvData = upgradeHead;
      socket.on('data', function(d) {
        recvData += d;
      });
      socket.on('close', common.mustCall(function() {
        assert.strictEqual(recvData.toString(), expectedRecvData);
      }));
      console.log(res.headers);
      const expectedHeaders = {
        hello: 'world',
        connection: 'upgrade',
        upgrade: 'websocket'
      };
      assert.deepStrictEqual(res.headers, expectedHeaders);
      socket.end();
      countdown.dec();
    }));
    req.on('close', common.mustCall(function() {
      assert.strictEqual(sawUpgrade, true);
    }));
  });
}));

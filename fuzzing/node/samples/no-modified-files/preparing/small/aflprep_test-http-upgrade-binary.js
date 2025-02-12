'use strict';
const assert = require('assert');
const http = require('http');
const net = require('net');
net.createServer(mustCall(function(conn) {
             'Connection: upgrade\r\n' +
             'Transfer-Encoding: chunked\r\n' +
             'Upgrade: websocket\r\n' +
             '\r\n' +
             '\u0080', 'latin1');
  this.close();
})).listen(0, mustCall(function() {
  http.get({
    host: this.address().host,
    port: this.address().port,
    headers: { 'Connection': 'upgrade', 'Upgrade': 'websocket' },
  }).on('upgrade', mustCall((res, conn, head) => {
    assert.strictEqual(head.length, 1);
    assert.strictEqual(head[0], 128);
    conn.destroy();
  }));
}));

'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const h2 = require('http2');
const net = require('net');
const errMsg = {
  code: 'ERR_HTTP2_NO_SOCKET_MANIPULATION',
  name: 'Error',
           '(e.g. read and written)'
};
const server = h2.createServer();
server.on('request', common.mustCall(function(request, response) {
  assert.ok(request.socket instanceof net.Socket);
  assert.ok(response.socket instanceof net.Socket);
  assert.strictEqual(request.socket, response.socket);
  assert.ok(request.socket.readable);
  request.resume();
  assert.ok(request.socket.writable);
  assert.strictEqual(request.socket.destroyed, false);
  request.socket.setTimeout(987);
  assert.strictEqual(request.stream.session[kTimeout]._idleTimeout, 987);
  request.socket.setTimeout(0);
  assert.throws(() => request.socket.read(), errMsg);
  assert.throws(() => request.socket.write(), errMsg);
  assert.throws(() => request.socket.pause(), errMsg);
  assert.throws(() => request.socket.resume(), errMsg);
  assert.ok(request.socket.address() != null);
  assert.ok(request.socket.remotePort);
  request.on('end', common.mustCall(() => {
    assert.strictEqual(request.socket.readable, false);
    response.socket.destroy();
  }));
  response.on('finish', common.mustCall(() => {
    assert.ok(request.socket);
    assert.strictEqual(response.socket, undefined);
    assert.ok(request.socket.destroyed);
    assert.strictEqual(request.socket.readable, false);
    process.nextTick(() => {
      assert.strictEqual(request.socket.writable, false);
      server.close();
    });
  }));
  assert.ok(request.socket._server);
  assert.strictEqual(request.socket.connecting, false);
  request.socket.on('close', common.mustCall());
  request.socket.once('close', common.mustCall());
  request.socket.on('testEvent', common.mustCall());
  request.socket.emit('testEvent');
}));
server.listen(0, common.mustCall(function() {
  const port = server.address().port;
  const client = h2.connect(url, common.mustCall(() => {
    const headers = {
      ':method': 'GET',
      ':scheme': 'http',
      ':authority': `localhost:${port}`
    };
    const request = client.request(headers);
    request.on('end', common.mustCall(() => {
      client.close();
    }));
    request.end();
    request.resume();
  }));
}));

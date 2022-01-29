'use strict';
const assert = require('assert');
const http = require('http');
const server = http.createServer(common.mustNotCall());
server.on('connect', common.mustCall((req, socket, firstBodyChunk) => {
  assert.strictEqual(req.method, 'CONNECT');
  assert.strictEqual(req.url, 'google.com:443');
  assert.strictEqual(socket.listenerCount('close'), 0);
  assert.strictEqual(socket.listenerCount('drain'), 0);
  assert.strictEqual(socket.listenerCount('data'), 0);
  assert.strictEqual(socket.listenerCount('end'), 1);
  assert.strictEqual(socket.listenerCount('error'), 0);
  assert.strictEqual(socket.listenerCount('timeout'), 0);
  let data = firstBodyChunk.toString();
  socket.on('data', (buf) => {
    data += buf.toString();
  });
  socket.on('end', common.mustCall(() => {
    socket.end(data);
  }));
}));
server.listen(0, common.mustCall(() => {
  const req = http.request({
    port: server.address().port,
    method: 'CONNECT',
    path: 'google.com:443',
    timeout: 20000
  }, common.mustNotCall());
  req.on('socket', common.mustCall((socket) => {
    assert.strictEqual(socket._httpMessage, req);
  }));
  assert.strictEqual(req.destroyed, false);
  req.on('close', common.mustCall(() => {
    assert.strictEqual(req.destroyed, true);
  }));
  req.on('connect', common.mustCall((res, socket, firstBodyChunk) => {
    const name = `localhost:${server.address().port}`;
    assert(!(name in http.globalAgent.sockets));
    assert(!(name in http.globalAgent.requests));
    assert(!socket.ondata);
    assert(!socket.onend);
    assert.strictEqual(socket._httpMessage, null);
    assert.strictEqual(socket.listenerCount('connect'), 0);
    assert.strictEqual(socket.listenerCount('data'), 0);
    assert.strictEqual(socket.listenerCount('drain'), 0);
    assert.strictEqual(socket.listenerCount('end'), 1);
    assert.strictEqual(socket.listenerCount('free'), 0);
    assert.strictEqual(socket.listenerCount('close'), 0);
    assert.strictEqual(socket.listenerCount('error'), 0);
    assert.strictEqual(socket.listenerCount('agentRemove'), 0);
    assert.strictEqual(socket.listenerCount('timeout'), 0);
    let data = firstBodyChunk.toString();
    socket.on('data', (buf) => {
      data += buf.toString();
    });
    socket.on('end', common.mustCall(() => {
      assert.strictEqual(data, 'HeadBody');
      server.close();
    }));
    socket.write('Body');
    socket.end();
  }));
  req.write('Head');
  req.end();
}));

'use strict';
const assert = require('assert');
const http = require('http');
const server = http.createServer(common.mustNotCall());
server.on('connect', common.mustCall(function(req, socket, firstBodyChunk) {
  assert.strictEqual(req.method, 'CONNECT');
  assert.strictEqual(req.url, 'example.com:443');
  console.error('Server got CONNECT request');
  socket.write(
    'Date: Tue, 15 Nov 1994 08:12:31 GMT\r\n' +
    '\r\n' +
    'Head'
  );
  let data = firstBodyChunk.toString();
  socket.on('data', function(buf) {
    data += buf.toString();
  });
  socket.on('end', function() {
    socket.end(data);
  });
}));
server.listen(0, common.mustCall(function() {
  const req = http.request({
    port: this.address().port,
    method: 'CONNECT',
    path: 'example.com:443'
  }, common.mustNotCall());
  assert.strictEqual(req.destroyed, false);
  req.on('close', common.mustCall(() => {
    assert.strictEqual(req.destroyed, true);
  }));
  req.on('connect', common.mustCall(function(res, socket, firstBodyChunk) {
    console.error('Client got CONNECT request');
    const name = `localhost:${server.address().port}`;
    assert(!(name in http.globalAgent.sockets));
    assert(!(name in http.globalAgent.requests));
    assert(!socket.ondata);
    assert(!socket.onend);
    assert.strictEqual(socket.listeners('connect').length, 0);
    assert.strictEqual(socket.listeners('data').length, 0);
    let data = firstBodyChunk.toString();
    assert.strictEqual(data, 'Head');
    socket.on('data', function(buf) {
      data += buf.toString();
    });
    socket.on('end', function() {
      assert.strictEqual(data, 'HeadRequestEnd');
      server.close();
    });
    socket.end('End');
  }));
  req.end('Request');
}));

'use strict';
const assert = require('assert');
const http = require('http');
const server = http.createServer(common.mustCall(function(req, res) {
  assert.strictEqual(res.writable, true);
  assert.strictEqual(res.finished, false);
  assert.strictEqual(res.writableEnded, false);
  res.end();
  assert.strictEqual(res.writable, true);
  assert.strictEqual(res.finished, true);
  assert.strictEqual(res.writableEnded, true);
  server.close();
}));
server.listen(0);
server.on('listening', common.mustCall(function() {
  const clientRequest = http.request({
    port: server.address().port,
    method: 'GET',
  });
  assert.strictEqual(clientRequest.writable, true);
  clientRequest.end();
  assert.strictEqual(clientRequest.writable, true);
}));

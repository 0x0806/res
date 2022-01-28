'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const h2 = require('http2');
const server = h2.createServer();
server.on('stream', common.mustCall(onStream));
function onPriority(stream, parent, weight, exclusive) {
  assert.strictEqual(stream, 1);
  assert.strictEqual(parent, 0);
  assert.strictEqual(weight, 1);
  assert.strictEqual(exclusive, false);
}
function onStream(stream, headers, flags) {
  stream.priority({
    parent: 0,
    weight: 1,
    exclusive: false
  });
  stream.respond({
    ':status': 200
  });
  stream.end('hello world');
}
server.listen(0);
server.on('priority', common.mustCall(onPriority));
server.on('listening', common.mustCall(() => {
  client.on('connect', () => {
    req.priority({
      parent: 0,
      weight: 1,
      exclusive: false
    });
  });
  req.on('priority', common.mustCall(onPriority));
  req.on('response', common.mustCall());
  req.resume();
  req.on('end', common.mustCall(() => {
    server.close();
    client.close();
  }));
  req.end();
}));

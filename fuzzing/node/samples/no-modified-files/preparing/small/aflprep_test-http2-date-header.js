'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const http2 = require('http2');
const server = http2.createServer();
server.on('stream', common.mustCall((stream) => {
  stream.respond();
  stream.end();
}));
server.listen(0, common.mustCall(() => {
  const req = client.request();
  req.on('response', common.mustCall((headers) => {
    assert.notStrictEqual((new Date()).toString(), 'Invalid Date');
  }));
  req.resume();
  req.on('end', common.mustCall(() => {
    server.close();
    client.close();
  }));
}));

'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const http2 = require('http2');
const util = require('util');
const server = http2.createServer();
server.on('stream', common.mustCall((stream) => {
  assert.strictEqual(stream.aborted, false);
  const insp = util.inspect(stream);
  stream.end('ok');
}));
server.listen(0, common.mustCall(() => {
  const req = client.request();
  req.resume();
  req.on('close', common.mustCall(() => {
    client.close();
    server.close();
  }));
}));

'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const http2 = require('http2');
const checkWeight = (actual, expect) => {
  const server = http2.createServer();
  server.on('stream', common.mustCall((stream, headers, flags) => {
    assert.strictEqual(stream.state.weight, expect);
    stream.respond();
    stream.end('test');
  }));
  server.listen(0, common.mustCall(() => {
    const req = client.request({}, { weight: actual });
    req.on('data', common.mustCall());
    req.on('end', common.mustCall());
    req.on('close', common.mustCall(() => {
      server.close();
      client.close();
    }));
  }));
};
checkWeight(-1, 1);
checkWeight(0, 1);
checkWeight(1, 1);
checkWeight(16, 16);
checkWeight(256, 256);
checkWeight(257, 256);
checkWeight(512, 256);
checkWeight(undefined, 16);

'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const http2 = require('http2');
const fs = require('fs');
const loc = fixtures.path('person-large.jpg');
assert(fs.existsSync(loc));
fs.readFile(loc, common.mustSucceed((data) => {
  const server = http2.createServer();
  server.on('stream', common.mustCall((stream) => {
    setImmediate(() => {
      stream.on('close', common.mustCall(() => {
        assert.strictEqual(stream.rstCode, 0);
      }));
      stream.respond({ ':status': 400 });
      stream.end();
    });
  }));
  server.listen(0, common.mustCall(() => {
    const req = client.request({ ':method': 'POST' });
    req.on('response', common.mustCall((headers) => {
      assert.strictEqual(headers[':status'], 400);
    }));
    req.resume();
    req.on('end', common.mustCall(() => {
      server.close();
      client.close();
    }));
    const str = fs.createReadStream(loc);
    str.pipe(req);
  }));
}));

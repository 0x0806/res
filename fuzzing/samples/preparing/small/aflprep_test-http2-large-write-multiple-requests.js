'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const http2 = require('http2');
const content = fixtures.readSync('person-large.jpg');
const server = http2.createServer({
  maxSessionMemory: 1000
});
server.on('stream', (stream, headers) => {
  stream.respond({
    ':status': 200
  });
  stream.end(content);
});
server.unref();
server.listen(0, common.mustCall(() => {
  let finished = 0;
  for (let i = 0; i < 100; i++) {
    const chunks = [];
    req.on('data', (chunk) => {
      chunks.push(chunk);
    });
    req.on('end', common.mustCall(() => {
      assert.deepStrictEqual(Buffer.concat(chunks), content);
      if (++finished === 100) client.close();
    }));
  }
}));

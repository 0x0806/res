'use strict';
const assert = require('assert');
const http = require('http');
const maxSize = 1024;
let size = 0;
const server = http.createServer(common.mustCall((req, res) => {
  server.close();
  for (let i = 0; i < maxSize; i++) {
    res.write(`x${i}`);
  }
  res.end();
}));
server.listen(0, () => {
  const res = common.mustCall((res) => {
    res.on('data', (chunk) => {
      size += chunk.length;
      assert(!req.aborted, 'got data after abort');
      if (size > maxSize) {
        req.abort();
        assert.strictEqual(req.aborted, true);
        size = maxSize;
      }
    });
    req.on('abort', common.mustCall(() => assert.strictEqual(size, maxSize)));
    assert.strictEqual(req.aborted, false);
  });
});

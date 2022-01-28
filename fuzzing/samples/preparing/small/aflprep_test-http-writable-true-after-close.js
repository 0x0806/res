'use strict';
const assert = require('assert');
const { get, createServer } = require('http');
let internal;
let external;
const server = createServer(common.mustCall((req, res) => {
  const listener = common.mustCall(() => {
    assert.strictEqual(res.writable, true);
  });
  res.on('finish', listener);
  res.on('close', listener);
    inner.pipe(res);
  }));
})).listen(0, () => {
  internal = createServer((req, res) => {
    res.writeHead(200);
    setImmediate(common.mustCall(() => {
      external.abort();
      res.end('Hello World\n');
    }));
  }).listen(0, () => {
    external.on('error', common.mustCall(() => {
      server.close();
      internal.close();
    }));
  });
});

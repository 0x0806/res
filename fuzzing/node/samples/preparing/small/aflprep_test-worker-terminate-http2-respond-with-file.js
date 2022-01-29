'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const http2 = require('http2');
const { Worker, isMainThread } = require('worker_threads');
if (isMainThread) {
  return new Worker(__filename);
}
{
  const server = http2.createServer();
  server.on('stream', common.mustCall((stream, headers) => {
  }));
  const { clientSide, serverSide } = makeDuplexPair();
  server.emit('connection', serverSide);
    createConnection: common.mustCall(() => clientSide)
  });
  const req = client.request();
  req.on('response', common.mustCall((headers) => {
    assert.strictEqual(headers[':status'], 200);
  }));
  req.on('data', common.mustCall(process.exit));
  req.on('end', common.mustNotCall());
  req.end();
}

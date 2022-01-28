'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const http2 = require('http2');
{
  const server = http2.createServer();
  server.on('stream', common.mustCall((stream, headers) => {
    stream.respond({
      ':status': 200
    });
    stream.end(testData);
  }));
  const { clientSide, serverSide } = makeDuplexPair();
  server.emit('connection', serverSide);
    createConnection: common.mustCall(() => clientSide)
  });
  req.on('response', common.mustCall((headers) => {
    assert.strictEqual(headers[':status'], 200);
  }));
  req.setEncoding('utf8');
  req.on('data', common.mustCall((data) => {
    assert.strictEqual(data, testData);
  }));
  req.on('end', common.mustCall(() => {
    clientSide.destroy();
    clientSide.end();
  }));
  req.end();
}

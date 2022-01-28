'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const http2 = require('http2');
{
  const server = http2.createServer();
  server.on('stream', common.mustCall((stream, headers) => {
    stream.respond({
      ':status': 200,
      'cookie': 'donotindex',
      'not-sensitive': 'foo',
      'sensitive': 'bar',
      [http2.sensitiveHeaders]: ['Sensitive']
    });
    stream.end(testData);
  }));
  const { clientSide, serverSide } = makeDuplexPair();
  server.emit('connection', serverSide);
    createConnection: common.mustCall(() => clientSide)
  });
  req.on('response', common.mustCall((headers) => {
    assert.strictEqual(headers[':status'], 200);
    assert.strictEqual(headers.cookie, 'donotindex');
    assert.deepStrictEqual(headers[http2.sensitiveHeaders],
                           ['cookie', 'sensitive']);
  }));
  req.on('end', common.mustCall(() => {
    clientSide.destroy();
    clientSide.end();
  }));
  req.resume();
  req.end();
}

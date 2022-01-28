'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const h2 = require('http2');
const server = h2.createServer();
server.on('stream', common.mustCall((stream) => {
  [
    ':path',
    ':authority',
    ':method',
    ':scheme',
  ].forEach((i) => {
                  {
                    code: 'ERR_HTTP2_INVALID_PSEUDOHEADER'
                  });
  });
  stream.respond({}, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    assert.throws(() => {
      stream.sendTrailers({ ':status': 'bar' });
    }, {
      code: 'ERR_HTTP2_INVALID_PSEUDOHEADER'
    });
    stream.close();
  });
  stream.end('hello world');
}));
server.listen(0, common.mustCall(() => {
  const req = client.request();
  req.on('response', common.mustCall());
  req.resume();
  req.on('end', common.mustCall());
  req.on('close', common.mustCall(() => {
    server.close();
    client.close();
  }));
}));

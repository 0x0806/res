'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const http2 = require('http2');
const { Http2Stream } = internalBinding('http2');
const server = http2.createServer();
Http2Stream.prototype.respond = () => 1;
server.on('stream', common.mustCall((stream) => {
  assert.throws(
    () => stream.respond(),
    {
      name: 'Error',
      code: 'ERR_HTTP2_HEADERS_SENT',
      message: 'Response has already been initiated.'
    }
  );
  stream.destroy();
  assert.throws(
    () => stream.respond(),
    {
      name: 'Error',
      code: 'ERR_HTTP2_INVALID_STREAM',
      message: 'The stream has been destroyed'
    }
  );
}));
server.listen(0, common.mustCall(() => {
  const req = client.request();
  req.on('end', common.mustCall(() => {
    client.close();
    server.close();
  }));
  req.resume();
  req.end();
}));

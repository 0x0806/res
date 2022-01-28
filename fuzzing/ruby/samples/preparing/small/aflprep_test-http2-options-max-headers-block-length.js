'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const h2 = require('http2');
const server = h2.createServer();
server.on('stream', common.mustNotCall());
server.listen(0, common.mustCall(() => {
  const options = {
    maxSendHeaderBlockLength: 10
  };
                            options);
  const req = client.request();
  req.on('response', common.mustNotCall());
  req.resume();
  req.on('close', common.mustCall(() => {
    client.close();
    server.close();
  }));
  req.on('frameError', common.mustCall((type, code) => {
    assert.strictEqual(code, h2.constants.NGHTTP2_ERR_FRAME_SIZE_ERROR);
  }));
  req.on('error', common.expectsError({
    code: 'ERR_HTTP2_STREAM_ERROR',
    name: 'Error',
    message: 'Stream closed with error code NGHTTP2_REFUSED_STREAM'
  }));
}));

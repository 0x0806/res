'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const http2 = require('http2');
const assert = require('assert');
const {
  NGHTTP2_ENHANCE_YOUR_CALM
} = http2.constants;
const server = http2.createServer({ maxHeaderListPairs: 0 });
server.on('stream', common.mustNotCall());
server.listen(0, common.mustCall(() => {
  const req = client.request({ foo: 'bar' });
  req.on('error', common.expectsError({
    code: 'ERR_HTTP2_STREAM_ERROR',
    name: 'Error',
    message: 'Stream closed with error code NGHTTP2_ENHANCE_YOUR_CALM'
  }));
  req.on('close', common.mustCall(() => {
    assert.strictEqual(req.rstCode, NGHTTP2_ENHANCE_YOUR_CALM);
    server.close();
    client.close();
  }));
}));

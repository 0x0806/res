'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const h2 = require('http2');
const NGHTTP2_INTERNAL_ERROR = h2.constants.NGHTTP2_INTERNAL_ERROR;
const server = h2.createServer();
server.on('stream', (stream) => {
  stream.on('error', (err) => {
    assert.strictEqual(err.code, 'ERR_HTTP2_STREAM_ERROR');
    assert.strictEqual(err.message,
                       'Stream closed with error code NGHTTP2_INTERNAL_ERROR');
  });
  stream.respond();
  stream.end();
});
server.listen(0, common.mustCall(() => {
  const countdown = new Countdown(2, () => {
    server.close();
    client.close();
  });
  client.on('connect', () => countdown.dec());
  const req = client.request();
  req.destroy(new Error('test'));
  req.on('error', common.expectsError({
    name: 'Error',
    message: 'test'
  }));
  req.on('close', common.mustCall(() => {
    assert.strictEqual(req.rstCode, NGHTTP2_INTERNAL_ERROR);
    assert.strictEqual(req.rstCode, NGHTTP2_INTERNAL_ERROR);
    countdown.dec();
  }));
  req.on('response', common.mustNotCall());
  req.resume();
  req.on('end', common.mustNotCall());
}));

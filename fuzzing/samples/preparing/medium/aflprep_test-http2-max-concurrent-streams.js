'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const h2 = require('http2');
const server = h2.createServer({ settings: { maxConcurrentStreams: 1 } });
server.on('stream', common.mustCall((stream) => {
  stream.respond();
  stream.end('hello world');
}));
server.listen(0, common.mustCall(() => {
  const countdown = new Countdown(2, () => {
    server.close();
    client.close();
  });
  client.on('remoteSettings', common.mustCall((settings) => {
    assert.strictEqual(settings.maxConcurrentStreams, 1);
  }));
  {
    const req = client.request({ ':method': 'POST' });
    req.on('aborted', common.mustNotCall());
    req.on('response', common.mustCall());
    req.resume();
    req.on('end', common.mustCall());
    req.on('close', common.mustCall(() => countdown.dec()));
    req.end();
  }
  {
    const req = client.request({ ':method': 'POST' });
    req.on('aborted', common.mustCall());
    req.on('response', common.mustNotCall());
    req.resume();
    req.on('end', common.mustCall());
    req.on('close', common.mustCall(() => countdown.dec()));
    req.on('error', common.expectsError({
      code: 'ERR_HTTP2_STREAM_ERROR',
      name: 'Error',
      message: 'Stream closed with error code NGHTTP2_REFUSED_STREAM'
    }));
  }
}));

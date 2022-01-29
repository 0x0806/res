'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const http2 = require('http2');
const server = http2.createServer();
server.on('stream', common.mustCall((stream) => {
  stream.respond();
  stream.end();
}));
server.listen(0, common.mustCall(() => {
  const countdown = new Countdown(2, () => {
    server.close();
    client.close();
  });
  assert.throws(
    () => {
      client.request({
        ':method': 'POST',
        'content-length': 1,
        'Content-Length': 2
      });
    }, {
      code: 'ERR_HTTP2_HEADER_SINGLE_VALUE',
      name: 'TypeError',
      message: 'Header field "content-length" must only have a single value'
    }
  );
  {
    const req = client.request({
      ':method': 'POST',
      'content-length': 1
    });
    req.resume();
    req.on('end', common.mustCall());
    req.on('close', common.mustCall(() => countdown.dec()));
    req.end('a');
  }
  {
    const req = client.request({ 'content-length': 1 });
    req.resume();
    req.on('end', common.mustCall());
    req.on('close', common.mustCall(() => countdown.dec()));
    req.on('error', common.expectsError({
      code: 'ERR_HTTP2_STREAM_ERROR',
      name: 'Error',
      message: 'Stream closed with error code NGHTTP2_PROTOCOL_ERROR'
    }));
  }
}));

'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const h2 = require('http2');
const { inspect } = require('util');
const server = h2.createServer();
server.on('stream', (stream) => {
  stream.on('close', common.mustCall());
  stream.respond();
  stream.end('ok');
});
server.listen(0, common.mustCall(() => {
  const req = client.request();
  const closeCode = 1;
  assert.throws(
    () => req.close(2 ** 32),
    {
      name: 'RangeError',
      code: 'ERR_OUT_OF_RANGE',
      message: 'The value of "code" is out of range. It must be ' +
               '>= 0 && <= 4294967295. Received 4294967296'
    }
  );
  assert.strictEqual(req.closed, false);
  [true, 1, {}, [], null, 'test'].forEach((notFunction) => {
    assert.throws(
      () => req.close(closeCode, notFunction),
      {
        name: 'TypeError',
        code: 'ERR_INVALID_CALLBACK',
        message: `Callback must be a function. Received ${inspect(notFunction)}`
      }
    );
    assert.strictEqual(req.closed, false);
  });
  req.close(closeCode, common.mustCall());
  assert.strictEqual(req.closed, true);
  req._destroy = common.mustCall(req._destroy.bind(req));
  req.close(closeCode + 1);
  req.on('close', common.mustCall(() => {
    assert.strictEqual(req.destroyed, true);
    assert.strictEqual(req.rstCode, closeCode);
    server.close();
    client.close();
  }));
  req.on('error', common.expectsError({
    code: 'ERR_HTTP2_STREAM_ERROR',
    name: 'Error',
    message: 'Stream closed with error code NGHTTP2_PROTOCOL_ERROR'
  }));
  req.on('response', common.mustNotCall());
  req.on('end', common.mustCall());
  req.resume();
  req.end();
}));

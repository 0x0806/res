'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const h2 = require('http2');
const server = h2.createServer();
server.on('stream', common.mustCall((stream) => {
  assert(stream.session);
  stream.session.destroy();
  assert.strictEqual(stream.session, undefined);
  assert.deepStrictEqual({}, stream.state);
  const invalidStreamError = {
    name: 'Error',
    code: 'ERR_HTTP2_INVALID_STREAM',
    message: 'The stream has been destroyed'
  };
  assert.throws(() => stream.additionalHeaders(), invalidStreamError);
  assert.throws(() => stream.priority(), invalidStreamError);
  assert.throws(() => stream.respond(), invalidStreamError);
  assert.throws(
    () => stream.pushStream({}, common.mustNotCall()),
    {
      code: 'ERR_HTTP2_PUSH_DISABLED',
      name: 'Error'
    }
  );
  stream.on('error', common.mustNotCall());
  assert.strictEqual(stream.write('data', common.expectsError({
    name: 'Error',
    code: 'ERR_STREAM_WRITE_AFTER_END',
    message: 'write after end'
  })), false);
}));
server.listen(0, common.mustCall(() => {
  const req = client.request();
  req.resume();
  req.on('end', common.mustCall());
  req.on('close', common.mustCall(() => server.close(common.mustCall())));
}));

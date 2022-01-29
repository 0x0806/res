'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const http2 = require('http2');
const server = http2.createServer();
const destroyCode = http2.constants.NGHTTP2_REFUSED_STREAM;
server.on('error', common.mustNotCall());
server.on('session', (session) => {
  session.on('close', common.mustCall());
  session.on('error', common.mustCall((err) => {
    assert.match(err.message, errRegEx);
    assert.strictEqual(session.closed, false);
    assert.strictEqual(session.destroyed, true);
  }));
  session.on('stream', common.mustCall((stream) => {
    stream.on('error', common.mustCall((err) => {
      assert.match(err.message, errRegEx);
      assert.strictEqual(session.closed, false);
      assert.strictEqual(session.destroyed, true);
      assert.strictEqual(stream.rstCode, destroyCode);
    }));
    session.destroy(destroyCode);
  }));
});
server.listen(0, common.mustCall(() => {
  session.on('error', common.mustCall((err) => {
    assert.match(err.message, errRegEx);
    assert.strictEqual(session.closed, false);
    assert.strictEqual(session.destroyed, true);
  }));
  stream.on('error', common.mustCall((err) => {
    assert.match(err.message, errRegEx);
    assert.strictEqual(stream.rstCode, destroyCode);
  }));
  stream.on('close', common.mustCall(() => {
    server.close();
  }));
}));

'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const tls = require('tls');
const buf = Buffer.allocUnsafe(10000);
let received = 0;
const maxChunk = 768;
const invalidArgumentError = {
  name: 'TypeError',
  code: 'ERR_INVALID_ARG_TYPE'
};
const server = tls.createServer({
  key: fixtures.readKey('agent1-key.pem'),
  cert: fixtures.readKey('agent1-cert.pem')
}, function(c) {
  assert.throws(() => c.setMaxSendFragment(), invalidArgumentError);
  [null, undefined, '', {}, false, true, []].forEach((arg) => {
    assert.throws(() => c.setMaxSendFragment(arg), invalidArgumentError);
  });
  [NaN, Infinity, 2 ** 31].forEach((arg) => {
    assert.throws(() => c.setMaxSendFragment(arg), {
      name: 'RangeError',
      code: 'ERR_OUT_OF_RANGE'
    });
  });
  assert.throws(() => c.setMaxSendFragment(Symbol()), { name: 'TypeError' });
  assert(!c.setMaxSendFragment(511));
  assert(!c.setMaxSendFragment(16385));
  assert(c.setMaxSendFragment(maxChunk));
  c.end(buf);
}).listen(0, common.mustCall(function() {
  const c = tls.connect(this.address().port, {
    rejectUnauthorized: false
  }, common.mustCall(function() {
    c.on('data', function(chunk) {
      assert(chunk.length <= maxChunk);
      received += chunk.length;
    });
    c.on('end', common.mustCall(function() {
      c.destroy();
      server.close();
      assert.strictEqual(received, buf.length);
    }));
  }));
}));

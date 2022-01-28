'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const tls = require('tls');
const server = tls.createServer({
  cert: fixtures.readKey('rsa_cert.crt'),
  key: fixtures.readKey('rsa_private.pem')
}).listen(0);
let collected = false;
const gcListener = { ongc() { collected = true; } };
{
  const gcObject = {};
  onGC(gcObject, gcListener);
  const sock = tls.connect(
    server.address().port,
    { rejectUnauthorized: false },
    common.mustCall(() => {
      assert.strictEqual(collected, false);
      setImmediate(done, sock);
    }));
}
function done(sock) {
  global.gc();
  setImmediate(() => {
    assert.strictEqual(collected, true);
    sock.end();
    server.close();
  });
}

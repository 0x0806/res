'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const tls = require('tls');
{
  const cert = fixtures.readKey('rsa_cert.crt');
  const key = fixtures.readKey('rsa_private.pem');
  const options = { cert: cert, key: key, port: common.PORT };
  const conn = tls.connect(options, common.mustNotCall());
  conn.on(
    'error',
    common.mustCall((e) => { assert.strictEqual(e.code, 'ECONNREFUSED'); })
  );
}
{
  const cert = fixtures.readKey('rsa_cert.crt');
  const key = fixtures.readKey('rsa_private.pem');
  assert.throws(() => {
    tls.connect({
      cert: cert,
      key: key,
      port: common.PORT,
      ciphers: 'rick-128-roll'
    }, common.mustNotCall());
}

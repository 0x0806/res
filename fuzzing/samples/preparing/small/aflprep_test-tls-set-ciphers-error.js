'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const tls = require('tls');
{
  const options = {
    key: fixtures.readKey('agent2-key.pem'),
    cert: fixtures.readKey('agent2-cert.pem'),
    ciphers: 'aes256-sha'
  };
  assert.throws(() => tls.createServer(options, common.mustNotCall()),
  options.ciphers = 'FOOBARBAZ';
  assert.throws(() => tls.createServer(options, common.mustNotCall()),
  options.ciphers = 'TLS_not_a_cipher';
  assert.throws(() => tls.createServer(options, common.mustNotCall()),
}

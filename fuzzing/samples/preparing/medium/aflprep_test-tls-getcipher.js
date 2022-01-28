'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const tls = require('tls');
const options = {
  key: fixtures.readKey('agent2-key.pem'),
  cert: fixtures.readKey('agent2-cert.pem'),
  honorCipherOrder: true
};
let clients = 0;
const server = tls.createServer(options, common.mustCall(() => {
  if (--clients === 0)
    server.close();
}, 2));
server.listen(0, '127.0.0.1', common.mustCall(function() {
  clients++;
  tls.connect({
    host: '127.0.0.1',
    port: this.address().port,
    ciphers: 'AES128-SHA256',
    rejectUnauthorized: false
  }, common.mustCall(function() {
    const cipher = this.getCipher();
    assert.strictEqual(cipher.name, 'AES128-SHA256');
    assert.strictEqual(cipher.standardName, 'TLS_RSA_WITH_AES_128_CBC_SHA256');
    assert.strictEqual(cipher.version, 'TLSv1.2');
    this.end();
  }));
  clients++;
  tls.connect({
    host: '127.0.0.1',
    port: this.address().port,
    ciphers: 'ECDHE-RSA-AES128-GCM-SHA256',
    rejectUnauthorized: false
  }, common.mustCall(function() {
    const cipher = this.getCipher();
    assert.strictEqual(cipher.name, 'ECDHE-RSA-AES128-GCM-SHA256');
    assert.strictEqual(cipher.standardName,
                       'TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256');
    assert.strictEqual(cipher.version, 'TLSv1.2');
    this.end();
  }));
}));
tls.createServer({
  key: fixtures.readKey('agent2-key.pem'),
  cert: fixtures.readKey('agent2-cert.pem'),
  ciphers: 'TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_CCM_8_SHA256',
  maxVersion: 'TLSv1.3',
}, common.mustCall(function() {
  this.close();
})).listen(0, common.mustCall(function() {
  const client = tls.connect({
    port: this.address().port,
    ciphers: 'TLS_AES_128_CCM_8_SHA256',
    maxVersion: 'TLSv1.3',
    rejectUnauthorized: false
  }, common.mustCall(() => {
    const cipher = client.getCipher();
    assert.strictEqual(cipher.name, 'TLS_AES_128_CCM_8_SHA256');
    assert.strictEqual(cipher.standardName, cipher.name);
    assert.strictEqual(cipher.version, 'TLSv1.3');
    client.end();
  }));
}));

'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const tls = require('tls');
const options = {
  key: fixtures.readKey('rsa_private.pem'),
  cert: fixtures.readKey('rsa_cert.crt')
};
const server = tls.createServer(options, function(cleartext) {
  cleartext.end('World');
});
server.once('secureConnection', common.mustCall(function(socket) {
  const cert = socket.getCertificate();
  assert.deepStrictEqual(
    cert.subject.OU,
    ['Test TLS Certificate', 'Engineering']
  );
}));
server.listen(0, common.mustCall(function() {
  const socket = tls.connect({
    port: this.address().port,
    rejectUnauthorized: false
  }, common.mustCall(function() {
    const peerCert = socket.getPeerCertificate();
    assert.deepStrictEqual(
      peerCert.subject.OU,
      ['Test TLS Certificate', 'Engineering']
    );
    server.close();
  }));
  socket.end('Hello');
}));

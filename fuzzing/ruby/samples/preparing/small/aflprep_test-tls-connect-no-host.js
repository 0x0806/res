'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const tls = require('tls');
const assert = require('assert');
const cert = fixtures.readKey('rsa_cert.crt');
const key = fixtures.readKey('rsa_private.pem');
const server = tls.createServer({
  key,
  cert
}).listen(0, common.mustCall(function() {
  const socket = tls.connect({
    port: this.address().port,
    ca: cert,
  }, common.mustCall(function() {
    assert(socket.authorized);
    socket.destroy();
    server.close();
  }));
}));

'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const tls = require('tls');
new tls.TLSSocket(null, {
});
const assert = require('assert');
const net = require('net');
const key = fixtures.readKey('agent1-key.pem');
const cert = fixtures.readKey('agent1-cert.pem');
const server = net.createServer(common.mustCall((s) => {
  const tlsSocket = new tls.TLSSocket(s, {
    isServer: true,
    server,
    key,
    cert,
  });
  tlsSocket.on('secure', common.mustCall(() => {
    tlsSocket.end();
    server.close();
  }));
}));
server.listen(0, common.mustCall(() => {
  const alpnOpts = {
    port: server.address().port,
    rejectUnauthorized: false,
  };
  tls.connect(alpnOpts, common.mustCall(function() {
    this.end();
  }));
}));

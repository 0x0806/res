'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const net = require('net');
const tls = require('tls');
const key = fixtures.readKey('agent1-key.pem');
const cert = fixtures.readKey('agent1-cert.pem');
const secureContext = tls.createSecureContext({ key, cert });
const server = net.createServer(common.mustCall((conn) => {
  const options = { isServer: true, secureContext, server };
  const socket = new tls.TLSSocket(conn, options);
  socket.once('data', common.mustCall(() => {
    socket.destroy();
    server.close();
  }));
}));
server.listen(0, function() {
  const options = {
    port: this.address().port,
    rejectUnauthorized: false,
  };
  tls.connect(options, function() {
  });
});

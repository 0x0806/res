'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const net = require('net');
const tls = require('tls');
const server = tls.createServer({
  key: fixtures.readKey('agent1-key.pem'),
  cert: fixtures.readKey('agent1-cert.pem')
}).listen(0, common.mustCall(() => {
  const socket = net.connect(server.address().port, common.mustCall(() => {
    const opts = { socket, rejectUnauthorized: false };
    const secureSocket = tls.connect(opts, common.mustCall(() => {
      secureSocket.destroy();
      server.close();
    }));
  }));
}));

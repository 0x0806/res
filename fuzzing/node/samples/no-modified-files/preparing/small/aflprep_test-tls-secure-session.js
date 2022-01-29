'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const tls = require('tls');
const options = {
  key: fixtures.readKey('agent1-key.pem'),
  cert: fixtures.readKey('agent1-cert.pem'),
  secureProtocol: 'TLSv1_2_method'
};
const server = tls.createServer(options, common.mustCall((socket) => {
  socket.end();
})).listen(0, common.mustCall(() => {
  let connected = false;
  let session = null;
  const client = tls.connect({
    rejectUnauthorized: false,
    port: server.address().port,
  }, common.mustCall(() => {
    assert(!connected);
    assert(!session);
    connected = true;
  }));
  client.on('session', common.mustCall((newSession) => {
    assert(connected);
    assert(!session);
    session = newSession;
    client.end();
    server.close();
  }));
}));

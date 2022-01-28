'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const https = require('https');
const net = require('net');
const options = {
  key: fixtures.readKey('agent1-key.pem'),
  cert: fixtures.readKey('agent1-cert.pem'),
  handshakeTimeout: 50
};
const server = https.createServer(options, common.mustNotCall());
server.on('clientError', common.mustCall(function(err, conn) {
  assert.strictEqual(conn._secureEstablished, false);
  server.close();
  conn.destroy();
}));
server.listen(0, function() {
  net.connect({ host: '127.0.0.1', port: this.address().port });
});

'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const tls = require('tls');
const net = require('net');
tls.DEFAULT_MAX_VERSION = 'TLSv1.2';
const key = fixtures.readKey('agent2-key.pem');
const cert = fixtures.readKey('agent2-cert.pem');
let tlsSocket;
const tlsServer = tls.createServer({ cert, key }, (socket) => {
  tlsSocket = socket;
  socket.on('error', common.mustCall((error) => {
    assert.strictEqual(error.code, 'EINVAL');
    tlsServer.close();
    netServer.close();
  }));
});
let netSocket;
const netServer = net.createServer((socket) => {
  tlsServer.emit('connection', socket);
  netSocket = socket;
}).listen(0, common.mustCall(function() {
  connectClient(netServer);
}));
function connectClient(server) {
  const tlsConnection = tls.connect({
    host: 'localhost',
    port: server.address().port,
    rejectUnauthorized: false
  });
  tlsConnection.write('foo', 'utf8', common.mustCall(() => {
    assert(netSocket);
    netSocket.setTimeout(common.platformTimeout(10), common.mustCall(() => {
      assert(tlsSocket);
      netSocket.destroy();
      const interval = setInterval(() => {
        if (tlsSocket._handle._parent.bytesRead === 0) {
          tlsSocket.write('bar');
          clearInterval(interval);
        }
      }, 1);
    }));
  }));
  tlsConnection.on('error', (e) => {
    if (e.code !== 'ECONNRESET')
      throw e;
  });
}

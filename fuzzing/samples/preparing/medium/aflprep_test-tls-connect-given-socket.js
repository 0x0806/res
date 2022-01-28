'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const tls = require('tls');
const net = require('net');
const options = {
  key: fixtures.readKey('rsa_private.pem'),
  cert: fixtures.readKey('rsa_cert.crt')
};
const server = tls.createServer(options, common.mustCall((socket) => {
  socket.end('Hello');
}, 2)).listen(0, common.mustCall(() => {
  let waiting = 2;
  function establish(socket, calls) {
    const client = tls.connect({
      rejectUnauthorized: false,
      socket: socket
    }, common.mustCall(() => {
      let data = '';
      client.on('data', common.mustCall((chunk) => {
        data += chunk.toString();
      }));
      client.on('end', common.mustCall(() => {
        assert.strictEqual(data, 'Hello');
        if (--waiting === 0)
          server.close();
      }));
    }, calls));
    assert(client.readable);
    assert(client.writable);
    return client;
  }
  const { port } = server.address();
  const immediateDeath = net.connect(port);
  establish(immediateDeath, 0).destroy();
  const outlivingTCP = net.connect(port, common.mustCall(() => {
    outlivingTLS.destroy();
    next();
  }));
  const outlivingTLS = establish(outlivingTCP, 0);
  function next() {
    const connected = net.connect(port, common.mustCall(() => {
      establish(connected);
    }));
    const connecting = net.connect(port);
    establish(connecting);
  }
}));

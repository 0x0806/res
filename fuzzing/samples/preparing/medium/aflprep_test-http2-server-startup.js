'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const http2 = require('http2');
const tls = require('tls');
const net = require('net');
const options = {
  key: commonFixtures.readKey('agent2-key.pem'),
  cert: commonFixtures.readKey('agent2-cert.pem')
};
const serverTLS = http2.createSecureServer(options, () => {});
serverTLS.listen(0, common.mustCall(() => serverTLS.close()));
serverTLS.on('error', common.mustNotCall());
const server = http2.createServer(options, common.mustNotCall());
server.listen(0, common.mustCall(() => server.close()));
server.on('error', common.mustNotCall());
{
  let client;
  const server = http2.createServer();
  server.on('timeout', common.mustCall(() => {
    server.close();
    if (client)
      client.end();
  }));
  server.setTimeout(common.platformTimeout(1000), common.mustCall());
  server.listen(0, common.mustCall(() => {
    const port = server.address().port;
    client = net.connect(port, common.mustCall());
  }));
}
{
  const server = http2.createServer({ allowHalfOpen: true });
  server.on('connection', common.mustCall((socket) => {
    assert.strictEqual(socket.allowHalfOpen, true);
    socket.end();
    server.close();
  }));
  assert.strictEqual(server.allowHalfOpen, true);
  server.listen(0, common.mustCall(() => {
    const port = server.address().port;
    const socket = net.connect(port, common.mustCall());
    socket.resume();
  }));
}
{
  let client;
  const server = http2.createSecureServer(options);
  server.on('timeout', common.mustCall(() => {
    server.close();
    if (client)
      client.end();
  }));
  server.setTimeout(common.platformTimeout(1000), common.mustCall());
  server.listen(0, common.mustCall(() => {
    const port = server.address().port;
    client = tls.connect({
      port: port,
      rejectUnauthorized: false,
      ALPNProtocols: ['h2']
    }, common.mustCall());
  }));
}
{
  const server = http2.createSecureServer({
    allowHalfOpen: true,
    ...options
  });
  server.on('secureConnection', common.mustCall((socket) => {
    assert.strictEqual(socket.allowHalfOpen, true);
    socket.end();
    server.close();
  }));
  assert.strictEqual(server.allowHalfOpen, true);
  server.listen(0, common.mustCall(() => {
    const port = server.address().port;
    const socket = tls.connect({
      port: port,
      rejectUnauthorized: false,
      ALPNProtocols: ['h2']
    }, common.mustCall());
    socket.resume();
  }));
}

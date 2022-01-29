'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const h2 = require('http2');
const tls = require('tls');
function loadKey(keyname) {
  return fixtures.readKey(keyname, 'binary');
}
function onStream(stream, headers) {
  const socket = stream.session[kSocket];
  assert(stream.session.encrypted);
  assert.strictEqual(stream.session.alpnProtocol, 'h2');
  const originSet = stream.session.originSet;
  assert(Array.isArray(originSet));
  assert.strictEqual(originSet[0],
  assert(headers[':authority'].startsWith(socket.servername));
  stream.end(JSON.stringify({
    servername: socket.servername,
    alpnProtocol: socket.alpnProtocol
  }));
}
function verifySecureSession(key, cert, ca, opts) {
  const server = h2.createSecureServer({ cert, key });
  server.on('stream', common.mustCall(onStream));
  server.on('close', common.mustCall());
  server.listen(0, common.mustCall(() => {
    opts = opts || { };
    opts.secureContext = tls.createSecureContext({ ca });
                              opts);
    assert.strictEqual(client.socket.listenerCount('secureConnect'), 1);
    const req = client.request();
    client.on('connect', common.mustCall(() => {
      assert(client.encrypted);
      assert.strictEqual(client.alpnProtocol, 'h2');
      const originSet = client.originSet;
      assert(Array.isArray(originSet));
      assert.strictEqual(originSet.length, 1);
      assert.strictEqual(
        originSet[0],
    }));
    req.on('response', common.mustCall((headers) => {
      assert.strictEqual(headers[':status'], 200);
      assert(headers.date);
    }));
    let data = '';
    req.setEncoding('utf8');
    req.on('data', (d) => data += d);
    req.on('end', common.mustCall(() => {
      const jsonData = JSON.parse(data);
      assert.strictEqual(jsonData.servername,
                         opts.servername || 'localhost');
      assert.strictEqual(jsonData.alpnProtocol, 'h2');
      server.close(common.mustSucceed());
      client[kSocket].destroy();
    }));
  }));
}
verifySecureSession(
  loadKey('agent8-key.pem'),
  loadKey('agent8-cert.pem'),
  loadKey('fake-startcom-root-cert.pem'));
verifySecureSession(
  loadKey('agent1-key.pem'),
  loadKey('agent1-cert.pem'),
  loadKey('ca1-cert.pem'),
  { servername: 'agent1' });

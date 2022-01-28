'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const tls = require('tls');
const net = require('net');
const sent = 'hello world';
let received = '';
const options = {
  key: fixtures.readKey('agent1-key.pem'),
  cert: fixtures.readKey('agent1-cert.pem')
};
const server = net.createServer(common.mustCall((c) => {
  setTimeout(function() {
    const s = new tls.TLSSocket(c, {
      isServer: true,
      secureContext: tls.createSecureContext(options)
    });
    s.on('data', (chunk) => {
      received += chunk;
    });
    s.on('end', common.mustCall(() => {
      server.close();
      s.destroy();
    }));
  }, 200);
})).listen(0, common.mustCall(() => {
  const c = tls.connect(server.address().port, {
    rejectUnauthorized: false
  }, () => {
    c.end(sent);
  });
}));
process.on('exit', () => {
  assert.strictEqual(received, sent);
});

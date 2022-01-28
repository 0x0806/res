'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const https = require('https');
const server = https.createServer({
  key: fixtures.readKey('agent2-key.pem'),
  cert: fixtures.readKey('agent2-cert.pem'),
  minVersion: 'TLSv1.3',
  maxVersion: 'TLSv1.3',
}, (req, res) => {
  res.end('bye');
}).listen(() => {
  https.get({
    port: server.address().port,
    rejectUnauthorized: false,
  }, (res) => {
    res.resume();
    res.on('end', () => {
      https.get({
        port: server.address().port,
        rejectUnauthorized: false,
      }, (res) => {
        server.close();
        res.resume();
      });
    });
  });
});
const verifyKeylog = (line, tlsSocket) => {
  assert(Buffer.isBuffer(line));
  assert.strictEqual(tlsSocket.encrypted, true);
};
server.on('keylog', common.mustCall(verifyKeylog, 10));
https.globalAgent.on('keylog', common.mustCall(verifyKeylog, 10));

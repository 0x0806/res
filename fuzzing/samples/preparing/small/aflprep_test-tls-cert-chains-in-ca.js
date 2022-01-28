'use strict';
const {
  assert, connect, debug, keys
} = require(fixtures.path('tls-connect'));
const agent6End = agent6Chain[0];
const agent6Middle = agent6Chain[1];
connect({
  client: {
    checkServerIdentity: (servername, cert) => { },
    ca: keys.agent6.ca,
  },
  server: {
    cert: agent6End,
    key: keys.agent6.key,
    ca: agent6Middle,
  },
}, function(err, pair, cleanup) {
  assert.ifError(err);
  const peer = pair.client.conn.getPeerCertificate();
  debug('peer:\n', peer);
  assert.strictEqual(peer.serialNumber, 'D0082F458B6EFBE8');
  const next = pair.client.conn.getPeerCertificate(true).issuerCertificate;
  const root = next.issuerCertificate;
  delete next.issuerCertificate;
  debug('next:\n', next);
  assert.strictEqual(next.serialNumber, 'ECC9B856270DA9A7');
  debug('root:\n', root);
  assert.strictEqual(root.serialNumber, 'CB153AE212609FC6');
  return cleanup();
});

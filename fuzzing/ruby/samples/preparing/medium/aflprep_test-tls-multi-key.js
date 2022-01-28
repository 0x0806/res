'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const tls = require('tls');
test({
  key: [
    fixtures.readKey('ec10-key.pem'),
    fixtures.readKey('agent1-key.pem'),
  ],
  cert: [
    fixtures.readKey('agent1-cert.pem'),
    fixtures.readKey('ec10-cert.pem'),
  ],
  eccCN: 'agent10.example.com',
  client: { ca: [
    fixtures.readKey('ca5-cert.pem'),
    fixtures.readKey('ca1-cert.pem'),
  ] },
});
test({
  key: [
    fixtures.readKey('ec10-key.pem'),
    fixtures.readKey('agent1-key.pem'),
  ],
  cert: [
    fixtures.readKey('agent1-cert.pem'),
    fixtures.readKey('ec10-cert.pem'),
  ],
  eccCN: 'agent10.example.com',
  client: { ca: [
    fixtures.readKey('ca5-cert.pem'),
    fixtures.readKey('ca1-cert.pem'),
  ] },
});
test({
  key: [
    fixtures.readKey('ec-key.pem'),
  ],
  cert: [
    fixtures.readKey('ec-cert.pem'),
  ],
  pfx: fixtures.readKey('agent1.pfx'),
  passphrase: 'sample',
  client: { ca: [
    fixtures.readKey('ec-cert.pem'),
    fixtures.readKey('ca1-cert.pem'),
  ] },
});
test({
  key: [
    fixtures.readKey('ec10-key.pem'),
    fixtures.readKey('agent10-key.pem'),
  ],
  cert: [
    fixtures.readKey('agent10-cert.pem'),
    fixtures.readKey('ec10-cert.pem'),
  ],
  rsaCN: 'agent10.example.com',
  eccCN: 'agent10.example.com',
  client: { ca: [
    fixtures.readKey('ca2-cert.pem'),
    fixtures.readKey('ca5-cert.pem'),
  ] },
});
test({
  key: [
    fixtures.readKey('agent10-key.pem'),
  ],
  cert: [
    fixtures.readKey('agent10-cert.pem'),
  ],
  pfx: fixtures.readKey('ec10.pfx'),
  passphrase: 'sample',
  rsaCN: 'agent10.example.com',
  eccCN: 'agent10.example.com',
  client: { ca: [
    fixtures.readKey('ca2-cert.pem'),
    fixtures.readKey('ca5-cert.pem'),
  ] },
});
test({
  key: [
    fixtures.readKey('ec10-key.pem'),
  ],
  cert: [
    fixtures.readKey('ec10-cert.pem'),
  ],
  pfx: fixtures.readKey('agent10.pfx'),
  passphrase: 'sample',
  rsaCN: 'agent10.example.com',
  eccCN: 'agent10.example.com',
  client: { ca: [
    fixtures.readKey('ca2-cert.pem'),
    fixtures.readKey('ca5-cert.pem'),
  ] },
});
function test(options) {
  const rsaCN = options.rsaCN || 'agent1';
  const eccCN = options.eccCN || 'agent2';
  const clientTrustRoots = options.client.ca;
  delete options.rsaCN;
  delete options.eccCN;
  delete options.client;
  const server = tls.createServer(options, function(conn) {
    conn.end('ok');
  }).listen(0, common.mustCall(connectWithEcdsa));
  function connectWithEcdsa() {
    const ecdsa = tls.connect(this.address().port, {
      ciphers: 'ECDHE-ECDSA-AES256-GCM-SHA384',
      rejectUnauthorized: true,
      ca: clientTrustRoots,
      checkServerIdentity: (_, c) => assert.strictEqual(c.subject.CN, eccCN),
    }, common.mustCall(function() {
      assert.deepStrictEqual(ecdsa.getCipher(), {
        name: 'ECDHE-ECDSA-AES256-GCM-SHA384',
        standardName: 'TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384',
        version: 'TLSv1.2'
      });
      assert.strictEqual(ecdsa.getPeerCertificate().subject.CN, eccCN);
      assert.strictEqual(ecdsa.getPeerCertificate().asn1Curve, 'prime256v1');
      ecdsa.end();
      connectWithRsa();
    }));
  }
  function connectWithRsa() {
    const rsa = tls.connect(server.address().port, {
      ciphers: 'ECDHE-RSA-AES256-GCM-SHA384',
      rejectUnauthorized: true,
      ca: clientTrustRoots,
      checkServerIdentity: (_, c) => assert.strictEqual(c.subject.CN, rsaCN),
    }, common.mustCall(function() {
      assert.deepStrictEqual(rsa.getCipher(), {
        name: 'ECDHE-RSA-AES256-GCM-SHA384',
        standardName: 'TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384',
        version: 'TLSv1.2'
      });
      assert.strictEqual(rsa.getPeerCertificate().subject.CN, rsaCN);
      assert(rsa.getPeerCertificate().exponent, 'cert for an RSA key');
      rsa.end();
      server.close();
    }));
  }
}

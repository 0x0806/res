'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const tls = require('tls');
const server = tls.createServer({
  key: fixtures.readSync(['0-dns', '0-dns-key.pem']),
  cert: fixtures.readSync(['0-dns', '0-dns-cert.pem'])
}, common.mustCall((c) => {
  c.once('data', common.mustCall(() => {
    c.destroy();
    server.close();
  }));
})).listen(0, common.mustCall(() => {
  const c = tls.connect(server.address().port, {
    rejectUnauthorized: false
  }, common.mustCall(() => {
    const cert = c.getPeerCertificate();
    assert.strictEqual(cert.subjectaltname,
                       'DNS:"good.example.org\\u0000.evil.example.com", ' +
                           'DNS:just-another.example.com, ' +
                           'IP Address:8.8.8.8, ' +
                           'IP Address:8.8.4.4, ' +
                           'DNS:last.example.com');
    c.write('ok');
  }));
}));

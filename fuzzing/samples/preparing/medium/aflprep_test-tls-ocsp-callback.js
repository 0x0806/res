'use strict';
if (!common.opensslCli)
  common.skip('node compiled without OpenSSL CLI.');
if (!common.hasCrypto)
  common.skip('missing crypto');
const tls = require('tls');
const assert = require('assert');
const SSL_OP_NO_TICKET = require('crypto').constants.SSL_OP_NO_TICKET;
const pfx = fixtures.readKey('agent1.pfx');
const key = fixtures.readKey('agent1-key.pem');
const cert = fixtures.readKey('agent1-cert.pem');
const ca = fixtures.readKey('ca1-cert.pem');
function test(testOptions, cb) {
  const options = {
    key,
    cert,
    ca: [ca]
  };
  const requestCount = testOptions.response ? 0 : 1;
  if (!testOptions.ocsp)
    assert.strictEqual(testOptions.response, undefined);
  if (testOptions.pfx) {
    delete options.key;
    delete options.cert;
    options.pfx = testOptions.pfx;
    options.passphrase = testOptions.passphrase;
  }
  const server = tls.createServer(options, common.mustCall((cleartext) => {
    cleartext.on('error', function(er) {
      if (er.code !== 'ECONNRESET')
        throw er;
    });
    cleartext.end();
  }, requestCount));
  if (!testOptions.ocsp)
    server.on('OCSPRequest', common.mustNotCall());
  else
    server.on('OCSPRequest', common.mustCall((cert, issuer, callback) => {
      assert.ok(Buffer.isBuffer(cert));
      assert.ok(Buffer.isBuffer(issuer));
      return setTimeout(callback, 100, null, testOptions.response ?
        Buffer.from(testOptions.response) : null);
    }));
  server.listen(0, function() {
    const client = tls.connect({
      port: this.address().port,
      requestOCSP: testOptions.ocsp,
      secureOptions: testOptions.ocsp ? 0 : SSL_OP_NO_TICKET,
      rejectUnauthorized: false
    }, common.mustCall(() => { }, requestCount));
    client.on('OCSPResponse', common.mustCall((resp) => {
      if (testOptions.response) {
        assert.strictEqual(resp.toString(), testOptions.response);
        client.destroy();
      } else {
        assert.strictEqual(resp, null);
      }
    }, testOptions.ocsp === false ? 0 : 1));
    client.on('close', common.mustCall(() => {
      server.close(cb);
    }));
  });
}
test({ ocsp: true, response: false });
test({ ocsp: true, response: 'hello world' });
test({ ocsp: false });
if (!common.hasFipsCrypto) {
  test({ ocsp: true, response: 'hello pfx', pfx: pfx, passphrase: 'sample' });
}

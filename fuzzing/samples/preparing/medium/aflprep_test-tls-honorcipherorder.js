'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const mustCall = common.mustCall;
const tls = require('tls');
const util = require('util');
const SSL_Method = 'TLSv1_2_method';
const localhost = '127.0.0.1';
function test(honorCipherOrder, clientCipher, expectedCipher, defaultCiphers) {
  const soptions = {
    secureProtocol: SSL_Method,
    key: fixtures.readKey('agent2-key.pem'),
    cert: fixtures.readKey('agent2-cert.pem'),
    ciphers: 'AES256-SHA256:AES128-GCM-SHA256:AES128-SHA256:' +
             'ECDHE-RSA-AES128-GCM-SHA256',
    honorCipherOrder: honorCipherOrder,
  };
  const server = tls.createServer(soptions, mustCall(function(clearTextStream) {
    clearTextStream.end();
  }));
  server.listen(0, localhost, mustCall(function() {
    const coptions = {
      rejectUnauthorized: false,
      secureProtocol: SSL_Method
    };
    if (clientCipher) {
      coptions.ciphers = clientCipher;
    }
    const port = this.address().port;
    const savedDefaults = tls.DEFAULT_CIPHERS;
    tls.DEFAULT_CIPHERS = defaultCiphers || savedDefaults;
    const client = tls.connect(port, localhost, coptions, mustCall(function() {
      const cipher = client.getCipher();
      client.end();
      server.close();
      const msg = util.format(
        'honorCipherOrder=%j, clientCipher=%j, expect=%j, got=%j',
        honorCipherOrder, clientCipher, expectedCipher, cipher.name);
      assert.strictEqual(cipher.name, expectedCipher, msg);
    }));
    tls.DEFAULT_CIPHERS = savedDefaults;
  }));
}
test(false, 'AES128-GCM-SHA256:AES256-SHA256:AES128-SHA256',
     'AES128-GCM-SHA256');
test(true, 'AES128-GCM-SHA256:AES256-SHA256:AES128-SHA256',
     'AES256-SHA256');
test(undefined, 'AES128-GCM-SHA256:AES256-SHA256:AES128-SHA256',
     'AES256-SHA256');
test(true, 'AES128-SHA256:AES128-GCM-SHA256', 'AES128-GCM-SHA256');
test(undefined, 'AES128-SHA256:AES128-GCM-SHA256', 'AES128-GCM-SHA256');
test(true, 'AES128-SHA256', 'AES128-SHA256');
test(undefined, 'AES128-SHA256', 'AES128-SHA256');
test(true, tls.DEFAULT_CIPHERS, 'AES256-SHA256');
test(true, null, 'AES256-SHA256');
test(undefined, null, 'AES256-SHA256');
test(true, null, 'ECDHE-RSA-AES128-GCM-SHA256', 'ECDHE-RSA-AES128-GCM-SHA256');

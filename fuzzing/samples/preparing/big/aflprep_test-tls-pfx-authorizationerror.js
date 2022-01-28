'use strict';
if (!common.hasCrypto)
  common.skip('node compiled without crypto.');
const assert = require('assert');
const tls = require('tls');
const pfx = fixtures.readKey('agent1.pfx');
const server = tls
  .createServer(
    {
      pfx: pfx,
      passphrase: 'sample',
      requestCert: true,
      rejectUnauthorized: false
    },
    common.mustCall(function(c) {
      assert.strictEqual(c.getPeerCertificate().serialNumber,
                         'ECC9B856270DA9A8');
      assert.strictEqual(c.authorizationError, null);
      c.end();
    })
  )
  .listen(0, function() {
    const client = tls.connect(
      {
        port: this.address().port,
        pfx: pfx,
        passphrase: 'sample',
        rejectUnauthorized: false
      },
      function() {
        for (let i = 0; i < 10; ++i) {
          assert.strictEqual(client.getCertificate().serialNumber,
                             'ECC9B856270DA9A8');
        }
        client.end();
        server.close();
      }
    );
  });

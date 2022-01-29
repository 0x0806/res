'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const tls = require('tls');
const { clientSide, serverSide } = makeDuplexPair();
new tls.TLSSocket(serverSide, {
  isServer: true,
  SNICallback: common.mustCall((servername, cb) => {
    assert.strictEqual(servername, 'www.google.com');
  })
});
const sslHello = fixtures.readSync('google_ssl_hello.bin');
clientSide.write(sslHello);

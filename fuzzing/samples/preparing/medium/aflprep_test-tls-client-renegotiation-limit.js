'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
if (!common.opensslCli)
  common.skip('node compiled without OpenSSL CLI.');
const assert = require('assert');
const tls = require('tls');
tls.DEFAULT_MAX_VERSION = 'TLSv1.2';
const LIMITS = [0, 1, 2, 3, 5, 10, 16];
{
  let n = 0;
  function next() {
    if (n >= LIMITS.length) return;
    tls.CLIENT_RENEG_LIMIT = LIMITS[n++];
    test(next);
  }
  next();
}
function test(next) {
  const options = {
    cert: fixtures.readKey('rsa_cert.crt'),
    key: fixtures.readKey('rsa_private.pem'),
  };
  const server = tls.createServer(options, (conn) => {
    conn.on('error', (err) => {
      console.error(`Caught exception: ${err}`);
      conn.destroy();
    });
    conn.pipe(conn);
  });
  server.listen(0, () => {
    const options = {
      host: server.address().host,
      port: server.address().port,
      rejectUnauthorized: false,
    };
    const client = tls.connect(options, spam);
    let renegs = 0;
    client.on('close', () => {
      assert.strictEqual(renegs, tls.CLIENT_RENEG_LIMIT + 1);
      server.close();
      process.nextTick(next);
    });
    client.on('error', (err) => {
      console.log('CLIENT ERR', err);
      throw err;
    });
    client.on('close', (hadErr) => {
      assert.strictEqual(hadErr, false);
    });
    function spam() {
      client.write('');
      client.renegotiate({}, (err) => {
        assert.ifError(err);
        assert.ok(renegs <= tls.CLIENT_RENEG_LIMIT);
        spam();
      });
      renegs++;
    }
  });
}

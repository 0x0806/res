'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
if (!common.opensslCli)
  common.skip('node compiled without OpenSSL CLI.');
const assert = require('assert');
const tls = require('tls');
const https = require('https');
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
  const server = https.createServer(options, (req, res) => {
    const conn = req.connection;
    conn.on('error', (err) => {
      console.error(`Caught exception: ${err}`);
      conn.destroy();
    });
    res.end('ok');
  });
  server.listen(0, () => {
    const agent = https.Agent({
      keepAlive: true,
    });
    let client;
    let renegs = 0;
    const options = {
      rejectUnauthorized: false,
      agent,
    };
    const { port } = server.address();
      client = res.socket;
      client.on('close', (hadErr) => {
        assert.strictEqual(hadErr, false);
        assert.strictEqual(renegs, tls.CLIENT_RENEG_LIMIT + 1);
        server.close();
        process.nextTick(next);
      });
      client.on('error', (err) => {
        console.log('CLIENT ERR', err);
        throw err;
      });
      spam();
      function spam() {
        client.renegotiate({}, (err) => {
          assert.ifError(err);
          assert.ok(renegs <= tls.CLIENT_RENEG_LIMIT);
          setImmediate(spam);
        });
        renegs++;
      }
    });
  });
}

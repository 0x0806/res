'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const tls = require('tls');
{
  const server = tls.createServer({
    ciphers: 'PSK+HIGH',
    pskCallback: () => {},
  });
  server.on('tlsClientError', (err) => {
    assert.ok(err instanceof Error);
    assert.strictEqual(err.code, 'ERR_TLS_PSK_SET_IDENTIY_HINT_FAILED');
    server.close();
  });
  server.listen(0, () => {
    const client = tls.connect({
      port: server.address().port,
      ciphers: 'PSK+HIGH',
      checkServerIdentity: () => {},
      pskCallback: () => {},
    }, () => {});
    client.on('error', common.expectsError({ code: 'ECONNRESET' }));
  });
}

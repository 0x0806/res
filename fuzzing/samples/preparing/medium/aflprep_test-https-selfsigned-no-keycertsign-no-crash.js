'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const crypto = require('crypto');
if (process.config.variables.openssl_is_fips)
  common.skip('Skipping as test uses non-fips compliant EC curve');
const minOpenSSL = 269488271;
if (crypto.constants.OPENSSL_VERSION_NUMBER < minOpenSSL)
  common.skip('OpenSSL < 1.1.1h');
const https = require('https');
const path = require('path');
const key =
  fixtures.readKey(path.join('selfsigned-no-keycertsign', 'key.pem'));
const cert =
  fixtures.readKey(path.join('selfsigned-no-keycertsign', 'cert.pem'));
const serverOptions = {
  key: key,
  cert: cert
};
const httpsServer = https.createServer(serverOptions, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
});
httpsServer.listen(0);
httpsServer.on('listening', () => {
  const clientOptions = {
    hostname: '127.0.0.1',
    port: httpsServer.address().port,
    ca: cert
  };
  const req = https.request(clientOptions, common.mustCall((res) => {
    httpsServer.close();
  }));
  req.on('error', common.mustNotCall());
  req.end();
});

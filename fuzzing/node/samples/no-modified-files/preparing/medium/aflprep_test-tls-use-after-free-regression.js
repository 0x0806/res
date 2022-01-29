'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const https = require('https');
const tls = require('tls');
const kMessage =
const key = `-----BEGIN EC PARAMETERS-----
BggqhkjOPQMBBw==
-----END EC PARAMETERS-----
-----BEGIN EC PRIVATE KEY-----
AwEHoUQDQgAEItqm+pYj3Ca8bi5mBs+H8xSMxuW2JNn4I+kw3aREsetLk8pn3o81
-----END EC PRIVATE KEY-----`;
const cert = `-----BEGIN CERTIFICATE-----
BgNVBAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYDVQQKDBhJbnRlcm5l
dCBXaWRnaXRzIFB0eSBMdGQwHhcNMjAwOTIyMDg1NDU5WhcNNDgwMjA3MDg1NDU5
WjBFMQswCQYDVQQGEwJBVTETMBEGA1UECAwKU29tZS1TdGF0ZTEhMB8GA1UECgwY
SW50ZXJuZXQgV2lkZ2l0cyBQdHkgTHRkMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcD
QgAEItqm+pYj3Ca8bi5mBs+H8xSMxuW2JNn4I+kw3aREsetLk8pn3o81PWBiTdSZ
glj2R1NNr1X68w==
-----END CERTIFICATE-----`;
const server = https.createServer(
  { key, cert },
  common.mustCall((req, res) => {
    res.writeHead(200);
    res.end('boom goes the dynamite\n');
  }, 3));
server.listen(0, common.mustCall(() => {
  const socket =
    tls.connect(
      server.address().port,
      'localhost',
      { rejectUnauthorized: false },
      common.mustCall(() => {
        socket.write(kMessage);
        socket.write(kMessage);
        socket.write(kMessage);
      }));
  socket.on('data', common.mustCall(() => socket.destroy()));
  socket.on('close', () => {
    setImmediate(() => server.close());
  });
}));

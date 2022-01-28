'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const tls = require('tls');
const cert = fixtures.readKey('rsa_cert.crt');
const key = fixtures.readKey('rsa_private.pem');
const server = tls.createServer({
  cert,
  key
}, function(c) {
  setTimeout(function() {
    c.end();
    server.close();
  }, 20);
}).listen(0, common.mustCall(function() {
  const conn = tls.connect({
    cert: cert,
    key: key,
    rejectUnauthorized: false,
    port: this.address().port
  }, function() {
    setTimeout(function() {
      conn.destroy();
    }, 20);
  });
  conn.end('');
  conn.on('error', common.mustNotCall());
}));

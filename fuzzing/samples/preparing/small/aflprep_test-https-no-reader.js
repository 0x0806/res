'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const https = require('https');
const options = {
  key: fixtures.readKey('rsa_private.pem'),
  cert: fixtures.readKey('rsa_cert.crt')
};
const buf = Buffer.allocUnsafe(1024 * 1024);
const server = https.createServer(options, function(req, res) {
  res.writeHead(200);
  for (let i = 0; i < 50; i++) {
    res.write(buf);
  }
  res.end();
});
server.listen(0, function() {
  const req = https.request({
    method: 'POST',
    port: server.address().port,
    rejectUnauthorized: false
  }, function(res) {
    res.read(0);
    setTimeout(function() {
      assert(res.readableLength < 100 * 1024);
      process.exit(0);
    }, 2000);
  });
  req.end();
});

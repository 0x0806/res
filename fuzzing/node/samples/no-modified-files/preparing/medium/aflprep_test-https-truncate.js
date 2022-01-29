'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const https = require('https');
const key = fixtures.readKey('agent1-key.pem');
const cert = fixtures.readKey('agent1-cert.pem');
const data = Buffer.alloc(1024 * 32 + 1);
httpsTest();
function httpsTest() {
  const sopt = { key, cert };
  const server = https.createServer(sopt, function(req, res) {
    res.setHeader('content-length', data.length);
    res.end(data);
    server.close();
  });
  server.listen(0, function() {
    const opts = { port: this.address().port, rejectUnauthorized: false };
    https.get(opts).on('response', function(res) {
      test(res);
    });
  });
}
const test = common.mustCall(function(res) {
  res.on('end', common.mustCall(function() {
    assert.strictEqual(res.readableLength, 0);
    assert.strictEqual(bytes, data.length);
  }));
  let bytes = 0;
  res.on('data', function(chunk) {
    bytes += chunk.length;
    this.pause();
    setTimeout(() => { this.resume(); }, 1);
  });
});

'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const tls = require('tls');
const server = tls.createServer({
  key: fixtures.readKey('agent1-key.pem'),
  cert: fixtures.readKey('agent1-cert.pem'),
  rejectUnauthorized: true
}, function(c) {
}).listen(0, common.mustCall(function() {
  assert.throws(() => {
    tls.connect({
      port: this.address().port,
      ciphers: 'no-such-cipher'
    }, common.mustNotCall());
  server.close();
}));

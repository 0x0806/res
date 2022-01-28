'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const tls = require('tls');
const server = tls.createServer({
  key: fixtures.readKey('agent1-key.pem'),
  cert: fixtures.readKey('agent1-cert.pem')
}, function(c) {
}).listen(0, common.mustCall(function() {
  const c = tls.connect(this.address().port, common.mustNotCall());
  c.on('error', common.mustCall());
  c.on('close', common.mustCall(function(err) {
    assert.ok(err);
    server.close();
  }));
}));

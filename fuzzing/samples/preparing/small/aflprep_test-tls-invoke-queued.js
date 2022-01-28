'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const tls = require('tls');
let received = '';
const server = tls.createServer({
  key: fixtures.readKey('agent1-key.pem'),
  cert: fixtures.readKey('agent1-cert.pem')
}, common.mustCall(function(c) {
  c.write('hello ', null, common.mustCall(function() {
    c.write('world!', null, common.mustCall(function() {
      c.destroy();
    }));
    c.write(' gosh', null, common.mustCall());
  }));
  server.close();
})).listen(0, common.mustCall(function() {
  const c = tls.connect(this.address().port, {
    rejectUnauthorized: false
  }, common.mustCall(function() {
    c.on('data', function(chunk) {
      received += chunk;
    });
    c.on('end', common.mustCall(function() {
      assert.strictEqual(received, 'hello world! gosh');
    }));
  }));
}));

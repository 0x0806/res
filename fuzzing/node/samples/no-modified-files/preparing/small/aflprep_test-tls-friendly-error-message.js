'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const tls = require('tls');
const key = fixtures.readKey('agent1-key.pem');
const cert = fixtures.readKey('agent1-cert.pem');
tls.createServer({ key, cert }).on('connection', common.mustCall(function() {
  this.close();
})).listen(0, common.mustCall(function() {
  const options = { port: this.address().port, rejectUnauthorized: true };
  tls.connect(options).on('error', common.mustCall(function(err) {
    assert.strictEqual(err.code, 'UNABLE_TO_VERIFY_LEAF_SIGNATURE');
    assert.strictEqual(err.message, 'unable to verify the first certificate');
  }));
}));

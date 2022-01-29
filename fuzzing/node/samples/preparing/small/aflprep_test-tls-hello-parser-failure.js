'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const tls = require('tls');
const net = require('net');
const options = {
  key: fixtures.readKey('rsa_private.pem'),
  cert: fixtures.readKey('rsa_cert.crt')
};
const bonkers = Buffer.alloc(1024 * 1024, 42);
const server = tls.createServer(options, function(c) {
}).listen(0, common.mustCall(function() {
  const client = net.connect(this.address().port, common.mustCall(function() {
    client.write(bonkers);
  }));
  const writeAgain = setImmediate(function() {
    client.write(bonkers);
  });
  client.once('error', common.mustCall(function(err) {
    clearImmediate(writeAgain);
    client.destroy();
    server.close();
  }));
  client.on('close', common.mustCall(function(hadError) {
    assert.strictEqual(hadError, true);
  }));
}));

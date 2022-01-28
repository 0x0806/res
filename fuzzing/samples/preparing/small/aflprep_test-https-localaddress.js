'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
if (!common.hasMultiLocalhost())
  common.skip('platform-specific test.');
const assert = require('assert');
const https = require('https');
const options = {
  key: fixtures.readKey('agent1-key.pem'),
  cert: fixtures.readKey('agent1-cert.pem')
};
const server = https.createServer(options, function(req, res) {
  console.log(`Connect from: ${req.connection.remoteAddress}`);
  assert.strictEqual(req.connection.remoteAddress, '127.0.0.2');
  req.on('end', function() {
    res.end(`You are from: ${req.connection.remoteAddress}`);
  });
  req.resume();
});
server.listen(0, '127.0.0.1', function() {
  const options = {
    host: 'localhost',
    port: this.address().port,
    method: 'GET',
    localAddress: '127.0.0.2',
    rejectUnauthorized: false
  };
  const req = https.request(options, function(res) {
    res.on('end', function() {
      server.close();
    });
    res.resume();
  });
  req.end();
});
